import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";

export function getCharacterCardDisplayName(card: CharacterCardPayload): string | null {
  const dataName = card.data?.name;

  if (typeof dataName === "string" && dataName.trim()) {
    return dataName;
  }

  const topLevelName = card.name;

  if (typeof topLevelName === "string" && topLevelName.trim()) {
    return topLevelName;
  }

  return null;
}
