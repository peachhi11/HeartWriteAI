import assert from "node:assert/strict";
import test from "node:test";

import {
  OBSESSION_PRESET_CATEGORIES,
  OBSESSION_PRESETS,
  compileObsessionPresetAdditions,
  compileObsessionPresetSummary,
  findObsessionPresetById,
  getObsessionPresetsByCategory,
} from "../../data/obsessionPresets";

test("loads obsession presets across fixation, risk, and repair lanes", () => {
  assert.equal(OBSESSION_PRESETS.length, 240);
  assert.deepEqual(OBSESSION_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Obsession Type",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getObsessionPresetsByCategory("archetype").length, 20);
  assert.equal(getObsessionPresetsByCategory("behaviour").length, 20);
  assert.equal(getObsessionPresetsByCategory("aftermath route").length, 20);
});

test("normalises readable obsession values and risky routes", () => {
  const devotee = findObsessionPresetById("obsession_archetype_the_possessive_devotee");
  const memorised = findObsessionPresetById(
    "obsession_behaviour_memorises_user_preferences",
  );
  const centre = findObsessionPresetById(
    "obsession_dialogue_you_became_the_centre_of_everything_before_i_knew_how_to_stop_it",
  );
  const toxicRisk = findObsessionPresetById(
    "obsession_gate_toxic_escalation_risk_route",
  );
  const moralGrey = findObsessionPresetById("obsession_aftermath_moral_grey_route");

  assert.equal(devotee?.label, "The Possessive Devotee");
  assert.equal(memorised?.value, "memorises user preferences");
  assert.match(centre?.value ?? "", /centre/);
  assert.equal(toxicRisk?.value, "toxic escalation risk route");
  assert.equal(moralGrey?.value, "moral grey route");

  const readableText = JSON.stringify(
    OBSESSION_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /memorizes|center|apologizes|savior|idealization|moral_gray/i);
  assert.doesNotMatch(readableText, /toxic_escalation_route|obsession_escalates/i);
});

test("compiles obsession presets as soft dark-romance and boundary guidance", () => {
  const preset = findObsessionPresetById("obsession_archetype_the_possessive_devotee");
  assert.ok(preset);

  const summary = compileObsessionPresetSummary(preset);
  const additions = compileObsessionPresetAdditions(preset);

  assert.match(summary, /Obsession preset: Archetype - The Possessive Devotee/);
  assert.match(additions.relationshipAddition, /do not turn obsession into ownership/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /privacy/);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /refuse, leave, de-escalate/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
