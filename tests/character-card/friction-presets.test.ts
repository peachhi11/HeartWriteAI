import assert from "node:assert/strict";
import test from "node:test";

import {
  FRICTION_PRESET_CATEGORIES,
  FRICTION_PRESETS,
  compileFrictionPresetAdditions,
  compileFrictionPresetSummary,
  findFrictionPresetById,
  getFrictionPresetsByCategory,
} from "../../data/frictionPresets";

test("loads friction presets across banter, conflict, and repair lanes", () => {
  assert.equal(FRICTION_PRESETS.length, 250);
  assert.deepEqual(FRICTION_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Friction Type",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getFrictionPresetsByCategory("archetype").length, 20);
  assert.equal(getFrictionPresetsByCategory("behaviour").length, 25);
  assert.equal(getFrictionPresetsByCategory("trigger event").length, 25);
});

test("normalises readable friction values and risk routes", () => {
  const bickerers = findFrictionPresetById("friction_archetype_the_constant_bickerers");
  const banterFuelled = findFrictionPresetById(
    "friction_archetype_the_banter_fuelled_romance",
  );
  const apologisesBadly = findFrictionPresetById("friction_behaviour_apologises_badly");
  const toxicRiskRoute = findFrictionPresetById(
    "friction_aftermath_toxic_escalation_risk_route",
  );

  assert.equal(bickerers?.label, "The Constant Bickerers");
  assert.equal(banterFuelled?.value, "The Banter-Fuelled Romance");
  assert.equal(apologisesBadly?.value, "apologises badly");
  assert.equal(toxicRiskRoute?.value, "toxic escalation risk route");

  const readableText = JSON.stringify(
    FRICTION_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /toxic_friction_route|toxic_escalation_route/i);
});

test("compiles friction presets as soft relationship and repair guidance", () => {
  const preset = findFrictionPresetById("friction_archetype_the_constant_bickerers");
  assert.ok(preset);

  const summary = compileFrictionPresetSummary(preset);
  const additions = compileFrictionPresetAdditions(preset);

  assert.match(summary, /Friction preset: Archetype - The Constant Bickerers/);
  assert.match(additions.relationshipAddition, /do not flatten the relationship/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /disengage, repair, apologise/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
