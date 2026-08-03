import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { deleteProject, togglePublish } from "./actions";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Project
        </Link>
      </div>

      <div className="mt-8">
        {!projects || projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">
              No projects yet. Click &ldquo;New Project&rdquo; to add your first one.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                {(projects as Project[]).map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3 text-white">{project.title}</td>
                    <td className="px-4 py-3 text-neutral-400">
                      {project.category ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.published
                            ? "bg-green-600/15 text-green-400"
                            : "bg-neutral-700/40 text-neutral-400"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <Link
                          href={`/dashboard/projects/${project.id}/preview`}
                          className="text-neutral-300 underline hover:text-white"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <form action={togglePublish}>
                          <input type="hidden" name="id" value={project.id} />
                          <button
                            type="submit"
                            className="text-neutral-300 underline hover:text-white"
                          >
                            {project.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <button
                            type="submit"
                            className="text-red-400 underline hover:text-red-300"
                          >
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
