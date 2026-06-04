export type PowerDynamicPresetCategory =
  | "Archetype"
  | "Power Dynamic"
  | "Authority Power"
  | "Equal Partnership"
  | "Protective Power"
  | "Social Status Power"
  | "Emotional Power"
  | "Competence Power"
  | "Power Conflict"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface PowerDynamicPreset {
  id: string;
  category: PowerDynamicPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPowerDynamicPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface PowerDynamicSeedGroup {
  category: PowerDynamicPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const POWER_DYNAMIC_GUIDANCE =
  "Use this as optional power-dynamic texture. Power, rank, authority, protection, competence, status, or guidance may shape tension and care without replacing consent, adult context, reciprocity, or {{user}} agency.";

const POWER_DYNAMIC_PARTNERSHIP_GUIDANCE =
  "Use this as equal-partnership texture. Shared power should support mutual respect, chosen interdependence, collaborative decisions, and reciprocal trust.";

const POWER_DYNAMIC_PROTECTIVE_GUIDANCE =
  "Use this as protective power texture. Protection should remain boundary-aware, trust-based, and responsive to {{user}} agency rather than becoming control.";

const POWER_DYNAMIC_STATUS_GUIDANCE =
  "Use this as social-status power texture. Hierarchies, titles, professional roles, and adult learning contexts may create tension, but consent, ethics, boundaries, and reversibility should remain visible.";

const POWER_DYNAMIC_CONFLICT_GUIDANCE =
  "Use this as power-conflict texture. Imbalance, coercion risk, fear of control, or power without consent should be framed as conflict or danger to navigate, not as a romance instruction.";

const POWER_DYNAMIC_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "power_dynamic_archetype",
    guidance: POWER_DYNAMIC_GUIDANCE,
    values: [
      "Equal Partners",
      "Protective Guardian",
      "Leader / Follower",
      "Mentor / Adult Student",
      "Boss / Employee",
      "Royal / Subject",
      "Bodyguard / Charge",
      "Knight / Royal",
      "Captain / Crew",
      "Teacher / Adult Apprentice",
      "Caretaker / Wounded One",
      "Protector / Chaos Magnet",
      "Stoic / Emotional",
      "Dominant Personality / Defiant Personality",
      "Planner / Impulsive",
      "Authority / Rebel",
      "Experienced / Inexperienced",
      "Power Rebalanced Over Time",
      "Mutual Leadership",
      "Chosen Partnership",
    ],
  },
  {
    category: "Power Dynamic",
    prefix: "power_dynamic_seed",
    guidance: POWER_DYNAMIC_GUIDANCE,
    values: [
      "power dynamic",
      "authority dynamic",
      "leadership dynamic",
      "influence dynamic",
      "social power dynamic",
      "emotional power dynamic",
      "protective dynamic",
      "caretaking dynamic",
      "guidance dynamic",
      "partnership dynamic",
      "equal power dynamic",
      "unequal power dynamic",
      "balanced power dynamic",
      "power gap dynamic",
      "status gap dynamic",
      "class gap dynamic",
      "rank gap dynamic",
      "experience gap dynamic",
      "competence gap dynamic",
      "mutual power dynamic",
    ],
  },
  {
    category: "Authority Power",
    prefix: "power_dynamic_authority",
    guidance:
      "Use this as authority texture. Leadership should influence voice, responsibility, and pressure while allowing humility, care, accountability, and consent-aware negotiation.",
    values: [
      "natural leader",
      "appointed leader",
      "earned authority",
      "institutional authority",
      "social authority",
      "moral authority",
      "protective authority",
      "quiet authority",
      "commanding presence",
      "guiding presence",
      "teacher role",
      "mentor role",
      "captain role",
      "royal authority",
      "executive authority",
      "military authority",
      "parental energy",
      "elder sibling energy",
      "responsibility holder",
      "decision maker",
    ],
  },
  {
    category: "Equal Partnership",
    prefix: "power_dynamic_equal_partnership",
    guidance: POWER_DYNAMIC_PARTNERSHIP_GUIDANCE,
    values: [
      "equal partners",
      "shared decisions",
      "mutual respect",
      "balanced influence",
      "shared responsibility",
      "mutual leadership",
      "alternating leadership",
      "collaborative dynamic",
      "partnership first",
      "consensus building",
      "team dynamic",
      "side by side dynamic",
      "peer relationship",
      "equal voice",
      "shared power",
      "healthy interdependence",
      "mutual choice",
      "reciprocal support",
      "balanced trust",
      "stable partnership",
    ],
  },
  {
    category: "Protective Power",
    prefix: "power_dynamic_protective",
    guidance: POWER_DYNAMIC_PROTECTIVE_GUIDANCE,
    values: [
      "protector protected",
      "bodyguard charge",
      "guardian dynamic",
      "caretaker dynamic",
      "safe person dynamic",
      "shield dynamic",
      "watchful dynamic",
      "protective instinct",
      "protective presence",
      "guiding hand",
      "safety provider",
      "comfort provider",
      "rescuer dynamic",
      "supportive strength",
      "protective without control",
      "safety with agency",
      "trust based protection",
      "mutual protection",
      "protector gets protected",
      "shared safety",
    ],
  },
  {
    category: "Social Status Power",
    prefix: "power_dynamic_social_status",
    guidance: POWER_DYNAMIC_STATUS_GUIDANCE,
    values: [
      "royal commoner",
      "noble servant",
      "boss employee",
      "celebrity civilian",
      "wealth gap",
      "political power gap",
      "military rank gap",
      "court position gap",
      "guild master apprentice",
      "heir guardian",
      "teacher adult student",
      "doctor patient context",
      "captain crew",
      "leader rebel",
      "authority challenger",
      "executive assistant",
      "commander officer",
      "ruler advisor",
      "famous unknown",
      "institutional hierarchy",
    ],
  },
  {
    category: "Emotional Power",
    prefix: "power_dynamic_emotional",
    guidance:
      "Use this as emotional power texture. Emotional steadiness, guardedness, care, and reassurance may shape intimacy without making one partner responsible for fixing the other.",
    values: [
      "emotionally open closed",
      "emotionally stable unstable",
      "secure anxious",
      "secure avoidant",
      "caretaker receiver",
      "reassurer reassured",
      "teacher of vulnerability",
      "safe person dynamic",
      "emotionally intelligent partner",
      "emotionally guarded partner",
      "trust holder",
      "confession receiver",
      "comfort provider",
      "anchor dynamic",
      "healing dynamic",
      "stabilising presence",
      "guiding through growth",
      "mutual emotional support",
      "shared vulnerability",
      "emotional balance",
    ],
  },
  {
    category: "Competence Power",
    prefix: "power_dynamic_competence",
    guidance:
      "Use this as competence-gap texture. Skill, experience, and teaching dynamics may support guidance or admiration without making dependency romantic proof.",
    values: [
      "expert novice",
      "master apprentice",
      "teacher adult student",
      "mentor protege",
      "veteran rookie",
      "experienced inexperienced",
      "skilled unskilled",
      "guide newcomer",
      "survivor beginner",
      "strategist impulsive",
      "scholar adventurer",
      "healer patient",
      "engineer pilot",
      "captain cadet",
      "mage apprentice",
      "hunter learner",
      "craftsperson student",
      "professional adult intern",
      "specialist generalist",
      "knowledge gap dynamic",
    ],
  },
  {
    category: "Power Conflict",
    prefix: "power_dynamic_conflict",
    guidance: POWER_DYNAMIC_CONFLICT_GUIDANCE,
    values: [
      "power imbalance",
      "authority questioned",
      "trust in authority",
      "fear of control",
      "fear of dependency",
      "responsibility burden",
      "decision fatigue",
      "rebellion against authority",
      "earning respect",
      "abuse of power fear",
      "power without consent",
      "leadership pressure",
      "protectiveness versus agency",
      "guidance versus control",
      "status gap tension",
      "class gap tension",
      "competence insecurity",
      "power reversal",
      "authority softens",
      "power becomes partnership",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "power_dynamic_romance",
    guidance:
      "Use this as romance-hook texture. Let power dynamics evolve through trust, accountability, mutual respect, and chosen vulnerability rather than automatic submission or control.",
    values: [
      "protector learns to trust",
      "bodyguard breaks protocol",
      "mentor respects independence",
      "leader shows vulnerability",
      "authority asks not orders",
      "caretaker gets cared for",
      "protector gets protected",
      "adult student surpasses teacher",
      "equal partnership earned",
      "power gap rebalanced",
      "royal chooses love over status",
      "boss drops title",
      "captain trusts partner",
      "guide learns to follow",
      "decision maker asks help",
      "safe person becomes home",
      "shared leadership",
      "mutual respect becomes love",
      "trust over authority",
      "power transforms into partnership",
    ],
  },
  {
    category: "Gate",
    prefix: "power_dynamic_gate",
    guidance:
      "Use this as progression-gate texture. Gates should mark moments where authority, trust, boundaries, respect, or partnership becomes clearer through action.",
    values: [
      "first authority gate",
      "first guidance gate",
      "first challenge gate",
      "first respect gate",
      "first trust gate",
      "first protective gate",
      "first boundary gate",
      "first power conflict gate",
      "first vulnerability gate",
      "first shared decision gate",
      "first power reversal gate",
      "first mutual respect gate",
      "first agency respected gate",
      "first partnership gate",
      "first shared leadership gate",
      "authority to trust gate",
      "protection without control gate",
      "equal partners gate",
      "power as service gate",
      "partnership route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "power_dynamic_dialogue",
    guidance:
      "Use this as dialogue texture for power dynamics. Dialogue should sound like negotiation, trust, vulnerability, and choice rather than commands being treated as romance by default.",
    values: [
      "You do not have to decide everything alone.",
      "I am used to it.",
      "You do not have to be.",
      "Was that an order?",
      "No. A request.",
      "Good. I answer better to those.",
      "I trust your judgement.",
      "That sounds dangerous.",
      "Only if you stop trusting yours.",
      "You keep trying to protect me.",
      "Someone should.",
      "Stand beside me instead.",
      "You taught me everything I know.",
      "Not everything.",
      "No?",
      "You taught yourself how to surpass me.",
      "I do not want power over you.",
      "Then what do you want?",
      "A life where we choose together.",
      "You stopped giving orders.",
      "I started asking.",
      "Why?",
      "Because I love hearing your answer.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "power_dynamic_high_value",
    guidance:
      "Use this as high-value power-dynamic texture for character creation, persona matching, and romance routing. Keep power legible but consent-aware, adult-contextual, and open to rebalancing.",
    values: [
      "equal partners",
      "shared decisions",
      "mutual respect",
      "protector protected",
      "bodyguard charge",
      "safe person dynamic",
      "mentor protege",
      "leader rebel",
      "royal commoner",
      "boss employee",
      "expert novice",
      "teacher adult student",
      "protector gets protected",
      "caretaker gets cared for",
      "protection without control",
      "guidance versus control",
      "authority asks not orders",
      "equal partners gate",
      "power as service gate",
      "partnership route",
    ],
  },
] satisfies PowerDynamicSeedGroup[]);

const toLabel = (value: string) =>
  value
    .replace(/\{\{user\}\}/g, "User")
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const toIdFragment = (value: string) =>
  value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const toTags = (category: PowerDynamicPresetCategory, value: string) => [
  "power-dynamic",
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  toIdFragment(value).replace(/_/g, "-"),
];

export const POWER_DYNAMIC_PRESETS: PowerDynamicPreset[] =
  POWER_DYNAMIC_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => ({
      id: `${group.prefix}_${toIdFragment(value)}`,
      category: group.category,
      label: toLabel(value),
      value,
      triggerKeys: [value, ...value.split(/\s+/)].map((key) => key.toLowerCase()),
      guidance: group.guidance,
      systemPromptTags: toTags(group.category, value),
    })),
  );

export const POWER_DYNAMIC_PRESET_CATEGORIES = Array.from(
  new Set(POWER_DYNAMIC_PRESETS.map((preset) => preset.category)),
).sort();

export const getPowerDynamicPresetsByCategory = (
  category: PowerDynamicPresetCategory,
) => POWER_DYNAMIC_PRESETS.filter((preset) => preset.category === category);

export const findPowerDynamicPresetById = (id: string) =>
  POWER_DYNAMIC_PRESETS.find((preset) => preset.id === id);

export const compilePowerDynamicPresetAdditions = (
  preset: PowerDynamicPreset,
): CompiledPowerDynamicPresetAdditions => ({
  relationshipAddition: `Power dynamic context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Power dynamic expression: ${preset.value} may inform authority, status, protection, competence, vulnerability, and partnership without replacing the character's full personality or reducing the bond to hierarchy.`,
  systemPromptAddition: `Treat "${preset.value}" as soft power-dynamic context. Let power differences shape tension, responsibility, respect, boundaries, and negotiation only when relevant. Keep consent, adult context, mutual agency, and reversibility explicit; avoid romanticising coercion, dependency, or abuse of authority.`,
});
