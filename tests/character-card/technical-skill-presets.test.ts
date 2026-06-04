import assert from "node:assert/strict";
import test from "node:test";

import {
  TECHNICAL_SKILL_PRESET_CATEGORIES,
  TECHNICAL_SKILL_PRESETS,
  compileTechnicalSkillPresetAdditions,
  findTechnicalSkillPresetById,
  getTechnicalSkillPresetsByCategory,
} from "../../data/technicalSkillPresets";

test("loads technical skill presets across software, systems, security, and sci-fi lanes", () => {
  assert.equal(TECHNICAL_SKILL_PRESETS.length, 324);
  assert.deepEqual(TECHNICAL_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Cybersecurity Skill",
    "Data Skill",
    "Dialogue Seed",
    "Fantasy Technical Skill",
    "Gate",
    "Hardware Engineering Skill",
    "High-Value Seed",
    "Infrastructure Skill",
    "Mastery",
    "Robotics And AI Skill",
    "Romance Hook",
    "Sci-Fi Technical Skill",
    "Software Skill",
    "Weakness",
  ]);

  const ids = TECHNICAL_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getTechnicalSkillPresetsByCategory("Software Skill").length, 20);
  assert.equal(getTechnicalSkillPresetsByCategory("Dialogue Seed").length, 24);
  assert.equal(getTechnicalSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises technical values for visible prompt text", () => {
  const modelling = findTechnicalSkillPresetById("technical_skill_cybersecurity_threat_modelling");
  const defence = findTechnicalSkillPresetById(
    "technical_skill_cybersecurity_social_engineering_defence",
  );
  const behaviour = findTechnicalSkillPresetById(
    "technical_skill_robotics_ai_robot_behaviour_tuning",
  );
  const visualisation = findTechnicalSkillPresetById("technical_skill_data_data_visualisation");
  const artefact = findTechnicalSkillPresetById(
    "technical_skill_fantasy_artefact_restoration",
  );
  const userData = findTechnicalSkillPresetById(
    "technical_skill_romance_hacker_protects_user_data",
  );
  const visibleText = TECHNICAL_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(modelling?.value, "threat modelling");
  assert.equal(defence?.value, "social engineering defence");
  assert.equal(behaviour?.value, "robot behaviour tuning");
  assert.equal(visualisation?.value, "data visualisation");
  assert.equal(artefact?.value, "artefact restoration");
  assert.equal(userData?.value, "hacker protects {{user}} data");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|modeling|defense|behavior|visualization|artifact|burned out|hacker protects user data/i,
  );
});

test("compiles technical presets as soft privacy-aware context", () => {
  const preset = findTechnicalSkillPresetById("technical_skill_cybersecurity_data_privacy");
  assert.ok(preset);

  const additions = compileTechnicalSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Technical skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft technical context/i);
  assert.match(additions.systemPromptAddition, /privacy ethics, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
