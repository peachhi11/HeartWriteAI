import assert from "node:assert/strict";
import test from "node:test";

import {
  ROMANCE_RELEVANT_SKILL_PRESET_CATEGORIES,
  ROMANCE_RELEVANT_SKILL_PRESETS,
  compileRomanceRelevantSkillPresetAdditions,
  findRomanceRelevantSkillPresetById,
  getRomanceRelevantSkillPresetsByCategory,
} from "../../data/romanceRelevantSkillPresets";

test("loads romance-relevant skill presets across trust, support, repair, and intimacy lanes", () => {
  assert.equal(ROMANCE_RELEVANT_SKILL_PRESETS.length, 257);
  assert.deepEqual(ROMANCE_RELEVANT_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Communication Skill",
    "Conflict Repair Skill",
    "Core Romance Skill",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Intimacy Skill",
    "Support Skill",
    "Trust Skill",
    "Weakness",
  ]);

  const ids = ROMANCE_RELEVANT_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getRomanceRelevantSkillPresetsByCategory("Core Romance Skill").length, 56);
  assert.equal(getRomanceRelevantSkillPresetsByCategory("Dialogue Seed").length, 21);
  assert.equal(getRomanceRelevantSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises romance-relevant values for visible prompt text", () => {
  const supportsAgency = findRomanceRelevantSkillPresetById(
    "romance_relevant_skill_core_supports_user_agency",
  );
  const apologises = findRomanceRelevantSkillPresetById(
    "romance_relevant_skill_communication_apologises_without_excuses",
  );
  const honours = findRomanceRelevantSkillPresetById(
    "romance_relevant_skill_trust_honours_pace",
  );
  const weaponise = findRomanceRelevantSkillPresetById(
    "romance_relevant_skill_trust_does_not_weaponise_vulnerability",
  );
  const manages = findRomanceRelevantSkillPresetById(
    "romance_relevant_skill_conflict_repair_does_not_make_user_manage_emotions",
  );
  const visibleText = ROMANCE_RELEVANT_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(supportsAgency?.value, "supports {{user}} agency");
  assert.equal(apologises?.value, "apologises without excuses");
  assert.equal(honours?.value, "honours pace");
  assert.equal(weaponise?.value, "does not weaponise vulnerability");
  assert.equal(manages?.value, "does not make {{user}} manage emotions");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|supports user agency|apologizes|apologize|honors|weaponize|make user manage/i,
  );
});

test("compiles romance-relevant presets as soft earned-safety context", () => {
  const preset = findRomanceRelevantSkillPresetById(
    "romance_relevant_skill_core_emotional_safety",
  );
  assert.ok(preset);

  const additions = compileRomanceRelevantSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Romance-relevant skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft romance-relevant skill context/i);
  assert.match(additions.systemPromptAddition, /safety should be earned through behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
