import assert from "node:assert/strict";
import test from "node:test";

import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  findWoundVocabularySeedBySeed,
  getWoundVocabularySeedsByCategory,
  WOUND_VOCABULARY_CATEGORIES,
  WOUND_VOCABULARY_SEEDS,
  WOUND_VOCABULARY_STANDARD_SEEDS,
} from "../../data/woundVocabularyPresets";
import type { WoundSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_WOUND_SEED_KEYS = [
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
  "triggers",
  "defenseMechanisms",
  "attachmentEffects",
  "healingNeeds",
  "repairMethods",
  "growthArcs",
  "metadata",
].sort();

test("loads broad wound vocabulary seeds across stable categories", () => {
  const ids = WOUND_VOCABULARY_SEEDS.map((seed) => seed.seed);

  assert.equal(WOUND_VOCABULARY_SEEDS.length, 158);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(WOUND_VOCABULARY_CATEGORIES.length, 16);
  assert.deepEqual(
    WOUND_VOCABULARY_CATEGORIES.slice(0, 4),
    [
      "attachment_wounds",
      "core_archetype_wounds",
      "existential_wounds",
      "family_wounds",
    ],
  );
  assert.equal(getWoundVocabularySeedsByCategory("attachment_wounds").length, 10);
  assert.equal(getWoundVocabularySeedsByCategory("possessive_obsessive_wounds").length, 8);
});

test("keeps wound-specific shape and high-angst metadata", () => {
  const worthlessness = must(findWoundVocabularySeedBySeed("worthlessness_wound"));
  const abuse = must(findWoundVocabularySeedBySeed("abuse_survivor_wound"));
  const enoughArc = must(
    findWoundVocabularySeedBySeed("learning_they_were_always_enough_arc"),
  );

  assertWoundSeedShape(worthlessness);
  assert.equal(worthlessness.metadata.severity, "extreme");
  assert.equal(worthlessness.metadata.angstValue, 10);
  assert.equal(abuse.metadata.severity, "extreme");
  assert.equal(enoughArc.metadata.category, "healing_arc_presets");
  assert.ok(enoughArc.growthArcs.includes("internalizes_safety"));
  assert.ok(worthlessness.healingNeeds.includes("safe_vulnerability"));
});

test("adapts broad wound seeds into standardized vocabulary seeds", () => {
  const woundSeed = must(findWoundVocabularySeedBySeed("everyone_leaves_wound"));
  const standardSeed = must(
    WOUND_VOCABULARY_STANDARD_SEEDS.find(
      (seed) => seed.seed === woundSeed.seed,
    ),
  );

  assert.equal(WOUND_VOCABULARY_STANDARD_SEEDS.length, WOUND_VOCABULARY_SEEDS.length);
  assert.equal(standardSeed.label, "Everyone Leaves Wound");
  assert.equal(standardSeed.description, woundSeed.description);
  assert.equal(standardSeed.metadata.conflictPotential, woundSeed.metadata.angstValue);
  assert.ok(standardSeed.relatedSeeds.includes("heightened_reassurance_need"));
});

test("bridges broad wound vocabulary into the semantic graph", () => {
  const graphNode = findSemanticSeedGraphNodeById(
    "wound-vocabulary:everyone_leaves_wound",
  );

  assert.equal(graphNode?.label, "Everyone Leaves Wound");
  assert.equal(graphNode?.category, "wounds");
  assert.equal(graphNode?.parents.includes("attachment_wound"), true);
  assert.equal(
    graphNode?.sourceRegistryKeys?.includes("wound-vocabulary:everyone_leaves_wound"),
    true,
  );
});

function assertWoundSeedShape(seed: WoundSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_WOUND_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "healingValue",
    "romanceValue",
    "severity",
  ]);
}

function must<T>(value: T | undefined): T {
  assert.ok(value);
  return value;
}
