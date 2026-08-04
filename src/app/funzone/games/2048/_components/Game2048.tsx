"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import {
  type Grid,
  type Direction,
  newGame,
  moveGrid,
  addRandomTile,
  hasMovesAvailable,
  hasWon,
} from "@/lib/games/2048-logic";

const TILE_COLORS: Record<number, string> = {
  2: "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  4: "bg-neutral-300 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
  8: "bg-emerald-300 text-black",
  16: "bg-emerald-400 text-black",
  32: "bg-emerald-500 text-black",
  64: "bg-emerald-600 text-white",
  128: "bg-teal-500 text-white",
  256: "bg-teal-600 text-white",
  512: "bg-teal-700 text-white",
  1024: "bg-amber-500 text-black",
  2048: "bg-gold text-black",
};

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => newGame());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBest(Number(localStorage.getItem("2048-best") ?? 0));
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const applyMove = useCallback(
    (direction: Direction) => {
      if (gameOver) return;
      setGrid((current) => {
        const result = moveGrid(current, direction);
        if (!result.moved) return current;

        const withNewTile = addRandomTile(result.grid);
        setScore((s) => {
          const next = s + result.scoreGained;
          setBest((b) => {
            const nextBest = Math.max(b, next);
            localStorage.setItem("2048-best", String(nextBest));
            return nextBest;
          });
          return next;
        });

        if (hasWon(withNewTile)) setWon(true);
        if (!hasMovesAvailable(withNewTile)) setGameOver(true);

        return withNewTile;
      });
    },
    [gameOver],
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const map: Record<string, Direction> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down",
      };
      const direction = map[e.key];
      if (direction) {
        e.preventDefault();
        applyMove(direction);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [applyMove]);

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      applyMove(dx > 0 ? "right" : "left");
    } else {
      applyMove(dy > 0 ? "down" : "up");
    }
  }

  function reset() {
    setGrid(newGame());
    setScore(0);
    setGameOver(false);
    setWon(false);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="glass-panel rounded-lg px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-neutral-500">Score</p>
            <p className="font-display font-bold text-neutral-900 dark:text-white">{score}</p>
          </div>
          <div className="glass-panel rounded-lg px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-neutral-500">Best</p>
            <p className="font-display font-bold text-neutral-900 dark:text-white">{best}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="glass-panel flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-neutral-700 transition hover:border-emerald/40 dark:text-neutral-300"
        >
          <RotateCcw size={14} />
          New Game
        </button>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="glass-panel relative grid grid-cols-4 gap-2 rounded-2xl p-2"
      >
        {grid.map((row, r) =>
          row.map((value, c) => (
            <div
              key={`${r}-${c}`}
              className="flex aspect-square items-center justify-center rounded-lg bg-black/5 dark:bg-white/5"
            >
              <AnimatePresence mode="popLayout">
                {value !== 0 && (
                  <motion.div
                    key={value}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className={`flex h-full w-full items-center justify-center rounded-lg font-display text-lg font-bold sm:text-xl ${
                      TILE_COLORS[value] ?? "bg-neutral-900 text-white"
                    }`}
                  >
                    {value}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )),
        )}

        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/70 backdrop-blur-sm">
            <p className="font-display text-2xl font-bold text-white">
              {won ? "You reached 2048!" : "Game Over"}
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-emerald px-5 py-2 text-sm font-medium text-black transition hover:brightness-110"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-neutral-500">
        Use arrow keys or swipe to combine tiles and reach 2048.
      </p>
    </div>
  );
}
