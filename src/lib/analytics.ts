import { createClient } from "@/lib/supabase/server";
import type { InteractionEvent } from "@/lib/types";

export type AnalyticsSummary = {
  pageviewsByDay: { date: string; count: number }[];
  totalPageviews: number;
  topPaths: { path: string; count: number }[];
  deviceBreakdown: { name: string; count: number }[];
  browserBreakdown: { name: string; count: number }[];
  countryBreakdown: { name: string; count: number }[];
  topDownloads: { target: string; count: number }[];
  topOutboundClicks: { target: string; count: number }[];
};

function countBy(items: InteractionEvent[], key: "path" | "target" | "device" | "browser" | "country") {
  const counts = new Map<string, number>();
  for (const item of items) {
    const value = item[key];
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function topN(counts: Map<string, number>, n: number) {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: events } = await supabase
    .from("interaction_events")
    .select("*")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  const all = (events ?? []) as InteractionEvent[];
  const pageviews = all.filter((e) => e.kind === "pageview");
  const downloads = all.filter((e) => e.kind === "download");
  const outboundClicks = all.filter((e) => e.kind === "outbound_click");

  const byDay = new Map<string, number>();
  for (const event of pageviews) {
    const day = event.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  const pageviewsByDay = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const pathCounts = countBy(pageviews, "path");
  const deviceCounts = countBy(pageviews, "device");
  const browserCounts = countBy(pageviews, "browser");
  const countryCounts = countBy(pageviews, "country");
  const downloadCounts = countBy(downloads, "target");
  const outboundCounts = countBy(outboundClicks, "target");

  return {
    pageviewsByDay,
    totalPageviews: pageviews.length,
    topPaths: topN(pathCounts, 5).map((x) => ({ path: x.name, count: x.count })),
    deviceBreakdown: topN(deviceCounts, 5),
    browserBreakdown: topN(browserCounts, 5),
    countryBreakdown: topN(countryCounts, 5),
    topDownloads: topN(downloadCounts, 5).map((x) => ({ target: x.name, count: x.count })),
    topOutboundClicks: topN(outboundCounts, 5).map((x) => ({ target: x.name, count: x.count })),
  };
}
