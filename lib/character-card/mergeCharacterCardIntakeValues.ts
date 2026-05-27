import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";

export function mergeCharacterCardIntakeValues(
  currentValues: CharacterCardFormValues,
  routedValues: Partial<CharacterCardFormValues>,
  options: { overwrite?: boolean } = {},
): CharacterCardFormValues {
  return {
    ...currentValues,
    ...mergeStringFields(currentValues, routedValues, options),
    tagsText: mergeTags(currentValues.tagsText, routedValues.tagsText),
    alternateOpenings: routedValues.alternateOpenings?.length
      ? routedValues.alternateOpenings
      : currentValues.alternateOpenings,
    groupOnlyGreetings: routedValues.groupOnlyGreetings?.length
      ? routedValues.groupOnlyGreetings
      : currentValues.groupOnlyGreetings,
  };
}

function mergeStringFields(
  currentValues: CharacterCardFormValues,
  routedValues: Partial<CharacterCardFormValues>,
  options: { overwrite?: boolean },
): Partial<CharacterCardFormValues> {
  return Object.fromEntries(
    Object.entries(routedValues)
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([field, value]) => [
        field,
        options.overwrite
          ? value
          : currentValues[field as keyof CharacterCardFormValues] || value,
      ]),
  ) as Partial<CharacterCardFormValues>;
}

function mergeTags(currentTags: string, routedTags?: string): string {
  if (!routedTags?.trim()) {
    return currentTags;
  }

  const tags = new Map<string, string>();

  for (const tag of [...splitTags(currentTags), ...splitTags(routedTags)]) {
    tags.set(tag.toLowerCase(), tag);
  }

  return Array.from(tags.values()).join(", ");
}

function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
