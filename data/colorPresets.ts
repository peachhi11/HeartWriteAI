export type ColorPresetCategory =
  | "Natural Warm"
  | "Natural Cool"
  | "Supernatural/Eldritch"
  | "Sci-Fi Neon";

export type ColorPresetType = "Eyes" | "Hair";

export interface ColorPreset {
  id: string;
  category: ColorPresetCategory;
  type: ColorPresetType;
  vibe: string;
  colorName: string;
  hexValue: string;
  description: string;
  systemPromptTags: readonly string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export const COLOR_PRESETS = Object.freeze([
  {
    id: "eye_nat_molten_amber",
    category: "Natural Warm",
    type: "Eyes",
    vibe: "The Golden Retriever / Lycan Warmth",
    colorName: "Molten Amber",
    hexValue: "#D97706",
    description: "Rich, light-catching honey tones that radiate warmth, vulnerability, or hidden primal instincts.",
    systemPromptTags: ["eyes glowing when catching light", "warm liquid gaze", "crinkling with genuine affection"],
    tailwindTheme: { fromColor: "from-amber-950", toColor: "to-stone-900", accentColor: "text-amber-500" },
  },
  {
    id: "eye_nat_obsidian_ink",
    category: "Natural Cool",
    type: "Eyes",
    vibe: "The Mafia Don / Cold Aristocrat Noir",
    colorName: "Obsidian Ink",
    hexValue: "#171717",
    description: "Deep, completely dark irises where pupils blend into the irises, creating an unreadable, intense void.",
    systemPromptTags: ["impenetrable gaze", "dilating slightly under shadow", "unblinking predatory tracking"],
    tailwindTheme: { fromColor: "from-neutral-950", toColor: "to-neutral-800", accentColor: "text-neutral-400" },
  },
  {
    id: "eye_sup_crimson_abyss",
    category: "Supernatural/Eldritch",
    type: "Eyes",
    vibe: "The Possessive Vampire / Demon Prince",
    colorName: "Crimson Abyss",
    hexValue: "#DC2626",
    description: "Vibrant, blood-soaked red irises that seem to pulse faintly with dark magic or hunger.",
    systemPromptTags: ["irises bleeding red when angry", "hypnotic flashing pupils", "predatory nocturnal gleam"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-black", accentColor: "text-red-500" },
  },
  {
    id: "eye_scifi_cyber_cyan",
    category: "Sci-Fi Neon",
    type: "Eyes",
    vibe: "The Cyborg Protector / Netrunner",
    colorName: "Glitch Cyan",
    hexValue: "#06B6D4",
    description: "Bioluminescent, synthetic electric blue that projects digital HUD rings or processing activity.",
    systemPromptTags: ["optics flickering with data stream", "neon ring constriction", "cold analytical focus"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-400" },
  },
  {
    id: "hair_nat_spun_gold",
    category: "Natural Warm",
    type: "Hair",
    vibe: "The Sunshine Optimist / Fantasy Heir",
    colorName: "Spun Gold",
    hexValue: "#F59E0B",
    description: "Bright, rich blonde with honey undertones that catches the light easily, reflecting a vibrant energy.",
    systemPromptTags: ["messy sun-streaked curls", "strands catching the breeze", "soft textures frame the face"],
    tailwindTheme: { fromColor: "from-yellow-600", toColor: "to-stone-900", accentColor: "text-yellow-400" },
  },
  {
    id: "hair_nat_raven_wing",
    category: "Natural Cool",
    type: "Hair",
    vibe: "The Grumpy Billionaire / Silent Bodyguard",
    colorName: "Raven Black",
    hexValue: "#0A0A0A",
    description: "Pitch-black strands with a cold, blue-black sheen that absorbs light entirely. Sleek or sharp textures.",
    systemPromptTags: ["slicked-back immaculate styling", "falling into the eyes when dishevelled", "stark contrast against skin"],
    tailwindTheme: { fromColor: "from-zinc-950", toColor: "to-slate-900", accentColor: "text-slate-400" },
  },
  {
    id: "hair_sup_starlight_silver",
    category: "Supernatural/Eldritch",
    type: "Hair",
    vibe: "The Elven Consort / Ancient Vampire",
    colorName: "Starlight Silver",
    hexValue: "#E2E8F0",
    description: "Ethereal, pure metallic silver hair that appears to shimmer with an otherworldly or lunar glow.",
    systemPromptTags: ["shimmering silk texture", "drifting weightlessly", "glowing softly under the moon"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-neutral-950", accentColor: "text-slate-200" },
  },
  {
    id: "hair_scifi_neon_fuchsia",
    category: "Sci-Fi Neon",
    type: "Hair",
    vibe: "The Rebel Netrunner / Wasteland Maverick",
    colorName: "Chroma Fuchsia",
    hexValue: "#D946EF",
    description: "Vivid, chemically treated neon fuchsia with dark, shaved roots and asymmetric jagged edges.",
    systemPromptTags: ["asymmetrical undercut styling", "glowing under UV blacklight", "sharp synthetic texture"],
    tailwindTheme: { fromColor: "from-fuchsia-950", toColor: "to-neutral-950", accentColor: "text-fuchsia-400" },
  },
] satisfies readonly ColorPreset[]);

export const COLOR_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(COLOR_PRESETS.map((preset) => preset.category))).sort(),
);

export function getColorPresetsByType(type: ColorPresetType | string): readonly ColorPreset[] {
  const normalizedType = type.trim().toLowerCase();
  return COLOR_PRESETS.filter((preset) => preset.type.toLowerCase() === normalizedType);
}

export function getColorPresetsByCategory(
  category: ColorPresetCategory | string,
): readonly ColorPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return COLOR_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findColorPresetById(id: string): ColorPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return COLOR_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}
