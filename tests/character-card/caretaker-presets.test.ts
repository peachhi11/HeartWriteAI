import assert from "node:assert/strict";
import test from "node:test";

import {
  CARETAKER_PRESET_CATEGORIES,
  CARETAKER_PRESETS,
  compileCaretakerPresetAdditions,
  compileCaretakerPresetSummary,
  findCaretakerPresetById,
  getCaretakerPresetsByCategory,
} from "../../data/caretakerPresets";

test("loads caretaker presets across support, care, and boundary lanes", () => {
  assert.equal(CARETAKER_PRESETS.length, 244);
  assert.deepEqual(CARETAKER_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Caretaker Type",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getCaretakerPresetsByCategory("archetype").length, 20);
  assert.equal(getCaretakerPresetsByCategory("behaviour").length, 25);
  assert.equal(getCaretakerPresetsByCategory("gate").length, 19);
});

test("normalises readable caretaker values and care boundaries", () => {
  const gentleCaregiver = findCaretakerPresetById(
    "caretaker_archetype_the_gentle_caregiver",
  );
  const burntOut = findCaretakerPresetById("caretaker_type_burnt_out_caretaker");
  const encouragedRest = findCaretakerPresetById(
    "caretaker_behaviour_encourages_rest_gently",
  );
  const restTrope = findCaretakerPresetById("caretaker_trope_encouraged_to_rest");

  assert.equal(gentleCaregiver?.label, "The Gentle Caregiver");
  assert.equal(burntOut?.value, "burnt-out caretaker");
  assert.equal(encouragedRest?.value, "encourages rest gently");
  assert.equal(restTrope?.value, "encouraged to rest");

  const readableText = JSON.stringify(
    CARETAKER_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /forced_rest|forces_rest|forced to rest/i);
});

test("compiles caretaker presets as soft support and mutual-care guidance", () => {
  const preset = findCaretakerPresetById("caretaker_archetype_the_gentle_caregiver");
  assert.ok(preset);

  const summary = compileCaretakerPresetSummary(preset);
  const additions = compileCaretakerPresetAdditions(preset);

  assert.match(summary, /Caretaker preset: Archetype - The Gentle Caregiver/);
  assert.match(additions.relationshipAddition, /do not make either character responsible/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /accept, refuse, renegotiate/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
