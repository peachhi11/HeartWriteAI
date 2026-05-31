"use client";

import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

import {
  CharacterCardV3Schema,
  ValidatedCharacterCardV3,
} from "@/types/character-card/CharacterCardV3Schema";
import { scrubCardForPublicExport } from "@/lib/character-card/exportPrivacyScrubber";
import { createBlankDraftCharacterCard } from "@/lib/character-card/createDraftCharacterCard";
import { isTauriRuntime } from "@/lib/tauri/native";

export function useFileDialogs() {
  const isDesktopRuntime = isTauriRuntime();

  async function triggerUniversalImport(): Promise<{
    card: ValidatedCharacterCardV3;
    path: string;
  } | null> {
    if (!isDesktopRuntime) {
      return null;
    }

    let selectedPath: string | null = null;

    try {
      const openedPath = await open({
        multiple: false,
        title: "Import CCV3 Character Card Package",
        filters: [
          {
            name: "Supported Character Formats",
            extensions: ["png", "apng", "json", "charx"],
          },
        ],
      });

      if (!openedPath || typeof openedPath !== "string") {
        return null;
      }

      selectedPath = openedPath;
      const cardData = await invoke<unknown>("import_card_from_path", {
        filePath: selectedPath,
      });
      const card = CharacterCardV3Schema.parse(cardData);

      return { card, path: selectedPath };
    } catch (error) {
      console.error("Native load interface pipeline collapsed:", error);
      if (
        selectedPath &&
        /\.(apng|png)$/i.test(selectedPath) &&
        isMissingCardMetadataError(error)
      ) {
        return {
          card: createBlankDraftCharacterCard(selectedPath),
          path: selectedPath,
        };
      }

      return null;
    }
  }

  async function triggerSecureCardImport(password: string): Promise<{
    card: ValidatedCharacterCardV3;
    path: string;
  } | null> {
    if (!isDesktopRuntime) {
      return null;
    }

    try {
      const openedPath = await open({
        multiple: false,
        title: "Import Encrypted HeartWriteAI Card",
        filters: [
          {
            name: "HeartWriteAI Secure Card",
            extensions: ["hwcard"],
          },
        ],
      });

      if (!openedPath || typeof openedPath !== "string") {
        return null;
      }

      const cardData = await invoke<unknown>("import_encrypted_character_card", {
        filePath: openedPath,
        password,
      });
      const card = CharacterCardV3Schema.parse(cardData);

      return { card, path: openedPath };
    } catch (error) {
      console.error("Encrypted card import collapsed:", error);
      throw error;
    }
  }

  async function triggerPngShellImport(): Promise<{
    card: ValidatedCharacterCardV3;
    path: string;
  } | null> {
    if (!isDesktopRuntime) {
      return null;
    }

    try {
      const openedPath = await open({
        multiple: false,
        title: "Import PNG Shell",
        filters: [
          {
            name: "PNG or APNG Image Shell",
            extensions: ["png", "apng"],
          },
        ],
      });

      if (!openedPath || typeof openedPath !== "string") {
        return null;
      }

      return {
        card: createBlankDraftCharacterCard(openedPath),
        path: openedPath,
      };
    } catch (error) {
      console.error("PNG shell import collapsed:", error);
      return null;
    }
  }

  async function triggerFolderIntakeSelect(): Promise<string | null> {
    if (!isDesktopRuntime) {
      return null;
    }

    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
        title: "Choose a Character Card Intake Folder",
      });

      if (!selectedPath || typeof selectedPath !== "string") {
        return null;
      }

      return selectedPath;
    } catch (error) {
      console.error("Folder intake selection collapsed:", error);
      return null;
    }
  }

  async function triggerCharxExport(
    sourceCardPath: string,
    cardData: ValidatedCharacterCardV3,
  ): Promise<string | null> {
    if (!isDesktopRuntime) {
      return null;
    }

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
        currentWorkspaceCard: scrubCardForPublicExport(cardData),
      });

      return saveDestinationPath;
    } catch (error) {
      console.error("Archive compile system wrapper collapsed:", error);
      return null;
    }
  }

  async function triggerSecureCardExport(
    cardData: ValidatedCharacterCardV3,
    password: string,
  ): Promise<string | null> {
    if (!isDesktopRuntime) {
      return null;
    }

    try {
      const saveDestinationPath = await save({
        title: "Export Encrypted HeartWriteAI Card",
        defaultPath: createSafeCharacterFileName(cardData.data.name, ".hwcard"),
        filters: [{ name: "HeartWriteAI Secure Card", extensions: ["hwcard"] }],
      });

      if (!saveDestinationPath) {
        return null;
      }

      return await invoke<string>("export_encrypted_character_card", {
        cardJson: cardData,
        password,
        targetSavePath: saveDestinationPath,
      });
    } catch (error) {
      console.error("Encrypted card export collapsed:", error);
      throw error;
    }
  }

  async function triggerPngMetadataSave(
    sourceImagePath: string,
    cardData: ValidatedCharacterCardV3,
  ): Promise<string | null> {
    if (!isDesktopRuntime) {
      return null;
    }

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
        updatedCardData: scrubCardForPublicExport(cardData),
      });

      return saveDestinationPath;
    } catch (error) {
      console.error("Metadata injection dialogue collapsed:", error);
      return null;
    }
  }

  return {
    isDesktopRuntime,
    triggerCharxExport,
    triggerFolderIntakeSelect,
    triggerPngShellImport,
    triggerPngMetadataSave,
    triggerSecureCardExport,
    triggerSecureCardImport,
    triggerUniversalImport,
  };
}

function isMissingCardMetadataError(error: unknown) {
  return String(error).includes("No character card metadata");
}

function createSafeCharacterFileName(name: string, suffix: string) {
  const safeName = name
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeName || "character"}${suffix}`;
}
