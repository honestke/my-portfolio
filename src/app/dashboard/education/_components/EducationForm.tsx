"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Education } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  education?: Education;
  error?: string;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function EducationForm({ action, education, error }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-2xl space-y-5">
      {education && <input type="hidden" name="id" value={education.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="institution" className={labelClass}>
          Institution
        </label>
        <input
          id="institution"
          name="institution"
          type="text"
          required
          defaultValue={education?.institution}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="degree" className={labelClass}>
            Degree
          </label>
          <input id="degree" name="degree" type="text" required defaultValue={education?.degree} className={inputClass} />
        </div>
        <div>
          <label htmlFor="field_of_study" className={labelClass}>
            Field of study
          </label>
          <input
            id="field_of_study"
            name="field_of_study"
            type="text"
            defaultValue={education?.field_of_study ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className={labelClass}>
            Start date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={education?.start_date ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="end_date" className={labelClass}>
            End date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={education?.end_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={education?.description ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="published" defaultChecked={education?.published ?? false} />
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
          onClick={() => router.push("/dashboard/education")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
