"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, folder: string, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("project-assets").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

async function removeAssets(supabase: SupabaseClient, paths: (string | null)[]) {
  const toRemove = paths.filter((p): p is string => Boolean(p));
  if (toRemove.length === 0) return;
  await supabase.storage.from("project-assets").remove(toRemove);
}

function readCommonFields(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const slugInput = (formData.get("slug") as string) || title;
  const description = (formData.get("description") as string) || null;
  const category = (formData.get("category") as string) || null;
  const technologies = ((formData.get("technologies") as string) || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const demo_url = (formData.get("demo_url") as string) || null;
  const github_url = (formData.get("github_url") as string) || null;
  const project_date = (formData.get("project_date") as string) || null;
  const published = formData.get("published") === "on";

  return {
    title,
    slug: slugify(slugInput),
    description,
    category,
    technologies,
    demo_url,
    github_url,
    project_date,
    published,
  };
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const fields = readCommonFields(formData);

  const thumbnailFile = formData.get("thumbnail") as File | null;
  const downloadFile = formData.get("file") as File | null;

  let thumbnail_path: string | null = null;
  let file_path: string | null = null;

  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnail_path = await uploadAsset(supabase, fields.slug, thumbnailFile);
  }
  if (downloadFile && downloadFile.size > 0) {
    file_path = await uploadAsset(supabase, fields.slug, downloadFile);
  }

  const { error } = await supabase.from("projects").insert({
    ...fields,
    thumbnail_path,
    file_path,
  });

  if (error) {
    redirect(`/dashboard/projects/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  redirect("/dashboard/projects");
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const fields = readCommonFields(formData);

  const { data: existing } = await supabase
    .from("projects")
    .select("thumbnail_path, file_path")
    .eq("id", id)
    .single();

  const thumbnailFile = formData.get("thumbnail") as File | null;
  const downloadFile = formData.get("file") as File | null;
  const removeThumbnail = formData.get("remove_thumbnail") === "on";
  const removeFile = formData.get("remove_file") === "on";

  let thumbnail_path = existing?.thumbnail_path ?? null;
  let file_path = existing?.file_path ?? null;

  if (thumbnailFile && thumbnailFile.size > 0) {
    await removeAssets(supabase, [thumbnail_path]);
    thumbnail_path = await uploadAsset(supabase, fields.slug, thumbnailFile);
  } else if (removeThumbnail) {
    await removeAssets(supabase, [thumbnail_path]);
    thumbnail_path = null;
  }

  if (downloadFile && downloadFile.size > 0) {
    await removeAssets(supabase, [file_path]);
    file_path = await uploadAsset(supabase, fields.slug, downloadFile);
  } else if (removeFile) {
    await removeAssets(supabase, [file_path]);
    file_path = null;
  }

  const { error } = await supabase
    .from("projects")
    .update({ ...fields, thumbnail_path, file_path })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/projects/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  redirect("/dashboard/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("projects")
    .select("thumbnail_path, file_path")
    .eq("id", id)
    .single();

  if (existing) {
    await removeAssets(supabase, [existing.thumbnail_path, existing.file_path]);
  }

  await supabase.from("projects").delete().eq("id", id);

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
}

export async function togglePublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("projects")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase
      .from("projects")
      .update({ published: !existing.published })
      .eq("id", id);
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/");
}
