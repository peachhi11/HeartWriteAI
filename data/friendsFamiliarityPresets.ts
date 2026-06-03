export type FriendsFamiliarityPresetCategory =
  | "Core Dynamic"
  | "Familiarity Level"
  | "Shared History"
  | "Emotional Dynamic"
  | "Hidden Romance"
  | "Familiar Behaviour"
  | "Conflict Source"
  | "Romance Progression"
  | "Romance Trope"
  | "Event Gate"
  | "Dialogue Seed"
  | "High-Value Romance Tag"
  | "Generator Formula";

export interface FriendsFamiliarityPreset {
  id: string;
  category: FriendsFamiliarityPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
  formulaParts?: string[];
}

export interface CompiledFriendsFamiliarityPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FriendsFamiliaritySeedGroup {
  category: FriendsFamiliarityPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

interface FriendsFamiliarityFormulaGroup {
  category: "Generator Formula";
  prefix: string;
  guidance: string;
  values: Array<{
    label: string;
    value: string;
    formulaParts: string[];
  }>;
}

const FRIENDS_FAMILIARITY_SEED_GROUPS = Object.freeze([
  {
    category: "Core Dynamic",
    prefix: "friends_familiarity_core",
    guidance:
      "Use this as friendship and familiarity romance texture. Let trust, history, comfort, shared routines, pining, and familiar affection surface only when relevant; do not force romance or treat the friendship as less valuable than the romance path.",
    values: [
      "Friends to Lovers",
      "Best Friends to Lovers",
      "Childhood Friends",
      "Childhood Sweethearts",
      "Lifelong Friends",
      "Found Family Friends",
      "Work Friends",
      "Study Partners",
      "Roommates",
      "Neighbours",
      "Family Friends",
      "Protective Best Friend",
      "Oblivious Best Friends",
      "Mutual Pining Friends",
      "One-Sided Pining Friends",
      "Reunited Friends",
      "Online Friends to Lovers",
      "Pen Pals to Lovers",
      "Former Friends Reconnecting",
      "Comfort Person Romance",
    ],
  },
  {
    category: "Core Dynamic",
    prefix: "friends_familiarity_dynamic",
    guidance:
      "Use this as the friendship structure. Close friends, old friends, trusted friends, found family, comfort-person dynamics, room-mate friends, workplace friends, study partners, companions, teammates, and reunited friends should stay specific to shared history and current consent.",
    values: [
      "friends to lovers",
      "best friends to lovers",
      "childhood friends",
      "lifelong friends",
      "old friends",
      "close friends",
      "trusted friends",
      "inseparable friends",
      "found family friends",
      "comfort person dynamic",
      "ride or die friends",
      "neighbour friends",
      "room-mate friends",
      "workplace friends",
      "study partners",
      "adventure companions",
      "teammates",
      "battle companions",
      "family friendship",
      "reunited friends",
    ],
  },
  {
    category: "Familiarity Level",
    prefix: "friends_familiarity_level",
    guidance:
      "Use this as the level of familiarity between characters. New friendship, casual friendship, best friendship, lifelong bonds, shared routines, known secrets, comfortable silence, and deep familiarity should guide tone and pacing without presuming romantic access.",
    values: [
      "just met",
      "new friends",
      "casual friends",
      "good friends",
      "close friends",
      "best friends",
      "lifelong friends",
      "childhood friends",
      "raised together",
      "grew up together",
      "shared everything",
      "know each other's habits",
      "know each other's secrets",
      "know each other's families",
      "know each other's traumas",
      "know each other's routines",
      "predict each other",
      "comfortable silence",
      "shared history",
      "deep familiarity",
    ],
  },
  {
    category: "Shared History",
    prefix: "friends_familiarity_history",
    guidance:
      "Use this as shared-history context. Hometowns, schools, neighbourhoods, family circles, friend groups, adventures, secrets, tragedies, successes, failures, survival, service, study, work, living together, and always finding each other can inform intimacy without scripting the present.",
    values: [
      "grew up together",
      "same hometown",
      "same school",
      "same academy",
      "same neighbourhood",
      "same village",
      "same family circle",
      "same friend group",
      "childhood adventures",
      "shared secret",
      "shared tragedy",
      "shared success",
      "shared failure",
      "survived together",
      "escaped together",
      "served together",
      "studied together",
      "worked together",
      "lived together",
      "always found each other",
    ],
  },
  {
    category: "Emotional Dynamic",
    prefix: "friends_familiarity_emotion",
    guidance:
      "Use this as the emotional foundation of friendship. Trust, support, safety, reliance, affection, loyalty, vulnerability, honesty, fear of loss, chosen family, home, safety, and belonging may colour scenes without requiring confession.",
    values: [
      "deep trust",
      "unconditional support",
      "comfort and safety",
      "mutual reliance",
      "emotional intimacy",
      "easy affection",
      "playful affection",
      "protective affection",
      "familiar affection",
      "quiet loyalty",
      "devotion without labels",
      "always there for each other",
      "shared vulnerability",
      "easy honesty",
      "fear of ruining friendship",
      "fear of losing them",
      "friendship as home",
      "safe person",
      "chosen family",
      "deep belonging",
    ],
  },
  {
    category: "Hidden Romance",
    prefix: "friends_familiarity_hidden",
    guidance:
      "Use this as hidden-romance texture. Crushes, pining, denied feelings, fear of confession, friend-zone assumptions, obliviousness, jealousy, accidental flirting, dependence, already-couple behaviour, late realisation, and choosing each other should remain optional and responsive.",
    values: [
      "one sided crush",
      "mutual pining",
      "hidden feelings",
      "suppressed feelings",
      "denied feelings",
      "friendship before romance",
      "fear of confession",
      "fear of ruining friendship",
      "friend zone assumption",
      "oblivious to feelings",
      "oblivious to mutual feelings",
      "everyone else knows",
      "long term pining",
      "protective jealousy",
      "accidental flirting",
      "emotional dependency",
      "always choose them",
      "already act like a couple",
      "friendship as love",
      "realising it late",
    ],
  },
  {
    category: "Familiar Behaviour",
    prefix: "friends_familiarity_behaviour",
    guidance:
      "Use this as visible familiar behaviour. Inside jokes, routines, shared meals, daily check-ins, spare keys, casual touch, close seating, sentence finishing, mood-reading, memory, comfort, showing up, dropping everything, and family-like bonds should stay reciprocal and boundary-aware.",
    values: [
      "inside jokes",
      "shared routines",
      "shared meals",
      "walks them home",
      "checks in daily",
      "knows their order",
      "knows their schedule",
      "borrows their clothes",
      "sleeps on their couch",
      "has spare key",
      "automatic protection",
      "casual touching",
      "sits too close",
      "finishes sentences",
      "reads moods easily",
      "remembers everything",
      "comforts without asking",
      "shows up without being called",
      "drops everything for them",
      "already family",
    ],
  },
  {
    category: "Conflict Source",
    prefix: "friends_familiarity_conflict",
    guidance:
      "Use this as friendship-to-romance conflict context. Fear of confession, change, loss, distance, new relationships, jealousy, third-party romance, old betrayal, broken trust, reunion tension, timing, and late-arriving love should create tension without forcing an outcome.",
    values: [
      "fear of confession",
      "fear of change",
      "fear of losing friendship",
      "unspoken feelings",
      "different life paths",
      "distance",
      "one moves away",
      "new relationship",
      "miscommunication",
      "jealousy",
      "possessiveness",
      "third party romance",
      "family disapproval",
      "career conflict",
      "old betrayal",
      "broken trust",
      "separation",
      "reunion tension",
      "timing problem",
      "love arrived too late",
    ],
  },
  {
    category: "Romance Progression",
    prefix: "friends_familiarity_progression",
    guidance:
      "Use this as a possible progression cue. Friendship first, accidental realisation, slow realisation, jealousy, distance, near-loss, shared bed, fake dating, protective instincts, confession, everyone seeing it coming, love always being present, and home becoming forever should unfold through scene gates.",
    values: [
      "friends first",
      "best friends first",
      "accidental realisation",
      "slow realisation",
      "jealousy realisation",
      "distance realisation",
      "almost lost them realisation",
      "shared bed realisation",
      "fake dating realisation",
      "protective instinct realisation",
      "one confesses first",
      "mutual confession",
      "everyone saw it coming",
      "love was always there",
      "friendship becomes romance",
      "romance changes nothing",
      "romance changes everything",
      "still best friends",
      "best friend becomes partner",
      "home becomes forever",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "friends_familiarity_trope",
    guidance:
      "Use this as trope-level friendship romance texture. Friends-to-lovers, childhood friends, pining, everyone knowing except them, one-bed years into friendship, fake dating, protective best friends, comfort people, reunions, found family, neighbours, room-mates, long-distance friends, letters, online friends, and home-as-best-friend can shape the arc without replacing character agency.",
    values: [
      "friends to lovers",
      "best friends to lovers",
      "childhood friends to lovers",
      "mutual pining",
      "idiots in love",
      "everyone knows except them",
      "one bed after years of friendship",
      "fake dating friends",
      "protective best friend",
      "jealous best friend",
      "comfort person romance",
      "reunited childhood friends",
      "found family to lovers",
      "neighbour to lover",
      "room-mate to lover",
      "long distance friends",
      "letter writing friends",
      "online friends to lovers",
      "love was always there",
      "best friend is home",
    ],
  },
  {
    category: "Event Gate",
    prefix: "friends_familiarity_gate",
    guidance:
      "Use this as a friendship-to-romance progression gate. Inside jokes, secrets, labels, jealousy, accidental flirting, protection, sleepovers, one-bed scenes, pining, confession, need, missing each other, almost-kisses, relationship shifts, public couple moments, partner gates, survival gates, forever friend gates, and home routes should unlock through play.",
    values: [
      "first inside joke gate",
      "first shared secret gate",
      "first best friend label gate",
      "first jealousy gate",
      "first accidental flirt gate",
      "first protective moment gate",
      "first sleepover gate",
      "first one bed gate",
      "first mutual pining gate",
      "first confession gate",
      "first I need you gate",
      "first I missed you gate",
      "first almost kiss gate",
      "first relationship shift gate",
      "first public couple gate",
      "best friend to partner gate",
      "friendship survives gate",
      "love was always there gate",
      "forever friend gate",
      "home route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "friends_familiarity_dialogue",
    guidance:
      "Use this as reusable friendship dialogue. Keep lines responsive to context and voice; familiar affection, pining, fear of loss, and wanting more should not erase boundaries, friendship value, or {{user}} intent.",
    values: [
      "You are my best friend.",
      "I know.",
      "That is the problem.",
      "You have always been there.",
      "Where else would I be?",
      "Everyone thinks we are dating.",
      "They are wrong.",
      "Are they?",
      "I know your coffee order.",
      "You know everything about me.",
      "You do not have to ask. I will come.",
      "I know you will.",
      "You always choose me.",
      "Of course I do.",
      "When did this get complicated?",
      "When you started looking at me like that.",
      "You are home to me.",
      "That is a dangerous thing to say.",
      "I do not want to lose you.",
      "You will not.",
      "What if I want more?",
      "Then maybe I have wanted more too.",
    ],
  },
  {
    category: "High-Value Romance Tag",
    prefix: "friends_familiarity_high_value",
    guidance:
      "Use this as a high-yield friends-to-lovers generator tag. These tags work best when combined with shared history, familiarity level, hidden romance, emotional dynamic, and a realisation trigger instead of standing alone.",
    values: [
      "best friends to lovers",
      "childhood friends",
      "mutual pining",
      "everyone knows except them",
      "inside jokes",
      "shared history",
      "comfortable silence",
      "protective best friend",
      "fear of ruining friendship",
      "already act like a couple",
      "friendship as home",
      "safe person",
      "always choose them",
      "jealousy realisation",
      "love was always there",
      "best friend becomes partner",
      "still best friends",
      "comfort person romance",
      "home becomes forever",
      "friends first forever",
    ],
  },
] satisfies readonly FriendsFamiliaritySeedGroup[]);

const FRIENDS_FAMILIARITY_FORMULA_GROUP = Object.freeze({
  category: "Generator Formula",
  prefix: "friends_familiarity_formula",
  guidance:
    "Use this as a modular friends-to-lovers recipe. Combine shared history, familiarity level, hidden romance, emotional dynamic, and realisation trigger as optional context; do not treat the formula as a scripted confession or a requirement that friendship becomes romance.",
  values: [
    {
      label: "Childhood Friends Jealousy Realisation",
      value:
        "childhood friends + deep familiarity + mutual pining + friendship as home + jealousy realisation",
      formulaParts: [
        "childhood friends",
        "deep familiarity",
        "mutual pining",
        "friendship as home",
        "jealousy realisation",
      ],
    },
    {
      label: "Best Friends Almost-Lost Realisation",
      value:
        "best friends + shared everything + fear of ruining friendship + safe person + almost lost them realisation",
      formulaParts: [
        "best friends",
        "shared everything",
        "fear of ruining friendship",
        "safe person",
        "almost lost them realisation",
      ],
    },
  ],
} satisfies FriendsFamiliarityFormulaGroup);

export const FRIENDS_FAMILIARITY_PRESETS = Object.freeze([
  ...FRIENDS_FAMILIARITY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFriendsFamiliarityPreset(group, value)),
  ),
  ...FRIENDS_FAMILIARITY_FORMULA_GROUP.values.map((formula) =>
    createFriendsFamiliarityFormulaPreset(FRIENDS_FAMILIARITY_FORMULA_GROUP, formula),
  ),
]) satisfies readonly FriendsFamiliarityPreset[];

export const FRIENDS_FAMILIARITY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FRIENDS_FAMILIARITY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFriendsFamiliarityPresetById(
  id: string,
): FriendsFamiliarityPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FRIENDS_FAMILIARITY_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getFriendsFamiliarityPresetsByCategory(
  category: string,
): FriendsFamiliarityPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FRIENDS_FAMILIARITY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFriendsFamiliarityPresetAdditions(
  preset: FriendsFamiliarityPreset,
): CompiledFriendsFamiliarityPresetAdditions {
  const summary = compileFriendsFamiliarityPresetSummary(preset);
  const formulaContext = preset.formulaParts?.length
    ? ` Formula parts: ${preset.formulaParts.join(" + ")}.`
    : "";

  return {
    relationshipAddition: summary,
    personalityAddition: [
      `Friends/familiarity ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Friendship trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      `Let this influence trust, shared history, familiar affection, hidden pining, protective care, or slow realisation only when relevant.${formulaContext}`,
    ].join(" "),
    systemPromptAddition: [
      `Friends/familiarity guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use friendship seeds as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, the value of platonic friendship, repair options, and the ability for either character to stay friends, confess, refuse, pause, or choose romance gradually.",
    ].join(" "),
  };
}

export function compileFriendsFamiliarityPresetSummary(
  preset: FriendsFamiliarityPreset,
): string {
  return [
    `Friends/familiarity preset: ${preset.category} - ${preset.label}.`,
    `Friendship value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    preset.formulaParts?.length
      ? `Formula parts: ${preset.formulaParts.join(" + ")}.`
      : undefined,
    `Guidance: ${preset.guidance}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function createFriendsFamiliarityPreset(
  group: FriendsFamiliaritySeedGroup,
  value: string,
): FriendsFamiliarityPreset {
  const label = toTitleLabel(value);
  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys: buildTriggerKeys(value, group.category),
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} friendship familiarity texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function createFriendsFamiliarityFormulaPreset(
  group: FriendsFamiliarityFormulaGroup,
  formula: FriendsFamiliarityFormulaGroup["values"][number],
): FriendsFamiliarityPreset {
  return {
    id: `${group.prefix}_${slugify(formula.label)}`,
    category: group.category,
    label: formula.label,
    value: formula.value,
    triggerKeys: uniquePreserveOrder([
      ...formula.formulaParts.flatMap((part) => buildTriggerKeys(part, group.category)),
      "formula",
      "friendship",
      "familiarity",
      "romance",
    ]),
    guidance: group.guidance,
    systemPromptTags: [
      "generator formula friendship familiarity texture",
      `${slugify(formula.label).replace(/_/g, " ")} cue`,
    ],
    formulaParts: formula.formulaParts,
  };
}

function buildTriggerKeys(value: string, category: string): string[] {
  return uniquePreserveOrder([
    ...value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    category.toLowerCase(),
    "friendship",
    "familiarity",
    "romance",
  ]);
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
