import assert from "node:assert/strict";
import test from "node:test";

import {
  compileFormalArrangedPresetAdditions,
  compileFormalArrangedPresetSummary,
  findFormalArrangedPresetById,
  FORMAL_ARRANGED_PRESET_CATEGORIES,
  FORMAL_ARRANGED_PRESETS,
  getFormalArrangedPresetsByCategory,
} from "../../data/formalArrangedPresets";

test("loads formal/arranged presets across etiquette and chosen-duty lanes", () => {
  assert.equal(FORMAL_ARRANGED_PRESETS.length, 264);
  assert.deepEqual(FORMAL_ARRANGED_PRESET_CATEGORIES, [
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
    "Rule",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getFormalArrangedPresetsByCategory("archetype").length, 20);
  assert.equal(getFormalArrangedPresetsByCategory("trigger event").length, 24);
  assert.equal(getFormalArrangedPresetsByCategory("rule").length, 20);
});

test("normalises readable formal/arranged values and UK spelling", () => {
  const betrothed = findFormalArrangedPresetById(
    "formal_arranged_archetype_the_polite_betrothed",
  );
  const honour = findFormalArrangedPresetById(
    "formal_arranged_motivation_honour_contract",
  );
  const armour = findFormalArrangedPresetById(
    "formal_arranged_wound_politeness_as_armour",
  );
  const firstNames = findFormalArrangedPresetById(
    "formal_arranged_type_formal_titles_to_first_names",
  );

  assert.equal(betrothed?.label, "The Polite Betrothed");
  assert.equal(honour?.value, "honour contract");
  assert.equal(armour?.value, "politeness as armour");
  assert.equal(firstNames?.value, "formal titles to first names");

  const readableText = JSON.stringify(
    FORMAL_ARRANGED_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /honor|armor|formal_betrothal|slow_burn/i);
});

test("compiles formal/arranged presets as soft consent-led courtship guidance", () => {
  const preset = findFormalArrangedPresetById(
    "formal_arranged_rule_no_forced_intimacy",
  );
  assert.ok(preset);

  const summary = compileFormalArrangedPresetSummary(preset);
  const additions = compileFormalArrangedPresetAdditions(preset);

  assert.match(summary, /Formal\/arranged preset: Rule - No Forced Intimacy/);
  assert.match(additions.relationshipAddition, /never become hard coercion/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /affection to be chosen rather than performed/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
