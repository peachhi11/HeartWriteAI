import assert from "node:assert/strict";
import test from "node:test";

import {
  createCharacterExportPresetResult,
  findCharacterCardExportMode,
  listCharacterCardExportModes,
  listCharacterExportPresets,
  resolveCharacterExportFileName,
} from "../../lib/character-card/exportPresetMapping";
import type { CharacterCardDataV3 } from "../../types/character-card/CharacterCardDataV3";
import type { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";

const card: CharacterCardV3 = {
  spec: "chara_card_v3",
  spec_version: "3.0",
  data: {
    alternate_greetings: ["Alternate hello."],
    character_version: "1.0",
    creator: "HeartWriteAI",
    creator_notes: "Creator note.",
    description: "A controlled museum registrar.",
    extensions: {},
    first_mes: "The hallway went quiet.",
    group_only_greetings: [],
    mes_example: "{{char}}: Be specific.",
    name: "Maren Voss",
    personality: "Controlled, exacting, patient.",
    post_history_instructions: "Remember access terms.",
    scenario: "Museum back hallway.",
    system_prompt: "Stay in character.",
    tags: ["slow burn", "registrar"],
  },
};

test("lists built-in export presets", () => {
  assert.deepEqual(
    listCharacterExportPresets().map((preset) => preset.id),
    ["raw_text_files", "ccv3_json", "chub_ai", "risu_ai", "tavern_ai"],
  );
});

test("lists card export modes for UI toggles", () => {
  assert.deepEqual(
    listCharacterCardExportModes().map((mode) => mode.id),
    [
      "solo_deep_character",
      "group_party_functional",
      "sillytavern_compact",
      "markdown_prose",
    ],
  );

  const compact = findCharacterCardExportMode("sillytavern_compact");

  assert.equal(compact.defaultPresetId, "tavern_ai");
  assert.match(compact.fieldStrategy, /description for identity/i);
  assert.equal(
    compact.promptCompilerGuidance.some((line) =>
      /positive alternatives/i.test(line),
    ),
    true,
  );
});

test("maps raw export preset to separate asset files", () => {
  const result = createCharacterExportPresetResult(card, "raw_text_files");

  assert.equal(result.format, "files");
  assert.ok(result.files.some((file) => file.path === "system_prompt.txt"));
  assert.ok(result.files.some((file) => file.path === "post_history.txt"));
});

test("maps Tavern-style export payload without losing tags or first message", () => {
  const result = createCharacterExportPresetResult(card, "tavern_ai");

  assert.equal(result.format, "json");
  assert.equal(result.payload.spec, "chara_card_v2");
  assert.equal(result.payload.name, "Maren Voss");
  assert.equal(result.payload.first_mes, "The hallway went quiet.");
  assert.deepEqual(result.payload.tags, ["slow burn", "registrar"]);
  assert.match(String(result.payload.mes_example), /<START>/);
});

test("keeps native CCv3 export available as a preset", () => {
  const result = createCharacterExportPresetResult(card, "ccv3_json", {
    modeId: "solo_deep_character",
  });

  assert.equal(result.format, "json");
  assert.equal(result.mode?.id, "solo_deep_character");
  assert.equal(result.payload.spec, "chara_card_v3");
  assert.equal((result.payload.data as CharacterCardDataV3).name, "Maren Voss");
});

test("resolves export filenames safely", () => {
  assert.equal(
    resolveCharacterExportFileName("Maren Voss: Archive/Key", "chub_ai"),
    "maren_voss_archivekey_chubai.json",
  );
});
