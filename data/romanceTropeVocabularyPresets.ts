import {
  createRomanceTropeSeedPreset,
  createVocabularySeedPreset,
  type RomanceTropeSeed,
  type RomanceTropeSeedInput,
  type RomanceTropeSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type RomanceTropeCategory =
  | "conflict_based"
  | "intimacy_based"
  | "circumstance_based"
  | "forbidden"
  | "healing"
  | "obsessive"
  | "destiny"
  | "domestic"
  | "power_dynamic"
  | "second_chance";

export const romanceTropeSemanticChain = [
  "wound",
  "fear",
  "desire",
  "trigger",
  "response",
  "relationship_dynamic",
  "romance_trope",
  "route_phase",
  "conflict_beat",
  "repair_beat",
  "payoff_fantasy",
  "relationship_identity",
] as const;

export const romanceTropeRoutePhases = [
  "initial_dynamic",
  "friction_or_spark",
  "repeated_contact",
  "vulnerability_leak",
  "reframing",
  "emotional_investment",
  "crisis_or_choice",
  "confession_or_escalation",
  "integration",
] as const;

export const romanceTropeExpansionLogic = {
  wound_to_trope: {
    abandonment_wound: [
      "second_chance_romance",
      "friends_to_lovers",
      "safe_person_romance",
      "slow_burn",
    ],
    betrayal_wound: [
      "enemies_to_lovers",
      "second_chance_romance",
      "trust_rebuild_romance",
    ],
    emotional_neglect_wound: [
      "touch_starved_healing",
      "caretaker_romance",
      "safe_person_romance",
    ],
    rejection_wound: [
      "mutual_pining",
      "secret_crush",
      "friends_to_lovers",
    ],
    control_wound: [
      "equal_partners_romance",
      "rivals_to_lovers",
      "forbidden_romance",
    ],
  },
  fear_to_trope: {
    fear_of_abandonment: [
      "slow_burn",
      "safe_person_romance",
      "forced_proximity",
    ],
    fear_of_vulnerability: [
      "enemies_to_lovers",
      "rivals_to_lovers",
      "grumpy_sunshine",
    ],
    fear_of_replacement: [
      "love_triangle",
      "possessive_devotion",
      "chosen_one_romance",
    ],
    fear_of_commitment: [
      "fake_relationship",
      "friends_with_boundaries",
      "marriage_of_convenience",
    ],
  },
  desire_to_trope: {
    desire_to_be_chosen: [
      "chosen_above_others",
      "devotional_romance",
      "fake_relationship_turns_real",
    ],
    desire_for_safety: [
      "bodyguard_romance",
      "protector_protected",
      "safehouse_romance",
    ],
    desire_for_devotion: [
      "soulmates",
      "fated_mates",
      "possessive_but_respectful_romance",
    ],
    desire_for_partnership: [
      "friends_to_lovers",
      "equal_partners_romance",
      "workplace_romance",
    ],
  },
  dynamic_to_trope: {
    safe_haven_dynamic: [
      "hurt_comfort",
      "touch_starved_healing",
      "slow_burn",
    ],
    protector_protected_dynamic: [
      "bodyguard_romance",
      "forced_proximity",
      "guardian_protected",
    ],
    rivals_dynamic: [
      "rivals_to_lovers",
      "academic_rivals",
      "workplace_rivals",
    ],
    devotional_dynamic: [
      "soulmates",
      "fated_mates",
      "obsession_devotion",
    ],
  },
} as const;

export const romanceTropeCategories = {
  conflict_based: [
    "enemies_to_lovers",
    "rivals_to_lovers",
    "academic_rivals",
    "workplace_rivals",
    "trust_rebuild_romance",
    "challenge_growth_romance",
  ],
  intimacy_based: [
    "slow_burn",
    "mutual_pining",
    "friends_to_lovers",
    "safe_person_romance",
    "hurt_comfort",
    "touch_starved_healing",
  ],
  circumstance_based: [
    "forced_proximity",
    "one_bed",
    "fake_relationship",
    "fake_relationship_turns_real",
    "workplace_romance",
    "safehouse_romance",
  ],
  forbidden: [
    "forbidden_romance",
    "secret_relationship",
    "love_across_class_lines",
    "political_romance",
    "guardian_protected",
    "matchmaker_to_forbidden_best_friend",
  ],
  healing: [
    "second_chance_romance",
    "caretaker_romance",
    "learning_to_be_loved",
    "healing_together",
    "trust_rebuild_romance",
  ],
  obsessive: [
    "possessive_devotion",
    "devotional_romance",
    "possessive_but_respectful_romance",
    "obsession_devotion",
    "chosen_above_others",
  ],
  destiny: [
    "soulmates",
    "fated_mates",
    "chosen_one_romance",
    "red_string_romance",
  ],
  domestic: [
    "quiet_domesticity",
    "marriage_of_convenience",
    "everyday_love",
    "shared_home_romance",
  ],
  power_dynamic: [
    "bodyguard_romance",
    "protector_protected",
    "mentor_student_romance",
    "royal_commoner_romance",
    "equal_partners_romance",
  ],
  second_chance: [
    "exes_to_lovers",
    "homecoming_romance",
    "redemption_romance",
  ],
} as const satisfies Record<RomanceTropeCategory, readonly string[]>;

export const romanceTropeSeedPresets = [
  "Enemies to Lovers",
  "Rivals to Lovers",
  "Slow Burn",
  "Mutual Pining",
  "Friends to Lovers",
  "Forced Proximity",
  "One Bed",
  "Fake Relationship",
  "Bodyguard Romance",
  "Protector / Protected",
  "Second Chance Romance",
  "Hurt / Comfort",
  "Touch-Starved Healing",
  "Safe Person Romance",
  "Devotional Romance",
  "Possessive but Respectful Romance",
  "Soulmates",
  "Fated Mates",
  "Marriage of Convenience",
  "Quiet Domesticity",
] as const;

type RomanceTropeOverride = Partial<RomanceTropeSeedInput> & {
  label?: string;
};

const ROMANCE_TROPE_OVERRIDES: Record<string, RomanceTropeOverride> = {
  enemies_to_lovers: {
    label: "Enemies to Lovers",
    description:
      "A romance route where hostility, distrust, rivalry, or opposing goals gradually transform into respect, vulnerability, attraction, and love.",
    examples: [
      "Two people on opposing sides are forced to work together.",
      "A rival slowly becomes the only person who understands them.",
      "A former enemy protects them at personal cost.",
    ],
    tags: ["romance", "conflict", "tension", "slow_burn", "trust_rebuild"],
    relatedSeeds: [
      "rivals_to_lovers",
      "forced_proximity",
      "trust_rebuild_romance",
      "opposites_attract",
    ],
    oppositeSeeds: [
      "instant_love",
      "established_relationship",
      "low_conflict_romance",
    ],
    romanceHooks: [
      "enemy_protects_user",
      "argument_turns_vulnerable",
      "respect_before_affection",
      "I_hate_that_I_trust_you",
    ],
    scenarioHooks: [
      "forced_alliance",
      "shared_enemy",
      "mission_requires_trust",
      "battlefield_rescue",
    ],
    dialoguePatterns: [
      "I still do not trust you.",
      "Good. Trust me anyway.",
      "You are impossible.",
      "And yet you keep coming back.",
    ],
    tropeType: "conflict_based",
    emotionalCore:
      "The person who felt unsafe becomes the person who understands them most.",
    payoffFantasy:
      "Being loved by someone who saw the worst first and chose them anyway.",
    startingConditions: [
      "opposing_goals",
      "mistrust",
      "history_of_conflict",
      "forced_contact",
    ],
    emotionalBarriers: [
      "pride",
      "fear_of_betrayal",
      "old_grudge",
      "moral_disagreement",
    ],
    commonTriggers: [
      "forced_partnership",
      "unexpected_protection",
      "shared_vulnerability",
      "enemy_in_danger",
    ],
    commonResponses: [
      "defensive_anger_response",
      "trust_testing_response",
      "reluctant_care_response",
    ],
    associatedWounds: [
      "betrayal_wound",
      "humiliation_wound",
      "control_wound",
    ],
    associatedFears: [
      "fear_of_betrayal",
      "fear_of_vulnerability",
      "fear_of_being_used",
    ],
    associatedDesires: [
      "desire_to_be_understood",
      "desire_for_respect",
      "desire_for_partnership",
    ],
    relationshipDynamics: [
      "rivals_dynamic",
      "challenge_growth_dynamic",
      "equal_partners_dynamic",
    ],
    routePhases: [
      "hostility",
      "forced_contact",
      "competence_recognition",
      "reluctant_trust",
      "unexpected_care",
      "vulnerability_leak",
      "protective_choice",
      "confession_under_pressure",
      "chosen_partnership",
    ],
    conflictBeats: [
      "misread_motive",
      "old_grudge_returns",
      "trust_test_failed",
      "public_side_taken",
    ],
    repairBeats: [
      "truth_telling_repair",
      "accountability_repair",
      "protective_repair",
      "mutual_respect_repair",
    ],
    intimacyGates: [
      "first_reluctant_respect_gate",
      "first_unwanted_care_gate",
      "first_trust_gate",
      "first_protective_choice_gate",
      "enemy_to_partner_gate",
    ],
    healthyVersion: [
      "conflict_turns_into_respect",
      "boundaries_remain_intact",
      "trust_is_earned",
      "neither_person_is_degraded",
    ],
    unhealthyVersion: [
      "cruelty_mistaken_for_chemistry",
      "boundary_violations_romanticized",
      "abuse_rebranded_as_passion",
    ],
    antiPatterns: [
      "no_accountability_for_harm",
      "instant_forgiveness_after_betrayal",
      "romanticizing_fear_as_love",
    ],
    compatibleSettings: [
      "academy",
      "workplace",
      "royal_court",
      "war_camp",
      "underworld",
      "fantasy_kingdom",
    ],
    compatibleOpeners: [
      "forced_partnership",
      "rival_challenge",
      "enemy_attack",
      "public_insult",
    ],
    metadata: {
      category: "romance_trope",
      intensity: "high",
      burnSpeed: "slow",
      angstValue: 9,
      comfortValue: 6,
      chemistryValue: 10,
      conflictPotential: 10,
      healingPotential: 8,
    },
  },
  slow_burn: {
    tropeType: "intimacy_based",
    emotionalCore: "Feeling becomes undeniable because it has been earned slowly.",
    payoffFantasy: "Every small moment mattered before either person dared name it.",
    associatedWounds: ["abandonment_wound", "rejection_wound"],
    associatedFears: ["fear_of_vulnerability", "fear_of_rejection"],
    associatedDesires: ["desire_for_safety", "desire_to_be_chosen"],
    relationshipDynamics: ["safe_haven_dynamic", "learning_to_trust_dynamic"],
    metadata: {
      category: "romance_trope",
      intensity: "medium",
      burnSpeed: "slow",
      angstValue: 7,
      comfortValue: 8,
      chemistryValue: 9,
      conflictPotential: 6,
      healingPotential: 9,
    },
  },
  friends_to_lovers: {
    tropeType: "intimacy_based",
    emotionalCore: "Familiar safety becomes too intimate to keep pretending it is ordinary.",
    payoffFantasy: "Being chosen by the person who already knew them best.",
    relationshipDynamics: ["safe_haven_dynamic", "equal_partners_dynamic"],
    associatedWounds: ["rejection_wound", "abandonment_wound"],
    associatedDesires: ["desire_for_partnership", "desire_to_be_chosen"],
  },
  forced_proximity: {
    tropeType: "circumstance_based",
    emotionalCore: "Closeness becomes unavoidable before trust is fully ready.",
    payoffFantasy: "The person they could not escape becomes the person they stop wanting to leave.",
    relationshipDynamics: ["pursuer_withdrawer_dynamic", "protector_protected_dynamic"],
    commonTriggers: ["shared_room", "locked_in_together", "mission_requires_trust"],
  },
  bodyguard_romance: {
    tropeType: "power_dynamic",
    emotionalCore: "Protection turns intimate when duty begins to reveal devotion.",
    payoffFantasy: "Being guarded by someone who chooses their safety and their freedom.",
    relationshipDynamics: ["protector_protected_dynamic", "watchful_guardian_dynamic"],
    associatedDesires: ["desire_for_safety", "desire_for_devotion"],
  },
  fake_relationship: {
    tropeType: "circumstance_based",
    emotionalCore: "Performance becomes dangerous when the false tenderness starts telling the truth.",
    payoffFantasy: "Being wanted for real after being chosen for pretend.",
    associatedFears: ["fear_of_commitment", "fear_of_rejection"],
    associatedDesires: ["desire_to_be_chosen", "desire_for_public_validation"],
  },
  second_chance_romance: {
    tropeType: "second_chance",
    emotionalCore: "Love returns to the place where it failed and asks whether repair is possible.",
    payoffFantasy: "The old wound becomes proof that someone stayed long enough to change.",
    associatedWounds: ["abandonment_wound", "betrayal_wound"],
    repairBeats: ["accountability_repair", "changed_behavior_response", "truth_telling_repair"],
  },
  touch_starved_healing: {
    tropeType: "healing",
    emotionalCore: "Tenderness arrives slowly enough that the body learns it is safe.",
    payoffFantasy: "Being touched with patience, permission, and no demand to perform softness.",
    associatedWounds: ["emotional_neglect_wound", "shame_wound"],
    relationshipDynamics: ["safe_vulnerability_dynamic", "caretaker_receiver_dynamic"],
  },
  possessive_but_respectful_romance: {
    tropeType: "obsessive",
    emotionalCore: "Intensity learns to protect without taking choice away.",
    payoffFantasy: "Being wanted fiercely by someone who still respects every boundary.",
    associatedFears: ["fear_of_replacement", "fear_of_abandonment"],
    healthyVersion: ["devotion_with_boundaries", "secure_priority", "choice_respected"],
    unhealthyVersion: ["possessive_pressure", "jealousy_as_control"],
  },
};

export const ROMANCE_TROPE_SEEDS = Object.freeze(
  getUniqueRomanceTropeIds().map((seed) =>
    createRomanceTropeSeedPreset(buildRomanceTropeInput(seed)),
  ),
) satisfies readonly RomanceTropeSeed[];

export const ROMANCE_TROPE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  ROMANCE_TROPE_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional core: ${seed.emotionalCore}`,
        `Payoff fantasy: ${seed.payoffFantasy}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.routePhases.slice(0, 2),
      ],
      tags: [
        "romance_trope",
        seed.tropeType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.associatedWounds,
        ...seed.associatedFears,
        ...seed.associatedDesires,
        ...seed.relationshipDynamics,
        ...seed.repairBeats,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.antiPatterns,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.commonTriggers,
        ...seed.compatibleOpeners,
        ...seed.intimacyGates,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "soft" ? "common" : "uncommon",
        romanceValue: seed.metadata.chemistryValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getRomanceTropeSeedsByCategory(
  category: RomanceTropeCategory,
): readonly RomanceTropeSeed[] {
  const ids = new Set<string>(romanceTropeCategories[category]);
  return ROMANCE_TROPE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRomanceTropeSeedsByType(
  tropeType: RomanceTropeSeedType,
): readonly RomanceTropeSeed[] {
  return ROMANCE_TROPE_SEEDS.filter((seed) => seed.tropeType === tropeType);
}

export function findRomanceTropeSeedBySeed(
  seedId: string,
): RomanceTropeSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return ROMANCE_TROPE_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueRomanceTropeIds(): readonly string[] {
  return Array.from(new Set(Object.values(romanceTropeCategories).flat()));
}

function buildRomanceTropeInput(seed: string): RomanceTropeSeedInput {
  const tropeType = inferTropeType(seed);
  const label = romanceTropeLabel(seed);
  const override = ROMANCE_TROPE_OVERRIDES[seed] ?? {};
  const base: RomanceTropeSeedInput = {
    seed,
    label,
    description:
      "A romance route template that organizes emotional barriers, repeated contact, conflict beats, repair, and payoff fantasy.",
    examples: [
      "The trope sets the relationship's emotional route rather than just a marketing label.",
      "It helps convert wounds, fears, desires, and dynamics into scenario beats.",
    ],
    tags: ["romance", "romance_trope", tropeType, seed],
    relatedSeeds: inferRelatedSeeds(seed, tropeType),
    oppositeSeeds: inferOppositeSeeds(tropeType),
    romanceHooks: [seed, `${tropeType}_romance`],
    scenarioHooks: [`${seed}_opener`, `${seed}_route`, `${seed}_crisis`],
    dialoguePatterns: defaultDialoguePatterns(tropeType),
    tropeType,
    emotionalCore: defaultEmotionalCore(tropeType),
    payoffFantasy: defaultPayoffFantasy(tropeType),
    startingConditions: defaultStartingConditions(tropeType),
    emotionalBarriers: defaultEmotionalBarriers(tropeType),
    commonTriggers: defaultCommonTriggers(tropeType),
    commonResponses: defaultCommonResponses(tropeType),
    associatedWounds: defaultAssociatedWounds(tropeType),
    associatedFears: defaultAssociatedFears(tropeType),
    associatedDesires: defaultAssociatedDesires(tropeType),
    relationshipDynamics: defaultRelationshipDynamics(tropeType),
    routePhases: defaultRoutePhases(tropeType),
    conflictBeats: defaultConflictBeats(tropeType),
    repairBeats: defaultRepairBeats(tropeType),
    intimacyGates: defaultIntimacyGates(seed),
    healthyVersion: defaultHealthyVersion(tropeType),
    unhealthyVersion: defaultUnhealthyVersion(tropeType),
    antiPatterns: defaultAntiPatterns(tropeType),
    compatibleSettings: defaultCompatibleSettings(tropeType),
    compatibleOpeners: defaultCompatibleOpeners(tropeType),
    metadata: {
      category: "romance_trope",
      intensity: tropeType === "domestic" ? "soft" : "high",
      burnSpeed: tropeType === "intimacy_based" || tropeType === "conflict_based"
        ? "slow"
        : "variable",
      angstValue: tropeType === "domestic" ? 4 : 7,
      comfortValue: tropeType === "healing" || tropeType === "domestic" ? 9 : 6,
      chemistryValue: 8,
      conflictPotential: tropeType === "conflict_based" || tropeType === "forbidden" ? 9 : 6,
      healingPotential: tropeType === "healing" ? 9 : 7,
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

function inferTropeType(seed: string): RomanceTropeSeedType {
  for (const [category, seeds] of Object.entries(romanceTropeCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return category as RomanceTropeSeedType;
    }
  }

  return "intimacy_based";
}

function romanceTropeLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("To", "to")
    .replace("And", "and")
    .replace("But", "but")
    .replace("Bodyguard Romance", "Bodyguard Romance")
    .replace("Protector Protected", "Protector / Protected")
    .replace("Hurt Comfort", "Hurt / Comfort");
}

function inferRelatedSeeds(
  seed: string,
  tropeType: RomanceTropeSeedType,
): readonly string[] {
  const related = [
    ...defaultAssociatedWounds(tropeType),
    ...defaultAssociatedFears(tropeType),
    ...defaultAssociatedDesires(tropeType),
    ...defaultRelationshipDynamics(tropeType),
  ];

  if (seed.includes("forced") || seed.includes("safehouse")) {
    related.push("forced_proximity", "protector_protected_dynamic");
  }
  if (seed.includes("fake")) {
    related.push("desire_to_be_chosen", "public_choice_confession");
  }
  if (seed.includes("soul") || seed.includes("fated")) {
    related.push("devotional_dynamic", "desire_for_devotion");
  }
  if (seed.includes("rival") || seed.includes("enemy")) {
    related.push("rivals_dynamic", "enemies_to_lovers");
  }

  return related;
}

function inferOppositeSeeds(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["instant_love", "low_conflict_romance"];
    case "intimacy_based":
      return ["instant_gratification", "rushed_confession"];
    case "forbidden":
      return ["publicly_approved_romance", "low_stakes_relationship"];
    case "domestic":
      return ["chaotic_instability", "crisis_only_romance"];
    default:
      return ["flat_relationship_route"];
  }
}

function defaultEmotionalCore(tropeType: RomanceTropeSeedType): string {
  switch (tropeType) {
    case "conflict_based":
      return "Tension becomes intimacy because respect survives the fight.";
    case "intimacy_based":
      return "Small moments slowly gather enough meaning to become love.";
    case "circumstance_based":
      return "The situation forces proximity before the heart is ready.";
    case "forbidden":
      return "Love becomes a risk because the world has named it impossible.";
    case "healing":
      return "Tenderness contradicts the wound until the old rule starts to fail.";
    case "obsessive":
      return "Intensity must become devotion without becoming possession.";
    case "destiny":
      return "The bond feels larger than coincidence but still has to be chosen.";
    case "domestic":
      return "Love proves itself through ordinary life and reliable return.";
    case "power_dynamic":
      return "Power becomes romantic only when it is ethical, responsive, and chosen.";
    case "second_chance":
      return "The past returns asking whether love can survive repair.";
  }
}

function defaultPayoffFantasy(tropeType: RomanceTropeSeedType): string {
  switch (tropeType) {
    case "conflict_based":
      return "Being chosen by someone who saw the difficult parts first.";
    case "intimacy_based":
      return "Realizing the love was there before either person dared name it.";
    case "circumstance_based":
      return "The temporary arrangement becomes the place both people want to stay.";
    case "forbidden":
      return "Being worth the risk, the scandal, and the choice.";
    case "healing":
      return "Being loved in the exact place the wound said no one would stay.";
    case "obsessive":
      return "Being wanted fiercely without losing agency or safety.";
    case "destiny":
      return "Being found by a love that feels inevitable and still chosen.";
    case "domestic":
      return "The fantasy of being loved in breakfast, keys, routines, and home.";
    case "power_dynamic":
      return "Being protected, challenged, or led without being diminished.";
    case "second_chance":
      return "The love story gets another ending because both people changed.";
  }
}

function defaultStartingConditions(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["opposing_goals", "friction", "repeated_contact"];
    case "circumstance_based":
      return ["forced_situation", "shared_problem", "limited_escape"];
    case "forbidden":
      return ["external_rule", "reputation_risk", "hidden_feelings"];
    case "second_chance":
      return ["unfinished_history", "old_wound", "changed_circumstances"];
    default:
      return ["emotional_gap", "attraction_or_safety", "route_pressure"];
  }
}

function defaultEmotionalBarriers(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["pride", "mistrust", "old_grudge"];
    case "intimacy_based":
      return ["fear_of_ruining_the_bond", "timing", "unspoken_feelings"];
    case "forbidden":
      return ["public_consequence", "family_or_status_pressure", "guilt"];
    case "obsessive":
      return ["jealousy", "fear_of_replacement", "boundary_pressure"];
    default:
      return ["fear_of_vulnerability", "unclear_commitment", "misread_signals"];
  }
}

function defaultCommonTriggers(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["rival_challenge", "forced_partnership", "public_side_taken"];
    case "intimacy_based":
      return ["almost_confession", "quiet_care", "shared_routine"];
    case "circumstance_based":
      return ["one_bed_scene", "locked_in_together", "fake_public_touch"];
    case "forbidden":
      return ["relationship_exposed", "family_disapproval", "court_summons"];
    case "healing":
      return ["receiving_care_trigger", "safe_touch_trigger", "too_much_kindness_trigger"];
    default:
      return ["choice_point", "jealousy_trigger", "confession_pressure"];
  }
}

function defaultCommonResponses(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["defensive_anger_response", "trust_testing_response", "reluctant_care_response"];
    case "healing":
      return ["softening_response", "emotional_withdrawal_response", "vulnerability_repair_response"];
    case "obsessive":
      return ["priority_testing_response", "jealousy_suppression_response", "devotional_response"];
    case "domestic":
      return ["routine_seeking_response", "acts_of_service_repair_response"];
    default:
      return ["reassurance_seeking_response", "truth_slip_response", "changed_behavior_response"];
  }
}

function defaultAssociatedWounds(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["betrayal_wound", "control_wound"];
    case "healing":
      return ["emotional_neglect_wound", "shame_wound"];
    case "second_chance":
      return ["abandonment_wound", "betrayal_wound"];
    case "obsessive":
      return ["replacement_wound", "abandonment_wound"];
    default:
      return ["rejection_wound", "abandonment_wound"];
  }
}

function defaultAssociatedFears(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["fear_of_betrayal", "fear_of_vulnerability"];
    case "forbidden":
      return ["fear_of_rejection", "fear_of_public_scandal"];
    case "obsessive":
      return ["fear_of_replacement", "fear_of_emotional_irrelevance"];
    case "second_chance":
      return ["fear_of_repeating_the_past", "fear_of_abandonment"];
    default:
      return ["fear_of_vulnerability", "fear_of_rejection"];
  }
}

function defaultAssociatedDesires(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "power_dynamic":
      return ["desire_for_safety", "desire_for_partnership"];
    case "obsessive":
      return ["desire_for_devotion", "desire_for_exclusive_attention"];
    case "domestic":
      return ["desire_for_home", "desire_for_peace"];
    case "destiny":
      return ["desire_for_devotion", "desire_to_be_chosen"];
    default:
      return ["desire_to_be_chosen", "desire_to_be_understood"];
  }
}

function defaultRelationshipDynamics(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["rivals_dynamic", "challenge_growth_dynamic"];
    case "healing":
      return ["safe_haven_dynamic", "healing_together_dynamic"];
    case "power_dynamic":
      return ["protector_protected_dynamic", "equal_partners_dynamic"];
    case "obsessive":
      return ["devotional_dynamic", "favorite_person_dynamic"];
    case "domestic":
      return ["quiet_domesticity_dynamic", "shared_home_dynamic"];
    default:
      return ["safe_haven_dynamic", "chosen_person_dynamic"];
  }
}

function defaultRoutePhases(tropeType: RomanceTropeSeedType): readonly string[] {
  if (tropeType === "conflict_based") {
    return [
      "friction",
      "forced_contact",
      "competence_recognition",
      "reluctant_trust",
      "vulnerability_leak",
      "protective_choice",
      "confession_or_escalation",
      "chosen_partnership",
    ];
  }

  return romanceTropeRoutePhases;
}

function defaultConflictBeats(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "forbidden":
      return ["relationship_exposed", "public_choice_required", "status_pressure"];
    case "second_chance":
      return ["old_hurt_returns", "changed_behavior_doubted", "trust_test_failed"];
    case "domestic":
      return ["routine_disrupted", "home_meaning_misread"];
    default:
      return ["misread_motive", "jealousy_trigger", "choice_under_pressure"];
  }
}

function defaultRepairBeats(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["truth_telling_repair", "accountability_repair", "mutual_respect_repair"];
    case "healing":
      return ["safe_touch_repair", "presence_based_repair", "gentle_reassurance_repair"];
    case "second_chance":
      return ["changed_behavior_response", "accountability_repair", "recommitment_repair"];
    default:
      return ["verbal_reassurance_repair", "honest_conversation_repair"];
  }
}

function defaultIntimacyGates(seed: string): readonly string[] {
  return [
    `first_${seed}_spark_gate`,
    `first_${seed}_vulnerability_gate`,
    `${seed}_confession_gate`,
    `${seed}_payoff_gate`,
  ];
}

function defaultHealthyVersion(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "obsessive":
      return ["devotion_with_boundaries", "agency_remains_intact"];
    case "power_dynamic":
      return ["consent_remains_visible", "power_does_not_erase_choice"];
    case "conflict_based":
      return ["trust_is_earned", "conflict_turns_into_respect"];
    default:
      return ["repair_is_present", "both_people_keep_agency"];
  }
}

function defaultUnhealthyVersion(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "obsessive":
      return ["possession_mistaken_for_love", "jealousy_as_control"];
    case "conflict_based":
      return ["cruelty_mistaken_for_chemistry", "no_accountability_for_harm"];
    case "power_dynamic":
      return ["authority_overrides_consent", "protection_as_control"];
    default:
      return ["pain_without_repair", "ambiguity_used_as_tension"];
  }
}

function defaultAntiPatterns(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["romanticizing_fear_as_love", "instant_forgiveness_after_betrayal"];
    case "obsessive":
      return ["boundary_violations_romanticized", "control_rebranded_as_devotion"];
    case "power_dynamic":
      return ["coercion_presented_as_romance", "agency_removed_for_drama"];
    default:
      return ["payoff_without_growth", "conflict_without_repair"];
  }
}

function defaultCompatibleSettings(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["academy", "workplace", "royal_court", "underworld", "fantasy_kingdom"];
    case "power_dynamic":
      return ["royal_court", "underworld", "military_outpost", "safehouse"];
    case "domestic":
      return ["small_town", "shared_home", "apartment_living"];
    case "second_chance":
      return ["homecoming", "small_town", "former_workplace"];
    default:
      return ["city", "academy", "workplace", "manor_estate"];
  }
}

function defaultCompatibleOpeners(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return ["rival_challenge", "forced_partnership", "public_insult"];
    case "circumstance_based":
      return ["room_assignment", "fake_date_request", "storm_traps_them"];
    case "forbidden":
      return ["secret_meeting", "public_scandal", "family_disapproves"];
    case "domestic":
      return ["shared_breakfast", "laundry_day", "quiet_domestic_morning"];
    default:
      return ["unexpected_reunion", "missed_message_repair", "almost_confession"];
  }
}

function defaultDialoguePatterns(tropeType: RomanceTropeSeedType): readonly string[] {
  switch (tropeType) {
    case "conflict_based":
      return [
        "I do not trust you.",
        "Then trust what I am doing, not what you think I am.",
      ];
    case "intimacy_based":
      return [
        "When did this stop feeling ordinary?",
        "I think it never was.",
      ];
    case "circumstance_based":
      return [
        "This arrangement was supposed to be temporary.",
        "So was pretending not to care.",
      ];
    case "forbidden":
      return [
        "If they find out, this becomes dangerous.",
        "It already matters. That is the dangerous part.",
      ];
    case "healing":
      return [
        "You do not have to be ready all at once.",
        "Stay while I learn how.",
      ];
    case "obsessive":
      return [
        "I want to be chosen, not owned.",
        "Then let me love you without gripping too hard.",
      ];
    case "destiny":
      return [
        "What if this was always going to happen?",
        "Then I still want to choose it.",
      ];
    case "domestic":
      return [
        "I saved you a place.",
        "You always do.",
      ];
    case "power_dynamic":
      return [
        "I can protect you without deciding for you.",
        "Then prove it by listening.",
      ];
    case "second_chance":
      return [
        "I am not the person who left.",
        "Then show me who came back.",
      ];
  }
}
