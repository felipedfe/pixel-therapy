import type { PixelPalette } from "../types/pixelArt.js";

export const palettes: PixelPalette[] = [
  {
    "0": "#F8F3E2",
    "1": "#FCB944",
    "2": "#F0533B",
    "3": "#0E747C",
    "4": "#81B9BF",
  },
  {
    "0": "#FCEBB6",
    "1": "#5E412F",
    "2": "#78C0A8",
    "3": "#F07818",
    "4": "#F0A830",
  },
  {
    "0": "#F8F7DE",
    "1": "#9BBFA4",
    "2": "#E99E57",
    "3": "#D07746",
    "4": "#7E483A",
  },
  {
    "0": "#EADDCA",
    "1": "#95482C",
    "2": "#FFA37A",
    "3": "#88845F",
    "4": "#676966",
  },
  {
    "0": "#EEF0E7",
    "1": "#69604D",
    "2": "#BFD6D3",
    "3": "#8BB9B9",
    "4": "#284E57",
  },
  {
    "0": "#F1F1F2",
    "1": "#6864AD",
    "2": "#009FB8",
    "3": "#94C83D",
    "4": "#D21B6E",
  },
  {
    "0": "#efefef",
    "1": "#091F26",
    "2": "#1D738B",
    "3": "#D0E0EF",
    "4": "#D33B52",
  },
  //   {
  //   "0": "#efefef",
  //   "1": "#203e48",
  //   "2": "#FFC627",
  //   "3": "#5ed2f2",
  //   "4": "#db5899",
  // },
  {
    "0": "#F4DED9",
    "1": "#F7623B",
    "2": "#FF8C29",
    "3": "#FFC627",
    "4": "#00C6FE",
  },
  {
    "0": "#FFE9C5",
    "1": "#FD65B2",
    "2": "#FFD2D7",
    "3": "#90E4CD",
    "4": "#84DCE0",
  },
];

export function pickRandomPalette(): PixelPalette {
  return palettes[Math.floor(Math.random() * palettes.length)];
}
