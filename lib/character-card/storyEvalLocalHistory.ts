import { z } from "zod";

import {
  compareStoryEvalRunHistoryEntries,
  createStoryEvalCiReport,
  createStoryEvalRunFromFixtureFile,
  createStoryEvalRunHistoryEntry,
  parseStoryEvalFixtureText,
  persistStoryEvalRunHistory,
  readStoryEvalRunHistoryFile,
  serializeStoryEvalCiReport,
  type StoryEvalCiReport,
  type StoryEvalRunComparison,
  type StoryEvalRunHistoryEntry,
  type StoryEvalRunHistoryFile,
} from "./storyEvalRunner";

const StoryEvalHistoryFilePathSchema = z.string().trim().min(1);

const StoryEvalRunIdSchema = z.string().trim().min(1);

const StoryEvalTimestampSchema = z.string().trim().min(1);

const StoryEvalMaxEntriesSchema = z.number().int().positive().optional();

const StoryEvalRunHistoryCommandInputSchema = z.object({
  fixtureText: z.string().trim().min(1),
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
  generatedAt: StoryEvalTimestampSchema.optional(),
  maxEntries: StoryEvalMaxEntriesSchema,
  updatedAt: StoryEvalTimestampSchema.optional(),
});

const StoryEvalHistoryPathCommandInputSchema = z.object({
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
});

const StoryEvalCompareCommandInputSchema = z.object({
  baselineRunId: StoryEvalRunIdSchema,
  candidateRunId: StoryEvalRunIdSchema,
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
});

const StoryEvalExportCommandInputSchema = z.object({
  baselineRunId: StoryEvalRunIdSchema.optional(),
  generatedAt: StoryEvalTimestampSchema.optional(),
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
  runId: StoryEvalRunIdSchema,
});

export type StoryEvalLocalHistoryRepository = {
  compareRuns(
    baselineRunId: string,
    candidateRunId: string,
  ): Promise<StoryEvalRunComparison>;
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

export function createStoryEvalLocalHistoryRepository(input: {
  historyFilePath: string;
}): StoryEvalLocalHistoryRepository {
  const historyFilePath = StoryEvalHistoryFilePathSchema.parse(
    input.historyFilePath,
  );

  return {
    async compareRuns(baselineRunId, candidateRunId) {
      return compareStoryEvalRunHistoryEntries(
        await this.findRun(baselineRunId),
        await this.findRun(candidateRunId),
      );
    },
    async createCiReport(input) {
      const run = await this.findRun(input.runId);
      const baseline = input.baselineRunId
        ? await this.findRun(input.baselineRunId)
        : undefined;

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
      return readStoryEvalRunHistoryFile(historyFilePath);
    },
    async saveRun(run, options) {
      return persistStoryEvalRunHistory({
        historyFilePath,
        run,
        maxEntries: options?.maxEntries,
        updatedAt: options?.updatedAt,
      });
    },
  };
}

export async function runStoryEvalFixtureTextCommand(input: {
  fixtureText: string;
  generatedAt?: string;
  historyFilePath?: string;
  maxEntries?: number;
  repository?: StoryEvalLocalHistoryRepository;
  updatedAt?: string;
}): Promise<StoryEvalFixtureTextCommandResult> {
  const commandInput = StoryEvalRunHistoryCommandInputSchema.parse(input);
  const repository = resolveStoryEvalLocalHistoryRepository(input);
  const runResult = createStoryEvalRunFromFixtureFile(
    parseStoryEvalFixtureText(commandInput.fixtureText),
  );
  const history = await repository.saveRun(runResult, {
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

export async function listStoryEvalRunHistoryCommand(input: {
  historyFilePath?: string;
  repository?: StoryEvalLocalHistoryRepository;
}): Promise<StoryEvalRunHistoryFile> {
  StoryEvalHistoryPathCommandInputSchema.parse(input);

  return resolveStoryEvalLocalHistoryRepository(input).listRuns();
}

export async function compareStoryEvalRunHistoryCommand(input: {
  baselineRunId: string;
  candidateRunId: string;
  historyFilePath?: string;
  repository?: StoryEvalLocalHistoryRepository;
}): Promise<StoryEvalRunComparison> {
  const commandInput = StoryEvalCompareCommandInputSchema.parse(input);

  return resolveStoryEvalLocalHistoryRepository(input).compareRuns(
    commandInput.baselineRunId,
    commandInput.candidateRunId,
  );
}

export async function exportStoryEvalCiReportCommand(input: {
  baselineRunId?: string;
  generatedAt?: string;
  historyFilePath?: string;
  repository?: StoryEvalLocalHistoryRepository;
  runId: string;
}): Promise<StoryEvalCiReportCommandResult> {
  const commandInput = StoryEvalExportCommandInputSchema.parse(input);
  const ciReport = await resolveStoryEvalLocalHistoryRepository(
    input,
  ).createCiReport({
    runId: commandInput.runId,
    baselineRunId: commandInput.baselineRunId,
    generatedAt: commandInput.generatedAt,
  });

  return {
    ci_report: ciReport,
    serialized_ci_report: serializeStoryEvalCiReport(ciReport),
  };
}

function resolveStoryEvalLocalHistoryRepository(input: {
  historyFilePath?: string;
  repository?: StoryEvalLocalHistoryRepository;
}): StoryEvalLocalHistoryRepository {
  if (input.repository) {
    return input.repository;
  }

  if (!input.historyFilePath) {
    throw new Error(
      "StoryEval local history commands require a repository or historyFilePath.",
    );
  }

  return createStoryEvalLocalHistoryRepository({
    historyFilePath: input.historyFilePath,
  });
}
