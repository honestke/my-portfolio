"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function uploadAsset(supabase: SupabaseClient, file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `certificates/${crypto.randomUUID()}.${ext}`;
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
  return {
    title: (formData.get("title") as string).trim(),
    issuing_org: (formData.get("issuing_org") as string) || null,
    issue_date: (formData.get("issue_date") as string) || null,
    credential_id: (formData.get("credential_id") as string) || null,
    credential_url: (formData.get("credential_url") as string) || null,
    published: formData.get("published") === "on",
  };
}

export async function createCertificate(formData: FormData) {
  const supabase = await createClient();
  const fields = readFields(formData);

  const file = formData.get("file") as File | null;
  let file_path: string | null = null;
  if (file && file.size > 0) {
    file_path = await uploadAsset(supabase, file);
  }

  const { error } = await supabase.from("certificates").insert({ ...fields, file_path });

  if (error) {
    redirect(`/dashboard/certifications/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/certifications");
  revalidatePath("/");
  redirect("/dashboard/certifications");
}

export async function updateCertificate(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const fields = readFields(formData);

  const { data: existing } = await supabase
    .from("certificates")
    .select("file_path")
    .eq("id", id)
    .single();

  const file = formData.get("file") as File | null;
  const removeFile = formData.get("remove_file") === "on";
  let file_path = existing?.file_path ?? null;

  if (file && file.size > 0) {
    await removeAssets(supabase, [file_path]);
    file_path = await uploadAsset(supabase, file);
  } else if (removeFile) {
    await removeAssets(supabase, [file_path]);
    file_path = null;
  }

  const { error } = await supabase
    .from("certificates")
    .update({ ...fields, file_path })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/certifications/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/certifications");
  revalidatePath("/");
  redirect("/dashboard/certifications");
}

export async function deleteCertificate(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("certificates")
    .select("file_path")
    .eq("id", id)
    .single();

  if (existing) {
    await removeAssets(supabase, [existing.file_path]);
  }

  await supabase.from("certificates").delete().eq("id", id);

  revalidatePath("/dashboard/certifications");
  revalidatePath("/");
}

export async function toggleCertificatePublish(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("certificates")
    .select("published")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("certificates").update({ published: !existing.published }).eq("id", id);
  }

  revalidatePath("/dashboard/certifications");
  revalidatePath("/");
}
