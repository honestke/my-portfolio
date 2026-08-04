"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { blogAssetUrl } from "@/lib/supabase/storage";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, folder: string, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("blog-assets").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

async function removeAssets(supabase: SupabaseClient, paths: (string | null)[]) {
  const toRemove = paths.filter((p): p is string => Boolean(p));
  if (toRemove.length === 0) return;
  await supabase.storage.from("blog-assets").remove(toRemove);
}

export async function uploadInlineAsset(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };

  try {
    const path = await uploadAsset(supabase, "inline", file);
    const url = blogAssetUrl(path);
    return url ? { url } : { error: "Failed to resolve asset URL" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }
}

function readCommonFields(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const slugInput = (formData.get("slug") as string) || title;
  const excerpt = (formData.get("excerpt") as string) || null;
  const content = (formData.get("content") as string) || "";
  const category = (formData.get("category") as string) || null;
  const tags = ((formData.get("tags") as string) || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const status = (formData.get("status") as string) || "draft";
  const scheduledForRaw = formData.get("scheduled_for") as string;
  const scheduled_for =
    status === "scheduled" && scheduledForRaw ? new Date(scheduledForRaw).toISOString() : null;

  return {
    title,
    slug: slugify(slugInput),
    excerpt,
    content,
    category,
    tags,
    status,
    scheduled_for,
  };
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const fields = readCommonFields(formData);

  const imageFile = formData.get("featured_image") as File | null;
  let featured_image_path: string | null = null;
  if (imageFile && imageFile.size > 0) {
    featured_image_path = await uploadAsset(supabase, fields.slug, imageFile);
  }

  const published_at = fields.status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase.from("blog_posts").insert({
    ...fields,
    featured_image_path,
    published_at,
  });

  if (error) {
    redirect(`/dashboard/blog/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  redirect("/dashboard/blog");
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const fields = readCommonFields(formData);

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("featured_image_path, published_at, status")
    .eq("id", id)
    .single();

  const imageFile = formData.get("featured_image") as File | null;
  const removeImage = formData.get("remove_featured_image") === "on";
  let featured_image_path = existing?.featured_image_path ?? null;

  if (imageFile && imageFile.size > 0) {
    await removeAssets(supabase, [featured_image_path]);
    featured_image_path = await uploadAsset(supabase, fields.slug, imageFile);
  } else if (removeImage) {
    await removeAssets(supabase, [featured_image_path]);
    featured_image_path = null;
  }

  let published_at = existing?.published_at ?? null;
  if (fields.status === "published" && !published_at) {
    published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({ ...fields, featured_image_path, published_at })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/blog/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  redirect("/dashboard/blog");
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("featured_image_path")
    .eq("id", id)
    .single();

  if (existing) {
    await removeAssets(supabase, [existing.featured_image_path]);
  }

  await supabase.from("blog_posts").delete().eq("id", id);

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
}
