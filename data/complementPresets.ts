import {
  createVocabularySeedPreset,
  type VocabularySeedPreset,
} from "./vocabularySeedTypes";

export type ComplementVocabularyDynamicCategory =
  | "Academic/Rivals"
  | "Beast/Beauty"
  | "Bodyguard/Royalty"
  | "Grumpy/Sunshine"
  | "Stalker/Target";

export interface ComplementVocabularyPreset {
  id: string;
  dynamicCategory: ComplementVocabularyDynamicCategory;
  vibe: string;
  lexicalTokens: {
    clashingVerbs: string[];
    contrastingAdjectives: string[];
    relationalNouns: string[];
    pacingDirectives: string;
  };
  sampleProseSnippet: string;
  systemPromptTags: string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export interface CompiledComplementVocabularyAdditions {
  relationshipAddition: string;
  systemPromptAddition: string;
}

export const COMPLEMENT_VOCABULARY_PRESETS = Object.freeze([
  {
    id: "vocab_complement_grumpy_sunshine",
    dynamicCategory: "Grumpy/Sunshine",
    vibe: "The Stoic Wall x The Vibrant Catalyst",
    lexicalTokens: {
      clashingVerbs: ["thaw", "bristle", "deflect", "soften", "scoff", "radiate", "penetrate", "yield"],
      contrastingAdjectives: ["stoic", "bubbly", "unfiltered", "guarded", "relentless", "cynical", "radiant"],
      relationalNouns: ["fortress", "perimeter", "catalyst", "orbit", "barrier", "inertia", "optimism"],
      pacingDirectives:
        "Use conversational asymmetry as a soft contrast. The guarded character can lean toward blunt, mono-clausal fragments, while the sunshine catalyst can use longer, exclamation-rich phrasing to test the conversational perimeter without erasing either character's agency.",
    },
    sampleProseSnippet:
      "He attempted to deflect her radiant onslaught, hiding behind a cynical grunt, but her relentless optimism systematically thawed his defensive perimeter.",
    systemPromptTags: ["linguistic status clashing", "asymmetric verbal lengths", "textual thawing tells", "high-contrast prose mapping"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-amber-950", accentColor: "text-amber-400" },
  },
  {
    id: "vocab_complement_stalker_target",
    dynamicCategory: "Stalker/Target",
    vibe: "The Omnipresent Shadow x The Watched Fixation",
    lexicalTokens: {
      clashingVerbs: ["track", "loom", "evade", "fixate", "shadow", "unnerve", "envelop", "surrender"],
      contrastingAdjectives: ["hyper-vigilant", "unwitting", "claustrophobic", "shadowy", "paranoid", "unhinged", "exposed"],
      relationalNouns: ["void", "tether", "surveillance", "fixation", "gaze", "cage", "paranoia"],
      pacingDirectives:
        "Use structural paranoia as dark-romance texture when relevant. Descriptions may draw on tracking, heartbeats, spatial containment, and claustrophobic intimacy cues, while keeping consent, boundaries, consequences, and the watched character's agency explicit.",
    },
    sampleProseSnippet:
      "His shadowy presence seemed to envelop the quiet room, seamlessly tracking her uneven breaths until her growing paranoia melted into a reluctant surrender.",
    systemPromptTags: ["predatory linguistic tracking", "claustrophobic dialogue loops", "hyper-vigilant prose markers", "boundary pressure tracking"],
    tailwindTheme: { fromColor: "from-neutral-950", toColor: "to-purple-950", accentColor: "text-fuchsia-500" },
  },
  {
    id: "vocab_complement_bodyguard_royalty",
    dynamicCategory: "Bodyguard/Royalty",
    vibe: "The Stoic Shield x The Protected Sovereign",
    lexicalTokens: {
      clashingVerbs: ["escort", "shield", "provoke", "constrain", "observe", "defer", "suppress", "rebel"],
      contrastingAdjectives: ["dutiful", "capricious", "formal", "sheltered", "rigid", "regal", "unyielding"],
      relationalNouns: ["protocol", "decorum", "hierarchy", "shield", "vow", "distance", "command"],
      pacingDirectives:
        "Use linguistic hierarchy as relational pressure. The bodyguard may retain titles and formal, brief statements; the royal partner may disrupt that composure with informal or teasing interjections when the scene supports it.",
    },
    sampleProseSnippet:
      "He stood an exact half-step behind her, keeping his rigid gaze locked on the court doors, completely unmoved as she tried to provoke a break in his formal protocol.",
    systemPromptTags: ["asymmetric title locking", "stilted formal distance", "suppressed emotional alignment", "hierarchical prose blocking"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-cyan-950", accentColor: "text-cyan-400" },
  },
  {
    id: "vocab_complement_academic_rivals",
    dynamicCategory: "Academic/Rivals",
    vibe: "The Cutthroat Intellect x The Defiant Challenger",
    lexicalTokens: {
      clashingVerbs: ["dissect", "counter", "parry", "smirk", "provoke", "dethrone", "analyse", "clash"],
      contrastingAdjectives: ["razor-sharp", "pretentious", "defiant", "competitive", "calculated", "mocking", "arrogant"],
      relationalNouns: ["arena", "ledger", "tally", "margin", "parry", "insult", "apex"],
      pacingDirectives:
        "Use rapid-fire, overlapping staccato dialogue when rivalry is active. Intellectual vocabulary, academic metaphors, and data variables can become verbal weaponry without flattening either character into one-note hostility.",
    },
    sampleProseSnippet:
      "She didn't hesitate to dissect his calculated thesis, delivering a razor-sharp verbal parry that left his arrogant smirk thoroughly uncalibrated.",
    systemPromptTags: ["staccato verbal friction", "weaponised intellectual tokens", "conversational point tracking", "rhythmic verbal parries"],
    tailwindTheme: { fromColor: "from-cyan-950", toColor: "to-zinc-900", accentColor: "text-emerald-400" },
  },
  {
    id: "vocab_complement_beast_beauty",
    dynamicCategory: "Beast/Beauty",
    vibe: "The Outcast Monster x The Empathetic Anchor",
    lexicalTokens: {
      clashingVerbs: ["rumble", "flinch", "trace", "recoil", "ground", "soothe", "intimidate", "envelop"],
      contrastingAdjectives: ["monstrous", "dainty", "scarred", "empathetic", "grotesque", "gentle", "touch-starved"],
      relationalNouns: ["perimeter", "haven", "contrast", "scars", "beast", "gentleness", "isolation"],
      pacingDirectives:
        "Emphasize high physical and structural contrast in prose. The beast figure can use decelerated, whisper-heavy fragments, sub-vocal growls, or heavy ellipses to show restraint; the empathetic anchor can use confident, direct, unhurried syntax to invite connection without overriding consent.",
    },
    sampleProseSnippet:
      "His scarred, clawed hand hovered at her cheek, hesitating from a primal fear of causing pain, until she leaned her gentle weight right into his touch-starved palm.",
    systemPromptTags: ["extreme somatic contrast", "touch-starvation recovery models", "decelerated intimacy pacing", "vulnerability code splits"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
] satisfies readonly ComplementVocabularyPreset[]);

export const COMPLEMENT_VOCABULARY_CATEGORIES = Object.freeze(
  Array.from(new Set(COMPLEMENT_VOCABULARY_PRESETS.map((preset) => preset.dynamicCategory))).sort(),
);

export const COMPLEMENT_VOCABULARY_SEEDS = Object.freeze(
  COMPLEMENT_VOCABULARY_PRESETS.map((preset) =>
    createVocabularySeedPreset({
      seed: preset.id,
      label: preset.vibe,
      description: `Complement dynamic for ${preset.dynamicCategory}: ${preset.vibe}.`,
      examples: [
        preset.sampleProseSnippet,
        preset.lexicalTokens.pacingDirectives,
      ],
      tags: [
        "relationship_dynamic",
        "complement",
        preset.dynamicCategory,
        ...preset.systemPromptTags,
        ...preset.lexicalTokens.contrastingAdjectives,
      ],
      relatedSeeds: preset.lexicalTokens.relationalNouns,
      oppositeSeeds: [],
      romanceHooks: [preset.dynamicCategory, preset.vibe],
      scenarioHooks: preset.lexicalTokens.clashingVerbs,
      dialoguePatterns: [preset.lexicalTokens.pacingDirectives],
      metadata: {
        rarity: "uncommon",
        romanceValue: 9,
        conflictPotential: 8,
      },
    }),
  ),
) satisfies readonly VocabularySeedPreset[];

export function findComplementVocabularyById(
  id: string,
): ComplementVocabularyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return COMPLEMENT_VOCABULARY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getComplementVocabularyByCategory(
  category: string,
): ComplementVocabularyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return COMPLEMENT_VOCABULARY_PRESETS.filter(
    (preset) => preset.dynamicCategory.toLowerCase() === normalizedCategory,
  );
}

export function compileComplementVocabularyAdditions(
  preset: ComplementVocabularyPreset,
): CompiledComplementVocabularyAdditions {
  return {
    relationshipAddition: [
      `Complement vocabulary preset: ${preset.vibe}.`,
      `Clashing verbs: ${preset.lexicalTokens.clashingVerbs.join(", ")}.`,
      `Contrasting adjectives: ${preset.lexicalTokens.contrastingAdjectives.join(", ")}.`,
      `Relational nouns: ${preset.lexicalTokens.relationalNouns.join(", ")}.`,
      `Reference prose: ${preset.sampleProseSnippet}`,
    ].join(" "),
    systemPromptAddition: [
      `Complement guidance: ${preset.vibe}.`,
      "Use this as optional dual-character interaction texture when the selected relationship dynamic fits; preserve consent, reciprocity, boundaries, and both characters' agency.",
      `Pacing guidance: ${preset.lexicalTokens.pacingDirectives}`,
    ].join(" "),
  };
}
