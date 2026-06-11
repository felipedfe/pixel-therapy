import OpenAI from "openai";
import { pickRandomPalette } from "../data/palettes.js";
import type { PixelArtChallenge, PixelGrid } from "../types/pixelArt.js";

const GRID_SIZE = 12;
const MODEL = "gpt-4o-mini";
const MAX_ATTEMPTS = 3;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é uma API geradora de desafios de pixel art abstrata.

Retorne apenas JSON válido.
Não use markdown.
Não explique nada.
Não gere imagem, PNG, JPEG, SVG ou ASCII art.

Regras:
- Gere uma pixel art abstrata.
- O grid deve ter exatamente 12 linhas e 12 colunas.
- Use apenas os números 0, 1, 2, 3 e 4.
- O número 0 representa fundo.
- A composição deve ser visualmente interessante.
- Explore formas geométricas, curvas sugeridas, blocos de cor, linhas e áreas de cor.
- A cada geração, crie uma imagem diferente.
- Evite padrões muito aleatórios; a imagem deve parecer intencional.
- Evite muitos pixels isolados.
- Prefira massas de cor, ritmo visual e composição equilibrada.

Não gere paleta de cores — apenas a composição (grid).

Formato obrigatório:

{
  "title": "string",
  "grid": number[][]
}`;

const PIXEL_ART_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    grid: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "integer",
          enum: [0, 1, 2, 3, 4],
        },
      },
    },
  },
  required: ["title", "grid"],
  additionalProperties: false,
} as const;

type AIGridResult = {
  title: string;
  grid: PixelGrid;
};

function isValidAIGridResult(data: unknown): data is AIGridResult {
  if (typeof data !== "object" || data === null) return false;

  const { title, grid } = data as Record<string, unknown>;

  if (typeof title !== "string") return false;
  if (!Array.isArray(grid) || grid.length !== GRID_SIZE) return false;

  return grid.every(
    (row) =>
      Array.isArray(row) &&
      row.length === GRID_SIZE &&
      row.every((value) => Number.isInteger(value) && value >= 0 && value <= 4),
  );
}

async function requestGridFromAI(): Promise<unknown> {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "system", content: SYSTEM_PROMPT }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "pixel_art_challenge",
        strict: true,
        schema: PIXEL_ART_SCHEMA,
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Resposta vazia da OpenAI");
  }

  return JSON.parse(content);
}

export async function generatePixelArtChallenge(): Promise<PixelArtChallenge> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await requestGridFromAI();

      if (isValidAIGridResult(result)) {
        return {
          title: result.title,
          palette: pickRandomPalette(),
          grid: result.grid,
        };
      }

      console.warn(`Tentativa ${attempt}: resposta da IA em formato inválido`, result);
    } catch (error) {
      console.warn(`Tentativa ${attempt}: erro ao chamar a OpenAI`, error);
    }
  }

  throw new Error("Não foi possível gerar um desafio válido após múltiplas tentativas.");
}
