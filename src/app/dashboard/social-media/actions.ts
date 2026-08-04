"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateLinkedIn(formData: FormData) {
  const supabase = await createClient();
  const linkedin_url = (formData.get("linkedin_url") as string) || null;
  const linkedin_summary = (formData.get("linkedin_summary") as string) || null;

  await supabase.from("site_settings").update({ linkedin_url, linkedin_summary }).eq("id", 1);

  revalidatePath("/dashboard/social-media");
  revalidatePath("/");
}
