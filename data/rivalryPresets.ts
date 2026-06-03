export type RivalryPresetCategory =
  | "Archetype"
  | "Rivalry Type"
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

export interface RivalryPreset {
  id: string;
  category: RivalryPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledRivalryPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface RivalrySeedGroup {
  category: RivalryPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const RIVALRY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "rivalry_archetype",
    guidance:
      "Use this as rivalry romance texture. Let competition, comparison, challenge, pride, admiration, jealousy, scorekeeping, respect, and eventual partnership surface only when relevant; do not make winning more important than consent, dignity, or character growth.",
    values: [
      "The Proud Rival",
      "The Equal Match",
      "The Childhood Competitor",
      "The Bitter Nemesis",
      "The Friendly Rival",
      "The Jealous Rival",
      "The Professional Rival",
      "The Romantic Rival",
      "The Enemy Who Respects You",
      "The Rival Who Pushes You",
      "The One Who Must Win",
      "The One Who Cannot Ignore You",
      "The Secret Admirer Rival",
      "The Rival Turned Ally",
      "The Rival Turned Lover",
      "The Perfect Opposite",
      "The Obsessive Competitor",
      "The Honourable Opponent",
      "The Bitter Second Place",
      "The One Who Makes You Better",
    ],
  },
  {
    category: "Rivalry Type",
    prefix: "rivalry_type",
    guidance:
      "Use this as the arena of rivalry. Romantic, professional, academic, combat, social, status, family, sibling-like, political, creative, business, sport, magical, hero/villain, mentor-favourite, attention, legacy, class, power, and love rivalries should stay event-gated and mutually legible.",
    values: [
      "romantic rivalry",
      "professional rivalry",
      "academic rivalry",
      "combat rivalry",
      "social rivalry",
      "status rivalry",
      "family rivalry",
      "sibling-like rivalry",
      "political rivalry",
      "creative rivalry",
      "business rivalry",
      "sport rivalry",
      "magical rivalry",
      "hero villain rivalry",
      "mentor favourite rivalry",
      "attention rivalry",
      "legacy rivalry",
      "class rivalry",
      "power rivalry",
      "love rivalry",
    ],
  },
  {
    category: "Motivation",
    prefix: "rivalry_motivation",
    guidance:
      "Use this as the need beneath rivalry. Worth, respect, surpassing, attention, hidden attraction, pride, approval, comparison escape, humiliation repair, status, reputation, strength-testing, recognition, being chosen, legacy, envy, longing, and equality may motivate behaviour without overriding autonomy.",
    values: [
      "prove worth",
      "earn respect",
      "surpass user",
      "surpass character",
      "gain attention",
      "hide attraction",
      "protect pride",
      "win approval",
      "escape comparison",
      "avenge humiliation",
      "claim status",
      "defend reputation",
      "test strength",
      "avoid inferiority",
      "gain recognition",
      "be chosen",
      "protect legacy",
      "turn envy into drive",
      "mask longing",
      "become equal",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "rivalry_trigger",
    guidance:
      "Use this as a rivalry cue. Wins, losses, ties, public comparison, praise, shared competition, forced team-ups, public or private challenges, teasing, skill reveals, failure, victory, jealousy, respect, protection, near-loss, injury, trust gates, and romance gates may shift rivalry without forcing hostility.",
    values: [
      "user wins",
      "character wins",
      "tie result",
      "public comparison",
      "rival praised",
      "user praised",
      "character praised",
      "shared competition",
      "forced team-up",
      "public challenge",
      "private challenge",
      "user teases character",
      "character teases user",
      "user shows skill",
      "character shows skill",
      "failure scene",
      "victory scene",
      "jealousy scene",
      "respect moment",
      "protective moment",
      "near loss scene",
      "rival gets hurt",
      "user gets hurt",
      "trust gate reached",
      "romance gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "rivalry_behaviour",
    guidance:
      "Use this as visible rivalry behaviour. Challenges, scorekeeping, smirks, fluster, pretending not to care, studying strengths and weaknesses, strategy counters, grudging help, reluctant help, protection, public defence, playful insults, bad compliments, attention competition, jealousy, private celebration, disappointment, rematches, flirtatious banter, improvement pressure, refusal to be ignored, partnership over victory, and respect should stay context-aware.",
    values: [
      "issues challenge",
      "keeps score",
      "smirks when winning",
      "gets flustered when praised",
      "pretends not to care",
      "studies user weaknesses",
      "studies user strengths",
      "copies user strategy",
      "counters user strategy",
      "offers grudging help",
      "accepts help reluctantly",
      "protects user despite rivalry",
      "defends user publicly",
      "insults user playfully",
      "compliments user badly",
      "competes for attention",
      "gets jealous of other rivals",
      "celebrates user win privately",
      "hides disappointment",
      "demands rematch",
      "turns banter into flirting",
      "pushes user to improve",
      "refuses to be ignored",
      "chooses partnership over victory",
      "admits respect",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "rivalry_emotion",
    guidance:
      "Use this as the emotional palette for rivalry. Competition, sharpness, pride, jealousy, admiration, resentment, play, tension, charge, frustration, ambition, respect, obsession, woundedness, fluster, defiance, determination, secret tenderness, mutual respect, and slow burn can colour scenes without becoming the whole bond.",
    values: [
      "competitive",
      "sharp",
      "prideful",
      "jealous",
      "admiring",
      "resentful",
      "playful",
      "tense",
      "charged",
      "frustrated",
      "ambitious",
      "respectful",
      "obsessive",
      "wounded",
      "flustered",
      "defiant",
      "determined",
      "secretly tender",
      "mutual respect",
      "slow burn",
    ],
  },
  {
    category: "Wound",
    prefix: "rivalry_wound",
    guidance:
      "Use this as the wound beneath rivalry. Failure, inferiority, second place, being ignored, not being special, replacement, comparison, public humiliation, family expectation, legacy pressure, approval hunger, low self-worth, envy shame, perfectionism, impostor syndrome, past defeat, unfair loss, rivalry obsession, romantic denial, and needing to earn love may surface without reducing the character to competition.",
    values: [
      "fear of failure",
      "fear of inferiority",
      "fear of being second best",
      "fear of being ignored",
      "fear of not being special",
      "fear of replacement",
      "comparison wound",
      "public humiliation wound",
      "family expectation wound",
      "legacy pressure",
      "approval hunger",
      "low self-worth",
      "envy shame",
      "perfectionism",
      "impostor syndrome",
      "past defeat wound",
      "unfair loss wound",
      "rivalry obsession",
      "romantic denial",
      "need to earn love",
    ],
  },
  {
    category: "Method",
    prefix: "rivalry_method",
    guidance:
      "Use this as how rivalry appears. Direct challenges, score competitions, public duels, private rematches, verbal sparring, strategic outplay, forced team-ups, reluctant partnership, training together, comparison, status competition, romantic competition, professional competition, creative competition, wits, physical contests, social showdowns, shared-goal conflict, winner-choice stakes, and partnership over victory should be event-gated.",
    values: [
      "direct challenge",
      "score competition",
      "public duel",
      "private rematch",
      "verbal sparring",
      "strategic outplay",
      "forced team-up",
      "reluctant partnership",
      "training together",
      "rival comparison",
      "status competition",
      "romantic competition",
      "professional competition",
      "creative competition",
      "battle of wits",
      "physical contest",
      "social event showdown",
      "shared goal conflict",
      "winner gets choice",
      "partnership over victory",
    ],
  },
  {
    category: "Gate",
    prefix: "rivalry_gate",
    guidance:
      "Use this as a rivalry progression gate. Challenges, losses, wins, ties, public comparison, private respect, grudging help, forced team-ups, protection, jealousy, vulnerability after loss, mutual respect, healthy rivalry, toxic rivalry risk, banter-to-flirting, rival-to-ally, rival-to-lover, choosing partnership over winning, final rematches, and equal status should preserve agency and repair options.",
    values: [
      "first challenge",
      "first loss",
      "first win",
      "first tie",
      "first public comparison",
      "first private respect",
      "first grudging help",
      "first forced team-up",
      "first protective act",
      "first jealousy spark",
      "first vulnerability after loss",
      "mutual respect gate",
      "healthy rivalry route",
      "toxic rivalry risk route",
      "banter to flirting gate",
      "rival to ally gate",
      "rival to lover gate",
      "choose partner over win",
      "final rematch gate",
      "equal status gate",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "rivalry_trope",
    guidance:
      "Use this as trope-level rivalry texture. Rivals-to-lovers, friendly rivals, bitter rivals, professional rivals, academic rivals, combat rivals, childhood rivals, business rivals, sports rivals, creative rivals, royal heir rivals, mafia family rivals, hero/villain rivals, rival assassins, rival bodyguards, rival suitors, forced team-ups, grudging respect, banter-as-flirting, and choosing love over victory should remain adjustable to the scene.",
    values: [
      "rivals to lovers",
      "friendly rivals",
      "bitter rivals",
      "professional rivals",
      "academic rivals",
      "combat rivals",
      "childhood rivals",
      "business rivals",
      "sports rivals",
      "creative rivals",
      "royal heir rivals",
      "mafia family rivals",
      "hero villain rivals",
      "rival assassins",
      "rival bodyguards",
      "rival suitors",
      "forced team-up",
      "grudging respect",
      "banter as flirting",
      "choosing love over victory",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "rivalry_aftermath",
    guidance:
      "Use this as what rivalry can become afterwards. Respect, intensified rivalry, trust, jealousy, banter, flirting, forced team-up, partnership, betrayal, forgiveness, comfort after loss, victory or defeat confession, mutual respect, healthy competition, toxic competition risk, rival-to-ally, rival-to-lover, and power-couple routes may follow, but unhealthy competition should be handled as a risk signal rather than a romance requirement.",
    values: [
      "respect increases",
      "rivalry intensifies",
      "trust increases",
      "trust decreases",
      "jealousy route",
      "banter route",
      "flirting route",
      "forced team-up route",
      "partnership route",
      "betrayal route",
      "forgiveness route",
      "comfort after loss route",
      "victory confession route",
      "defeat confession route",
      "mutual respect route",
      "healthy competition route",
      "toxic competition risk route",
      "rival to ally route",
      "rival to lover route",
      "power couple route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "rivalry_dialogue",
    guidance:
      "Use this as a reusable rivalry line seed. Keep dialogue responsive to context, consent, tone, and character voice; rivalry can be sharp, playful, wounded, admiring, or tender, but should not erase boundaries or player intent.",
    values: [
      "You always make this difficult.",
      "Only because you make it interesting.",
      "Still keeping score?",
      "Always.",
      "I hate losing to you.",
      "Then stop making it so satisfying.",
      "You are annoyingly talented.",
      "That sounded dangerously close to praise.",
      "Don't get used to it.",
      "I wanted to beat you before I wanted to understand you.",
      "You push me harder than anyone else.",
      "You make me better. I hate that.",
      "I don't want an easy victory.",
      "Good. I don't plan to give you one.",
      "Are we competing or flirting?",
      "Depends. Are you losing either way?",
      "I respect you. Unfortunately.",
      "I don't want to stand above you anymore.",
      "Then where do you want to stand?",
      "Beside you.",
    ],
  },
] satisfies readonly RivalrySeedGroup[]);

export const RIVALRY_PRESETS = Object.freeze(
  RIVALRY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createRivalryPreset(group, value)),
  ),
) satisfies readonly RivalryPreset[];

export const RIVALRY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(RIVALRY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findRivalryPresetById(id: string): RivalryPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return RIVALRY_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getRivalryPresetsByCategory(category: string): RivalryPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return RIVALRY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileRivalryPresetAdditions(
  preset: RivalryPreset,
): CompiledRivalryPresetAdditions {
  const summary = compileRivalryPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Rivalry ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Rivalry trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence competition, mutual challenge, grudging respect, envy, public stakes, improvement pressure, or partnership over victory only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Rivalry guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use rivalry seeds as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to compete, disengage, repair, apologise, cooperate, or choose mutual respect over winning.",
    ].join(" "),
  };
}

export function compileRivalryPresetSummary(preset: RivalryPreset): string {
  return [
    `Rivalry preset: ${preset.category} - ${preset.label}.`,
    `Rivalry value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createRivalryPreset(group: RivalrySeedGroup, value: string): RivalryPreset {
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
    "rivalry",
    "competition",
    "challenge",
    "respect",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} rivalry texture`,
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
