import { createProject } from "../actions";
import { ProjectForm } from "../_components/ProjectForm";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Project</h1>
      <div className="mt-6">
        <ProjectForm action={createProject} error={error} />
      </div>
    </div>
  );
}
