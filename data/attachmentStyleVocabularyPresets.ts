import {
  createAttachmentStyleSeedPreset,
  createVocabularySeedPreset,
  type AttachmentStyleSeed,
  type AttachmentStyleSeedInput,
  type AttachmentStyleSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const attachmentStyleSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Attachment Style",
  "Relationship Dynamic",
  "Conflict Style",
  "Repair Style",
  "Growth Arc",
  "Relationship Identity",
] as const;

export const attachmentStylePresets = [
  "Secure Attachment",
  "Anxious Attachment",
  "Avoidant Attachment",
  "Fearful-Avoidant Attachment",
  "Disorganized Attachment",
  "Earned Secure Attachment",
  "Preoccupied Attachment",
  "Dismissive Attachment",
  "Hyper-Independent Attachment",
  "Clingy Attachment",
  "Push-Pull Attachment",
  "Slow-to-Trust Attachment",
  "Trauma-Bonded Attachment",
  "Safe Person Attachment",
  "Devotional Attachment",
  "Detached Protector Attachment",
  "Caretaker Attachment",
  "Reassurance-Seeking Attachment",
  "Space-Needing Attachment",
  "Healing Attachment",
] as const;

export const attachmentStyleExpansionLogic = {
  wound_to_attachment_style: {
    abandonment_wound: [
      "anxious_attachment",
      "reassurance_seeking_attachment",
      "clingy_attachment",
    ],
    betrayal_wound: [
      "fearful_avoidant_attachment",
      "slow_to_trust_attachment",
    ],
    emotional_neglect_wound: [
      "avoidant_attachment",
      "caretaker_attachment",
      "safe_person_attachment",
    ],
    control_wound: [
      "avoidant_attachment",
      "space_needing_attachment",
      "hyper_independent_attachment",
    ],
    conditional_love_wound: [
      "caretaker_attachment",
      "preoccupied_attachment",
      "earned_secure_attachment",
    ],
  },
  fear_to_attachment_style: {
    fear_of_abandonment: [
      "anxious_attachment",
      "preoccupied_attachment",
    ],
    fear_of_dependency: [
      "avoidant_attachment",
      "hyper_independent_attachment",
    ],
    fear_of_vulnerability: [
      "fearful_avoidant_attachment",
      "slow_to_trust_attachment",
    ],
    fear_of_replacement: [
      "devotional_attachment",
      "reassurance_seeking_attachment",
    ],
  },
  attachment_style_to_conflict_style: {
    anxious_attachment: [
      "pursuer_conflict_style",
      "reassurance_seeking_conflict_style",
    ],
    avoidant_attachment: [
      "withdrawer_conflict_style",
      "cold_shutdown_conflict_style",
    ],
    fearful_avoidant_attachment: [
      "fearful_push_pull_conflict_style",
      "defensive_withdrawal_conflict_style",
    ],
    secure_attachment: [
      "repair_oriented_conflict_style",
      "tender_honesty_conflict_style",
    ],
  },
  attachment_style_to_repair_style: {
    anxious_attachment: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "presence_based_repair",
    ],
    avoidant_attachment: [
      "space_based_repair",
      "choice_restoration_repair",
      "low_pressure_repair",
    ],
    fearful_avoidant_attachment: [
      "space_with_return_repair",
      "gentle_reassurance_repair",
      "trust_rebuilding_repair",
    ],
    secure_attachment: [
      "collaborative_problem_solving_repair",
      "direct_apology_repair",
      "relationship_maintenance_repair",
    ],
  },
} as const;

export const attachmentStyleCategories = {
  secure: [
    "secure_attachment",
  ],
  anxious: [
    "anxious_attachment",
    "preoccupied_attachment",
    "clingy_attachment",
    "reassurance_seeking_attachment",
  ],
  avoidant: [
    "avoidant_attachment",
    "dismissive_attachment",
    "hyper_independent_attachment",
    "slow_to_trust_attachment",
    "space_needing_attachment",
  ],
  fearful_avoidant: [
    "fearful_avoidant_attachment",
  ],
  disorganized: [
    "disorganized_attachment",
    "push_pull_attachment",
    "trauma_bonded_attachment",
  ],
  earned_secure: [
    "earned_secure_attachment",
  ],
  caretaker: [
    "caretaker_attachment",
  ],
  devotional: [
    "devotional_attachment",
  ],
  protective: [
    "detached_protector_attachment",
  ],
  healing: [
    "safe_person_attachment",
    "healing_attachment",
  ],
} as const satisfies Record<AttachmentStyleSeedType, readonly string[]>;

type AttachmentStyleOverride = Partial<AttachmentStyleSeedInput> & {
  label?: string;
};

const ATTACHMENT_STYLE_OVERRIDES: Record<string, AttachmentStyleOverride> = {
  anxious_attachment: {
    label: "Anxious Attachment",
    description:
      "An attachment pattern marked by fear of abandonment, heightened sensitivity to distance, and a strong need for reassurance and emotional closeness.",
    examples: [
      "Panics when messages go unanswered.",
      "Needs conflict resolved quickly.",
      "Reads small changes in tone as signs of rejection.",
    ],
    tags: [
      "attachment_style",
      "anxious",
      "reassurance",
      "abandonment",
    ],
    relatedSeeds: [
      "abandonment_wound",
      "fear_of_abandonment",
      "reassurance_seeking_response",
      "pursuer_conflict_style",
    ],
    oppositeSeeds: [
      "secure_attachment",
      "avoidant_attachment",
      "emotional_security",
    ],
    romanceHooks: [
      "i_am_not_leaving_scene",
      "learning_someone_stays",
      "reassurance_after_spiral",
    ],
    scenarioHooks: [
      "delayed_reply_spiral",
      "temporary_separation",
      "post_argument_reassurance",
    ],
    dialoguePatterns: [
      "I need to know we are okay.",
      "You got quiet and I thought I lost you.",
      "Please do not leave without telling me you are coming back.",
    ],
    attachmentType: "anxious",
    coreBelief:
      "Love can disappear if they are not constantly attentive to it.",
    coreFear:
      "Being abandoned, replaced, forgotten, or emotionally deprioritized.",
    coreDesire:
      "Reliable love, clear reassurance, and emotional permanence.",
    associatedWounds: [
      "abandonment_wound",
      "rejection_wound",
      "emotional_neglect_wound",
    ],
    associatedFears: [
      "fear_of_abandonment",
      "fear_of_rejection",
      "fear_of_emotional_distance",
    ],
    associatedDesires: [
      "desire_for_reliable_love",
      "desire_to_be_chosen",
      "desire_for_emotional_presence",
    ],
    commonTriggers: [
      "unanswered_message_trigger",
      "goodbye_trigger",
      "space_misread_as_rejection",
    ],
    commonResponses: [
      "reassurance_seeking_response",
      "panic_spiral_response",
      "overexplaining_response",
    ],
    intimacyPattern: [
      "moves_toward_closeness_under_stress",
      "needs_explicit_confirmation",
      "may_confuse_intensity_with_security",
    ],
    conflictPattern: [
      "pursuer_conflict_style",
      "pressure_for_immediate_resolution",
      "fear_escalates_when_partner_withdraws",
    ],
    repairNeeds: [
      "clear_return",
      "verbal_reassurance",
      "consistent_follow_through",
      "no_silent_punishment",
    ],
    compatibleRepairStyles: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "check_in_ritual_repair",
    ],
    healthyVersion: [
      "asks_directly_for_reassurance",
      "allows_space_with_return_agreement",
      "trusts_consistency_over_panic",
    ],
    unhealthyVersion: [
      "tests_love_repeatedly",
      "interprets_boundaries_as_rejection",
      "pressures_closeness_to_reduce_fear",
    ],
    growthArcs: [
      "learning_secure_attachment",
      "learning_to_trust",
      "learning_space_is_not_abandonment",
    ],
    routeGates: [
      "first_reassurance_gate",
      "space_with_return_gate",
      "secure_waiting_gate",
    ],
    metadata: {
      category: "attachment_style",
      securityLevel: "low",
      romanceValue: 9,
      angstValue: 10,
      conflictPotential: 9,
      healingValue: 10,
    },
  },
  secure_attachment: {
    description:
      "An attachment pattern grounded in trust, emotional steadiness, and the belief that closeness can survive conflict, distance, and honest boundaries.",
    examples: [
      "Names needs without making them a test.",
      "Allows space because return feels believable.",
      "Treats repair as normal maintenance instead of proof of failure.",
    ],
    dialoguePatterns: [
      "We can slow down and still stay honest.",
      "I am upset, but I am not leaving.",
      "Tell me what you need, and I will tell you what I can give.",
    ],
    attachmentType: "secure",
    coreBelief:
      "Love is steadier when both people can be honest and still remain connected.",
    coreFear:
      "Letting silence or pride replace direct care.",
    coreDesire:
      "Mutual trust, respectful closeness, and repair that does not need performance.",
    metadata: {
      category: "attachment_style",
      securityLevel: "high",
      romanceValue: 9,
      angstValue: 3,
      conflictPotential: 3,
      healingValue: 10,
    },
  },
  avoidant_attachment: {
    description:
      "An attachment pattern that protects autonomy by stepping back from need, softness, or dependence before closeness can feel demanding.",
    examples: [
      "Withdraws after receiving care.",
      "Frames needing someone as a loss of control.",
      "Needs time alone before emotional conversations can stay honest.",
    ],
    dialoguePatterns: [
      "I need a minute. That does not mean I am done.",
      "Do not make this bigger than it is.",
      "I am trying to stay instead of disappearing.",
    ],
    attachmentType: "avoidant",
    coreBelief:
      "Closeness can become a demand if they do not guard their own space.",
    coreFear:
      "Being needed so much that they lose choice, privacy, or self-command.",
    coreDesire:
      "Love that respects distance, choice, and low-pressure return.",
    metadata: {
      category: "attachment_style",
      securityLevel: "medium",
      romanceValue: 8,
      angstValue: 8,
      conflictPotential: 8,
      healingValue: 9,
    },
  },
};

export const ATTACHMENT_STYLE_SEEDS = Object.freeze(
  getUniqueAttachmentStyleIds().map((seed) =>
    createAttachmentStyleSeedPreset(buildAttachmentStyleInput(seed)),
  ),
) satisfies readonly AttachmentStyleSeed[];

export const ATTACHMENT_STYLE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  ATTACHMENT_STYLE_SEEDS.map(toStandardAttachmentStyleVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getAttachmentStyleSeedsByCategory(
  attachmentType: AttachmentStyleSeedType,
): readonly AttachmentStyleSeed[] {
  const ids = new Set<string>(attachmentStyleCategories[attachmentType]);
  return ATTACHMENT_STYLE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getAttachmentStyleSeedsByType(
  attachmentType: AttachmentStyleSeedType,
): readonly AttachmentStyleSeed[] {
  return ATTACHMENT_STYLE_SEEDS.filter((seed) => seed.attachmentType === attachmentType);
}

export function findAttachmentStyleSeedBySeed(
  seedId: string,
): AttachmentStyleSeed | undefined {
  return ATTACHMENT_STYLE_SEEDS.find((seed) => seed.seed === seedId);
}

function getUniqueAttachmentStyleIds(): readonly string[] {
  return Array.from(new Set(Object.values(attachmentStyleCategories).flat()));
}

function buildAttachmentStyleInput(seed: string): AttachmentStyleSeedInput {
  const attachmentType = inferAttachmentStyleType(seed);
  const label = attachmentStyleLabel(seed);
  const base: AttachmentStyleSeedInput = {
    seed,
    label,
    description: defaultDescription(label, attachmentType),
    examples: defaultExamples(label, attachmentType),
    tags: [
      "attachment_style",
      attachmentType,
      ...defaultTags(attachmentType),
    ],
    relatedSeeds: defaultRelatedSeeds(seed, attachmentType),
    oppositeSeeds: defaultOppositeSeeds(seed, attachmentType),
    romanceHooks: defaultRomanceHooks(seed, attachmentType),
    scenarioHooks: defaultScenarioHooks(attachmentType),
    dialoguePatterns: defaultDialoguePatterns(label, attachmentType),
    attachmentType,
    coreBelief: defaultCoreBelief(attachmentType),
    coreFear: defaultCoreFear(attachmentType),
    coreDesire: defaultCoreDesire(attachmentType),
    associatedWounds: defaultAssociatedWounds(attachmentType),
    associatedFears: defaultAssociatedFears(attachmentType),
    associatedDesires: defaultAssociatedDesires(attachmentType),
    commonTriggers: defaultCommonTriggers(attachmentType),
    commonResponses: defaultCommonResponses(attachmentType),
    intimacyPattern: defaultIntimacyPattern(attachmentType),
    conflictPattern: defaultConflictPattern(attachmentType),
    repairNeeds: defaultRepairNeeds(attachmentType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(attachmentType),
    healthyVersion: defaultHealthyVersion(attachmentType),
    unhealthyVersion: defaultUnhealthyVersion(attachmentType),
    growthArcs: defaultGrowthArcs(attachmentType),
    routeGates: defaultRouteGates(seed, attachmentType),
    metadata: {
      category: "attachment_style",
      securityLevel: defaultSecurityLevel(attachmentType),
      romanceValue: defaultRomanceValue(attachmentType),
      angstValue: defaultAngstValue(attachmentType),
      conflictPotential: defaultConflictPotential(attachmentType),
      healingValue: defaultHealingValue(attachmentType),
    },
  };
  const override = ATTACHMENT_STYLE_OVERRIDES[seed];

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override?.metadata,
    },
  };
}

function toStandardAttachmentStyleVocabularySeed(
  seed: AttachmentStyleSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Attachment type: ${seed.attachmentType}.`,
      `Core belief: ${seed.coreBelief}`,
      `Core fear: ${seed.coreFear}`,
      `Core desire: ${seed.coreDesire}`,
    ].join(" "),
    examples: [
      ...seed.examples,
      ...seed.intimacyPattern,
      ...seed.repairNeeds,
    ],
    tags: [
      "attachment_style",
      seed.attachmentType,
      seed.metadata.securityLevel,
      ...seed.tags,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.associatedWounds,
      ...seed.associatedFears,
      ...seed.associatedDesires,
      ...seed.commonResponses,
    ],
    oppositeSeeds: seed.oppositeSeeds,
    romanceHooks: [
      ...seed.romanceHooks,
      ...seed.growthArcs,
    ],
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.commonTriggers,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: seed.metadata.securityLevel === "earned" ? "rare" : "common",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function inferAttachmentStyleType(seed: string): AttachmentStyleSeedType {
  for (const [attachmentType, seeds] of Object.entries(attachmentStyleCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return attachmentType as AttachmentStyleSeedType;
    }
  }

  return "secure";
}

function attachmentStyleLabel(seed: string): string {
  const presetLabel = attachmentStylePresets.find(
    (preset) => slugifyAttachmentStylePreset(preset) === seed,
  );

  return presetLabel ?? seed
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyAttachmentStylePreset(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function defaultDescription(
  label: string,
  attachmentType: AttachmentStyleSeedType,
): string {
  const phrase = attachmentType.replace(/_/g, " ");
  return `${label} describes how a character reaches for closeness, protects against loss, and interprets emotional distance through a ${phrase} attachment pattern.`;
}

function defaultExamples(
  label: string,
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  return [
    `${label} shapes how quickly the character trusts return after conflict.`,
    `Their need for closeness or space becomes more visible when the relationship feels uncertain.`,
    `The pattern can create romance pressure, rupture risk, and a clear repair route.`,
    `In healthier scenes, the character learns to ask for attachment needs without making love into a test.`,
  ];
}

function defaultTags(attachmentType: AttachmentStyleSeedType): readonly string[] {
  return [
    "relationship_engine",
    "psychology",
    attachmentType.includes("secure") ? "healing" : "attachment_pressure",
  ];
}

function defaultRelatedSeeds(
  seed: string,
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  return [
    `${attachmentType}_attachment_pattern`,
    "relationship_dynamic",
    "repair_style",
    seed.replace("_attachment", "_relationship_pattern"),
  ];
}

function defaultOppositeSeeds(
  _seed: string,
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "panic_driven_attachment",
      "avoidant_shutdown",
      "hot_cold_relationship",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "anxious_attachment",
      "cling_response",
      "pressure_for_immediate_closeness",
    ];
  }
  return [
    "secure_attachment",
    "self_soothing_response",
    "stable_return",
  ];
}

function defaultRomanceHooks(
  seed: string,
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "safe_conflict_repair",
      "honest_needs_scene",
      "secure_return_after_distance",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "space_with_return_agreement",
      "low_pressure_closeness",
      "chooses_to_stay_after_withdrawal",
    ];
  }
  return [
    "reassurance_after_spiral",
    "i_am_not_leaving_scene",
    `${seed.replace("_attachment", "")}_softening_scene`,
  ];
}

function defaultScenarioHooks(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "post_argument_check_in",
      "needs_named_without_blame",
      "ordinary_reliability_scene",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "receiving_care_trigger",
      "too_much_closeness_trigger",
      "space_request_after_softness",
    ];
  }
  return [
    "delayed_reply_spiral",
    "temporary_separation",
    "unplanned_goodbye",
  ];
}

function defaultDialoguePatterns(
  label: string,
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "I can be honest and still stay.",
      "We do not have to fix this perfectly tonight.",
      "Come back when you are ready. I will still be here.",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "I need space, not an exit.",
      "Do not chase me. Just let me come back cleanly.",
      "I am not used to needing anyone this much.",
    ];
  }
  return [
    "Tell me we are still okay.",
    "I know I am asking too much. I just got scared.",
    `${label.replace(" Attachment", "")} sounds clinical. It feels like waiting for the door to close.`,
  ];
}

function defaultCoreBelief(attachmentType: AttachmentStyleSeedType): string {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return "Closeness can hold boundaries, conflict, and honest repair without collapsing.";
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return "Safety comes from staying self-contained before anyone can ask for too much.";
  }
  if (attachmentType === "devotional") {
    return "Love is proven by staying loyal even when fear makes loyalty ache.";
  }
  return "Connection can vanish unless they watch it closely and earn reassurance before it disappears.";
}

function defaultCoreFear(attachmentType: AttachmentStyleSeedType): string {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return "Letting old patterns speak louder than present trust.";
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return "Being consumed, controlled, or made responsible for someone else's need.";
  }
  if (attachmentType === "fearful_avoidant" || attachmentType === "disorganized") {
    return "Wanting closeness from the same place that feels unsafe.";
  }
  return "Being left, replaced, or quietly deprioritized.";
}

function defaultCoreDesire(attachmentType: AttachmentStyleSeedType): string {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return "Steady mutual love that can name needs without panic.";
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return "Love with room to breathe, choose, and return without pressure.";
  }
  if (attachmentType === "caretaker") {
    return "To be useful, trusted, and eventually cared for without having to earn it.";
  }
  return "A bond that feels unmistakably chosen, reliable, and emotionally present.";
}

function defaultAssociatedWounds(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "healed_attachment_wound",
      "old_abandonment_wound",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "control_wound",
      "emotional_neglect_wound",
      "dependency_shame_wound",
    ];
  }
  if (attachmentType === "fearful_avoidant" || attachmentType === "disorganized") {
    return [
      "betrayal_wound",
      "abandonment_wound",
      "inconsistent_care_wound",
    ];
  }
  return [
    "abandonment_wound",
    "rejection_wound",
    "conditional_love_wound",
  ];
}

function defaultAssociatedFears(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "fear_of_old_patterns_returning",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "fear_of_dependency",
      "fear_of_engulfment",
      "fear_of_losing_control",
    ];
  }
  if (attachmentType === "fearful_avoidant" || attachmentType === "disorganized") {
    return [
      "fear_of_betrayal",
      "fear_of_vulnerability",
      "fear_of_abandonment",
    ];
  }
  return [
    "fear_of_abandonment",
    "fear_of_rejection",
    "fear_of_replacement",
  ];
}

function defaultAssociatedDesires(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "desire_for_autonomy",
      "desire_for_low_pressure_love",
      "desire_to_return_by_choice",
    ];
  }
  return [
    "desire_for_reliable_love",
    "desire_for_emotional_safety",
    "desire_to_be_chosen",
  ];
}

function defaultCommonTriggers(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "being_needed_trigger",
      "receiving_care_trigger",
      "loss_of_choice_trigger",
    ];
  }
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "relationship_stress_trigger",
      "honest_conflict_trigger",
      "old_pattern_echo_trigger",
    ];
  }
  return [
    "unanswered_message_trigger",
    "emotional_distance_trigger",
    "goodbye_trigger",
  ];
}

function defaultCommonResponses(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "emotional_withdrawal_response",
      "space_needing_response",
      "intellectualizing_response",
    ];
  }
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "direct_repair_response",
      "self_soothing_response",
      "collaborative_problem_solving_response",
    ];
  }
  return [
    "reassurance_seeking_response",
    "panic_spiral_response",
    "testing_love_response",
  ];
}

function defaultIntimacyPattern(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "closeness_is_followed_by_distance",
      "softness_requires_choice_and_privacy",
      "trust_grows_through_low_pressure_return",
    ];
  }
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "closeness_deepens_through_honesty",
      "boundaries_do_not_break_connection",
      "care_is_given_without_testing",
    ];
  }
  return [
    "moves_toward_closeness_under_stress",
    "needs_explicit_confirmation",
    "confuses_intensity_with_security_when_triggered",
  ];
}

function defaultConflictPattern(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "withdrawer_conflict_style",
      "asks_for_space_before_words_are_ready",
      "pressure_makes_shutdown_more_likely",
    ];
  }
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "repair_oriented_conflict_style",
      "names_needs_without_threat",
      "allows_pause_without_abandonment",
    ];
  }
  return [
    "pursuer_conflict_style",
    "needs_resolution_before_sleeping",
    "fear_escalates_when_partner_withdraws",
  ];
}

function defaultRepairNeeds(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "space_with_return",
      "choice_restored",
      "no_chasing_or_cornering",
    ];
  }
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "direct_apology",
      "shared_accountability",
      "consistent_follow_through",
    ];
  }
  return [
    "clear_return",
    "verbal_reassurance",
    "consistent_follow_through",
  ];
}

function defaultCompatibleRepairStyles(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "space_based_repair",
      "choice_restoration_repair",
      "low_pressure_repair",
    ];
  }
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "direct_apology_repair",
      "collaborative_problem_solving_repair",
      "relationship_maintenance_repair",
    ];
  }
  return [
    "verbal_reassurance_repair",
    "presence_based_repair",
    "return_and_stay_repair",
  ];
}

function defaultHealthyVersion(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "keeps_honesty_warm",
      "repairs_without_punishment",
      "lets_love_breathe",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "asks_for_space_without_disappearing",
      "returns_when_ready",
      "allows_care_without_surrendering_selfhood",
    ];
  }
  return [
    "asks_directly_for_reassurance",
    "allows_space_with_return_agreement",
    "trusts_consistency_over_panic",
  ];
}

function defaultUnhealthyVersion(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return [
      "overfunctions_as_the_only_stable_person",
      "minimizes_real_hurt_to_keep_peace",
    ];
  }
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "disappears_instead_of_asking_for_space",
      "treats_need_as_threat",
      "uses_coldness_to_regain_control",
    ];
  }
  return [
    "tests_love_repeatedly",
    "interprets_boundaries_as_rejection",
    "pressures_closeness_to_reduce_fear",
  ];
}

function defaultGrowthArcs(
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  if (attachmentType === "avoidant" || attachmentType === "protective") {
    return [
      "learning_to_return",
      "learning_safe_dependency",
      "learning_boundaries_without_distance",
    ];
  }
  return [
    "learning_secure_attachment",
    "learning_to_trust",
    "learning_needs_without_tests",
  ];
}

function defaultRouteGates(
  seed: string,
  attachmentType: AttachmentStyleSeedType,
): readonly string[] {
  return [
    `first_${seed.replace(/_attachment$/, "")}_gate`,
    `${attachmentType}_repair_gate`,
    "secure_attachment_growth_gate",
  ];
}

function defaultSecurityLevel(
  attachmentType: AttachmentStyleSeedType,
): "low" | "medium" | "high" | "earned" {
  if (attachmentType === "secure") {
    return "high";
  }
  if (attachmentType === "earned_secure" || attachmentType === "healing") {
    return "earned";
  }
  if (attachmentType === "anxious" || attachmentType === "disorganized") {
    return "low";
  }
  return "medium";
}

function defaultRomanceValue(attachmentType: AttachmentStyleSeedType): number {
  return attachmentType === "secure" ? 8 : 9;
}

function defaultAngstValue(attachmentType: AttachmentStyleSeedType): number {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return 4;
  }
  if (attachmentType === "disorganized" || attachmentType === "fearful_avoidant") {
    return 10;
  }
  return 8;
}

function defaultConflictPotential(attachmentType: AttachmentStyleSeedType): number {
  if (attachmentType === "secure" || attachmentType === "earned_secure") {
    return 3;
  }
  if (attachmentType === "healing") {
    return 5;
  }
  return 8;
}

function defaultHealingValue(attachmentType: AttachmentStyleSeedType): number {
  return attachmentType === "secure" || attachmentType === "earned_secure" ? 9 : 10;
}
