import assert from "node:assert/strict";
import test from "node:test";

import {
  SOCIAL_SKILL_PRESET_CATEGORIES,
  SOCIAL_SKILL_PRESETS,
  compileSocialSkillPresetAdditions,
  findSocialSkillPresetById,
  getSocialSkillPresetsByCategory,
} from "../../data/socialSkillPresets";

test("loads social skill presets across social, courtly, risky, and romance lanes", () => {
  assert.equal(SOCIAL_SKILL_PRESETS.length, 255);
  assert.deepEqual(SOCIAL_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Communication",
    "Courtly Skill",
    "Dialogue Seed",
    "Emotional Skill",
    "Leadership",
    "Manipulative Skill",
    "Mastery",
    "Networking",
    "Persuasion",
    "Romance Skill",
    "Social Presence",
    "Social Weakness",
  ]);

  const ids = SOCIAL_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSocialSkillPresetsByCategory("Archetype").length, 20);
  assert.equal(getSocialSkillPresetsByCategory("Manipulative Skill").length, 20);
  assert.equal(getSocialSkillPresetsByCategory("Dialogue Seed").length, 15);
});

test("normalises social skill values for visible prompt text", () => {
  const humour = findSocialSkillPresetById("social_skill_communication_humour_usage");
  const organising = findSocialSkillPresetById("social_skill_networking_community_organising");
  const manoeuvring = findSocialSkillPresetById("social_skill_courtly_political_manoeuvring");
  const favour = findSocialSkillPresetById("social_skill_courtly_favour_trading");
  const rumour = findSocialSkillPresetById("social_skill_manipulative_rumour_management");
  const judgement = findSocialSkillPresetById("social_skill_weakness_fear_of_judgement");
  const allText = JSON.stringify(SOCIAL_SKILL_PRESETS);

  assert.equal(humour?.value, "humour usage");
  assert.equal(organising?.value, "community organising");
  assert.equal(manoeuvring?.value, "political manoeuvring");
  assert.equal(favour?.value, "favour trading");
  assert.equal(rumour?.value, "rumour management");
  assert.equal(judgement?.value, "fear of judgement");
  assert.doesNotMatch(
    allText,
    /Use code with caution|humor|organizing|maneuvering|favor trading|rumor|judgment/i,
  );
});

test("compiles social skill presets as soft interpersonal context", () => {
  const preset = findSocialSkillPresetById("social_skill_romance_boundary_respect");
  assert.ok(preset);

  const additions = compileSocialSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Social skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft interpersonal context/i);
  assert.match(additions.systemPromptAddition, /preserve consent, boundaries, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("frames manipulative social skills as risky and consequence-aware", () => {
  const preset = findSocialSkillPresetById("social_skill_manipulative_gaslighting");
  assert.ok(preset);

  const additions = compileSocialSkillPresetAdditions(preset);

  assert.match(preset.guidance, /risky social manipulation/i);
  assert.match(preset.guidance, /never framed as healthy romance/i);
  assert.match(additions.systemPromptAddition, /consequences surface/i);
  assert.doesNotMatch(additions.systemPromptAddition, /player-forcing|override/i);
});
