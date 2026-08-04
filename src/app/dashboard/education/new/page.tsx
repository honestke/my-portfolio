import { createEducation } from "../actions";
import { EducationForm } from "../_components/EducationForm";

export default async function NewEducationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Education Entry</h1>
      <div className="mt-6">
        <EducationForm action={createEducation} error={error} />
      </div>
    </div>
  );
}
