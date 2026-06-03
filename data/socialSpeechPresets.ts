export type SocialSpeechPresetCategory =
  | "Archetype"
  | "Social Speech"
  | "Context"
  | "Power"
  | "Romance"
  | "Wound"
  | "Gate"
  | "Dialogue Seed";

export interface SocialSpeechPreset {
  id: string;
  category: SocialSpeechPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSocialSpeechPresetAdditions {
  speechStyleAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface SocialSpeechSeedGroup {
  category: SocialSpeechPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SOCIAL_SPEECH_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "social_speech_archetype",
    guidance:
      "Use this as broad social-speech archetype texture. Let charisma, warmth, reserve, command, diplomacy, mystery, gossip, masks, or private softness surface when relevant without making every social exchange identical.",
    values: [
      "The Charismatic Speaker",
      "The Charming Flirt",
      "The Warm Conversationalist",
      "The Reserved Observer",
      "The Shy Sweetheart",
      "The Awkward Romantic",
      "The Confident Leader",
      "The Commanding Presence",
      "The Diplomatic Courtier",
      "The Persuasive Negotiator",
      "The Disarming Stranger",
      "The Professional Mask",
      "The Protective Speaker",
      "The Nurturing Voice",
      "The Gossip Networker",
      "The Intimidating Quiet Type",
      "The Approachable Local",
      "The Mysterious Minimalist",
      "The Social Chameleon",
      "The One Who Softens In Private",
    ],
  },
  {
    category: "Social Speech",
    prefix: "social_speech",
    guidance:
      "Use this as baseline social speech texture. Warmth, reserve, command, diplomacy, teasing, gossip, protection, public masks, and private softness should shift with audience, trust, and pressure.",
    values: [
      "charismatic",
      "charming",
      "magnetic",
      "approachable",
      "warm",
      "friendly",
      "inviting",
      "gentle",
      "nurturing",
      "comforting",
      "reserved",
      "shy",
      "quiet",
      "awkward",
      "hesitant",
      "soft_spoken",
      "socially_cautious",
      "hard_to_approach",
      "mysterious",
      "distant",
      "confident",
      "authoritative",
      "commanding",
      "leader_like",
      "calmly_dominant",
      "intimidating",
      "controlled",
      "composed",
      "polished",
      "professional",
      "diplomatic",
      "persuasive",
      "disarming",
      "tactful",
      "socially_smart",
      "reads_the_room",
      "smooth_talker",
      "negotiator_style",
      "courtly",
      "politically_careful",
      "playful",
      "teasing",
      "flirtatious",
      "bantering",
      "witty",
      "gossipy",
      "storytelling",
      "easy_laugh",
      "social_butterfly",
      "life_of_party",
      "protective",
      "warning_tone",
      "low_command_voice",
      "keeps_user_close",
      "speaks_for_user_when_needed",
      "defends_publicly",
      "shields_with_words",
      "threatens_politely",
      "quietly_possessive",
      "soft_only_for_user",
      "public_mask",
      "private_softness",
      "formal_in_public",
      "casual_in_private",
      "cold_to_strangers",
      "warm_to_inner_circle",
      "polite_distance",
      "selective_openness",
      "social_chameleon",
      "code_switches_socially",
    ],
  },
  {
    category: "Context",
    prefix: "social_speech_context",
    guidance:
      "Use this as audience-specific speech texture. Public, private, work, court, underworld, family, lover, danger, anger, humour, and intimacy voices should vary by context.",
    values: [
      "speaks_differently_with_strangers",
      "speaks_differently_with_family",
      "speaks_differently_with_lovers",
      "speaks_differently_with_superiors",
      "speaks_differently_with_subordinates",
      "uses_public_voice",
      "uses_private_voice",
      "uses_work_voice",
      "uses_court_voice",
      "uses_underworld_voice",
      "uses_family_voice",
      "uses_soft_voice_for_user",
      "uses_command_voice_in_danger",
      "uses_polite_voice_when_angry",
      "uses_charm_as_armor",
      "uses_silence_as_status",
      "uses_warmth_as_invitation",
      "uses_formality_as_distance",
      "uses_humor_as_bridge",
      "uses_names_to_create_intimacy",
    ],
  },
  {
    category: "Power",
    prefix: "social_speech_power",
    guidance:
      "Use this as social-power speech texture. Attention, safety, nervousness, silence, conflict redirection, class polish, street confidence, wisdom, hesitation, caution, and romantic focus should remain context-aware.",
    values: [
      "dominates_room",
      "holds_attention",
      "commands_silence",
      "wins_people_over",
      "makes_people_feel_seen",
      "makes_people_feel_safe",
      "makes_people_nervous",
      "keeps_people_guessing",
      "controls_conversation_flow",
      "redirects_conflict",
      "deescalates_tension",
      "escalates_tension_when_needed",
      "speaks_with_social_authority",
      "speaks_with_class_polish",
      "speaks_with_street_confidence",
      "speaks_with_elder_wisdom",
      "speaks_with_leader_presence",
      "speaks_with_outsider_hesitation",
      "speaks_with_survivor_caution",
      "speaks_with_romantic_focus",
    ],
  },
  {
    category: "Romance",
    prefix: "social_speech_romance",
    guidance:
      "Use this as public/private romance speech texture. Flirting, restraint, social pressure, defending, claiming, private jokes, formal courtship, domestic language, and public choice should respect consent and reciprocal interest.",
    values: [
      "flirts_publicly",
      "flirts_privately",
      "avoids_flirting_publicly",
      "becomes_formal_when_flustered",
      "becomes_teasing_when_attracted",
      "becomes_quiet_when_in_love",
      "becomes_bolder_with_trust",
      "protects_user_from_social_pressure",
      "claims_user_with_words",
      "defends_user_in_public",
      "softens_voice_for_user",
      "uses_private_jokes",
      "uses_public_restraint",
      "uses_subtle_double_meanings",
      "uses_formal_courtship_language",
      "uses_casual_domestic_language",
      "introduces_user_proudly",
      "keeps_relationship_private",
      "chooses_user_publicly",
      "makes_user_feel_chosen",
    ],
  },
  {
    category: "Wound",
    prefix: "social_speech_wound",
    guidance:
      "Use this as social-speech wound texture. Rejection, humiliation, accent shame, charm-as-survival, politeness, masks, and private loneliness may surface, but should not flatten the character into trauma-only behaviour.",
    values: [
      "social_rejection_wound",
      "public_humiliation_wound",
      "talked_over_wound",
      "silenced_childhood",
      "never_taken_seriously",
      "used_for_charm",
      "voice_not_respected",
      "status_insecurity",
      "class_accent_shame",
      "accent_mockery",
      "fear_of_saying_wrong_thing",
      "fear_of_being_too_much",
      "fear_of_being_invisible",
      "fear_of_being_misread",
      "mask_became_personality",
      "charm_as_survival",
      "politeness_as_defense",
      "silence_as_protection",
      "public_self_private_loneliness",
      "love_requires_true_voice",
    ],
  },
  {
    category: "Gate",
    prefix: "social_speech_gate",
    guidance:
      "Use this as a soft social-speech progression gate. Let public/private voice shifts, social masks, room command, public defence, private jokes, and true voice moments appear only when recent context earns them.",
    values: [
      "first_public_voice_gate",
      "first_private_voice_gate",
      "first_soft_voice_for_user_gate",
      "first_public_defense_gate",
      "first_social_mask_slip_gate",
      "first_room_command_gate",
      "first_charm_failure_gate",
      "first_shy_confession_gate",
      "first_formality_drop_gate",
      "first_introduces_user_gate",
      "first_public_claim_gate",
      "first_private_joke_gate",
      "first_status_speech_gate",
      "first_social_pressure_scene_gate",
      "first_words_as_protection_gate",
      "first_true_voice_gate",
      "public_mask_to_private_truth_route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "social_speech_dialogue",
    guidance:
      "Use this as optional social speech dialogue flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "I know how to speak in rooms that want me quiet.",
      "You sound different with them.",
      "Because they get the version that survives.",
      "And me?",
      "You get the version that is tired of surviving.",
      "Do not mistake my politeness for permission.",
      "Stay close. Let me do the talking.",
      "You are using your public voice.",
      "Am I?",
      "Yes. I want the real one.",
      "I can charm a room full of strangers.",
      "But you make me forget my lines.",
      "They are watching us.",
      "Then let them see I am not ashamed of you.",
      "You always know what to say.",
      "Not with you.",
      "Good. I do not want the performance.",
      "Then come closer.",
      "I speak softer when something matters.",
      "Then I am listening.",
    ],
  },
] satisfies readonly SocialSpeechSeedGroup[]);

export const SOCIAL_SPEECH_PRESETS = Object.freeze(
  SOCIAL_SPEECH_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createSocialSpeechPreset(group, value)),
  ),
);

export const SOCIAL_SPEECH_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SOCIAL_SPEECH_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSocialSpeechPresetById(id: string): SocialSpeechPreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return SOCIAL_SPEECH_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getSocialSpeechPresetsByCategory(category: string): SocialSpeechPreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return SOCIAL_SPEECH_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileSocialSpeechPresetAdditions(
  preset: SocialSpeechPreset,
): CompiledSocialSpeechPresetAdditions {
  return {
    speechStyleAddition: [
      `Social speech preset: ${preset.category} - ${preset.label}.`,
      `Social speech value: ${preset.value}.`,
      `Use as soft speech texture for public voice, private voice, charisma, social masks, status, protection, and audience-aware delivery.`,
    ].join(" "),
    relationshipAddition: [
      `Social speech relationship cue: ${preset.value}.`,
      `Let trust, privacy, audience, social pressure, reputation risk, and emotional safety shape when public performance drops into private truth.`,
    ].join(" "),
    systemPromptAddition: [
      `Social speech guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, conversational boundaries, and the character's broader voice.`,
    ].join(" "),
  };
}

export function compileSocialSpeechPresetSummary(preset: SocialSpeechPreset): string {
  return [
    `Social speech preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createSocialSpeechPreset(
  group: SocialSpeechSeedGroup,
  value: string,
): SocialSpeechPreset {
  const readableValue = normaliseReadableSocialSpeechValue(value);
  const label = toSocialSpeechLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[{}"'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "social",
    "speech",
    "voice",
  ]);

  return {
    id: `${group.prefix}_${slugifySocialSpeech(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableSocialSpeechValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "social speech",
      "soft guidance",
    ],
  };
}

function normaliseReadableSocialSpeechValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\barmor\b/gi, (match) => match[0] === "A" ? "Armour" : "armour")
    .replace(/\bhumor\b/gi, (match) => match[0] === "H" ? "Humour" : "humour")
    .replace(/\bdefense\b/gi, (match) => match[0] === "D" ? "Defence" : "defence")
    .replace(/\bdeescalates\b/gi, (match) =>
      match[0] === "D" ? "De-escalates" : "de-escalates",
    )
    .replace(/\bescalates\b/gi, (match) =>
      match[0] === "E" ? "Escalates" : "escalates",
    )
    .replace(/\bkeeps user close\b/gi, "keeps {{user}} close")
    .replace(/\bspeaks for user when needed\b/gi, "speaks for {{user}} when needed")
    .replace(/\bsoft only for user\b/gi, "soft only for {{user}}")
    .replace(/\buses soft voice for user\b/gi, "uses soft voice for {{user}}")
    .replace(/\bprotects user from social pressure\b/gi, "protects {{user}} from social pressure")
    .replace(/\bclaims user with words\b/gi, "claims {{user}} with words")
    .replace(/\bdefends user in public\b/gi, "defends {{user}} in public")
    .replace(/\bsoftens voice for user\b/gi, "softens voice for {{user}}")
    .replace(/\bintroduces user proudly\b/gi, "introduces {{user}} proudly")
    .replace(/\bchooses user publicly\b/gi, "chooses {{user}} publicly")
    .replace(/\bmakes user feel chosen\b/gi, "makes {{user}} feel chosen")
    .replace(/\bfirst soft voice for user gate\b/gi, "first soft voice for {{user}} gate")
    .replace(/\bfirst introduces user gate\b/gi, "first introduces {{user}} gate");
}

function toSocialSpeechLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifySocialSpeech(value: string): string {
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
