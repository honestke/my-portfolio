"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readFields(formData: FormData) {
  return {
    name: (formData.get("name") as string).trim(),
    category: (formData.get("category") as string) || null,
    proficiency: Number(formData.get("proficiency")) || 80,
    published: formData.get("published") === "on",
  };
}

export async function createSkill(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").insert(readFields(formData));

  if (error) {
    redirect(`/dashboard/skills?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/portfolio");
}

export async function updateSkill(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase.from("skills").update(readFields(formData)).eq("id", id);

  if (error) {
    redirect(`/dashboard/skills?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/portfolio");
}

export async function deleteSkill(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("skills").delete().eq("id", id);

  revalidatePath("/dashboard/skills");
  revalidatePath("/portfolio");
}

export async function toggleSkillPublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("skills")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("skills").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/skills");
  revalidatePath("/portfolio");
}
