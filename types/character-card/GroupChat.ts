import type { CharacterCardV3 } from "./CharacterCardV3";

export type GroupChatRoutingMode = "llm_driven" | "manual" | "sequential";

export interface GroupChatRoom {
  activeCharacterIds: string[];
  currentTurnIndex: number;
  id: string;
  name: string;
  routingMode: GroupChatRoutingMode;
}

export interface SpeakerTurnPayload {
  routingDirectives: string;
  targetCharacter: CharacterCardV3;
}
