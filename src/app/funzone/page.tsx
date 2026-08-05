import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Gamepad2, Calculator, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { ProjectsGrid } from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Funzone",
  description: "Games, calculators, trading bot demos, and other interactive things built for fun.",
};

const categories = [
  {
    icon: Gamepad2,
    title: "Games",
    description: "2048, Tic-Tac-Toe, and Snake — playable right in your browser.",
    href: "/funzone/games",
  },
  {
    icon: Calculator,
    title: "Calculator",
    description: "A statistics calculator with descriptive stats and a t-test.",
    href: "/funzone/calculator",
  },
  {
    icon: TrendingUp,
    title: "Trading Bots",
    description: "A simulated moving-average crossover bot on synthetic price data.",
    href: "/funzone/trading-bots",
  },
];

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
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <h1 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
          Just for Fun
        </h1>
        <p className="mb-2 font-display text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          Funzone
        </p>
        <p className="mb-10 max-w-xl text-neutral-600 dark:text-neutral-400">
          Pick an activity — games, a calculator, or a simulated trading bot.
        </p>

        <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="glass-panel group flex flex-col rounded-2xl p-6 transition hover:border-emerald/40 hover:shadow-2xl hover:shadow-emerald/10"
              >
                <div className="flex items-center justify-between">
                  <span className="glass-panel flex h-11 w-11 items-center justify-center rounded-xl text-emerald">
                    <Icon size={20} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-neutral-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald dark:text-neutral-600"
                  />
                </div>
                <h3 className="font-display mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">{cat.description}</p>
              </Link>
            );
          })}
        </div>

        {funzoneProjects.length > 0 && (
          <>
            <h2 className="font-display mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
              More from the Funzone
            </h2>
            <ProjectsGrid projects={funzoneProjects} />
          </>
        )}
      </div>
    </div>
  );
}
