export type PixelValue = 0 | 1 | 2 | 3 | 4;

export type PixelGrid = PixelValue[][];

export type PixelPalette = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
};

export type PixelArtChallenge = {
  title: string;
  palette: PixelPalette;
  grid: PixelGrid;
};
