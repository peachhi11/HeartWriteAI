import assert from "node:assert/strict";
import test from "node:test";

import {
  SemanticBrainService,
  activateNode,
  buildPromptContext,
  compileSemanticBrainContextFromSeedIds,
  decayBrain,
  normalizeCharacterBrain,
  pick,
  semanticSeedNodeToBrainNode,
  toPromptProse,
  type CharacterBrain,
} from "../../lib/character-card/semanticBrainService";
import {
  findSemanticSeedGraphNodeById,
} from "../../data/semanticSeedRegistry";

const betrayalBrain: CharacterBrain = normalizeCharacterBrain({
  id: "brain:mara",
  characterId: "mara",
  version: 1,
  traits: {
    attachmentStyle: "fearful-avoidant",
    boundaries: ["Preserve {{user}} agency."],
  },
  nodes: [
    {
      id: "semantic-node:mara:betrayal",
      seedId: "manual:mara:betrayal",
      label: "Betrayal",
      romanceDomain: ["trust", "vulnerability"],
      layers: {
        cognitive: createSpokes("betrayal", "cognitive", [
          "Trust",
          "Lie",
          "Secret",
          "Past relationship",
        ], 0.82),
        affective: createSpokes("betrayal", "affective", [
          "Grief",
          "Anger",
          "Vulnerability",
          "Insecurity",
        ], 0.8),
        somatic: createSpokes("betrayal", "somatic", [
          "Nausea",
          "Tight chest",
          "Cold chills",
          "Shaking",
        ], 0.78),
        behavioral: createSpokes("betrayal", "behavioral", [
          "Defensive sarcasm",
          "Avoiding eye contact",
          "Withdrawal",
        ], 0.76),
      },
      activation: {
        current: 0.1,
        baseline: 0.1,
        decayRate: 0.2,
        lastTurn: 0,
      },
      links: [],
    },
    {
      id: "semantic-node:mara:calm",
      seedId: "manual:mara:calm",
      label: "Calm",
      layers: {
        cognitive: createSpokes("calm", "cognitive", ["Quiet"], 0.45),
        affective: createSpokes("calm", "affective", ["Ease"], 0.45),
        somatic: createSpokes("calm", "somatic", ["Slow breathing"], 0.45),
        behavioral: createSpokes("calm", "behavioral", ["Open posture"], 0.45),
      },
      activation: {
        current: 0.5,
        baseline: 0.4,
        decayRate: 0.5,
        lastTurn: 0,
      },
      links: [],
    },
  ],
  runtime: {
    turn: 0,
    activeNodeIds: [],
  },
});

test("decays brain activation toward baseline and activates nodes on a 0..1 scale", () => {
  const brain = normalizeCharacterBrain({
    ...betrayalBrain,
    nodes: [betrayalBrain.nodes[0]],
  });

  decayBrain(brain);
  assert.equal(brain.runtime.turn, 1);
  assert.equal(brain.nodes[0]?.activation.current, 0.1);
  assert.equal(brain.nodes[0]?.activation.lastTurn, 0);

  activateNode(brain.nodes[0]!, 0.3);
  assert.equal(brain.nodes[0]?.activation.current, 0.4);
  activateNode(brain.nodes[0]!, Number.NaN);
  assert.equal(brain.nodes[0]?.activation.current, 0.4);
});

test("processes input through four-layer semantic spokes with decay", () => {
  const result = SemanticBrainService.processInput(
    "You lied about the secret from your past relationship.",
    betrayalBrain,
  );

  assert.deepEqual(result.matchedConcepts, ["Betrayal"]);
  assert.deepEqual(result.matchedNodeIds, ["semantic-node:mara:betrayal"]);
  assert.equal(result.brain.runtime.turn, 1);
  assert.equal(result.brain.nodes[0]?.activation.current, 0.46);
  assert.equal(result.brain.nodes[0]?.activation.lastTurn, 1);
  assert.equal(result.brain.nodes[1]?.activation.current, 0.45);
  assert.equal(result.brain.nodes[1]?.activation.lastTurn, 0);
  assert.deepEqual(result.brain.runtime.activeNodeIds, [
    "semantic-node:mara:betrayal",
    "semantic-node:mara:calm",
  ]);
});

test("does not activate short cues inside larger words", () => {
  const literalLieBrain: CharacterBrain = normalizeCharacterBrain({
    id: "brain:literal-lie",
    characterId: "literal-lie",
    version: 1,
    traits: {},
    nodes: [
      {
        id: "semantic-node:literal-lie",
        seedId: "manual:literal-lie",
        label: "Lie",
        layers: {
          cognitive: createSpokes("literal-lie", "cognitive", ["Lie"], 0.7),
          affective: [],
          somatic: [],
          behavioral: [],
        },
        activation: {
          current: 0,
          baseline: 0,
          decayRate: 0.1,
          lastTurn: 0,
        },
        links: [],
      },
    ],
    runtime: {
      turn: 0,
      activeNodeIds: [],
    },
  });

  const result = SemanticBrainService.processInput(
    "I believe you.",
    literalLieBrain,
  );

  assert.deepEqual(result.matchedConcepts, []);
  assert.equal(result.brain.nodes[0]?.activation.current, 0);
});

test("does not mark lastTurn when activation amount is invalid or zero", () => {
  const result = SemanticBrainService.processInput(
    "Lie",
    normalizeCharacterBrain({
      id: "brain:no-boost",
      characterId: "no-boost",
      version: 1,
      traits: {},
      nodes: [
        {
          id: "semantic-node:no-boost:lie",
          seedId: "manual:no-boost:lie",
          label: "Lie",
          layers: {
            cognitive: createSpokes("no-boost", "cognitive", ["Lie"], 0.7),
            affective: [],
            somatic: [],
            behavioral: [],
          },
          activation: {
            current: 0,
            baseline: 0,
            decayRate: 0.1,
            lastTurn: 0,
          },
          links: [
            {
              targetNodeId: "semantic-node:no-boost:trust",
              weight: 0,
            },
          ],
        },
        {
          id: "semantic-node:no-boost:trust",
          seedId: "manual:no-boost:trust",
          label: "Trust",
          layers: {
            cognitive: createSpokes("trust", "cognitive", ["Trust"], 0.7),
            affective: [],
            somatic: [],
            behavioral: [],
          },
          activation: {
            current: 0,
            baseline: 0,
            decayRate: 0.1,
            lastTurn: 0,
          },
          links: [],
        },
      ],
      runtime: {
        turn: 0,
        activeNodeIds: [],
      },
    }),
    {
      activationAmountPerMatch: Number.NaN,
    },
  );

  assert.deepEqual(result.matchedConcepts, ["Lie"]);
  assert.equal(result.brain.nodes[0]?.activation.current, 0);
  assert.equal(result.brain.nodes[0]?.activation.lastTurn, 0);
  assert.equal(result.brain.nodes[1]?.activation.current, 0);
  assert.equal(result.brain.nodes[1]?.activation.lastTurn, 0);
});

test("builds prompt context and prose without leaking internal ids", () => {
  const result = SemanticBrainService.processInput(
    "The lie and secret are still here.",
    betrayalBrain,
  );
  const context = buildPromptContext(result.brain, {
    activationThreshold: 0.25,
  });
  const prose = toPromptProse(context);
  const fullContext = SemanticBrainService.generatePromptContext(result.brain, {
    activationThreshold: 0.25,
  });

  assert.match(prose, /Concept: Betrayal/);
  assert.match(prose, /Inner meaning: Trust; Lie/);
  assert.match(prose, /Emotional charge: Grief; Anger/);
  assert.match(prose, /Body response: Nausea; Tight chest/);
  assert.match(prose, /Visible behavior: Defensive sarcasm/);
  assert.match(fullContext, /Current character semantic state/);
  assert.match(fullContext, /soft internal state guidance/);
  assert.doesNotMatch(fullContext, /semantic-node|manual:mara|brain-spoke/);
  assert.doesNotMatch(fullContext, /MANDATORY|force/i);
});

test("scrubs unsafe concept and layer strings even when prose formatter is called directly", () => {
  const prose = toPromptProse([
    {
      concept: "semantic-node:internal-id",
      cognitive: ["Trust", "manual:seed-id"],
      affective: ["standard_vocabulary__private", "Anger"],
      somatic: ["Tight chest"],
      behavioral: ["does_x", "Withdrawal"],
    },
  ]);

  assert.match(prose, /Concept: Active cue/);
  assert.match(prose, /Inner meaning: Trust/);
  assert.match(prose, /Emotional charge: Anger/);
  assert.match(prose, /Body response: Tight chest/);
  assert.match(prose, /Visible behavior: Withdrawal/);
  assert.doesNotMatch(
    prose,
    /semantic-node|internal-id|manual:seed-id|standard_vocabulary|does_x/,
  );
});

test("falls back to prompt defaults when prompt options are non-finite", () => {
  const inactiveContext = buildPromptContext(
    normalizeCharacterBrain({
      ...betrayalBrain,
      nodes: [betrayalBrain.nodes[0]],
      runtime: {
        turn: 0,
        activeNodeIds: [],
      },
    }),
    {
      activationThreshold: Number.NaN,
    },
  );
  assert.deepEqual(inactiveContext, []);

  const result = SemanticBrainService.processInput(
    "The lie and secret are still here.",
    betrayalBrain,
  );
  const activeContext = buildPromptContext(result.brain, {
    maxActiveNodes: Number.POSITIVE_INFINITY,
    maxCuesPerLayer: Number.NaN,
  });

  assert.equal(activeContext.length, 2);
  assert.equal(activeContext[0]?.concept, "Betrayal");
  assert.deepEqual(activeContext[0]?.cognitive, ["Trust", "Lie"]);
  assert.deepEqual(
    pick(createSpokes("fallback", "cognitive", ["One", "Two", "Three"], 0.9), Number.POSITIVE_INFINITY),
    ["One", "Two"],
  );
});

test("creates semantic brain nodes from existing semantic seed graph nodes", () => {
  const graphNode = findSemanticSeedGraphNodeById(
    "desire-vocabulary:desire_to_be_chosen",
  );
  assert.ok(graphNode);

  const brainNode = semanticSeedNodeToBrainNode(graphNode);

  assert.equal(brainNode.label, "Desire to Be Chosen");
  assert.equal(brainNode.seedId, graphNode.id);
  assert.equal(brainNode.layers.cognitive.some((spoke) =>
    spoke.text === "Desire to Be Chosen"
  ), true);
  assert.equal(brainNode.layers.affective.some((spoke) =>
    spoke.text === "desire"
  ), true);
  assert.equal(brainNode.activation.baseline >= 0.1, true);
  assert.equal(brainNode.activation.decayRate, 0.16);
});

test("compiles semantic brain context directly from selected seed ids", () => {
  const result = compileSemanticBrainContextFromSeedIds({
    characterId: "mara",
    seedIds: ["desire-vocabulary:desire_to_be_chosen"],
    inputText: "Desire to Be Chosen is the active pressure in this scene.",
    activationThreshold: 0.2,
  });

  assert.deepEqual(result.matchedConcepts, ["Desire to Be Chosen"]);
  assert.equal(result.brain.characterId, "mara");
  assert.equal(result.brain.runtime.activeNodeIds.length > 0, true);
  assert.match(result.promptContext, /Concept: Desire to Be Chosen/);
  assert.match(result.promptContext, /Emotional charge:/);
  assert.doesNotMatch(result.promptContext, /desire-vocabulary:desire_to_be_chosen/);
  assert.doesNotMatch(result.promptContext, /semantic-node|brain-spoke/);
});

test("preserves supplied character ids when creating brains from semantic seeds", () => {
  const brain = SemanticBrainService.createBrainFromSemanticSeeds(
    "Mara Vale",
    ["desire-vocabulary:desire_to_be_chosen"],
  );

  assert.equal(brain.characterId, "Mara Vale");
  assert.equal(brain.id, "brain:mara-vale");
});

function createSpokes(
  seed: string,
  layer: "cognitive" | "affective" | "somatic" | "behavioral",
  texts: readonly string[],
  startIntensity: number,
) {
  return texts.map((text, index) => ({
    id: `brain-spoke:${seed}:${layer}:${index + 1}`,
    text,
    intensity: Math.max(0.25, startIntensity - index * 0.03),
    tags: [seed, layer],
  }));
}
