import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      ...(githubPagesBasePath
        ? { basePath: githubPagesBasePath, assetPrefix: githubPagesBasePath }
        : {}),
      images: { unoptimized: true },
      trailingSlash: true,
      typescript: { ignoreBuildErrors: true },
    }
  : {};

export default nextConfig;
