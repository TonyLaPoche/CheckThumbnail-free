const repoName = "CheckThumbnail-free";
const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = isGhPages ? `/${repoName}` : "";

const defaultOrigin = "https://tonylapoche.github.io";

export const siteConfig = {
  name: "Check Thumbnail",
  repoName,
  basePath,
  origin: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? `${defaultOrigin}${basePath}`,
  author: "Antoine Terrade",
  portfolioUrl: "https://antoineterrade.com",
} as const;

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.origin.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
