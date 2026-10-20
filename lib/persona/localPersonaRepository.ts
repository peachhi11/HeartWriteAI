import {
  createLocalPersistenceAdapter,
  type BrowserStorage,
  type TauriStoreLike,
} from "../storage/localPersistence";
import type { PersonaRepositoryStorageAdapter } from "./personaRepository";

export const PERSONA_REPOSITORY_STORE_FILE = "persona-books.json";
export const PERSONA_REPOSITORY_STORE_KEY = "persona-records";

export interface LocalPersonaRepositoryStorageOptions {
  browserStorage?: BrowserStorage | null;
  isBrowser?: () => boolean;
  isTauri?: () => boolean;
  loadTauriStore?: () => Promise<TauriStoreLike | null>;
  storeFile?: string;
  storageKey?: string;
}

export function createLocalPersonaRepositoryStorage(
  options: LocalPersonaRepositoryStorageOptions = {},
): PersonaRepositoryStorageAdapter {
  const persistence = createLocalPersistenceAdapter({
    browserStorage: options.browserStorage,
    isBrowser: options.isBrowser,
    isTauri: options.isTauri,
    loadTauriStore: options.loadTauriStore,
    storeFile: options.storeFile ?? PERSONA_REPOSITORY_STORE_FILE,
  });
  const storageKey = options.storageKey ?? PERSONA_REPOSITORY_STORE_KEY;

  return {
    get: () => persistence.get(storageKey),
    set: (records) => persistence.set(storageKey, records),
  };
}
