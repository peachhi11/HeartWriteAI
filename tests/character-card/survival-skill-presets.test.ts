import assert from "node:assert/strict";
import test from "node:test";

import {
  SURVIVAL_SKILL_PRESET_CATEGORIES,
  SURVIVAL_SKILL_PRESETS,
  compileSurvivalSkillPresetAdditions,
  findSurvivalSkillPresetById,
  getSurvivalSkillPresetsByCategory,
} from "../../data/survivalSkillPresets";

test("loads survival skill presets across core, environment, romance, and recovery lanes", () => {
  assert.equal(SURVIVAL_SKILL_PRESETS.length, 210);
  assert.deepEqual(SURVIVAL_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Dialogue Seed",
    "Environment Skill",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Romance Hook",
    "Weakness",
  ]);

  const ids = SURVIVAL_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSurvivalSkillPresetsByCategory("Core Skill").length, 49);
  assert.equal(getSurvivalSkillPresetsByCategory("Dialogue Seed").length, 21);
  assert.equal(getSurvivalSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises survival values for visible prompt text", () => {
  const enclosed = findSurvivalSkillPresetById("survival_skill_weakness_panic_in_enclosed_spaces");
  const tent = findSurvivalSkillPresetById("survival_skill_romance_one_tent_forced_proximity");
  const userLost = findSurvivalSkillPresetById("survival_skill_romance_tracking_lost_user");
  const living = findSurvivalSkillPresetById(
    "survival_skill_romance_learning_to_live_not_just_survive",
  );
  const visibleText = SURVIVAL_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(enclosed?.value, "panic in enclosed spaces");
  assert.equal(tent?.value, "one-tent forced proximity");
  assert.equal(userLost?.value, "tracking lost {{user}}");
  assert.equal(living?.value, "learning to live, not just survive");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|tracking_lost_user|teaching_user|first_teaches_user/i,
  );
});

test("compiles survival presets as soft crisis-aware context", () => {
  const preset = findSurvivalSkillPresetById(
    "survival_skill_romance_survival_partners_to_lovers",
  );
  assert.ok(preset);

  const additions = compileSurvivalSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Survival skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft survival context/i);
  assert.match(additions.systemPromptAddition, /crisis pressure should not erase agency/i);
  assert.match(additions.systemPromptAddition, /survival mode should not become the whole romance/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps survival weakness and romance hooks agency-aware", () => {
  const mode = findSurvivalSkillPresetById("survival_skill_weakness_survival_mode");
  const sharedHeat = findSurvivalSkillPresetById("survival_skill_romance_shared_body_heat");
  assert.ok(mode);
  assert.ok(sharedHeat);

  assert.match(mode.guidance, /without making survival mode the whole character/i);
  assert.match(sharedHeat.guidance, /crisis pressure separate from consent/i);
});
