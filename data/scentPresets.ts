export type ScentPresetCategory =
  | "Archetype"
  | "Scent"
  | "Mood"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface ScentPreset {
  id: string;
  category: ScentPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledScentPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ScentSeedGroup {
  category: ScentPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SCENT_GUIDANCE =
  "Use this as scent and sensory identity texture. Scent may shape memory, comfort, desire, danger, species cues, intimacy, and home without replacing personality, consent, or {{user}} agency.";

const SCENT_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "scent_archetype",
    guidance: SCENT_GUIDANCE,
    values: [
      "Clean Skin",
      "Warm Vanilla",
      "Smoke and Leather",
      "Rain and Cedar",
      "Old Books and Tea",
      "Rose and Black Pepper",
      "Ocean Salt",
      "Woodsmoke",
      "Fresh Laundry",
      "Coffee and Cardamom",
      "Iron and Gunpowder",
      "Night-Blooming Jasmine",
      "Honey and Sunlight",
      "Amber and Musk",
      "Pine Forest",
      "Expensive Cologne",
      "Blood and Velvet",
      "Ozone and Metal",
      "Temple Incense",
      "Home After Rain",
    ],
  },
  {
    category: "Scent",
    prefix: "scent_seed",
    guidance:
      "Use this as scent texture. Scent details may ground closeness, memory, atmosphere, species traits, profession, danger, or home when relevant.",
    values: [
      "clean skin",
      "warm skin",
      "fresh laundry",
      "soap",
      "shampoo",
      "rainwater",
      "petrichor",
      "ocean salt",
      "sea air",
      "forest air",
      "pine",
      "cedar",
      "sandalwood",
      "oakmoss",
      "vetiver",
      "woodsmoke",
      "campfire smoke",
      "tobacco",
      "leather",
      "old books",
      "paper",
      "ink",
      "black tea",
      "green tea",
      "coffee",
      "vanilla",
      "honey",
      "caramel",
      "cinnamon",
      "cardamom",
      "clove",
      "citrus",
      "orange blossom",
      "bergamot",
      "mint",
      "lavender",
      "rose",
      "jasmine",
      "violet",
      "lilac",
      "gardenia",
      "wildflowers",
      "fresh cut grass",
      "earth",
      "rain on stone",
      "snow air",
      "cold metal",
      "ozone",
      "gunpowder",
      "iron",
      "blood",
      "salt sweat",
      "warm musk",
      "amber",
      "myrrh",
      "frankincense",
      "incense",
      "candle wax",
      "expensive perfume",
      "expensive cologne",
      "spiced oil",
      "medicinal herbs",
      "apothecary",
      "engine grease",
      "machine oil",
      "sterile clinic",
      "magic static",
      "starlight ozone",
    ],
  },
  {
    category: "Mood",
    prefix: "scent_mood",
    guidance:
      "Use this as scent mood texture. Mood labels can help translate a scent into comfort, unease, longing, sensuality, danger, or familiarity.",
    values: [
      "comforting scent",
      "clean scent",
      "warm scent",
      "cold scent",
      "dark scent",
      "sweet scent",
      "spiced scent",
      "floral scent",
      "earthy scent",
      "woody scent",
      "smoky scent",
      "metallic scent",
      "aquatic scent",
      "green scent",
      "powdery scent",
      "sensual scent",
      "expensive scent",
      "familiar scent",
      "dangerous scent",
      "home-like scent",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "scent_romance",
    guidance:
      "Use this as romance-facing scent texture. Scent may support memory, comfort, proximity, species recognition, longing, or home while keeping boundaries intact.",
    values: [
      "{{user}} recognises scent",
      "scent lingers on clothes",
      "borrowed jacket smells like them",
      "pillow smells like them",
      "hug reveals scent",
      "scent changes when flustered",
      "scent marks safe person",
      "comforted by scent",
      "scent triggers memory",
      "scent as mate bond",
      "vampire notices blood scent",
      "shifter recognises {{user}} by scent",
      "android has synthetic signature scent",
      "perfume given as gift",
      "cologne left after goodbye",
      "rain makes scent stronger",
      "injury reveals blood scent",
      "scent on borrowed clothes",
      "home smells like them",
      "love remembered by scent",
    ],
  },
  {
    category: "Gate",
    prefix: "scent_gate",
    guidance:
      "Use this as an optional event gate. Scent should surface through embodied scenes, memory, clothing, proximity, or species context rather than constant exposition.",
    values: [
      "first scent notice gate",
      "first borrowed clothing gate",
      "first hug scent gate",
      "first comfort by scent gate",
      "first scent memory gate",
      "first scent on pillow gate",
      "first perfume gift gate",
      "first species scent reveal gate",
      "first blood scent gate",
      "first mate scent gate",
      "scent as safety gate",
      "scent as longing gate",
      "scent as home gate",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "scent_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: [
      "You smell like rain.",
      "Should I be offended?",
      "No. It means the room changed before I looked up.",
      "Your jacket smells like you.",
      "You kept it?",
      "I was cold.",
      "Liar.",
      "You always smell like home.",
      "That is a dangerous thing to say to someone lonely.",
      "Then let it be dangerous.",
      "I could find you by scent alone.",
      "That sounds possessive.",
      "It sounds true.",
      "This perfume is new.",
      "You noticed?",
      "I notice everything when it is yours.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "scent_high_value",
    guidance:
      "Use this as a high-signal scent seed. These are compact selectors for character creation, matching, and preset search.",
    values: [
      "clean skin",
      "fresh laundry",
      "rainwater",
      "petrichor",
      "cedar",
      "sandalwood",
      "woodsmoke",
      "leather",
      "old books",
      "coffee",
      "vanilla",
      "jasmine",
      "rose",
      "amber",
      "warm musk",
      "ozone",
      "iron",
      "blood",
      "borrowed jacket smells like them",
      "scent as home gate",
    ],
  },
] satisfies readonly ScentSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: ScentSeedGroup, value: string): ScentPreset => ({
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

export const SCENT_PRESETS = SCENT_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const SCENT_PRESET_CATEGORIES = Array.from(
  new Set(SCENT_PRESETS.map((preset) => preset.category)),
).sort();

export const getScentPresetsByCategory = (category: ScentPresetCategory) =>
  SCENT_PRESETS.filter((preset) => preset.category === category);

export const findScentPresetById = (id: string) =>
  SCENT_PRESETS.find((preset) => preset.id === id);

export const compileScentPresetAdditions = (
  preset: ScentPreset,
): CompiledScentPresetAdditions => ({
  backgroundAddition: `Scent context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Scent texture may include ${preset.value} without replacing the character's full personality, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft scent context.`,
    "Let scent, memory, proximity, comfort, danger, species cues, clothing, and place shape behaviour when relevant.",
    "Keep consent, privacy, boundaries, and {{user}} autonomy intact; scent should add sensory specificity without forcing intimacy or possession.",
  ].join(" "),
});
