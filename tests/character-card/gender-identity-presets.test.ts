import assert from "node:assert/strict";
import test from "node:test";

import {
  GENDER_IDENTITY_PRESET_CATEGORIES,
  GENDER_IDENTITY_PRESETS,
  compileGenderIdentityPresetAdditions,
  findGenderIdentityPresetById,
  getGenderIdentityPresetsByCategory,
} from "../../data/genderIdentityPresets";

test("loads gender identity presets across identity, expression, pronoun, role, conflict, and dialogue lanes", () => {
  assert.equal(GENDER_IDENTITY_PRESETS.length, 189);
  assert.deepEqual(GENDER_IDENTITY_PRESET_CATEGORIES, [
    "Archetype",
    "Conflict",
    "Dialogue Seed",
    "Expression",
    "Gate",
    "High-Value Seed",
    "Identity",
    "Pronoun",
    "Role",
    "Romance Hook",
  ]);

  const ids = GENDER_IDENTITY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getGenderIdentityPresetsByCategory("Identity").length, 40);
  assert.equal(getGenderIdentityPresetsByCategory("Pronoun").length, 16);
  assert.equal(getGenderIdentityPresetsByCategory("Romance Hook").length, 15);
  assert.equal(getGenderIdentityPresetsByCategory("High-Value Seed").length, 21);
});

test("normalises gender identity values for visible prompt text", () => {
  const nonBinary = findGenderIdentityPresetById("gender_identity_seed_non_binary");
  const userRespects = findGenderIdentityPresetById(
    "gender_identity_romance_user_respects_pronouns",
  );
  const userHelps = findGenderIdentityPresetById(
    "gender_identity_romance_user_helps_with_clothing",
  );
  const publicExpectation = findGenderIdentityPresetById(
    "gender_identity_conflict_love_against_public_expectation",
  );
  const visibleText = GENDER_IDENTITY_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.equal(nonBinary?.value, "non-binary");
  assert.equal(userRespects?.value, "{{user}} respects pronouns");
  assert.equal(userHelps?.value, "{{user}} helps with clothing");
  assert.equal(publicExpectation?.value, "love against public expectation");
  assert.doesNotMatch(
    visibleText,
    /Use code with caution|non_binary|user_respects|user helps|love vs public|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles gender identity presets as soft self-definition context", () => {
  const preset = findGenderIdentityPresetById(
    "gender_identity_romance_love_affirms_identity",
  );
  assert.ok(preset);

  const additions = compileGenderIdentityPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Gender identity context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft gender identity context/i);
  assert.match(additions.systemPromptAddition, /Keep self-definition, consent, boundaries/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps culturally specific identity and conflict lanes careful", () => {
  const twoSpirit = findGenderIdentityPresetById("gender_identity_seed_two_spirit");
  const deadname = findGenderIdentityPresetById("gender_identity_conflict_deadname_wound");
  assert.ok(twoSpirit);
  assert.ok(deadname);

  assert.match(twoSpirit.guidance, /self-defined/i);
  assert.match(deadname.guidance, /care, agency, repair, privacy, and consent/i);
});
