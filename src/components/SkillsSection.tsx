import type { Skill } from "@/lib/types";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const key = skill.category ?? "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(skill);
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {Array.from(groups.entries()).map(([category, items]) => (
        <div key={category} className="glass-panel rounded-2xl p-6">
          <h3 className="font-display mb-4 text-sm font-semibold uppercase tracking-widest text-emerald">
            {category}
          </h3>
          <div className="space-y-4">
            {items.map((skill) => (
              <div key={skill.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-neutral-900 dark:text-white">{skill.name}</span>
                  <span className="text-neutral-500">{skill.proficiency}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
