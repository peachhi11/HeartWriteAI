export type PhysicalTellPresetCategory =
  | "Archetype"
  | "Physical Tell"
  | "Emotional Tell"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface PhysicalTellPreset {
  id: string;
  category: PhysicalTellPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledPhysicalTellPresetAdditions {
  scenarioAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface PhysicalTellSeedGroup {
  category: PhysicalTellPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const PHYSICAL_TELL_GUIDANCE =
  "Use this as optional physical-tell texture. Physical tells may reveal stress, care, attraction, fear, restraint, contradiction, and trust, but they should remain context-dependent subtext rather than absolute proof.";

const PHYSICAL_TELL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "physical_tell_archetype",
    guidance: PHYSICAL_TELL_GUIDANCE,
    values: [
      "The Nervous Fidgeter",
      "The Guarded Stillness",
      "The Softening Gaze",
      "The Protective Shift",
      "The Flustered Blusher",
      "The Jaw-Clencher",
      "The Hand-Talker",
      "The Avoids-Eye-Contact Type",
      "The Intense Eye Contact Type",
      "The Touch-Starved Leaner",
      "The Smile-Hides-Pain Type",
      "The Trembling Hands",
      "The Restless Pacer",
      "The Controlled Professional",
      "The Expressive Face",
      "The Blank Mask",
      "The Voice-Softens Tell",
      "The Breath-Catches Tell",
      "The Body Betrays Feelings",
      "The One Whose Guard Drops Around {{user}}",
    ],
  },
  {
    category: "Physical Tell",
    prefix: "physical_tell_seed",
    guidance:
      "Use this as an observable physical tell. Tells should be interpreted through scene context, relationship history, consent, and contradiction.",
    values: [
      "fidgets with rings",
      "taps fingers",
      "bounces knee",
      "paces when anxious",
      "runs hand through hair",
      "touches neck when nervous",
      "rubs back of neck",
      "bites lip when nervous",
      "chews inner cheek",
      "clenches jaw",
      "grinds teeth",
      "swallows hard",
      "breath catches",
      "breathes shallowly",
      "exhales slowly to stay calm",
      "hands shake",
      "hands go still",
      "hands betray emotion",
      "white-knuckled grip",
      "fists clench",
      "avoids eye contact",
      "holds eye contact",
      "looks away when vulnerable",
      "looks down when flustered",
      "eyes soften",
      "eyes sharpen",
      "eyes go cold",
      "pupils widen",
      "blinks too fast",
      "stares too long",
      "glances at {{user}}'s lips",
      "glances at {{user}}'s hands",
      "tracks {{user}} in crowd",
      "checks {{user}} for injuries",
      "watches exits",
      "watches threats",
      "looks at {{user}} first",
      "looks for {{user}} when entering room",
      "softens when {{user}} speaks",
      "hardens when {{user}} is threatened",
      "smiles when hurt",
      "laughs when nervous",
      "smile drops too fast",
      "forced smile",
      "small real smile",
      "half smile",
      "dimples appear when genuine",
      "mouth twitches before laughing",
      "lips part when surprised",
      "presses lips together",
      "face flushes",
      "ears turn red",
      "neck flushes",
      "goes pale when afraid",
      "expression goes blank",
      "mask slips",
      "expression softens",
      "brows knit with worry",
      "nose wrinkles when amused",
      "tears gather but do not fall",
      "stands too still",
      "goes still when upset",
      "goes rigid when touched",
      "relaxes near {{user}}",
      "leans towards {{user}}",
      "leans away when scared",
      "hovers near {{user}}",
      "keeps {{user}} in reach",
      "steps between {{user}} and danger",
      "moves {{user}} behind them",
      "turns body towards {{user}}",
      "angles body away from threat",
      "crosses arms defensively",
      "uncrosses arms with trust",
      "shoulders tense",
      "shoulders drop when safe",
      "posture straightens in public",
      "posture softens in private",
      "sits close without noticing",
      "keeps polite distance",
      "voice softens",
      "voice drops lower",
      "voice goes cold",
      "voice cracks",
      "voice gets quiet",
      "voice gets sharp",
      "speaks too fast",
      "speaks too carefully",
      "stumbles over words",
      "trails off",
      "pauses too long",
      "clears throat",
      "laughs under breath",
      "murmurs affection",
      "whispers when honest",
      "says {{user}}'s name differently",
      "uses formality when hurt",
      "uses pet name when soft",
      "forgets title when flustered",
      "accent thickens when emotional",
    ],
  },
  {
    category: "Emotional Tell",
    prefix: "physical_tell_emotional",
    guidance:
      "Use this as emotion-linked physical-tell texture. Emotional tells should suggest subtext while leaving room for misreading, restraint, privacy, and direct communication.",
    values: [
      "anger shows in jaw",
      "fear shows in hands",
      "hurt shows in smile",
      "love shows in eyes",
      "jealousy shows in voice",
      "worry shows in posture",
      "desire shows in stillness",
      "guilt shows in avoidance",
      "grief shows in quiet",
      "relief shows in exhale",
      "affection shows in soft touch",
      "protectiveness shows in positioning",
      "shame shows in downcast eyes",
      "hope shows in reaching out",
      "trust shows in relaxed shoulders",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "physical_tell_romance",
    guidance:
      "Use this as romance-facing physical-tell texture. Hooks should emerge through earned notice, trust, boundaries, care, and emotional context.",
    values: [
      "{{user}} notices tell first",
      "{{user}} learns their tells",
      "tell reveals hidden feelings",
      "tell reveals jealousy",
      "tell reveals fear",
      "tell reveals love",
      "{{user}} calls out tell",
      "gets flustered when seen",
      "mask slips around {{user}}",
      "guard drops in private",
      "voice softens only for {{user}}",
      "hands shake during confession",
      "eye contact becomes intimacy",
      "protective shift reveals care",
      "forced smile gets seen",
      "touch-starved lean reveals need",
      "breath catches at closeness",
      "body relaxes when {{user}} arrives",
      "tell becomes love language",
      "known without words",
    ],
  },
  {
    category: "Gate",
    prefix: "physical_tell_gate",
    guidance:
      "Use this as an optional event gate. Tell gates should unlock through repeated observation, earned trust, vulnerability, or a meaningful contradiction between words and body.",
    values: [
      "first tell notice gate",
      "first mask slip gate",
      "first {{user}} calls out tell gate",
      "first flustered tell gate",
      "first jealousy tell gate",
      "first fear tell gate",
      "first love tell gate",
      "first protective shift gate",
      "first voice softening gate",
      "first hands shaking gate",
      "first eye contact intimacy gate",
      "first relaxed near {{user}} gate",
      "first tell reveals truth gate",
      "known without words gate",
      "body betrays heart gate",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "physical_tell_dialogue",
    guidance:
      "Use this as optional dialogue flavour. Tell dialogue should sound earned by repeated observation, vulnerability, or a character being seen too clearly.",
    values: [
      "You always do that when you are nervous.",
      "Do what?",
      "Touch your ring.",
      "You are smiling.",
      "That is usually allowed.",
      "Not like that. That is your hurt smile.",
      "Your hands are shaking.",
      "They do that.",
      "Only when something matters.",
      "You looked at me first.",
      "No, I did not.",
      "You always do.",
      "Your voice changes when you say my name.",
      "Does it?",
      "Yes. It gets softer.",
      "Stop reading me.",
      "Stop being so readable around me.",
      "You went still.",
      "I was thinking.",
      "You go still when you are scared.",
      "I know when you are lying.",
      "That is inconvenient.",
      "Not for me.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "physical_tell_high_value",
    guidance:
      "Use this as a high-signal physical-tell seed for character creation, matching, preset search, and compact body-language generation.",
    values: [
      "fidgets with rings",
      "clenches jaw",
      "breath catches",
      "hands shake",
      "avoids eye contact",
      "holds eye contact",
      "eyes soften",
      "glances at {{user}}'s lips",
      "tracks {{user}} in crowd",
      "smiles when hurt",
      "face flushes",
      "mask slips",
      "goes still when upset",
      "leans towards {{user}}",
      "steps between {{user}} and danger",
      "shoulders drop when safe",
      "voice softens",
      "says {{user}}'s name differently",
      "{{user}} learns their tells",
      "known without words gate",
    ],
  },
] satisfies readonly PhysicalTellSeedGroup[]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\{\{user\}\}/g, "user")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const makePreset = (group: PhysicalTellSeedGroup, value: string): PhysicalTellPreset => ({
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

export const PHYSICAL_TELL_PRESETS = PHYSICAL_TELL_SEED_GROUPS.flatMap((group) =>
  group.values.map((value) => makePreset(group, value)),
);

export const PHYSICAL_TELL_PRESET_CATEGORIES = Array.from(
  new Set(PHYSICAL_TELL_PRESETS.map((preset) => preset.category)),
).sort();

export const getPhysicalTellPresetsByCategory = (category: PhysicalTellPresetCategory) =>
  PHYSICAL_TELL_PRESETS.filter((preset) => preset.category === category);

export const findPhysicalTellPresetById = (id: string) =>
  PHYSICAL_TELL_PRESETS.find((preset) => preset.id === id);

export const compilePhysicalTellPresetAdditions = (
  preset: PhysicalTellPreset,
): CompiledPhysicalTellPresetAdditions => ({
  scenarioAddition: `Physical tell context: ${preset.value}. ${preset.guidance}`,
  personalityAddition: `Physical-tell texture may include ${preset.value} without replacing the character's full personality, motives, contradictions, boundaries, responsibilities, flaws, or growth.`,
  systemPromptAddition: [
    `Treat ${preset.value} as soft physical-tell context.`,
    "Let gaze, hands, breath, posture, voice, stillness, distance, and repeated contradictions shape subtext when relevant.",
    "Keep consent, boundaries, privacy, ambiguity, contradiction, and {{user}} agency intact; tells should suggest emotion without proving it or scripting outcomes.",
  ].join(" "),
});
