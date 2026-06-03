import assert from "node:assert/strict";
import test from "node:test";

import {
  DEVOTION_PRESET_CATEGORIES,
  DEVOTION_PRESETS,
  compileDevotionPresetAdditions,
  compileDevotionPresetSummary,
  findDevotionPresetById,
  getDevotionPresetsByCategory,
} from "../../data/devotionPresets";

test("loads devotion presets across loyalty, vows, and boundary lanes", () => {
  assert.equal(DEVOTION_PRESETS.length, 245);
  assert.deepEqual(DEVOTION_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Devotion Type",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getDevotionPresetsByCategory("archetype").length, 20);
  assert.equal(getDevotionPresetsByCategory("behaviour").length, 25);
  assert.equal(getDevotionPresetsByCategory("aftermath route").length, 20);
});

test("normalises readable devotion values and risk routes", () => {
  const devotedLover = findDevotionPresetById("devotion_archetype_the_devoted_lover");
  const prioritisesNeeds = findDevotionPresetById(
    "devotion_behaviour_prioritises_user_needs",
  );
  const publicDefence = findDevotionPresetById("devotion_method_public_defence");
  const obsessionRisk = findDevotionPresetById(
    "devotion_aftermath_obsession_risk_route",
  );

  assert.equal(devotedLover?.label, "The Devoted Lover");
  assert.equal(prioritisesNeeds?.value, "prioritises user needs");
  assert.equal(publicDefence?.value, "public defence");
  assert.equal(obsessionRisk?.value, "obsession risk route");

  const readableText = JSON.stringify(
    DEVOTION_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /prioritizes|defense|recognized/i);
  assert.doesNotMatch(readableText, /obsession_route/i);
});

test("compiles devotion presets as soft commitment and reciprocity guidance", () => {
  const preset = findDevotionPresetById("devotion_archetype_the_devoted_lover");
  assert.ok(preset);

  const summary = compileDevotionPresetSummary(preset);
  const additions = compileDevotionPresetAdditions(preset);

  assert.match(summary, /Devotion preset: Archetype - The Devoted Lover/);
  assert.match(additions.relationshipAddition, /do not turn devotion into ownership/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /accept, refuse, reciprocate/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
