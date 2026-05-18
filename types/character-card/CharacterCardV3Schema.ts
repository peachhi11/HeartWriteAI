import { z } from "zod";

export const CharacterCardAssetV3Schema = z
  .object({
    type: z.string(),
    uri: z.string(),
    name: z.string(),
    ext: z.string(),
  })
  .passthrough();

export const LorebookEntryV3Schema = z
  .object({
    keys: z.array(z.string()).default([]),
    content: z.string().default(""),
    extensions: z.record(z.string(), z.unknown()).default({}),
    enabled: z.boolean().default(true),
    insertion_order: z.number().default(0),
    use_regex: z.boolean().default(false),
    case_sensitive: z.boolean().optional(),
    constant: z.boolean().optional(),
    name: z.string().optional(),
    priority: z.number().optional(),
    id: z.union([z.number(), z.string()]).optional(),
    comment: z.string().optional(),
    selective: z.boolean().optional(),
    secondary_keys: z.array(z.string()).optional(),
    position: z.enum(["before_char", "after_char"]).optional(),
  })
  .passthrough();

export const LorebookV3Schema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    scan_depth: z.number().optional(),
    token_budget: z.number().optional(),
    recursive_scanning: z.boolean().optional(),
    extensions: z.record(z.string(), z.unknown()).default({}),
    entries: z.array(LorebookEntryV3Schema).default([]),
  })
  .passthrough();

export const CharacterCardDataV3Schema = z
  .object({
    name: z.string().min(1),
    description: z.string().default(""),
    tags: z.array(z.string()).default([]),
    creator: z.string().default(""),
    character_version: z.string().default(""),
    mes_example: z.string().default(""),
    extensions: z.record(z.string(), z.unknown()).default({}),
    system_prompt: z.string().default(""),
    post_history_instructions: z.string().default(""),
    first_mes: z.string().default(""),
    alternate_greetings: z.array(z.string()).default([]),
    personality: z.string().default(""),
    scenario: z.string().default(""),
    creator_notes: z.string().default(""),
    character_book: LorebookV3Schema.optional(),
    assets: z.array(CharacterCardAssetV3Schema).optional(),
    nickname: z.string().optional(),
    creator_notes_multilingual: z.record(z.string(), z.string()).optional(),
    source: z.array(z.string()).optional(),
    group_only_greetings: z.array(z.string()).default([]),
    creation_date: z.number().optional(),
    modification_date: z.number().optional(),
  })
  .passthrough();

export const CharacterCardV3Schema = z
  .object({
    spec: z.literal("chara_card_v3"),
    spec_version: z.string(),
    data: CharacterCardDataV3Schema,
  })
  .passthrough();

export type ValidatedCharacterCardV3 = z.infer<typeof CharacterCardV3Schema>;
