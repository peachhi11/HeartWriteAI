export type CombatStylePresetCategory =
  | "Archetype"
  | "Style"
  | "Approach"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface CombatStylePreset {
  id: string;
  category: CombatStylePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCombatStylePresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CombatStyleSeedGroup {
  category: CombatStylePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const COMBAT_STYLE_GUIDANCE =
  "Use this as combat style texture. Fighting posture, restraint, danger, protection, fear, training, and aftermath may shape scenes without replacing personality, consent, or {{user}} agency.";

const COMBAT_STYLE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "combat_style_archetype",
    guidance: COMBAT_STYLE_GUIDANCE,
    values: [
      "The Defensive Protector",
      "The Elegant Duelist",
      "The Brutal Brawler",
      "The Silent Assassin",
      "The Tactical Soldier",
      "The Street Fighter",
      "The Berserker",
      "The Controlled Killer",
      "The Non-Lethal Defender",
      "The Agile Skirmisher",
      "The Heavy Hitter",
      "The Counterfighter",
      "The Trick Fighter",
      "The Bodyguard Shield",
      "The Marksman",
      "The Spellblade",
      "The Monster Hunter",
      "The Zero-G Fighter",
      "The Dirty Fighter",
      "The One Who Fights Only To Protect",
    ],
  },
  {
    category: "Style",
    prefix: "combat_style_seed",
    guidance:
      "Use this as fighting-style texture. The style may reveal discipline, survival history, restraint, intimidation, training, or protective instinct.",
    values: [
      "defensive style",
      "attack-focused style",
      "balanced style",
      "aggressive style",
      "reactive style",
      "protective style",
      "non-lethal style",
      "lethal style",
      "precise style",
      "brutal style",
      "elegant style",
      "disciplined style",
      "unpredictable style",
      "dirty fighting style",
      "honour-bound style",
      "pragmatic style",
      "improvised style",
      "ritualised style",
      "predatory style",
      "survival style",
      "duelist style",
      "fencer style",
      "swordmaster style",
      "shield wall style",
      "knife fighter style",
      "dual wield style",
      "archer style",
      "sniper style",
      "gunslinger style",
      "martial artist style",
      "boxer style",
      "grappler style",
      "street fighter style",
      "brawler style",
      "assassin style",
      "bodyguard style",
      "soldier style",
      "berserker style",
      "hunter style",
      "spellblade style",
      "close-quarters style",
      "ranged style",
      "hit and run style",
      "ambush style",
      "counterattack style",
      "evasion style",
      "disarming style",
      "crowd control style",
      "stealth combat style",
      "formation fighting style",
      "mounted combat style",
      "urban combat style",
      "battlefield style",
      "arena style",
      "duel to first blood style",
      "guardian stance",
      "last line of defence",
      "protect {{user}} first",
      "takes the hit",
      "ends fights fast",
    ],
  },
  {
    category: "Approach",
    prefix: "combat_style_approach",
    guidance:
      "Use this as combat approach texture. Tactics, restraint, pressure, timing, and protection may surface when relevant, with consequence and vulnerability visible.",
    values: [
      "waits for opening",
      "strikes first",
      "controls distance",
      "closes distance fast",
      "uses environment",
      "uses feints",
      "uses pressure",
      "uses patience",
      "uses speed",
      "uses strength",
      "uses precision",
      "uses intimidation",
      "uses restraint",
      "uses deception",
      "uses overwhelming force",
      "uses minimal force",
      "targets weak points",
      "protects allies",
      "redirects attacks",
      "refuses unnecessary violence",
    ],
  },
  {
    category: "Weakness",
    prefix: "combat_style_weakness",
    guidance:
      "Use this as combat vulnerability texture. Weaknesses should create consequence, growth, and care without glamorising harm or reducing the character to violence.",
    values: [
      "too reckless",
      "too cautious",
      "overprotective in battle",
      "anger clouds judgement",
      "hesitates to kill",
      "takes too many hits",
      "poor team coordination",
      "overrelies on strength",
      "overrelies on speed",
      "underestimates dirty fighters",
      "bad against ranged enemies",
      "bad in close quarters",
      "old injury limits style",
      "fear of losing control",
      "battle rage risk",
      "protective instinct backfires",
      "haunted by violence",
      "combat as survival reflex",
      "cannot fight without self-sacrifice",
      "needs {{user}} to anchor them",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "combat_style_romance",
    guidance:
      "Use this as romance-facing combat texture. Danger, training, wound care, mercy, restraint, and protection may support intimacy while keeping consent and aftermath visible.",
    values: [
      "sparring tension",
      "training session intimacy",
      "teaches {{user}} to defend themself",
      "{{user}} calms battle rage",
      "character lowers weapon for {{user}}",
      "bodyguard takes the hit",
      "enemy spares {{user}}",
      "duelist refuses to hurt {{user}}",
      "patching wounds after fight",
      "back to back battle",
      "weapon training closeness",
      "disarming practice touch",
      "protective rage softens",
      "mercy because {{user}} asked",
      "combat mask drops",
      "warrior learns gentleness",
      "protector gets protected",
      "lays weapon down for {{user}}",
      "love becomes restraint",
      "peace after battle",
    ],
  },
  {
    category: "Gate",
    prefix: "combat_style_gate",
    guidance:
      "Use this as an optional event gate. Let combat style surface through earned scenes, pressure, aftermath, and repair rather than constant exposition.",
    values: [
      "first combat style reveal gate",
      "first training gate",
      "first sparring gate",
      "first disarming gate",
      "first protective fight gate",
      "first battle rage gate",
      "first mercy gate",
      "first takes the hit gate",
      "first {{user}} calms them gate",
      "first refuses to hurt {{user}} gate",
      "first lowers weapon gate",
      "first combat trauma reveal gate",
      "first back to back battle gate",
      "first wound care gate",
      "first lays weapon down gate",
      "restraint over rage gate",
      "protection without control gate",
      "warrior softening gate",
      "peace after battle gate",
      "love as reason to live route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "combat_style_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should feel earned by the scene, not pasted in as fixed lines.",
    values: [
      "You fight like someone who expects to die.",
      "And you watch like someone who wants me to live.",
      "Stay behind me.",
      "I can fight.",
      "I know. I am asking to be your shield anyway.",
      "You could have killed them.",
      "You asked me not to.",
      "Put the weapon down.",
      "Only if they stop threatening you.",
      "You are shaking.",
      "The fight is over.",
      "Then come back to me.",
      "Teach me.",
      "Combat?",
      "Control.",
      "You fight dirty.",
      "I fight alive.",
      "Do not mistake restraint for weakness.",
      "I never have.",
      "Your hands remember violence.",
      "And yours?",
      "Mine can remind them how to be gentle.",
      "Come back alive.",
      "That sounds like an order.",
      "It is a prayer.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "combat_style_high_value",
    guidance:
      "Use this as a high-signal combat style seed. These are compact selectors for character creation, matching, and preset search.",
    values: [
      "defensive style",
      "protective style",
      "bodyguard style",
      "duelist style",
      "assassin style",
      "street fighter style",
      "berserker style",
      "controlled killer style",
      "non-lethal style",
      "spellblade style",
      "counterattack style",
      "disarming style",
      "takes the hit",
      "protect {{user}} first",
      "refuses unnecessary violence",
      "anger clouds judgement",
      "{{user}} calms battle rage",
      "warrior learns gentleness",
      "restraint over rage gate",
      "peace after battle",
    ],
  },
] satisfies readonly CombatStyleSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (
  group: CombatStyleSeedGroup,
  value: string,
): CombatStylePreset => ({
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

export const COMBAT_STYLE_PRESETS = COMBAT_STYLE_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const COMBAT_STYLE_PRESET_CATEGORIES = Array.from(
  new Set(COMBAT_STYLE_PRESETS.map((preset) => preset.category)),
).sort();

export const getCombatStylePresetsByCategory = (
  category: CombatStylePresetCategory,
) => COMBAT_STYLE_PRESETS.filter((preset) => preset.category === category);

export const findCombatStylePresetById = (id: string) =>
  COMBAT_STYLE_PRESETS.find((preset) => preset.id === id);

export const compileCombatStylePresetAdditions = (
  preset: CombatStylePreset,
): CompiledCombatStylePresetAdditions => ({
  backgroundAddition: `Combat style context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Combat style texture may include ${preset.value} without replacing the character's full personality, fear, tenderness, flaws, accountability, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft combat style context.`,
    "Let fighting posture, restraint, training, fear, protective instinct, pressure, and aftermath shape behaviour when relevant.",
    "Keep consent, boundaries, consequence, and {{user}} autonomy intact; protection should not become control, and violence should not erase emotional cost.",
  ].join(" "),
});
