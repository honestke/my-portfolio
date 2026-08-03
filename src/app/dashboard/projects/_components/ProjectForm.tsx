"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { FileDropzone } from "./FileDropzone";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project;
  error?: string;
  thumbnailUrl?: string | null;
  fileUrl?: string | null;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function ProjectForm({ action, project, error, thumbnailUrl, fileUrl }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="max-w-2xl space-y-5"
    >
      {project && <input type="hidden" name="id" value={project.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={project?.title}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug (URL) — leave blank to auto-generate from title
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={project?.slug}
          placeholder="my-project-name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={project?.category ?? ""}
            placeholder="Web App"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="project_date" className={labelClass}>
            Date
          </label>
          <input
            id="project_date"
            name="project_date"
            type="date"
            defaultValue={project?.project_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="technologies" className={labelClass}>
          Technologies (comma-separated)
        </label>
        <input
          id="technologies"
          name="technologies"
          type="text"
          defaultValue={project?.technologies?.join(", ") ?? ""}
          placeholder="React, TypeScript, Tailwind"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="demo_url" className={labelClass}>
            Demo / live URL
          </label>
          <input
            id="demo_url"
            name="demo_url"
            type="url"
            defaultValue={project?.demo_url ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="github_url" className={labelClass}>
            GitHub URL
          </label>
          <input
            id="github_url"
            name="github_url"
            type="url"
            defaultValue={project?.github_url ?? ""}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
      </div>

      <FileDropzone
        name="thumbnail"
        label="Thumbnail image"
        accept={{ "image/*": [] }}
        existingUrl={thumbnailUrl}
        removeFieldName="remove_thumbnail"
      />

      <FileDropzone
        name="file"
        label="Downloadable file (optional)"
        existingUrl={fileUrl}
        removeFieldName="remove_file"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? false}
        />
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
          onClick={() => router.push("/dashboard/projects")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
