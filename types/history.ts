import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export type DialogueLogRole = "Player" | "NPC" | "System";

export interface DialogueLogEntry {
  activeVariantIndex?: number;
  id: string;
  role: DialogueLogRole;
  swipedVariants?: string[];
  text: string;
  timestamp: string;
  detectedTrope: RomanceTropeClass;
}
