import { CharacterCardAlternateOpening } from "./CharacterCardAlternateOpening";

export interface CharacterCardFormValues {
  fullName: string;
  aliasesNicknames: string;
  ageBirthdate: string;
  raceEthnicity: string;
  species: string;
  birthplace: string;
  height: string;
  description: string;
  relationshipsConnections: string;
  physicalAppearance: string;
  personalityPsychology: string;
  backgroundStory: string;
  speechStyle: string;
  intimacyProfile: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creator_notes: string;
  system_prompt: string;
  post_history_instructions: string;
  tagsText: string;
  alternateOpenings: CharacterCardAlternateOpening[];
  groupOnlyGreetings: string[];
}
