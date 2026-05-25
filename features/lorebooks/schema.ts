import { z } from "zod";

const extensionRecord = z.record(z.string(), z.unknown()).default({});
const nonEmptyString = z.string().trim().min(1);

const optionalInt = z.preprocess(
  (value) => value ?? undefined,
  z.number().int().optional(),
);

export const LorebookV3PositionSchema = z.enum([
  "before_char",
  "after_char",
]);

export const HeartWriteLorebookEntryKindSchema = z.enum([
  "world",
  "character",
  "scenario",
  "relationship",
  "sensory",
  "physical_tell",
  "behavioral_tell",
  "runtime",
  "custom",
]);

export const HeartWriteLorebookRuntimeSchema = z
  .object({
    blockedByEvents: z.array(z.string()).default([]),
    cooldownTurns: z.number().int().min(0).max(100).optional(),
    emotionalTags: z.array(z.string()).default([]),
    entryKind: HeartWriteLorebookEntryKindSchema.default("custom"),
    requiredEvents: z.array(z.string()).default([]),
    source: z.string().default("heartwriteai"),
    tokenBudgetHint: z.number().int().min(0).optional(),
    weight: z.number().min(0).max(1).optional(),
  })
  .passthrough();

export const LorebookV3EntrySchema = z
  .object({
    case_sensitive: z.boolean().optional(),
    comment: z.string().optional(),
    constant: z.boolean().default(false),
    content: nonEmptyString,
    enabled: z.boolean().default(true),
    extensions: extensionRecord,
    id: z.union([z.number().int(), z.string()]).optional(),
    insertion_order: z.preprocess(
      (value) => value ?? 0,
      z.number().int(),
    ),
    keys: z.array(nonEmptyString).default([]),
    name: z.string().optional(),
    position: LorebookV3PositionSchema.optional(),
    priority: optionalInt,
    secondary_keys: z.array(nonEmptyString).optional(),
    selective: z.boolean().optional(),
    use_regex: z.boolean().default(false),
  })
  .passthrough();

export const LorebookV3Schema = z
  .object({
    description: z.string().optional(),
    entries: z.array(LorebookV3EntrySchema).default([]),
    extensions: extensionRecord,
    name: z.string().optional(),
    recursive_scanning: z.boolean().optional(),
    scan_depth: optionalInt,
    token_budget: optionalInt,
  })
  .passthrough();

export const LorebookV3DocumentSchema = z.object({
  data: LorebookV3Schema,
  spec: z.literal("lorebook_v3"),
});

export type HeartWriteLorebookRuntime = z.infer<
  typeof HeartWriteLorebookRuntimeSchema
>;
export type LorebookV3 = z.infer<typeof LorebookV3Schema>;
export type LorebookV3Document = z.infer<typeof LorebookV3DocumentSchema>;
export type LorebookV3Entry = z.infer<typeof LorebookV3EntrySchema>;

export function parseLorebookV3Document(input: unknown): LorebookV3Document {
  return LorebookV3DocumentSchema.parse(input);
}

export function createLorebookV3Document(data: LorebookV3): LorebookV3Document {
  return LorebookV3DocumentSchema.parse({
    data,
    spec: "lorebook_v3",
  });
}

