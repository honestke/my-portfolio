"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractYouTubeId } from "@/lib/markdown";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `youtube/${crypto.randomUUID()}.${ext}`;
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

async function fetchOEmbedTitle(videoUrl: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.title ?? null;
  } catch {
    return null;
  }
}

export async function createVideo(formData: FormData) {
  const supabase = await createClient();
  const video_url = (formData.get("video_url") as string).trim();
  const video_id = extractYouTubeId(video_url);
  let title = (formData.get("title") as string) || null;
  const description = (formData.get("description") as string) || null;
  const published_at = (formData.get("published_at") as string) || null;
  const published = formData.get("published") === "on";

  if (!title) {
    title = await fetchOEmbedTitle(video_url);
  }

  const file = formData.get("thumbnail") as File | null;
  let thumbnail_path: string | null = null;
  if (file && file.size > 0) {
    thumbnail_path = await uploadAsset(supabase, file);
  }

  const { error } = await supabase.from("youtube_videos").insert({
    video_url,
    video_id,
    title,
    description,
    thumbnail_path,
    published_at,
    published,
  });

  if (error) {
    redirect(`/dashboard/youtube-videos/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/youtube-videos");
  revalidatePath("/");
  redirect("/dashboard/youtube-videos");
}

export async function deleteVideo(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("youtube_videos")
    .select("thumbnail_path")
    .eq("id", id)
    .single();

  if (existing) {
    await removeAssets(supabase, [existing.thumbnail_path]);
  }

  await supabase.from("youtube_videos").delete().eq("id", id);

  revalidatePath("/dashboard/youtube-videos");
  revalidatePath("/");
}

export async function toggleVideoPublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("youtube_videos")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("youtube_videos").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/youtube-videos");
  revalidatePath("/");
}
