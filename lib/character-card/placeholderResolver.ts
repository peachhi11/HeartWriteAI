import {
  CharacterCardData,
  GeneratedWorldLorePlaceholderData,
} from "./generator";

export function resolveWorldPlaceholders(
  config: CharacterCardData,
  baseDescription: string,
) {
  return resolveDescriptionWorldPlaceholders(
    baseDescription,
    config.worldLorePlaceholders ?? [],
  );
}

export function resolveDescriptionWorldPlaceholders(
  baseDescription: string,
  placeholders: GeneratedWorldLorePlaceholderData[],
) {
  return placeholders.reduce(
    (processedDescription, placeholder) =>
      processedDescription.replaceAll(
        placeholder.variableKey,
        placeholder.currentDataPayload,
      ),
    baseDescription,
  );
}
