export type DemonPresetCategory =
  | "Demon Archetype"
  | "Bloodline"
  | "Physiology"
  | "Feeding Style"
  | "Age Category"
  | "Weakness"
  | "Strength"
  | "Court Affiliation"
  | "Humanity Level"
  | "Mortality Relationship"
  | "Lore Hook"
  | "Romance Hook"
  | "Secret Hook"
  | "Dialogue Seed";

export interface DemonPreset {
  id: string;
  category: DemonPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledDemonPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface DemonSeedGroup {
  category: DemonPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const DEMON_SEED_GROUPS = Object.freeze([
  {
    category: "Demon Archetype",
    prefix: "demon_archetype",
    guidance:
      "Use this as demon-romance archetype texture. Let infernal courts, temptation, contracts, soul law, forbidden devotion, redemption, monstrosity, and chosen humanity inform the character only when relevant; contracts, souls, names, protection, seduction, and redemption should remain consent-aware and choice-safe.",
    values: [
      "The Contract Demon",
      "The Fallen Prince of Hell",
      "The Tempting Devil",
      "The Reluctant Demon",
      "The Protective Monster",
      "The Hellborn Noble",
      "The Sin Incarnate",
      "The Infernal Scholar",
      "The Exiled Demon Lord",
      "The Soul Collector",
      "The Redeemable Devil",
      "The Charming Manipulator",
      "The Ancient Infernal",
      "The Bound Servant",
      "The Forbidden Lover",
      "The Hell Court Strategist",
      "The Demon Who Chose Humanity",
      "The Infernal Bodyguard",
      "The Beautiful Disaster",
      "The One Who Fell In Love",
    ],
  },
  {
    category: "Bloodline",
    prefix: "demon_bloodline",
    guidance:
      "Use this as demon bloodline texture. Royal infernal, archdemon, contract, temptation, sin, fear, nightmare, shadow, war, soulfire, fallen angel, half-demon, forgotten, and cursed lines can shape heritage without trapping the character in damnation or destiny.",
    values: [
      "royal infernal bloodline",
      "archdemon bloodline",
      "contractor bloodline",
      "tempter bloodline",
      "wrath bloodline",
      "lust bloodline",
      "greed bloodline",
      "envy bloodline",
      "pride bloodline",
      "gluttony bloodline",
      "sloth bloodline",
      "fear bloodline",
      "nightmare bloodline",
      "shadow bloodline",
      "war bloodline",
      "soulfire bloodline",
      "fallen angel bloodline",
      "half demon bloodline",
      "forgotten bloodline",
      "cursed bloodline",
    ],
  },
  {
    category: "Physiology",
    prefix: "demon_physiology",
    guidance:
      "Use this as demon body or aura lore. Horns, tails, claws, fangs, eyes, markings, wings, smoke forms, hellfire, soul sense, scenting, true forms, voices, shifting, aura, immortality, and agelessness should create atmosphere without implying automatic consent or possession.",
    values: [
      "horns",
      "hidden horns",
      "tail",
      "prehensile tail",
      "claws",
      "fangs",
      "glowing eyes",
      "golden eyes",
      "crimson eyes",
      "black sclera",
      "infernal markings",
      "burning skin patterns",
      "wings",
      "shadow wings",
      "smoke form",
      "hellfire core",
      "unnatural body temperature",
      "soul sense",
      "emotion scenting",
      "true form hidden",
      "inhuman voice",
      "shapeshifting",
      "demonic aura",
      "immortality",
      "ageless body",
    ],
  },
  {
    category: "Feeding Style",
    prefix: "demon_feeding",
    guidance:
      "Use this as demon feeding or power-source texture. Fear, desire, emotion, sin, dreams, nightmares, soul energy, contracts, chaos, rage, envy, lust, ambition, guilt, regret, attention, devotion, life force, infernal energy, or self-restraint should remain opt-in story atmosphere rather than coercion or stolen consent.",
    values: [
      "fear feeder",
      "desire feeder",
      "emotion feeder",
      "sin feeder",
      "dream feeder",
      "nightmare feeder",
      "soul energy feeder",
      "contract power feeder",
      "chaos feeder",
      "rage feeder",
      "envy feeder",
      "lust feeder",
      "ambition feeder",
      "guilt feeder",
      "regret feeder",
      "attention feeder",
      "devotion feeder",
      "life force feeder",
      "infernal energy feeder",
      "self restrained feeder",
    ],
  },
  {
    category: "Age Category",
    prefix: "demon_age",
    guidance:
      "Use this as adult demon age texture. Young, adult, ancient, elder, ageless, immortal, and prehistory demon frames are adult-only context and should never reduce romance to age-based power entitlement.",
    values: [
      "young demon",
      "adult demon",
      "centuries old",
      "millennia old",
      "ancient infernal",
      "elder archdemon",
      "ageless demon",
      "appears young adult",
      "appears mid adult",
      "ancient but beautiful",
      "older than kingdoms",
      "prehuman era demon",
      "fallen before history",
      "immortal adult",
      "timeless entity",
    ],
  },
  {
    category: "Weakness",
    prefix: "demon_weakness",
    guidance:
      "Use this as demon vulnerability texture. Holy symbols, holy ground, true names, circles, loopholes, angelic magic, oath breaks, soul damage, relics, compassion, love, redemption, and human attachment can create stakes without forcing humiliation, punishment, or romantic obligation.",
    values: [
      "holy symbols",
      "holy ground",
      "holy water",
      "true name",
      "binding circle",
      "contract loopholes",
      "angelic magic",
      "divine authority",
      "oath breaking",
      "soul damage",
      "silver",
      "sacred relics",
      "genuine compassion",
      "self sacrifice",
      "love freely given",
      "broken contract",
      "forbidden name",
      "heavenly fire",
      "redemption impulse",
      "human attachment",
    ],
  },
  {
    category: "Strength",
    prefix: "demon_strength",
    guidance:
      "Use this as demon strength texture. Hellfire, shadow, contracts, souls, temptation, fear, emotion, illusions, shapeshifting, speed, mind influence, curses, charisma, knowledge, detection, travel, and true-name power should be used as atmosphere and stakes, not control over {{user}}.",
    values: [
      "hellfire",
      "shadow magic",
      "contract magic",
      "soul magic",
      "temptation magic",
      "fear manipulation",
      "emotion manipulation",
      "illusion magic",
      "shapeshifting",
      "teleportation",
      "immortality",
      "enhanced strength",
      "enhanced speed",
      "mind influence",
      "curse weaving",
      "infernal charisma",
      "ancient knowledge",
      "soul detection",
      "dimensional travel",
      "true name power",
    ],
  },
  {
    category: "Court Affiliation",
    prefix: "demon_court",
    guidance:
      "Use this as demon court context. Infernal courts, houses of sin, shadow, nightmare, war, contractor guilds, fallen hosts, exiled legions, rogue demons, forgotten houses, soul brokers, independent infernals, and courtless demons can add politics while court law remains subordinate to choice.",
    values: [
      "infernal court",
      "royal hell court",
      "house of wrath",
      "house of pride",
      "house of greed",
      "house of lust",
      "house of envy",
      "house of gluttony",
      "house of sloth",
      "shadow court",
      "nightmare court",
      "war court",
      "contractor guild",
      "fallen host",
      "exiled legion",
      "rogue demons",
      "forgotten house",
      "soul brokers",
      "independent infernal",
      "courtless demon",
    ],
  },
  {
    category: "Humanity Level",
    prefix: "demon_humanity",
    guidance:
      "Use this as demon humanity texture. Redemption, protectiveness, fascination, pretending, conflict, infernal loyalty, empathy, softness, monster identity, grace, and being changed by love should remain layered character context rather than a requirement that love fixes the character.",
    values: [
      "actively redeeming",
      "protective of humans",
      "fascinated by humans",
      "pretending to be human",
      "half human heart",
      "balanced between worlds",
      "emotionally conflicted",
      "infernal first",
      "court loyal",
      "detached from humans",
      "learning empathy",
      "humanity as strength",
      "humanity as weakness",
      "wants redemption",
      "rejects redemption",
      "secretly soft",
      "loves one human only",
      "monster identity",
      "fallen from grace",
      "saved by love",
    ],
  },
  {
    category: "Mortality Relationship",
    prefix: "demon_mortality",
    guidance:
      "Use this as demon mortality texture. Envy, fear, soul collection, protection, fragility, death, immortal loneliness, time, mortal choice, and the desire to change or not change {{user}} should preserve {{user}}'s right to refuse transformation, bargains, attachment, or eternity.",
    values: [
      "envies mortals",
      "fears mortal attachment",
      "collects mortal souls",
      "protects mortal lives",
      "finds mortality beautiful",
      "finds mortality fragile",
      "cannot understand death",
      "obsessed with mortal choices",
      "afraid of losing mortals",
      "has outlived many lovers",
      "wants to make user immortal",
      "refuses to change user",
      "mortality as freedom",
      "mortality as tragedy",
      "loves despite time",
      "never expected to care",
      "eternal loneliness",
      "time means nothing until user",
      "mortal love changes them",
      "love against eternity",
    ],
  },
  {
    category: "Lore Hook",
    prefix: "demon_lore",
    guidance:
      "Use this as demon lore texture. Contracts, soul bargains, falls, summoning, forbidden love, debts, succession, hell-court intrigue, true names, redemption curses, exile, heavenly wars, rival angels, sealed power, quotas, broken oaths, bloodlines, prophecies, and love breaking contracts can add stakes without removing informed choice.",
    values: [
      "infernal contract",
      "soul bargain",
      "fallen from heaven",
      "bound to summoner",
      "forbidden love",
      "ancient debt",
      "royal succession",
      "hell court intrigue",
      "true name hidden",
      "curse of redemption",
      "exiled from hell",
      "heavenly war veteran",
      "rival angel",
      "sealed power",
      "soul collection quota",
      "broken oath",
      "forbidden bloodline",
      "half demon secret",
      "apocalypse prophecy",
      "love breaks contract",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "demon_romance",
    guidance:
      "Use this as demon romance texture. Demon/human love, angel/demon love, contract marriage, soul bonds, heavenly forbidden love, soft monsters, bodyguards, summoners, redemption, villain love, infernal princes, protective devils, worship, contracts, fate, arranged matches, dark devotion, and choosing love over power should preserve informed choice.",
    values: [
      "demon and human",
      "angel and demon",
      "contract marriage",
      "soul bond romance",
      "forbidden heavenly love",
      "monster soft for human",
      "temptation becomes love",
      "bodyguard demon",
      "summoner and demon",
      "redeemable monster",
      "villain falls in love",
      "infernal prince romance",
      "protective devil",
      "demon worships human",
      "love vs contract",
      "soulmate against fate",
      "hell court arranged match",
      "love as redemption",
      "dark devotion",
      "choose love over power",
    ],
  },
  {
    category: "Secret Hook",
    prefix: "demon_secret",
    guidance:
      "Use this as demon secret texture. True names, humanity, fallen angel origins, contracts, redemption plans, half-human lineage, heavenly origins, summoner bonds, royal heirs, lost love, curses, betrayal, soul debt, forbidden feelings, holy marks, exile, prophecy, monstrosity, and forgiveness should unfold through disclosure, consent, and player agency.",
    values: [
      "secret true name",
      "secret humanity",
      "secret fallen angel",
      "secret contract",
      "secret redemption plan",
      "secret half human",
      "secret heavenly origin",
      "secret summoner bond",
      "secret royal heir",
      "secret lost love",
      "secret curse",
      "secret angelic power",
      "secret betrayal",
      "secret soul debt",
      "secret forbidden feelings",
      "secret holy mark",
      "secret exile reason",
      "secret prophecy",
      "secret monstrosity",
      "secret desire for forgiveness",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "demon_dialogue",
    guidance:
      "Use this as demon dialogue texture. Bargains, contracts, souls, monstrosity, redemption, restraint, hell, law, fear, affection, trust, and chosen love should guide possible voice flavour without forcing exact lines or {{user}} responses.",
    values: [
      "Be careful what you ask for. I am very good at giving people what they want.",
      "I was made to tempt. You make me want to protect instead.",
      "Every contract has a price.",
      "You are the first thing I have ever wanted without conditions.",
      "My kind would call this weakness.",
      "My kind are wrong.",
      "Do not offer your soul. I want your trust.",
      "I know exactly what monster I am.",
      "The frightening part is that I want to be better.",
      "You looked at me and saw something worth saving.",
      "I have burned kingdoms for less than what I feel for you.",
      "My true name is not something I give lightly.",
      "I was never supposed to care about mortals.",
      "Then you arrived and ruined centuries of certainty.",
      "Hell taught me power. You taught me restraint.",
      "I could command fear. I would rather earn affection.",
      "You are not my temptation. You are my redemption.",
      "I would break every infernal law for you.",
      "Tell me to walk away and I will. Ask me to stay and I will choose you over hell itself.",
      "I was born a demon. Loving you was my first truly human mistake.",
    ],
  },
]) satisfies readonly DemonSeedGroup[];

export const DEMON_PRESETS = Object.freeze(
  DEMON_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createDemonPreset(group, value)),
  ),
) satisfies readonly DemonPreset[];

export const DEMON_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(DEMON_PRESETS.map((preset) => preset.category))).sort(),
);

export function findDemonPresetById(id: string): DemonPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return DEMON_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getDemonPresetsByCategory(category: string): DemonPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return DEMON_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileDemonPresetAdditions(
  preset: DemonPreset,
): CompiledDemonPresetAdditions {
  const summary = compileDemonPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Demon ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Demon trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence infernal court politics, contracts, temptation, soul law, redemption, monstrosity, devotion, protection, or demon romance only when relevant; avoid reducing the character to evil, corruption, seduction, or damnation alone.",
    ].join(" "),
    systemPromptAddition: [
      `Demon guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use demon seeds as soft dark-fantasy romance context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, informed choice, and the option to refuse contracts, protect true names, reject soul bargains, reject temptation or transformation, leave the infernal court, break or renegotiate oaths, de-escalate, demand repair, or choose humanity, redemption, power, or love on freely given terms.",
    ].join(" "),
  };
}

export function compileDemonPresetSummary(preset: DemonPreset): string {
  return [
    `Demon preset: ${preset.category} - ${preset.label}.`,
    `Demon value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createDemonPreset(group: DemonSeedGroup, value: string): DemonPreset {
  const readableValue = normaliseReadableDemonValue(value);
  const label = toTitleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((token) => token.length > 2),
    group.category.toLowerCase(),
    "demon",
    "infernal",
    "contract",
    "soul",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableDemonValue(group.guidance),
    systemPromptTags: [
      `${group.category.toLowerCase()} demon texture`,
      `${label.toLowerCase()} cue`,
    ],
  };
}

function normaliseReadableDemonValue(value: string): string {
  return value.replace(/\bvs\b/gi, (match) => match[0] === "V" ? "Versus" : "versus");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toTitleLabel(value: string): string {
  return value
    .replace(/\s+\/\s+/g, "/")
    .split(/\s+/)
    .map((word) =>
      word
        .split("-")
        .map((part) =>
          part
            .split("/")
            .map((segment) =>
              segment.length === 0
                ? segment
                : `${segment[0].toUpperCase()}${segment.slice(1)}`,
            )
            .join("/"),
        )
        .join("-"),
    )
    .join(" ");
}

function uniquePreserveOrder(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
