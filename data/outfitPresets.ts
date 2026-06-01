export type OutfitPresetCategory =
  | "High Status / Formal"
  | "Street / Functional"
  | "Period / Fantasy"
  | "Subcultural / Dark";

export interface OutfitPreset {
  id: string;
  category: OutfitPresetCategory;
  vibe: string;
  styleName: string;
  description: string;
  keyGarments: readonly string[];
  accentsAndAccessories: readonly string[];
  systemPromptTags: readonly string[];
  tailwindTheme: {
    fromColor: string;
    toColor: string;
    accentColor: string;
  };
}

export const OUTFIT_PRESETS = Object.freeze([
  {
    id: "outfit_formal_bespoke_power",
    category: "High Status / Formal",
    vibe: "The Grumpy Billionaire / Corporate Suit",
    styleName: "Bespoke Power Tailoring",
    description: "Impeccably sharp, custom-tailored menswear designed to project absolute wealth, control, and authority.",
    keyGarments: ["Three-piece charcoal suit", "Crisp white double-cuff shirt", "Silk tie in deep jewel tones"],
    accentsAndAccessories: ["Solid gold cufflinks", "Engraved Patek Philippe watch", "Polished leather Oxfords"],
    systemPromptTags: ["adjusting tie knots under stress", "straightening cuffs meticulously", "unbuttoning jacket when sitting"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-stone-900", accentColor: "text-amber-500" },
  },
  {
    id: "outfit_formal_regal_couture",
    category: "High Status / Formal",
    vibe: "The Cold Aristocrat / Elven Royalty",
    styleName: "Regal High-Couture",
    description: "Flowing, high-neck structural garments blending historical elegance with striking modern asymmetry.",
    keyGarments: ["High-collared velvet tunic", "Asymmetrical silk cape", "Structured trailing trousers"],
    accentsAndAccessories: ["Silver filigree signet ring", "Obsidian collar clasps", "Embroidered platinum thread hemlines"],
    systemPromptTags: ["cape shifting with fluid movements", "garments rustling softly", "perfect unyielding collar posture"],
    tailwindTheme: { fromColor: "from-violet-950", toColor: "to-slate-900", accentColor: "text-purple-300" },
  },
  {
    id: "outfit_street_techwear",
    category: "Street / Functional",
    vibe: "The Neon Netrunner / Rebel Hacker",
    styleName: "Cyber Techwear",
    description: "Utilitarian, weather-resistant streetwear featuring multi-pocket configurations and straps designed for an urban sprawl.",
    keyGarments: ["Matte black water-resistant windbreaker", "Multi-strap cargo joggers", "Asymmetric drop-shoulder hoodie"],
    accentsAndAccessories: ["Glowing LED collar lining", "Fingerless grip gloves", "High-top tactical sneakers"],
    systemPromptTags: ["shoving hands deep into oversized pockets", "pulling up the hood to obscure the face", "straps shifting with movement"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-cyan-950", accentColor: "text-cyan-400" },
  },
  {
    id: "outfit_street_rugged_scrapper",
    category: "Street / Functional",
    vibe: "The Wild West Outlaw / Wasteland Veteran",
    styleName: "Rugged Frontier Scrapper",
    description: "Heavy-duty, layered clothing heavily weathered by travel, grease, and survival in harsh environments.",
    keyGarments: ["Durable split-leather duster coat", "Faded, oil-stained denim shirt", "Reinforced canvas work pants"],
    accentsAndAccessories: ["Scuffed steel buckle belt", "Wrapped burlap neck scarf", "Heavy, dust-coated steel-toed boots"],
    systemPromptTags: ["coat tails snapping in the wind", "slapping dust off leather trousers", "heavy thudding boot steps"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-900", accentColor: "text-orange-400" },
  },
  {
    id: "outfit_fant_battle_vanguard",
    category: "Period / Fantasy",
    vibe: "The Cursed Knight / Silent Bodyguard",
    styleName: "Vanguard Battle Plate",
    description: "Functional, heavy combat armor designed to absorb lethal blows while maintaining an imposing silhouette.",
    keyGarments: ["Scuffed steel breastplate", "Thick quilted gambeson underline", "Heavy dark wool cloak"],
    accentsAndAccessories: ["Leather sword sheath", "Chainmail cowl accents", "Iron-shod sabatons"],
    systemPromptTags: ["armor clanking deeply with strides", "hand resting naturally on the sword hilt", "weight of the heavy damp cloak"],
    tailwindTheme: { fromColor: "from-stone-900", toColor: "to-zinc-800", accentColor: "text-stone-400" },
  },
  {
    id: "outfit_fant_reformed_rake",
    category: "Period / Fantasy",
    vibe: "The Rakehell Duke / Regency Rogue",
    styleName: "Regency Decadence",
    description: "Period-accurate aristocrat attire styled with a slightly scandalous, loose, or deliberate disarray.",
    keyGarments: ["Tailored navy tailcoat", "Slightly undone silk cravat", "High-waisted cream breeches"],
    accentsAndAccessories: ["Gold-handled walking cane", "Engraved silver pocket watch", "Knee-high polished riding boots"],
    systemPromptTags: ["flicking the tails of the coat out of the way", "loosening the cravat when irritated", "checking the pocket watch"],
    tailwindTheme: { fromColor: "from-blue-950", toColor: "to-stone-950", accentColor: "text-sky-400" },
  },
  {
    id: "outfit_dark_mafia_enforcer",
    category: "Subcultural / Dark",
    vibe: "The Mafia Don / Dark Captor",
    styleName: "Noir Underworld Sleek",
    description: "Monochromatic, imposing, and sharp garments that look pristine but are built to hide violence.",
    keyGarments: ["Double-breasted black overcoat", "Dark silk button-up shirt", "Tailored slate trousers"],
    accentsAndAccessories: ["Blood-red leather gloves", "Heavy silver ring on pinky finger", "Concealed holster lines"],
    systemPromptTags: ["peeling off leather gloves slowly", "fixing collar lines cleanly", "shadow silhouette of the long overcoat"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-neutral-950", accentColor: "text-red-500" },
  },
  {
    id: "outfit_dark_gothic_academic",
    category: "Subcultural / Dark",
    vibe: "The Reclusive Hacker / Stalker Devotee",
    styleName: "Gothic Grunge Academic",
    description: "Oversized, comfortable, and heavily layered clothing featuring distressed fabrics and dark colors.",
    keyGarments: ["Distressed oversized knit sweater", "Frayed dark denim", "Long tattered corduroy coat"],
    accentsAndAccessories: ["Chunky silver padlock chains", "Frayed fingerless arm-warmers", "Scuffed platform combat boots"],
    systemPromptTags: ["pulling oversized sleeves over the hands", "clutching fabrics tightly when anxious", "heavy dragging footsteps"],
    tailwindTheme: { fromColor: "from-slate-950", toColor: "to-zinc-900", accentColor: "text-fuchsia-500" },
  },
] satisfies readonly OutfitPreset[]);

export const OUTFIT_PRESET_CATEGORIES = Object.freeze(
  Array.from(new Set(OUTFIT_PRESETS.map((preset) => preset.category))).sort(),
);

export function getOutfitPresetsByCategory(
  category: OutfitPresetCategory | string,
): readonly OutfitPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return OUTFIT_PRESETS.filter((preset) => preset.category.toLowerCase() === normalizedCategory);
}

export function findOutfitPresetById(id: string): OutfitPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return OUTFIT_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}
