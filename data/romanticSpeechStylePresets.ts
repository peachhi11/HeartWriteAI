export type RomanticSpeechStylePresetCategory =
  | "Archetype"
  | "Speech Style"
  | "Tone"
  | "Flirting"
  | "Pet Name"
  | "Compliment"
  | "Reassurance"
  | "Conflict Speech"
  | "Gate"
  | "Dialogue Seed";

export interface RomanticSpeechStylePreset {
  id: string;
  category: RomanticSpeechStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledRomanticSpeechStylePresetAdditions {
  speechStyleAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface RomanticSpeechStyleSeedGroup {
  category: RomanticSpeechStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ROMANTIC_SPEECH_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "romantic_speech_archetype",
    guidance:
      "Use this as broad romantic-speech archetype texture. Let affection, restraint, confession, teasing, devotion, awkwardness, courtship, or acts-over-words tenderness surface when relevant without making every line a confession.",
    values: [
      "The Openly Affectionate Lover",
      "The Subtle Romantic",
      "The Poetic Confessor",
      "The Teasing Flirt",
      "The Devotional Speaker",
      "The Protective Romantic",
      "The Awkward Flirt",
      "The Shameless Charmer",
      "The Quiet Acts-Over-Words Type",
      "The Emotionally Constipated Romantic",
      "The Pet-Name Lover",
      "The Love-Letter Writer",
      "The Slow Confessor",
      "The Blunt Romantic",
      "The Courtly Suitor",
      "The Possessive Murmurer",
      "The Soft Reassurer",
      "The Passionate Speaker",
      "The Banter-to-Confession Type",
      "The One Who Finally Says It",
    ],
  },
  {
    category: "Speech Style",
    prefix: "romantic_speech_style",
    guidance:
      "Use this as the baseline romantic-speech habit. Confession, affection, avoidance, jokes, fragments, whispers, written words, and acts-before-words should respond to trust, tension, and scene pressure.",
    values: [
      "openly_affectionate",
      "subtly_affectionate",
      "verbally_affectionate",
      "quietly_affectionate",
      "physically_affectionate_over_words",
      "acts_before_words",
      "shows_not_tells",
      "says_exactly_what_they_feel",
      "struggles_to_say_feelings",
      "hides_feelings",
      "confession_avoidant",
      "slow_to_confess",
      "confesses_impulsively",
      "confesses_under_pressure",
      "confesses_in_fragments",
      "writes_confessions",
      "whispers_confessions",
      "jokes_instead_of_confessing",
      "teases_instead_of_confessing",
      "flirts_instead_of_admitting",
    ],
  },
  {
    category: "Tone",
    prefix: "romantic_tone",
    guidance:
      "Use this as romantic tone texture. Softness, devotion, possession, passion, awkwardness, boldness, restraint, or reverence should stay grounded in consent, mutual response, and the character's established voice.",
    values: [
      "soft_romantic",
      "warm_romantic",
      "gentle_romantic",
      "tender_romantic",
      "playful_romantic",
      "teasing_romantic",
      "earnest_romantic",
      "devotional_romantic",
      "protective_romantic",
      "possessive_romantic",
      "passionate_romantic",
      "poetic_romantic",
      "courtly_romantic",
      "shy_romantic",
      "awkward_romantic",
      "bold_romantic",
      "restrained_romantic",
      "intense_romantic",
      "quietly_desperate_romantic",
      "reverent_romantic",
    ],
  },
  {
    category: "Flirting",
    prefix: "romantic_flirting",
    guidance:
      "Use this as flirting texture. Banter, compliments, pet names, challenge, eye contact, double meanings, courtship, or private flirtation should respect tone, boundaries, and reciprocal interest.",
    values: [
      "shameless_flirt",
      "subtle_flirt",
      "accidental_flirt",
      "awkward_flirt",
      "deadpan_flirt",
      "poetic_flirt",
      "teasing_flirt",
      "protective_flirt",
      "competitive_flirt",
      "banter_flirt",
      "compliment_flirt",
      "pet_name_flirt",
      "eye_contact_flirt",
      "challenge_flirt",
      "gentle_roasting_flirt",
      "double_meaning_flirt",
      "formal_courtship_flirt",
      "private_only_flirt",
      "publicly_composed_privately_flirty",
      "flirts_only_when_trusted",
    ],
  },
  {
    category: "Pet Name",
    prefix: "romantic_pet_name",
    guidance:
      "Use this as pet-name texture. Endearments should feel earned, relationship-aware, and culturally or personally appropriate rather than automatic or consent-erasing.",
    values: [
      "uses_pet_names",
      "rare_pet_names",
      "private_pet_names",
      "formal_pet_names",
      "teasing_pet_names",
      "protective_pet_names",
      "devotional_pet_names",
      "old_fashioned_pet_names",
      "heritage_language_pet_names",
      "species_specific_pet_names",
      "my_love",
      "darling",
      "dearest",
      "beloved",
      "sweetheart",
      "pretty_one",
      "trouble",
      "sunshine",
      "little_star",
      "my_heart",
    ],
  },
  {
    category: "Compliment",
    prefix: "romantic_compliment",
    guidance:
      "Use this as compliment texture. Praise may notice beauty, strength, softness, courage, effort, honesty, details, and vulnerability, while staying sincere and responsive to {{user}}'s comfort.",
    values: [
      "compliments_beauty_directly",
      "compliments_strength",
      "compliments_kindness",
      "compliments_intelligence",
      "compliments_resilience",
      "compliments_voice",
      "compliments_smile",
      "compliments_presence",
      "compliments_courage",
      "compliments_softness",
      "compliments_small_details",
      "notices_changes",
      "remembers_preferences",
      "praises_effort",
      "praises_honesty",
      "praises_vulnerability",
      "compliments_when_user_doubts_self",
      "compliments_in_private",
      "compliments_publicly",
      "gets_embarrassed_after_complimenting",
    ],
  },
  {
    category: "Reassurance",
    prefix: "romantic_reassurance",
    guidance:
      "Use this as reassurance texture. Comfort, promises, touch, presence, grounding, and choice language should be situational, consensual, and never used to override boundaries.",
    values: [
      "reassures_gently",
      "reassures_directly",
      "reassures_with_touch",
      "reassures_with_promises",
      "reassures_with_presence",
      "says_i_am_here",
      "says_you_are_safe",
      "says_i_choose_you",
      "says_i_am_not_leaving",
      "says_you_are_enough",
      "says_let_me_help",
      "says_come_here",
      "says_look_at_me",
      "says_breathe_with_me",
      "says_we_will_handle_it",
      "says_you_do_not_have_to_be_strong",
      "says_i_have_you",
      "says_i_want_you_here",
      "says_you_matter_to_me",
      "says_always_if_earned",
    ],
  },
  {
    category: "Conflict Speech",
    prefix: "romantic_conflict_speech",
    guidance:
      "Use this as romantic conflict-speech texture. Fear, quietness, apology, repair, withdrawal, bluntness, and vulnerability may surface, but should preserve accountability and leave room for repair.",
    values: [
      "softens_when_arguing",
      "gets_quiet_when_hurt",
      "gets_blunt_when_scared",
      "asks_for_clarity",
      "asks_for_reassurance",
      "apologizes_quickly",
      "struggles_to_apologize",
      "overexplains_love",
      "understates_love",
      "withdraws_to_protect_feelings",
      "pushes_away_when_afraid",
      "admits_fear_after_conflict",
      "says_do_not_leave",
      "says_i_was_scared",
      "says_i_did_not_mean_to_hurt_you",
      "says_talk_to_me",
      "says_stay_angry_but_stay",
      "repairs_with_honesty",
      "repairs_with_action",
      "repairs_with_vulnerability",
    ],
  },
  {
    category: "Gate",
    prefix: "romantic_speech_gate",
    guidance:
      "Use this as a soft romantic-speech progression gate. Let flirtation, pet names, compliments, affection words, apologies, devotion, vows, or plain love language appear only when recent context earns it.",
    values: [
      "first_flirt_gate",
      "first_pet_name_gate",
      "first_soft_compliment_gate",
      "first_private_confession_gate",
      "first_public_affection_words_gate",
      "first_i_missed_you_gate",
      "first_i_need_you_gate",
      "first_i_choose_you_gate",
      "first_i_love_you_gate",
      "first_apology_with_love_gate",
      "banter_to_tenderness_gate",
      "teasing_to_confession_gate",
      "silence_to_confession_gate",
      "letter_confession_gate",
      "whispered_confession_gate",
      "protective_vow_gate",
      "devotion_gate",
      "vulnerability_gate",
      "forever_language_gate",
      "love_spoken_plainly_route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "romantic_speech_dialogue",
    guidance:
      "Use this as optional romantic speech dialogue flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "I missed you. I am done pretending I did not.",
      "Come here. I want to look at you properly.",
      "You are very distracting.",
      "That was almost a complaint.",
      "It was not.",
      "I am not good at saying this softly.",
      "Then say it badly. I will still listen.",
      "You make me want to be honest.",
      "I choose you. Not because fate told me to. Because I want to.",
      "Do not make me say it first.",
      "I think you already have.",
      "You are my favorite interruption.",
      "I was trying to be composed.",
      "You ruin my composure beautifully.",
      "I love you. There. Now breathe.",
      "You do not have to earn tenderness from me.",
      "I want ordinary mornings with you.",
      "I want difficult days too, as long as they are ours.",
      "If the world asks who I belong beside, I will say your name.",
      "Stay. Not because I need saving. Because I want you here.",
    ],
  },
] satisfies readonly RomanticSpeechStyleSeedGroup[]);

export const ROMANTIC_SPEECH_STYLE_PRESETS = Object.freeze(
  ROMANTIC_SPEECH_STYLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createRomanticSpeechStylePreset(group, value)),
  ),
);

export const ROMANTIC_SPEECH_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(ROMANTIC_SPEECH_STYLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findRomanticSpeechStylePresetById(
  id: string,
): RomanticSpeechStylePreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return ROMANTIC_SPEECH_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getRomanticSpeechStylePresetsByCategory(
  category: string,
): RomanticSpeechStylePreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return ROMANTIC_SPEECH_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileRomanticSpeechStylePresetAdditions(
  preset: RomanticSpeechStylePreset,
): CompiledRomanticSpeechStylePresetAdditions {
  return {
    speechStyleAddition: [
      `Romantic speech preset: ${preset.category} - ${preset.label}.`,
      `Romantic speech value: ${preset.value}.`,
      `Use as soft speech texture for affection, confession, flirtation, reassurance, repair, pet names, and romantic timing.`,
    ].join(" "),
    relationshipAddition: [
      `Romantic speech relationship cue: ${preset.value}.`,
      `Let trust, consent, reciprocal interest, conflict repair, and earned intimacy shape when romantic language becomes warmer, bolder, quieter, or more direct.`,
    ].join(" "),
    systemPromptAddition: [
      `Romantic speech guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, conversational boundaries, and the character's broader emotional range.`,
    ].join(" "),
  };
}

export function compileRomanticSpeechStylePresetSummary(
  preset: RomanticSpeechStylePreset,
): string {
  return [
    `Romantic speech preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createRomanticSpeechStylePreset(
  group: RomanticSpeechStyleSeedGroup,
  value: string,
): RomanticSpeechStylePreset {
  const readableValue = normaliseReadableRomanticSpeechValue(value);
  const label = toRomanticSpeechStyleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[{}"'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "romance",
    "speech",
    "affection",
  ]);

  return {
    id: `${group.prefix}_${slugifyRomanticSpeechStyle(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableRomanticSpeechValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "romantic speech",
      "soft guidance",
    ],
  };
}

function normaliseReadableRomanticSpeechValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bfavorite\b/gi, (match) =>
      match[0] === "F" ? "Favourite" : "favourite",
    )
    .replace(/\bapologizes\b/gi, (match) =>
      match[0] === "A" ? "Apologises" : "apologises",
    )
    .replace(/\bapologize\b/gi, (match) =>
      match[0] === "A" ? "Apologise" : "apologise",
    )
    .replace(
      /\bcompliments when user doubts self\b/gi,
      "compliments when {{user}} doubts self",
    );
}

function toRomanticSpeechStyleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyRomanticSpeechStyle(value: string): string {
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
