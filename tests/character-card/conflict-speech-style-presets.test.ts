import assert from "node:assert/strict";
import test from "node:test";

import {
  compileConflictSpeechStylePresetAdditions,
  compileConflictSpeechStylePresetSummary,
  CONFLICT_SPEECH_STYLE_PRESET_CATEGORIES,
  CONFLICT_SPEECH_STYLE_PRESETS,
  findConflictSpeechStylePresetById,
  getConflictSpeechStylePresetsByCategory,
} from "../../data/conflictSpeechStylePresets";

test("loads conflict speech style presets across rupture and repair speech lanes", () => {
  assert.equal(CONFLICT_SPEECH_STYLE_PRESETS.length, 136);
  assert.deepEqual(CONFLICT_SPEECH_STYLE_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Directness",
    "Gate",
    "Repair",
    "Speech Style",
    "Tone",
  ]);

  const ids = CONFLICT_SPEECH_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("conflict_")));
  assert.equal(getConflictSpeechStylePresetsByCategory("archetype").length, 20);
  assert.equal(getConflictSpeechStylePresetsByCategory("speech style").length, 40);
  assert.equal(getConflictSpeechStylePresetsByCategory("directness").length, 15);
  assert.equal(getConflictSpeechStylePresetsByCategory("tone").length, 15);
  assert.equal(getConflictSpeechStylePresetsByCategory("repair").length, 15);
  assert.equal(getConflictSpeechStylePresetsByCategory("gate").length, 15);
  assert.equal(getConflictSpeechStylePresetsByCategory("dialogue seed").length, 16);
});

test("normalises conflict speech values and keeps dialogue examples readable", () => {
  const allText = JSON.stringify(CONFLICT_SPEECH_STYLE_PRESETS);
  const valueText = CONFLICT_SPEECH_STYLE_PRESETS.map((preset) => preset.value).join(
    "\n",
  );
  const archetype = findConflictSpeechStylePresetById(
    "conflict_speech_archetype_the_calm_negotiator",
  );
  const apology = findConflictSpeechStylePresetById(
    "conflict_speech_style_apologises_quickly",
  );
  const apologyStruggle = findConflictSpeechStylePresetById(
    "conflict_speech_style_struggles_to_apologise",
  );
  const humour = findConflictSpeechStylePresetById(
    "conflict_speech_style_deflects_with_humour",
  );
  const dialogue = findConflictSpeechStylePresetById(
    "conflict_speech_dialogue_i_choose_repair_over_pride",
  );

  assert.equal(archetype?.value, "The Calm Negotiator");
  assert.equal(apology?.value, "apologises quickly");
  assert.equal(apologyStruggle?.value, "struggles to apologise");
  assert.equal(humour?.value, "deflects with humour");
  assert.equal(dialogue?.value, "I choose repair over pride.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /apologizes|apologize|humor/i);
});

test("compiles conflict speech presets as soft repair-aware guidance", () => {
  const preset = findConflictSpeechStylePresetById(
    "conflict_speech_archetype_the_gentle_repairer",
  );
  assert.ok(preset);

  const summary = compileConflictSpeechStylePresetSummary(preset);
  const additions = compileConflictSpeechStylePresetAdditions(preset);

  assert.match(
    summary,
    /Conflict speech preset: Archetype - The Gentle Repairer/,
  );
  assert.match(additions.speechStyleAddition, /soft speech texture/i);
  assert.match(additions.relationshipAddition, /accountability/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /conversational boundaries/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
