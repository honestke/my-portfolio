"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  const is_current = formData.get("is_current") === "on";
  return {
    company: (formData.get("company") as string).trim(),
    role: (formData.get("role") as string).trim(),
    location: (formData.get("location") as string) || null,
    start_date: (formData.get("start_date") as string) || null,
    end_date: is_current ? null : (formData.get("end_date") as string) || null,
    is_current,
    description: (formData.get("description") as string) || null,
    achievements: ((formData.get("achievements") as string) || "")
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean),
    published: formData.get("published") === "on",
  };
}

export async function createExperience(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("work_experience").insert(readFields(formData));

  if (error) {
    redirect(`/dashboard/work-experience/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/work-experience");
  revalidatePath("/portfolio");
  redirect("/dashboard/work-experience");
}

export async function updateExperience(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("work_experience")
    .update(readFields(formData))
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/work-experience/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/work-experience");
  revalidatePath("/portfolio");
  redirect("/dashboard/work-experience");
}

export async function deleteExperience(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("work_experience").delete().eq("id", id);

  revalidatePath("/dashboard/work-experience");
  revalidatePath("/portfolio");
}

export async function toggleExperiencePublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("work_experience")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase
      .from("work_experience")
      .update({ published: !existing.published })
      .eq("id", id);
  }

  revalidatePath("/dashboard/work-experience");
  revalidatePath("/portfolio");
}
