import assert from "node:assert/strict";
import test from "node:test";

import {
  ANGEL_PRESET_CATEGORIES,
  ANGEL_PRESETS,
  compileAngelPresetAdditions,
  compileAngelPresetSummary,
  findAngelPresetById,
  getAngelPresetsByCategory,
} from "../../data/angelPresets";

test("normalises angel preset categories and counts", () => {
  assert.equal(ANGEL_PRESETS.length, 275);
  assert.deepEqual(ANGEL_PRESET_CATEGORIES, [
    "Age Category",
    "Angel Archetype",
    "Court Affiliation",
    "Dialogue Seed",
    "Feeding Style",
    "Humanity Level",
    "Lineage",
    "Lore Hook",
    "Mortality Relationship",
    "Physiology",
    "Romance Hook",
    "Secret Hook",
    "Strength",
    "Weakness",
  ]);
  assert.equal(getAngelPresetsByCategory("angel archetype").length, 20);
  assert.equal(getAngelPresetsByCategory("lineage").length, 20);
  assert.equal(getAngelPresetsByCategory("age category").length, 15);
  assert.equal(getAngelPresetsByCategory("dialogue seed").length, 20);
});

test("normalises angel preset labels and pasted tokens", () => {
  assert.equal(
    findAngelPresetById("angel_archetype_the_guardian_angel")?.label,
    "The Guardian Angel",
  );
  assert.equal(
    findAngelPresetById("angel_lineage_archangel_lineage")?.value,
    "archangel lineage",
  );
  assert.equal(
    findAngelPresetById("angel_romance_grace_fades_for_love")?.value,
    "grace fades for love",
  );
  assert.equal(
    findAngelPresetById("angel_secret_secret_desire_for_human_life")?.value,
    "secret desire for human life",
  );
  assert.equal(
    findAngelPresetById(
      "angel_dialogue_the_stars_called_this_destiny_i_call_it_a_choice",
    )?.value,
    "The stars called this destiny. I call it a choice.",
  );

  const readableText = ANGEL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance].join(" "),
  ).join("\n");
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /archangel_lineage|hidden_wings|secret_true_name/i);
});

test("compiles angel presets as soft consent-aware guidance", () => {
  const preset = findAngelPresetById("angel_romance_guardian_and_protected");

  assert.ok(preset);
  assert.match(
    compileAngelPresetSummary(preset),
    /Angel preset: Romance Hook - Guardian And Protected/,
  );

  const additions = compileAngelPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /preserve informed choice/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft celestial romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /refuse protection/i);
  assert.match(additions.systemPromptAddition, /reject prophecy/i);
  assert.match(additions.systemPromptAddition, /protect true names/i);
  assert.match(additions.systemPromptAddition, /reject fate or transformation/i);
  assert.match(additions.systemPromptAddition, /leave the heavenly court/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
