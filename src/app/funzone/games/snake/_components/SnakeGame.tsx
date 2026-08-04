"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight } from "lucide-react";

const GRID_SIZE = 20;
const CELL_PX = 18;
const INITIAL_SPEED_MS = 140;

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const DELTAS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const [food, setFood] = useState<Point>(() => randomFood([{ x: 10, y: 10 }]));
  const [dir, setDir] = useState<Dir>("right");
  const dirRef = useRef<Dir>("right");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBest(Number(localStorage.getItem("snake-best") ?? 0));
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const changeDirection = useCallback((next: Dir) => {
    const opposite: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
    if (opposite[next] === dirRef.current) return;
    dirRef.current = next;
    setDir(next);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        if (!running) setRunning(true);
        changeDirection(next);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [changeDirection, running]);

  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setSnake((current) => {
        const delta = DELTAS[dirRef.current];
        const head = { x: current[0].x + delta.x, y: current[0].y + delta.y };

        const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
        const hitSelf = current.some((s) => s.x === head.x && s.y === head.y);
        if (hitWall || hitSelf) {
          setGameOver(true);
          setRunning(false);
          setBest((b) => {
            const nextBest = Math.max(b, score);
            localStorage.setItem("snake-best", String(nextBest));
            return nextBest;
          });
          return current;
        }

        const ateFood = head.x === food.x && head.y === food.y;
        const nextSnake = [head, ...current];
        if (ateFood) {
          setScore((s) => s + 10);
          setFood(randomFood(nextSnake));
        } else {
          nextSnake.pop();
        }
        return nextSnake;
      });
    }, INITIAL_SPEED_MS);

    return () => clearInterval(interval);
  }, [running, gameOver, food, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#050807" : "#fafaf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#d4af37";
    ctx.fillRect(food.x * CELL_PX, food.y * CELL_PX, CELL_PX - 2, CELL_PX - 2);

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#10b981" : "#059669";
      ctx.fillRect(seg.x * CELL_PX, seg.y * CELL_PX, CELL_PX - 2, CELL_PX - 2);
    });
  }, [snake, food]);

  function reset() {
    const initial = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    setSnake(initial);
    setFood(randomFood(initial));
    dirRef.current = "right";
    setDir("right");
    setScore(0);
    setGameOver(false);
    setRunning(false);
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
          Reset
        </button>
      </div>

      <div className="glass-panel relative overflow-hidden rounded-2xl p-2">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_PX}
          height={GRID_SIZE * CELL_PX}
          className="w-full rounded-xl"
        />

        {!running && !gameOver && (
          <div className="absolute inset-2 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 backdrop-blur-sm">
            <p className="font-display text-lg font-bold text-white">Ready?</p>
            <button
              type="button"
              onClick={() => setRunning(true)}
              className="rounded-full bg-emerald px-5 py-2 text-sm font-medium text-black transition hover:brightness-110"
            >
              Start
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-2 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 backdrop-blur-sm">
            <p className="font-display text-xl font-bold text-white">Game Over</p>
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

      <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button type="button" onClick={() => { setRunning(true); changeDirection("up"); }} className="glass-panel flex items-center justify-center rounded-lg py-3">
          <ArrowUp size={18} />
        </button>
        <div />
        <button type="button" onClick={() => { setRunning(true); changeDirection("left"); }} className="glass-panel flex items-center justify-center rounded-lg py-3">
          <ArrowLeftIcon size={18} />
        </button>
        <button type="button" onClick={() => { setRunning(true); changeDirection("down"); }} className="glass-panel flex items-center justify-center rounded-lg py-3">
          <ArrowDown size={18} />
        </button>
        <button type="button" onClick={() => { setRunning(true); changeDirection("right"); }} className="glass-panel flex items-center justify-center rounded-lg py-3">
          <ArrowRight size={18} />
        </button>
      </div>

      <p className="mt-4 hidden text-center text-xs text-neutral-500 sm:block">
        Use arrow keys or WASD to steer. Current direction: {dir}.
      </p>
    </div>
  );
}
