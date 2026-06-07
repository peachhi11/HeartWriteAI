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
      preset: CharacterExportPreset;
    }
  | {
      format: "json";
      payload: Record<string, unknown> | CharacterCardV3;
      preset: CharacterExportPreset;
    };

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

export function listCharacterExportPresets(): readonly CharacterExportPreset[] {
  return CHARACTER_EXPORT_PRESETS;
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

export function createCharacterExportPresetResult(
  card: CharacterCardV3,
  presetId: CharacterExportPresetId,
): CharacterExportPresetResult {
  const preset = findCharacterExportPreset(presetId);
  const normalizedCard = createCharacterCardV3Export(card);

  if (preset.id === "ccv3_json") {
    return {
      format: "json",
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
      preset,
    };
  }

  return {
    format: "json",
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
