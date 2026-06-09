import assert from "node:assert/strict";
import test from "node:test";

import {
  FEAR_SEED_TEMPLATES,
  FEAR_VOCABULARY_SEEDS,
  FEAR_VOCABULARY_STANDARD_SEEDS,
  FEAR_VOCABULARY_TEMPLATE_KEYS,
  findFearVocabularySeedBySeed,
  getFearVocabularySeedsByType,
} from "../../data/fearVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { FearSeed } from "../../data/vocabularySeedTypes";

test("generates broad fear seeds from reusable archetypal templates", () => {
  assert.equal(FEAR_VOCABULARY_SEEDS.length, 69);
  assert.equal(new Set(FEAR_VOCABULARY_SEEDS.map((seed) => seed.seed)).size, 69);
  assert.equal(FEAR_VOCABULARY_TEMPLATE_KEYS.length, 10);
  assert.deepEqual(FEAR_VOCABULARY_TEMPLATE_KEYS, [
    "attachment",
    "emotional",
    "existential",
    "healing",
    "identity",
    "moral",
    "obsession",
    "safety",
    "self_worth",
    "social",
  ]);

  assert.equal(getFearVocabularySeedsByType("attachment").length, 10);
  assert.equal(getFearVocabularySeedsByType("self_worth").length, 7);
  assert.equal(getFearVocabularySeedsByType("obsession").length, 6);
  assert.equal(FEAR_SEED_TEMPLATES.attachment.coreBelief, "People eventually leave.");
});

test("keeps fear-specific story psychology fields rich and template-derived", () => {
  const replacement = findFearVocabularySeedBySeed("fear_of_replacement");
  assertFearSeedShape(replacement);

  assert.equal(replacement?.label, "Fear of replacement");
  assert.equal(replacement?.fearType, "attachment");
  assert.equal(replacement?.coreBelief, "People eventually leave.");
  assert.equal(replacement?.hiddenNeed, "Reliable emotional permanence.");
  assert.equal(replacement?.metadata.category, "fear");
  assert.equal(replacement?.metadata.pacingPressure, "high");
  assert.equal(replacement?.triggers.includes("rival_attention"), true);
  assert.equal(replacement?.routeGates.includes("distance_repair_gate"), true);
  assert.equal(replacement?.compatibleWounds.includes("replacement_wound"), true);
});

test("adapts fear seeds into standardized vocabulary seeds", () => {
  assert.equal(FEAR_VOCABULARY_STANDARD_SEEDS.length, FEAR_VOCABULARY_SEEDS.length);

  const standard = FEAR_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "fear_of_replacement",
  );
  assert.ok(standard);
  assert.equal(standard.label, "Fear of replacement");
  assert.match(standard.description, /Core belief: People eventually leave/);
  assert.equal(standard.tags.includes("fear"), true);
  assert.equal(standard.tags.includes("attachment"), true);
  assert.equal(standard.relatedSeeds.includes("rival_attention"), true);
  assert.equal(standard.metadata.conflictPotential, 8);
});

test("bridges generated fear vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById("fear-vocabulary:fear_of_replacement");

  assert.ok(node);
  assert.equal(node.label, "Fear of replacement");
  assert.equal(node.category, "fears");
  assert.equal(node.parents.includes("attachment_wound"), true);
  assert.equal(
    node.sourceRegistryKeys?.includes("fear-vocabulary:fear_of_replacement"),
    true,
  );
});

function assertFearSeedShape(seed: FearSeed | undefined) {
  assert.ok(seed);
  assert.equal(seed.seed.length > 0, true);
  assert.equal(seed.label.length > 0, true);
  assert.equal(seed.description.length > 0, true);
  assert.equal(seed.coreBelief.length > 0, true);
  assert.equal(seed.hiddenNeed.length > 0, true);
  assert.equal(seed.perceivedThreat.length > 0, true);
  assert.equal(seed.triggers.length > 0, true);
  assert.equal(seed.earlyWarnings.length > 0, true);
  assert.equal(seed.escalationPattern.length > 0, true);
  assert.equal(seed.defenseMechanisms.length > 0, true);
  assert.equal(seed.copingBehaviors.length > 0, true);
  assert.equal(seed.avoidancePatterns.length > 0, true);
  assert.equal(seed.attachmentEffects.length > 0, true);
  assert.equal(seed.intimacyEffects.length > 0, true);
  assert.equal(seed.conflictEffects.length > 0, true);
  assert.equal(seed.misreadSignals.length > 0, true);
  assert.equal(seed.reassuranceNeeds.length > 0, true);
  assert.equal(seed.repairMethods.length > 0, true);
  assert.equal(seed.healingNeeds.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.compatibleWounds.length > 0, true);
  assert.equal(seed.metadata.category, "fear");
}
