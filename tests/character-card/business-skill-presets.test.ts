import assert from "node:assert/strict";
import test from "node:test";

import {
  BUSINESS_SKILL_PRESET_CATEGORIES,
  BUSINESS_SKILL_PRESETS,
  compileBusinessSkillPresetAdditions,
  findBusinessSkillPresetById,
  getBusinessSkillPresetsByCategory,
} from "../../data/businessSkillPresets";

test("loads business skill presets across finance, operations, marketing, and romance lanes", () => {
  assert.equal(BUSINESS_SKILL_PRESETS.length, 219);
  assert.deepEqual(BUSINESS_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Dialogue Seed",
    "Finance Skill",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Operations Skill",
    "Romance Hook",
    "Sales And Marketing Skill",
    "Weakness",
  ]);

  const ids = BUSINESS_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getBusinessSkillPresetsByCategory("Finance Skill").length, 20);
  assert.equal(getBusinessSkillPresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getBusinessSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises business values for visible prompt text", () => {
  const modelling = findBusinessSkillPresetById("business_skill_finance_financial_modelling");
  const conflict = findBusinessSkillPresetById(
    "business_skill_weakness_career_against_love_conflict",
  );
  const gate = findBusinessSkillPresetById(
    "business_skill_gate_first_career_against_love_gate",
  );
  const visibleText = BUSINESS_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(modelling?.value, "financial modelling");
  assert.equal(conflict?.value, "career against love conflict");
  assert.equal(gate?.value, "first career against love gate");
  assert.doesNotMatch(visibleText, /Use code with caution|modeling|career vs love|career_vs/i);
});

test("compiles business presets as soft workplace and power-aware context", () => {
  const preset = findBusinessSkillPresetById("business_skill_romance_boss_drops_professional_mask");
  assert.ok(preset);

  const additions = compileBusinessSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Business skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft business context/i);
  assert.match(additions.systemPromptAddition, /workplace ethics, and \{\{user\}\} autonomy/i);
  assert.match(additions.systemPromptAddition, /power should remain consequence-aware/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
