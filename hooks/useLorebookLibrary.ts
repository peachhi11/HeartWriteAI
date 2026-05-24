"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { GeneratedLorebookArtifact } from "@/features/generation/workflows";
import { isTauriRuntime } from "@/lib/tauri/native";

const STORE_FILE = "lorebook-library.json";
const STORE_KEY = "lorebooks";
const LOCAL_STORAGE_KEY = "heartwriteai:lorebook-library";

export function useLorebookLibrary() {
  const isDesktopRuntime = isTauriRuntime();
  const [items, setItems] = useState<GeneratedLorebookArtifact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(await loadLorebookLibrary(isDesktopRuntime));
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

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }

    return items.filter((item) =>
      [
        item.title,
        item.trope,
        item.summary.universeAnchor,
        ...item.summary.worldSystemRules,
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [items, query]);

  return {
    error,
    items: filteredItems,
    loading,
    query,
    refresh,
    setQuery,
    totalCount: items.length,
  };
}

export async function saveLorebookLibraryItem(
  lorebook: GeneratedLorebookArtifact,
  isDesktopRuntime = isTauriRuntime(),
) {
  const current = await loadLorebookLibrary(isDesktopRuntime);
  const next = [
    {
      ...lorebook,
      updatedAt: lorebook.updatedAt || Date.now(),
    },
    ...current.filter((item) => item.id !== lorebook.id),
  ].sort((a, b) => b.updatedAt - a.updatedAt);

  await persistLorebookLibrary(next, isDesktopRuntime);
  return next;
}

export async function deleteLorebookLibraryItem(
  lorebookId: string,
  isDesktopRuntime = isTauriRuntime(),
) {
  const current = await loadLorebookLibrary(isDesktopRuntime);
  const next = current.filter((item) => item.id !== lorebookId);

  await persistLorebookLibrary(next, isDesktopRuntime);
  return next;
}

async function loadLorebookLibrary(isDesktopRuntime: boolean) {
  if (typeof window === "undefined") {
    return [];
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      const saved = await store.get<unknown>(STORE_KEY);
      return parseLorebookItems(saved);
    } catch {
      // Browser/dev fallback.
    }
  }

  const raw = getLocalStorage()?.getItem(LOCAL_STORAGE_KEY);
  return parseLorebookItems(raw ? JSON.parse(raw) : []);
}

async function persistLorebookLibrary(
  lorebooks: GeneratedLorebookArtifact[],
  isDesktopRuntime: boolean,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      await store.set(STORE_KEY, lorebooks);
      await store.save();
      return;
    } catch {
      // Browser/dev fallback.
    }
  }

  getLocalStorage()?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lorebooks));
}

async function getTauriStore() {
  const { Store } = await import("@tauri-apps/plugin-store");
  return Store.load(STORE_FILE);
}

function parseLorebookItems(value: unknown): GeneratedLorebookArtifact[] {
  return Array.isArray(value)
    ? value
        .filter(isGeneratedLorebookArtifact)
        .sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
}

function isGeneratedLorebookArtifact(
  value: unknown,
): value is GeneratedLorebookArtifact {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as GeneratedLorebookArtifact).id === "string" &&
      typeof (value as GeneratedLorebookArtifact).title === "string" &&
      typeof (value as GeneratedLorebookArtifact).updatedAt === "number" &&
      typeof (value as GeneratedLorebookArtifact).summary === "object",
  );
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
