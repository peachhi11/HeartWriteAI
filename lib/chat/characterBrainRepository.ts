"use client";

import { Store } from "@tauri-apps/plugin-store";

import {
  CharacterBrainSchema,
  normalizeCharacterBrain,
  type CharacterBrain,
} from "../character-card/semanticBrainService";

const characterBrainStorePath = "character-brains.json";

let storePromise: Promise<Store> | null = null;

interface BrowserLikeGlobal {
  localStorage?: {
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
  };
  window?: unknown;
}

export interface CharacterBrainStorageAdapter {
  delete(key: string): Promise<void>;
  get(key: string): Promise<unknown | null>;
  set(key: string, value: CharacterBrain): Promise<void>;
}

export interface CharacterBrainRepository {
  delete(characterId: string): Promise<void>;
  get(characterId: string): Promise<CharacterBrain | null>;
  save(brain: CharacterBrain): Promise<CharacterBrain>;
}

export function characterBrainKey(characterId: string) {
  return `character-brain:${normalizeCharacterBrainKeyId(characterId)}`;
}

export function createCharacterBrainRepository(
  storage = createBrowserCharacterBrainStorage(),
): CharacterBrainRepository {
  return {
    async delete(characterId) {
      await storage.delete(characterBrainKey(characterId));
    },
    async get(characterId) {
      const saved = await storage.get(characterBrainKey(characterId));
      return saved ? normalizeCharacterBrain(saved) : null;
    },
    async save(brain) {
      const normalized = CharacterBrainSchema.parse(normalizeCharacterBrain(brain));
      await storage.set(characterBrainKey(normalized.characterId), normalized);
      return normalized;
    },
  };
}

export function createMemoryCharacterBrainStorage(
  seed?: Record<string, CharacterBrain>,
): CharacterBrainStorageAdapter {
  const values = new Map<string, CharacterBrain>(Object.entries(seed ?? {}));

  return {
    async delete(key) {
      values.delete(key);
    },
    async get(key) {
      return values.get(key) ?? null;
    },
    async set(key, value) {
      values.set(key, normalizeCharacterBrain(value));
    },
  };
}

export function getCharacterBrain(characterId: string) {
  return defaultCharacterBrainRepository.get(characterId);
}

export function saveCharacterBrain(brain: CharacterBrain) {
  return defaultCharacterBrainRepository.save(brain);
}

export function deleteCharacterBrain(characterId: string) {
  return defaultCharacterBrainRepository.delete(characterId);
}

function createBrowserCharacterBrainStorage(): CharacterBrainStorageAdapter {
  return {
    async delete(key) {
      const tauriStore = await loadCharacterBrainStore();

      if (tauriStore) {
        await tauriStore.delete(key);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.removeItem(key);
    },
    async get(key) {
      const tauriStore = await loadCharacterBrainStore();

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
      const normalized = normalizeCharacterBrain(value);
      const tauriStore = await loadCharacterBrainStore();

      if (tauriStore) {
        await tauriStore.set(key, normalized);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.setItem(key, JSON.stringify(normalized));
    },
  };
}

async function loadCharacterBrainStore() {
  if (!isCharacterBrainBrowserRuntime()) {
    return null;
  }

  try {
    storePromise ??= Store.load(characterBrainStorePath, {
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

  if (!isCharacterBrainBrowserRuntime()) {
    return null;
  }

  return browserGlobal.localStorage ?? null;
}

const defaultCharacterBrainRepository = createCharacterBrainRepository();

function isCharacterBrainBrowserRuntime() {
  return typeof getBrowserGlobal().window !== "undefined";
}

function getBrowserGlobal() {
  return globalThis as BrowserLikeGlobal;
}

function normalizeCharacterBrainKeyId(characterId: string) {
  return characterId.trim().toLowerCase().replace(/\s+/g, " ") || "character";
}
