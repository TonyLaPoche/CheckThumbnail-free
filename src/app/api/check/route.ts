import { NextRequest, NextResponse } from "next/server";
import { parseOgFromHtml } from "@/lib/og-parser";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;

function normalizeInputUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const rawUrl = body.url?.trim();
  if (!rawUrl) {
    return NextResponse.json({ error: "URL requise." }, { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = normalizeInputUrl(rawUrl);
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "URL invalide." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Impossible de récupérer la page (HTTP ${response.status}).` },
        { status: 502 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json(
        { error: "La réponse n'est pas une page HTML." },
        { status: 422 },
      );
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_HTML_BYTES) {
      return NextResponse.json({ error: "Page HTML trop volumineuse." }, { status: 413 });
    }

    const html = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    const finalUrl = response.url || targetUrl;
    const metadata = parseOgFromHtml(html, finalUrl);

    return NextResponse.json({ metadata });
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Délai dépassé lors de la récupération de l'URL."
        : err instanceof Error
          ? err.message
          : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
