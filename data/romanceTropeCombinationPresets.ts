export interface RomanceTropeCombinationPreset {
  id: string;
  rank: number;
  combination: string;
  tropes: string[];
  popularity: 1 | 2 | 3 | 4 | 5;
  emotionalIntensity: 1 | 2 | 3 | 4 | 5;
}

export const ROMANCE_TROPE_COMBINATION_PRESETS = Object.freeze([
  {
    id: "combo_001_enemies_slow_burn_mutual_pining",
    rank: 1,
    combination: "Enemies to Lovers + Slow Burn + Mutual Pining",
    tropes: ["Enemies to Lovers", "Slow Burn", "Mutual Pining"],
    popularity: 5,
    emotionalIntensity: 5,
  },
  {
    id: "combo_002_grumpy_sunshine_slow_burn",
    rank: 2,
    combination: "Grumpy x Sunshine + Slow Burn",
    tropes: ["Grumpy x Sunshine", "Slow Burn"],
    popularity: 5,
    emotionalIntensity: 4,
  },
  {
    id: "combo_003_rivals_forced_proximity",
    rank: 3,
    combination: "Rivals to Lovers + Forced Proximity",
    tropes: ["Rivals to Lovers", "Forced Proximity"],
    popularity: 5,
    emotionalIntensity: 5,
  },
  {
    id: "combo_004_friends_years_of_pining",
    rank: 4,
    combination: "Friends to Lovers + Years of Pining",
    tropes: ["Friends to Lovers", "Years of Pining"],
    popularity: 5,
    emotionalIntensity: 5,
  },
  {
    id: "combo_005_villain_falls_first_hero_oblivious",
    rank: 5,
    combination: "Villain Falls First + Hero Oblivious",
    tropes: ["Villain Falls First", "Hero Oblivious"],
    popularity: 5,
    emotionalIntensity: 5,
  },
  {
    id: "combo_006_one_bed_mutual_pining",
    rank: 6,
    combination: "One Bed + Mutual Pining",
    tropes: ["One Bed", "Mutual Pining"],
    popularity: 5,
    emotionalIntensity: 4,
  },
  {
    id: "combo_007_fake_dating_real_feelings",
    rank: 7,
    combination: "Fake Dating + Real Feelings",
    tropes: ["Fake Dating", "Real Feelings"],
    popularity: 5,
    emotionalIntensity: 4,
  },
  {
    id: "combo_008_bodyguard_protected_slow_burn",
    rank: 8,
    combination: "Bodyguard x Protected + Slow Burn",
    tropes: ["Bodyguard x Protected", "Slow Burn"],
    popularity: 5,
    emotionalIntensity: 5,
  },
  {
    id: "combo_009_black_cat_golden_retriever",
    rank: 9,
    combination: "Black Cat x Golden Retriever",
    tropes: ["Black Cat x Golden Retriever"],
    popularity: 5,
    emotionalIntensity: 4,
  },
  {
    id: "combo_010_i_hate_everyone_except_you_possessive_devotion",
    rank: 10,
    combination: "I Hate Everyone Except You + Possessive Devotion",
    tropes: ["I Hate Everyone Except You", "Possessive Devotion"],
    popularity: 5,
    emotionalIntensity: 5,
  },
] satisfies readonly RomanceTropeCombinationPreset[]);

export function findRomanceTropeCombinationPresetById(
  id: string,
): RomanceTropeCombinationPreset | undefined {
  const normalisedId = id.trim().toLowerCase();
  return ROMANCE_TROPE_COMBINATION_PRESETS.find(
    (preset) => preset.id.toLowerCase() === normalisedId,
  );
}

export function getTopRomanceTropeCombinationPresets(
  limit = ROMANCE_TROPE_COMBINATION_PRESETS.length,
): RomanceTropeCombinationPreset[] {
  return [...ROMANCE_TROPE_COMBINATION_PRESETS]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, Math.max(0, limit));
}

export function getMostIntenseRomanceTropeCombinationPresets(
  minimumIntensity = 5,
): RomanceTropeCombinationPreset[] {
  return ROMANCE_TROPE_COMBINATION_PRESETS.filter(
    (preset) => preset.emotionalIntensity >= minimumIntensity,
  ).sort((a, b) => a.rank - b.rank);
}
