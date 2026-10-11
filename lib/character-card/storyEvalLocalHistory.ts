import { z } from "zod";

import {
  writeStoryEvalRunHistoryFile,
  type StoryEvalRunComparison,
  type StoryEvalRunHistoryFile,
} from "./storyEvalRunner";
import {
  compareStoryEvalRunHistory,
  createStoryEvalHistoryRepository,
  exportStoryEvalCiReport,
  runStoryEvalFixtureTextWithHistory,
  type StoryEvalCiReportCommandResult,
  type StoryEvalFixtureTextCommandResult,
  type StoryEvalHistoryRepository,
  type StoryEvalHistoryStorageAdapter,
} from "./storyEvalHistoryRepository";

const StoryEvalHistoryFilePathSchema = z.string().trim().min(1);

const StoryEvalHistoryPathCommandInputSchema = z.object({
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
});

const StoryEvalCompareCommandInputSchema = z.object({
  baselineRunId: z.string().trim().min(1),
  candidateRunId: z.string().trim().min(1),
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
});

const StoryEvalExportCommandInputSchema = z.object({
  baselineRunId: z.string().trim().min(1).optional(),
  generatedAt: z.string().trim().min(1).optional(),
  historyFilePath: StoryEvalHistoryFilePathSchema.optional(),
  runId: z.string().trim().min(1),
});

export type StoryEvalLocalHistoryRepository = StoryEvalHistoryRepository;
export type { StoryEvalCiReportCommandResult, StoryEvalFixtureTextCommandResult };

export function createStoryEvalLocalHistoryRepository(input: {
  historyFilePath: string;
}): StoryEvalLocalHistoryRepository {
  const historyFilePath = StoryEvalHistoryFilePathSchema.parse(input.historyFilePath);

  return createStoryEvalHistoryRepository({
    storage: createStoryEvalFileHistoryStorage(historyFilePath),
  });
}

export async function runStoryEvalFixtureTextCommand(input: {
  fixtureText: string;
  generatedAt?: string;
  historyFilePath?: string;
  maxEntries?: number;
  repository?: StoryEvalLocalHistoryRepository;
  updatedAt?: string;
}): Promise<StoryEvalFixtureTextCommandResult> {
  const repository = resolveStoryEvalLocalHistoryRepository(input);

  return runStoryEvalFixtureTextWithHistory({
    fixtureText: input.fixtureText,
    generatedAt: input.generatedAt,
    maxEntries: input.maxEntries,
    repository,
    updatedAt: input.updatedAt,
  });
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

  return compareStoryEvalRunHistory({
    repository: resolveStoryEvalLocalHistoryRepository(input),
    baselineRunId: commandInput.baselineRunId,
    candidateRunId: commandInput.candidateRunId,
  });
}

export async function exportStoryEvalCiReportCommand(input: {
  baselineRunId?: string;
  generatedAt?: string;
  historyFilePath?: string;
  repository?: StoryEvalLocalHistoryRepository;
  runId: string;
}): Promise<StoryEvalCiReportCommandResult> {
  const commandInput = StoryEvalExportCommandInputSchema.parse(input);
  return exportStoryEvalCiReport({
    repository: resolveStoryEvalLocalHistoryRepository(input),
    runId: commandInput.runId,
    baselineRunId: commandInput.baselineRunId,
    generatedAt: commandInput.generatedAt,
  });
}

function resolveStoryEvalLocalHistoryRepository(input: {
  historyFilePath?: string;
  repository?: StoryEvalLocalHistoryRepository;
}): StoryEvalLocalHistoryRepository {
  if (input.repository) {
    return input.repository;
  }

  if (!input.historyFilePath) {
    throw new Error("StoryEval local history commands require a repository or historyFilePath.");
  }

  return createStoryEvalLocalHistoryRepository({
    historyFilePath: input.historyFilePath,
  });
}

function createStoryEvalFileHistoryStorage(
  historyFilePath: string,
): StoryEvalHistoryStorageAdapter {
  return {
    async load() {
      const { readFile } = await import("node:fs/promises");

      try {
        return JSON.parse(await readFile(historyFilePath, "utf8")) as unknown;
      } catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") {
          return null;
        }

        throw error;
      }
    },
    async save(history) {
      await writeStoryEvalRunHistoryFile(historyFilePath, history);
    },
  };
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
