export type Cell = "X" | "O" | null;
export type Board = Cell[];

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(board: Board): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((c) => c !== null) && !getWinner(board);
}

function minimax(board: Board, isMaximizing: boolean): number {
  const winner = getWinner(board);
  if (winner === "O") return 1;
  if (winner === "X") return -1;
  if (isDraw(board)) return 0;

  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const next = [...board];
      next[i] = isMaximizing ? "O" : "X";
      scores.push(minimax(next, !isMaximizing));
    }
  }
  return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

export function bestMove(board: Board): number {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const next = [...board];
      next[i] = "O";
      const score = minimax(next, false);
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}
