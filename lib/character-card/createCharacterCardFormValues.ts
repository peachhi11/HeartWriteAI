import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { createEmptyCharacterCardFormValues } from "./createEmptyCharacterCardFormValues";
import { parseCharacterCardImportText } from "./parseCharacterCardImportText";

export function createCharacterCardFormValues(
  card: CharacterCardPayload,
): CharacterCardFormValues {
  const defaults = createEmptyCharacterCardFormValues();
  const data = card.data ?? {};
  const description = readString(data.description, defaults.description);
  const personality = readString(data.personality, defaults.personalityPsychology);
  const creatorNotes = readString(data.creator_notes, defaults.creator_notes);
  const parsedText = parseCharacterCardImportText(
    description,
    personality,
    creatorNotes,
  );
  const alternateOpenings = createAlternateOpenings(
    readStringList(data.alternate_greetings),
    parsedText.alternateOpenings ?? [],
  );

  return {
    fullName: parsedText.fullName ?? readString(data.name, defaults.fullName),
    aliasesNicknames:
      parsedText.aliasesNicknames ??
      readString(data.nickname, defaults.aliasesNicknames),
    ageBirthdate: parsedText.ageBirthdate ?? defaults.ageBirthdate,
    raceEthnicity: parsedText.raceEthnicity ?? defaults.raceEthnicity,
    species: parsedText.species ?? defaults.species,
    birthplace: parsedText.birthplace ?? defaults.birthplace,
    height: parsedText.height ?? defaults.height,
    description: parsedText.description ?? description,
    relationshipsConnections:
      parsedText.relationshipsConnections ?? defaults.relationshipsConnections,
    physicalAppearance: parsedText.physicalAppearance ?? defaults.physicalAppearance,
    personalityPsychology:
      parsedText.personalityPsychology ?? defaults.personalityPsychology,
    backgroundStory: parsedText.backgroundStory ?? defaults.backgroundStory,
    speechStyle: parsedText.speechStyle ?? defaults.speechStyle,
    intimacyProfile: parsedText.intimacyProfile ?? defaults.intimacyProfile,
    scenario: readString(data.scenario, defaults.scenario),
    first_mes: readString(data.first_mes, defaults.first_mes),
    mes_example: readString(data.mes_example, defaults.mes_example),
    creator_notes: parsedText.creatorNotes ?? creatorNotes,
    system_prompt: readString(data.system_prompt, defaults.system_prompt),
    post_history_instructions: readString(
      data.post_history_instructions,
      defaults.post_history_instructions,
    ),
    tagsText: readStringList(data.tags).join(", "),
    alternateOpenings,
    groupOnlyGreetings: readStringList(data.group_only_greetings),
  };
}

function createAlternateOpenings(
  greetings: string[],
  scenarioSummaries: CharacterCardFormValues["alternateOpenings"],
): CharacterCardFormValues["alternateOpenings"] {
  const count = Math.max(greetings.length, scenarioSummaries.length);

  return Array.from({ length: count }, (_, index) => ({
    scenario: scenarioSummaries[index]?.scenario ?? "",
    firstMessage: greetings[index] ?? scenarioSummaries[index]?.firstMessage ?? "",
  }));
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
