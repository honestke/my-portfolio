"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ResearchPaper } from "@/lib/types";
import { FileDropzone } from "@/app/dashboard/projects/_components/FileDropzone";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  paper?: ResearchPaper;
  error?: string;
  pdfUrl?: string | null;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function PaperForm({ action, paper, error, pdfUrl }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-2xl space-y-5">
      {paper && <input type="hidden" name="id" value={paper.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input id="title" name="title" type="text" required defaultValue={paper?.title} className={inputClass} />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug (URL) — leave blank to auto-generate from title
        </label>
        <input id="slug" name="slug" type="text" defaultValue={paper?.slug} className={inputClass} />
      </div>

      <div>
        <label htmlFor="abstract" className={labelClass}>
          Abstract
        </label>
        <textarea
          id="abstract"
          name="abstract"
          rows={5}
          defaultValue={paper?.abstract ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="authors" className={labelClass}>
            Authors
          </label>
          <input
            id="authors"
            name="authors"
            type="text"
            defaultValue={paper?.authors ?? ""}
            placeholder="Jane Doe, John Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="publish_date" className={labelClass}>
            Publish date
          </label>
          <input
            id="publish_date"
            name="publish_date"
            type="date"
            defaultValue={paper?.publish_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="keywords" className={labelClass}>
          Keywords (comma-separated)
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          defaultValue={paper?.keywords?.join(", ") ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="citation" className={labelClass}>
          Citation
        </label>
        <textarea
          id="citation"
          name="citation"
          rows={2}
          defaultValue={paper?.citation ?? ""}
          placeholder="APA / MLA formatted citation"
          className={inputClass}
        />
      </div>

      <FileDropzone
        name="pdf"
        label="PDF"
        accept={{ "application/pdf": [] }}
        existingUrl={pdfUrl}
        removeFieldName="remove_pdf"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="published" defaultChecked={paper?.published ?? false} />
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
          onClick={() => router.push("/dashboard/research-papers")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
