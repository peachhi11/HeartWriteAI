import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export type AxisFilter =
  | "All"
  | "Affinity"
  | "Tension"
  | "Control"
  | "Energy"
  | "Utility";

export const AXIS_FILTERS: AxisFilter[] = [
  "All",
  "Affinity",
  "Tension",
  "Control",
  "Energy",
  "Utility",
];

export const AXIS_MAPPING: Record<AxisFilter, RomanceTropeClass[]> = {
  All: [],
  Affinity: [
    "bantering",
    "familiar",
    "flustered",
    "protective",
    "recognized",
    "reclaiming",
    "sunshine",
    "thawing",
    "yearning",
  ],
  Tension: [
    "antagonistic",
    "defeating",
    "estranged",
    "forbidden",
    "grudging",
    "haunted",
    "smothered",
  ],
  Control: ["bound", "commanding", "deferential", "secretive"],
  Energy: ["grumpy", "performative", "slipped_mask"],
  Utility: ["casual", "trucetaking"],
};

export interface ExtractedCharacterPayload {
  avatarDataUri: string;
  description: string;
  forbiddenTones: RomanceTropeClass[];
  name: string;
  preferredTones: RomanceTropeClass[];
  requiredThresholds?: {
    minCharm?: number;
    minWillpower?: number;
  };
}

export interface SavedPersonaMetadata {
  charm: number;
  coreClass: RomanceTropeClass;
  id: string;
  lastUsed: string;
  name: string;
  vulnerability: number;
  willpower: number;
}
