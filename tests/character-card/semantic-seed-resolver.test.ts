import assert from "node:assert/strict";
import test from "node:test";

import {
  compileSemanticSeedCreatorNote,
  compileSemanticSeedPromptAdditions,
  compileSemanticSeedPromptAdditionsByLane,
  compileSemanticSeedVisibleTags,
  resolveSemanticSeedIds,
} from "../../lib/character-card/semanticSeedResolver";

test("resolves stable semantic seed ids without exposing ids in prose", () => {
  const nodes = resolveSemanticSeedIds([
    "fear_of_abandonment",
    "slow burn",
    "missing_seed",
  ]);
  const prompt = compileSemanticSeedPromptAdditions([
    "fear_of_abandonment",
    "slow burn",
  ]);

  assert.deepEqual(
    nodes.map((node) => node.id),
    ["fear_of_abandonment", "slow_burn"],
  );
  assert.match(prompt, /Fear of abandonment/);
  assert.match(prompt, /Slow burn/);
  assert.match(prompt, /soft internal guidance/);
  assert.doesNotMatch(prompt, /fear_of_abandonment/);
  assert.doesNotMatch(prompt, /slow_burn/);
});

test("compiles visible metadata as labels instead of internal semantic ids", () => {
  const tags = compileSemanticSeedVisibleTags([
    "fear_of_abandonment",
    "slow_burn",
  ]);
  const creatorNote = compileSemanticSeedCreatorNote([
    "fear_of_abandonment",
    "slow_burn",
  ]);

  assert.deepEqual(tags, ["Fear of abandonment", "Slow burn"]);
  assert.equal(
    creatorNote,
    "Semantic tags: Fear of abandonment, Slow burn.",
  );
  assert.doesNotMatch(creatorNote, /fear_of_abandonment|slow_burn/);
});

test("splits semantic prompt additions into psychology and relationship lanes", () => {
  const additions = compileSemanticSeedPromptAdditionsByLane([
    "fear_of_abandonment",
    "slow_burn",
  ]);

  assert.match(additions.psychologyAddition, /Fear of abandonment/);
  assert.doesNotMatch(additions.psychologyAddition, /Slow burn/);
  assert.match(additions.relationshipAddition, /Slow burn/);
  assert.doesNotMatch(additions.relationshipAddition, /Fear of abandonment/);
  assert.match(additions.systemPromptAddition, /Fear of abandonment/);
  assert.match(additions.systemPromptAddition, /Slow burn/);
});

test("resolves standardized vocabulary seed ids through the semantic graph bridge", () => {
  const nodes = resolveSemanticSeedIds([
    "moral-framework-vocabulary:care_ethics",
  ]);
  const prompt = compileSemanticSeedPromptAdditions([
    "moral-framework-vocabulary:care_ethics",
  ]);
  const tags = compileSemanticSeedVisibleTags([
    "moral-framework-vocabulary:care_ethics",
  ]);

  assert.equal(nodes[0]?.label, "Care Ethics");
  assert.equal(nodes[0]?.category, "motivations");
  assert.deepEqual(tags, ["Care Ethics"]);
  assert.match(prompt, /Care Ethics/);
  assert.match(prompt, /soft internal guidance/);
  assert.doesNotMatch(prompt, /moral-framework-vocabulary:care_ethics/);
});
