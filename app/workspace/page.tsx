"use client";

import { useState } from "react";
import { PanelLeftOpen, X } from "lucide-react";

import CardLibraryPanel from "@/components/card-library-panel";
import { CharacterLibraryWorkspace } from "@/components/character-library-workspace";
import { DevToolsPanel } from "@/components/dev-tools-panel";
import DropZoneOverlay from "@/components/DropZoneOverlay";
import ExpressionManager from "@/components/expression-manager";
import { FolderIntakeReview } from "@/components/folder-intake-review";
import { StudioShell } from "@/components/studio-shell";
import StructuredCardEditor from "@/components/structured-card-editor";
import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { useFileDialogs } from "@/hooks/useFileDialogs";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { savePersonaLibraryItem } from "@/hooks/usePersonaLibrary";
import { createPersonaArtifactFromCharacterCard } from "@/features/generation/workflows";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import { importBrowserCharacterCardFile } from "@/lib/character-card/importBrowserCharacterCardFile";
import { writeCharacterCardToPng } from "@/lib/character-card/writeCharacterCardToPng";
import { ExpressionSprite } from "@/types/character-card/ExpressionSprite";
import { ValidatedCharacterCardV3 } from "@/types/ccv3";

export default function WorkspacePage() {
  const [activeCard, setActiveCard] =
    useState<ValidatedCharacterCardV3 | null>(null);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [browserSourcePngData, setBrowserSourcePngData] =
    useState<Uint8Array | null>(null);
  const [selectedExpression, setSelectedExpression] =
    useState<ExpressionSprite | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const library = useCardLibrary(12);
  const { importCardFromPath, saveCard, saveWorkspaceChanges } =
    useCharacterLibrary();
  const {
    isDesktopRuntime,
    triggerCharxExport,
    triggerFolderIntakeSelect,
    triggerPngMetadataSave,
    triggerUniversalImport,
  } = useFileDialogs();
  const canSavePngMetadata = currentFilePath
    ? /\.(apng|png)$/i.test(currentFilePath)
    : false;

  function handleCardLoaded(
    card: ValidatedCharacterCardV3,
    filePath: string,
    sourcePngData: Uint8Array | null = null,
  ) {
    setActiveCard(card);
    setCurrentFilePath(filePath);
    setBrowserSourcePngData(sourcePngData);
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

    if (!isDesktopRuntime) {
      setWorkspaceMessage(
        "Browser preview can download a copy, but saving back to the original file needs the desktop app.",
      );
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

  async function handleSaveMasterCharx() {
    if (!activeCard) {
      return;
    }

    if (!isDesktopRuntime) {
      setWorkspaceMessage(
        "Browser preview can download a JSON copy, but saving a CHARX master needs the desktop app.",
      );
      return;
    }

    setIsSaving(true);
    setWorkspaceMessage("Saving CHARX master to the local card library...");

    const result = await saveCard(activeCard);

    setIsSaving(false);

    if (result.ok && result.filePath) {
      setCurrentFilePath(result.filePath);
      library.refresh();
      setWorkspaceMessage(`Saved CHARX master to ${result.filePath}.`);
    } else {
      setWorkspaceMessage(result.error ?? "CHARX master save failed.");
    }
  }

  async function handleManualImportClick() {
    if (!isDesktopRuntime) {
      setWorkspaceMessage("Use the browser file picker or drag a PNG/JSON card onto the workspace.");
      return;
    }

    const result = await triggerUniversalImport();
    if (!result) {
      return;
    }

    handleCardLoaded(result.card, result.path, null);
    setWorkspaceMessage(`Loaded ${result.card.data.name} from ${result.path}.`);
  }

  async function handleBrowserImportFile(file: File | null) {
    if (!file) {
      return;
    }

    setWorkspaceMessage(`Loading ${file.name}...`);

    try {
      const result = await importBrowserCharacterCardFile(file);
      handleCardLoaded(result.card, result.path, result.sourcePngData);
      setWorkspaceMessage(`Loaded ${result.card.data.name} from ${result.path}.`);
    } catch (error) {
      setWorkspaceMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function handleExportWorkspaceCharx() {
    if (!activeCard || !currentFilePath) {
      return;
    }

    if (!isDesktopRuntime) {
      setWorkspaceMessage("CHARX export needs the desktop app.");
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

    if (!isDesktopRuntime) {
      handleBrowserDownloadPng();
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

  function handleBrowserDownloadPng() {
    if (!activeCard || !browserSourcePngData) {
      setWorkspaceMessage(
        "Download PNG needs a PNG card source. JSON cards can be downloaded as JSON.",
      );
      return;
    }

    const updatedPngData = writeCharacterCardToPng(browserSourcePngData, activeCard);
    const fileName = createSafeCharacterFileName(
      activeCard.data.name || currentFilePath || "character",
      "_edited.png",
    );

    downloadUint8Array(updatedPngData, fileName, "image/png");
    setWorkspaceMessage(`Downloaded ${fileName}.`);
  }

  function handleBrowserDownloadJson() {
    if (!activeCard) {
      return;
    }

    const encodedCard = new TextEncoder().encode(
      JSON.stringify(activeCard, null, 2),
    );
    const fileName = createSafeCharacterFileName(
      activeCard.data.name || currentFilePath || "character",
      ".json",
    );

    downloadUint8Array(encodedCard, fileName, "application/json");
    setWorkspaceMessage(`Downloaded ${fileName}.`);
  }

  async function handleConvertActiveCardToPersona() {
    if (!activeCard) {
      return;
    }

    const persona = createPersonaArtifactFromCharacterCard(activeCard);
    await savePersonaLibraryItem(persona);
    setWorkspaceMessage(
      `Converted ${activeCard.data.name} into ${persona.name} and saved it to the persona library.`,
    );
  }

  return (
    <StudioShell
      eyebrow="Character Cards"
      title="Character Card Studio"
      subtitle={currentFilePath ?? "No card loaded yet."}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            <PanelLeftOpen className="size-3.5" />
            Libraries
          </button>
          {isDesktopRuntime ? (
            <button
              type="button"
              onClick={handleManualImportClick}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Import
            </button>
          ) : (
            <label className="cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted">
              Import
              <input
                type="file"
                accept=".png,.apng,.json"
                className="sr-only"
                onChange={(event) => {
                  void handleBrowserImportFile(event.currentTarget.files?.[0] ?? null);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          )}
          {activeCard && isDesktopRuntime ? (
            <>
              <button
                type="button"
                onClick={handleSaveMasterCharx}
                disabled={isSaving}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                title="Save this card as a CHARX master in the local card library."
              >
                {isSaving ? "Saving..." : "Save Master"}
              </button>
              <button
                type="button"
                onClick={handlePersistWorkspaceChanges}
                disabled={isSaving || !currentFilePath}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                title="Save edited data back to the active source file."
              >
                Save Source
              </button>
              <button
                type="button"
                onClick={handleSaveWorkspacePngAs}
                disabled={!canSavePngMetadata}
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 md:inline-flex"
                title={
                  canSavePngMetadata
                    ? "Save this card to a new PNG destination."
                    : "Save As PNG needs a PNG/APNG source image."
                }
              >
                Save PNG
              </button>
              <button
                type="button"
                onClick={handleExportWorkspaceCharx}
                disabled={!currentFilePath}
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 md:inline-flex"
              >
                Export CHARX...
              </button>
            </>
          ) : null}
          {activeCard && !isDesktopRuntime ? (
            <>
              <button
                type="button"
                onClick={handleBrowserDownloadPng}
                disabled={!browserSourcePngData}
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 md:inline-flex"
                title={
                  browserSourcePngData
                    ? "Download a PNG copy with the edited CCV3 metadata."
                    : "PNG download needs a PNG/APNG source card."
                }
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={handleBrowserDownloadJson}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                title="Download the edited CCV3 card as JSON."
              >
                Download JSON
              </button>
            </>
          ) : null}
        </div>
      }
    >
      <div className="relative grid gap-5">
        <DropZoneOverlay
          onAssetTranscoded={(filePath) =>
            setWorkspaceMessage(`Converted image asset to ${filePath}.`)
          }
          onCardParsed={(parsed, filePath, sourcePngData) => {
            handleCardLoaded(parsed, filePath, sourcePngData ?? null);
            setWorkspaceMessage(null);
          }}
          onDropError={setWorkspaceMessage}
        />

        {libraryOpen ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close character library"
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setLibraryOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(24rem,calc(100vw-2rem))] max-w-full flex-col border-r bg-zinc-950 shadow-2xl">
              <button
                type="button"
                aria-label="Close character library"
                onClick={() => setLibraryOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-md border border-zinc-800 bg-zinc-950/90 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
              >
                <X className="size-4" />
              </button>
              <CardLibraryPanel
                className="h-full w-full border-0"
                library={library}
                onCardSelect={(filePath) => {
                  setLibraryOpen(false);
                  void handleCardSelect(filePath);
                }}
                onPersonaSelect={(persona) => {
                  setLibraryOpen(false);
                  setWorkspaceMessage(`Selected persona: ${persona.name}.`);
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="min-w-0 space-y-6">
          {workspaceMessage ? (
            <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
              {workspaceMessage}
            </p>
          ) : null}

          <FolderIntakeReview
            isDesktopRuntime={isDesktopRuntime}
            onChooseFolder={triggerFolderIntakeSelect}
            onImported={library.refresh}
          />

          <CharacterLibraryWorkspace
            activeCard={activeCard}
            currentFilePath={currentFilePath}
            library={library}
            onCardSelect={(filePath) => {
              void handleCardSelect(filePath);
            }}
            onConvertToPersona={() => {
              void handleConvertActiveCardToPersona();
            }}
            onOpenLibraryDrawer={() => setLibraryOpen(true)}
          />

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
                  Import or drop a PNG/JSON character card to begin editing.
                  CHARX and image-asset drops are available in the desktop app.
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
      </div>
    </StudioShell>
  );
}

function createSafeCharacterFileName(name: string, suffix: string) {
  const safeName = name
    .trim()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeName || "character"}${suffix}`;
}
