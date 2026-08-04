import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ResearchPaper } from "@/lib/types";
import { deletePaper, togglePaperPublish } from "./actions";

export default async function ResearchPapersPage() {
  const supabase = await createClient();
  const { data: papers } = await supabase
    .from("research_papers")
    .select("*")
    .order("publish_date", { ascending: false, nullsFirst: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Research Papers</h1>
        <Link
          href="/dashboard/research-papers/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Paper
        </Link>
      </div>

      <div className="mt-8">
        {!papers || papers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No research papers yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Authors</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                {(papers as ResearchPaper[]).map((paper) => (
                  <tr key={paper.id}>
                    <td className="px-4 py-3 text-white">{paper.title}</td>
                    <td className="px-4 py-3 text-neutral-400">{paper.authors ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          paper.published
                            ? "bg-green-600/15 text-green-400"
                            : "bg-neutral-700/40 text-neutral-400"
                        }`}
                      >
                        {paper.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <Link
                          href={`/dashboard/research-papers/${paper.id}/edit`}
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <form action={togglePaperPublish}>
                          <input type="hidden" name="id" value={paper.id} />
                          <button type="submit" className="text-neutral-300 underline hover:text-white">
                            {paper.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deletePaper}>
                          <input type="hidden" name="id" value={paper.id} />
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
