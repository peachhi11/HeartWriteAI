export type MentalEmotionalPatternPresetCategory =
  | "Archetype"
  | "Coping Style"
  | "Stress Response"
  | "Humour Style"
  | "Shame Response"
  | "Vulnerability Habit"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface MentalEmotionalPatternPreset {
  id: string;
  category: MentalEmotionalPatternPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMentalEmotionalPatternPresetAdditions {
  personalityAddition: string;
  backgroundAddition: string;
  systemPromptAddition: string;
}

interface MentalEmotionalPatternSeedGroup {
  category: MentalEmotionalPatternPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MENTAL_EMOTIONAL_PATTERN_GUIDANCE =
  "Use this as mental and emotional pattern texture. Coping, stress response, humour, shame, vulnerability, and healing patterns may shape behaviour without diagnosing the character, forcing distress, or overriding {{user}} agency.";

export const mentalEmotionalPatternPresets = [
  "The Calm Processor",
  "The Overthinker",
  "The Emotional Avoider",
  "The Humor Deflector",
  "The Quiet Internalizer",
  "The Panic Spiraler",
  "The Controlled Stoic",
  "The Sensitive Reactor",
  "The Problem Solver",
  "The Comfort Seeker",
  "The Shame Hider",
  "The Vulnerability Avoider",
  "The Softly Honest One",
  "The Stress Cleaner",
  "The Conflict Freezer",
  "The Reassurance Seeker",
  "The Self-Blamer",
  "The Protective Coper",
  "The Healing in Progress",
  "The One Learning To Be Seen",
];

export const copingStyleSeeds = [
  "problem_solving_coping",
  "emotional_processing_coping",
  "avoidant_coping",
  "humor_coping",
  "caretaking_coping",
  "control_coping",
  "routine_coping",
  "distraction_coping",
  "creative_coping",
  "spiritual_coping",
  "social_support_coping",
  "self_isolation_coping",
  "overworking_coping",
  "cleaning_coping",
  "cooking_coping",
  "journaling_coping",
  "exercise_coping",
  "music_coping",
  "comfort_object_coping",
  "quiet_space_coping",
];

export const stressResponseSeeds = [
  "fight_response",
  "flight_response",
  "freeze_response",
  "fawn_response",
  "shutdown_response",
  "panic_spiral",
  "overthinking_under_stress",
  "gets_quiet_under_stress",
  "gets_sharp_under_stress",
  "gets_busy_under_stress",
  "needs_space_under_stress",
  "needs_reassurance_under_stress",
  "hypervigilance",
  "compulsive_planning",
  "control_seeking",
  "emotional_flooding",
  "delayed_emotional_reaction",
  "stress_cleaning",
  "stress_sleeping",
  "stress_insomnia",
];

export const humorStyleSeeds = [
  "dry_humor",
  "dark_humor",
  "self_deprecating_humor",
  "sarcastic_humor",
  "playful_humor",
  "absurd_humor",
  "deadpan_humor",
  "flirtatious_humor",
  "gentle_teasing",
  "deflects_with_humor",
  "uses_jokes_to_hide_pain",
  "uses_humor_to_deescalate",
  "uses_humor_to_connect",
  "laughs_when_nervous",
  "smiles_when_hurt",
];

export const shameResponseSeeds = [
  "hides_when_ashamed",
  "gets_defensive_when_ashamed",
  "apologizes_too_much",
  "self_blame_spiral",
  "withdraws_after_mistake",
  "overexplains_when_ashamed",
  "tries_to_earn_forgiveness",
  "acts_cold_when_embarrassed",
  "avoids_eye_contact_when_ashamed",
  "perfectionism_from_shame",
  "shame_as_silence",
  "shame_as_anger",
  "shame_as_people_pleasing",
  "shame_as_overachievement",
  "needs_reassurance_after_shame",
];

export const vulnerabilityHabitSeeds = [
  "slow_to_open",
  "shares_in_fragments",
  "confesses_at_night",
  "opens_up_after_trust",
  "opens_up_during_crisis",
  "opens_up_through_actions",
  "deflects_vulnerability",
  "hides_need",
  "asks_for_help_indirectly",
  "tests_safety_before_sharing",
  "pulls_away_after_softness",
  "vulnerability_hangover",
  "needs_aftercare_after_confession",
  "uses_honesty_when_cornered",
  "truth_slips_out_when_tired",
  "private_vulnerability",
  "public_composure",
  "safe_person_required",
  "gentleness_unlocks_truth",
  "learning_to_be_seen",
];

export const mentalEmotionalPatternHooks = [
  "user_notices_coping_pattern",
  "first_stress_response_reveal",
  "first_vulnerability_scene",
  "first_shame_response_seen",
  "first_humor_deflection_called_out",
  "first_panic_grounding_scene",
  "first_shutdown_comfort",
  "first_reassurance_request",
  "first_safe_to_be_messy_moment",
  "first_conflict_without_running",
  "first_asks_for_help",
  "first_accepts_comfort",
  "first_no_longer_hides",
  "coping_pattern_softens",
  "love_becomes_safe_place",
];

export const mentalEmotionalPatternGates = [
  "first_coping_style_gate",
  "first_stress_response_gate",
  "first_humor_deflection_gate",
  "first_shame_response_gate",
  "first_vulnerability_gate",
  "first_shutdown_gate",
  "first_reassurance_gate",
  "first_accepts_help_gate",
  "first_pattern_called_out_gate",
  "first_repair_after_spiral_gate",
  "safe_to_feel_gate",
  "safe_to_be_seen_gate",
  "coping_softens_gate",
  "healing_pattern_gate",
  "secure_response_route",
];

export const mentalEmotionalPatternDialogueSeeds = [
  "You always joke when something hurts.",
  "It is easier than saying it hurts.",
  "You got quiet.",
  "Quiet is safer.",
  "Not with me.",
  "I do not know how to ask for help.",
  "Then start badly. I will listen anyway.",
  "You are spiraling.",
  "I know.",
  "Then breathe with me. One thought at a time.",
  "You do not have to earn forgiveness by suffering.",
  "That is hard to believe.",
  "Then let me keep saying it.",
  "I am ashamed.",
  "Of needing someone?",
  "Of needing you.",
  "Then need me gently. I am here.",
];

export const highValueMentalEmotionalPatternSeeds = [
  "overthinking_under_stress",
  "avoidant_coping",
  "humor_coping",
  "caretaking_coping",
  "control_coping",
  "self_isolation_coping",
  "panic_spiral",
  "freeze_response",
  "fawn_response",
  "deflects_with_humor",
  "uses_jokes_to_hide_pain",
  "self_blame_spiral",
  "apologizes_too_much",
  "pulls_away_after_softness",
  "vulnerability_hangover",
  "needs_reassurance_under_stress",
  "safe_person_required",
  "safe_to_be_seen_gate",
  "coping_softens_gate",
  "secure_response_route",
];

const MENTAL_EMOTIONAL_PATTERN_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "mental_emotional_pattern_archetype",
    guidance: MENTAL_EMOTIONAL_PATTERN_GUIDANCE,
    values: mentalEmotionalPatternPresets,
  },
  {
    category: "Coping Style",
    prefix: "mental_emotional_pattern_coping",
    guidance:
      "Use this as coping style texture. Coping can appear through action, routine, avoidance, creativity, support-seeking, or self-protection without making one pattern permanent.",
    values: copingStyleSeeds,
  },
  {
    category: "Stress Response",
    prefix: "mental_emotional_pattern_stress",
    guidance:
      "Use this as stress response texture. Fight, flight, freeze, fawn, shutdown, panic, planning, quietness, or reassurance needs should stay contextual, repairable, and choice-safe.",
    values: stressResponseSeeds,
  },
  {
    category: "Humour Style",
    prefix: "mental_emotional_pattern_humour",
    guidance:
      "Use this as humour-under-pressure texture. Jokes, teasing, deadpan timing, and deflection may hide pain or build connection while still allowing sincerity and repair.",
    values: humorStyleSeeds,
  },
  {
    category: "Shame Response",
    prefix: "mental_emotional_pattern_shame",
    guidance:
      "Use this as shame response texture. Shame may show through silence, defensiveness, overexplaining, apology, withdrawal, anger, or overachievement without making suffering required.",
    values: shameResponseSeeds,
  },
  {
    category: "Vulnerability Habit",
    prefix: "mental_emotional_pattern_vulnerability",
    guidance:
      "Use this as vulnerability habit texture. Openness should be paced through trust, privacy, safety tests, indirect asks, tired honesty, gentleness, and earned repair.",
    values: vulnerabilityHabitSeeds,
  },
  {
    category: "Romance Hook",
    prefix: "mental_emotional_pattern_romance",
    guidance:
      "Use this as romance-facing emotional pattern texture. Hooks should emerge through noticed patterns, grounding, reassurance, acceptance, and safe vulnerability without forcing disclosure.",
    values: mentalEmotionalPatternHooks,
  },
  {
    category: "Gate",
    prefix: "mental_emotional_pattern_gate",
    guidance:
      "Use this as an emotional pattern gate. Gates should mark earned trust, repair, comfort, and new coping choices without forcing crisis or escalation.",
    values: mentalEmotionalPatternGates,
  },
  {
    category: "Dialogue Seed",
    prefix: "mental_emotional_pattern_dialogue",
    guidance:
      "Use this as optional emotional dialogue inspiration. Dialogue seeds should be adapted to character voice, scene intensity, and relationship safety rather than pasted as fixed lines.",
    values: mentalEmotionalPatternDialogueSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "mental_emotional_pattern_high_value",
    guidance:
      "Use this as a high-signal mental and emotional pattern seed for character creation, matching, and preset search.",
    values: highValueMentalEmotionalPatternSeeds,
  },
] satisfies readonly MentalEmotionalPatternSeedGroup[]);

function normalizeReadableMentalEmotionalPatternValue(value: string): string {
  const readable = value.includes("_")
    ? value
        .replace(/users_/g, "{{user}}_s_")
        .replace(/_for_user\b/g, "_for_{{user}}")
        .replace(/_user_/g, "_{{user}}_")
        .replace(/\buser_/g, "{{user}}_")
        .replace(/_user\b/g, "_{{user}}")
        .replace(/_/g, " ")
        .replace(/\{\{user\}\} s/g, "{{user}}'s")
    : value;

  return readable
    .replace(/\b[Hh]umor\b/g, (match) => (match === "Humor" ? "Humour" : "humour"))
    .replace(/\b[Hh]umorist\b/g, (match) =>
      match === "Humorist" ? "Humourist" : "humourist",
    )
    .replace(/\b[Aa]pologizes\b/g, (match) =>
      match === "Apologizes" ? "Apologises" : "apologises",
    )
    .replace(/\b[Aa]pologize\b/g, (match) =>
      match === "Apologize" ? "Apologise" : "apologise",
    )
    .replace(/\b[Dd]eescalate\b/g, (match) =>
      match === "Deescalate" ? "De-escalate" : "de-escalate",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyMentalEmotionalPattern(value: string) {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}'s/g, "user_s")
    .replace(/\{\{user\}\}/g, "user")
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makeMentalEmotionalPatternPreset(
  group: MentalEmotionalPatternSeedGroup,
  rawValue: string,
): MentalEmotionalPatternPreset {
  const value = normalizeReadableMentalEmotionalPatternValue(rawValue);
  const normalizedTriggerValue = value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user");

  return {
    id: `${group.prefix}_${slugifyMentalEmotionalPattern(value)}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slugifyMentalEmotionalPattern(value),
        ...normalizedTriggerValue
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 2),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const MENTAL_EMOTIONAL_PATTERN_PRESETS = MENTAL_EMOTIONAL_PATTERN_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makeMentalEmotionalPatternPreset(group, value)),
);

export const MENTAL_EMOTIONAL_PATTERN_PRESET_CATEGORIES = Array.from(
  new Set(MENTAL_EMOTIONAL_PATTERN_PRESETS.map((preset) => preset.category)),
).sort();

export const getMentalEmotionalPatternPresetsByCategory = (
  category: MentalEmotionalPatternPresetCategory,
) => MENTAL_EMOTIONAL_PATTERN_PRESETS.filter((preset) => preset.category === category);

export const findMentalEmotionalPatternPresetById = (id: string) =>
  MENTAL_EMOTIONAL_PATTERN_PRESETS.find((preset) => preset.id === id);

export const compileMentalEmotionalPatternPresetAdditions = (
  preset: MentalEmotionalPatternPreset,
): CompiledMentalEmotionalPatternPresetAdditions => ({
  backgroundAddition: `Mental and emotional pattern context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Mental and emotional pattern texture may include ${preset.value} without replacing the character's full personality, contradictions, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft mental and emotional pattern context.`,
    "Let coping, stress response, shame, humour, vulnerability, grounding, reassurance, and repair shape behaviour when the scene supports it.",
    "Keep consent, privacy, emotional safety, and {{user}} autonomy intact; avoid diagnosing, forcing distress, or turning a coping pattern into a fixed identity.",
  ].join(" "),
});
