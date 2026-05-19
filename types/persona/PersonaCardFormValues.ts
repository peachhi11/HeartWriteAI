import { PersonaCreationMode } from "./PersonaCard";

export interface PersonaCardFormValues {
  creationMode: PersonaCreationMode;
  displayName: string;
  age: string;
  gender: string;
  height: string;
  eyes: string;
  hair: string;
  body: string;
  aesthetic: string;
  appearance: string;
  outfit: string;
  personality: string;
  behaviour: string;
  speech: string;
  speechQuirks: string;
  exampleDialogue: string;
  intimacy: string;
  boundaries: string;
  notes: string;
  tagsText: string;
  vibeTagsText: string;
  avatarImagePath: string;
  sourceCharacterName: string;
  sourceCharacterCardId: string;
  linkedCharacterName: string;
  linkedCharacterCardId: string;
  setAsCharacterDefault: boolean;
}
