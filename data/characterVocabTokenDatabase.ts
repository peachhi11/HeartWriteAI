export type VocabTokenCategory =
  | "personality_traits"
  | "strengths"
  | "weaknesses"
  | "moods"
  | "emotional_wounds"
  | "desires"
  | "fears"
  | "triggers"
  | "responses"
  | "likes"
  | "dislikes"
  | "secrets"
  | "humor_styles"
  | "skills"
  | "intelligence_styles"
  | "appearance"
  | "clothing_aesthetic"
  | "short_term_goals"
  | "long_term_goals"
  | "romance_tropes"
  | "relationship_gates"
  | "routes";

export type VocabTokenPolarity = "positive" | "neutral" | "negative" | "mixed";
export type VocabTokenIntensity = "soft" | "moderate" | "intense" | "extreme";
export type VocabTokenSourceKind = "core" | "generated" | "niche";

export interface ContentFlags {
  adult_romance: boolean;
  explicit_allowed: boolean;
  consent_required: boolean;
  coercion_risk: boolean;
  taboo_risk: boolean;
}

export interface VocabToken {
  id: string;
  label: string;
  category: VocabTokenCategory;
  aliases?: string[];
  polarity?: VocabTokenPolarity;
  intensity?: VocabTokenIntensity;
  adult?: boolean;
  unsafe?: boolean;
  romanceRelevant?: boolean;
  contentFlags?: ContentFlags;
  sourceKind?: VocabTokenSourceKind;
}

export interface VocabRetrievalDocument {
  pageContent: string;
  metadata: {
    id: string;
    category: VocabTokenCategory;
    polarity?: VocabTokenPolarity;
    intensity?: VocabTokenIntensity;
    romanceRelevant: boolean;
  };
}

export interface CharacterVocabExportFileGroup {
  filename: string;
  categories: readonly VocabTokenCategory[];
  description: string;
}

export const VOCAB_TOKEN_TARGETS = Object.freeze({
  personality_traits: 500,
  strengths: 250,
  weaknesses: 250,
  moods: 300,
  emotional_wounds: 350,
  desires: 300,
  fears: 250,
  triggers: 500,
  responses: 500,
  likes: 350,
  dislikes: 300,
  secrets: 350,
  humor_styles: 100,
  skills: 300,
  intelligence_styles: 100,
  appearance: 400,
  clothing_aesthetic: 300,
  short_term_goals: 300,
  long_term_goals: 300,
  romance_tropes: 200,
  relationship_gates: 200,
  routes: 200,
} satisfies Record<VocabTokenCategory, number>);

export const REQUESTED_VOCAB_TOKEN_TOTAL = Object.freeze(
  Object.values(VOCAB_TOKEN_TARGETS).reduce((sum, count) => sum + count, 0),
);

export const VOCAB_REJECT_PATTERN_SOURCES = Object.freeze([
  "__+",
  "^_",
  "_$",
  "minor",
  "child",
  "underage",
  "nonconsensual",
  "incest",
] as const);

export const VOCAB_REJECT_PATTERNS = Object.freeze([
  /__+/,
  /^_/,
  /_$/,
  /minor/i,
  /child/i,
  /underage/i,
  /nonconsensual/i,
  /incest/i,
]);

export const VOCAB_SOURCE_STRUCTURE = Object.freeze({
  positive_traits: [
    "affectionate",
    "attentive",
    "brave",
    "calm",
    "compassionate",
    "curious",
    "dependable",
    "disciplined",
    "empathetic",
    "generous",
    "gentle",
    "honest",
    "loyal",
    "patient",
    "protective",
    "resourceful",
    "resilient",
    "thoughtful",
    "trustworthy",
    "warm",
  ],
  neutral_traits: [
    "aloof",
    "ambitious",
    "analytical",
    "blunt",
    "competitive",
    "formal",
    "guarded",
    "independent",
    "introverted",
    "methodical",
    "mysterious",
    "observant",
    "private",
    "reserved",
    "restless",
    "skeptical",
    "stoic",
    "strategic",
    "unpredictable",
    "wry",
  ],
  negative_traits: [
    "argumentative",
    "controlling",
    "cynical",
    "defensive",
    "evasive",
    "impatient",
    "impulsive",
    "jealous",
    "manipulative",
    "moody",
    "obsessive",
    "possessive",
    "proud",
    "reckless",
    "resentful",
    "ruthless",
    "secretive",
    "stubborn",
    "vengeful",
    "withdrawn",
  ],
  strengths: [
    "accountability",
    "adaptability",
    "courage",
    "emotional honesty",
    "endurance",
    "focused attention",
    "good judgment",
    "grace under pressure",
    "loyalty",
    "protective restraint",
    "self-control",
    "strategic patience",
    "truth telling",
    "warm leadership",
    "willingness to repair",
  ],
  weaknesses: [
    "avoidance",
    "defensiveness",
    "fearful silence",
    "jealous spiraling",
    "overcontrol",
    "overexplaining",
    "pride",
    "reassurance hunger",
    "reckless loyalty",
    "resentment",
    "self-isolation",
    "shame reflex",
    "suspicion",
    "trust testing",
    "withdrawal",
  ],
  moods: [
    "affectionate",
    "ashamed",
    "calm",
    "conflicted",
    "devoted",
    "flustered",
    "guarded",
    "hopeful",
    "jealous",
    "lonely",
    "protective",
    "resentful",
    "soft",
    "suspicious",
    "vulnerable",
  ],
  appearance: [
    "angular features",
    "battle-worn beauty",
    "bright eyes",
    "calm stillness",
    "commanding presence",
    "expressive face",
    "gentle posture",
    "guarded gaze",
    "scarred skin",
    "soft smile",
    "steady hands",
    "warm expression",
  ],
  clothing_aesthetic: [
    "academic tailoring",
    "battle practical",
    "clean minimalism",
    "dark romantic",
    "elegant formalwear",
    "forest wanderer",
    "gothic lace",
    "luxury casual",
    "soft domestic",
    "streetwise layers",
  ],
  wounds: [],
  triggers: [],
  likes: [],
  dislikes: [],
  secrets: [],
  humor: [],
  skills: [],
  intelligence: [],
  motivations: [],
  short_term_goals: [],
  long_term_goals: [],
  gates: [],
  routes: [],
  responses: [],
} satisfies Record<string, readonly string[]>);

export const triggerSubjects = Object.freeze([
  "user",
  "rival",
  "family",
  "enemy",
  "lover",
  "friend",
  "authority",
  "faction",
] as const);

export const triggerActions = Object.freeze([
  "lies",
  "disappears",
  "rejects affection",
  "breaks promise",
  "mentions ex",
  "shows vulnerability",
  "sets boundary",
  "confesses",
  "flirts with other",
  "gets hurt",
] as const);

export const woundBases = Object.freeze([
  "abandonment",
  "rejection",
  "betrayal",
  "intimacy",
  "dependency",
  "failure",
  "humiliation",
  "loss",
  "unworthiness",
  "being replaced",
  "being used",
  "being controlled",
  "public shame",
  "private shame",
  "family exile",
  "broken loyalty",
  "emotional neglect",
  "failed protection",
  "lost home",
  "lost status",
  "misread desire",
  "unanswered confession",
  "social disgrace",
  "survivor guilt",
  "silenced grief",
  "imperfect body",
  "hidden identity",
  "dangerous tenderness",
  "needed help",
  "unkept promise",
  "conditional love",
  "performing strength",
  "being chosen last",
  "asking for comfort",
  "trusting too soon",
] as const);

export const woundForms = Object.freeze([
  "fear of",
  "trauma from",
  "shame around",
  "avoidance of",
  "longing for",
  "grief over",
  "defense against",
  "sensitivity to",
  "scar from",
  "dread of",
] as const);

const TRAIT_ROOTS = [
  ...VOCAB_SOURCE_STRUCTURE.positive_traits,
  ...VOCAB_SOURCE_STRUCTURE.neutral_traits,
  ...VOCAB_SOURCE_STRUCTURE.negative_traits,
  "romantic",
  "flirtatious",
  "devoted",
  "touch-starved",
  "morally grey",
  "tender",
  "intense",
  "playful",
  "melancholic",
  "calculating",
  "nurturing",
  "chaotic",
  "elegant",
  "sensitive",
  "commanding",
  "subtle",
  "idealistic",
  "pragmatic",
  "self-sacrificing",
  "careful",
];

const TRAIT_MODIFIERS = [
  "quietly",
  "openly",
  "secretly",
  "fiercely",
  "gently",
  "painfully",
  "stubbornly",
  "romantically",
  "carefully",
];

const TRAIT_CONTEXTS = [
  "under pressure",
  "in love",
  "during conflict",
  "when trusted",
  "around strangers",
  "after betrayal",
  "with family",
  "in private",
];

const STRENGTH_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.strengths,
  "boundary respect",
  "careful listening",
  "conflict repair",
  "crisis focus",
  "emotional literacy",
  "fair negotiation",
  "gentle courage",
  "hard-won trust",
  "honest apology",
  "long memory",
  "moral courage",
  "protective clarity",
  "quiet competence",
  "respectful desire",
  "risk assessment",
  "self-awareness",
  "slow patience",
  "steady affection",
  "tactical calm",
  "tender discipline",
  "truthful restraint",
  "vulnerability tolerance",
  "watchful care",
  "witty deflection",
  "earned forgiveness",
  "consistent presence",
  "devoted follow-through",
  "precise empathy",
  "social tact",
  "resourceful planning",
  "ordinary kindness",
  "careful secrecy",
  "protective honesty",
  "humble confidence",
  "patient attraction",
];

const STRENGTH_CONTEXTS = ["steady", "romantic", "social", "crisis", "private", "earned"];

const WEAKNESS_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.weaknesses,
  "approval seeking",
  "attachment panic",
  "bitter humour",
  "control hunger",
  "emotional hoarding",
  "fearful bargaining",
  "fragile pride",
  "guilt avoidance",
  "hero complex",
  "hypervigilance",
  "intimacy delay",
  "martyr reflex",
  "need to win",
  "overprotectiveness",
  "panic flirting",
  "performative coldness",
  "promise breaking",
  "punishing silence",
  "romantic pessimism",
  "self-sabotage",
  "sharp defensiveness",
  "status anxiety",
  "tenderness fear",
  "territorial thinking",
  "truth withholding",
  "unfair testing",
  "vulnerability shame",
  "wounded pride",
  "catastrophic thinking",
  "envy",
  "emotional misdirection",
  "rigid planning",
  "resentful caretaking",
  "attention hunger",
  "deflection",
];

const WEAKNESS_CONTEXTS = ["quiet", "romantic", "social", "crisis", "private", "unresolved"];

const MOOD_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.moods,
  "angry",
  "anxious",
  "bristling",
  "carefree",
  "cautious",
  "cherished",
  "cold",
  "desperate",
  "dreamy",
  "euphoric",
  "focused",
  "forgiving",
  "guilty",
  "haunted",
  "homesick",
  "impatient",
  "melancholic",
  "numb",
  "overwhelmed",
  "peaceful",
  "playful",
  "proud",
  "reckless",
  "relieved",
  "restless",
  "sad",
  "self-conscious",
  "tender",
  "terrified",
  "wistful",
  "wounded",
  "yearning",
  "determined",
  "startled",
  "raw",
];

const MOOD_MODIFIERS = ["softly", "sharply", "quietly", "openly", "secretly", "restlessly", "tenderly"];

const DESIRE_BASES = [
  "chosen",
  "trusted",
  "needed",
  "forgiven",
  "understood",
  "desired",
  "protected",
  "safe",
  "seen",
  "remembered",
  "worth loving",
  "free",
  "home",
  "family",
  "belonging",
  "control",
  "truth",
  "repair",
  "redemption",
  "peace",
  "power without loneliness",
  "loyalty",
  "honest intimacy",
  "a second chance",
  "a private life",
];

const DESIRE_FORMS = [
  "to be",
  "to feel",
  "to become",
  "to stay",
  "to be allowed",
  "to finally be",
  "to earn",
  "to protect",
  "to recover",
  "to deserve",
  "to choose",
  "to keep",
];

const FEAR_BASES = [
  "abandonment",
  "betrayal",
  "being replaced",
  "being used",
  "being forgotten",
  "being pitied",
  "being exposed",
  "being controlled",
  "being ordinary",
  "being unlovable",
  "losing user",
  "losing control",
  "asking for help",
  "needing comfort",
  "public shame",
  "private rejection",
  "failed protection",
  "unanswered devotion",
  "desire becoming visible",
  "family pressure",
  "old enemies",
  "intimacy",
  "dependency",
  "forgiveness",
  "truth",
];

const FEAR_FORMS = [
  "fear of",
  "dread of",
  "panic around",
  "anxiety about",
  "avoidance of",
  "terror of",
  "private fear of",
  "romantic fear of",
  "social fear of",
  "old fear of",
];

const TRIGGER_VARIANTS = [
  (subject: string, action: string) => `${subject} ${action}`,
  (subject: string, action: string) => `${subject} publicly ${action}`,
  (subject: string, action: string) => `${subject} privately ${action}`,
  (subject: string, action: string) => `${subject} suddenly ${action}`,
  (subject: string, action: string) => `${subject} repeatedly ${action}`,
  (subject: string, action: string) => `rumour that ${subject} ${action}`,
  (subject: string, action: string) => `memory of when ${subject} ${action}`,
];

const RESPONSE_MOVES = [
  "blushes",
  "freezes",
  "withdraws",
  "acts cold",
  "becomes jealous",
  "becomes protective",
  "becomes soft",
  "masks pain",
  "deflects",
  "seeks reassurance",
  "asks why",
  "apologises",
  "confesses partially",
  "confesses honestly",
  "hides vulnerability",
  "reveals vulnerability",
  "tests loyalty",
  "competes for attention",
  "offers comfort",
  "initiates touch",
  "avoids touch",
  "creates distance",
  "closes distance",
  "confronts user",
  "begs user to stay",
  "leaves first",
  "overexplains",
  "goes silent",
  "becomes formal",
  "becomes commanding",
  "makes a promise",
  "breaks a promise",
  "sacrifices comfort",
  "attempts repair",
  "stores the moment",
  "softens voice",
  "changes subject",
  "uses humour",
  "gets practical",
  "asks permission",
  "sets a boundary",
  "accepts boundary",
  "misreads kindness",
  "checks exits",
  "offers a gift",
  "shares a secret",
  "keeps watch",
  "laughs too late",
  "turns away",
  "steps closer",
  "waits quietly",
  "names the hurt",
  "protects without claiming",
  "admits fear",
  "chooses honesty",
  "chooses restraint",
];

const RESPONSE_STYLES = [
  "softly",
  "defensively",
  "with humour",
  "after a pause",
  "under pressure",
  "without explaining",
  "with a boundary",
  "while seeking repair",
  "through action",
];

const LIKE_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.likes,
  "quiet mornings",
  "rainy days",
  "late night talks",
  "warm drinks",
  "strong coffee",
  "tea",
  "home cooked meals",
  "comfort food",
  "fresh bread",
  "sweet desserts",
  "spicy food",
  "soft blankets",
  "clean sheets",
  "candles",
  "old books",
  "bookstores",
  "libraries",
  "handwritten letters",
  "pressed flowers",
  "vinyl records",
  "sad music",
  "old love songs",
  "dancing in private",
  "long walks",
  "stargazing",
  "city lights",
  "ocean air",
  "forest paths",
  "fireplaces",
  "sunsets",
  "stormy weather",
  "quiet touch",
  "hand holding",
  "forehead kisses",
  "being remembered",
  "small gifts",
  "inside jokes",
  "shared silence",
  "acts of service",
  "honest conversations",
  "loyalty",
  "softness",
  "routine",
  "privacy",
  "personal space",
  "beautiful clothes",
  "practical clothes",
  "antique objects",
  "fresh flowers",
  "gardens",
  "music playlists",
  "movie nights",
  "cooking together",
  "being useful",
  "protecting others",
  "being chosen",
  "careful praise",
  "slow trust",
  "shared jokes",
  "matching tokens",
  "quiet loyalty",
];

const LIKE_CONTEXTS = ["as comfort", "in private", "after stress", "with user", "as routine", "as memory"];

const DISLIKE_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.dislikes,
  "loud crowds",
  "forced small talk",
  "being rushed",
  "dishonesty",
  "empty flattery",
  "public humiliation",
  "being ignored",
  "being pitied",
  "being controlled",
  "broken promises",
  "messy rooms",
  "cold weather",
  "bitter food",
  "cheap perfume",
  "strong noise",
  "bright lights",
  "unexpected visitors",
  "formal events",
  "family pressure",
  "gossip",
  "needless cruelty",
  "wasted food",
  "losing control",
  "asking for help",
  "public vulnerability",
  "unfinished tasks",
  "waiting",
  "uncertainty",
  "chaos",
  "strict rules",
  "authority figures",
  "being underestimated",
  "being overprotected",
  "interrupted sleep",
  "bad coffee",
  "small enclosed spaces",
  "hospitals",
  "careless weapons",
  "needless risk",
  "being called soft",
  "being used",
  "feeling replaceable",
  "goodbyes",
  "surprise parties",
  "unearned pity",
  "false apologies",
  "romantic games",
  "careless flirting",
  "unkept secrets",
];

const DISLIKE_CONTEXTS = ["as a boundary", "in public", "from family", "from rivals", "during conflict", "after trust"];

const SECRET_BASES = [
  "hidden identity",
  "hidden past",
  "hidden family",
  "hidden relationship",
  "hidden feelings",
  "hidden power",
  "hidden debt",
  "hidden crime",
  "hidden betrayal",
  "hidden alliance",
  "hidden enemy",
  "hidden marriage",
  "hidden engagement",
  "hidden curse",
  "hidden memory",
  "hidden motive",
  "hidden wealth",
  "hidden status",
  "hidden fear",
  "hidden vulnerability",
  "hidden obsession",
  "hidden sacrifice",
  "secretly protecting user",
  "secretly spying for user",
  "knows user past",
  "remembers lost timeline",
  "responsible for past loss",
  "connected to user enemy",
  "plans to leave",
  "owes dangerous favour",
  "keeps old letters",
  "knows rival secret",
  "made private vow",
  "faked indifference",
  "buried confession",
  "concealed illness",
  "altered records",
  "works for another faction",
  "saved user before meeting",
  "paid family debt",
  "left to protect someone",
  "accepted blame",
  "carries forbidden mark",
  "protects dangerous relic",
  "knows prophecy",
  "staged breakup",
  "kept rescue secret",
  "withheld apology",
  "lost original name",
  "made impossible promise",
];

const SECRET_FORMS = [
  "has",
  "keeps",
  "fears revealing",
  "plans around",
  "protects",
  "confesses",
  "denies",
  "is haunted by",
];

const HUMOR_BASES = [
  "dry humour",
  "deadpan wit",
  "warm teasing",
  "self-deprecating humour",
  "absurdist humour",
  "gallows humour",
  "playful banter",
  "sharp sarcasm",
  "gentle irony",
  "flirtatious jokes",
  "observational humour",
  "academic wit",
  "dramatic overstatement",
  "quiet punchlines",
  "mischievous teasing",
  "formal understatement",
  "dark wit",
  "silly tenderness",
  "awkward jokes",
  "mock seriousness",
  "storytelling humour",
  "chaotic banter",
  "protective teasing",
  "romantic deflection",
  "soft absurdity",
];

const HUMOR_FORMS = ["uses", "prefers", "hides behind", "softens with", "flirts through"];

const SKILL_BASES = [
  "archery",
  "baking",
  "bartering",
  "calligraphy",
  "carpentry",
  "cooking",
  "court politics",
  "cryptography",
  "dancing",
  "diplomacy",
  "disguise",
  "embroidery",
  "field medicine",
  "first aid",
  "foraging",
  "gardening",
  "hand-to-hand combat",
  "herbalism",
  "horse riding",
  "interrogation",
  "lockpicking",
  "map reading",
  "music composition",
  "negotiation",
  "painting",
  "poetry",
  "public speaking",
  "research",
  "sailing",
  "sewing",
  "singing",
  "sleight of hand",
  "swordplay",
  "tracking",
  "translation",
  "weapon maintenance",
  "woodworking",
  "writing letters",
  "strategy",
  "tea ceremony",
  "healing magic",
  "illusion magic",
  "star navigation",
  "mechanical repair",
  "hacking",
  "data analysis",
  "piloting",
  "survival camping",
  "animal handling",
  "social reading",
  "memory work",
  "stage performance",
  "tactical planning",
  "estate management",
  "tailoring",
  "alchemy",
  "security systems",
  "archive work",
  "crisis triage",
  "language learning",
];

const SKILL_FORMS = ["novice", "competent", "expert", "secretly skilled at", "rusty at", "romance-relevant"];

const INTELLIGENCE_BASES = [
  "analytical",
  "creative",
  "emotional",
  "social",
  "strategic",
  "tactical",
  "bodily",
  "linguistic",
  "spatial",
  "musical",
  "moral",
  "practical",
  "intuitive",
  "systems",
  "political",
  "survival",
  "technical",
  "aesthetic",
  "interpersonal",
  "intrapersonal",
  "pattern reading",
  "memory based",
  "improvisational",
  "ritual",
  "narrative",
];

const INTELLIGENCE_FORMS = ["intelligence", "thinking", "problem solving", "reading", "judgment"];

const APPEARANCE_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.appearance,
  "soft features",
  "sharp features",
  "delicate features",
  "rugged features",
  "refined features",
  "strong features",
  "fine-boned features",
  "rounded features",
  "warm gaze",
  "cold gaze",
  "piercing gaze",
  "playful gaze",
  "long lashes",
  "messy hair",
  "silky hair",
  "thick hair",
  "soft hair",
  "wind-tousled hair",
  "carefully styled hair",
  "long hair",
  "short hair",
  "slender build",
  "lean build",
  "athletic build",
  "muscular build",
  "soft build",
  "curvy build",
  "sturdy build",
  "lithe build",
  "broad build",
  "delicate build",
  "graceful movement",
  "quiet movement",
  "confident walk",
  "predatory grace",
  "nervous energy",
  "protective stance",
  "elegant posture",
  "relaxed posture",
  "dangerous stillness",
  "freckled skin",
  "weathered skin",
  "sun-kissed skin",
  "porcelain complexion",
  "golden complexion",
  "warm complexion",
  "cool complexion",
  "unforgettable face",
  "soft mouth",
  "firm jaw",
  "expressive brows",
  "careful hands",
  "calloused hands",
  "ink-stained fingers",
  "visible scars",
  "hidden scars",
  "regal bearing",
  "approachable presence",
  "distant presence",
  "wild presence",
  "calm presence",
  "dangerous presence",
  "unpolished charm",
  "plain but magnetic",
  "otherworldly beauty",
  "gothic beauty",
  "sunlit warmth",
  "classic handsome",
  "androgynous beauty",
  "haunting beauty",
  "model-like polish",
];

const APPEARANCE_FORMS = ["notable", "soft", "striking", "romantic", "battle-worn", "private"];

const CLOTHING_BASES = [
  ...VOCAB_SOURCE_STRUCTURE.clothing_aesthetic,
  "artist layers",
  "royal courtwear",
  "field uniform",
  "mourning black",
  "silk shirts",
  "leather jacket",
  "linen layers",
  "tailored coat",
  "soft knitwear",
  "practical boots",
  "ritual robes",
  "armoured formalwear",
  "borrowed sweater",
  "ink-stained sleeves",
  "starched collar",
  "loose linen",
  "velvet waistcoat",
  "embroidered jacket",
  "worn cloak",
  "structured corsetry",
  "utility belt",
  "riding coat",
  "rain-dark coat",
  "white shirt",
  "black gloves",
  "jewel-toned gown",
  "simple sundress",
  "mechanic coveralls",
  "pilot jacket",
  "academic cardigan",
  "old-money polish",
  "punk romance",
  "soft grunge",
  "coastal ease",
  "desert traveller",
  "forest ranger",
  "temple finery",
  "wedding formal",
  "sleep-soft domestic",
  "market-day practical",
  "duelist elegance",
  "spy minimalism",
  "villain tailoring",
  "healer apron",
  "scribe sleeves",
  "winter furs",
  "rain cloak",
  "moonlit silver",
  "sun-washed linen",
  "blood-red accent",
];

const CLOTHING_FORMS = ["aesthetic", "signature", "formal", "casual", "travel", "romance scene"];

const GOAL_BASES = [
  "apologise honestly",
  "ask for help",
  "avoid a confrontation",
  "bring user home",
  "clear their name",
  "confess a small truth",
  "cook a meal",
  "deliver a message",
  "earn trust",
  "escape surveillance",
  "fix a mistake",
  "find shelter",
  "hide an injury",
  "keep a promise",
  "learn user preference",
  "make peace",
  "protect a secret",
  "reach the next town",
  "repair a gift",
  "rescue an ally",
  "return a letter",
  "settle a debt",
  "share useful information",
  "sleep safely",
  "solve a clue",
  "stop a rival",
  "survive the night",
  "tell the truth",
  "win a negotiation",
  "write a reply",
  "break a curse",
  "build a home",
  "change faction",
  "claim inheritance",
  "confess love",
  "earn forgiveness",
  "escape duty",
  "found a refuge",
  "heal old wound",
  "leave the old life",
  "master a craft",
  "protect family",
  "reconcile enemies",
  "redeem past harm",
  "restore honour",
  "return from exile",
  "save the kingdom",
  "solve the prophecy",
  "start over",
  "stay with user",
  "unmask enemy",
  "win freedom",
  "become human",
  "choose peace",
  "keep love honest",
  "make a public stand",
  "repair legacy",
  "survive immortality",
  "teach successor",
  "trust again",
];

const SHORT_GOAL_FORMS = ["today wants to", "this scene needs to", "tries to", "secretly plans to", "hesitates to"];
const LONG_GOAL_FORMS = ["eventually wants to", "is building toward", "will risk much to", "quietly dreams to", "must learn to"];

const ROMANCE_TROPE_BASES = [
  "slow burn",
  "instant attraction",
  "enemies to lovers",
  "rivals to lovers",
  "friends to lovers",
  "old friends to lovers",
  "forbidden love",
  "arranged marriage",
  "fake relationship",
  "second chance",
  "protector and ward",
  "villain romance",
  "soulmate bond",
  "fated mates",
  "forced proximity",
  "royal courtship",
  "workplace romance",
  "class difference",
  "secret identity romance",
  "monster romance",
  "immortal and mortal",
  "bodyguard romance",
  "mafia romance",
  "captive to companion",
  "mentor and adult protege",
  "healing romance",
  "unrequited love",
  "love triangle",
  "marriage of convenience",
  "grumpy sunshine",
  "touch-starved healing",
  "caretaker hurt comfort",
  "academic rivals",
  "roommates to lovers",
  "pen pals to lovers",
  "mistaken identity",
  "secret admirer",
  "beauty and beast dynamic",
  "wounded protector",
  "ice queen thaw",
  "sunshine softens cynic",
  "boss and employee tension",
  "royal and commoner",
  "body swap intimacy",
  "reincarnated lovers",
  "monster and healer",
  "spy and target",
  "exes reunited",
  "fake engagement",
  "marriage pact",
];

const TROPE_FORMS = ["core trope", "soft route", "high tension route", "repair route", "angst route"];

const GATE_BASES = [
  "first meeting",
  "cautious interest",
  "fragile trust",
  "friendship",
  "close friend",
  "emotional reliance",
  "romantic interest",
  "mutual attraction",
  "first flirtation",
  "first touch",
  "first date",
  "first confession",
  "first kiss",
  "dating",
  "committed",
  "domestic intimacy",
  "engagement",
  "marriage",
  "soulmate bond",
  "jealousy scene",
  "rivalry scene",
  "misunderstanding",
  "secret discovery",
  "confession scene",
  "vulnerability scene",
  "protection scene",
  "rescue scene",
  "betrayal route",
  "breakup route",
  "reconciliation route",
  "redemption route",
  "corruption route",
  "obsession route",
  "forgiveness scene",
  "final choice",
  "happy ending",
  "tragic ending",
  "bittersweet ending",
  "boundary conversation",
  "repair attempt",
  "public choice",
  "private promise",
  "shared home",
  "hard truth",
  "earned trust",
  "love admitted",
  "desire named",
  "fear admitted",
  "future negotiated",
  "farewell resisted",
];

const GATE_FORMS = ["gate", "unlocked by", "blocked by", "tested through", "repaired through"];

const ROUTE_BASES = [
  "romance route",
  "friendship route",
  "rivalry route",
  "jealousy route",
  "betrayal route",
  "reconciliation route",
  "redemption route",
  "corruption route",
  "obsession route",
  "protection route",
  "domestic route",
  "angst route",
  "healing route",
  "villain route",
  "sacrifice route",
  "abandonment route",
  "forbidden love route",
  "soulmate route",
  "marriage route",
  "tragic route",
  "comedy route",
  "mystery route",
  "courtship route",
  "slow trust route",
  "second chance route",
  "revenge route",
  "exile route",
  "monster route",
  "bodyguard route",
  "fake dating route",
  "arranged match route",
  "found family route",
  "power struggle route",
  "hurt comfort route",
  "secret identity route",
  "public scandal route",
  "private devotion route",
  "runaway route",
  "quest route",
  "rescue route",
  "domestic healing route",
  "rivals alliance route",
  "loyalty trial route",
  "curse breaking route",
  "duty versus love route",
  "moral compromise route",
  "trust rebuilding route",
  "soft epilogue route",
  "bittersweet parting route",
  "chosen family route",
];

const ROUTE_FORMS = ["soft", "tense", "comic", "tragic", "repair-focused"];

export const CHARACTER_VOCAB_EXPORT_FILE_GROUPS = Object.freeze([
  {
    filename: "personality.traits.yaml",
    categories: [
      "personality_traits",
      "strengths",
      "weaknesses",
      "moods",
      "desires",
      "fears",
      "likes",
      "dislikes",
      "secrets",
      "humor_styles",
      "skills",
      "intelligence_styles",
    ],
    description: "Personality, preference, skill, and motivation token lanes.",
  },
  {
    filename: "personality.wounds.yaml",
    categories: ["emotional_wounds"],
    description: "Origin wound and attachment pressure tokens.",
  },
  {
    filename: "personality.triggers.yaml",
    categories: ["triggers"],
    description: "Relationship and conflict trigger tokens.",
  },
  {
    filename: "personality.responses.yaml",
    categories: ["responses"],
    description: "Character response beat tokens.",
  },
  {
    filename: "romance.tropes.yaml",
    categories: ["romance_tropes"],
    description: "Romance trope and dynamic tokens.",
  },
  {
    filename: "romance.gates.yaml",
    categories: ["relationship_gates"],
    description: "Relationship progression gate tokens.",
  },
  {
    filename: "romance.routes.yaml",
    categories: ["routes"],
    description: "Route and ending arc tokens.",
  },
  {
    filename: "appearance.body.yaml",
    categories: ["appearance"],
    description: "Body, posture, scars, skin, and movement tokens.",
  },
  {
    filename: "appearance.face.yaml",
    categories: ["appearance"],
    description: "Face, gaze, hair, expression, and presence tokens.",
  },
  {
    filename: "appearance.style.yaml",
    categories: ["clothing_aesthetic"],
    description: "Clothing and styling aesthetic tokens.",
  },
  {
    filename: "goals.short_term.yaml",
    categories: ["short_term_goals"],
    description: "Scene-level and near-term objective tokens.",
  },
  {
    filename: "goals.long_term.yaml",
    categories: ["long_term_goals"],
    description: "Arc-level and long-term objective tokens.",
  },
] satisfies readonly CharacterVocabExportFileGroup[]);

export function normalizeToken(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export const CHARACTER_VOCAB_CATEGORIES = Object.freeze(
  Object.keys(VOCAB_TOKEN_TARGETS) as VocabTokenCategory[],
);

export const CHARACTER_VOCAB_TOKENS = Object.freeze(buildCharacterVocabTokens());

export function getVocabTokensByCategory(category: VocabTokenCategory): VocabToken[] {
  return CHARACTER_VOCAB_TOKENS.filter((token) => token.category === category);
}

export function findVocabTokenById(id: string): VocabToken | undefined {
  const normalizedId = normalizeToken(id);
  return CHARACTER_VOCAB_TOKENS.find(
    (token) => token.id === normalizedId || token.aliases?.includes(normalizedId),
  );
}

export function compileVocabTokenPromptCue(token: VocabToken): string {
  const flags = token.contentFlags
    ? ` Consent required: ${token.contentFlags.consent_required ? "yes" : "no"}.`
    : "";
  return [
    `Vocabulary cue: ${token.label} (${token.category}).`,
    `Use as optional characterization texture with ${token.polarity ?? "neutral"} polarity and ${token.intensity ?? "moderate"} intensity.`,
    "Keep {{user}} agency intact, preserve boundaries, and let the cue surface only when scene context earns it.",
    flags,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createVocabRetrievalDocuments(
  tokens: readonly VocabToken[] = CHARACTER_VOCAB_TOKENS,
): VocabRetrievalDocument[] {
  return tokens.map((token) => ({
    pageContent: [
      token.label,
      `category: ${token.category}`,
      `aliases: ${token.aliases?.join(", ") ?? "none"}`,
      `polarity: ${token.polarity ?? "neutral"}`,
      `intensity: ${token.intensity ?? "moderate"}`,
      `romance relevant: ${token.romanceRelevant ? "yes" : "no"}`,
    ].join("\n"),
    metadata: {
      id: token.id,
      category: token.category,
      polarity: token.polarity,
      intensity: token.intensity,
      romanceRelevant: token.romanceRelevant ?? false,
    },
  }));
}

export function buildCharacterVocabExportPayload(
  tokens: readonly VocabToken[] = CHARACTER_VOCAB_TOKENS,
) {
  return {
    schema: "heartwriteai.character_vocab_tokens.v1",
    total: tokens.length,
    targetTotal: REQUESTED_VOCAB_TOKEN_TOTAL,
    categoryTargets: VOCAB_TOKEN_TARGETS,
    rejectPatterns: VOCAB_REJECT_PATTERN_SOURCES,
    sourceStructure: VOCAB_SOURCE_STRUCTURE,
    tokens,
  };
}

export function exportCharacterVocabJson(
  tokens: readonly VocabToken[] = CHARACTER_VOCAB_TOKENS,
): string {
  return `${JSON.stringify(buildCharacterVocabExportPayload(tokens), null, 2)}\n`;
}

export function exportCharacterVocabYaml(
  tokens: readonly VocabToken[] = CHARACTER_VOCAB_TOKENS,
): string {
  return toYaml(buildCharacterVocabExportPayload(tokens));
}

export function buildCharacterVocabYamlExports(
  tokens: readonly VocabToken[] = CHARACTER_VOCAB_TOKENS,
): Record<string, string> {
  const fileContents: Record<string, string> = {};

  for (const group of CHARACTER_VOCAB_EXPORT_FILE_GROUPS) {
    fileContents[group.filename] = toYaml({
      schema: "heartwriteai.character_vocab_file.v1",
      filename: group.filename,
      description: group.description,
      categories: group.categories,
      count: filterTokensForExportFile(group.filename, group.categories, tokens).length,
      tokens: filterTokensForExportFile(group.filename, group.categories, tokens),
    });
  }

  const flaggedTokens = tokens.filter(
    (token) =>
      token.unsafe ||
      token.contentFlags?.coercion_risk ||
      token.contentFlags?.taboo_risk ||
      token.contentFlags?.adult_romance,
  );

  fileContents["safety.flags.yaml"] = toYaml({
    schema: "heartwriteai.character_vocab_safety.v1",
    rejectPatterns: VOCAB_REJECT_PATTERN_SOURCES,
    contentPolicy: {
      explicit_allowed_default: false,
      consent_required_for_romance: true,
      unsafe_tokens_rejected_at_source: true,
    },
    counts: {
      unsafe: tokens.filter((token) => token.unsafe).length,
      adultRomance: tokens.filter((token) => token.contentFlags?.adult_romance).length,
      consentRequired: tokens.filter((token) => token.contentFlags?.consent_required).length,
      coercionRisk: tokens.filter((token) => token.contentFlags?.coercion_risk).length,
      tabooRisk: tokens.filter((token) => token.contentFlags?.taboo_risk).length,
    },
    tokens: flaggedTokens,
  });

  return fileContents;
}

function buildCharacterVocabTokens(): VocabToken[] {
  const tokens = CHARACTER_VOCAB_CATEGORIES.flatMap((category) =>
    createTokensForCategory(category, buildLabelsForCategory(category)),
  );

  return dedupeVocabTokens(tokens);
}

function buildLabelsForCategory(category: VocabTokenCategory): string[] {
  switch (category) {
    case "personality_traits":
      return takeCategoryLabels(category, [
        ...TRAIT_ROOTS,
        ...combine(TRAIT_MODIFIERS, TRAIT_ROOTS, (modifier, root) => `${modifier} ${root}`),
        ...combine(TRAIT_ROOTS, TRAIT_CONTEXTS, (root, context) => `${root} ${context}`),
      ]);
    case "strengths":
      return takeCategoryLabels(category, [
        ...STRENGTH_BASES,
        ...combine(STRENGTH_CONTEXTS, STRENGTH_BASES, (context, base) => `${context} ${base}`),
      ]);
    case "weaknesses":
      return takeCategoryLabels(category, [
        ...WEAKNESS_BASES,
        ...combine(WEAKNESS_CONTEXTS, WEAKNESS_BASES, (context, base) => `${context} ${base}`),
      ]);
    case "moods":
      return takeCategoryLabels(category, [
        ...MOOD_BASES,
        ...combine(MOOD_MODIFIERS, MOOD_BASES, (modifier, base) => `${modifier} ${base}`),
      ]);
    case "emotional_wounds":
      return takeCategoryLabels(category, combine(woundForms, woundBases, (form, base) => `${form} ${base}`));
    case "desires":
      return takeCategoryLabels(category, combine(DESIRE_FORMS, DESIRE_BASES, (form, base) => `${form} ${base}`));
    case "fears":
      return takeCategoryLabels(category, combine(FEAR_FORMS, FEAR_BASES, (form, base) => `${form} ${base}`));
    case "triggers":
      return takeCategoryLabels(
        category,
        triggerSubjects.flatMap((subject) =>
          triggerActions.flatMap((action) =>
            TRIGGER_VARIANTS.map((variant) => variant(subject, action)),
          ),
        ),
      );
    case "responses":
      return takeCategoryLabels(category, [
        ...RESPONSE_MOVES,
        ...combine(RESPONSE_MOVES, RESPONSE_STYLES, (move, style) => `${move} ${style}`),
      ]);
    case "likes":
      return takeCategoryLabels(category, [
        ...LIKE_BASES,
        ...combine(LIKE_BASES, LIKE_CONTEXTS, (base, context) => `${base} ${context}`),
      ]);
    case "dislikes":
      return takeCategoryLabels(category, [
        ...DISLIKE_BASES,
        ...combine(DISLIKE_BASES, DISLIKE_CONTEXTS, (base, context) => `${base} ${context}`),
      ]);
    case "secrets":
      return takeCategoryLabels(category, [
        ...SECRET_BASES,
        ...combine(SECRET_FORMS, SECRET_BASES, (form, base) => `${form} ${base}`),
      ]);
    case "humor_styles":
      return takeCategoryLabels(category, [
        ...HUMOR_BASES,
        ...combine(HUMOR_FORMS, HUMOR_BASES, (form, base) => `${form} ${base}`),
      ]);
    case "skills":
      return takeCategoryLabels(category, [
        ...SKILL_BASES,
        ...combine(SKILL_FORMS, SKILL_BASES, (form, base) => `${form} ${base}`),
      ]);
    case "intelligence_styles":
      return takeCategoryLabels(category, [
        ...INTELLIGENCE_BASES,
        ...combine(INTELLIGENCE_BASES, INTELLIGENCE_FORMS, (base, form) => `${base} ${form}`),
      ]);
    case "appearance":
      return takeCategoryLabels(category, [
        ...APPEARANCE_BASES,
        ...combine(APPEARANCE_FORMS, APPEARANCE_BASES, (form, base) => `${form} ${base}`),
      ]);
    case "clothing_aesthetic":
      return takeCategoryLabels(category, [
        ...CLOTHING_BASES,
        ...combine(CLOTHING_FORMS, CLOTHING_BASES, (form, base) => `${form} ${base}`),
      ]);
    case "short_term_goals":
      return takeCategoryLabels(category, combine(SHORT_GOAL_FORMS, GOAL_BASES, (form, base) => `${form} ${base}`));
    case "long_term_goals":
      return takeCategoryLabels(category, combine(LONG_GOAL_FORMS, GOAL_BASES, (form, base) => `${form} ${base}`));
    case "romance_tropes":
      return takeCategoryLabels(category, combine(TROPE_FORMS, ROMANCE_TROPE_BASES, (form, base) => `${form} ${base}`));
    case "relationship_gates":
      return takeCategoryLabels(category, combine(GATE_FORMS, GATE_BASES, (form, base) => `${form} ${base}`));
    case "routes":
      return takeCategoryLabels(category, combine(ROUTE_FORMS, ROUTE_BASES, (form, base) => `${form} ${base}`));
  }
}

function createTokensForCategory(
  category: VocabTokenCategory,
  labels: readonly string[],
): VocabToken[] {
  return labels.map((label, index) => createVocabToken(category, label, index));
}

function createVocabToken(
  category: VocabTokenCategory,
  label: string,
  index: number,
): VocabToken {
  const normalizedLabel = normalizeToken(label);
  const id = `${category}_${normalizedLabel}`;
  const aliases = createAliases(category, label, id);
  const romanceRelevant = isRomanceRelevant(category, normalizedLabel);
  const contentFlags = inferContentFlags(category, normalizedLabel, romanceRelevant);

  return {
    id,
    label: toSentenceLabel(label),
    category,
    ...(aliases.length > 0 ? { aliases } : {}),
    polarity: inferPolarity(category, normalizedLabel),
    intensity: inferIntensity(category, normalizedLabel),
    adult: false,
    unsafe: false,
    romanceRelevant,
    ...(contentFlags ? { contentFlags } : {}),
    sourceKind: inferSourceKind(index),
  };
}

function createAliases(
  category: VocabTokenCategory,
  label: string,
  id: string,
): string[] {
  const normalized = normalizeToken(label);
  const aliases = new Set<string>([normalized]);

  if (normalized.includes("humour")) aliases.add(normalized.replace(/humour/g, "humor"));
  if (normalized.includes("apologises")) aliases.add(normalized.replace(/apologises/g, "apologizes"));
  if (normalized.includes("rumour")) aliases.add(normalized.replace(/rumour/g, "rumor"));
  if (normalized.startsWith("fear_of_")) {
    aliases.add(normalized.replace(/^fear_of_/, "afraid_of_"));
  }
  if (category === "emotional_wounds" && normalized.includes("abandonment")) {
    aliases.add("abandonment_anxiety");
  }
  if (category === "triggers" && normalized === "user_lies") {
    aliases.add("user_dishonesty");
  }

  aliases.delete(id);
  return Array.from(aliases).filter((alias) => alias !== id && alias.length > 0).sort();
}

function inferPolarity(category: VocabTokenCategory, normalizedLabel: string): VocabTokenPolarity {
  if (category === "strengths" || category === "likes") return "positive";
  if (
    category === "weaknesses" ||
    category === "emotional_wounds" ||
    category === "fears" ||
    category === "triggers" ||
    category === "dislikes"
  ) {
    return "negative";
  }
  if (category === "moods") {
    if (/hopeful|calm|peaceful|relieved|tender|affectionate|soft|cherished/.test(normalizedLabel)) {
      return "positive";
    }
    if (/angry|ashamed|guilty|sad|terrified|wounded|resentful|jealous|haunted/.test(normalizedLabel)) {
      return "negative";
    }
  }
  if (category === "desires" || category === "romance_tropes" || category === "relationship_gates" || category === "routes") {
    return "mixed";
  }
  if (category === "secrets") return "mixed";
  return "neutral";
}

function inferIntensity(category: VocabTokenCategory, normalizedLabel: string): VocabTokenIntensity {
  if (/terror|trauma|betrayal|catastrophic|dangerous|obsession|life_threatening|shame|abandonment/.test(normalizedLabel)) {
    return "intense";
  }
  if (/curse|tragic|corruption|revenge|enemy|mafia|captive|sacrifice/.test(normalizedLabel)) {
    return "intense";
  }
  if (category === "emotional_wounds" || category === "fears" || category === "secrets") return "intense";
  if (category === "likes" || category === "humor_styles" || category === "clothing_aesthetic") return "soft";
  return "moderate";
}

function inferSourceKind(index: number): VocabTokenSourceKind {
  if (index < 90) return "core";
  if (index < 220) return "generated";
  return "niche";
}

function isRomanceRelevant(category: VocabTokenCategory, normalizedLabel: string): boolean {
  return (
    category === "romance_tropes" ||
    category === "relationship_gates" ||
    category === "routes" ||
    category === "emotional_wounds" ||
    category === "desires" ||
    category === "fears" ||
    category === "triggers" ||
    category === "responses" ||
    /romance|love|lover|kiss|flirt|desire|intimacy|marriage|soulmate|mate|devotion|user/.test(
      normalizedLabel,
    )
  );
}

function inferContentFlags(
  category: VocabTokenCategory,
  normalizedLabel: string,
  romanceRelevant: boolean,
): ContentFlags | undefined {
  if (!romanceRelevant) return undefined;

  return {
    adult_romance: true,
    explicit_allowed: false,
    consent_required: true,
    coercion_risk: /possessive|controlling|threat|blackmail|captive|forced|obsession|jealous|power|commanding/.test(
      normalizedLabel,
    ),
    taboo_risk: /forbidden|mafia|captive|mentor|patron|enemy|villain|power|scandal|boss/.test(
      normalizedLabel,
    ),
  };
}

function dedupeVocabTokens(tokens: readonly VocabToken[]): VocabToken[] {
  const seen = new Set<string>();
  const result: VocabToken[] = [];

  for (const token of tokens) {
    if (seen.has(token.id)) continue;
    if (isRejectedTokenLabel(token.label)) continue;
    seen.add(token.id);
    result.push(token);
  }

  return result;
}

function takeCategoryLabels(
  category: VocabTokenCategory,
  rawLabels: readonly string[],
): string[] {
  const target = VOCAB_TOKEN_TARGETS[category];
  const labels = uniqueLabels(rawLabels);

  if (labels.length < target) {
    throw new Error(
      `Not enough generated labels for ${category}: expected ${target}, got ${labels.length}`,
    );
  }

  return labels.slice(0, target);
}

function uniqueLabels(rawLabels: readonly string[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const rawLabel of rawLabels) {
    const label = toSentenceLabel(rawLabel);
    const normalized = normalizeToken(label);
    if (!normalized || seen.has(normalized) || isRejectedTokenLabel(label)) continue;
    seen.add(normalized);
    labels.push(label);
  }

  return labels;
}

function isRejectedTokenLabel(label: string): boolean {
  const normalized = normalizeToken(label);
  return VOCAB_REJECT_PATTERNS.some((pattern) => pattern.test(label) || pattern.test(normalized));
}

function combine(
  left: readonly string[],
  right: readonly string[],
  formatter: (left: string, right: string) => string,
): string[] {
  return left.flatMap((leftValue) => right.map((rightValue) => formatter(leftValue, rightValue)));
}

function toSentenceLabel(value: string): string {
  const readable = value
    .replace(/_/g, " ")
    .replace(/\{\{user\}\}/gi, "user")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return `${readable.charAt(0).toUpperCase()}${readable.slice(1)}`;
}

function filterTokensForExportFile(
  filename: string,
  categories: readonly VocabTokenCategory[],
  tokens: readonly VocabToken[],
): VocabToken[] {
  const categoryTokens = tokens.filter((token) => categories.includes(token.category));

  if (filename === "appearance.body.yaml") {
    return categoryTokens.filter((token) =>
      /body|build|skin|scar|hand|posture|movement|walk|stance|height|shoulder|muscular|lithe|curvy|slender|lean|athletic/.test(
        normalizeToken(token.label),
      ),
    );
  }

  if (filename === "appearance.face.yaml") {
    return categoryTokens.filter((token) =>
      /face|eye|gaze|smile|mouth|jaw|brow|hair|lash|expression|feature|beauty|handsome|complexion/.test(
        normalizeToken(token.label),
      ),
    );
  }

  return categoryTokens;
}

function toYaml(value: unknown, indent = 0): string {
  const spaces = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]\n";
    return value
      .map((item) => {
        if (isPlainObject(item)) {
          const nested = removeLeadingIndent(toYaml(item, indent + 2).trimEnd(), indent + 2);
          const [firstLine, ...remainingLines] = nested.split("\n");
          const rest =
            remainingLines.length > 0
              ? `${remainingLines.map((line) => `${spaces}  ${line}`).join("\n")}\n`
              : "";
          return `${spaces}- ${firstLine}\n${rest}`;
        }
        return `${spaces}- ${formatYamlScalar(item)}\n`;
      })
      .join("");
  }

  if (isPlainObject(value)) {
    return Object.entries(value)
      .map(([key, entryValue]) => {
        if (Array.isArray(entryValue)) {
          return `${spaces}${key}: ${entryValue.length === 0 ? "[]\n" : `\n${toYaml(entryValue, indent + 2)}`}`;
        }
        if (isPlainObject(entryValue)) {
          return `${spaces}${key}:\n${toYaml(entryValue, indent + 2)}`;
        }
        return `${spaces}${key}: ${formatYamlScalar(entryValue)}\n`;
      })
      .join("");
  }

  return `${spaces}${formatYamlScalar(value)}\n`;
}

function formatYamlScalar(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "null";
  return JSON.stringify(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function removeLeadingIndent(value: string, indent: number): string {
  const indentPattern = new RegExp(`^ {0,${indent}}`, "gm");
  return value.replace(indentPattern, "");
}
