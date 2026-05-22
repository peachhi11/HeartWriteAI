import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { base64ToUtf8 } from "./base64ToUtf8";
import { parseCharacterCardJson } from "./parseCharacterCardJson";

export function decodeCharacterCardText(value: string): CharacterCardPayload {
  const trimmedValue = value.trim();
  const parseErrors: string[] = [];

  try {
    return parseCharacterCardJson(trimmedValue);
  } catch (error) {
    parseErrors.push(formatDecodeError("raw JSON", error));
  }

  try {
    return parseCharacterCardJson(base64ToUtf8(trimmedValue));
  } catch (error) {
    parseErrors.push(formatDecodeError("base64 JSON", error));
  }

  throw new Error(
    `Character card metadata was not readable as raw JSON or base64 JSON. ${parseErrors.join(" ")}`,
  );
}

function formatDecodeError(mode: string, error: unknown) {
  return `${mode}: ${error instanceof Error ? error.message : String(error)}.`;
}
