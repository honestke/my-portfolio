import { createResume } from "../actions";
import { ResumeForm } from "../_components/ResumeForm";

export default async function NewResumePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Resume Version</h1>
      <div className="mt-6">
        <ResumeForm action={createResume} error={error} />
      </div>
    </div>
  );
}
