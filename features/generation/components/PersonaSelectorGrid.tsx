"use client";

import type * as React from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteSavedPersonaFile,
  fetchSavedPersonasList,
} from "@/lib/tauri/studioPersonas";
import { cn } from "@/lib/utils";
import {
  AXIS_MAPPING,
  type AxisFilter,
  type SavedPersonaMetadata,
} from "@/types/studio";
import { COMPLETE_TROPE_MATRIX } from "@/types/tropes";
import { FilterControlTray } from "./FilterControlTray";

interface PersonaSelectorGridProps {
  activeId?: string;
  onPersonaActivated: (persona: SavedPersonaMetadata) => void;
}

export function PersonaSelectorGrid(props: PersonaSelectorGridProps) {
  const [personas, setPersonas] = useState<SavedPersonaMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAxis, setActiveAxis] = useState<AxisFilter>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredPersonas = useMemo(
    () =>
      personas.filter((profile) =>
        matchesSearchQuery(profile, deferredSearchQuery) &&
        matchesAxisFilter(profile, activeAxis),
      ),
    [activeAxis, deferredSearchQuery, personas],
  );

  async function refreshPersonaManifest() {
    setIsLoading(true);
    setError(null);

    try {
      setPersonas(await fetchSavedPersonasList());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteProfile(
    event: React.MouseEvent<HTMLButtonElement>,
    persona: SavedPersonaMetadata,
  ) {
    event.stopPropagation();

    if (
      !window.confirm(
        `Permanently erase the persona template for "${persona.name}"?`,
      )
    ) {
      return;
    }

    setError(null);

    try {
      await deleteSavedPersonaFile(persona.id);
      setPersonas((current) =>
        current.filter((profile) => profile.id !== persona.id),
      );
      await refreshPersonaManifest();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void refreshPersonaManifest();
    });
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-md border bg-background/70 p-6 text-center text-xs font-mono uppercase tracking-wide text-muted-foreground">
        Loading saved personas...
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <section className="rounded-md border border-dashed bg-background/50 p-6 text-center">
        <p className="text-sm font-medium">No saved personas yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Save a persona draft or add JSON summaries to your persona folder,
          then rescan.
        </p>
        <Button
          className="mt-4"
          onClick={refreshPersonaManifest}
          size="sm"
          type="button"
          variant="outline"
        >
          <RefreshCw className="size-3.5" />
          Rescan
        </Button>
        {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wide text-muted-foreground">
            Saved Personas
          </h3>
          <p className="text-xs text-muted-foreground">
            Select a saved persona for this chat.
          </p>
        </div>
        <Button
          onClick={refreshPersonaManifest}
          size="sm"
          type="button"
          variant="outline"
        >
          <RefreshCw className="size-3.5" />
          Rescan
        </Button>
      </div>

      <FilterControlTray
        activeAxis={activeAxis}
        searchQuery={searchQuery}
        setActiveAxis={setActiveAxis}
        setSearchQuery={setSearchQuery}
        totalCount={filteredPersonas.length}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredPersonas.map((profile) => {
          const designConfig = COMPLETE_TROPE_MATRIX[profile.coreClass];
          const isActive = props.activeId === profile.id;

          return (
            <div
              className={cn(
                "group relative grid min-h-40 cursor-pointer gap-4 rounded-md border bg-gradient-to-b p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5",
                designConfig.bubble,
                designConfig.glow,
                isActive
                  ? "border-primary ring-1 ring-primary/25"
                  : designConfig.border,
              )}
              key={profile.id}
              onClick={() => props.onPersonaActivated(profile)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  props.onPersonaActivated(profile);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {profile.name}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    ID {profile.id.slice(0, 8)}
                  </span>
                </span>
                <span
                  className={cn(
                    "mr-8 rounded-full border bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    designConfig.border,
                    designConfig.headerText,
                  )}
                >
                  {designConfig.label}
                </span>
              </span>

              <button
                aria-label={`Delete ${profile.name}`}
                className="absolute right-3 top-3 rounded-md border bg-background/90 p-1.5 text-muted-foreground opacity-0 shadow-sm transition duration-200 hover:border-destructive/60 hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                onClick={(event) => handleDeleteProfile(event, profile)}
                title="Delete persona template"
                type="button"
              >
                <Trash2 className="size-3.5" />
              </button>

              <span className="grid gap-2">
                <MicroStat label="CHM" tint="bg-rose-500" value={profile.charm} />
                <MicroStat
                  label="WPL"
                  tint="bg-amber-500"
                  value={profile.willpower}
                />
                <MicroStat
                  label="VUL"
                  tint="bg-blue-500"
                  value={profile.vulnerability}
                />
              </span>

              <span className="text-[10px] text-muted-foreground">
                Last used: {formatLastUsed(profile.lastUsed)}
              </span>
            </div>
          );
        })}

        {filteredPersonas.length === 0 ? (
          <div className="rounded-md border border-dashed bg-background/50 p-6 text-center sm:col-span-2">
            <p className="text-sm font-medium">No persona templates match.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Adjust the search text or switch the personality filter.
            </p>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </section>
  );
}

function MicroStat(props: { label: string; tint: string; value: number }) {
  return (
    <span className="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-2 text-[10px] font-bold text-muted-foreground">
      <span className="font-mono">{props.label}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-background/80">
        <span
          className={cn("block h-full rounded-full transition-all", props.tint)}
          style={{ width: `${props.value}%` }}
        />
      </span>
      <span className="text-right font-mono">{props.value}</span>
    </span>
  );
}

function formatLastUsed(value: string) {
  if (!value || value === "--") {
    return "Never";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toISOString().slice(0, 16).replace("T", " ");
}

function matchesSearchQuery(profile: SavedPersonaMetadata, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const designConfig = COMPLETE_TROPE_MATRIX[profile.coreClass];
  const searchableText = [
    profile.name,
    profile.id,
    profile.coreClass,
    designConfig.label,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

function matchesAxisFilter(profile: SavedPersonaMetadata, activeAxis: AxisFilter) {
  if (activeAxis === "All") {
    return true;
  }

  return AXIS_MAPPING[activeAxis].includes(profile.coreClass);
}
