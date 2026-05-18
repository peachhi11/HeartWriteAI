import { NativeCharacterCardImportData } from "../../types/character-card/NativeCharacterCardImportData";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { createCharacterCardFormValues } from "./createCharacterCardFormValues";
import { createCharacterCardImportSummary } from "./createCharacterCardImportSummary";

export function createNativeCharacterCardImportData(
  fileName: string,
  card: CharacterCardPayload,
): NativeCharacterCardImportData {
  return {
    card,
    formValues: createCharacterCardFormValues(card),
    summary: createCharacterCardImportSummary(fileName, "ccv3", card),
  };
}
