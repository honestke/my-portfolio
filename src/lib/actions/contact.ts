"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    redirect("/contact?contact=error");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .insert({ name, email, subject, message });

  if (error) {
    redirect("/contact?contact=error");
  }

  redirect("/contact?contact=success");
}
