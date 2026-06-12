import assert from "node:assert/strict";
import test from "node:test";

import {
  ROUTE_GATE_SEEDS,
  ROUTE_GATE_VOCABULARY_STANDARD_SEEDS,
  findRouteGateSeedBySeed,
  getRouteGateSeedsByCategory,
  getRouteGateSeedsByType,
  routeGateCategories,
  routeGateExpansionLogic,
  routeGatePresets,
  routeGateSemanticChain,
} from "../../data/routeGateVocabularyPresets";
import {
  expectSemanticRegistryToPassQc,
  type SemanticSeedNode,
} from "../../data/semanticExpansionQc";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RouteGateSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_ROUTE_GATE_SEED_KEYS = [
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
  "gateType",
  "unlocksRoutePhases",
  "requiredBefore",
  "blockedBy",
  "activatedByWounds",
  "activatedByFears",
  "fulfillsDesires",
  "satisfiesHiddenNeeds",
  "likelyTriggers",
  "likelyResponses",
  "compatibleRepairBeats",
  "compatibleGrowthArcs",
  "successSignals",
  "failureSignals",
  "milestoneMemories",
  "metadata",
].sort();

test("generates route gate seeds across stable categories", () => {
  assert.equal(routeGatePresets.length, 30);
  assert.equal(ROUTE_GATE_SEEDS.length, 30);
  assert.equal(new Set(ROUTE_GATE_SEEDS.map((seed) => seed.seed)).size, 30);
  assert.deepEqual(Object.keys(routeGateCategories), [
    "opening",
    "trust",
    "boundary",
    "reassurance",
    "vulnerability",
    "conflict",
    "rupture",
    "repair",
    "choice",
    "confession",
    "commitment",
    "integration",
    "payoff",
  ]);
  assert.equal(getRouteGateSeedsByCategory("vulnerability").length, 7);
  assert.equal(getRouteGateSeedsByCategory("repair").length, 4);
  assert.equal(getRouteGateSeedsByType("choice").length, 2);
  assert.equal(getRouteGateSeedsByType("payoff").length, 1);
});

test("keeps first reassurance gate close to the supplied route-gate template", () => {
  const reassurance = findRouteGateSeedBySeed("first_reassurance_gate");

  assertRouteGateSeedShape(reassurance);
  assert.equal(reassurance?.label, "First Reassurance Gate");
  assert.equal(reassurance?.gateType, "reassurance");
  assert.match(reassurance?.description ?? "", /clear emotional reassurance/);
  assert.equal(reassurance?.dialoguePatterns.includes("I am here."), true);
  assert.equal(reassurance?.activatedByWounds.includes("abandonment_wound"), true);
  assert.equal(reassurance?.activatedByFears.includes("fear_of_abandonment"), true);
  assert.equal(reassurance?.fulfillsDesires.includes("desire_for_reliable_love"), true);
  assert.equal(reassurance?.satisfiesHiddenNeeds.includes("need_for_reassurance"), true);
  assert.equal(reassurance?.likelyTriggers.includes("unanswered_message_trigger"), true);
  assert.equal(reassurance?.likelyResponses.includes("panic_spiral_response"), true);
  assert.equal(reassurance?.compatibleRepairBeats.includes("i_am_not_leaving_beat"), true);
  assert.equal(reassurance?.compatibleGrowthArcs.includes("learning_secure_attachment"), true);
  assert.equal(reassurance?.metadata.category, "route_gate");
  assert.equal(reassurance?.metadata.importance, "major");
  assert.equal(reassurance?.metadata.healingValue, 10);
});

test("tracks route gate semantic chain and expansion routes", () => {
  assert.deepEqual(routeGateSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Hidden Need",
    "Trigger",
    "Response",
    "Relationship Dynamic",
    "Romance Trope",
    "Route Phase",
    "Conflict Beat",
    "Rupture Type",
    "Consequence",
    "Repair Need",
    "Repair Style",
    "Repair Beat",
    "Route Gate",
    "Milestone Memory",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
  ]);
  assert.equal(
    routeGateExpansionLogic.route_phase_to_gates
      .confession_or_escalation.includes("first_public_choice_gate"),
    true,
  );
  assert.equal(
    routeGateExpansionLogic.wound_to_route_gate
      .control_wound.includes("commitment_choice_gate"),
    true,
  );
  assert.equal(
    routeGateExpansionLogic.repair_beat_to_route_gate
      .promise_kept_beat.includes("trust_rebuilt_gate"),
    true,
  );
});

test("keeps preset labels and route gate expansion references aligned", () => {
  const generatedLabels = new Set(ROUTE_GATE_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(ROUTE_GATE_SEEDS.map((seed) => seed.seed));
  const expansionTargets = [
    ...Object.values(routeGateExpansionLogic.route_phase_to_gates).flat(),
    ...Object.values(routeGateExpansionLogic.wound_to_route_gate).flat(),
    ...Object.values(routeGateExpansionLogic.repair_beat_to_route_gate).flat(),
  ];
  const categorizedTargets = Object.values(routeGateCategories).flat();

  for (const preset of routeGatePresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of expansionTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(categorizedTargets.length, ROUTE_GATE_SEEDS.length);
  assert.equal(new Set(categorizedTargets).size, ROUTE_GATE_SEEDS.length);
});

test("adapts route gates into standardized vocabulary seeds", () => {
  assert.equal(
    ROUTE_GATE_VOCABULARY_STANDARD_SEEDS.length,
    ROUTE_GATE_SEEDS.length,
  );

  const standard = ROUTE_GATE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "first_reassurance_gate",
  );

  assert.ok(standard);
  assert.equal(standard.label, "First Reassurance Gate");
  assert.match(standard.description, /Gate type: reassurance/);
  assert.equal(standard.tags.includes("route_gate"), true);
  assert.equal(standard.tags.includes("importance:major"), true);
  assert.equal(standard.relatedSeeds.includes("need_for_reassurance"), true);
  assert.equal(standard.relatedSeeds.includes("panic_spiral_response"), true);
  assert.equal(standard.scenarioHooks.includes("unanswered_message_trigger"), true);
  assert.equal(standard.metadata.rarity, "uncommon");
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 7);
});

test("route gate standardized seeds pass semantic expansion QC without errors", () => {
  const registry = ROUTE_GATE_VOCABULARY_STANDARD_SEEDS.map(
    (seed): SemanticSeedNode => ({
      seed: seed.seed,
      label: seed.label,
      category: "route_gate",
      relatedSeeds: seed.relatedSeeds,
      oppositeSeeds: seed.oppositeSeeds,
      commonTriggers: seed.scenarioHooks,
      growthArcs: seed.romanceHooks,
      metadata: {
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  );
  const issues = expectSemanticRegistryToPassQc(registry);
  const duplicateWarnings = issues.filter((issue) =>
    /Duplicate reference/.test(issue.message),
  );

  assert.deepEqual(duplicateWarnings, []);
});

test("bridges route gates into the semantic relationship gate graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "route-gate-vocabulary:first_reassurance_gate",
  );

  assert.equal(node?.label, "First Reassurance Gate");
  assert.equal(node?.category, "relationship_gates");
  assert.equal(node?.sourceRegistryKeys?.[0], "route-gate-vocabulary:first_reassurance_gate");
});

function assertRouteGateSeedShape(seed: RouteGateSeed | undefined): asserts seed is RouteGateSeed {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_ROUTE_GATE_SEED_KEYS);
}
