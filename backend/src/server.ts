import express from "express";
import cors from "cors";
import "dotenv/config";
import { generatePixelArtRouter } from "./routes/generatePixelArt.js";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", generatePixelArtRouter);

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
