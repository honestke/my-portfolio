"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import type { AnalyticsSummary } from "@/lib/analytics";

const EMERALD = "#10b981";
const AXIS_COLOR = "#737373";
const GRID_COLOR = "#262626";

const tooltipStyle = {
  background: "#171717",
  border: "1px solid #333",
  borderRadius: 8,
  fontSize: 12,
  color: "#fff",
};

function BreakdownBars({ data }: { data: { name: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-neutral-500">No data yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs text-neutral-400">{d.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs text-neutral-500">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsCharts({ summary }: { summary: AnalyticsSummary }) {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
        <h3 className="mb-4 text-sm font-medium text-neutral-300">
          Pageviews — last 30 days ({summary.totalPageviews} total)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={summary.pageviewsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="date" stroke={AXIS_COLOR} fontSize={11} tickLine={false} />
            <YAxis stroke={AXIS_COLOR} fontSize={11} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke={EMERALD} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="mb-4 text-sm font-medium text-neutral-300">Top pages</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary.topPaths} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" stroke={AXIS_COLOR} fontSize={11} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="path"
                stroke={AXIS_COLOR}
                fontSize={11}
                width={100}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={EMERALD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="mb-4 text-sm font-medium text-neutral-300">Device breakdown</h3>
          <BreakdownBars data={summary.deviceBreakdown} />
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="mb-4 text-sm font-medium text-neutral-300">Browser breakdown</h3>
          <BreakdownBars data={summary.browserBreakdown} />
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="mb-4 text-sm font-medium text-neutral-300">Country breakdown</h3>
          <BreakdownBars data={summary.countryBreakdown} />
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="mb-4 text-sm font-medium text-neutral-300">Most downloaded</h3>
          {summary.topDownloads.length === 0 ? (
            <p className="text-sm text-neutral-500">No downloads yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-neutral-300">
              {summary.topDownloads.map((d) => (
                <li key={d.target} className="flex justify-between">
                  <span className="truncate">{d.target}</span>
                  <span className="text-neutral-500">{d.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
          <h3 className="mb-4 text-sm font-medium text-neutral-300">Top outbound clicks</h3>
          {summary.topOutboundClicks.length === 0 ? (
            <p className="text-sm text-neutral-500">No outbound clicks yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-neutral-300">
              {summary.topOutboundClicks.map((d) => (
                <li key={d.target} className="flex justify-between">
                  <span className="truncate">{d.target}</span>
                  <span className="text-neutral-500">{d.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
