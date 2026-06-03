import assert from "node:assert/strict";
import test from "node:test";

import {
  compileEmotionalExpressionPresetAdditions,
  compileEmotionalExpressionPresetSummary,
  EMOTIONAL_EXPRESSION_PRESET_CATEGORIES,
  EMOTIONAL_EXPRESSION_PRESETS,
  findEmotionalExpressionPresetById,
  getEmotionalExpressionPresetsByCategory,
} from "../../data/emotionalExpressionPresets";

test("loads emotional expression presets across visibility and vulnerability lanes", () => {
  assert.equal(EMOTIONAL_EXPRESSION_PRESETS.length, 180);
  assert.deepEqual(EMOTIONAL_EXPRESSION_PRESET_CATEGORIES, [
    "Archetype",
    "Communication",
    "Defence",
    "Dialogue Seed",
    "Expression Style",
    "Gate",
    "Intensity",
    "Romance Hook",
    "Visibility",
  ]);

  const ids = EMOTIONAL_EXPRESSION_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("emotional_")));
  assert.equal(getEmotionalExpressionPresetsByCategory("archetype").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("expression style").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("visibility").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("communication").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("intensity").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("defence").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("romance hook").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("gate").length, 20);
  assert.equal(getEmotionalExpressionPresetsByCategory("dialogue seed").length, 20);
});

test("normalises emotional expression values and keeps dialogue readable", () => {
  const allText = JSON.stringify(EMOTIONAL_EXPRESSION_PRESETS);
  const valueText = EMOTIONAL_EXPRESSION_PRESETS.map((preset) => preset.value).join("\n");
  const archetype = findEmotionalExpressionPresetById(
    "emotional_expression_archetype_the_open_heart",
  );
  const humour = findEmotionalExpressionPresetById(
    "emotional_visibility_deflects_with_humour",
  );
  const practised = findEmotionalExpressionPresetById(
    "emotional_expression_dialogue_no_you_are_practised",
  );
  const safe = findEmotionalExpressionPresetById(
    "emotional_expression_dialogue_you_make_me_feel_safe_enough_to_fall_apart",
  );

  assert.equal(archetype?.value, "The Open Heart");
  assert.equal(humour?.value, "deflects with humour");
  assert.equal(practised?.value, "No, you are practised.");
  assert.equal(safe?.value, "You make me feel safe enough to fall apart.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /deflects_with_humor|practiced/i);
});

test("compiles emotional expression presets as soft agency-aware guidance", () => {
  const preset = findEmotionalExpressionPresetById(
    "emotional_expression_archetype_the_guarded_romantic",
  );
  assert.ok(preset);

  const additions = compileEmotionalExpressionPresetAdditions(preset);
  const summary = compileEmotionalExpressionPresetSummary(preset);

  assert.match(additions.personalityAddition, /Emotional expression preset/);
  assert.match(additions.relationshipAddition, /trust, hurt, reassurance, and romance gates/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve \{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /consent/i);
  assert.match(summary, /Trigger keys/);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
