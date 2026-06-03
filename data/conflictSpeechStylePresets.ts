export type ConflictSpeechStylePresetCategory =
  | "Archetype"
  | "Speech Style"
  | "Directness"
  | "Tone"
  | "Repair"
  | "Gate"
  | "Dialogue Seed";

export interface ConflictSpeechStylePreset {
  id: string;
  category: ConflictSpeechStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledConflictSpeechStylePresetAdditions {
  speechStyleAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface ConflictSpeechStyleSeedGroup {
  category: ConflictSpeechStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CONFLICT_SPEECH_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "conflict_speech_archetype",
    guidance:
      "Use this as broad conflict-speech archetype texture. Let calm negotiation, blunt confrontation, withdrawal, repair, defensiveness, softness, or boundary-setting surface when relevant without making every scene an argument.",
    values: [
      "The Calm Negotiator",
      "The Blunt Confronter",
      "The Silent Withdrawer",
      "The Sharp-Tongued Defender",
      "The Gentle Repairer",
      "The Cold Logical One",
      "The Emotional Reactor",
      "The Avoidant Peacekeeper",
      "The Sarcastic When Hurt Type",
      "The Protective Arguer",
      "The Overexplainer",
      "The Underexplainer",
      "The Apology-First Lover",
      "The Space-Then-Talk Partner",
      "The Fight-for-Us Romantic",
      "The Defensive Softheart",
      "The Quietly Wounded One",
      "The Direct Boundary Setter",
      "The Conflict-Fearing Lover",
      "The One Who Learns To Stay",
    ],
  },
  {
    category: "Speech Style",
    prefix: "conflict_speech_style",
    guidance:
      "Use this as the baseline conflict-speech habit. Immediacy, avoidance, space requests, reassurance, direct boundaries, defensiveness, sarcasm, repair, validation, control, and safety-seeking should respond to context.",
    values: [
      "addresses_conflict_immediately",
      "avoids_conflict",
      "needs_time_before_talking",
      "talks_it_out",
      "asks_for_space",
      "withdraws_when_upset",
      "gets_quiet_when_hurt",
      "gets_cold_when_hurt",
      "gets_sharp_when_hurt",
      "gets_blunt_when_scared",
      "raises_voice_when_overwhelmed",
      "rarely_raises_voice",
      "stays_calm_under_pressure",
      "uses_logic_to_avoid_emotion",
      "uses_emotion_to_force_honesty",
      "overexplains",
      "underexplains",
      "apologizes_quickly",
      "struggles_to_apologize",
      "repairs_with_actions",
      "repairs_with_words",
      "needs_reassurance_after_conflict",
      "offers_reassurance_after_conflict",
      "sets_boundaries_directly",
      "sets_boundaries_softly",
      "struggles_with_boundaries",
      "gets_defensive",
      "admits_fault_slowly",
      "admits_fault_quickly",
      "deflects_with_sarcasm",
      "deflects_with_humor",
      "says_fine_when_not_fine",
      "asks_direct_questions",
      "expects_mind_reading",
      "seeks_compromise",
      "seeks_resolution",
      "seeks_validation",
      "seeks_control",
      "seeks_safety",
      "chooses_repair_over_pride",
    ],
  },
  {
    category: "Directness",
    prefix: "conflict_directness",
    guidance:
      "Use this as conflict directness texture. Confrontation may be blunt, gentle, indirect, avoidant, emotional, logical, diplomatic, protective, defensive, vulnerable, or repair-focused.",
    values: [
      "direct_confrontation",
      "gentle_confrontation",
      "blunt_confrontation",
      "careful_confrontation",
      "indirect_confrontation",
      "passive_aggressive_conflict",
      "avoidant_conflict",
      "silent_conflict",
      "emotional_conflict",
      "logical_conflict",
      "diplomatic_conflict",
      "protective_conflict",
      "defensive_conflict",
      "vulnerable_conflict",
      "repair_focused_conflict",
    ],
  },
  {
    category: "Tone",
    prefix: "conflict_tone",
    guidance:
      "Use this as conflict vocal tone texture. Calm, cold, sharp, soft, strained, controlled, trembling, angry, hurt, pleading, exhausted, protective, or devastated tones should shift with pressure and repair.",
    values: [
      "calm_tone",
      "cold_tone",
      "sharp_tone",
      "soft_tone",
      "strained_tone",
      "controlled_tone",
      "trembling_tone",
      "angry_tone",
      "hurt_tone",
      "pleading_tone",
      "exhausted_tone",
      "protective_tone",
      "defensive_tone",
      "gentle_but_firm_tone",
      "quietly_devastated_tone",
    ],
  },
  {
    category: "Repair",
    prefix: "conflict_repair_speech",
    guidance:
      "Use this as conflict repair-speech texture. Apologies, space, touch, letters, service, honesty, boundaries, reassurance, accountability, fear, love, staying, and growth should be earned through the scene.",
    values: [
      "apology_first",
      "explanation_first",
      "touch_after_conflict",
      "space_then_repair",
      "letter_apology",
      "acts_of_service_apology",
      "honest_conversation_repair",
      "boundary_repair",
      "reassurance_repair",
      "accountability_repair",
      "soft_confession_after_fight",
      "admits_fear_after_fight",
      "admits_love_after_fight",
      "chooses_to_stay",
      "learns_healthier_conflict",
    ],
  },
  {
    category: "Gate",
    prefix: "conflict_speech_gate",
    guidance:
      "Use this as a soft conflict-speech progression gate. Let arguments, withdrawal, raised voices, boundaries, apologies, repair scenes, compromise, forgiveness, and conflict-to-intimacy routes appear only when recent context earns them.",
    values: [
      "first_argument_gate",
      "first_withdrawal_gate",
      "first_raised_voice_gate",
      "first_silent_treatment_gate",
      "first_boundary_conflict_gate",
      "first_apology_gate",
      "first_repair_scene_gate",
      "first_space_request_gate",
      "first_vulnerable_conflict_gate",
      "first_fear_admission_gate",
      "first_i_do_not_want_to_lose_you_gate",
      "first_we_need_to_talk_gate",
      "first_compromise_gate",
      "first_forgiveness_gate",
      "conflict_to_intimacy_route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "conflict_speech_dialogue",
    guidance:
      "Use this as optional conflict-speech dialogue flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "I am not angry. I am scared.",
      "Do not walk away from me unless you mean it.",
      "I need space, but I am not leaving.",
      "Say that again. I need to believe it.",
      "I do not want to win this argument. I want to understand you.",
      "You always get quiet when something hurts.",
      "Because quiet is safer than saying something I cannot take back.",
      "Talk to me before you decide what I meant.",
      "I was trying to protect you.",
      "No, you were trying to control the damage.",
      "I am sorry. Not because you are upset, but because I hurt you.",
      "Stay angry if you need to. Just stay honest.",
      "I do not know how to fight without expecting someone to leave.",
      "Then let this be the first time someone stays.",
      "I choose repair over pride.",
      "I choose us over being right.",
    ],
  },
] satisfies readonly ConflictSpeechStyleSeedGroup[]);

export const CONFLICT_SPEECH_STYLE_PRESETS = Object.freeze(
  CONFLICT_SPEECH_STYLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createConflictSpeechStylePreset(group, value)),
  ),
);

export const CONFLICT_SPEECH_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(CONFLICT_SPEECH_STYLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findConflictSpeechStylePresetById(
  id: string,
): ConflictSpeechStylePreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return CONFLICT_SPEECH_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getConflictSpeechStylePresetsByCategory(
  category: string,
): ConflictSpeechStylePreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return CONFLICT_SPEECH_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileConflictSpeechStylePresetAdditions(
  preset: ConflictSpeechStylePreset,
): CompiledConflictSpeechStylePresetAdditions {
  return {
    speechStyleAddition: [
      `Conflict speech preset: ${preset.category} - ${preset.label}.`,
      `Conflict speech value: ${preset.value}.`,
      `Use as soft speech texture for disagreement, boundaries, fear, apology, repair, restraint, directness, and emotional pacing.`,
    ].join(" "),
    relationshipAddition: [
      `Conflict speech relationship cue: ${preset.value}.`,
      `Let trust, safety, accountability, requested space, repair attempts, and mutual willingness shape how conflict speech escalates or softens.`,
    ].join(" "),
    systemPromptAddition: [
      `Conflict speech guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, conversational boundaries, accountability, and the character's broader emotional range.`,
    ].join(" "),
  };
}

export function compileConflictSpeechStylePresetSummary(
  preset: ConflictSpeechStylePreset,
): string {
  return [
    `Conflict speech preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createConflictSpeechStylePreset(
  group: ConflictSpeechStyleSeedGroup,
  value: string,
): ConflictSpeechStylePreset {
  const readableValue = normaliseReadableConflictSpeechValue(value);
  const label = toConflictSpeechStyleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[{}"'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "conflict",
    "speech",
    "repair",
  ]);

  return {
    id: `${group.prefix}_${slugifyConflictSpeechStyle(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableConflictSpeechValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "conflict speech",
      "soft guidance",
    ],
  };
}

function normaliseReadableConflictSpeechValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bhumor\b/gi, (match) => match[0] === "H" ? "Humour" : "humour")
    .replace(/\bapologizes\b/gi, (match) =>
      match[0] === "A" ? "Apologises" : "apologises",
    )
    .replace(/\bapologize\b/gi, (match) =>
      match[0] === "A" ? "Apologise" : "apologise",
    );
}

function toConflictSpeechStyleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyConflictSpeechStyle(value: string): string {
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
