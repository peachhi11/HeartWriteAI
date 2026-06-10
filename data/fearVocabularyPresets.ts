import {
  createFearSeedPreset,
  createVocabularySeedPreset,
  type FearSeed,
  type FearSeedInput,
  type FearSeedPacingPressure,
  type FearSeedSeverity,
  type FearSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

type FearTemplateKey =
  | "attachment"
  | "self_worth"
  | "identity"
  | "social"
  | "safety"
  | "emotional"
  | "moral"
  | "existential"
  | "obsession"
  | "healing";

interface FearTemplate {
  fearType: FearSeedType;
  coreBelief: string;
  hiddenNeed: string;
  perceivedThreat: string;
  triggers: readonly string[];
  earlyWarnings: readonly string[];
  escalationPattern: readonly string[];
  defenseMechanisms: readonly string[];
  copingBehaviors: readonly string[];
  avoidancePatterns: readonly string[];
  attachmentEffects: readonly string[];
  intimacyEffects: readonly string[];
  conflictEffects: readonly string[];
  misreadSignals: readonly string[];
  reassuranceNeeds: readonly string[];
  repairMethods: readonly string[];
  healingNeeds: readonly string[];
  growthArcs: readonly string[];
  routeGates: readonly string[];
  compatibleWounds: readonly string[];
  incompatibleDynamics: readonly string[];
  tags: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
  severity: FearSeedSeverity;
  romanceValue: number;
  angstValue: number;
  conflictPotential: number;
  healingValue: number;
  pacingPressure: FearSeedPacingPressure;
}

interface FearSeedDefinition {
  label: string;
  template: FearTemplateKey;
  seed?: string;
  description?: string;
}

export const FEAR_SEED_TEMPLATES = Object.freeze({
  attachment: {
    fearType: "attachment",
    coreBelief: "People eventually leave.",
    hiddenNeed: "Reliable emotional permanence.",
    perceivedThreat: "Distance, silence, emotional withdrawal, or separation.",
    triggers: [
      "unanswered_messages",
      "cancelled_plans",
      "emotional_distance",
      "goodbyes",
      "rival_attention",
    ],
    earlyWarnings: [
      "checks_for_tone_changes",
      "lingers_after_goodbyes",
      "asks_casual_questions_with_too_much_weight",
    ],
    escalationPattern: [
      "notices_distance",
      "tests_for_return",
      "seeks_reassurance_indirectly",
      "withdraws_or_clings",
    ],
    defenseMechanisms: [
      "clinginess",
      "testing_love",
      "withdrawal",
      "hypervigilance",
    ],
    copingBehaviors: [
      "stays_close",
      "checks_emotional_status",
      "memorizes_patterns_of_attention",
    ],
    avoidancePatterns: [
      "avoids_naming_need_directly",
      "pretends_they_do_not_care",
    ],
    attachmentEffects: [
      "reassurance_seeking",
      "anxious_attachment",
      "abandonment_sensitivity",
    ],
    intimacyEffects: [
      "needs_clear_return_after_distance",
      "confuses_uncertainty_with_loss",
    ],
    conflictEffects: [
      "mistakes_space_for_rejection",
      "escalates_when_reassurance_feels_delayed",
    ],
    misreadSignals: [
      "busy_schedule_as_disinterest",
      "quiet_mood_as_emotional_withdrawal",
    ],
    reassuranceNeeds: [
      "specific_return_promises",
      "consistent_follow_through",
      "warmth_after_space",
    ],
    repairMethods: [
      "names_the_fear_without_accusing",
      "offers_clear_reassurance",
      "keeps_small_promises",
    ],
    healingNeeds: [
      "emotional_consistency",
      "safe_separations",
      "proof_that_distance_can_return",
    ],
    growthArcs: [
      "asks_directly_for_reassurance",
      "survives_space_without_panic",
      "trusts_connection_after_distance",
    ],
    routeGates: [
      "first_reassurance_gate",
      "first_safe_goodbye_gate",
      "distance_repair_gate",
    ],
    compatibleWounds: [
      "abandonment_wound",
      "rejection_wound",
      "replacement_wound",
    ],
    incompatibleDynamics: ["intentional_ambiguity", "punitive_withdrawal"],
    tags: ["fear", "attachment", "psychology", "romance_pressure"],
    romanceHooks: ["safe_person_dynamic", "reassurance_scene", "distance_repair"],
    scenarioHooks: ["cancelled_plan", "rival_attention", "quiet_after_conflict"],
    dialoguePatterns: [
      "Is this the last time I will see you?",
      "Please, do not leave me alone.",
    ],
    severity: "core",
    romanceValue: 10,
    angstValue: 9,
    conflictPotential: 8,
    healingValue: 10,
    pacingPressure: "high",
  },
  self_worth: {
    fearType: "self_worth",
    coreBelief: "I am fundamentally not enough.",
    hiddenNeed: "Unconditional acceptance.",
    perceivedThreat: "Failure, comparison, criticism, or rejection.",
    triggers: ["mistakes", "comparison", "criticism", "competition"],
    earlyWarnings: [
      "overexplains_small_errors",
      "deflects_praise",
      "tracks_other_people_successes",
    ],
    escalationPattern: [
      "makes_a_mistake",
      "expects_disappointment",
      "overcorrects_or_self_sabotages",
    ],
    defenseMechanisms: [
      "perfectionism",
      "overachievement",
      "people_pleasing",
      "self_sabotage",
    ],
    copingBehaviors: ["works_harder", "seeks_approval", "hides_uncertainty"],
    avoidancePatterns: ["avoids_visible_failure", "avoids_asking_for_help"],
    attachmentEffects: ["approval_seeking", "difficulty_accepting_love"],
    intimacyEffects: [
      "struggles_to_receive_praise",
      "expects_love_to_require_performance",
    ],
    conflictEffects: [
      "hears_feedback_as_rejection",
      "apologizes_before_understanding_the_harm",
    ],
    misreadSignals: ["neutral_feedback_as_disappointment", "silence_as_judgment"],
    reassuranceNeeds: [
      "praise_for_presence_not_performance",
      "acceptance_after_mistakes",
    ],
    repairMethods: [
      "separates_mistake_from_worth",
      "offers_specific_acceptance",
    ],
    healingNeeds: ["unearned_acceptance", "safe_failure", "gentle_accountability"],
    growthArcs: [
      "lets_someone_see_imperfection",
      "accepts_love_without_performing",
      "builds_worth_outside_achievement",
    ],
    routeGates: ["first_safe_failure_gate", "praise_acceptance_gate"],
    compatibleWounds: [
      "worthlessness_wound",
      "inadequacy_wound",
      "failure_wound",
    ],
    incompatibleDynamics: ["constant_comparison", "conditional_affection"],
    tags: ["fear", "self_worth", "psychology", "romance_pressure"],
    romanceHooks: ["safe_failure_scene", "acceptance_after_mistake"],
    scenarioHooks: ["public_mistake", "comparison_scene", "performance_review"],
    dialoguePatterns: [
      "Am I not good enough?",
      "Why am I never good enough?",
    ],
    severity: "major",
    romanceValue: 8,
    angstValue: 8,
    conflictPotential: 7,
    healingValue: 10,
    pacingPressure: "medium",
  },
  identity: {
    fearType: "identity",
    coreBelief: "If I lose myself, I disappear.",
    hiddenNeed: "Freedom to exist authentically.",
    perceivedThreat: "Control, conformity, role pressure, or engulfment.",
    triggers: ["role_pressure", "controlling_behavior", "identity_dismissed"],
    earlyWarnings: [
      "gets_quiet_when_defined_by_others",
      "corrects_labels_too_sharply",
    ],
    escalationPattern: ["feels_defined", "pulls_back", "rebels_or_disappears"],
    defenseMechanisms: ["withdrawal", "rebellion", "emotional_distance"],
    copingBehaviors: ["keeps_private_spaces", "asserts_preferences", "tests_autonomy"],
    avoidancePatterns: ["avoids_dependency", "avoids_roles_that_feel_fixed"],
    attachmentEffects: ["engulfment_sensitivity", "avoidant_activation"],
    intimacyEffects: ["fear_of_closeness", "needs_separateness_inside_love"],
    conflictEffects: [
      "hears_care_as_control",
      "defends_autonomy_before_explaining_need",
    ],
    misreadSignals: ["concern_as_control", "commitment_as_erasure"],
    reassuranceNeeds: ["choice_respected", "identity_named_correctly"],
    repairMethods: ["asks_before_assuming", "reaffirms_autonomy"],
    healingNeeds: ["room_for_selfhood", "chosen_closeness", "private_agency"],
    growthArcs: [
      "keeps_identity_inside_intimacy",
      "lets_love_include_freedom",
    ],
    routeGates: ["autonomy_respected_gate", "chosen_closeness_gate"],
    compatibleWounds: ["engulfment_wound", "control_wound", "authenticity_wound"],
    incompatibleDynamics: ["possessive_control", "identity_erasure"],
    tags: ["fear", "identity", "psychology", "agency"],
    romanceHooks: ["autonomy_inside_love", "chosen_return_after_space"],
    scenarioHooks: ["role_pressure_scene", "boundary_negotiation"],
    dialoguePatterns: [
      "I want you. I still need to be myself.",
      "Do not love the version of me that is easiest for you.",
    ],
    severity: "major",
    romanceValue: 8,
    angstValue: 7,
    conflictPotential: 8,
    healingValue: 9,
    pacingPressure: "medium",
  },
  social: {
    fearType: "social",
    coreBelief: "I do not belong.",
    hiddenNeed: "Acceptance and community.",
    perceivedThreat: "Judgment, exclusion, humiliation, or visibility.",
    triggers: ["public_attention", "group_exclusion", "community_judgment"],
    earlyWarnings: [
      "scans_the_room_before_speaking",
      "laughs_at_themselves_first",
    ],
    escalationPattern: ["feels_visible", "masks_or_freezes", "withdraws_from_group"],
    defenseMechanisms: ["masking", "social_withdrawal", "people_pleasing"],
    copingBehaviors: ["stays_near_exits", "uses_safe_person_as_anchor"],
    avoidancePatterns: ["avoids_groups", "avoids_public_needs"],
    attachmentEffects: ["belonging_hunger", "rejection_sensitivity"],
    intimacyEffects: ["needs_private_acceptance_before_public_claim"],
    conflictEffects: ["reads_public_disagreement_as_shame"],
    misreadSignals: ["inside_jokes_as_exclusion", "quiet_group_as_judgment"],
    reassuranceNeeds: ["public_respect", "private_welcome", "chosen_inclusion"],
    repairMethods: ["protects_dignity_publicly", "invites_without_pressure"],
    healingNeeds: ["safe_belonging", "chosen_family", "nonperformative_acceptance"],
    growthArcs: ["enters_the_room_without_apology", "lets_belonging_be_visible"],
    routeGates: ["first_public_welcome_gate", "chosen_family_gate"],
    compatibleWounds: ["outcast_wound", "social_exclusion_wound", "humiliation_wound"],
    incompatibleDynamics: ["public_mockery", "status_games"],
    tags: ["fear", "social", "belonging", "romance_pressure"],
    romanceHooks: ["public_defense", "chosen_family_scene"],
    scenarioHooks: ["community_event", "public_misstep", "group_invitation"],
    dialoguePatterns: [
      "Everyone here already knows where they fit.",
      "You do not have to stand outside with me.",
    ],
    severity: "moderate",
    romanceValue: 7,
    angstValue: 7,
    conflictPotential: 6,
    healingValue: 9,
    pacingPressure: "medium",
  },
  safety: {
    fearType: "safety",
    coreBelief: "The world is dangerous.",
    hiddenNeed: "Safety and predictability.",
    perceivedThreat: "Physical harm, instability, helplessness, or loss of control.",
    triggers: ["sudden_noise", "threats", "instability", "loss_of_control"],
    earlyWarnings: ["checks_exits", "tracks_other_peoples_hands", "stops_relaxing"],
    escalationPattern: ["detects_threat", "controls_environment", "fights_or_flees"],
    defenseMechanisms: ["hypervigilance", "planning", "control_seeking"],
    copingBehaviors: ["keeps_escape_route", "prepares_supplies", "stays_alert"],
    avoidancePatterns: ["avoids_uncontrolled_places", "avoids_surprise"],
    attachmentEffects: ["protective_activation", "trust_slow_to_build"],
    intimacyEffects: ["needs_body_safety_before_vulnerability"],
    conflictEffects: ["treats_uncertainty_as_danger"],
    misreadSignals: ["surprise_as_threat", "raised_voice_as_violence"],
    reassuranceNeeds: ["clear_plan", "calm_presence", "consent_before_touch"],
    repairMethods: ["grounds_before_discussion", "restores_choice_and_space"],
    healingNeeds: ["predictability", "body_safety", "trusted_protection"],
    growthArcs: ["lets_someone_else_watch_the_door", "rests_without_staying_ready"],
    routeGates: ["first_body_safety_gate", "lets_guard_down_gate"],
    compatibleWounds: ["never_safe_wound", "violence_survivor_wound", "war_trauma_wound"],
    incompatibleDynamics: ["reckless_endangerment", "surprise_as_test"],
    tags: ["fear", "safety", "survival", "romance_pressure"],
    romanceHooks: ["protector_respects_boundaries", "safe_room_scene"],
    scenarioHooks: ["threat_appears", "storm_traps_them", "security_breach"],
    dialoguePatterns: [
      "I need to know where the exits are.",
      "Do not touch me before I know it is you.",
    ],
    severity: "major",
    romanceValue: 7,
    angstValue: 8,
    conflictPotential: 8,
    healingValue: 9,
    pacingPressure: "medium",
  },
  emotional: {
    fearType: "emotional",
    coreBelief: "Strong feelings will hurt me.",
    hiddenNeed: "Safe emotional expression.",
    perceivedThreat: "Emotional intensity, grief, hope, or vulnerability.",
    triggers: ["overwhelming_feelings", "grief_memory", "hope_returning"],
    earlyWarnings: ["jokes_at_the_wrong_moment", "goes_flat_when_touched"],
    escalationPattern: ["feeling_rises", "numbs_or_deflects", "pushes_away_comfort"],
    defenseMechanisms: ["numbing", "intellectualization", "humor_deflection"],
    copingBehaviors: ["names_facts_instead_of_feelings", "keeps_voice_level"],
    avoidancePatterns: ["avoids_grief", "avoids_happiness_that_feels_fragile"],
    attachmentEffects: ["emotional_withholding", "slow_vulnerability"],
    intimacyEffects: ["needs_soft_pacing_for_confession"],
    conflictEffects: ["shuts_down_when_feelings_peak"],
    misreadSignals: ["tenderness_as_pressure", "crying_as_loss_of_control"],
    reassuranceNeeds: ["permission_to_feel_slowly", "no_rush_to_explain"],
    repairMethods: ["stays_present_without_forcing_disclosure"],
    healingNeeds: ["safe_tears", "emotional_pacing", "ordinary_tenderness"],
    growthArcs: ["lets_feelings_exist", "admits_hope_without_punishing_it"],
    routeGates: ["first_safe_cry_gate", "hope_allowed_gate"],
    compatibleWounds: ["heartbreak_wound", "hope_collapse_wound", "lost_innocence_wound"],
    incompatibleDynamics: ["emotional_interrogation", "forced_confession"],
    tags: ["fear", "emotional", "vulnerability", "romance_pressure"],
    romanceHooks: ["safe_cry_scene", "hope_after_heartbreak"],
    scenarioHooks: ["anniversary_grief", "soft_confession", "almost_happiness"],
    dialoguePatterns: [
      "If I start feeling it, I do not know where it stops.",
      "Hope has teeth. I remember.",
    ],
    severity: "major",
    romanceValue: 9,
    angstValue: 8,
    conflictPotential: 7,
    healingValue: 10,
    pacingPressure: "high",
  },
  moral: {
    fearType: "moral",
    coreBelief: "I could become someone I hate.",
    hiddenNeed: "Moral certainty.",
    perceivedThreat: "Ethical failure, guilt, corruption, or harm caused by choice.",
    triggers: ["ethical_compromise", "broken_promise", "harm_done_to_others"],
    earlyWarnings: ["gets_rigid", "replays_choices", "refuses_easy_absolution"],
    escalationPattern: ["sees_moral_risk", "overcontrols_choice", "self_punishes"],
    defenseMechanisms: ["rigidity", "overcontrol", "self_punishment"],
    copingBehaviors: ["keeps_rules", "seeks_accountability", "makes_restitution"],
    avoidancePatterns: ["avoids_desire_that_feels_selfish", "avoids_moral_grayness"],
    attachmentEffects: ["fears_being_unworthy_of_love_after_harm"],
    intimacyEffects: ["needs_partner_to_see_both_guilt_and_goodness"],
    conflictEffects: ["turns_disagreement_into_moral_trial"],
    misreadSignals: ["forgiveness_as_erasure", "desire_as_corruption"],
    reassuranceNeeds: ["accountability_without_condemnation", "ethical_clarity"],
    repairMethods: ["names_harm", "makes_amends", "accepts_mercy_without_escaping_accountability"],
    healingNeeds: ["proportionate_guilt", "repair_path", "moral_self_trust"],
    growthArcs: ["learns_mercy", "chooses_repair_over_self_punishment"],
    routeGates: ["first_mercy_gate", "accountability_repair_gate"],
    compatibleWounds: ["disgrace_wound", "family_shame_wound", "betrayal_wound"],
    incompatibleDynamics: ["corruption_as_romance", "absolution_without_repair"],
    tags: ["fear", "moral", "ethics", "romance_pressure"],
    romanceHooks: ["mercy_after_failure", "accountability_as_intimacy"],
    scenarioHooks: ["broken_promise", "moral_choice", "past_harm_revealed"],
    dialoguePatterns: [
      "What if the worst thing I did is the truest thing about me?",
      "Do not forgive me because it is easier than looking at it.",
    ],
    severity: "major",
    romanceValue: 8,
    angstValue: 9,
    conflictPotential: 8,
    healingValue: 9,
    pacingPressure: "medium",
  },
  existential: {
    fearType: "existential",
    coreBelief: "Nothing I do may matter.",
    hiddenNeed: "Meaning and purpose.",
    perceivedThreat: "Insignificance, mortality, purposelessness, or oblivion.",
    triggers: ["mortality_reminder", "legacy_failure", "purpose_loss"],
    earlyWarnings: ["speaks_too_calmly_about_endings", "chases_significance"],
    escalationPattern: ["feels_small", "grasps_for_purpose", "distances_from_ordinary_life"],
    defenseMechanisms: ["achievement", "legacy_building", "purpose_seeking"],
    copingBehaviors: ["sets_impossible_goals", "collects_symbols_of_impact"],
    avoidancePatterns: ["avoids_stillness", "avoids_ordinary_happiness"],
    attachmentEffects: ["may_devalue_love_as_too_small"],
    intimacyEffects: ["needs_love_to_feel_meaningful_not_distracting"],
    conflictEffects: ["turns_future_fear_into_present_distance"],
    misreadSignals: ["rest_as_failure", "ordinary_love_as_insufficient"],
    reassuranceNeeds: ["meaning_in_small_things", "presence_over_legacy"],
    repairMethods: ["grounds_future_fear_in_present_connection"],
    healingNeeds: ["purpose_with_room_for_love", "mortality_tenderness"],
    growthArcs: ["lets_ordinary_life_matter", "chooses_presence_over_legacy_panic"],
    routeGates: ["mortality_awareness_gate", "ordinary_life_matters_gate"],
    compatibleWounds: ["meaninglessness_wound", "mortality_wound", "purpose_loss_wound"],
    incompatibleDynamics: ["nihilistic_detachment", "legacy_over_personhood"],
    tags: ["fear", "existential", "purpose", "romance_pressure"],
    romanceHooks: ["meaning_found_in_ordinary_love", "mortality_confession"],
    scenarioHooks: ["legacy_failure", "death_reminder", "purpose_lost"],
    dialoguePatterns: [
      "Is this all there is to life?",
      "When will all of this end?",
    ],
    severity: "major",
    romanceValue: 7,
    angstValue: 8,
    conflictPotential: 6,
    healingValue: 8,
    pacingPressure: "medium",
  },
  obsession: {
    fearType: "obsession",
    coreBelief: "I will stop being special.",
    hiddenNeed: "Emotional uniqueness.",
    perceivedThreat: "Rivals, comparison, divided attention, or one-sided love.",
    triggers: ["shared_attention", "romantic_rival_appears", "priority_shift"],
    earlyWarnings: ["tracks_who_gets_attention", "goes_still_when_rivals_are_named"],
    escalationPattern: ["sees_divided_attention", "monitors_closeness", "becomes_territorial"],
    defenseMechanisms: ["territoriality", "reassurance_seeking", "monitoring"],
    copingBehaviors: ["seeks_exclusivity", "marks_importance_through_ritual"],
    avoidancePatterns: ["avoids_admitting_possessiveness", "avoids_asking_for_clean_reassurance"],
    attachmentEffects: ["jealous_activation", "priority_sensitivity"],
    intimacyEffects: ["equates_exclusivity_with_safety"],
    conflictEffects: ["turns_ambiguity_into_accusation"],
    misreadSignals: ["kindness_to_others_as_replacement", "privacy_as_secret_betrayal"],
    reassuranceNeeds: ["named_priority", "honest_boundaries", "nonperformative_return"],
    repairMethods: ["names_jealousy_without_control", "separates_need_from_entitlement"],
    healingNeeds: ["secure_uniqueness", "self_trust", "consensual_boundaries"],
    growthArcs: ["accepts_love_without_possession", "trusts_unique_bonds_can_coexist"],
    routeGates: ["first_jealousy_repair_gate", "exclusivity_conversation_gate"],
    compatibleWounds: [
      "replacement_wound",
      "never_chosen_wound",
      "fear_of_losing_special_status_wound",
    ],
    incompatibleDynamics: ["nonconsensual_control", "jealousy_baiting"],
    tags: ["fear", "obsession", "jealousy", "romance_pressure"],
    romanceHooks: ["jealousy_repair_scene", "chosen_priority_scene"],
    scenarioHooks: ["rival_attention", "ex_returns", "ambiguous_relationship_status"],
    dialoguePatterns: [
      "You looked happier with them.",
      "Do you miss us?",
    ],
    severity: "core",
    romanceValue: 10,
    angstValue: 9,
    conflictPotential: 9,
    healingValue: 9,
    pacingPressure: "high",
  },
  healing: {
    fearType: "healing",
    coreBelief: "If I heal, I lose part of myself.",
    hiddenNeed: "Permission to be safe.",
    perceivedThreat: "Change, healing, hope, safety, or peace.",
    triggers: ["care_feels_easy", "peaceful_day", "trust_becomes_possible"],
    earlyWarnings: ["spoils_good_moments", "gets_restless_when_safe"],
    escalationPattern: ["feels_safe", "distrusts_peace", "self_sabotages_or_rejects_care"],
    defenseMechanisms: [
      "self_sabotage",
      "staying_in_survival_mode",
      "rejecting_care",
    ],
    copingBehaviors: ["keeps_old_armor", "tests_whether_safety_will_hold"],
    avoidancePatterns: ["avoids_rest", "avoids_accepting_love_cleanly"],
    attachmentEffects: ["fears_secure_attachment_will_make_them_soft"],
    intimacyEffects: ["needs_safety_to_arrive_without_demanding_transformation"],
    conflictEffects: ["creates_crisis_when_peace_feels_unfamiliar"],
    misreadSignals: ["comfort_as_trap", "stability_as_pending_loss"],
    reassuranceNeeds: ["permission_to_change_slowly", "love_that_does_not_require_instant_healing"],
    repairMethods: ["normalizes_fear_of_safety", "keeps_care_consistent_after_sabotage"],
    healingNeeds: ["identity_beyond_survival", "gentle_stability", "hope_without_pressure"],
    growthArcs: ["lets_peace_stay", "accepts_recovery_without_erasing_the_past"],
    routeGates: ["first_safe_peace_gate", "accepts_care_cleanly_gate"],
    compatibleWounds: ["never_safe_wound", "survivor_archetype", "hope_collapse_wound"],
    incompatibleDynamics: ["forced_healing", "savior_complex"],
    tags: ["fear", "healing", "recovery", "romance_pressure"],
    romanceHooks: ["learning_to_be_safe", "care_without_pressure"],
    scenarioHooks: ["quiet_domestic_morning", "post_crisis_calm", "care_offered"],
    dialoguePatterns: [
      "I do not know what to do with peace.",
      "What if being okay means I do not know who I am?",
    ],
    severity: "major",
    romanceValue: 9,
    angstValue: 8,
    conflictPotential: 7,
    healingValue: 10,
    pacingPressure: "high",
  },
} as const satisfies Record<FearTemplateKey, FearTemplate>);

const FEAR_SEED_DEFINITIONS = Object.freeze([
  ...fearLabels("attachment", [
    "Fear of Abandonment",
    "Fear of Rejection",
    "Fear of Betrayal",
    "Fear of Being Forgotten",
    { label: "Fear of replacement", seed: "fear_of_replacement" },
    "Fear of Being Left Behind",
    "Fear of Losing Love",
    "Fear of Losing a Safe Person",
    "Fear of Emotional Distance",
    "Fear of Emotional Drift",
  ]),
  ...fearLabels("self_worth", [
    "Fear of Worthlessness",
    "Fear of Inadequacy",
    "Fear of Being Useless",
    "Fear of Being Inferior",
    "Fear of Not Measuring Up",
    "Fear of Being Exposed as a Fraud",
    "Fear of Disappointment",
  ]),
  ...fearLabels("identity", [
    "Fear of Losing Identity",
    "Fear of Being Defined by Others",
    "Fear of Losing Authenticity",
    "Fear of Becoming Ordinary",
    "Fear of Losing Uniqueness",
    "Fear of Becoming Their Parents",
  ]),
  ...fearLabels("social", [
    "Fear of Loneliness",
    "Fear of Isolation",
    "Fear of Exclusion",
    "Fear of Public Speaking",
    "Fear of Visibility",
    "Fear of Being Different",
    "Fear of Being an Outsider",
  ]),
  ...fearLabels("safety", [
    "Fear of Death",
    "Fear of Violence",
    "Fear of Helplessness",
    "Fear of Chaos",
    "Fear of Uncertainty",
    "Fear of Disaster",
    "Fear of Survival Failure",
  ]),
  ...fearLabels("emotional", [
    "Fear of Emotional Pain",
    "Fear of Grief",
    "Fear of Heartbreak",
    "Fear of Hope",
    "Fear of Happiness",
    "Fear of Crying",
    "Fear of Feeling Too Much",
  ]),
  ...fearLabels("moral", [
    "Fear of Hurting Others",
    "Fear of Becoming Cruel",
    "Fear of Corruption",
    "Fear of Moral Failure",
    "Fear of Breaking Promises",
    "Fear of Becoming a Monster",
  ]),
  ...fearLabels("existential", [
    "Fear of Meaninglessness",
    "Fear of Oblivion",
    "Fear of Nonexistence",
    "Fear of Cosmic Insignificance",
    "Fear of Legacy Failure",
    "Fear of Living Without Purpose",
  ]),
  ...fearLabels("obsession", [
    "Fear of Emotional Replacement",
    "Fear of Losing Exclusivity",
    "Fear of Shared Attention",
    "Fear of Being Less Important",
    "Fear of Losing Priority",
    "Fear of One-Sided Love",
  ]),
  ...fearLabels("healing", [
    "Fear of Recovery",
    "Fear of Being Okay",
    "Fear of Trusting Again",
    "Fear of Accepting Love",
    "Fear of Belonging",
    "Fear of Safety",
    "Fear of Peace",
  ]),
] as const satisfies readonly FearSeedDefinition[]);

export const FEAR_VOCABULARY_TEMPLATE_KEYS = Object.freeze(
  Object.keys(FEAR_SEED_TEMPLATES).sort() as readonly FearTemplateKey[],
);

export const FEAR_VOCABULARY_SEEDS = Object.freeze(
  FEAR_SEED_DEFINITIONS.map((definition) => createFearFromTemplate(definition)),
) satisfies readonly FearSeed[];

export const FEAR_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  FEAR_VOCABULARY_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Core belief: ${seed.coreBelief}`,
        `Hidden need: ${seed.hiddenNeed}`,
      ].join(" "),
      examples: seed.examples,
      tags: [
        ...seed.tags,
        seed.fearType,
        seed.metadata.severity,
        `pacing:${seed.metadata.pacingPressure}`,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.triggers,
        ...seed.attachmentEffects,
        ...seed.compatibleWounds,
      ],
      oppositeSeeds: seed.oppositeSeeds,
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.routeGates,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.severity === "extreme" ? "rare" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictPotential,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function findFearVocabularySeedBySeed(seedId: string): FearSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return FEAR_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function getFearVocabularySeedsByType(
  fearType: FearSeedType,
): readonly FearSeed[] {
  return FEAR_VOCABULARY_SEEDS.filter((seed) => seed.fearType === fearType);
}

function createFearFromTemplate(definition: FearSeedDefinition): FearSeed {
  const template = FEAR_SEED_TEMPLATES[definition.template];
  return createFearSeedPreset({
    seed: definition.seed ?? toSeedId(definition.label),
    label: definition.label,
    description: definition.description ?? describeFear(definition.label, definition.template),
    examples: [
      `${definition.label} shapes how the character reads threat, safety, and intimacy.`,
      `${definition.label} may surface through ${template.earlyWarnings[0] ?? "subtle defensive tells"}.`,
      `${definition.label} softens when ${template.healingNeeds[0] ?? "care becomes consistent"}.`,
    ],
    tags: template.tags,
    relatedSeeds: [
      ...template.compatibleWounds,
      ...template.attachmentEffects,
      ...template.healingNeeds,
    ],
    oppositeSeeds: inferOppositeSeeds(definition.template),
    romanceHooks: template.romanceHooks,
    scenarioHooks: template.scenarioHooks,
    dialoguePatterns: template.dialoguePatterns,
    fearType: template.fearType,
    coreBelief: template.coreBelief,
    hiddenNeed: template.hiddenNeed,
    perceivedThreat: template.perceivedThreat,
    triggers: template.triggers,
    earlyWarnings: template.earlyWarnings,
    escalationPattern: template.escalationPattern,
    defenseMechanisms: template.defenseMechanisms,
    copingBehaviors: template.copingBehaviors,
    avoidancePatterns: template.avoidancePatterns,
    attachmentEffects: template.attachmentEffects,
    intimacyEffects: template.intimacyEffects,
    conflictEffects: template.conflictEffects,
    misreadSignals: template.misreadSignals,
    reassuranceNeeds: template.reassuranceNeeds,
    repairMethods: template.repairMethods,
    healingNeeds: template.healingNeeds,
    growthArcs: template.growthArcs,
    routeGates: template.routeGates,
    compatibleWounds: template.compatibleWounds,
    incompatibleDynamics: template.incompatibleDynamics,
    metadata: {
      severity: template.severity,
      romanceValue: template.romanceValue,
      angstValue: template.angstValue,
      conflictPotential: template.conflictPotential,
      healingValue: template.healingValue,
      pacingPressure: template.pacingPressure,
    },
  } satisfies FearSeedInput);
}

function fearLabels(
  template: FearTemplateKey,
  labels: readonly (string | { label: string; seed: string; description?: string })[],
): readonly FearSeedDefinition[] {
  return labels.map((entry) => {
    if (typeof entry === "string") {
      return { label: entry, template };
    }
    return { ...entry, template };
  });
}

function describeFear(label: string, template: FearTemplateKey): string {
  switch (template) {
    case "attachment":
      return `${label} makes distance feel like proof that connection is slipping away.`;
    case "self_worth":
      return `${label} makes mistakes and comparison feel like evidence of being unlovable.`;
    case "identity":
      return `${label} makes closeness or social pressure feel like a threat to selfhood.`;
    case "social":
      return `${label} makes visibility and group belonging feel conditional or unsafe.`;
    case "safety":
      return `${label} keeps the character alert for danger, instability, or helplessness.`;
    case "emotional":
      return `${label} makes strong feeling feel dangerous before it can become honest.`;
    case "moral":
      return `${label} makes ethical uncertainty feel like proof of possible corruption.`;
    case "existential":
      return `${label} makes ordinary life feel haunted by meaning, mortality, or legacy.`;
    case "obsession":
      return `${label} makes divided attention feel like a threat to emotional uniqueness.`;
    case "healing":
      return `${label} makes safety feel unfamiliar enough to resist or sabotage.`;
  }
}

function inferOppositeSeeds(template: FearTemplateKey): readonly string[] {
  switch (template) {
    case "attachment":
      return ["secure_attachment", "emotional_permanence", "trust_in_return"];
    case "self_worth":
      return ["self_acceptance", "secure_self_worth", "acceptance_after_failure"];
    case "identity":
      return ["authenticity", "chosen_closeness", "autonomy_respected"];
    case "social":
      return ["belonging", "chosen_family", "social_acceptance"];
    case "safety":
      return ["felt_safety", "predictability", "grounded_trust"];
    case "emotional":
      return ["safe_expression", "emotional_presence", "hope_allowed"];
    case "moral":
      return ["moral_self_trust", "accountability_repair", "earned_mercy"];
    case "existential":
      return ["meaningful_presence", "ordinary_life_matters", "purpose_with_love"];
    case "obsession":
      return ["secure_uniqueness", "clean_reassurance", "consensual_boundaries"];
    case "healing":
      return ["peace_allowed", "recovery_without_erasure", "safe_belonging"];
  }
}

function toSeedId(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
