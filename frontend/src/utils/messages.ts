export function getResultMessage(accuracy: number): string {
  if (accuracy === 100) return "Perfect!";
  if (accuracy >= 90) return "Almost there.";
  return "Take another look.";
}