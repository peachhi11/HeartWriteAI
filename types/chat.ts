import type { RomanceTropeClass } from "./character-card/RomanceTropeClassification";

export type SpeakerRole = "Player" | "NPC" | "System" | "Narration";

export interface ChatMessage {
  id: string;
  role: SpeakerRole;
  text: string;
  timestamp: string;
  detectedTrope: RomanceTropeClass;
}
