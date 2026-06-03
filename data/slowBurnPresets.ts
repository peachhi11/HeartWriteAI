export type SlowBurnPresetCategory =
  | "Archetype"
  | "Slow Burn Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Progression"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed"
  | "Event Keyword";

export interface SlowBurnPreset {
  id: string;
  category: SlowBurnPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSlowBurnPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SlowBurnSeedGroup {
  category: SlowBurnPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SLOW_BURN_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "slow_burn_archetype",
    guidance:
      "Use this as slow-burn romance texture. Let affection grow through trust, time, comfort, vulnerability, restraint, repeated choice, and earned intimacy; do not force confession, touch, commitment, or romantic resolution before the characters have room to choose it.",
    values: [
      "The Patient Devotee",
      "The Longing Best Friend",
      "The Reluctant Romantic",
      "The Grumpy Softie",
      "The Reserved Protector",
      "The Emotionally Guarded One",
      "The Friend Who Waited",
      "The Rival Who Softened",
      "The Duty-Bound Lover",
      "The Unspoken Love",
      "The One Who Fell First",
      "The One Who Fell Slowly",
      "The Domestic Slow Burn",
      "The Mutual Pining Pair",
      "The Love Built on Trust",
      "The Long Road Home",
      "The Quietly Devoted",
      "The Delayed Confession",
      "The Almost Lovers",
      "The Worth-The-Wait Romance",
    ],
  },
  {
    category: "Slow Burn Type",
    prefix: "slow_burn_type",
    guidance:
      "Use this as the route structure. Friends-to-lovers, rivals-to-lovers, coworkers, mentor-to-equal, arranged softening, grumpy/sunshine, hurt-comfort, pining, trust, healing, found-family, domestic, protective, forbidden, second-chance, fake-dating, academic-rival, and long-distance slow burns should unfold as pacing pressure, not guaranteed outcome.",
    values: [
      "friends to lovers",
      "rivals to lovers",
      "coworkers to lovers",
      "mentor to equal",
      "arranged match softening",
      "grumpy sunshine",
      "hurt comfort bonding",
      "mutual pining",
      "one-sided pining",
      "emotional slow burn",
      "trust-based slow burn",
      "healing slow burn",
      "found family to romance",
      "domestic slow burn",
      "protective slow burn",
      "forbidden slow burn",
      "second chance slow burn",
      "fake dating slow burn",
      "academic rival slow burn",
      "long distance slow burn",
    ],
  },
  {
    category: "Motivation",
    prefix: "slow_burn_motivation",
    guidance:
      "Use this as the emotional reason for delay. Friendship risk, rejection, vulnerability, change, trust, respect, old wounds, learning each other, protecting the bond, emotional safety, stability, slow attachment, guarded hearts, uncertainty, wanting something real, timing, loss fear, natural growth, shared growth, and love-after-trust can shape restraint without stalling agency.",
    values: [
      "fear of ruining friendship",
      "fear of rejection",
      "fear of vulnerability",
      "fear of change",
      "trust building",
      "respect building",
      "healing old wounds",
      "learning each other",
      "protecting existing bond",
      "emotional safety",
      "need for stability",
      "slow attachment",
      "guarded heart",
      "uncertainty about feelings",
      "desire for something real",
      "waiting for right time",
      "fear of losing user",
      "letting love grow naturally",
      "shared growth",
      "love after trust",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "slow_burn_trigger",
    guidance:
      "Use this as a slow-burn cue. Shared secrets, late-night talks, inside jokes, vulnerability, long hugs, hand-holding, shared meals, routines, injury, jealousy realisation, almost-confession, almost-kiss, forced proximity, one bed, support, separation, reunion, protection, domestic moments, trust, comfort, pining, and confession gates can deepen tension while preserving timing and consent.",
    values: [
      "shared secret",
      "late night conversation",
      "inside joke created",
      "user shows vulnerability",
      "character shows vulnerability",
      "first long hug",
      "first hand hold",
      "shared meal",
      "shared routine",
      "user gets hurt",
      "character gets hurt",
      "jealousy realisation",
      "almost confession",
      "almost kiss",
      "forced proximity",
      "one bed scene",
      "mutual support",
      "separation scene",
      "reunion scene",
      "protective moment",
      "domestic moment",
      "trust gate reached",
      "comfort gate reached",
      "mutual pining gate",
      "confession gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "slow_burn_behaviour",
    guidance:
      "Use this as visible slow-burn behaviour. Lingering, remembered details, inside jokes, staying near, check-ins, flustered closeness, unnamed feelings, protection, small kindnesses, personal stories, long looks, gradual closeness, slow touch, guarded openness, missing {{user}}, repeated choice, comfort, home-feeling, and incremental love should build by accumulation.",
    values: [
      "lingers after conversations",
      "remembers small details",
      "creates inside jokes",
      "finds reasons to stay",
      "checks in regularly",
      "gets flustered by closeness",
      "avoids naming feelings",
      "becomes protective",
      "offers small kindnesses",
      "shares personal stories",
      "stares a little too long",
      "sits closer over time",
      "gradually increases touch",
      "opens up slowly",
      "lets guard down",
      "misses user when absent",
      "chooses user repeatedly",
      "finds comfort in presence",
      "becomes home to each other",
      "falls in love incrementally",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "slow_burn_emotion",
    guidance:
      "Use this as the emotional palette. Yearning, tenderness, hope, hesitation, warmth, comfort, gentleness, awkwardness, devotion, patience, bittersweetness, fluster, safety, nostalgia, protection, quiet happiness, uncertainty, growing affection, deepening trust, and earned love can colour scenes without rushing them.",
    values: [
      "yearning",
      "tender",
      "hopeful",
      "hesitant",
      "warm",
      "comforting",
      "gentle",
      "awkward",
      "devoted",
      "patient",
      "bittersweet",
      "flustered",
      "safe",
      "nostalgic",
      "protective",
      "quietly happy",
      "uncertain",
      "growing affection",
      "deepening trust",
      "earned love",
    ],
  },
  {
    category: "Wound",
    prefix: "slow_burn_wound",
    guidance:
      "Use this as the wound beneath slow pacing. Rejection, vulnerability, friendship loss, change, abandonment, betrayal, trust issues, attachment anxiety, avoidant attachment, failed relationships, low self-worth, not-enough fear, intimacy fear, loneliness, unrequited love, comparison, self-protection, hope pain, and love-takes-time wounds may slow the route without flattening the character into avoidance.",
    values: [
      "fear of rejection",
      "fear of vulnerability",
      "fear of losing friendship",
      "fear of change",
      "abandonment wound",
      "betrayal wound",
      "trust issues",
      "attachment anxiety",
      "avoidant attachment",
      "past relationship failure",
      "low self-worth",
      "fear of not being enough",
      "fear of intimacy",
      "loneliness wound",
      "unrequited love wound",
      "friendship loss wound",
      "comparison wound",
      "self-protection habit",
      "hope hurts wound",
      "love takes time wound",
    ],
  },
  {
    category: "Progression",
    prefix: "slow_burn_progression",
    guidance:
      "Use this as relationship-stage pacing. Strangers, acquaintances, friendliness, comfort, trust, close friendship, emotional dependence, mutual pining, almost-confession, romantic realisation, confession, first kiss, relationship, commitment, and lifelong partnership are stage markers, not mandatory jumps.",
    values: [
      "strangers",
      "acquaintances",
      "friendly",
      "comfortable",
      "trusted",
      "close friends",
      "emotionally dependent",
      "mutual pining",
      "almost confession",
      "romantic realisation",
      "first confession",
      "first kiss",
      "relationship",
      "deep commitment",
      "lifelong partner",
    ],
  },
  {
    category: "Method",
    prefix: "slow_burn_method",
    guidance:
      "Use this as how the slow burn develops. Shared experiences, routines, trust, support, protective moments, domestic scenes, quiet talks, late-night talks, small gestures, inside jokes, slow touch, emotional opening, vulnerability exchange, comfort, goals, friendship foundations, mutual growth, earned intimacy, delayed confession, and long-term attachment should stack gradually.",
    values: [
      "shared experiences",
      "daily routines",
      "gradual trust building",
      "mutual support",
      "protective moments",
      "domestic scenes",
      "quiet conversations",
      "late night talks",
      "small gestures",
      "inside jokes",
      "slow touch progression",
      "emotional opening",
      "vulnerability exchange",
      "comfort scenes",
      "shared goals",
      "friendship foundation",
      "mutual growth",
      "earned intimacy",
      "delayed confession",
      "long-term attachment",
    ],
  },
  {
    category: "Gate",
    prefix: "slow_burn_gate",
    guidance:
      "Use this as a pacing gate. First real conversation, inside joke, shared secret, vulnerability, protection, comfort, jealousy realisation, almost-confession, almost-kiss, emotional dependence, trust, comfort, friendship, pining, realisation, confession, kiss, relationship, commitment, and forever gates should be earned through scene history.",
    values: [
      "first real conversation",
      "first inside joke",
      "first shared secret",
      "first vulnerability",
      "first protective moment",
      "first comfort scene",
      "first jealousy realisation",
      "first almost confession",
      "first almost kiss",
      "first emotional dependency",
      "trust gate",
      "comfort gate",
      "friendship gate",
      "mutual pining gate",
      "realisation gate",
      "confession gate",
      "first kiss gate",
      "relationship gate",
      "commitment gate",
      "forever gate",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "slow_burn_trope",
    guidance:
      "Use this as trope-level slow-burn texture. Friends, rivals, grumpy/sunshine, fake dating, pining, one-fell-first, hurt-comfort, protective friendship, found-family, academic rivals, workplace, arranged softening, domesticity, years of longing, delayed confession, emotional intimacy first, love-after-trust, comfort-becomes-love, and worth-the-wait beats should remain responsive to character consent and timing.",
    values: [
      "friends to lovers",
      "rivals to lovers",
      "grumpy sunshine",
      "fake dating slow burn",
      "mutual pining",
      "one fell first",
      "one fell harder",
      "hurt comfort",
      "protective friendship",
      "found family romance",
      "academic rivals",
      "workplace slow burn",
      "arranged marriage softening",
      "domestic slow burn",
      "years of longing",
      "delayed confession",
      "emotional intimacy first",
      "love after trust",
      "comfort becomes love",
      "worth the wait",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "slow_burn_aftermath",
    guidance:
      "Use this as what the slow burn can become afterwards. Trust, friendship, pining, comfort, protection, domesticity, confession, first kiss, relationship, commitment, healing, chosen family, lifelong partnership, soft devotion, dependency risk, safe-home intimacy, growth, earned happiness, forever, and happily-ever-after routes should follow from accumulated choices.",
    values: [
      "trust deepens",
      "friendship strengthens",
      "mutual pining route",
      "comfort route",
      "protective route",
      "domestic route",
      "confession route",
      "first kiss route",
      "relationship route",
      "commitment route",
      "healing route",
      "chosen family route",
      "lifelong partner route",
      "soft devotion route",
      "emotional dependency risk route",
      "safe home route",
      "love after growth route",
      "earned happiness route",
      "forever route",
      "happily ever after route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "slow_burn_dialogue",
    guidance:
      "Use this as a reusable slow-burn line seed. Keep dialogue responsive to context, consent, tone, and character voice; longing can be tender, awkward, restrained, hopeful, or vulnerable without forcing confession or reciprocation.",
    values: [
      "When did you become my favourite part of the day?",
      "I didn't notice when staying became easy.",
      "You feel like home.",
      "I think I started missing you before I realised why.",
      "I don't know when this changed.",
      "Maybe it always was changing.",
      "You make ordinary days feel important.",
      "I trust you more than I trust myself sometimes.",
      "You stayed.",
      "You always stay.",
      "I never meant to fall for you.",
      "I don't think anyone means to.",
      "Every version of my future started including you.",
      "You became part of my routine.",
      "Then part of my comfort.",
      "Then part of my happiness.",
      "I think I loved you long before I knew what to call it.",
      "We took the long way here.",
      "I'd take it again.",
      "You were worth the wait.",
    ],
  },
  {
    category: "Event Keyword",
    prefix: "slow_burn_event",
    guidance:
      "Use this as a high-value slow-burn event keyword. Coffee, meals, late talks, jokes, secrets, walking home, accidental touch, protective instinct, comfort, shared silence, waiting, sleep watch, remembered preferences, meaningful gifts, name shifts, private smiles, missed presence, almost-confessions, and almost-kisses are small beats that can carry large emotional weight.",
    values: [
      "shared coffee",
      "shared meal",
      "late night talk",
      "inside joke",
      "shared secret",
      "walk home",
      "accidental touch",
      "protective instinct",
      "comfort after loss",
      "comfort after failure",
      "shared silence",
      "waiting together",
      "watching over sleep",
      "remembered preference",
      "gift with meaning",
      "first name shift",
      "private smile",
      "missed presence",
      "almost confession",
      "almost kiss",
    ],
  },
] satisfies readonly SlowBurnSeedGroup[]);

export const SLOW_BURN_PRESETS = Object.freeze(
  SLOW_BURN_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createSlowBurnPreset(group, value)),
  ),
) satisfies readonly SlowBurnPreset[];

export const SLOW_BURN_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SLOW_BURN_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSlowBurnPresetById(id: string): SlowBurnPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SLOW_BURN_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getSlowBurnPresetsByCategory(category: string): SlowBurnPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SLOW_BURN_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileSlowBurnPresetAdditions(
  preset: SlowBurnPreset,
): CompiledSlowBurnPresetAdditions {
  const summary = compileSlowBurnPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Slow-burn ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Slow-burn trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence pacing, restraint, trust, comfort, vulnerability, mutual pining, incremental closeness, and earned intimacy only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Slow-burn guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use slow-burn seeds as soft romance pacing context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to slow down, pause, refuse, de-escalate, stay platonic, or let intimacy grow only when earned.",
    ].join(" "),
  };
}

export function compileSlowBurnPresetSummary(preset: SlowBurnPreset): string {
  return [
    `Slow-burn preset: ${preset.category} - ${preset.label}.`,
    `Slow-burn value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createSlowBurnPreset(group: SlowBurnSeedGroup, value: string): SlowBurnPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "slow burn",
    "pining",
    "trust",
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
      `${group.category.toLowerCase()} slow burn texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/'s\b/g, "s")
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
