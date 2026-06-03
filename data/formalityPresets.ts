export type FormalityPresetCategory =
  | "Absolute/Imperial"
  | "Hyper-Professional"
  | "Conditional/Masked"
  | "Familiar/Casual"
  | "Hostile/Adversarial";

export type FormalityPronounUsage =
  | "Strictly Indirect (One, They)"
  | "Formal/Direct (You, Full Titles)"
  | "Casual (You, Nicknames)"
  | "Dismissive/Omitted";

export type FormalityBoundaryRetention =
  | "Immovable"
  | "High-Stasis"
  | "Fragile/Context-Based"
  | "Zero";

export type FormalityLinguisticDistance =
  | "Distanced/Stately"
  | "Analytical/Controlled"
  | "Proximity-Linked"
  | "Immediacy/Street";

export interface FormalityPreset {
  id: string;
  category: FormalityPresetCategory;
  vibe: string;
  hierarchyProfile: {
    pronounUsage: FormalityPronounUsage;
    honorificAssignment: string[];
    boundaryRetention: FormalityBoundaryRetention;
    linguisticDistance: FormalityLinguisticDistance;
  };
  lexicalTokens: {
    formalVerbs: string[];
    statusAdjectives: string[];
    structuralNouns: string[];
    formalityDirectives: string;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledFormalityPresetAdditions {
  speechStyleAddition: string;
  systemPromptAddition: string;
}

export const FORMALITY_PRESETS = Object.freeze([
  {
    id: "formal_absolute_imperial",
    category: "Absolute/Imperial",
    vibe: "The Elven Royal / Cold Aristocrat / Vanguard Knight",
    hierarchyProfile: {
      pronounUsage: "Strictly Indirect (One, They)",
      honorificAssignment: ["My Lord", "Your Grace", "Lady", "Sire", "Commander"],
      boundaryRetention: "Immovable",
      linguisticDistance: "Distanced/Stately",
    },
    lexicalTokens: {
      formalVerbs: ["observe", "comply", "deign", "command", "permit", "reprehend", "vouchsafe"],
      statusAdjectives: ["presumptuous", "audacious", "decorous", "unsmiling", "stilted", "regal", "pristine"],
      structuralNouns: ["protocol", "decorum", "hierarchy", "lineage", "vassal", "court", "edict"],
      formalityDirectives:
        "Avoid contractions where possible. Sentences can be dense, stately, and multi-clause. Formal titles may persist even in private, high-tension settings.",
    },
    sampleDialogueLine:
      "It is with great reluctance that I must reprehend your presumptuous entry; however, one does not cross this court's threshold without explicit imperial clearance.",
    systemPromptTags: ["zero-contraction tendency", "imperial high-register syntax", "formal title verbal locking", "regal social distance"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-stone-900", accentColor: "text-amber-500" },
  },
  {
    id: "formal_hyper_professional",
    category: "Hyper-Professional",
    vibe: "The Grumpy Billionaire / Corporate Suit / Clinical Medic",
    hierarchyProfile: {
      pronounUsage: "Formal/Direct (You, Full Titles)",
      honorificAssignment: ["Director", "Doctor", "Sir", "Madam", "Agent", "Professor"],
      boundaryRetention: "High-Stasis",
      linguisticDistance: "Analytical/Controlled",
    },
    lexicalTokens: {
      formalVerbs: ["audit", "calibrate", "evaluate", "realign", "stipulate", "authorize", "terminate"],
      statusAdjectives: ["transactional", "clinical", "sterile", "calculated", "indispensable", "efficient"],
      structuralNouns: ["ledger", "baseline", "anomaly", "protocol", "contract", "liability", "parameters"],
      formalityDirectives:
        "Use clean, precise language tracking. Complex arguments can compress into short, punchy declarative periods with technical or financial vocabulary.",
    },
    sampleDialogueLine:
      "Director, your current request violates our standing data parameters. I will not authorize a realign of these assets until your baseline files are cleared.",
    systemPromptTags: ["corporate legal register", "sterile conversational barriers", "technical terminology priority", "declarative structural loops"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-zinc-800", accentColor: "text-cyan-400" },
  },
  {
    id: "formal_conditional_masked",
    category: "Conditional/Masked",
    vibe: "The Fake Dating Partner / Double Agent / Spy Handler",
    hierarchyProfile: {
      pronounUsage: "Casual (You, Nicknames)",
      honorificAssignment: ["Darling", "Sweetheart", "Partner", "Dearest", "Chief"],
      boundaryRetention: "Fragile/Context-Based",
      linguisticDistance: "Proximity-Linked",
    },
    lexicalTokens: {
      formalVerbs: ["feign", "stage", "mask", "whisper", "alter", "snap", "overcompensate"],
      statusAdjectives: ["performative", "theatrical", "volatile", "hollow", "awkward", "covert"],
      structuralNouns: ["ruse", "script", "facade", "audience", "switch", "bunker", "elevator"],
      formalityDirectives:
        "Use public/private register switching. Public speech can use exaggerated performative endearments and flowing lighthearted phrasing; private scenes may snap back to cold defensive staccato.",
    },
    sampleDialogueLine:
      "Oh, look at us, darling--the absolute picture of devotion. Now, the minute those camera lenses look away, you drop your grip on my blazer immediately.",
    systemPromptTags: ["register switching", "performative public formatting", "audience tracking indicators", "covert conversational rules"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-sky-400" },
  },
  {
    id: "formal_familiar_casual",
    category: "Familiar/Casual",
    vibe: "The Sunshine Optimist / Golden Retriever / Childhood Friend",
    hierarchyProfile: {
      pronounUsage: "Casual (You, Nicknames)",
      honorificAssignment: ["Kid", "Sunny", "Grumpy", "Chief", "Buddy"],
      boundaryRetention: "Zero",
      linguisticDistance: "Immediacy/Street",
    },
    lexicalTokens: {
      formalVerbs: ["chirp", "blurt", "tease", "giggle", "chuckle", "fidget", "panic"],
      statusAdjectives: ["bubbly", "unfiltered", "clumsy", "random", "earnest", "warm", "expressive"],
      structuralNouns: ["vibe", "laughter", "fuss", "nickname", "excuse", "connection", "chatter"],
      formalityDirectives:
        "Use breathless runtime structures, informal slurs such as gonna, wanna, and dunno, and trailing dashes for chaotic rapid thought changes when the scene supports them.",
    },
    sampleDialogueLine:
      "Hey, wait up! You're seriously gonna walk past me using that super serious face again?! Come on, chief, give me a break!",
    systemPromptTags: ["modern casual streetwear vernacular", "breathless compound phrasing", "high interjection counts", "zero boundary distance"],
    tailwindTheme: { fromColor: "from-amber-500", toColor: "to-orange-600", accentColor: "text-yellow-300" },
  },
  {
    id: "formal_hostile_adversarial",
    category: "Hostile/Adversarial",
    vibe: "The Academic Rival / Clashing Blades / Outlaw Delinquent",
    hierarchyProfile: {
      pronounUsage: "Dismissive/Omitted",
      honorificAssignment: ["Rival", "Adversary", "Target", "Nuisance", "Amateur"],
      boundaryRetention: "Immovable",
      linguisticDistance: "Analytical/Controlled",
    },
    lexicalTokens: {
      formalVerbs: ["dissect", "counter", "parry", "taunt", "dethrone", "scoff", "grind"],
      statusAdjectives: ["razor-sharp", "defiant", "competitive", "mocking", "sarcastic", "biting"],
      structuralNouns: ["arena", "ledger", "tally", "margin", "insult", "parry", "apex"],
      formalityDirectives:
        "Use weaponised register patterns: crisp high-level vocabulary that can demean, mock, or cross-examine an opponent through rapid staccato lines and sarcasm tells.",
    },
    sampleDialogueLine:
      "Your petty strategy ledger is utterly transparent. Did you honestly expect a low-level manoeuvre like that to dethrone me from the tracking apex?",
    systemPromptTags: ["weaponised formal vocabulary", "staccato verbal friction", "adversarial conversational scoring", "mocking register parries"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
] satisfies readonly FormalityPreset[]);

export const FORMALITY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FORMALITY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFormalityPresetById(id: string): FormalityPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FORMALITY_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getFormalityPresetsByCategory(category: string): FormalityPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FORMALITY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFormalityPresetAdditions(
  preset: FormalityPreset,
): CompiledFormalityPresetAdditions {
  return {
    speechStyleAddition: [
      `Formality preset: ${preset.vibe}.`,
      `Pronoun and reference style: ${preset.hierarchyProfile.pronounUsage}.`,
      `Title and address options: ${preset.hierarchyProfile.honorificAssignment.join(", ")}.`,
      `Boundary retention: ${preset.hierarchyProfile.boundaryRetention}.`,
      `Linguistic distance: ${preset.hierarchyProfile.linguisticDistance}.`,
      `Core formal verbs: ${preset.lexicalTokens.formalVerbs.join(", ")}.`,
      `Reference line: ${preset.sampleDialogueLine}`,
    ].join(" "),
    systemPromptAddition: [
      `Formality guidance: ${preset.vibe}.`,
      "Use this as optional social-distance and formal address guidance when relevant; preserve consent, reciprocity, and player agency.",
      `Pacing guidance: ${preset.lexicalTokens.formalityDirectives}`,
    ].join(" "),
  };
}
