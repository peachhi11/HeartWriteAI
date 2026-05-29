"use client";

import { useState } from "react";
import { BookMarked, Clock3, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LoreRecallAuditLog } from "@/types/lorebook";

type ContextRecallInspectorProps = {
  onClearAuditLog: () => void;
  recallLogs: LoreRecallAuditLog[];
};

export function ContextRecallInspector({
  onClearAuditLog,
  recallLogs,
}: ContextRecallInspectorProps) {
  const [activeRecallId, setActiveRecallId] = useState<string | null>(null);

  return (
    <section className="flex max-h-72 min-h-[12rem] w-full flex-col rounded-xl border border-border/80 bg-background/80 p-3 text-foreground shadow-2xl backdrop-blur">
      <header className="mb-2 flex shrink-0 items-center justify-between border-b border-border/70 pb-2">
        <div className="min-w-0">
          <h3 className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
            Lore Recall
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            Remembered this chat
          </p>
        </div>
        <span className="rounded-md border border-border/70 bg-card/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-muted-foreground">
          {recallLogs.length}
        </span>
      </header>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5">
        {recallLogs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[10px] italic text-muted-foreground">
            <BookMarked className="size-5 opacity-60" />
            No lore has been recalled yet.
          </div>
        ) : null}

        {recallLogs.map((log) => {
          const isExpanded = activeRecallId === log.id;

          return (
            <article
              className={cn(
                "rounded-md border p-2 transition duration-200",
                isExpanded
                  ? "border-emerald-500/35 bg-card ring-1 ring-emerald-500/20"
                  : "border-border/60 bg-card/35 hover:bg-card/60",
              )}
              key={log.id}
            >
              <button
                className="flex w-full items-start justify-between gap-2 text-left"
                onClick={() => setActiveRecallId(isExpanded ? null : log.id)}
                type="button"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-bold text-foreground">
                    {log.bookTitle}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {log.matchedKeys.slice(0, 4).map((key) => (
                      <span
                        className="max-w-full truncate rounded border border-emerald-500/20 bg-emerald-500/10 px-1 py-0.5 font-mono text-[8px] text-emerald-500"
                        key={`${log.id}:${key}`}
                      >
                        {key}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 font-mono text-[8px] text-muted-foreground">
                  <Clock3 className="size-3" />
                  {log.timestamp}
                </span>
              </button>

              {isExpanded ? (
                <div className="mt-2 space-y-1 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
                  <p className="max-h-24 overflow-y-auto rounded-md border border-border/60 bg-background/70 p-2 leading-relaxed">
                    {log.injectedSnippet}
                  </p>
                  <p className="truncate font-mono text-[8px] uppercase">
                    Chat turn: {log.messageId}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {recallLogs.length > 0 ? (
        <div className="mt-2 shrink-0 border-t border-border/70 pt-2">
          <button
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border/70 bg-card/70 text-[9px] font-black uppercase tracking-wider text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
            onClick={onClearAuditLog}
            type="button"
          >
            <Trash2 className="size-3" />
            Clear Recall Log
          </button>
        </div>
      ) : null}
    </section>
  );
}
