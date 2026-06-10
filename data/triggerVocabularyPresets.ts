import {
  createTriggerSeedPreset,
  createVocabularySeedPreset,
  type TriggerSeed,
  type TriggerSeedIntensity,
  type TriggerSeedPacingPressure,
  type TriggerSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type TriggerCategory =
  | "attachment"
  | "rejection"
  | "betrayal"
  | "shame"
  | "control"
  | "safety"
  | "romantic"
  | "sensory"
  | "care"
  | "vulnerability";

type TriggerProfile = {
  triggerType: TriggerSeedType;
  examples: readonly string[];
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  activatesWounds: readonly string[];
  activatesFears: readonly string[];
  activatesDesires: readonly string[];
  likelyResponses: readonly string[];
  emotionalMeaning: string;
  misreadAs: readonly string[];
  actualNeutralMeaning: readonly string[];
  earlySigns: readonly string[];
  escalationPath: readonly string[];
  deescalationNeeds: readonly string[];
  repairMethods: readonly string[];
  growthArcs: readonly string[];
  metadata: {
    intensity: TriggerSeedIntensity;
    romanceValue: number;
    angstValue: number;
    conflictPotential: number;
    healingValue: number;
    pacingPressure: TriggerSeedPacingPressure;
  };
};

type TriggerOverride = Partial<TriggerProfile> & {
  label?: string;
  description?: string;
  routeGates?: readonly string[];
};

export const triggerSeedPresets = [
  "Unanswered Message Trigger",
  "Cancelled Plan Trigger",
  "Goodbye Trigger",
  "Emotional Distance Trigger",
  "Delayed Reply Trigger",
  "Broken Promise Trigger",
  "Secret Revealed Trigger",
  "Old Betrayal Reminder",
  "Rival Attention Trigger",
  "Being Compared Trigger",
  "Being Forgotten Trigger",
  "Being Overlooked Trigger",
  "Public Embarrassment Trigger",
  "Criticism Trigger",
  "Disapproval Trigger",
  "Being Controlled Trigger",
  "Loss of Choice Trigger",
  "Unexpected Touch Trigger",
  "Raised Voice Trigger",
  "Sudden Silence Trigger",
  "Being Needed Trigger",
  "Receiving Care Trigger",
  "Being Chosen Trigger",
  "Safe Touch Trigger",
  "Too Much Kindness Trigger",
] as const;

export const triggerCategories = {
  attachment: [
    "unanswered_message_trigger",
    "cancelled_plan_trigger",
    "goodbye_trigger",
    "emotional_distance_trigger",
    "delayed_reply_trigger",
    "temporary_separation_trigger",
  ],
  rejection: [
    "being_overlooked_trigger",
    "being_ignored_trigger",
    "being_chosen_last_trigger",
    "romantic_ambiguity_trigger",
    "cold_tone_trigger",
    "being_forgotten_trigger",
  ],
  betrayal: [
    "broken_promise_trigger",
    "secret_revealed_trigger",
    "hidden_agenda_trigger",
    "old_betrayal_reminder",
    "protective_lie_trigger",
  ],
  shame: [
    "public_embarrassment_trigger",
    "criticism_trigger",
    "mockery_trigger",
    "being_seen_failing_trigger",
    "vulnerability_exposed_trigger",
  ],
  control: [
    "being_ordered_trigger",
    "loss_of_choice_trigger",
    "forced_role_trigger",
    "possessive_pressure_trigger",
    "boundary_ignored_trigger",
  ],
  safety: [
    "raised_voice_trigger",
    "sudden_silence_trigger",
    "unexpected_touch_trigger",
    "door_slam_trigger",
    "crowded_room_trigger",
  ],
  romantic: [
    "rival_attention_trigger",
    "jealousy_trigger",
    "almost_confession_trigger",
    "being_chosen_trigger",
    "public_claim_trigger",
    "being_compared_trigger",
    "shared_attention_trigger",
  ],
  sensory: [
    "familiar_scent_trigger",
    "specific_song_trigger",
    "touch_memory_trigger",
    "weather_memory_trigger",
    "room_too_loud_trigger",
  ],
  care: [
    "being_needed_trigger",
    "receiving_care_trigger",
    "safe_touch_trigger",
    "too_much_kindness_trigger",
    "needing_help_trigger",
  ],
  vulnerability: [
    "direct_emotional_question_trigger",
    "being_seen_weak_trigger",
  ],
} as const satisfies Record<TriggerCategory, readonly string[]>;

export const triggerExpansionLogic = {
  wound_to_trigger: {
    abandonment_wound: [
      "unanswered_message_trigger",
      "goodbye_trigger",
      "temporary_separation_trigger",
    ],
    betrayal_wound: [
      "broken_promise_trigger",
      "secret_revealed_trigger",
      "hidden_agenda_trigger",
    ],
    humiliation_wound: [
      "public_embarrassment_trigger",
      "mockery_trigger",
      "being_seen_failing_trigger",
    ],
    control_wound: [
      "being_ordered_trigger",
      "loss_of_choice_trigger",
      "boundary_ignored_trigger",
    ],
  },
  fear_to_trigger: {
    fear_of_rejection: [
      "cold_tone_trigger",
      "romantic_ambiguity_trigger",
      "being_chosen_last_trigger",
    ],
    fear_of_replacement: [
      "rival_attention_trigger",
      "being_compared_trigger",
      "shared_attention_trigger",
    ],
    fear_of_vulnerability: [
      "vulnerability_exposed_trigger",
      "too_much_kindness_trigger",
      "direct_emotional_question_trigger",
    ],
    fear_of_dependency: [
      "receiving_care_trigger",
      "needing_help_trigger",
      "being_seen_weak_trigger",
    ],
  },
  trigger_to_response: {
    unanswered_message_trigger: [
      "panic_spiral_response",
      "reassurance_seeking_response",
      "preemptive_withdrawal_response",
    ],
    broken_promise_trigger: [
      "emotional_lockdown_response",
      "anger_response",
      "trust_testing_response",
    ],
    public_embarrassment_trigger: [
      "masking_response",
      "defensive_anger_response",
      "escape_response",
    ],
    being_ordered_trigger: [
      "rebellion_response",
      "boundary_assertion_response",
      "cold_withdrawal_response",
    ],
    receiving_care_trigger: [
      "flustered_deflection_response",
      "refusing_help_response",
      "softening_response",
    ],
  },
} as const;

const TRIGGER_PROFILES = {
  attachment: {
    triggerType: "attachment",
    examples: [
      "A familiar point of contact disappears without explanation.",
      "A separation feels larger than the facts support.",
      "The character reads a pause as emotional drift.",
    ],
    tags: ["trigger", "attachment", "silence", "abandonment"],
    relatedSeeds: ["abandonment_wound", "fear_of_abandonment", "desire_for_reliable_love"],
    oppositeSeeds: ["reliable_return", "consistent_check_in", "secure_attachment"],
    romanceHooks: ["reassurance_after_spiral", "return_as_romance", "secure_waiting"],
    scenarioHooks: ["missed_check_in", "late_reply_conflict", "temporary_separation"],
    dialoguePatterns: [
      "You disappeared.",
      "I thought something changed.",
      "I know it was small. It did not feel small.",
    ],
    activatesWounds: ["abandonment_wound", "emotional_neglect_wound"],
    activatesFears: ["fear_of_abandonment", "fear_of_rejection", "fear_of_emotional_distance"],
    activatesDesires: ["desire_for_reliable_love", "desire_to_be_chosen"],
    likelyResponses: [
      "panic_spiral_response",
      "reassurance_seeking_response",
      "preemptive_withdrawal_response",
    ],
    emotionalMeaning: "Distance feels like proof that the bond is becoming unsafe.",
    misreadAs: ["loss_of_interest", "punishment", "emotional_exit"],
    actualNeutralMeaning: ["ordinary_delay", "partner_was_busy", "needed_time_to_reply"],
    earlySigns: ["checks_for_updates", "gets_quiet", "overreads_last_contact"],
    escalationPath: [
      "notices_gap",
      "imagines_rejection",
      "checks_for_evidence",
      "seeks_or_avoids_reassurance",
      "conflict_or_shutdown",
    ],
    deescalationNeeds: ["clear_context", "gentle_reassurance", "reliable_return"],
    repairMethods: ["explain_without_defensiveness", "reaffirm_care", "follow_through_next_time"],
    growthArcs: ["names_trigger", "asks_directly", "learns_delay_is_not_abandonment"],
    metadata: {
      intensity: "strong",
      romanceValue: 8,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 9,
      pacingPressure: "high",
    },
  },
  rejection: {
    triggerType: "rejection",
    examples: [
      "Attention goes elsewhere at a vulnerable moment.",
      "A bid for connection is missed or answered coldly.",
      "Ambiguity makes their place in the bond feel uncertain.",
    ],
    tags: ["trigger", "rejection", "ambiguity", "self_worth"],
    relatedSeeds: ["fear_of_rejection", "invisibility_wound", "desire_to_be_seen"],
    oppositeSeeds: ["clear_interest", "warm_attention", "chosen_openly"],
    romanceHooks: ["chosen_after_rejection_fear", "warmth_after_cold_tone"],
    scenarioHooks: ["group_overlooked_scene", "ambiguous_date", "cold_reply_conflict"],
    dialoguePatterns: [
      "You looked right past me.",
      "I could not tell if you wanted me there.",
      "Say it plainly if I am reading this wrong.",
    ],
    activatesWounds: ["invisibility_wound", "never_chosen_wound"],
    activatesFears: ["fear_of_rejection", "fear_of_not_being_chosen"],
    activatesDesires: ["desire_to_be_seen", "desire_for_validation"],
    likelyResponses: ["self_protection_response", "masking_response", "reassurance_seeking_response"],
    emotionalMeaning: "Ambiguity feels like evidence that they are unwanted.",
    misreadAs: ["disinterest", "social_rejection", "romantic_rejection"],
    actualNeutralMeaning: ["missed_social_cue", "stress", "unclear_communication"],
    earlySigns: ["laughs_it_off", "withdraws_from_group", "stops_asking"],
    escalationPath: ["feels_missed", "compares_self", "withdraws_or_tests", "needs_clarity"],
    deescalationNeeds: ["specific_attention", "plain_language", "warm_repair"],
    repairMethods: ["name_the_missed_bid", "offer_specific_reassurance", "invite_them_back_in"],
    growthArcs: ["checks_assumption", "asks_for_clarity", "accepts_warmth_cleanly"],
    metadata: {
      intensity: "strong",
      romanceValue: 8,
      angstValue: 8,
      conflictPotential: 8,
      healingValue: 8,
      pacingPressure: "medium",
    },
  },
  betrayal: {
    triggerType: "betrayal",
    examples: [
      "A promise is broken after trust was extended.",
      "A hidden truth changes the meaning of earlier intimacy.",
      "A protective lie feels too close to old betrayal.",
    ],
    tags: ["trigger", "betrayal", "trust", "secrecy"],
    relatedSeeds: ["betrayal_wound", "fear_of_deception", "trust_testing_response"],
    oppositeSeeds: ["clean_truth", "kept_promise", "transparent_repair"],
    romanceHooks: ["trust_repair_arc", "truth_after_secret", "promise_kept_later"],
    scenarioHooks: ["secret_reveal", "broken_promise_scene", "old_betrayal_echo"],
    dialoguePatterns: [
      "Were you ever going to tell me the truth?",
      "What other secrets did you keep from me?",
      "Did you really think I would not find out?",
    ],
    activatesWounds: ["betrayal_wound", "trust_wound"],
    activatesFears: ["fear_of_deception", "fear_of_being_used"],
    activatesDesires: ["desire_for_truth", "desire_to_trust_again"],
    likelyResponses: ["emotional_lockdown_response", "trust_testing_response", "defensive_anger_response"],
    emotionalMeaning: "Broken trust feels like proof that closeness was unsafe.",
    misreadAs: ["proof_everything_was_false", "intentional_harm", "emotional_manipulation"],
    actualNeutralMeaning: ["poor_judgment", "fear_based_secrecy", "mistaken_protection"],
    earlySigns: ["voice_goes_flat", "asks_exact_questions", "stops_softening"],
    escalationPath: ["detects_inconsistency", "searches_history", "locks_down", "demands_truth"],
    deescalationNeeds: ["full_context", "accountability", "no_more_trickle_truth"],
    repairMethods: ["tell_complete_truth", "own_the_harm", "prove_change_over_time"],
    growthArcs: ["separates_old_betrayal_from_new_context", "lets_verified_repair_matter"],
    metadata: {
      intensity: "core",
      romanceValue: 8,
      angstValue: 10,
      conflictPotential: 10,
      healingValue: 8,
      pacingPressure: "high",
    },
  },
  shame: {
    triggerType: "shame",
    examples: [
      "A flaw is exposed where others can see it.",
      "Criticism lands on an old humiliation wound.",
      "Vulnerability is witnessed before they feel ready.",
    ],
    tags: ["trigger", "shame", "visibility", "humiliation"],
    relatedSeeds: ["humiliation_wound", "shame_wound", "masking_response"],
    oppositeSeeds: ["private_reassurance", "dignified_correction", "safe_witness"],
    romanceHooks: ["private_reassurance_after_shame", "mask_cracks_softly"],
    scenarioHooks: ["public_mistake", "criticism_scene", "vulnerability_exposed"],
    dialoguePatterns: [
      "Do not look at me like that.",
      "Everyone saw.",
      "Please do not make me say it again.",
    ],
    activatesWounds: ["humiliation_wound", "shame_wound"],
    activatesFears: ["fear_of_judgment", "fear_of_public_failure"],
    activatesDesires: ["desire_for_dignity", "desire_for_acceptance"],
    likelyResponses: ["masking_response", "defensive_anger_response", "escape_response"],
    emotionalMeaning: "Being seen in failure feels like being made unlovable.",
    misreadAs: ["proof_of_incompetence", "social_disgrace", "loss_of_worth"],
    actualNeutralMeaning: ["mistake", "miscommunication", "ordinary_feedback"],
    earlySigns: ["smile_tightens", "face_heats", "goes_formal"],
    escalationPath: ["feels_exposed", "masks_or_attacks", "retreats", "needs_private_repair"],
    deescalationNeeds: ["privacy", "dignity", "specific_non_shaming_reassurance"],
    repairMethods: ["remove_audience", "separate_mistake_from_worth", "offer_private_care"],
    growthArcs: ["survives_being_seen", "accepts_correction_without_collapse"],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
  control: {
    triggerType: "control",
    examples: [
      "A choice is taken away or narrowed without consent.",
      "Someone frames pressure as care.",
      "A boundary is ignored after being clearly stated.",
    ],
    tags: ["trigger", "control", "autonomy", "boundaries"],
    relatedSeeds: ["control_wound", "fear_of_dependency", "boundary_assertion_response"],
    oppositeSeeds: ["choice_offered", "boundary_respected", "consensual_plan"],
    romanceHooks: ["autonomy_respected_after_pressure", "protector_learns_boundaries"],
    scenarioHooks: ["order_given", "boundary_crossed", "forced_role_scene"],
    dialoguePatterns: [
      "You do not get to decide that for me.",
      "Ask me. Do not manage me.",
      "Care is not the same as control.",
    ],
    activatesWounds: ["control_wound", "captivity_wound"],
    activatesFears: ["fear_of_dependency", "fear_of_losing_control"],
    activatesDesires: ["desire_for_autonomy", "desire_for_freedom"],
    likelyResponses: ["rebellion_response", "boundary_assertion_response", "cold_withdrawal_response"],
    emotionalMeaning: "Pressure feels like proof that closeness costs freedom.",
    misreadAs: ["protection", "guidance", "romantic_possessiveness"],
    actualNeutralMeaning: ["poor_boundary_awareness", "urgent_safety_concern", "bad_communication"],
    earlySigns: ["goes_still", "voice_cools", "pushes_back_on_wording"],
    escalationPath: ["choice_narrows", "body_braces", "boundary_hardens", "conflict_peaks"],
    deescalationNeeds: ["choice_restored", "apology_for_pressure", "clear_consent"],
    repairMethods: ["return_the_choice", "ask_before_acting", "respect_no_without_punishment"],
    growthArcs: ["separates_help_from_control", "allows_support_with_consent"],
    metadata: {
      intensity: "core",
      romanceValue: 7,
      angstValue: 8,
      conflictPotential: 9,
      healingValue: 8,
      pacingPressure: "high",
    },
  },
  safety: {
    triggerType: "safety",
    examples: [
      "A sound, touch, or silence makes the body brace before the mind catches up.",
      "The environment becomes too loud, crowded, or unpredictable.",
      "A sudden shift makes old danger feel present.",
    ],
    tags: ["trigger", "safety", "nervous_system", "body"],
    relatedSeeds: ["unsafe_home_wound", "fear_of_harm", "freeze_response"],
    oppositeSeeds: ["safe_touch", "calm_voice", "predictable_environment"],
    romanceHooks: ["grounding_scene", "safe_person_response", "protective_without_pressure"],
    scenarioHooks: ["raised_voice", "sudden_touch", "crowded_room"],
    dialoguePatterns: [
      "Can you tell me your name?",
      "Do you know where you are?",
      "Do you need an ambulance?",
    ],
    activatesWounds: ["unsafe_home_wound", "threat_wound"],
    activatesFears: ["fear_of_harm", "fear_of_chaos"],
    activatesDesires: ["desire_for_safety", "desire_for_predictability"],
    likelyResponses: ["freeze_response", "hypervigilance_response", "control_response"],
    emotionalMeaning: "The body reads the moment as danger even before the facts are clear.",
    misreadAs: ["overreaction", "mistrust", "rejection"],
    actualNeutralMeaning: ["ordinary_noise", "accidental_touch", "environmental_stress"],
    earlySigns: ["checks_exits", "breath_changes", "startles"],
    escalationPath: ["body_braces", "attention_narrows", "fight_flight_freeze", "needs_grounding"],
    deescalationNeeds: ["slow_voice", "space", "predictable_next_steps"],
    repairMethods: ["stop_the_stimulus", "ask_before_touching", "offer_grounding_choices"],
    growthArcs: ["recognizes_body_trigger", "requests_safety_without_shame"],
    metadata: {
      intensity: "strong",
      romanceValue: 7,
      angstValue: 8,
      conflictPotential: 7,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
  romantic: {
    triggerType: "romantic",
    examples: [
      "A romantic signal or rival cue makes the bond feel newly exposed.",
      "Attention shifts in a way that touches jealousy, hope, or fear.",
      "A public sign of affection changes the stakes.",
    ],
    tags: ["trigger", "romantic", "jealousy", "choice"],
    relatedSeeds: ["fear_of_replacement", "desire_to_be_chosen", "jealousy_response"],
    oppositeSeeds: ["secure_choice", "clear_commitment", "trusted_attention"],
    romanceHooks: ["jealousy_repair", "public_choice", "almost_confession"],
    scenarioHooks: ["rival_attention", "public_claim", "near_confession"],
    dialoguePatterns: [
      "You looked different with them.",
      "Do you mean that publicly?",
      "I need to know what this is.",
    ],
    activatesWounds: ["replacement_wound", "never_chosen_wound"],
    activatesFears: ["fear_of_replacement", "fear_of_not_being_chosen"],
    activatesDesires: ["desire_to_be_chosen", "desire_for_devotion"],
    likelyResponses: ["jealousy_suppression_response", "priority_testing_response", "reassurance_seeking_response"],
    emotionalMeaning: "Romantic ambiguity feels like a test of whether they truly matter.",
    misreadAs: ["replacement", "public_shame", "romantic_rejection"],
    actualNeutralMeaning: ["friendly_attention", "unclear_timing", "unplanned_public_moment"],
    earlySigns: ["watches_faces", "gets_quiet", "asks_indirectly"],
    escalationPath: ["notices_cue", "compares_self", "tests_priority", "needs_clear_choice"],
    deescalationNeeds: ["specific_reassurance", "clear_choice", "no_weaponized_jealousy"],
    repairMethods: ["state_the_bond_plainly", "avoid_mocking_jealousy", "follow_with_action"],
    growthArcs: ["names_jealousy_without_control", "trusts_attention_can_be_shared"],
    metadata: {
      intensity: "strong",
      romanceValue: 10,
      angstValue: 9,
      conflictPotential: 8,
      healingValue: 9,
      pacingPressure: "high",
    },
  },
  sensory: {
    triggerType: "sensory",
    examples: [
      "A scent, sound, touch, or weather pattern pulls old memory into the room.",
      "A sensory detail changes the emotional tone before anyone explains why.",
      "The body remembers faster than the character can narrate.",
    ],
    tags: ["trigger", "sensory", "memory", "somatic"],
    relatedSeeds: ["sensory_memory", "scent_as_memory", "somatic_response"],
    oppositeSeeds: ["grounding_anchor", "safe_environment", "present_moment"],
    romanceHooks: ["memory_softened_by_partner", "grounding_through_senses"],
    scenarioHooks: ["song_memory", "weather_memory", "familiar_scent"],
    dialoguePatterns: [
      "That sound took me somewhere else.",
      "I know it is just weather.",
      "Stay with me until I remember where I am.",
    ],
    activatesWounds: ["memory_wound", "loss_wound"],
    activatesFears: ["fear_of_being_hurt_again", "fear_of_losing_control"],
    activatesDesires: ["desire_to_feel_safe_again", "desire_for_grounding"],
    likelyResponses: ["freeze_response", "shutdown_response", "self_soothing_response"],
    emotionalMeaning: "The sensation becomes a doorway into old feeling.",
    misreadAs: ["mood_shift", "sudden_rejection", "irrationality"],
    actualNeutralMeaning: ["ordinary_sensory_cue", "environmental_overlap", "memory_association"],
    earlySigns: ["breath_catches", "attention_drifts", "touches_grounding_object"],
    escalationPath: ["cue_hits", "memory_rises", "body_reacts", "needs_present_anchor"],
    deescalationNeeds: ["grounding", "present_orientation", "gentle_context"],
    repairMethods: ["name_the_present", "offer_sensory_choice", "avoid_forcing_story"],
    growthArcs: ["builds_safe_association", "uses_grounding_before_spiral"],
    metadata: {
      intensity: "moderate",
      romanceValue: 7,
      angstValue: 7,
      conflictPotential: 5,
      healingValue: 9,
      pacingPressure: "low",
    },
  },
  care: {
    triggerType: "safety",
    examples: [
      "Care arrives where they expected judgment or abandonment.",
      "Being needed or helped makes closeness feel unavoidable.",
      "Kindness touches a wound before trust has caught up.",
    ],
    tags: ["trigger", "care", "safety", "vulnerability"],
    relatedSeeds: ["fear_of_dependency", "desire_to_trust_again", "caretaking_response"],
    oppositeSeeds: ["neglect", "dismissed_need", "cold_indifference"],
    romanceHooks: ["care_breaks_through_defenses", "safe_touch_scene", "receiving_care_arc"],
    scenarioHooks: ["sick_day_care", "injury_care", "unexpected_kindness"],
    dialoguePatterns: [
      "When was the last time you ate anything?",
      "Can you let me see your eyes?",
      "Should I stay a bit longer?",
    ],
    activatesWounds: ["neglect_wound", "dependency_wound"],
    activatesFears: ["fear_of_dependency", "fear_of_vulnerability"],
    activatesDesires: ["desire_to_feel_safe_again", "desire_for_reliable_love"],
    likelyResponses: ["flustered_deflection_response", "refusing_help_response", "softening_response"],
    emotionalMeaning: "Care feels dangerous because it makes needing someone real.",
    misreadAs: ["pity", "debt", "loss_of_independence"],
    actualNeutralMeaning: ["genuine_care", "ordinary_support", "mutual_help"],
    earlySigns: ["gets_flustered", "deflects", "tries_to_repay_immediately"],
    escalationPath: ["receives_care", "feels_exposed", "resists_or_softens", "needs_choice"],
    deescalationNeeds: ["agency", "no_debt_language", "care_without_pressure"],
    repairMethods: ["offer_choice", "avoid_pity", "let_care_be_received_slowly"],
    growthArcs: ["accepts_help_without_debt", "lets_care_mean_safety"],
    metadata: {
      intensity: "moderate",
      romanceValue: 9,
      angstValue: 7,
      conflictPotential: 6,
      healingValue: 10,
      pacingPressure: "medium",
    },
  },
  vulnerability: {
    triggerType: "identity",
    examples: [
      "A direct question or visible weakness makes the inner self hard to hide.",
      "Someone sees too accurately before the character feels prepared.",
      "Honesty becomes harder to avoid than silence.",
    ],
    tags: ["trigger", "vulnerability", "identity", "exposure"],
    relatedSeeds: ["fear_of_vulnerability", "self_editing_response", "confident_vulnerability"],
    oppositeSeeds: ["safe_distance", "controlled_disclosure", "privacy_respected"],
    romanceHooks: ["truth_slip", "seen_too_clearly", "vulnerability_aftercare"],
    scenarioHooks: ["direct_question", "weakness_seen", "soft_confession_pressure"],
    dialoguePatterns: [
      "Why are you asking me that?",
      "You make it very hard to lie.",
      "I do not know how to answer without giving too much away.",
    ],
    activatesWounds: ["shame_wound", "identity_erasure_wound"],
    activatesFears: ["fear_of_vulnerability", "fear_of_rejection"],
    activatesDesires: ["desire_for_authenticity", "desire_to_be_seen"],
    likelyResponses: ["humor_deflection_response", "intellectualizing_response", "truth_slip_response"],
    emotionalMeaning: "Being known feels both wanted and dangerous.",
    misreadAs: ["interrogation", "judgment", "pressure_to_perform"],
    actualNeutralMeaning: ["careful_curiosity", "emotional_attunement", "concern"],
    earlySigns: ["answers_sideways", "jokes_too_fast", "looks_away"],
    escalationPath: ["question_lands", "mask_slips", "deflects_or_confesses", "needs_safety"],
    deescalationNeeds: ["permission_to_pause", "privacy", "no_demanded_confession"],
    repairMethods: ["honor_the_pause", "ask_consent_for_depth", "receive_truth_gently"],
    growthArcs: ["chooses_disclosure", "lets_being_seen_feel_safe"],
    metadata: {
      intensity: "strong",
      romanceValue: 9,
      angstValue: 8,
      conflictPotential: 7,
      healingValue: 9,
      pacingPressure: "medium",
    },
  },
} as const satisfies Record<TriggerCategory, TriggerProfile>;

const TRIGGER_OVERRIDES: Record<string, TriggerOverride> = {
  unanswered_message_trigger: {
    label: "Unanswered Message Trigger",
    description:
      "A delayed or missing reply activates fear of abandonment, rejection, or emotional distance.",
    examples: [
      "A text goes unanswered for hours.",
      "The partner reads a message but does not respond.",
      "A check-in ritual is missed.",
    ],
    tags: ["attachment", "silence", "reassurance", "abandonment"],
    relatedSeeds: [
      "fear_of_abandonment",
      "abandonment_wound",
      "reassurance_seeking_response",
    ],
    oppositeSeeds: [
      "consistent_check_in",
      "reliable_return",
      "secure_attachment",
    ],
    romanceHooks: [
      "reassurance_after_spiral",
      "return_as_romance",
      "learning_distance_is_not_abandonment",
    ],
    scenarioHooks: [
      "missed_message_spiral",
      "late_reply_conflict",
      "goodnight_text_missed",
    ],
    dialoguePatterns: [
      "You did not answer.",
      "I thought something changed.",
      "I know it was only a message. It did not feel small.",
    ],
    activatesWounds: [
      "abandonment_wound",
      "emotional_neglect_wound",
    ],
    activatesFears: [
      "fear_of_abandonment",
      "fear_of_rejection",
      "fear_of_emotional_distance",
    ],
    activatesDesires: [
      "desire_for_reliable_love",
      "desire_to_be_prioritized",
      "desire_for_emotional_presence",
    ],
    likelyResponses: [
      "panic_spiral_response",
      "reassurance_seeking_response",
      "preemptive_withdrawal_response",
    ],
    emotionalMeaning:
      "Silence feels like proof that they are being left or deprioritized.",
    misreadAs: [
      "loss_of_interest",
      "punishment",
      "emotional_exit",
    ],
    actualNeutralMeaning: [
      "partner_was_busy",
      "phone_died",
      "needed_time_to_reply",
    ],
    earlySigns: [
      "checks_phone_repeatedly",
      "gets_quiet",
      "overreads_last_message",
      "drafts_then_deletes_reply",
    ],
    escalationPath: [
      "notices_silence",
      "imagines_rejection",
      "checks_for_evidence",
      "seeks_or_avoids_reassurance",
      "conflict_or_shutdown",
    ],
    deescalationNeeds: [
      "clear_context",
      "gentle_reassurance",
      "return_ritual",
      "no_mocking_the_need",
    ],
    repairMethods: [
      "explain_delay_without_defensiveness",
      "reaffirm_care",
      "create_check_in_expectation",
      "follow_through_next_time",
    ],
    growthArcs: [
      "names_trigger",
      "asks_directly_for_reassurance",
      "learns_delay_is_not_abandonment",
      "builds_secure_waiting",
    ],
    routeGates: [
      "first_silence_trigger_gate",
      "first_reassurance_after_delay_gate",
      "secure_return_gate",
    ],
  },
  being_compared_trigger: {
    triggerType: "romantic",
    description:
      "Comparison activates replacement fear, self-worth pressure, or the sense of being ranked.",
    dialoguePatterns: [
      "Do not put me beside them like that.",
      "I heard the comparison, even if you did not mean it.",
    ],
  },
  receiving_care_trigger: {
    description:
      "Being cared for activates dependency fear, tenderness, and the wish to trust again.",
  },
  safe_touch_trigger: {
    description:
      "Gentle, permitted touch activates the possibility that contact can mean safety instead of demand.",
    likelyResponses: ["softening_response", "freeze_response", "vulnerability_repair_response"],
  },
  too_much_kindness_trigger: {
    description:
      "Unexpected kindness feels suspiciously tender when the character is used to earning care.",
    likelyResponses: ["humor_deflection_response", "softening_response", "pull_away_after_softness_response"],
  },
};

export const TRIGGER_VOCABULARY_SEEDS = Object.freeze(
  Object.entries(triggerCategories).flatMap(([category, seedIds]) =>
    seedIds.map((seed) => createTriggerSeed(seed, category as TriggerCategory)),
  ),
) satisfies readonly TriggerSeed[];

export const TRIGGER_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  TRIGGER_VOCABULARY_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Emotional meaning: ${seed.emotionalMeaning}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.earlySigns,
        ...seed.escalationPath,
      ],
      tags: [
        ...seed.tags,
        "trigger",
        seed.triggerType,
        seed.metadata.intensity,
        `pacing:${seed.metadata.pacingPressure}`,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.activatesWounds,
        ...seed.activatesFears,
        ...seed.activatesDesires,
        ...seed.likelyResponses,
        ...seed.deescalationNeeds,
        ...seed.repairMethods,
        ...seed.growthArcs,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.misreadAs,
        ...(seed.actualNeutralMeaning ?? []),
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.routeGates,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.intensity === "overwhelming" ? "rare" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function findTriggerVocabularySeedBySeed(
  seedId: string,
): TriggerSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return TRIGGER_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function getTriggerVocabularySeedsByType(
  triggerType: TriggerSeedType,
): readonly TriggerSeed[] {
  return TRIGGER_VOCABULARY_SEEDS.filter((seed) => seed.triggerType === triggerType);
}

export function getTriggerVocabularySeedsByCategory(
  category: TriggerCategory,
): readonly TriggerSeed[] {
  const seedIds = new Set<string>(triggerCategories[category]);
  return TRIGGER_VOCABULARY_SEEDS.filter((seed) => seedIds.has(seed.seed));
}

function createTriggerSeed(seed: string, category: TriggerCategory): TriggerSeed {
  const profile = TRIGGER_PROFILES[category];
  const override = TRIGGER_OVERRIDES[seed];
  const triggerType = override?.triggerType ?? profile.triggerType;

  return createTriggerSeedPreset({
    seed,
    label: override?.label ?? toTriggerLabel(seed),
    description:
      override?.description ??
      `Activates ${toReadableTrigger(seed)} as an emotionally meaningful cue.`,
    examples: override?.examples ?? profile.examples,
    tags: unique([
      ...profile.tags,
      category,
      triggerType,
      seed,
      ...(override?.tags ?? []),
    ]),
    relatedSeeds: override?.relatedSeeds ?? profile.relatedSeeds,
    oppositeSeeds: override?.oppositeSeeds ?? profile.oppositeSeeds,
    romanceHooks: override?.romanceHooks ?? profile.romanceHooks,
    scenarioHooks: override?.scenarioHooks ?? profile.scenarioHooks,
    dialoguePatterns: override?.dialoguePatterns ?? profile.dialoguePatterns,
    triggerType,
    activatesWounds: override?.activatesWounds ?? profile.activatesWounds,
    activatesFears: override?.activatesFears ?? profile.activatesFears,
    activatesDesires: override?.activatesDesires ?? profile.activatesDesires,
    likelyResponses: override?.likelyResponses ?? profile.likelyResponses,
    emotionalMeaning: override?.emotionalMeaning ?? profile.emotionalMeaning,
    misreadAs: override?.misreadAs ?? profile.misreadAs,
    actualNeutralMeaning:
      override?.actualNeutralMeaning ?? profile.actualNeutralMeaning,
    earlySigns: override?.earlySigns ?? profile.earlySigns,
    escalationPath: override?.escalationPath ?? profile.escalationPath,
    deescalationNeeds: override?.deescalationNeeds ?? profile.deescalationNeeds,
    repairMethods: override?.repairMethods ?? profile.repairMethods,
    growthArcs: override?.growthArcs ?? profile.growthArcs,
    routeGates: override?.routeGates ?? [
      `${seed}_gate`,
      `${category}_trigger_route`,
    ],
    metadata: {
      ...profile.metadata,
      ...override?.metadata,
    },
  });
}

function toTriggerLabel(seed: string): string {
  return seed
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bTrigger\b$/, "Trigger");
}

function toReadableTrigger(seed: string): string {
  return seed.replace(/_trigger$/, "").replace(/_/g, " ");
}

function unique(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
