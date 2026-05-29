import { z } from "zod";

export const ComedyIntentClassSchema = z.enum([
  "sarcastic",
  "deadpan",
  "snarky",
  "bantering",
  "teasing",
  "absurdist",
  "gremlin",
  "goblin",
  "delusional",
  "exaggerated",
  "exasperated",
  "panicked",
  "clueless",
  "awkward",
  "deflective",
  "meta",
  "genre_savvy",
  "parodying",
  "sceptical",
  "goofy",
  "sappy",
  "cheerleading",
  "braggart",
  "clownish",
]);

export const ComedyLandingSchema = z.object({
  affectionDelta: z.number().int().min(-100).max(100),
  angstDelta: z.number().int().min(-100).max(100),
  landed: z.boolean(),
  npcReaction: z.enum([
    "PLAYFUL_SIGH",
    "AMUSED_SPARK",
    "ANNOYED_FREEZE",
    "CONFUSED_BLINK",
    "SOFTENED_SMILE",
    "SOCIAL_STATIC",
  ]),
  trustDelta: z.number().int().min(-100).max(100),
});

export const ComedyIntentClassificationSchema = z.object({
  active: z.boolean(),
  class: ComedyIntentClassSchema.optional(),
  confidence: z.number().min(0).max(1),
  label: z.string(),
  landing: ComedyLandingSchema.optional(),
  matchedKeywords: z.array(z.string()),
  reason: z.string(),
  weightedScore: z.number().min(0),
});

export type ComedyIntentClass = z.infer<typeof ComedyIntentClassSchema>;
export type ComedyLanding = z.infer<typeof ComedyLandingSchema>;
export type ComedyIntentClassification = z.infer<
  typeof ComedyIntentClassificationSchema
>;

