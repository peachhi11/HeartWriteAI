import assert from "node:assert/strict";
import test from "node:test";

import {
  COMBAT_SKILL_PRESET_CATEGORIES,
  COMBAT_SKILL_PRESETS,
  compileCombatSkillPresetAdditions,
  findCombatSkillPresetById,
  getCombatSkillPresetsByCategory,
} from "../../data/combatSkillPresets";

test("loads combat skill presets across weapon, tactical, protective, and romance lanes", () => {
  assert.equal(COMBAT_SKILL_PRESETS.length, 285);
  assert.deepEqual(COMBAT_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Dialogue Seed",
    "Fantasy Combat Skill",
    "Gate",
    "High-Value Seed",
    "Martial Art",
    "Mastery",
    "Protective Skill",
    "Romance Hook",
    "Sci-Fi Combat Skill",
    "Tactical Skill",
    "Weakness",
    "Weapon Skill",
  ]);

  const ids = COMBAT_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getCombatSkillPresetsByCategory("Weapon Skill").length, 20);
  assert.equal(getCombatSkillPresetsByCategory("Dialogue Seed").length, 25);
  assert.equal(getCombatSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises combat values for visible prompt text", () => {
  const nonLethal = findCombatSkillPresetById("combat_skill_core_non_lethal_combat");
  const selfDefence = findCombatSkillPresetById("combat_skill_martial_art_self_defence");
  const prioritisation = findCombatSkillPresetById("combat_skill_tactical_target_prioritisation");
  const armour = findCombatSkillPresetById("combat_skill_scifi_powered_armour_combat");
  const judgement = findCombatSkillPresetById("combat_skill_weakness_anger_clouds_judgement");
  const userThreat = findCombatSkillPresetById(
    "combat_skill_protective_stands_between_user_and_threat",
  );
  const visibleText = COMBAT_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(nonLethal?.value, "non-lethal combat");
  assert.equal(selfDefence?.value, "self-defence");
  assert.equal(prioritisation?.value, "target prioritisation");
  assert.equal(armour?.value, "powered armour combat");
  assert.equal(judgement?.value, "anger clouds judgement");
  assert.equal(userThreat?.value, "stands between {{user}} and threat");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|self defense|safehouse defense|airlock defense|colony defense|powered armor|judgment|target prioritization|stands_between_user/i,
  );
});

test("compiles combat presets as soft consequence-aware context", () => {
  const preset = findCombatSkillPresetById("combat_skill_romance_warrior_learns_gentleness");
  assert.ok(preset);

  const additions = compileCombatSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Combat skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft combat context/i);
  assert.match(additions.systemPromptAddition, /protection should not become control/i);
  assert.match(additions.systemPromptAddition, /violence should carry consequence/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps protective combat boundary-aware", () => {
  const protective = findCombatSkillPresetById("combat_skill_protective_protects_without_controlling");
  const rage = findCombatSkillPresetById("combat_skill_romance_user_calms_battle_rage");
  assert.ok(protective);
  assert.ok(rage);

  assert.match(protective.guidance, /avoiding control/i);
  assert.match(rage.guidance, /consent and aftermath visible/i);
});
