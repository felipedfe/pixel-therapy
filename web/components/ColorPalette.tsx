"use client";

import type { CSSProperties } from "react";
import clsx from "clsx";
import type { PixelPalette, PixelValue } from "@/types/pixelArt";
import styles from "./ColorPalette.module.css";

type ColorPaletteProps = {
  palette: PixelPalette;
  selectedColor: PixelValue;
  onSelectColor: (color: PixelValue) => void;
  vertical?: boolean;
};

const PAINT_COLORS: PixelValue[] = [1, 2, 3, 4];

export function ColorPalette({ palette, selectedColor, onSelectColor, vertical }: ColorPaletteProps) {
  return (
    <div className={clsx(styles.wrapper, vertical && styles.vertical)}>
      {PAINT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={clsx(styles.swatch, selectedColor === color && styles.selected)}
          style={{ "--swatch-color": palette[color] } as CSSProperties}
          onClick={() => onSelectColor(color)}
          aria-label={`Color ${color}`}
          title={palette[color]}
        />
      ))}
    </div>
  );
}
