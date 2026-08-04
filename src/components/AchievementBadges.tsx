import { Trophy } from "lucide-react";

type Counts = {
  projects: number;
  certificates: number;
  papers: number;
  repos: number;
  yearsExperience: number;
};

function computeBadges(counts: Counts): string[] {
  const badges: string[] = [];

  if (counts.projects >= 20) badges.push("20+ Projects Shipped");
  else if (counts.projects >= 10) badges.push("10+ Projects Shipped");
  else if (counts.projects >= 5) badges.push("5+ Projects Shipped");

  if (counts.certificates >= 5) badges.push("Certified Professional");
  else if (counts.certificates >= 1) badges.push("Certified");

  if (counts.papers >= 1) badges.push("Published Researcher");

  if (counts.repos >= 10) badges.push("Active Open Source Contributor");

  if (counts.yearsExperience >= 5) badges.push(`${counts.yearsExperience}+ Years Experience`);
  else if (counts.yearsExperience >= 1) badges.push(`${counts.yearsExperience}+ Year${counts.yearsExperience > 1 ? "s" : ""} Experience`);

  return badges;
}

export function AchievementBadges({ counts }: { counts: Counts }) {
  const badges = computeBadges(counts);
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold"
        >
          <Trophy size={12} />
          {badge}
        </span>
      ))}
    </div>
  );
}
