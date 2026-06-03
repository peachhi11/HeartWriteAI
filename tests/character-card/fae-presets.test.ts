import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFaePresetAdditions,
  compileFaePresetSummary,
  FAE_PRESET_CATEGORIES,
  FAE_PRESETS,
  findFaePresetById,
  getFaePresetsByCategory,
} from "../../data/faePresets";

test("normalises fae preset categories and counts", () => {
  assert.equal(FAE_PRESETS.length, 275);
  assert.deepEqual(FAE_PRESET_CATEGORIES, [
    "Age Category",
    "Bloodline",
    "Court Affiliation",
    "Dialogue Seed",
    "Fae Archetype",
    "Feeding Style",
    "Humanity Level",
    "Lore Hook",
    "Mortality Relationship",
    "Physiology",
    "Romance Hook",
    "Secret Hook",
    "Strength",
    "Weakness",
  ]);
  assert.equal(getFaePresetsByCategory("fae archetype").length, 20);
  assert.equal(getFaePresetsByCategory("age category").length, 15);
  assert.equal(getFaePresetsByCategory("dialogue seed").length, 20);
});

test("normalises fae preset labels and pasted tokens", () => {
  assert.equal(
    findFaePresetById("fae_archetype_the_seelie_court_charmer")?.label,
    "The Seelie Court Charmer",
  );
  assert.equal(
    findFaePresetById("fae_bloodline_mushroom_circle_bloodline")?.value,
    "mushroom circle bloodline",
  );
  assert.equal(
    findFaePresetById("fae_mortality_fascinated_by_ageing")?.value,
    "fascinated by ageing",
  );
  assert.equal(
    findFaePresetById("fae_secret_secret_desire_to_be_mortal")?.value,
    "secret desire to be mortal",
  );
  assert.equal(
    findFaePresetById(
      "fae_dialogue_i_could_bargain_for_your_heart_but_i_would_rather_earn_it",
    )?.value,
    "I could bargain for your heart, but I would rather earn it.",
  );

  const readableText = FAE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance].join(" "),
  ).join("\n");
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /seelie_bloodline|mushroom_circle|secret_true_name/i);
  assert.doesNotMatch(readableText, /aging/i);
});

test("compiles fae presets as soft consent-aware guidance", () => {
  const preset = findFaePresetById("fae_romance_bargain_marriage");

  assert.ok(preset);
  assert.match(
    compileFaePresetSummary(preset),
    /Fae preset: Romance Hook - Bargain Marriage/,
  );

  const additions = compileFaePresetAdditions(preset);

  assert.match(additions.relationshipAddition, /preserve informed choice/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft romance-fantasy context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /refuse bargains/i);
  assert.match(additions.systemPromptAddition, /protect true names/i);
  assert.match(
    additions.systemPromptAddition,
    /reject memory or glamour manipulation/i,
  );
  assert.match(additions.systemPromptAddition, /leave the dance/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
