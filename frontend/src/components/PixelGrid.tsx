import { useEffect, useRef } from "react";
import styled from "styled-components";
import type { PixelGrid as PixelGridType, PixelPalette, PixelValue } from "../types/pixelArt";

type PixelGridProps = {
  grid: PixelGridType;
  palette: PixelPalette;
  editable?: boolean;
  selectedColor?: PixelValue;
  onCellClick?: (row: number, col: number) => void;
  wrongCells?: boolean[][];
};

const Wrapper = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2px;
  padding: 8px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 12px;
`;

// red ring + white ring (keeps the red from blending into similar palette colors, e.g. magenta)
// transparent when the cell isn't marked as wrong, to allow the fade-in entrance
const Cell = styled.button<{ $color: string; $editable: boolean; $wrong: boolean }>`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background-color: ${(props) => props.$color};
  cursor: ${(props) => (props.$editable ? "pointer" : "default")};
  box-shadow: ${(props) =>
    props.$wrong
      ? "inset 0 0 0 2px var(--color-error), inset 0 0 0 4px var(--color-surface)"
      : "inset 0 0 0 2px rgba(224, 115, 92, 0), inset 0 0 0 4px rgba(255, 255, 255, 0)"};
  transition:
    transform 0.1s ease,
    box-shadow 0.3s ease;

  ${(props) =>
    props.$editable &&
    `
      touch-action: none;

      &:hover {
        transform: scale(1.08);
      }
    `}

  @media (max-width: 600px) {
    width: 20px;
    height: 20px;
  }
`;

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
    <Wrapper onTouchMove={handleTouchMove}>
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            type="button"
            data-row={rowIndex}
            data-col={colIndex}
            $color={palette[value]}
            $editable={editable}
            $wrong={wrongCells?.[rowIndex]?.[colIndex] ?? false}
            onMouseDown={() => startPainting(rowIndex, colIndex)}
            onMouseEnter={() => continuePainting(rowIndex, colIndex)}
            onTouchStart={(event) => handleTouchStart(event, rowIndex, colIndex)}
            aria-label={`Cell row ${rowIndex + 1}, column ${colIndex + 1}`}
          />
        )),
      )}
    </Wrapper>
  );
}
