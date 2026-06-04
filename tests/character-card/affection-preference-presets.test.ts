import assert from "node:assert/strict";
import test from "node:test";

import {
  AFFECTION_PREFERENCE_PRESET_CATEGORIES,
  AFFECTION_PREFERENCE_PRESETS,
  compileAffectionPreferencePresetAdditions,
  findAffectionPreferencePresetById,
  getAffectionPreferencePresetsByCategory,
} from "../../data/affectionPreferencePresets";

test("loads affection preference presets across love language, boundary, gate, and dialogue lanes", () => {
  assert.equal(AFFECTION_PREFERENCE_PRESETS.length, 279);
  assert.deepEqual(AFFECTION_PREFERENCE_PRESET_CATEGORIES, [
    "Affection Preference",
    "Archetype",
    "Attachment",
    "Boundary",
    "Dialogue Seed",
    "Gate",
    "Gift Giving",
    "High-Value Seed",
    "Love Language",
    "Physical Affection",
    "Quality Time",
    "Romance Hook",
    "Service Affection",
    "Verbal Affection",
  ]);

  const ids = AFFECTION_PREFERENCE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getAffectionPreferencePresetsByCategory("Archetype").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Affection Preference").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Love Language").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Verbal Affection").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Physical Affection").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Service Affection").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Quality Time").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Gift Giving").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Attachment").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Boundary").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Romance Hook").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Gate").length, 20);
  assert.equal(getAffectionPreferencePresetsByCategory("Dialogue Seed").length, 19);
  assert.equal(getAffectionPreferencePresetsByCategory("High-Value Seed").length, 20);
});

test("normalises affection preference values for visible prompt text", () => {
  const favourite = findAffectionPreferencePresetById(
    "affection_preference_gift_favourite_snacks",
  );
  const customised = findAffectionPreferencePresetById(
    "affection_preference_gift_customised_gifts",
  );
  const userPattern = findAffectionPreferencePresetById(
    "affection_preference_romance_first_user_notices_pattern",
  );
  const specialise = findAffectionPreferencePresetById(
    "affection_preference_dialogue_good_i_specialise_in_small_ones",
  );

  assert.equal(favourite?.value, "favourite snacks");
  assert.equal(customised?.value, "customised gifts");
  assert.equal(userPattern?.value, "first {{user}} notices pattern");
  assert.equal(specialise?.value, "Good. I specialise in small ones.");

  const visibleText = AFFECTION_PREFERENCE_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance, ...preset.systemPromptTags].join(" "),
  ).join(" ");

  assert.doesNotMatch(
    visibleText,
    /Use code with caution|favorite|customized|first user notices|specialize|force prose|SYSTEM PROTOCOL/i,
  );
});

test("compiles affection preference presets as soft love-language guidance", () => {
  const preset = findAffectionPreferencePresetById(
    "affection_preference_high_value_affection_as_safety",
  );
  assert.ok(preset);

  const additions = compileAffectionPreferencePresetAdditions(preset);

  assert.match(additions.relationshipAddition, /Affection preference context/);
  assert.match(additions.personalityAddition, /without replacing the character's full personality/i);
  assert.match(additions.systemPromptAddition, /soft affection preference context/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /avoid turning closeness into pressure/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force prose|override/i);
});

test("keeps touch and boundary lanes consent-aware", () => {
  const touch = findAffectionPreferencePresetById(
    "affection_preference_physical_affection_with_permission",
  );
  const boundary = findAffectionPreferencePresetById(
    "affection_preference_boundary_accepts_no_gracefully",
  );
  assert.ok(touch);
  assert.ok(boundary);

  assert.match(touch.guidance, /consent-aware, permission-aware/i);
  assert.match(boundary.guidance, /consent-aware, reciprocal, paced/i);
});
