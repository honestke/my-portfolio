"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleRead(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { data: existing } = await supabase
    .from("contact_submissions")
    .select("read")
    .eq("id", id)
    .single();

  if (existing) {
    await supabase.from("contact_submissions").update({ read: !existing.read }).eq("id", id);
  }

  revalidatePath("/dashboard/contact-information");
}

export async function deleteSubmission(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("contact_submissions").delete().eq("id", id);

  revalidatePath("/dashboard/contact-information");
}
