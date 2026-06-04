export type SurvivalSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Environment Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface SurvivalSkillPreset {
  id: string;
  category: SurvivalSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSurvivalSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SurvivalSkillSeedGroup {
  category: SurvivalSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SURVIVAL_SKILL_GUIDANCE =
  "Use this as survival skill texture. Resourcefulness, danger assessment, endurance, scarcity, rescue, rest, and recovery may shape scenes without replacing personality, consent, or {{user}} agency.";

const SURVIVAL_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "survival_skill_archetype",
    guidance: SURVIVAL_SKILL_GUIDANCE,
    values: [
      "The Wilderness Survivor",
      "The Urban Survivor",
      "The Tracker",
      "The Forager",
      "The Hunter",
      "The Scout",
      "The Navigator",
      "The Disaster Prepper",
      "The Frontier Settler",
      "The Desert Survivor",
      "The Arctic Survivor",
      "The Jungle Survivor",
      "The Mountain Guide",
      "The Shipwreck Survivor",
      "The Colony Survivalist",
      "The Space Station Emergency Expert",
      "The Medic Survivor",
      "The Resourceful Improviser",
      "The Escape Artist",
      "The One Who Always Gets Them Home",
    ],
  },
  {
    category: "Core Skill",
    prefix: "survival_skill_core",
    guidance:
      "Use this as core survival skill texture. Navigation, first aid, resource care, shelter, evacuation, and risk reading may shape competence and pressure.",
    values: [
      "survival",
      "wilderness survival",
      "urban survival",
      "frontier survival",
      "disaster survival",
      "combat survival",
      "space survival",
      "colony survival",
      "isolation survival",
      "resource scarcity survival",
      "tracking",
      "navigation",
      "orienteering",
      "map reading",
      "compass use",
      "star navigation",
      "route planning",
      "terrain reading",
      "weather reading",
      "danger assessment",
      "risk assessment",
      "resourcefulness",
      "improvisation",
      "rationing",
      "water finding",
      "water purification",
      "food preservation",
      "foraging",
      "hunting",
      "fishing",
      "trapping",
      "firemaking",
      "shelter building",
      "campcraft",
      "rope work",
      "knot tying",
      "tool repair",
      "first aid",
      "emergency medicine",
      "wound care",
      "hypothermia prevention",
      "heatstroke prevention",
      "evacuation planning",
      "escape and evasion",
      "stealth travel",
      "signal making",
      "distress beacon use",
      "safehouse setup",
      "emergency pack preparation",
    ],
  },
  {
    category: "Environment Skill",
    prefix: "survival_skill_environment",
    guidance:
      "Use this as environment survival texture. Landscape, climate, disaster, war zone, and deep-space hazards may shape stakes and sensory detail.",
    values: [
      "forest survival",
      "jungle survival",
      "desert survival",
      "arctic survival",
      "mountain survival",
      "coastal survival",
      "island survival",
      "swamp survival",
      "cave survival",
      "tundra survival",
      "storm survival",
      "blizzard survival",
      "sandstorm survival",
      "flood survival",
      "wildfire survival",
      "earthquake survival",
      "shipwreck survival",
      "war zone survival",
      "post-apocalyptic survival",
      "deep-space survival",
    ],
  },
  {
    category: "Weakness",
    prefix: "survival_skill_weakness",
    guidance:
      "Use this as survival vulnerability texture. Hypervigilance, scarcity fear, isolation, guilt, and over-responsibility may surface without making survival mode the whole character.",
    values: [
      "survival mode",
      "hypervigilance",
      "trusts skills more than people",
      "hoards supplies",
      "cannot rest easily",
      "sleeps lightly",
      "always checks exits",
      "difficulty accepting help",
      "overprotective in crisis",
      "takes too much responsibility",
      "fear of wasting resources",
      "fear of being trapped",
      "fear of being unprepared",
      "panic in enclosed spaces",
      "haunted by past disaster",
      "survivor guilt",
      "resource scarcity trauma",
      "isolation wound",
      "used to doing everything alone",
      "forgets survival is not living",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "survival_skill_romance",
    guidance:
      "Use this as survival romance texture. Shared danger, shelter, rest, rescue, rationing, and recovery may deepen trust while keeping crisis pressure separate from consent.",
    values: [
      "survival partners to lovers",
      "lost in wilderness together",
      "storm shelter romance",
      "one-tent forced proximity",
      "shared body heat",
      "foraging together",
      "tracking lost {{user}}",
      "injury caretaking in wild",
      "teaching {{user}} survival",
      "{{user}} teaches them to rest",
      "watching the fire together",
      "night watch confession",
      "safe camp domesticity",
      "water sharing intimacy",
      "last ration shared",
      "rescued from disaster",
      "evacuation together",
      "survivor guilt comfort",
      "home after survival",
      "learning to live, not just survive",
    ],
  },
  {
    category: "Gate",
    prefix: "survival_skill_gate",
    guidance:
      "Use this as survival progression texture. Danger, shelter, rationing, rest, help, guilt, and homecoming may mark relationship development.",
    values: [
      "first danger assessment gate",
      "first lost together gate",
      "first firemaking gate",
      "first shelter building gate",
      "first shared ration gate",
      "first night watch gate",
      "first injury in wild gate",
      "first rescue gate",
      "first survivor guilt reveal gate",
      "first accepts help gate",
      "first teaches {{user}} gate",
      "first rests with {{user}} gate",
      "first safe camp gate",
      "first storm survival gate",
      "first escape route gate",
      "survival to trust gate",
      "trust to rest gate",
      "safe with you gate",
      "living not surviving gate",
      "home after wilderness route",
    ],
  },
  {
    category: "Mastery",
    prefix: "survival_skill_mastery",
    guidance:
      "Use this as survival mastery texture. Training, field experience, rescue work, specialist knowledge, and lived survival may calibrate competence and cost.",
    values: [
      "survival novice",
      "prepared amateur",
      "field trained",
      "scout trained",
      "military survival trained",
      "wilderness expert",
      "urban survival expert",
      "frontier veteran",
      "disaster response trained",
      "search and rescue trained",
      "expedition leader",
      "mountain guide",
      "desert guide",
      "arctic guide",
      "colony survival specialist",
      "space survival specialist",
      "self-taught survivor",
      "battlefield survivor",
      "disaster survivor",
      "legendary survivalist",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "survival_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "Stay close. The weather is turning.",
      "You always know when danger is coming.",
      "No. I just learned to listen before it arrives.",
      "You packed all this?",
      "Prepared is better than sorry.",
      "Prepared is heavier.",
      "So is regret.",
      "I can keep going.",
      "You can. You should not have to.",
      "You gave me the last ration.",
      "You noticed.",
      "I notice when someone tries to disappear for my sake.",
      "You sleep like the world might attack you.",
      "It has before.",
      "Let me take watch.",
      "I do not know how to sleep while someone else guards me.",
      "Then learn with me.",
      "Surviving is not the same as living.",
      "I know.",
      "Do you?",
      "I am starting to. With you.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "survival_skill_high_value",
    guidance:
      "Use this as a high-signal survival seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "wilderness survival",
      "urban survival",
      "tracking",
      "navigation",
      "foraging",
      "firemaking",
      "shelter building",
      "first aid",
      "emergency medicine",
      "resourcefulness",
      "escape and evasion",
      "danger assessment",
      "rationing",
      "storm survival",
      "space survival",
      "survival mode",
      "survivor guilt",
      "survival partners to lovers",
      "shared body heat",
      "living not surviving gate",
    ],
  },
] satisfies readonly SurvivalSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: SurvivalSkillSeedGroup, value: string): SurvivalSkillPreset => ({
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

export const SURVIVAL_SKILL_PRESETS = SURVIVAL_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const SURVIVAL_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(SURVIVAL_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getSurvivalSkillPresetsByCategory = (category: SurvivalSkillPresetCategory) =>
  SURVIVAL_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findSurvivalSkillPresetById = (id: string) =>
  SURVIVAL_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileSurvivalSkillPresetAdditions = (
  preset: SurvivalSkillPreset,
): CompiledSurvivalSkillPresetAdditions => ({
  backgroundAddition: `Survival skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Survival texture may include ${preset.value} without replacing the character's full personality, tenderness, limits, contradictions, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft survival context.`,
    "Let resourcefulness, danger assessment, scarcity, rescue, rest, or recovery shape behaviour when relevant.",
    "Keep consent, boundaries, and {{user}} autonomy intact; crisis pressure should not erase agency, and survival mode should not become the whole romance.",
  ].join(" "),
});
