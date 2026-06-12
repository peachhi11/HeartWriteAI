import {
  createRepairNeedSeedPreset,
  createVocabularySeedPreset,
  type RepairNeedSeed,
  type RepairNeedSeedInput,
  type RepairNeedSeedType,
  type RepairNeedUrgency,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const repairNeedsSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Hidden Need",
  "Trigger",
  "Response",
  "Conflict Beat",
  "Rupture Type",
  "Consequence",
  "Repair Need",
  "Repair Style",
  "Repair Beat",
  "Growth Arc",
  "Relationship Identity",
] as const;

export const repairNeedPresets = [
  "Need for Reassurance",
  "Need for Accountability",
  "Need for Changed Behavior",
  "Need for Truth",
  "Need for Validation",
  "Need for Emotional Presence",
  "Need for Safe Return",
  "Need for Consistency",
  "Need for Boundary Respect",
  "Need for Choice Restoration",
  "Need for Dignity Restoration",
  "Need for Public Loyalty",
  "Need for Private Comfort",
  "Need for Space With Return",
  "Need for Gentle Honesty",
  "Need for No Excuses",
  "Need for Time",
  "Need for Proof Through Action",
  "Need for Vulnerability",
  "Need for Recommitment",
] as const;

export const repairNeedExpansionLogic = {
  consequence_to_repair_need: {
    trust_damage_consequence: [
      "need_for_truth",
      "need_for_accountability",
      "need_for_changed_behavior",
      "need_for_consistency",
    ],
    attachment_damage_consequence: [
      "need_for_reassurance",
      "need_for_safe_return",
      "need_for_emotional_presence",
      "need_for_consistency",
    ],
    emotional_safety_damage_consequence: [
      "need_for_validation",
      "need_for_boundary_respect",
      "need_for_private_comfort",
      "need_for_gentle_honesty",
    ],
    vulnerability_shutdown_consequence: [
      "need_for_space_with_return",
      "need_for_emotional_presence",
      "need_for_time",
      "need_for_private_comfort",
    ],
    boundary_hardening_consequence: [
      "need_for_boundary_respect",
      "need_for_choice_restoration",
      "need_for_space_with_return",
    ],
    relationship_identity_damage: [
      "need_for_recommitment",
      "need_for_public_loyalty",
      "need_for_proof_through_action",
    ],
  },
  rupture_to_repair_need: {
    abandonment_rupture: [
      "need_for_safe_return",
      "need_for_reassurance",
      "need_for_consistency",
    ],
    betrayal_rupture: [
      "need_for_truth",
      "need_for_accountability",
      "need_for_proof_through_action",
    ],
    broken_promise_rupture: [
      "need_for_changed_behavior",
      "need_for_consistency",
      "need_for_proof_through_action",
    ],
    humiliation_rupture: [
      "need_for_dignity_restoration",
      "need_for_private_comfort",
      "need_for_public_loyalty",
    ],
    boundary_violation_rupture: [
      "need_for_boundary_respect",
      "need_for_choice_restoration",
      "need_for_no_excuses",
    ],
  },
  repair_need_to_repair_style: {
    need_for_reassurance: [
      "verbal_reassurance_repair",
      "attachment_reassurance_repair",
      "return_and_stay_repair",
    ],
    need_for_accountability: [
      "accountability_repair",
      "ownership_repair",
      "truth_and_accountability_repair",
    ],
    need_for_changed_behavior: [
      "behavior_change_repair",
      "pattern_breaking_repair",
      "consistency_repair",
    ],
    need_for_boundary_respect: [
      "boundary_respect_repair",
      "choice_restoration_repair",
      "space_based_repair",
    ],
    need_for_dignity_restoration: [
      "dignity_restoration_repair",
      "private_comfort_repair",
      "public_support_repair",
    ],
  },
} as const;

export const repairNeedCategories = {
  reassurance: ["need_for_reassurance"],
  accountability: ["need_for_accountability", "need_for_no_excuses"],
  behavior_change: ["need_for_changed_behavior"],
  truth: ["need_for_truth", "need_for_gentle_honesty"],
  validation: ["need_for_validation"],
  presence: ["need_for_emotional_presence"],
  return: ["need_for_safe_return"],
  consistency: ["need_for_consistency"],
  boundary: ["need_for_boundary_respect"],
  choice: ["need_for_choice_restoration"],
  dignity: ["need_for_dignity_restoration"],
  loyalty: ["need_for_public_loyalty"],
  comfort: ["need_for_private_comfort"],
  space: ["need_for_space_with_return"],
  time: ["need_for_time"],
  action: ["need_for_proof_through_action"],
  vulnerability: ["need_for_vulnerability"],
  recommitment: ["need_for_recommitment"],
} as const satisfies Record<RepairNeedSeedType, readonly string[]>;

type RepairNeedOverride = Partial<RepairNeedSeedInput> & {
  label?: string;
};

const REPAIR_NEED_OVERRIDES: Record<string, RepairNeedOverride> = {
  need_for_accountability: {
    description:
      "A repair need where the hurt character requires the other person to clearly own the harm without excuses, minimization, or forced forgiveness.",
    examples: [
      "They need the lie named directly.",
      "They need the broken promise acknowledged.",
      "They cannot move forward while the harm is being explained away.",
    ],
    tags: ["repair_need", "accountability", "trust_repair", "rupture"],
    relatedSeeds: [
      "accountability_repair",
      "accountability_beat",
      "trust_damage_consequence",
      "betrayal_rupture",
    ],
    oppositeSeeds: [
      "excuse_making",
      "blame_shifting",
      "repair_bypassing",
    ],
    romanceHooks: [
      "owning_the_hurt",
      "trust_rebuild_begins",
      "no_excuses_apology",
    ],
    scenarioHooks: [
      "after_the_lie",
      "broken_promise_aftermath",
      "post_argument_repair",
    ],
    dialoguePatterns: [
      "Do not explain it away.",
      "I need you to understand what you did.",
      "An apology is not the same as accountability.",
    ],
    needType: "accountability",
    repairsConsequences: [
      "trust_damage_consequence",
      "resentment_build_up_consequence",
      "emotional_safety_damage_consequence",
    ],
    repairsRuptures: [
      "betrayal_rupture",
      "broken_promise_rupture",
      "boundary_violation_rupture",
    ],
    activatedByWounds: [
      "betrayal_wound",
      "broken_promise_wound",
      "emotional_invalidation_wound",
    ],
    activatedByFears: [
      "fear_of_betrayal",
      "fear_of_being_used",
      "fear_of_moral_failure",
    ],
    frustratedDesires: [
      "desire_for_truth",
      "desire_for_reliable_love",
      "desire_for_emotional_safety",
    ],
    compatibleRepairStyles: [
      "accountability_repair",
      "truth_and_accountability_repair",
      "ownership_repair",
    ],
    compatibleRepairBeats: [
      "accountability_beat",
      "no_excuses_beat",
      "truth_comes_out_beat",
    ],
    incompatibleRepairs: [
      "empty_apology",
      "gift_without_accountability",
      "physical_comfort_without_consent",
      "grand_gesture_without_change",
    ],
    requiredConditions: [
      "specific_admission",
      "no_defensiveness",
      "no_forced_forgiveness",
      "willingness_to_change",
    ],
    fulfillmentSignals: [
      "hurt_is_named_correctly",
      "responsibility_is_accepted",
      "future_behavior_plan_exists",
    ],
    failureModes: [
      "apology_used_to_end_conversation",
      "self_punishment_replaces_repair",
      "accountability_without_change",
    ],
    growthArcs: [
      "learning_repair",
      "learning_safe_conflict",
      "learning_to_trust",
    ],
    routeGates: [
      "first_accountability_gate",
      "no_excuses_repair_gate",
      "trust_rebuild_begins_gate",
    ],
    milestoneMemories: [
      "first_real_accountability_memory",
      "repair_begins_memory",
    ],
    metadata: {
      urgency: "high",
      repairPower: 9,
      trustRepairValue: 10,
      attachmentRepairValue: 6,
      healingValue: 9,
    },
  },
};

export const REPAIR_NEED_SEEDS = Object.freeze(
  getUniqueRepairNeedIds().map((seed) =>
    createRepairNeedSeedPreset(buildRepairNeedInput(seed)),
  ),
) satisfies readonly RepairNeedSeed[];

export const REPAIR_NEED_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  REPAIR_NEED_SEEDS.map(toStandardRepairNeedVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getRepairNeedSeedsByCategory(
  needType: RepairNeedSeedType,
): readonly RepairNeedSeed[] {
  const ids = new Set<string>(repairNeedCategories[needType]);
  return REPAIR_NEED_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRepairNeedSeedsByType(
  needType: RepairNeedSeedType,
): readonly RepairNeedSeed[] {
  return REPAIR_NEED_SEEDS.filter((seed) => seed.needType === needType);
}

export function findRepairNeedSeedBySeed(
  seedId: string,
): RepairNeedSeed | undefined {
  return REPAIR_NEED_SEEDS.find((seed) => seed.seed === seedId);
}

function getUniqueRepairNeedIds(): readonly string[] {
  return Array.from(new Set(Object.values(repairNeedCategories).flat()));
}

function buildRepairNeedInput(seed: string): RepairNeedSeedInput {
  const needType = inferRepairNeedType(seed);
  const label = repairNeedLabel(seed);
  const base: RepairNeedSeedInput = {
    seed,
    label,
    description: defaultDescription(label, needType),
    examples: defaultExamples(label, needType),
    tags: [
      "repair_need",
      needType,
      "repair_engine",
      "rupture_aftermath",
    ],
    relatedSeeds: defaultRelatedSeeds(seed, needType),
    oppositeSeeds: defaultOppositeSeeds(needType),
    romanceHooks: defaultRomanceHooks(seed, needType),
    scenarioHooks: defaultScenarioHooks(seed, needType),
    dialoguePatterns: defaultDialoguePatterns(label, needType),
    needType,
    repairsConsequences: defaultRepairsConsequences(needType),
    repairsRuptures: defaultRepairsRuptures(needType),
    activatedByWounds: defaultActivatedByWounds(needType),
    activatedByFears: defaultActivatedByFears(needType),
    frustratedDesires: defaultFrustratedDesires(needType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(needType),
    compatibleRepairBeats: defaultCompatibleRepairBeats(needType),
    incompatibleRepairs: defaultIncompatibleRepairs(needType),
    requiredConditions: defaultRequiredConditions(needType),
    fulfillmentSignals: defaultFulfillmentSignals(needType),
    failureModes: defaultFailureModes(needType),
    growthArcs: defaultGrowthArcs(needType),
    routeGates: defaultRouteGates(seed, needType),
    milestoneMemories: defaultMilestoneMemories(seed),
    metadata: {
      category: "repair_need",
      urgency: defaultUrgency(needType),
      repairPower: defaultRepairPower(needType),
      trustRepairValue: defaultTrustRepairValue(needType),
      attachmentRepairValue: defaultAttachmentRepairValue(needType),
      healingValue: defaultHealingValue(needType),
    },
  };
  const override = REPAIR_NEED_OVERRIDES[seed];

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override?.metadata,
    },
  };
}

function toStandardRepairNeedVocabularySeed(
  seed: RepairNeedSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Repair need type: ${seed.needType}.`,
      `Required conditions: ${seed.requiredConditions.slice(0, 3).join(", ")}.`,
      `Failure modes: ${seed.failureModes.slice(0, 2).join(", ")}.`,
    ].join(" "),
    examples: [
      ...seed.examples,
      ...seed.fulfillmentSignals,
      ...seed.milestoneMemories,
    ],
    tags: [
      "repair_need",
      seed.needType,
      seed.metadata.urgency,
      ...seed.tags,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.repairsConsequences,
      ...seed.repairsRuptures,
      ...seed.activatedByWounds,
      ...seed.activatedByFears,
      ...seed.frustratedDesires,
      ...seed.compatibleRepairStyles,
      ...seed.compatibleRepairBeats,
    ],
    oppositeSeeds: [
      ...seed.oppositeSeeds,
      ...seed.incompatibleRepairs,
      ...seed.failureModes,
    ],
    romanceHooks: [
      ...seed.romanceHooks,
      ...seed.growthArcs,
    ],
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: seed.metadata.urgency === "critical" ? "rare" : "uncommon",
      romanceValue: seed.metadata.repairPower,
      conflictPotential: 11 - seed.metadata.healingValue,
    },
  });
}

function inferRepairNeedType(seed: string): RepairNeedSeedType {
  for (const [needType, seeds] of Object.entries(repairNeedCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return needType as RepairNeedSeedType;
    }
  }

  return "reassurance";
}

function repairNeedLabel(seed: string): string {
  const presetLabel = repairNeedPresets.find(
    (preset) => slugifyRepairNeedPreset(preset) === seed,
  );

  return presetLabel ?? seed
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyRepairNeedPreset(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function defaultDescription(label: string, needType: RepairNeedSeedType): string {
  return `${label} is a ${needType.replace(/_/g, " ")} repair need that tells the route engine what must be restored before trust can move forward. It keeps repair grounded in conditions, evidence, and emotional safety rather than instant forgiveness.`;
}

function defaultExamples(
  label: string,
  needType: RepairNeedSeedType,
): readonly string[] {
  return [
    `${label} can surface after a rupture when apology alone does not answer the damage.`,
    `The character may need this ${needType.replace(/_/g, " ")} repair before comfort can land.`,
    "If the need is ignored, the scene can harden into distance, resentment, or another rupture.",
    "A healthy route lets the need be named without forcing forgiveness on a schedule.",
  ];
}

function defaultRelatedSeeds(
  seed: string,
  needType: RepairNeedSeedType,
): readonly string[] {
  return [
    `${needType}_repair_need`,
    `${seed}_route`,
    ...defaultCompatibleRepairStyles(needType).slice(0, 2),
  ];
}

function defaultOppositeSeeds(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["excuse_making", "repair_bypassing", "blame_shifting"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["control_disguised_as_care", "boundary_pressure", "forced_forgiveness"];
  }
  return ["empty_apology", "hot_cold_repair", "unmet_repair_need"];
}

function defaultRomanceHooks(
  seed: string,
  needType: RepairNeedSeedType,
): readonly string[] {
  if (needType === "recommitment" || needType === "loyalty") {
    return ["chosen_again_after_rupture", "public_loyalty_as_repair", "no_more_hiding"];
  }
  if (needType === "return" || needType === "reassurance") {
    return ["i_am_not_leaving_repair", "return_as_romance", "safe_return_after_fear"];
  }
  return [`${seed}_romance_hook`, "repair_that_actually_lands", "trust_rebuild_begins"];
}

function defaultScenarioHooks(
  seed: string,
  needType: RepairNeedSeedType,
): readonly string[] {
  if (needType === "truth" || needType === "accountability") {
    return ["after_the_lie", "broken_promise_aftermath", "post_argument_repair"];
  }
  if (needType === "space" || needType === "time") {
    return ["cooldown_after_fight", "return_after_space", "low_pressure_repair"];
  }
  return [`${seed}_scene`, "repair_need_named", "rupture_aftermath_scene"];
}

function defaultDialoguePatterns(
  label: string,
  needType: RepairNeedSeedType,
): readonly string[] {
  if (needType === "boundary" || needType === "choice") {
    return [
      "I need my no to matter before I can trust your yes.",
      "Do not fix this by deciding for me again.",
      "Give me back the choice first.",
    ];
  }
  if (needType === "reassurance" || needType === "return") {
    return [
      "Tell me you are still here.",
      "I need to know this was distance, not an ending.",
      "Come back because you mean to stay.",
    ];
  }
  return [
    `I need ${label.toLowerCase()}, not a faster ending to this conversation.`,
    "Do not make me carry the repair for both of us.",
    "Show me you understand what broke.",
  ];
}

function defaultRepairsConsequences(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "truth" || needType === "accountability" || needType === "action") {
    return ["trust_damage_consequence", "resentment_build_up_consequence"];
  }
  if (needType === "reassurance" || needType === "return" || needType === "presence") {
    return ["attachment_damage_consequence", "emotional_distance_consequence"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["boundary_hardening_consequence", "emotional_safety_damage_consequence"];
  }
  return ["emotional_safety_damage_consequence", "repair_readiness_consequence"];
}

function defaultRepairsRuptures(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "truth" || needType === "accountability" || needType === "action") {
    return ["betrayal_rupture", "broken_promise_rupture"];
  }
  if (needType === "reassurance" || needType === "return") {
    return ["abandonment_rupture", "emotional_absence_rupture"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["boundary_violation_rupture", "autonomy_rupture"];
  }
  return ["emotional_invalidation_rupture", "relationship_identity_rupture"];
}

function defaultActivatedByWounds(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["betrayal_wound", "trust_issues"];
  }
  if (needType === "reassurance" || needType === "return") {
    return ["abandonment_wound", "emotional_neglect_wound"];
  }
  if (needType === "dignity" || needType === "validation") {
    return ["humiliation_wound", "shame_wound"];
  }
  return ["control_wound", "boundary_violation_wound"];
}

function defaultActivatedByFears(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["fear_of_betrayal", "fear_of_being_used"];
  }
  if (needType === "reassurance" || needType === "return") {
    return ["fear_of_abandonment", "fear_of_emotional_distance"];
  }
  return ["fear_of_vulnerability", "fear_of_losing_control"];
}

function defaultFrustratedDesires(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "recommitment" || needType === "loyalty") {
    return ["desire_to_be_chosen", "desire_for_devotion"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["desire_for_autonomy", "desire_for_respect"];
  }
  return ["desire_for_reliable_love", "desire_for_emotional_safety"];
}

function defaultCompatibleRepairStyles(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "truth" || needType === "accountability") {
    return ["truth_and_accountability_repair", "accountability_repair", "ownership_repair"];
  }
  if (needType === "reassurance" || needType === "return") {
    return ["verbal_reassurance_repair", "return_and_stay_repair", "presence_based_repair"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["boundary_respect_repair", "choice_restoration_repair", "space_based_repair"];
  }
  return ["validation_repair", "presence_based_repair", "gentle_reassurance_repair"];
}

function defaultCompatibleRepairBeats(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "truth" || needType === "accountability") {
    return ["truth_comes_out_beat", "accountability_beat", "no_excuses_beat"];
  }
  if (needType === "reassurance" || needType === "return") {
    return ["i_am_not_leaving_beat", "return_after_leaving_beat", "reassurance_after_fear_beat"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["boundary_respected_beat", "choice_restored_beat", "space_with_return_beat"];
  }
  return ["validation_beat", "private_comfort_beat", "heart_to_heart_beat"];
}

function defaultIncompatibleRepairs(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["empty_apology", "self_punishment_replaces_repair", "gift_without_accountability"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["pressure_to_forgive", "touch_without_consent", "decision_made_for_them"];
  }
  return ["rushed_repair", "grand_gesture_without_change", "comfort_without_listening"];
}

function defaultRequiredConditions(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["specific_admission", "no_defensiveness", "no_forced_forgiveness"];
  }
  if (needType === "space" || needType === "time") {
    return ["clear_return_plan", "low_pressure_contact", "no_punishing_the_need"];
  }
  return ["need_is_named", "agency_is_respected", "repair_matches_damage"];
}

function defaultFulfillmentSignals(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "action" || needType === "behavior_change") {
    return ["changed_behavior_repeats", "promise_is_kept", "old_pattern_breaks"];
  }
  if (needType === "reassurance" || needType === "return") {
    return ["return_is_clear", "care_is_restated", "distance_is_explained"];
  }
  return ["hurt_is_understood", "boundary_is_respected", "repair_lands_without_pressure"];
}

function defaultFailureModes(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["apology_without_specifics", "truth_minimized", "blame_shifted"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["repair_becomes_pressure", "choice_is_performed_not_restored", "boundary_is_negotiated_down"];
  }
  return ["need_is_rushed", "comfort_replaces_repair", "same_pattern_returns"];
}

function defaultGrowthArcs(needType: RepairNeedSeedType): readonly string[] {
  if (needType === "accountability" || needType === "truth") {
    return ["learning_repair", "learning_safe_conflict", "learning_to_trust"];
  }
  if (needType === "boundary" || needType === "choice") {
    return ["learning_love_without_control", "learning_to_restore_agency"];
  }
  return ["learning_to_receive_repair", "learning_secure_return"];
}

function defaultRouteGates(seed: string, needType: RepairNeedSeedType): readonly string[] {
  return [
    `first_${needType}_repair_need_gate`,
    `${seed}_gate`,
  ];
}

function defaultMilestoneMemories(seed: string): readonly string[] {
  return [
    `first_${seed}_memory`,
    `${seed}_met_memory`,
  ];
}

function defaultUrgency(needType: RepairNeedSeedType): RepairNeedUrgency {
  if (needType === "truth" || needType === "accountability" || needType === "boundary") {
    return "high";
  }
  if (needType === "recommitment") {
    return "critical";
  }
  return "medium";
}

function defaultRepairPower(needType: RepairNeedSeedType): number {
  return needType === "recommitment" || needType === "accountability" ? 9 : 8;
}

function defaultTrustRepairValue(needType: RepairNeedSeedType): number {
  return needType === "truth" || needType === "accountability" || needType === "consistency"
    ? 10
    : 7;
}

function defaultAttachmentRepairValue(needType: RepairNeedSeedType): number {
  return needType === "reassurance" || needType === "return" || needType === "presence"
    ? 10
    : 7;
}

function defaultHealingValue(needType: RepairNeedSeedType): number {
  return needType === "comfort" || needType === "validation" || needType === "dignity"
    ? 10
    : 8;
}
