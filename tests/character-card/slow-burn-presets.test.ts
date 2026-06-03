import assert from "node:assert/strict";
import test from "node:test";

import {
  SLOW_BURN_PRESET_CATEGORIES,
  SLOW_BURN_PRESETS,
  compileSlowBurnPresetAdditions,
  compileSlowBurnPresetSummary,
  findSlowBurnPresetById,
  getSlowBurnPresetsByCategory,
} from "../../data/slowBurnPresets";

test("loads slow-burn presets across pacing, pining, and event lanes", () => {
  assert.equal(SLOW_BURN_PRESETS.length, 280);
  assert.deepEqual(SLOW_BURN_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Event Keyword",
    "Gate",
    "Method",
    "Motivation",
    "Progression",
    "Romance Trope",
    "Slow Burn Type",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getSlowBurnPresetsByCategory("archetype").length, 20);
  assert.equal(getSlowBurnPresetsByCategory("trigger event").length, 25);
  assert.equal(getSlowBurnPresetsByCategory("progression").length, 15);
  assert.equal(getSlowBurnPresetsByCategory("event keyword").length, 20);
});

test("normalises readable slow-burn values and UK spelling", () => {
  const patient = findSlowBurnPresetById("slow_burn_archetype_the_patient_devotee");
  const favouriteLine = findSlowBurnPresetById(
    "slow_burn_dialogue_when_did_you_become_my_favourite_part_of_the_day",
  );
  const realisedLine = findSlowBurnPresetById(
    "slow_burn_dialogue_i_think_i_started_missing_you_before_i_realised_why",
  );
  const realisationGate = findSlowBurnPresetById("slow_burn_gate_realisation_gate");
  const event = findSlowBurnPresetById("slow_burn_event_private_smile");

  assert.equal(patient?.label, "The Patient Devotee");
  assert.match(favouriteLine?.value ?? "", /favourite/);
  assert.match(realisedLine?.value ?? "", /realised/);
  assert.equal(realisationGate?.value, "realisation gate");
  assert.equal(event?.value, "private smile");

  const readableText = JSON.stringify(
    SLOW_BURN_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /favorite|realized|realization/i);
  assert.doesNotMatch(readableText, /friends_to_lovers|slow_burn_progress/i);
  assert.doesNotMatch(readableText, /forced outcome/i);
});

test("compiles slow-burn presets as soft pacing and agency guidance", () => {
  const preset = findSlowBurnPresetById("slow_burn_archetype_the_patient_devotee");
  assert.ok(preset);

  const summary = compileSlowBurnPresetSummary(preset);
  const additions = compileSlowBurnPresetAdditions(preset);

  assert.match(summary, /Slow-burn preset: Archetype - The Patient Devotee/);
  assert.match(additions.relationshipAddition, /do not force confession/i);
  assert.match(additions.personalityAddition, /earned intimacy only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /stay platonic/);
  assert.match(additions.systemPromptAddition, /only when earned/);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
