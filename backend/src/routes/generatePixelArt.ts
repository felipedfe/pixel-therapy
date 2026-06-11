import { Router } from "express";
import { generatePixelArtChallenge } from "../services/openaiService.js";

export const generatePixelArtRouter = Router();

generatePixelArtRouter.post("/generate-pixel-art", async (_req, res) => {
  try {
    const challenge = await generatePixelArtChallenge();
    res.json(challenge);
  } catch (error) {
    console.error("Erro ao gerar pixel art:", error);
    res.status(502).json({ error: "Não foi possível gerar um novo padrão. Tente novamente." });
  }
});
