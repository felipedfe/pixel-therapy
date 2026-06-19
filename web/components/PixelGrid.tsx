"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import clsx from "clsx";
import type { PixelGrid as PixelGridType, PixelPalette, PixelValue } from "@/types/pixelArt";
import styles from "./PixelGrid.module.css";

type PixelGridProps = {
  grid: PixelGridType;
  palette: PixelPalette;
  editable?: boolean;
  selectedColor?: PixelValue;
  onCellClick?: (row: number, col: number) => void;
  wrongCells?: boolean[][];
};

export function PixelGrid({
  grid,
  palette,
  editable = false,
  onCellClick,
  wrongCells,
}: PixelGridProps) {
  const isPaintingRef = useRef(false);

  useEffect(() => {
    if (!editable) return;

    function stopPainting() {
      isPaintingRef.current = false;
    }

    window.addEventListener("mouseup", stopPainting);
    window.addEventListener("touchend", stopPainting);

    return () => {
      window.removeEventListener("mouseup", stopPainting);
      window.removeEventListener("touchend", stopPainting);
    };
  }, [editable]);

  function startPainting(row: number, col: number) {
    if (!editable) return;
    isPaintingRef.current = true;
    onCellClick?.(row, col);
  }

  function continuePainting(row: number, col: number) {
    if (!editable || !isPaintingRef.current) return;
    onCellClick?.(row, col);
  }

  function handleTouchStart(event: React.TouchEvent, row: number, col: number) {
    event.preventDefault();
    startPainting(row, col);
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (!editable || !isPaintingRef.current) return;

    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = target?.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;

    onCellClick?.(Number(cell.dataset.row), Number(cell.dataset.col));
  }

  return (
    <div className={styles.wrapper} onTouchMove={handleTouchMove}>
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            type="button"
            data-row={rowIndex}
            data-col={colIndex}
            className={clsx(
              styles.cell,
              editable && styles.editable,
              (wrongCells?.[rowIndex]?.[colIndex] ?? false) && styles.wrong,
            )}
            style={{ "--cell-color": palette[value] } as CSSProperties}
            onMouseDown={() => startPainting(rowIndex, colIndex)}
            onMouseEnter={() => continuePainting(rowIndex, colIndex)}
            onTouchStart={(event) => handleTouchStart(event, rowIndex, colIndex)}
            aria-label={`Cell row ${rowIndex + 1}, column ${colIndex + 1}`}
          />
        )),
      )}
    </div>
  );
}
