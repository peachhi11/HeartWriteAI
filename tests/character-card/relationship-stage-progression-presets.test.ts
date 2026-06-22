import assert from "node:assert/strict";
import test from "node:test";

import {
  RELATIONSHIP_STAGE_PROGRESSION_VOCABULARY_STANDARD_SEEDS,
  evaluateRelationshipStageTransition,
  relationshipStageProgressionCategories,
  relationshipStageProgressionLifecycleMap,
  relationshipStageProgressionPresets,
  relationshipStageProgressionSemanticChain,
  relationshipStageProgressionStates,
  relationshipStageProgressionTransitionMap,
  relationshipStageEngineSystemNote,
  relationshipStageEngineVariables,
  relationshipStageGuardClauses,
  relationshipStageTransitionRules,
  relationshipStageWorldEventGates,
} from "../../data/relationshipStageProgressionPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines every relationship state-machine preset by trajectory", () => {
  assert.equal(relationshipStageProgressionStates.length, 21);
  assert.equal(relationshipStageProgressionPresets.length, 21);
  assert.deepEqual(relationshipStageProgressionSemanticChain, [
    "Wound",
    "Fear",
    "Desire",
    "Trigger",
    "Response",
    "Relationship Dynamic",
    "Romance Trope",
    "Stage Progression State",
    "Conflict Beat",
    "Repair Beat",
    "Growth Arc",
    "Payoff Fantasy",
    "Relationship Identity",
  ]);
  assert.equal(relationshipStageProgressionCategories.ascent.length, 8);
  assert.equal(relationshipStageProgressionCategories.rivalry.length, 5);
  assert.equal(relationshipStageProgressionCategories.limbo.length, 4);
  assert.equal(relationshipStageProgressionCategories.descent.length, 4);
  assert.equal(relationshipStageProgressionCategories.ascent[0], "strangers");
  assert.equal(relationshipStageProgressionCategories.descent.at(-1), "toxic_loop");
});

test("keeps stage transition and lifecycle routing explicit", () => {
  assert.deepEqual(relationshipStageProgressionTransitionMap.strangers, [
    "acquaintances",
    "active_adversaries",
  ]);
  assert.deepEqual(relationshipStageProgressionTransitionMap.situationship, [
    "confessed_affection",
    "toxic_loop",
    "estranged",
  ]);
  assert.deepEqual(relationshipStageProgressionTransitionMap.betrayed, [
    "estranged",
    "toxic_loop",
    "repair",
  ]);
  assert.equal(relationshipStageProgressionLifecycleMap.strangers, "potential");
  assert.equal(relationshipStageProgressionLifecycleMap.mutual_longing, "pursuit");
  assert.equal(relationshipStageProgressionLifecycleMap.betrayed, "fracture");
  assert.equal(relationshipStageProgressionLifecycleMap.toxic_loop, "instability");
});

test("projects stage states into standard vocabulary seed shape", () => {
  const vocabularySeeds = getRichStandardVocabularySeedsBySource(
    "relationship-stage-progression-vocabulary",
  );
  const situationship = vocabularySeeds.find((seed) => seed.seed === "situationship");
  const betrayed = vocabularySeeds.find((seed) => seed.seed === "betrayed");

  assert.equal(
    vocabularySeeds.length,
    RELATIONSHIP_STAGE_PROGRESSION_VOCABULARY_STANDARD_SEEDS.length,
  );
  assert.equal(situationship?.label, "Situationship");
  assert.equal(situationship?.tags.includes("trajectory:limbo"), true);
  assert.equal(situationship?.tags.includes("stalled_commitment"), true);
  assert.equal(situationship?.oppositeSeeds.includes("commitment_without_conversation"), true);
  assert.equal(betrayed?.metadata.conflictPotential, 9);
  assert.equal(betrayed?.tags.includes("lifecycle:fracture"), true);
});

test("makes stage states searchable and graph-readable", () => {
  const limboResults = searchStandardVocabularySeeds("stalled commitment", {
    sourceIds: ["relationship-stage-progression-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "relationship-stage-progression-vocabulary:mutual_longing",
  );

  assert.equal(limboResults[0]?.label, "Situationship");
  assert.equal(graphNode?.category, "routes");
  assert.equal(graphNode?.label, "Mutual Longing");
  assert.equal(
    graphNode?.tags.includes("relationship-stage-progression-vocabulary"),
    true,
  );
});

test("defines transition engine variables, event gates, and guard clauses", () => {
  assert.deepEqual(relationshipStageEngineVariables, [
    "Affection",
    "Trust",
    "Romantic_Tension",
    "Respect",
    "Physical_Attraction",
    "Chat_Turns",
    "Current_Stage",
  ]);
  assert.deepEqual(relationshipStageWorldEventGates, {
    gateFirstCrisis: false,
    gateSharedSecret: false,
    gateTheSeparation: false,
    gateMajorSacrifice: false,
  });
  assert.equal(
    relationshipStageGuardClauses.some((clause) =>
      clause.includes("cannot skip adjacent stages"),
    ),
    true,
  );
  assert.equal(
    relationshipStageEngineSystemNote.some((line) =>
      line.includes("Numbers only determine readiness"),
    ),
    true,
  );
  assert.equal(
    relationshipStageTransitionRules.some((rule) =>
      rule.id === "mutual_longing_to_intimate_partners_event_gate" &&
      rule.eventGate === "gateMajorSacrifice",
    ),
    true,
  );
});

test("uses soft buffers, action triggers, and event gates before changing stage", () => {
  const lockedGate = evaluateRelationshipStageTransition({
    currentStage: "acquaintances",
    metrics: { trust: 4 },
    eventGates: { gateFirstCrisis: false },
    actionSignals: ["offers assistance"],
  });
  const openGate = evaluateRelationshipStageTransition({
    currentStage: "acquaintances",
    metrics: { trust: 4 },
    eventGates: { gateFirstCrisis: true },
    actionSignals: ["offers assistance"],
  });

  assert.equal(lockedGate.transitioned, false);
  assert.equal(lockedGate.blockedBy, "event_gate");
  assert.equal(lockedGate.nextStage, "acquaintances");
  assert.match(lockedGate.promptBehaviorHint, /polite and provisional/);
  assert.equal(openGate.transitioned, true);
  assert.equal(openGate.transitionId, "acquaintances_to_casual_allies");
  assert.equal(openGate.nextStage, "casual_allies");
});

test("keeps direct multi-stage requests on the immediate adjacent node first", () => {
  const result = evaluateRelationshipStageTransition({
    currentStage: "mutual_longing",
    metrics: { trust: 8, affection: 75, romanticTension: 80 },
    eventGates: { gateMajorSacrifice: true },
    actionSignals: ["kiss"],
  });

  assert.equal(result.transitioned, true);
  assert.equal(result.transitionId, "mutual_longing_to_intimate_partners_event_gate");
  assert.equal(result.nextStage, "confessed_affection");
  assert.match(result.promptBehaviorHint, /Guard clause applied/);
});

test("allows betrayal emergency override only from trust-bearing stages", () => {
  const result = evaluateRelationshipStageTransition({
    currentStage: "intimate_partners",
    metrics: { trust: 1, affection: 80 },
    actionSignals: ["promise broken"],
  });

  assert.equal(result.transitioned, true);
  assert.equal(result.transitionId, "betrayal_emergency_override");
  assert.equal(result.nextStage, "betrayed");
});
