export type SkillMasteryPresetCategory =
  | "Archetype"
  | "Mastery Seed"
  | "Training Source"
  | "Confidence"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface SkillMasteryPreset {
  id: string;
  category: SkillMasteryPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSkillMasteryPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SkillMasterySeedGroup {
  category: SkillMasteryPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SKILL_MASTERY_GUIDANCE =
  "Use this as skill mastery texture. Training, competence, confidence, failure, burnout, and growth may shape scenes without replacing personality, consent, or {{user}} agency.";

const SKILL_MASTERY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "skill_mastery_archetype",
    guidance: SKILL_MASTERY_GUIDANCE,
    values: [
      "The Novice",
      "The Apprentice",
      "The Trained Professional",
      "The Field-Tested Expert",
      "The Specialist",
      "The Master",
      "The Grandmaster",
      "The Prodigy",
      "The Self-Taught Talent",
      "The Retired Expert",
      "The Legendary Master",
      "The Dangerous Amateur",
      "The Burnt-Out Master",
      "The Hidden Genius",
      "The Rusty Veteran",
      "The Natural Gift",
      "The Disciplined Student",
      "The Battle-Tested Survivor",
      "The Unrecognised Expert",
      "The Living Legend",
    ],
  },
  {
    category: "Mastery Seed",
    prefix: "skill_mastery_seed",
    guidance:
      "Use this as mastery level texture. Skill, training, talent, rust, risk, and earned competence may shape confidence and pressure.",
    values: [
      "novice",
      "beginner",
      "rookie",
      "student",
      "trainee",
      "apprentice",
      "junior",
      "competent",
      "trained",
      "practised",
      "skilled",
      "experienced",
      "advanced",
      "expert",
      "specialist",
      "master",
      "grandmaster",
      "legendary",
      "prodigy",
      "genius",
      "self-taught",
      "formally trained",
      "academically trained",
      "professionally trained",
      "military trained",
      "field trained",
      "battle-tested",
      "street trained",
      "court trained",
      "guild trained",
      "mentor trained",
      "family trained",
      "secretly trained",
      "forbidden training",
      "natural talent",
      "raw talent",
      "late bloomer",
      "fast learner",
      "slow but steady",
      "obsessively practised",
      "rusty",
      "out of practice",
      "retired expert",
      "former master",
      "burnt-out master",
      "injured master",
      "disgraced expert",
      "hidden expert",
      "underestimated expert",
      "unrecognised genius",
      "reluctant master",
      "dangerous amateur",
      "reckless prodigy",
      "controlled expert",
      "precise specialist",
      "creative improviser",
      "instinctive operator",
      "methodical professional",
      "high-pressure performer",
      "one of a kind",
    ],
  },
  {
    category: "Training Source",
    prefix: "skill_mastery_training_source",
    guidance:
      "Use this as training source texture. Formal education, apprenticeship, family, survival, field experience, and hard-won learning may shape how skill was formed.",
    values: [
      "self-taught",
      "school trained",
      "academy trained",
      "university trained",
      "guild trained",
      "apprenticeship trained",
      "mentor trained",
      "family trained",
      "military trained",
      "street trained",
      "survival trained",
      "court trained",
      "temple trained",
      "monastery trained",
      "underworld trained",
      "corporate trained",
      "laboratory trained",
      "field trained",
      "trial by fire",
      "learned the hard way",
    ],
  },
  {
    category: "Confidence",
    prefix: "skill_mastery_confidence",
    guidance:
      "Use this as skill-confidence texture. Pride, shame, masks, humility, control, and confidence may shape how the character carries competence.",
    values: [
      "confident in skill",
      "quietly confident",
      "overconfident",
      "underconfident",
      "impostor syndrome",
      "humble mastery",
      "showy mastery",
      "secret mastery",
      "defensive about skill",
      "ashamed of skill",
      "proud of skill",
      "casual excellence",
      "effortless skill",
      "strained skill",
      "skill used as mask",
      "skill used as identity",
      "skill used as survival",
      "skill used as service",
      "skill used as control",
      "skill used as love language",
    ],
  },
  {
    category: "Weakness",
    prefix: "skill_mastery_weakness",
    guidance:
      "Use this as mastery weakness texture. Mistakes, pressure, perfectionism, identity collapse, moral cost, and loneliness may surface when relevant.",
    values: [
      "novice mistakes",
      "overthinks basics",
      "panics under pressure",
      "needs supervision",
      "lacks field experience",
      "too theoretical",
      "too reckless",
      "too cautious",
      "overrelies on training",
      "improvises poorly",
      "burnout from mastery",
      "perfectionism",
      "cannot accept failure",
      "identity tied to skill",
      "fear of losing skill",
      "rust from disuse",
      "old injury limits skill",
      "skill has moral cost",
      "skill attracts danger",
      "mastery is lonely",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "skill_mastery_romance",
    guidance:
      "Use this as mastery romance texture. Teaching, admiration, failure, humility, and asking for help may become intimacy while preserving autonomy.",
    values: [
      "expert teaches {{user}}",
      "{{user}} teaches expert humility",
      "novice and master dynamic",
      "rivals with equal skill",
      "prodigy meets match",
      "retired expert drawn back in",
      "hidden master revealed",
      "skill reveal saves {{user}}",
      "training session intimacy",
      "mentor praise feels personal",
      "student surpasses teacher",
      "master loses composure",
      "burnt-out master heals",
      "skill as love language",
      "{{user}} admires their focus",
      "character trusts {{user}} with failure",
      "first time they ask for help",
      "first time they admit weakness",
      "mastery softens into partnership",
      "love beyond what they can do",
    ],
  },
  {
    category: "Gate",
    prefix: "skill_mastery_gate",
    guidance:
      "Use this as a skill mastery progression gate. Let reveals, training, failure, praise, burnout, humility, and partnership become optional pacing milestones.",
    values: [
      "first skill reveal gate",
      "first training gate",
      "first failure gate",
      "first success gate",
      "first under pressure gate",
      "first teaching gate",
      "first learning gate",
      "first rivalry gate",
      "first praise gate",
      "first asks for help gate",
      "first admits limits gate",
      "first hidden mastery reveal gate",
      "first burnout reveal gate",
      "first skill saves {{user}} gate",
      "first skill fails {{user}} gate",
      "skill identity crisis gate",
      "humility gate",
      "partnership gate",
      "mastery without loneliness gate",
      "love beyond skill route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "skill_mastery_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "You make that look easy.",
      "It was not easy. I just learned how to stop showing the effort.",
      "Teach me.",
      "Skill or survival?",
      "Both, if you trust me enough.",
      "You are better than you admit.",
      "And you see more than I prefer.",
      "I failed.",
      "No. You reached your limit.",
      "That sounds like failure.",
      "It sounds human.",
      "Everyone thinks I am untouchable.",
      "Are you?",
      "Not with you.",
      "You do not have to be useful to be wanted.",
      "That is a difficult thing to believe.",
      "Then let me prove it badly until you do.",
      "I was trained for this.",
      "Were you trained to survive being loved?",
      "No.",
      "Then we learn that part together.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "skill_mastery_high_value",
    guidance:
      "Use this as a high-signal skill mastery seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "novice",
      "apprentice",
      "trained",
      "skilled",
      "expert",
      "specialist",
      "master",
      "legendary",
      "self-taught",
      "battle-tested",
      "prodigy",
      "retired expert",
      "hidden expert",
      "burnt-out master",
      "impostor syndrome",
      "skill used as love language",
      "training session intimacy",
      "hidden master revealed",
      "mastery without loneliness gate",
      "love beyond skill route",
    ],
  },
] satisfies readonly SkillMasterySeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: SkillMasterySeedGroup,
  value: string,
): SkillMasteryPreset => ({
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

export const SKILL_MASTERY_PRESETS = SKILL_MASTERY_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const SKILL_MASTERY_PRESET_CATEGORIES = Array.from(
  new Set(SKILL_MASTERY_PRESETS.map((preset) => preset.category)),
).sort();

export const getSkillMasteryPresetsByCategory = (
  category: SkillMasteryPresetCategory,
) => SKILL_MASTERY_PRESETS.filter((preset) => preset.category === category);

export const findSkillMasteryPresetById = (id: string) =>
  SKILL_MASTERY_PRESETS.find((preset) => preset.id === id);

export const compileSkillMasteryPresetAdditions = (
  preset: SkillMasteryPreset,
): CompiledSkillMasteryPresetAdditions => ({
  backgroundAddition: `Skill mastery context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Skill mastery texture may include ${preset.value} without replacing the character's full personality, limits, contradictions, failures, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft skill mastery context.`,
    "Let training, competence, confidence, pressure, failure, teaching, and humility shape behaviour when relevant.",
    "Keep consent, boundaries, accountability, and {{user}} autonomy intact; skill should not erase vulnerability or emotional consequence.",
  ].join(" "),
});
