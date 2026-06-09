import assert from "node:assert/strict";
import test from "node:test";

import {
  DESIRE_SEMANTIC_GRAPH_DETAILS_BY_SEED,
  DESIRE_TO_BE_CHOSEN,
  desireCategories,
  DESIRE_VOCABULARY_SEEDS,
  DESIRE_VOCABULARY_STANDARD_SEEDS,
  findDesireVocabularySeedBySeed,
} from "../../data/desireVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { DesireSeed } from "../../data/vocabularySeedTypes";

test("loads desire to be chosen as a lean creator-facing desire seed", () => {
  assert.equal(DESIRE_VOCABULARY_SEEDS.length, 51);
  assert.equal(DESIRE_VOCABULARY_SEEDS.includes(DESIRE_TO_BE_CHOSEN), true);

  const desire = findDesireVocabularySeedBySeed("desire_to_be_chosen");
  assertDesireSeedShape(desire);

  assert.equal(desire?.label, "Desire to Be Chosen");
  assert.equal(desire?.metadata.category, "attachment");
  assert.equal(desire?.metadata.intensity, "core");
  assert.equal(desire?.metadata.pacingPressure, "high");
  assert.equal(desire?.tags.includes("desire_to_be_chosen"), true);
  assert.equal(desireCategories.attachment.includes("Desire to Be Chosen"), true);
  assert.equal(
    desireCategories.obsessive.includes("Desire for Emotional Singularity"),
    true,
  );
});

test("adapts desire seeds into standardized vocabulary seeds", () => {
  assert.equal(DESIRE_VOCABULARY_STANDARD_SEEDS.length, DESIRE_VOCABULARY_SEEDS.length);

  const standard = DESIRE_VOCABULARY_STANDARD_SEEDS[0];
  assert.ok(standard);
  assert.equal(standard.seed, "desire_to_be_chosen");
  assert.equal(standard.label, "Desire to Be Chosen");
  assert.match(standard.description, /Internal meaning:/);
  assert.match(standard.description, /Emotional meaning:/);
  assert.equal(standard.tags.includes("desire"), true);
  assert.equal(standard.tags.includes("attachment"), true);
  assert.equal(standard.relatedSeeds.includes("abandonment_wound"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_replacement"), true);
  assert.equal(standard.scenarioHooks.includes("desire_to_be_chosen_gate"), true);
  assert.equal(standard.metadata.romanceValue, 10);
});

test("keeps rich desire psychology in the internal semantic graph details", () => {
  const graph = DESIRE_SEMANTIC_GRAPH_DETAILS_BY_SEED.desire_to_be_chosen;

  assert.ok(graph);
  assert.match(graph.internalMeaning, /chosen/);
  assert.match(graph.emotionalMeaning, /consistent presence/);
  assert.equal(graph.fulfillmentNeeds.includes("clear choice"), true);
  assert.equal(graph.compatibleWounds.includes("abandonment_wound"), true);
  assert.equal(graph.compatibleFears.includes("fear_of_replacement"), true);
  assert.equal(graph.routeGates.includes("desire_to_be_chosen_gate"), true);
  assert.equal(graph.routeGates.includes("attachment_desire_route"), true);
});

test("bridges desire vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "desire-vocabulary:desire_to_be_chosen",
  );

  assert.ok(node);
  assert.equal(node.label, "Desire to Be Chosen");
  assert.equal(node.category, "desires");
  assert.equal(node.tags.includes("desire"), true);
  assert.equal(
    node.sourceRegistryKeys?.includes("desire-vocabulary:desire_to_be_chosen"),
    true,
  );
});

function assertDesireSeedShape(seed: DesireSeed | undefined) {
  assert.ok(seed);
  assert.equal(seed.seed.length > 0, true);
  assert.equal(seed.label.length > 0, true);
  assert.equal(seed.description.length > 0, true);
  assert.equal(seed.examples.length > 0, true);
  assert.equal(seed.tags.length > 0, true);
  assert.equal(seed.relatedSeeds.length > 0, true);
  assert.equal(seed.romanceHooks.length > 0, true);
  assert.equal(seed.scenarioHooks.length > 0, true);
  assert.equal(seed.dialoguePatterns.length > 0, true);
  assert.equal("coreLonging" in seed, false);
  assert.equal("routeGates" in seed, false);
}
