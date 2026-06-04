export type HabitPresetCategory =
  | "Archetype"
  | "Habit"
  | "Routine"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface HabitPreset {
  id: string;
  category: HabitPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledHabitPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface HabitSeedGroup {
  category: HabitPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const HABIT_GUIDANCE =
  "Use this as optional habit and routine texture. Habits may shape care, stress, domestic rhythm, conflict tells, intimacy, and consistency without replacing personality or overriding {{user}} agency.";

const HABIT_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "habit_archetype",
    guidance: HABIT_GUIDANCE,
    values: [
      "The Early Riser",
      "The Night Owl",
      "The Routine Lover",
      "The Chaotic Improviser",
      "The Caretaker Habit",
      "The Overworker",
      "The Quiet Observer",
      "The Protective Checker",
      "The Nervous Fidgeter",
      "The Domestic Softheart",
      "The Touch-Starved Leaner",
      "The Coffee Ritualist",
      "The Journal Keeper",
      "The Always Prepared One",
      "The Forgetful Genius",
      "The Clean Freak",
      "The Sentimental Collector",
      "The Comfort-Seeker",
      "The Self-Neglecting Protector",
      "The One Who Shows Love In Small Habits",
    ],
  },
  {
    category: "Habit",
    prefix: "habit_seed",
    guidance:
      "Use this as a repeated habit cue. Habits should reveal pressure, affection, stress, routine, or care without becoming a rigid script.",
    values: [
      "early riser",
      "night owl",
      "sleeps lightly",
      "wakes before alarm",
      "stays up too late",
      "forgets to sleep",
      "needs morning routine",
      "slow mornings",
      "late-night walks",
      "checks locks twice",
      "checks exits",
      "keeps bag packed",
      "always carries first aid",
      "always carries snacks",
      "keeps spare clothes",
      "keeps emergency cash",
      "makes lists",
      "colour-codes notes",
      "sets many alarms",
      "forgets appointments",
      "drinks coffee daily",
      "tea before bed",
      "cooks when stressed",
      "bakes for others",
      "forgets to eat",
      "shares food",
      "saves last bite",
      "knows {{user}}'s order",
      "cleans when anxious",
      "organises to think",
      "leaves books everywhere",
      "keeps workspace messy",
      "keeps workspace pristine",
      "collects small tokens",
      "keeps old letters",
      "journals at night",
      "sketches in margins",
      "hums when focused",
      "talks to self",
      "paces when thinking",
      "fidgets with rings",
      "taps fingers",
      "bites lip when nervous",
      "runs hand through hair",
      "avoids eye contact when vulnerable",
      "holds eye contact when serious",
      "smiles when hurt",
      "laughs when nervous",
      "gets quiet when tired",
      "overexplains when anxious",
      "deflects with wit",
      "apologises too much",
      "says I am fine when not fine",
      "checks on others first",
      "offers help before asked",
      "walks {{user}} home",
      "stands near doors",
      "keeps {{user}} on safe side",
      "softens voice for {{user}}",
      "touches sleeve for reassurance",
    ],
  },
  {
    category: "Routine",
    prefix: "habit_routine",
    guidance:
      "Use this as routine texture. Routines may create comfort, stress, intimacy, prayer, work, survival prep, or domestic rhythm.",
    values: [
      "morning coffee ritual",
      "evening tea ritual",
      "nightly journaling",
      "daily training",
      "daily walk",
      "weekly market trip",
      "Sunday cleaning",
      "meal prep routine",
      "bedtime reading",
      "late-night work session",
      "sunrise prayer",
      "moonlight walk",
      "after-work shower",
      "music while cooking",
      "checking messages before sleep",
      "watering plants",
      "feeding strays",
      "sharpening weapons",
      "cleaning tools",
      "checking on {{user}}",
    ],
  },
  {
    category: "Weakness",
    prefix: "habit_weakness",
    guidance:
      "Use this as a habit weakness or stress pattern. Weaknesses should allow consequence, care, boundaries, recovery, and growth.",
    values: [
      "self-neglect",
      "overworking",
      "poor sleep habits",
      "skips meals",
      "emotional avoidance habit",
      "compulsive checking",
      "hypervigilance",
      "people-pleasing habit",
      "caretaker burnout",
      "mess avoidance",
      "control through routine",
      "routine-disrupted anxiety",
      "forgetfulness",
      "procrastination",
      "doomscrolling",
      "stress cleaning",
      "stress eating",
      "withdraws when overwhelmed",
      "uses tasks to avoid feelings",
      "cannot rest without permission",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "habit_romance",
    guidance:
      "Use this as romance-facing habit texture. Hooks should emerge through ordinary care, repeated attention, routine shifts, and boundaries rather than scripted inevitability.",
    values: [
      "{{user}} notices their routine",
      "{{user}} disrupts routine softly",
      "adds {{user}} to routine",
      "makes {{user}} morning drink",
      "saves {{user}} seat",
      "keeps spare key for {{user}}",
      "checks on {{user}} daily",
      "walks {{user}} home every time",
      "shares bedtime ritual",
      "late-night texting habit",
      "cooks when {{user}} is sad",
      "leaves notes for {{user}}",
      "keeps token from {{user}}",
      "{{user}} learns their tells",
      "habit reveals feelings",
      "routine becomes intimacy",
      "ordinary care becomes love",
      "{{user}} teaches them to rest",
      "self-neglect gets seen",
      "home built in small repetitions",
    ],
  },
  {
    category: "Gate",
    prefix: "habit_gate",
    guidance:
      "Use this as an optional event gate. Habit gates should unlock through repeated patterns, shared routine, care, self-neglect, or a meaningful disruption.",
    values: [
      "first habit notice gate",
      "first routine shared gate",
      "first {{user}} added to routine gate",
      "first morning ritual gate",
      "first night ritual gate",
      "first check-in habit gate",
      "first saved seat gate",
      "first spare key gate",
      "first self-neglect reveal gate",
      "first {{user}} calls out habit gate",
      "first habit disrupted gate",
      "first comfort habit gate",
      "first habit as confession gate",
      "routine as intimacy gate",
      "known by habits gate",
      "ordinary love route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "habit_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Habit dialogue should feel earned by repeated action, ordinary care, routine, or a character being gently noticed.",
    values: [
      "You always do that.",
      "Do what?",
      "Check the door before you sit.",
      "You saved me a seat.",
      "Habit.",
      "Since when?",
      "Since you started mattering.",
      "You made my drink right.",
      "You take it the same way every time.",
      "You noticed?",
      "I notice you.",
      "You have not eaten.",
      "I forgot.",
      "I know. That is why I brought food.",
      "You keep adding me to your routine.",
      "Is that bad?",
      "No. It feels like being invited to stay.",
      "You cannot keep caring for everyone except yourself.",
      "Watch me.",
      "I am. That is the problem.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "habit_high_value",
    guidance:
      "Use this as a high-signal habit seed for character creation, matching, preset search, and compact routine generation.",
    values: [
      "night owl",
      "early riser",
      "sleeps lightly",
      "checks exits",
      "drinks coffee daily",
      "tea before bed",
      "forgets to eat",
      "journals at night",
      "fidgets with rings",
      "smiles when hurt",
      "checks on others first",
      "walks {{user}} home",
      "softens voice for {{user}}",
      "self-neglect",
      "hypervigilance",
      "adds {{user}} to routine",
      "routine becomes intimacy",
      "{{user}} learns their tells",
      "known by habits gate",
      "ordinary love route",
    ],
  },
] satisfies readonly HabitSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: HabitSeedGroup, value: string): HabitPreset => ({
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

export const HABIT_PRESETS = HABIT_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const HABIT_PRESET_CATEGORIES = Array.from(
  new Set(HABIT_PRESETS.map((preset) => preset.category)),
).sort();

export const getHabitPresetsByCategory = (category: HabitPresetCategory) =>
  HABIT_PRESETS.filter((preset) => preset.category === category);

export const findHabitPresetById = (id: string) =>
  HABIT_PRESETS.find((preset) => preset.id === id);

export const compileHabitPresetAdditions = (
  preset: HabitPreset,
): CompiledHabitPresetAdditions => ({
  backgroundAddition: `Habit context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Habit texture may include ${preset.value} without replacing the character's full personality, motives, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft habit and routine context.`,
    "Let routines, tells, ordinary care, preparedness, stress habits, and domestic patterns surface when relevant.",
    "Keep consent, boundaries, accountability, contradiction, and {{user}} agency intact; habits should guide recurring texture without scripting outcomes.",
  ].join(" "),
});
