"use client";

import { useState } from "react";

import CardLibraryPanel from "@/components/card-library-panel";
import { DevToolsPanel } from "@/components/dev-tools-panel";
import DropZoneOverlay from "@/components/DropZoneOverlay";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { ValidatedCharacterCardV3 } from "@/types/ccv3";

export default function WorkspacePage() {
  const [activeCard, setActiveCard] =
    useState<ValidatedCharacterCardV3 | null>(null);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const library = useCardLibrary(12);

  return (
    <main className="relative flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <DropZoneOverlay
        onAssetTranscoded={(filePath) =>
          setWorkspaceMessage(`Converted image asset to ${filePath}.`)
        }
        onCardParsed={(parsed) => {
          setActiveCard(parsed);
          setWorkspaceMessage(null);
        }}
        onDropError={setWorkspaceMessage}
      />

      <CardLibraryPanel
        library={library}
        onCardSelect={(filePath) => {
          setSelectedFilePath(filePath);
          setWorkspaceMessage(`Selected cached card: ${filePath}`);
        }}
      />

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <header className="border-b border-zinc-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight">
            CCV3 Desktop Workspace
          </h1>
          <p className="text-xs text-zinc-400">
            Manage, edit, and index romantic character simulation card
            archetypes.
          </p>
        </header>

        {workspaceMessage ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
            {workspaceMessage}
          </p>
        ) : null}

        {activeCard ? (
          <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-md">
            <h2 className="text-xl font-bold text-violet-400">
              {activeCard.data.name}
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Spec Layout: {activeCard.spec} ({activeCard.spec_version})
            </p>
            <textarea
              className="mt-4 h-40 w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
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
            />
          </div>
        ) : (
          <div className="flex min-h-64 flex-col justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 p-6 text-center">
            {selectedFilePath ? (
              <p className="font-mono text-xs text-zinc-400">
                Cached selection: {selectedFilePath}
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                No workspace card selected from the index panel browser.
              </p>
            )}
          </div>
        )}

        <DevToolsPanel onSeeded={library.refresh} />
      </div>
    </main>
  );
}
