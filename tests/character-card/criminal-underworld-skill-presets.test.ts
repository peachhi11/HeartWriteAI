import assert from "node:assert/strict";
import test from "node:test";

import {
  CRIMINAL_UNDERWORLD_SKILL_PRESET_CATEGORIES,
  CRIMINAL_UNDERWORLD_SKILL_PRESETS,
  compileCriminalUnderworldSkillPresetAdditions,
  findCriminalUnderworldSkillPresetById,
  getCriminalUnderworldSkillPresetsByCategory,
} from "../../data/criminalUnderworldSkillPresets";

test("loads criminal-underworld skill presets across fictional underworld lanes", () => {
  assert.equal(CRIMINAL_UNDERWORLD_SKILL_PRESETS.length, 321);
  assert.deepEqual(CRIMINAL_UNDERWORLD_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Core Skill",
    "Cybercrime Skill",
    "Deception Skill",
    "Dialogue Seed",
    "Financial Crime Skill",
    "Gate",
    "High-Value Seed",
    "Information Broker Skill",
    "Mastery",
    "Romance Hook",
    "Smuggling Skill",
    "Theft Skill",
    "Underworld Social Skill",
    "Violence Skill",
    "Weakness",
  ]);

  const ids = CRIMINAL_UNDERWORLD_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getCriminalUnderworldSkillPresetsByCategory("Theft Skill").length, 20);
  assert.equal(getCriminalUnderworldSkillPresetsByCategory("Dialogue Seed").length, 21);
  assert.equal(getCriminalUnderworldSkillPresetsByCategory("High-Value Seed").length, 20);
});

test("normalises criminal-underworld values for visible prompt text", () => {
  const favour = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_core_favour_trading",
  );
  const jewellery = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_theft_jewellery_theft",
  );
  const rumour = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_information_rumour_collection",
  );
  const nonLethal = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_violence_non_lethal_subdual",
  );
  const userBoss = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_gate_first_choose_user_over_boss_gate",
  );
  const visibleText = CRIMINAL_UNDERWORLD_SKILL_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(favour?.value, "favour trading");
  assert.equal(jewellery?.value, "jewellery theft");
  assert.equal(rumour?.value, "rumour collection");
  assert.equal(nonLethal?.value, "non-lethal subdual");
  assert.equal(userBoss?.value, "first choose {{user}} over boss gate");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|favor|jewelry|rumor|nonlethal|choose user over boss/i,
  );
});

test("compiles criminal-underworld presets as fictional consequence-aware context", () => {
  const preset = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_romance_escape_the_underworld_together",
  );
  assert.ok(preset);

  const additions = compileCriminalUnderworldSkillPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Criminal underworld skill context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft fictional underworld context/i);
  assert.match(additions.systemPromptAddition, /legality, and \{\{user\}\} autonomy/i);
  assert.match(additions.systemPromptAddition, /do not provide operational real-world criminal instruction/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps dark underworld romance consent and consequence aware", () => {
  const romance = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_romance_crime_boss_soft_for_user",
  );
  const violence = findCriminalUnderworldSkillPresetById(
    "criminal_underworld_skill_violence_controlled_brutality",
  );
  assert.ok(romance);
  assert.ok(violence);

  assert.match(romance.guidance, /preserving consent and consequence/i);
  assert.match(violence.guidance, /never frame harm as healthy romance/i);
});
