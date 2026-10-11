import { z } from "zod";

import {
  appendStoryEvalRunHistory,
  compareStoryEvalRunHistoryEntries,
  createStoryEvalCiReport,
  createStoryEvalRunFromFixtureFile,
  createStoryEvalRunHistoryEntry,
  parseStoryEvalFixtureText,
  parseStoryEvalRunHistoryFile,
  serializeStoryEvalCiReport,
  type StoryEvalCiReport,
  type StoryEvalRunComparison,
  type StoryEvalRunHistoryEntry,
  type StoryEvalRunHistoryFile,
} from "./storyEvalRunner";

const StoryEvalRunIdSchema = z.string().trim().min(1);

const StoryEvalTimestampSchema = z.string().trim().min(1);

const StoryEvalMaxEntriesSchema = z.number().int().positive().optional();

const StoryEvalRunHistoryCommandInputSchema = z.object({
  fixtureText: z.string().trim().min(1),
  generatedAt: StoryEvalTimestampSchema.optional(),
  maxEntries: StoryEvalMaxEntriesSchema,
  updatedAt: StoryEvalTimestampSchema.optional(),
});

const StoryEvalCompareCommandInputSchema = z.object({
  baselineRunId: StoryEvalRunIdSchema,
  candidateRunId: StoryEvalRunIdSchema,
});

const StoryEvalExportCommandInputSchema = z.object({
  baselineRunId: StoryEvalRunIdSchema.optional(),
  generatedAt: StoryEvalTimestampSchema.optional(),
  runId: StoryEvalRunIdSchema,
});

export type StoryEvalHistoryStorageAdapter = {
  load(): Promise<unknown | null>;
  save(history: StoryEvalRunHistoryFile): Promise<void>;
};

export type StoryEvalHistoryRepository = {
  compareRuns(baselineRunId: string, candidateRunId: string): Promise<StoryEvalRunComparison>;
  createCiReport(input: {
    baselineRunId?: string;
    generatedAt?: string;
    runId: string;
  }): Promise<StoryEvalCiReport>;
  findRun(runId: string): Promise<StoryEvalRunHistoryEntry>;
  listRuns(): Promise<StoryEvalRunHistoryFile>;
  saveRun(
    run: Parameters<typeof createStoryEvalRunHistoryEntry>[0],
    options?: {
      maxEntries?: number;
      updatedAt?: string;
    },
  ): Promise<StoryEvalRunHistoryFile>;
};

export type StoryEvalFixtureTextCommandResult = {
  ci_report: StoryEvalCiReport;
  history: StoryEvalRunHistoryFile;
  run: StoryEvalRunHistoryEntry;
  serialized_ci_report: string;
};

export type StoryEvalCiReportCommandResult = {
  ci_report: StoryEvalCiReport;
  serialized_ci_report: string;
};

export function createStoryEvalHistoryRepository(input: {
  maxEntries?: number;
  storage: StoryEvalHistoryStorageAdapter;
}): StoryEvalHistoryRepository {
  const { storage } = input;

  return {
    async compareRuns(baselineRunId, candidateRunId) {
      return compareStoryEvalRunHistoryEntries(
        await this.findRun(baselineRunId),
        await this.findRun(candidateRunId),
      );
    },
    async createCiReport(input) {
      const run = await this.findRun(input.runId);
      const baseline = input.baselineRunId ? await this.findRun(input.baselineRunId) : undefined;

      return createStoryEvalCiReport({
        run,
        baseline,
        generatedAt: input.generatedAt,
      });
    },
    async findRun(runId) {
      const parsedRunId = StoryEvalRunIdSchema.parse(runId);
      const history = await this.listRuns();
      const run = history.runs.find((entry) => entry.run_id === parsedRunId);

      if (!run) {
        throw new Error(`StoryEval run not found: ${parsedRunId}`);
      }

      return run;
    },
    async listRuns() {
      return readStoryEvalHistory(storage);
    },
    async saveRun(run, options) {
      const existing = await readStoryEvalHistory(storage);
      const nextHistory = parseStoryEvalRunHistoryFile({
        version: 1,
        updated_at: options?.updatedAt ?? run.metadata.created_at,
        runs: appendStoryEvalRunHistory({
          history: existing.runs,
          run,
          maxEntries: options?.maxEntries ?? input.maxEntries,
        }),
      });

      await storage.save(nextHistory);

      return nextHistory;
    },
  };
}

export async function runStoryEvalFixtureTextWithHistory(input: {
  fixtureText: string;
  generatedAt?: string;
  maxEntries?: number;
  repository: StoryEvalHistoryRepository;
  updatedAt?: string;
}): Promise<StoryEvalFixtureTextCommandResult> {
  const commandInput = StoryEvalRunHistoryCommandInputSchema.parse(input);
  const runResult = createStoryEvalRunFromFixtureFile(
    parseStoryEvalFixtureText(commandInput.fixtureText),
  );
  const history = await input.repository.saveRun(runResult, {
    maxEntries: commandInput.maxEntries,
    updatedAt: commandInput.updatedAt,
  });
  const run = createStoryEvalRunHistoryEntry(runResult);
  const ciReport = createStoryEvalCiReport({
    run,
    generatedAt: commandInput.generatedAt,
  });

  return {
    run,
    history,
    ci_report: ciReport,
    serialized_ci_report: serializeStoryEvalCiReport(ciReport),
  };
}

export async function compareStoryEvalRunHistory(input: {
  baselineRunId: string;
  candidateRunId: string;
  repository: StoryEvalHistoryRepository;
}): Promise<StoryEvalRunComparison> {
  const commandInput = StoryEvalCompareCommandInputSchema.parse(input);

  return input.repository.compareRuns(commandInput.baselineRunId, commandInput.candidateRunId);
}

export async function exportStoryEvalCiReport(input: {
  baselineRunId?: string;
  generatedAt?: string;
  repository: StoryEvalHistoryRepository;
  runId: string;
}): Promise<StoryEvalCiReportCommandResult> {
  const commandInput = StoryEvalExportCommandInputSchema.parse(input);
  const ciReport = await input.repository.createCiReport({
    runId: commandInput.runId,
    baselineRunId: commandInput.baselineRunId,
    generatedAt: commandInput.generatedAt,
  });

  return {
    ci_report: ciReport,
    serialized_ci_report: serializeStoryEvalCiReport(ciReport),
  };
}

export function createMemoryStoryEvalHistoryStorage(
  seed?: StoryEvalRunHistoryFile,
): StoryEvalHistoryStorageAdapter & {
  readRawStoredValue(): unknown | null;
} {
  let value: unknown | null = seed ?? null;

  return {
    async load() {
      return value;
    },
    readRawStoredValue() {
      return value;
    },
    async save(history) {
      value = parseStoryEvalRunHistoryFile(history);
    },
  };
}

export async function readStoryEvalHistory(
  storage: StoryEvalHistoryStorageAdapter,
): Promise<StoryEvalRunHistoryFile> {
  const stored = await storage.load();

  if (!stored) {
    return {
      version: 1,
      updated_at: "",
      runs: [],
    };
  }

  return parseStoryEvalRunHistoryFile(stored);
}
