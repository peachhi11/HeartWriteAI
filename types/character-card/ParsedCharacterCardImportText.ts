import { CharacterCardAlternateOpening } from "./CharacterCardAlternateOpening";

export interface ParsedCharacterCardImportText {
  fullName?: string;
  aliasesNicknames?: string;
  ageBirthdate?: string;
  raceEthnicity?: string;
  species?: string;
  birthplace?: string;
  height?: string;
  description?: string;
  physicalAppearance?: string;
  personalityPsychology?: string;
  backgroundStory?: string;
  speechStyle?: string;
  relationshipsConnections?: string;
  intimacyProfile?: string;
  alternateOpenings?: CharacterCardAlternateOpening[];
  creatorNotes?: string;
}
