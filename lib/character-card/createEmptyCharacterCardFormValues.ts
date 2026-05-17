import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";

export function createEmptyCharacterCardFormValues(): CharacterCardFormValues {
  return {
    fullName: "",
    aliasesNicknames: "",
    ageBirthdate: "",
    raceEthnicity: "",
    species: "",
    birthplace: "",
    height: "",
    description: "",
    relationshipsConnections: "",
    physicalAppearance: "",
    personalityPsychology: "",
    backgroundStory: "",
    speechStyle: "",
    intimacyProfile: "",
    scenario: "",
    first_mes: "",
    mes_example: "",
    creator_notes: "",
    system_prompt: "",
    post_history_instructions: "",
    tagsText: "",
    alternateOpenings: [],
    groupOnlyGreetings: [],
  };
}
