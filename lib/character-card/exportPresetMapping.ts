import type { CharacterCardDataV3 } from "../../types/character-card/CharacterCardDataV3";
import type { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";
import { createCharacterCardV3Export } from "./createCharacterCardV3Export";

export type CharacterExportPresetId =
  | "raw_text_files"
  | "ccv3_json"
  | "chub_ai"
  | "risu_ai"
  | "tavern_ai";

export type CharacterExportPresetFormat = "files" | "json";

export type CharacterCardExportModeId =
  | "solo_deep_character"
  | "group_party_functional"
  | "sillytavern_compact"
  | "markdown_prose";

export interface CharacterCardExportMode {
  id: CharacterCardExportModeId;
  label: string;
  description: string;
  defaultPresetId: CharacterExportPresetId;
  fieldStrategy: string;
  promptCompilerGuidance: readonly string[];
}

export interface CharacterExportFieldMapping {
  asset: CharacterExportAssetKey;
  optional?: boolean;
  target: string;
  wrapper?: string;
}

export interface CharacterExportPreset {
  description: string;
  fields: readonly CharacterExportFieldMapping[];
  format: CharacterExportPresetFormat;
  id: CharacterExportPresetId;
  metadata: Record<string, unknown>;
  name: string;
  outputPattern: string;
}

export type CharacterExportAssetKey =
  | "alternate_greetings"
  | "creator_notes"
  | "description"
  | "first_mes"
  | "mes_example"
  | "name"
  | "personality"
  | "post_history_instructions"
  | "scenario"
  | "system_prompt"
  | "tags";

export interface CharacterExportFile {
  contents: string;
  path: string;
}

export type CharacterExportPresetResult =
  | {
      files: readonly CharacterExportFile[];
      format: "files";
      mode?: CharacterCardExportMode;
      preset: CharacterExportPreset;
    }
  | {
      format: "json";
      mode?: CharacterCardExportMode;
      payload: Record<string, unknown> | CharacterCardV3;
      preset: CharacterExportPreset;
    };

export interface CreateCharacterExportPresetOptions {
  modeId?: CharacterCardExportModeId;
}

export const CHARACTER_EXPORT_PRESETS = [
  {
    description: "Separate text/markdown files for local review and archival.",
    fields: [
      { asset: "system_prompt", target: "system_prompt.txt" },
      { asset: "post_history_instructions", target: "post_history.txt" },
      { asset: "description", target: "character_sheet.txt" },
      { asset: "first_mes", target: "intro_scene.txt" },
      { asset: "scenario", optional: true, target: "scenario.txt" },
      { asset: "creator_notes", optional: true, target: "creator_notes.txt" },
    ],
    format: "files",
    id: "raw_text_files",
    metadata: {},
    name: "Raw Text Files",
    outputPattern: "{{character_name}}",
  },
  {
    description: "Native Character Card V3 JSON payload.",
    fields: [],
    format: "json",
    id: "ccv3_json",
    metadata: {},
    name: "CCv3 JSON",
    outputPattern: "{{character_name}}_ccv3.json",
  },
  {
    description: "Chub-compatible JSON field mapping.",
    fields: [
      { asset: "description", target: "description" },
      { asset: "system_prompt", target: "personality" },
      { asset: "first_mes", target: "first_mes" },
      { asset: "mes_example", target: "mes_example", wrapper: "<START>\n{{content}}" },
      { asset: "scenario", optional: true, target: "scenario" },
      { asset: "tags", optional: true, target: "tags" },
    ],
    format: "json",
    id: "chub_ai",
    metadata: {
      character_version: "1.0",
      creator: "HeartWriteAI",
    },
    name: "Chub AI",
    outputPattern: "{{character_name}}_chubai.json",
  },
  {
    description: "RisuAI-compatible character JSON field mapping.",
    fields: [
      { asset: "description", target: "desc" },
      { asset: "system_prompt", target: "personality" },
      { asset: "first_mes", target: "firstMessage" },
      { asset: "mes_example", target: "exampleMessage" },
      { asset: "tags", optional: true, target: "tags" },
    ],
    format: "json",
    id: "risu_ai",
    metadata: {
      type: "character",
      version: "1.0",
    },
    name: "RisuAI",
    outputPattern: "{{character_name}}_risuai.json",
  },
  {
    description: "TavernAI/SillyTavern JSON field mapping for card conversion.",
    fields: [
      { asset: "name", target: "name" },
      { asset: "description", target: "description" },
      { asset: "personality", target: "personality" },
      { asset: "scenario", optional: true, target: "scenario" },
      { asset: "first_mes", target: "first_mes" },
      {
        asset: "mes_example",
        target: "mes_example",
        wrapper: "<START>\n{{content}}",
      },
      { asset: "creator_notes", optional: true, target: "creator_notes" },
      { asset: "tags", optional: true, target: "tags" },
    ],
    format: "json",
    id: "tavern_ai",
    metadata: {
      spec: "chara_card_v2",
      spec_version: "2.0",
    },
    name: "TavernAI / SillyTavern",
    outputPattern: "{{character_name}}_tavernai.json",
  },
] as const satisfies readonly CharacterExportPreset[];

export const CHARACTER_CARD_EXPORT_MODES = [
  {
    id: "solo_deep_character",
    label: "Solo Deep Character",
    description:
      "Full psychological card mode for one-on-one roleplay where all card fields and examples can carry long-form character depth.",
    defaultPresetId: "ccv3_json",
    fieldStrategy:
      "Keep durable identity in description/personality, scenario in scenario, voice range in examples, and concrete current reminders in PHI.",
    promptCompilerGuidance: [
      "Use rich description and personality fields.",
      "Keep 6-10 useful example-message beats when available.",
      "Let semantic wounds, fears, desires, triggers, responses, and repair routes remain visible to the prompt compiler.",
    ],
  },
  {
    id: "group_party_functional",
    label: "Group / Party Functional",
    description:
      "Compact role clarity mode for group chats where a character may need to remain coherent even when only description persists.",
    defaultPresetId: "tavern_ai",
    fieldStrategy:
      "Put role, skills, current goal, hard constraints, and observable behavior in description; keep personality concise.",
    promptCompilerGuidance: [
      "Make the description self-contained.",
      "Prefer party function, current goal, and visible behavior over deep private lore.",
      "Avoid examples that make the character dominate group momentum.",
    ],
  },
  {
    id: "sillytavern_compact",
    label: "SillyTavern Compact",
    description:
      "SillyTavern-friendly card mode with concise fields, clear scenario, example messages, and short PHI-ready reminders.",
    defaultPresetId: "tavern_ai",
    fieldStrategy:
      "Keep field boundaries clear: description for identity, personality for stable pattern, scenario for current setup, examples for voice, PHI for immediate behavior.",
    promptCompilerGuidance: [
      "Use concise markdown or natural language rather than heavy JSON/XML inside card prose.",
      "Pair negative constraints with positive alternatives.",
      "Keep post-history instructions short and concrete.",
    ],
  },
  {
    id: "markdown_prose",
    label: "Markdown Prose",
    description:
      "Readable review mode for creators who want clean markdown/natural prose before exporting to a platform-specific card shape.",
    defaultPresetId: "raw_text_files",
    fieldStrategy:
      "Export separated markdown/text assets for human review, editing, and prose QC before final CCv3 or Tavern-style packaging.",
    promptCompilerGuidance: [
      "Use headings and lists for reviewability.",
      "Preserve all prompt-safe prose while keeping internal semantic IDs out of visible card text.",
      "Use QC checklist items before platform export.",
    ],
  },
] as const satisfies readonly CharacterCardExportMode[];

export function listCharacterExportPresets(): readonly CharacterExportPreset[] {
  return CHARACTER_EXPORT_PRESETS;
}

export function listCharacterCardExportModes(): readonly CharacterCardExportMode[] {
  return CHARACTER_CARD_EXPORT_MODES;
}

export function findCharacterExportPreset(
  presetId: CharacterExportPresetId,
): CharacterExportPreset {
  const preset = CHARACTER_EXPORT_PRESETS.find(({ id }) => id === presetId);

  if (!preset) {
    throw new Error(`Unknown character export preset: ${presetId}`);
  }

  return preset;
}

export function findCharacterCardExportMode(
  modeId: CharacterCardExportModeId,
): CharacterCardExportMode {
  const mode = CHARACTER_CARD_EXPORT_MODES.find(({ id }) => id === modeId);

  if (!mode) {
    throw new Error(`Unknown character export mode: ${modeId}`);
  }

  return mode;
}

export function createCharacterExportPresetResult(
  card: CharacterCardV3,
  presetId: CharacterExportPresetId,
  options: CreateCharacterExportPresetOptions = {},
): CharacterExportPresetResult {
  const preset = findCharacterExportPreset(presetId);
  const mode = options.modeId
    ? findCharacterCardExportMode(options.modeId)
    : undefined;
  const normalizedCard = createCharacterCardV3Export(card);

  if (preset.id === "ccv3_json") {
    return {
      format: "json",
      mode,
      payload: normalizedCard,
      preset,
    };
  }

  if (preset.format === "files") {
    return {
      files: preset.fields
        .map((mapping) => createMappedFile(normalizedCard.data, mapping))
        .filter((file): file is CharacterExportFile => Boolean(file)),
      format: "files",
      mode,
      preset,
    };
  }

  return {
    format: "json",
    mode,
    payload: createMappedJsonPayload(normalizedCard.data, preset),
    preset,
  };
}

export function resolveCharacterExportFileName(
  characterName: string,
  presetId: CharacterExportPresetId,
): string {
  const preset = findCharacterExportPreset(presetId);

  return preset.outputPattern.replace(
    "{{character_name}}",
    toSafeFilename(characterName || "character"),
  );
}

function createMappedFile(
  data: CharacterCardDataV3,
  mapping: CharacterExportFieldMapping,
): CharacterExportFile | undefined {
  const contents = readAssetValue(data, mapping);

  if (!contents && mapping.optional) {
    return undefined;
  }

  return {
    contents,
    path: mapping.target,
  };
}

function createMappedJsonPayload(
  data: CharacterCardDataV3,
  preset: CharacterExportPreset,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    ...preset.metadata,
  };

  for (const mapping of preset.fields) {
    const value = readAssetValue(data, mapping);
    if (!value && mapping.optional) {
      continue;
    }

    payload[mapping.target] = mapping.asset === "tags" ? data.tags : value;
  }

  if (!payload.name && data.name) {
    payload.name = data.name;
  }

  return payload;
}

function readAssetValue(
  data: CharacterCardDataV3,
  mapping: CharacterExportFieldMapping,
): string {
  const value = readRawAssetValue(data, mapping.asset);

  if (!mapping.wrapper) {
    return value;
  }

  return mapping.wrapper
    .replace("{{char}}", data.name || "{{char}}")
    .replace("{{content}}", value)
    .replace("{{user}}", "{{user}}");
}

function readRawAssetValue(
  data: CharacterCardDataV3,
  asset: CharacterExportAssetKey,
): string {
  if (asset === "alternate_greetings") {
    return data.alternate_greetings.join("\n\n");
  }
  if (asset === "tags") {
    return data.tags.join(", ");
  }

  const value = data[asset];

  return typeof value === "string" ? value : "";
}

function toSafeFilename(value: string): string {
  return value
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
}
