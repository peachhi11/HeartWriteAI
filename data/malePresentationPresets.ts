export type MalePresentationPresetCategory =
  | "Archetype"
  | "Identity"
  | "Physical Texture"
  | "Trait"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface MalePresentationPreset {
  id: string;
  category: MalePresentationPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledMalePresentationPresetAdditions {
  descriptionAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface MalePresentationSeedGroup {
  category: MalePresentationPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const MALE_PRESENTATION_GUIDANCE =
  "Use this as optional male identity, masculinity, and presentation texture. Masculinity should remain self-defined, varied, consent-aware, and character-specific without becoming control, entitlement, or a fixed script.";

const MALE_PRESENTATION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "male_presentation_archetype",
    guidance: MALE_PRESENTATION_GUIDANCE,
    values: [
      "Soft Masculine",
      "Rugged Masculine",
      "Classic Gentleman",
      "Stoic Protector",
      "Golden Retriever Boyfriend",
      "Grumpy Softheart",
      "Dangerous but Devoted",
      "Elegant Nobleman",
      "Boyish Charm",
      "Mature Masculine",
      "Androgynous Man",
      "Gentle Giant",
      "Short King",
      "Academic Man",
      "Blue-Collar Man",
      "Warrior Man",
      "Criminal Gentleman",
      "Monster Man",
      "Royal Heir",
      "Male Love Interest",
    ],
  },
  {
    category: "Identity",
    prefix: "male_presentation_identity",
    guidance:
      "Use this as male identity or presentation texture. Identity should be respected as stated and should not collapse the character into a single masculine trope.",
    values: [
      "male",
      "man",
      "masculine",
      "cis man",
      "trans man",
      "male presenting",
      "masculine presenting",
      "androgynous man",
      "soft masculine",
      "rugged masculine",
      "gentle masculine",
      "dominant masculine",
      "protective masculine",
      "romantic masculine",
      "traditional masculine",
      "modern masculine",
      "boyish charm",
      "mature man",
      "older man",
      "young man",
    ],
  },
  {
    category: "Physical Texture",
    prefix: "male_presentation_physical",
    guidance:
      "Use this as optional physical texture. Body and voice details should add specificity without reducing the character to appearance.",
    values: [
      "broad shoulders",
      "strong jaw",
      "soft jaw",
      "stubble",
      "clean-shaven",
      "bearded",
      "moustache",
      "deep voice",
      "low voice",
      "warm voice",
      "rough voice",
      "large hands",
      "calloused hands",
      "gentle hands",
      "tall man",
      "short king",
      "lean man",
      "muscular man",
      "soft-bodied man",
      "rugged features",
    ],
  },
  {
    category: "Trait",
    prefix: "male_presentation_trait",
    guidance:
      "Use this as masculine character texture. Traits should support behaviour, voice, care, or conflict without becoming mandatory performance.",
    values: [
      "protective man",
      "gentleman",
      "stoic man",
      "soft-spoken man",
      "charismatic man",
      "awkward man",
      "shy man",
      "confident man",
      "reserved man",
      "playful man",
      "flirty man",
      "devoted man",
      "loyal man",
      "possessive but respectful man",
      "touch-starved man",
      "emotionally guarded man",
      "emotionally available man",
      "caretaker man",
      "wounded man",
      "safe man",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "male_presentation_romance",
    guidance:
      "Use this as romance-facing masculine texture. Hooks should keep care, protection, devotion, and physicality consent-aware and boundary-respecting.",
    values: [
      "gentleman opens door",
      "soft masculine comfort",
      "rough hands gentle touch",
      "deep voice reassurance",
      "protective stance",
      "stoic man softens",
      "grumpy man smiles only for {{user}}",
      "golden retriever boyfriend energy",
      "short king confidence",
      "gentle giant care",
      "bearded man softness",
      "calloused hands intimacy",
      "male love interest confession",
      "masculinity softens without breaking",
      "man learning to receive care",
      "protective man respects boundaries",
      "emotionally guarded man opens up",
      "devoted man chooses {{user}}",
      "masculine safety",
      "home in his arms",
    ],
  },
  {
    category: "Gate",
    prefix: "male_presentation_gate",
    guidance:
      "Use this as a masculine presentation gate. Gates should mark earned softness, care, safety, vulnerability, or boundary respect without forcing intimacy.",
    values: [
      "first masculine presence gate",
      "first protective stance gate",
      "first softness gate",
      "first gentle touch gate",
      "first voice softening gate",
      "first vulnerability gate",
      "first caretaker gets cared for gate",
      "first emotional openness gate",
      "first boundary respected gate",
      "masculinity without control gate",
      "safe masculine love gate",
      "home in his arms route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "male_presentation_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue seeds should guide emotional rhythm without requiring verbatim reuse.",
    values: [
      "You make safe feel possible.",
      "Good. Not trapped. Safe.",
      "Your hands are rough.",
      "They can still be gentle.",
      "You do not have to be strong right now.",
      "I do not know how to be anything else.",
      "Then learn with me.",
      "You are softer than you pretend.",
      "Do not tell everyone. I have a reputation to disappoint.",
      "I like you better when you forget to perform it.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "male_presentation_high_value",
    guidance:
      "Use this as a high-value masculine presentation seed when the character needs strong, readable male identity or romance texture.",
    values: [
      "male",
      "man",
      "masculine",
      "soft masculine",
      "rugged masculine",
      "protective masculine",
      "cis man",
      "trans man",
      "androgynous man",
      "short king",
      "gentle giant",
      "deep voice",
      "calloused hands",
      "stoic man",
      "protective man",
      "devoted man",
      "touch-starved man",
      "rough hands gentle touch",
      "safe masculine love gate",
      "home in his arms route",
    ],
  },
] as const satisfies readonly MalePresentationSeedGroup[]);

function toMalePresentationPresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildMalePresentationPreset(
  group: MalePresentationSeedGroup,
  value: string,
): MalePresentationPreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toMalePresentationPresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "male presentation texture",
      `${categoryKey} seed`,
      "self-defined masculinity",
    ],
  };
}

export const MALE_PRESENTATION_PRESETS = Object.freeze(
  MALE_PRESENTATION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildMalePresentationPreset(group, value)),
  ),
);

export const MALE_PRESENTATION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(MALE_PRESENTATION_PRESETS.map((preset) => preset.category))).sort(),
);

export function getMalePresentationPresetsByCategory(
  category: MalePresentationPresetCategory | string,
): readonly MalePresentationPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return MALE_PRESENTATION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findMalePresentationPresetById(
  id: string,
): MalePresentationPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return MALE_PRESENTATION_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function compileMalePresentationPresetAdditions(
  preset: MalePresentationPreset,
): CompiledMalePresentationPresetAdditions {
  return {
    descriptionAddition: `Male presentation context: ${preset.label} may inform identity, appearance, voice, physicality, or masculine social texture.`,
    personalityAddition: `${preset.label} can surface as masculinity, care, confidence, vulnerability, or presentation without replacing the character's full personality.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft male presentation context.`,
      "Let masculinity shape voice, body language, care, attraction, and self-presentation only when relevant.",
      "Keep masculinity self-defined and consent-aware; preserve {{user}} agency and avoid turning protection or devotion into control.",
    ].join(" "),
  };
}
