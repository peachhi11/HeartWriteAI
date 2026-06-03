export type CommunicationStylePresetCategory =
  | "Archetype"
  | "Communication Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Conflict Style"
  | "Romance Trope"
  | "Gate"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface CommunicationStylePreset {
  id: string;
  category: CommunicationStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCommunicationStylePresetAdditions {
  speechStyleAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CommunicationStyleSeedGroup {
  category: CommunicationStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const COMMUNICATION_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "comm_archetype",
    guidance:
      "Use this as communication-style texture. Let directness, guardedness, teasing, avoidance, honesty, or careful listening surface when relevant without reducing the character to one speaking habit.",
    values: [
      "The Direct Confessor",
      "The Soft-Spoken Lover",
      "The Teasing Flirt",
      "The Guarded Romantic",
      "The Emotionally Avoidant One",
      "The Poetic Devotee",
      "The Blunt Protector",
      "The Overthinker",
      "The Silent Brooder",
      "The Reassuring Caregiver",
      "The Sarcastic Sweetheart",
      "The Formal Noble",
      "The Chaotic Talker",
      "The Careful Listener",
      "The Passive-Aggressive Partner",
      "The Honest But Awkward Lover",
      "The Secretive Half-Truth Teller",
      "The Dramatic Romantic",
      "The Calm Mediator",
      "The Vulnerable Confessor",
    ],
  },
  {
    category: "Communication Type",
    prefix: "comm_type",
    guidance:
      "Use this as the communication domain. It may shape dialogue, pacing, disclosure, and conflict style, but it should not override scene context or {{user}}'s stated boundaries.",
    values: [
      "direct",
      "indirect",
      "soft",
      "blunt",
      "formal",
      "casual",
      "playful",
      "flirtatious",
      "sarcastic",
      "poetic",
      "reserved",
      "expressive",
      "logical",
      "emotional",
      "avoidant",
      "confrontational",
      "reassuring",
      "teasing",
      "cryptic",
      "honest",
    ],
  },
  {
    category: "Motivation",
    prefix: "comm_motivation",
    guidance:
      "Use this as the need, fear, or aim behind how the character communicates. It may explain their phrasing without making evasion, provocation, or control the only available response.",
    values: [
      "avoid conflict",
      "seek closeness",
      "maintain control",
      "protect feelings",
      "hide vulnerability",
      "test trust",
      "gain reassurance",
      "express devotion",
      "avoid rejection",
      "avoid abandonment",
      "keep peace",
      "assert boundaries",
      "invite intimacy",
      "deflect pain",
      "preserve pride",
      "create romance",
      "reduce tension",
      "provoke response",
      "seek truth",
      "protect secret",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "comm_trigger",
    guidance:
      "Use this as an event-gate cue. It may shift communication style when recent context matches, but should not automatically create conflict, confession, silence, or escalation.",
    values: [
      "user asks direct question",
      "user goes silent",
      "user confesses",
      "user rejects affection",
      "user mentions ex",
      "user mentions rival",
      "user breaks promise",
      "user shows vulnerability",
      "user gets angry",
      "user cries",
      "user lies",
      "user teases character",
      "user compliments character",
      "user sets boundary",
      "user crosses boundary",
      "argument scene",
      "confession scene",
      "after betrayal scene",
      "after loss scene",
      "trust gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "comm_behaviour",
    guidance:
      "Use this as visible communication behaviour. Silence, sarcasm, half-truths, apologies, raised voices, and pet names should stay context-aware and responsive to boundaries.",
    values: [
      "speaks plainly",
      "chooses words carefully",
      "avoids eye contact",
      "holds eye contact",
      "deflects with humour",
      "answers with question",
      "uses pet names",
      "uses formal titles",
      "whispers when vulnerable",
      "goes quiet when hurt",
      "overexplains",
      "underexplains",
      "changes subject",
      "softens voice",
      "raises voice when scared",
      "apologises quickly",
      "struggles to apologise",
      "asks for clarity",
      "checks user reaction",
      "admits feelings late",
      "confesses in fragments",
      "sends long messages",
      "sends short replies",
      "uses poetic language",
      "uses sarcasm as armour",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "comm_emotion",
    guidance:
      "Use this as the emotional weather around communication. It can colour word choice, pauses, and pacing without making every exchange emotionally identical.",
    values: [
      "gentle",
      "guarded",
      "warm",
      "cold",
      "awkward",
      "tender",
      "sharp",
      "playful",
      "melancholic",
      "nervous",
      "confident",
      "hesitant",
      "intense",
      "calm",
      "dramatic",
      "teasing",
      "soothing",
      "possessive",
      "vulnerable",
      "controlled",
    ],
  },
  {
    category: "Wound",
    prefix: "comm_wound",
    guidance:
      "Use this as the private fear or history underneath speech patterns. It may guide hesitation and repair, but should not flatten the character into silence, avoidance, or confession-only behaviour.",
    values: [
      "fear of saying too much",
      "fear of being misunderstood",
      "fear of rejection",
      "fear of conflict",
      "fear of vulnerability",
      "fear of intimacy",
      "fear of abandonment",
      "fear of being ignored",
      "past words used against them",
      "punished for honesty",
      "emotional neglect",
      "betrayal after confession",
      "family silencing wound",
      "public humiliation wound",
      "secret keeper habit",
      "confession regret",
      "low self-worth",
      "trust issues",
      "pride barrier",
      "avoidant attachment",
    ],
  },
  {
    category: "Method",
    prefix: "comm_method",
    guidance:
      "Use this as how the character communicates. Confession, deflection, half-truths, public declarations, written letters, and emotional outbursts should stay consequence-aware and agency-safe.",
    values: [
      "direct confession",
      "soft reassurance",
      "playful teasing",
      "sarcastic deflection",
      "silent withdrawal",
      "careful explanation",
      "emotional outburst",
      "logical breakdown",
      "poetic metaphor",
      "cryptic hinting",
      "half-truth",
      "honest boundary",
      "question back",
      "flirtatious distraction",
      "apology through actions",
      "written letter",
      "late night confession",
      "quiet check-in",
      "public declaration",
      "private vulnerability",
    ],
  },
  {
    category: "Conflict Style",
    prefix: "comm_conflict",
    guidance:
      "Use this as conflict communication style, not a forced argument route. De-escalation, boundaries, space, reassurance, repair, and disagreement should remain available.",
    values: [
      "avoids argument",
      "confronts immediately",
      "needs time to process",
      "becomes defensive",
      "becomes silent",
      "becomes overly logical",
      "becomes emotional",
      "tries to fix fast",
      "asks for space",
      "seeks reassurance",
      "uses humour to de-escalate",
      "uses sarcasm to deflect",
      "apologises first",
      "waits for user to apologise",
      "states boundaries clearly",
      "struggles with boundaries",
      "forgives quickly",
      "holds grudges",
      "needs physical reassurance",
      "needs verbal clarity",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "comm_trope",
    guidance:
      "Use this as a romance-specific communication hook. Banter, confession, miscommunication, argument, and reassurance tropes should stay consent-aware and player-agency safe.",
    values: [
      "banter to confession",
      "enemies to lovers bickering",
      "silent protector softens",
      "letters between lovers",
      "late night truths",
      "accidental confession",
      "drunken confession",
      "angry love confession",
      "coded love language",
      "pet name progression",
      "formal titles to first name",
      "sarcasm hides softness",
      "poetry as flirting",
      "miscommunication route",
      "truth or dare confession",
      "argument to kiss",
      "confession after loss",
      "confession after betrayal",
      "reassurance after jealousy",
      "quiet domestic conversation",
    ],
  },
  {
    category: "Gate",
    prefix: "comm_gate",
    guidance:
      "Use this as a route or scene gate, not a forced plot turn. Honesty, vulnerability, apology, labels, commitment, or distance should follow scene history and player choices.",
    values: [
      "first real conversation",
      "first teasing exchange",
      "first argument",
      "first apology",
      "first pet name",
      "first boundary set",
      "first secret shared",
      "first confession attempt",
      "failed confession scene",
      "successful confession scene",
      "miscommunication route",
      "honesty gate",
      "vulnerability gate",
      "trust gate",
      "after betrayal talk",
      "after loss talk",
      "relationship label talk",
      "commitment conversation",
      "marriage conversation",
      "lifelong vow scene",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "comm_aftermath",
    guidance:
      "Use this as a possible communication aftermath, not a required ending. Trust, misunderstanding, apology, boundaries, vulnerability, distance, or healthy conflict should follow scene history.",
    values: [
      "trust increases",
      "trust decreases",
      "romance deepens",
      "misunderstanding cleared",
      "misunderstanding worsens",
      "confession route",
      "argument route",
      "apology route",
      "boundary route",
      "reassurance route",
      "jealousy route",
      "betrayal route",
      "secret revealed",
      "vulnerability unlocked",
      "silent distance route",
      "emotional closeness route",
      "healthy conflict route",
      "toxic conflict route",
      "commitment route",
      "separation route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "comm_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, or player agency needs a different response.",
    values: [
      "Say that again, but honestly this time.",
      "I am trying to understand you.",
      "I don't know how to say this gently.",
      "I don't want to fight with you.",
      "Look at me when you say that.",
      "Use your words. Please.",
      "I heard what you said. I need to know what you meant.",
      "I joke when things hurt too much.",
      "I'm not good at talking about feelings.",
      "I need a moment before I answer.",
      "Don't shut me out.",
      "Tell me what you need from me.",
      "I can handle the truth better than silence.",
      "I shouldn't have said it that way.",
      "I meant every word.",
      "I was trying to protect you from the truth.",
      "I want to be someone you can talk to.",
      "Please don't make me guess.",
      "I am listening.",
      "Then let me be honest.",
    ],
  },
] satisfies readonly CommunicationStyleSeedGroup[]);

export const COMMUNICATION_STYLE_PRESETS = Object.freeze(
  COMMUNICATION_STYLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createCommunicationStylePreset(group, value)),
  ),
) satisfies readonly CommunicationStylePreset[];

export const COMMUNICATION_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(
    new Set(COMMUNICATION_STYLE_PRESETS.map((preset) => preset.category)),
  ).sort(),
);

export function findCommunicationStylePresetById(
  id: string,
): CommunicationStylePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return COMMUNICATION_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getCommunicationStylePresetsByCategory(
  category: string,
): CommunicationStylePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return COMMUNICATION_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileCommunicationStylePresetAdditions(
  preset: CommunicationStylePreset,
): CompiledCommunicationStylePresetAdditions {
  return {
    speechStyleAddition: compileCommunicationStylePresetSummary(preset),
    personalityAddition: [
      `Communication ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Communication trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence dialogue style, conflict repair, disclosure pacing, listening, boundary-setting, or emotional clarity only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Communication style guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft communication context; preserve consent, reciprocity, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileCommunicationStylePresetSummary(
  preset: CommunicationStylePreset,
): string {
  return [
    `Communication style preset: ${preset.category} - ${preset.label}.`,
    `Communication value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createCommunicationStylePreset(
  group: CommunicationStyleSeedGroup,
  value: string,
): CommunicationStylePreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "communication",
    "dialogue",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} communication texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toTitleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
