"use client";

import { invoke } from "@tauri-apps/api/core";
import { useCallback } from "react";
import { ZodError } from "zod";

import {
  CharacterCardV3Schema,
  ValidatedCharacterCardV3,
} from "@/types/character-card/CharacterCardV3Schema";
import { AppMacroExtensions } from "@/types/character-card/AppMacroExtensions";

export interface SaveCharacterCardResult {
  filePath: string | null;
  ok: boolean;
  error: string | null;
}

export interface ImportCharacterCardResult {
  card: ValidatedCharacterCardV3 | null;
  ok: boolean;
  error: string | null;
}

export interface ExportCharacterCardResult {
  filePath: string | null;
  ok: boolean;
  error: string | null;
}

export interface FullCharxExportResult {
  message: string | null;
  ok: boolean;
  error: string | null;
}

export interface PngInjectionResult {
  filePath: string | null;
  ok: boolean;
  error: string | null;
}

export interface ConvertImageAssetResult {
  filePath: string | null;
  ok: boolean;
  error: string | null;
}

export function useCharacterLibrary() {
  const saveCard = useCallback(async function saveCard(
    cardData: unknown,
  ): Promise<SaveCharacterCardResult> {
    try {
      const validCard = CharacterCardV3Schema.parse(cardData);
      const filePath = await invoke<string>("save_ccv3_card", {
        card: validCard satisfies ValidatedCharacterCardV3,
      });

      return { filePath, ok: true, error: null };
    } catch (error) {
      return {
        filePath: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const importCardFromPng = useCallback(async function importCardFromPng(
    path: string,
  ): Promise<ImportCharacterCardResult> {
    try {
      const card = await invoke<unknown>("import_png_card", { filePath: path });
      const validCard = CharacterCardV3Schema.parse(card);

      return { card: validCard, ok: true, error: null };
    } catch (error) {
      return {
        card: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const importCardFromCharx = useCallback(async function importCardFromCharx(
    path: string,
  ): Promise<ImportCharacterCardResult> {
    try {
      const card = await invoke<unknown>("import_charx_card", { filePath: path });
      const validCard = CharacterCardV3Schema.parse(card);

      return { card: validCard, ok: true, error: null };
    } catch (error) {
      return {
        card: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const importCardFromPath = useCallback(async function importCardFromPath(
    path: string,
  ): Promise<ImportCharacterCardResult> {
    try {
      const card = await invoke<unknown>("import_card_from_path", {
        filePath: path,
      });
      const validCard = CharacterCardV3Schema.parse(card);

      return { card: validCard, ok: true, error: null };
    } catch (error) {
      return {
        card: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const exportCardToCharx = useCallback(async function exportCardToCharx({
    additionalAssetsDir,
    avatarPath,
    cardData,
    outputPath,
  }: {
    additionalAssetsDir?: string;
    avatarPath?: string;
    cardData: unknown;
    outputPath: string;
  }): Promise<ExportCharacterCardResult> {
    try {
      const validCard = CharacterCardV3Schema.parse(cardData);
      await invoke<void>("export_charx_card", {
        assetsSrc: additionalAssetsDir ?? null,
        avatarSrc: avatarPath ?? null,
        card: validCard satisfies ValidatedCharacterCardV3,
        destinationZip: outputPath,
      });

      return { filePath: outputPath, ok: true, error: null };
    } catch (error) {
      return {
        filePath: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const exportCharacterToCharx = useCallback(async function exportCharacterToCharx({
    currentWorkspaceCard,
    destinationCharxPath,
    sourceCardFilePath,
  }: {
    currentWorkspaceCard: unknown;
    destinationCharxPath: string;
    sourceCardFilePath: string;
  }): Promise<FullCharxExportResult> {
    try {
      const validCard = CharacterCardV3Schema.parse(currentWorkspaceCard);
      const message = await invoke<string>("export_character_to_charx", {
        currentWorkspaceCard: validCard satisfies ValidatedCharacterCardV3,
        destinationCharxPath,
        sourceCardFilePath,
      });

      return { message, ok: true, error: null };
    } catch (error) {
      return {
        message: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);


  const extractCardMacroExtensions = useCallback(async function extractCardMacroExtensions(
    cardData: unknown,
  ): Promise<AppMacroExtensions | null> {
    const validCard = CharacterCardV3Schema.parse(cardData);

    return invoke<AppMacroExtensions | null>("extract_card_macro_extensions", {
      card: validCard satisfies ValidatedCharacterCardV3,
    });
  }, []);

  const injectCardIntoPng = useCallback(async function injectCardIntoPng({
    cardData,
    outputPngPath,
    sourceImagePath,
  }: {
    cardData: unknown;
    outputPngPath: string;
    sourceImagePath: string;
  }): Promise<PngInjectionResult> {
    try {
      const validCard = CharacterCardV3Schema.parse(cardData);
      const filePath = await invoke<string>("inject_ccv3_card_into_png", {
        card: validCard satisfies ValidatedCharacterCardV3,
        outputPngPath,
        sourceImagePath,
      });

      return { filePath, ok: true, error: null };
    } catch (error) {
      return {
        filePath: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const writeEditedCardToPng = useCallback(async function writeEditedCardToPng({
    sourceImagePath,
    targetSavePath,
    updatedCardData,
  }: {
    sourceImagePath: string;
    targetSavePath: string;
    updatedCardData: unknown;
  }): Promise<PngInjectionResult> {
    try {
      const validCard = CharacterCardV3Schema.parse(updatedCardData);
      await invoke<void>("write_edited_card_to_png", {
        sourceImgPath: sourceImagePath,
        targetSavePath,
        updatedCardData: validCard satisfies ValidatedCharacterCardV3,
      });

      return { filePath: targetSavePath, ok: true, error: null };
    } catch (error) {
      return {
        filePath: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const convertAssetToStandardPng = useCallback(async function convertAssetToStandardPng(
    inputPath: string,
    outputPath: string,
  ): Promise<ConvertImageAssetResult> {
    try {
      const filePath = await invoke<string>("convert_asset_to_standard_png", {
        inputPath,
        outputPath,
      });

      return { filePath, ok: true, error: null };
    } catch (error) {
      return {
        filePath: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  const transcodeAssetToPng = useCallback(async function transcodeAssetToPng(
    sourcePath: string,
    destinationPath: string,
  ): Promise<ConvertImageAssetResult> {
    try {
      await invoke<void>("transcode_asset_to_png", {
        destinationPath,
        sourcePath,
      });

      return { filePath: destinationPath, ok: true, error: null };
    } catch (error) {
      return {
        filePath: null,
        ok: false,
        error: formatCharacterCardBoundaryError(error),
      };
    }
  }, []);

  return {
    convertAssetToStandardPng,
    extractCardMacroExtensions,
    exportCardToCharx,
    exportCharacterToCharx,
    importCardFromPath,
    importCardFromCharx,
    importCardFromPng,
    injectCardIntoPng,
    saveCard,
    transcodeAssetToPng,
    writeEditedCardToPng,
  };
}

function formatCharacterCardBoundaryError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".") || "card"}: ${issue.message}`)
      .join("; ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
