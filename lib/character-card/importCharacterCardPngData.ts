import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { CharacterCardImportSummary } from "../../types/character-card/CharacterCardImportSummary";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { createCharacterCardFormValues } from "./createCharacterCardFormValues";
import { createCharacterCardImportSummary } from "./createCharacterCardImportSummary";
import { readCharacterCardFromPng } from "./readCharacterCardFromPng";

export interface ImportedCharacterCardPngData {
  card: CharacterCardPayload;
  formValues: CharacterCardFormValues;
  summary: CharacterCardImportSummary;
}

export function importCharacterCardPngData(
  fileName: string,
  pngData: Uint8Array,
): ImportedCharacterCardPngData {
  const result = readCharacterCardFromPng(pngData);

  return {
    card: result.card,
    formValues: createCharacterCardFormValues(result.card),
    summary: createCharacterCardImportSummary(
      fileName,
      result.source,
      result.card,
    ),
  };
}
