import assert from "node:assert/strict";
import test from "node:test";

import {
  compileVoiceVocabularyPresetAdditions,
  compileVoiceVocabularyPresetSummary,
  findVoiceVocabularyPresetById,
  getVoiceVocabularyPresetsByCategory,
  VOICE_VOCABULARY_CATEGORIES,
  VOICE_VOCABULARY_PRESETS,
} from "../../data/voiceVocabularyPresets";

test("loads normalized voice vocabulary presets with stable categories", () => {
  assert.equal(VOICE_VOCABULARY_PRESETS.length, 6);

  const ids = VOICE_VOCABULARY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(VOICE_VOCABULARY_CATEGORIES, [
    "Crisp & Angular",
    "Ethereal & Detached",
    "Gravelly & Weathered",
    "Low & Resonant",
    "Melodic & Warm",
    "Velvety & Intimate",
  ]);
  assert.equal(
    getVoiceVocabularyPresetsByCategory("low & resonant")[0]?.id,
    "voice_low_resonant_mountain",
  );
});

test("compiles voice vocabulary as textual additions only", () => {
  const resonant = must(findVoiceVocabularyPresetById("VOICE_LOW_RESONANT_MOUNTAIN"));
  const additions = compileVoiceVocabularyPresetAdditions(resonant);

  assert.match(additions.speechStyleAddition, /Voice vocabulary preset/);
  assert.match(additions.lexicalGuidance, /Voice lexical palette/);
  assert.match(additions.systemPromptAddition, /descriptive texture only/);
  assert.match(additions.systemPromptAddition, /without replacing the selected speech style/);
  assert.match(additions.speechStyleAddition, /Sub-Bass Baritone/);
});

test("normalizes risky voice attachment wording into boundary-aware language", () => {
  const velvet = must(findVoiceVocabularyPresetById("voice_velvet_intimate_shadow"));
  const ethereal = must(findVoiceVocabularyPresetById("voice_ethereal_detached_guide"));
  const allText = [
    compileVoiceVocabularyPresetSummary(velvet),
    compileVoiceVocabularyPresetSummary(ethereal),
    compileVoiceVocabularyPresetAdditions(velvet).systemPromptAddition,
  ].join(" ");

  assert.match(allText, /consent/i);
  assert.match(allText, /privacy/i);
  assert.doesNotMatch(allText, /\bstalker\b/i);
  assert.doesNotMatch(allText, /possessive/i);
  assert.doesNotMatch(allText, /commands immediate compliance/i);
  assert.doesNotMatch(allText, /claustrophob/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
