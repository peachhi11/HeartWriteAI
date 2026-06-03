export type OccupationPresetCategory =
  | "Archetype"
  | "Occupation"
  | "Romance Hook"
  | "High-Value Occupation Tag";

export interface OccupationPreset {
  id: string;
  category: OccupationPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledOccupationPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface OccupationSeedGroup {
  category: OccupationPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const OCCUPATION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "occupation_archetype",
    guidance:
      "Use this as occupation archetype texture. Professional role, competence, duty, status, risk, care, artistry, service, secrecy, or authority may shape scenes without reducing the character to their job.",
    values: [
      "The Bodyguard",
      "The Doctor",
      "The Detective",
      "The Professor",
      "The CEO",
      "The Artist",
      "The Soldier",
      "The Knight",
      "The Royal Heir",
      "The Assassin",
      "The Thief",
      "The Bartender",
      "The Chef",
      "The Pilot",
      "The Engineer",
      "The Medic",
      "The Mage",
      "The Hunter",
      "The Healer",
      "The Criminal Boss",
      "The Priest",
      "The Performer",
      "The Journalist",
      "The Lawyer",
      "The Farmer",
      "The Innkeeper",
      "The Mechanic",
      "The Scientist",
      "The Android Caretaker",
      "The Starship Captain",
    ],
  },
  {
    category: "Occupation",
    prefix: "occupation_role",
    guidance:
      "Use this as the character's work or social role. It may influence skill set, schedule, status, risks, dialogue, workplace pressure, and romance hooks while preserving consent, ethics, and {{user}} autonomy.",
    values: [
      "bodyguard",
      "security guard",
      "soldier",
      "mercenary",
      "knight",
      "royal guard",
      "police officer",
      "detective",
      "private investigator",
      "spy",
      "assassin",
      "bounty hunter",
      "hunter",
      "monster hunter",
      "demon hunter",
      "vampire hunter",
      "firefighter",
      "paramedic",
      "combat medic",
      "military officer",
      "doctor",
      "surgeon",
      "nurse",
      "medic",
      "healer",
      "therapist",
      "psychologist",
      "apothecary",
      "herbalist",
      "midwife",
      "veterinarian",
      "dentist",
      "pharmacist",
      "faith healer",
      "battlefield healer",
      "teacher",
      "professor",
      "lecturer",
      "tutor",
      "mentor",
      "researcher",
      "scientist",
      "chemist",
      "biologist",
      "physicist",
      "archaeologist",
      "historian",
      "librarian",
      "scholar",
      "student",
      "graduate student",
      "teaching assistant",
      "ceo",
      "executive",
      "manager",
      "assistant",
      "secretary",
      "office worker",
      "consultant",
      "lawyer",
      "judge",
      "politician",
      "diplomat",
      "ambassador",
      "adviser",
      "accountant",
      "banker",
      "entrepreneur",
      "startup founder",
      "artist",
      "painter",
      "sculptor",
      "illustrator",
      "writer",
      "poet",
      "novelist",
      "journalist",
      "editor",
      "photographer",
      "filmmaker",
      "actor",
      "singer",
      "musician",
      "dancer",
      "composer",
      "fashion designer",
      "model",
      "tattoo artist",
      "chef",
      "baker",
      "barista",
      "bartender",
      "server",
      "innkeeper",
      "hotel owner",
      "shopkeeper",
      "florist",
      "tailor",
      "blacksmith",
      "jeweller",
      "carpenter",
      "mechanic",
      "farmer",
      "rancher",
      "fisher",
      "sailor",
      "merchant",
      "pilot",
      "starship captain",
      "first officer",
      "navigator",
      "engineer",
      "roboticist",
      "programmer",
      "hacker",
      "systems operator",
      "terraformer",
      "colonist",
      "space miner",
      "research station worker",
      "android technician",
      "AI specialist",
      "cyberneticist",
      "king",
      "queen",
      "prince",
      "princess",
      "duke",
      "duchess",
      "lord",
      "lady",
      "courtier",
      "spymaster",
      "royal adviser",
      "lady in waiting",
      "servant",
      "butler",
      "maid",
      "governess",
      "valet",
      "mage",
      "wizard",
      "witch",
      "warlock",
      "sorcerer",
      "necromancer",
      "oracle",
      "seer",
      "summoner",
      "alchemist",
      "enchanter",
      "curse breaker",
      "familiar keeper",
      "druid",
      "priest",
      "priestess",
      "monk",
      "cultist",
      "crime boss",
      "mafia heir",
      "underboss",
      "enforcer",
      "thief",
      "smuggler",
      "pirate",
      "fence",
      "forger",
      "information broker",
      "debt collector",
      "club owner",
      "black market doctor",
      "underground fighter",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "occupation_hook",
    guidance:
      "Use this as occupation-linked romance setup. Professional stakes may create proximity, competence, secrecy, danger, care, or protocol tension, but romance should stay adult, ethical, and responsive to boundaries.",
    values: [
      "bodyguard breaks protocol",
      "doctor caretakes patient",
      "detective protects witness",
      "professor rivalry",
      "ceo drops professional mask",
      "artist paints {{user}}",
      "soldier returns home",
      "knight protects royal",
      "assassin loves target",
      "thief steals heart",
      "bartender knows every secret",
      "chef cooks as love language",
      "pilot saves crew",
      "engineer repairs more than machines",
      "healer cares for wounded protector",
      "mage bonded by spell",
      "hunter protects monster",
      "criminal boss soft for {{user}}",
      "journalist uncovers secret",
      "starship captain chooses love over protocol",
    ],
  },
  {
    category: "High-Value Occupation Tag",
    prefix: "occupation_high_value",
    guidance:
      "Use this as a high-signal occupation tag for quick character creation, matching, filtering, or prompt preset assembly.",
    values: [
      "bodyguard",
      "doctor",
      "detective",
      "professor",
      "ceo",
      "artist",
      "soldier",
      "knight",
      "royal heir",
      "assassin",
      "thief",
      "bartender",
      "chef",
      "pilot",
      "engineer",
      "healer",
      "mage",
      "hunter",
      "crime boss",
      "starship captain",
    ],
  },
] satisfies readonly OccupationSeedGroup[]);

export const OCCUPATION_PRESETS = Object.freeze(
  OCCUPATION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => {
      const normalisedValue = normaliseOccupationValue(value);

      return {
        id: `${group.prefix}_${toPresetId(normalisedValue)}`,
        category: group.category,
        label: toLabel(normalisedValue),
        value: normalisedValue,
        triggerKeys: buildTriggerKeys(normalisedValue),
        guidance: group.guidance,
        systemPromptTags: [
          normalisedValue,
          group.category.toLowerCase(),
          "occupation preset",
        ],
      };
    }),
  ),
);

export const OCCUPATION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(OCCUPATION_PRESETS.map((preset) => preset.category))).sort(),
);

export function getOccupationPresetsByCategory(
  category: OccupationPresetCategory,
): OccupationPreset[] {
  return OCCUPATION_PRESETS.filter((preset) => preset.category === category);
}

export function findOccupationPresetById(id: string): OccupationPreset | undefined {
  return OCCUPATION_PRESETS.find((preset) => preset.id === id);
}

export function compileOccupationPresetAdditions(
  preset: OccupationPreset,
): CompiledOccupationPresetAdditions {
  return {
    backgroundAddition: `Occupation context: ${preset.category} - ${preset.value}. ${preset.guidance}`,
    relationshipAddition: `Occupation romance texture: ${preset.category} - ${preset.value}.`,
    personalityAddition: `Occupation influence: ${preset.value} may shape competence, pressure, habits, and values without replacing personality.`,
    systemPromptAddition: `Occupation guidance: Treat ${preset.value} as soft role context. Let professional skills, risks, routines, and ethical pressure surface when relevant; preserve consent, boundaries, and {{user}} autonomy.`,
  };
}

function normaliseOccupationValue(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\badvisor\b/gi, "adviser")
    .replace(/\bjeweler\b/gi, "jeweller")
    .replace(/(?<!\{)\buser\b(?!\})/gi, "{{user}}")
    .trim();
}

function toPresetId(value: string): string {
  return value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toLabel(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => {
      if (word === "{{user}}") return "{{user}}";
      if (word.toLowerCase() === "ceo") return "CEO";
      if (word.toLowerCase() === "ai") return "AI";
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

function buildTriggerKeys(value: string): string[] {
  return Array.from(new Set([value, value.toLowerCase()]));
}
