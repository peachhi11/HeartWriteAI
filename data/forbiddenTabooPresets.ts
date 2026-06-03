export type ForbiddenTabooPresetCategory =
  | "Archetype"
  | "Relationship Type"
  | "Barrier"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Romance Trope"
  | "Gate"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface ForbiddenTabooPreset {
  id: string;
  category: ForbiddenTabooPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledForbiddenTabooPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ForbiddenTabooSeedGroup {
  category: ForbiddenTabooPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FORBIDDEN_TABOO_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "forbidden_taboo_archetype",
    guidance:
      "Use this as forbidden-romance intersection pressure, not as a standalone trope. Let social, moral, political, supernatural, class, duty, family, loyalty, identity, or destiny barriers surface when relevant without overriding consent, boundaries, or player agency.",
    values: [
      "The Forbidden Lover",
      "The Star-Crossed Pair",
      "The Enemy Beloved",
      "The Rival Heir",
      "The Secret Romance",
      "The Bodyguard and Charge",
      "The Royal and Commoner",
      "The Noble and Servant",
      "The Mafia Rival",
      "The Political Opponent",
      "The Monster and Human",
      "The Vampire and Hunter",
      "The Werewolf and Witch",
      "The Angel and Demon",
      "The Duty-Bound Protector",
      "The Best Friend's Ex",
      "The Family Rival",
      "The Arranged Match Rejector",
      "The Prophecy-Breaker",
      "The Love That Shouldn't Exist",
    ],
  },
  {
    category: "Relationship Type",
    prefix: "forbidden_taboo_type",
    guidance:
      "Use this as the forbidden relationship structure. Enemy factions, status gaps, professional ethics, supernatural law, family feuds, loyalty conflicts, duty conflicts, and destiny conflicts should create pressure, not coercion or guaranteed romance.",
    values: [
      "enemy factions",
      "political rivals",
      "class difference",
      "royal commoner",
      "noble servant",
      "employer employee",
      "bodyguard client",
      "celebrity fan",
      "teacher student adult",
      "doctor patient",
      "religious conflict",
      "cultural conflict",
      "species conflict",
      "supernatural conflict",
      "family feud",
      "arranged marriage conflict",
      "loyalty conflict",
      "duty conflict",
      "prophecy conflict",
      "destiny conflict",
      "criminal law enforcement",
      "assassin target",
      "spy target",
      "war opponents",
      "rival kingdoms",
    ],
  },
  {
    category: "Barrier",
    prefix: "forbidden_taboo_barrier",
    guidance:
      "Use this as the barrier that makes the romance costly. Social rules, family expectations, political pressure, ethics, orders, bloodline rules, oaths, contracts, revenge, and old conflict may complicate choices without removing autonomy.",
    values: [
      "social rules",
      "family expectations",
      "political pressure",
      "religious rules",
      "professional ethics",
      "military orders",
      "bloodline rules",
      "species law",
      "pack law",
      "royal duty",
      "public reputation",
      "cultural taboo",
      "prophecy",
      "curse",
      "oath",
      "contract",
      "loyalty",
      "revenge",
      "past betrayal",
      "historical conflict",
    ],
  },
  {
    category: "Motivation",
    prefix: "forbidden_taboo_motivation",
    guidance:
      "Use this as the longing or principle pulling against the barrier. Love, curiosity, rebellion, shared pain, respect, fate, comfort, protection, obsession, devotion, freedom, defiance, healing, forgiveness, or hope should stay choice-aware.",
    values: [
      "love",
      "curiosity",
      "rebellion",
      "loneliness",
      "understanding enemy",
      "shared pain",
      "shared goal",
      "forbidden attraction",
      "mutual respect",
      "fate",
      "comfort",
      "protection",
      "obsession",
      "devotion",
      "escape expectations",
      "freedom",
      "defiance",
      "healing",
      "forgiveness",
      "hope",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "forbidden_taboo_trigger",
    guidance:
      "Use this as a barrier activation cue. Disapproval, authority intervention, exposure, attacks, scandal, forced separation, arranged marriage, war, prophecy, curse activation, trust gates, and confession may raise pressure without forcing outcomes.",
    values: [
      "family disapproves",
      "authority intervenes",
      "relationship discovered",
      "secret almost exposed",
      "enemy attacks",
      "public scandal",
      "political pressure",
      "forced separation",
      "engagement announced",
      "arranged marriage announced",
      "rival returns",
      "oath reminder",
      "duty call",
      "war begins",
      "war ends",
      "peace talks",
      "prophecy revealed",
      "curse activates",
      "trust gate reached",
      "love confession",
    ],
  },
  {
    category: "Behaviour",
    prefix: "forbidden_taboo_behaviour",
    guidance:
      "Use this as visible forbidden-romance behaviour. Secret meetings, coded messages, distance, double lives, reputation sacrifice, oath conflict, and rule-breaking should stay consequence-aware and responsive to boundaries.",
    values: [
      "meets in secret",
      "hides affection",
      "coded messages",
      "secret letters",
      "secret gifts",
      "protects from distance",
      "pretends indifference",
      "avoids public contact",
      "late night meetings",
      "keeps relationship hidden",
      "lies to authorities",
      "sacrifices reputation",
      "questions duty",
      "questions loyalty",
      "chooses partner over rule",
      "chooses rule over partner",
      "runs away together",
      "breaks oath",
      "honours oath despite pain",
      "maintains double life",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "forbidden_taboo_emotion",
    guidance:
      "Use this as the emotional weather around a forbidden intersection. Yearning, guilt, secrecy, danger, rebellion, devotion, fear, tragedy, and inevitability can colour scenes without making transgression mandatory.",
    values: [
      "yearning",
      "bittersweet",
      "desperate",
      "hopeful",
      "guilty",
      "rebellious",
      "devoted",
      "conflicted",
      "protective",
      "fearful",
      "secretive",
      "obsessive",
      "tragic",
      "romantic",
      "dangerous",
      "intense",
      "melancholic",
      "determined",
      "haunted",
      "inevitable",
    ],
  },
  {
    category: "Wound",
    prefix: "forbidden_taboo_wound",
    guidance:
      "Use this as the private wound beneath the forbidden barrier. Discovery fear, abandonment fear, rejection, shame, family pressure, identity conflict, betrayal, sacrifice, scandal, and love-versus-duty conflict may guide reactions without flattening the character.",
    values: [
      "fear of discovery",
      "fear of abandonment",
      "fear of rejection",
      "duty conflict",
      "loyalty conflict",
      "family pressure",
      "social shame",
      "public humiliation",
      "identity conflict",
      "betrayal wound",
      "sacrifice wound",
      "forbidden desire shame",
      "fear of ruining partner",
      "fear of causing scandal",
      "fear of failure",
      "fear of losing everything",
      "love versus duty",
      "love versus family",
      "love versus power",
      "love versus destiny",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "forbidden_taboo_trope",
    guidance:
      "Use this as a forbidden-romance hook layered over other systems. Star-crossed lovers, enemies, bodyguards, royals, supernatural opponents, political rivals, and secret relationships should stay adult-scoped where power imbalance exists and never bypass consent.",
    values: [
      "Romeo and Juliet",
      "enemy to lovers",
      "bodyguard romance",
      "royal commoner",
      "noble servant",
      "spy and target",
      "assassin and target",
      "vampire and hunter",
      "werewolf and witch",
      "angel and demon",
      "political rivals",
      "arranged marriage rebellion",
      "best friend's ex",
      "celebrity and fan",
      "mafia rivals",
      "rival kingdoms",
      "star-crossed lovers",
      "forbidden magic",
      "secret relationship",
      "love versus destiny",
    ],
  },
  {
    category: "Gate",
    prefix: "forbidden_taboo_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Secrets, risk, discovery, confession, exposure, family conflict, authority conflict, duty, loyalty, separation, sacrifice, peace, and forgiveness should follow scene history and choice.",
    values: [
      "first secret",
      "first risk taken",
      "first discovery scare",
      "first confession",
      "relationship hidden",
      "relationship exposed",
      "family confrontation",
      "authority confrontation",
      "duty versus love",
      "loyalty versus love",
      "war separation",
      "forced breakup",
      "public scandal",
      "runaway route",
      "sacrifice route",
      "redemption route",
      "peace route",
      "forgiveness route",
      "choose each other",
      "happy ending route",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "forbidden_taboo_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Secrecy, forgiveness, betrayal, family acceptance or rejection, scandal, sacrifice, separation, peace, war, duty, compromise, tragedy, hope, or chosen family should follow what the characters choose.",
    values: [
      "secret relationship route",
      "forgiveness route",
      "betrayal route",
      "family acceptance route",
      "family rejection route",
      "public scandal route",
      "runaway together route",
      "sacrifice route",
      "separation route",
      "reunion route",
      "peace between factions",
      "war between factions",
      "redemption route",
      "duty route",
      "love route",
      "compromise route",
      "tragic route",
      "hopeful route",
      "chosen family route",
      "happily ever after route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "forbidden_taboo_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, barrier type, consent state, or player agency needs a different response.",
    values: [
      "We were never supposed to happen.",
      "If they find out, everything changes.",
      "I know what this could cost us.",
      "I still choose you.",
      "You are the one thing I was told I could never have.",
      "Loving you was never the problem. The world is.",
      "I should walk away. I can't.",
      "Every rule says no. My heart says otherwise.",
      "They would call this a mistake.",
      "Then let me make it willingly.",
      "You make me question everything I was taught.",
      "I hate that I want this.",
      "I hate that I don't regret it.",
      "I would rather lose my title than lose you.",
      "We keep meeting at the edge of disaster.",
      "Tell me to leave and I will. Ask me to stay and I won't hesitate.",
      "Maybe destiny was the cage.",
      "Maybe love is choosing each other anyway.",
      "The world says we are wrong.",
      "Then let the world be wrong.",
    ],
  },
] satisfies readonly ForbiddenTabooSeedGroup[]);

export const FORBIDDEN_TABOO_PRESETS = Object.freeze(
  FORBIDDEN_TABOO_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createForbiddenTabooPreset(group, value)),
  ),
) satisfies readonly ForbiddenTabooPreset[];

export const FORBIDDEN_TABOO_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FORBIDDEN_TABOO_PRESETS.map((preset) => preset.category))).sort(),
);

export function findForbiddenTabooPresetById(
  id: string,
): ForbiddenTabooPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FORBIDDEN_TABOO_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getForbiddenTabooPresetsByCategory(
  category: string,
): ForbiddenTabooPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FORBIDDEN_TABOO_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileForbiddenTabooPresetAdditions(
  preset: ForbiddenTabooPreset,
): CompiledForbiddenTabooPresetAdditions {
  const summary = compileForbiddenTabooPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Forbidden/taboo ${preset.category.toLowerCase()} intersection: ${preset.label}.`,
      `Forbidden/taboo trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence secrecy, duty pressure, social cost, moral conflict, political stakes, family pressure, identity tension, or destiny pressure only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Forbidden/taboo intersection guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and barrier gates as soft intersection context layered over other relationship systems; preserve consent, adult scope for power imbalances, boundaries, autonomy, accountability, and player agency.",
    ].join(" "),
  };
}

export function compileForbiddenTabooPresetSummary(
  preset: ForbiddenTabooPreset,
): string {
  return [
    `Forbidden/taboo intersection preset: ${preset.category} - ${preset.label}.`,
    `Forbidden/taboo value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createForbiddenTabooPreset(
  group: ForbiddenTabooSeedGroup,
  value: string,
): ForbiddenTabooPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "forbidden",
    "taboo",
    "intersection",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} forbidden taboo intersection`,
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
    .replace(/'s\b/g, "s")
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
