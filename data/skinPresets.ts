export type SkinPresetCategory =
  | "Human Warm"
  | "Human Cool"
  | "Supernatural/Undead"
  | "Sci-Fi/Alien";

export interface SkinPreset {
  id: string;
  category: SkinPresetCategory;
  vibe: string;
  toneName: string;
  hexValue: string;
  textureDescription: string;
  keyMarkings: readonly string[];
  systemPromptTags: readonly string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export const SKIN_PRESETS = Object.freeze([
  {
    id: "skin_warm_rich_espresso",
    category: "Human Warm",
    vibe: "The Crimson Boxer / Desert Maverick",
    toneName: "Rich Espresso",
    hexValue: "#3B2314",
    textureDescription: "Smooth, deep obsidian-brown complexion with warm golden undertones that catches overhead lighting beautifully.",
    keyMarkings: ["Pale hypertrophic scars on knuckles", "Sharp tan lines", "Faint freckles across high cheekbones"],
    systemPromptTags: ["glistening under physical exertion", "golden undertones in low light", "smooth flawless skin texture"],
    tailwindTheme: { fromColor: "from-amber-950", toColor: "to-neutral-950", accentColor: "text-amber-500" },
  },
  {
    id: "skin_warm_sunkissed_honey",
    category: "Human Warm",
    vibe: "The Sunshine Optimist / Wild West Outlaw",
    toneName: "Sunkissed Honey",
    hexValue: "#D4A373",
    textureDescription: "Warm, golden-bronze complexion showing extensive time spent outdoors under the open sun.",
    keyMarkings: ["Dense scattering of sun freckles across the nose", "Slightly wind-chapped cheeks", "Faint laugh lines"],
    systemPromptTags: ["radiating natural warmth", "flushing easily with golden-red hues", "freckled bridge of the nose"],
    tailwindTheme: { fromColor: "from-amber-800", toColor: "to-stone-900", accentColor: "text-amber-300" },
  },
  {
    id: "skin_cool_alabaster_porcelain",
    category: "Human Cool",
    vibe: "The Cold Aristocrat / Victorian Gothic",
    toneName: "Alabaster Porcelain",
    hexValue: "#F7EBE1",
    textureDescription: "Strikingly pale, translucent, and smooth complexion with cool pinkish-blue undertones.",
    keyMarkings: ["Faint, visible blue veins at the temples and wrists", "No blemishes", "High contrast against dark clothing"],
    systemPromptTags: ["pale skin flushing starkly red when flustered", "cool porcelain texture", "translucent under direct candle light"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-stone-950", accentColor: "text-slate-200" },
  },
  {
    id: "skin_cool_weathered_olive",
    category: "Human Cool",
    vibe: "The Jaded Detective / Quiet Bodyguard",
    toneName: "Weathered Olive",
    hexValue: "#A69076",
    textureDescription: "Muted olive-grey complexion with neutral or cool undertones, bearing the brunt of stress and lack of sleep.",
    keyMarkings: ["Deep bruised shadows under the eyes", "A single distinct jagged scar splitting the left jawline", "Rough stubble"],
    systemPromptTags: ["pale, drained skin tone under neon signs", "rough leathery cheek texture", "shadowed contours around the eyes"],
    tailwindTheme: { fromColor: "from-zinc-800", toColor: "to-slate-950", accentColor: "text-zinc-400" },
  },
  {
    id: "skin_sup_deathly_pallor",
    category: "Supernatural/Undead",
    vibe: "The Bored Vampire / Haunted Medium",
    toneName: "Deathly Pallor",
    hexValue: "#E2E8F0",
    textureDescription: "Unnaturally white, bloodless, and ice-cold skin that looks like carved marble or a corpse.",
    keyMarkings: ["Prominent, dark purple-grey veins crawling up the throat", "Zero natural flush or warmth", "Velvety but freezing to the touch"],
    systemPromptTags: ["skin completely devoid of blood flow", "incapable of blushing", "radiating a physical chill", "marble-hard features"],
    tailwindTheme: { fromColor: "from-purple-950", toColor: "to-neutral-950", accentColor: "text-purple-400" },
  },
  {
    id: "skin_sup_obsidian_drow",
    category: "Supernatural/Undead",
    vibe: "The Dark Elven Consort / Demon Prince",
    toneName: "Ashen Obsidian",
    hexValue: "#1E1E24",
    textureDescription: "Deep, flawless slate-grey to dark purple-black skin that seems to drink in ambient light.",
    keyMarkings: ["Glowing, bioluminescent silver tribal tattoos across the shoulders", "Polished, gem-like sheen under starlight"],
    systemPromptTags: ["skin catching starlight with a faint metallic shimmer", "sharp contrasting white markings", "unearthly dark smoothness"],
    tailwindTheme: { fromColor: "from-neutral-950", toColor: "to-violet-950", accentColor: "text-fuchsia-400" },
  },
  {
    id: "skin_scifi_synth_silicone",
    category: "Sci-Fi/Alien",
    vibe: "The Rogue Android / Cyborg Protector",
    toneName: "Synthetic Pearl",
    hexValue: "#E5E5E5",
    textureDescription: "Hyper-symmetrical, completely flawless medical-grade matte white silicone skin casing.",
    keyMarkings: ["Microscopic laser-etched serial numbers on the side of the neck", "Faint, glowing blue seam lines along the jaw and joints"],
    systemPromptTags: ["completely non-porous skin texture", "synthetic warmth generated only by internal fans", "seams glowing when computing"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-400" },
  },
  {
    id: "skin_scifi_nebula_indigo",
    category: "Sci-Fi/Alien",
    vibe: "The Alien Warlord",
    toneName: "Nebula Indigo",
    hexValue: "#2D1B4E",
    textureDescription: "Vibrant indigo-blue skin peppered with iridescent, deep purple organic plating patterns.",
    keyMarkings: ["Bioluminescent freckles that pulse in response to strong emotions", "Thick protective chitin scales over the collarbones"],
    systemPromptTags: ["skin pigments deepening to royal purple when angry", "glowing freckles matching emotional spikes", "smooth alien hide texture"],
    tailwindTheme: { fromColor: "from-indigo-950", toColor: "to-neutral-950", accentColor: "text-indigo-400" },
  },
] satisfies readonly SkinPreset[]);

export const SKIN_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(SKIN_PRESETS.map((preset) => preset.category))).sort(),
);

export function getSkinPresetsByCategory(category: SkinPresetCategory | string): readonly SkinPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return SKIN_PRESETS.filter((preset) => preset.category.toLowerCase() === normalizedCategory);
}

export function findSkinPresetById(id: string): SkinPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return SKIN_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}
