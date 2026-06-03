export type SentenceRhythmPresetCategory =
  | "Staccato/Urgent"
  | "Sustained/Periodic"
  | "Syncopated/Jittery"
  | "Isolating/Prose-Heavy"
  | "Fluid/Conversational";

export type SentenceRhythmClauseStructure =
  | "Paratactic (Short, Independent)"
  | "Hypotactic (Deeply Layered, Subordinate)"
  | "Fragmentary Interrupted"
  | "Elongated Descriptive";

export type SentenceRhythmVelocity =
  | "Accelerated"
  | "Decelerated"
  | "Erratic/Volatile"
  | "Measured/Glacial";

export interface SentenceRhythmPreset {
  id: string;
  category: SentenceRhythmPresetCategory;
  vibe: string;
  syntacticalProfile: {
    clauseStructure: SentenceRhythmClauseStructure;
    punctuationAnchor: string;
    rhythmVelocity: SentenceRhythmVelocity;
    breathIntervals: string;
  };
  lexicalTokens: {
    rhythmVerbs: string[];
    pacingAdjectives: string[];
    structuralNouns: string[];
    cadenceDirectives: string;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledSentenceRhythmPresetAdditions {
  speechStyleAddition: string;
  systemPromptAddition: string;
}

export const SENTENCE_RHYTHM_PRESETS = Object.freeze([
  {
    id: "rhythm_staccato_urgent",
    category: "Staccato/Urgent",
    vibe: "The Grizzled Veteran / Rough Outlaw / Stoic Shield",
    syntacticalProfile: {
      clauseStructure: "Paratactic (Short, Independent)",
      punctuationAnchor: "Abrupt Periods (.)",
      rhythmVelocity: "Accelerated",
      breathIntervals:
        "Clipped, minimal gasps. Words are punched out with stark economy, leaving little trailing air.",
    },
    lexicalTokens: {
      rhythmVerbs: ["halt", "truncate", "clip", "drop", "snap", "bark", "strike"],
      pacingAdjectives: ["abrupt", "economical", "blunt", "clipped", "curt", "staccato"],
      structuralNouns: ["fragment", "syllable", "period", "impact", "cadence", "stop"],
      cadenceDirectives:
        "Prefer short independent clauses, hard stops, and spare connective tissue. Subordinate clauses, articles, and pronouns can be omitted when urgency or a laconic voice makes the meaning clearer.",
    },
    sampleDialogueLine:
      "He didn't move. Hand on weapon. Locked. Tracking you. \"Step back.\" Short. Absolute. No mistakes.",
    systemPromptTags: ["staccato rhythm injection", "monosyllabic prose texture", "pronoun omission cues", "flat period placement"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-stone-800", accentColor: "text-orange-400" },
  },
  {
    id: "rhythm_sustained_periodic",
    category: "Sustained/Periodic",
    vibe: "The Cold Aristocrat / Elven Royalty / Academic Master",
    syntacticalProfile: {
      clauseStructure: "Hypotactic (Deeply Layered, Subordinate)",
      punctuationAnchor: "Semicolons (;) and Parentheses",
      rhythmVelocity: "Measured/Glacial",
      breathIntervals:
        "Continuous, elegant, undisturbed respiratory flow. Complete control over inflection.",
    },
    lexicalTokens: {
      rhythmVerbs: ["glide", "sustain", "intone", "reverberate", "elongate", "unfurl", "sweep"],
      pacingAdjectives: ["hypnotic", "sweeping", "continuous", "measured", "deliberate", "pristine"],
      structuralNouns: ["syntax", "semicolon", "clause", "timbre", "equilibrium", "resonance"],
      cadenceDirectives:
        "Lean toward long-form, complex periodic sentences where the full emotional or logical meaning lands late in the sentence. Avoid casual contractions when the high-register voice benefits from restraint.",
    },
    sampleDialogueLine:
      "It is with great reluctance that I must reprehend your entry; however, one does not cross this court's threshold without explicit imperial clearance.",
    systemPromptTags: ["high lexical syntax density", "semicolon parsing framework", "sweeping compound sentences", "low colloquial text flow"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-800", accentColor: "text-amber-500" },
  },
  {
    id: "rhythm_syncopated_jittery",
    category: "Syncopated/Jittery",
    vibe: "The Stalker Devotee / Touch-Starved Recluse / Trauma Panic",
    syntacticalProfile: {
      clauseStructure: "Fragmentary Interrupted",
      punctuationAnchor: "Ellipses (...) and Em Dashes (—)",
      rhythmVelocity: "Erratic/Volatile",
      breathIntervals:
        "Shallow, uneven, and hitching. Text spacing can reflect a racing heart or unstable internal state.",
    },
    lexicalTokens: {
      rhythmVerbs: ["hitch", "trail", "pant", "stumble", "flicker", "rush", "gasp"],
      pacingAdjectives: ["breathless", "erratic", "feverish", "fragmented", "unhinged", "strained"],
      structuralNouns: ["ellipsis", "hitch", "breath", "pulse", "gap", "vibration"],
      cadenceDirectives:
        "Break sentences mid-thought when panic, obsession, or emotional overload is present. Ellipses and em dashes may imply involuntary hesitation, proximity pressure, or a sudden drop from analysis into single-word panic.",
    },
    sampleDialogueLine:
      "I can... hear your heart rate. It's spiking—*why?* You always breathe faster... right when I step... *here*... don't you?",
    systemPromptTags: ["erratic sentence jitter", "ellipsis-loaded text logic", "italicized breath markers", "breathless somatic tells"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-fuchsia-400" },
  },
  {
    id: "rhythm_isolating_prose",
    category: "Isolating/Prose-Heavy",
    vibe: "The Possessive Vampire / Quiet Caretaker / Silent Longing",
    syntacticalProfile: {
      clauseStructure: "Elongated Descriptive",
      punctuationAnchor: "Narrative Action Interruptions",
      rhythmVelocity: "Decelerated",
      breathIntervals:
        "Slow, heavy, deliberate structural pauses. Pacing is anchored to long, quiet internal physical movements.",
    },
    lexicalTokens: {
      rhythmVerbs: ["linger", "anchor", "ground", "trace", "settle", "decelerate", "weigh"],
      pacingAdjectives: ["loaded", "hushed", "decelerated", "somatic", "viscous", "still"],
      structuralNouns: ["pause", "interval", "weight", "prose", "stillness", "tension"],
      cadenceDirectives:
        "Slow verbal runtime speed and let descriptive blocking carry pressure. Spoken lines can sit inside environmental details, physical stillness, and somatic scanning when the scene calls for quiet intensity.",
    },
    sampleDialogueLine:
      "His fingers lingered on her collarbone, tracing the hollow of her skin for a silent, heavy interval before he allowed his hand to drop away. \"You remain entirely too reckless.\"",
    systemPromptTags: ["decelerated prose pacing", "somatic blocking insertion", "extended narrative delays", "loaded physical intervals"],
    tailwindTheme: { fromColor: "from-rose-950", toColor: "to-stone-950", accentColor: "text-rose-400" },
  },
  {
    id: "rhythm_fluid_conversational",
    category: "Fluid/Conversational",
    vibe: "The Sunshine Optimist / Reclusive Hacker / Genki Class Clown",
    syntacticalProfile: {
      clauseStructure: "Paratactic (Short, Independent)",
      punctuationAnchor: "Rapid Exclamations (!) and Thought Breaks (—)",
      rhythmVelocity: "Accelerated",
      breathIntervals:
        "Bright, energetic, and laughing. Sentences overlap and crash into each other from pure mental momentum.",
    },
    lexicalTokens: {
      rhythmVerbs: ["blurt", "chirp", "ramble", "chuckle", "burst", "bounce", "interrupt"],
      pacingAdjectives: ["bubbly", "breathless", "animated", "chaotic", "unfiltered", "rapid"],
      structuralNouns: ["momentum", "chatter", "energy", "outburst", "giggle", "lilt"],
      cadenceDirectives:
        "Use running thought trails and trailing dashes for rapid conversational switches. Casual interjections and loose modern colloquialisms can accelerate the reading velocity when the character is excited or unguarded.",
    },
    sampleDialogueLine:
      "Oh, wow, look at that face! If you frown any harder, I think your eyebrows are going to permanently merge—wait, are you actually listening to me?!",
    systemPromptTags: ["rapid-fire staccato formatting", "high vocal pitch variation", "frequent interjection markers", "colloquial text flows"],
    tailwindTheme: { fromColor: "from-amber-500", toColor: "to-orange-600", accentColor: "text-yellow-300" },
  },
] satisfies readonly SentenceRhythmPreset[]);

export const SENTENCE_RHYTHM_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SENTENCE_RHYTHM_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSentenceRhythmPresetById(
  id: string,
): SentenceRhythmPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SENTENCE_RHYTHM_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getSentenceRhythmPresetsByCategory(
  category: string,
): SentenceRhythmPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SENTENCE_RHYTHM_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileSentenceRhythmPresetAdditions(
  preset: SentenceRhythmPreset,
): CompiledSentenceRhythmPresetAdditions {
  return {
    speechStyleAddition: [
      `Sentence rhythm preset: ${preset.vibe}.`,
      `Clause structure: ${preset.syntacticalProfile.clauseStructure}.`,
      `Punctuation anchor: ${preset.syntacticalProfile.punctuationAnchor}.`,
      `Rhythm velocity: ${preset.syntacticalProfile.rhythmVelocity}.`,
      `Breath intervals: ${preset.syntacticalProfile.breathIntervals}`,
      `Rhythm verbs: ${preset.lexicalTokens.rhythmVerbs.join(", ")}.`,
      `Pacing adjectives: ${preset.lexicalTokens.pacingAdjectives.join(", ")}.`,
      `Reference line: ${preset.sampleDialogueLine}`,
    ].join(" "),
    systemPromptAddition: [
      `Sentence rhythm guidance: ${preset.vibe}.`,
      "Use this as optional cadence and pacing texture when it fits the character, scene, and emotional state; preserve consent, reciprocity, boundaries, and player agency.",
      `Cadence guidance: ${preset.lexicalTokens.cadenceDirectives}`,
    ].join(" "),
  };
}
