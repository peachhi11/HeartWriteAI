"use client";

import { useEffect, useState } from "react";
import { getCurrentWebview, type DragDropEvent } from "@tauri-apps/api/webview";
import { Download } from "lucide-react";
import { z } from "zod";

import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { createStandardPngDestinationPath } from "@/lib/character-card/createStandardPngDestinationPath";
import { getDroppedCharacterCardAssetKind } from "@/lib/character-card/getDroppedCharacterCardAssetKind";
import { importBrowserCharacterCardFile } from "@/lib/character-card/importBrowserCharacterCardFile";
import { isTauriRuntime } from "@/lib/tauri/native";
import { CharacterCardDropZoneOverlayProps } from "@/types/character-card/CharacterCardDropZoneOverlayProps";

const TauriDragDropPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("enter"),
    paths: z.array(z.string()),
    position: z.unknown(),
  }),
  z.object({
    type: z.literal("over"),
    position: z.unknown(),
  }),
  z.object({
    type: z.literal("drop"),
    paths: z.array(z.string()),
    position: z.unknown(),
  }),
  z.object({
    type: z.literal("leave"),
  }),
]);

export function CharacterCardDropZoneOverlay({
  onAssetTranscoded,
  onCardParsed,
  onDropError,
}: CharacterCardDropZoneOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { importCardFromPath, transcodeAssetToPng } = useCharacterLibrary();

  useEffect(() => {
    if (!isTauriRuntime()) {
      let dragDepth = 0;

      function isFileDrag(event: DragEvent) {
        return Array.from(event.dataTransfer?.types ?? []).includes("Files");
      }

      function handleBrowserDragEnter(event: DragEvent) {
        if (!isFileDrag(event)) {
          return;
        }

        event.preventDefault();
        dragDepth += 1;
        setIsDragging(true);
      }

      function handleBrowserDragOver(event: DragEvent) {
        if (!isFileDrag(event)) {
          return;
        }

        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "copy";
        }
        setIsDragging(true);
      }

      function handleBrowserDragLeave(event: DragEvent) {
        if (!isFileDrag(event)) {
          return;
        }

        event.preventDefault();
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) {
          setIsDragging(false);
        }
      }

      async function handleBrowserDrop(event: DragEvent) {
        if (!isFileDrag(event)) {
          return;
        }

        event.preventDefault();
        dragDepth = 0;
        setIsDragging(false);

        const file = event.dataTransfer?.files[0];
        if (!file) {
          return;
        }

        try {
          const result = await importBrowserCharacterCardFile(file);
          onCardParsed(result.card, result.path, result.sourcePngData);
        } catch (error) {
          onDropError?.(error instanceof Error ? error.message : String(error));
        }
      }

      document.addEventListener("dragenter", handleBrowserDragEnter, true);
      document.addEventListener("dragover", handleBrowserDragOver, true);
      document.addEventListener("dragleave", handleBrowserDragLeave, true);
      document.addEventListener("drop", handleBrowserDrop, true);

      return () => {
        document.removeEventListener("dragenter", handleBrowserDragEnter, true);
        document.removeEventListener("dragover", handleBrowserDragOver, true);
        document.removeEventListener("dragleave", handleBrowserDragLeave, true);
        document.removeEventListener("drop", handleBrowserDrop, true);
      };
    }

    let isMounted = true;
    let cleanupListeners: VoidFunction | null = null;

    async function handleNativeDroppedPath(targetFile: string) {
      const assetKind = getDroppedCharacterCardAssetKind(targetFile);

      if (
        assetKind === "png-card" ||
        assetKind === "charx" ||
        assetKind === "json-card"
      ) {
        const result = await importCardFromPath(targetFile);
        if (result.card) {
          onCardParsed(result.card, targetFile, null);
        } else if (result.error) {
          onDropError?.(result.error);
        }
        return;
      }

      if (assetKind === "image-asset") {
        const destinationPath = createStandardPngDestinationPath(targetFile);
        const result = await transcodeAssetToPng(targetFile, destinationPath);
        if (result.filePath) {
          onAssetTranscoded?.(result.filePath);
        } else if (result.error) {
          onDropError?.(result.error);
        }
        return;
      }

      onDropError?.(
        "Drop a PNG/APNG character card, CHARX/JSON card, or JPG/WebP image asset.",
      );
    }

    async function setupTauriListeners() {
      cleanupListeners = await getCurrentWebview().onDragDropEvent(
        async (event: { payload: DragDropEvent }) => {
          const parsed = TauriDragDropPayloadSchema.safeParse(event.payload);

          if (!parsed.success) {
            onDropError?.("The desktop app saw a file drop, but could not read the dropped file path.");
            if (isMounted) {
              setIsDragging(false);
            }
            return;
          }

          if (parsed.data.type === "enter" || parsed.data.type === "over") {
            if (isMounted) {
              setIsDragging(true);
            }
            return;
          }

          if (parsed.data.type === "leave") {
            if (isMounted) {
              setIsDragging(false);
            }
            return;
          }

          if (isMounted) {
            setIsDragging(false);
          }

          const targetFile = parsed.data.paths[0];
          if (!targetFile) {
            onDropError?.("The desktop app saw a file drop, but no file path was included.");
            return;
          }

          await handleNativeDroppedPath(targetFile);
        },
      );
    }

    setupTauriListeners().catch((error: unknown) => {
      onDropError?.(
        error instanceof Error
          ? error.message
          : "Could not initialize native drop listeners.",
      );
    });

    return () => {
      isMounted = false;
      cleanupListeners?.();
    };
  }, [
    importCardFromPath,
    onAssetTranscoded,
    onCardParsed,
    onDropError,
    transcodeAssetToPng,
  ]);

  if (!isDragging) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center border-4 border-dashed border-violet-500 bg-zinc-950/80 p-8 backdrop-blur-md transition-all duration-200">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl">
        <div className="flex size-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
          <Download className="size-8 animate-bounce" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-100">
            Drop Character Card Here
          </h2>
          <p className="mt-1 max-w-xs text-sm text-zinc-400">
            Browser preview accepts PNG and JSON cards. The desktop app also accepts
            CHARX and image assets.
          </p>
        </div>
      </div>
    </div>
  );
}
