"use client";

import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

import {
  CharacterCardV3Schema,
  ValidatedCharacterCardV3,
} from "@/types/character-card/CharacterCardV3Schema";

export function useFileDialogs() {
  async function triggerUniversalImport(): Promise<{
    card: ValidatedCharacterCardV3;
    path: string;
  } | null> {
    try {
      const selectedPath = await open({
        multiple: false,
        title: "Import CCV3 Character Card Package",
        filters: [
          {
            name: "Supported Character Formats",
            extensions: ["png", "apng", "json", "charx"],
          },
        ],
      });

      if (!selectedPath || typeof selectedPath !== "string") {
        return null;
      }

      const cardData = await invoke<unknown>("import_card_from_path", {
        filePath: selectedPath,
      });
      const card = CharacterCardV3Schema.parse(cardData);

      return { card, path: selectedPath };
    } catch (error) {
      console.error("Native load interface pipeline collapsed:", error);
      return null;
    }
  }

  async function triggerCharxExport(
    sourceCardPath: string,
    cardData: ValidatedCharacterCardV3,
  ): Promise<string | null> {
    try {
      const saveDestinationPath = await save({
        title: "Export Compressed CHARX Bundle Package",
        defaultPath: createSafeCharacterFileName(cardData.data.name, ".charx"),
        filters: [{ name: "Character Card Bundle", extensions: ["charx"] }],
      });

      if (!saveDestinationPath) {
        return null;
      }

      await invoke("export_character_to_charx", {
        destinationCharxPath: saveDestinationPath,
        sourceCardFilePath: sourceCardPath,
        currentWorkspaceCard: cardData,
      });

      return saveDestinationPath;
    } catch (error) {
      console.error("Archive compile system wrapper collapsed:", error);
      return null;
    }
  }

  async function triggerPngMetadataSave(
    sourceImagePath: string,
    cardData: ValidatedCharacterCardV3,
  ): Promise<string | null> {
    try {
      const saveDestinationPath = await save({
        title: "Save Recompiled Metadata Card Image",
        defaultPath: createSafeCharacterFileName(cardData.data.name, "_compiled.png"),
        filters: [{ name: "Embedded PNG Metadata Card", extensions: ["png"] }],
      });

      if (!saveDestinationPath) {
        return null;
      }

      await invoke("write_edited_card_to_png", {
        sourceImgPath: sourceImagePath,
        targetSavePath: saveDestinationPath,
        updatedCardData: cardData,
      });

      return saveDestinationPath;
    } catch (error) {
      console.error("Metadata injection dialogue collapsed:", error);
      return null;
    }
  }

  return {
    triggerCharxExport,
    triggerPngMetadataSave,
    triggerUniversalImport,
  };
}

function createSafeCharacterFileName(name: string, suffix: string) {
  const safeName = name
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeName || "character"}${suffix}`;
}
