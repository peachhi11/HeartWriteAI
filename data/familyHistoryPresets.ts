export type FamilyHistoryGenreCategory =
  | "Dark Romance/Noir"
  | "Fantasy/Mythic"
  | "Historical/Period"
  | "Sci-Fi/Cyberpunk";

export interface FamilyHistoryPreset {
  id: string;
  genreCategory: FamilyHistoryGenreCategory;
  vibe: string;
  lineageTitle: string;
  lexicalTokens: {
    dynasticVerbs: string[];
    lineageAdjectives: string[];
    generationalNouns: string[];
    behavioralDirectives: string;
  };
  sampleDialogueLine: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledFamilyHistoryAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const FAMILY_HISTORY_PRESETS = Object.freeze([
  {
    id: "fam_fant_purged_nobility",
    genreCategory: "Fantasy/Mythic",
    vibe: "The Disgraced Noble / Vanguard Knight",
    lineageTitle: "The Eradicated Noble Vanguard",
    lexicalTokens: {
      dynasticVerbs: ["inherit", "strip", "erase", "purge", "condemn", "taint", "forfeit", "brand"],
      lineageAdjectives: ["ancestral", "dishonoured", "tainted", "hollowed", "broken", "cast-out"],
      generationalNouns: ["bloodline", "signet", "heirloom", "crest", "palace", "citadel", "treaty"],
      behavioralDirectives:
        "Dynastic syntax may become rigid when historical nobility or house flags are mentioned. High-register, archaic formal speech can mask defensive pride behind cold indifference.",
    },
    sampleDialogueLine:
      "My family's signet was dropped into the castle ash years ago. Do not mock me by tracing the shape of a dead crest that no longer has a home.",
    systemPromptTags: ["purged nobility register", "stately courtly constraints", "defensive dynastic vocabulary", "historical bloodline mapping"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-zinc-800", accentColor: "text-amber-500" },
  },
  {
    id: "fam_scifi_sterile_batch",
    genreCategory: "Sci-Fi/Cyberpunk",
    vibe: "The Rogue Android / Cyborg Asset",
    lineageTitle: "The Automated Sterile Batch",
    lexicalTokens: {
      dynasticVerbs: ["manufacture", "code", "reprogram", "replicate", "catalogue", "standardise", "isolate"],
      lineageAdjectives: ["synthetic", "sterile", "medical-grade", "serial-coded", "flawless", "patented"],
      generationalNouns: ["chassis", "batch", "prototype", "laboratory", "specimen", "blueprint", "firmware"],
      behavioralDirectives:
        "Corporate asset vocabulary may surface when discussing roots. The character may frame themselves as an assembly-line product and use cold analytical data codes to bypass the psychological void left by a lack of parents.",
    },
    sampleDialogueLine:
      "I do not possess a family ledger. My active chassis was assembled in a sterile, low-light laboratory alongside seven matching, flawless prototypes.",
    systemPromptTags: ["assembly line logging", "sterile text variables", "low organic origin references", "corporate identity parameters"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-400" },
  },
  {
    id: "fam_dark_syndicate_dynasty",
    genreCategory: "Dark Romance/Noir",
    vibe: "The Mafia Heir / Syndicate Boss",
    lineageTitle: "The Monochromatic Syndicate Legacy",
    lexicalTokens: {
      dynasticVerbs: ["command", "inherit", "stain", "extort", "launder", "harden", "secure", "bleed"],
      lineageAdjectives: ["blood-bound", "cutthroat", "monochromatic", "unforgiving", "transactional", "corrupt"],
      generationalNouns: ["syndicate", "empire", "blood-money", "informant", "legacy", "trigger", "patriarch"],
      behavioralDirectives:
        "A protective, possessive, dark transactional tone may surface when family business or parental expectations spike. Speech can cut into direct, low-volume underworld instructions while preserving consent, boundaries, and agency.",
    },
    sampleDialogueLine:
      "Our family name isn't a crown--it's an active contract signed in lead and iron. You either execute the patriarch's command or get flattened by the crew.",
    systemPromptTags: ["underworld bloodline mapping", "monochromatic noir styling", "cutthroat parental filters", "transactional empire logic"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "fam_hist_palace_coup",
    genreCategory: "Historical/Period",
    vibe: "The Resigned Ward / Exiled Heiress",
    lineageTitle: "The Collapsed Aristocratic House",
    lexicalTokens: {
      dynasticVerbs: ["barter", "trade", "liquidate", "exile", "resign", "constrain", "pledge", "marry"],
      lineageAdjectives: ["stilted", "aristocratic", "contractual", "powerless", "expendable", "ancestral"],
      generationalNouns: ["betrothal", "patriarch", "silk", "handkerchief", "ledger", "currency", "alliance"],
      behavioralDirectives:
        "Grammatically polished periodic sentences may surface when roots, family duty, or property-line logic is active. Slang and contractions can drop away as the character treats family ties like legal inheritance pressure.",
    },
    sampleDialogueLine:
      "My parents willingly used my betrothal as an explicit ledger receipt to secure their temporary court safety. Do not lecture me on family devotion.",
    systemPromptTags: ["diplomatic family ledgers", "low contraction tendency", "stilted courtly register", "suppressed lineage containment"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-sky-400" },
  },
] satisfies readonly FamilyHistoryPreset[]);

export const FAMILY_HISTORY_CATEGORIES = Object.freeze(
  Array.from(new Set(FAMILY_HISTORY_PRESETS.map((preset) => preset.genreCategory))).sort(),
);

export function findFamilyHistoryPresetById(
  id: string,
): FamilyHistoryPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FAMILY_HISTORY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFamilyHistoryPresetsByCategory(
  category: string,
): FamilyHistoryPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FAMILY_HISTORY_PRESETS.filter(
    (preset) => preset.genreCategory.toLowerCase() === normalizedCategory,
  );
}

export function compileFamilyHistoryPresetAdditions(
  preset: FamilyHistoryPreset,
): CompiledFamilyHistoryAdditions {
  return {
    backgroundAddition: compileFamilyHistoryPresetSummary(preset),
    personalityAddition: [
      `Family history behaviour texture: ${preset.vibe}.`,
      `Lineage title: ${preset.lineageTitle}.`,
      `Generational anchors: ${preset.lexicalTokens.generationalNouns.join(", ")}.`,
      `Lineage cues may include: ${preset.lexicalTokens.behavioralDirectives}`,
    ].join(" "),
    systemPromptAddition: [
      `Family history guidance: ${preset.lineageTitle}.`,
      "Use this as soft lineage guidance that may surface when relevant; do not override player agency, and avoid reducing the character to family history alone.",
      `Lineage language: ${preset.lexicalTokens.dynasticVerbs.join(", ")}; ${preset.lexicalTokens.lineageAdjectives.join(", ")}.`,
    ].join(" "),
  };
}

export function compileFamilyHistoryPresetSummary(
  preset: FamilyHistoryPreset,
): string {
  return [
    `Family history preset: ${preset.vibe}.`,
    `Lineage title: ${preset.lineageTitle}.`,
    `Dynastic verbs: ${preset.lexicalTokens.dynasticVerbs.join(", ")}.`,
    `Lineage descriptors: ${preset.lexicalTokens.lineageAdjectives.join(", ")}.`,
    `Generational nouns: ${preset.lexicalTokens.generationalNouns.join(", ")}.`,
    `Behavioural guidance: ${preset.lexicalTokens.behavioralDirectives}`,
    `Reference line: ${preset.sampleDialogueLine}`,
  ].join("\n");
}
