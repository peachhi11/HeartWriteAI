import assert from "node:assert/strict";
import test from "node:test";

import {
  CONFLICT_STYLE_SEEDS,
  CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS,
  conflictStyleCategories,
  conflictStyleExpansionLogic,
  conflictStylePresets,
  conflictStyleSemanticChain,
  findConflictStyleSeedBySeed,
  getConflictStyleSeedsByType,
} from "../../data/conflictStyleVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { ConflictStyleSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_CONFLICT_STYLE_SEED_KEYS = [
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
  "conflictType",
  "emotionalCore",
  "hiddenFear",
  "hiddenNeed",
  "commonTriggers",
  "stressResponses",
  "escalationPattern",
  "attachmentEffects",
  "intimacyEffects",
  "ruptureRisks",
  "likelyRepairStyles",
  "incompatibleRepairStyles",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "associatedResponses",
  "healthyVersion",
  "unhealthyVersion",
  "growthArcs",
  "routeGates",
  "metadata",
].sort();

test("generates conflict style seeds across stable categories", () => {
  assert.equal(conflictStylePresets.length, 20);
  assert.equal(CONFLICT_STYLE_SEEDS.length, 22);
  assert.equal(new Set(CONFLICT_STYLE_SEEDS.map((seed) => seed.seed)).size, 22);
  assert.deepEqual(Object.keys(conflictStyleCategories), [
    "pursuer",
    "withdrawer",
    "explosive",
    "appeasing",
    "intellectual",
    "deflective",
    "dominance",
    "passive",
    "avoidant",
    "repair_oriented",
  ]);
  assert.equal(getConflictStyleSeedsByType("pursuer").length, 3);
  assert.equal(getConflictStyleSeedsByType("repair_oriented").length, 2);
  assert.equal(getConflictStyleSeedsByType("passive").length, 1);
});

test("keeps pursuer conflict style close to the supplied semantic template", () => {
  const pursuer = findConflictStyleSeedBySeed("pursuer_conflict_style");

  assertConflictStyleSeedShape(pursuer);
  assert.equal(pursuer?.label, "Pursuer Conflict Style");
  assert.equal(pursuer?.conflictType, "pursuer");
  assert.equal(
    pursuer?.description,
    "Responds to conflict by moving closer, seeking immediate reassurance, clarification, contact, or resolution.",
  );
  assert.equal(
    pursuer?.emotionalCore,
    "Conflict feels like abandonment unless connection is restored quickly.",
  );
  assert.equal(
    pursuer?.hiddenFear,
    "If they leave the conversation, they may leave the relationship.",
  );
  assert.equal(
    pursuer?.hiddenNeed,
    "Reassurance that conflict does not erase love.",
  );
  assert.equal(pursuer?.commonTriggers.includes("partner_needing_space"), true);
  assert.equal(pursuer?.stressResponses.includes("panic_spiral_response"), true);
  assert.equal(pursuer?.escalationPattern.includes("partner_feels_pressured"), true);
  assert.equal(
    pursuer?.likelyRepairStyles.includes("verbal_reassurance_repair"),
    true,
  );
  assert.equal(
    pursuer?.incompatibleRepairStyles.includes(
      "space_based_repair_without_return_promise",
    ),
    true,
  );
  assert.equal(pursuer?.growthArcs.includes("learns_space_is_not_abandonment"), true);
  assert.equal(pursuer?.metadata.category, "conflict_style");
  assert.equal(pursuer?.metadata.intensity, "high");
  assert.equal(pursuer?.metadata.ruptureRisk, 8);
  assert.equal(pursuer?.metadata.healingPotential, 10);
});

test("tracks wound, fear, response, and repair expansion routes", () => {
  assert.deepEqual(conflictStyleSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Conflict Style",
    "Escalation Pattern",
    "Rupture Type",
    "Repair Style",
    "Growth Arc",
  ]);
  assert.deepEqual(
    conflictStyleExpansionLogic.wound_to_conflict_style.abandonment_wound,
    [
      "pursuer_conflict_style",
      "fearful_push_pull_conflict_style",
      "over_apologizing_conflict_style",
    ],
  );
  assert.equal(
    conflictStyleExpansionLogic.fear_to_conflict_style.fear_of_vulnerability.includes(
      "humor_deflection_conflict_style",
    ),
    true,
  );
  assert.equal(
    conflictStyleExpansionLogic.response_to_conflict_style.fawn_response.includes(
      "appeasing_conflict_style",
    ),
    true,
  );
  assert.equal(
    conflictStyleExpansionLogic.conflict_style_to_repair_style
      .pursuer_conflict_style.includes("return_and_stay_repair"),
    true,
  );
});

test("adapts conflict styles into standardized vocabulary seeds", () => {
  assert.equal(
    CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS.length,
    CONFLICT_STYLE_SEEDS.length,
  );

  const standard = CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "pursuer_conflict_style",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Pursuer Conflict Style");
  assert.match(standard.description, /Hidden fear:/);
  assert.equal(standard.tags.includes("conflict_style"), true);
  assert.equal(standard.tags.includes("pursuer"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.scenarioHooks.includes("secure_conflict_gate"), true);
  assert.equal(standard.metadata.conflictPotential, 8);
});

test("bridges conflict style vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "conflict-style-vocabulary:pursuer_conflict_style",
  );

  assert.ok(node);
  assert.equal(node.label, "Pursuer Conflict Style");
  assert.equal(node.category, "conflict_styles");
  assert.equal(node.tags.includes("conflict-style-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "conflict-style-vocabulary:pursuer_conflict_style",
  ), true);
});

function assertConflictStyleSeedShape(seed: ConflictStyleSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_CONFLICT_STYLE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "healingPotential",
    "intensity",
    "repairDifficulty",
    "romanceValue",
    "ruptureRisk",
  ]);
  assert.equal(seed.emotionalCore.length > 0, true);
  assert.equal(seed.hiddenFear.length > 0, true);
  assert.equal(seed.hiddenNeed.length > 0, true);
  assert.equal(seed.commonTriggers.length > 0, true);
  assert.equal(seed.stressResponses.length > 0, true);
  assert.equal(seed.escalationPattern.length > 0, true);
  assert.equal(seed.attachmentEffects.length > 0, true);
  assert.equal(seed.intimacyEffects.length > 0, true);
  assert.equal(seed.ruptureRisks.length > 0, true);
  assert.equal(seed.likelyRepairStyles.length > 0, true);
  assert.equal(seed.incompatibleRepairStyles.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.associatedResponses.length > 0, true);
  assert.equal(seed.healthyVersion.length > 0, true);
  assert.equal(seed.unhealthyVersion.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
}
