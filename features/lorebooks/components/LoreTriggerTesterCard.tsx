"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { BookMarked, SearchCheck } from "lucide-react";

import type { GeneratedLorebookArtifact } from "@/features/generation/workflows";
import { generatedLorebookArtifactToV3Document } from "@/features/lorebooks/adapters";
import { classifyTropeInput } from "@/lib/character-card/tropeMatcher";
import { doesLoreActivationKeyMatch } from "@/lib/tauri/loreActivation";
import { cn } from "@/lib/utils";
import type { RegexMatchResult } from "@/types/regexConsole";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";

type LoreTriggerTesterCardProps = {
  lorebooks: GeneratedLorebookArtifact[];
};

export function LoreTriggerTesterCard({
  lorebooks,
}: LoreTriggerTesterCardProps) {
  const [testInput, setTestInput] = useState("");
  const matches = useMemo(
    () => findLoreTriggerMatches(lorebooks, testInput),
    [lorebooks, testInput],
  );
  const hasInput = testInput.trim().length > 0;

  return (
    <section className="rounded-xl border bg-card/85 p-4 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3 border-b pb-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Lore Trigger Tester
          </p>
          <h2 className="text-base font-black">Test Recall Words</h2>
          <p className="text-xs text-muted-foreground">
            Type a sample player message to see which lore entries would be
            remembered.
          </p>
        </div>
        <span
          className={cn(
            "rounded-md border bg-background/70 px-2 py-1 font-mono text-[10px] font-bold",
            matches.length > 0 ? "text-emerald-500" : "text-muted-foreground",
          )}
        >
          {matches.length} hits
        </span>
      </header>

      <div className="grid gap-3">
        <label className="grid gap-1.5 text-xs font-medium">
          Test message
          <textarea
            className="min-h-20 resize-none rounded-xl border bg-background/80 px-3 py-2 text-sm font-serif leading-6 outline-none transition focus:border-primary/60"
            onChange={(event) => setTestInput(event.currentTarget.value)}
            placeholder="Example: I ask about the old magic law and the family shield."
            value={testInput}
          />
        </label>

        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {!hasInput ? (
            <EmptyState
              icon={<SearchCheck className="size-5 opacity-60" />}
              text="Enter a sample message to test recall words."
            />
          ) : null}

          {hasInput && matches.length === 0 ? (
            <EmptyState
              icon={<BookMarked className="size-5 opacity-60" />}
              text="No lore entries would be recalled."
            />
          ) : null}

          {matches.map((match) => {
            const tropeConfig = COMPLETE_TROPE_MATRIX[match.tropeContext];

            return (
              <article
                className="rounded-lg border bg-background/70 p-3 shadow-sm"
                key={`${match.bookTitle}:${match.entryId}`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{match.bookTitle}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-[10px] font-bold uppercase tracking-wide",
                        tropeConfig.headerText,
                      )}
                    >
                      {tropeConfig.label}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border bg-card/70 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {match.entryId}
                  </span>
                </div>

                <div className="mb-2 flex flex-wrap gap-1">
                  {match.matchedKeywords.map((keyword) => (
                    <span
                      className="rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-500"
                      key={`${match.entryId}:${keyword}`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <p className="line-clamp-3 border-t pt-2 text-xs leading-5 text-muted-foreground">
                  {match.snippetPreview}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmptyState({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background/50 p-4 text-center text-xs italic text-muted-foreground">
      {icon}
      {text}
    </div>
  );
}

function findLoreTriggerMatches(
  lorebooks: GeneratedLorebookArtifact[],
  testInput: string,
): RegexMatchResult[] {
  const trimmedInput = testInput.trim();

  if (!trimmedInput) {
    return [];
  }

  return lorebooks.flatMap((lorebook) => {
    const document =
      lorebook.v3Document ?? generatedLorebookArtifactToV3Document(lorebook);
    const bookTitle = document.data.name ?? lorebook.title;
    const tropeContext = classifyTropeInput(
      [lorebook.trope, bookTitle, document.data.description]
        .filter(Boolean)
        .join(" "),
    );

    return document.data.entries.flatMap((entry, index) => {
      if (!entry.enabled || !entry.content.trim()) {
        return [];
      }

      const keys = [...entry.keys, ...(entry.secondary_keys ?? [])];
      const matchedKeywords = keys.filter((key) =>
        doesLoreActivationKeyMatch(trimmedInput, key, Boolean(entry.use_regex)),
      );

      if (matchedKeywords.length === 0) {
        return [];
      }

      return {
        bookTitle,
        entryId: String(entry.id ?? entry.name ?? `entry-${index + 1}`),
        matchedKeywords,
        snippetPreview: entry.content,
        tropeContext,
      };
    });
  });
}
