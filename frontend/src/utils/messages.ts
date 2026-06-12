export function getResultMessage(accuracy: number): string {
  if (accuracy === 100) return "Perfect!";
  if (accuracy >= 90) return "Almost perfect!";
  // if (accuracy >= 70) return "Very good!";
  return "Keep trying :)";
}
