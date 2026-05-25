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

function metaContent(doc: Document, selector: string): string | null {
  const el = doc.querySelector(selector);
  const content = el?.getAttribute("content")?.trim();
  return content || null;
}

function firstMeta(
  doc: Document,
  selectors: string[],
): string | null {
  for (const sel of selectors) {
    const value = metaContent(doc, sel);
    if (value) return value;
  }
  return null;
}

export function parseOgFromHtml(html: string, pageUrl: string): OgMetadata {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const raw: Record<string, string> = {};

  doc.querySelectorAll("meta").forEach((el) => {
    const name = el.getAttribute("name") ?? el.getAttribute("property");
    const content = el.getAttribute("content");
    if (name && content) raw[name] = content;
  });

  const title =
    firstMeta(doc, ['meta[property="og:title"]', 'meta[name="twitter:title"]']) ??
    doc.querySelector("title")?.textContent?.trim() ??
    null;

  const description =
    firstMeta(doc, [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]) ?? null;

  const image = resolveUrl(
    pageUrl,
    firstMeta(doc, [
      'meta[property="og:image"]',
      'meta[property="og:image:url"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ]),
  );

  const twitterImage = resolveUrl(
    pageUrl,
    firstMeta(doc, ['meta[name="twitter:image"]', 'meta[name="twitter:image:src"]']),
  );

  const faviconEl =
    doc.querySelector('link[rel="icon"]') ?? doc.querySelector('link[rel="shortcut icon"]');
  const favicon = resolveUrl(pageUrl, faviconEl?.getAttribute("href") ?? "/favicon.ico");

  const canonical = resolveUrl(
    pageUrl,
    doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
  );

  return {
    url: pageUrl,
    title,
    description,
    image,
    imageWidth: firstMeta(doc, ['meta[property="og:image:width"]']),
    imageHeight: firstMeta(doc, ['meta[property="og:image:height"]']),
    siteName: firstMeta(doc, ['meta[property="og:site_name"]']),
    type: firstMeta(doc, ['meta[property="og:type"]']),
    twitterCard: firstMeta(doc, ['meta[name="twitter:card"]']),
    twitterTitle: firstMeta(doc, ['meta[name="twitter:title"]']),
    twitterDescription: firstMeta(doc, ['meta[name="twitter:description"]']),
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
