import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSpeechStylePreset,
  compileSpeechStylePresetSummary,
  compileSpeechStyleVocabularyPresetSummary,
  findSpeechStylePresetById,
  findSpeechStyleVocabularyPresetById,
  getSpeechStylePresetsByCategory,
  getSpeechStyleVocabularyPresetsByCategory,
  SPEECH_STYLE_PRESET_CATEGORIES,
  SPEECH_STYLE_PRESETS,
  SPEECH_STYLE_VOCABULARY_CATEGORIES,
  SPEECH_STYLE_VOCABULARY_PRESETS,
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

test("loads expanded speech style vocabulary seeds", () => {
  assert.equal(SPEECH_STYLE_VOCABULARY_PRESETS.length, 451);
  assert.equal(new Set(SPEECH_STYLE_VOCABULARY_PRESETS.map((preset) => preset.id)).size, 451);
  assert.deepEqual(SPEECH_STYLE_VOCABULARY_CATEGORIES, [
    "Conflict Directness",
    "Directness Dialogue Seed",
    "High Value Directness",
    "Romantic Directness",
    "Social Directness",
    "Speech Archetype",
    "Speech Avoidance",
    "Speech Bluntness",
    "Speech Conflict",
    "Speech Conversation",
    "Speech Dialogue Seed",
    "Speech Diplomatic",
    "Speech Directness",
    "Speech Directness Preset",
    "Speech Directness Scale",
    "Speech Emotion",
    "Speech Formality",
    "Speech Gentle Directness",
    "Speech Humour",
    "Speech Indirectness",
    "Speech Manipulation",
    "Speech Passive Aggressive",
    "Speech Quirk",
    "Speech Romance",
    "Speech Social",
    "Speech Style Preset",
    "Speech Vocabulary",
  ]);

  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech style preset").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech directness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech directness preset").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech directness scale").length, 10);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech bluntness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech gentle directness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech diplomatic").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech indirectness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech avoidance").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech passive aggressive").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech manipulation").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("romantic directness").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("conflict directness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("social directness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("high value directness").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("directness dialogue seed").length, 21);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech formality").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech emotion").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech vocabulary").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech humour").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech conversation").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech romance").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech conflict").length, 15);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech quirk").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech social").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech archetype").length, 20);
  assert.equal(getSpeechStyleVocabularyPresetsByCategory("speech dialogue seed").length, 20);
});

test("normalises speech vocabulary values and compiles soft guidance", () => {
  const humourist = must(
    findSpeechStyleVocabularyPresetById("speech_style_preset_the_deadpan_dry_humourist"),
  );
  const dryHumour = must(findSpeechStyleVocabularyPresetById("speech_humour_dry_humour"));
  const romantic = must(
    findSpeechStyleVocabularyPresetById("speech_romance_says_exactly_what_they_feel"),
  );
  const directPreset = must(
    findSpeechStyleVocabularyPresetById("speech_directness_preset_the_brutally_honest_one"),
  );
  const weaponised = must(
    findSpeechStyleVocabularyPresetById("speech_bluntness_weaponised_honesty"),
  );
  const offence = must(findSpeechStyleVocabularyPresetById("speech_diplomatic_avoids_offence"));
  const directRomantic = must(
    findSpeechStyleVocabularyPresetById("romantic_directness_says_exactly_what_they_feel"),
  );
  const directDialogue = must(
    findSpeechStyleVocabularyPresetById(
      "directness_dialogue_seed_i_like_you_there_now_its_your_problem_too",
    ),
  );
  const dialogue = must(
    findSpeechStyleVocabularyPresetById(
      "speech_dialogue_seed_you_deserve_softer_words_than_the_world_usually_gives_you",
    ),
  );
  const summary = compileSpeechStyleVocabularyPresetSummary(romantic);
  const allText = JSON.stringify(SPEECH_STYLE_VOCABULARY_PRESETS) + summary;

  assert.equal(humourist.value, "The Deadpan Dry Humourist");
  assert.equal(dryHumour.value, "dry humour");
  assert.equal(romantic.value, "says exactly what they feel");
  assert.equal(directPreset.value, "The Brutally Honest One");
  assert.equal(weaponised.value, "weaponised honesty");
  assert.equal(offence.value, "avoids offence");
  assert.equal(directRomantic.value, "says exactly what they feel");
  assert.equal(directDialogue.value, "I like you. There, now it's your problem too.");
  assert.equal(dialogue.value, "You deserve softer words than the world usually gives you.");
  assert.match(summary, /consent-aware/i);
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(allText, /dry_humor|dark_humor|flirtatious_humor|chaotic_humor|observational_humor/i);
  assert.doesNotMatch(allText, /weaponized|offense/i);
  assert.doesNotMatch(allText, /must adjust|force prose|replicate/i);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
