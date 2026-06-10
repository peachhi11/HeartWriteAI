import {
  createRuptureTypeSeedPreset,
  createVocabularySeedPreset,
  type RuptureTypeSeed,
  type RuptureTypeSeedInput,
  type RuptureTypeSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const ruptureTypeSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Conflict Style",
  "Conflict Beat",
  "Rupture Type",
  "Rupture Severity",
  "Repair Style",
  "Repair Arc",
  "Milestone Memory",
  "Growth Arc",
] as const;

export const ruptureTypePresets = [
  "Abandonment Rupture",
  "Betrayal Rupture",
  "Broken Promise Rupture",
  "Emotional Invalidation Rupture",
  "Humiliation Rupture",
  "Boundary Violation Rupture",
  "Trust Rupture",
  "Attachment Rupture",
  "Identity Rupture",
  "Safety Rupture",
  "Exclusivity Rupture",
  "Neglect Rupture",
  "Public Loyalty Rupture",
  "Forced Separation Rupture",
  "Protective Lie Rupture",
  "Autonomy Rupture",
  "Emotional Absence Rupture",
  "Dignity Rupture",
  "Reliability Rupture",
  "Relationship Identity Rupture",
] as const;

export const ruptureTypeExpansionLogic = {
  wound_to_rupture_type: {
    abandonment_wound: [
      "abandonment_rupture",
      "forced_separation_rupture",
      "emotional_absence_rupture",
    ],
    betrayal_wound: [
      "betrayal_rupture",
      "protective_lie_rupture",
      "trust_rupture",
    ],
    emotional_neglect_wound: [
      "neglect_rupture",
      "emotional_absence_rupture",
      "emotional_invalidation_rupture",
    ],
    humiliation_wound: [
      "humiliation_rupture",
      "dignity_rupture",
      "public_loyalty_rupture",
    ],
    control_wound: [
      "boundary_violation_rupture",
      "autonomy_rupture",
      "identity_rupture",
    ],
  },
  conflict_beat_to_rupture_type: {
    delayed_reply_spiral: [
      "abandonment_rupture",
      "emotional_absence_rupture",
    ],
    protective_lie: [
      "betrayal_rupture",
      "trust_rupture",
      "autonomy_rupture",
    ],
    broken_promise: [
      "broken_promise_rupture",
      "reliability_rupture",
    ],
    public_embarrassment: [
      "humiliation_rupture",
      "dignity_rupture",
    ],
    boundary_crossed: [
      "boundary_violation_rupture",
      "autonomy_rupture",
      "safety_rupture",
    ],
    being_chosen_last: [
      "exclusivity_rupture",
      "attachment_rupture",
      "relationship_identity_rupture",
    ],
  },
  rupture_type_to_repair_style: {
    abandonment_rupture: [
      "presence_based_repair",
      "return_and_stay_repair",
      "verbal_reassurance_repair",
    ],
    betrayal_rupture: [
      "truth_and_accountability_repair",
      "transparency_repair",
      "proof_of_change_repair",
    ],
    broken_promise_rupture: [
      "accountability_repair",
      "consistency_repair",
      "follow_through_repair",
    ],
    emotional_invalidation_rupture: [
      "validation_repair",
      "heart_to_heart_repair",
      "emotional_translation_repair",
    ],
    humiliation_rupture: [
      "dignity_restoration_repair",
      "private_comfort_repair",
      "public_support_repair",
    ],
    boundary_violation_rupture: [
      "boundary_respect_repair",
      "choice_restoration_repair",
      "space_based_repair",
    ],
    relationship_identity_rupture: [
      "symbolic_gesture_repair",
      "recommitment_repair",
      "shared_future_repair",
    ],
  },
} as const;

export const ruptureTypeCategories = {
  abandonment: ["abandonment_rupture"],
  betrayal: ["betrayal_rupture", "protective_lie_rupture"],
  broken_promise: ["broken_promise_rupture", "reliability_rupture"],
  invalidation: ["emotional_invalidation_rupture"],
  humiliation: ["humiliation_rupture", "dignity_rupture"],
  boundary: ["boundary_violation_rupture", "autonomy_rupture"],
  trust: ["trust_rupture"],
  attachment: ["attachment_rupture", "emotional_absence_rupture"],
  identity: ["identity_rupture", "relationship_identity_rupture"],
  safety: ["safety_rupture"],
  exclusivity: ["exclusivity_rupture"],
  neglect: ["neglect_rupture"],
  public: ["public_loyalty_rupture"],
  separation: ["forced_separation_rupture"],
} as const satisfies Record<RuptureTypeSeedType, readonly string[]>;

type RuptureTypeOverride = Partial<RuptureTypeSeedInput> & {
  label?: string;
};

const RUPTURE_TYPE_OVERRIDES: Record<string, RuptureTypeOverride> = {
  abandonment_rupture: {
    label: "Abandonment Rupture",
    description:
      "A rupture where one character experiences the other as leaving, disappearing, withdrawing, or failing to return when emotionally needed.",
    examples: [
      "One character walks away during a vulnerable moment.",
      "A promised return does not happen.",
      "Silence after conflict feels like being left.",
    ],
    tags: ["rupture_type", "attachment", "abandonment", "emotional_absence"],
    relatedSeeds: [
      "abandonment_wound",
      "fear_of_abandonment",
      "delayed_reply_spiral",
      "presence_based_repair",
    ],
    oppositeSeeds: ["secure_return", "reliable_presence", "emotional_permanence"],
    romanceHooks: [
      "i_came_back_scene",
      "do_not_leave_me_conflict",
      "return_as_repair",
    ],
    scenarioHooks: [
      "after_the_goodbye",
      "missed_check_in",
      "post_argument_silence",
    ],
    dialoguePatterns: [
      "You left.",
      "I needed you and you were gone.",
      "Coming back now does not erase what it felt like.",
    ],
    ruptureType: "abandonment",
    emotionalDamage:
      "Damages emotional permanence, safe return, and confidence that conflict will not end the bond.",
    damagedTrustLayer: [
      "emotional_trust",
      "attachment_trust",
      "conflict_trust",
      "reliability_trust",
    ],
    activatesWounds: ["abandonment_wound", "emotional_neglect_wound"],
    activatesFears: [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
      "fear_of_being_forgotten",
    ],
    frustratesDesires: [
      "desire_for_reliable_love",
      "desire_for_emotional_presence",
      "desire_for_safe_person",
    ],
    commonTriggers: [
      "goodbye_trigger",
      "unanswered_message_trigger",
      "emotional_distance_trigger",
    ],
    commonResponses: [
      "panic_spiral_response",
      "reassurance_seeking_response",
      "preemptive_withdrawal_response",
    ],
    compatibleConflictBeats: [
      "delayed_reply_spiral",
      "space_misread_as_rejection",
      "forced_separation",
    ],
    repairNeeds: [
      "clear_return",
      "presence_without_mocking_need",
      "future_check_in_expectation",
      "consistent_follow_through",
    ],
    compatibleRepairStyles: [
      "presence_based_repair",
      "return_and_stay_repair",
      "verbal_reassurance_repair",
    ],
    incompatibleRepairStyles: [
      "silent_nonrepair",
      "unexplained_space",
      "empty_promise_without_return",
    ],
    consequencePatterns: [
      "heightened_separation_sensitivity",
      "reassurance_need_increases",
      "future_goodbyes_gain_emotional_weight",
    ],
    memoryEffects: [
      "goodbyes_become_sensitive",
      "return_promises_gain_importance",
      "missed_check_ins_are_remembered",
    ],
    growthPotential: [
      "learns_to_name_abandonment_fear",
      "creates_secure_return_ritual",
      "distinguishes_space_from_leaving",
    ],
    routeGates: [
      "first_abandonment_rupture_gate",
      "return_after_abandonment_gate",
      "secure_return_gate",
    ],
    milestoneMemories: [
      "first_left_during_conflict_memory",
      "first_reliable_return_memory",
    ],
    metadata: {
      category: "rupture_type",
      severityBias: "major",
      trustDamage: 8,
      attachmentDamage: 10,
      repairDifficulty: 8,
      angstValue: 10,
      healingValue: 10,
    },
  },
};

export const RUPTURE_TYPE_SEEDS = Object.freeze(
  getUniqueRuptureTypeIds().map((seed) =>
    createRuptureTypeSeedPreset(buildRuptureTypeInput(seed)),
  ),
) satisfies readonly RuptureTypeSeed[];

export const RUPTURE_TYPE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  RUPTURE_TYPE_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional damage: ${seed.emotionalDamage}.`,
        `Repair needs: ${seed.repairNeeds.slice(0, 3).join(", ")}.`,
      ].join(" "),
      examples: [...seed.examples, ...seed.commonResponses.slice(0, 2)],
      tags: ["rupture_type", seed.ruptureType, ...seed.tags],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.activatesWounds,
        ...seed.activatesFears,
        ...seed.compatibleRepairStyles,
        ...seed.consequencePatterns,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.incompatibleRepairStyles,
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
        rarity: seed.metadata.severityBias === "minor" ? "common" : "uncommon",
        romanceValue: seed.metadata.healingValue,
        conflictPotential: seed.metadata.repairDifficulty,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getRuptureTypeSeedsByCategory(
  ruptureType: RuptureTypeSeedType,
): readonly RuptureTypeSeed[] {
  const ids = new Set<string>(ruptureTypeCategories[ruptureType]);
  return RUPTURE_TYPE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRuptureTypeSeedsByType(
  ruptureType: RuptureTypeSeedType,
): readonly RuptureTypeSeed[] {
  return RUPTURE_TYPE_SEEDS.filter((seed) => seed.ruptureType === ruptureType);
}

export function findRuptureTypeSeedBySeed(
  seedId: string,
): RuptureTypeSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return RUPTURE_TYPE_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueRuptureTypeIds(): readonly string[] {
  return Array.from(new Set(Object.values(ruptureTypeCategories).flat()));
}

function buildRuptureTypeInput(seed: string): RuptureTypeSeedInput {
  const ruptureType = inferRuptureType(seed);
  const label = ruptureTypeLabel(seed);
  const override = RUPTURE_TYPE_OVERRIDES[seed] ?? {};
  const base: RuptureTypeSeedInput = {
    seed,
    label,
    description:
      `A relationship rupture where ${label.toLowerCase()} damages trust, attachment safety, or the shared meaning of the bond.`,
    examples: [
      "The rupture gives later scenes a specific emotional injury to repair.",
      "The conflict changes what future reassurance must prove.",
    ],
    tags: ["rupture_type", ruptureType, seed],
    relatedSeeds: defaultActivatesWounds(ruptureType),
    oppositeSeeds: defaultOppositeSeeds(ruptureType),
    romanceHooks: [`${seed}_repair_scene`, `${ruptureType}_rupture_romance`],
    scenarioHooks: [`${seed}_scene`, `${seed}_aftermath`],
    dialoguePatterns: defaultDialoguePatterns(ruptureType),
    ruptureType,
    emotionalDamage: defaultEmotionalDamage(ruptureType),
    damagedTrustLayer: defaultDamagedTrustLayer(ruptureType),
    activatesWounds: defaultActivatesWounds(ruptureType),
    activatesFears: defaultActivatesFears(ruptureType),
    frustratesDesires: defaultFrustratesDesires(ruptureType),
    commonTriggers: defaultCommonTriggers(ruptureType),
    commonResponses: defaultCommonResponses(ruptureType),
    compatibleConflictBeats: defaultCompatibleConflictBeats(ruptureType),
    repairNeeds: defaultRepairNeeds(ruptureType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(ruptureType),
    incompatibleRepairStyles: defaultIncompatibleRepairStyles(ruptureType),
    consequencePatterns: defaultConsequencePatterns(ruptureType),
    memoryEffects: defaultMemoryEffects(ruptureType),
    growthPotential: defaultGrowthPotential(ruptureType),
    routeGates: [`${seed}_gate`, `${seed}_repair_gate`],
    milestoneMemories: [`${seed}_memory`, `${seed}_repair_memory`],
    metadata: {
      category: "rupture_type",
      severityBias: defaultSeverityBias(ruptureType),
      trustDamage: defaultTrustDamage(ruptureType),
      attachmentDamage: defaultAttachmentDamage(ruptureType),
      repairDifficulty: defaultRepairDifficulty(ruptureType),
      angstValue: defaultAngstValue(ruptureType),
      healingValue: defaultHealingValue(ruptureType),
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

function inferRuptureType(seed: string): RuptureTypeSeedType {
  for (const [ruptureType, seeds] of Object.entries(ruptureTypeCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return ruptureType as RuptureTypeSeedType;
    }
  }

  return "identity";
}

function ruptureTypeLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function defaultOppositeSeeds(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["secure_return", "reliable_presence"];
    case "betrayal":
    case "trust":
      return ["earned_trust", "transparency"];
    case "boundary":
    case "safety":
      return ["respected_boundary", "safe_choice"];
    default:
      return [`repaired_${ruptureType}`, "secure_relationship_pattern"];
  }
}

function defaultDialoguePatterns(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["You left.", "I needed you and you were gone."];
    case "betrayal":
    case "trust":
      return ["You let me believe something that was not true."];
    case "boundary":
      return ["I said no. That should have been enough."];
    case "humiliation":
      return ["You made me feel small in front of everyone."];
    default:
      return ["Something broke there.", "I need you to understand what changed."];
  }
}

function defaultEmotionalDamage(ruptureType: RuptureTypeSeedType): string {
  switch (ruptureType) {
    case "abandonment":
    case "separation":
      return "Damages emotional permanence and confidence in safe return.";
    case "betrayal":
    case "trust":
      return "Damages reliability, truth, and confidence in future promises.";
    case "boundary":
    case "safety":
      return "Damages agency and the sense that closeness remains safe.";
    case "humiliation":
    case "public":
      return "Damages dignity, public safety, and willingness to be seen.";
    default:
      return "Damages the shared meaning of the relationship and what repair must prove.";
  }
}

function defaultDamagedTrustLayer(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
    case "attachment":
    case "separation":
      return ["attachment_trust", "return_trust"];
    case "betrayal":
    case "trust":
    case "broken_promise":
      return ["reliability_trust", "truth_trust"];
    case "boundary":
    case "safety":
      return ["safety_trust", "agency_trust"];
    default:
      return ["relationship_trust"];
  }
}

function defaultActivatesWounds(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
    case "attachment":
    case "separation":
      return ["abandonment_wound", "emotional_neglect_wound"];
    case "betrayal":
    case "trust":
    case "broken_promise":
      return ["betrayal_wound", "broken_promise_wound"];
    case "humiliation":
    case "public":
      return ["humiliation_wound", "shame_wound"];
    case "boundary":
    case "safety":
      return ["control_wound", "boundary_wound"];
    default:
      return ["relationship_identity_wound"];
  }
}

function defaultActivatesFears(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
    case "separation":
      return ["fear_of_abandonment", "fear_of_emotional_distance"];
    case "betrayal":
    case "trust":
      return ["fear_of_betrayal", "fear_of_being_used"];
    case "boundary":
    case "safety":
      return ["fear_of_being_controlled", "fear_of_vulnerability"];
    default:
      return ["fear_of_rejection"];
  }
}

function defaultFrustratesDesires(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
    case "attachment":
      return ["desire_for_reliable_love", "desire_for_emotional_presence"];
    case "boundary":
    case "safety":
      return ["desire_for_autonomy", "desire_for_safe_love"];
    case "exclusivity":
      return ["desire_to_be_chosen", "desire_for_devotion"];
    default:
      return ["desire_for_trust", "desire_for_repair"];
  }
}

function defaultCommonTriggers(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
    case "separation":
      return ["goodbye_trigger", "unanswered_message_trigger"];
    case "betrayal":
    case "trust":
      return ["secret_revealed_trigger", "broken_promise_trigger"];
    case "boundary":
      return ["boundary_ignored_trigger", "loss_of_choice_trigger"];
    default:
      return [`${ruptureType}_trigger`];
  }
}

function defaultCommonResponses(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["panic_spiral_response", "reassurance_seeking_response"];
    case "betrayal":
    case "trust":
      return ["emotional_lockdown_response", "trust_testing_response"];
    case "boundary":
      return ["boundary_assertion_response", "cold_withdrawal_response"];
    default:
      return ["withdrawal_response", "repair_seeking_response"];
  }
}

function defaultCompatibleConflictBeats(
  ruptureType: RuptureTypeSeedType,
): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["delayed_reply_spiral", "space_misread_as_rejection"];
    case "betrayal":
    case "trust":
      return ["protective_lie", "trust_test_failed"];
    case "boundary":
      return ["boundary_crossed", "care_misread_as_control"];
    default:
      return [`${ruptureType}_conflict_beat`];
  }
}

function defaultRepairNeeds(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
    case "separation":
      return ["clear_return", "presence", "future_check_in_expectation"];
    case "betrayal":
    case "trust":
    case "broken_promise":
      return ["truth", "accountability", "changed_behavior"];
    case "boundary":
    case "safety":
      return ["choice_restoration", "boundary_respect", "space"];
    default:
      return ["validation", "repair_follow_through"];
  }
}

function defaultCompatibleRepairStyles(
  ruptureType: RuptureTypeSeedType,
): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["presence_based_repair", "return_and_stay_repair"];
    case "betrayal":
    case "trust":
      return ["truth_and_accountability_repair", "transparency_repair"];
    case "boundary":
      return ["boundary_respect_repair", "choice_restoration_repair"];
    default:
      return ["validation_repair", "accountability_repair"];
  }
}

function defaultIncompatibleRepairStyles(
  ruptureType: RuptureTypeSeedType,
): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["silent_nonrepair", "unexplained_space"];
    case "betrayal":
      return ["empty_promise", "truth_withheld"];
    case "boundary":
      return ["pressure_repair", "touch_without_consent"];
    default:
      return ["repair_bypassing"];
  }
}

function defaultConsequencePatterns(
  ruptureType: RuptureTypeSeedType,
): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["attachment_damage_consequence", "reassurance_need_increase"];
    case "betrayal":
    case "trust":
      return ["trust_damage_consequence", "hypervigilance_consequence"];
    case "boundary":
      return ["boundary_hardening_consequence", "withdrawal_consequence"];
    default:
      return ["repair_readiness_consequence"];
  }
}

function defaultMemoryEffects(ruptureType: RuptureTypeSeedType): readonly string[] {
  return [`${ruptureType}_rupture_remembered`, `${ruptureType}_repair_needed`];
}

function defaultGrowthPotential(ruptureType: RuptureTypeSeedType): readonly string[] {
  switch (ruptureType) {
    case "abandonment":
      return ["learning_secure_attachment", "learning_to_stay"];
    case "betrayal":
    case "trust":
      return ["learning_to_trust", "learning_repair"];
    case "boundary":
      return ["learning_boundaries", "learning_autonomy"];
    default:
      return ["learning_repair"];
  }
}

function defaultSeverityBias(
  ruptureType: RuptureTypeSeedType,
): "minor" | "moderate" | "major" | "identity_level" {
  return ruptureType === "identity" ||
    ruptureType === "exclusivity" ||
    ruptureType === "abandonment"
    ? "major"
    : ruptureType === "betrayal" || ruptureType === "trust"
      ? "identity_level"
      : "moderate";
}

function defaultTrustDamage(ruptureType: RuptureTypeSeedType): number {
  return ruptureType === "betrayal" ||
    ruptureType === "trust" ||
    ruptureType === "broken_promise"
    ? 10
    : 7;
}

function defaultAttachmentDamage(ruptureType: RuptureTypeSeedType): number {
  return ruptureType === "abandonment" ||
    ruptureType === "attachment" ||
    ruptureType === "separation"
    ? 10
    : 7;
}

function defaultRepairDifficulty(ruptureType: RuptureTypeSeedType): number {
  return ruptureType === "betrayal" ||
    ruptureType === "trust" ||
    ruptureType === "boundary"
    ? 9
    : 7;
}

function defaultAngstValue(ruptureType: RuptureTypeSeedType): number {
  return ruptureType === "abandonment" ||
    ruptureType === "betrayal" ||
    ruptureType === "exclusivity"
    ? 10
    : 8;
}

function defaultHealingValue(ruptureType: RuptureTypeSeedType): number {
  return ruptureType === "abandonment" ||
    ruptureType === "betrayal" ||
    ruptureType === "boundary"
    ? 10
    : 8;
}
