export type JobFamilyPresetCategory =
  | "Archetype"
  | "Job Family"
  | "Modern Job"
  | "Historical Job"
  | "Fantasy Job"
  | "Sci-Fi Job"
  | "Romance Hook"
  | "Conflict"
  | "Gate"
  | "High-Value Seed";

export interface JobFamilyPreset {
  id: string;
  category: JobFamilyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledJobFamilyPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface JobFamilySeedGroup {
  category: JobFamilyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const JOB_FAMILY_GUIDANCE =
  "Use this as job family texture. Work, duty, skill, status, risk, vocation, and career pressure may shape scenes without replacing personality, consent, or {{user}} agency.";

const JOB_FAMILY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "job_family_archetype",
    guidance: JOB_FAMILY_GUIDANCE,
    values: [
      "Healthcare and Healing",
      "Education and Research",
      "Law and Justice",
      "Security and Protection",
      "Military and Defence",
      "Arts and Entertainment",
      "Food and Hospitality",
      "Business and Finance",
      "Technology and Engineering",
      "Science and Innovation",
      "Government and Politics",
      "Royalty and Court",
      "Religion and Spiritual Service",
      "Trades and Craft",
      "Agriculture and Nature",
      "Transportation and Travel",
      "Media and Communication",
      "Criminal Underworld",
      "Fantasy and Magic Professions",
      "Sci-Fi and Space Professions",
    ],
  },
  {
    category: "Job Family",
    prefix: "job_family_seed",
    guidance:
      "Use this as broad occupational family texture. Professional world, skill set, work culture, and status pressure may ground the character.",
    values: [
      "healthcare",
      "medicine",
      "healing",
      "mental health",
      "emergency services",
      "caregiving",
      "education",
      "academia",
      "research",
      "scholarship",
      "library archives",
      "training and mentorship",
      "law",
      "justice",
      "legal services",
      "law enforcement",
      "investigation",
      "public safety",
      "security",
      "protection",
      "bodyguard work",
      "private security",
      "royal guard",
      "threat response",
      "military",
      "defence",
      "soldiering",
      "mercenary work",
      "strategy and command",
      "veteran professions",
      "arts",
      "entertainment",
      "performance",
      "visual arts",
      "writing",
      "music",
      "fashion",
      "design",
      "food service",
      "hospitality",
      "restaurants",
      "baking",
      "bartending",
      "innkeeping",
      "hotel work",
      "business",
      "finance",
      "corporate",
      "entrepreneurship",
      "management",
      "sales",
      "marketing",
      "consulting",
      "technology",
      "engineering",
      "software",
      "hardware",
      "cybersecurity",
      "robotics",
      "mechanics",
      "science",
      "laboratory work",
      "field research",
      "biotech",
      "space science",
      "experimental research",
      "government",
      "politics",
      "diplomacy",
      "public administration",
      "civil service",
      "policy work",
      "royalty",
      "court service",
      "nobility",
      "royal administration",
      "court intrigue",
      "aristocratic duty",
      "religion",
      "spiritual service",
      "temple work",
      "clergy",
      "monastic life",
      "ritual service",
      "trades",
      "craft",
      "manual labour",
      "construction",
      "repair",
      "artisan work",
      "manufacturing",
      "agriculture",
      "ranching",
      "fishing",
      "forestry",
      "gardening",
      "animal care",
      "land work",
      "transportation",
      "travel",
      "shipping",
      "aviation",
      "sailing",
      "driving",
      "piloting",
      "media",
      "journalism",
      "publishing",
      "broadcasting",
      "public relations",
      "content creation",
      "criminal underworld",
      "organised crime",
      "smuggling",
      "theft",
      "assassination",
      "black market",
      "information brokering",
      "magic professions",
      "magecraft",
      "witchcraft",
      "healing magic",
      "monster hunting",
      "alchemy",
      "divination",
      "space professions",
      "starship crew",
      "space colony work",
      "terraforming",
      "xenobiology",
      "android care",
      "AI systems",
    ],
  },
  {
    category: "Modern Job",
    prefix: "job_family_modern",
    guidance:
      "Use this as modern job texture. Contemporary workplaces, public roles, service work, professions, and career pressure may shape daily life.",
    values: [
      "healthcare worker",
      "teacher",
      "professor",
      "lawyer",
      "detective",
      "police officer",
      "firefighter",
      "paramedic",
      "soldier",
      "bodyguard",
      "artist",
      "actor",
      "musician",
      "writer",
      "chef",
      "bartender",
      "barista",
      "CEO",
      "manager",
      "consultant",
      "software engineer",
      "mechanic",
      "scientist",
      "journalist",
      "politician",
    ],
  },
  {
    category: "Historical Job",
    prefix: "job_family_historical",
    guidance:
      "Use this as historical job texture. Courts, households, trades, clergy, scholarship, service, and social rank may shape obligation and romance pressure.",
    values: [
      "royal court",
      "noble household",
      "clergy",
      "scribe",
      "scholar",
      "knight",
      "guard",
      "soldier",
      "merchant",
      "artisan",
      "blacksmith",
      "tailor",
      "apothecary",
      "healer",
      "farmer",
      "fisher",
      "sailor",
      "innkeeper",
      "servant",
      "governess",
    ],
  },
  {
    category: "Fantasy Job",
    prefix: "job_family_fantasy",
    guidance:
      "Use this as fantasy job texture. Magical labour, healing, prophecy, monsters, courts, and ritual vocation may add wonder, duty, and cost.",
    values: [
      "mage",
      "witch",
      "warlock",
      "sorcerer",
      "healer",
      "oracle",
      "seer",
      "summoner",
      "alchemist",
      "enchanter",
      "rune crafter",
      "curse breaker",
      "monster hunter",
      "dragon tamer",
      "familiar keeper",
      "temple healer",
      "battle mage",
      "court mage",
      "necromancer",
      "spirit speaker",
    ],
  },
  {
    category: "Sci-Fi Job",
    prefix: "job_family_sci_fi",
    guidance:
      "Use this as sci-fi job texture. Starships, colonies, AI, robotics, xenoscience, survival systems, and space work may shape stakes.",
    values: [
      "starship captain",
      "pilot",
      "navigator",
      "engineer",
      "systems operator",
      "life support specialist",
      "android technician",
      "robotics expert",
      "AI specialist",
      "cyberneticist",
      "xenobiologist",
      "xenolinguist",
      "space medic",
      "terraformer",
      "colony manager",
      "drone operator",
      "signal analyst",
      "security officer",
      "smuggler",
      "salvage operator",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "job_family_romance",
    guidance:
      "Use this as job-family romance texture. Work proximity, professional masks, caretaking, rescue, rivalry, and shared future may add tension while preserving boundaries.",
    values: [
      "workplace romance",
      "professional rivals",
      "mentor protege tension",
      "bodyguard assignment",
      "doctor caretaker romance",
      "detective protects witness",
      "artist muse romance",
      "chef cooks as love language",
      "CEO drops professional mask",
      "engineer saves {{user}}",
      "soldier returns home",
      "knight protects royal",
      "priest forbidden love",
      "criminal boss soft for {{user}}",
      "mage bonded by spell",
      "pilot saves crew",
      "android learns affection",
      "healer and warrior",
      "journalist uncovers secret",
      "shared career becomes shared future",
    ],
  },
  {
    category: "Conflict",
    prefix: "job_family_conflict",
    guidance:
      "Use this as job-family conflict texture. Career, duty, policy, secrecy, danger, burnout, and work identity may create pressure without scripting outcomes.",
    values: [
      "career against love",
      "duty against desire",
      "professional boundaries",
      "power imbalance",
      "workplace policy",
      "public reputation risk",
      "dangerous work",
      "secret identity at work",
      "family business pressure",
      "legacy burden",
      "workaholism",
      "burnout",
      "class gap through job",
      "status gap through job",
      "ethical dilemma",
      "conflict of interest",
      "mission against relationship",
      "job requires secrecy",
      "love as liability",
      "choosing life beyond work",
    ],
  },
  {
    category: "Gate",
    prefix: "job_family_gate",
    guidance:
      "Use this as a job-family progression gate. Let work scenes, masks, career conflict, duty, burnout, admiration, failure, and shared future become optional milestones.",
    values: [
      "first work scene gate",
      "first skill reveal gate",
      "first professional mask gate",
      "first career conflict gate",
      "first duty against desire gate",
      "first workplace risk gate",
      "first caretaking at work gate",
      "first rescue through job gate",
      "first job secret reveal gate",
      "first burnout reveal gate",
      "first {{user}} admires work gate",
      "first work failure gate",
      "first love over career gate",
      "first equal partners gate",
      "shared future beyond work route",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "job_family_high_value",
    guidance:
      "Use this as a high-signal job family seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "healthcare",
      "education",
      "law enforcement",
      "security",
      "military",
      "arts",
      "food service",
      "business",
      "technology",
      "science",
      "royalty",
      "religion",
      "criminal underworld",
      "magic professions",
      "space professions",
      "bodyguard work",
      "doctor caretaker romance",
      "professional rivals",
      "career against love",
      "shared future beyond work route",
    ],
  },
] satisfies readonly JobFamilySeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: JobFamilySeedGroup, value: string): JobFamilyPreset => ({
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

export const JOB_FAMILY_PRESETS = JOB_FAMILY_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const JOB_FAMILY_PRESET_CATEGORIES = Array.from(
  new Set(JOB_FAMILY_PRESETS.map((preset) => preset.category)),
).sort();

export const getJobFamilyPresetsByCategory = (category: JobFamilyPresetCategory) =>
  JOB_FAMILY_PRESETS.filter((preset) => preset.category === category);

export const findJobFamilyPresetById = (id: string) =>
  JOB_FAMILY_PRESETS.find((preset) => preset.id === id);

export const compileJobFamilyPresetAdditions = (
  preset: JobFamilyPreset,
): CompiledJobFamilyPresetAdditions => ({
  backgroundAddition: `Job family context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Job family texture may include ${preset.value} without replacing the character's full personality, flaws, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft job family context.`,
    "Let work, skill, vocation, duty, status, risk, burnout, professional masks, and shared future pressure shape behaviour when relevant.",
    "Keep consent, boundaries, workplace ethics, consequence, and {{user}} autonomy intact; the job should not become the whole character.",
  ].join(" "),
});
