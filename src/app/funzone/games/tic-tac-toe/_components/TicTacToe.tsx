"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { type Board, getWinner, isDraw, bestMove } from "@/lib/games/tic-tac-toe-logic";

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [wins, setWins] = useState({ player: 0, computer: 0, draws: 0 });
  const [thinking, setThinking] = useState(false);

  const winner = getWinner(board);
  const draw = isDraw(board);
  const gameOver = Boolean(winner) || draw;

  function registerResult(finalBoard: Board) {
    const result = getWinner(finalBoard);
    if (result === "X") {
      setWins((w) => ({ ...w, player: w.player + 1 }));
    } else if (result === "O") {
      setWins((w) => ({ ...w, computer: w.computer + 1 }));
    } else if (isDraw(finalBoard)) {
      setWins((w) => ({ ...w, draws: w.draws + 1 }));
    }
  }

  function handleClick(index: number) {
    if (board[index] || gameOver || thinking) return;
    const next = [...board];
    next[index] = "X";
    setBoard(next);

    if (getWinner(next) || isDraw(next)) {
      registerResult(next);
      return;
    }

    setThinking(true);
    setTimeout(() => {
      const move = bestMove(next);
      const withComputer = [...next];
      if (move !== -1) withComputer[move] = "O";
      setBoard(withComputer);
      setThinking(false);
      if (getWinner(withComputer) || isDraw(withComputer)) {
        registerResult(withComputer);
      }
    }, 400);
  }

  function reset() {
    setBoard(Array(9).fill(null));
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-4 flex justify-center gap-3 text-center text-xs">
        <div className="glass-panel rounded-lg px-4 py-2">
          <p className="text-neutral-500">You (X)</p>
          <p className="font-display font-bold text-neutral-900 dark:text-white">{wins.player}</p>
        </div>
        <div className="glass-panel rounded-lg px-4 py-2">
          <p className="text-neutral-500">Draws</p>
          <p className="font-display font-bold text-neutral-900 dark:text-white">{wins.draws}</p>
        </div>
        <div className="glass-panel rounded-lg px-4 py-2">
          <p className="text-neutral-500">Computer (O)</p>
          <p className="font-display font-bold text-neutral-900 dark:text-white">{wins.computer}</p>
        </div>
      </div>

      <div className="glass-panel relative grid grid-cols-3 gap-2 rounded-2xl p-2">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            disabled={Boolean(cell) || gameOver || thinking}
            className="flex aspect-square items-center justify-center rounded-lg bg-black/5 text-3xl font-bold transition hover:bg-black/10 disabled:cursor-default dark:bg-white/5 dark:hover:bg-white/10"
          >
            {cell && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cell === "X" ? "text-emerald" : "text-gold"}
              >
                {cell}
              </motion.span>
            )}
          </button>
        ))}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/70 backdrop-blur-sm">
            <p className="font-display text-xl font-bold text-white">
              {winner === "X" ? "You Win!" : winner === "O" ? "Computer Wins" : "Draw"}
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-5 py-2 text-sm font-medium text-black transition hover:brightness-110"
            >
              <RotateCcw size={14} />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
