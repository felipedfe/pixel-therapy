import type { PixelArtChallenge, PixelGrid, PixelValue } from "./pixelArt";

export type GameState = {
  challenge: PixelArtChallenge | null;
  userGrid: PixelGrid;
  selectedColor: PixelValue;
  score: number | null;
};
