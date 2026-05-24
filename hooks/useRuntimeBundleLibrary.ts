"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { RuntimeBundleArtifact } from "@/features/generation/workflows";
import { isTauriRuntime } from "@/lib/tauri/native";

const STORE_FILE = "runtime-bundle-library.json";
const STORE_KEY = "bundles";
const LOCAL_STORAGE_KEY = "heartwriteai:runtime-bundle-library";

export function useRuntimeBundleLibrary() {
  const isDesktopRuntime = isTauriRuntime();
  const [items, setItems] = useState<RuntimeBundleArtifact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(await loadRuntimeBundleLibrary(isDesktopRuntime));
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
        item.persona?.name,
        item.scenario?.title,
        item.lorebook?.title,
        ...item.tags,
      ]
        .filter(Boolean)
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

export async function saveRuntimeBundleLibraryItem(
  bundle: RuntimeBundleArtifact,
  isDesktopRuntime = isTauriRuntime(),
) {
  const current = await loadRuntimeBundleLibrary(isDesktopRuntime);
  const next = [
    {
      ...bundle,
      updatedAt: bundle.updatedAt || Date.now(),
    },
    ...current.filter((item) => item.id !== bundle.id),
  ].sort((a, b) => b.updatedAt - a.updatedAt);

  await persistRuntimeBundleLibrary(next, isDesktopRuntime);
  return next;
}

export async function deleteRuntimeBundleLibraryItem(
  bundleId: string,
  isDesktopRuntime = isTauriRuntime(),
) {
  const current = await loadRuntimeBundleLibrary(isDesktopRuntime);
  const next = current.filter((item) => item.id !== bundleId);

  await persistRuntimeBundleLibrary(next, isDesktopRuntime);
  return next;
}

async function loadRuntimeBundleLibrary(isDesktopRuntime: boolean) {
  if (typeof window === "undefined") {
    return [];
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      const saved = await store.get<unknown>(STORE_KEY);
      return parseBundleItems(saved);
    } catch {
      // Browser/dev fallback.
    }
  }

  const raw = getLocalStorage()?.getItem(LOCAL_STORAGE_KEY);
  return parseBundleItems(raw ? JSON.parse(raw) : []);
}

async function persistRuntimeBundleLibrary(
  bundles: RuntimeBundleArtifact[],
  isDesktopRuntime: boolean,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (isDesktopRuntime) {
    try {
      const store = await getTauriStore();
      await store.set(STORE_KEY, bundles);
      await store.save();
      return;
    } catch {
      // Browser/dev fallback.
    }
  }

  getLocalStorage()?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundles));
}

async function getTauriStore() {
  const { Store } = await import("@tauri-apps/plugin-store");
  return Store.load(STORE_FILE);
}

function parseBundleItems(value: unknown): RuntimeBundleArtifact[] {
  return Array.isArray(value)
    ? value
        .filter(isRuntimeBundleArtifact)
        .sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
}

function isRuntimeBundleArtifact(
  value: unknown,
): value is RuntimeBundleArtifact {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as RuntimeBundleArtifact).id === "string" &&
      typeof (value as RuntimeBundleArtifact).title === "string" &&
      typeof (value as RuntimeBundleArtifact).compiledContext === "string" &&
      typeof (value as RuntimeBundleArtifact).updatedAt === "number",
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
