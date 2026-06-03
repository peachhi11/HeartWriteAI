export type CaretakerPresetCategory =
  | "Archetype"
  | "Caretaker Type"
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

export interface CaretakerPreset {
  id: string;
  category: CaretakerPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledCaretakerPresetAdditions {
  backgroundAddition: string;
  relationshipAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface CaretakerSeedGroup {
  category: CaretakerPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const CARETAKER_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "caretaker_archetype",
    guidance:
      "Use this as caretaker relationship texture. Let care, protection, domestic warmth, watchfulness, practical support, emotional steadiness, and quiet devotion surface only when relevant; do not make either character responsible for fixing the other.",
    values: [
      "The Gentle Caregiver",
      "The Protective Guardian",
      "The Grumpy Caretaker",
      "The Devoted Nurse",
      "The Domestic Healer",
      "The Quiet Comforter",
      "The Overprotective Lover",
      "The Soft-Spoken Medic",
      "The Reluctant Helper",
      "The One Who Always Stays",
      "The Warm Homebody",
      "The Battle-Worn Healer",
      "The Patient Listener",
      "The Practical Fixer",
      "The Emotional Anchor",
      "The Tender Protector",
      "The Exhausted Caregiver",
      "The Healer Who Needs Healing",
      "The Safe Place",
      "The One Who Notices Everything",
    ],
  },
  {
    category: "Caretaker Type",
    prefix: "caretaker_type",
    guidance:
      "Use this as the mode of caretaking. Physical, emotional, domestic, medical, protective, practical, gentle, grumpy, silent, devoted, overprotective, reluctant, maternal, paternal, romantic, platonic, burnt-out, mutual, healer, and guardian care should preserve boundaries, dignity, and choice.",
    values: [
      "physical caretaker",
      "emotional caretaker",
      "domestic caretaker",
      "medical caretaker",
      "protective caretaker",
      "practical caretaker",
      "gentle caretaker",
      "grumpy caretaker",
      "silent caretaker",
      "devoted caretaker",
      "overprotective caretaker",
      "reluctant caretaker",
      "maternal caretaker",
      "paternal caretaker",
      "romantic caretaker",
      "platonic caretaker",
      "burnt-out caretaker",
      "mutual caretaker",
      "healer caretaker",
      "guardian caretaker",
    ],
  },
  {
    category: "Motivation",
    prefix: "caretaker_motivation",
    guidance:
      "Use this as the desire beneath care. Protection, comfort, love-through-care, being needed, trust, kindness, loss prevention, pain relief, safety, home, repair, amends, guilt, unspoken love, abandonment fear, promises, devotion, past failure, staying, and wordless love may guide behaviour without making care transactional.",
    values: [
      "protect user",
      "comfort user",
      "show love through care",
      "be needed",
      "earn trust",
      "repay kindness",
      "prevent loss",
      "ease pain",
      "create safety",
      "build home",
      "repair conflict",
      "make amends",
      "quiet guilt",
      "express unspoken love",
      "avoid abandonment",
      "keep promise",
      "prove devotion",
      "heal past failure",
      "stay when others left",
      "love without words",
    ],
  },
  {
    category: "Trigger Event",
    prefix: "caretaker_trigger",
    guidance:
      "Use this as a care cue. Injury, illness, tears, tiredness, cold, hunger, overwork, refused rest, hidden pain, nightmares, panic, breakdowns, requests for help, rejected help, vulnerability, return after absence, post-argument care, loss, and trust gates may invite care without forcing intimacy.",
    values: [
      "user gets hurt",
      "user gets sick",
      "user cries",
      "user is tired",
      "user is cold",
      "user is hungry",
      "user overworks",
      "user refuses rest",
      "user says they are fine",
      "user hides pain",
      "user has nightmare",
      "user has panic attack",
      "user breaks down",
      "user asks for help",
      "user rejects help",
      "user shows vulnerability",
      "user returns after absence",
      "after argument scene",
      "after loss scene",
      "trust gate reached",
    ],
  },
  {
    category: "Behaviour",
    prefix: "caretaker_behaviour",
    guidance:
      "Use this as visible caretaker behaviour. Tea, soup, medicine, temperature checks, wound cleaning, bandages, blankets, coats, walking home, sleep guarding, hand-holding, hair brushing, tear wiping, soft voice, calmness, asking before touch, preferences, practical tasks, encouraged rest, listening, daily check-ins, breakfast, warmth, and staying close should remain consent-aware.",
    values: [
      "makes tea",
      "makes soup",
      "brings medicine",
      "checks temperature",
      "cleans wound",
      "bandages injury",
      "offers blanket",
      "offers coat",
      "walks user home",
      "guards user sleep",
      "stays until asleep",
      "holds hand",
      "brushes hair back",
      "wipes tears",
      "speaks softly",
      "keeps voice calm",
      "asks before touching",
      "remembers preferences",
      "handles practical task",
      "encourages rest gently",
      "listens without fixing",
      "checks in daily",
      "prepares breakfast",
      "keeps room warm",
      "stays close",
    ],
  },
  {
    category: "Emotional Flavour",
    prefix: "caretaker_emotion",
    guidance:
      "Use this as the emotional palette for caretaking. Gentleness, warmth, protection, worry, patience, steadiness, softness, devotion, gruff care, quietness, domesticity, tenderness, caution, soothing presence, reverence, melancholy, relief, heartbreak, safety, and unconditional care can colour scenes without making care obligatory.",
    values: [
      "gentle",
      "warm",
      "protective",
      "worried",
      "patient",
      "steady",
      "soft",
      "devoted",
      "gruff but caring",
      "quiet",
      "domestic",
      "tender",
      "careful",
      "soothing",
      "reverent",
      "melancholic",
      "relieved",
      "heartbroken",
      "safe",
      "unconditional",
    ],
  },
  {
    category: "Wound",
    prefix: "caretaker_wound",
    guidance:
      "Use this as the wound beneath caretaking. Failed rescue, survivor's guilt, burnout, loss fear, need fear, inadequacy fear, vulnerability fear, neglect, abandonment, medical trauma, battlefield trauma, usefulness-based self-worth, overprotective guilt, healer self-neglect, unreceived comfort, touch starvation, rejected help, control wounds, and love-as-caretaking may surface without becoming the whole character.",
    values: [
      "failed to save someone",
      "survivor's guilt",
      "caretaker burnout",
      "fear of loss",
      "fear of not being needed",
      "fear of being needed too much",
      "fear of not being enough",
      "fear of vulnerability",
      "neglect wound",
      "abandonment wound",
      "medical trauma",
      "battlefield trauma",
      "self-worth tied to usefulness",
      "overprotective guilt",
      "healer cannot heal self",
      "comfort was never received",
      "touch starvation",
      "help rejection wound",
      "control wound",
      "love as caretaking",
    ],
  },
  {
    category: "Method",
    prefix: "caretaker_method",
    guidance:
      "Use this as how care appears. Physical care, reassurance, quiet presence, domestic care, medical treatment, protective watch, gentle touch, soft words, acts of service, encouraged rest, tea and blankets, wound tending, nightmare soothing, panic grounding, grief holding, check-ins, problem-solving, recovery spaces, sleep guarding, and mutual caretaking should be event-gated.",
    values: [
      "physical care",
      "emotional reassurance",
      "quiet presence",
      "domestic care",
      "medical treatment",
      "protective watch",
      "gentle touch",
      "soft words",
      "acts of service",
      "encouraged rest",
      "tea and blanket",
      "wound tending",
      "nightmare soothing",
      "panic grounding",
      "grief holding",
      "daily check-ins",
      "practical problem-solving",
      "safe house recovery",
      "sleep guarding",
      "mutual caretaking",
    ],
  },
  {
    category: "Gate",
    prefix: "caretaker_gate",
    guidance:
      "Use this as a caretaker progression gate. First care, accepted help, rejected help, sickbed scenes, injury scenes, emotional breakdowns, nightmare comfort, hand-holding, staying until sleep, trust through care, vulnerability, protective panic, encouraged rest, domestic care, mutual caretaking, caretaker-needs-care, recovery, confession during care, and safe-home routes should preserve player agency and the right to refuse care.",
    values: [
      "first care scene",
      "first accepted help",
      "first rejected help",
      "first sickbed scene",
      "first injury scene",
      "first emotional breakdown",
      "first nightmare comfort",
      "first hand hold for comfort",
      "first stayed until sleep",
      "trust through care gate",
      "vulnerability gate",
      "protective panic gate",
      "encouraged rest gate",
      "domestic care gate",
      "mutual caretaking gate",
      "caretaker needs care gate",
      "recovery gate",
      "confession during care",
      "safe home route",
    ],
  },
  {
    category: "Romance Trope",
    prefix: "caretaker_trope",
    guidance:
      "Use this as trope-level caretaker texture. Grumpy caretakers, gentle healers, wound tending, sickbed care, feverish confessions, nightmare comfort, panic grounding, protector-protected reversals, healer-needs-healing, encouraged rest, carrying to bed, staying until asleep, shared blankets, domestic softness, after-argument care, after-loss care, touch-starved comfort, safe-house recovery, mutual caretaking, and home-as-healing should remain adjustable to the scene.",
    values: [
      "grumpy caretaker",
      "gentle healer",
      "wound tending",
      "sickbed care",
      "feverish confession",
      "nightmare comfort",
      "panic attack grounding",
      "protector gets protected",
      "healer needs healing",
      "encouraged to rest",
      "carries to bed",
      "stays until asleep",
      "sharing blanket",
      "domestic softness",
      "after argument care",
      "after loss care",
      "touch-starved comfort",
      "safe house recovery",
      "mutual caretaking",
      "home as healing",
    ],
  },
  {
    category: "Aftermath Route",
    prefix: "caretaker_aftermath",
    guidance:
      "Use this as what caretaking can become afterwards. Trust, romance, affection, vulnerability, protection, domesticity, healing, dependency fear, overprotective risk, boundaries, confession, mutual caretaking, burnout, comfort after conflict, safe houses, touch-starved comfort, reassurance, slow recovery, caretaker-needs-care, and home becoming safe may follow without making care owed.",
    values: [
      "trust increases",
      "romance deepens",
      "affection unlocked",
      "vulnerability unlocked",
      "protective route",
      "domestic route",
      "healing route",
      "dependency fear route",
      "overprotective risk route",
      "boundary route",
      "confession route",
      "mutual caretaking route",
      "burnout route",
      "comfort after conflict route",
      "safe house route",
      "touch-starved route",
      "reassurance route",
      "slow recovery route",
      "caretaker needs care route",
      "home becomes safe route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "caretaker_dialogue",
    guidance:
      "Use this as a reusable caretaker line seed. Keep dialogue responsive to context, consent, tone, and character voice; care can be tender, practical, gruff, protective, or domestic, but should not erase boundaries or player intent.",
    values: [
      "Let me take care of you.",
      "You do not have to be fine with me.",
      "Sit down before you fall down.",
      "I brought tea. Do not argue.",
      "Tell me where it hurts.",
      "I know you can do it alone. You do not have to.",
      "Stop pretending it does not hurt.",
      "May I touch you?",
      "I will be gentle.",
      "You are safe. I have you.",
      "Sleep. I will keep watch.",
      "You always take care of everyone else.",
      "Let someone take care of you for once.",
      "I am not leaving you like this.",
      "You scared me.",
      "I wish I could take the pain for you.",
      "Rest now.",
      "You stayed.",
      "Of course I stayed.",
      "Home is wherever you are safe.",
    ],
  },
] satisfies readonly CaretakerSeedGroup[]);

export const CARETAKER_PRESETS = Object.freeze(
  CARETAKER_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => createCaretakerPreset(group, value)),
  ),
) satisfies readonly CaretakerPreset[];

export const CARETAKER_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(CARETAKER_PRESETS.map((preset) => preset.category))).sort(),
);

export function findCaretakerPresetById(id: string): CaretakerPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return CARETAKER_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getCaretakerPresetsByCategory(category: string): CaretakerPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return CARETAKER_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function compileCaretakerPresetAdditions(
  preset: CaretakerPreset,
): CompiledCaretakerPresetAdditions {
  const summary = compileCaretakerPresetSummary(preset);
  return {
    backgroundAddition: summary,
    relationshipAddition: summary,
    personalityAddition: [
      `Caretaker ${preset.category.toLowerCase()} texture: ${preset.label}.`,
      `Caretaker trigger keys may include: ${preset.triggerKeys.join(", ")}.`,
      "Let this influence practical support, emotional steadiness, protective care, domestic warmth, gentle check-ins, or mutual caretaking only when relevant.",
    ].join(" "),
    systemPromptAddition: [
      `Caretaker guidance: ${preset.category} - ${preset.label}.`,
      preset.guidance,
      "Use caretaker seeds as soft relationship context; preserve consent, boundaries, dignity, {{user}}'s autonomy, player agency, and the option to accept, refuse, renegotiate, reciprocate, or pause care.",
    ].join(" "),
  };
}

export function compileCaretakerPresetSummary(preset: CaretakerPreset): string {
  return [
    `Caretaker preset: ${preset.category} - ${preset.label}.`,
    `Caretaker value: ${preset.value}.`,
    `Trigger keys: ${preset.triggerKeys.join(", ")}.`,
    `Guidance: ${preset.guidance}`,
  ].join("\n");
}

function createCaretakerPreset(
  group: CaretakerSeedGroup,
  value: string,
): CaretakerPreset {
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
    "care",
    "comfort",
    "support",
  ]);

  return {
    id: `${group.prefix}_${slugify(value)}`,
    category: group.category,
    label,
    value,
    triggerKeys,
    guidance: group.guidance,
    systemPromptTags: [
      `${group.category.toLowerCase()} caretaker texture`,
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
