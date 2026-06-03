import assert from "node:assert/strict";
import test from "node:test";

import {
  TEASING_PRESET_CATEGORIES,
  TEASING_PRESETS,
  compileTeasingPresetAdditions,
  compileTeasingPresetSummary,
  findTeasingPresetById,
  getTeasingPresetsByCategory,
} from "../../data/teasingPresets";

test("loads teasing presets across banter, style, and micro-keyword lanes", () => {
  assert.equal(TEASING_PRESETS.length, 240);
  assert.deepEqual(TEASING_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Emotional Flavour",
    "Gate",
    "Micro Keyword",
    "Motivation",
    "Romance Trope",
    "Teasing Style",
    "Teasing Type",
    "Trigger Event",
  ]);

  assert.equal(getTeasingPresetsByCategory("archetype").length, 20);
  assert.equal(getTeasingPresetsByCategory("teasing style").length, 20);
  assert.equal(getTeasingPresetsByCategory("micro keyword").length, 20);
});

test("normalises readable teasing values and UK spelling", () => {
  const flirt = findTeasingPresetById("teasing_archetype_the_playful_flirt");
  const humour = findTeasingPresetById(
    "teasing_archetype_the_dry_humour_specialist",
  );
  const practised = findTeasingPresetById(
    "teasing_dialogue_you_practised_that_line_didn_t_you",
  );
  const gate = findTeasingPresetById("teasing_gate_comfort_through_humour_gate");
  const keyword = findTeasingPresetById("teasing_keyword_affectionate_menace");

  assert.equal(flirt?.label, "The Playful Flirt");
  assert.equal(humour?.label, "The Dry Humour Specialist");
  assert.equal(practised?.value, "You practised that line, didn't you?");
  assert.equal(gate?.value, "comfort through humour gate");
  assert.equal(keyword?.value, "affectionate menace");

  const readableText = JSON.stringify(
    TEASING_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /Dry Humor|comfort_through_humor|mock_offense/i);
  assert.doesNotMatch(readableText, /practiced|Humor/i);
});

test("compiles teasing presets as soft rapport and boundary-aware guidance", () => {
  const preset = findTeasingPresetById("teasing_archetype_the_playful_flirt");
  assert.ok(preset);

  const summary = compileTeasingPresetSummary(preset);
  const additions = compileTeasingPresetAdditions(preset);

  assert.match(summary, /Teasing preset: Archetype - The Playful Flirt/);
  assert.match(additions.relationshipAddition, /do not turn teasing into cruelty/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /player agency/i);
  assert.match(additions.systemPromptAddition, /tease back/);
  assert.match(additions.systemPromptAddition, /ask for tenderness instead/);
  assert.doesNotMatch(additions.systemPromptAddition, /must|override/i);
});
