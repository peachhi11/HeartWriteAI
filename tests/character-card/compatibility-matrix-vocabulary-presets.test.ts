import assert from "node:assert/strict";
import test from "node:test";

import {
  COMPATIBILITY_MATRIX_VOCABULARY_STANDARD_SEEDS,
  assessCompatibilityMatrix,
  compatibilityCollisionDefinitions,
  compatibilityMatrixPrinciples,
  compatibilityMatrixSections,
  compatibilityMatrixSemanticChain,
  compatibilityTrajectoryDefinitions,
} from "../../data/compatibilityMatrixVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines compatibility as attraction, friction, economy, power, loop, and trajectory", () => {
  assert.deepEqual(compatibilityMatrixSemanticChain, [
    "Character Attraction Vector",
    "Persona Emission",
    "Friction Points",
    "Emotional Economy",
    "Power Dynamics",
    "Behavioral Feedback Loop",
    "Narrative Trajectory",
    "Risk Factors",
    "Final Assessment",
  ]);
  assert.equal(
    compatibilityMatrixPrinciples.includes(
      "Compatibility should compare what the character is drawn to with what the persona emits.",
    ),
    true,
  );
  assert.equal(
    compatibilityMatrixPrinciples.includes(
      "Friction is not automatically bad; productive tension can create chemistry and route momentum.",
    ),
    true,
  );
});

test("stores every compatibility matrix section with fields and output signals", () => {
  assert.deepEqual(
    compatibilityMatrixSections.map((section) => section.seed),
    [
      "attraction_vector",
      "friction_points",
      "emotional_economy",
      "power_dynamics",
      "behavioral_feedback_loop",
      "narrative_trajectory_prediction",
      "risk_factors",
      "final_assessment",
    ],
  );

  const friction = compatibilityMatrixSections.find(
    (section) => section.seed === "friction_points",
  );
  const economy = compatibilityMatrixSections.find(
    (section) => section.seed === "emotional_economy",
  );

  assert.equal(friction?.fields.includes("collision type"), true);
  assert.equal(friction?.outputSignals.includes("productive tension"), true);
  assert.equal(economy?.outputSignals.includes("parasitic"), true);
});

test("stores collision and trajectory vocab as reusable compatibility seeds", () => {
  const emotionalMismatch = compatibilityCollisionDefinitions.find(
    (collision) => collision.seed === "emotional_mismatch",
  );
  const slowBond = compatibilityTrajectoryDefinitions.find(
    (trajectory) => trajectory.seed === "slow_bond",
  );

  assert.match(emotionalMismatch?.description ?? "", /reassurance/);
  assert.match(emotionalMismatch?.risk ?? "", /pursuer-withdrawer/);
  assert.match(slowBond?.description ?? "", /gradual trust/);
  assert.match(slowBond?.bestUseCase ?? "", /Slow burn/);
});

test("assesses compatibility profile with chemistry, risk, and trajectory", () => {
  const result = assessCompatibilityMatrix({
    characterAttraction: [
      "competence",
      "directness",
      "loyalty",
    ],
    personaSignals: [
      "competence",
      "loyalty",
      "protective humor",
    ],
    characterSensitivities: [
      "authority pressure",
      "being controlled",
    ],
    personaPressurePoints: [
      "direct challenge",
      "protective dominance",
    ],
    whoInvestsFirst: "persona offers practical help first",
    whoWithholds: "character withholds emotional trust",
    reciprocityPattern: "balanced after repeated repair",
    controlAxis: "reactive",
    dependencyAxis: "negotiated shifting control",
    loopExample:
      "challenge triggers defensiveness, direct reassurance de-escalates, trust reinforces the next exchange",
    burnoutRisks: [
      "too many authority tests without repair",
    ],
    repetitionRisks: [
      "same challenge scene repeats",
    ],
    derailmentTriggers: [
      "public humiliation",
    ],
  });

  assert.equal(result.assessment.attractionAlignment, "high");
  assert.equal(result.assessment.chemistryResult, "immediate_chemistry");
  assert.equal(result.assessment.collisionType, "power_imbalance");
  assert.equal(result.assessment.frictionResult, "productive_tension");
  assert.equal(result.assessment.powerStability, "shifting");
  assert.equal(result.assessment.feedbackLoopType, "reinforcing");
  assert.equal(result.assessment.sustainability, "long_term_viable");
  assert.match(result.compactPrompt, /Compatibility Matrix/);
});

test("flags destructive and asymmetrical compatibility risks", () => {
  const result = assessCompatibilityMatrix({
    characterAttraction: [
      "devotion",
    ],
    personaSignals: [
      "distance",
    ],
    characterSensitivities: [
      "emotional withdrawal",
    ],
    personaPressurePoints: [
      "fast intimacy pressure",
    ],
    whoInvestsFirst: "character invests first",
    whoWithholds: "persona withholds and creates one-sided taking",
    reciprocityPattern: "asymmetrical and parasitic",
    controlAxis: "avoidant",
    dependencyAxis: "unstable dependency",
    loopExample: "silence makes things worse and both retreat",
    burnoutRisks: [
      "exhaustion",
      "no repair",
    ],
    repetitionRisks: [
      "same silence spiral repeats",
    ],
    derailmentTriggers: [
      "ghosting",
    ],
  });

  assert.equal(result.assessment.overallCompatibility, "low");
  assert.equal(result.assessment.frictionResult, "destructive_loop");
  assert.equal(result.assessment.emotionalEconomy, "parasitic");
  assert.equal(result.assessment.likelyTrajectory, "collapse");
  assert.equal(result.assessment.requiredAdjustments.length > 1, true);
});

test("projects compatibility matrix seeds into standard vocabulary and semantic graph dynamics", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "compatibility-matrix-vocabulary",
  );
  const economyResults = searchStandardVocabularySeeds("who invests first", {
    sourceIds: ["compatibility-matrix-vocabulary"],
    limit: 3,
  });
  const trajectoryResults = searchStandardVocabularySeeds("gradual trust", {
    sourceIds: ["compatibility-matrix-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "compatibility-matrix-vocabulary:attraction_vector_compatibility_section",
  );

  assert.equal(seeds.length, COMPATIBILITY_MATRIX_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(economyResults[0]?.label, "Emotional Economy Compatibility Section");
  assert.equal(trajectoryResults[0]?.label, "Slow Bond Compatibility Trajectory");
  assert.equal(graphNode?.category, "relationship_dynamics");
  assert.equal(graphNode?.label, "Attraction Vector Compatibility Section");
});
