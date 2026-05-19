export type PersonaCreationMode = "from_scratch" | "matched_to_character";

export interface PersonaCharacterLink {
  characterCardId: string;
  characterName: string;
  isDefaultForCharacter: boolean;
  linkSource: "manual" | "persona_match";
  notes?: string;
}

export interface PersonaChatLock {
  chatId: string;
  chatTitle: string;
  characterCardId?: string;
  lockedAt: number;
}

export interface PersonaCardFields {
  basicDetails: string;
  appearance: string;
  outfit: string;
  personality: string;
  behaviour: string;
  speech: string;
  exampleDialogue: string;
  intimacy: string;
  boundaries: string;
  notes: string;
}

export interface PersonaCard {
  id: string;
  schemaVersion: "heartwrite_persona_v1";
  creationMode: PersonaCreationMode;
  displayName: string;
  avatarImagePath?: string;
  tags: string[];
  vibeTags: string[];
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
  fields: PersonaCardFields;
  linkedCharacters: PersonaCharacterLink[];
  chatLocks: PersonaChatLock[];
  sourceCharacterCardId?: string;
  sourceCharacterName?: string;
}

export interface PersonaCardLibraryItem {
  id: string;
  displayName: string;
  avatarImagePath?: string;
  tags: string[];
  vibeTags: string[];
  linkedCharacterCount: number;
  lastUsedAt?: number;
}
