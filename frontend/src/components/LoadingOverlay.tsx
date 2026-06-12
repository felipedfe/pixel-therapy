import { useState } from "react";
import styled from "styled-components";
import { LoadingBlocks } from "./LoadingBlocks";

const MESSAGES = [
  "An artist is sketching...",
  "The AI is painting...",
  "The AI is looking for inspiration...",
  "Mixing colors...",
  "Composing a new piece...",
];

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.10);
  z-index: 10;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Text = styled.p`
  margin: 0;
  color: var(--color-text);
  font-weight: 500;
  padding: 4px;
  background-color: var(--color-border);
`;

export function LoadingOverlay() {
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  return (
    <Backdrop>
      <Content>
        <LoadingBlocks />
        <Text>{message}</Text>
      </Content>
    </Backdrop>
  );
}
