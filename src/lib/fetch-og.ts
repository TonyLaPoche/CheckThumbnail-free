import { OgFetchError } from "./fetch-errors";
import { parseOgFromHtml, type OgMetadata } from "./og-parser";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_CHARS = 2 * 1024 * 1024;

export type ScanPhase =
  | "validating"
  | "fetching_direct"
  | "fetching_proxy"
  | "parsing"
  | "done";

export type ProgressCallback = (progress: number, phase: ScanPhase) => void;

export function normalizeInputUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

type FetchResult = { html: string; finalUrl: string };

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new OgFetchError("timeout");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function isLikelyCorsError(err: unknown): boolean {
  if (!(err instanceof TypeError)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("cors");
}

type DirectFetchOutcome =
  | { ok: true; result: FetchResult }
  | { ok: false; corsBlocked: boolean };

async function tryDirectFetch(targetUrl: string): Promise<DirectFetchOutcome> {
  try {
    const response = await fetchWithTimeout(targetUrl, {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    if (!response.ok) return { ok: false, corsBlocked: false };
    const html = await response.text();
    if (!html || html.length > MAX_HTML_CHARS) return { ok: false, corsBlocked: false };
    return {
      ok: true,
      result: { html, finalUrl: response.url || targetUrl },
    };
  } catch (err) {
    if (err instanceof OgFetchError) throw err;
    return { ok: false, corsBlocked: isLikelyCorsError(err) };
  }
}

const CORS_PROXIES: ((url: string) => string)[] = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function tryProxyFetch(
  targetUrl: string,
  onProxyAttempt?: (index: number, total: number) => void,
): Promise<FetchResult | null> {
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    onProxyAttempt?.(i, CORS_PROXIES.length);
    const toProxyUrl = CORS_PROXIES[i];
    try {
      const response = await fetchWithTimeout(toProxyUrl(targetUrl));
      if (!response.ok) continue;
      const html = await response.text();
      if (!html || html.length > MAX_HTML_CHARS) continue;
      if (!/<html/i.test(html) && !/<meta/i.test(html)) continue;
      return { html, finalUrl: targetUrl };
    } catch (err) {
      if (err instanceof OgFetchError) throw err;
      continue;
    }
  }
  return null;
}

export async function fetchOgMetadata(
  inputUrl: string,
  onProgress?: ProgressCallback,
): Promise<OgMetadata> {
  const report = (progress: number, phase: ScanPhase) => onProgress?.(progress, phase);

  report(0, "validating");

  const trimmed = inputUrl.trim();
  if (!trimmed) {
    throw new OgFetchError("invalid_url");
  }

  let targetUrl: string;
  try {
    targetUrl = normalizeInputUrl(trimmed);
    const parsed = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new OgFetchError("unsupported_protocol");
    }
  } catch (err) {
    if (err instanceof OgFetchError) throw err;
    throw new OgFetchError("invalid_url");
  }

  report(12, "validating");

  report(18, "fetching_direct");
  const directOutcome = await tryDirectFetch(targetUrl);

  report(42, "fetching_direct");

  if (directOutcome.ok) {
    report(88, "parsing");
    const metadata = parseOgFromHtml(
      directOutcome.result.html,
      directOutcome.result.finalUrl,
    );
    report(100, "done");
    return metadata;
  }

  const directFailedWithCors = directOutcome.corsBlocked;

  report(48, "fetching_proxy");
  const proxyProgressStart = 48;
  const proxyProgressEnd = 82;
  const proxyResult = await tryProxyFetch(targetUrl, (index, total) => {
    const slice = (proxyProgressEnd - proxyProgressStart) / total;
    report(Math.round(proxyProgressStart + slice * (index + 0.5)), "fetching_proxy");
  });

  report(85, "fetching_proxy");

  if (proxyResult) {
    report(92, "parsing");
    const metadata = parseOgFromHtml(proxyResult.html, proxyResult.finalUrl);
    report(100, "done");
    return metadata;
  }

  throw new OgFetchError(directFailedWithCors ? "cors_blocked" : "fetch_failed");
}
