import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";

export function parseCharacterCardJson(value: string): CharacterCardPayload {
  const parsedValue: unknown = JSON.parse(value);

  if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
    throw new Error("Character card metadata must decode to a JSON object.");
  }

  return parsedValue as CharacterCardPayload;
}
