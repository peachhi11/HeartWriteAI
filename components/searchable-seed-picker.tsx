"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import {
  getSeedPickerEntries,
  searchSeedPickerEntries,
  type SeedPickerEntry,
  type SeedPickerEntryKind,
  type SeedPickerLane,
} from "@/data/seedPickerRegistry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchableSeedPickerProps {
  categories?: readonly string[];
  className?: string;
  description?: string;
  kinds?: readonly SeedPickerEntryKind[];
  label: string;
  lanes?: readonly SeedPickerLane[];
  maxResults?: number;
  onSelect: (entry: SeedPickerEntry) => void;
  placeholder?: string;
  selectedKeys?: readonly string[];
}

export function SearchableSeedPicker({
  categories,
  className,
  description,
  kinds,
  label,
  lanes,
  maxResults = 8,
  onSelect,
  placeholder = "Search seeds, tags, categories...",
  selectedKeys = [],
}: SearchableSeedPickerProps) {
  const [query, setQuery] = useState("");
  const selectedKeySet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const entries = useMemo(() => {
    if (query.trim()) {
      return searchSeedPickerEntries(query, {
        categories,
        kinds,
        lanes,
        limit: maxResults,
      });
    }

    return getSeedPickerEntries({ categories, kinds, lanes }).slice(0, maxResults);
  }, [categories, kinds, lanes, maxResults, query]);

  return (
    <section className={cn("grid gap-3 rounded-lg border bg-background/70 p-3", className)}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-black uppercase tracking-[0.16em] text-foreground">
            {label}
          </h3>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {query ? (
          <Button
            aria-label="Clear seed search"
            className="size-8 shrink-0"
            onClick={() => setQuery("")}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="size-3.5" />
          </Button>
        ) : null}
      </header>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoComplete="off"
          className="pl-8"
          data-no-field-copy="true"
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder={placeholder}
          value={query}
        />
      </label>

      <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
        {entries.length > 0 ? (
          entries.map((entry) => {
            const isSelected = selectedKeySet.has(entry.registryKey);

            return (
              <button
                key={entry.registryKey}
                className={cn(
                  "rounded-md border p-3 text-left transition hover:border-primary/50 hover:bg-muted",
                  isSelected
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/70 bg-background",
                )}
                onClick={() => onSelect(entry)}
                type="button"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {entry.label}
                  </span>
                  <Badge variant={entry.kind === "semantic" ? "default" : "secondary"}>
                    {entry.kind}
                  </Badge>
                  <Badge variant="outline">{entry.lane}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {entry.description || entry.value}
                </p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  {entry.sourceLabel} / {entry.category}
                </p>
                {entry.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.tags.slice(0, 4).map((tag) => (
                      <span
                        className="rounded-full border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        key={`${entry.registryKey}-${tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })
        ) : (
          <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
            No matching seeds found.
          </p>
        )}
      </div>
    </section>
  );
}
