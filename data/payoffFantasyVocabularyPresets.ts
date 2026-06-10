import {
  createPayoffFantasySeedPreset,
  createVocabularySeedPreset,
  type PayoffFantasySeed,
  type PayoffFantasySeedInput,
  type PayoffFantasySeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const payoffFantasySemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Relationship Dynamic",
  "Romance Trope",
  "Route Phase",
  "Conflict Beat",
  "Repair Beat",
  "Growth Arc",
  "Payoff Fantasy",
  "Relationship Identity",
  "Ending Flavor",
] as const;

export const payoffFantasyPresets = [
  "Chosen Above Everyone",
  "Loved Without Conditions",
  "Someone Finally Stays",
  "Safe Person Forever",
  "Home Is a Person",
  "Seen and Still Loved",
  "Understood Without Explaining",
  "Protected but Not Controlled",
  "Needed but Not Used",
  "Wanted Without Performance",
  "Devotion Without Possession",
  "Freedom Within Love",
  "Trust Rebuilt and Earned",
  "Second Chance That Works",
  "Enemy Chooses You",
  "Rival Respects You",
  "Fake Becomes Real",
  "Forbidden Love Wins",
  "Softness After Survival",
  "Peace After Chaos",
  "Rest After Overwork",
  "Belonging After Isolation",
  "Repair After Rupture",
  "Publicly Chosen",
  "Privately Known",
  "Forever Feels Safe",
  "Mutual Devotion",
  "Equal Partnership",
  "Domestic Happiness",
  "Earned Happy Ending",
] as const;

export const payoffFantasyExpansionLogic = {
  wound_to_payoff: {
    abandonment_wound: [
      "someone_finally_stays",
      "safe_person_forever",
      "home_is_a_person",
    ],
    rejection_wound: [
      "chosen_above_everyone",
      "publicly_chosen",
      "loved_without_conditions",
    ],
    emotional_neglect_wound: [
      "seen_and_still_loved",
      "understood_without_explaining",
      "wanted_without_performance",
    ],
    control_wound: [
      "protected_but_not_controlled",
      "freedom_within_love",
      "equal_partnership",
    ],
    betrayal_wound: [
      "trust_rebuilt_and_earned",
      "second_chance_that_works",
      "repair_after_rupture",
    ],
  },
  desire_to_payoff: {
    desire_to_be_chosen: [
      "chosen_above_everyone",
      "publicly_chosen",
      "mutual_devotion",
    ],
    desire_for_safety: [
      "safe_person_forever",
      "peace_after_chaos",
      "forever_feels_safe",
    ],
    desire_for_home: [
      "home_is_a_person",
      "domestic_happiness",
      "belonging_after_isolation",
    ],
    desire_for_autonomy: [
      "freedom_within_love",
      "equal_partnership",
      "protected_but_not_controlled",
    ],
  },
  trope_to_payoff: {
    enemies_to_lovers: [
      "enemy_chooses_you",
      "seen_and_still_loved",
      "trust_rebuilt_and_earned",
    ],
    fake_relationship: [
      "fake_becomes_real",
      "publicly_chosen",
      "wanted_without_performance",
    ],
    second_chance_romance: [
      "second_chance_that_works",
      "repair_after_rupture",
      "trust_rebuilt_and_earned",
    ],
    hurt_comfort: [
      "softness_after_survival",
      "safe_person_forever",
      "loved_without_conditions",
    ],
    slow_burn: [
      "earned_happy_ending",
      "forever_feels_safe",
      "mutual_devotion",
    ],
  },
} as const;

export const payoffFantasyCategories = {
  chosen: [
    "chosen_above_everyone",
    "publicly_chosen",
    "enemy_chooses_you",
    "fake_becomes_real",
  ],
  safety: [
    "someone_finally_stays",
    "safe_person_forever",
    "peace_after_chaos",
    "forever_feels_safe",
  ],
  belonging: [
    "home_is_a_person",
    "belonging_after_isolation",
    "privately_known",
  ],
  healing: [
    "loved_without_conditions",
    "seen_and_still_loved",
    "softness_after_survival",
    "rest_after_overwork",
  ],
  devotion: [
    "devotion_without_possession",
    "mutual_devotion",
  ],
  freedom: [
    "freedom_within_love",
  ],
  trust: [
    "trust_rebuilt_and_earned",
    "repair_after_rupture",
  ],
  recognition: [
    "understood_without_explaining",
    "needed_but_not_used",
    "wanted_without_performance",
  ],
  protection: [
    "protected_but_not_controlled",
  ],
  partnership: [
    "rival_respects_you",
    "equal_partnership",
  ],
  domestic: [
    "domestic_happiness",
    "earned_happy_ending",
  ],
  redemption: [
    "second_chance_that_works",
  ],
  victory: [
    "forbidden_love_wins",
  ],
} as const satisfies Record<PayoffFantasySeedType, readonly string[]>;

type PayoffFantasyOverride = Partial<PayoffFantasySeedInput> & {
  label?: string;
};

const PAYOFF_FANTASY_OVERRIDES: Record<string, PayoffFantasyOverride> = {
  chosen_above_everyone: {
    label: "Chosen Above Everyone",
    description:
      "The fantasy that, when forced to choose, the love interest clearly and deliberately chooses the character above alternatives, pressure, status, fear, or convenience.",
    examples: [
      "They choose the character publicly despite social consequences.",
      "They reject a rival or safer option.",
      "They make the relationship unmistakable.",
    ],
    tags: ["payoff_fantasy", "chosen", "devotion", "public_choice"],
    relatedSeeds: [
      "desire_to_be_chosen",
      "fear_of_replacement",
      "public_choice_phase",
      "devotional_dynamic",
    ],
    oppositeSeeds: [
      "chosen_last",
      "emotional_ambiguity",
      "secret_shame_dynamic",
    ],
    romanceHooks: [
      "public_choice_confession",
      "i_choose_you_scene",
      "no_more_hiding",
    ],
    scenarioHooks: [
      "rival_forces_choice",
      "family_vs_love_choice",
      "public_scandal_choice",
    ],
    dialoguePatterns: [
      "I choose you.",
      "Not because it is easy. Because it is true.",
      "Let them see. I am done hiding what matters.",
    ],
    payoffType: "chosen",
    fulfillsDesires: [
      "desire_to_be_chosen",
      "desire_to_be_prioritized",
      "desire_for_devotion",
    ],
    resolvesFears: [
      "fear_of_replacement",
      "fear_of_being_chosen_last",
      "fear_of_being_settled_for",
    ],
    healsWounds: [
      "rejection_wound",
      "replacement_wound",
      "never_chosen_wound",
    ],
    compatibleTropes: [
      "fake_relationship",
      "love_triangle",
      "forbidden_romance",
      "royalty_commoner",
      "second_chance_romance",
    ],
    compatibleDynamics: [
      "chosen_person_dynamic",
      "devotional_dynamic",
      "equal_partners_dynamic",
    ],
    compatibleGrowthArcs: [
      "learning_to_be_loved",
      "learning_they_are_enough",
      "learning_to_receive_devotion",
    ],
    requiredRoutePhases: [
      "emotional_investment",
      "crisis_or_choice",
      "confession_or_escalation",
      "integration_phase",
    ],
    payoffScenes: [
      "public_side_taken_scene",
      "rival_rejected_scene",
      "family_defied_scene",
      "relationship_named_scene",
    ],
    emotionalProofs: [
      "choice_has_cost",
      "choice_is_clear",
      "choice_is_repeated",
      "choice_respects_agency",
    ],
    endingFlavors: [
      "earned_happy_ending",
      "public_relationship",
      "devotional_partnership",
    ],
    antiPatterns: [
      "choice_used_as_ownership",
      "public_claim_without_private_respect",
      "jealousy_romanticized_as_control",
    ],
    routeGates: [
      "first_priority_gate",
      "public_choice_gate",
      "chosen_without_competing_gate",
    ],
    milestoneMemories: [
      "first_public_choice_memory",
      "chosen_above_others_memory",
    ],
    metadata: {
      category: "payoff_fantasy",
      intensity: "high",
      comfortValue: 9,
      romanceValue: 10,
      healingValue: 10,
      catharsisValue: 10,
    },
  },
  loved_without_conditions: {
    payoffType: "healing",
    fulfillsDesires: ["desire_for_unconditional_love", "desire_to_be_enough"],
    resolvesFears: ["fear_of_rejection", "fear_of_being_too_much"],
    healsWounds: ["rejection_wound", "shame_wound"],
    compatibleTropes: ["hurt_comfort", "touch_starved_healing"],
    metadata: {
      category: "payoff_fantasy",
      intensity: "transformational",
      comfortValue: 10,
      romanceValue: 9,
      healingValue: 10,
      catharsisValue: 9,
    },
  },
  someone_finally_stays: {
    payoffType: "safety",
    fulfillsDesires: ["desire_for_reliable_love", "desire_for_safety"],
    resolvesFears: ["fear_of_abandonment", "fear_of_emotional_exit"],
    healsWounds: ["abandonment_wound", "emotional_neglect_wound"],
    compatibleTropes: ["slow_burn", "second_chance_romance"],
    requiredRoutePhases: ["near_loss_phase", "return_after_distance_phase"],
  },
  protected_but_not_controlled: {
    payoffType: "protection",
    fulfillsDesires: ["desire_for_safety", "desire_for_autonomy"],
    resolvesFears: ["fear_of_being_controlled", "fear_of_losing_choice"],
    healsWounds: ["control_wound"],
    compatibleTropes: ["bodyguard_romance", "protector_protected"],
    antiPatterns: ["protection_as_control", "safety_used_to_remove_choice"],
  },
  trust_rebuilt_and_earned: {
    payoffType: "trust",
    fulfillsDesires: ["desire_for_reliable_love", "desire_for_truth"],
    resolvesFears: ["fear_of_betrayal", "fear_of_repeating_the_past"],
    healsWounds: ["betrayal_wound"],
    compatibleTropes: ["second_chance_romance", "trust_rebuild_romance"],
    requiredRoutePhases: ["repair_phase", "trust_rebuilding_phase"],
  },
};

export const PAYOFF_FANTASY_SEEDS = Object.freeze(
  getUniquePayoffFantasyIds().map((seed) =>
    createPayoffFantasySeedPreset(buildPayoffFantasyInput(seed)),
  ),
) satisfies readonly PayoffFantasySeed[];

export const PAYOFF_FANTASY_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  PAYOFF_FANTASY_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Payoff type: ${seed.payoffType}.`,
        `Emotional proof: ${seed.emotionalProofs.slice(0, 2).join(", ")}.`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.payoffScenes.slice(0, 2),
      ],
      tags: [
        "payoff_fantasy",
        seed.payoffType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.fulfillsDesires,
        ...seed.resolvesFears,
        ...seed.healsWounds,
        ...seed.compatibleTropes,
        ...seed.compatibleDynamics,
        ...seed.compatibleGrowthArcs,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.antiPatterns,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.requiredRoutePhases,
        ...seed.payoffScenes,
        ...seed.routeGates,
        ...seed.milestoneMemories,
        ...seed.endingFlavors,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "soft" ? "common" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.catharsisValue,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getPayoffFantasySeedsByCategory(
  payoffType: PayoffFantasySeedType,
): readonly PayoffFantasySeed[] {
  const ids = new Set<string>(payoffFantasyCategories[payoffType]);
  return PAYOFF_FANTASY_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getPayoffFantasySeedsByType(
  payoffType: PayoffFantasySeedType,
): readonly PayoffFantasySeed[] {
  return PAYOFF_FANTASY_SEEDS.filter((seed) => seed.payoffType === payoffType);
}

export function findPayoffFantasySeedBySeed(
  seedId: string,
): PayoffFantasySeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return PAYOFF_FANTASY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniquePayoffFantasyIds(): readonly string[] {
  return Array.from(new Set(Object.values(payoffFantasyCategories).flat()));
}

function buildPayoffFantasyInput(seed: string): PayoffFantasySeedInput {
  const payoffType = inferPayoffFantasyType(seed);
  const label = payoffFantasyLabel(seed);
  const override = PAYOFF_FANTASY_OVERRIDES[seed] ?? {};
  const base: PayoffFantasySeedInput = {
    seed,
    label,
    description: defaultDescription(label, payoffType),
    examples: [
      "The ending proves the emotional wound was answered through action, not only words.",
      "The relationship becomes visibly safer, clearer, or more chosen than it was before.",
    ],
    tags: ["payoff_fantasy", payoffType, seed],
    relatedSeeds: defaultRelatedSeeds(payoffType),
    oppositeSeeds: defaultOppositeSeeds(payoffType),
    romanceHooks: [`${seed}_payoff`, `${payoffType}_ending_hook`],
    scenarioHooks: [`${seed}_scene`, `${seed}_ending`, `${payoffType}_proof_scene`],
    dialoguePatterns: defaultDialoguePatterns(payoffType),
    payoffType,
    fulfillsDesires: defaultFulfillsDesires(payoffType),
    resolvesFears: defaultResolvesFears(payoffType),
    healsWounds: defaultHealsWounds(payoffType),
    compatibleTropes: defaultCompatibleTropes(payoffType),
    compatibleDynamics: defaultCompatibleDynamics(payoffType),
    compatibleGrowthArcs: defaultCompatibleGrowthArcs(payoffType),
    requiredRoutePhases: defaultRequiredRoutePhases(payoffType),
    payoffScenes: defaultPayoffScenes(seed, payoffType),
    emotionalProofs: defaultEmotionalProofs(payoffType),
    endingFlavors: defaultEndingFlavors(payoffType),
    antiPatterns: defaultAntiPatterns(payoffType),
    routeGates: [`${seed}_gate`, `${payoffType}_payoff_gate`],
    milestoneMemories: [`${seed}_memory`, `${payoffType}_proof_memory`],
    metadata: {
      category: "payoff_fantasy",
      intensity: defaultIntensity(payoffType),
      comfortValue: defaultComfortValue(payoffType),
      romanceValue: defaultRomanceValue(payoffType),
      healingValue: defaultHealingValue(payoffType),
      catharsisValue: defaultCatharsisValue(payoffType),
    },
  };

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override.metadata,
    },
  };
}

function inferPayoffFantasyType(seed: string): PayoffFantasySeedType {
  for (const [payoffType, seeds] of Object.entries(payoffFantasyCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return payoffType as PayoffFantasySeedType;
    }
  }

  return "healing";
}

function payoffFantasyLabel(seed: string): string {
  if (seed === "home_is_a_person") {
    return "Home Is a Person";
  }

  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(" And ", " and ")
    .replace(" But ", " but ");
}

function defaultDescription(
  label: string,
  payoffType: PayoffFantasySeedType,
): string {
  return `The fantasy that the romance route answers its core ${payoffType} need through a concrete, emotionally legible ending: ${label.toLowerCase()}.`;
}

function defaultRelatedSeeds(payoffType: PayoffFantasySeedType): readonly string[] {
  return [
    ...defaultFulfillsDesires(payoffType),
    ...defaultResolvesFears(payoffType),
    ...defaultHealsWounds(payoffType),
    ...defaultCompatibleDynamics(payoffType),
  ];
}

function defaultOppositeSeeds(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["emotional_ambiguity", "chosen_last"];
    case "safety":
      return ["unreliable_return", "danger_as_normal"];
    case "belonging":
      return ["social_exile", "permanent_outsider"];
    case "healing":
      return ["wound_repeated", "care_with_conditions"];
    case "devotion":
      return ["hot_cold_affection", "possessive_control"];
    case "freedom":
      return ["love_as_cage", "coercive_protection"];
    case "trust":
      return ["betrayal_without_repair", "empty_apology"];
    case "recognition":
      return ["misread_forever", "invisibility"];
    case "protection":
      return ["protection_as_control", "unsafe_dependency"];
    case "partnership":
      return ["unequal_power", "one_sided_labor"];
    case "domestic":
      return ["crisis_only_romance", "no_shared_future"];
    case "redemption":
      return ["past_repeats", "no_changed_behavior"];
    case "victory":
      return ["love_sacrificed_to_rules", "external_pressure_wins"];
  }
}

function defaultDialoguePatterns(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["I choose you.", "Again, if you need to hear it. Every time."];
    case "safety":
      return ["You can come back here.", "I know. That is why I did."];
    case "belonging":
      return ["This feels like home.", "Then stay where you are wanted."];
    case "healing":
      return ["You do not have to earn this.", "I am trying to believe you."];
    case "devotion":
      return ["I am yours by choice.", "Then keep choosing me with open hands."];
    case "freedom":
      return ["Love should not make the room smaller.", "Then we will keep the doors open."];
    case "trust":
      return ["I will not ask you to trust words alone.", "Good. Show me."];
    case "recognition":
      return ["You saw that?", "I saw you."];
    case "protection":
      return ["I want you safe, not trapped.", "Then stand beside me."];
    case "partnership":
      return ["Not behind me.", "Beside you. I know."];
    case "domestic":
      return ["Is this what forever feels like?", "Quieter than I expected."];
    case "redemption":
      return ["I cannot undo it.", "No. But you can become someone who would never do it again."];
    case "victory":
      return ["They said this could not last.", "Then let them be wrong for years."];
  }
}

function defaultFulfillsDesires(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["desire_to_be_chosen", "desire_to_be_prioritized"];
    case "safety":
      return ["desire_for_safety", "desire_for_reliable_love"];
    case "belonging":
      return ["desire_for_home", "desire_for_belonging"];
    case "healing":
      return ["desire_to_be_loved_as_is", "desire_for_softness"];
    case "devotion":
      return ["desire_for_devotion", "desire_for_exclusive_attention"];
    case "freedom":
      return ["desire_for_autonomy", "desire_for_choice"];
    case "trust":
      return ["desire_for_truth", "desire_for_reliable_love"];
    case "recognition":
      return ["desire_to_be_seen", "desire_to_be_understood"];
    case "protection":
      return ["desire_for_safety", "desire_for_respected_boundaries"];
    case "partnership":
      return ["desire_for_partnership", "desire_for_respect"];
    case "domestic":
      return ["desire_for_home", "desire_for_peace"];
    case "redemption":
      return ["desire_for_second_chance", "desire_for_changed_behavior"];
    case "victory":
      return ["desire_for_love_to_win", "desire_for_public_validation"];
  }
}

function defaultResolvesFears(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["fear_of_replacement", "fear_of_being_chosen_last"];
    case "safety":
      return ["fear_of_abandonment", "fear_of_instability"];
    case "belonging":
      return ["fear_of_exile", "fear_of_never_belonging"];
    case "healing":
      return ["fear_of_being_too_much", "fear_of_unworthiness"];
    case "devotion":
      return ["fear_of_weak_devotion", "fear_of_emotional_irrelevance"];
    case "freedom":
      return ["fear_of_dependency", "fear_of_being_controlled"];
    case "trust":
      return ["fear_of_betrayal", "fear_of_repeating_the_past"];
    case "recognition":
      return ["fear_of_being_misread", "fear_of_invisibility"];
    case "protection":
      return ["fear_of_being_controlled", "fear_of_being_unsafe"];
    case "partnership":
      return ["fear_of_inequality", "fear_of_not_being_respected"];
    case "domestic":
      return ["fear_of_losing_home", "fear_of_temporary_happiness"];
    case "redemption":
      return ["fear_of_no_second_chance", "fear_of_permanent_guilt"];
    case "victory":
      return ["fear_of_public_loss", "fear_of_love_being_defeated"];
  }
}

function defaultHealsWounds(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["rejection_wound", "replacement_wound"];
    case "safety":
      return ["abandonment_wound", "survival_wound"];
    case "belonging":
      return ["exile_wound", "isolation_wound"];
    case "healing":
      return ["shame_wound", "emotional_neglect_wound"];
    case "devotion":
      return ["never_chosen_wound", "emotional_neglect_wound"];
    case "freedom":
      return ["control_wound", "enmeshment_wound"];
    case "trust":
      return ["betrayal_wound", "broken_promise_wound"];
    case "recognition":
      return ["invisibility_wound", "misunderstood_wound"];
    case "protection":
      return ["unsafe_care_wound", "control_wound"];
    case "partnership":
      return ["disrespect_wound", "powerlessness_wound"];
    case "domestic":
      return ["rootlessness_wound", "overwork_wound"];
    case "redemption":
      return ["regret_wound", "atonement_wound"];
    case "victory":
      return ["forbidden_love_wound", "public_shame_wound"];
  }
}

function defaultCompatibleTropes(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["fake_relationship", "love_triangle", "forbidden_romance"];
    case "safety":
      return ["safe_person_romance", "slow_burn", "hurt_comfort"];
    case "belonging":
      return ["found_family_romance", "friends_to_lovers", "small_town_romance"];
    case "healing":
      return ["hurt_comfort", "touch_starved_healing", "caretaker_romance"];
    case "devotion":
      return ["devotional_romance", "fated_mates", "soulmates"];
    case "freedom":
      return ["equal_partners_romance", "forbidden_romance"];
    case "trust":
      return ["second_chance_romance", "trust_rebuild_romance"];
    case "recognition":
      return ["enemies_to_lovers", "slow_burn", "friends_to_lovers"];
    case "protection":
      return ["bodyguard_romance", "protector_protected"];
    case "partnership":
      return ["rivals_to_lovers", "workplace_romance", "equal_partners_romance"];
    case "domestic":
      return ["quiet_domesticity", "marriage_of_convenience"];
    case "redemption":
      return ["second_chance_romance", "redemption_romance"];
    case "victory":
      return ["forbidden_romance", "political_romance"];
  }
}

function defaultCompatibleDynamics(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["chosen_person_dynamic", "devotional_dynamic"];
    case "safety":
      return ["safe_haven_dynamic", "protector_protected_dynamic"];
    case "belonging":
      return ["found_family_dynamic", "shared_home_dynamic"];
    case "healing":
      return ["safe_vulnerability_dynamic", "caretaker_receiver_dynamic"];
    case "devotion":
      return ["devotional_dynamic", "favorite_person_dynamic"];
    case "freedom":
      return ["equal_partners_dynamic", "autonomy_respecting_dynamic"];
    case "trust":
      return ["learning_to_trust_dynamic", "accountability_dynamic"];
    case "recognition":
      return ["challenge_growth_dynamic", "safe_haven_dynamic"];
    case "protection":
      return ["protector_protected_dynamic", "watchful_guardian_dynamic"];
    case "partnership":
      return ["equal_partners_dynamic", "rivals_dynamic"];
    case "domestic":
      return ["quiet_domesticity_dynamic", "shared_home_dynamic"];
    case "redemption":
      return ["accountability_dynamic", "repair_focused_dynamic"];
    case "victory":
      return ["us_against_world_dynamic", "public_claim_dynamic"];
  }
}

function defaultCompatibleGrowthArcs(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["learning_to_receive_devotion", "learning_they_are_enough"];
    case "safety":
      return ["learns_distance_is_not_abandonment", "builds_secure_return"];
    case "belonging":
      return ["accepts_a_place_to_stay", "lets_home_be_shared"];
    case "healing":
      return ["accepts_care_without_performance", "lets_softness_land"];
    case "devotion":
      return ["keeps_intensity_respectful", "chooses_without_possessing"];
    case "freedom":
      return ["loves_without_controlling", "asks_for_choice_directly"];
    case "trust":
      return ["repairs_with_changed_behavior", "believes_consistency_over_panic"];
    case "recognition":
      return ["lets_themselves_be_seen", "stops_explaining_to_be_loved"];
    case "protection":
      return ["protects_without_possessing", "receives_protection_with_agency"];
    case "partnership":
      return ["moves_from_competition_to_respect", "chooses_equal_partnership"];
    case "domestic":
      return ["builds_home_in_small_habits", "rests_inside_stability"];
    case "redemption":
      return ["becomes_safe_after_harm", "chooses_accountability"];
    case "victory":
      return ["chooses_love_over_approval", "survives_public_pressure"];
  }
}

function defaultRequiredRoutePhases(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["emotional_investment", "crisis_or_choice", "commitment_choice"];
    case "safety":
      return ["trust_testing_phase", "repair_phase", "integration_phase"];
    case "belonging":
      return ["attachment_formation", "domestic_integration_phase"];
    case "healing":
      return ["vulnerability_leak", "repair_phase", "integration_phase"];
    case "devotion":
      return ["mutual_pining_phase", "confession_or_escalation"];
    case "freedom":
      return ["boundary_conflict_gate", "commitment_choice"];
    case "trust":
      return ["rupture_phase", "accountability_phase", "trust_rebuilding_phase"];
    case "recognition":
      return ["reframing_phase", "vulnerability_leak"];
    case "protection":
      return ["crisis_or_choice", "boundary_respected_gate"];
    case "partnership":
      return ["reframing_phase", "commitment_choice"];
    case "domestic":
      return ["integration_phase", "domestic_integration_phase"];
    case "redemption":
      return ["rupture_phase", "accountability_phase", "new_reign_route"];
    case "victory":
      return ["public_choice_phase", "relationship_identity_phase"];
  }
}

function defaultPayoffScenes(
  seed: string,
  payoffType: PayoffFantasySeedType,
): readonly string[] {
  return [
    `${seed}_scene`,
    `${payoffType}_proof_scene`,
    `${seed}_quiet_after_scene`,
  ];
}

function defaultEmotionalProofs(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["choice_is_clear", "choice_has_cost", "choice_is_repeated"];
    case "safety":
      return ["return_is_reliable", "care_is_consistent", "danger_is_not_normalized"];
    case "belonging":
      return ["place_is_made", "name_is_known", "absence_is_missed"];
    case "healing":
      return ["care_has_no_condition", "wound_is_not_mocked", "softness_is_allowed"];
    case "devotion":
      return ["devotion_respects_agency", "loyalty_is_visible", "intensity_stays_kind"];
    case "freedom":
      return ["choice_remains_open", "boundaries_are_honored", "love_expands_life"];
    case "trust":
      return ["changed_behavior_repeats", "truth_is_given_freely", "repair_holds"];
    case "recognition":
      return ["seen_without_performance", "understood_without_translation"];
    case "protection":
      return ["safety_preserves_choice", "protection_stands_beside"];
    case "partnership":
      return ["labor_is_shared", "respect_is_mutual", "power_is_balanced"];
    case "domestic":
      return ["daily_life_holds_love", "peace_is_repeatable"];
    case "redemption":
      return ["accountability_costs_something", "harm_is_not_repeated"];
    case "victory":
      return ["external_pressure_fails", "love_is_named_publicly"];
  }
}

function defaultEndingFlavors(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["public_relationship", "devotional_partnership"];
    case "safety":
      return ["secure_love", "forever_feels_safe"];
    case "belonging":
      return ["found_home", "chosen_family"];
    case "healing":
      return ["soft_landing", "wound_answered"];
    case "devotion":
      return ["mutual_devotion", "only_you_but_healthy"];
    case "freedom":
      return ["open_doors_love", "equal_choice"];
    case "trust":
      return ["earned_trust", "second_chance_that_holds"];
    case "recognition":
      return ["seen_and_known", "quiet_understanding"];
    case "protection":
      return ["safe_beside_you", "protected_not_possessed"];
    case "partnership":
      return ["equal_partnership", "respected_love"];
    case "domestic":
      return ["domestic_happiness", "earned_happy_ending"];
    case "redemption":
      return ["atonement_earned", "changed_life"];
    case "victory":
      return ["love_wins_publicly", "world_bends_or_breaks"];
  }
}

function defaultAntiPatterns(payoffType: PayoffFantasySeedType): readonly string[] {
  switch (payoffType) {
    case "chosen":
      return ["choice_used_as_ownership", "public_claim_without_private_respect"];
    case "safety":
      return ["safety_as_stagnation", "protection_without_agency"];
    case "belonging":
      return ["belonging_requires_self_erasure", "group_acceptance_erases_boundary"];
    case "healing":
      return ["love_cures_everything", "pain_disappears_without_repair"];
    case "devotion":
      return ["possession_mistaken_for_devotion", "jealousy_as_proof"];
    case "freedom":
      return ["distance_mistaken_for_health", "avoidance_called_autonomy"];
    case "trust":
      return ["forgiveness_without_accountability", "trust_rushed_for_payoff"];
    case "recognition":
      return ["mind_reading_replaces_communication", "being_seen_without_consent"];
    case "protection":
      return ["control_rebranded_as_care", "risk_used_to_remove_choice"];
    case "partnership":
      return ["equality_claimed_but_not_practiced", "labor_hidden_on_one_side"];
    case "domestic":
      return ["domesticity_as_obligation", "peace_without_personality"];
    case "redemption":
      return ["redemption_without_restitution", "victim_forgiveness_required"];
    case "victory":
      return ["winning_without_cost", "external_pressure_erased_too_easily"];
  }
}

function defaultIntensity(
  payoffType: PayoffFantasySeedType,
): "soft" | "medium" | "high" | "transformational" {
  switch (payoffType) {
    case "domestic":
    case "belonging":
      return "soft";
    case "partnership":
    case "recognition":
    case "protection":
      return "medium";
    case "chosen":
    case "safety":
    case "devotion":
    case "freedom":
    case "trust":
    case "victory":
      return "high";
    case "healing":
    case "redemption":
      return "transformational";
  }
}

function defaultComfortValue(payoffType: PayoffFantasySeedType): number {
  return payoffType === "domestic" ||
    payoffType === "safety" ||
    payoffType === "belonging" ||
    payoffType === "healing"
    ? 9
    : 8;
}

function defaultRomanceValue(payoffType: PayoffFantasySeedType): number {
  return payoffType === "chosen" ||
    payoffType === "devotion" ||
    payoffType === "victory"
    ? 10
    : 8;
}

function defaultHealingValue(payoffType: PayoffFantasySeedType): number {
  return payoffType === "healing" ||
    payoffType === "trust" ||
    payoffType === "redemption" ||
    payoffType === "safety"
    ? 10
    : 8;
}

function defaultCatharsisValue(payoffType: PayoffFantasySeedType): number {
  return payoffType === "chosen" ||
    payoffType === "trust" ||
    payoffType === "redemption" ||
    payoffType === "victory"
    ? 10
    : 8;
}
