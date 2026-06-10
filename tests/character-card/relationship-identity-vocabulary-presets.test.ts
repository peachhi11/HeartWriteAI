import assert from "node:assert/strict";
import test from "node:test";

import {
  RELATIONSHIP_IDENTITY_SEEDS,
  RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS,
  findRelationshipIdentitySeedBySeed,
  getRelationshipIdentitySeedsByCategory,
  getRelationshipIdentitySeedsByType,
  relationshipIdentityCategories,
  relationshipIdentityExpansionLogic,
  relationshipIdentityPresets,
  relationshipIdentitySemanticChain,
} from "../../data/relationshipIdentityVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RelationshipIdentitySeed } from "../../data/vocabularySeedTypes";

const EXPECTED_RELATIONSHIP_IDENTITY_SEED_KEYS = [
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
  "identityType",
  "fulfillsDesires",
  "resolvesFears",
  "healsWounds",
  "compatibleDynamics",
  "compatibleTropes",
  "compatiblePayoffFantasies",
  "requiredGrowthArcs",
  "relationshipRules",
  "emotionalProofs",
  "dailyExpressions",
  "conflictRisks",
  "repairNeeds",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates relationship identity seeds across stable identity categories", () => {
  assert.equal(relationshipIdentityPresets.length, 20);
  assert.equal(RELATIONSHIP_IDENTITY_SEEDS.length, 20);
  assert.equal(new Set(RELATIONSHIP_IDENTITY_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.deepEqual(Object.keys(relationshipIdentityCategories), [
    "safety",
    "home",
    "belonging",
    "partnership",
    "devotion",
    "freedom",
    "healing",
    "trust",
    "second_chance",
    "domestic",
    "adventure",
    "power",
    "quiet_love",
    "public_choice",
    "earned_ending",
  ]);
  assert.equal(getRelationshipIdentitySeedsByCategory("safety").length, 2);
  assert.equal(getRelationshipIdentitySeedsByCategory("partnership").length, 3);
  assert.equal(getRelationshipIdentitySeedsByType("public_choice").length, 1);
  assert.equal(getRelationshipIdentitySeedsByType("quiet_love").length, 2);
});

test("keeps safe haven relationship close to the supplied identity template", () => {
  const safeHaven = findRelationshipIdentitySeedBySeed("safe_haven_relationship");

  assertRelationshipIdentitySeedShape(safeHaven);
  assert.equal(safeHaven?.label, "Safe Haven Relationship");
  assert.equal(safeHaven?.identityType, "safety");
  assert.match(safeHaven?.description ?? "", /conflict does not erase love/);
  assert.equal(safeHaven?.fulfillsDesires.includes("desire_for_reliable_love"), true);
  assert.equal(safeHaven?.resolvesFears.includes("fear_of_abandonment"), true);
  assert.equal(safeHaven?.healsWounds.includes("emotional_neglect_wound"), true);
  assert.equal(safeHaven?.compatibleDynamics.includes("safe_haven_dynamic"), true);
  assert.equal(safeHaven?.compatibleTropes.includes("hurt_comfort"), true);
  assert.equal(safeHaven?.compatiblePayoffFantasies.includes("someone_finally_stays"), true);
  assert.equal(safeHaven?.requiredGrowthArcs.includes("learning_secure_attachment"), true);
  assert.equal(safeHaven?.relationshipRules.includes("no_silent_punishment"), true);
  assert.equal(safeHaven?.emotionalProofs.includes("returns_after_conflict"), true);
  assert.equal(safeHaven?.dailyExpressions.includes("ordinary_reliability"), true);
  assert.equal(safeHaven?.routeGates.includes("safe_haven_identity_gate"), true);
  assert.equal(safeHaven?.metadata.category, "relationship_identity");
  assert.equal(safeHaven?.metadata.stabilityValue, 10);
  assert.equal(safeHaven?.metadata.endingStrength, "transformational");
});

test("tracks wound and payoff expansion routes into relationship identities", () => {
  assert.deepEqual(relationshipIdentitySemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Relationship Dynamic",
    "Romance Trope",
    "Route Phase",
    "Conflict Beat",
    "Repair Beat",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
    "Ending Flavor",
  ]);
  assert.equal(
    relationshipIdentityExpansionLogic.wound_to_identity.abandonment_wound.includes(
      "safe_haven_relationship",
    ),
    true,
  );
  assert.equal(
    relationshipIdentityExpansionLogic.wound_to_identity.control_wound.includes(
      "protective_but_free_relationship",
    ),
    true,
  );
  assert.equal(
    relationshipIdentityExpansionLogic.payoff_to_identity.trust_rebuilt_and_earned.includes(
      "trust_rebuilt_relationship",
    ),
    true,
  );
});

test("keeps preset labels and expansion references aligned with generated seeds", () => {
  const generatedLabels = new Set(RELATIONSHIP_IDENTITY_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(RELATIONSHIP_IDENTITY_SEEDS.map((seed) => seed.seed));
  const expansionTargets = Object.values(relationshipIdentityExpansionLogic)
    .flatMap((group) => Object.values(group).flat());

  for (const preset of relationshipIdentityPresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of expansionTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
});

test("adapts relationship identities into standardized vocabulary seeds", () => {
  assert.equal(
    RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS.length,
    RELATIONSHIP_IDENTITY_SEEDS.length,
  );

  const standard = RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "safe_haven_relationship",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Safe Haven Relationship");
  assert.match(standard.description, /Identity type: safety/);
  assert.equal(standard.tags.includes("relationship_identity"), true);
  assert.equal(standard.tags.includes("safety"), true);
  assert.equal(standard.relatedSeeds.includes("safe_haven_dynamic"), true);
  assert.equal(standard.scenarioHooks.includes("conflict_does_not_end_us_gate"), true);
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 4);
});

test("bridges relationship identity vocabulary into the semantic graph as relationship dynamics", () => {
  const node = findSemanticSeedGraphNodeById(
    "relationship-identity-vocabulary:safe_haven_relationship",
  );

  assert.ok(node);
  assert.equal(node.label, "Safe Haven Relationship");
  assert.equal(node.category, "relationship_dynamics");
  assert.equal(node.tags.includes("relationship-identity-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "relationship-identity-vocabulary:safe_haven_relationship",
  ), true);
});

function assertRelationshipIdentitySeedShape(
  seed: RelationshipIdentitySeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_RELATIONSHIP_IDENTITY_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "conflictPotential",
    "endingStrength",
    "healingValue",
    "romanceValue",
    "stabilityValue",
  ]);
  assert.equal(seed.fulfillsDesires.length > 0, true);
  assert.equal(seed.resolvesFears.length > 0, true);
  assert.equal(seed.healsWounds.length > 0, true);
  assert.equal(seed.compatibleDynamics.length > 0, true);
  assert.equal(seed.compatibleTropes.length > 0, true);
  assert.equal(seed.compatiblePayoffFantasies.length > 0, true);
  assert.equal(seed.requiredGrowthArcs.length > 0, true);
  assert.equal(seed.relationshipRules.length > 0, true);
  assert.equal(seed.emotionalProofs.length > 0, true);
  assert.equal(seed.dailyExpressions.length > 0, true);
  assert.equal(seed.conflictRisks.length > 0, true);
  assert.equal(seed.repairNeeds.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.milestoneMemories.length > 0, true);
}
