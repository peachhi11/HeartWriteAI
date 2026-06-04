import assert from "node:assert/strict";
import test from "node:test";

import {
  CRAFT_SKILL_PRESET_CATEGORIES,
  CRAFT_SKILL_PRESETS,
  compileCraftSkillPresetAdditions,
  findCraftSkillPresetById,
  getCraftSkillPresetsByCategory,
} from "../../data/craftSkillPresets";

test("loads craft skill presets across material, magical, romance, and mastery lanes", () => {
  assert.equal(CRAFT_SKILL_PRESETS.length, 326);
  assert.deepEqual(CRAFT_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Clay Stone Glass Craft Skill",
    "Core Craft Skill",
    "Dialogue Seed",
    "Domestic Craft Skill",
    "Gate",
    "High-Value Seed",
    "Leather Bone Natural Craft Skill",
    "Magical Craft Skill",
    "Mastery",
    "Metal Craft Skill",
    "Paper Book Craft Skill",
    "Romance Hook",
    "Textile Craft Skill",
    "Weakness",
    "Wood Craft Skill",
  ]);

  const ids = CRAFT_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getCraftSkillPresetsByCategory("Textile Craft Skill").length, 20);
  assert.equal(getCraftSkillPresetsByCategory("Dialogue Seed").length, 26);
  assert.equal(getCraftSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises craft skill values for visible prompt text", () => {
  const jeweller = findCraftSkillPresetById("craft_skill_archetype_the_jeweller");
  const armoursmithing = findCraftSkillPresetById("craft_skill_metal_armoursmithing");
  const jewellery = findCraftSkillPresetById("craft_skill_metal_jewellery_making");
  const enchanted = findCraftSkillPresetById("craft_skill_magical_enchanted_jewellery");
  const labour = findCraftSkillPresetById("craft_skill_weakness_underpaid_labour");
  const userGift = findCraftSkillPresetById("craft_skill_romance_makes_gift_for_user");
  const visibleText = CRAFT_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(jeweller?.value, "The Jeweller");
  assert.equal(armoursmithing?.value, "armoursmithing");
  assert.equal(jewellery?.value, "jewellery making");
  assert.equal(enchanted?.value, "enchanted jewellery");
  assert.equal(labour?.value, "underpaid labour");
  assert.equal(userGift?.value, "makes gift for {{user}}");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|Jeweler|armorsmithing|jewelry|underpaid labor|makes gift for user/i,
  );
});

test("compiles craft presets as soft tangible-care context", () => {
  const preset = findCraftSkillPresetById("craft_skill_romance_craft_as_devotion");
  assert.ok(preset);

  const additions = compileCraftSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Craft skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft craft skill context/i);
  assert.match(additions.systemPromptAddition, /craft should not become the whole character/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
