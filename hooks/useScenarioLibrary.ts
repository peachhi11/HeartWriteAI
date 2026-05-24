"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { isTauriRuntime } from "@/lib/tauri/native";
import type { GeneratedScenarioArtifact } from "@/features/generation/workflows";

const STORE_FILE = "scenario-library.json";
const STORE_KEY = "scenarios";
const LOCAL_STORAGE_KEY = "heartwriteai:scenario-library";

export function useScenarioLibrary() {
  const isDesktopRuntime = isTauriRuntime();
  const [items, setItems] = useState<GeneratedScenarioArtifact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(await loadScenarioLibrary(isDesktopRuntime));
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
      [item.title, item.trope, item.summary, ...item.tags]
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

export async function saveScenarioLibraryItem(
  scenario: GeneratedScenarioArtifact,
  isDesktopRuntime = isTauriRuntime(),
) {
  const current = await loadScenarioLibrary(isDesktopRuntime);
  const next = [
    {
      ...scenario,
      updatedAt: scenario.updatedAt || Date.now(),
    },
    ...current.filter((item) => item.id !== scenario.id),
  ].sort((a, b) => b.updatedAt - a.updatedAt);

  await persistScenarioLibrary(next, isDesktopRuntime);
  return next;
}

async function loadScenarioLibrary(isDesktopRuntime: boolean) {
  if (typeof window === "undefined") {
    return [];
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      const saved = await store.get<unknown>(STORE_KEY);
      return parseScenarioItems(saved);
    } catch {
      // Browser/dev fallback.
    }
  }

  const raw = getLocalStorage()?.getItem(LOCAL_STORAGE_KEY);
  return parseScenarioItems(raw ? JSON.parse(raw) : []);
}

async function persistScenarioLibrary(
  scenarios: GeneratedScenarioArtifact[],
  isDesktopRuntime: boolean,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      await store.set(STORE_KEY, scenarios);
      await store.save();
      return;
    } catch {
      // Browser/dev fallback.
    }
  }

  getLocalStorage()?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scenarios));
}

async function getTauriStore() {
  const { Store } = await import("@tauri-apps/plugin-store");
  return Store.load(STORE_FILE);
}

function parseScenarioItems(value: unknown): GeneratedScenarioArtifact[] {
  return Array.isArray(value)
    ? value
        .filter(isGeneratedScenarioArtifact)
        .sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
}

function isGeneratedScenarioArtifact(
  value: unknown,
): value is GeneratedScenarioArtifact {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as GeneratedScenarioArtifact).id === "string" &&
      typeof (value as GeneratedScenarioArtifact).title === "string" &&
      typeof (value as GeneratedScenarioArtifact).summary === "string" &&
      typeof (value as GeneratedScenarioArtifact).updatedAt === "number",
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
