import assert from "node:assert/strict";
import test from "node:test";

import {
  compileRelationshipDynamicVocabularyInjection,
  findRelationshipDynamicVocabularyById,
  getRelationshipDynamicVocabularyByCategory,
  getRelationshipDynamicVocabularyByMode,
  RELATIONSHIP_DYNAMIC_VOCABULARY_CATEGORIES,
  RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS,
} from "../../data/relationshipDynamicVocabulary";

test("loads relationship dynamic vocabulary presets with stable unique ids", () => {
  assert.equal(RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.length, 5);

  const ids = RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("vocab_")));
});

test("groups relationship dynamic vocabulary by category and dynamic mode", () => {
  assert.deepEqual(RELATIONSHIP_DYNAMIC_VOCABULARY_CATEGORIES, [
    "Caretaker / Hurt-Comfort",
    "Dark / Obsessive",
    "Formal / Arranged",
    "Grumpy / Sunshine",
    "Rivalry / Academic",
  ]);

  assert.equal(getRelationshipDynamicVocabularyByMode("rivalry")[0]?.id, "vocab_rivalry_academic");
  assert.equal(getRelationshipDynamicVocabularyByMode("obsession")[0]?.id, "vocab_dark_obsessive");
  assert.equal(getRelationshipDynamicVocabularyByMode("missing").length, 0);
  assert.equal(
    getRelationshipDynamicVocabularyByCategory("formal / arranged")[0]?.id,
    "vocab_formal_arranged",
  );
});

test("normalizes formal vocabulary typo and avoids hard override language", () => {
  const formal = findRelationshipDynamicVocabularyById("VOCAB_FORMAL_ARRANGED");
  const compiled = compileRelationshipDynamicVocabularyInjection(must(formal));

  assert.ok(formal?.lexicalTokens.descriptiveAdjectives.includes("immaculate"));
  assert.equal(formal?.sampleProseSnippet.includes("immacualte"), false);
  assert.match(compiled.systemBehavior, /without forcing repeated wording/);
  assert.doesNotMatch(compiled.systemBehavior, /override/i);
});

test("normalizes dark vocabulary with privacy-conscious language", () => {
  const dark = findRelationshipDynamicVocabularyById("vocab_dark_obsessive");
  const allTokens = [
    ...(dark?.lexicalTokens.signatureVerbs ?? []),
    ...(dark?.lexicalTokens.spatialNouns ?? []),
    dark?.lexicalTokens.dialoguePacing ?? "",
    dark?.sampleProseSnippet ?? "",
  ].join(" ");

  assert.ok(dark?.systemPromptTags.includes("privacy-conscious intensity"));
  assert.match(dark?.lexicalTokens.dialoguePacing ?? "", /boundary-aware/i);
  assert.doesNotMatch(allTokens, /\bstalk\b/i);
  assert.doesNotMatch(allTokens, /\bpossess\b/i);
  assert.doesNotMatch(allTokens, /\bcage\b/i);
});

test("compiles relationship vocabulary into prompt-ready lexical guidance", () => {
  const rivalry = must(findRelationshipDynamicVocabularyById("vocab_rivalry_academic"));
  const compiled = compileRelationshipDynamicVocabularyInjection(rivalry);

  assert.match(compiled.systemBehavior, /Cutthroat Intellect/);
  assert.match(compiled.lexicalConstraints, /dissect/);
  assert.match(compiled.lexicalConstraints, /razor-sharp/);
  assert.match(compiled.formattingDirectives, /staccato verbal friction/);
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
