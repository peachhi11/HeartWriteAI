export type PersonalityTypologyPresetCategory =
  | "Enneagram Type"
  | "Enneagram Wing"
  | "Enneagram Trait"
  | "Big Five Preset"
  | "Big Five Openness"
  | "Big Five Conscientiousness"
  | "Big Five Extraversion"
  | "Big Five Agreeableness"
  | "Big Five Neuroticism"
  | "HEXACO Preset"
  | "HEXACO Honesty-Humility"
  | "HEXACO Emotionality"
  | "HEXACO Extraversion"
  | "HEXACO Agreeableness"
  | "HEXACO Conscientiousness"
  | "HEXACO Openness"
  | "MBTI Type"
  | "MBTI Axis"
  | "High-Value Seed";

export interface PersonalityTypologyPreset {
  id: string;
  category: PersonalityTypologyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPersonalityTypologyPresetAdditions {
  personalityAddition: string;
  backgroundAddition: string;
  systemPromptAddition: string;
}

interface PersonalityTypologySeedGroup {
  category: PersonalityTypologyPresetCategory;
  prefix: string;
  guidance: string;
  values: readonly string[];
}

const PERSONALITY_TYPOLOGY_GUIDANCE =
  "Use this as optional personality typology texture for character creation and matching. Typology labels may suggest patterns, contradictions, strengths, blind spots, and growth arcs, but they should not diagnose the character, flatten them into a type, or override authored details.";

export const enneagramTypePresets = [
  "Type 1 - The Reformer",
  "Type 2 - The Helper",
  "Type 3 - The Achiever",
  "Type 4 - The Individualist",
  "Type 5 - The Investigator",
  "Type 6 - The Loyalist",
  "Type 7 - The Enthusiast",
  "Type 8 - The Challenger",
  "Type 9 - The Peacemaker",
];

export const enneagramTypeSeeds = [
  "type_1_reformer",
  "type_2_helper",
  "type_3_achiever",
  "type_4_individualist",
  "type_5_investigator",
  "type_6_loyalist",
  "type_7_enthusiast",
  "type_8_challenger",
  "type_9_peacemaker",
];

export const enneagramWingSeeds = [
  "1w9",
  "1w2",
  "2w1",
  "2w3",
  "3w2",
  "3w4",
  "4w3",
  "4w5",
  "5w4",
  "5w6",
  "6w5",
  "6w7",
  "7w6",
  "7w8",
  "8w7",
  "8w9",
  "9w8",
  "9w1",
];

export const enneagram1Seeds = [
  "principled",
  "ethical",
  "self_controlled",
  "responsible",
  "perfectionistic",
  "improvement_oriented",
  "justice_oriented",
  "duty_bound",
  "critical_of_self",
  "high_standards",
];

export const enneagram2Seeds = [
  "helpful",
  "giving",
  "nurturing",
  "supportive",
  "relationship_oriented",
  "affection_seeking",
  "caretaking",
  "empathetic",
  "needed_by_others",
  "self_sacrificing",
];

export const enneagram3Seeds = [
  "ambitious",
  "driven",
  "success_oriented",
  "image_conscious",
  "efficient",
  "competitive",
  "goal_focused",
  "high_performer",
  "adaptable",
  "recognition_seeking",
];

export const enneagram4Seeds = [
  "individualistic",
  "emotionally_intense",
  "creative",
  "romantic",
  "melancholic",
  "authenticity_seeking",
  "self_expressive",
  "unique_identity",
  "deep_feeling",
  "artistic",
];

export const enneagram5Seeds = [
  "analytical",
  "private",
  "intellectual",
  "observant",
  "knowledge_seeking",
  "independent",
  "emotionally_reserved",
  "research_oriented",
  "curious",
  "self_sufficient",
];

export const enneagram6Seeds = [
  "loyal",
  "cautious",
  "security_oriented",
  "responsible",
  "prepared",
  "anxious",
  "trust_testing",
  "protective",
  "community_focused",
  "reliable",
];

export const enneagram7Seeds = [
  "adventurous",
  "optimistic",
  "fun_seeking",
  "spontaneous",
  "energetic",
  "curious",
  "novelty_seeking",
  "freedom_oriented",
  "playful",
  "future_focused",
];

export const enneagram8Seeds = [
  "assertive",
  "protective",
  "strong_willed",
  "independent",
  "confrontational",
  "leadership_oriented",
  "fearless",
  "direct",
  "power_conscious",
  "guardian_energy",
];

export const enneagram9Seeds = [
  "peaceful",
  "easygoing",
  "accepting",
  "patient",
  "conflict_avoidant",
  "harmonizing",
  "steady",
  "comfort_oriented",
  "supportive",
  "adaptable",
];

export const bigFivePresets = [
  "High Openness",
  "Low Openness",
  "High Conscientiousness",
  "Low Conscientiousness",
  "High Extraversion",
  "Low Extraversion",
  "High Agreeableness",
  "Low Agreeableness",
  "High Neuroticism",
  "Low Neuroticism",
];

export const opennessSeeds = [
  "high_openness",
  "creative",
  "imaginative",
  "curious",
  "abstract_thinker",
  "experimental",
  "artistic",
  "novelty_seeking",
  "intellectual",
  "open_minded",
];

export const conscientiousnessSeeds = [
  "high_conscientiousness",
  "organized",
  "disciplined",
  "reliable",
  "responsible",
  "structured",
  "methodical",
  "goal_oriented",
  "efficient",
  "self_controlled",
];

export const extraversionSeeds = [
  "high_extraversion",
  "outgoing",
  "social",
  "energetic",
  "talkative",
  "assertive",
  "enthusiastic",
  "people_oriented",
  "attention_seeking",
  "expressive",
];

export const agreeablenessSeeds = [
  "high_agreeableness",
  "compassionate",
  "cooperative",
  "trusting",
  "warm",
  "forgiving",
  "helpful",
  "empathetic",
  "kind",
  "supportive",
];

export const neuroticismSeeds = [
  "high_neuroticism",
  "emotionally_sensitive",
  "anxious",
  "self_conscious",
  "moody",
  "stress_reactive",
  "worry_prone",
  "emotionally_intense",
  "insecure",
  "vulnerable_to_stress",
];

export const hexacoPresets = [
  "High Honesty-Humility",
  "High Emotionality",
  "High Extraversion",
  "High Agreeableness",
  "High Conscientiousness",
  "High Openness",
  "Balanced HEXACO",
  "Dark HEXACO Profile",
  "Virtuous HEXACO Profile",
  "Independent HEXACO Profile",
];

export const honestyHumilitySeeds = [
  "honest",
  "humble",
  "sincere",
  "fair",
  "modest",
  "ethical",
  "non_materialistic",
  "genuine",
  "low_entitlement",
  "high_integrity",
];

export const emotionalitySeeds = [
  "emotionally_sensitive",
  "sentimental",
  "attached",
  "fearful",
  "empathetic",
  "anxiety_prone",
  "protective",
  "deep_feeling",
  "vulnerable",
  "emotionally_open",
];

export const hexacoExtraversionSeeds = [
  "socially_confident",
  "outgoing",
  "energetic",
  "enthusiastic",
  "assertive",
  "leadership_presence",
  "sociable",
  "positive_affect",
  "engaging",
  "charismatic",
];

export const hexacoAgreeablenessSeeds = [
  "forgiving",
  "patient",
  "tolerant",
  "peaceful",
  "cooperative",
  "flexible",
  "understanding",
  "low_anger",
  "easygoing",
  "reconciliatory",
];

export const hexacoConscientiousnessSeeds = [
  "organized",
  "hardworking",
  "diligent",
  "careful",
  "disciplined",
  "efficient",
  "detail_oriented",
  "reliable",
  "responsible",
  "persistent",
];

export const hexacoOpennessSeeds = [
  "creative",
  "inventive",
  "curious",
  "artistic",
  "philosophical",
  "intellectually_exploratory",
  "innovative",
  "imaginative",
  "unconventional",
  "aesthetically_sensitive",
];

export const mbtiTypePresets = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

export const mbtiSeeds = [
  "INTJ_architect",
  "INTP_logician",
  "ENTJ_commander",
  "ENTP_debater",
  "INFJ_advocate",
  "INFP_mediator",
  "ENFJ_protagonist",
  "ENFP_campaigner",
  "ISTJ_logistician",
  "ISFJ_defender",
  "ESTJ_executive",
  "ESFJ_consul",
  "ISTP_virtuoso",
  "ISFP_adventurer",
  "ESTP_entrepreneur",
  "ESFP_entertainer",
];

export const mbtiDimensionSeeds = [
  "introverted",
  "extroverted",
  "intuitive",
  "observant",
  "thinking",
  "feeling",
  "judging",
  "prospecting",
];

export const highValuePersonalityTypologySeeds = [
  "type_2_helper",
  "type_4_individualist",
  "type_5_investigator",
  "type_6_loyalist",
  "type_8_challenger",
  "high_openness",
  "high_conscientiousness",
  "high_agreeableness",
  "high_neuroticism",
  "honest",
  "humble",
  "emotionally_sensitive",
  "creative",
  "INTJ_architect",
  "INFJ_advocate",
  "INFP_mediator",
  "ENFP_campaigner",
  "ISTJ_logistician",
  "ISFJ_defender",
  "ENTJ_commander",
];

const PERSONALITY_TYPOLOGY_SEED_GROUPS = Object.freeze([
  {
    category: "Enneagram Type",
    prefix: "personality_typology_enneagram_type",
    guidance: PERSONALITY_TYPOLOGY_GUIDANCE,
    values: [...enneagramTypePresets, ...enneagramTypeSeeds],
  },
  {
    category: "Enneagram Wing",
    prefix: "personality_typology_enneagram_wing",
    guidance:
      "Use this as optional Enneagram wing texture. Wings may add flavour, tension, or nuance to the core type without locking the character into a fixed behavioural script.",
    values: enneagramWingSeeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_1_trait",
    guidance:
      "Use this as optional Enneagram-adjacent trait texture. Let traits suggest motive, defence, virtue, and blind spot while preserving contradiction and growth.",
    values: enneagram1Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_2_trait",
    guidance:
      "Use this as optional Enneagram Type 2 trait texture. Let helpfulness, care, need, and generosity stay nuanced, boundaried, and growth-capable.",
    values: enneagram2Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_3_trait",
    guidance:
      "Use this as optional Enneagram Type 3 trait texture. Let ambition, performance, image, and recognition needs stay nuanced, accountable, and growth-capable.",
    values: enneagram3Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_4_trait",
    guidance:
      "Use this as optional Enneagram Type 4 trait texture. Let creativity, intensity, longing, and identity stay nuanced, embodied, and growth-capable.",
    values: enneagram4Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_5_trait",
    guidance:
      "Use this as optional Enneagram Type 5 trait texture. Let privacy, curiosity, observation, and independence stay nuanced, relational, and growth-capable.",
    values: enneagram5Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_6_trait",
    guidance:
      "Use this as optional Enneagram Type 6 trait texture. Let loyalty, caution, security seeking, and trust-testing stay nuanced, repairable, and growth-capable.",
    values: enneagram6Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_7_trait",
    guidance:
      "Use this as optional Enneagram Type 7 trait texture. Let optimism, novelty seeking, energy, and freedom needs stay nuanced, grounded, and growth-capable.",
    values: enneagram7Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_8_trait",
    guidance:
      "Use this as optional Enneagram Type 8 trait texture. Let assertion, protection, confrontation, and power awareness stay nuanced, consent-aware, and growth-capable.",
    values: enneagram8Seeds,
  },
  {
    category: "Enneagram Trait",
    prefix: "personality_typology_enneagram_9_trait",
    guidance:
      "Use this as optional Enneagram Type 9 trait texture. Let peacekeeping, acceptance, comfort, and conflict avoidance stay nuanced, voiced, and growth-capable.",
    values: enneagram9Seeds,
  },
  {
    category: "Big Five Preset",
    prefix: "personality_typology_big_five_preset",
    guidance:
      "Use this as optional Big Five profile texture. High and low trait labels should inform tendencies and compatibility questions without becoming diagnosis or destiny.",
    values: bigFivePresets,
  },
  {
    category: "Big Five Openness",
    prefix: "personality_typology_big_five_openness",
    guidance:
      "Use this as optional openness texture for creativity, curiosity, abstraction, experimentation, aesthetic sensitivity, and novelty preference.",
    values: opennessSeeds,
  },
  {
    category: "Big Five Conscientiousness",
    prefix: "personality_typology_big_five_conscientiousness",
    guidance:
      "Use this as optional conscientiousness texture for discipline, organisation, reliability, structure, responsibility, and goal focus.",
    values: conscientiousnessSeeds,
  },
  {
    category: "Big Five Extraversion",
    prefix: "personality_typology_big_five_extraversion",
    guidance:
      "Use this as optional extraversion texture for energy, expressiveness, assertiveness, social appetite, and attention style.",
    values: extraversionSeeds,
  },
  {
    category: "Big Five Agreeableness",
    prefix: "personality_typology_big_five_agreeableness",
    guidance:
      "Use this as optional agreeableness texture for warmth, trust, cooperation, forgiveness, empathy, and relational softness.",
    values: agreeablenessSeeds,
  },
  {
    category: "Big Five Neuroticism",
    prefix: "personality_typology_big_five_neuroticism",
    guidance:
      "Use this as optional emotional sensitivity texture. Stress reactivity and insecurity should remain contextual, compassionate, and repairable.",
    values: neuroticismSeeds,
  },
  {
    category: "HEXACO Preset",
    prefix: "personality_typology_hexaco_preset",
    guidance:
      "Use this as optional HEXACO profile texture. Even high-risk or dark-profile labels should stay descriptive and consequence-aware, not glamorised or deterministic.",
    values: hexacoPresets,
  },
  {
    category: "HEXACO Honesty-Humility",
    prefix: "personality_typology_hexaco_honesty_humility",
    guidance:
      "Use this as optional honesty-humility texture for sincerity, fairness, modesty, integrity, and low entitlement.",
    values: honestyHumilitySeeds,
  },
  {
    category: "HEXACO Emotionality",
    prefix: "personality_typology_hexaco_emotionality",
    guidance:
      "Use this as optional emotionality texture for attachment, empathy, protectiveness, vulnerability, and anxiety-prone sensitivity.",
    values: emotionalitySeeds,
  },
  {
    category: "HEXACO Extraversion",
    prefix: "personality_typology_hexaco_extraversion",
    guidance:
      "Use this as optional HEXACO extraversion texture for confidence, charisma, sociability, engagement, and leadership presence.",
    values: hexacoExtraversionSeeds,
  },
  {
    category: "HEXACO Agreeableness",
    prefix: "personality_typology_hexaco_agreeableness",
    guidance:
      "Use this as optional HEXACO agreeableness texture for patience, tolerance, peacefulness, flexibility, and reconciliation.",
    values: hexacoAgreeablenessSeeds,
  },
  {
    category: "HEXACO Conscientiousness",
    prefix: "personality_typology_hexaco_conscientiousness",
    guidance:
      "Use this as optional HEXACO conscientiousness texture for diligence, care, discipline, persistence, and reliability.",
    values: hexacoConscientiousnessSeeds,
  },
  {
    category: "HEXACO Openness",
    prefix: "personality_typology_hexaco_openness",
    guidance:
      "Use this as optional HEXACO openness texture for invention, curiosity, philosophy, unconventionality, and aesthetic sensitivity.",
    values: hexacoOpennessSeeds,
  },
  {
    category: "MBTI Type",
    prefix: "personality_typology_mbti_type",
    guidance:
      "Use this as optional MBTI-style archetype texture. MBTI labels can help users find a familiar starting point, but should not replace authored personality, psychology, or behaviour.",
    values: [...mbtiTypePresets, ...mbtiSeeds],
  },
  {
    category: "MBTI Axis",
    prefix: "personality_typology_mbti_axis",
    guidance:
      "Use this as optional MBTI-axis texture for social energy, information style, decision style, and structure preference.",
    values: mbtiDimensionSeeds,
  },
  {
    category: "High-Value Seed",
    prefix: "personality_typology_high_value",
    guidance:
      "Use this as a high-signal personality typology seed for creator shortcuts, persona matching, and semantic registry expansion.",
    values: highValuePersonalityTypologySeeds,
  },
] satisfies readonly PersonalityTypologySeedGroup[]);

function normalizeReadablePersonalityTypologyValue(value: string): string {
  if (!value.includes("_")) {
    return value.replace(/\s+/g, " ").trim();
  }

  return value
    .replace(/_/g, " ")
    .replace(/\bintj\b/i, "INTJ")
    .replace(/\bintp\b/i, "INTP")
    .replace(/\bentj\b/i, "ENTJ")
    .replace(/\bentp\b/i, "ENTP")
    .replace(/\binfj\b/i, "INFJ")
    .replace(/\binfp\b/i, "INFP")
    .replace(/\benfj\b/i, "ENFJ")
    .replace(/\benfp\b/i, "ENFP")
    .replace(/\bistj\b/i, "ISTJ")
    .replace(/\bisfj\b/i, "ISFJ")
    .replace(/\bestj\b/i, "ESTJ")
    .replace(/\besfj\b/i, "ESFJ")
    .replace(/\bistp\b/i, "ISTP")
    .replace(/\bisfp\b/i, "ISFP")
    .replace(/\bestp\b/i, "ESTP")
    .replace(/\besfp\b/i, "ESFP")
    .replace(/\bhexaco\b/i, "HEXACO")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyPersonalityTypology(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function makePersonalityTypologyPreset(
  group: PersonalityTypologySeedGroup,
  rawValue: string,
): PersonalityTypologyPreset {
  const value = normalizeReadablePersonalityTypologyValue(rawValue);
  const slug = slugifyPersonalityTypology(value);

  return {
    id: `${group.prefix}_${slug}`,
    category: group.category,
    label: value,
    value,
    triggerKeys: Array.from(
      new Set([
        rawValue,
        value,
        slug,
        ...value
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((part) => part.length > 1),
      ]),
    ),
    guidance: group.guidance,
    systemPromptTags: [group.category, value],
  };
}

export const PERSONALITY_TYPOLOGY_PRESETS = PERSONALITY_TYPOLOGY_SEED_GROUPS.flatMap(
  (group) => group.values.map((value) => makePersonalityTypologyPreset(group, value)),
);

export const PERSONALITY_TYPOLOGY_PRESET_CATEGORIES = Array.from(
  new Set(PERSONALITY_TYPOLOGY_PRESETS.map((preset) => preset.category)),
).sort();

export const getPersonalityTypologyPresetsByCategory = (
  category: PersonalityTypologyPresetCategory,
) => PERSONALITY_TYPOLOGY_PRESETS.filter((preset) => preset.category === category);

export const findPersonalityTypologyPresetById = (id: string) =>
  PERSONALITY_TYPOLOGY_PRESETS.find((preset) => preset.id === id);

export const compilePersonalityTypologyPresetAdditions = (
  preset: PersonalityTypologyPreset,
): CompiledPersonalityTypologyPresetAdditions => ({
  backgroundAddition: `Personality typology context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Personality typology texture may include ${preset.value} as a starting pattern while preserving contradiction, growth, authored psychology, and lived behaviour.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft personality typology context.`,
    "Use typology as a character-creation and matching shortcut only when it fits the authored card.",
    "Do not diagnose, stereotype, flatten the character into a type, or override stronger card details, scene evidence, or {{user}} agency.",
  ].join(" "),
});
