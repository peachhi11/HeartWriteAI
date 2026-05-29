import { z } from "zod";

import { BdsmIntentClassificationSchema } from "./BdsmIntentClassification";
import { ComedyIntentClassificationSchema } from "./ComedyIntentClassification";
import { DarkRomanceIntentClassificationSchema } from "./DarkRomanceIntentClassification";
import { SpicyIntentClassificationSchema } from "./SpicyIntentClassification";

export const MacroClassificationsSchema = z.object({
  framework: z.enum(["Sandbox", "Narrative RPG", "Text Adventure", "Scene-Locked"]),
  formatting: z.enum(["W++", "JSON", "Boostyle", "Natural Language"]),
  relationship: z.enum([
    "Symmetric",
    "Asymmetric (Bot Dominant)",
    "Asymmetric (User Dominant)",
    "Antagonistic",
  ]),
  tones: z.array(z.string()),
});

export const BehaviorMacroClassSchema = z.enum([
  "affectionate",
  "earnest",
  "coquettish",
  "teasing",
  "starstruck",
  "distant",
  "melodramatic",
  "sombre",
  "resigned",
  "possessive",
  "bold",
  "defiant",
  "submissive",
  "manipulative",
  "vindictive",
  "anxious",
  "shocked",
  "hysterical",
  "apathetic",
  "suspicious",
  "hostile",
  "casual",
  "formal",
  "defensive",
]);

export const BehaviorMacroClassificationSchema = z.object({
  class: BehaviorMacroClassSchema,
  confidence: z.number().min(0).max(1),
  valence: z.enum(["positive", "negative", "tense", "neutral"]),
  energy: z.enum(["low", "medium", "high"]),
  reason: z.string(),
  matchedKeywords: z.array(z.string()),
  engineAction: z
    .enum(["trigger_intent", "blocked_by_soft_gate", "context_override"])
    .optional(),
  eventContext: z.string().optional(),
  gated: z.boolean().optional(),
  gatedReason: z.string().optional(),
});

export const CardLibraryTagsSchema = z.object({
  dynamics: z.array(z.string()),
  archetypes: z.array(z.string()),
  micro_tropes: z.array(z.string()),
});

export const CharacterCardMacroClassificationSchema = z.object({
  bdsm: BdsmIntentClassificationSchema.optional(),
  darkRomance: DarkRomanceIntentClassificationSchema.optional(),
  macro: MacroClassificationsSchema,
  behavior: BehaviorMacroClassificationSchema.optional(),
  comedy: ComedyIntentClassificationSchema.optional(),
  spicy: SpicyIntentClassificationSchema.optional(),
  tags: CardLibraryTagsSchema,
});

export type CharacterCardMacroClassification = z.infer<
  typeof CharacterCardMacroClassificationSchema
>;
export type BehaviorMacroClass = z.infer<typeof BehaviorMacroClassSchema>;
export type BehaviorMacroClassification = z.infer<
  typeof BehaviorMacroClassificationSchema
>;
