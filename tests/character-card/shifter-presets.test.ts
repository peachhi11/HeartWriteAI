import assert from "node:assert/strict";
import test from "node:test";

import {
  SHIFTER_PRESET_CATEGORIES,
  SHIFTER_PRESETS,
  compileShifterPresetAdditions,
  compileShifterPresetSummary,
  findShifterPresetById,
  getShifterPresetsByCategory,
} from "../../data/shifterPresets";

test("normalises shifter preset categories and counts", () => {
  assert.equal(SHIFTER_PRESETS.length, 280);
  assert.deepEqual(SHIFTER_PRESET_CATEGORIES, [
    "Affiliation",
    "Age Category",
    "Bloodline",
    "Dialogue Seed",
    "Feeding Style",
    "Humanity Level",
    "Lore Hook",
    "Mortality Relationship",
    "Physiology",
    "Romance Hook",
    "Secret Hook",
    "Shifter Archetype",
    "Strength",
    "Weakness",
  ]);
  assert.equal(getShifterPresetsByCategory("shifter archetype").length, 20);
  assert.equal(getShifterPresetsByCategory("bloodline").length, 20);
  assert.equal(getShifterPresetsByCategory("physiology").length, 25);
  assert.equal(getShifterPresetsByCategory("age category").length, 15);
  assert.equal(getShifterPresetsByCategory("dialogue seed").length, 20);
});

test("normalises shifter preset labels and pasted tokens", () => {
  assert.equal(
    findShifterPresetById("shifter_archetype_the_wolf_alpha")?.label,
    "The Wolf Alpha",
  );
  assert.equal(
    findShifterPresetById("shifter_bloodline_direwolf_bloodline")?.value,
    "direwolf bloodline",
  );
  assert.equal(
    findShifterPresetById("shifter_strength_shapeshifting")?.value,
    "shapeshifting",
  );
  assert.equal(
    findShifterPresetById("shifter_romance_mate_bond_romance")?.value,
    "mate bond romance",
  );
  assert.equal(
    findShifterPresetById(
      "shifter_dialogue_my_instincts_recognised_you_long_before_my_heart_admitted_it",
    )?.value,
    "My instincts recognised you long before my heart admitted it.",
  );

  const readableText = SHIFTER_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance].join(" "),
  ).join("\n");
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /wolf_bloodline|shape_shifting|mate_bond/i);
});

test("compiles shifter presets as agency-aware paranormal romance guidance", () => {
  const preset = findShifterPresetById("shifter_romance_mate_bond_romance");

  assert.ok(preset);
  assert.match(
    compileShifterPresetSummary(preset),
    /Shifter preset: Romance Hook - Mate Bond Romance/,
  );

  const additions = compileShifterPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /mate bond romance/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft paranormal romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /refuse mate bonds/i);
  assert.match(additions.systemPromptAddition, /reject marking or claiming/i);
  assert.match(additions.systemPromptAddition, /leave pack or territory control/i);
  assert.match(additions.systemPromptAddition, /renegotiate instinct-driven expectations/i);
  assert.doesNotMatch(additions.systemPromptAddition, /\bmust\b/i);
});
