import assert from "node:assert/strict";
import test from "node:test";

import {
  INTELLECTUAL_SKILL_PRESET_CATEGORIES,
  INTELLECTUAL_SKILL_PRESETS,
  compileIntellectualSkillPresetAdditions,
  findIntellectualSkillPresetById,
  getIntellectualSkillPresetsByCategory,
} from "../../data/intellectualSkillPresets";

test("loads intellectual skill presets across analytical, academic, and romance lanes", () => {
  assert.equal(INTELLECTUAL_SKILL_PRESETS.length, 276);
  assert.deepEqual(INTELLECTUAL_SKILL_PRESET_CATEGORIES, [
    "Academic Skill",
    "Archetype",
    "Core Skill",
    "Creative Skill",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Investigative Skill",
    "Mastery",
    "Romance Hook",
    "Strategic Skill",
    "Technical Skill",
    "Weakness",
  ]);

  const ids = INTELLECTUAL_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getIntellectualSkillPresetsByCategory("Core Skill").length, 30);
  assert.equal(getIntellectualSkillPresetsByCategory("Academic Skill").length, 25);
  assert.equal(getIntellectualSkillPresetsByCategory("Dialogue Seed").length, 21);
});

test("normalises intellectual skill values for visible prompt text", () => {
  const judgement = findIntellectualSkillPresetById(
    "intellectual_skill_creative_aesthetic_judgement",
  );
  const manoeuvring = findIntellectualSkillPresetById(
    "intellectual_skill_strategic_outmanoeuvring_opponents",
  );
  const modelling = findIntellectualSkillPresetById(
    "intellectual_skill_technical_life_support_modelling",
  );
  const colour = findIntellectualSkillPresetById(
    "intellectual_skill_dialogue_you_reorganised_the_entire_problem_by_colour",
  );
  const userJudgement = findIntellectualSkillPresetById(
    "intellectual_skill_gate_first_trusts_user_judgement_gate",
  );
  const allText = JSON.stringify(INTELLECTUAL_SKILL_PRESETS);

  assert.equal(judgement?.value, "aesthetic judgement");
  assert.equal(manoeuvring?.value, "outmanoeuvring opponents");
  assert.equal(modelling?.value, "life support modelling");
  assert.equal(colour?.value, "You reorganised the entire problem by colour.");
  assert.equal(userJudgement?.value, "first trusts {{user}} judgement gate");
  assert.doesNotMatch(
    allText,
    /Use code with caution|judgment|outmaneuver|modeling|color|user judgment/i,
  );
});

test("compiles intellectual skill presets as soft reasoning context", () => {
  const preset = findIntellectualSkillPresetById(
    "intellectual_skill_romance_logic_fails_against_love",
  );
  assert.ok(preset);

  const additions = compileIntellectualSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Intellectual skill context/);
  assert.match(additions.personalityAddition, /without replacing emotional complexity/i);
  assert.match(additions.systemPromptAddition, /soft intellectual context/i);
  assert.match(additions.systemPromptAddition, /consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps investigative and mastery presets consequence-aware", () => {
  const investigative = findIntellectualSkillPresetById(
    "intellectual_skill_investigative_interrogation_strategy",
  );
  const brilliant = findIntellectualSkillPresetById(
    "intellectual_skill_mastery_brilliant_but_lonely",
  );
  assert.ok(investigative);
  assert.ok(brilliant);

  assert.match(investigative.guidance, /ethical limits and consequences/i);
  assert.match(brilliant.guidance, /loneliness may calibrate confidence and stakes/i);
});
