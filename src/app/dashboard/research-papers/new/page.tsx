import { createPaper } from "../actions";
import { PaperForm } from "../_components/PaperForm";

export default async function NewPaperPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Research Paper</h1>
      <div className="mt-6">
        <PaperForm action={createPaper} error={error} />
      </div>
    </div>
  );
}
