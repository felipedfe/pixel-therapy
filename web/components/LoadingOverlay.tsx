"use client";

import { useState } from "react";
import { LoadingBlocks } from "./LoadingBlocks";
import styles from "./LoadingOverlay.module.css";

const MESSAGES = [
  "An artist is sketching...",
  "The AI is painting...",
  "The AI is looking for inspiration...",
  "Mixing colors...",
  "Composing a new piece...",
];

export function LoadingOverlay() {
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.content}>
        <LoadingBlocks />
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
}
