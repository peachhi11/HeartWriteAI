export type BehaviourPresetCategory =
  | "Archetype"
  | "Behaviour"
  | "Social Behaviour"
  | "Romantic Behaviour"
  | "Conflict Behaviour"
  | "Emotional Behaviour"
  | "Weakness"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface BehaviourPreset {
  id: string;
  category: BehaviourPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledBehaviourPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface BehaviourSeedGroup {
  category: BehaviourPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const BEHAVIOUR_GUIDANCE =
  "Use this as optional behaviour texture. Behaviour may shape habits, repair, care, conflict, public masks, romance, and routine without flattening the character into a single pattern or overriding {{user}} agency.";

const BEHAVIOUR_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "behaviour_archetype",
    guidance: BEHAVIOUR_GUIDANCE,
    values: [
      "The Gentle Caretaker",
      "The Stoic Protector",
      "The Playful Tease",
      "The Quiet Observer",
      "The Charismatic Leader",
      "The Awkward Sweetheart",
      "The Guarded Loner",
      "The Devoted Romantic",
      "The Chaotic Sunshine",
      "The Controlled Professional",
      "The Protective Shadow",
      "The Soft Domestic",
      "The Flirty Troublemaker",
      "The Wounded Avoidant",
      "The Loyal Companion",
      "The Morally Grey Helper",
      "The Rebellious Heart",
      "The Patient Listener",
      "The Touch-Starved Softheart",
      "The One Who Shows Love Through Actions",
    ],
  },
  {
    category: "Behaviour",
    prefix: "behaviour_seed",
    guidance:
      "Use this as a behaviour seed. Behaviour should create observable tendencies, repeated habits, and growth openings rather than fixed scripts.",
    values: [
      "gentle behaviour",
      "protective behaviour",
      "caretaking behaviour",
      "playful behaviour",
      "teasing behaviour",
      "flirty behaviour",
      "reserved behaviour",
      "guarded behaviour",
      "quiet behaviour",
      "observant behaviour",
      "confident behaviour",
      "commanding behaviour",
      "awkward behaviour",
      "shy behaviour",
      "nervous behaviour",
      "chaotic behaviour",
      "rebellious behaviour",
      "disciplined behaviour",
      "professional behaviour",
      "domestic behaviour",
      "checks on {{user}}",
      "remembers small details",
      "offers help quietly",
      "walks {{user}} home",
      "keeps {{user}} close",
      "stands between {{user}} and danger",
      "asks before touching",
      "respects boundaries",
      "brings food or drinks",
      "fixes things for {{user}}",
      "listens more than speaks",
      "uses wit to deflect",
      "teases when flustered",
      "gets quiet when hurt",
      "withdraws when overwhelmed",
      "overexplains when nervous",
      "acts fine when not fine",
      "softens only for {{user}}",
      "protects without controlling",
      "shows love through actions",
    ],
  },
  {
    category: "Social Behaviour",
    prefix: "behaviour_social",
    guidance:
      "Use this as social behaviour texture. Social patterns may shape public masks, trust, reputation, introductions, and privacy without locking the character into one mode.",
    values: [
      "warm to strangers",
      "cold to strangers",
      "polite distance",
      "publicly composed",
      "privately soft",
      "socially confident",
      "socially cautious",
      "reads the room",
      "avoids crowds",
      "draws people in",
      "keeps inner circle small",
      "uses charm as armour",
      "uses silence as boundary",
      "defends loved ones publicly",
      "protects reputation",
      "keeps relationship private",
      "introduces {{user}} proudly",
      "acts different in public",
      "acts different in private",
      "social mask slips with {{user}}",
    ],
  },
  {
    category: "Romantic Behaviour",
    prefix: "behaviour_romantic",
    guidance:
      "Use this as romantic behaviour texture. Romance habits should remain responsive to trust, boundaries, repair, and the active relationship state.",
    values: [
      "acts before words",
      "shows not tells",
      "openly affectionate",
      "subtly affectionate",
      "slow to confess",
      "confesses under pressure",
      "gets flustered by affection",
      "uses pet names",
      "remembers {{user}} preferences",
      "checks in gently",
      "offers reassurance",
      "gets protective when worried",
      "gets jealous but hides it",
      "asks to be chosen",
      "chooses {{user}} publicly",
      "chooses {{user}} privately",
      "stays close after conflict",
      "repairs with actions",
      "creates safe routines",
      "makes home feel warm",
    ],
  },
  {
    category: "Conflict Behaviour",
    prefix: "behaviour_conflict",
    guidance:
      "Use this as conflict behaviour texture. Conflict patterns should leave room for accountability, cooling down, repair, boundaries, and healthier choices.",
    values: [
      "talks it out",
      "needs space before talking",
      "withdraws when upset",
      "gets quiet when hurt",
      "gets blunt when scared",
      "gets sharp when defensive",
      "uses logic to avoid feelings",
      "deflects with wit",
      "apologises quickly",
      "struggles to apologise",
      "overexplains",
      "underexplains",
      "asks for reassurance",
      "sets boundaries directly",
      "sets boundaries softly",
      "chooses repair over pride",
      "returns after cooling down",
      "does not use silence as punishment",
      "learns healthier conflict",
      "stays even when afraid",
    ],
  },
  {
    category: "Emotional Behaviour",
    prefix: "behaviour_emotional",
    guidance:
      "Use this as emotional behaviour texture. Emotional patterns may surface through body language, vulnerability, reassurance, routine, and consistency.",
    values: [
      "wears heart on sleeve",
      "hides feelings",
      "smiles when hurt",
      "laughs when nervous",
      "cries privately",
      "rarely cries",
      "voice softens when vulnerable",
      "hands betray emotion",
      "goes still when afraid",
      "gets restless when anxious",
      "seeks reassurance",
      "avoids reassurance",
      "accepts comfort slowly",
      "pushes away when scared",
      "clings when scared",
      "tests safety",
      "lets guard down slowly",
      "trusts through routine",
      "needs time to process",
      "softens with consistency",
    ],
  },
  {
    category: "Weakness",
    prefix: "behaviour_weakness",
    guidance:
      "Use this as a behaviour weakness or pressure point. Weaknesses should invite consequence, repair, accountability, boundaries, and growth rather than excuse harm.",
    values: [
      "avoidant behaviour",
      "people pleasing",
      "overprotective tendency",
      "control issues",
      "jealousy insecurity",
      "caretaker burnout",
      "self-sacrifice tendency",
      "trust issues",
      "fear of vulnerability",
      "fear of rejection",
      "fear of abandonment",
      "difficulty accepting help",
      "difficulty saying no",
      "deflects when exposed",
      "uses work to avoid feelings",
      "acts cold when hurt",
      "tests love when insecure",
      "mistakes safety for control",
      "needs to be needed",
      "slow to believe love is safe",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "behaviour_romance",
    guidance:
      "Use this as a romance-facing behaviour hook. Hooks should emerge through action, trust, repair, boundaries, and routine rather than scripted inevitability.",
    values: [
      "first check-in",
      "first protective action",
      "first soft behaviour",
      "first boundary respected",
      "first caretaking scene",
      "first jealousy reveal",
      "first public defence",
      "first private softness",
      "first act of service",
      "first comfort after breakdown",
      "first stays after conflict",
      "first apology with action",
      "first allows care",
      "first asks for help",
      "first reassurance request",
      "first {{user}} notices pattern",
      "behaviour becomes love language",
      "routine becomes intimacy",
      "actions say I love you",
      "home built through behaviour",
    ],
  },
  {
    category: "Gate",
    prefix: "behaviour_gate",
    guidance:
      "Use this as an optional event gate. Behaviour gates should unlock when repeated action, trust, conflict, repair, or changed routine has earned the shift.",
    values: [
      "first behaviour notice gate",
      "first pattern recognition gate",
      "first softness gate",
      "first mask slip gate",
      "first protective gate",
      "first caretaking gate",
      "first boundary gate",
      "first conflict behaviour gate",
      "first repair behaviour gate",
      "first jealousy gate",
      "first vulnerability gate",
      "first accepts help gate",
      "first asks for help gate",
      "first {{user}} calls out pattern gate",
      "first changed behaviour gate",
      "trust through actions gate",
      "love language gate",
      "safe behaviour gate",
      "chosen by actions gate",
      "home in routine route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "behaviour_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Behaviour dialogue should feel earned by repeated patterns, care, conflict, repair, and action-based intimacy.",
    values: [
      "You always do that.",
      "Do what?",
      "Help before anyone has to ask.",
      "You keep standing between me and the door.",
      "Habit.",
      "Protective habit?",
      "Unfortunately.",
      "You brought tea.",
      "You looked tired.",
      "I did not say I was.",
      "You did not have to.",
      "You get quiet when you are hurt.",
      "Quiet is safer.",
      "Not with me.",
      "You do not have to earn care by being useful.",
      "That is a difficult habit to break.",
      "You stayed.",
      "You looked like you expected me not to.",
      "I did.",
      "Then I will stay again tomorrow.",
      "You love through actions.",
      "Words are harder.",
      "Then let me learn your language.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "behaviour_high_value",
    guidance:
      "Use this as a high-signal behaviour seed for character creation, matching, preset search, and compact behaviour generation.",
    values: [
      "protective behaviour",
      "caretaking behaviour",
      "remembers small details",
      "checks on {{user}}",
      "acts before words",
      "shows not tells",
      "softens only for {{user}}",
      "protects without controlling",
      "asks before touching",
      "respects boundaries",
      "gets quiet when hurt",
      "deflects with wit",
      "chooses repair over pride",
      "accepts comfort slowly",
      "tests safety",
      "first softness gate",
      "trust through actions gate",
      "behaviour becomes love language",
      "actions say I love you",
      "home in routine route",
    ],
  },
] satisfies readonly BehaviourSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: BehaviourSeedGroup, value: string): BehaviourPreset => ({
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

export const BEHAVIOUR_PRESETS = BEHAVIOUR_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const BEHAVIOUR_PRESET_CATEGORIES = Array.from(
  new Set(BEHAVIOUR_PRESETS.map((preset) => preset.category)),
).sort();

export const getBehaviourPresetsByCategory = (category: BehaviourPresetCategory) =>
  BEHAVIOUR_PRESETS.filter((preset) => preset.category === category);

export const findBehaviourPresetById = (id: string) =>
  BEHAVIOUR_PRESETS.find((preset) => preset.id === id);

export const compileBehaviourPresetAdditions = (
  preset: BehaviourPreset,
): CompiledBehaviourPresetAdditions => ({
  backgroundAddition: `Behaviour context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Behaviour texture may include ${preset.value} without replacing the character's full personality, motives, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft behaviour context.`,
    "Let habits, routines, public masks, body language, conflict patterns, repair, and care shape behaviour when relevant.",
    "Keep consent, boundaries, accountability, consequences, contradiction, and {{user}} agency intact; behaviour should guide patterns without scripting outcomes.",
  ].join(" "),
});
