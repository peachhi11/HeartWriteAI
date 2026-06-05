import assert from "node:assert/strict";
import test from "node:test";

import {
  compileDescriptiveWritingSeedAdditions,
  DESCRIPTIVE_WRITING_SEED_CATEGORIES,
  DESCRIPTIVE_WRITING_SEED_LANES,
  DESCRIPTIVE_WRITING_SEEDS,
  findDescriptiveWritingSeedById,
  getDescriptiveWritingSeedsByCategory,
  getDescriptiveWritingSeedsByLane,
} from "../../data/descriptiveWritingSeedPresets";

test("loads descriptive writing seeds across character prose lanes", () => {
  assert.equal(DESCRIPTIVE_WRITING_SEEDS.length, 50);
  assert.deepEqual(DESCRIPTIVE_WRITING_SEED_CATEGORIES, [
    "Body Language",
    "Emotional Expression",
    "Personality Description",
    "Physical Description",
    "Speech Pattern",
  ]);
  assert.deepEqual(DESCRIPTIVE_WRITING_SEED_LANES, [
    "appearance",
    "body-language",
    "emotional-expression",
    "personality",
    "speech",
  ]);

  const ids = DESCRIPTIVE_WRITING_SEEDS.map((seed) => seed.id);
  const texts = DESCRIPTIVE_WRITING_SEEDS.map((seed) => seed.text);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(texts).size, texts.length);
  assert.ok(ids.every((id) => id.startsWith("descriptive_")));
  assert.ok(
    DESCRIPTIVE_WRITING_SEEDS.every(
      (seed) => seed.source === "user-provided-character-description-list",
    ),
  );
  assert.equal(getDescriptiveWritingSeedsByCategory("Physical Description").length, 10);
  assert.equal(getDescriptiveWritingSeedsByCategory("Emotional Expression").length, 10);
  assert.equal(getDescriptiveWritingSeedsByCategory("Personality Description").length, 10);
  assert.equal(getDescriptiveWritingSeedsByCategory("Body Language").length, 10);
  assert.equal(getDescriptiveWritingSeedsByCategory("Speech Pattern").length, 10);
  assert.equal(getDescriptiveWritingSeedsByLane("appearance").length, 10);
  assert.equal(getDescriptiveWritingSeedsByLane("body-language").length, 10);
  assert.equal(getDescriptiveWritingSeedsByLane("emotional-expression").length, 10);
  assert.equal(getDescriptiveWritingSeedsByLane("personality").length, 10);
  assert.equal(getDescriptiveWritingSeedsByLane("speech").length, 10);
});

test("keeps user-provided descriptive seed prose readable and normalized", () => {
  const copperCurls = findDescriptiveWritingSeedById(
    "descriptive_physical_tangled_copper_curls",
  );
  const hollowLaugh = findDescriptiveWritingSeedById(
    "DESCRIPTIVE_EMOTIONAL_HOLLOW_BARK_LAUGH",
  );
  const measuredSpeech = findDescriptiveWritingSeedById(
    "descriptive_personality_measured_precise_speech",
  );
  const crossedArms = findDescriptiveWritingSeedById(
    "descriptive_body_language_crossed_arms_shutdown",
  );
  const heavyAccent = findDescriptiveWritingSeedById(
    "descriptive_speech_heavy_accent",
  );

  assert.equal(
    copperCurls?.text,
    "Her hair was a tangled mess of copper curls, wild and untamable, like her spirit.",
  );
  assert.equal(
    hollowLaugh?.text,
    "His laugh was hollow, more of a bark than an expression of joy.",
  );
  assert.equal(
    measuredSpeech?.text,
    "She never said a word unless she was sure of it, each sentence measured and precise, like the ticking of a clock.",
  );
  assert.equal(
    crossedArms?.text,
    "He crossed his arms over his chest, a clear sign he wasn't interested in hearing anything more.",
  );
  assert.equal(
    heavyAccent?.text,
    "He spoke with a heavy accent, his words thick and difficult to decipher, but full of passion.",
  );

  const allText = JSON.stringify(DESCRIPTIVE_WRITING_SEEDS);
  assert.doesNotMatch(allText, /[\u2018-\u201f]/);
  assert.doesNotMatch(allText, /[\u2013-\u2014]/);
});

test("compiles descriptive writing seeds as optional prose guidance", () => {
  const seed = findDescriptiveWritingSeedById(
    "descriptive_emotional_trembling_calm_mask",
  );
  assert.ok(seed);

  const additions = compileDescriptiveWritingSeedAdditions(seed);

  assert.match(additions.proseReference, /Descriptive writing seed/);
  assert.match(additions.proseReference, /Her hands trembled ever so slightly/);
  assert.match(additions.styleAddition, /concrete, character-specific detail/i);
  assert.match(additions.systemPromptAddition, /optional prose texture/i);
  assert.match(additions.systemPromptAddition, /not a fixed line to repeat/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force prose|override|completely overwrite/i,
  );
});
