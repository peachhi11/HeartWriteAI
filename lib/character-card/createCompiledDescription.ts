import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";

export function createCompiledDescription(
  values: CharacterCardFormValues,
): string {
  return [
    createSingleLine("Full Name", values.fullName),
    createMultiline("Aliases / Nicknames", values.aliasesNicknames),
    createSingleLine("Age & Birthdate", values.ageBirthdate),
    createSingleLine("Race / Ethnicity", values.raceEthnicity),
    createSingleLine("Species", values.species),
    createSingleLine("Birthplace", values.birthplace),
    createSingleLine("Height", values.height),
    createMultiline("Overview", values.description),
  ]
    .filter(Boolean)
    .join("\n");
}

function createSingleLine(label: string, value: string): string {
  const trimmedValue = value.trim();

  return trimmedValue ? `${label}: ${trimmedValue}` : "";
}

function createMultiline(label: string, value: string): string {
  const trimmedValue = value.trim();

  return trimmedValue ? `${label}:\n${trimmedValue}` : "";
}
