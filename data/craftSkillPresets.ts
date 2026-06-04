export type CraftSkillPresetCategory =
  | "Archetype"
  | "Core Craft Skill"
  | "Textile Craft Skill"
  | "Wood Craft Skill"
  | "Metal Craft Skill"
  | "Clay Stone Glass Craft Skill"
  | "Paper Book Craft Skill"
  | "Leather Bone Natural Craft Skill"
  | "Domestic Craft Skill"
  | "Magical Craft Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface CraftSkillPreset {
  id: string;
  category: CraftSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCraftSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CraftSkillSeedGroup {
  category: CraftSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CRAFT_SKILL_GUIDANCE =
  "Use this as craft skill texture. Materials, tools, patient hands, repair, gifts, heritage craft, and practical artistry may shape scenes without replacing personality, consent, or {{user}} agency.";

const CRAFT_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "craft_skill_archetype",
    guidance: CRAFT_SKILL_GUIDANCE,
    values: [
      "The Master Artisan",
      "The Blacksmith",
      "The Tailor",
      "The Carpenter",
      "The Jeweller",
      "The Potter",
      "The Weaver",
      "The Leatherworker",
      "The Glassblower",
      "The Bookbinder",
      "The Clockmaker",
      "The Toymaker",
      "The Luthier",
      "The Candle Maker",
      "The Florist",
      "The Furniture Maker",
      "The Rune Artisan",
      "The Enchanted Crafter",
      "The Village Craftsperson",
      "The One Who Makes Love Tangible",
    ],
  },
  {
    category: "Core Craft Skill",
    prefix: "craft_skill_core",
    guidance:
      "Use this as core craft texture. Handwork, tools, material knowledge, patience, repair, restoration, and gifts may ground competence and care.",
    values: [
      "craft skill",
      "artisan skill",
      "handcrafting",
      "manual craft",
      "fine craft",
      "folk craft",
      "traditional craft",
      "heritage craft",
      "guild craft",
      "workshop skill",
      "maker skill",
      "repair skill",
      "restoration skill",
      "custom making",
      "practical artistry",
      "detail work",
      "material knowledge",
      "tool mastery",
      "patient hands",
      "craft as love language",
    ],
  },
  {
    category: "Textile Craft Skill",
    prefix: "craft_skill_textile",
    guidance:
      "Use this as textile craft texture. Sewing, tailoring, mending, weaving, embroidery, and fabric work may make care tactile and intimate.",
    values: [
      "sewing",
      "tailoring",
      "dressmaking",
      "embroidery",
      "weaving",
      "knitting",
      "crochet",
      "quilting",
      "lace making",
      "mending",
      "darning",
      "fabric dyeing",
      "pattern making",
      "costume construction",
      "tapestry weaving",
      "spinning thread",
      "loom work",
      "needlework",
      "ribbon work",
      "clothing alteration",
    ],
  },
  {
    category: "Wood Craft Skill",
    prefix: "craft_skill_wood",
    guidance:
      "Use this as wood craft texture. Carpentry, joinery, carving, repair, boats, instruments, and home-building may give scenes sturdy physicality.",
    values: [
      "woodworking",
      "carpentry",
      "furniture making",
      "wood carving",
      "cabinetmaking",
      "joinery",
      "whittling",
      "boatbuilding",
      "instrument making",
      "toy making",
      "woodturning",
      "frame making",
      "wood restoration",
      "house repair",
      "hand tool work",
      "fine joinery",
      "rustic craft",
      "hearth building",
      "shelving building",
      "cradle making",
    ],
  },
  {
    category: "Metal Craft Skill",
    prefix: "craft_skill_metal",
    guidance:
      "Use this as metal craft texture. Smithing, jewellery, locks, tools, blades, watches, and fine metalwork may add heat, precision, and legacy.",
    values: [
      "blacksmithing",
      "metalworking",
      "weaponsmithing",
      "armoursmithing",
      "jewellery making",
      "silversmithing",
      "goldsmithing",
      "coppersmithing",
      "tinsmithing",
      "welding",
      "engraving",
      "locksmithing",
      "clockmaking",
      "tool making",
      "blade sharpening",
      "chainmail making",
      "metal casting",
      "filigree work",
      "watch repair",
      "mechanical craft",
    ],
  },
  {
    category: "Clay Stone Glass Craft Skill",
    prefix: "craft_skill_clay_stone_glass",
    guidance:
      "Use this as clay, stone, and glass craft texture. Pottery, masonry, glass, gems, mosaics, and restoration may add weight and artistry.",
    values: [
      "pottery",
      "ceramics",
      "clay sculpting",
      "tile making",
      "mosaic work",
      "stone carving",
      "masonry",
      "gem cutting",
      "glassblowing",
      "stained glass",
      "glass etching",
      "bead making",
      "porcelain work",
      "kiln work",
      "glazing",
      "marble carving",
      "crystal carving",
      "statue restoration",
      "window craft",
      "ornamental stonework",
    ],
  },
  {
    category: "Paper Book Craft Skill",
    prefix: "craft_skill_paper_book",
    guidance:
      "Use this as paper and book craft texture. Binding, calligraphy, maps, archives, keepsakes, and love letters may make memory tangible.",
    values: [
      "bookbinding",
      "paper making",
      "calligraphy",
      "illumination",
      "printmaking",
      "letterpress",
      "mapmaking",
      "stationery making",
      "paper cutting",
      "origami",
      "scrapbooking",
      "journal making",
      "book restoration",
      "ink making",
      "seal carving",
      "wax seal work",
      "manuscript copying",
      "archival repair",
      "love letter presentation",
      "keepsake bookmaking",
    ],
  },
  {
    category: "Leather Bone Natural Craft Skill",
    prefix: "craft_skill_leather_bone_natural",
    guidance:
      "Use this as natural-material craft texture. Leather, bone, horn, shell, reed, rope, flowers, herbs, and dyes may ground craft in place and season.",
    values: [
      "leatherworking",
      "saddlemaking",
      "shoemaking",
      "glove making",
      "belt making",
      "bag making",
      "hide tanning",
      "fur work",
      "bone carving",
      "horn carving",
      "shell craft",
      "basket weaving",
      "reed work",
      "rope making",
      "net making",
      "feather work",
      "pressed flower art",
      "herb bundle making",
      "wreath making",
      "natural dyeing",
    ],
  },
  {
    category: "Domestic Craft Skill",
    prefix: "craft_skill_domestic",
    guidance:
      "Use this as domestic craft texture. Candles, soap, food preservation, scents, keepsakes, and home objects may turn care into everyday ritual.",
    values: [
      "candle making",
      "soap making",
      "perfume making",
      "incense making",
      "preserving food",
      "canning",
      "fermentation",
      "cheese making",
      "tea blending",
      "spice blending",
      "home decor craft",
      "curtain making",
      "blanket making",
      "hearth craft",
      "household repair",
      "holiday craft",
      "gift wrapping",
      "keepsake making",
      "memory box making",
      "comfort object making",
    ],
  },
  {
    category: "Magical Craft Skill",
    prefix: "craft_skill_magical",
    guidance:
      "Use this as magical craft texture. Runes, sigils, charms, talismans, enchanted objects, and protective craft may add wonder while preserving consent and consequence.",
    values: [
      "rune crafting",
      "sigil work",
      "spell calligraphy",
      "enchanted jewellery",
      "charm making",
      "talisman making",
      "amulet crafting",
      "wand crafting",
      "staff making",
      "potion bottle craft",
      "warded textiles",
      "protective embroidery",
      "living clay craft",
      "golem crafting",
      "enchanted weapon forging",
      "magic mirror making",
      "crystal setting",
      "spellbound bookbinding",
      "curse breaking craft",
      "love token enchantment",
    ],
  },
  {
    category: "Weakness",
    prefix: "craft_skill_weakness",
    guidance:
      "Use this as craft weakness texture. Perfectionism, poverty, hand injury, family trade pressure, grief, and hidden feelings may surface without flattening the character into their work.",
    values: [
      "perfectionism",
      "overworks hands",
      "hides feelings in work",
      "uses craft to avoid talking",
      "fear of work not being good enough",
      "impostor syndrome",
      "family trade pressure",
      "guild expectations",
      "injured hands",
      "lost commission wound",
      "mentor criticism wound",
      "burnout",
      "poverty through art",
      "underpaid labour",
      "craft as survival",
      "cannot discard flawed work",
      "attached to every piece",
      "afraid to gift work",
      "love hidden in objects",
      "hands remember grief",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "craft_skill_romance",
    guidance:
      "Use this as craft romance texture. Gifts, repairs, measurements, mending, charms, and handmade objects may imply care while preserving choice and boundaries.",
    values: [
      "makes gift for {{user}}",
      "repairs {{user}} belonging",
      "mends {{user}} clothes",
      "measures {{user}} for custom piece",
      "teaches {{user}} craft",
      "shared workshop slow burn",
      "hands brush over tools",
      "late night commission scene",
      "gift reveals feelings",
      "protective charm made for {{user}}",
      "ring forged by hand",
      "embroidered token",
      "carved keepsake",
      "bookbound love letters",
      "{{user}} wears their work",
      "unfinished piece reveals pining",
      "craft as apology",
      "craft as devotion",
      "home built by hand",
      "love made tangible",
    ],
  },
  {
    category: "Gate",
    prefix: "craft_skill_gate",
    guidance:
      "Use this as a craft progression gate. Let workshops, handmade gifts, repairs, teaching, failed pieces, injuries, and love hidden in objects become optional milestones.",
    values: [
      "first workshop gate",
      "first craft reveal gate",
      "first handmade gift gate",
      "first repair gate",
      "first teaching gate",
      "first {{user}} wears work gate",
      "first late night work gate",
      "first failed piece gate",
      "first perfectionism reveal gate",
      "first injured hands gate",
      "first craft as apology gate",
      "first protective token gate",
      "first custom piece gate",
      "first guild pressure gate",
      "first love hidden in object gate",
      "hands as intimacy gate",
      "craft as love language gate",
      "shared workshop gate",
      "home built by hand gate",
      "love made tangible route",
    ],
  },
  {
    category: "Mastery",
    prefix: "craft_skill_mastery",
    guidance:
      "Use this as craft mastery texture. Apprenticeship, guild status, village craft, heritage mastery, and reputation may shape confidence and pressure.",
    values: [
      "craft novice",
      "apprentice artisan",
      "guild apprentice",
      "journeyman crafter",
      "skilled artisan",
      "professional craftsperson",
      "master artisan",
      "guild master",
      "royal craftsperson",
      "village artisan",
      "self-taught maker",
      "folk craft keeper",
      "heritage craft master",
      "renowned smith",
      "renowned tailor",
      "master jeweller",
      "master bookbinder",
      "enchanted craft master",
      "forgotten master",
      "legendary artisan",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "craft_skill_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "You made this?",
      "For you.",
      "That sounds like more than an answer.",
      "It is.",
      "Hold still. I need the measurement.",
      "Your hands are shaking.",
      "You noticed.",
      "I notice when you are careful with me.",
      "It is not perfect.",
      "Neither am I. I still want it.",
      "You mended this.",
      "It mattered to you.",
      "So you fixed it?",
      "No. I made sure it could stay.",
      "You put a protection charm in the stitching.",
      "You were never supposed to notice.",
      "Why?",
      "Because then you would know how much I worry.",
      "Your hands make beautiful things.",
      "They have made mistakes too.",
      "Then let them make something gentle now.",
      "This is just a gift.",
      "No. This is what you say when words fail you.",
      "I built this place for shelter.",
      "And now?",
      "Now I think I was building somewhere you could come home to.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "craft_skill_high_value",
    guidance:
      "Use this as a high-signal craft skill seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "craft skill",
      "artisan skill",
      "sewing",
      "tailoring",
      "embroidery",
      "woodworking",
      "carpentry",
      "blacksmithing",
      "jewellery making",
      "leatherworking",
      "pottery",
      "bookbinding",
      "calligraphy",
      "candle making",
      "soap making",
      "rune crafting",
      "enchanted jewellery",
      "makes gift for {{user}}",
      "craft as love language gate",
      "love made tangible route",
    ],
  },
] satisfies readonly CraftSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: CraftSkillSeedGroup, value: string): CraftSkillPreset => ({
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

export const CRAFT_SKILL_PRESETS = CRAFT_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const CRAFT_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(CRAFT_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getCraftSkillPresetsByCategory = (category: CraftSkillPresetCategory) =>
  CRAFT_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findCraftSkillPresetById = (id: string) =>
  CRAFT_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileCraftSkillPresetAdditions = (
  preset: CraftSkillPreset,
): CompiledCraftSkillPresetAdditions => ({
  backgroundAddition: `Craft skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Craft skill texture may include ${preset.value} without replacing the character's full personality, flaws, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft craft skill context.`,
    "Let materials, tools, repair, gifts, handwork, workshop pressure, heritage craft, and tangible acts of care shape behaviour when relevant.",
    "Keep consent, boundaries, reciprocity, consequence, and {{user}} autonomy intact; craft should not become the whole character or a substitute for repair.",
  ].join(" "),
});
