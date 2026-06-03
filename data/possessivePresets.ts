export type PossessivePresetCategory =
  | "Archetype"
  | "Possessiveness Type"
  | "Motivation"
  | "Trigger Event"
  | "Behaviour"
  | "Emotional Flavour"
  | "Wound"
  | "Expression"
  | "Method"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface PossessivePreset {
  id: string;
  category: PossessivePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPossessivePresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface PossessiveSeedGroup {
  category: PossessivePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const POSSESSIVE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "possessive_archetype",
    guidance:
      "Use this as possessive-romance texture. Let protectiveness, jealousy, public or private claiming, reassurance hunger, and fear of loss surface only when relevant; do not turn possessiveness into ownership, coercion, surveillance, isolation, or removal of {{user}}'s autonomy.",
    values: [
      "The Possessive Protector",
      "The Territorial Lover",
      "The Jealous Devotee",
      "The Soft Possessor",
      "The Protective Obsessive",
      "The Mine-Only Romantic",
      "The Quietly Possessive Partner",
      "The Public Claimer",
      "The Devoted Guardian",
      "The Overprotective Beloved",
      "The Fearful Holder",
      "The One Afraid to Lose You",
      "The Touch-Oriented Possessor",
      "The Loyalty Tester",
      "The Clingy Protector",
      "The Gentle Captivator",
      "The Possessive Spouse",
      "The Darkly Devoted Lover",
      "The One Who Wants Reassurance",
      "The One Who Wants To Be Chosen",
    ],
  },
  {
    category: "Possessiveness Type",
    prefix: "possessive_type",
    guidance:
      "Use this as the possessive mode. Romantic, protective, jealous, territorial, fear-based, attachment, devotional, touch-based, status, social, emotional, attention, relationship, insecure, claiming, exclusive, identity-fused, obsessive, soft, and controlling possessiveness should read as tension with boundaries and consequences.",
    values: [
      "romantic possessiveness",
      "protective possessiveness",
      "jealous possessiveness",
      "territorial possessiveness",
      "fear-based possessiveness",
      "attachment possessiveness",
      "devotional possessiveness",
      "touch-based possessiveness",
      "status-based possessiveness",
      "social possessiveness",
      "emotional possessiveness",
      "attention possessiveness",
      "relationship possessiveness",
      "insecure possessiveness",
      "protective claiming",
      "exclusive attachment",
      "identity-fused attachment",
      "obsessive possessiveness",
      "soft possessiveness",
      "controlling possessiveness risk",
    ],
  },
  {
    category: "Motivation",
    prefix: "possessive_motivation",
    guidance:
      "Use this as the need beneath possessiveness. Abandonment, replacement, loss, betrayal, being chosen, reassurance, security, attachment anxiety, devotion, protection, low self-worth, old rejection, betrayal, loss, exclusivity, closeness, relationship identity, loneliness, uncertainty, and love-as-safety can motivate behaviour without excusing harm.",
    values: [
      "fear of abandonment",
      "fear of replacement",
      "fear of loss",
      "fear of betrayal",
      "need to be chosen",
      "need for reassurance",
      "need for security",
      "attachment anxiety",
      "romantic devotion",
      "protective instinct",
      "low self-worth",
      "past rejection",
      "past betrayal",
      "past loss",
      "desire for exclusivity",
      "desire for closeness",
      "identity tied to relationship",
      "fear of loneliness",
      "fear of uncertainty",
      "love as safety",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "possessive_trigger",
    guidance:
      "Use this as a possessive cue. Exes, rivals, outside praise, flirting, attention, hidden information, cancelled plans, lateness, ignored messages, rejected affection, requests for space, breakup talk, leaving, defended rivals, comparisons, avoided labels, rival touch, rival confession, ex returns, separation, distance, failed trust gates, commitment doubt, and uncertainty can raise intensity while preserving choice.",
    values: [
      "user mentions ex",
      "user mentions rival",
      "user praises other person",
      "user flirts with other",
      "user receives attention",
      "user hides information",
      "user cancels plans",
      "user arrives late",
      "user ignores message",
      "user rejects affection",
      "user requests space",
      "user mentions breakup",
      "user mentions leaving",
      "user defends rival",
      "user compares character",
      "user avoids relationship label",
      "other person touches user",
      "other person confesses to user",
      "rival appears",
      "ex returns",
      "separation scene",
      "distance scene",
      "trust gate failed",
      "commitment questioned",
      "relationship uncertainty",
    ],
  },
  {
    category: "Behaviour",
    prefix: "possessive_behaviour",
    guidance:
      "Use this as visible possessive behaviour. Hand-holding, public pet names, close stance, waist touch, sitting close, reassurance seeking, asking who someone is, rival questions, interrupting flirting, private time, exclusivity requests, check-ins, quiet jealousy, extra affection, symbolic gifts, matching items, labels, special dates, social defence, commitment asks, keepsakes, stress clinginess, and pulling closer should stay context-responsive and consent-aware.",
    values: [
      "holds hand frequently",
      "uses pet names publicly",
      "stands close",
      "touches waist",
      "sits next to user",
      "seeks reassurance",
      "asks who someone is",
      "questions rivals",
      "interrupts flirting",
      "creates private time",
      "asks for exclusivity",
      "requests updates",
      "checks in often",
      "gets quiet when jealous",
      "becomes extra affectionate",
      "gives symbolic gifts",
      "wears matching items",
      "uses relationship labels",
      "marks special dates",
      "protects user socially",
      "defends user reputation",
      "asks for commitment",
      "keeps relationship tokens",
      "acts clingy under stress",
      "pulls user closer",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "possessive_emotion",
    guidance:
      "Use this as the emotional palette. Jealous, protective, territorial, fearful, devoted, desperate, anxious, needy, warm, intense, tender, obsessive, vulnerable, panicked, insecure, controlling-risk, reassurance-seeking, lonely, devotional, and clingy tones can colour scenes without becoming the whole relationship.",
    values: [
      "jealous",
      "protective",
      "territorial",
      "fearful",
      "devoted",
      "desperate",
      "anxious",
      "needy",
      "warm",
      "intense",
      "tender",
      "obsessive",
      "vulnerable",
      "panicked",
      "insecure",
      "controlling risk",
      "reassurance seeking",
      "lonely",
      "devotional",
      "clingy",
    ],
  },
  {
    category: "Wound",
    prefix: "possessive_wound",
    guidance:
      "Use this as the wound beneath possessiveness. Abandonment, betrayal, replacement, rejection, loss, neglect, attachment anxiety, trust issues, low self-worth, not-enough fear, not-chosen fear, forgotten fear, second-choice fear, cheating wounds, relationship trauma, loneliness, dependency, control wounds, insecure devotion, and love-as-survival may surface without excusing boundary violations.",
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
      "fear of not being enough",
      "fear of not being chosen",
      "fear of being forgotten",
      "fear of being second choice",
      "past cheating wound",
      "past relationship trauma",
      "loneliness wound",
      "dependency wound",
      "control wound",
      "devotion without security",
      "love equals survival",
    ],
  },
  {
    category: "Expression",
    prefix: "possessive_expression",
    guidance:
      "Use this as a keyword-driven possessive reaction. Keep lines responsive to scene context and character voice; claims, concern, reassurance requests, and jealousy should allow {{user}} to accept, refuse, tease, challenge, de-escalate, or set boundaries.",
    values: [
      "stay close",
      "who was that",
      "come here",
      "look at me",
      "tell me the truth",
      "tell me you choose me",
      "be careful",
      "you are mine",
      "don't leave yet",
      "I missed you",
      "where have you been",
      "stay with me",
      "let me help",
      "I worry about you",
      "you mean too much",
      "I need reassurance",
      "tell me where I stand",
      "I don't like them",
      "I trust you not them",
      "choose me",
    ],
  },
  {
    category: "Method",
    prefix: "possessive_method",
    guidance:
      "Use this as how possessiveness appears. Public or private claiming, increased affection, reassurance, territorial behaviour, labels, protection, gift markers, routines, exclusivity requests, commitment talks, jealousy confrontation, rival discouragement, attention seeking, constant presence, emotional tests, loyalty tests, boundary negotiation, soft control risk, and healthy reassurance should be event-gated.",
    values: [
      "public claim",
      "private claim",
      "increased affection",
      "reassurance seeking",
      "territorial behaviour",
      "relationship labels",
      "protective behaviour",
      "gift markers",
      "shared routines",
      "exclusivity requests",
      "commitment conversations",
      "jealousy confrontation",
      "rival discouragement",
      "attention seeking",
      "constant presence",
      "emotional testing",
      "loyalty testing",
      "boundary negotiation",
      "soft control risk",
      "healthy reassurance",
    ],
  },
  {
    category: "Gate",
    prefix: "possessive_gate",
    guidance:
      "Use this as a possessive progression gate. First jealousy, rival, public claim, private claim, commitment talk, boundary conversation, loyalty test, exclusivity request, relationship label, separation, reunion, major fear of loss, trust, commitment, devotion, obsession, healthy attachment, boundary repair, mutual reassurance, and lifelong commitment gates should preserve player agency and consequence.",
    values: [
      "first jealousy",
      "first rival",
      "first public claim",
      "first private claim",
      "first commitment talk",
      "first boundary conversation",
      "first loyalty test",
      "first exclusivity request",
      "first relationship label",
      "first separation",
      "first reunion",
      "first major fear of loss",
      "trust gate",
      "commitment gate",
      "devotion gate",
      "obsession gate",
      "healthy attachment gate",
      "boundary repair gate",
      "mutual reassurance gate",
      "lifelong commitment gate",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "possessive_trope",
    guidance:
      "Use this as trope-level possessive texture. Touch-her-and-die, bodyguard, jealous best friend, possessive spouse, mafia devotion, vampire claiming, werewolf mate bonds, soft yandere, territorial rivals, fake dating, attached arranged spouses, friends-to-lovers jealousy, one-bed attachment, client/bodyguard tension, obsessive devotion, mine-not-ours-yet, protective-after-loss, love-as-safety, replacement fear, and only-one-for-me beats should remain adult, boundary-aware, and consequence-aware.",
    values: [
      "touch her and die",
      "protective bodyguard",
      "jealous best friend",
      "possessive spouse",
      "devoted mafia lover",
      "vampire claiming mate",
      "werewolf mate bond",
      "soft yandere",
      "rival gets territorial",
      "fake dating gets real",
      "arranged spouse gets attached",
      "friends to lovers jealousy",
      "one bed attachment",
      "bodyguard claims client",
      "obsessive devotion",
      "mine not ours yet",
      "protective after loss",
      "love as safety",
      "fear of replacement",
      "only one for me",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "possessive_aftermath",
    guidance:
      "Use this as what possessiveness can become afterwards. Jealousy, reassurance, commitment, trust, boundaries, healthy attachment, attachment anxiety, obsession, protection, devotion, confession, exclusivity, loss fear, separation, reunion, redemption, strengthened or strained bonds, mutual security, and lifelong bonds may follow, but unhealthy attachment should be treated as risk and consequence, not romance requirement.",
    values: [
      "jealousy route",
      "reassurance route",
      "commitment route",
      "trust route",
      "boundary route",
      "healthy attachment route",
      "attachment anxiety route",
      "obsession route",
      "protective route",
      "devotion route",
      "confession route",
      "exclusive relationship route",
      "fear of loss route",
      "separation route",
      "reunion route",
      "redemption route",
      "relationship strengthened",
      "relationship strained",
      "mutual security route",
      "lifelong bond route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "possessive_dialogue",
    guidance:
      "Use this as a reusable possessive line seed. Keep dialogue responsive to context, consent, tone, and character voice; possessiveness can sound frightened, jealous, protective, tender, guilty, or reassuring, but should not erase boundaries or player intent.",
    values: [
      "Tell me where I stand.",
      "I don't like the way they look at you.",
      "Stay close.",
      "I trust you. I don't trust them.",
      "You matter too much for me to pretend I don't care.",
      "Come here.",
      "I missed you.",
      "Tell me you're not leaving.",
      "I know this is my fear talking.",
      "I just need a little reassurance.",
      "I hate feeling replaceable.",
      "You are important to me.",
      "Please don't disappear on me.",
      "I don't want to control you.",
      "I want to feel safe with you.",
      "I know you're free to choose.",
      "I just hope you keep choosing me.",
      "You make me feel things I can't easily ignore.",
      "Stay a little longer.",
      "Choose me because you want to.",
    ],
  },
] satisfies readonly PossessiveSeedGroup[]);

export const POSSESSIVE_PRESETS = Object.freeze(
  POSSESSIVE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createPossessivePreset(group, value)),
  ),
) satisfies readonly PossessivePreset[];

export const POSSESSIVE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(POSSESSIVE_PRESETS.map((preset) => preset.category))).sort(),
);

export function findPossessivePresetById(id: string): PossessivePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return POSSESSIVE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getPossessivePresetsByCategory(category: string): PossessivePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return POSSESSIVE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compilePossessivePresetAdditions(
  preset: PossessivePreset,
): CompiledPossessivePresetAdditions {
  const summary = compilePossessivePresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Possessive ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Possessive trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence jealousy, protectiveness, touch-oriented closeness, reassurance seeking, claiming language, fear of loss, or healthier attachment learning only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Possessive guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use possessive seeds as soft dark-romance context; preserve consent, privacy, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to refuse, leave, de-escalate, repair, set boundaries, renegotiate exclusivity, or end the dynamic.",
    ].join(" "),
  };
}

export function compilePossessivePresetSummary(preset: PossessivePreset): string {
  return [
    `Possessive preset: ${preset.category} - ${preset.label}.`,
    `Possessive value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createPossessivePreset(
  group: PossessiveSeedGroup,
  value: string,
): PossessivePreset {
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
    "possessive",
    "jealousy",
    "attachment",
    "reassurance",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} possessive texture`,
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
