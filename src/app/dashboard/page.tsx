import { createClient } from "@/lib/supabase/server";
import { getAnalyticsSummary } from "@/lib/analytics";
import { AnalyticsCharts } from "./_components/AnalyticsCharts";

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [summary, { count: unreadCount }, { count: submissionCount }] = await Promise.all([
    getAnalyticsSummary(30),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("read", false),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-2 text-sm text-neutral-400">Signed in as {user?.email}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Pageviews (30d)</p>
          <p className="mt-1 text-2xl font-semibold text-white">{summary.totalPageviews}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Downloads (30d)</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {summary.topDownloads.reduce((sum, d) => sum + d.count, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Contact submissions</p>
          <p className="mt-1 text-2xl font-semibold text-white">{submissionCount ?? 0}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Unread messages</p>
          <p className="mt-1 text-2xl font-semibold text-white">{unreadCount ?? 0}</p>
        </div>
      </div>

      <div className="mt-8">
        <AnalyticsCharts summary={summary} />
      </div>
    </div>
  );
}
