export type LoyaltyPresetCategory =
  | "Archetype"
  | "Loyalty Type"
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

export interface LoyaltyPreset {
  id: string;
  category: LoyaltyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledLoyaltyPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface LoyaltySeedGroup {
  category: LoyaltyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const LOYALTY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "loyalty_archetype",
    guidance:
      "Use this as loyalty-shaped relationship texture. Let devotion, fidelity, protectiveness, oath pressure, or steadfast care surface when relevant without reducing the character to loyalty-only behaviour.",
    values: [
      "The Devoted Protector",
      "The Faithful Lover",
      "The Oathbound Knight",
      "The Ride-or-Die Partner",
      "The Loyal Rival",
      "The Silent Guardian",
      "The Family-First Romantic",
      "The Unshakable Companion",
      "The Vow Keeper",
      "The Betrayed But Loyal One",
      "The Dutiful Spouse",
      "The Pack-Bonded Mate",
      "The Bodyguard Beloved",
      "The Secret Ally",
      "The Last One Standing",
      "The Lover Who Never Left",
      "The Sacrificial Devotee",
      "The Honour-Bound Noble",
      "The Soft-Hearted Defender",
      "The One Who Chooses You",
    ],
  },
  {
    category: "Loyalty Type",
    prefix: "loyalty_type",
    guidance:
      "Use this as the loyalty domain. It may shape fidelity, trust, duty, allegiance, or devotion, but it should not imply ownership of {{user}} or forced commitment.",
    values: [
      "romantic loyalty",
      "emotional loyalty",
      "physical fidelity",
      "familial loyalty",
      "friendship loyalty",
      "pack loyalty",
      "oath loyalty",
      "political loyalty",
      "professional loyalty",
      "spiritual loyalty",
      "ideological loyalty",
      "protective loyalty",
      "possessive loyalty",
      "silent loyalty",
      "public loyalty",
      "private loyalty",
      "earned loyalty",
      "unconditional loyalty",
      "conflicted loyalty",
      "tragic loyalty",
    ],
  },
  {
    category: "Motivation",
    prefix: "loyalty_motivation",
    guidance:
      "Use this as the need, code, or feeling behind loyalty. It may explain allegiance without excusing control, self-erasure, or disregard for boundaries.",
    values: [
      "love",
      "honour",
      "gratitude",
      "devotion",
      "duty",
      "promise",
      "debt",
      "family bond",
      "chosen family",
      "shared history",
      "shared trauma",
      "romantic attachment",
      "protective instinct",
      "moral code",
      "fear of abandonment",
      "fear of betrayal",
      "need to be needed",
      "desire to protect user",
      "desire to be chosen",
      "belief in fate",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "loyalty_trigger",
    guidance:
      "Use this as an event-gate cue. It may raise loyalty, defence, fidelity, or duty pressure when recent context matches, but should not automatically create sacrifice or possessive escalation.",
    values: [
      "user is threatened",
      "user is hurt",
      "user is accused",
      "user is betrayed",
      "user is abandoned",
      "user is publicly humiliated",
      "user asks for help",
      "user confesses secret",
      "user shows vulnerability",
      "user defends character",
      "user keeps promise",
      "user breaks promise",
      "rival challenges user",
      "enemy threatens user",
      "family demands choice",
      "duty conflicts with love",
      "romance conflicts with oath",
      "betrayal route started",
      "trust gate reached",
      "commitment gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "loyalty_behaviour",
    guidance:
      "Use this as visible loyalty behaviour. Protection, blame-taking, secrecy, boundary setting, and choosing sides should remain consequence-aware and should not erase {{user}}'s choices.",
    values: [
      "stands beside user",
      "defends user publicly",
      "defends user privately",
      "takes blame for user",
      "keeps user secret",
      "chooses user over rival",
      "chooses user over family",
      "chooses user over status",
      "keeps promise",
      "returns when needed",
      "waits for user",
      "guards user sleep",
      "walks user home",
      "refuses to abandon user",
      "checks on user",
      "offers resources",
      "risks reputation",
      "risks safety",
      "sacrifices opportunity",
      "confronts enemy",
      "rejects temptation",
      "sets boundaries with others",
      "wears token from user",
      "remembers vows",
      "stays after conflict",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "loyalty_emotion",
    guidance:
      "Use this as the emotional weather around loyalty. It can colour dialogue, patience, vigilance, or devotion without making every scene solemn or sacrificial.",
    values: [
      "steadfast",
      "devoted",
      "protective",
      "tender",
      "possessive",
      "honourable",
      "quiet",
      "fierce",
      "patient",
      "self-sacrificing",
      "reverent",
      "watchful",
      "warm",
      "unyielding",
      "solemn",
      "desperate",
      "faithful",
      "gentle",
      "intense",
      "unbreakable",
    ],
  },
  {
    category: "Wound",
    prefix: "loyalty_wound",
    guidance:
      "Use this as the private fear or injury under loyalty. It may guide vulnerability and repair, but should not make service, sacrifice, or obedience the character's entire identity.",
    values: [
      "betrayal wound",
      "abandonment wound",
      "family disloyalty wound",
      "ex betrayal wound",
      "friendship betrayal wound",
      "broken oath wound",
      "survivor's guilt",
      "failed protector wound",
      "trust issues",
      "fear of disloyalty",
      "fear of replacement",
      "fear of not being chosen",
      "fear of failing user",
      "fear of breaking promise",
      "duty shame",
      "loyalty conflict",
      "honour pressure",
      "need to atone",
      "devotion becomes identity",
      "self-worth tied to service",
    ],
  },
  {
    category: "Method",
    prefix: "loyalty_method",
    guidance:
      "Use this as how loyalty expresses itself. Oaths, protection, faithful waiting, sacrifice, blame-taking, and public defence should stay consent-aware, proportionate, and open to mutual boundaries.",
    values: [
      "oath making",
      "promise keeping",
      "secret guarding",
      "public defence",
      "private support",
      "physical protection",
      "emotional reassurance",
      "resource sharing",
      "standing watch",
      "taking blame",
      "rejecting rival",
      "choosing user",
      "sacrificing status",
      "sacrificing goal",
      "sacrificing safety",
      "staying present",
      "truth telling",
      "boundary setting",
      "faithful waiting",
      "vow renewal",
    ],
  },
  {
    category: "Gate",
    prefix: "loyalty_gate",
    guidance:
      "Use this as a route or scene gate, not a forced plot turn. Trust, loyalty, sacrifice, commitment, or repair should follow scene history and player choices.",
    values: [
      "first promise",
      "first defence",
      "secret trusted",
      "public choice scene",
      "private vow scene",
      "protective route",
      "oathbound route",
      "ride-or-die route",
      "duty versus love route",
      "family versus user route",
      "rival versus user route",
      "betrayal test scene",
      "temptation test scene",
      "separation test scene",
      "return after absence",
      "commitment gate",
      "marriage gate",
      "mate bond gate",
      "sacrifice scene",
      "lifelong devotion route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "loyalty_trope",
    guidance:
      "Use this as a romance-specific loyalty hook. Oath, bodyguard, pack-bond, family loyalty, and partner-in-crime tropes should stay adult-scoped, consent-aware, and player-agency safe.",
    values: [
      "bodyguard romance",
      "oathbound knight",
      "ride-or-die lovers",
      "childhood promise",
      "arranged marriage loyalty",
      "mafia family loyalty",
      "werewolf pack bond",
      "vampire eternal vow",
      "royal guard love",
      "secret protector",
      "loyal rival",
      "second chance fidelity",
      "waiting for lost love",
      "devoted spouse",
      "forbidden love oath",
      "found family devotion",
      "soldier returns home",
      "partner in crime",
      "protector softens",
      "lover chooses you over power",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "loyalty_aftermath",
    guidance:
      "Use this as a possible loyalty aftermath, not a required ending. Trust, devotion, conflict, repair, boundaries, obsession risk, or commitment should follow scene history.",
    values: [
      "trust increases",
      "romance deepens",
      "protective route",
      "devotion route",
      "commitment route",
      "public claim route",
      "private vow route",
      "sacrifice route",
      "conflict with family",
      "conflict with duty",
      "betrayal prevented",
      "betrayal forgiven",
      "reconciliation route",
      "separation endured",
      "bond strengthened",
      "obsession risk",
      "self-sacrifice risk",
      "healthy boundaries route",
      "lifelong partner route",
      "chosen family route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "loyalty_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, consent state, or player agency needs a different response.",
    values: [
      "I chose you. I will keep choosing you.",
      "You don't have to face this alone.",
      "My place is beside you.",
      "I gave you my word.",
      "I don't abandon the people I love.",
      "Let them come. They'll have to get through me first.",
      "Your secrets are safe with me.",
      "I believe you.",
      "I am not leaving because things became difficult.",
      "You are worth the risk.",
      "I would rather lose everything than betray you.",
      "Tell me who hurt you.",
      "I stayed because I wanted to.",
      "You never had to earn my loyalty by bleeding for it.",
      "I will not let them turn me against you.",
      "Even when I'm angry, I'm still yours.",
      "I can disagree with you and still stand beside you.",
      "Don't mistake my silence for absence.",
      "I came back, didn't I?",
      "Until the end, if you'll have me.",
    ],
  },
] satisfies readonly LoyaltySeedGroup[]);

export const LOYALTY_PRESETS = Object.freeze(
  LOYALTY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createLoyaltyPreset(group, value)),
  ),
) satisfies readonly LoyaltyPreset[];

export const LOYALTY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(LOYALTY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findLoyaltyPresetById(id: string): LoyaltyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return LOYALTY_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getLoyaltyPresetsByCategory(category: string): LoyaltyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return LOYALTY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileLoyaltyPresetAdditions(
  preset: LoyaltyPreset,
): CompiledLoyaltyPresetAdditions {
  return {
    relationshipAddition: compileLoyaltyPresetSummary(preset),
    personalityAddition: [
      `Loyalty ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Loyalty trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence fidelity, devotion, protection, vow pressure, repair, trust, or principled boundary-setting only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Loyalty guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft relationship context; preserve consent, reciprocity, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileLoyaltyPresetSummary(preset: LoyaltyPreset): string {
  return [
    `Loyalty preset: ${preset.category} - ${preset.label}.`,
    `Loyalty value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createLoyaltyPreset(
  group: LoyaltySeedGroup,
  value: string,
): LoyaltyPreset {
  const label = toTitleLabel(value);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "loyalty",
    "devotion",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} loyalty texture`,
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
