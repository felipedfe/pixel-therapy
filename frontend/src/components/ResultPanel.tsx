import styled from "styled-components";
import { getResultMessage } from "../utils/messages";

type ResultPanelProps = {
  score: number;
};

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 1.1rem;
`;

// const Score = styled.span`
//   font-weight: 600;
// `;

const Message = styled.span`
  color: var(--color-text-soft);
`;

export function ResultPanel({ score }: ResultPanelProps) {
  return (
    <Wrapper>
      {/* <Score>{score}% accuracy</Score> */}
      <Message>{getResultMessage(score)}</Message>
    </Wrapper>
  );
}
