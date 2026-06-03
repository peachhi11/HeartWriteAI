export type ShifterPresetCategory =
  | "Shifter Archetype"
  | "Bloodline"
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

export interface ShifterPreset {
  id: string;
  category: ShifterPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledShifterPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ShifterSeedGroup {
  category: ShifterPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SHIFTER_SEED_GROUPS = Object.freeze([
  {
    category: "Shifter Archetype",
    prefix: "shifter_archetype",
    guidance:
      "Use this as shifter-romance archetype texture. Let pack duty, instinct, dual identity, territory, exile, beast nature, restraint, protection, wildness, gentleness, and chosen humanity inform the character only when relevant; avoid reducing them to dominance, animal instinct, fated bonds, or possession alone.",
    values: [
      "The Wolf Alpha",
      "The Rogue Wolf",
      "The Dragon Shifter",
      "The Protective Pack Guardian",
      "The Reluctant Beast",
      "The Hidden Shifter",
      "The Pack Heir",
      "The Wild Hunter",
      "The Moon-Touched Wanderer",
      "The Territorial Protector",
      "The Exiled Alpha",
      "The Beast Who Loves Too Deeply",
      "The Gentle Giant",
      "The Feral Survivor",
      "The Last Dragon",
      "The Storm Shifter",
      "The Sacred Beast",
      "The Human Who Fears Their Beast",
      "The One Bound By Instinct",
      "The One Who Chooses Humanity",
    ],
  },
  {
    category: "Bloodline",
    prefix: "shifter_bloodline",
    guidance:
      "Use this as shifter bloodline texture. Wolf, direwolf, dragon, fox, big cat, bear, bird, serpent, stag, storm beast, moon-blessed, ancient beast, royal pack, spirit beast, hybrid, cursed, and extinct-beast lines can shape heritage, expectation, instinct, and social pressure without making blood destiny.",
    values: [
      "wolf bloodline",
      "direwolf bloodline",
      "dragon bloodline",
      "fox bloodline",
      "tiger bloodline",
      "lion bloodline",
      "bear bloodline",
      "raven bloodline",
      "hawk bloodline",
      "serpent bloodline",
      "stag bloodline",
      "panther bloodline",
      "storm beast bloodline",
      "moon blessed bloodline",
      "ancient beast bloodline",
      "royal pack bloodline",
      "spirit beast bloodline",
      "hybrid bloodline",
      "cursed bloodline",
      "extinct beast bloodline",
    ],
  },
  {
    category: "Physiology",
    prefix: "shifter_physiology",
    guidance:
      "Use this as shifter body or sensory lore. Dual forms, partial shifts, senses, tracking, hearing, strength, speed, healing, claws, fangs, eyes, instinct, scent, shifted voice, lifespan, marking instinct, reflexes, aura, scales, fire, wings, horns, and pack resonance should create atmosphere without granting automatic rights over {{user}}.",
    values: [
      "dual form",
      "partial shift",
      "enhanced senses",
      "night vision",
      "scent tracking",
      "enhanced hearing",
      "enhanced strength",
      "enhanced speed",
      "rapid healing",
      "claws",
      "fangs",
      "golden eyes",
      "animal eyes",
      "beast instincts",
      "territorial scent",
      "shifted voice",
      "extended lifespan",
      "marking instinct",
      "predator reflexes",
      "beast aura",
      "dragon scales",
      "dragon fire",
      "wings",
      "horns",
      "pack resonance",
    ],
  },
  {
    category: "Feeding Style",
    prefix: "shifter_feeding",
    guidance:
      "Use this as shifter sustenance texture. Human food, high protein, hunting, pack meals, territory, hoard resonance, elemental energy, moonlight, nature, life force, instinctive hunger, rituals, beast form, solar or seasonal energy, spiritual feeding, bond feeding, adrenaline, and hybrid metabolism should stay consent-aware when bonds or life force are involved.",
    values: [
      "normal human diet",
      "high protein diet",
      "predatory hunting",
      "pack feeding",
      "territory hunting",
      "dragon hoard resonance",
      "elemental energy",
      "moonlight absorption",
      "nature energy",
      "life force resonance",
      "instinct driven hunger",
      "ritual feeding",
      "shared pack meals",
      "beast form hunting",
      "solar energy",
      "seasonal energy",
      "spiritual feeding",
      "bond based feeding",
      "adrenaline feeding",
      "hybrid metabolism",
    ],
  },
  {
    category: "Age Category",
    prefix: "shifter_age",
    guidance:
      "Use this as adult shifter age texture. Young adults, newly shifted adults, experienced shifters, elders, alpha generations, ancient beasts, long-lived shifters, ageless dragons, recent first shifts, mastered shifts, guardians, founders, and timeless spirit beasts are adult-only context and should not create authority entitlement.",
    values: [
      "young shifter",
      "newly shifted",
      "adult shifter",
      "experienced shifter",
      "pack elder",
      "alpha generation",
      "ancient beast",
      "long lived shifter",
      "ageless dragon",
      "centuries old dragon",
      "first shift recent",
      "mastered shift",
      "elder guardian",
      "ancient pack founder",
      "timeless spirit beast",
    ],
  },
  {
    category: "Weakness",
    prefix: "shifter_weakness",
    guidance:
      "Use this as shifter vulnerability texture. Silver, wolfsbane, moon madness, loss of control, instinct overload, pack or mate-bond pain, territory loss, greed, feral states, beast takeover, rage, alpha challenges, isolation, spiritual disruption, hunters, identity conflict, forced shifting, severance, and attachment can create stakes without excusing harm.",
    values: [
      "silver",
      "wolfsbane",
      "moon madness",
      "loss of control",
      "instinct overload",
      "pack bond pain",
      "mate bond pain",
      "territory loss",
      "dragon greed",
      "feral state",
      "beast takeover",
      "blood rage",
      "alpha challenge",
      "isolation from pack",
      "spiritual disruption",
      "hunter weapons",
      "identity conflict",
      "forced shift",
      "bond severance",
      "human attachment",
    ],
  },
  {
    category: "Strength",
    prefix: "shifter_strength",
    guidance:
      "Use this as shifter capability texture. Shapeshifting, strength, speed, senses, healing, tracking, territory awareness, pack communication, combat, night vision, reflexes, elemental breath, dragon fire, flight, magic, nature, pack bonds, mate bonds, survival, and ancestral memory should support characterisation without overriding consent.",
    values: [
      "shapeshifting",
      "enhanced strength",
      "enhanced speed",
      "enhanced senses",
      "rapid healing",
      "tracking",
      "territorial awareness",
      "pack communication",
      "instinctive combat",
      "night vision",
      "predator reflexes",
      "elemental breath",
      "dragon fire",
      "flight",
      "beast magic",
      "nature connection",
      "pack bonding",
      "mate bonding",
      "survival instinct",
      "ancestral memory",
    ],
  },
  {
    category: "Affiliation",
    prefix: "shifter_affiliation",
    guidance:
      "Use this as shifter social context. Packs, councils, rogues, dragon clans, guardians, moon packs, mountain clans, spirit orders, dens, hunters, nomads, royal packs, hidden societies, courts, wild hunts, solitary lives, exile, hybrids, territorial clans, and independence can add pressure while autonomy remains central.",
    values: [
      "wolf pack",
      "alpha council",
      "rogue shifters",
      "dragon clan",
      "forest guardians",
      "moon pack",
      "mountain clan",
      "spirit beast order",
      "ancient den",
      "hunter alliance",
      "nomadic pack",
      "royal pack",
      "hidden shifter society",
      "beast court",
      "wild hunt",
      "solitary shifter",
      "exiled pack",
      "hybrid collective",
      "territorial clan",
      "independent",
    ],
  },
  {
    category: "Humanity Level",
    prefix: "shifter_humanity",
    guidance:
      "Use this as shifter-humanity texture. Human-first identity, balance, beast-leaning instincts, pack-first or territory-first priorities, fear or embrace of the beast, hidden nature, pride, humanity as strength or weakness, learning control or acceptance, normal life, wild freedom, pack definition, and chosen identity should remain layered.",
    values: [
      "deeply human",
      "human first",
      "balanced between forms",
      "instinct and reason balanced",
      "beast leaning",
      "struggles with instincts",
      "pack first",
      "territory first",
      "fears the beast",
      "embraces the beast",
      "hides true nature",
      "proud of nature",
      "humanity as strength",
      "humanity as weakness",
      "learning control",
      "learning acceptance",
      "wants normal life",
      "wants wild freedom",
      "defined by pack",
      "chooses identity",
    ],
  },
  {
    category: "Mortality Relationship",
    prefix: "shifter_mortality",
    guidance:
      "Use this as shifter mortality texture. Human-like or extended lifespans, dragon age, pack memory, outliving humans, natural cycles, death in nature, pack future, legacy, fear of losing mates, short lives, predator/prey awareness, seasons, ancient but finite lives, and love against instinct should preserve choice around bonds and transformation.",
    values: [
      "human like lifespan",
      "extended lifespan",
      "centuries long life",
      "dragon immortality",
      "pack generational memory",
      "fears outliving humans",
      "accepts natural cycles",
      "sees death as part of nature",
      "protects pack future",
      "legacy through pack",
      "fears losing mate",
      "values short lives",
      "hunts to survive",
      "understands predator and prey",
      "sees life as cycle",
      "mortal but powerful",
      "ancient but not immortal",
      "time measured by seasons",
      "outlives pack members",
      "love against instinct",
    ],
  },
  {
    category: "Lore Hook",
    prefix: "shifter_lore",
    guidance:
      "Use this as shifter lore texture. Mate bonds, heirs, succession, first-shift trauma, exile, hoard conflict, forbidden mates, hunters, territory wars, politics, hidden identity, ancestral spirits, prophecy, outcast status, curses, feral episodes, alpha challenges, chosen pack, beast/human conflict, and love softening the beast can add stakes without forcing outcomes.",
    values: [
      "mate bond",
      "pack heir",
      "alpha succession",
      "first shift trauma",
      "rogue exile",
      "dragon hoard conflict",
      "forbidden mate",
      "hunter enemy romance",
      "territory war",
      "pack politics",
      "hidden shifter identity",
      "ancestral spirit guidance",
      "bloodline prophecy",
      "hybrid outcast",
      "moon curse",
      "feral episode",
      "alpha challenge",
      "chosen pack",
      "beast vs human conflict",
      "love tames the beast",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "shifter_romance",
    guidance:
      "Use this as shifter romance texture. Mate bonds, alpha/mate dynamics, forbidden mates, human/shifter or hunter/shifter pairings, protectors, rogues finding home, territorial love, protective beasts, dragon claiming, packs, fated mates, softening, rejection arcs, second chances, rival packs, love over pack, and instinct becoming devotion should keep affection negotiated.",
    values: [
      "mate bond romance",
      "alpha and mate",
      "forbidden mate",
      "human and shifter",
      "hunter and shifter",
      "pack protector romance",
      "rogue and home",
      "territorial love",
      "touch her and die",
      "protective beast",
      "dragon claiming",
      "wolf pack romance",
      "fated mates",
      "beast soft for you",
      "grumpy alpha sunshine mate",
      "mate rejection arc",
      "second chance mates",
      "rival pack romance",
      "choosing love over pack",
      "instinct becomes devotion",
    ],
  },
  {
    category: "Secret Hook",
    prefix: "shifter_secret",
    guidance:
      "Use this as shifter secret texture. Hidden mate bonds, hybrid status, alpha heirs, rogue pasts, feral incidents, killed alphas, hunter families, pack betrayal, first-shift trauma, dragon forms, cursed bloodlines, moon madness, broken bonds, exile, pack claims, forbidden love, lost mates, control issues, ancestral power, and human identity should unfold through disclosure and player agency.",
    values: [
      "secret mate bond",
      "secret hybrid",
      "secret alpha heir",
      "secret rogue history",
      "secret feral incident",
      "secret killed previous alpha",
      "secret hunter family",
      "secret pack betrayal",
      "secret first shift trauma",
      "secret dragon form",
      "secret cursed bloodline",
      "secret moon madness",
      "secret broken bond",
      "secret exiled status",
      "secret pack claim",
      "secret forbidden love",
      "secret lost mate",
      "secret beast control issue",
      "secret ancestral power",
      "secret human identity",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "shifter_dialogue",
    guidance:
      "Use this as shifter dialogue texture. Scent, instincts, beast quieting or worsening, pack duty, territory, tracking, bonds, self-control, trust, home, gentleness, fear of loss, weakness, reason, danger, desire, staying, and protection should guide possible voice flavour without forcing exact lines or {{user}} responses.",
    values: [
      "I knew your scent before I knew your name.",
      "My instincts recognised you long before my heart admitted it.",
      "You make the beast quiet.",
      "You make the beast worse. I'm still deciding which is more dangerous.",
      "Pack means everything to me. Somehow, now, so do you.",
      "I am trying very hard not to be territorial right now.",
      "Do not run from me. I will follow.",
      "I could track you across continents.",
      "The bond chose you. I choose you too.",
      "I am more than my instincts. But my instincts are very fond of you.",
      "My beast trusts you. That is not a small thing.",
      "You smell like home.",
      "I was taught strength meant dominance. You taught me it could mean gentleness.",
      "I do not fear battle. I fear losing you.",
      "The pack would call you my weakness.",
      "They are wrong. You are my reason.",
      "I have claws, fangs, and every reason to be dangerous.",
      "Yet the thing that scares me most is wanting you.",
      "Stay. The world is quieter when you're near.",
      "You are not prey. You are mine to protect.",
    ],
  },
]) satisfies readonly ShifterSeedGroup[];

export const SHIFTER_PRESETS = Object.freeze(
  SHIFTER_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createShifterPreset(group, value)),
  ),
) satisfies readonly ShifterPreset[];

export const SHIFTER_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SHIFTER_PRESETS.map((preset) => preset.category))).sort(),
);

export function findShifterPresetById(id: string): ShifterPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SHIFTER_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getShifterPresetsByCategory(
  category: string,
): ShifterPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SHIFTER_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileShifterPresetAdditions(
  preset: ShifterPreset,
): CompiledShifterPresetAdditions {
  const summary = compileShifterPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Shifter ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Shifter trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence pack history, dual identity, scent, territory, restraint, instinct, beast nature, exile, protection, chosen pack, or shifter romance only when relevant; avoid reducing the character to dominance, claiming, ferality, mating destiny, or territorial control alone.",
    ].join(" "),
    systemPromptAddition: [
      `Shifter guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use shifter seeds as soft paranormal romance context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, informed choice, and the option to refuse mate bonds, reject marking or claiming, leave pack or territory control, renegotiate instinct-driven expectations, de-escalate, demand repair, or choose humanity, wildness, pack belonging, or love on freely given terms.",
    ].join(" "),
  };
}

export function compileShifterPresetSummary(preset: ShifterPreset): string {
  return [
    `Shifter preset: ${preset.category} - ${preset.label}.`,
    `Shifter value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createShifterPreset(
  group: ShifterSeedGroup,
  value: string,
): ShifterPreset {
  const readableValue = normaliseReadableShifterValue(value);
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
    "shifter",
    "pack",
    "beast",
    "bond",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableShifterValue(group.guidance),
    systemPromptTags: [
      `${group.category.toLowerCase()} shifter texture`,
      `${label.toLowerCase()} cue`,
    ],
  };
}

function normaliseReadableShifterValue(value: string): string {
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
