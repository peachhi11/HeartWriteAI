import {
  createConsequenceSeedPreset,
  createVocabularySeedPreset,
  type ConsequenceSeed,
  type ConsequenceSeedInput,
  type ConsequenceSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const consequenceSemanticChain = [
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
  "Repair Arc",
  "Milestone Memory",
  "Growth Arc",
] as const;

export const consequencePresets = [
  "Trust Damage Consequence",
  "Attachment Damage Consequence",
  "Emotional Safety Damage Consequence",
  "Vulnerability Shutdown Consequence",
  "Withdrawal Consequence",
  "Hypervigilance Consequence",
  "Reassurance Need Increase",
  "Conflict Avoidance Consequence",
  "Fear Reinforcement Consequence",
  "Resentment Build-Up Consequence",
  "Emotional Distance Consequence",
  "Broken Ritual Consequence",
  "Relationship Identity Damage",
  "Public Reputation Consequence",
  "Boundary Hardening Consequence",
  "Jealousy Escalation Consequence",
  "Loss of Reliability Consequence",
  "Loss of Priority Consequence",
  "Self-Worth Collapse Consequence",
  "Repair Readiness Consequence",
] as const;

export const consequenceExpansionLogic = {
  rupture_type_to_consequence: {
    abandonment_rupture: [
      "attachment_damage_consequence",
      "reassurance_need_increase",
      "emotional_distance_consequence",
    ],
    betrayal_rupture: [
      "trust_damage_consequence",
      "hypervigilance_consequence",
      "loss_of_reliability_consequence",
    ],
    broken_promise_rupture: [
      "loss_of_reliability_consequence",
      "fear_reinforcement_consequence",
      "resentment_build_up_consequence",
    ],
    humiliation_rupture: [
      "self_worth_collapse_consequence",
      "vulnerability_shutdown_consequence",
      "public_reputation_consequence",
    ],
    boundary_violation_rupture: [
      "boundary_hardening_consequence",
      "emotional_safety_damage_consequence",
      "withdrawal_consequence",
    ],
    relationship_identity_rupture: [
      "relationship_identity_damage",
      "broken_ritual_consequence",
      "repair_readiness_consequence",
    ],
  },
  consequence_to_repair_style: {
    trust_damage_consequence: [
      "truth_and_accountability_repair",
      "consistency_repair",
      "proof_of_change_repair",
    ],
    attachment_damage_consequence: [
      "presence_based_repair",
      "return_and_stay_repair",
      "verbal_reassurance_repair",
    ],
    emotional_safety_damage_consequence: [
      "validation_repair",
      "boundary_respect_repair",
      "gentle_reassurance_repair",
    ],
    vulnerability_shutdown_consequence: [
      "low_pressure_repair",
      "presence_based_repair",
      "safe_to_be_seen_repair",
    ],
    boundary_hardening_consequence: [
      "choice_restoration_repair",
      "space_based_repair",
      "boundary_respect_repair",
    ],
    broken_ritual_consequence: [
      "ritual_repair",
      "reconnection_ritual_repair",
      "relationship_maintenance_repair",
    ],
  },
} as const;

export const consequenceCategories = {
  trust_damage: ["trust_damage_consequence"],
  attachment_damage: ["attachment_damage_consequence"],
  emotional_safety: ["emotional_safety_damage_consequence"],
  vulnerability: ["vulnerability_shutdown_consequence"],
  withdrawal: ["withdrawal_consequence"],
  hypervigilance: ["hypervigilance_consequence"],
  reassurance: ["reassurance_need_increase"],
  avoidance: ["conflict_avoidance_consequence"],
  fear_reinforcement: ["fear_reinforcement_consequence"],
  resentment: ["resentment_build_up_consequence"],
  distance: ["emotional_distance_consequence"],
  ritual_damage: ["broken_ritual_consequence"],
  identity_damage: ["relationship_identity_damage"],
  public: ["public_reputation_consequence"],
  boundary: ["boundary_hardening_consequence"],
  jealousy: ["jealousy_escalation_consequence"],
  reliability: ["loss_of_reliability_consequence"],
  priority: ["loss_of_priority_consequence"],
  self_worth: ["self_worth_collapse_consequence"],
  repair_readiness: ["repair_readiness_consequence"],
} as const satisfies Record<ConsequenceSeedType, readonly string[]>;

type ConsequenceOverride = Partial<ConsequenceSeedInput> & {
  label?: string;
};

const CONSEQUENCE_OVERRIDES: Record<string, ConsequenceOverride> = {
  trust_damage_consequence: {
    label: "Trust Damage Consequence",
    description:
      "A consequence where the relationship loses reliability, emotional faith, or confidence after a rupture.",
    examples: [
      "A character stops believing promises.",
      "Future reassurances are treated as uncertain.",
      "The same apology no longer works.",
    ],
    tags: ["consequence", "trust", "rupture_aftermath", "repair_needed"],
    relatedSeeds: [
      "betrayal_rupture",
      "broken_promise_rupture",
      "trust_rebuilding_repair",
      "earned_trust_repair",
    ],
    oppositeSeeds: ["earned_trust", "secure_reliability", "emotional_safety"],
    romanceHooks: [
      "trust_must_be_earned_again",
      "words_are_not_enough",
      "slow_repair_after_betrayal",
    ],
    scenarioHooks: [
      "after_the_lie",
      "broken_promise_aftermath",
      "trust_test_after_rupture",
    ],
    dialoguePatterns: [
      "I want to believe you.",
      "Words are easy.",
      "You taught me not to trust that promise.",
    ],
    consequenceType: "trust_damage",
    causedBy: [
      "betrayal_rupture",
      "broken_promise_rupture",
      "protective_lie_rupture",
    ],
    affectsTrustLayers: [
      "reliability_trust",
      "emotional_trust",
      "vulnerability_trust",
    ],
    likelyResponses: [
      "emotional_lockdown_response",
      "trust_testing_response",
      "hypervigilance_response",
    ],
    repairNeeds: [
      "truth",
      "accountability",
      "changed_behavior",
      "consistency_over_time",
    ],
    compatibleRepairStyles: [
      "truth_and_accountability_repair",
      "proof_of_change_repair",
      "consistency_repair",
    ],
    growthPotential: [
      "learns_trust_can_be_rebuilt_slowly",
      "sets_clear_boundaries",
      "distinguishes_words_from_evidence",
    ],
    milestoneMemories: [
      "trust_broken_memory",
      "first_consistent_follow_through_memory",
    ],
    metadata: {
      category: "consequence",
      severity: "major",
      persistence: "arc_level",
      angstValue: 9,
      healingValue: 10,
      repairDifficulty: 9,
    },
  },
};

export const CONSEQUENCE_SEEDS = Object.freeze(
  getUniqueConsequenceIds().map((seed) =>
    createConsequenceSeedPreset(buildConsequenceInput(seed)),
  ),
) satisfies readonly ConsequenceSeed[];

export const CONSEQUENCE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  CONSEQUENCE_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Consequence type: ${seed.consequenceType}.`,
        `Repair needs: ${seed.repairNeeds.slice(0, 3).join(", ")}.`,
      ].join(" "),
      examples: [...seed.examples, ...seed.likelyResponses.slice(0, 2)],
      tags: ["consequence", seed.consequenceType, ...seed.tags],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.causedBy,
        ...seed.compatibleRepairStyles,
        ...seed.growthPotential,
      ],
      oppositeSeeds: seed.oppositeSeeds,
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.repairNeeds,
        ...seed.milestoneMemories,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.severity === "minor" ? "common" : "uncommon",
        romanceValue: seed.metadata.healingValue,
        conflictPotential: seed.metadata.repairDifficulty,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getConsequenceSeedsByCategory(
  consequenceType: ConsequenceSeedType,
): readonly ConsequenceSeed[] {
  const ids = new Set<string>(consequenceCategories[consequenceType]);
  return CONSEQUENCE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getConsequenceSeedsByType(
  consequenceType: ConsequenceSeedType,
): readonly ConsequenceSeed[] {
  return CONSEQUENCE_SEEDS.filter((seed) => seed.consequenceType === consequenceType);
}

export function findConsequenceSeedBySeed(
  seedId: string,
): ConsequenceSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return CONSEQUENCE_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueConsequenceIds(): readonly string[] {
  return Array.from(new Set(Object.values(consequenceCategories).flat()));
}

function buildConsequenceInput(seed: string): ConsequenceSeedInput {
  const consequenceType = inferConsequenceType(seed);
  const label = consequenceLabel(seed);
  const override = CONSEQUENCE_OVERRIDES[seed] ?? {};
  const base: ConsequenceSeedInput = {
    seed,
    label,
    description:
      `A relationship aftermath state where ${label.toLowerCase()} changes how future closeness, conflict, and repair are interpreted.`,
    examples: [
      "The consequence shapes later choices even after the original argument ends.",
      "Repair must address the changed emotional pattern, not only the inciting incident.",
    ],
    tags: ["consequence", consequenceType, seed],
    relatedSeeds: defaultCausedBy(consequenceType),
    oppositeSeeds: defaultOppositeSeeds(consequenceType),
    romanceHooks: [`${seed}_repair_arc`, `${consequenceType}_healing_romance`],
    scenarioHooks: [`${seed}_aftermath_scene`, `${seed}_repair_test`],
    dialoguePatterns: defaultDialoguePatterns(consequenceType),
    consequenceType,
    causedBy: defaultCausedBy(consequenceType),
    affectsTrustLayers: defaultTrustLayers(consequenceType),
    likelyResponses: defaultLikelyResponses(consequenceType),
    repairNeeds: defaultRepairNeeds(consequenceType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(consequenceType),
    growthPotential: defaultGrowthPotential(consequenceType),
    milestoneMemories: [`${seed}_memory`, `${seed}_repair_memory`],
    metadata: {
      category: "consequence",
      severity: defaultSeverity(consequenceType),
      persistence: defaultPersistence(consequenceType),
      angstValue: defaultAngstValue(consequenceType),
      healingValue: defaultHealingValue(consequenceType),
      repairDifficulty: defaultRepairDifficulty(consequenceType),
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

function inferConsequenceType(seed: string): ConsequenceSeedType {
  for (const [consequenceType, seeds] of Object.entries(consequenceCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return consequenceType as ConsequenceSeedType;
    }
  }

  return "repair_readiness";
}

function consequenceLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(" Build Up ", " Build-Up ");
}

function defaultCausedBy(consequenceType: ConsequenceSeedType): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
    case "hypervigilance":
    case "reliability":
      return ["betrayal_rupture", "broken_promise_rupture"];
    case "attachment_damage":
    case "reassurance":
    case "distance":
      return ["abandonment_rupture", "emotional_absence_rupture"];
    case "emotional_safety":
    case "boundary":
    case "withdrawal":
      return ["boundary_violation_rupture", "emotional_invalidation_rupture"];
    case "vulnerability":
    case "self_worth":
    case "public":
      return ["humiliation_rupture", "dignity_rupture"];
    case "ritual_damage":
    case "identity_damage":
    case "priority":
      return ["relationship_identity_rupture"];
    case "jealousy":
      return ["exclusivity_rupture", "being_chosen_last"];
    case "avoidance":
    case "fear_reinforcement":
    case "resentment":
    case "repair_readiness":
      return ["unresolved_conflict", "repair_delay"];
  }
}

function defaultOppositeSeeds(consequenceType: ConsequenceSeedType): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
      return ["earned_trust", "secure_reliability"];
    case "attachment_damage":
      return ["secure_return", "emotional_permanence"];
    case "emotional_safety":
      return ["safe_conflict", "trusted_boundaries"];
    case "boundary":
      return ["flexible_boundaries", "choice_restored"];
    case "self_worth":
      return ["self_acceptance", "dignity_restored"];
    default:
      return [`resolved_${consequenceType}`, "repair_integrated"];
  }
}

function defaultDialoguePatterns(
  consequenceType: ConsequenceSeedType,
): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
      return ["I want to believe you.", "Words are easy."];
    case "attachment_damage":
      return ["You came back, but part of me is still waiting for you to leave."];
    case "emotional_safety":
      return ["I do not know if this is safe to say anymore."];
    case "boundary":
      return ["I heard you. I just do not know if you heard my no."];
    case "self_worth":
      return ["It made me feel small. I am tired of pretending it did not."];
    default:
      return ["Something changed after that.", "I need the repair to reach the part that changed."];
  }
}

function defaultTrustLayers(consequenceType: ConsequenceSeedType): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
    case "reliability":
      return ["reliability_trust", "emotional_trust"];
    case "attachment_damage":
    case "reassurance":
    case "distance":
      return ["attachment_trust", "return_trust"];
    case "emotional_safety":
    case "vulnerability":
    case "boundary":
      return ["safety_trust", "vulnerability_trust"];
    default:
      return ["relationship_trust"];
  }
}

function defaultLikelyResponses(consequenceType: ConsequenceSeedType): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
      return ["emotional_lockdown_response", "trust_testing_response"];
    case "attachment_damage":
      return ["reassurance_seeking_response", "panic_spiral_response"];
    case "boundary":
      return ["boundary_rigidity_response", "withdrawal_response"];
    case "vulnerability":
      return ["emotional_withdrawal_response", "humor_deflection_response"];
    default:
      return ["protective_response", "repair_seeking_response"];
  }
}

function defaultRepairNeeds(consequenceType: ConsequenceSeedType): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
    case "reliability":
      return ["truth", "accountability", "changed_behavior"];
    case "attachment_damage":
    case "reassurance":
      return ["clear_return", "reassurance", "consistent_presence"];
    case "boundary":
      return ["choice_restoration", "boundary_respect", "no_pressure"];
    case "ritual_damage":
      return ["ritual_repair", "relationship_maintenance"];
    default:
      return ["validation", "repair_follow_through"];
  }
}

function defaultCompatibleRepairStyles(
  consequenceType: ConsequenceSeedType,
): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
    case "reliability":
      return ["truth_and_accountability_repair", "consistency_repair"];
    case "attachment_damage":
    case "reassurance":
      return ["presence_based_repair", "verbal_reassurance_repair"];
    case "boundary":
      return ["choice_restoration_repair", "space_based_repair"];
    case "ritual_damage":
      return ["ritual_repair", "reconnection_ritual_repair"];
    default:
      return ["validation_repair", "gentle_reassurance_repair"];
  }
}

function defaultGrowthPotential(
  consequenceType: ConsequenceSeedType,
): readonly string[] {
  switch (consequenceType) {
    case "trust_damage":
    case "reliability":
      return ["learning_to_trust", "learning_consistency"];
    case "attachment_damage":
    case "reassurance":
      return ["learning_secure_attachment", "learning_to_stay"];
    case "boundary":
      return ["learning_boundaries", "learning_autonomy"];
    case "self_worth":
      return ["learning_they_are_enough"];
    default:
      return ["learning_repair"];
  }
}

function defaultSeverity(
  consequenceType: ConsequenceSeedType,
): "minor" | "moderate" | "major" | "severe" {
  return consequenceType === "trust_damage" ||
    consequenceType === "self_worth" ||
    consequenceType === "identity_damage"
    ? "major"
    : consequenceType === "repair_readiness"
      ? "minor"
      : "moderate";
}

function defaultPersistence(
  consequenceType: ConsequenceSeedType,
): "brief" | "scene_level" | "arc_level" | "long_term" {
  return consequenceType === "trust_damage" ||
    consequenceType === "attachment_damage" ||
    consequenceType === "identity_damage"
    ? "arc_level"
    : consequenceType === "repair_readiness"
      ? "brief"
      : "scene_level";
}

function defaultAngstValue(consequenceType: ConsequenceSeedType): number {
  return consequenceType === "trust_damage" ||
    consequenceType === "self_worth" ||
    consequenceType === "jealousy"
    ? 9
    : 7;
}

function defaultHealingValue(consequenceType: ConsequenceSeedType): number {
  return consequenceType === "repair_readiness" ? 9 : 7;
}

function defaultRepairDifficulty(consequenceType: ConsequenceSeedType): number {
  return consequenceType === "trust_damage" ||
    consequenceType === "identity_damage" ||
    consequenceType === "boundary"
    ? 9
    : 7;
}
