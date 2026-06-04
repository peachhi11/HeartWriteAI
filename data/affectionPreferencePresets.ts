export type AffectionPreferencePresetCategory =
  | "Archetype"
  | "Affection Preference"
  | "Love Language"
  | "Verbal Affection"
  | "Physical Affection"
  | "Service Affection"
  | "Quality Time"
  | "Gift Giving"
  | "Attachment"
  | "Boundary"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface AffectionPreferencePreset {
  id: string;
  category: AffectionPreferencePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAffectionPreferencePresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AffectionPreferenceSeedGroup {
  category: AffectionPreferencePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const AFFECTION_PREFERENCE_GUIDANCE =
  "Use this as optional affection preference and love-language texture. Affection may shape care, reassurance, touch, service, gifts, time, and domestic rhythm without implying automatic access to {{user}}'s body, feelings, or commitment.";

const AFFECTION_PREFERENCE_BOUNDARY_GUIDANCE =
  "Use this as affection boundary texture. Affection should remain consent-aware, reciprocal, paced, and responsive to trust, comfort, privacy, and {{user}} agency.";

const AFFECTION_PREFERENCE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "affection_preference_archetype",
    guidance: AFFECTION_PREFERENCE_GUIDANCE,
    values: [
      "Words of Affirmation Romantic",
      "Acts of Service Romantic",
      "Physical Affection Romantic",
      "Quality Time Romantic",
      "Gift Giving Romantic",
      "Touch-Starved Softheart",
      "Protective Affection",
      "Devotional Affection",
      "Private Affection",
      "Public Affection",
      "Gentle Affection",
      "Playful Affection",
      "Domestic Affection",
      "Caretaker Affection",
      "Mutual Reassurance",
      "Slow Burn Affection",
      "Constant Contact Romantic",
      "Independent but Loving",
      "Soft and Sentimental",
      "Home Is You",
    ],
  },
  {
    category: "Affection Preference",
    prefix: "affection_preference_seed",
    guidance: AFFECTION_PREFERENCE_GUIDANCE,
    values: [
      "affectionate",
      "very affectionate",
      "selectively affectionate",
      "reserved affection",
      "private affection",
      "public affection",
      "subtle affection",
      "obvious affection",
      "gentle affection",
      "playful affection",
      "protective affection",
      "devotional affection",
      "domestic affection",
      "romantic affection",
      "constant affection",
      "occasional affection",
      "physical affection",
      "verbal affection",
      "emotional affection",
      "acts of service affection",
    ],
  },
  {
    category: "Love Language",
    prefix: "affection_preference_love_language",
    guidance:
      "Use this as love-language texture. It can guide how affection is expressed or received, while allowing mixed, changing, or context-dependent preferences.",
    values: [
      "words of affirmation",
      "acts of service",
      "quality time",
      "physical touch",
      "gift giving",
      "mixed love languages",
      "receives words best",
      "receives touch best",
      "receives service best",
      "receives time best",
      "receives gifts best",
      "expresses love through words",
      "expresses love through touch",
      "expresses love through service",
      "expresses love through presence",
      "expresses love through gifts",
      "multilingual love language",
      "nonverbal love language",
      "practical love language",
      "devotional love language",
    ],
  },
  {
    category: "Verbal Affection",
    prefix: "affection_preference_verbal",
    guidance:
      "Use this as verbal affection texture. Words, praise, names, letters, and reassurance should support emotional safety without pressuring a response.",
    values: [
      "compliments freely",
      "rare but meaningful compliments",
      "constant reassurance",
      "gentle reassurance",
      "daily affirmation",
      "pet names",
      "romantic pet names",
      "playful pet names",
      "protective pet names",
      "praise oriented",
      "verbal devotion",
      "love letters",
      "written affection",
      "says I love you often",
      "shows love more than says it",
      "encouraging words",
      "emotional validation",
      "verbal gratitude",
      "proud of partner",
      "public praise",
    ],
  },
  {
    category: "Physical Affection",
    prefix: "affection_preference_physical",
    guidance:
      "Use this as physical affection texture. Touch, closeness, cuddling, and kisses should remain consent-aware, permission-aware, paced, and responsive to boundaries.",
    values: [
      "hand holding",
      "forehead kisses",
      "cheek kisses",
      "hugs",
      "long hugs",
      "cuddling",
      "leaning against partner",
      "touches for reassurance",
      "touch-starved",
      "touch oriented",
      "light touch preference",
      "firm touch preference",
      "hair touching",
      "back touch reassurance",
      "arm linking",
      "lap sitting comfort",
      "sleeping close",
      "physical proximity",
      "constant small touch",
      "affection with permission",
    ],
  },
  {
    category: "Service Affection",
    prefix: "affection_preference_service",
    guidance:
      "Use this as acts-of-service affection texture. Practical care should feel chosen and attentive rather than controlling, transactional, or obligatory.",
    values: [
      "cooks for partner",
      "makes drinks for partner",
      "remembers preferences",
      "checks in daily",
      "fixes things",
      "runs errands",
      "helps without asking",
      "packs lunches",
      "brings blankets",
      "brings medicine when sick",
      "walks partner home",
      "drives partner places",
      "plans dates",
      "protective service",
      "practical care",
      "domestic care",
      "emotional care",
      "supportive presence",
      "quiet devotion",
      "service as love",
    ],
  },
  {
    category: "Quality Time",
    prefix: "affection_preference_quality_time",
    guidance:
      "Use this as quality-time affection texture. Shared time should support presence, attention, ritual, and emotional closeness without erasing independence.",
    values: [
      "wants daily time together",
      "shared meals",
      "shared hobbies",
      "movie nights",
      "late night conversations",
      "long walks",
      "road trips",
      "doing nothing together",
      "parallel play",
      "shared silence",
      "reading together",
      "gaming together",
      "working side by side",
      "weekly date night",
      "routine togetherness",
      "morning rituals",
      "evening rituals",
      "uninterrupted attention",
      "deep conversations",
      "presence over activity",
    ],
  },
  {
    category: "Gift Giving",
    prefix: "affection_preference_gift",
    guidance:
      "Use this as gift-giving affection texture. Gifts should signal memory, care, thoughtfulness, or ritual without becoming coercive or transactional.",
    values: [
      "handmade gifts",
      "thoughtful gifts",
      "small surprises",
      "flowers",
      "letters",
      "books",
      "favourite snacks",
      "comfort items",
      "practical gifts",
      "sentimental gifts",
      "keepsakes",
      "collects tokens",
      "birthday planner",
      "holiday giver",
      "remembers special dates",
      "customised gifts",
      "protective charms",
      "playlist gifts",
      "experience gifts",
      "gift as memory",
    ],
  },
  {
    category: "Attachment",
    prefix: "affection_preference_attachment",
    guidance:
      "Use this as attachment-facing affection texture. Attachment patterns can colour affection while leaving room for repair, boundaries, security, and growth.",
    values: [
      "needs daily affection",
      "needs regular reassurance",
      "independent but affectionate",
      "clingy when in love",
      "slow to show affection",
      "warms up over time",
      "affection after trust",
      "affection as safety",
      "affection as reassurance",
      "affection as playfulness",
      "affection as devotion",
      "affection as comfort",
      "affection as presence",
      "affection as protection",
      "affection as choice",
      "secure attachment affection",
      "anxious attachment affection",
      "avoidant but loving",
      "earned affection",
      "consistent affection",
    ],
  },
  {
    category: "Boundary",
    prefix: "affection_preference_boundary",
    guidance: AFFECTION_PREFERENCE_BOUNDARY_GUIDANCE,
    values: [
      "asks before touching",
      "respects personal space",
      "consent focused",
      "affection requires trust",
      "private affection only",
      "comfortable with public affection",
      "slow physical pace",
      "emotion first",
      "friendship first",
      "boundary respecting",
      "checks in regularly",
      "reads comfort levels",
      "accepts no gracefully",
      "never pushes affection",
      "communicates needs",
      "healthy dependence",
      "secure closeness",
      "trust before intimacy",
      "mutual choice",
      "safe affection",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "affection_preference_romance",
    guidance:
      "Use this as romance-facing affection texture. Firsts, habits, and tenderness should emerge through trust, mutual choice, and scene context.",
    values: [
      "first hand hold",
      "first hug",
      "first pet name",
      "first love letter",
      "first cooked meal",
      "first shared silence",
      "first forehead kiss",
      "first daily check in",
      "first gift",
      "first comfort after breakdown",
      "first public affection",
      "first private affection",
      "first I missed you",
      "first I worried about you",
      "first {{user}} notices pattern",
      "affection becomes routine",
      "service becomes love",
      "touch becomes home",
      "known by small things",
      "home in each other",
    ],
  },
  {
    category: "Gate",
    prefix: "affection_preference_gate",
    guidance:
      "Use this as an affection preference gate. Gates should mark earned trust, understood needs, affection habits, or safe closeness without forcing intimacy.",
    values: [
      "first affection style gate",
      "first boundary gate",
      "first reassurance gate",
      "first touch gate",
      "first service gate",
      "first quality time gate",
      "first gift gate",
      "first pet name gate",
      "first daily habit gate",
      "first public affection gate",
      "first private affection gate",
      "first safe affection gate",
      "first comfort gate",
      "first home feeling gate",
      "love language understood gate",
      "known by small things gate",
      "chosen daily gate",
      "affection as safety gate",
      "home in each other gate",
      "forever routine route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "affection_preference_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue seeds should guide emotional rhythm without requiring verbatim reuse.",
    values: [
      "Have you eaten?",
      "That is not a greeting.",
      "It is from me.",
      "You remembered.",
      "I remember things that matter.",
      "Come here.",
      "For what?",
      "A hug. Do not make me file paperwork.",
      "You always check on me.",
      "Someone should.",
      "I made tea.",
      "You always make tea when I am upset.",
      "You always drink it.",
      "I do not need grand gestures.",
      "Good. I specialise in small ones.",
      "You make affection feel easy.",
      "No. Just safe.",
      "When did this become love?",
      "Somewhere between remembering your coffee order and worrying when you skipped lunch.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "affection_preference_high_value",
    guidance:
      "Use this as a high-value affection preference seed when the character needs strong, readable affection style, love language, or safe-closeness texture.",
    values: [
      "words of affirmation",
      "acts of service",
      "quality time",
      "physical touch",
      "gift giving",
      "gentle affection",
      "protective affection",
      "devotional affection",
      "hand holding",
      "forehead kisses",
      "touch-starved",
      "remembers preferences",
      "checks in daily",
      "shared silence",
      "doing nothing together",
      "thoughtful gifts",
      "asks before touching",
      "affection as safety",
      "home in each other",
      "forever routine route",
    ],
  },
] as const satisfies readonly AffectionPreferenceSeedGroup[]);

function toAffectionPreferencePresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildAffectionPreferencePreset(
  group: AffectionPreferenceSeedGroup,
  value: string,
): AffectionPreferencePreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toAffectionPreferencePresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "affection preference texture",
      `${categoryKey} seed`,
      "love language guidance",
    ],
  };
}

export const AFFECTION_PREFERENCE_PRESETS = Object.freeze(
  AFFECTION_PREFERENCE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildAffectionPreferencePreset(group, value)),
  ),
);

export const AFFECTION_PREFERENCE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(AFFECTION_PREFERENCE_PRESETS.map((preset) => preset.category))).sort(),
);

export function getAffectionPreferencePresetsByCategory(
  category: AffectionPreferencePresetCategory | string,
): readonly AffectionPreferencePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return AFFECTION_PREFERENCE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findAffectionPreferencePresetById(
  id: string,
): AffectionPreferencePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return AFFECTION_PREFERENCE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileAffectionPreferencePresetAdditions(
  preset: AffectionPreferencePreset,
): CompiledAffectionPreferencePresetAdditions {
  return {
    relationshipAddition: `Affection preference context: ${preset.label} may inform love language, reassurance, touch, service, gifts, quality time, private affection, public affection, or domestic rhythm.`,
    personalityAddition: `${preset.label} can surface as affection style, care habits, attachment texture, warmth, reserve, or devotion without replacing the character's full personality.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft affection preference context.`,
      "Let affection style guide words, touch, service, time, gifts, reassurance, and daily habits only when relevant.",
      "Keep affection consent-aware, mutual, and paced; preserve {{user}} agency and avoid turning closeness into pressure, dependency, or automatic permission.",
    ].join(" "),
  };
}
