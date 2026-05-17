import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";

export function createCharacterCardExportFileName(
  values: CharacterCardFormValues,
  fallbackFileName: string,
): string {
  const baseName =
    values.fullName.trim() || fallbackFileName.replace(/\.[^.]+$/, "");
  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "character-card"}.ccv3.png`;
}
