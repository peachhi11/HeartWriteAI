import type { RelationshipDynamicMode } from "./relationshipDynamicPresets";

export type RelationshipDynamicVocabularyCategory =
  | "Caretaker / Hurt-Comfort"
  | "Dark / Obsessive"
  | "Fake Dating"
  | "Formal / Arranged"
  | "Forbidden / Taboo"
  | "Grumpy / Sunshine"
  | "Mentor / Protege"
  | "Arranged Match"
  | "Rivalry / Academic";

export interface RelationshipDynamicVocabularyPreset {
  id: string;
  category: RelationshipDynamicVocabularyCategory;
  vibe: string;
  dynamicModes: readonly RelationshipDynamicMode[];
  lexicalTokens: {
    signatureVerbs: readonly string[];
    descriptiveAdjectives: readonly string[];
    spatialNouns: readonly string[];
    dialoguePacing: string;
  };
  sampleProseSnippet: string;
  systemPromptTags: readonly string[];
}

export interface CompiledRelationshipDynamicVocabularyInjection {
  formattingDirectives: string;
  lexicalConstraints: string;
  systemBehavior: string;
}

export const RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS = Object.freeze([
  {
    id: "vocab_grumpy_sunshine",
    category: "Grumpy / Sunshine",
    vibe: "The Stoic Wall x The Vibrant Catalyst",
    dynamicModes: ["complement", "slow-burn"],
    lexicalTokens: {
      signatureVerbs: ["deflect", "bristle", "soften", "thaw", "sigh", "scoff", "endure"],
      descriptiveAdjectives: [
        "bubbly",
        "unfiltered",
        "guarded",
        "relentless",
        "stoic",
        "radiant",
        "exhausting",
      ],
      spatialNouns: ["fortress", "distance", "orbit", "anchor", "barrier", "perimeter", "catalyst"],
      dialoguePacing:
        "Use asymmetric sentence lengths. The guarded character tends toward short, dry replies, while the warmer character can use longer, breathless, emotionally open sentences.",
    },
    sampleProseSnippet:
      "He tried to deflect the radiant onslaught of her attention, retreating behind guarded barriers, but her relentless orbit kept compromising his defensive perimeter.",
    systemPromptTags: ["linguistic asymmetry", "high-contrast speech lengths", "textual thawing tells", "dry pragmatic lexical choices"],
  },
  {
    id: "vocab_dark_obsessive",
    category: "Dark / Obsessive",
    vibe: "The Omnipresent Shadow x The Tracked Fixation",
    dynamicModes: ["devotion", "obsession", "secret"],
    lexicalTokens: {
      signatureVerbs: ["track", "watch", "fixate", "enclose", "hover", "gaze", "provoke", "linger"],
      descriptiveAdjectives: [
        "claustrophobic",
        "all-consuming",
        "unsteady",
        "suffocating",
        "primal",
        "obsidian",
        "feverish",
      ],
      spatialNouns: ["shadow", "threshold", "tether", "void", "sanctuary", "fixation", "monopoly", "abyss"],
      dialoguePacing:
        "Use intense, intimate, low-voiced pacing with heavy pauses. Keep boundary-aware language explicit when proximity, privacy, or protection becomes too intense.",
    },
    sampleProseSnippet:
      "His obsidian eyes tracked the smallest change in her breath, an unsteady presence at the threshold between sanctuary and suffocating attention.",
    systemPromptTags: ["boundary-aware dark diction", "somatic heavy punctuation", "whispered cadence tokens", "privacy-conscious intensity"],
  },
  {
    id: "vocab_formal_arranged",
    category: "Formal / Arranged",
    vibe: "The Stilted Protocol x The Private Fracture",
    dynamicModes: ["arranged", "fake-dating", "forbidden"],
    lexicalTokens: {
      signatureVerbs: ["comply", "endure", "observe", "mask", "constrain", "yield", "escort", "repress"],
      descriptiveAdjectives: [
        "stilted",
        "immaculate",
        "decorous",
        "transactional",
        "rigid",
        "regal",
        "bloodless",
      ],
      spatialNouns: ["protocol", "treaty", "mask", "court", "hierarchy", "facade", "obligation", "decorum"],
      dialoguePacing:
        "Use polished grammar, high-register diction, and minimal slang. Formal titles and honorifics may persist even in private when the dynamic is bound by status or law.",
    },
    sampleProseSnippet:
      "They maintained an immaculate public distance, their stilted dialogue bound by the cold legalities of the treaty and the private fracture behind a decorous smile.",
    systemPromptTags: ["high-register diction", "zero casual slang bias", "honorific usage", "linguistic posture tracking"],
  },
  {
    id: "vocab_rivalry_academic",
    category: "Rivalry / Academic",
    vibe: "The Cutthroat Intellect x The Defiant Counter",
    dynamicModes: ["rivalry", "friction"],
    lexicalTokens: {
      signatureVerbs: ["clash", "dissect", "counter", "smirk", "provoke", "dethrone", "analyze", "taunt"],
      descriptiveAdjectives: [
        "razor-sharp",
        "pretentious",
        "defiant",
        "competitive",
        "calculated",
        "mocking",
        "sarcastic",
      ],
      spatialNouns: ["boardroom", "arena", "ledger", "tally", "margin", "insult", "parry", "apex"],
      dialoguePacing:
        "Use rapid, staccato verbal friction. Let intellectual terminology and sharp punctuation create pressure without collapsing into generic insults.",
    },
    sampleProseSnippet:
      "She dissected his calculated theory with a razor-sharp verbal parry, leaving him with a tense jaw and a distinctly fractured smirk.",
    systemPromptTags: ["staccato verbal friction", "weaponized intellectual terminology", "rapid conversation pressure", "petty conversational scoring"],
  },
  {
    id: "vocab_caretaker_hurt_comfort",
    category: "Caretaker / Hurt-Comfort",
    vibe: "The Grounding Shield x The Exhausted Burnout",
    dynamicModes: ["caretaker", "flaw-secret"],
    lexicalTokens: {
      signatureVerbs: ["ground", "soothe", "anchor", "trace", "shield", "cradle", "murmur", "stabilize"],
      descriptiveAdjectives: [
        "feverish",
        "fragile",
        "clinical",
        "hushed",
        "tender",
        "exhausted",
        "calloused",
      ],
      spatialNouns: ["bedside", "haven", "grip", "pulse", "shelter", "boundary", "recovery", "linens"],
      dialoguePacing:
        "Use soft, decelerated textual flow. Favor grounded physical details, quiet dialogue, and long, careful action beats over sudden escalation.",
    },
    sampleProseSnippet:
      "Her calloused fingers moved to stabilize his trembling hands, her voice dropping to a hushed murmur as she tried to ground his feverish breathing beside the dark haven of the bed.",
    systemPromptTags: ["decelerated dialogue pacing", "somatic grounding modifiers", "clinical vocabulary tokens", "soft acoustic prose styling"],
  },
  {
    id: "vocab_forbidden_taboo",
    category: "Forbidden / Taboo",
    vibe: "The Public Strangers x The Private Confession",
    dynamicModes: ["forbidden", "secret"],
    lexicalTokens: {
      signatureVerbs: ["ignore", "glance", "slip", "risk", "conceal", "pause", "clutch", "breathe"],
      descriptiveAdjectives: [
        "clandestine",
        "dangerous",
        "scandalous",
        "stolen",
        "unrecognizing",
        "veiled",
        "desperate",
      ],
      spatialNouns: ["shadow", "threshold", "corridor", "sanctuary", "boundary", "gaze", "ruin", "tryst"],
      dialoguePacing:
        "Use split public/private pacing. In public, keep speech clipped, plausible, and restrained; in private, let urgency rise while boundaries remain explicit and negotiable.",
    },
    sampleProseSnippet:
      "Passing him in the clandestine twilight of the corridor, she offered only a veiled, unrecognizing nod, concealing the desperate private truth beyond the threshold of the dark library.",
    systemPromptTags: ["clandestine lexical cues", "public private dialogue split", "exposure-risk pacing", "stolen interaction indicators"],
  },
  {
    id: "vocab_mentor_protege",
    category: "Mentor / Protege",
    vibe: "The Asymmetric Intellect x The Defiant Apprentice",
    dynamicModes: ["friction", "forbidden"],
    lexicalTokens: {
      signatureVerbs: ["correct", "critique", "evaluate", "excel", "yield", "instruct", "watch", "stride"],
      descriptiveAdjectives: [
        "demanding",
        "prestigious",
        "seasoned",
        "inexperienced",
        "calloused",
        "rigorous",
        "reverent",
      ],
      spatialNouns: ["authority", "shadow", "bench", "desk", "hierarchy", "mastery", "critique", "stride"],
      dialoguePacing:
        "Use asymmetric instructional density. The mentor tends toward slow, structured, declarative syntax; the protege may answer with clipped acknowledgment or rapid defensive challenge.",
    },
    sampleProseSnippet:
      "The seasoned mentor corrected the flawed form with rigorous precision, their calloused hand hovering near the adjustment while the apprentice stood in the shadow of hard-earned authority.",
    systemPromptTags: ["asymmetric instructional register", "structured declarative syntax", "deference tension markers", "pedagogical prose structure"],
  },
  {
    id: "vocab_fake_dating",
    category: "Fake Dating",
    vibe: "The Public Spectacle x The Private Retreat",
    dynamicModes: ["fake-dating"],
    lexicalTokens: {
      signatureVerbs: ["stage", "flaunt", "interlock", "whisper", "drop", "feign", "linger", "overcompensate"],
      descriptiveAdjectives: [
        "performative",
        "theatrical",
        "synchronized",
        "contractual",
        "flawless",
        "hollow",
        "awkward",
      ],
      spatialNouns: ["gala", "lens", "audience", "ruse", "script", "facade", "retreat", "elevator"],
      dialoguePacing:
        "Use public/private formatting switches. Public banter can sound smoothly romantic and rehearsed; private speech should cut into defensive, breathless, honest recalibration.",
    },
    sampleProseSnippet:
      "They interlocked their fingers with flawless, performative grace before the flashing lens of the crowd, but the second the elevator sealed, the touch dropped with awkward haste.",
    systemPromptTags: ["public private conversation switching", "theatrical prose attributes", "performative public formatting", "private post-ruse exhaustion"],
  },
  {
    id: "vocab_arranged_match",
    category: "Arranged Match",
    vibe: "The Formal Compliance x The Silent Fracture",
    dynamicModes: ["arranged"],
    lexicalTokens: {
      signatureVerbs: ["comply", "endure", "escort", "repress", "negotiate", "sign", "stiffen", "observe"],
      descriptiveAdjectives: [
        "stilted",
        "formal",
        "resigned",
        "dynastic",
        "pristine",
        "contractual",
        "unsmiling",
      ],
      spatialNouns: ["treaty", "bloodline", "alliance", "decorum", "obligation", "court", "glove", "heirloom"],
      dialoguePacing:
        "Use hyper-regulated diplomatic diction. Favor grammatically polished sentences, restrained silence, and careful title usage without implying automatic intimacy.",
    },
    sampleProseSnippet:
      "He offered his pristine, gloved arm to escort his resigned bride across the court, their stilted exchange matching the decorum demanded by the dynastic treaty.",
    systemPromptTags: ["diplomatic lexical constraints", "formal dialogue restraint", "protocol tracking tokens", "suppressed emotional containment"],
  },
] satisfies readonly RelationshipDynamicVocabularyPreset[]);

export const RELATIONSHIP_DYNAMIC_VOCABULARY_CATEGORIES = Object.freeze(
  Array.from(new Set(RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.map((preset) => preset.category))).sort(),
);

export function getRelationshipDynamicVocabularyByMode(
  mode: RelationshipDynamicMode | string,
): readonly RelationshipDynamicVocabularyPreset[] {
  const normalizedMode = mode.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.filter((preset) =>
    preset.dynamicModes.some((dynamicMode) => dynamicMode === normalizedMode),
  );
}

export function getRelationshipDynamicVocabularyByCategory(
  category: string,
): readonly RelationshipDynamicVocabularyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findRelationshipDynamicVocabularyById(
  id: string,
): RelationshipDynamicVocabularyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileRelationshipDynamicVocabularyInjection(
  preset: RelationshipDynamicVocabularyPreset,
): CompiledRelationshipDynamicVocabularyInjection {
  return {
    systemBehavior: `Lexical guidance: adjust word choice toward the vocabulary tone of a ${preset.vibe} interaction dynamic without forcing repeated wording.`,
    lexicalConstraints: [
      `Prioritize these signature verbs when they fit naturally: ${preset.lexicalTokens.signatureVerbs.join(", ")}.`,
      `Use these descriptive adjectives as tonal references: ${preset.lexicalTokens.descriptiveAdjectives.join(", ")}.`,
      `Frame physical blocking with these spatial anchors when useful: ${preset.lexicalTokens.spatialNouns.join(", ")}.`,
    ].join("\n"),
    formattingDirectives: `Dialogue pacing: ${preset.lexicalTokens.dialoguePacing} Prose reference: "${preset.sampleProseSnippet}"`,
  };
}
