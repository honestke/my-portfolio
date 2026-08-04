import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Resume } from "@/lib/types";
import { deleteResume, toggleResumePublish } from "./actions";

export default async function ResumePage() {
  const supabase = await createClient();
  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Resume/CV</h1>
        <Link
          href="/dashboard/resume/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Version
        </Link>
      </div>

      <div className="mt-8">
        {!resumes || resumes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No resume versions yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium">Default</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                {(resumes as Resume[]).map((resume) => (
                  <tr key={resume.id}>
                    <td className="px-4 py-3 text-white">{resume.label}</td>
                    <td className="px-4 py-3 text-neutral-400">{resume.is_default ? "Yes" : "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          resume.published
                            ? "bg-green-600/15 text-green-400"
                            : "bg-neutral-700/40 text-neutral-400"
                        }`}
                      >
                        {resume.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <Link
                          href={`/dashboard/resume/${resume.id}/edit`}
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <form action={toggleResumePublish}>
                          <input type="hidden" name="id" value={resume.id} />
                          <button type="submit" className="text-neutral-300 underline hover:text-white">
                            {resume.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteResume}>
                          <input type="hidden" name="id" value={resume.id} />
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
