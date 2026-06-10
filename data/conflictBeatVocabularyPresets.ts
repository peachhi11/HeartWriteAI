import {
  createConflictBeatSeedPreset,
  createVocabularySeedPreset,
  type ConflictBeatSeed,
  type ConflictBeatSeedInput,
  type ConflictBeatSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const conflictBeatSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Conflict Style",
  "Route Phase",
  "Conflict Beat",
  "Rupture Severity",
  "Repair Style",
  "Milestone Memory",
  "Growth Arc",
] as const;

export const conflictBeatPresets = [
  "Misread Motive",
  "Bad First Impression",
  "Protective Lie",
  "Secret Nearly Exposed",
  "Trust Test Failed",
  "Broken Promise",
  "Delayed Reply Spiral",
  "Cancelled Plan Hurt",
  "Jealousy Misread",
  "Rival Attention",
  "Being Chosen Last",
  "Boundary Crossed",
  "Space Misread as Rejection",
  "Care Misread as Control",
  "Teasing Goes Too Far",
  "Public Embarrassment",
  "Private Betrayal",
  "Emotional Withdrawal",
  "Cold Silence",
  "Defensive Argument",
  "Old Wound Triggered",
  "Vulnerability Hangover",
  "Confession Panic",
  "Duty vs Love Choice",
  "Family vs Love Choice",
  "Love vs Reputation Choice",
  "Public Side Taken",
  "Forced Separation",
  "Near-Loss Realization",
  "Darkest Moment Rupture",
] as const;

export const conflictBeatCategories = {
  misunderstanding: [
    "misread_motive",
    "bad_first_impression",
    "jealousy_misread",
    "care_misread_as_control",
    "space_misread_as_rejection",
    "teasing_goes_too_far",
  ],
  trust_test: [
    "trust_test_failed",
    "broken_promise",
    "protective_lie",
    "secret_nearly_exposed",
  ],
  jealousy: [
    "rival_attention",
    "being_chosen_last",
  ],
  betrayal: [
    "private_betrayal",
  ],
  withdrawal: [
    "emotional_withdrawal",
    "cold_silence",
    "vulnerability_hangover",
  ],
  argument: [
    "defensive_argument",
    "old_wound_triggered",
  ],
  boundary: [
    "boundary_crossed",
  ],
  secret: [
    "secret_nearly_exposed",
    "protective_lie",
  ],
  choice: [
    "duty_vs_love_choice",
    "family_vs_love_choice",
    "love_vs_reputation_choice",
    "public_side_taken",
  ],
  separation: [
    "delayed_reply_spiral",
    "cancelled_plan_hurt",
    "forced_separation",
  ],
  public_pressure: [
    "public_embarrassment",
  ],
  near_loss: [
    "near_loss_realization",
  ],
  rupture: [
    "darkest_moment_rupture",
    "confession_panic",
  ],
} as const satisfies Record<ConflictBeatSeedType, readonly string[]>;

export const conflictBeatExpansionLogic = {
  wound_to_conflict_beat: {
    abandonment_wound: [
      "delayed_reply_spiral",
      "cancelled_plan_hurt",
      "space_misread_as_rejection",
      "forced_separation",
    ],
    betrayal_wound: [
      "protective_lie",
      "secret_nearly_exposed",
      "trust_test_failed",
      "private_betrayal",
    ],
    rejection_wound: [
      "being_chosen_last",
      "jealousy_misread",
      "bad_first_impression",
      "confession_panic",
    ],
    humiliation_wound: [
      "public_embarrassment",
      "teasing_goes_too_far",
      "defensive_argument",
      "vulnerability_hangover",
    ],
    control_wound: [
      "boundary_crossed",
      "care_misread_as_control",
      "defensive_argument",
    ],
  },
  fear_to_conflict_beat: {
    fear_of_abandonment: [
      "delayed_reply_spiral",
      "space_misread_as_rejection",
      "forced_separation",
    ],
    fear_of_betrayal: [
      "trust_test_failed",
      "protective_lie",
      "secret_nearly_exposed",
    ],
    fear_of_replacement: [
      "rival_attention",
      "being_chosen_last",
      "jealousy_misread",
    ],
    fear_of_vulnerability: [
      "vulnerability_hangover",
      "confession_panic",
      "emotional_withdrawal",
    ],
    fear_of_being_controlled: [
      "boundary_crossed",
      "care_misread_as_control",
    ],
  },
  response_to_conflict_beat: {
    panic_spiral_response: [
      "delayed_reply_spiral",
      "defensive_argument",
    ],
    emotional_withdrawal_response: [
      "cold_silence",
      "space_misread_as_rejection",
    ],
    trust_testing_response: [
      "trust_test_failed",
      "jealousy_misread",
    ],
    defensive_anger_response: [
      "defensive_argument",
      "teasing_goes_too_far",
    ],
    people_pleasing_response: [
      "being_chosen_last",
      "boundary_crossed",
    ],
  },
  conflict_beat_to_repair_style: {
    delayed_reply_spiral: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "check_in_ritual_repair",
    ],
    broken_promise: [
      "accountability_repair",
      "behavior_change_repair",
      "consistency_repair",
    ],
    protective_lie: [
      "truth_telling_repair",
      "accountability_repair",
      "boundary_reset_repair",
    ],
    public_embarrassment: [
      "dignity_restoration_repair",
      "private_comfort_repair",
      "public_support_repair",
    ],
    boundary_crossed: [
      "boundary_respect_repair",
      "choice_restoration_repair",
      "space_based_repair",
    ],
    jealousy_misread: [
      "priority_reassurance_repair",
      "clarification_repair",
      "chosen_again_repair",
    ],
  },
} as const;

type ConflictBeatOverride = Partial<ConflictBeatSeedInput> & {
  label?: string;
};

const CONFLICT_BEAT_OVERRIDES: Record<string, ConflictBeatOverride> = {
  delayed_reply_spiral: {
    label: "Delayed Reply Spiral",
    description:
      "A delayed response is interpreted as emotional distance, rejection, or abandonment, escalating into panic, withdrawal, or accusation.",
    examples: [
      "A goodnight text never arrives.",
      "A message is read but unanswered.",
      "One character assumes silence means the relationship has changed.",
    ],
    tags: ["conflict_beat", "attachment", "abandonment", "miscommunication"],
    relatedSeeds: [
      "unanswered_message_trigger",
      "fear_of_abandonment",
      "panic_spiral_response",
      "verbal_reassurance_repair",
    ],
    oppositeSeeds: ["secure_waiting", "consistent_check_in", "reliable_return"],
    romanceHooks: [
      "late_reply_reassurance",
      "i_am_not_leaving_scene",
      "goodnight_ritual_restored",
    ],
    scenarioHooks: [
      "missed_message_scene",
      "post_argument_silence",
      "temporary_separation",
    ],
    dialoguePatterns: [
      "You did not answer.",
      "I thought something changed.",
      "I know it was only a message, but it did not feel small.",
    ],
    beatType: "separation",
    emotionalFunction:
      "Turns ordinary distance into evidence of emotional insecurity so the relationship must define what reliable return means.",
    hiddenQuestion:
      "Will you still come back when I cannot see you?",
    activatesWounds: ["abandonment_wound", "emotional_neglect_wound"],
    activatesFears: [
      "fear_of_abandonment",
      "fear_of_rejection",
      "fear_of_emotional_distance",
    ],
    activatesDesires: [
      "desire_for_reliable_love",
      "desire_to_be_prioritized",
      "desire_for_emotional_presence",
    ],
    commonTriggers: [
      "unanswered_message_trigger",
      "delayed_reply_trigger",
      "missed_check_in_ritual",
    ],
    likelyResponses: [
      "panic_spiral_response",
      "reassurance_seeking_response",
      "preemptive_withdrawal_response",
    ],
    compatibleConflictStyles: [
      "pursuer_conflict_style",
      "fearful_push_pull_conflict_style",
    ],
    compatibleRepairStyles: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "check_in_ritual_repair",
    ],
    compatibleRoutePhases: [
      "trust_testing_phase",
      "emotional_investment",
      "repair_phase",
    ],
    compatibleTropes: [
      "slow_burn",
      "hurt_comfort",
      "second_chance_romance",
      "safe_person_romance",
    ],
    escalationPath: [
      "silence_noticed",
      "fear_meaning_assigned",
      "evidence_searched",
      "response_attempted",
      "conflict_or_repair",
    ],
    ruptureRisks: [
      "accusation_without_context",
      "partner_feels_controlled",
      "withdrawal_confirms_fear",
    ],
    repairNeeds: [
      "clear_explanation",
      "emotional_reassurance",
      "future_check_in_expectation",
      "no_mocking_need",
    ],
    growthPotential: [
      "learns_delay_is_not_abandonment",
      "asks_directly_for_reassurance",
      "creates_secure_return_ritual",
    ],
    routeGates: [
      "first_silence_conflict_gate",
      "first_return_reassurance_gate",
      "secure_waiting_gate",
    ],
    milestoneMemories: [
      "first_reassurance_after_silence_memory",
      "check_in_ritual_created_memory",
    ],
    metadata: {
      category: "conflict_beat",
      intensity: "medium",
      ruptureRisk: 6,
      angstValue: 8,
      chemistryValue: 5,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
};

export const CONFLICT_BEAT_SEEDS = Object.freeze(
  getUniqueConflictBeatIds().map((seed) =>
    createConflictBeatSeedPreset(buildConflictBeatInput(seed)),
  ),
) satisfies readonly ConflictBeatSeed[];

export const CONFLICT_BEAT_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  CONFLICT_BEAT_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional function: ${seed.emotionalFunction}.`,
        `Hidden question: ${seed.hiddenQuestion}.`,
      ].join(" "),
      examples: [...seed.examples, ...seed.escalationPath.slice(0, 2)],
      tags: ["conflict_beat", seed.beatType, ...seed.tags],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.activatesWounds,
        ...seed.activatesFears,
        ...seed.compatibleRepairStyles,
        ...seed.compatibleTropes,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.ruptureRisks,
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
        rarity: seed.metadata.intensity === "low" ? "common" : "uncommon",
        romanceValue: seed.metadata.healingValue,
        conflictPotential: seed.metadata.ruptureRisk,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getConflictBeatSeedsByCategory(
  beatType: ConflictBeatSeedType,
): readonly ConflictBeatSeed[] {
  const ids = new Set<string>(conflictBeatCategories[beatType]);
  return CONFLICT_BEAT_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getConflictBeatSeedsByType(
  beatType: ConflictBeatSeedType,
): readonly ConflictBeatSeed[] {
  return CONFLICT_BEAT_SEEDS.filter((seed) => seed.beatType === beatType);
}

export function findConflictBeatSeedBySeed(
  seedId: string,
): ConflictBeatSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return CONFLICT_BEAT_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueConflictBeatIds(): readonly string[] {
  return Array.from(new Set(Object.values(conflictBeatCategories).flat()));
}

function buildConflictBeatInput(seed: string): ConflictBeatSeedInput {
  const beatType = inferConflictBeatType(seed);
  const label = conflictBeatLabel(seed);
  const override = CONFLICT_BEAT_OVERRIDES[seed] ?? {};
  const base: ConflictBeatSeedInput = {
    seed,
    label,
    description:
      `A conflict beat where ${label.toLowerCase()} pressures the relationship and tests whether the characters can move toward repair instead of rupture.`,
    examples: [
      "The beat gives the scene a specific emotional pressure point.",
      "The conflict creates a repair need rather than ending the route by itself.",
    ],
    tags: ["conflict_beat", beatType, seed],
    relatedSeeds: defaultActivatesWounds(beatType),
    oppositeSeeds: defaultOppositeSeeds(beatType),
    romanceHooks: [`${seed}_repair_scene`, `${beatType}_conflict_romance`],
    scenarioHooks: [`${seed}_scene`, `${seed}_aftermath`],
    dialoguePatterns: defaultDialoguePatterns(beatType),
    beatType,
    emotionalFunction: defaultEmotionalFunction(beatType),
    hiddenQuestion: defaultHiddenQuestion(beatType),
    activatesWounds: defaultActivatesWounds(beatType),
    activatesFears: defaultActivatesFears(beatType),
    activatesDesires: defaultActivatesDesires(beatType),
    commonTriggers: defaultCommonTriggers(beatType),
    likelyResponses: defaultLikelyResponses(beatType),
    compatibleConflictStyles: defaultCompatibleConflictStyles(beatType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(beatType),
    compatibleRoutePhases: defaultCompatibleRoutePhases(beatType),
    compatibleTropes: defaultCompatibleTropes(beatType),
    escalationPath: defaultEscalationPath(beatType),
    ruptureRisks: defaultRuptureRisks(beatType),
    repairNeeds: defaultRepairNeeds(beatType),
    growthPotential: defaultGrowthPotential(beatType),
    routeGates: [`${seed}_gate`, `${seed}_repair_gate`],
    milestoneMemories: [`${seed}_memory`, `${seed}_repair_memory`],
    metadata: {
      category: "conflict_beat",
      intensity: defaultIntensity(beatType),
      ruptureRisk: defaultRuptureRisk(beatType),
      angstValue: defaultAngstValue(beatType),
      chemistryValue: defaultChemistryValue(beatType),
      healingValue: defaultHealingValue(beatType),
      pacingPressure: defaultPacingPressure(beatType),
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

function inferConflictBeatType(seed: string): ConflictBeatSeedType {
  for (const [beatType, seeds] of Object.entries(conflictBeatCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return beatType as ConflictBeatSeedType;
    }
  }

  return "rupture";
}

function conflictBeatLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(" Vs ", " vs ")
    .replace(" Near Loss ", " Near-Loss ");
}

function defaultOppositeSeeds(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["secure_return", "consistent_check_in"];
    case "boundary":
      return ["boundary_respected", "choice_restored"];
    case "betrayal":
    case "trust_test":
    case "secret":
      return ["earned_trust", "transparent_repair"];
    default:
      return [`resolved_${beatType}_beat`, "safe_repair"];
  }
}

function defaultDialoguePatterns(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["You did not answer.", "I thought something changed."];
    case "boundary":
      return ["That was not yours to decide.", "I needed a choice."];
    case "jealousy":
      return ["You looked happier with them.", "I know how that sounds."];
    case "trust_test":
      return ["I should not have tested you. I was scared."];
    default:
      return ["This is not about winning.", "Then tell me what it is really about."];
  }
}

function defaultEmotionalFunction(beatType: ConflictBeatSeedType): string {
  switch (beatType) {
    case "misunderstanding":
      return "Turns incomplete information into emotional pressure that needs clarification.";
    case "trust_test":
      return "Makes fear ask for proof in a way that may damage the bond.";
    case "jealousy":
      return "Turns divided attention into a question of priority and security.";
    case "betrayal":
      return "Forces the relationship to confront truth, harm, and accountability.";
    case "withdrawal":
      return "Makes silence carry the conflict when words feel unsafe.";
    case "argument":
      return "Pushes hidden fear into direct confrontation.";
    case "boundary":
      return "Tests whether closeness can respect agency.";
    case "secret":
      return "Lets hidden information threaten the relationship's reality.";
    case "choice":
      return "Requires a visible priority under pressure.";
    case "separation":
      return "Turns distance into a test of reliable return.";
    case "public_pressure":
      return "Makes private intimacy answer to public consequences.";
    case "near_loss":
      return "Uses danger or almost-loss to clarify emotional stakes.";
    case "rupture":
      return "Breaks the old pattern enough that repair or ending must be chosen.";
  }
}

function defaultHiddenQuestion(beatType: ConflictBeatSeedType): string {
  switch (beatType) {
    case "separation":
      return "Will you still come back when I cannot see you?";
    case "jealousy":
      return "Do I still matter when someone else is near?";
    case "boundary":
      return "Can I be loved without being controlled?";
    case "choice":
      return "Will you choose us when it costs you something?";
    default:
      return "Can the bond survive this pressure without becoming unsafe?";
  }
}

function defaultActivatesWounds(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["abandonment_wound", "emotional_neglect_wound"];
    case "betrayal":
    case "secret":
    case "trust_test":
      return ["betrayal_wound", "trust_issues"];
    case "boundary":
      return ["control_wound", "boundary_wound"];
    case "jealousy":
      return ["replacement_wound", "never_chosen_wound"];
    default:
      return ["old_wound_triggered"];
  }
}

function defaultActivatesFears(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["fear_of_abandonment", "fear_of_rejection"];
    case "jealousy":
      return ["fear_of_replacement", "fear_of_not_being_chosen"];
    case "boundary":
      return ["fear_of_being_controlled"];
    case "trust_test":
    case "secret":
    case "betrayal":
      return ["fear_of_betrayal"];
    default:
      return ["fear_of_vulnerability"];
  }
}

function defaultActivatesDesires(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["desire_for_reliable_love"];
    case "jealousy":
    case "choice":
      return ["desire_to_be_chosen"];
    case "boundary":
      return ["desire_for_autonomy"];
    default:
      return ["desire_for_repair"];
  }
}

function defaultCommonTriggers(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["unanswered_message_trigger", "goodbye_trigger"];
    case "jealousy":
      return ["rival_attention_trigger", "being_compared_trigger"];
    case "boundary":
      return ["boundary_ignored_trigger", "loss_of_choice_trigger"];
    default:
      return [`${beatType}_trigger`];
  }
}

function defaultLikelyResponses(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["panic_spiral_response", "reassurance_seeking_response"];
    case "boundary":
      return ["boundary_assertion_response", "defensive_anger_response"];
    case "withdrawal":
      return ["emotional_withdrawal_response", "cold_silence_response"];
    default:
      return ["defensive_response", "repair_seeking_response"];
  }
}

function defaultCompatibleConflictStyles(
  beatType: ConflictBeatSeedType,
): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["pursuer_conflict_style", "fearful_push_pull_conflict_style"];
    case "withdrawal":
      return ["withdrawer_conflict_style"];
    default:
      return ["repair_oriented_conflict_style"];
  }
}

function defaultCompatibleRepairStyles(
  beatType: ConflictBeatSeedType,
): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["verbal_reassurance_repair", "return_and_stay_repair"];
    case "boundary":
      return ["boundary_respect_repair", "choice_restoration_repair"];
    case "betrayal":
    case "secret":
    case "trust_test":
      return ["truth_and_accountability_repair", "consistency_repair"];
    default:
      return ["validation_repair", "accountability_repair"];
  }
}

function defaultCompatibleRoutePhases(beatType: ConflictBeatSeedType): readonly string[] {
  return beatType === "rupture"
    ? ["crisis_or_choice", "repair_phase"]
    : ["friction_or_spark", "emotional_investment"];
}

function defaultCompatibleTropes(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "jealousy":
      return ["possessive_devotion", "chosen_above_others"];
    case "separation":
      return ["slow_burn", "hurt_comfort", "second_chance_romance"];
    case "choice":
      return ["forbidden_romance", "fake_relationship"];
    default:
      return ["slow_burn", "enemies_to_lovers"];
  }
}

function defaultEscalationPath(beatType: ConflictBeatSeedType): readonly string[] {
  return [
    `${beatType}_pressure_noticed`,
    "meaning_assigned",
    "response_attempted",
    "repair_or_rupture",
  ];
}

function defaultRuptureRisks(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["abandonment_rupture", "attachment_damage_consequence"];
    case "boundary":
      return ["boundary_violation_rupture", "boundary_hardening_consequence"];
    case "betrayal":
    case "secret":
    case "trust_test":
      return ["betrayal_rupture", "trust_damage_consequence"];
    default:
      return [`${beatType}_rupture_risk`];
  }
}

function defaultRepairNeeds(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["clear_explanation", "emotional_reassurance"];
    case "boundary":
      return ["choice_restoration", "boundary_respect"];
    case "betrayal":
    case "secret":
      return ["truth", "accountability"];
    default:
      return ["validation", "repair_follow_through"];
  }
}

function defaultGrowthPotential(beatType: ConflictBeatSeedType): readonly string[] {
  switch (beatType) {
    case "separation":
      return ["learning_secure_attachment", "learning_to_stay"];
    case "boundary":
      return ["learning_boundaries", "learning_autonomy"];
    case "betrayal":
    case "secret":
    case "trust_test":
      return ["learning_to_trust", "learning_repair"];
    default:
      return ["learning_safe_conflict"];
  }
}

function defaultIntensity(
  beatType: ConflictBeatSeedType,
): "low" | "medium" | "high" | "peak" {
  return beatType === "rupture" || beatType === "near_loss"
    ? "peak"
    : beatType === "betrayal" || beatType === "choice"
      ? "high"
      : "medium";
}

function defaultRuptureRisk(beatType: ConflictBeatSeedType): number {
  return beatType === "rupture" || beatType === "betrayal" ? 9 : 6;
}

function defaultAngstValue(beatType: ConflictBeatSeedType): number {
  return beatType === "near_loss" || beatType === "rupture" ? 10 : 8;
}

function defaultChemistryValue(beatType: ConflictBeatSeedType): number {
  return beatType === "jealousy" || beatType === "choice" ? 8 : 6;
}

function defaultHealingValue(beatType: ConflictBeatSeedType): number {
  return beatType === "separation" || beatType === "boundary" ? 9 : 7;
}

function defaultPacingPressure(
  beatType: ConflictBeatSeedType,
): "low" | "medium" | "high" {
  return beatType === "rupture" || beatType === "near_loss" || beatType === "choice"
    ? "high"
    : "medium";
}
