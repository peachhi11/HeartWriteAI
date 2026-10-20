import {
  createLocalPersistenceAdapter,
  type BrowserStorage,
  type TauriStoreLike,
} from "../storage/localPersistence";
import type { CharacterRepositoryStorageAdapter } from "./characterRepository";

export const CHARACTER_REPOSITORY_STORE_FILE = "character-books.json";
export const CHARACTER_REPOSITORY_STORE_KEY = "character-records";

export interface LocalCharacterRepositoryStorageOptions {
  browserStorage?: BrowserStorage | null;
  isBrowser?: () => boolean;
  isTauri?: () => boolean;
  loadTauriStore?: () => Promise<TauriStoreLike | null>;
  storeFile?: string;
  storageKey?: string;
}

export function createLocalCharacterRepositoryStorage(
  options: LocalCharacterRepositoryStorageOptions = {},
): CharacterRepositoryStorageAdapter {
  const persistence = createLocalPersistenceAdapter({
    browserStorage: options.browserStorage,
    isBrowser: options.isBrowser,
    isTauri: options.isTauri,
    loadTauriStore: options.loadTauriStore,
    storeFile: options.storeFile ?? CHARACTER_REPOSITORY_STORE_FILE,
  });
  const storageKey = options.storageKey ?? CHARACTER_REPOSITORY_STORE_KEY;

  return {
    get: () => persistence.get(storageKey),
    set: (records) => persistence.set(storageKey, records),
  };
}
