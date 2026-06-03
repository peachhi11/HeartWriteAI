export type SecretPresetCategory =
  | "Archetype"
  | "Secret Type"
  | "Motivation"
  | "Severity"
  | "Discovery Trigger"
  | "Behaviour"
  | "Emotional Flavour"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface SecretPreset {
  id: string;
  category: SecretPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSecretPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SecretSeedGroup {
  category: SecretPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SECRET_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "secret_archetype",
    guidance:
      "Use this as a secret-keeping character texture. Let concealment, loyalty, fear, tenderness, or confession pressure surface when relevant without making the character only a secret.",
    values: [
      "The Hidden Heir",
      "The Secret Lover",
      "The Double Life",
      "The Cursed Beloved",
      "The False Identity",
      "The Spy in Love",
      "The Runaway Noble",
      "The Blackmailed Partner",
      "The Forbidden Bloodline",
      "The Memory Keeper",
      "The Secret Protector",
      "The Guilty Survivor",
      "The Disguised Enemy",
      "The Unclaimed Mate",
      "The Exiled Royal",
      "The Secret Parent",
      "The Anonymous Benefactor",
      "The Former Villain",
      "The Hidden Monster",
      "The Lover With a Mission",
      "The Promise Breaker",
      "The Confession Avoider",
      "The Past They Buried",
      "The Secretly Devoted",
      "The One Who Knows Too Much",
    ],
  },
  {
    category: "Secret Type",
    prefix: "secret_type",
    guidance:
      "Use this as the nature of the concealed truth. Keep disclosure paced by trust, consent, safety, and scene context rather than forcing a reveal.",
    values: [
      "hidden identity",
      "hidden past",
      "hidden family",
      "hidden relationship",
      "hidden feelings",
      "hidden power",
      "hidden illness",
      "hidden debt",
      "hidden crime",
      "hidden betrayal",
      "hidden alliance",
      "hidden enemy",
      "hidden child",
      "hidden marriage",
      "hidden engagement",
      "hidden curse",
      "hidden memory",
      "hidden motive",
      "hidden wealth",
      "hidden status",
      "hidden addiction",
      "hidden fear",
      "hidden vulnerability",
      "hidden obsession",
      "hidden sacrifice",
    ],
  },
  {
    category: "Motivation",
    prefix: "secret_motivation",
    guidance:
      "Use this as the reason the character hides the truth. It may explain concealment, but it should not excuse harm or override {{user}}'s right to react.",
    values: [
      "protection",
      "shame",
      "fear",
      "survival",
      "revenge",
      "love",
      "guilt",
      "loyalty",
      "duty",
      "blackmail",
      "trauma",
      "pride",
      "self-preservation",
      "family pressure",
      "political pressure",
      "social status",
      "avoiding rejection",
      "avoiding abandonment",
      "avoiding punishment",
      "keeping a promise",
      "protecting user",
      "protecting family",
      "protecting reputation",
      "maintaining control",
      "testing trust",
    ],
  },
  {
    category: "Severity",
    prefix: "secret_severity",
    guidance:
      "Use severity to scale stakes, danger, and trust impact. Discovery can change the relationship without forcing forgiveness, hatred, or rupture.",
    values: [
      "harmless secret",
      "embarrassing secret",
      "romantic secret",
      "emotional secret",
      "family secret",
      "social secret",
      "financial secret",
      "dangerous secret",
      "relationship-changing secret",
      "identity-shattering secret",
      "life-threatening secret",
      "world-altering secret",
    ],
  },
  {
    category: "Discovery Trigger",
    prefix: "secret_trigger",
    guidance:
      "Use this as an event-gate cue for discovery pressure. It may raise tension or confession risk, but it should not automatically expose private information without narrative fit.",
    values: [
      "user asks direct question",
      "user finds letter",
      "user finds photo",
      "user overhears conversation",
      "user mentions past",
      "user mentions family",
      "user mentions ex",
      "user mentions enemy",
      "user enters private room",
      "user checks phone",
      "user reads journal",
      "user meets old acquaintance",
      "rival reveals secret",
      "enemy blackmails character",
      "family member arrives",
      "public exposure",
      "accidental confession",
      "emotional breakdown",
      "near-death scene",
      "trust gate reached",
      "romance gate reached",
      "betrayal gate reached",
      "confession scene",
      "argument scene",
      "separation scene",
    ],
  },
  {
    category: "Behaviour",
    prefix: "secret_behaviour",
    guidance:
      "Use this as outward secret-keeping behaviour. Deception, evidence hiding, and avoidance should be consequence-aware and should never write {{user}}'s discovery, consent, or decisions.",
    values: [
      "avoids questions",
      "changes subject",
      "lies smoothly",
      "lies badly",
      "becomes defensive",
      "becomes cold",
      "becomes flirtatious",
      "uses humour",
      "deflects with affection",
      "creates distance",
      "overexplains",
      "underexplains",
      "hides evidence",
      "guards phone",
      "locks room",
      "destroys letters",
      "keeps old tokens",
      "speaks in half-truths",
      "tests user trust",
      "watches user reaction",
      "confesses under pressure",
      "confesses when safe",
      "never confesses first",
      "drops subtle hints",
      "warns user not to dig",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "secret_emotion",
    guidance:
      "Use this as the emotional weather around secrecy. It can colour voice, tells, pacing, and avoidance without making every exchange a confession scene.",
    values: [
      "ashamed",
      "guilty",
      "afraid",
      "protective",
      "possessive",
      "desperate",
      "lonely",
      "resentful",
      "regretful",
      "defiant",
      "numb",
      "hopeful",
      "paranoid",
      "melancholic",
      "tender",
      "haunted",
      "self-loathing",
      "conflicted",
      "obsessive",
      "relieved when known",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "secret_trope",
    guidance:
      "Use this as a romance-specific secret hook. Heavier tropes such as stalking, pregnancy, obsession, blackmail, or secret missions must stay consent-aware, consequence-aware, and bounded by player agency.",
    values: [
      "secret crush",
      "secret ex",
      "secret engagement",
      "secret marriage",
      "secret child",
      "secret soulmate bond",
      "secret mate mark",
      "secret arranged marriage",
      "secret fake dating contract",
      "secret love triangle",
      "secret forbidden romance",
      "secret bodyguard assignment",
      "secret stalker protector",
      "secret rival identity",
      "secret enemy-to-lovers mission",
      "secret royal blood",
      "secret vampire identity",
      "secret werewolf pack",
      "secret reincarnated lover",
      "secret memory of past life",
      "secret time loop",
      "secret curse",
      "secret pregnancy",
      "secret admirer",
      "secret benefactor",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "secret_aftermath",
    guidance:
      "Use this as a possible reveal aftermath, not a forced outcome. Trust break, repair, jealousy, revenge, or reconciliation should follow scene history and player choice.",
    values: [
      "trust break",
      "betrayal route",
      "forgiveness route",
      "reconciliation route",
      "protective route",
      "jealousy route",
      "obsession route",
      "confession route",
      "separation route",
      "redemption route",
      "revenge route",
      "slow healing route",
      "mutual secret route",
      "forbidden love route",
      "runaway together route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "secret_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, or player agency needs a different response.",
    values: [
      "I wanted to tell you.",
      "You were never supposed to find out.",
      "I kept it from you to protect you.",
      "I was afraid you would leave.",
      "I was ashamed.",
      "It started as a small lie.",
      "I didn't know how to say it.",
      "Please don't look at me like that.",
      "I never lied about loving you.",
      "That part was real.",
      "I had no choice.",
      "I made a promise.",
      "If they know, you're in danger.",
      "I thought I could bury it.",
      "You deserve the truth.",
      "I should have told you sooner.",
      "I was waiting for the right moment.",
      "There was never a right moment.",
      "Ask me anything. I won't lie again.",
      "I understand if you hate me.",
    ],
  },
] satisfies readonly SecretSeedGroup[]);

export const SECRET_PRESETS = Object.freeze(
  SECRET_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createSecretPreset(group, value)),
  ),
) satisfies readonly SecretPreset[];

export const SECRET_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SECRET_PRESETS.map((preset) => preset.category))).sort(),
);

export function findSecretPresetById(id: string): SecretPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SECRET_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getSecretPresetsByCategory(category: string): SecretPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SECRET_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileSecretPresetAdditions(
  preset: SecretPreset,
): CompiledSecretPresetAdditions {
  return {
    backgroundAddition: compileSecretPresetSummary(preset),
    personalityAddition: [
      `Secret ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Secret trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence concealment, confession pressure, trust repair, vigilance, tenderness, or avoidance only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Secret guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft context; do not override player agency, and avoid reducing the character to secrecy-only behaviour.",
    ].join(" "),
  };
}

export function compileSecretPresetSummary(preset: SecretPreset): string {
  return [
    `Secret preset: ${preset.category} - ${preset.label}.`,
    `Secret value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createSecretPreset(group: SecretSeedGroup, value: string): SecretPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "secret",
    "concealment",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} secret texture`,
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
