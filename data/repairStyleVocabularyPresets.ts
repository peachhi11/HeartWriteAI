import {
  createRepairStyleSeedPreset,
  createVocabularySeedPreset,
  type RepairStyleSeed,
  type RepairStyleSeedReliability,
  type RepairStyleSeedType,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type RepairStyleCategory = RepairStyleSeedType;

type RepairStyleDefaults = {
  tags: readonly string[];
  relatedSeeds: readonly string[];
  oppositeSeeds: readonly string[];
  romanceHooks: readonly string[];
  scenarioHooks: readonly string[];
  dialoguePatterns: readonly string[];
};

type RepairStyleOverride = {
  label?: string;
  description?: string;
  examples?: readonly string[];
  tags?: readonly string[];
  relatedSeeds?: readonly string[];
  oppositeSeeds?: readonly string[];
  romanceHooks?: readonly string[];
  scenarioHooks?: readonly string[];
  dialoguePatterns?: readonly string[];
  repairsBestFor?: readonly string[];
  weakForRuptures?: readonly string[];
  coreRepairMessage?: string;
  emotionalNeedMet?: string;
  failureMode?: string;
  requiredConditions?: readonly string[];
  repairActions?: readonly string[];
  timingNeeds?: readonly string[];
  conflictEffects?: readonly string[];
  attachmentEffects?: readonly string[];
  intimacyEffects?: readonly string[];
  misreadByOthersAs?: readonly string[];
  compatibleWounds?: readonly string[];
  compatibleFears?: readonly string[];
  compatibleConflictStyles?: readonly string[];
  incompatibleDynamics?: readonly string[];
  routeGates?: readonly string[];
  growthArcs?: readonly string[];
  metadata?: {
    reliability?: RepairStyleSeedReliability;
    romanceValue?: number;
    angstValue?: number;
    conflictResolutionValue?: number;
    healingValue?: number;
    pacingPressure?: "low" | "medium" | "high";
  };
};

export const repairDefaultsByType = {
  verbal: {
    tags: ["communication", "reassurance", "emotional_clarity"],
    relatedSeeds: ["verbal_reassurance_repair", "truth_telling_repair"],
    oppositeSeeds: ["silent_nonrepair", "avoidant_deflection"],
    romanceHooks: ["soft_reassurance_after_conflict", "honest_apology_scene"],
    scenarioHooks: ["post_argument_talk", "miscommunication_repair"],
    dialoguePatterns: [
      "I need to say this clearly.",
      "You deserved better from me.",
      "I am sorry, and I mean it.",
    ],
  },
  accountability: {
    tags: ["accountability", "trust_rebuilding", "changed_behavior"],
    relatedSeeds: ["ownership_repair", "behavior_change_repair"],
    oppositeSeeds: ["excuse_making", "blame_shifting"],
    romanceHooks: ["earned_trust_after_rupture", "changed_behavior_as_love"],
    scenarioHooks: ["broken_promise_repair", "betrayal_aftermath"],
    dialoguePatterns: [
      "That was on me.",
      "I will not ask you to trust words alone.",
      "Let me prove it differently.",
    ],
  },
  behavioral: {
    tags: ["actions_over_words", "reliability", "service"],
    relatedSeeds: ["acts_of_service_repair", "follow_through_repair"],
    oppositeSeeds: ["empty_promise", "performative_apology"],
    romanceHooks: ["love_shown_through_action", "quiet_devotion_repair"],
    scenarioHooks: ["practical_help_after_conflict", "showing_up_scene"],
    dialoguePatterns: [
      "I know words are not enough.",
      "Let me show you.",
      "I will be here tomorrow too.",
    ],
  },
  reassurance: {
    tags: ["reassurance", "attachment_security", "emotional_continuity"],
    relatedSeeds: ["attachment_reassurance_repair", "return_and_stay_repair"],
    oppositeSeeds: ["hot_cold_affection", "silent_treatment"],
    romanceHooks: ["promise_after_fear", "secure_return_scene"],
    scenarioHooks: ["missed_message_repair", "abandonment_trigger_repair"],
    dialoguePatterns: [
      "You still matter to me.",
      "This did not change how I feel.",
      "I choose you.",
    ],
  },
  presence: {
    tags: ["presence", "emotional_safety", "no_abandonment"],
    relatedSeeds: ["stay_with_them_repair", "holding_space_repair"],
    oppositeSeeds: ["abandonment_response", "emotional_absence"],
    romanceHooks: ["i_am_not_leaving_scene", "safe_presence_after_breakdown"],
    scenarioHooks: ["panic_grounding_scene", "silent_after_argument"],
    dialoguePatterns: [
      "I am here.",
      "I am not leaving because this got hard.",
      "We can sit with it.",
    ],
  },
  space_based: {
    tags: ["boundaries", "autonomy", "processing_time"],
    relatedSeeds: ["return_after_space_repair", "choice_restoration_repair"],
    oppositeSeeds: ["pursuit_pressure", "boundary_violation"],
    romanceHooks: ["space_with_return", "autonomy_respected_as_love"],
    scenarioHooks: ["cooldown_after_fight", "boundary_reset_scene"],
    dialoguePatterns: [
      "Take the time you need.",
      "I will come back when you are ready.",
      "Space is not abandonment.",
    ],
  },
  physical_comfort: {
    tags: ["safe_touch", "comfort", "grounding"],
    relatedSeeds: ["safe_touch_repair", "hand_holding_repair"],
    oppositeSeeds: ["touch_avoidance", "physical_distance"],
    romanceHooks: ["safe_touch_after_conflict", "hand_holding_grounding"],
    scenarioHooks: ["panic_grounding", "quiet_comfort_scene"],
    dialoguePatterns: [
      "Can I hold your hand?",
      "Only if you want me close.",
      "Breathe with me.",
    ],
  },
  acts_of_service: {
    tags: ["acts_of_service", "practical_care", "follow_through"],
    relatedSeeds: ["acts_of_service_repair", "everyday_effort_repair"],
    oppositeSeeds: ["empty_promise", "care_without_consent"],
    romanceHooks: ["care_in_action", "ordinary_love_after_conflict"],
    scenarioHooks: ["practical_help_after_conflict", "quiet_domestic_repair"],
    dialoguePatterns: [
      "I fixed what I could first.",
      "You should not have had to carry that alone.",
      "Let me help in a way that actually helps.",
    ],
  },
  ritual: {
    tags: ["ritual", "routine", "relationship_continuity"],
    relatedSeeds: ["check_in_ritual_repair", "reconnection_ritual_repair"],
    oppositeSeeds: ["ritual_disruption", "emotional_discontinuity"],
    romanceHooks: ["small_ritual_restored", "routine_becomes_safety"],
    scenarioHooks: ["goodnight_text_returns", "coffee_after_conflict"],
    dialoguePatterns: [
      "I made your tea.",
      "I did not want our ritual to disappear.",
      "Can we start again here?",
    ],
  },
  vulnerability: {
    tags: ["vulnerability", "honesty", "softness"],
    relatedSeeds: ["mutual_honesty_repair", "fear_disclosure_repair"],
    oppositeSeeds: ["emotional_armor", "deflection_response"],
    romanceHooks: ["guard_drops_after_conflict", "honesty_as_intimacy"],
    scenarioHooks: ["late_night_confession", "fear_reveal_scene"],
    dialoguePatterns: [
      "I was scared.",
      "That is not an excuse, but it is the truth.",
      "I am trying to let you see me.",
    ],
  },
  collaborative: {
    tags: ["teamwork", "communication", "mutual_repair"],
    relatedSeeds: ["team_repair", "boundary_reset_repair"],
    oppositeSeeds: ["one_sided_repair", "blame_loop"],
    romanceHooks: ["partners_against_the_problem", "relationship_maintenance"],
    scenarioHooks: ["conflict_debrief", "future_planning_after_rupture"],
    dialoguePatterns: [
      "How do we fix this together?",
      "I do not want to win. I want us to understand.",
      "Let us make a better pattern.",
    ],
  },
  devotional: {
    tags: ["devotion", "priority", "loyalty"],
    relatedSeeds: ["i_choose_you_repair", "public_loyalty_repair"],
    oppositeSeeds: ["emotional_ambiguity", "disloyalty"],
    romanceHooks: ["chosen_again_scene", "public_loyalty_as_repair"],
    scenarioHooks: ["rival_forces_choice", "public_side_taken"],
    dialoguePatterns: [
      "I choose you.",
      "Not because it is easy. Because it is true.",
      "You are not second place.",
    ],
  },
  attachment: {
    tags: ["attachment", "security", "safe_return"],
    relatedSeeds: ["safe_return_repair", "attachment_security_repair"],
    oppositeSeeds: ["abandonment_rupture", "inconsistent_affection"],
    romanceHooks: ["secure_base_scene", "return_after_fear"],
    scenarioHooks: ["separation_repair", "fear_reduction_scene"],
    dialoguePatterns: [
      "I came back.",
      "You can count on my return.",
      "I will not make you guess where you stand.",
    ],
  },
  shame: {
    tags: ["shame_repair", "dignity", "acceptance"],
    relatedSeeds: ["dignity_restoration_repair", "nonjudgment_repair"],
    oppositeSeeds: ["humiliation", "public_shaming"],
    romanceHooks: ["seen_without_judgment", "protected_after_exposure"],
    scenarioHooks: ["public_embarrassment_aftermath", "private_comfort"],
    dialoguePatterns: [
      "You are not ridiculous.",
      "I am not ashamed of you.",
      "Look at me. You are still safe.",
    ],
  },
  betrayal: {
    tags: ["betrayal_repair", "transparency", "earned_trust"],
    relatedSeeds: ["truth_and_accountability_repair", "proof_of_change_repair"],
    oppositeSeeds: ["hidden_agenda", "continued_deception"],
    romanceHooks: ["earned_trust_slow_burn", "truth_after_lie"],
    scenarioHooks: ["after_the_betrayal", "trust_rebuilding_arc"],
    dialoguePatterns: [
      "I thought I could trust you.",
      "How could I ever believe another word you tell me?",
      "I broke it. I will not rush you to heal it.",
    ],
  },
  identity: {
    tags: ["autonomy", "identity", "agency"],
    relatedSeeds: ["agency_restoration_repair", "boundary_respect_repair"],
    oppositeSeeds: ["control_damage", "engulfment_pressure"],
    romanceHooks: ["choice_restored_as_love", "seen_as_self"],
    scenarioHooks: ["boundary_violation_repair", "forced_role_aftermath"],
    dialoguePatterns: [
      "Your choice matters.",
      "I should not have decided for you.",
      "Tell me what you want.",
    ],
  },
  romantic: {
    tags: ["romance", "love_language", "recommitment"],
    relatedSeeds: ["chosen_again_repair", "shared_future_repair"],
    oppositeSeeds: ["romantic_avoidance", "emotional_ambiguity"],
    romanceHooks: ["second_confession", "forever_language_after_conflict"],
    scenarioHooks: ["date_night_repair", "relationship_recommitment"],
    dialoguePatterns: [
      "I still want us.",
      "Let me love you better.",
      "This is not the end of us.",
    ],
  },
  domestic: {
    tags: ["domesticity", "care", "ordinary_love"],
    relatedSeeds: ["tea_and_talk_repair", "everyday_love_repair"],
    oppositeSeeds: ["domestic_neglect", "emotional_absence"],
    romanceHooks: ["home_as_repair", "ordinary_care_after_angst"],
    scenarioHooks: ["cooked_meal_after_fight", "quiet_morning_repair"],
    dialoguePatterns: [
      "I made breakfast.",
      "It is not enough, but it is a start.",
      "Come home. We can talk there.",
    ],
  },
  protective: {
    tags: ["protection", "safety", "guardian"],
    relatedSeeds: ["safe_haven_repair", "stand_beside_you_repair"],
    oppositeSeeds: ["control_disguised_as_care", "abandonment_in_danger"],
    romanceHooks: ["protection_without_control", "stand_beside_not_over"],
    scenarioHooks: ["danger_after_conflict", "rescue_aftermath"],
    dialoguePatterns: [
      "I should have stood beside you.",
      "Not over you. Beside you.",
      "Your safety matters, but so does your choice.",
    ],
  },
  healing: {
    tags: ["healing", "growth", "trust"],
    relatedSeeds: ["learning_to_trust_repair", "learning_to_receive_care_repair"],
    oppositeSeeds: ["stuck_in_survival_mode", "refusing_repair"],
    romanceHooks: ["healing_together", "safe_love_becomes_believable"],
    scenarioHooks: ["post_breakdown_repair", "long_term_healing_arc"],
    dialoguePatterns: [
      "We do not have to fix it all tonight.",
      "Healing can be slow.",
      "I will learn this with you.",
    ],
  },
  meta: {
    tags: ["meta_repair", "relationship_growth", "continuity"],
    relatedSeeds: ["repair_through_consistency", "repair_through_time"],
    oppositeSeeds: ["emotional_amnesia", "consequence_reset"],
    romanceHooks: ["love_proven_over_time", "relationship_pattern_changes"],
    scenarioHooks: ["long_arc_repair", "pattern_breaking_route"],
    dialoguePatterns: [
      "One apology will not change the pattern.",
      "Then I will change the pattern.",
      "Let time prove what words cannot.",
    ],
  },
} as const satisfies Record<RepairStyleSeedType, RepairStyleDefaults>;

export const repairTypeByPreset = {
  "Verbal Reassurance Repair": "verbal",
  "Direct Apology Repair": "verbal",
  "Validation Repair": "verbal",
  "Truth-Telling Repair": "verbal",
  "Clarification Repair": "verbal",
  "Explanation Repair": "verbal",
  "Confession Repair": "verbal",
  "Emotional Transparency Repair": "verbal",
  "Letter Writing Repair": "verbal",
  "Heart-to-Heart Repair": "verbal",
  "Accountability Repair": "accountability",
  "Ownership Repair": "accountability",
  "Responsibility Repair": "accountability",
  "Behavior Change Repair": "accountability",
  "Pattern Breaking Repair": "accountability",
  "Commitment Repair": "accountability",
  "Recommitment Repair": "accountability",
  "Promise Repair": "accountability",
  "Consistency Repair": "accountability",
  "Trust Rebuilding Repair": "accountability",
  "Broken Promise Repair": "accountability",
  "Actions Over Words Repair": "behavioral",
  "Acts of Service Repair": "acts_of_service",
  "Practical Help Repair": "behavioral",
  "Reliability Repair": "behavioral",
  "Showing Up Repair": "behavioral",
  "Follow-Through Repair": "behavioral",
  "Demonstration Repair": "behavioral",
  "Proof Through Action Repair": "behavioral",
  "Everyday Effort Repair": "behavioral",
  "Presence-Based Repair": "presence",
  "Stay With Them Repair": "presence",
  "Silent Presence Repair": "presence",
  "Emotional Availability Repair": "presence",
  "Witnessing Repair": "presence",
  "Holding Space Repair": "presence",
  "Steady Presence Repair": "presence",
  "No-Abandonment Repair": "presence",
  "Shared Silence Repair": "presence",
  "Grounding Presence Repair": "presence",
  "After the Silence Repair": "presence",
  "Attachment Reassurance Repair": "reassurance",
  "Safety Reassurance Repair": "reassurance",
  "Priority Reassurance Repair": "reassurance",
  "Exclusivity Reassurance Repair": "reassurance",
  "Commitment Reassurance Repair": "reassurance",
  "Belonging Reassurance Repair": "reassurance",
  "Worthiness Reassurance Repair": "reassurance",
  "Loyalty Reassurance Repair": "reassurance",
  "Return-and-Stay Repair": "reassurance",
  "Vulnerability Repair": "vulnerability",
  "Mutual Honesty Repair": "vulnerability",
  "Fear Disclosure Repair": "vulnerability",
  "Trauma Disclosure Repair": "vulnerability",
  "Emotional Exposure Repair": "vulnerability",
  "Softness Repair": "vulnerability",
  "Letting Guard Down Repair": "vulnerability",
  "Needs Expression Repair": "vulnerability",
  "Shame Sharing Repair": "vulnerability",
  "Authenticity Repair": "vulnerability",
  "Physical Comfort Repair": "physical_comfort",
  "Safe Touch Repair": "physical_comfort",
  "Hand Holding Repair": "physical_comfort",
  "Hug Repair": "physical_comfort",
  "Forehead Touch Repair": "physical_comfort",
  "Cuddle Repair": "physical_comfort",
  "Physical Reassurance Repair": "physical_comfort",
  "Comfort Contact Repair": "physical_comfort",
  "Touch-Based Grounding Repair": "physical_comfort",
  "Space-Based Repair": "space_based",
  "Cooling Off Repair": "space_based",
  "Return After Space Repair": "space_based",
  "Respecting Boundaries Repair": "space_based",
  "Processing Time Repair": "space_based",
  "Low Pressure Repair": "space_based",
  "Distance With Return Repair": "space_based",
  "No Pursuit Repair": "space_based",
  "Autonomy Repair": "identity",
  "Choice Restoration Repair": "identity",
  "Agency Restoration Repair": "identity",
  "Boundary Respect Repair": "identity",
  "Identity Validation Repair": "identity",
  "Freedom Repair": "identity",
  "Individuality Protection Repair": "identity",
  "Control Damage Repair": "identity",
  "Selfhood Repair": "identity",
  "Collaborative Problem Solving Repair": "collaborative",
  "Team Repair": "collaborative",
  "Mutual Responsibility Repair": "collaborative",
  "Conflict Debrief Repair": "collaborative",
  "Future Planning Repair": "collaborative",
  "Shared Understanding Repair": "collaborative",
  "Repair Conversation Repair": "collaborative",
  "Negotiation Repair": "collaborative",
  "Boundary Reset Repair": "collaborative",
  "Relationship Maintenance Repair": "collaborative",
  "After the Fight Repair": "collaborative",
  "Ritual Repair": "ritual",
  "Goodnight Ritual Repair": "ritual",
  "Check-In Ritual Repair": "ritual",
  "Coffee Ritual Repair": "ritual",
  "Reconnection Ritual Repair": "ritual",
  "Symbolic Gesture Repair": "ritual",
  "Anniversary Ritual Repair": "ritual",
  "Comfort Ritual Repair": "ritual",
  "Shared Routine Repair": "ritual",
  "Tradition Restoration Repair": "ritual",
  "Devotional Repair": "devotional",
  "I Choose You Repair": "devotional",
  "Public Loyalty Repair": "devotional",
  "Private Loyalty Repair": "devotional",
  "Protective Devotion Repair": "devotional",
  "Acts of Devotion Repair": "devotional",
  "Demonstrated Priority Repair": "devotional",
  "Favorite Person Repair": "devotional",
  "Ride-or-Die Repair": "devotional",
  "Homecoming Repair": "devotional",
  "Abandonment Repair": "attachment",
  "Rejection Repair": "attachment",
  "Replacement Repair": "attachment",
  "Trust Repair": "attachment",
  "Attachment Security Repair": "attachment",
  "Fear Reduction Repair": "attachment",
  "Safe Return Repair": "attachment",
  "Emotional Permanence Repair": "attachment",
  "Attachment Rebuilding Repair": "attachment",
  "Secure Base Repair": "attachment",
  "Return After Leaving Repair": "attachment",
  "After the Goodbye Repair": "attachment",
  "Dignity Restoration Repair": "shame",
  "Humiliation Repair": "shame",
  "Validation After Shame Repair": "shame",
  "Private Comfort Repair": "shame",
  "Protective Defense Repair": "shame",
  "Gentle Acceptance Repair": "shame",
  "Nonjudgment Repair": "shame",
  "Self-Worth Repair": "shame",
  "Reassurance After Exposure Repair": "shame",
  "Public Support Repair": "shame",
  "Betrayal Repair": "betrayal",
  "Transparency Repair": "betrayal",
  "Truth and Accountability Repair": "betrayal",
  "Trust Restoration Repair": "betrayal",
  "Consistency After Betrayal Repair": "betrayal",
  "Proof of Change Repair": "betrayal",
  "Rebuilding Safety Repair": "betrayal",
  "Patient Repair": "betrayal",
  "Long-Term Repair": "betrayal",
  "Earned Trust Repair": "betrayal",
  "After the Betrayal Repair": "betrayal",
  "After the Lie Repair": "betrayal",
  "Love Language Repair": "romantic",
  "Grand Gesture Repair": "romantic",
  "Small Gesture Repair": "romantic",
  "Romantic Reassurance Repair": "romantic",
  "Mutual Vulnerability Repair": "romantic",
  "Chosen Again Repair": "romantic",
  "Date Night Repair": "romantic",
  "Shared Future Repair": "romantic",
  "Forever Language Repair": "romantic",
  "Cooked Meal Repair": "domestic",
  "Tea and Talk Repair": "domestic",
  "Laundry and Care Repair": "domestic",
  "Home Maintenance Repair": "domestic",
  "Domestic Routine Repair": "domestic",
  "Quiet Domesticity Repair": "domestic",
  "Caretaking Repair": "domestic",
  "Sick Day Repair": "domestic",
  "Acts of Home Repair": "domestic",
  "Everyday Love Repair": "domestic",
  "Protective Repair": "protective",
  "Safety First Repair": "protective",
  "Stand Beside You Repair": "protective",
  "Stand Between You and Danger Repair": "protective",
  "Shield Repair": "protective",
  "Guardian Repair": "protective",
  "Safe Haven Repair": "protective",
  "Caretaker Repair": "protective",
  "Rescue Repair": "protective",
  "I Am Here Repair": "protective",
  "Second Chance Repair": "healing",
  "Redemption Repair": "healing",
  "Forgiveness Repair": "healing",
  "Learning to Trust Repair": "healing",
  "Learning to Receive Care Repair": "healing",
  "Learning to Stay Repair": "healing",
  "Learning to Be Seen Repair": "healing",
  "Learning to Ask for Help Repair": "healing",
  "Learning to Need People Repair": "healing",
  "Learning to Rest Repair": "healing",
  "Learning to Forgive Repair": "healing",
  "Learning to Belong Repair": "healing",
  "Learning to Love Repair": "healing",
  "Repair Through Consistency": "meta",
  "Repair Through Time": "meta",
  "Repair Through Growth": "meta",
  "Repair Through Understanding": "meta",
  "Repair Through Patience": "meta",
  "Repair Through Reliability": "meta",
  "Repair Through Acceptance": "meta",
  "Repair Through Communication": "meta",
  "Repair Through Safety": "meta",
  "Repair Through Love": "meta",
} as const satisfies Record<string, RepairStyleSeedType>;

type RepairStylePresetLabel = keyof typeof repairTypeByPreset;

export const repairStylePresets = Object.freeze(
  Object.keys(repairTypeByPreset) as RepairStylePresetLabel[],
) satisfies readonly RepairStylePresetLabel[];

const REPAIR_STYLE_TYPES = Object.freeze(
  Object.keys(repairDefaultsByType),
) as readonly RepairStyleSeedType[];

export const repairStyleCategories = Object.freeze(
  REPAIR_STYLE_TYPES.reduce(
    (categories, repairType) => ({
      ...categories,
      [repairType]: repairStylePresets
        .filter((label) => getRepairTypeForLabel(label) === repairType)
        .map(toSeedKey),
    }),
    {} as Record<RepairStyleCategory, readonly string[]>,
  ),
) satisfies Record<RepairStyleCategory, readonly string[]>;

export const repairExpansionLogic = {
  rupture_to_repair: {
    broken_promise_rupture: [
      "behavior_change_repair",
      "accountability_repair",
      "recommitment_repair",
      "broken_promise_repair",
    ],
    abandonment_rupture: [
      "presence_based_repair",
      "verbal_reassurance_repair",
      "ritual_repair",
      "safe_return_repair",
    ],
    betrayal_rupture: [
      "truth_telling_repair",
      "accountability_repair",
      "behavior_change_repair",
      "earned_trust_repair",
    ],
    humiliation_rupture: [
      "dignity_restoration_repair",
      "direct_apology_repair",
      "protective_repair",
      "private_comfort_repair",
    ],
    invalidation_rupture: [
      "validation_repair",
      "vulnerability_repair",
      "collaborative_problem_solving_repair",
      "shared_understanding_repair",
    ],
    boundary_violation_rupture: [
      "boundary_reset_repair",
      "accountability_repair",
      "space_based_repair",
      "choice_restoration_repair",
    ],
  },
  wound_to_repair_preference: {
    abandonment_wound: [
      "presence_based_repair",
      "verbal_reassurance_repair",
      "ritual_repair",
      "attachment_security_repair",
    ],
    betrayal_wound: [
      "truth_telling_repair",
      "behavior_change_repair",
      "accountability_repair",
      "transparency_repair",
    ],
    emotional_neglect_wound: [
      "presence_based_repair",
      "validation_repair",
      "acts_of_service_repair",
      "everyday_love_repair",
    ],
    humiliation_wound: [
      "dignity_restoration_repair",
      "private_comfort_repair",
      "reassurance_after_exposure_repair",
      "nonjudgment_repair",
    ],
    control_wound: [
      "space_based_repair",
      "boundary_respect_repair",
      "choice_restoration_repair",
      "agency_restoration_repair",
    ],
  },
  conflict_style_to_repair: {
    withdrawer_conflict_style: [
      "space_based_repair",
      "presence_based_repair",
      "return_after_space_repair",
      "low_pressure_repair",
    ],
    pursuer_conflict_style: [
      "verbal_reassurance_repair",
      "check_in_ritual_repair",
      "return_and_stay_repair",
      "attachment_reassurance_repair",
    ],
    explosive_conflict_style: [
      "accountability_repair",
      "cooling_off_repair",
      "behavior_change_repair",
      "conflict_debrief_repair",
    ],
    intellectual_conflict_style: [
      "collaborative_problem_solving_repair",
      "truth_telling_repair",
      "emotional_transparency_repair",
      "shared_understanding_repair",
    ],
    fawn_conflict_style: [
      "boundary_reset_repair",
      "mutual_responsibility_repair",
      "identity_validation_repair",
      "selfhood_repair",
    ],
  },
} as const;

const REPAIR_STYLE_OVERRIDES: Record<string, RepairStyleOverride> = {
  verbal_reassurance_repair: {
    label: "Verbal Reassurance Repair",
    description:
      "Repairs rupture through clear words of care, commitment, validation, and emotional reassurance.",
    examples: [
      "Says directly that they are not leaving.",
      "Names the hurt and reassures the relationship.",
      "Uses explicit commitment language after fear is triggered.",
    ],
    tags: ["reassurance", "communication", "attachment", "emotional_safety"],
    relatedSeeds: [
      "reassurance_seeking_response",
      "fear_of_abandonment",
      "emotional_safety",
      "secure_attachment",
    ],
    oppositeSeeds: ["silent_repair", "avoidant_nonrepair", "deflection_response"],
    romanceHooks: [
      "i_am_not_leaving_scene",
      "promise_after_conflict",
      "soft_reassurance_after_spiral",
    ],
    scenarioHooks: [
      "missed_message_repair",
      "post_argument_check_in",
      "abandonment_trigger_repair",
    ],
    dialoguePatterns: [
      "I will be gone for a while, but I will always eventually come back to you. I promise.",
      "This will be our last conversation for a while. But it will never be the last.",
      "You matter to me, even when this is hard.",
    ],
    repairsBestFor: [
      "abandonment_rupture",
      "miscommunication_rupture",
      "reassurance_deficit",
      "emotional_distance_trigger",
    ],
    weakForRuptures: [
      "repeated_broken_promise",
      "major_betrayal",
      "boundary_violation_without_action",
    ],
    coreRepairMessage: "The relationship is still safe, and care is still present.",
    emotionalNeedMet: "Reassurance, emotional continuity, and felt priority.",
    failureMode: "Words without changed behavior become empty promises.",
    requiredConditions: ["honesty", "specificity", "no_mocking_need", "follow_through"],
    repairActions: [
      "name_the_hurt",
      "state_care_clearly",
      "promise_realistic_return",
      "check_for_understanding",
    ],
    timingNeeds: [
      "best_soon_after_rupture",
      "repeat_if_abandonment_triggered",
      "combine_with_behavioral_follow_through",
    ],
    conflictEffects: ["reduces_panic", "softens_pursuer_response", "prevents_emotional_spiral"],
    attachmentEffects: [
      "builds_secure_return",
      "strengthens_reassurance_memory",
      "lowers_abandonment_sensitivity_over_time",
    ],
    intimacyEffects: [
      "makes_vulnerability_safer",
      "encourages_direct_need_expression",
      "supports_confession_readiness",
    ],
    misreadByOthersAs: ["overexplaining", "neediness", "too_much_talking"],
    compatibleWounds: ["abandonment_wound", "emotional_neglect_wound", "rejection_wound"],
    compatibleFears: [
      "fear_of_abandonment",
      "fear_of_rejection",
      "fear_of_emotional_distance",
    ],
    compatibleConflictStyles: [
      "pursuer_conflict_style",
      "anxious_conflict_style",
      "emotionally_expressive_conflict_style",
    ],
    incompatibleDynamics: [
      "chronic_empty_promises",
      "weaponized_reassurance",
      "hot_cold_affection",
    ],
    routeGates: [
      "first_reassurance_repair_gate",
      "first_i_am_not_leaving_gate",
      "secure_return_gate",
    ],
    growthArcs: [
      "learns_to_reassure_clearly",
      "turns_intention_into_words",
      "backs_reassurance_with_action",
    ],
    metadata: {
      reliability: "high",
      romanceValue: 10,
      angstValue: 6,
      conflictResolutionValue: 9,
      healingValue: 10,
      pacingPressure: "medium",
    },
  },
};

export const REPAIR_STYLE_VOCABULARY_SEEDS = Object.freeze(
  repairStylePresets.map(makeRepairStyleSeed),
) satisfies readonly RepairStyleSeed[];

export const REPAIR_STYLE_VOCABULARY_STANDARD_SEEDS = Object.freeze(
  REPAIR_STYLE_VOCABULARY_SEEDS.map((seed) =>
    createVocabularySeedPreset({
      seed: seed.seed,
      label: seed.label,
      description: [
        seed.description,
        `Core repair message: ${seed.coreRepairMessage}`,
        `Emotional need met: ${seed.emotionalNeedMet}`,
        `Failure mode: ${seed.failureMode}`,
      ].join(" "),
      examples: [
        ...seed.examples,
        ...seed.repairActions,
        ...seed.timingNeeds,
      ],
      tags: [
        ...seed.tags,
        "repair_style",
        seed.repairType,
        `reliability:${seed.metadata.reliability}`,
        `pacing:${seed.metadata.pacingPressure}`,
      ],
      relatedSeeds: [
        ...seed.relatedSeeds,
        ...seed.repairsBestFor,
        ...seed.requiredConditions,
        ...seed.conflictEffects,
        ...seed.attachmentEffects,
        ...seed.intimacyEffects,
        ...seed.compatibleWounds,
        ...seed.compatibleFears,
        ...seed.compatibleConflictStyles,
        ...seed.growthArcs,
      ],
      oppositeSeeds: [
        ...seed.oppositeSeeds,
        ...seed.weakForRuptures,
        ...seed.misreadByOthersAs,
        ...seed.incompatibleDynamics,
      ],
      romanceHooks: seed.romanceHooks,
      scenarioHooks: [
        ...seed.scenarioHooks,
        ...seed.routeGates,
      ],
      dialoguePatterns: seed.dialoguePatterns,
      metadata: {
        rarity: seed.metadata.reliability === "low" ? "rare" : "uncommon",
        romanceValue: seed.metadata.romanceValue,
        conflictPotential: seed.metadata.conflictResolutionValue,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function findRepairStyleVocabularySeedBySeed(
  seedId: string,
): RepairStyleSeed | undefined {
  const normalizedSeedId = seedId.trim().toLowerCase();
  return REPAIR_STYLE_VOCABULARY_SEEDS.find(
    (seed) => seed.seed.toLowerCase() === normalizedSeedId,
  );
}

export function getRepairStyleVocabularySeedsByType(
  repairType: RepairStyleSeedType,
): readonly RepairStyleSeed[] {
  return REPAIR_STYLE_VOCABULARY_SEEDS.filter((seed) => seed.repairType === repairType);
}

export function getRepairStyleVocabularySeedsByCategory(
  category: RepairStyleCategory,
): readonly RepairStyleSeed[] {
  const seedIds = new Set<string>(repairStyleCategories[category]);
  return REPAIR_STYLE_VOCABULARY_SEEDS.filter((seed) => seedIds.has(seed.seed));
}

export function makeRepairStyleSeed(label: string): RepairStyleSeed {
  const repairType = getRepairTypeForLabel(label) ?? (
    label.includes("Repair Through") ? "meta" : "verbal"
  );
  const defaults = repairDefaultsByType[repairType];
  const seed = toSeedKey(label);
  const override = REPAIR_STYLE_OVERRIDES[seed];
  const readableRepairType = repairType.replace(/_/g, " ");

  return createRepairStyleSeedPreset({
    seed,
    label: override?.label ?? label,
    description:
      override?.description ??
      `${label} is a relationship repair style that restores emotional safety after rupture through ${readableRepairType}.`,
    examples: override?.examples ?? [
      `${label} can appear after conflict, misunderstanding, betrayal, shame, silence, or distance.`,
      `${label} works best when the repair matches the actual hurt instead of bypassing it.`,
      `${label} becomes meaningful when repeated consistently enough to become evidence of change.`,
    ],
    tags: unique([
      ...defaults.tags,
      repairType,
      seed,
      ...(override?.tags ?? []),
    ]),
    relatedSeeds: override?.relatedSeeds ?? defaults.relatedSeeds,
    oppositeSeeds: override?.oppositeSeeds ?? defaults.oppositeSeeds,
    romanceHooks: override?.romanceHooks ?? defaults.romanceHooks,
    scenarioHooks: override?.scenarioHooks ?? defaults.scenarioHooks,
    dialoguePatterns: override?.dialoguePatterns ?? defaults.dialoguePatterns,
    repairType,
    repairsBestFor: override?.repairsBestFor ?? defaultRepairsBestFor(repairType),
    weakForRuptures: override?.weakForRuptures ?? defaultWeakForRuptures(repairType),
    coreRepairMessage:
      override?.coreRepairMessage ??
      defaultCoreRepairMessage(label, repairType),
    emotionalNeedMet:
      override?.emotionalNeedMet ??
      defaultEmotionalNeedMet(repairType),
    failureMode:
      override?.failureMode ??
      defaultFailureMode(repairType),
    requiredConditions:
      override?.requiredConditions ??
      defaultRequiredConditions(repairType),
    repairActions:
      override?.repairActions ??
      defaultRepairActions(label, repairType),
    timingNeeds:
      override?.timingNeeds ??
      defaultTimingNeeds(repairType),
    conflictEffects:
      override?.conflictEffects ??
      defaultConflictEffects(repairType),
    attachmentEffects:
      override?.attachmentEffects ??
      defaultAttachmentEffects(repairType),
    intimacyEffects:
      override?.intimacyEffects ??
      defaultIntimacyEffects(repairType),
    misreadByOthersAs:
      override?.misreadByOthersAs ??
      defaultMisreadByOthersAs(repairType),
    compatibleWounds:
      override?.compatibleWounds ??
      defaultCompatibleWounds(repairType),
    compatibleFears:
      override?.compatibleFears ??
      defaultCompatibleFears(repairType),
    compatibleConflictStyles:
      override?.compatibleConflictStyles ??
      defaultCompatibleConflictStyles(repairType),
    incompatibleDynamics:
      override?.incompatibleDynamics ??
      defaultIncompatibleDynamics(repairType),
    routeGates: override?.routeGates ?? [
      `${seed}_gate`,
      `${repairType}_repair_route`,
    ],
    growthArcs:
      override?.growthArcs ??
      defaultGrowthArcs(repairType),
    metadata: {
      category: "repair_style",
      reliability: defaultReliability(repairType),
      romanceValue: defaultRomanceValue(repairType),
      angstValue: defaultAngstValue(repairType),
      conflictResolutionValue: defaultConflictResolutionValue(repairType),
      healingValue: 10,
      pacingPressure: defaultPacingPressure(repairType),
      ...override?.metadata,
    },
  });
}

function getRepairTypeForLabel(label: string): RepairStyleSeedType | undefined {
  return repairTypeByPreset[label as RepairStylePresetLabel];
}

function defaultRepairsBestFor(repairType: RepairStyleSeedType): readonly string[] {
  switch (repairType) {
    case "betrayal":
      return ["betrayal_rupture", "broken_promise_rupture", "trust_loss"];
    case "attachment":
    case "reassurance":
    case "presence":
      return ["abandonment_rupture", "emotional_distance_trigger", "reassurance_deficit"];
    case "shame":
      return ["humiliation_rupture", "public_embarrassment_trigger", "invalidation_rupture"];
    case "identity":
    case "space_based":
      return ["boundary_violation_rupture", "control_wound_activation", "autonomy_threat"];
    case "physical_comfort":
      return ["safety_trigger", "panic_grounding_need", "hurt_comfort_scene"];
    default:
      return ["miscommunication_rupture", "conflict_aftercare", "relationship_pattern_repair"];
  }
}

function defaultWeakForRuptures(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "verbal" || repairType === "reassurance") {
    return ["repeated_broken_promise", "major_betrayal", "boundary_violation_without_action"];
  }
  if (repairType === "physical_comfort") {
    return ["touch_boundary_violation", "unwanted_contact", "truth_withheld_rupture"];
  }
  if (repairType === "space_based") {
    return ["abandonment_panic_without_return_plan", "urgent_safety_rupture"];
  }
  return ["repair_mismatch", "unacknowledged_harm", "forced_forgiveness"];
}

function defaultCoreRepairMessage(
  label: string,
  repairType: RepairStyleSeedType,
): string {
  if (repairType === "meta") {
    return "Repair becomes believable through time, continuity, and changed patterns.";
  }
  if (repairType === "betrayal") {
    return "Trust does not have to be rushed; it can be rebuilt through truth and evidence.";
  }
  if (repairType === "identity") {
    return "Choice, selfhood, and consent still matter inside closeness.";
  }
  return `${label} makes care visible again after rupture.`;
}

function defaultEmotionalNeedMet(repairType: RepairStyleSeedType): string {
  const needs: Record<RepairStyleSeedType, string> = {
    verbal: "Clarity, validation, and direct emotional reassurance.",
    accountability: "Trust, dignity, and confidence that harm has consequences.",
    behavioral: "Reliability, relief, and evidence that care continues after words.",
    reassurance: "Emotional continuity, priority, and secure return.",
    presence: "Company, nervous-system safety, and no-abandonment warmth.",
    space_based: "Autonomy, predictability, and a clear path back.",
    physical_comfort: "Grounding, safe contact, and embodied reassurance.",
    acts_of_service: "Practical relief and care that reduces the burden.",
    ritual: "Continuity, familiarity, and repeated proof of return.",
    vulnerability: "Honesty, softness, and mutual emotional risk.",
    collaborative: "Partnership, shared responsibility, and future-facing repair.",
    devotional: "Priority, loyalty, and being visibly chosen.",
    attachment: "Security, emotional permanence, and safe return.",
    shame: "Dignity, acceptance, and being seen without contempt.",
    betrayal: "Transparency, patience, and earned trust.",
    identity: "Agency, selfhood, and restored choice.",
    romantic: "Renewed desire, chosen love, and shared future language.",
    domestic: "Ordinary care, home, and daily-life tenderness.",
    protective: "Safety with consent rather than control.",
    healing: "Patience, growth, and belief that repair can be learned.",
    meta: "Continuity, pattern change, and long-arc trust.",
  };

  return needs[repairType];
}

function defaultFailureMode(repairType: RepairStyleSeedType): string {
  if (repairType === "accountability" || repairType === "betrayal") {
    return "Accountability fails when remorse asks for comfort before consequences are faced.";
  }
  if (repairType === "space_based") {
    return "Space becomes avoidance when no return is promised or kept.";
  }
  if (repairType === "physical_comfort") {
    return "Comfort becomes pressure if touch is assumed instead of invited.";
  }
  return "Repair fails when it bypasses the actual hurt or is not repeated consistently.";
}

function defaultRequiredConditions(repairType: RepairStyleSeedType): readonly string[] {
  return unique([
    "honesty",
    "consent",
    "matched_to_actual_hurt",
    repairType === "space_based" ? "clear_return_plan" : "follow_through",
    repairType === "physical_comfort" ? "permission_for_touch" : "no_forced_forgiveness",
  ]);
}

function defaultRepairActions(
  label: string,
  repairType: RepairStyleSeedType,
): readonly string[] {
  return unique([
    toSeedKey(label),
    `use_${repairType}_repair`,
    "name_the_rupture",
    "offer_specific_amends",
    "repeat_the_repair_until_it_becomes_evidence",
  ]);
}

function defaultTimingNeeds(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "betrayal" || repairType === "healing" || repairType === "meta") {
    return ["works_over_time", "do_not_rush_forgiveness", "repeat_after_setbacks"];
  }
  if (repairType === "space_based") {
    return ["use_during_overwhelm", "set_return_time", "come_back_when_promised"];
  }
  return ["best_after_acknowledgment", "repeat_when_trigger_returns", "pair_with_follow_through"];
}

function defaultConflictEffects(repairType: RepairStyleSeedType): readonly string[] {
  return [
    `${repairType}_repair_reduces_escalation`,
    "keeps_consequences_visible",
    "creates_a_path_back_after_conflict",
  ];
}

function defaultAttachmentEffects(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "attachment" || repairType === "reassurance" || repairType === "presence") {
    return ["builds_secure_return", "lowers_abandonment_sensitivity", "supports_emotional_permanence"];
  }
  return ["builds_reliability_memory", "supports_trust_repair", "makes_return_trackable"];
}

function defaultIntimacyEffects(repairType: RepairStyleSeedType): readonly string[] {
  return [
    `${repairType}_repair_makes_closeness_safer`,
    "turns_conflict_into_information",
    "supports_future_vulnerability",
  ];
}

function defaultMisreadByOthersAs(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "space_based") {
    return ["avoidance", "coldness", "lack_of_urgency"];
  }
  if (repairType === "behavioral" || repairType === "acts_of_service") {
    return ["overfunctioning", "trying_to_buy_forgiveness", "avoiding_words"];
  }
  return ["too_much", "too_late", "performance"];
}

function defaultCompatibleWounds(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "betrayal") return ["betrayal_wound", "trust_wound"];
  if (repairType === "shame") return ["humiliation_wound", "shame_wound"];
  if (repairType === "identity") return ["control_wound", "identity_erasure_wound"];
  if (repairType === "attachment" || repairType === "reassurance" || repairType === "presence") {
    return ["abandonment_wound", "emotional_neglect_wound"];
  }
  return ["relationship_rupture_wound", "emotional_neglect_wound"];
}

function defaultCompatibleFears(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "betrayal") return ["fear_of_deception", "fear_of_being_used"];
  if (repairType === "shame") return ["fear_of_judgment", "fear_of_public_failure"];
  if (repairType === "identity" || repairType === "space_based") {
    return ["fear_of_dependency", "fear_of_losing_control"];
  }
  return ["fear_of_abandonment", "fear_of_rejection", "fear_of_emotional_distance"];
}

function defaultCompatibleConflictStyles(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "space_based" || repairType === "presence") {
    return ["withdrawer_conflict_style", "shutdown_conflict_style"];
  }
  if (repairType === "collaborative" || repairType === "accountability") {
    return ["intellectual_conflict_style", "repair_oriented_conflict_style"];
  }
  return ["pursuer_conflict_style", "anxious_conflict_style"];
}

function defaultIncompatibleDynamics(repairType: RepairStyleSeedType): readonly string[] {
  if (repairType === "physical_comfort") {
    return ["touch_without_consent", "physical_pressure_as_repair"];
  }
  if (repairType === "devotional" || repairType === "romantic") {
    return ["grand_gesture_without_accountability", "love_bombing_as_repair"];
  }
  return ["forced_forgiveness", "repair_without_accountability", "pattern_reset_without_change"];
}

function defaultGrowthArcs(repairType: RepairStyleSeedType): readonly string[] {
  return [
    `learns_${repairType}_repair`,
    "matches_repair_to_the_hurt",
    "turns_repair_into_a_reliable_pattern",
  ];
}

function defaultReliability(repairType: RepairStyleSeedType): RepairStyleSeedReliability {
  return (
    repairType === "accountability" ||
    repairType === "behavioral" ||
    repairType === "presence" ||
    repairType === "betrayal"
  )
    ? "high"
    : "medium";
}

function defaultRomanceValue(repairType: RepairStyleSeedType): number {
  return (
    repairType === "devotional" ||
    repairType === "romantic" ||
    repairType === "presence" ||
    repairType === "reassurance"
  )
    ? 10
    : 8;
}

function defaultAngstValue(repairType: RepairStyleSeedType): number {
  return (
    repairType === "betrayal" ||
    repairType === "attachment" ||
    repairType === "shame"
  )
    ? 9
    : 6;
}

function defaultConflictResolutionValue(repairType: RepairStyleSeedType): number {
  return (
    repairType === "accountability" ||
    repairType === "collaborative" ||
    repairType === "betrayal"
  )
    ? 10
    : 8;
}

function defaultPacingPressure(repairType: RepairStyleSeedType): "low" | "medium" | "high" {
  return (
    repairType === "betrayal" ||
    repairType === "attachment" ||
    repairType === "devotional"
  )
    ? "high"
    : "medium";
}

function toSeedKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}
