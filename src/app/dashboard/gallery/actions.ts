"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `gallery/${crypto.randomUUID()}.${ext}`;
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

export async function createGalleryImage(formData: FormData) {
  const supabase = await createClient();
  const title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const category = (formData.get("category") as string) || null;
  const published = formData.get("published") === "on";

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) {
    redirect(`/dashboard/gallery/new?error=${encodeURIComponent("An image is required")}`);
  }

  const image_path = await uploadAsset(supabase, file as File);

  const { error } = await supabase
    .from("gallery_images")
    .insert({ title, description, category, published, image_path });

  if (error) {
    redirect(`/dashboard/gallery/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");
  redirect("/dashboard/gallery");
}

export async function deleteGalleryImage(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("gallery_images")
    .select("image_path")
    .eq("id", id)
    .single();

  if (existing) {
    await removeAssets(supabase, [existing.image_path]);
  }

  await supabase.from("gallery_images").delete().eq("id", id);

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");
}

export async function toggleGalleryPublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("gallery_images")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("gallery_images").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath("/");
}
