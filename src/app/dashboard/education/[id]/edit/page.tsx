import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEducation } from "../../actions";
import { EducationForm } from "../../_components/EducationForm";

export default async function EditEducationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: education } = await supabase.from("education").select("*").eq("id", id).single();

  if (!education) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit Education Entry</h1>
      <div className="mt-6">
        <EducationForm action={updateEducation} education={education} error={error} />
      </div>
    </div>
  );
}
