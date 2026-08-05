import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TicTacToe } from "./_components/TicTacToe";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "Play Tic-Tac-Toe against an unbeatable computer opponent.",
};

export default function TicTacToePage() {
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
          Tic-Tac-Toe
        </h1>
        <TicTacToe />
      </div>
    </div>
  );
}
