import OpenAI from "openai";
import { pickRandomPalette } from "@/lib/palettes";
import type { PixelArtChallenge, PixelGrid } from "@/types/pixelArt";

const GRID_SIZE = 12;
const MODEL = "gpt-4o-mini";
const MAX_ATTEMPTS = 3;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const SYSTEM_PROMPT = `You are an API that generates abstract pixel art challenges.

Return only valid JSON.
Do not use markdown.
Do not explain anything.
Do not generate an image, PNG, JPEG, SVG, or ASCII art.

Rules:
- Generate an abstract pixel art piece.
- The grid must have exactly 12 rows and 12 columns.
- Use only the numbers 0, 1, 2, 3, and 4.
- The number 0 represents the background.
- The composition should be visually interesting.
- Explore geometric shapes, suggested curves, color blocks, lines, and color areas.
- Create a different image on every generation.
- Avoid overly random patterns; the image should feel intentional.
- Avoid too many isolated pixels.
- Prefer color masses, visual rhythm, and balanced composition.
- Give the piece a surreal, free-association title (2-3 words) — unexpected word pairings that don't need to relate to the image at all, e.g. "Science Turtle", "Parts of Choice", "Singular Rainbow", "Class Act", "Tide of Phantom". Avoid generic titles like "Abstract Pattern" or "Geometric Shapes", and avoid poetic nature clichés like "The Shape of Rain" or "Quiet Horizon".

Do not generate a color palette — only the composition (grid).

Required format:

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
  const response = await getClient().chat.completions.create({
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
    throw new Error("Empty response from OpenAI");
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

      console.warn(`Attempt ${attempt}: AI response in invalid format`, result);
    } catch (error) {
      console.warn(`Attempt ${attempt}: error calling OpenAI`, error);
    }
  }

  throw new Error("Could not generate a valid challenge after multiple attempts.");
}
