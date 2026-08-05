import type { Metadata } from "next";
import { ExternalLink, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — reach out for collaborations, opportunities, or just to say hello.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ contact?: string }>;
}) {
  const { contact } = await searchParams;
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("linkedin_url, linkedin_summary")
    .eq("id", 1)
    .single();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center">
        <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          Let&apos;s work together
        </h1>
        <p className="mx-auto mt-3 max-w-md text-neutral-600 dark:text-neutral-400">
          {settings?.linkedin_summary ??
            "Reach out for collaborations, opportunities, or just to say hello."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:honestmbeheze@gmail.com"
            className="inline-block rounded-full bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
          >
            honestmbeheze@gmail.com
          </a>
          <TrackedLink
            href="https://wa.me/254718880567"
            target="_blank"
            rel="noreferrer"
            eventKind="outbound_click"
            eventTarget="https://wa.me/254718880567"
            className="glass-panel inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-neutral-900 transition hover:border-emerald/40 dark:text-white"
          >
            <MessageCircle size={14} />
            WhatsApp
          </TrackedLink>
          {settings?.linkedin_url && (
            <TrackedLink
              href={settings.linkedin_url}
              target="_blank"
              rel="noreferrer"
              eventKind="outbound_click"
              eventTarget={settings.linkedin_url}
              className="glass-panel inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-neutral-900 transition hover:border-emerald/40 dark:text-white"
            >
              <ExternalLink size={14} />
              LinkedIn
            </TrackedLink>
          )}
        </div>

        <ContactForm status={contact === "success" ? "success" : contact === "error" ? "error" : undefined} />
      </div>
    </div>
  );
}
