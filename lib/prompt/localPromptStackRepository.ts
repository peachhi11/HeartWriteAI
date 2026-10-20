import {
  createLocalPersistenceAdapter,
  type BrowserStorage,
  type TauriStoreLike,
} from "../storage/localPersistence";
import type { PromptStackRepositoryStorageAdapter } from "./promptStackRepository";

export const PROMPT_STACK_REPOSITORY_STORE_FILE = "prompt-stacks.json";
export const PROMPT_STACK_REPOSITORY_STORE_KEY = "prompt-stack-records";

export interface LocalPromptStackRepositoryStorageOptions {
  browserStorage?: BrowserStorage | null;
  isBrowser?: () => boolean;
  isTauri?: () => boolean;
  loadTauriStore?: () => Promise<TauriStoreLike | null>;
  storeFile?: string;
  storageKey?: string;
}

export function createLocalPromptStackRepositoryStorage(
  options: LocalPromptStackRepositoryStorageOptions = {},
): PromptStackRepositoryStorageAdapter {
  const persistence = createLocalPersistenceAdapter({
    browserStorage: options.browserStorage,
    isBrowser: options.isBrowser,
    isTauri: options.isTauri,
    loadTauriStore: options.loadTauriStore,
    storeFile: options.storeFile ?? PROMPT_STACK_REPOSITORY_STORE_FILE,
  });
  const storageKey = options.storageKey ?? PROMPT_STACK_REPOSITORY_STORE_KEY;

  return {
    get: () => persistence.get(storageKey),
    set: (records) => persistence.set(storageKey, records),
  };
}
