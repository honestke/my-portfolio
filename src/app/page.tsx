import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchGitHubRepos } from "@/lib/github";
import type { BlogPost, Certificate, Project, ResearchPaper, Skill } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PreviewSectionHeader } from "@/components/PreviewSectionHeader";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { ResearchPaperCard } from "@/components/ResearchPaperCard";
import { CertificateWall } from "@/components/CertificateWall";
import { BlogPostCard } from "@/components/BlogPostCard";
import { GitHubRepoCard } from "@/components/GitHubRepoCard";
import { PortfolioStats, type PortfolioStat } from "@/components/PortfolioStats";
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
    { data: skills },
    { data: certificates },
    { data: papers },
    { data: posts },
    { data: settings },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("project_date", { ascending: false, nullsFirst: false }),
    supabase.from("skills").select("*").eq("published", true).order("sort_order", { ascending: true }),
    supabase
      .from("certificates")
      .select("*")
      .eq("published", true)
      .order("issue_date", { ascending: false, nullsFirst: false })
      .limit(3),
    supabase
      .from("research_papers")
      .select("*")
      .eq("published", true)
      .order("publish_date", { ascending: false, nullsFirst: false })
      .limit(2),
    supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  const repos = (await fetchGitHubRepos(settings?.github_username)).slice(0, 3);

  const allProjects = (projects ?? []) as Project[];
  const mainProjects = allProjects.filter((p) => p.category?.toLowerCase() !== "funzone");
  const funzoneProjects = allProjects.filter((p) => p.category?.toLowerCase() === "funzone").slice(0, 3);
  const featuredProjects = mainProjects.slice(0, 3);
  const skillsList = (skills ?? []) as Skill[];

  const stats: PortfolioStat[] = [
    { label: "Projects", value: mainProjects.length, icon: "projects" },
    { label: "Certifications", value: certificates?.length ?? 0, icon: "certificates" },
    { label: "Research Papers", value: papers?.length ?? 0, icon: "papers" },
    { label: "Skills", value: skillsList.length, icon: "skills" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Honest Mbeheze",
    jobTitle: "Full Stack Developer & AI Integration Specialist",
    email: "honestmbeheze@gmail.com",
    url: "/",
    sameAs: settings?.linkedin_url ? [settings.linkedin_url] : [],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgressBar />
      <Navbar />
      <Hero />

      <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
        <PreviewSectionHeader
          kicker="Overview"
          title="Portfolio at a Glance"
          href="/portfolio"
          linkLabel="Explore Full Portfolio"
        />
        <PortfolioStats stats={stats} />
      </ScrollReveal>

      {featuredProjects.length > 0 && (
        <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader
            kicker="Selected Work"
            title="Featured Projects"
            href="/portfolio"
            linkLabel="View All Projects"
          />
          <ProjectsGrid projects={featuredProjects} />
        </ScrollReveal>
      )}

      {skillsList.length > 0 && (
        <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader kicker="Toolkit" title="Skills" href="/portfolio" linkLabel="View All Skills" />
          <div className="flex flex-wrap gap-3">
            {skillsList.slice(0, 10).map((skill) => (
              <div
                key={skill.id}
                className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:border-emerald/40"
              >
                <span className="text-neutral-900 dark:text-white">{skill.name}</span>
                <span className="text-xs text-emerald">{skill.proficiency}%</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {repos.length > 0 && (
        <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader
            kicker="Open Source"
            title="GitHub Activity"
            href={`https://github.com/${settings?.github_username ?? "honestke"}`}
            linkLabel="View GitHub Profile"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {repos.map((repo) => (
              <GitHubRepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </ScrollReveal>
      )}

      {papers && papers.length > 0 && (
        <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader
            kicker="Publications"
            title="Research"
            href="/portfolio"
            linkLabel="View All Research"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(papers as ResearchPaper[]).map((paper) => (
              <ResearchPaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        </ScrollReveal>
      )}

      {certificates && certificates.length > 0 && (
        <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader
            kicker="Credentials"
            title="Certifications"
            href="/portfolio"
            linkLabel="View All Certifications"
          />
          <CertificateWall certificates={certificates as Certificate[]} />
        </ScrollReveal>
      )}

      {funzoneProjects.length > 0 && (
        <ScrollReveal id="funzone" className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader kicker="Just for Fun" title="Funzone" href="/#funzone" linkLabel="Explore Funzone" />
          <ProjectsGrid projects={funzoneProjects} />
        </ScrollReveal>
      )}

      {posts && posts.length > 0 && (
        <ScrollReveal className="mx-auto max-w-6xl px-6 py-20">
          <PreviewSectionHeader kicker="Writing" title="Latest from the Blog" href="/blog" linkLabel="Read the Blog" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {(posts as BlogPost[]).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </ScrollReveal>
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
