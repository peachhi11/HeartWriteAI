import assert from "node:assert/strict";
import test from "node:test";

import {
  HUMAN_PRESET_CATEGORIES,
  HUMAN_PRESETS,
  compileHumanPresetAdditions,
  compileHumanPresetSummary,
  findHumanPresetById,
  getHumanPresetsByCategory,
} from "../../data/humanPresets";

test("loads human presets across grounded background and relationship lanes", () => {
  assert.equal(HUMAN_PRESETS.length, 225);
  assert.deepEqual(HUMAN_PRESET_CATEGORIES, [
    "Background",
    "Core Need",
    "Dialogue Seed",
    "Heritage",
    "Human Archetype",
    "Life Goal",
    "Occupation",
    "Romance Hook",
    "Strength",
    "Survival Experience",
    "Weakness",
  ]);

  assert.equal(getHumanPresetsByCategory("human archetype").length, 20);
  assert.equal(getHumanPresetsByCategory("occupation").length, 30);
  assert.equal(getHumanPresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable human values and AU/UK spelling", () => {
  const dreamer = findHumanPresetById("human_archetype_the_small_town_dreamer");
  const merchant = findHumanPresetById("human_heritage_merchant_family");
  const business = findHumanPresetById("human_occupation_business_owner");
  const humour = findHumanPresetById("human_strength_humour");
  const survived = findHumanPresetById("human_survival_survived_public_failure");

  assert.equal(dreamer?.label, "The Small Town Dreamer");
  assert.equal(merchant?.value, "merchant family");
  assert.equal(business?.value, "business owner");
  assert.equal(humour?.value, "humour");
  assert.equal(survived?.value, "survived public failure");

  const readableText = JSON.stringify(
    HUMAN_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /merchant_family|business_owner|self_doubt/i);
  assert.doesNotMatch(readableText, /humor/i);
});

test("compiles human presets as soft grounding and agency guidance", () => {
  const preset = findHumanPresetById("human_survival_survived_grief");
  assert.ok(preset);

  const summary = compileHumanPresetSummary(preset);
  const additions = compileHumanPresetAdditions(preset);

  assert.match(summary, /Human preset: Survival Experience - Survived Grief/);
  assert.match(additions.backgroundAddition, /should not define every behaviour/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft grounding context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /ordinary needs/i);
  assert.match(additions.systemPromptAddition, /heal slowly/);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
