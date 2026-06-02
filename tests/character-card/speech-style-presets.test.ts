import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSpeechStylePreset,
  compileSpeechStylePresetSummary,
  findSpeechStylePresetById,
  getSpeechStylePresetsByCategory,
  SPEECH_STYLE_PRESET_CATEGORIES,
  SPEECH_STYLE_PRESETS,
} from "../../data/speechStylePresets";

test("loads speech style presets with stable ids and categories", () => {
  assert.equal(SPEECH_STYLE_PRESETS.length, 4);

  const ids = SPEECH_STYLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(SPEECH_STYLE_PRESET_CATEGORIES, [
    "Casual & Expressive",
    "Elite & Controlled",
    "Rugged & Direct",
    "Unsettling & Intense",
  ]);
  assert.equal(
    getSpeechStylePresetsByCategory("elite & controlled")[0]?.id,
    "speech_elite_aristocrat",
  );
});

test("maps speech presets into the existing generated speech style schema", () => {
  const elite = must(findSpeechStylePresetById("SPEECH_ELITE_ARISTOCRAT"));
  const rugged = must(findSpeechStylePresetById("speech_rugged_outlaw"));
  const sunshine = must(findSpeechStylePresetById("speech_casual_sunshine"));

  const compiledElite = compileSpeechStylePreset(elite);
  const compiledRugged = compileSpeechStylePreset(rugged);
  const compiledSunshine = compileSpeechStylePreset(sunshine);

  assert.equal(compiledElite.register, "Velvet_Formal");
  assert.equal(compiledElite.vocabularyMode, "Courtly_Formal");
  assert.equal(compiledElite.addressStyle, "Formal_Address");
  assert.equal(compiledElite.styleId, "00000000-0000-4000-8000-000000000201");
  assert.match(compiledElite.speechPatternInstruction, /SPEECH OVERRIDE/);
  assert.match(compiledElite.speechSystemPromptInjection, /DIALOGUE LOCK/);
  assert.equal(compiledRugged.syntaxCadence, "Laconic_Clipped");
  assert.equal(compiledRugged.linguisticFlavor, "Vernacular_Slang");
  assert.equal(compiledSunshine.register, "Playful_Banter");
  assert.equal(compiledSunshine.pitch, "High_Pitched");
});

test("keeps intense speech style boundary-aware", () => {
  const intense = must(findSpeechStylePresetById("speech_unsettling_devotee"));
  const compiled = compileSpeechStylePreset(intense);
  const summary = compileSpeechStylePresetSummary(intense);
  const allText = [
    intense.linguisticTraits.petNamesUsage,
    intense.linguisticTraits.teasingStyle,
    intense.sampleDialogueLine,
    compiled.speechPatternInstruction,
    compiled.speechSystemPromptInjection,
    ...compiled.dialogueDonts,
    summary,
  ].join(" ");

  assert.equal(compiled.register, "Predatory_Quiet");
  assert.equal(compiled.vocalRegister, "Muted_Whisper");
  assert.match(allText, /consent/i);
  assert.match(allText, /boundar/i);
  assert.doesNotMatch(allText, /\bstalker\b/i);
  assert.doesNotMatch(allText, /locked door/i);
  assert.doesNotMatch(allText, /helplessness/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
