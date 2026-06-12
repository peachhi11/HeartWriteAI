import assert from "node:assert/strict";
import test from "node:test";

import {
  REPAIR_NEED_SEEDS,
  REPAIR_NEED_VOCABULARY_STANDARD_SEEDS,
  findRepairNeedSeedBySeed,
  getRepairNeedSeedsByCategory,
  getRepairNeedSeedsByType,
  repairNeedCategories,
  repairNeedExpansionLogic,
  repairNeedPresets,
  repairNeedsSemanticChain,
} from "../../data/repairNeedVocabularyPresets";
import {
  expectSemanticRegistryToPassQc,
  type SemanticSeedNode,
} from "../../data/semanticExpansionQc";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RepairNeedSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_REPAIR_NEED_SEED_KEYS = [
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
  "needType",
  "repairsConsequences",
  "repairsRuptures",
  "activatedByWounds",
  "activatedByFears",
  "frustratedDesires",
  "compatibleRepairStyles",
  "compatibleRepairBeats",
  "incompatibleRepairs",
  "requiredConditions",
  "fulfillmentSignals",
  "failureModes",
  "growthArcs",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates repair need seeds across stable categories", () => {
  assert.equal(repairNeedPresets.length, 20);
  assert.equal(REPAIR_NEED_SEEDS.length, 20);
  assert.equal(new Set(REPAIR_NEED_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.deepEqual(Object.keys(repairNeedCategories), [
    "reassurance",
    "accountability",
    "behavior_change",
    "truth",
    "validation",
    "presence",
    "return",
    "consistency",
    "boundary",
    "choice",
    "dignity",
    "loyalty",
    "comfort",
    "space",
    "time",
    "action",
    "vulnerability",
    "recommitment",
  ]);
  assert.equal(getRepairNeedSeedsByCategory("accountability").length, 2);
  assert.equal(getRepairNeedSeedsByCategory("truth").length, 2);
  assert.equal(getRepairNeedSeedsByType("reassurance").length, 1);
  assert.equal(getRepairNeedSeedsByType("action").length, 1);
});

test("keeps need for accountability close to the supplied repair-need template", () => {
  const accountability = findRepairNeedSeedBySeed("need_for_accountability");

  assertRepairNeedSeedShape(accountability);
  assert.equal(accountability?.label, "Need for Accountability");
  assert.equal(accountability?.needType, "accountability");
  assert.match(accountability?.description ?? "", /clearly own the harm/);
  assert.equal(
    accountability?.dialoguePatterns.includes(
      "An apology is not the same as accountability.",
    ),
    true,
  );
  assert.equal(
    accountability?.repairsConsequences.includes("trust_damage_consequence"),
    true,
  );
  assert.equal(accountability?.repairsRuptures.includes("betrayal_rupture"), true);
  assert.equal(accountability?.activatedByWounds.includes("betrayal_wound"), true);
  assert.equal(accountability?.activatedByFears.includes("fear_of_betrayal"), true);
  assert.equal(
    accountability?.frustratedDesires.includes("desire_for_truth"),
    true,
  );
  assert.equal(
    accountability?.compatibleRepairStyles.includes("accountability_repair"),
    true,
  );
  assert.equal(
    accountability?.compatibleRepairBeats.includes("accountability_beat"),
    true,
  );
  assert.equal(accountability?.requiredConditions.includes("no_defensiveness"), true);
  assert.equal(accountability?.failureModes.includes("accountability_without_change"), true);
  assert.equal(accountability?.metadata.category, "repair_need");
  assert.equal(accountability?.metadata.urgency, "high");
  assert.equal(accountability?.metadata.trustRepairValue, 10);
});

test("tracks the repair needs semantic chain and expansion routes", () => {
  assert.deepEqual(repairNeedsSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Hidden Need",
    "Trigger",
    "Response",
    "Conflict Beat",
    "Rupture Type",
    "Consequence",
    "Repair Need",
    "Repair Style",
    "Repair Beat",
    "Growth Arc",
    "Relationship Identity",
  ]);
  assert.equal(
    repairNeedExpansionLogic.consequence_to_repair_need
      .trust_damage_consequence.includes("need_for_accountability"),
    true,
  );
  assert.equal(
    repairNeedExpansionLogic.rupture_to_repair_need
      .broken_promise_rupture.includes("need_for_proof_through_action"),
    true,
  );
  assert.equal(
    repairNeedExpansionLogic.repair_need_to_repair_style
      .need_for_dignity_restoration.includes("private_comfort_repair"),
    true,
  );
});

test("keeps preset labels and repair need expansion references aligned", () => {
  const generatedLabels = new Set(REPAIR_NEED_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(REPAIR_NEED_SEEDS.map((seed) => seed.seed));
  const repairNeedTargets = [
    ...Object.values(
      repairNeedExpansionLogic.consequence_to_repair_need,
    ).flat(),
    ...Object.values(
      repairNeedExpansionLogic.rupture_to_repair_need,
    ).flat(),
  ];
  const repairStyleTargets = Object.values(
    repairNeedExpansionLogic.repair_need_to_repair_style,
  ).flat();

  for (const preset of repairNeedPresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of repairNeedTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(repairStyleTargets.every((target) => target.length > 0), true);
  assert.equal(repairStyleTargets.includes("accountability_repair"), true);
});

test("adapts repair needs into standardized vocabulary seeds", () => {
  assert.equal(
    REPAIR_NEED_VOCABULARY_STANDARD_SEEDS.length,
    REPAIR_NEED_SEEDS.length,
  );

  const standard = REPAIR_NEED_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "need_for_accountability",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Need for Accountability");
  assert.match(standard.description, /Repair need type: accountability/);
  assert.equal(standard.tags.includes("repair_need"), true);
  assert.equal(standard.tags.includes("accountability"), true);
  assert.equal(standard.relatedSeeds.includes("trust_damage_consequence"), true);
  assert.equal(standard.relatedSeeds.includes("accountability_beat"), true);
  assert.equal(standard.scenarioHooks.includes("first_accountability_gate"), true);
  assert.equal(standard.metadata.romanceValue, 9);
  assert.equal(standard.metadata.conflictPotential, 2);
});

test("repair need standardized seeds pass semantic expansion QC without errors", () => {
  const registry = REPAIR_NEED_VOCABULARY_STANDARD_SEEDS.map(
    (seed): SemanticSeedNode => ({
      seed: seed.seed,
      label: seed.label,
      category: "repair_need",
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

  assert.equal(issues.every((issue) => issue.severity === "warning"), true);
});

test("bridges repair need vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "repair-need-vocabulary:need_for_accountability",
  );

  assert.ok(node);
  assert.equal(node.label, "Need for Accountability");
  assert.equal(node.category, "repair_needs");
  assert.equal(node.tags.includes("repair-need-vocabulary"), true);
  assert.equal(
    node.sourceRegistryKeys?.includes(
      "repair-need-vocabulary:need_for_accountability",
    ),
    true,
  );
});

function assertRepairNeedSeedShape(seed: RepairNeedSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_REPAIR_NEED_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "attachmentRepairValue",
    "category",
    "healingValue",
    "repairPower",
    "trustRepairValue",
    "urgency",
  ]);
  assert.equal(seed.repairsConsequences.length > 0, true);
  assert.equal(seed.repairsRuptures.length > 0, true);
  assert.equal(seed.activatedByWounds.length > 0, true);
  assert.equal(seed.activatedByFears.length > 0, true);
  assert.equal(seed.frustratedDesires.length > 0, true);
  assert.equal(seed.compatibleRepairStyles.length > 0, true);
  assert.equal(seed.compatibleRepairBeats.length > 0, true);
  assert.equal(seed.requiredConditions.length > 0, true);
}
