import assert from "node:assert/strict";
import test from "node:test";

import {
  ATTACHMENT_STYLE_SEEDS,
  ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS,
  attachmentStyleCategories,
  attachmentStyleExpansionLogic,
  attachmentStylePresets,
  attachmentStyleSemanticChain,
  findAttachmentStyleSeedBySeed,
  getAttachmentStyleSeedsByCategory,
  getAttachmentStyleSeedsByType,
} from "../../data/attachmentStyleVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { AttachmentStyleSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_ATTACHMENT_STYLE_SEED_KEYS = [
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
  "attachmentType",
  "coreBelief",
  "coreFear",
  "coreDesire",
  "associatedWounds",
  "associatedFears",
  "associatedDesires",
  "commonTriggers",
  "commonResponses",
  "intimacyPattern",
  "conflictPattern",
  "repairNeeds",
  "compatibleRepairStyles",
  "healthyVersion",
  "unhealthyVersion",
  "growthArcs",
  "routeGates",
  "metadata",
].sort();

test("generates attachment style seeds across stable categories", () => {
  assert.equal(attachmentStylePresets.length, 20);
  assert.equal(ATTACHMENT_STYLE_SEEDS.length, 20);
  assert.equal(new Set(ATTACHMENT_STYLE_SEEDS.map((seed) => seed.seed)).size, 20);
  assert.deepEqual(Object.keys(attachmentStyleCategories), [
    "secure",
    "anxious",
    "avoidant",
    "fearful_avoidant",
    "disorganized",
    "earned_secure",
    "caretaker",
    "devotional",
    "protective",
    "healing",
  ]);
  assert.equal(getAttachmentStyleSeedsByCategory("anxious").length, 4);
  assert.equal(getAttachmentStyleSeedsByCategory("avoidant").length, 5);
  assert.equal(getAttachmentStyleSeedsByType("secure").length, 1);
  assert.equal(getAttachmentStyleSeedsByType("healing").length, 2);
});

test("keeps anxious attachment close to the supplied attachment template", () => {
  const anxious = findAttachmentStyleSeedBySeed("anxious_attachment");

  assertAttachmentStyleSeedShape(anxious);
  assert.equal(anxious?.label, "Anxious Attachment");
  assert.equal(anxious?.attachmentType, "anxious");
  assert.match(anxious?.description ?? "", /fear of abandonment/);
  assert.equal(anxious?.coreBelief, "Love can disappear if they are not constantly attentive to it.");
  assert.equal(anxious?.coreFear, "Being abandoned, replaced, forgotten, or emotionally deprioritized.");
  assert.equal(anxious?.coreDesire, "Reliable love, clear reassurance, and emotional permanence.");
  assert.equal(anxious?.associatedWounds.includes("abandonment_wound"), true);
  assert.equal(anxious?.associatedFears.includes("fear_of_abandonment"), true);
  assert.equal(anxious?.associatedDesires.includes("desire_to_be_chosen"), true);
  assert.equal(anxious?.commonTriggers.includes("unanswered_message_trigger"), true);
  assert.equal(anxious?.commonResponses.includes("panic_spiral_response"), true);
  assert.equal(anxious?.conflictPattern.includes("pursuer_conflict_style"), true);
  assert.equal(anxious?.repairNeeds.includes("verbal_reassurance"), true);
  assert.equal(anxious?.compatibleRepairStyles.includes("return_and_stay_repair"), true);
  assert.equal(anxious?.metadata.category, "attachment_style");
  assert.equal(anxious?.metadata.securityLevel, "low");
  assert.equal(anxious?.metadata.angstValue, 10);
});

test("tracks wound, fear, conflict, and repair expansion routes", () => {
  assert.deepEqual(attachmentStyleSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Attachment Style",
    "Relationship Dynamic",
    "Conflict Style",
    "Repair Style",
    "Growth Arc",
    "Relationship Identity",
  ]);
  assert.equal(
    attachmentStyleExpansionLogic.wound_to_attachment_style.abandonment_wound.includes(
      "anxious_attachment",
    ),
    true,
  );
  assert.equal(
    attachmentStyleExpansionLogic.fear_to_attachment_style.fear_of_dependency.includes(
      "hyper_independent_attachment",
    ),
    true,
  );
  assert.equal(
    attachmentStyleExpansionLogic.attachment_style_to_conflict_style.secure_attachment.includes(
      "repair_oriented_conflict_style",
    ),
    true,
  );
  assert.equal(
    attachmentStyleExpansionLogic.attachment_style_to_repair_style.avoidant_attachment.includes(
      "space_based_repair",
    ),
    true,
  );
});

test("keeps preset labels and expansion references aligned with generated seeds", () => {
  const generatedLabels = new Set(ATTACHMENT_STYLE_SEEDS.map((seed) => seed.label));
  const generatedSeedIds = new Set(ATTACHMENT_STYLE_SEEDS.map((seed) => seed.seed));
  const attachmentExpansionTargets = [
    ...Object.values(attachmentStyleExpansionLogic.wound_to_attachment_style).flat(),
    ...Object.values(attachmentStyleExpansionLogic.fear_to_attachment_style).flat(),
  ];
  const crossCategoryTargets = [
    ...Object.values(attachmentStyleExpansionLogic.attachment_style_to_conflict_style).flat(),
    ...Object.values(attachmentStyleExpansionLogic.attachment_style_to_repair_style).flat(),
  ];

  for (const preset of attachmentStylePresets) {
    assert.equal(generatedLabels.has(preset), true, `${preset} should be generated`);
  }
  for (const target of attachmentExpansionTargets) {
    assert.equal(generatedSeedIds.has(target), true, `${target} should resolve`);
  }
  assert.equal(crossCategoryTargets.every((target) => target.length > 0), true);
  assert.equal(crossCategoryTargets.includes("pursuer_conflict_style"), true);
  assert.equal(crossCategoryTargets.includes("space_based_repair"), true);
});

test("adapts attachment styles into standardized vocabulary seeds", () => {
  assert.equal(
    ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS.length,
    ATTACHMENT_STYLE_SEEDS.length,
  );

  const standard = ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "anxious_attachment",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Anxious Attachment");
  assert.match(standard.description, /Attachment type: anxious/);
  assert.equal(standard.tags.includes("attachment_style"), true);
  assert.equal(standard.tags.includes("anxious"), true);
  assert.equal(standard.relatedSeeds.includes("abandonment_wound"), true);
  assert.equal(standard.scenarioHooks.includes("first_reassurance_gate"), true);
  assert.equal(standard.metadata.romanceValue, 9);
  assert.equal(standard.metadata.conflictPotential, 9);
});

test("bridges attachment style vocabulary into the semantic graph as attachment styles", () => {
  const node = findSemanticSeedGraphNodeById(
    "attachment-style-vocabulary:anxious_attachment",
  );

  assert.ok(node);
  assert.equal(node.label, "Anxious Attachment");
  assert.equal(node.category, "attachment_styles");
  assert.equal(node.tags.includes("attachment-style-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "attachment-style-vocabulary:anxious_attachment",
  ), true);
});

function assertAttachmentStyleSeedShape(
  seed: AttachmentStyleSeed | undefined,
) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_ATTACHMENT_STYLE_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "conflictPotential",
    "healingValue",
    "romanceValue",
    "securityLevel",
  ]);
  assert.equal(seed.coreBelief.length > 0, true);
  assert.equal(seed.coreFear.length > 0, true);
  assert.equal(seed.coreDesire.length > 0, true);
  assert.equal(seed.associatedWounds.length > 0, true);
  assert.equal(seed.associatedFears.length > 0, true);
  assert.equal(seed.associatedDesires.length > 0, true);
  assert.equal(seed.commonTriggers.length > 0, true);
  assert.equal(seed.commonResponses.length > 0, true);
  assert.equal(seed.intimacyPattern.length > 0, true);
  assert.equal(seed.conflictPattern.length > 0, true);
  assert.equal(seed.repairNeeds.length > 0, true);
  assert.equal(seed.compatibleRepairStyles.length > 0, true);
  assert.equal(seed.healthyVersion.length > 0, true);
  assert.equal(seed.unhealthyVersion.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
}
