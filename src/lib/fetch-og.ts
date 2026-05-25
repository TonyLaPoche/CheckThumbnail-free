import { OgFetchError } from "./fetch-errors";
import { parseOgFromHtml, type OgMetadata } from "./og-parser";

const SCAN_MAX_MS = 60_000;
const SCAN_SLOW_MS = 12_000;
const MAX_HTML_CHARS = 2 * 1024 * 1024;

export type ScanPhase =
  | "validating"
  | "fetching_direct"
  | "fetching_proxy"
  | "slow_wait"
  | "parsing"
  | "done";

export type SlowReason = "video" | "proxy" | "heavy";

export type ProgressExtras = { slowReason?: SlowReason };

export type ProgressCallback = (
  progress: number,
  phase: ScanPhase,
  extras?: ProgressExtras,
) => void;

export function normalizeInputUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

type FetchResult = { html: string; finalUrl: string };

type ScanContext = {
  scanStart: number;
  deadline: number;
  targetUrl: string;
  report: ProgressCallback;
  slowTimer: ReturnType<typeof setInterval> | null;
  activePhase: ScanPhase;
  baseProgress: number;
};

function detectSlowReason(url: string, phase: ScanPhase): SlowReason {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (
      host.includes("youtube.com") ||
      host === "youtu.be" ||
      host.includes("vimeo.com") ||
      host.includes("dailymotion.com") ||
      host.includes("twitch.tv") ||
      host.includes("tiktok.com") ||
      host.includes("netflix.com")
    ) {
      return "video";
    }
  } catch {
    /* ignore */
  }
  if (phase === "fetching_proxy") return "proxy";
  return "heavy";
}

function progressWhileWaiting(ctx: ScanContext): number {
  const elapsed = Date.now() - ctx.scanStart;
  if (elapsed < SCAN_SLOW_MS) return ctx.baseProgress;
  const ratio = (elapsed - SCAN_SLOW_MS) / (SCAN_MAX_MS - SCAN_SLOW_MS);
  return Math.min(94, Math.round(ctx.baseProgress + ratio * (94 - ctx.baseProgress)));
}

function stopSlowWatcher(ctx: ScanContext) {
  if (ctx.slowTimer) {
    clearInterval(ctx.slowTimer);
    ctx.slowTimer = null;
  }
}

function startSlowWatcher(ctx: ScanContext, phase: ScanPhase, baseProgress: number) {
  ctx.activePhase = phase;
  ctx.baseProgress = baseProgress;
  stopSlowWatcher(ctx);

  ctx.slowTimer = setInterval(() => {
    const elapsed = Date.now() - ctx.scanStart;
    if (elapsed >= SCAN_MAX_MS) return;
    if (elapsed >= SCAN_SLOW_MS) {
      ctx.report(progressWhileWaiting(ctx), "slow_wait", {
        slowReason: detectSlowReason(ctx.targetUrl, phase),
      });
    }
  }, 400);
}

function assertWithinDeadline(ctx: ScanContext) {
  if (Date.now() >= ctx.deadline) {
    throw new OgFetchError("timeout");
  }
}

async function fetchWithDeadline(
  url: string,
  ctx: ScanContext,
  init?: RequestInit,
): Promise<Response> {
  assertWithinDeadline(ctx);

  const remaining = ctx.deadline - Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), remaining);

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

async function tryDirectFetch(
  targetUrl: string,
  ctx: ScanContext,
): Promise<DirectFetchOutcome> {
  try {
    const response = await fetchWithDeadline(targetUrl, ctx, {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    if (!response.ok) return { ok: false, corsBlocked: false };
    const html = await response.text();
    assertWithinDeadline(ctx);
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
  ctx: ScanContext,
  onProxyAttempt?: (index: number, total: number) => void,
): Promise<FetchResult | null> {
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    assertWithinDeadline(ctx);
    onProxyAttempt?.(i, CORS_PROXIES.length);
    const toProxyUrl = CORS_PROXIES[i];
    try {
      const response = await fetchWithDeadline(toProxyUrl(targetUrl), ctx);
      if (!response.ok) continue;
      const html = await response.text();
      assertWithinDeadline(ctx);
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
  const report = (progress: number, phase: ScanPhase, extras?: ProgressExtras) =>
    onProgress?.(progress, phase, extras);

  const ctx: ScanContext = {
    scanStart: Date.now(),
    deadline: Date.now() + SCAN_MAX_MS,
    targetUrl: "",
    report,
    slowTimer: null,
    activePhase: "validating",
    baseProgress: 0,
  };

  try {
    report(0, "validating");

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      throw new OgFetchError("invalid_url");
    }

    let targetUrl: string;
    try {
      targetUrl = normalizeInputUrl(trimmed);
      ctx.targetUrl = targetUrl;
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
    startSlowWatcher(ctx, "fetching_direct", 18);
    const directOutcome = await tryDirectFetch(targetUrl, ctx);
    stopSlowWatcher(ctx);

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
    startSlowWatcher(ctx, "fetching_proxy", 48);
    const proxyProgressStart = 48;
    const proxyProgressEnd = 82;
    const proxyResult = await tryProxyFetch(targetUrl, ctx, (index, total) => {
      const slice = (proxyProgressEnd - proxyProgressStart) / total;
      report(Math.round(proxyProgressStart + slice * (index + 0.5)), "fetching_proxy");
    });
    stopSlowWatcher(ctx);

    report(85, "fetching_proxy");

    if (proxyResult) {
      report(92, "parsing");
      const metadata = parseOgFromHtml(proxyResult.html, proxyResult.finalUrl);
      report(100, "done");
      return metadata;
    }

    throw new OgFetchError(directFailedWithCors ? "cors_blocked" : "fetch_failed");
  } finally {
    stopSlowWatcher(ctx);
  }
}
