import { createClient } from "@/lib/supabase/server";

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Signed in as {user?.email}.
      </p>

      <div className="mt-8 rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <p className="text-sm text-neutral-300">
          This is the Phase 1 dashboard shell. Content sections (Projects,
          Blog, Certifications, and the rest) will be built out phase by
          phase, starting with Projects in Phase 2.
        </p>
      </div>
    </div>
  );
}
