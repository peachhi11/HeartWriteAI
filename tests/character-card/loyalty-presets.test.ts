import assert from "node:assert/strict";
import test from "node:test";

import {
  LOYALTY_PRESET_CATEGORIES,
  LOYALTY_PRESETS,
  compileLoyaltyPresetAdditions,
  findLoyaltyPresetById,
  getLoyaltyPresetsByCategory,
} from "../../data/loyaltyPresets";

test("loads loyalty presets across all useful devotion and fidelity lanes", () => {
  assert.equal(LOYALTY_PRESETS.length, 245);
  assert.deepEqual(LOYALTY_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Loyalty Type",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  const ids = LOYALTY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("loyalty_")));
  assert.equal(
    getLoyaltyPresetsByCategory("Behaviour").find(
      (preset) => preset.value === "defends user publicly",
    )?.id,
    "loyalty_behaviour_defends_user_publicly",
  );
});

test("normalises readable loyalty values and frames sacrifice safely", () => {
  const allText = JSON.stringify(LOYALTY_PRESETS);
  const valueText = LOYALTY_PRESETS.map((preset) => preset.value).join("\n");
  const archetype = findLoyaltyPresetById(
    "loyalty_archetype_the_honour_bound_noble",
  );
  const method = findLoyaltyPresetById("loyalty_method_sacrificing_safety");
  const wound = findLoyaltyPresetById("loyalty_wound_survivor_s_guilt");

  assert.equal(archetype?.value, "The Honour-Bound Noble");
  assert.equal(method?.value, "sacrificing safety");
  assert.equal(wound?.value, "survivor's guilt");
  assert.match(method?.guidance ?? "", /consent-aware/i);
  assert.match(method?.guidance ?? "", /mutual boundaries/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(
    valueText,
    /romantic_loyalty|family_bond|self_sacrificing|oath_making|public_defense|duty_vs_love_route|trust_gate_reached/i,
  );
});

test("compiles loyalty presets as soft devotion and event-gated guidance", () => {
  const preset = findLoyaltyPresetById(
    "loyalty_archetype_the_devoted_protector",
  );
  assert.ok(preset);

  const additions = compileLoyaltyPresetAdditions(preset);

  assert.match(
    additions.relationshipAddition,
    /Loyalty preset: Archetype - The Devoted Protector/,
  );
  assert.match(additions.personalityAddition, /Loyalty archetype texture/);
  assert.match(additions.systemPromptAddition, /Loyalty guidance/);
  assert.match(additions.systemPromptAddition, /soft relationship context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
