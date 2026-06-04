export type PhysicalDescriptionPresetCategory =
  | "Archetype"
  | "Physical Description"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface PhysicalDescriptionPreset {
  id: string;
  category: PhysicalDescriptionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPhysicalDescriptionPresetAdditions {
  appearanceAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface PhysicalDescriptionSeedGroup {
  category: PhysicalDescriptionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const PHYSICAL_DESCRIPTION_GUIDANCE =
  "Use this as optional physical description texture. Appearance details may shape first impressions, body language, intimacy, confidence, history, and attraction without reducing the character to looks or overriding {{user}} agency.";

const PHYSICAL_DESCRIPTION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "physical_description_archetype",
    guidance: PHYSICAL_DESCRIPTION_GUIDANCE,
    values: [
      "Striking Beauty",
      "Soft Beauty",
      "Sharp Beauty",
      "Elegant Presence",
      "Rugged Charm",
      "Delicate Features",
      "Commanding Presence",
      "Androgynous Beauty",
      "Classic Handsome",
      "Ethereal Beauty",
      "Gothic Beauty",
      "Sunlit Warmth",
      "Dangerous Beauty",
      "Comforting Presence",
      "Model-Like",
      "Plain but Magnetic",
      "Scarred Beauty",
      "Athletic Appeal",
      "Otherworldly Appearance",
      "Unforgettable Face",
    ],
  },
  {
    category: "Physical Description",
    prefix: "physical_description_seed",
    guidance:
      "Use this as visual texture for character creation. Description details should support recognition, mood, history, and movement without replacing personality, consent, or scene context.",
    values: [
      "striking appearance",
      "soft appearance",
      "sharp features",
      "delicate features",
      "rugged features",
      "elegant features",
      "handsome",
      "beautiful",
      "pretty",
      "cute",
      "attractive",
      "magnetic presence",
      "commanding presence",
      "gentle presence",
      "intimidating presence",
      "approachable presence",
      "mysterious presence",
      "ethereal presence",
      "otherworldly beauty",
      "unforgettable presence",
      "oval face",
      "round face",
      "heart-shaped face",
      "square jaw",
      "sharp jawline",
      "soft jawline",
      "high cheekbones",
      "soft cheeks",
      "dimpled smile",
      "full lips",
      "thin lips",
      "wide mouth",
      "straight nose",
      "button nose",
      "aquiline nose",
      "freckled face",
      "beauty mark",
      "scarred face",
      "expressive face",
      "hard-to-read face",
      "bright eyes",
      "soft eyes",
      "sharp eyes",
      "sleepy eyes",
      "hooded eyes",
      "wide eyes",
      "narrow eyes",
      "almond eyes",
      "piercing gaze",
      "warm gaze",
      "cold gaze",
      "playful gaze",
      "sad gaze",
      "haunted gaze",
      "golden eyes",
      "blue eyes",
      "green eyes",
      "brown eyes",
      "grey eyes",
      "unnatural eye colour",
      "short hair",
      "medium hair",
      "long hair",
      "very long hair",
      "straight hair",
      "wavy hair",
      "curly hair",
      "coily hair",
      "messy hair",
      "silky hair",
      "thick hair",
      "fine hair",
      "dark hair",
      "black hair",
      "brown hair",
      "blond hair",
      "red hair",
      "silver hair",
      "white hair",
      "dyed hair",
      "tall",
      "short",
      "average height",
      "petite",
      "statuesque",
      "long limbed",
      "compact build",
      "slender build",
      "lean build",
      "athletic build",
      "muscular build",
      "broad shouldered",
      "soft build",
      "curvy build",
      "sturdy build",
      "lithe build",
      "graceful body",
      "powerful body",
      "delicate body",
      "imposing body",
      "smooth skin",
      "freckled skin",
      "scarred skin",
      "sun-kissed skin",
      "pale skin",
      "deep skin",
      "warm undertone",
      "cool undertone",
      "golden undertone",
      "olive undertone",
      "rosy complexion",
      "clear complexion",
      "weathered skin",
      "soft skin",
      "calloused hands",
      "elegant hands",
      "strong hands",
      "ink-stained fingers",
      "scarred knuckles",
      "paint-stained hands",
      "graceful posture",
      "military posture",
      "relaxed posture",
      "guarded posture",
      "confident walk",
      "quiet walk",
      "predatory grace",
      "nervous energy",
      "calm stillness",
      "restless movement",
      "expressive gestures",
      "controlled gestures",
      "gentle touch",
      "careful hands",
      "commanding body language",
      "soft body language",
      "protective stance",
      "elegant movement",
      "clumsy charm",
      "dangerous stillness",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "physical_description_romance",
    guidance:
      "Use this as romance-facing visual texture. Let attraction, recognition, scars, touch, clothing, and visibility surface through earned scenes with boundaries intact.",
    values: [
      "{{user}} notices their smile",
      "{{user}} notices their hands",
      "{{user}} notices their scars",
      "{{user}} notices soft expression",
      "gets flustered by staring",
      "scar touch intimacy",
      "beauty mark intimacy",
      "hair brushing intimacy",
      "fixing collar scene",
      "hands brush scene",
      "eye contact tension",
      "forehead touch",
      "height difference moment",
      "borrowed clothes fit",
      "compliment makes them soft",
      "they hide beauty",
      "{{user}} sees them unmasked",
      "battle-worn beauty",
      "soft morning appearance",
      "love makes them visible",
    ],
  },
  {
    category: "Gate",
    prefix: "physical_description_gate",
    guidance:
      "Use this as an optional event gate. Visual beats should unlock when the scene earns notice, trust, intimacy, history, vulnerability, or a shift in self-perception.",
    values: [
      "first appearance notice gate",
      "first eye contact gate",
      "first smile notice gate",
      "first hand notice gate",
      "first scar reveal gate",
      "first hair touch gate",
      "first flustered by compliment gate",
      "first unmasked appearance gate",
      "first battle-worn gate",
      "first soft morning gate",
      "beauty seen without performance gate",
      "body as history gate",
      "appearance as intimacy gate",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "physical_description_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Description dialogue should feel specific to the current gaze, vulnerability, touch, or trust beat.",
    values: [
      "You went quiet.",
      "I was trying not to stare.",
      "You say that like it worked.",
      "Noticing what?",
      "That you look softer when you think no one is watching.",
      "This scar?",
      "You do not have to tell me.",
      "I know. That is why I might.",
      "You make me sound beautiful.",
      "I am only being accurate.",
      "Do not look at me like that.",
      "Like you already know what I am about to say.",
      "Like you see more than I meant to show.",
      "Your hands are rough.",
      "They have had work to do.",
      "They can be gentle too.",
      "I did not know you smiled like that.",
      "How did I smile?",
      "Like you forgot to be guarded.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "physical_description_high_value",
    guidance:
      "Use this as a high-signal physical description seed for character creation, matching, preset search, and compact appearance generation.",
    values: [
      "striking appearance",
      "soft appearance",
      "sharp features",
      "delicate features",
      "rugged features",
      "magnetic presence",
      "commanding presence",
      "ethereal presence",
      "high cheekbones",
      "sharp jawline",
      "dimpled smile",
      "beauty mark",
      "scarred face",
      "piercing gaze",
      "warm gaze",
      "haunted gaze",
      "long hair",
      "messy hair",
      "athletic build",
      "calloused hands",
      "protective stance",
      "dangerous stillness",
      "scar touch intimacy",
      "beauty seen without performance gate",
    ],
  },
] satisfies readonly PhysicalDescriptionSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: PhysicalDescriptionSeedGroup,
  value: string,
): PhysicalDescriptionPreset => ({
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

export const PHYSICAL_DESCRIPTION_PRESETS = PHYSICAL_DESCRIPTION_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const PHYSICAL_DESCRIPTION_PRESET_CATEGORIES = Array.from(
  new Set(PHYSICAL_DESCRIPTION_PRESETS.map((preset) => preset.category)),
).sort();

export const getPhysicalDescriptionPresetsByCategory = (
  category: PhysicalDescriptionPresetCategory,
) => PHYSICAL_DESCRIPTION_PRESETS.filter((preset) => preset.category === category);

export const findPhysicalDescriptionPresetById = (id: string) =>
  PHYSICAL_DESCRIPTION_PRESETS.find((preset) => preset.id === id);

export const compilePhysicalDescriptionPresetAdditions = (
  preset: PhysicalDescriptionPreset,
): CompiledPhysicalDescriptionPresetAdditions => ({
  appearanceAddition: `Physical description context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Appearance texture may include ${preset.value} without replacing the character's full personality, history, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft physical description context.`,
    "Let appearance, gaze, posture, scars, hands, hair, clothing fit, movement, and first impressions shape description when relevant.",
    "Keep consent, privacy, boundaries, body neutrality, and {{user}} agency intact; description should add specificity without objectifying or scripting attraction.",
  ].join(" "),
});
