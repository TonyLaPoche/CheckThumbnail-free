import * as cheerio from "cheerio";

export interface OgMetadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  imageWidth: string | null;
  imageHeight: string | null;
  siteName: string | null;
  type: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  favicon: string | null;
  canonical: string | null;
  raw: Record<string, string>;
}

function resolveUrl(base: string, relative: string | undefined | null): string | null {
  if (!relative?.trim()) return null;
  try {
    return new URL(relative.trim(), base).href;
  } catch {
    return relative;
  }
}

function getMeta($: cheerio.CheerioAPI, selectors: string[]): string | null {
  for (const sel of selectors) {
    const el = $(sel).first();
    const content = el.attr("content") ?? el.attr("value") ?? el.text()?.trim();
    if (content) return content;
  }
  return null;
}

export function parseOgFromHtml(html: string, pageUrl: string): OgMetadata {
  const $ = cheerio.load(html);
  const raw: Record<string, string> = {};

  $("meta").each((_, el) => {
    const name = $(el).attr("name") ?? $(el).attr("property");
    const content = $(el).attr("content");
    if (name && content) raw[name] = content;
  });

  const title =
    getMeta($, ['meta[property="og:title"]', 'meta[name="twitter:title"]']) ??
    $("title").first().text()?.trim() ??
    null;

  const description =
    getMeta($, [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]) ?? null;

  const image = resolveUrl(
    pageUrl,
    getMeta($, [
      'meta[property="og:image"]',
      'meta[property="og:image:url"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ]),
  );

  const twitterImage = resolveUrl(
    pageUrl,
    getMeta($, ['meta[name="twitter:image"]', 'meta[name="twitter:image:src"]']),
  );

  const favicon = resolveUrl(
    pageUrl,
    $('link[rel="icon"]').attr("href") ??
      $('link[rel="shortcut icon"]').attr("href") ??
      "/favicon.ico",
  );

  const canonical = resolveUrl(pageUrl, $('link[rel="canonical"]').attr("href"));

  return {
    url: pageUrl,
    title,
    description,
    image,
    imageWidth: getMeta($, ['meta[property="og:image:width"]']),
    imageHeight: getMeta($, ['meta[property="og:image:height"]']),
    siteName: getMeta($, ['meta[property="og:site_name"]']),
    type: getMeta($, ['meta[property="og:type"]']),
    twitterCard: getMeta($, ['meta[name="twitter:card"]']),
    twitterTitle: getMeta($, ['meta[name="twitter:title"]']),
    twitterDescription: getMeta($, ['meta[name="twitter:description"]']),
    twitterImage,
    favicon,
    canonical,
    raw,
  };
}

export function displayTitle(meta: OgMetadata): string {
  return meta.twitterTitle ?? meta.title ?? meta.url;
}

export function displayDescription(meta: OgMetadata): string | null {
  return meta.twitterDescription ?? meta.description;
}

export function displayImage(meta: OgMetadata): string | null {
  return meta.twitterImage ?? meta.image;
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
