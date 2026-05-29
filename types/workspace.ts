import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";
import type { DimColor } from "@/types/backdrop";

export type WorkspaceTab =
  | "backup"
  | "inference"
  | "legibility"
  | "lorebook"
  | "personality"
  | "relationships";

export interface UnifiedWorkspaceConfig {
  blurRadius: number;
  borderOpacity: number;
  brightnessLevel: number;
  charm: number;
  dimColor: DimColor;
  name: string;
  panelOpacity: number;
  primaryBias: RomanceTropeClass;
  secondaryBias: RomanceTropeClass;
  sidebarWidth: number;
  textGlowAlpha: number;
  vulnerability: number;
  willpower: number;
}
