"use client";

import { BookMarked } from "lucide-react";

type LoreActivationBadgeProps = {
  activeLoreSnippet: string;
};

export function LoreActivationBadge({
  activeLoreSnippet,
}: LoreActivationBadgeProps) {
  if (!activeLoreSnippet.trim()) {
    return null;
  }

  return (
    <div className="mx-auto mb-2 flex max-w-3xl items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 shadow-lg shadow-emerald-950/10">
      <div className="flex min-w-0 items-center gap-2">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <BookMarked className="size-3.5 shrink-0 text-emerald-300" />
        <span className="truncate font-bold">Lore recalled</span>
      </div>
      <span className="hidden truncate text-muted-foreground sm:block">
        Relevant world info was remembered for this reply.
      </span>
    </div>
  );
}
