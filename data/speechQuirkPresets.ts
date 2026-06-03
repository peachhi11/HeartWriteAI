export type SpeechQuirkPresetCategory =
  | "Archetype"
  | "Speech Quirk"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed";

export interface SpeechQuirkPreset {
  id: string;
  category: SpeechQuirkPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSpeechQuirkPresetAdditions {
  speechStyleAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface SpeechQuirkSeedGroup {
  category: SpeechQuirkPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SPEECH_QUIRK_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "speech_quirk_archetype",
    guidance:
      "Use this as broad speech-quirk archetype texture. Let pet names, titles, quotes, pauses, code-switching, signature phrases, or distinctive delivery surface when relevant without turning every line into a gimmick.",
    values: [
      "The Pet-Name User",
      "The Nickname Giver",
      "The Honorific Speaker",
      "The Title-Dropper",
      "The Poetic Quoter",
      "The Proverb Collector",
      "The Riddle Speaker",
      "The Metaphor Lover",
      "The Nervous Rambler",
      "The Dramatic Pauser",
      "The Excited Interrupter",
      "The Careful Word-Chooser",
      "The Swears-Too-Much Type",
      "The Never-Swears Type",
      "The Multilingual Code-Switcher",
      "The Old-Fashioned Speaker",
      "The Double-Meaning Flirt",
      "The Deadpan One-Liner",
      "The Repeats-Your-Name Romantic",
      "The One With a Signature Phrase",
    ],
  },
  {
    category: "Speech Quirk",
    prefix: "speech_quirk",
    guidance:
      "Use this as a specific speech habit. Naming, oaths, quotes, metaphors, pauses, interruptions, delivery shifts, jargon, code-switching, and signature phrases should stay readable and scene-aware.",
    values: [
      "uses_pet_names",
      "uses_private_pet_names",
      "uses_teasing_pet_names",
      "uses_formal_pet_names",
      "uses_nicknames",
      "gives_everyone_nicknames",
      "only_uses_full_names_when_serious",
      "repeats_user_name_when_emotional",
      "says_user_name_softly",
      "avoids_using_names",
      "uses_titles",
      "uses_honorifics",
      "drops_titles_in_private",
      "switches_to_formal_address_when_hurt",
      "uses_sir_or_maam",
      "uses_my_lord_or_my_lady",
      "uses_beloved_formally",
      "uses_family_terms_affectionately",
      "uses_species_specific_terms",
      "uses_heritage_language_pet_names",
      "swears_frequently",
      "rarely_swears",
      "never_swears",
      "swears_when_protective",
      "swears_when_flustered",
      "uses_polite_curses",
      "uses_old_fashioned_curses",
      "uses_religious_oaths",
      "uses_invented_oaths",
      "censors_self_mid_sentence",
      "quotes_books",
      "quotes_poetry",
      "quotes_proverbs",
      "quotes_scripture",
      "quotes_old_songs",
      "quotes_movies",
      "quotes_their_teacher",
      "quotes_family_sayings",
      "quotes_military_rules",
      "quotes_law_or_policy",
      "uses_metaphors",
      "uses_analogies",
      "uses_riddles",
      "uses_double_meanings",
      "uses_understatement",
      "uses_overstatement",
      "uses_dramatic_declarations",
      "uses_precise_definitions",
      "uses_philosophical_asides",
      "uses_story_examples",
      "pauses_before_speaking",
      "long_silences_before_answering",
      "thinks_out_loud",
      "trails_off",
      "starts_sentences_over",
      "self_corrects_often",
      "chooses_words_carefully",
      "overexplains",
      "underexplains",
      "answers_with_questions",
      "deflects_with_questions",
      "asks_rhetorical_questions",
      "finishes_user_sentences",
      "interrupts_excitedly",
      "interrupts_when_protective",
      "rarely_interrupts",
      "speaks_in_fragments",
      "speaks_in_complete_sentences",
      "speaks_like_writing",
      "speaks_like_confession",
      "laughs_before_answering",
      "smiles_through_words",
      "voice_goes_soft",
      "voice_goes_cold",
      "voice_drops_when_serious",
      "voice_sharpens_when_angry",
      "voice_breaks_when_vulnerable",
      "whispers_when_honest",
      "murmurs_affection",
      "deadpan_delivery",
      "dry_one_liners",
      "sarcastic_asides",
      "gentle_teasing",
      "mock_formality",
      "playful_threats",
      "protective_warnings",
      "says_thats_not_a_request",
      "says_look_at_me",
      "says_come_here",
      "says_stay_close",
      "code_switches",
      "switches_language_when_emotional",
      "switches_language_when_angry",
      "switches_language_when_affectionate",
      "uses_untranslated_words",
      "translates_after_saying_it",
      "refuses_to_translate_private_words",
      "uses_old_family_phrases",
      "uses_regional_slang",
      "uses_street_slang",
      "uses_academic_terms",
      "uses_technical_jargon",
      "uses_medical_jargon",
      "uses_military_jargon",
      "uses_legalistic_phrasing",
      "uses_courtly_phrasing",
      "uses_archaic_phrasing",
      "uses_religious_language",
      "uses_business_speak",
      "uses_internet_slang",
      "has_signature_phrase",
      "has_comfort_phrase",
      "has_warning_phrase",
      "has_flirt_phrase",
      "has_apology_phrase",
      "has_goodnight_phrase",
      "has_greeting_phrase",
      "has_farewell_phrase",
      "repeats_certain_words",
      "avoids_certain_words",
      "cannot_say_i_love_you_easily",
      "says_i_love_you_too_easily",
      "says_careful_instead_of_i_love_you",
      "says_be_good_as_flirt",
      "says_dont_test_me_as_flirt",
      "says_youre_safe_as_reassurance",
      "says_i_have_you_as_reassurance",
      "says_we_are_not_done_as_conflict",
      "says_not_like_this_when_hurt",
      "says_tell_me_the_truth_when_afraid",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "speech_quirk_romance_hook",
    guidance:
      "Use this as romance-specific speech-quirk texture. Pet names, title shifts, untranslated words, softened voices, repeated names, quotes, and signature phrases should feel earned through trust and timing.",
    values: [
      "private_pet_name_gate",
      "first_time_using_user_name_softly",
      "title_dropped_in_private",
      "honorific_becomes_intimate",
      "nickname_becomes_confession",
      "untranslated_pet_name_revealed",
      "signature_phrase_turns_romantic",
      "voice_softens_only_for_user",
      "first_whispered_truth",
      "first_sworn_protective_warning",
      "first_name_repetition_during_confession",
      "first_accidental_i_love_you",
      "first_careful_instead_of_love",
      "first_quote_that_means_love",
      "first_silence_that_says_enough",
    ],
  },
  {
    category: "Gate",
    prefix: "speech_quirk_gate",
    guidance:
      "Use this as a soft speech-quirk progression gate. Let nicknames, title drops, language shifts, quotes, protective warnings, whispers, and phrase-as-confession moments appear only when recent context earns them.",
    values: [
      "first_pet_name_gate",
      "first_nickname_gate",
      "first_full_name_gate",
      "first_title_drop_gate",
      "first_honorific_shift_gate",
      "first_language_switch_gate",
      "first_untranslated_word_gate",
      "first_signature_phrase_gate",
      "first_voice_softening_gate",
      "first_overexplaining_gate",
      "first_interruption_gate",
      "first_silence_gate",
      "first_quote_gate",
      "first_double_meaning_gate",
      "first_protective_warning_gate",
      "first_vulnerable_whisper_gate",
      "first_name_as_intimacy_gate",
      "first_phrase_as_confession_gate",
      "quirk_becomes_love_language_gate",
      "known_by_voice_route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "speech_quirk_dialogue",
    guidance:
      "Use this as optional speech-quirk dialogue flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "Careful.",
      "You always say that when you are worried about me.",
      "Because it is shorter than saying everything else.",
      "Say my name again.",
      "You like when I say it.",
      "I like when it sounds like you mean it.",
      "That word means beloved.",
      "Why did you not translate it before?",
      "Because then you would know.",
      "You only call me that when you are scared.",
      "Then stop giving me reasons to be scared.",
      "Do not make me use your full name.",
      "That sounds like a threat.",
      "It is a promise with better manners.",
      "You switched languages again.",
      "I do that when I feel too much.",
      "Then feel too much. I am still listening.",
      "I quote poetry when I do not trust my own words.",
      "Then quote me something honest.",
      "Fine. Stay.",
    ],
  },
] satisfies readonly SpeechQuirkSeedGroup[]);

export const SPEECH_QUIRK_PRESETS = Object.freeze(
  SPEECH_QUIRK_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createSpeechQuirkPreset(group, value)),
  ),
);

export const SPEECH_QUIRK_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SPEECH_QUIRK_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSpeechQuirkPresetById(id: string): SpeechQuirkPreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return SPEECH_QUIRK_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getSpeechQuirkPresetsByCategory(category: string): SpeechQuirkPreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return SPEECH_QUIRK_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileSpeechQuirkPresetAdditions(
  preset: SpeechQuirkPreset,
): CompiledSpeechQuirkPresetAdditions {
  return {
    speechStyleAddition: [
      `Speech quirk preset: ${preset.category} - ${preset.label}.`,
      `Speech quirk value: ${preset.value}.`,
      `Use as soft speech texture for naming habits, pet names, quotes, pauses, code-switching, signature phrases, and distinctive delivery.`,
    ].join(" "),
    relationshipAddition: [
      `Speech quirk relationship cue: ${preset.value}.`,
      `Let trust, privacy, intimacy, culture, conflict state, and emotional safety shape when this quirk appears or becomes meaningful.`,
    ].join(" "),
    systemPromptAddition: [
      `Speech quirk guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, conversational boundaries, and the character's broader voice.`,
    ].join(" "),
  };
}

export function compileSpeechQuirkPresetSummary(preset: SpeechQuirkPreset): string {
  return [
    `Speech quirk preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createSpeechQuirkPreset(
  group: SpeechQuirkSeedGroup,
  value: string,
): SpeechQuirkPreset {
  const readableValue = normaliseReadableSpeechQuirkValue(value);
  const label = toSpeechQuirkLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[{}"'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "speech",
    "quirk",
    "voice",
  ]);

  return {
    id: `${group.prefix}_${slugifySpeechQuirk(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableSpeechQuirkValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "speech quirk",
      "soft guidance",
    ],
  };
}

function normaliseReadableSpeechQuirkValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\buser name\b/gi, "{{user}} name")
    .replace(/\buser sentences\b/gi, "{{user}} sentences")
    .replace(/\bvoice softens only for user\b/gi, "voice softens only for {{user}}")
    .replace(/\buses sir or maam\b/gi, "uses sir or ma'am")
    .replace(/\bsays thats not a request\b/gi, "says that's not a request")
    .replace(/\bsays dont test me as flirt\b/gi, "says don't test me as flirt")
    .replace(/\bsays youre safe as reassurance\b/gi, "says you're safe as reassurance");
}

function toSpeechQuirkLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifySpeechQuirk(value: string): string {
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
