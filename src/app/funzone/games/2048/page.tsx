import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Game2048 } from "./_components/Game2048";

export const metadata: Metadata = {
  title: "2048",
  description: "Play 2048 — slide and combine tiles to reach 2048.",
};

export default function Game2048Page() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          href="/funzone/games"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Games
        </Link>
        <h1 className="font-display mt-4 mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-white">
          2048
        </h1>
        <Game2048 />
      </div>
    </div>
  );
}
