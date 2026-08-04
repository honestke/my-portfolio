"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import { FileDropzone } from "@/app/dashboard/projects/_components/FileDropzone";
import { MarkdownEditor } from "./MarkdownEditor";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  post?: BlogPost;
  error?: string;
  featuredImageUrl?: string | null;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function PostForm({ action, post, error, featuredImageUrl }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(post?.status ?? "draft");

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-3xl space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input id="title" name="title" type="text" required defaultValue={post?.title} className={inputClass} />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug (URL) — leave blank to auto-generate from title
        </label>
        <input id="slug" name="slug" type="text" defaultValue={post?.slug} className={inputClass} />
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          placeholder="A short summary shown on the blog list"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <input id="category" name="category" type="text" defaultValue={post?.category ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="tags" className={labelClass}>
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={post?.tags?.join(", ") ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <FileDropzone
        name="featured_image"
        label="Featured image"
        accept={{ "image/*": [] }}
        existingUrl={featuredImageUrl}
        removeFieldName="remove_featured_image"
      />

      <div>
        <label className={labelClass}>Content</label>
        <MarkdownEditor name="content" defaultValue={post?.content ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
        {status === "scheduled" && (
          <div>
            <label htmlFor="scheduled_for" className={labelClass}>
              Publish at
            </label>
            <input
              id="scheduled_for"
              name="scheduled_for"
              type="datetime-local"
              defaultValue={post?.scheduled_for ? post.scheduled_for.slice(0, 16) : ""}
              className={inputClass}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/blog")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
