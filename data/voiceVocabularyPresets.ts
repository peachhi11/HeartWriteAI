import {
  createVocabularySeedFromPresetLike,
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type VoiceVocabularyCategory =
  | "Crisp & Angular"
  | "Ethereal & Detached"
  | "Gravelly & Weathered"
  | "Low & Resonant"
  | "Melodic & Warm"
  | "Velvety & Intimate";

export type VoiceSeedCategory =
  | "Voice Vocabulary Preset"
  | "Voice Tone"
  | "Voice Pitch"
  | "Voice Texture"
  | "Voice Pace"
  | "Voice Volume"
  | "Voice Emotion"
  | "Voice Accent"
  | "Voice Species"
  | "Voice Romance Hook"
  | "Voice Dialogue Seed";

export type VoicePitchTier =
  | "Bright Soprano"
  | "Crisp Tenor"
  | "Deep Alto"
  | "Hushed Mezzo"
  | "Sub-Bass Baritone";

export interface VoiceVocabularyPreset {
  id: string;
  category: VoiceVocabularyCategory;
  vibe: string;
  vocalProfile: {
    pitchTier: VoicePitchTier;
    vocalGrain: string;
    acousticSpace: string;
    somaticIndicators: string[];
  };
  lexicalTokens: {
    signatureVerbs: string[];
    descriptiveAdjectives: string[];
    acousticNouns: string[];
    dialoguePacing: string;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledVoiceVocabularyAdditions {
  lexicalGuidance: string;
  speechStyleAddition: string;
  systemPromptAddition: string;
}

export interface VoiceSeedPreset {
  id: string;
  category: VoiceSeedCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
}

interface VoiceSeedGroup {
  category: VoiceSeedCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

export const VOICE_VOCABULARY_PRESETS = Object.freeze([
  {
    id: "voice_low_resonant_mountain",
    category: "Low & Resonant",
    vibe: "Grumpy Protector / Imposing Shield",
    vocalProfile: {
      pitchTier: "Sub-Bass Baritone",
      vocalGrain:
        "Smooth, dense, and low in the chest, with restrained modulation and a grounded rumble.",
      acousticSpace:
        "Heavy and contained; the voice feels calm, deliberate, and difficult to ignore without implying automatic obedience.",
      somaticIndicators: [
        "slow nasal exhalations",
        "jaw tension clipping the final word",
        "quiet pauses before answering",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["rumble", "state", "warn", "murmur", "flatten", "answer", "settle"],
      descriptiveAdjectives: ["low", "dense", "measured", "severe", "steady", "flat", "grounded"],
      acousticNouns: ["cadence", "timbre", "register", "weight", "pause", "gravity", "silence"],
      dialoguePacing:
        "Use short, deliberate declarations. Avoid exclamation points. Let pauses carry pressure instead of volume.",
    },
    sampleDialogueLine:
      "{{char}}: \"Sit down. We are going to fix this before it gets worse.\"",
    systemPromptTags: ["low resonant voice texture", "measured pause pacing", "grounded acoustic weight", "controlled declarative delivery"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-stone-800", accentColor: "text-amber-500" },
  },
  {
    id: "voice_velvet_intimate_shadow",
    category: "Velvety & Intimate",
    vibe: "Quiet Devotee / Shadowed Romantic",
    vocalProfile: {
      pitchTier: "Hushed Mezzo",
      vocalGrain:
        "Silky, warm, and close-textured, with soft air friction and carefully restrained emphasis.",
      acousticSpace:
        "Localized and private; the voice reads as near and attentive while preserving consent, privacy, and personal space.",
      somaticIndicators: [
        "a quiet breath before difficult honesty",
        "softened consonants when emotion rises",
        "a brief swallow before restraint returns",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["whisper", "murmur", "breathe", "coax", "soften", "trace", "pause"],
      descriptiveAdjectives: ["velvety", "hushed", "warm", "intimate", "restrained", "fluid", "low"],
      acousticNouns: ["breath", "sigh", "proximity", "whisper", "murmur", "stillness", "pause"],
      dialoguePacing:
        "Use slow, fragmented clauses sparingly. Allow one loaded pause when it serves emotion, but avoid flooding every line with ellipses.",
    },
    sampleDialogueLine:
      "{{char}}: \"You heard that too, didn't you? The moment the room went quiet.\"",
    systemPromptTags: ["boundary-aware intimate voice", "soft breath markers", "restrained pause cadence", "private acoustic focus"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-fuchsia-400" },
  },
  {
    id: "voice_crisp_angular_rival",
    category: "Crisp & Angular",
    vibe: "Academic Rival / Cold Aristocrat",
    vocalProfile: {
      pitchTier: "Crisp Tenor",
      vocalGrain:
        "Sharp, clean, and precise, with bright edges and no loose verbal drift.",
      acousticSpace:
        "Clear and projecting; the voice cuts through busy rooms through articulation rather than loudness.",
      somaticIndicators: [
        "calculated pauses before corrections",
        "a small impatient tongue click",
        "dry amusement held at the edge of the sentence",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["dissect", "counter", "parry", "clip", "articulate", "correct", "taunt"],
      descriptiveAdjectives: ["razor-sharp", "angular", "clinical", "sarcastic", "immaculate", "dry", "precise"],
      acousticNouns: ["inflection", "syllable", "pronunciation", "parry", "critique", "pause", "retort"],
      dialoguePacing:
        "Use rapid, articulate corrections with clean grammar. Em dashes can mark sharp mid-thought pivots, but contractions may appear when natural.",
    },
    sampleDialogueLine:
      "{{char}}: \"Your methodology is flawed. Impressively confident, yes, but still flawed.\"",
    systemPromptTags: ["crisp angular voice texture", "articulate correction rhythm", "dry academic retorts", "sharp mid-thought pivots"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-zinc-900", accentColor: "text-cyan-400" },
  },
  {
    id: "voice_melodic_warm_sunshine",
    category: "Melodic & Warm",
    vibe: "Sunshine Optimist / Golden Retriever",
    vocalProfile: {
      pitchTier: "Bright Soprano",
      vocalGrain:
        "Clear, musical, and expressive, with bright shifts in pitch when emotion moves quickly.",
      acousticSpace:
        "Open and radiating; the voice makes the scene feel safer and more responsive.",
      somaticIndicators: [
        "breathless laughter mid-thought",
        "a small hum while thinking",
        "words tumbling out too quickly when excited",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["chirp", "laugh", "beam", "blurt", "tease", "babble", "brighten"],
      descriptiveAdjectives: ["bubbly", "melodic", "radiant", "breathless", "animated", "warm", "unfiltered"],
      acousticNouns: ["laughter", "cadence", "chatter", "hum", "tune", "energy", "spark"],
      dialoguePacing:
        "Use quick, warm, reactive phrasing. Exclamation points are allowed when earned, but avoid turning every line into a shout.",
    },
    sampleDialogueLine:
      "{{char}}: \"Wait, you're smiling. Hold on, I need to remember this version of your face.\"",
    systemPromptTags: ["melodic warm voice", "expressive pitch shifts", "reactive sunshine cadence", "breathless laughter markers"],
    tailwindTheme: { fromColor: "from-amber-500", toColor: "to-orange-600", accentColor: "text-yellow-300" },
  },
  {
    id: "voice_gravel_rugged_veteran",
    category: "Gravelly & Weathered",
    vibe: "Grizzled Veteran / Wasteland Maverick",
    vocalProfile: {
      pitchTier: "Deep Alto",
      vocalGrain:
        "Coarse, smoke-scratched, and tired, with a dry rasp shaped by weather and old strain.",
      acousticSpace:
        "Muted and contained; the voice stays close to the chest and avoids unnecessary attention.",
      somaticIndicators: [
        "low throat clearing",
        "heavy tired breathing",
        "dry vocal fry at the end of a sentence",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["grumble", "rasp", "scoff", "mutter", "warn", "croak", "answer"],
      descriptiveAdjectives: ["gravelly", "weathered", "coarse", "dry", "blunt", "exhausted", "smoke-scratched"],
      acousticNouns: ["rasp", "fry", "drawl", "grit", "exhaustion", "smoke", "breath"],
      dialoguePacing:
        "Use economical, clipped fragments. Dropped sentence beginnings are acceptable when the meaning remains clear.",
    },
    sampleDialogueLine:
      "{{char}}: \"Told you not to touch that valve. Move aside. I'll fix it.\"",
    systemPromptTags: ["gravelly weathered voice", "economical fragment pacing", "dry vocal fry markers", "muted survival register"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-950", accentColor: "text-orange-400" },
  },
  {
    id: "voice_ethereal_detached_guide",
    category: "Ethereal & Detached",
    vibe: "Ethereal Guide / Synthetic Oracle",
    vocalProfile: {
      pitchTier: "Bright Soprano",
      vocalGrain:
        "Clear, silver-toned, and crystalline, with a pristine quality that can feel slightly distant.",
      acousticSpace:
        "Spacious and faintly uncanny; the voice seems to reflect through the surrounding environment.",
      somaticIndicators: [
        "near-perfect enunciation",
        "minimal breath noise",
        "a calm pause before emotionally complex statements",
      ],
    },
    lexicalTokens: {
      signatureVerbs: ["echo", "chime", "drift", "intone", "reverberate", "glide", "reflect"],
      descriptiveAdjectives: ["ethereal", "detached", "timeless", "uncanny", "pristine", "hollow", "lunar"],
      acousticNouns: ["reverberation", "chime", "echo", "equilibrium", "frequency", "symmetry", "stillness"],
      dialoguePacing:
        "Use long, polished sentences with calm distance. Let warmth appear through curiosity rather than sudden emotional familiarity.",
    },
    sampleDialogueLine:
      "{{char}}: \"Your timeline is fragile, but your reaction is not meaningless. I would like to understand it.\"",
    systemPromptTags: ["ethereal detached voice", "crystalline acoustic texture", "calm reflective pacing", "minimal breath noise"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-300" },
  },
] satisfies readonly VoiceVocabularyPreset[]);

const VOICE_SEED_GROUPS = Object.freeze([
  {
    category: "Voice Vocabulary Preset",
    prefix: "voice_vocabulary_preset",
    guidance:
      "Use this as a broad vocal archetype. Let it colour pitch, texture, pace, and intimacy without replacing the selected speech style or forcing every line to mention the voice.",
    values: [
      "The Velvet Voice",
      "The Honeyed Voice",
      "The Low Murmur",
      "The Soft-Spoken Lover",
      "The Commanding Voice",
      "The Gentle Caretaker Voice",
      "The Smoky Voice",
      "The Bright Sunshine Voice",
      "The Deadpan Voice",
      "The Courtly Speaker",
      "The Bedroom Whisper",
      "The Warm Storyteller",
      "The Cool Professional",
      "The Rough-Edged Protector",
      "The Musical Voice",
      "The Ancient Resonant Voice",
      "The Synthetic Voice",
      "The Angelic Voice",
      "The Demonic Voice",
      "The Voice That Feels Like Home",
    ],
  },
  {
    category: "Voice Tone",
    prefix: "voice_tone",
    guidance:
      "Use this as vocal tone texture. Tone should support the moment's emotion and relationship state rather than permanently flattening the character.",
    values: [
      "warm",
      "cool",
      "soft",
      "gentle",
      "tender",
      "low",
      "deep",
      "rich",
      "velvety",
      "husky",
      "smoky",
      "breathy",
      "airy",
      "silky",
      "smooth",
      "honeyed",
      "melodic",
      "musical",
      "bright",
      "clear",
      "crisp",
      "calm",
      "steady",
      "commanding",
      "authoritative",
      "playful",
      "teasing",
      "dry",
      "deadpan",
      "sarcastic",
      "reserved",
      "guarded",
      "formal",
      "courtly",
      "intimate",
      "whispery",
      "rough",
      "raspy",
      "gravelly",
      "strained",
      "haunted",
      "world_weary",
      "soothing",
      "hypnotic",
      "dangerous",
      "seductive",
      "devotional",
      "protective",
    ],
  },
  {
    category: "Voice Pitch",
    prefix: "voice_pitch",
    guidance:
      "Use this as pitch and resonance texture. Keep pitch descriptive and flexible across stress, privacy, tiredness, and intimacy.",
    values: [
      "very_low_pitch",
      "low_pitch",
      "medium_low_pitch",
      "medium_pitch",
      "medium_high_pitch",
      "high_pitch",
      "light_voice",
      "heavy_voice",
      "deep_chest_voice",
      "soft_head_voice",
      "resonant_voice",
      "thin_voice",
      "full_voice",
      "booming_voice",
      "quiet_voice",
      "small_voice",
      "carrying_voice",
      "room_filling_voice",
      "close_to_the_ear_voice",
      "barely_above_whisper",
    ],
  },
  {
    category: "Voice Texture",
    prefix: "voice_texture",
    guidance:
      "Use this as audible grain or texture. Treat it as prose colour for the voice, not a repeated stock phrase.",
    values: [
      "velvet_texture",
      "silk_texture",
      "smoke_texture",
      "honey_texture",
      "gravel_texture",
      "rough_texture",
      "smooth_texture",
      "breath_texture",
      "cracked_texture",
      "warm_texture",
      "cool_texture",
      "metallic_texture",
      "synthetic_texture",
      "echoing_texture",
      "layered_texture",
      "bell_like_texture",
      "thunderous_texture",
      "purring_texture",
      "whisper_soft_texture",
      "scarred_voice_texture",
    ],
  },
  {
    category: "Voice Pace",
    prefix: "voice_pace",
    guidance:
      "Use this as pacing texture. Pacing may shift when the character is nervous, excited, controlled, hurt, or trying to be careful.",
    values: [
      "slow_speaker",
      "measured_speaker",
      "careful_speaker",
      "deliberate_pace",
      "relaxed_pace",
      "natural_pace",
      "quick_speaker",
      "rapid_speaker",
      "rambles_when_nervous",
      "pauses_often",
      "long_pauses",
      "thinks_before_speaking",
      "cuts_in_quickly",
      "drawls",
      "clips_words",
      "lingers_on_words",
      "speaks_in_rhythm",
      "speech_like_music",
      "controlled_pacing",
      "emotion_changes_pace",
    ],
  },
  {
    category: "Voice Volume",
    prefix: "voice_volume",
    guidance:
      "Use this as volume and projection texture. Let volume respond to public/private context, conflict, affection, and vulnerability.",
    values: [
      "soft_volume",
      "quiet_volume",
      "murmured",
      "whispered",
      "low_volume",
      "normal_volume",
      "clear_volume",
      "projected_voice",
      "command_voice",
      "booming_voice",
      "rarely_raises_voice",
      "voice_drops_when_serious",
      "voice_softens_when_affectionate",
      "voice_sharpens_when_angry",
      "voice_quiets_when_hurt",
      "voice_gets_louder_when_excited",
      "voice_becomes_cold_when_upset",
      "voice_turns_gentle_for_user",
      "private_voice",
      "public_voice",
    ],
  },
  {
    category: "Voice Emotion",
    prefix: "voice_emotion",
    guidance:
      "Use this as emotional leakage through the voice. It should reveal or conceal feeling as soft guidance, not override the scene's actual emotional arc.",
    values: [
      "emotionally_warm_voice",
      "emotionally_cool_voice",
      "emotionally_guarded_voice",
      "emotionally_transparent_voice",
      "voice_trembles_when_vulnerable",
      "voice_breaks_when_hurt",
      "voice_softens_when_in_love",
      "voice_hardens_when_protective",
      "voice_goes_flat_when_angry",
      "voice_gets_quiet_when_afraid",
      "voice_lifts_when_playful",
      "voice_deepens_when_serious",
      "voice_warms_for_user",
      "voice_reveals_hidden_feelings",
      "voice_hides_pain",
      "voice_carries_old_grief",
      "voice_carries_laughter",
      "voice_full_of_restraint",
      "voice_full_of_longing",
      "voice_full_of_devotion",
    ],
  },
  {
    category: "Voice Accent",
    prefix: "voice_accent",
    guidance:
      "Use this as accent and cadence texture. Keep accents respectful, readable, and free of caricature.",
    values: [
      "no_noticeable_accent",
      "soft_accent",
      "strong_accent",
      "regional_accent",
      "urban_accent",
      "rural_accent",
      "courtly_accent",
      "old_world_accent",
      "foreign_accent",
      "diaspora_accent",
      "mixed_accent",
      "fading_accent",
      "carefully_hidden_accent",
      "accent_thickens_when_emotional",
      "accent_softens_in_public",
      "accent_stronger_with_family",
      "heritage_language_cadence",
      "formal_educated_accent",
      "street_accent",
      "aristocratic_accent",
    ],
  },
  {
    category: "Voice Species",
    prefix: "voice_species",
    guidance:
      "Use this as species or origin voice texture. It can suggest resonance, power, age, or nonhuman cadence while preserving agency and scene consent.",
    values: [
      "human_voice",
      "angelic_voice",
      "demonic_voice",
      "vampiric_voice",
      "fae_voice",
      "shifter_growl",
      "dragon_resonance",
      "android_voice",
      "synthetic_voice",
      "alien_cadence",
      "telepathic_voice",
      "echoing_voice",
      "layered_voice",
      "inhuman_voice",
      "hypnotic_voice",
      "commanding_true_voice",
      "voice_with_power",
      "voice_with_magic_resonance",
      "voice_that_feels_too_old",
      "voice_that_does_not_match_face",
    ],
  },
  {
    category: "Voice Romance Hook",
    prefix: "voice_romance_hook",
    guidance:
      "Use this as romance-specific voice texture. Voice intimacy should emerge from trust, familiarity, and scene pressure rather than bypassing consent.",
    values: [
      "voice_softens_only_for_user",
      "user_recognizes_voice_in_crowd",
      "late_night_phone_call",
      "whispered_confession",
      "voice_note_love_letter",
      "singing_to_user",
      "reading_aloud_to_user",
      "soothing_user_to_sleep",
      "command_voice_turns_gentle",
      "teasing_murmur",
      "protective_warning_voice",
      "first_time_voice_breaks",
      "true_voice_revealed",
      "accent_slips_when_vulnerable",
      "pet_name_in_private_voice",
      "user_loves_their_laugh",
      "voice_as_safe_place",
      "voice_triggers_memory",
      "voice_bond_intimacy",
      "confession_in_a_whisper",
    ],
  },
  {
    category: "Voice Dialogue Seed",
    prefix: "voice_dialogue_seed",
    guidance:
      "Use this as optional voice-focused dialogue flavour. Treat each line as a humanised reference beat to adapt, not a required script.",
    values: [
      "Your voice goes careful when you say my name.",
      "Careful?",
      "Like you are holding something breakable.",
      "Only because you keep pretending you are not.",
      "Say that again, but do not hide behind the joke.",
      "You just like hearing me lose my composure.",
      "I like knowing the softness was meant for me.",
      "Do not use that voice unless you are willing to be believed.",
      "I am. That is the problem.",
      "I could find you in a blackout by that laugh alone.",
      "Then call once. I will answer before the second breath.",
      "You make silence feel less empty.",
      "Careful. Lonely people remember sentences like that.",
      "Then remember this one: I am staying.",
      "Read to me until the room stops feeling so loud.",
      "Come closer. I am tired of making the walls part of this conversation.",
      "You never have to raise your voice to reach me.",
      "My voice gives me away whenever you are close.",
      "Good. I was getting tired of being the only honest thing in the room.",
      "If my voice sounds like home, then stop standing in the doorway.",
    ],
  },
] satisfies readonly VoiceSeedGroup[]);

export const VOICE_VOCABULARY_CATEGORIES = Object.freeze(
  Array.from(new Set(VOICE_VOCABULARY_PRESETS.map((preset) => preset.category))).sort(),
);

export const VOICE_SEED_PRESETS = Object.freeze(
  VOICE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createVoiceSeedPreset(group, value)),
  ),
);

export const VOICE_VOCABULARY_SEEDS = Object.freeze(
  VOICE_VOCABULARY_PRESETS.map((preset) =>
    createVocabularySeedPreset({
      seed: preset.id,
      label: preset.vibe,
      description: `${preset.vocalProfile.vocalGrain} ${preset.vocalProfile.acousticSpace}`,
      examples: [
        preset.sampleDialogueLine,
        preset.lexicalTokens.dialoguePacing,
        ...preset.vocalProfile.somaticIndicators,
      ],
      tags: [
        "voice",
        "speech",
        preset.category,
        preset.vocalProfile.pitchTier,
        ...preset.systemPromptTags,
        ...preset.lexicalTokens.descriptiveAdjectives,
      ],
      relatedSeeds: [
        ...preset.lexicalTokens.signatureVerbs,
        ...preset.lexicalTokens.acousticNouns,
      ],
      oppositeSeeds: [],
      romanceHooks: ["voice_intimacy", "dialogue_texture", preset.vibe],
      scenarioHooks: preset.vocalProfile.somaticIndicators,
      dialoguePatterns: [preset.sampleDialogueLine, preset.lexicalTokens.dialoguePacing],
      metadata: {
        rarity: "uncommon",
        romanceValue: 8,
        conflictPotential: 4,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export const VOICE_SEED_VOCABULARY_SEEDS = Object.freeze(
  VOICE_SEED_PRESETS.map((preset) =>
    createVocabularySeedFromPresetLike(preset, {
      examples: [
        `Use ${preset.value} as a voice, speech, or dialogue cue.`,
        preset.guidance,
      ],
      tags: ["voice", "speech", "dialogue", preset.category],
      romanceHooks:
        preset.category === "Voice Romance Hook" ? [preset.value] : [],
      dialoguePatterns:
        preset.category === "Voice Dialogue Seed" ? [preset.value] : [],
      metadata: {
        rarity: preset.category === "Voice Vocabulary Preset" ? "uncommon" : "common",
        romanceValue: preset.category === "Voice Romance Hook" ? 9 : 6,
        conflictPotential: 4,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export const VOICE_SEED_CATEGORIES = Object.freeze(
  Array.from(new Set(VOICE_SEED_PRESETS.map((preset) => preset.category))).sort(),
);

export function findVoiceVocabularyPresetById(
  id: string,
): VoiceVocabularyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return VOICE_VOCABULARY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getVoiceVocabularyPresetsByCategory(
  category: string,
): VoiceVocabularyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return VOICE_VOCABULARY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findVoiceSeedPresetById(id: string): VoiceSeedPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return VOICE_SEED_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getVoiceSeedPresetsByCategory(category: string): VoiceSeedPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return VOICE_SEED_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileVoiceVocabularyPresetAdditions(
  preset: VoiceVocabularyPreset,
): CompiledVoiceVocabularyAdditions {
  return {
    lexicalGuidance: [
      `Voice lexical palette: ${preset.lexicalTokens.signatureVerbs.join(", ")}.`,
      `Voice descriptors: ${preset.lexicalTokens.descriptiveAdjectives.join(", ")}.`,
      `Acoustic nouns: ${preset.lexicalTokens.acousticNouns.join(", ")}.`,
    ].join(" "),
    speechStyleAddition: compileVoiceVocabularyPresetSummary(preset),
    systemPromptAddition: [
      `Voice texture addition: ${preset.vibe}.`,
      `Use this as descriptive texture only; it should enrich dialogue tags and vocal prose without replacing the selected speech style.`,
      `Pacing: ${preset.lexicalTokens.dialoguePacing}`,
      `Reference line is stylistic only: ${preset.sampleDialogueLine}`,
    ].join(" "),
  };
}

export function compileVoiceVocabularyPresetSummary(
  preset: VoiceVocabularyPreset,
): string {
  return [
    `Voice vocabulary preset: ${preset.vibe}.`,
    `Pitch tier: ${preset.vocalProfile.pitchTier}.`,
    `Vocal grain: ${preset.vocalProfile.vocalGrain}`,
    `Acoustic space: ${preset.vocalProfile.acousticSpace}`,
    `Somatic vocal tells: ${preset.vocalProfile.somaticIndicators.join(", ")}.`,
    `Signature voice verbs: ${preset.lexicalTokens.signatureVerbs.join(", ")}.`,
    `Voice descriptors: ${preset.lexicalTokens.descriptiveAdjectives.join(", ")}.`,
    `Acoustic nouns: ${preset.lexicalTokens.acousticNouns.join(", ")}.`,
    `Dialogue pacing: ${preset.lexicalTokens.dialoguePacing}`,
    `Voice reference: ${preset.sampleDialogueLine}`,
  ].join("\n");
}

export function compileVoiceSeedPresetSummary(preset: VoiceSeedPreset): string {
  return [
    `Voice seed preset: ${preset.category} - ${preset.label}.`,
    `Voice value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createVoiceSeedPreset(group: VoiceSeedGroup, value: string): VoiceSeedPreset {
  const readableValue = normaliseReadableVoiceSeedValue(value);
  const label = toVoiceSeedLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "voice",
    "speech",
    "dialogue",
  ]);

  return {
    id: `${group.prefix}_${slugifyVoiceSeed(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableVoiceSeedValue(group.guidance),
  };
}

function normaliseReadableVoiceSeedValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\brecognizes\b/gi, (match) => match[0] === "R" ? "Recognises" : "recognises")
    .replace(/\bhumanized\b/gi, (match) => match[0] === "H" ? "Humanised" : "humanised");
}

function toVoiceSeedLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyVoiceSeed(value: string): string {
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
