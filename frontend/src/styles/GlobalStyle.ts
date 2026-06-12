import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --color-bg: #FAF6F0;
    --color-surface: #FFFFFF;
    --color-text: #3A3A3A;
    --color-text-soft: #8A8480;
    --color-border: #E5DED5;
    --color-border-dark: #b6a498;
    --color-accent: #4ECDC4;
    --color-error: #E0735C;
    --color-success: #7FB685;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Plus Jakarta Sans", system-ui, "Segoe UI", Roboto, sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
    min-height: 100vh;
    min-height: 100dvh;
    /* padding: 5px; */
    outline: 4px solid var(--color-bg);
    outline-offset: -4px;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;
