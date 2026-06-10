import assert from "node:assert/strict";
import test from "node:test";

import {
  LOVE_LANGUAGE_SEEDS,
  LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS,
  findLoveLanguageSeedBySeed,
  getLoveLanguageSeedsByCategory,
  getLoveLanguageSeedsByType,
  loveLanguageCategories,
  loveLanguageExpansionLogic,
  loveLanguagePresets,
  loveLanguageSemanticChain,
} from "../../data/loveLanguageVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { LoveLanguageSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_LOVE_LANGUAGE_SEED_KEYS = [
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
  "loveLanguageType",
  "emotionalMeaning",
  "hiddenNeed",
  "commonMisread",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "compatibleAttachmentStyles",
  "compatibleDynamics",
  "visibleBehaviors",
  "fulfillmentSignals",
  "deprivationSignals",
  "conflictRisks",
  "repairStyles",
  "growthArcs",
  "routeGates",
  "metadata",
].sort();

test("generates love language seeds across stable categories", () => {
  assert.equal(loveLanguagePresets.length, 20);
  assert.equal(LOVE_LANGUAGE_SEEDS.length, 20);
  assert.equal(new Set(LOVE_LANGUAGE_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.deepEqual(Object.keys(loveLanguageCategories), [
    "words",
    "service",
    "gifts",
    "time",
    "touch",
    "presence",
    "protection",
    "loyalty",
    "ritual",
    "banter",
    "intellectual",
    "creative",
    "domestic",
    "practical",
    "reassurance",
    "vulnerability",
    "silence",
  ]);
  assert.equal(getLoveLanguageSeedsByCategory("loyalty").length, 2);
  assert.equal(getLoveLanguageSeedsByCategory("silence").length, 2);
  assert.equal(getLoveLanguageSeedsByType("service").length, 1);
  assert.equal(getLoveLanguageSeedsByType("touch").length, 1);
});

test("keeps acts of service close to the supplied love-language template", () => {
  const service = findLoveLanguageSeedBySeed("acts_of_service");

  assertLoveLanguageSeedShape(service);
  assert.equal(service?.label, "Acts of Service");
  assert.equal(service?.loveLanguageType, "service");
  assert.match(service?.description ?? "", /helpful actions/);
  assert.equal(
    service?.emotionalMeaning,
    "I notice what burdens you, and I want to carry some of it with you.",
  );
  assert.equal(
    service?.hiddenNeed,
    "To feel useful, trusted, and allowed to care without being rejected.",
  );
  assert.match(service?.commonMisread ?? "", /overfunctioning/);
  assert.equal(service?.associatedWounds.includes("conditional_love_wound"), true);
  assert.equal(service?.associatedFears.includes("fear_of_being_useless"), true);
  assert.equal(service?.associatedDesires.includes("desire_to_be_needed"), true);
  assert.equal(service?.compatibleAttachmentStyles.includes("caretaker_attachment"), true);
  assert.equal(service?.compatibleDynamics.includes("soft_domestic_relationship"), true);
  assert.equal(service?.visibleBehaviors.includes("makes_tea"), true);
  assert.equal(service?.fulfillmentSignals.includes("effort_is_noticed"), true);
  assert.equal(service?.deprivationSignals.includes("feels_unneeded"), true);
  assert.equal(service?.conflictRisks.includes("help_becomes_control"), true);
  assert.equal(service?.repairStyles.includes("acts_of_service_repair"), true);
  assert.equal(service?.routeGates.includes("first_service_as_love_gate"), true);
  assert.equal(service?.metadata.category, "love_language");
  assert.equal(service?.metadata.healingValue, 10);
});

test("tracks wound, fear, and repair expansion routes into love languages", () => {
  assert.deepEqual(loveLanguageSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Attachment Style",
    "Relationship Dynamic",
    "Love Language",
    "Visible Behavior",
    "Trigger",
    "Response",
    "Conflict Beat",
    "Repair Style",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
  ]);
  assert.equal(
    loveLanguageExpansionLogic.wound_to_love_language.abandonment_wound.includes(
      "quality_time",
    ),
    true,
  );
  assert.equal(
    loveLanguageExpansionLogic.fear_to_love_language_need.fear_of_vulnerability.includes(
      "safe_silence",
    ),
    true,
  );
  assert.equal(
    loveLanguageExpansionLogic.love_language_to_repair_style.acts_of_service.includes(
      "acts_of_service_repair",
    ),
    true,
  );
});

test("keeps preset labels and love-language expansion references aligned", () => {
  const generatedLabels = new Set(LOVE_LANGUAGE_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(LOVE_LANGUAGE_SEEDS.map((seed) => seed.seed));
  const loveLanguageTargets = [
    ...Object.values(loveLanguageExpansionLogic.wound_to_love_language).flat(),
    ...Object.values(loveLanguageExpansionLogic.fear_to_love_language_need).flat(),
  ];
  const repairTargets = Object.values(
    loveLanguageExpansionLogic.love_language_to_repair_style,
  ).flat();

  for (const preset of loveLanguagePresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of loveLanguageTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(repairTargets.every((target) => target.length > 0), true);
  assert.equal(repairTargets.includes("verbal_reassurance_repair"), true);
  assert.equal(repairTargets.includes("promise_kept_beat"), true);
});

test("adapts love languages into standardized vocabulary seeds", () => {
  assert.equal(
    LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS.length,
    LOVE_LANGUAGE_SEEDS.length,
  );

  const standard = LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "acts_of_service",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Acts of Service");
  assert.match(standard.description, /Love language type: service/);
  assert.equal(standard.tags.includes("love_language"), true);
  assert.equal(standard.tags.includes("service"), true);
  assert.equal(standard.relatedSeeds.includes("conditional_love_wound"), true);
  assert.equal(standard.scenarioHooks.includes("first_service_as_love_gate"), true);
  assert.equal(standard.metadata.romanceValue, 9);
  assert.equal(standard.metadata.conflictPotential, 5);
});

test("bridges love language vocabulary into the semantic graph as love languages", () => {
  const node = findSemanticSeedGraphNodeById(
    "love-language-vocabulary:acts_of_service",
  );

  assert.ok(node);
  assert.equal(node.label, "Acts of Service");
  assert.equal(node.category, "love_languages");
  assert.equal(node.tags.includes("love-language-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "love-language-vocabulary:acts_of_service",
  ), true);
});

function assertLoveLanguageSeedShape(
  seed: LoveLanguageSeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_LOVE_LANGUAGE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "conflictPotential",
    "healingValue",
    "intimacyValue",
    "pacingPressure",
    "romanceValue",
  ]);
  assert.equal(seed.emotionalMeaning.length > 0, true);
  assert.equal(seed.hiddenNeed.length > 0, true);
  assert.equal(seed.commonMisread.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.compatibleAttachmentStyles.length > 0, true);
  assert.equal(seed.compatibleDynamics.length > 0, true);
  assert.equal(seed.visibleBehaviors.length > 0, true);
  assert.equal(seed.fulfillmentSignals.length > 0, true);
  assert.equal(seed.deprivationSignals.length > 0, true);
  assert.equal(seed.conflictRisks.length > 0, true);
  assert.equal(seed.repairStyles.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
}
