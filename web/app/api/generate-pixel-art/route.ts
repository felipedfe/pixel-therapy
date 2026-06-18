import { NextResponse } from "next/server";
import { generatePixelArtChallenge } from "@/lib/openaiService";

export async function POST() {
  try {
    const challenge = await generatePixelArtChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    console.error("Error generating pixel art:", error);
    return NextResponse.json(
      { error: "Could not generate a new pattern. Please try again." },
      { status: 502 },
    );
  }
}
