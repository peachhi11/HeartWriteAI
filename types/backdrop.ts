export type DimColor = "zinc" | "rose" | "indigo";

export interface LegibilityEngineConfig {
  blurRadius: number;
  brightnessLevel: number;
  dimColor: DimColor;
}

export const DIM_COLOR_PRESETS: Record<DimColor, string> = {
  indigo: "bg-indigo-950",
  rose: "bg-rose-950",
  zinc: "bg-zinc-950",
};

export const DEFAULT_LEGIBILITY_CONFIG: LegibilityEngineConfig = {
  blurRadius: 8,
  brightnessLevel: 30,
  dimColor: "zinc",
};
