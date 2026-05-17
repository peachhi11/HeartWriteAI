import { CharacterCardLoadedSummary } from "../../types/character-card/CharacterCardLoadedSummary";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { getCharacterCardDisplayName } from "./getCharacterCardDisplayName";

export function createCharacterCardLoadedSummary(
  card: CharacterCardPayload,
): CharacterCardLoadedSummary {
  const data = card.data ?? {};
  const characterBook = isRecord(data.character_book) ? data.character_book : {};

  return {
    name: getCharacterCardDisplayName(card) ?? "Unnamed card",
    tagsCount: countStringArray(data.tags),
    alternateGreetingsCount: countStringArray(data.alternate_greetings),
    groupOnlyGreetingsCount: countStringArray(data.group_only_greetings),
    lorebookEntriesCount: countArray(characterBook.entries),
    assetsCount: countArray(data.assets),
  };
}

function countArray(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function countStringArray(value: unknown): number {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string").length
    : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
