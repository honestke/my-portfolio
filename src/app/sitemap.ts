import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const base = await absoluteUrl("");

  const [{ data: posts }, { data: papers }] = await Promise.all([
    supabase.from("blog_posts").select("slug, updated_at").eq("status", "published"),
    supabase.from("research_papers").select("slug, updated_at").eq("published", true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const paperRoutes: MetadataRoute.Sitemap = (papers ?? []).map((paper) => ({
    url: `${base}/research/${paper.slug}`,
    lastModified: paper.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...paperRoutes];
}
