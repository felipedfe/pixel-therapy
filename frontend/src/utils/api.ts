import type { PixelArtChallenge } from "../types/pixelArt";

export async function fetchPixelArtChallenge(): Promise<PixelArtChallenge> {
  const response = await fetch("/api/generate-pixel-art", { method: "POST" });

  if (!response.ok) {
    throw new Error("Não foi possível gerar um novo padrão.");
  }

  return response.json();
}
