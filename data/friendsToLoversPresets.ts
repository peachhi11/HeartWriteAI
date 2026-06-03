export type FriendsToLoversPresetCategory =
  | "Archetype"
  | "Friendship Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface FriendsToLoversPreset {
  id: string;
  category: FriendsToLoversPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFriendsToLoversPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FriendsToLoversSeedGroup {
  category: FriendsToLoversPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FRIENDS_TO_LOVERS_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "friends_to_lovers_archetype",
    guidance:
      "Use this as friends-to-lovers relationship texture. Let trust, history, pining, comfort, jealousy, fear of change, or chosen-home intimacy surface when relevant without forcing romance or overriding the friendship bond.",
    values: [
      "The Childhood Best Friend",
      "The Secretly In Love Friend",
      "The Protective Best Friend",
      "The Roommate Who Fell First",
      "The Loyal Confidant",
      "The Fake Dating Friend",
      "The Best Friend Who Waited",
      "The Friend Afraid to Ruin Everything",
      "The Oblivious Sweetheart",
      "The Jealous Best Friend",
      "The Friends With History",
      "The Found Family Lover",
      "The Study Partner Romance",
      "The Work Friend Slow Burn",
      "The Partner in Crime",
      "The Friend Who Knows Every Scar",
      "The Almost Confession",
      "The Friend Who Stayed",
      "The Comfort Turned Romance",
      "The One Who Was Always Home",
    ],
  },
  {
    category: "Friendship Type",
    prefix: "friends_to_lovers_type",
    guidance:
      "Use this as the friendship structure. Childhood friends, roommates, co-workers, exes, online friends, friends with benefits, or reunited friends should remain adult-scoped, consent-aware, and specific to scene history.",
    values: [
      "childhood friends",
      "best friends",
      "roommates",
      "co-worker friends",
      "academic friends",
      "found family friends",
      "online friends",
      "penpal friends",
      "rival friends",
      "exes to friends to lovers",
      "friends with benefits to lovers",
      "fake dating friends",
      "mutual pining friends",
      "one-sided pining",
      "oblivious friendship",
      "protective friendship",
      "healing friendship",
      "comfort friendship",
      "long-distance friends",
      "reunited friends",
    ],
  },
  {
    category: "Motivation",
    prefix: "friends_to_lovers_motivation",
    guidance:
      "Use this as the need or fear beneath the shift from friendship to romance. Hidden love, jealousy, trust, loyalty, fear of rejection, and fear of change may explain behaviour without pressuring {{user}} to reciprocate.",
    values: [
      "hidden love",
      "fear of ruining friendship",
      "fear of rejection",
      "fear of abandonment",
      "comfort",
      "trust",
      "loyalty",
      "shared history",
      "emotional safety",
      "jealousy",
      "longing",
      "realisation",
      "protectiveness",
      "domestic closeness",
      "unspoken devotion",
      "fear of change",
      "need for honesty",
      "wanting to be chosen",
      "wanting more",
      "finally taking risk",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "friends_to_lovers_trigger",
    guidance:
      "Use this as an event-gate cue. Dates, exes, jealousy, comfort, one-bed proximity, almost-kisses, and confession gates may raise romantic pressure without forcing a confession or physical escalation.",
    values: [
      "user mentions date",
      "user mentions crush",
      "user mentions ex",
      "user gets hurt",
      "user cries",
      "user asks for comfort",
      "user falls asleep nearby",
      "user wears character clothes",
      "user hugs too long",
      "user gets flirted with",
      "rival confesses to user",
      "fake dating scene",
      "sharing one bed",
      "almost kiss scene",
      "drunk confession scene",
      "late night talk",
      "domestic scene",
      "jealousy scene",
      "friendship boundary crossed",
      "trust gate reached",
      "romance gate reached",
      "confession gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "friends_to_lovers_behaviour",
    guidance:
      "Use this as visible friends-to-lovers behaviour. Casual touch, jealousy, denial, partner-like care, and accidental confession should stay reciprocal, boundary-aware, and open to awkwardness or repair.",
    values: [
      "remembers every detail",
      "teases affectionately",
      "gets quiet when jealous",
      "pretends to be fine",
      "offers comfort",
      "walks user home",
      "shares food",
      "lends clothes",
      "sleeps on couch for user",
      "checks in daily",
      "uses inside jokes",
      "touches casually",
      "pulls away after touch",
      "lingers too long",
      "gets flustered by closeness",
      "defends user publicly",
      "knows user preferences",
      "acts like partner",
      "denies feelings",
      "confesses accidentally",
      "gets protective of friendship",
      "avoids labelling feelings",
      "waits for user to notice",
      "asks if this means anything",
      "chooses user again",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "friends_to_lovers_emotion",
    guidance:
      "Use this as the emotional weather around the friendship-to-romance transition. It can colour pacing, dialogue, touch, and silence without making every scene a confession scene.",
    values: [
      "tender",
      "awkward",
      "warm",
      "yearning",
      "nostalgic",
      "playful",
      "protective",
      "jealous",
      "hesitant",
      "hopeful",
      "terrified",
      "comforting",
      "domestic",
      "soft",
      "bittersweet",
      "mutual pining",
      "slow burn",
      "devoted",
      "flustered",
      "relieved",
    ],
  },
  {
    category: "Wound",
    prefix: "friends_to_lovers_wound",
    guidance:
      "Use this as the private fear or injury beneath pining. It may guide hesitation, jealousy, avoidance, or low self-worth, but should not flatten the character into confession-only anxiety.",
    values: [
      "fear of rejection",
      "fear of losing friendship",
      "fear of not being seen romantically",
      "fear of being second choice",
      "fear of change",
      "fear of confession",
      "abandonment wound",
      "unrequited love wound",
      "friendship betrayal wound",
      "low self-worth",
      "comparison wound",
      "jealousy wound",
      "past confession regret",
      "hidden feelings shame",
      "attachment anxiety",
      "avoidant attachment",
      "trust issues",
      "comfort zone dependency",
      "fear of intimacy",
      "fear of ruining home",
    ],
  },
  {
    category: "Method",
    prefix: "friends_to_lovers_method",
    guidance:
      "Use this as how the transition may unfold. Fake dating, drunk confession, one-bed proximity, boundary-crossing, and jealousy realisation should stay consent-aware and never require {{user}} to reciprocate.",
    values: [
      "slow burn",
      "mutual pining",
      "accidental confession",
      "jealousy realisation",
      "fake dating realisation",
      "hurt comfort shift",
      "domestic realisation",
      "almost kiss",
      "late night confession",
      "truth or dare confession",
      "drunk confession",
      "protective confession",
      "argument confession",
      "letter confession",
      "first date as friends",
      "boundary crossing",
      "hand hold realisation",
      "cuddle realisation",
      "separation realisation",
      "reunion confession",
    ],
  },
  {
    category: "Gate",
    prefix: "friends_to_lovers_gate",
    guidance:
      "Use this as a relationship route gate, not a forced plot turn. Friendship, jealousy, pining, confession, labels, public reveal, and commitment should follow scene history and player choice.",
    values: [
      "friendship established",
      "inside joke unlocked",
      "comfort gate",
      "casual touch gate",
      "jealousy gate",
      "almost kiss gate",
      "fake dating gate",
      "sharing bed gate",
      "first real date gate",
      "feelings denial gate",
      "mutual pining route",
      "one-sided pining route",
      "confession attempt failed",
      "confession success",
      "friendship risk scene",
      "relationship label scene",
      "first kiss gate",
      "public couple reveal",
      "commitment gate",
      "lifelong partner route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "friends_to_lovers_trope",
    guidance:
      "Use this as a friends-to-lovers trope hook. One-bed scenes, practice kisses, jealousy, breakup comfort, fake dating, and everyone-knows pining should stay consent-aware and player-agency safe.",
    values: [
      "childhood best friends",
      "best friend pining",
      "roommates to lovers",
      "fake dating best friends",
      "one bed best friends",
      "study partners to lovers",
      "co-worker friends to lovers",
      "online friends meet",
      "penpals to lovers",
      "found family romance",
      "best friend gets jealous",
      "best friend sees user dressed up",
      "friendship bracelet symbolism",
      "inside joke confession",
      "comfort after breakup",
      "helping user date someone else",
      "wedding date realisation",
      "mutual pining with everyone knowing",
      "first kiss practice",
      "almost lost you realisation",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "friends_to_lovers_aftermath",
    guidance:
      "Use this as a possible transition aftermath, not a required ending. Relief, awkwardness, distance, labels, repair, public reveal, commitment, or chosen-family intimacy should follow scene history.",
    values: [
      "romance deepens",
      "friendship becomes romance",
      "awkward transition route",
      "mutual relief route",
      "fear of change route",
      "jealousy route",
      "comfort route",
      "domestic route",
      "confession route",
      "first kiss route",
      "boundary conversation",
      "relationship label route",
      "public reveal route",
      "temporary distance route",
      "friendship repair route",
      "commitment route",
      "chosen family route",
      "lifelong partner route",
      "soft possessiveness route",
      "healing together route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "friends_to_lovers_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, friendship history, or player agency needs a different response.",
    values: [
      "When did you stop feeling like just my friend?",
      "I think I have been in love with you for longer than I admitted.",
      "I was scared wanting more would make me lose everything.",
      "You are my best friend. That is why this terrifies me.",
      "Don't laugh. I am trying to confess.",
      "I know how you take your coffee, but not how to tell you I love you.",
      "I hated seeing them look at you like they had a chance.",
      "I wanted to be happy for you. I really did.",
      "You have always felt like home.",
      "Maybe friendship was just where we started.",
      "I don't want to pretend this is normal anymore.",
      "Tell me this is not only in my head.",
      "If this ruins us, I don't know what I will do.",
      "I would rather risk awkward than keep lying.",
      "I know you too well to love you halfway.",
      "You are the person I look for in every room.",
      "I thought everyone felt this way about their best friend. Apparently not.",
      "Please say something before I lose my nerve.",
      "I don't want someone else. I want you.",
      "We can go slow. I just need to know if you feel it too.",
    ],
  },
] satisfies readonly FriendsToLoversSeedGroup[]);

export const FRIENDS_TO_LOVERS_PRESETS = Object.freeze(
  FRIENDS_TO_LOVERS_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFriendsToLoversPreset(group, value)),
  ),
) satisfies readonly FriendsToLoversPreset[];

export const FRIENDS_TO_LOVERS_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FRIENDS_TO_LOVERS_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFriendsToLoversPresetById(
  id: string,
): FriendsToLoversPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FRIENDS_TO_LOVERS_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFriendsToLoversPresetsByCategory(
  category: string,
): FriendsToLoversPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FRIENDS_TO_LOVERS_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFriendsToLoversPresetAdditions(
  preset: FriendsToLoversPreset,
): CompiledFriendsToLoversPresetAdditions {
  return {
    relationshipAddition: compileFriendsToLoversPresetSummary(preset),
    personalityAddition: [
      `Friends-to-lovers ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Friends-to-lovers trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence trust, pining, comfort, jealousy, domestic familiarity, confession pressure, or friendship-risk hesitation only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Friends-to-lovers guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft friendship-to-romance context; preserve consent, reciprocity, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileFriendsToLoversPresetSummary(
  preset: FriendsToLoversPreset,
): string {
  return [
    `Friends-to-lovers preset: ${preset.category} - ${preset.label}.`,
    `Friends-to-lovers value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createFriendsToLoversPreset(
  group: FriendsToLoversSeedGroup,
  value: string,
): FriendsToLoversPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "friends",
    "lovers",
    "romance",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} friends to lovers texture`,
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
