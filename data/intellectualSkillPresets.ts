export type IntellectualSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Academic Skill"
  | "Investigative Skill"
  | "Strategic Skill"
  | "Technical Skill"
  | "Creative Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface IntellectualSkillPreset {
  id: string;
  category: IntellectualSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledIntellectualSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface IntellectualSkillSeedGroup {
  category: IntellectualSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const INTELLECTUAL_SKILL_GUIDANCE =
  "Use this as intellectual texture. Analysis, scholarship, strategy, research, deduction, invention, or problem-solving may shape scenes without replacing emotional complexity, consent, or {{user}} agency.";

const INTELLECTUAL_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "intellectual_skill_archetype",
    guidance: INTELLECTUAL_SKILL_GUIDANCE,
    values: [
      "The Scholar",
      "The Strategist",
      "The Detective Mind",
      "The Researcher",
      "The Analyst",
      "The Philosopher",
      "The Inventor",
      "The Tactician",
      "The Archivist",
      "The Scientist",
      "The Codebreaker",
      "The Legal Mind",
      "The Political Thinker",
      "The Pattern Reader",
      "The Master Planner",
      "The Academic Rival",
      "The Genius With Blind Spots",
      "The Quiet Problem Solver",
      "The Overthinker",
      "The One Who Knows Too Much",
    ],
  },
  {
    category: "Core Skill",
    prefix: "intellectual_skill_core",
    guidance:
      "Use this as core intellectual skill texture. Logic, memory, focus, curiosity, learning speed, and systems thinking may shape problem-solving and vulnerability.",
    values: [
      "intelligence",
      "logic",
      "reasoning",
      "critical thinking",
      "analytical thinking",
      "abstract thinking",
      "systems thinking",
      "strategic thinking",
      "lateral thinking",
      "pattern recognition",
      "problem solving",
      "deduction",
      "induction",
      "inference",
      "hypothesis testing",
      "research",
      "analysis",
      "synthesis",
      "evaluation",
      "memory",
      "focus",
      "concentration",
      "attention to detail",
      "mental discipline",
      "intellectual curiosity",
      "learning speed",
      "knowledge retention",
      "conceptual understanding",
      "mental flexibility",
      "intellectual patience",
    ],
  },
  {
    category: "Academic Skill",
    prefix: "intellectual_skill_academic",
    guidance:
      "Use this as academic skill texture. Research, source work, theory, evidence, writing, and interdisciplinary thinking may shape competence and pressure.",
    values: [
      "scholarship",
      "academic research",
      "literature review",
      "essay writing",
      "thesis writing",
      "citation skill",
      "argument building",
      "source analysis",
      "textual analysis",
      "historical analysis",
      "scientific method",
      "mathematics",
      "statistics",
      "data interpretation",
      "philosophy",
      "ethics",
      "linguistics",
      "political theory",
      "economics",
      "psychology",
      "sociology",
      "anthropology",
      "law",
      "comparative studies",
      "interdisciplinary thinking",
    ],
  },
  {
    category: "Investigative Skill",
    prefix: "intellectual_skill_investigative",
    guidance:
      "Use this as investigative skill texture. Evidence, timelines, motive, verification, and contradiction may shape mystery scenes while keeping ethical limits and consequences visible.",
    values: [
      "investigation",
      "detective reasoning",
      "forensics",
      "evidence analysis",
      "clue tracking",
      "witness analysis",
      "interrogation strategy",
      "case building",
      "motive analysis",
      "timeline reconstruction",
      "behavioural analysis",
      "profiling",
      "surveillance analysis",
      "contradiction spotting",
      "lie detection",
      "cold case research",
      "mystery solving",
      "hidden pattern detection",
      "truth seeking",
      "information verification",
    ],
  },
  {
    category: "Strategic Skill",
    prefix: "intellectual_skill_strategic",
    guidance:
      "Use this as strategic skill texture. Planning, risk, resources, negotiation, and anticipating moves may shape decisions without turning the character into an infallible planner.",
    values: [
      "strategy",
      "tactics",
      "long-term planning",
      "contingency planning",
      "risk assessment",
      "resource allocation",
      "battle strategy",
      "political strategy",
      "business strategy",
      "social strategy",
      "game theory",
      "chess mind",
      "scenario planning",
      "crisis planning",
      "escape planning",
      "negotiation strategy",
      "war room thinking",
      "anticipating moves",
      "outmanoeuvring opponents",
      "winning without force",
    ],
  },
  {
    category: "Technical Skill",
    prefix: "intellectual_skill_technical",
    guidance:
      "Use this as technical intellectual texture. Engineering, programming, science, diagnostics, navigation, and experimental design may ground competence in concrete method.",
    values: [
      "engineering logic",
      "programming logic",
      "algorithm design",
      "data analysis",
      "systems design",
      "machine learning theory",
      "cybersecurity analysis",
      "robotics theory",
      "mechanical reasoning",
      "architectural planning",
      "chemical reasoning",
      "medical diagnosis",
      "xenobiology analysis",
      "terraforming calculation",
      "AI alignment reasoning",
      "signal analysis",
      "starship navigation maths",
      "life support modelling",
      "forensic technology",
      "experimental design",
    ],
  },
  {
    category: "Creative Skill",
    prefix: "intellectual_skill_creative",
    guidance:
      "Use this as creative intellectual texture. Theory, structure, metaphor, design, invention, and cross-domain thinking may shape artistry with analytical depth.",
    values: [
      "worldbuilding logic",
      "plot structure analysis",
      "symbolic thinking",
      "metaphor creation",
      "design thinking",
      "creative problem solving",
      "art theory",
      "music theory",
      "narrative analysis",
      "character analysis",
      "aesthetic judgement",
      "conceptual art thinking",
      "innovation",
      "invention",
      "improvisational reasoning",
      "ideation",
      "cross-domain thinking",
      "pattern recombination",
      "visionary thinking",
      "original theory creation",
    ],
  },
  {
    category: "Weakness",
    prefix: "intellectual_skill_weakness",
    guidance:
      "Use this as intellectual vulnerability texture. Overthinking, arrogance, detachment, fear, and blind spots may surface when relevant without flattening the character into a flaw.",
    values: [
      "overthinking",
      "analysis paralysis",
      "intellectual arrogance",
      "emotional blind spot",
      "poor common sense",
      "social blind spot",
      "perfectionism",
      "indecision",
      "obsessive research",
      "detached reasoning",
      "uses logic to avoid feelings",
      "dismisses intuition",
      "misses obvious emotional truths",
      "needs proof before trust",
      "difficulty admitting wrong",
      "fear of not being smart enough",
      "impostor syndrome",
      "knowledge as control",
      "curiosity gets dangerous",
      "mind never rests",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "intellectual_skill_romance",
    guidance:
      "Use this as intellectual romance texture. Debate, research, mystery, clever trust, and logic failing around love may add tension while preserving emotional agency.",
    values: [
      "academic rivals to lovers",
      "study partners slow burn",
      "late-night research romance",
      "solving mystery together",
      "strategist falls for wildcard",
      "genius needs emotional translation",
      "detective protects key witness",
      "scholar deciphers love letter",
      "inventor builds gift",
      "scientist cannot explain feelings",
      "overthinker gets reassured",
      "philosophy debate turns intimate",
      "library confession",
      "shared discovery bonds them",
      "rival theory becomes partnership",
      "logic fails against love",
      "mind meets match",
      "clever banter romance",
      "intellectual trust before touch",
      "love as unsolved problem",
    ],
  },
  {
    category: "Gate",
    prefix: "intellectual_skill_gate",
    guidance:
      "Use this as intellectual progression texture. Respect, debate, discovery, emotional blind spots, and wisdom over knowledge may mark relationship development.",
    values: [
      "first problem-solving gate",
      "first debate gate",
      "first research scene gate",
      "first theory shared gate",
      "first strategy scene gate",
      "first mystery clue gate",
      "first intellectual respect gate",
      "first admits wrong gate",
      "first emotional blind spot gate",
      "first overthinking comfort gate",
      "first late-night study gate",
      "first shared discovery gate",
      "first trusts {{user}} judgement gate",
      "first logic fails gate",
      "first vulnerability over intellect gate",
      "rival to partner gate",
      "mind and heart balance gate",
      "wisdom over knowledge gate",
      "love as answer gate",
      "shared future plan route",
    ],
  },
  {
    category: "Mastery",
    prefix: "intellectual_skill_mastery",
    guidance:
      "Use this as intellectual mastery texture. Education, self-teaching, expertise, genius, reputation, and loneliness may calibrate confidence and stakes.",
    values: [
      "intellectual novice",
      "quick learner",
      "well-read",
      "educated",
      "self-taught",
      "academically trained",
      "field experienced",
      "specialist",
      "expert",
      "polymath",
      "prodigy",
      "genius",
      "master strategist",
      "master detective",
      "renowned scholar",
      "legendary inventor",
      "court intellectual",
      "scientific authority",
      "dangerous mind",
      "brilliant but lonely",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "intellectual_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "I have a theory.",
      "You always have a theory.",
      "This one involves you.",
      "You are overthinking again.",
      "I am thinking the appropriate amount.",
      "You reorganised the entire problem by colour.",
      "It helped.",
      "Logic says this is a bad idea.",
      "And you?",
      "I am beginning to resent how little logic helps around you.",
      "You remembered that detail?",
      "I remember patterns.",
      "Is that all I am?",
      "No. You are the exception I keep studying.",
      "I do not like not knowing.",
      "Then ask me.",
      "That requires trusting the answer.",
      "Yes.",
      "You make my mind quiet.",
      "Is that good?",
      "Terrifying. Stay.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "intellectual_skill_high_value",
    guidance:
      "Use this as a high-signal intellectual seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "critical thinking",
      "research",
      "deduction",
      "pattern recognition",
      "strategy",
      "analysis",
      "memory",
      "problem solving",
      "academic research",
      "forensics",
      "case building",
      "long-term planning",
      "risk assessment",
      "data analysis",
      "medical diagnosis",
      "creative problem solving",
      "overthinking",
      "intellectual respect",
      "logic fails against love",
      "mind and heart balance gate",
    ],
  },
] satisfies readonly IntellectualSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: IntellectualSkillSeedGroup,
  value: string,
): IntellectualSkillPreset => ({
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

export const INTELLECTUAL_SKILL_PRESETS = INTELLECTUAL_SKILL_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makePreset(group, value)),
);

export const INTELLECTUAL_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(INTELLECTUAL_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getIntellectualSkillPresetsByCategory = (
  category: IntellectualSkillPresetCategory,
) => INTELLECTUAL_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findIntellectualSkillPresetById = (id: string) =>
  INTELLECTUAL_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileIntellectualSkillPresetAdditions = (
  preset: IntellectualSkillPreset,
): CompiledIntellectualSkillPresetAdditions => ({
  backgroundAddition: `Intellectual skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Intellectual texture may include ${preset.value} without replacing emotional complexity, contradiction, mistakes, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft intellectual context.`,
    "Let intelligence, research, deduction, strategy, or creative reasoning shape behaviour when relevant.",
    "Keep uncertainty, consent, boundaries, and {{user}} autonomy intact; brilliance should not erase vulnerability or consequence.",
  ].join(" "),
});
