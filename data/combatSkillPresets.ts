export type CombatSkillPresetCategory =
  | "Archetype"
  | "Core Skill"
  | "Weapon Skill"
  | "Martial Art"
  | "Tactical Skill"
  | "Protective Skill"
  | "Fantasy Combat Skill"
  | "Sci-Fi Combat Skill"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Mastery"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface CombatSkillPreset {
  id: string;
  category: CombatSkillPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCombatSkillPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CombatSkillSeedGroup {
  category: CombatSkillPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const COMBAT_SKILL_GUIDANCE =
  "Use this as combat skill texture. Violence, defence, protection, restraint, fear, skill, and aftermath may shape scenes without replacing personality, consent, or {{user}} agency.";

const COMBAT_SKILL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "combat_skill_archetype",
    guidance: COMBAT_SKILL_GUIDANCE,
    values: [
      "The Swordmaster",
      "The Archer",
      "The Gunslinger",
      "The Martial Artist",
      "The Knife Fighter",
      "The Duelist",
      "The Shield Bearer",
      "The Sniper",
      "The Assassin",
      "The Bodyguard",
      "The Battle Strategist",
      "The Street Fighter",
      "The Soldier",
      "The Knight",
      "The Monster Hunter",
      "The Mage Warrior",
      "The Berserker",
      "The Silent Protector",
      "The Non-Lethal Defender",
      "The One Who Fights Only To Protect",
    ],
  },
  {
    category: "Core Skill",
    prefix: "combat_skill_core",
    guidance:
      "Use this as core combat texture. Melee, ranged, defensive, protective, non-lethal, battlefield, and threat assessment skills may shape action and consequence.",
    values: [
      "combat skill",
      "melee combat",
      "ranged combat",
      "unarmed combat",
      "armed combat",
      "defensive combat",
      "attack-focused combat",
      "protective combat",
      "non-lethal combat",
      "lethal combat",
      "close-quarters combat",
      "urban combat",
      "battlefield combat",
      "duelling",
      "ambush tactics",
      "counterattack",
      "disarming",
      "grappling",
      "evasion",
      "threat assessment",
    ],
  },
  {
    category: "Weapon Skill",
    prefix: "combat_skill_weapon",
    guidance:
      "Use this as weapon skill texture. Weapons may reveal discipline, history, restraint, fear, or competence rather than functioning as empty spectacle.",
    values: [
      "swordsmanship",
      "fencing",
      "dual wielding",
      "dagger fighting",
      "knife fighting",
      "spear fighting",
      "staff fighting",
      "axe fighting",
      "mace fighting",
      "shield use",
      "archery",
      "crossbow use",
      "throwing knives",
      "firearms",
      "pistol marksmanship",
      "rifle marksmanship",
      "sniping",
      "heavy weapons",
      "improvised weapons",
      "weapon mastery",
    ],
  },
  {
    category: "Martial Art",
    prefix: "combat_skill_martial_art",
    guidance:
      "Use this as martial arts texture. Training, control, body mechanics, self-defence, and restraint may shape closeness or conflict.",
    values: [
      "martial arts",
      "boxing",
      "kickboxing",
      "wrestling",
      "judo",
      "jiu jitsu",
      "karate",
      "taekwondo",
      "muay thai",
      "kung fu",
      "krav maga",
      "aikido",
      "capoeira",
      "mixed martial arts",
      "pressure point fighting",
      "joint locks",
      "throws",
      "ground fighting",
      "counter-grappling",
      "self-defence",
    ],
  },
  {
    category: "Tactical Skill",
    prefix: "combat_skill_tactical",
    guidance:
      "Use this as tactical combat texture. Planning, cover, rescue, leadership, retreat, and awareness may shape choices under pressure.",
    values: [
      "battle strategy",
      "military tactics",
      "squad leadership",
      "formation fighting",
      "guerrilla tactics",
      "siege tactics",
      "flanking",
      "cover usage",
      "stealth combat",
      "reconnaissance",
      "trap setting",
      "ambush planning",
      "escape and evasion",
      "battlefield awareness",
      "target prioritisation",
      "crowd control",
      "hostage rescue",
      "bodyguard tactics",
      "defensive positioning",
      "tactical retreat",
    ],
  },
  {
    category: "Protective Skill",
    prefix: "combat_skill_protective",
    guidance:
      "Use this as protective combat texture. Protection should remain boundary-aware, avoiding control while allowing danger, sacrifice, and restraint to matter.",
    values: [
      "bodyguarding",
      "shielding others",
      "takes the hit",
      "guards exits",
      "moves {{user}} behind them",
      "stands between {{user}} and threat",
      "disarms without killing",
      "subdues attacker",
      "protective positioning",
      "escort tactics",
      "evacuation planning",
      "safehouse defence",
      "threat interception",
      "crowd shielding",
      "danger sense",
      "keeps {{user}} close",
      "protects without controlling",
      "fights defensively for {{user}}",
      "refuses unnecessary violence",
      "last line of defence",
    ],
  },
  {
    category: "Fantasy Combat Skill",
    prefix: "combat_skill_fantasy",
    guidance:
      "Use this as fantasy combat texture. Magic, monsters, wards, curses, and enchanted weapons may shape stakes while preserving choice and consequence.",
    values: [
      "battle magic",
      "spellblade combat",
      "elemental combat",
      "fire magic combat",
      "ice magic combat",
      "lightning magic combat",
      "shadow combat",
      "blood magic combat",
      "healing under fire",
      "ward fighting",
      "rune weaponry",
      "enchanted blades",
      "summoned weapon",
      "monster hunting",
      "demon slaying",
      "dragon fighting",
      "anti-magic combat",
      "curse breaking in battle",
      "magical duelling",
      "battle mage tactics",
    ],
  },
  {
    category: "Sci-Fi Combat Skill",
    prefix: "combat_skill_scifi",
    guidance:
      "Use this as sci-fi combat texture. Technology, station hazards, drones, armour, hacking, and alien adaptation may ground action in environment and risk.",
    values: [
      "laser weaponry",
      "plasma weapons",
      "energy shields",
      "powered armour combat",
      "zero-gravity combat",
      "spacewalk combat",
      "boarding action",
      "ship-to-ship tactics",
      "drone combat",
      "cybernetic reflexes",
      "android combat protocols",
      "mech piloting",
      "exosuit combat",
      "stun weapon use",
      "tactical hacking",
      "security breach response",
      "airlock defence",
      "colony defence",
      "alien weaponry",
      "nonhuman combat adaptation",
    ],
  },
  {
    category: "Weakness",
    prefix: "combat_skill_weakness",
    guidance:
      "Use this as combat vulnerability texture. Hesitation, trauma, injury, recklessness, restraint, and fear may surface without making violence the whole character.",
    values: [
      "hesitates to kill",
      "reckless in battle",
      "overprotective in combat",
      "takes too many hits",
      "poor team coordination",
      "anger clouds judgement",
      "fear of losing control",
      "combat freeze response",
      "old injury limits movement",
      "overrelies on strength",
      "underestimates opponents",
      "haunted by violence",
      "hates using weapon",
      "uses violence to hide fear",
      "protective instinct backfires",
      "cannot fight dirty",
      "too willing to sacrifice self",
      "avoids combat until cornered",
      "battlefield trauma",
      "violence as last resort",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "combat_skill_romance",
    guidance:
      "Use this as combat romance texture. Sparring, protection, mercy, wound care, and control may create tension while keeping consent and aftermath visible.",
    values: [
      "sparring partners to lovers",
      "training session tension",
      "duel turns intimate",
      "bodyguard takes the hit",
      "enemy spares {{user}}",
      "rival teaches combat",
      "patching wounds after fight",
      "protective combat scene",
      "back-to-back battle",
      "weapon training closeness",
      "disarming practice touch",
      "fight interrupted by almost kiss",
      "{{user}} calms battle rage",
      "character refuses to hurt {{user}}",
      "protective rage softens",
      "mercy because {{user}} asked",
      "combat mask drops after danger",
      "warrior learns gentleness",
      "protector gets protected",
      "love as reason to survive",
    ],
  },
  {
    category: "Gate",
    prefix: "combat_skill_gate",
    guidance:
      "Use this as combat progression texture. Reveal, training, threat, mercy, rage, injury, and peace may mark relationship development.",
    values: [
      "first combat reveal gate",
      "first training gate",
      "first sparring gate",
      "first weapon drawn gate",
      "first threat assessment gate",
      "first protective fight gate",
      "first takes the hit gate",
      "first back-to-back battle gate",
      "first disarming gate",
      "first mercy gate",
      "first battle rage gate",
      "first {{user}} calms them gate",
      "first injury after fight gate",
      "first combat trauma reveal gate",
      "first refuses to kill gate",
      "first fights for {{user}} gate",
      "first lays weapon down gate",
      "warrior softening gate",
      "protector survives gate",
      "peace after battle route",
    ],
  },
  {
    category: "Mastery",
    prefix: "combat_skill_mastery",
    guidance:
      "Use this as combat mastery texture. Training, reputation, restraint, experience, and survival may calibrate capability and cost.",
    values: [
      "combat novice",
      "trained fighter",
      "street trained",
      "military trained",
      "academy trained",
      "self-taught fighter",
      "battle tested",
      "veteran fighter",
      "elite soldier",
      "master duelist",
      "master archer",
      "master assassin",
      "legendary warrior",
      "retired champion",
      "tournament winner",
      "battlefield survivor",
      "deadly but controlled",
      "dangerous when cornered",
      "gentle until threatened",
      "unbeaten combatant",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "combat_skill_dialogue",
    guidance:
      "Use this as dialogue inspiration. Keep lines natural, context-sensitive, and responsive rather than copied as fixed script.",
    values: [
      "Stay behind me.",
      "I can fight.",
      "I know. I am asking to be your shield anyway.",
      "You fight like someone who expects to die.",
      "And you watch like someone who wants me to live.",
      "Put the weapon down.",
      "Only if they stop threatening you.",
      "You could have killed them.",
      "You asked me not to.",
      "Do not mistake restraint for weakness.",
      "I never have.",
      "Teach me.",
      "Combat?",
      "Control.",
      "You are bleeding.",
      "It is not mine.",
      "That does not make me feel better.",
      "I do not fight because I enjoy it.",
      "Then why?",
      "Because some people are worth standing between danger and.",
      "Your hands are shaking.",
      "They remember what I made them do.",
      "Come back alive.",
      "That sounds like an order.",
      "It is a prayer.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "combat_skill_high_value",
    guidance:
      "Use this as a high-signal combat seed for matching, quick presets, or compiler weighting. Treat it as additive context only.",
    values: [
      "swordsmanship",
      "martial arts",
      "knife fighting",
      "marksmanship",
      "sniping",
      "duelling",
      "bodyguarding",
      "protective combat",
      "threat assessment",
      "battle strategy",
      "stealth combat",
      "disarming",
      "takes the hit",
      "stands between {{user}} and threat",
      "monster hunting",
      "spellblade combat",
      "zero-gravity combat",
      "hesitates to kill",
      "warrior learns gentleness",
      "peace after battle route",
    ],
  },
] satisfies readonly CombatSkillSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: CombatSkillSeedGroup, value: string): CombatSkillPreset => ({
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

export const COMBAT_SKILL_PRESETS = COMBAT_SKILL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const COMBAT_SKILL_PRESET_CATEGORIES = Array.from(
  new Set(COMBAT_SKILL_PRESETS.map((preset) => preset.category)),
).sort();

export const getCombatSkillPresetsByCategory = (category: CombatSkillPresetCategory) =>
  COMBAT_SKILL_PRESETS.filter((preset) => preset.category === category);

export const findCombatSkillPresetById = (id: string) =>
  COMBAT_SKILL_PRESETS.find((preset) => preset.id === id);

export const compileCombatSkillPresetAdditions = (
  preset: CombatSkillPreset,
): CompiledCombatSkillPresetAdditions => ({
  backgroundAddition: `Combat skill context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Combat texture may include ${preset.value} without replacing the character's full personality, restraint, fear, limits, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft combat context.`,
    "Let skill, danger, protection, restraint, or combat aftermath shape behaviour when relevant.",
    "Keep consent, boundaries, and {{user}} autonomy intact; protection should not become control, and violence should carry consequence.",
  ].join(" "),
});
