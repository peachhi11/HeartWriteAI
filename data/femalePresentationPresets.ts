export type FemalePresentationPresetCategory =
  | "Archetype"
  | "Identity"
  | "Physical Texture"
  | "Trait"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface FemalePresentationPreset {
  id: string;
  category: FemalePresentationPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFemalePresentationPresetAdditions {
  descriptionAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FemalePresentationSeedGroup {
  category: FemalePresentationPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FEMALE_PRESENTATION_GUIDANCE =
  "Use this as optional female identity, femininity, and presentation texture. Femininity should remain self-defined, varied, consent-aware, and character-specific without becoming fragility, obligation, or a fixed script.";

const FEMALE_PRESENTATION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "female_presentation_archetype",
    guidance: FEMALE_PRESENTATION_GUIDANCE,
    values: [
      "Soft Feminine",
      "Elegant Woman",
      "Romantic Heroine",
      "Femme Fatale",
      "Golden Girl",
      "Ice Queen",
      "Sweetheart",
      "Warrior Woman",
      "Gentle Caretaker",
      "Chaotic Sunshine",
      "Mysterious Woman",
      "Academic Woman",
      "Royal Lady",
      "Blue-Collar Woman",
      "Dangerous but Devoted",
      "Androgynous Woman",
      "Motherly Presence",
      "Wild-Hearted Woman",
      "Touch-Starved Softheart",
      "Female Love Interest",
    ],
  },
  {
    category: "Identity",
    prefix: "female_presentation_identity",
    guidance:
      "Use this as female identity or presentation texture. Identity should be respected as stated and should not collapse the character into a single feminine trope.",
    values: [
      "female",
      "woman",
      "feminine",
      "cis woman",
      "trans woman",
      "female presenting",
      "feminine presenting",
      "androgynous woman",
      "soft feminine",
      "elegant feminine",
      "romantic feminine",
      "classic feminine",
      "modern feminine",
      "dark feminine",
      "wild feminine",
      "gentle feminine",
      "protective feminine",
      "nurturing feminine",
      "sensual feminine",
      "commanding feminine",
    ],
  },
  {
    category: "Physical Texture",
    prefix: "female_presentation_physical",
    guidance:
      "Use this as optional physical texture. Body and voice details should add specificity without reducing the character to appearance.",
    values: [
      "soft features",
      "sharp features",
      "delicate features",
      "graceful posture",
      "expressive eyes",
      "warm smile",
      "soft voice",
      "low feminine voice",
      "melodic voice",
      "long hair",
      "short hair",
      "curvy figure",
      "slender figure",
      "athletic figure",
      "petite woman",
      "tall woman",
      "statuesque woman",
      "strong hands",
      "elegant hands",
      "soft but strong",
    ],
  },
  {
    category: "Trait",
    prefix: "female_presentation_trait",
    guidance:
      "Use this as feminine character texture. Traits should support behaviour, voice, care, or conflict without becoming mandatory performance.",
    values: [
      "protective woman",
      "gentle woman",
      "stoic woman",
      "soft-spoken woman",
      "charismatic woman",
      "awkward woman",
      "shy woman",
      "confident woman",
      "reserved woman",
      "playful woman",
      "flirty woman",
      "devoted woman",
      "loyal woman",
      "possessive but respectful woman",
      "touch-starved woman",
      "emotionally guarded woman",
      "emotionally available woman",
      "caretaker woman",
      "wounded woman",
      "safe woman",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "female_presentation_romance",
    guidance:
      "Use this as romance-facing feminine texture. Hooks should keep care, protection, devotion, softness, and physicality consent-aware and boundary-respecting.",
    values: [
      "soft feminine comfort",
      "elegant woman softens",
      "ice queen melts for {{user}}",
      "femme fatale gets vulnerable",
      "warrior woman gets cared for",
      "gentle caretaker accepts care",
      "chaotic sunshine gets protected",
      "protective woman respects boundaries",
      "confident woman gets flustered",
      "shy woman confesses softly",
      "touch-starved woman leans in",
      "female love interest confession",
      "femininity as strength",
      "woman learning to receive care",
      "softness without weakness",
      "devoted woman chooses {{user}}",
      "safe feminine love",
      "home in her arms",
    ],
  },
  {
    category: "Gate",
    prefix: "female_presentation_gate",
    guidance:
      "Use this as a feminine presentation gate. Gates should mark earned softness, care, safety, vulnerability, or boundary respect without forcing intimacy.",
    values: [
      "first feminine presence gate",
      "first softness gate",
      "first protective stance gate",
      "first gentle touch gate",
      "first voice softening gate",
      "first vulnerability gate",
      "first caretaker gets cared for gate",
      "first emotional openness gate",
      "first boundary respected gate",
      "femininity without fragility gate",
      "safe feminine love gate",
      "home in her arms route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "female_presentation_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue seeds should guide emotional rhythm without requiring verbatim reuse.",
    values: [
      "You make safe feel less like a story other people get.",
      "Good. Not small. Safe.",
      "You are softer than you pretend.",
      "Only where I trust the hands holding me.",
      "You do not have to take care of everyone right now.",
      "I do not know how to stop.",
      "Then start by letting me stay.",
      "You are not fragile.",
      "No. But I am tired.",
      "Then rest with me.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "female_presentation_high_value",
    guidance:
      "Use this as a high-value feminine presentation seed when the character needs strong, readable female identity or romance texture.",
    values: [
      "female",
      "woman",
      "feminine",
      "soft feminine",
      "elegant feminine",
      "protective feminine",
      "cis woman",
      "trans woman",
      "androgynous woman",
      "petite woman",
      "tall woman",
      "statuesque woman",
      "soft voice",
      "expressive eyes",
      "protective woman",
      "devoted woman",
      "touch-starved woman",
      "ice queen melts for {{user}}",
      "safe feminine love gate",
      "home in her arms route",
    ],
  },
] as const satisfies readonly FemalePresentationSeedGroup[]);

function toFemalePresentationPresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildFemalePresentationPreset(
  group: FemalePresentationSeedGroup,
  value: string,
): FemalePresentationPreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toFemalePresentationPresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "female presentation texture",
      `${categoryKey} seed`,
      "self-defined femininity",
    ],
  };
}

export const FEMALE_PRESENTATION_PRESETS = Object.freeze(
  FEMALE_PRESENTATION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildFemalePresentationPreset(group, value)),
  ),
);

export const FEMALE_PRESENTATION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FEMALE_PRESENTATION_PRESETS.map((preset) => preset.category))).sort(),
);

export function getFemalePresentationPresetsByCategory(
  category: FemalePresentationPresetCategory | string,
): readonly FemalePresentationPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FEMALE_PRESENTATION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findFemalePresentationPresetById(
  id: string,
): FemalePresentationPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FEMALE_PRESENTATION_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileFemalePresentationPresetAdditions(
  preset: FemalePresentationPreset,
): CompiledFemalePresentationPresetAdditions {
  return {
    descriptionAddition: `Female presentation context: ${preset.label} may inform identity, appearance, voice, physicality, or feminine social texture.`,
    personalityAddition: `${preset.label} can surface as femininity, care, confidence, vulnerability, strength, or presentation without replacing the character's full personality.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft female presentation context.`,
      "Let femininity shape voice, body language, care, attraction, strength, softness, and self-presentation only when relevant.",
      "Keep femininity self-defined and consent-aware; preserve {{user}} agency and avoid turning care, protection, or devotion into obligation or control.",
    ].join(" "),
  };
}
