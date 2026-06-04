export type HeightStatureCategory =
  | "Towering"
  | "Average"
  | "Petite"
  | "Supernatural";

export interface HeightStaturePreset {
  id: string;
  category: HeightStatureCategory;
  vibe: string;
  archetype: string;
  measurements: string;
  personalityInfluence: readonly string[];
  visuals: readonly string[];
  dynamics: readonly string[];
  systemPromptTags: readonly string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export type HeightSeedPresetCategory =
  | "Archetype"
  | "Height"
  | "Numerical Height"
  | "Height Build"
  | "Romance Hook"
  | "Gate"
  | "Dialogue Seed"
  | "High-Value Seed";

export interface HeightSeedPreset {
  id: string;
  category: HeightSeedPresetCategory;
  label: string;
  value: string;
  triggerKeys: readonly string[];
  guidance: string;
  systemPromptTags: readonly string[];
}

export interface CompiledHeightSeedPresetAdditions {
  backgroundAddition: string;
  personalityAddition: string;
  systemPromptAddition: string;
}

export const HEIGHT_STATURE_PRESETS = Object.freeze([
  {
    id: "height_tower_lofty_giant",
    category: "Towering",
    vibe: "The Imposing Mountain",
    archetype: "The Unyielding Wall / Gentle Giant",
    measurements: "6'4\" - 6'8\"+ (193cm - 203cm+)",
    personalityInfluence: ["Protective", "Calm", "Hyper-Aware of Space", "Deliberate"],
    visuals: ["Broad shoulders", "Blocking out light", "Looking down to talk", "Bending through doorways"],
    dynamics: ["Height Difference Trope", "Looming Protection", "Pocket-sized Partner"],
    systemPromptTags: ["physically dominant descriptions", "spatial crowding", "low rumbling voice tones", "careful physical handling"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-zinc-800", accentColor: "text-amber-500" },
  },
  {
    id: "height_tower_statuesque",
    category: "Towering",
    vibe: "The Statuesque Amazon",
    archetype: "The Regal Empress / Warrior Queen",
    measurements: "5'11\" - 6'2\" (180cm - 188cm)",
    personalityInfluence: ["Commanding", "Proud", "Confident", "Unapologetic"],
    visuals: ["Endless legs", "Perfect posture", "High heels for emphasis", "Striking downward gaze"],
    dynamics: ["Femme Dominant", "Reversed Height Trope", "Equal footing combat"],
    systemPromptTags: ["regal presence", "intimidating high-angle eye contact", "fluid athletic movement", "unyielding spine"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-emerald-950", accentColor: "text-emerald-400" },
  },
  {
    id: "height_avg_perfect_blend",
    category: "Average",
    vibe: "The Perfectly Proportioned",
    archetype: "The Everyman / Standard Anchor",
    measurements: "5'7\" - 5'10\" (170cm - 178cm)",
    personalityInfluence: ["Adaptable", "Unassuming", "Agile", "Grounded"],
    visuals: ["Balanced build", "Eye-to-eye contact with most", "Effortless blending into crowds"],
    dynamics: ["Symmetrical Dancing", "Face-to-Face Banter", "Easy Mirroring"],
    systemPromptTags: ["neutral spatial orientation", "level gaze line", "seamless physical synchronization"],
    tailwindTheme: { fromColor: "from-neutral-900", toColor: "to-slate-900", accentColor: "text-sky-400" },
  },
  {
    id: "height_petite_pocket_dynamo",
    category: "Petite",
    vibe: "The Pocket Rocket",
    archetype: "The Feisty Underdog / Sparkplug",
    measurements: "4'11\" - 5'2\" (150cm - 157cm)",
    personalityInfluence: ["Fierce", "Defiant", "Energetic", "Compensating via Attitude"],
    visuals: ["Looking up through eyelashes", "Standing on tiptoes", "Fast-paced strides", "Expressive hand gestures"],
    dynamics: ["Grumpy Giant x Feisty Petite", "Easily Picked Up", "Underestimated Strength"],
    systemPromptTags: ["sharp upward-angled gaze", "rapid movements", "physical lifting reactions", "indignant spatial reactions"],
    tailwindTheme: { fromColor: "from-rose-950", toColor: "to-neutral-900", accentColor: "text-rose-400" },
  },
  {
    id: "height_petite_fragile_porcelain",
    category: "Petite",
    vibe: "The Delicate Doll",
    archetype: "The Fragile Waif / Protected Heart",
    measurements: "5'0\" - 5'3\" (152cm - 160cm)",
    personalityInfluence: ["Soft", "Quiet", "Vulnerable", "Graceful"],
    visuals: ["Dainty bone structure", "Swallowed by oversized clothes", "Quiet footsteps", "Soft seating footprint"],
    dynamics: ["Overprotective Guardian", "Hurt/Comfort Shelter", "Gentle Embraces"],
    systemPromptTags: ["fragile descriptions", "nestling into safe spaces", "sheltered physical posturing", "feathery touches"],
    tailwindTheme: { fromColor: "from-amber-950", toColor: "to-stone-900", accentColor: "text-yellow-300" },
  },
  {
    id: "height_super_eldritch_shift",
    category: "Supernatural",
    vibe: "The Fluid Abyss",
    archetype: "The Eldritch Entity / Shapeshifter",
    measurements: "Variable (5'5\" - 9'0\"+ / 165cm - 274cm+)",
    personalityInfluence: ["Uncanny", "Detached", "Mocking", "Overwhelming"],
    visuals: ["Unnatural limb elongation", "Shadows stretching further than physics allow", "Looming ceiling contact"],
    dynamics: ["Human x Monster Scale", "Terrifying Intimacy", "Bending Reality"],
    systemPromptTags: ["impossible skeletal architecture", "looming shadows", "unsettling shifts in posture", "claustrophobic presence"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-black", accentColor: "text-fuchsia-500" },
  },
] satisfies readonly HeightStaturePreset[]);

const HEIGHT_ARCHETYPE_PRESET_VALUES = [
  "Very Short",
  "Short",
  "Below Average",
  "Average Height",
  "Above Average",
  "Tall",
  "Very Tall",
  "Towering",
  "Petite",
  "Compact",
  "Long-Limbed",
  "Statuesque",
  "Lanky",
  "Broad and Tall",
  "Small but Commanding",
  "Tall but Gentle",
  "Short King",
  "Tiny Powerhouse",
  "Model-Tall",
  "Inhumanly Tall",
] as const;

const HEIGHT_SEED_VALUES = [
  "very_short",
  "short",
  "below_average_height",
  "average_height",
  "above_average_height",
  "tall",
  "very_tall",
  "towering",
  "petite",
  "compact",
  "small_framed",
  "medium_height",
  "long_limbed",
  "leggy",
  "lanky",
  "statuesque",
  "willowy",
  "broad_and_tall",
  "imposing_height",
  "commanding_height",
  "gentle_giant",
  "short_but_intimidating",
  "small_but_commanding",
  "tall_but_soft",
  "height_difference",
  "same_height",
  "noticeably_shorter_than_{{user}}",
  "noticeably_taller_than_{{user}}",
  "slightly_shorter_than_{{user}}",
  "slightly_taller_than_{{user}}",
] as const;

const NUMERICAL_HEIGHT_SEED_VALUES = [
  "under_5ft",
  "5ft_0in_to_5ft_3in",
  "5ft_4in_to_5ft_6in",
  "5ft_7in_to_5ft_9in",
  "5ft_10in_to_6ft_0in",
  "6ft_1in_to_6ft_3in",
  "6ft_4in_to_6ft_6in",
  "over_6ft_6in",
  "under_152cm",
  "152cm_to_160cm",
  "161cm_to_168cm",
  "169cm_to_175cm",
  "176cm_to_183cm",
  "184cm_to_191cm",
  "192cm_to_198cm",
  "over_198cm",
] as const;

const HEIGHT_BUILD_SEED_VALUES = [
  "short_and_slim",
  "short_and_sturdy",
  "short_and_curvy",
  "short_and_muscular",
  "average_and_balanced",
  "average_and_soft",
  "average_and_athletic",
  "tall_and_slender",
  "tall_and_broad",
  "tall_and_muscular",
  "tall_and_willowy",
  "towering_and_imposing",
  "towering_and_gentle",
  "compact_and_powerful",
  "lanky_and_graceful",
  "statuesque_and_elegant",
] as const;

const HEIGHT_ROMANCE_HOOK_VALUES = [
  "height_difference_romance",
  "forehead_kiss_height_difference",
  "reaches_high_shelf_for_{{user}}",
  "{{user}}_fixes_their_collar",
  "stands_on_tiptoe",
  "leans_down_to_listen",
  "tilts_chin_up",
  "protective_shadow",
  "small_body_big_presence",
  "tall_one_gets_soft",
  "short_one_gets_protective",
  "same_height_eye_contact",
  "dancing_height_difference",
  "sharing_clothes_fit_difference",
  "too_tall_for_doorways",
  "sits_so_{{user}}_can_reach",
  "height_teasing",
  "height_insecurity_comfort",
  "looks_up_without_fear",
  "looks_down_with_tenderness",
] as const;

const HEIGHT_GATE_VALUES = [
  "first_height_notice_gate",
  "first_height_teasing_gate",
  "first_reaches_for_{{user}}_gate",
  "first_leans_down_gate",
  "first_tiptoe_gate",
  "first_forehead_kiss_gate",
  "first_same_height_eye_contact_gate",
  "first_protective_shadow_gate",
  "first_clothing_fit_gate",
  "first_height_insecurity_gate",
  "height_difference_intimacy_gate",
  "small_but_commanding_gate",
  "gentle_giant_softness_gate",
] as const;

const HEIGHT_DIALOGUE_SEED_VALUES = [
  "You keep looking up at me like you are deciding whether to complain.",
  "You are difficult to miss.",
  "I can reach that.",
  "I know. I wanted an excuse to stand close.",
  "Stop leaning down like that.",
  "Then stop making me want to hear you better.",
  "You are not small.",
  "I am literally small.",
  "No. You take up space where it matters.",
  "Do you always hit your head on doorframes?",
  "Only when I am distracted.",
  "By someone who keeps smiling at the wrong moment.",
  "You.",
] as const;

const HIGH_VALUE_HEIGHT_SEED_VALUES = [
  "short",
  "average_height",
  "tall",
  "very_tall",
  "towering",
  "petite",
  "long_limbed",
  "statuesque",
  "gentle_giant",
  "small_but_commanding",
  "noticeably_taller_than_{{user}}",
  "noticeably_shorter_than_{{user}}",
  "height_difference",
  "same_height",
  "forehead_kiss_height_difference",
  "reaches_high_shelf_for_{{user}}",
  "leans_down_to_listen",
  "stands_on_tiptoe",
  "height_difference_intimacy_gate",
  "gentle_giant_softness_gate",
] as const;

const HEIGHT_SEED_GROUPS = [
  ["Archetype", HEIGHT_ARCHETYPE_PRESET_VALUES],
  ["Height", HEIGHT_SEED_VALUES],
  ["Numerical Height", NUMERICAL_HEIGHT_SEED_VALUES],
  ["Height Build", HEIGHT_BUILD_SEED_VALUES],
  ["Romance Hook", HEIGHT_ROMANCE_HOOK_VALUES],
  ["Gate", HEIGHT_GATE_VALUES],
  ["Dialogue Seed", HEIGHT_DIALOGUE_SEED_VALUES],
  ["High-Value Seed", HIGH_VALUE_HEIGHT_SEED_VALUES],
] as const satisfies readonly [HeightSeedPresetCategory, readonly string[]][];

function toHeightSeedId(category: HeightSeedPresetCategory, value: string): string {
  const categoryKey = category.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const valueKey = value
    .replace(/\{\{user\}\}/g, "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `height_${categoryKey}_${valueKey}`;
}

function toHeightSeedLabel(value: string): string {
  if (value.includes("{{user}}")) {
    return value
      .replace(/\{\{user\}\}/g, "{{user}}")
      .split("_")
      .join(" ");
  }

  return value.includes("_")
    ? value.split("_").join(" ")
    : value;
}

function buildHeightSeedPreset(
  category: HeightSeedPresetCategory,
  value: string,
): HeightSeedPreset {
  const label = toHeightSeedLabel(value);
  const categoryKey = category.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  return {
    id: toHeightSeedId(category, value),
    category,
    label,
    value,
    triggerKeys: [value],
    guidance: `Use ${label} as optional height and stature texture when it supports the scene, body language, or relationship dynamic.`,
    systemPromptTags: [
      "height and stature texture",
      `${categoryKey} seed`,
      "spatial body language",
    ],
  };
}

export const HEIGHT_SEED_PRESETS = Object.freeze(
  HEIGHT_SEED_GROUPS.flatMap(([category, values]) =>
    values.map((value) => buildHeightSeedPreset(category, value)),
  ),
);

export const HEIGHT_STATURE_CATEGORIES = Object.freeze(
  Array.from(new Set(HEIGHT_STATURE_PRESETS.map((preset) => preset.category))).sort(),
);

export const HEIGHT_SEED_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(HEIGHT_SEED_PRESETS.map((preset) => preset.category))).sort(),
);

export function getHeightStaturePresetsByCategory(
  category: HeightStatureCategory | string,
): readonly HeightStaturePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return HEIGHT_STATURE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findHeightStaturePresetById(id: string): HeightStaturePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return HEIGHT_STATURE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function getHeightSeedPresetsByCategory(
  category: HeightSeedPresetCategory | string,
): readonly HeightSeedPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return HEIGHT_SEED_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findHeightSeedPresetById(id: string): HeightSeedPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return HEIGHT_SEED_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}

export function compileHeightSeedPresetAdditions(
  preset: HeightSeedPreset,
): CompiledHeightSeedPresetAdditions {
  const label = preset.label;

  return {
    backgroundAddition: `${label} may inform the character's physical presence, how they occupy rooms, and how others tend to notice or misread their stature.`,
    personalityAddition: `${label} can surface as body-language guidance, confidence, insecurity, tenderness, or spatial awareness when relevant.`,
    systemPromptAddition: [
      `Treat ${label} as optional height/stature guidance.`,
      "Let it shape blocking, posture, reach, eye line, clothing fit, and romantic proximity without reducing the character to body size.",
      "Preserve consent, boundaries, and {{user}} agency in any height-difference or touch-adjacent moment.",
    ].join(" "),
  };
}
