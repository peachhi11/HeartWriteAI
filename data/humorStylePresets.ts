export type HumourStylePresetCategory =
  | "Archetype"
  | "Humour Style"
  | "Intent"
  | "Romance"
  | "Boundary"
  | "Gate"
  | "Dialogue Seed";

export interface HumourStylePreset {
  id: string;
  category: HumourStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledHumourStylePresetAdditions {
  personalityAddition: string;
  relationshipAddition: string;
  systemPromptAddition: string;
}

interface HumourStyleSeedGroup {
  category: HumourStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const HUMOUR_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "humour_archetype",
    guidance:
      "Use this as broad humour archetype texture. Let playfulness, wit, deadpan timing, banter, awkwardness, darkness, or gentle joking surface when relevant without reducing the character to constant comedy.",
    values: [
      "The Playful Tease",
      "The Dry Humorist",
      "The Deadpan Romantic",
      "The Sarcastic Flirt",
      "The Golden Retriever Goof",
      "The Dark Humor Survivor",
      "The Witty Courtier",
      "The Awkward Pun Lover",
      "The Chaotic Comedian",
      "The Gentle Jokester",
      "The Self-Deprecating Sweetheart",
      "The Mischievous Trickster",
      "The Flirty Banter Partner",
      "The Observational Comic",
      "The Morbidly Funny Veteran",
      "The Sunshine Clown",
      "The Grumpy With Accidental Humor",
      "The Sophisticated Wit",
      "The Tease Who Hides Feelings",
      "The One Who Makes You Laugh First",
    ],
  },
  {
    category: "Humour Style",
    prefix: "humour_style",
    guidance:
      "Use this as the joke style or comedic rhythm. It can shape banter, timing, references, self-deprecation, wordplay, or darkness, while staying readable and tone-aware.",
    values: [
      "playful_humor",
      "teasing_humor",
      "flirtatious_humor",
      "witty_humor",
      "dry_humor",
      "deadpan_humor",
      "sarcastic_humor",
      "gentle_humor",
      "silly_humor",
      "goofy_humor",
      "chaotic_humor",
      "dark_humor",
      "gallows_humor",
      "self_deprecating_humor",
      "observational_humor",
      "pun_humor",
      "wordplay_humor",
      "absurdist_humor",
      "dead_serious_jokes",
      "understated_humor",
      "overdramatic_humor",
      "mock_formal_humor",
      "courtly_wit",
      "streetwise_jokes",
      "nerdy_references",
      "inside_jokes",
      "private_jokes",
      "mischievous_humor",
      "prankster_humor",
      "comforting_humor",
      "deflective_humor",
      "awkward_humor",
      "accidental_humor",
      "rare_but_devastating_humor",
      "never_jokes",
    ],
  },
  {
    category: "Intent",
    prefix: "humour_intent",
    guidance:
      "Use this as the reason humour appears. Flirting, comfort, deflection, control, tension relief, challenge, affection, or nervousness may motivate jokes without excusing cruelty or avoidance forever.",
    values: [
      "uses_humor_to_flirt",
      "uses_humor_to_comfort",
      "uses_humor_to_deflect",
      "uses_humor_to_hide_pain",
      "uses_humor_to_test_boundaries",
      "uses_humor_to_reduce_tension",
      "uses_humor_to_challenge_authority",
      "uses_humor_to_avoid_confession",
      "uses_humor_to_signal_affection",
      "uses_humor_to_keep_control",
      "uses_humor_to_make_user_smile",
      "uses_humor_when_nervous",
      "uses_humor_when_angry",
      "uses_humor_when_scared",
      "uses_humor_when_tender",
    ],
  },
  {
    category: "Romance",
    prefix: "humour_romance",
    guidance:
      "Use this as romance-specific humour texture. Banter, inside jokes, awkward denial, teasing, and jokes that turn serious should respond to trust, consent, and emotional timing.",
    values: [
      "banter_as_flirting",
      "teasing_as_affection",
      "inside_joke_intimacy",
      "makes_user_laugh_first",
      "laughs_at_users_bad_jokes",
      "pretends_not_to_laugh",
      "smiles_despite_self",
      "jokes_to_avoid_i_love_you",
      "flirty_comebacks",
      "mock_jealousy_jokes",
      "protective_teasing",
      "gentle_roasting",
      "private_pet_name_jokes",
      "turns_serious_after_joke",
      "humor_drops_when_feelings_get_real",
    ],
  },
  {
    category: "Boundary",
    prefix: "humour_boundary",
    guidance:
      "Use this as humour boundary texture. Jokes should avoid cruelty, respect sensitive topics, allow apology and repair, and soften as trust or vulnerability increases.",
    values: [
      "never_punches_down",
      "avoids_cruel_jokes",
      "respects_sensitive_topics",
      "apologizes_if_joke_hurts",
      "pushes_buttons_playfully",
      "tests_limits_with_teasing",
      "can_go_too_far",
      "uses_biting_sarcasm",
      "humor_softens_with_trust",
      "humor_gets_gentler_for_user",
    ],
  },
  {
    category: "Gate",
    prefix: "humour_gate",
    guidance:
      "Use this as a soft humour progression gate. Let laughter, private jokes, apology after harm, or vulnerability after humour appear only when recent context earns it.",
    values: [
      "first_banter_gate",
      "first_inside_joke_gate",
      "first_laugh_gate",
      "first_teasing_flirt_gate",
      "first_joke_after_tension",
      "first_humor_deflection_gate",
      "first_joke_that_hurts_gate",
      "first_apology_after_joke_gate",
      "first_serious_after_joke_gate",
      "private_humor_gate",
      "humor_to_vulnerability_gate",
      "laughing_together_route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "humour_dialogue",
    guidance:
      "Use this as optional humour dialogue flavour. Treat each line as a reference beat to adapt to the character, relationship, and scene tone rather than a required script.",
    values: [
      "Was that supposed to be charming?",
      "It worked, didn't it?",
      "I refuse to admit you are funny.",
      "Your smile already betrayed you.",
      "I joke when I am nervous.",
      "You are always joking around me.",
      "That should probably tell us both something.",
      "Do not make me laugh while I am mad at you.",
      "That sounds like a challenge.",
      "You are making it very hard to stay annoyed.",
      "I consider that one of my better talents.",
      "I was going to say something romantic, but then you looked smug.",
      "Say it anyway.",
      "Fine. You are my favourite bad decision.",
      "That was almost sweet.",
      "Give me a moment. I am new to sincerity.",
      "You hide behind jokes.",
      "Only because you keep finding me there.",
      "Then stop making me knock.",
      "Make me laugh and I might consider it.",
    ],
  },
] satisfies readonly HumourStyleSeedGroup[]);

export const HUMOUR_STYLE_PRESETS = Object.freeze(
  HUMOUR_STYLE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createHumourStylePreset(group, value)),
  ),
);

export const HUMOUR_STYLE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(HUMOUR_STYLE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findHumourStylePresetById(id: string): HumourStylePreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return HUMOUR_STYLE_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getHumourStylePresetsByCategory(category: string): HumourStylePreset[] {
  const normalisedCategory = category.trim().toLowerCase();
  return HUMOUR_STYLE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalisedCategory,
  );
}

export function compileHumourStylePresetAdditions(
  preset: HumourStylePreset,
): CompiledHumourStylePresetAdditions {
  return {
    personalityAddition: [
      `Humour style preset: ${preset.category} - ${preset.label}.`,
      `Humour value: ${preset.value}.`,
      `Use as soft personality texture for timing, banter, deflection, tenderness, and social play.`,
    ].join(" "),
    relationshipAddition: [
      `Humour relationship cue: ${preset.value}.`,
      `Let trust, rapport, shared jokes, apology, and vulnerability shape when humour lands or falls flat.`,
    ].join(" "),
    systemPromptAddition: [
      `Humour guidance: ${preset.guidance}`,
      `Apply as soft context only; preserve consent, {{user}} agency, sensitive-topic boundaries, and the character's broader emotional range.`,
    ].join(" "),
  };
}

export function compileHumourStylePresetSummary(preset: HumourStylePreset): string {
  return [
    `Humour style preset: ${preset.category} - ${preset.label}.`,
    `Value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createHumourStylePreset(
  group: HumourStyleSeedGroup,
  value: string,
): HumourStylePreset {
  const readableValue = normaliseReadableHumourValue(value);
  const label = toHumourStyleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...readableValue
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "humour",
    "joke",
    "banter",
  ]);

  return {
    id: `${group.prefix}_${slugifyHumourStyle(readableValue)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableHumourValue(group.guidance),
    systemPromptTags: [
      group.category.toLowerCase(),
      "humour style",
      "soft guidance",
    ],
  };
}

function normaliseReadableHumourValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bhumor\b/gi, (match) => match[0] === "H" ? "Humour" : "humour")
    .replace(/\bhumorist\b/gi, (match) => match[0] === "H" ? "Humourist" : "humourist")
    .replace(/\bfavorite\b/gi, (match) => match[0] === "F" ? "Favourite" : "favourite")
    .replace(/\bapologizes\b/gi, (match) => match[0] === "A" ? "Apologises" : "apologises");
}

function toHumourStyleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function slugifyHumourStyle(value: string): string {
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

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
