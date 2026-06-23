import assert from "node:assert/strict";
import test from "node:test";

import {
  NARRATIVE_ARC_CONTROLLER_VOCABULARY_STANDARD_SEEDS,
  evaluateNarrativeArcController,
  narrativeArcControllerPrinciples,
  narrativeArcControllerSemanticChain,
  narrativeArcCorrectionRules,
  narrativeArcPhases,
  narrativePacingModes,
} from "../../data/narrativeArcControllerVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines the narrative arc controller chain and golden rule", () => {
  assert.deepEqual(narrativeArcControllerSemanticChain, [
    "Current Phase",
    "Allowed Event Type",
    "Event Outcome",
    "State Change",
    "Behavior Modulation",
    "Next Phase Pressure",
  ]);
  assert.equal(
    narrativeArcControllerPrinciples.includes(
      "Phase controls events; events change states; states modify behavior.",
    ),
    true,
  );
  assert.equal(
    narrativeArcControllerPrinciples.includes(
      "States alone should not drive the story, and events alone should not drive the story.",
    ),
    true,
  );
});

test("captures the five core arc phases with event constraints", () => {
  const initiation = narrativeArcPhases.find((phase) => phase.seed === "initiation");
  const crisis = narrativeArcPhases.find((phase) => phase.seed === "crisis_turning_point");
  const resolution = narrativeArcPhases.find(
    (phase) => phase.seed === "resolution_stabilization",
  );

  assert.deepEqual(
    narrativeArcPhases.map((phase) => phase.seed),
    [
      "initiation",
      "development",
      "escalation",
      "crisis_turning_point",
      "resolution_stabilization",
    ],
  );
  assert.equal(initiation?.allowedEvents.includes("micro_event"), true);
  assert.equal(initiation?.constraints.includes("no confessions"), true);
  assert.deepEqual(crisis?.allowedEvents, ["major_event"]);
  assert.equal(crisis?.constraints.includes("no small talk loops"), true);
  assert.equal(
    resolution?.stateBehavior.includes("trust resets at a new baseline"),
    true,
  );
});

test("captures pacing modes and anti-derail correction rules", () => {
  const slowBurn = narrativePacingModes.find((mode) => mode.seed === "slow_burn");
  const tooChaotic = narrativeArcCorrectionRules.find(
    (rule) => rule.seed === "too_chaotic",
  );
  const tooRepetitive = narrativeArcCorrectionRules.find(
    (rule) => rule.seed === "too_repetitive",
  );

  assert.equal(narrativePacingModes.length, 3);
  assert.match(slowBurn?.phaseBehavior ?? "", /Phase 1 and Phase 2/);
  assert.equal(tooChaotic?.targetPhase, "resolution_stabilization");
  assert.match(tooRepetitive?.correction ?? "", /new event category/);
});

test("evaluates phase constraints, transition pressure, and correction guidance", () => {
  const initiation = evaluateNarrativeArcController({
    currentPhase: "initiation",
    dominantState: "curiosity",
    pacingMode: "slow_burn",
    stateThresholds: ["trust above early threshold"],
  });
  const escalation = evaluateNarrativeArcController({
    currentPhase: "escalation",
    dominantState: "unstable attraction",
    eventOutcomes: ["major tension unresolved", "states unstable"],
  });
  const chaotic = evaluateNarrativeArcController({
    currentPhase: "escalation",
    dominantState: "overloaded",
    fatigueSignals: ["too_chaotic"],
  });

  assert.equal(initiation.transitionCandidates[0], "development");
  assert.equal(initiation.blockedEvents.includes("confession"), true);
  assert.match(initiation.compactPrompt, /Golden rule/);
  assert.equal(escalation.transitionCandidates[0], "crisis_turning_point");
  assert.equal(chaotic.transitionCandidates[0], "resolution_stabilization");
  assert.equal(chaotic.correctionGuidance.length > 0, true);
});

test("projects narrative arc controller into standard vocabulary and semantic graph nodes", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "narrative-arc-controller-vocabulary",
  );
  const initiationResults = searchStandardVocabularySeeds("subtle tension", {
    sourceIds: ["narrative-arc-controller-vocabulary"],
    limit: 3,
  });
  const correctionResults = searchStandardVocabularySeeds("new event category", {
    sourceIds: ["narrative-arc-controller-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "narrative-arc-controller-vocabulary:crisis_turning_point",
  );

  assert.equal(seeds.length, NARRATIVE_ARC_CONTROLLER_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(initiationResults[0]?.label, "Phase 1 - Initiation");
  assert.equal(
    correctionResults.some((seed) => seed.label === "Too Repetitive Arc Correction"),
    true,
  );
  assert.equal(graphNode?.category, "routes");
  assert.equal(graphNode?.label, "Phase 4 - Crisis / Turning Point");
});
