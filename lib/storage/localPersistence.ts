export interface BrowserStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface TauriStoreLike {
  delete(key: string): Promise<boolean | void>;
  get<T>(key: string): Promise<T | undefined>;
  save(): Promise<void>;
  set(key: string, value: unknown): Promise<void>;
}

export interface LocalPersistenceAdapter {
  delete(key: string): Promise<void>;
  get(key: string): Promise<unknown | null>;
  set(key: string, value: unknown): Promise<void>;
}

export interface LocalPersistenceOptions {
  browserStorage?: BrowserStorage | null;
  isBrowser?: () => boolean;
  isTauri?: () => boolean;
  loadTauriStore?: () => Promise<TauriStoreLike | null>;
  storeFile: string;
}

interface BrowserGlobal {
  window?: {
    __TAURI_INTERNALS__?: unknown;
    location?: {
      protocol?: string;
    };
    localStorage?: BrowserStorage;
  };
}

const tauriStorePromises = new Map<string, Promise<TauriStoreLike | null>>();

export function createLocalPersistenceAdapter(
  options: LocalPersistenceOptions,
): LocalPersistenceAdapter {
  const isBrowser = options.isBrowser ?? defaultIsBrowser;
  const isTauri = options.isTauri ?? defaultIsTauri;
  const browserStorage = options.browserStorage ?? getBrowserStorage(isBrowser);
  const loadTauriStore =
    options.loadTauriStore ?? (() => loadDefaultTauriStore(options.storeFile, isTauri));

  return {
    async delete(key) {
      if (!isBrowser()) {
        return;
      }

      const tauriStore = await loadTauriStoreSafely(loadTauriStore);

      if (tauriStore) {
        await tauriStore.delete(key);
        await tauriStore.save();
        return;
      }

      browserStorage?.removeItem(key);
    },
    async get(key) {
      if (!isBrowser()) {
        return null;
      }

      const tauriStore = await loadTauriStoreSafely(loadTauriStore);

      if (tauriStore) {
        return (await tauriStore.get<unknown>(key)) ?? null;
      }

      const rawValue = browserStorage?.getItem(key);

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
      if (!isBrowser()) {
        return;
      }

      const tauriStore = await loadTauriStoreSafely(loadTauriStore);

      if (tauriStore) {
        await tauriStore.set(key, value);
        await tauriStore.save();
        return;
      }

      browserStorage?.setItem(key, JSON.stringify(value));
    },
  };
}

export function createMemoryPersistenceAdapter(
  seed: Record<string, unknown> = {},
): LocalPersistenceAdapter {
  const values = new Map(Object.entries(seed));

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

async function loadDefaultTauriStore(
  storeFile: string,
  isTauri: () => boolean,
): Promise<TauriStoreLike | null> {
  if (!isTauri()) {
    return null;
  }

  const existingPromise = tauriStorePromises.get(storeFile);

  if (existingPromise) {
    return existingPromise;
  }

  const storePromise = import("@tauri-apps/plugin-store")
    .then(async ({ Store }) => {
      const store = await Store.load(storeFile, {
        autoSave: false,
        defaults: {},
      });

      return {
        delete: async (key: string) => {
          await store.delete(key);
        },
        get: <T>(key: string) => store.get<T>(key),
        save: () => store.save(),
        set: (key: string, value: unknown) => store.set(key, value),
      } satisfies TauriStoreLike;
    })
    .catch(() => null);

  tauriStorePromises.set(storeFile, storePromise);
  return storePromise;
}

async function loadTauriStoreSafely(loadTauriStore: () => Promise<TauriStoreLike | null>) {
  try {
    return await loadTauriStore();
  } catch {
    return null;
  }
}

function getBrowserStorage(isBrowser: () => boolean): BrowserStorage | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return getBrowserGlobal().window?.localStorage ?? null;
  } catch {
    return null;
  }
}

function defaultIsBrowser() {
  return typeof getBrowserGlobal().window !== "undefined";
}

function defaultIsTauri() {
  const browserWindow = getBrowserGlobal().window;

  return Boolean(
    browserWindow &&
    ("__TAURI_INTERNALS__" in browserWindow || browserWindow.location?.protocol === "tauri:"),
  );
}

function getBrowserGlobal() {
  return globalThis as BrowserGlobal;
}
