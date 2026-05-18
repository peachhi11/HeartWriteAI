import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

import { CharacterCardMacroClassificationSchema } from "@/types/character-card/CharacterCardMacroClassification";

export const runtime = "edge";

const classifyRequestSchema = z.object({
  characterDescription: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const requestResult = classifyRequestSchema.safeParse(await request.json());

  if (!requestResult.success) {
    return Response.json(
      { error: "characterDescription is required." },
      { status: 400 },
    );
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "Google AI classification is not configured." },
      { status: 503 },
    );
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: CharacterCardMacroClassificationSchema,
      prompt: [
        "Analyze this character card raw input and map it accurately to the classification matrix.",
        `Character Data:\n${requestResult.data.characterDescription}`,
      ].join("\n\n"),
      system: [
        "You are an expert backend AI data analysis node for a romantic character card library.",
        "Read character data and identify structural classifications objectively.",
        'If a character is angry, competitive, hostile, or rivalry-driven toward the user, classify relationship as "Antagonistic".',
        'If the setting is casual open-ended conversation, use framework "Sandbox".',
        "Return concise tag arrays with lowercase library-style labels where possible.",
      ].join(" "),
    });

    return Response.json(object);
  } catch {
    return Response.json(
      { error: "Failed parsing macro metadata definitions." },
      { status: 500 },
    );
  }
}
