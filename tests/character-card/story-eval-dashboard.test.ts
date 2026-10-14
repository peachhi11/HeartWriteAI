import assert from "node:assert/strict";
import test from "node:test";

import {
  assertStoryEvalCiReportTextIsAggregateOnly,
  createStoryEvalCiReportDownload,
  createStoryEvalDashboardState,
  formatStoryEvalComparisonSummary,
} from "../../lib/character-card/storyEvalDashboard";
import type { StoryEvalCiReportCommandResult } from "../../lib/character-card/storyEvalHistoryRepository";
import type {
  StoryEvalRunComparison,
  StoryEvalRunHistoryFile,
} from "../../lib/character-card/storyEvalRunner";

const HISTORY: StoryEvalRunHistoryFile = {
  version: 1,
  updated_at: "2026-10-13T00:00:00.000Z",
  runs: [
    {
      run_id: "run-candidate",
      created_at: "2026-10-13T00:00:00.000Z",
      review_label: "Ready to Play",
      suite_count: 4,
      sample_count: 12,
      failed_story_eval_cases: [],
      warning_story_eval_cases: [],
      mitigation_proposal_count: 0,
    },
    {
      run_id: "run-baseline",
      created_at: "2026-10-12T00:00:00.000Z",
      review_label: "Review Before Export",
      suite_count: 4,
      sample_count: 12,
      failed_story_eval_cases: ["model_prompt_preserved_plain_text"],
      warning_story_eval_cases: ["rendered_fields_reviewed"],
      mitigation_proposal_count: 2,
    },
  ],
};

test("story eval dashboard chooses latest candidate and previous baseline by default", () => {
  const state = createStoryEvalDashboardState(HISTORY);

  assert.equal(state.candidateRunId, "run-candidate");
  assert.equal(state.baselineRunId, "run-baseline");
  assert.equal(state.canCompare, true);
  assert.equal(state.latestRun?.run_id, "run-candidate");
  assert.deepEqual(
    state.runOptions.map((option) => option.label),
    [
      "run-candidate · Ready to Play · 12 checks",
      "run-baseline · Review Before Export · 12 checks",
    ],
  );
});

test("story eval dashboard avoids comparing a run to itself", () => {
  const state = createStoryEvalDashboardState(HISTORY, {
    baselineRunId: "run-candidate",
    candidateRunId: "run-candidate",
  });

  assert.equal(state.candidateRunId, "run-candidate");
  assert.equal(state.baselineRunId, "run-baseline");
  assert.equal(state.canCompare, true);
});

test("story eval dashboard handles empty local history", () => {
  const state = createStoryEvalDashboardState({
    version: 1,
    updated_at: "",
    runs: [],
  });

  assert.equal(state.candidateRunId, "");
  assert.equal(state.baselineRunId, "");
  assert.equal(state.canCompare, false);
  assert.equal(state.statusText, "No local StoryEval runs saved yet.");
});

test("story eval comparison summary stays aggregate-only and readable", () => {
  const comparison: StoryEvalRunComparison = {
    baseline_run_id: "run-baseline",
    candidate_run_id: "run-candidate",
    baseline_review_label: "Review Before Export",
    candidate_review_label: "Ready to Play",
    suite_count_delta: 0,
    sample_count_delta: 2,
    mitigation_proposal_count_delta: -2,
    failed_cases_added: [],
    failed_cases_resolved: ["model_prompt_preserved_plain_text"],
    warning_cases_added: [],
    warning_cases_resolved: ["rendered_fields_reviewed"],
    status: "improved",
  };

  assert.equal(
    formatStoryEvalComparisonSummary(comparison),
    [
      "Comparison: run-baseline -> run-candidate",
      "Status: improved",
      "Samples: +2",
      "Suites: 0",
      "Mitigations: -2",
      "Resolved failures: model_prompt_preserved_plain_text",
      "Resolved warnings: rendered_fields_reviewed",
      "",
    ].join("\n"),
  );
});

test("story eval CI report download rejects private fixture leakage", () => {
  const report: StoryEvalCiReportCommandResult = {
    ci_report: {
      version: 1,
      generated_at: "2026-10-13T00:00:00.000Z",
      run: HISTORY.runs[0]!,
      passed: true,
      review_label: "Ready to Play",
      summary: {
        suite_count: 4,
        sample_count: 12,
        failed_story_eval_case_count: 0,
        warning_story_eval_case_count: 0,
        mitigation_proposal_count: 0,
      },
    },
    serialized_ci_report: '{"run":{"run_id":"run-candidate"}}\n',
  };

  const download = createStoryEvalCiReportDownload({
    report,
    runId: "Run Candidate!",
  });

  assert.equal(download.fileName, "storyeval-run-candidate-ci-report.json");
  assert.equal(download.text, '{"run":{"run_id":"run-candidate"}}\n');
  assert.throws(() =>
    assertStoryEvalCiReportTextIsAggregateOnly('{"evidence_ref":"fixture:private"}'),
  );
});
