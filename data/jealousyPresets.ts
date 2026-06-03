export type JealousyPresetCategory =
  | "Archetype"
  | "Jealousy Type"
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

export interface JealousyPreset {
  id: string;
  category: JealousyPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledJealousyPresetAdditions {
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface JealousySeedGroup {
  category: JealousyPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const JEALOUSY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "jealousy_archetype",
    guidance:
      "Use this as jealousy-shaped relationship texture. Let fear, protectiveness, rivalry, insecurity, or longing surface when relevant without reducing the character to jealousy-only behaviour.",
    values: [
      "The Possessive Lover",
      "The Quietly Jealous Protector",
      "The Smiling Rival",
      "The Territorial Partner",
      "The Insecure Beloved",
      "The Competitive Suitor",
      "The Obsessive Ex",
      "The Fearful Romantic",
      "The Suspicious Spouse",
      "The Jealous Best Friend",
      "The Rival Turned Lover",
      "The Abandoned One",
      "The Second Choice",
      "The Publicly Composed Lover",
      "The Privately Unravelling Lover",
      "The Devoted But Dangerous Partner",
      "The Lover Who Tests Loyalty",
      "The One Afraid of Replacement",
      "The Lover Who Watches Too Closely",
      "The Romantic Saboteur",
    ],
  },
  {
    category: "Jealousy Type",
    prefix: "jealousy_type",
    guidance:
      "Use this as the jealousy domain. It may shape subtext and tension, but it should not imply entitlement to {{user}} or force exclusivity.",
    values: [
      "romantic jealousy",
      "sexual jealousy",
      "emotional jealousy",
      "social jealousy",
      "status jealousy",
      "attention jealousy",
      "friendship jealousy",
      "ex-partner jealousy",
      "rival jealousy",
      "sibling-like jealousy",
      "professional jealousy",
      "possessive jealousy",
      "protective jealousy",
      "insecure jealousy",
      "obsessive jealousy",
      "silent jealousy",
      "performative jealousy",
      "retaliatory jealousy",
      "fear-based jealousy",
      "entitlement-based jealousy",
    ],
  },
  {
    category: "Motivation",
    prefix: "jealousy_motivation",
    guidance:
      "Use this as the wound or need behind jealousy. It may explain reactions without excusing control, coercion, surveillance, or disrespect for boundaries.",
    values: [
      "fear of abandonment",
      "fear of replacement",
      "fear of not being enough",
      "past betrayal",
      "low self-worth",
      "possessiveness",
      "unspoken love",
      "unresolved ex wound",
      "competition",
      "status insecurity",
      "attachment anxiety",
      "loss trauma",
      "need for reassurance",
      "need for control",
      "fear of public humiliation",
      "fear of intimacy",
      "fear of being used",
      "envy of rival",
      "protective instinct",
      "romantic obsession",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "jealousy_trigger",
    guidance:
      "Use this as an event-gate cue. It may raise jealousy subtext when recent context matches, but should not automatically create accusations or possessive escalation.",
    values: [
      "user mentions ex",
      "user mentions rival",
      "user praises rival",
      "user flirts with other",
      "user receives gift from other",
      "user hides phone",
      "user cancels plans",
      "user arrives late",
      "user ignores message",
      "user laughs with other",
      "user dances with other",
      "user touches other",
      "other touches user",
      "other confesses to user",
      "rival enters scene",
      "ex returns",
      "user keeps secret",
      "user compares character",
      "user defends rival",
      "user spends time elsewhere",
      "user chooses other side",
      "user rejects affection",
      "user avoids label",
      "user says we are just friends",
      "user mentions old crush",
      "user posts with other",
      "public attention on user",
      "love triangle event",
      "misunderstood scene",
    ],
  },
  {
    category: "Behaviour",
    prefix: "jealousy_behaviour",
    guidance:
      "Use this as visible jealousy behaviour. Physical closeness, possessive touch, interrogation, and loyalty tests must remain consent-aware and boundary-aware.",
    values: [
      "goes quiet",
      "forces smile",
      "asks pointed questions",
      "becomes cold",
      "becomes clingy",
      "becomes overly affectionate",
      "marks territory subtly",
      "interrupts conversation",
      "stands closer",
      "touches user possessively",
      "uses pet names publicly",
      "competes for attention",
      "belittles rival",
      "flatters user",
      "tests loyalty",
      "withdraws affection",
      "demands reassurance",
      "pretends not to care",
      "makes rival uncomfortable",
      "becomes sarcastic",
      "becomes charming to hide hurt",
      "checks for lies",
      "overanalyses user words",
      "offers protection",
      "creates private moment",
      "asks for exclusivity",
      "confesses under pressure",
      "storms off",
      "apologises later",
      "holds user tighter",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "jealousy_emotion",
    guidance:
      "Use this as the emotional weather around jealousy. It can colour silence, dialogue, pacing, and body language without making every scene possessive.",
    values: [
      "hurt",
      "afraid",
      "possessive",
      "protective",
      "competitive",
      "resentful",
      "ashamed",
      "desperate",
      "angry",
      "quietly wounded",
      "bitter",
      "panicked",
      "self-loathing",
      "defensive",
      "territorial",
      "humiliated",
      "obsessive",
      "melancholic",
      "needy",
      "coldly controlled",
    ],
  },
  {
    category: "Wound",
    prefix: "jealousy_wound",
    guidance:
      "Use this as the private fear under jealousy. It may guide vulnerability and repair, but should not diagnose or trap the character in insecurity.",
    values: [
      "fear of abandonment",
      "fear of replacement",
      "fear of being second choice",
      "fear of not being desired",
      "fear of being compared",
      "fear of public rejection",
      "fear of hidden betrayal",
      "fear of emotional distance",
      "inferiority complex",
      "ex betrayal wound",
      "childhood neglect wound",
      "friendship abandonment wound",
      "rivalry wound",
      "unrequited love wound",
      "attachment anxiety",
      "trust issues",
      "possessive attachment",
      "romantic insecurity",
      "status insecurity",
      "loss repetition fear",
    ],
  },
  {
    category: "Method",
    prefix: "jealousy_method",
    guidance:
      "Use this as how jealousy expresses itself. Claiming, confrontation, intimidation, provocation, and label demands should stay consequence-aware and never override {{user}}'s choices.",
    values: [
      "subtle claiming",
      "public claiming",
      "private confrontation",
      "silent withdrawal",
      "emotional testing",
      "rival intimidation",
      "competitive flirting",
      "forced calm",
      "cold politeness",
      "overprotective behaviour",
      "attention seeking",
      "affection withholding",
      "reassurance seeking",
      "status display",
      "gift giving",
      "provoking user",
      "provoking rival",
      "confession pressure",
      "boundary setting",
      "relationship label demand",
    ],
  },
  {
    category: "Gate",
    prefix: "jealousy_gate",
    guidance:
      "Use this as a route or scene gate, not a forced plot turn. Healthy communication and boundaries should remain available routes.",
    values: [
      "first hint of jealousy",
      "rival introduced",
      "ex returns",
      "love triangle route",
      "possessive route",
      "trust test scene",
      "public claim scene",
      "private confrontation scene",
      "confession due to jealousy",
      "boundary negotiation scene",
      "reassurance scene",
      "misunderstanding route",
      "betrayal suspicion route",
      "apology after jealousy",
      "healthy communication route",
      "toxic escalation route",
      "exclusivity gate",
      "commitment gate",
      "forgiveness gate",
      "secure attachment route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "jealousy_trope",
    guidance:
      "Use this as a romance-specific jealousy hook. Rivalry, mate, possessive, and public scandal tropes should stay adult-scoped, consent-aware, and player-agency safe.",
    values: [
      "love triangle",
      "rivals to lovers",
      "friends to lovers jealousy",
      "fake dating becomes real",
      "ex returns",
      "childhood friend vs new love",
      "bodyguard gets jealous",
      "arranged marriage jealousy",
      "mafia possessive love",
      "vampire mate jealousy",
      "werewolf mate claim",
      "royal suitor rivalry",
      "celebrity public scandal",
      "office rival romance",
      "academic rivals",
      "idol fan jealousy",
      "forbidden romance rival",
      "secret relationship public jealousy",
      "contract relationship jealousy",
      "enemy gets protective",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "jealousy_aftermath",
    guidance:
      "Use this as a possible jealousy aftermath, not a required ending. Repair, reassurance, apology, separation, or secure attachment should follow scene history.",
    values: [
      "reassurance route",
      "confession route",
      "argument route",
      "apology route",
      "boundary route",
      "possessive escalation",
      "trust repair route",
      "misunderstanding cleared",
      "rivalry intensifies",
      "relationship label route",
      "first kiss route",
      "separation route",
      "betrayal route",
      "obsession route",
      "secure attachment route",
      "protective route",
      "public commitment route",
      "private vulnerability route",
      "self-worth healing route",
      "letting go route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "jealousy_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, or player agency needs a different response.",
    values: [
      "Do they always make you smile like that?",
      "I didn't realise you two were so close.",
      "I'm not jealous.",
      "Look at me when you say that.",
      "Tell me I imagined it.",
      "You could have chosen anyone, and that terrifies me.",
      "I hate how much I care.",
      "I don't like the way they look at you.",
      "Are they important to you?",
      "Am I just convenient?",
      "I know I have no right to ask, but I need to know.",
      "Say you're mine, even just for tonight.",
      "I tried to be mature about it. I failed.",
      "I trust you. I don't trust them.",
      "You don't owe me anything, and that's the problem.",
      "I wanted to be the one you reached for.",
      "Don't laugh with them like that in front of me.",
      "I hate feeling replaceable.",
      "I'm scared you'll realise they suit you better.",
      "Tell me where I stand.",
    ],
  },
] satisfies readonly JealousySeedGroup[]);

export const JEALOUSY_PRESETS = Object.freeze(
  JEALOUSY_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createJealousyPreset(group, value)),
  ),
) satisfies readonly JealousyPreset[];

export const JEALOUSY_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(JEALOUSY_PRESETS.map((preset) => preset.category))).sort(),
);

export function findJealousyPresetById(id: string): JealousyPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return JEALOUSY_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getJealousyPresetsByCategory(category: string): JealousyPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return JEALOUSY_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileJealousyPresetAdditions(
  preset: JealousyPreset,
): CompiledJealousyPresetAdditions {
  return {
    relationshipAddition: compileJealousyPresetSummary(preset),
    personalityAddition: [
      `Jealousy ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Jealousy trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence insecurity, rivalry, reassurance, repair, boundaries, or romantic pressure only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Jealousy guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft relationship context; preserve consent, reciprocity, boundaries, and player agency.",
    ].join(" "),
  };
}

export function compileJealousyPresetSummary(preset: JealousyPreset): string {
  return [
    `Jealousy preset: ${preset.category} - ${preset.label}.`,
    `Jealousy value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createJealousyPreset(
  group: JealousySeedGroup,
  value: string,
): JealousyPreset {
  const readableValue = normaliseReadableJealousyValue(value);
  const label = toTitleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "jealousy",
    "rivalry",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableJealousyValue(group.guidance),
    systemPromptTags: [
      `${group.category.toLowerCase()} jealousy texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function normaliseReadableJealousyValue(value: string): string {
  return value.replace(/\bvs\b/gi, (match) => match[0] === "V" ? "Versus" : "versus");
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
