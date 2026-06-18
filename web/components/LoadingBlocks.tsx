import type { CSSProperties } from "react";
import styles from "./LoadingBlocks.module.css";

// "Geometric Harmony" palette (palettes.ts), colors 1-4
const COLORS = ["#FCB944", "#F0533B", "#0E747C", "#81B9BF"];

export function LoadingBlocks() {
  return (
    <div className={styles.wrapper}>
      {COLORS.map((color, index) => (
        <span
          key={color}
          className={styles.block}
          style={
            {
              "--block-color": color,
              "--block-delay": `${index * 0.15}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
