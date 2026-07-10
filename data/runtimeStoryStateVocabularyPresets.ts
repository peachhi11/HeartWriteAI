import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type RuntimeRhythmState =
  | "crisis"
  | "recovery"
  | "mundane"
  | "security"
  | "disruption";

export type RuntimeSnapshotSectionId =
  | "story_position"
  | "character_state"
  | "psychological_state"
  | "relationship_state"
  | "active_memories"
  | "user_persona_runtime";

export type RuntimeAgentPhase =
  | "pre_generation"
  | "parallel"
  | "retrieval_only"
  | "post_processing"
  | "ooc_only";

export type RuntimeAgentRoleId =
  | "narrative_arc_controller"
  | "character"
  | "inner_character"
  | "user_shadow"
  | "narrator_npc"
  | "intimacy_coordinator"
  | "lorebook_agent"
  | "scenario_generator"
  | "scene_generator"
  | "editor"
  | "debugger";

export type RuntimeArcLevelId =
  | "macro"
  | "arc"
  | "scene"
  | "rhythm";

export type RuntimeDebuggerCommandId =
  | "analyse"
  | "score"
  | "debug"
  | "summary"
  | "audit"
  | "stop";

export interface RuntimeSnapshotFieldDefinition {
  field: string;
  purpose: string;
  promptRule: string;
}

export interface RuntimeSnapshotSectionDefinition {
  id: RuntimeSnapshotSectionId;
  label: string;
  description: string;
  fields: readonly RuntimeSnapshotFieldDefinition[];
}

export interface RuntimeAgentDefinition {
  id: RuntimeAgentRoleId;
  label: string;
  phase: RuntimeAgentPhase;
  role: string;
  activationRule: string;
}

export interface RuntimeArcLevelDefinition {
  id: RuntimeArcLevelId;
  label: string;
  structure: string;
  purpose: string;
}

export interface RuntimeDebuggerCommandDefinition {
  id: RuntimeDebuggerCommandId;
  command: string;
  output: string;
  activationRule: string;
}

export const runtimeStoryStatePrinciples = [
  "Runtime is mutable story truth, not portable character truth.",
  "Runtime answers what is true about the story right now.",
  "Everything in runtime can change when the story changes.",
  "Runtime may guide prompts, but it should not leak raw internal ids, numeric scores, or private agent names into character dialogue.",
  "Character truth belongs in the card; story truth belongs in lorebook or runtime; setting truth belongs in scenario.",
] as const;

export const runtimeRhythmCycle = [
  "crisis",
  "recovery",
  "mundane",
  "security",
  "disruption",
] as const satisfies readonly RuntimeRhythmState[];

export const runtimeSnapshotSections = [
  {
    id: "story_position",
    label: "Story Position",
    description:
      "The active arc, phase, and rhythm state that locate the story in its current movement.",
    fields: [
      {
        field: "activeArc",
        purpose: "Names the current micro-arc in one sentence.",
        promptRule: "Use as now-state context only; do not treat it as a fixed ending.",
      },
      {
        field: "arcPhase",
        purpose: "Names where the micro-arc currently sits.",
        promptRule: "Use to pace escalation, recovery, and resolution.",
      },
      {
        field: "rhythmState",
        purpose: "Tracks crisis, recovery, mundane, security, or disruption pressure.",
        promptRule: "Use rhythm to decide whether the story needs breath, pressure, or false safety.",
      },
    ],
  },
  {
    id: "character_state",
    label: "Character State",
    description:
      "The character's current scene, goal, mood, stress, fatigue, and hope.",
    fields: [
      {
        field: "scene",
        purpose: "States where the character is physically and emotionally right now.",
        promptRule: "Keep it present-tense to the active scene, not biography.",
      },
      {
        field: "goal",
        purpose: "States what the character wants right now.",
        promptRule: "Use as immediate behavior pressure, not a permanent motivation.",
      },
      {
        field: "mood",
        purpose: "Describes the current emotional state in a full sentence.",
        promptRule: "Prefer grounded emotional language over single-word tags.",
      },
      {
        field: "stress",
        purpose: "Names the current pressure level and source.",
        promptRule: "Make stress alter behavior without overriding character law.",
      },
      {
        field: "fatigue",
        purpose: "Tracks physical and emotional depletion.",
        promptRule: "Let fatigue modulate pacing, syntax, and restraint.",
      },
      {
        field: "hope",
        purpose: "Names what the character is holding onto right now.",
        promptRule: "Use hope as the counterweight to pressure.",
      },
    ],
  },
  {
    id: "psychological_state",
    label: "Psychological State",
    description:
      "The current wound, lie, and relational arousal phase as story-present states.",
    fields: [
      {
        field: "woundStatus",
        purpose: "Tracks whether the wound is dormant, active, or triggered.",
        promptRule: "If active, state what activated it in story evidence.",
      },
      {
        field: "lieStatus",
        purpose: "Tracks whether the character is operating from the lie, cracking, or glimpsing the truth.",
        promptRule: "Use for decision pressure; do not explain it as diagnostic text in dialogue.",
      },
      {
        field: "arousalPhase",
        purpose: "Tracks indifferent, aware, attached, or focused relational attention.",
        promptRule: "Treat as attention and attachment pressure, not automatic sexual escalation.",
      },
    ],
  },
  {
    id: "relationship_state",
    label: "Relationship State",
    description:
      "The current trust ladder position and dynamic for each active relationship.",
    fields: [
      {
        field: "relationshipLines",
        purpose: "Summarizes current dynamic toward each active character or persona.",
        promptRule: "Use qualitative labels and consequences, not raw numbers.",
      },
    ],
  },
  {
    id: "active_memories",
    label: "Active Memories",
    description:
      "The one to three recent events or emotional beats still live in the scene.",
    fields: [
      {
        field: "activeMemories",
        purpose: "Keeps only what should still affect behavior right now.",
        promptRule: "Prefer meaning and state impact over raw transcript recall.",
      },
    ],
  },
  {
    id: "user_persona_runtime",
    label: "User Persona Runtime",
    description:
      "A lighter relational snapshot for the active user persona.",
    fields: [
      {
        field: "mood",
        purpose: "Captures the persona's current emotional state if known.",
        promptRule: "Do not invent private user thoughts; compile only provided or inferable persona-state notes.",
      },
      {
        field: "goal",
        purpose: "Captures what the persona appears to want right now.",
        promptRule: "Use only explicit input or creator-provided persona runtime data.",
      },
      {
        field: "activeMemories",
        purpose: "Tracks recent beats still live for the persona.",
        promptRule: "Use as relationship context without puppeting user decisions.",
      },
    ],
  },
] as const satisfies readonly RuntimeSnapshotSectionDefinition[];

export const runtimeAgentRoster = [
  {
    id: "narrative_arc_controller",
    label: "Narrative Arc Controller",
    phase: "pre_generation",
    role: "Oversees rhythm, story direction, escalation, recovery, and private arc planning.",
    activationRule: "Always available as a hidden orchestration layer.",
  },
  {
    id: "character",
    label: "Character",
    phase: "parallel",
    role: "Writes the character's dialogue and action only.",
    activationRule: "Active during normal roleplay turns.",
  },
  {
    id: "inner_character",
    label: "Inner Character",
    phase: "parallel",
    role: "Checks character knowledge, consistency, and drift boundaries.",
    activationRule: "Active when continuity or character-law pressure matters.",
  },
  {
    id: "user_shadow",
    label: "User Shadow",
    phase: "retrieval_only",
    role: "Assists the player in writing, expanding, or polishing their own turn.",
    activationRule: "Activated only on explicit player request.",
  },
  {
    id: "narrator_npc",
    label: "Narrator / NPC",
    phase: "parallel",
    role: "Drives world events, environment, NPCs, and momentum hooks.",
    activationRule: "Active when the scene needs environment, NPC behavior, or plot pressure.",
  },
  {
    id: "intimacy_coordinator",
    label: "Intimacy Coordinator",
    phase: "post_processing",
    role: "Checks adult-gated intimate scenes for pacing, consent, variation, and repetition control.",
    activationRule: "Only active for eligible adult intimate scenes.",
  },
  {
    id: "lorebook_agent",
    label: "Lorebook Agent",
    phase: "post_processing",
    role: "Updates runtime snapshots, user persona runtime, and session log lorebook entries.",
    activationRule: "Runs every 8 to 10 messages or after significant story events.",
  },
  {
    id: "scenario_generator",
    label: "Scenario Generator",
    phase: "parallel",
    role: "Tracks current scenario and writes lorebook entries for new story developments.",
    activationRule: "Active when scenario truth changes or a new scenario is needed.",
  },
  {
    id: "scene_generator",
    label: "Scene Generator",
    phase: "parallel",
    role: "Tracks current scene and writes entries for locations and scene descriptions.",
    activationRule: "Active when location, scene state, or environmental pressure changes.",
  },
  {
    id: "editor",
    label: "Editor",
    phase: "post_processing",
    role: "Checks continuity, character consistency, tone drift, and pacing before output.",
    activationRule: "Runs last in the generation pipeline.",
  },
  {
    id: "debugger",
    label: "Debugger",
    phase: "ooc_only",
    role: "Provides diagnostics on scene meaning, consistency, scoring, and arc health.",
    activationRule: "Activated only by explicit OOC command.",
  },
] as const satisfies readonly RuntimeAgentDefinition[];

export const runtimeArcLevels = [
  {
    id: "macro",
    label: "Macro Arc",
    structure: "Yorke Five Acts or Hauge Six Stages",
    purpose: "Tracks overall long-form character transformation.",
  },
  {
    id: "arc",
    label: "Micro Arc",
    structure: "Harmon Story Circle or Watts Eight Points",
    purpose: "Tracks the current episodic arc that feeds the macro movement.",
  },
  {
    id: "scene",
    label: "Scene Arc",
    structure: "Jo-Ha-Kyu or Vonnegut Fortune Line",
    purpose: "Tracks individual scene pacing and emotional movement.",
  },
  {
    id: "rhythm",
    label: "Rhythm Cycle",
    structure: "Crisis / Recovery / Mundane / Security / Disruption",
    purpose: "Tracks when to escalate, release, or build false safety.",
  },
] as const satisfies readonly RuntimeArcLevelDefinition[];

export const runtimeLorebookUpdateProtocol = {
  trigger:
    "Every 8 to 10 messages, or when a significant story event changes state.",
  updateSequence: [
    "Identify the active character.",
    "Update the character runtime snapshot.",
    "Identify the active user persona.",
    "Update the light user persona runtime fields.",
    "Write session log entries for events, milestones, relationship shifts, emotional beats, scene status, location, time, and date.",
    "Flag significant state changes to the Narrative Arc Controller.",
  ],
  sessionLogFields: [
    "scene",
    "recentEvents",
    "relationshipShifts",
    "emotionalBeats",
    "activePlotThreads",
    "nextAnticipatedBeat",
  ],
} as const;

export const runtimeDebuggerCommands = [
  {
    id: "analyse",
    command: "OOC: ANALYSE",
    output:
      "Scene meaning, subtext, character consistency, tone drift, pacing stability, contradictions, and expected versus actual behavior.",
    activationRule: "Player-triggered only.",
  },
  {
    id: "score",
    command: "OOC: SCORE",
    output: "Score out of 10 with a brief breakdown.",
    activationRule: "Player-triggered only.",
  },
  {
    id: "debug",
    command: "OOC: DEBUG",
    output: "Full diagnostic on current state.",
    activationRule: "Player-triggered only.",
  },
  {
    id: "summary",
    command: "OOC: SUMMARY",
    output:
      "Major events, character developments, relationship developments, emotional beats, unresolved tensions, active plot threads, and current scene status.",
    activationRule: "Player-triggered only.",
  },
  {
    id: "audit",
    command: "OOC: AUDIT",
    output: "Arc Controller self-audit on whether the story is on track.",
    activationRule: "Player-triggered only.",
  },
  {
    id: "stop",
    command: "OOC: STOP",
    output:
      "Exit roleplay entirely so the user can ask a normal app or AI question.",
    activationRule: "Player-triggered only.",
  },
] as const satisfies readonly RuntimeDebuggerCommandDefinition[];

export function getNextRuntimeRhythmState(
  current: RuntimeRhythmState,
): RuntimeRhythmState {
  const currentIndex = runtimeRhythmCycle.indexOf(current);
  if (currentIndex < 0) {
    return runtimeRhythmCycle[0];
  }
  return runtimeRhythmCycle[(currentIndex + 1) % runtimeRhythmCycle.length];
}

export function getRuntimeAgentById(
  agentId: RuntimeAgentRoleId,
): RuntimeAgentDefinition | undefined {
  return runtimeAgentRoster.find((agent) => agent.id === agentId);
}

export function compileRuntimeStoryStateGuidance(): string {
  return [
    "Runtime story state answers what is true right now.",
    ...runtimeStoryStatePrinciples,
    `Rhythm cycle: ${runtimeRhythmCycle.join(" -> ")}.`,
    `Lorebook update trigger: ${runtimeLorebookUpdateProtocol.trigger}`,
    "Use runtime as mutable prompt guidance, not as permanent character truth.",
  ].join(" ");
}

export const RUNTIME_STORY_STATE_VOCABULARY_STANDARD_SEEDS = Object.freeze([
  createVocabularySeedPreset({
    seed: "runtime_story_state",
    label: "Runtime Story State",
    description:
      "Mutable story truth that tracks what is true about the character, relationship, and narrative right now.",
    examples: runtimeStoryStatePrinciples,
    tags: ["runtime", "story_truth", "mutable_state", "current_context"],
    relatedSeeds: [
      "continuity_canon_ledger",
      "narrative_runtime",
      "context_digest",
      ...runtimeSnapshotSections.map((section) => section.id),
    ],
    romanceHooks: ["active_stage_override", "relationship_now_state"],
    scenarioHooks: ["current_arc_snapshot", "session_log_update"],
    dialoguePatterns: [],
    metadata: { rarity: "common", romanceValue: 8, conflictPotential: 6 },
  }),
  createVocabularySeedPreset({
    seed: "runtime_static_snapshot",
    label: "Runtime Static Snapshot",
    description:
      "A reviewable snapshot of story position, character state, psychological state, relationships, and active memories.",
    examples: runtimeSnapshotSections.map(
      (section) => `${section.label}: ${section.description}`,
    ),
    tags: ["runtime", "snapshot", "story_position", "active_memories"],
    relatedSeeds: runtimeSnapshotSections.flatMap((section) => [
      section.id,
      ...section.fields.map((field) => field.field),
    ]),
    romanceHooks: ["relationship_state_snapshot", "active_memories"],
    scenarioHooks: ["current_scene_status", "active_arc_snapshot"],
    dialoguePatterns: [],
    metadata: { rarity: "common", romanceValue: 7, conflictPotential: 5 },
  }),
  createVocabularySeedPreset({
    seed: "runtime_agent_roster",
    label: "Runtime Agent Roster",
    description:
      "The hidden orchestration roles that manage arc rhythm, character consistency, world events, lorebook updates, editing, and OOC diagnostics.",
    examples: runtimeAgentRoster.map(
      (agent) => `${agent.label}: ${agent.role}`,
    ),
    tags: ["runtime", "agent_roster", "orchestration", "hidden_pipeline"],
    relatedSeeds: runtimeAgentRoster.map((agent) => agent.id),
    romanceHooks: ["inner_character_watchdog", "narrative_arc_controller"],
    scenarioHooks: ["narrator_npc_event_hook", "editor_final_pass"],
    dialoguePatterns: [],
    metadata: { rarity: "uncommon", romanceValue: 5, conflictPotential: 4 },
  }),
  createVocabularySeedPreset({
    seed: "runtime_rhythm_cycle",
    label: "Runtime Rhythm Cycle",
    description:
      "A repeating crisis, recovery, mundane, security, and disruption cycle used to prevent flat long-form pacing.",
    examples: [
      "Recovery gives characters room to process a crisis.",
      "Security can create false calm before the next disruption.",
      "Disruption introduces new pressure before the next crisis.",
    ],
    tags: ["runtime", "rhythm", "pacing", "arc_controller"],
    relatedSeeds: [...runtimeRhythmCycle, ...runtimeArcLevels.map((level) => level.id)],
    romanceHooks: ["breathing_room_after_conflict", "false_security_before_rupture"],
    scenarioHooks: ["next_disruption", "recovery_scene"],
    dialoguePatterns: [],
    metadata: { rarity: "common", romanceValue: 7, conflictPotential: 8 },
  }),
  createVocabularySeedPreset({
    seed: "runtime_lorebook_update_protocol",
    label: "Runtime Lorebook Update Protocol",
    description:
      "The post-processing protocol that updates character runtime, user persona runtime, and session log lorebook entries after significant story movement.",
    examples: runtimeLorebookUpdateProtocol.updateSequence,
    tags: ["runtime", "lorebook", "session_log", "continuity"],
    relatedSeeds: [...runtimeLorebookUpdateProtocol.sessionLogFields],
    romanceHooks: ["relationship_shift_logged", "emotional_beat_logged"],
    scenarioHooks: ["session_log_lorebook", "active_plot_threads"],
    dialoguePatterns: [],
    metadata: { rarity: "common", romanceValue: 6, conflictPotential: 5 },
  }),
  createVocabularySeedPreset({
    seed: "runtime_debugger_ooc_commands",
    label: "Runtime Debugger OOC Commands",
    description:
      "Player-triggered diagnostic commands for analysis, scoring, debugging, summaries, audits, and exiting roleplay.",
    examples: runtimeDebuggerCommands.map(
      (debuggerCommand) => `${debuggerCommand.command}: ${debuggerCommand.output}`,
    ),
    tags: ["runtime", "debugger", "ooc", "diagnostics"],
    relatedSeeds: runtimeDebuggerCommands.map((debuggerCommand) => debuggerCommand.id),
    romanceHooks: ["arc_audit", "tone_drift_check"],
    scenarioHooks: ["debug_current_state", "summary_request"],
    dialoguePatterns: runtimeDebuggerCommands.map(
      (debuggerCommand) => debuggerCommand.command,
    ),
    metadata: { rarity: "uncommon", romanceValue: 4, conflictPotential: 3 },
  }),
]) satisfies readonly VocabularySeedPreset[];
