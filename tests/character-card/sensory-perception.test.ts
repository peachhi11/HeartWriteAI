import assert from "node:assert/strict";
import test from "node:test";

import {
  createDefaultSensoryPerception,
  createSensoryPerceptionContext,
  getActivePhysicalTellGates,
  resolveSensoryGateMatches,
  SENSORY_PERCEPTION_EXTENSION_KEY,
  SensoryPerceptionSchema,
  softlySelectPhysicalTellGates,
} from "../../lib/character-card/sensoryPerception";
import { compileChatPrompt } from "../../lib/character-card/promptRuntime";
import {
  appendSensoryPerceptionContext,
  chatRequestSchema,
} from "../../lib/character-card/postHistoryRuntime";

test("matches sensory gates through keywords and narrative event state", () => {
  const perception = createDefaultSensoryPerception();

  const withoutTrust = resolveSensoryGateMatches(
    "She leans in close and lowers her voice.",
    perception,
    {},
  );
  const withTrust = resolveSensoryGateMatches(
    "She leans in close and lowers her voice.",
    perception,
    { mutual_interest: true },
  );
  const blocked = resolveSensoryGateMatches(
    "She leans in close and lowers her voice.",
    perception,
    { distance_requested: true, mutual_interest: true },
  );

  assert.deepEqual(
    withoutTrust.map((gate) => gate.id),
    [],
  );
  assert.deepEqual(
    withTrust.map((gate) => gate.id),
    ["close_proximity"],
  );
  assert.deepEqual(
    blocked.map((gate) => gate.id),
    [],
  );
});

test("formats sensory perception as private runtime context", () => {
  const perception = createDefaultSensoryPerception({
    visual: {
      focus: ["eye contact", "small expressions"],
      style: "attentive",
      notices: ["hesitation"],
    },
    emotional: {
      affectionStyle: "protective",
      attunement: 5,
      jealousyLevel: 1,
    },
  });
  const matchedGates = resolveSensoryGateMatches(
    "I missed you. Please don't leave.",
    perception,
  );
  const context = createSensoryPerceptionContext(perception, matchedGates);

  assert.match(context, /\[SENSORY PERCEPTION\]/);
  assert.match(context, /eye contact, small expressions/);
  assert.match(context, /ACTIVE SENSORY GATES: vulnerability/);
  assert.match(context, /prioritizes reassurance over flirtation/);
});

test("includes nervous body language as observable inference cues", () => {
  const perception = createDefaultSensoryPerception();
  const context = createSensoryPerceptionContext(perception);

  assert.match(context, /BODY LANGUAGE REFERENCE/);
  assert.match(context, /nervous\/anxious/);
  assert.match(context, /darting eyes or avoiding eye contact/);
  assert.match(context, /shaky or trembling voice/);
  assert.match(context, /subtly covering the mouth/);
  assert.match(context, /possible anxiety cues only/);
});

test("includes romance body language description banks without forcing verbatim reuse", () => {
  const perception = createDefaultSensoryPerception();
  const context = createSensoryPerceptionContext(perception);

  assert.match(context, /BODY LANGUAGE DESCRIPTION BANK/);
  assert.match(context, /worry: examples=/);
  assert.match(context, /They wrung their hands together/);
  assert.match(context, /love: examples=/);
  assert.match(context, /Their hand brushed lightly/);
  assert.match(context, /embarrassment: examples=/);
  assert.match(context, /not lines to repeat verbatim/);
});

test("matches physical tells through hard keywords and event gates", () => {
  const perception = createDefaultSensoryPerception();
  const withoutTrust = getActivePhysicalTellGates(
    "You look tired and upset.",
    {},
    perception.physicalTellGates,
  );
  const withTrust = getActivePhysicalTellGates(
    "You look tired and upset.",
    { trust_established: true },
    perception.physicalTellGates,
  );
  const blocked = getActivePhysicalTellGates(
    "You look tired and upset.",
    { distance_requested: true, trust_established: true },
    perception.physicalTellGates,
  );

  assert.deepEqual(
    withoutTrust.map((gate) => gate.id),
    [],
  );
  assert.deepEqual(
    withTrust.map((gate) => gate.id),
    ["protective_concern"],
  );
  assert.deepEqual(
    blocked.map((gate) => gate.id),
    [],
  );
});

test("includes contextual physical tell references and system variables", () => {
  const perception = createDefaultSensoryPerception();
  const context = createSensoryPerceptionContext(perception);

  assert.match(context, /PHYSICAL TELL REFERENCE/);
  assert.match(context, /eye_contact/);
  assert.match(context, /avoiding eye contact=vulnerability, shame, overwhelm/);
  assert.match(context, /jealousy/);
  assert.match(context, /jaw tightening=jealousy suppression/);
  assert.match(context, /attachment_and_power/);
  assert.match(context, /PHYSICAL TELL VARIABLES/);
  assert.match(context, /Emotional Leakage=involuntary emotional visibility/);
  assert.match(context, /contradictions between words, body, and repeated behavior/);
});

test("includes behavioural tell references as repeated action-pattern subtext", () => {
  const perception = createDefaultSensoryPerception();
  const context = createSensoryPerceptionContext(perception);

  assert.match(context, /BEHAVIOURAL TELL REFERENCE/);
  assert.match(context, /attraction/);
  assert.match(context, /seeking interaction constantly=attraction and attachment/);
  assert.match(context, /avoidant_guarded/);
  assert.match(context, /withdrawing after intimacy=engulfment fear/);
  assert.match(context, /relationship_investment/);
  assert.match(context, /future planning=permanence thinking/);
  assert.match(context, /BEHAVIOURAL TELL VARIABLES/);
  assert.match(context, /Repair Pursuit=reconnection effort tendency/);
  assert.match(context, /repeated action patterns, not one-off proof/);
});

test("uses physical tell weights softly and respects cooldown state", () => {
  const gate = {
    blockedByEvents: [],
    cooldownTurns: 3,
    emotionalState: "hidden attraction",
    id: "always_soft_selected",
    requiredEvents: [],
    tells: ["holds eye contact a second too long"],
    triggerKeywords: ["compliment"],
    visibility: "subtle" as const,
    weight: 1,
  };

  assert.deepEqual(
    softlySelectPhysicalTellGates("A direct compliment.", [gate], {
      currentTurn: 10,
      maxSelected: 1,
    }).map((selectedGate) => selectedGate.id),
    ["always_soft_selected"],
  );
  assert.deepEqual(
    softlySelectPhysicalTellGates("A direct compliment.", [gate], {
      currentTurn: 12,
      lastUsedTurns: {
        always_soft_selected: 10,
      },
      maxSelected: 1,
    }).map((selectedGate) => selectedGate.id),
    [],
  );
  assert.deepEqual(
    softlySelectPhysicalTellGates("A direct compliment.", [gate], {
      currentTurn: 14,
      lastUsedTurns: {
        always_soft_selected: 10,
      },
      maxSelected: 1,
    }).map((selectedGate) => selectedGate.id),
    ["always_soft_selected"],
  );
});

test("reads sensory perception from card extensions during prompt compilation", () => {
  const perception = SensoryPerceptionSchema.parse({
    visual: {
      focus: ["body language"],
      style: "subtle",
    },
    romanticAttention: "shy_observer",
  });
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: {
      data: {
        name: "Nia",
        extensions: {
          [SENSORY_PERCEPTION_EXTENSION_KEY]: perception,
        },
      },
    },
  });

  assert.match(compiled.contextBlock, /\[SENSORY PERCEPTION\]/);
  assert.match(compiled.contextBlock, /body language/);
  assert.match(compiled.contextBlock, /ROMANTIC ATTENTION: shy_observer/);
});

test("chat runtime accepts sensory perception and appends active gate context", () => {
  const perception = createDefaultSensoryPerception();
  const request = chatRequestSchema.parse({
    characterConfig: {
      sensoryEventState: {
        mutual_interest: true,
      },
      physicalTellState: {
        currentTurn: 1,
      },
      sensoryPerception: perception,
    },
    messages: [
      {
        content: "I step near you, but I wait.",
        role: "user",
      },
    ],
  });
  const messages = appendSensoryPerceptionContext(
    request.messages,
    request.characterConfig?.sensoryPerception,
    request.characterConfig?.sensoryEventState,
  );

  assert.equal(messages.length, 2);
  assert.equal(messages[1].role, "system");
  assert.match(messages[1].content, /close_proximity/);
  assert.match(messages[1].content, /ACTIVE PHYSICAL TELLS/);
  assert.match(messages[1].content, /without escalating automatically/);
});
