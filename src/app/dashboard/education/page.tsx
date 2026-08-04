import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Education } from "@/lib/types";
import { deleteEducation, toggleEducationPublish } from "./actions";

export default async function EducationPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false, nullsFirst: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Education</h1>
        <Link
          href="/dashboard/education/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Entry
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {!entries || entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No education entries yet.</p>
          </div>
        ) : (
          (entries as Education[]).map((edu) => (
            <div
              key={edu.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">
                  {edu.degree} · {edu.institution}
                </p>
                <p className="text-xs text-neutral-500">
                  {edu.start_date ?? "—"} – {edu.end_date ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    edu.published
                      ? "bg-green-600/15 text-green-400"
                      : "bg-neutral-700/40 text-neutral-400"
                  }`}
                >
                  {edu.published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/dashboard/education/${edu.id}/edit`}
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Edit
                </Link>
                <form action={toggleEducationPublish}>
                  <input type="hidden" name="id" value={edu.id} />
                  <button type="submit" className="text-neutral-300 underline hover:text-white">
                    {edu.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteEducation}>
                  <input type="hidden" name="id" value={edu.id} />
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
