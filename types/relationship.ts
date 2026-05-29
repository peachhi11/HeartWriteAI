import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export interface ConnectionNode {
  activeTrope: RomanceTropeClass;
  affinityScore: number;
  avatarUri: string;
  gridPosition: {
    x: number;
    y: number;
  };
  id: string;
  name: string;
  relationshipStatus: string;
}

export interface RelationshipTreeState {
  nodes: ConnectionNode[];
  protagonistName: string;
}
