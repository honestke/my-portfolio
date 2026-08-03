import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectsGrid } from "@/components/ProjectsGrid";

export default async function Home() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("project_date", { ascending: false, nullsFirst: false });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
          Selected Work
        </h2>
        <p className="mb-10 font-display text-3xl font-semibold text-white sm:text-4xl">
          Projects
        </p>

        {!projects || projects.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-sm text-neutral-500">Projects coming soon.</p>
          </div>
        ) : (
          <ProjectsGrid projects={projects as Project[]} />
        )}
      </section>

      <footer
        id="contact"
        className="border-t border-white/10 px-6 py-16 text-center"
      >
        <p className="font-display text-2xl font-semibold text-white">
          Let&apos;s work together
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-400">
          Reach out for collaborations, opportunities, or just to say hello.
        </p>
        <a
          href="mailto:honestmbeheze@gmail.com"
          className="mt-6 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:brightness-110"
        >
          honestmbeheze@gmail.com
        </a>
      </footer>
    </div>
  );
}
