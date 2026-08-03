import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { projectAssetUrl } from "@/lib/supabase/storage";
import { updateProject } from "../../actions";
import { ProjectForm } from "../../_components/ProjectForm";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

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
      <h1 className="text-2xl font-semibold text-white">Edit Project</h1>
      <div className="mt-6">
        <ProjectForm
          action={updateProject}
          project={project}
          error={error}
          thumbnailUrl={projectAssetUrl(project.thumbnail_path)}
          fileUrl={projectAssetUrl(project.file_path)}
        />
      </div>
    </div>
  );
}
