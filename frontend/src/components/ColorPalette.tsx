import styled from "styled-components";
import type { PixelPalette, PixelValue } from "../types/pixelArt";

type ColorPaletteProps = {
  palette: PixelPalette;
  selectedColor: PixelValue;
  onSelectColor: (color: PixelValue) => void;
  vertical?: boolean;
};

const PAINT_COLORS: PixelValue[] = [1, 2, 3, 4];

const Wrapper = styled.div<{ $vertical?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  ${(props) =>
    props.$vertical &&
    `
      flex-direction: column;
      flex-wrap: nowrap;
    `}
`;

const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 2px solid ${(props) => (props.$selected ? "var(--color-text)" : "var(--color-border)")};
  box-shadow: ${(props) => (props.$selected ? "0 0 0 3px var(--color-bg)" : "none")};
  outline: ${(props) => (props.$selected ? "2px solid var(--color-text)" : "none")};
  transition:
    transform 0.1s ease,
    border-color 0.1s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

// const Eraser = styled(Swatch)`
//   position: relative;
//   background-color: var(--color-surface);
//
//   &::after {
//     content: "";
//     position: absolute;
//     inset: 8px;
//     border: 2px solid var(--color-text-soft);
//     border-radius: 4px;
//   }
// `;

export function ColorPalette({ palette, selectedColor, onSelectColor, vertical }: ColorPaletteProps) {
  return (
    <Wrapper $vertical={vertical}>
      {/* <Eraser
        type="button"
        $color={palette[0]}
        $selected={selectedColor === 0}
        onClick={() => onSelectColor(0)}
        aria-label="Borracha"
        title="Borracha"
      /> */}
      {PAINT_COLORS.map((color) => (
        <Swatch
          key={color}
          type="button"
          $color={palette[color]}
          $selected={selectedColor === color}
          onClick={() => onSelectColor(color)}
          aria-label={`Cor ${color}`}
          title={palette[color]}
        />
      ))}
    </Wrapper>
  );
}
