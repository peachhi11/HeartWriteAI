import assert from "node:assert/strict";
import test from "node:test";

import {
  EMOTIONAL_MEANING_SEEDS,
  EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS,
  emotionalMeaningCategories,
  emotionalMeaningExpansionLogic,
  emotionalMeaningPresets,
  emotionalMeaningSemanticChain,
  findEmotionalMeaningSeedBySeed,
  getEmotionalMeaningSeedsByCategory,
  getEmotionalMeaningSeedsByType,
} from "../../data/emotionalMeaningVocabularyPresets";
import {
  expectSemanticRegistryToPassQc,
  type SemanticSeedNode,
} from "../../data/semanticExpansionQc";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { EmotionalMeaningSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_EMOTIONAL_MEANING_SEED_KEYS = [
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
  "meaningType",
  "expressedThrough",
  "oftenMisreadAs",
  "hiddenNeedMet",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "compatibleLoveLanguages",
  "compatibleVisibleBehaviors",
  "triggerWhenAbsent",
  "likelyResponsesWhenAbsent",
  "repairStyles",
  "growthArcs",
  "payoffFantasies",
  "relationshipIdentities",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates emotional meaning seeds across stable categories", () => {
  assert.equal(emotionalMeaningPresets.length, 20);
  assert.equal(EMOTIONAL_MEANING_SEEDS.length, 20);
  assert.equal(
    new Set(EMOTIONAL_MEANING_SEEDS.map((seed) => seed.seed)).size,
    20,
  );
  assert.deepEqual(Object.keys(emotionalMeaningCategories), [
    "attention",
    "safety",
    "choice",
    "reassurance",
    "devotion",
    "care",
    "respect",
    "validation",
    "belonging",
    "repair",
    "presence",
    "home",
  ]);
  assert.equal(getEmotionalMeaningSeedsByCategory("attention").length, 3);
  assert.equal(getEmotionalMeaningSeedsByCategory("care").length, 3);
  assert.equal(getEmotionalMeaningSeedsByType("reassurance").length, 2);
  assert.equal(getEmotionalMeaningSeedsByType("validation").length, 3);
});

test("keeps I Notice You close to the supplied emotional-meaning template", () => {
  const notice = findEmotionalMeaningSeedBySeed("i_notice_you");

  assertEmotionalMeaningSeedShape(notice);
  assert.equal(notice?.label, "I Notice You");
  assert.equal(notice?.meaningType, "attention");
  assert.match(notice?.description ?? "", /paying attention to small needs/);
  assert.equal(
    notice?.dialoguePatterns.includes("I noticed."),
    true,
  );
  assert.equal(notice?.hiddenNeedMet.includes("need_to_be_seen"), true);
  assert.equal(
    notice?.compatibleVisibleBehaviors.includes("makes_tea_when_worried"),
    true,
  );
  assert.equal(notice?.associatedWounds.includes("emotional_neglect_wound"), true);
  assert.equal(notice?.associatedFears.includes("fear_of_not_mattering"), true);
  assert.equal(notice?.associatedDesires.includes("desire_to_be_seen"), true);
  assert.equal(notice?.repairStyles.includes("acts_of_service_repair"), true);
  assert.equal(notice?.payoffFantasies.includes("seen_and_still_loved"), true);
  assert.equal(notice?.metadata.category, "emotional_meaning");
  assert.equal(notice?.metadata.subtlety, "high");
});

test("tracks the emotional meaning semantic chain and expansion routes", () => {
  assert.deepEqual(emotionalMeaningSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Hidden Need",
    "Visible Behavior",
    "Emotional Meaning",
    "Misread Meaning",
    "Trigger",
    "Response",
    "Conflict Beat",
    "Repair Style",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
  ]);
  assert.equal(
    emotionalMeaningExpansionLogic.visible_behavior_to_emotional_meaning
      .makes_tea_when_worried.includes("i_notice_you"),
    true,
  );
  assert.equal(
    emotionalMeaningExpansionLogic.wound_to_emotional_meaning_need
      .abandonment_wound.includes("i_am_not_leaving"),
    true,
  );
  assert.equal(
    emotionalMeaningExpansionLogic.emotional_meaning_to_repair_style
      .i_am_not_leaving.includes("verbal_reassurance_repair"),
    true,
  );
});

test("keeps preset labels and emotional meaning expansion references aligned", () => {
  const generatedLabels = new Set(EMOTIONAL_MEANING_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(EMOTIONAL_MEANING_SEEDS.map((seed) => seed.seed));
  const emotionalMeaningTargets = [
    ...Object.values(
      emotionalMeaningExpansionLogic.visible_behavior_to_emotional_meaning,
    ).flat(),
    ...Object.values(
      emotionalMeaningExpansionLogic.wound_to_emotional_meaning_need,
    ).flat(),
  ];
  const repairTargets = Object.values(
    emotionalMeaningExpansionLogic.emotional_meaning_to_repair_style,
  ).flat();

  for (const preset of emotionalMeaningPresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of emotionalMeaningTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(repairTargets.every((target) => target.length > 0), true);
  assert.equal(repairTargets.includes("presence_based_repair"), true);
});

test("adapts emotional meanings into standardized vocabulary seeds", () => {
  assert.equal(
    EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS.length,
    EMOTIONAL_MEANING_SEEDS.length,
  );

  const standard = EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "i_notice_you",
  );

  assert.ok(standard);
  assert.equal(standard.label, "I Notice You");
  assert.match(standard.description, /Emotional meaning type: attention/);
  assert.equal(standard.tags.includes("emotional_meaning"), true);
  assert.equal(standard.tags.includes("attention"), true);
  assert.equal(standard.relatedSeeds.includes("need_to_be_seen"), true);
  assert.equal(standard.relatedSeeds.includes("makes_tea_when_worried"), true);
  assert.equal(standard.scenarioHooks.includes("first_noticed_gate"), true);
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 4);
});

test("emotional meaning standardized seeds pass semantic expansion QC without errors", () => {
  const registry = EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS.map(
    (seed): SemanticSeedNode => ({
      seed: seed.seed,
      label: seed.label,
      category: "emotional_meaning",
      relatedSeeds: seed.relatedSeeds,
      oppositeSeeds: seed.oppositeSeeds,
      commonTriggers: seed.scenarioHooks,
      growthArcs: seed.romanceHooks,
      metadata: {
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  );
  const issues = expectSemanticRegistryToPassQc(registry);

  assert.equal(issues.every((issue) => issue.severity === "warning"), true);
});

test("bridges emotional meaning vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "emotional-meaning-vocabulary:i_notice_you",
  );

  assert.ok(node);
  assert.equal(node.label, "I Notice You");
  assert.equal(node.category, "emotional_meanings");
  assert.equal(node.tags.includes("emotional-meaning-vocabulary"), true);
  assert.equal(
    node.sourceRegistryKeys?.includes("emotional-meaning-vocabulary:i_notice_you"),
    true,
  );
});

function assertEmotionalMeaningSeedShape(
  seed: EmotionalMeaningSeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_EMOTIONAL_MEANING_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "conflictPotential",
    "healingValue",
    "intimacyValue",
    "romanceValue",
    "subtlety",
  ]);
  assert.equal(seed.expressedThrough.length > 0, true);
  assert.equal(seed.oftenMisreadAs.length > 0, true);
  assert.equal(seed.hiddenNeedMet.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.compatibleLoveLanguages.length > 0, true);
  assert.equal(seed.compatibleVisibleBehaviors.length > 0, true);
  assert.equal(seed.repairStyles.length > 0, true);
}
