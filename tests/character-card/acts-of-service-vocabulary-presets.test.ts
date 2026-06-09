import assert from "node:assert/strict";
import test from "node:test";

import {
  ACTS_OF_SERVICE_SEED_PRESETS,
  ACTS_OF_SERVICE_VOCABULARY_SEEDS,
  actsOfServicePresets,
  actsOfServiceSeedCategories,
  actsOfServiceSeeds,
  findActsOfServiceSeedPresetBySeed,
  findActsOfServiceVocabularySeedBySeed,
  getActsOfServiceSeedPresetsByCategory,
  getActsOfServiceVocabularySeedsByCategory,
  highValueActsOfServiceSeeds,
} from "../../data/actsOfServiceVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
  searchSemanticSeedGraphNodes,
} from "../../data/semanticSeedRegistry";
import type {
  ActsOfServiceSeed,
  VocabularySeedPreset,
} from "../../data/vocabularySeedTypes";

const EXPECTED_VOCABULARY_SEED_KEYS = [
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
  "metadata",
].sort();

const EXPECTED_RICH_ACTS_OF_SERVICE_SEED_KEYS = [
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
  "serviceType",
  "emotionalMeaning",
  "hiddenMotivation",
  "fantasyFulfillment",
  "activatedBy",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "visibleBehaviors",
  "escalationPath",
  "relationshipEffects",
  "conflictEffects",
  "intimacyEffects",
  "canBecomeUnhealthyAs",
  "healingVersion",
  "routeGates",
  "growthArcs",
  "metadata",
].sort();

test("loads acts of service seeds, presets, and high-value picks", () => {
  assert.equal(actsOfServiceSeeds.length, 90);
  assert.equal(actsOfServicePresets.length, 20);
  assert.equal(highValueActsOfServiceSeeds.length, 20);
  assert.equal(ACTS_OF_SERVICE_SEED_PRESETS.length, actsOfServiceSeeds.length);
  assert.equal(ACTS_OF_SERVICE_VOCABULARY_SEEDS.length, actsOfServiceSeeds.length);
  assert.equal(
    new Set(ACTS_OF_SERVICE_VOCABULARY_SEEDS.map((seed) => seed.seed)).size,
    actsOfServiceSeeds.length,
  );
  assert.deepEqual(Object.keys(actsOfServiceSeedCategories), [
    "core",
    "food_and_drink",
    "domestic_help",
    "protective_practicality",
    "daily_care",
    "comfort_environment",
    "problem_solving",
    "repair_service",
    "service_style",
  ]);
  assert.equal(getActsOfServiceVocabularySeedsByCategory("core").length, 10);
  assert.equal(getActsOfServiceSeedPresetsByCategory("core").length, 10);
  assert.equal(getActsOfServiceVocabularySeedsByCategory("repair_service").length, 10);
  assert.equal(getActsOfServiceVocabularySeedsByCategory("service_style").length, 10);
});

test("creates rich acts of service seeds with psychology and route payloads", () => {
  const makesTea = findActsOfServiceSeedPresetBySeed("makes_tea");
  const walksHome = findActsOfServiceSeedPresetBySeed("walks_partner_home");
  const serviceAfterConflict = findActsOfServiceSeedPresetBySeed(
    "service_after_conflict",
  );

  assertActsOfServiceSeedShape(makesTea);
  assertActsOfServiceSeedShape(walksHome);
  assertActsOfServiceSeedShape(serviceAfterConflict);

  assert.equal(makesTea?.serviceType, "domestic");
  assert.equal(
    makesTea?.emotionalMeaning,
    "I noticed your discomfort and wanted to ease it.",
  );
  assert.equal(makesTea?.hiddenMotivation, "Caring feels safer than vulnerability.");
  assert.equal(makesTea?.fantasyFulfillment, "Someone notices your needs before you ask.");
  assert.equal(makesTea?.activatedBy.includes("conflict_aftermath"), true);
  assert.equal(makesTea?.associatedWounds.includes("emotional_neglect_wound"), true);
  assert.equal(makesTea?.associatedFears.includes("fear_of_vulnerability"), true);
  assert.equal(makesTea?.associatedDesires.includes("desire_to_be_useful"), true);
  assert.equal(makesTea?.visibleBehaviors.includes("appears_with_tea"), true);
  assert.equal(makesTea?.routeGates.includes("first_comfort_drink_gate"), true);
  assert.equal(makesTea?.metadata.healingValue, 10);

  assert.equal(walksHome?.serviceType, "protective");
  assert.equal(walksHome?.emotionalMeaning, "Your safety matters to me.");
  assert.equal(walksHome?.associatedWounds.includes("never_protected_wound"), true);
  assert.equal(walksHome?.romanceHooks.includes("waits_until_lights_turn_on"), true);

  assert.equal(serviceAfterConflict?.serviceType, "repair");
  assert.equal(serviceAfterConflict?.metadata.conflictPotential, 7);
  assert.equal(
    serviceAfterConflict?.healingVersion,
    "Pairs practical follow-through with explicit accountability and patience.",
  );
});

test("standardizes acts of service seeds into canonical vocabulary shape", () => {
  const quietDevotion = findActsOfServiceVocabularySeedBySeed("quiet_devotion");
  const serviceAfterConflict = findActsOfServiceVocabularySeedBySeed(
    "service_after_conflict",
  );
  const helpsWithoutControl = findActsOfServiceVocabularySeedBySeed(
    "helps_without_control",
  );

  assertVocabularySeedShape(quietDevotion);
  assertVocabularySeedShape(serviceAfterConflict);
  assertVocabularySeedShape(helpsWithoutControl);

  assert.equal(quietDevotion?.label, "Quiet Devotion");
  assert.equal(quietDevotion?.tags.includes("acts_of_service"), true);
  assert.equal(quietDevotion?.tags.includes("love_language"), true);
  assert.equal(quietDevotion?.tags.includes("high_value"), true);
  assert.match(quietDevotion?.description ?? "", /quiet way to make care visible/i);
  assert.equal(quietDevotion?.oppositeSeeds.includes("care_as_control"), true);
  assert.equal(quietDevotion?.dialoguePatterns.includes(
    "You do not owe me for being cared for.",
  ), true);

  assert.equal(serviceAfterConflict?.tags.includes("repair_service"), true);
  assert.equal(serviceAfterConflict?.relatedSeeds.includes("accountability_repair"), true);
  assert.equal(serviceAfterConflict?.metadata.conflictPotential, 7);

  assert.match(
    helpsWithoutControl?.examples.join(" ") ?? "",
    /room for refusal and no hidden debt/i,
  );
});

test("bridges acts of service vocabulary into love-language semantic graph nodes", () => {
  const node = findSemanticSeedGraphNodeById(
    "acts-of-service-vocabulary:quiet_devotion",
  );
  const searchResults = searchSemanticSeedGraphNodes("no hidden debt", {
    categories: ["love_languages"],
    tags: ["acts-of-service-vocabulary"],
    limit: 5,
  });

  assert.ok(node);
  assert.equal(node.label, "Quiet Devotion");
  assert.equal(node.category, "love_languages");
  assert.equal(node.tags.includes("acts-of-service-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "acts-of-service-vocabulary:quiet_devotion",
  ), true);
  assert.equal(searchResults.some((result) => result.label === "Quiet Devotion"), true);
});

function assertVocabularySeedShape(seed: VocabularySeedPreset | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_VOCABULARY_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "conflictPotential",
    "rarity",
    "romanceValue",
  ]);
  assert.equal(seed.description.length > 0, true);
  assert.equal(seed.examples.length > 0, true);
  assert.equal(seed.tags.length > 0, true);
  assert.equal(seed.romanceHooks.length > 0, true);
  assert.equal(seed.scenarioHooks.length > 0, true);
  assert.equal(seed.dialoguePatterns.length > 0, true);
}

function assertActsOfServiceSeedShape(seed: ActsOfServiceSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_RICH_ACTS_OF_SERVICE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "conflictPotential",
    "healingValue",
    "intimacyValue",
    "romanceValue",
  ]);
  assert.equal(seed.metadata.category, "acts_of_service");
  assert.equal(seed.emotionalMeaning.length > 0, true);
  assert.equal(seed.hiddenMotivation.length > 0, true);
  assert.equal(seed.fantasyFulfillment.length > 0, true);
  assert.equal(seed.activatedBy.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.visibleBehaviors.length > 0, true);
  assert.equal(seed.escalationPath.length > 0, true);
  assert.equal(seed.relationshipEffects.length > 0, true);
  assert.equal(seed.conflictEffects.length > 0, true);
  assert.equal(seed.intimacyEffects.length > 0, true);
  assert.equal(seed.canBecomeUnhealthyAs.length > 0, true);
  assert.equal(seed.healingVersion.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
}
