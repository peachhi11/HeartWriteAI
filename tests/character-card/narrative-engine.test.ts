import assert from "node:assert/strict";
import test from "node:test";

import {
  compileChatPrompt,
} from "../../lib/character-card/promptRuntime";
import {
  createContinuityCanonLedger,
} from "../../lib/continuityCanonLedger";
import { NarrativeRuntimeStateSchema } from "../../lib/narrativeEngine";
import {
  compileNarrativeRuntimePromptContext,
  createDefaultNarrativeRuntimeState,
  processNarrativeTurn,
  type NarrativeRuntimeState,
} from "../../lib/character-card/narrativeEngine";

test("creates a default narrative runtime state", () => {
  const state = createDefaultNarrativeRuntimeState({
    characterId: "julian",
  });

  assert.equal(state.schemaVersion, 1);
  assert.equal(NarrativeRuntimeStateSchema.parse(state).schemaVersion, 1);
  assert.equal(state.characterId, "julian");
  assert.equal(state.relationshipStage, "strangers");
  assert.equal(state.arcPhase, "initiation");
  assert.equal(state.axes.trust, 25);
});

test("major events can force cooperation before trust fully catches up", () => {
  const state = createDefaultNarrativeRuntimeState({
    characterId: "mara",
    relationshipStage: "active_adversaries",
    axes: {
      trust: 5,
      affection: -20,
      respect: 20,
    },
  });

  const result = processNarrativeTurn(state, {
    label: "Forced rescue",
    summary:
      "{{user}} pulls {{char}} out of a burning stairwell during the first crisis.",
    tier: "major_event",
    outcome: "escalate",
    tags: ["rescue", "first_crisis", "danger"],
  });

  assert.equal(result.previousStage, "active_adversaries");
  assert.equal(result.nextStage, "reluctant_partners");
  assert.equal(result.stageChanged, true);
  assert.deepEqual(result.activatedGates, ["first_crisis"]);
  assert.match(result.causeFrame.interpretation, /reluctant reliance/i);
  assert.match(result.promptContext, /cooperation before trust/i);
});

test("relationship stages advance one adjacent step even when metrics spike", () => {
  const state = createDefaultNarrativeRuntimeState({
    characterId: "rowan",
    relationshipStage: "strangers",
    axes: {
      trust: 90,
      affection: 90,
      romanticTension: 90,
      physicalAttraction: 90,
      respect: 90,
    },
  });

  const result = processNarrativeTurn(state, {
    label: "Overloaded romantic beat",
    summary:
      "A confession, kiss, public choice, and sacrifice all happen in the same impossible beat.",
    tier: "major_event",
    outcome: "reveal",
    tags: ["confession", "kiss", "public choice", "sacrifice"],
  });

  assert.equal(result.nextStage, "acquaintances");
  assert.notEqual(result.nextStage, "intimate_partners");
  assert.match(result.promptContext, /Relationship stage: Acquaintances/);
});

test("event gates keep slow-burn attraction from skipping its route proof", () => {
  const base = createDefaultNarrativeRuntimeState({
    characterId: "ivy",
    relationshipStage: "casual_allies",
    arcPhase: "development",
    axes: {
      trust: 55,
      affection: 55,
      romanticTension: 70,
      physicalAttraction: 70,
      respect: 60,
    },
  });

  const blocked = processNarrativeTurn(base, {
    label: "Lingering look",
    summary: "They stand close and fail to look away.",
    tier: "micro_event",
    outcome: "escalate",
    tags: ["proximity", "attraction"],
  });

  assert.equal(blocked.nextStage, "casual_allies");

  const confidant = processNarrativeTurn(blocked.state, {
    label: "Shared secret",
    summary: "{{char}} admits a private truth that no one else knows.",
    tier: "meso_event",
    outcome: "reveal",
    tags: ["shared_secret", "secret", "vulnerable"],
  });

  assert.equal(confidant.nextStage, "confidants");
  assert.deepEqual(confidant.activatedGates, ["shared_secret"]);

  const unlocked = processNarrativeTurn(confidant.state, {
    label: "Attraction after trust",
    summary:
      "The shared secret changes the air between them, and the next lingering look no longer feels casual.",
    tier: "micro_event",
    outcome: "escalate",
    tags: ["attraction", "proximity", "shared_secret"],
  });

  assert.equal(unlocked.nextStage, "unspoken_attraction");
});

test("betrayal creates rupture memory and close-stage emergency shift", () => {
  const state = createDefaultNarrativeRuntimeState({
    characterId: "elian",
    relationshipStage: "mutual_longing",
    arcPhase: "escalation",
    axes: {
      trust: 40,
      affection: 65,
      romanticTension: 70,
      physicalAttraction: 60,
      respect: 65,
    },
  });

  const result = processNarrativeTurn(state, {
    label: "Broken promise revealed",
    summary: "{{char}} learns {{user}} kept a promise-breaking secret behind their back.",
    tier: "major_event",
    outcome: "rupture",
    tags: ["betrayal", "broken promise", "secret"],
  });

  assert.equal(result.nextStage, "betrayed");
  assert.equal(result.state.arcPhase, "crisis_turning_point");
  assert.equal(result.state.memories.length, 1);
  assert.equal(result.state.memories[0]?.pinned, true);
  assert.match(result.state.memories[0]?.meaning ?? "", /danger to trust/i);
});

test("recalls compressed relationship memories when similar pressure returns", () => {
  const state = createDefaultNarrativeRuntimeState({
    characterId: "noah",
    relationshipStage: "acquaintances",
  });

  const first = processNarrativeTurn(state, {
    label: "Missed goodnight text",
    summary: "A goodnight text goes unanswered and leaves {{char}} braced for distance.",
    tier: "meso_event",
    outcome: "escalate",
    tags: ["silence", "goodbye", "delayed reply"],
    memoryWeight: 70,
  });

  const second = processNarrativeTurn(first.state, {
    label: "Another delayed reply",
    summary: "The reply arrives late again, and the old silence pattern returns.",
    tier: "micro_event",
    outcome: "maintain",
    tags: ["silence", "delayed reply"],
  });

  assert.equal(second.recalledMemories.length, 1);
  assert.match(second.recalledMemories[0]?.summary ?? "", /goodnight text/i);
});

test("prompt projection is concise and does not expose internal ids or raw scores", () => {
  const state = createDefaultNarrativeRuntimeState({
    characterId: "seren",
    relationshipStage: "unspoken_attraction",
    arcPhase: "development",
    axes: {
      trust: 48,
      affection: 35,
      romanticTension: 72,
    },
    causeProfile: {
      immutableLaws: [
        {
          id: "law:protect_autonomy",
          label: "Protect autonomy before comfort",
          priority: 1,
          description:
            "The character chooses agency over easy reassurance.",
          protects: ["autonomy"],
          pressuredBy: ["being ordered", "loss of choice"],
          generatedBehaviors: ["sets a boundary before softening"],
          hiddenNeed: "freedom within love",
        },
      ],
    },
  });

  const result = processNarrativeTurn(state, {
    label: "Loss of choice",
    summary: "{{user}} makes a decision for {{char}} without asking.",
    tier: "meso_event",
    outcome: "escalate",
    tags: ["being ordered", "loss of choice"],
  });
  const prompt = compileNarrativeRuntimePromptContext(result.state);

  assert.match(prompt, /Relationship stage: Unspoken attraction/);
  assert.match(prompt, /Law pressure: Protect autonomy before comfort/);
  assert.doesNotMatch(prompt, /law:protect_autonomy/);
  assert.doesNotMatch(prompt, /first_crisis|shared_secret|score|72/);
});

test("chat prompt compiler can include narrative runtime context", () => {
  const state: NarrativeRuntimeState = processNarrativeTurn(
    createDefaultNarrativeRuntimeState({
      characterId: "mara",
      relationshipStage: "active_adversaries",
    }),
    {
      label: "Forced alliance",
      summary: "{{user}} and {{char}} fight side by side in a crisis.",
      tier: "major_event",
      outcome: "escalate",
      tags: ["first_crisis", "fights side by side"],
    },
  ).state;

  const compiled = compileChatPrompt({
    appSystemPrompt: "Write the next reply.",
    card: {
      data: {
        name: "Mara",
        description: "A guarded medic.",
      },
    },
    narrativeRuntime: state,
    chatHistory: [{ speaker: "User", content: "Stay behind me." }],
  });

  assert.match(compiled.contextBlock, /\[NARRATIVE RUNTIME\]/);
  assert.match(compiled.contextBlock, /Reluctant partners/);
  assert.match(compiled.contextBlock, /\[RECENT CHAT\]/);
});

test("chat prompt compiler can include continuity canon context", () => {
  const ledger = createContinuityCanonLedger({
    characterId: "mara",
    facts: [
      {
        id: "fact:promise",
        category: "relationship",
        scope: "story_truth",
        statement: "Mara remembers the promise made at the clinic door.",
        source: {
          tier: "story_truth",
          label: "Canon Ledger Test",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        evidence: [],
        tags: ["promise"],
        active: true,
        confidence: 80,
        promptVisibility: "prompt_safe",
        hiddenFromUser: false,
      },
    ],
  });

  const compiled = compileChatPrompt({
    appSystemPrompt: "Write the next reply.",
    card: {
      data: {
        name: "Mara",
        description: "A guarded medic.",
      },
    },
    continuityCanonLedger: ledger,
  });

  assert.match(compiled.contextBlock, /\[CONTINUITY CANON\]/);
  assert.match(compiled.contextBlock, /clinic door/);
  assert.doesNotMatch(compiled.contextBlock, /fact:promise/);
});
