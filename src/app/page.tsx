import { ArrowRight, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchGitHubRepos } from "@/lib/github";
import type { GalleryImage, Project, YoutubeVideo } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { MasonryGallery } from "@/components/MasonryGallery";
import { GitHubRepoCard } from "@/components/GitHubRepoCard";
import { YoutubeVideoCard } from "@/components/YoutubeVideoCard";
import { ContactForm } from "@/components/ContactForm";
import { TrackedLink } from "@/components/TrackedLink";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ contact?: string }>;
}) {
  const { contact } = await searchParams;
  const supabase = await createClient();

  const [
    { data: projects },
    { data: galleryImages },
    { data: videos },
    { data: settings },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("project_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("gallery_images")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("youtube_videos")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  const repos = await fetchGitHubRepos(settings?.github_username);

  const allProjects = (projects ?? []) as Project[];
  const funzoneProjects = allProjects.filter((p) => p.category?.toLowerCase() === "funzone");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Honest Mbeheze",
    jobTitle: "Data Analyst & AI Integration Specialist",
    email: "honestmbeheze@gmail.com",
    url: "/",
    sameAs: settings?.linkedin_url ? [settings.linkedin_url] : [],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold text-neutral-900 dark:text-white">
              Skills, experience, projects &amp; more
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
              A complete, interview-ready look at my work — skills, experience, education,
              projects, certifications, and research.
            </p>
          </div>
          <a
            href="/portfolio"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
          >
            View Portfolio
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {funzoneProjects.length > 0 && (
        <section id="funzone" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
            Just for Fun
          </h2>
          <p className="mb-2 font-display text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
            Funzone
          </p>
          <p className="mb-10 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Games, calculators, dashboards, and other interactive things I&apos;ve built for fun.
          </p>
          <ProjectsGrid projects={funzoneProjects} />
        </section>
      )}

      {repos.length > 0 && (
        <section id="github" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
            Open Source
          </h2>
          <p className="mb-10 font-display text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
            GitHub Repositories
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <GitHubRepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>
      )}

      {galleryImages && galleryImages.length > 0 && (
        <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
            Visuals
          </h2>
          <p className="mb-10 font-display text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
            Gallery
          </p>
          <MasonryGallery images={galleryImages as GalleryImage[]} />
        </section>
      )}

      {videos && videos.length > 0 && (
        <section id="videos" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
            Watch
          </h2>
          <p className="mb-10 font-display text-3xl font-semibold text-neutral-900 dark:text-white sm:text-4xl">
            Videos
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(videos as YoutubeVideo[]).map((video) => (
              <YoutubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      <footer id="contact" className="border-t border-black/10 px-6 py-16 text-center dark:border-white/10">
        <p className="font-display text-2xl font-semibold text-neutral-900 dark:text-white">
          Let&apos;s work together
        </p>
        {settings?.linkedin_summary && (
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            {settings.linkedin_summary}
          </p>
        )}
        {!settings?.linkedin_summary && (
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            Reach out for collaborations, opportunities, or just to say hello.
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:honestmbeheze@gmail.com"
            className="inline-block rounded-full bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
          >
            honestmbeheze@gmail.com
          </a>
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
      </footer>
    </div>
  );
}
