import type { NextConfig } from "next";

const repoName = "CheckThumbnail-free";
const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = isGhPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
