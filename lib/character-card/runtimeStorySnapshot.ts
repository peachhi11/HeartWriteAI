import {
  runtimeRhythmCycle,
  type RuntimeRhythmState,
} from "../../data/runtimeStoryStateVocabularyPresets";
import {
  normalizeNarrativeRuntimeState,
  type NarrativeRecentEvent,
  type NarrativeRuntimeState,
} from "./narrativeEngine";

export type RuntimeWoundStatus = "dormant" | "active" | "triggered";
export type RuntimeLieStatus =
  | "operating_from_lie"
  | "cracking"
  | "glimpsing_truth";
export type RuntimeRelationalArousalPhase =
  | "indifferent"
  | "aware"
  | "attached"
  | "focused";

export interface RuntimeRelationshipSnapshot {
  targetName: string;
  trustLadderPosition: string;
  dynamic: string;
}

export interface RuntimeCharacterStorySnapshot {
  characterName: string;
  activeArc: string;
  arcPhase: string;
  rhythmState: RuntimeRhythmState;
  scene: string;
  goal: string;
  mood: string;
  stress: string;
  fatigue: string;
  hope: string;
  woundStatus: RuntimeWoundStatus;
  woundStatusDetail: string;
  lieStatus: RuntimeLieStatus;
  lieStatusDetail: string;
  arousalPhase: RuntimeRelationalArousalPhase;
  relationships: readonly RuntimeRelationshipSnapshot[];
  activeMemories: readonly string[];
}

export interface UserPersonaRuntimeSnapshot {
  relationships: readonly RuntimeRelationshipSnapshot[];
  mood: string;
  goal: string;
  activeMemories: readonly string[];
  arousalPhase: RuntimeRelationalArousalPhase;
}

export interface RuntimeStorySnapshot {
  character: RuntimeCharacterStorySnapshot;
  userPersona?: UserPersonaRuntimeSnapshot;
}

export interface CreateRuntimeStorySnapshotInput {
  runtime: NarrativeRuntimeState;
  characterName?: string;
  activeArc?: string;
  scene?: string;
  goal?: string;
  mood?: string;
  stress?: string;
  fatigue?: string;
  hope?: string;
  relationships?: readonly RuntimeRelationshipSnapshot[];
  activeMemories?: readonly string[];
  userPersona?: Partial<UserPersonaRuntimeSnapshot>;
}

export interface RuntimeSessionLogEntry {
  label: string;
  scene: string;
  recentEvents: readonly string[];
  relationshipShifts: readonly string[];
  emotionalBeats: readonly string[];
  activePlotThreads: readonly string[];
  nextAnticipatedBeat: string;
}

export function createRuntimeStorySnapshot(
  input: CreateRuntimeStorySnapshotInput,
): RuntimeStorySnapshot {
  const runtime = normalizeNarrativeRuntimeState(input.runtime);
  const characterName = input.characterName?.trim() || humanizeId(runtime.characterId);
  const activeMemories = input.activeMemories?.length
    ? input.activeMemories.map(sanitizeRuntimeLine).slice(0, 3)
    : getActiveMemoryLines(runtime);
  const relationships = input.relationships?.length
    ? input.relationships.map(normalizeRelationshipSnapshot)
    : [createDefaultRelationshipSnapshot(runtime)];

  const character: RuntimeCharacterStorySnapshot = {
    characterName,
    activeArc: sanitizeRuntimeLine(input.activeArc || inferActiveArc(runtime)),
    arcPhase: humanizeId(runtime.arcPhase),
    rhythmState: inferRuntimeRhythmState(runtime),
    scene: sanitizeRuntimeLine(input.scene || inferScene(runtime)),
    goal: sanitizeRuntimeLine(input.goal || inferGoal(runtime)),
    mood: sanitizeRuntimeLine(input.mood || inferMood(runtime)),
    stress: sanitizeRuntimeLine(input.stress || inferStress(runtime)),
    fatigue: sanitizeRuntimeLine(input.fatigue || inferFatigue(runtime)),
    hope: sanitizeRuntimeLine(input.hope || inferHope(runtime)),
    woundStatus: inferWoundStatus(runtime),
    woundStatusDetail: inferWoundStatusDetail(runtime),
    lieStatus: inferLieStatus(runtime),
    lieStatusDetail: inferLieStatusDetail(runtime),
    arousalPhase: inferRelationalArousalPhase(runtime),
    relationships,
    activeMemories,
  };

  return {
    character,
    userPersona: input.userPersona
      ? normalizeUserPersonaRuntime(input.userPersona, character)
      : undefined,
  };
}

export function inferRuntimeRhythmState(
  runtimeInput: NarrativeRuntimeState,
): RuntimeRhythmState {
  const runtime = normalizeNarrativeRuntimeState(runtimeInput);
  const lastEvent = runtime.recentEvents.at(-1);

  if (runtime.arcPhase === "crisis_turning_point") {
    return "crisis";
  }
  if (lastEvent?.outcome === "rupture" || lastEvent?.tier === "major_event") {
    return lastEvent.outcome === "repair" ? "recovery" : "disruption";
  }
  if (runtime.arcPhase === "resolution_stabilization" || lastEvent?.outcome === "repair") {
    return "recovery";
  }
  if (
    runtime.arcPhase === "development" &&
    runtime.axes.trust >= 55 &&
    runtime.axes.emotionalRegulation >= 55
  ) {
    return "security";
  }
  if (runtime.arcPhase === "escalation") {
    return "disruption";
  }
  return "mundane";
}

export function compileRuntimeStorySnapshotPrompt(
  snapshotInput: RuntimeStorySnapshot,
): string {
  const snapshot = normalizeRuntimeStorySnapshot(snapshotInput);
  const character = snapshot.character;
  const relationshipLines = character.relationships.map(
    (relationship) =>
      `${relationship.targetName}: ${relationship.trustLadderPosition}; ${relationship.dynamic}`,
  );
  const activeMemories = character.activeMemories.length
    ? character.activeMemories
    : ["No live memory beat has been supplied yet."];

  return [
    "[RUNTIME STORY SNAPSHOT]",
    "Runtime is mutable story truth about what is true right now. It is not portable character truth.",
    "Use this as hidden now-state guidance. Do not name runtime, agents, internal ids, or numeric scores in character.",
    "",
    "STORY POSITION",
    `Active Arc: ${character.activeArc}`,
    `Arc Phase: ${character.arcPhase}`,
    `Rhythm State: ${humanizeId(character.rhythmState)}`,
    "",
    "CHARACTER STATE",
    `Scene: ${character.scene}`,
    `Goal: ${character.goal}`,
    `Mood: ${character.mood}`,
    `Stress: ${character.stress}`,
    `Fatigue: ${character.fatigue}`,
    `Hope: ${character.hope}`,
    "",
    "PSYCHOLOGICAL STATE",
    `Wound Status: ${humanizeId(character.woundStatus)} - ${character.woundStatusDetail}`,
    `Lie Status: ${humanizeId(character.lieStatus)} - ${character.lieStatusDetail}`,
    `Arousal Phase: ${humanizeId(character.arousalPhase)}`,
    "",
    "RELATIONSHIP STATE",
    ...relationshipLines,
    "",
    "ACTIVE MEMORIES",
    ...activeMemories.map((memory) => `- ${memory}`),
    snapshot.userPersona ? compileUserPersonaRuntimeBlock(snapshot.userPersona) : "",
  ].filter((line) => line !== "").join("\n");
}

export function createRuntimeSessionLogEntry(
  snapshotInput: RuntimeStorySnapshot,
  options: {
    label?: string;
    activePlotThreads?: readonly string[];
    nextAnticipatedBeat?: string;
  } = {},
): RuntimeSessionLogEntry {
  const snapshot = normalizeRuntimeStorySnapshot(snapshotInput);
  const character = snapshot.character;

  return {
    label: sanitizeRuntimeLine(options.label || "SESSION LOG - Current runtime state"),
    scene: character.scene,
    recentEvents: character.activeMemories,
    relationshipShifts: character.relationships.map(
      (relationship) =>
        `${relationship.targetName}: ${relationship.trustLadderPosition}; ${relationship.dynamic}`,
    ),
    emotionalBeats: [
      character.mood,
      `Wound is ${humanizeId(character.woundStatus)}.`,
      `Lie is ${humanizeId(character.lieStatus)}.`,
    ],
    activePlotThreads: (options.activePlotThreads ?? [character.activeArc])
      .map(sanitizeRuntimeLine)
      .filter(Boolean),
    nextAnticipatedBeat: sanitizeRuntimeLine(
      options.nextAnticipatedBeat || inferNextBeat(character.rhythmState),
    ),
  };
}

export function compileRuntimeSessionLogEntry(
  entry: RuntimeSessionLogEntry,
): string {
  return [
    entry.label,
    `Scene: ${entry.scene}`,
    `Recent Events: ${entry.recentEvents.join(" | ") || "No recent event supplied."}`,
    `Relationship Shifts: ${entry.relationshipShifts.join(" | ") || "No relationship shift supplied."}`,
    `Emotional Beats: ${entry.emotionalBeats.join(" | ") || "No emotional beat supplied."}`,
    `Active Plot Threads: ${entry.activePlotThreads.join(" | ") || "No active plot thread supplied."}`,
    `Next Anticipated Beat: ${entry.nextAnticipatedBeat}`,
  ].join("\n");
}

function normalizeRuntimeStorySnapshot(
  snapshot: RuntimeStorySnapshot,
): RuntimeStorySnapshot {
  return {
    character: {
      ...snapshot.character,
      characterName: sanitizeRuntimeLine(snapshot.character.characterName),
      activeArc: sanitizeRuntimeLine(snapshot.character.activeArc),
      arcPhase: sanitizeRuntimeLine(snapshot.character.arcPhase),
      scene: sanitizeRuntimeLine(snapshot.character.scene),
      goal: sanitizeRuntimeLine(snapshot.character.goal),
      mood: sanitizeRuntimeLine(snapshot.character.mood),
      stress: sanitizeRuntimeLine(snapshot.character.stress),
      fatigue: sanitizeRuntimeLine(snapshot.character.fatigue),
      hope: sanitizeRuntimeLine(snapshot.character.hope),
      woundStatusDetail: sanitizeRuntimeLine(snapshot.character.woundStatusDetail),
      lieStatusDetail: sanitizeRuntimeLine(snapshot.character.lieStatusDetail),
      relationships: snapshot.character.relationships.map(normalizeRelationshipSnapshot),
      activeMemories: snapshot.character.activeMemories.map(sanitizeRuntimeLine).slice(0, 3),
    },
    userPersona: snapshot.userPersona
      ? normalizeUserPersonaRuntime(snapshot.userPersona, snapshot.character)
      : undefined,
  };
}

function normalizeRelationshipSnapshot(
  relationship: RuntimeRelationshipSnapshot,
): RuntimeRelationshipSnapshot {
  return {
    targetName: sanitizeRuntimeLine(relationship.targetName || "Active partner"),
    trustLadderPosition: sanitizeRuntimeLine(
      relationship.trustLadderPosition || "Unknown trust position",
    ),
    dynamic: sanitizeRuntimeLine(relationship.dynamic || "Dynamic not yet specified."),
  };
}

function normalizeUserPersonaRuntime(
  userPersona: Partial<UserPersonaRuntimeSnapshot>,
  character: RuntimeCharacterStorySnapshot,
): UserPersonaRuntimeSnapshot {
  return {
    relationships: userPersona.relationships?.length
      ? userPersona.relationships.map(normalizeRelationshipSnapshot)
      : character.relationships,
    mood: sanitizeRuntimeLine(
      userPersona.mood ||
        "No explicit user persona mood has been supplied; avoid inventing private feelings.",
    ),
    goal: sanitizeRuntimeLine(
      userPersona.goal ||
        "No explicit user persona goal has been supplied; infer only from visible input.",
    ),
    activeMemories: (userPersona.activeMemories ?? character.activeMemories)
      .map(sanitizeRuntimeLine)
      .slice(0, 3),
    arousalPhase: userPersona.arousalPhase ?? character.arousalPhase,
  };
}

function compileUserPersonaRuntimeBlock(userPersona: UserPersonaRuntimeSnapshot): string {
  return [
    "",
    "USER PERSONA RUNTIME",
    "Use only explicit or creator-supplied persona state. Do not write user thoughts, feelings, intentions, decisions, or dialogue.",
    ...userPersona.relationships.map(
      (relationship) =>
        `${relationship.targetName}: ${relationship.trustLadderPosition}; ${relationship.dynamic}`,
    ),
    `Mood: ${userPersona.mood}`,
    `Goal: ${userPersona.goal}`,
    `Arousal Phase: ${humanizeId(userPersona.arousalPhase)}`,
    "Active Memories:",
    ...(userPersona.activeMemories.length
      ? userPersona.activeMemories.map((memory) => `- ${memory}`)
      : ["- No active user persona memory supplied."]),
  ].join("\n");
}

function inferActiveArc(runtime: NarrativeRuntimeState): string {
  const lastEvent = runtime.recentEvents.at(-1);
  if (lastEvent) {
    return `${lastEvent.label} is shaping the current ${humanizeId(runtime.arcPhase).toLowerCase()} micro-arc.`;
  }
  if (runtime.lastCauseFrame) {
    return `${runtime.lastCauseFrame.event} is the current micro-arc pressure.`;
  }
  return `The story is in ${humanizeId(runtime.arcPhase).toLowerCase()} and waiting for the next meaningful pressure.`;
}

function inferScene(runtime: NarrativeRuntimeState): string {
  const lastEvent = runtime.recentEvents.at(-1);
  if (lastEvent) {
    return `The current scene is still carrying the consequences of ${lastEvent.summary}`;
  }
  return "The current location has not been specified; rely on the active scenario and recent chat.";
}

function inferGoal(runtime: NarrativeRuntimeState): string {
  if (runtime.lastCauseFrame?.behaviorIntent) {
    return runtime.lastCauseFrame.behaviorIntent;
  }
  if (runtime.relationshipStage === "active_adversaries") {
    return "Maintain control and avoid offering trust before evidence supports it.";
  }
  if (runtime.relationshipStage === "intimate_partners") {
    return "Protect the bond through presence, honesty, and follow-through.";
  }
  return "Respond to immediate scene pressure without inventing a new long-term goal.";
}

function inferMood(runtime: NarrativeRuntimeState): string {
  const lastEvent = runtime.recentEvents.at(-1);
  if (lastEvent?.outcome === "rupture") {
    return "They are emotionally braced, hurt, and watching for what the rupture means.";
  }
  if (lastEvent?.outcome === "repair") {
    return "They are cautiously receptive, but still measuring whether repair has changed behavior.";
  }
  if (runtime.axes.romanticTension >= 70) {
    return "They are aware of the charged emotional air and trying to keep their response contained.";
  }
  if (runtime.axes.trust < 25) {
    return "They are guarded and observant, treating warmth as something that still needs proof.";
  }
  return "They are present in the scene and responsive to new evidence.";
}

function inferStress(runtime: NarrativeRuntimeState): string {
  const lastEvent = runtime.recentEvents.at(-1);
  if (lastEvent?.tier === "major_event") {
    return `Stress is high because ${lastEvent.summary}`;
  }
  if (lastEvent?.outcome === "escalate") {
    return `Stress is rising around ${lastEvent.summary}`;
  }
  if (runtime.axes.emotionalRegulation < 35) {
    return "Stress is high enough that restraint, syntax, and patience may fray.";
  }
  return "Stress is manageable unless the scene introduces a new trigger.";
}

function inferFatigue(runtime: NarrativeRuntimeState): string {
  if (runtime.axes.emotionalRegulation < 35) {
    return "Fatigue is showing through reduced restraint and less polished emotional control.";
  }
  if (runtime.recentEvents.length >= 6) {
    return "Recent events are accumulating into emotional load, even if the character is still functioning.";
  }
  return "Fatigue is not dominant yet, though the scene can still add pressure.";
}

function inferHope(runtime: NarrativeRuntimeState): string {
  const lastEvent = runtime.recentEvents.at(-1);
  if (lastEvent?.outcome === "repair") {
    return "They are holding onto the possibility that changed behavior may be real.";
  }
  if (runtime.axes.trust >= 65) {
    return "They are holding onto evidence that the bond can be trusted.";
  }
  if (runtime.axes.romanticTension >= 65) {
    return "They are holding onto the possibility that the feeling means something.";
  }
  return "They are holding onto control, clarity, or the chance to gather more evidence.";
}

function inferWoundStatus(runtime: NarrativeRuntimeState): RuntimeWoundStatus {
  const eventText = recentEventText(runtime);
  if (/\b(betrayal|abandon|leave|goodbye|rejection|secret|promise|rupture)\b/i.test(eventText)) {
    return "triggered";
  }
  if (
    runtime.lastCauseFrame?.pressuredLaws.length ||
    runtime.lastCauseFrame?.activeDefenses.length
  ) {
    return "active";
  }
  return "dormant";
}

function inferWoundStatusDetail(runtime: NarrativeRuntimeState): string {
  const status = inferWoundStatus(runtime);
  const lastEvent = runtime.recentEvents.at(-1);
  if (status === "triggered" && lastEvent) {
    return `Recent story pressure around ${lastEvent.label} activated a vulnerable pattern.`;
  }
  if (status === "active") {
    return "A character law or defense is under pressure in the current scene.";
  }
  return "No active wound trigger is currently visible from runtime evidence.";
}

function inferLieStatus(runtime: NarrativeRuntimeState): RuntimeLieStatus {
  const lastEvent = runtime.recentEvents.at(-1);
  if (lastEvent?.outcome === "repair" || lastEvent?.outcome === "reveal") {
    return "glimpsing_truth";
  }
  if (runtime.lastCauseFrame?.activeDefenses.length || lastEvent?.outcome === "escalate") {
    return "cracking";
  }
  return "operating_from_lie";
}

function inferLieStatusDetail(runtime: NarrativeRuntimeState): string {
  const lieStatus = inferLieStatus(runtime);
  if (lieStatus === "glimpsing_truth") {
    return "Recent story evidence gives the character a reason to imagine a truer pattern.";
  }
  if (lieStatus === "cracking") {
    return "The old interpretation is under pressure but has not been fully released.";
  }
  return "The old protective interpretation still shapes the first response.";
}

function inferRelationalArousalPhase(
  runtime: NarrativeRuntimeState,
): RuntimeRelationalArousalPhase {
  if (runtime.axes.romanticTension >= 75 || runtime.axes.physicalAttraction >= 75) {
    return "focused";
  }
  if (runtime.axes.affection >= 60 || runtime.axes.trust >= 70) {
    return "attached";
  }
  if (runtime.axes.romanticTension >= 30 || runtime.axes.physicalAttraction >= 30) {
    return "aware";
  }
  return "indifferent";
}

function createDefaultRelationshipSnapshot(
  runtime: NarrativeRuntimeState,
): RuntimeRelationshipSnapshot {
  return {
    targetName: "Active partner",
    trustLadderPosition: `${humanizeId(runtime.relationshipStage)} with ${qualitativeTrust(runtime.axes.trust)} trust`,
    dynamic: stageDynamic(runtime.relationshipStage),
  };
}

function getActiveMemoryLines(runtime: NarrativeRuntimeState): string[] {
  const eventLines = runtime.recentEvents
    .slice(-3)
    .reverse()
    .map(formatRecentEventMemory);
  if (eventLines.length) {
    return eventLines;
  }
  return runtime.memories
    .slice(0, 3)
    .map((memory) => `${memory.summary} Meaning: ${memory.meaning}`);
}

function formatRecentEventMemory(event: NarrativeRecentEvent): string {
  return `${event.label}: ${event.summary}`;
}

function inferNextBeat(rhythmState: RuntimeRhythmState): string {
  const nextRhythm = runtimeRhythmCycle[
    (runtimeRhythmCycle.indexOf(rhythmState) + 1) % runtimeRhythmCycle.length
  ];
  if (nextRhythm === "crisis") {
    return "Escalate only if the current disruption has earned a crisis.";
  }
  if (nextRhythm === "recovery") {
    return "Give the characters room to process consequences before new pressure arrives.";
  }
  if (nextRhythm === "mundane") {
    return "Let ordinary behavior reveal what has changed.";
  }
  if (nextRhythm === "security") {
    return "Build enough calm that the next disruption has contrast.";
  }
  return "Introduce a concrete disruption when the current security begins to flatten.";
}

function recentEventText(runtime: NarrativeRuntimeState): string {
  return [
    ...runtime.recentEvents.map((event) => `${event.label} ${event.summary} ${event.tags.join(" ")}`),
    runtime.lastCauseFrame?.event,
    runtime.lastCauseFrame?.interpretation,
  ].filter(Boolean).join(" ");
}

function stageDynamic(stage: NarrativeRuntimeState["relationshipStage"]): string {
  if (stage === "active_adversaries") {
    return "Open friction and low trust are shaping every interpretation.";
  }
  if (stage === "reluctant_partners") {
    return "Cooperation is possible, but it still feels uncomfortable and provisional.";
  }
  if (stage === "unspoken_attraction") {
    return "The bond is charged, unnamed, and still governed by restraint.";
  }
  if (stage === "mutual_longing") {
    return "The bond carries visible longing that still needs an earned choice.";
  }
  if (stage === "betrayed") {
    return "Trust has ruptured while emotional investment remains painfully present.";
  }
  if (stage === "intimate_partners") {
    return "The bond is stabilized by familiar care, trust, and shared future pressure.";
  }
  return "The relationship should follow the current stage rather than jumping ahead.";
}

function qualitativeTrust(value: number): string {
  if (value >= 80) return "very high";
  if (value >= 55) return "growing";
  if (value >= 30) return "cautious";
  return "low";
}

function humanizeId(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sanitizeRuntimeLine(value: string): string {
  return value
    .replace(/\{\{user\}\}/gi, "the active partner")
    .replace(/\{\{char\}\}/gi, "the character")
    .replace(/\b(?:narrative-runtime|runtime-event|runtime-truth|law|memory|canon-ledger|context-digest|semantic-node):[a-z0-9:{}_-]+\b/gi, "")
    .replace(/\b(?:trust|affection|romantic tension|respect|physical attraction|emotional regulation)\s*[:=]\s*-?\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
