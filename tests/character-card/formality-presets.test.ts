import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFormalityPresetAdditions,
  findFormalityPresetById,
  FORMALITY_PRESET_CATEGORIES,
  FORMALITY_PRESETS,
} from "../../data/formalityPresets";

test("loads formality presets with stable ids and categories", () => {
  assert.equal(FORMALITY_PRESETS.length, 5);

  const ids = FORMALITY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(FORMALITY_PRESET_CATEGORIES, [
    "Absolute/Imperial",
    "Conditional/Masked",
    "Familiar/Casual",
    "Hostile/Adversarial",
    "Hyper-Professional",
  ]);
});

test("keeps conditional masked category while removing brittle clinical phrasing", () => {
  const masked = must(findFormalityPresetById("formal_conditional_masked"));
  const allText = [
    masked.category,
    masked.lexicalTokens.formalityDirectives,
    masked.systemPromptTags.join(" "),
  ].join(" ");

  assert.equal(masked.category, "Conditional/Masked");
  assert.match(allText, /public\/private register switching/i);
  assert.doesNotMatch(allText, /bipolar syntax switching/i);
});

test("compiles formality as social-distance guidance", () => {
  const imperial = must(findFormalityPresetById("formal_absolute_imperial"));
  const additions = compileFormalityPresetAdditions(imperial);

  assert.match(additions.speechStyleAddition, /Title and address options/);
  assert.match(additions.systemPromptAddition, /optional social-distance/i);
  assert.match(additions.systemPromptAddition, /consent, reciprocity, and player agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /mandatory|must filter|penalize/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
