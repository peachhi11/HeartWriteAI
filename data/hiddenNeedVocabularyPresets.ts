import {
  createHiddenNeedSeedPreset,
  createVocabularySeedPreset,
  type HiddenNeedPacingPressure,
  type HiddenNeedSeed,
  type HiddenNeedSeedInput,
  type HiddenNeedSeedType,
  type HiddenNeedUrgency,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const hiddenNeedSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Hidden Need",
  "Trigger",
  "Response",
  "Relationship Dynamic",
  "Love Language",
  "Conflict Beat",
  "Repair Style",
  "Growth Arc",
  "Payoff Fantasy",
  "Relationship Identity",
] as const;

export const hiddenNeedPresets = [
  "Need for Safety",
  "Need for Reassurance",
  "Need for Consistency",
  "Need for Belonging",
  "Need to Be Chosen",
  "Need to Be Seen",
  "Need to Be Understood",
  "Need to Matter",
  "Need for Autonomy",
  "Need for Control",
  "Need for Boundaries",
  "Need for Permission to Rest",
  "Need for Emotional Presence",
  "Need for Gentle Honesty",
  "Need for Repair After Conflict",
  "Need for Reliable Return",
  "Need for Safe Touch",
  "Need for Validation",
  "Need for Mutuality",
  "Need for Unconditional Acceptance",
] as const;

export const hiddenNeedExpansionLogic = {
  wound_to_hidden_need: {
    abandonment_wound: [
      "need_for_reassurance",
      "need_for_reliable_return",
      "need_for_consistency",
    ],
    emotional_neglect_wound: [
      "need_to_be_seen",
      "need_for_emotional_presence",
      "need_to_matter",
    ],
    rejection_wound: [
      "need_to_be_chosen",
      "need_for_belonging",
      "need_for_unconditional_acceptance",
    ],
    control_wound: [
      "need_for_autonomy",
      "need_for_boundaries",
      "need_for_control",
    ],
    touch_starvation_wound: [
      "need_for_safe_touch",
      "need_for_emotional_presence",
    ],
  },
  hidden_need_to_desire: {
    need_to_be_chosen: [
      "desire_to_be_chosen",
      "desire_to_be_prioritized",
      "desire_for_devotion",
    ],
    need_for_safety: [
      "desire_for_emotional_safety",
      "desire_for_stability",
      "desire_for_home",
    ],
    need_for_autonomy: [
      "desire_for_freedom",
      "desire_for_choice",
      "desire_for_ownership_of_self",
    ],
    need_to_be_seen: [
      "desire_to_be_seen",
      "desire_to_be_understood",
      "desire_to_be_known",
    ],
  },
  hidden_need_to_repair_style: {
    need_for_reassurance: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "check_in_ritual_repair",
    ],
    need_for_boundaries: [
      "boundary_respect_repair",
      "choice_restoration_repair",
      "space_based_repair",
    ],
    need_for_emotional_presence: [
      "presence_based_repair",
      "validation_repair",
      "heart_to_heart_repair",
    ],
    need_for_safe_touch: [
      "safe_touch_repair",
      "physical_comfort_repair",
      "touch_based_grounding_repair",
    ],
  },
} as const;

export const hiddenNeedCategories = {
  safety: [
    "need_for_safety",
  ],
  attachment: [
    "need_for_reassurance",
    "need_for_consistency",
    "need_for_reliable_return",
  ],
  belonging: [
    "need_for_belonging",
  ],
  recognition: [
    "need_to_be_chosen",
    "need_to_be_seen",
    "need_to_be_understood",
    "need_to_matter",
  ],
  autonomy: [
    "need_for_autonomy",
    "need_for_control",
  ],
  boundaries: [
    "need_for_boundaries",
  ],
  rest: [
    "need_for_permission_to_rest",
  ],
  truth: [
    "need_for_gentle_honesty",
  ],
  repair: [
    "need_for_repair_after_conflict",
  ],
  touch: [
    "need_for_safe_touch",
  ],
  validation: [
    "need_for_validation",
    "need_for_emotional_presence",
  ],
  mutuality: [
    "need_for_mutuality",
  ],
  acceptance: [
    "need_for_unconditional_acceptance",
  ],
} as const satisfies Record<HiddenNeedSeedType, readonly string[]>;

type HiddenNeedOverride = Partial<HiddenNeedSeedInput> & {
  label?: string;
};

const HIDDEN_NEED_OVERRIDES: Record<string, HiddenNeedOverride> = {
  need_for_reassurance: {
    description:
      "A hidden need for clear emotional confirmation that love, safety, commitment, or belonging has not disappeared.",
    examples: [
      "Needs to hear that conflict does not mean abandonment.",
      "Softens when someone states their care directly.",
      "May ask indirectly if everything is still okay.",
    ],
    tags: [
      "hidden_need",
      "attachment",
      "reassurance",
      "emotional_safety",
    ],
    relatedSeeds: [
      "fear_of_abandonment",
      "desire_for_reliable_love",
      "verbal_reassurance_repair",
      "anxious_attachment",
    ],
    oppositeSeeds: [
      "emotional_uncertainty",
      "silent_treatment",
      "hot_cold_affection",
    ],
    romanceHooks: [
      "i_am_not_leaving_scene",
      "soft_reassurance_after_conflict",
      "promise_after_fear",
    ],
    scenarioHooks: [
      "delayed_reply_spiral",
      "post_argument_check_in",
      "temporary_separation",
    ],
    dialoguePatterns: [
      "I need to know we are okay.",
      "Tell me this did not change everything.",
      "I know it sounds small, but I need to hear it.",
    ],
    needType: "attachment",
    masksAs: [
      "clinginess",
      "overthinking",
      "jealousy",
      "testing_love",
    ],
    createdByWounds: [
      "abandonment_wound",
      "rejection_wound",
      "emotional_neglect_wound",
    ],
    drivenByFears: [
      "fear_of_abandonment",
      "fear_of_rejection",
      "fear_of_emotional_distance",
    ],
    expressedAsDesires: [
      "desire_for_reliable_love",
      "desire_to_be_chosen",
      "desire_for_emotional_presence",
    ],
    activatedByTriggers: [
      "unanswered_message_trigger",
      "cold_tone_trigger",
      "goodbye_trigger",
      "space_misread_as_rejection",
    ],
    commonResponses: [
      "reassurance_seeking_response",
      "panic_spiral_response",
      "overexplaining_response",
    ],
    loveLanguages: [
      "words_of_affirmation",
      "quality_time",
      "consistency",
      "shared_rituals",
    ],
    compatibleRepairStyles: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "presence_based_repair",
    ],
    growthArcs: [
      "learning_secure_attachment",
      "learning_to_trust",
      "learning_space_is_not_abandonment",
    ],
    unmetConsequences: [
      "reassurance_need_increase",
      "attachment_damage_consequence",
      "emotional_distance_consequence",
    ],
    fulfillmentSignals: [
      "asks_directly_instead_of_testing",
      "recovers_faster_after_distance",
      "trusts_return_promises",
    ],
    routeGates: [
      "first_reassurance_gate",
      "space_with_return_gate",
      "secure_waiting_gate",
    ],
    milestoneMemories: [
      "first_i_am_not_leaving_memory",
      "first_reassurance_received_memory",
    ],
    metadata: {
      urgency: "core",
      romanceValue: 10,
      conflictPotential: 8,
      healingValue: 10,
      pacingPressure: "high",
    },
  },
};

export const HIDDEN_NEED_SEEDS = Object.freeze(
  getUniqueHiddenNeedIds().map((seed) =>
    createHiddenNeedSeedPreset(buildHiddenNeedInput(seed)),
  ),
) satisfies readonly HiddenNeedSeed[];

export const HIDDEN_NEED_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  HIDDEN_NEED_SEEDS.map(toStandardHiddenNeedVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getHiddenNeedSeedsByCategory(
  needType: HiddenNeedSeedType,
): readonly HiddenNeedSeed[] {
  const ids = new Set<string>(hiddenNeedCategories[needType]);
  return HIDDEN_NEED_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getHiddenNeedSeedsByType(
  needType: HiddenNeedSeedType,
): readonly HiddenNeedSeed[] {
  return HIDDEN_NEED_SEEDS.filter((seed) => seed.needType === needType);
}

export function findHiddenNeedSeedBySeed(
  seedId: string,
): HiddenNeedSeed | undefined {
  return HIDDEN_NEED_SEEDS.find((seed) => seed.seed === seedId);
}

function getUniqueHiddenNeedIds(): readonly string[] {
  return Array.from(new Set(Object.values(hiddenNeedCategories).flat()));
}

function buildHiddenNeedInput(seed: string): HiddenNeedSeedInput {
  const needType = inferHiddenNeedType(seed);
  const label = hiddenNeedLabel(seed);
  const base: HiddenNeedSeedInput = {
    seed,
    label,
    description: defaultDescription(label, needType),
    examples: defaultExamples(label, needType),
    tags: [
      "hidden_need",
      needType,
      "relationship_engine",
      "story_psychology",
    ],
    relatedSeeds: defaultRelatedSeeds(seed, needType),
    oppositeSeeds: defaultOppositeSeeds(needType),
    romanceHooks: defaultRomanceHooks(seed, needType),
    scenarioHooks: defaultScenarioHooks(seed, needType),
    dialoguePatterns: defaultDialoguePatterns(label, needType),
    needType,
    masksAs: defaultMasksAs(needType),
    createdByWounds: defaultCreatedByWounds(needType),
    drivenByFears: defaultDrivenByFears(needType),
    expressedAsDesires: defaultExpressedAsDesires(needType),
    activatedByTriggers: defaultActivatedByTriggers(needType),
    commonResponses: defaultCommonResponses(needType),
    loveLanguages: defaultLoveLanguages(needType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(needType),
    growthArcs: defaultGrowthArcs(needType),
    unmetConsequences: defaultUnmetConsequences(needType),
    fulfillmentSignals: defaultFulfillmentSignals(needType),
    routeGates: defaultRouteGates(seed, needType),
    milestoneMemories: defaultMilestoneMemories(seed),
    metadata: {
      category: "hidden_need",
      urgency: defaultUrgency(needType),
      romanceValue: defaultRomanceValue(needType),
      conflictPotential: defaultConflictPotential(needType),
      healingValue: defaultHealingValue(needType),
      pacingPressure: defaultPacingPressure(needType),
    },
  };
  const override = HIDDEN_NEED_OVERRIDES[seed];

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override?.metadata,
    },
  };
}

function toStandardHiddenNeedVocabularySeed(
  seed: HiddenNeedSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Hidden need type: ${seed.needType}.`,
      `Masks as: ${seed.masksAs.slice(0, 3).join(", ")}.`,
      `Unmet consequence: ${seed.unmetConsequences[0] ?? "emotional pressure increases"}.`,
    ].join(" "),
    examples: [
      ...seed.examples,
      ...seed.fulfillmentSignals,
      ...seed.milestoneMemories,
    ],
    tags: [
      "hidden_need",
      seed.needType,
      seed.metadata.urgency,
      seed.metadata.pacingPressure,
      ...seed.tags,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.createdByWounds,
      ...seed.drivenByFears,
      ...seed.expressedAsDesires,
      ...seed.loveLanguages,
      ...seed.compatibleRepairStyles,
    ],
    oppositeSeeds: [
      ...seed.oppositeSeeds,
      ...seed.unmetConsequences,
    ],
    romanceHooks: [
      ...seed.romanceHooks,
      ...seed.growthArcs,
    ],
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.activatedByTriggers,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: seed.metadata.urgency === "core" ? "uncommon" : "common",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function inferHiddenNeedType(seed: string): HiddenNeedSeedType {
  for (const [needType, seeds] of Object.entries(hiddenNeedCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return needType as HiddenNeedSeedType;
    }
  }

  return "attachment";
}

function hiddenNeedLabel(seed: string): string {
  const presetLabel = hiddenNeedPresets.find(
    (preset) => slugifyHiddenNeedPreset(preset) === seed,
  );

  return presetLabel ?? seed
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyHiddenNeedPreset(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function defaultDescription(
  label: string,
  needType: HiddenNeedSeedType,
): string {
  const phrase = needType.replace(/_/g, " ");
  return `${label} is a ${phrase} need that sits underneath visible desire, conflict, and repair. It explains what the character is really asking for when their behavior becomes indirect.`;
}

function defaultExamples(
  label: string,
  needType: HiddenNeedSeedType,
): readonly string[] {
  return [
    `${label} may appear as a smaller request than it really is.`,
    `When it is met cleanly, the character becomes easier to reach and less likely to test the bond.`,
    `When it is ignored, the character may escalate through ${needType.replace(/_/g, " ")} pressure rather than naming the need directly.`,
    "A healthy route lets the character ask for the need without turning it into proof of love.",
  ];
}

function defaultRelatedSeeds(
  seed: string,
  needType: HiddenNeedSeedType,
): readonly string[] {
  return [
    `${needType}_hidden_need`,
    `${seed}_route`,
    ...defaultExpressedAsDesires(needType).slice(0, 2),
  ];
}

function defaultOppositeSeeds(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "boundaries" || needType === "autonomy") {
    return [
      "coercive_pressure",
      "choice_removed",
      "control_disguised_as_care",
    ];
  }
  if (needType === "truth" || needType === "repair") {
    return [
      "deflection",
      "empty_apology",
      "avoidant_silence",
    ];
  }
  return [
    "emotional_uncertainty",
    "inconsistent_presence",
    "need_made_shameful",
  ];
}

function defaultRomanceHooks(
  seed: string,
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "recognition") {
    return [
      "seen_without_performance",
      "chosen_instead_of_overlooked",
      "small_detail_remembered",
    ];
  }
  if (needType === "touch") {
    return [
      "safe_touch_after_permission",
      "first_comfort_contact",
      "touch_that_does_not_demand",
    ];
  }
  return [
    `${seed}_romance_hook`,
    "need_named_without_shame",
    "care_meets_the_real_request",
  ];
}

function defaultScenarioHooks(
  seed: string,
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "repair") {
    return [
      "post_argument_check_in",
      "apology_needs_follow_through",
      "repair_attempt_after_silence",
    ];
  }
  if (needType === "attachment") {
    return [
      "delayed_reply_spiral",
      "temporary_separation",
      "goodbye_trigger",
    ];
  }
  return [
    `${seed}_scene`,
    "need_goes_unspoken",
    "relationship_pressure_reveals_need",
  ];
}

function defaultDialoguePatterns(
  label: string,
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "boundaries" || needType === "autonomy") {
    return [
      "I need this to be my choice.",
      "Do not make care feel like a cage.",
      "Stay, but do not corner me.",
    ];
  }
  if (needType === "truth") {
    return [
      "Be gentle, but do not make it smaller than it is.",
      "I can handle the truth better than being managed.",
      "Please do not protect me from knowing.",
    ];
  }
  return [
    `This is not about ${label.toLowerCase()} being dramatic.`,
    "I am trying to tell you what the fear is asking for.",
    "I do not need perfect. I need real.",
  ];
}

function defaultMasksAs(needType: HiddenNeedSeedType): readonly string[] {
  if (needType === "attachment") {
    return [
      "clinginess",
      "overthinking",
      "testing_love",
    ];
  }
  if (needType === "autonomy" || needType === "boundaries") {
    return [
      "stubbornness",
      "defensiveness",
      "pulling_away",
    ];
  }
  if (needType === "recognition" || needType === "validation") {
    return [
      "attention_seeking",
      "sensitivity",
      "quiet_withdrawal",
    ];
  }
  return [
    "avoidance",
    "irritability",
    "unspoken_longing",
  ];
}

function defaultCreatedByWounds(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "attachment") {
    return [
      "abandonment_wound",
      "emotional_neglect_wound",
    ];
  }
  if (needType === "recognition" || needType === "validation") {
    return [
      "emotional_neglect_wound",
      "rejection_wound",
    ];
  }
  if (needType === "autonomy" || needType === "boundaries") {
    return [
      "control_wound",
      "boundary_violation_wound",
    ];
  }
  return [
    "conditional_love_wound",
    "shame_wound",
  ];
}

function defaultDrivenByFears(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "attachment") {
    return [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
    ];
  }
  if (needType === "recognition") {
    return [
      "fear_of_replacement",
      "fear_of_being_overlooked",
    ];
  }
  if (needType === "autonomy" || needType === "boundaries") {
    return [
      "fear_of_being_controlled",
      "fear_of_dependency",
    ];
  }
  return [
    "fear_of_rejection",
    "fear_of_being_too_much",
  ];
}

function defaultExpressedAsDesires(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "recognition") {
    return [
      "desire_to_be_seen",
      "desire_to_be_chosen",
    ];
  }
  if (needType === "autonomy") {
    return [
      "desire_for_freedom",
      "desire_for_choice",
    ];
  }
  if (needType === "belonging" || needType === "acceptance") {
    return [
      "desire_for_belonging",
      "desire_for_unconditional_love",
    ];
  }
  return [
    "desire_for_safe_love",
    "desire_for_reliable_love",
  ];
}

function defaultActivatedByTriggers(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "attachment") {
    return [
      "unanswered_message_trigger",
      "goodbye_trigger",
      "emotional_distance_trigger",
    ];
  }
  if (needType === "boundaries" || needType === "autonomy") {
    return [
      "being_ordered_trigger",
      "loss_of_choice_trigger",
      "boundary_ignored_trigger",
    ];
  }
  return [
    "cold_tone_trigger",
    "being_overlooked_trigger",
    "vulnerability_exposed_trigger",
  ];
}

function defaultCommonResponses(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "attachment") {
    return [
      "reassurance_seeking_response",
      "panic_spiral_response",
    ];
  }
  if (needType === "autonomy" || needType === "boundaries") {
    return [
      "boundary_assertion_response",
      "distance_seeking_response",
    ];
  }
  return [
    "vulnerability_leak_response",
    "protective_withdrawal_response",
  ];
}

function defaultLoveLanguages(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "touch") {
    return [
      "physical_touch",
      "safe_silence",
      "emotional_presence",
    ];
  }
  if (needType === "repair" || needType === "truth") {
    return [
      "words_of_affirmation",
      "emotional_presence",
      "consistency",
    ];
  }
  return [
    "quality_time",
    "words_of_affirmation",
    "consistency",
  ];
}

function defaultCompatibleRepairStyles(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "boundaries" || needType === "autonomy") {
    return [
      "boundary_respect_repair",
      "choice_restoration_repair",
    ];
  }
  if (needType === "touch") {
    return [
      "safe_touch_repair",
      "physical_comfort_repair",
    ];
  }
  return [
    "verbal_reassurance_repair",
    "presence_based_repair",
  ];
}

function defaultGrowthArcs(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "autonomy" || needType === "boundaries") {
    return [
      "learning_closeness_without_control",
      "learning_to_name_boundaries",
    ];
  }
  return [
    "learning_to_name_the_need",
    "learning_to_receive_care_directly",
  ];
}

function defaultUnmetConsequences(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "attachment") {
    return [
      "attachment_damage_consequence",
      "reassurance_need_increase",
    ];
  }
  if (needType === "boundaries" || needType === "autonomy") {
    return [
      "autonomy_threat_consequence",
      "defensive_distance_consequence",
    ];
  }
  return [
    "emotional_distance_consequence",
    "unspoken_need_escalation",
  ];
}

function defaultFulfillmentSignals(
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "attachment") {
    return [
      "recovers_faster_after_distance",
      "asks_directly_instead_of_testing",
    ];
  }
  if (needType === "autonomy" || needType === "boundaries") {
    return [
      "choice_is_named_and_respected",
      "closeness_no_longer_feels_like_pressure",
    ];
  }
  return [
    "body_language_softens",
    "need_is_named_without_shame",
  ];
}

function defaultRouteGates(
  seed: string,
  needType: HiddenNeedSeedType,
): readonly string[] {
  if (needType === "repair") {
    return [
      "first_repair_after_conflict_gate",
      `${seed}_gate`,
    ];
  }
  return [
    `first_${needType}_need_gate`,
    `${seed}_gate`,
  ];
}

function defaultMilestoneMemories(seed: string): readonly string[] {
  return [
    `first_${seed}_named_memory`,
    `${seed}_met_cleanly_memory`,
  ];
}

function defaultUrgency(needType: HiddenNeedSeedType): HiddenNeedUrgency {
  if (needType === "attachment" || needType === "safety") {
    return "core";
  }
  if (needType === "recognition" || needType === "repair") {
    return "strong";
  }
  return "moderate";
}

function defaultPacingPressure(
  needType: HiddenNeedSeedType,
): HiddenNeedPacingPressure {
  return needType === "attachment" || needType === "repair" ? "high" : "medium";
}

function defaultRomanceValue(needType: HiddenNeedSeedType): number {
  return needType === "recognition" || needType === "attachment" ? 10 : 8;
}

function defaultConflictPotential(needType: HiddenNeedSeedType): number {
  if (needType === "attachment" || needType === "autonomy" || needType === "boundaries") {
    return 8;
  }
  return 6;
}

function defaultHealingValue(needType: HiddenNeedSeedType): number {
  return needType === "repair" || needType === "acceptance" ? 10 : 8;
}
