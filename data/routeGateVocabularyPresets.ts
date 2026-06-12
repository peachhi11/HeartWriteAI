import {
  createRouteGateSeedPreset,
  createVocabularySeedPreset,
  type RouteGateSeed,
  type RouteGateSeedInput,
  type RouteGateSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const routeGateSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Hidden Need",
  "Trigger",
  "Response",
  "Relationship Dynamic",
  "Romance Trope",
  "Route Phase",
  "Conflict Beat",
  "Rupture Type",
  "Consequence",
  "Repair Need",
  "Repair Style",
  "Repair Beat",
  "Route Gate",
  "Milestone Memory",
  "Growth Arc",
  "Payoff Fantasy",
  "Relationship Identity",
] as const;

export const routeGatePresets = [
  "First Meeting Gate",
  "First Spark Gate",
  "Repeated Contact Gate",
  "First Trust Test Gate",
  "First Kept Promise Gate",
  "First Boundary Respected Gate",
  "First Reassurance Gate",
  "First Safe Touch Gate",
  "First Vulnerability Leak Gate",
  "First Secret Shared Gate",
  "First Old Wound Reveal Gate",
  "First Emotional Safety Gate",
  "First Conflict Gate",
  "First Rupture Gate",
  "First Real Apology Gate",
  "First Accountability Gate",
  "First Repair Gate",
  "First Return After Distance Gate",
  "First Public Choice Gate",
  "First Private Vow Gate",
  "Confession Gate",
  "Commitment Choice Gate",
  "Safe to Stay Gate",
  "Safe to Need Gate",
  "Safe to Be Seen Gate",
  "Chosen Without Competing Gate",
  "Trust Rebuilt Gate",
  "Secure Return Gate",
  "Relationship Named Gate",
  "Earned Happy Ending Gate",
] as const;

export const routeGateExpansionLogic = {
  route_phase_to_gates: {
    initial_dynamic: [
      "first_meeting_gate",
      "first_spark_gate",
    ],
    trust_testing_phase: [
      "first_trust_test_gate",
      "first_kept_promise_gate",
      "first_boundary_respected_gate",
    ],
    vulnerability_leak: [
      "first_vulnerability_leak_gate",
      "first_secret_shared_gate",
      "first_old_wound_reveal_gate",
    ],
    repair_phase: [
      "first_real_apology_gate",
      "first_accountability_gate",
      "first_repair_gate",
    ],
    confession_or_escalation: [
      "confession_gate",
      "first_private_vow_gate",
      "first_public_choice_gate",
    ],
    integration_phase: [
      "relationship_named_gate",
      "secure_return_gate",
      "earned_happy_ending_gate",
    ],
  },
  wound_to_route_gate: {
    abandonment_wound: [
      "first_reassurance_gate",
      "first_return_after_distance_gate",
      "secure_return_gate",
    ],
    betrayal_wound: [
      "first_accountability_gate",
      "first_kept_promise_gate",
      "trust_rebuilt_gate",
    ],
    emotional_neglect_wound: [
      "first_emotional_safety_gate",
      "safe_to_be_seen_gate",
      "safe_to_need_gate",
    ],
    control_wound: [
      "first_boundary_respected_gate",
      "commitment_choice_gate",
      "safe_to_stay_gate",
    ],
    rejection_wound: [
      "first_public_choice_gate",
      "chosen_without_competing_gate",
      "relationship_named_gate",
    ],
  },
  repair_beat_to_route_gate: {
    accountability_beat: [
      "first_accountability_gate",
      "trust_rebuilt_gate",
    ],
    i_am_not_leaving_beat: [
      "first_reassurance_gate",
      "secure_return_gate",
    ],
    boundary_respected_beat: [
      "first_boundary_respected_gate",
      "safe_to_stay_gate",
    ],
    public_loyalty_beat: [
      "first_public_choice_gate",
      "chosen_without_competing_gate",
    ],
    promise_kept_beat: [
      "first_kept_promise_gate",
      "trust_rebuilt_gate",
    ],
  },
} as const;

export const routeGateCategories = {
  opening: [
    "first_meeting_gate",
    "first_spark_gate",
    "repeated_contact_gate",
  ],
  trust: [
    "first_trust_test_gate",
    "first_kept_promise_gate",
    "trust_rebuilt_gate",
  ],
  boundary: ["first_boundary_respected_gate"],
  reassurance: [
    "first_reassurance_gate",
    "secure_return_gate",
  ],
  vulnerability: [
    "first_safe_touch_gate",
    "first_vulnerability_leak_gate",
    "first_secret_shared_gate",
    "first_old_wound_reveal_gate",
    "first_emotional_safety_gate",
    "safe_to_need_gate",
    "safe_to_be_seen_gate",
  ],
  conflict: ["first_conflict_gate"],
  rupture: ["first_rupture_gate"],
  repair: [
    "first_real_apology_gate",
    "first_accountability_gate",
    "first_repair_gate",
    "first_return_after_distance_gate",
  ],
  choice: [
    "first_public_choice_gate",
    "chosen_without_competing_gate",
  ],
  confession: [
    "first_private_vow_gate",
    "confession_gate",
  ],
  commitment: [
    "commitment_choice_gate",
    "safe_to_stay_gate",
  ],
  integration: ["relationship_named_gate"],
  payoff: ["earned_happy_ending_gate"],
} as const satisfies Record<RouteGateSeedType, readonly string[]>;

type RouteGateOverride = Partial<RouteGateSeedInput> & {
  label?: string;
};

const ROUTE_GATE_OVERRIDES: Record<string, RouteGateOverride> = {
  first_reassurance_gate: {
    description:
      "A route gate where one character receives clear emotional reassurance for the first time and begins to believe the relationship may be safer than expected.",
    examples: [
      "After a panic spiral, the partner says they are not leaving.",
      "A delayed reply is repaired with clear care.",
      "One character asks if everything is okay and receives a direct answer.",
    ],
    tags: ["route_gate", "reassurance", "attachment", "healing"],
    relatedSeeds: [
      "need_for_reassurance",
      "verbal_reassurance_repair",
      "fear_of_abandonment",
      "learning_secure_attachment",
    ],
    oppositeSeeds: [
      "silent_treatment",
      "emotional_ambiguity",
      "hot_cold_affection",
    ],
    romanceHooks: [
      "i_am_not_leaving_scene",
      "soft_reassurance_after_fear",
      "promise_after_panic",
    ],
    scenarioHooks: [
      "delayed_reply_spiral",
      "post_argument_check_in",
      "temporary_separation_repair",
    ],
    dialoguePatterns: [
      "I am here.",
      "This did not change how I feel.",
      "You do not have to guess where you stand with me.",
    ],
    gateType: "reassurance",
    unlocksRoutePhases: [
      "softening_phase",
      "vulnerability_leak",
      "trust_rebuilding_phase",
    ],
    requiredBefore: [
      "safe_to_need_gate",
      "secure_return_gate",
      "confession_gate",
    ],
    blockedBy: [
      "mocked_need_for_reassurance",
      "empty_reassurance_without_follow_through",
      "repeated_hot_cold_affection",
    ],
    activatedByWounds: [
      "abandonment_wound",
      "rejection_wound",
      "emotional_neglect_wound",
    ],
    activatedByFears: [
      "fear_of_abandonment",
      "fear_of_rejection",
      "fear_of_emotional_distance",
    ],
    fulfillsDesires: [
      "desire_for_reliable_love",
      "desire_for_emotional_presence",
      "desire_to_be_chosen",
    ],
    satisfiesHiddenNeeds: [
      "need_for_reassurance",
      "need_for_safe_return",
      "need_for_consistency",
    ],
    likelyTriggers: [
      "unanswered_message_trigger",
      "cold_tone_trigger",
      "goodbye_trigger",
    ],
    likelyResponses: [
      "reassurance_seeking_response",
      "panic_spiral_response",
      "overexplaining_response",
    ],
    compatibleRepairBeats: [
      "reassurance_after_fear_beat",
      "i_am_not_leaving_beat",
      "return_after_leaving_beat",
    ],
    compatibleGrowthArcs: [
      "learning_to_trust",
      "learning_secure_attachment",
      "learning_to_stay",
    ],
    successSignals: [
      "character_softens",
      "panic_deescalates",
      "need_is_spoken_more_directly_next_time",
    ],
    failureSignals: [
      "reassurance_is_mocked",
      "words_are_not_followed_by_consistency",
      "need_becomes_shame",
    ],
    milestoneMemories: [
      "first_reassurance_received_memory",
      "first_i_am_not_leaving_memory",
    ],
    metadata: {
      importance: "major",
      romanceValue: 10,
      angstValue: 7,
      healingValue: 10,
      routeProgressValue: 9,
    },
  },
  first_public_choice_gate: {
    description:
      "A route gate where private feeling becomes visible loyalty, and the relationship stops being hidden behind convenience, fear, or social pressure.",
    examples: [
      "They take the character's side in front of witnesses.",
      "They name the relationship instead of leaving it ambiguous.",
      "They choose love despite family, court, rival, or reputation pressure.",
    ],
    tags: ["route_gate", "choice", "public_loyalty", "devotion"],
    relatedSeeds: [
      "desire_to_be_chosen",
      "chosen_above_everyone",
      "public_loyalty_beat",
      "relationship_named_gate",
    ],
    oppositeSeeds: [
      "secret_shame_dynamic",
      "emotional_ambiguity",
      "chosen_last",
    ],
    romanceHooks: [
      "public_choice_confession",
      "no_more_hiding",
      "i_choose_you_scene",
    ],
    scenarioHooks: [
      "rival_forces_choice",
      "family_vs_love_choice",
      "public_scandal_choice",
    ],
    dialoguePatterns: [
      "Let them see.",
      "I am done hiding what matters.",
      "I choose you because it is true.",
    ],
    gateType: "choice",
    unlocksRoutePhases: [
      "confession_or_escalation",
      "integration_phase",
    ],
    activatedByWounds: ["rejection_wound", "replacement_wound"],
    activatedByFears: [
      "fear_of_replacement",
      "fear_of_being_chosen_last",
    ],
    fulfillsDesires: [
      "desire_to_be_chosen",
      "desire_for_devotion",
      "desire_to_be_prioritized",
    ],
    satisfiesHiddenNeeds: [
      "need_for_public_loyalty",
      "need_for_recommitment",
    ],
    likelyTriggers: [
      "rival_attention_trigger",
      "relationship_exposure_trigger",
    ],
    likelyResponses: [
      "jealousy_suppression_response",
      "priority_testing_response",
    ],
    compatibleRepairBeats: [
      "public_loyalty_beat",
      "recommitment_beat",
    ],
    compatibleGrowthArcs: [
      "learning_to_be_loved",
      "learning_they_are_enough",
    ],
    successSignals: [
      "choice_is_clear",
      "choice_has_cost",
      "private_care_matches_public_loyalty",
    ],
    failureSignals: [
      "public_claim_without_private_respect",
      "choice_used_as_ownership",
    ],
    milestoneMemories: [
      "first_public_choice_memory",
      "chosen_above_others_memory",
    ],
    metadata: {
      importance: "critical",
      romanceValue: 10,
      angstValue: 8,
      healingValue: 10,
      routeProgressValue: 10,
    },
  },
  trust_rebuilt_gate: {
    description:
      "A route gate where damaged trust is no longer repaired by apology alone, but by enough truthful follow-through to make closeness possible again.",
    examples: [
      "A promise is kept when breaking it would be easier.",
      "The betrayer tells the truth before being cornered.",
      "The hurt character chooses cautious trust without pretending the rupture never happened.",
    ],
    tags: ["route_gate", "trust", "repair", "earned_safety"],
    relatedSeeds: [
      "betrayal_wound",
      "need_for_accountability",
      "promise_kept_beat",
      "trust_rebuilt_and_earned",
    ],
    oppositeSeeds: [
      "empty_apology",
      "accountability_without_change",
      "repair_bypassing",
    ],
    romanceHooks: [
      "trust_rebuild_romance",
      "promise_kept_under_pressure",
      "earned_second_chance",
    ],
    scenarioHooks: [
      "post_betrayal_follow_through",
      "truth_before_discovery",
      "kept_promise_scene",
    ],
    dialoguePatterns: [
      "I am not asking you to forget.",
      "Let me prove it before you believe me.",
      "This time, the truth comes first.",
    ],
    gateType: "trust",
    unlocksRoutePhases: ["integration_phase", "earned_intimacy_phase"],
    activatedByWounds: ["betrayal_wound", "broken_promise_wound"],
    activatedByFears: ["fear_of_betrayal", "fear_of_being_used"],
    fulfillsDesires: [
      "desire_for_truth",
      "desire_for_reliable_love",
      "desire_for_emotional_safety",
    ],
    satisfiesHiddenNeeds: [
      "need_for_accountability",
      "need_for_changed_behavior",
      "need_for_consistency",
    ],
    likelyTriggers: [
      "broken_promise_trigger",
      "secret_revealed_trigger",
    ],
    likelyResponses: [
      "trust_testing_response",
      "emotional_lockdown_response",
    ],
    compatibleRepairBeats: [
      "accountability_beat",
      "promise_kept_beat",
      "changed_behavior_beat",
    ],
    compatibleGrowthArcs: [
      "learning_to_trust_again",
      "learning_accountability",
    ],
    successSignals: [
      "truth_is_offered_early",
      "behavior_matches_words",
      "trust_returns_without_pressure",
    ],
    failureSignals: [
      "forgiveness_is_rushed",
      "old_pattern_repeats",
      "truth_is_withheld_until_discovered",
    ],
    milestoneMemories: [
      "first_kept_promise_after_betrayal_memory",
      "trust_rebuilt_memory",
    ],
    metadata: {
      importance: "critical",
      romanceValue: 9,
      angstValue: 9,
      healingValue: 10,
      routeProgressValue: 10,
    },
  },
  secure_return_gate: {
    description:
      "A route gate where distance, absence, or conflict is followed by a reliable return, teaching the relationship that separation does not have to mean abandonment.",
    examples: [
      "Someone asks for space and comes back when they said they would.",
      "A goodbye is followed by a calm return ritual.",
      "The partner repairs silence without making the fear seem foolish.",
    ],
    tags: ["route_gate", "secure_return", "attachment", "healing"],
    relatedSeeds: [
      "abandonment_wound",
      "need_for_safe_return",
      "i_am_not_leaving_beat",
      "safe_person_forever",
    ],
    oppositeSeeds: [
      "ghosting_response",
      "silent_treatment",
      "unreliable_return",
    ],
    romanceHooks: [
      "return_as_romance",
      "space_then_return",
      "learning_distance_is_not_abandonment",
    ],
    scenarioHooks: [
      "after_temporary_separation",
      "post_argument_return",
      "goodnight_ritual_restored",
    ],
    dialoguePatterns: [
      "I said I would come back.",
      "I needed space. I did not stop caring.",
      "You do not have to chase me to make me return.",
    ],
    gateType: "reassurance",
    unlocksRoutePhases: ["integration_phase", "secure_attachment_phase"],
    activatedByWounds: ["abandonment_wound", "emotional_neglect_wound"],
    activatedByFears: ["fear_of_abandonment", "fear_of_emotional_distance"],
    fulfillsDesires: [
      "desire_for_reliable_love",
      "desire_for_home",
    ],
    satisfiesHiddenNeeds: [
      "need_for_safe_return",
      "need_for_consistency",
      "need_for_reassurance",
    ],
    likelyTriggers: [
      "goodbye_trigger",
      "temporary_separation_trigger",
      "unanswered_message_trigger",
    ],
    likelyResponses: [
      "panic_spiral_response",
      "preemptive_withdrawal_response",
    ],
    compatibleRepairBeats: [
      "i_am_not_leaving_beat",
      "return_after_leaving_beat",
      "consistency_beat",
    ],
    compatibleGrowthArcs: [
      "learning_secure_attachment",
      "learning_distance_is_not_abandonment",
    ],
    successSignals: [
      "return_happens_without_chase",
      "space_is_named_cleanly",
      "panic_decreases_next_time",
    ],
    failureSignals: [
      "space_becomes_punishment",
      "return_window_is_broken",
      "absence_is_left_unexplained",
    ],
    milestoneMemories: [
      "first_reliable_return_memory",
      "first_space_without_abandonment_memory",
    ],
    metadata: {
      importance: "critical",
      romanceValue: 9,
      angstValue: 7,
      healingValue: 10,
      routeProgressValue: 10,
    },
  },
  earned_happy_ending_gate: {
    description:
      "A payoff gate where the relationship has survived enough truth, rupture, repair, and choice to feel earned rather than granted by convenience.",
    examples: [
      "They choose a shared life after the route's core fear has been faced.",
      "Their ending preserves agency instead of erasing old wounds.",
      "The final scene proves the relationship has become a stable identity.",
    ],
    tags: ["route_gate", "payoff", "earned_ending", "integration"],
    relatedSeeds: [
      "earned_happy_ending",
      "mutual_devotion",
      "secure_return_gate",
      "relationship_named_gate",
    ],
    oppositeSeeds: [
      "unearned_forgiveness",
      "sudden_personality_rewrite",
      "romance_without_repair",
    ],
    romanceHooks: [
      "earned_happy_ending",
      "forever_feels_safe",
      "domestic_happiness_after_chaos",
    ],
    scenarioHooks: [
      "final_choice_scene",
      "quiet_domestic_epilogue",
      "public_and_private_bond_aligned",
    ],
    dialoguePatterns: [
      "We built this.",
      "It is not perfect. It is ours.",
      "This time, staying feels like freedom.",
    ],
    gateType: "payoff",
    unlocksRoutePhases: ["ending_integration"],
    requiredBefore: [],
    blockedBy: [
      "unrepaired_core_rupture",
      "agency_erased_for_romance",
      "growth_without_cost",
    ],
    fulfillsDesires: [
      "desire_for_home",
      "desire_for_partnership",
      "desire_for_reliable_love",
    ],
    satisfiesHiddenNeeds: [
      "need_for_recommitment",
      "need_for_consistency",
      "need_for_emotional_presence",
    ],
    compatibleRepairBeats: [
      "recommitment_beat",
      "changed_behavior_beat",
      "mutual_choice_beat",
    ],
    compatibleGrowthArcs: [
      "learning_to_stay",
      "learning_to_receive_love",
      "learning_secure_attachment",
    ],
    successSignals: [
      "core_fear_has_been_met_with_growth",
      "relationship_identity_is_stable",
      "love_preserves_both_people",
    ],
    failureSignals: [
      "ending_skips_accountability",
      "one_partner_disappears_into_the_other",
      "payoff_arrives_without_route_memory",
    ],
    milestoneMemories: [
      "earned_happy_ending_memory",
      "first_safe_future_memory",
    ],
    metadata: {
      importance: "critical",
      romanceValue: 10,
      angstValue: 4,
      healingValue: 10,
      routeProgressValue: 10,
    },
  },
};

export const ROUTE_GATE_SEEDS = Object.freeze(
  routeGatePresets.map((label) => {
    const seed = toSeedId(label);
    const gateType = inferRouteGateType(seed);
    const override = ROUTE_GATE_OVERRIDES[seed] ?? {};

    return createRouteGateSeedPreset({
      seed,
      label,
      description: defaultRouteGateDescription(label, gateType),
      examples: defaultRouteGateExamples(label, gateType),
      tags: ["route_gate", gateType, seed],
      relatedSeeds: defaultRelatedSeeds(seed, gateType),
      oppositeSeeds: defaultOppositeSeeds(gateType),
      romanceHooks: defaultRomanceHooks(seed, gateType),
      scenarioHooks: defaultScenarioHooks(seed, gateType),
      dialoguePatterns: defaultDialoguePatterns(label, gateType),
      gateType,
      unlocksRoutePhases: defaultUnlocksRoutePhases(seed, gateType),
      requiredBefore: defaultRequiredBefore(seed, gateType),
      blockedBy: defaultBlockedBy(gateType),
      activatedByWounds: defaultActivatedWounds(gateType),
      activatedByFears: defaultActivatedFears(gateType),
      fulfillsDesires: defaultFulfillsDesires(gateType),
      satisfiesHiddenNeeds: defaultSatisfiesHiddenNeeds(gateType),
      likelyTriggers: defaultLikelyTriggers(gateType),
      likelyResponses: defaultLikelyResponses(gateType),
      compatibleRepairBeats: defaultCompatibleRepairBeats(gateType),
      compatibleGrowthArcs: defaultCompatibleGrowthArcs(gateType),
      successSignals: defaultSuccessSignals(gateType),
      failureSignals: defaultFailureSignals(gateType),
      milestoneMemories: [`${seed.replace(/_gate$/, "")}_memory`],
      metadata: {
        importance: defaultImportance(gateType),
        romanceValue: defaultRomanceValue(gateType),
        angstValue: defaultAngstValue(gateType),
        healingValue: defaultHealingValue(gateType),
        routeProgressValue: defaultRouteProgressValue(gateType),
      },
      ...override,
    });
  }),
) satisfies readonly RouteGateSeed[];

export const ROUTE_GATE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  ROUTE_GATE_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Gate type: ${seed.gateType}.`,
        `Route importance: ${seed.metadata.importance}.`,
      ].join(" "),
      examples: seed.examples,
      tags: [
        ...seed.tags,
        seed.gateType,
        `importance:${seed.metadata.importance}`,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.unlocksRoutePhases,
        ...seed.activatedByWounds,
        ...seed.activatedByFears,
        ...seed.fulfillsDesires,
        ...seed.satisfiesHiddenNeeds,
        ...seed.likelyResponses,
        ...seed.compatibleRepairBeats,
        ...seed.compatibleGrowthArcs,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.blockedBy,
        ...seed.failureSignals,
      ],
      romanceHooks: [
        ...seed.romanceHooks,
        ...seed.successSignals,
      ],
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.likelyTriggers,
        ...seed.requiredBefore,
        ...seed.milestoneMemories,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: routeGateImportanceToRarity(seed.metadata.importance),
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.angstValue,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function findRouteGateSeedBySeed(
  seedId: string,
): RouteGateSeed | undefined {
  return ROUTE_GATE_SEEDS.find((seed) => seed.seed === seedId);
}

export function getRouteGateSeedsByCategory(
  category: RouteGateSeedType,
): readonly RouteGateSeed[] {
  const ids = new Set<string>(routeGateCategories[category]);
  return ROUTE_GATE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRouteGateSeedsByType(
  gateType: RouteGateSeedType,
): readonly RouteGateSeed[] {
  return ROUTE_GATE_SEEDS.filter((seed) => seed.gateType === gateType);
}

function inferRouteGateType(seed: string): RouteGateSeedType {
  for (const [category, seedIds] of Object.entries(routeGateCategories)) {
    if ((seedIds as readonly string[]).includes(seed)) {
      return category as RouteGateSeedType;
    }
  }
  return "integration";
}

function defaultRouteGateDescription(
  label: string,
  gateType: RouteGateSeedType,
): string {
  return `A ${gateType.replace(/_/g, " ")} route gate where ${label.toLowerCase()} marks a concrete shift in the relationship, turning emotional pressure into visible route progress.`;
}

function defaultRouteGateExamples(
  label: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  return [
    `${label} appears after enough scene pressure to make the change feel earned.`,
    `The characters cannot move cleanly into the next route phase until this ${gateType} proof lands.`,
    `A small action, line, or choice becomes the memory that proves the route has changed.`,
  ];
}

function defaultRelatedSeeds(
  seed: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  return [
    `${gateType}_route_pressure`,
    `${gateType}_milestone_memory`,
    seed.replace(/_gate$/, "_route_gate"),
  ];
}

function defaultOppositeSeeds(gateType: RouteGateSeedType): readonly string[] {
  return [
    `${gateType}_avoidance`,
    "route_stagnation",
    "unearned_progress",
  ];
}

function defaultRomanceHooks(
  seed: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  return [
    seed.replace(/_gate$/, "_scene"),
    `${gateType}_turns_intimate`,
    "small_proof_becomes_romance",
  ];
}

function defaultScenarioHooks(
  seed: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  return [
    seed.replace(/_gate$/, "_scenario"),
    `${gateType}_route_checkpoint`,
    "route_memory_created",
  ];
}

function defaultDialoguePatterns(
  label: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  const normalized = label.replace(/ Gate$/, "").toLowerCase();
  if (gateType === "confession") {
    return [
      "I was trying not to say it.",
      "Then say it now.",
      "I want this to be real.",
    ];
  }
  if (gateType === "boundary") {
    return [
      "I heard you the first time.",
      "You do not have to push to be taken seriously.",
      "Your no is enough.",
    ];
  }
  if (gateType === "repair") {
    return [
      "I am not here to make you forgive me.",
      "I am here to make it right.",
      "Then start with the truth.",
    ];
  }
  return [
    `This is the ${normalized}.`,
    "I know it looks small.",
    "It does not feel small to me.",
  ];
}

function defaultUnlocksRoutePhases(
  seed: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  if (seed === "first_meeting_gate" || seed === "first_spark_gate") {
    return ["initial_dynamic", "friction_or_spark"];
  }
  if (gateType === "repair") {
    return ["repair_phase", "trust_rebuilding_phase"];
  }
  if (gateType === "confession" || gateType === "choice") {
    return ["confession_or_escalation", "integration_phase"];
  }
  if (gateType === "payoff") {
    return ["ending_integration"];
  }
  return ["repeated_contact", "emotional_investment"];
}

function defaultRequiredBefore(
  seed: string,
  gateType: RouteGateSeedType,
): readonly string[] {
  if (gateType === "opening") {
    return ["first_trust_test_gate"];
  }
  if (gateType === "trust" || gateType === "boundary") {
    return ["first_vulnerability_leak_gate"];
  }
  if (gateType === "repair") {
    return ["trust_rebuilt_gate"];
  }
  if (gateType === "choice") {
    return ["relationship_named_gate"];
  }
  if (seed === "relationship_named_gate") {
    return ["earned_happy_ending_gate"];
  }
  return [];
}

function defaultBlockedBy(gateType: RouteGateSeedType): readonly string[] {
  return [
    `${gateType}_proof_is_missing`,
    "agency_is_overridden",
    "route_pressure_is_skipped",
  ];
}

function defaultActivatedWounds(gateType: RouteGateSeedType): readonly string[] {
  if (gateType === "reassurance") return ["abandonment_wound"];
  if (gateType === "trust") return ["betrayal_wound"];
  if (gateType === "boundary") return ["control_wound"];
  if (gateType === "choice") return ["rejection_wound"];
  if (gateType === "vulnerability") return ["emotional_neglect_wound"];
  return [];
}

function defaultActivatedFears(gateType: RouteGateSeedType): readonly string[] {
  if (gateType === "reassurance") return ["fear_of_abandonment"];
  if (gateType === "trust") return ["fear_of_betrayal"];
  if (gateType === "boundary") return ["fear_of_control"];
  if (gateType === "choice") return ["fear_of_replacement"];
  if (gateType === "vulnerability") return ["fear_of_vulnerability"];
  return [];
}

function defaultFulfillsDesires(gateType: RouteGateSeedType): readonly string[] {
  if (gateType === "choice") return ["desire_to_be_chosen"];
  if (gateType === "reassurance") return ["desire_for_reliable_love"];
  if (gateType === "trust") return ["desire_for_truth"];
  if (gateType === "payoff") return ["desire_for_home"];
  return ["desire_for_connection"];
}

function defaultSatisfiesHiddenNeeds(
  gateType: RouteGateSeedType,
): readonly string[] {
  if (gateType === "repair") return ["need_for_accountability"];
  if (gateType === "boundary") return ["need_for_boundary_respect"];
  if (gateType === "reassurance") return ["need_for_reassurance"];
  if (gateType === "choice") return ["need_for_public_loyalty"];
  return ["need_for_emotional_presence"];
}

function defaultLikelyTriggers(gateType: RouteGateSeedType): readonly string[] {
  if (gateType === "reassurance") return ["unanswered_message_trigger"];
  if (gateType === "trust") return ["broken_promise_trigger"];
  if (gateType === "boundary") return ["loss_of_choice_trigger"];
  if (gateType === "choice") return ["rival_attention_trigger"];
  if (gateType === "conflict") return ["cold_tone_trigger"];
  return [];
}

function defaultLikelyResponses(gateType: RouteGateSeedType): readonly string[] {
  if (gateType === "reassurance") return ["reassurance_seeking_response"];
  if (gateType === "trust") return ["trust_testing_response"];
  if (gateType === "boundary") return ["boundary_assertion_response"];
  if (gateType === "repair") return ["accountability_response"];
  if (gateType === "vulnerability") return ["emotional_withdrawal_response"];
  return [];
}

function defaultCompatibleRepairBeats(
  gateType: RouteGateSeedType,
): readonly string[] {
  if (gateType === "repair") return ["accountability_beat"];
  if (gateType === "reassurance") return ["i_am_not_leaving_beat"];
  if (gateType === "boundary") return ["boundary_respected_beat"];
  if (gateType === "trust") return ["promise_kept_beat"];
  if (gateType === "choice") return ["public_loyalty_beat"];
  return [];
}

function defaultCompatibleGrowthArcs(
  gateType: RouteGateSeedType,
): readonly string[] {
  if (gateType === "trust") return ["learning_to_trust"];
  if (gateType === "reassurance") return ["learning_secure_attachment"];
  if (gateType === "boundary") return ["learning_boundaries"];
  if (gateType === "payoff") return ["learning_to_stay"];
  return ["learning_to_be_seen"];
}

function defaultSuccessSignals(gateType: RouteGateSeedType): readonly string[] {
  return [
    `${gateType}_proof_lands`,
    "character_behavior_changes_afterward",
    "route_memory_is_created",
  ];
}

function defaultFailureSignals(gateType: RouteGateSeedType): readonly string[] {
  return [
    `${gateType}_moment_is_undercut`,
    "old_pattern_reasserts_itself",
    "progress_is_declared_but_not_behaved",
  ];
}

function defaultImportance(gateType: RouteGateSeedType) {
  if (gateType === "payoff" || gateType === "commitment") return "critical";
  if (gateType === "repair" || gateType === "choice" || gateType === "confession") {
    return "major";
  }
  if (gateType === "opening") return "minor";
  return "moderate";
}

function defaultRomanceValue(gateType: RouteGateSeedType): number {
  if (gateType === "payoff" || gateType === "choice" || gateType === "confession") {
    return 10;
  }
  if (gateType === "reassurance" || gateType === "vulnerability") return 9;
  return 7;
}

function defaultAngstValue(gateType: RouteGateSeedType): number {
  if (gateType === "rupture" || gateType === "conflict") return 9;
  if (gateType === "repair" || gateType === "trust") return 8;
  if (gateType === "payoff") return 4;
  return 6;
}

function defaultHealingValue(gateType: RouteGateSeedType): number {
  if (gateType === "repair" || gateType === "reassurance" || gateType === "payoff") {
    return 10;
  }
  if (gateType === "trust" || gateType === "boundary" || gateType === "vulnerability") {
    return 9;
  }
  return 7;
}

function defaultRouteProgressValue(gateType: RouteGateSeedType): number {
  if (gateType === "payoff" || gateType === "commitment") return 10;
  if (gateType === "choice" || gateType === "repair" || gateType === "confession") {
    return 9;
  }
  return 7;
}

function routeGateImportanceToRarity(
  importance: RouteGateSeed["metadata"]["importance"],
) {
  if (importance === "critical") return "rare";
  if (importance === "major") return "uncommon";
  return "common";
}

function toSeedId(label: string): string {
  return label
    .replace(/&/g, "and")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}
