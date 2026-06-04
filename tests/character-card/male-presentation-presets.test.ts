import assert from "node:assert/strict";
import test from "node:test";

import {
  MALE_PRESENTATION_PRESET_CATEGORIES,
  MALE_PRESENTATION_PRESETS,
  compileMalePresentationPresetAdditions,
  findMalePresentationPresetById,
  getMalePresentationPresetsByCategory,
} from "../../data/malePresentationPresets";

test("loads male presentation presets across identity, physical, romance, and gate lanes", () => {
  assert.equal(MALE_PRESENTATION_PRESETS.length, 142);
  assert.deepEqual(MALE_PRESENTATION_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Identity",
    "Physical Texture",
    "Romance Hook",
    "Trait",
  ]);

  const ids = MALE_PRESENTATION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getMalePresentationPresetsByCategory("Archetype").length, 20);
  assert.equal(getMalePresentationPresetsByCategory("Identity").length, 20);
  assert.equal(getMalePresentationPresetsByCategory("Physical Texture").length, 20);
  assert.equal(getMalePresentationPresetsByCategory("Trait").length, 20);
  assert.equal(getMalePresentationPresetsByCategory("Romance Hook").length, 20);
  assert.equal(getMalePresentationPresetsByCategory("Gate").length, 12);
  assert.equal(getMalePresentationPresetsByCategory("Dialogue Seed").length, 10);
  assert.equal(getMalePresentationPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises male presentation values for visible prompt text", () => {
  const moustache = findMalePresentationPresetById(
    "male_presentation_physical_moustache",
  );
  const flirty = findMalePresentationPresetById("male_presentation_trait_flirty_man");
  const smileOnly = findMalePresentationPresetById(
    "male_presentation_romance_grumpy_man_smiles_only_for_user",
  );
  const devoted = findMalePresentationPresetById(
    "male_presentation_romance_devoted_man_chooses_user",
  );

  assert.equal(moustache?.value, "moustache");
  assert.equal(flirty?.value, "flirty man");
  assert.equal(smileOnly?.value, "grumpy man smiles only for {{user}}");
  assert.equal(devoted?.value, "devoted man chooses {{user}}");

  const visibleText = MALE_PRESENTATION_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|mustache|flirtatious|only for user|chooses user|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles male presentation presets as soft identity and romance guidance", () => {
  const preset = findMalePresentationPresetById(
    "male_presentation_high_value_safe_masculine_love_gate",
  );
  assert.ok(preset);

  const additions = compileMalePresentationPresetAdditions(preset);

  assert.match(additions.descriptionAddition, /Male presentation context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft male presentation context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid turning protection or devotion into control/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps protective male romance hooks boundary-respecting", () => {
  const preset = findMalePresentationPresetById(
    "male_presentation_romance_protective_man_respects_boundaries",
  );
  assert.ok(preset);

  assert.match(preset.guidance, /consent-aware and boundary-respecting/i);
});
