import assert from "node:assert/strict";
import test from "node:test";

import {
  DYNAMIC_STATE_SYSTEM_VOCABULARY_STANDARD_SEEDS,
  applyDynamicStateModifier,
  compileDynamicStatePromptGuidance,
  dynamicStateAxes,
  dynamicStateBehaviorOverrides,
  dynamicStateCharacterBiases,
  dynamicStateMemoryRules,
  dynamicStateModifiers,
  dynamicStatePrinciples,
  dynamicStateSemanticChain,
  getDynamicStateBand,
} from "../../data/dynamicStateSystemVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines dynamic state as character sheet plus current state", () => {
  assert.deepEqual(dynamicStateSemanticChain, [
    "Character Sheet",
    "Current State",
    "Trigger",
    "Interpretation",
    "State Update",
    "Behavior Profile",
    "Final Behavior",
  ]);
  assert.equal(
    dynamicStatePrinciples.includes(
      "States bend personality; they never replace personality.",
    ),
    true,
  );
  assert.equal(
    dynamicStatePrinciples.includes(
      "Expose state effects through tone, openness, initiative, and decision-making rather than raw numbers.",
    ),
    true,
  );
});

test("captures primary state axes and their active ranges", () => {
  assert.deepEqual(
    dynamicStateAxes.map((axis) => axis.seed),
    ["trust", "attraction", "emotional_regulation", "power_perception"],
  );

  const lowTrust = getDynamicStateBand("trust", 12);
  const highTrust = getDynamicStateBand("trust", 76);
  const dominated = getDynamicStateBand("power_perception", -64);
  const inControl = getDynamicStateBand("power_perception", 64);

  assert.equal(lowTrust.label, "0-20 - Defensive");
  assert.match(lowTrust.reactionPattern, /Suspicious/);
  assert.match(highTrust.reactionPattern, /willing to accept help/);
  assert.equal(dominated.band, "negative");
  assert.equal(inControl.band, "positive");
});

test("stores modifiers as trigger interpretation adjustment chains", () => {
  const kindness = dynamicStateModifiers.find(
    (modifier) => modifier.seed === "kindness_without_cost_modifier",
  );
  const inconsistency = dynamicStateModifiers.find(
    (modifier) => modifier.seed === "inconsistency_modifier",
  );

  assert.equal(kindness?.interpretation, "This might be genuine.");
  assert.equal(kindness?.adjustments.trust, 5);
  assert.equal(inconsistency?.adjustments.trust, -8);
  assert.match(inconsistency?.avoidAsHardRule ?? "", /every inconsistency/);
});

test("applies modifiers while preserving state ranges", () => {
  const softened = applyDynamicStateModifier(
    {
      trust: 96,
      emotionalRegulation: 99,
      powerPerception: 0,
    },
    "kindness_without_cost_modifier",
  );
  const challenged = applyDynamicStateModifier(
    {
      trust: 40,
      emotionalRegulation: 30,
      powerPerception: -96,
    },
    "challenge_to_authority_modifier",
  );

  assert.equal(softened.trust, 100);
  assert.equal(softened.emotionalRegulation, 100);
  assert.equal(challenged.powerPerception, -100);
  assert.equal(challenged.emotionalRegulation, 27);
});

test("models behavior overrides without replacing personality", () => {
  const highTrustHelp = dynamicStateBehaviorOverrides.find(
    (override) => override.seed === "helped_high_trust_gratitude_override",
  );
  const guardedBias = dynamicStateCharacterBiases.find(
    (bias) => bias.seed === "guarded_character_state_bias",
  );

  assert.match(highTrustHelp?.baselineBehavior ?? "", /suspicion/);
  assert.match(highTrustHelp?.modifiedBehavior ?? "", /quiet gratitude/);
  assert.match(highTrustHelp?.principle ?? "", /without deleting the guarded personality/);
  assert.equal(guardedBias?.stateSensitivity.trust, "slow");
  assert.equal(
    dynamicStateMemoryRules.includes(
      "State memory prevents characters from resetting to neutral after meaningful scenes.",
    ),
    true,
  );
});

test("compiles prompt-safe guidance without exposing raw numbers", () => {
  const guidance = compileDynamicStatePromptGuidance({
    trust: 15,
    attraction: 78,
    emotionalRegulation: 18,
    powerPerception: -60,
  });

  assert.equal(guidance.evaluations.length, 4);
  assert.match(guidance.visibleGuidance, /Guarded|Sharp|Hesitant/);
  assert.match(guidance.hiddenGuidance, /Neutral actions are scanned/);
  assert.match(guidance.compactPrompt, /rather than raw numbers/);
});

test("projects dynamic state seeds into standard vocabulary and semantic graph states", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "dynamic-state-system-vocabulary",
  );
  const trustResults = searchStandardVocabularySeeds("neutral actions are scanned", {
    sourceIds: ["dynamic-state-system-vocabulary"],
    limit: 3,
  });
  const overrideResults = searchStandardVocabularySeeds(
    "quiet gratitude",
    {
      sourceIds: ["dynamic-state-system-vocabulary"],
      limit: 3,
    },
  );
  const graphNode = findSemanticSeedGraphNodeById(
    "dynamic-state-system-vocabulary:trust_state_axis",
  );

  assert.equal(seeds.length, DYNAMIC_STATE_SYSTEM_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(trustResults[0]?.label, "Trust State Axis");
  assert.equal(overrideResults[0]?.label, "Being Helped - High Trust Gratitude");
  assert.equal(graphNode?.category, "states");
  assert.equal(graphNode?.label, "Trust State Axis");
});
