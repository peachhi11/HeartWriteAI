import assert from "node:assert/strict";
import test from "node:test";

import {
  compileRomanticSpeechStylePresetAdditions,
  compileRomanticSpeechStylePresetSummary,
  findRomanticSpeechStylePresetById,
  getRomanticSpeechStylePresetsByCategory,
  ROMANTIC_SPEECH_STYLE_PRESET_CATEGORIES,
  ROMANTIC_SPEECH_STYLE_PRESETS,
} from "../../data/romanticSpeechStylePresets";

test("loads romantic speech style presets across affection and repair lanes", () => {
  assert.equal(ROMANTIC_SPEECH_STYLE_PRESETS.length, 200);
  assert.deepEqual(ROMANTIC_SPEECH_STYLE_PRESET_CATEGORIES, [
    "Archetype",
    "Compliment",
    "Conflict Speech",
    "Dialogue Seed",
    "Flirting",
    "Gate",
    "Pet Name",
    "Reassurance",
    "Speech Style",
    "Tone",
  ]);

  const ids = ROMANTIC_SPEECH_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("romantic_")));
  assert.equal(getRomanticSpeechStylePresetsByCategory("archetype").length, 20);
  assert.equal(
    getRomanticSpeechStylePresetsByCategory("speech style").length,
    20,
  );
  assert.equal(getRomanticSpeechStylePresetsByCategory("tone").length, 20);
  assert.equal(getRomanticSpeechStylePresetsByCategory("flirting").length, 20);
  assert.equal(getRomanticSpeechStylePresetsByCategory("pet name").length, 20);
  assert.equal(getRomanticSpeechStylePresetsByCategory("compliment").length, 20);
  assert.equal(getRomanticSpeechStylePresetsByCategory("reassurance").length, 20);
  assert.equal(
    getRomanticSpeechStylePresetsByCategory("conflict speech").length,
    20,
  );
  assert.equal(getRomanticSpeechStylePresetsByCategory("gate").length, 20);
  assert.equal(getRomanticSpeechStylePresetsByCategory("dialogue seed").length, 20);
});

test("normalises romantic speech values and keeps dialogue examples readable", () => {
  const allText = JSON.stringify(ROMANTIC_SPEECH_STYLE_PRESETS);
  const valueText = ROMANTIC_SPEECH_STYLE_PRESETS.map((preset) => preset.value).join(
    "\n",
  );
  const archetype = findRomanticSpeechStylePresetById(
    "romantic_speech_archetype_the_poetic_confessor",
  );
  const compliment = findRomanticSpeechStylePresetById(
    "romantic_compliment_compliments_when_user_doubts_self",
  );
  const conflict = findRomanticSpeechStylePresetById(
    "romantic_conflict_speech_apologises_quickly",
  );
  const conflictStruggle = findRomanticSpeechStylePresetById(
    "romantic_conflict_speech_struggles_to_apologise",
  );
  const dialogue = findRomanticSpeechStylePresetById(
    "romantic_speech_dialogue_you_are_my_favourite_interruption",
  );

  assert.equal(archetype?.value, "The Poetic Confessor");
  assert.equal(compliment?.value, "compliments when {{user}} doubts self");
  assert.equal(conflict?.value, "apologises quickly");
  assert.equal(conflictStruggle?.value, "struggles to apologise");
  assert.equal(dialogue?.value, "You are my favourite interruption.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /favorite|apologizes|apologize/i);
});

test("compiles romantic speech presets as soft consent-aware guidance", () => {
  const preset = findRomanticSpeechStylePresetById(
    "romantic_speech_archetype_the_devotional_speaker",
  );
  assert.ok(preset);

  const summary = compileRomanticSpeechStylePresetSummary(preset);
  const additions = compileRomanticSpeechStylePresetAdditions(preset);

  assert.match(
    summary,
    /Romantic speech preset: Archetype - The Devotional Speaker/,
  );
  assert.match(additions.speechStyleAddition, /soft speech texture/i);
  assert.match(additions.relationshipAddition, /reciprocal interest/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /conversational boundaries/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
