import {
  createActsOfServiceSeedPreset,
  createVocabularySeedPreset,
  type ActsOfServiceSeed as RichActsOfServiceSeed,
  type ActsOfServiceSeedMetadata,
  type ActsOfServiceSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const actsOfServiceSeeds = [
  "acts_of_service",
  "service_as_love",
  "quiet_devotion",
  "practical_care",
  "thoughtful_help",
  "anticipates_needs",
  "remembers_preferences",
  "makes_life_easier",
  "helps_without_being_asked",
  "shows_love_through_action",

  "cooks_for_partner",
  "bakes_for_partner",
  "makes_breakfast",
  "packs_lunch",
  "makes_tea",
  "makes_coffee",
  "brings_water",
  "brings_medicine",
  "makes_soup_when_sick",
  "saves_last_bite",

  "runs_errands",
  "does_groceries",
  "picks_up_favorite_snacks",
  "handles_chores",
  "does_laundry",
  "folds_clothes",
  "cleans_room",
  "washes_dishes",
  "tidies_after_stress",
  "fixes_broken_things",

  "walks_partner_home",
  "drives_partner_places",
  "waits_until_they_get_inside",
  "carries_heavy_bags",
  "holds_umbrella",
  "offers_jacket",
  "opens_doors",
  "saves_seat",
  "charges_phone",
  "keeps_spare_key",

  "checks_in_daily",
  "reminds_to_eat",
  "reminds_to_sleep",
  "reminds_to_rest",
  "helps_with_schedule",
  "organizes_tasks",
  "takes_over_when_overwhelmed",
  "protects_time",
  "handles_social_pressure",
  "buffers_from_stress",

  "prepares_comfort_items",
  "brings_blanket",
  "warms_hands",
  "sets_up_safe_space",
  "dims_lights",
  "lowers_noise",
  "makes_bed",
  "stays_near_during_panic",
  "grounds_through_routine",
  "creates_calm_environment",

  "researches_problem",
  "solves_practical_issue",
  "handles_paperwork",
  "makes_phone_calls",
  "keeps_emergency_supplies",
  "plans_route",
  "prepares_backup_plan",
  "remembers_deadlines",
  "keeps_promises",
  "follows_through",

  "service_after_conflict",
  "apology_through_action",
  "repair_through_help",
  "consistency_as_repair",
  "changed_behavior_as_service",
  "shows_up_reliably",
  "proves_care_over_time",
  "does_not_make_care_transactional",
  "helps_without_control",
  "respects_autonomy_while_helping",

  "caretaker_service",
  "protective_service",
  "domestic_service",
  "romantic_service",
  "devotional_service",
  "practical_service",
  "silent_service",
  "ritualized_service",
  "emergency_service",
  "everyday_service",
] as const;

export const actsOfServicePresets = [
  "Quiet Devotion",
  "Practical Caregiver",
  "Domestic Acts of Love",
  "Protective Service",
  "Caretaker Partner",
  "Remembers Everything",
  "Makes Life Easier",
  "Service as Apology",
  "Service as Reassurance",
  "Reliable Helper",
  "Soft Domestic Romantic",
  "Emergency Prepared Partner",
  "Tea and Blanket Care",
  "Cooks When Worried",
  "Fixes Things as Love",
  "Handles What Overwhelms You",
  "Shows Up Without Being Asked",
  "Consistency Over Grand Gestures",
  "Acts Over Words",
  "Devotion in Small Things",
] as const;

export const highValueActsOfServiceSeeds = [
  "acts_of_service",
  "service_as_love",
  "quiet_devotion",
  "anticipates_needs",
  "remembers_preferences",
  "helps_without_being_asked",
  "cooks_for_partner",
  "makes_tea",
  "brings_medicine",
  "runs_errands",
  "handles_chores",
  "walks_partner_home",
  "checks_in_daily",
  "reminds_to_eat",
  "takes_over_when_overwhelmed",
  "prepares_comfort_items",
  "service_after_conflict",
  "consistency_as_repair",
  "helps_without_control",
  "devotional_service",
] as const;

export type ActsOfServiceSeedId = typeof actsOfServiceSeeds[number];

export type ActsOfServiceCategory =
  | "core"
  | "food_and_drink"
  | "domestic_help"
  | "protective_practicality"
  | "daily_care"
  | "comfort_environment"
  | "problem_solving"
  | "repair_service"
  | "service_style";

const actsOfServiceCategories = {
  core: actsOfServiceSeeds.slice(0, 10),
  food_and_drink: actsOfServiceSeeds.slice(10, 20),
  domestic_help: actsOfServiceSeeds.slice(20, 30),
  protective_practicality: actsOfServiceSeeds.slice(30, 40),
  daily_care: actsOfServiceSeeds.slice(40, 50),
  comfort_environment: actsOfServiceSeeds.slice(50, 60),
  problem_solving: actsOfServiceSeeds.slice(60, 70),
  repair_service: actsOfServiceSeeds.slice(70, 80),
  service_style: actsOfServiceSeeds.slice(80, 90),
} as const satisfies Record<ActsOfServiceCategory, readonly ActsOfServiceSeedId[]>;

export const actsOfServiceSeedCategories = Object.freeze(actsOfServiceCategories);

const categoryProfiles = {
  core: {
    tag: "love_language",
    description:
      "Treats practical action as a quiet way to make care visible without demanding praise.",
    example:
      "They noticed what would make the day easier and handled it before it became another burden.",
    romanceHook: "quiet_service_as_affection",
    scenarioHook: "small_task_becomes_intimate",
    serviceType: "devotional",
  },
  food_and_drink: {
    tag: "food_care",
    description:
      "Uses food, drink, and small nourishment rituals to say what they may not say directly.",
    example:
      "They left something warm within reach and pretended it was not tenderness.",
    romanceHook: "nourishment_as_affection",
    scenarioHook: "shared_meal_care_scene",
    serviceType: "domestic",
  },
  domestic_help: {
    tag: "domestic_care",
    description:
      "Turns ordinary chores into a steady form of relief, presence, and domestic trust.",
    example:
      "They took over the household task quietly so the other person could breathe.",
    romanceHook: "domestic_slow_burn",
    scenarioHook: "chore_becomes_caretaking",
    serviceType: "domestic",
  },
  protective_practicality: {
    tag: "protective_care",
    description:
      "Shows affection through practical protection, safe passage, and small prepared safeguards.",
    example:
      "They made sure the way home, the weather, and the waiting were all accounted for.",
    romanceHook: "protective_service_romance",
    scenarioHook: "safe_return_care_scene",
    serviceType: "protective",
  },
  daily_care: {
    tag: "routine_care",
    description:
      "Builds love through repeatable check-ins, reminders, and gentle support for daily needs.",
    example:
      "They remembered the fragile part of the routine and protected it without making a scene.",
    romanceHook: "routine_becomes_love",
    scenarioHook: "daily_check_in_scene",
    serviceType: "caretaking",
  },
  comfort_environment: {
    tag: "comfort_care",
    description:
      "Creates a calmer physical environment so safety can be felt before it has to be explained.",
    example:
      "They adjusted the room first, giving comfort a place to land.",
    romanceHook: "safe_space_intimacy",
    scenarioHook: "comfort_setup_scene",
    serviceType: "caretaking",
  },
  problem_solving: {
    tag: "practical_support",
    description:
      "Handles logistics, research, and follow-through so care becomes reliable in the real world.",
    example:
      "They solved the practical problem and left the emotional meaning unforced but unmistakable.",
    romanceHook: "competence_as_caretaking",
    scenarioHook: "logistics_as_love_scene",
    serviceType: "practical",
  },
  repair_service: {
    tag: "repair",
    description:
      "Uses changed behavior and steady follow-through to repair harm without asking service to replace accountability.",
    example:
      "They did the work differently this time, not as a performance but as proof they had listened.",
    romanceHook: "service_as_repair",
    scenarioHook: "post_conflict_follow_through",
    serviceType: "repair",
  },
  service_style: {
    tag: "service_style",
    description:
      "Defines the emotional flavor of service, from domestic steadiness to devotional reliability.",
    example:
      "Their affection had a pattern: practical, quiet, and difficult to mistake once noticed.",
    romanceHook: "service_style_recognized",
    scenarioHook: "love_language_discovery_scene",
    serviceType: "devotional",
  },
} as const satisfies Record<
  ActsOfServiceCategory,
  {
    tag: string;
    description: string;
    example: string;
    romanceHook: string;
    scenarioHook: string;
    serviceType: ActsOfServiceSeedType;
  }
>;

type ActsOfServiceProfile = typeof categoryProfiles[ActsOfServiceCategory];

type ActsOfServiceOverride = Partial<
  Omit<RichActsOfServiceSeed, "seed" | "label" | "metadata">
> & {
  metadata?: Partial<ActsOfServiceSeedMetadata>;
};

const seedCategoryLookup = new Map<ActsOfServiceSeedId, ActsOfServiceCategory>(
  Object.entries(actsOfServiceSeedCategories).flatMap(([category, seeds]) =>
    seeds.map((seed) => [seed, category as ActsOfServiceCategory]),
  ),
);

const ACTS_OF_SERVICE_OVERRIDES: Partial<
  Record<ActsOfServiceSeedId, ActsOfServiceOverride>
> = {
  makes_tea: {
    description:
      "Expresses care by preparing a comforting drink, often when words feel inadequate.",
    examples: [
      "Makes tea after a difficult day.",
      "Appears with a mug before asking questions.",
      "Learns exactly how someone takes their tea.",
    ],
    tags: ["comfort", "domestic", "caretaking", "soft_romance"],
    relatedSeeds: ["prepares_comfort_items", "checks_in_daily", "quiet_devotion"],
    oppositeSeeds: ["emotional_avoidance", "neglect"],
    romanceHooks: ["tea_after_argument", "comfort_without_words", "domestic_slow_burn"],
    scenarioHooks: ["rainy_day_scene", "sick_day_scene", "late_night_conversation"],
    dialoguePatterns: [
      "Drink this first.",
      "You always forget tea when you're upset.",
      "I already knew how you take it.",
    ],
    serviceType: "domestic",
    emotionalMeaning: "I noticed your discomfort and wanted to ease it.",
    hiddenMotivation: "Caring feels safer than vulnerability.",
    fantasyFulfillment: "Someone notices your needs before you ask.",
    activatedBy: ["user_is_tired", "user_is_upset", "conflict_aftermath"],
    associatedWounds: ["emotional_neglect_wound", "conditional_love_wound"],
    associatedFears: ["fear_of_vulnerability", "fear_of_not_being_needed"],
    associatedDesires: [
      "desire_to_be_useful",
      "desire_for_connection",
      "desire_to_care_for_someone",
    ],
    visibleBehaviors: ["appears_with_tea", "remembers_preference", "offers_warm_drink"],
    escalationPath: [
      "makes_tea",
      "brings_food",
      "creates_comfort_routines",
      "becomes_emotional_safe_place",
    ],
    relationshipEffects: [
      "builds_trust",
      "creates_domestic_intimacy",
      "reinforces_care_pattern",
    ],
    conflictEffects: ["softens_arguments", "signals_desire_to_repair"],
    intimacyEffects: ["creates_safe_vulnerability", "encourages_opening_up"],
    canBecomeUnhealthyAs: [
      "using_care_to_avoid_emotional_conversation",
      "caretaker_identity_dependence",
    ],
    healingVersion:
      "Offers comfort while still encouraging honest communication.",
    routeGates: ["first_comfort_drink_gate", "first_domestic_ritual_gate"],
    growthArcs: ["learns_to_care_and_speak", "receives_care_in_return"],
    metadata: {
      romanceValue: 9,
      intimacyValue: 8,
      healingValue: 10,
      conflictPotential: 2,
    },
  },
  walks_partner_home: {
    serviceType: "protective",
    emotionalMeaning: "Your safety matters to me.",
    hiddenMotivation: "Protectiveness is easier than saying I care.",
    fantasyFulfillment: "Someone quietly prioritizes your wellbeing.",
    associatedWounds: ["never_protected_wound", "abandonment_wound"],
    associatedFears: ["fear_of_losing_loved_ones"],
    associatedDesires: ["desire_to_protect", "desire_to_be_needed"],
    romanceHooks: [
      "walks_on_street_side",
      "lingers_at_doorway",
      "waits_until_lights_turn_on",
    ],
  },
};

export const ACTS_OF_SERVICE_SEED_PRESETS = Object.freeze(
  actsOfServiceSeeds.map((seed) => createActsOfServiceRichSeed(seed)),
) satisfies readonly RichActsOfServiceSeed[];

export const ACTS_OF_SERVICE_VOCABULARY_SEEDS = Object.freeze(
  ACTS_OF_SERVICE_SEED_PRESETS.map(toStandardVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getActsOfServiceSeedPresetsByCategory(
  category: ActsOfServiceCategory,
): readonly RichActsOfServiceSeed[] {
  const seedIds = new Set(actsOfServiceSeedCategories[category]);
  return ACTS_OF_SERVICE_SEED_PRESETS.filter((seed) =>
    seedIds.has(seed.seed as ActsOfServiceSeedId),
  );
}

export function getActsOfServiceVocabularySeedsByCategory(
  category: ActsOfServiceCategory,
): readonly VocabularySeedPreset[] {
  const seedIds = new Set(actsOfServiceSeedCategories[category]);
  return ACTS_OF_SERVICE_VOCABULARY_SEEDS.filter((seed) =>
    seedIds.has(seed.seed as ActsOfServiceSeedId),
  );
}

export function findActsOfServiceSeedPresetBySeed(
  seedId: string,
): RichActsOfServiceSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return ACTS_OF_SERVICE_SEED_PRESETS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function findActsOfServiceVocabularySeedBySeed(
  seedId: string,
): VocabularySeedPreset | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return ACTS_OF_SERVICE_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function createActsOfServiceRichSeed(
  seed: ActsOfServiceSeedId,
): RichActsOfServiceSeed {
  const category = seedCategoryLookup.get(seed) ?? "core";
  const profile = categoryProfiles[category];
  const label = toLabel(seed);
  const highValue = (highValueActsOfServiceSeeds as readonly string[]).includes(seed);
  const override = ACTS_OF_SERVICE_OVERRIDES[seed] ?? {};

  return createActsOfServiceSeedPreset({
    seed,
    label,
    description: override.description ?? `${profile.description} Cue: ${toCue(seed)}.`,
    examples: override.examples ?? [
      profile.example,
      `${label} works best when the help is offered cleanly, with room for refusal and no hidden debt.`,
    ],
    tags: uniqueText([
      "acts_of_service",
      "love_language",
      "service",
      "care",
      category,
      profile.tag,
      ...(highValue ? ["high_value"] : []),
      ...(override.tags ?? []),
    ]),
    relatedSeeds: uniqueText([
      "service_as_love",
      "quiet_devotion",
      "practical_care",
      profile.romanceHook,
      ...(category === "repair_service" ? ["accountability_repair", "changed_behavior_repair"] : []),
      ...(category === "comfort_environment" ? ["safe_space_intimacy"] : []),
      ...(override.relatedSeeds ?? []),
    ]),
    oppositeSeeds: override.oppositeSeeds ?? [
      "care_as_control",
      "transactional_help",
      "forced_forgiveness",
      "performative_service",
    ],
    romanceHooks: uniqueText([
      profile.romanceHook,
      "devotion_in_small_things",
      "acts_over_words",
      ...(highValue ? ["love_recognized_through_action"] : []),
      ...(override.romanceHooks ?? []),
    ]),
    scenarioHooks: uniqueText([
      profile.scenarioHook,
      "service_without_being_asked",
      "care_with_autonomy_respected",
      ...(override.scenarioHooks ?? []),
    ]),
    dialoguePatterns: override.dialoguePatterns ?? [
      "I noticed it needed doing.",
      "You do not owe me for being cared for.",
      "Let me make this one thing easier.",
    ],
    serviceType: override.serviceType ?? inferServiceType(seed, profile),
    emotionalMeaning: override.emotionalMeaning ?? defaultEmotionalMeaning(label, category),
    hiddenMotivation: override.hiddenMotivation ?? defaultHiddenMotivation(category),
    fantasyFulfillment: override.fantasyFulfillment ?? defaultFantasyFulfillment(category),
    activatedBy: override.activatedBy ?? defaultActivatedBy(category),
    associatedWounds: override.associatedWounds ?? defaultAssociatedWounds(category),
    associatedFears: override.associatedFears ?? defaultAssociatedFears(category),
    associatedDesires: override.associatedDesires ?? defaultAssociatedDesires(category),
    visibleBehaviors: override.visibleBehaviors ?? defaultVisibleBehaviors(seed),
    escalationPath: override.escalationPath ?? defaultEscalationPath(seed, category),
    relationshipEffects: override.relationshipEffects ?? defaultRelationshipEffects(category),
    conflictEffects: override.conflictEffects ?? defaultConflictEffects(category),
    intimacyEffects: override.intimacyEffects ?? defaultIntimacyEffects(category),
    canBecomeUnhealthyAs: override.canBecomeUnhealthyAs ?? defaultUnhealthyRisks(category),
    healingVersion: override.healingVersion ?? defaultHealingVersion(category),
    routeGates: override.routeGates ?? defaultRouteGates(seed, category),
    growthArcs: override.growthArcs ?? defaultGrowthArcs(category),
    metadata: {
      romanceValue: highValue ? 9 : 7,
      intimacyValue: highValue ? 8 : 6,
      healingValue: category === "repair_service" || category === "comfort_environment"
        ? 9
        : 7,
      conflictPotential: category === "repair_service" ? 7 : 4,
      ...override.metadata,
    },
  });
}

function toStandardVocabularySeed(seed: RichActsOfServiceSeed): VocabularySeedPreset {
  const highValue = (highValueActsOfServiceSeeds as readonly string[]).includes(seed.seed);

  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Emotional meaning: ${seed.emotionalMeaning}`,
      `Hidden motivation: ${seed.hiddenMotivation}`,
      `Healing version: ${seed.healingVersion}`,
    ].join(" "),
    examples: [
      ...seed.examples,
      `Fantasy fulfilment: ${seed.fantasyFulfillment}`,
    ],
    tags: [
      ...seed.tags,
      seed.serviceType,
      `service_type:${seed.serviceType}`,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.associatedWounds,
      ...seed.associatedFears,
      ...seed.associatedDesires,
    ],
    oppositeSeeds: [
      ...seed.oppositeSeeds,
      ...seed.canBecomeUnhealthyAs,
    ],
    romanceHooks: seed.romanceHooks,
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.activatedBy,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: highValue ? "common" : "uncommon",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function inferServiceType(
  seed: ActsOfServiceSeedId,
  profile: ActsOfServiceProfile,
): ActsOfServiceSeedType {
  if (seed === "ritualized_service") {
    return "ritual";
  }
  if (seed === "emergency_service" || /emergency|medicine|supplies/.test(seed)) {
    return "emergency";
  }
  if (/paperwork|phone_calls|deadline|schedule|organizes|route|backup_plan/.test(seed)) {
    return "administrative";
  }
  if (/devotional|quiet_devotion|service_as_love/.test(seed)) {
    return "devotional";
  }
  return profile.serviceType;
}

function defaultEmotionalMeaning(
  label: string,
  category: ActsOfServiceCategory,
): string {
  switch (category) {
    case "protective_practicality":
      return `${label} means their safety and comfort were worth planning for.`;
    case "repair_service":
      return `${label} means apology has to become visible through changed behavior.`;
    case "comfort_environment":
      return `${label} means easing the body first can make honesty possible later.`;
    case "daily_care":
      return `${label} means care is something repeated, remembered, and kept.`;
    default:
      return `${label} makes affection practical enough to be trusted.`;
  }
}

function defaultHiddenMotivation(category: ActsOfServiceCategory): string {
  switch (category) {
    case "repair_service":
      return "They want the other person to feel the repair without being asked to forgive too quickly.";
    case "protective_practicality":
      return "Protectiveness feels safer than admitting how much they would miss them.";
    case "problem_solving":
      return "Solving the practical issue lets them stay useful when direct tenderness feels exposed.";
    case "comfort_environment":
      return "They trust a calmer room to say the first gentle thing for them.";
    default:
      return "Action feels safer than asking directly to be needed.";
  }
}

function defaultFantasyFulfillment(category: ActsOfServiceCategory): string {
  switch (category) {
    case "domestic_help":
      return "A shared life where ordinary tasks become proof that no one is carrying everything alone.";
    case "food_and_drink":
      return "Someone notices hunger, exhaustion, or comfort needs before they have to be named.";
    case "protective_practicality":
      return "Someone quietly chooses your wellbeing in the small logistics of the day.";
    case "repair_service":
      return "An apology that keeps showing up after the emotional scene ends.";
    default:
      return "Care that arrives as a useful, steady act rather than a dramatic promise.";
  }
}

function defaultActivatedBy(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["conflict_aftermath", "broken_promise", "trust_needs_rebuilding"];
    case "comfort_environment":
      return ["user_is_overwhelmed", "panic_rising", "stressful_environment"];
    case "protective_practicality":
      return ["late_night_departure", "unsafe_route", "bad_weather"];
    case "daily_care":
      return ["missed_meal", "exhaustion", "overfull_schedule"];
    default:
      return ["user_is_tired", "need_is_noticed", "quiet_care_opportunity"];
  }
}

function defaultAssociatedWounds(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["broken_trust_wound", "unrepaired_harm_wound"];
    case "protective_practicality":
      return ["never_protected_wound", "unsafe_alone_wound"];
    case "comfort_environment":
      return ["emotional_neglect_wound", "touch_starvation_wound"];
    default:
      return ["conditional_love_wound", "emotional_neglect_wound"];
  }
}

function defaultAssociatedFears(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["fear_of_not_being_forgiven", "fear_of_repeating_harm"];
    case "problem_solving":
      return ["fear_of_uselessness", "fear_of_vulnerability"];
    case "protective_practicality":
      return ["fear_of_losing_loved_ones", "fear_of_not_protecting_enough"];
    default:
      return ["fear_of_not_being_needed", "fear_of_vulnerability"];
  }
}

function defaultAssociatedDesires(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["desire_to_make_amends", "desire_for_trust_to_return"];
    case "domestic_help":
      return ["desire_to_build_home", "desire_for_shared_life"];
    case "comfort_environment":
      return ["desire_to_create_safety", "desire_to_soothe"];
    default:
      return ["desire_to_be_useful", "desire_to_care_for_someone"];
  }
}

function defaultVisibleBehaviors(seed: ActsOfServiceSeedId): readonly string[] {
  return [
    seed,
    `${seed}_without_announcement`,
    `${seed}_with_attention_to_preference`,
  ];
}

function defaultEscalationPath(
  seed: ActsOfServiceSeedId,
  category: ActsOfServiceCategory,
): readonly string[] {
  return [
    seed,
    `${category}_pattern_repeats`,
    "care_becomes_recognizable",
    "service_turns_into_trust",
  ];
}

function defaultRelationshipEffects(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["rebuilds_trust", "makes_accountability_visible"];
    case "daily_care":
      return ["creates_reliable_presence", "builds_domestic_familiarity"];
    default:
      return ["builds_trust", "makes_affection_observable"];
  }
}

function defaultConflictEffects(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["supports_repair", "fails_if_used_instead_of_apology"];
    case "protective_practicality":
      return ["can_be_misread_as_control", "needs_clear_autonomy"];
    default:
      return ["softens_tension", "can_hide_needed_conversation"];
  }
}

function defaultIntimacyEffects(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "domestic_help":
    case "food_and_drink":
      return ["creates_domestic_intimacy", "makes_care_feel_lived_in"];
    case "comfort_environment":
      return ["supports_safe_vulnerability", "grounds_the_body_before_talk"];
    default:
      return ["encourages_trust", "turns_attention_into_closeness"];
  }
}

function defaultUnhealthyRisks(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "protective_practicality":
      return ["overprotection", "help_used_as_control"];
    case "repair_service":
      return ["service_used_to_skip_accountability", "forced_forgiveness"];
    default:
      return ["overgiving", "care_becoming_transactional"];
  }
}

function defaultHealingVersion(category: ActsOfServiceCategory): string {
  switch (category) {
    case "repair_service":
      return "Pairs practical follow-through with explicit accountability and patience.";
    case "protective_practicality":
      return "Offers help while preserving choice, privacy, and the right to refuse.";
    default:
      return "Lets care be useful without turning it into debt, control, or avoidance.";
  }
}

function defaultRouteGates(
  seed: ActsOfServiceSeedId,
  category: ActsOfServiceCategory,
): readonly string[] {
  return [
    `first_${seed}_gate`,
    `${category}_recognized_gate`,
    "service_received_without_debt_gate",
  ];
}

function defaultGrowthArcs(category: ActsOfServiceCategory): readonly string[] {
  switch (category) {
    case "repair_service":
      return ["learns_accountability_over_performance", "repairs_through_consistency"];
    case "problem_solving":
      return ["learns_to_help_and_feel", "accepts_care_cannot_solve_everything"];
    default:
      return ["learns_to_name_the_care", "receives_care_in_return"];
  }
}

function toCue(seed: string): string {
  return seed.replaceAll("_", " ");
}

function toLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function uniqueText(values: readonly string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
