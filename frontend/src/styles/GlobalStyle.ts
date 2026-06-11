import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --color-bg: #FAF6F0;
    --color-surface: #FFFFFF;
    --color-text: #3A3A3A;
    --color-text-soft: #8A8480;
    --color-border: #E5DED5;
    --color-accent: #4ECDC4;
    --color-error: #E0735C;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui, "Segoe UI", Roboto, sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;
