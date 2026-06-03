import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFakeDatingPresetAdditions,
  compileFakeDatingPresetSummary,
  FAKE_DATING_PRESET_CATEGORIES,
  FAKE_DATING_PRESETS,
  findFakeDatingPresetById,
  getFakeDatingPresetsByCategory,
} from "../../data/fakeDatingPresets";

test("loads fake-dating presets across performance and pretend-to-real lanes", () => {
  assert.equal(FAKE_DATING_PRESETS.length, 270);
  assert.deepEqual(FAKE_DATING_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Arrangement Type",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Rule",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getFakeDatingPresetsByCategory("archetype").length, 20);
  assert.equal(getFakeDatingPresetsByCategory("trigger event").length, 25);
});

test("normalises readable fake-dating values and keeps arrangement routes choice-safe", () => {
  const fakeFiance = findFakeDatingPresetById("fake_dating_archetype_the_fake_fiance");
  const memorisesPreferences = findFakeDatingPresetById(
    "fake_dating_behaviour_memorises_user_preferences",
  );
  const memoriseBackstory = findFakeDatingPresetById(
    "fake_dating_rule_memorise_backstory",
  );
  const dialogue = findFakeDatingPresetById(
    "fake_dating_dialogue_i_memorised_your_favourite_things_for_the_lie_then_i_kept_remembering_them_for_myself",
  );
  const visaMarriage = findFakeDatingPresetById(
    "fake_dating_archetype_the_visa_marriage",
  );

  assert.equal(fakeFiance?.label, "The Fake Fiancé");
  assert.equal(memorisesPreferences?.value, "memorises user preferences");
  assert.equal(memoriseBackstory?.value, "memorise backstory");
  assert.match(dialogue?.value ?? "", /favourite things/);
  assert.match(visaMarriage?.guidance ?? "", /without trapping \{\{user\}\}/i);

  const readableText = JSON.stringify(
    FAKE_DATING_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /fake_dating|favorite|memorize|green card/i);
});

test("compiles fake-dating presets as soft performance and exit-route guidance", () => {
  const preset = findFakeDatingPresetById(
    "fake_dating_archetype_the_contract_couple",
  );
  assert.ok(preset);

  const summary = compileFakeDatingPresetSummary(preset);
  const additions = compileFakeDatingPresetAdditions(preset);

  assert.match(summary, /Fake-dating preset: Archetype - The Contract Couple/);
  assert.match(additions.relationshipAddition, /pretend-to-real/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /clear exit routes/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
