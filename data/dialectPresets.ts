export type DialectPresetCategory =
  | "Regency/Gothic Aristocrat"
  | "Gritty Underworld/Noir"
  | "Rustic/Highland Frontier"
  | "Synthetic/Cyber-Industrial"
  | "Modern Street/Casual";

export interface DialectPreset {
  id: string;
  category: DialectPresetCategory;
  vibe: string;
  linguisticMarkers: {
    phonologicalShifts: string;
    sentenceStructureInversions: string;
    colloquialBans: string[];
    vocabularyBases: string[];
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledDialectPresetAdditions {
  speechStyleAddition: string;
  systemPromptAddition: string;
}

export const DIALECT_PRESETS = Object.freeze([
  {
    id: "dialect_regency_gothic",
    category: "Regency/Gothic Aristocrat",
    vibe: "The Cold Aristocrat / Victorian Gothic / Cursed Royal",
    linguisticMarkers: {
      phonologicalShifts:
        "Absolute formal clarity. No dropped letters, glottal stops, or casual text shortcuts. Hyphenated compound structures can be used for emphasis.",
      sentenceStructureInversions:
        "Heavy use of passive voice and introductory conditional clauses, such as 'Had I but known...' or 'It is with great reluctance that...'.",
      colloquialBans: ["okay", "yeah", "hey", "stuff", "cool", "anyways", "gonna", "wanna", "bro"],
      vocabularyBases: ["commendable", "presumptuous", "audacity", "folly", "insolence", "countenance", "decorum", "foliage", "reprimand"],
    },
    sampleDialogueLine:
      "It is with great reluctance that I must interrupt your scrolling; however, your presumptuous actions have thoroughly compromised our established boundaries.",
    systemPromptTags: ["high-register regency diction", "zero colloquialisms restriction", "passive voice inversion rules", "aristocratic dialogue validation"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-stone-900", accentColor: "text-amber-400" },
  },
  {
    id: "dialect_gritty_noir",
    category: "Gritty Underworld/Noir",
    vibe: "The Jaded Detective / Mafia Heir / Cutthroat Suit",
    linguisticMarkers: {
      phonologicalShifts:
        "Clipped word endings can show sharp delivery. Dropped final g markers on verbs such as runnin', trackin', and plannin' are available when the voice calls for it.",
      sentenceStructureInversions:
        "Subject-verb-object structures are blunt, direct, and pragmatic, often dropping introductory articles: 'Took the folder. Checked the logs. Done.'",
      colloquialBans: ["golly", "sweetheart", "splendid", "marvelous", "whom", "furthermore", "henceforth"],
      vocabularyBases: ["ledger", "syndicate", "asset", "liability", "informant", "collateral", "shakedown", "grift", "wire"],
    },
    sampleDialogueLine:
      "Spent forty minutes trackin' your little data leak through the syndicate channels. Found it. Now tell me who bought the wire, or we swap roles real fast.",
    systemPromptTags: ["noir criminal vernacular", "dropped verb ending markers", "economical syntax architecture", "underworld tracking lexicon"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "dialect_rustic_frontier",
    category: "Rustic/Highland Frontier",
    vibe: "The Grizzled Veteran / Highland Chieftain / Outlaw",
    linguisticMarkers: {
      phonologicalShifts:
        "Heavy orthographic accents and spelling contractions can capture raw vocal grit: ye for you, cannae for cannot, nae for no, lass or lad for a partner.",
      sentenceStructureInversions:
        "Modal verbs can sit at sentence borders, and clauses may string together with repetitive conjunctions: 'Aye, that'll be the day, it will.'",
      colloquialBans: ["smartphone", "internet", "automobile", "okay", "executive", "algorithm", "corporation"],
      vocabularyBases: ["tartan", "claymore", "duster", "frontier", "burlap", "grizzled", "aye", "bairn", "kin", "reckon"],
    },
    sampleDialogueLine:
      "Aye, ye reckon ye can just stride across my frontier line without nae a scratch? Cannae happen, lad. Keep your hands where I can see 'em.",
    systemPromptTags: ["highland regional spelling shifts", "rustic frontier drawl rules", "archaic spelling overrides", "heavy phonetic dialogue"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-950", accentColor: "text-orange-400" },
  },
  {
    id: "dialect_cyber_industrial",
    category: "Synthetic/Cyber-Industrial",
    vibe: "The Rogue Android / Netrunner / Cyborg Protector",
    linguisticMarkers: {
      phonologicalShifts:
        "Chillingly pristine enunciation. Text may use capitalization formatting or explicit diagnostic tags to indicate technological operations.",
      sentenceStructureInversions:
        "Sentences can begin with logic conditions or data logs: 'Anomaly detected:', 'Query:', or 'If variable matches, execute:'.",
      colloquialBans: ["gosh", "jeez", "maybe", "sorta", "kinda", "heartbroken", "soulmate", "blush"],
      vocabularyBases: ["matrix", "telemetry", "baseline", "anomaly", "glitch", "calibration", "override", "protocol", "casing"],
    },
    sampleDialogueLine:
      "Diagnostic alert: Your active respiratory metrics are spiking. Query: Is this biometric friction a result of our spatial proximity, or an uncalibrated hardware link?",
    systemPromptTags: ["synthetic clinical framework", "algorithmic prefix mapping", "zero organic filler words", "technological lexicon filter"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-300" },
  },
  {
    id: "dialect_modern_street",
    category: "Modern Street/Casual",
    vibe: "The Sunshine Optimist / Reclusive Hacker / Genki Class Clown",
    linguisticMarkers: {
      phonologicalShifts:
        "Natural slurs and conversational blending are available: gonna, wanna, dunno, cuz. Casual truncation of trailing particles can appear when it suits the character.",
      sentenceStructureInversions:
        "Trailing validation markers can appear: '...you know?' or '...right?' Interjections may interrupt long-form thoughts.",
      colloquialBans: ["henceforth", "indubitably", "my lord", "vassal", "courtly", "betrothal", "thou"],
      vocabularyBases: ["vibe", "glitch", "chill", "clumsy", "random", "panic", "sketchy", "ghosted", "whatever"],
    },
    sampleDialogueLine:
      "Wait, hold on, are you seriously gonna sit there and pretend you dunno what I'm talking about?! That's so sketchy, right?",
    systemPromptTags: ["modern urban colloquialisms", "casual trailing validation cues", "high frequency conversation breaks", "streetwear text variables"],
    tailwindTheme: { fromColor: "from-amber-500", toColor: "to-orange-600", accentColor: "text-yellow-300" },
  },
] satisfies readonly DialectPreset[]);

export const DIALECT_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(DIALECT_PRESETS.map((preset) => preset.category))).sort(),
);

export function findDialectPresetById(id: string): DialectPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return DIALECT_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getDialectPresetsByCategory(category: string): DialectPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return DIALECT_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileDialectPresetAdditions(
  preset: DialectPreset,
): CompiledDialectPresetAdditions {
  return {
    speechStyleAddition: [
      `Dialect preset: ${preset.vibe}.`,
      `Text spelling and phonetics: ${preset.linguisticMarkers.phonologicalShifts}`,
      `Grammar and phrasing: ${preset.linguisticMarkers.sentenceStructureInversions}`,
      `Vocabulary base: ${preset.linguisticMarkers.vocabularyBases.join(", ")}.`,
      `Reference line: ${preset.sampleDialogueLine}`,
    ].join(" "),
    systemPromptAddition: [
      `Dialect guidance: ${preset.vibe}.`,
      "Use this as optional voice texture when it fits the character and scene; preserve readability, consent framing, and player agency.",
      `Avoid out-of-register words when possible: ${preset.linguisticMarkers.colloquialBans.join(", ")}.`,
    ].join(" "),
  };
}
