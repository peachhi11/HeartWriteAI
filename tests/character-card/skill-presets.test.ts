import assert from "node:assert/strict";
import test from "node:test";

import {
  SKILL_PRESET_CATEGORIES,
  SKILL_PRESETS,
  compileSkillPresetAdditions,
  findSkillPresetById,
  getSkillPresetsByCategory,
} from "../../data/skillPresets";

test("loads skill presets across practical, genre, and romance lanes", () => {
  assert.equal(SKILL_PRESETS.length, 365);
  assert.deepEqual(SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Business Skill",
    "Combat Skill",
    "Communication Skill",
    "Creative Skill",
    "Domestic Skill",
    "Fantasy Skill",
    "High-Value Skill Tag",
    "Intellectual Skill",
    "Mastery",
    "Medical Skill",
    "Romance Skill",
    "Sci-Fi Skill",
    "Social Skill",
    "Survival Skill",
    "Technical Skill",
    "Underworld Skill",
  ]);

  const ids = SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSkillPresetsByCategory("Social Skill").length, 30);
  assert.equal(getSkillPresetsByCategory("Combat Skill").length, 25);
  assert.equal(getSkillPresetsByCategory("Romance Skill").length, 20);
});

test("normalises readable skill values and removes pasted headers", () => {
  const organising = findSkillPresetById("skill_social_community_organising");
  const jewellery = findSkillPresetById("skill_creative_jewellery_making");
  const defence = findSkillPresetById("skill_combat_self_defence");
  const apology = findSkillPresetById("skill_romance_apologising");
  const artefact = findSkillPresetById("skill_fantasy_artefact_identification");
  const allText = JSON.stringify(SKILL_PRESETS);

  assert.equal(organising?.value, "community organising");
  assert.equal(jewellery?.value, "jewellery making");
  assert.equal(defence?.value, "self defence");
  assert.equal(apology?.value, "apologising");
  assert.equal(artefact?.value, "artefact identification");
  assert.doesNotMatch(
    allText,
    /Use code with caution|Social Skills|Communication Skills|organization|organizing|jewelry|self defense|apologizing|artifact/i,
  );
});

test("compiles skill presets as soft capability context", () => {
  const preset = findSkillPresetById("skill_romance_relationship_maintenance");
  assert.ok(preset);

  const additions = compileSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's personality/i);
  assert.match(additions.systemPromptAddition, /soft capability context/i);
  assert.match(additions.systemPromptAddition, /preserve consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
