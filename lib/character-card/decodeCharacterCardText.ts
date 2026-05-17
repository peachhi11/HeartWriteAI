import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { base64ToUtf8 } from "./base64ToUtf8";
import { parseCharacterCardJson } from "./parseCharacterCardJson";

export function decodeCharacterCardText(value: string): CharacterCardPayload {
  return parseCharacterCardJson(base64ToUtf8(value));
}
