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

export const HEIGHT_STATURE_CATEGORIES = Object.freeze(
  Array.from(new Set(HEIGHT_STATURE_PRESETS.map((preset) => preset.category))).sort(),
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
