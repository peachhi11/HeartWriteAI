import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export interface ActionCardVariant {
  id: string;
  intentClass: RomanceTropeClass;
  actionDescriptor: string;
  dialoguePreview: string;
  intensityModifier: string;
}
