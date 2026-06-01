export type BodyBuildCategory =
  | "Athletic"
  | "Imposing"
  | "Slender"
  | "Soft & Curvy";

export interface BodyBuildPreset {
  id: string;
  category: BodyBuildCategory;
  vibe: string;
  archetype: string;
  description: string;
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

export const BODY_BUILD_PRESETS = Object.freeze([
  {
    id: "build_ath_lean_wire",
    category: "Athletic",
    vibe: "The Wired Acrobat",
    archetype: "The Nimble Rogue / Gymnast",
    description: "Lean, corded muscle built for speed, agility, and high endurance over raw power.",
    personalityInfluence: ["Restless", "Disciplined", "Hyper-focused", "Calculated"],
    visuals: ["Visible collarbones", "Corded arm muscles", "Sharp definition", "Light, silent footfalls"],
    dynamics: ["Agile Protector", "Sleek and Fast Duo", "Unnoticed Shadow"],
    systemPromptTags: ["fluid fast movement", "cat-like reflexes", "compact muscle description", "silent repositioning"],
    tailwindTheme: { fromColor: "from-cyan-950", toColor: "to-slate-900", accentColor: "text-cyan-400" },
  },
  {
    id: "build_ath_sculpted_hero",
    category: "Athletic",
    vibe: "The Sculpted Champion",
    archetype: "The Golden-Boy Athlete / Elite Soldier",
    description: "Classic, balanced athletic build with broad shoulders, narrow waist, and defined muscle groups.",
    personalityInfluence: ["Confident", "Disciplined", "Competitive", "Expressive"],
    visuals: ["V-taper torso", "Defined abs", "Broad chest", "Strong veins on forearms"],
    dynamics: ["Physical Protector", "Power Couple", "Lifting the Partner Effortlessly"],
    systemPromptTags: ["textbook peak physical shape", "effortless physical labor", "confident posture", "striking physical presence"],
    tailwindTheme: { fromColor: "from-amber-600", toColor: "to-stone-900", accentColor: "text-amber-400" },
  },
  {
    id: "build_imp_tank_brawler",
    category: "Imposing",
    vibe: "The Unyielding Tank",
    archetype: "The Powerlifter / Guard / Enforcer",
    description: "Massive, dense, thick-set frame emphasizing absolute power and structural invulnerability.",
    personalityInfluence: ["Stoic", "Immovable", "Patient", "Intimidating"],
    visuals: ["Thick neck", "Tree-trunk thighs", "Calloused broad hands", "Heavy shadow footprints"],
    dynamics: ["Absolute Shield", "Fierce x Unbreakable", "Human Mattress Comfort"],
    systemPromptTags: ["heavy crushing force", "unmoving during impacts", "slow deliberate actions", "overwhelming physical mass"],
    tailwindTheme: { fromColor: "from-stone-950", toColor: "to-zinc-800", accentColor: "text-stone-400" },
  },
  {
    id: "build_imp_scars_ruin",
    category: "Imposing",
    vibe: "The War-Torn Veteran",
    archetype: "The Scarred Survivor / Rough Mercenary",
    description: "Rugged, heavy muscle mass crosshatched with battle scars, showing a life of raw survival.",
    personalityInfluence: ["Guarded", "Cynical", "Hyper-vigilant", "Weary"],
    visuals: ["Jagged skin textures", "Crooked broken nose", "Asymmetrical gait", "Massive dense shoulders"],
    dynamics: ["Hurt/Comfort Scar Tracing", "Beauty and the Beast", "Ruthless Protection"],
    systemPromptTags: ["textured skin descriptions", "stiff joint movements", "menacing physical shadow", "instinctual defensive blocks"],
    tailwindTheme: { fromColor: "from-red-950", toColor: "to-stone-950", accentColor: "text-red-500" },
  },
  {
    id: "build_sln_willow_waif",
    category: "Slender",
    vibe: "The Ethereal Willow",
    archetype: "The Elegant Scholar / Noble Consort",
    description: "Delicate, elongated, and highly elegant bone structure with subtle, hidden strength.",
    personalityInfluence: ["Graceful", "Quiet", "Introspective", "Reserved"],
    visuals: ["Long elegant fingers", "Prominent clavicles", "Light, feathery movements", "Swan-like neck"],
    dynamics: ["Fragile Heart", "Protected Intellectual", "Slow Graceful Dance"],
    systemPromptTags: ["light weight presence", "fragile architecture", "poised delicate poses", "subtle physical signs"],
    tailwindTheme: { fromColor: "from-violet-950", toColor: "to-neutral-900", accentColor: "text-purple-300" },
  },
  {
    id: "build_sln_lanky_hacker",
    category: "Slender",
    vibe: "The Reclusive Lanky",
    archetype: "The Shut-in Netrunner / Twitchy Academic",
    description: "Tall, thin, slightly unkempt frame lacking muscle mass due to a sedentary, hyper-focused lifestyle.",
    personalityInfluence: ["Anxious", "Brilliant", "Awkward", "Sarcastic"],
    visuals: ["Slouched shoulders", "Bony elbows", "Oversized hoodies", "Fidgeting ink-stained hands"],
    dynamics: ["Clumsy Proximity", "Brain x Brawn Alliance", "Hidden Vulnerability"],
    systemPromptTags: ["poor posture descriptions", "nervous fidgeting", "lack of physical force", "deflective defensive curling"],
    tailwindTheme: { fromColor: "from-slate-900", toColor: "to-zinc-950", accentColor: "text-emerald-400" },
  },
  {
    id: "build_sft_plush_hourglass",
    category: "Soft & Curvy",
    vibe: "The Plush Hourglass",
    archetype: "The Warm Caretaker / Sensual Siren",
    description: "Soft, voluptuous proportions emphasizing curves, warmth, and high physical comfort.",
    personalityInfluence: ["Nurturing", "Warm", "Confident", "Radiant"],
    visuals: ["Soft waist dip", "Rounded shoulders", "Comfortable soft embrace", "Dimpled skin textures"],
    dynamics: ["Soft/Hard Contrast", "Safe Haven Hugs", "Sensual Allure"],
    systemPromptTags: ["warm pliant descriptions", "soft indentation on contact", "voluptuous curves", "comforting spatial presence"],
    tailwindTheme: { fromColor: "from-rose-950", toColor: "to-stone-900", accentColor: "text-rose-400" },
  },
  {
    id: "build_sft_cuddly_bear",
    category: "Soft & Curvy",
    vibe: "The Soft Mountain",
    archetype: "The Gentle Giant / Protective Dad-Bod",
    description: "Broad, burly frame with a layer of natural softness over thick underlying power.",
    personalityInfluence: ["Jovial", "Affectionate", "Composed", "Fiercely Loyal"],
    visuals: ["Wide thick torso", "Soft heavy chest", "Giant warm hands", "Crushing cozy bear hugs"],
    dynamics: ["Teddy Bear Protection", "Ultimate Comfort Haven", "Gentle Giant x Anyone"],
    systemPromptTags: ["deep warm physical presence", "soft enveloping hugs", "slow safe movement", "unshakable calm mass"],
    tailwindTheme: { fromColor: "from-orange-950", toColor: "to-stone-900", accentColor: "text-orange-400" },
  },
] satisfies readonly BodyBuildPreset[]);

export const BODY_BUILD_CATEGORIES = Object.freeze(
  Array.from(new Set(BODY_BUILD_PRESETS.map((preset) => preset.category))).sort(),
);

export function getBodyBuildPresetsByCategory(
  category: BodyBuildCategory | string,
): readonly BodyBuildPreset[] {
  const normalizedCategory = category.trim().toLowerCase();
  return BODY_BUILD_PRESETS.filter(
    (preset) => preset.category.toLowerCase() === normalizedCategory,
  );
}

export function findBodyBuildPresetById(id: string): BodyBuildPreset | undefined {
  const normalizedId = id.trim().toLowerCase();
  return BODY_BUILD_PRESETS.find((preset) => preset.id.toLowerCase() === normalizedId);
}
