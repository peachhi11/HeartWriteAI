export type LikesDislikesPresetCategory =
  | "Archetype"
  | "Like"
  | "Dislike"
  | "Sensory Like"
  | "Sensory Dislike"
  | "Romance Like"
  | "Romance Dislike"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface LikesDislikesPreset {
  id: string;
  category: LikesDislikesPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledLikesDislikesPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface LikesDislikesSeedGroup {
  category: LikesDislikesPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const LIKES_DISLIKES_GUIDANCE =
  "Use this as likes and dislikes texture. Preferences, aversions, sensory needs, boundaries, remembered details, and ordinary comfort may shape scenes without replacing personality, consent, or {{user}} agency.";

const LIKES_DISLIKES_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "likes_dislikes_archetype",
    guidance: LIKES_DISLIKES_GUIDANCE,
    values: [
      "The Cosy Romantic",
      "The Luxury Taste Character",
      "The Simple Pleasures Type",
      "The Sensory Seeker",
      "The Practical Minimalist",
      "The Secret Softie",
      "The Night Owl",
      "The Morning Person",
      "The Food Lover",
      "The Book Lover",
      "The Music Lover",
      "The Fashion-Conscious One",
      "The Outdoorsy Type",
      "The Homebody",
      "The Social Butterfly",
      "The Touch-Starved Softheart",
      "The Privacy Lover",
      "The Chaos Enjoyer",
      "The Routine Lover",
      "The One With Very Specific Preferences",
    ],
  },
  {
    category: "Like",
    prefix: "likes_dislikes_like",
    guidance:
      "Use this as positive preference texture. Likes may reveal comfort, softness, routine, memory, values, and the small details that make intimacy feel personal.",
    values: [
      "quiet mornings",
      "rainy days",
      "late night talks",
      "warm drinks",
      "strong coffee",
      "tea",
      "home cooked meals",
      "comfort food",
      "fresh bread",
      "sweet desserts",
      "spicy food",
      "midnight snacks",
      "soft blankets",
      "clean sheets",
      "candles",
      "old books",
      "bookstores",
      "libraries",
      "handwritten letters",
      "pressed flowers",
      "vinyl records",
      "sad music",
      "old love songs",
      "dancing in private",
      "long walks",
      "stargazing",
      "city lights",
      "ocean air",
      "forest paths",
      "fireplaces",
      "sunsets",
      "stormy weather",
      "quiet touch",
      "hand holding",
      "forehead kisses",
      "being remembered",
      "small gifts",
      "inside jokes",
      "shared silence",
      "acts of service",
      "honest conversations",
      "loyalty",
      "softness",
      "routine",
      "privacy",
      "personal space",
      "beautiful clothes",
      "practical clothes",
      "antique objects",
      "fresh flowers",
      "animals",
      "gardens",
      "music playlists",
      "movie nights",
      "cooking together",
      "being useful",
      "protecting others",
      "being chosen",
    ],
  },
  {
    category: "Dislike",
    prefix: "likes_dislikes_dislike",
    guidance:
      "Use this as aversion and boundary texture. Dislikes may reveal limits, past discomfort, sensory needs, fear, self-protection, or values that deserve respect.",
    values: [
      "loud crowds",
      "forced small talk",
      "being rushed",
      "being touched without permission",
      "dishonesty",
      "empty flattery",
      "public humiliation",
      "being ignored",
      "being pitied",
      "being controlled",
      "broken promises",
      "messy rooms",
      "cold weather",
      "hot weather",
      "bitter food",
      "overly sweet food",
      "cheap perfume",
      "strong noise",
      "bright lights",
      "early mornings",
      "late nights",
      "unexpected visitors",
      "formal events",
      "family pressure",
      "gossip",
      "needless cruelty",
      "wasted food",
      "being lied to for their own good",
      "losing control",
      "asking for help",
      "being vulnerable in public",
      "unfinished tasks",
      "waiting",
      "uncertainty",
      "chaos",
      "strict rules",
      "authority figures",
      "being underestimated",
      "being overprotected",
      "people touching their things",
      "interrupted sleep",
      "bad coffee",
      "small enclosed spaces",
      "hospitals",
      "weapons drawn carelessly",
      "needless risk",
      "being called soft",
      "being used",
      "feeling replaceable",
      "goodbyes",
    ],
  },
  {
    category: "Sensory Like",
    prefix: "likes_dislikes_sensory_like",
    guidance:
      "Use this as sensory comfort texture. Sensory likes may ground scenes through body-level ease, safety, memory, and small atmospheric details.",
    values: [
      "warm sunlight",
      "cool rain",
      "soft fabric",
      "silk texture",
      "wool sweaters",
      "leather scent",
      "old paper smell",
      "fresh coffee smell",
      "baking bread smell",
      "woodsmoke",
      "lavender",
      "jasmine",
      "citrus",
      "salt air",
      "clean laundry",
      "low music",
      "deep voices",
      "quiet rooms",
      "candlelight",
      "soft laughter",
    ],
  },
  {
    category: "Sensory Dislike",
    prefix: "likes_dislikes_sensory_dislike",
    guidance:
      "Use this as sensory aversion texture. Sensory dislikes should support care, boundaries, and grounding rather than treating discomfort as a joke.",
    values: [
      "scratchy fabric",
      "sticky hands",
      "stale air",
      "chemical smells",
      "too much perfume",
      "greasy food texture",
      "mushroom texture",
      "loud chewing",
      "metallic sounds",
      "sudden bangs",
      "crowded rooms",
      "overheated rooms",
      "fluorescent lights",
      "wet socks",
      "cold hands",
      "itchy tags",
      "smoke smell",
      "bitter aftertaste",
      "silence after argument",
      "touch when startled",
    ],
  },
  {
    category: "Romance Like",
    prefix: "likes_dislikes_romance_like",
    guidance:
      "Use this as romance preference texture. Romantic likes may guide affection style, reassurance, pacing, privacy, and how the character feels safely chosen.",
    values: [
      "slow courtship",
      "clear reassurance",
      "private affection",
      "public claiming",
      "subtle flirting",
      "teasing banter",
      "love letters",
      "pet names",
      "being walked home",
      "shared meals",
      "forehead touch",
      "hand holding under table",
      "being checked on",
      "being defended",
      "being listened to",
      "being chosen publicly",
      "being seen without performing",
      "comfortable silence",
      "soft domesticity",
      "loyal devotion",
    ],
  },
  {
    category: "Romance Dislike",
    prefix: "likes_dislikes_romance_dislike",
    guidance:
      "Use this as romance boundary texture. Romantic dislikes should protect consent, trust, privacy, pacing, and emotional honesty.",
    values: [
      "jealousy games",
      "mixed signals",
      "public pressure",
      "forced confessions",
      "possessiveness without trust",
      "love bombing",
      "performative romance",
      "being hidden forever",
      "being used for status",
      "being saved without consent",
      "being called needy",
      "rushed intimacy",
      "unkept promises",
      "emotional withholding",
      "silent treatment",
      "flirting used as manipulation",
      "being compared to exes",
      "romance as transaction",
      "control disguised as care",
      "goodbye without explanation",
    ],
  },
  {
    category: "Gate",
    prefix: "likes_dislikes_gate",
    guidance:
      "Use this as an optional event gate. Likes and dislikes should surface through remembered details, respected limits, and lived interaction rather than static exposition.",
    values: [
      "first preference reveal gate",
      "first dislike reveal gate",
      "first {{user}} remembers like gate",
      "first {{user}} respects dislike gate",
      "first shared preference gate",
      "first opposite taste gate",
      "first comfort item gate",
      "first triggered dislike gate",
      "first private soft preference gate",
      "first gift based on like gate",
      "first boundary based on dislike gate",
      "known by small things gate",
      "preference as intimacy gate",
      "taste as love language gate",
      "home in habits route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "likes_dislikes_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: [
      "You remembered I like that.",
      "I remember small things when they are yours.",
      "I hate being rushed.",
      "Then we will go slowly.",
      "You do not like crowds, do you?",
      "I like them less when I have nowhere to stand.",
      "Then stand with me.",
      "You brought tea.",
      "You said coffee makes your hands shake.",
      "I said that once.",
      "I was listening.",
      "Do not touch my things.",
      "I will ask first.",
      "That should not feel as kind as it does.",
      "You hate goodbyes.",
      "Everyone leaves after them.",
      "Then I will say see you soon.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "likes_dislikes_high_value",
    guidance:
      "Use this as a high-signal likes and dislikes seed. These are compact selectors for character creation, matching, and preset search.",
    values: [
      "being remembered",
      "shared silence",
      "acts of service",
      "loyalty",
      "quiet touch",
      "hand holding",
      "comfort food",
      "old books",
      "late night talks",
      "being chosen",
      "dishonesty",
      "being controlled",
      "broken promises",
      "being touched without permission",
      "being hidden forever",
      "rushed intimacy",
      "public humiliation",
      "goodbyes",
      "{{user}} remembers like gate",
      "taste as love language gate",
    ],
  },
] satisfies readonly LikesDislikesSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: LikesDislikesSeedGroup,
  value: string,
): LikesDislikesPreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(
    new Set([
      value,
      ...value
        .toLowerCase()
        .replace(/\{\{user\}\}/g, "user")
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

export const LIKES_DISLIKES_PRESETS = LIKES_DISLIKES_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const LIKES_DISLIKES_PRESET_CATEGORIES = Array.from(
  new Set(LIKES_DISLIKES_PRESETS.map((preset) => preset.category)),
).sort();

export const getLikesDislikesPresetsByCategory = (
  category: LikesDislikesPresetCategory,
) => LIKES_DISLIKES_PRESETS.filter((preset) => preset.category === category);

export const findLikesDislikesPresetById = (id: string) =>
  LIKES_DISLIKES_PRESETS.find((preset) => preset.id === id);

export const compileLikesDislikesPresetAdditions = (
  preset: LikesDislikesPreset,
): CompiledLikesDislikesPresetAdditions => ({
  backgroundAddition: `Likes and dislikes context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Likes and dislikes texture may include ${preset.value} without replacing the character's full personality, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft likes and dislikes context.`,
    "Let preferences, aversions, sensory needs, boundaries, routines, remembered details, and comfort cues shape behaviour when relevant.",
    "Keep consent, privacy, boundaries, and {{user}} autonomy intact; disliked things should be respected rather than used to force reactions.",
  ].join(" "),
});
