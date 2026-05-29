import { z } from "zod";

export const RomanceTropeClassSchema = z.enum([
  "protective",
  "flustered",
  "yearning",
  "antagonistic",
  "bantering",
  "recognized",
  "grudging",
  "thawing",
  "trucetaking",
  "performative",
  "slipped_mask",
  "bound",
  "smothered",
  "haunted",
  "familiar",
  "estranged",
  "reclaiming",
  "deferential",
  "commanding",
  "forbidden",
  "secretive",
  "defeating",
  "grumpy",
  "sunshine",
  "casual",
]);

export const RomanceTropeClassificationSchema = z.object({
  class: RomanceTropeClassSchema,
  confidence: z.number().min(0).max(1),
  matchedKeywords: z.array(z.string()),
  reason: z.string(),
});

export type RomanceTropeClass = z.infer<typeof RomanceTropeClassSchema>;
export type RomanceTropeClassification = z.infer<
  typeof RomanceTropeClassificationSchema
>;
