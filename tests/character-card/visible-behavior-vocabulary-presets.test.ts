import assert from "node:assert/strict";
import test from "node:test";

import {
  VISIBLE_BEHAVIOR_SEEDS,
  VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS,
  findVisibleBehaviorSeedBySeed,
  getVisibleBehaviorSeedsByCategory,
  getVisibleBehaviorSeedsByType,
  visibleBehaviorCategories,
  visibleBehaviorExpansionLogic,
  visibleBehaviorPresets,
  visibleBehaviorSemanticChain,
} from "../../data/visibleBehaviorVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { VisibleBehaviorSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_VISIBLE_BEHAVIOR_SEED_KEYS = [
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
  "behaviorType",
  "emotionalMeaning",
  "hiddenMotivation",
  "loveLanguageSource",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "associatedDynamics",
  "activatedBy",
  "fulfillmentSignals",
  "misreadRisks",
  "conflictRisks",
  "repairStyles",
  "growthArcs",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates visible behavior seeds across stable categories", () => {
  assert.equal(visibleBehaviorPresets.length, 30);
  assert.equal(VISIBLE_BEHAVIOR_SEEDS.length, 30);
  assert.equal(new Set(VISIBLE_BEHAVIOR_SEEDS.map((seed) => seed.seed)).size, 30);
  assert.deepEqual(Object.keys(visibleBehaviorCategories), [
    "domestic",
    "protective",
    "caretaking",
    "practical",
    "ritual",
    "reassurance",
    "devotional",
    "attention",
    "touch",
    "communication",
    "repair",
    "public_loyalty",
  ]);
  assert.equal(getVisibleBehaviorSeedsByCategory("domestic").length, 4);
  assert.equal(getVisibleBehaviorSeedsByCategory("communication").length, 3);
  assert.equal(getVisibleBehaviorSeedsByType("public_loyalty").length, 1);
  assert.equal(getVisibleBehaviorSeedsByType("touch").length, 2);
});

test("keeps makes tea when worried close to the supplied visible-behavior template", () => {
  const tea = findVisibleBehaviorSeedBySeed("makes_tea_when_worried");

  assertVisibleBehaviorSeedShape(tea);
  assert.equal(tea?.label, "Makes Tea When Worried");
  assert.equal(tea?.behaviorType, "domestic");
  assert.match(tea?.description ?? "", /warm drink/);
  assert.equal(
    tea?.dialoguePatterns.includes(
      "I needed something to do with my hands that was not reaching for you.",
    ),
    true,
  );
  assert.equal(tea?.loveLanguageSource.includes("acts_of_service"), true);
  assert.equal(tea?.associatedWounds.includes("emotional_neglect_wound"), true);
  assert.equal(tea?.associatedFears.includes("fear_of_vulnerability"), true);
  assert.equal(tea?.associatedDesires.includes("desire_to_be_noticed"), true);
  assert.equal(tea?.associatedDynamics.includes("soft_domestic_relationship"), true);
  assert.equal(tea?.activatedBy.includes("post_conflict_distance"), true);
  assert.equal(tea?.repairStyles.includes("acts_of_service_repair"), true);
  assert.equal(tea?.routeGates.includes("tea_after_argument_gate"), true);
  assert.equal(tea?.metadata.category, "visible_behavior");
  assert.equal(tea?.metadata.repeatability, "ritual");
});

test("tracks the visible behavior semantic chain and expansion routes", () => {
  assert.deepEqual(visibleBehaviorSemanticChain, [
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
    visibleBehaviorExpansionLogic.love_language_to_visible_behavior
      .acts_of_service.includes("makes_tea_when_worried"),
    true,
  );
  assert.equal(
    visibleBehaviorExpansionLogic.wound_to_visible_behavior
      .abandonment_wound.includes("sends_goodnight_text"),
    true,
  );
  assert.equal(
    visibleBehaviorExpansionLogic.visible_behavior_to_repair_style
      .sits_beside_them_in_silence.includes("holding_space_repair"),
    true,
  );
});

test("keeps preset labels and visible behavior expansion references aligned", () => {
  const generatedLabels = new Set(VISIBLE_BEHAVIOR_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(VISIBLE_BEHAVIOR_SEEDS.map((seed) => seed.seed));
  const visibleBehaviorTargets = [
    ...Object.values(
      visibleBehaviorExpansionLogic.love_language_to_visible_behavior,
    ).flat(),
    ...Object.values(
      visibleBehaviorExpansionLogic.wound_to_visible_behavior,
    ).flat(),
  ];
  const repairTargets = Object.values(
    visibleBehaviorExpansionLogic.visible_behavior_to_repair_style,
  ).flat();

  for (const preset of visibleBehaviorPresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of visibleBehaviorTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(repairTargets.every((target) => target.length > 0), true);
  assert.equal(repairTargets.includes("acts_of_service_repair"), true);
});

test("adapts visible behaviors into standardized vocabulary seeds", () => {
  assert.equal(
    VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS.length,
    VISIBLE_BEHAVIOR_SEEDS.length,
  );

  const standard = VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "makes_tea_when_worried",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Makes Tea When Worried");
  assert.match(standard.description, /Visible behavior type: domestic/);
  assert.equal(standard.tags.includes("visible_behavior"), true);
  assert.equal(standard.tags.includes("domestic"), true);
  assert.equal(standard.relatedSeeds.includes("acts_of_service"), true);
  assert.equal(standard.scenarioHooks.includes("tea_after_argument_gate"), true);
  assert.equal(standard.metadata.romanceValue, 9);
  assert.equal(standard.metadata.conflictPotential, 3);
});

test("bridges visible behavior vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "visible-behavior-vocabulary:makes_tea_when_worried",
  );

  assert.ok(node);
  assert.equal(node.label, "Makes Tea When Worried");
  assert.equal(node.category, "visible_behaviors");
  assert.equal(node.tags.includes("visible-behavior-vocabulary"), true);
  assert.equal(
    node.sourceRegistryKeys?.includes(
      "visible-behavior-vocabulary:makes_tea_when_worried",
    ),
    true,
  );
});

function assertVisibleBehaviorSeedShape(
  seed: VisibleBehaviorSeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_VISIBLE_BEHAVIOR_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "conflictPotential",
    "healingValue",
    "intimacyValue",
    "repeatability",
    "romanceValue",
    "subtlety",
  ]);
  assert.equal(seed.emotionalMeaning.length > 0, true);
  assert.equal(seed.hiddenMotivation.length > 0, true);
  assert.equal(seed.loveLanguageSource.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.activatedBy.length > 0, true);
  assert.equal(seed.repairStyles.length > 0, true);
}
