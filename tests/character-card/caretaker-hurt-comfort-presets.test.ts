import assert from "node:assert/strict";
import test from "node:test";

import {
  CARETAKER_HURT_COMFORT_PRESET_CATEGORIES,
  CARETAKER_HURT_COMFORT_PRESETS,
  compileCaretakerHurtComfortPresetAdditions,
  compileCaretakerHurtComfortPresetSummary,
  findCaretakerHurtComfortPresetById,
  getCaretakerHurtComfortPresetsByCategory,
} from "../../data/caretakerHurtComfortPresets";

test("loads caretaker/hurt-comfort presets across care and recovery lanes", () => {
  assert.equal(CARETAKER_HURT_COMFORT_PRESETS.length, 245);
  assert.deepEqual(CARETAKER_HURT_COMFORT_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Dynamic Type",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getCaretakerHurtComfortPresetsByCategory("archetype").length, 20);
  assert.equal(getCaretakerHurtComfortPresetsByCategory("behaviour").length, 25);
  assert.equal(getCaretakerHurtComfortPresetsByCategory("trigger event").length, 20);
});

test("normalises readable caretaker/hurt-comfort values and care boundaries", () => {
  const gentleCaretaker = findCaretakerHurtComfortPresetById(
    "caretaker_hurt_comfort_archetype_the_gentle_caretaker",
  );
  const encouragedRest = findCaretakerHurtComfortPresetById(
    "caretaker_hurt_comfort_behaviour_encourages_rest_gently",
  );
  const survivorGuilt = findCaretakerHurtComfortPresetById(
    "caretaker_hurt_comfort_wound_survivors_guilt",
  );
  const restTrope = findCaretakerHurtComfortPresetById(
    "caretaker_hurt_comfort_trope_encouraged_to_rest",
  );

  assert.equal(gentleCaretaker?.label, "The Gentle Caretaker");
  assert.equal(encouragedRest?.value, "encourages rest gently");
  assert.equal(survivorGuilt?.value, "survivor's guilt");
  assert.equal(restTrope?.value, "encouraged to rest");

  const readableText = JSON.stringify(
    CARETAKER_HURT_COMFORT_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /forced_rest|forces_rest|forced to rest/i);
});

test("compiles caretaker/hurt-comfort presets as soft care and recovery guidance", () => {
  const preset = findCaretakerHurtComfortPresetById(
    "caretaker_hurt_comfort_archetype_the_gentle_caretaker",
  );
  assert.ok(preset);

  const summary = compileCaretakerHurtComfortPresetSummary(preset);
  const additions = compileCaretakerHurtComfortPresetAdditions(preset);

  assert.match(summary, /Caretaker\/hurt-comfort preset: Archetype - The Gentle Caretaker/);
  assert.match(additions.relationshipAddition, /do not make either character helpless/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /accept, reject, or renegotiate care/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
