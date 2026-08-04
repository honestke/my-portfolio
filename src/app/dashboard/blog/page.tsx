import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types";
import { deletePost } from "./actions";

const statusStyles: Record<string, string> = {
  published: "bg-green-600/15 text-green-400",
  scheduled: "bg-amber-600/15 text-amber-400",
  draft: "bg-neutral-700/40 text-neutral-400",
};

export default async function BlogListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Blog</h1>
        <Link
          href="/dashboard/blog/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Post
        </Link>
      </div>

      <div className="mt-8">
        {!posts || posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">
              No posts yet. Click &ldquo;New Post&rdquo; to write your first one.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                {(posts as BlogPost[]).map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-3 text-white">{post.title}</td>
                    <td className="px-4 py-3 text-neutral-400">{post.category ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[post.status]}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {new Date(post.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <Link
                          href={`/dashboard/blog/${post.id}/edit`}
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <form action={deletePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <button type="submit" className="text-red-400 underline hover:text-red-300">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
