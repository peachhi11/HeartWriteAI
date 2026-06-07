export type CognitiveDriverPresetCategory =
  | "Archetype"
  | "Skill Driver"
  | "Social Energy"
  | "Emotional Stability"
  | "Cognitive Personality Complex"
  | "Reciprocal Determinism"
  | "Internal Belief"
  | "Internal Dialogue"
  | "Perception Filter"
  | "Cognitive Distortion"
  | "Value Driver"
  | "Moral Framework"
  | "High-Value Seed";

export interface CognitiveDriverPreset {
  id: string;
  category: CognitiveDriverPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCognitiveDriverPresetAdditions {
  personalityAddition: string;
  backgroundAddition: string;
  systemPromptAddition: string;
}

interface CognitiveDriverSeedGroup {
  category: CognitiveDriverPresetCategory;
  prefix: string;
  guidance: string;
  values: readonly string[];
}

const COGNITIVE_DRIVER_GUIDANCE =
  "Use this as optional cognitive-driver texture for character creation, persona matching, and route logic. Drivers may shape attention, belief, decision-making, values, and stress interpretation without diagnosing the character, forcing behaviour, or overriding authored details.";

export const cognitiveDriverPresets = [
  "The Strategic Planner",
  "The Emotional Navigator",
  "The Analytical Observer",
  "The Intuitive Visionary",
  "The Practical Realist",
  "The Curious Explorer",
  "The Protective Guardian",
  "The Ambitious Builder",
  "The Meaning Seeker",
  "The Skeptical Investigator",
  "The Idealistic Reformer",
  "The Relationship-Centered Thinker",
  "The Survival-Oriented Mind",
  "The Perfectionistic Achiever",
  "The Creative Dreamer",
  "The Hypervigilant Survivor",
  "The Stoic Rationalist",
  "The Compassionate Healer",
  "The Independent Maverick",
  "The One Who Learns Through Love",
];

export const cognitiveSkillDriverSeeds = [
  "pattern_recognition",
  "systems_thinking",
  "strategic_planning",
  "problem_solving",
  "critical_thinking",
  "analytical_reasoning",
  "creative_thinking",
  "intuitive_reasoning",
  "social_intelligence",
  "emotional_intelligence",
  "risk_assessment",
  "future_projection",
  "adaptability",
  "situational_awareness",
  "learning_agility",
  "decision_making",
  "metacognition",
  "self_reflection",
  "memory_association",
  "narrative_thinking",
];

export const introversionExtroversionSeeds = [
  "deep_introversion",
  "functional_introversion",
  "social_introversion",
  "selective_sociality",
  "ambiversion",
  "situational_extroversion",
  "social_extroversion",
  "high_extroversion",
  "energy_from_solitude",
  "energy_from_people",
  "needs_recovery_time",
  "needs_social_stimulation",
  "private_processing",
  "external_processing",
  "small_group_preference",
  "large_group_preference",
  "one_on_one_preference",
  "community_oriented",
  "internally_motivated",
  "externally_motivated",
];

export const neuroticismDriverSeeds = [
  "high_neuroticism",
  "moderate_neuroticism",
  "low_neuroticism",
  "emotionally_stable",
  "stress_sensitive",
  "stress_resilient",
  "worry_prone",
  "catastrophizing_tendency",
  "self_conscious",
  "emotionally_reactive",
  "emotionally_regulated",
  "rumination_prone",
  "resilience_building",
  "fear_sensitive",
  "uncertainty_intolerant",
  "uncertainty_tolerant",
  "rejection_sensitive",
  "criticism_sensitive",
  "failure_sensitive",
  "high_recovery_capacity",
];

export const cognitivePersonalityComplexSeeds = [
  "strategist_guardian",
  "scholar_dreamer",
  "caretaker_overthinker",
  "rebel_idealist",
  "protector_survivor",
  "visionary_builder",
  "skeptical_investigator",
  "wounded_helper",
  "charismatic_achiever",
  "creative_melancholic",
  "hypervigilant_protector",
  "romantic_rationalist",
  "ambitious_perfectionist",
  "intuitive_empath",
  "detached_analyst",
  "hopeful_realist",
  "stoic_caregiver",
  "independent_explorer",
  "justice_seeker",
  "healer_leader",
];

export const reciprocalDeterminismSeeds = [
  "behavior_shapes_environment",
  "environment_shapes_behavior",
  "beliefs_shape_behavior",
  "behavior_reinforces_beliefs",
  "self_fulfilling_expectations",
  "learned_helplessness",
  "learned_confidence",
  "social_modeling",
  "observational_learning",
  "adaptive_feedback_loop",
  "maladaptive_feedback_loop",
  "environmental_reinforcement",
  "identity_behavior_cycle",
  "success_breeds_confidence",
  "failure_breeds_avoidance",
  "trust_builds_trust",
  "fear_builds_distance",
  "connection_builds_security",
  "experience_changes_beliefs",
  "agency_changes_outcomes",
];

export const internalBeliefSeeds = [
  "people_can_change",
  "people_do_not_change",
  "love_must_be_earned",
  "love_is_given_freely",
  "strength_requires_independence",
  "connection_is_strength",
  "the_world_is_safe",
  "the_world_is_dangerous",
  "i_am_responsible_for_others",
  "i_must_protect_myself",
  "i_am_enough",
  "i_am_not_enough",
  "failure_is_growth",
  "failure_is_identity",
  "trust_is_risky",
  "trust_is_necessary",
  "everyone_leaves",
  "some_people_stay",
  "meaning_must_be_created",
  "life_has_inherent_purpose",
];

export const internalDialogueSeeds = [
  "inner_critic",
  "inner_coach",
  "inner_guardian",
  "inner_child",
  "constant_self_questioning",
  "constant_self_monitoring",
  "encouraging_self_talk",
  "catastrophic_self_talk",
  "analytical_self_talk",
  "compassionate_self_talk",
  "perfectionist_self_talk",
  "survival_based_self_talk",
  "future_oriented_monologue",
  "past_oriented_monologue",
  "meaning_making_monologue",
  "relationship_focused_monologue",
  "achievement_focused_monologue",
  "guilt_based_monologue",
  "hope_based_monologue",
  "narrative_self_authoring",
];

export const perceptionSeeds = [
  "threat_focused_perception",
  "opportunity_focused_perception",
  "relationship_focused_perception",
  "status_focused_perception",
  "meaning_focused_perception",
  "fairness_focused_perception",
  "beauty_focused_perception",
  "efficiency_focused_perception",
  "novelty_focused_perception",
  "stability_focused_perception",
  "loss_sensitive_perception",
  "gain_sensitive_perception",
  "trust_sensitive_perception",
  "rejection_sensitive_perception",
  "possibility_focused",
  "constraint_focused",
  "detail_oriented_perception",
  "big_picture_perception",
  "pattern_based_perception",
  "emotion_based_perception",
];

export const cognitiveDistortionSeeds = [
  "all_or_nothing_thinking",
  "catastrophizing",
  "mind_reading",
  "fortune_telling",
  "emotional_reasoning",
  "overgeneralization",
  "labeling",
  "personalization",
  "filtering_for_negatives",
  "discounting_positives",
  "should_statements",
  "perfectionism_distortion",
  "rejection_assumption",
  "abandonment_assumption",
  "worst_case_bias",
  "comparison_bias",
  "confirmation_bias",
  "negativity_bias",
  "control_fallacy",
  "responsibility_distortion",
];

export const cognitiveValueSeeds = [
  "autonomy",
  "security",
  "connection",
  "achievement",
  "mastery",
  "compassion",
  "justice",
  "truth",
  "freedom",
  "stability",
  "loyalty",
  "growth",
  "creativity",
  "wisdom",
  "community",
  "family",
  "legacy",
  "purpose",
  "service",
  "authenticity",
];

export const moralFrameworkSeeds = [
  "care_ethics",
  "justice_ethics",
  "duty_ethics",
  "virtue_ethics",
  "consequentialism",
  "deontological_ethics",
  "pragmatic_ethics",
  "survival_ethics",
  "community_ethics",
  "relationship_ethics",
  "honor_ethics",
  "mercy_ethics",
  "truth_ethics",
  "loyalty_ethics",
  "freedom_ethics",
  "responsibility_ethics",
  "redemption_ethics",
  "harm_reduction_ethics",
  "sacrifice_ethics",
  "balance_ethics",
];

export const highValueCognitiveDriverSeeds = [
  "pattern_recognition",
  "strategic_planning",
  "emotional_intelligence",
  "metacognition",
  "ambiversion",
  "stress_sensitive",
  "emotionally_regulated",
  "hypervigilant_protector",
  "people_can_change",
  "everyone_leaves",
  "inner_critic",
  "inner_coach",
  "relationship_focused_perception",
  "threat_focused_perception",
  "catastrophizing",
  "mind_reading",
  "autonomy",
  "connection",
  "justice",
  "care_ethics",
];

const COGNITIVE_DRIVER_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "cognitive_driver_archetype",
    guidance: COGNITIVE_DRIVER_GUIDANCE,
    values: cognitiveDriverPresets,
  },
  {
    category: "Skill Driver",
    prefix: "cognitive_driver_skill",
    guidance:
      "Use this as optional cognitive skill texture. Skills can shape how the character notices patterns, solves problems, learns, plans, and explains decisions.",
    values: cognitiveSkillDriverSeeds,
  },
  {
    category: "Social Energy",
    prefix: "cognitive_driver_social_energy",
    guidance:
      "Use this as optional introversion, extroversion, or ambiversion texture. Social energy should guide recovery needs, processing style, and preferred intimacy scale without making the character antisocial or socially simple.",
    values: introversionExtroversionSeeds,
  },
  {
    category: "Emotional Stability",
    prefix: "cognitive_driver_emotional_stability",
    guidance:
      "Use this as optional emotional stability texture. Stress sensitivity, worry, resilience, and regulation should remain contextual, compassionate, and changeable through experience.",
    values: neuroticismDriverSeeds,
  },
  {
    category: "Cognitive Personality Complex",
    prefix: "cognitive_driver_complex",
    guidance:
      "Use this as optional combined cognitive/personality shorthand. Complexes should suggest a creative starting pattern without replacing detailed traits, wounds, fears, values, or behaviour.",
    values: cognitivePersonalityComplexSeeds,
  },
  {
    category: "Reciprocal Determinism",
    prefix: "cognitive_driver_reciprocal_determinism",
    guidance:
      "Use this as optional reciprocal-determinism texture. Belief, behaviour, environment, and feedback loops may influence each other, but the character should still have agency and capacity for change.",
    values: reciprocalDeterminismSeeds,
  },
  {
    category: "Internal Belief",
    prefix: "cognitive_driver_internal_belief",
    guidance:
      "Use this as optional core belief texture. Beliefs may create interpretation, fear, trust, hope, and self-protection without becoming permanent truth.",
    values: internalBeliefSeeds,
  },
  {
    category: "Internal Dialogue",
    prefix: "cognitive_driver_internal_dialogue",
    guidance:
      "Use this as optional internal dialogue texture. Inner criticism, coaching, guarding, memory, guilt, hope, and self-authoring should support subtext without over-narrating every thought.",
    values: internalDialogueSeeds,
  },
  {
    category: "Perception Filter",
    prefix: "cognitive_driver_perception",
    guidance:
      "Use this as optional perception-filter texture. Filters should shape what the character notices first, misreads, values, or fears without making them incapable of new evidence.",
    values: perceptionSeeds,
  },
  {
    category: "Cognitive Distortion",
    prefix: "cognitive_driver_distortion",
    guidance:
      "Use this as optional cognitive-distortion texture. Distortions should be soft, situational, and repairable; do not diagnose or force irrationality.",
    values: cognitiveDistortionSeeds,
  },
  {
    category: "Value Driver",
    prefix: "cognitive_driver_value",
    guidance:
      "Use this as optional value-driver texture. Values should guide choices, boundaries, attraction, conflict, and trade-offs while allowing hypocrisy, growth, or pressure.",
    values: cognitiveValueSeeds,
  },
  {
    category: "Moral Framework",
    prefix: "cognitive_driver_moral_framework",
    guidance:
      "Use this as optional moral-framework texture. Ethics should shape decision pressure, conflict, self-justification, mercy, sacrifice, and accountability without presenting one framework as universally correct.",
    values: moralFrameworkSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "cognitive_driver_high_value",
    guidance:
      "Use this as a high-signal cognitive-driver seed for creator shortcuts, persona matching, semantic graph expansion, and route logic.",
    values: highValueCognitiveDriverSeeds,
  },
] satisfies readonly CognitiveDriverSeedGroup[]);

function normalizeReadableCognitiveDriverValue(value: string): string {
  const readable = value.includes("_") ? value.replace(/_/g, " ") : value;

  return readable
    .replace(/\b[Bb]ehavior\b/g, (match) =>
      match === "Behavior" ? "Behaviour" : "behaviour",
    )
    .replace(/\b[Hh]onor\b/g, (match) => (match === "Honor" ? "Honour" : "honour"))
    .replace(/\b[Ll]abeling\b/g, (match) =>
      match === "Labeling" ? "Labelling" : "labelling",
    )
    .replace(/\b[Pp]ersonalization\b/g, (match) =>
      match === "Personalization" ? "Personalisation" : "personalisation",
    )
    .replace(/\b[Oo]vergeneralization\b/g, (match) =>
      match === "Overgeneralization" ? "Overgeneralisation" : "overgeneralisation",
    )
    .replace(/\b[Cc]atastrophizing\b/g, (match) =>
      match === "Catastrophizing" ? "Catastrophising" : "catastrophising",
    )
    .replace(/\b[Rr]elationship-Centered\b/g, (match) =>
      match === "Relationship-Centered"
        ? "Relationship-Centred"
        : "relationship-centred",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyCognitiveDriver(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeCognitiveDriverPreset(
  group: CognitiveDriverSeedGroup,
  rawValue: string,
): CognitiveDriverPreset {
  const value = normalizeReadableCognitiveDriverValue(rawValue);
  const slug = slugifyCognitiveDriver(value);

  return {
    id: `${group.prefix}_${slug}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slug,
        ...value
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const COGNITIVE_DRIVER_PRESETS = COGNITIVE_DRIVER_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeCognitiveDriverPreset(group, value)),
);

export const COGNITIVE_DRIVER_PRESET_CATEGORIES = Array.from(
  new Set(COGNITIVE_DRIVER_PRESETS.map((preset) => preset.category)),
).sort();

export const getCognitiveDriverPresetsByCategory = (
  category: CognitiveDriverPresetCategory,
) => COGNITIVE_DRIVER_PRESETS.filter((preset) => preset.category === category);

export const findCognitiveDriverPresetById = (id: string) =>
  COGNITIVE_DRIVER_PRESETS.find((preset) => preset.id === id);

export const compileCognitiveDriverPresetAdditions = (
  preset: CognitiveDriverPreset,
): CompiledCognitiveDriverPresetAdditions => ({
  backgroundAddition: `Cognitive driver context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Cognitive driver texture may include ${preset.value} as a decision-making, belief, perception, or value pattern while preserving contradiction, agency, growth, and authored psychology.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft cognitive-driver context.`,
    "Let cognitive drivers shape attention, internal dialogue, value trade-offs, perception filters, and decision pressure only when the scene supports it.",
    "Do not diagnose, force behaviour, make distortions permanent, or override stronger card details, scene evidence, consent, or {{user}} agency.",
  ].join(" "),
});
