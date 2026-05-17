import { readCharacterCardFromPng } from "../character-card/readCharacterCardFromPng";
import { CharacterCardReadResult } from "../../types/character-card/CharacterCardReadResult";

export async function extractCharacterCardMetadata(
  file: File,
): Promise<CharacterCardReadResult | undefined> {
  if (file.type !== "image/png") {
    return undefined;
  }

  try {
    return readCharacterCardFromPng(new Uint8Array(await file.arrayBuffer()));
  } catch {
    return undefined;
  }
}
