import assert from "node:assert/strict";
import test from "node:test";

import {
  POSSESSIVE_PRESET_CATEGORIES,
  POSSESSIVE_PRESETS,
  compilePossessivePresetAdditions,
  compilePossessivePresetSummary,
  findPossessivePresetById,
  getPossessivePresetsByCategory,
} from "../../data/possessivePresets";

test("loads possessive presets across claiming, jealousy, and repair lanes", () => {
  assert.equal(POSSESSIVE_PRESETS.length, 270);
  assert.deepEqual(POSSESSIVE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Expression",
    "Gate",
    "Method",
    "Motivation",
    "Possessiveness Type",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getPossessivePresetsByCategory("archetype").length, 20);
  assert.equal(getPossessivePresetsByCategory("trigger event").length, 25);
  assert.equal(getPossessivePresetsByCategory("behaviour").length, 25);
  assert.equal(getPossessivePresetsByCategory("dialogue seed").length, 20);
});

test("normalises readable possessive values and risk routes", () => {
  const protector = findPossessivePresetById(
    "possessive_archetype_the_possessive_protector",
  );
  const controllingRisk = findPossessivePresetById(
    "possessive_type_controlling_possessiveness_risk",
  );
  const dontLeave = findPossessivePresetById("possessive_expression_don_t_leave_yet");
  const behaviour = findPossessivePresetById(
    "possessive_behaviour_holds_hand_frequently",
  );
  const trope = findPossessivePresetById("possessive_trope_touch_her_and_die");

  assert.equal(protector?.label, "The Possessive Protector");
  assert.equal(controllingRisk?.value, "controlling possessiveness risk");
  assert.equal(dontLeave?.value, "don't leave yet");
  assert.equal(behaviour?.value, "holds hand frequently");
  assert.equal(trope?.value, "touch her and die");

  const readableText = JSON.stringify(
    POSSESSIVE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /romantic_possessiveness|public_claiming/i);
  assert.doesNotMatch(readableText, /dont_leave|controlling_possessiveness/i);
  assert.doesNotMatch(readableText, /behavior|Flavors/i);
});

test("compiles possessive presets as soft dark-romance and agency guidance", () => {
  const preset = findPossessivePresetById(
    "possessive_archetype_the_possessive_protector",
  );
  assert.ok(preset);

  const summary = compilePossessivePresetSummary(preset);
  const additions = compilePossessivePresetAdditions(preset);

  assert.match(summary, /Possessive preset: Archetype - The Possessive Protector/);
  assert.match(additions.relationshipAddition, /do not turn possessiveness into ownership/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /privacy/);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /renegotiate exclusivity/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
