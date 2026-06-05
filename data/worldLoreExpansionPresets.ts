export type WorldLoreExpansionPresetCategory =
  | "Archetype"
  | "World Lore Seed"
  | "Magic System"
  | "Law & Legal System"
  | "Health & Medicine"
  | "Transport System"
  | "Media & Communication"
  | "Education System"
  | "Food Culture"
  | "Clothing Norm"
  | "Lore Conflict"
  | "High-Value Seed";

export interface WorldLoreExpansionPreset {
  id: string;
  category: WorldLoreExpansionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledWorldLoreExpansionPresetAdditions {
  backgroundAddition: string;
  scenarioAddition: string;
  systemPromptAddition: string;
}

interface WorldLoreExpansionSeedGroup {
  category: WorldLoreExpansionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const WORLD_LORE_EXPANSION_GUIDANCE =
  "Use this as world lore texture. Systems, customs, infrastructure, class, law, health, media, education, food, clothing, magic, technology, and daily life may shape stakes without turning scenes into exposition or overriding {{user}} agency.";

export const worldLoreExpansionPresets = [
  "High Fantasy Kingdom",
  "Dark Fantasy Realm",
  "Magitech Empire",
  "Urban Fantasy Society",
  "Steampunk Nation",
  "Cyberpunk Megacity",
  "Solarpunk Federation",
  "Spacefaring Republic",
  "Corporate Dystopia",
  "Post-Apocalyptic Confederation",
  "Royal Court Society",
  "Merchant Republic",
  "Religious Theocracy",
  "Military State",
  "Academic Technocracy",
  "Frontier Colony",
  "Fae Dominion",
  "Vampire Aristocracy",
  "Dragon Empire",
  "Interstellar Civilization",
];

export const worldLoreSeeds = [
  "magic_system",
  "legal_system",
  "health_system",
  "transport_system",
  "communication_system",
  "education_system",
  "food_culture",
  "clothing_norms",
  "economic_system",
  "social_customs",
  "technology_level",
  "religious_structure",
  "political_structure",
  "military_structure",
  "cultural_values",
  "family_structure",
  "class_system",
  "labor_system",
  "trade_network",
  "daily_life",
];

export const magicSystemSeeds = [
  "hard_magic_system",
  "soft_magic_system",
  "ritual_magic",
  "innate_magic",
  "learned_magic",
  "bloodline_magic",
  "divine_magic",
  "spirit_magic",
  "elemental_magic",
  "rune_magic",
  "alchemy",
  "enchantment",
  "summoning",
  "necromancy",
  "illusion_magic",
  "healing_magic",
  "curse_magic",
  "artifact_magic",
  "wild_magic",
  "forbidden_magic",
  "mana_based",
  "stamina_based",
  "sacrifice_based",
  "emotion_based",
  "faith_based",
  "contract_based",
  "knowledge_based",
  "blood_cost",
  "memory_cost",
  "lifespan_cost",
  "licensed_magic",
  "regulated_magic",
  "illegal_magic",
  "state_controlled_magic",
  "guild_controlled_magic",
  "public_magic_education",
  "secret_magic_societies",
  "magic_as_profession",
  "magic_as_nobility",
  "magic_as_common_skill",
];

export const legalSystemSeeds = [
  "common_law",
  "civil_law",
  "religious_law",
  "customary_law",
  "royal_decree_system",
  "corporate_law",
  "tribal_law",
  "military_law",
  "guild_law",
  "magical_law",
  "jury_trials",
  "judge_trials",
  "trial_by_combat",
  "trial_by_magic",
  "truth_spell_testimony",
  "public_hearings",
  "secret_courts",
  "appeal_system",
  "rehabilitative_justice",
  "punitive_justice",
  "restorative_justice",
  "community_justice",
  "debt_punishment",
  "exile_punishment",
  "imprisonment",
  "execution",
  "fines",
  "service_sentences",
  "citizen_rights",
  "noble_privileges",
  "corporate_privileges",
  "equal_protection",
  "class_based_law",
  "species_based_law",
  "magic_user_regulation",
  "speech_protection",
  "surveillance_state",
  "privacy_rights",
];

export const healthMedicineSeeds = [
  "universal_healthcare",
  "private_medicine",
  "charity_hospitals",
  "guild_healers",
  "temple_healers",
  "state_medicine",
  "corporate_medicine",
  "community_care",
  "modern_medicine",
  "herbal_medicine",
  "healing_magic",
  "nanomedicine",
  "cybernetic_medicine",
  "spiritual_healing",
  "holistic_medicine",
  "battlefield_medicine",
  "teaching_hospitals",
  "mobile_clinics",
  "village_healers",
  "urban_hospitals",
  "medical_research_centers",
  "pandemic_preparedness",
  "mental_health_support",
  "trauma_care",
  "public_health",
  "preventive_care",
  "genetic_treatment",
  "regenerative_medicine",
];

export const transportSystemSeeds = [
  "walking_society",
  "horse_transport",
  "carriage_network",
  "canal_transport",
  "sailing_routes",
  "railway_network",
  "automobile_culture",
  "public_transit",
  "high_speed_rail",
  "air_travel",
  "dragon_riding",
  "griffin_riding",
  "teleportation_network",
  "portal_system",
  "magical_transit",
  "floating_ships",
  "starships",
  "jump_gates",
  "wormhole_network",
  "orbital_shuttles",
  "hover_vehicles",
  "flying_cars",
  "trade_routes",
  "pilgrimage_routes",
  "military_roads",
  "frontier_trails",
  "smuggling_routes",
  "nomadic_paths",
];

export const communicationSystemSeeds = [
  "oral_tradition",
  "messenger_network",
  "postal_service",
  "printing_press",
  "newspapers",
  "radio",
  "television",
  "internet",
  "social_media",
  "magic_messaging",
  "scrying_network",
  "telepathic_network",
  "crystal_communication",
  "sending_spells",
  "spirit_messengers",
  "quantum_communication",
  "neural_networks",
  "AI_assistants",
  "holographic_media",
  "state_media",
  "independent_press",
  "corporate_media",
  "community_media",
  "propaganda_system",
  "free_press",
  "censorship",
  "encrypted_communications",
  "underground_media",
  "whisper_networks",
];

export const educationSystemSeeds = [
  "public_education",
  "private_education",
  "religious_education",
  "guild_apprenticeships",
  "family_training",
  "self_education",
  "elite_academies",
  "universal_literacy",
  "boarding_schools",
  "universities",
  "trade_schools",
  "military_academies",
  "magic_academies",
  "research_institutes",
  "mandatory_education",
  "optional_education",
  "lifelong_learning",
  "competitive_exams",
  "merit_scholarships",
  "mentor_based_learning",
  "community_teaching",
  "AI_tutors",
  "virtual_education",
  "oral_teaching_tradition",
  "archive_learning",
  "field_training",
  "practical_learning",
  "classical_curriculum",
  "specialized_training",
];

export const foodCultureSeeds = [
  "communal_meals",
  "family_style_dining",
  "formal_banquets",
  "street_food_culture",
  "market_food_culture",
  "home_cooking_culture",
  "restaurant_culture",
  "bread_staple",
  "rice_staple",
  "noodle_staple",
  "root_crop_staple",
  "seafood_culture",
  "meat_heavy_diet",
  "plant_based_diet",
  "tea_culture",
  "coffee_culture",
  "wine_culture",
  "beer_culture",
  "ceremonial_drinks",
  "festival_foods",
  "seasonal_foods",
  "religious_food_rules",
  "hospitality_through_food",
  "food_as_social_status",
  "shared_table_customs",
  "luxury_cuisine",
  "survival_cuisine",
  "fusion_cuisine",
  "colonial_food_influences",
  "regional_specialties",
  "ancestral_recipes",
];

export const clothingNormSeeds = [
  "formal_dress_culture",
  "casual_dress_culture",
  "uniform_society",
  "class_based_clothing",
  "occupation_based_clothing",
  "religious_clothing",
  "ceremonial_clothing",
  "modest_clothing_norms",
  "expressive_clothing_norms",
  "practical_clothing_norms",
  "luxury_clothing_norms",
  "fashion_conscious_society",
  "anti_fashion_society",
  "robes",
  "tunics",
  "suits",
  "military_uniforms",
  "guild_uniforms",
  "academic_robes",
  "court_fashion",
  "streetwear",
  "workwear",
  "seasonal_clothing",
  "regional_clothing",
  "status_signaling_clothing",
  "symbolic_colors",
  "family_crest_clothing",
  "magical_clothing",
  "protective_clothing",
  "smart_fabrics",
  "adaptive_clothing",
  "gender_neutral_clothing",
];

export const worldLoreConflictSeeds = [
  "magic_regulation_debate",
  "healthcare_inequality",
  "transport_monopoly",
  "media_censorship",
  "education_access_gap",
  "food_shortage",
  "fashion_as_status_war",
  "religion_vs_science",
  "tradition_vs_progress",
  "class_conflict",
  "guild_vs_state",
  "corporation_vs_citizens",
  "frontier_vs_capital",
  "public_good_vs_private_power",
  "cultural_assimilation_pressure",
  "migration_changes_society",
  "technology_disrupts_tradition",
  "magic_disrupts_law",
  "scarcity_changes_values",
  "new_world_order",
];

export const highValueWorldLoreSeeds = [
  "hard_magic_system",
  "bloodline_magic",
  "licensed_magic",
  "common_law",
  "restorative_justice",
  "universal_healthcare",
  "healing_magic",
  "public_transit",
  "teleportation_network",
  "internet",
  "magic_messaging",
  "public_education",
  "guild_apprenticeships",
  "communal_meals",
  "street_food_culture",
  "tea_culture",
  "formal_dress_culture",
  "court_fashion",
  "tradition_vs_progress",
  "class_conflict",
];

const WORLD_LORE_EXPANSION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "world_lore_archetype",
    guidance: WORLD_LORE_EXPANSION_GUIDANCE,
    values: worldLoreExpansionPresets,
  },
  {
    category: "World Lore Seed",
    prefix: "world_lore_seed",
    guidance:
      "Use this as broad worldbuilding vocabulary. System-level lore can shape customs, logistics, resources, public pressure, infrastructure, and everyday detail without becoming a lecture.",
    values: worldLoreSeeds,
  },
  {
    category: "Magic System",
    prefix: "world_lore_magic",
    guidance:
      "Use this as magic-system texture. Magic laws, costs, sources, training, regulation, professions, secrecy, and forbidden practices should add constraints without forcing outcomes.",
    values: magicSystemSeeds,
  },
  {
    category: "Law & Legal System",
    prefix: "world_lore_legal",
    guidance:
      "Use this as fictional legal-system texture, not real legal advice. Law can shape rights, privilege, punishment, courts, privacy, surveillance, and conflict without endorsing any system.",
    values: legalSystemSeeds,
  },
  {
    category: "Health & Medicine",
    prefix: "world_lore_health",
    guidance:
      "Use this as fictional health and medicine texture, not real medical advice. Care systems can shape access, class, trauma support, research, public health, and crisis stakes.",
    values: healthMedicineSeeds,
  },
  {
    category: "Transport System",
    prefix: "world_lore_transport",
    guidance:
      "Use this as transport-system texture. Movement, routes, vehicles, portals, roads, stations, trails, smuggling, and transit can create distance, access, danger, or reunion stakes.",
    values: transportSystemSeeds,
  },
  {
    category: "Media & Communication",
    prefix: "world_lore_communication",
    guidance:
      "Use this as media and communication texture. Information channels, censorship, propaganda, networks, encryption, messengers, and press freedom can shape secrecy and public stakes.",
    values: communicationSystemSeeds,
  },
  {
    category: "Education System",
    prefix: "world_lore_education",
    guidance:
      "Use this as education-system texture. Schools, apprenticeships, exams, literacy, mentors, archives, field learning, and access gaps can shape skill, class, ambition, and belonging.",
    values: educationSystemSeeds,
  },
  {
    category: "Food Culture",
    prefix: "world_lore_food",
    guidance:
      "Use this as food-culture texture. Meals, staples, drinks, festivals, hospitality, status, scarcity, regional identity, and ancestral recipes can make daily life feel embodied.",
    values: foodCultureSeeds,
  },
  {
    category: "Clothing Norm",
    prefix: "world_lore_clothing",
    guidance:
      "Use this as clothing-norm texture. Dress codes, uniforms, status signals, practical clothing, fashion, colours, fabrics, and symbolic garments can show culture without flattening identity.",
    values: clothingNormSeeds,
  },
  {
    category: "Lore Conflict",
    prefix: "world_lore_conflict",
    guidance:
      "Use this as world-lore conflict texture. Systems can create pressure through regulation, inequality, censorship, access gaps, scarcity, class, migration, technology, tradition, and public power.",
    values: worldLoreConflictSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "world_lore_high_value",
    guidance:
      "Use this as a high-signal world lore seed for setting design, lorebook entries, route planning, and preset search.",
    values: highValueWorldLoreSeeds,
  },
] satisfies readonly WorldLoreExpansionSeedGroup[]);

function normalizeReadableWorldLoreExpansionValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Aa]rtifact(s?)\b/g, (_match, plural: string) =>
      plural ? "artefacts" : "artefact",
    )
    .replace(/\b[Ll]abor\b/g, (match) => (match === "Labor" ? "Labour" : "labour"))
    .replace(/\b[Cc]enter(s?)\b/g, (match, plural: string) => {
      const replacement = plural ? "centres" : "centre";
      return match[0] === "C" ? `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}` : replacement;
    })
    .replace(/\b[Cc]olor(s?)\b/g, (match, plural: string) => {
      const replacement = plural ? "colours" : "colour";
      return match[0] === "C" ? `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}` : replacement;
    })
    .replace(/\b[Ss]pecialized\b/g, (match) =>
      match === "Specialized" ? "Specialised" : "specialised",
    )
    .replace(/\b[Cc]ivilization\b/g, (match) =>
      match === "Civilization" ? "Civilisation" : "civilisation",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyWorldLoreExpansion(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeWorldLoreExpansionPreset(
  group: WorldLoreExpansionSeedGroup,
  rawValue: string,
): WorldLoreExpansionPreset {
  const value = normalizeReadableWorldLoreExpansionValue(rawValue);

  return {
    id: `${group.prefix}_${slugifyWorldLoreExpansion(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyWorldLoreExpansion(value),
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

export const WORLD_LORE_EXPANSION_PRESETS = WORLD_LORE_EXPANSION_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeWorldLoreExpansionPreset(group, value)),
);

export const WORLD_LORE_EXPANSION_PRESET_CATEGORIES = Array.from(
  new Set(WORLD_LORE_EXPANSION_PRESETS.map((preset) => preset.category)),
).sort();

export const getWorldLoreExpansionPresetsByCategory = (
  category: WorldLoreExpansionPresetCategory,
) => WORLD_LORE_EXPANSION_PRESETS.filter((preset) => preset.category === category);

export const findWorldLoreExpansionPresetById = (id: string) =>
  WORLD_LORE_EXPANSION_PRESETS.find((preset) => preset.id === id);

export const compileWorldLoreExpansionPresetAdditions = (
  preset: WorldLoreExpansionPreset,
): CompiledWorldLoreExpansionPresetAdditions => ({
  backgroundAddition: `World lore context: ${preset.value}. ${preset.guidance}`,
  scenarioAddition: `Worldbuilding texture may include ${preset.value} without replacing character agency, scene stakes, relationship pacing, or the value of ordinary lived detail.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft world lore context.`,
    "Let systems, customs, infrastructure, class, law, health, media, education, food, clothing, magic, technology, and daily life shape setting pressure only when relevant.",
    "Preserve {{user}} agency, avoid infodumps, and do not treat fictional law, medicine, politics, scarcity, surveillance, or inequality as real-world advice or endorsement.",
  ].join(" "),
});
