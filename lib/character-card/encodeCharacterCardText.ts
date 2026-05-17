import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { utf8ToBase64 } from "./utf8ToBase64";

export function encodeCharacterCardText(card: CharacterCardPayload): string {
  return utf8ToBase64(JSON.stringify(card));
}
