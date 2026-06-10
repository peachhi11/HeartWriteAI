import {
  createGrowthArcSeedPreset,
  createVocabularySeedPreset,
  type GrowthArcSeed,
  type GrowthArcSeedInput,
  type GrowthArcSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const growthArcSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Conflict Style",
  "Conflict Beat",
  "Rupture Type",
  "Consequence",
  "Repair Style",
  "Repair Beat",
  "Growth Arc",
  "Milestone Memory",
  "Relationship Identity",
] as const;

export const growthArcPresets = [
  "Learning to Trust",
  "Learning to Be Loved",
  "Learning to Need People",
  "Learning to Stay",
  "Learning to Be Seen",
  "Learning to Accept Care",
  "Learning to Ask for Help",
  "Learning to Rest",
  "Learning to Belong",
  "Learning They Are Enough",
  "Learning Boundaries",
  "Learning Autonomy",
  "Learning Vulnerability",
  "Learning Emotional Honesty",
  "Learning Secure Attachment",
  "Learning Repair",
  "Learning Forgiveness",
  "Learning Self-Forgiveness",
  "Learning to Let Go",
  "Learning to Choose Love",
  "Learning Consistency",
  "Learning Mutuality",
  "Learning Safe Conflict",
  "Learning to Receive Devotion",
  "Learning to Love Without Fear",
] as const;

export const growthArcExpansionLogic = {
  wound_to_growth_arc: {
    abandonment_wound: [
      "learning_to_trust",
      "learning_to_stay",
      "learning_secure_attachment",
    ],
    emotional_neglect_wound: [
      "learning_to_be_seen",
      "learning_to_accept_care",
      "learning_to_need_people",
    ],
    betrayal_wound: [
      "learning_to_trust",
      "learning_repair",
      "learning_forgiveness",
    ],
    inadequacy_wound: [
      "learning_they_are_enough",
      "learning_to_be_loved",
      "learning_self_forgiveness",
    ],
    control_wound: [
      "learning_boundaries",
      "learning_autonomy",
      "learning_safe_conflict",
    ],
  },
  consequence_to_growth_arc: {
    trust_damage_consequence: [
      "learning_repair",
      "learning_to_trust",
      "learning_consistency",
    ],
    vulnerability_shutdown_consequence: [
      "learning_vulnerability",
      "learning_emotional_honesty",
    ],
    boundary_hardening_consequence: [
      "learning_boundaries",
      "learning_safe_conflict",
      "learning_autonomy",
    ],
    self_worth_collapse_consequence: [
      "learning_they_are_enough",
      "learning_to_receive_devotion",
    ],
  },
  repair_beat_to_growth_arc: {
    accountability_beat: [
      "learning_repair",
      "learning_safe_conflict",
    ],
    i_am_not_leaving_beat: [
      "learning_secure_attachment",
      "learning_to_stay",
    ],
    safe_touch_offered_beat: [
      "learning_to_accept_care",
      "learning_vulnerability",
    ],
    boundary_respected_beat: [
      "learning_boundaries",
      "learning_autonomy",
    ],
    promise_kept_beat: [
      "learning_consistency",
      "learning_to_trust",
    ],
  },
} as const;

export const growthArcCategories = {
  trust: [
    "learning_to_trust",
    "learning_consistency",
  ],
  attachment: [
    "learning_to_need_people",
    "learning_to_stay",
    "learning_secure_attachment",
  ],
  self_worth: [
    "learning_to_be_loved",
    "learning_they_are_enough",
  ],
  vulnerability: [
    "learning_to_be_seen",
    "learning_vulnerability",
    "learning_emotional_honesty",
  ],
  care: [
    "learning_to_accept_care",
    "learning_to_ask_for_help",
    "learning_to_receive_devotion",
  ],
  rest: [
    "learning_to_rest",
  ],
  belonging: [
    "learning_to_belong",
  ],
  boundaries: [
    "learning_boundaries",
    "learning_safe_conflict",
  ],
  autonomy: [
    "learning_autonomy",
    "learning_to_let_go",
  ],
  repair: [
    "learning_repair",
    "learning_mutuality",
  ],
  forgiveness: [
    "learning_forgiveness",
    "learning_self_forgiveness",
  ],
  love: [
    "learning_to_choose_love",
    "learning_to_love_without_fear",
  ],
} as const satisfies Record<GrowthArcSeedType, readonly string[]>;

type GrowthArcOverride = Partial<GrowthArcSeedInput> & {
  label?: string;
};

const GROWTH_ARC_OVERRIDES: Record<string, GrowthArcOverride> = {
  learning_to_trust: {
    label: "Learning to Trust",
    description:
      "A growth arc where a guarded character gradually learns that trust can be earned through consistency, repair, and emotional safety.",
    examples: [
      "They stop assuming every promise is empty.",
      "They accept help without immediately testing it.",
      "They let someone know where they are vulnerable.",
    ],
    tags: ["growth_arc", "trust", "healing", "slow_burn"],
    relatedSeeds: [
      "betrayal_wound",
      "trust_damage_consequence",
      "consistency_repair",
      "promise_kept_beat",
    ],
    oppositeSeeds: [
      "trust_issues",
      "emotional_lockdown",
      "betrayal_expectation",
    ],
    romanceHooks: [
      "earned_trust_slow_burn",
      "first_real_vulnerability",
      "trust_proven_by_action",
    ],
    scenarioHooks: [
      "promise_kept_after_doubt",
      "secret_shared_scene",
      "return_after_rupture",
    ],
    dialoguePatterns: [
      "I want to believe you.",
      "I am trying not to expect the worst.",
      "You keep showing up. I noticed.",
    ],
    arcType: "trust",
    startingWounds: [
      "betrayal_wound",
      "broken_promise_wound",
      "emotional_neglect_wound",
    ],
    startingFears: [
      "fear_of_betrayal",
      "fear_of_vulnerability",
      "fear_of_being_used",
    ],
    coreDesires: [
      "desire_for_reliable_love",
      "desire_for_emotional_safety",
      "desire_for_complete_trust",
    ],
    commonTriggers: [
      "secret_revealed_trigger",
      "broken_promise_trigger",
      "protective_lie_trigger",
    ],
    oldResponses: [
      "emotional_lockdown_response",
      "trust_testing_response",
      "preemptive_withdrawal_response",
    ],
    newResponses: [
      "asks_directly_for_truth",
      "accepts_reassurance_with_caution",
      "shares_small_vulnerability",
    ],
    requiredRepairBeats: [
      "accountability_beat",
      "truth_comes_out_beat",
      "promise_kept_beat",
      "changed_behavior_beat",
    ],
    milestoneMemories: [
      "first_kept_promise_memory",
      "first_truth_after_fear_memory",
      "first_vulnerability_trusted_memory",
    ],
    routeGates: [
      "first_trust_test_gate",
      "promise_kept_gate",
      "earned_trust_gate",
    ],
    regressionRisks: [
      "new_betrayal",
      "empty_promises",
      "rushed_forgiveness",
      "secret_kept_too_long",
    ],
    healthyOutcome: [
      "trusts_evidence_over_fear",
      "allows_vulnerability",
      "can_repair_without_full_shutdown",
    ],
    relationshipEffects: [
      "deepens_emotional_safety",
      "allows_confession_readiness",
      "supports_secure_attachment_growth",
    ],
    metadata: {
      category: "growth_arc",
      intensity: "transformational",
      healingValue: 10,
      angstValue: 8,
      romanceValue: 10,
      pacingPressure: "high",
    },
  },
  learning_to_be_loved: {
    arcType: "self_worth",
    startingWounds: ["inadequacy_wound", "rejection_wound"],
    startingFears: ["fear_of_unworthiness", "fear_of_rejection"],
    coreDesires: ["desire_to_be_loved_as_is", "desire_to_be_enough"],
  },
  learning_to_accept_care: {
    arcType: "care",
    startingWounds: ["emotional_neglect_wound", "caretaker_wound"],
    startingFears: ["fear_of_dependency", "fear_of_being_a_burden"],
    coreDesires: ["desire_for_softness", "desire_for_reciprocal_care"],
  },
  learning_boundaries: {
    arcType: "boundaries",
    startingWounds: ["control_wound", "enmeshment_wound"],
    startingFears: ["fear_of_losing_choice", "fear_of_conflict"],
    coreDesires: ["desire_for_autonomy", "desire_for_respected_boundaries"],
  },
  learning_repair: {
    arcType: "repair",
    startingWounds: ["betrayal_wound", "conflict_wound"],
    startingFears: ["fear_of_permanent_rupture", "fear_of_being_unforgiven"],
    coreDesires: ["desire_for_accountability", "desire_for_safe_return"],
  },
};

export const GROWTH_ARC_SEEDS = Object.freeze(
  getUniqueGrowthArcIds().map((seed) =>
    createGrowthArcSeedPreset(buildGrowthArcInput(seed)),
  ),
) satisfies readonly GrowthArcSeed[];

export const GROWTH_ARC_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  GROWTH_ARC_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Growth arc type: ${seed.arcType}.`,
        `Healthy outcome: ${seed.healthyOutcome.slice(0, 2).join(", ")}.`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.newResponses.slice(0, 2),
      ],
      tags: [
        "growth_arc",
        seed.arcType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.startingWounds,
        ...seed.startingFears,
        ...seed.coreDesires,
        ...seed.requiredRepairBeats,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.regressionRisks,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.commonTriggers,
        ...seed.routeGates,
        ...seed.milestoneMemories,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "soft" ? "common" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.angstValue,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getGrowthArcSeedsByCategory(
  arcType: GrowthArcSeedType,
): readonly GrowthArcSeed[] {
  const ids = new Set<string>(growthArcCategories[arcType]);
  return GROWTH_ARC_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getGrowthArcSeedsByType(
  arcType: GrowthArcSeedType,
): readonly GrowthArcSeed[] {
  return GROWTH_ARC_SEEDS.filter((seed) => seed.arcType === arcType);
}

export function findGrowthArcSeedBySeed(
  seedId: string,
): GrowthArcSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return GROWTH_ARC_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueGrowthArcIds(): readonly string[] {
  return Array.from(new Set(Object.values(growthArcCategories).flat()));
}

function buildGrowthArcInput(seed: string): GrowthArcSeedInput {
  const arcType = inferGrowthArcType(seed);
  const label = growthArcLabel(seed);
  const override = GROWTH_ARC_OVERRIDES[seed] ?? {};
  const base: GrowthArcSeedInput = {
    seed,
    label,
    description:
      `A long-form character change arc where the character practices ${label.toLowerCase()} through repeated repair, safer choices, and relationship evidence.`,
    examples: [
      "The arc changes how they respond to stress, not just what they say they believe.",
      "The relationship shows the new pattern through repeated choices and milestone memories.",
    ],
    tags: ["growth_arc", arcType, seed],
    relatedSeeds: defaultRelatedSeeds(arcType),
    oppositeSeeds: defaultOppositeSeeds(arcType),
    romanceHooks: [`${seed}_romance_arc`, `${arcType}_healing_romance`],
    scenarioHooks: [`${seed}_test_scene`, `${seed}_milestone_scene`],
    dialoguePatterns: defaultDialoguePatterns(arcType),
    arcType,
    startingWounds: defaultStartingWounds(arcType),
    startingFears: defaultStartingFears(arcType),
    coreDesires: defaultCoreDesires(arcType),
    commonTriggers: defaultCommonTriggers(arcType),
    oldResponses: defaultOldResponses(arcType),
    newResponses: defaultNewResponses(arcType),
    requiredRepairBeats: defaultRequiredRepairBeats(arcType),
    milestoneMemories: [`${seed}_first_shift_memory`, `${seed}_proof_memory`],
    routeGates: [`${seed}_gate`, `${seed}_integration_gate`],
    regressionRisks: defaultRegressionRisks(arcType),
    healthyOutcome: defaultHealthyOutcome(arcType),
    relationshipEffects: defaultRelationshipEffects(arcType),
    metadata: {
      category: "growth_arc",
      intensity: defaultIntensity(arcType),
      healingValue: defaultHealingValue(arcType),
      angstValue: defaultAngstValue(arcType),
      romanceValue: defaultRomanceValue(arcType),
      pacingPressure: defaultPacingPressure(arcType),
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

function inferGrowthArcType(seed: string): GrowthArcSeedType {
  for (const [arcType, seeds] of Object.entries(growthArcCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return arcType as GrowthArcSeedType;
    }
  }

  return "love";
}

function growthArcLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(" To ", " to ")
    .replace(" They ", " They ");
}

function defaultRelatedSeeds(arcType: GrowthArcSeedType): readonly string[] {
  return [
    ...defaultStartingWounds(arcType),
    ...defaultStartingFears(arcType),
    ...defaultCoreDesires(arcType),
  ];
}

function defaultOppositeSeeds(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["trust_issues", "betrayal_expectation"];
    case "attachment":
      return ["preemptive_abandonment", "insecure_attachment_loop"];
    case "self_worth":
      return ["self_erasure", "unworthiness_belief"];
    case "vulnerability":
      return ["emotional_lockdown", "composed_mask_response"];
    case "care":
      return ["refusing_help_response", "caretaking_without_receiving"];
    case "rest":
      return ["overwork_as_identity", "burnout_loop"];
    case "belonging":
      return ["permanent_outsider_belief", "self_exile"];
    case "boundaries":
      return ["boundary_collapse", "people_pleasing_response"];
    case "autonomy":
      return ["control_wound_loop", "love_as_cage"];
    case "repair":
      return ["rupture_without_accountability", "avoidant_no_repair"];
    case "forgiveness":
      return ["permanent_self_punishment", "grudge_as_safety"];
    case "love":
      return ["fear_based_love", "choosing_safety_over_truth"];
  }
}

function defaultDialoguePatterns(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["I want to believe you.", "Then let me earn it slowly."];
    case "attachment":
      return ["You came back.", "I said I would."];
    case "self_worth":
      return ["You do not have to become useful to be wanted.", "That sounds hard to believe."];
    case "vulnerability":
      return ["I do not know how to say this without wanting to run.", "Say it anyway. I will stay still."];
    case "care":
      return ["Let me help.", "I am trying to let you."];
    case "rest":
      return ["You can stop now.", "Only if nothing falls apart."];
    case "belonging":
      return ["There is room for you here.", "Say that again."];
    case "boundaries":
      return ["No is not a betrayal.", "I need to practice believing that."];
    case "autonomy":
      return ["I love you. I am not asking you to disappear into me.", "Good."];
    case "repair":
      return ["I do not want to win this. I want to fix it.", "Then start with the truth."];
    case "forgiveness":
      return ["Forgiveness is not pretending it did not hurt.", "Then what is it?", "Choosing not to live inside the hurt forever."];
    case "love":
      return ["I am scared and I am choosing you anyway.", "That is all I needed to hear."];
  }
}

function defaultStartingWounds(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["betrayal_wound", "broken_promise_wound"];
    case "attachment":
      return ["abandonment_wound", "emotional_neglect_wound"];
    case "self_worth":
      return ["inadequacy_wound", "rejection_wound"];
    case "vulnerability":
      return ["shame_wound", "emotional_neglect_wound"];
    case "care":
      return ["caretaker_wound", "emotional_neglect_wound"];
    case "rest":
      return ["overwork_wound", "worthiness_through_usefulness_wound"];
    case "belonging":
      return ["exile_wound", "isolation_wound"];
    case "boundaries":
      return ["control_wound", "people_pleasing_wound"];
    case "autonomy":
      return ["control_wound", "enmeshment_wound"];
    case "repair":
      return ["betrayal_wound", "conflict_wound"];
    case "forgiveness":
      return ["regret_wound", "betrayal_wound"];
    case "love":
      return ["love_as_risk_wound", "rejection_wound"];
  }
}

function defaultStartingFears(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["fear_of_betrayal", "fear_of_vulnerability"];
    case "attachment":
      return ["fear_of_abandonment", "fear_of_dependency"];
    case "self_worth":
      return ["fear_of_unworthiness", "fear_of_rejection"];
    case "vulnerability":
      return ["fear_of_being_too_much", "fear_of_exposure"];
    case "care":
      return ["fear_of_being_a_burden", "fear_of_dependency"];
    case "rest":
      return ["fear_of_being_useless", "fear_of_falling_behind"];
    case "belonging":
      return ["fear_of_exile", "fear_of_not_fitting"];
    case "boundaries":
      return ["fear_of_conflict", "fear_of_disappointing_others"];
    case "autonomy":
      return ["fear_of_being_controlled", "fear_of_losing_self"];
    case "repair":
      return ["fear_of_permanent_rupture", "fear_of_accountability"];
    case "forgiveness":
      return ["fear_of_excusing_harm", "fear_of_never_being_free"];
    case "love":
      return ["fear_of_love_as_weakness", "fear_of_loss"];
  }
}

function defaultCoreDesires(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["desire_for_reliable_love", "desire_for_truth"];
    case "attachment":
      return ["desire_for_secure_return", "desire_for_closeness"];
    case "self_worth":
      return ["desire_to_be_enough", "desire_to_be_loved_as_is"];
    case "vulnerability":
      return ["desire_to_be_seen", "desire_for_emotional_safety"];
    case "care":
      return ["desire_for_reciprocal_care", "desire_for_softness"];
    case "rest":
      return ["desire_for_peace", "desire_to_stop_performing"];
    case "belonging":
      return ["desire_for_home", "desire_for_belonging"];
    case "boundaries":
      return ["desire_for_respected_boundaries", "desire_for_safe_no"];
    case "autonomy":
      return ["desire_for_autonomy", "desire_for_choice"];
    case "repair":
      return ["desire_for_accountability", "desire_for_safe_return"];
    case "forgiveness":
      return ["desire_for_release", "desire_for_changed_future"];
    case "love":
      return ["desire_to_choose_love", "desire_for_devotion_without_fear"];
  }
}

function defaultCommonTriggers(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["broken_promise_trigger", "secret_revealed_trigger"];
    case "attachment":
      return ["goodbye_trigger", "emotional_distance_trigger"];
    case "self_worth":
      return ["criticism_trigger", "being_compared_trigger"];
    case "vulnerability":
      return ["direct_emotional_question_trigger", "too_much_kindness_trigger"];
    case "care":
      return ["receiving_care_trigger", "needing_help_trigger"];
    case "rest":
      return ["burnout_trigger", "being_told_to_rest_trigger"];
    case "belonging":
      return ["outsider_trigger", "group_rejection_trigger"];
    case "boundaries":
      return ["boundary_ignored_trigger", "being_ordered_trigger"];
    case "autonomy":
      return ["loss_of_choice_trigger", "possessive_pressure_trigger"];
    case "repair":
      return ["argument_aftermath_trigger", "accountability_trigger"];
    case "forgiveness":
      return ["old_hurt_reminder", "self_blame_trigger"];
    case "love":
      return ["almost_confession_trigger", "public_choice_trigger"];
  }
}

function defaultOldResponses(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["trust_testing_response", "emotional_lockdown_response"];
    case "attachment":
      return ["cling_response", "preemptive_withdrawal_response"];
    case "self_worth":
      return ["people_pleasing_response", "self_deprecating_response"];
    case "vulnerability":
      return ["humor_deflection_response", "emotional_withdrawal_response"];
    case "care":
      return ["refusing_help_response", "caretaking_response"];
    case "rest":
      return ["overworking_response", "minimizing_exhaustion_response"];
    case "belonging":
      return ["self_exile_response", "watching_from_edges_response"];
    case "boundaries":
      return ["appeasement_response", "boundary_collapse_response"];
    case "autonomy":
      return ["rebellion_response", "distance_seeking_response"];
    case "repair":
      return ["defensive_anger_response", "avoidance_response"];
    case "forgiveness":
      return ["rumination_response", "self_punishment_response"];
    case "love":
      return ["denial_response", "pull_away_after_softness_response"];
  }
}

function defaultNewResponses(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["asks_directly_for_truth", "tracks_consistency_over_fear"];
    case "attachment":
      return ["asks_for_return_reassurance", "waits_without_catastrophizing"];
    case "self_worth":
      return ["names_the_need", "accepts_compliment_without_deflecting"];
    case "vulnerability":
      return ["shares_small_truth", "stays_present_after_honesty"];
    case "care":
      return ["accepts_help", "asks_for_care_before_breaking"];
    case "rest":
      return ["rests_before_collapse", "lets_work_wait"];
    case "belonging":
      return ["takes_up_space", "accepts_invitation"];
    case "boundaries":
      return ["says_no_cleanly", "holds_boundary_without_apology_spiral"];
    case "autonomy":
      return ["asks_for_choice", "stays_connected_without_self_erasure"];
    case "repair":
      return ["takes_accountability", "returns_for_honest_repair"];
    case "forgiveness":
      return ["names_hurt_without_living_inside_it", "chooses_release_with_boundaries"];
    case "love":
      return ["chooses_love_while_afraid", "names_devotion_without_control"];
  }
}

function defaultRequiredRepairBeats(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["promise_kept_beat", "truth_comes_out_beat"];
    case "attachment":
      return ["i_am_not_leaving_beat", "return_after_distance_beat"];
    case "self_worth":
      return ["reassurance_without_performance_beat", "chosen_as_is_beat"];
    case "vulnerability":
      return ["truth_held_safely_beat", "safe_touch_offered_beat"];
    case "care":
      return ["help_accepted_beat", "care_without_debt_beat"];
    case "rest":
      return ["rest_protected_beat", "work_not_required_for_love_beat"];
    case "belonging":
      return ["place_made_beat", "public_inclusion_beat"];
    case "boundaries":
      return ["boundary_respected_beat", "no_received_without_punishment_beat"];
    case "autonomy":
      return ["choice_restored_beat", "protection_without_control_beat"];
    case "repair":
      return ["accountability_beat", "changed_behavior_beat"];
    case "forgiveness":
      return ["harm_named_beat", "release_without_erasure_beat"];
    case "love":
      return ["choice_named_beat", "fear_received_beat"];
  }
}

function defaultRegressionRisks(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["empty_promises", "new_secrets"];
    case "attachment":
      return ["sudden_distance", "missed_return"];
    case "self_worth":
      return ["public_criticism", "comparison_to_rival"];
    case "vulnerability":
      return ["truth_mocked", "oversharing_then_shame"];
    case "care":
      return ["care_made_transactional", "help_used_as_control"];
    case "rest":
      return ["crisis_demands_overwork", "praise_for_self_neglect"];
    case "belonging":
      return ["social_rejection", "outsider_label_returns"];
    case "boundaries":
      return ["boundary_ignored", "guilt_pressure"];
    case "autonomy":
      return ["possessive_pressure", "choice_removed"];
    case "repair":
      return ["apology_without_change", "defensiveness_returns"];
    case "forgiveness":
      return ["harm_repeated", "forgiveness_demanded"];
    case "love":
      return ["near_loss", "old_fear_of_love_returns"];
  }
}

function defaultHealthyOutcome(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["trusts_evidence_over_fear", "can_repair_without_full_shutdown"];
    case "attachment":
      return ["believes_return_can_be_reliable", "asks_for_reassurance_directly"];
    case "self_worth":
      return ["believes_love_is_not_earned_by_usefulness", "receives_affection_cleanly"];
    case "vulnerability":
      return ["shares_truth_without_immediate_retreat", "lets_need_be_seen"];
    case "care":
      return ["accepts_care_without_debt", "lets_caretaking_be_mutual"];
    case "rest":
      return ["rests_before_breaking", "keeps_worth_separate_from_output"];
    case "belonging":
      return ["takes_up_space_in_the_group", "lets_home_be_real"];
    case "boundaries":
      return ["holds_no_without_shame", "keeps_closeness_after_boundaries"];
    case "autonomy":
      return ["keeps_choice_inside_love", "stays_without_self_erasure"];
    case "repair":
      return ["returns_to_accountability", "uses_conflict_as_information"];
    case "forgiveness":
      return ["releases_without_erasing_harm", "chooses_future_over_rumination"];
    case "love":
      return ["chooses_love_without_abandoning_self", "lets_devotion_feel_safe"];
  }
}

function defaultRelationshipEffects(arcType: GrowthArcSeedType): readonly string[] {
  switch (arcType) {
    case "trust":
      return ["deepens_emotional_safety", "supports_confession_readiness"];
    case "attachment":
      return ["builds_secure_return", "reduces_panic_after_distance"];
    case "self_worth":
      return ["lowers_reassurance_tests", "makes_affection_easier_to_receive"];
    case "vulnerability":
      return ["increases_emotional_honesty", "creates_safe_witnessing"];
    case "care":
      return ["creates_mutual_care", "softens_self_protection"];
    case "rest":
      return ["makes_domestic_peace_credible", "reduces_crisis_dependency"];
    case "belonging":
      return ["creates_shared_home", "deepens_public_attachment"];
    case "boundaries":
      return ["makes_conflict_safer", "keeps_agency_visible"];
    case "autonomy":
      return ["prevents_devotion_from_becoming_control", "supports_equal_partnership"];
    case "repair":
      return ["keeps_ruptures_from_becoming_endings", "increases_trust_after_conflict"];
    case "forgiveness":
      return ["lets_history_exist_without_running_the_relationship", "opens_future_choice"];
    case "love":
      return ["moves_from_defense_to_choice", "supports_committed_relationship_identity"];
  }
}

function defaultIntensity(
  arcType: GrowthArcSeedType,
): "soft" | "medium" | "high" | "transformational" {
  switch (arcType) {
    case "rest":
    case "belonging":
      return "soft";
    case "boundaries":
    case "autonomy":
      return "medium";
    default:
      return arcType === "trust" ||
        arcType === "attachment" ||
        arcType === "repair" ||
        arcType === "love"
        ? "transformational"
        : "high";
  }
}

function defaultHealingValue(arcType: GrowthArcSeedType): number {
  return arcType === "trust" ||
    arcType === "attachment" ||
    arcType === "repair" ||
    arcType === "forgiveness"
    ? 10
    : 8;
}

function defaultAngstValue(arcType: GrowthArcSeedType): number {
  return arcType === "repair" ||
    arcType === "forgiveness" ||
    arcType === "trust"
    ? 8
    : 6;
}

function defaultRomanceValue(arcType: GrowthArcSeedType): number {
  return arcType === "love" ||
    arcType === "attachment" ||
    arcType === "trust"
    ? 10
    : 8;
}

function defaultPacingPressure(
  arcType: GrowthArcSeedType,
): "low" | "medium" | "high" {
  return arcType === "trust" ||
    arcType === "attachment" ||
    arcType === "repair" ||
    arcType === "love"
    ? "high"
    : arcType === "rest" || arcType === "belonging"
      ? "low"
      : "medium";
}
