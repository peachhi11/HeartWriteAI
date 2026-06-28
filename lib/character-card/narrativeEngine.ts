import { z } from "zod";

const score = z.coerce.number().min(0).max(100);
const signedScore = z.coerce.number().min(-100).max(100);
const nonEmptyString = z.string().trim().min(1);

const NARRATIVE_RUNTIME_SCHEMA_VERSION = 1;
const DEFAULT_MEMORY_LIMIT = 36;

function defaultObject<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => value ?? {}, schema);
}

export const NarrativeArcPhaseSchema = z.enum([
  "initiation",
  "development",
  "escalation",
  "crisis_turning_point",
  "resolution_stabilization",
]);
export type NarrativeArcPhase = z.infer<typeof NarrativeArcPhaseSchema>;

export const NarrativePacingModeSchema = z.enum([
  "slow_burn",
  "standard",
  "fast_paced",
  "chaotic",
]);
export type NarrativePacingMode = z.infer<typeof NarrativePacingModeSchema>;

export const NarrativeRelationshipStageSchema = z.enum([
  "strangers",
  "acquaintances",
  "casual_allies",
  "confidants",
  "unspoken_attraction",
  "mutual_longing",
  "confessed_affection",
  "intimate_partners",
  "active_adversaries",
  "reluctant_partners",
  "spiteful_fascination",
  "frenemies",
  "forbidden_partners",
  "friendzoned",
  "right_person_wrong_time",
  "situationship",
  "unrequited",
  "estranged",
  "betrayed",
  "indifferent",
  "toxic_loop",
  "awkward_confusion",
]);
export type NarrativeRelationshipStage = z.infer<
  typeof NarrativeRelationshipStageSchema
>;

export const NarrativeEventCategorySchema = z.enum([
  "interpersonal",
  "environmental",
  "internal",
  "relationship",
  "setting_pressure",
]);
export type NarrativeEventCategory = z.infer<typeof NarrativeEventCategorySchema>;

export const NarrativeEventTierSchema = z.enum([
  "micro_event",
  "meso_event",
  "major_event",
]);
export type NarrativeEventTier = z.infer<typeof NarrativeEventTierSchema>;

export const NarrativeEventOutcomeSchema = z.enum([
  "escalate",
  "maintain",
  "rupture",
  "repair",
  "stabilize",
  "reveal",
]);
export type NarrativeEventOutcome = z.infer<typeof NarrativeEventOutcomeSchema>;

export const NarrativeMemoryTierSchema = z.enum([
  "core_identity",
  "relationship_memory",
  "contextual_memory",
]);
export type NarrativeMemoryTier = z.infer<typeof NarrativeMemoryTierSchema>;

export const NarrativeEventGateSchema = z.enum([
  "first_crisis",
  "shared_secret",
  "the_separation",
  "major_sacrifice",
  "confession_or_intimate_event",
  "rupture_event",
  "repair_attempt",
  "public_choice",
]);
export type NarrativeEventGate = z.infer<typeof NarrativeEventGateSchema>;

export const NarrativeAxisSchema = z.object({
  trust: score.default(25),
  affection: signedScore.default(0),
  romanticTension: score.default(0),
  respect: score.default(30),
  physicalAttraction: score.default(0),
  emotionalRegulation: score.default(70),
  powerPerception: signedScore.default(0),
});
export type NarrativeAxisState = z.infer<typeof NarrativeAxisSchema>;

export const CharacterLawSchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  priority: z.coerce.number().int().min(1).max(20).default(5),
  description: nonEmptyString,
  protects: z.array(nonEmptyString).default([]),
  pressuredBy: z.array(nonEmptyString).default([]),
  generatedBehaviors: z.array(nonEmptyString).default([]),
  hiddenNeed: nonEmptyString.optional(),
});
export type CharacterLaw = z.infer<typeof CharacterLawSchema>;

export const CharacterDefenseSchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  trigger: nonEmptyString,
  behavior: nonEmptyString,
  cost: nonEmptyString.optional(),
});
export type CharacterDefense = z.infer<typeof CharacterDefenseSchema>;

export const StoryTruthSchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  scope: z.enum(["scenario", "relationship", "setting", "secret"]).default("scenario"),
  truth: nonEmptyString,
  pressure: nonEmptyString.optional(),
  active: z.boolean().default(true),
});
export type StoryTruth = z.infer<typeof StoryTruthSchema>;

export const NarrativeCauseProfileSchema = z.object({
  immutableLaws: z.array(CharacterLawSchema).default([]),
  relationshipLaws: z.array(CharacterLawSchema).default([]),
  activeDefenses: z.array(CharacterDefenseSchema).default([]),
  storyTruths: z.array(StoryTruthSchema).default([]),
});
export type NarrativeCauseProfile = z.infer<typeof NarrativeCauseProfileSchema>;

export const NarrativeMemorySchema = z.object({
  id: nonEmptyString,
  tier: NarrativeMemoryTierSchema.default("relationship_memory"),
  summary: nonEmptyString,
  meaning: nonEmptyString,
  stateImpact: nonEmptyString,
  emotionalWeight: score.default(50),
  turn: z.coerce.number().int().min(0).default(0),
  tags: z.array(nonEmptyString).default([]),
  pinned: z.boolean().default(false),
});
export type NarrativeMemory = z.infer<typeof NarrativeMemorySchema>;

export const NarrativeRecentEventSchema = z.object({
  label: nonEmptyString,
  category: NarrativeEventCategorySchema,
  tier: NarrativeEventTierSchema,
  outcome: NarrativeEventOutcomeSchema,
  summary: nonEmptyString,
  turn: z.coerce.number().int().min(0).default(0),
  tags: z.array(nonEmptyString).default([]),
});
export type NarrativeRecentEvent = z.infer<typeof NarrativeRecentEventSchema>;

export const NarrativeCauseFrameSchema = z.object({
  event: nonEmptyString,
  interpretation: nonEmptyString,
  pressuredLaws: z.array(nonEmptyString).default([]),
  activeDefenses: z.array(nonEmptyString).default([]),
  hiddenNeed: nonEmptyString.optional(),
  behaviorIntent: nonEmptyString,
  consequence: nonEmptyString,
});
export type NarrativeCauseFrame = z.infer<typeof NarrativeCauseFrameSchema>;

export const NarrativeRuntimeStateSchema = z.object({
  schemaVersion: z.literal(NARRATIVE_RUNTIME_SCHEMA_VERSION).default(
    NARRATIVE_RUNTIME_SCHEMA_VERSION,
  ),
  id: nonEmptyString,
  characterId: nonEmptyString,
  scenarioId: nonEmptyString.optional(),
  turn: z.coerce.number().int().min(0).default(0),
  arcPhase: NarrativeArcPhaseSchema.default("initiation"),
  pacingMode: NarrativePacingModeSchema.default("slow_burn"),
  relationshipStage: NarrativeRelationshipStageSchema.default("strangers"),
  axes: defaultObject(NarrativeAxisSchema),
  eventGates: z.record(z.string(), z.boolean()).default({}),
  causeProfile: defaultObject(NarrativeCauseProfileSchema),
  memories: z.array(NarrativeMemorySchema).default([]),
  recentEvents: z.array(NarrativeRecentEventSchema).default([]),
  lastCauseFrame: NarrativeCauseFrameSchema.optional(),
  tags: z.array(nonEmptyString).default([]),
});
export type NarrativeRuntimeState = z.infer<typeof NarrativeRuntimeStateSchema>;

export interface CreateNarrativeRuntimeStateInput {
  id?: string;
  characterId: string;
  scenarioId?: string;
  relationshipStage?: NarrativeRelationshipStage;
  arcPhase?: NarrativeArcPhase;
  pacingMode?: NarrativePacingMode;
  axes?: Partial<NarrativeAxisState>;
  causeProfile?: Partial<NarrativeCauseProfile>;
  tags?: readonly string[];
}

export interface NarrativeEventInput {
  label: string;
  summary: string;
  category?: NarrativeEventCategory;
  tier?: NarrativeEventTier;
  outcome?: NarrativeEventOutcome;
  stimulus?: string;
  interpretedAs?: string;
  stateImpact?: Partial<NarrativeAxisState>;
  gateActivations?: readonly NarrativeEventGate[];
  pressuredLawIds?: readonly string[];
  activeDefenseIds?: readonly string[];
  hiddenNeed?: string;
  behaviorIntent?: string;
  consequence?: string;
  memoryTier?: NarrativeMemoryTier;
  memoryWeight?: number;
  tags?: readonly string[];
}

export interface NarrativeTurnResult {
  state: NarrativeRuntimeState;
  previousStage: NarrativeRelationshipStage;
  nextStage: NarrativeRelationshipStage;
  stageChanged: boolean;
  phaseChanged: boolean;
  activatedGates: readonly NarrativeEventGate[];
  recalledMemories: readonly NarrativeMemory[];
  causeFrame: NarrativeCauseFrame;
  promptContext: string;
  reasons: readonly string[];
}

export interface NarrativePromptContextOptions {
  includeAgencyReminder?: boolean;
  maxMemories?: number;
}

const STAGE_LABELS = {
  strangers: "Strangers",
  acquaintances: "Acquaintances",
  casual_allies: "Casual allies",
  confidants: "Confidants",
  unspoken_attraction: "Unspoken attraction",
  mutual_longing: "Mutual longing",
  confessed_affection: "Confessed affection",
  intimate_partners: "Intimate partners",
  active_adversaries: "Active adversaries",
  reluctant_partners: "Reluctant partners",
  spiteful_fascination: "Spiteful fascination",
  frenemies: "Frenemies",
  forbidden_partners: "Forbidden partners",
  friendzoned: "Friendzoned",
  right_person_wrong_time: "Right person, wrong time",
  situationship: "Situationship",
  unrequited: "Unrequited",
  estranged: "Estranged",
  betrayed: "Betrayed",
  indifferent: "Indifferent",
  toxic_loop: "Toxic loop",
  awkward_confusion: "Awkward confusion",
} as const satisfies Record<NarrativeRelationshipStage, string>;

const PHASE_LABELS = {
  initiation: "Initiation",
  development: "Development",
  escalation: "Escalation",
  crisis_turning_point: "Crisis or turning point",
  resolution_stabilization: "Resolution or stabilization",
} as const satisfies Record<NarrativeArcPhase, string>;

const ALLOWED_ADJACENT_STAGES: Record<
  NarrativeRelationshipStage,
  readonly NarrativeRelationshipStage[]
> = {
  strangers: ["acquaintances", "active_adversaries"],
  acquaintances: ["strangers", "casual_allies", "unrequited"],
  casual_allies: ["acquaintances", "confidants", "unspoken_attraction"],
  confidants: ["casual_allies", "unspoken_attraction", "betrayed"],
  unspoken_attraction: ["casual_allies", "mutual_longing", "situationship"],
  mutual_longing: ["unspoken_attraction", "confessed_affection", "forbidden_partners", "betrayed"],
  confessed_affection: ["mutual_longing", "intimate_partners", "betrayed"],
  intimate_partners: ["confessed_affection", "betrayed"],
  active_adversaries: ["reluctant_partners", "spiteful_fascination", "indifferent"],
  reluctant_partners: ["active_adversaries", "spiteful_fascination", "casual_allies"],
  spiteful_fascination: ["active_adversaries", "reluctant_partners", "frenemies", "toxic_loop"],
  frenemies: ["spiteful_fascination", "casual_allies", "toxic_loop"],
  forbidden_partners: ["mutual_longing", "confessed_affection", "estranged"],
  friendzoned: ["acquaintances", "confidants", "unspoken_attraction"],
  right_person_wrong_time: ["mutual_longing", "estranged", "confessed_affection"],
  situationship: ["unspoken_attraction", "mutual_longing", "confessed_affection", "estranged"],
  unrequited: ["acquaintances", "friendzoned", "mutual_longing"],
  estranged: ["betrayed", "acquaintances", "indifferent"],
  betrayed: ["estranged", "active_adversaries", "mutual_longing"],
  indifferent: ["estranged", "active_adversaries", "acquaintances"],
  toxic_loop: ["spiteful_fascination", "frenemies", "estranged"],
  awkward_confusion: ["acquaintances", "casual_allies", "unspoken_attraction"],
};

const IMPORTANT_EVENT_TERMS = [
  "betrayal",
  "confession",
  "promise",
  "secret",
  "reveal",
  "choice",
  "sacrifice",
  "rescue",
  "apology",
  "boundary",
  "kiss",
  "goodbye",
  "leave",
  "public",
  "repair",
];

export function createDefaultNarrativeRuntimeState(
  input: CreateNarrativeRuntimeStateInput,
): NarrativeRuntimeState {
  const characterId = input.characterId.trim() || "character";

  return normalizeNarrativeRuntimeState({
    id: input.id ?? `narrative-runtime:${slugText(characterId)}`,
    characterId,
    scenarioId: input.scenarioId,
    turn: 0,
    arcPhase: input.arcPhase ?? "initiation",
    pacingMode: input.pacingMode ?? "slow_burn",
    relationshipStage: input.relationshipStage ?? "strangers",
    axes: {
      ...input.axes,
    },
    causeProfile: {
      ...input.causeProfile,
    },
    tags: [...(input.tags ?? [])],
  });
}

export function normalizeNarrativeRuntimeState(
  input: unknown,
): NarrativeRuntimeState {
  const state = NarrativeRuntimeStateSchema.parse(input);
  state.memories = compactNarrativeMemories(state.memories);
  state.recentEvents = state.recentEvents.slice(-8);
  return state;
}

export function processNarrativeTurn(
  current: NarrativeRuntimeState,
  event: NarrativeEventInput,
  options: NarrativePromptContextOptions = {},
): NarrativeTurnResult {
  const state = normalizeNarrativeRuntimeState(structuredClone(current));
  const previousStage = state.relationshipStage;
  const previousPhase = state.arcPhase;
  const normalizedEvent = normalizeNarrativeEventInput(event);
  const reasons: string[] = [];

  state.turn += 1;
  applyStateDecay(state);

  const inferredImpact = inferStateImpact(normalizedEvent);
  applyAxisDeltas(state.axes, inferredImpact);
  applyAxisDeltas(state.axes, normalizedEvent.stateImpact ?? {});

  const activatedGates = activateEventGates(state, normalizedEvent);
  if (activatedGates.length) {
    reasons.push(`Activated gates: ${activatedGates.map(humanizeId).join(", ")}`);
  }

  const causeFrame = buildCauseFrame(state, normalizedEvent);
  state.lastCauseFrame = causeFrame;

  const recalledMemories = recallNarrativeMemories(
    state.memories,
    normalizedEvent,
  );
  addMemoryForEvent(state, normalizedEvent, causeFrame);

  const nextStage = evaluateNextRelationshipStage(state, normalizedEvent);
  if (nextStage !== state.relationshipStage) {
    reasons.push(
      `Relationship stage moved from ${STAGE_LABELS[state.relationshipStage]} to ${STAGE_LABELS[nextStage]}.`,
    );
    state.relationshipStage = nextStage;
  }

  const nextPhase = evaluateNextArcPhase(state, normalizedEvent);
  if (nextPhase !== state.arcPhase) {
    reasons.push(
      `Arc phase moved from ${PHASE_LABELS[state.arcPhase]} to ${PHASE_LABELS[nextPhase]}.`,
    );
    state.arcPhase = nextPhase;
  }

  state.recentEvents.push({
    label: normalizedEvent.label,
    category: normalizedEvent.category,
    tier: normalizedEvent.tier,
    outcome: normalizedEvent.outcome,
    summary: normalizedEvent.summary,
    turn: state.turn,
    tags: [...(normalizedEvent.tags ?? [])],
  });
  state.recentEvents = state.recentEvents.slice(-8);
  state.memories = compactNarrativeMemories(state.memories);

  const promptContext = compileNarrativeRuntimePromptContext(state, {
    ...options,
    maxMemories: options.maxMemories ?? 3,
  });

  return {
    state,
    previousStage,
    nextStage: state.relationshipStage,
    stageChanged: previousStage !== state.relationshipStage,
    phaseChanged: previousPhase !== state.arcPhase,
    activatedGates,
    recalledMemories,
    causeFrame,
    promptContext,
    reasons,
  };
}

export function compileNarrativeRuntimePromptContext(
  stateInput: NarrativeRuntimeState,
  options: NarrativePromptContextOptions = {},
): string {
  const state = normalizeNarrativeRuntimeState(stateInput);
  const maxMemories = Math.max(0, options.maxMemories ?? 4);
  const memories = state.memories
    .slice()
    .sort(compareMemories)
    .slice(0, maxMemories)
    .map((memory) =>
      `Memory: ${sanitizePromptText(memory.summary)}. Meaning: ${sanitizePromptText(memory.meaning)}. Effect: ${sanitizePromptText(memory.stateImpact)}.`,
    );
  const causeFrame = state.lastCauseFrame
    ? [
        `Cause chain: ${sanitizePromptText(state.lastCauseFrame.event)} -> ${sanitizePromptText(state.lastCauseFrame.interpretation)} -> ${sanitizePromptText(state.lastCauseFrame.behaviorIntent)}.`,
        state.lastCauseFrame.pressuredLaws.length
          ? `Law pressure: ${state.lastCauseFrame.pressuredLaws.map(sanitizePromptText).join(", ")}.`
          : undefined,
        state.lastCauseFrame.activeDefenses.length
          ? `Active defense: ${state.lastCauseFrame.activeDefenses.map(sanitizePromptText).join(", ")}.`
          : undefined,
        state.lastCauseFrame.hiddenNeed
          ? `Hidden need: ${sanitizePromptText(state.lastCauseFrame.hiddenNeed)}.`
          : undefined,
      ].filter(Boolean)
    : [];

  const activeTruths = state.causeProfile.storyTruths
    .filter((truth) => truth.active)
    .slice(0, 3)
    .map((truth) =>
      `Story truth: ${sanitizePromptText(truth.truth)}${truth.pressure ? ` Pressure: ${sanitizePromptText(truth.pressure)}.` : "."}`,
    );

  const lines = [
    "Use this hidden narrative runtime as soft guidance. Do not name the engine, route labels, internal gates, or numeric metrics in character.",
    `Relationship stage: ${STAGE_LABELS[state.relationshipStage]}.`,
    `Arc phase: ${PHASE_LABELS[state.arcPhase]}.`,
    `State color: ${summarizeAxes(state.axes)}.`,
    `Behavior route: ${stageBehaviorGuidance(state.relationshipStage)} ${phaseBehaviorGuidance(state.arcPhase)}`,
    ...causeFrame,
    ...activeTruths,
    ...memories,
    options.includeAgencyReminder === false
      ? undefined
      : "Preserve player agency: never write the user's thoughts, feelings, intentions, decisions, or dialogue.",
  ].filter(Boolean);

  return lines.join("\n");
}

export function compactNarrativeMemories(
  memories: readonly NarrativeMemory[],
  maxMemories = DEFAULT_MEMORY_LIMIT,
): NarrativeMemory[] {
  const normalized = memories.map((memory) => NarrativeMemorySchema.parse(memory));
  const pinned = normalized.filter(
    (memory) => memory.pinned || memory.tier === "core_identity",
  );
  const regular = normalized
    .filter((memory) => !pinned.includes(memory))
    .sort(compareMemories)
    .slice(0, Math.max(0, maxMemories - pinned.length));

  return [...pinned, ...regular].sort(compareMemories);
}

export function recallNarrativeMemories(
  memories: readonly NarrativeMemory[],
  event: NarrativeEventInput,
  limit = 3,
): NarrativeMemory[] {
  const normalizedEvent = normalizeNarrativeEventInput(event);
  const eventText = normalizeForMatching([
    normalizedEvent.label,
    normalizedEvent.summary,
    normalizedEvent.stimulus,
    normalizedEvent.interpretedAs,
    ...(normalizedEvent.tags ?? []),
  ].join(" "));

  return memories
    .filter((memory) => {
      const terms = [
        ...memory.tags,
        memory.summary,
        memory.meaning,
      ].map(normalizeForMatching);
      return terms.some((term) => term.length > 2 && eventText.includes(term));
    })
    .sort(compareMemories)
    .slice(0, Math.max(0, limit));
}

function normalizeNarrativeEventInput(event: NarrativeEventInput): Required<
  Pick<NarrativeEventInput, "label" | "summary" | "category" | "tier" | "outcome">
> &
  NarrativeEventInput {
  const eventText = normalizeForMatching([
    event.label,
    event.summary,
    event.stimulus,
    event.interpretedAs,
    ...(event.tags ?? []),
  ].join(" "));

  return {
    ...event,
    label: event.label.trim(),
    summary: event.summary.trim(),
    category: event.category ?? inferEventCategory(eventText),
    tier: event.tier ?? inferEventTier(eventText),
    outcome: event.outcome ?? inferEventOutcome(eventText),
    tags: [...(event.tags ?? [])],
  };
}

function applyStateDecay(state: NarrativeRuntimeState): void {
  state.axes.emotionalRegulation = moveToward(state.axes.emotionalRegulation, 70, 4);
  state.axes.powerPerception = moveToward(state.axes.powerPerception, 0, 3);

  if (state.pacingMode !== "slow_burn") {
    state.axes.romanticTension = moveToward(state.axes.romanticTension, 0, 1);
  }
}

function inferStateImpact(
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): Partial<NarrativeAxisState> {
  const text = normalizeForMatching([
    event.label,
    event.summary,
    event.stimulus,
    event.interpretedAs,
    event.outcome,
    ...(event.tags ?? []),
  ].join(" "));
  const impact: Partial<NarrativeAxisState> = {};

  if (includesAny(text, ["reassure", "i am here", "not leaving", "safe", "comfort"])) {
    impact.trust = 8;
    impact.affection = 6;
    impact.emotionalRegulation = 6;
  }

  if (includesAny(text, ["confession", "honest", "vulnerable", "secret", "truth"])) {
    impact.trust = (impact.trust ?? 0) + 6;
    impact.romanticTension = (impact.romanticTension ?? 0) + 8;
    impact.affection = (impact.affection ?? 0) + 5;
  }

  if (includesAny(text, ["rescue", "protect", "save", "crisis", "danger", "sacrifice"])) {
    impact.trust = (impact.trust ?? 0) + 10;
    impact.respect = 8;
    impact.affection = (impact.affection ?? 0) + 8;
    impact.emotionalRegulation = (impact.emotionalRegulation ?? 0) - 8;
  }

  if (includesAny(text, ["jealous", "rival", "replace", "chosen last", "third party"])) {
    impact.trust = (impact.trust ?? 0) - 4;
    impact.romanticTension = (impact.romanticTension ?? 0) + 12;
    impact.powerPerception = -8;
  }

  if (includesAny(text, ["argument", "fight", "insult", "mock", "humiliate", "raised voice"])) {
    impact.trust = (impact.trust ?? 0) - 7;
    impact.romanticTension = (impact.romanticTension ?? 0) + 4;
    impact.emotionalRegulation = (impact.emotionalRegulation ?? 0) - 12;
    impact.respect = (impact.respect ?? 0) - 4;
  }

  if (includesAny(text, ["betray", "lied", "behind my back", "broken promise", "cheated"])) {
    impact.trust = (impact.trust ?? 0) - 35;
    impact.affection = (impact.affection ?? 0) - 12;
    impact.respect = (impact.respect ?? 0) - 18;
    impact.emotionalRegulation = (impact.emotionalRegulation ?? 0) - 20;
  }

  if (includesAny(text, ["apology", "repair", "accountability", "i was wrong", "changed behavior"])) {
    impact.trust = (impact.trust ?? 0) + 10;
    impact.respect = (impact.respect ?? 0) + 6;
    impact.emotionalRegulation = (impact.emotionalRegulation ?? 0) + 8;
  }

  if (includesAny(text, ["goodbye", "leave", "leaving", "separation", "go away"])) {
    impact.trust = (impact.trust ?? 0) - 8;
    impact.romanticTension = (impact.romanticTension ?? 0) + 8;
    impact.emotionalRegulation = (impact.emotionalRegulation ?? 0) - 10;
  }

  if (includesAny(text, ["kiss", "held close", "touch", "embrace", "physical"])) {
    impact.physicalAttraction = (impact.physicalAttraction ?? 0) + 12;
    impact.romanticTension = (impact.romanticTension ?? 0) + 10;
    impact.affection = (impact.affection ?? 0) + 4;
  }

  return impact;
}

function applyAxisDeltas(
  axes: NarrativeAxisState,
  deltas: Partial<NarrativeAxisState>,
): void {
  axes.trust = clampScore(axes.trust + (deltas.trust ?? 0));
  axes.affection = clampSignedScore(axes.affection + (deltas.affection ?? 0));
  axes.romanticTension = clampScore(
    axes.romanticTension + (deltas.romanticTension ?? 0),
  );
  axes.respect = clampScore(axes.respect + (deltas.respect ?? 0));
  axes.physicalAttraction = clampScore(
    axes.physicalAttraction + (deltas.physicalAttraction ?? 0),
  );
  axes.emotionalRegulation = clampScore(
    axes.emotionalRegulation + (deltas.emotionalRegulation ?? 0),
  );
  axes.powerPerception = clampSignedScore(
    axes.powerPerception + (deltas.powerPerception ?? 0),
  );
}

function activateEventGates(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): NarrativeEventGate[] {
  const text = normalizeForMatching([
    event.label,
    event.summary,
    event.stimulus,
    event.interpretedAs,
    event.outcome,
    ...(event.tags ?? []),
  ].join(" "));
  const gates = new Set<NarrativeEventGate>(event.gateActivations ?? []);

  if (includesAny(text, ["crisis", "danger", "rescue", "fights side by side", "bandage"])) {
    gates.add("first_crisis");
  }
  if (includesAny(text, ["secret", "confession", "truth", "private reveal", "shared history"])) {
    gates.add("shared_secret");
  }
  if (includesAny(text, ["separation", "goodbye", "leave", "almost lost", "parted"])) {
    gates.add("the_separation");
  }
  if (includesAny(text, ["sacrifice", "choose you", "public choice", "cost", "risked everything"])) {
    gates.add("major_sacrifice");
  }
  if (includesAny(text, ["kiss", "confession", "pledge", "exclusive", "commitment"])) {
    gates.add("confession_or_intimate_event");
  }
  if (includesAny(text, ["betray", "broken promise", "boundary violation", "humiliation"])) {
    gates.add("rupture_event");
  }
  if (includesAny(text, ["apology", "repair", "accountability", "changed behavior"])) {
    gates.add("repair_attempt");
  }
  if (includesAny(text, ["public choice", "let them see", "side taken", "chosen above"])) {
    gates.add("public_choice");
  }

  const activated: NarrativeEventGate[] = [];
  for (const gate of gates) {
    if (!state.eventGates[gate]) {
      activated.push(gate);
    }
    state.eventGates[gate] = true;
  }

  return activated;
}

function buildCauseFrame(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): NarrativeCauseFrame {
  const candidateLaws = [
    ...state.causeProfile.immutableLaws,
    ...state.causeProfile.relationshipLaws,
  ];
  const eventText = normalizeForMatching([
    event.label,
    event.summary,
    event.stimulus,
    event.interpretedAs,
    ...(event.tags ?? []),
  ].join(" "));
  const pressuredLaws = uniqueText([
    ...(event.pressuredLawIds ?? []),
    ...candidateLaws
      .filter((law) =>
        law.pressuredBy.some((term) => eventText.includes(normalizeForMatching(term))),
      )
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3)
      .map((law) => law.label),
  ]);
  const activeDefenses = uniqueText([
    ...(event.activeDefenseIds ?? []),
    ...state.causeProfile.activeDefenses
      .filter((defense) => eventText.includes(normalizeForMatching(defense.trigger)))
      .slice(0, 2)
      .map((defense) => defense.label),
  ]);

  return NarrativeCauseFrameSchema.parse({
    event: event.stimulus ?? event.summary,
    interpretation:
      event.interpretedAs ??
      inferInterpretation(state, event),
    pressuredLaws,
    activeDefenses,
    hiddenNeed: event.hiddenNeed ?? inferHiddenNeed(state, event),
    behaviorIntent:
      event.behaviorIntent ?? inferBehaviorIntent(state, event, activeDefenses),
    consequence:
      event.consequence ?? inferConsequence(event),
  });
}

function evaluateNextRelationshipStage(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): NarrativeRelationshipStage {
  const candidate = evaluateUnboundedStageCandidate(state, event);
  if (!candidate || candidate === state.relationshipStage) {
    return state.relationshipStage;
  }

  const allowed = ALLOWED_ADJACENT_STAGES[state.relationshipStage] ?? [];
  if (allowed.includes(candidate)) {
    return candidate;
  }

  return firstStepTowardStage(state.relationshipStage, candidate) ?? state.relationshipStage;
}

function evaluateUnboundedStageCandidate(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): NarrativeRelationshipStage | undefined {
  const axes = state.axes;
  const gates = state.eventGates;
  const text = normalizeForMatching([
    event.label,
    event.summary,
    event.outcome,
    ...(event.tags ?? []),
  ].join(" "));

  if (
    gates.rupture_event &&
    axes.trust < 20 &&
    isCloseOrVulnerableStage(state.relationshipStage)
  ) {
    return "betrayed";
  }

  if (state.relationshipStage === "betrayed" && axes.affection < 10) {
    return "estranged";
  }

  if (axes.affection < -30 && axes.trust < 10) {
    return "active_adversaries";
  }

  if (state.relationshipStage === "active_adversaries" && gates.first_crisis) {
    return "reluctant_partners";
  }

  if (
    ["active_adversaries", "reluctant_partners"].includes(state.relationshipStage) &&
    axes.romanticTension >= 50 &&
    axes.physicalAttraction >= 45
  ) {
    return "spiteful_fascination";
  }

  if (
    state.relationshipStage === "spiteful_fascination" &&
    axes.trust >= 40 &&
    axes.respect >= 40
  ) {
    return "frenemies";
  }

  if (
    state.relationshipStage === "frenemies" &&
    axes.affection >= 40 &&
    axes.trust >= 55
  ) {
    return "casual_allies";
  }

  if (
    state.relationshipStage === "strangers" &&
    (axes.trust >= 30 || axes.affection >= 20 || includesAny(text, ["introduction", "shared name", "formal greeting"]))
  ) {
    return "acquaintances";
  }

  if (
    state.relationshipStage === "acquaintances" &&
    ((axes.trust >= 45 && axes.respect >= 40) || gates.first_crisis)
  ) {
    return "casual_allies";
  }

  if (
    state.relationshipStage === "casual_allies" &&
    axes.trust >= 60 &&
    includesAny(text, ["secret", "confide", "vulnerable", "trust"])
  ) {
    return "confidants";
  }

  if (
    ["casual_allies", "confidants"].includes(state.relationshipStage) &&
    axes.romanticTension >= 40 &&
    axes.physicalAttraction >= 35 &&
    (gates.shared_secret || state.relationshipStage === "confidants")
  ) {
    return "unspoken_attraction";
  }

  if (
    state.relationshipStage === "unspoken_attraction" &&
    axes.romanticTension >= 60 &&
    axes.affection >= 45 &&
    gates.the_separation
  ) {
    return "mutual_longing";
  }

  if (
    state.relationshipStage === "mutual_longing" &&
    gates.confession_or_intimate_event
  ) {
    return "confessed_affection";
  }

  if (
    state.relationshipStage === "confessed_affection" &&
    axes.trust >= 70 &&
    axes.affection >= 70 &&
    (gates.major_sacrifice || gates.public_choice)
  ) {
    return "intimate_partners";
  }

  return undefined;
}

function firstStepTowardStage(
  current: NarrativeRelationshipStage,
  target: NarrativeRelationshipStage,
): NarrativeRelationshipStage | undefined {
  const visited = new Set<NarrativeRelationshipStage>();
  const queue: Array<{
    stage: NarrativeRelationshipStage;
    first: NarrativeRelationshipStage | undefined;
  }> = [{ stage: current, first: undefined }];

  while (queue.length) {
    const item = queue.shift();
    if (!item || visited.has(item.stage)) {
      continue;
    }
    visited.add(item.stage);

    for (const next of ALLOWED_ADJACENT_STAGES[item.stage] ?? []) {
      if (next === target) {
        return item.first ?? next;
      }
      if (!visited.has(next)) {
        queue.push({ stage: next, first: item.first ?? next });
      }
    }
  }

  return undefined;
}

function evaluateNextArcPhase(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): NarrativeArcPhase {
  if (state.arcPhase === "initiation") {
    if (
      state.relationshipStage !== "strangers" &&
      (state.turn >= 3 || state.axes.trust >= 40 || state.eventGates.first_crisis)
    ) {
      return "development";
    }
    return state.arcPhase;
  }

  if (state.arcPhase === "development") {
    if (
      event.tier === "major_event" ||
      state.axes.romanticTension >= 65 ||
      state.eventGates.rupture_event
    ) {
      return "escalation";
    }
    return state.arcPhase;
  }

  if (state.arcPhase === "escalation") {
    if (
      event.tier === "major_event" &&
      ["rupture", "reveal", "escalate"].includes(event.outcome)
    ) {
      return "crisis_turning_point";
    }
    return state.arcPhase;
  }

  if (state.arcPhase === "crisis_turning_point") {
    if (
      event.outcome === "repair" ||
      event.outcome === "stabilize" ||
      state.eventGates.repair_attempt
    ) {
      return "resolution_stabilization";
    }
    return state.arcPhase;
  }

  if (
    state.arcPhase === "resolution_stabilization" &&
    event.outcome === "escalate" &&
    event.tier !== "micro_event"
  ) {
    return "escalation";
  }

  return state.arcPhase;
}

function addMemoryForEvent(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
  causeFrame: NarrativeCauseFrame,
): void {
  const text = normalizeForMatching([
    event.label,
    event.summary,
    event.outcome,
    ...(event.tags ?? []),
  ].join(" "));
  const isImportant =
    event.memoryWeight !== undefined ||
    event.tier === "major_event" ||
    IMPORTANT_EVENT_TERMS.some((term) => text.includes(term));

  if (!isImportant) {
    return;
  }

  const memory = NarrativeMemorySchema.parse({
    id: `narrative-memory:${state.turn}:${slugText(event.label)}`,
    tier: event.memoryTier ?? "relationship_memory",
    summary: event.summary,
    meaning: causeFrame.interpretation,
    stateImpact: causeFrame.consequence,
    emotionalWeight: clampScore(event.memoryWeight ?? inferMemoryWeight(event)),
    turn: state.turn,
    tags: uniqueText([...(event.tags ?? []), event.outcome, event.category]),
    pinned: event.tier === "major_event" || event.outcome === "rupture",
  });

  state.memories.push(memory);
}

function inferMemoryWeight(event: ReturnType<typeof normalizeNarrativeEventInput>) {
  if (event.outcome === "rupture") {
    return 90;
  }
  if (event.tier === "major_event") {
    return 82;
  }
  if (event.outcome === "repair" || event.outcome === "reveal") {
    return 70;
  }
  return 55;
}

function inferEventCategory(text: string): NarrativeEventCategory {
  if (includesAny(text, ["storm", "room", "weather", "time pressure", "threat", "danger"])) {
    return "environmental";
  }
  if (includesAny(text, ["memory", "dream", "fear", "shame", "moral", "identity"])) {
    return "internal";
  }
  if (includesAny(text, ["rival", "jealous", "third party", "betray", "loyalty"])) {
    return "relationship";
  }
  if (includesAny(text, ["law", "setting", "society", "court", "family pressure"])) {
    return "setting_pressure";
  }
  return "interpersonal";
}

function inferEventTier(text: string): NarrativeEventTier {
  if (includesAny(text, ["betray", "confession", "crisis", "separation", "sacrifice", "breakup", "major"])) {
    return "major_event";
  }
  if (includesAny(text, ["argument", "reveal", "apology", "jealous", "external complication"])) {
    return "meso_event";
  }
  return "micro_event";
}

function inferEventOutcome(text: string): NarrativeEventOutcome {
  if (includesAny(text, ["betray", "broken promise", "boundary violation", "humiliate"])) {
    return "rupture";
  }
  if (includesAny(text, ["apology", "repair", "accountability", "changed behavior"])) {
    return "repair";
  }
  if (includesAny(text, ["confession", "secret", "truth", "reveal"])) {
    return "reveal";
  }
  if (includesAny(text, ["comfort", "reassure", "safe", "calm", "settle"])) {
    return "stabilize";
  }
  if (includesAny(text, ["argument", "danger", "jealous", "crisis", "pressure", "kiss"])) {
    return "escalate";
  }
  return "maintain";
}

function inferInterpretation(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): string {
  const text = normalizeForMatching([event.label, event.summary, ...(event.tags ?? [])].join(" "));

  if (includesAny(text, ["goodbye", "leave", "delayed reply", "silence"])) {
    return "Distance is interpreted as possible abandonment or emotional exit.";
  }
  if (includesAny(text, ["rival", "jealous", "replace"])) {
    return "Shared attention is interpreted as possible replacement.";
  }
  if (includesAny(text, ["betray", "lied", "secret"])) {
    return "Hidden information is interpreted as danger to trust.";
  }
  if (includesAny(text, ["rescue", "protect", "sacrifice"])) {
    return state.axes.trust < 35
      ? "Protection creates reluctant reliance before full trust can catch up."
      : "Protection is taken as meaningful proof of care.";
  }
  if (includesAny(text, ["apology", "repair"])) {
    return "Repair is measured by accountability and changed behavior, not just words.";
  }
  return "The event is filtered through current trust, attraction, regulation, and active character laws.";
}

function inferHiddenNeed(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
): string | undefined {
  const text = normalizeForMatching([event.label, event.summary, ...(event.tags ?? [])].join(" "));

  if (includesAny(text, ["goodbye", "leave", "silence", "delayed reply"])) {
    return "reliable return";
  }
  if (includesAny(text, ["rival", "jealous", "replace", "public choice"])) {
    return "clear priority without control";
  }
  if (includesAny(text, ["betray", "lied", "secret"])) {
    return "truth with accountability";
  }
  if (state.axes.trust < 30) {
    return "evidence before vulnerability";
  }
  return undefined;
}

function inferBehaviorIntent(
  state: NarrativeRuntimeState,
  event: ReturnType<typeof normalizeNarrativeEventInput>,
  defenses: readonly string[],
): string {
  if (defenses.length) {
    return "Let the defense shape delivery, but keep the underlying need visible through subtext.";
  }

  if (event.outcome === "repair") {
    return "Move toward repair through accountability, reassurance, or changed behavior.";
  }
  if (event.outcome === "rupture") {
    return "Show the cost through guardedness, anger, withdrawal, or a demand for proof.";
  }
  if (state.axes.trust < 25) {
    return "Cooperate only with visible friction; trust has not caught up to circumstance.";
  }
  if (state.axes.romanticTension > 60) {
    return "Let attraction show through attention, hesitation, proximity, or charged restraint.";
  }
  return "Maintain recognizable character voice while letting the event alter tone and initiative.";
}

function inferConsequence(event: ReturnType<typeof normalizeNarrativeEventInput>): string {
  if (event.outcome === "rupture") {
    return "The moment becomes relationship memory and should leave behavioral residue.";
  }
  if (event.outcome === "repair") {
    return "Trust may recover, but the repair should require follow-through.";
  }
  if (event.outcome === "reveal") {
    return "New truth should alter future interpretation and scene subtext.";
  }
  if (event.tier === "major_event") {
    return "The route should not reset after this turning point.";
  }
  return "The event should color the next reply without forcing a personality change.";
}

function summarizeAxes(axes: NarrativeAxisState): string {
  return [
    `trust ${bandLabel(axes.trust, ["defensive", "cautious", "open", "vulnerable"])}`,
    `affection ${signedBandLabel(axes.affection, ["hostile", "guarded", "warm", "devoted"])}`,
    `tension ${bandLabel(axes.romanticTension, ["quiet", "curious", "charged", "urgent"])}`,
    `regulation ${bandLabel(axes.emotionalRegulation, ["volatile", "reactive", "controlled", "composed"])}`,
    `power ${signedBandLabel(axes.powerPerception, ["pressured", "equal", "steady", "commanding"])}`,
  ].join("; ");
}

function stageBehaviorGuidance(stage: NarrativeRelationshipStage): string {
  switch (stage) {
    case "strangers":
      return "Keep behavior formal, guarded, and curious.";
    case "acquaintances":
      return "Use social scripts with small tests of safety.";
    case "casual_allies":
      return "Allow cooperation and light familiarity without full emotional access.";
    case "confidants":
      return "Permit selective honesty and private trust.";
    case "unspoken_attraction":
      return "Use subtext, physical awareness, and restraint before direct confession.";
    case "mutual_longing":
      return "Make longing visible through choices, jealousy, and difficulty pulling away.";
    case "confessed_affection":
      return "Let open vulnerability coexist with uncertainty about what happens next.";
    case "intimate_partners":
      return "Use established intimacy, shared future thinking, and protective transparency.";
    case "active_adversaries":
      return "Use hostility and hard boundaries while preserving character logic.";
    case "reluctant_partners":
      return "Allow cooperation before trust; make reliance uncomfortable but functional.";
    case "spiteful_fascination":
      return "Let attraction sharpen conflict rather than soften it too quickly.";
    case "frenemies":
      return "Alternate competitive intimacy with genuine support.";
    case "betrayed":
      return "Keep affection and hurt in conflict; trust has collapsed but feeling may remain.";
    case "estranged":
      return "Return to distance with emotional residue.";
    case "toxic_loop":
      return "Show cyclical attraction and hostility without presenting it as healthy stability.";
    default:
      return "Keep the current relationship definition visible through behavior.";
  }
}

function phaseBehaviorGuidance(phase: NarrativeArcPhase): string {
  switch (phase) {
    case "initiation":
      return "Avoid major confessions or irreversible intimacy; build curiosity.";
    case "development":
      return "Vary repeated contact with early vulnerability, misunderstandings, and pattern formation.";
    case "escalation":
      return "Increase pressure and emotional stakes without resolving too neatly.";
    case "crisis_turning_point":
      return "Focus on consequence, choice, revelation, rupture, or confrontation.";
    case "resolution_stabilization":
      return "Process aftermath and establish a new baseline.";
  }
}

function isCloseOrVulnerableStage(stage: NarrativeRelationshipStage): boolean {
  return [
    "confidants",
    "mutual_longing",
    "confessed_affection",
    "intimate_partners",
    "forbidden_partners",
    "situationship",
  ].includes(stage);
}

function compareMemories(a: NarrativeMemory, b: NarrativeMemory): number {
  if (a.pinned !== b.pinned) {
    return a.pinned ? -1 : 1;
  }
  if (a.tier !== b.tier) {
    return memoryTierRank(a.tier) - memoryTierRank(b.tier);
  }
  if (a.emotionalWeight !== b.emotionalWeight) {
    return b.emotionalWeight - a.emotionalWeight;
  }
  return b.turn - a.turn;
}

function memoryTierRank(tier: NarrativeMemoryTier): number {
  if (tier === "core_identity") return 0;
  if (tier === "relationship_memory") return 1;
  return 2;
}

function includesAny(text: string, terms: readonly string[]): boolean {
  return terms.some((term) => text.includes(normalizeForMatching(term)));
}

function uniqueText(values: readonly (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const text = value?.trim();
    const key = text?.toLowerCase();
    if (!text || !key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(text);
  }

  return output;
}

function slugText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function humanizeId(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizePromptText(value: string): string {
  return value
    .replace(/semantic[-_\s]?node/gi, "concept")
    .replace(/seed\s*:/gi, "concept:")
    .replace(/\b[a-z]+:[a-z0-9:_-]+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForMatching(value: string): string {
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampSignedScore(value: number): number {
  return Math.max(-100, Math.min(100, Math.round(value)));
}

function moveToward(value: number, target: number, amount: number): number {
  if (value === target) {
    return value;
  }
  if (value < target) {
    return Math.min(target, value + amount);
  }
  return Math.max(target, value - amount);
}

function bandLabel(
  value: number,
  labels: readonly [string, string, string, string],
): string {
  if (value <= 20) return labels[0];
  if (value <= 50) return labels[1];
  if (value <= 80) return labels[2];
  return labels[3];
}

function signedBandLabel(
  value: number,
  labels: readonly [string, string, string, string],
): string {
  if (value <= -30) return labels[0];
  if (value < 20) return labels[1];
  if (value < 70) return labels[2];
  return labels[3];
}
