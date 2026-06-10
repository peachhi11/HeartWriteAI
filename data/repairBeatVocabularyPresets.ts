import {
  createRepairBeatSeedPreset,
  createVocabularySeedPreset,
  type RepairBeatSeed,
  type RepairBeatSeedInput,
  type RepairBeatSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export const repairBeatSemanticChain = [
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
  "Repair Beat",
  "Repair Arc",
  "Milestone Memory",
  "Growth Arc",
] as const;

export const repairBeatPresets = [
  "First Apology Beat",
  "Clarification Beat",
  "Validation Beat",
  "Accountability Beat",
  "No Excuses Beat",
  "Truth Comes Out Beat",
  "Changed Behavior Beat",
  "Promise Kept Beat",
  "Return After Leaving Beat",
  "I Am Not Leaving Beat",
  "Space With Return Beat",
  "Boundary Respected Beat",
  "Choice Restored Beat",
  "Private Comfort Beat",
  "Dignity Restored Beat",
  "Public Loyalty Beat",
  "Reassurance After Fear Beat",
  "Safe Touch Offered Beat",
  "Shared Silence Beat",
  "Ritual Restored Beat",
  "Small Gesture Beat",
  "Acts of Service Beat",
  "Heart-to-Heart Beat",
  "Mutual Responsibility Beat",
  "Forgiveness Offered Beat",
  "Forgiveness Not Yet Beat",
  "Trust Rebuilding Beat",
  "Recommitment Beat",
  "Symbolic Repair Beat",
  "New Pattern Begins Beat",
] as const;

export const repairBeatExpansionLogic = {
  consequence_to_repair_beat: {
    trust_damage_consequence: [
      "accountability_beat",
      "truth_comes_out_beat",
      "changed_behavior_beat",
      "promise_kept_beat",
    ],
    attachment_damage_consequence: [
      "return_after_leaving_beat",
      "i_am_not_leaving_beat",
      "reassurance_after_fear_beat",
      "ritual_restored_beat",
    ],
    emotional_safety_damage_consequence: [
      "validation_beat",
      "boundary_respected_beat",
      "safe_touch_offered_beat",
      "private_comfort_beat",
    ],
    vulnerability_shutdown_consequence: [
      "shared_silence_beat",
      "heart_to_heart_beat",
      "space_with_return_beat",
      "safe_touch_offered_beat",
    ],
    boundary_hardening_consequence: [
      "boundary_respected_beat",
      "choice_restored_beat",
      "space_with_return_beat",
    ],
    relationship_identity_damage: [
      "recommitment_beat",
      "symbolic_repair_beat",
      "new_pattern_begins_beat",
    ],
  },
  rupture_to_repair_beat: {
    abandonment_rupture: [
      "return_after_leaving_beat",
      "i_am_not_leaving_beat",
      "space_with_return_beat",
    ],
    betrayal_rupture: [
      "truth_comes_out_beat",
      "accountability_beat",
      "trust_rebuilding_beat",
    ],
    broken_promise_rupture: [
      "promise_kept_beat",
      "changed_behavior_beat",
      "new_pattern_begins_beat",
    ],
    humiliation_rupture: [
      "dignity_restored_beat",
      "private_comfort_beat",
      "public_loyalty_beat",
    ],
    boundary_violation_rupture: [
      "boundary_respected_beat",
      "choice_restored_beat",
      "no_excuses_beat",
    ],
  },
  repair_style_to_repair_beat: {
    verbal_reassurance_repair: [
      "reassurance_after_fear_beat",
      "i_am_not_leaving_beat",
      "clarification_beat",
    ],
    accountability_repair: [
      "accountability_beat",
      "no_excuses_beat",
      "changed_behavior_beat",
    ],
    presence_based_repair: [
      "shared_silence_beat",
      "return_after_leaving_beat",
      "private_comfort_beat",
    ],
    ritual_repair: [
      "ritual_restored_beat",
      "small_gesture_beat",
      "new_pattern_begins_beat",
    ],
    devotional_repair: [
      "public_loyalty_beat",
      "recommitment_beat",
      "symbolic_repair_beat",
    ],
  },
} as const;

export const repairBeatCategories = {
  apology: [
    "first_apology_beat",
  ],
  clarification: [
    "clarification_beat",
  ],
  validation: [
    "validation_beat",
  ],
  accountability: [
    "accountability_beat",
    "no_excuses_beat",
  ],
  truth: [
    "truth_comes_out_beat",
  ],
  behavior_change: [
    "changed_behavior_beat",
    "promise_kept_beat",
  ],
  return: [
    "return_after_leaving_beat",
    "i_am_not_leaving_beat",
    "space_with_return_beat",
  ],
  boundary: [
    "boundary_respected_beat",
    "choice_restored_beat",
  ],
  comfort: [
    "private_comfort_beat",
    "shared_silence_beat",
  ],
  dignity: [
    "dignity_restored_beat",
  ],
  loyalty: [
    "public_loyalty_beat",
  ],
  reassurance: [
    "reassurance_after_fear_beat",
  ],
  touch: [
    "safe_touch_offered_beat",
  ],
  ritual: [
    "ritual_restored_beat",
    "small_gesture_beat",
  ],
  service: [
    "acts_of_service_beat",
  ],
  vulnerability: [
    "heart_to_heart_beat",
    "mutual_responsibility_beat",
  ],
  forgiveness: [
    "forgiveness_offered_beat",
    "forgiveness_not_yet_beat",
  ],
  recommitment: [
    "recommitment_beat",
    "trust_rebuilding_beat",
  ],
  symbolic: [
    "symbolic_repair_beat",
  ],
  growth: [
    "new_pattern_begins_beat",
  ],
} as const satisfies Record<RepairBeatSeedType, readonly string[]>;

type RepairBeatOverride = Partial<RepairBeatSeedInput> & {
  label?: string;
};

const REPAIR_BEAT_OVERRIDES: Record<string, RepairBeatOverride> = {
  accountability_beat: {
    label: "Accountability Beat",
    description:
      "A repair beat where the character names what they did, accepts responsibility, and stops defending the harm.",
    examples: [
      "They admit the lie without minimizing it.",
      "They name the exact promise they broke.",
      "They stop explaining long enough to acknowledge the hurt.",
    ],
    tags: ["repair_beat", "accountability", "trust_repair", "rupture_aftermath"],
    relatedSeeds: [
      "accountability_repair",
      "trust_damage_consequence",
      "betrayal_rupture",
      "changed_behavior_beat",
    ],
    oppositeSeeds: [
      "blame_shifting",
      "excuse_making",
      "repair_bypassing",
    ],
    romanceHooks: [
      "owning_the_hurt",
      "trust_rebuild_begins",
      "words_become_evidence",
    ],
    scenarioHooks: [
      "after_the_lie",
      "broken_promise_aftermath",
      "post_argument_repair",
    ],
    dialoguePatterns: [
      "That was on me.",
      "I hurt you. I am not going to dress it up.",
      "You do not have to forgive me just because I finally understand.",
    ],
    beatType: "accountability",
    emotionalFunction:
      "Stops the rupture from being denied and creates the first believable ground for repair.",
    repairQuestion:
      "Can the person who caused harm face it without making the hurt partner carry it?",
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
    compatibleRepairStyles: [
      "accountability_repair",
      "truth_and_accountability_repair",
      "behavior_change_repair",
    ],
    requiredConditions: [
      "specific_admission",
      "no_defensiveness",
      "no_forced_forgiveness",
      "willingness_to_change",
    ],
    likelyResistance: [
      "shame_spiral",
      "defensiveness",
      "fear_of_losing_relationship",
      "urge_to_explain",
    ],
    failureModes: [
      "apology_used_to_end_conversation",
      "accountability_without_change",
      "self_punishment_instead_of_repair",
    ],
    successSignals: [
      "hurt_is_named_correctly",
      "partner_does_not_have_to_argue_their_pain",
      "changed_behavior_plan_exists",
    ],
    relationshipEffects: [
      "opens_repair_path",
      "reduces_gaslighting_risk",
      "makes_trust_rebuilding_possible",
    ],
    milestoneMemories: [
      "first_real_accountability_memory",
      "repair_begins_memory",
    ],
    growthPotential: [
      "learns_accountability_without_collapse",
      "builds_repair_capacity",
      "separates_guilt_from_changed_behavior",
    ],
    metadata: {
      category: "repair_beat",
      intensity: "high",
      repairPower: 9,
      trustRepairValue: 10,
      attachmentRepairValue: 7,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
  i_am_not_leaving_beat: {
    beatType: "return",
    dialoguePatterns: [
      "I am not leaving because this is hard.",
      "We can pause. I am still coming back.",
    ],
    repairsConsequences: ["attachment_damage_consequence"],
    repairsRuptures: ["abandonment_rupture"],
    compatibleRepairStyles: ["verbal_reassurance_repair", "presence_based_repair"],
    successSignals: ["return_is_clear", "connection_survives_conflict"],
  },
  boundary_respected_beat: {
    beatType: "boundary",
    dialoguePatterns: [
      "No does not make me care less.",
      "Your boundary still matters when I am hurt.",
    ],
    repairsConsequences: ["boundary_hardening_consequence"],
    repairsRuptures: ["boundary_violation_rupture"],
    compatibleRepairStyles: ["space_based_repair", "accountability_repair"],
    successSignals: ["boundary_holds", "closeness_remains_possible"],
  },
  safe_touch_offered_beat: {
    beatType: "touch",
    dialoguePatterns: [
      "Can I hold your hand?",
      "Only if you want me close.",
    ],
    repairsConsequences: [
      "emotional_safety_damage_consequence",
      "vulnerability_shutdown_consequence",
    ],
    compatibleRepairStyles: ["physical_comfort_repair", "presence_based_repair"],
    requiredConditions: ["consent_checked", "touch_is_optional"],
  },
  promise_kept_beat: {
    beatType: "behavior_change",
    dialoguePatterns: [
      "I said I would be here.",
      "I wanted the promise to become evidence.",
    ],
    repairsConsequences: ["trust_damage_consequence"],
    repairsRuptures: ["broken_promise_rupture"],
    compatibleRepairStyles: ["behavior_change_repair", "ritual_repair"],
    successSignals: ["follow_through_visible", "words_gain_evidence"],
  },
};

export const REPAIR_BEAT_SEEDS = Object.freeze(
  getUniqueRepairBeatIds().map((seed) =>
    createRepairBeatSeedPreset(buildRepairBeatInput(seed)),
  ),
) satisfies readonly RepairBeatSeed[];

export const REPAIR_BEAT_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  REPAIR_BEAT_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional function: ${seed.emotionalFunction}.`,
        `Repair question: ${seed.repairQuestion}.`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.successSignals.slice(0, 2),
      ],
      tags: [
        "repair_beat",
        seed.beatType,
        ...seed.tags,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.repairsConsequences,
        ...seed.repairsRuptures,
        ...seed.compatibleRepairStyles,
        ...seed.growthPotential,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.failureModes,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.requiredConditions,
        ...seed.milestoneMemories,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "low" ? "common" : "uncommon",
        romanceValue: seed.metadata.repairPower,
        conflictPotential: seed.metadata.trustRepairValue,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function getRepairBeatSeedsByCategory(
  beatType: RepairBeatSeedType,
): readonly RepairBeatSeed[] {
  const ids = new Set<string>(repairBeatCategories[beatType]);
  return REPAIR_BEAT_SEEDS.filter((seed) => ids.has(seed.seed));
}

export function getRepairBeatSeedsByType(
  beatType: RepairBeatSeedType,
): readonly RepairBeatSeed[] {
  return REPAIR_BEAT_SEEDS.filter((seed) => seed.beatType === beatType);
}

export function findRepairBeatSeedBySeed(
  seedId: string,
): RepairBeatSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return REPAIR_BEAT_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

function getUniqueRepairBeatIds(): readonly string[] {
  return Array.from(new Set(Object.values(repairBeatCategories).flat()));
}

function buildRepairBeatInput(seed: string): RepairBeatSeedInput {
  const beatType = inferRepairBeatType(seed);
  const label = repairBeatLabel(seed);
  const override = REPAIR_BEAT_OVERRIDES[seed] ?? {};
  const base: RepairBeatSeedInput = {
    seed,
    label,
    description:
      `A repair beat where the relationship practices ${label.toLowerCase()} after rupture, conflict, or emotional misattunement.`,
    examples: [
      "The beat turns repair into a visible scene instead of a vague intention.",
      "The relationship changes through a specific action, sentence, or return.",
    ],
    tags: ["repair_beat", beatType, seed],
    relatedSeeds: defaultRelatedSeeds(beatType),
    oppositeSeeds: defaultOppositeSeeds(beatType),
    romanceHooks: [`${seed}_romance_repair`, `${beatType}_repair_intimacy`],
    scenarioHooks: [`${seed}_scene`, `${seed}_aftermath`],
    dialoguePatterns: defaultDialoguePatterns(beatType),
    beatType,
    emotionalFunction: defaultEmotionalFunction(beatType),
    repairQuestion: defaultRepairQuestion(beatType),
    repairsConsequences: defaultRepairsConsequences(beatType),
    repairsRuptures: defaultRepairsRuptures(beatType),
    compatibleRepairStyles: defaultCompatibleRepairStyles(beatType),
    requiredConditions: defaultRequiredConditions(beatType),
    likelyResistance: defaultLikelyResistance(beatType),
    failureModes: defaultFailureModes(beatType),
    successSignals: defaultSuccessSignals(beatType),
    relationshipEffects: defaultRelationshipEffects(beatType),
    milestoneMemories: [`${seed}_memory`, `${seed}_proof_memory`],
    growthPotential: defaultGrowthPotential(beatType),
    metadata: {
      category: "repair_beat",
      intensity: defaultIntensity(beatType),
      repairPower: defaultRepairPower(beatType),
      trustRepairValue: defaultTrustRepairValue(beatType),
      attachmentRepairValue: defaultAttachmentRepairValue(beatType),
      healingValue: defaultHealingValue(beatType),
      pacingPressure: defaultPacingPressure(beatType),
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

function inferRepairBeatType(seed: string): RepairBeatSeedType {
  for (const [beatType, seeds] of Object.entries(repairBeatCategories)) {
    if ((seeds as readonly string[]).includes(seed)) {
      return beatType as RepairBeatSeedType;
    }
  }

  return "growth";
}

function repairBeatLabel(seed: string): string {
  return seed
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .replace(" I Am ", " I Am ")
    .replace(" To ", " to ");
}

function defaultRelatedSeeds(beatType: RepairBeatSeedType): readonly string[] {
  return [
    ...defaultRepairsConsequences(beatType),
    ...defaultRepairsRuptures(beatType),
    ...defaultCompatibleRepairStyles(beatType),
  ];
}

function defaultOppositeSeeds(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "apology":
      return ["non_apology", "dismissive_apology"];
    case "clarification":
      return ["assumption_loop", "miscommunication_spiral"];
    case "validation":
      return ["emotional_minimizing", "hurt_denial"];
    case "accountability":
      return ["blame_shifting", "excuse_making"];
    case "truth":
      return ["withheld_truth", "protective_lie"];
    case "behavior_change":
      return ["empty_promise", "performative_repair"];
    case "return":
      return ["abandonment_rupture", "disappearing_after_conflict"];
    case "boundary":
      return ["boundary_violation", "pressure_after_no"];
    case "comfort":
      return ["cold_aftermath", "emotional_abandonment"];
    case "dignity":
      return ["humiliation", "public_shaming"];
    case "loyalty":
      return ["public_disloyalty", "chosen_last"];
    case "reassurance":
      return ["ambiguous_affection", "hot_cold_affection"];
    case "touch":
      return ["unwanted_touch", "comfort_without_consent"];
    case "ritual":
      return ["ritual_disruption", "inconsistent_return"];
    case "service":
      return ["care_without_follow_through", "transactional_help"];
    case "vulnerability":
      return ["deflection_response", "emotional_lockdown"];
    case "forgiveness":
      return ["forced_forgiveness", "permanent_punishment"];
    case "recommitment":
      return ["relationship_ambiguity", "commitment_panic"];
    case "symbolic":
      return ["empty_symbol", "gesture_without_change"];
    case "growth":
      return ["old_pattern_repeats", "repair_without_learning"];
  }
}

function defaultDialoguePatterns(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "apology":
      return ["I am sorry.", "I know those words are only the beginning."];
    case "clarification":
      return ["That is not what I meant, but I understand why it landed that way."];
    case "validation":
      return ["You are not overreacting.", "That hurt made sense."];
    case "accountability":
      return ["That was on me.", "I will not make you argue me into understanding."];
    case "truth":
      return ["Here is the truth I should have trusted you with sooner."];
    case "behavior_change":
      return ["I know words are not enough.", "Watch what I do next."];
    case "return":
      return ["I came back.", "Space was not an exit."];
    case "boundary":
      return ["Your no still matters to me.", "I can hear it without punishing you."];
    case "comfort":
      return ["We do not have to solve it this second.", "I can sit here with you."];
    case "dignity":
      return ["You did not deserve to be made small.", "I should have protected that."];
    case "loyalty":
      return ["I should have stood beside you where everyone could see."];
    case "reassurance":
      return ["This did not change how I feel.", "You still matter to me."];
    case "touch":
      return ["Can I touch you?", "Only if it helps."];
    case "ritual":
      return ["I made your tea.", "I did not want our small things to vanish."];
    case "service":
      return ["I handled what I could.", "You should not have had to carry it alone."];
    case "vulnerability":
      return ["I was scared.", "That is not an excuse, but it is the honest answer."];
    case "forgiveness":
      return ["You do not owe me forgiveness on my schedule."];
    case "recommitment":
      return ["I am choosing this again, with my eyes open."];
    case "symbolic":
      return ["This is not enough by itself. I know that.", "It is a place to begin."];
    case "growth":
      return ["Let this be the part where the pattern changes."];
  }
}

function defaultEmotionalFunction(beatType: RepairBeatSeedType): string {
  switch (beatType) {
    case "apology":
      return "Opens repair by naming remorse without demanding immediate forgiveness.";
    case "clarification":
      return "Separates intent from impact so the hurt can be understood accurately.";
    case "validation":
      return "Makes the injured person stop carrying the burden of proving their pain.";
    case "accountability":
      return "Moves the rupture from denial into responsible repair.";
    case "truth":
      return "Restores reality by bringing hidden information into the relationship.";
    case "behavior_change":
      return "Turns repair into evidence through consistent action.";
    case "return":
      return "Shows that distance, conflict, or fear did not become abandonment.";
    case "boundary":
      return "Repairs agency by respecting limits without retaliation.";
    case "comfort":
      return "Restores emotional safety through calm presence and private tenderness.";
    case "dignity":
      return "Returns respect after shame, exposure, or public harm.";
    case "loyalty":
      return "Makes allegiance visible where ambiguity caused damage.";
    case "reassurance":
      return "Settles attachment fear by clearly reaffirming the bond.";
    case "touch":
      return "Uses consent-checked closeness as grounding rather than pressure.";
    case "ritual":
      return "Rebuilds continuity through a small shared pattern returning.";
    case "service":
      return "Makes care practical, observable, and non-transactional.";
    case "vulnerability":
      return "Lets repair deepen through honest emotional exposure.";
    case "forgiveness":
      return "Names whether forgiveness is available, delayed, or still being earned.";
    case "recommitment":
      return "Renames the relationship after rupture and chooses the bond again.";
    case "symbolic":
      return "Gives repair a memorable object, gesture, or visible proof.";
    case "growth":
      return "Marks the first concrete step into a healthier pattern.";
  }
}

function defaultRepairQuestion(beatType: RepairBeatSeedType): string {
  switch (beatType) {
    case "apology":
      return "Can remorse be offered without making forgiveness the price of peace?";
    case "clarification":
      return "Can they understand each other without rewriting the hurt?";
    case "validation":
      return "Can pain be believed before it is explained perfectly?";
    case "accountability":
      return "Can harm be faced without defensiveness?";
    case "truth":
      return "Can the relationship survive a truth that should have come sooner?";
    case "behavior_change":
      return "Can action make repair more credible than promises?";
    case "return":
      return "Can leaving the room stop meaning leaving the bond?";
    case "boundary":
      return "Can closeness survive a clear no?";
    case "comfort":
      return "Can care arrive without solving, rushing, or taking over?";
    case "dignity":
      return "Can respect be restored after shame?";
    case "loyalty":
      return "Can public action repair private doubt?";
    case "reassurance":
      return "Can the frightened part of the bond be answered plainly?";
    case "touch":
      return "Can physical comfort remain chosen and safe?";
    case "ritual":
      return "Can one restored habit prove the relationship is still alive?";
    case "service":
      return "Can practical help show love without becoming control?";
    case "vulnerability":
      return "Can honesty become a bridge instead of a weapon?";
    case "forgiveness":
      return "Can forgiveness be handled honestly, including when it is not ready?";
    case "recommitment":
      return "Can they choose the relationship again with more truth than before?";
    case "symbolic":
      return "Can a visible gesture hold meaning without replacing change?";
    case "growth":
      return "Can repair become a new pattern rather than a single scene?";
  }
}

function defaultRepairsConsequences(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "apology":
    case "accountability":
    case "truth":
    case "behavior_change":
      return ["trust_damage_consequence"];
    case "return":
    case "reassurance":
    case "ritual":
      return ["attachment_damage_consequence"];
    case "validation":
    case "comfort":
    case "touch":
      return ["emotional_safety_damage_consequence"];
    case "boundary":
      return ["boundary_hardening_consequence"];
    case "dignity":
    case "loyalty":
      return ["relationship_identity_damage"];
    case "clarification":
    case "vulnerability":
      return ["vulnerability_shutdown_consequence"];
    case "service":
    case "symbolic":
    case "growth":
    case "recommitment":
      return ["relationship_identity_damage"];
    case "forgiveness":
      return ["resentment_build_up_consequence"];
  }
}

function defaultRepairsRuptures(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "apology":
    case "accountability":
    case "truth":
      return ["betrayal_rupture"];
    case "behavior_change":
    case "ritual":
    case "growth":
      return ["broken_promise_rupture"];
    case "return":
    case "reassurance":
      return ["abandonment_rupture"];
    case "boundary":
    case "touch":
      return ["boundary_violation_rupture"];
    case "dignity":
    case "loyalty":
      return ["humiliation_rupture"];
    case "clarification":
    case "validation":
    case "comfort":
    case "service":
    case "vulnerability":
    case "forgiveness":
    case "recommitment":
    case "symbolic":
      return ["emotional_safety_rupture"];
  }
}

function defaultCompatibleRepairStyles(
  beatType: RepairBeatSeedType,
): readonly string[] {
  switch (beatType) {
    case "apology":
    case "clarification":
    case "validation":
      return ["verbal_repair"];
    case "accountability":
    case "truth":
    case "behavior_change":
      return ["accountability_repair", "behavior_change_repair"];
    case "return":
    case "comfort":
    case "reassurance":
      return ["presence_based_repair", "verbal_reassurance_repair"];
    case "boundary":
      return ["space_based_repair", "accountability_repair"];
    case "dignity":
    case "loyalty":
    case "recommitment":
      return ["devotional_repair"];
    case "touch":
      return ["physical_comfort_repair"];
    case "ritual":
    case "symbolic":
    case "growth":
      return ["ritual_repair"];
    case "service":
      return ["acts_of_service_repair"];
    case "vulnerability":
      return ["vulnerability_repair"];
    case "forgiveness":
      return ["forgiveness_repair", "accountability_repair"];
  }
}

function defaultRequiredConditions(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "touch":
      return ["consent_checked", "no_pressure"];
    case "boundary":
      return ["boundary_named", "no_retaliation"];
    case "accountability":
    case "truth":
    case "behavior_change":
      return ["specificity", "no_defensiveness"];
    case "forgiveness":
      return ["no_forced_forgiveness", "time_allowed"];
    case "return":
      return ["return_is_explicit", "space_is_not_used_as_punishment"];
    default:
      return ["emotional_safety", "repair_not_rushed"];
  }
}

function defaultLikelyResistance(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "accountability":
    case "truth":
      return ["shame_spiral", "urge_to_explain"];
    case "boundary":
    case "return":
      return ["fear_of_rejection", "fear_of_loss"];
    case "forgiveness":
      return ["resentment", "fear_of_excusing_harm"];
    case "vulnerability":
      return ["fear_of_exposure", "deflection"];
    default:
      return ["defensiveness", "awkwardness"];
  }
}

function defaultFailureModes(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "apology":
      return ["apology_without_specificity", "forgiveness_pressure"];
    case "behavior_change":
      return ["promise_without_follow_through"];
    case "touch":
      return ["touch_used_to_bypass_words"];
    case "service":
      return ["help_used_as_control"];
    case "symbolic":
      return ["gesture_without_change"];
    default:
      return [`${beatType}_repair_bypassing`, "repair_rushed"];
  }
}

function defaultSuccessSignals(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "apology":
      return ["harm_named", "no_forgiveness_demand"];
    case "clarification":
      return ["meaning_clarified", "impact_acknowledged"];
    case "validation":
      return ["hurt_believed", "defensiveness_lowers"];
    case "accountability":
      return ["responsibility_accepted", "change_plan_visible"];
    case "truth":
      return ["truth_complete_enough", "secrecy_ends"];
    case "behavior_change":
      return ["follow_through_visible", "new_pattern_repeats"];
    case "return":
      return ["return_happens", "absence_explained"];
    case "boundary":
      return ["boundary_respected", "connection_remains"];
    case "comfort":
      return ["nervous_system_settles", "care_is_not_rushed"];
    case "dignity":
      return ["respect_restored", "shame_reduces"];
    case "loyalty":
      return ["public_side_taken", "ambiguity_reduces"];
    case "reassurance":
      return ["bond_reaffirmed", "fear_named_gently"];
    case "touch":
      return ["touch_is_chosen", "comfort_lands"];
    case "ritual":
      return ["ritual_returns", "continuity_felt"];
    case "service":
      return ["burden_reduced", "help_respects_agency"];
    case "vulnerability":
      return ["truth_shared", "softness_survives"];
    case "forgiveness":
      return ["forgiveness_timed_honestly", "hurt_not_erased"];
    case "recommitment":
      return ["relationship_renamed", "future_choice_visible"];
    case "symbolic":
      return ["symbol_has_context", "gesture_tied_to_change"];
    case "growth":
      return ["old_pattern_interrupts", "new_pattern_named"];
  }
}

function defaultRelationshipEffects(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "return":
    case "reassurance":
      return ["increases_attachment_security", "reduces_abandonment_pressure"];
    case "accountability":
    case "truth":
    case "behavior_change":
      return ["makes_trust_rebuilding_possible", "lowers_denial_pressure"];
    case "boundary":
      return ["makes_conflict_safer", "keeps_agency_visible"];
    case "comfort":
    case "touch":
      return ["restores_emotional_safety", "supports_vulnerability"];
    default:
      return ["opens_repair_path", "creates_milestone_memory"];
  }
}

function defaultGrowthPotential(beatType: RepairBeatSeedType): readonly string[] {
  switch (beatType) {
    case "return":
    case "reassurance":
      return ["learning_secure_attachment", "learning_to_stay"];
    case "accountability":
    case "truth":
    case "behavior_change":
      return ["learning_repair", "learning_to_trust"];
    case "boundary":
      return ["learning_boundaries", "learning_autonomy"];
    case "comfort":
    case "touch":
      return ["learning_to_accept_care", "learning_vulnerability"];
    case "forgiveness":
      return ["learning_forgiveness", "learning_self_forgiveness"];
    case "service":
      return ["learning_mutuality", "learning_consistency"];
    default:
      return ["learning_repair"];
  }
}

function defaultIntensity(
  beatType: RepairBeatSeedType,
): "low" | "medium" | "high" | "peak" {
  switch (beatType) {
    case "accountability":
    case "truth":
    case "recommitment":
      return "high";
    case "growth":
      return "peak";
    case "ritual":
    case "service":
    case "symbolic":
      return "low";
    default:
      return "medium";
  }
}

function defaultRepairPower(beatType: RepairBeatSeedType): number {
  return beatType === "growth" ||
    beatType === "recommitment" ||
    beatType === "accountability"
    ? 9
    : 7;
}

function defaultTrustRepairValue(beatType: RepairBeatSeedType): number {
  return beatType === "truth" ||
    beatType === "behavior_change" ||
    beatType === "accountability"
    ? 10
    : 7;
}

function defaultAttachmentRepairValue(beatType: RepairBeatSeedType): number {
  return beatType === "return" || beatType === "reassurance" ? 10 : 7;
}

function defaultHealingValue(beatType: RepairBeatSeedType): number {
  return beatType === "comfort" ||
    beatType === "touch" ||
    beatType === "forgiveness" ||
    beatType === "growth"
    ? 9
    : 7;
}

function defaultPacingPressure(
  beatType: RepairBeatSeedType,
): "low" | "medium" | "high" {
  return beatType === "accountability" ||
    beatType === "truth" ||
    beatType === "recommitment"
    ? "high"
    : beatType === "ritual" || beatType === "service"
      ? "low"
      : "medium";
}
