import {
  createLoveLanguageSeedPreset,
  createVocabularySeedPreset,
  type LoveLanguagePacingPressure,
  type LoveLanguageSeed,
  type LoveLanguageSeedInput,
  type LoveLanguageSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const loveLanguageSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Attachment Style",
  "Relationship Dynamic",
  "Love Language",
  "Visible Behavior",
  "Trigger",
  "Response",
  "Conflict Beat",
  "Repair Style",
  "Growth Arc",
  "Payoff Fantasy",
  "Relationship Identity",
] as const;

export const loveLanguagePresets = [
  "Words of Affirmation",
  "Acts of Service",
  "Receiving Gifts",
  "Quality Time",
  "Physical Touch",
  "Emotional Presence",
  "Protective Care",
  "Devotional Loyalty",
  "Shared Rituals",
  "Playful Banter",
  "Intellectual Intimacy",
  "Creative Expression",
  "Domestic Care",
  "Practical Support",
  "Public Loyalty",
  "Private Understanding",
  "Consistency",
  "Reassurance",
  "Vulnerability",
  "Safe Silence",
] as const;

export const loveLanguageExpansionLogic = {
  wound_to_love_language: {
    emotional_neglect_wound: [
      "emotional_presence",
      "words_of_affirmation",
      "quality_time",
      "private_understanding",
    ],
    conditional_love_wound: [
      "consistency",
      "acts_of_service",
      "reassurance",
      "domestic_care",
    ],
    abandonment_wound: [
      "quality_time",
      "reassurance",
      "shared_rituals",
      "safe_silence",
    ],
    rejection_wound: [
      "words_of_affirmation",
      "public_loyalty",
      "devotional_loyalty",
    ],
    never_protected_wound: [
      "protective_care",
      "practical_support",
      "physical_touch",
    ],
    touch_starvation_wound: [
      "physical_touch",
      "emotional_presence",
      "safe_silence",
    ],
  },
  fear_to_love_language_need: {
    fear_of_abandonment: [
      "reassurance",
      "quality_time",
      "consistency",
    ],
    fear_of_rejection: [
      "words_of_affirmation",
      "private_understanding",
    ],
    fear_of_dependency: [
      "practical_support",
      "acts_of_service",
    ],
    fear_of_vulnerability: [
      "safe_silence",
      "emotional_presence",
      "quality_time",
    ],
  },
  love_language_to_repair_style: {
    words_of_affirmation: [
      "verbal_reassurance_repair",
      "validation_repair",
      "heart_to_heart_repair",
    ],
    acts_of_service: [
      "acts_of_service_repair",
      "proof_through_action_repair",
      "everyday_effort_repair",
    ],
    quality_time: [
      "presence_based_repair",
      "reconnection_ritual_repair",
      "relationship_maintenance_repair",
    ],
    physical_touch: [
      "safe_touch_repair",
      "touch_based_grounding_repair",
      "physical_comfort_repair",
    ],
    receiving_gifts: [
      "symbolic_gesture_repair",
      "small_gesture_repair",
      "tradition_restoration_repair",
    ],
    consistency: [
      "consistency_repair",
      "follow_through_repair",
      "promise_kept_beat",
    ],
  },
} as const;

export const loveLanguageCategories = {
  words: [
    "words_of_affirmation",
  ],
  service: [
    "acts_of_service",
  ],
  gifts: [
    "receiving_gifts",
  ],
  time: [
    "quality_time",
  ],
  touch: [
    "physical_touch",
  ],
  presence: [
    "emotional_presence",
  ],
  protection: [
    "protective_care",
  ],
  loyalty: [
    "devotional_loyalty",
    "public_loyalty",
  ],
  ritual: [
    "shared_rituals",
    "consistency",
  ],
  banter: [
    "playful_banter",
  ],
  intellectual: [
    "intellectual_intimacy",
  ],
  creative: [
    "creative_expression",
  ],
  domestic: [
    "domestic_care",
  ],
  practical: [
    "practical_support",
  ],
  reassurance: [
    "reassurance",
  ],
  vulnerability: [
    "vulnerability",
  ],
  silence: [
    "private_understanding",
    "safe_silence",
  ],
} as const satisfies Record<LoveLanguageSeedType, readonly string[]>;

type LoveLanguageOverride = Partial<LoveLanguageSeedInput> & {
  label?: string;
};

const LOVE_LANGUAGE_OVERRIDES: Record<string, LoveLanguageOverride> = {
  acts_of_service: {
    label: "Acts of Service",
    description:
      "A love language where care is expressed through helpful actions, practical support, domestic effort, reliability, and easing another person's burdens.",
    examples: [
      "Makes tea before a difficult conversation.",
      "Handles chores when the other person is overwhelmed.",
      "Shows love by solving practical problems.",
    ],
    tags: [
      "love_language",
      "service",
      "care",
      "domestic",
      "reliability",
    ],
    relatedSeeds: [
      "practical_care",
      "quiet_devotion",
      "acts_of_service_repair",
      "domestic_care",
    ],
    oppositeSeeds: [
      "neglect",
      "empty_words",
      "performative_care",
    ],
    romanceHooks: [
      "makes_life_easier",
      "tea_after_argument",
      "service_as_love_confession",
      "care_without_being_asked",
    ],
    scenarioHooks: [
      "sick_day_caretaking",
      "overwhelmed_partner_helped",
      "domestic_morning",
      "post_conflict_service",
    ],
    dialoguePatterns: [
      "I fixed it.",
      "You looked tired, so I handled it.",
      "Let me make this easier for you.",
    ],
    loveLanguageType: "service",
    emotionalMeaning:
      "I notice what burdens you, and I want to carry some of it with you.",
    hiddenNeed:
      "To feel useful, trusted, and allowed to care without being rejected.",
    commonMisread:
      "Can be misread as control, overfunctioning, obligation, or avoidance of emotional conversation.",
    associatedWounds: [
      "conditional_love_wound",
      "emotional_neglect_wound",
      "burden_wound",
    ],
    associatedFears: [
      "fear_of_being_useless",
      "fear_of_not_being_needed",
      "fear_of_vulnerability",
    ],
    associatedDesires: [
      "desire_to_be_needed",
      "desire_to_make_life_easier",
      "desire_for_devotion",
    ],
    compatibleAttachmentStyles: [
      "caretaker_attachment",
      "secure_attachment",
      "earned_secure_attachment",
    ],
    compatibleDynamics: [
      "caretaker_receiver_dynamic",
      "soft_domestic_relationship",
      "mutual_caretaking_dynamic",
    ],
    visibleBehaviors: [
      "makes_tea",
      "cooks_for_partner",
      "handles_chores",
      "runs_errands",
      "remembers_preferences",
      "shows_up_reliably",
    ],
    fulfillmentSignals: [
      "care_is_received_without_shame",
      "effort_is_noticed",
      "support_becomes_mutual",
    ],
    deprivationSignals: [
      "feels_unneeded",
      "overfunctions_to_earn_love",
      "gets_hurt_when_effort_is_invisible",
    ],
    conflictRisks: [
      "care_becomes_transactional",
      "help_becomes_control",
      "service_replaces_emotional_honesty",
    ],
    repairStyles: [
      "acts_of_service_repair",
      "behavior_change_repair",
      "consistency_repair",
    ],
    growthArcs: [
      "learns_to_receive_care",
      "learns_service_without_self_erasure",
      "learns_to_say_the_feeling_too",
    ],
    routeGates: [
      "first_service_as_love_gate",
      "first_care_received_gate",
      "mutual_caretaking_gate",
    ],
    metadata: {
      category: "love_language",
      romanceValue: 9,
      intimacyValue: 8,
      healingValue: 10,
      conflictPotential: 5,
      pacingPressure: "medium",
    },
  },
  words_of_affirmation: {
    description:
      "A love language where spoken tenderness, explicit appreciation, and named commitment make affection feel real instead of assumed.",
    dialoguePatterns: [
      "I need you to say it. Just once, clearly.",
      "You matter to me. I should have said that sooner.",
      "I hear you, and I am not going anywhere.",
    ],
    emotionalMeaning:
      "I want love to be named plainly enough that doubt has less room to grow.",
    hiddenNeed:
      "To be reassured without feeling needy for wanting words.",
    commonMisread:
      "Can be misread as fishing for compliments or needing constant praise.",
  },
  physical_touch: {
    description:
      "A love language where safe, wanted touch carries reassurance, grounding, comfort, and proof of welcome closeness.",
    dialoguePatterns: [
      "Can I hold your hand?",
      "Come here. Only if you want to.",
      "You do not have to talk yet. I can just sit close.",
    ],
    emotionalMeaning:
      "I feel safest when care is gentle enough to be felt in the body.",
    hiddenNeed:
      "To experience closeness as chosen comfort rather than pressure.",
    commonMisread:
      "Can be misread as neediness, possessiveness, or assuming touch is always welcome.",
    metadata: {
      category: "love_language",
      romanceValue: 9,
      intimacyValue: 10,
      healingValue: 9,
      conflictPotential: 6,
      pacingPressure: "high",
    },
  },
  safe_silence: {
    description:
      "A love language where quiet companionship, unforced presence, and room to breathe make intimacy feel safe instead of performative.",
    dialoguePatterns: [
      "We do not have to fill the quiet.",
      "Stay. You do not need to explain yet.",
      "This silence does not scare me when it is with you.",
    ],
    emotionalMeaning:
      "I trust you enough not to perform every feeling out loud.",
    hiddenNeed:
      "To be accepted in stillness, fatigue, and wordless recovery.",
    commonMisread:
      "Can be misread as distance, disinterest, or withholding.",
    metadata: {
      category: "love_language",
      romanceValue: 8,
      intimacyValue: 9,
      healingValue: 10,
      conflictPotential: 3,
      pacingPressure: "low",
    },
  },
};

export const LOVE_LANGUAGE_SEEDS = Object.freeze(
  getUniqueLoveLanguageIds().map((seed) =>
    createLoveLanguageSeedPreset(buildLoveLanguageInput(seed)),
  ),
) satisfies readonly LoveLanguageSeed[];

export const LOVE_LANGUAGE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  LOVE_LANGUAGE_SEEDS.map(toStandardLoveLanguageVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getLoveLanguageSeedsByCategory(
  loveLanguageType: LoveLanguageSeedType,
): readonly LoveLanguageSeed[] {
  const ids = new Set<string>(loveLanguageCategories[loveLanguageType]);
  return LOVE_LANGUAGE_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getLoveLanguageSeedsByType(
  loveLanguageType: LoveLanguageSeedType,
): readonly LoveLanguageSeed[] {
  return LOVE_LANGUAGE_SEEDS.filter((seed) => seed.loveLanguageType === loveLanguageType);
}

export function findLoveLanguageSeedBySeed(
  seedId: string,
): LoveLanguageSeed | undefined {
  return LOVE_LANGUAGE_SEEDS.find((seed) => seed.seed === seedId);
}

function getUniqueLoveLanguageIds(): readonly string[] {
  return Array.from(new Set(Object.values(loveLanguageCategories).flat()));
}

function buildLoveLanguageInput(seed: string): LoveLanguageSeedInput {
  const loveLanguageType = inferLoveLanguageType(seed);
  const label = loveLanguageLabel(seed);
  const base: LoveLanguageSeedInput = {
    seed,
    label,
    description: defaultDescription(label, loveLanguageType),
    examples: defaultExamples(label, loveLanguageType),
    tags: [
      "love_language",
      loveLanguageType,
      ...defaultTags(loveLanguageType),
    ],
    relatedSeeds: defaultRelatedSeeds(seed, loveLanguageType),
    oppositeSeeds: defaultOppositeSeeds(loveLanguageType),
    romanceHooks: defaultRomanceHooks(seed, loveLanguageType),
    scenarioHooks: defaultScenarioHooks(loveLanguageType),
    dialoguePatterns: defaultDialoguePatterns(label, loveLanguageType),
    loveLanguageType,
    emotionalMeaning: defaultEmotionalMeaning(loveLanguageType),
    hiddenNeed: defaultHiddenNeed(loveLanguageType),
    commonMisread: defaultCommonMisread(loveLanguageType),
    associatedWounds: defaultAssociatedWounds(loveLanguageType),
    associatedFears: defaultAssociatedFears(loveLanguageType),
    associatedDesires: defaultAssociatedDesires(loveLanguageType),
    compatibleAttachmentStyles: defaultCompatibleAttachmentStyles(loveLanguageType),
    compatibleDynamics: defaultCompatibleDynamics(loveLanguageType),
    visibleBehaviors: defaultVisibleBehaviors(seed, loveLanguageType),
    fulfillmentSignals: defaultFulfillmentSignals(loveLanguageType),
    deprivationSignals: defaultDeprivationSignals(loveLanguageType),
    conflictRisks: defaultConflictRisks(loveLanguageType),
    repairStyles: defaultRepairStyles(seed, loveLanguageType),
    growthArcs: defaultGrowthArcs(loveLanguageType),
    routeGates: defaultRouteGates(seed, loveLanguageType),
    metadata: {
      category: "love_language",
      romanceValue: defaultRomanceValue(loveLanguageType),
      intimacyValue: defaultIntimacyValue(loveLanguageType),
      healingValue: defaultHealingValue(loveLanguageType),
      conflictPotential: defaultConflictPotential(loveLanguageType),
      pacingPressure: defaultPacingPressure(loveLanguageType),
    },
  };
  const override = LOVE_LANGUAGE_OVERRIDES[seed];

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override?.metadata,
    },
  };
}

function toStandardLoveLanguageVocabularySeed(
  seed: LoveLanguageSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Love language type: ${seed.loveLanguageType}.`,
      `Emotional meaning: ${seed.emotionalMeaning}`,
      `Hidden need: ${seed.hiddenNeed}`,
      `Common misread: ${seed.commonMisread}`,
    ].join(" "),
    examples: [
      ...seed.examples,
      ...seed.visibleBehaviors,
      ...seed.fulfillmentSignals,
    ],
    tags: [
      "love_language",
      seed.loveLanguageType,
      seed.metadata.pacingPressure,
      ...seed.tags,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.associatedWounds,
      ...seed.associatedFears,
      ...seed.associatedDesires,
      ...seed.compatibleAttachmentStyles,
      ...seed.compatibleDynamics,
    ],
    oppositeSeeds: [
      ...seed.oppositeSeeds,
      ...seed.conflictRisks,
    ],
    romanceHooks: [
      ...seed.romanceHooks,
      ...seed.growthArcs,
    ],
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.deprivationSignals,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: seed.metadata.pacingPressure === "high" ? "uncommon" : "common",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function inferLoveLanguageType(seed: string): LoveLanguageSeedType {
  for (const [loveLanguageType, seeds] of Object.entries(loveLanguageCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return loveLanguageType as LoveLanguageSeedType;
    }
  }

  return "presence";
}

function loveLanguageLabel(seed: string): string {
  const presetLabel = loveLanguagePresets.find(
    (preset) => slugifyLoveLanguagePreset(preset) === seed,
  );

  return presetLabel ?? seed
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyLoveLanguagePreset(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function defaultDescription(
  label: string,
  loveLanguageType: LoveLanguageSeedType,
): string {
  const phrase = loveLanguageType.replace(/_/g, " ");
  return `${label} expresses affection through ${phrase} signals that make care visible, repeatable, and emotionally legible inside the relationship.`;
}

function defaultExamples(
  label: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  return [
    `${label} turns affection into a specific behaviour the other person can recognize.`,
    `When the need is met, the character feels steadier, more wanted, and easier to reach.`,
    `When it is missing, the relationship can feel colder than either person intended.`,
    `In healthier scenes, the character learns to ask for this kind of care without turning it into a test.`,
  ];
}

function defaultTags(loveLanguageType: LoveLanguageSeedType): readonly string[] {
  return [
    "relationship_engine",
    "visible_behavior",
    loveLanguageType === "touch" ? "consent_sensitive" : "affection_signal",
  ];
}

function defaultRelatedSeeds(
  seed: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  return [
    `${loveLanguageType}_love_language`,
    "relationship_dynamic",
    "repair_style",
    seed.replace(/_$/, ""),
  ];
}

function defaultOppositeSeeds(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "emotional_withholding",
      "empty_words",
      "silence_as_punishment",
    ];
  }
  if (loveLanguageType === "touch") {
    return [
      "unwanted_touch",
      "touch_used_as_pressure",
      "physical_distance_as_punishment",
    ];
  }
  return [
    "neglect",
    "performative_care",
    "inconsistent_affection",
  ];
}

function defaultRomanceHooks(
  seed: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "clear_reassurance_scene",
      "named_devotion_confession",
      "words_after_misread_distance",
    ];
  }
  if (loveLanguageType === "touch") {
    return [
      "safe_touch_after_permission",
      "hand_holding_grounding",
      "comfort_contact_after_fear",
    ];
  }
  return [
    `${seed}_romance_hook`,
    "care_becomes_visible",
    "small_gesture_lands_softly",
  ];
}

function defaultScenarioHooks(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "time" || loveLanguageType === "ritual") {
    return [
      "missed_ritual_conflict",
      "scheduled_time_kept",
      "ordinary_evening_reconnection",
    ];
  }
  if (loveLanguageType === "touch") {
    return [
      "panic_grounding_after_permission",
      "cold_hands_warmed",
      "first_safe_touch_gate",
    ];
  }
  return [
    "need_goes_unspoken",
    "care_is_finally_noticed",
    "post_conflict_repair_attempt",
  ];
}

function defaultDialoguePatterns(
  label: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "Say it like you mean it.",
      "I did not know you needed to hear it. I know now.",
      "You matter. I am sorry I made you guess.",
    ];
  }
  if (loveLanguageType === "touch") {
    return [
      "Can I touch you?",
      "Only if it helps.",
      "It does.",
    ];
  }
  if (loveLanguageType === "silence") {
    return [
      "You can be quiet with me.",
      "I am not asking you to perform being fine.",
      "Good. I am tired of performing.",
    ];
  }
  return [
    `This is how ${label.toLowerCase()} looks when I do not know how to say it.`,
    "I noticed what you needed.",
    "That should not feel as intimate as it does.",
  ];
}

function defaultEmotionalMeaning(loveLanguageType: LoveLanguageSeedType): string {
  const meanings: Record<LoveLanguageSeedType, string> = {
    words: "I want care to be named clearly enough that doubt cannot rewrite it.",
    service: "I notice what burdens you and want to make the day less heavy.",
    gifts: "I remembered you when you were not in the room.",
    time: "I choose to give you my attention without treating you like an interruption.",
    touch: "I want closeness to feel safe, wanted, and grounded in the body.",
    presence: "I am here with you, not just near you.",
    protection: "Your safety matters to me, and I will not confuse care with control.",
    loyalty: "I choose you when it costs something to be clear.",
    ritual: "I make love reliable by returning to small shared things.",
    banter: "I let warmth move sideways when direct tenderness feels too exposed.",
    intellectual: "I want to meet your mind, not just your mood.",
    creative: "I turn feeling into something made for you.",
    domestic: "I let ordinary life become proof of affection.",
    practical: "I support your real life, not only your romantic ideal.",
    reassurance: "I answer fear before it has to become a test.",
    vulnerability: "I trust you with the part of me that could be hurt.",
    silence: "I believe quiet can be intimate when it is chosen together.",
  };

  return meanings[loveLanguageType];
}

function defaultHiddenNeed(loveLanguageType: LoveLanguageSeedType): string {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return "To stop guessing where they stand.";
  }
  if (loveLanguageType === "touch") {
    return "To feel wanted and safe without being rushed.";
  }
  if (loveLanguageType === "service" || loveLanguageType === "practical") {
    return "To feel useful without becoming responsible for everything.";
  }
  return "To have affection arrive in the form they can actually recognize.";
}

function defaultCommonMisread(loveLanguageType: LoveLanguageSeedType): string {
  if (loveLanguageType === "banter") {
    return "Can be misread as not taking the relationship seriously.";
  }
  if (loveLanguageType === "silence") {
    return "Can be misread as distance, disinterest, or withdrawal.";
  }
  if (loveLanguageType === "protection") {
    return "Can be misread as control if choice and consent are not clear.";
  }
  return "Can be misread when the other person expects affection to arrive in a different form.";
}

function defaultAssociatedWounds(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "presence") {
    return [
      "emotional_neglect_wound",
      "rejection_wound",
    ];
  }
  if (loveLanguageType === "protection" || loveLanguageType === "touch") {
    return [
      "never_protected_wound",
      "touch_starvation_wound",
    ];
  }
  return [
    "conditional_love_wound",
    "abandonment_wound",
  ];
}

function defaultAssociatedFears(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "fear_of_rejection",
      "fear_of_abandonment",
    ];
  }
  if (loveLanguageType === "touch" || loveLanguageType === "vulnerability") {
    return [
      "fear_of_vulnerability",
      "fear_of_being_too_much",
    ];
  }
  return [
    "fear_of_not_mattering",
    "fear_of_being_unneeded",
  ];
}

function defaultAssociatedDesires(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "loyalty") {
    return [
      "desire_to_be_chosen",
      "desire_for_devotion",
    ];
  }
  if (loveLanguageType === "time" || loveLanguageType === "presence") {
    return [
      "desire_for_emotional_presence",
      "desire_for_reliable_love",
    ];
  }
  return [
    "desire_for_safe_love",
    "desire_to_be_understood",
  ];
}

function defaultCompatibleAttachmentStyles(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "reassurance" || loveLanguageType === "words") {
    return [
      "anxious_attachment",
      "earned_secure_attachment",
      "secure_attachment",
    ];
  }
  if (loveLanguageType === "silence" || loveLanguageType === "practical") {
    return [
      "avoidant_attachment",
      "space_needing_attachment",
      "earned_secure_attachment",
    ];
  }
  return [
    "secure_attachment",
    "earned_secure_attachment",
  ];
}

function defaultCompatibleDynamics(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "protection") {
    return [
      "protector_protected_dynamic",
      "protective_but_free_relationship",
    ];
  }
  if (loveLanguageType === "domestic" || loveLanguageType === "service") {
    return [
      "soft_domestic_relationship",
      "mutual_caretaking_dynamic",
    ];
  }
  return [
    "safe_haven_dynamic",
    "mutual_growth_dynamic",
  ];
}

function defaultVisibleBehaviors(
  seed: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "says_the_feeling_plainly",
      "names_commitment",
      "validates_fear_without_mocking_it",
    ];
  }
  if (loveLanguageType === "touch") {
    return [
      "asks_before_touching",
      "holds_hand_when_invited",
      "uses_touch_to_ground_not_pressure",
    ];
  }
  if (loveLanguageType === "service" || loveLanguageType === "domestic") {
    return [
      "makes_tea",
      "handles_chores",
      "remembers_preferences",
    ];
  }
  return [
    `${seed}_visible_behavior`,
    "shows_up_reliably",
    "notices_small_needs",
  ];
}

function defaultFulfillmentSignals(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "touch") {
    return [
      "body_relaxes",
      "asks_for_closeness_directly",
      "trusts_touch_can_stop_when_needed",
    ];
  }
  return [
    "care_is_recognized",
    "need_is_named_without_shame",
    "support_becomes_mutual",
  ];
}

function defaultDeprivationSignals(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "overreads_silence",
      "asks_indirectly_for_proof",
      "feels_unchosen",
    ];
  }
  if (loveLanguageType === "time" || loveLanguageType === "presence") {
    return [
      "feels_scheduled_around",
      "withdraws_when_attention_scatters",
      "stops_asking_for_time",
    ];
  }
  return [
    "effort_goes_invisible",
    "need_turns_into_resentment",
    "affection_feels_mistranslated",
  ];
}

function defaultConflictRisks(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "protection") {
    return [
      "protection_becomes_control",
      "help_overrides_agency",
    ];
  }
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "reassurance_becomes_a_test",
      "words_without_follow_through",
    ];
  }
  return [
    "care_is_missed_or_mistranslated",
    "one_person_overfunctions",
  ];
}

function defaultRepairStyles(
  seed: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "words" || loveLanguageType === "reassurance") {
    return [
      "verbal_reassurance_repair",
      "validation_repair",
    ];
  }
  if (loveLanguageType === "touch") {
    return [
      "safe_touch_repair",
      "physical_comfort_repair",
    ];
  }
  if (loveLanguageType === "service" || loveLanguageType === "practical") {
    return [
      "acts_of_service_repair",
      "proof_through_action_repair",
    ];
  }
  return [
    `${seed}_repair_style`,
    "relationship_maintenance_repair",
  ];
}

function defaultGrowthArcs(
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  if (loveLanguageType === "vulnerability") {
    return [
      "learns_to_be_seen",
      "learns_safe_openness",
    ];
  }
  return [
    "learns_to_ask_for_care",
    "learns_to_receive_love",
    "learns_affection_without_tests",
  ];
}

function defaultRouteGates(
  seed: string,
  loveLanguageType: LoveLanguageSeedType,
): readonly string[] {
  return [
    `first_${seed}_gate`,
    `${loveLanguageType}_received_gate`,
    "mutual_affection_language_gate",
  ];
}

function defaultRomanceValue(loveLanguageType: LoveLanguageSeedType): number {
  return loveLanguageType === "practical" ? 7 : 9;
}

function defaultIntimacyValue(loveLanguageType: LoveLanguageSeedType): number {
  return loveLanguageType === "touch" || loveLanguageType === "vulnerability" ? 10 : 8;
}

function defaultHealingValue(loveLanguageType: LoveLanguageSeedType): number {
  return loveLanguageType === "reassurance" || loveLanguageType === "presence" ? 10 : 8;
}

function defaultConflictPotential(loveLanguageType: LoveLanguageSeedType): number {
  return loveLanguageType === "touch" || loveLanguageType === "protection" ? 6 : 5;
}

function defaultPacingPressure(
  loveLanguageType: LoveLanguageSeedType,
): LoveLanguagePacingPressure {
  if (loveLanguageType === "touch" || loveLanguageType === "vulnerability") {
    return "high";
  }
  if (loveLanguageType === "silence" || loveLanguageType === "ritual") {
    return "low";
  }
  return "medium";
}
