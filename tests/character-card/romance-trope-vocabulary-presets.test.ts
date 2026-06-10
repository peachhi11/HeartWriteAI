import assert from "node:assert/strict";
import test from "node:test";

import {
  ROMANCE_TROPE_SEEDS,
  ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS,
  findRomanceTropeSeedBySeed,
  getRomanceTropeSeedsByCategory,
  getRomanceTropeSeedsByType,
  romanceTropeCategories,
  romanceTropeExpansionLogic,
  romanceTropeRoutePhases,
  romanceTropeSeedPresets,
  romanceTropeSemanticChain,
} from "../../data/romanceTropeVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { RomanceTropeSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_ROMANCE_TROPE_SEED_KEYS = [
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
  "tropeType",
  "emotionalCore",
  "payoffFantasy",
  "startingConditions",
  "emotionalBarriers",
  "commonTriggers",
  "commonResponses",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "relationshipDynamics",
  "routePhases",
  "conflictBeats",
  "repairBeats",
  "intimacyGates",
  "healthyVersion",
  "unhealthyVersion",
  "antiPatterns",
  "compatibleSettings",
  "compatibleOpeners",
  "metadata",
].sort();

test("generates romance trope route templates across stable categories", () => {
  assert.equal(romanceTropeSeedPresets.length, 20);
  assert.equal(ROMANCE_TROPE_SEEDS.length, 49);
  assert.equal(new Set(ROMANCE_TROPE_SEEDS.map((seed) => seed.seed)).size, 49);
  assert.deepEqual(Object.keys(romanceTropeCategories), [
    "conflict_based",
    "intimacy_based",
    "circumstance_based",
    "forbidden",
    "healing",
    "obsessive",
    "destiny",
    "domestic",
    "power_dynamic",
    "second_chance",
  ]);
  assert.equal(getRomanceTropeSeedsByCategory("conflict_based").length, 6);
  assert.equal(getRomanceTropeSeedsByCategory("destiny").length, 4);
  assert.equal(getRomanceTropeSeedsByType("conflict_based").length, 6);
  assert.equal(getRomanceTropeSeedsByType("healing").length, 4);
});

test("keeps enemies to lovers close to the supplied route template", () => {
  const enemies = findRomanceTropeSeedBySeed("enemies_to_lovers");

  assertRomanceTropeSeedShape(enemies);
  assert.equal(enemies?.label, "Enemies to Lovers");
  assert.equal(enemies?.tropeType, "conflict_based");
  assert.match(enemies?.description ?? "", /hostility, distrust, rivalry/);
  assert.equal(
    enemies?.emotionalCore,
    "The person who felt unsafe becomes the person who understands them most.",
  );
  assert.equal(
    enemies?.payoffFantasy,
    "Being loved by someone who saw the worst first and chose them anyway.",
  );
  assert.equal(enemies?.relationshipDynamics.includes("rivals_dynamic"), true);
  assert.equal(enemies?.routePhases.includes("reluctant_trust"), true);
  assert.equal(enemies?.conflictBeats.includes("trust_test_failed"), true);
  assert.equal(enemies?.repairBeats.includes("accountability_repair"), true);
  assert.equal(enemies?.intimacyGates.includes("enemy_to_partner_gate"), true);
  assert.equal(enemies?.antiPatterns.includes("romanticizing_fear_as_love"), true);
  assert.equal(enemies?.metadata.category, "romance_trope");
  assert.equal(enemies?.metadata.burnSpeed, "slow");
  assert.equal(enemies?.metadata.conflictPotential, 10);
});

test("tracks wound, fear, desire, and dynamic expansion routes into tropes", () => {
  assert.deepEqual(romanceTropeSemanticChain, [
    "wound",
    "fear",
    "desire",
    "trigger",
    "response",
    "relationship_dynamic",
    "romance_trope",
    "route_phase",
    "conflict_beat",
    "repair_beat",
    "payoff_fantasy",
    "relationship_identity",
  ]);
  assert.deepEqual(romanceTropeRoutePhases, [
    "initial_dynamic",
    "friction_or_spark",
    "repeated_contact",
    "vulnerability_leak",
    "reframing",
    "emotional_investment",
    "crisis_or_choice",
    "confession_or_escalation",
    "integration",
  ]);
  assert.equal(
    romanceTropeExpansionLogic.wound_to_trope.betrayal_wound.includes(
      "enemies_to_lovers",
    ),
    true,
  );
  assert.equal(
    romanceTropeExpansionLogic.fear_to_trope.fear_of_vulnerability.includes(
      "grumpy_sunshine",
    ),
    true,
  );
  assert.equal(
    romanceTropeExpansionLogic.desire_to_trope.desire_for_safety.includes(
      "bodyguard_romance",
    ),
    true,
  );
  assert.equal(
    romanceTropeExpansionLogic.dynamic_to_trope.rivals_dynamic.includes(
      "workplace_rivals",
    ),
    true,
  );
});

test("adapts romance tropes into standardized vocabulary seeds", () => {
  assert.equal(
    ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS.length,
    ROMANCE_TROPE_SEEDS.length,
  );

  const standard = ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "enemies_to_lovers",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Enemies to Lovers");
  assert.match(standard.description, /Payoff fantasy:/);
  assert.equal(standard.tags.includes("romance_trope"), true);
  assert.equal(standard.tags.includes("conflict_based"), true);
  assert.equal(standard.relatedSeeds.includes("rivals_dynamic"), true);
  assert.equal(standard.scenarioHooks.includes("enemy_to_partner_gate"), true);
  assert.equal(standard.metadata.romanceValue, 10);
});

test("bridges romance trope vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "romance-trope-vocabulary:enemies_to_lovers",
  );

  assert.ok(node);
  assert.equal(node.label, "Enemies to Lovers");
  assert.equal(node.category, "romance_tropes");
  assert.equal(node.tags.includes("romance-trope-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "romance-trope-vocabulary:enemies_to_lovers",
  ), true);
});

function assertRomanceTropeSeedShape(seed: RomanceTropeSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_ROMANCE_TROPE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "burnSpeed",
    "category",
    "chemistryValue",
    "comfortValue",
    "conflictPotential",
    "healingPotential",
    "intensity",
  ]);
  assert.equal(seed.emotionalCore.length > 0, true);
  assert.equal(seed.payoffFantasy.length > 0, true);
  assert.equal(seed.startingConditions.length > 0, true);
  assert.equal(seed.emotionalBarriers.length > 0, true);
  assert.equal(seed.commonTriggers.length > 0, true);
  assert.equal(seed.commonResponses.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.relationshipDynamics.length > 0, true);
  assert.equal(seed.routePhases.length > 0, true);
  assert.equal(seed.conflictBeats.length > 0, true);
  assert.equal(seed.repairBeats.length > 0, true);
  assert.equal(seed.intimacyGates.length > 0, true);
  assert.equal(seed.healthyVersion.length > 0, true);
  assert.equal(seed.unhealthyVersion.length > 0, true);
  assert.equal(seed.antiPatterns.length > 0, true);
  assert.equal(seed.compatibleSettings.length > 0, true);
  assert.equal(seed.compatibleOpeners.length > 0, true);
}
