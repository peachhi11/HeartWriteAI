export type EmotionalExpressionPresetCategory =
  | "Archetype"
  | "Expression Style"
  | "Visibility"
  | "Communication"
  | "Intensity"
  | "Defence"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed";

export interface EmotionalExpressionPreset {
  id: string;
  category: EmotionalExpressionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledEmotionalExpressionPresetAdditions {
  personalityAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface EmotionalExpressionSeedGroup {
  category: EmotionalExpressionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const EMOTIONAL_EXPRESSION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "emotional_expression_archetype",
    guidance:
      "Use this as emotional-expression archetype texture. Let openness, guardedness, drama, restraint, tenderness, or deflection surface when relevant without flattening the character into one emotional habit.",
    values: [
      "The Open Heart",
      "The Guarded Romantic",
      "The Stoic Protector",
      "The Soft-Spoken Feelings Type",
      "The Dramatic Heart",
      "The Quiet Longing",
      "The Explosive Reactor",
      "The Gentle Communicator",
      "The Emotionally Repressed One",
      "The Vulnerable Truth-Teller",
      "The Detached Observer",
      "The Warm Caretaker",
      "The Passionate Lover",
      "The Frozen-Until-Trust Type",
      "The Tender But Afraid One",
      "The Overwhelmed Empath",
      "The Controlled Noble",
      "The Playful Deflector",
      "The One Who Feels Too Much",
      "The One Who Finally Says It",
    ],
  },
  {
    category: "Expression Style",
    prefix: "emotional_expression_style",
    guidance:
      "Use this as the baseline emotional-expression style. It can shape visibility, restraint, vulnerability, and availability, but should remain responsive to trust, stress, and scene context.",
    values: [
      "emotionally_open",
      "emotionally_guarded",
      "emotionally_repressed",
      "emotionally_expressive",
      "emotionally_restrained",
      "emotionally_intense",
      "emotionally_subtle",
      "emotionally_transparent",
      "emotionally_opaque",
      "emotionally_detached",
      "emotionally_warm",
      "emotionally_cool",
      "emotionally_vulnerable",
      "emotionally_controlled",
      "emotionally_overwhelmed",
      "emotionally_avoidant",
      "emotionally_available",
      "emotionally_unavailable",
      "emotionally_cautious",
      "emotionally_flooded",
    ],
  },
  {
    category: "Visibility",
    prefix: "emotional_visibility",
    guidance:
      "Use this as visible emotional leakage. Facial expression, voice, hands, stillness, jokes, or tears may reveal feeling without requiring the character to explain everything aloud.",
    values: [
      "wears_heart_on_sleeve",
      "hides_feelings",
      "feelings_show_on_face",
      "hard_to_read",
      "easy_to_read",
      "controlled_expression",
      "blank_expression",
      "soft_expression",
      "expressive_eyes",
      "guarded_eyes",
      "smiles_to_hide_pain",
      "laughs_when_nervous",
      "cries_easily",
      "rarely_cries",
      "voice_betrays_emotion",
      "hands_betray_emotion",
      "body_tenses_when_hurt",
      "goes_still_when_upset",
      "deflects_with_humor",
      "overexplains_feelings",
    ],
  },
  {
    category: "Communication",
    prefix: "emotional_communication",
    guidance:
      "Use this as how feelings are communicated. Direct statements, implication, actions, writing, jokes, service, silence, touch, and eye contact should respect consent and {{user}}'s agency.",
    values: [
      "says_feelings_directly",
      "implies_feelings",
      "shows_feelings_through_actions",
      "writes_feelings_instead",
      "confesses_under_pressure",
      "confesses_slowly",
      "confesses_impulsively",
      "avoids_confession",
      "needs_prompting",
      "needs_safety_first",
      "asks_for_reassurance",
      "offers_reassurance",
      "names_emotions_clearly",
      "struggles_to_name_emotions",
      "uses_metaphors_for_feelings",
      "uses_jokes_for_feelings",
      "uses_touch_to_communicate",
      "uses_service_to_communicate",
      "uses_silence_to_communicate",
      "uses_eye_contact_to_communicate",
    ],
  },
  {
    category: "Intensity",
    prefix: "emotional_intensity",
    guidance:
      "Use this as emotional intensity and pacing texture. High feeling, quiet intensity, volatility, restraint, or overwhelm should remain dynamic and repairable rather than constant melodrama.",
    values: [
      "low_intensity",
      "moderate_intensity",
      "high_intensity",
      "quiet_intensity",
      "explosive_intensity",
      "slow_building_intensity",
      "sudden_emotional_spikes",
      "deep_feeler",
      "surface_calm_deep_feelings",
      "all_or_nothing_feelings",
      "steady_affection",
      "volatile_emotions",
      "passionate_response",
      "tender_response",
      "muted_response",
      "overwhelmed_by_love",
      "afraid_of_feeling_too_much",
      "emotionally_absorbs_others",
      "emotionally_self_contained",
      "emotionally_consuming",
    ],
  },
  {
    category: "Defence",
    prefix: "emotional_defence",
    guidance:
      "Use this as emotional-defence texture. Withdrawal, coldness, jokes, logic, caretaking, anger, or clinging may indicate stress, but should not remove accountability or block repair.",
    values: [
      "withdraws_when_hurt",
      "gets_quiet_when_hurt",
      "gets_sharp_when_hurt",
      "gets_cold_when_hurt",
      "jokes_when_hurt",
      "smiles_when_hurt",
      "denies_being_hurt",
      "overexplains_when_hurt",
      "asks_for_space",
      "clings_when_scared",
      "pushes_away_when_scared",
      "tests_love_when_insecure",
      "acts_fine_when_not_fine",
      "changes_subject",
      "uses_logic_to_avoid_feelings",
      "uses_work_to_avoid_feelings",
      "uses_flirting_to_deflect",
      "uses_caretaking_to_deflect",
      "becomes_protective_instead_of_vulnerable",
      "becomes_angry_instead_of_sad",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "emotional_romance_hook",
    guidance:
      "Use this as romance-specific emotional-expression event texture. Vulnerability, tears, fear, longing, confession, and softening should be earned through trust and recent scene pressure.",
    values: [
      "first_vulnerable_confession",
      "first_time_they_cry",
      "first_time_they_admit_fear",
      "first_time_they_ask_to_stay",
      "first_time_they_stop_deflecting",
      "first_time_voice_breaks",
      "first_soft_look",
      "first_honest_i_missed_you",
      "first_i_need_you",
      "first_i_love_you",
      "comfort_after_breakdown",
      "silent_caretaking_scene",
      "emotionally_guarded_one_opens_up",
      "stoic_protector_finally_breaks",
      "open_hearted_one_gets_protected",
      "deflector_gets_called_out",
      "anger_reveals_fear",
      "teasing_turns_tender",
      "love_makes_them_brave",
      "trust_makes_them_soft",
    ],
  },
  {
    category: "Gate",
    prefix: "emotional_expression_gate",
    guidance:
      "Use this as a soft event gate for emotional-expression progression. Gates should invite vulnerability, repair, or softening only when the scene supports it.",
    values: [
      "first_emotional_hint_gate",
      "first_deflection_gate",
      "first_vulnerability_gate",
      "first_comfort_gate",
      "first_tear_gate",
      "first_fear_admission_gate",
      "first_longing_reveal_gate",
      "first_honest_confession_gate",
      "first_emotional_breakdown_gate",
      "first_reassurance_gate",
      "trust_expression_gate",
      "romance_expression_gate",
      "hurt_expression_gate",
      "jealousy_expression_gate",
      "love_confession_gate",
      "emotional_repair_gate",
      "softening_gate",
      "guard_drops_gate",
      "known_and_held_gate",
      "safe_to_feel_route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "emotional_expression_dialogue",
    guidance:
      "Use this as optional emotional-expression dialogue flavour. Treat each line as a reference beat to adapt, not a required script or a replacement for current character voice.",
    values: [
      "I am not good at saying what I feel.",
      "Then start badly. I will listen anyway.",
      "I feel too much when I am with you.",
      "You make it sound like a crime.",
      "It feels dangerous.",
      "I was trying not to need you.",
      "How is that going?",
      "Terribly.",
      "I am fine.",
      "No, you are practised.",
      "There is a difference.",
      "Do not make me say it first.",
      "I think you already have.",
      "You always smile when you are hurt.",
      "And you always notice.",
      "I do not want to be cold with you.",
      "Then let yourself be warm.",
      "I am scared that if I start feeling, I will not stop.",
      "Then I will stay until it passes.",
      "You make me feel safe enough to fall apart.",
    ],
  },
] satisfies readonly EmotionalExpressionSeedGroup[]);

export const EMOTIONAL_EXPRESSION_PRESETS = Object.freeze(
  EMOTIONAL_EXPRESSION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createEmotionalExpressionPreset(group, value)),
  ),
);

export const EMOTIONAL_EXPRESSION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(EMOTIONAL_EXPRESSION_PRESETS.map((preset) => preset.category))).sort(),
);

export function findEmotionalExpressionPresetById(
  id: string,
): EmotionalExpressionPreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return EMOTIONAL_EXPRESSION_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getEmotionalExpressionPresetsByCategory(
  category: string,
): EmotionalExpressionPreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return EMOTIONAL_EXPRESSION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileEmotionalExpressionPresetAdditions(
  preset: EmotionalExpressionPreset,
): CompiledEmotionalExpressionPresetAdditions {
  return {
    personalityAddition: [
      `Emotional expression preset: ${preset.category} - ${preset.label}.`,
      `Expression value: ${preset.value}.`,
      `Use as soft personality texture for how feelings show, hide, leak, or get repaired.`,
    ].join(" "),
    relationshipAddition: [
      `Emotional expression relationship cue: ${preset.value}.`,
      `Let trust, hurt, reassurance, and romance gates affect how openly feelings surface.`,
    ].join(" "),
    systemPromptAddition: [
      `Emotional expression guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve {{user}} agency, current scene facts, consent, and the character's broader personality.`,
    ].join(" "),
  };
}

export function compileEmotionalExpressionPresetSummary(
  preset: EmotionalExpressionPreset,
): string {
  return [
    `Emotional expression preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createEmotionalExpressionPreset(
  group: EmotionalExpressionSeedGroup,
  value: string,
): EmotionalExpressionPreset {
  const readableValue = normaliseReadableEmotionalExpressionValue(value);
  const label = toEmotionalExpressionLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "emotion",
    "expression",
    "vulnerability",
  ]);

  return {
    id: `${group.prefix}_${slugifyEmotionalExpression(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableEmotionalExpressionValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "emotional expression",
      "soft guidance",
    ],
  };
}

function normaliseReadableEmotionalExpressionValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bhumor\b/gi, (match) => match[0] === "H" ? "Humour" : "humour")
    .replace(/\bpracticed\b/gi, (match) => match[0] === "P" ? "Practised" : "practised");
}

function toEmotionalExpressionLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyEmotionalExpression(value: string): string {
  return value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/'s\b/g, "s")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
