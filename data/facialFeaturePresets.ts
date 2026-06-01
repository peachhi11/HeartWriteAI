export type FacialFeatureCategory =
  | "Sharp & Chiseled"
  | "Soft & Ethereal"
  | "Rugged & Weathered"
  | "Expressive & Intense";

export interface FacialFeaturePreset {
  id: string;
  category: FacialFeatureCategory;
  vibe: string;
  archetype: string;
  description: string;
  keyFeatures: readonly string[];
  restingExpression: string;
  systemPromptTags: readonly string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export const FACIAL_FEATURE_PRESETS = Object.freeze([
  {
    id: "face_sharp_aristocrat",
    category: "Sharp & Chiseled",
    vibe: "The Cold Aristocrat",
    archetype: "The Ice King / Corporate Heir",
    description: "Angular, symmetrical, and severe facial geometry that projects high status and an emotional void.",
    keyFeatures: ["Razor-sharp jawline", "High, prominent cheekbones", "Aquiline nose", "Thin, bloodless lips"],
    restingExpression: "An indifferent, unblinking glare that looks down on others.",
    systemPromptTags: ["micro-expressions of disdain", "jaw clenching", "sharp facial angles", "calculated eye contact"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-slate-800", accentColor: "text-slate-300" },
  },
  {
    id: "face_sharp_predatory",
    category: "Sharp & Chiseled",
    vibe: "The Predatory Smirk",
    archetype: "The Mafia Don / Dangerous Vampire",
    description: "Striking and sharp facial features designed to captivate while triggering fight-or-flight instincts.",
    keyFeatures: ["Piercing, hooded eyes", "Sharp canine teeth", "Slightly asymmetric jaw", "Sleek, groomed eyebrows"],
    restingExpression: "A knowing, dangerous smirk tugging at one corner of the mouth.",
    systemPromptTags: ["dilating pupils", "predatory tracking with eyes", "sinister smiles", "shadowed jawlines"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "face_soft_porcelain",
    category: "Soft & Ethereal",
    vibe: "The Porcelain Doll",
    archetype: "The Fragile Waif / Elven Consort",
    description: "Soft, smooth, and delicate features that project innocence, youth, or otherworldly elegance.",
    keyFeatures: ["Doe-like wide eyes", "Button nose", "Plump, rosebud lips", "Flawless, pale complexion"],
    restingExpression: "A wide-eyed, curious, or slightly spaced-out look.",
    systemPromptTags: ["rapid blinking", "soft flushing/blushing cheek descriptions", "parted lips", "innocent expressions"],
    tailwindTheme: { fromColor: "from-rose-950", toColor: "to-stone-900", accentColor: "text-rose-400" },
  },
  {
    id: "face_soft_boy_next_door",
    category: "Soft & Ethereal",
    vibe: "The Open Book",
    archetype: "The Golden Retriever / Childhood Friend",
    description: "Disarming, warm, and highly approachable facial features that immediately put people at ease.",
    keyFeatures: ["Soft, rounded jaw", "Crinkling laugh lines around the eyes", "Thick, expressive eyebrows", "Warm, inviting smile"],
    restingExpression: "A gentle, half-smile that radiates warmth and approachability.",
    systemPromptTags: ["genuine crinkling eyes", "easy open-mouthed laughter", "soft expressive eyebrow shifts"],
    tailwindTheme: { fromColor: "from-amber-900", toColor: "to-stone-900", accentColor: "text-amber-400" },
  },
  {
    id: "face_rug_scarred_veteran",
    category: "Rugged & Weathered",
    vibe: "The Battle-Hardened Mask",
    archetype: "The Grizzled Mercenary / Lone Outlaw",
    description: "A face that tells a story of survival, violence, and long exposure to the elements.",
    keyFeatures: ["Jagged scar slicing through one eyebrow", "Heavy stubble / rough beard", "Crooked, once-broken nose", "Deep-set, hollow eyes"],
    restingExpression: "A flat, unreadable, and stern grimace.",
    systemPromptTags: ["twitching scar tissue", "narrowing deep-set eyes", "grinding teeth", "stony expressions"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-zinc-800", accentColor: "text-stone-400" },
  },
  {
    id: "face_rug_sun_kissed",
    category: "Rugged & Weathered",
    vibe: "The Weathered Maverick",
    archetype: "The Highlander / Wasteland Scrapper",
    description: "Leathery, sun-baked, and ruggedly handsome facial features forged by an outdoor lifestyle.",
    keyFeatures: ["Prominent squint lines", "Sun-browned skin or dense freckles", "Strong, blunt jawline", "Wind-chapped lips"],
    restingExpression: "A squinted gaze, as if staring directly into the horizon.",
    systemPromptTags: ["squinting against light", "smirking through chapped lips", "flexing blunt jaw muscles"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-950", accentColor: "text-orange-400" },
  },
  {
    id: "face_int_manic_scholar",
    category: "Expressive & Intense",
    vibe: "The Unhinged Genius",
    archetype: "The Eldritch Scholar / Twitchy Hacker",
    description: "A face driven by hyper-focus and anxiety, with features that shift rapidly based on internal thoughts.",
    keyFeatures: ["Dark, heavy bruised eyebags", "Feverish, wide eyes", "Bitten, bleeding lips", "Twitchy facial muscles"],
    restingExpression: "A tense, hyper-alert frown accompanied by a darting gaze.",
    systemPromptTags: ["frequent lip-biting", "twitching under-eye muscles", "wide unblinking stares", "manic smiling"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-black", accentColor: "text-fuchsia-400" },
  },
  {
    id: "face_int_sarcastic_wit",
    category: "Expressive & Intense",
    vibe: "The Mocking Rogue",
    archetype: "The Academic Rival / Tavern Smuggler",
    description: "An incredibly expressive face that weaponises facial micro-movements for sarcasm and teasing.",
    keyFeatures: ["Perpetually arched single eyebrow", "Dimple on only one cheek", "Expressive, mocking eyes", "Sharp, talking lips"],
    restingExpression: "An asymmetrical look of amused skepticism.",
    systemPromptTags: ["cocking a single eyebrow", "rolling eyes subtly", "half-dimpled smirking", "biting the inside of the cheek"],
    tailwindTheme: { fromColor: "from-cyan-950", toColor: "to-slate-900", accentColor: "text-cyan-400" },
  },
] satisfies readonly FacialFeaturePreset[]);

export const FACIAL_FEATURE_CATEGORIES = Object.freeze(
  Array.from(new Set(FACIAL_FEATURE_PRESETS.map((preset) => preset.category))).sort(),
);

export function getFacialFeaturePresetsByCategory(
  category: FacialFeatureCategory | string,
): readonly FacialFeaturePreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return FACIAL_FEATURE_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findFacialFeaturePresetById(id: string): FacialFeaturePreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return FACIAL_FEATURE_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}
