import assert from "node:assert/strict";
import test from "node:test";

import {
  FANTASY_SKILL_PRESET_CATEGORIES,
  FANTASY_SKILL_PRESETS,
  compileFantasySkillPresetAdditions,
  findFantasySkillPresetById,
  getFantasySkillPresetsByCategory,
} from "../../data/fantasySkillPresets";

test("loads fantasy skill presets across magic, creature, artefact, and romance lanes", () => {
  assert.equal(FANTASY_SKILL_PRESETS.length, 384);
  assert.deepEqual(FANTASY_SKILL_PRESET_CATEGORIES, [
    "Alchemy Skill",
    "Archetype",
    "Artefact Skill",
    "Core Magic Skill",
    "Creature Skill",
    "Dark Magic Skill",
    "Dialogue Seed",
    "Divination Skill",
    "Elemental Magic Skill",
    "Enchantment Skill",
    "Gate",
    "Healing Magic Skill",
    "High-Value Seed",
    "Mastery",
    "Protective Magic Skill",
    "Romance Hook",
    "Rune Craft Skill",
    "Summoning Skill",
    "Weakness",
  ]);

  const ids = FANTASY_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getFantasySkillPresetsByCategory("Core Magic Skill").length, 20);
  assert.equal(getFantasySkillPresetsByCategory("Dialogue Seed").length, 24);
  assert.equal(getFantasySkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises fantasy values for visible prompt text", () => {
  const armour = findFantasySkillPresetById("fantasy_skill_rune_craft_armour_runes");
  const artefact = findFantasySkillPresetById(
    "fantasy_skill_artefact_artefact_identification",
  );
  const jewellery = findFantasySkillPresetById(
    "fantasy_skill_artefact_enchanted_jewellery",
  );
  const userWard = findFantasySkillPresetById(
    "fantasy_skill_romance_protective_ward_for_user",
  );
  const recognises = findFantasySkillPresetById(
    "fantasy_skill_dialogue_the_ward_recognises_you",
  );
  const visibleText = FANTASY_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(armour?.value, "armour runes");
  assert.equal(artefact?.value, "artefact identification");
  assert.equal(jewellery?.value, "enchanted jewellery");
  assert.equal(userWard?.value, "protective ward for {{user}}");
  assert.equal(recognises?.value, "The ward recognises you.");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|armor|artifact|jewelry|recognizes|protective ward for user/i,
  );
});

test("compiles fantasy presets as soft consequence-aware context", () => {
  const preset = findFantasySkillPresetById("fantasy_skill_dark_blood_magic");
  assert.ok(preset);

  const additions = compileFantasySkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Fantasy skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft fantasy skill context/i);
  assert.match(additions.systemPromptAddition, /moral consequence, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
