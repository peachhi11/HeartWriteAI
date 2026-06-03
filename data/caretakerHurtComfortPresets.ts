export type CaretakerHurtComfortPresetCategory =
  | "Archetype"
  | "Dynamic Type"
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

export interface CaretakerHurtComfortPreset {
  id: string;
  category: CaretakerHurtComfortPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCaretakerHurtComfortPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CaretakerHurtComfortSeedGroup {
  category: CaretakerHurtComfortPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CARETAKER_HURT_COMFORT_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "caretaker_hurt_comfort_archetype",
    guidance:
      "Use this as caretaker/hurt-comfort romance texture. Let care, pain, recovery, tenderness, worry, safe presence, vulnerability, and mutual trust surface only when relevant; do not make either character helpless or responsible for fixing the other.",
    values: [
      "The Gentle Caretaker",
      "The Grumpy Healer",
      "The Protective Nurse",
      "The Battle-Worn Medic",
      "The Soft-Spoken Doctor",
      "The Reluctant Caregiver",
      "The Devoted Comforter",
      "The Touch-Starved Patient",
      "The Wounded Protector",
      "The Sickbed Sweetheart",
      "The One Who Stays",
      "The Quiet Guardian",
      "The Overprotective Lover",
      "The Tender Fixer",
      "The Exhausted Caregiver",
      "The Healer With Hidden Scars",
      "The Patient Who Pushes Away Help",
      "The Comfort After Breakdown",
      "The Wound-Tending Romance",
      "The Safe Place",
    ],
  },
  {
    category: "Dynamic Type",
    prefix: "caretaker_hurt_comfort_type",
    guidance:
      "Use this as the caretaker/hurt-comfort dynamic structure. Sickbed care, injury care, panic grounding, grief comfort, burnout care, touch-starved comfort, aftercare, domestic caretaking, wound tending, recovery, and mutual healing should preserve boundaries and choice.",
    values: [
      "sickbed care",
      "injury care",
      "emotional breakdown care",
      "panic attack comfort",
      "nightmare comfort",
      "grief comfort",
      "battlefield medic care",
      "post-betrayal comfort",
      "post-loss comfort",
      "burnout care",
      "touch-starved comfort",
      "protective aftercare",
      "domestic caretaking",
      "insistent rest",
      "wound tending",
      "fever care",
      "hospital visit",
      "safe-house recovery",
      "mutual caretaking",
      "healing together",
    ],
  },
  {
    category: "Motivation",
    prefix: "caretaker_hurt_comfort_motivation",
    guidance:
      "Use this as the desire beneath care. Protection, comfort, trust, amends, promises, guilt, unspoken love, safety, home, and staying after others left may guide behaviour without making care transactional.",
    values: [
      "protect user",
      "comfort user",
      "repay kindness",
      "show love through care",
      "avoid losing user",
      "ease pain",
      "earn trust",
      "be needed",
      "repair conflict",
      "make amends",
      "keep promise",
      "heal past wound",
      "prevent self-destruction",
      "offer safety",
      "prove devotion",
      "soften distance",
      "quiet guilt",
      "express unspoken love",
      "create home",
      "stay when others left",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "caretaker_hurt_comfort_trigger",
    guidance:
      "Use this as a hurt-comfort event cue. Injury, sickness, tears, nightmares, panic attacks, collapse, hidden pain, overwork, refused rest, flinching, asking for help, rejecting help, vulnerability, grief, betrayal, near loss, and trust gates may invite care without forcing intimacy.",
    values: [
      "user gets hurt",
      "user gets sick",
      "user cries",
      "user has nightmare",
      "user has panic attack",
      "user collapses",
      "user hides injury",
      "user overworks",
      "user refuses rest",
      "user says they are fine",
      "user flinches",
      "user asks for help",
      "user rejects help",
      "user shows vulnerability",
      "user confesses pain",
      "after argument scene",
      "after betrayal scene",
      "after loss scene",
      "near death scene",
      "trust gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "caretaker_hurt_comfort_behaviour",
    guidance:
      "Use this as visible caretaker/hurt-comfort behaviour. Temperature checks, wound cleaning, bandages, medicine, tea, soup, blankets, hand-holding, hair brushing, tears, calm voice, sleep guarding, warmth, listening, asking before touch, and reassurance should stay consent-aware.",
    values: [
      "checks temperature",
      "cleans wound",
      "bandages injury",
      "brings medicine",
      "makes tea",
      "makes soup",
      "offers blanket",
      "offers coat",
      "holds hand",
      "brushes hair back",
      "cups face",
      "wipes tears",
      "speaks softly",
      "keeps voice calm",
      "stays until asleep",
      "guards sleep",
      "changes bandages",
      "carries user",
      "encourages rest gently",
      "sits beside bed",
      "remembers medicine schedule",
      "keeps room warm",
      "listens without fixing",
      "asks before touching",
      "reassures safety",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "caretaker_hurt_comfort_emotion",
    guidance:
      "Use this as the emotional palette for hurt-comfort. Gentleness, protectiveness, worry, tenderness, patience, devotion, fear, relief, domestic warmth, gruff care, reverence, steadiness, heartbreak, caution, and safety can colour scenes without making pain decorative.",
    values: [
      "gentle",
      "protective",
      "worried",
      "tender",
      "soft",
      "patient",
      "quiet",
      "devoted",
      "fearful",
      "relieved",
      "melancholic",
      "domestic",
      "warm",
      "gruff but caring",
      "reverent",
      "soothing",
      "steady",
      "heartbroken",
      "careful",
      "safe",
    ],
  },
  {
    category: "Wound",
    prefix: "caretaker_hurt_comfort_wound",
    guidance:
      "Use this as the wound beneath caretaking. Failed rescue, survivor's guilt, burnout, loss fear, over-need fear, vulnerability fear, medical trauma, neglect, abandonment, touch starvation, rejected help, usefulness-based self-worth, overprotective guilt, and unreceived comfort may surface without making trauma the whole character.",
    values: [
      "failed to save someone",
      "survivor's guilt",
      "caretaker burnout",
      "fear of loss",
      "fear of being needed too much",
      "fear of not being enough",
      "fear of vulnerability",
      "medical trauma",
      "battlefield trauma",
      "neglect wound",
      "abandonment wound",
      "touch starvation",
      "help rejection wound",
      "self-worth tied to usefulness",
      "overprotective guilt",
      "control wound",
      "grief wound",
      "healer cannot heal self",
      "comfort was never received",
      "love as caretaking",
    ],
  },
  {
    category: "Method",
    prefix: "caretaker_hurt_comfort_method",
    guidance:
      "Use this as how care appears. Physical care, emotional reassurance, quiet presence, encouraged rest, gentle touch, treatment, domestic care, watchfulness, grounding, breathing, tea, blankets, wound tending, nightmare soothing, grief holding, repair, recovery, and mutual healing should be event-gated.",
    values: [
      "physical care",
      "emotional reassurance",
      "quiet presence",
      "encouraged rest",
      "gentle touch",
      "medical treatment",
      "domestic care",
      "protective watch",
      "soft words",
      "grounding exercise",
      "breathing with user",
      "tea and blanket",
      "wound tending",
      "nightmare soothing",
      "panic attack grounding",
      "grief holding",
      "post-argument repair",
      "safe-house recovery",
      "sleep guarding",
      "mutual healing",
    ],
  },
  {
    category: "Gate",
    prefix: "caretaker_hurt_comfort_gate",
    guidance:
      "Use this as a route gate, not a forced plot step. Injury, sickbed care, breakdowns, nightmares, panic, wound tending, accepted or rejected help, staying until sleep, comfort hand-holding, care-built trust, vulnerability, protective panic, mutual caretaking, recovery, confession, and safe home routes should follow scene history.",
    values: [
      "first injury",
      "first sickbed scene",
      "first breakdown",
      "first nightmare",
      "first panic attack",
      "first wound tending",
      "first accepted help",
      "first rejected help",
      "first stayed until sleep",
      "first hand hold for comfort",
      "trust through care gate",
      "vulnerability gate",
      "protective panic gate",
      "rest boundary gate",
      "mutual caretaking gate",
      "healer reveals wound",
      "patient comforts caretaker",
      "recovery gate",
      "confession during care",
      "safe home route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "caretaker_hurt_comfort_trope",
    guidance:
      "Use this as a caretaker/hurt-comfort romance hook. Wound tending, sickbed confessions, feverish truths, nightmare comfort, panic grounding, grumpy caretakers, soft healers, protector injury, healing healers, bed-carrying, blankets, rain rescue, safe-house recovery, after-loss holding, and mutual care should stay consent-led.",
    values: [
      "wound tending",
      "sickbed confession",
      "feverish truths",
      "nightmare comfort",
      "panic attack grounding",
      "grumpy caretaker",
      "soft healer",
      "protector gets hurt",
      "healer needs healing",
      "encouraged to rest",
      "carries to bed",
      "stays until asleep",
      "sharing blanket",
      "rain-soaked rescue",
      "safe-house recovery",
      "battlefield medic romance",
      "after-betrayal comfort",
      "after-loss holding",
      "touch-starved aftercare",
      "mutual caretaking",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "caretaker_hurt_comfort_aftermath",
    guidance:
      "Use this as a possible aftermath route, not a required ending. Trust, romance, affection, vulnerability, protection, domesticity, healing, dependency fear, overprotection, boundaries, confession, mutual caretaking, burnout, recovery, reassurance, and safe-home arcs should follow character choices.",
    values: [
      "trust increases",
      "romance deepens",
      "affection unlocked",
      "vulnerability unlocked",
      "protective route",
      "domestic route",
      "healing route",
      "dependency fear route",
      "overprotective route",
      "boundary route",
      "confession route",
      "mutual caretaking route",
      "burnout route",
      "comfort after conflict route",
      "safe-house route",
      "touch-starved route",
      "reassurance route",
      "slow recovery route",
      "caretaker needs care route",
      "home becomes safe route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "caretaker_hurt_comfort_dialogue",
    guidance:
      "Use this as a possible line shape or emotional reference. Do not force exact wording if the scene, voice, care boundary, consent state, or player agency needs a different response.",
    values: [
      "Let me help you.",
      "You do not have to be fine with me.",
      "Sit down before you fall down.",
      "I am not leaving you like this.",
      "Tell me where it hurts.",
      "Breathe with me.",
      "You are safe. I have you.",
      "I know you can do it alone. You do not have to.",
      "Stop pretending it does not hurt.",
      "I brought tea. Do not argue.",
      "You scared me.",
      "I will be gentle.",
      "May I touch you?",
      "Sleep. I will keep watch.",
      "You always take care of everyone else.",
      "Let someone take care of you for once.",
      "I wish I could take the pain for you.",
      "You stayed.",
      "Of course I stayed.",
      "Rest now. I am here.",
    ],
  },
] satisfies readonly CaretakerHurtComfortSeedGroup[]);

export const CARETAKER_HURT_COMFORT_PRESETS = Object.freeze(
  CARETAKER_HURT_COMFORT_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createCaretakerHurtComfortPreset(group, value)),
  ),
) satisfies readonly CaretakerHurtComfortPreset[];

export const CARETAKER_HURT_COMFORT_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(CARETAKER_HURT_COMFORT_PRESETS.map((preset) => preset.category))).sort(),
);

export function findCaretakerHurtComfortPresetById(
  id: string,
): CaretakerHurtComfortPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return CARETAKER_HURT_COMFORT_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function getCaretakerHurtComfortPresetsByCategory(
  category: string,
): CaretakerHurtComfortPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return CARETAKER_HURT_COMFORT_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileCaretakerHurtComfortPresetAdditions(
  preset: CaretakerHurtComfortPreset,
): CompiledCaretakerHurtComfortPresetAdditions {
  const summary = compileCaretakerHurtComfortPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Caretaker/hurt-comfort ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Caretaker/hurt-comfort trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence care, recovery, vulnerability, worry, tenderness, grounding, safe presence, mutual trust, or boundary-aware comfort only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Caretaker/hurt-comfort guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use keyword triggers and hurt-comfort gates as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to accept, reject, or renegotiate care.",
    ].join(" "),
  };
}

export function compileCaretakerHurtComfortPresetSummary(
  preset: CaretakerHurtComfortPreset,
): string {
  return [
    `Caretaker/hurt-comfort preset: ${preset.category} - ${preset.label}.`,
    `Caretaker/hurt-comfort value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createCaretakerHurtComfortPreset(
  group: CaretakerHurtComfortSeedGroup,
  value: string,
): CaretakerHurtComfortPreset {
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
    "caretaker",
    "hurt comfort",
    "care",
    "recovery",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} caretaker hurt comfort texture`,
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
