export type VoiceVocabularyCategory =
  | "Crisp & Angular"
  | "Ethereal & Detached"
  | "Gravelly & Weathered"
  | "Low & Resonant"
  | "Melodic & Warm"
  | "Velvety & Intimate";

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

export const VOICE_VOCABULARY_CATEGORIES = Object.freeze(
  Array.from(new Set(VOICE_VOCABULARY_PRESETS.map((preset) => preset.category))).sort(),
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
