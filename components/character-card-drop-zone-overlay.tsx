"use client";

import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { Download } from "lucide-react";

import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { createStandardPngDestinationPath } from "@/lib/character-card/createStandardPngDestinationPath";
import { getDroppedCharacterCardAssetKind } from "@/lib/character-card/getDroppedCharacterCardAssetKind";
import { CharacterCardDropPayload } from "@/types/character-card/CharacterCardDropPayload";
import { CharacterCardDropZoneOverlayProps } from "@/types/character-card/CharacterCardDropZoneOverlayProps";

export function CharacterCardDropZoneOverlay({
  onAssetTranscoded,
  onCardParsed,
  onDropError,
}: CharacterCardDropZoneOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { importCardFromCharx, importCardFromPng, transcodeAssetToPng } =
    useCharacterLibrary();

  useEffect(() => {
    let isMounted = true;
    let cleanupListeners: VoidFunction | null = null;

    async function setupTauriListeners() {
      const unlistenDragEnter = await listen<CharacterCardDropPayload>(
        "tauri://drag-enter",
        () => {
          if (isMounted) {
            setIsDragging(true);
          }
        },
      );
      const unlistenDragLeave = await listen<CharacterCardDropPayload>(
        "tauri://drag-leave",
        () => {
          if (isMounted) {
            setIsDragging(false);
          }
        },
      );
      const unlistenDrop = await listen<CharacterCardDropPayload>(
        "tauri://drop",
        async (event) => {
          if (isMounted) {
            setIsDragging(false);
          }

          const targetFile = event.payload.paths[0];

          if (!targetFile) {
            return;
          }

          const assetKind = getDroppedCharacterCardAssetKind(targetFile);

          if (assetKind === "png-card") {
            const result = await importCardFromPng(targetFile);
            if (result.card) {
              onCardParsed(result.card, targetFile);
            } else if (result.error) {
              onDropError?.(result.error);
            }
            return;
          }

          if (assetKind === "charx") {
            const result = await importCardFromCharx(targetFile);
            if (result.card) {
              onCardParsed(result.card, targetFile);
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

          onDropError?.("Drop a PNG/APNG character card, CHARX bundle, or JPG/WebP image asset.");
        },
      );

      cleanupListeners = () => {
        unlistenDragEnter();
        unlistenDragLeave();
        unlistenDrop();
      };
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
    importCardFromCharx,
    importCardFromPng,
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
            Drop CCV3 File Asset Here
          </h2>
          <p className="mt-1 max-w-xs text-sm text-zinc-400">
            Accepts PNG character cards, image assets, and unified CHARX packages.
          </p>
        </div>
      </div>
    </div>
  );
}
