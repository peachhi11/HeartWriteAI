import { z } from "zod";

import {
  findSemanticSeedGraphNodeById,
  type SemanticSeedNode,
} from "../../data/semanticSeedRegistry";
import {
  CharacterBrainSchema,
  buildPromptContext,
  type CharacterBrain,
} from "./semanticBrainService";
import {
  ContinuityCanonLedgerSchema,
  type ContinuityCanonLedger,
} from "./continuityCanonLedger";
import {
  NarrativeMemorySchema,
  NarrativeRuntimeStateSchema,
  compactNarrativeMemories,
  type NarrativeMemory,
  type NarrativeRuntimeState,
} from "./narrativeEngine";

export const CONTEXT_DIGEST_SCHEMA_VERSION = 1;

const nonEmptyString = z.string().trim().min(1);
const score = z.coerce.number().min(0).max(100);

export const ContextDigestLaneSchema = z.enum([
  "episodic_memories",
  "semantic_facts",
  "emotional_tags",
  "behavior_patterns",
  "habit_signals",
  "compressed_plot_summaries",
]);
export type ContextDigestLane = z.infer<typeof ContextDigestLaneSchema>;

export const ContextDigestEntrySourceSchema = z.enum([
  "chat_history",
  "continuity_canon",
  "narrative_runtime",
  "semantic_brain",
  "semantic_graph",
  "maintenance_pass",
]);
export type ContextDigestEntrySource = z.infer<
  typeof ContextDigestEntrySourceSchema
>;

export const ContextDigestMaintenanceModeSchema = z.enum([
  "light",
  "deep",
  "rem",
]);
export type ContextDigestMaintenanceMode = z.infer<
  typeof ContextDigestMaintenanceModeSchema
>;

export const ContextDigestEntrySchema = z.object({
  id: nonEmptyString,
  lane: ContextDigestLaneSchema,
  label: nonEmptyString,
  summary: nonEmptyString,
  meaning: z.string().trim().optional(),
  impact: z.string().trim().optional(),
  source: ContextDigestEntrySourceSchema,
  weight: score.default(50),
  turn: z.coerce.number().int().min(0).optional(),
  tags: z.array(nonEmptyString).default([]),
  pinned: z.boolean().default(false),
});
export type ContextDigestEntry = z.infer<typeof ContextDigestEntrySchema>;

export const ContextDigestLanesSchema = z.object({
  episodicMemories: z.array(ContextDigestEntrySchema).default([]),
  semanticFacts: z.array(ContextDigestEntrySchema).default([]),
  emotionalTags: z.array(ContextDigestEntrySchema).default([]),
  behaviorPatterns: z.array(ContextDigestEntrySchema).default([]),
  habitSignals: z.array(ContextDigestEntrySchema).default([]),
  compressedPlotSummaries: z.array(ContextDigestEntrySchema).default([]),
});
export type ContextDigestLanes = z.infer<typeof ContextDigestLanesSchema>;

export const ContextDigestSemanticActivationSchema = z.object({
  seedId: nonEmptyString,
  label: nonEmptyString,
  category: z.string().trim().min(1),
  activation: z.coerce.number().min(0).max(1),
  depth: z.coerce.number().int().min(0),
  path: z.array(nonEmptyString).default([]),
  promptCue: z.string().trim().optional(),
});
export type ContextDigestSemanticActivation = z.infer<
  typeof ContextDigestSemanticActivationSchema
>;

export const ContextDigestMaintenanceReportSchema = z.object({
  mode: ContextDigestMaintenanceModeSchema.default("light"),
  notes: z.array(nonEmptyString).default([]),
  compressedMemoryCount: z.coerce.number().int().min(0).default(0),
  preservedPinnedCount: z.coerce.number().int().min(0).default(0),
  semanticActivationCount: z.coerce.number().int().min(0).default(0),
});
export type ContextDigestMaintenanceReport = z.infer<
  typeof ContextDigestMaintenanceReportSchema
>;

export const ContextDigestSchema = z.object({
  schemaVersion: z.literal(CONTEXT_DIGEST_SCHEMA_VERSION).default(
    CONTEXT_DIGEST_SCHEMA_VERSION,
  ),
  id: nonEmptyString,
  currentTurn: z.coerce.number().int().min(0).default(0),
  tokenBudget: z.coerce.number().int().min(120).default(700),
  estimatedTokens: z.coerce.number().int().min(0).default(0),
  lanes: ContextDigestLanesSchema,
  activeSemanticNodes: z.array(ContextDigestSemanticActivationSchema).default([]),
  maintenanceReport: ContextDigestMaintenanceReportSchema.default({
    mode: "light",
    notes: [],
    compressedMemoryCount: 0,
    preservedPinnedCount: 0,
    semanticActivationCount: 0,
  }),
  promptContext: z.string().default(""),
});
export type ContextDigest = z.infer<typeof ContextDigestSchema>;

export interface ContextDigestChatMessage {
  role: "system" | "user" | "assistant";
  name?: string;
  content: string;
  important?: boolean;
  milestone?: boolean;
  protected?: boolean;
  tags?: readonly string[];
}

export interface BuildContextDigestInput {
  id?: string;
  currentTurn?: number;
  tokenBudget?: number;
  narrativeRuntime?: NarrativeRuntimeState;
  continuityCanonLedger?: ContinuityCanonLedger;
  characterBrain?: CharacterBrain;
  semanticSeedIds?: readonly string[];
  chatHistory?: readonly ContextDigestChatMessage[];
}

export interface BuildContextDigestOptions {
  maxEntriesPerLane?: number;
  maxPromptTokens?: number;
  maxSemanticActivations?: number;
  includeAgencyReminder?: boolean;
}

export interface SemanticGraphActivationOptions {
  maxDepth?: number;
  minActivation?: number;
  includeParents?: boolean;
  includeChildren?: boolean;
  includeRelated?: boolean;
  includeOpposite?: boolean;
  limit?: number;
}

export interface ContextDigestMaintenanceInput extends BuildContextDigestInput {
  mode?: ContextDigestMaintenanceMode;
  maxMemories?: number;
}

export interface ContextDigestMaintenanceResult {
  digest: ContextDigest;
  memories: readonly NarrativeMemory[];
  semanticActivations: readonly ContextDigestSemanticActivation[];
  report: ContextDigestMaintenanceReport;
}

interface ContextDigestEntryInput {
  id: string;
  lane: ContextDigestLane;
  label: string;
  summary: string;
  meaning?: string;
  impact?: string;
  source: ContextDigestEntrySource;
  weight?: number;
  turn?: number;
  tags?: readonly string[];
  pinned?: boolean;
}

type LaneBuckets = Record<ContextDigestLane, ContextDigestEntry[]>;

const DEFAULT_MAX_ENTRIES_PER_LANE = 5;
const DEFAULT_CONTEXT_DIGEST_TOKEN_BUDGET = 700;

export function buildContextDigest(
  input: BuildContextDigestInput,
  options: BuildContextDigestOptions = {},
): ContextDigest {
  const runtime = input.narrativeRuntime
    ? NarrativeRuntimeStateSchema.parse(input.narrativeRuntime)
    : undefined;
  const ledger = input.continuityCanonLedger
    ? ContinuityCanonLedgerSchema.parse(input.continuityCanonLedger)
    : undefined;
  const brain = input.characterBrain
    ? CharacterBrainSchema.parse(input.characterBrain)
    : undefined;
  const maxEntriesPerLane = normalizeLimit(
    options.maxEntriesPerLane ?? DEFAULT_MAX_ENTRIES_PER_LANE,
    DEFAULT_MAX_ENTRIES_PER_LANE,
  );
  const tokenBudget = normalizeTokenBudget(
    options.maxPromptTokens ?? input.tokenBudget,
  );
  const buckets = createLaneBuckets();

  addRuntimeEntries(buckets, runtime);
  addContinuityEntries(buckets, ledger);
  addBrainEntries(buckets, brain);
  addChatEntries(buckets, input.chatHistory ?? []);
  addHabitSignals(buckets);

  const activeSemanticNodes = spreadSemanticGraphActivation(
    [
      ...(input.semanticSeedIds ?? []),
      ...(brain?.nodes.map((node) => node.seedId) ?? []),
    ],
    {
      includeParents: true,
      includeRelated: true,
      limit: options.maxSemanticActivations ?? 8,
    },
  );

  for (const activation of activeSemanticNodes) {
    addEntry(buckets, {
      id: `semantic-activation:${activation.seedId}`,
      lane: "semantic_facts",
      label: activation.label,
      summary:
        activation.promptCue ??
        `${activation.label} is active enough to color interpretation.`,
      meaning: "Use as semantic routing pressure, not as visible metadata.",
      source: "semantic_graph",
      weight: Math.round(activation.activation * 100),
      tags: [activation.category],
    });
  }

  const lanes = capLaneBuckets(buckets, maxEntriesPerLane);
  const baseDigest = ContextDigestSchema.parse({
    schemaVersion: CONTEXT_DIGEST_SCHEMA_VERSION,
    id: input.id?.trim() || createDigestId(runtime, ledger, input.chatHistory),
    currentTurn: input.currentTurn ?? runtime?.turn ?? ledger?.currentTurn ?? 0,
    tokenBudget,
    lanes,
    activeSemanticNodes,
    maintenanceReport: {
      mode: "light",
      notes: [
        "Digest compiled from available runtime, canon, semantic, and chat memory lanes.",
      ],
      compressedMemoryCount: lanes.compressedPlotSummaries.length,
      preservedPinnedCount: countPinnedEntries(lanes),
      semanticActivationCount: activeSemanticNodes.length,
    },
  });
  const promptContext = compileContextDigestPromptContext(baseDigest, {
    includeAgencyReminder: options.includeAgencyReminder,
    maxPromptTokens: tokenBudget,
  });

  return ContextDigestSchema.parse({
    ...baseDigest,
    estimatedTokens: estimateDigestTokens(promptContext),
    promptContext,
  });
}

export function compileContextDigestPromptContext(
  digestInput: ContextDigest,
  options: {
    maxPromptTokens?: number;
    includeAgencyReminder?: boolean;
  } = {},
): string {
  const digest = ContextDigestSchema.parse(digestInput);
  const sections = [
    "Use this private context digest as soft continuity guidance. Do not mention digest lanes, IDs, graph structure, raw state values, or memory machinery in character.",
    compileLaneSection(
      "Scene memory",
      digest.lanes.episodicMemories,
      "What changed or recurs in the lived scene.",
    ),
    compileLaneSection(
      "Canon facts",
      digest.lanes.semanticFacts,
      "Truths and semantic pressure that should remain stable.",
    ),
    compileLaneSection(
      "Emotional state",
      digest.lanes.emotionalTags,
      "Affect, interpretation, and subtext to carry forward.",
    ),
    compileLaneSection(
      "Behavior patterns",
      digest.lanes.behaviorPatterns,
      "Repeatable actions, defenses, and alternatives to use instead of forbidden actions.",
    ),
    compileLaneSection(
      "Repeated patterns",
      digest.lanes.habitSignals,
      "Signals that have happened often enough to shape expectation.",
    ),
    compileLaneSection(
      "Plot summary",
      digest.lanes.compressedPlotSummaries,
      "Compressed trajectory, unresolved pressure, and active route direction.",
    ),
    options.includeAgencyReminder === false
      ? ""
      : "Preserve player agency: do not write the user's thoughts, feelings, intentions, decisions, dialogue, or consent.",
  ].filter(Boolean);

  return truncateToTokenBudget(
    sections.join("\n"),
    normalizeTokenBudget(options.maxPromptTokens ?? digest.tokenBudget),
  );
}

export function runContextDigestMaintenance(
  input: ContextDigestMaintenanceInput,
  options: BuildContextDigestOptions = {},
): ContextDigestMaintenanceResult {
  const mode = ContextDigestMaintenanceModeSchema.parse(input.mode ?? "light");
  const runtime = input.narrativeRuntime
    ? NarrativeRuntimeStateSchema.parse(input.narrativeRuntime)
    : undefined;
  const compactedMemories = compactNarrativeMemories(
    runtime?.memories ?? [],
    input.maxMemories ?? 36,
  );
  const compressedMemories =
    mode === "deep" || mode === "rem"
      ? compressNarrativeMemoryClusters(compactedMemories, {
          currentTurn: runtime?.turn ?? input.currentTurn ?? 0,
        })
      : compactedMemories;
  const semanticActivations =
    mode === "rem"
      ? spreadSemanticGraphActivation(input.semanticSeedIds ?? [], {
          includeParents: true,
          includeChildren: true,
          includeRelated: true,
          limit: options.maxSemanticActivations ?? 10,
        })
      : [];
  const report = ContextDigestMaintenanceReportSchema.parse({
    mode,
    notes: createMaintenanceNotes(mode, compactedMemories, compressedMemories),
    compressedMemoryCount: compressedMemories.filter((memory) =>
      memory.id.startsWith("compressed:"),
    ).length,
    preservedPinnedCount: compressedMemories.filter((memory) => memory.pinned)
      .length,
    semanticActivationCount: semanticActivations.length,
  });
  const digest = buildContextDigest(
    {
      ...input,
      narrativeRuntime: runtime
        ? {
            ...runtime,
            memories: [...compressedMemories],
          }
        : undefined,
      semanticSeedIds: [
        ...(input.semanticSeedIds ?? []),
        ...semanticActivations.map((activation) => activation.seedId),
      ],
    },
    options,
  );

  return {
    digest: ContextDigestSchema.parse({
      ...digest,
      maintenanceReport: report,
    }),
    memories: compressedMemories,
    semanticActivations,
    report,
  };
}

export function spreadSemanticGraphActivation(
  seedIds: readonly string[],
  options: SemanticGraphActivationOptions = {},
): readonly ContextDigestSemanticActivation[] {
  const maxDepth = Math.max(0, Math.floor(options.maxDepth ?? 2));
  const minActivation = clamp01(options.minActivation ?? 0.18);
  const limit = normalizeLimit(options.limit ?? 12, 12);
  const seen = new Map<string, ContextDigestSemanticActivation>();
  const queue = uniqueText(seedIds).map((seedId) => ({
    seedId,
    activation: 1,
    depth: 0,
    path: [] as string[],
  }));

  while (queue.length) {
    const item = queue.shift();
    if (!item || item.activation < minActivation || item.depth > maxDepth) {
      continue;
    }

    const node = findSemanticSeedGraphNodeById(item.seedId);
    if (!node) {
      continue;
    }

    const current = seen.get(node.id);
    if (!current || current.activation < item.activation) {
      seen.set(node.id, {
        seedId: node.id,
        label: node.label,
        category: node.category,
        activation: round01(item.activation),
        depth: item.depth,
        path: item.path,
        promptCue: firstPromptCue(node),
      });
    }

    if (item.depth >= maxDepth) {
      continue;
    }

    for (const edge of getSemanticGraphEdges(node, options)) {
      const nextActivation = item.activation * edge.weight;
      if (nextActivation < minActivation) {
        continue;
      }
      queue.push({
        seedId: edge.targetId,
        activation: nextActivation,
        depth: item.depth + 1,
        path: [...item.path, node.label],
      });
    }
  }

  return [...seen.values()]
    .sort(
      (left, right) =>
        right.activation - left.activation ||
        left.depth - right.depth ||
        left.label.localeCompare(right.label),
    )
    .slice(0, limit);
}

function addRuntimeEntries(
  buckets: LaneBuckets,
  runtime?: NarrativeRuntimeState,
): void {
  if (!runtime) return;

  for (const event of runtime.recentEvents) {
    addEntry(buckets, {
      id: `runtime-event:${event.turn}:${slugText(event.label)}`,
      lane: "episodic_memories",
      label: event.label,
      summary: event.summary,
      meaning: `This was a ${humanizeId(event.outcome)} beat in ${humanizeId(event.category)} pressure.`,
      impact: `Use it to preserve ${humanizeId(event.tier)} consequences.`,
      source: "narrative_runtime",
      weight: event.tier === "major_event" ? 90 : event.tier === "meso_event" ? 72 : 55,
      turn: event.turn,
      tags: event.tags,
      pinned: event.tier === "major_event",
    });
  }

  for (const memory of runtime.memories) {
    addEntry(buckets, memoryToDigestEntry(memory));
  }

  addEntry(buckets, {
    id: `runtime-state:${runtime.id}:axes`,
    lane: "emotional_tags",
    label: "Current state color",
    summary: summarizeRuntimeState(runtime),
    meaning: runtime.lastCauseFrame?.interpretation,
    impact: runtime.lastCauseFrame?.behaviorIntent,
    source: "narrative_runtime",
    weight: 78,
    turn: runtime.turn,
    tags: [runtime.arcPhase, runtime.relationshipStage],
  });

  if (runtime.lastCauseFrame) {
    addEntry(buckets, {
      id: `runtime-cause:${runtime.turn}`,
      lane: "emotional_tags",
      label: "Latest cause chain",
      summary: runtime.lastCauseFrame.event,
      meaning: runtime.lastCauseFrame.interpretation,
      impact: runtime.lastCauseFrame.consequence,
      source: "narrative_runtime",
      weight: 82,
      turn: runtime.turn,
      tags: [
        ...runtime.lastCauseFrame.pressuredLaws,
        ...runtime.lastCauseFrame.activeDefenses,
      ],
    });
  }

  for (const law of [
    ...runtime.causeProfile.immutableLaws,
    ...runtime.causeProfile.relationshipLaws,
  ]) {
    addEntry(buckets, {
      id: `runtime-law:${slugText(law.id)}`,
      lane: "behavior_patterns",
      label: law.label,
      summary: law.description,
      meaning: law.hiddenNeed,
      impact: law.generatedBehaviors.length
        ? `Instead, ${law.generatedBehaviors.join("; ")}.`
        : undefined,
      source: "narrative_runtime",
      weight: Math.max(60, 100 - law.priority * 4),
      tags: [...law.protects, ...law.pressuredBy],
      pinned: law.priority <= 2,
    });
  }

  for (const defense of runtime.causeProfile.activeDefenses) {
    addEntry(buckets, {
      id: `runtime-defense:${slugText(defense.id)}`,
      lane: "behavior_patterns",
      label: defense.label,
      summary: `When ${lowercaseFirst(defense.trigger)}, ${defense.behavior}.`,
      impact: defense.cost,
      source: "narrative_runtime",
      weight: 72,
      tags: ["defense"],
    });
  }

  for (const truth of runtime.causeProfile.storyTruths.filter((truth) => truth.active)) {
    addEntry(buckets, {
      id: `runtime-truth:${slugText(truth.id)}`,
      lane: "semantic_facts",
      label: truth.label,
      summary: truth.truth,
      impact: truth.pressure,
      source: "narrative_runtime",
      weight: truth.scope === "secret" ? 84 : 68,
      tags: [truth.scope],
      pinned: truth.scope === "secret",
    });
  }
}

function addContinuityEntries(
  buckets: LaneBuckets,
  ledger?: ContinuityCanonLedger,
): void {
  if (!ledger) return;

  for (const state of ledger.characterStates) {
    addEntry(buckets, {
      id: `character-state:${slugText(state.characterId)}`,
      lane: "semantic_facts",
      label: state.displayName ?? state.characterId,
      summary: [
        state.location ? `Currently at ${state.location}` : "",
        state.physicalState ? `Physically, ${state.physicalState}` : "",
        state.mentalState ? `Mentally, ${state.mentalState}` : "",
        state.currentGoal ? `Trying to ${lowercaseFirst(state.currentGoal)}` : "",
      ].filter(Boolean).join(". "),
      impact: state.constraints.length
        ? `Respect ${state.constraints.join("; ")}.`
        : undefined,
      source: "continuity_canon",
      weight: 70,
      turn: state.updatedAtTurn,
      tags: state.knowledge,
    });
  }

  for (const state of ledger.relationshipStates) {
    addEntry(buckets, {
      id: `relationship-state:${slugText(state.id)}`,
      lane: "semantic_facts",
      label: state.stage ?? state.privateStatus ?? state.id,
      summary: [
        state.publicStatus ? `Publicly ${state.publicStatus}` : "",
        state.privateStatus ? `Privately ${state.privateStatus}` : "",
        state.stage ? `Relationship stage is ${state.stage}` : "",
      ].filter(Boolean).join(". "),
      impact: state.openLoops.length
        ? `Unresolved pressure remains around ${state.openLoops.join("; ")}.`
        : undefined,
      source: "continuity_canon",
      weight: 76,
      turn: state.updatedAtTurn,
      tags: state.boundaries,
    });
  }

  for (const fact of ledger.facts.filter((fact) => fact.active && fact.promptVisibility === "prompt_safe")) {
    addEntry(buckets, {
      id: `canon-fact:${slugText(fact.id)}`,
      lane: "semantic_facts",
      label: humanizeId(fact.category),
      summary: fact.statement,
      meaning: fact.evidence.slice(0, 2).join("; ") || undefined,
      source: "continuity_canon",
      weight: fact.confidence,
      tags: fact.tags,
      pinned: fact.category === "boundary" || fact.category === "route",
    });
  }

  for (const event of ledger.timeline.filter((event) => event.promptVisibility === "prompt_safe")) {
    addEntry(buckets, {
      id: `canon-timeline:${slugText(event.id)}`,
      lane: "episodic_memories",
      label: event.label,
      summary: event.summary,
      impact: event.impact,
      source: "continuity_canon",
      weight: event.pinned ? 92 : 62,
      turn: event.turn,
      tags: event.tags,
      pinned: event.pinned,
    });
  }

  for (const plotLine of ledger.openPlotLines.filter((plotLine) => plotLine.promptVisibility === "prompt_safe")) {
    addEntry(buckets, {
      id: `plot:${slugText(plotLine.id)}`,
      lane: "compressed_plot_summaries",
      label: plotLine.label,
      summary: plotLine.summary,
      meaning: plotLine.currentState,
      impact: plotLine.stakes,
      source: "continuity_canon",
      weight: plotLine.status === "active" ? 84 : 60,
      turn: plotLine.lastAdvancedTurn,
      tags: plotLine.tags,
      pinned: plotLine.status === "active",
    });
  }

  for (const memory of ledger.memoryAnchors.filter((memory) => memory.promptVisibility === "prompt_safe")) {
    addEntry(buckets, memoryToDigestEntry(memory, "continuity_canon"));
  }

  for (const constraint of ledger.hardConstraints.filter((constraint) => constraint.promptVisibility === "prompt_safe")) {
    addEntry(buckets, {
      id: `constraint:${slugText(constraint.id)}`,
      lane: "behavior_patterns",
      label: constraint.label,
      summary: constraint.rule,
      impact: constraint.alternativeAction
        ? `Instead, ${constraint.alternativeAction}.`
        : "Needs an explicit alternative action.",
      source: "continuity_canon",
      weight: 88,
      tags: constraint.tags,
      pinned: true,
    });
  }
}

function addBrainEntries(buckets: LaneBuckets, brain?: CharacterBrain): void {
  if (!brain) return;

  const activeContexts = buildPromptContext(brain, {
    activationThreshold: 0.18,
    maxActiveNodes: 6,
    maxCuesPerLayer: 3,
  });

  for (const context of activeContexts) {
    addEntry(buckets, {
      id: `brain-concept:${slugText(context.concept)}`,
      lane: "semantic_facts",
      label: context.concept,
      summary: `Active semantic concept: ${context.concept}.`,
      meaning: context.cognitive.join("; ") || undefined,
      source: "semantic_brain",
      weight: 76,
      tags: ["semantic_brain"],
    });

    if (context.affective.length) {
      addEntry(buckets, {
        id: `brain-affect:${slugText(context.concept)}`,
        lane: "emotional_tags",
        label: `${context.concept} affect`,
        summary: context.affective.join("; "),
        meaning: "Use as emotional color, not a visible label.",
        source: "semantic_brain",
        weight: 74,
        tags: ["affective"],
      });
    }

    if (context.behavioral.length || context.somatic.length) {
      addEntry(buckets, {
        id: `brain-behavior:${slugText(context.concept)}`,
        lane: "behavior_patterns",
        label: `${context.concept} expression`,
        summary: [...context.behavioral, ...context.somatic].join("; "),
        meaning: "Weave as subtle behavior and body response.",
        source: "semantic_brain",
        weight: 72,
        tags: ["behavioral"],
      });
    }
  }
}

function addChatEntries(
  buckets: LaneBuckets,
  chatHistory: readonly ContextDigestChatMessage[],
): void {
  chatHistory.forEach((message, index) => {
    const isImportant =
      message.important || message.milestone || message.protected;
    const content = message.content.trim();

    if (!content || (!isImportant && index < chatHistory.length - 4)) {
      return;
    }

    addEntry(buckets, {
      id: `chat:${index}:${slugText(content.slice(0, 42))}`,
      lane: "episodic_memories",
      label: message.name ?? humanizeId(message.role),
      summary: `${message.name ?? humanizeId(message.role)}: ${truncateText(content, 220)}`,
      meaning: isImportant
        ? "Marked important enough to survive ordinary context pruning."
        : "Recent scene context.",
      source: "chat_history",
      weight: isImportant ? 86 : 44,
      turn: index,
      tags: [...(message.tags ?? []), isImportant ? "important" : "recent"],
      pinned: Boolean(isImportant),
    });
  });
}

function addHabitSignals(buckets: LaneBuckets): void {
  const tagCounts = new Map<string, number>();

  for (const entry of Object.values(buckets).flat()) {
    for (const tag of entry.tags) {
      const normalized = normalizeTag(tag);
      if (normalized.length < 3 || normalized === "recent") continue;
      tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1);
    }
  }

  [...tagCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 6)
    .forEach(([tag, count]) => {
      addEntry(buckets, {
        id: `habit:${tag}`,
        lane: "habit_signals",
        label: humanizeId(tag),
        summary: `${humanizeId(tag)} has appeared ${count} times across recent context lanes.`,
        meaning:
          "Treat repetition as expectation pressure, not proof of permanent identity.",
        source: "maintenance_pass",
        weight: Math.min(90, 42 + count * 12),
        tags: [tag],
      });
    });
}

function memoryToDigestEntry(
  memoryInput: NarrativeMemory,
  source: ContextDigestEntrySource = "narrative_runtime",
): ContextDigestEntry {
  const memory = NarrativeMemorySchema.parse(memoryInput);
  const lane: ContextDigestLane =
    memory.tier === "contextual_memory"
      ? "episodic_memories"
      : memory.tier === "core_identity"
        ? "semantic_facts"
        : "compressed_plot_summaries";

  return ContextDigestEntrySchema.parse({
    id: `memory:${slugText(memory.id)}`,
    lane,
    label: humanizeId(memory.tier),
    summary: memory.summary,
    meaning: memory.meaning,
    impact: memory.stateImpact,
    source,
    weight: memory.emotionalWeight,
    turn: memory.turn,
    tags: memory.tags,
    pinned: memory.pinned || memory.tier === "core_identity",
  });
}

function compressNarrativeMemoryClusters(
  memories: readonly NarrativeMemory[],
  options: { currentTurn: number },
): NarrativeMemory[] {
  const normalized = memories.map((memory) => NarrativeMemorySchema.parse(memory));
  const pinned = normalized.filter((memory) => memory.pinned);
  const buckets = new Map<string, NarrativeMemory[]>();
  const unclustered: NarrativeMemory[] = [];

  for (const memory of normalized.filter((memory) => !memory.pinned)) {
    const key = firstUsefulTag(memory.tags);
    if (!key) {
      unclustered.push(memory);
      continue;
    }
    buckets.set(key, [...(buckets.get(key) ?? []), memory]);
  }

  const compressed = [...buckets.entries()].flatMap(([tag, items]) => {
    if (items.length < 2) {
      return items;
    }

    const sorted = items.slice().sort(compareMemoryForCompression);
    const emotionalWeight = Math.max(
      ...sorted.map((memory) => memory.emotionalWeight),
    );
    return [
      NarrativeMemorySchema.parse({
        id: `compressed:${tag}:${sorted.length}`,
        tier: "relationship_memory",
        summary: `${sorted.length} related memories keep returning around ${humanizeId(tag)}.`,
        meaning: uniqueText(sorted.map((memory) => memory.meaning))
          .slice(0, 3)
          .join("; "),
        stateImpact: uniqueText(sorted.map((memory) => memory.stateImpact))
          .slice(0, 3)
          .join("; "),
        emotionalWeight,
        turn: Math.max(options.currentTurn, ...sorted.map((memory) => memory.turn)),
        tags: uniqueText([tag, "compressed_context_digest", ...sorted.flatMap((memory) => memory.tags)]),
        pinned: emotionalWeight >= 85,
      }),
    ];
  });

  return compactNarrativeMemories([...pinned, ...unclustered, ...compressed]);
}

function compileLaneSection(
  title: string,
  entries: readonly ContextDigestEntry[],
  purpose: string,
): string {
  if (!entries.length) return "";

  const lines = entries
    .map((entry) =>
      joinPromptSentences([
        sanitizePromptText(entry.summary),
        entry.meaning ? `Meaning: ${sanitizePromptText(entry.meaning)}` : "",
        entry.impact ? `Effect: ${sanitizePromptText(entry.impact)}` : "",
      ]),
    )
    .filter(Boolean);

  if (!lines.length) return "";

  return [`${title}: ${purpose}`, ...lines.map((line) => `- ${line}`)].join("\n");
}

function capLaneBuckets(
  buckets: LaneBuckets,
  maxEntriesPerLane: number,
): ContextDigestLanes {
  const cap = (lane: ContextDigestLane) =>
    dedupeEntries(buckets[lane])
      .sort(compareDigestEntries)
      .slice(0, maxEntriesPerLane);

  return ContextDigestLanesSchema.parse({
    episodicMemories: cap("episodic_memories"),
    semanticFacts: cap("semantic_facts"),
    emotionalTags: cap("emotional_tags"),
    behaviorPatterns: cap("behavior_patterns"),
    habitSignals: cap("habit_signals"),
    compressedPlotSummaries: cap("compressed_plot_summaries"),
  });
}

function getSemanticGraphEdges(
  node: SemanticSeedNode,
  options: SemanticGraphActivationOptions,
): Array<{ targetId: string; weight: number }> {
  const edges: Array<{ targetId: string; weight: number }> = [];
  const add = (
    values: readonly string[] | undefined,
    weight: number,
    enabled = true,
  ) => {
    if (!enabled) return;
    for (const targetId of values ?? []) {
      edges.push({ targetId, weight });
    }
  };

  add(node.parents, 0.48, options.includeParents !== false);
  add(node.children, 0.56, options.includeChildren === true);
  add(node.related, 0.64, options.includeRelated !== false);
  add(node.opposite, 0.28, options.includeOpposite === true);

  return edges;
}

function firstPromptCue(node: SemanticSeedNode): string | undefined {
  return [
    node.description,
    node.internalMeaning,
    node.emotionalMeaning,
    node.guidance,
    ...(node.behaviors ?? []),
    ...(node.growthPath ?? []),
  ].find((value) => Boolean(value?.trim()));
}

function createMaintenanceNotes(
  mode: ContextDigestMaintenanceMode,
  before: readonly NarrativeMemory[],
  after: readonly NarrativeMemory[],
): string[] {
  const notes = [
    `${humanizeId(mode)} maintenance normalized and compacted narrative memory lanes.`,
  ];

  if (after.length !== before.length) {
    notes.push(
      `Memory count changed from ${before.length} to ${after.length} after compression.`,
    );
  }

  if (mode === "rem") {
    notes.push(
      "Semantic graph activation was refreshed from supplied seed ids.",
    );
  }

  return notes;
}

function summarizeRuntimeState(runtime: NarrativeRuntimeState): string {
  return [
    `Relationship stage is ${humanizeId(runtime.relationshipStage)}`,
    `arc phase is ${humanizeId(runtime.arcPhase)}`,
    qualitativeAxis("trust", runtime.axes.trust),
    qualitativeAxis("romantic tension", runtime.axes.romanticTension),
    qualitativeAxis("emotional regulation", runtime.axes.emotionalRegulation),
  ].join("; ");
}

function qualitativeAxis(label: string, value: number): string {
  if (value >= 75) return `${label} is high`;
  if (value >= 45) return `${label} is present`;
  if (value >= 20) return `${label} is guarded`;
  return `${label} is low`;
}

function addEntry(buckets: LaneBuckets, entryInput: ContextDigestEntryInput): void {
  const entry = ContextDigestEntrySchema.parse({
    ...entryInput,
    label: sanitizeLabel(entryInput.label),
    summary: sanitizePromptText(entryInput.summary),
    meaning: entryInput.meaning
      ? sanitizePromptText(entryInput.meaning)
      : undefined,
    impact: entryInput.impact ? sanitizePromptText(entryInput.impact) : undefined,
    tags: uniqueText((entryInput.tags ?? []).map(normalizeTag)),
  });

  if (!entry.summary) return;
  buckets[entry.lane].push(entry);
}

function createLaneBuckets(): LaneBuckets {
  return {
    episodic_memories: [],
    semantic_facts: [],
    emotional_tags: [],
    behavior_patterns: [],
    habit_signals: [],
    compressed_plot_summaries: [],
  };
}

function dedupeEntries(entries: readonly ContextDigestEntry[]): ContextDigestEntry[] {
  const bySummary = new Map<string, ContextDigestEntry>();

  for (const entry of entries) {
    const key = normalizeForMatching(entry.summary);
    const existing = bySummary.get(key);
    if (!existing || compareDigestEntries(entry, existing) < 0) {
      bySummary.set(key, entry);
    }
  }

  return [...bySummary.values()];
}

function compareDigestEntries(
  left: ContextDigestEntry,
  right: ContextDigestEntry,
): number {
  return (
    Number(right.pinned) - Number(left.pinned) ||
    right.weight - left.weight ||
    (right.turn ?? 0) - (left.turn ?? 0) ||
    left.label.localeCompare(right.label)
  );
}

function compareMemoryForCompression(
  left: NarrativeMemory,
  right: NarrativeMemory,
): number {
  return (
    right.emotionalWeight - left.emotionalWeight ||
    right.turn - left.turn ||
    left.summary.localeCompare(right.summary)
  );
}

function countPinnedEntries(lanes: ContextDigestLanes): number {
  return Object.values(lanes)
    .flat()
    .filter((entry) => entry.pinned).length;
}

function firstUsefulTag(tags: readonly string[]): string | undefined {
  return tags
    .map(normalizeTag)
    .find(
      (tag) =>
        tag.length > 2 &&
        !["recent", "important", "compressed_context_digest"].includes(tag),
    );
}

function createDigestId(
  runtime?: NarrativeRuntimeState,
  ledger?: ContinuityCanonLedger,
  chatHistory?: readonly ContextDigestChatMessage[],
): string {
  if (runtime) return `context-digest:${slugText(runtime.id)}`;
  if (ledger) return `context-digest:${slugText(ledger.id)}`;
  return `context-digest:chat:${chatHistory?.length ?? 0}`;
}

function joinPromptSentences(values: readonly string[]): string {
  return values
    .map(sanitizePromptText)
    .map(ensureSentence)
    .filter(Boolean)
    .join(" ");
}

function truncateToTokenBudget(value: string, maxTokens: number): string {
  const maxCharacters = Math.max(1, maxTokens) * 4;
  const trimmed = value.trim();

  if (trimmed.length <= maxCharacters) {
    return trimmed;
  }

  const slice = trimmed.slice(0, maxCharacters);
  const sentenceBoundary = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("\n"),
  );
  const safeSlice =
    sentenceBoundary > Math.floor(maxCharacters * 0.6)
      ? slice.slice(0, sentenceBoundary + 1)
      : slice;

  return `${safeSlice.trim()} [Digest trimmed to context budget.]`;
}

function estimateDigestTokens(value: string): number {
  return Math.max(1, Math.ceil(value.length / 4));
}

function normalizeTokenBudget(value?: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONTEXT_DIGEST_TOKEN_BUDGET;
  }

  return Math.max(120, Math.floor(value ?? DEFAULT_CONTEXT_DIGEST_TOKEN_BUDGET));
}

function normalizeLimit(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function round01(value: number): number {
  return Math.round(clamp01(value) * 1000) / 1000;
}

function truncateText(value: string, maxCharacters: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxCharacters) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxCharacters - 1)).trim()}...`;
}

function sanitizePromptText(value: string): string {
  return value
    .replace(/\b(?:context-digest|canon-ledger|runtime-event|runtime-truth|law-constraint|semantic-node|brain-spoke|relationship|memory|constraint|plot):[a-z0-9:{}_-]+\b/gi, "")
    .replace(/\b(?:schemaVersion|seedId|sourceId|graph|activation|metric|score)\b\s*[:=]?\s*[\w.-]*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeLabel(value: string): string {
  const sanitized = sanitizePromptText(value);
  return sanitized || "Context cue";
}

function ensureSentence(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "";
  return /[.!?]"?$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function lowercaseFirst(value: string): string {
  return value.replace(/^(\s*)([A-Z])/, (_match, prefix, letter: string) =>
    `${prefix}${letter.toLowerCase()}`,
  );
}

function humanizeId(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function slugText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9{}]+/g, "-")
    .replace(/^-+|-+$/g, "") || "context";
}

function normalizeTag(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9{}]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeForMatching(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function uniqueText(values: readonly (string | undefined)[]): string[] {
  return [...new Set(values.filter((value): value is string =>
    value !== undefined && value.trim().length > 0,
  ).map((value) => value.trim()))];
}
