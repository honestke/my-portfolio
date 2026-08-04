"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkExperience } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  experience?: WorkExperience;
  error?: string;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function ExperienceForm({ action, experience, error }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? false);

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-2xl space-y-5">
      {experience && <input type="hidden" name="id" value={experience.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input id="company" name="company" type="text" required defaultValue={experience?.company} className={inputClass} />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            Role
          </label>
          <input id="role" name="role" type="text" required defaultValue={experience?.role} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location
        </label>
        <input id="location" name="location" type="text" defaultValue={experience?.location ?? ""} className={inputClass} />
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
            defaultValue={experience?.start_date ?? ""}
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
            disabled={isCurrent}
            defaultValue={experience?.end_date ?? ""}
            className={`${inputClass} disabled:opacity-50`}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          name="is_current"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
        />
        I currently work here
      </label>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={experience?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="achievements" className={labelClass}>
          Key achievements (one per line)
        </label>
        <textarea
          id="achievements"
          name="achievements"
          rows={4}
          defaultValue={experience?.achievements?.join("\n") ?? ""}
          placeholder={"Improved query performance by 40%\nLed a team of 3 analysts"}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="published" defaultChecked={experience?.published ?? false} />
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
          onClick={() => router.push("/dashboard/work-experience")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
