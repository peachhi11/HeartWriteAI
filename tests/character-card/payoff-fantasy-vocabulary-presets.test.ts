import assert from "node:assert/strict";
import test from "node:test";

import {
  PAYOFF_FANTASY_SEEDS,
  PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS,
  findPayoffFantasySeedBySeed,
  getPayoffFantasySeedsByCategory,
  getPayoffFantasySeedsByType,
  payoffFantasyCategories,
  payoffFantasyExpansionLogic,
  payoffFantasyPresets,
  payoffFantasySemanticChain,
} from "../../data/payoffFantasyVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { PayoffFantasySeed } from "../../data/vocabularySeedTypes";

const EXPECTED_PAYOFF_FANTASY_SEED_KEYS = [
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
  "payoffType",
  "fulfillsDesires",
  "resolvesFears",
  "healsWounds",
  "compatibleTropes",
  "compatibleDynamics",
  "compatibleGrowthArcs",
  "requiredRoutePhases",
  "payoffScenes",
  "emotionalProofs",
  "endingFlavors",
  "antiPatterns",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates payoff fantasy seeds across stable payoff categories", () => {
  assert.equal(payoffFantasyPresets.length, 30);
  assert.equal(PAYOFF_FANTASY_SEEDS.length, 30);
  assert.equal(new Set(PAYOFF_FANTASY_SEEDS.map((seed) => seed.seed)).size, 30);
  assert.deepEqual(Object.keys(payoffFantasyCategories), [
    "chosen",
    "safety",
    "belonging",
    "healing",
    "devotion",
    "freedom",
    "trust",
    "recognition",
    "protection",
    "partnership",
    "domestic",
    "redemption",
    "victory",
  ]);
  assert.equal(getPayoffFantasySeedsByCategory("chosen").length, 4);
  assert.equal(getPayoffFantasySeedsByCategory("domestic").length, 2);
  assert.equal(getPayoffFantasySeedsByType("safety").length, 4);
  assert.equal(getPayoffFantasySeedsByType("redemption").length, 1);
});

test("keeps chosen above everyone close to the supplied payoff template", () => {
  const chosen = findPayoffFantasySeedBySeed("chosen_above_everyone");

  assertPayoffFantasySeedShape(chosen);
  assert.equal(chosen?.label, "Chosen Above Everyone");
  assert.equal(chosen?.payoffType, "chosen");
  assert.match(chosen?.description ?? "", /forced to choose/);
  assert.equal(chosen?.fulfillsDesires.includes("desire_to_be_chosen"), true);
  assert.equal(chosen?.resolvesFears.includes("fear_of_replacement"), true);
  assert.equal(chosen?.healsWounds.includes("never_chosen_wound"), true);
  assert.equal(chosen?.compatibleTropes.includes("fake_relationship"), true);
  assert.equal(chosen?.requiredRoutePhases.includes("crisis_or_choice"), true);
  assert.equal(chosen?.emotionalProofs.includes("choice_has_cost"), true);
  assert.equal(chosen?.routeGates.includes("public_choice_gate"), true);
  assert.equal(chosen?.metadata.category, "payoff_fantasy");
  assert.equal(chosen?.metadata.intensity, "high");
  assert.equal(chosen?.metadata.romanceValue, 10);
  assert.equal(chosen?.metadata.catharsisValue, 10);
});

test("tracks wound, desire, and trope expansion routes into payoff fantasies", () => {
  assert.deepEqual(payoffFantasySemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Relationship Dynamic",
    "Romance Trope",
    "Route Phase",
    "Conflict Beat",
    "Repair Beat",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
    "Ending Flavor",
  ]);
  assert.equal(
    payoffFantasyExpansionLogic.wound_to_payoff.abandonment_wound.includes(
      "someone_finally_stays",
    ),
    true,
  );
  assert.equal(
    payoffFantasyExpansionLogic.desire_to_payoff.desire_for_autonomy.includes(
      "equal_partnership",
    ),
    true,
  );
  assert.equal(
    payoffFantasyExpansionLogic.trope_to_payoff.fake_relationship.includes(
      "fake_becomes_real",
    ),
    true,
  );
});

test("adapts payoff fantasies into standardized vocabulary seeds", () => {
  assert.equal(
    PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS.length,
    PAYOFF_FANTASY_SEEDS.length,
  );

  const standard = PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "chosen_above_everyone",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Chosen Above Everyone");
  assert.match(standard.description, /Payoff type: chosen/);
  assert.equal(standard.tags.includes("payoff_fantasy"), true);
  assert.equal(standard.tags.includes("chosen"), true);
  assert.equal(standard.relatedSeeds.includes("desire_to_be_chosen"), true);
  assert.equal(standard.scenarioHooks.includes("chosen_above_others_memory"), true);
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 10);
});

test("bridges payoff fantasy vocabulary into the semantic graph as routes", () => {
  const node = findSemanticSeedGraphNodeById(
    "payoff-fantasy-vocabulary:chosen_above_everyone",
  );

  assert.ok(node);
  assert.equal(node.label, "Chosen Above Everyone");
  assert.equal(node.category, "routes");
  assert.equal(node.tags.includes("payoff-fantasy-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "payoff-fantasy-vocabulary:chosen_above_everyone",
  ), true);
});

function assertPayoffFantasySeedShape(seed: PayoffFantasySeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_PAYOFF_FANTASY_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "catharsisValue",
    "comfortValue",
    "healingValue",
    "intensity",
    "romanceValue",
  ]);
  assert.equal(seed.fulfillsDesires.length > 0, true);
  assert.equal(seed.resolvesFears.length > 0, true);
  assert.equal(seed.healsWounds.length > 0, true);
  assert.equal(seed.compatibleTropes.length > 0, true);
  assert.equal(seed.compatibleDynamics.length > 0, true);
  assert.equal(seed.compatibleGrowthArcs.length > 0, true);
  assert.equal(seed.requiredRoutePhases.length > 0, true);
  assert.equal(seed.payoffScenes.length > 0, true);
  assert.equal(seed.emotionalProofs.length > 0, true);
  assert.equal(seed.endingFlavors.length > 0, true);
  assert.equal(seed.antiPatterns.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.milestoneMemories.length > 0, true);
}
