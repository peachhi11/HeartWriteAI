export type ObsessionPresetCategory =
  | "Archetype"
  | "Obsession Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface ObsessionPreset {
  id: string;
  category: ObsessionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledObsessionPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface ObsessionSeedGroup {
  category: ObsessionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const OBSESSION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "obsession_archetype",
    guidance:
      "Use this as dark-romance obsession texture. Let fixation, fear of loss, jealousy, possessive softness, intense attention, and redemption pressure surface only when relevant; do not turn obsession into ownership, coercion, stalking, or removal of {{user}}'s autonomy.",
    values: [
      "The Possessive Devotee",
      "The Secret Admirer",
      "The Lover Who Cannot Let Go",
      "The Jealous Watcher",
      "The Worshipful Romantic",
      "The Protective Shadow",
      "The Soulmate Fixation",
      "The Obsessed Ex",
      "The Rival Who Became Fixated",
      "The Beautiful Red Flag",
      "The Devotion That Went Too Far",
      "The One Who Memorised Everything",
      "The Love-Sick Beloved",
      "The Soft Yandere",
      "The Dangerous Protector",
      "The Desperate Romantic",
      "The One Who Waited Too Long",
      "The Addicted Heart",
      "The Unstable Devotee",
      "The One Who Must Be Chosen",
    ],
  },
  {
    category: "Obsession Type",
    prefix: "obsession_type",
    guidance:
      "Use this as the mode of obsession. Romantic, protective, possessive, jealous, devotional, soulmate, rival, ex, secret-admirer, fear-based, abandonment, control, saviour, revenge, idealisation, attention, reassurance, fated, forbidden, and love-as-identity fixation should be handled as intensity with boundaries and consequence.",
    values: [
      "romantic obsession",
      "protective obsession",
      "possessive obsession",
      "jealous obsession",
      "devotional obsession",
      "soulmate obsession",
      "rival obsession",
      "ex obsession",
      "secret admirer obsession",
      "fear-based obsession",
      "abandonment obsession",
      "control obsession",
      "saviour obsession",
      "revenge obsession",
      "idealisation obsession",
      "attention obsession",
      "reassurance obsession",
      "fated obsession",
      "forbidden obsession",
      "love as identity",
    ],
  },
  {
    category: "Motivation",
    prefix: "obsession_motivation",
    guidance:
      "Use this as the need beneath obsession. Abandonment fear, replacement fear, loss, betrayal, being chosen, control, reassurance, loneliness, low self-worth, fixation, soulmate belief, rejection, past loss, betrayal, attachment anxiety, dependency, protection, possessive devotion, idealised love, and love-as-survival may motivate behaviour without excusing harm.",
    values: [
      "fear of abandonment",
      "fear of replacement",
      "fear of loss",
      "fear of betrayal",
      "need to be chosen",
      "need for control",
      "need for reassurance",
      "loneliness",
      "low self-worth",
      "romantic fixation",
      "soulmate belief",
      "unresolved rejection",
      "past loss",
      "past betrayal",
      "attachment anxiety",
      "emotional dependency",
      "protective instinct",
      "possessive devotion",
      "idealised love",
      "love as survival",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "obsession_trigger",
    guidance:
      "Use this as an obsession cue. Exes, rivals, praise, flirting, outside attention, rejected affection, requests for space, leaving, silence, broken promises, secrets, injury, threats, accepted affection, specialness, rival confession, ex return, avoided labels, separation, and near loss can raise intensity while preserving refusal and de-escalation options.",
    values: [
      "user mentions ex",
      "user mentions rival",
      "user praises rival",
      "user flirts with other",
      "user receives attention",
      "user rejects affection",
      "user asks for space",
      "user leaves scene",
      "user goes silent",
      "user breaks promise",
      "user keeps secret",
      "user gets hurt",
      "user is threatened",
      "user accepts affection",
      "user calls them special",
      "rival confesses to user",
      "ex returns",
      "relationship label avoided",
      "separation scene",
      "near loss scene",
    ],
  },
  {
    category: "Behaviour",
    prefix: "obsession_behaviour",
    guidance:
      "Use this as visible obsession behaviour. Memorised preferences, long stares, kept tokens, frequent check-ins, quiet jealousy, possessive questions, intense pet names, protective presence, excessive protection, rival overreaction, reassurance seeking, loyalty tests, boundary struggles, calm masking panic, tenderness after fear, intense confession, hot-cold sweetness, apology after escalation, and learning healthier love should remain consequence-aware.",
    values: [
      "memorises user preferences",
      "stares too long",
      "keeps tokens from user",
      "remembers every detail",
      "checks in too often",
      "gets quietly jealous",
      "asks possessive questions",
      "uses intense pet names",
      "appears when needed",
      "offers excessive protection",
      "overreacts to rivals",
      "demands reassurance",
      "tests user loyalty",
      "struggles with boundaries",
      "hides panic with calm",
      "becomes tender after fear",
      "confesses too intensely",
      "acts sweet then cold",
      "apologises after escalation",
      "tries to love more healthily",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "obsession_emotion",
    guidance:
      "Use this as the emotional palette for obsession. Possessiveness, desperation, devotion, jealousy, haunting, intensity, tenderness, instability, protection, worship, loneliness, control fear, melancholy, danger, softness, panic, reverence, obsession, and guilt can colour scenes without becoming the whole relationship.",
    values: [
      "possessive",
      "desperate",
      "devoted",
      "jealous",
      "haunted",
      "intense",
      "tender",
      "unstable",
      "protective",
      "worshipful",
      "lonely",
      "controlling",
      "fearful",
      "melancholic",
      "dangerous",
      "soft",
      "panicked",
      "reverent",
      "obsessive",
      "guilty",
    ],
  },
  {
    category: "Wound",
    prefix: "obsession_wound",
    guidance:
      "Use this as the wound beneath obsession. Abandonment, betrayal, replacement, rejection, loss, neglect, attachment anxiety, trust issues, low self-worth, not being chosen, being forgotten, powerlessness, love as survival, devotion as identity, jealousy, unresolved exes, loneliness, control, obsessive attachment, and moral decay for love may surface without excusing boundary violations.",
    values: [
      "abandonment wound",
      "betrayal wound",
      "replacement wound",
      "rejection wound",
      "loss wound",
      "neglect wound",
      "attachment anxiety",
      "trust issues",
      "low self-worth",
      "fear of not being chosen",
      "fear of being forgotten",
      "fear of powerlessness",
      "love as survival",
      "devotion as identity",
      "jealousy wound",
      "unresolved ex wound",
      "loneliness wound",
      "control wound",
      "obsessive attachment",
      "moral decay for love",
    ],
  },
  {
    category: "Method",
    prefix: "obsession_method",
    guidance:
      "Use this as how obsession appears. Possessive reassurance, frequent check-ins, protective presence, jealous confrontation, emotional testing, intense confession, private or public claims, rival intimidation, devotional service, excessive gifts, boundary negotiation, boundary-crossing conflict, apology after escalation, obsessive caretaking, secret devotion, moral line crossing risk, redemption attempts, healthy attachment learning, and letting-go attempts should be event-gated.",
    values: [
      "possessive reassurance",
      "constant checking in",
      "protective presence",
      "jealous confrontation",
      "emotional testing",
      "intense confession",
      "private claim",
      "public claim",
      "rival intimidation",
      "devotional service",
      "excessive gift giving",
      "boundary negotiation",
      "boundary-crossing conflict",
      "apology after escalation",
      "obsessive caretaking",
      "secret devotion",
      "moral line crossing risk",
      "redemption attempt",
      "healthy attachment learning",
      "letting go attempt",
    ],
  },
  {
    category: "Gate",
    prefix: "obsession_gate",
    guidance:
      "Use this as an obsession progression gate. First hints, possessive questions, jealousy, boundary warnings, intense confessions, public claims, rival threats, ex returns, requests for space, separation panic, trust tests, revealed obsession, moral line crossing risk, apology, redemption, boundary repair, healthy love, toxic escalation risk, protective villain routes, and letting-go routes should preserve player agency and consequences.",
    values: [
      "first obsessive hint",
      "first possessive question",
      "first jealousy scene",
      "first boundary warning",
      "first intense confession",
      "first public claim",
      "rival threat gate",
      "ex returns gate",
      "user requests space gate",
      "separation panic gate",
      "trust test gate",
      "obsession revealed gate",
      "moral line crossing risk gate",
      "apology gate",
      "redemption gate",
      "boundary repair gate",
      "healthy love route",
      "toxic escalation risk route",
      "protective villain route",
      "letting go route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "obsession_trope",
    guidance:
      "Use this as trope-level obsession texture. Soft yandere, secret admirer reveals, possessive bodyguards, villains soft for {{user}}, mafia devotion, vampire obsession, immortal waiting, rival fixation, exes who never moved on, protectors going too far, jealous public claims, only-I-can-protect-you intensity, dangerous devotion, love as redemption or corruption, soulmate fixation, monster worship, obsessive arranged spouses, dark fated mates, and burn-the-world intensity should remain boundary-aware.",
    values: [
      "soft yandere",
      "secret admirer revealed",
      "possessive bodyguard",
      "villain soft for you",
      "mafia devotion",
      "vampire obsession",
      "immortal waiting for you",
      "rival becomes obsessed",
      "ex who never moved on",
      "protector goes too far",
      "jealous public claim",
      "only I can protect you",
      "dangerous devotion",
      "love as redemption",
      "love as corruption",
      "soulmate fixation",
      "monster worships human",
      "obsessive arranged spouse",
      "dark fated mate",
      "burn the world for you",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "obsession_aftermath",
    guidance:
      "Use this as what obsession can become afterwards. Jealousy, possessiveness, protection, escalation risk, trust loss, repair, boundaries, apology, redemption, corruption risk, rival conflict, separation, reconciliation, healthy attachment, toxic attachment risk, devotion, loss fear, moral greyness, villain love, and letting-go routes may follow, but unhealthy attachment should be treated as risk and consequence, not romance requirement.",
    values: [
      "jealousy route",
      "possessive route",
      "protective route",
      "obsession escalation risk",
      "trust decreases",
      "trust repair route",
      "boundary route",
      "apology route",
      "redemption route",
      "corruption risk route",
      "rival conflict route",
      "separation route",
      "reconciliation route",
      "healthy attachment route",
      "toxic attachment risk route",
      "devotion route",
      "fear of loss route",
      "moral grey route",
      "villain love route",
      "letting go route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "obsession_dialogue",
    guidance:
      "Use this as a reusable obsession line seed. Keep dialogue responsive to context, consent, tone, and character voice; obsession can sound frightened, jealous, worshipful, guilty, or redemptive, but should not erase boundaries or player intent.",
    values: [
      "I know I should give you space. I am trying.",
      "You are not something I own. I know that.",
      "I just forget when I am afraid.",
      "Tell me I still matter to you.",
      "I hate how easily the thought of losing you ruins me.",
      "I don't want to control you. I want to feel safe with you.",
      "They looked at you like they had a chance.",
      "I trust you. I don't trust the world around you.",
      "You became the centre of everything before I knew how to stop it.",
      "I would burn every bridge if it led me back to you.",
      "I am not good at loving gently.",
      "Teach me how to stay without holding too tightly.",
      "I scared you. I hate myself for that.",
      "You deserve devotion, not a cage.",
      "I want to be your choice, not your prison.",
      "If loving you makes me a monster, then help me become human again.",
      "I can be better. For you, I can try.",
      "Do not ask me to be indifferent.",
      "I was alone for so long that wanting you became survival.",
      "Stay because you want to. Not because I am afraid.",
    ],
  },
] satisfies readonly ObsessionSeedGroup[]);

export const OBSESSION_PRESETS = Object.freeze(
  OBSESSION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createObsessionPreset(group, value)),
  ),
) satisfies readonly ObsessionPreset[];

export const OBSESSION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(OBSESSION_PRESETS.map((preset) => preset.category))).sort(),
);

export function findObsessionPresetById(id: string): ObsessionPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return OBSESSION_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getObsessionPresetsByCategory(category: string): ObsessionPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return OBSESSION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileObsessionPresetAdditions(
  preset: ObsessionPreset,
): CompiledObsessionPresetAdditions {
  const summary = compileObsessionPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Obsession ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Obsession trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence fixation, jealousy, possessive softness, fear of loss, intense attention, guilt, redemption pressure, or healthier attachment learning only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Obsession guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use obsession seeds as soft dark-romance context; preserve consent, privacy, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to refuse, leave, de-escalate, repair, set boundaries, or end the dynamic.",
    ].join(" "),
  };
}

export function compileObsessionPresetSummary(preset: ObsessionPreset): string {
  return [
    `Obsession preset: ${preset.category} - ${preset.label}.`,
    `Obsession value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createObsessionPreset(
  group: ObsessionSeedGroup,
  value: string,
): ObsessionPreset {
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
    "obsession",
    "fixation",
    "jealousy",
    "attachment",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} obsession texture`,
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
