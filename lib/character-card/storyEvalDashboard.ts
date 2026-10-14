import { type StoryEvalCiReportCommandResult } from "./storyEvalHistoryRepository";
import {
  type StoryEvalRunComparison,
  type StoryEvalRunHistoryEntry,
  type StoryEvalRunHistoryFile,
} from "./storyEvalRunner";

export type StoryEvalDashboardRunOption = {
  created_at: string;
  label: string;
  review_label: StoryEvalRunHistoryEntry["review_label"];
  run_id: string;
  sample_count: number;
  suite_count: number;
};

export type StoryEvalDashboardState = {
  baselineRunId: string;
  canCompare: boolean;
  candidateRunId: string;
  latestRun?: StoryEvalRunHistoryEntry;
  runOptions: StoryEvalDashboardRunOption[];
  statusText: string;
};

export function createStoryEvalDashboardState(
  history: StoryEvalRunHistoryFile,
  selection: {
    baselineRunId?: string;
    candidateRunId?: string;
  } = {},
): StoryEvalDashboardState {
  const runOptions = history.runs.map(createStoryEvalDashboardRunOption);
  const latestRun = history.runs[0];
  const candidateRunId =
    resolveSelectedRunId(history.runs, selection.candidateRunId) ?? latestRun?.run_id ?? "";
  const baselineRunId =
    resolveSelectedRunId(history.runs, selection.baselineRunId, candidateRunId) ??
    history.runs.find((run) => run.run_id !== candidateRunId)?.run_id ??
    "";

  return {
    baselineRunId,
    canCompare: Boolean(baselineRunId && candidateRunId && baselineRunId !== candidateRunId),
    candidateRunId,
    latestRun,
    runOptions,
    statusText: history.runs.length
      ? `${history.runs.length} aggregate StoryEval runs saved locally. Latest: ${latestRun?.run_id}.`
      : "No local StoryEval runs saved yet.",
  };
}

export function createStoryEvalDashboardRunOption(
  run: StoryEvalRunHistoryEntry,
): StoryEvalDashboardRunOption {
  return {
    run_id: run.run_id,
    created_at: run.created_at,
    review_label: run.review_label,
    suite_count: run.suite_count,
    sample_count: run.sample_count,
    label: `${run.run_id} · ${run.review_label} · ${run.sample_count} checks`,
  };
}

export function formatStoryEvalComparisonSummary(comparison: StoryEvalRunComparison): string {
  const lines = [
    `Comparison: ${comparison.baseline_run_id} -> ${comparison.candidate_run_id}`,
    `Status: ${comparison.status}`,
    `Samples: ${formatSignedDelta(comparison.sample_count_delta)}`,
    `Suites: ${formatSignedDelta(comparison.suite_count_delta)}`,
    `Mitigations: ${formatSignedDelta(comparison.mitigation_proposal_count_delta)}`,
  ];

  if (comparison.failed_cases_resolved.length > 0) {
    lines.push(`Resolved failures: ${comparison.failed_cases_resolved.join(", ")}`);
  }

  if (comparison.failed_cases_added.length > 0) {
    lines.push(`New failures: ${comparison.failed_cases_added.join(", ")}`);
  }

  if (comparison.warning_cases_resolved.length > 0) {
    lines.push(`Resolved warnings: ${comparison.warning_cases_resolved.join(", ")}`);
  }

  if (comparison.warning_cases_added.length > 0) {
    lines.push(`New warnings: ${comparison.warning_cases_added.join(", ")}`);
  }

  return `${lines.join("\n")}\n`;
}

export function createStoryEvalCiReportDownload(input: {
  report: StoryEvalCiReportCommandResult;
  runId: string;
}): {
  fileName: string;
  text: string;
} {
  assertStoryEvalCiReportTextIsAggregateOnly(input.report.serialized_ci_report);

  return {
    fileName: `storyeval-${slugifyFileSegment(input.runId)}-ci-report.json`,
    text: input.report.serialized_ci_report,
  };
}

export function assertStoryEvalCiReportTextIsAggregateOnly(reportText: string) {
  const forbiddenFragments = [
    "evidence_ref",
    "expected_text",
    "reconstructed_text",
    "fixture_text",
    "fixture:",
  ];
  const leakedFragment = forbiddenFragments.find((fragment) => reportText.includes(fragment));

  if (leakedFragment) {
    throw new Error(`StoryEval CI report contains private fixture material: ${leakedFragment}`);
  }
}

function resolveSelectedRunId(
  runs: readonly StoryEvalRunHistoryEntry[],
  requestedRunId?: string,
  excludedRunId?: string,
) {
  return runs.find((run) => run.run_id === requestedRunId && run.run_id !== excludedRunId)?.run_id;
}

function formatSignedDelta(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function slugifyFileSegment(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "run"
  );
}
