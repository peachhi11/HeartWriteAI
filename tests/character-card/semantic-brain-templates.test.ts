import assert from "node:assert/strict";
import test from "node:test";

import {
  JulianBrainTemplate,
  SEMANTIC_BRAIN_TEMPLATES,
  createJulianBrainTemplate,
} from "../../lib/character-card/semanticBrainTemplates";
import {
  SemanticBrainService,
} from "../../lib/character-card/semanticBrainService";

test("exports Julian semantic brain template with stable local brain metadata", () => {
  assert.equal(JulianBrainTemplate.id, "brain:julian");
  assert.equal(JulianBrainTemplate.characterId, "julian");
  assert.equal(JulianBrainTemplate.version, 1);
  assert.equal(JulianBrainTemplate.traits.attachmentStyle, "anxious-leaning");
  assert.deepEqual(JulianBrainTemplate.runtime, {
    turn: 0,
    activeNodeIds: [],
  });
  assert.deepEqual(
    JulianBrainTemplate.nodes.map((node) => node.label),
    ["Intimacy", "Abandonment"],
  );
  assert.equal(SEMANTIC_BRAIN_TEMPLATES.includes(JulianBrainTemplate), true);
});

test("keeps Julian intimacy and abandonment spokes richly layered", () => {
  const intimacy = JulianBrainTemplate.nodes.find(
    (node) => node.label === "Intimacy",
  );
  const abandonment = JulianBrainTemplate.nodes.find(
    (node) => node.label === "Abandonment",
  );

  assert.ok(intimacy);
  assert.equal(intimacy.seedId, "manual:julian:intimacy");
  assert.equal(intimacy.activation.baseline, 0.1);
  assert.equal(intimacy.activation.decayRate, 0.1);
  assert.equal(intimacy.layers.cognitive.some((spoke) =>
    spoke.text === "trust"
  ), true);
  assert.equal(intimacy.layers.somatic.some((spoke) =>
    spoke.text === "warmth in chest"
  ), true);
  assert.equal(intimacy.layers.behavioral.some((spoke) =>
    spoke.text === "lingering eye contact"
  ), true);

  assert.ok(abandonment);
  assert.equal(abandonment.seedId, "manual:julian:abandonment");
  assert.equal(abandonment.activation.baseline, 0);
  assert.equal(abandonment.activation.decayRate, 0.05);
  assert.equal(abandonment.layers.cognitive.some((spoke) =>
    spoke.text === "goodbye"
  ), true);
  assert.equal(abandonment.layers.affective.some((spoke) =>
    spoke.text === "hollow"
  ), true);
  assert.equal(abandonment.layers.behavioral.some((spoke) =>
    spoke.text === "bitter laugh"
  ), true);
});

test("activates Julian abandonment strongly while preserving intimacy tension", () => {
  const result = SemanticBrainService.processInput(
    "I trust you, but the secret goodbye made me feel alone. Please do not leave.",
    createJulianBrainTemplate(),
  );

  assert.deepEqual(result.matchedConcepts, ["Intimacy", "Abandonment"]);
  assert.equal(result.brain.runtime.turn, 1);
  assert.equal(result.brain.nodes[0]?.activation.current, 0.312);
  assert.equal(result.brain.nodes[1]?.activation.current, 0.913);
  assert.deepEqual(result.brain.runtime.activeNodeIds, [
    "semantic-node:julian:abandonment",
    "semantic-node:julian:intimacy",
  ]);

  const nextTurn = SemanticBrainService.processInput("", result.brain);
  assert.deepEqual(nextTurn.matchedConcepts, []);
  assert.equal(nextTurn.brain.runtime.turn, 2);
  assert.equal(nextTurn.brain.nodes[0]?.activation.current, 0.291);
  assert.equal(nextTurn.brain.nodes[1]?.activation.current, 0.867);
});

test("generates soft Julian semantic brain context without command language or ids", () => {
  const result = SemanticBrainService.processInput(
    "Do not leave. I want to trust you and hold onto what feels safe.",
    createJulianBrainTemplate(),
  );
  const context = SemanticBrainService.generatePromptContext(result.brain, {
    activationThreshold: 0.25,
  });

  assert.match(context, /Current character semantic state/);
  assert.match(context, /Concept: Intimacy/);
  assert.match(context, /Concept: Abandonment/);
  assert.match(context, /Body response:/);
  assert.match(context, /warmth in chest/);
  assert.match(context, /stomach dropping/);
  assert.match(context, /Visible behavior:/);
  assert.match(context, /softens voice tone/);
  assert.match(context, /crosses arms tightly/);
  assert.match(context, /soft internal state guidance/);
  assert.doesNotMatch(context, /semantic-node|manual:julian|brain-spoke/);
  assert.doesNotMatch(context, /MANDATORY|force/i);
});

test("clones Julian template so runtime state changes do not mutate the shared fixture", () => {
  const clone = createJulianBrainTemplate();
  clone.nodes[0]!.activation.current = 0.9;
  clone.runtime.activeNodeIds = ["semantic-node:julian:intimacy"];

  assert.equal(JulianBrainTemplate.nodes[0]?.activation.current, 0.1);
  assert.equal(clone.nodes[0]?.activation.current, 0.9);
  assert.notEqual(clone.nodes, JulianBrainTemplate.nodes);
});
