"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/app/dashboard/projects/_components/FileDropzone";
import { createGalleryImage } from "../actions";

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function GalleryImageForm({ error }: { error?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={createGalleryImage}
      onSubmit={() => setSubmitting(true)}
      className="mt-6 max-w-xl space-y-5"
    >
      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input id="title" name="title" type="text" className={inputClass} />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea id="description" name="description" rows={3} className={inputClass} />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <input id="category" name="category" type="text" className={inputClass} />
      </div>

      <FileDropzone name="image" label="Image" accept={{ "image/*": [] }} />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="published" />
        Published (visible on the public site)
      </label>

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
          onClick={() => router.push("/dashboard/gallery")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
