import { OgFetchError } from "./fetch-errors";
import { parseOgFromHtml, type OgMetadata } from "./og-parser";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_CHARS = 2 * 1024 * 1024;

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
  } finally {
    clearTimeout(timeout);
  }
}

async function tryDirectFetch(targetUrl: string): Promise<FetchResult | null> {
  try {
    const response = await fetchWithTimeout(targetUrl, {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    if (!response.ok) return null;
    const html = await response.text();
    if (!html || html.length > MAX_HTML_CHARS) return null;
    return { html, finalUrl: response.url || targetUrl };
  } catch {
    return null;
  }
}

const CORS_PROXIES: ((url: string) => string)[] = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function tryProxyFetch(targetUrl: string): Promise<FetchResult | null> {
  for (const toProxyUrl of CORS_PROXIES) {
    try {
      const response = await fetchWithTimeout(toProxyUrl(targetUrl));
      if (!response.ok) continue;
      const html = await response.text();
      if (!html || html.length > MAX_HTML_CHARS) continue;
      if (!/<html/i.test(html) && !/<meta/i.test(html)) continue;
      return { html, finalUrl: targetUrl };
    } catch {
      continue;
    }
  }
  return null;
}

export async function fetchOgMetadata(inputUrl: string): Promise<OgMetadata> {
  let targetUrl: string;
  try {
    targetUrl = normalizeInputUrl(inputUrl);
    new URL(targetUrl);
  } catch {
    throw new OgFetchError("invalid_url");
  }

  const result = (await tryDirectFetch(targetUrl)) ?? (await tryProxyFetch(targetUrl));

  if (!result) {
    throw new OgFetchError("fetch_failed");
  }

  return parseOgFromHtml(result.html, result.finalUrl);
}
