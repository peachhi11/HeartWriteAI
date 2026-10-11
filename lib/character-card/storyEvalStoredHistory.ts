import {
  parseStoryEvalRunHistoryFile,
  serializeStoryEvalCiReport,
  type StoryEvalCiReport,
  type StoryEvalRunComparison,
  type StoryEvalRunHistoryFile,
} from "./storyEvalRunner";
import {
  compareStoryEvalRunHistoryCommand,
  exportStoryEvalCiReportCommand,
  listStoryEvalRunHistoryCommand,
  runStoryEvalFixtureTextCommand,
  type StoryEvalCiReportCommandResult,
  type StoryEvalFixtureTextCommandResult,
  type StoryEvalLocalHistoryRepository,
} from "./storyEvalLocalHistory";
import {
  createMemoryStoryEvalHistoryStorage,
  createStoryEvalHistoryRepository,
  type StoryEvalHistoryStorageAdapter,
} from "./storyEvalHistoryRepository";

const STORY_EVAL_STORE_FILE = "storyeval-run-history.json";
const STORY_EVAL_STORE_KEY = "history";
const STORY_EVAL_LOCAL_STORAGE_KEY = "heartwriteai:storyeval-run-history";

interface BrowserLikeGlobal {
  __TAURI_INTERNALS__?: unknown;
  localStorage?: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
  };
  window?: unknown;
}

export type StoryEvalStoredHistoryStorageAdapter = StoryEvalHistoryStorageAdapter;

export function createStoryEvalStoredHistoryRepository(input?: {
  maxEntries?: number;
  storage?: StoryEvalStoredHistoryStorageAdapter;
}): StoryEvalLocalHistoryRepository {
  const storage = input?.storage ?? createStoryEvalBrowserHistoryStorage();

  return createStoryEvalHistoryRepository({
    maxEntries: input?.maxEntries,
    storage,
  });
}

export function createMemoryStoryEvalStoredHistoryStorage(
  seed?: StoryEvalRunHistoryFile,
): StoryEvalStoredHistoryStorageAdapter & {
  readRawStoredValue(): unknown | null;
} {
  return createMemoryStoryEvalHistoryStorage(seed);
}

export function createStoryEvalBrowserHistoryStorage(): StoryEvalStoredHistoryStorageAdapter {
  return {
    async load() {
      const tauriStore = await loadStoryEvalHistoryStore();

      if (tauriStore) {
        return (await tauriStore.get(STORY_EVAL_STORE_KEY)) ?? null;
      }

      const rawValue = getLocalStorage()?.getItem(STORY_EVAL_LOCAL_STORAGE_KEY);

      if (!rawValue) {
        return null;
      }

      try {
        return JSON.parse(rawValue) as unknown;
      } catch {
        return null;
      }
    },
    async save(history) {
      const parsed = parseStoryEvalRunHistoryFile(history);
      const tauriStore = await loadStoryEvalHistoryStore();

      if (tauriStore) {
        await tauriStore.set(STORY_EVAL_STORE_KEY, parsed);
        await tauriStore.save();
        return;
      }

      getLocalStorage()?.setItem(STORY_EVAL_LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    },
  };
}

export async function runStoryEvalFixtureTextStoredCommand(input: {
  fixtureText: string;
  generatedAt?: string;
  maxEntries?: number;
  repository?: StoryEvalLocalHistoryRepository;
  storage?: StoryEvalStoredHistoryStorageAdapter;
  updatedAt?: string;
}): Promise<StoryEvalFixtureTextCommandResult> {
  return runStoryEvalFixtureTextCommand({
    fixtureText: input.fixtureText,
    generatedAt: input.generatedAt,
    maxEntries: input.maxEntries,
    repository:
      input.repository ??
      createStoryEvalStoredHistoryRepository({
        maxEntries: input.maxEntries,
        storage: input.storage,
      }),
    updatedAt: input.updatedAt,
  });
}

export async function listStoryEvalStoredHistoryCommand(input?: {
  repository?: StoryEvalLocalHistoryRepository;
  storage?: StoryEvalStoredHistoryStorageAdapter;
}): Promise<StoryEvalRunHistoryFile> {
  return listStoryEvalRunHistoryCommand({
    repository:
      input?.repository ?? createStoryEvalStoredHistoryRepository({ storage: input?.storage }),
  });
}

export async function compareStoryEvalStoredHistoryCommand(input: {
  baselineRunId: string;
  candidateRunId: string;
  repository?: StoryEvalLocalHistoryRepository;
  storage?: StoryEvalStoredHistoryStorageAdapter;
}): Promise<StoryEvalRunComparison> {
  return compareStoryEvalRunHistoryCommand({
    baselineRunId: input.baselineRunId,
    candidateRunId: input.candidateRunId,
    repository:
      input.repository ?? createStoryEvalStoredHistoryRepository({ storage: input.storage }),
  });
}

export async function exportStoryEvalStoredCiReportCommand(input: {
  baselineRunId?: string;
  generatedAt?: string;
  repository?: StoryEvalLocalHistoryRepository;
  runId: string;
  storage?: StoryEvalStoredHistoryStorageAdapter;
}): Promise<StoryEvalCiReportCommandResult> {
  return exportStoryEvalCiReportCommand({
    baselineRunId: input.baselineRunId,
    generatedAt: input.generatedAt,
    repository:
      input.repository ?? createStoryEvalStoredHistoryRepository({ storage: input.storage }),
    runId: input.runId,
  });
}

export function serializeStoryEvalStoredCiReport(report: StoryEvalCiReport) {
  return serializeStoryEvalCiReport(report);
}

async function loadStoryEvalHistoryStore() {
  if (!isStoryEvalTauriRuntime()) {
    return null;
  }

  try {
    const { Store } = await import("@tauri-apps/plugin-store");

    return Store.load(STORY_EVAL_STORE_FILE, {
      autoSave: false,
      defaults: {},
    });
  } catch {
    return null;
  }
}

function getLocalStorage() {
  const browserGlobal = getBrowserGlobal();

  if (!isStoryEvalBrowserRuntime()) {
    return null;
  }

  return browserGlobal.localStorage ?? null;
}

function isStoryEvalBrowserRuntime() {
  return typeof getBrowserGlobal().window !== "undefined";
}

function isStoryEvalTauriRuntime() {
  const browserGlobal = getBrowserGlobal();

  return isStoryEvalBrowserRuntime() && typeof browserGlobal.__TAURI_INTERNALS__ !== "undefined";
}

function getBrowserGlobal() {
  return globalThis as BrowserLikeGlobal;
}
