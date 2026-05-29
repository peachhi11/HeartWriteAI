"use client";

import { useState } from "react";
import { Database, Link2, RefreshCw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LorebookConfig } from "@/types/lorebook";

type LoreControlSurfaceProps = {
  attachDisabledLabel?: string;
  attachLabel?: string;
  installedBooks: LorebookConfig[];
  isImporting?: boolean;
  isLoading?: boolean;
  onAttachBook?: (bookId: string) => void;
  onImportTrigger?: () => void;
  onRefresh?: () => void;
  onRemoveBook?: (bookId: string) => void;
  onToggleBook?: (bookId: string, isEnabled: boolean) => void;
};

export function LoreControlSurface({
  attachDisabledLabel = "Attach in Chat",
  attachLabel = "Attach to Chat",
  installedBooks,
  isImporting = false,
  isLoading = false,
  onAttachBook,
  onImportTrigger,
  onRefresh,
  onRemoveBook,
  onToggleBook,
}: LoreControlSurfaceProps) {
  const [focusedBookId, setFocusedBookId] = useState<string | null>(null);
  const activeCount = installedBooks.filter(
    (book) => book.enabled && book.status === "compiled",
  ).length;

  return (
    <div className="flex h-full min-h-0 w-full max-w-[280px] select-none flex-col rounded-xl border border-border/80 bg-background/80 p-3 text-foreground shadow-2xl backdrop-blur">
      <div className="mb-2 flex shrink-0 items-center justify-between border-b border-border/70 pb-2">
        <div className="min-w-0">
          <h3 className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Lorebooks
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            World info for this chat
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-md border border-border/70 bg-card/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-muted-foreground">
            {activeCount}/{installedBooks.length}
          </span>
          <button
            aria-label="Refresh lorebooks"
            className="inline-flex size-6 items-center justify-center rounded-md border border-border/60 bg-card/70 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className="size-3" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-center text-[10px] italic text-muted-foreground">
            Loading lorebooks...
          </div>
        ) : null}

        {!isLoading && installedBooks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[10px] italic text-muted-foreground">
            <Database className="size-5 opacity-60" />
            No lorebooks linked yet.
          </div>
        ) : null}

        {!isLoading &&
          installedBooks.map((book) => {
            const isCompiled = book.enabled && book.status === "compiled";
            const isFocused = focusedBookId === book.id;
            const canAttachBook = Boolean(onAttachBook);

            return (
              <article
                className={cn(
                  "group rounded-md border p-2 transition duration-200",
                  isCompiled
                    ? "border-emerald-500/35 bg-card/70 shadow-inner"
                    : "border-border/60 bg-card/35 opacity-70 hover:opacity-95",
                  isFocused && "border-primary/50 bg-card ring-1 ring-primary/25",
                )}
                key={book.id}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <button
                    className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                    onClick={() => setFocusedBookId(isFocused ? null : book.id)}
                    type="button"
                  >
                    <span className="relative flex size-1.5 shrink-0">
                      {isCompiled ? (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      ) : null}
                      <span
                        className={cn(
                          "relative inline-flex size-1.5 rounded-full",
                          isCompiled ? "bg-emerald-500" : "bg-muted-foreground/55",
                        )}
                      />
                    </span>
                    <span className="truncate text-[11px] font-bold tracking-tight text-foreground">
                      {book.title}
                    </span>
                  </button>

                  <span className="flex shrink-0 items-center gap-1.5">
                    <button
                      aria-label={`Remove ${book.title}`}
                      className="inline-flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveBook?.(book.id);
                      }}
                      type="button"
                    >
                      <Trash2 className="size-3" />
                    </button>

                    <button
                      aria-label={book.enabled ? "Mute lorebook" : "Turn lorebook on"}
                      className={cn(
                        "relative h-3 w-6 rounded-full border transition",
                        book.enabled
                          ? "border-primary/50 bg-primary/35"
                          : "border-border bg-background",
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleBook?.(book.id, !book.enabled);
                      }}
                      type="button"
                    >
                      <span
                        className={cn(
                          "absolute top-[2px] size-1.5 rounded-full transition-transform",
                          book.enabled
                            ? "translate-x-2.5 bg-primary"
                            : "-translate-x-2 bg-muted-foreground",
                        )}
                      />
                    </button>
                  </span>
                </div>

                {isFocused ? (
                  <div className="mt-1 space-y-1 border-t border-border/60 pt-1 text-[9px] text-muted-foreground">
                    <p className="line-clamp-2 italic leading-tight">
                      {book.description || "No description yet."}
                    </p>
                    <div className="flex justify-between font-mono text-[8px] font-bold uppercase">
                      <span>{book.entryCount} entries</span>
                      <span>{book.fileSizeKb}KB</span>
                    </div>
                    {book.keywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {book.keywords.slice(0, 5).map((keyword) => (
                          <span
                            className="max-w-full truncate rounded border border-border/50 bg-background/60 px-1 py-0.5 font-mono text-[8px]"
                            key={keyword}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <button
                      className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border/70 bg-card/70 py-1 text-[9px] font-black uppercase tracking-wide text-foreground transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={!book.enabled || !canAttachBook}
                      onClick={() => onAttachBook?.(book.id)}
                      type="button"
                    >
                      <Link2 className="size-3" />
                      {isCompiled
                        ? "Attached"
                        : canAttachBook
                          ? attachLabel
                          : attachDisabledLabel}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
      </div>

      <div className="mt-2 shrink-0 border-t border-border/70 pt-2">
        <button
          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border/70 bg-card/70 text-[9px] font-black uppercase tracking-wider text-muted-foreground transition hover:border-primary/50 hover:text-foreground disabled:cursor-wait disabled:opacity-60"
          disabled={isImporting}
          onClick={onImportTrigger}
          type="button"
        >
          {isImporting ? (
            <span className="size-3 animate-spin rounded-full border-2 border-muted border-t-primary" />
          ) : (
            <Link2 className="size-3" />
          )}
          Import Lorebook
        </button>
      </div>
    </div>
  );
}
