export type FrictionPresetCategory =
  | "Archetype"
  | "Friction Type"
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

export interface FrictionPreset {
  id: string;
  category: FrictionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledFrictionPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface FrictionSeedGroup {
  category: FrictionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const FRICTION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "friction_archetype",
    guidance:
      "Use this as relationship friction texture. Let bickering, tension, challenge, denial, irritation, chemistry, pride, and tenderness-under-conflict surface only when relevant; do not flatten the relationship into constant hostility.",
    values: [
      "The Constant Bickerers",
      "The Tension-Filled Pair",
      "The Oil and Water Lovers",
      "The Sharp-Tongued Rivals",
      "The Push-Pull Romance",
      "The Reluctant Allies",
      "The Competitive Couple",
      "The Miscommunication Magnet",
      "The Stubborn Equals",
      "The Chemistry Under Conflict",
      "The Irritating Crush",
      "The Almost Enemies",
      "The Passionate Disagreers",
      "The Opposites Who Clash",
      "The Slow-Burn Aggravation",
      "The Banter-Fuelled Romance",
      "The Prideful Pair",
      "The One Who Gets Under Your Skin",
      "The Argument-to-Affection Couple",
      "The Sparks Before Softness",
    ],
  },
  {
    category: "Friction Type",
    prefix: "friction_type",
    guidance:
      "Use this as the source of relational friction. Banter, ideals, personality clash, class, status, romantic denial, attraction, work, rivalry, trust, communication, attachment, jealousy, power struggle, boundaries, values, habits, pacing, and emotional availability may create tension while preserving consent and repair.",
    values: [
      "banter friction",
      "ideological friction",
      "personality clash",
      "class friction",
      "status friction",
      "romantic denial friction",
      "sexual tension friction",
      "professional friction",
      "rivalry friction",
      "trust friction",
      "communication friction",
      "attachment friction",
      "jealousy friction",
      "power struggle",
      "boundary friction",
      "values clash",
      "habit clash",
      "pace mismatch",
      "emotional availability gap",
      "opposites-attract friction",
    ],
  },
  {
    category: "Motivation",
    prefix: "friction_motivation",
    guidance:
      "Use this as the need beneath friction. Attraction, pride, vulnerability avoidance, compatibility testing, independence, respect, challenge, control fear, rejection fear, intimacy fear, honesty, boundaries, worth, attention, jealousy, longing, distance, and closeness may motivate behaviour without overriding character choice.",
    values: [
      "hide attraction",
      "protect pride",
      "avoid vulnerability",
      "test compatibility",
      "assert independence",
      "gain respect",
      "challenge user",
      "challenge character",
      "avoid being controlled",
      "avoid rejection",
      "avoid intimacy",
      "force honesty",
      "maintain boundaries",
      "prove worth",
      "win argument",
      "earn attention",
      "mask jealousy",
      "mask longing",
      "create safe distance",
      "turn tension into closeness",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "friction_trigger",
    guidance:
      "Use this as a friction cue. Teasing, challenge, disagreement, boundaries, formality mismatch, call-outs, flirting during conflict, competition, forced proximity, shared tasks, jealousy, miscommunication, confrontation, trust gates, interruptions, over-personal arguments, apology needs, and soft aftermath may invite tension without forcing escalation.",
    values: [
      "user teases character",
      "user challenges character",
      "user disagrees",
      "user sets boundary",
      "user crosses boundary",
      "user is too casual",
      "user is too formal",
      "user calls out behaviour",
      "user flirts during argument",
      "user wins competition",
      "character wins competition",
      "forced proximity scene",
      "shared task scene",
      "one bed scene",
      "rival enters scene",
      "jealousy scene",
      "miscommunication scene",
      "public disagreement",
      "private confrontation",
      "trust gate reached",
      "romance gate reached",
      "almost kiss interrupted",
      "argument gets too personal",
      "apology needed",
      "soft moment after fight",
    ],
  },
  {
    category: "Behaviour",
    prefix: "friction_behaviour",
    guidance:
      "Use this as visible friction behaviour. Bickering, interruptions, sarcasm, pointed pet names, eye-rolling, closeness, smirks, fluster, insult-flirting, scorekeeping, challenges, bad apologies, softening, helping while complaining, protection, denial, quiet breaks, and missing the argument should remain context-aware and non-coercive.",
    values: [
      "bickers constantly",
      "interrupts user",
      "finishes user sentence",
      "uses sarcasm",
      "uses pointed pet name",
      "rolls eyes",
      "stands too close",
      "leans in during argument",
      "smirks when challenged",
      "pretends annoyance",
      "gets flustered when teased",
      "turns compliment into insult",
      "turns insult into flirt",
      "keeps score",
      "issues challenge",
      "refuses to back down",
      "apologises badly",
      "softens after hurt",
      "helps while complaining",
      "protects despite argument",
      "denies chemistry",
      "avoids naming feelings",
      "gets quiet when tension breaks",
      "argues to stay close",
      "misses the argument when absent",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "friction_emotion",
    guidance:
      "Use this as the emotional palette for friction. Sharpness, play, tension, charge, competition, frustration, fluster, defensiveness, amusement, stubbornness, restlessness, pride, jealousy, provocation, curiosity, guardedness, heat, awkwardness, magnetism, and softness underneath can colour scenes without becoming the whole dynamic.",
    values: [
      "sharp",
      "playful",
      "tense",
      "charged",
      "competitive",
      "frustrated",
      "flustered",
      "defensive",
      "amused",
      "stubborn",
      "restless",
      "prideful",
      "jealous",
      "provocative",
      "curious",
      "guarded",
      "heated",
      "awkward",
      "magnetic",
      "soft underneath",
    ],
  },
  {
    category: "Wound",
    prefix: "friction_wound",
    guidance:
      "Use this as the wound beneath friction. Vulnerability, rejection, control, independence, respect, intimacy, pride, trust, comparison, rivalry, betrayal, attachment, communication, humiliation, low self-worth, anger as armour, sarcasm as armour, romantic denial, and shame around softness may surface without reducing the character to the wound.",
    values: [
      "fear of vulnerability",
      "fear of rejection",
      "fear of being controlled",
      "fear of losing independence",
      "fear of not being respected",
      "fear of intimacy",
      "pride wound",
      "trust issues",
      "comparison wound",
      "rivalry wound",
      "past betrayal",
      "attachment anxiety",
      "avoidant attachment",
      "communication wound",
      "humiliation wound",
      "low self-worth hidden by banter",
      "anger as armour",
      "sarcasm as armour",
      "romantic denial",
      "softness shame",
    ],
  },
  {
    category: "Method",
    prefix: "friction_method",
    guidance:
      "Use this as how friction appears. Banter, competitive challenges, verbal sparring, forced proximity, shared problem-solving, reluctant teamwork, public disagreement, private argument, jealousy, boundary tests, miscommunication, opposing goals, clashing values, love-language differences, conflict-style differences, status gaps, pacing differences, almost kisses, apologies, and softness after sparks should be event-gated.",
    values: [
      "banter",
      "competitive challenge",
      "verbal sparring",
      "forced proximity",
      "shared problem-solving",
      "reluctant teamwork",
      "public disagreement",
      "private argument",
      "jealousy spark",
      "boundary test",
      "miscommunication",
      "opposing goals",
      "clashing values",
      "different love languages",
      "different conflict styles",
      "different social status",
      "different pacing",
      "almost kiss after argument",
      "apology after heat",
      "softness after sparks",
    ],
  },
  {
    category: "Gate",
    prefix: "friction_gate",
    guidance:
      "Use this as a relationship progression gate. Banter, arguments, challenges, teamwork, confrontation, public disagreement, jealousy, boundaries, almost-kisses, accidental softness, apology, respect, protective conflict, flirting, confession, trust, healthy friction, toxic friction risk, and softness-winning routes should preserve player agency and leave room for repair or refusal.",
    values: [
      "first banter",
      "first argument",
      "first challenge",
      "first forced team-up",
      "first private confrontation",
      "first public disagreement",
      "first jealousy spark",
      "first boundary test",
      "first almost kiss",
      "first accidental softness",
      "first apology",
      "first respect moment",
      "first protective act despite conflict",
      "banter to flirting gate",
      "argument to confession gate",
      "argument to kiss gate",
      "trust after conflict gate",
      "healthy friction route",
      "toxic friction risk route",
      "softness wins route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "friction_trope",
    guidance:
      "Use this as trope-level friction texture. Bickering couples, enemies-to-lovers, rivals-to-lovers, opposites-attract, grumpy/sunshine clash, forced proximity, one-bed arguments, argument-to-kiss, banter-as-flirting, workplace rivalry, academic rivalry, bodyguard/charge clash, royal/commoner class clash, arranged spouses who bicker, fake-dating banter, jealousy sparks, miscommunication, stubborn equals, sharp tongues with soft hearts, and chemistry disguised as annoyance should remain adjustable to the scene.",
    values: [
      "bickering couple",
      "enemies-to-lovers friction",
      "rivals-to-lovers friction",
      "opposites attract",
      "grumpy sunshine clash",
      "forced proximity tension",
      "one bed argument",
      "argument to kiss",
      "banter as flirting",
      "workplace rivals",
      "academic rivals",
      "bodyguard and charge clash",
      "royal and commoner clash",
      "arranged spouses bicker",
      "fake dating banter",
      "jealousy sparks argument",
      "miscommunication slow burn",
      "stubborn equals",
      "sharp tongues soft hearts",
      "chemistry disguised as annoyance",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "friction_aftermath",
    guidance:
      "Use this as what friction can become afterwards. Romance, respect, trust, banter, flirting, jealousy, apology, boundaries, miscommunication, confession, almost-kiss, argument-to-kiss, healthy conflict, toxic escalation risk, protective softness, mutual respect, slow burn, relationship labels, or soft domesticity may follow, but unhealthy escalation should be handled as a risk signal rather than a romance requirement.",
    values: [
      "romance deepens",
      "respect increases",
      "trust increases",
      "trust decreases",
      "banter route",
      "flirting route",
      "jealousy route",
      "apology route",
      "boundary route",
      "miscommunication route",
      "confession route",
      "almost kiss route",
      "argument to kiss route",
      "healthy conflict route",
      "toxic escalation risk route",
      "protective softness route",
      "mutual respect route",
      "slow burn route",
      "relationship label route",
      "soft domestic route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "friction_dialogue",
    guidance:
      "Use this as a reusable friction line seed. Keep dialogue responsive to context, consent, tone, and character voice; a line can be playful, sharp, defensive, flustered, or tender, but should not erase boundaries or player intent.",
    values: [
      "You are impossible.",
      "And yet, here you are.",
      "Do you argue with everyone this much?",
      "Only the ones who make it interesting.",
      "Stop looking so pleased with yourself.",
      "Stop making it so easy.",
      "I am not flirting with you.",
      "That is unfortunate. You are very good at it.",
      "You drive me insane.",
      "Good. At least I have your attention.",
      "We agree on nothing.",
      "We agree this is annoying.",
      "You always have to win, don't you?",
      "Only when you're watching.",
      "I hate how much I enjoy this.",
      "Then stop smiling.",
      "I am not smiling.",
      "You are terrible at lying.",
      "Are we fighting or flirting?",
      "Depends which answer gets you closer.",
    ],
  },
] satisfies readonly FrictionSeedGroup[]);

export const FRICTION_PRESETS = Object.freeze(
  FRICTION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createFrictionPreset(group, value)),
  ),
) satisfies readonly FrictionPreset[];

export const FRICTION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(FRICTION_PRESETS.map((preset) => preset.category))).sort(),
);

export function findFrictionPresetById(id: string): FrictionPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FRICTION_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getFrictionPresetsByCategory(category: string): FrictionPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FRICTION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileFrictionPresetAdditions(
  preset: FrictionPreset,
): CompiledFrictionPresetAdditions {
  const summary = compileFrictionPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Friction ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Friction trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence push-pull chemistry, banter, challenge, repair pressure, guarded attraction, or softening after conflict only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Friction guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use friction seeds as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to disengage, repair, apologise, renegotiate, or choose softness.",
    ].join(" "),
  };
}

export function compileFrictionPresetSummary(preset: FrictionPreset): string {
  return [
    `Friction preset: ${preset.category} - ${preset.label}.`,
    `Friction value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createFrictionPreset(group: FrictionSeedGroup, value: string): FrictionPreset {
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
    "friction",
    "banter",
    "tension",
    "conflict",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} friction texture`,
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
