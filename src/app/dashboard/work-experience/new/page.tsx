import { createExperience } from "../actions";
import { ExperienceForm } from "../_components/ExperienceForm";

export default async function NewExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Work Experience</h1>
      <div className="mt-6">
        <ExperienceForm action={createExperience} error={error} />
      </div>
    </div>
  );
}
