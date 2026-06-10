import assert from "node:assert/strict";
import test from "node:test";

import {
  RELATIONSHIP_DYNAMIC_SEEDS,
  RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS,
  abandonmentRelationshipDynamicChainExample,
  findRelationshipDynamicSeedBySeed,
  getRelationshipDynamicSeedsByCategory,
  getRelationshipDynamicSeedsByType,
  relationshipDynamicCategories,
  relationshipDynamicExpansionLogic,
  relationshipDynamicSeedPresets,
  relationshipDynamicSemanticChain,
} from "../../data/relationshipDynamicVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RelationshipDynamicSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_RELATIONSHIP_DYNAMIC_SEED_KEYS = [
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
  "dynamicType",
  "emotionalCore",
  "primaryNeeds",
  "primaryFears",
  "typicalTriggers",
  "commonResponses",
  "conflictPatterns",
  "repairPatterns",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "evolutionPath",
  "unhealthyVersion",
  "healthyVersion",
  "routeGates",
  "metadata",
].sort();

test("generates relationship dynamic seeds across stable categories", () => {
  assert.equal(relationshipDynamicSeedPresets.length, 21);
  assert.equal(RELATIONSHIP_DYNAMIC_SEEDS.length, 42);
  assert.equal(new Set(RELATIONSHIP_DYNAMIC_SEEDS.map((seed) => seed.seed)).size, 42);
  assert.deepEqual(Object.keys(relationshipDynamicCategories), [
    "attachment",
    "power",
    "personality",
    "caretaking",
    "protective",
    "healing",
    "conflict",
    "obsessive",
    "domestic",
  ]);
  assert.equal(getRelationshipDynamicSeedsByCategory("attachment").length, 6);
  assert.equal(getRelationshipDynamicSeedsByCategory("domestic").length, 4);
  assert.equal(getRelationshipDynamicSeedsByType("attachment").length, 5);
  assert.equal(getRelationshipDynamicSeedsByType("obsessive").length, 4);
});

test("keeps safe haven dynamic close to the supplied semantic template", () => {
  const safeHaven = findRelationshipDynamicSeedBySeed("safe_haven_dynamic");

  assertRelationshipDynamicSeedShape(safeHaven);
  assert.equal(safeHaven?.label, "Safe Haven Dynamic");
  assert.equal(safeHaven?.dynamicType, "attachment");
  assert.equal(
    safeHaven?.description,
    "A relationship where one or both people become a reliable source of emotional safety, comfort, and return.",
  );
  assert.equal(
    safeHaven?.emotionalCore,
    "You can come back here and still be loved.",
  );
  assert.deepEqual(safeHaven?.associatedWounds, [
    "abandonment_wound",
    "emotional_neglect_wound",
  ]);
  assert.equal(
    safeHaven?.associatedDesires.includes("desire_for_home"),
    true,
  );
  assert.equal(
    safeHaven?.conflictPatterns.includes("distance_feels_threatening"),
    true,
  );
  assert.equal(
    safeHaven?.repairPatterns.includes("verbal_reassurance_repair"),
    true,
  );
  assert.equal(
    safeHaven?.healthyVersion.includes("safe_vulnerability"),
    true,
  );
  assert.equal(
    safeHaven?.unhealthyVersion.includes("dependency_without_boundaries"),
    true,
  );
  assert.equal(safeHaven?.metadata.category, "relationship_dynamic");
  assert.equal(safeHaven?.metadata.healingPotential, 10);
});

test("tracks wound, fear, and desire expansion routes into dynamics", () => {
  assert.deepEqual(relationshipDynamicSemanticChain, [
    "wound",
    "fear",
    "desire",
    "trigger",
    "response",
    "attachment_style",
    "relationship_dynamic",
    "conflict_pattern",
    "repair_style",
    "relationship_identity",
    "growth_arc",
  ]);
  assert.deepEqual(abandonmentRelationshipDynamicChainExample, {
    wound: "abandonment_wound",
    fear: "fear_of_abandonment",
    desire: "desire_to_be_chosen",
    trigger: "delayed_reply_trigger",
    response: "reassurance_seeking_response",
    attachmentStyle: "anxious_attachment",
    relationshipDynamic: "protector_reassurance_dynamic",
    conflictPattern: "pursuer_withdrawer_dynamic",
    repairStyle: "verbal_reassurance_repair",
    relationshipIdentity: "safe_haven_relationship_identity",
    growthArc: "secure_attachment_growth_arc",
  });
  assert.deepEqual(relationshipDynamicExpansionLogic.wound_to_dynamic.abandonment_wound, [
    "safe_haven_dynamic",
    "reassurance_dynamic",
    "chosen_person_dynamic",
  ]);
  assert.equal(
    relationshipDynamicExpansionLogic.fear_to_dynamic.fear_of_vulnerability.includes(
      "safe_vulnerability_dynamic",
    ),
    true,
  );
  assert.equal(
    relationshipDynamicExpansionLogic.desire_to_dynamic.desire_for_devotion.includes(
      "devotional_dynamic",
    ),
    true,
  );
});

test("adapts relationship dynamics into standardized vocabulary seeds", () => {
  assert.equal(
    RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS.length,
    RELATIONSHIP_DYNAMIC_SEEDS.length,
  );

  const standard = RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "safe_haven_dynamic",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Safe Haven Dynamic");
  assert.match(standard.description, /Emotional core:/);
  assert.equal(standard.tags.includes("relationship_dynamic"), true);
  assert.equal(standard.tags.includes("attachment"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.scenarioHooks.includes("first_safe_return_gate"), true);
  assert.equal(standard.metadata.romanceValue, 9);
});

test("bridges relationship dynamic vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "relationship-dynamic-vocabulary:safe_haven_dynamic",
  );

  assert.ok(node);
  assert.equal(node.label, "Safe Haven Dynamic");
  assert.equal(node.category, "relationship_dynamics");
  assert.equal(node.tags.includes("relationship-dynamic-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "relationship-dynamic-vocabulary:safe_haven_dynamic",
  ), true);
});

function assertRelationshipDynamicSeedShape(
  seed: RelationshipDynamicSeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_RELATIONSHIP_DYNAMIC_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "chemistryValue",
    "conflictPotential",
    "healingPotential",
    "intensity",
  ]);
  assert.equal(seed.emotionalCore.length > 0, true);
  assert.equal(seed.primaryNeeds.length > 0, true);
  assert.equal(seed.primaryFears.length > 0, true);
  assert.equal(seed.typicalTriggers.length > 0, true);
  assert.equal(seed.commonResponses.length > 0, true);
  assert.equal(seed.conflictPatterns.length > 0, true);
  assert.equal(seed.repairPatterns.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.evolutionPath.length > 0, true);
  assert.equal(seed.unhealthyVersion.length > 0, true);
  assert.equal(seed.healthyVersion.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
}
