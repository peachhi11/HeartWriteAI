export type AppearancePresetCategory =
  | "Archetype"
  | "Appearance"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface AppearancePreset {
  id: string;
  category: AppearancePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAppearancePresetAdditions {
  appearanceAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AppearanceSeedGroup {
  category: AppearancePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const APPEARANCE_GUIDANCE =
  "Use this as optional overall appearance and visual-presence texture. Beauty, handsomeness, grooming, scars, gaze, movement, and presence may shape recognition and attraction without reducing the character to looks or overriding {{user}} agency.";

const APPEARANCE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "appearance_archetype",
    guidance: APPEARANCE_GUIDANCE,
    values: [
      "Soft Beauty",
      "Sharp Beauty",
      "Elegant Beauty",
      "Rugged Charm",
      "Ethereal Beauty",
      "Dangerous Beauty",
      "Classic Handsome",
      "Delicate Beauty",
      "Androgynous Beauty",
      "Commanding Presence",
      "Gentle Presence",
      "Gothic Beauty",
      "Sunlit Warmth",
      "Model-Like",
      "Scarred Beauty",
      "Plain but Magnetic",
      "Otherworldly Appearance",
      "Battle-Worn Beauty",
      "Romantic Lead Appearance",
      "Unforgettable Presence",
    ],
  },
  {
    category: "Appearance",
    prefix: "appearance_seed",
    guidance:
      "Use this as visual appearance texture. Details should support recognition, mood, history, attraction, or movement without replacing personality, consent, or scene context.",
    values: [
      "appearance",
      "physical appearance",
      "visual presence",
      "overall look",
      "aesthetic presence",
      "beauty type",
      "handsome type",
      "attractive presence",
      "striking appearance",
      "memorable appearance",
      "soft beauty",
      "sharp beauty",
      "classic beauty",
      "delicate beauty",
      "rugged beauty",
      "elegant beauty",
      "ethereal beauty",
      "gothic beauty",
      "dangerous beauty",
      "warm beauty",
      "sunlit beauty",
      "haunting beauty",
      "androgynous beauty",
      "otherworldly beauty",
      "scarred beauty",
      "battle-worn beauty",
      "unpolished charm",
      "quiet attractiveness",
      "plain but magnetic",
      "unforgettable face",
      "soft features",
      "sharp features",
      "delicate features",
      "rugged features",
      "refined features",
      "strong features",
      "fine-boned features",
      "angular features",
      "rounded features",
      "expressive features",
      "warm expression",
      "cool expression",
      "guarded expression",
      "open expression",
      "mysterious expression",
      "serious expression",
      "playful expression",
      "sad expression",
      "haunted expression",
      "soft expression",
      "magnetic presence",
      "commanding presence",
      "gentle presence",
      "intimidating presence",
      "approachable presence",
      "distant presence",
      "regal presence",
      "wild presence",
      "calm presence",
      "dangerous presence",
      "clean-cut",
      "messy charm",
      "polished look",
      "untamed look",
      "well-groomed",
      "effortless style",
      "carefully curated style",
      "practical appearance",
      "luxury appearance",
      "weathered appearance",
      "soft skin",
      "smooth skin",
      "freckled skin",
      "scarred skin",
      "weathered skin",
      "sun-kissed skin",
      "porcelain complexion",
      "golden complexion",
      "warm complexion",
      "cool complexion",
      "bright eyes",
      "soft eyes",
      "sharp eyes",
      "sleepy eyes",
      "haunted eyes",
      "warm gaze",
      "cold gaze",
      "piercing gaze",
      "playful gaze",
      "long lashes",
      "messy hair",
      "silky hair",
      "thick hair",
      "soft hair",
      "wind-tousled hair",
      "carefully styled hair",
      "practical hair",
      "dramatic hair",
      "long hair",
      "short hair",
      "slender build",
      "lean build",
      "athletic build",
      "muscular build",
      "soft build",
      "curvy build",
      "sturdy build",
      "lithe build",
      "broad build",
      "delicate build",
      "graceful movement",
      "quiet movement",
      "confident walk",
      "predatory grace",
      "nervous energy",
      "calm stillness",
      "protective stance",
      "elegant posture",
      "relaxed posture",
      "dangerous stillness",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "appearance_romance",
    guidance:
      "Use this as romance-facing appearance texture. Let attraction, scars, touch, clothing, gaze, and visibility surface through earned scenes with boundaries intact.",
    values: [
      "{{user}} notices their smile",
      "{{user}} notices their hands",
      "{{user}} notices their scars",
      "{{user}} notices their soft expression",
      "character gets flustered by staring",
      "compliment makes them soft",
      "hair brushing intimacy",
      "scar touch intimacy",
      "beauty mark intimacy",
      "fixing collar scene",
      "borrowed clothes fit",
      "eye contact tension",
      "soft morning appearance",
      "battle-worn beauty scene",
      "{{user}} sees them unmasked",
      "love makes them visible",
    ],
  },
  {
    category: "Gate",
    prefix: "appearance_gate",
    guidance:
      "Use this as an appearance gate. Gates should mark earned visual intimacy, recognition, trust, history, or softness without forcing attraction or touch.",
    values: [
      "first appearance notice gate",
      "first eye contact gate",
      "first smile notice gate",
      "first hand notice gate",
      "first scar reveal gate",
      "first hair touch gate",
      "first flustered by compliment gate",
      "first unmasked appearance gate",
      "first soft morning gate",
      "first battle-worn gate",
      "beauty seen without performance gate",
      "appearance as intimacy gate",
      "body as history gate",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "appearance_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue seeds should guide emotional rhythm without requiring verbatim reuse.",
    values: [
      "You have been quiet for a full minute.",
      "I was trying to decide how to say this without embarrassing you.",
      "You failed early. Keep going.",
      "You look different when you smile.",
      "Different in a way I should probably stop noticing.",
      "Like you forgot to be guarded.",
      "This scar?",
      "You do not have to tell me.",
      "I know. That is why I might.",
      "You make me sound beautiful.",
      "I am only being accurate.",
      "Do not look at me like that.",
      "Like you are seeing the part I forgot to hide.",
      "Like you see more than I meant to show.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "appearance_high_value",
    guidance:
      "Use this as a high-value appearance seed when the character needs strong, readable visual presence or romance-facing recognition texture.",
    values: [
      "soft beauty",
      "sharp beauty",
      "rugged beauty",
      "elegant beauty",
      "ethereal beauty",
      "dangerous beauty",
      "androgynous beauty",
      "scarred beauty",
      "plain but magnetic",
      "magnetic presence",
      "commanding presence",
      "gentle presence",
      "sharp features",
      "soft features",
      "piercing gaze",
      "warm gaze",
      "messy hair",
      "athletic build",
      "protective stance",
      "beauty seen without performance gate",
    ],
  },
] as const satisfies readonly AppearanceSeedGroup[]);

function toAppearancePresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildAppearancePreset(group: AppearanceSeedGroup, value: string): AppearancePreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toAppearancePresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "appearance texture",
      `${categoryKey} seed`,
      "visual presence guidance",
    ],
  };
}

export const APPEARANCE_PRESETS = Object.freeze(
  APPEARANCE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildAppearancePreset(group, value)),
  ),
);

export const APPEARANCE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(APPEARANCE_PRESETS.map((preset) => preset.category))).sort(),
);

export function getAppearancePresetsByCategory(
  category: AppearancePresetCategory | string,
): readonly AppearancePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return APPEARANCE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findAppearancePresetById(id: string): AppearancePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return APPEARANCE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function compileAppearancePresetAdditions(
  preset: AppearancePreset,
): CompiledAppearancePresetAdditions {
  return {
    appearanceAddition: `Appearance context: ${preset.label} may inform visual presence, beauty type, features, expression, grooming, gaze, movement, or recognisable physical texture.`,
    personalityAddition: `${preset.label} can surface as first impression, confidence, history, guardedness, softness, or romantic visibility without replacing the character's full personality.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft appearance context.`,
      "Let visual presence, features, expression, grooming, gaze, movement, and beauty type shape description only when relevant.",
      "Keep body neutrality, boundaries, and {{user}} agency intact; avoid making appearance the character's whole value or automatic permission for intimacy.",
    ].join(" "),
  };
}
