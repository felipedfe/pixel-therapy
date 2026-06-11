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
  border: 1px solid var(--color-border);
  border-radius: 12px;
`;

const Cell = styled.button<{ $color: string; $editable: boolean; $wrong: boolean }>`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background-color: ${(props) => props.$color};
  cursor: ${(props) => (props.$editable ? "pointer" : "default")};
  outline: ${(props) => (props.$wrong ? "2px solid var(--color-error)" : "none")};
  outline-offset: -2px;
  transition: transform 0.1s ease;

  ${(props) =>
    props.$editable &&
    `
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
  return (
    <Wrapper>
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            type="button"
            $color={palette[value]}
            $editable={editable}
            $wrong={wrongCells?.[rowIndex]?.[colIndex] ?? false}
            onClick={() => editable && onCellClick?.(rowIndex, colIndex)}
            aria-label={`Célula linha ${rowIndex + 1}, coluna ${colIndex + 1}`}
          />
        )),
      )}
    </Wrapper>
  );
}
