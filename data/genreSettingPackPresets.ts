export type GenreSettingPackPresetCategory =
  | "Genre Pack"
  | "Gothic Setting"
  | "Western Setting"
  | "Noir Setting"
  | "Cyberpunk Setting"
  | "Solarpunk Setting"
  | "Regency Setting"
  | "Mafia Setting"
  | "Monster Hunter Setting"
  | "Military Sci-Fi Setting"
  | "Post-Apocalyptic Setting"
  | "High-Value Genre Seed";

export interface GenreSettingPackPreset {
  id: string;
  category: GenreSettingPackPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledGenreSettingPackPresetAdditions {
  backgroundAddition: string;
  scenarioAddition: string;
  systemPromptAddition: string;
}

interface GenreSettingPackSeedGroup {
  category: GenreSettingPackPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const GENRE_SETTING_PACK_GUIDANCE =
  "Use this as genre-setting texture. Genre signals may shape atmosphere, institutions, danger, class pressure, aesthetics, daily life, and romance pacing without flattening characters or overriding {{user}} agency.";

export const genreSettingPackPresets = [
  "Gothic Horror",
  "Western Frontier",
  "Noir Crime",
  "Cyberpunk Megacity",
  "Solarpunk Utopia",
  "Regency Romance",
  "Mafia Underworld",
  "Monster Hunter Frontier",
  "Military Sci-Fi",
  "Post-Apocalyptic Survival",
];

export const gothicSettingSeeds = [
  "gothic_manor",
  "crumbling_estate",
  "haunted_castle",
  "fog_shrouded_village",
  "isolated_moors",
  "decaying_aristocracy",
  "family_secrets",
  "forbidden_wing",
  "ancestral_portraits",
  "hidden_passages",
  "candlelit_halls",
  "stormy_nights",
  "graveyard",
  "crypts",
  "old_money_decay",
  "religious_guilt",
  "tragic_romance",
  "cursed_bloodline",
  "melancholic_atmosphere",
  "beauty_and_decay",
];

export const westernSettingSeeds = [
  "frontier_town",
  "dusty_main_street",
  "saloon",
  "ranch",
  "cattle_drive",
  "sheriff_office",
  "outlaw_gang",
  "bounty_hunter",
  "train_station",
  "desert_frontier",
  "homesteading",
  "law_vs_chaos",
  "duel_at_high_noon",
  "small_community",
  "survival_through_grit",
  "wide_open_plains",
  "horse_culture",
  "frontier_justice",
  "self_reliance",
  "untamed_wilderness",
];

export const noirSettingSeeds = [
  "rain_soaked_city",
  "private_detective",
  "crime_boss",
  "nightclub",
  "corrupt_politicians",
  "femme_fatale",
  "smoky_bars",
  "urban_decay",
  "moral_ambiguity",
  "police_corruption",
  "missing_person_case",
  "back_alley_deals",
  "organized_crime",
  "lonely_protagonist",
  "neon_signs",
  "secrets_and_lies",
  "betrayal",
  "fatalism",
  "cynical_worldview",
  "truth_has_a_cost",
];

export const cyberpunkSettingSeeds = [
  "megacity",
  "corporate_dystopia",
  "neon_lights",
  "cybernetic_implants",
  "artificial_intelligence",
  "hacker_culture",
  "street_gangs",
  "corporate_security",
  "surveillance_state",
  "virtual_reality",
  "augmented_reality",
  "black_market_tech",
  "social_inequality",
  "high_tech_low_life",
  "digital_identity",
  "data_brokers",
  "rogue_ai",
  "cybercrime",
  "urban_sprawl",
  "resistance_movements",
];

export const solarpunkSettingSeeds = [
  "eco_city",
  "renewable_energy",
  "community_gardens",
  "green_architecture",
  "mutual_aid",
  "local_governance",
  "public_transit",
  "urban_farming",
  "sustainable_living",
  "cooperative_economy",
  "restored_ecosystems",
  "clean_technology",
  "community_workshops",
  "shared_resources",
  "hopeful_future",
  "repair_culture",
  "inclusive_society",
  "climate_recovery",
  "human_nature_balance",
  "optimistic_progress",
];

export const regencySettingSeeds = [
  "ballroom_society",
  "country_estates",
  "marriage_market",
  "drawing_rooms",
  "social_reputation",
  "inheritance_laws",
  "dukes_and_ladies",
  "formal_courtship",
  "chaperones",
  "afternoon_calls",
  "carriage_travel",
  "polite_scandal",
  "class_consciousness",
  "witty_banter",
  "social_obligations",
  "strict_etiquette",
  "romantic_letters",
  "fortune_and_title",
  "public_propriety",
  "private_longing",
];

export const mafiaSettingSeeds = [
  "crime_family",
  "mafia_boss",
  "underboss",
  "family_loyalty",
  "blood_oaths",
  "organized_crime",
  "protection_rackets",
  "nightclubs",
  "luxury_lifestyle",
  "ruthless_reputation",
  "family_business",
  "power_struggles",
  "code_of_silence",
  "dangerous_romance",
  "heir_to_empire",
  "bodyguards",
  "criminal_politics",
  "debt_and_favors",
  "enemy_families",
  "loyalty_vs_love",
];

export const monsterHunterSettingSeeds = [
  "monster_hunting_guild",
  "wilderness_frontier",
  "dangerous_creatures",
  "contract_hunting",
  "ancient_ruins",
  "beast_lore",
  "survival_training",
  "traveling_hunters",
  "monster_trophies",
  "village_protection",
  "legendary_beasts",
  "forbidden_wilderness",
  "hunter_rank_system",
  "field_camps",
  "tracking_skills",
  "magical_creatures",
  "old_monster_wars",
  "hunter_families",
  "dangerous_profession",
  "humanity_vs_monsters",
];

export const militarySciFiSettingSeeds = [
  "interstellar_military",
  "starship_fleet",
  "space_marines",
  "chain_of_command",
  "frontline_warfare",
  "alien_conflict",
  "orbital_battles",
  "military_academy",
  "advanced_weaponry",
  "strategic_command",
  "special_forces",
  "planetary_defense",
  "veteran_soldiers",
  "war_ethics",
  "military_protocol",
  "combat_ai",
  "deep_space_patrol",
  "fleet_politics",
  "soldier_brotherhood",
  "duty_before_self",
];

export const postApocalypticSettingSeeds = [
  "ruined_cities",
  "scarce_resources",
  "survival_communities",
  "wasteland",
  "collapsed_government",
  "salvage_culture",
  "mutant_threats",
  "raider_gangs",
  "fortified_settlements",
  "resource_conflict",
  "survivalism",
  "old_world_relics",
  "makeshift_technology",
  "community_defense",
  "harsh_environment",
  "hope_amid_ruin",
  "traveling_traders",
  "water_is_power",
  "rebuilding_civilization",
  "found_family_survival",
];

export const highValueGenreSettingSeeds = [
  "gothic_manor",
  "frontier_town",
  "rain_soaked_city",
  "megacity",
  "eco_city",
  "ballroom_society",
  "crime_family",
  "monster_hunting_guild",
  "interstellar_military",
  "ruined_cities",
  "family_secrets",
  "corporate_dystopia",
  "hopeful_future",
  "marriage_market",
  "loyalty_vs_love",
  "dangerous_creatures",
  "chain_of_command",
  "survival_communities",
  "beauty_and_decay",
  "rebuilding_civilization",
];

const GENRE_SETTING_PACK_SEED_GROUPS = Object.freeze([
  {
    category: "Genre Pack",
    prefix: "genre_setting_pack",
    guidance: GENRE_SETTING_PACK_GUIDANCE,
    values: genreSettingPackPresets,
  },
  {
    category: "Gothic Setting",
    prefix: "genre_setting_gothic",
    guidance:
      "Use this as gothic setting texture. Decay, secrecy, inheritance, faith, isolation, storms, old houses, and tragic romance can deepen atmosphere without forcing melodrama.",
    values: gothicSettingSeeds,
  },
  {
    category: "Western Setting",
    prefix: "genre_setting_western",
    guidance:
      "Use this as western frontier texture. Distance, law, community, grit, wilderness, travel, frontier justice, and survival pressure can shape stakes while preserving choice and nuance.",
    values: westernSettingSeeds,
  },
  {
    category: "Noir Setting",
    prefix: "genre_setting_noir",
    guidance:
      "Use this as noir setting texture. Crime, corruption, secrecy, loneliness, rain, night life, moral ambiguity, and costly truth should add pressure without endorsing harm.",
    values: noirSettingSeeds,
  },
  {
    category: "Cyberpunk Setting",
    prefix: "genre_setting_cyberpunk",
    guidance:
      "Use this as cyberpunk setting texture. Tech, corporate power, surveillance, black markets, identity, inequality, and resistance can shape stakes without becoming operational advice.",
    values: cyberpunkSettingSeeds,
  },
  {
    category: "Solarpunk Setting",
    prefix: "genre_setting_solarpunk",
    guidance:
      "Use this as solarpunk setting texture. Repair, ecology, cooperation, clean technology, mutual aid, restored systems, and hopeful futures can add practical optimism and social texture.",
    values: solarpunkSettingSeeds,
  },
  {
    category: "Regency Setting",
    prefix: "genre_setting_regency",
    guidance:
      "Use this as regency setting texture. Reputation, etiquette, class, inheritance, letters, courtship, scandal, propriety, and private longing can shape romance without scripting consent.",
    values: regencySettingSeeds,
  },
  {
    category: "Mafia Setting",
    prefix: "genre_setting_mafia",
    guidance:
      "Use this as fictional underworld setting texture. Loyalty, family pressure, danger, secrecy, power, debt, and rival factions should stay consequence-aware and never endorse criminal harm.",
    values: mafiaSettingSeeds,
  },
  {
    category: "Monster Hunter Setting",
    prefix: "genre_setting_monster_hunter",
    guidance:
      "Use this as monster-hunter frontier texture. Guilds, field camps, contracts, ruins, dangerous creatures, lore, ranks, and protection duties can add danger without dehumanising characters.",
    values: monsterHunterSettingSeeds,
  },
  {
    category: "Military Sci-Fi Setting",
    prefix: "genre_setting_military_sci_fi",
    guidance:
      "Use this as military sci-fi setting texture. Fleets, command structures, duty, war ethics, patrols, academies, protocols, and alien conflict should add pressure without glorifying violence.",
    values: militarySciFiSettingSeeds,
  },
  {
    category: "Post-Apocalyptic Setting",
    prefix: "genre_setting_post_apocalyptic",
    guidance:
      "Use this as post-apocalyptic setting texture. Scarcity, salvage, ruins, settlements, old-world relics, rebuilding, and survival communities can shape stakes without tactical real-world instruction.",
    values: postApocalypticSettingSeeds,
  },
  {
    category: "High-Value Genre Seed",
    prefix: "genre_setting_high_value",
    guidance:
      "Use this as a high-signal genre-setting seed for setting design, lorebook entries, route planning, preset search, and scenario matching.",
    values: highValueGenreSettingSeeds,
  },
] satisfies readonly GenreSettingPackSeedGroup[]);

function normalizeReadableGenreSettingPackValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Oo]rganized\b/g, (match) =>
      match === "Organized" ? "Organised" : "organised",
    )
    .replace(/\b[Dd]efense\b/g, (match) =>
      match === "Defense" ? "Defence" : "defence",
    )
    .replace(/\b[Ff]avors\b/g, (match) => (match === "Favors" ? "Favours" : "favours"))
    .replace(/\b[Tt]raveling\b/g, (match) =>
      match === "Traveling" ? "Travelling" : "travelling",
    )
    .replace(/\b[Cc]ivilization\b/g, (match) =>
      match === "Civilization" ? "Civilisation" : "civilisation",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyGenreSettingPack(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeGenreSettingPackPreset(
  group: GenreSettingPackSeedGroup,
  rawValue: string,
): GenreSettingPackPreset {
  const value = normalizeReadableGenreSettingPackValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyGenreSettingPack(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyGenreSettingPack(value),
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

export const GENRE_SETTING_PACK_PRESETS = GENRE_SETTING_PACK_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeGenreSettingPackPreset(group, value)),
);

export const GENRE_SETTING_PACK_PRESET_CATEGORIES = Array.from(
  new Set(GENRE_SETTING_PACK_PRESETS.map((preset) => preset.category)),
).sort();

export const getGenreSettingPackPresetsByCategory = (
  category: GenreSettingPackPresetCategory,
) => GENRE_SETTING_PACK_PRESETS.filter((preset) => preset.category === category);

export const findGenreSettingPackPresetById = (id: string) =>
  GENRE_SETTING_PACK_PRESETS.find((preset) => preset.id === id);

export const compileGenreSettingPackPresetAdditions = (
  preset: GenreSettingPackPreset,
): CompiledGenreSettingPackPresetAdditions => ({
  backgroundAddition: `Genre setting context: ${preset.value}. ${preset.guidance}`,
  scenarioAddition: `Genre pack texture may include ${preset.value}, shaping atmosphere, institutions, danger, class pressure, daily texture, and romance pacing without locking the scene into genre cliche.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft genre-setting context.`,
    "Let genre-specific signals influence locations, customs, aesthetics, social pressure, hazards, institutions, and relationship pacing only when relevant.",
    "Preserve {{user}} agency, avoid infodumps, and keep criminal, violent, war, surveillance, and survival systems fictional, consequence-aware, and non-instructional.",
  ].join(" "),
});
