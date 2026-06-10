import {
  createRelationshipIdentitySeedPreset,
  createVocabularySeedPreset,
  type RelationshipIdentitySeed,
  type RelationshipIdentityEndingStrength,
  type RelationshipIdentitySeedInput,
  type RelationshipIdentitySeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const relationshipIdentitySemanticChain = [
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

export const relationshipIdentityPresets = [
  "Safe Haven Relationship",
  "Secure Base Relationship",
  "Chosen Family Bond",
  "Home Is a Person Bond",
  "Equal Partners Relationship",
  "Devoted Partners Relationship",
  "Ride-or-Die Relationship",
  "Soft Domestic Relationship",
  "Healing Together Relationship",
  "Mutual Growth Relationship",
  "Protective but Free Relationship",
  "Trust Rebuilt Relationship",
  "Second Chance Relationship",
  "Forever Partnership",
  "Publicly Chosen Relationship",
  "Privately Known Relationship",
  "Adventure Partners Relationship",
  "Power Couple Relationship",
  "Quiet Love Relationship",
  "Earned Happy Ending Relationship",
] as const;

export const relationshipIdentityExpansionLogic = {
  wound_to_identity: {
    abandonment_wound: [
      "safe_haven_relationship",
      "secure_base_relationship",
      "home_is_a_person_bond",
    ],
    rejection_wound: [
      "publicly_chosen_relationship",
      "devoted_partners_relationship",
      "chosen_family_bond",
    ],
    betrayal_wound: [
      "trust_rebuilt_relationship",
      "second_chance_relationship",
    ],
    control_wound: [
      "equal_partners_relationship",
      "protective_but_free_relationship",
    ],
    emotional_neglect_wound: [
      "privately_known_relationship",
      "soft_domestic_relationship",
      "healing_together_relationship",
    ],
  },
  payoff_to_identity: {
    someone_finally_stays: [
      "safe_haven_relationship",
      "forever_partnership",
    ],
    home_is_a_person: [
      "home_is_a_person_bond",
      "soft_domestic_relationship",
    ],
    chosen_above_everyone: [
      "publicly_chosen_relationship",
      "devoted_partners_relationship",
    ],
    freedom_within_love: [
      "equal_partners_relationship",
      "protective_but_free_relationship",
    ],
    trust_rebuilt_and_earned: [
      "trust_rebuilt_relationship",
      "second_chance_relationship",
    ],
  },
} as const;

export const relationshipIdentityCategories = {
  safety: [
    "safe_haven_relationship",
    "secure_base_relationship",
  ],
  home: [
    "home_is_a_person_bond",
  ],
  belonging: [
    "chosen_family_bond",
  ],
  partnership: [
    "equal_partners_relationship",
    "forever_partnership",
    "mutual_growth_relationship",
  ],
  devotion: [
    "devoted_partners_relationship",
    "ride_or_die_relationship",
  ],
  freedom: [
    "protective_but_free_relationship",
  ],
  healing: [
    "healing_together_relationship",
  ],
  trust: [
    "trust_rebuilt_relationship",
  ],
  second_chance: [
    "second_chance_relationship",
  ],
  domestic: [
    "soft_domestic_relationship",
  ],
  adventure: [
    "adventure_partners_relationship",
  ],
  power: [
    "power_couple_relationship",
  ],
  quiet_love: [
    "quiet_love_relationship",
    "privately_known_relationship",
  ],
  public_choice: [
    "publicly_chosen_relationship",
  ],
  earned_ending: [
    "earned_happy_ending_relationship",
  ],
} as const satisfies Record<RelationshipIdentitySeedType, readonly string[]>;

type RelationshipIdentityOverride = Partial<RelationshipIdentitySeedInput> & {
  label?: string;
};

const RELATIONSHIP_IDENTITY_OVERRIDES: Record<string, RelationshipIdentityOverride> = {
  safe_haven_relationship: {
    label: "Safe Haven Relationship",
    description:
      "A relationship identity built around emotional safety, reliable return, comfort, and the knowledge that conflict does not erase love.",
    examples: [
      "They become the person each other can come home to.",
      "Arguments end with repair instead of abandonment.",
      "Both people know they can be vulnerable without being punished.",
    ],
    tags: [
      "relationship_identity",
      "safety",
      "healing",
      "secure_attachment",
    ],
    relatedSeeds: [
      "safe_haven_dynamic",
      "someone_finally_stays",
      "learning_secure_attachment",
      "presence_based_repair",
    ],
    oppositeSeeds: [
      "hot_cold_relationship",
      "fear_based_attachment",
      "unreliable_love",
    ],
    romanceHooks: [
      "i_am_not_leaving_scene",
      "home_is_you_confession",
      "safe_to_break_down_here",
    ],
    scenarioHooks: [
      "post_conflict_repair",
      "nightmare_comfort",
      "return_after_distance",
    ],
    dialoguePatterns: [
      "You can come back here.",
      "A fight is not the end of us.",
      "You are safe with me.",
    ],
    identityType: "safety",
    fulfillsDesires: [
      "desire_for_emotional_safety",
      "desire_for_reliable_love",
      "desire_for_home",
    ],
    resolvesFears: [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
      "fear_of_vulnerability",
    ],
    healsWounds: [
      "abandonment_wound",
      "emotional_neglect_wound",
      "never_safe_wound",
    ],
    compatibleDynamics: [
      "safe_haven_dynamic",
      "secure_base_dynamic",
      "healing_together_dynamic",
    ],
    compatibleTropes: [
      "hurt_comfort",
      "slow_burn",
      "touch_starved_healing",
      "second_chance_romance",
    ],
    compatiblePayoffFantasies: [
      "someone_finally_stays",
      "safe_person_forever",
      "home_is_a_person",
    ],
    requiredGrowthArcs: [
      "learning_to_trust",
      "learning_to_stay",
      "learning_secure_attachment",
    ],
    relationshipRules: [
      "conflict_requires_return",
      "no_silent_punishment",
      "vulnerability_is_not_weaponized",
      "repair_is_part_of_love",
    ],
    emotionalProofs: [
      "returns_after_conflict",
      "keeps_small_promises",
      "stays_during_hard_feelings",
      "respects_boundaries",
    ],
    dailyExpressions: [
      "check_in_rituals",
      "quiet_presence",
      "comfort_after_stress",
      "ordinary_reliability",
    ],
    conflictRisks: [
      "overdependence",
      "fear_of_space",
      "reassurance_burden",
    ],
    repairNeeds: [
      "presence_based_repair",
      "verbal_reassurance_repair",
      "space_with_return_repair",
    ],
    routeGates: [
      "safe_haven_identity_gate",
      "secure_return_gate",
      "conflict_does_not_end_us_gate",
    ],
    milestoneMemories: [
      "first_safe_return_memory",
      "first_conflict_repaired_memory",
      "home_is_you_memory",
    ],
    metadata: {
      category: "relationship_identity",
      stabilityValue: 10,
      romanceValue: 10,
      healingValue: 10,
      conflictPotential: 4,
      endingStrength: "transformational",
    },
  },
  publicly_chosen_relationship: {
    identityType: "public_choice",
    fulfillsDesires: ["desire_to_be_chosen", "desire_for_visible_commitment"],
    resolvesFears: ["fear_of_replacement", "fear_of_being_hidden"],
    healsWounds: ["rejection_wound", "never_chosen_wound"],
    compatiblePayoffFantasies: ["chosen_above_everyone", "publicly_chosen"],
    relationshipRules: ["choice_is_named", "private_respect_precedes_public_claim"],
    emotionalProofs: ["chooses_the_bond_when_watched", "does_not_hide_their_loyalty"],
    conflictRisks: ["public_pressure", "reputation_fear"],
    metadata: {
      category: "relationship_identity",
      stabilityValue: 8,
      romanceValue: 10,
      healingValue: 9,
      conflictPotential: 7,
      endingStrength: "epic",
    },
  },
  trust_rebuilt_relationship: {
    identityType: "trust",
    fulfillsDesires: ["desire_for_truth", "desire_for_reliable_love"],
    resolvesFears: ["fear_of_betrayal", "fear_of_repeating_the_past"],
    healsWounds: ["betrayal_wound"],
    compatiblePayoffFantasies: ["trust_rebuilt_and_earned", "repair_after_rupture"],
    relationshipRules: ["truth_is_repaired_with_action", "promises_need_evidence"],
    emotionalProofs: ["keeps_repaired_promises", "names_the_harm_without_deflection"],
    conflictRisks: ["old_betrayal_memory", "proof_fatigue"],
    metadata: {
      category: "relationship_identity",
      stabilityValue: 8,
      romanceValue: 8,
      healingValue: 10,
      conflictPotential: 6,
      endingStrength: "solid",
    },
  },
};

export const RELATIONSHIP_IDENTITY_SEEDS = Object.freeze(
  getUniqueRelationshipIdentityIds().map((seed) =>
    createRelationshipIdentitySeedPreset(buildRelationshipIdentityInput(seed)),
  ),
) satisfies readonly RelationshipIdentitySeed[];

export const RELATIONSHIP_IDENTITY_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  RELATIONSHIP_IDENTITY_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Identity type: ${seed.identityType}.`,
        `Emotional proof: ${seed.emotionalProofs.slice(0, 2).join(", ")}.`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.dailyExpressions.slice(0, 2),
      ],
      tags: [
        "relationship_identity",
        seed.identityType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.fulfillsDesires,
        ...seed.resolvesFears,
        ...seed.healsWounds,
        ...seed.compatibleDynamics,
        ...seed.compatibleTropes,
        ...seed.compatiblePayoffFantasies,
        ...seed.requiredGrowthArcs,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.conflictRisks,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.relationshipRules,
        ...seed.emotionalProofs,
        ...seed.dailyExpressions,
        ...seed.repairNeeds,
        ...seed.routeGates,
        ...seed.milestoneMemories,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.endingStrength === "soft" ? "common" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getRelationshipIdentitySeedsByCategory(
  identityType: RelationshipIdentitySeedType,
): readonly RelationshipIdentitySeed[] {
  const ids = new Set<string>(relationshipIdentityCategories[identityType]);
  return RELATIONSHIP_IDENTITY_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRelationshipIdentitySeedsByType(
  identityType: RelationshipIdentitySeedType,
): readonly RelationshipIdentitySeed[] {
  return RELATIONSHIP_IDENTITY_SEEDS.filter(
    (seed) => seed.identityType === identityType,
  );
}

export function findRelationshipIdentitySeedBySeed(
  seedId: string,
): RelationshipIdentitySeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return RELATIONSHIP_IDENTITY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueRelationshipIdentityIds(): readonly string[] {
  return Array.from(new Set(Object.values(relationshipIdentityCategories).flat()));
}

function buildRelationshipIdentityInput(seed: string): RelationshipIdentitySeedInput {
  const identityType = inferRelationshipIdentityType(seed);
  const label = relationshipIdentityLabel(seed);
  const override = RELATIONSHIP_IDENTITY_OVERRIDES[seed] ?? {};
  const base: RelationshipIdentitySeedInput = {
    seed,
    label,
    description: defaultDescription(label, identityType),
    examples: [
      "The relationship develops a recognizable emotional shape instead of remaining only a set of scenes.",
      "Both people know what the bond means when conflict, distance, or outside pressure arrives.",
    ],
    tags: ["relationship_identity", identityType, seed],
    relatedSeeds: defaultRelatedSeeds(identityType),
    oppositeSeeds: defaultOppositeSeeds(identityType),
    romanceHooks: [`${seed}_identity`, `${identityType}_relationship_hook`],
    scenarioHooks: [`${seed}_scene`, `${identityType}_identity_test`],
    dialoguePatterns: defaultDialoguePatterns(identityType),
    identityType,
    fulfillsDesires: defaultFulfillsDesires(identityType),
    resolvesFears: defaultResolvesFears(identityType),
    healsWounds: defaultHealsWounds(identityType),
    compatibleDynamics: defaultCompatibleDynamics(identityType),
    compatibleTropes: defaultCompatibleTropes(identityType),
    compatiblePayoffFantasies: defaultCompatiblePayoffs(identityType),
    requiredGrowthArcs: defaultRequiredGrowthArcs(identityType),
    relationshipRules: defaultRelationshipRules(identityType),
    emotionalProofs: defaultEmotionalProofs(identityType),
    dailyExpressions: defaultDailyExpressions(identityType),
    conflictRisks: defaultConflictRisks(identityType),
    repairNeeds: defaultRepairNeeds(identityType),
    routeGates: [`${seed}_gate`, `${identityType}_identity_gate`],
    milestoneMemories: [`${seed}_memory`, `${identityType}_identity_memory`],
    metadata: {
      category: "relationship_identity",
      stabilityValue: defaultStabilityValue(identityType),
      romanceValue: defaultRomanceValue(identityType),
      healingValue: defaultHealingValue(identityType),
      conflictPotential: defaultConflictPotential(identityType),
      endingStrength: defaultEndingStrength(identityType),
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

function inferRelationshipIdentityType(seed: string): RelationshipIdentitySeedType {
  for (const [identityType, seeds] of Object.entries(relationshipIdentityCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return identityType as RelationshipIdentitySeedType;
    }
  }

  return "partnership";
}

function relationshipIdentityLabel(seed: string): string {
  if (seed === "home_is_a_person_bond") {
    return "Home Is a Person Bond";
  }
  if (seed === "ride_or_die_relationship") {
    return "Ride-or-Die Relationship";
  }

  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(" And ", " and ")
    .replace(" But ", " but ")
    .replace(" Or ", " or ");
}

function defaultDescription(
  label: string,
  identityType: RelationshipIdentitySeedType,
): string {
  const focus = {
    safety: "safe return, reliable comfort, and repair after strain",
    home: "belonging that feels lived-in rather than declared",
    belonging: "chosen family, acceptance, and durable inclusion",
    partnership: "mutuality, shared direction, and equal emotional labor",
    devotion: "loyalty that stays warm without becoming ownership",
    freedom: "protection that preserves agency and choice",
    healing: "two people growing softer and steadier together",
    trust: "earned reliability after doubt, rupture, or guardedness",
    second_chance: "a renewed bond that proves change through action",
    domestic: "ordinary rituals that make love visible in daily life",
    adventure: "shared movement, risk, and chosen companionship",
    power: "ambition, influence, and public strength held as a team",
    quiet_love: "private recognition, restraint, and steady tenderness",
    public_choice: "a visible choice made without erasing private respect",
    earned_ending: "a relationship that feels won through growth, repair, and choice",
  }[identityType];

  return `${label} names a relationship identity built around ${focus}.`;
}

function defaultRelatedSeeds(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_relationship_dynamic`,
    `${identityType}_payoff_fantasy`,
    `${identityType}_growth_arc`,
  ];
}

function defaultOppositeSeeds(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["hot_cold_relationship", "unreliable_return"],
    home: ["emotional_homelessness", "temporary_attachment"],
    belonging: ["social_exile", "conditional_acceptance"],
    partnership: ["unequal_labor", "one_sided_relationship"],
    devotion: ["performative_loyalty", "possessive_control"],
    freedom: ["protective_control", "dependency_as_control"],
    healing: ["wound_repetition", "unrepaired_rupture"],
    trust: ["empty_promises", "chronic_suspicion"],
    second_chance: ["repeated_harm_without_change", "nostalgia_trap"],
    domestic: ["chaotic_instability", "routine_as_obligation"],
    adventure: ["stagnant_attachment", "fear_based_routine"],
    power: ["status_over_intimacy", "public_image_without_private_care"],
    quiet_love: ["performative_romance", "emotional_noise"],
    public_choice: ["secret_shame_dynamic", "ambiguous_commitment"],
    earned_ending: ["unearned_resolution", "instant_fix"],
  }[identityType];
}

function defaultDialoguePatterns(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["You can come back here.", "This does not have to end us."],
    home: ["Home stopped being a place.", "It started being where you were."],
    belonging: ["You are not an outsider here.", "Not with me."],
    partnership: ["We decide this together.", "I will not carry us without you."],
    devotion: ["I am with you because I choose to be.", "Every time."],
    freedom: ["I can protect you without owning your choices.", "Tell me what help looks like."],
    healing: ["We are not who hurt us.", "We can learn this slowly."],
    trust: ["I believe the change because I have seen it.", "Keep showing me."],
    second_chance: ["This time has to be different.", "Then let me prove different."],
    domestic: ["I saved you the quiet side of the morning.", "You remembered."],
    adventure: ["Wherever this goes, we go together.", "That was the point."],
    power: ["Let them see what we can do together.", "Beside me, not behind me."],
    quiet_love: ["I know.", "You always do."],
    public_choice: ["Let them see.", "I am done hiding what matters."],
    earned_ending: ["We made it here.", "No, we built it."],
  }[identityType];
}

function defaultFulfillsDesires(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["desire_for_emotional_safety", "desire_for_reliable_love"],
    home: ["desire_for_home", "desire_for_belonging"],
    belonging: ["desire_for_belonging", "desire_for_chosen_family"],
    partnership: ["desire_for_partnership", "desire_for_mutuality"],
    devotion: ["desire_for_devotion", "desire_to_be_chosen"],
    freedom: ["desire_for_autonomy", "desire_for_safe_protection"],
    healing: ["desire_for_healing", "desire_to_be_loved_well"],
    trust: ["desire_for_truth", "desire_for_reliable_love"],
    second_chance: ["desire_for_repair", "desire_for_a_changed_future"],
    domestic: ["desire_for_peace", "desire_for_everyday_love"],
    adventure: ["desire_for_shared_life", "desire_for_movement"],
    power: ["desire_for_partnership", "desire_for_recognition"],
    quiet_love: ["desire_to_be_privately_known", "desire_for_steady_tenderness"],
    public_choice: ["desire_to_be_chosen", "desire_for_visible_commitment"],
    earned_ending: ["desire_for_resolution", "desire_for_love_that_lasts"],
  }[identityType];
}

function defaultResolvesFears(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["fear_of_abandonment", "fear_of_conflict_ending_love"],
    home: ["fear_of_not_belonging", "fear_of_temporary_safety"],
    belonging: ["fear_of_rejection", "fear_of_social_exile"],
    partnership: ["fear_of_unequal_love", "fear_of_carrying_everything_alone"],
    devotion: ["fear_of_replacement", "fear_of_halfhearted_love"],
    freedom: ["fear_of_control", "fear_of_losing_self_in_love"],
    healing: ["fear_of_being_too_damaged", "fear_of_repeating_old_patterns"],
    trust: ["fear_of_betrayal", "fear_of_empty_promises"],
    second_chance: ["fear_of_repeating_the_past", "fear_that_change_will_not_last"],
    domestic: ["fear_of_chaos_returning", "fear_love_needs_crisis_to_feel_real"],
    adventure: ["fear_of_stagnation", "fear_of_facing_the_world_alone"],
    power: ["fear_of_being_outgrown", "fear_of_public_failure"],
    quiet_love: ["fear_of_being_unknown", "fear_of_private_needs_being_missed"],
    public_choice: ["fear_of_being_hidden", "fear_of_being_chosen_last"],
    earned_ending: ["fear_of_losing_the_future", "fear_of_unearned_resolution"],
  }[identityType];
}

function defaultHealsWounds(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["abandonment_wound", "emotional_neglect_wound"],
    home: ["belonging_wound", "rootlessness_wound"],
    belonging: ["rejection_wound", "exile_wound"],
    partnership: ["overfunctioning_wound", "control_wound"],
    devotion: ["replacement_wound", "never_chosen_wound"],
    freedom: ["control_wound", "captivity_wound"],
    healing: ["shame_wound", "emotional_neglect_wound"],
    trust: ["betrayal_wound"],
    second_chance: ["betrayal_wound", "regret_wound"],
    domestic: ["instability_wound", "overwork_wound"],
    adventure: ["isolation_wound", "stagnation_wound"],
    power: ["invisibility_wound", "status_shame_wound"],
    quiet_love: ["emotional_neglect_wound", "performance_wound"],
    public_choice: ["rejection_wound", "never_chosen_wound"],
    earned_ending: ["survival_wound", "loss_wound"],
  }[identityType];
}

function defaultCompatibleDynamics(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_dynamic`,
    "equal_partners_dynamic",
    "mutual_repair_dynamic",
  ];
}

function defaultCompatibleTropes(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["hurt_comfort", "safe_person_romance", "slow_burn"],
    home: ["domestic_romance", "found_family_romance"],
    belonging: ["found_family", "outsider_wins_community"],
    partnership: ["friends_to_lovers", "workplace_romance", "equal_partners_romance"],
    devotion: ["devotional_romance", "fated_mates"],
    freedom: ["bodyguard_romance", "protector_protected"],
    healing: ["hurt_comfort", "touch_starved_healing"],
    trust: ["trust_rebuild_romance", "second_chance_romance"],
    second_chance: ["second_chance_romance"],
    domestic: ["domestic_slow_burn", "neighbors_to_lovers"],
    adventure: ["quest_romance", "partners_in_crime"],
    power: ["power_couple", "court_intrigue_lovers"],
    quiet_love: ["slow_burn", "private_devotion"],
    public_choice: ["fake_relationship_turns_real", "forbidden_romance"],
    earned_ending: ["slow_burn", "earned_happy_ending"],
  }[identityType];
}

function defaultCompatiblePayoffs(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["someone_finally_stays", "safe_person_forever"],
    home: ["home_is_a_person", "domestic_happiness"],
    belonging: ["belonging_after_isolation", "chosen_above_everyone"],
    partnership: ["equal_partnership", "mutual_devotion"],
    devotion: ["mutual_devotion", "devotion_without_possession"],
    freedom: ["freedom_within_love", "protected_but_not_controlled"],
    healing: ["softness_after_survival", "loved_without_conditions"],
    trust: ["trust_rebuilt_and_earned", "repair_after_rupture"],
    second_chance: ["second_chance_that_works", "trust_rebuilt_and_earned"],
    domestic: ["domestic_happiness", "peace_after_chaos"],
    adventure: ["earned_happy_ending", "mutual_devotion"],
    power: ["equal_partnership", "publicly_chosen"],
    quiet_love: ["privately_known", "wanted_without_performance"],
    public_choice: ["chosen_above_everyone", "publicly_chosen"],
    earned_ending: ["earned_happy_ending", "forever_feels_safe"],
  }[identityType];
}

function defaultRequiredGrowthArcs(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return {
    safety: ["learning_secure_attachment", "learning_safe_conflict"],
    home: ["learning_to_belong", "learning_to_stay"],
    belonging: ["learning_to_belong", "learning_to_be_loved"],
    partnership: ["learning_mutuality", "learning_boundaries"],
    devotion: ["learning_to_receive_devotion", "learning_to_love_without_fear"],
    freedom: ["learning_autonomy", "learning_boundaries"],
    healing: ["learning_vulnerability", "learning_repair"],
    trust: ["learning_to_trust", "learning_consistency"],
    second_chance: ["learning_repair", "learning_forgiveness"],
    domestic: ["learning_to_rest", "learning_consistency"],
    adventure: ["learning_to_choose_love", "learning_mutuality"],
    power: ["learning_mutuality", "learning_safe_conflict"],
    quiet_love: ["learning_to_be_seen", "learning_to_rest"],
    public_choice: ["learning_to_be_loved", "learning_to_receive_devotion"],
    earned_ending: ["learning_repair", "learning_to_choose_love"],
  }[identityType];
}

function defaultRelationshipRules(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_requires_consistency`,
    `${identityType}_needs_repair_after_rupture`,
    "agency_remains_intact",
  ];
}

function defaultEmotionalProofs(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_is_proven_by_action`,
    "small_promises_are_kept",
    "the_bond_survives_conflict",
  ];
}

function defaultDailyExpressions(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_daily_ritual`,
    "ordinary_reliability",
    "private_check_ins",
  ];
}

function defaultConflictRisks(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_pressure`,
    "old_wound_reactivation",
    "unspoken_expectations",
  ];
}

function defaultRepairNeeds(
  identityType: RelationshipIdentitySeedType,
): readonly string[] {
  return [
    `${identityType}_repair`,
    "accountability_repair",
    "consistent_follow_through",
  ];
}

function defaultStabilityValue(identityType: RelationshipIdentitySeedType): number {
  return ["safety", "home", "trust", "domestic", "earned_ending"].includes(identityType)
    ? 9
    : 8;
}

function defaultRomanceValue(identityType: RelationshipIdentitySeedType): number {
  return ["devotion", "public_choice", "earned_ending", "home"].includes(identityType)
    ? 10
    : 8;
}

function defaultHealingValue(identityType: RelationshipIdentitySeedType): number {
  return ["safety", "healing", "trust", "second_chance", "earned_ending"].includes(identityType)
    ? 10
    : 8;
}

function defaultConflictPotential(identityType: RelationshipIdentitySeedType): number {
  return ["public_choice", "power", "second_chance", "devotion"].includes(identityType)
    ? 7
    : 5;
}

function defaultEndingStrength(
  identityType: RelationshipIdentitySeedType,
): RelationshipIdentityEndingStrength {
  return ["safety", "healing", "earned_ending"].includes(identityType)
    ? "transformational"
    : "solid";
}
