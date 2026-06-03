import assert from "node:assert/strict";
import test from "node:test";

import {
  ARRANGED_MATCH_PRESET_CATEGORIES,
  ARRANGED_MATCH_PRESETS,
  compileArrangedMatchPresetAdditions,
  compileArrangedMatchPresetSummary,
  findArrangedMatchPresetById,
  getArrangedMatchPresetsByCategory,
} from "../../data/arrangedMatchPresets";

test("loads arranged-match presets across duty and chosen-intimacy lanes", () => {
  assert.equal(ARRANGED_MATCH_PRESETS.length, 270);
  assert.deepEqual(ARRANGED_MATCH_PRESET_CATEGORIES, [
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

  assert.equal(getArrangedMatchPresetsByCategory("archetype").length, 20);
  assert.equal(getArrangedMatchPresetsByCategory("trigger event").length, 25);
});

test("normalises readable arranged-match values and keeps consent explicit", () => {
  const politicalBetrothal = findArrangedMatchPresetById(
    "arranged_match_archetype_the_political_betrothal",
  );
  const honoursContract = findArrangedMatchPresetById(
    "arranged_match_behaviour_honours_contract",
  );
  const fulfilPromise = findArrangedMatchPresetById(
    "arranged_match_motivation_fulfil_promise",
  );
  const requiredDate = findArrangedMatchPresetById(
    "arranged_match_trigger_required_date",
  );
  const consentRule = findArrangedMatchPresetById(
    "arranged_match_rule_consent_must_be_renewed",
  );

  assert.equal(politicalBetrothal?.label, "The Political Betrothal");
  assert.equal(honoursContract?.value, "honours contract");
  assert.equal(fulfilPromise?.value, "fulfil promise");
  assert.equal(requiredDate?.value, "required date");
  assert.match(consentRule?.value ?? "", /consent must be renewed/);
  assert.match(consentRule?.guidance ?? "", /not a command to the model/i);

  const readableText = JSON.stringify(
    ARRANGED_MATCH_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /arranged_marriage|honors|fulfill|forced_date|love_vs_duty|dowry/i);
});

test("compiles arranged-match presets as soft duty and choice guidance", () => {
  const preset = findArrangedMatchPresetById(
    "arranged_match_archetype_the_political_betrothal",
  );
  assert.ok(preset);

  const summary = compileArrangedMatchPresetSummary(preset);
  const additions = compileArrangedMatchPresetAdditions(preset);

  assert.match(summary, /Arranged-match preset: Archetype - The Political Betrothal/);
  assert.match(additions.relationshipAddition, /chosen intimacy/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /opt-out routes/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
