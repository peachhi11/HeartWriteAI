import assert from "node:assert/strict";
import test from "node:test";

import {
  createLocalPersistenceAdapter,
  createMemoryPersistenceAdapter,
  type BrowserStorage,
  type TauriStoreLike,
} from "../../lib/storage/localPersistence";

function createBrowserStorage(): BrowserStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();

  return {
    values,
    getItem(key) {
      return values.get(key) ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function createTauriStore(): TauriStoreLike & { values: Map<string, unknown>; saves: number } {
  const values = new Map<string, unknown>();
  let saves = 0;

  return {
    values,
    get saves() {
      return saves;
    },
    async delete(key: string) {
      values.delete(key);
    },
    async get<T>(key: string) {
      return values.get(key) as T | undefined;
    },
    async save() {
      saves += 1;
    },
    async set(key: string, value: unknown) {
      values.set(key, value);
    },
  };
}

test("uses browser storage for JSON values when Tauri is unavailable", async () => {
  const browserStorage = createBrowserStorage();
  const storage = createLocalPersistenceAdapter({
    browserStorage,
    isBrowser: () => true,
    isTauri: () => false,
    storeFile: "relationship-state.json",
  });

  await storage.set("relationship:scenario-a:char-a:user", {
    trust: 64,
  });

  assert.deepEqual(await storage.get("relationship:scenario-a:char-a:user"), { trust: 64 });
  assert.equal(browserStorage.values.size, 1);

  await storage.delete("relationship:scenario-a:char-a:user");
  assert.equal(await storage.get("relationship:scenario-a:char-a:user"), null);
});

test("prefers Tauri storage and saves after writes", async () => {
  const browserStorage = createBrowserStorage();
  const tauriStore = createTauriStore();
  const storage = createLocalPersistenceAdapter({
    browserStorage,
    isBrowser: () => true,
    isTauri: () => true,
    loadTauriStore: async () => tauriStore,
    storeFile: "relationship-graph.json",
  });

  await storage.set("relationship-graph:scenario-a", { edges: {} });

  assert.deepEqual(await storage.get("relationship-graph:scenario-a"), { edges: {} });
  assert.equal(tauriStore.saves, 1);
  assert.equal(browserStorage.values.size, 0);
});

test("falls back to browser storage when Tauri storage fails", async () => {
  const browserStorage = createBrowserStorage();
  const storage = createLocalPersistenceAdapter({
    browserStorage,
    isBrowser: () => true,
    isTauri: () => true,
    loadTauriStore: async () => {
      throw new Error("store unavailable");
    },
    storeFile: "relationship-state.json",
  });

  await storage.set("relationship:scenario-a:char-a:user", { trust: 30 });

  assert.deepEqual(await storage.get("relationship:scenario-a:char-a:user"), { trust: 30 });
});

test("memory persistence provides the same key/value contract", async () => {
  const storage = createMemoryPersistenceAdapter({ existing: { enabled: true } });

  assert.deepEqual(await storage.get("existing"), { enabled: true });
  await storage.set("next", { enabled: false });
  assert.deepEqual(await storage.get("next"), { enabled: false });
  await storage.delete("next");
  assert.equal(await storage.get("next"), null);
});

test("returns an inert adapter outside browser runtimes", async () => {
  const storage = createLocalPersistenceAdapter({
    isBrowser: () => false,
    isTauri: () => false,
    storeFile: "relationship-state.json",
  });

  await storage.set("ignored", { value: true });
  assert.equal(await storage.get("ignored"), null);
});
