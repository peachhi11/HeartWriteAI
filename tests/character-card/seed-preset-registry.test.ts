import assert from "node:assert/strict";
import test from "node:test";

import { APPEARANCE_PRESETS } from "../../data/appearancePresets";
import { BACKSTORY_EVENT_PRESETS } from "../../data/backstoryEventPresets";
import { CARD_METADATA_TAXONOMY_PRESETS } from "../../data/cardMetadataTaxonomyPresets";
import { COGNITIVE_DRIVER_PRESETS } from "../../data/cognitiveDriverPresets";
import { DESCRIPTIVE_WRITING_SEEDS } from "../../data/descriptiveWritingSeedPresets";
import { GENRE_SETTING_PACK_PRESETS } from "../../data/genreSettingPackPresets";
import { IMAGE_PROMPT_VOCAB_PRESETS } from "../../data/imagePromptVocabPresets";
import { MENTAL_EMOTIONAL_PATTERN_PRESETS } from "../../data/mentalEmotionalPatternPresets";
import { MUSIC_PRESETS } from "../../data/musicPresets";
import { NPC_NETWORK_PRESETS } from "../../data/npcNetworkPresets";
import { PERSONA_PLAYER_SIDE_PRESETS } from "../../data/personaPlayerSidePresets";
import { PERSONALITY_ENGINE_VOCABULARY_PRESETS } from "../../data/personalityEngineVocabularyPresets";
import { PERSONALITY_TYPOLOGY_PRESETS } from "../../data/personalityTypologyPresets";
import { SCENARIO_OPENING_MOMENT_PRESETS } from "../../data/scenarioOpeningMomentPresets";
import {
  SEED_PRESET_REGISTRY,
  SEED_PRESET_REGISTRY_BY_LANE,
  SEED_PRESET_REGISTRY_LANES,
  SEED_PRESET_REGISTRY_SOURCE_COUNTS,
  SEED_PRESET_REGISTRY_SOURCES,
  findSeedPresetRegistryEntryById,
  findSeedPresetRegistryEntryByKey,
  getSeedPresetRegistryEntriesByLane,
  getSeedPresetRegistrySourcesByLane,
  searchSeedPresetRegistryEntries,
} from "../../data/seedPresetRegistry";
import { SETTING_SUBTYPE_PRESETS } from "../../data/settingSubtypePresets";
import { WORLD_LORE_EXPANSION_PRESETS } from "../../data/worldLoreExpansionPresets";
import {
  SEED_PICKER_ENTRIES,
  searchSeedPickerEntries,
} from "../../data/seedPickerRegistry";

const descriptiveAppearanceSeeds = DESCRIPTIVE_WRITING_SEEDS.filter(
  (seed) => seed.lane === "appearance",
);

const descriptivePersonalitySeeds = DESCRIPTIVE_WRITING_SEEDS.filter(
  (seed) => seed.lane !== "appearance",
);

test("collects high-level seed lanes from shared preset modules", () => {
  assert.deepEqual(SEED_PRESET_REGISTRY_LANES, [
    "appearance",
    "personality",
    "world",
    "image",
    "metadata",
  ]);

  assert.equal(
    getSeedPresetRegistryEntriesByLane("appearance").length,
    APPEARANCE_PRESETS.length + descriptiveAppearanceSeeds.length,
  );
  assert.equal(
    getSeedPresetRegistryEntriesByLane("personality").length,
    PERSONALITY_ENGINE_VOCABULARY_PRESETS.length +
      MENTAL_EMOTIONAL_PATTERN_PRESETS.length +
      PERSONALITY_TYPOLOGY_PRESETS.length +
      COGNITIVE_DRIVER_PRESETS.length +
      BACKSTORY_EVENT_PRESETS.length +
      MUSIC_PRESETS.length +
      PERSONA_PLAYER_SIDE_PRESETS.length +
      descriptivePersonalitySeeds.length,
  );
  assert.equal(
    getSeedPresetRegistryEntriesByLane("world").length,
    WORLD_LORE_EXPANSION_PRESETS.length +
      SETTING_SUBTYPE_PRESETS.length +
      GENRE_SETTING_PACK_PRESETS.length +
      SCENARIO_OPENING_MOMENT_PRESETS.length +
      NPC_NETWORK_PRESETS.length,
  );
  assert.equal(
    getSeedPresetRegistryEntriesByLane("image").length,
    IMAGE_PROMPT_VOCAB_PRESETS.length,
  );
  assert.equal(
    getSeedPresetRegistryEntriesByLane("metadata").length,
    CARD_METADATA_TAXONOMY_PRESETS.length,
  );
  assert.equal(
    SEED_PRESET_REGISTRY.length,
    Object.values(SEED_PRESET_REGISTRY_BY_LANE).reduce(
      (total, entries) => total + entries.length,
      0,
    ),
  );
});

test("keeps source and registry keys stable and unique", () => {
  const registryKeys = SEED_PRESET_REGISTRY.map((entry) => entry.registryKey);
  const sourceKeys = SEED_PRESET_REGISTRY_SOURCES.map(
    (source) => `${source.lane}:${source.id}`,
  );

  assert.equal(new Set(registryKeys).size, registryKeys.length);
  assert.equal(new Set(sourceKeys).size, sourceKeys.length);
  assert.equal(
    SEED_PRESET_REGISTRY_SOURCE_COUNTS["appearance:appearance"],
    APPEARANCE_PRESETS.length,
  );
  assert.equal(
    SEED_PRESET_REGISTRY_SOURCE_COUNTS["appearance:descriptive-writing"],
    descriptiveAppearanceSeeds.length,
  );
  assert.equal(
    SEED_PRESET_REGISTRY_SOURCE_COUNTS["personality:descriptive-writing"],
    descriptivePersonalitySeeds.length,
  );
  assert.equal(
    SEED_PRESET_REGISTRY_SOURCE_COUNTS["personality:personality-typology"],
    PERSONALITY_TYPOLOGY_PRESETS.length,
  );
  assert.equal(
    SEED_PRESET_REGISTRY_SOURCE_COUNTS["personality:cognitive-driver"],
    COGNITIVE_DRIVER_PRESETS.length,
  );
});

test("finds registry entries by key or source id without each form knowing modules", () => {
  const appearance = findSeedPresetRegistryEntryById(
    "appearance",
    "appearance_seed_plain_but_magnetic",
  );
  const image = findSeedPresetRegistryEntryById(
    "image-prompt-vocab",
    "image_prompt_preset_character_card_portrait",
  );
  const metadata = findSeedPresetRegistryEntryByKey(
    "metadata:card-metadata-taxonomy:card_metadata_discoverability_slow_burn",
  );
  const descriptiveSpeech = findSeedPresetRegistryEntryById(
    "descriptive-writing",
    "descriptive_speech_heavy_accent",
    "personality",
  );
  const typology = findSeedPresetRegistryEntryById(
    "personality-typology",
    "personality_typology_mbti_type_infj_advocate",
  );
  const cognitiveDriver = findSeedPresetRegistryEntryById(
    "cognitive-driver",
    "cognitive_driver_internal_belief_everyone_leaves",
  );

  assert.equal(appearance?.lane, "appearance");
  assert.equal(appearance?.value, "plain but magnetic");
  assert.equal(image?.lane, "image");
  assert.equal(image?.value, "Character Card Portrait");
  assert.equal(metadata?.lane, "metadata");
  assert.equal(metadata?.value, "slow burn");
  assert.equal(descriptiveSpeech?.lane, "personality");
  assert.equal(descriptiveSpeech?.originalLane, "speech");
  assert.match(descriptiveSpeech?.value ?? "", /accent/i);
  assert.equal(typology?.lane, "personality");
  assert.equal(typology?.value, "INFJ advocate");
  assert.equal(cognitiveDriver?.lane, "personality");
  assert.equal(cognitiveDriver?.value, "everyone leaves");
});

test("filters registry sources and search results by lane", () => {
  assert.deepEqual(
    getSeedPresetRegistrySourcesByLane("image").map((source) => source.id),
    ["image-prompt-vocab"],
  );
  assert.deepEqual(
    getSeedPresetRegistrySourcesByLane("metadata").map((source) => source.id),
    ["card-metadata-taxonomy"],
  );
  assert.deepEqual(
    getSeedPresetRegistrySourcesByLane("world").map((source) => source.id),
    [
      "world-lore-expansion",
      "setting-subtype",
      "genre-setting-pack",
      "scenario-opening-moment",
      "npc-network",
    ],
  );

  const appearanceResults = searchSeedPresetRegistryEntries("copper curls", {
    lanes: ["appearance"],
  });
  const worldResults = searchSeedPresetRegistryEntries("starship", {
    lanes: ["world"],
    limit: 3,
  });
  const metadataResults = searchSeedPresetRegistryEntries("CW:", {
    sourceIds: ["card-metadata-taxonomy"],
  });

  assert.equal(appearanceResults.length, 1);
  assert.equal(appearanceResults[0]?.sourceId, "descriptive-writing");
  assert.equal(worldResults.length, 3);
  assert.equal(worldResults.every((entry) => entry.lane === "world"), true);
  assert.equal(metadataResults.every((entry) => entry.lane === "metadata"), true);
  assert.equal(searchSeedPresetRegistryEntries("").length, 0);
});

test("builds unified picker entries across flat and semantic registries", () => {
  const replacement = searchSeedPickerEntries("divided attention temporary", {
    kinds: ["semantic"],
    limit: 1,
  });
  const portrait = searchSeedPickerEntries("portrait negative prompt", {
    lanes: ["image"],
    limit: 5,
  });

  assert.equal(SEED_PICKER_ENTRIES.length > SEED_PRESET_REGISTRY.length, true);
  assert.equal(replacement[0]?.id, "fear_of_replacement");
  assert.equal(replacement[0]?.kind, "semantic");
  assert.equal(portrait.every((entry) => entry.lane === "image"), true);
});
