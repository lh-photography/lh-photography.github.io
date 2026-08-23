import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lh-photography.github.io").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-08-23"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
