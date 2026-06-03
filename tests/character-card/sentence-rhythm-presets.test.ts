import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSentenceRhythmPresetAdditions,
  findSentenceRhythmPresetById,
  getSentenceRhythmPresetsByCategory,
  SENTENCE_RHYTHM_PRESET_CATEGORIES,
  SENTENCE_RHYTHM_PRESETS,
} from "../../data/sentenceRhythmPresets";

test("loads sentence rhythm presets with stable ids and categories", () => {
  assert.equal(SENTENCE_RHYTHM_PRESETS.length, 5);
  assert.deepEqual(
    SENTENCE_RHYTHM_PRESET_CATEGORIES,
    [
      "Fluid/Conversational",
      "Isolating/Prose-Heavy",
      "Staccato/Urgent",
      "Sustained/Periodic",
      "Syncopated/Jittery",
    ],
  );

  const ids = SENTENCE_RHYTHM_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(
    getSentenceRhythmPresetsByCategory("Staccato/Urgent")[0]?.id,
    "rhythm_staccato_urgent",
  );
});

test("removes pasted boilerplate and hard compiler language", () => {
  const allText = JSON.stringify(SENTENCE_RHYTHM_PRESETS);
  assert.doesNotMatch(allText, /Absolute prohibition/i);
  assert.doesNotMatch(allText, /force the dialogue engine/i);
  assert.doesNotMatch(allText, /to-stone-850/i);
});

test("compiles sentence rhythm as optional cadence guidance", () => {
  const preset = findSentenceRhythmPresetById("rhythm_syncopated_jittery");
  assert.ok(preset);

  const additions = compileSentenceRhythmPresetAdditions(preset);

  assert.match(additions.speechStyleAddition, /Sentence rhythm preset: The Stalker Devotee/);
  assert.match(additions.speechStyleAddition, /Fragmentary Interrupted/);
  assert.match(additions.systemPromptAddition, /Sentence rhythm guidance/);
  assert.match(additions.systemPromptAddition, /optional cadence and pacing texture/i);
  assert.match(additions.systemPromptAddition, /preserve consent, reciprocity, boundaries, and player agency/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must force|conform strictly|mandatory/i);
});
