import assert from "node:assert/strict";
import test from "node:test";

import {
  RUNTIME_STORY_STATE_VOCABULARY_STANDARD_SEEDS,
  compileRuntimeStoryStateGuidance,
  getNextRuntimeRhythmState,
  getRuntimeAgentById,
  runtimeAgentRoster,
  runtimeArcLevels,
  runtimeDebuggerCommands,
  runtimeLorebookUpdateProtocol,
  runtimeRhythmCycle,
  runtimeSnapshotSections,
  runtimeStoryStatePrinciples,
} from "../../data/runtimeStoryStateVocabularyPresets";
import { findSemanticSeedGraphNodeById } from "../../data/semanticSeedRegistry";
import {
  getRichStandardVocabularySeedsBySource,
  searchStandardVocabularySeeds,
} from "../../data/standardVocabularySeedRegistry";
import {
  createDefaultNarrativeRuntimeState,
  processNarrativeTurn,
} from "../../lib/character-card/narrativeEngine";
import {
  compileRuntimeSessionLogEntry,
  compileRuntimeStorySnapshotPrompt,
  createRuntimeSessionLogEntry,
  createRuntimeStorySnapshot,
  inferRuntimeRhythmState,
} from "../../lib/character-card/runtimeStorySnapshot";

test("defines runtime as mutable story truth with snapshot sections", () => {
  assert.equal(
    runtimeStoryStatePrinciples.includes(
      "Runtime is mutable story truth, not portable character truth.",
    ),
    true,
  );
  assert.deepEqual(runtimeRhythmCycle, [
    "crisis",
    "recovery",
    "mundane",
    "security",
    "disruption",
  ]);
  assert.equal(getNextRuntimeRhythmState("security"), "disruption");
  assert.equal(runtimeSnapshotSections.length, 6);
  assert.equal(runtimeSnapshotSections[0]?.id, "story_position");
  assert.equal(
    runtimeSnapshotSections
      .find((section) => section.id === "psychological_state")
      ?.fields.some((field) => field.field === "lieStatus"),
    true,
  );
});

test("stores runtime agent roster, arc levels, lorebook protocol, and debugger commands", () => {
  const lorebookAgent = getRuntimeAgentById("lorebook_agent");
  const debuggerCommand = runtimeDebuggerCommands.find(
    (command) => command.id === "audit",
  );

  assert.equal(runtimeAgentRoster.length, 11);
  assert.equal(lorebookAgent?.phase, "post_processing");
  assert.match(lorebookAgent?.activationRule ?? "", /8 to 10 messages/);
  assert.equal(runtimeArcLevels.map((level) => level.id).join(","), "macro,arc,scene,rhythm");
  assert.equal(runtimeLorebookUpdateProtocol.sessionLogFields.includes("nextAnticipatedBeat"), true);
  assert.equal(debuggerCommand?.command, "OOC: AUDIT");
});

test("projects runtime story state into vocabulary search and semantic graph nodes", () => {
  const seeds = getRichStandardVocabularySeedsBySource(
    "runtime-story-state-vocabulary",
  );
  const searchResults = searchStandardVocabularySeeds("OOC: AUDIT", {
    sourceIds: ["runtime-story-state-vocabulary"],
    limit: 5,
  });
  const graphNode = findSemanticSeedGraphNodeById(
    "runtime-story-state-vocabulary:runtime_story_state",
  );

  assert.equal(seeds.length, RUNTIME_STORY_STATE_VOCABULARY_STANDARD_SEEDS.length);
  assert.equal(searchResults[0]?.label, "Runtime Debugger OOC Commands");
  assert.equal(graphNode?.category, "states");
  assert.equal(graphNode?.label, "Runtime Story State");
  assert.match(compileRuntimeStoryStateGuidance(), /what is true right now/i);
});

test("creates runtime story snapshots from narrative runtime without exposing raw state", () => {
  const base = createDefaultNarrativeRuntimeState({
    characterId: "julian",
    relationshipStage: "mutual_longing",
    arcPhase: "escalation",
    axes: {
      trust: 62,
      affection: 70,
      romanticTension: 82,
      physicalAttraction: 74,
      emotionalRegulation: 40,
    },
    causeProfile: {
      activeDefenses: [
        {
          id: "defense:humor",
          label: "Humor Deflection",
          trigger: "emotional exposure",
          behavior: "jokes before admitting fear",
        },
      ],
    },
  });
  const runtime = processNarrativeTurn(base, {
    label: "Goodbye pressure",
    summary: "{{user}} says goodbye before a dangerous separation.",
    tier: "major_event",
    outcome: "escalate",
    tags: ["goodbye", "leave", "separation"],
  }).state;

  const snapshot = createRuntimeStorySnapshot({
    runtime,
    characterName: "Julian",
    scene: "Julian stands in the doorway after the goodbye lands.",
    userPersona: {
      mood:
        "The user persona mood has not been provided; visible dialogue should remain the only evidence.",
    },
  });
  const prompt = compileRuntimeStorySnapshotPrompt(snapshot);

  assert.equal(snapshot.character.rhythmState, inferRuntimeRhythmState(runtime));
  assert.equal(snapshot.character.woundStatus, "triggered");
  assert.equal(snapshot.character.lieStatus, "cracking");
  assert.equal(snapshot.character.arousalPhase, "focused");
  assert.match(prompt, /Runtime is mutable story truth/);
  assert.match(prompt, /Goodbye pressure/);
  assert.match(prompt, /USER PERSONA RUNTIME/);
  assert.doesNotMatch(prompt, /defense:humor|first_crisis|82|trust:/i);
  assert.doesNotMatch(prompt, /\{\{user\}\}|\{\{char\}\}/);
});

test("creates session log entries from the runtime snapshot", () => {
  const runtime = processNarrativeTurn(
    createDefaultNarrativeRuntimeState({
      characterId: "mara",
      relationshipStage: "reluctant_partners",
      arcPhase: "development",
    }),
    {
      label: "Shared crisis",
      summary: "{{char}} and {{user}} survive an ambush together.",
      tier: "major_event",
      outcome: "reveal",
      tags: ["shared crisis", "trust"],
    },
  ).state;
  const snapshot = createRuntimeStorySnapshot({
    runtime,
    activeArc: "The ambush has turned a truce into practical reliance.",
    activeMemories: ["The ambush proved they can survive together."],
  });
  const entry = createRuntimeSessionLogEntry(snapshot, {
    activePlotThreads: ["Who arranged the ambush remains unresolved."],
  });
  const compiled = compileRuntimeSessionLogEntry(entry);

  assert.equal(entry.recentEvents[0], "The ambush proved they can survive together.");
  assert.match(compiled, /SESSION LOG/);
  assert.match(compiled, /Relationship Shifts:/);
  assert.match(compiled, /Next Anticipated Beat:/);
});
