import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { blogAssetUrl } from "@/lib/supabase/storage";
import { estimateReadingMinutes } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/site-url";
import type { BlogPost } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ShareButtons } from "@/components/ShareButtons";
import { BlogPostCard } from "@/components/BlogPostCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, featured_image_path")
    .eq("slug", slug)
    .single();

  if (!post) return {};

  const imageUrl = blogAssetUrl(post.featured_image_path);

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: imageUrl ? [imageUrl] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    notFound();
  }

  const typedPost = post as BlogPost;
  const imageUrl = blogAssetUrl(typedPost.featured_image_path);
  const date = typedPost.published_at
    ? new Date(typedPost.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const shareUrl = await absoluteUrl(`/blog/${typedPost.slug}`);

  const [{ data: related }, { data: prev }, { data: next }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .neq("id", typedPost.id)
      .or(
        [
          typedPost.category ? `category.eq.${typedPost.category}` : null,
          typedPost.tags.length > 0 ? `tags.ov.{${typedPost.tags.join(",")}}` : null,
        ]
          .filter(Boolean)
          .join(","),
      )
      .limit(3),
    typedPost.published_at
      ? supabase
          .from("blog_posts")
          .select("slug, title")
          .eq("status", "published")
          .lt("published_at", typedPost.published_at)
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    typedPost.published_at
      ? supabase
          .from("blog_posts")
          .select("slug, title")
          .eq("status", "published")
          .gt("published_at", typedPost.published_at)
          .order("published_at", { ascending: true })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
          {typedPost.category && <span className="text-emerald">{typedPost.category}</span>}
          {typedPost.category && date && <span>·</span>}
          {date && <span>{date}</span>}
          <span>·</span>
          <span>{estimateReadingMinutes(typedPost.content)} min read</span>
        </div>

        <h1 className="font-display mt-3 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          {typedPost.title}
        </h1>

        <div className="mt-6">
          <ShareButtons title={typedPost.title} url={shareUrl} />
        </div>

        {imageUrl && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={imageUrl} alt={typedPost.title} fill className="object-cover" />
          </div>
        )}

        <div className="mt-10">
          <MarkdownContent content={typedPost.content} />
        </div>

        {typedPost.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-black/10 pt-6 dark:border-white/10">
            {typedPost.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-neutral-600 hover:text-neutral-900 dark:border-white/10 dark:text-neutral-400 dark:hover:text-white"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-black/10 pt-6 dark:border-white/10 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="glass-panel rounded-xl p-4 transition hover:border-emerald/30"
            >
              <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                <ArrowLeft size={12} /> Previous
              </p>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">{prev.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="glass-panel rounded-xl p-4 text-right transition hover:border-emerald/30"
            >
              <p className="flex items-center justify-end gap-1.5 text-xs text-neutral-500">
                Next <ArrowRight size={12} />
              </p>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">{next.title}</p>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {related && related.length > 0 && (
          <div className="mt-16 border-t border-black/10 pt-10 dark:border-white/10">
            <h2 className="font-display mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
              Related posts
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {(related as BlogPost[]).map((relatedPost) => (
                <BlogPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
