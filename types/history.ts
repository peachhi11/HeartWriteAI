import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export type DialogueLogRole = "Player" | "NPC" | "System";

export interface DialogueLogEntry {
  id: string;
  role: DialogueLogRole;
  text: string;
  timestamp: string;
  detectedTrope: RomanceTropeClass;
}
