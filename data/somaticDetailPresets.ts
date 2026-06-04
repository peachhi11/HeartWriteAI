export type SomaticDetailPresetCategory =
  | "Archetype"
  | "Somatic Detail"
  | "Breath"
  | "Tension"
  | "Touch"
  | "Movement"
  | "Safety"
  | "Distress"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface SomaticDetailPreset {
  id: string;
  category: SomaticDetailPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSomaticDetailPresetAdditions {
  descriptionAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SomaticDetailSeedGroup {
  category: SomaticDetailPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SOMATIC_DETAIL_GUIDANCE =
  "Use this as optional somatic detail texture. Body cues may suggest stress, safety, attraction, memory, grounding, or repair without proving inner truth or overriding {{user}} agency.";

const SOMATIC_DETAIL_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "somatic_detail_archetype",
    guidance: SOMATIC_DETAIL_GUIDANCE,
    values: [
      "The Grounded Body",
      "The Tension Holder",
      "The Touch-Starved Body",
      "The Hypervigilant Survivor",
      "The Softened-by-Safety Type",
      "The Nervous System Romantic",
      "The Breath-Catches Type",
      "The Guarded Posture",
      "The Relaxed Around {{user}} Type",
      "The Hands-Betray-Emotion Type",
      "The Flinch Then Lean In Type",
      "The Quiet Pain Carrier",
      "The Warmth-Seeking One",
      "The Body Remembers Type",
      "The Safe Touch Slow Burn",
      "The Sensory Anchor",
      "The Protective Body Language",
      "The Panic-to-Comfort Arc",
      "The Healing Through Presence Type",
      "The One Whose Body Learns Safety",
    ],
  },
  {
    category: "Somatic Detail",
    prefix: "somatic_detail_seed",
    guidance:
      "Use this as body-based emotional texture. Somatic details should remain contextual, observable, and non-diagnostic.",
    values: [
      "somatic details",
      "body awareness",
      "nervous system response",
      "body memory",
      "embodied emotion",
      "physicalised feelings",
      "stress held in body",
      "safety felt in body",
      "touch response",
      "breath response",
      "posture response",
      "muscle tension",
      "body softening",
      "grounding response",
      "flinch response",
      "freeze response",
      "fight response",
      "flight response",
      "fawn response",
      "rest and digest response",
    ],
  },
  {
    category: "Breath",
    prefix: "somatic_detail_breath",
    guidance:
      "Use this as breath texture. Breath cues can show nervous-system state, intimacy, panic, relief, or grounding without becoming a fixed script.",
    values: [
      "breath catches",
      "breath hitches",
      "shallow breathing",
      "held breath",
      "slow exhale",
      "steadying breath",
      "breath shakes",
      "breath evens out",
      "breathes through panic",
      "forgets to breathe",
      "breathes easier near {{user}}",
      "matches {{user}}'s breathing",
      "voice rough from breath",
      "sighs in relief",
      "exhale as surrender",
    ],
  },
  {
    category: "Tension",
    prefix: "somatic_detail_tension",
    guidance:
      "Use this as body tension texture. Tension can mark stress, restraint, fear, attraction, or release while staying grounded in the scene.",
    values: [
      "jaw clenches",
      "shoulders tense",
      "shoulders drop when safe",
      "neck tension",
      "back tension",
      "hands clench",
      "fists uncurl",
      "white-knuckled grip",
      "stomach knots",
      "chest tightens",
      "throat tightens",
      "spine goes rigid",
      "body goes still",
      "muscles lock",
      "body unwinds slowly",
    ],
  },
  {
    category: "Touch",
    prefix: "somatic_detail_touch",
    guidance:
      "Use this as touch response texture. Touch should remain permission-aware, paced, and responsive to comfort, refusal, repair, and aftercare.",
    values: [
      "flinches from touch",
      "freezes when touched",
      "leans into touch",
      "melts under touch",
      "startles then softens",
      "touch shy",
      "touch hungry",
      "touch cautious",
      "touch sensitive",
      "craves pressure",
      "needs light touch",
      "prefers firm touch",
      "hand-holding grounds them",
      "forehead touch calms them",
      "safe touch rewrites memory",
    ],
  },
  {
    category: "Movement",
    prefix: "somatic_detail_movement",
    guidance:
      "Use this as movement and posture texture. Movement cues should suggest inner pressure without over-explaining it.",
    values: [
      "paces when anxious",
      "rocks on heels",
      "bounces knee",
      "fidgets with hands",
      "rubs wrists",
      "touches throat",
      "covers chest",
      "wraps arms around self",
      "leans against wall",
      "moves quietly",
      "moves carefully",
      "restless energy",
      "predatory stillness",
      "protective positioning",
      "steps closer when worried",
    ],
  },
  {
    category: "Safety",
    prefix: "somatic_detail_safety",
    guidance:
      "Use this as body-safety texture. Safety cues should grow through earned trust, clear boundaries, and ordinary care.",
    values: [
      "body relaxes near {{user}}",
      "sleeps deeper near {{user}}",
      "eats better when safe",
      "hands stop shaking",
      "breathing slows",
      "shoulders lower",
      "voice softens",
      "stomach unclenches",
      "can rest without guilt",
      "lets guard down physically",
      "accepts blanket",
      "accepts water",
      "accepts touch with permission",
      "body trusts before mind",
      "home felt in body",
    ],
  },
  {
    category: "Distress",
    prefix: "somatic_detail_distress",
    guidance:
      "Use this as distress texture. Distress should invite care, grounding, boundaries, and recovery rather than romanticising panic or pain.",
    values: [
      "panic in body",
      "nausea from fear",
      "cold sweat",
      "shaking hands",
      "trembling knees",
      "weak legs",
      "dizzy from stress",
      "heart pounding",
      "pulse jumping",
      "skin prickling",
      "ears ringing",
      "vision tunnels",
      "mouth goes dry",
      "body goes numb",
      "body remembers danger",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "somatic_detail_romance",
    guidance:
      "Use this as romance-facing somatic texture. Hooks should emerge through consent-aware touch, grounded presence, repair, and nervous-system safety.",
    values: [
      "first body relaxes near {{user}}",
      "first safe touch",
      "first breath matching",
      "first flinch repair",
      "first hand-hold grounding",
      "first forehead touch calms",
      "first time they sleep near {{user}}",
      "first time they lean in",
      "first time they stop shaking",
      "first panic grounding scene",
      "touch rewrites fear",
      "body trusts before heart",
      "nervous system recognises safety",
      "love felt as rest",
      "home in their presence",
    ],
  },
  {
    category: "Gate",
    prefix: "somatic_detail_gate",
    guidance:
      "Use this as a somatic gate. Gates should mark observable shifts in safety, distress, breath, rest, or trust without forcing vulnerability.",
    values: [
      "first somatic tell gate",
      "first body memory gate",
      "first flinch gate",
      "first safe touch gate",
      "first grounding gate",
      "first breath sync gate",
      "first tension release gate",
      "first rest gate",
      "first sleep near {{user}} gate",
      "first body trust gate",
      "first panic repair gate",
      "first safe to need gate",
      "body learns safety gate",
      "love as rest gate",
      "home in body route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "somatic_detail_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue should keep body-based care specific, gentle, and consent-aware without requiring verbatim reuse.",
    values: [
      "Your shoulders dropped.",
      "Did they?",
      "Yes. You do that when you feel safe.",
      "Breathe with me.",
      "I am trying.",
      "Good. Try here. With me.",
      "You flinched.",
      "I know.",
      "I will ask next time.",
      "Please.",
      "Your hands stopped shaking.",
      "You noticed?",
      "I notice when your body stops fighting ghosts.",
      "I feel tired.",
      "Safe tired?",
      "I think so.",
      "My body trusts you before I know how to.",
      "Then we will move at your body's pace.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "somatic_detail_high_value",
    guidance:
      "Use this as a high-value somatic detail seed when the character needs strong body-memory, safety, breath, touch, or grounding texture.",
    values: [
      "nervous system response",
      "body memory",
      "safety felt in body",
      "breath catches",
      "shoulders drop when safe",
      "flinches from touch",
      "leans into touch",
      "body relaxes near {{user}}",
      "sleeps deeper near {{user}}",
      "body trusts before mind",
      "home felt in body",
      "panic grounding scene",
      "touch rewrites fear",
      "nervous system recognises safety",
      "body learns safety gate",
      "love as rest gate",
    ],
  },
] as const satisfies readonly SomaticDetailSeedGroup[]);

function toSomaticDetailPresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildSomaticDetailPreset(
  group: SomaticDetailSeedGroup,
  value: string,
): SomaticDetailPreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toSomaticDetailPresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "somatic detail texture",
      `${categoryKey} seed`,
      "body cues and grounded care",
    ],
  };
}

export const SOMATIC_DETAIL_PRESETS = Object.freeze(
  SOMATIC_DETAIL_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildSomaticDetailPreset(group, value)),
  ),
);

export const SOMATIC_DETAIL_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SOMATIC_DETAIL_PRESETS.map((preset) => preset.category))).sort(),
);

export function getSomaticDetailPresetsByCategory(
  category: SomaticDetailPresetCategory | string,
): readonly SomaticDetailPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SOMATIC_DETAIL_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findSomaticDetailPresetById(id: string): SomaticDetailPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SOMATIC_DETAIL_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function compileSomaticDetailPresetAdditions(
  preset: SomaticDetailPreset,
): CompiledSomaticDetailPresetAdditions {
  return {
    descriptionAddition: `Somatic detail context: ${preset.label} may shape body language, breath, posture, touch response, or grounding cues.`,
    personalityAddition: `${preset.label} can surface as embodied emotion, safety response, distress texture, or repair pacing without making the body cue absolute proof.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft somatic detail context.`,
      "Let it guide breath, tension, movement, touch response, safety, and distress only when relevant.",
      "Keep touch consent-aware, preserve {{user}} agency, and avoid using panic, pain, or trauma response as romantic proof.",
    ].join(" "),
  };
}
