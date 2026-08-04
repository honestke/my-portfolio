import { Award, BookOpen, Briefcase, FolderGit2, Sparkles } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

export type PortfolioStat = {
  label: string;
  value: number;
  suffix?: string;
  icon: "projects" | "certificates" | "papers" | "experience" | "skills";
};

const ICONS = {
  projects: FolderGit2,
  certificates: Award,
  papers: BookOpen,
  experience: Briefcase,
  skills: Sparkles,
};

export function PortfolioStats({ stats }: { stats: PortfolioStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon];
        return (
          <div key={stat.label} className="glass-panel rounded-2xl p-5 text-center">
            <Icon className="mx-auto mb-2 text-emerald" size={20} />
            <p className="font-display text-2xl font-bold text-neutral-900 dark:text-white">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs text-neutral-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
