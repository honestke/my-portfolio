"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateGithubUsername(formData: FormData) {
  const supabase = await createClient();
  const github_username = (formData.get("github_username") as string).trim();

  await supabase.from("site_settings").update({ github_username }).eq("id", 1);

  revalidatePath("/dashboard/github-repositories");
  revalidatePath("/");
}
