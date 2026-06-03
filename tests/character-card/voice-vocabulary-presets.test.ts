import assert from "node:assert/strict";
import test from "node:test";

import {
  compileVoiceSeedPresetSummary,
  compileVoiceVocabularyPresetAdditions,
  compileVoiceVocabularyPresetSummary,
  findVoiceSeedPresetById,
  findVoiceVocabularyPresetById,
  getVoiceSeedPresetsByCategory,
  getVoiceVocabularyPresetsByCategory,
  VOICE_SEED_CATEGORIES,
  VOICE_SEED_PRESETS,
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

test("loads expanded voice seed vocabulary with stable categories", () => {
  assert.equal(VOICE_SEED_PRESETS.length, 248);
  assert.equal(new Set(VOICE_SEED_PRESETS.map((preset) => preset.id)).size, 248);
  assert.deepEqual(VOICE_SEED_CATEGORIES, [
    "Voice Accent",
    "Voice Dialogue Seed",
    "Voice Emotion",
    "Voice Pace",
    "Voice Pitch",
    "Voice Romance Hook",
    "Voice Species",
    "Voice Texture",
    "Voice Tone",
    "Voice Vocabulary Preset",
    "Voice Volume",
  ]);

  assert.equal(getVoiceSeedPresetsByCategory("voice vocabulary preset").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice tone").length, 48);
  assert.equal(getVoiceSeedPresetsByCategory("voice pitch").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice texture").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice pace").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice volume").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice emotion").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice accent").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice species").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice romance hook").length, 20);
  assert.equal(getVoiceSeedPresetsByCategory("voice dialogue seed").length, 20);
});

test("normalises voice seed values and keeps dialogue examples humanised", () => {
  const velvet = must(findVoiceSeedPresetById("voice_vocabulary_preset_the_velvet_voice"));
  const recognises = must(
    findVoiceSeedPresetById("voice_romance_hook_user_recognises_voice_in_crowd"),
  );
  const firstDialogue = must(
    findVoiceSeedPresetById("voice_dialogue_seed_your_voice_goes_careful_when_you_say_my_name"),
  );
  const doorway = must(
    findVoiceSeedPresetById(
      "voice_dialogue_seed_if_my_voice_sounds_like_home_then_stop_standing_in_the_doorway",
    ),
  );
  const summary = compileVoiceSeedPresetSummary(firstDialogue);
  const allText = JSON.stringify(VOICE_SEED_PRESETS) + summary;

  assert.equal(velvet.value, "The Velvet Voice");
  assert.equal(recognises.value, "user recognises voice in crowd");
  assert.equal(firstDialogue.value, "Your voice goes careful when you say my name.");
  assert.equal(doorway.value, "If my voice sounds like home, then stop standing in the doorway.");
  assert.match(summary, /humanised reference beat/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(allText, /recognizes|humanized/i);
  assert.doesNotMatch(allText, /must adjust|force prose|replicate/i);
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
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
