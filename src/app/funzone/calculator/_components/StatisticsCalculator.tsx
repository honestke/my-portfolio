"use client";

import { useMemo, useState } from "react";
import {
  parseNumbers,
  mean,
  median,
  mode,
  sampleVariance,
  sampleStdDev,
  oneSampleTTest,
} from "@/lib/stats";

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-emerald dark:border-neutral-700 dark:bg-neutral-950 dark:text-white";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 py-2 text-sm last:border-0 dark:border-white/5">
      <span className="text-neutral-500">{label}</span>
      <span className="font-mono font-medium text-neutral-900 dark:text-white">{value}</span>
    </div>
  );
}

export function StatisticsCalculator() {
  const [raw, setRaw] = useState("23, 19, 25, 31, 27, 22, 29, 24, 26, 30");
  const [hypMean, setHypMean] = useState("25");

  const values = useMemo(() => parseNumbers(raw), [raw]);
  const hasData = values.length > 1;

  const stats = useMemo(() => {
    if (!hasData) return null;
    const modes = mode(values);
    return {
      n: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      mean: mean(values),
      median: median(values),
      mode: modes.length > 0 ? modes.join(", ") : "None",
      variance: sampleVariance(values),
      stdDev: sampleStdDev(values),
      min: Math.min(...values),
      max: Math.max(...values),
      range: Math.max(...values) - Math.min(...values),
    };
  }, [values, hasData]);

  const tTest = useMemo(() => {
    const h = Number(hypMean);
    if (!hasData || Number.isNaN(h)) return null;
    return oneSampleTTest(values, h);
  }, [values, hypMean, hasData]);

  return (
    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
      <div className="glass-panel rounded-2xl p-6 sm:col-span-2">
        <label htmlFor="numbers" className="mb-1 block text-sm text-neutral-700 dark:text-neutral-300">
          Dataset (comma, space, or newline separated)
        </label>
        <textarea
          id="numbers"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          className={inputClass}
        />
        {!hasData && (
          <p className="mt-2 text-xs text-neutral-500">Enter at least 2 numbers to see results.</p>
        )}
      </div>

      {stats && (
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-widest text-emerald">
            Descriptive Statistics
          </h3>
          <StatRow label="Count (n)" value={String(stats.n)} />
          <StatRow label="Sum" value={stats.sum.toFixed(2)} />
          <StatRow label="Mean" value={stats.mean.toFixed(3)} />
          <StatRow label="Median" value={stats.median.toFixed(3)} />
          <StatRow label="Mode" value={stats.mode} />
          <StatRow label="Variance (sample)" value={stats.variance.toFixed(3)} />
          <StatRow label="Std. Deviation (sample)" value={stats.stdDev.toFixed(3)} />
          <StatRow label="Min" value={String(stats.min)} />
          <StatRow label="Max" value={String(stats.max)} />
          <StatRow label="Range" value={String(stats.range)} />
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="font-display mb-3 text-sm font-semibold uppercase tracking-widest text-emerald">
          One-Sample t-Test
        </h3>
        <label htmlFor="hyp-mean" className="mb-1 block text-sm text-neutral-700 dark:text-neutral-300">
          Hypothesized mean (H₀)
        </label>
        <input
          id="hyp-mean"
          type="text"
          value={hypMean}
          onChange={(e) => setHypMean(e.target.value)}
          className={inputClass}
        />

        {tTest && (
          <div className="mt-4">
            <StatRow label="t-statistic" value={tTest.t.toFixed(4)} />
            <StatRow label="Degrees of freedom" value={String(tTest.df)} />
            <StatRow label="Two-tailed p-value" value={tTest.pValue.toFixed(4)} />
            <p className="mt-3 text-xs text-neutral-500">
              {tTest.pValue < 0.05
                ? "p < 0.05 — reject the null hypothesis at the 5% significance level."
                : "p ≥ 0.05 — fail to reject the null hypothesis at the 5% significance level."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
