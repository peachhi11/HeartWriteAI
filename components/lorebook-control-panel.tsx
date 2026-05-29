"use client";

import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import {
  createImportedLorebookArtifact,
  type GeneratedLorebookArtifact,
} from "@/features/generation/workflows";
import { LoreControlSurface } from "@/components/lore-control-surface";
import {
  generatedLorebookArtifactToV3Document,
  importLorebookV3Json,
  serializeLorebookV3Document,
} from "@/features/lorebooks/adapters";
import {
  deleteLorebookLibraryItem,
  saveLorebookLibraryItem,
  useLorebookLibrary,
} from "@/hooks/useLorebookLibrary";
import {
  importAndCompileLorebook,
  removeLorebookFile,
  toggleLorebookActiveState,
} from "@/lib/tauri/loreManager";
import { cn } from "@/lib/utils";
import type { LorebookConfig } from "@/types/lorebook";

type LorebookControlPanelProps = {
  activeLorebookId?: string | null;
  isOpen: boolean;
  onActivateLorebook?: (lorebook: GeneratedLorebookArtifact) => void;
  onClose: () => void;
  onDeactivateLorebook?: (lorebookId: string) => void;
  variant?: "dock" | "drawer";
};

const DISABLED_LOREBOOKS_STORAGE_KEY = "heartwriteai:disabled-lorebooks";

export function LorebookControlPanel({
  activeLorebookId = null,
  isOpen,
  onActivateLorebook,
  onClose,
  onDeactivateLorebook,
  variant = "drawer",
}: LorebookControlPanelProps) {
  const library = useLorebookLibrary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [disabledLorebookIds, setDisabledLorebookIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setDisabledLorebookIds(loadDisabledLorebookIds());
    });
  }, []);

  const bookConfigs = useMemo(
    () =>
      library.items.map((item) =>
        toLorebookConfig(item, activeLorebookId, disabledLorebookIds),
      ),
    [activeLorebookId, disabledLorebookIds, library.items],
  );
  const isDocked = variant === "dock";

  async function importJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const document = importLorebookV3Json(await file.text(), file.name);
      const artifact = createImportedLorebookArtifact(document, file.name);
      const serialized = serializeLorebookV3Document(document);

      await importAndCompileLorebook(artifact.id, serialized);
      await saveLorebookLibraryItem(artifact);
      await library.refresh();
      onActivateLorebook?.(artifact);
      setStatusMessage(
        `Imported ${document.data.name ?? file.name} with ${document.data.entries.length} entries.`,
      );
    } catch (error) {
      setStatusMessage(
        `Import failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsSyncing(false);
    }
  }

  function activateLorebook(item: GeneratedLorebookArtifact) {
    if (disabledLorebookIds.has(item.id)) {
      setStatusMessage(`Turn on ${item.title} before attaching it to this chat.`);
      return;
    }

    onActivateLorebook?.({
      ...item,
      v3Document: item.v3Document ?? generatedLorebookArtifactToV3Document(item),
    });
    setStatusMessage(`Attached ${item.title} to the current chat.`);
  }

  async function handleToggleState(
    item: GeneratedLorebookArtifact,
    isEnabled: boolean,
  ) {
    try {
      await toggleLorebookActiveState(item.id, isEnabled);
      setDisabledLorebookIds((current) => {
        const next = new Set(current);
        if (isEnabled) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        persistDisabledLorebookIds(next);
        return next;
      });

      if (!isEnabled && activeLorebookId === item.id) {
        onDeactivateLorebook?.(item.id);
      }

      setStatusMessage(
        `${item.title} is now ${isEnabled ? "on" : "muted"} for this chat.`,
      );
      void library.refresh();
    } catch (error) {
      setStatusMessage(
        `Could not change lorebook: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async function handlePurgeBook(item: GeneratedLorebookArtifact) {
    if (
      !confirm(
        `Permanently remove "${item.title}" from your lorebook library? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await removeLorebookFile(item.id);
      await deleteLorebookLibraryItem(item.id);
      setDisabledLorebookIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        persistDisabledLorebookIds(next);
        return next;
      });

      if (activeLorebookId === item.id) {
        onDeactivateLorebook?.(item.id);
      }

      await library.refresh();
      setStatusMessage(`Removed ${item.title} from your lorebook library.`);
    } catch (error) {
      setStatusMessage(
        `Removal failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return (
    <>
      {!isDocked ? (
        <button
          aria-label="Close lorebook drawer"
          className={cn(
            "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={onClose}
          type="button"
        />
      ) : null}

      <aside
        aria-label="Lorebook library controls"
        className={cn(
          isDocked
            ? "flex h-full w-full max-w-[280px] flex-col border-l border-border/60 bg-card/45 p-3 text-foreground backdrop-blur"
            : "fixed right-0 top-0 z-50 flex h-full w-full max-w-xs transform-gpu flex-col border-l border-border/80 bg-card/95 p-4 text-foreground shadow-2xl backdrop-blur-xl transition-transform duration-theatrical ease-snappy-slide lg:hidden",
          !isDocked && (isOpen ? "translate-x-0" : "translate-x-full"),
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 pb-3">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Lorebook Library
            </p>
            <h2 className="text-base font-black">Linked Lorebooks</h2>
            <p className="text-xs text-muted-foreground">
              Attach world info files to the current chat.
            </p>
          </div>
          {!isDocked ? (
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-bold text-muted-foreground transition hover:text-foreground"
              onClick={onClose}
              type="button"
            >
              Hide
              <X className="size-3.5" />
            </button>
          ) : null}
        </header>

        <input
          accept=".json,application/json"
          className="sr-only"
          onChange={importJsonFile}
          ref={fileInputRef}
          type="file"
        />

        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full rounded-xl border border-border/70 bg-background/75 pl-9 pr-3 text-sm outline-none transition focus:border-primary/60"
              onChange={(event) => library.setQuery(event.currentTarget.value)}
              placeholder="Search lorebooks or keywords..."
              type="search"
              value={library.query}
            />
          </div>

          {library.error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {library.error}
            </p>
          ) : null}

          {statusMessage ? (
            <p className="rounded-xl border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground">
              {statusMessage}
            </p>
          ) : null}

          <LoreControlSurface
            installedBooks={bookConfigs}
            isImporting={isSyncing}
            isLoading={library.loading}
            onAttachBook={(bookId) => {
              const item = library.items.find((candidate) => candidate.id === bookId);
              if (item) {
                activateLorebook(item);
              }
            }}
            onImportTrigger={() => fileInputRef.current?.click()}
            onRefresh={() => void library.refresh()}
            onRemoveBook={(bookId) => {
              const item = library.items.find((candidate) => candidate.id === bookId);
              if (item) {
                void handlePurgeBook(item);
              }
            }}
            onToggleBook={(bookId, isEnabled) => {
              const item = library.items.find((candidate) => candidate.id === bookId);
              if (item) {
                void handleToggleState(item, isEnabled);
              }
            }}
          />
        </div>
      </aside>
    </>
  );
}

function toLorebookConfig(
  item: GeneratedLorebookArtifact,
  activeLorebookId: string | null,
  disabledLorebookIds: Set<string>,
): LorebookConfig {
  const document = item.v3Document ?? generatedLorebookArtifactToV3Document(item);
  const serialized = serializeLorebookV3Document(document);
  const enabled = !disabledLorebookIds.has(item.id);
  const keywords = Array.from(
    new Set(
      document.data.entries
        .flatMap((entry) => entry.keys)
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );

  return {
    description:
      document.data.description ??
      item.summary.aiLoreInstruction ??
      "Saved lorebook.",
    entryCount: document.data.entries.length,
    fileSizeKb: Math.max(1, Math.ceil(new Blob([serialized]).size / 1024)),
    enabled,
    id: item.id,
    keywords,
    status: enabled && activeLorebookId === item.id ? "compiled" : "idle",
    title: document.data.name ?? item.title,
  };
}

function loadDisabledLorebookIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(DISABLED_LOREBOOKS_STORAGE_KEY) ?? "[]",
    );
    return new Set<string>(
      Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string")
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

function persistDisabledLorebookIds(disabledLorebookIds: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    DISABLED_LOREBOOKS_STORAGE_KEY,
    JSON.stringify([...disabledLorebookIds]),
  );
}
