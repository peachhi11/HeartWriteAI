import assert from "node:assert/strict";
import test from "node:test";

import {
  TRIGGER_VOCABULARY_SEEDS,
  TRIGGER_VOCABULARY_STANDARD_SEEDS,
  findTriggerVocabularySeedBySeed,
  getTriggerVocabularySeedsByCategory,
  getTriggerVocabularySeedsByType,
  triggerCategories,
  triggerExpansionLogic,
  triggerSeedPresets,
} from "../../data/triggerVocabularyPresets";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";
import type { TriggerSeed } from "../../data/vocabularySeedTypes";

const EXPECTED_TRIGGER_SEED_KEYS = [
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
  "triggerType",
  "activatesWounds",
  "activatesFears",
  "activatesDesires",
  "likelyResponses",
  "emotionalMeaning",
  "misreadAs",
  "actualNeutralMeaning",
  "earlySigns",
  "escalationPath",
  "deescalationNeeds",
  "repairMethods",
  "growthArcs",
  "routeGates",
  "metadata",
].sort();

test("generates trigger vocabulary seeds across stable trigger categories", () => {
  assert.equal(triggerSeedPresets.length, 25);
  assert.equal(TRIGGER_VOCABULARY_SEEDS.length, 51);
  assert.equal(new Set(TRIGGER_VOCABULARY_SEEDS.map((seed) => seed.seed)).size, 51);
  assert.deepEqual(Object.keys(triggerCategories), [
    "attachment",
    "rejection",
    "betrayal",
    "shame",
    "control",
    "safety",
    "romantic",
    "sensory",
    "care",
    "vulnerability",
  ]);
  assert.equal(getTriggerVocabularySeedsByCategory("attachment").length, 6);
  assert.equal(getTriggerVocabularySeedsByCategory("romantic").length, 7);
  assert.equal(getTriggerVocabularySeedsByType("attachment").length, 6);
  assert.equal(getTriggerVocabularySeedsByType("safety").length, 10);
});

test("keeps unanswered message trigger close to the supplied semantic template", () => {
  const trigger = findTriggerVocabularySeedBySeed("unanswered_message_trigger");
  assertTriggerSeedShape(trigger);

  assert.equal(trigger?.label, "Unanswered Message Trigger");
  assert.equal(trigger?.triggerType, "attachment");
  assert.equal(trigger?.metadata.category, "trigger");
  assert.equal(trigger?.metadata.pacingPressure, "high");
  assert.equal(trigger?.activatesWounds.includes("abandonment_wound"), true);
  assert.equal(trigger?.activatesFears.includes("fear_of_abandonment"), true);
  assert.equal(trigger?.activatesDesires.includes("desire_for_reliable_love"), true);
  assert.equal(trigger?.likelyResponses.includes("reassurance_seeking_response"), true);
  assert.equal(trigger?.misreadAs.includes("emotional_exit"), true);
  assert.equal(trigger?.actualNeutralMeaning?.includes("phone_died"), true);
  assert.equal(trigger?.earlySigns.includes("drafts_then_deletes_reply"), true);
  assert.equal(trigger?.routeGates.includes("secure_return_gate"), true);
});

test("tracks wound, fear, and trigger expansion routes into response seeds", () => {
  assert.deepEqual(triggerExpansionLogic.wound_to_trigger.abandonment_wound, [
    "unanswered_message_trigger",
    "goodbye_trigger",
    "temporary_separation_trigger",
  ]);
  assert.equal(
    triggerExpansionLogic.fear_to_trigger.fear_of_replacement.includes(
      "being_compared_trigger",
    ),
    true,
  );
  assert.deepEqual(triggerExpansionLogic.trigger_to_response.unanswered_message_trigger, [
    "panic_spiral_response",
    "reassurance_seeking_response",
    "preemptive_withdrawal_response",
  ]);
  assert.equal(
    triggerExpansionLogic.trigger_to_response.receiving_care_trigger.includes(
      "softening_response",
    ),
    true,
  );
});

test("adapts trigger seeds into standardized vocabulary seeds", () => {
  assert.equal(TRIGGER_VOCABULARY_STANDARD_SEEDS.length, TRIGGER_VOCABULARY_SEEDS.length);

  const standard = TRIGGER_VOCABULARY_STANDARD_SEEDS.find(
    (seed) => seed.seed === "unanswered_message_trigger",
  );

  assert.ok(standard);
  assert.equal(standard.label, "Unanswered Message Trigger");
  assert.match(standard.description, /Emotional meaning:/);
  assert.equal(standard.tags.includes("trigger"), true);
  assert.equal(standard.tags.includes("attachment"), true);
  assert.equal(standard.relatedSeeds.includes("fear_of_abandonment"), true);
  assert.equal(standard.relatedSeeds.includes("reassurance_seeking_response"), true);
  assert.equal(standard.scenarioHooks.includes("secure_return_gate"), true);
  assert.equal(standard.metadata.conflictPotential, 8);
});

test("bridges trigger vocabulary into the semantic graph", () => {
  const node = findSemanticSeedGraphNodeById(
    "trigger-vocabulary:unanswered_message_trigger",
  );

  assert.ok(node);
  assert.equal(node.label, "Unanswered Message Trigger");
  assert.equal(node.category, "triggers");
  assert.equal(node.tags.includes("trigger-vocabulary"), true);
  assert.equal(node.sourceRegistryKeys?.includes(
    "trigger-vocabulary:unanswered_message_trigger",
  ), true);
});

function assertTriggerSeedShape(seed: TriggerSeed | undefined) {
  assert.ok(seed);
  assert.deepEqual(Object.keys(seed).sort(), EXPECTED_TRIGGER_SEED_KEYS);
  assert.deepEqual(Object.keys(seed.metadata).sort(), [
    "angstValue",
    "category",
    "conflictPotential",
    "healingValue",
    "intensity",
    "pacingPressure",
    "romanceValue",
  ]);
  assert.equal(seed.emotionalMeaning.length > 0, true);
  assert.equal(seed.activatesWounds.length > 0, true);
  assert.equal(seed.activatesFears.length > 0, true);
  assert.equal(seed.activatesDesires.length > 0, true);
  assert.equal(seed.likelyResponses.length > 0, true);
  assert.equal(seed.earlySigns.length > 0, true);
  assert.equal(seed.escalationPath.length > 0, true);
  assert.equal(seed.deescalationNeeds.length > 0, true);
  assert.equal(seed.repairMethods.length > 0, true);
  assert.equal(seed.growthArcs.length > 0, true);
  assert.equal(seed.routeGates.length > 0, true);
  assert.equal(seed.metadata.category, "trigger");
}
