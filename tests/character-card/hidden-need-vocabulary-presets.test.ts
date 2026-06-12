import assert from "node:assert/strict";
import test from "node:test";

import {
  HIDDEN_NEED_SEEDS,
  HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS,
  findHiddenNeedSeedBySeed,
  getHiddenNeedSeedsByCategory,
  getHiddenNeedSeedsByType,
  hiddenNeedCategories,
  hiddenNeedExpansionLogic,
  hiddenNeedPresets,
  hiddenNeedSemanticChain,
} from "../../data/hiddenNeedVocabularyPresets";
import {
  expectSemanticRegistryToPassQc,
  type SemanticSeedNode,
} from "../../data/semanticExpansionQc";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { HiddenNeedSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_HIDDEN_NEED_SEED_KEYS = [
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
  "needType",
  "masksAs",
  "createdByWounds",
  "drivenByFears",
  "expressedAsDesires",
  "activatedByTriggers",
  "commonResponses",
  "loveLanguages",
  "compatibleRepairStyles",
  "growthArcs",
  "unmetConsequences",
  "fulfillmentSignals",
  "routeGates",
  "milestoneMemories",
  "metadata",
].sort();

test("generates hidden need seeds across stable categories", () => {
  assert.equal(hiddenNeedPresets.length, 20);
  assert.equal(HIDDEN_NEED_SEEDS.length, 20);
  assert.equal(new Set(HIDDEN_NEED_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.deepEqual(Object.keys(hiddenNeedCategories), [
    "safety",
    "attachment",
    "belonging",
    "recognition",
    "autonomy",
    "boundaries",
    "rest",
    "truth",
    "repair",
    "touch",
    "validation",
    "mutuality",
    "acceptance",
  ]);
  assert.equal(getHiddenNeedSeedsByCategory("attachment").length, 3);
  assert.equal(getHiddenNeedSeedsByCategory("recognition").length, 4);
  assert.equal(getHiddenNeedSeedsByType("touch").length, 1);
  assert.equal(getHiddenNeedSeedsByType("validation").length, 2);
});

test("keeps need for reassurance close to the supplied hidden-need template", () => {
  const reassurance = findHiddenNeedSeedBySeed("need_for_reassurance");

  assertHiddenNeedSeedShape(reassurance);
  assert.equal(reassurance?.label, "Need for Reassurance");
  assert.equal(reassurance?.needType, "attachment");
  assert.match(reassurance?.description ?? "", /clear emotional confirmation/);
  assert.equal(
    reassurance?.dialoguePatterns.includes("I know it sounds small, but I need to hear it."),
    true,
  );
  assert.equal(reassurance?.masksAs.includes("testing_love"), true);
  assert.equal(reassurance?.createdByWounds.includes("abandonment_wound"), true);
  assert.equal(reassurance?.drivenByFears.includes("fear_of_abandonment"), true);
  assert.equal(reassurance?.expressedAsDesires.includes("desire_for_reliable_love"), true);
  assert.equal(reassurance?.activatedByTriggers.includes("unanswered_message_trigger"), true);
  assert.equal(reassurance?.commonResponses.includes("panic_spiral_response"), true);
  assert.equal(reassurance?.loveLanguages.includes("shared_rituals"), true);
  assert.equal(reassurance?.compatibleRepairStyles.includes("return_and_stay_repair"), true);
  assert.equal(reassurance?.unmetConsequences.includes("attachment_damage_consequence"), true);
  assert.equal(reassurance?.metadata.category, "hidden_need");
  assert.equal(reassurance?.metadata.urgency, "core");
});

test("tracks the hidden need semantic chain and expansion routes", () => {
  assert.deepEqual(hiddenNeedSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Hidden Need",
    "Trigger",
    "Response",
    "Relationship Dynamic",
    "Love Language",
    "Conflict Beat",
    "Repair Style",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
  ]);
  assert.equal(
    hiddenNeedExpansionLogic.wound_to_hidden_need.abandonment_wound.includes(
      "need_for_reassurance",
    ),
    true,
  );
  assert.equal(
    hiddenNeedExpansionLogic.hidden_need_to_desire.need_to_be_chosen.includes(
      "desire_to_be_chosen",
    ),
    true,
  );
  assert.equal(
    hiddenNeedExpansionLogic.hidden_need_to_repair_style
      .need_for_emotional_presence.includes("presence_based_repair"),
    true,
  );
});

test("keeps preset labels and hidden need expansion references aligned", () => {
  const generatedLabels = new Set(HIDDEN_NEED_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(HIDDEN_NEED_SEEDS.map((seed) => seed.seed));
  const hiddenNeedTargets = Object.values(
    hiddenNeedExpansionLogic.wound_to_hidden_need,
  ).flat();
  const desireTargets = Object.values(
    hiddenNeedExpansionLogic.hidden_need_to_desire,
  ).flat();
  const repairTargets = Object.values(
    hiddenNeedExpansionLogic.hidden_need_to_repair_style,
  ).flat();

  for (const preset of hiddenNeedPresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of hiddenNeedTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(desireTargets.includes("desire_to_be_chosen"), true);
  assert.equal(repairTargets.includes("verbal_reassurance_repair"), true);
});

test("adapts hidden needs into standardized vocabulary seeds", () => {
  assert.equal(
    HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS.length,
    HIDDEN_NEED_SEEDS.length,
  );

  const standard = HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "need_for_reassurance",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Need for Reassurance");
  assert.match(standard.description, /Hidden need type: attachment/);
  assert.equal(standard.tags.includes("hidden_need"), true);
  assert.equal(standard.tags.includes("attachment"), true);
  assert.equal(standard.relatedSeeds.includes("abandonment_wound"), true);
  assert.equal(standard.scenarioHooks.includes("first_reassurance_gate"), true);
  assert.equal(standard.metadata.romanceValue, 10);
  assert.equal(standard.metadata.conflictPotential, 8);
});

test("hidden need standardized seeds pass semantic expansion QC without errors", () => {
  const registry = HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS.map(
    (seed): SemanticSeedNode => ({
      seed: seed.seed,
      label: seed.label,
      category: "hidden_need",
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

test("bridges hidden need vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "hidden-need-vocabulary:need_for_reassurance",
  );

  assert.ok(node);
  assert.equal(node.label, "Need for Reassurance");
  assert.equal(node.category, "hidden_needs");
  assert.equal(node.tags.includes("hidden-need-vocabulary"), true);
  assert.equal(
    node.sourceRegistryKeys?.includes(
      "hidden-need-vocabulary:need_for_reassurance",
    ),
    true,
  );
});

function assertHiddenNeedSeedShape(
  seed: HiddenNeedSeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_HIDDEN_NEED_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "category",
    "conflictPotential",
    "healingValue",
    "pacingPressure",
    "romanceValue",
    "urgency",
  ]);
  assert.equal(seed.masksAs.length > 0, true);
  assert.equal(seed.createdByWounds.length > 0, true);
  assert.equal(seed.drivenByFears.length > 0, true);
  assert.equal(seed.expressedAsDesires.length > 0, true);
  assert.equal(seed.activatedByTriggers.length > 0, true);
  assert.equal(seed.commonResponses.length > 0, true);
  assert.equal(seed.loveLanguages.length > 0, true);
  assert.equal(seed.compatibleRepairStyles.length > 0, true);
}
