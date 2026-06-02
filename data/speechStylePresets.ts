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
