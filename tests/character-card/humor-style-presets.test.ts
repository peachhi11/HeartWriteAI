import assert from "node:assert/strict";
import test from "node:test";

import {
  compileHumourStylePresetAdditions,
  compileHumourStylePresetSummary,
  findHumourStylePresetById,
  getHumourStylePresetsByCategory,
  HUMOUR_STYLE_PRESET_CATEGORIES,
  HUMOUR_STYLE_PRESETS,
} from "../../data/humorStylePresets";

test("loads humour style presets across joke style and romance lanes", () => {
  assert.equal(HUMOUR_STYLE_PRESETS.length, 127);
  assert.deepEqual(HUMOUR_STYLE_PRESET_CATEGORIES, [
    "Archetype",
    "Boundary",
    "Dialogue Seed",
    "Gate",
    "Humour Style",
    "Intent",
    "Romance",
  ]);

  const ids = HUMOUR_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("humour_")));
  assert.equal(getHumourStylePresetsByCategory("archetype").length, 20);
  assert.equal(getHumourStylePresetsByCategory("humour style").length, 35);
  assert.equal(getHumourStylePresetsByCategory("intent").length, 15);
  assert.equal(getHumourStylePresetsByCategory("romance").length, 15);
  assert.equal(getHumourStylePresetsByCategory("boundary").length, 10);
  assert.equal(getHumourStylePresetsByCategory("gate").length, 12);
  assert.equal(getHumourStylePresetsByCategory("dialogue seed").length, 20);
});

test("normalises humour values and keeps dialogue examples readable", () => {
  const allText = JSON.stringify(HUMOUR_STYLE_PRESETS);
  const valueText = HUMOUR_STYLE_PRESETS.map((preset) => preset.value).join("\n");
  const archetype = findHumourStylePresetById("humour_archetype_the_dry_humourist");
  const style = findHumourStylePresetById("humour_style_dark_humour");
  const boundary = findHumourStylePresetById(
    "humour_boundary_apologises_if_joke_hurts",
  );
  const dialogue = findHumourStylePresetById(
    "humour_dialogue_fine_you_are_my_favourite_bad_decision",
  );

  assert.equal(archetype?.value, "The Dry Humourist");
  assert.equal(style?.value, "dark humour");
  assert.equal(boundary?.value, "apologises if joke hurts");
  assert.equal(dialogue?.value, "Fine. You are my favourite bad decision.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /humor|favorite|apologizes/i);
});

test("compiles humour style presets as soft boundary-aware guidance", () => {
  const preset = findHumourStylePresetById("humour_archetype_the_playful_tease");
  assert.ok(preset);

  const summary = compileHumourStylePresetSummary(preset);
  const additions = compileHumourStylePresetAdditions(preset);

  assert.match(summary, /Humour style preset: Archetype - The Playful Tease/);
  assert.match(additions.personalityAddition, /soft personality texture/i);
  assert.match(additions.relationshipAddition, /shared jokes/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /sensitive-topic boundaries/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
