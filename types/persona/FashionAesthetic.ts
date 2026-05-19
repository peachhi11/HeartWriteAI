export type FashionAestheticMacroClassifier =
  | "Subculture_Alternative"
  | "Historical_Vintage_Retro"
  | "Youth_Internet_Culture"
  | "Fantasy_Speculative"
  | "Socioeconomic_High_Fashion"
  | "Athletic_Functional";

export type FashionSeasonContext =
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "night_out"
  | "festival"
  | "beach";

export interface FashionAesthetic {
  id: string;
  name: string;
  macroClassifier: FashionAestheticMacroClassifier;
  tags: string[];
  formula: string;
  keyItems: string[];
  fabricsPalette: string;
  promptTemplates: Partial<Record<FashionSeasonContext, string>>;
  visualWeights: string[];
}

export interface FashionAestheticBlend {
  hybridName: string;
  dominantAestheticId: string;
  secondaryAestheticId: string;
  dominantWeight: number;
  secondaryWeight: number;
  silhouette: string;
  fabrics: string;
  palette: string;
  hardware: string;
  streetStylePrompt: string;
  personaAestheticLine: string;
  personaOutfitLine: string;
}
