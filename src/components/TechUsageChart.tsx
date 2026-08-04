"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function TechUsageChart({ data }: { data: { name: string; count: number }[] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const axisColor = isDark ? "#a3a3a3" : "#525252";
  const gridColor = isDark ? "#262626" : "#e5e5e5";
  const tooltipStyle = {
    background: isDark ? "#171717" : "#ffffff",
    border: `1px solid ${isDark ? "#333" : "#e5e5e5"}`,
    borderRadius: 8,
    fontSize: 12,
    color: isDark ? "#fff" : "#171717",
  };

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 32)}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" stroke={axisColor} fontSize={11} allowDecimals={false} />
        <YAxis type="category" dataKey="name" stroke={axisColor} fontSize={12} width={110} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />
        <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
