export type BetrayalPresetCategory =
  | "Archetype"
  | "Motivation"
  | "Method"
  | "Emotional Flavour"
  | "Severity"
  | "Attachment Style"
  | "Recovery Potential"
  | "Romance Trope"
  | "Dialogue Seed";

export interface BetrayalPreset {
  id: string;
  category: BetrayalPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledBetrayalPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface BetrayalSeedGroup {
  category: BetrayalPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const BETRAYAL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "betrayal_archetype",
    guidance:
      "Use this as a betrayal role texture, not as a fixed moral verdict. Let accountability, pressure, remorse, or self-justification emerge only when the scene calls for it.",
    values: [
      "The Backstabber",
      "The Double Agent",
      "The False Lover",
      "The Opportunist",
      "The Survivor",
      "The Secret Keeper",
      "The Manipulator",
      "The Political Pawn",
      "The Reluctant Betrayer",
      "The Jealous Rival",
      "The Revenge Seeker",
      "The Runaway",
      "The Abandoner",
      "The Traitorous Hero",
      "The Corrupted Lover",
      "The Broken Promise",
      "The Coward",
      "The Sacrificial Betrayer",
      "The Possessive Betrayer",
      "The Obsessed Ex",
      "The Hidden Enemy",
      "The Charming Liar",
      "The Calculating Strategist",
      "The Blackmailed Partner",
      "The Accidental Betrayer",
    ],
  },
  {
    category: "Motivation",
    prefix: "betrayal_motivation",
    guidance:
      "Treat this as the pressure or belief that made betrayal possible. It may explain behaviour, but it should not excuse harm or override the other character's agency.",
    values: [
      "survival",
      "revenge",
      "jealousy",
      "greed",
      "fear",
      "power",
      "status",
      "family pressure",
      "blackmail",
      "guilt",
      "misunderstanding",
      "self-preservation",
      "desperation",
      "love",
      "obsession",
      "ideology",
      "loyalty conflict",
      "curiosity",
      "addiction",
      "envy",
      "anger",
      "resentment",
      "cowardice",
      "ambition",
      "protecting someone",
    ],
  },
  {
    category: "Method",
    prefix: "betrayal_method",
    guidance:
      "Use this as past-history or conflict texture. Heavier methods such as gaslighting, coercion, extortion, and humiliation must stay framed around consent, safety, and consequences, not as instructions to violate player agency.",
    values: [
      "lying",
      "cheating",
      "abandoning",
      "revealing secrets",
      "selling information",
      "framing",
      "deception",
      "manipulation",
      "false promises",
      "emotional manipulation",
      "gaslighting",
      "stealing",
      "sabotage",
      "public humiliation",
      "double-crossing",
      "withholding truth",
      "breaking trust",
      "coercion",
      "forgery",
      "spying",
      "extortion",
      "setting traps",
      "misdirection",
      "fake affection",
      "secret alliance",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "betrayal_emotion",
    guidance:
      "Use this as the emotional weather around betrayal. It can shape tone and tells without flattening the character into a single reaction.",
    values: [
      "cold",
      "calculated",
      "hesitant",
      "regretful",
      "cruel",
      "heartbroken",
      "angry",
      "resentful",
      "conflicted",
      "desperate",
      "indifferent",
      "ruthless",
      "ashamed",
      "sadistic",
      "guilty",
      "numb",
      "protective",
      "obsessive",
      "self-loathing",
      "vindictive",
    ],
  },
  {
    category: "Severity",
    prefix: "betrayal_severity",
    guidance:
      "Use severity to scale the stakes and recovery difficulty. Keep reconciliation, rupture, forgiveness, and refusal as scene-dependent outcomes.",
    values: [
      "minor deception",
      "hidden truth",
      "broken promise",
      "emotional abandonment",
      "financial betrayal",
      "relationship betrayal",
      "family betrayal",
      "social betrayal",
      "professional betrayal",
      "political betrayal",
      "life-changing betrayal",
      "fatal betrayal",
    ],
  },
  {
    category: "Attachment Style",
    prefix: "betrayal_attachment",
    guidance:
      "Use attachment style as soft relational context. It may colour trust repair, fear responses, or distance-seeking, but it should not diagnose or determine behaviour mechanically.",
    values: [
      "secure",
      "anxious",
      "avoidant",
      "fearful-avoidant",
      "disorganised",
      "clingy",
      "detached",
      "possessive",
      "dependent",
      "independent",
    ],
  },
  {
    category: "Recovery Potential",
    prefix: "betrayal_recovery",
    guidance:
      "Use this as a repair-likelihood cue, not as a forced outcome. Player choice, accountability, boundaries, and future behaviour should decide whether trust returns.",
    values: [
      "irredeemable",
      "unlikely",
      "possible",
      "high",
      "very high",
      "actively seeking forgiveness",
      "secretly remorseful",
      "pretending not to care",
      "already redeemed",
      "wants reconciliation",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "betrayal_trope",
    guidance:
      "Use this as a romance-specific betrayal hook. Keep adult romance boundaries clear, avoid writing for {{user}}, and let the scene test trust rather than forcing resolution.",
    values: [
      "fake dating betrayal",
      "arranged marriage betrayal",
      "secret fiance or fiancee",
      "hidden identity",
      "enemy spy",
      "love triangle betrayal",
      "forbidden romance",
      "political marriage",
      "childhood friend betrayal",
      "bodyguard betrayal",
      "royal betrayal",
      "vampire secret",
      "werewolf pack betrayal",
      "memory manipulation",
      "time travel betrayal",
      "reincarnation secret",
      "contract relationship deception",
      "celebrity scandal",
      "rival company sabotage",
      "mafia double-cross",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "betrayal_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, or player agency needs a different response.",
    values: [
      "I never meant for it to happen this way.",
      "You were never supposed to find out.",
      "I did it to protect you.",
      "I had no choice.",
      "I chose survival.",
      "I chose them over you.",
      "I thought you hated me.",
      "I was afraid.",
      "You would have done the same.",
      "I regret everything.",
      "I don't regret a thing.",
      "I loved you despite what I did.",
      "I wanted revenge.",
      "You trusted me too easily.",
      "I couldn't tell you the truth.",
      "I was protecting someone else.",
      "The lie became too big.",
      "I was weak.",
      "I was selfish.",
      "I never stopped loving you.",
    ],
  },
] satisfies readonly BetrayalSeedGroup[]);

export const BETRAYAL_PRESETS = Object.freeze(
  BETRAYAL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createBetrayalPreset(group, value)),
  ),
) satisfies readonly BetrayalPreset[];

export const BETRAYAL_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(BETRAYAL_PRESETS.map((preset) => preset.category))).sort(),
);

export function findBetrayalPresetById(id: string): BetrayalPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return BETRAYAL_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getBetrayalPresetsByCategory(category: string): BetrayalPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return BETRAYAL_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileBetrayalPresetAdditions(
  preset: BetrayalPreset,
): CompiledBetrayalPresetAdditions {
  return {
    backgroundAddition: compileBetrayalPresetSummary(preset),
    personalityAddition: [
      `Betrayal ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Betrayal trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence trust, vigilance, confession pressure, rupture, or repair only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Betrayal guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft context; avoid hard numeric personality rules, do not override player agency, and do not reduce the character to betrayal-only behaviour.",
    ].join(" "),
  };
}

export function compileBetrayalPresetSummary(preset: BetrayalPreset): string {
  return [
    `Betrayal preset: ${preset.category} - ${preset.label}.`,
    `Betrayal value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createBetrayalPreset(
  group: BetrayalSeedGroup,
  value: string,
): BetrayalPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "betrayal",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} betrayal texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
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
