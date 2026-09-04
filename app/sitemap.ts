import type { MetadataRoute } from "next";
import { site, visible } from "@/content/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ["", "/work", "/film", "/about", "/contact"];
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}`, lastModified: now })),
    ...visible().map((c) => ({
      url: `${site.url}/work/${c.slug}`,
      lastModified: now,
    })),
  ];
}
