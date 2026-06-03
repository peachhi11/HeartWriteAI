import assert from "node:assert/strict";
import test from "node:test";

import {
  ALIEN_PRESET_CATEGORIES,
  ALIEN_PRESETS,
  compileAlienPresetAdditions,
  compileAlienPresetSummary,
  findAlienPresetById,
  getAlienPresetsByCategory,
} from "../../data/alienPresets";

test("normalises alien preset categories and counts", () => {
  assert.equal(ALIEN_PRESETS.length, 280);
  assert.deepEqual(ALIEN_PRESET_CATEGORIES, [
    "Affiliation",
    "Age Category",
    "Alien Archetype",
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
  assert.equal(getAlienPresetsByCategory("alien archetype").length, 20);
  assert.equal(getAlienPresetsByCategory("lineage").length, 20);
  assert.equal(getAlienPresetsByCategory("physiology").length, 25);
  assert.equal(getAlienPresetsByCategory("age category").length, 15);
  assert.equal(getAlienPresetsByCategory("dialogue seed").length, 20);
});

test("normalises alien preset labels and pasted tokens", () => {
  assert.equal(
    findAlienPresetById("alien_archetype_the_alien_diplomat")?.label,
    "The Alien Diplomat",
  );
  assert.equal(
    findAlienPresetById("alien_lineage_nomad_fleet_lineage")?.value,
    "nomad fleet lineage",
  );
  assert.equal(
    findAlienPresetById("alien_physiology_adaptive_skin_colour")?.value,
    "adaptive skin colour",
  );
  assert.equal(
    findAlienPresetById("alien_physiology_shapeshifting")?.value,
    "shapeshifting",
  );
  assert.equal(
    findAlienPresetById("alien_affiliation_void_travellers")?.value,
    "void travellers",
  );
  assert.equal(
    findAlienPresetById(
      "alien_dialogue_your_species_is_endlessly_confusing",
    )?.value,
    "Your species is endlessly confusing.",
  );

  const readableText = ALIEN_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance].join(" "),
  ).join("\n");
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(
    readableText,
    /royal_dynasty|shape_shifting|void_travelers|adaptive_skin_color/i,
  );
});

test("compiles alien presets as agency-aware sci-fi romance guidance", () => {
  const preset = findAlienPresetById("alien_romance_first_contact_romance");

  assert.ok(preset);
  assert.match(
    compileAlienPresetSummary(preset),
    /Alien preset: Romance Hook - First Contact Romance/,
  );

  const additions = compileAlienPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /first contact romance/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft sci-fi romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /refuse telepathic contact/i);
  assert.match(additions.systemPromptAddition, /reject experiments/i);
  assert.match(additions.systemPromptAddition, /protect private memories/i);
  assert.match(additions.systemPromptAddition, /leave imperial, hive, or mission control/i);
  assert.doesNotMatch(additions.systemPromptAddition, /\bmust\b/i);
});
