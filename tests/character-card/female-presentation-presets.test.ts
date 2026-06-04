import assert from "node:assert/strict";
import test from "node:test";

import {
  FEMALE_PRESENTATION_PRESET_CATEGORIES,
  FEMALE_PRESENTATION_PRESETS,
  compileFemalePresentationPresetAdditions,
  findFemalePresentationPresetById,
  getFemalePresentationPresetsByCategory,
} from "../../data/femalePresentationPresets";

test("loads female presentation presets across identity, physical, romance, and gate lanes", () => {
  assert.equal(FEMALE_PRESENTATION_PRESETS.length, 140);
  assert.deepEqual(FEMALE_PRESENTATION_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Identity",
    "Physical Texture",
    "Romance Hook",
    "Trait",
  ]);

  const ids = FEMALE_PRESENTATION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getFemalePresentationPresetsByCategory("Archetype").length, 20);
  assert.equal(getFemalePresentationPresetsByCategory("Identity").length, 20);
  assert.equal(getFemalePresentationPresetsByCategory("Physical Texture").length, 20);
  assert.equal(getFemalePresentationPresetsByCategory("Trait").length, 20);
  assert.equal(getFemalePresentationPresetsByCategory("Romance Hook").length, 18);
  assert.equal(getFemalePresentationPresetsByCategory("Gate").length, 12);
  assert.equal(getFemalePresentationPresetsByCategory("Dialogue Seed").length, 10);
  assert.equal(getFemalePresentationPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises female presentation values for visible prompt text", () => {
  const flirty = findFemalePresentationPresetById(
    "female_presentation_trait_flirty_woman",
  );
  const iceQueen = findFemalePresentationPresetById(
    "female_presentation_romance_ice_queen_melts_for_user",
  );
  const devoted = findFemalePresentationPresetById(
    "female_presentation_romance_devoted_woman_chooses_user",
  );
  const highValueIceQueen = findFemalePresentationPresetById(
    "female_presentation_high_value_ice_queen_melts_for_user",
  );

  assert.equal(flirty?.value, "flirty woman");
  assert.equal(iceQueen?.value, "ice queen melts for {{user}}");
  assert.equal(devoted?.value, "devoted woman chooses {{user}}");
  assert.equal(highValueIceQueen?.value, "ice queen melts for {{user}}");

  const visibleText = FEMALE_PRESENTATION_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|flirtatious|melts for user|chooses user|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles female presentation presets as soft identity and romance guidance", () => {
  const preset = findFemalePresentationPresetById(
    "female_presentation_high_value_safe_feminine_love_gate",
  );
  assert.ok(preset);

  const additions = compileFemalePresentationPresetAdditions(preset);

  assert.match(additions.descriptionAddition, /Female presentation context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft female presentation context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid turning care, protection, or devotion into obligation or control/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps protective female romance hooks boundary-respecting", () => {
  const preset = findFemalePresentationPresetById(
    "female_presentation_romance_protective_woman_respects_boundaries",
  );
  assert.ok(preset);

  assert.match(preset.guidance, /consent-aware and boundary-respecting/i);
});
