import { z } from "zod";

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

export const CardLibraryTagsSchema = z.object({
  dynamics: z.array(z.string()),
  archetypes: z.array(z.string()),
  micro_tropes: z.array(z.string()),
});

export const CharacterCardMacroClassificationSchema = z.object({
  macro: MacroClassificationsSchema,
  tags: CardLibraryTagsSchema,
});

export type CharacterCardMacroClassification = z.infer<
  typeof CharacterCardMacroClassificationSchema
>;
