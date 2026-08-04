import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contentAssetUrl } from "@/lib/supabase/storage";
import { updateResume } from "../../actions";
import { ResumeForm } from "../../_components/ResumeForm";

export default async function EditResumePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: resume } = await supabase.from("resumes").select("*").eq("id", id).single();

  if (!resume) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit Resume Version</h1>
      <div className="mt-6">
        <ResumeForm
          action={updateResume}
          resume={resume}
          error={error}
          fileUrl={contentAssetUrl(resume.file_path)}
        />
      </div>
    </div>
  );
}
