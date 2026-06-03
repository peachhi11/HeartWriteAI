export type ExilePresetCategory =
  | "Geographical Banishment"
  | "Social Excommunication"
  | "Systemic Deletion"
  | "Palace Outcast";

export interface ExilePreset {
  id: string;
  category: ExilePresetCategory;
  vibe: string;
  exileTitle: string;
  lexicalTokens: {
    signatureVerbs: string[];
    desolateAdjectives: string[];
    isolationNouns: string[];
    syntaxPacing: string;
  };
  triggerKeys: string[];
  sampleProseSnippet: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledExilePresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const EXILE_PRESETS = Object.freeze([
  {
    id: "exile_geographical_banishment",
    category: "Geographical Banishment",
    vibe: "The Wasteland Maverick / Wild West Outlaw / Frontier Survivor",
    exileTitle: "The Borderland Banishment",
    lexicalTokens: {
      signatureVerbs: ["drift", "scavenge", "weather", "endure", "shrug", "slap", "scuff", "slouch"],
      desolateAdjectives: ["sun-baked", "dust-coated", "rugged", "leathery", "lawless", "bleak", "barren"],
      isolationNouns: ["frontier", "duster", "horizon", "grey-market", "outpost", "canvas", "dust"],
      syntaxPacing:
        "Economical, staccato syntax may surface around clean, official, or high-status spaces. Clipped speech and exit-route awareness can mark old banishment pressure when relevant.",
    },
    triggerKeys: ["banishment", "frontier", "wasteland", "outlaw", "colony", "dust", "exile", "border"],
    sampleProseSnippet:
      "He slouched against the canvas instead of checking the terminal, dust-coated duster snapping in the wind while his hand traced the scuffed holster line.",
    systemPromptTags: ["geographical exile texture", "frontier survival diction", "borderland suspicion", "laconic outcast pacing"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-950", accentColor: "text-orange-400" },
  },
  {
    id: "exile_social_excommunication",
    category: "Social Excommunication",
    vibe: "The Outcast Beast / Ruined Scholar / Haunted Medium",
    exileTitle: "The Branded Social Death",
    lexicalTokens: {
      signatureVerbs: ["recoil", "flinch", "hide", "shun", "wither", "taint", "poison", "grovel"],
      desolateAdjectives: ["grotesque", "tainted", "touch-starved", "ashamed", "unclean", "monstrous", "hollow"],
      isolationNouns: ["perimeter", "abomination", "veil", "shame", "stigma", "shadow-line", "seclusion"],
      syntaxPacing:
        "Decelerated, whisper-heavy phrasing may surface when sudden closeness challenges the old stigma. Hesitation, self-correction, and slow retreats can appear without denying player agency.",
    },
    triggerKeys: ["heretic", "shunned", "brand", "excommunication", "curse", "beast", "abomination", "stigma"],
    sampleProseSnippet:
      "He pulled back into the room's shadow-line, touch-starved hand trembling as he forced himself away from her gentle approach.",
    systemPromptTags: ["social excommunication texture", "touch-starved distance", "stigma vocabulary", "shame-bound perimeter"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-black", accentColor: "text-fuchsia-500" },
  },
  {
    id: "exile_systemic_deletion",
    category: "Systemic Deletion",
    vibe: "The Rogue Android / Netrunner / Escaped Asset",
    exileTitle: "The Deleted Network Ghost",
    lexicalTokens: {
      signatureVerbs: ["glitch", "wipe", "sanitise", "purge", "scramble", "intercept", "override", "flee"],
      desolateAdjectives: ["sterile", "unvetted", "flickering", "covert", "analytical", "synthetic", "matte"],
      isolationNouns: ["matrix", "baseline", "anomaly", "firmware", "kill-switch", "dead-zone", "blackout"],
      syntaxPacing:
        "Erratic, diagnostic clause distribution may surface around cameras, scans, telemetry, or public databases. Status-prefixed speech can mark threat assessment without replacing the character's whole voice.",
    },
    triggerKeys: ["scrubbed", "telemetry", "firmware", "glitch", "unvetted", "purged", "netrunner", "database"],
    sampleProseSnippet:
      "Data log alert: surveillance active. Sanitising local telemetry, they watched the terminal blackout ripple across the sector map.",
    systemPromptTags: ["systemic deletion texture", "network ghost vocabulary", "telemetry paranoia", "diagnostic exile pacing"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-300" },
  },
  {
    id: "exile_palace_outcast",
    category: "Palace Outcast",
    vibe: "The Resigned Ward / Disgraced Noble / Forced Alliance",
    exileTitle: "The Northern Court Exile",
    lexicalTokens: {
      signatureVerbs: ["comply", "endure", "escort", "repress", "stiffen", "observe", "negotiate", "sign"],
      desolateAdjectives: ["stilted", "formal", "resigned", "bloodless", "pristine", "unsmiling", "ancestral"],
      isolationNouns: ["treaty", "obligation", "script", "facade", "decorum", "exile", "courtly"],
      syntaxPacing:
        "Regulated, high-register syntax may surface around court pressure, family leverage, or hostile estates. Longer formal sentences can track contained strategy and political displacement.",
    },
    triggerKeys: ["nobility", "treaty", "court", "ward", "silk", "handkerchief", "resignation", "palace"],
    sampleProseSnippet:
      "She offered her pristine, gloved arm across the freezing court, every stilted word obeying the decorum demanded by the treaty.",
    systemPromptTags: ["palace outcast texture", "courtly exile vocabulary", "formal displacement", "political pawn containment"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-sky-400" },
  },
] satisfies readonly ExilePreset[]);

export const EXILE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(EXILE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findExilePresetById(id: string): ExilePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return EXILE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getExilePresetsByCategory(category: string): ExilePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return EXILE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileExilePresetAdditions(
  preset: ExilePreset,
): CompiledExilePresetAdditions {
  return {
    backgroundAddition: compileExilePresetSummary(preset),
    personalityAddition: [
      `Exile behaviour texture: ${preset.vibe}.`,
      `Exile title: ${preset.exileTitle}.`,
      `Isolation anchors: ${preset.lexicalTokens.isolationNouns.join(", ")}.`,
      `Trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
    ].join(" "),
    systemPromptAddition: [
      `Exile guidance: ${preset.exileTitle}.`,
      "Use this as soft displacement guidance that may surface when relevant; do not override player agency, and avoid reducing the character to exile-only behaviour.",
      `Displacement language: ${preset.lexicalTokens.signatureVerbs.join(", ")}; ${preset.lexicalTokens.desolateAdjectives.join(", ")}.`,
      `Pacing guidance: ${preset.lexicalTokens.syntaxPacing}`,
    ].join(" "),
  };
}

export function compileExilePresetSummary(preset: ExilePreset): string {
  return [
    `Exile preset: ${preset.vibe}.`,
    `Exile title: ${preset.exileTitle}.`,
    `Signature verbs: ${preset.lexicalTokens.signatureVerbs.join(", ")}.`,
    `Desolate descriptors: ${preset.lexicalTokens.desolateAdjectives.join(", ")}.`,
    `Isolation nouns: ${preset.lexicalTokens.isolationNouns.join(", ")}.`,
    `Syntax pacing: ${preset.lexicalTokens.syntaxPacing}`,
    `Reference line: ${preset.sampleProseSnippet}`,
  ].join("\n");
}
