import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateExperience } from "../../actions";
import { ExperienceForm } from "../../_components/ExperienceForm";

export default async function EditExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: experience } = await supabase
    .from("work_experience")
    .select("*")
    .eq("id", id)
    .single();

  if (!experience) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit Work Experience</h1>
      <div className="mt-6">
        <ExperienceForm action={updateExperience} experience={experience} error={error} />
      </div>
    </div>
  );
}
