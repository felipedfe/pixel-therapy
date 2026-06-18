import type { PixelGrid } from "@/types/pixelArt";

export function calculateAccuracy(targetGrid: PixelGrid, userGrid: PixelGrid): number {
  let total = 0;
  let correct = 0;

  for (let row = 0; row < targetGrid.length; row++) {
    for (let col = 0; col < targetGrid[row].length; col++) {
      total++;

      if (targetGrid[row][col] === userGrid[row][col]) {
        correct++;
      }
    }
  }

  return Math.round((correct / total) * 100);
}

export function isCellWrong(
  targetGrid: PixelGrid,
  userGrid: PixelGrid,
  row: number,
  col: number,
): boolean {
  return userGrid[row][col] !== targetGrid[row][col];
}
