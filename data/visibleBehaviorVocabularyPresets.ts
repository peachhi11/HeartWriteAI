import {
  createVisibleBehaviorSeedPreset,
  createVocabularySeedPreset,
  type VisibleBehaviorRepeatability,
  type VisibleBehaviorSeed,
  type VisibleBehaviorSeedInput,
  type VisibleBehaviorSeedType,
  type VisibleBehaviorSubtlety,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const visibleBehaviorSemanticChain = [
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

export const visibleBehaviorPresets = [
  "Makes Tea When Worried",
  "Remembers Their Order",
  "Checks In Daily",
  "Walks Them Home",
  "Waits Until They Are Inside",
  "Offers Jacket",
  "Saves Last Bite",
  "Keeps Spare Key",
  "Fixes Broken Things",
  "Handles Chores When Overwhelmed",
  "Brings Medicine",
  "Makes Soup When Sick",
  "Charges Their Phone",
  "Carries Heavy Bags",
  "Holds Umbrella",
  "Lingers at Doorway",
  "Sits Beside Them in Silence",
  "Learns Their Preferences",
  "Notices Mood Changes",
  "Shows Up Reliably",
  "Stands Between Them and Danger",
  "Publicly Takes Their Side",
  "Privately Checks Their Feelings",
  "Softens Voice for Them",
  "Uses Their Favorite Nickname",
  "Sends Goodnight Text",
  "Restores Small Ritual",
  "Makes Room for Them",
  "Leaves Light On",
  "Keeps Promise Quietly",
] as const;

export const visibleBehaviorExpansionLogic = {
  love_language_to_visible_behavior: {
    acts_of_service: [
      "makes_tea_when_worried",
      "handles_chores_when_overwhelmed",
      "fixes_broken_things",
      "brings_medicine",
    ],
    quality_time: [
      "sits_beside_them_in_silence",
      "checks_in_daily",
      "lingers_at_doorway",
    ],
    physical_touch: [
      "offers_jacket",
      "holds_umbrella",
      "sits_beside_them_in_silence",
    ],
    words_of_affirmation: [
      "softens_voice_for_them",
      "uses_their_favorite_nickname",
      "privately_checks_their_feelings",
    ],
    devotional_loyalty: [
      "publicly_takes_their_side",
      "stands_between_them_and_danger",
      "keeps_promise_quietly",
    ],
  },
  wound_to_visible_behavior: {
    emotional_neglect_wound: [
      "notices_mood_changes",
      "privately_checks_their_feelings",
      "remembers_their_order",
    ],
    abandonment_wound: [
      "sends_goodnight_text",
      "shows_up_reliably",
      "waits_until_they_are_inside",
    ],
    never_protected_wound: [
      "walks_them_home",
      "stands_between_them_and_danger",
      "offers_jacket",
    ],
    conditional_love_wound: [
      "keeps_promise_quietly",
      "makes_room_for_them",
      "handles_chores_when_overwhelmed",
    ],
  },
  visible_behavior_to_repair_style: {
    makes_tea_when_worried: [
      "acts_of_service_repair",
      "domestic_routine_repair",
      "quiet_domesticity_repair",
    ],
    sends_goodnight_text: [
      "check_in_ritual_repair",
      "return_and_stay_repair",
      "attachment_reassurance_repair",
    ],
    publicly_takes_their_side: [
      "public_loyalty_repair",
      "devotional_repair",
      "dignity_restoration_repair",
    ],
    sits_beside_them_in_silence: [
      "presence_based_repair",
      "shared_silence_repair",
      "holding_space_repair",
    ],
  },
} as const;

export const visibleBehaviorCategories = {
  domestic: [
    "makes_tea_when_worried",
    "saves_last_bite",
    "makes_soup_when_sick",
    "leaves_light_on",
  ],
  protective: [
    "walks_them_home",
    "waits_until_they_are_inside",
    "stands_between_them_and_danger",
  ],
  caretaking: [
    "brings_medicine",
    "handles_chores_when_overwhelmed",
  ],
  practical: [
    "remembers_their_order",
    "keeps_spare_key",
    "fixes_broken_things",
    "charges_their_phone",
    "carries_heavy_bags",
  ],
  ritual: [
    "checks_in_daily",
    "lingers_at_doorway",
    "sends_goodnight_text",
  ],
  reassurance: [
    "sits_beside_them_in_silence",
    "shows_up_reliably",
    "makes_room_for_them",
  ],
  devotional: [
    "keeps_promise_quietly",
  ],
  attention: [
    "learns_their_preferences",
    "notices_mood_changes",
  ],
  touch: [
    "offers_jacket",
    "holds_umbrella",
  ],
  communication: [
    "privately_checks_their_feelings",
    "softens_voice_for_them",
    "uses_their_favorite_nickname",
  ],
  repair: [
    "restores_small_ritual",
  ],
  public_loyalty: [
    "publicly_takes_their_side",
  ],
} as const satisfies Record<VisibleBehaviorSeedType, readonly string[]>;

type VisibleBehaviorOverride = Partial<VisibleBehaviorSeedInput> & {
  label?: string;
};

const VISIBLE_BEHAVIOR_OVERRIDES: Record<string, VisibleBehaviorOverride> = {
  makes_tea_when_worried: {
    description:
      "A quiet domestic behavior where worry becomes a warm drink, a familiar cup, and a small attempt to make the moment easier to survive.",
    examples: [
      "Starts the kettle after noticing the other person has gone too quiet.",
      "Brings tea to the edge of the conversation instead of forcing an answer.",
      "Remembers the exact strength, sweetness, and cup they prefer.",
    ],
    tags: [
      "visible_behavior",
      "acts_of_service",
      "domestic",
      "quiet_devotion",
      "reassurance",
    ],
    relatedSeeds: [
      "acts_of_service",
      "quiet_devotion",
      "domestic_care",
      "soft_domestic_relationship",
    ],
    oppositeSeeds: [
      "performative_care",
      "neglect",
      "care_used_as_control",
    ],
    romanceHooks: [
      "tea_after_argument",
      "wordless_worry_care",
      "ordinary_gesture_lands_softly",
    ],
    scenarioHooks: [
      "stressful_evening",
      "post_conflict_kitchen_scene",
      "quiet_caretaking_after_bad_news",
    ],
    dialoguePatterns: [
      "I made it how you like it.",
      "You do not have to talk yet. Just hold this.",
      "I needed something to do with my hands that was not reaching for you.",
    ],
    emotionalMeaning:
      "I noticed you were hurting, and I wanted to meet you gently before asking for anything.",
    hiddenMotivation:
      "To offer care without crowding the other person or making vulnerability feel demanded.",
    loveLanguageSource: [
      "acts_of_service",
      "domestic_care",
      "emotional_presence",
    ],
    associatedWounds: [
      "emotional_neglect_wound",
      "conditional_love_wound",
    ],
    associatedFears: [
      "fear_of_being_too_much",
      "fear_of_vulnerability",
    ],
    associatedDesires: [
      "desire_for_safe_love",
      "desire_to_be_noticed",
    ],
    associatedDynamics: [
      "soft_domestic_relationship",
      "safe_haven_dynamic",
      "mutual_caretaking_dynamic",
    ],
    activatedBy: [
      "stressful_silence",
      "visible_exhaustion",
      "post_conflict_distance",
    ],
    fulfillmentSignals: [
      "drink_is_accepted",
      "shoulders_drop",
      "conversation_reopens_softly",
    ],
    misreadRisks: [
      "care_mistaken_for_avoidance",
      "gesture_missed_as_too_small",
    ],
    conflictRisks: [
      "service_replaces_words_too_often",
      "caretaking_becomes_overfunctioning",
    ],
    repairStyles: [
      "acts_of_service_repair",
      "domestic_routine_repair",
      "quiet_domesticity_repair",
    ],
    growthArcs: [
      "learns_to_pair_action_with_honesty",
      "learns_care_does_not_need_to_earn_love",
    ],
    routeGates: [
      "first_wordless_care_gate",
      "tea_after_argument_gate",
    ],
    milestoneMemories: [
      "first_tea_when_worried_memory",
      "quiet_kitchen_repair_memory",
    ],
    metadata: {
      subtlety: "high",
      romanceValue: 9,
      intimacyValue: 8,
      healingValue: 9,
      conflictPotential: 3,
      repeatability: "ritual",
    },
  },
  publicly_takes_their_side: {
    description:
      "A public loyalty behavior where affection becomes visible in the moment when silence would be safer.",
    dialoguePatterns: [
      "No. They are with me.",
      "If you are going to question them, you can start with me.",
      "I know exactly whose side I am on.",
    ],
    emotionalMeaning:
      "I will not make you stand alone just because choosing you has consequences.",
    hiddenMotivation:
      "To make loyalty unmistakable after shame, rejection, or social pressure has made the bond feel negotiable.",
    loveLanguageSource: [
      "devotional_loyalty",
      "public_loyalty",
      "words_of_affirmation",
    ],
    associatedWounds: [
      "rejection_wound",
      "humiliation_wound",
      "never_chosen_wound",
    ],
    associatedFears: [
      "fear_of_replacement",
      "fear_of_public_shame",
    ],
    associatedDesires: [
      "desire_to_be_chosen",
      "desire_for_devotion",
    ],
    associatedDynamics: [
      "devotional_dynamic",
      "equal_partners_dynamic",
    ],
    repairStyles: [
      "public_loyalty_repair",
      "dignity_restoration_repair",
    ],
    metadata: {
      subtlety: "low",
      romanceValue: 10,
      intimacyValue: 8,
      healingValue: 9,
      conflictPotential: 7,
      repeatability: "one_off",
    },
  },
  sends_goodnight_text: {
    description:
      "A recurring reassurance behavior where the day closes with a reliable return, even when the relationship has been under strain.",
    dialoguePatterns: [
      "Home safe. Goodnight.",
      "I know today was hard. I am still here.",
      "Sleep if you can. I will be here in the morning.",
    ],
    emotionalMeaning:
      "I am ending the day by returning to you, not by disappearing into silence.",
    hiddenMotivation:
      "To make absence predictable enough that distance does not become abandonment.",
    loveLanguageSource: [
      "quality_time",
      "reassurance",
      "shared_rituals",
      "consistency",
    ],
    associatedWounds: [
      "abandonment_wound",
      "emotional_neglect_wound",
    ],
    associatedFears: [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
    ],
    repairStyles: [
      "check_in_ritual_repair",
      "return_and_stay_repair",
      "attachment_reassurance_repair",
    ],
    routeGates: [
      "first_goodnight_text_gate",
      "secure_return_gate",
    ],
    metadata: {
      subtlety: "medium",
      romanceValue: 8,
      intimacyValue: 8,
      healingValue: 9,
      conflictPotential: 4,
      repeatability: "ritual",
    },
  },
  sits_beside_them_in_silence: {
    description:
      "A presence-based behavior where the character offers nearness without interrogation, pressure, or forced optimism.",
    dialoguePatterns: [
      "I can sit here. That is all.",
      "You do not have to make the silence pretty for me.",
      "Tell me when words come back.",
    ],
    emotionalMeaning:
      "I can stay close without asking you to perform recovery for my comfort.",
    hiddenMotivation:
      "To prove that companionship can hold difficult feelings without trying to fix them too quickly.",
    loveLanguageSource: [
      "quality_time",
      "safe_silence",
      "emotional_presence",
    ],
    repairStyles: [
      "presence_based_repair",
      "shared_silence_repair",
      "holding_space_repair",
    ],
    metadata: {
      subtlety: "high",
      romanceValue: 8,
      intimacyValue: 10,
      healingValue: 10,
      conflictPotential: 2,
      repeatability: "recurring",
    },
  },
};

export const VISIBLE_BEHAVIOR_SEEDS = Object.freeze(
  getUniqueVisibleBehaviorIds().map((seed) =>
    createVisibleBehaviorSeedPreset(buildVisibleBehaviorInput(seed)),
  ),
) satisfies readonly VisibleBehaviorSeed[];

export const VISIBLE_BEHAVIOR_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  VISIBLE_BEHAVIOR_SEEDS.map(toStandardVisibleBehaviorVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getVisibleBehaviorSeedsByCategory(
  behaviorType: VisibleBehaviorSeedType,
): readonly VisibleBehaviorSeed[] {
  const ids = new Set<string>(visibleBehaviorCategories[behaviorType]);
  return VISIBLE_BEHAVIOR_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getVisibleBehaviorSeedsByType(
  behaviorType: VisibleBehaviorSeedType,
): readonly VisibleBehaviorSeed[] {
  return VISIBLE_BEHAVIOR_SEEDS.filter((seed) => seed.behaviorType === behaviorType);
}

export function findVisibleBehaviorSeedBySeed(
  seedId: string,
): VisibleBehaviorSeed | undefined {
  return VISIBLE_BEHAVIOR_SEEDS.find((seed) => seed.seed === seedId);
}

function getUniqueVisibleBehaviorIds(): readonly string[] {
  return Array.from(new Set(Object.values(visibleBehaviorCategories).flat()));
}

function buildVisibleBehaviorInput(seed: string): VisibleBehaviorSeedInput {
  const behaviorType = inferVisibleBehaviorType(seed);
  const label = visibleBehaviorLabel(seed);
  const base: VisibleBehaviorSeedInput = {
    seed,
    label,
    description: defaultDescription(label, behaviorType),
    examples: defaultExamples(label, behaviorType),
    tags: [
      "visible_behavior",
      behaviorType,
      "relationship_engine",
      "behavioral_prose",
    ],
    relatedSeeds: defaultRelatedSeeds(seed, behaviorType),
    oppositeSeeds: defaultOppositeSeeds(behaviorType),
    romanceHooks: defaultRomanceHooks(seed, behaviorType),
    scenarioHooks: defaultScenarioHooks(seed, behaviorType),
    dialoguePatterns: defaultDialoguePatterns(label, behaviorType),
    behaviorType,
    emotionalMeaning: defaultEmotionalMeaning(behaviorType),
    hiddenMotivation: defaultHiddenMotivation(behaviorType),
    loveLanguageSource: defaultLoveLanguageSource(behaviorType),
    associatedWounds: defaultAssociatedWounds(behaviorType),
    associatedFears: defaultAssociatedFears(behaviorType),
    associatedDesires: defaultAssociatedDesires(behaviorType),
    associatedDynamics: defaultAssociatedDynamics(behaviorType),
    activatedBy: defaultActivatedBy(behaviorType),
    fulfillmentSignals: defaultFulfillmentSignals(behaviorType),
    misreadRisks: defaultMisreadRisks(behaviorType),
    conflictRisks: defaultConflictRisks(behaviorType),
    repairStyles: defaultRepairStyles(seed, behaviorType),
    growthArcs: defaultGrowthArcs(behaviorType),
    routeGates: defaultRouteGates(seed, behaviorType),
    milestoneMemories: defaultMilestoneMemories(seed),
    metadata: {
      category: "visible_behavior",
      subtlety: defaultSubtlety(behaviorType),
      romanceValue: defaultRomanceValue(behaviorType),
      intimacyValue: defaultIntimacyValue(behaviorType),
      healingValue: defaultHealingValue(behaviorType),
      conflictPotential: defaultConflictPotential(behaviorType),
      repeatability: defaultRepeatability(behaviorType),
    },
  };
  const override = VISIBLE_BEHAVIOR_OVERRIDES[seed];

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override?.metadata,
    },
  };
}

function toStandardVisibleBehaviorVocabularySeed(
  seed: VisibleBehaviorSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Visible behavior type: ${seed.behaviorType}.`,
      `Emotional meaning: ${seed.emotionalMeaning}`,
      `Hidden motivation: ${seed.hiddenMotivation}`,
    ].join(" "),
    examples: [
      ...seed.examples,
      ...seed.fulfillmentSignals,
      ...seed.milestoneMemories,
    ],
    tags: [
      "visible_behavior",
      seed.behaviorType,
      seed.metadata.subtlety,
      seed.metadata.repeatability,
      ...seed.tags,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.loveLanguageSource,
      ...seed.associatedWounds,
      ...seed.associatedFears,
      ...seed.associatedDesires,
      ...seed.associatedDynamics,
    ],
    oppositeSeeds: [
      ...seed.oppositeSeeds,
      ...seed.misreadRisks,
      ...seed.conflictRisks,
    ],
    romanceHooks: [
      ...seed.romanceHooks,
      ...seed.growthArcs,
    ],
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.activatedBy,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: seed.metadata.repeatability === "one_off" ? "uncommon" : "common",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function inferVisibleBehaviorType(seed: string): VisibleBehaviorSeedType {
  for (const [behaviorType, seeds] of Object.entries(visibleBehaviorCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return behaviorType as VisibleBehaviorSeedType;
    }
  }

  return "attention";
}

function visibleBehaviorLabel(seed: string): string {
  const presetLabel = visibleBehaviorPresets.find(
    (preset) => slugifyVisibleBehaviorPreset(preset) === seed,
  );

  return presetLabel ?? seed
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyVisibleBehaviorPreset(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function defaultDescription(
  label: string,
  behaviorType: VisibleBehaviorSeedType,
): string {
  const phrase = behaviorType.replace(/_/g, " ");
  return `${label} is a ${phrase} behavior that turns affection into something the other person can notice in the room, not just infer from intent.`;
}

function defaultExamples(
  label: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  return [
    `${label} gives the relationship a concrete action the other person can remember later.`,
    `The gesture works best when it supports choice instead of asking gratitude as payment.`,
    `In prose, the action should reveal emotion through timing, restraint, and what the character notices first.`,
    `When overused or misread, the same behavior can become pressure, avoidance, or unspoken expectation.`,
  ];
}

function defaultRelatedSeeds(
  seed: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  return [
    `${behaviorType}_visible_behavior`,
    ...defaultLoveLanguageSource(behaviorType),
    `${seed}_memory`,
  ];
}

function defaultOppositeSeeds(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "public_loyalty") {
    return [
      "public_abandonment",
      "silent_complicity",
      "relationship_denial",
    ];
  }
  if (behaviorType === "protective" || behaviorType === "touch") {
    return [
      "care_without_consent",
      "protection_as_control",
      "danger_minimized",
    ];
  }
  return [
    "inconsistent_care",
    "performative_care",
    "needs_ignored",
  ];
}

function defaultRomanceHooks(
  seed: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "communication") {
    return [
      "small_reassurance_lands",
      "private_check_in_scene",
      "voice_softens_before_confession",
    ];
  }
  if (behaviorType === "protective" || behaviorType === "public_loyalty") {
    return [
      "chosen_in_front_of_others",
      "protector_respects_agency",
      "public_loyalty_as_romance",
    ];
  }
  return [
    `${seed}_romance_hook`,
    "ordinary_action_becomes_intimate",
    "care_noticed_after_delay",
  ];
}

function defaultScenarioHooks(
  seed: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "ritual" || behaviorType === "repair") {
    return [
      "missed_ritual_repair",
      "small_promise_kept",
      "ordinary_evening_reconnection",
    ];
  }
  if (behaviorType === "protective" || behaviorType === "public_loyalty") {
    return [
      "public_pressure_scene",
      "danger_or_disapproval_arrives",
      "choice_must_be_visible",
    ];
  }
  return [
    `${seed}_scene`,
    "stress_reveals_affection",
    "care_arrives_before_words",
  ];
}

function defaultDialoguePatterns(
  label: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "communication") {
    return [
      "I noticed.",
      "You went quiet. I did not want to pretend I missed it.",
      "Tell me what would help, not what sounds easiest.",
    ];
  }
  if (behaviorType === "public_loyalty") {
    return [
      "I am not neutral about them.",
      "Say it to both of us, then.",
      "I chose my side before you asked.",
    ];
  }
  return [
    `I did ${label.toLowerCase()} because I wanted the day to hurt less.`,
    "You did not have to ask.",
    "I know. That is why it matters.",
  ];
}

function defaultEmotionalMeaning(behaviorType: VisibleBehaviorSeedType): string {
  const meanings: Record<VisibleBehaviorSeedType, string> = {
    domestic: "I want ordinary life to feel less lonely because I am in it with you.",
    protective: "Your safety matters, and I will not confuse protection with ownership.",
    caretaking: "I noticed the strain and moved toward it instead of away.",
    practical: "Your real life matters to me, not only the romantic version of it.",
    ritual: "I make affection reliable by returning to small repeated proof.",
    reassurance: "I answer the fear before it has to turn into a test.",
    devotional: "I keep my care steady when no one is applauding it.",
    attention: "I pay attention to the details that tell me who you are.",
    touch: "Closeness can be offered gently and refused safely.",
    communication: "I want the truth to have somewhere soft to land.",
    repair: "I am willing to rebuild the small thing, not only apologize for breaking it.",
    public_loyalty: "I choose you where the choice can be witnessed.",
  };

  return meanings[behaviorType];
}

function defaultHiddenMotivation(behaviorType: VisibleBehaviorSeedType): string {
  if (behaviorType === "protective" || behaviorType === "public_loyalty") {
    return "To make care unmistakable without taking the other person's agency away.";
  }
  if (behaviorType === "communication" || behaviorType === "reassurance") {
    return "To reduce guessing before fear has to become conflict.";
  }
  return "To let affection show through a grounded action before the character has perfect words for it.";
}

function defaultLoveLanguageSource(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "domestic" || behaviorType === "caretaking" || behaviorType === "practical") {
    return [
      "acts_of_service",
      "domestic_care",
      "practical_support",
    ];
  }
  if (behaviorType === "ritual" || behaviorType === "reassurance" || behaviorType === "repair") {
    return [
      "consistency",
      "shared_rituals",
      "reassurance",
    ];
  }
  if (behaviorType === "touch" || behaviorType === "protective") {
    return [
      "protective_care",
      "physical_touch",
      "emotional_presence",
    ];
  }
  if (behaviorType === "public_loyalty" || behaviorType === "devotional") {
    return [
      "devotional_loyalty",
      "public_loyalty",
      "words_of_affirmation",
    ];
  }
  return [
    "emotional_presence",
    "private_understanding",
    "quality_time",
  ];
}

function defaultAssociatedWounds(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "protective" || behaviorType === "touch") {
    return [
      "never_protected_wound",
      "touch_starvation_wound",
    ];
  }
  if (behaviorType === "public_loyalty" || behaviorType === "devotional") {
    return [
      "rejection_wound",
      "never_chosen_wound",
    ];
  }
  return [
    "emotional_neglect_wound",
    "conditional_love_wound",
  ];
}

function defaultAssociatedFears(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "ritual" || behaviorType === "reassurance") {
    return [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
    ];
  }
  if (behaviorType === "public_loyalty") {
    return [
      "fear_of_replacement",
      "fear_of_public_shame",
    ];
  }
  return [
    "fear_of_not_mattering",
    "fear_of_being_too_much",
  ];
}

function defaultAssociatedDesires(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "public_loyalty" || behaviorType === "devotional") {
    return [
      "desire_to_be_chosen",
      "desire_for_devotion",
    ];
  }
  if (behaviorType === "protective" || behaviorType === "touch") {
    return [
      "desire_for_safety",
      "desire_to_be_protected_without_control",
    ];
  }
  return [
    "desire_to_be_seen",
    "desire_for_reliable_love",
  ];
}

function defaultAssociatedDynamics(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "protective") {
    return [
      "protector_protected_dynamic",
      "protective_but_free_relationship",
    ];
  }
  if (behaviorType === "public_loyalty" || behaviorType === "devotional") {
    return [
      "devotional_dynamic",
      "chosen_person_dynamic",
    ];
  }
  return [
    "safe_haven_dynamic",
    "mutual_caretaking_dynamic",
  ];
}

function defaultActivatedBy(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "ritual" || behaviorType === "reassurance") {
    return [
      "emotional_distance_trigger",
      "delayed_reply_trigger",
      "goodbye_trigger",
    ];
  }
  if (behaviorType === "protective" || behaviorType === "public_loyalty") {
    return [
      "public_pressure_trigger",
      "threat_arrives",
      "disapproval_trigger",
    ];
  }
  return [
    "stressful_silence",
    "visible_exhaustion",
    "unspoken_need",
  ];
}

function defaultFulfillmentSignals(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "communication") {
    return [
      "truth_is_answered_gently",
      "tone_stays_soft",
      "question_does_not_become_interrogation",
    ];
  }
  return [
    "care_is_accepted_without_fear",
    "body_language_softens",
    "the_action_becomes_remembered",
  ];
}

function defaultMisreadRisks(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "protective") {
    return [
      "protection_misread_as_control",
      "competence_misread_as_condescension",
    ];
  }
  if (behaviorType === "communication") {
    return [
      "check_in_misread_as_pressure",
      "soft_tone_misread_as_pity",
    ];
  }
  return [
    "care_misread_as_obligation",
    "gesture_misread_as_too_small",
  ];
}

function defaultConflictRisks(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "public_loyalty") {
    return [
      "public_choice_creates_fallout",
      "loyalty_becomes_possessive",
    ];
  }
  if (behaviorType === "caretaking" || behaviorType === "practical") {
    return [
      "help_becomes_control",
      "service_replaces_honesty",
    ];
  }
  return [
    "unspoken_expectation_builds",
    "gesture_used_instead_of_repair",
  ];
}

function defaultRepairStyles(
  seed: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "ritual" || behaviorType === "repair") {
    return [
      "ritual_restoration_repair",
      "consistency_repair",
      `${seed}_repair`,
    ];
  }
  if (behaviorType === "public_loyalty") {
    return [
      "public_loyalty_repair",
      "dignity_restoration_repair",
      "devotional_repair",
    ];
  }
  return [
    "acts_of_service_repair",
    "presence_based_repair",
    `${seed}_repair`,
  ];
}

function defaultGrowthArcs(
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "protective" || behaviorType === "public_loyalty") {
    return [
      "learns_protection_without_control",
      "learns_loyalty_with_agency",
    ];
  }
  return [
    "learns_to_make_care_visible",
    "learns_to_receive_care_without_debt",
  ];
}

function defaultRouteGates(
  seed: string,
  behaviorType: VisibleBehaviorSeedType,
): readonly string[] {
  if (behaviorType === "ritual") {
    return [
      "first_reliable_ritual_gate",
      `${seed}_gate`,
    ];
  }
  if (behaviorType === "public_loyalty") {
    return [
      "public_choice_gate",
      "first_loyalty_witnessed_gate",
    ];
  }
  return [
    "first_visible_care_gate",
    `${seed}_gate`,
  ];
}

function defaultMilestoneMemories(seed: string): readonly string[] {
  return [
    `first_${seed}_memory`,
    `${seed}_became_meaningful_memory`,
  ];
}

function defaultSubtlety(
  behaviorType: VisibleBehaviorSeedType,
): VisibleBehaviorSubtlety {
  if (behaviorType === "public_loyalty" || behaviorType === "protective") {
    return "low";
  }
  if (behaviorType === "attention" || behaviorType === "domestic") {
    return "high";
  }
  return "medium";
}

function defaultRepeatability(
  behaviorType: VisibleBehaviorSeedType,
): VisibleBehaviorRepeatability {
  if (behaviorType === "ritual" || behaviorType === "reassurance") {
    return "ritual";
  }
  if (behaviorType === "public_loyalty") {
    return "one_off";
  }
  return "recurring";
}

function defaultRomanceValue(behaviorType: VisibleBehaviorSeedType): number {
  return behaviorType === "public_loyalty" || behaviorType === "devotional" ? 10 : 8;
}

function defaultIntimacyValue(behaviorType: VisibleBehaviorSeedType): number {
  return behaviorType === "communication" || behaviorType === "touch" ? 9 : 8;
}

function defaultHealingValue(behaviorType: VisibleBehaviorSeedType): number {
  return behaviorType === "reassurance" || behaviorType === "repair" ? 10 : 8;
}

function defaultConflictPotential(behaviorType: VisibleBehaviorSeedType): number {
  if (behaviorType === "public_loyalty") {
    return 7;
  }
  if (behaviorType === "protective" || behaviorType === "caretaking") {
    return 5;
  }
  return 3;
}
