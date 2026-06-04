import assert from "node:assert/strict";
import test from "node:test";

import {
  CREATIVE_SKILL_PRESET_CATEGORIES,
  CREATIVE_SKILL_PRESETS,
  compileCreativeSkillPresetAdditions,
  findCreativeSkillPresetById,
  getCreativeSkillPresetsByCategory,
} from "../../data/creativeSkillPresets";

test("loads creative skill presets across art, craft, performance, and romance lanes", () => {
  assert.equal(CREATIVE_SKILL_PRESETS.length, 341);
  assert.deepEqual(CREATIVE_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Craft Skill",
    "Culinary Skill",
    "Design Skill",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Magical Creative Skill",
    "Mastery",
    "Media Skill",
    "Music Skill",
    "Performance Skill",
    "Romance Hook",
    "Visual Art Skill",
    "Weakness",
    "Writing Skill",
  ]);

  const ids = CREATIVE_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getCreativeSkillPresetsByCategory("Visual Art Skill").length, 20);
  assert.equal(getCreativeSkillPresetsByCategory("Dialogue Seed").length, 21);
  assert.equal(getCreativeSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises creative skill values for visible prompt text", () => {
  const jewelleryArchetype = findCreativeSkillPresetById(
    "creative_skill_archetype_the_jewellery_maker",
  );
  const watercolour = findCreativeSkillPresetById("creative_skill_visual_art_watercolour");
  const colourTheory = findCreativeSkillPresetById("creative_skill_core_colour_theory");
  const flavour = findCreativeSkillPresetById("creative_skill_culinary_flavour_pairing");
  const favourite = findCreativeSkillPresetById(
    "creative_skill_mastery_cult_favourite_creator",
  );
  const userMuse = findCreativeSkillPresetById("creative_skill_gate_first_user_as_muse_gate");
  const allText = JSON.stringify(CREATIVE_SKILL_PRESETS);

  assert.equal(jewelleryArchetype?.value, "The Jewellery Maker");
  assert.equal(watercolour?.value, "watercolour");
  assert.equal(colourTheory?.value, "colour theory");
  assert.equal(flavour?.value, "flavour pairing");
  assert.equal(favourite?.value, "cult favourite creator");
  assert.equal(userMuse?.value, "first {{user}} as muse gate");
  assert.doesNotMatch(
    allText,
    /Use code with caution|Jewelry|jewelry|watercolor|color theory|flavor|favorite|burned out|craftsman/i,
  );
});

test("compiles creative skill presets as soft artistic context", () => {
  const preset = findCreativeSkillPresetById("creative_skill_romance_artist_paints_user");
  assert.ok(preset);

  const additions = compileCreativeSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Creative skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft creative context/i);
  assert.match(additions.systemPromptAddition, /consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps creative vulnerability and muse hooks boundary-aware", () => {
  const muse = findCreativeSkillPresetById("creative_skill_romance_muse_becomes_beloved");
  const block = findCreativeSkillPresetById("creative_skill_weakness_creative_block");
  assert.ok(muse);
  assert.ok(block);

  assert.match(muse.guidance, /without making \{\{user\}\} an object/i);
  assert.match(block.guidance, /without flattening the character into suffering/i);
});
