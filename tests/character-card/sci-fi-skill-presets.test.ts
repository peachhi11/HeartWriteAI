import assert from "node:assert/strict";
import test from "node:test";

import {
  SCI_FI_SKILL_PRESET_CATEGORIES,
  SCI_FI_SKILL_PRESETS,
  compileSciFiSkillPresetAdditions,
  findSciFiSkillPresetById,
  getSciFiSkillPresetsByCategory,
} from "../../data/sciFiSkillPresets";

test("loads sci-fi skill presets across spaceflight, systems, AI, alien, and romance lanes", () => {
  assert.equal(SCI_FI_SKILL_PRESETS.length, 280);
  assert.deepEqual(SCI_FI_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Sci-Fi Skill",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Mastery",
    "Romance Hook",
    "Weakness",
  ]);

  const ids = SCI_FI_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getSciFiSkillPresetsByCategory("Core Sci-Fi Skill").length, 140);
  assert.equal(getSciFiSkillPresetsByCategory("Dialogue Seed").length, 20);
  assert.equal(getSciFiSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises sci-fi values for visible prompt text", () => {
  const manoeuvring = findSciFiSkillPresetById(
    "sci_fi_skill_core_ship_to_ship_manoeuvring",
  );
  const behaviour = findSciFiSkillPresetById("sci_fi_skill_core_robot_behaviour_tuning");
  const modelling = findSciFiSkillPresetById("sci_fi_skill_core_predictive_modelling");
  const behavioural = findSciFiSkillPresetById(
    "sci_fi_skill_core_behavioural_modelling",
  );
  const alienBehaviour = findSciFiSkillPresetById(
    "sci_fi_skill_core_alien_behaviour_study",
  );
  const userSave = findSciFiSkillPresetById("sci_fi_skill_romance_pilot_saves_user");
  const visibleText = SCI_FI_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(manoeuvring?.value, "ship-to-ship manoeuvring");
  assert.equal(behaviour?.value, "robot behaviour tuning");
  assert.equal(modelling?.value, "predictive modelling");
  assert.equal(behavioural?.value, "behavioural modelling");
  assert.equal(alienBehaviour?.value, "alien behaviour study");
  assert.equal(userSave?.value, "pilot saves {{user}}");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|maneuvering|behavior|modeling|protocol_vs_heart|pilot saves user/i,
  );
});

test("compiles sci-fi presets as soft personhood-aware context", () => {
  const preset = findSciFiSkillPresetById("sci_fi_skill_core_synthetic_personhood_research");
  assert.ok(preset);

  const additions = compileSciFiSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Sci-fi skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft sci-fi skill context/i);
  assert.match(additions.systemPromptAddition, /privacy, personhood, and \{\{user\}\} autonomy/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
