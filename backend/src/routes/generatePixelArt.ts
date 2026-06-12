import { Router } from "express";
import { generatePixelArtChallenge } from "../services/openaiService.js";

export const generatePixelArtRouter = Router();

generatePixelArtRouter.post("/generate-pixel-art", async (_req, res) => {
  try {
    const challenge = await generatePixelArtChallenge();
    res.json(challenge);
  } catch (error) {
    console.error("Error generating pixel art:", error);
    res.status(502).json({ error: "Could not generate a new pattern. Please try again." });
  }
});
