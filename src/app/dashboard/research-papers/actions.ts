"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "pdf";
  const path = `research/${crypto.randomUUID()}.${ext}`;
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

function readFields(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const slugInput = (formData.get("slug") as string) || title;
  return {
    title,
    slug: slugify(slugInput),
    abstract: (formData.get("abstract") as string) || null,
    authors: (formData.get("authors") as string) || null,
    publish_date: (formData.get("publish_date") as string) || null,
    keywords: ((formData.get("keywords") as string) || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    citation: (formData.get("citation") as string) || null,
    published: formData.get("published") === "on",
  };
}

export async function createPaper(formData: FormData) {
  const supabase = await createClient();
  const fields = readFields(formData);

  const file = formData.get("pdf") as File | null;
  let pdf_path: string | null = null;
  if (file && file.size > 0) {
    pdf_path = await uploadAsset(supabase, file);
  }

  const { error } = await supabase.from("research_papers").insert({ ...fields, pdf_path });

  if (error) {
    redirect(`/dashboard/research-papers/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/research-papers");
  revalidatePath("/");
  redirect("/dashboard/research-papers");
}

export async function updatePaper(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const fields = readFields(formData);

  const { data: existing } = await supabase
    .from("research_papers")
    .select("pdf_path")
    .eq("id", id)
    .single();

  const file = formData.get("pdf") as File | null;
  const removeFile = formData.get("remove_pdf") === "on";
  let pdf_path = existing?.pdf_path ?? null;

  if (file && file.size > 0) {
    await removeAssets(supabase, [pdf_path]);
    pdf_path = await uploadAsset(supabase, file);
  } else if (removeFile) {
    await removeAssets(supabase, [pdf_path]);
    pdf_path = null;
  }

  const { error } = await supabase
    .from("research_papers")
    .update({ ...fields, pdf_path })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/research-papers/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/research-papers");
  revalidatePath("/");
  redirect("/dashboard/research-papers");
}

export async function deletePaper(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("research_papers")
    .select("pdf_path")
    .eq("id", id)
    .single();

  if (existing) {
    await removeAssets(supabase, [existing.pdf_path]);
  }

  await supabase.from("research_papers").delete().eq("id", id);

  revalidatePath("/dashboard/research-papers");
  revalidatePath("/");
}

export async function togglePaperPublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("research_papers")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("research_papers").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/research-papers");
  revalidatePath("/");
}
