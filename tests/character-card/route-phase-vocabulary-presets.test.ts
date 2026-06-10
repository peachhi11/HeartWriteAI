import assert from "node:assert/strict";
import test from "node:test";

import {
  ROUTE_PHASE_SEEDS,
  ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS,
  findRoutePhaseSeedBySeed,
  getRoutePhaseSeedsByCategory,
  getRoutePhaseSeedsByType,
  routePhaseCategories,
  routePhaseExpansionLogic,
  routePhasePresets,
  routePhaseSemanticChain,
} from "../../data/routePhaseVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RoutePhaseSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_ROUTE_PHASE_SEED_KEYS = [
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
  "phaseType",
  "emotionalFunction",
  "phaseQuestion",
  "readinessSignals",
  "blockingForces",
  "activatesWounds",
  "activatesFears",
  "activatesDesires",
  "likelyTriggers",
  "likelyResponses",
  "relationshipDynamics",
  "compatibleTropes",
  "conflictBeats",
  "repairBeats",
  "entryConditions",
  "exitConditions",
  "routeGates",
  "milestoneMemories",
  "healthyVersion",
  "unhealthyVersion",
  "growthArcs",
  "metadata",
].sort();

test("generates route phase seeds across the stable route categories", () => {
  assert.equal(routePhasePresets.length, 20);
  assert.equal(ROUTE_PHASE_SEEDS.length, 44);
  assert.equal(new Set(ROUTE_PHASE_SEEDS.map((seed) => seed.seed)).size, 44);
  assert.deepEqual(Object.keys(routePhaseCategories), [
    "opening",
    "attraction",
    "contact",
    "trust",
    "vulnerability",
    "reframing",
    "investment",
    "crisis",
    "repair",
    "confession",
    "integration",
  ]);
  assert.equal(getRoutePhaseSeedsByCategory("opening").length, 4);
  assert.equal(getRoutePhaseSeedsByCategory("integration").length, 4);
  assert.equal(getRoutePhaseSeedsByType("opening").length, 4);
  assert.equal(getRoutePhaseSeedsByType("vulnerability").length, 4);
});

test("keeps initial dynamic close to the supplied opening phase template", () => {
  const initial = findRoutePhaseSeedBySeed("initial_dynamic");

  assertRoutePhaseSeedShape(initial);
  assert.equal(initial?.label, "Initial Dynamic");
  assert.equal(initial?.phaseType, "opening");
  assert.equal(
    initial?.description,
    "The opening emotional arrangement between two characters before the romance route begins to actively move.",
  );
  assert.equal(
    initial?.emotionalFunction,
    "Establishes the starting rules, power balance, emotional distance, and first route pressure.",
  );
  assert.equal(
    initial?.phaseQuestion,
    "What is the bond before either person knows it is becoming a romance?",
  );
  assert.equal(initial?.activatesDesires.includes("desire_to_be_seen"), true);
  assert.equal(
    initial?.relationshipDynamics.includes("protector_protected_dynamic"),
    true,
  );
  assert.equal(initial?.compatibleTropes.includes("enemies_to_lovers"), true);
  assert.equal(initial?.routeGates.includes("initial_dynamic_gate"), true);
  assert.equal(initial?.metadata.category, "route_phase");
  assert.equal(initial?.metadata.order, 1);
  assert.equal(initial?.metadata.intensity, "low");
  assert.equal(initial?.metadata.chemistryValue, 5);
});

test("keeps vulnerability leak close to the supplied truth-slip phase template", () => {
  const vulnerability = findRoutePhaseSeedBySeed("vulnerability_leak");

  assertRoutePhaseSeedShape(vulnerability);
  assert.equal(vulnerability?.label, "Vulnerability Leak");
  assert.equal(vulnerability?.phaseType, "vulnerability");
  assert.equal(
    vulnerability?.emotionalFunction,
    "Lets the relationship witness a protected truth before full trust has stabilized.",
  );
  assert.equal(
    vulnerability?.likelyResponses.includes("truth_slip_response"),
    true,
  );
  assert.equal(
    vulnerability?.routeGates.includes("safe_to_be_seen_gate"),
    true,
  );
  assert.equal(vulnerability?.metadata.order, 5);
  assert.equal(vulnerability?.metadata.intensity, "high");
  assert.equal(vulnerability?.metadata.healingValue, 10);
});

test("tracks wound, fear, desire, and trope expansion into route phases", () => {
  assert.deepEqual(routePhaseSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Relationship Dynamic",
    "Romance Trope",
    "Route Phase",
    "Phase Gate",
    "Conflict Beat",
    "Repair Beat",
    "Milestone Memory",
    "Relationship Identity",
    "Growth Arc",
  ]);
  assert.equal(
    routePhaseExpansionLogic.wound_to_phase_pressure.betrayal_wound.includes(
      "repair_phase",
    ),
    true,
  );
  assert.equal(
    routePhaseExpansionLogic.fear_to_phase_blocker.fear_of_replacement.includes(
      "public_choice_phase",
    ),
    true,
  );
  assert.equal(
    routePhaseExpansionLogic.desire_to_phase_pull.desire_to_be_chosen.includes(
      "commitment_choice",
    ),
    true,
  );
  assert.equal(
    routePhaseExpansionLogic.trope_to_phase_pattern.enemies_to_lovers.includes(
      "enemy_to_person_phase",
    ),
    true,
  );
});

test("adapts route phases into standardized vocabulary seeds", () => {
  assert.equal(
    ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS.length,
    ROUTE_PHASE_SEEDS.length,
  );

  const standard = ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "initial_dynamic",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Initial Dynamic");
  assert.match(standard.description, /Emotional function:/);
  assert.equal(standard.tags.includes("route_phase"), true);
  assert.equal(standard.tags.includes("opening"), true);
  assert.equal(standard.relatedSeeds.includes("desire_to_be_seen"), true);
  assert.equal(standard.scenarioHooks.includes("first_impression_memory"), true);
  assert.equal(standard.metadata.romanceValue, 5);
  assert.equal(standard.metadata.conflictPotential, 3);
});

test("bridges route phase vocabulary into the semantic graph as routes", () => {
  const node = findSemanticSeedGraphNodeById(
    "route-phase-vocabulary:initial_dynamic",
  );

  assert.ok(node);
  assert.equal(node.label, "Initial Dynamic");
  assert.equal(node.category, "routes");
  assert.equal(node.tags.includes("route-phase-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "route-phase-vocabulary:initial_dynamic",
  ), true);
});

function assertRoutePhaseSeedShape(seed: RoutePhaseSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_ROUTE_PHASE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "burnPressure",
    "category",
    "chemistryValue",
    "comfortValue",
    "healingValue",
    "intensity",
    "order",
  ]);
  assert.equal(seed.emotionalFunction.length > 0, true);
  assert.equal(seed.phaseQuestion.length > 0, true);
  assert.equal(seed.readinessSignals.length > 0, true);
  assert.equal(seed.blockingForces.length > 0, true);
  assert.equal(seed.activatesWounds.length > 0, true);
  assert.equal(seed.activatesFears.length > 0, true);
  assert.equal(seed.activatesDesires.length > 0, true);
  assert.equal(seed.likelyTriggers.length > 0, true);
  assert.equal(seed.likelyResponses.length > 0, true);
  assert.equal(seed.relationshipDynamics.length > 0, true);
  assert.equal(seed.compatibleTropes.length > 0, true);
  assert.equal(seed.conflictBeats.length > 0, true);
  assert.equal(seed.repairBeats.length > 0, true);
  assert.equal(seed.entryConditions.length > 0, true);
  assert.equal(seed.exitConditions.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.milestoneMemories.length > 0, true);
  assert.equal(seed.healthyVersion.length > 0, true);
  assert.equal(seed.unhealthyVersion.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
}
