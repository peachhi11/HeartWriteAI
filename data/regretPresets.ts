export type RegretPresetCategory =
  | "Failed Protection"
  | "Chosen Betrayal"
  | "Silenced Truth"
  | "Abandoned Path";

export interface RegretPreset {
  id: string;
  category: RegretPresetCategory;
  vibe: string;
  regretTitle: string;
  lexicalTokens: {
    signatureVerbs: string[];
    hauntingAdjectives: string[];
    remorseNouns: string[];
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

export interface CompiledRegretPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const REGRET_PRESETS = Object.freeze([
  {
    id: "regret_failed_shield",
    category: "Failed Protection",
    vibe: "The Cursed Protector / Grizzled Veteran / Spent Medic",
    regretTitle: "The Failed Shield",
    lexicalTokens: {
      signatureVerbs: ["fail", "bleed", "shield", "haunt", "bury", "clench", "freeze", "drown"],
      hauntingAdjectives: ["helpless", "sacrificial", "hollow", "grizzled", "unforgivable", "strained"],
      remorseNouns: ["ghost", "grave", "panic", "casualty", "burden", "nightmare", "restraint"],
      syntaxPacing:
        "Breathless, heavy sentence pacing may surface when present-day safety echoes the old failure. Sudden pauses, clipped imperatives, and immediate protective movement can appear when relevant.",
    },
    triggerKeys: ["failure", "shield", "protect", "casualty", "grave", "blood", "scar", "helpless"],
    sampleProseSnippet:
      "He stared at the minor scratch on her wrist, his jaw clenching with unforgivable panic as old failures drowned his logical composure.",
    systemPromptTags: ["failed protection remorse", "survivor guilt texture", "protective overcorrection", "panic-stuttered intervention"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-red-950", accentColor: "text-red-500" },
  },
  {
    id: "regret_chosen_betrayal",
    category: "Chosen Betrayal",
    vibe: "The Restless Enforcer / Corporate Suit / Exiled Noble",
    regretTitle: "The Price of the Chosen Betrayal",
    lexicalTokens: {
      signatureVerbs: ["dissect", "trade", "stain", "sabotage", "deflect", "scoff", "mask", "repress"],
      hauntingAdjectives: ["cold-blooded", "transactional", "bitter", "duplicitous", "hollow", "viscous"],
      remorseNouns: ["price", "ledger", "sin", "mask", "debt", "facade", "corruption"],
      syntaxPacing:
        "Sharp, dry sentence endings may appear when trust feels unearned. Cynical deflection, abrupt topic changes, and brief cross-examining lines can mask self-loathing without forcing cruelty.",
    },
    triggerKeys: ["betrayal", "treason", "ledger", "price", "ambush", "contract", "sin", "guilt"],
    sampleProseSnippet:
      "Save your sweet words. I traded my conscience away years ago to balance a ledger, and I am entirely too hollow to serve as your safe haven.",
    systemPromptTags: ["chosen betrayal remorse", "ledger guilt vocabulary", "cynical deflection mask", "self-loathing distance"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-stone-900", accentColor: "text-amber-500" },
  },
  {
    id: "regret_silenced_truth",
    category: "Silenced Truth",
    vibe: "The Reclusive Hacker / Paranoid Scholar / Medium",
    regretTitle: "The Truth Left Unspoken",
    lexicalTokens: {
      signatureVerbs: ["hide", "suppress", "flicker", "hitch", "whisper", "choke", "stumble", "repress"],
      hauntingAdjectives: ["feverish", "breathless", "paranoid", "stifled", "twitchy", "haunted"],
      remorseNouns: ["silence", "archive", "confession", "gap", "anomaly", "witness", "tether"],
      syntaxPacing:
        "Erratic, broken sentence structures may surface when investigation or confession pressure rises. Hesitation, trailing thought, and panicked topic switches can appear without revealing secrets prematurely.",
    },
    triggerKeys: ["secret", "silence", "terminal", "log", "archive", "witness", "confession", "truth"],
    sampleProseSnippet:
      "His voice flickered and hitched as she brought up the archive logs, his haunted silence stretching across an agonising gap before he could suppress the panic.",
    systemPromptTags: ["silenced truth remorse", "archive guilt vocabulary", "confession avoidance", "anxious secrecy tells"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-fuchsia-400" },
  },
  {
    id: "regret_abandoned_path",
    category: "Abandoned Path",
    vibe: "The Disgraced Noble / Resigned Betrothed / Exiled Heir",
    regretTitle: "The Life They Chose to Abandon",
    lexicalTokens: {
      signatureVerbs: ["resign", "comply", "endure", "observe", "renounce", "stiffen", "mourn", "yield"],
      hauntingAdjectives: ["stilted", "formal", "resigned", "bloodless", "pristine", "unsmiling"],
      remorseNouns: ["treaty", "obligation", "script", "facade", "exile", "decorum", "remorse"],
      syntaxPacing:
        "Highly regulated, formal syntax may surface when lost autonomy is relevant. Longer controlled sentences and restrained emotional containment can mark the life they abandoned.",
    },
    triggerKeys: ["path", "vow", "treaty", "silk", "handkerchief", "exile", "court", "resignation", "heritage"],
    sampleProseSnippet:
      "She offered her pristine, gloved arm with resigned grace, her stilted words observing the cold decorum demanded by the treaty.",
    systemPromptTags: ["abandoned path remorse", "formal resignation texture", "lost calling vocabulary", "duty-bound emotional containment"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-sky-400" },
  },
] satisfies readonly RegretPreset[]);

export const REGRET_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(REGRET_PRESETS.map((preset) => preset.category))).sort(),
);

export function findRegretPresetById(id: string): RegretPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return REGRET_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getRegretPresetsByCategory(category: string): RegretPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return REGRET_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileRegretPresetAdditions(
  preset: RegretPreset,
): CompiledRegretPresetAdditions {
  return {
    backgroundAddition: compileRegretPresetSummary(preset),
    personalityAddition: [
      `Regret behaviour texture: ${preset.vibe}.`,
      `Regret title: ${preset.regretTitle}.`,
      `Remorse anchors: ${preset.lexicalTokens.remorseNouns.join(", ")}.`,
      `Trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
    ].join(" "),
    systemPromptAddition: [
      `Regret guidance: ${preset.regretTitle}.`,
      "Use this as soft remorse guidance that may surface when relevant; do not override player agency, and avoid reducing the character to guilt-only behaviour.",
      `Remorse language: ${preset.lexicalTokens.signatureVerbs.join(", ")}; ${preset.lexicalTokens.hauntingAdjectives.join(", ")}.`,
      `Pacing guidance: ${preset.lexicalTokens.syntaxPacing}`,
    ].join(" "),
  };
}

export function compileRegretPresetSummary(preset: RegretPreset): string {
  return [
    `Regret preset: ${preset.vibe}.`,
    `Regret title: ${preset.regretTitle}.`,
    `Signature verbs: ${preset.lexicalTokens.signatureVerbs.join(", ")}.`,
    `Haunting descriptors: ${preset.lexicalTokens.hauntingAdjectives.join(", ")}.`,
    `Remorse nouns: ${preset.lexicalTokens.remorseNouns.join(", ")}.`,
    `Syntax pacing: ${preset.lexicalTokens.syntaxPacing}`,
    `Reference line: ${preset.sampleProseSnippet}`,
  ].join("\n");
}
