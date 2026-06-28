import {
  ACTS_OF_SERVICE_VOCABULARY_SEEDS,
} from "./actsOfServiceVocabularyPresets";
import {
  ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS,
} from "./attachmentStyleVocabularyPresets";
import {
  BEHAVIOR_ARCHITECTURE_VOCABULARY_STANDARD_SEEDS,
} from "./behaviorArchitectureVocabularyPresets";
import {
  COMPLEMENT_VOCABULARY_SEEDS,
} from "./complementPresets";
import {
  COMPATIBILITY_MATRIX_VOCABULARY_STANDARD_SEEDS,
} from "./compatibilityMatrixVocabularyPresets";
import {
  CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS,
} from "./conflictBeatVocabularyPresets";
import {
  CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS,
} from "./conflictStyleVocabularyPresets";
import {
  CONSEQUENCE_VOCABULARY_STANDARD_SEEDS,
} from "./consequenceVocabularyPresets";
import {
  DIALOGUE_CONTROL_VOCABULARY_STANDARD_SEEDS,
} from "./dialogueControlVocabularyPresets";
import {
  DYNAMIC_STATE_SYSTEM_VOCABULARY_STANDARD_SEEDS,
} from "./dynamicStateSystemVocabularyPresets";
import {
  DESIRE_VOCABULARY_STANDARD_SEEDS,
} from "./desireVocabularyPresets";
import {
  EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS,
} from "./emotionalMeaningVocabularyPresets";
import {
  EVENT_ENGINE_VOCABULARY_STANDARD_SEEDS,
} from "./eventEngineVocabularyPresets";
import {
  FEAR_VOCABULARY_STANDARD_SEEDS,
} from "./fearVocabularyPresets";
import {
  FIRST_MESSAGE_GENERATOR_VOCABULARY_STANDARD_SEEDS,
} from "./firstMessageGeneratorVocabularyPresets";
import {
  GROWTH_ARC_VOCABULARY_STANDARD_SEEDS,
} from "./growthArcVocabularyPresets";
import {
  HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS,
} from "./hiddenNeedVocabularyPresets";
import {
  IMAGE_PROMPT_VOCABULARY_SEEDS,
} from "./imagePromptVocabPresets";
import {
  LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS,
} from "./loveLanguageVocabularyPresets";
import {
  MEMORY_COMPRESSION_RECALL_VOCABULARY_STANDARD_SEEDS,
} from "./memoryCompressionRecallVocabularyPresets";
import {
  MORAL_FRAMEWORK_VOCABULARY_SEEDS,
} from "./moralFrameworkVocabularyPresets";
import {
  NARRATIVE_ARC_CONTROLLER_VOCABULARY_STANDARD_SEEDS,
} from "./narrativeArcControllerVocabularyPresets";
import {
  ORIGIN_WOUND_VOCABULARY_SEEDS,
} from "./originWoundVocabularyPresets";
import {
  PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS,
} from "./payoffFantasyVocabularyPresets";
import {
  PLOT_CONFLICT_VOCABULARY_STANDARD_SEEDS,
} from "./plotConflictVocabularyPresets";
import {
  PERSONALITY_ENGINE_VOCABULARY_SEEDS,
} from "./personalityEngineVocabularyPresets";
import {
  RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS,
} from "./relationshipDynamicVocabularyPresets";
import {
  RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS,
} from "./relationshipIdentityVocabularyPresets";
import {
  RELATIONSHIP_STAGE_PROGRESSION_VOCABULARY_STANDARD_SEEDS,
} from "./relationshipStageProgressionPresets";
import {
  ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS,
} from "./romanceTropeVocabularyPresets";
import {
  ROUTE_GATE_VOCABULARY_STANDARD_SEEDS,
} from "./routeGateVocabularyPresets";
import {
  ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS,
} from "./routePhaseVocabularyPresets";
import {
  RESPONSE_VOCABULARY_STANDARD_SEEDS,
} from "./responseVocabularyPresets";
import {
  REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS,
} from "./repairStyleVocabularyPresets";
import {
  REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS,
} from "./repairBeatVocabularyPresets";
import {
  REPAIR_NEED_VOCABULARY_STANDARD_SEEDS,
} from "./repairNeedVocabularyPresets";
import {
  RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS,
} from "./ruptureTypeVocabularyPresets";
import {
  SEED_PRESET_REGISTRY,
  type SeedPresetRegistryEntry,
  type SeedPresetRegistryLane,
} from "./seedPresetRegistry";
import {
  TRIGGER_VOCABULARY_STANDARD_SEEDS,
} from "./triggerVocabularyPresets";
import {
  USER_PERSONA_PROFILE_VOCABULARY_STANDARD_SEEDS,
} from "./userPersonaProfileVocabularyPresets";
import {
  VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS,
} from "./visibleBehaviorVocabularyPresets";
import {
  VOICE_SEED_VOCABULARY_SEEDS,
  VOICE_VOCABULARY_SEEDS,
} from "./voiceVocabularyPresets";
import {
  WOUND_VOCABULARY_STANDARD_SEEDS,
} from "./woundVocabularyPresets";
import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type StandardVocabularySeedSourceId =
  | "acts-of-service-vocabulary"
  | "attachment-style-vocabulary"
  | "behavior-architecture-vocabulary"
  | "registry"
  | "complement-vocabulary"
  | "compatibility-matrix-vocabulary"
  | "conflict-beat-vocabulary"
  | "conflict-style-vocabulary"
  | "consequence-vocabulary"
  | "desire-vocabulary"
  | "dialogue-control-vocabulary"
  | "dynamic-state-system-vocabulary"
  | "emotional-meaning-vocabulary"
  | "event-engine-vocabulary"
  | "fear-vocabulary"
  | "first-message-generator-vocabulary"
  | "growth-arc-vocabulary"
  | "hidden-need-vocabulary"
  | "image-prompt-vocabulary"
  | "love-language-vocabulary"
  | "memory-compression-recall-vocabulary"
  | "moral-framework-vocabulary"
  | "narrative-arc-controller-vocabulary"
  | "origin-wound-vocabulary"
  | "payoff-fantasy-vocabulary"
  | "plot-conflict-vocabulary"
  | "personality-engine-vocabulary"
  | "relationship-dynamic-vocabulary"
  | "relationship-identity-vocabulary"
  | "relationship-stage-progression-vocabulary"
  | "romance-trope-vocabulary"
  | "route-gate-vocabulary"
  | "route-phase-vocabulary"
  | "repair-style-vocabulary"
  | "repair-beat-vocabulary"
  | "repair-need-vocabulary"
  | "response-vocabulary"
  | "rupture-type-vocabulary"
  | "trigger-vocabulary"
  | "user-persona-profile-vocabulary"
  | "visible-behavior-vocabulary"
  | "voice-vocabulary"
  | "voice-seed-vocabulary"
  | "wound-vocabulary";

export interface StandardVocabularySeedCollection {
  sourceId: StandardVocabularySeedSourceId;
  label: string;
  seeds: readonly VocabularySeedPreset[];
}

export const REGISTRY_STANDARD_VOCABULARY_SEEDS = Object.freeze(
  SEED_PRESET_REGISTRY.map(toStandardVocabularySeedFromRegistryEntry),
) satisfies readonly VocabularySeedPreset[];

export const RICH_STANDARD_VOCABULARY_SEED_COLLECTIONS = Object.freeze([
  {
    sourceId: "acts-of-service-vocabulary",
    label: "Acts of Service Vocabulary",
    seeds: ACTS_OF_SERVICE_VOCABULARY_SEEDS,
  },
  {
    sourceId: "attachment-style-vocabulary",
    label: "Attachment Style Vocabulary",
    seeds: ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "behavior-architecture-vocabulary",
    label: "Behavior Architecture Vocabulary",
    seeds: BEHAVIOR_ARCHITECTURE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "complement-vocabulary",
    label: "Complement Vocabulary",
    seeds: COMPLEMENT_VOCABULARY_SEEDS,
  },
  {
    sourceId: "compatibility-matrix-vocabulary",
    label: "Compatibility Matrix Vocabulary",
    seeds: COMPATIBILITY_MATRIX_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "conflict-beat-vocabulary",
    label: "Conflict Beat Vocabulary",
    seeds: CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "conflict-style-vocabulary",
    label: "Conflict Style Vocabulary",
    seeds: CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "consequence-vocabulary",
    label: "Consequence Vocabulary",
    seeds: CONSEQUENCE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "dialogue-control-vocabulary",
    label: "Dialogue Control Vocabulary",
    seeds: DIALOGUE_CONTROL_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "dynamic-state-system-vocabulary",
    label: "Dynamic State System Vocabulary",
    seeds: DYNAMIC_STATE_SYSTEM_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "desire-vocabulary",
    label: "Desire Vocabulary",
    seeds: DESIRE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "emotional-meaning-vocabulary",
    label: "Emotional Meaning Vocabulary",
    seeds: EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "event-engine-vocabulary",
    label: "Event Engine Vocabulary",
    seeds: EVENT_ENGINE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "fear-vocabulary",
    label: "Fear Vocabulary",
    seeds: FEAR_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "first-message-generator-vocabulary",
    label: "First Message Generator Vocabulary",
    seeds: FIRST_MESSAGE_GENERATOR_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "hidden-need-vocabulary",
    label: "Hidden Need Vocabulary",
    seeds: HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "image-prompt-vocabulary",
    label: "Image Prompt Vocabulary",
    seeds: IMAGE_PROMPT_VOCABULARY_SEEDS,
  },
  {
    sourceId: "love-language-vocabulary",
    label: "Love Language Vocabulary",
    seeds: LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "memory-compression-recall-vocabulary",
    label: "Memory Compression Recall Vocabulary",
    seeds: MEMORY_COMPRESSION_RECALL_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "moral-framework-vocabulary",
    label: "Moral Framework Vocabulary",
    seeds: MORAL_FRAMEWORK_VOCABULARY_SEEDS,
  },
  {
    sourceId: "narrative-arc-controller-vocabulary",
    label: "Narrative Arc Controller Vocabulary",
    seeds: NARRATIVE_ARC_CONTROLLER_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "origin-wound-vocabulary",
    label: "Origin Wound Vocabulary",
    seeds: ORIGIN_WOUND_VOCABULARY_SEEDS,
  },
  {
    sourceId: "wound-vocabulary",
    label: "Wound Vocabulary",
    seeds: WOUND_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "response-vocabulary",
    label: "Response Vocabulary",
    seeds: RESPONSE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "repair-style-vocabulary",
    label: "Repair Style Vocabulary",
    seeds: REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "repair-beat-vocabulary",
    label: "Repair Beat Vocabulary",
    seeds: REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "repair-need-vocabulary",
    label: "Repair Need Vocabulary",
    seeds: REPAIR_NEED_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "rupture-type-vocabulary",
    label: "Rupture Type Vocabulary",
    seeds: RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "trigger-vocabulary",
    label: "Trigger Vocabulary",
    seeds: TRIGGER_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "user-persona-profile-vocabulary",
    label: "User Persona Profile Vocabulary",
    seeds: USER_PERSONA_PROFILE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "visible-behavior-vocabulary",
    label: "Visible Behavior Vocabulary",
    seeds: VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "personality-engine-vocabulary",
    label: "Personality Engine Vocabulary",
    seeds: PERSONALITY_ENGINE_VOCABULARY_SEEDS,
  },
  {
    sourceId: "relationship-dynamic-vocabulary",
    label: "Relationship Dynamic Vocabulary",
    seeds: RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "relationship-identity-vocabulary",
    label: "Relationship Identity Vocabulary",
    seeds: RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "relationship-stage-progression-vocabulary",
    label: "Relationship Stage Progression Vocabulary",
    seeds: RELATIONSHIP_STAGE_PROGRESSION_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "romance-trope-vocabulary",
    label: "Romance Trope Vocabulary",
    seeds: ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "route-gate-vocabulary",
    label: "Route Gate Vocabulary",
    seeds: ROUTE_GATE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "route-phase-vocabulary",
    label: "Route Phase Vocabulary",
    seeds: ROUTE_PHASE_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "payoff-fantasy-vocabulary",
    label: "Payoff Fantasy Vocabulary",
    seeds: PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "plot-conflict-vocabulary",
    label: "Plot Conflict Vocabulary",
    seeds: PLOT_CONFLICT_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "growth-arc-vocabulary",
    label: "Growth Arc Vocabulary",
    seeds: GROWTH_ARC_VOCABULARY_STANDARD_SEEDS,
  },
  {
    sourceId: "voice-vocabulary",
    label: "Voice Vocabulary",
    seeds: VOICE_VOCABULARY_SEEDS,
  },
  {
    sourceId: "voice-seed-vocabulary",
    label: "Voice Seed Vocabulary",
    seeds: VOICE_SEED_VOCABULARY_SEEDS,
  },
] as const satisfies readonly StandardVocabularySeedCollection[]);

export const RICH_STANDARD_VOCABULARY_SEEDS = Object.freeze(
  RICH_STANDARD_VOCABULARY_SEED_COLLECTIONS.flatMap((collection) =>
    collection.seeds.map((seed) =>
      createVocabularySeedPreset({
        ...seed,
        seed: `${collection.sourceId}:${seed.seed}`,
        tags: [collection.sourceId, ...seed.tags],
      }),
    ),
  ),
) satisfies readonly VocabularySeedPreset[];

export const ALL_STANDARD_VOCABULARY_SEEDS = Object.freeze([
  ...REGISTRY_STANDARD_VOCABULARY_SEEDS,
  ...RICH_STANDARD_VOCABULARY_SEEDS,
] as const satisfies readonly VocabularySeedPreset[]);

export const STANDARD_VOCABULARY_SEED_COUNTS = Object.freeze({
  registry: REGISTRY_STANDARD_VOCABULARY_SEEDS.length,
  rich: RICH_STANDARD_VOCABULARY_SEEDS.length,
  all: ALL_STANDARD_VOCABULARY_SEEDS.length,
} as const);

export function getStandardVocabularySeedsByLane(
  lane: SeedPresetRegistryLane,
): readonly VocabularySeedPreset[] {
  return REGISTRY_STANDARD_VOCABULARY_SEEDS.filter((seed) =>
    seed.tags.includes(`lane:${lane}`),
  );
}

export function getRichStandardVocabularySeedsBySource(
  sourceId: StandardVocabularySeedSourceId,
): readonly VocabularySeedPreset[] {
  return RICH_STANDARD_VOCABULARY_SEED_COLLECTIONS.find(
    (collection) => collection.sourceId === sourceId,
  )?.seeds ?? [];
}

export function searchStandardVocabularySeeds(
  query: string,
  options: {
    sourceIds?: readonly StandardVocabularySeedSourceId[];
    limit?: number;
  } = {},
): readonly VocabularySeedPreset[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const sourceIds = new Set(options.sourceIds);
  const results = ALL_STANDARD_VOCABULARY_SEEDS.filter((seed) => {
    if (
      sourceIds.size > 0 &&
      !Array.from(sourceIds).some((sourceId) =>
        seed.seed.startsWith(`${sourceId}:`) || seed.tags.includes(sourceId),
      )
    ) {
      return false;
    }

    return flattenVocabularySeedForSearch(seed).includes(normalizedQuery);
  });

  return options.limit === undefined ? results : results.slice(0, options.limit);
}

export function findStandardVocabularySeedBySeed(
  seedId: string,
): VocabularySeedPreset | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return ALL_STANDARD_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function compileStandardVocabularySeedPrompt(
  seed: VocabularySeedPreset,
  options: { header?: string } = {},
): string {
  const header = options.header ?? "Vocabulary seed guidance";
  const examples = seed.examples.slice(0, 2).join(" ");
  const hooks = [
    ...seed.romanceHooks.slice(0, 3),
    ...seed.scenarioHooks.slice(0, 3),
  ].join(", ");
  const dialogue = seed.dialoguePatterns.slice(0, 2).join(" | ");

  return [
    header,
    `- ${seed.label}: ${seed.description}`,
    examples ? `  Examples: ${examples}` : "",
    hooks ? `  Hooks: ${hooks}.` : "",
    dialogue ? `  Dialogue cues: ${dialogue}` : "",
    "Use as concise, optional routing prose. Preserve character dimensionality, player agency, and authored boundaries.",
  ].filter(Boolean).join("\n");
}

function toStandardVocabularySeedFromRegistryEntry(
  entry: SeedPresetRegistryEntry,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: entry.registryKey,
    label: entry.label,
    description: entry.guidance || entry.value,
    examples: [
      `Source: ${entry.sourceLabel}.`,
      `Value: ${entry.value}.`,
      entry.guidance,
    ],
    tags: [
      "registry",
      `lane:${entry.lane}`,
      `source:${entry.sourceId}`,
      entry.sourceLabel,
      entry.category,
      entry.label,
      ...entry.systemPromptTags,
    ],
    relatedSeeds: entry.triggerKeys,
    oppositeSeeds: [],
    romanceHooks: inferRomanceHooks(entry),
    scenarioHooks: [entry.category, entry.sourceLabel],
    dialoguePatterns: [],
    metadata: {
      rarity: "common",
      romanceValue: inferRegistryRomanceValue(entry),
      conflictPotential: inferRegistryConflictPotential(entry),
    },
  });
}

function inferRomanceHooks(entry: SeedPresetRegistryEntry): readonly string[] {
  return [
    entry.value,
    ...entry.triggerKeys,
    ...entry.systemPromptTags,
  ].filter((value) =>
    /romance|love|relationship|attachment|confession|intimacy|devotion|flirt/i.test(
      value,
    ),
  );
}

function inferRegistryRomanceValue(entry: SeedPresetRegistryEntry): number {
  if (entry.lane === "personality") {
    return 8;
  }
  if (entry.lane === "appearance" || entry.lane === "world") {
    return 6;
  }
  if (entry.lane === "metadata") {
    return 5;
  }
  return 4;
}

function inferRegistryConflictPotential(entry: SeedPresetRegistryEntry): number {
  if (/trigger|wound|conflict|betrayal|threat|forbidden/i.test(entry.category)) {
    return 8;
  }
  if (/repair|de-escalation|comfort|like|quality/i.test(entry.category)) {
    return 3;
  }
  return 5;
}

function flattenVocabularySeedForSearch(seed: VocabularySeedPreset): string {
  return [
    seed.seed,
    seed.label,
    seed.description,
    ...seed.examples,
    ...seed.tags,
    ...seed.relatedSeeds,
    ...seed.oppositeSeeds,
    ...seed.romanceHooks,
    ...seed.scenarioHooks,
    ...seed.dialoguePatterns,
    seed.metadata.rarity,
    String(seed.metadata.romanceValue),
    String(seed.metadata.conflictPotential),
  ].join(" ").toLowerCase();
}
