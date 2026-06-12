import assert from "node:assert/strict";
import test from "node:test";

import {
  SemanticMathBrainService,
  VectorMath,
  type VectorCharacterBrain,
} from "../../lib/semanticBrain";

const vectorJulianBrain: VectorCharacterBrain = {
  name: "Julian",
  currentState: {
    Intimacy: 10,
    Abandonment: 0,
  },
  nodes: [
    {
      concept: "Intimacy",
      embedding: [0, 1, 0],
      weight: 0.8,
      decayRate: 0.1,
      sensitivityThreshold: 0.45,
      spokes: {
        cognitive: ["closeness", "trust", "safe attachment"],
        affective: ["vulnerable", "yearning", "protective"],
        somatic: ["warmth in chest", "shallow breathing"],
        behavioral: ["softens voice tone", "lingering eye contact"],
      },
    },
    {
      concept: "Abandonment",
      embedding: [1, 0, 0],
      weight: 0.95,
      decayRate: 0.05,
      sensitivityThreshold: 0.5,
      spokes: {
        cognitive: ["leaving", "absence", "emotional distance"],
        affective: ["panic", "hollow", "defensive"],
        somatic: ["stomach dropping", "cold hands"],
        behavioral: ["bitter laugh", "averts gaze"],
      },
    },
  ],
};

test("calculates cosine similarity for spatial vector matching", () => {
  assert.equal(VectorMath.cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(VectorMath.cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(VectorMath.cosineSimilarity([0, 0], [1, 1]), 0);
  assert.throws(
    () => VectorMath.cosineSimilarity([1], [1, 0]),
    /equal, non-zero length/,
  );
});

test("activates meaning-matched vector nodes without exact trigger words", () => {
  const result = SemanticMathBrainService.evaluateVectorInput(
    [0.8, 0.2, 0],
    vectorJulianBrain,
  );

  assert.deepEqual(result.matchedConcepts, ["Abandonment"]);
  assert.equal(result.matches[0]?.similarity, 0.97);
  assert.equal(result.matches[0]?.activationBoost, 53.596);
  assert.equal(result.brain.currentState.Intimacy, 9);
  assert.equal(result.brain.currentState.Abandonment, 53.596);
});

test("processVectorInput returns the updated vector brain for runtime handlers", () => {
  const updatedBrain = SemanticMathBrainService.processVectorInput(
    [0.8, 0.2, 0],
    vectorJulianBrain,
  );

  assert.equal(updatedBrain.currentState.Abandonment, 53.596);
});

test("generates soft prompt context from active vector cues", () => {
  const result = SemanticMathBrainService.evaluateVectorInput(
    [0.8, 0.2, 0],
    vectorJulianBrain,
  );
  const context = SemanticMathBrainService.generatePromptContext(result.brain, {
    activationThreshold: 30,
  });

  assert.match(context, /Current semantic vector state for Julian/);
  assert.match(context, /Abandonment is active \(54%\)/);
  assert.match(context, /Cognitive associations: leaving, absence/);
  assert.match(context, /Affective texture: panic, hollow/);
  assert.match(context, /Embodied cues available: stomach dropping, cold hands/);
  assert.match(context, /Behavioral cues available: bitter laugh, averts gaze/);
  assert.match(context, /active vector cues shape subtext/);
  assert.doesNotMatch(context, /Intimacy is active/);
});

test("lets metaphorical isolation vectors light up abandonment and emotional distance", () => {
  const result = SemanticMathBrainService.evaluateVectorInput(
    [0.76, 0.12, 0.64],
    {
      ...vectorJulianBrain,
      nodes: [
        vectorJulianBrain.nodes[0]!,
        {
          ...vectorJulianBrain.nodes[1]!,
          embedding: [0.8, 0.1, 0.6],
          sensitivityThreshold: 0.7,
        },
      ],
    },
  );

  assert.deepEqual(result.matchedConcepts, ["Abandonment"]);
  assert.equal(result.matches[0]?.similarity > 0.99, true);
  assert.equal(result.brain.currentState.Abandonment > 55, true);
});
