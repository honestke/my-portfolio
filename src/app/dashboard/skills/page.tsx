import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/lib/types";
import { SkillsManager } from "./_components/SkillsManager";

export default async function SkillsPage() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Skills</h1>
      <p className="mt-2 text-sm text-neutral-400">
        These appear on your /portfolio page, grouped by category.
      </p>
      <div className="mt-6">
        <SkillsManager skills={(skills ?? []) as Skill[]} />
      </div>
    </div>
  );
}
