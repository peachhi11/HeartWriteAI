import assert from "node:assert/strict";
import test from "node:test";

import {
  findPersonalityAppearanceVocabularyEntry,
  PERSONALITY_APPEARANCE_VOCABULARY,
} from "../../lib/character-card/personalityAppearanceVocabulary";

test("ingests personality and appearance vocabulary with corrected skinny/thin definition", () => {
  const entry = findPersonalityAppearanceVocabularyEntry("skinny-thin");

  assert.equal(entry?.label, "Skinny / thin");
  assert.equal(entry?.definition, "Very slim or underweight.");
  assert.doesNotMatch(entry?.definition ?? "", /overweight/i);
});

test("ingests wavy hair with the missing noun restored", () => {
  const entry = findPersonalityAppearanceVocabularyEntry("wavy-hair");

  assert.equal(entry?.label, "Wavy hair");
  assert.equal(entry?.definition, "Hair with a slight curl.");
});

test("ingests user-provided physical appearance descriptors with stable prefixed keys", () => {
  const entry = findPersonalityAppearanceVocabularyEntry("appearance-athletic");

  assert.equal(entry?.label, "Athletic");
  assert.equal(entry?.definition, "Strong and fit.");
  assert.equal(entry?.domain, "appearance");
  assert.equal(entry?.source, "user-provided-person-descriptor-list");
});

test("ingests user-provided cute person descriptors separately from base appearance terms", () => {
  const entry = findPersonalityAppearanceVocabularyEntry("cute-adorable");

  assert.equal(entry?.label, "Adorable");
  assert.equal(entry?.definition, "Inspiring great affection.");
  assert.equal(entry?.domain, "appearance");
  assert.equal(entry?.polarity, "positive");
});

test("ingests user-provided person nouns as neutral role descriptors", () => {
  const entry = findPersonalityAppearanceVocabularyEntry("noun-guardian");

  assert.equal(entry?.label, "Guardian");
  assert.equal(entry?.definition, "Protector or keeper.");
  assert.equal(entry?.domain, "person-noun");
  assert.equal(entry?.polarity, "neutral");
});

test("keeps vocabulary keys unique for deterministic seed lookups", () => {
  const keys = PERSONALITY_APPEARANCE_VOCABULARY.map((entry) => entry.key);

  assert.equal(new Set(keys).size, keys.length);
});
