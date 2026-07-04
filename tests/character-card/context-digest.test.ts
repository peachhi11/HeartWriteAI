import assert from "node:assert/strict";
import test from "node:test";

import {
  buildContextDigest,
  compileContextDigestPromptContext,
  runContextDigestMaintenance,
  spreadSemanticGraphActivation,
} from "../../lib/character-card/contextDigest";
import {
  createContinuityCanonLedger,
} from "../../lib/character-card/continuityCanonLedger";
import {
  createDefaultNarrativeRuntimeState,
  processNarrativeTurn,
  type NarrativeMemory,
} from "../../lib/character-card/narrativeEngine";
import {
  compileChatPrompt,
} from "../../lib/character-card/promptRuntime";
import {
  normalizeCharacterBrain,
  type CharacterBrain,
} from "../../lib/character-card/semanticBrainService";

function createTestBrain(): CharacterBrain {
  return normalizeCharacterBrain({
    id: "brain:mara",
    characterId: "mara",
    version: 1,
    nodes: [
      {
        id: "semantic-node:mara:abandonment",
        seedId: "fear_of_abandonment",
        label: "Fear of abandonment",
        layers: {
          cognitive: [
            {
              id: "brain-spoke:mara:cognitive:1",
              text: "Distance can feel like loss.",
              intensity: 0.9,
              tags: ["attachment"],
            },
          ],
          affective: [
            {
              id: "brain-spoke:mara:affective:1",
              text: "Anxious longing",
              intensity: 0.8,
              tags: ["attachment"],
            },
          ],
          somatic: [
            {
              id: "brain-spoke:mara:somatic:1",
              text: "Throat tightening",
              intensity: 0.75,
              tags: ["body"],
            },
          ],
          behavioral: [
            {
              id: "brain-spoke:mara:behavioral:1",
              text: "Hesitates before saying goodbye",
              intensity: 0.74,
              tags: ["visible"],
            },
          ],
        },
        activation: {
          current: 0.74,
          baseline: 0.12,
          decayRate: 0.1,
          lastTurn: 4,
        },
        links: [],
      },
    ],
    runtime: {
      turn: 4,
      activeNodeIds: [],
    },
  });
}

test("builds prompt-safe context digest across memory lanes", () => {
  const runtime = processNarrativeTurn(
    createDefaultNarrativeRuntimeState({
      characterId: "mara",
      relationshipStage: "unspoken_attraction",
      arcPhase: "development",
    }),
    {
      label: "Goodbye at the clinic door",
      summary:
        "{{user}} says goodbye after promising to come back before dawn.",
      tier: "meso_event",
      outcome: "escalate",
      tags: ["goodbye", "promise", "attachment"],
      memoryWeight: 82,
    },
  ).state;
  const ledger = createContinuityCanonLedger({
    characterId: "mara",
    facts: [
      {
        id: "fact:clinic-promise",
        category: "relationship",
        scope: "story_truth",
        statement: "Mara remembers the promise made at the clinic door.",
        source: {
          tier: "story_truth",
          label: "Test Ledger",
          sourceId: "internal-source-1",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        evidence: ["turn 4"],
        tags: ["promise"],
        active: true,
        confidence: 90,
        promptVisibility: "prompt_safe",
        hiddenFromUser: false,
      },
    ],
    hardConstraints: [
      {
        id: "constraint:injured-voice",
        label: "Uses written replies while injured",
        rule: "Mara cannot speak aloud while injured.",
        alternativeAction: "writes, gestures, or signals for help",
        source: {
          tier: "character_truth",
          label: "Character Engine",
          reviewRequired: false,
          hiddenFromUser: false,
        },
        scope: "character_truth",
        tags: ["alternative_action", "injury"],
        promptVisibility: "prompt_safe",
      },
    ],
  });
  const digest = buildContextDigest({
    characterBrain: createTestBrain(),
    continuityCanonLedger: ledger,
    narrativeRuntime: runtime,
    semanticSeedIds: ["fear_of_abandonment"],
    tokenBudget: 520,
  });

  assert.equal(digest.schemaVersion, 1);
  assert.ok(digest.lanes.episodicMemories.length > 0);
  assert.ok(digest.lanes.semanticFacts.length > 0);
  assert.ok(digest.lanes.behaviorPatterns.length > 0);
  assert.ok(digest.lanes.compressedPlotSummaries.length > 0);
  assert.match(digest.promptContext, /clinic door/i);
  assert.match(digest.promptContext, /writes, gestures, or signals/i);
  assert.match(digest.promptContext, /Fear of abandonment/i);
  assert.doesNotMatch(
    digest.promptContext,
    /fact:clinic-promise|constraint:injured-voice|semantic-node|sourceId|score|metric/i,
  );
});

test("spreads activation across semantic graph links without requiring exact keyword matches", () => {
  const activations = spreadSemanticGraphActivation(["fear_of_abandonment"], {
    includeParents: true,
    includeRelated: true,
    limit: 8,
  });
  const labels = activations.map((activation) => activation.label);

  assert.ok(labels.includes("Fear of abandonment"));
  assert.ok(labels.includes("Fear of replacement"));
  assert.ok(activations.every((activation) => activation.activation > 0));
});

test("deep maintenance compresses recurring narrative memory clusters", () => {
  const memories: NarrativeMemory[] = [
    {
      id: "memory:silence:1",
      tier: "relationship_memory",
      summary: "The first unanswered message made distance feel unsafe.",
      meaning: "Silence could mean abandonment.",
      stateImpact: "Mara became guarded around delayed replies.",
      emotionalWeight: 78,
      turn: 1,
      tags: ["silence", "attachment"],
      pinned: false,
    },
    {
      id: "memory:silence:2",
      tier: "relationship_memory",
      summary: "A missed check-in repeated the old silence pattern.",
      meaning: "Return rituals matter.",
      stateImpact: "Mara watched for follow-through.",
      emotionalWeight: 74,
      turn: 2,
      tags: ["silence", "promise"],
      pinned: false,
    },
    {
      id: "memory:promise",
      tier: "relationship_memory",
      summary: "A later promise softened the rupture.",
      meaning: "Repair can work when it is repeated.",
      stateImpact: "Mara allowed cautious hope.",
      emotionalWeight: 84,
      turn: 3,
      tags: ["promise", "repair"],
      pinned: false,
    },
  ];
  const runtime = createDefaultNarrativeRuntimeState({
    characterId: "mara",
  });
  const maintained = runContextDigestMaintenance({
    mode: "deep",
    narrativeRuntime: {
      ...runtime,
      memories,
      turn: 5,
    },
  });

  assert.equal(maintained.report.mode, "deep");
  assert.equal(maintained.report.compressedMemoryCount, 1);
  assert.ok(
    maintained.memories.some((memory) =>
      /related memories keep returning around Silence/i.test(memory.summary),
    ),
  );
  assert.match(maintained.digest.promptContext, /Silence/i);
});

test("prompt runtime can include a compiled context digest section", () => {
  const digest = buildContextDigest({
    chatHistory: [
      {
        role: "assistant",
        content: "I promised I would come back before dawn.",
        milestone: true,
        tags: ["promise"],
      },
      {
        role: "user",
        content: "Then keep the promise.",
        tags: ["promise"],
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
    contextDigest: digest,
  });

  assert.match(compiled.contextBlock, /\[CONTEXT DIGEST\]/);
  assert.match(compiled.contextBlock, /promised I would come back/);
  assert.doesNotMatch(compiled.contextBlock, /context-digest:chat/);
  assert.equal(
    compileContextDigestPromptContext(digest).length > 0,
    true,
  );
});
