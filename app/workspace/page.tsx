"use client";

import { useState } from "react";

import CardLibraryPanel from "@/components/card-library-panel";
import { DevToolsPanel } from "@/components/dev-tools-panel";
import DropZoneOverlay from "@/components/DropZoneOverlay";
import ExpressionManager from "@/components/expression-manager";
import StructuredCardEditor from "@/components/structured-card-editor";
import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { useFileDialogs } from "@/hooks/useFileDialogs";
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
  const { importCardFromPath, saveWorkspaceChanges } = useCharacterLibrary();
  const {
    triggerCharxExport,
    triggerPngMetadataSave,
    triggerUniversalImport,
  } = useFileDialogs();
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
    setWorkspaceMessage("Saving card data back to the active source file...");

    const result = await saveWorkspaceChanges({
      activeSessionPath: currentFilePath,
      currentWorkspaceCard: activeCard,
    });

    setIsSaving(false);

    if (result.ok) {
      library.refresh();
      setWorkspaceMessage(
        result.message ??
          `Saved ${activeCard.data.name} and refreshed the library cache.`,
      );
    } else {
      setWorkspaceMessage(result.error ?? "Save failure.");
    }
  }

  async function handleManualImportClick() {
    const result = await triggerUniversalImport();
    if (!result) {
      return;
    }

    handleCardLoaded(result.card, result.path);
    setWorkspaceMessage(`Loaded ${result.card.data.name} from ${result.path}.`);
  }

  async function handleExportWorkspaceCharx() {
    if (!activeCard || !currentFilePath) {
      return;
    }

    setWorkspaceMessage("Choose a CHARX destination...");

    const destinationPath = await triggerCharxExport(currentFilePath, activeCard);

    if (destinationPath) {
      library.refresh();
      setWorkspaceMessage(`Exported CHARX to ${destinationPath}.`);
    }
  }

  async function handleSaveWorkspacePngAs() {
    if (!activeCard || !currentFilePath || !canSavePngMetadata) {
      return;
    }

    setWorkspaceMessage("Choose a PNG destination...");

    const savedPath = await triggerPngMetadataSave(currentFilePath, activeCard);
    if (savedPath) {
      setCurrentFilePath(savedPath);
      library.refresh();
      setWorkspaceMessage(`Saved embedded PNG card to ${savedPath}.`);
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
              CCV3 Matrix Architecture Studio
            </h1>
            <p className="max-w-[52rem] truncate font-mono text-xs text-violet-300">
              {currentFilePath ?? "No active tracking file loaded."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualImportClick}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-800"
            >
              Import File...
            </button>
            {activeCard ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveWorkspacePngAs}
                  disabled={!canSavePngMetadata}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
                  title={
                    canSavePngMetadata
                      ? "Save this card to a new PNG destination."
                      : "Save As PNG needs a PNG/APNG source image."
                  }
                >
                  Save PNG As...
                </button>
              <button
                type="button"
                onClick={handleExportWorkspaceCharx}
                disabled={!currentFilePath}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
              >
                Export CHARX...
              </button>
              <button
                type="button"
                onClick={handlePersistWorkspaceChanges}
                disabled={isSaving || !currentFilePath}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-zinc-100 transition hover:bg-violet-700 disabled:opacity-50"
                title="Save edited CCV3 data back to the active PNG, JSON, or CHARX source."
              >
                {isSaving ? "Rewriting Source..." : "Save Changes"}
              </button>
              </>
            ) : null}
          </div>
        </header>

        {workspaceMessage ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
            {workspaceMessage}
          </p>
        ) : null}

        {activeCard ? (
          <StructuredCardEditor
            activeCard={activeCard}
            setActiveCard={setActiveCard}
          />
        ) : (
          <div className="flex min-h-64 flex-col justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 p-6 text-center">
            {currentFilePath ? (
              <p className="font-mono text-xs text-zinc-400">
                Cached selection: {currentFilePath}
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                Click Import File or drop any verified PNG, CHARX, or JSON card
                onto the window to begin editing.
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
