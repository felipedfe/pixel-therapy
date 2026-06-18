import type { PixelArtChallenge } from "@/types/pixelArt";

export async function fetchPixelArtChallenge(): Promise<PixelArtChallenge> {
  const response = await fetch("/api/generate-pixel-art", { method: "POST" });

  if (!response.ok) {
    throw new Error("Could not generate a new pattern.");
  }

  return response.json();
}
