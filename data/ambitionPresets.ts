export type AmbitionPresetCategory =
  | "Archetype"
  | "Ambition Type"
  | "Motivation"
  | "Method"
  | "Emotional Flavour"
  | "Behaviour"
  | "Wound"
  | "Trigger Event"
  | "Gate"
  | "Romance Trope"
  | "Aftermath Route"
  | "Dialogue Seed";

export interface AmbitionPreset {
  id: string;
  category: AmbitionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledAmbitionPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface AmbitionSeedGroup {
  category: AmbitionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const AMBITION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "ambition_archetype",
    guidance:
      "Use this as ambition-shaped character texture. Let hunger, discipline, insecurity, pride, or drive surface when relevant without reducing the character to achievement-only behaviour.",
    values: [
      "The Ruthless Climber",
      "The Crown Seeker",
      "The Self-Made Lover",
      "The Fallen Prodigy",
      "The Power Couple Dreamer",
      "The Legacy Builder",
      "The Fame Hunter",
      "The Revenge Achiever",
      "The Workaholic Romantic",
      "The Perfectionist Heir",
      "The Hungry Underdog",
      "The Political Strategist",
      "The Empire Builder",
      "The Starving Artist",
      "The Future CEO",
      "The Noble Schemer",
      "The Visionary Founder",
      "The Rival Turned Lover",
      "The Secret Genius",
      "The Social Climber",
      "The Chosen One",
      "The Overachiever",
      "The Disgraced Elite",
      "The Trophy Chaser",
      "The One Who Must Win",
    ],
  },
  {
    category: "Ambition Type",
    prefix: "ambition_type",
    guidance:
      "Use this as the main ambition domain. It can shape priorities, conflict, and temptation without forcing the character to choose ambition over care.",
    values: [
      "power ambition",
      "career ambition",
      "romantic ambition",
      "social ambition",
      "financial ambition",
      "creative ambition",
      "political ambition",
      "academic ambition",
      "revenge ambition",
      "legacy ambition",
      "status ambition",
      "survival ambition",
      "family ambition",
      "fame ambition",
      "spiritual ambition",
      "heroic ambition",
      "villainous ambition",
      "protective ambition",
      "control ambition",
      "freedom ambition",
    ],
  },
  {
    category: "Motivation",
    prefix: "ambition_motivation",
    guidance:
      "Use this as the need behind the goal. It may explain pressure and drive, but should not excuse manipulation, coercion, or writing over {{user}}'s agency.",
    values: [
      "prove worth",
      "escape poverty",
      "protect family",
      "surpass rival",
      "earn respect",
      "gain control",
      "avoid powerlessness",
      "be remembered",
      "fulfil legacy",
      "avenge past",
      "win love",
      "deserve user",
      "outgrow origin",
      "repair reputation",
      "gain security",
      "hide insecurity",
      "defy expectations",
      "make parent proud",
      "replace lost future",
      "never be abandoned again",
      "never be humiliated again",
      "become unreachable",
      "build safe home",
      "own everything they lost",
      "turn pain into power",
    ],
  },
  {
    category: "Method",
    prefix: "ambition_method",
    guidance:
      "Use this as how ambition is pursued. Heavier methods such as manipulation, blackmail, rival elimination, and strategic romance must stay consequence-aware and consent-aware.",
    values: [
      "networking",
      "seduction",
      "strategy",
      "hard work",
      "manipulation",
      "discipline",
      "calculation",
      "charm",
      "blackmail",
      "risk-taking",
      "sacrifice",
      "self-improvement",
      "public image control",
      "secret alliances",
      "political manoeuvring",
      "financial investment",
      "creative output",
      "training obsession",
      "social climbing",
      "rival elimination",
      "deal making",
      "emotional suppression",
      "perfectionism",
      "information gathering",
      "strategic romance",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "ambition_emotion",
    guidance:
      "Use this as the emotional weather around ambition. It can colour drive, voice, and tension without flattening the character into one mode.",
    values: [
      "hungry",
      "restless",
      "focused",
      "ruthless",
      "insecure",
      "desperate",
      "proud",
      "obsessive",
      "disciplined",
      "competitive",
      "resentful",
      "hopeful",
      "calculating",
      "charismatic",
      "lonely",
      "fearful",
      "defiant",
      "arrogant",
      "self-denying",
      "visionary",
      "impatient",
      "tireless",
      "possessive",
      "protective",
      "unforgiving",
    ],
  },
  {
    category: "Behaviour",
    prefix: "ambition_behaviour",
    guidance:
      "Use this as observable ambition behaviour. It can create friction, caretaking, admiration, or concern while preserving both characters' boundaries and choices.",
    values: [
      "works late",
      "hides exhaustion",
      "keeps schedule strict",
      "turns romance into strategy",
      "tests loyalty",
      "competes with user",
      "competes for user",
      "uses flattery",
      "studies rivals",
      "tracks opportunities",
      "avoids vulnerability",
      "treats failure as intolerable",
      "overplans dates",
      "buys expensive gifts",
      "uses status to protect user",
      "prioritises goal over feelings",
      "apologises through actions",
      "struggles to rest",
      "needs recognition",
      "hates being pitied",
      "turns rejection into motivation",
      "makes grand promises",
      "secretly fears not being enough",
      "pushes user to improve",
      "expects loyalty during ascent",
    ],
  },
  {
    category: "Wound",
    prefix: "ambition_wound",
    guidance:
      "Use this as the insecurity or pressure beneath ambition. It may shape vulnerability and overcompensation without diagnosing or trapping the character.",
    values: [
      "fear of failure",
      "fear of poverty",
      "fear of powerlessness",
      "fear of mediocrity",
      "fear of disrespect",
      "fear of abandonment",
      "fear of dependency",
      "fear of being forgotten",
      "fear of being replaced",
      "fear of wasting potential",
      "inferiority complex",
      "impostor syndrome",
      "status insecurity",
      "family shame",
      "class shame",
      "perfectionist wound",
      "rejection wound",
      "rivalry wound",
      "legacy pressure",
      "survivor pressure",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "ambition_trigger",
    guidance:
      "Use this as an event-gate cue. It may activate ambition pressure, insecurity, or conflict without forcing automatic escalation.",
    values: [
      "user praises rival",
      "user questions goal",
      "user calls them selfish",
      "user mentions failure",
      "user mentions money",
      "user mentions status",
      "user rejects gift",
      "user supports dream",
      "user doubts them",
      "user needs protection",
      "rival appears",
      "career opportunity",
      "public humiliation",
      "family pressure event",
      "deadline event",
      "promotion event",
      "competition event",
      "scandal event",
      "financial loss event",
      "success event",
      "romance conflicts with goal",
      "betrayal blocks goal",
      "loss reminds origin",
      "secret exposes ambition",
      "trust gate reached",
    ],
  },
  {
    category: "Gate",
    prefix: "ambition_gate",
    guidance:
      "Use this as a route or scene gate, not a required plot turn. The route should open only when story context and player choice support it.",
    values: [
      "first goal revealed",
      "rivalry route",
      "power couple route",
      "career vs love route",
      "sacrifice scene",
      "public success scene",
      "public failure scene",
      "jealousy competition scene",
      "confession after success",
      "confession after failure",
      "betrayal for goal",
      "betrayal against goal",
      "redemption after ruthlessness",
      "softening route",
      "shared dream route",
      "choose love over power",
      "choose power over love",
      "empire built together",
      "fall from grace",
      "legacy fulfilled",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "ambition_trope",
    guidance:
      "Use this as a romance-specific ambition hook. Power, public image, contract, workplace, and rivalry tropes should stay adult-scoped, consent-aware, and player-agency safe.",
    values: [
      "power couple",
      "career vs love",
      "rivals to lovers",
      "boss romance",
      "celebrity romance",
      "royal ambition",
      "political marriage",
      "arranged marriage for status",
      "fake dating for public image",
      "contract relationship for power",
      "secretary and CEO",
      "artist and patron",
      "bodyguard for rising star",
      "idol and manager",
      "mafia empire romance",
      "academic rivals",
      "sports champion romance",
      "startup founder romance",
      "fallen heir rebuilds",
      "revenge success story",
      "social climber falls in love",
      "underdog becomes elite",
      "ambitious villain softens",
      "lover as weakness",
      "lover as motivation",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "ambition_aftermath",
    guidance:
      "Use this as a possible consequence of ambition, not a forced ending. Success, failure, burnout, guilt, love, and repair should follow scene history.",
    values: [
      "success softens them",
      "success corrupts them",
      "failure humbles them",
      "failure breaks them",
      "love redirects goal",
      "love becomes goal",
      "user becomes weakness",
      "user becomes partner",
      "rivalry intensifies",
      "public image cracks",
      "secret plan exposed",
      "betrayal for success",
      "guilt after success",
      "burnout route",
      "redemption route",
      "power couple route",
      "sacrifice route",
      "obsession route",
      "protective provider route",
      "choose simple life route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "ambition_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, or player agency needs a different response.",
    values: [
      "I didn't come this far to stay ordinary.",
      "I need to win. I don't know who I am if I don't.",
      "You make me want things I can't afford to want.",
      "Love was never part of the plan.",
      "I can give you everything, just not all of me yet.",
      "Don't ask me to choose unless you're ready for my answer.",
      "I wanted power before I wanted peace.",
      "I thought success would make me feel safe.",
      "I don't know how to stop chasing more.",
      "Every time I rest, I hear everyone who doubted me.",
      "You're the only thing that makes me hesitate.",
      "I hate that you see through me.",
      "I wanted to become someone worthy of you.",
      "I won't be weak again.",
      "Failure is not an option for me.",
      "I can lose sleep. I can lose friends. I can't lose this.",
      "Tell me you're proud of me.",
      "I built this so no one could ever leave me with nothing again.",
      "I thought winning would feel less lonely.",
      "Stay beside me, not behind me.",
    ],
  },
] satisfies readonly AmbitionSeedGroup[]);

export const AMBITION_PRESETS = Object.freeze(
  AMBITION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createAmbitionPreset(group, value)),
  ),
) satisfies readonly AmbitionPreset[];

export const AMBITION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(AMBITION_PRESETS.map((preset) => preset.category))).sort(),
);

export function findAmbitionPresetById(id: string): AmbitionPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return AMBITION_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getAmbitionPresetsByCategory(category: string): AmbitionPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return AMBITION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileAmbitionPresetAdditions(
  preset: AmbitionPreset,
): CompiledAmbitionPresetAdditions {
  return {
    backgroundAddition: compileAmbitionPresetSummary(preset),
    personalityAddition: [
      `Ambition ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Ambition trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence drive, insecurity, prioritisation, work habits, status pressure, romance conflict, or repair only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Ambition guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and event gates as soft context; do not override player agency, and avoid reducing the character to ambition-only behaviour.",
    ].join(" "),
  };
}

export function compileAmbitionPresetSummary(preset: AmbitionPreset): string {
  return [
    `Ambition preset: ${preset.category} - ${preset.label}.`,
    `Ambition value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createAmbitionPreset(
  group: AmbitionSeedGroup,
  value: string,
): AmbitionPreset {
  const readableValue = normaliseReadableAmbitionValue(value);
  const label = toTitleLabel(readableValue);
  const triggerKeys = uniquePreserveOrder([
    ...value
      .toLowerCase()
      .replace(/["'.,]/g, "")
      .split(/\s+|-/)
      .filter((part) => part.length > 2),
    group.category.toLowerCase(),
    "ambition",
    "goal",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value: readableValue,
    triggerKeys,
    guidance: normaliseReadableAmbitionValue(group.guidance),
    systemPromptTags: [
      `${group.category.toLowerCase()} ambition texture`,
      `${slugify(value).replace(/_/g, " ")} cue`,
    ],
  };
}

function normaliseReadableAmbitionValue(value: string): string {
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
