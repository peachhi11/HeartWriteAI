export type TradeSkillPresetCategory =
  | "Archetype"
  | "Trade Skill"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface TradeSkillPreset {
  id: string;
  category: TradeSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledTradeSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface TradeSkillSeedGroup {
  category: TradeSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const TRADE_SKILL_GUIDANCE =
  "Use this as trade skill texture. Practical skill, tools, repair, labour, apprenticeship, workshop culture, and hands-on competence may shape scenes without replacing personality, consent, or {{user}} agency.";

const TRADE_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "trade_skill_archetype",
    guidance: TRADE_SKILL_GUIDANCE,
    values: [
      "The Blacksmith",
      "The Carpenter",
      "The Electrician",
      "The Plumber",
      "The Mechanic",
      "The Mason",
      "The Welder",
      "The Tailor",
      "The Baker",
      "The Butcher",
      "The Barber",
      "The Cobbler",
      "The Roofer",
      "The Locksmith",
      "The Shipwright",
      "The Farrier",
      "The Potter",
      "The Weaver",
      "The Glassworker",
      "The Master Craftsperson",
    ],
  },
  {
    category: "Trade Skill",
    prefix: "trade_skill_seed",
    guidance:
      "Use this as trade texture. Hands-on work, construction, repair, fabrication, service, and workshop skill may ground competence and class context.",
    values: [
      "trades",
      "skilled trade",
      "manual trade",
      "craft trade",
      "artisan trade",
      "guild trade",
      "apprenticeship trade",
      "blue collar skill",
      "hands-on work",
      "practical skill",
      "tool mastery",
      "repair work",
      "maintenance work",
      "construction work",
      "fabrication",
      "restoration work",
      "workshop skill",
      "field work",
      "service trade",
      "family trade",
      "carpentry",
      "joinery",
      "cabinetmaking",
      "furniture making",
      "woodworking",
      "wood carving",
      "framing",
      "flooring",
      "roofing",
      "thatching",
      "masonry",
      "bricklaying",
      "stonework",
      "plastering",
      "tiling",
      "painting houses",
      "glazing",
      "insulation work",
      "scaffolding",
      "construction labour",
      "blacksmithing",
      "weaponsmithing",
      "armoursmithing",
      "metalworking",
      "welding",
      "machining",
      "toolmaking",
      "locksmithing",
      "clockmaking",
      "watch repair",
      "jewellery repair",
      "engraving",
      "sheet metal work",
      "foundry work",
      "boiler making",
      "farriery",
      "blade sharpening",
      "mechanical repair",
      "engine repair",
      "vehicle maintenance",
      "plumbing",
      "pipefitting",
      "steamfitting",
      "well digging",
      "water system repair",
      "sewer maintenance",
      "heating repair",
      "HVAC",
      "ventilation work",
      "refrigeration repair",
      "electrical work",
      "wiring",
      "lighting installation",
      "generator repair",
      "solar installation",
      "elevator repair",
      "appliance repair",
      "radio repair",
      "communications repair",
      "industrial maintenance",
      "tailoring",
      "sewing",
      "dressmaking",
      "shoemaking",
      "cobbling",
      "leatherworking",
      "saddlemaking",
      "upholstery",
      "weaving",
      "spinning",
      "dyeing",
      "embroidery",
      "mending",
      "laundry work",
      "millinery",
      "hat making",
      "costume construction",
      "textile repair",
      "blanket making",
      "rope making",
      "baking",
      "butchery",
      "brewing",
      "distilling",
      "cheesemaking",
      "candlemaking",
      "soapmaking",
      "tanning",
      "pottery",
      "ceramics",
      "glassblowing",
      "stained glass",
      "bookbinding",
      "printing",
      "paper making",
      "basket weaving",
      "floristry",
      "gardening trade",
      "beekeeping",
      "fishmongering",
      "shipwright",
      "sailmaking",
      "net mending",
      "cartwright",
      "wheelwright",
      "wagon repair",
      "stable work",
      "horse training",
      "farming trade",
      "ranch work",
      "logging",
      "sawmill work",
      "mining",
      "quarrying",
      "railway maintenance",
      "road work",
      "dock work",
      "warehouse work",
      "market stall work",
      "inn maintenance",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "trade_skill_romance",
    guidance:
      "Use this as trade romance texture. Repairs, tools, teaching, late shifts, handmade gifts, and shared projects may become intimacy while preserving boundaries.",
    values: [
      "repairs {{user}} home",
      "fixes {{user}} car",
      "makes {{user}} furniture",
      "mends {{user}} clothes",
      "forges {{user}} ring",
      "builds safe place",
      "works late in shop",
      "teaches {{user}} trade",
      "hands brush over tools",
      "injured hands caretaking",
      "workshop slow burn",
      "family trade pressure",
      "apprentice master tension",
      "gift made by hand",
      "love shown through repairs",
      "home built together",
      "blue collar protector",
      "quiet provider romance",
      "craft as love language",
      "ordinary work becomes intimate",
    ],
  },
  {
    category: "Gate",
    prefix: "trade_skill_gate",
    guidance:
      "Use this as a trade progression gate. Let workshops, tools, repairs, teaching, late shifts, family trade pressure, and shared projects become optional milestones.",
    values: [
      "first workshop gate",
      "first tool use gate",
      "first repair gate",
      "first teaching gate",
      "first handmade gift gate",
      "first injured hands gate",
      "first late shift gate",
      "first family trade gate",
      "first apprenticeship gate",
      "first mastery reveal gate",
      "first {{user}} admires work gate",
      "first work failure gate",
      "first builds for {{user}} gate",
      "first craft as apology gate",
      "first shared project gate",
      "hands as intimacy gate",
      "work as love language gate",
      "home built together gate",
      "pride in work gate",
      "shared life route",
    ],
  },
  {
    category: "Mastery",
    prefix: "trade_skill_mastery",
    guidance:
      "Use this as trade mastery texture. Apprenticeship, licensing, guilds, unions, family trade, and field expertise may shape pride and pressure.",
    values: [
      "trade apprentice",
      "junior tradesperson",
      "journeyman",
      "skilled tradesperson",
      "licensed tradesperson",
      "certified technician",
      "master craftsperson",
      "guild master",
      "union worker",
      "self-employed tradesperson",
      "family trade heir",
      "retired master",
      "village craftsperson",
      "royal artisan",
      "shipyard veteran",
      "factory specialist",
      "field repair expert",
      "one-person repair crew",
      "legendary builder",
      "hands that can fix anything",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "trade_skill_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "I fixed it.",
      "You always say that like it is simple.",
      "It is easier than saying I care.",
      "Your hands are rough.",
      "They have had work to do.",
      "They can be gentle too.",
      "You made this for me?",
      "It fit your room.",
      "That is not an answer.",
      "It fit you.",
      "Hold the light steady.",
      "Is this your idea of romance?",
      "No. Romance is when I pretend I do not like you watching me work.",
      "You work too hard.",
      "Things break if no one fixes them.",
      "People do too.",
      "This place was falling apart.",
      "And now?",
      "Now it has a reason to stand.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "trade_skill_high_value",
    guidance:
      "Use this as a high-signal trade skill seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "carpentry",
      "blacksmithing",
      "mechanic",
      "plumbing",
      "electrical work",
      "welding",
      "tailoring",
      "leatherworking",
      "baking",
      "masonry",
      "locksmithing",
      "shipwright",
      "woodworking",
      "metalworking",
      "repair work",
      "tool mastery",
      "family trade",
      "gift made by hand",
      "craft as love language",
      "home built together",
    ],
  },
] satisfies readonly TradeSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: TradeSkillSeedGroup, value: string): TradeSkillPreset => ({
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

export const TRADE_SKILL_PRESETS = TRADE_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const TRADE_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(TRADE_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getTradeSkillPresetsByCategory = (category: TradeSkillPresetCategory) =>
  TRADE_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findTradeSkillPresetById = (id: string) =>
  TRADE_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileTradeSkillPresetAdditions = (
  preset: TradeSkillPreset,
): CompiledTradeSkillPresetAdditions => ({
  backgroundAddition: `Trade skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Trade skill texture may include ${preset.value} without replacing the character's full personality, flaws, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft trade skill context.`,
    "Let tools, repair, labour, workshop rhythm, practical competence, family trade pressure, and tangible acts of care shape behaviour when relevant.",
    "Keep consent, boundaries, reciprocity, safety, and {{user}} autonomy intact; work should not become the whole character or a substitute for repair.",
  ].join(" "),
});
