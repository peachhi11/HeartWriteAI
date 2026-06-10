import assert from "node:assert/strict";
import test from "node:test";

import {
  GROWTH_ARC_SEEDS,
  GROWTH_ARC_VOCABULARY_STANDARD_SEEDS,
  findGrowthArcSeedBySeed,
  getGrowthArcSeedsByCategory,
  getGrowthArcSeedsByType,
  growthArcCategories,
  growthArcExpansionLogic,
  growthArcPresets,
  growthArcSemanticChain,
} from "../../data/growthArcVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { GrowthArcSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_GROWTH_ARC_SEED_KEYS = [
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
  "arcType",
  "startingWounds",
  "startingFears",
  "coreDesires",
  "commonTriggers",
  "oldResponses",
  "newResponses",
  "requiredRepairBeats",
  "milestoneMemories",
  "routeGates",
  "regressionRisks",
  "healthyOutcome",
  "relationshipEffects",
  "metadata",
].sort();

test("generates growth arc seeds across stable growth categories", () => {
  assert.equal(growthArcPresets.length, 25);
  assert.equal(GROWTH_ARC_SEEDS.length, 25);
  assert.equal(new Set(GROWTH_ARC_SEEDS.map((seed) => seed.seed)).size, 25);
  assert.deepEqual(Object.keys(growthArcCategories), [
    "trust",
    "attachment",
    "self_worth",
    "vulnerability",
    "care",
    "rest",
    "belonging",
    "boundaries",
    "autonomy",
    "repair",
    "forgiveness",
    "love",
  ]);
  assert.equal(getGrowthArcSeedsByCategory("trust").length, 2);
  assert.equal(getGrowthArcSeedsByCategory("care").length, 3);
  assert.equal(getGrowthArcSeedsByType("attachment").length, 3);
  assert.equal(getGrowthArcSeedsByType("love").length, 2);
});

test("keeps learning to trust close to the supplied growth arc template", () => {
  const trust = findGrowthArcSeedBySeed("learning_to_trust");

  assertGrowthArcSeedShape(trust);
  assert.equal(trust?.label, "Learning to Trust");
  assert.equal(trust?.arcType, "trust");
  assert.match(trust?.description ?? "", /trust can be earned/);
  assert.equal(trust?.startingWounds.includes("betrayal_wound"), true);
  assert.equal(trust?.startingFears.includes("fear_of_betrayal"), true);
  assert.equal(trust?.coreDesires.includes("desire_for_reliable_love"), true);
  assert.equal(trust?.oldResponses.includes("emotional_lockdown_response"), true);
  assert.equal(trust?.newResponses.includes("shares_small_vulnerability"), true);
  assert.equal(trust?.requiredRepairBeats.includes("promise_kept_beat"), true);
  assert.equal(trust?.routeGates.includes("earned_trust_gate"), true);
  assert.equal(trust?.metadata.category, "growth_arc");
  assert.equal(trust?.metadata.intensity, "transformational");
  assert.equal(trust?.metadata.healingValue, 10);
  assert.equal(trust?.metadata.romanceValue, 10);
});

test("tracks wound, consequence, and repair beat expansion into growth arcs", () => {
  assert.deepEqual(growthArcSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Conflict Style",
    "Conflict Beat",
    "Rupture Type",
    "Consequence",
    "Repair Style",
    "Repair Beat",
    "Growth Arc",
    "Milestone Memory",
    "Relationship Identity",
  ]);
  assert.equal(
    growthArcExpansionLogic.wound_to_growth_arc.abandonment_wound.includes(
      "learning_secure_attachment",
    ),
    true,
  );
  assert.equal(
    growthArcExpansionLogic.consequence_to_growth_arc.boundary_hardening_consequence.includes(
      "learning_autonomy",
    ),
    true,
  );
  assert.equal(
    growthArcExpansionLogic.repair_beat_to_growth_arc.promise_kept_beat.includes(
      "learning_to_trust",
    ),
    true,
  );
});

test("adapts growth arcs into standardized vocabulary seeds", () => {
  assert.equal(
    GROWTH_ARC_VOCABULARY_STANDARD_SEEDS.length,
    GROWTH_ARC_SEEDS.length,
  );

  const standard = GROWTH_ARC_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "learning_to_trust",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Learning to Trust");
  assert.match(standard.description, /Growth arc type: trust/);
  assert.equal(standard.tags.includes("growth_arc"), true);
  assert.equal(standard.tags.includes("trust"), true);
  assert.equal(standard.relatedSeeds.includes("betrayal_wound"), true);
  assert.equal(standard.scenarioHooks.includes("first_kept_promise_memory"), true);
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 8);
});

test("bridges growth arc vocabulary into the semantic graph as long goals", () => {
  const node = findSemanticSeedGraphNodeById(
    "growth-arc-vocabulary:learning_to_trust",
  );

  assert.ok(node);
  assert.equal(node.label, "Learning to Trust");
  assert.equal(node.category, "goals_long");
  assert.equal(node.tags.includes("growth-arc-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "growth-arc-vocabulary:learning_to_trust",
  ), true);
});

function assertGrowthArcSeedShape(seed: GrowthArcSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_GROWTH_ARC_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "healingValue",
    "intensity",
    "pacingPressure",
    "romanceValue",
  ]);
  assert.equal(seed.startingWounds.length > 0, true);
  assert.equal(seed.startingFears.length > 0, true);
  assert.equal(seed.coreDesires.length > 0, true);
  assert.equal(seed.commonTriggers.length > 0, true);
  assert.equal(seed.oldResponses.length > 0, true);
  assert.equal(seed.newResponses.length > 0, true);
  assert.equal(seed.requiredRepairBeats.length > 0, true);
  assert.equal(seed.milestoneMemories.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.regressionRisks.length > 0, true);
  assert.equal(seed.healthyOutcome.length > 0, true);
  assert.equal(seed.relationshipEffects.length > 0, true);
}
