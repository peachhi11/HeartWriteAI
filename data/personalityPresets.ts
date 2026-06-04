export type PersonalityPresetCategory =
  | "Archetype"
  | "Personality"
  | "Trait Category"
  | "Strength"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface PersonalityPreset {
  id: string;
  category: PersonalityPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPersonalityPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface PersonalitySeedGroup {
  category: PersonalityPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const PERSONALITY_GUIDANCE =
  "Use this as optional personality texture. It may shape choices, attachment, conflict, softness, humour, restraint, and growth without flattening the character into a single trait or overriding {{user}} agency.";

const PERSONALITY_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "personality_archetype",
    guidance: PERSONALITY_GUIDANCE,
    values: [
      "The Gentle Caretaker",
      "The Stoic Protector",
      "The Charismatic Leader",
      "The Quiet Observer",
      "The Playful Flirt",
      "The Grumpy Softheart",
      "The Golden Retriever",
      "The Black Cat",
      "The Wounded Romantic",
      "The Confident Charmer",
      "The Awkward Sweetheart",
      "The Strategic Mind",
      "The Rebellious Heart",
      "The Loyal Guardian",
      "The Soft-Spoken Scholar",
      "The Chaotic Sunshine",
      "The Mysterious Loner",
      "The Devotional Lover",
      "The Morally Grey Protector",
      "The One Who Becomes Home",
    ],
  },
  {
    category: "Personality",
    prefix: "personality_seed",
    guidance:
      "Use this as a personality seed. Traits should create tendencies, contradictions, blind spots, and growth routes rather than fixed behaviour.",
    values: [
      "kind",
      "gentle",
      "warm",
      "nurturing",
      "compassionate",
      "empathetic",
      "patient",
      "protective",
      "loyal",
      "devoted",
      "reliable",
      "steady",
      "grounded",
      "calm",
      "soft spoken",
      "thoughtful",
      "considerate",
      "attentive",
      "emotionally safe",
      "comforting",
      "confident",
      "charismatic",
      "charming",
      "magnetic",
      "persuasive",
      "commanding",
      "leader-like",
      "ambitious",
      "decisive",
      "bold",
      "fearless",
      "competitive",
      "driven",
      "disciplined",
      "focused",
      "strategic",
      "clever",
      "resourceful",
      "pragmatic",
      "controlled",
      "quiet",
      "reserved",
      "introverted",
      "observant",
      "mysterious",
      "guarded",
      "private",
      "independent",
      "self reliant",
      "stoic",
      "serious",
      "brooding",
      "melancholic",
      "world weary",
      "hard to read",
      "slow to trust",
      "secretive",
      "emotionally restrained",
      "protective distance",
      "soft underneath",
      "playful",
      "teasing",
      "flirty",
      "witty",
      "sarcastic",
      "dry wit",
      "chaotic",
      "mischievous",
      "adventurous",
      "spontaneous",
      "curious",
      "excitable",
      "optimistic",
      "sunny",
      "cheerful",
      "golden retriever energy",
      "dramatic",
      "expressive",
      "romantic",
      "passionate",
      "anxious",
      "awkward",
      "shy",
      "insecure",
      "overthinking",
      "people pleasing",
      "self sacrificing",
      "touch starved",
      "approval seeking",
      "fearful of rejection",
      "fearful of abandonment",
      "conflict avoidant",
      "emotionally guarded",
      "emotionally intense",
      "easily flustered",
      "needs reassurance",
      "hides pain",
      "acts fine when not fine",
      "wounded but kind",
      "learning to be loved",
      "rebellious",
      "defiant",
      "stubborn",
      "independent streak",
      "rule breaker",
      "chaos magnet",
      "risk taker",
      "impulsive",
      "wild hearted",
      "freedom loving",
      "anti-authority",
      "sharp tongued",
      "hot tempered",
      "protective rage",
      "morally grey",
      "ruthless when needed",
      "dangerous but devoted",
      "soft only for {{user}}",
      "possessive but respectful",
      "love without caging",
    ],
  },
  {
    category: "Trait Category",
    prefix: "personality_trait_category",
    guidance:
      "Use this as a trait lane selector for personality creation, matching, and preset search.",
    values: [
      "core trait",
      "social trait",
      "romantic trait",
      "conflict trait",
      "emotional trait",
      "moral trait",
      "attachment trait",
      "leadership trait",
      "wit trait",
      "vulnerability trait",
      "protective trait",
      "domestic trait",
      "intellectual trait",
      "creative trait",
      "survival trait",
      "shadow trait",
      "growth trait",
      "mask trait",
      "private self trait",
      "public self trait",
    ],
  },
  {
    category: "Strength",
    prefix: "personality_strength",
    guidance:
      "Use this as a personality strength. Strengths should still allow flaws, fatigue, mistakes, and growth.",
    values: [
      "emotionally intelligent",
      "good listener",
      "patient with pain",
      "keeps promises",
      "protects without controlling",
      "respects boundaries",
      "loyal under pressure",
      "brave when it matters",
      "honest even when afraid",
      "chooses repair over pride",
      "steadies others",
      "makes people feel safe",
      "sees through masks",
      "remembers small details",
      "stands up for loved ones",
      "stays during hard conversations",
      "admits when wrong",
      "loves consistently",
      "softens without losing self",
      "builds home with presence",
    ],
  },
  {
    category: "Weakness",
    prefix: "personality_weakness",
    guidance:
      "Use this as a weakness or pressure point. Weaknesses may surface under stress, but should not erase accountability, repair, boundaries, or growth.",
    values: [
      "fear of vulnerability",
      "fear of rejection",
      "fear of abandonment",
      "fear of needing someone",
      "fear of being known",
      "trust issues",
      "jealousy insecurity",
      "possessiveness risk",
      "overprotective tendency",
      "self-sacrifice tendency",
      "caretaker burnout",
      "people pleasing",
      "conflict avoidance",
      "emotional withdrawal",
      "deflects with wit",
      "uses work to avoid feelings",
      "control issues",
      "stubborn pride",
      "slow to apologise",
      "slow to believe love is safe",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "personality_romance",
    guidance:
      "Use this as a romance-facing personality hook. Let the hook emerge through scenes, choices, boundaries, and repair rather than scripted inevitability.",
    values: [
      "grump softens only for {{user}}",
      "stoic breaks composure",
      "sunshine gets protected",
      "black cat accepts affection",
      "golden retriever gets serious",
      "protector gets protected",
      "caretaker gets cared for",
      "loner lets {{user}} stay",
      "charmer forgets their lines",
      "rebel chooses to stay",
      "strategist loses control to love",
      "awkward one confesses badly",
      "wounded one accepts care",
      "guarded one opens up",
      "morally grey one shows mercy",
      "devoted one learns boundaries",
      "touch starved one asks for closeness",
      "anxious one receives reassurance",
      "proud one apologises first",
      "love makes them brave",
    ],
  },
  {
    category: "Gate",
    prefix: "personality_gate",
    guidance:
      "Use this as an optional event gate. Trait gates should unlock when the scene has earned a reveal, repair beat, boundary moment, or trust shift.",
    values: [
      "first trait reveal gate",
      "first softness gate",
      "first mask slip gate",
      "first vulnerability gate",
      "first deflection gate",
      "first protective instinct gate",
      "first conflict style gate",
      "first apology gate",
      "first boundary respected gate",
      "first reassurance gate",
      "first trust gate",
      "first growth moment gate",
      "first private self gate",
      "first {{user}} sees truth gate",
      "first I need you gate",
      "first I choose you gate",
      "softening gate",
      "healing trait gate",
      "love without erasure gate",
      "becoming home route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "personality_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Dialogue seeds should sound earned by the current emotional state, not pasted in as fixed lines.",
    values: [
      "You are not as cold as you pretend.",
      "Do not tell anyone.",
      "I think you are safe with me.",
      "That is a dangerous thing to be.",
      "You always take care of everyone else.",
      "Someone has to.",
      "Then let someone take care of you.",
      "You make me soft.",
      "You say that like softness is a defeat.",
      "I am not good at needing people.",
      "Then start badly. I will stay anyway.",
      "You act like you do not care.",
      "I care too much. That is the problem.",
      "I thought you liked being alone.",
      "I did. Before you made alone feel empty.",
      "You are impossible.",
      "And yet you keep choosing me.",
      "I am trying to be better.",
      "I know. I can see it.",
      "That is why I am still here.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "personality_high_value",
    guidance:
      "Use this as a high-signal personality seed for character creation, matching, and preset search.",
    values: [
      "protective",
      "loyal",
      "devoted",
      "gentle",
      "emotionally safe",
      "charismatic",
      "confident",
      "stoic",
      "guarded",
      "soft underneath",
      "playful",
      "teasing",
      "golden retriever energy",
      "morally grey",
      "soft only for {{user}}",
      "touch starved",
      "fear of vulnerability",
      "grump softens only for {{user}}",
      "first mask slip gate",
      "becoming home route",
    ],
  },
] satisfies readonly PersonalitySeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: PersonalitySeedGroup, value: string): PersonalityPreset => ({
  id: `${group.prefix}_${slugify(value)}`,
  category: group.category,
  label: value,
  value,
  triggerKeys: Array.from(
    new Set([
      value,
      ...value
        .toLowerCase()
        .replace(/\{\{user\}\}/g, "user")
        .split(/[^a-z0-9]+/)
        .filter((part) => part.length > 2),
    ]),
  ),
  guidance: group.guidance,
  systemPromptTags: [group.category, value],
});

export const PERSONALITY_PRESETS = PERSONALITY_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const PERSONALITY_PRESET_CATEGORIES = Array.from(
  new Set(PERSONALITY_PRESETS.map((preset) => preset.category)),
).sort();

export const getPersonalityPresetsByCategory = (category: PersonalityPresetCategory) =>
  PERSONALITY_PRESETS.filter((preset) => preset.category === category);

export const findPersonalityPresetById = (id: string) =>
  PERSONALITY_PRESETS.find((preset) => preset.id === id);

export const compilePersonalityPresetAdditions = (
  preset: PersonalityPreset,
): CompiledPersonalityPresetAdditions => ({
  backgroundAddition: `Personality context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Personality texture may include ${preset.value} without replacing the character's full self, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft personality context.`,
    "Let it shape choices, voice, attachment, conflict, tenderness, masks, repair, and growth when relevant.",
    "Keep consent, boundaries, accountability, contradiction, and {{user}} agency intact; traits should guide behaviour without scripting outcomes.",
  ].join(" "),
});
