"use client";

import { useState } from "react";

import CardLibraryPanel from "@/components/card-library-panel";
import { DevToolsPanel } from "@/components/dev-tools-panel";
import DropZoneOverlay from "@/components/DropZoneOverlay";
import ExpressionManager from "@/components/expression-manager";
import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { ExpressionSprite } from "@/types/character-card/ExpressionSprite";
import { ValidatedCharacterCardV3 } from "@/types/ccv3";

export default function WorkspacePage() {
  const [activeCard, setActiveCard] =
    useState<ValidatedCharacterCardV3 | null>(null);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [selectedExpression, setSelectedExpression] =
    useState<ExpressionSprite | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const library = useCardLibrary(12);
  const { exportCharacterToCharx, importCardFromPath, writeEditedCardToPng } =
    useCharacterLibrary();
  const canSavePngMetadata = currentFilePath
    ? /\.(apng|png)$/i.test(currentFilePath)
    : false;

  function handleCardLoaded(card: ValidatedCharacterCardV3, filePath: string) {
    setActiveCard(card);
    setCurrentFilePath(filePath);
    setSelectedExpression(null);
    library.refresh();
  }

  async function handleCardSelect(filePath: string) {
    setWorkspaceMessage(`Loading cached card: ${filePath}`);

    const result = await importCardFromPath(filePath);
    if (result.card) {
      handleCardLoaded(result.card, filePath);
      setWorkspaceMessage(`Loaded ${result.card.data.name} from ${filePath}.`);
    } else {
      setWorkspaceMessage(result.error ?? `Could not load ${filePath}.`);
    }
  }

  async function handlePersistWorkspaceChanges() {
    if (!activeCard || !currentFilePath) {
      return;
    }

    setIsSaving(true);
    setWorkspaceMessage("Saving card metadata and refreshing cache...");

    const result = await writeEditedCardToPng({
      sourceImagePath: currentFilePath,
      targetSavePath: currentFilePath,
      updatedCardData: activeCard,
    });

    setIsSaving(false);

    if (result.ok) {
      library.refresh();
      setWorkspaceMessage(
        `Saved ${activeCard.data.name} and refreshed the library cache.`,
      );
    } else {
      setWorkspaceMessage(result.error ?? "Save failure.");
    }
  }

  async function handleExportWorkspaceCharx() {
    if (!activeCard || !currentFilePath) {
      return;
    }

    const destinationPath = createSiblingCharxPath(currentFilePath);
    setWorkspaceMessage("Packaging CHARX bundle with expression sprites...");

    const result = await exportCharacterToCharx({
      currentWorkspaceCard: activeCard,
      destinationCharxPath: destinationPath,
      sourceCardFilePath: currentFilePath,
    });

    if (result.ok) {
      library.refresh();
      setWorkspaceMessage(result.message ?? `Exported CHARX to ${destinationPath}.`);
    } else {
      setWorkspaceMessage(result.error ?? "CHARX export failure.");
    }
  }

  return (
    <main className="relative flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <DropZoneOverlay
        onAssetTranscoded={(filePath) =>
          setWorkspaceMessage(`Converted image asset to ${filePath}.`)
        }
        onCardParsed={(parsed, filePath) => {
          handleCardLoaded(parsed, filePath);
          setWorkspaceMessage(null);
        }}
        onDropError={setWorkspaceMessage}
      />

      <CardLibraryPanel
        library={library}
        onCardSelect={(filePath) => {
          void handleCardSelect(filePath);
        }}
      />

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CCV3 Real-Time Editor
            </h1>
            <p className="text-xs text-zinc-400">
              Workspace edits save back into card files and refresh the cache
              index.
            </p>
          </div>
          {activeCard ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportWorkspaceCharx}
                disabled={!currentFilePath}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
              >
                Export CHARX
              </button>
              <button
                type="button"
                onClick={handlePersistWorkspaceChanges}
                disabled={isSaving || !canSavePngMetadata}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-zinc-100 transition hover:bg-violet-700 disabled:opacity-50"
                title={
                  canSavePngMetadata
                    ? "Save edited CCV3 metadata into the PNG and refresh the cache."
                    : "PNG/APNG save is available now; JSON and CHARX save are next."
                }
              >
                {isSaving ? "Saving Header..." : "Save Changes"}
              </button>
            </div>
          ) : null}
        </header>

        {workspaceMessage ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
            {workspaceMessage}
          </p>
        ) : null}

        {activeCard ? (
          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 shadow-md">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Character Identity String
              </label>
              <input
                type="text"
                value={activeCard.data.name}
                onChange={(event) =>
                  setActiveCard({
                    ...activeCard,
                    data: {
                      ...activeCard.data,
                      name: event.currentTarget.value,
                    },
                  })
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs font-semibold text-zinc-200 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Dynamic Character Description Matrix
              </label>
            <textarea
              value={activeCard.data.description}
              onChange={(event) =>
                setActiveCard({
                  ...activeCard,
                  data: {
                    ...activeCard.data,
                    description: event.currentTarget.value,
                  },
                })
              }
                className="h-48 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />
            </div>

            <p className="truncate font-mono text-[10px] text-zinc-600">
              FileSystem Mount: {currentFilePath ?? "unsaved"}
            </p>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 p-6 text-center">
            {currentFilePath ? (
              <p className="font-mono text-xs text-zinc-400">
                Cached selection: {currentFilePath}
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                Drop any verified PNG, CHARX, or JSON card onto the window to
                begin editing.
              </p>
            )}
          </div>
        )}

        <ExpressionManager
          activeCardPath={currentFilePath}
          onExpressionSelected={(sprite) => {
            setSelectedExpression(sprite);
            setWorkspaceMessage(`Selected expression sprite: ${sprite.name}`);
          }}
        />

        {selectedExpression ? (
          <p className="truncate rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-[10px] text-zinc-500">
            Active expression: {selectedExpression.raw_path}
          </p>
        ) : null}

        <DevToolsPanel onSeeded={library.refresh} />
      </div>
    </main>
  );
}

function createSiblingCharxPath(filePath: string) {
  return filePath.replace(/\.[^/.]+$/, ".charx");
}
