import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const Block = styled.span<{ $color: string; $delay: number }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: ${(props) => props.$color};
  animation: ${bounce} 1.2s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;
`;

// "Geometric Harmony" palette (palettes.ts), colors 1-4
const COLORS = ["#FCB944", "#F0533B", "#0E747C", "#81B9BF"];

export function LoadingBlocks() {
  return (
    <Wrapper>
      {COLORS.map((color, index) => (
        <Block key={color} $color={color} $delay={index * 0.15} />
      ))}
    </Wrapper>
  );
}
