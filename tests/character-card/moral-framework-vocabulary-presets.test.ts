import assert from "node:assert/strict";
import test from "node:test";

import {
  compileMoralFrameworkVocabularySeedAdditions,
  compileMoralFrameworkVocabularySeedSummary,
  findMoralFrameworkVocabularySeedBySeed,
  getMoralFrameworkVocabularySeedsByTag,
  MORAL_FRAMEWORK_VOCABULARY_REGISTRY_PRESETS,
  MORAL_FRAMEWORK_VOCABULARY_SEEDS,
  MORAL_FRAMEWORK_VOCABULARY_TAGS,
} from "../../data/moralFrameworkVocabularyPresets";

const EXPECTED_SEED_KEYS = [
  "seed",
  "label",
  "description",
  "examples",
  "tags",
  "relatedSeeds",
  "oppositeSeeds",
  "romanceHooks",
  "scenarioHooks",
  "dialoguePatterns",
  "metadata",
].sort();

const EXPECTED_METADATA_KEYS = [
  "conflictPotential",
  "rarity",
  "romanceValue",
].sort();

test("loads standard moral framework vocabulary seeds", () => {
  assert.equal(MORAL_FRAMEWORK_VOCABULARY_SEEDS.length, 9);

  const ids = MORAL_FRAMEWORK_VOCABULARY_SEEDS.map((preset) => preset.seed);
  assert.equal(new Set(ids).size, ids.length);

  for (const seed of MORAL_FRAMEWORK_VOCABULARY_SEEDS) {
    assert.deepEqual(Object.keys(seed).sort(), EXPECTED_SEED_KEYS);
    assert.deepEqual(Object.keys(seed.metadata).sort(), EXPECTED_METADATA_KEYS);
    assert.equal(seed.examples.length >= 3, true);
    assert.equal(seed.tags.length >= 4, true);
    assert.equal(seed.romanceHooks.length >= 3, true);
    assert.equal(seed.scenarioHooks.length >= 3, true);
    assert.equal(seed.dialoguePatterns.length >= 3, true);
    assert.equal(seed.metadata.romanceValue >= 1, true);
    assert.equal(seed.metadata.romanceValue <= 10, true);
    assert.equal(seed.metadata.conflictPotential >= 1, true);
    assert.equal(seed.metadata.conflictPotential <= 10, true);
  }
});

test("keeps moral framework lookup and spelling coverage stable", () => {
  const care = findMoralFrameworkVocabularySeedBySeed("CARE_ETHICS");
  const honour = findMoralFrameworkVocabularySeedBySeed("honor_ethics");

  assert.equal(care?.label, "Care Ethics");
  assert.equal(honour?.label, "Honour Ethics");
  assert.equal(honour?.tags.includes("honour"), true);
  assert.equal(honour?.tags.includes("honor"), true);
  assert.equal(honour?.romanceHooks.includes("honorable_knight"), true);
  assert.equal(honour?.romanceHooks.includes("honourable_knight"), true);
  assert.equal(
    getMoralFrameworkVocabularySeedsByTag("honor").some(
      (seed) => seed.seed === "honor_ethics",
    ),
    true,
  );
  assert.equal(
    getMoralFrameworkVocabularySeedsByTag("honour").some(
      (seed) => seed.seed === "honor_ethics",
    ),
    true,
  );
  assert.equal(MORAL_FRAMEWORK_VOCABULARY_TAGS.includes("accountability"), true);
});

test("derives registry presets from canonical moral framework seeds", () => {
  assert.equal(
    MORAL_FRAMEWORK_VOCABULARY_REGISTRY_PRESETS.length,
    MORAL_FRAMEWORK_VOCABULARY_SEEDS.length,
  );

  const truth = MORAL_FRAMEWORK_VOCABULARY_REGISTRY_PRESETS.find(
    (preset) => preset.id === "moral_framework_vocabulary_truth_ethics",
  );

  assert.equal(truth?.category, "Moral Framework Vocabulary");
  assert.equal(truth?.triggerKeys.includes("truth_ethics"), true);
  assert.equal(truth?.triggerKeys.includes("confession_arc"), true);
  assert.match(truth?.guidance ?? "", /Romance hooks/i);
});

test("compiles moral framework seeds as soft guidance", () => {
  const loyalty = must(findMoralFrameworkVocabularySeedBySeed("loyalty_ethics"));
  const additions = compileMoralFrameworkVocabularySeedAdditions(loyalty);
  const summary = compileMoralFrameworkVocabularySeedSummary(loyalty);

  assert.match(summary, /Loyalty Ethics/);
  assert.match(summary, /Related:/);
  assert.match(additions.backgroundAddition, /Moral framework seed/);
  assert.match(additions.personalityAddition, /decision pressure/i);
  assert.match(additions.systemPromptAddition, /SOFT MORAL FRAMEWORK GUIDANCE/);
  assert.match(additions.systemPromptAddition, /optional ethical texture/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/);
  assert.match(additions.systemPromptAddition, /Do not present this framework as universally correct/);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /force prose|must override/i,
  );
});

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
