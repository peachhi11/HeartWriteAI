import { z } from "zod";

export const SpicyIntentClassSchema = z.enum([
  "seductive",
  "provocative",
  "flirtatious",
  "coquettish",
  "fervent",
  "captivated",
  "obsessive",
  "primal",
  "dominant",
  "submissive",
  "commanding",
  "yielding",
  "possessive",
  "guarded",
  "defiant",
  "forbidden",
  "roguish",
  "flustered",
  "breathless",
  "melted",
  "sensory",
  "vulnerable",
  "intimate",
  "hedonistic",
]);

export const SpicyIntentClassificationSchema = z.object({
  active: z.boolean(),
  class: SpicyIntentClassSchema.optional(),
  confidence: z.number().min(0).max(1),
  label: z.string(),
  reason: z.string(),
  matchedKeywords: z.array(z.string()),
  weightedScore: z.number().min(0),
});

export type SpicyIntentClass = z.infer<typeof SpicyIntentClassSchema>;
export type SpicyIntentClassification = z.infer<
  typeof SpicyIntentClassificationSchema
>;

