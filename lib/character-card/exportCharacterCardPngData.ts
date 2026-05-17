import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { createCharacterCardFromFormValues } from "./createCharacterCardFromFormValues";
import { writeCharacterCardToPng } from "./writeCharacterCardToPng";

export function exportCharacterCardPngData(
  sourcePngData: Uint8Array,
  sourceCard: CharacterCardPayload,
  cardValues: CharacterCardFormValues,
): Uint8Array {
  return writeCharacterCardToPng(
    sourcePngData,
    createCharacterCardFromFormValues(sourceCard, cardValues),
  );
}
