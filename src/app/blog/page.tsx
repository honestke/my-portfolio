import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { BlogPostCard } from "@/components/BlogPostCard";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const { q, category, tag } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data: posts } = await query;

  const { data: allPosts } = await supabase.from("blog_posts").select("category, tags");
  const categories = Array.from(
    new Set((allPosts ?? []).map((p) => p.category).filter((c): c is string => Boolean(c))),
  );
  const tags = Array.from(new Set((allPosts ?? []).flatMap((p) => p.tags ?? [])));

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <h1 className="font-display text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">Blog</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Writing on data, engineering, and everything between.</p>

        <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center" action="/blog">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search posts..."
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-emerald dark:border-neutral-700 dark:bg-neutral-950 dark:text-white sm:max-w-xs"
          />
          <button
            type="submit"
            className="rounded-md bg-emerald px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
          >
            Search
          </button>
        </form>

        {(categories.length > 0 || tags.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  category === c
                    ? "border-emerald bg-emerald/15 text-emerald"
                    : "border-black/10 text-neutral-600 hover:text-neutral-900 dark:border-white/10 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {c}
              </Link>
            ))}
            {tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  tag === t
                    ? "border-emerald bg-emerald/15 text-emerald"
                    : "border-black/10 text-neutral-600 hover:text-neutral-900 dark:border-white/10 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                #{t}
              </Link>
            ))}
            {(category || tag || q) && (
              <Link
                href="/blog"
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:border-white/10 dark:hover:text-white"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {!posts || posts.length === 0 ? (
            <div className="glass-panel col-span-full rounded-2xl p-12 text-center">
              <p className="text-sm text-neutral-500">No posts found.</p>
            </div>
          ) : (
            (posts as BlogPost[]).map((post) => <BlogPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
