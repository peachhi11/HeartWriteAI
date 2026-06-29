import { z } from "zod";

import {
  CharacterLawSchema,
  NarrativeMemorySchema,
  NarrativeRecentEventSchema,
  NarrativeRuntimeStateSchema,
  type CharacterLaw,
  type NarrativeRuntimeState,
} from "./narrativeEngine";

export const CONTINUITY_CANON_LEDGER_SCHEMA_VERSION = 1;

const nonEmptyString = z.string().trim().min(1);
const softScore = z.coerce.number().min(0).max(100);

export const CanonTruthTierSchema = z.enum([
  "character_truth",
  "story_truth",
  "setting_truth",
  "runtime_context",
]);
export type CanonTruthTier = z.infer<typeof CanonTruthTierSchema>;

export const CanonPromptVisibilitySchema = z.enum([
  "prompt_safe",
  "review_required",
  "writer_only",
]);
export type CanonPromptVisibility = z.infer<
  typeof CanonPromptVisibilitySchema
>;

export const CanonFactCategorySchema = z.enum([
  "identity",
  "relationship",
  "world",
  "location",
  "item",
  "event",
  "boundary",
  "memory",
  "route",
  "other",
]);
export type CanonFactCategory = z.infer<typeof CanonFactCategorySchema>;

export const CanonPlotStatusSchema = z.enum([
  "active",
  "paused",
  "resolved",
]);
export type CanonPlotStatus = z.infer<typeof CanonPlotStatusSchema>;

export const CanonSourceSchema = z.object({
  tier: CanonTruthTierSchema,
  label: nonEmptyString.default("Unknown source"),
  sourceId: z.string().trim().optional(),
  reviewRequired: z.boolean().default(false),
  hiddenFromUser: z.boolean().default(false),
});
export type CanonSource = z.infer<typeof CanonSourceSchema>;

export const CanonFactSchema = z.object({
  id: nonEmptyString,
  category: CanonFactCategorySchema.default("other"),
  scope: CanonTruthTierSchema.default("story_truth"),
  statement: nonEmptyString,
  source: CanonSourceSchema,
  evidence: z.array(nonEmptyString).default([]),
  tags: z.array(nonEmptyString).default([]),
  active: z.boolean().default(true),
  confidence: softScore.default(80),
  promptVisibility: CanonPromptVisibilitySchema.default("prompt_safe"),
  hiddenFromUser: z.boolean().default(false),
});
export type CanonFact = z.infer<typeof CanonFactSchema>;

export const CanonTimelineEventSchema = z.object({
  id: nonEmptyString,
  turn: z.coerce.number().int().min(0).default(0),
  sequence: z.coerce.number().int().min(0).default(0),
  label: nonEmptyString,
  summary: nonEmptyString,
  category: z
    .enum([
      "interpersonal",
      "environmental",
      "internal",
      "relationship",
      "setting_pressure",
      "other",
    ])
    .default("other"),
  participants: z.array(nonEmptyString).default([]),
  location: z.string().trim().optional(),
  impact: z.string().trim().optional(),
  source: CanonSourceSchema,
  tags: z.array(nonEmptyString).default([]),
  pinned: z.boolean().default(false),
  promptVisibility: CanonPromptVisibilitySchema.default("prompt_safe"),
});
export type CanonTimelineEvent = z.infer<typeof CanonTimelineEventSchema>;

export const CanonCharacterStateSchema = z.object({
  characterId: nonEmptyString,
  displayName: z.string().trim().optional(),
  location: z.string().trim().optional(),
  physicalState: z.string().trim().optional(),
  mentalState: z.string().trim().optional(),
  currentGoal: z.string().trim().optional(),
  knowledge: z.array(nonEmptyString).default([]),
  constraints: z.array(nonEmptyString).default([]),
  updatedAtTurn: z.coerce.number().int().min(0).default(0),
});
export type CanonCharacterState = z.infer<typeof CanonCharacterStateSchema>;

export const CanonRelationshipStateSchema = z.object({
  id: nonEmptyString,
  participantIds: z.array(nonEmptyString).min(1),
  publicStatus: z.string().trim().optional(),
  privateStatus: z.string().trim().optional(),
  stage: z.string().trim().optional(),
  trustLevel: z.string().trim().optional(),
  tensionLevel: z.string().trim().optional(),
  openLoops: z.array(nonEmptyString).default([]),
  boundaries: z.array(nonEmptyString).default([]),
  updatedAtTurn: z.coerce.number().int().min(0).default(0),
});
export type CanonRelationshipState = z.infer<
  typeof CanonRelationshipStateSchema
>;

export const CanonPlotLineSchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  status: CanonPlotStatusSchema.default("active"),
  summary: nonEmptyString,
  currentState: z.string().trim().optional(),
  stakes: z.string().trim().optional(),
  participants: z.array(nonEmptyString).default([]),
  tags: z.array(nonEmptyString).default([]),
  startedAtTurn: z.coerce.number().int().min(0).default(0),
  lastAdvancedTurn: z.coerce.number().int().min(0).default(0),
  resolvedAtTurn: z.coerce.number().int().min(0).optional(),
  promptVisibility: CanonPromptVisibilitySchema.default("prompt_safe"),
});
export type CanonPlotLine = z.infer<typeof CanonPlotLineSchema>;

export const CanonMemoryAnchorSchema = NarrativeMemorySchema.extend({
  promptVisibility: CanonPromptVisibilitySchema.default("prompt_safe"),
});
export type CanonMemoryAnchor = z.infer<typeof CanonMemoryAnchorSchema>;

export const CanonHardConstraintSchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  rule: nonEmptyString,
  alternativeAction: z.string().trim().optional(),
  source: CanonSourceSchema,
  scope: CanonTruthTierSchema.default("character_truth"),
  tags: z.array(nonEmptyString).default([]),
  promptVisibility: CanonPromptVisibilitySchema.default("prompt_safe"),
});
export type CanonHardConstraint = z.infer<typeof CanonHardConstraintSchema>;

export const ContinuityCanonLedgerSchema = z.object({
  schemaVersion: z.literal(CONTINUITY_CANON_LEDGER_SCHEMA_VERSION).default(
    CONTINUITY_CANON_LEDGER_SCHEMA_VERSION,
  ),
  id: nonEmptyString,
  projectId: z.string().trim().optional(),
  characterId: z.string().trim().optional(),
  scenarioId: z.string().trim().optional(),
  currentTurn: z.coerce.number().int().min(0).default(0),
  characterStates: z.array(CanonCharacterStateSchema).default([]),
  relationshipStates: z.array(CanonRelationshipStateSchema).default([]),
  timeline: z.array(CanonTimelineEventSchema).default([]),
  facts: z.array(CanonFactSchema).default([]),
  openPlotLines: z.array(CanonPlotLineSchema).default([]),
  memoryAnchors: z.array(CanonMemoryAnchorSchema).default([]),
  hardConstraints: z.array(CanonHardConstraintSchema).default([]),
  tags: z.array(nonEmptyString).default([]),
});
export type ContinuityCanonLedger = z.infer<
  typeof ContinuityCanonLedgerSchema
>;

export interface CreateContinuityCanonLedgerInput {
  id?: string;
  projectId?: string;
  characterId?: string;
  scenarioId?: string;
  currentTurn?: number;
  characterStates?: readonly CanonCharacterState[];
  relationshipStates?: readonly CanonRelationshipState[];
  timeline?: readonly CanonTimelineEvent[];
  facts?: readonly CanonFact[];
  openPlotLines?: readonly CanonPlotLine[];
  memoryAnchors?: readonly CanonMemoryAnchor[];
  hardConstraints?: readonly CanonHardConstraint[];
  tags?: readonly string[];
}

export interface ContinuityCanonLedgerUpdate {
  currentTurn?: number;
  characterStates?: readonly CanonCharacterState[];
  relationshipStates?: readonly CanonRelationshipState[];
  timeline?: readonly CanonTimelineEvent[];
  facts?: readonly CanonFact[];
  openPlotLines?: readonly CanonPlotLine[];
  memoryAnchors?: readonly CanonMemoryAnchor[];
  hardConstraints?: readonly CanonHardConstraint[];
  tags?: readonly string[];
}

export interface ContinuityCanonPromptOptions {
  maxCharacterStates?: number;
  maxRelationshipStates?: number;
  maxFacts?: number;
  maxTimelineEvents?: number;
  maxPlotLines?: number;
  maxMemoryAnchors?: number;
  maxHardConstraints?: number;
  includeReviewRequired?: boolean;
}

export interface ContinuityCanonLedgerIssue {
  severity: "warning" | "error";
  field: string;
  message: string;
}

export function createContinuityCanonLedger(
  input: CreateContinuityCanonLedgerInput,
): ContinuityCanonLedger {
  const characterId = input.characterId?.trim();

  return normalizeContinuityCanonLedger({
    schemaVersion: CONTINUITY_CANON_LEDGER_SCHEMA_VERSION,
    id: input.id?.trim() || `canon-ledger:${slugText(characterId || "project")}`,
    projectId: input.projectId,
    characterId,
    scenarioId: input.scenarioId,
    currentTurn: input.currentTurn ?? 0,
    characterStates: [...(input.characterStates ?? [])],
    relationshipStates: [...(input.relationshipStates ?? [])],
    timeline: [...(input.timeline ?? [])],
    facts: [...(input.facts ?? [])],
    openPlotLines: [...(input.openPlotLines ?? [])],
    memoryAnchors: [...(input.memoryAnchors ?? [])],
    hardConstraints: [...(input.hardConstraints ?? [])],
    tags: [...(input.tags ?? [])],
  });
}

export function normalizeContinuityCanonLedger(
  input: unknown,
): ContinuityCanonLedger {
  const ledger = ContinuityCanonLedgerSchema.parse(input);

  return {
    ...ledger,
    characterStates: upsertByKey(
      ledger.characterStates,
      (state) => state.characterId,
    ),
    relationshipStates: upsertByKey(
      ledger.relationshipStates,
      (state) => state.id,
    ),
    timeline: upsertByKey(ledger.timeline, (event) => event.id).sort(
      (left, right) =>
        left.turn - right.turn ||
        left.sequence - right.sequence ||
        left.label.localeCompare(right.label),
    ),
    facts: upsertByKey(ledger.facts, (fact) => fact.id),
    openPlotLines: upsertByKey(
      ledger.openPlotLines,
      (plotLine) => plotLine.id,
    ).sort((left, right) => right.lastAdvancedTurn - left.lastAdvancedTurn),
    memoryAnchors: upsertByKey(
      ledger.memoryAnchors,
      (memory) => memory.id,
    ).sort(compareMemoryAnchors),
    hardConstraints: upsertByKey(
      ledger.hardConstraints,
      (constraint) => constraint.id,
    ),
    tags: uniqueText(ledger.tags),
  };
}

export function applyContinuityCanonLedgerUpdate(
  ledgerInput: ContinuityCanonLedger,
  update: ContinuityCanonLedgerUpdate,
): ContinuityCanonLedger {
  const ledger = normalizeContinuityCanonLedger(ledgerInput);

  return normalizeContinuityCanonLedger({
    ...ledger,
    currentTurn: Math.max(ledger.currentTurn, update.currentTurn ?? 0),
    characterStates: [
      ...ledger.characterStates,
      ...(update.characterStates ?? []),
    ],
    relationshipStates: [
      ...ledger.relationshipStates,
      ...(update.relationshipStates ?? []),
    ],
    timeline: [...ledger.timeline, ...(update.timeline ?? [])],
    facts: [...ledger.facts, ...(update.facts ?? [])],
    openPlotLines: [
      ...ledger.openPlotLines,
      ...(update.openPlotLines ?? []),
    ],
    memoryAnchors: [
      ...ledger.memoryAnchors,
      ...(update.memoryAnchors ?? []),
    ],
    hardConstraints: [
      ...ledger.hardConstraints,
      ...(update.hardConstraints ?? []),
    ],
    tags: uniqueText([...ledger.tags, ...(update.tags ?? [])]),
  });
}

export function createContinuityCanonLedgerFromNarrativeRuntime(
  runtimeInput: NarrativeRuntimeState,
  input: Partial<CreateContinuityCanonLedgerInput> = {},
): ContinuityCanonLedger {
  const runtime = NarrativeRuntimeStateSchema.parse(runtimeInput);
  const source = createRuntimeSource("Narrative Runtime");
  const characterId = input.characterId ?? runtime.characterId;
  const stageLabel = humanizeId(runtime.relationshipStage);
  const phaseLabel = humanizeId(runtime.arcPhase);
  const laws = [
    ...runtime.causeProfile.immutableLaws,
    ...runtime.causeProfile.relationshipLaws,
  ];

  return createContinuityCanonLedger({
    ...input,
    id:
      input.id ??
      `canon-ledger:${slugText(characterId)}:${slugText(runtime.scenarioId ?? "runtime")}`,
    characterId,
    scenarioId: input.scenarioId ?? runtime.scenarioId,
    currentTurn: input.currentTurn ?? runtime.turn,
    characterStates: [
      ...(input.characterStates ?? []),
      {
        characterId,
        mentalState: `Relationship stage: ${stageLabel}; arc phase: ${phaseLabel}.`,
        knowledge: runtime.tags,
        constraints: [],
        updatedAtTurn: runtime.turn,
      },
    ],
    relationshipStates: [
      ...(input.relationshipStates ?? []),
      {
        id: `relationship:${slugText(characterId)}:primary`,
        participantIds: [characterId, "{{user}}"],
        stage: stageLabel,
        trustLevel: qualitativeTrust(runtime.axes.trust),
        tensionLevel: qualitativeTension(runtime.axes.romanticTension),
        privateStatus: phaseLabel,
        updatedAtTurn: runtime.turn,
        openLoops: [],
        boundaries: [],
      },
    ],
    timeline: [
      ...(input.timeline ?? []),
      ...runtime.recentEvents.map((event, index) =>
        createTimelineEventFromRuntime(event, index, source),
      ),
    ],
    facts: [
      ...(input.facts ?? []),
      ...runtime.causeProfile.storyTruths.map((truth) =>
        CanonFactSchema.parse({
          id: `runtime-truth:${slugText(truth.id)}`,
          category: canonCategoryFromStoryTruthScope(truth.scope),
          scope: canonTierFromStoryTruthScope(truth.scope),
          statement: truth.truth,
          source,
          evidence: truth.pressure ? [truth.pressure] : [],
          tags: [truth.scope],
          active: truth.active,
          hiddenFromUser: truth.scope === "secret",
          promptVisibility: "prompt_safe",
        }),
      ),
    ],
    memoryAnchors: [
      ...(input.memoryAnchors ?? []),
      ...runtime.memories.map((memory) => ({
        ...memory,
        promptVisibility: "prompt_safe" as const,
      })),
    ],
    hardConstraints: [
      ...(input.hardConstraints ?? []),
      ...laws.map((law) => createHardConstraintFromLaw(law, source)),
    ],
    tags: uniqueText([...(input.tags ?? []), ...runtime.tags]),
  });
}

export function compileContinuityCanonPromptContext(
  ledgerInput: ContinuityCanonLedger,
  options: ContinuityCanonPromptOptions = {},
): string {
  const ledger = normalizeContinuityCanonLedger(ledgerInput);
  const visible = (visibility: CanonPromptVisibility) =>
    visibility === "prompt_safe" ||
    (visibility === "review_required" && options.includeReviewRequired);
  const characterStates = ledger.characterStates
    .slice(0, options.maxCharacterStates ?? 2)
    .map(formatCharacterState);
  const relationshipStates = ledger.relationshipStates
    .slice(0, options.maxRelationshipStates ?? 2)
    .map(formatRelationshipState);
  const facts = ledger.facts
    .filter((fact) => fact.active && visible(fact.promptVisibility))
    .slice(0, options.maxFacts ?? 6)
    .map(formatCanonFact);
  const timeline = ledger.timeline
    .filter((event) => visible(event.promptVisibility))
    .slice()
    .sort((left, right) => Number(right.pinned) - Number(left.pinned))
    .slice(0, options.maxTimelineEvents ?? 4)
    .sort((left, right) => left.turn - right.turn || left.sequence - right.sequence)
    .map(formatTimelineEvent);
  const plotLines = ledger.openPlotLines
    .filter((plotLine) => plotLine.status !== "resolved")
    .filter((plotLine) => visible(plotLine.promptVisibility))
    .slice(0, options.maxPlotLines ?? 4)
    .map(formatPlotLine);
  const memories = ledger.memoryAnchors
    .filter((memory) => visible(memory.promptVisibility))
    .slice(0, options.maxMemoryAnchors ?? 4)
    .map(formatMemoryAnchor);
  const constraints = ledger.hardConstraints
    .filter((constraint) => visible(constraint.promptVisibility))
    .slice(0, options.maxHardConstraints ?? 5)
    .map(formatHardConstraint);
  const lines = [
    "Use this private continuity canon as soft guidance. Do not mention ledger IDs, internal source IDs, raw scores, or storage structure in character.",
    ...characterStates,
    ...relationshipStates,
    ...facts,
    ...timeline,
    ...plotLines,
    ...memories,
    ...constraints,
  ].filter(Boolean);

  return lines.join("\n");
}

export function auditContinuityCanonLedger(
  ledgerInput: ContinuityCanonLedger,
): ContinuityCanonLedgerIssue[] {
  const ledger = normalizeContinuityCanonLedger(ledgerInput);
  const issues: ContinuityCanonLedgerIssue[] = [];

  for (const constraint of ledger.hardConstraints) {
    if (!constraint.alternativeAction?.trim()) {
      issues.push({
        severity: "warning",
        field: "hardConstraints",
        message: `Constraint "${constraint.label}" needs an alternative action.`,
      });
    }
  }

  for (const fact of ledger.facts) {
    if (
      fact.scope === "character_truth" &&
      (fact.statement.includes("{{user}}") || fact.hiddenFromUser)
    ) {
      issues.push({
        severity: "error",
        field: "facts",
        message:
          "Character-truth facts must not depend on target-specific user context.",
      });
    }
  }

  return issues;
}

function createTimelineEventFromRuntime(
  event: z.infer<typeof NarrativeRecentEventSchema>,
  index: number,
  source: CanonSource,
): CanonTimelineEvent {
  return CanonTimelineEventSchema.parse({
    id: `runtime-event:${event.turn}:${slugText(event.label)}`,
    turn: event.turn,
    sequence: index,
    label: event.label,
    summary: event.summary,
    category: event.category,
    impact: event.outcome,
    source,
    tags: event.tags,
    pinned: event.tier === "major_event" || event.outcome === "rupture",
  });
}

function createHardConstraintFromLaw(
  law: CharacterLaw,
  source: CanonSource,
): CanonHardConstraint {
  const parsed = CharacterLawSchema.parse(law);

  return CanonHardConstraintSchema.parse({
    id: `law-constraint:${slugText(parsed.id)}`,
    label: parsed.label,
    rule: parsed.description,
    alternativeAction: parsed.generatedBehaviors.join("; "),
    source,
    scope: "character_truth",
    tags: uniqueText([...parsed.protects, ...parsed.pressuredBy]),
  });
}

function createRuntimeSource(label: string): CanonSource {
  return {
    tier: "runtime_context",
    label,
    reviewRequired: false,
    hiddenFromUser: true,
  };
}

function canonTierFromStoryTruthScope(
  scope: "scenario" | "relationship" | "setting" | "secret",
): CanonTruthTier {
  if (scope === "setting") return "setting_truth";
  if (scope === "secret") return "runtime_context";
  return "story_truth";
}

function canonCategoryFromStoryTruthScope(
  scope: "scenario" | "relationship" | "setting" | "secret",
): CanonFactCategory {
  if (scope === "relationship") return "relationship";
  if (scope === "setting") return "world";
  if (scope === "secret") return "memory";
  return "event";
}

function formatCharacterState(state: CanonCharacterState): string {
  const details = [
    state.displayName ? `${state.displayName} is the active character.` : undefined,
    state.location ? `They are currently at ${state.location}.` : undefined,
    state.physicalState ? `Physically, ${state.physicalState}.` : undefined,
    state.mentalState ? `Mentally, ${state.mentalState}.` : undefined,
    state.currentGoal
      ? `They are trying to ${lowercaseFirst(state.currentGoal)}.`
      : undefined,
    state.constraints.length
      ? `They must respect ${state.constraints.join("; ")}.`
      : undefined,
  ].filter((detail): detail is string => Boolean(detail));

  return details.length ? sanitizePromptText(details.join(" ")) : "";
}

function formatRelationshipState(state: CanonRelationshipState): string {
  const details = [
    state.publicStatus
      ? `Publicly, the relationship appears ${state.publicStatus}.`
      : undefined,
    state.privateStatus
      ? `Privately, it feels ${state.privateStatus}.`
      : undefined,
    state.stage ? `The relationship is in ${state.stage}.` : undefined,
    state.trustLevel ? `Trust feels ${state.trustLevel}.` : undefined,
    state.tensionLevel ? `Romantic tension feels ${state.tensionLevel}.` : undefined,
    state.boundaries.length
      ? `The relationship must respect ${state.boundaries.join("; ")}.`
      : undefined,
    state.openLoops.length
      ? `Unresolved pressure remains around ${state.openLoops.join("; ")}.`
      : undefined,
  ].filter((detail): detail is string => Boolean(detail));

  return details.length ? sanitizePromptText(details.join(" ")) : "";
}

function formatCanonFact(fact: CanonFact): string {
  return ensureSentence(sanitizePromptText(fact.statement));
}

function formatTimelineEvent(event: CanonTimelineEvent): string {
  return joinPromptSentences([
    sanitizePromptText(event.summary),
    event.impact
      ? `It changed the situation through ${lowercaseFirst(event.impact)}.`
      : "",
  ]);
}

function formatPlotLine(plotLine: CanonPlotLine): string {
  return joinPromptSentences([
    sanitizePromptText(plotLine.summary),
    plotLine.currentState
      ? `It currently stands at ${lowercaseFirst(plotLine.currentState)}.`
      : "",
    plotLine.stakes
      ? `The stakes are ${lowercaseFirst(plotLine.stakes)}.`
      : "",
  ]);
}

function formatMemoryAnchor(memory: CanonMemoryAnchor): string {
  return ensureSentence(
    `${sanitizePromptText(memory.summary)} This matters because ${lowercaseFirst(sanitizePromptText(memory.meaning))}. It should continue to affect behavior by ${lowercaseFirst(sanitizePromptText(memory.stateImpact))}.`,
  );
}

function formatHardConstraint(constraint: CanonHardConstraint): string {
  return joinPromptSentences([
    sanitizePromptText(constraint.rule),
    constraint.alternativeAction
      ? `Instead, the character ${lowercaseFirst(constraint.alternativeAction)}.`
      : "",
  ]);
}

function compareMemoryAnchors(
  left: CanonMemoryAnchor,
  right: CanonMemoryAnchor,
) {
  return (
    Number(right.pinned) - Number(left.pinned) ||
    right.emotionalWeight - left.emotionalWeight ||
    right.turn - left.turn
  );
}

function upsertByKey<T>(items: readonly T[], keyFor: (item: T) => string): T[] {
  const map = new Map<string, T>();

  for (const item of items) {
    map.set(keyFor(item), item);
  }

  return [...map.values()];
}

function qualitativeTrust(value: number): string {
  if (value >= 80) return "highly trusted";
  if (value >= 55) return "opening";
  if (value >= 30) return "cautious";
  return "guarded";
}

function qualitativeTension(value: number): string {
  if (value >= 80) return "charged";
  if (value >= 55) return "visible";
  if (value >= 30) return "emerging";
  return "low";
}

function humanizeId(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function ensureSentence(value: string): string {
  const trimmed = value.replace(/\s+/g, " ").trim();

  if (!trimmed) return "";
  return /[.!?]"?$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function joinPromptSentences(values: readonly string[]): string {
  return values
    .map(sanitizePromptText)
    .map(ensureSentence)
    .filter(Boolean)
    .join(" ");
}

function lowercaseFirst(value: string): string {
  return value.replace(/^(\s*)([A-Z])/, (_match, prefix, letter: string) =>
    `${prefix}${letter.toLowerCase()}`,
  );
}

function slugText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9{}]+/g, "-")
    .replace(/^-+|-+$/g, "") || "canon";
}

function uniqueText(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function sanitizePromptText(value: string): string {
  return value
    .replace(/\b(?:canon-ledger|runtime-event|runtime-truth|law-constraint|relationship):[a-z0-9:{}_-]+\b/gi, "")
    .replace(/\b(?:score|metric|schemaVersion)\b\s*[:=]?\s*\d*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
