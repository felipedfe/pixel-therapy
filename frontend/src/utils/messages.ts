export function getResultMessage(accuracy: number): string {
  if (accuracy === 100) return "Perfeito!";
  if (accuracy >= 90) return "Quase perfeito!";
  // if (accuracy >= 70) return "Muito bom!";
  return "Continue tentando :)";
}
