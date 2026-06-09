import assert from "node:assert/strict";
import test from "node:test";

import {
  JulianBrainTemplate,
  createJulianBrainTemplate,
} from "../../lib/character-card/semanticBrainTemplates";
import {
  createSemanticBrainChatTurn,
  createSemanticBrainSystemPrompt,
} from "../../lib/character-card/semanticBrainChatTurn";
import {
  SemanticBrainService,
  normalizeCharacterBrain,
  type CharacterBrain,
} from "../../lib/semanticBrain";

test("barrel exports semantic brain service and Julian template", () => {
  assert.equal(typeof SemanticBrainService.processInput, "function");
  assert.equal(JulianBrainTemplate.characterId, "julian");
});

test("creates a chat turn payload with updated brain context", () => {
  const turn = createSemanticBrainChatTurn({
    userMessage:
      "I trust you, but the secret goodbye made me feel alone. Please do not leave.",
    previousBrainState: createJulianBrainTemplate(),
    characterName: "Julian",
  });

  assert.deepEqual(turn.matchedConcepts, ["Intimacy", "Abandonment"]);
  assert.equal(turn.updatedBrain.runtime.turn, 1);
  assert.equal(turn.updatedBrain.runtime.activeNodeIds[0], "semantic-node:julian:abandonment");
  assert.equal(turn.llmPayload.length, 2);
  assert.deepEqual(
    turn.llmPayload.map((message) => message.role),
    ["system", "user"],
  );
  assert.match(turn.llmPayload[0]?.content ?? "", /You are playing Julian/);
  assert.match(turn.llmPayload[0]?.content ?? "", /Current character semantic state/);
  assert.match(turn.llmPayload[0]?.content ?? "", /Concept: Abandonment/);
  assert.match(turn.llmPayload[1]?.content ?? "", /secret goodbye/);
});

test("routes goodbye and leaving language into Julian abandonment cues", () => {
  const turn = createSemanticBrainChatTurn({
    userMessage: "I have to leave tomorrow morning, goodbye.",
    previousBrainState: createJulianBrainTemplate(),
  });

  assert.deepEqual(turn.matchedConcepts, ["Abandonment"]);
  assert.equal((turn.updatedBrain.nodes[0]?.activation.current ?? 1) < 0.25, true);
  assert.equal(turn.updatedBrain.nodes[1]?.activation.current, 0.36);
  assert.match(turn.brainContextPrompt, /Concept: Abandonment/);
  assert.match(turn.brainContextPrompt, /stomach dropping/);
  assert.match(turn.brainContextPrompt, /cold hands/);
  assert.match(turn.brainContextPrompt, /bitter laugh/);
  assert.match(turn.brainContextPrompt, /shape subtext, pacing, body language/);
  assert.doesNotMatch(turn.brainContextPrompt, /Concept: Intimacy/);
  assert.doesNotMatch(turn.brainContextPrompt, /semantic-node|manual:julian|brain-spoke/);
});

test("keeps semantic context invisible by returning it only in the system payload", () => {
  const turn = createSemanticBrainChatTurn({
    userMessage: "Please do not leave me alone. Goodbye.",
    previousBrainState: createJulianBrainTemplate(),
    systemPrompt: "You are playing Julian. Stay grounded and concise.",
  });

  assert.match(turn.llmPayload[0]?.content ?? "", /Stay grounded and concise/);
  assert.match(turn.llmPayload[0]?.content ?? "", /Body response:/);
  assert.doesNotMatch(turn.llmPayload[1]?.content ?? "", /semantic state/i);
  assert.doesNotMatch(turn.llmPayload[1]?.content ?? "", /Body response/i);
});

test("omits blank semantic context when no node crosses the activation threshold", () => {
  const quietBrain: CharacterBrain = normalizeCharacterBrain({
    id: "brain:julian-quiet",
    characterId: "julian",
    version: 1,
    traits: {},
    nodes: [
      {
        id: "semantic-node:quiet:intimacy",
        seedId: "manual:quiet:intimacy",
        label: "Intimacy",
        layers: {
          cognitive: [{
            id: "brain-spoke:quiet:intimacy:cognitive:1",
            text: "safe",
            intensity: 0.5,
            tags: [],
          }],
          affective: [{
            id: "brain-spoke:quiet:intimacy:affective:1",
            text: "yearning",
            intensity: 0.5,
            tags: [],
          }],
          somatic: [{
            id: "brain-spoke:quiet:intimacy:somatic:1",
            text: "warmth in chest",
            intensity: 0.5,
            tags: [],
          }],
          behavioral: [{
            id: "brain-spoke:quiet:intimacy:behavioral:1",
            text: "softens voice tone",
            intensity: 0.5,
            tags: [],
          }],
        },
        activation: {
          current: 0.01,
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

  const turn = createSemanticBrainChatTurn({
    userMessage: "Hello.",
    previousBrainState: quietBrain,
  });

  assert.equal(turn.brainContextPrompt, "");
  assert.equal(
    turn.llmPayload[0]?.content,
    "You are playing Julian in a romance roleplay. Act out their dialogue naturally.",
  );
});

test("creates semantic brain system prompts from custom base text", () => {
  const prompt = createSemanticBrainSystemPrompt({
    brain: createJulianBrainTemplate(),
    brainContextPrompt: "Current character semantic state\n\nConcept: Intimacy",
    systemPrompt: "Play Julian with restrained, grounded prose.",
  });

  assert.equal(
    prompt,
    [
      "Play Julian with restrained, grounded prose.",
      "Current character semantic state\n\nConcept: Intimacy",
    ].join("\n\n"),
  );
});
