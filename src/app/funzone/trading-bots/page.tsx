import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TradingBotDemo } from "./_components/TradingBotDemo";

export const metadata: Metadata = {
  title: "Trading Bots",
  description: "A simulated moving-average crossover trading bot demo on synthetic price data.",
};

export default function TradingBotsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <Link
          href="/funzone"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Funzone
        </Link>
        <h1 className="font-display mt-4 mb-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
          Trading Bots
        </h1>
        <p className="mb-10 text-neutral-600 dark:text-neutral-400">
          A moving-average crossover strategy, simulated against synthetic price data.
        </p>
        <TradingBotDemo />
      </div>
    </div>
  );
}
