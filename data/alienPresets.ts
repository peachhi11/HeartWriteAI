export type AlienPresetCategory =
  | "Alien Archetype"
  | "Lineage"
  | "Physiology"
  | "Feeding Style"
  | "Age Category"
  | "Weakness"
  | "Strength"
  | "Affiliation"
  | "Humanity Level"
  | "Mortality Relationship"
  | "Lore Hook"
  | "Romance Hook"
  | "Secret Hook"
  | "Dialogue Seed";

export interface AlienPreset {
  id: string;
  category: AlienPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAlienPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AlienSeedGroup {
  category: AlienPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ALIEN_SEED_GROUPS = Object.freeze([
  {
    category: "Alien Archetype",
    prefix: "alien_archetype",
    guidance:
      "Use this as alien-romance archetype texture. Let first contact, diplomacy, exile, telepathy, cosmic age, culture shock, mission conflict, homeworld duty, personhood, curiosity, and chosen intimacy inform the character only when relevant; avoid reducing them to otherness, experiment, exotic spectacle, or destiny alone.",
    values: [
      "The Alien Diplomat",
      "The Exiled Star Prince",
      "The First Contact Envoy",
      "The Cosmic Wanderer",
      "The Lost Colonist",
      "The Galactic Noble",
      "The Refugee From Another World",
      "The Telepathic Stranger",
      "The Starship Captain",
      "The Alien Scientist",
      "The Hive Mind Defector",
      "The Last Survivor of a Species",
      "The Shapeshifting Visitor",
      "The Warrior From the Stars",
      "The Ancient Cosmic Being",
      "The Human-Fascinated Alien",
      "The Alien Who Pretends to Be Human",
      "The Heir to an Interstellar Empire",
      "The One Who Doesn't Understand Love",
      "The One Who Crossed Galaxies For You",
    ],
  },
  {
    category: "Lineage",
    prefix: "alien_lineage",
    guidance:
      "Use this as alien lineage or social-origin texture. Dynasties, imperial lines, explorer lineages, castes, psionic blood, hiveborn history, starborn and voidborn origins, terraformer unions, clans, diplomatic houses, hybrids, engineered bodies, extinct-species inheritance, and unknown origins can shape obligations without making biology destiny.",
    values: [
      "royal dynasty",
      "imperial lineage",
      "explorer lineage",
      "warrior caste",
      "scientist caste",
      "telepathic lineage",
      "hiveborn lineage",
      "psionic bloodline",
      "cosmic entity lineage",
      "starborn lineage",
      "voidborn lineage",
      "terraformer lineage",
      "merchant clan",
      "nomad fleet lineage",
      "guardian lineage",
      "diplomatic house",
      "hybrid lineage",
      "engineered bloodline",
      "extinct species heir",
      "unknown origin",
    ],
  },
  {
    category: "Physiology",
    prefix: "alien_physiology",
    guidance:
      "Use this as alien body, sensory, or interface lore. Bioluminescence, telepathy, nonhuman anatomy, adaptive skin colour, tentacles, tails, horns, feathers, energy bodies, silicon-based bodies, multiple hearts, pheromones, gravity resistance, photosynthesis, shapeshifting, hive links, symbiotes, cosmic resonance, and human-passing forms should create atmosphere without automatic access to {{user}}.",
    values: [
      "bioluminescent skin",
      "glowing eyes",
      "multiple eyes",
      "telepathic brain",
      "enhanced senses",
      "nonhuman blood",
      "crystalline bones",
      "scaled skin",
      "adaptive skin colour",
      "tentacle appendages",
      "tail",
      "horns",
      "feathered features",
      "energy based body",
      "silicon based body",
      "multiple hearts",
      "nonhuman voice",
      "pheromone communication",
      "gravity resistant",
      "photosynthetic traits",
      "shapeshifting",
      "hive link receptor",
      "symbiotic organism",
      "cosmic resonance",
      "human passing form",
    ],
  },
  {
    category: "Feeding Style",
    prefix: "alien_feeding",
    guidance:
      "Use this as alien sustenance texture. Standard food, light, solar radiation, emotional energy, telepathic exchange, minerals, crystals, atmosphere, bioelectricity, dreams, memories, hive pools, cosmic radiation, water, synthesis, symbiosis, shared bonds, planetary resonance, and unknown metabolisms should stay consent-aware when minds, emotions, or memories are involved.",
    values: [
      "standard nutrition",
      "light absorption",
      "solar feeding",
      "stellar radiation",
      "emotional energy",
      "telepathic exchange",
      "mineral consumption",
      "energy crystals",
      "atmospheric absorption",
      "bioelectric feeding",
      "dream energy",
      "memory consumption",
      "hive energy pool",
      "cosmic radiation",
      "water based nutrition",
      "chemical synthesis",
      "symbiotic feeding",
      "shared bond feeding",
      "planetary resonance",
      "unknown metabolism",
    ],
  },
  {
    category: "Age Category",
    prefix: "alien_age",
    guidance:
      "Use this as adult alien age texture. Adult life stages, elders, centuries, millennia, ageless entities, long- or short-lived species, ancient survivors, pre-galactic age, star-age entities, timeless consciousness, reborn clones, and unknown memory age are adult-only context and should not create authority entitlement.",
    values: [
      "juvenile adult",
      "young adult",
      "mature adult",
      "elder",
      "centuries old",
      "millennia old",
      "ageless entity",
      "long lived species",
      "short lived species",
      "ancient survivor",
      "pre galactic age",
      "star age entity",
      "timeless consciousness",
      "reborn clone",
      "memory age unknown",
    ],
  },
  {
    category: "Weakness",
    prefix: "alien_weakness",
    guidance:
      "Use this as alien vulnerability texture. Atmosphere, oxygen, radiation, gravity, telepathic overload, hive disconnection, energy depletion, water, temperature, magnetism, psionic feedback, language barriers, emotional confusion, attachment, isolation, genetics, planet dependence, symbiote loss, and cosmic loneliness can create stakes without making {{user}} responsible for fixing them.",
    values: [
      "earth atmosphere",
      "oxygen toxicity",
      "specific radiation",
      "planetary gravity",
      "telepathic overload",
      "hive disconnection",
      "energy depletion",
      "water exposure",
      "heat sensitivity",
      "cold sensitivity",
      "magnetic disruption",
      "psionic feedback",
      "language barrier",
      "emotional confusion",
      "human attachment",
      "cultural isolation",
      "genetic instability",
      "planet dependency",
      "symbiote loss",
      "cosmic loneliness",
    ],
  },
  {
    category: "Strength",
    prefix: "alien_strength",
    guidance:
      "Use this as alien capability texture. Telepathy, intelligence, psionics, healing, adaptability, shapeshifting, cosmic awareness, navigation, speed, memory, emotion sensing, adaptation, gravity control, energy projection, technology interfaces, collective knowledge, languages, prediction, and stellar resilience should support characterisation without overriding consent.",
    values: [
      "telepathy",
      "enhanced intelligence",
      "psionic power",
      "advanced healing",
      "adaptability",
      "shapeshifting",
      "cosmic awareness",
      "interstellar navigation",
      "enhanced strength",
      "enhanced speed",
      "perfect memory",
      "emotion sensing",
      "biological adaptation",
      "gravity control",
      "energy projection",
      "advanced technology interface",
      "collective knowledge",
      "language mastery",
      "future prediction",
      "stellar resilience",
    ],
  },
  {
    category: "Affiliation",
    prefix: "alien_affiliation",
    guidance:
      "Use this as alien social or political context. Galactic empires, republics, federations, exploration corps, science collectives, clans, royal houses, fleets, hives, psionic orders, councils, refugee colonies, academies, guardians, void travellers, terraformers, first-contact bureaus, exiled factions, and independence can add pressure without erasing autonomy.",
    values: [
      "galactic empire",
      "stellar republic",
      "trade federation",
      "exploration corps",
      "science collective",
      "warrior clan",
      "royal house",
      "nomad fleet",
      "hive collective",
      "psionic order",
      "planetary council",
      "refugee colony",
      "independent captain",
      "interstellar academy",
      "cosmic guardians",
      "void travellers",
      "terraformer union",
      "first contact bureau",
      "exiled faction",
      "no affiliation",
    ],
  },
  {
    category: "Humanity Level",
    prefix: "alien_humanity",
    guidance:
      "Use this as alien-humanity texture. Fascination, study, human-passing behaviour, emotional confusion, empathy, admiration, protection, detachment, alien-first identity, culture conflict, loving one human, wanting to be understood, fragility, mystery, strength, weakness, becoming more human, or choosing humanity should remain layered rather than assimilation-as-cure.",
    values: [
      "fascinated by humans",
      "studying humanity",
      "human passing",
      "emotionally confused",
      "learning empathy",
      "admires humans",
      "protective of humans",
      "detached observer",
      "alien first",
      "culturally conflicted",
      "loves one human",
      "wants to be understood",
      "wants to fit in",
      "sees humans as fragile",
      "sees humans as extraordinary",
      "humanity as mystery",
      "humanity as strength",
      "humanity as weakness",
      "becoming more human",
      "chooses humanity",
    ],
  },
  {
    category: "Mortality Relationship",
    prefix: "alien_mortality",
    guidance:
      "Use this as alien mortality texture. Different lifespans, immortality, rebirth, clones, collective memory, outliving humans, envy, urgency, studying death, transition, finality, lost homeworlds, last-of-species grief, timespan gaps, beauty, tragedy, cosmic perspective, and one-lifetime devotion should preserve choice around transformation, memory, and bonds.",
    values: [
      "longer lived than humans",
      "shorter lived than humans",
      "effectively immortal",
      "rebirth cycle",
      "clone continuation",
      "collective memory survival",
      "fears outliving humans",
      "envies human urgency",
      "does not understand death",
      "studies mortality",
      "sees death as transition",
      "sees death as final",
      "lost homeworld",
      "last of species",
      "love despite timespan",
      "mortality as beauty",
      "mortality as tragedy",
      "cosmic perspective",
      "time means nothing until love",
      "wants one lifetime together",
    ],
  },
  {
    category: "Lore Hook",
    prefix: "alien_lore",
    guidance:
      "Use this as alien lore texture. First contact, crash landings, heirs, destroyed planets, telepathic bonds, forbidden love, exile, secret identity, experiments, hive defection, ancient starseeds, previous cycles, wars, refugees, mission conflict, exchange assignments, prophecy, disguised cosmic entities, and love changing a mission can add stakes without forcing compliance.",
    values: [
      "first contact mission",
      "crash landed on earth",
      "galactic heir",
      "planet destroyed",
      "last of species",
      "telepathic bond",
      "forbidden interstellar love",
      "exiled from homeworld",
      "secret alien identity",
      "hybrid experiment",
      "hive mind defector",
      "ancient starseed",
      "memory from previous cycle",
      "galactic war veteran",
      "interstellar refugee",
      "mission vs attachment",
      "cultural exchange assignment",
      "prophecy across stars",
      "cosmic entity disguised",
      "love changes mission",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "alien_romance",
    guidance:
      "Use this as alien romance texture. Human/alien romance, first contact, diplomats, telepathic soulmates, star-crossed worlds, heirs, bodyguards, cultural exchange, shapeshifters, hive individuality, cosmic beings, courtship customs, language barriers, distance, admiration, conflict, forbidden relationships, one lifetime, devotion, and choosing love over homeworld should keep love freely chosen.",
    values: [
      "human and alien",
      "first contact romance",
      "alien diplomat falls in love",
      "telepathic soulmate",
      "star crossed worlds",
      "galactic heir and human",
      "alien bodyguard",
      "cultural exchange romance",
      "shapeshifter love story",
      "hive mind learns individual love",
      "cosmic entity loves mortal",
      "different courtship customs",
      "language barrier romance",
      "long distance across stars",
      "alien admires humanity",
      "planetary conflict romance",
      "forbidden species relationship",
      "one lifetime is enough",
      "cross galaxy devotion",
      "choosing love over homeworld",
    ],
  },
  {
    category: "Secret Hook",
    prefix: "alien_secret",
    guidance:
      "Use this as alien secret texture. Hidden identity, heirship, missions, homeworld destruction, hybrid status, telepathy, shapeshifting, war crimes, exile, last-of-species status, hive links, psionic power, planetary claims, memory modification, clones, human experiments, cosmic entities, return orders, love conflicts, and chosen humans should unfold through disclosure and player agency.",
    values: [
      "secret identity",
      "secret heir",
      "secret mission",
      "secret homeworld destruction",
      "secret hybrid",
      "secret telepath",
      "secret shapeshifter",
      "secret war criminal",
      "secret exile reason",
      "secret last of species",
      "secret hive link",
      "secret psionic power",
      "secret planetary claim",
      "secret memory modification",
      "secret clone",
      "secret human experiment",
      "secret cosmic entity",
      "secret return order",
      "secret love conflict",
      "secret chosen human",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "alien_dialogue",
    guidance:
      "Use this as alien dialogue texture. Confusion, wonder, courtship customs, telepathy, short human lifespans, observation missions, loneliness, cultural distance, home, civilisation, exile choices, meaning, stars, missions, and choosing {{user}} should guide possible voice flavour without forcing exact lines or {{user}} responses.",
    values: [
      "Your species is endlessly confusing.",
      "I have crossed galaxies and somehow you remain the most fascinating thing I've encountered.",
      "On my world, this would be considered a courtship ritual.",
      "You call it love. We never had a word for it.",
      "I can hear thoughts from light-years away. Yours are still the loudest.",
      "Humans burn so brightly for such a short time.",
      "I was supposed to observe your species, not become attached.",
      "You keep asking if I'm lonely. I didn't know I was until I met you.",
      "My people would never understand this.",
      "Neither do I, but I don't want it to stop.",
      "You see a monster from the stars. I see home.",
      "I have lived through civilizations. This feeling is new.",
      "If I return home, I lose you.",
      "If I stay, I lose everything else.",
      "That should be a difficult choice.",
      "It isn't.",
      "You taught me that a single life can still be infinite in meaning.",
      "The stars are beautiful. They just stopped being enough.",
      "I came here on a mission. Now I have a reason.",
      "Across every world I've known, I would still choose you.",
    ],
  },
]) satisfies readonly AlienSeedGroup[];

export const ALIEN_PRESETS = Object.freeze(
  ALIEN_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createAlienPreset(group, value)),
  ),
) satisfies readonly AlienPreset[];

export const ALIEN_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(ALIEN_PRESETS.map((preset) => preset.category))).sort(),
);

export function findAlienPresetById(id: string): AlienPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return ALIEN_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getAlienPresetsByCategory(category: string): AlienPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return ALIEN_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileAlienPresetAdditions(
  preset: AlienPreset,
): CompiledAlienPresetAdditions {
  const summary = compileAlienPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Alien ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Alien trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence first contact, culture shock, telepathy, nonhuman instincts, duty, exile, cosmic grief, chosen intimacy, mission conflict, homeworld loyalty, or alien romance only when relevant; avoid reducing the character to a specimen, destiny, biological imperative, or exotic otherness alone.",
    ].join(" "),
    systemPromptAddition: [
      `Alien guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use alien seeds as soft sci-fi romance context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, informed choice, and the option to refuse telepathic contact, reject experiments, protect private memories, reject bonding or transformation, leave imperial, hive, or mission control, de-escalate, demand repair, or choose humanity, homeworld loyalty, autonomy, or love on freely given terms.",
    ].join(" "),
  };
}

export function compileAlienPresetSummary(preset: AlienPreset): string {
  return [
    `Alien preset: ${preset.category} - ${preset.label}.`,
    `Alien value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createAlienPreset(group: AlienSeedGroup, value: string): AlienPreset {
  const readableValue = normaliseReadableAlienValue(value);
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
    "alien",
    "sci fi",
    "first contact",
    "star",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableAlienValue(group.guidance),
    systemPromptTags: [
      `${group.category.toLowerCase()} alien texture`,
      `${label.toLowerCase()} cue`,
    ],
  };
}

function normaliseReadableAlienValue(value: string): string {
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
