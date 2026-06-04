export type SettingSubtypePresetCategory =
  | "Preset"
  | "Setting Subtype"
  | "Settlement Subtype"
  | "Institutional Subtype"
  | "Fantasy Subtype"
  | "Sci-Fi Subtype"
  | "Romance Location"
  | "Conflict Pressure"
  | "Romance Hook"
  | "Gate"
  | "High-Value Setting Tag";

export interface SettingSubtypePreset {
  id: string;
  category: SettingSubtypePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSettingSubtypePresetAdditions {
  backgroundAddition: string;
  scenarioAddition: string;
  systemPromptAddition: string;
}

interface SettingSubtypeSeedGroup {
  category: SettingSubtypePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SETTING_SUBTYPE_GUIDANCE =
  "Use this as optional setting texture. Place may shape customs, privacy, danger, routine, status, and romance pressure without trapping the scene, flattening the characters, or overriding {{user}} agency.";

const SETTING_SUBTYPE_SEED_GROUPS = Object.freeze([
  {
    category: "Preset",
    prefix: "setting_subtype_preset",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "Cozy Small Town",
      "Bustling Capital City",
      "Royal Court",
      "Noble Estate",
      "Dark Academy",
      "Elite University",
      "Corporate Tower",
      "Underground City",
      "Underworld District",
      "Seaside Village",
      "Frontier Colony",
      "Space Station",
      "Starship",
      "Terraforming Colony",
      "Fae Court",
      "Vampire Court",
      "Mage Tower",
      "Haunted Manor",
      "War Camp",
      "Safehouse",
    ],
  },
  {
    category: "Setting Subtype",
    prefix: "setting_subtype",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "small town",
      "village",
      "capital city",
      "port city",
      "market town",
      "frontier town",
      "seaside town",
      "mountain village",
      "forest settlement",
      "desert oasis",
      "royal court",
      "imperial palace",
      "noble estate",
      "country manor",
      "castle",
      "fortress",
      "academy",
      "university",
      "college",
      "boarding school",
      "dark academia campus",
      "corporate office",
      "hospital",
      "law firm",
      "restaurant",
      "coffee shop",
      "bookstore",
      "theatre",
      "museum",
      "library",
      "underworld district",
      "black market",
      "safehouse",
      "nightclub",
      "hidden society",
      "temple",
      "monastery",
      "church",
      "shrine",
      "pilgrimage town",
      "military base",
      "war camp",
      "border outpost",
      "research lab",
      "science facility",
      "space station",
      "starship",
      "colony world",
      "terraforming colony",
      "orbital city",
      "cyberpunk megacity",
      "futuristic arcology",
      "fae court",
      "vampire court",
      "mage tower",
      "witch cottage",
      "enchanted forest",
      "cursed castle",
      "haunted manor",
      "dragon lair",
      "monster territory",
      "portal world",
    ],
  },
  {
    category: "Settlement Subtype",
    prefix: "settlement_subtype",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "hamlet",
      "village",
      "town",
      "small town",
      "market town",
      "capital city",
      "metropolis",
      "megacity",
      "port city",
      "walled city",
      "floating city",
      "underground city",
      "sky city",
      "frontier colony",
      "mining town",
      "fishing village",
      "farming village",
      "nomadic camp",
      "caravan stop",
      "refugee settlement",
    ],
  },
  {
    category: "Institutional Subtype",
    prefix: "institutional_subtype",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "academy",
      "college",
      "university",
      "boarding school",
      "military academy",
      "magic school",
      "research institute",
      "hospital",
      "clinic",
      "law court",
      "guildhall",
      "corporate headquarters",
      "government office",
      "embassy",
      "temple complex",
      "monastery",
      "library archive",
      "museum",
      "theatre house",
      "training facility",
    ],
  },
  {
    category: "Fantasy Subtype",
    prefix: "fantasy_setting_subtype",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "fae court",
      "vampire court",
      "demon realm",
      "angelic city",
      "witch coven",
      "mage tower",
      "enchanted forest",
      "cursed kingdom",
      "dragon territory",
      "monster market",
      "portal realm",
      "spirit world",
      "floating islands",
      "ancient ruins",
      "forbidden temple",
      "magical academy",
      "royal castle",
      "oracle sanctuary",
      "undersea kingdom",
      "shadow city",
    ],
  },
  {
    category: "Sci-Fi Subtype",
    prefix: "sci_fi_setting_subtype",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "space station",
      "starship",
      "generation ship",
      "orbital city",
      "moon base",
      "Mars colony",
      "terraforming colony",
      "research outpost",
      "corporate arcology",
      "cyberpunk megacity",
      "AI-controlled city",
      "alien capital",
      "trade nexus",
      "black market station",
      "prison colony",
      "deep space lab",
      "salvage yard orbit",
      "military fleet",
      "luxury orbital",
      "last human city",
    ],
  },
  {
    category: "Romance Location",
    prefix: "romance_setting_subtype",
    guidance: SETTING_SUBTYPE_GUIDANCE,
    values: [
      "shared apartment",
      "one-bed inn",
      "safehouse",
      "workplace",
      "office after hours",
      "college campus",
      "academy dormitory",
      "library corner",
      "coffee shop",
      "bookstore",
      "hospital night shift",
      "restaurant kitchen",
      "royal ballroom",
      "secret garden",
      "carriage ride",
      "storm shelter",
      "cabin in the woods",
      "beach house",
      "road trip car",
      "observation deck",
    ],
  },
  {
    category: "Conflict Pressure",
    prefix: "setting_subtype_conflict",
    guidance:
      "Use this as place-based pressure. The setting may add secrecy, danger, scrutiny, scarcity, or public tension, but it should create context rather than remove consent, choice, privacy, or repair.",
    values: [
      "isolated setting",
      "public setting with private tension",
      "strict-rules setting",
      "surveillance-heavy setting",
      "dangerous district",
      "class-divided setting",
      "status-sensitive setting",
      "resource-scarce setting",
      "war-torn setting",
      "politically charged setting",
      "religiously restrictive setting",
      "forbidden zone",
      "haunted location",
      "cursed location",
      "hostile environment",
      "closed community",
      "gossip-heavy town",
      "corporate-controlled space",
      "underworld territory",
      "lawless frontier",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "setting_subtype_hook",
    guidance:
      "Use this as setting-linked romance setup. The place may create proximity, secrecy, longing, ritual, rescue, or survival pressure while keeping the relationship responsive to boundaries and {{user}} choices.",
    values: [
      "small town gossip forces closeness",
      "royal court secret glances",
      "academy rivals study late",
      "office after-hours confession",
      "safehouse forced proximity",
      "storm shelter one bed",
      "library corner slow burn",
      "coffee shop regular flirting",
      "space station life-support confession",
      "starship observation deck romance",
      "fae court dance",
      "vampire court blood oath",
      "haunted manor hurt comfort",
      "underworld safehouse rescue",
      "frontier colony survival partners",
      "noble estate scandal",
      "seaside village second chance",
      "dark academia secret society",
      "cyberpunk megacity escape",
      "home built in a hostile place",
    ],
  },
  {
    category: "Gate",
    prefix: "setting_subtype_gate",
    guidance:
      "Use this as an optional setting gate. Place-based gates should unlock when arrival, rules, privacy, danger, escape, belonging, or home has been earned in-scene.",
    values: [
      "first arrival gate",
      "first place reveal gate",
      "first rule of setting gate",
      "first public tension gate",
      "first private corner gate",
      "first forced-proximity gate",
      "first safehouse gate",
      "first gossip gate",
      "first danger-zone gate",
      "first secret-location gate",
      "first escape-route gate",
      "first home-feeling gate",
      "setting becomes safe gate",
      "place as relationship gate",
      "home built here route",
    ],
  },
  {
    category: "High-Value Setting Tag",
    prefix: "setting_subtype_high_value",
    guidance:
      "Use this as a high-signal setting tag for character creation, matching, scenario routing, and preset search.",
    values: [
      "small town",
      "capital city",
      "royal court",
      "noble estate",
      "academy",
      "university",
      "corporate office",
      "hospital",
      "underworld district",
      "safehouse",
      "space station",
      "starship",
      "terraforming colony",
      "cyberpunk megacity",
      "fae court",
      "vampire court",
      "mage tower",
      "haunted manor",
      "storm shelter one bed",
      "home built here route",
    ],
  },
] satisfies readonly SettingSubtypeSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const triggerParts = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length > 2);

const makePreset = (
  group: SettingSubtypeSeedGroup,
  value: string,
): SettingSubtypePreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(new Set([value, ...triggerParts(value)])),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

export const SETTING_SUBTYPE_PRESETS = SETTING_SUBTYPE_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const SETTING_SUBTYPE_PRESET_CATEGORIES = Array.from(
  new Set(SETTING_SUBTYPE_PRESETS.map((preset) => preset.category)),
).sort();

export const getSettingSubtypePresetsByCategory = (
  category: SettingSubtypePresetCategory,
) => SETTING_SUBTYPE_PRESETS.filter((preset) => preset.category === category);

export const findSettingSubtypePresetById = (id: string) =>
  SETTING_SUBTYPE_PRESETS.find((preset) => preset.id === id);

export const compileSettingSubtypePresetAdditions = (
  preset: SettingSubtypePreset,
): CompiledSettingSubtypePresetAdditions => ({
  backgroundAddition: `Setting context: ${preset.value}. ${preset.guidance}`,
  scenarioAddition: `Setting subtype may include ${preset.value}, shaping place pressure, privacy, routines, social rules, sensory anchors, and relationship pacing without trapping the scene.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft setting context.`,
    "Let it influence atmosphere, movement, social pressure, danger, intimacy, and home-building when relevant.",
    "Keep consent, boundaries, privacy, repair, character agency, and {{user}} agency intact; place should guide scenes without scripting outcomes.",
  ].join(" "),
});
