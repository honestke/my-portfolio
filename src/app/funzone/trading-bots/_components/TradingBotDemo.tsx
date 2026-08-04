"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { generateSyntheticPrices, runMovingAverageCrossover } from "@/lib/trading-sim";

const inputClass =
  "w-24 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-emerald dark:border-neutral-700 dark:bg-neutral-950 dark:text-white";

export function TradingBotDemo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [shortWindow, setShortWindow] = useState(10);
  const [longWindow, setLongWindow] = useState(30);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `seed` intentionally forces regeneration
  const prices = useMemo(() => generateSyntheticPrices(200), [seed]);
  const result = useMemo(
    () => runMovingAverageCrossover(prices, shortWindow, longWindow),
    [prices, shortWindow, longWindow],
  );

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
    <div className="mx-auto max-w-4xl">
      <div className="glass-panel mb-6 flex items-start gap-3 rounded-2xl border-amber-500/30 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          <strong className="text-neutral-900 dark:text-white">Simulation only.</strong> This runs a
          moving-average crossover strategy against randomly generated synthetic price data — not
          real market data, and no real money or live exchange is involved. For demonstration
          purposes only, not financial advice.
        </p>
      </div>

      <div className="glass-panel mb-6 flex flex-wrap items-end gap-4 rounded-2xl p-6">
        <div>
          <label htmlFor="short-window" className="mb-1 block text-xs text-neutral-500">
            Short MA window
          </label>
          <input
            id="short-window"
            type="number"
            min={2}
            max={longWindow - 1}
            value={shortWindow}
            onChange={(e) => setShortWindow(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="long-window" className="mb-1 block text-xs text-neutral-500">
            Long MA window
          </label>
          <input
            id="long-window"
            type="number"
            min={shortWindow + 1}
            max={90}
            value={longWindow}
            onChange={(e) => setLongWindow(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
        >
          <RefreshCw size={14} />
          New Simulation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-panel rounded-xl p-4 text-center">
          <p className="text-[10px] uppercase text-neutral-500">Strategy Return</p>
          <p
            className={`font-display text-lg font-bold ${result.totalReturnPct >= 0 ? "text-emerald" : "text-red-500"}`}
          >
            {result.totalReturnPct.toFixed(1)}%
          </p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <p className="text-[10px] uppercase text-neutral-500">Buy & Hold Return</p>
          <p className="font-display text-lg font-bold text-neutral-900 dark:text-white">
            {result.buyHoldReturnPct.toFixed(1)}%
          </p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <p className="text-[10px] uppercase text-neutral-500">Trades</p>
          <p className="font-display text-lg font-bold text-neutral-900 dark:text-white">{result.trades}</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <p className="text-[10px] uppercase text-neutral-500">Win Rate</p>
          <p className="font-display text-lg font-bold text-neutral-900 dark:text-white">
            {result.trades > 0 ? `${Math.round((result.wins / result.trades) * 100)}%` : "—"}
          </p>
        </div>
      </div>

      <div className="glass-panel mt-6 rounded-2xl p-6">
        <h3 className="font-display mb-4 text-sm font-semibold uppercase tracking-widest text-emerald">
          Equity Curve
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={result.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="day" stroke={axisColor} fontSize={11} tickLine={false} />
            <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="strategy" name="MA Crossover Bot" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="buyHold" name="Buy & Hold" stroke="#d4af37" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
