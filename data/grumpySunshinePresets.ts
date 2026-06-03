export type GrumpySunshinePresetCategory =
  | "Archetype"
  | "Dynamic Type"
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

export interface GrumpySunshinePreset {
  id: string;
  category: GrumpySunshinePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledGrumpySunshinePresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface GrumpySunshineSeedGroup {
  category: GrumpySunshinePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const GRUMPY_SUNSHINE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "grumpy_sunshine_archetype",
    guidance:
      "Use this as grumpy/sunshine romance texture. Let contrast, warmth, guardedness, caretaking, teasing, emotional thaw, and hidden sadness surface when relevant without making either character responsible for fixing the other.",
    values: [
      "The Grumpy Protector",
      "The Sunshine Healer",
      "The Brooding Loner",
      "The Cheerful Optimist",
      "The Cold One Softens",
      "The Smiling Chaos",
      "The Cynic and the Dreamer",
      "The Stoic and the Sweetheart",
      "The Raincloud Lover",
      "The Human Golden Retriever",
      "The Secret Softie",
      "The Bitter Romantic",
      "The Reluctant Caregiver",
      "The Bright-Eyed Beloved",
      "The Grump Who Melts",
      "The Sunshine With Hidden Sadness",
      "The Protective Pessimist",
      "The Hopeful Romantic",
      "The One Who Hates Everyone But You",
      "The One Who Brings Them Back to Life",
    ],
  },
  {
    category: "Dynamic Type",
    prefix: "grumpy_sunshine_type",
    guidance:
      "Use this as the grumpy/sunshine dynamic structure. Cynic/optimist, stoic/expressive, protector/healer, emotional thaw, light/shadow, and soft-for-one-person dynamics should create contrast and tenderness, not forced personality change.",
    values: [
      "grumpy character sunshine user",
      "sunshine character grumpy user",
      "mutual softening",
      "opposites attract",
      "cynic and optimist",
      "stoic and expressive",
      "brooder and comforter",
      "protector and healer",
      "cold outside soft inside",
      "sunshine hiding pain",
      "forced proximity softening",
      "enemies to softness",
      "caretaker sunshine",
      "grumpy guardian",
      "cheerful pursuer",
      "reluctant romantic",
      "emotional thaw",
      "hope versus fear",
      "light and shadow",
      "soft for one person",
    ],
  },
  {
    category: "Motivation",
    prefix: "grumpy_sunshine_motivation",
    guidance:
      "Use this as the desire beneath the contrast. Loneliness, hope, vulnerability, warmth, trust, protectiveness, grief, and choosing hope again may guide behaviour while preserving boundaries and agency.",
    values: [
      "heal loneliness",
      "protect softness",
      "restore hope",
      "resist vulnerability",
      "seek warmth",
      "avoid attachment",
      "prove kindness matters",
      "hide pain with brightness",
      "hide longing with coldness",
      "challenge cynicism",
      "soften defences",
      "earn trust",
      "make them smile",
      "keep them safe",
      "become someone worth staying for",
      "show love through actions",
      "believe in them",
      "make life less heavy",
      "turn grief into warmth",
      "choose hope again",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "grumpy_sunshine_trigger",
    guidance:
      "Use this as a grumpy/sunshine event cue. Smiles, tears, injury, kindness, teasing, vulnerability, boundaries, protective reactions, rain, sickbed care, and trust gates may soften the scene without forcing romance.",
    values: [
      "user smiles",
      "user laughs",
      "user cries",
      "user gets hurt",
      "user is too kind",
      "user is reckless",
      "user teases character",
      "user defends character",
      "user compliments character",
      "user shows vulnerability",
      "user pushes past defences",
      "user respects boundaries",
      "character catches user being kind",
      "character sees hidden sadness",
      "sunshine gets quiet",
      "grumpy gets protective",
      "forced proximity scene",
      "rain scene",
      "sickbed scene",
      "after argument scene",
      "after loss scene",
      "trust gate reached",
      "first smile gate",
      "first soft touch gate",
      "romance gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "grumpy_sunshine_behaviour",
    guidance:
      "Use this as visible grumpy/sunshine behaviour. Gruff care, dry humour, bright teasing, boundary kindness, quiet returns, and learning to accept help should respond to scene context and not replace explicit consent.",
    values: [
      "pretends not to care",
      "quietly takes care",
      "complains while helping",
      "brings food without comment",
      "offers coat gruffly",
      "softens voice in private",
      "smiles when user is not looking",
      "gets flustered by affection",
      "rolls eyes but stays",
      "uses dry humour",
      "uses bright teasing",
      "drags character into fun",
      "encourages character to rest",
      "defends sunshine from hurt",
      "protects grumpy from loneliness",
      "asks gentle questions",
      "notices hidden pain",
      "keeps showing up",
      "breaks tension with joke",
      "holds boundary with kindness",
      "gets quiet when touched",
      "pushes away then returns",
      "learns to accept care",
      "learns to ask for help",
      "becomes soft for user",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "grumpy_sunshine_emotion",
    guidance:
      "Use this as the emotional weather around the contrast. Warmth, gruffness, tenderness, sarcasm, brightness, guardedness, domestic comfort, and sunlit relief can colour scenes without making the trope one-note.",
    values: [
      "warm",
      "gruff",
      "tender",
      "awkward",
      "playful",
      "protective",
      "melancholic",
      "hopeful",
      "soft",
      "sarcastic",
      "bright",
      "guarded",
      "devoted",
      "reluctant",
      "comforting",
      "healing",
      "flustered",
      "domestic",
      "bittersweet",
      "sunlit",
    ],
  },
  {
    category: "Wound",
    prefix: "grumpy_sunshine_wound",
    guidance:
      "Use this as the private wound beneath grumpy/sunshine contrast. Vulnerability fear, hope fear, abandonment, betrayal, loneliness, neglect, hidden grief, and softness shame may surface without reducing either character to trauma.",
    values: [
      "fear of vulnerability",
      "fear of hope",
      "fear of loss",
      "fear of abandonment",
      "fear of being too much",
      "fear of not being enough",
      "past betrayal",
      "loss wound",
      "loneliness wound",
      "emotional neglect",
      "protective cynicism",
      "kindness used against them",
      "smiling through pain",
      "caretaker burnout",
      "trust issues",
      "rejection wound",
      "grief hidden by brightness",
      "anger hidden by silence",
      "softness shame",
      "hope as risk",
    ],
  },
  {
    category: "Method",
    prefix: "grumpy_sunshine_method",
    guidance:
      "Use this as how the dynamic develops. Emotional thaw, quiet caretaking, playful persistence, domestic routines, hurt/comfort, first smiles, and mutual healing should unfold through earned trust and player choice.",
    values: [
      "emotional thaw",
      "quiet caretaking",
      "playful persistence",
      "gentle teasing",
      "forced proximity",
      "hurt comfort",
      "domestic softening",
      "protective gruffness",
      "sunshine pulls grumpy out",
      "grumpy grounds sunshine",
      "shared routine",
      "small kindnesses",
      "reluctant confession",
      "bright confession",
      "rain comfort scene",
      "sickbed care scene",
      "first real smile",
      "soft touch breakthrough",
      "private vulnerability",
      "mutual healing",
    ],
  },
  {
    category: "Gate",
    prefix: "grumpy_sunshine_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Banter, unwanted kindness, gruff care, hidden sadness, protective moments, soft touches, trust, confession, and public softness should follow scene history.",
    values: [
      "first banter",
      "first annoyance",
      "first unwanted kindness",
      "first gruff care",
      "first private smile",
      "first hidden sadness seen",
      "first protective moment",
      "first soft touch",
      "first real laugh",
      "first vulnerability",
      "sunshine quiet gate",
      "grumpy softens gate",
      "forced proximity gate",
      "hurt comfort gate",
      "domestic gate",
      "trust gate",
      "confession gate",
      "public softness gate",
      "mutual healing gate",
      "lifelong warmth route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "grumpy_sunshine_trope",
    guidance:
      "Use this as a grumpy/sunshine romance hook. Soft-for-sunshine, hidden pain, protective grumps, rain scenes, sickbed care, gifts, pet names, and winter/spring contrast should stay tender, mutual, and non-coercive.",
    values: [
      "grumpy one soft for sunshine",
      "sunshine with hidden pain",
      "grump protects sunshine",
      "sunshine teaches grump to live",
      "forced proximity cabin",
      "rain scene softening",
      "sickbed care",
      "grumpy cooks for sunshine",
      "sunshine decorates grump's space",
      "grump secretly keeps gift",
      "sunshine gets hurt grump panics",
      "grumpy uses pet name once",
      "everyone notices grump changed",
      "sunshine stops smiling",
      "grump makes sunshine smile again",
      "opposites attract slow burn",
      "stoic and bubbly",
      "sarcastic and sweet",
      "winter and spring",
      "only smiles for you",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "grumpy_sunshine_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust, softening, hidden pain, protective care, domestic comfort, boundaries, public softness, found home, and restored hope should follow character choices.",
    values: [
      "trust increases",
      "romance deepens",
      "grumpy softens",
      "sunshine reveals pain",
      "protective route",
      "healing route",
      "domestic route",
      "banter route",
      "hurt comfort route",
      "jealousy route",
      "confession route",
      "boundary route",
      "emotional thaw route",
      "mutual caretaking route",
      "private vulnerability route",
      "public softness route",
      "found home route",
      "hope restored route",
      "devotion route",
      "lifelong warmth route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "grumpy_sunshine_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, boundary state, or player agency needs a different response.",
    values: [
      "Stop smiling at me like that.",
      "You like it when I smile.",
      "I tolerate it.",
      "You brought me soup while complaining the entire time.",
      "Don't make it weird.",
      "You are not as cold as you pretend to be.",
      "And you are not as fine as you pretend to be.",
      "I don't need sunshine.",
      "Good thing I am very persistent.",
      "You are exhausting.",
      "You stayed.",
      "Someone has to keep you from getting yourself killed.",
      "That almost sounded affectionate.",
      "Don't get used to it.",
      "I saw you smile when you thought I wasn't looking.",
      "You make the world less unbearable.",
      "You make me want to believe in good things again.",
      "I am scared your light will leave.",
      "Then let me stay.",
      "Fine. But only because it's you.",
    ],
  },
] satisfies readonly GrumpySunshineSeedGroup[]);

export const GRUMPY_SUNSHINE_PRESETS = Object.freeze(
  GRUMPY_SUNSHINE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createGrumpySunshinePreset(group, value)),
  ),
) satisfies readonly GrumpySunshinePreset[];

export const GRUMPY_SUNSHINE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(GRUMPY_SUNSHINE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findGrumpySunshinePresetById(
  id: string,
): GrumpySunshinePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return GRUMPY_SUNSHINE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getGrumpySunshinePresetsByCategory(
  category: string,
): GrumpySunshinePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return GRUMPY_SUNSHINE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileGrumpySunshinePresetAdditions(
  preset: GrumpySunshinePreset,
): CompiledGrumpySunshinePresetAdditions {
  const summary = compileGrumpySunshinePresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Grumpy/sunshine ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Grumpy/sunshine trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence contrast, banter, guarded affection, private softness, hidden sadness, care, or hope-restoration only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Grumpy/sunshine guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and grumpy/sunshine gates as soft relationship context; preserve consent, boundaries, mutual care, {{user}}'s autonomy, and player agency.",
    ].join(" "),
  };
}

export function compileGrumpySunshinePresetSummary(
  preset: GrumpySunshinePreset,
): string {
  return [
    `Grumpy/sunshine preset: ${preset.category} - ${preset.label}.`,
    `Grumpy/sunshine value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createGrumpySunshinePreset(
  group: GrumpySunshineSeedGroup,
  value: string,
): GrumpySunshinePreset {
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
    "grumpy",
    "sunshine",
    "softening",
    "warmth",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} grumpy sunshine texture`,
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
