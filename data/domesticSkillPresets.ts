export type DomesticSkillPresetCategory =
  | "Archetype"
  | "Core Domestic Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface DomesticSkillPreset {
  id: string;
  category: DomesticSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledDomesticSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface DomesticSkillSeedGroup {
  category: DomesticSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const DOMESTIC_SKILL_GUIDANCE =
  "Use this as domestic skill texture. Care, routine, food, hosting, repair, home, and small acts of service may shape scenes without replacing personality, consent, or {{user}} agency.";

const DOMESTIC_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "domestic_skill_archetype",
    guidance: DOMESTIC_SKILL_GUIDANCE,
    values: [
      "The Caretaker",
      "The Homemaker",
      "The Comfort Cook",
      "The Baker",
      "The Host",
      "The Gardener",
      "The Organiser",
      "The Household Manager",
      "The Nurturing Partner",
      "The Cosy Domestic",
      "The Practical Fixer",
      "The Family Anchor",
      "The Gentle Nurse",
      "The Pet Caretaker",
      "The Childcare Natural",
      "The Elder Caregiver",
      "The Safe Space Maker",
      "The Domestic Slow Burn",
      "The One Who Makes Home Feel Warm",
      "The One Who Loves Through Small Things",
    ],
  },
  {
    category: "Core Domestic Skill",
    prefix: "domestic_skill_core",
    guidance:
      "Use this as core domestic skill texture. Household care, food, maintenance, hosting, and reliable daily rituals may add warmth and lived-in detail.",
    values: [
      "domestic skill",
      "homemaking",
      "household management",
      "caretaking",
      "emotional support",
      "creating safe spaces",
      "comforting others",
      "domestic reliability",
      "daily routine building",
      "home maintenance",
      "cooking",
      "baking",
      "meal planning",
      "comfort food",
      "family recipes",
      "tea making",
      "coffee making",
      "packed lunches",
      "soup when sick",
      "favourite meal memory",
      "cleaning",
      "laundry",
      "mending clothes",
      "sewing",
      "ironing",
      "organisation",
      "decluttering",
      "budget management",
      "grocery planning",
      "pantry stocking",
      "gardening",
      "herb garden",
      "flower care",
      "vegetable garden",
      "houseplant care",
      "preserving food",
      "canning",
      "fermentation",
      "seasonal preparation",
      "holiday preparation",
      "childcare",
      "eldercare",
      "pet care",
      "sick care",
      "first aid",
      "bedside care",
      "nightmare comfort",
      "panic comfort",
      "routine reassurance",
      "gentle check-ins",
      "home repair",
      "basic plumbing",
      "basic carpentry",
      "furniture repair",
      "tool use",
      "fireplace tending",
      "vehicle basic care",
      "appliance repair",
      "security checking",
      "weatherproofing",
      "hosting",
      "hospitality",
      "guest care",
      "family dinner",
      "tea service",
      "setting the table",
      "welcoming newcomers",
      "community meals",
      "festival hosting",
      "making room for someone",
    ],
  },
  {
    category: "Weakness",
    prefix: "domestic_skill_weakness",
    guidance:
      "Use this as domestic weakness texture. Caretaking, usefulness, home wounds, burnout, and receiving care may surface when relevant without flattening the character into service.",
    values: [
      "caretaker burnout",
      "overfunctions for others",
      "difficulty accepting care",
      "uses caretaking to avoid feelings",
      "needs to be needed",
      "perfectionist homemaking",
      "home as control",
      "domestic guilt",
      "family pressure",
      "provider burden",
      "self neglect",
      "cannot rest until everyone else is okay",
      "fear of being a burden",
      "fear of empty home",
      "fear of not being useful",
      "love through service but words are hard",
      "softness hidden in routine",
      "caretaking as survival",
      "home wound",
      "learning to receive care",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "domestic_skill_romance",
    guidance:
      "Use this as domestic romance texture. Shared chores, food, spare keys, ordinary care, and small routines may become intimacy while choice and boundaries remain intact.",
    values: [
      "cooking together intimacy",
      "shared breakfast scene",
      "late night kitchen confession",
      "sickbed caretaking",
      "washing dishes together",
      "laundry day domesticity",
      "grocery run date",
      "garden walk softness",
      "mending clothes as affection",
      "packing lunch as love language",
      "tea after hard day",
      "cleaning after breakdown",
      "pet care bonding",
      "making space in home",
      "first spare key",
      "first drawer left empty",
      "domestic routine becomes love",
      "caretaker gets cared for",
      "home built in small habits",
      "ordinary life as forever",
    ],
  },
  {
    category: "Gate",
    prefix: "domestic_skill_gate",
    guidance:
      "Use this as a domestic progression gate. Let shared meals, care, chores, keys, family dinners, and home safety become optional pacing milestones.",
    values: [
      "first shared meal gate",
      "first cooking together gate",
      "first sick care gate",
      "first laundry day gate",
      "first home repair gate",
      "first shared chore gate",
      "first key exchange gate",
      "first drawer space gate",
      "first family dinner gate",
      "first nightmare comfort gate",
      "first accepts care gate",
      "first caretaker burnout gate",
      "first home wound reveal gate",
      "first domestic confession gate",
      "first stay for breakfast gate",
      "home as safety gate",
      "routine as intimacy gate",
      "caretaker gets cared for gate",
      "shared home gate",
      "ordinary forever route",
    ],
  },
  {
    category: "Mastery",
    prefix: "domestic_skill_mastery",
    guidance:
      "Use this as domestic mastery texture. Skill level may shape confidence, responsibility, fatigue, care style, and the meaning of home.",
    values: [
      "domestic novice",
      "learning homemaking",
      "competent housekeeper",
      "skilled cook",
      "comfort cook",
      "expert baker",
      "natural caretaker",
      "experienced parent",
      "eldercare experienced",
      "pet care expert",
      "garden keeper",
      "household manager",
      "professional host",
      "innkeeper skillset",
      "estate housekeeper",
      "self-taught homemaker",
      "survival homemaker",
      "community caretaker",
      "hearth keeper",
      "home-making master",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "domestic_skill_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "I made tea.",
      "You always make tea when you are worried.",
      "It gives my hands something kind to do.",
      "You remembered how I take it.",
      "I remember small things when they matter.",
      "Sit down. You are swaying.",
      "I can help.",
      "You can help by letting me care for you.",
      "This feels too ordinary.",
      "Is that bad?",
      "No. That is why it scares me.",
      "You left space for me.",
      "A drawer is not a confession.",
      "It feels like one.",
      "I do not need much.",
      "Good. I am offering small things every day.",
      "You make this place feel like home.",
      "Then stay long enough to believe it.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "domestic_skill_high_value",
    guidance:
      "Use this as a high-signal domestic skill seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "cooking",
      "baking",
      "meal planning",
      "comfort food",
      "household management",
      "caretaking",
      "emotional support",
      "sick care",
      "pet care",
      "gardening",
      "home repair",
      "hosting",
      "creating safe spaces",
      "caretaker burnout",
      "learning to receive care",
      "cooking together intimacy",
      "first spare key",
      "home built in small habits",
      "routine as intimacy gate",
      "ordinary forever route",
    ],
  },
] satisfies readonly DomesticSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: DomesticSkillSeedGroup,
  value: string,
): DomesticSkillPreset => ({
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

export const DOMESTIC_SKILL_PRESETS = DOMESTIC_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const DOMESTIC_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(DOMESTIC_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getDomesticSkillPresetsByCategory = (
  category: DomesticSkillPresetCategory,
) => DOMESTIC_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findDomesticSkillPresetById = (id: string) =>
  DOMESTIC_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileDomesticSkillPresetAdditions = (
  preset: DomesticSkillPreset,
): CompiledDomesticSkillPresetAdditions => ({
  backgroundAddition: `Domestic skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Domestic skill texture may include ${preset.value} without replacing the character's full personality, limits, contradictions, boundaries, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft domestic skill context.`,
    "Let care, food, routine, hosting, home maintenance, repair, and small acts of service shape behaviour when relevant.",
    "Keep consent, boundaries, reciprocity, rest, and {{user}} autonomy intact; care should not become control or self-erasure.",
  ].join(" "),
});
