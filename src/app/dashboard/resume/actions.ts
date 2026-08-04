"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "pdf";
  const path = `resumes/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("content-assets").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

async function removeAssets(supabase: SupabaseClient, paths: (string | null)[]) {
  const toRemove = paths.filter((p): p is string => Boolean(p));
  if (toRemove.length === 0) return;
  await supabase.storage.from("content-assets").remove(toRemove);
}

export async function createResume(formData: FormData) {
  const supabase = await createClient();
  const label = (formData.get("label") as string).trim();
  const published = formData.get("published") === "on";
  const is_default = formData.get("is_default") === "on";

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    redirect(`/dashboard/resume/new?error=${encodeURIComponent("A file is required")}`);
  }

  const file_path = await uploadAsset(supabase, file as File);

  if (is_default) {
    await supabase.from("resumes").update({ is_default: false }).eq("is_default", true);
  }

  const { error } = await supabase.from("resumes").insert({ label, file_path, published, is_default });

  if (error) {
    redirect(`/dashboard/resume/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/resume");
  revalidatePath("/");
  redirect("/dashboard/resume");
}

export async function updateResume(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const label = (formData.get("label") as string).trim();
  const published = formData.get("published") === "on";
  const is_default = formData.get("is_default") === "on";

  const { data: existing } = await supabase
    .from("resumes")
    .select("file_path")
    .eq("id", id)
    .single();

  const file = formData.get("file") as File | null;
  let file_path = existing?.file_path ?? null;

  if (file && file.size > 0) {
    await removeAssets(supabase, [file_path]);
    file_path = await uploadAsset(supabase, file);
  }

  if (is_default) {
    await supabase.from("resumes").update({ is_default: false }).eq("is_default", true).neq("id", id);
  }

  const { error } = await supabase
    .from("resumes")
    .update({ label, file_path, published, is_default })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/resume/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/resume");
  revalidatePath("/");
  redirect("/dashboard/resume");
}

export async function deleteResume(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase.from("resumes").select("file_path").eq("id", id).single();

  if (existing) {
    await removeAssets(supabase, [existing.file_path]);
  }

  await supabase.from("resumes").delete().eq("id", id);

  revalidatePath("/dashboard/resume");
  revalidatePath("/");
}

export async function toggleResumePublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase.from("resumes").select("published").eq("id", id).single();

  if (existing) {
    await supabase.from("resumes").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/resume");
  revalidatePath("/");
}
