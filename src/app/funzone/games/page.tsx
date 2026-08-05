import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Games",
  description: "Play browser games — 2048, Tic-Tac-Toe, and Snake.",
};

const games = [
  { title: "2048", description: "Slide and combine tiles to reach 2048.", href: "/funzone/games/2048", emoji: "🔢" },
  { title: "Tic-Tac-Toe", description: "Beat an unbeatable computer opponent.", href: "/funzone/games/tic-tac-toe", emoji: "⭕" },
  { title: "Snake", description: "Classic arcade action.", href: "/funzone/games/snake", emoji: "🐍" },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen">
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
          Games
        </h1>
        <p className="mb-10 text-neutral-600 dark:text-neutral-400">Pick a game to play.</p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="glass-panel group flex flex-col rounded-2xl p-6 transition hover:border-emerald/40 hover:shadow-2xl hover:shadow-emerald/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{game.emoji}</span>
                <ArrowUpRight
                  size={18}
                  className="text-neutral-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald dark:text-neutral-600"
                />
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {game.title}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">{game.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
