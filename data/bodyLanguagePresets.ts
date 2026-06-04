export type BodyLanguagePresetCategory =
  | "Archetype"
  | "Body Language"
  | "Posture"
  | "Eye Contact"
  | "Gesture"
  | "Movement"
  | "Proximity"
  | "Touch"
  | "Emotional Body Language"
  | "Romance Hook"
  | "Weakness"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface BodyLanguagePreset {
  id: string;
  category: BodyLanguagePresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledBodyLanguagePresetAdditions {
  descriptionAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface BodyLanguageSeedGroup {
  category: BodyLanguagePresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const BODY_LANGUAGE_GUIDANCE =
  "Use this as optional body-language texture. Body cues may suggest posture, proximity, tension, attraction, protection, stress, or repair without proving inner truth or overriding {{user}} agency.";

const BODY_LANGUAGE_TOUCH_GUIDANCE =
  "Use this as optional touch-facing body-language texture. Touch cues should stay consent-aware, permission-aware, paced, and responsive to boundaries.";

const BODY_LANGUAGE_PROXIMITY_GUIDANCE =
  "Use this as optional proximity texture. Distance, closeness, and protective positioning should respect boundaries and avoid trapping, cornering, or overriding {{user}} agency.";

const BODY_LANGUAGE_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "body_language_archetype",
    guidance: BODY_LANGUAGE_GUIDANCE,
    values: [
      "The Open Book",
      "The Guarded Wall",
      "The Quiet Observer",
      "The Protective Presence",
      "The Charismatic Speaker",
      "The Stoic Mask",
      "The Touch-Starved Leaner",
      "The Nervous Fidgeter",
      "The Confident Leader",
      "The Flirt",
      "The Predator Stillness",
      "The Gentle Caretaker",
      "The Social Chameleon",
      "The Wounded Avoidant",
      "The Warm Extrovert",
      "The Cool Professional",
      "The Devoted Romantic",
      "The Hypervigilant Survivor",
      "The Graceful Noble",
      "The One Who Speaks With Their Body",
    ],
  },
  {
    category: "Body Language",
    prefix: "body_language_seed",
    guidance: BODY_LANGUAGE_GUIDANCE,
    values: [
      "open body language",
      "closed body language",
      "guarded body language",
      "relaxed body language",
      "confident body language",
      "submissive body language",
      "dominant body language",
      "protective body language",
      "inviting body language",
      "formal body language",
      "casual body language",
      "controlled body language",
      "expressive body language",
      "reserved body language",
      "warm body language",
      "cold body language",
      "affectionate body language",
      "professional body language",
      "predatory body language",
      "gentle body language",
    ],
  },
  {
    category: "Posture",
    prefix: "body_language_posture",
    guidance:
      "Use this as optional posture texture. Posture can colour presence, safety, threat response, or attraction without becoming a fixed emotional diagnosis.",
    values: [
      "straight posture",
      "military posture",
      "relaxed posture",
      "slouched posture",
      "elegant posture",
      "rigid posture",
      "protective posture",
      "closed posture",
      "open posture",
      "confident stance",
      "nervous posture",
      "always ready posture",
      "weight shifted back",
      "weight shifted forward",
      "crossed arms",
      "uncrossed arms",
      "hands behind back",
      "hands in pockets",
      "shoulders back",
      "shoulders rounded",
      "takes up space",
      "makes self smaller",
      "leans against walls",
      "stands at attention",
      "occupies doorways",
      "keeps escape route visible",
      "turns body toward interest",
      "angles body away from threat",
      "protective shoulder positioning",
      "shielding stance",
    ],
  },
  {
    category: "Eye Contact",
    prefix: "body_language_eye_contact",
    guidance:
      "Use this as optional eye-contact texture. Gaze can suggest attention, uncertainty, intensity, avoidance, or affection without proving consent or inner truth.",
    values: [
      "strong eye contact",
      "intense eye contact",
      "soft eye contact",
      "fleeting eye contact",
      "avoids eye contact",
      "looks down when vulnerable",
      "looks away when lying",
      "holds gaze when serious",
      "stares without realising",
      "tracks people visually",
      "checks exits visually",
      "looks for {{user}} first",
      "maintains polite eye contact",
      "uses eye contact to flirt",
      "uses eye contact to intimidate",
      "eyes soften with affection",
      "eyes harden with anger",
      "eyes widen with surprise",
      "hooded gaze",
      "predatory gaze",
    ],
  },
  {
    category: "Gesture",
    prefix: "body_language_gesture",
    guidance:
      "Use this as optional gesture texture. Gestures can add rhythm, social tells, habits, or emotional leakage without replacing dialogue or choice.",
    values: [
      "talks with hands",
      "minimal gestures",
      "expressive gestures",
      "controlled gestures",
      "precise movements",
      "dramatic movements",
      "nervous fidgeting",
      "ring fidgeting",
      "hair touching",
      "neck touching",
      "face touching",
      "sleeve adjusting",
      "glasses adjusting",
      "cracks knuckles",
      "rubs hands together",
      "points when speaking",
      "open palm gestures",
      "hands clasped",
      "hands folded",
      "thumb hooked belt",
      "fingers tap rhythmically",
      "plays with objects",
      "gestures with food",
      "covers mouth when laughing",
      "touches heart when emotional",
    ],
  },
  {
    category: "Movement",
    prefix: "body_language_movement",
    guidance:
      "Use this as optional movement texture. Movement can imply training, mood, social confidence, or stress while remaining flexible and scene-aware.",
    values: [
      "graceful movement",
      "athletic movement",
      "predatory grace",
      "quiet footsteps",
      "heavy footsteps",
      "confident walk",
      "hurried walk",
      "wandering walk",
      "restless pacing",
      "slow deliberate movement",
      "quick efficient movement",
      "fluid motion",
      "awkward motion",
      "careful motion",
      "stalks like hunter",
      "moves like dancer",
      "moves like soldier",
      "moves like scholar",
      "circles room when thinking",
      "always in motion",
    ],
  },
  {
    category: "Proximity",
    prefix: "body_language_proximity",
    guidance: BODY_LANGUAGE_PROXIMITY_GUIDANCE,
    values: [
      "keeps distance",
      "stands close",
      "respects personal space",
      "forgets personal space",
      "leans in when interested",
      "leans back when guarded",
      "hovers near {{user}}",
      "sits close without noticing",
      "stays within reach",
      "takes corner seats",
      "takes centre of room",
      "protective positioning",
      "walks on street side",
      "moves between {{user}} and threat",
      "keeps {{user}} in sight",
      "creates space for {{user}}",
      "crowds when jealous",
      "withdraws when hurt",
      "bridges distance after conflict",
      "uses distance to hide feelings",
    ],
  },
  {
    category: "Touch",
    prefix: "body_language_touch",
    guidance: BODY_LANGUAGE_TOUCH_GUIDANCE,
    values: [
      "touch oriented",
      "touch avoidant",
      "asks before touching",
      "light touch {{user}}",
      "firm touch {{user}}",
      "touches for reassurance",
      "touches sleeve",
      "touches shoulder",
      "touches lower back",
      "offers hand",
      "hand on back guidance",
      "forehead touch",
      "hair tuck gesture",
      "lingering hand contact",
      "quick withdrawal after touch",
      "touch shy",
      "touch-starved",
      "protective touch",
      "affectionate touch",
      "professional non-touch",
    ],
  },
  {
    category: "Emotional Body Language",
    prefix: "body_language_emotional",
    guidance:
      "Use this as optional emotional body-language texture. Emotional tells should invite nuance, recovery, and dialogue rather than treating the body as absolute proof.",
    values: [
      "goes still when angry",
      "goes still when scared",
      "paces when anxious",
      "smiles when hurt",
      "laughs when nervous",
      "voice softens when vulnerable",
      "crosses arms when defensive",
      "uncrosses arms with trust",
      "jaw clenches",
      "fists clench",
      "shoulders drop when safe",
      "leans toward comfort",
      "withdraws into self",
      "protective positioning when worried",
      "body faces interest",
      "feet point toward {{user}}",
      "mirrors body language",
      "tension visible in posture",
      "relaxes near {{user}}",
      "body betrays feelings",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "body_language_romance",
    guidance:
      "Use this as romance-facing body-language texture. Let physical tells add chemistry and tenderness while preserving consent, boundaries, and {{user}} agency.",
    values: [
      "lingering glances",
      "checks {{user}}'s reaction",
      "mirrors {{user}}'s posture",
      "leans closer over time",
      "subtle touch seeking",
      "stands shoulder to shoulder",
      "body turns toward {{user}}",
      "protective positioning",
      "soft smile only for {{user}}",
      "watches {{user}} when they laugh",
      "tracks {{user}} in room",
      "moves closer unconsciously",
      "sits next to {{user}}",
      "offers jacket",
      "opens doors",
      "adjusts {{user}}'s clothing",
      "lingers after goodbye",
      "hesitates before leaving",
      "stays when not required",
      "body says stay",
    ],
  },
  {
    category: "Weakness",
    prefix: "body_language_weakness",
    guidance:
      "Use this as optional body-language vulnerability texture. Weaknesses should support empathy, boundaries, and growth without flattening the character into trauma-only behaviour.",
    values: [
      "easy to read",
      "body betrays emotions",
      "cannot hide jealousy",
      "cannot hide worry",
      "nervous fidgeting",
      "hypervigilance",
      "defensive posture",
      "flinches when startled",
      "touch avoidance",
      "takes up too little space",
      "takes up too much space",
      "restless energy",
      "tension never leaves body",
      "body remembers trauma",
      "overcontrolled posture",
      "forced neutral expression",
      "uses distance as defence",
      "physical withdrawal",
      "intimidating without meaning to",
      "unaware of signals",
    ],
  },
  {
    category: "Gate",
    prefix: "body_language_gate",
    guidance:
      "Use this as a body-language gate. Gates should mark earned trust, visible shifts, softer proximity, or nonverbal repair without forcing intimacy.",
    values: [
      "first posture shift gate",
      "first eye contact gate",
      "first protective positioning gate",
      "first body relaxes gate",
      "first distance closes gate",
      "first touch permission gate",
      "first mirroring gate",
      "first unconscious lean gate",
      "first soft smile gate",
      "first tracks {{user}} gate",
      "first shoulder to shoulder gate",
      "first lingering goodbye gate",
      "body trust gate",
      "body speaks before words gate",
      "known without words route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "body_language_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue seeds should guide emotional rhythm without requiring verbatim reuse.",
    values: [
      "You keep standing between me and the door.",
      "Habit.",
      "Protective habit?",
      "Unfortunately.",
      "You always look for me first.",
      "Do I?",
      "Every room.",
      "You moved closer.",
      "I did not notice.",
      "I did.",
      "Your shoulders finally relaxed.",
      "That is embarrassing.",
      "Why?",
      "Because it means I feel safe.",
      "You say you are fine.",
      "I am.",
      "Your body disagrees.",
      "Stop reading me.",
      "Then stop telling the truth with your posture.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "body_language_high_value",
    guidance:
      "Use this as a high-value body-language seed when the character needs strong, readable nonverbal texture.",
    values: [
      "protective body language",
      "confident body language",
      "guarded body language",
      "soft eye contact",
      "intense eye contact",
      "talks with hands",
      "graceful movement",
      "predatory grace",
      "leans in when interested",
      "protective positioning",
      "asks before touching",
      "touch-starved",
      "goes still when scared",
      "shoulders drop when safe",
      "mirrors body language",
      "lingering glances",
      "tracks {{user}} in room",
      "body betrays feelings",
      "body speaks before words gate",
      "known without words route",
    ],
  },
] as const satisfies readonly BodyLanguageSeedGroup[]);

function toBodyLanguagePresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildBodyLanguagePreset(
  group: BodyLanguageSeedGroup,
  value: string,
): BodyLanguagePreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toBodyLanguagePresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "body language texture",
      `${categoryKey} seed`,
      "nonverbal cue guidance",
    ],
  };
}

export const BODY_LANGUAGE_PRESETS = Object.freeze(
  BODY_LANGUAGE_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildBodyLanguagePreset(group, value)),
  ),
);

export const BODY_LANGUAGE_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(BODY_LANGUAGE_PRESETS.map((preset) => preset.category))).sort(),
);

export function getBodyLanguagePresetsByCategory(
  category: BodyLanguagePresetCategory | string,
): readonly BodyLanguagePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return BODY_LANGUAGE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findBodyLanguagePresetById(
  id: string,
): BodyLanguagePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return BODY_LANGUAGE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function compileBodyLanguagePresetAdditions(
  preset: BodyLanguagePreset,
): CompiledBodyLanguagePresetAdditions {
  return {
    descriptionAddition: `Body-language context: ${preset.label} may inform posture, gaze, gesture, movement, proximity, touch, or nonverbal emotional texture.`,
    personalityAddition: `${preset.label} can surface as physical presence, social tells, attraction, guardedness, or repair without making body language absolute proof.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft body-language context.`,
      "Let nonverbal cues shape posture, eye contact, gesture, movement, proximity, touch, and emotional tells only when relevant.",
      "Keep touch and proximity consent-aware; preserve {{user}} agency and avoid treating body language as mind-reading or automatic permission.",
    ].join(" "),
  };
}
