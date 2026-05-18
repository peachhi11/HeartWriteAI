import { z } from "zod";

import { CharacterCardMacroClassificationSchema } from "@/types/character-card/CharacterCardMacroClassification";

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

  const characterDescription =
    requestResult.data.characterDescription.toLowerCase();
  const isAntagonistic = [
    "angry",
    "competitive",
    "enemy",
    "enemies",
    "hostile",
    "rival",
    "rivalry",
  ].some((keyword) => characterDescription.includes(keyword));
  const isStructuredScene = ["quest", "campaign", "rpg", "scene"].some(
    (keyword) => characterDescription.includes(keyword),
  );
  const classification = CharacterCardMacroClassificationSchema.parse({
    macro: {
      formatting: characterDescription.includes("json") ? "JSON" : "W++",
      framework: isStructuredScene ? "Narrative RPG" : "Sandbox",
      relationship: isAntagonistic ? "Antagonistic" : "Symmetric",
      tones: extractMatchingTags(characterDescription, [
        "angsty",
        "cozy",
        "dark romance",
        "fluff",
        "slow-burn",
      ]),
    },
    tags: {
      archetypes: extractMatchingTags(characterDescription, [
        "anti-hero",
        "bodyguard",
        "billionaire",
        "ceo",
        "healer",
        "mafia",
      ]),
      dynamics: isAntagonistic ? ["antagonistic"] : ["symmetric"],
      micro_tropes: extractMatchingTags(characterDescription, [
        "enemies to lovers",
        "fake dating",
        "forced proximity",
        "grumpy sunshine",
        "only one bed",
        "who hurt you",
      ]),
    },
  });

  return Response.json(classification);
}

function extractMatchingTags(source: string, options: string[]) {
  return options.filter((option) => source.includes(option));
}
