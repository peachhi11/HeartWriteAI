"use client";

import { Store } from "@tauri-apps/plugin-store";

import {
  RelationshipStateSchema,
  createDefaultRelationshipState,
  normalizeRelationshipState,
  type RelationshipState,
} from "./relationshipState.schema";

const relationshipStorePath = "relationship-state.json";

let storePromise: Promise<Store> | null = null;

interface BrowserLikeGlobal {
  __TAURI_INTERNALS__?: unknown;
  localStorage?: {
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
  };
  window?: unknown;
}

export interface RelationshipStateStorageAdapter {
  delete(key: string): Promise<void>;
  get(key: string): Promise<unknown | null>;
  set(key: string, value: RelationshipState): Promise<void>;
}

export interface RelationshipStateRepository {
  delete(scenarioId: string, aId: string, bId: string): Promise<void>;
  get(scenarioId: string, aId: string, bId: string): Promise<RelationshipState>;
  patch(
    scenarioId: string,
    aId: string,
    bId: string,
    patch: Partial<RelationshipState>,
  ): Promise<RelationshipState>;
  save(state: RelationshipState): Promise<RelationshipState>;
}

export function relationshipKey(scenarioId: string, aId: string, bId: string) {
  const [leftId, rightId] = [aId, bId].sort();

  return `relationship:${scenarioId}:${leftId}:${rightId}`;
}

export function createRelationshipStateRepository(
  storage = createBrowserRelationshipStateStorage(),
): RelationshipStateRepository {
  return {
    async delete(scenarioId, aId, bId) {
      await storage.delete(relationshipKey(scenarioId, aId, bId));
    },
    async get(scenarioId, aId, bId) {
      const saved = await storage.get(relationshipKey(scenarioId, aId, bId));

      if (saved) {
        return normalizeRelationshipState(saved);
      }

      return createDefaultRelationshipState({
        id: relationshipKey(scenarioId, aId, bId),
        scenarioId,
        aId,
        bId,
      });
    },
    async patch(scenarioId, aId, bId, patch) {
      const current = await this.get(scenarioId, aId, bId);
      const next = normalizeRelationshipState({
        ...current,
        ...patch,
        createdAt: current.createdAt,
        id: current.id,
        scenarioId,
        updatedAt: new Date().toISOString(),
        characters: {
          ...current.characters,
          ...(patch.characters ?? {}),
          aId,
          bId,
        },
      });

      return this.save(next);
    },
    async save(state) {
      const normalized = RelationshipStateSchema.parse({
        ...state,
        updatedAt: new Date().toISOString(),
      });

      await storage.set(
        relationshipKey(
          normalized.scenarioId ?? "default",
          normalized.characters.aId,
          normalized.characters.bId,
        ),
        normalized,
      );

      return normalized;
    },
  };
}

export function createMemoryRelationshipStateStorage(
  seed?: Record<string, RelationshipState>,
): RelationshipStateStorageAdapter {
  const values = new Map<string, RelationshipState>(Object.entries(seed ?? {}));

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

export function getRelationshipState(
  scenarioId: string,
  aId: string,
  bId: string,
) {
  return defaultRelationshipStateRepository.get(scenarioId, aId, bId);
}

export function saveRelationshipState(state: RelationshipState) {
  return defaultRelationshipStateRepository.save(state);
}

export function patchRelationshipState(
  scenarioId: string,
  aId: string,
  bId: string,
  patch: Partial<RelationshipState>,
) {
  return defaultRelationshipStateRepository.patch(scenarioId, aId, bId, patch);
}

export function deleteRelationshipState(
  scenarioId: string,
  aId: string,
  bId: string,
) {
  return defaultRelationshipStateRepository.delete(scenarioId, aId, bId);
}

function createBrowserRelationshipStateStorage(): RelationshipStateStorageAdapter {
  return {
    async delete(key) {
      const tauriStore = await loadRelationshipStateStore();

      if (tauriStore) {
        await tauriStore.delete(key);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.removeItem(key);
    },
    async get(key) {
      const tauriStore = await loadRelationshipStateStore();

      if (tauriStore) {
        return (await tauriStore.get(key)) ?? null;
      }

      const rawValue = getLocalStorage()?.getItem(key);

      if (!rawValue) {
        return null;
      }

      try {
        return JSON.parse(rawValue) as unknown;
      } catch {
        return null;
      }
    },
    async set(key, value) {
      const normalized = normalizeRelationshipState(value);
      const tauriStore = await loadRelationshipStateStore();

      if (tauriStore) {
        await tauriStore.set(key, normalized);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.setItem(key, JSON.stringify(normalized));
    },
  };
}

async function loadRelationshipStateStore() {
  if (!isRelationshipStateBrowserRuntime()) {
    return null;
  }

  try {
    storePromise ??= Store.load(relationshipStorePath, {
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

  if (!isRelationshipStateBrowserRuntime()) {
    return null;
  }

  return browserGlobal.localStorage ?? null;
}

const defaultRelationshipStateRepository = createRelationshipStateRepository();

function isRelationshipStateBrowserRuntime() {
  const browserGlobal = getBrowserGlobal();

  return typeof browserGlobal.window !== "undefined";
}

function getBrowserGlobal() {
  return globalThis as BrowserLikeGlobal;
}
