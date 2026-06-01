"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Dices,
  Search,
  UserRound,
} from "lucide-react";

import type { CacheItemSummary, useCardLibrary } from "@/hooks/useCardLibrary";
import { getLocalAssetUrl } from "@/lib/tauri/localAssetUrl";
import { cn } from "@/lib/utils";

interface CharacterCarouselBrowserProps {
  library: ReturnType<typeof useCardLibrary>;
  onCardSelect?: (filePath: string) => void;
}

export function CharacterCarouselBrowser({
  library,
  onCardSelect,
}: CharacterCarouselBrowserProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [queryDraft, setQueryDraft] = useState(library.filters.query ?? "");
  const boundedActiveIndex = clampIndex(activeIndex, library.items.length);
  const activeCard = library.items[boundedActiveIndex] ?? null;

  const activeTags = useMemo(
    () => (activeCard?.tags ?? []).slice(0, 8),
    [activeCard],
  );

  function commitSearch(value: string) {
    setQueryDraft(value);
    setActiveIndex(0);
    library.updateSearchQuery(value);
  }

  function goToPrevious() {
    if (library.items.length === 0) {
      return;
    }

    setActiveIndex((index) =>
      (index - 1 + library.items.length) % library.items.length,
    );
  }

  function goToNext() {
    if (library.items.length === 0) {
      return;
    }

    setActiveIndex((index) => (index + 1) % library.items.length);
  }

  function chooseRandom() {
    if (library.items.length <= 1) {
      return;
    }

    setActiveIndex((index) => {
      let nextIndex = index;
      while (nextIndex === index) {
        nextIndex = Math.floor(Math.random() * library.items.length);
      }
      return nextIndex;
    });
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border bg-card shadow-xl">
      <header className="grid gap-4 border-b bg-muted/25 p-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <Archive className="size-4" />
            Character Selection
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Carousel Browser
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Browse saved CCV3/PNG characters by name, trope, framework, or tag.
            This view is fully client-side for the Tauri static export shell.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto]">
          <label className="relative block">
            <span className="sr-only">Search saved characters</span>
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={queryDraft}
              onChange={(event) => commitSearch(event.currentTarget.value)}
              placeholder="Search vampire, rival, knight..."
              className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <button
            type="button"
            onClick={chooseRandom}
            disabled={library.loading || library.items.length <= 1}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Dices className="size-4" />
            Random
          </button>
        </div>
      </header>

      <div className="p-5">
        <CharacterCarouselStage
          activeCard={activeCard}
                activeIndex={boundedActiveIndex}
          activeTags={activeTags}
          isDesktopRuntime={library.isDesktopRuntime}
          isLoading={library.loading}
          totalItems={library.items.length}
          onCardSelect={onCardSelect}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />

        <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
          <span>
            {library.isDesktopRuntime
              ? `${library.metadata.totalCount} saved character${library.metadata.totalCount === 1 ? "" : "s"}`
              : "Desktop library cache appears inside the Tauri app."}
          </span>
          {library.metadata.totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(0);
                  library.setPage(library.metadata.currentPage - 1);
                }}
                disabled={library.loading || library.metadata.currentPage <= 1}
                className="rounded-md border px-2 py-1 font-semibold transition hover:bg-muted disabled:opacity-40"
              >
                Page Back
              </button>
              <span className="font-mono">
                {library.metadata.currentPage}/{library.metadata.totalPages}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(0);
                  library.setPage(library.metadata.currentPage + 1);
                }}
                disabled={
                  library.loading ||
                  library.metadata.currentPage >= library.metadata.totalPages
                }
                className="rounded-md border px-2 py-1 font-semibold transition hover:bg-muted disabled:opacity-40"
              >
                Page Next
              </button>
            </div>
          ) : null}
        </div>

        {library.items.length > 0 ? (
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {library.items.map((card, index) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "grid min-w-44 gap-2 rounded-xl border bg-background p-2 text-left transition hover:border-primary/35",
                  index === boundedActiveIndex &&
                    "border-primary/60 bg-primary/5 shadow-sm",
                  !card.file_exists &&
                    !card.file_path.startsWith("/mock/") &&
                    "border-amber-500/30 opacity-70",
                )}
              >
                <CharacterCarouselAvatar
                  card={card}
                  className="aspect-[4/3] rounded-lg"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{card.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {card.framework || "Character card"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), length - 1);
}

function CharacterCarouselStage({
  activeCard,
  activeIndex,
  activeTags,
  isDesktopRuntime,
  isLoading,
  onCardSelect,
  onNext,
  onPrevious,
  totalItems,
}: {
  activeCard: CacheItemSummary | null;
  activeIndex: number;
  activeTags: string[];
  isDesktopRuntime: boolean;
  isLoading: boolean;
  onCardSelect?: (filePath: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  totalItems: number;
}) {
  if (isLoading) {
    return (
      <div className="grid min-h-96 animate-pulse rounded-2xl border bg-muted/40" />
    );
  }

  if (!isDesktopRuntime || !activeCard) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed bg-background/60 p-8 text-center">
        <UserRound className="mb-4 size-12 text-muted-foreground/35" />
        <h3 className="text-xl font-semibold">No character selected</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Import or save PNG/CCV3 character cards in the desktop app, then use
          this carousel to browse them without a multi-step wizard.
        </p>
      </div>
    );
  }

  const isMissing = !activeCard.file_exists && !activeCard.file_path.startsWith("/mock/");

  return (
    <div className="grid overflow-hidden rounded-2xl border bg-background lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
      <CharacterCarouselAvatar
        card={activeCard}
        className="min-h-96 border-b lg:border-b-0 lg:border-r"
      />

      <div className="flex min-h-96 flex-col justify-center p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {activeTags.length > 0 ? (
            activeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              Untagged
            </span>
          )}
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {activeCard.framework || "Character Card"}
        </p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight">
          {activeCard.name}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {activeCard.relationship || "Balanced dynamics"}
        </p>
        <p className="mt-3 max-w-2xl break-all font-mono text-xs text-muted-foreground/80">
          {activeCard.file_path}
        </p>
        {isMissing ? (
          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
            This library record points to a file that is missing on disk.
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPrevious}
            disabled={totalItems <= 1}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => onCardSelect?.(activeCard.file_path)}
            disabled={!onCardSelect || isMissing}
            className="rounded-xl bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Select Character
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={totalItems <= 1}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {activeIndex + 1} of {totalItems} on this page.
        </p>
      </div>
    </div>
  );
}

function CharacterCarouselAvatar({
  card,
  className,
}: {
  card: CacheItemSummary;
  className?: string;
}) {
  const canPreview = /\.(apng|png)$/i.test(card.file_path);
  const assetUrl = canPreview ? getLocalAssetUrl(card.file_path) : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const canRenderImage = assetUrl && assetUrl !== failedSrc;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted/40",
        className,
      )}
    >
      {canRenderImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${card.name} avatar`}
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
          onError={() => setFailedSrc(assetUrl)}
          src={assetUrl}
        />
      ) : (
        <div className="flex size-full min-h-32 flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,var(--liquid-tint),transparent_58%)] p-4 text-center">
          <UserRound className="size-12 text-muted-foreground/30" />
          <p className="max-w-52 text-xs font-medium text-muted-foreground/75">
            {canPreview ? "Avatar preview unavailable" : "No PNG preview"}
          </p>
        </div>
      )}
    </div>
  );
}
