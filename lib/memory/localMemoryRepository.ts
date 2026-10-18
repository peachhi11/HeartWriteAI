import {
  createLocalPersistenceAdapter,
  type BrowserStorage,
  type TauriStoreLike,
} from "../storage/localPersistence";
import type { MemoryRepositoryStorageAdapter } from "./memoryRepository";

export const MEMORY_REPOSITORY_STORE_FILE = "memory-core.json";
export const MEMORY_REPOSITORY_STORE_KEY = "memory-records";

export interface LocalMemoryRepositoryStorageOptions {
  browserStorage?: BrowserStorage | null;
  isBrowser?: () => boolean;
  isTauri?: () => boolean;
  loadTauriStore?: () => Promise<TauriStoreLike | null>;
  storeFile?: string;
  storageKey?: string;
}

export function createLocalMemoryRepositoryStorage(
  options: LocalMemoryRepositoryStorageOptions = {},
): MemoryRepositoryStorageAdapter {
  const persistence = createLocalPersistenceAdapter({
    browserStorage: options.browserStorage,
    isBrowser: options.isBrowser,
    isTauri: options.isTauri,
    loadTauriStore: options.loadTauriStore,
    storeFile: options.storeFile ?? MEMORY_REPOSITORY_STORE_FILE,
  });
  const storageKey = options.storageKey ?? MEMORY_REPOSITORY_STORE_KEY;

  return {
    get: () => persistence.get(storageKey),
    set: (records) => persistence.set(storageKey, records),
  };
}
