import assert from "node:assert/strict";
import test from "node:test";

import {
  DOMESTIC_SKILL_PRESET_CATEGORIES,
  DOMESTIC_SKILL_PRESETS,
  compileDomesticSkillPresetAdditions,
  findDomesticSkillPresetById,
  getDomesticSkillPresetsByCategory,
} from "../../data/domesticSkillPresets";

test("loads domestic skill presets across home, care, routine, and romance lanes", () => {
  assert.equal(DOMESTIC_SKILL_PRESETS.length, 208);
  assert.deepEqual(DOMESTIC_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Domestic Skill",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Romance Hook",
    "Weakness",
  ]);

  const ids = DOMESTIC_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getDomesticSkillPresetsByCategory("Core Domestic Skill").length, 70);
  assert.equal(getDomesticSkillPresetsByCategory("Dialogue Seed").length, 18);
  assert.equal(getDomesticSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises domestic values for visible prompt text", () => {
  const organiser = findDomesticSkillPresetById("domestic_skill_archetype_the_organiser");
  const cosy = findDomesticSkillPresetById("domestic_skill_archetype_the_cosy_domestic");
  const favourite = findDomesticSkillPresetById(
    "domestic_skill_core_favourite_meal_memory",
  );
  const organisation = findDomesticSkillPresetById("domestic_skill_core_organisation");
  const burden = findDomesticSkillPresetById(
    "domestic_skill_weakness_fear_of_being_a_burden",
  );
  const visibleText = DOMESTIC_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(organiser?.value, "The Organiser");
  assert.equal(cosy?.value, "The Cosy Domestic");
  assert.equal(favourite?.value, "favourite meal memory");
  assert.equal(organisation?.value, "organisation");
  assert.equal(burden?.value, "fear of being a burden");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|Organizer|Cozy|favorite|organization|fear of being burden/i,
  );
});

test("compiles domestic presets as soft reciprocal-care context", () => {
  const preset = findDomesticSkillPresetById("domestic_skill_weakness_caretaker_burnout");
  assert.ok(preset);

  const additions = compileDomesticSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Domestic skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft domestic skill context/i);
  assert.match(additions.systemPromptAddition, /reciprocity, rest, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
