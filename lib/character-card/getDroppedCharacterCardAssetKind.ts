import { CharacterCardDroppedAssetKind } from "../../types/character-card/CharacterCardDroppedAssetKind";

export function getDroppedCharacterCardAssetKind(
  filePath: string,
): CharacterCardDroppedAssetKind {
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.endsWith(".charx")) {
    return "charx";
  }

  if (lowerPath.endsWith(".png") || lowerPath.endsWith(".apng")) {
    return "png-card";
  }

  if (
    lowerPath.endsWith(".jpg") ||
    lowerPath.endsWith(".jpeg") ||
    lowerPath.endsWith(".webp")
  ) {
    return "image-asset";
  }

  return "unsupported";
}
