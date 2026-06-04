export type HighValueCharacterCreationSkillPresetCategory =
  | "Archetype"
  | "High-Value Seed"
  | "Bundle"
  | "Weakness"
  | "Gate"
  | "Dialogue Seed";

export interface HighValueCharacterCreationSkillPreset {
  id: string;
  category: HighValueCharacterCreationSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
  bundleSeeds?: string[];
}

export interface CompiledHighValueCharacterCreationSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface HighValueCharacterCreationSkillSeedGroup {
  category: HighValueCharacterCreationSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

interface HighValueCharacterCreationSkillBundleGroup {
  category: "Bundle";
  prefix: string;
  guidance: string;
  values: Array<{
    id: string;
    label: string;
    seeds: string[];
  }>;
}

const HIGH_VALUE_CHARACTER_CREATION_SKILL_GUIDANCE =
  "Use this as high-value character creation skill texture. These seeds are broad selectors for capability, care, danger, competence, weakness, and romance chemistry without replacing personality, consent, or {{user}} agency.";

const HIGH_VALUE_CHARACTER_CREATION_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "high_value_character_creation_skill_archetype",
    guidance: HIGH_VALUE_CHARACTER_CREATION_SKILL_GUIDANCE,
    values: [
      "The Charismatic Leader",
      "The Strategic Protector",
      "The Gentle Caretaker",
      "The Brilliant Scholar",
      "The Battle-Tested Fighter",
      "The Streetwise Survivor",
      "The Silver-Tongued Diplomat",
      "The Emotional Anchor",
      "The Master Detective",
      "The Creative Visionary",
      "The Skilled Healer",
      "The Dangerous Specialist",
      "The Domestic Safe Place",
      "The Technical Genius",
      "The Underworld Fixer",
      "The Magical Prodigy",
      "The Starship Expert",
      "The Patient Mentor",
      "The Boundary-Respecting Lover",
      "The One Who Becomes Home",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "high_value_character_creation_skill_seed",
    guidance:
      "Use this as a high-signal character skill seed for character creation, matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "leadership",
      "charisma",
      "strategy",
      "active listening",
      "emotional intelligence",
      "emotional attunement",
      "reassurance",
      "caretaking",
      "comforting",
      "protectiveness",
      "trust building",
      "boundary respect",
      "conflict repair",
      "apologising",
      "communication",
      "patience",
      "devotion",
      "loyalty",
      "emotional safety",
      "relationship maintenance",
      "combat skill",
      "bodyguarding",
      "threat assessment",
      "protective combat",
      "martial arts",
      "swordsmanship",
      "marksmanship",
      "stealth",
      "survival",
      "tracking",
      "navigation",
      "first aid",
      "emergency medicine",
      "resourcefulness",
      "escape and evasion",
      "research",
      "analysis",
      "deduction",
      "pattern recognition",
      "problem solving",
      "memory",
      "teaching",
      "mentorship",
      "investigation",
      "forensics",
      "case building",
      "risk assessment",
      "planning",
      "critical thinking",
      "negotiation",
      "diplomacy",
      "persuasion",
      "de-escalation",
      "mediation",
      "public speaking",
      "storytelling",
      "people reading",
      "court etiquette",
      "social navigation",
      "flirting",
      "charm",
      "hospitality",
      "community building",
      "cooking",
      "baking",
      "domestic care",
      "sick care",
      "home repair",
      "gardening",
      "hosting",
      "creating safe spaces",
      "daily routine building",
      "comfort food",
      "programming",
      "engineering",
      "mechanics",
      "hacking",
      "cybersecurity",
      "robotics",
      "AI development",
      "data analysis",
      "technical troubleshooting",
      "life support maintenance",
      "spellcasting",
      "healing magic",
      "curse breaking",
      "ward creation",
      "alchemy",
      "rune crafting",
      "divination",
      "summoning",
      "monster lore",
      "forbidden magic",
      "piloting",
      "starship engineering",
      "astrogation",
      "xenobiology",
      "xenolinguistics",
      "android repair",
      "cybernetic repair",
      "terraforming",
      "signal analysis",
      "space survival",
      "creative writing",
      "painting",
      "music",
      "songwriting",
      "dance",
      "photography",
      "fashion design",
      "culinary art",
      "worldbuilding",
      "creative problem solving",
      "lockpicking",
      "forgery",
      "smuggling",
      "information brokering",
      "underworld navigation",
      "safehouse management",
      "deception",
      "counter-surveillance",
      "black market knowledge",
      "escape planning",
    ],
  },
  {
    category: "Weakness",
    prefix: "high_value_character_creation_skill_weakness",
    guidance:
      "Use this as high-value skill weakness texture. Capability, usefulness, protection, survival, perfectionism, and accepting help may surface when relevant without excusing harm.",
    values: [
      "overprotective tendency",
      "caretaker burnout",
      "trust issues",
      "fear of vulnerability",
      "impostor syndrome",
      "workaholism",
      "survival mode",
      "uses skill to avoid feelings",
      "identity tied to usefulness",
      "cannot accept help",
      "saviour complex",
      "perfectionism",
      "haunted by failure",
      "afraid of being needed only for skill",
      "love beyond usefulness conflict",
    ],
  },
  {
    category: "Gate",
    prefix: "high_value_character_creation_skill_gate",
    guidance:
      "Use this as a high-value character skill progression gate. Let skill reveals, protection, caretaking, teaching, failure, boundaries, and earned trust become optional pacing milestones.",
    values: [
      "first skill reveal gate",
      "first protective action gate",
      "first caretaking gate",
      "first teaching gate",
      "first failure gate",
      "first accepts help gate",
      "first boundary respected gate",
      "first repair gate",
      "first vulnerability gate",
      "first skill as love language gate",
      "first {{user}} sees weakness gate",
      "first {{user}} admires skill gate",
      "first skill fails gate",
      "first love beyond usefulness gate",
      "earned trust route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "high_value_character_creation_skill_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "You do not have to be useful to be wanted.",
      "That is harder to believe than it should be.",
      "You always know what to do.",
      "No. I just panic quietly and make a plan.",
      "Let me help.",
      "I am used to being the one who helps.",
      "Then learn with me.",
      "You make safety look easy.",
      "It was not easy. I learned it because no one gave it to me.",
      "Your skill saved me.",
      "Good.",
      "That is all?",
      "No. But if I say the rest, my hands will shake.",
      "I do not love you because of what you can do.",
      "Then why?",
      "Because of who you are when you stop performing.",
    ],
  },
] satisfies readonly HighValueCharacterCreationSkillSeedGroup[]);

const HIGH_VALUE_CHARACTER_CREATION_SKILL_BUNDLE_GROUP = Object.freeze({
  category: "Bundle",
  prefix: "high_value_character_creation_skill_bundle",
  guidance:
    "Use this as a bundled high-value character skill profile. Bundle seeds should combine into additive texture rather than a rigid template.",
  values: [
    {
      id: "romance_safe_person",
      label: "Romance Safe Person",
      seeds: [
        "active listening",
        "emotional attunement",
        "reassurance",
        "boundary respect",
        "trust building",
        "conflict repair",
        "comforting",
        "emotional safety",
      ],
    },
    {
      id: "protective_love_interest",
      label: "Protective Love Interest",
      seeds: [
        "bodyguarding",
        "threat assessment",
        "protective combat",
        "first aid",
        "de-escalation",
        "keeps promises",
        "protects without controlling",
        "safe person dynamic",
      ],
    },
    {
      id: "brilliant_slow_burn",
      label: "Brilliant Slow Burn",
      seeds: [
        "research",
        "deduction",
        "pattern recognition",
        "overthinking",
        "teaching",
        "late night conversation",
        "intellectual respect",
        "logic fails against love",
      ],
    },
    {
      id: "caretaker_healer",
      label: "Caretaker Healer",
      seeds: [
        "medical knowledge",
        "sick care",
        "emergency medicine",
        "bedside manner",
        "comforting presence",
        "emotional support",
        "caretaker gets cared for",
        "love that feels safe",
      ],
    },
    {
      id: "dangerous_underworld_romantic",
      label: "Dangerous Underworld Romantic",
      seeds: [
        "underworld navigation",
        "information brokering",
        "safehouse management",
        "deception",
        "threat assessment",
        "protective instinct",
        "love as liability",
        "redemption through love",
      ],
    },
  ],
} satisfies HighValueCharacterCreationSkillBundleGroup);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: HighValueCharacterCreationSkillSeedGroup,
  value: string,
): HighValueCharacterCreationSkillPreset => ({
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

const makeBundlePreset = (
  bundle: HighValueCharacterCreationSkillBundleGroup["values"][number],
): HighValueCharacterCreationSkillPreset => ({
  id: `${HIGH_VALUE_CHARACTER_CREATION_SKILL_BUNDLE_GROUP.prefix}_${bundle.id}`,
  category: "Bundle",
  label: bundle.label,
  value: bundle.label,
  bundleSeeds: bundle.seeds,
  triggerKeys: Array.from(
    new Set([
      bundle.id,
      bundle.label,
      ...bundle.seeds,
      ...bundle.label
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: HIGH_VALUE_CHARACTER_CREATION_SKILL_BUNDLE_GROUP.guidance,
  systemPromptTags: ["Bundle", bundle.label, ...bundle.seeds],
});

export const HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS = [
  ...HIGH_VALUE_CHARACTER_CREATION_SKILL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => makePreset(group, value)),
  ),
  ...HIGH_VALUE_CHARACTER_CREATION_SKILL_BUNDLE_GROUP.values.map(makeBundlePreset),
];

export const HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getHighValueCharacterCreationSkillPresetsByCategory = (
  category: HighValueCharacterCreationSkillPresetCategory,
) =>
  HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS.filter(
    (preset) => preset.category === category,
  );

export const findHighValueCharacterCreationSkillPresetById = (id: string) =>
  HIGH_VALUE_CHARACTER_CREATION_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileHighValueCharacterCreationSkillPresetAdditions = (
  preset: HighValueCharacterCreationSkillPreset,
): CompiledHighValueCharacterCreationSkillPresetAdditions => {
  const bundleLine = preset.bundleSeeds?.length
    ? ` Bundle seeds: ${preset.bundleSeeds.join(", ")}.`
    : "";

  return {
    backgroundAddition: `High-value character creation skill context: ${preset.value}.${bundleLine} ${preset.guidance}`,
    personalityAddition: `High-value skill texture may include ${preset.value} without replacing the character's full personality, flaws, limits, contradictions, accountability, or growth.`,
    systemPromptAddition: [
      `Treat ${preset.value} as soft high-value character creation skill context.`,
      "Let capability, care, protection, intellect, creativity, survival, technical skill, magic, sci-fi expertise, or underworld pressure shape behaviour when relevant.",
      "Keep consent, boundaries, reciprocity, consequence, and {{user}} autonomy intact; skill should not erase vulnerability or become the whole character.",
    ].join(" "),
  };
};
