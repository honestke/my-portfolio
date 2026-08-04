export type Grid = number[][];
export type Direction = "left" | "right" | "up" | "down";

export const GRID_SIZE = 4;

export function emptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  return a.every((row, r) => row.every((val, c) => val === b[r][c]));
}

export function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = [];
  grid.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === 0) empty.push([r, c]);
    }),
  );
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = cloneGrid(grid);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideAndMergeRow(row: number[]): { row: number[]; scoreGained: number } {
  const filtered = row.filter((v) => v !== 0);
  const merged: number[] = [];
  let scoreGained = 0;
  let i = 0;
  while (i < filtered.length) {
    if (filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      merged.push(mergedValue);
      scoreGained += mergedValue;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i += 1;
    }
  }
  while (merged.length < row.length) merged.push(0);
  return { row: merged, scoreGained };
}

function transpose(grid: Grid): Grid {
  return grid[0].map((_, c) => grid.map((row) => row[c]));
}

function reverseRows(grid: Grid): Grid {
  return grid.map((row) => [...row].reverse());
}

export function moveGrid(grid: Grid, direction: Direction): { grid: Grid; scoreGained: number; moved: boolean } {
  let working = cloneGrid(grid);
  let scoreGained = 0;

  if (direction === "up" || direction === "down") working = transpose(working);
  if (direction === "right" || direction === "down") working = reverseRows(working);

  working = working.map((row) => {
    const result = slideAndMergeRow(row);
    scoreGained += result.scoreGained;
    return result.row;
  });

  if (direction === "right" || direction === "down") working = reverseRows(working);
  if (direction === "up" || direction === "down") working = transpose(working);

  return { grid: working, scoreGained, moved: !gridsEqual(grid, working) };
}

export function hasMovesAvailable(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((val) => val >= 2048));
}

export function newGame(): Grid {
  let grid = emptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}
