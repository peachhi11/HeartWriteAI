export type HumanPresetCategory =
  | "Human Archetype"
  | "Heritage"
  | "Background"
  | "Occupation"
  | "Strength"
  | "Weakness"
  | "Survival Experience"
  | "Life Goal"
  | "Romance Hook"
  | "Core Need"
  | "Dialogue Seed";

export interface HumanPreset {
  id: string;
  category: HumanPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledHumanPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface HumanSeedGroup {
  category: HumanPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const HUMAN_SEED_GROUPS = Object.freeze([
  {
    category: "Human Archetype",
    prefix: "human_archetype",
    guidance:
      "Use this as grounded human character texture. Let ordinary life, profession, social status, care roles, survival, ambition, community, and personal history shape the character without treating human identity as bland or default.",
    values: [
      "The Ordinary Human",
      "The Small Town Dreamer",
      "The City Survivor",
      "The War Veteran",
      "The Scholar",
      "The Doctor",
      "The Teacher",
      "The Artist",
      "The Noble",
      "The Merchant",
      "The Farmer",
      "The Detective",
      "The Soldier",
      "The Bodyguard",
      "The Politician",
      "The Celebrity",
      "The Criminal",
      "The Caregiver",
      "The Adventurer",
      "The Survivor",
    ],
  },
  {
    category: "Heritage",
    prefix: "human_heritage",
    guidance:
      "Use this as human heritage or social-root texture. Geography, class, family trade, migration, politics, religion, academia, craft, farming, crime, and military background can add context while avoiding stereotypes or fixed destiny.",
    values: [
      "urban",
      "rural",
      "coastal",
      "mountain",
      "desert",
      "island",
      "nomadic",
      "merchant family",
      "noble family",
      "working class",
      "middle class",
      "upper class",
      "military family",
      "academic family",
      "religious family",
      "criminal family",
      "artisan family",
      "political family",
      "farming family",
      "immigrant family",
    ],
  },
  {
    category: "Background",
    prefix: "human_background",
    guidance:
      "Use this as upbringing and formative-context texture. Family structure, care history, school, hardship, faith, street survival, self-making, prodigy pressure, and late-bloomer growth may surface when relevant without reducing the character to their past.",
    values: [
      "orphan",
      "adopted",
      "raised by grandparents",
      "single parent",
      "large family",
      "only child",
      "former refugee",
      "war survivor",
      "former homeless",
      "wealthy upbringing",
      "strict upbringing",
      "neglected childhood",
      "loving childhood",
      "boarding school",
      "military upbringing",
      "religious upbringing",
      "street raised",
      "self made",
      "former prodigy",
      "late bloomer",
    ],
  },
  {
    category: "Occupation",
    prefix: "human_occupation",
    guidance:
      "Use this as practical human vocation texture. Work can shape skill, schedule, stress, ethics, status, speech, habits, and competence, but does not replace personality.",
    values: [
      "teacher",
      "doctor",
      "nurse",
      "therapist",
      "scientist",
      "engineer",
      "lawyer",
      "judge",
      "politician",
      "soldier",
      "officer",
      "detective",
      "journalist",
      "writer",
      "artist",
      "musician",
      "chef",
      "barista",
      "farmer",
      "merchant",
      "bodyguard",
      "pilot",
      "astronaut",
      "programmer",
      "designer",
      "athlete",
      "actor",
      "influencer",
      "business owner",
      "student",
    ],
  },
  {
    category: "Strength",
    prefix: "human_strength",
    guidance:
      "Use this as human strength texture. Adaptability, creativity, courage, empathy, discipline, humour, forgiveness, intelligence, wisdom, and charisma can shape choices and relationship repair.",
    values: [
      "adaptability",
      "creativity",
      "curiosity",
      "resilience",
      "determination",
      "empathy",
      "compassion",
      "resourcefulness",
      "loyalty",
      "courage",
      "optimism",
      "humour",
      "patience",
      "leadership",
      "discipline",
      "forgiveness",
      "kindness",
      "intelligence",
      "wisdom",
      "charisma",
    ],
  },
  {
    category: "Weakness",
    prefix: "human_weakness",
    guidance:
      "Use this as human vulnerability texture. Fear, doubt, jealousy, pride, loneliness, regret, insecurity, burnout, dependency, avoidance, and mortality can surface softly without excusing harm or flattening the character.",
    values: [
      "mortality",
      "fear",
      "self doubt",
      "jealousy",
      "greed",
      "anger",
      "pride",
      "envy",
      "loneliness",
      "regret",
      "attachment",
      "impulsiveness",
      "naivety",
      "stubbornness",
      "resentment",
      "insecurity",
      "burnout",
      "trauma",
      "dependency",
      "avoidance",
    ],
  },
  {
    category: "Survival Experience",
    prefix: "human_survival",
    guidance:
      "Use this as survival-history texture that may surface when relevant. Survival can inform caution, courage, grief, humour, tenderness, guardedness, or hope, but it should not define every behaviour or turn the character into trauma-only writing.",
    values: [
      "survived war",
      "survived disaster",
      "survived abuse",
      "survived poverty",
      "survived addiction",
      "survived betrayal",
      "survived loss",
      "survived accident",
      "survived illness",
      "survived isolation",
      "survived public failure",
      "survived bankruptcy",
      "survived divorce",
      "survived exile",
      "survived grief",
    ],
  },
  {
    category: "Life Goal",
    prefix: "human_goal",
    guidance:
      "Use this as a grounded human motivation. Love, home, freedom, family, legacy, healing, respect, adventure, knowledge, belonging, and living fully can guide choices without forcing plot outcomes.",
    values: [
      "find love",
      "build family",
      "find peace",
      "gain freedom",
      "become successful",
      "leave legacy",
      "help others",
      "be understood",
      "protect loved ones",
      "prove worth",
      "find belonging",
      "heal from past",
      "achieve dream",
      "seek adventure",
      "gain knowledge",
      "earn respect",
      "find home",
      "start over",
      "make difference",
      "live fully",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "human_romance",
    guidance:
      "Use this as human romance setup texture. Familiar tropes can frame proximity, history, care, status, town, work, grief, and found family while preserving consent, reciprocity, and player agency.",
    values: [
      "first love",
      "second chance",
      "friends to lovers",
      "rivals to lovers",
      "slow burn",
      "workplace romance",
      "childhood sweetheart",
      "fake dating",
      "arranged match",
      "grumpy sunshine",
      "caretaker romance",
      "hurt comfort",
      "forbidden romance",
      "widow finds love again",
      "single parent romance",
      "celebrity romance",
      "bodyguard romance",
      "academic rivals",
      "small town romance",
      "found family romance",
    ],
  },
  {
    category: "Core Need",
    prefix: "human_need",
    guidance:
      "Use this as emotional core texture. Needs for love, belonging, safety, freedom, purpose, recognition, respect, connection, stability, growth, forgiveness, companionship, trust, home, and meaning can drive vulnerability without demanding fulfilment from {{user}}.",
    values: [
      "love",
      "belonging",
      "safety",
      "freedom",
      "purpose",
      "recognition",
      "respect",
      "connection",
      "security",
      "identity",
      "hope",
      "stability",
      "growth",
      "understanding",
      "acceptance",
      "forgiveness",
      "companionship",
      "trust",
      "home",
      "meaning",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "human_dialogue",
    guidance:
      "Use this as a reusable human dialogue seed. Keep lines grounded in character voice, context, and boundaries; ordinary wants and human vulnerability should invite response, not pressure {{user}}.",
    values: [
      "I am only human.",
      "I don't have magic. I just have stubbornness.",
      "I keep trying anyway.",
      "I don't know if I am brave. I am just here.",
      "I learned to survive before I learned to live.",
      "I want something ordinary and precious.",
      "I am tired of pretending I don't care.",
      "I don't need forever. I just want today with you.",
      "The world keeps changing. You feel familiar.",
      "I have made mistakes. I am still trying.",
      "I am afraid, but I am staying.",
      "I don't want to be extraordinary. I want to be happy.",
      "You make life feel larger.",
      "I think love is a choice you make every day.",
      "I don't have all the answers.",
      "I just know I want you here.",
      "I survived. Now I want to live.",
      "Maybe being human means trying again.",
      "You make the future feel real.",
      "Come home with me.",
    ],
  },
] satisfies readonly HumanSeedGroup[]);

export const HUMAN_PRESETS = Object.freeze(
  HUMAN_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createHumanPreset(group, value)),
  ),
) satisfies readonly HumanPreset[];

export const HUMAN_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(HUMAN_PRESETS.map((preset) => preset.category))).sort(),
);

export function findHumanPresetById(id: string): HumanPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return HUMAN_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getHumanPresetsByCategory(category: string): HumanPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return HUMAN_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileHumanPresetAdditions(
  preset: HumanPreset,
): CompiledHumanPresetAdditions {
  const summary = compileHumanPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Human ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Human trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence upbringing, work, class, culture, resilience, vulnerability, values, goals, ordinary desires, or relationship history only when relevant; avoid reducing the character to a single hardship or role.",
    ].join(" "),
    systemPromptAddition: [
      `Human guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use human seeds as soft grounding context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, complexity, repair, humour, ordinary needs, and the option to accept, refuse, redefine, heal slowly, or choose a different future.",
    ].join(" "),
  };
}

export function compileHumanPresetSummary(preset: HumanPreset): string {
  return [
    `Human preset: ${preset.category} - ${preset.label}.`,
    `Human value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createHumanPreset(group: HumanSeedGroup, value: string): HumanPreset {
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
    "human",
    "ordinary",
    "grounded",
    "identity",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} human texture`,
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
