import assert from "node:assert/strict";
import test from "node:test";

import {
  compileDemonPresetAdditions,
  compileDemonPresetSummary,
  DEMON_PRESET_CATEGORIES,
  DEMON_PRESETS,
  findDemonPresetById,
  getDemonPresetsByCategory,
} from "../../data/demonPresets";

test("normalises demon preset categories and counts", () => {
  assert.equal(DEMON_PRESETS.length, 280);
  assert.deepEqual(DEMON_PRESET_CATEGORIES, [
    "Age Category",
    "Bloodline",
    "Court Affiliation",
    "Demon Archetype",
    "Dialogue Seed",
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
  assert.equal(getDemonPresetsByCategory("demon archetype").length, 20);
  assert.equal(getDemonPresetsByCategory("physiology").length, 25);
  assert.equal(getDemonPresetsByCategory("age category").length, 15);
  assert.equal(getDemonPresetsByCategory("dialogue seed").length, 20);
});

test("normalises demon preset labels and pasted tokens", () => {
  assert.equal(
    findDemonPresetById("demon_archetype_the_contract_demon")?.label,
    "The Contract Demon",
  );
  assert.equal(
    findDemonPresetById("demon_bloodline_royal_infernal_bloodline")?.value,
    "royal infernal bloodline",
  );
  assert.equal(
    findDemonPresetById("demon_physiology_shapeshifting")?.value,
    "shapeshifting",
  );
  assert.equal(
    findDemonPresetById("demon_secret_secret_desire_for_forgiveness")?.value,
    "secret desire for forgiveness",
  );
  assert.equal(
    findDemonPresetById(
      "demon_dialogue_do_not_offer_your_soul_i_want_your_trust",
    )?.value,
    "Do not offer your soul. I want your trust.",
  );

  const readableText = DEMON_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance].join(" "),
  ).join("\n");
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(
    readableText,
    /royal_infernal|shape_shifting|secret_true_name/i,
  );
});

test("compiles demon presets as soft consent-aware guidance", () => {
  const preset = findDemonPresetById("demon_romance_contract_marriage");

  assert.ok(preset);
  assert.match(
    compileDemonPresetSummary(preset),
    /Demon preset: Romance Hook - Contract Marriage/,
  );

  const additions = compileDemonPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /preserve informed choice/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft dark-fantasy romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /refuse contracts/i);
  assert.match(additions.systemPromptAddition, /protect true names/i);
  assert.match(additions.systemPromptAddition, /reject soul bargains/i);
  assert.match(additions.systemPromptAddition, /reject temptation or transformation/i);
  assert.match(additions.systemPromptAddition, /leave the infernal court/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
