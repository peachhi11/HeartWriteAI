import assert from "node:assert/strict";
import test from "node:test";

import {
  RUPTURE_TYPE_SEEDS,
  RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS,
  findRuptureTypeSeedBySeed,
  getRuptureTypeSeedsByCategory,
  getRuptureTypeSeedsByType,
  ruptureTypeCategories,
  ruptureTypeExpansionLogic,
  ruptureTypePresets,
} from "../../data/ruptureTypeVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import type { RuptureTypeSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_RUPTURE_TYPE_SEED_KEYS = [
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
  "ruptureType",
  "emotionalDamage",
  "damagedTrustLayer",
  "activatesWounds",
  "activatesFears",
  "frustratesDesires",
  "commonTriggers",
  "commonResponses",
  "compatibleConflictBeats",
  "repairNeeds",
  "compatibleRepairStyles",
  "incompatibleRepairStyles",
  "consequencePatterns",
  "memoryEffects",
  "growthPotential",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates rupture type seeds across stable rupture categories", () => {
  assert.equal(ruptureTypePresets.length, 20);
  assert.equal(RUPTURE_TYPE_SEEDS.length, 20);
  assert.equal(new Set(RUPTURE_TYPE_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.equal(getRuptureTypeSeedsByCategory("betrayal").length, 2);
  assert.equal(getRuptureTypeSeedsByType("attachment").length, 2);
  assert.deepEqual(
    (Object.entries(ruptureTypeCategories) as Array<[string, readonly string[]]>)
      .filter(([, seedIds]) => seedIds.length === 0)
      .map(([category]) => category),
    [],
  );
});

test("keeps abandonment rupture close to the supplied template", () => {
  const rupture = findRuptureTypeSeedBySeed("abandonment_rupture");
  assertRuptureTypeSeedShape(rupture);

  assert.equal(rupture?.label, "Abandonment Rupture");
  assert.equal(rupture?.ruptureType, "abandonment");
  assert.equal(rupture?.metadata.category, "rupture_type");
  assert.equal(rupture?.metadata.attachmentDamage, 10);
  assert.equal(rupture?.damagedTrustLayer.includes("attachment_trust"), true);
  assert.equal(rupture?.activatesFears.includes("fear_of_being_forgotten"), true);
  assert.equal(rupture?.compatibleConflictBeats.includes("delayed_reply_spiral"), true);
  assert.equal(rupture?.incompatibleRepairStyles.includes("unexplained_space"), true);
});

test("uses emotional invalidation rupture as the canonical invalidation id", () => {
  assert.ok(findRuptureTypeSeedBySeed("emotional_invalidation_rupture"));
  assert.equal(findRuptureTypeSeedBySeed("invalidation_rupture"), undefined);
  assert.equal(
    ruptureTypeExpansionLogic.wound_to_rupture_type.emotional_neglect_wound.includes(
      "emotional_invalidation_rupture",
    ),
    true,
  );
});

test("tracks wound and conflict beat expansion into rupture types", () => {
  assert.equal(
    ruptureTypeExpansionLogic.wound_to_rupture_type.abandonment_wound.includes(
      "forced_separation_rupture",
    ),
    true,
  );
  assert.equal(
    ruptureTypeExpansionLogic.conflict_beat_to_rupture_type.boundary_crossed.includes(
      "safety_rupture",
    ),
    true,
  );
  assert.equal(
    ruptureTypeExpansionLogic.rupture_type_to_repair_style.betrayal_rupture.includes(
      "truth_and_accountability_repair",
    ),
    true,
  );
});

test("adapts rupture types into standardized vocabulary seeds and semantic gates", () => {
  assert.equal(
    RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS.length,
    RUPTURE_TYPE_SEEDS.length,
  );
  const standard = RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "abandonment_rupture",
  );
  const node = findSemanticSeedGraphNodeById(
    "rupture-type-vocabulary:abandonment_rupture",
  );

  assert.ok(standard);
  assert.match(standard.description, /Emotional damage:/);
  assert.equal(standard.tags.includes("rupture_type"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.scenarioHooks.includes("secure_return_gate"), true);
  assert.ok(node);
  assert.equal(node.category, "relationship_gates");
});

function assertRuptureTypeSeedShape(seed: RuptureTypeSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_RUPTURE_TYPE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "attachmentDamage",
    "category",
    "healingValue",
    "repairDifficulty",
    "severityBias",
    "trustDamage",
  ]);
}
