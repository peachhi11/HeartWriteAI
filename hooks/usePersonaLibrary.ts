"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { isTauriRuntime } from "@/lib/tauri/native";

const STORE_FILE = "persona-library.json";
const STORE_KEY = "personas";
const LOCAL_STORAGE_KEY = "heartwriteai:persona-library";

export interface PersonaLibraryItem {
  id: string;
  name: string;
  summary?: string;
  tags: string[];
  updatedAt: number;
}

export interface PersonaLibraryMetadata {
  totalCount: number;
}

export function usePersonaLibrary() {
  const isDesktopRuntime = isTauriRuntime();
  const [personas, setPersonas] = useState<PersonaLibraryItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loaded = await loadPersonaLibrary(isDesktopRuntime);
      setPersonas(loaded);
    } catch (caughtError) {
      setError(String(caughtError));
    } finally {
      setLoading(false);
    }
  }, [isDesktopRuntime]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return personas;
    }

    return personas.filter((persona) => {
      const searchable = [
        persona.name,
        persona.summary,
        ...persona.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [personas, query]);

  return {
    error,
    items,
    loading,
    metadata: {
      totalCount: personas.length,
    } satisfies PersonaLibraryMetadata,
    query,
    refresh,
    setQuery,
  };
}

export async function savePersonaLibraryItem(
  persona: PersonaLibraryItem,
  isDesktopRuntime = isTauriRuntime(),
) {
  const current = await loadPersonaLibrary(isDesktopRuntime);
  const next = [
    {
      ...persona,
      tags: normalizeTags(persona.tags),
      updatedAt: persona.updatedAt || Date.now(),
    },
    ...current.filter((item) => item.id !== persona.id),
  ].sort((a, b) => b.updatedAt - a.updatedAt);

  await persistPersonaLibrary(next, isDesktopRuntime);
  return next;
}

async function loadPersonaLibrary(isDesktopRuntime: boolean) {
  if (typeof window === "undefined") {
    return [];
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      const saved = await store.get<unknown>(STORE_KEY);
      return parsePersonaItems(saved);
    } catch {
      // Fall through to localStorage so browser/dev and desktop previews share a
      // forgiving recovery path if the Tauri store is unavailable.
    }
  }

  const storage = getLocalStorage();
  if (!storage) {
    return [];
  }

  const raw = storage.getItem(LOCAL_STORAGE_KEY);
  return parsePersonaItems(raw ? JSON.parse(raw) : []);
}

async function persistPersonaLibrary(
  personas: PersonaLibraryItem[],
  isDesktopRuntime: boolean,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      await store.set(STORE_KEY, personas);
      await store.save();
      return;
    } catch {
      // Fall through to localStorage.
    }
  }

  getLocalStorage()?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(personas));
}

async function getTauriStore() {
  const { Store } = await import("@tauri-apps/plugin-store");
  return Store.load(STORE_FILE);
}

function parsePersonaItems(value: unknown): PersonaLibraryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): PersonaLibraryItem | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const id = readString(record.id);
      const name = readString(record.name);

      if (!id || !name) {
        return null;
      }

      return {
        id,
        name,
        summary: readString(record.summary),
        tags: normalizeTags(record.tags),
        updatedAt: readNumber(record.updatedAt) ?? Date.now(),
      };
    })
    .filter((item): item is PersonaLibraryItem => Boolean(item))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

function normalizeTags(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((tag) => readString(tag))
        .filter(Boolean)
        .slice(0, 12)
    : [];
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getLocalStorage() {
  try {
    return typeof window.localStorage === "undefined"
      ? null
      : window.localStorage;
  } catch {
    return null;
  }
}
