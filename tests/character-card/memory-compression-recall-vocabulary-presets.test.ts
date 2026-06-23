import assert from "node:assert/strict";
import test from "node:test";

import {
  MEMORY_COMPRESSION_RECALL_VOCABULARY_STANDARD_SEEDS,
  compileMemoryRecallPrompt,
  compressMemoryEvent,
  disposableMemoryTypes,
  keyMemoryTypesToPreserve,
  memoryCompressionRecallPrinciples,
  memoryCompressionRecallSemanticChain,
  memoryCompressionRules,
  memoryIntegrationSurfaces,
  memoryRecallRules,
  memoryTierDefinitions,
} from "../../data/memoryCompressionRecallVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";

test("defines memory compression as event, meaning, impact, recall, and reinforcement", () => {
  assert.deepEqual(memoryCompressionRecallSemanticChain, [
    "Raw Interaction",
    "Event",
    "Meaning",
    "State Impact",
    "Compressed Memory",
    "Recall Trigger",
    "Reinforced Behavior",
  ]);
  assert.equal(
    memoryCompressionRecallPrinciples.includes(
      "Do not remember everything; remember what changes behavior.",
    ),
    true,
  );
});

test("stores three memory tiers with persistence and decay rules", () => {
  assert.deepEqual(
    memoryTierDefinitions.map((tier) => tier.seed),
    [
      "core_identity",
      "relationship_memory",
      "contextual_memory",
    ],
  );

  const core = memoryTierDefinitions.find((tier) => tier.seed === "core_identity");
  const relationship = memoryTierDefinitions.find(
    (tier) => tier.seed === "relationship_memory",
  );
  const contextual = memoryTierDefinitions.find(
    (tier) => tier.seed === "contextual_memory",
  );

  assert.equal(core?.decayRate, "none");
  assert.equal(core?.stores.includes("speech profile"), true);
  assert.equal(relationship?.stores.includes("betrayals"), true);
  assert.equal(relationship?.decayRate, "slow");
  assert.equal(contextual?.persistence, "disposable");
  assert.equal(contextual?.decayRate, "fast");
});

test("keeps compression rules focused on meaning instead of raw wording", () => {
  const trustConflict = memoryCompressionRules.find(
    (rule) => rule.seed === "trust_conflict_compression",
  );
  const boundary = memoryCompressionRules.find(
    (rule) => rule.seed === "boundary_violation_compression",
  );

  assert.equal(trustConflict?.compressedForm.includes("trust decreases"), true);
  assert.match(trustConflict?.principle ?? "", /one route-relevant memory/);
  assert.match(boundary?.principle ?? "", /future consent and trust/);
  assert.equal(keyMemoryTypesToPreserve.includes("vulnerability_moment"), true);
  assert.equal(keyMemoryTypesToPreserve.includes("boundary_violation"), true);
  assert.equal(disposableMemoryTypes.includes("small_talk"), true);
});

test("stores recall triggers and system integration surfaces", () => {
  assert.deepEqual(
    memoryRecallRules.map((rule) => rule.seed),
    [
      "similar_situation",
      "same_emotional_trigger",
      "repeated_behavior_pattern",
      "state_threshold_crossed",
    ],
  );
  assert.equal(
    memoryRecallRules.some((rule) => /expectation/.test(rule.recallEffect)),
    true,
  );
  assert.deepEqual(
    memoryIntegrationSurfaces.map((surface) => surface.seed),
    [
      "dynamic_state_memory_feed",
      "event_engine_memory_feed",
      "dialogue_memory_subtext",
      "arc_controller_memory_feed",
    ],
  );
});

test("compresses memory events into deterministic summaries", () => {
  assert.deepEqual(
    compressMemoryEvent({
      event: "{{user}} returned after vanishing",
      meaning: "absence felt like abandonment",
      stateImpact: "trust decreases and guardedness rises",
    }),
    {
      tier: "relationship_memory",
      summary:
        "{{user}} returned after vanishing -> absence felt like abandonment -> trust decreases and guardedness rises",
    },
  );
  assert.deepEqual(
    compressMemoryEvent({
      tier: "contextual_memory",
      event: "scene moved to the station platform",
      meaning: "temporary location change",
      stateImpact: "recall only if the platform returns",
    }),
    {
      tier: "contextual_memory",
      summary:
        "scene moved to the station platform -> temporary location change -> recall only if the platform returns",
    },
  );
});

test("compiles memory recall context without raw transcript dumping", () => {
  const prompt = compileMemoryRecallPrompt({
    coreIdentity: ["guarded speech profile", "protective motivation"],
    relationshipMemories: [
      "first vulnerability shared -> trust increased",
      "old absence -> abandonment sensitivity increased",
    ],
    contextualMemories: ["rain outside safehouse"],
    activeRecallTriggers: ["same_emotional_trigger", "repeated_behavior_pattern"],
  });

  assert.match(prompt, /Memory Recall Context:/);
  assert.match(prompt, /Core identity: guarded speech profile, protective motivation/);
  assert.match(prompt, /Relationship memory: first vulnerability shared -> trust increased/);
  assert.match(prompt, /Active recall triggers: same_emotional_trigger, repeated_behavior_pattern/);
  assert.doesNotMatch(prompt, /raw dialogue log/i);
});

test("projects memory compression recall seeds into standard vocabulary and semantic metadata", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "memory-compression-recall-vocabulary",
  );
  const compressionResults = searchStandardVocabularySeeds("Keep meaning, discard wording", {
    sourceIds: ["memory-compression-recall-vocabulary"],
    limit: 3,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "memory-compression-recall-vocabulary:relationship_memory_memory_tier",
  );

  assert.equal(seeds.length, MEMORY_COMPRESSION_RECALL_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(compressionResults[0]?.label, "Event Meaning State Impact Memory Compression Rule");
  assert.equal(graphNode?.category, "metadata_tags");
  assert.equal(graphNode?.label, "Tier 2 - Relationship Memory Memory Tier");
});
