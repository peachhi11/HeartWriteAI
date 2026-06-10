import {
  createRelationshipDynamicSeedPreset,
  createVocabularySeedPreset,
  type RelationshipDynamicSeed,
  type RelationshipDynamicSeedInput,
  type RelationshipDynamicSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type RelationshipDynamicCategory =
  | "attachment"
  | "power"
  | "personality"
  | "caretaking"
  | "protective"
  | "healing"
  | "conflict"
  | "obsessive"
  | "domestic";

export const relationshipDynamicSemanticChain = [
  "wound",
  "fear",
  "desire",
  "trigger",
  "response",
  "attachment_style",
  "relationship_dynamic",
  "conflict_pattern",
  "repair_style",
  "relationship_identity",
  "growth_arc",
] as const;

export const abandonmentRelationshipDynamicChainExample = {
  wound: "abandonment_wound",
  fear: "fear_of_abandonment",
  desire: "desire_to_be_chosen",
  trigger: "delayed_reply_trigger",
  response: "reassurance_seeking_response",
  attachmentStyle: "anxious_attachment",
  relationshipDynamic: "protector_reassurance_dynamic",
  conflictPattern: "pursuer_withdrawer_dynamic",
  repairStyle: "verbal_reassurance_repair",
  relationshipIdentity: "safe_haven_relationship_identity",
  growthArc: "secure_attachment_growth_arc",
} as const;

export const relationshipDynamicSeedPresets = [
  "Safe Haven Dynamic",
  "Secure Base Dynamic",
  "Reassurance Dynamic",
  "Chosen Person Dynamic",
  "Favorite Person Dynamic",
  "Attachment Healing Dynamic",
  "Equal Partners Dynamic",
  "Protector / Protected Dynamic",
  "Authority / Rebel Dynamic",
  "Grumpy / Sunshine Dynamic",
  "Black Cat / Golden Retriever Dynamic",
  "Chaos / Order Dynamic",
  "Caretaker / Receiver Dynamic",
  "Healer / Wounded Dynamic",
  "Acts of Service Dynamic",
  "Learning To Trust Dynamic",
  "Safe Vulnerability Dynamic",
  "Pursuer / Withdrawer Dynamic",
  "Rivals Dynamic",
  "Devotional Dynamic",
  "Quiet Domesticity Dynamic",
] as const;

export const relationshipDynamicCategories = {
  attachment: [
    "safe_haven_dynamic",
    "secure_base_dynamic",
    "reassurance_dynamic",
    "chosen_person_dynamic",
    "favorite_person_dynamic",
    "attachment_healing_dynamic",
  ],
  power: [
    "leader_follower_dynamic",
    "mentor_student_dynamic",
    "guardian_protected_dynamic",
    "equal_partners_dynamic",
    "protector_protected_dynamic",
    "authority_rebel_dynamic",
  ],
  personality: [
    "grumpy_sunshine_dynamic",
    "black_cat_golden_retriever_dynamic",
    "chaos_order_dynamic",
    "stoic_emotional_dynamic",
    "planner_impulsive_dynamic",
    "rational_romantic_dynamic",
  ],
  caretaking: [
    "caretaker_receiver_dynamic",
    "healer_wounded_dynamic",
    "acts_of_service_dynamic",
    "emotional_support_dynamic",
    "mutual_caretaking_dynamic",
  ],
  protective: [
    "bodyguard_charge_dynamic",
    "protector_vulnerable_dynamic",
    "shield_dynamic",
    "watchful_guardian_dynamic",
  ],
  healing: [
    "learning_to_trust_dynamic",
    "learning_to_be_loved_dynamic",
    "healing_together_dynamic",
    "safe_vulnerability_dynamic",
  ],
  conflict: [
    "pursuer_withdrawer_dynamic",
    "rivals_dynamic",
    "enemies_to_lovers_dynamic",
    "challenge_growth_dynamic",
  ],
  obsessive: [
    "favorite_person_dynamic",
    "exclusive_attention_dynamic",
    "devotional_dynamic",
    "obsession_dynamic",
  ],
  domestic: [
    "shared_home_dynamic",
    "routine_building_dynamic",
    "quiet_domesticity_dynamic",
    "everyday_love_dynamic",
  ],
} as const satisfies Record<RelationshipDynamicCategory, readonly string[]>;

export const relationshipDynamicExpansionLogic = {
  wound_to_dynamic: {
    abandonment_wound: [
      "safe_haven_dynamic",
      "reassurance_dynamic",
      "chosen_person_dynamic",
    ],
    emotional_neglect_wound: [
      "caretaker_receiver_dynamic",
      "healing_together_dynamic",
    ],
    control_wound: [
      "equal_partners_dynamic",
      "autonomy_respecting_dynamic",
    ],
    betrayal_wound: [
      "trust_building_dynamic",
      "slow_burn_dynamic",
    ],
  },
  fear_to_dynamic: {
    fear_of_abandonment: [
      "reassurance_dynamic",
      "secure_base_dynamic",
    ],
    fear_of_dependency: [
      "equal_partners_dynamic",
      "autonomy_dynamic",
    ],
    fear_of_vulnerability: [
      "healing_together_dynamic",
      "safe_vulnerability_dynamic",
    ],
  },
  desire_to_dynamic: {
    desire_to_be_chosen: [
      "chosen_person_dynamic",
      "favorite_person_dynamic",
    ],
    desire_for_safety: [
      "safe_haven_dynamic",
      "protector_protected_dynamic",
    ],
    desire_for_devotion: [
      "devotional_dynamic",
      "ride_or_die_dynamic",
    ],
    desire_for_partnership: [
      "equal_partners_dynamic",
      "shared_future_dynamic",
    ],
  },
} as const;

type RelationshipDynamicOverride = Partial<RelationshipDynamicSeedInput> & {
  label?: string;
};

const RELATIONSHIP_DYNAMIC_OVERRIDES: Record<string, RelationshipDynamicOverride> = {
  safe_haven_dynamic: {
    description:
      "A relationship where one or both people become a reliable source of emotional safety, comfort, and return.",
    emotionalCore: "You can come back here and still be loved.",
    associatedWounds: ["abandonment_wound", "emotional_neglect_wound"],
    associatedFears: ["fear_of_abandonment", "fear_of_rejection"],
    associatedDesires: [
      "desire_for_safety",
      "desire_to_be_chosen",
      "desire_for_home",
    ],
    conflictPatterns: [
      "distance_feels_threatening",
      "reassurance_needed_after_rupture",
    ],
    repairPatterns: ["presence_based_repair", "verbal_reassurance_repair"],
    healthyVersion: [
      "secure_attachment",
      "mutual_regulation",
      "safe_vulnerability",
    ],
    unhealthyVersion: [
      "dependency_without_boundaries",
      "fear_based_attachment",
    ],
    routeGates: [
      "first_safe_return_gate",
      "first_comfort_after_distance_gate",
      "safe_haven_identity_gate",
    ],
    metadata: {
      category: "relationship_dynamic",
      chemistryValue: 9,
      conflictPotential: 6,
      healingPotential: 10,
      intensity: "high",
    },
  },
  reassurance_dynamic: {
    emotionalCore: "I will tell you where you stand before fear has to guess.",
    associatedWounds: ["abandonment_wound", "emotional_neglect_wound"],
    associatedFears: ["fear_of_abandonment", "fear_of_rejection"],
    associatedDesires: ["desire_to_be_chosen", "desire_for_reliable_love"],
    commonResponses: ["reassurance_seeking_response", "verbal_reassurance_repair"],
    repairPatterns: ["verbal_reassurance_repair", "consistent_return_repair"],
  },
  chosen_person_dynamic: {
    emotionalCore: "Out of every possible person, I choose you deliberately.",
    associatedWounds: ["never_chosen_wound", "replacement_wound"],
    associatedFears: ["fear_of_replacement", "fear_of_not_being_chosen"],
    associatedDesires: ["desire_to_be_chosen", "desire_for_exclusive_attention"],
    romanceHooks: ["public_choice_confession", "only_you_dynamic"],
  },
  favorite_person_dynamic: {
    dynamicType: "obsessive",
    emotionalCore: "Your attention feels like the center of the emotional weather.",
    associatedWounds: ["abandonment_wound", "replacement_wound"],
    associatedFears: ["fear_of_replacement", "fear_of_emotional_irrelevance"],
    associatedDesires: ["desire_for_exclusive_attention", "desire_to_be_chosen"],
    unhealthyVersion: ["emotional_overdependence", "jealousy_spiral"],
    healthyVersion: ["secure_priority", "chosen_without_possession"],
    metadata: {
      category: "relationship_dynamic",
      chemistryValue: 9,
      conflictPotential: 9,
      healingPotential: 6,
      intensity: "high",
    },
  },
  equal_partners_dynamic: {
    emotionalCore: "Neither person has to shrink to be loved.",
    associatedWounds: ["control_wound", "objectification_wound"],
    associatedFears: ["fear_of_dependency", "fear_of_losing_control"],
    associatedDesires: ["desire_for_partnership", "desire_for_autonomy"],
    repairPatterns: ["collaborative_repair", "boundary_repair"],
  },
  protector_protected_dynamic: {
    dynamicType: "protective",
    emotionalCore: "Protection matters most when it still leaves room for choice.",
    associatedWounds: ["helplessness_wound", "unsafe_world_wound"],
    associatedFears: ["fear_for_partner_safety", "fear_of_powerlessness"],
    associatedDesires: ["desire_for_safety", "desire_to_protect"],
    conflictPatterns: ["protection_vs_autonomy", "control_mistaken_for_care"],
  },
  grumpy_sunshine_dynamic: {
    emotionalCore: "One person brings warmth; the other learns warmth can stay.",
    associatedWounds: ["disappointment_wound", "rejection_wound"],
    associatedFears: ["fear_of_hope", "fear_of_vulnerability"],
    associatedDesires: ["desire_for_softness", "desire_to_be_understood"],
    romanceHooks: ["grumpy_sunshine", "sunshine_thaws_guarded_partner"],
  },
  black_cat_golden_retriever_dynamic: {
    emotionalCore: "Guarded independence meets open-hearted loyalty.",
    associatedFears: ["fear_of_vulnerability", "fear_of_rejection"],
    associatedDesires: ["desire_for_acceptance", "desire_for_playful_safety"],
    romanceHooks: ["black_cat_golden_retriever", "loyalty_softens_defensiveness"],
  },
  caretaker_receiver_dynamic: {
    dynamicType: "caretaking",
    emotionalCore: "Care becomes a language both people must learn to give and receive.",
    associatedWounds: ["emotional_neglect_wound", "caretaker_burnout_wound"],
    associatedFears: ["fear_of_being_a_burden", "fear_of_needing_help"],
    associatedDesires: ["desire_for_care", "desire_to_be_worth_effort"],
    commonResponses: ["caretaking_response", "refusing_help_response"],
  },
  acts_of_service_dynamic: {
    dynamicType: "caretaking",
    emotionalCore: "Love becomes visible through small reliable actions.",
    associatedDesires: ["desire_for_reliable_love", "desire_for_home"],
    repairPatterns: ["acts_of_service_repair", "changed_behavior_response"],
    romanceHooks: ["acts_of_service", "quiet_devotion"],
  },
  learning_to_trust_dynamic: {
    dynamicType: "healing",
    emotionalCore: "Trust grows because the evidence keeps arriving.",
    associatedWounds: ["betrayal_wound", "abandonment_wound"],
    associatedFears: ["fear_of_betrayal", "fear_of_vulnerability"],
    repairPatterns: ["truth_telling_repair", "consistent_return_repair"],
  },
  pursuer_withdrawer_dynamic: {
    dynamicType: "conflict",
    emotionalCore: "One reaches for closeness while the other reaches for air.",
    associatedWounds: ["abandonment_wound", "control_wound"],
    associatedFears: ["fear_of_abandonment", "fear_of_engulfment"],
    conflictPatterns: ["pursue_withdraw_cycle", "distance_escalates_pursuit"],
    repairPatterns: ["space_then_repair", "clear_return_time_repair"],
    metadata: {
      category: "relationship_dynamic",
      chemistryValue: 8,
      conflictPotential: 10,
      healingPotential: 8,
      intensity: "high",
    },
  },
  rivals_dynamic: {
    dynamicType: "conflict",
    emotionalCore: "Challenge becomes the first honest form of attention.",
    associatedFears: ["fear_of_inadequacy", "fear_of_public_failure"],
    associatedDesires: ["desire_to_be_seen", "desire_for_respect"],
    romanceHooks: ["rivals_to_lovers", "respect_before_tenderness"],
  },
  devotional_dynamic: {
    dynamicType: "obsessive",
    emotionalCore: "Devotion feels safest when it is chosen, steady, and not coercive.",
    associatedWounds: ["never_chosen_wound", "loneliness_wound"],
    associatedDesires: ["desire_for_devotion", "desire_to_be_chosen"],
    romanceHooks: ["devotional_love", "only_you_dynamic"],
    unhealthyVersion: ["self_erasure", "possessive_overreach"],
    healthyVersion: ["steady_devotion", "devotion_with_boundaries"],
  },
  quiet_domesticity_dynamic: {
    dynamicType: "domestic",
    emotionalCore: "Ordinary life starts to feel like proof of love.",
    associatedWounds: ["homelessness_wound", "emotional_neglect_wound"],
    associatedDesires: ["desire_for_home", "desire_for_peace"],
    romanceHooks: ["domestic_slow_burn", "routine_becomes_love"],
  },
};

export const RELATIONSHIP_DYNAMIC_SEEDS = Object.freeze(
  getUniqueRelationshipDynamicIds().map((seed) =>
    createRelationshipDynamicSeedPreset(buildRelationshipDynamicInput(seed)),
  ),
) satisfies readonly RelationshipDynamicSeed[];

export const RELATIONSHIP_DYNAMIC_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  RELATIONSHIP_DYNAMIC_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional core: ${seed.emotionalCore}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.evolutionPath.slice(0, 2),
      ],
      tags: [
        "relationship_dynamic",
        seed.dynamicType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.associatedWounds,
        ...seed.associatedFears,
        ...seed.associatedDesires,
        ...seed.commonResponses,
        ...seed.repairPatterns,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.unhealthyVersion,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.typicalTriggers,
        ...seed.routeGates,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "high" ? "uncommon" : "common",
        romanceValue: seed.metadata.chemistryValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getRelationshipDynamicSeedsByCategory(
  category: RelationshipDynamicCategory,
): readonly RelationshipDynamicSeed[] {
  const ids = new Set<string>(relationshipDynamicCategories[category]);
  return RELATIONSHIP_DYNAMIC_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRelationshipDynamicSeedsByType(
  dynamicType: RelationshipDynamicSeedType,
): readonly RelationshipDynamicSeed[] {
  return RELATIONSHIP_DYNAMIC_SEEDS.filter(
    (seed) => seed.dynamicType === dynamicType,
  );
}

export function findRelationshipDynamicSeedBySeed(
  seedId: string,
): RelationshipDynamicSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueRelationshipDynamicIds(): readonly string[] {
  return Array.from(
    new Set(Object.values(relationshipDynamicCategories).flat()),
  );
}

function buildRelationshipDynamicInput(
  seed: string,
): RelationshipDynamicSeedInput {
  const dynamicType = inferDynamicType(seed);
  const label = relationshipDynamicLabel(seed);
  const override = RELATIONSHIP_DYNAMIC_OVERRIDES[seed] ?? {};
  const base: RelationshipDynamicSeedInput = {
    seed,
    label,
    description:
      "A relationship pattern that shapes chemistry, tension, repair, and the route a bond naturally wants to take.",
    examples: [
      "The dynamic changes how both people interpret distance, care, conflict, and commitment.",
      "It gives the relationship a repeatable emotional rhythm rather than a flat trope label.",
    ],
    tags: ["relationship_dynamic", dynamicType, seed],
    relatedSeeds: inferRelatedSeeds(seed, dynamicType),
    oppositeSeeds: inferOppositeSeeds(dynamicType),
    romanceHooks: [seed.replace(/_dynamic$/, ""), `${dynamicType}_romance`],
    scenarioHooks: [
      `${seed}_scene`,
      `${seed}_route`,
      `${seed}_conflict`,
    ],
    dialoguePatterns: defaultDialoguePatterns(dynamicType),
    dynamicType,
    emotionalCore: defaultEmotionalCore(dynamicType),
    primaryNeeds: defaultPrimaryNeeds(dynamicType),
    primaryFears: defaultPrimaryFears(dynamicType),
    typicalTriggers: defaultTypicalTriggers(dynamicType),
    commonResponses: defaultCommonResponses(dynamicType),
    conflictPatterns: defaultConflictPatterns(dynamicType),
    repairPatterns: defaultRepairPatterns(dynamicType),
    associatedWounds: defaultAssociatedWounds(dynamicType),
    associatedFears: defaultAssociatedFears(dynamicType),
    associatedDesires: defaultAssociatedDesires(dynamicType),
    evolutionPath: defaultEvolutionPath(dynamicType),
    unhealthyVersion: defaultUnhealthyVersion(dynamicType),
    healthyVersion: defaultHealthyVersion(dynamicType),
    routeGates: [
      `first_${seed}_gate`,
      `${seed}_rupture_gate`,
      `${seed}_healthy_version_gate`,
    ],
    metadata: {
      category: "relationship_dynamic",
      chemistryValue: dynamicType === "domestic" ? 7 : 8,
      conflictPotential: dynamicType === "conflict" || dynamicType === "obsessive" ? 9 : 6,
      healingPotential: dynamicType === "healing" || dynamicType === "attachment" ? 9 : 7,
      intensity: dynamicType === "domestic" ? "medium" : "high",
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

function inferDynamicType(seed: string): RelationshipDynamicSeedType {
  if (seed === "favorite_person_dynamic") {
    return "obsessive";
  }

  for (const [category, seeds] of Object.entries(relationshipDynamicCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return category as RelationshipDynamicSeedType;
    }
  }

  return "identity";
}

function relationshipDynamicLabel(seed: string): string {
  return seed
    .replace(/_dynamic$/, "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("Protector Protected", "Protector / Protected")
    .replace("Caretaker Receiver", "Caretaker / Receiver")
    .concat(" Dynamic");
}

function inferRelatedSeeds(
  seed: string,
  dynamicType: RelationshipDynamicSeedType,
): readonly string[] {
  const related = [
    ...defaultAssociatedWounds(dynamicType),
    ...defaultAssociatedFears(dynamicType),
    ...defaultAssociatedDesires(dynamicType),
  ];

  if (seed.includes("safe") || seed.includes("secure")) {
    related.push("secure_attachment", "verbal_reassurance_repair");
  }
  if (seed.includes("protector") || seed.includes("guardian") || seed.includes("shield")) {
    related.push("bodyguard_protection", "protective_response");
  }
  if (seed.includes("rivals") || seed.includes("enemies")) {
    related.push("rivals_to_lovers", "enemies_to_lovers");
  }

  return related;
}

function inferOppositeSeeds(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  if (dynamicType === "attachment") {
    return ["avoidant_distance", "inconsistent_presence"];
  }
  if (dynamicType === "power") {
    return ["coercive_control", "unchecked_hierarchy"];
  }
  if (dynamicType === "domestic") {
    return ["chaotic_instability", "home_as_danger"];
  }
  return ["disconnection", "unrepaired_rupture"];
}

function defaultEmotionalCore(dynamicType: RelationshipDynamicSeedType): string {
  switch (dynamicType) {
    case "attachment":
      return "The bond becomes a place where closeness feels possible again.";
    case "power":
      return "Power becomes romantic only when it is negotiated, ethical, and responsive.";
    case "personality":
      return "Difference creates chemistry before it becomes understanding.";
    case "caretaking":
      return "Care becomes a visible proof that someone noticed the need.";
    case "protective":
      return "Safety matters, but love must leave room for agency.";
    case "healing":
      return "The relationship gives both people evidence that the old rule can change.";
    case "conflict":
      return "Friction becomes a route toward honesty, not just a reason to leave.";
    case "obsessive":
      return "Intensity has to learn the difference between devotion and possession.";
    case "domestic":
      return "The small daily things become the proof that love stayed.";
    case "identity":
      return "The relationship gives both people a clearer name for who they are together.";
  }
}

function defaultPrimaryNeeds(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["consistency", "emotional safety", "clear return"];
    case "power":
      return ["consent", "respect", "clear roles"];
    case "personality":
      return ["acceptance", "curiosity", "playful friction"];
    case "caretaking":
      return ["being noticed", "mutual care", "non-transactional help"];
    case "protective":
      return ["safety", "trust", "autonomy"];
    case "healing":
      return ["patience", "truth", "safe vulnerability"];
    case "conflict":
      return ["honesty", "repair", "respect under pressure"];
    case "obsessive":
      return ["priority", "boundaries", "secure devotion"];
    case "domestic":
      return ["routine", "shared home", "quiet reliability"];
    case "identity":
      return ["belonging", "recognition", "chosen identity"];
  }
}

function defaultPrimaryFears(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["being left", "being too much", "losing safe connection"];
    case "power":
      return ["being controlled", "misusing authority", "losing respect"];
    case "personality":
      return ["being misunderstood", "being rejected for difference"];
    case "caretaking":
      return ["being a burden", "care becoming debt"];
    case "protective":
      return ["failing to protect", "care becoming control"];
    case "healing":
      return ["repeating the old wound", "trust being foolish"];
    case "conflict":
      return ["the fight proving incompatibility", "repair arriving too late"];
    case "obsessive":
      return ["being replaced", "wanting too much"];
    case "domestic":
      return ["home disappearing", "ordinary love becoming boring or unsafe"];
    case "identity":
      return ["not knowing where the relationship belongs"];
  }
}

function defaultTypicalTriggers(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["delayed_reply_trigger", "goodbye_trigger", "emotional_distance_trigger"];
    case "power":
      return ["being_ordered_trigger", "loss_of_choice_trigger", "boundary_ignored_trigger"];
    case "personality":
      return ["being_misread_trigger", "playful_challenge_trigger", "public_disagreement_trigger"];
    case "caretaking":
      return ["receiving_care_trigger", "being_needed_trigger", "overwhelm_trigger"];
    case "protective":
      return ["user_becomes_target", "danger_trigger", "unsafe_environment_trigger"];
    case "healing":
      return ["vulnerability_exposed_trigger", "old_betrayal_reminder", "too_much_kindness_trigger"];
    case "conflict":
      return ["criticism_trigger", "rival_challenge", "sudden_silence_trigger"];
    case "obsessive":
      return ["rival_attention_trigger", "being_compared_trigger", "shared_attention_trigger"];
    case "domestic":
      return ["missed_routine_trigger", "home_disruption_trigger", "family_dinner_tension"];
    case "identity":
      return ["public_label_trigger", "relationship_definition_trigger"];
  }
}

function defaultCommonResponses(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["reassurance_seeking_response", "cling_response", "preemptive_withdrawal_response"];
    case "power":
      return ["boundary_assertion_response", "rebellion_response", "control_response"];
    case "personality":
      return ["banter_response", "deflective_humor_response", "truth_slip_response"];
    case "caretaking":
      return ["caretaking_response", "acts_of_service_repair_response", "refusing_help_response"];
    case "protective":
      return ["protective_response", "bodyguard_response", "control_response"];
    case "healing":
      return ["softening_response", "vulnerability_repair_response", "emotional_withdrawal_response"];
    case "conflict":
      return ["argumentative_response", "emotional_withdrawal_response", "changed_behavior_response"];
    case "obsessive":
      return ["priority_testing_response", "jealousy_suppression_response", "devotional_response"];
    case "domestic":
      return ["routine_seeking_response", "acts_of_service_repair_response", "comfort_response"];
    case "identity":
      return ["definition_seeking_response", "public_claim_response"];
  }
}

function defaultConflictPatterns(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["distance_feels_threatening", "reassurance_needed_after_rupture"];
    case "power":
      return ["authority_vs_autonomy", "care_mistaken_for_control"];
    case "conflict":
      return ["pursue_withdraw_cycle", "challenge_becomes_defensiveness"];
    case "obsessive":
      return ["priority_tests_create_pressure", "jealousy_misreads_attention"];
    default:
      return ["need_goes_indirect", "repair_needed_after_misread"];
  }
}

function defaultRepairPatterns(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["verbal_reassurance_repair", "consistent_return_repair"];
    case "power":
      return ["boundary_repair", "collaborative_repair"];
    case "caretaking":
      return ["acts_of_service_repair", "care_without_debt_repair"];
    case "protective":
      return ["agency_restoration_repair", "protection_with_consent_repair"];
    case "conflict":
      return ["honest_conversation_repair", "changed_behavior_response"];
    default:
      return ["accountability_repair", "presence_based_repair"];
  }
}

function defaultAssociatedWounds(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["abandonment_wound", "emotional_neglect_wound"];
    case "power":
      return ["control_wound", "helplessness_wound"];
    case "caretaking":
      return ["emotional_neglect_wound", "caretaker_burnout_wound"];
    case "protective":
      return ["unsafe_world_wound", "helplessness_wound"];
    case "healing":
      return ["betrayal_wound", "shame_wound"];
    case "obsessive":
      return ["replacement_wound", "abandonment_wound"];
    case "domestic":
      return ["homelessness_wound", "emotional_neglect_wound"];
    default:
      return ["not_belonging_wound"];
  }
}

function defaultAssociatedFears(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["fear_of_abandonment", "fear_of_rejection"];
    case "power":
      return ["fear_of_dependency", "fear_of_losing_control"];
    case "caretaking":
      return ["fear_of_being_a_burden", "fear_of_needing_help"];
    case "protective":
      return ["fear_for_partner_safety", "fear_of_powerlessness"];
    case "healing":
      return ["fear_of_vulnerability", "fear_of_betrayal"];
    case "conflict":
      return ["fear_of_incompatibility", "fear_of_not_being_understood"];
    case "obsessive":
      return ["fear_of_replacement", "fear_of_emotional_irrelevance"];
    case "domestic":
      return ["fear_of_losing_home", "fear_of_ordinary_love_not_lasting"];
    default:
      return ["fear_of_not_belonging"];
  }
}

function defaultAssociatedDesires(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return ["desire_for_safety", "desire_to_be_chosen"];
    case "power":
      return ["desire_for_partnership", "desire_for_autonomy"];
    case "personality":
      return ["desire_to_be_seen", "desire_for_acceptance"];
    case "caretaking":
      return ["desire_for_care", "desire_to_be_worth_effort"];
    case "protective":
      return ["desire_for_safety", "desire_to_protect"];
    case "healing":
      return ["desire_to_be_loved", "desire_for_healing"];
    case "conflict":
      return ["desire_for_respect", "desire_for_honesty"];
    case "obsessive":
      return ["desire_for_devotion", "desire_for_exclusive_attention"];
    case "domestic":
      return ["desire_for_home", "desire_for_peace"];
    case "identity":
      return ["desire_for_belonging", "desire_for_shared_future"];
  }
}

function defaultEvolutionPath(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "conflict":
      return ["friction", "reluctant respect", "honest rupture", "repair", "chosen trust"];
    case "healing":
      return ["guarded contact", "small evidence", "risking honesty", "safe repair", "new pattern"];
    case "domestic":
      return ["shared routine", "private ease", "ordinary loyalty", "home identity"];
    default:
      return ["recognition", "friction", "vulnerability", "repair", "secure rhythm"];
  }
}

function defaultUnhealthyVersion(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "power":
      return ["coercive_control", "role_without_consent"];
    case "obsessive":
      return ["possessive_pressure", "dependency_without_boundaries"];
    case "caretaking":
      return ["care_as_debt", "rescuer_burnout"];
    case "protective":
      return ["protection_as_control", "agency_erasure"];
    default:
      return ["unspoken_need", "rupture_without_repair"];
  }
}

function defaultHealthyVersion(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "power":
      return ["negotiated_power", "mutual_respect"];
    case "obsessive":
      return ["devotion_with_boundaries", "chosen_priority"];
    case "caretaking":
      return ["mutual_care", "care_without_debt"];
    case "protective":
      return ["protection_with_agency", "trusted_safety"];
    case "domestic":
      return ["home_as_safety", "ordinary_love"];
    default:
      return ["secure_repair", "honest_closeness"];
  }
}

function defaultDialoguePatterns(dynamicType: RelationshipDynamicSeedType): readonly string[] {
  switch (dynamicType) {
    case "attachment":
      return [
        "You can come back here. I am not keeping score.",
        "Tell me when you need reassurance before fear starts writing the story.",
      ];
    case "power":
      return [
        "I can protect you without deciding for you.",
        "Say no and I will listen. That is the point.",
      ];
    case "personality":
      return [
        "You are impossible.",
        "And yet you keep saving me a place.",
      ];
    case "caretaking":
      return [
        "Let me do this one small thing.",
        "Only if you let me do something for you tomorrow.",
      ];
    case "protective":
      return [
        "Stay close because you want to, not because I ordered it.",
        "I trust you. I am just scared for you.",
      ];
    case "healing":
      return [
        "This is new for me. Go slowly.",
        "Then we go slowly. I am still here.",
      ];
    case "conflict":
      return [
        "I do not want to win this if it means losing us.",
        "Then stop fighting me and tell me what hurts.",
      ];
    case "obsessive":
      return [
        "I want to be chosen, not owned.",
        "Then let me learn how to love you without gripping too hard.",
      ];
    case "domestic":
      return [
        "I saved you the good mug.",
        "That should not feel as intimate as it does.",
      ];
    case "identity":
      return [
        "What are we calling this?",
        "Something we both choose, or nothing at all.",
      ];
  }
}
