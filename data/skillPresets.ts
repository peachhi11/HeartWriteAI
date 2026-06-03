export type SkillPresetCategory =
  | "Archetype"
  | "Social Skill"
  | "Communication Skill"
  | "Intellectual Skill"
  | "Creative Skill"
  | "Combat Skill"
  | "Survival Skill"
  | "Medical Skill"
  | "Technical Skill"
  | "Business Skill"
  | "Underworld Skill"
  | "Fantasy Skill"
  | "Sci-Fi Skill"
  | "Domestic Skill"
  | "Romance Skill"
  | "Mastery"
  | "High-Value Skill Tag";

export interface SkillPreset {
  id: string;
  category: SkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SkillSeedGroup {
  category: SkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SKILL_GUIDANCE =
  "Use this as skill texture. Competence, training, expertise, habits, confidence, gaps, or pressure may shape the character, but skills should remain soft context rather than replacing personality, consent, or {{user}} agency.";

const SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "skill_archetype",
    guidance: SKILL_GUIDANCE,
    values: [
      "The Protector",
      "The Caretaker",
      "The Scholar",
      "The Strategist",
      "The Charmer",
      "The Survivor",
      "The Warrior",
      "The Leader",
      "The Rebel",
      "The Artist",
      "The Healer",
      "The Detective",
      "The Diplomat",
      "The Inventor",
      "The Mage",
      "The Hunter",
      "The Performer",
      "The Merchant",
      "The Criminal Mastermind",
      "The Jack of All Trades",
    ],
  },
  {
    category: "Social Skill",
    prefix: "skill_social",
    guidance:
      "Use this as social skill texture. Charm, persuasion, etiquette, empathy, leadership, deception, seduction, or manipulation may shape social scenes, but consent, boundaries, and consequence should stay visible.",
    values: [
      "charisma",
      "persuasion",
      "negotiation",
      "diplomacy",
      "leadership",
      "public speaking",
      "storytelling",
      "networking",
      "relationship building",
      "active listening",
      "conflict resolution",
      "mediation",
      "emotional intelligence",
      "empathy",
      "people reading",
      "deception",
      "bluffing",
      "seduction",
      "flirting",
      "charm",
      "hospitality",
      "mentorship",
      "teaching",
      "interviewing",
      "salesmanship",
      "recruitment",
      "community organising",
      "social manipulation",
      "court etiquette",
      "matchmaking",
    ],
  },
  {
    category: "Communication Skill",
    prefix: "skill_communication",
    guidance:
      "Use this as communication skill texture. Writing, speaking, translation, debate, interrogation, public relations, or crisis communication may shape voice and scene strategy.",
    values: [
      "writing",
      "creative writing",
      "journalism",
      "editing",
      "poetry",
      "speechmaking",
      "debate",
      "translation",
      "multilingualism",
      "sign language",
      "negotiation language",
      "persuasive writing",
      "technical writing",
      "letter writing",
      "love letter writing",
      "oratory",
      "interrogation",
      "interviewing",
      "public relations",
      "crisis communication",
    ],
  },
  {
    category: "Intellectual Skill",
    prefix: "skill_intellectual",
    guidance:
      "Use this as intellectual skill texture. Analysis, research, deduction, law, science, strategy, or systems thinking may shape problem solving without making the character omniscient.",
    values: [
      "research",
      "analysis",
      "critical thinking",
      "logic",
      "problem solving",
      "strategy",
      "planning",
      "memory",
      "mathematics",
      "science",
      "engineering",
      "history",
      "linguistics",
      "psychology",
      "philosophy",
      "economics",
      "law",
      "political science",
      "pattern recognition",
      "systems thinking",
      "deduction",
      "investigation",
      "forensics",
      "codebreaking",
      "data analysis",
    ],
  },
  {
    category: "Creative Skill",
    prefix: "skill_creative",
    guidance:
      "Use this as creative skill texture. Artistic talent may shape aesthetics, dialogue, work rhythm, romance gestures, and identity without making every scene performance-focused.",
    values: [
      "painting",
      "drawing",
      "illustration",
      "sculpting",
      "music",
      "singing",
      "songwriting",
      "dance",
      "acting",
      "improv",
      "fashion design",
      "photography",
      "filmmaking",
      "graphic design",
      "architecture",
      "crafting",
      "woodworking",
      "storytelling",
      "worldbuilding",
      "creative problem solving",
      "culinary art",
      "floral design",
      "tattoo art",
      "calligraphy",
      "jewellery making",
    ],
  },
  {
    category: "Combat Skill",
    prefix: "skill_combat",
    guidance:
      "Use this as combat skill texture. Fighting ability may shape confidence, threat assessment, restraint, and protection, but violence should remain consequence-aware.",
    values: [
      "swordsmanship",
      "fencing",
      "archery",
      "marksmanship",
      "firearms",
      "martial arts",
      "boxing",
      "wrestling",
      "self defence",
      "knife fighting",
      "dual wielding",
      "shield use",
      "battle strategy",
      "military tactics",
      "survival combat",
      "sniping",
      "assassination",
      "duelling",
      "mounted combat",
      "urban combat",
      "defensive combat",
      "protective combat",
      "non-lethal combat",
      "bodyguarding",
      "threat assessment",
    ],
  },
  {
    category: "Survival Skill",
    prefix: "skill_survival",
    guidance:
      "Use this as survival skill texture. Resourcefulness, fieldcraft, emergency response, and harsh-environment competence may shape practical choices and pressure scenes.",
    values: [
      "wilderness survival",
      "tracking",
      "hunting",
      "fishing",
      "foraging",
      "campcraft",
      "navigation",
      "orienteering",
      "shelter building",
      "firemaking",
      "first aid",
      "emergency medicine",
      "disaster preparedness",
      "urban survival",
      "desert survival",
      "arctic survival",
      "jungle survival",
      "mountain survival",
      "escape and evasion",
      "resourcefulness",
    ],
  },
  {
    category: "Medical Skill",
    prefix: "skill_medical",
    guidance:
      "Use this as medical skill texture. Care, diagnosis, emergency response, therapy, healing, and bedside manner may shape competence while preserving boundaries and patient autonomy.",
    values: [
      "first aid",
      "trauma care",
      "surgery",
      "diagnosis",
      "nursing",
      "pharmacology",
      "therapy",
      "counselling",
      "rehabilitation",
      "emergency response",
      "combat medicine",
      "herbal medicine",
      "holistic healing",
      "physical therapy",
      "mental health support",
      "bedside manner",
      "patient advocacy",
      "crisis intervention",
      "toxicology",
      "medical research",
    ],
  },
  {
    category: "Technical Skill",
    prefix: "skill_technical",
    guidance:
      "Use this as technical skill texture. Engineering, programming, AI, systems, repair, automation, or troubleshooting may shape competence and problem-solving scenes.",
    values: [
      "programming",
      "software engineering",
      "cybersecurity",
      "hacking",
      "networking",
      "robotics",
      "electronics",
      "mechanics",
      "engineering",
      "machine learning",
      "AI development",
      "data science",
      "database design",
      "systems administration",
      "web development",
      "game development",
      "hardware repair",
      "automation",
      "drone operation",
      "technical troubleshooting",
    ],
  },
  {
    category: "Business Skill",
    prefix: "skill_business",
    guidance:
      "Use this as business skill texture. Management, finance, branding, risk, operations, or executive decision-making may shape status, stakes, and work pressure.",
    values: [
      "management",
      "leadership",
      "entrepreneurship",
      "finance",
      "accounting",
      "investing",
      "budgeting",
      "marketing",
      "branding",
      "sales",
      "negotiation",
      "operations",
      "project management",
      "team building",
      "strategic planning",
      "business development",
      "risk management",
      "supply chain management",
      "customer relations",
      "executive decision-making",
    ],
  },
  {
    category: "Underworld Skill",
    prefix: "skill_underworld",
    guidance:
      "Use this as underworld skill texture. Criminal competence, stealth, forgery, surveillance, blackmail, or heist planning may shape danger and moral pressure without glamorising harm as consequence-free.",
    values: [
      "pickpocketing",
      "lockpicking",
      "safecracking",
      "forgery",
      "smuggling",
      "counterfeiting",
      "stealth",
      "burglary",
      "surveillance",
      "counter-surveillance",
      "money laundering",
      "blackmail",
      "information brokering",
      "deception",
      "identity forging",
      "escape planning",
      "criminal networking",
      "heist planning",
      "underworld negotiation",
      "evidence disposal",
    ],
  },
  {
    category: "Fantasy Skill",
    prefix: "skill_fantasy",
    guidance:
      "Use this as fantasy skill texture. Magic, ritual, alchemy, monsters, artefacts, wards, and supernatural knowledge may shape capability without overriding free will or consent.",
    values: [
      "spellcasting",
      "ritual magic",
      "elemental magic",
      "healing magic",
      "necromancy",
      "enchantment",
      "illusion magic",
      "summoning",
      "divination",
      "curse breaking",
      "alchemy",
      "rune crafting",
      "potion making",
      "spirit communication",
      "dragon taming",
      "monster hunting",
      "artefact identification",
      "ward creation",
      "teleportation",
      "magical research",
    ],
  },
  {
    category: "Sci-Fi Skill",
    prefix: "skill_sci_fi",
    guidance:
      "Use this as sci-fi skill texture. Piloting, starship systems, cybernetics, xenology, colony work, and AI interfaces may shape competence and crisis scenes.",
    values: [
      "piloting",
      "starship navigation",
      "astrogation",
      "terraforming",
      "robotics",
      "cybernetics",
      "xenobiology",
      "xenolinguistics",
      "spacewalk operations",
      "life support maintenance",
      "AI interface use",
      "drone control",
      "colony management",
      "quantum computing",
      "warp engine maintenance",
      "alien diplomacy",
      "space survival",
      "signal analysis",
      "holographic design",
      "interstellar trade",
    ],
  },
  {
    category: "Domestic Skill",
    prefix: "skill_domestic",
    guidance:
      "Use this as domestic skill texture. Home-making, caretaking, hosting, repair, budgeting, and comfort may shape intimacy and daily-life scenes without reducing the character to service.",
    values: [
      "cooking",
      "baking",
      "meal planning",
      "cleaning",
      "organisation",
      "home repair",
      "gardening",
      "childcare",
      "eldercare",
      "pet care",
      "hosting",
      "budget management",
      "laundry",
      "decorating",
      "emotional support",
      "caretaking",
      "household management",
      "conflict de-escalation",
      "comforting others",
      "creating safe spaces",
    ],
  },
  {
    category: "Romance Skill",
    prefix: "skill_romance",
    guidance:
      "Use this as romance-relevant skill texture. Emotional attunement, repair, affection, reassurance, trust, and vulnerability may shape relationship behaviour while preserving boundaries and mutual choice.",
    values: [
      "active listening",
      "emotional attunement",
      "reassurance",
      "caretaking",
      "comforting",
      "conflict repair",
      "apologising",
      "boundary respect",
      "affection expression",
      "gift giving",
      "love letter writing",
      "romantic planning",
      "protectiveness",
      "trust building",
      "vulnerability",
      "communication",
      "patience",
      "devotion",
      "emotional safety",
      "relationship maintenance",
    ],
  },
  {
    category: "Mastery",
    prefix: "skill_mastery",
    guidance:
      "Use this as mastery-level texture. Skill level may shape confidence, mistakes, reputation, humility, or pressure without making success automatic.",
    values: [
      "novice",
      "beginner",
      "apprentice",
      "trained",
      "competent",
      "skilled",
      "advanced",
      "expert",
      "specialist",
      "master",
      "grandmaster",
      "legendary",
      "self taught",
      "naturally gifted",
      "professionally trained",
      "battle tested",
      "academically trained",
      "field experienced",
      "retired expert",
      "prodigy",
    ],
  },
  {
    category: "High-Value Skill Tag",
    prefix: "skill_high_value",
    guidance:
      "Use this as a high-signal skill tag for quick character creation, matching, filtering, or prompt preset assembly.",
    values: [
      "leadership",
      "charisma",
      "strategy",
      "active listening",
      "emotional intelligence",
      "combat skill",
      "first aid",
      "caretaking",
      "investigation",
      "negotiation",
      "teaching",
      "cooking",
      "spellcasting",
      "piloting",
      "engineering",
      "hacking",
      "stealth",
      "survival",
      "relationship maintenance",
      "trust building",
    ],
  },
] satisfies readonly SkillSeedGroup[]);

export const SKILL_PRESETS = Object.freeze(
  SKILL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => ({
      id: `${group.prefix}_${toPresetId(value)}`,
      category: group.category,
      label: toLabel(value),
      value,
      triggerKeys: buildTriggerKeys(value),
      guidance: group.guidance,
      systemPromptTags: [value, group.category.toLowerCase(), "skill preset"],
    })),
  ),
);

export const SKILL_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SKILL_PRESETS.map((preset) => preset.category))).sort(),
);

export function getSkillPresetsByCategory(
  category: SkillPresetCategory,
): SkillPreset[] {
  return SKILL_PRESETS.filter((preset) => preset.category === category);
}

export function findSkillPresetById(id: string): SkillPreset | undefined {
  return SKILL_PRESETS.find((preset) => preset.id === id);
}

export function compileSkillPresetAdditions(
  preset: SkillPreset,
): CompiledSkillPresetAdditions {
  return {
    backgroundAddition: `Skill context: ${preset.category} - ${preset.value}. ${preset.guidance}`,
    personalityAddition: `Skill texture: ${preset.value} may shape competence, habits, blind spots, pressure, and confidence without replacing the character's personality.`,
    systemPromptAddition: `Skill guidance: Treat ${preset.value} as soft capability context. Let expertise, limits, practice, and stakes surface when relevant; preserve consent, boundaries, and {{user}} autonomy.`,
  };
}

function toPresetId(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toLabel(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => {
      if (word.toLowerCase() === "ai") return "AI";
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

function buildTriggerKeys(value: string): string[] {
  return Array.from(new Set([value, value.toLowerCase()]));
}
