import assert from "node:assert/strict";
import test from "node:test";

import {
  REPAIR_STYLE_VOCABULARY_SEEDS,
  REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS,
  findRepairStyleVocabularySeedBySeed,
  getRepairStyleVocabularySeedsByCategory,
  getRepairStyleVocabularySeedsByType,
  repairExpansionLogic,
  repairStyleCategories,
  repairStylePresets,
} from "../../data/repairStyleVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RepairStyleSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_REPAIR_STYLE_SEED_KEYS = [
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
  "repairType",
  "repairsBestFor",
  "weakForRuptures",
  "coreRepairMessage",
  "emotionalNeedMet",
  "failureMode",
  "requiredConditions",
  "repairActions",
  "timingNeeds",
  "conflictEffects",
  "attachmentEffects",
  "intimacyEffects",
  "misreadByOthersAs",
  "compatibleWounds",
  "compatibleFears",
  "compatibleConflictStyles",
  "incompatibleDynamics",
  "routeGates",
  "growthArcs",
  "metadata",
].sort();

test("generates repair style vocabulary seeds across stable repair categories", () => {
  assert.equal(repairStylePresets.length, 203);
  assert.equal(REPAIR_STYLE_VOCABULARY_SEEDS.length, 203);
  assert.equal(
    new Set(REPAIR_STYLE_VOCABULARY_SEEDS.map((seed) => seed.seed)).size,
    203,
  );
  assert.deepEqual(Object.keys(repairStyleCategories), [
    "verbal",
    "accountability",
    "behavioral",
    "reassurance",
    "presence",
    "space_based",
    "physical_comfort",
    "acts_of_service",
    "ritual",
    "vulnerability",
    "collaborative",
    "devotional",
    "attachment",
    "shame",
    "betrayal",
    "identity",
    "romantic",
    "domestic",
    "protective",
    "healing",
    "meta",
  ]);
  assert.equal(getRepairStyleVocabularySeedsByCategory("verbal").length, 10);
  assert.equal(getRepairStyleVocabularySeedsByCategory("accountability").length, 11);
  assert.equal(getRepairStyleVocabularySeedsByCategory("behavioral").length, 8);
  assert.equal(getRepairStyleVocabularySeedsByCategory("acts_of_service").length, 1);
  assert.equal(getRepairStyleVocabularySeedsByType("verbal").length, 10);
  assert.equal(getRepairStyleVocabularySeedsByType("devotional").length, 10);
  assert.equal(getRepairStyleVocabularySeedsByType("healing").length, 13);
  assert.deepEqual(
    Object.entries(repairStyleCategories)
      .filter(([, seedIds]) => seedIds.length === 0)
      .map(([category]) => category),
    [],
  );
});

test("keeps verbal reassurance repair close to the supplied semantic template", () => {
  const repair = findRepairStyleVocabularySeedBySeed("verbal_reassurance_repair");
  assertRepairStyleSeedShape(repair);

  assert.equal(repair?.label, "Verbal Reassurance Repair");
  assert.equal(repair?.repairType, "verbal");
  assert.equal(repair?.metadata.category, "repair_style");
  assert.equal(repair?.metadata.reliability, "high");
  assert.equal(repair?.repairsBestFor.includes("abandonment_rupture"), true);
  assert.equal(repair?.weakForRuptures.includes("major_betrayal"), true);
  assert.equal(repair?.requiredConditions.includes("no_mocking_need"), true);
  assert.equal(repair?.repairActions.includes("promise_realistic_return"), true);
  assert.equal(repair?.attachmentEffects.includes(
    "lowers_abandonment_sensitivity_over_time",
  ), true);
  assert.equal(repair?.compatibleFears.includes("fear_of_abandonment"), true);
  assert.equal(repair?.routeGates.includes("secure_return_gate"), true);
});

test("tracks rupture, wound, and conflict style expansion routes into repair styles", () => {
  assert.deepEqual(repairExpansionLogic.rupture_to_repair.broken_promise_rupture, [
    "behavior_change_repair",
    "accountability_repair",
    "recommitment_repair",
    "broken_promise_repair",
  ]);
  assert.equal(
    repairExpansionLogic.wound_to_repair_preference.abandonment_wound.includes(
      "verbal_reassurance_repair",
    ),
    true,
  );
  assert.equal(
    repairExpansionLogic.conflict_style_to_repair.withdrawer_conflict_style.includes(
      "return_after_space_repair",
    ),
    true,
  );
});

test("keeps repair expansion routes pointed at generated repair seed ids", () => {
  const repairSeedIds = new Set(
    REPAIR_STYLE_VOCABULARY_SEEDS.map((seed) => seed.seed),
  );
  const expansionGroups = Object.entries(repairExpansionLogic) as Array<
    [string, Record<string, readonly string[]>]
  >;
  const missingReferences = expansionGroups.flatMap(
    ([group, routes]) =>
      Object.entries(routes).flatMap(([source, seedIds]) =>
        seedIds
          .filter((seedId) => !repairSeedIds.has(seedId))
          .map((seedId) => `${group}.${source}:${seedId}`),
      ),
  );
  const duplicateReferences = expansionGroups.flatMap(
    ([group, routes]) =>
      Object.entries(routes).flatMap(([source, seedIds]) => {
        const seen = new Set<string>();
        return seedIds
          .filter((seedId) => {
            if (seen.has(seedId)) {
              return true;
            }
            seen.add(seedId);
            return false;
          })
          .map((seedId) => `${group}.${source}:${seedId}`);
      }),
  );

  assert.deepEqual(missingReferences, []);
  assert.deepEqual(duplicateReferences, []);
});

test("adapts repair styles into standardized vocabulary seeds", () => {
  assert.equal(
    REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS.length,
    REPAIR_STYLE_VOCABULARY_SEEDS.length,
  );

  const standard = REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "verbal_reassurance_repair",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Verbal Reassurance Repair");
  assert.match(standard.description, /Core repair message:/);
  assert.match(standard.description, /Failure mode:/);
  assert.equal(standard.tags.includes("repair_style"), true);
  assert.equal(standard.tags.includes("verbal"), true);
  assert.equal(standard.relatedSeeds.includes("abandonment_rupture"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.scenarioHooks.includes("secure_return_gate"), true);
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 9);
});

test("bridges repair style vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "repair-style-vocabulary:verbal_reassurance_repair",
  );

  assert.ok(node);
  assert.equal(node.label, "Verbal Reassurance Repair");
  assert.equal(node.category, "repair_styles");
  assert.equal(node.tags.includes("repair-style-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "repair-style-vocabulary:verbal_reassurance_repair",
  ), true);
});

function assertRepairStyleSeedShape(seed: RepairStyleSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_REPAIR_STYLE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "conflictResolutionValue",
    "healingValue",
    "pacingPressure",
    "reliability",
    "romanceValue",
  ]);
  assert.equal(seed.coreRepairMessage.length > 0, true);
  assert.equal(seed.emotionalNeedMet.length > 0, true);
  assert.equal(seed.failureMode.length > 0, true);
  assert.equal(seed.repairsBestFor.length > 0, true);
  assert.equal(seed.weakForRuptures.length > 0, true);
  assert.equal(seed.requiredConditions.length > 0, true);
  assert.equal(seed.repairActions.length > 0, true);
  assert.equal(seed.timingNeeds.length > 0, true);
  assert.equal(seed.conflictEffects.length > 0, true);
  assert.equal(seed.attachmentEffects.length > 0, true);
  assert.equal(seed.intimacyEffects.length > 0, true);
  assert.equal(seed.compatibleWounds.length > 0, true);
  assert.equal(seed.compatibleFears.length > 0, true);
  assert.equal(seed.compatibleConflictStyles.length > 0, true);
  assert.equal(seed.incompatibleDynamics.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
  assert.equal(seed.metadata.category, "repair_style");
}
