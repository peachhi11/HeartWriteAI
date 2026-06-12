import {
  createEmotionalMeaningSeedPreset,
  createVocabularySeedPreset,
  type EmotionalMeaningSeed,
  type EmotionalMeaningSeedInput,
  type EmotionalMeaningSeedType,
  type EmotionalMeaningSubtlety,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const emotionalMeaningSemanticChain = [
  "Wound",
  "Fear",
  "Desire",
  "Hidden Need",
  "Visible Behavior",
  "Emotional Meaning",
  "Misread Meaning",
  "Trigger",
  "Response",
  "Conflict Beat",
  "Repair Style",
  "Growth Arc",
  "Payoff Fantasy",
  "Relationship Identity",
] as const;

export const emotionalMeaningPresets = [
  "I Notice You",
  "You Matter to Me",
  "I Am Not Leaving",
  "You Are Safe With Me",
  "I Choose You",
  "I Remember What You Need",
  "I Want to Help Carry This",
  "You Do Not Have to Earn Care",
  "Your Feelings Matter",
  "I See the Real You",
  "I Respect Your Choice",
  "I Will Come Back",
  "I Am Paying Attention",
  "You Are Not a Burden",
  "You Are Worth the Effort",
  "I Want to Understand",
  "I Am Here Even in Silence",
  "This Relationship Can Survive Conflict",
  "You Can Rest Now",
  "Home Is Here",
] as const;

export const emotionalMeaningExpansionLogic = {
  visible_behavior_to_emotional_meaning: {
    makes_tea_when_worried: [
      "i_notice_you",
      "i_remember_what_you_need",
      "you_do_not_have_to_earn_care",
    ],
    sends_goodnight_text: [
      "i_will_come_back",
      "you_matter_to_me",
      "i_am_not_leaving",
    ],
    publicly_takes_their_side: [
      "i_choose_you",
      "you_are_worth_the_effort",
      "you_matter_to_me",
    ],
    sits_beside_them_in_silence: [
      "i_am_here_even_in_silence",
      "you_are_safe_with_me",
      "your_feelings_matter",
    ],
    respects_boundary: [
      "i_respect_your_choice",
      "you_are_safe_with_me",
      "i_want_to_understand",
    ],
  },
  wound_to_emotional_meaning_need: {
    abandonment_wound: [
      "i_am_not_leaving",
      "i_will_come_back",
      "this_relationship_can_survive_conflict",
    ],
    emotional_neglect_wound: [
      "i_notice_you",
      "your_feelings_matter",
      "i_am_paying_attention",
    ],
    rejection_wound: [
      "i_choose_you",
      "you_matter_to_me",
      "you_are_worth_the_effort",
    ],
    control_wound: [
      "i_respect_your_choice",
      "you_are_safe_with_me",
      "i_want_to_understand",
    ],
    burden_wound: [
      "you_are_not_a_burden",
      "i_want_to_help_carry_this",
      "you_do_not_have_to_earn_care",
    ],
  },
  emotional_meaning_to_repair_style: {
    i_am_not_leaving: [
      "verbal_reassurance_repair",
      "return_and_stay_repair",
      "presence_based_repair",
    ],
    i_respect_your_choice: [
      "boundary_respect_repair",
      "choice_restoration_repair",
      "space_based_repair",
    ],
    your_feelings_matter: [
      "validation_repair",
      "heart_to_heart_repair",
      "emotional_presence_repair",
    ],
    you_are_not_a_burden: [
      "gentle_reassurance_repair",
      "acts_of_service_repair",
      "learning_to_receive_care_repair",
    ],
  },
} as const;

export const emotionalMeaningCategories = {
  attention: [
    "i_notice_you",
    "i_remember_what_you_need",
    "i_am_paying_attention",
  ],
  safety: [
    "you_are_safe_with_me",
  ],
  choice: [
    "i_choose_you",
  ],
  reassurance: [
    "i_am_not_leaving",
    "i_will_come_back",
  ],
  devotion: [
    "you_matter_to_me",
    "you_are_worth_the_effort",
  ],
  care: [
    "i_want_to_help_carry_this",
    "you_do_not_have_to_earn_care",
    "you_are_not_a_burden",
  ],
  respect: [
    "i_respect_your_choice",
  ],
  validation: [
    "your_feelings_matter",
    "i_see_the_real_you",
    "i_want_to_understand",
  ],
  belonging: [
    "home_is_here",
  ],
  repair: [
    "this_relationship_can_survive_conflict",
  ],
  presence: [
    "i_am_here_even_in_silence",
  ],
  home: [
    "you_can_rest_now",
  ],
} as const satisfies Record<EmotionalMeaningSeedType, readonly string[]>;

type EmotionalMeaningOverride = Partial<EmotionalMeaningSeedInput> & {
  label?: string;
};

const EMOTIONAL_MEANING_OVERRIDES: Record<string, EmotionalMeaningOverride> = {
  i_notice_you: {
    description:
      "The emotional meaning that someone is paying attention to small needs, mood shifts, habits, preferences, and quiet distress.",
    examples: [
      "They remember how the other person takes their tea.",
      "They notice tiredness before it is spoken.",
      "They recognize a fake smile.",
    ],
    tags: [
      "emotional_meaning",
      "attention",
      "care",
      "being_seen",
    ],
    relatedSeeds: [
      "desire_to_be_seen",
      "emotional_neglect_wound",
      "notices_mood_changes",
      "private_understanding",
    ],
    oppositeSeeds: [
      "emotional_neglect",
      "being_overlooked",
      "invisibility_wound",
    ],
    romanceHooks: [
      "noticed_without_asking",
      "small_detail_remembered",
      "seen_through_the_mask",
    ],
    scenarioHooks: [
      "late_night_kitchen_scene",
      "after_bad_day",
      "fake_smile_called_out",
    ],
    dialoguePatterns: [
      "You are doing that thing with your hands.",
      "You said you were fine, but you are not.",
      "I noticed.",
    ],
    meaningType: "attention",
    expressedThrough: [
      "remembers_preferences",
      "notices_mood_changes",
      "makes_tea_when_worried",
      "checks_in_privately",
    ],
    oftenMisreadAs: [
      "being_watched",
      "overprotectiveness",
      "nosiness",
    ],
    hiddenNeedMet: [
      "need_to_be_seen",
      "need_to_matter",
      "need_for_emotional_presence",
    ],
    associatedWounds: [
      "emotional_neglect_wound",
      "invisible_person_wound",
      "never_seen_wound",
    ],
    associatedFears: [
      "fear_of_being_forgotten",
      "fear_of_becoming_invisible",
      "fear_of_not_mattering",
    ],
    associatedDesires: [
      "desire_to_be_seen",
      "desire_to_be_understood",
      "desire_to_matter",
    ],
    compatibleLoveLanguages: [
      "acts_of_service",
      "quality_time",
      "emotional_presence",
      "private_understanding",
    ],
    compatibleVisibleBehaviors: [
      "remembers_their_order",
      "notices_mood_changes",
      "privately_checks_their_feelings",
      "makes_tea_when_worried",
    ],
    triggerWhenAbsent: [
      "being_overlooked_trigger",
      "forgotten_preference_trigger",
      "ignored_distress_trigger",
    ],
    likelyResponsesWhenAbsent: [
      "withdrawal_response",
      "self_silencing_response",
      "overfunctioning_response",
    ],
    repairStyles: [
      "validation_repair",
      "presence_based_repair",
      "acts_of_service_repair",
    ],
    growthArcs: [
      "learning_to_be_seen",
      "learning_to_accept_care",
      "learning_to_name_needs",
    ],
    payoffFantasies: [
      "seen_and_still_loved",
      "understood_without_explaining",
      "wanted_without_performance",
    ],
    relationshipIdentities: [
      "privately_known_relationship",
      "safe_haven_relationship",
      "soft_domestic_relationship",
    ],
    routeGates: [
      "first_noticed_gate",
      "first_seen_through_mask_gate",
      "private_understanding_gate",
    ],
    milestoneMemories: [
      "first_time_they_noticed_memory",
      "favorite_preference_remembered_memory",
    ],
    metadata: {
      subtlety: "high",
      romanceValue: 10,
      healingValue: 10,
      conflictPotential: 4,
      intimacyValue: 9,
    },
  },
};

export const EMOTIONAL_MEANING_SEEDS = Object.freeze(
  getUniqueEmotionalMeaningIds().map((seed) =>
    createEmotionalMeaningSeedPreset(buildEmotionalMeaningInput(seed)),
  ),
) satisfies readonly EmotionalMeaningSeed[];

export const EMOTIONAL_MEANING_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  EMOTIONAL_MEANING_SEEDS.map(toStandardEmotionalMeaningVocabularySeed),
) satisfies readonly VocabularySeedPreset[];

export function getEmotionalMeaningSeedsByCategory(
  meaningType: EmotionalMeaningSeedType,
): readonly EmotionalMeaningSeed[] {
  const ids = new Set<string>(emotionalMeaningCategories[meaningType]);
  return EMOTIONAL_MEANING_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getEmotionalMeaningSeedsByType(
  meaningType: EmotionalMeaningSeedType,
): readonly EmotionalMeaningSeed[] {
  return EMOTIONAL_MEANING_SEEDS.filter((seed) => seed.meaningType === meaningType);
}

export function findEmotionalMeaningSeedBySeed(
  seedId: string,
): EmotionalMeaningSeed | undefined {
  return EMOTIONAL_MEANING_SEEDS.find((seed) => seed.seed === seedId);
}

function getUniqueEmotionalMeaningIds(): readonly string[] {
  return Array.from(new Set(Object.values(emotionalMeaningCategories).flat()));
}

function buildEmotionalMeaningInput(seed: string): EmotionalMeaningSeedInput {
  const meaningType = inferEmotionalMeaningType(seed);
  const label = emotionalMeaningLabel(seed);
  const base: EmotionalMeaningSeedInput = {
    seed,
    label,
    description: defaultDescription(label, meaningType),
    examples: defaultExamples(label, meaningType),
    tags: [
      "emotional_meaning",
      meaningType,
      "relationship_engine",
      "subtext_layer",
    ],
    relatedSeeds: defaultRelatedSeeds(seed, meaningType),
    oppositeSeeds: defaultOppositeSeeds(meaningType),
    romanceHooks: defaultRomanceHooks(seed, meaningType),
    scenarioHooks: defaultScenarioHooks(seed, meaningType),
    dialoguePatterns: defaultDialoguePatterns(label, meaningType),
    meaningType,
    expressedThrough: defaultExpressedThrough(meaningType),
    oftenMisreadAs: defaultOftenMisreadAs(meaningType),
    hiddenNeedMet: defaultHiddenNeedMet(meaningType),
    associatedWounds: defaultAssociatedWounds(meaningType),
    associatedFears: defaultAssociatedFears(meaningType),
    associatedDesires: defaultAssociatedDesires(meaningType),
    compatibleLoveLanguages: defaultCompatibleLoveLanguages(meaningType),
    compatibleVisibleBehaviors: defaultCompatibleVisibleBehaviors(meaningType),
    triggerWhenAbsent: defaultTriggerWhenAbsent(meaningType),
    likelyResponsesWhenAbsent: defaultLikelyResponsesWhenAbsent(meaningType),
    repairStyles: defaultRepairStyles(seed, meaningType),
    growthArcs: defaultGrowthArcs(meaningType),
    payoffFantasies: defaultPayoffFantasies(meaningType),
    relationshipIdentities: defaultRelationshipIdentities(meaningType),
    routeGates: defaultRouteGates(seed, meaningType),
    milestoneMemories: defaultMilestoneMemories(seed),
    metadata: {
      category: "emotional_meaning",
      subtlety: defaultSubtlety(meaningType),
      romanceValue: defaultRomanceValue(meaningType),
      healingValue: defaultHealingValue(meaningType),
      conflictPotential: defaultConflictPotential(meaningType),
      intimacyValue: defaultIntimacyValue(meaningType),
    },
  };
  const override = EMOTIONAL_MEANING_OVERRIDES[seed];

  return {
    ...base,
    ...override,
    metadata: {
      ...base.metadata,
      ...override?.metadata,
    },
  };
}

function toStandardEmotionalMeaningVocabularySeed(
  seed: EmotionalMeaningSeed,
): VocabularySeedPreset {
  return createVocabularySeedPreset({
    seed: seed.seed,
    label: seed.label,
    description: [
      seed.description,
      `Emotional meaning type: ${seed.meaningType}.`,
      `Often misread as: ${seed.oftenMisreadAs.slice(0, 3).join(", ")}.`,
      `Hidden need met: ${seed.hiddenNeedMet.slice(0, 2).join(", ")}.`,
    ].join(" "),
    examples: [
      ...seed.examples,
      ...seed.expressedThrough,
      ...seed.milestoneMemories,
    ],
    tags: [
      "emotional_meaning",
      seed.meaningType,
      seed.metadata.subtlety,
      ...seed.tags,
    ],
    relatedSeeds: [
      ...seed.relatedSeeds,
      ...seed.hiddenNeedMet,
      ...seed.associatedWounds,
      ...seed.associatedFears,
      ...seed.associatedDesires,
      ...seed.compatibleLoveLanguages,
      ...seed.compatibleVisibleBehaviors,
    ],
    oppositeSeeds: [
      ...seed.oppositeSeeds,
      ...seed.oftenMisreadAs,
      ...seed.triggerWhenAbsent,
    ],
    romanceHooks: [
      ...seed.romanceHooks,
      ...seed.payoffFantasies,
      ...seed.growthArcs,
    ],
    scenarioHooks: [
      ...seed.scenarioHooks,
      ...seed.routeGates,
    ],
    dialoguePatterns: seed.dialoguePatterns,
    metadata: {
      rarity: seed.metadata.subtlety === "high" ? "uncommon" : "common",
      romanceValue: seed.metadata.romanceValue,
      conflictPotential: seed.metadata.conflictPotential,
    },
  });
}

function inferEmotionalMeaningType(seed: string): EmotionalMeaningSeedType {
  for (const [meaningType, seeds] of Object.entries(emotionalMeaningCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return meaningType as EmotionalMeaningSeedType;
    }
  }

  return "attention";
}

function emotionalMeaningLabel(seed: string): string {
  const presetLabel = emotionalMeaningPresets.find(
    (preset) => slugifyEmotionalMeaningPreset(preset) === seed,
  );

  return presetLabel ?? seed
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugifyEmotionalMeaningPreset(label: string): string {
  return label
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function defaultDescription(
  label: string,
  meaningType: EmotionalMeaningSeedType,
): string {
  const phrase = meaningType.replace(/_/g, " ");
  return `${label} is a ${phrase} meaning that can sit beneath a gesture, sentence, silence, or repair attempt. It gives the route engine the subtext the character may not say plainly.`;
}

function defaultExamples(
  label: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  return [
    `${label} can be expressed through a small behavior whose emotional weight is larger than the action itself.`,
    `When the meaning lands, the character feels less alone inside the ${meaningType.replace(/_/g, " ")} need.`,
    "When the meaning is absent or misread, the same scene can turn into insecurity, withdrawal, or argument.",
    "The healthiest route lets the meaning become clear without forcing a scripted confession.",
  ];
}

function defaultRelatedSeeds(
  seed: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  return [
    `${meaningType}_emotional_meaning`,
    `${seed}_subtext`,
    ...defaultHiddenNeedMet(meaningType).slice(0, 2),
  ];
}

function defaultOppositeSeeds(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "choice" || meaningType === "respect") {
    return [
      "choice_removed",
      "control_disguised_as_care",
      "agency_ignored",
    ];
  }
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "emotional_withdrawal",
      "silent_treatment",
      "inconsistent_return",
    ];
  }
  return [
    "emotional_neglect",
    "meaning_misread",
    "need_unseen",
  ];
}

function defaultRomanceHooks(
  seed: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "public_choice_lands",
      "chosen_without_competing",
      "loyalty_becomes_visible",
    ];
  }
  if (meaningType === "repair") {
    return [
      "conflict_survives_repair",
      "relationship_named_after_rupture",
      "staying_after_argument",
    ];
  }
  return [
    `${seed}_romance_hook`,
    "subtext_finally_understood",
    "small_meaning_lands_softly",
  ];
}

function defaultScenarioHooks(
  seed: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "temporary_separation",
      "post_argument_silence",
      "return_after_distance",
    ];
  }
  if (meaningType === "attention") {
    return [
      "fake_smile_called_out",
      "preference_remembered",
      "quiet_distress_noticed",
    ];
  }
  return [
    `${seed}_scene`,
    "gesture_needs_translation",
    "misread_meaning_conflict",
  ];
}

function defaultDialoguePatterns(
  label: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "respect" || meaningType === "choice") {
    return [
      "I am not choosing for you.",
      "Tell me what you want, not what you think I want to hear.",
      "Your yes matters. So does your no.",
    ];
  }
  if (meaningType === "reassurance") {
    return [
      "I am still here.",
      "This did not make me stop loving you.",
      "You do not have to guess where I went.",
    ];
  }
  return [
    `I meant ${label.toLowerCase()}, even if I did not say it well.`,
    "That was not nothing to me.",
    "I thought you knew. I should have made it clearer.",
  ];
}

function defaultExpressedThrough(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "attention") {
    return [
      "remembers_preferences",
      "notices_mood_changes",
      "privately_checks_their_feelings",
    ];
  }
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "sends_goodnight_text",
      "shows_up_reliably",
      "sits_beside_them_in_silence",
    ];
  }
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "publicly_takes_their_side",
      "keeps_promise_quietly",
      "makes_room_for_them",
    ];
  }
  return [
    "makes_tea_when_worried",
    "softens_voice_for_them",
    "restores_small_ritual",
  ];
}

function defaultOftenMisreadAs(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "attention") {
    return [
      "being_watched",
      "nosiness",
      "overprotectiveness",
    ];
  }
  if (meaningType === "care") {
    return [
      "pity",
      "obligation",
      "control",
    ];
  }
  return [
    "pressure",
    "too_much_intensity",
    "ordinary_kindness",
  ];
}

function defaultHiddenNeedMet(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "attention") {
    return [
      "need_to_be_seen",
      "need_to_matter",
    ];
  }
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "need_for_reassurance",
      "need_for_reliable_return",
    ];
  }
  if (meaningType === "respect" || meaningType === "choice") {
    return [
      "need_for_autonomy",
      "need_for_boundaries",
    ];
  }
  return [
    "need_for_emotional_presence",
    "need_for_unconditional_acceptance",
  ];
}

function defaultAssociatedWounds(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "abandonment_wound",
      "emotional_neglect_wound",
    ];
  }
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "rejection_wound",
      "never_chosen_wound",
    ];
  }
  if (meaningType === "respect") {
    return [
      "control_wound",
      "boundary_violation_wound",
    ];
  }
  return [
    "emotional_neglect_wound",
    "shame_wound",
  ];
}

function defaultAssociatedFears(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "fear_of_abandonment",
      "fear_of_emotional_distance",
    ];
  }
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "fear_of_replacement",
      "fear_of_being_chosen_last",
    ];
  }
  return [
    "fear_of_not_mattering",
    "fear_of_being_too_much",
  ];
}

function defaultAssociatedDesires(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "desire_to_be_chosen",
      "desire_for_devotion",
    ];
  }
  if (meaningType === "home" || meaningType === "belonging") {
    return [
      "desire_for_home",
      "desire_for_belonging",
    ];
  }
  return [
    "desire_to_be_seen",
    "desire_for_safe_love",
  ];
}

function defaultCompatibleLoveLanguages(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "attention" || meaningType === "care") {
    return [
      "acts_of_service",
      "quality_time",
      "private_understanding",
    ];
  }
  if (meaningType === "reassurance") {
    return [
      "words_of_affirmation",
      "consistency",
      "shared_rituals",
    ];
  }
  return [
    "emotional_presence",
    "quality_time",
    "safe_silence",
  ];
}

function defaultCompatibleVisibleBehaviors(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "attention") {
    return [
      "remembers_their_order",
      "notices_mood_changes",
      "makes_tea_when_worried",
    ];
  }
  if (meaningType === "reassurance") {
    return [
      "sends_goodnight_text",
      "shows_up_reliably",
      "waits_until_they_are_inside",
    ];
  }
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "publicly_takes_their_side",
      "keeps_promise_quietly",
      "makes_room_for_them",
    ];
  }
  return [
    "sits_beside_them_in_silence",
    "privately_checks_their_feelings",
    "softens_voice_for_them",
  ];
}

function defaultTriggerWhenAbsent(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "attention") {
    return [
      "being_overlooked_trigger",
      "ignored_distress_trigger",
    ];
  }
  if (meaningType === "reassurance") {
    return [
      "unanswered_message_trigger",
      "goodbye_trigger",
    ];
  }
  return [
    "cold_tone_trigger",
    "misread_meaning_trigger",
  ];
}

function defaultLikelyResponsesWhenAbsent(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "reassurance") {
    return [
      "reassurance_seeking_response",
      "panic_spiral_response",
    ];
  }
  if (meaningType === "respect" || meaningType === "choice") {
    return [
      "boundary_assertion_response",
      "distance_seeking_response",
    ];
  }
  return [
    "withdrawal_response",
    "self_silencing_response",
  ];
}

function defaultRepairStyles(
  seed: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "respect" || meaningType === "choice") {
    return [
      "boundary_respect_repair",
      "choice_restoration_repair",
      `${seed}_repair`,
    ];
  }
  if (meaningType === "reassurance" || meaningType === "presence") {
    return [
      "verbal_reassurance_repair",
      "presence_based_repair",
      `${seed}_repair`,
    ];
  }
  return [
    "validation_repair",
    "heart_to_heart_repair",
    `${seed}_repair`,
  ];
}

function defaultGrowthArcs(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "respect" || meaningType === "choice") {
    return [
      "learning_love_without_control",
      "learning_to_trust_choice",
    ];
  }
  return [
    "learning_to_receive_meaning",
    "learning_to_name_needs",
  ];
}

function defaultPayoffFantasies(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "choice" || meaningType === "devotion") {
    return [
      "chosen_above_everyone",
      "publicly_chosen",
    ];
  }
  if (meaningType === "home" || meaningType === "belonging") {
    return [
      "home_is_a_person",
      "belonging_after_isolation",
    ];
  }
  return [
    "seen_and_still_loved",
    "loved_without_conditions",
  ];
}

function defaultRelationshipIdentities(
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  if (meaningType === "home") {
    return [
      "home_is_a_person_relationship",
      "domestic_happiness_relationship",
    ];
  }
  return [
    "safe_haven_relationship",
    "privately_known_relationship",
  ];
}

function defaultRouteGates(
  seed: string,
  meaningType: EmotionalMeaningSeedType,
): readonly string[] {
  return [
    `first_${meaningType}_meaning_gate`,
    `${seed}_gate`,
  ];
}

function defaultMilestoneMemories(seed: string): readonly string[] {
  return [
    `first_${seed}_memory`,
    `${seed}_understood_memory`,
  ];
}

function defaultSubtlety(
  meaningType: EmotionalMeaningSeedType,
): EmotionalMeaningSubtlety {
  if (meaningType === "attention" || meaningType === "presence") {
    return "high";
  }
  if (meaningType === "choice" || meaningType === "devotion") {
    return "low";
  }
  return "medium";
}

function defaultRomanceValue(meaningType: EmotionalMeaningSeedType): number {
  return meaningType === "choice" || meaningType === "devotion" ? 10 : 8;
}

function defaultHealingValue(meaningType: EmotionalMeaningSeedType): number {
  return meaningType === "repair" || meaningType === "safety" ? 10 : 8;
}

function defaultConflictPotential(meaningType: EmotionalMeaningSeedType): number {
  if (meaningType === "choice" || meaningType === "respect") {
    return 7;
  }
  if (meaningType === "attention") {
    return 4;
  }
  return 5;
}

function defaultIntimacyValue(meaningType: EmotionalMeaningSeedType): number {
  return meaningType === "presence" || meaningType === "home" ? 10 : 8;
}
