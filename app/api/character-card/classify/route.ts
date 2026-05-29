import { z } from "zod";

import {
  classifyPlayerBehaviorMacro,
  evaluatePlayerTurnBehavior,
} from "@/lib/character-card/behaviorMacroClassifiers";
import { classifyBdsmIntent } from "@/lib/character-card/bdsmIntentClassifiers";
import { classifyComedyIntent } from "@/lib/character-card/comedyIntentClassifiers";
import { classifyDarkRomanceIntent } from "@/lib/character-card/darkRomanceIntentClassifiers";
import { analyzeEmotionLexicon } from "@/lib/character-card/emotionLexicon";
import { classifySpicyIntent } from "@/lib/character-card/spicyIntentClassifiers";
import { CharacterCardMacroClassificationSchema } from "@/types/character-card/CharacterCardMacroClassification";

const classifyRequestSchema = z.object({
  characterDescription: z.string().trim().min(1),
  eventContext: z.string().trim().optional(),
  darkRomanceState: z
    .object({
      control: z.number().min(0).max(100).optional(),
      obsession: z.number().min(0).max(100).optional(),
      sanity: z.number().min(0).max(100).optional(),
    })
    .optional(),
  relationshipStats: z
    .object({
      affection: z.number().min(0).max(100).optional(),
      angst: z.number().min(0).max(100).optional(),
      charisma: z.number().min(0).max(100).optional(),
      confidence: z.number().min(0).max(100).optional(),
      jealousy: z.number().min(0).max(100).optional(),
      trust: z.number().min(0).max(100).optional(),
    })
    .optional(),
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
  const emotionAnalysis = analyzeEmotionLexicon(characterDescription);
  const behavior =
    requestResult.data.eventContext || requestResult.data.relationshipStats
      ? evaluatePlayerTurnBehavior({
          eventContext: requestResult.data.eventContext,
          relationshipStats: requestResult.data.relationshipStats,
          text: requestResult.data.characterDescription,
        })
      : classifyPlayerBehaviorMacro(characterDescription);
  const comedyIntent = classifyComedyIntent(
    requestResult.data.characterDescription,
    requestResult.data.relationshipStats,
  );
  const bdsmIntent = classifyBdsmIntent(requestResult.data.characterDescription);
  const darkRomanceIntent = classifyDarkRomanceIntent(
    requestResult.data.characterDescription,
    requestResult.data.darkRomanceState,
  );
  const spicyIntent = classifySpicyIntent(requestResult.data.characterDescription);
  const classification = CharacterCardMacroClassificationSchema.parse({
    bdsm: bdsmIntent.active ? bdsmIntent : undefined,
    darkRomance: darkRomanceIntent.active ? darkRomanceIntent : undefined,
    macro: {
      formatting: characterDescription.includes("json") ? "JSON" : "W++",
      framework: isStructuredScene ? "Narrative RPG" : "Sandbox",
      relationship: isAntagonistic ? "Antagonistic" : "Symmetric",
      tones: uniqueTags([
        ...extractMatchingTags(characterDescription, [
          "angsty",
          "cozy",
          "dark romance",
          "fluff",
          "slow-burn",
          "slow burn",
        ]),
        ...emotionAnalysis.toneTags,
      ]),
    },
    behavior,
    comedy: comedyIntent.active ? comedyIntent : undefined,
    spicy: spicyIntent.active ? spicyIntent : undefined,
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
      micro_tropes: uniqueTags([
        ...extractMatchingTags(characterDescription, [
          "enemies to lovers",
          "fake dating",
          "forced proximity",
          "grumpy sunshine",
          "only one bed",
          "who hurt you",
        ]),
        ...emotionAnalysis.microTropes,
      ]),
    },
  });

  return Response.json(classification);
}

function extractMatchingTags(source: string, options: string[]) {
  return uniqueTags(options.filter((option) => source.includes(option)));
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags));
}
