import { z } from "zod";

export const BdsmIntentClassSchema = z.enum([
  "commanding",
  "restraining",
  "imposing",
  "chastising",
  "exacting",
  "obedient",
  "entreating",
  "enduring",
  "exposed",
  "melting",
  "teasing",
  "manipulative",
  "defiant",
  "possessive",
  "sensory",
  "breathless",
  "flustered",
  "sub_drop",
  "dom_space",
  "nurturing",
  "safework",
  "safe_amber",
  "safe_red",
  "formal",
]);

export const BdsmIntentClassificationSchema = z.object({
  active: z.boolean(),
  class: BdsmIntentClassSchema.optional(),
  confidence: z.number().min(0).max(1),
  hardInterrupt: z.boolean(),
  ipcEvent: z.string().optional(),
  label: z.string(),
  matchedKeywords: z.array(z.string()),
  reason: z.string(),
  weightedScore: z.number().min(0),
});

export type BdsmIntentClass = z.infer<typeof BdsmIntentClassSchema>;
export type BdsmIntentClassification = z.infer<
  typeof BdsmIntentClassificationSchema
>;

