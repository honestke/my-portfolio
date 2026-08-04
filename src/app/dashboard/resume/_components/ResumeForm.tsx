"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "@/lib/types";
import { FileDropzone } from "@/app/dashboard/projects/_components/FileDropzone";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  resume?: Resume;
  error?: string;
  fileUrl?: string | null;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function ResumeForm({ action, resume, error, fileUrl }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-xl space-y-5">
      {resume && <input type="hidden" name="id" value={resume.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="label" className={labelClass}>
          Label
        </label>
        <input
          id="label"
          name="label"
          type="text"
          required
          defaultValue={resume?.label}
          placeholder="General, Data Analyst, AI, Statistics..."
          className={inputClass}
        />
      </div>

      <FileDropzone
        name="file"
        label="Resume file (PDF)"
        accept={{ "application/pdf": [] }}
        existingUrl={fileUrl}
      />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="is_default" defaultChecked={resume?.is_default ?? false} />
        Default resume (shown first)
      </label>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="published" defaultChecked={resume?.published ?? false} />
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
          onClick={() => router.push("/dashboard/resume")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
