import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contentAssetUrl } from "@/lib/supabase/storage";
import { updatePaper } from "../../actions";
import { PaperForm } from "../../_components/PaperForm";

export default async function EditPaperPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: paper } = await supabase
    .from("research_papers")
    .select("*")
    .eq("id", id)
    .single();

  if (!paper) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit Research Paper</h1>
      <div className="mt-6">
        <PaperForm
          action={updatePaper}
          paper={paper}
          error={error}
          pdfUrl={contentAssetUrl(paper.pdf_path)}
        />
      </div>
    </div>
  );
}
