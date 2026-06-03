import assert from "node:assert/strict";
import test from "node:test";

import {
  compileComplementVocabularyAdditions,
  COMPLEMENT_VOCABULARY_CATEGORIES,
  COMPLEMENT_VOCABULARY_PRESETS,
  findComplementVocabularyById,
  getComplementVocabularyByCategory,
} from "../../data/complementPresets";

test("loads complement vocabulary presets with stable ids and categories", () => {
  assert.equal(COMPLEMENT_VOCABULARY_PRESETS.length, 5);
  assert.deepEqual(COMPLEMENT_VOCABULARY_CATEGORIES, [
    "Academic/Rivals",
    "Beast/Beauty",
    "Bodyguard/Royalty",
    "Grumpy/Sunshine",
    "Stalker/Target",
  ]);

  const ids = COMPLEMENT_VOCABULARY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("vocab_complement_")));
  assert.equal(
    getComplementVocabularyByCategory("Academic/Rivals")[0]?.id,
    "vocab_complement_academic_rivals",
  );
});

test("normalizes complement draft typos and hard compiler language", () => {
  const allText = JSON.stringify(COMPLEMENT_VOCABULARY_PRESETS);
  const academic = findComplementVocabularyById("vocab_complement_academic_rivals");

  assert.ok(academic);
  assert.match(academic.sampleProseSnippet, /dissect/);
  assert.doesNotMatch(allText, /sampleDialogueLine/);
  assert.doesNotMatch(allText, /\benvelope\b/);
  assert.doesNotMatch(allText, /must|force|forces|perfect narrative balance/i);
});

test("compiles complement vocabulary as optional dual-character guidance", () => {
  const preset = findComplementVocabularyById("vocab_complement_stalker_target");
  assert.ok(preset);

  const additions = compileComplementVocabularyAdditions(preset);

  assert.match(additions.relationshipAddition, /Complement vocabulary preset/);
  assert.match(additions.relationshipAddition, /surrender/);
  assert.match(additions.relationshipAddition, /surveillance/);
  assert.match(additions.systemPromptAddition, /Complement guidance/);
  assert.match(additions.systemPromptAddition, /optional dual-character interaction texture/i);
  assert.match(additions.systemPromptAddition, /preserve consent, reciprocity, boundaries, and both characters' agency/i);
  assert.match(additions.systemPromptAddition, /watched character's agency explicit/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must adjust|force prose|replicate/i);
});
