import assert from "node:assert/strict";
import test from "node:test";

import {
  CONSEQUENCE_SEEDS,
  CONSEQUENCE_VOCABULARY_STANDARD_SEEDS,
  consequenceCategories,
  consequenceExpansionLogic,
  consequencePresets,
  findConsequenceSeedBySeed,
  getConsequenceSeedsByCategory,
  getConsequenceSeedsByType,
} from "../../data/consequenceVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import type { ConsequenceSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_CONSEQUENCE_SEED_KEYS = [
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
  "consequenceType",
  "causedBy",
  "affectsTrustLayers",
  "likelyResponses",
  "repairNeeds",
  "compatibleRepairStyles",
  "growthPotential",
  "milestoneMemories",
  "metadata",
].sort();

test("generates consequence seeds across stable consequence categories", () => {
  assert.equal(consequencePresets.length, 20);
  assert.equal(CONSEQUENCE_SEEDS.length, 20);
  assert.equal(new Set(CONSEQUENCE_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.deepEqual(Object.keys(consequenceCategories), [
    "trust_damage",
    "attachment_damage",
    "emotional_safety",
    "vulnerability",
    "withdrawal",
    "hypervigilance",
    "reassurance",
    "avoidance",
    "fear_reinforcement",
    "resentment",
    "distance",
    "ritual_damage",
    "identity_damage",
    "public",
    "boundary",
    "jealousy",
    "reliability",
    "priority",
    "self_worth",
    "repair_readiness",
  ]);
  assert.equal(getConsequenceSeedsByCategory("trust_damage").length, 1);
  assert.equal(getConsequenceSeedsByType("boundary").length, 1);
  assert.deepEqual(
    (Object.entries(consequenceCategories) as Array<[string, readonly string[]]>)
      .filter(([, seedIds]) => seedIds.length === 0)
      .map(([category]) => category),
    [],
  );
});

test("keeps trust damage consequence close to the supplied template", () => {
  const consequence = findConsequenceSeedBySeed("trust_damage_consequence");
  assertConsequenceSeedShape(consequence);

  assert.equal(consequence?.label, "Trust Damage Consequence");
  assert.equal(consequence?.consequenceType, "trust_damage");
  assert.equal(consequence?.metadata.category, "consequence");
  assert.equal(consequence?.metadata.severity, "major");
  assert.equal(consequence?.metadata.persistence, "arc_level");
  assert.equal(consequence?.causedBy.includes("protective_lie_rupture"), true);
  assert.equal(consequence?.affectsTrustLayers.includes("vulnerability_trust"), true);
  assert.equal(consequence?.repairNeeds.includes("consistency_over_time"), true);
  assert.equal(
    consequence?.dialoguePatterns.includes("You taught me not to trust that promise."),
    true,
  );
});

test("tracks rupture and consequence expansion into repair styles", () => {
  assert.deepEqual(
    consequenceExpansionLogic.rupture_type_to_consequence.abandonment_rupture,
    [
      "attachment_damage_consequence",
      "reassurance_need_increase",
      "emotional_distance_consequence",
    ],
  );
  assert.equal(
    consequenceExpansionLogic.consequence_to_repair_style.trust_damage_consequence.includes(
      "truth_and_accountability_repair",
    ),
    true,
  );
});

test("adapts consequences into standardized vocabulary seeds and semantic routes", () => {
  assert.equal(CONSEQUENCE_VOCABULARY_STANDARD_SEEDS.length, CONSEQUENCE_SEEDS.length);
  const standard = CONSEQUENCE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "trust_damage_consequence",
  );
  const node = findSemanticSeedGraphNodeById(
    "consequence-vocabulary:trust_damage_consequence",
  );

  assert.ok(standard);
  assert.match(standard.description, /Consequence type: trust_damage/);
  assert.equal(standard.tags.includes("consequence"), true);
  assert.equal(standard.relatedSeeds.includes("betrayal_rupture"), true);
  assert.equal(standard.scenarioHooks.includes("truth"), true);
  assert.ok(node);
  assert.equal(node.category, "routes");
});

function assertConsequenceSeedShape(seed: ConsequenceSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_CONSEQUENCE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "healingValue",
    "persistence",
    "repairDifficulty",
    "severity",
  ]);
}
