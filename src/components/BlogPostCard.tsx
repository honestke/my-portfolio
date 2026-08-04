import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { blogAssetUrl } from "@/lib/supabase/storage";
import { estimateReadingMinutes } from "@/lib/markdown";

export function BlogPostCard({ post }: { post: BlogPost }) {
  const imageUrl = blogAssetUrl(post.featured_image_path);
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition hover:border-emerald/30"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-600">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {post.category && <span className="text-emerald">{post.category}</span>}
          {post.category && date && <span>·</span>}
          {date && <span>{date}</span>}
          <span>·</span>
          <span>{estimateReadingMinutes(post.content)} min read</span>
        </div>

        <h3 className="font-display mt-3 text-lg font-semibold text-white">{post.title}</h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-neutral-400">{post.excerpt}</p>
        )}

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
