import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/ProjectCard";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Preview</h1>
        <Link
          href={`/dashboard/projects/${project.id}/edit`}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Back to edit
        </Link>
      </div>

      <p className="mt-2 text-sm text-neutral-400">
        This is exactly how the project card will look on the public site.
        {!project.published && " It's currently a draft, so it's not visible to visitors yet."}
      </p>

      <div className="mt-8 max-w-sm">
        <ProjectCard project={project} />
      </div>
    </div>
  );
}
