export type AnatomyPresetCategory =
  | "Archetype"
  | "Anatomy"
  | "Body Structure"
  | "Musculature"
  | "Hands"
  | "Facial Structure"
  | "Skin"
  | "Movement Anatomy"
  | "Fantasy Anatomy"
  | "Sci-Fi Anatomy"
  | "Anatomy Health"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface AnatomyPreset {
  id: string;
  category: AnatomyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAnatomyPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AnatomySeedGroup {
  category: AnatomyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ANATOMY_GUIDANCE =
  "Use this as optional anatomy and physical-detail texture. Anatomy may inform build, posture, movement, hands, scars, health context, and presence without reducing the character to body parts or treating appearance as destiny.";

const ANATOMY_HEALTH_GUIDANCE =
  "Use this as health and body-history texture. Injury, stamina, stress, pain, or recovery details should remain respectful, non-diagnostic, and relevant only when they support character history, care, accessibility, or lived experience.";

const ANATOMY_TOUCH_GUIDANCE =
  "Use this as body-detail romance texture. Noticing hands, scars, posture, exhaustion, or physical presence should support tenderness, care, and consent-aware observation without assuming touch or access.";

const ANATOMY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "anatomy_archetype",
    guidance: ANATOMY_GUIDANCE,
    values: [
      "Athletic Build",
      "Lean Build",
      "Muscular Build",
      "Soft Build",
      "Broad Build",
      "Lithe Build",
      "Petite Frame",
      "Statuesque Frame",
      "Compact Build",
      "Willowy Build",
      "Powerfully Built",
      "Delicate Frame",
      "Rugged Physique",
      "Graceful Physique",
      "Androgynous Build",
      "Warrior Physique",
      "Dancer Physique",
      "Scholar Physique",
      "Labourer's Build",
      "Otherworldly Anatomy",
    ],
  },
  {
    category: "Anatomy",
    prefix: "anatomy_seed",
    guidance: ANATOMY_GUIDANCE,
    values: [
      "human anatomy",
      "humanoid anatomy",
      "nonhuman anatomy",
      "enhanced anatomy",
      "athletic anatomy",
      "soft anatomy",
      "muscular anatomy",
      "slender anatomy",
      "broad anatomy",
      "compact anatomy",
      "graceful anatomy",
      "powerful anatomy",
      "delicate anatomy",
      "balanced anatomy",
      "androgynous anatomy",
      "distinctive anatomy",
      "healthy anatomy",
      "scarred anatomy",
      "weathered anatomy",
      "otherworldly anatomy",
    ],
  },
  {
    category: "Body Structure",
    prefix: "anatomy_body_structure",
    guidance:
      "Use this as body-structure texture. Structure details should help visual continuity, posture, movement, and silhouette without ranking bodies by worth.",
    values: [
      "broad shoulders",
      "narrow shoulders",
      "strong frame",
      "light frame",
      "large frame",
      "small frame",
      "long limbs",
      "short limbs",
      "balanced proportions",
      "long torso",
      "short torso",
      "strong back",
      "straight posture",
      "flexible body",
      "dense musculature",
      "lean musculature",
      "compact strength",
      "endurance build",
      "speed build",
      "power build",
    ],
  },
  {
    category: "Musculature",
    prefix: "anatomy_musculature",
    guidance:
      "Use this as musculature and fitness texture. Strength can come from training, labour, survival, movement, or daily life without making one body type superior.",
    values: [
      "heavily muscular",
      "athletically muscular",
      "lean muscular",
      "functional strength",
      "defined musculature",
      "subtle musculature",
      "soft musculature",
      "labourer strength",
      "fighter strength",
      "runner build",
      "swimmer build",
      "climber build",
      "dancer strength",
      "manual labour build",
      "training sculpted",
      "naturally strong",
      "compact muscle",
      "explosive strength",
      "high endurance",
      "balanced fitness",
    ],
  },
  {
    category: "Hands",
    prefix: "anatomy_hands",
    guidance:
      "Use this as hand-detail texture. Hands can reveal work, care, artistry, violence, history, or tenderness, while touch still depends on consent and context.",
    values: [
      "large hands",
      "small hands",
      "calloused hands",
      "soft hands",
      "steady hands",
      "strong hands",
      "delicate hands",
      "scarred hands",
      "ink stained fingers",
      "paint stained hands",
      "rough palms",
      "long fingers",
      "short fingers",
      "craftsperson hands",
      "healer hands",
      "warrior hands",
      "musician hands",
      "mechanic hands",
      "warm hands",
      "cold hands",
    ],
  },
  {
    category: "Facial Structure",
    prefix: "anatomy_facial_structure",
    guidance:
      "Use this as facial-structure texture. Face details should support recognition, expression, and character history without flattening identity into attractiveness.",
    values: [
      "oval face",
      "round face",
      "heart shaped face",
      "square face",
      "angular face",
      "soft face",
      "strong jawline",
      "soft jawline",
      "high cheekbones",
      "broad cheekbones",
      "defined features",
      "delicate features",
      "symmetrical features",
      "distinctive features",
      "expressive face",
      "resting stern expression",
      "resting kind expression",
      "freckles",
      "beauty mark",
      "facial scars",
    ],
  },
  {
    category: "Skin",
    prefix: "anatomy_skin",
    guidance:
      "Use this as skin-detail texture. Skin details may carry weathering, scars, undertones, markings, or history, and should be described respectfully without fetishising difference.",
    values: [
      "smooth skin",
      "weathered skin",
      "freckled skin",
      "scarred skin",
      "sun touched skin",
      "pale skin",
      "deep skin tone",
      "olive skin",
      "golden undertones",
      "cool undertones",
      "warm undertones",
      "clear complexion",
      "roughened skin",
      "tattooed skin",
      "ritual markings",
      "birthmarks",
      "calloused skin",
      "healthy complexion",
      "outdoor weathering",
      "battle scars",
    ],
  },
  {
    category: "Movement Anatomy",
    prefix: "anatomy_movement",
    guidance:
      "Use this as movement and coordination texture. Movement details should convey training, temperament, fatigue, tension, grace, or physical history without forcing interpretation.",
    values: [
      "graceful movement",
      "fluid movement",
      "controlled movement",
      "precise movement",
      "heavy footed",
      "light footed",
      "athletic coordination",
      "awkward coordination",
      "predatory grace",
      "dancer balance",
      "fighter balance",
      "quiet steps",
      "powerful stride",
      "efficient movement",
      "economy of motion",
      "restless energy",
      "stillness under pressure",
      "high agility",
      "strong balance",
      "excellent coordination",
    ],
  },
  {
    category: "Fantasy Anatomy",
    prefix: "anatomy_fantasy",
    guidance:
      "Use this as fantasy-anatomy texture. Nonhuman traits should support species, magic, lore, silhouette, and sensory difference without erasing personhood or agency.",
    values: [
      "pointed ears",
      "horns",
      "fangs",
      "claws",
      "tail",
      "wings",
      "scaled skin",
      "feathered features",
      "glowing eyes",
      "unusual eye structure",
      "otherworldly bones",
      "enhanced senses",
      "magical markings",
      "runes on skin",
      "bioluminescence",
      "dragon traits",
      "fae traits",
      "demonic traits",
      "angelic traits",
      "shapeshifter traits",
    ],
  },
  {
    category: "Sci-Fi Anatomy",
    prefix: "anatomy_scifi",
    guidance:
      "Use this as sci-fi anatomy texture. Synthetic, modified, alien, or posthuman features should support capability, vulnerability, identity, and embodiment without reducing the character to hardware.",
    values: [
      "cybernetic implants",
      "prosthetic limbs",
      "synthetic organs",
      "genetic modifications",
      "enhanced reflexes",
      "enhanced strength",
      "enhanced vision",
      "neural interface ports",
      "artificial skin",
      "engineered biology",
      "clone anatomy",
      "posthuman features",
      "alien physiology",
      "adapted biology",
      "space adapted body",
      "cybernetic eyes",
      "reinforced skeleton",
      "nanotech modifications",
      "android frame",
      "hybrid biology",
    ],
  },
  {
    category: "Anatomy Health",
    prefix: "anatomy_health",
    guidance: ANATOMY_HEALTH_GUIDANCE,
    values: [
      "excellent health",
      "chronic injury",
      "old battle wounds",
      "high stamina",
      "low stamina",
      "strong immune system",
      "sensitive system",
      "high pain tolerance",
      "low pain tolerance",
      "fast recovery",
      "slow recovery",
      "persistent limp",
      "joint pain",
      "healed fractures",
      "overtrained body",
      "underfed history",
      "survivor physiology",
      "healthy routine",
      "body under stress",
      "resilient body",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "anatomy_romance",
    guidance: ANATOMY_TOUCH_GUIDANCE,
    values: [
      "{{user}} notices calloused hands",
      "{{user}} notices old scars",
      "{{user}} notices posture change",
      "{{user}} notices tension release",
      "healer notices injury",
      "partner recognises exhaustion",
      "shared training scene",
      "wound care scene",
      "scar story scene",
      "hands reveal history",
      "body language reveals feelings",
      "resting against partner",
      "physical presence as comfort",
      "strength used gently",
      "grace hidden under power",
      "partner learns body tells",
      "body relaxes near partner",
      "home felt in presence",
      "care for the body as love",
      "history written on skin",
    ],
  },
  {
    category: "Gate",
    prefix: "anatomy_gate",
    guidance:
      "Use this as anatomy and body-history gate texture. Gates should mark moments of noticing, trust, care, rest, scar reveal, injury reveal, or presence becoming emotionally meaningful.",
    values: [
      "first physical notice gate",
      "first scar reveal gate",
      "first injury reveal gate",
      "first body language gate",
      "first training gate",
      "first healing gate",
      "first tension release gate",
      "first rest scene gate",
      "first partner notices exhaustion gate",
      "first body trust gate",
      "first history on skin gate",
      "first presence as comfort gate",
      "body as story gate",
      "body as home route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "anatomy_dialogue",
    guidance:
      "Use this as anatomy and body-history dialogue texture. Dialogue should treat bodies as lived history, care, and presence, not as inspection or ownership.",
    values: [
      "Your hands tell a story.",
      "Most of it is hard work.",
      "And the rest?",
      "Survival.",
      "You are limping.",
      "Old injury.",
      "You say that like it does not still hurt.",
      "You relaxed.",
      "Did I?",
      "Only when I sat down beside you.",
      "These scars look old.",
      "They are.",
      "You survived them.",
      "Barely.",
      "Still survived.",
      "You carry tension in your shoulders.",
      "Occupational hazard.",
      "Maybe. Or loneliness.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "anatomy_high_value",
    guidance:
      "Use this as high-value anatomy texture for character creation, persona matching, and romance routing. Keep physical detail embodied, respectful, history-aware, and consent-aware.",
    values: [
      "athletic anatomy",
      "muscular anatomy",
      "slender anatomy",
      "graceful anatomy",
      "broad shoulders",
      "long limbs",
      "functional strength",
      "calloused hands",
      "strong hands",
      "high cheekbones",
      "strong jawline",
      "freckles",
      "facial scars",
      "scarred skin",
      "graceful movement",
      "predatory grace",
      "cybernetic implants",
      "pointed ears",
      "history written on skin",
      "body as story gate",
    ],
  },
] satisfies AnatomySeedGroup[]);

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

const toTags = (category: AnatomyPresetCategory, value: string) => [
  "anatomy",
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  toIdFragment(value).replace(/_/g, "-"),
];

export const ANATOMY_PRESETS: AnatomyPreset[] = ANATOMY_SEED_GROUPS.flatMap(
  (group) =>
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

export const ANATOMY_PRESET_CATEGORIES = Array.from(
  new Set(ANATOMY_PRESETS.map((preset) => preset.category)),
).sort();

export const getAnatomyPresetsByCategory = (category: AnatomyPresetCategory) =>
  ANATOMY_PRESETS.filter((preset) => preset.category === category);

export const findAnatomyPresetById = (id: string) =>
  ANATOMY_PRESETS.find((preset) => preset.id === id);

export const compileAnatomyPresetAdditions = (
  preset: AnatomyPreset,
): CompiledAnatomyPresetAdditions => ({
  relationshipAddition: `Anatomy and physical-detail context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Embodied detail expression: ${preset.value} may inform posture, movement, hands, scars, health context, physical presence, and character history without replacing the character's full personality or reducing them to appearance.`,
  systemPromptAddition: `Treat "${preset.value}" as soft anatomy and physical-detail context. Let body structure, movement, scars, hands, health history, fantasy traits, or sci-fi embodiment shape description only when relevant. Keep descriptions respectful, non-diagnostic, consent-aware, and personhood-first; avoid treating bodies as moral ranking, ownership, or automatic permission for touch.`,
});
