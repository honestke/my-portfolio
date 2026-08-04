import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await absoluteUrl("");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
