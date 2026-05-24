"use client";

import { Store } from "@tauri-apps/plugin-store";

import {
  RelationshipGraphSchema,
  createDefaultRelationshipGraph,
  normalizeRelationshipGraph,
  type RelationshipGraph,
} from "./relationshipGraph";

const relationshipGraphStorePath = "relationship-graph.json";

let storePromise: Promise<Store> | null = null;

interface BrowserLikeGlobal {
  localStorage?: {
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
  };
  window?: unknown;
}

export interface RelationshipGraphStorageAdapter {
  delete(key: string): Promise<void>;
  get(key: string): Promise<unknown | null>;
  set(key: string, value: RelationshipGraph): Promise<void>;
}

export interface RelationshipGraphRepository {
  delete(scenarioId: string): Promise<void>;
  get(scenarioId: string): Promise<RelationshipGraph>;
  save(graph: RelationshipGraph): Promise<RelationshipGraph>;
}

export function relationshipGraphKey(scenarioId: string) {
  return `relationship-graph:${scenarioId}`;
}

export function createRelationshipGraphRepository(
  storage = createBrowserRelationshipGraphStorage(),
): RelationshipGraphRepository {
  return {
    async delete(scenarioId) {
      await storage.delete(relationshipGraphKey(scenarioId));
    },
    async get(scenarioId) {
      const saved = await storage.get(relationshipGraphKey(scenarioId));

      if (saved) {
        return normalizeRelationshipGraph(saved);
      }

      return createDefaultRelationshipGraph(scenarioId);
    },
    async save(graph) {
      const normalized = RelationshipGraphSchema.parse({
        ...graph,
        updatedAt: new Date().toISOString(),
      });

      await storage.set(relationshipGraphKey(normalized.scenarioId), normalized);
      return normalized;
    },
  };
}

export function createMemoryRelationshipGraphStorage(
  seed?: Record<string, RelationshipGraph>,
): RelationshipGraphStorageAdapter {
  const values = new Map<string, RelationshipGraph>(Object.entries(seed ?? {}));

  return {
    async delete(key) {
      values.delete(key);
    },
    async get(key) {
      return values.get(key) ?? null;
    },
    async set(key, value) {
      values.set(key, value);
    },
  };
}

export function getRelationshipGraph(scenarioId: string) {
  return defaultRelationshipGraphRepository.get(scenarioId);
}

export function saveRelationshipGraph(graph: RelationshipGraph) {
  return defaultRelationshipGraphRepository.save(graph);
}

export function deleteRelationshipGraph(scenarioId: string) {
  return defaultRelationshipGraphRepository.delete(scenarioId);
}

function createBrowserRelationshipGraphStorage(): RelationshipGraphStorageAdapter {
  return {
    async delete(key) {
      const tauriStore = await loadRelationshipGraphStore();

      if (tauriStore) {
        await tauriStore.delete(key);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.removeItem(key);
    },
    async get(key) {
      const tauriStore = await loadRelationshipGraphStore();

      if (tauriStore) {
        return (await tauriStore.get(key)) ?? null;
      }

      const rawValue = getLocalStorage()?.getItem(key);

      if (!rawValue) return null;

      try {
        return JSON.parse(rawValue) as unknown;
      } catch {
        return null;
      }
    },
    async set(key, value) {
      const normalized = normalizeRelationshipGraph(value);
      const tauriStore = await loadRelationshipGraphStore();

      if (tauriStore) {
        await tauriStore.set(key, normalized);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.setItem(key, JSON.stringify(normalized));
    },
  };
}

async function loadRelationshipGraphStore() {
  if (!isRelationshipGraphBrowserRuntime()) {
    return null;
  }

  try {
    storePromise ??= Store.load(relationshipGraphStorePath, {
      autoSave: false,
      defaults: {},
    });

    return await storePromise;
  } catch {
    return null;
  }
}

function getLocalStorage() {
  const browserGlobal = getBrowserGlobal();

  if (!isRelationshipGraphBrowserRuntime()) {
    return null;
  }

  return browserGlobal.localStorage ?? null;
}

const defaultRelationshipGraphRepository = createRelationshipGraphRepository();

function isRelationshipGraphBrowserRuntime() {
  return typeof getBrowserGlobal().window !== "undefined";
}

function getBrowserGlobal() {
  return globalThis as BrowserLikeGlobal;
}
