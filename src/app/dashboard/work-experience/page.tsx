import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { WorkExperience } from "@/lib/types";
import { deleteExperience, toggleExperiencePublish } from "./actions";

export default async function WorkExperiencePage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("work_experience")
    .select("*")
    .order("start_date", { ascending: false, nullsFirst: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Work Experience</h1>
        <Link
          href="/dashboard/work-experience/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Entry
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {!experiences || experiences.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No work experience yet.</p>
          </div>
        ) : (
          (experiences as WorkExperience[]).map((exp) => (
            <div
              key={exp.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">
                  {exp.role} · {exp.company}
                </p>
                <p className="text-xs text-neutral-500">
                  {exp.start_date ?? "—"} – {exp.is_current ? "Present" : (exp.end_date ?? "—")}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    exp.published
                      ? "bg-green-600/15 text-green-400"
                      : "bg-neutral-700/40 text-neutral-400"
                  }`}
                >
                  {exp.published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/dashboard/work-experience/${exp.id}/edit`}
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Edit
                </Link>
                <form action={toggleExperiencePublish}>
                  <input type="hidden" name="id" value={exp.id} />
                  <button type="submit" className="text-neutral-300 underline hover:text-white">
                    {exp.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteExperience}>
                  <input type="hidden" name="id" value={exp.id} />
                  <button type="submit" className="text-red-400 underline hover:text-red-300">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
