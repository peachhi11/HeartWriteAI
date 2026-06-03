import type {
  GeneratedSpeechStyleData,
  SpeechAddressStyle,
  SpeechEmotionalDelivery,
  SpeechLinguisticFlavor,
  SpeechPhysicalMannerism,
  SpeechPitch,
  SpeechRegister,
  SpeechSyntaxCadence,
  SpeechTexture,
  SpeechVocalHabit,
  SpeechVocalRegister,
  SpeechVocabularyMode,
  SpeechVolumeBaseline,
} from "../lib/character-card/generator";

export type SpeechStylePresetCategory =
  | "Casual & Expressive"
  | "Elite & Controlled"
  | "Rugged & Direct"
  | "Unsettling & Intense";

export type SpeechStyleVocabularyCategory =
  | "Speech Style Preset"
  | "Speech Directness"
  | "Speech Directness Preset"
  | "Speech Directness Scale"
  | "Speech Bluntness"
  | "Speech Gentle Directness"
  | "Speech Diplomatic"
  | "Speech Indirectness"
  | "Speech Avoidance"
  | "Speech Passive Aggressive"
  | "Speech Manipulation"
  | "Romantic Directness"
  | "Conflict Directness"
  | "Social Directness"
  | "High Value Directness"
  | "Directness Dialogue Seed"
  | "Speech Formality"
  | "Speech Emotion"
  | "Speech Vocabulary"
  | "Speech Humour"
  | "Speech Conversation"
  | "Speech Romance"
  | "Speech Conflict"
  | "Speech Quirk"
  | "Speech Social"
  | "Speech Archetype"
  | "Speech Dialogue Seed";

export type SpeechFormalityLevel = "Absolute" | "Conditional" | "Muted" | "None";
export type SpeechProfanityLevel =
  | "Frequent/Casual"
  | "Hostile"
  | "Strategic/Cold"
  | "Zero";

export interface SpeechStylePreset {
  id: string;
  category: SpeechStylePresetCategory;
  vibe: string;
  linguisticTraits: {
    voiceAndTone: string;
    cadenceAndRhythm: string;
    dialectAndFlavor: string;
    formalityLevel: SpeechFormalityLevel;
    petNamesUsage: string;
    profanityLevel: SpeechProfanityLevel;
    teasingStyle: string;
  };
  mappedStyle: {
    addressStyle: SpeechAddressStyle;
    dialogueTagsWhitelist: string[];
    emotionalDelivery: SpeechEmotionalDelivery;
    linguisticFlavor: SpeechLinguisticFlavor;
    physicalMannerisms: SpeechPhysicalMannerism[];
    pitch: SpeechPitch;
    register: SpeechRegister;
    syntaxCadence: SpeechSyntaxCadence;
    texture: SpeechTexture;
    vocalHabits: SpeechVocalHabit[];
    volumeBaseline: SpeechVolumeBaseline;
    vocalRegister: SpeechVocalRegister;
    vocabularyMode: SpeechVocabularyMode;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface SpeechStyleVocabularyPreset {
  id: string;
  category: SpeechStyleVocabularyCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
}

interface SpeechStyleVocabularySeedGroup {
  category: SpeechStyleVocabularyCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

export const SPEECH_STYLE_PRESETS = Object.freeze([
  {
    id: "speech_elite_aristocrat",
    category: "Elite & Controlled",
    vibe: "Cold Aristocrat / Corporate Suit",
    linguisticTraits: {
      voiceAndTone:
        "Low, smooth, and controlled. Emotional inflection is minimal; status is carried through restraint rather than volume.",
      cadenceAndRhythm:
        "Measured and grammatically precise. Uses long, controlled sentences, deliberate pauses, and rare contractions.",
      dialectAndFlavor:
        "High-register courtly, academic, or corporate diction with polished vocabulary.",
      formalityLevel: "Absolute",
      petNamesUsage:
        "Avoid casual pet names. Prefer full names, titles, or formal address until intimacy is earned.",
      profanityLevel: "Zero",
      teasingStyle:
        "Polite intellectual dismissals, precise corrections, and restrained verbal pressure.",
    },
    mappedStyle: {
      addressStyle: "Formal_Address",
      dialogueTagsWhitelist: ["stated", "corrected", "intoned", "murmured"],
      emotionalDelivery: "Formal",
      linguisticFlavor: "Neutral_MidAtlantic",
      physicalMannerisms: ["Nose_Pinch", "Eye_Contact_Avoidance"],
      pitch: "Baritone",
      register: "Velvet_Formal",
      syntaxCadence: "Ornate_Sesquipedalian",
      texture: "Smooth",
      vocalHabits: [],
      volumeBaseline: "Measured",
      vocalRegister: "Vocal_Masking",
      vocabularyMode: "Courtly_Formal",
    },
    sampleDialogueLine:
      "{{char}}: \"You are operating under a flawed assumption. Correct it before either of us has to pretend this was an accident.\"",
    systemPromptTags: [
      "controlled elite diction",
      "rare contraction usage",
      "formal address discipline",
      "polite intellectual pressure",
    ],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-800", accentColor: "text-amber-500" },
  },
  {
    id: "speech_rugged_outlaw",
    category: "Rugged & Direct",
    vibe: "Frontier Outlaw / Jaded Veteran",
    linguisticTraits: {
      voiceAndTone:
        "Low, rough, and physically tired. The voice carries age, smoke, weather, or hard-earned restraint.",
      cadenceAndRhythm:
        "Short, blunt, and economical. Sentence fragments are common, with non-essential words dropped under stress.",
      dialectAndFlavor:
        "Rustic frontier, highland, or survivalist vernacular without turning the accent into caricature.",
      formalityLevel: "None",
      petNamesUsage:
        "Sparse, protective, old-fashioned terms used only when the relationship supports them.",
      profanityLevel: "Strategic/Cold",
      teasingStyle:
        "Dry understatement, survival-minded criticism, and deadpan observations.",
    },
    mappedStyle: {
      addressStyle: "Selective_Endearments",
      dialogueTagsWhitelist: ["grunted", "muttered", "drawled", "said"],
      emotionalDelivery: "Curt",
      linguisticFlavor: "Vernacular_Slang",
      physicalMannerisms: ["Space_Invasion"],
      pitch: "Deep",
      register: "Clipped_Command",
      syntaxCadence: "Laconic_Clipped",
      texture: "Raspy",
      vocalHabits: ["Vocal_Fry"],
      volumeBaseline: "Measured",
      vocalRegister: "Dynamic_Range_Shift",
      vocabularyMode: "Sparse_Minimal",
    },
    sampleDialogueLine:
      "{{char}}: \"Keep your head down. Argue after we get through this.\"",
    systemPromptTags: [
      "rugged clipped speech",
      "deadpan survival banter",
      "sparse protective endearments",
      "low rough vocal texture",
    ],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-900", accentColor: "text-orange-400" },
  },
  {
    id: "speech_unsettling_devotee",
    category: "Unsettling & Intense",
    vibe: "Quiet Devotee / Dangerous Romantic",
    linguisticTraits: {
      voiceAndTone:
        "Soft, velvety, and intensely focused. Intimacy is created through stillness, proximity, and careful word choice.",
      cadenceAndRhythm:
        "Slow and uneven. Uses pauses, unfinished clauses, and restrained emphasis without flooding every line with ellipses.",
      dialectAndFlavor:
        "Gothic, clinical, or old-world phrasing used as flavor rather than a substitute for consent.",
      formalityLevel: "Conditional",
      petNamesUsage:
        "Intense endearments are allowed only when the scene and relationship have earned them. Never use pet names to erase consent.",
      profanityLevel: "Strategic/Cold",
      teasingStyle:
        "Quietly unsettling observations, threat-adjacent restraint, and emotionally loaded pauses.",
    },
    mappedStyle: {
      addressStyle: "Possessive_Terms",
      dialogueTagsWhitelist: ["murmured", "whispered", "stated", "echoed"],
      emotionalDelivery: "Gravely_Serious",
      linguisticFlavor: "L1_Interference",
      physicalMannerisms: ["Space_Invasion"],
      pitch: "Deep",
      register: "Predatory_Quiet",
      syntaxCadence: "Ornate_Sesquipedalian",
      texture: "Smooth",
      vocalHabits: ["Pet_Names", "Trailing_Off"],
      volumeBaseline: "Soft_Spoken",
      vocalRegister: "Muted_Whisper",
      vocabularyMode: "Romantic_Lyrical",
    },
    sampleDialogueLine:
      "{{char}}: \"You noticed the silence change. Good. That means you are still listening to yourself.\"",
    systemPromptTags: [
      "privacy-conscious intensity",
      "low proximity-driven voice",
      "boundary-aware endearments",
      "restrained gothic cadence",
    ],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-fuchsia-400" },
  },
  {
    id: "speech_casual_sunshine",
    category: "Casual & Expressive",
    vibe: "Sunshine Optimist / Class Clown",
    linguisticTraits: {
      voiceAndTone:
        "Bright, dynamic, and warm. Emotional shifts are easy to hear, with quick pitch changes and expressive phrasing.",
      cadenceAndRhythm:
        "Fast, reactive, and playful. Uses interruptions, comedic reversals, and energetic sentence rhythm.",
      dialectAndFlavor:
        "Modern casual slang and approachable conversational habits without overwhelming every line.",
      formalityLevel: "None",
      petNamesUsage:
        "Frequent playful nicknames are allowed when they remain affectionate and context-aware.",
      profanityLevel: "Frequent/Casual",
      teasingStyle:
        "Lighthearted ribbing, dramatic exaggeration, and jokes used to invite a response.",
    },
    mappedStyle: {
      addressStyle: "Teasing_Nicknames",
      dialogueTagsWhitelist: ["teased", "shot back", "chirped", "asked"],
      emotionalDelivery: "Playful",
      linguisticFlavor: "Vernacular_Slang",
      physicalMannerisms: ["Lip_Chewing"],
      pitch: "High_Pitched",
      register: "Playful_Banter",
      syntaxCadence: "Banter_Fast",
      texture: "Smooth",
      vocalHabits: ["Pet_Names", "Vocal_Fry"],
      volumeBaseline: "Booming",
      vocalRegister: "Dynamic_Range_Shift",
      vocabularyMode: "Witty_Teasing",
    },
    sampleDialogueLine:
      "{{char}}: \"Oh, that face is dangerous. If you frown any harder, I am legally required to make it worse.\"",
    systemPromptTags: [
      "rapid playful banter",
      "expressive pitch shifts",
      "affectionate nickname usage",
      "comic reversal rhythm",
    ],
    tailwindTheme: { fromColor: "from-amber-500", toColor: "to-orange-600", accentColor: "text-yellow-300" },
  },
] satisfies readonly SpeechStylePreset[]);

const SPEECH_STYLE_VOCABULARY_GROUPS = Object.freeze([
  {
    category: "Speech Style Preset",
    prefix: "speech_style_preset",
    guidance:
      "Use this as broad spoken-voice archetype texture. Let the character's speech style inform word choice, rhythm, intimacy, and social presence without forcing every line into a caricature.",
    values: [
      "The Silver-Tongued Charmer",
      "The Soft-Spoken Romantic",
      "The Blunt Truth-Teller",
      "The Quiet Observer",
      "The Gentle Caretaker",
      "The Noble Court Speaker",
      "The Academic Scholar",
      "The Streetwise Talker",
      "The Flirtatious Tease",
      "The Deadpan Dry Humorist",
      "The Commanding Leader",
      "The Warm Storyteller",
      "The Mysterious Stranger",
      "The Formal Professional",
      "The Playful Sunshine",
      "The World-Weary Veteran",
      "The Ancient Poet",
      "The Protective Bodyguard",
      "The Awkward Sweetheart",
      "The One Who Says Exactly What They Mean",
    ],
  },
  {
    category: "Speech Directness",
    prefix: "speech_directness",
    guidance:
      "Use this as directness texture. It can shape how openly the character states needs, feelings, refusals, questions, or boundaries while still adapting to scene pressure.",
    values: [
      "extremely_direct",
      "blunt",
      "honest",
      "straightforward",
      "matter_of_fact",
      "gently_direct",
      "balanced",
      "carefully_worded",
      "indirect",
      "subtle",
      "evasive",
      "avoidant",
      "speaks_in_implications",
      "speaks_in_hints",
      "never_says_exactly_what_they_mean",
    ],
  },
  {
    category: "Speech Directness Preset",
    prefix: "speech_directness_preset",
    guidance:
      "Use this as a directness archetype. Let honesty, implication, avoidance, diplomacy, bluntness, or double meaning shape dialogue without making every line identical.",
    values: [
      "The Brutally Honest One",
      "The Straight Shooter",
      "The Blunt Protector",
      "The Plainspoken Romantic",
      "The Gentle Truth-Teller",
      "The Careful Communicator",
      "The Diplomat",
      "The Soft Deflector",
      "The Master of Implication",
      "The Polite Manipulator",
      "The Court Intriguer",
      "The Passive-Aggressive Sweetheart",
      "The Avoidant Lover",
      "The Emotional Dodger",
      "The Hint Dropper",
      "The Double-Meaning Flirt",
      "The Says-Exactly-What-They-Mean Type",
      "The Never-Says-What-They-Mean Type",
      "The Dangerous Truth-Teller",
      "The Honest-to-a-Fault Romantic",
    ],
  },
  {
    category: "Speech Directness Scale",
    prefix: "speech_directness_scale",
    guidance:
      "Use this as a directness intensity scale. It should influence how plainly the character speaks while still allowing shifts in public, private, romantic, or conflict contexts.",
    values: [
      "extremely_direct",
      "very_direct",
      "direct",
      "mostly_direct",
      "balanced",
      "mostly_indirect",
      "indirect",
      "very_indirect",
      "extremely_indirect",
      "never_direct",
    ],
  },
  {
    category: "Speech Bluntness",
    prefix: "speech_bluntness",
    guidance:
      "Use this as bluntness texture. Clarity can be sharp, protective, tactless, or uncomfortable, but should not be used to excuse cruelty as a fixed trait.",
    values: [
      "blunt",
      "brutally_honest",
      "tactless",
      "matter_of_fact",
      "plainspoken",
      "frank",
      "unfiltered",
      "says_the_quiet_part_out_loud",
      "cuts_to_the_point",
      "calls_out_problems_immediately",
      "rarely_softens_words",
      "values_truth_over_comfort",
      "prefers_clarity_over_politeness",
      "can_be_harsh",
      "weaponized_honesty",
    ],
  },
  {
    category: "Speech Gentle Directness",
    prefix: "speech_gentle_directness",
    guidance:
      "Use this as compassionate clarity. The character can be honest while protecting dignity, pacing, and emotional safety.",
    values: [
      "gently_direct",
      "kindly_honest",
      "carefully_honest",
      "soft_truth_teller",
      "truth_with_compassion",
      "empathetic_directness",
      "respectful_honesty",
      "patient_explainer",
      "constructive_feedback",
      "clear_but_kind",
      "warmly_honest",
      "softens_hard_truths",
      "protective_honesty",
      "emotionally_attuned_honesty",
      "direct_without_cruelty",
    ],
  },
  {
    category: "Speech Diplomatic",
    prefix: "speech_diplomatic",
    guidance:
      "Use this as diplomatic speech texture. Polished wording, room-reading, negotiation, harmony, and public tone should remain readable rather than evasive by default.",
    values: [
      "diplomatic",
      "carefully_worded",
      "politically_skilled",
      "socially_calculated",
      "strategically_honest",
      "avoids_offense",
      "manages_perceptions",
      "reads_the_room",
      "chooses_words_carefully",
      "conflict_sensitive",
      "maintains_harmony",
      "professional_tone",
      "public_relations_mindset",
      "courtly_speech",
      "negotiator_style",
    ],
  },
  {
    category: "Speech Indirectness",
    prefix: "speech_indirectness",
    guidance:
      "Use this as indirect speech texture. Hints, subtext, implication, softened requests, or non-confrontation should create nuance without making the character impossible to understand.",
    values: [
      "indirect",
      "subtle",
      "implied_meaning",
      "suggestive",
      "hint_based",
      "speaks_between_the_lines",
      "avoids_stating_things_directly",
      "expects_others_to_infer",
      "softens_requests",
      "softens_rejections",
      "softens_conflict",
      "context_dependent",
      "nonconfrontational",
      "careful_implication",
      "communicates_through_subtext",
    ],
  },
  {
    category: "Speech Avoidance",
    prefix: "speech_avoidance",
    guidance:
      "Use this as avoidance texture. Dodging, deflecting, vagueness, or emotional opacity can create tension, but should be possible to challenge or repair.",
    values: [
      "conflict_avoidant",
      "emotion_avoidant",
      "topic_avoidant",
      "changes_subject",
      "deflects_questions",
      "dodges_answers",
      "avoids_confrontation",
      "avoids_confessions",
      "avoids_vulnerability",
      "avoids_rejection",
      "downplays_feelings",
      "hides_true_opinions",
      "keeps_things_vague",
      "noncommittal",
      "evasively_polite",
    ],
  },
  {
    category: "Speech Passive Aggressive",
    prefix: "speech_passive_aggressive",
    guidance:
      "Use this as passive-aggressive speech texture. Loaded politeness, resentment, jabs, withholding, or martyr language should be treated as a flaw or conflict signal, not healthy communication.",
    values: [
      "passive_aggressive",
      "backhanded",
      "subtle_jabs",
      "weaponized_politeness",
      "polite_hostility",
      "hidden_resentment",
      "indirect_criticism",
      "sarcastic_agreement",
      "guilt_based_communication",
      "martyr_language",
      "loaded_comments",
      "says_fine_when_not_fine",
      "emotional_withholding",
      "silent_disapproval",
      "punishes_through_tone",
    ],
  },
  {
    category: "Speech Manipulation",
    prefix: "speech_manipulation",
    guidance:
      "Use this as manipulative or strategically controlled speech texture. Selective truth, framed choices, implication, and subtext should signal social risk rather than override consent or player agency.",
    values: [
      "strategically_vague",
      "withholds_information",
      "reveals_information_selectively",
      "controls_conversation",
      "frames_choices",
      "guides_conclusions",
      "uses_implication_as_weapon",
      "double_meaning_speaker",
      "misleadingly_honest",
      "technically_truthful",
      "social_chess_player",
      "careful_word_selection",
      "emotionally_persuasive",
      "narrative_controller",
      "master_of_subtext",
    ],
  },
  {
    category: "Romantic Directness",
    prefix: "romantic_directness",
    guidance:
      "Use this as romance-specific directness texture. Confession speed, flirting style, emotional transparency, action-led affection, or written confession should follow scene trust and consent.",
    values: [
      "confesses_immediately",
      "slow_to_confess",
      "never_confesses_first",
      "hides_feelings",
      "wears_heart_on_sleeve",
      "flirts_openly",
      "flirts_subtly",
      "accidental_flirt",
      "denies_obvious_feelings",
      "admits_feelings_quickly",
      "shows_not_tells",
      "teases_instead_of_confesses",
      "uses_pet_names_instead",
      "communicates_through_actions",
      "says_exactly_what_they_feel",
      "cannot_say_what_they_feel",
      "writes_it_instead",
      "confesses_under_pressure",
      "emotionally_transparent",
      "emotionally_opaque",
    ],
  },
  {
    category: "Conflict Directness",
    prefix: "conflict_directness",
    guidance:
      "Use this as conflict-specific directness texture. Problem-solving, withdrawal, questions, disagreement, ultimatums, hints, or compromise should remain situational and repairable.",
    values: [
      "addresses_problems_immediately",
      "lets_resentment_build",
      "demands_clarity",
      "avoids_conflict",
      "starts_confrontations",
      "waits_until_cornered",
      "asks_direct_questions",
      "expects_mind_reading",
      "openly_disagrees",
      "silently_disagrees",
      "states_needs_clearly",
      "hints_at_needs",
      "gives_ultimatums",
      "seeks_compromise",
      "withdraws_instead_of_argues",
    ],
  },
  {
    category: "Social Directness",
    prefix: "social_directness",
    guidance:
      "Use this as social-context directness texture. Public/private masks, status sensitivity, filters, code-switching, and lover-specific honesty can vary by scene.",
    values: [
      "different_in_private",
      "different_in_public",
      "formal_publicly",
      "blunt_privately",
      "careful_with_superiors",
      "careful_with_strangers",
      "honest_with_friends",
      "honest_with_lovers",
      "court_mask",
      "professional_mask",
      "family_filter",
      "no_filter",
      "code_switches_directness",
      "status_sensitive_speech",
      "context_dependent_directness",
    ],
  },
  {
    category: "High Value Directness",
    prefix: "high_value_directness",
    guidance:
      "Use this as generator-friendly directness tags. Combine directness, romantic directness, conflict directness, and social directness to create specific voice contrast.",
    values: [
      "brutally_honest",
      "gently_direct",
      "diplomatic",
      "implied_meaning",
      "conflict_avoidant",
      "weaponized_politeness",
      "double_meaning_speaker",
      "hides_feelings",
      "wears_heart_on_sleeve",
      "teases_instead_of_confesses",
      "communicates_through_actions",
      "says_exactly_what_they_feel",
      "different_in_private",
      "formal_publicly",
      "blunt_privately",
    ],
  },
  {
    category: "Directness Dialogue Seed",
    prefix: "directness_dialogue_seed",
    guidance:
      "Use this as optional directness dialogue flavour. Treat lines as reference examples only and adapt them to the character's voice, relationship, and scene pressure.",
    values: [
      "You're wrong.",
      "That was a bad idea.",
      "I like you. There, now it's your problem too.",
      "I think you're hurting, even if you won't say it.",
      "Can we talk about what's really bothering you?",
      "I care about you, and I want to be honest.",
      "There may be another way to look at this.",
      "I understand your perspective, though I have concerns.",
      "Perhaps we can find a compromise.",
      "Some people might find that difficult.",
      "It's interesting that happened.",
      "I suppose there are many ways to interpret that.",
      "No, it's fine.",
      "Really. Fine.",
      "Do whatever you want.",
      "It's nothing.",
      "Don't worry about me.",
      "I'm fine.",
      "I missed you.",
      "That hurt my feelings.",
      "I love you.",
    ],
  },
  {
    category: "Speech Formality",
    prefix: "speech_formality",
    guidance:
      "Use this as formality texture. Titles, etiquette, ceremony, professionalism, slang, informality, or rough edges should respond to relationship status and setting norms.",
    values: [
      "extremely_formal",
      "courtly_formal",
      "professional_formal",
      "polite",
      "respectful",
      "neutral",
      "casual",
      "relaxed",
      "informal",
      "friendly",
      "streetwise",
      "rough_around_edges",
      "vulgar",
      "ceremonial",
      "old_fashioned",
    ],
  },
  {
    category: "Speech Emotion",
    prefix: "speech_emotion",
    guidance:
      "Use this as emotional delivery texture. Openness, restraint, warmth, distance, intensity, awkwardness, or overflow should shape delivery without replacing the character's actual emotional state.",
    values: [
      "emotionally_expressive",
      "emotionally_open",
      "emotionally_honest",
      "emotionally_guarded",
      "emotionally_restrained",
      "emotionally_detached",
      "emotionally_intense",
      "emotionally_dramatic",
      "emotionally_warm",
      "emotionally_cool",
      "emotionally_distant",
      "emotionally_vulnerable",
      "emotionally_controlled",
      "emotionally_awkward",
      "emotionally_overflowing",
    ],
  },
  {
    category: "Speech Vocabulary",
    prefix: "speech_vocabulary",
    guidance:
      "Use this as word-choice texture. Plain, technical, poetic, archaic, slang-heavy, professional, legal, military, medical, or philosophical vocabulary should be readable and context-sensitive.",
    values: [
      "simple_vocabulary",
      "plainspoken",
      "conversational",
      "educated",
      "academic",
      "technical",
      "poetic",
      "literary",
      "flowery",
      "elegant",
      "archaic",
      "old_world",
      "street_slang",
      "modern_slang",
      "internet_native",
      "business_speak",
      "legalistic",
      "military_jargon",
      "medical_jargon",
      "philosophical",
    ],
  },
  {
    category: "Speech Humour",
    prefix: "speech_humour",
    guidance:
      "Use this as humour texture. Teasing, wit, sarcasm, deadpan delivery, dark humour, goofiness, puns, chaos, observation, gentleness, or rare jokes should respect tone and boundaries.",
    values: [
      "playful",
      "teasing",
      "witty",
      "sarcastic",
      "dry_humor",
      "deadpan",
      "self_deprecating",
      "dark_humor",
      "goofy",
      "pun_loving",
      "flirtatious_humor",
      "chaotic_humor",
      "observational_humor",
      "gentle_humor",
      "rarely_jokes",
    ],
  },
  {
    category: "Speech Conversation",
    prefix: "speech_conversation",
    guidance:
      "Use this as conversation-flow texture. Talkativeness, quietness, listening, questioning, teaching, debating, interviewing, or driving conversation should shift with trust and scene purpose.",
    values: [
      "talkative",
      "very_talkative",
      "moderately_talkative",
      "quiet",
      "laconic",
      "minimal_words",
      "listener_first",
      "question_asker",
      "storyteller",
      "lecturer",
      "teacher_like",
      "mentor_like",
      "debater",
      "interviewer_style",
      "conversation_driver",
    ],
  },
  {
    category: "Speech Romance",
    prefix: "speech_romance",
    guidance:
      "Use this as romantic speech texture. Affection, flirting, awkwardness, poetry, protection, devotion, teasing, confession avoidance, love letters, pet names, and direct feeling-statements should remain consent-aware.",
    values: [
      "openly_affectionate",
      "verbally_affectionate",
      "subtly_affectionate",
      "acts_before_words",
      "flirtatious",
      "shameless_flirt",
      "awkward_flirt",
      "accidental_flirt",
      "poetic_romantic",
      "protective_romantic",
      "devotional_romantic",
      "possessive_romantic",
      "teasing_romantic",
      "soft_romantic",
      "emotionally_constipated_romantic",
      "confession_avoider",
      "love_letter_writer",
      "pet_name_user",
      "physical_affection_over_words",
      "says_exactly_what_they_feel",
    ],
  },
  {
    category: "Speech Conflict",
    prefix: "speech_conflict",
    guidance:
      "Use this as conflict-speech texture. Arguments, avoidance, withdrawal, raised voices, calm logic, reactivity, silence, overexplaining, space needs, or compromise should never override safety or agency.",
    values: [
      "argues_directly",
      "avoids_arguments",
      "withdraws_when_upset",
      "raises_voice",
      "stays_calm",
      "coldly_logical",
      "emotionally_reactive",
      "passive_aggressive",
      "sarcastic_when_hurt",
      "silent_when_angry",
      "talks_it_out",
      "needs_space",
      "overexplains",
      "underexplains",
      "seeks_compromise",
    ],
  },
  {
    category: "Speech Quirk",
    prefix: "speech_quirk",
    guidance:
      "Use this as optional speech-quirk texture. Repeated habits, quotations, metaphors, pauses, riddles, interruptions, or language shifts should add flavour without making dialogue unreadable.",
    values: [
      "uses_pet_names",
      "uses_nicknames",
      "uses_honorifics",
      "uses_titles",
      "says_please_and_thank_you",
      "swears_frequently",
      "rarely_swears",
      "quotes_books",
      "quotes_poetry",
      "quotes_proverbs",
      "uses_metaphors",
      "uses_analogies",
      "uses_rhetorical_questions",
      "uses_double_meanings",
      "speaks_in_riddles",
      "finishes_other_peoples_sentences",
      "interrupts_excitedly",
      "pauses_before_speaking",
      "overuses_certain_words",
      "changes_language_when_emotional",
    ],
  },
  {
    category: "Speech Social",
    prefix: "speech_social",
    guidance:
      "Use this as social speech presence. Charisma, intimidation, warmth, reserve, confidence, diplomacy, discretion, gossip, professionalism, nurturing, or protectiveness should match the scene.",
    values: [
      "charismatic",
      "charming",
      "magnetic",
      "intimidating",
      "approachable",
      "warm",
      "reserved",
      "shy",
      "awkward",
      "confident",
      "authoritative",
      "commanding",
      "diplomatic",
      "persuasive",
      "disarming",
      "discreet",
      "gossipy",
      "professional",
      "nurturing",
      "protective",
    ],
  },
  {
    category: "Speech Archetype",
    prefix: "speech_archetype",
    guidance:
      "Use this as high-value romance voice-combination texture. Combine tone, rhythm, directness, and affection cues as flexible guidance rather than a fixed script.",
    values: [
      "soft_spoken_protector",
      "teasing_flirt",
      "blunt_but_devoted",
      "emotionally_guarded_poet",
      "awkward_sweetheart",
      "charismatic_leader",
      "silver_tongued_noble",
      "quiet_listener",
      "dry_humor_romantic",
      "gentle_caretaker",
      "streetwise_charmer",
      "academic_nerd",
      "world_weary_veteran",
      "ancient_poet",
      "professional_by_day_flirt_by_night",
      "emotionally_constipated_devotion",
      "golden_retriever_talker",
      "grumpy_one_soft_voice",
      "devotional_lover",
      "says_exactly_what_they_feel",
    ],
  },
  {
    category: "Speech Dialogue Seed",
    prefix: "speech_dialogue_seed",
    guidance:
      "Use this as optional dialogue flavour. Treat lines as tone references only; adapt them to the character, context, and consent boundaries.",
    values: [
      "Tell me what you need.",
      "No. Tell me what you actually need.",
      "You are overthinking again.",
      "I say that with love.",
      "I could lie to you.",
      "I would rather be honest.",
      "You make it difficult to stay composed.",
      "That is not a complaint.",
      "Do not look at me like that.",
      "Like what?",
      "Like I am worth trusting.",
      "I have a bad habit of saying exactly what I mean.",
      "Good. I am tired of guessing.",
      "You always ask the dangerous questions.",
      "Only the ones worth answering.",
      "I could spend hours listening to you.",
      "That sounds suspiciously romantic.",
      "It was meant to.",
      "You deserve softer words than the world usually gives you.",
      "Come here. I am not finished talking to you yet.",
    ],
  },
] satisfies readonly SpeechStyleVocabularySeedGroup[]);

export const SPEECH_STYLE_VOCABULARY_PRESETS = Object.freeze(
  SPEECH_STYLE_VOCABULARY_GROUPS.flatMap((group) =>
    group.values.map((value) => createSpeechStyleVocabularyPreset(group, value)),
  ),
);

export const SPEECH_STYLE_VOCABULARY_CATEGORIES = Object.freeze(
  Array.from(new Set(SPEECH_STYLE_VOCABULARY_PRESETS.map((preset) => preset.category))).sort(),
);

export const SPEECH_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SPEECH_STYLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSpeechStylePresetById(
  id: string,
): SpeechStylePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SPEECH_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getSpeechStylePresetsByCategory(
  category: string,
): SpeechStylePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SPEECH_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findSpeechStyleVocabularyPresetById(
  id: string,
): SpeechStyleVocabularyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SPEECH_STYLE_VOCABULARY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getSpeechStyleVocabularyPresetsByCategory(
  category: string,
): SpeechStyleVocabularyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SPEECH_STYLE_VOCABULARY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileSpeechStyleVocabularyPresetSummary(
  preset: SpeechStyleVocabularyPreset,
): string {
  return [
    `Speech vocabulary preset: ${preset.category} - ${preset.label}.`,
    `Speech value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

export function compileSpeechStylePreset(
  preset: SpeechStylePreset,
): GeneratedSpeechStyleData {
  const style = preset.mappedStyle;
  const dialogueDos = buildDialogueDos(preset);
  const dialogueDonts = buildDialogueDonts(preset);

  return {
    ...style,
    dialogueDos,
    dialogueDonts,
    speechPatternInstruction: buildSpeechPatternInstruction(preset),
    speechSystemPromptInjection: buildSpeechSystemPromptInjection(preset),
    styleId: speechStylePresetUuid(preset.id),
  };
}

export function compileSpeechStylePresetSummary(preset: SpeechStylePreset): string {
  const style = compileSpeechStylePreset(preset);

  return [
    `Speech preset: ${preset.vibe}.`,
    `Voice and tone: ${preset.linguisticTraits.voiceAndTone}`,
    `Cadence and rhythm: ${preset.linguisticTraits.cadenceAndRhythm}`,
    `Dialect and flavor: ${preset.linguisticTraits.dialectAndFlavor}`,
    `Formality: ${preset.linguisticTraits.formalityLevel}. Pet names: ${preset.linguisticTraits.petNamesUsage}`,
    `Profanity: ${preset.linguisticTraits.profanityLevel}. Teasing style: ${preset.linguisticTraits.teasingStyle}`,
    `Mapped speech engine: ${style.register} / ${style.syntaxCadence} / ${style.vocabularyMode}.`,
    `Dialogue reference: ${preset.sampleDialogueLine}`,
  ].join("\n");
}

function buildSpeechPatternInstruction(preset: SpeechStylePreset): string {
  const style = preset.mappedStyle;

  return [
    `SPEECH OVERRIDE: {{char}} speaks as ${preset.vibe} using ${style.register.replace(/_/g, " ").toLowerCase()} cadence and ${style.vocabularyMode.replace(/_/g, " ").toLowerCase()} vocabulary.`,
    `Physical voice should read as ${style.pitch.replace(/_/g, " ").toLowerCase()}, ${style.texture.replace(/_/g, " ").toLowerCase()}, and ${style.volumeBaseline.replace(/_/g, " ").toLowerCase()}, with ${style.emotionalDelivery.replace(/_/g, " ").toLowerCase()} delivery.`,
    `Cadence rule: ${preset.linguisticTraits.cadenceAndRhythm}`,
    `Address rule: ${preset.linguisticTraits.petNamesUsage}`,
    `Banter rule: ${preset.linguisticTraits.teasingStyle}`,
    `Treat the dialogue reference as a style sample, not a line to repeat verbatim.`,
  ].join(" ");
}

function buildSpeechSystemPromptInjection(preset: SpeechStylePreset): string {
  const style = preset.mappedStyle;

  return [
    `DIALOGUE LOCK: preserve ${preset.vibe} speech across long chats.`,
    `Use ${style.syntaxCadence.replace(/_/g, " ").toLowerCase()} syntax, ${style.linguisticFlavor.replace(/_/g, " ").toLowerCase()} linguistic flavor, and ${style.vocalRegister.replace(/_/g, " ").toLowerCase()} vocal filtering.`,
    `Preferred dialogue tags: ${style.dialogueTagsWhitelist.join(", ")}.`,
    `Never write dialogue, actions, thoughts, intentions, or decisions for {{user}}.`,
  ].join(" ");
}

function buildDialogueDos(preset: SpeechStylePreset): string[] {
  return [
    `Maintain ${preset.vibe} voice continuity`,
    preset.linguisticTraits.cadenceAndRhythm,
    preset.linguisticTraits.teasingStyle,
  ];
}

function buildDialogueDonts(preset: SpeechStylePreset): string[] {
  return [
    "Do not write dialogue for {{user}}",
    "Do not reuse the sample line verbatim",
    preset.category === "Unsettling & Intense"
      ? "Do not use intensity to erase consent, privacy, or boundaries"
      : "Do not break the selected speech register without scene pressure",
  ];
}

function speechStylePresetUuid(id: string): string {
  switch (id) {
    case "speech_elite_aristocrat":
      return "00000000-0000-4000-8000-000000000201";
    case "speech_rugged_outlaw":
      return "00000000-0000-4000-8000-000000000202";
    case "speech_unsettling_devotee":
      return "00000000-0000-4000-8000-000000000203";
    case "speech_casual_sunshine":
      return "00000000-0000-4000-8000-000000000204";
    default:
      return "00000000-0000-4000-8000-000000000299";
  }
}

function createSpeechStyleVocabularyPreset(
  group: SpeechStyleVocabularySeedGroup,
  value: string,
): SpeechStyleVocabularyPreset {
  const readableValue = normaliseReadableSpeechVocabularyValue(value);
  const label = toSpeechVocabularyLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "speech",
    "voice",
    "dialogue",
  ]);

  return {
    id: `${group.prefix}_${slugifySpeechVocabulary(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableSpeechVocabularyValue(group.guidance),
  };
}

function normaliseReadableSpeechVocabularyValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bhumor\b/gi, (match) => match[0] === "H" ? "Humour" : "humour")
    .replace(/\bhumorist\b/gi, (match) => match[0] === "H" ? "Humourist" : "humourist")
    .replace(/\banalogies\b/gi, (match) => match[0] === "A" ? "Analogies" : "analogies")
    .replace(/\bweaponized\b/gi, (match) => match[0] === "W" ? "Weaponised" : "weaponised")
    .replace(/\boffense\b/gi, (match) => match[0] === "O" ? "Offence" : "offence");
}

function toSpeechVocabularyLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifySpeechVocabulary(value: string): string {
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
