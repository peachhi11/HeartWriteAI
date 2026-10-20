import {
  createLocalPersistenceAdapter,
  type BrowserStorage,
  type TauriStoreLike,
} from "../storage/localPersistence";
import type { PromptRepositoryStorageAdapter } from "./promptRepository";

export const PROMPT_REPOSITORY_STORE_FILE = "prompt-library.json";
export const PROMPT_REPOSITORY_STORE_KEY = "prompt-records";

export interface LocalPromptRepositoryStorageOptions {
  browserStorage?: BrowserStorage | null;
  isBrowser?: () => boolean;
  isTauri?: () => boolean;
  loadTauriStore?: () => Promise<TauriStoreLike | null>;
  storeFile?: string;
  storageKey?: string;
}

export function createLocalPromptRepositoryStorage(
  options: LocalPromptRepositoryStorageOptions = {},
): PromptRepositoryStorageAdapter {
  const persistence = createLocalPersistenceAdapter({
    browserStorage: options.browserStorage,
    isBrowser: options.isBrowser,
    isTauri: options.isTauri,
    loadTauriStore: options.loadTauriStore,
    storeFile: options.storeFile ?? PROMPT_REPOSITORY_STORE_FILE,
  });
  const storageKey = options.storageKey ?? PROMPT_REPOSITORY_STORE_KEY;

  return {
    get: () => persistence.get(storageKey),
    set: (records) => persistence.set(storageKey, records),
  };
}
