export type CardMetadataTaxonomyPresetCategory =
  | "Card Taxonomy Preset"
  | "Discoverability Tag"
  | "Content Warning"
  | "Compatibility"
  | "Relationship Type"
  | "Chat Style"
  | "Scenario Type"
  | "Metadata Gate"
  | "High-Value Metadata Seed";

export interface CardMetadataTaxonomyPreset {
  id: string;
  category: CardMetadataTaxonomyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCardMetadataTaxonomyPresetAdditions {
  creatorNotesAddition: string;
  metadataAddition: string;
  systemPromptAddition: string;
}

interface CardMetadataTaxonomySeedGroup {
  category: CardMetadataTaxonomyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CARD_METADATA_TAXONOMY_GUIDANCE =
  "Use this as card metadata taxonomy. Tags, warnings, compatibility markers, relationship types, chat styles, scenario labels, and library gates should improve discovery and safety review without changing character behaviour or overriding {{user}} agency.";

export const cardMetadataTaxonomyPresets = [
  "Romance Card",
  "Slow Burn Card",
  "Comfort Card",
  "Angst Card",
  "Adventure Card",
  "Mystery Card",
  "Dark Romance Card",
  "Cozy Slice-of-Life Card",
  "High Fantasy Card",
  "Sci-Fi Card",
  "Modern Workplace Card",
  "Royal Court Card",
  "Underworld Card",
  "Monster Romance Card",
  "Protective Love Interest",
  "Enemies to Lovers",
  "Friends to Lovers",
  "User-Led Chat",
  "Plot-Led Chat",
  "Boundary-Safe Card",
];

export const discoverabilityTagSeeds = [
  "romance",
  "slow_burn",
  "hurt_comfort",
  "fluff",
  "angst",
  "drama",
  "mystery",
  "adventure",
  "fantasy",
  "sci_fi",
  "modern",
  "historical",
  "royalty",
  "academy",
  "workplace",
  "underworld",
  "mafia",
  "monster_romance",
  "bodyguard",
  "found_family",
  "fake_dating",
  "forced_proximity",
  "enemies_to_lovers",
  "friends_to_lovers",
  "rivals_to_lovers",
  "touch_starved",
  "protective",
  "caretaker",
  "obsession_devotion",
  "emotional_healing",
];

export const contentWarningSeeds = [
  "cw_none",
  "cw_angst",
  "cw_grief",
  "cw_betrayal",
  "cw_abandonment",
  "cw_family_conflict",
  "cw_violence",
  "cw_blood",
  "cw_injury",
  "cw_death_mentions",
  "cw_war",
  "cw_crime",
  "cw_stalking_themes",
  "cw_possessiveness",
  "cw_power_imbalance",
  "cw_classism",
  "cw_horror",
  "cw_monsters",
  "cw_medical_scenes",
  "cw_emotional_distress",
  "cw_panic",
  "cw_trust_issues",
  "cw_dark_romance",
  "cw_mature_themes",
];

export const compatibilitySeeds = [
  "sfw_compatible",
  "fade_to_black_compatible",
  "romance_compatible",
  "platonic_compatible",
  "friendship_compatible",
  "angst_compatible",
  "comfort_compatible",
  "adventure_compatible",
  "plot_heavy_compatible",
  "slice_of_life_compatible",
  "slow_burn_compatible",
  "fast_burn_compatible",
  "user_led_compatible",
  "npc_led_compatible",
  "multi_char_compatible",
  "longform_compatible",
  "shortform_compatible",
  "lore_heavy_compatible",
  "beginner_friendly",
  "high_agency_player",
];

export const relationshipTypeSeeds = [
  "strangers_to_lovers",
  "friends_to_lovers",
  "best_friends_to_lovers",
  "enemies_to_lovers",
  "rivals_to_lovers",
  "exes_to_lovers",
  "fake_relationship",
  "secret_relationship",
  "forbidden_romance",
  "arranged_match",
  "bodyguard_charge",
  "mentor_protege",
  "boss_employee",
  "royal_commoner",
  "soulmates",
  "fated_mates",
  "found_family",
  "platonic_companions",
  "protective_partner",
  "equal_partners",
];

export const chatStyleSeeds = [
  "user_led_chat",
  "character_led_chat",
  "collaborative_storytelling",
  "novelistic_style",
  "cinematic_style",
  "casual_roleplay",
  "dialogue_heavy",
  "description_heavy",
  "banter_heavy",
  "emotional_introspection",
  "slow_build",
  "high_tension",
  "soft_comfort",
  "angsty_poetic",
  "cozy_domestic",
  "plot_driven",
  "sandbox_style",
  "choice_based",
  "short_replies",
  "long_replies",
];

export const scenarioTypeSeeds = [
  "first_meeting",
  "established_relationship",
  "forced_proximity",
  "one_bed",
  "safehouse",
  "rescue_scene",
  "injury_caretaking",
  "domestic_morning",
  "late_night_confession",
  "public_scandal",
  "secret_mission",
  "academy_rivals",
  "workplace_tension",
  "royal_ball",
  "underworld_deal",
  "monster_hunt",
  "space_station_crisis",
  "road_trip",
  "storm_shelter",
  "slice_of_life",
];

export const cardMetadataGates = [
  "tagging_complete_gate",
  "content_warning_checked_gate",
  "compatibility_checked_gate",
  "relationship_type_selected_gate",
  "chat_style_selected_gate",
  "scenario_type_selected_gate",
  "player_boundary_checked_gate",
  "discoverability_ready_gate",
  "library_ready_route",
];

export const highValueCardMetadataSeeds = [
  "romance",
  "slow_burn",
  "hurt_comfort",
  "fantasy",
  "sci_fi",
  "modern",
  "protective",
  "touch_starved",
  "sfw_compatible",
  "fade_to_black_compatible",
  "slow_burn_compatible",
  "user_led_compatible",
  "enemies_to_lovers",
  "friends_to_lovers",
  "forced_proximity",
  "safehouse",
  "novelistic_style",
  "emotional_introspection",
  "content_warning_checked_gate",
  "library_ready_route",
];

const CARD_METADATA_TAXONOMY_SEED_GROUPS = Object.freeze([
  {
    category: "Card Taxonomy Preset",
    prefix: "card_metadata_taxonomy",
    guidance: CARD_METADATA_TAXONOMY_GUIDANCE,
    values: cardMetadataTaxonomyPresets,
  },
  {
    category: "Discoverability Tag",
    prefix: "card_metadata_discoverability",
    guidance:
      "Use this as a discoverability tag for library search, browsing, matching, and user-facing filtering. Tags describe broad card appeal without forcing the chat to perform that trope every turn.",
    values: discoverabilityTagSeeds,
  },
  {
    category: "Content Warning",
    prefix: "card_metadata_content_warning",
    guidance:
      "Use this as content-warning metadata. Warnings should make card browsing safer, accurate, and opt-in without sensationalising distress or treating sensitive themes as a promise of escalation.",
    values: contentWarningSeeds,
  },
  {
    category: "Compatibility",
    prefix: "card_metadata_compatibility",
    guidance:
      "Use this as compatibility metadata for matching player preferences, content limits, reply length, plot density, lore depth, and agency level without rewriting the card's core identity.",
    values: compatibilitySeeds,
  },
  {
    category: "Relationship Type",
    prefix: "card_metadata_relationship_type",
    guidance:
      "Use this as relationship-type metadata. Relationship labels should support routing, search, and expectation setting while preserving consent, pacing, and mutual choice.",
    values: relationshipTypeSeeds,
  },
  {
    category: "Chat Style",
    prefix: "card_metadata_chat_style",
    guidance:
      "Use this as chat-style metadata. Style labels can guide reply density, narration feel, player leadership, choices, banter, comfort, introspection, and plot movement without hard scripting.",
    values: chatStyleSeeds,
  },
  {
    category: "Scenario Type",
    prefix: "card_metadata_scenario_type",
    guidance:
      "Use this as scenario-type metadata. Scenario labels should make openings and library filters clearer without forcing a fixed route or assuming {{user}} actions.",
    values: scenarioTypeSeeds,
  },
  {
    category: "Metadata Gate",
    prefix: "card_metadata_gate",
    guidance:
      "Use this as a metadata workflow gate. Gates should mark tagging, warning review, compatibility review, relationship type, chat style, scenario type, boundary checks, and library readiness.",
    values: cardMetadataGates,
  },
  {
    category: "High-Value Metadata Seed",
    prefix: "card_metadata_high_value",
    guidance:
      "Use this as a high-signal metadata seed for card creation, filtering, compatibility checks, safety review, library routing, and preset search.",
    values: highValueCardMetadataSeeds,
  },
] satisfies readonly CardMetadataTaxonomySeedGroup[]);

function normalizeReadableCardMetadataTaxonomyValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Cc]ozy\b/g, (match) => (match === "Cozy" ? "Cosy" : "cosy"))
    .replace(/\b[Ss]ci fi\b/g, (match) => (match[0] === "S" ? "Sci-Fi" : "sci-fi"))
    .replace(/\b[Ss]fw\b/g, "SFW")
    .replace(/\b[Nn]pc\b/g, "NPC")
    .replace(/\b[Cc]w\s+/g, "CW: ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyCardMetadataTaxonomy(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeCardMetadataTaxonomyPreset(
  group: CardMetadataTaxonomySeedGroup,
  rawValue: string,
): CardMetadataTaxonomyPreset {
  const value = normalizeReadableCardMetadataTaxonomyValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyCardMetadataTaxonomy(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyCardMetadataTaxonomy(value),
        ...value
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const CARD_METADATA_TAXONOMY_PRESETS =
  CARD_METADATA_TAXONOMY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => makeCardMetadataTaxonomyPreset(group, value)),
  );

export const CARD_METADATA_TAXONOMY_PRESET_CATEGORIES = Array.from(
  new Set(CARD_METADATA_TAXONOMY_PRESETS.map((preset) => preset.category)),
).sort();

export const getCardMetadataTaxonomyPresetsByCategory = (
  category: CardMetadataTaxonomyPresetCategory,
) => CARD_METADATA_TAXONOMY_PRESETS.filter((preset) => preset.category === category);

export const findCardMetadataTaxonomyPresetById = (id: string) =>
  CARD_METADATA_TAXONOMY_PRESETS.find((preset) => preset.id === id);

export const compileCardMetadataTaxonomyPresetAdditions = (
  preset: CardMetadataTaxonomyPreset,
): CompiledCardMetadataTaxonomyPresetAdditions => ({
  creatorNotesAddition: `Card metadata taxonomy: ${preset.value}. ${preset.guidance}`,
  metadataAddition: `Metadata label ${preset.value} may support discoverability, compatibility checks, content-warning review, scenario matching, chat-style expectations, and library readiness without changing the card's authored character.`,
  systemPromptAddition: [
    `Treat ${preset.value} as card metadata only.`,
    "Use metadata for filtering, creator notes, compatibility review, warning review, library routing, and expectation setting.",
    "Do not let tags, warnings, compatibility labels, gates, or scenario labels override character consent, {{user}} agency, safety boundaries, or live chat context.",
  ].join(" "),
});
