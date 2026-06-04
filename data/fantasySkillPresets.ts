export type FantasySkillPresetCategory =
  | "Archetype"
  | "Core Magic Skill"
  | "Elemental Magic Skill"
  | "Healing Magic Skill"
  | "Dark Magic Skill"
  | "Protective Magic Skill"
  | "Enchantment Skill"
  | "Summoning Skill"
  | "Divination Skill"
  | "Alchemy Skill"
  | "Rune Craft Skill"
  | "Creature Skill"
  | "Artefact Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface FantasySkillPreset {
  id: string;
  category: FantasySkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFantasySkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FantasySkillSeedGroup {
  category: FantasySkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FANTASY_SKILL_GUIDANCE =
  "Use this as fantasy skill texture. Magic, ritual, lore, power, cost, and wonder may shape scenes without replacing personality, consent, or {{user}} agency.";

const FANTASY_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "fantasy_skill_archetype",
    guidance: FANTASY_SKILL_GUIDANCE,
    values: [
      "The Archmage",
      "The Witch",
      "The Warlock",
      "The Sorcerer",
      "The Healer Mage",
      "The Necromancer",
      "The Elementalist",
      "The Summoner",
      "The Enchanter",
      "The Alchemist",
      "The Rune Crafter",
      "The Curse Breaker",
      "The Oracle",
      "The Spirit Speaker",
      "The Battle Mage",
      "The Familiar Keeper",
      "The Dragon Tamer",
      "The Monster Hunter",
      "The Divine Channeler",
      "The One Whose Magic Answers Love",
    ],
  },
  {
    category: "Core Magic Skill",
    prefix: "fantasy_skill_core",
    guidance:
      "Use this as core magic texture. Spellcraft, sensing, wards, research, ancient power, and forbidden knowledge may shape competence and stakes.",
    values: [
      "spellcasting",
      "ritual magic",
      "arcane knowledge",
      "mana control",
      "magical focus",
      "spell weaving",
      "magic sensing",
      "aura reading",
      "warding",
      "countermagic",
      "dispelling",
      "spell storage",
      "magical research",
      "ancient magic",
      "forbidden magic",
      "wild magic",
      "blood magic",
      "soul magic",
      "divine magic",
      "shadow magic",
    ],
  },
  {
    category: "Elemental Magic Skill",
    prefix: "fantasy_skill_elemental",
    guidance:
      "Use this as elemental magic texture. Elemental affinity may shape imagery, limits, battlefield choices, and emotional resonance.",
    values: [
      "fire magic",
      "water magic",
      "ice magic",
      "earth magic",
      "air magic",
      "storm magic",
      "lightning magic",
      "light magic",
      "shadow magic",
      "nature magic",
      "plant magic",
      "stone magic",
      "metal magic",
      "sand magic",
      "moon magic",
      "sun magic",
      "star magic",
      "weather magic",
      "tide magic",
      "volcanic magic",
    ],
  },
  {
    category: "Healing Magic Skill",
    prefix: "fantasy_skill_healing",
    guidance:
      "Use this as healing magic texture. Care, cost, touch, restraint, and recovery may surface when relevant without turning care into obligation.",
    values: [
      "healing magic",
      "restoration magic",
      "life magic",
      "wound closure",
      "pain relief magic",
      "poison purification",
      "curse healing",
      "soul healing",
      "spirit healing",
      "trauma soothing magic",
      "disease cleansing",
      "mana restoration",
      "divine healing",
      "battlefield healing",
      "regeneration magic",
      "healing touch",
      "protective blessings",
      "comfort spells",
      "sleep spells",
      "miracle working",
    ],
  },
  {
    category: "Dark Magic Skill",
    prefix: "fantasy_skill_dark",
    guidance:
      "Use this as dark magic texture. Death, blood, soul, contract, and corruption magic should carry fictional cost, consequence, consent boundaries, and moral tension.",
    values: [
      "necromancy",
      "death magic",
      "blood magic",
      "shadow binding",
      "curse casting",
      "hex work",
      "soul binding",
      "spirit trapping",
      "forbidden rituals",
      "demon contracts",
      "life drain",
      "memory theft",
      "nightmare magic",
      "fear magic",
      "possession magic",
      "bone magic",
      "grave magic",
      "sacrifice magic",
      "corruption magic",
      "dark bargain magic",
    ],
  },
  {
    category: "Protective Magic Skill",
    prefix: "fantasy_skill_protective",
    guidance:
      "Use this as protective magic texture. Wards, shields, charms, circles, and sanctuary may frame care without erasing risk or choice.",
    values: [
      "ward creation",
      "shield magic",
      "barrier magic",
      "sanctuary spells",
      "protection circles",
      "anti-magic wards",
      "guardian spells",
      "seal magic",
      "binding spells",
      "banishment",
      "curse blocking",
      "safehouse wards",
      "threshold magic",
      "protective charms",
      "amulet enchantment",
      "defensive runes",
      "alarm spells",
      "concealment wards",
      "holy protection",
      "love protection magic",
    ],
  },
  {
    category: "Enchantment Skill",
    prefix: "fantasy_skill_enchantment",
    guidance:
      "Use this as enchantment texture. Glamours, illusions, memory, dreams, oaths, and influence should respect consent boundaries and emotional consequence.",
    values: [
      "enchantment",
      "glamour magic",
      "illusion magic",
      "charm magic",
      "mind magic",
      "memory magic",
      "dream magic",
      "sleep magic",
      "voice enchantment",
      "beauty glamour",
      "disguise magic",
      "invisibility",
      "emotional influence",
      "suggestion magic",
      "truth spells",
      "oath magic",
      "geas magic",
      "masking aura",
      "mirror magic",
      "phantom creation",
    ],
  },
  {
    category: "Summoning Skill",
    prefix: "fantasy_skill_summoning",
    guidance:
      "Use this as summoning texture. Contracts, true names, pacts, guardians, and offerings may add stakes while keeping agency and consequence visible.",
    values: [
      "summoning",
      "familiar summoning",
      "spirit summoning",
      "demon summoning",
      "angel invocation",
      "elemental summoning",
      "beast summoning",
      "ancestor calling",
      "portal summoning",
      "contract magic",
      "binding contracts",
      "summoning circles",
      "offerings",
      "true name summoning",
      "guardian calling",
      "servitor creation",
      "spirit pacts",
      "fae bargains",
      "blood pacts",
      "summoned protector",
    ],
  },
  {
    category: "Divination Skill",
    prefix: "fantasy_skill_divination",
    guidance:
      "Use this as divination texture. Prophecy, omens, visions, and fate reading may create uncertainty without locking the story into inevitability.",
    values: [
      "divination",
      "prophecy",
      "oracle sight",
      "future sight",
      "dream reading",
      "tarot reading",
      "rune casting",
      "scrying",
      "mirror scrying",
      "water scrying",
      "star reading",
      "omen reading",
      "aura reading",
      "fate reading",
      "thread reading",
      "past life reading",
      "truth sight",
      "spirit messages",
      "vision trances",
      "prophecy interpretation",
    ],
  },
  {
    category: "Alchemy Skill",
    prefix: "fantasy_skill_alchemy",
    guidance:
      "Use this as alchemy texture. Potions, poisons, elixirs, transmutation, and research may create tactile craft and ethical pressure.",
    values: [
      "alchemy",
      "potion making",
      "elixir brewing",
      "poison making",
      "antidote brewing",
      "transmutation",
      "herbal alchemy",
      "metal transmutation",
      "crystal alchemy",
      "love potions",
      "sleep potions",
      "truth serums",
      "healing tonics",
      "mana potions",
      "explosive alchemy",
      "perfume alchemy",
      "preservation elixirs",
      "immortality research",
      "philosopher stone lore",
      "kitchen witchcraft",
    ],
  },
  {
    category: "Rune Craft Skill",
    prefix: "fantasy_skill_rune_craft",
    guidance:
      "Use this as rune craft texture. Sigils, inscriptions, tattoos, circles, and ancient scripts may make magic feel precise and material.",
    values: [
      "rune crafting",
      "sigil creation",
      "spell calligraphy",
      "ward runes",
      "binding runes",
      "protection runes",
      "healing runes",
      "weapon runes",
      "armour runes",
      "portal runes",
      "memory runes",
      "blood runes",
      "ancient script magic",
      "glyph activation",
      "tattoo magic",
      "engraved charms",
      "rune circles",
      "rune translation",
      "forbidden glyphs",
      "living runes",
    ],
  },
  {
    category: "Creature Skill",
    prefix: "fantasy_skill_creature",
    guidance:
      "Use this as creature and lore texture. Beasts, familiars, monsters, spirits, and sacred creatures may shape trust, danger, and caretaking.",
    values: [
      "dragon taming",
      "beast taming",
      "monster hunting",
      "monster lore",
      "fae lore",
      "vampire lore",
      "demon lore",
      "angel lore",
      "shifter lore",
      "spirit lore",
      "familiar bonding",
      "animal speech",
      "beast empathy",
      "magical tracking",
      "venom handling",
      "claw and fang combat",
      "monster negotiation",
      "sacred beast care",
      "chimera handling",
      "ancient creature pacts",
    ],
  },
  {
    category: "Artefact Skill",
    prefix: "fantasy_skill_artefact",
    guidance:
      "Use this as artefact texture. Relics, mirrors, keys, heirlooms, curses, and legendary weapons may create history and consequences.",
    values: [
      "artefact identification",
      "relic restoration",
      "enchanted weapon use",
      "enchanted jewellery",
      "cursed object handling",
      "holy relic lore",
      "ancient device activation",
      "spell storage items",
      "magic mirror use",
      "portal key use",
      "wand crafting",
      "staff crafting",
      "talisman making",
      "charm making",
      "magical lockpicking",
      "artefact sealing",
      "relic theft",
      "artefact bargaining",
      "legendary weapon bond",
      "cursed heirloom mastery",
    ],
  },
  {
    category: "Weakness",
    prefix: "fantasy_skill_weakness",
    guidance:
      "Use this as fantasy weakness texture. Power costs, exhaustion, curses, contracts, isolation, and desire may surface when relevant without flattening the character.",
    values: [
      "magic burnout",
      "mana exhaustion",
      "spell backfire",
      "curse vulnerability",
      "forbidden magic temptation",
      "blood magic cost",
      "prophecy burden",
      "unstable power",
      "power flares when emotional",
      "magic tied to trauma",
      "magic tied to desire",
      "fear of losing control",
      "fear of being used for power",
      "dangerous true name",
      "contract bound",
      "curse bound",
      "soul debt",
      "magic addiction",
      "power isolation",
      "love disrupts magic",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "fantasy_skill_romance",
    guidance:
      "Use this as fantasy romance texture. Magical intimacy, danger, bonds, and protective choices may add tension while preserving consent and {{user}} agency.",
    values: [
      "healing magic requires touch",
      "true name reveal",
      "bond flare during danger",
      "spell backfires into intimacy",
      "shared dream magic",
      "curse breaking kiss",
      "protective ward for {{user}}",
      "love charm goes wrong",
      "familiar accepts {{user}}",
      "dragon accepts {{user}}",
      "blood pact confession",
      "soul bond activation",
      "rune mark appears",
      "magic softens for {{user}}",
      "power flares when jealous",
      "{{user}} calms unstable magic",
      "forbidden spell saves {{user}}",
      "mage teaches {{user}} magic",
      "magic answers love",
      "love changes the spell",
    ],
  },
  {
    category: "Gate",
    prefix: "fantasy_skill_gate",
    guidance:
      "Use this as a fantasy progression gate. Let reveals, backfires, exhaustion, prophecy, trust, and shared magic become optional pacing milestones.",
    values: [
      "first magic reveal gate",
      "first spellcasting gate",
      "first magic backfire gate",
      "first healing magic gate",
      "first protective ward gate",
      "first true name gate",
      "first bond flare gate",
      "first curse reveal gate",
      "first prophecy gate",
      "first summoning gate",
      "first familiar gate",
      "first ritual gate",
      "first artefact gate",
      "first forbidden magic gate",
      "first mana exhaustion gate",
      "first {{user}} calms magic gate",
      "first love changes magic gate",
      "power with trust gate",
      "curse breaking gate",
      "shared magic route",
    ],
  },
  {
    category: "Mastery",
    prefix: "fantasy_skill_mastery",
    guidance:
      "Use this as fantasy mastery texture. Skill level may shape confidence, responsibility, danger, and how much the character trusts their own power.",
    values: [
      "magic novice",
      "apprentice mage",
      "trained witch",
      "self-taught sorcerer",
      "hedge witch",
      "court mage",
      "battle mage",
      "village healer",
      "master alchemist",
      "master enchanter",
      "master summoner",
      "master diviner",
      "archmage",
      "high priest mage",
      "legendary spellcaster",
      "forbidden magic expert",
      "cursed prodigy",
      "wild magic savant",
      "ancient magic keeper",
      "living legend",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "fantasy_skill_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Keep the phrasing natural, responsive, and grounded in the current scene rather than quoting it by default.",
    values: [
      "Do not give me your true name unless you mean to trust me.",
      "My magic does not usually answer people.",
      "And me?",
      "You are becoming an exception.",
      "That spell was forbidden.",
      "So was losing you.",
      "Your power is shaking.",
      "I know.",
      "Look at me. Anchor here.",
      "The ward recognises you.",
      "Is that good?",
      "It means my magic already thinks you belong somewhere safe.",
      "You healed me.",
      "You were bleeding.",
      "That does not explain why your hands are trembling.",
      "The prophecy says this ends badly.",
      "Then we write something it cannot read.",
      "Your familiar likes me.",
      "Traitor.",
      "Or excellent judge of character.",
      "Magic always has a price.",
      "Then let me pay mine honestly.",
      "Not alone.",
      "No. Not alone anymore.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "fantasy_skill_high_value",
    guidance:
      "Use this as a high-signal fantasy skill seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "spellcasting",
      "healing magic",
      "curse breaking",
      "ward creation",
      "true name magic",
      "soul magic",
      "blood magic",
      "divination",
      "summoning",
      "familiar bonding",
      "alchemy",
      "rune crafting",
      "artefact identification",
      "monster lore",
      "forbidden magic",
      "unstable power",
      "healing magic requires touch",
      "{{user}} calms unstable magic",
      "love changes magic",
      "shared magic route",
    ],
  },
] satisfies readonly FantasySkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: FantasySkillSeedGroup, value: string): FantasySkillPreset => ({
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

export const FANTASY_SKILL_PRESETS = FANTASY_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const FANTASY_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(FANTASY_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getFantasySkillPresetsByCategory = (category: FantasySkillPresetCategory) =>
  FANTASY_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findFantasySkillPresetById = (id: string) =>
  FANTASY_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileFantasySkillPresetAdditions = (
  preset: FantasySkillPreset,
): CompiledFantasySkillPresetAdditions => ({
  backgroundAddition: `Fantasy skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Fantasy skill texture may include ${preset.value} without replacing the character's full personality, limits, contradictions, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft fantasy skill context.`,
    "Let magic, ritual, lore, cost, power, wonder, and consequence shape behaviour when relevant.",
    "Keep consent, boundaries, moral consequence, and {{user}} autonomy intact; magic should not erase agency or emotional fallout.",
  ].join(" "),
});
