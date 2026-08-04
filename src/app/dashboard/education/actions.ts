"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  return {
    institution: (formData.get("institution") as string).trim(),
    degree: (formData.get("degree") as string).trim(),
    field_of_study: (formData.get("field_of_study") as string) || null,
    start_date: (formData.get("start_date") as string) || null,
    end_date: (formData.get("end_date") as string) || null,
    description: (formData.get("description") as string) || null,
    published: formData.get("published") === "on",
  };
}

export async function createEducation(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("education").insert(readFields(formData));

  if (error) {
    redirect(`/dashboard/education/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/education");
  revalidatePath("/portfolio");
  redirect("/dashboard/education");
}

export async function updateEducation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("education").update(readFields(formData)).eq("id", id);

  if (error) {
    redirect(`/dashboard/education/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/education");
  revalidatePath("/portfolio");
  redirect("/dashboard/education");
}

export async function deleteEducation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("education").delete().eq("id", id);

  revalidatePath("/dashboard/education");
  revalidatePath("/portfolio");
}

export async function toggleEducationPublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("education")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("education").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/education");
  revalidatePath("/portfolio");
}
