import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { ProjectsGrid } from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Funzone",
  description: "Games, calculators, dashboards, and other interactive things built for fun.",
};

export default async function FunzonePage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("project_date", { ascending: false, nullsFirst: false });

  const funzoneProjects = ((projects ?? []) as Project[]).filter(
    (p) => p.category?.toLowerCase() === "funzone",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <h1 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
          Just for Fun
        </h1>
        <p className="mb-2 font-display text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          Funzone
        </p>
        <p className="mb-10 max-w-xl text-neutral-600 dark:text-neutral-400">
          Games, calculators, dashboards, and other interactive things I&apos;ve built for fun.
        </p>

        {funzoneProjects.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-sm text-neutral-500">Nothing here yet — check back soon.</p>
          </div>
        ) : (
          <ProjectsGrid projects={funzoneProjects} />
        )}
      </div>
    </div>
  );
}
