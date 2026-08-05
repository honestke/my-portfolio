import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GatewayGrid } from "@/components/GatewayGrid";

export default async function Home() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("github_username, linkedin_url")
    .eq("id", 1)
    .single();

  const githubUsername = settings?.github_username || "honestke";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Honest Co.",
    jobTitle: "Full Stack Developer & AI Integration Specialist",
    email: "honestmbeheze@gmail.com",
    url: "/",
    sameAs: settings?.linkedin_url ? [settings.linkedin_url] : [],
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgressBar />
      <Navbar />
      <Hero />

      <ScrollReveal className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
          Explore
        </h2>
        <p className="mb-10 font-display text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
          Where to next?
        </p>
        <GatewayGrid githubUsername={githubUsername} />
      </ScrollReveal>

      <footer className="border-t border-black/10 px-6 py-10 text-center dark:border-white/10">
        <p className="font-display text-sm font-semibold text-neutral-900 dark:text-white">
          Honest Co<span className="text-emerald">.</span>
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          © {new Date().getFullYear()} Honest Co. Built with Next.js &amp; Supabase.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block text-xs text-emerald underline underline-offset-2"
        >
          Get in touch
        </Link>
      </footer>
    </div>
  );
}
