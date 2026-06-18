import { getResultMessage } from "@/lib/messages";
import styles from "./ResultPanel.module.css";

type ResultPanelProps = {
  score: number;
};

export function ResultPanel({ score }: ResultPanelProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.message}>{getResultMessage(score)}</span>
    </div>
  );
}
