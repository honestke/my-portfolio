import type { Metadata } from "next";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { contentAssetUrl } from "@/lib/supabase/storage";
import type {
  Certificate,
  Education,
  Project,
  ResearchPaper,
  Skill,
  WorkExperience,
} from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { ResearchPaperCard } from "@/components/ResearchPaperCard";
import { CertificateWall } from "@/components/CertificateWall";
import { SkillsSection } from "@/components/SkillsSection";
import { Timeline, type TimelineEntry } from "@/components/Timeline";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Skills, experience, education, projects, certifications, and research.",
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function dateRange(start: string | null, end: string | null, isCurrent?: boolean) {
  const startLabel = formatDate(start) ?? "—";
  const endLabel = isCurrent ? "Present" : (formatDate(end) ?? "—");
  return `${startLabel} – ${endLabel}`;
}

export default async function PortfolioPage() {
  const supabase = await createClient();

  const [
    { data: skills },
    { data: experience },
    { data: education },
    { data: projects },
    { data: certificates },
    { data: papers },
    { data: resumes },
  ] = await Promise.all([
    supabase.from("skills").select("*").eq("published", true).order("sort_order", { ascending: true }),
    supabase
      .from("work_experience")
      .select("*")
      .eq("published", true)
      .order("start_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("education")
      .select("*")
      .eq("published", true)
      .order("start_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("project_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("certificates")
      .select("*")
      .eq("published", true)
      .order("issue_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("research_papers")
      .select("*")
      .eq("published", true)
      .order("publish_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("resumes")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(1),
  ]);

  const mainProjects = ((projects ?? []) as Project[]).filter(
    (p) => p.category?.toLowerCase() !== "funzone",
  );

  const experienceEntries: TimelineEntry[] = ((experience ?? []) as WorkExperience[]).map((exp) => ({
    id: exp.id,
    title: exp.role,
    subtitle: exp.company + (exp.location ? ` · ${exp.location}` : ""),
    dateRange: dateRange(exp.start_date, exp.end_date, exp.is_current),
    description: exp.description,
    bullets: exp.achievements,
  }));

  const educationEntries: TimelineEntry[] = ((education ?? []) as Education[]).map((edu) => ({
    id: edu.id,
    title: `${edu.degree}${edu.field_of_study ? `, ${edu.field_of_study}` : ""}`,
    subtitle: edu.institution,
    dateRange: dateRange(edu.start_date, edu.end_date),
    description: edu.description,
  }));

  const defaultResume = resumes?.[0];
  const resumeUrl = defaultResume ? contentAssetUrl(defaultResume.file_path) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-8 dark:border-white/10">
          <div>
            <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              Portfolio
            </h1>
            <p className="mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
              Skills, experience, education, projects, certifications, and research — everything
              in one place.
            </p>
          </div>
          {resumeUrl && (
            <TrackedLink
              href={resumeUrl}
              download
              eventKind="download"
              eventTarget={`Resume: ${defaultResume?.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-medium text-black transition hover:brightness-110"
            >
              <Download size={14} />
              Download Resume
            </TrackedLink>
          )}
        </div>

        {skills && skills.length > 0 && (
          <section className="pt-16">
            <h2 className="font-display mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">
              Skills
            </h2>
            <SkillsSection skills={skills as Skill[]} />
          </section>
        )}

        {experienceEntries.length > 0 && (
          <section className="pt-16">
            <h2 className="font-display mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">
              Work Experience
            </h2>
            <Timeline entries={experienceEntries} />
          </section>
        )}

        {educationEntries.length > 0 && (
          <section className="pt-16">
            <h2 className="font-display mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">
              Education
            </h2>
            <Timeline entries={educationEntries} />
          </section>
        )}

        <section className="pt-16">
          <h2 className="font-display mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">
            Projects
          </h2>
          {mainProjects.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <p className="text-sm text-neutral-500">Projects coming soon.</p>
            </div>
          ) : (
            <ProjectsGrid projects={mainProjects} />
          )}
        </section>

        {certificates && certificates.length > 0 && (
          <section className="pt-16">
            <h2 className="font-display mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">
              Certifications
            </h2>
            <CertificateWall certificates={certificates as Certificate[]} />
          </section>
        )}

        {papers && papers.length > 0 && (
          <section className="pt-16">
            <h2 className="font-display mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">
              Research Papers
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {(papers as ResearchPaper[]).map((paper) => (
                <ResearchPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
