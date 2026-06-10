import {
  createConflictStyleSeedPreset,
  createVocabularySeedPreset,
  type ConflictStyleSeed,
  type ConflictStyleSeedInput,
  type ConflictStyleSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const conflictStyleSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Trigger",
  "Response",
  "Conflict Style",
  "Escalation Pattern",
  "Rupture Type",
  "Repair Style",
  "Growth Arc",
] as const;

export const conflictStylePresets = [
  "Pursuer Conflict Style",
  "Withdrawer Conflict Style",
  "Explosive Conflict Style",
  "Appeasing Conflict Style",
  "Intellectualizing Conflict Style",
  "Humor Deflection Conflict Style",
  "Passive-Avoidant Conflict Style",
  "Dominance-Based Conflict Style",
  "Silent Treatment Conflict Style",
  "Repair-Oriented Conflict Style",
  "Over-Apologizing Conflict Style",
  "Cold Shutdown Conflict Style",
  "Defensive Anger Conflict Style",
  "Problem-Solving Conflict Style",
  "Caretaking Conflict Style",
  "Boundary-Setting Conflict Style",
  "Jealousy-Driven Conflict Style",
  "Fearful Push-Pull Conflict Style",
  "Moral Argument Conflict Style",
  "Tender Honesty Conflict Style",
] as const;

export const conflictStyleCategories = {
  pursuer: [
    "pursuer_conflict_style",
    "reassurance_seeking_conflict_style",
    "fearful_push_pull_conflict_style",
  ],
  withdrawer: [
    "withdrawer_conflict_style",
    "cold_shutdown_conflict_style",
    "silent_treatment_conflict_style",
  ],
  explosive: [
    "explosive_conflict_style",
    "defensive_anger_conflict_style",
    "jealousy_driven_conflict_style",
  ],
  appeasing: [
    "appeasing_conflict_style",
    "over_apologizing_conflict_style",
    "caretaking_conflict_style",
  ],
  intellectual: [
    "intellectualizing_conflict_style",
    "problem_solving_conflict_style",
    "moral_argument_conflict_style",
  ],
  deflective: [
    "humor_deflection_conflict_style",
  ],
  dominance: [
    "dominance_based_conflict_style",
    "boundary_setting_conflict_style",
  ],
  passive: [
    "passive_avoidant_conflict_style",
  ],
  avoidant: [
    "avoidant_conflict_style",
  ],
  repair_oriented: [
    "repair_oriented_conflict_style",
    "tender_honesty_conflict_style",
  ],
} as const satisfies Record<ConflictStyleSeedType, readonly string[]>;

export const conflictStyleExpansionLogic = {
  wound_to_conflict_style: {
    abandonment_wound: [
      "pursuer_conflict_style",
      "fearful_push_pull_conflict_style",
      "over_apologizing_conflict_style",
    ],
    betrayal_wound: [
      "defensive_anger_conflict_style",
      "cold_shutdown_conflict_style",
      "trust_testing_conflict_style",
    ],
    emotional_neglect_wound: [
      "withdrawer_conflict_style",
      "caretaking_conflict_style",
      "silent_hurt_conflict_style",
    ],
    humiliation_wound: [
      "defensive_anger_conflict_style",
      "humor_deflection_conflict_style",
      "avoid_visibility_conflict_style",
    ],
    control_wound: [
      "boundary_setting_conflict_style",
      "dominance_resistance_conflict_style",
      "withdrawer_conflict_style",
    ],
  },
  fear_to_conflict_style: {
    fear_of_abandonment: [
      "pursuer_conflict_style",
      "reassurance_seeking_conflict_style",
    ],
    fear_of_rejection: [
      "appeasing_conflict_style",
      "self_sabotaging_conflict_style",
    ],
    fear_of_vulnerability: [
      "intellectualizing_conflict_style",
      "humor_deflection_conflict_style",
    ],
    fear_of_dependency: [
      "withdrawer_conflict_style",
      "cold_shutdown_conflict_style",
    ],
    fear_of_being_controlled: [
      "boundary_setting_conflict_style",
      "defensive_anger_conflict_style",
    ],
  },
  response_to_conflict_style: {
    fight_response: [
      "explosive_conflict_style",
      "defensive_anger_conflict_style",
    ],
    flight_response: [
      "withdrawer_conflict_style",
      "avoidant_conflict_style",
    ],
    freeze_response: [
      "cold_shutdown_conflict_style",
      "silent_conflict_style",
    ],
    fawn_response: [
      "appeasing_conflict_style",
      "over_apologizing_conflict_style",
    ],
    humor_deflection_response: [
      "humor_deflection_conflict_style",
    ],
    intellectualizing_response: [
      "intellectualizing_conflict_style",
    ],
  },
  conflict_style_to_repair_style: {
    pursuer_conflict_style: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "attachment_reassurance_repair",
    ],
    withdrawer_conflict_style: [
      "space_based_repair",
      "return_after_space_repair",
      "low_pressure_repair",
    ],
    explosive_conflict_style: [
      "accountability_repair",
      "cooling_off_repair",
      "behavior_change_repair",
    ],
    appeasing_conflict_style: [
      "boundary_reset_repair",
      "mutual_responsibility_repair",
      "needs_expression_repair",
    ],
    intellectualizing_conflict_style: [
      "emotional_translation_repair",
      "heart_to_heart_repair",
      "vulnerability_repair",
    ],
  },
} as const;

type ConflictStyleOverride = Partial<ConflictStyleSeedInput> & {
  label?: string;
};

const CONFLICT_STYLE_OVERRIDES: Record<string, ConflictStyleOverride> = {
  pursuer_conflict_style: {
    description:
      "Responds to conflict by moving closer, seeking immediate reassurance, clarification, contact, or resolution.",
    examples: [
      "Sends follow-up messages after an argument.",
      "Needs to talk immediately.",
      "Feels worse when the other person asks for space.",
    ],
    tags: ["conflict", "attachment", "reassurance", "anxious_pattern"],
    relatedSeeds: [
      "fear_of_abandonment",
      "reassurance_seeking_response",
      "verbal_reassurance_repair",
    ],
    oppositeSeeds: [
      "withdrawer_conflict_style",
      "space_based_repair",
    ],
    romanceHooks: [
      "do_not_leave_during_conflict",
      "reassurance_after_argument",
      "learning_space_is_not_abandonment",
    ],
    scenarioHooks: [
      "post_argument_text_spiral",
      "doorway_conflict",
      "return_after_space_scene",
    ],
    dialoguePatterns: [
      "Don't you dare just walk away right now.",
      "I need to know we are okay.",
      "Silence makes it worse.",
    ],
    conflictType: "pursuer",
    emotionalCore:
      "Conflict feels like abandonment unless connection is restored quickly.",
    hiddenFear:
      "If they leave the conversation, they may leave the relationship.",
    hiddenNeed:
      "Reassurance that conflict does not erase love.",
    commonTriggers: [
      "silence_after_argument",
      "partner_needing_space",
      "delayed_reply",
      "cold_tone",
    ],
    stressResponses: [
      "reassurance_seeking_response",
      "panic_spiral_response",
      "overexplaining_response",
    ],
    escalationPattern: [
      "detects_distance",
      "seeks_clarification",
      "pushes_for_contact",
      "partner_feels_pressured",
      "rupture_escalates",
    ],
    attachmentEffects: [
      "increases_reassurance_need",
      "lowers_separation_tolerance",
      "can_create_pursue_withdraw_loop",
    ],
    intimacyEffects: [
      "can lead to direct vulnerability",
      "may accelerate emotional honesty",
      "may overwhelm avoidant partners",
    ],
    ruptureRisks: [
      "pressure_after_conflict",
      "emotional_overwhelm",
      "partner_withdrawal",
    ],
    likelyRepairStyles: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "presence_based_repair",
    ],
    incompatibleRepairStyles: [
      "silent_presence_without_words",
      "delayed_repair_without_context",
      "space_based_repair_without_return_promise",
    ],
    associatedWounds: [
      "abandonment_wound",
      "emotional_neglect_wound",
    ],
    associatedFears: [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
    ],
    associatedDesires: [
      "desire_for_reliable_love",
      "desire_for_emotional_presence",
    ],
    associatedResponses: [
      "reassurance_seeking_response",
      "cling_response",
      "overexplaining_response",
    ],
    healthyVersion: [
      "asks directly for reassurance",
      "allows space with a return agreement",
      "names needs without demanding control",
    ],
    unhealthyVersion: [
      "pressures immediate resolution",
      "interprets boundaries as rejection",
      "escalates when reassurance is delayed",
    ],
    growthArcs: [
      "learns_to_pause",
      "learns_space_is_not_abandonment",
      "asks_for_return_ritual",
      "develops_secure_conflict_tolerance",
    ],
    routeGates: [
      "first_conflict_style_reveal_gate",
      "first_space_with_return_gate",
      "secure_conflict_gate",
    ],
    metadata: {
      category: "conflict_style",
      intensity: "high",
      ruptureRisk: 8,
      repairDifficulty: 6,
      angstValue: 9,
      romanceValue: 8,
      healingPotential: 10,
    },
  },
  withdrawer_conflict_style: {
    conflictType: "withdrawer",
    emotionalCore: "Conflict feels survivable only after distance lowers the pressure.",
    hiddenFear: "If they stay exposed, they will say too much or be controlled.",
    hiddenNeed: "Space that does not become abandonment.",
    likelyRepairStyles: ["space_based_repair", "return_after_space_repair"],
    oppositeSeeds: ["pursuer_conflict_style", "immediate_resolution_pressure"],
  },
  explosive_conflict_style: {
    conflictType: "explosive",
    emotionalCore: "Fear converts into volume, speed, and force before softness can appear.",
    hiddenFear: "If they do not push back hard, they will be overpowered or dismissed.",
    hiddenNeed: "Containment, accountability, and proof they can repair after intensity.",
    likelyRepairStyles: ["accountability_repair", "cooling_off_repair"],
    metadata: {
      category: "conflict_style",
      intensity: "volatile",
      ruptureRisk: 10,
      repairDifficulty: 8,
      angstValue: 9,
      romanceValue: 6,
      healingPotential: 8,
    },
  },
  appeasing_conflict_style: {
    conflictType: "appeasing",
    emotionalCore: "Conflict feels safer when their own needs disappear first.",
    hiddenFear: "If they disappoint the other person, love will be withdrawn.",
    hiddenNeed: "Permission to have needs without losing connection.",
    likelyRepairStyles: ["boundary_reset_repair", "needs_expression_repair"],
  },
  intellectualizing_conflict_style: {
    conflictType: "intellectual",
    emotionalCore: "Emotion is translated into analysis before it can overwhelm them.",
    hiddenFear: "Feeling too much will make them lose control or credibility.",
    hiddenNeed: "A way to be emotional without feeling foolish.",
    likelyRepairStyles: ["emotional_translation_repair", "vulnerability_repair"],
  },
  humor_deflection_conflict_style: {
    conflictType: "deflective",
    emotionalCore: "A joke buys time when direct feeling feels too exposed.",
    hiddenFear: "Sincerity will make them easy to hurt.",
    hiddenNeed: "Room to become serious without being mocked for the dodge.",
  },
  passive_avoidant_conflict_style: {
    conflictType: "passive",
    emotionalCore: "Conflict is managed by becoming hard to reach.",
    hiddenFear: "Direct confrontation will trap them.",
    hiddenNeed: "Low-pressure honesty and a clear way back.",
  },
  dominance_based_conflict_style: {
    conflictType: "dominance",
    emotionalCore: "Control feels like safety when conflict threatens uncertainty.",
    hiddenFear: "If they do not lead, everything will fall apart.",
    hiddenNeed: "Trust that shared power will not become chaos.",
  },
  repair_oriented_conflict_style: {
    conflictType: "repair_oriented",
    emotionalCore: "The argument matters less than keeping the bond honest.",
    hiddenFear: "Pride will cost them the relationship.",
    hiddenNeed: "Mutual willingness to return and fix the rupture.",
    metadata: {
      category: "conflict_style",
      intensity: "medium",
      ruptureRisk: 4,
      repairDifficulty: 3,
      angstValue: 5,
      romanceValue: 8,
      healingPotential: 10,
    },
  },
  tender_honesty_conflict_style: {
    conflictType: "repair_oriented",
    emotionalCore: "Truth is offered carefully because the relationship is worth protecting.",
    hiddenFear: "Honesty will hurt too much if it is delivered without tenderness.",
    hiddenNeed: "Directness that still feels loving.",
  },
};

export const CONFLICT_STYLE_SEEDS = Object.freeze(
  getUniqueConflictStyleIds().map((seed) =>
    createConflictStyleSeedPreset(buildConflictStyleInput(seed)),
  ),
) satisfies readonly ConflictStyleSeed[];

export const CONFLICT_STYLE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  CONFLICT_STYLE_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional core: ${seed.emotionalCore}`,
        `Hidden fear: ${seed.hiddenFear}`,
        `Hidden need: ${seed.hiddenNeed}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.escalationPattern.slice(0, 2),
      ],
      tags: [
        "conflict_style",
        seed.conflictType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.associatedWounds,
        ...seed.associatedFears,
        ...seed.associatedDesires,
        ...seed.associatedResponses,
        ...seed.likelyRepairStyles,
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
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "low" ? "common" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.ruptureRisk,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getConflictStyleSeedsByType(
  conflictType: ConflictStyleSeedType,
): readonly ConflictStyleSeed[] {
  return CONFLICT_STYLE_SEEDS.filter((seed) => seed.conflictType === conflictType);
}

export function findConflictStyleSeedBySeed(
  seedId: string,
): ConflictStyleSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return CONFLICT_STYLE_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueConflictStyleIds(): readonly string[] {
  return Array.from(new Set(Object.values(conflictStyleCategories).flat()));
}

function buildConflictStyleInput(seed: string): ConflictStyleSeedInput {
  const conflictType = inferConflictType(seed);
  const label = conflictStyleLabel(seed);
  const override = CONFLICT_STYLE_OVERRIDES[seed] ?? {};
  const base: ConflictStyleSeedInput = {
    seed,
    label,
    description:
      "A conflict pattern that shapes how a character escalates, ruptures, repairs, and grows under relational stress.",
    examples: [
      "The character repeats this pattern when closeness feels threatened.",
      "The pattern changes how repair must be paced after an argument.",
    ],
    tags: ["conflict", "conflict_style", conflictType, seed],
    relatedSeeds: defaultRelatedSeeds(conflictType),
    oppositeSeeds: defaultOppositeSeeds(conflictType),
    romanceHooks: [`${seed}_repair_scene`, `${conflictType}_conflict_romance`],
    scenarioHooks: [`${seed}_argument`, `${seed}_rupture`, `${seed}_repair`],
    dialoguePatterns: defaultDialoguePatterns(conflictType),
    conflictType,
    emotionalCore: defaultEmotionalCore(conflictType),
    hiddenFear: defaultHiddenFear(conflictType),
    hiddenNeed: defaultHiddenNeed(conflictType),
    commonTriggers: defaultCommonTriggers(conflictType),
    stressResponses: defaultStressResponses(conflictType),
    escalationPattern: defaultEscalationPattern(conflictType),
    attachmentEffects: defaultAttachmentEffects(conflictType),
    intimacyEffects: defaultIntimacyEffects(conflictType),
    ruptureRisks: defaultRuptureRisks(conflictType),
    likelyRepairStyles: defaultLikelyRepairStyles(conflictType),
    incompatibleRepairStyles: defaultIncompatibleRepairStyles(conflictType),
    associatedWounds: defaultAssociatedWounds(conflictType),
    associatedFears: defaultAssociatedFears(conflictType),
    associatedDesires: defaultAssociatedDesires(conflictType),
    associatedResponses: defaultAssociatedResponses(conflictType),
    healthyVersion: defaultHealthyVersion(conflictType),
    unhealthyVersion: defaultUnhealthyVersion(conflictType),
    growthArcs: defaultGrowthArcs(conflictType),
    routeGates: [
      `first_${seed}_gate`,
      `${seed}_repair_gate`,
      `${seed}_growth_gate`,
    ],
    metadata: {
      category: "conflict_style",
      intensity: conflictType === "explosive" ? "volatile" : "high",
      ruptureRisk: conflictType === "repair_oriented" ? 4 : 7,
      repairDifficulty: conflictType === "repair_oriented" ? 3 : 6,
      angstValue: conflictType === "repair_oriented" ? 5 : 8,
      romanceValue: conflictType === "repair_oriented" ? 8 : 6,
      healingPotential: 8,
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

function inferConflictType(seed: string): ConflictStyleSeedType {
  for (const [conflictType, seeds] of Object.entries(conflictStyleCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return conflictType as ConflictStyleSeedType;
    }
  }

  return "repair_oriented";
}

function conflictStyleLabel(seed: string): string {
  return seed
    .replace(/_conflict_style$/, "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace("Passive Avoidant", "Passive-Avoidant")
    .replace("Dominance Based", "Dominance-Based")
    .concat(" Conflict Style");
}

function defaultRelatedSeeds(conflictType: ConflictStyleSeedType): readonly string[] {
  return [
    ...defaultAssociatedWounds(conflictType),
    ...defaultAssociatedFears(conflictType),
    ...defaultStressResponses(conflictType),
    ...defaultLikelyRepairStyles(conflictType),
  ];
}

function defaultOppositeSeeds(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["withdrawer_conflict_style", "space_based_repair"];
    case "withdrawer":
    case "avoidant":
      return ["pursuer_conflict_style", "immediate_resolution_pressure"];
    case "explosive":
      return ["gentle_but_firm_tone", "cooling_off_repair"];
    case "appeasing":
      return ["direct_boundary_setting", "needs_expression_repair"];
    default:
      return ["secure_conflict_tolerance"];
  }
}

function defaultEmotionalCore(conflictType: ConflictStyleSeedType): string {
  switch (conflictType) {
    case "pursuer":
      return "Connection has to be restored quickly before the rupture feels permanent.";
    case "withdrawer":
    case "avoidant":
      return "Distance lowers the threat enough for honesty to become possible.";
    case "explosive":
      return "Urgency and hurt arrive faster than regulation.";
    case "appeasing":
      return "Peace feels safer when their own needs go quiet.";
    case "intellectual":
      return "Analysis protects them from the vulnerability underneath the argument.";
    case "deflective":
      return "Humor creates cover until sincerity feels survivable.";
    case "dominance":
      return "Control feels like the only way to keep conflict from becoming chaos.";
    case "passive":
      return "The rupture is expressed indirectly because direct conflict feels unsafe.";
    case "repair_oriented":
      return "The bond matters more than winning the argument.";
  }
}

function defaultHiddenFear(conflictType: ConflictStyleSeedType): string {
  switch (conflictType) {
    case "pursuer":
      return "Distance means the relationship is already ending.";
    case "withdrawer":
    case "avoidant":
      return "Staying in the argument will trap or expose them.";
    case "explosive":
      return "If they are not forceful, they will be dismissed.";
    case "appeasing":
      return "Disappointing someone will cost them love.";
    case "intellectual":
      return "Emotion will make them foolish or powerless.";
    case "deflective":
      return "Sincerity will give the other person a weapon.";
    case "dominance":
      return "Shared uncertainty will turn into loss of control.";
    case "passive":
      return "Direct honesty will be punished.";
    case "repair_oriented":
      return "Pride or avoidance will damage something worth saving.";
  }
}

function defaultHiddenNeed(conflictType: ConflictStyleSeedType): string {
  switch (conflictType) {
    case "pursuer":
      return "Clear reassurance and a return ritual.";
    case "withdrawer":
    case "avoidant":
      return "Space with a safe path back.";
    case "explosive":
      return "Regulation before accountability.";
    case "appeasing":
      return "Permission to express needs without rejection.";
    case "intellectual":
      return "Emotional translation, not just better arguments.";
    case "deflective":
      return "A gentle invitation into seriousness.";
    case "dominance":
      return "Trust that respect can exist without control.";
    case "passive":
      return "Safety for direct speech.";
    case "repair_oriented":
      return "Mutual willingness to tell the truth and return.";
  }
}

function defaultCommonTriggers(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["silence_after_argument", "partner_needing_space", "cold_tone"];
    case "withdrawer":
    case "avoidant":
      return ["raised_voice_trigger", "pressure_to_answer_now", "emotional_overwhelm"];
    case "explosive":
      return ["being_accused", "being_controlled_trigger", "public_humiliation"];
    case "appeasing":
      return ["partner_disapproval", "fear_of_rejection", "relationship_tension"];
    default:
      return ["criticism_trigger", "misread_motive", "rupture_pressure"];
  }
}

function defaultStressResponses(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["reassurance_seeking_response", "panic_spiral_response"];
    case "withdrawer":
    case "avoidant":
      return ["emotional_withdrawal_response", "shutdown_response"];
    case "explosive":
      return ["defensive_anger_response", "sharp_tongue_response"];
    case "appeasing":
      return ["people_pleasing_response", "over_apologizing_response"];
    case "intellectual":
      return ["intellectualizing_response", "logic_deflection_response"];
    case "deflective":
      return ["humor_deflection_response", "sarcasm_response"];
    case "dominance":
      return ["control_response", "boundary_rigidity_response"];
    case "passive":
      return ["silent_response", "acts_fine_response"];
    case "repair_oriented":
      return ["accountability_response", "vulnerability_repair_response"];
  }
}

function defaultEscalationPattern(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["detects_distance", "seeks_clarification", "pushes_for_contact", "rupture_escalates"];
    case "withdrawer":
    case "avoidant":
      return ["detects_pressure", "goes_quiet", "asks_for_space", "contact_drops"];
    case "explosive":
      return ["feels_accused", "raises_force", "says_too_much", "repair_needed"];
    case "appeasing":
      return ["detects_disapproval", "self_erases", "over_apologizes", "resentment_builds"];
    default:
      return ["trigger_hits", "defense_activates", "need_goes_indirect", "repair_required"];
  }
}

function defaultAttachmentEffects(conflictType: ConflictStyleSeedType): readonly string[] {
  if (conflictType === "pursuer") {
    return ["increases_reassurance_need", "can_create_pursue_withdraw_loop"];
  }
  if (conflictType === "withdrawer" || conflictType === "avoidant") {
    return ["lowers_contact_tolerance", "can_trigger_partner_abandonment_fear"];
  }
  return ["reveals attachment pressure", "changes repair pacing"];
}

function defaultIntimacyEffects(conflictType: ConflictStyleSeedType): readonly string[] {
  if (conflictType === "repair_oriented") {
    return ["can deepen trust after rupture", "makes honesty feel safer"];
  }
  if (conflictType === "deflective" || conflictType === "intellectual") {
    return ["delays vulnerability", "requires translation into feeling"];
  }
  return ["can expose hidden needs", "may intensify emotional stakes"];
}

function defaultRuptureRisks(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["pressure_after_conflict", "partner_withdrawal"];
    case "withdrawer":
    case "avoidant":
      return ["repair_delay", "silence_misread_as_abandonment"];
    case "explosive":
      return ["hurtful_words", "trust_damage"];
    case "appeasing":
      return ["resentment_under_compliance", "needs_never_named"];
    default:
      return ["misread_intent", "unrepaired_distance"];
  }
}

function defaultLikelyRepairStyles(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["verbal_reassurance_repair", "return_and_stay_repair"];
    case "withdrawer":
    case "avoidant":
      return ["space_based_repair", "return_after_space_repair"];
    case "explosive":
      return ["accountability_repair", "cooling_off_repair"];
    case "appeasing":
      return ["boundary_reset_repair", "needs_expression_repair"];
    case "intellectual":
      return ["emotional_translation_repair", "vulnerability_repair"];
    case "repair_oriented":
      return ["honest_conversation_repair", "changed_behavior_response"];
    default:
      return ["accountability_repair", "presence_based_repair"];
  }
}

function defaultIncompatibleRepairStyles(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["delayed_repair_without_context", "space_based_repair_without_return_promise"];
    case "withdrawer":
    case "avoidant":
      return ["immediate_intense_reassurance_demand", "cornering_repair"];
    case "appeasing":
      return ["one_sided_apology", "conflict_erasure"];
    default:
      return ["repair_without_accountability"];
  }
}

function defaultAssociatedWounds(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["abandonment_wound", "emotional_neglect_wound"];
    case "withdrawer":
    case "avoidant":
      return ["control_wound", "shame_wound"];
    case "explosive":
      return ["betrayal_wound", "humiliation_wound"];
    case "appeasing":
      return ["rejection_wound", "emotional_neglect_wound"];
    default:
      return ["trust_wound"];
  }
}

function defaultAssociatedFears(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["fear_of_abandonment", "fear_of_emotional_distance"];
    case "withdrawer":
    case "avoidant":
      return ["fear_of_dependency", "fear_of_being_controlled"];
    case "explosive":
      return ["fear_of_being_dismissed", "fear_of_powerlessness"];
    case "appeasing":
      return ["fear_of_rejection", "fear_of_disapproval"];
    default:
      return ["fear_of_vulnerability"];
  }
}

function defaultAssociatedDesires(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["desire_for_reliable_love", "desire_for_emotional_presence"];
    case "withdrawer":
    case "avoidant":
      return ["desire_for_autonomy", "desire_for_low_pressure_repair"];
    case "appeasing":
      return ["desire_to_be_chosen", "desire_for_approval"];
    default:
      return ["desire_for_respect", "desire_for_repair"];
  }
}

function defaultAssociatedResponses(conflictType: ConflictStyleSeedType): readonly string[] {
  return defaultStressResponses(conflictType);
}

function defaultHealthyVersion(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["asks directly for reassurance", "allows space with a return agreement"];
    case "withdrawer":
    case "avoidant":
      return ["asks for space with a return time", "comes back to repair"];
    case "explosive":
      return ["takes a pause before force becomes harm", "repairs with accountability"];
    case "appeasing":
      return ["names needs clearly", "shares responsibility instead of self-erasing"];
    default:
      return ["uses conflict to clarify needs", "chooses repair over pride"];
  }
}

function defaultUnhealthyVersion(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["pressures immediate resolution", "interprets boundaries as rejection"];
    case "withdrawer":
    case "avoidant":
      return ["disappears instead of pausing", "uses silence as distance"];
    case "explosive":
      return ["uses hurtful force", "mistakes volume for honesty"];
    case "appeasing":
      return ["over-apologizes while needs vanish", "builds resentment behind compliance"];
    default:
      return ["lets defenses replace repair"];
  }
}

function defaultGrowthArcs(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["learns_to_pause", "learns_space_is_not_abandonment"];
    case "withdrawer":
    case "avoidant":
      return ["learns_to_return", "names_space_without_vanishing"];
    case "explosive":
      return ["builds_regulation_before_response", "repairs_harm_directly"];
    case "appeasing":
      return ["names_needs_before_apologizing", "keeps_self_in_conflict"];
    default:
      return ["turns_defense_into_information", "chooses_repair_over_reflex"];
  }
}

function defaultDialoguePatterns(conflictType: ConflictStyleSeedType): readonly string[] {
  switch (conflictType) {
    case "pursuer":
      return ["Please do not walk away.", "I need to know we are okay."];
    case "withdrawer":
    case "avoidant":
      return [
        "I will leave now, or I am going to say things I will regret later.",
        "Give me time and I will come back.",
      ];
    case "explosive":
      return ["I am angry because I am scared.", "I need a minute before I make this worse."];
    case "appeasing":
      return ["I keep saying sorry when I mean I am afraid.", "I need to tell you what I need too."];
    case "intellectual":
      return ["I can explain it, but I am trying to feel it.", "Do not let me hide behind logic."];
    case "deflective":
      return ["I was joking because serious feels dangerous.", "Ask me again and I will try honestly."];
    case "dominance":
      return ["I am trying to control the damage, not you.", "Tell me where the line is."];
    case "passive":
      return ["I acted fine because I did not know how to say it hurt.", "I should have said something sooner."];
    case "repair_oriented":
      return [
        "There need to be two people willing to fix this.",
        "I choose repair over pride.",
      ];
  }
}
