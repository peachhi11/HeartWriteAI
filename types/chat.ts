import type { RomanceTropeClass } from "./character-card/RomanceTropeClassification";

export type SpeakerRole = "Player" | "NPC" | "System" | "Narration";

export interface ChatMessage {
  activeVariantIndex?: number;
  id: string;
  role: SpeakerRole;
  swipedVariants?: string[];
  text: string;
  timestamp: string;
  detectedTrope: RomanceTropeClass;
}
