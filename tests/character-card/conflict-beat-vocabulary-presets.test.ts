import assert from "node:assert/strict";
import test from "node:test";

import {
  CONFLICT_BEAT_SEEDS,
  CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS,
  conflictBeatCategories,
  conflictBeatExpansionLogic,
  conflictBeatPresets,
  findConflictBeatSeedBySeed,
  getConflictBeatSeedsByCategory,
  getConflictBeatSeedsByType,
} from "../../data/conflictBeatVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import type { ConflictBeatSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_CONFLICT_BEAT_SEED_KEYS = [
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
  "hiddenQuestion",
  "activatesWounds",
  "activatesFears",
  "activatesDesires",
  "commonTriggers",
  "likelyResponses",
  "compatibleConflictStyles",
  "compatibleRepairStyles",
  "compatibleRoutePhases",
  "compatibleTropes",
  "escalationPath",
  "ruptureRisks",
  "repairNeeds",
  "growthPotential",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates conflict beat seeds across stable conflict categories", () => {
  assert.equal(conflictBeatPresets.length, 30);
  assert.equal(CONFLICT_BEAT_SEEDS.length, 30);
  assert.equal(new Set(CONFLICT_BEAT_SEEDS.map((seed) => seed.seed)).size, 30);
  assert.deepEqual(Object.keys(conflictBeatCategories), [
    "misunderstanding",
    "trust_test",
    "jealousy",
    "betrayal",
    "withdrawal",
    "argument",
    "boundary",
    "secret",
    "choice",
    "separation",
    "public_pressure",
    "near_loss",
    "rupture",
  ]);
  assert.equal(getConflictBeatSeedsByCategory("misunderstanding").length, 6);
  assert.equal(getConflictBeatSeedsByType("separation").length, 3);
  assert.equal(getConflictBeatSeedsByType("choice").length, 4);
  assert.deepEqual(
    (Object.entries(conflictBeatCategories) as Array<[string, readonly string[]]>)
      .filter(([, seedIds]) => seedIds.length === 0)
      .map(([category]) => category),
    [],
  );
});

test("keeps delayed reply spiral close to the supplied conflict beat template", () => {
  const beat = findConflictBeatSeedBySeed("delayed_reply_spiral");
  assertConflictBeatSeedShape(beat);

  assert.equal(beat?.label, "Delayed Reply Spiral");
  assert.equal(beat?.beatType, "separation");
  assert.equal(beat?.metadata.category, "conflict_beat");
  assert.equal(beat?.metadata.healingValue, 9);
  assert.equal(beat?.activatesWounds.includes("abandonment_wound"), true);
  assert.equal(beat?.activatesFears.includes("fear_of_emotional_distance"), true);
  assert.equal(beat?.compatibleRepairStyles.includes("check_in_ritual_repair"), true);
  assert.equal(beat?.ruptureRisks.includes("partner_feels_controlled"), true);
  assert.equal(beat?.routeGates.includes("secure_waiting_gate"), true);
  assert.equal(
    beat?.dialoguePatterns.includes(
      "I know it was only a message, but it did not feel small.",
    ),
    true,
  );
});

test("tracks wound, fear, response, and repair expansion into conflict beats", () => {
  assert.equal(
    conflictBeatExpansionLogic.wound_to_conflict_beat.abandonment_wound.includes(
      "delayed_reply_spiral",
    ),
    true,
  );
  assert.equal(
    conflictBeatExpansionLogic.fear_to_conflict_beat.fear_of_replacement.includes(
      "rival_attention",
    ),
    true,
  );
  assert.equal(
    conflictBeatExpansionLogic.response_to_conflict_beat.emotional_withdrawal_response.includes(
      "cold_silence",
    ),
    true,
  );
  assert.equal(
    conflictBeatExpansionLogic.conflict_beat_to_repair_style.boundary_crossed.includes(
      "choice_restoration_repair",
    ),
    true,
  );
});

test("keeps conflict beat expansion routes pointed at generated beat ids", () => {
  const conflictBeatSeedIds = new Set(CONFLICT_BEAT_SEEDS.map((seed) => seed.seed));
  const expansionGroups = Object.entries(conflictBeatExpansionLogic).filter(
    ([group]) => group !== "conflict_beat_to_repair_style",
  ) as Array<[string, Record<string, readonly string[]>]>;
  const missingReferences = expansionGroups.flatMap(
    ([group, routes]) =>
      Object.entries(routes).flatMap(([source, seedIds]) =>
        seedIds
          .filter((seedId) => !conflictBeatSeedIds.has(seedId))
          .map((seedId) => `${group}.${source}:${seedId}`),
      ),
  );

  assert.deepEqual(missingReferences, []);
});

test("adapts conflict beats into standardized vocabulary seeds and semantic gates", () => {
  assert.equal(CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS.length, CONFLICT_BEAT_SEEDS.length);
  const standard = CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "delayed_reply_spiral",
  );
  const node = findSemanticSeedGraphNodeById(
    "conflict-beat-vocabulary:delayed_reply_spiral",
  );

  assert.ok(standard);
  assert.match(standard.description, /Hidden question:/);
  assert.equal(standard.tags.includes("conflict_beat"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.scenarioHooks.includes("secure_waiting_gate"), true);
  assert.ok(node);
  assert.equal(node.category, "relationship_gates");
});

function assertConflictBeatSeedShape(seed: ConflictBeatSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_CONFLICT_BEAT_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "chemistryValue",
    "healingValue",
    "intensity",
    "pacingPressure",
    "ruptureRisk",
  ]);
}
