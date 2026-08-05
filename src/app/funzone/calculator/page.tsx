import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatisticsCalculator } from "./_components/StatisticsCalculator";

export const metadata: Metadata = {
  title: "Statistics Calculator",
  description: "Descriptive statistics and one-sample t-test calculator.",
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link
          href="/funzone"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Funzone
        </Link>
        <h1 className="font-display mt-4 mb-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          Statistics Calculator
        </h1>
        <p className="mb-10 text-neutral-600 dark:text-neutral-400">
          Paste a dataset to get descriptive statistics and run a one-sample t-test.
        </p>
        <StatisticsCalculator />
      </div>
    </div>
  );
}
