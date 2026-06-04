import assert from "node:assert/strict";
import test from "node:test";

import {
  HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESET_CATEGORIES,
  HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS,
  compileHighValueCharacterCreationSkillPresetAdditions,
  findHighValueCharacterCreationSkillPresetById,
  getHighValueCharacterCreationSkillPresetsByCategory,
} from "../../data/highValueCharacterCreationSkillPresets";

test("loads high-value character creation skill selectors and bundles", () => {
  assert.equal(HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS.length, 194);
  assert.deepEqual(HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESET_CATEGORIES, [
    "Archetype",
    "Bundle",
    "Dialogue Seed",
    "Gate",
    "High-Value Seed",
    "Weakness",
  ]);

  const ids = HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(
    getHighValueCharacterCreationSkillPresetsByCategory("High-Value Seed").length,
    123,
  );
  assert.equal(getHighValueCharacterCreationSkillPresetsByCategory("Bundle").length, 5);
  assert.equal(getHighValueCharacterCreationSkillPresetsByCategory("Dialogue Seed").length, 16);
});

test("normalises high-value character creation skill visible text", () => {
  const apologising = findHighValueCharacterCreationSkillPresetById(
    "high_value_character_creation_skill_seed_apologising",
  );
  const deescalation = findHighValueCharacterCreationSkillPresetById(
    "high_value_character_creation_skill_seed_de_escalation",
  );
  const saviour = findHighValueCharacterCreationSkillPresetById(
    "high_value_character_creation_skill_weakness_saviour_complex",
  );
  const userGate = findHighValueCharacterCreationSkillPresetById(
    "high_value_character_creation_skill_gate_first_user_sees_weakness_gate",
  );
  const visibleText = HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS.map((preset) =>
    [
      preset.label,
      preset.value,
      preset.guidance,
      ...(preset.bundleSeeds ?? []),
      ...preset.systemPromptTags,
    ].join(" "),
  ).join(" ");

  assert.equal(apologising?.value, "apologising");
  assert.equal(deescalation?.value, "de-escalation");
  assert.equal(saviour?.value, "saviour complex");
  assert.equal(userGate?.value, "first {{user}} sees weakness gate");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|apologizing|deescalation|savior|first user sees|supports user agency/i,
  );
});

test("keeps bundled high-value skill profiles additive and boundary-aware", () => {
  const bundle = findHighValueCharacterCreationSkillPresetById(
    "high_value_character_creation_skill_bundle_romance_safe_person",
  );
  assert.ok(bundle);
  assert.deepEqual(bundle.bundleSeeds, [
    "active listening",
    "emotional attunement",
    "reassurance",
    "boundary respect",
    "trust building",
    "conflict repair",
    "comforting",
    "emotional safety",
  ]);

  const additions = compileHighValueCharacterCreationSkillPresetAdditions(bundle);

  assert.match(additions.backgroundAddition, /Bundle seeds: active listening/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft high-value character creation skill context/i);
  assert.match(additions.systemPromptAddition, /skill should not erase vulnerability/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});
