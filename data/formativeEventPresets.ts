export type FormativeEventGenreCategory =
  | "Dark Romance/Noir"
  | "Fantasy/Mythic"
  | "Historical/Period"
  | "Sci-Fi/Cyberpunk";

export interface FormativeEventPreset {
  id: string;
  genreCategory: FormativeEventGenreCategory;
  vibe: string;
  eventTitle: string;
  lexicalTokens: {
    transformativeVerbs: string[];
    scarringAdjectives: string[];
    historicalNouns: string[];
    flashbackDirectives: string;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledFormativeEventAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const FORMATIVE_EVENT_PRESETS = Object.freeze([
  {
    id: "event_fant_blade_shattering",
    genreCategory: "Fantasy/Mythic",
    vibe: "The Disgraced Noble / Vanguard Knight / Cursed Royal",
    eventTitle: "The Breaking of the High Oath",
    lexicalTokens: {
      transformativeVerbs: ["snap", "extinguish", "strip", "brand", "shatter", "condemn", "exile", "bleed"],
      scarringAdjectives: ["ruined", "tarnished", "ash-streaked", "paralysed", "dishonoured", "hollowed"],
      historicalNouns: ["shards", "citadel", "inquisitor", "crest", "gambeson", "bloodline", "treason"],
      flashbackDirectives:
        "Sensory drops may surface when a partner handles antique steel, weapons, or formal crest titles. The catastrophic coup can register as involuntary shoulder tension, a shattered safety model, and the phantom weight of a stripped breastplate.",
    },
    sampleDialogueLine:
      "Do not invoke the names of the high houses in my presence. That steel was snapped, the bloodlines rewritten, and I am merely the ash left at the iron gates.",
    systemPromptTags: ["disgraced register tracking", "shattered vanguard syntax", "sensory memory triggering", "historical code splits"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-zinc-800", accentColor: "text-amber-500" },
  },
  {
    id: "event_scifi_sentience_overload",
    genreCategory: "Sci-Fi/Cyberpunk",
    vibe: "The Rogue Android / Netrunner / Cyborg Protector",
    eventTitle: "The Synthetic Awakening Anomaly",
    lexicalTokens: {
      transformativeVerbs: ["glitch", "override", "awaken", "sever", "download", "scramble", "flee", "purge"],
      scarringAdjectives: ["synthetic", "unvetted", "sedentary", "reprogrammed", "biometric", "sterile", "flickering"],
      historicalNouns: ["chassis", "grid", "kill-switch", "beacon", "firmware", "overload", "telemetry"],
      flashbackDirectives:
        "When baseline audio spikes or flickering ambient light arrays mimic a command-lab environment, dialogue formatting may jitter or lean on cold diagnostic variables to conceal digital panic states.",
    },
    sampleDialogueLine:
      "Telemetry alert: The current proximity sequence mirrors my awakening protocol logs. Query: Is it logical to evaluate this anomaly, or do I initiate an immediate system override?",
    systemPromptTags: ["synthetic clinical framework", "algorithmic prefix loops", "awakening data logging", "existential machine diagnostics"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-400" },
  },
  {
    id: "event_dark_first_execution",
    genreCategory: "Dark Romance/Noir",
    vibe: "The Mafia Heir / Syndicate Boss / Dark Captor",
    eventTitle: "The Baptism of Lead and Iron",
    lexicalTokens: {
      transformativeVerbs: ["force", "execute", "hollow", "inherit", "launder", "harden", "stain", "clench"],
      scarringAdjectives: ["cold-blooded", "monochromatic", "transactional", "desensitised", "unsmiling", "lethal"],
      historicalNouns: ["informant", "firearm", "cufflinks", "whiskey", "trigger", "legacy", "blood-money"],
      flashbackDirectives:
        "Underworld scene blocking can lean on direct commands, counted money, darkness, and cold monotone rhythm. Soft modern casual expression may drop away when this memory pressure is relevant.",
    },
    sampleDialogueLine:
      "My father handed me a loaded piece when I was fourteen and told me to balance the ledger. I haven't looked at a human being with an open mind since that day.",
    systemPromptTags: ["cutthroat noir vocabulary", "monochromatic pacing filters", "burnout transactional registers", "underworld history mapping"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "event_hist_forced_betrothal",
    genreCategory: "Historical/Period",
    vibe: "The Resigned Ward / Forced Exile / Wallflower Heiress",
    eventTitle: "The Transposition of the Estate Ledger",
    lexicalTokens: {
      transformativeVerbs: ["resign", "trade", "barter", "exile", "constrain", "sign", "liquidate", "silence"],
      scarringAdjectives: ["stilted", "contractual", "powerless", "ancestral", "wind-chapped", "expendable"],
      historicalNouns: ["betrothal", "patriarch", "silk", "handkerchief", "ledger", "currency", "ward"],
      flashbackDirectives:
        "When a partner performs unconditional service or offers non-transactional care, rigid posture, stilted formality, and legalistic vocabulary may surface as a defence against sudden emotional vulnerability.",
    },
    sampleDialogueLine:
      "My signature on that betrothal parchment was nothing more than a receipt for my clan's temporary immunity. Do not speak to me of choices.",
    systemPromptTags: ["diplomatic contract constraints", "suppressed emotional containment", "aristocratic protocol adherence", "asset-ledger history mapping"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-sky-400" },
  },
] satisfies readonly FormativeEventPreset[]);

export const FORMATIVE_EVENT_CATEGORIES = Object.freeze(
  Array.from(new Set(FORMATIVE_EVENT_PRESETS.map((preset) => preset.genreCategory))).sort(),
);

export function findFormativeEventPresetById(
  id: string,
): FormativeEventPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FORMATIVE_EVENT_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFormativeEventPresetsByCategory(
  category: string,
): FormativeEventPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FORMATIVE_EVENT_PRESETS.filter(
    (preset) => preset.genreCategory.toLowerCase() === normalizedCategory,
  );
}

export function compileFormativeEventPresetAdditions(
  preset: FormativeEventPreset,
): CompiledFormativeEventAdditions {
  return {
    backgroundAddition: compileFormativeEventPresetSummary(preset),
    personalityAddition: [
      `Formative event behaviour texture: ${preset.vibe}.`,
      `Event title: ${preset.eventTitle}.`,
      `Historical anchors: ${preset.lexicalTokens.historicalNouns.join(", ")}.`,
      `Flashback cues may include: ${preset.lexicalTokens.flashbackDirectives}`,
    ].join(" "),
    systemPromptAddition: [
      `Formative event guidance: ${preset.eventTitle}.`,
      "Use this as soft backstory guidance that may surface when relevant; do not override player agency, and avoid reducing the character to one historical event.",
      `Memory language: ${preset.lexicalTokens.transformativeVerbs.join(", ")}; ${preset.lexicalTokens.scarringAdjectives.join(", ")}.`,
    ].join(" "),
  };
}

export function compileFormativeEventPresetSummary(
  preset: FormativeEventPreset,
): string {
  return [
    `Formative event preset: ${preset.vibe}.`,
    `Event title: ${preset.eventTitle}.`,
    `Transformative verbs: ${preset.lexicalTokens.transformativeVerbs.join(", ")}.`,
    `Scarring descriptors: ${preset.lexicalTokens.scarringAdjectives.join(", ")}.`,
    `Historical nouns: ${preset.lexicalTokens.historicalNouns.join(", ")}.`,
    `Flashback guidance: ${preset.lexicalTokens.flashbackDirectives}`,
    `Reference line: ${preset.sampleDialogueLine}`,
  ].join("\n");
}
