import assert from "node:assert/strict";
import test from "node:test";

import {
  compileDialectPresetAdditions,
  DIALECT_PRESET_CATEGORIES,
  DIALECT_PRESETS,
  findDialectPresetById,
} from "../../data/dialectPresets";

test("loads dialect presets with stable ids and categories", () => {
  assert.equal(DIALECT_PRESETS.length, 5);

  const ids = DIALECT_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(DIALECT_PRESET_CATEGORIES, [
    "Gritty Underworld/Noir",
    "Modern Street/Casual",
    "Regency/Gothic Aristocrat",
    "Rustic/Highland Frontier",
    "Synthetic/Cyber-Industrial",
  ]);
});

test("fixes cyber industrial phonological shift typo", () => {
  const cyber = must(findDialectPresetById("dialect_cyber_industrial"));

  assert.match(cyber.linguisticMarkers.phonologicalShifts, /pristine enunciation/i);
  assert.equal(
    Object.prototype.hasOwnProperty.call(cyber.linguisticMarkers, "phonologicalPhifts"),
    false,
  );
});

test("compiles dialect directives as optional guidance", () => {
  const noir = must(findDialectPresetById("dialect_gritty_noir"));
  const additions = compileDialectPresetAdditions(noir);

  assert.match(additions.speechStyleAddition, /Dialect preset/);
  assert.match(additions.systemPromptAddition, /optional voice texture/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must filter|penalize/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
