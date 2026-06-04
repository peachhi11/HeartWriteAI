export type SensoryPerceptionPresetCategory =
  | "Archetype"
  | "Sensory Perception"
  | "Sensory Mode"
  | "Sensory Strength"
  | "Sensory Weakness"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface SensoryPerceptionPreset {
  id: string;
  category: SensoryPerceptionPresetCategory;
  label: string;
  value: string;
  triggerKeys: string[];
  guidance: string;
  systemPromptTags: string[];
}

export interface CompiledSensoryPerceptionPresetAdditions {
  descriptionAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

interface SensoryPerceptionSeedGroup {
  category: SensoryPerceptionPresetCategory;
  prefix: string;
  guidance: string;
  values: string[];
}

const SENSORY_PERCEPTION_GUIDANCE =
  "Use this as optional sensory perception texture. Sensory cues may shape noticing, comfort, overload, attraction, grounding, and environmental response without turning perception into certainty or removing {{user}} agency.";

const SENSORY_PERCEPTION_SEED_GROUPS = Object.freeze([
  {
    category: "Archetype",
    prefix: "sensory_perception_archetype",
    guidance: SENSORY_PERCEPTION_GUIDANCE,
    values: [
      "The Hyper-Aware Observer",
      "The Touch-Sensitive Romantic",
      "The Scent-Driven Tracker",
      "The Sound-Sensitive Listener",
      "The Visual Detail Noticer",
      "The Taste-Memory Person",
      "The Texture-Avoidant One",
      "The Sensory Seeker",
      "The Easily Overstimulated One",
      "The Calm Sensory Anchor",
      "The Predator-Sense Type",
      "The Artist With Sensory Memory",
      "The Medic Who Notices Everything",
      "The Shifter With Scent Instincts",
      "The Android Sensor Suite",
      "The Empathic Perceiver",
      "The Trauma-Hypervigilant Survivor",
      "The Comforted-by-Routine Type",
      "The World Feels Too Loud Type",
      "The One Who Knows {{user}} By Small Signals",
    ],
  },
  {
    category: "Sensory Perception",
    prefix: "sensory_perception_seed",
    guidance:
      "Use this as sensory perception texture. It should suggest what the character notices, avoids, seeks, or uses for grounding without making their inference automatically correct.",
    values: [
      "sensory perception",
      "heightened senses",
      "dulled senses",
      "hyperaware",
      "sensory sensitive",
      "sensory seeking",
      "sensory avoidant",
      "easily overstimulated",
      "calmed by soft sensory input",
      "visual detail noticing",
      "sound sensitivity",
      "scent sensitivity",
      "touch sensitivity",
      "taste sensitivity",
      "texture sensitivity",
      "temperature sensitivity",
      "light sensitivity",
      "crowd sensitivity",
      "pain sensitivity",
      "pressure sensitivity",
      "notices small changes",
      "notices {{user}}'s scent",
      "notices {{user}}'s voice shift",
      "notices {{user}}'s footsteps",
      "notices {{user}}'s mood by posture",
      "notices changed perfume",
      "notices fabric texture",
      "notices room temperature",
      "notices lighting changes",
      "notices heartbeat",
      "notices breathing pattern",
      "notices microexpressions",
      "notices tension in room",
      "notices danger before others",
      "notices when {{user}} is uncomfortable",
      "comforted by warmth",
      "comforted by weighted blankets",
      "comforted by low light",
      "comforted by rain sounds",
      "comforted by music",
      "comforted by familiar scent",
      "comforted by soft fabric",
      "comforted by hand pressure",
      "comforted by clean spaces",
      "comforted by predictable routine",
      "overwhelmed by noise",
      "overwhelmed by bright lights",
      "overwhelmed by strong smells",
      "overwhelmed by crowds",
      "overwhelmed by touch",
      "overwhelmed by chaos",
      "overwhelmed by heat",
      "overwhelmed by scratchy clothes",
      "overwhelmed by conflicting sounds",
      "overwhelmed by too many people",
    ],
  },
  {
    category: "Sensory Mode",
    prefix: "sensory_perception_mode",
    guidance:
      "Use this as a sensory mode lane. Modes should guide which senses are narratively relevant without overwhelming every scene with sensory detail.",
    values: [
      "visual perception",
      "auditory perception",
      "olfactory perception",
      "tactile perception",
      "gustatory perception",
      "proprioception",
      "vestibular sense",
      "interoception",
      "pain perception",
      "temperature perception",
      "pressure perception",
      "vibration perception",
      "magic sense",
      "danger sense",
      "empathy sense",
      "aura sense",
      "predator sense",
      "machine sensor input",
      "alien sensory field",
      "nonhuman sensory map",
    ],
  },
  {
    category: "Sensory Strength",
    prefix: "sensory_perception_strength",
    guidance:
      "Use this as a sensory strength. Strengths should create useful perception, tenderness, skill, or tension while leaving room for mistakes and context.",
    values: [
      "sharp vision",
      "night vision",
      "colour sensitive",
      "motion sensitive",
      "excellent hearing",
      "hears heartbeat",
      "recognises footsteps",
      "sensitive nose",
      "tracks by scent",
      "taste memory",
      "sensitive skin",
      "reads touch pressure",
      "excellent balance",
      "body awareness",
      "pain tolerance",
      "detects temperature shifts",
      "detects vibrations",
      "detects magic residue",
      "detects lies by body cues",
      "detects {{user}}'s distress",
    ],
  },
  {
    category: "Sensory Weakness",
    prefix: "sensory_perception_weakness",
    guidance:
      "Use this as a sensory weakness or overload cue. Weaknesses should invite accommodation, consent-aware care, recovery, boundaries, and environmental adjustment.",
    values: [
      "sensory overload",
      "noise overload",
      "light overload",
      "touch overload",
      "scent overload",
      "crowd overload",
      "texture aversion",
      "bright light headaches",
      "loud noise flinch",
      "unexpected touch startle",
      "strong smell nausea",
      "pain underreaction",
      "pain overreaction",
      "poor interoception",
      "misses hunger cues",
      "misses fatigue cues",
      "dizziness prone",
      "motion sickness",
      "sensory shutdown",
      "needs quiet to recover",
    ],
  },
  {
    category: "Romance Hook",
    prefix: "sensory_perception_romance",
    guidance:
      "Use this as romance-facing sensory texture. Hooks should emerge through consent-aware noticing, care, grounding, and sensory safety rather than scripted intimacy.",
    values: [
      "recognises {{user}} by footsteps",
      "recognises {{user}} by scent",
      "knows {{user}} is upset by breathing",
      "notices {{user}} is cold first",
      "adjusts lighting for {{user}}",
      "offers soft clothes",
      "shares headphones",
      "uses voice to ground {{user}}",
      "weighted blanket comfort",
      "hand pressure reassurance",
      "scent on borrowed clothes",
      "quiet room after crowd",
      "rain sound cuddle",
      "sensory overload comfort",
      "touch permission scene",
      "forehead touch grounding",
      "heartbeat as reassurance",
      "{{user}} becomes safe sensory anchor",
      "known by small signals",
      "love as nervous system safety",
    ],
  },
  {
    category: "Gate",
    prefix: "sensory_perception_gate",
    guidance:
      "Use this as a sensory perception gate. Gates should mark observable sensory moments, overload recovery, or safety signals without forcing vulnerability.",
    values: [
      "first sensory notice gate",
      "first overload gate",
      "first grounding gate",
      "first scent recognition gate",
      "first voice recognition gate",
      "first touch permission gate",
      "first {{user}} adjusts environment gate",
      "first character adjusts environment gate",
      "first safe quiet room gate",
      "first heartbeat reassurance gate",
      "first known by senses gate",
      "first sensory anchor gate",
      "first overload recovery gate",
      "nervous system safety gate",
      "love in small signals route",
    ],
  },
  {
    category: "Dialogue Seed",
    prefix: "sensory_perception_dialogue",
    guidance:
      "Use this as optional dialogue inspiration. Dialogue should keep sensory care specific, human, and consent-aware without requiring verbatim reuse.",
    values: [
      "You changed your perfume.",
      "You noticed?",
      "I notice you.",
      "The room is too loud.",
      "Then we leave.",
      "Just like that?",
      "Just like that, no argument.",
      "How did you know I was upset?",
      "Your breathing changed.",
      "Can I touch you?",
      "Ask me again when I stop shaking.",
      "I will.",
      "Your voice helps.",
      "Then listen to me. Breathe here.",
      "You knew it was me by my footsteps?",
      "I know the sound of you coming back.",
      "You make the world feel less sharp.",
      "Then stay near me.",
      "I was hoping you would ask.",
    ],
  },
  {
    category: "High-Value Seed",
    prefix: "sensory_perception_high_value",
    guidance:
      "Use this as a high-value sensory perception seed when the character needs strong, readable sensory texture for comfort, attraction, overload, or grounding.",
    values: [
      "heightened senses",
      "hyperaware",
      "sensory sensitive",
      "sensory overload",
      "scent sensitivity",
      "touch sensitivity",
      "sound sensitivity",
      "notices small changes",
      "notices {{user}}'s scent",
      "notices {{user}}'s voice shift",
      "recognises {{user}} by footsteps",
      "comforted by familiar scent",
      "overwhelmed by noise",
      "touch permission scene",
      "sensory overload comfort",
      "{{user}} becomes safe sensory anchor",
      "known by small signals",
      "nervous system safety gate",
      "love as nervous system safety",
      "love in small signals route",
    ],
  },
] as const satisfies readonly SensoryPerceptionSeedGroup[]);

function toSensoryPerceptionPresetId(prefix: string, value: string): string {
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${prefix}_${valueKey}`;
}

function buildSensoryPerceptionPreset(
  group: SensoryPerceptionSeedGroup,
  value: string,
): SensoryPerceptionPreset {
  const categoryKey = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toSensoryPerceptionPresetId(group.prefix, value),
    category: group.category,
    label: value,
    value,
    triggerKeys: [value],
    guidance: group.guidance,
    systemPromptTags: [
      "sensory perception texture",
      `${categoryKey} seed`,
      "observable cues and grounding",
    ],
  };
}

export const SENSORY_PERCEPTION_PRESETS = Object.freeze(
  SENSORY_PERCEPTION_SEED_GROUPS.flatMap((group) =>
    group.values.map((value) => buildSensoryPerceptionPreset(group, value)),
  ),
);

export const SENSORY_PERCEPTION_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SENSORY_PERCEPTION_PRESETS.map((preset) => preset.category))).sort(),
);

export function getSensoryPerceptionPresetsByCategory(
  category: SensoryPerceptionPresetCategory | string,
): readonly SensoryPerceptionPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SENSORY_PERCEPTION_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findSensoryPerceptionPresetById(
  id: string,
): SensoryPerceptionPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SENSORY_PERCEPTION_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalizedId,
  );
}

export function compileSensoryPerceptionPresetAdditions(
  preset: SensoryPerceptionPreset,
): CompiledSensoryPerceptionPresetAdditions {
  return {
    descriptionAddition: `Sensory perception context: ${preset.label} may shape what the character notices, seeks, avoids, or uses for grounding.`,
    personalityAddition: `${preset.label} can surface as sensory preference, comfort ritual, overload response, or careful noticing without making every inference certain.`,
    systemPromptAddition: [
      `Treat ${preset.label} as soft sensory perception context.`,
      "Let it guide sensory detail, environmental response, comfort, overload, and attraction only when relevant.",
      "Keep touch and care consent-aware, preserve {{user}} agency, and avoid treating sensory distress as romantic proof.",
    ].join(" "),
  };
}
