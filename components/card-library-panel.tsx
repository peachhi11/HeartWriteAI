"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Tags,
} from "lucide-react";

import {
  SearchFilters,
  useCardLibrary,
} from "@/hooks/useCardLibrary";

export interface CardLibraryPanelProps {
  library: ReturnType<typeof useCardLibrary>;
  onCardSelect: (filePath: string) => void;
}

const frameworks = [
  "Sandbox",
  "Narrative RPG",
  "Text Adventure",
  "Scene-Locked",
] as const;

const relationships = [
  "Symmetric",
  "Asymmetric (Bot Dominant)",
  "Asymmetric (User Dominant)",
  "Antagonistic",
] as const;

export default function CardLibraryPanel({
  library,
  onCardSelect,
}: CardLibraryPanelProps) {
  const { items, metadata, loading, error, filters, setPage, setFilters } =
    library;
  const [searchTerm, setSearchTerm] = useState(filters.query ?? "");
  const [tagSearchTerm, setTagSearchTerm] = useState(filters.tag ?? "");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters((previous) => ({
        ...previous,
        query: searchTerm.trim() || undefined,
        page: 1,
      }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, setFilters]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters((previous) => ({
        ...previous,
        tag: tagSearchTerm.trim() || undefined,
        page: 1,
      }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [tagSearchTerm, setFilters]);

  function handleDropdownChange(
    key: Extract<keyof SearchFilters, "framework" | "relationship">,
    value: string,
  ) {
    setFilters((previous) => ({
      ...previous,
      [key]: value === "ALL" ? undefined : value,
      page: 1,
    }));
  }

  return (
    <aside className="flex h-screen w-84 shrink-0 select-none flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="shrink-0 space-y-3 border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Card Index Cache
          </h2>
          <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
            {metadata.totalCount} active
          </span>
        </div>

        <label className="relative block">
          <span className="sr-only">Search character name or tags</span>
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search character name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Filter by explicit tag</span>
          <Tags className="absolute left-2.5 top-2.5 size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter by explicit tag..."
            value={tagSearchTerm}
            onChange={(event) => setTagSearchTerm(event.currentTarget.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.framework ?? "ALL"}
            onChange={(event) =>
              handleDropdownChange("framework", event.currentTarget.value)
            }
            className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
          >
            <option value="ALL">All Frameworks</option>
            {frameworks.map((framework) => (
              <option key={framework} value={framework}>
                {framework}
              </option>
            ))}
          </select>

          <select
            value={filters.relationship ?? "ALL"}
            onChange={(event) =>
              handleDropdownChange("relationship", event.currentTarget.value)
            }
            className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
          >
            <option value="ALL">All Dynamics</option>
            {relationships.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationshipLabel(relationship)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {error ? (
          <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
            <span className="text-xs font-bold text-rose-400">
              SQLite Backend Exception
            </span>
            <p className="mt-1 break-all font-mono text-[10px] text-zinc-500">
              {error}
            </p>
          </div>
        ) : null}

        {loading && !error ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-xs text-zinc-500">
            <Loader2 className="size-4 animate-spin text-violet-500" />
            <span>Scanning local disk storage...</span>
          </div>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-xs text-zinc-600">
            <Archive className="mb-2 size-6 text-zinc-700" />
            <p>No card records match current search filters.</p>
          </div>
        ) : null}

        {!loading && !error
          ? items.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onCardSelect(card.file_path)}
                className="group flex w-full flex-col items-start gap-1 rounded-lg border border-transparent p-2.5 text-left transition hover:border-zinc-800 hover:bg-zinc-900/40 focus:border-violet-500/50 focus:bg-violet-500/5 focus:outline-none"
              >
                <h3 className="w-full truncate text-xs font-bold text-zinc-200 transition group-hover:text-violet-400">
                  {card.name}
                </h3>

                <div className="mt-0.5 flex flex-wrap gap-1">
                  <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-400">
                    {card.framework}
                  </span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                    {relationshipLabel(card.relationship)}
                  </span>
                </div>

                {card.tags.length > 0 ? (
                  <div className="mt-1 flex max-h-8 w-full flex-wrap gap-x-1 gap-y-0.5 overflow-hidden">
                    {card.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-zinc-600"
                      >
                        #{tag.toLowerCase().replace(/\s+/g, "")}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            ))
          : null}
      </div>

      {metadata.totalPages > 1 ? (
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-800 bg-zinc-950 p-3">
          <button
            type="button"
            onClick={() => setPage(metadata.currentPage - 1)}
            disabled={metadata.currentPage === 1 || loading}
            className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-400"
          >
            <ChevronLeft className="size-3" />
            Prev
          </button>

          <span className="font-mono text-[10px] text-zinc-500">
            {metadata.currentPage} / {metadata.totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage(metadata.currentPage + 1)}
            disabled={metadata.currentPage === metadata.totalPages || loading}
            className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-400"
          >
            Next
            <ChevronRight className="size-3" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}

function relationshipLabel(relationship: string) {
  return relationship
    .replace("Asymmetric ", "")
    .replace("(", "")
    .replace(")", "");
}

