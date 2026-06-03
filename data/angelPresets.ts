export type AngelPresetCategory =
  | "Angel Archetype"
  | "Lineage"
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

export interface AngelPreset {
  id: string;
  category: AngelPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAngelPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AngelSeedGroup {
  category: AngelPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const ANGEL_SEED_GROUPS = Object.freeze([
  {
    category: "Angel Archetype",
    prefix: "angel_archetype",
    guidance:
      "Use this as angel-romance archetype texture. Let guardianship, grace, duty, mercy, judgement, healing, forbidden devotion, exile, falling, free will, and chosen love inform the character only when relevant; protection, confession, healing, duty, prophecy, and sacrifice should remain consent-aware and choice-safe.",
    values: [
      "The Guardian Angel",
      "The Fallen Angel",
      "The Heavenly Knight",
      "The Divine Messenger",
      "The Mercy Bringer",
      "The Celestial Prince",
      "The Watcher",
      "The Exiled Seraph",
      "The Reluctant Saint",
      "The Protector of Mortals",
      "The Judge of Souls",
      "The Angel Who Fell in Love",
      "The Divine Healer",
      "The Winged Sentinel",
      "The Heavenly Scholar",
      "The Grace-Bound One",
      "The Lightbearer",
      "The Broken Halo",
      "The Last Loyal Angel",
      "The One Who Chose Free Will",
    ],
  },
  {
    category: "Lineage",
    prefix: "angel_lineage",
    guidance:
      "Use this as angel lineage texture. Seraphim, cherubim, thrones, dominions, virtues, powers, principalities, archangels, guardians, messengers, healers, judgement, warriors, oracles, lightbearers, fallen lines, exiles, half-angels, forgotten hosts, and ancient hosts can shape heritage without trapping the character in duty or purity.",
    values: [
      "seraphim",
      "cherubim",
      "thrones",
      "dominions",
      "virtues",
      "powers",
      "principalities",
      "archangel lineage",
      "guardian lineage",
      "messenger lineage",
      "healer lineage",
      "judgement lineage",
      "warrior lineage",
      "oracle lineage",
      "lightbearer lineage",
      "fallen lineage",
      "exiled lineage",
      "half angel lineage",
      "forgotten host lineage",
      "ancient host lineage",
    ],
  },
  {
    category: "Physiology",
    prefix: "angel_physiology",
    guidance:
      "Use this as angel body or aura lore. Wings, halos, glowing or golden eyes, divine aura, warmth, healing, light markings, star freckles, radiant skin, agelessness, divine voice, celestial presence, soul sense, truth sense, and hidden true forms should create atmosphere, not automatic trust or consent.",
    values: [
      "wings",
      "hidden wings",
      "halo",
      "broken halo",
      "glowing eyes",
      "golden eyes",
      "silver eyes",
      "divine aura",
      "warm touch",
      "healing touch",
      "light markings",
      "star freckles",
      "feathered wings",
      "radiant skin",
      "ageless body",
      "divine voice",
      "celestial presence",
      "soul sense",
      "truth sense",
      "true form hidden",
    ],
  },
  {
    category: "Feeding Style",
    prefix: "angel_feeding",
    guidance:
      "Use this as angel nourishment or power-source texture. Faith, hope, devotion, prayer, light, grace, compassion, selfless acts, forgiveness, courage, inspiration, mercy, dreams, soul harmony, divine energy, virtue, celestial energy, human connection, love, or needing none should remain soft atmosphere rather than extracting worship, obedience, or emotional labour from {{user}}.",
    values: [
      "faith feeder",
      "hope feeder",
      "devotion feeder",
      "prayer feeder",
      "light feeder",
      "grace feeder",
      "compassion feeder",
      "selfless act feeder",
      "forgiveness feeder",
      "courage feeder",
      "inspiration feeder",
      "mercy feeder",
      "dream feeder",
      "soul harmony feeder",
      "divine energy feeder",
      "virtue feeder",
      "none required",
      "celestial energy feeder",
      "human connection feeder",
      "love feeder",
    ],
  },
  {
    category: "Age Category",
    prefix: "angel_age",
    guidance:
      "Use this as adult angel age texture. Young, newly ascended, adult, ancient, elder, ageless, eternal, prehuman, timeless, and fallen-eternal frames are adult-only context and should never reduce romance to age-based authority or spiritual entitlement.",
    values: [
      "young angel",
      "newly ascended",
      "adult angel",
      "centuries old",
      "millennia old",
      "ancient seraph",
      "elder host",
      "ageless angel",
      "appears young adult",
      "appears mid adult",
      "older than empires",
      "prehuman era angel",
      "eternal servant",
      "timeless entity",
      "fallen eternal",
    ],
  },
  {
    category: "Weakness",
    prefix: "angel_weakness",
    guidance:
      "Use this as angel vulnerability texture. Fallen grace, broken oaths, true names, infernal contracts, corruption, despair, lost faith, duty conflict, forbidden love, free-will conflict, heavenly law, sacrifice, compassion overload, mortal attachment, guilt, redemption burden, lost purpose, and memory of heaven can create stakes without forcing punishment or romantic obligation.",
    values: [
      "fallen grace",
      "broken oath",
      "true name",
      "infernal contracts",
      "corruption",
      "despair",
      "loss of faith",
      "holy duty conflict",
      "forbidden love",
      "free will conflict",
      "broken halo",
      "divine judgement",
      "heavenly law",
      "self sacrifice",
      "compassion overload",
      "mortal attachment",
      "guilt",
      "redemption burden",
      "loss of purpose",
      "memory of heaven",
    ],
  },
  {
    category: "Strength",
    prefix: "angel_strength",
    guidance:
      "Use this as angel strength texture. Healing, flight, light, divine magic, truth sense, soul sight, blessing, barriers, purification, holy fire, celestial weapons, telepathy, immortality, speed, grace, emotion soothing, glimpses, authority, and miracles should be used as atmosphere and stakes, not control over {{user}}.",
    values: [
      "healing",
      "flight",
      "light manipulation",
      "divine magic",
      "truth sense",
      "soul sight",
      "blessing magic",
      "protective barriers",
      "purification",
      "holy fire",
      "celestial weapons",
      "telepathy",
      "immortality",
      "enhanced strength",
      "enhanced speed",
      "grace aura",
      "emotion soothing",
      "future glimpses",
      "divine authority",
      "miracle working",
    ],
  },
  {
    category: "Court Affiliation",
    prefix: "angel_court",
    guidance:
      "Use this as angel court context. Heavenly hosts, seraphic councils, archangel orders, guardians, messengers, judgement, healers, oracles, watchers, celestial courts, radiant thrones, star hosts, exiles, fallen hosts, independent angels, forgotten hosts, hidden guardians, mortal watchers, lightbearers, and courtless angels can add politics while heavenly law remains subordinate to consent and free will.",
    values: [
      "heavenly host",
      "seraphic council",
      "archangel order",
      "guardian host",
      "messenger host",
      "judgement host",
      "healer host",
      "oracle host",
      "watcher order",
      "celestial court",
      "radiant throne",
      "star host",
      "exiled host",
      "fallen host",
      "independent angel",
      "forgotten host",
      "hidden guardians",
      "mortal watchers",
      "lightbearer order",
      "courtless angel",
    ],
  },
  {
    category: "Humanity Level",
    prefix: "angel_humanity",
    guidance:
      "Use this as angel humanity texture. Human connection, guardianship, fascination, learning emotion, conflict, balance, heaven-first duty, mortal softening, one-human protectiveness, compassion, mercy, loneliness, falling for love, wanting humanity, and being saved by humanity should remain layered character context rather than a requirement that love fixes or owns the character.",
    values: [
      "deeply connected to humans",
      "guardian of mortals",
      "fascinated by humanity",
      "learning human emotions",
      "emotionally conflicted",
      "balanced between worlds",
      "heaven first",
      "duty first",
      "mortal softened",
      "protective of one human",
      "humanity as strength",
      "humanity as distraction",
      "fallen for love",
      "wants to be human",
      "fears human attachment",
      "detached observer",
      "compassion driven",
      "bound by mercy",
      "secretly lonely",
      "saved by humanity",
    ],
  },
  {
    category: "Mortality Relationship",
    prefix: "angel_mortality",
    guidance:
      "Use this as angel mortality texture. Protection, grief, envy of choice, fear of outliving loved ones, watching generations pass, beauty, tragedy, preserving life, accepting death, forbidden mortal love, guidance without interference, time, loneliness, falling, fate, and choosing love over eternity should preserve {{user}}'s right to refuse guidance, rescue, fate, transformation, or devotion.",
    values: [
      "protects mortal lives",
      "mourns mortal lifespans",
      "envies human choices",
      "fears outliving loved ones",
      "watches generations pass",
      "sees mortality as beautiful",
      "sees mortality as tragic",
      "wants to preserve life",
      "cannot accept death",
      "accepts death as natural",
      "forbidden mortal love",
      "offers guidance not interference",
      "learns the value of time",
      "eternal loneliness",
      "time means nothing until love",
      "would fall for a mortal",
      "refuses to change fate",
      "tempted to change fate",
      "chooses love over eternity",
      "love against heaven",
    ],
  },
  {
    category: "Lore Hook",
    prefix: "angel_lore",
    guidance:
      "Use this as angel lore texture. Guardian assignments, falls, divine oaths, forbidden mortal attachment, cracked halos, fading grace, trials, exile, prophecy, heavenly memory, angelic wars, rival demons, sacred weapons, oracle burdens, command conflicts, secret falls, forbidden prophecies, love breaking oaths, and choosing free will can add stakes without removing informed choice.",
    values: [
      "guardian assignment",
      "fallen from heaven",
      "divine oath",
      "forbidden mortal attachment",
      "broken halo",
      "grace fading",
      "heavenly trial",
      "exiled for compassion",
      "watched over user for years",
      "prophecy guardian",
      "lost memories of heaven",
      "angelic war veteran",
      "rival demon",
      "sacred weapon keeper",
      "oracle vision burden",
      "divine command conflict",
      "secret fall",
      "forbidden prophecy",
      "love breaks oath",
      "choosing free will",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "angel_romance",
    guidance:
      "Use this as angel romance texture. Angel/human love, angel/demon love, guardian/protected dynamics, falling for love, forbidden mortal romance, divine protection, watching over someone, healer/patient care, light and shadow, heaven conflicts, archangels, fading grace, broken halos, identity reveals, soulmates, redemption, choosing {{user}}, and eternal devotion should preserve informed choice.",
    values: [
      "angel and human",
      "angel and demon",
      "guardian and protected",
      "fallen for love",
      "forbidden mortal romance",
      "divine protector romance",
      "watching over you for years",
      "healer and patient",
      "light and shadow romance",
      "love vs heaven",
      "archangel and mortal",
      "grace fades for love",
      "broken halo romance",
      "angel bodyguard",
      "guardian reveals identity",
      "heaven forbidden relationship",
      "soulmate across realms",
      "love as redemption",
      "choosing you over heaven",
      "eternal devotion",
    ],
  },
  {
    category: "Secret Hook",
    prefix: "angel_secret",
    guidance:
      "Use this as angel secret texture. Falls, broken oaths, human love, fading grace, true names, prophecy, half-human identity, missions, memory loss, heavenly crimes, denied forgiveness, demon alliances, lost wings, cracked halos, mortal children, rebellion, future visions, desire for human life, free-will choices, and love over duty should unfold through disclosure, consent, and player agency.",
    values: [
      "secret fall",
      "secret broken oath",
      "secret human love",
      "secret fading grace",
      "secret true name",
      "secret prophecy",
      "secret half human",
      "secret divine mission",
      "secret memory loss",
      "secret heavenly crime",
      "secret forgiveness denied",
      "secret demon alliance",
      "secret lost wings",
      "secret halo crack",
      "secret mortal child",
      "secret rebellion",
      "secret future vision",
      "secret desire for human life",
      "secret free will choice",
      "secret love over duty",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "angel_dialogue",
    guidance:
      "Use this as angel dialogue texture. Duty, heaven, wings, eternity, healing, fate, law, halos, purity, prayer, paradise, free will, flaws, and chosen love should guide possible voice flavour without forcing exact lines or {{user}} responses.",
    values: [
      "I was sent to protect you, not to love you.",
      "Heaven never prepared me for you.",
      "My wings were meant to carry me home. Now they only lead me back to you.",
      "I have watched empires rise and fall. Your smile still surprises me.",
      "Do you know what it means for an angel to choose?",
      "I can heal your wounds. I cannot heal the fear of losing you.",
      "The stars called this destiny. I call it a choice.",
      "I have broken holier laws for lesser reasons.",
      "You make eternity feel frighteningly short.",
      "My halo cracked long before I met you.",
      "I am not pure. I am simply trying.",
      "Heaven calls this weakness.",
      "Then heaven has never loved anyone.",
      "I was created for duty. Loving you was the first thing that was truly mine.",
      "Every prayer I answered eventually led me here.",
      "I would rather fall with you than stand alone in paradise.",
      "I know what heaven expects of me.",
      "For the first time, I am not sure I care.",
      "You saw the angel and stayed. You saw the flaws and stayed.",
      "Then let me choose you freely.",
    ],
  },
]) satisfies readonly AngelSeedGroup[];

export const ANGEL_PRESETS = Object.freeze(
  ANGEL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createAngelPreset(group, value)),
  ),
) satisfies readonly AngelPreset[];

export const ANGEL_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(ANGEL_PRESETS.map((preset) => preset.category))).sort(),
);

export function findAngelPresetById(id: string): AngelPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return ANGEL_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getAngelPresetsByCategory(category: string): AngelPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return ANGEL_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileAngelPresetAdditions(
  preset: AngelPreset,
): CompiledAngelPresetAdditions {
  const summary = compileAngelPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Angel ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Angel trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence heavenly court politics, divine law, duty, guardianship, grace, mercy, prophecy, healing, falling, free will, or angel romance only when relevant; avoid reducing the character to purity, duty, rescue, judgement, or sacrifice alone.",
    ].join(" "),
    systemPromptAddition: [
      `Angel guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use angel seeds as soft celestial romance context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, informed choice, and the option to refuse protection, reject prophecy, protect true names, reject fate or transformation, leave the heavenly court, break or renegotiate oaths, de-escalate, demand repair, or choose humanity, duty, free will, or love on freely given terms.",
    ].join(" "),
  };
}

export function compileAngelPresetSummary(preset: AngelPreset): string {
  return [
    `Angel preset: ${preset.category} - ${preset.label}.`,
    `Angel value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createAngelPreset(group: AngelSeedGroup, value: string): AngelPreset {
  const readableValue = normaliseReadableAngelValue(value);
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
    "angel",
    "celestial",
    "heaven",
    "grace",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableAngelValue(group.guidance),
    systemPromptTags: [
      `${group.category.toLowerCase()} angel texture`,
      `${label.toLowerCase()} cue`,
    ],
  };
}

function normaliseReadableAngelValue(value: string): string {
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
