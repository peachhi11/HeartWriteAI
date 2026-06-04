export type AcademicDisciplinePresetCategory =
  | "Archetype"
  | "Discipline"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface AcademicDisciplinePreset {
  id: string;
  category: AcademicDisciplinePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAcademicDisciplinePresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AcademicDisciplineSeedGroup {
  category: AcademicDisciplinePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ACADEMIC_DISCIPLINE_GUIDANCE =
  "Use this as academic discipline texture. Study, research, theory, critique, achievement pressure, curiosity, and intellectual intimacy may shape scenes without replacing personality, consent, or {{user}} agency.";

const ACADEMIC_DISCIPLINE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "academic_discipline_archetype",
    guidance: ACADEMIC_DISCIPLINE_GUIDANCE,
    values: [
      "The Humanities Scholar",
      "The Social Scientist",
      "The Natural Scientist",
      "The Engineer",
      "The Medical Scholar",
      "The Law Student",
      "The Business Student",
      "The Artist Academic",
      "The Philosopher",
      "The Historian",
      "The Psychologist",
      "The Linguist",
      "The Mathematician",
      "The Computer Scientist",
      "The Biologist",
      "The Physicist",
      "The Political Theorist",
      "The Archaeologist",
      "The Theology Scholar",
      "The Interdisciplinary Researcher",
    ],
  },
  {
    category: "Discipline",
    prefix: "academic_discipline_seed",
    guidance:
      "Use this as discipline texture. Subject matter, methods, academic pressure, curiosity, and intellectual habits may shape how the character thinks and connects.",
    values: [
      "humanities",
      "literature",
      "English literature",
      "comparative literature",
      "creative writing",
      "poetry",
      "classics",
      "philosophy",
      "ethics",
      "logic",
      "history",
      "ancient history",
      "medieval history",
      "modern history",
      "art history",
      "musicology",
      "religious studies",
      "theology",
      "cultural studies",
      "gender studies",
      "social sciences",
      "psychology",
      "sociology",
      "anthropology",
      "archaeology",
      "political science",
      "international relations",
      "economics",
      "criminology",
      "human geography",
      "urban studies",
      "education",
      "social work",
      "media studies",
      "communication studies",
      "linguistics",
      "public policy",
      "development studies",
      "peace and conflict studies",
      "area studies",
      "natural sciences",
      "biology",
      "chemistry",
      "physics",
      "astronomy",
      "geology",
      "earth science",
      "environmental science",
      "ecology",
      "marine science",
      "neuroscience",
      "genetics",
      "microbiology",
      "botany",
      "zoology",
      "palaeontology",
      "climate science",
      "materials science",
      "forensic science",
      "cognitive science",
      "formal sciences",
      "mathematics",
      "statistics",
      "computer science",
      "data science",
      "artificial intelligence",
      "machine learning",
      "information science",
      "systems science",
      "operations research",
      "game theory",
      "cryptography",
      "theoretical computer science",
      "engineering",
      "mechanical engineering",
      "electrical engineering",
      "civil engineering",
      "chemical engineering",
      "biomedical engineering",
      "aerospace engineering",
      "software engineering",
      "robotics",
      "environmental engineering",
      "industrial engineering",
      "materials engineering",
      "nuclear engineering",
      "systems engineering",
      "health sciences",
      "medicine",
      "nursing",
      "public health",
      "pharmacy",
      "dentistry",
      "veterinary medicine",
      "physical therapy",
      "occupational therapy",
      "nutrition",
      "epidemiology",
      "psychiatry",
      "clinical psychology",
      "biomedical science",
      "professional studies",
      "law",
      "business",
      "management",
      "finance",
      "accounting",
      "marketing",
      "entrepreneurship",
      "hospitality management",
      "library science",
      "architecture",
      "urban planning",
      "journalism",
      "public administration",
      "arts",
      "fine art",
      "painting",
      "sculpture",
      "photography",
      "film studies",
      "theatre studies",
      "dance",
      "music",
      "design",
      "fashion design",
      "graphic design",
      "game design",
      "creative media",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "academic_discipline_romance",
    guidance:
      "Use this as academic romance texture. Rivalry, study sessions, research, debate, fieldwork, conferences, and intellectual respect may add slow-burn tension.",
    values: [
      "academic rivals to lovers",
      "study partners slow burn",
      "library confession",
      "late night research romance",
      "lab partners to lovers",
      "thesis deadline tension",
      "professor colleague romance",
      "conference romance",
      "archaeology fieldwork romance",
      "debate turns intimate",
      "shared discovery bonds them",
      "research assistant crush",
      "campus secret relationship",
      "office hours tension",
      "brilliant rival respects {{user}}",
      "overthinker gets reassured",
      "theory becomes confession",
      "footnotes hide feelings",
      "mind meets match",
      "love as unsolved problem",
    ],
  },
  {
    category: "Gate",
    prefix: "academic_discipline_gate",
    guidance:
      "Use this as an academic progression gate. Let study, debate, research, labs, fieldwork, conferences, respect, and achievement pressure become optional milestones.",
    values: [
      "first class gate",
      "first study session gate",
      "first debate gate",
      "first research scene gate",
      "first library gate",
      "first lab gate",
      "first fieldwork gate",
      "first conference gate",
      "first thesis pressure gate",
      "first intellectual respect gate",
      "first shared discovery gate",
      "first academic rivalry gate",
      "first late night study gate",
      "first office hours gate",
      "first vulnerability over intellect gate",
      "rival to partner gate",
      "mind and heart balance gate",
      "love beyond achievement gate",
      "shared future research gate",
      "earned degree earned love route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "academic_discipline_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "You annotated my argument.",
      "You left weaknesses in the margins.",
      "I left invitations.",
      "You make debate sound like flirting.",
      "Only when I am winning.",
      "You are not winning.",
      "Then why are you smiling?",
      "I have a theory.",
      "You always have a theory.",
      "This one involves you.",
      "You remembered my research topic?",
      "I remember most things when they are yours.",
      "Logic says this is a distraction.",
      "And you?",
      "I am beginning to resent how little logic helps around you.",
      "You are not your grades.",
      "That is easy to say.",
      "Good. Then let me keep saying it until you believe me.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "academic_discipline_high_value",
    guidance:
      "Use this as a high-signal academic discipline seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "psychology",
      "literature",
      "history",
      "philosophy",
      "law",
      "medicine",
      "biology",
      "chemistry",
      "physics",
      "computer science",
      "engineering",
      "art history",
      "political science",
      "criminology",
      "archaeology",
      "linguistics",
      "creative writing",
      "academic rivals to lovers",
      "study partners slow burn",
      "library confession",
    ],
  },
] satisfies readonly AcademicDisciplineSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: AcademicDisciplineSeedGroup,
  value: string,
): AcademicDisciplinePreset => ({
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

export const ACADEMIC_DISCIPLINE_PRESETS = ACADEMIC_DISCIPLINE_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makePreset(group, value)),
);

export const ACADEMIC_DISCIPLINE_PRESET_CATEGORIES = Array.from(
  new Set(ACADEMIC_DISCIPLINE_PRESETS.map((preset) => preset.category)),
).sort();

export const getAcademicDisciplinePresetsByCategory = (
  category: AcademicDisciplinePresetCategory,
) => ACADEMIC_DISCIPLINE_PRESETS.filter((preset) => preset.category === category);

export const findAcademicDisciplinePresetById = (id: string) =>
  ACADEMIC_DISCIPLINE_PRESETS.find((preset) => preset.id === id);

export const compileAcademicDisciplinePresetAdditions = (
  preset: AcademicDisciplinePreset,
): CompiledAcademicDisciplinePresetAdditions => ({
  backgroundAddition: `Academic discipline context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Academic discipline texture may include ${preset.value} without replacing the character's full personality, flaws, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft academic discipline context.`,
    "Let study, research, intellectual pressure, critique, curiosity, achievement, debate, and shared discovery shape behaviour when relevant.",
    "Keep consent, boundaries, academic ethics, humility, and {{user}} autonomy intact; intellect should not erase vulnerability or emotional consequence.",
  ].join(" "),
});
