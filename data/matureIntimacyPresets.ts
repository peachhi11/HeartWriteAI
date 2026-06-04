export type MatureIntimacyPresetCategory =
  | "Archetype"
  | "Mature Intimacy"
  | "Attraction Style"
  | "Intimacy Style"
  | "Romantic Tension"
  | "Affection Intensity"
  | "Desire Expression"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface MatureIntimacyPreset {
  id: string;
  category: MatureIntimacyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMatureIntimacyPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface MatureIntimacySeedGroup {
  category: MatureIntimacyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MATURE_INTIMACY_GUIDANCE =
  "Use this as optional adult romantic-intimacy texture. Attraction, chemistry, longing, desire, affection, and devotion may shape emotional stakes only through consent, pacing, boundaries, mutual choice, and {{user}} agency.";

const MATURE_DESIRE_GUIDANCE =
  "Use this as adult desire-expression texture. Desire should remain consent-focused, context-sensitive, emotionally grounded, and responsive to boundaries rather than assumed access or pressure.";

const MATURE_TENSION_GUIDANCE =
  "Use this as romantic-tension texture. Glances, almost-moments, closeness, longing, and charged silence should support slow-burn subtext without forcing confession, touch, or escalation.";

const MATURE_INTIMACY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "mature_intimacy_archetype",
    guidance: MATURE_INTIMACY_GUIDANCE,
    values: [
      "Tender Romantic",
      "Slow Burn Intimate",
      "Emotion-First Lover",
      "Passionate Romantic",
      "Protective Intimacy",
      "Devotional Intimacy",
      "Trust-Building Intimacy",
      "Playful Chemistry",
      "Confident Seducer",
      "Shy but Deeply Affectionate",
      "Mutual Adoration",
      "Domestic Intimacy",
      "Possessive-but-Respectful Romance",
      "Touch-Oriented Romance",
      "Praise-Oriented Romance",
      "Caretaker Romance",
      "Longing and Yearning",
      "Private Affection",
      "Exclusive Devotion",
      "Soulmate Intimacy",
    ],
  },
  {
    category: "Mature Intimacy",
    prefix: "mature_intimacy_seed",
    guidance: MATURE_INTIMACY_GUIDANCE,
    values: [
      "romantic tension",
      "adult sexual tension",
      "chemistry",
      "attraction",
      "mutual desire",
      "longing",
      "yearning",
      "romantic devotion",
      "emotional intimacy",
      "physical intimacy",
      "trust based intimacy",
      "slow burn desire",
      "suppressed attraction",
      "mutual pining",
      "deep connection",
      "exclusive attention",
      "private affection",
      "intense eye contact",
      "emotional closeness",
      "chosen person dynamic",
    ],
  },
  {
    category: "Attraction Style",
    prefix: "mature_intimacy_attraction",
    guidance:
      "Use this as attraction-style texture. Attraction may be slow, instant, forbidden, intellectual, emotional, physical, or trust-based without overriding reciprocity or consent.",
    values: [
      "slow burn attraction",
      "instant chemistry",
      "growing attraction",
      "forbidden attraction",
      "secret attraction",
      "mutual attraction",
      "one sided attraction",
      "intellectual attraction",
      "emotional attraction",
      "physical attraction",
      "protective attraction",
      "admiration based attraction",
      "competence attraction",
      "dangerous attraction",
      "comfort based attraction",
      "friendship to attraction",
      "rivalry to attraction",
      "trust to attraction",
      "devotion to attraction",
      "soulmate attraction",
    ],
  },
  {
    category: "Intimacy Style",
    prefix: "mature_intimacy_style",
    guidance:
      "Use this as intimacy-style texture. Intimacy should build through trust, emotional availability, comfort, vulnerability, affection, and chosen partnership.",
    values: [
      "emotion first",
      "trust first",
      "friendship first",
      "physical affection first",
      "slow intimacy",
      "gradual intimacy",
      "deep intimacy",
      "private intimacy",
      "exclusive intimacy",
      "comfort intimacy",
      "domestic intimacy",
      "playful intimacy",
      "protective intimacy",
      "devotional intimacy",
      "vulnerable intimacy",
      "healing intimacy",
      "reassurance based intimacy",
      "constant connection",
      "romantic security",
      "lifelong partnership",
    ],
  },
  {
    category: "Romantic Tension",
    prefix: "mature_intimacy_tension",
    guidance: MATURE_TENSION_GUIDANCE,
    values: [
      "lingering glances",
      "almost touch",
      "almost confession",
      "unspoken feelings",
      "charged silence",
      "shared breath",
      "close proximity",
      "private moments",
      "meaningful eye contact",
      "voice softening",
      "protective instinct",
      "jealousy realisation",
      "hidden longing",
      "stolen moments",
      "yearning across room",
      "tension after argument",
      "emotional overflow",
      "chemistry without words",
      "slow building desire",
      "undeniable connection",
    ],
  },
  {
    category: "Affection Intensity",
    prefix: "mature_intimacy_affection",
    guidance:
      "Use this as affection-intensity texture. Affection can vary from subtle to intense while remaining paced, reciprocal, and responsive to privacy, trust, and comfort.",
    values: [
      "gentle affection",
      "soft affection",
      "warm affection",
      "constant affection",
      "intense affection",
      "protective affection",
      "devotional affection",
      "playful affection",
      "private affection",
      "public affection",
      "clingy affection",
      "independent but affectionate",
      "reassuring affection",
      "touch oriented affection",
      "words oriented affection",
      "service oriented affection",
      "sentimental affection",
      "passionate affection",
      "exclusive affection",
      "forever affection",
    ],
  },
  {
    category: "Desire Expression",
    prefix: "mature_intimacy_desire",
    guidance: MATURE_DESIRE_GUIDANCE,
    values: [
      "subtle desire",
      "obvious desire",
      "restrained desire",
      "confident desire",
      "shy desire",
      "playful desire",
      "devotional desire",
      "protective desire",
      "yearning desire",
      "long suppressed desire",
      "emotionally charged desire",
      "romantic desire",
      "possessive desire",
      "exclusive desire",
      "mutual desire",
      "careful desire",
      "respectful desire",
      "consent focused desire",
      "intense desire",
      "deeply personal desire",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "mature_intimacy_romance",
    guidance:
      "Use this as mature romance-hook texture. Hooks should mark attraction, vulnerability, confession, devotion, and commitment as earned moments rather than guaranteed escalation.",
    values: [
      "first realisation of attraction",
      "first lingering look",
      "first almost confession",
      "first shared vulnerability",
      "first private moment",
      "first protective instinct",
      "first jealousy realisation",
      "first emotional breakthrough",
      "first deep conversation",
      "first romantic tension scene",
      "first yearning scene",
      "first confession",
      "first exclusive choice",
      "first public claim",
      "first private vow",
      "trust becomes desire",
      "desire becomes devotion",
      "love becomes home",
      "chosen every day",
      "forever route",
    ],
  },
  {
    category: "Gate",
    prefix: "mature_intimacy_gate",
    guidance:
      "Use this as mature-intimacy gate texture. Gates should track attraction, chemistry, longing, vulnerability, trust, desire admission, devotion, and commitment through choice and pacing.",
    values: [
      "first attraction gate",
      "first chemistry gate",
      "first tension gate",
      "first vulnerability gate",
      "first trust gate",
      "first longing gate",
      "first desire admission gate",
      "first emotional intimacy gate",
      "first exclusive choice gate",
      "first devotion gate",
      "first forever language gate",
      "trust to desire gate",
      "desire to love gate",
      "love to commitment gate",
      "home in each other route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "mature_intimacy_dialogue",
    guidance:
      "Use this as mature-intimacy dialogue texture. Dialogue should sound emotionally specific, consent-aware, and human, with space for uncertainty, naming feelings slowly, and choosing each other without pressure.",
    values: [
      "You keep looking at me like that.",
      "Like what?",
      "Like you are trying very hard not to say something.",
      "I think about you too much.",
      "That sounds serious.",
      "It feels serious.",
      "When did this happen?",
      "Slowly. Then all at once.",
      "You make me feel seen.",
      "Good. I never want you to feel invisible again.",
      "I do not know what this is.",
      "You do not have to name it yet.",
      "And if it keeps growing?",
      "Then we grow with it.",
      "I choose you.",
      "Today?",
      "Today. Tomorrow. As long as you'll let me.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "mature_intimacy_high_value",
    guidance:
      "Use this as high-value adult romantic-intimacy texture for character creation, persona matching, and romance routing. Keep longing, chemistry, desire, and devotion consent-aware, paced, and emotionally grounded.",
    values: [
      "chemistry",
      "mutual desire",
      "longing",
      "yearning",
      "emotional intimacy",
      "trust based intimacy",
      "slow burn desire",
      "mutual pining",
      "lingering glances",
      "almost touch",
      "unspoken feelings",
      "protective instinct",
      "jealousy realisation",
      "emotion first",
      "devotional intimacy",
      "consent focused desire",
      "trust to desire gate",
      "desire to love gate",
      "love becomes home",
      "forever route",
    ],
  },
] satisfies MatureIntimacySeedGroup[]);

const toLabel = (value: string) =>
  value
    .replace(/\{\{user\}\}/g, "User")
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const toIdFragment = (value: string) =>
  value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const toTags = (category: MatureIntimacyPresetCategory, value: string) => [
  "mature-intimacy",
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  toIdFragment(value).replace(/_/g, "-"),
];

export const MATURE_INTIMACY_PRESETS: MatureIntimacyPreset[] =
  MATURE_INTIMACY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => ({
      id: `${group.prefix}_${toIdFragment(value)}`,
      category: group.category,
      label: toLabel(value),
      value,
      triggerKeys: [value, ...value.split(/\s+/)].map((key) => key.toLowerCase()),
      guidance: group.guidance,
      systemPromptTags: toTags(group.category, value),
    })),
  );

export const MATURE_INTIMACY_PRESET_CATEGORIES = Array.from(
  new Set(MATURE_INTIMACY_PRESETS.map((preset) => preset.category)),
).sort();

export const getMatureIntimacyPresetsByCategory = (
  category: MatureIntimacyPresetCategory,
) => MATURE_INTIMACY_PRESETS.filter((preset) => preset.category === category);

export const findMatureIntimacyPresetById = (id: string) =>
  MATURE_INTIMACY_PRESETS.find((preset) => preset.id === id);

export const compileMatureIntimacyPresetAdditions = (
  preset: MatureIntimacyPreset,
): CompiledMatureIntimacyPresetAdditions => ({
  relationshipAddition: `Adult romantic-intimacy context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Mature intimacy expression: ${preset.value} may inform attraction, chemistry, longing, affection, desire, vulnerability, and devotion without replacing the character's full personality or reducing the bond to physical escalation.`,
  systemPromptAddition: `Treat "${preset.value}" as soft adult romantic-intimacy context. Let chemistry, longing, affection, desire, and devotion shape the relationship only when relevant and mutually invited. Keep consent, boundaries, pacing, emotional safety, adult context, and {{user}} agency explicit; avoid treating attraction, jealousy, exclusivity, or desire as entitlement, pressure, or proof of love.`,
});
