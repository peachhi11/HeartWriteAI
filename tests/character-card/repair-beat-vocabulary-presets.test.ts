import assert from "node:assert/strict";
import test from "node:test";

import {
  REPAIR_BEAT_SEEDS,
  REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS,
  findRepairBeatSeedBySeed,
  getRepairBeatSeedsByCategory,
  getRepairBeatSeedsByType,
  repairBeatCategories,
  repairBeatExpansionLogic,
  repairBeatPresets,
} from "../../data/repairBeatVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RepairBeatSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_REPAIR_BEAT_SEED_KEYS = [
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
  "beatType",
  "emotionalFunction",
  "repairQuestion",
  "repairsConsequences",
  "repairsRuptures",
  "compatibleRepairStyles",
  "requiredConditions",
  "likelyResistance",
  "failureModes",
  "successSignals",
  "relationshipEffects",
  "milestoneMemories",
  "growthPotential",
  "metadata",
].sort();

test("generates repair beat seeds across stable repair beat categories", () => {
  assert.equal(repairBeatPresets.length, 30);
  assert.equal(REPAIR_BEAT_SEEDS.length, 30);
  assert.equal(
    new Set(REPAIR_BEAT_SEEDS.map((seed) => seed.seed)).size,
    30,
  );
  assert.deepEqual(Object.keys(repairBeatCategories), [
    "apology",
    "clarification",
    "validation",
    "accountability",
    "truth",
    "behavior_change",
    "return",
    "boundary",
    "comfort",
    "dignity",
    "loyalty",
    "reassurance",
    "touch",
    "ritual",
    "service",
    "vulnerability",
    "forgiveness",
    "recommitment",
    "symbolic",
    "growth",
  ]);
  assert.equal(getRepairBeatSeedsByCategory("accountability").length, 2);
  assert.equal(getRepairBeatSeedsByCategory("return").length, 3);
  assert.equal(getRepairBeatSeedsByCategory("behavior_change").length, 2);
  assert.equal(getRepairBeatSeedsByType("accountability").length, 2);
  assert.equal(getRepairBeatSeedsByType("touch").length, 1);
  assert.deepEqual(
    (Object.entries(repairBeatCategories) as Array<[string, readonly string[]]>)
      .filter(([, seedIds]) => seedIds.length === 0)
      .map(([category]) => category),
    [],
  );
});

test("keeps accountability beat close to the supplied repair beat template", () => {
  const beat = findRepairBeatSeedBySeed("accountability_beat");
  assertRepairBeatSeedShape(beat);

  assert.equal(beat?.label, "Accountability Beat");
  assert.equal(beat?.beatType, "accountability");
  assert.equal(beat?.metadata.category, "repair_beat");
  assert.equal(beat?.metadata.intensity, "high");
  assert.equal(beat?.metadata.trustRepairValue, 10);
  assert.equal(beat?.repairsConsequences.includes("trust_damage_consequence"), true);
  assert.equal(beat?.repairsRuptures.includes("betrayal_rupture"), true);
  assert.equal(beat?.compatibleRepairStyles.includes("accountability_repair"), true);
  assert.equal(beat?.requiredConditions.includes("no_forced_forgiveness"), true);
  assert.equal(beat?.likelyResistance.includes("shame_spiral"), true);
  assert.equal(beat?.failureModes.includes("self_punishment_instead_of_repair"), true);
  assert.equal(beat?.successSignals.includes("changed_behavior_plan_exists"), true);
  assert.equal(beat?.growthPotential.includes("builds_repair_capacity"), true);
  assert.equal(
    beat?.dialoguePatterns.includes(
      "You do not have to forgive me just because I finally understand.",
    ),
    true,
  );
});

test("tracks consequence, rupture, and repair style expansion into repair beats", () => {
  assert.deepEqual(
    repairBeatExpansionLogic.consequence_to_repair_beat.trust_damage_consequence,
    [
      "accountability_beat",
      "truth_comes_out_beat",
      "changed_behavior_beat",
      "promise_kept_beat",
    ],
  );
  assert.equal(
    repairBeatExpansionLogic.rupture_to_repair_beat.abandonment_rupture.includes(
      "i_am_not_leaving_beat",
    ),
    true,
  );
  assert.equal(
    repairBeatExpansionLogic.repair_style_to_repair_beat.accountability_repair.includes(
      "no_excuses_beat",
    ),
    true,
  );
});

test("keeps repair beat expansion routes pointed at generated beat ids", () => {
  const repairBeatSeedIds = new Set(REPAIR_BEAT_SEEDS.map((seed) => seed.seed));
  const expansionGroups = Object.entries(repairBeatExpansionLogic) as Array<
    [string, Record<string, readonly string[]>]
  >;
  const missingReferences = expansionGroups.flatMap(
    ([group, routes]) =>
      Object.entries(routes).flatMap(([source, seedIds]) =>
        seedIds
          .filter((seedId) => !repairBeatSeedIds.has(seedId))
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

test("adapts repair beats into standardized vocabulary seeds", () => {
  assert.equal(
    REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS.length,
    REPAIR_BEAT_SEEDS.length,
  );

  const standard = REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "accountability_beat",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Accountability Beat");
  assert.match(standard.description, /Emotional function:/);
  assert.match(standard.description, /Repair question:/);
  assert.equal(standard.tags.includes("repair_beat"), true);
  assert.equal(standard.tags.includes("accountability"), true);
  assert.equal(standard.relatedSeeds.includes("trust_damage_consequence"), true);
  assert.equal(standard.relatedSeeds.includes("betrayal_rupture"), true);
  assert.equal(standard.scenarioHooks.includes("specific_admission"), true);
  assert.equal(standard.metadata.romanceValue, 9);
  assert.equal(standard.metadata.conflictPotential, 10);
});

test("bridges repair beat vocabulary into the semantic graph as repair styles", () => {
  const node = findSemanticSeedGraphNodeById(
    "repair-beat-vocabulary:accountability_beat",
  );

  assert.ok(node);
  assert.equal(node.label, "Accountability Beat");
  assert.equal(node.category, "repair_styles");
  assert.equal(node.tags.includes("repair-beat-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "repair-beat-vocabulary:accountability_beat",
  ), true);
});

function assertRepairBeatSeedShape(seed: RepairBeatSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_REPAIR_BEAT_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "attachmentRepairValue",
    "category",
    "healingValue",
    "intensity",
    "pacingPressure",
    "repairPower",
    "trustRepairValue",
  ]);
  assert.equal(seed.metadata.repairPower >= 1, true);
  assert.equal(seed.metadata.repairPower <= 10, true);
  assert.equal(seed.metadata.trustRepairValue >= 1, true);
  assert.equal(seed.metadata.trustRepairValue <= 10, true);
}
