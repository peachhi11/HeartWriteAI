import assert from "node:assert/strict";
import test from "node:test";

import {
  BRAIN_ARCHETYPE_DICTIONARY,
  DEFAULT_LOCAL_EMBEDDING_DIMENSIONS,
  DEFAULT_LOCAL_EMBEDDING_MODEL,
  SemanticNodeGenerator,
  createSemanticNodeEmbeddingText,
  isLikelyMiniLmEmbedding,
} from "../../lib/semanticBrain";

test("tracks the local MiniLM embedding model used for browser-side vectors", () => {
  assert.equal(DEFAULT_LOCAL_EMBEDDING_MODEL, "Xenova/all-MiniLM-L6-v2");
  assert.equal(DEFAULT_LOCAL_EMBEDDING_DIMENSIONS, 384);
});

test("creates descriptive embedding text from four-layer archetype spokes", () => {
  const text = createSemanticNodeEmbeddingText(
    "Fear of abandonment",
    BRAIN_ARCHETYPE_DICTIONARY.vulnerability,
  );

  assert.match(text, /Concept: Fear of abandonment\./);
  assert.match(text, /Cognitive associations: exposure, hope, risk/);
  assert.match(text, /Feeling: exposed, yearning, anxious, hopeful/);
  assert.match(text, /Somatic cues: trembling hands, knot in stomach/);
  assert.match(text, /Behavioral expression: avoids long eye contact/);
});

test("auto-generates semantic math nodes with injectable embedding providers", async () => {
  const node = await SemanticNodeGenerator.autoGenerateNode(
    "Secret devotion",
    "obsession",
    {
      embeddingProvider: async (text) => {
        assert.match(text, /Secret devotion/);
        assert.match(text, /fixation, possession/);
        return Array.from({ length: 384 }, (_, index) => index / 384);
      },
    },
  );

  assert.equal(node.concept, "Secret devotion");
  assert.equal(node.weight, 0.9);
  assert.equal(node.decayRate, 0.1);
  assert.equal(node.sensitivityThreshold, 0.42);
  assert.equal(node.embedding.length, 384);
  assert.equal(isLikelyMiniLmEmbedding(node.embedding), true);
  assert.equal(node.spokes.affective.includes("intense longing"), true);
  assert.equal(node.spokes.behavioral.includes("voice drops lower"), true);
});

test("uses lower reactivity and slower decay for cold defensive nodes", async () => {
  const node = await SemanticNodeGenerator.autoGenerateNode("Tsundere coldness", "coldness", {
    embeddingProvider: async () => [1, 0, 0],
  });

  assert.equal(node.weight, 0.7);
  assert.equal(node.decayRate, 0.04);
  assert.equal(isLikelyMiniLmEmbedding(node.embedding), false);
  assert.equal(node.spokes.somatic.includes("stiff posture"), true);
});
