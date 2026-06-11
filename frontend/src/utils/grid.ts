import type { PixelGrid, PixelValue } from "../types/pixelArt";

export function createEmptyGrid(size = 12): PixelGrid {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as PixelValue),
  );
}

export function paintCell(
  grid: PixelGrid,
  row: number,
  col: number,
  color: PixelValue,
): PixelGrid {
  const next = grid.map((line) => [...line]);
  next[row][col] = color;
  return next;
}
