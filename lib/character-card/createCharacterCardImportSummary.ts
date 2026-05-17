import { CharacterCardImportSummary } from "../../types/character-card/CharacterCardImportSummary";
import { CharacterCardMetadataSource } from "../../types/character-card/CharacterCardMetadataSource";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { createCharacterCardLoadedSummary } from "./createCharacterCardLoadedSummary";

export function createCharacterCardImportSummary(
  fileName: string,
  source: CharacterCardMetadataSource,
  card: CharacterCardPayload,
): CharacterCardImportSummary {
  return {
    fileName,
    source,
    spec: card.spec,
    specVersion: card.spec_version,
    loadedSummary: createCharacterCardLoadedSummary(card),
  };
}
