import { z } from "zod";

export const DarkRomanceIntentClassSchema = z.enum([
  "obsessive",
  "possessive",
  "stalking",
  "territorial",
  "fixated",
  "captive",
  "coercive",
  "submissive",
  "dominant",
  "defiant",
  "gaslighting",
  "stockholm",
  "codependent",
  "manipulative",
  "delusional",
  "dread",
  "breathless",
  "intoxicated",
  "hysterical",
  "numb",
  "vindictive",
  "sombre",
  "hostile",
  "resigned",
]);

export const DarkRomanceStateSchema = z.object({
  control: z.number().min(0).max(100).optional(),
  obsession: z.number().min(0).max(100).optional(),
  sanity: z.number().min(0).max(100).optional(),
});

export const DarkRomanceStateDeltaSchema = z.object({
  controlDelta: z.number().int().min(-100).max(100),
  obsessionDelta: z.number().int().min(-100).max(100),
  sanityDelta: z.number().int().min(-100).max(100),
});

export const DarkRomanceIntentClassificationSchema = z.object({
  active: z.boolean(),
  class: DarkRomanceIntentClassSchema.optional(),
  confidence: z.number().min(0).max(1),
  gated: z.boolean(),
  gatedReason: z.string().optional(),
  label: z.string(),
  matchedKeywords: z.array(z.string()),
  reason: z.string(),
  stateDelta: DarkRomanceStateDeltaSchema.optional(),
  weightedScore: z.number().min(0),
});

export type DarkRomanceIntentClass = z.infer<
  typeof DarkRomanceIntentClassSchema
>;
export type DarkRomanceState = z.infer<typeof DarkRomanceStateSchema>;
export type DarkRomanceStateDelta = z.infer<
  typeof DarkRomanceStateDeltaSchema
>;
export type DarkRomanceIntentClassification = z.infer<
  typeof DarkRomanceIntentClassificationSchema
>;

