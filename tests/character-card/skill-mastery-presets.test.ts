import assert from "node:assert/strict";
import test from "node:test";

import {
  SKILL_MASTERY_PRESET_CATEGORIES,
  SKILL_MASTERY_PRESETS,
  compileSkillMasteryPresetAdditions,
  findSkillMasteryPresetById,
  getSkillMasteryPresetsByCategory,
} from "../../data/skillMasteryPresets";

test("loads skill mastery presets across training, confidence, failure, and romance lanes", () => {
  assert.equal(SKILL_MASTERY_PRESETS.length, 221);
  assert.deepEqual(SKILL_MASTERY_PRESET_CATEGORIES, [
    "Archetype",
    "Confidence",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Mastery Seed",
    "Romance Hook",
    "Training Source",
    "Weakness",
  ]);

  const ids = SKILL_MASTERY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSkillMasteryPresetsByCategory("Mastery Seed").length, 60);
  assert.equal(getSkillMasteryPresetsByCategory("Dialogue Seed").length, 21);
  assert.equal(getSkillMasteryPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises skill mastery values for visible prompt text", () => {
  const unrecognised = findSkillMasteryPresetById(
    "skill_mastery_archetype_the_unrecognised_expert",
  );
  const practised = findSkillMasteryPresetById("skill_mastery_seed_practised");
  const obsessive = findSkillMasteryPresetById("skill_mastery_seed_obsessively_practised");
  const burntOut = findSkillMasteryPresetById("skill_mastery_seed_burnt_out_master");
  const userTeaching = findSkillMasteryPresetById(
    "skill_mastery_romance_user_teaches_expert_humility",
  );
  const visibleText = SKILL_MASTERY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(unrecognised?.value, "The Unrecognised Expert");
  assert.equal(practised?.value, "practised");
  assert.equal(obsessive?.value, "obsessively practised");
  assert.equal(burntOut?.value, "burnt-out master");
  assert.equal(userTeaching?.value, "{{user}} teaches expert humility");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|Unrecognized|practiced|burned out|user teaches expert humility/i,
  );
});

test("compiles skill mastery presets as soft failure-aware context", () => {
  const preset = findSkillMasteryPresetById("skill_mastery_weakness_mastery_is_lonely");
  assert.ok(preset);

  const additions = compileSkillMasteryPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Skill mastery context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft skill mastery context/i);
  assert.match(additions.systemPromptAddition, /skill should not erase vulnerability/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
