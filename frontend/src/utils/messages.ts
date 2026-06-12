export function getResultMessage(accuracy: number): string {
  if (accuracy === 100) return "Perfect!";
  if (accuracy >= 90) return "Only a few details remain.";
  return "Take another look.";
}