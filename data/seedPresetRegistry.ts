import { APPEARANCE_PRESETS } from "./appearancePresets";
import { BACKSTORY_EVENT_PRESETS } from "./backstoryEventPresets";
import { CARD_METADATA_TAXONOMY_PRESETS } from "./cardMetadataTaxonomyPresets";
import { COGNITIVE_DRIVER_PRESETS } from "./cognitiveDriverPresets";
import { DESCRIPTIVE_WRITING_SEEDS } from "./descriptiveWritingSeedPresets";
import { GENRE_SETTING_PACK_PRESETS } from "./genreSettingPackPresets";
import { IMAGE_PROMPT_VOCAB_PRESETS } from "./imagePromptVocabPresets";
import { MENTAL_EMOTIONAL_PATTERN_PRESETS } from "./mentalEmotionalPatternPresets";
import { MUSIC_PRESETS } from "./musicPresets";
import { NPC_NETWORK_PRESETS } from "./npcNetworkPresets";
import { PERSONA_PLAYER_SIDE_PRESETS } from "./personaPlayerSidePresets";
import { PERSONALITY_ENGINE_VOCABULARY_PRESETS } from "./personalityEngineVocabularyPresets";
import { PERSONALITY_TYPOLOGY_PRESETS } from "./personalityTypologyPresets";
import { SCENARIO_OPENING_MOMENT_PRESETS } from "./scenarioOpeningMomentPresets";
import { SETTING_SUBTYPE_PRESETS } from "./settingSubtypePresets";
import { WORLD_LORE_EXPANSION_PRESETS } from "./worldLoreExpansionPresets";

export type SeedPresetRegistryLane =
  | "appearance"
  | "personality"
  | "world"
  | "image"
  | "metadata";

export type SeedPresetRegistrySourceId =
  | "appearance"
  | "backstory-event"
  | "card-metadata-taxonomy"
  | "cognitive-driver"
  | "descriptive-writing"
  | "genre-setting-pack"
  | "image-prompt-vocab"
  | "mental-emotional-pattern"
  | "music"
  | "npc-network"
  | "persona-player-side"
  | "personality-engine"
  | "personality-typology"
  | "scenario-opening-moment"
  | "setting-subtype"
  | "world-lore-expansion";

export interface RegistryPresetLike {
  id: string;
  category: string;
  label: string;
  triggerKeys: readonly string[];
  guidance: string;
  systemPromptTags: readonly string[];
  value?: string;
  text?: string;
  lane?: string;
}

export interface SeedPresetRegistrySource {
  id: SeedPresetRegistrySourceId;
  lane: SeedPresetRegistryLane;
  label: string;
  description: string;
  presets: readonly RegistryPresetLike[];
}

export interface SeedPresetRegistryEntry {
  registryKey: string;
  id: string;
  sourceId: SeedPresetRegistrySourceId;
  sourceLabel: string;
  lane: SeedPresetRegistryLane;
  category: string;
  label: string;
  value: string;
  triggerKeys: readonly string[];
  guidance: string;
  systemPromptTags: readonly string[];
  originalLane?: string;
  preset: RegistryPresetLike;
}

export const SEED_PRESET_REGISTRY_LANES = Object.freeze([
  "appearance",
  "personality",
  "world",
  "image",
  "metadata",
] as const satisfies readonly SeedPresetRegistryLane[]);

export const SEED_PRESET_REGISTRY_SOURCES = Object.freeze([
  {
    id: "appearance",
    lane: "appearance",
    label: "Appearance",
    description: "Overall character appearance, visual presence, beauty type, gaze, movement, and recognisable physical texture.",
    presets: APPEARANCE_PRESETS,
  },
  {
    id: "descriptive-writing",
    lane: "appearance",
    label: "Descriptive Writing",
    description: "Concrete prose texture for appearance, emotion, personality, body language, and speech.",
    presets: DESCRIPTIVE_WRITING_SEEDS.filter((seed) => seed.lane === "appearance"),
  },
  {
    id: "personality-engine",
    lane: "personality",
    label: "Personality Engine",
    description: "Core traits, wounds, desires, triggers, responses, gates, routes, likes, dislikes, and emotional pacing vocabulary.",
    presets: PERSONALITY_ENGINE_VOCABULARY_PRESETS,
  },
  {
    id: "mental-emotional-pattern",
    lane: "personality",
    label: "Mental & Emotional Patterns",
    description: "Coping style, stress response, humour, shame response, vulnerability habit, and healing texture.",
    presets: MENTAL_EMOTIONAL_PATTERN_PRESETS,
  },
  {
    id: "personality-typology",
    lane: "personality",
    label: "Personality Typology",
    description: "Enneagram, Big Five, HEXACO, and MBTI-style seeds for soft personality texture, creator shortcuts, and persona matching.",
    presets: PERSONALITY_TYPOLOGY_PRESETS,
  },
  {
    id: "cognitive-driver",
    lane: "personality",
    label: "Cognitive Drivers",
    description: "Decision-making, belief, perception, internal dialogue, value, moral framework, and cognitive distortion seeds.",
    presets: COGNITIVE_DRIVER_PRESETS,
  },
  {
    id: "backstory-event",
    lane: "personality",
    label: "Backstory Events",
    description: "Life events, turning points, achievements, failures, migration, mentorship, first love, found family, and career history.",
    presets: BACKSTORY_EVENT_PRESETS,
  },
  {
    id: "music",
    lane: "personality",
    label: "Music",
    description: "Music taste, memory, mood, private softness, identity, ritual, affection, and shared intimacy seeds.",
    presets: MUSIC_PRESETS,
  },
  {
    id: "persona-player-side",
    lane: "personality",
    label: "Persona Player Side",
    description: "Player persona archetypes, goals, preferred dynamics, boundaries, pacing, self-insert tone, and agency preferences.",
    presets: PERSONA_PLAYER_SIDE_PRESETS,
  },
  {
    id: "descriptive-writing",
    lane: "personality",
    label: "Descriptive Writing",
    description: "Concrete prose texture for personality, emotional expression, body language, and speech.",
    presets: DESCRIPTIVE_WRITING_SEEDS.filter((seed) => seed.lane !== "appearance"),
  },
  {
    id: "world-lore-expansion",
    lane: "world",
    label: "World Lore Expansion",
    description: "Magic, law, health, transport, media, education, food, clothing, infrastructure, customs, and lore conflict seeds.",
    presets: WORLD_LORE_EXPANSION_PRESETS,
  },
  {
    id: "setting-subtype",
    lane: "world",
    label: "Setting Subtype",
    description: "Place, settlement, institutional, social, romance, and scenario pressure seeds.",
    presets: SETTING_SUBTYPE_PRESETS,
  },
  {
    id: "genre-setting-pack",
    lane: "world",
    label: "Genre Setting Pack",
    description: "Genre-level atmosphere, institutions, danger, aesthetics, daily life, and romance pacing seeds.",
    presets: GENRE_SETTING_PACK_PRESETS,
  },
  {
    id: "scenario-opening-moment",
    lane: "world",
    label: "Scenario Opening Moment",
    description: "First meetings, inciting incidents, conflict starters, domestic openers, danger openers, and emotional hooks.",
    presets: SCENARIO_OPENING_MOMENT_PRESETS,
  },
  {
    id: "npc-network",
    lane: "world",
    label: "NPC Network",
    description: "Friends, rivals, exes, mentors, dependants, family, enemies, patrons, employers, and social-circle stakes.",
    presets: NPC_NETWORK_PRESETS,
  },
  {
    id: "image-prompt-vocab",
    lane: "image",
    label: "Image Prompt Vocabulary",
    description: "Portrait presets, appearance tags, lighting, poses, framing, art styles, environments, moods, quality tags, and negative prompts.",
    presets: IMAGE_PROMPT_VOCAB_PRESETS,
  },
  {
    id: "card-metadata-taxonomy",
    lane: "metadata",
    label: "Card Metadata Taxonomy",
    description: "Discoverability tags, content warnings, compatibility markers, relationship types, chat styles, scenario labels, and library gates.",
    presets: CARD_METADATA_TAXONOMY_PRESETS,
  },
] as const satisfies readonly SeedPresetRegistrySource[]);

export const SEED_PRESET_REGISTRY = Object.freeze(
  SEED_PRESET_REGISTRY_SOURCES.flatMap((source) =>
    source.presets.map((preset) => toSeedPresetRegistryEntry(source, preset)),
  ),
);

export const SEED_PRESET_REGISTRY_BY_LANE = Object.freeze(
  SEED_PRESET_REGISTRY_LANES.reduce(
    (entriesByLane, lane) => ({
      ...entriesByLane,
      [lane]: SEED_PRESET_REGISTRY.filter((entry) => entry.lane === lane),
    }),
    {} as Record<SeedPresetRegistryLane, readonly SeedPresetRegistryEntry[]>,
  ),
);

export const SEED_PRESET_REGISTRY_SOURCE_COUNTS = Object.freeze(
  SEED_PRESET_REGISTRY_SOURCES.reduce(
    (counts, source) => ({
      ...counts,
      [`${source.lane}:${source.id}`]: source.presets.length,
    }),
    {} as Record<string, number>,
  ),
);

export function getSeedPresetRegistryEntriesByLane(
  lane: SeedPresetRegistryLane,
): readonly SeedPresetRegistryEntry[] {
  return SEED_PRESET_REGISTRY_BY_LANE[lane];
}

export function getSeedPresetRegistrySourcesByLane(
  lane: SeedPresetRegistryLane,
): readonly SeedPresetRegistrySource[] {
  return SEED_PRESET_REGISTRY_SOURCES.filter((source) => source.lane === lane);
}

export function findSeedPresetRegistryEntryByKey(
  registryKey: string,
): SeedPresetRegistryEntry | undefined {
  const normalizedKey = registryKey.trim().toLowerCase();
  return SEED_PRESET_REGISTRY.find(
    (entry) => entry.registryKey.toLowerCase() === normalizedKey,
  );
}

export function findSeedPresetRegistryEntryById(
  sourceId: SeedPresetRegistrySourceId,
  id: string,
  lane?: SeedPresetRegistryLane,
): SeedPresetRegistryEntry | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SEED_PRESET_REGISTRY.find(
    (entry) =>
      entry.sourceId === sourceId &&
      entry.id.toLowerCase() === normalizedId &&
      (lane === undefined || entry.lane === lane),
  );
}

export function searchSeedPresetRegistryEntries(
  query: string,
  options: {
    lanes?: readonly SeedPresetRegistryLane[];
    sourceIds?: readonly SeedPresetRegistrySourceId[];
    limit?: number;
  } = {},
): readonly SeedPresetRegistryEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const lanes = new Set(options.lanes);
  const sourceIds = new Set(options.sourceIds);

  const results = SEED_PRESET_REGISTRY.filter((entry) => {
    if (lanes.size > 0 && !lanes.has(entry.lane)) {
      return false;
    }
    if (sourceIds.size > 0 && !sourceIds.has(entry.sourceId)) {
      return false;
    }

    return [
      entry.id,
      entry.category,
      entry.label,
      entry.value,
      entry.sourceLabel,
      entry.guidance,
      ...entry.triggerKeys,
      ...entry.systemPromptTags,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });

  return options.limit === undefined ? results : results.slice(0, options.limit);
}

function toSeedPresetRegistryEntry(
  source: SeedPresetRegistrySource,
  preset: RegistryPresetLike,
): SeedPresetRegistryEntry {
  const value = preset.value ?? preset.text ?? preset.label;

  return {
    registryKey: `${source.lane}:${source.id}:${preset.id}`,
    id: preset.id,
    sourceId: source.id,
    sourceLabel: source.label,
    lane: source.lane,
    category: preset.category,
    label: preset.label,
    value,
    triggerKeys: preset.triggerKeys,
    guidance: preset.guidance,
    systemPromptTags: preset.systemPromptTags,
    originalLane: preset.lane,
    preset,
  };
}
