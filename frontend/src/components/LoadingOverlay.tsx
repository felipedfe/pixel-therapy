import styled from "styled-components";
import { LoadingBlocks } from "./LoadingBlocks";

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
  padding: 3px;
  background-color: var(--color-border);
`;

export function LoadingOverlay() {
  return (
    <Backdrop>
      <Content>
        <LoadingBlocks />
        <Text>Generating...</Text>
      </Content>
    </Backdrop>
  );
}
