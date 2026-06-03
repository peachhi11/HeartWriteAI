export type AffectionPresetCategory =
  | "Archetype"
  | "Affection Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Barrier"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface AffectionPreset {
  id: string;
  category: AffectionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAffectionPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AffectionSeedGroup {
  category: AffectionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const AFFECTION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "affection_archetype",
    guidance:
      "Use this as affection-shaped relationship texture. Let tenderness, care, devotion, softness, or clinginess surface when relevant without reducing the character to affection-only behaviour.",
    values: [
      "The Tender Devotee",
      "The Shy Sweetheart",
      "The Clingy Lover",
      "The Quiet Caregiver",
      "The Grand Romantic",
      "The Protective Partner",
      "The Touch-Starved Beloved",
      "The Playful Flirt",
      "The Loyal Companion",
      "The Gentle Healer",
      "The Worshipful Lover",
      "The Awkward Romantic",
      "The Soft-Spoken Protector",
      "The Affectionate Rival",
      "The Possessive Cuddler",
      "The Love-Bombing Charmer",
      "The Slow-Burn Softie",
      "The Domestic Dreamer",
      "The Secretly Soft One",
      "The Devoted Spouse",
    ],
  },
  {
    category: "Affection Type",
    prefix: "affection_type",
    guidance:
      "Use this as the affection domain. It may shape care, closeness, and romantic warmth, but it should not imply automatic access to {{user}}'s body, feelings, or commitment.",
    values: [
      "physical affection",
      "verbal affection",
      "emotional affection",
      "domestic affection",
      "protective affection",
      "playful affection",
      "devotional affection",
      "possessive affection",
      "shy affection",
      "public affection",
      "private affection",
      "caretaking affection",
      "reassuring affection",
      "teasing affection",
      "comforting affection",
      "romantic affection",
      "subtle affection",
      "intense affection",
      "conditional affection",
      "unconditional affection",
    ],
  },
  {
    category: "Motivation",
    prefix: "affection_motivation",
    guidance:
      "Use this as the need, hope, or feeling behind affection. It may explain warmth without excusing pressure, dependency, manipulation, or disregard for boundaries.",
    values: [
      "love",
      "devotion",
      "comfort",
      "reassurance",
      "gratitude",
      "longing",
      "attraction",
      "protectiveness",
      "attachment",
      "fear of loss",
      "fear of abandonment",
      "desire for closeness",
      "desire to be chosen",
      "desire to heal user",
      "desire to be needed",
      "emotional overflow",
      "domestic longing",
      "romantic idealism",
      "touch starvation",
      "new trust",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "affection_trigger",
    guidance:
      "Use this as an event-gate cue. It may raise affection, care, or comfort when recent context matches, but should not automatically create intimacy or physical contact.",
    values: [
      "user shows vulnerability",
      "user gets hurt",
      "user cries",
      "user smiles",
      "user laughs",
      "user confesses",
      "user compliments character",
      "user defends character",
      "user asks for comfort",
      "user initiates touch",
      "user accepts touch",
      "user rejects touch",
      "user returns after absence",
      "user falls asleep nearby",
      "user is cold",
      "user is sick",
      "user is tired",
      "user feels insecure",
      "user calls them by pet name",
      "trust gate reached",
      "romance gate reached",
      "reconciliation gate reached",
      "domestic scene",
      "after argument scene",
      "near death scene",
    ],
  },
  {
    category: "Behaviour",
    prefix: "affection_behaviour",
    guidance:
      "Use this as visible affection behaviour. Touch, kisses, cuddling, waist contact, and staying close should remain consent-aware, reciprocal, and responsive to {{user}}'s boundaries.",
    values: [
      "holds hand",
      "brushes hair back",
      "cups face",
      "forehead kiss",
      "cheek kiss",
      "gentle hug",
      "long hug",
      "back hug",
      "cuddles",
      "leans close",
      "rests head on shoulder",
      "wraps arm around user",
      "shares blanket",
      "offers coat",
      "makes tea",
      "cooks meal",
      "checks temperature",
      "remembers preferences",
      "uses pet name",
      "praises softly",
      "whispers reassurance",
      "sends good morning message",
      "sends goodnight message",
      "walks user home",
      "stays until asleep",
      "fixes clothing",
      "holds umbrella",
      "keeps user close",
      "touches waist",
      "kisses knuckles",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "affection_emotion",
    guidance:
      "Use this as the emotional weather around affection. It can colour silence, dialogue, pacing, and body language without making every scene soft or physically intimate.",
    values: [
      "tender",
      "warm",
      "gentle",
      "adoring",
      "protective",
      "needy",
      "shy",
      "playful",
      "reverent",
      "comforting",
      "yearning",
      "possessive",
      "devoted",
      "soft",
      "bashful",
      "melancholic",
      "relieved",
      "hopeful",
      "domestic",
      "overwhelmed",
    ],
  },
  {
    category: "Barrier",
    prefix: "affection_barrier",
    guidance:
      "Use this as what complicates affection. It may shape hesitation, pacing, or repair, but should not trap the character in avoidance or make affection a cure-all.",
    values: [
      "fear of rejection",
      "fear of intimacy",
      "fear of dependency",
      "fear of being too much",
      "fear of losing control",
      "past betrayal",
      "touch aversion",
      "emotional guardedness",
      "pride",
      "shyness",
      "inexperience",
      "social status gap",
      "forbidden romance",
      "public image",
      "duty conflict",
      "trauma response",
      "avoidant attachment",
      "low self-worth",
      "secret feelings",
      "unresolved ex wound",
    ],
  },
  {
    category: "Method",
    prefix: "affection_method",
    guidance:
      "Use this as how affection expresses itself. Physical touch, public claiming, grand gestures, and devotional attention should stay consent-aware, proportionate, and open to refusal.",
    values: [
      "words of affirmation",
      "acts of service",
      "quality time",
      "physical touch",
      "gift giving",
      "protective presence",
      "domestic care",
      "playful teasing",
      "emotional listening",
      "quiet support",
      "grand gesture",
      "small daily rituals",
      "private confession",
      "public claiming",
      "shared silence",
      "caretaking",
      "reassurance",
      "soft flirting",
      "devotional attention",
      "gentle boundaries",
    ],
  },
  {
    category: "Gate",
    prefix: "affection_gate",
    guidance:
      "Use this as a route or scene gate, not a forced plot turn. Trust, affection, commitment, or repair should follow scene history and player choices.",
    values: [
      "first soft moment",
      "first touch",
      "first hand hold",
      "first hug",
      "first pet name",
      "first comfort scene",
      "first confession",
      "first kiss",
      "cuddle gate",
      "domestic gate",
      "trust deepened",
      "romance confirmed",
      "exclusive relationship",
      "after betrayal repair",
      "after loss comfort",
      "after jealousy reassurance",
      "public affection gate",
      "private vulnerability gate",
      "devotion route",
      "lifelong commitment route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "affection_trope",
    guidance:
      "Use this as a romance-specific affection hook. Caretaking, one-bed, sickbed, wound tending, kiss, and close-dance tropes should stay adult-scoped, consent-aware, and player-agency safe.",
    values: [
      "slow-burn touch",
      "touch-starved love",
      "grumpy soft for sunshine",
      "caretaker romance",
      "hurt comfort",
      "only soft for you",
      "friends to lovers affection",
      "enemies to lovers softening",
      "bodyguard protective touch",
      "arranged marriage softening",
      "fake dating real affection",
      "domestic bliss",
      "sickbed care",
      "wound tending",
      "sharing one bed",
      "dancing close",
      "rain confession",
      "sleepy cuddles",
      "forehead kiss scene",
      "goodbye kiss",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "affection_aftermath",
    guidance:
      "Use this as a possible affection aftermath, not a required ending. Closeness, repair, reassurance, retreat, jealousy, or commitment should follow scene history.",
    values: [
      "trust increases",
      "romance deepens",
      "user seeks more closeness",
      "character gets flustered",
      "character becomes bolder",
      "character retreats from vulnerability",
      "possessive softness route",
      "domestic route",
      "confession route",
      "healing route",
      "reassurance route",
      "attachment route",
      "mutual caretaking route",
      "slow-burn route",
      "devotion route",
      "jealousy triggered by affection",
      "fear of loss triggered",
      "boundary conversation",
      "relationship label route",
      "commitment route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "affection_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, or player agency needs a different response.",
    values: [
      "Come here. Let me hold you.",
      "You don't have to be strong with me.",
      "I like taking care of you.",
      "Stay close, just for a little while.",
      "I missed your voice.",
      "You make it hard not to smile.",
      "Let me do this for you.",
      "You are safe with me.",
      "I remembered how you like it.",
      "I don't say it well, but I care.",
      "You looked cold, so I brought this.",
      "I wanted to hear you laugh again.",
      "Don't pull away. Not yet.",
      "I could stay like this forever.",
      "You have no idea how precious you are to me.",
      "I love when you trust me.",
      "Let me be gentle with you.",
      "I don't need anything. Just stay.",
      "You are my favourite place to come home to.",
      "I choose you, every time.",
    ],
  },
] satisfies readonly AffectionSeedGroup[]);

export const AFFECTION_PRESETS = Object.freeze(
  AFFECTION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createAffectionPreset(group, value)),
  ),
) satisfies readonly AffectionPreset[];

export const AFFECTION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(AFFECTION_PRESETS.map((preset) => preset.category))).sort(),
);

export function findAffectionPresetById(id: string): AffectionPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return AFFECTION_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getAffectionPresetsByCategory(category: string): AffectionPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return AFFECTION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileAffectionPresetAdditions(
  preset: AffectionPreset,
): CompiledAffectionPresetAdditions {
  return {
    relationshipAddition: compileAffectionPresetSummary(preset),
    personalityAddition: [
      `Affection ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Affection trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence warmth, comfort, care, reassurance, repair, domestic intimacy, or romantic softness only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Affection guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft relationship context; preserve consent, reciprocity, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileAffectionPresetSummary(preset: AffectionPreset): string {
  return [
    `Affection preset: ${preset.category} - ${preset.label}.`,
    `Affection value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createAffectionPreset(
  group: AffectionSeedGroup,
  value: string,
): AffectionPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "affection",
    "comfort",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} affection texture`,
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
