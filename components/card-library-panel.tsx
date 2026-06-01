"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Loader2,
  Search,
  Tags,
  UserRound,
} from "lucide-react";

import {
  SearchFilters,
  useCardLibrary,
} from "@/hooks/useCardLibrary";
import {
  PersonaLibraryItem,
  usePersonaLibrary,
} from "@/hooks/usePersonaLibrary";
import { cn } from "@/lib/utils";

export interface CardLibraryPanelProps {
  className?: string;
  library: ReturnType<typeof useCardLibrary>;
  onCardSelect: (filePath: string) => void;
  onPersonaSelect?: (persona: PersonaLibraryItem) => void;
}

type LibraryTab = "characters" | "personas";

const playStyleOptions = [
  {
    label: "Open-ended chat",
    value: "Sandbox",
  },
  {
    label: "Story roleplay",
    value: "Narrative RPG",
  },
  {
    label: "Choice adventure",
    value: "Text Adventure",
  },
  {
    label: "Single scene",
    value: "Scene-Locked",
  },
] as const;

const povOptions = [
  {
    label: "Any POV",
    tag: "ALL",
  },
  {
    label: "FemPOV",
    tag: "fempov",
  },
  {
    label: "MalePOV",
    tag: "malepov",
  },
  {
    label: "AnyPOV",
    tag: "anypov",
  },
  {
    label: "NBPOV",
    tag: "nbpov",
  },
] as const;

const characterRoleOptions = [
  {
    label: "Any character role",
    tag: "ALL",
  },
  {
    label: "Sub",
    tag: "submissive",
  },
  {
    label: "Domme",
    tag: "domme",
  },
  {
    label: "Dom",
    tag: "dominant",
  },
  {
    label: "Switch",
    tag: "switch",
  },
] as const;

const userRoleOptions = [
  {
    label: "Any user role",
    tag: "ALL",
  },
  {
    label: "User follows",
    tag: "user follows",
  },
  {
    label: "User leads",
    tag: "user leads",
  },
  {
    label: "User switches",
    tag: "user switches",
  },
] as const;

const tropeOptions = [
  {
    label: "Any trope",
    tag: "ALL",
  },
  {
    label: "Enemies to lovers",
    tag: "enemies to lovers",
  },
  {
    label: "Slow burn",
    tag: "slow burn",
  },
  {
    label: "Only one bed",
    tag: "only one bed",
  },
  {
    label: "Forbidden",
    tag: "forbidden",
  },
  {
    label: "Grumpy x sunshine",
    tag: "grumpy x sunshine",
  },
  {
    label: "Hurt/comfort",
    tag: "hurt/comfort",
  },
  {
    label: "Fake dating",
    tag: "fake dating",
  },
  {
    label: "Who hurt you?",
    tag: "who hurt you",
  },
  {
    label: "Dark romance",
    tag: "dark romance",
  },
  {
    label: "Dead dove",
    tag: "dead dove",
  },
  {
    label: "Omegaverse",
    tag: "omegaverse",
  },
  {
    label: "Rockstar AU",
    tag: "rockstar au",
  },
  {
    label: "Esports AU",
    tag: "esports au",
  },
  {
    label: "College AU",
    tag: "college au",
  },
  {
    label: "Mafia AU",
    tag: "mafia au",
  },
  {
    label: "Royal AU",
    tag: "royal au",
  },
] as const;

export default function CardLibraryPanel({
  className,
  library,
  onCardSelect,
  onPersonaSelect,
}: CardLibraryPanelProps) {
  const { items, metadata, loading, error, filters, setPage, setFilters } =
    library;
  const personaLibrary = usePersonaLibrary();
  const [activeTab, setActiveTab] = useState<LibraryTab>("characters");
  const [searchTerm, setSearchTerm] = useState(filters.query ?? "");
  const [tagSearchTerm, setTagSearchTerm] = useState(filters.tag ?? "");
  const [selectedPovTag, setSelectedPovTag] = useState("ALL");
  const [selectedCharacterRoleTag, setSelectedCharacterRoleTag] = useState("ALL");
  const [selectedUserRoleTag, setSelectedUserRoleTag] = useState("ALL");
  const [selectedTropeTag, setSelectedTropeTag] = useState("ALL");
  const [cleanMessage, setCleanMessage] = useState<string | null>(null);
  const [cleaningMissing, setCleaningMissing] = useState(false);

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
      const selectedTags = [
        selectedPovTag,
        selectedCharacterRoleTag,
        selectedUserRoleTag,
        selectedTropeTag,
        tagSearchTerm.trim(),
      ].filter((tag) => tag && tag !== "ALL");

      setFilters((previous) => ({
        ...previous,
        tag: undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        page: 1,
      }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [
    selectedCharacterRoleTag,
    selectedPovTag,
    selectedTropeTag,
    selectedUserRoleTag,
    tagSearchTerm,
    setFilters,
  ]);

  function handleDropdownChange(
    key: Extract<keyof SearchFilters, "framework">,
    value: string,
  ) {
    setFilters((previous) => ({
      ...previous,
      [key]: value === "ALL" ? undefined : value,
      page: 1,
    }));
  }

  async function handleCleanMissing() {
    setCleaningMissing(true);
    setCleanMessage(null);

    try {
      const removedCount = await library.cleanMissingPaths();
      setCleanMessage(
        removedCount > 0
          ? `Removed ${removedCount} missing path${removedCount === 1 ? "" : "s"}.`
          : "No missing paths found.",
      );
    } catch (error) {
      setCleanMessage(
        error instanceof Error ? error.message : "Could not clean missing paths.",
      );
    } finally {
      setCleaningMissing(false);
    }
  }

  return (
    <aside
      className={cn(
        "flex h-screen w-84 shrink-0 select-none flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-100",
        className,
      )}
    >
      <div className="shrink-0 space-y-3 border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Library
          </h2>
          <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
            {activeTab === "characters"
              ? metadata.totalCount
              : personaLibrary.metadata.totalCount}{" "}
            saved
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("characters")}
            className={cn(
              "rounded-md px-2 py-1.5 text-xs font-semibold transition",
              activeTab === "characters"
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200",
            )}
          >
            Characters
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("personas")}
            className={cn(
              "rounded-md px-2 py-1.5 text-xs font-semibold transition",
              activeTab === "personas"
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200",
            )}
          >
            Personas
          </button>
        </div>

        {activeTab === "characters" ? (
          <div className="space-y-3">
            <CharacterLibraryFilters
              filters={filters}
              searchTerm={searchTerm}
              selectedCharacterRoleTag={selectedCharacterRoleTag}
              selectedPovTag={selectedPovTag}
              selectedTropeTag={selectedTropeTag}
              selectedUserRoleTag={selectedUserRoleTag}
              tagSearchTerm={tagSearchTerm}
              onDropdownChange={handleDropdownChange}
              onSearchTermChange={setSearchTerm}
              onSelectedCharacterRoleTagChange={setSelectedCharacterRoleTag}
              onSelectedPovTagChange={setSelectedPovTag}
              onSelectedTropeTagChange={setSelectedTropeTag}
              onSelectedUserRoleTagChange={setSelectedUserRoleTag}
              onTagSearchTermChange={setTagSearchTerm}
            />
            {library.isDesktopRuntime ? (
              <div className="grid gap-1.5">
                <button
                  type="button"
                  onClick={() => void handleCleanMissing()}
                  disabled={cleaningMissing || loading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-wait disabled:opacity-45"
                >
                  <Eraser className="size-3" />
                  {cleaningMissing ? "Cleaning..." : "Clean Missing"}
                </button>
                {cleanMessage ? (
                  <p className="text-[11px] text-zinc-500">{cleanMessage}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <label className="relative block">
            <span className="sr-only">Search persona name or tag</span>
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Find a saved persona..."
              value={personaLibrary.query}
              onChange={(event) =>
                personaLibrary.setQuery(event.currentTarget.value)
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            />
          </label>
        )}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {activeTab === "characters" ? (
          <CharacterLibraryList
            error={error}
            items={items}
            library={library}
            loading={loading}
            onCardSelect={onCardSelect}
          />
        ) : (
          <PersonaLibraryList
            library={personaLibrary}
            onPersonaSelect={onPersonaSelect}
          />
        )}
      </div>

      {activeTab === "characters" && metadata.totalPages > 1 ? (
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

function CharacterLibraryFilters({
  filters,
  onDropdownChange,
  onSearchTermChange,
  onSelectedCharacterRoleTagChange,
  onSelectedPovTagChange,
  onSelectedTropeTagChange,
  onSelectedUserRoleTagChange,
  onTagSearchTermChange,
  searchTerm,
  selectedCharacterRoleTag,
  selectedPovTag,
  selectedTropeTag,
  selectedUserRoleTag,
  tagSearchTerm,
}: {
  filters: SearchFilters;
  onDropdownChange: (
    key: Extract<keyof SearchFilters, "framework">,
    value: string,
  ) => void;
  onSearchTermChange: (value: string) => void;
  onSelectedCharacterRoleTagChange: (value: string) => void;
  onSelectedPovTagChange: (value: string) => void;
  onSelectedTropeTagChange: (value: string) => void;
  onSelectedUserRoleTagChange: (value: string) => void;
  onTagSearchTermChange: (value: string) => void;
  searchTerm: string;
  selectedCharacterRoleTag: string;
  selectedPovTag: string;
  selectedTropeTag: string;
  selectedUserRoleTag: string;
  tagSearchTerm: string;
}) {
  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search character name</span>
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-500" />
        <input
          type="text"
          placeholder="Find a character..."
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.currentTarget.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
        />
      </label>

      <label className="relative block">
        <span className="sr-only">Search by tag</span>
        <Tags className="absolute left-2.5 top-2.5 size-3.5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search tags, like vampire or professor..."
          value={tagSearchTerm}
          onChange={(event) => onTagSearchTermChange(event.currentTarget.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={filters.framework ?? "ALL"}
          onChange={(event) =>
            onDropdownChange("framework", event.currentTarget.value)
          }
          className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
        >
          <option value="ALL">Any chat style</option>
          {playStyleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedPovTag}
          onChange={(event) =>
            onSelectedPovTagChange(event.currentTarget.value)
          }
          className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
        >
          {povOptions.map((option) => (
            <option key={option.tag} value={option.tag}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedCharacterRoleTag}
          onChange={(event) =>
            onSelectedCharacterRoleTagChange(event.currentTarget.value)
          }
          className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
        >
          {characterRoleOptions.map((option) => (
            <option key={option.tag} value={option.tag}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedUserRoleTag}
          onChange={(event) =>
            onSelectedUserRoleTagChange(event.currentTarget.value)
          }
          className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
        >
          {userRoleOptions.map((option) => (
            <option key={option.tag} value={option.tag}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedTropeTag}
          onChange={(event) =>
            onSelectedTropeTagChange(event.currentTarget.value)
          }
          className="col-span-2 cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-[10px] font-medium text-zinc-400 outline-none focus:border-zinc-700"
        >
          {tropeOptions.map((option) => (
            <option key={option.tag} value={option.tag}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function CharacterLibraryList({
  error,
  items,
  library,
  loading,
  onCardSelect,
}: {
  error: string | null;
  items: ReturnType<typeof useCardLibrary>["items"];
  library: ReturnType<typeof useCardLibrary>;
  loading: boolean;
  onCardSelect: (filePath: string) => void;
}) {
  return (
    <>
      {error ? (
          <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
            <span className="text-xs font-bold text-rose-400">
              Library could not load
            </span>
            <p className="mt-1 break-words text-[11px] text-zinc-500">
              {error}
            </p>
          </div>
      ) : null}

      {loading && !error ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 text-xs text-zinc-500">
          <Loader2 className="size-4 animate-spin text-violet-500" />
          <span>Looking through your saved characters...</span>
        </div>
      ) : null}

      {!library.isDesktopRuntime ? (
        <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-xs text-zinc-600">
          <Archive className="mb-2 size-6 text-zinc-700" />
          <p>Saved characters and tag suggestions appear in the desktop app.</p>
        </div>
      ) : null}

      {library.isDesktopRuntime && !loading && !error && items.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-xs text-zinc-600">
          <Archive className="mb-2 size-6 text-zinc-700" />
          <p>
            No saved characters match this search yet. Import a card or clear
            the filters to see tags.
          </p>
        </div>
      ) : null}

      {!loading && !error
        ? items.map((card) => {
            const isMissing = !card.file_exists && !card.file_path.startsWith("/mock/");

            return (
            <button
              key={card.id}
              type="button"
              onClick={() => onCardSelect(card.file_path)}
              className={`group flex w-full flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition focus:border-violet-500/50 focus:bg-violet-500/5 focus:outline-none ${
                isMissing
                  ? "border-amber-500/20 bg-amber-500/5 opacity-70 hover:border-amber-500/30"
                  : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/40"
              }`}
            >
              <h3 className="w-full truncate text-xs font-bold text-zinc-200 transition group-hover:text-violet-400">
                {card.name}
              </h3>

              <div className="mt-0.5 flex flex-wrap gap-1">
                <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-400">
                  {playStyleLabel(card.framework)}
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                  {relationshipLabel(card.relationship, card.tags)}
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
              {isMissing ? (
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                  Missing on disk
                </span>
              ) : null}
            </button>
            );
          })
        : null}
    </>
  );
}

function PersonaLibraryList({
  library,
  onPersonaSelect,
}: {
  library: ReturnType<typeof usePersonaLibrary>;
  onPersonaSelect?: (persona: PersonaLibraryItem) => void;
}) {
  if (library.error) {
    return (
      <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
        <span className="text-xs font-bold text-rose-400">
          Persona library could not load
        </span>
        <p className="mt-1 break-words text-[11px] text-zinc-500">
          {library.error}
        </p>
      </div>
    );
  }

  if (library.loading) {
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-2 text-xs text-zinc-500">
        <Loader2 className="size-4 animate-spin text-violet-500" />
        <span>Looking through your saved personas...</span>
      </div>
    );
  }

  if (library.items.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-xs text-zinc-600">
        <UserRound className="mb-2 size-6 text-zinc-700" />
        <p>
          No saved personas match this search yet. Saved user personas will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {library.items.map((persona) => (
        <button
          key={persona.id}
          type="button"
          onClick={() => onPersonaSelect?.(persona)}
          className="group flex w-full flex-col items-start gap-1 rounded-lg border border-transparent p-2.5 text-left transition hover:border-zinc-800 hover:bg-zinc-900/40 focus:border-violet-500/50 focus:bg-violet-500/5 focus:outline-none"
        >
          <h3 className="w-full truncate text-xs font-bold text-zinc-200 transition group-hover:text-violet-400">
            {persona.name}
          </h3>
          {persona.summary ? (
            <p className="line-clamp-2 text-[11px] leading-4 text-zinc-500">
              {persona.summary}
            </p>
          ) : null}
          {persona.tags.length > 0 ? (
            <div className="mt-1 flex max-h-8 w-full flex-wrap gap-x-1 gap-y-0.5 overflow-hidden">
              {persona.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-zinc-600"
                >
                  #{tag.toLowerCase().replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          ) : null}
          <span className="mt-1 text-[9px] font-medium uppercase tracking-wide text-zinc-700">
            Updated {formatRelativeDate(persona.updatedAt)}
          </span>
        </button>
      ))}
    </>
  );
}

function formatRelativeDate(timestamp: number) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formatter.format(new Date(timestamp));
}

function relationshipLabel(relationship: string, tags: string[]) {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  const roleLabel = characterRoleOptions.find((option) =>
    normalizedTags.includes(option.tag),
  )?.label;
  const povLabel = povOptions.find((option) =>
    normalizedTags.includes(option.tag),
  )?.label;

  if (roleLabel && povLabel && povLabel !== "AnyPOV") {
    return `${roleLabel} / ${povLabel}`;
  }

  if (roleLabel) {
    return roleLabel;
  }

  if (normalizedTags.includes("enemies to lovers")) {
    return "Enemies to lovers";
  }

  if (relationship === "Asymmetric (Bot Dominant)") {
    return "Dom";
  }

  if (relationship === "Asymmetric (User Dominant)") {
    return "User leads";
  }

  if (relationship === "Antagonistic") {
    return "Enemies to lovers";
  }

  return "Balanced dynamics";
}

function playStyleLabel(framework: string) {
  return (
    playStyleOptions.find((option) => option.value === framework)?.label ??
    framework
  );
}
