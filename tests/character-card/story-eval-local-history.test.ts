import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  compareStoryEvalRunHistoryCommand,
  createStoryEvalLocalHistoryRepository,
  exportStoryEvalCiReportCommand,
  listStoryEvalRunHistoryCommand,
  runStoryEvalFixtureTextCommand,
} from "../../lib/character-card/storyEvalLocalHistory";

test("story eval local history command runs fixture text and persists evidence-light history", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "heartwriteai-storyeval-command-"));
  const historyFilePath = join(tempDir, "storyeval-history.json");
  const fixtureText = JSON.stringify({
    run_id: "run-storyeval-command",
    created_at: "2026-10-11T04:00:00.000Z",
    storybook_id: "storybook-local-command",
    streaming_response_reconstruction: {
      suite_id: "streaming-response-reconstruction",
      fixtures: [
        {
          case_id: "token_stitching",
          evidence_ref: "fixture:streaming/private-token-stitching",
          expected_text: "Evaluating softly.",
          reconstructed_text: "Evaluating softly.",
          final_buffer_flushed: true,
        },
      ],
    },
  });

  const result = await runStoryEvalFixtureTextCommand({
    fixtureText,
    historyFilePath,
    generatedAt: "2026-10-11T04:01:00.000Z",
    updatedAt: "2026-10-11T04:01:00.000Z",
  });
  const rawHistoryFileText = await readFile(historyFilePath, "utf8");

  assert.equal(result.run.run_id, "run-storyeval-command");
  assert.equal(result.history.runs.length, 1);
  assert.equal(result.ci_report.passed, true);
  assert.equal(result.serialized_ci_report.includes("Evaluating softly."), false);
  assert.equal(result.serialized_ci_report.includes("evidence_ref"), false);
  assert.equal(rawHistoryFileText.includes("Evaluating softly."), false);
  assert.equal(rawHistoryFileText.includes("expected_text"), false);
  assert.equal(rawHistoryFileText.includes("fixture:streaming/private-token-stitching"), false);
});

test("story eval local history commands list compare and export saved aggregate runs", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "heartwriteai-storyeval-command-"));
  const historyFilePath = join(tempDir, "storyeval-history.json");
  const repository = createStoryEvalLocalHistoryRepository({ historyFilePath });

  await runStoryEvalFixtureTextCommand({
    fixtureText: JSON.stringify({
      run_id: "run-storyeval-baseline",
      created_at: "2026-10-11T04:05:00.000Z",
      source_intake_safety: {
        fixtures: [
          {
            suite_id: "source-intake-safety",
            evidence_ref: "fixture:source-intake/private-baseline",
            malformed_schema_rejected: true,
            structural_controls_stripped: true,
            display_text_escaped: true,
            model_prompt_preserved_plain_text: false,
            raw_source_preserved_separately: true,
            rendered_fields_reviewed: true,
          },
        ],
      },
    }),
    repository,
    updatedAt: "2026-10-11T04:06:00.000Z",
  });
  await runStoryEvalFixtureTextCommand({
    fixtureText: JSON.stringify({
      run_id: "run-storyeval-candidate",
      created_at: "2026-10-11T04:10:00.000Z",
      source_intake_safety: {
        fixtures: [
          {
            suite_id: "source-intake-safety",
            evidence_ref: "fixture:source-intake/private-candidate",
            malformed_schema_rejected: true,
            structural_controls_stripped: true,
            display_text_escaped: true,
            model_prompt_preserved_plain_text: true,
            raw_source_preserved_separately: true,
            rendered_fields_reviewed: true,
          },
        ],
      },
    }),
    repository,
    updatedAt: "2026-10-11T04:11:00.000Z",
  });

  const history = await listStoryEvalRunHistoryCommand({ repository });
  const comparison = await compareStoryEvalRunHistoryCommand({
    repository,
    baselineRunId: "run-storyeval-baseline",
    candidateRunId: "run-storyeval-candidate",
  });
  const exportResult = await exportStoryEvalCiReportCommand({
    repository,
    runId: "run-storyeval-candidate",
    baselineRunId: "run-storyeval-baseline",
    generatedAt: "2026-10-11T04:12:00.000Z",
  });

  assert.deepEqual(history.runs.map((run) => run.run_id), [
    "run-storyeval-candidate",
    "run-storyeval-baseline",
  ]);
  assert.equal(comparison.status, "improved");
  assert.deepEqual(comparison.failed_cases_resolved, [
    "model_prompt_preserved_plain_text",
  ]);
  assert.equal(exportResult.ci_report.passed, true);
  assert.equal(exportResult.ci_report.comparison?.status, "improved");
  assert.equal(exportResult.serialized_ci_report.includes("fixture:"), false);
});
