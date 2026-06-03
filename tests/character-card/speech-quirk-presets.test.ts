import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSpeechQuirkPresetAdditions,
  compileSpeechQuirkPresetSummary,
  findSpeechQuirkPresetById,
  getSpeechQuirkPresetsByCategory,
  SPEECH_QUIRK_PRESET_CATEGORIES,
  SPEECH_QUIRK_PRESETS,
} from "../../data/speechQuirkPresets";

test("loads speech quirk presets across naming, delivery, and romance lanes", () => {
  assert.equal(SPEECH_QUIRK_PRESETS.length, 205);
  assert.deepEqual(SPEECH_QUIRK_PRESET_CATEGORIES, [
    "Archetype",
    "Dialogue Seed",
    "Gate",
    "Romance Hook",
    "Speech Quirk",
  ]);

  const ids = SPEECH_QUIRK_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("speech_quirk")));
  assert.equal(getSpeechQuirkPresetsByCategory("archetype").length, 20);
  assert.equal(getSpeechQuirkPresetsByCategory("speech quirk").length, 130);
  assert.equal(getSpeechQuirkPresetsByCategory("romance hook").length, 15);
  assert.equal(getSpeechQuirkPresetsByCategory("gate").length, 20);
  assert.equal(getSpeechQuirkPresetsByCategory("dialogue seed").length, 20);
});

test("normalises speech quirk values and keeps dialogue examples readable", () => {
  const allText = JSON.stringify(SPEECH_QUIRK_PRESETS);
  const archetype = findSpeechQuirkPresetById(
    "speech_quirk_archetype_the_pet_name_user",
  );
  const userName = findSpeechQuirkPresetById(
    "speech_quirk_repeats_user_name_when_emotional",
  );
  const userSentences = findSpeechQuirkPresetById(
    "speech_quirk_finishes_user_sentences",
  );
  const maam = findSpeechQuirkPresetById("speech_quirk_uses_sir_or_ma_am");
  const thats = findSpeechQuirkPresetById(
    "speech_quirk_says_thats_not_a_request",
  );
  const dont = findSpeechQuirkPresetById("speech_quirk_says_don_t_test_me_as_flirt");
  const youre = findSpeechQuirkPresetById(
    "speech_quirk_says_you_re_safe_as_reassurance",
  );
  const dialogue = findSpeechQuirkPresetById("speech_quirk_dialogue_fine_stay");

  assert.equal(archetype?.value, "The Pet-Name User");
  assert.equal(userName?.value, "repeats {{user}} name when emotional");
  assert.equal(userSentences?.value, "finishes {{user}} sentences");
  assert.equal(maam?.value, "uses sir or ma'am");
  assert.equal(thats?.value, "says that's not a request");
  assert.equal(dont?.value, "says don't test me as flirt");
  assert.equal(youre?.value, "says you're safe as reassurance");
  assert.equal(dialogue?.value, "Fine. Stay.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(allText, /thats not|dont test|youre safe|sir or maam/i);
});

test("compiles speech quirk presets as soft voice guidance", () => {
  const preset = findSpeechQuirkPresetById(
    "speech_quirk_archetype_the_one_with_a_signature_phrase",
  );
  assert.ok(preset);

  const summary = compileSpeechQuirkPresetSummary(preset);
  const additions = compileSpeechQuirkPresetAdditions(preset);

  assert.match(summary, /Speech quirk preset: Archetype - The One With a Signature Phrase/);
  assert.match(additions.speechStyleAddition, /soft speech texture/i);
  assert.match(additions.relationshipAddition, /emotional safety/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /conversational boundaries/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
