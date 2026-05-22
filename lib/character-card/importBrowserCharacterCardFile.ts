import {
  CharacterCardV3Schema,
  ValidatedCharacterCardV3,
} from "@/types/character-card/CharacterCardV3Schema";
import { CharacterCardPayload } from "@/types/character-card/CharacterCardPayload";
import { createCharacterCardV3Export } from "./createCharacterCardV3Export";
import { importCharacterCardPngData } from "./importCharacterCardPngData";

export interface BrowserCharacterCardImportResult {
  card: ValidatedCharacterCardV3;
  path: string;
  sourcePngData: Uint8Array | null;
}

export async function importBrowserCharacterCardFile(
  file: File,
): Promise<BrowserCharacterCardImportResult> {
  const fileName = file.name;
  const normalizedName = fileName.toLowerCase();

  if (normalizedName.endsWith(".png") || normalizedName.endsWith(".apng")) {
    const pngData = new Uint8Array(await file.arrayBuffer());

    try {
      const importedData = importCharacterCardPngData(fileName, pngData);

      return {
        card: CharacterCardV3Schema.parse(
          createCharacterCardV3Export(importedData.card),
        ),
        path: fileName,
        sourcePngData: pngData,
      };
    } catch (error) {
      const pointerMessage = await readPointerFileMessage(file);
      if (pointerMessage) {
        throw new Error(pointerMessage);
      }

      throw error;
    }
  }

  if (normalizedName.endsWith(".json")) {
    const parsed = JSON.parse(await file.text()) as CharacterCardPayload;
    const pointerMessage = readPointerPayloadMessage(parsed);
    if (pointerMessage) {
      throw new Error(pointerMessage);
    }

    return {
      card: CharacterCardV3Schema.parse(createCharacterCardV3Export(parsed)),
      path: fileName,
      sourcePngData: null,
    };
  }

  if (normalizedName.endsWith(".charx")) {
    throw new Error("CHARX import needs the desktop app for now.");
  }

  throw new Error("Drop a PNG or JSON character card.");
}

async function readPointerFileMessage(file: File) {
  try {
    const parsed = JSON.parse(await file.text()) as unknown;

    return readPointerPayloadMessage(parsed);
  } catch {
    return null;
  }
}

function readPointerPayloadMessage(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const url = (payload as { url?: unknown }).url;

  if (typeof url !== "string") {
    return null;
  }

  return `This file is a download link, not a card image. Download the linked card first: ${url}`;
}
