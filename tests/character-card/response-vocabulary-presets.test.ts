import assert from "node:assert/strict";
import test from "node:test";

import {
  RESPONSE_VOCABULARY_SEEDS,
  RESPONSE_VOCABULARY_STANDARD_SEEDS,
  abandonmentResponseChainExample,
  findResponseVocabularySeedBySeed,
  getResponseVocabularySeedsByCategory,
  getResponseVocabularySeedsByType,
  responseCategories,
  responseExpansionLogic,
  responseSeedPresets,
  responseSemanticChain,
} from "../../data/responseVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { ResponseSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_RESPONSE_SEED_KEYS = [
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
  "responseType",
  "coreImpulse",
  "hiddenFear",
  "hiddenNeed",
  "activators",
  "earlySignals",
  "escalationPattern",
  "outwardBehaviors",
  "internalExperience",
  "bodyLanguage",
  "attachmentEffects",
  "intimacyEffects",
  "conflictEffects",
  "misreadByOthersAs",
  "reassuranceNeeds",
  "repairMethods",
  "growthArcs",
  "routeGates",
  "compatibleWounds",
  "compatibleFears",
  "compatibleDesires",
  "metadata",
].sort();

test("generates response vocabulary seeds across stable response categories", () => {
  assert.equal(responseSeedPresets.length, 20);
  assert.equal(RESPONSE_VOCABULARY_SEEDS.length, 40);
  assert.equal(new Set(RESPONSE_VOCABULARY_SEEDS.map((seed) => seed.seed)).size, 40);
  assert.deepEqual(Object.keys(responseCategories), [
    "fight",
    "flight",
    "freeze",
    "fawn",
    "shutdown",
    "masking",
    "humor",
    "control",
    "attachment",
    "repair",
  ]);
  assert.equal(getResponseVocabularySeedsByCategory("fight").length, 4);
  assert.equal(getResponseVocabularySeedsByCategory("attachment").length, 4);
  assert.equal(getResponseVocabularySeedsByType("reassurance_seeking").length, 3);
  assert.equal(getResponseVocabularySeedsByType("repair").length, 3);
});

test("keeps response-specific story psychology fields rich and route-ready", () => {
  const reassurance = findResponseVocabularySeedBySeed("reassurance_seeking_response");
  const peoplePleasing = findResponseVocabularySeedBySeed("people_pleasing_response");
  const protectiveRage = findResponseVocabularySeedBySeed("protective_rage_response");

  assertResponseSeedShape(reassurance);
  assert.equal(reassurance?.label, "Reassurance Seeking Response");
  assert.equal(reassurance?.responseType, "reassurance_seeking");
  assert.equal(reassurance?.metadata.category, "response");
  assert.equal(reassurance?.metadata.pacingPressure, "high");
  assert.equal(reassurance?.compatibleWounds.includes("abandonment_wound"), true);
  assert.equal(reassurance?.compatibleFears.includes("fear_of_abandonment"), true);
  assert.equal(reassurance?.compatibleDesires.includes("desire_to_be_chosen"), true);
  assert.equal(
    reassurance?.growthArcs.includes("learns distance is not abandonment"),
    true,
  );

  assert.equal(peoplePleasing?.responseType, "fawn");
  assert.equal(
    peoplePleasing?.description,
    "Tries to stay loved by becoming agreeable, useful, and easy to accommodate.",
  );
  assert.equal(protectiveRage?.responseType, "protective");
  assert.equal(
    protectiveRage?.dialoguePatterns.includes(
      "Tell me what you need before I make this worse.",
    ),
    true,
  );
});

test("tracks wound, fear, and desire expansion routes into response seeds", () => {
  assert.deepEqual(responseSemanticChain, [
    "wound",
    "fear",
    "desire",
    "trigger",
    "response",
    "consequence",
    "repair",
    "growth",
  ]);
  assert.deepEqual(abandonmentResponseChainExample, {
    wound: "abandonment_wound",
    fear: "fear_of_abandonment",
    desire: "desire_to_be_chosen",
    trigger: "unanswered_message",
    response: "panic_spiral_response",
    consequence: "conflict_or_reassurance_scene",
    repair: "consistent_return_repair",
    growth: "learns_distance_is_not_abandonment",
  });
  assert.deepEqual(responseExpansionLogic.wound_to_response.abandonment_wound, [
    "reassurance_seeking_response",
    "cling_response",
    "preemptive_withdrawal_response",
  ]);
  assert.equal(
    responseExpansionLogic.fear_to_response.fear_of_vulnerability.includes(
      "humor_deflection_response",
    ),
    true,
  );
  assert.equal(
    responseExpansionLogic.desire_to_response.desire_to_be_chosen.includes(
      "priority_testing_response",
    ),
    true,
  );
});

test("adapts response seeds into standardized vocabulary seeds", () => {
  assert.equal(RESPONSE_VOCABULARY_STANDARD_SEEDS.length, RESPONSE_VOCABULARY_SEEDS.length);

  const standard = RESPONSE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "reassurance_seeking_response",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Reassurance Seeking Response");
  assert.match(standard.description, /Core impulse:/);
  assert.match(standard.description, /Hidden fear:/);
  assert.equal(standard.tags.includes("response"), true);
  assert.equal(standard.tags.includes("reassurance_seeking"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.scenarioHooks.includes("reassurance_seeking_response_gate"), true);
  assert.equal(standard.metadata.conflictPotential, 8);
});

test("bridges response vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "response-vocabulary:reassurance_seeking_response",
  );

  assert.ok(node);
  assert.equal(node.label, "Reassurance Seeking Response");
  assert.equal(node.category, "responses");
  assert.equal(node.tags.includes("response-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "response-vocabulary:reassurance_seeking_response",
  ), true);
});

function assertResponseSeedShape(seed: ResponseSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_RESPONSE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "conflictPotential",
    "healingValue",
    "intensity",
    "pacingPressure",
    "romanceValue",
  ]);
  assert.equal(seed.coreImpulse.length > 0, true);
  assert.equal(seed.hiddenFear.length > 0, true);
  assert.equal(seed.hiddenNeed.length > 0, true);
  assert.equal(seed.activators.length > 0, true);
  assert.equal(seed.earlySignals.length > 0, true);
  assert.equal(seed.escalationPattern.length > 0, true);
  assert.equal(seed.outwardBehaviors.length > 0, true);
  assert.equal(seed.internalExperience.length > 0, true);
  assert.equal(seed.bodyLanguage.length > 0, true);
  assert.equal(seed.attachmentEffects.length > 0, true);
  assert.equal(seed.intimacyEffects.length > 0, true);
  assert.equal(seed.conflictEffects.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.metadata.category, "response");
}
