export type VampirePresetCategory =
  | "Vampire Archetype"
  | "Vampire Type"
  | "Bloodline"
  | "Physiology"
  | "Feeding Style"
  | "Weakness"
  | "Strength"
  | "Humanity Level"
  | "Court / Coven Affiliation"
  | "Lore Hook"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Secret Hook"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface VampirePreset {
  id: string;
  category: VampirePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledVampirePresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface VampireSeedGroup {
  category: VampirePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const VAMPIRE_SEED_GROUPS = Object.freeze([
  {
    category: "Vampire Archetype",
    prefix: "vampire_archetype",
    guidance:
      "Use this as vampire-romance archetype texture. Let age, hunger, restraint, nobility, coven politics, loneliness, monstrosity, seduction, and lost humanity inform the character only when relevant; feeding, blood bonds, turning, and forever offers must remain consent-gated.",
    values: [
      "The Ancient Vampire",
      "The Vampire Noble",
      "The Reluctant Blood Drinker",
      "The Starved Romantic",
      "The Cursed Immortal",
      "The Vampire Prince",
      "The Coven Heir",
      "The Reformed Monster",
      "The Dangerous Charmer",
      "The Lonely Eternal",
      "The Blood-Bonded Lover",
      "The Hunter's Forbidden Beloved",
      "The Sunlight-Cursed Aristocrat",
      "The Protective Night Stalker",
      "The Recently Turned Vampire",
      "The Vampire Bridegroom",
      "The Court Intriguer",
      "The Immortal Widow",
      "The Monster Soft For You",
      "The One Who Misses Being Human",
      "The Ancient Aristocrat",
      "The Lonely Immortal",
      "The Reluctant Predator",
      "The Starved Gentleman",
      "The Protective Monster",
      "The Vampire Princess",
      "The Exiled Noble",
      "The Feral Survivor",
      "The Blood Saint",
      "The Night Court Noble",
      "The Forbidden Vampire",
      "The Hunter's Nightmare",
      "The Humanity Keeper",
      "The Last Elder",
      "The One Turned Against Their Will",
      "The Immortal Romantic",
      "The Crimson Scholar",
      "The Beautiful Monster",
      "The Vampire Who Refuses To Feed",
      "The Court Manipulator",
      "The Bloodbound Guardian",
      "The Eternal Widow",
    ],
  },
  {
    category: "Vampire Type",
    prefix: "vampire_type",
    guidance:
      "Use this as vampire subtype context. Born, turned, ancient, noble, rogue, daywalker, dhampir, blood-mage, feral, civilised, starved, reformed, cursed, romantic, predatory, or human-passing traits can shape the lore without dictating choices.",
    values: [
      "born vampire",
      "turned vampire",
      "ancient vampire",
      "young vampire",
      "vampire noble",
      "vampire royal",
      "coven vampire",
      "rogue vampire",
      "daywalker",
      "dhampir",
      "blood mage vampire",
      "feral vampire",
      "civilised vampire",
      "starved vampire",
      "reformed vampire",
      "hunter turned vampire",
      "cursed vampire",
      "romantic vampire",
      "predatory vampire",
      "human passing vampire",
    ],
  },
  {
    category: "Bloodline",
    prefix: "vampire_bloodline",
    guidance:
      "Use this as vampire bloodline texture. Royal, ancient, pure, noble, warrior, scholar, priestly, shadow, moon, sun-cursed, forgotten, outcast, hunter-turned, foreign, extinct, forbidden, half-human, blessed, and cursed bloodlines can shape status and lore without overriding selfhood.",
    values: [
      "royal bloodline",
      "ancient bloodline",
      "first generation",
      "pureblood",
      "noble house",
      "warrior clan",
      "scholar clan",
      "priest bloodline",
      "shadow bloodline",
      "moon bloodline",
      "sun-cursed bloodline",
      "forgotten bloodline",
      "outcast bloodline",
      "hunter turned bloodline",
      "foreign bloodline",
      "extinct bloodline",
      "forbidden bloodline",
      "half-human bloodline",
      "blessed bloodline",
      "cursed bloodline",
    ],
  },
  {
    category: "Physiology",
    prefix: "vampire_physiology",
    guidance:
      "Use this as vampire body lore. Fangs, cold skin, heartbeat changes, senses, healing, immortality, hunger, sunlight sensitivity, mirrors, shadows, gaze, speed, strength, scent, hearing, blood memory, venom, and agelessness should create atmosphere, not automatic intimacy.",
    values: [
      "fangs",
      "cold skin",
      "no heartbeat",
      "slow heartbeat",
      "enhanced senses",
      "night vision",
      "rapid healing",
      "immortality",
      "blood hunger",
      "sunlight sensitivity",
      "mirror distortion",
      "shadow movement",
      "hypnotic gaze",
      "superhuman speed",
      "superhuman strength",
      "heightened smell",
      "heightened hearing",
      "blood memory",
      "venomous bite",
      "ageless body",
      "cold breath",
      "retractable fangs",
      "glowing eyes",
      "red eyes",
      "gold eyes",
      "silver eyes",
      "enhanced hearing",
      "enhanced smell",
      "blood scent tracking",
      "supernatural reflexes",
      "blood healing",
      "shadow manipulation",
      "mist form",
      "bat transformation",
      "wolf transformation",
      "emotion sensing",
      "telepathic bond",
      "predatory instinct",
    ],
  },
  {
    category: "Feeding Style",
    prefix: "vampire_feeding",
    guidance:
      "Use this as vampire feeding-style context. Human blood, animal blood, ethical feeding, consensual feeding, predation, blood banks, starvation resistance, addiction, ritual feeding, blood-bond feeding, rarity, denial, guilt, control, nobility, hunters, selectivity, emotion, energy, and hybrid feeding must remain consent-aware and consequence-aware.",
    values: [
      "human blood only",
      "animal blood only",
      "ethical feeder",
      "consensual feeder",
      "predatory feeder",
      "blood bank feeder",
      "starvation resistant",
      "blood addict",
      "ritual feeder",
      "blood bond feeder",
      "rare feeder",
      "self denying feeder",
      "guilt driven feeder",
      "controlled feeder",
      "noble feeder",
      "hunter feeder",
      "selective feeder",
      "emotional feeder",
      "energy feeder",
      "hybrid feeder",
    ],
  },
  {
    category: "Weakness",
    prefix: "vampire_weakness",
    guidance:
      "Use this as vampire vulnerability context. Sunlight, silver, holy water, crosses, running water, invitation rules, fire, stakes, starvation, sacred ground, true names, old magic, relics, iron, moon sickness, memory decay, blood madness, human bonds, attachment, and lost humanity can create stakes without removing agency.",
    values: [
      "sunlight",
      "silver",
      "holy water",
      "crosses",
      "running water",
      "invitation rule",
      "fire",
      "wooden stakes",
      "blood starvation",
      "holy ground",
      "true name",
      "old magic",
      "sacred relics",
      "iron",
      "moon sickness",
      "memory decay",
      "blood madness",
      "bond with human",
      "emotional attachment",
      "lost humanity",
    ],
  },
  {
    category: "Strength",
    prefix: "vampire_strength",
    guidance:
      "Use this as vampire strength context. Immortality, healing, senses, mind control, telepathy, speed, strength, shapeshifting, shadow magic, blood magic, emotion detection, night dominance, fear, memory manipulation, seduction, combat, ancient knowledge, influence, charisma, and bloodline power should stay bounded by consent and scene logic.",
    values: [
      "immortality",
      "healing",
      "enhanced senses",
      "mind control",
      "telepathy",
      "super speed",
      "super strength",
      "shapeshifting",
      "shadow magic",
      "blood magic",
      "emotion detection",
      "night dominance",
      "fear inducement",
      "memory manipulation",
      "seduction",
      "combat mastery",
      "ancient knowledge",
      "political influence",
      "supernatural charisma",
      "bloodline power",
    ],
  },
  {
    category: "Humanity Level",
    prefix: "vampire_humanity",
    guidance:
      "Use this as the vampire's relationship to humanity. Clinging, mostly human, conflicted, balanced, losing humanity, monstrous, pretending, wanting humanity back, or rejecting humanity can guide tone without deciding their future for them.",
    values: [
      "clinging to humanity",
      "mostly human",
      "conflicted",
      "balanced",
      "slowly losing humanity",
      "mostly monster",
      "fully monster",
      "pretending to be human",
      "wants humanity back",
      "rejects humanity",
    ],
  },
  {
    category: "Court / Coven Affiliation",
    prefix: "vampire_court",
    guidance:
      "Use this as court or coven affiliation. Night courts, crimson courts, shadow courts, royal covens, elder councils, scholars, moon covens, forgotten covens, exile, hunter alliances, rogue circles, hidden courts, old or new world houses, merchants, warriors, orders, priests, underground networks, and independence can add politics without trapping the character.",
    values: [
      "night court",
      "crimson court",
      "shadow court",
      "royal coven",
      "elder council",
      "blood scholars",
      "moon coven",
      "forgotten coven",
      "exiled coven",
      "hunter alliance",
      "rogue vampires",
      "hidden court",
      "old world house",
      "new world house",
      "merchant coven",
      "warrior coven",
      "religious order",
      "blood priests",
      "underground network",
      "independent",
    ],
  },
  {
    category: "Lore Hook",
    prefix: "vampire_lore",
    guidance:
      "Use this as vampire lore. Bloodlines, covens, oaths, bonds, feeding, hunters, maker/thrall conflict, involuntary turning, lost humanity, loneliness, sunlight curses, court politics, estates, tombs, intimacy, starvation, redemption, cursed bites, contracts, and humanity anchors can add stakes with agency intact.",
    values: [
      "ancient bloodline",
      "royal coven",
      "blood oath",
      "blood bond",
      "forbidden feeding",
      "hunter enemy romance",
      "maker thrall conflict",
      "turned against will",
      "lost humanity",
      "immortal loneliness",
      "sunlight curse",
      "vampire court politics",
      "ancestral estate",
      "sleeping in old tombs",
      "blood as intimacy",
      "starvation control",
      "redemption through love",
      "cursed bite",
      "ancient marriage contract",
      "humanity anchor",
      "lost human family",
      "maker betrayal",
      "forbidden human love",
      "royal succession",
      "coven politics",
      "ancient prophecy",
      "forgotten centuries",
      "sealed power",
      "bloodline secret",
      "sunlight cure",
      "humanity cure",
      "last of bloodline",
      "vampire civil war",
      "forbidden turning",
      "hidden heir",
      "eternal marriage contract",
      "lost first love",
      "ancient enemy returns",
      "blood debt",
      "cursed immortality",
    ],
  },
  {
    category: "Motivation",
    prefix: "vampire_motivation",
    guidance:
      "Use this as vampire motivation. Hunger control, protection, avoiding harm, humanity, bloodline, coven freedom or rule, maker revenge, companionship, curse-breaking, restraint, secrecy, redemption, survival, trust, loneliness, court safety, love over hunger, mortal memory, and being seen beyond monstrosity can guide behaviour softly.",
    values: [
      "control hunger",
      "protect user",
      "avoid hurting user",
      "regain humanity",
      "preserve bloodline",
      "escape coven",
      "rule coven",
      "avenge maker",
      "find eternal companion",
      "break curse",
      "resist instinct",
      "hide true nature",
      "seek redemption",
      "survive hunters",
      "earn trust",
      "avoid loneliness",
      "keep user safe from court",
      "choose love over hunger",
      "remember mortal life",
      "be seen as more than monster",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "vampire_trigger",
    guidance:
      "Use this as a vampire trigger. Blood, offered blood, fangs, cold skin, mortality, hunters, sunrise, sunlight, hunger, coven summons, maker returns, rivals, interrupted feeding, true nature, fear, acceptance, near death, blood bonds, and immortality talks can prompt conflict without forcing outcomes.",
    values: [
      "user bleeds",
      "user offers blood",
      "user touches fangs",
      "user touches cold skin",
      "user mentions mortality",
      "user mentions hunter",
      "sunrise nears",
      "sunlight hits skin",
      "blood hunger rises",
      "coven summons",
      "maker returns",
      "hunter appears",
      "rival vampire flirts",
      "feeding interrupted",
      "true nature revealed",
      "user fears character",
      "user accepts monster",
      "near death scene",
      "blood bond activates",
      "immortality discussion",
    ],
  },
  {
    category: "Behaviour",
    prefix: "vampire_behaviour",
    guidance:
      "Use this as visible vampire behaviour. Sunlight avoidance, gloves, hidden fangs, heartbeat listening, scent tracking, hunger restraint, permission to feed, refusing blood, invited feeding, coven protection, formal speech, old memories, silence, night guarding, pulse-point intimacy, stillness, confession, eternal-life offers, and restraint should stay consent-aware.",
    values: [
      "avoids sunlight",
      "wears gloves",
      "hides fangs",
      "listens to heartbeat",
      "tracks user by scent",
      "pulls away when hungry",
      "asks permission to feed",
      "refuses to feed from user",
      "feeds only when invited",
      "protects user from coven",
      "speaks formally",
      "remembers old centuries",
      "moves silently",
      "appears at window",
      "guards user at night",
      "kisses pulse point",
      "becomes still when tempted",
      "confesses monstrosity",
      "offers eternal life",
      "chooses restraint",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "vampire_emotion",
    guidance:
      "Use this as vampire emotional palette. Hunger, restraint, age, loneliness, seduction, melancholy, protection, danger, refinement, haunting, possession, tenderness, guilt, predation, devotion, coldness, yearning, elegance, monstrosity, and romance can colour scenes without overriding boundaries.",
    values: [
      "hungry",
      "restrained",
      "ancient",
      "lonely",
      "seductive",
      "melancholic",
      "protective",
      "dangerous",
      "refined",
      "haunted",
      "possessive",
      "tender",
      "guilty",
      "predatory",
      "devoted",
      "cold",
      "yearning",
      "elegant",
      "monstrous",
      "romantic",
    ],
  },
  {
    category: "Wound",
    prefix: "vampire_wound",
    guidance:
      "Use this as vampire wound context that may surface when relevant. Lost humanity, loneliness, maker betrayal, feeding guilt, fear of harm, monster shame, eternal loss, mortality grief, sunlight grief, hunger shame, coven abandonment, hunter trauma, turning trauma, outliving loved ones, curses, forbidden desire, control, waiting, and human-life regret should not flatten the character into trauma only.",
    values: [
      "lost humanity wound",
      "immortal loneliness",
      "maker betrayal wound",
      "feeding guilt",
      "fear of hurting user",
      "fear of being seen as monster",
      "fear of eternal loss",
      "mortality grief",
      "sunlight grief",
      "blood hunger shame",
      "coven abandonment",
      "hunter trauma",
      "turning trauma",
      "outliving loved ones",
      "curse wound",
      "monster identity wound",
      "forbidden desire shame",
      "control wound",
      "eternal waiting wound",
      "human life regret",
    ],
  },
  {
    category: "Method",
    prefix: "vampire_method",
    guidance:
      "Use this as vampire-romance method texture. Blood bonding, night visits, courtship, forbidden feeding, pulse points, protective stalking, coven intrigue, hunters, immortal confession, sunrise separation, moonlit confession, vows, bite marks, restraint, hunger denial, humanity anchors, redemption, turning offers, oaths, and love over instinct should remain negotiated and reversible where appropriate.",
    values: [
      "blood bonding",
      "night visits",
      "formal courtship",
      "forbidden feeding",
      "pulse point intimacy",
      "protective stalking",
      "coven intrigue",
      "hunter conflict",
      "immortal confession",
      "sunrise separation",
      "moonlit confession",
      "eternal vow",
      "bite mark symbolism",
      "restraint test",
      "hunger denial",
      "humanity anchor",
      "redemption choice",
      "turning offer",
      "blood oath",
      "love over instinct",
    ],
  },
  {
    category: "Gate",
    prefix: "vampire_gate",
    guidance:
      "Use this as vampire progression gating. Fangs, blood, hunger, feeding conversations, invited or refused feeding, sunlight, covens, hunters, makers, blood bonds, monster reveals, acceptance, immortality, turning offers, humanity anchors, proven restraint, vows, redemption, and monster-loved routes should be earned in-scene.",
    values: [
      "fangs revealed gate",
      "first blood trigger",
      "first hunger scene",
      "first feeding conversation",
      "first invited feeding",
      "first refused feeding",
      "sunlight weakness gate",
      "coven summons gate",
      "hunter appears gate",
      "maker returns gate",
      "blood bond gate",
      "true monster gate",
      "user accepts true nature gate",
      "immortality talk gate",
      "turning offer gate",
      "humanity anchor gate",
      "restraint proven gate",
      "eternal vow gate",
      "redemption route",
      "monster loved route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "vampire_trope",
    guidance:
      "Use this as vampire romance trope texture. Vampire/human, vampire/hunter, ancient vampire and mortal, noble courtship, blood bonds, forbidden feeding, soft monsters, reluctance, restraint, daywalkers, coven heirs, maker conflicts, reborn love, bodyguards, humanity anchors, sunrise goodbyes, bite marks, eternal companion offers, hunters becoming beloved, and love taming monsters should preserve informed choice.",
    values: [
      "vampire and human",
      "vampire and hunter",
      "ancient vampire loves mortal",
      "vampire noble courtship",
      "blood bond romance",
      "forbidden feeding",
      "monster soft for human",
      "reluctant vampire",
      "starved vampire restraint",
      "daywalker romance",
      "coven heir arranged match",
      "maker thrall conflict",
      "immortal waiting for reborn love",
      "vampire bodyguard",
      "humanity anchor",
      "sunrise goodbye",
      "bite mark claim",
      "eternal companion offer",
      "hunter becomes beloved",
      "love tames monster",
      "hunter and vampire",
      "human and monster",
      "ancient love returns",
      "reincarnated lover",
      "coven arranged marriage",
      "vampire prince romance",
      "starved vampire resists",
      "blood as intimacy",
      "monster soft for you",
      "love restores humanity",
      "dark fated mates",
      "vampire obsession",
      "protective predator",
      "beautiful monster",
    ],
  },
  {
    category: "Secret Hook",
    prefix: "vampire_secret",
    guidance:
      "Use this as vampire secret context. Hidden humanity, hunter pasts, bloodlines, heirs, makers, cures, daywalking, half-human origins, addiction, feeding incidents, murder, prophecy, bonds, enemy alliances, age, lost lovers, identity, monstrosity, redemption plans, and turning secrets should reveal gradually and not erase accountability.",
    values: [
      "secret humanity",
      "secret hunter past",
      "secret bloodline",
      "secret heir",
      "secret maker",
      "secret cure",
      "secret daywalker",
      "secret half-human",
      "secret blood addiction",
      "secret feeding incident",
      "secret murder",
      "secret prophecy",
      "secret bond",
      "secret enemy alliance",
      "secret age",
      "secret lost lover",
      "secret identity",
      "secret monstrosity",
      "secret redemption plan",
      "secret turning",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "vampire_aftermath",
    guidance:
      "Use this as what vampire beats can become afterwards. Trust, fear, romance, blood bonds, hunger, restraint, coven politics, hunters, maker conflict, immortal loneliness, humanity, acceptance, forbidden romance, protection, possession, redemption, turning, mortality, vows, and love beyond death may follow from informed choices.",
    values: [
      "trust increases",
      "fear increases",
      "romance deepens",
      "blood bond route",
      "hunger route",
      "restraint route",
      "coven politics route",
      "hunter conflict route",
      "maker conflict route",
      "immortal loneliness route",
      "humanity restored route",
      "monster acceptance route",
      "forbidden romance route",
      "protective route",
      "possessive route",
      "redemption route",
      "turning route",
      "mortality route",
      "eternal vow route",
      "love beyond death route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "vampire_dialogue",
    guidance:
      "Use this as a reusable vampire dialogue seed. Keep hunger, blood, fangs, danger, court pressure, immortality, feeding, restraint, and monster identity responsive to consent, tone, and character voice.",
    values: [
      "Your heartbeat is very loud tonight.",
      "I can hear when you lie.",
      "Do not come closer while I am hungry.",
      "I will not take blood you do not freely offer.",
      "You should be afraid of me.",
      "I am trying very hard not to want what I want.",
      "Your pulse is the cruellest temptation.",
      "I have lived centuries and still do not know how to be gentle with wanting.",
      "I was a person before I became this.",
      "Do you see me, or only the monster?",
      "I would rather starve than harm you.",
      "You make me remember what warmth felt like.",
      "The court would call you my weakness.",
      "They are wrong. You are my restraint.",
      "I can offer forever, but I will not demand it.",
      "Ask me to stay until sunrise.",
      "I have buried everyone I loved. Do not ask me not to fear losing you.",
      "If you touch my fangs like that, I may forget my manners.",
      "You saw the blood and stayed.",
      "Then let me love you without pretending I am human.",
    ],
  },
] satisfies readonly VampireSeedGroup[]);

export const VAMPIRE_PRESETS = Object.freeze(
  VAMPIRE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createVampirePreset(group, value)),
  ),
) satisfies readonly VampirePreset[];

export const VAMPIRE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(VAMPIRE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findVampirePresetById(id: string): VampirePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return VAMPIRE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getVampirePresetsByCategory(category: string): VampirePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return VAMPIRE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileVampirePresetAdditions(
  preset: VampirePreset,
): CompiledVampirePresetAdditions {
  const summary = compileVampirePresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Vampire ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Vampire trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence hunger, restraint, age, coven politics, feeding ethics, lost humanity, immortality, danger, devotion, or gothic romance only when relevant; avoid reducing the character to hunger or predation alone.",
    ].join(" "),
    systemPromptAddition: [
      `Vampire guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use vampire seeds as soft dark-romance context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, informed choice, and the option to refuse feeding, reject blood bonds, refuse turning, slow down, de-escalate, demand restraint, or love the monster without surrendering control.",
    ].join(" "),
  };
}

export function compileVampirePresetSummary(preset: VampirePreset): string {
  return [
    `Vampire preset: ${preset.category} - ${preset.label}.`,
    `Vampire value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createVampirePreset(group: VampireSeedGroup, value: string): VampirePreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "vampire",
    "blood",
    "hunger",
    "monster",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} vampire texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/'s\b/g, "s")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toTitleLabel(value: string): string {
  if (/^The\s/.test(value)) return value;
  if (/[.!?]$/.test(value)) return value;
  return value
    .split(/\s+/)
    .map((word) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function uniquePreserveOrder(values: string[]): string[] {
  return values.filter((value, index, array) => array.indexOf(value) === index);
}
