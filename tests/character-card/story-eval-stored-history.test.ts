import assert from "node:assert/strict";
import test from "node:test";

import {
  compareStoryEvalStoredHistoryCommand,
  createMemoryStoryEvalStoredHistoryStorage,
  createStoryEvalStoredHistoryRepository,
  exportStoryEvalStoredCiReportCommand,
  listStoryEvalStoredHistoryCommand,
  runStoryEvalFixtureTextStoredCommand,
} from "../../lib/character-card/storyEvalStoredHistory";

test("story eval stored history repository persists aggregate runs across repository instances", async () => {
  const storage = createMemoryStoryEvalStoredHistoryStorage();
  const fixtureText = JSON.stringify({
    run_id: "run-store-roundtrip",
    created_at: "2026-10-11T06:00:00.000Z",
    storybook_id: "storybook-store-roundtrip",
    streaming_response_reconstruction: {
      suite_id: "streaming-response-reconstruction",
      fixtures: [
        {
          case_id: "store_token_stitching",
          evidence_ref: "fixture:streaming/private-store-roundtrip",
          expected_text: "Private stream text should not persist.",
          reconstructed_text: "Private stream text should not persist.",
          final_buffer_flushed: true,
        },
      ],
    },
  });

  await runStoryEvalFixtureTextStoredCommand({
    fixtureText,
    storage,
    updatedAt: "2026-10-11T06:01:00.000Z",
  });

  const freshRepository = createStoryEvalStoredHistoryRepository({ storage });
  const history = await listStoryEvalStoredHistoryCommand({
    repository: freshRepository,
  });
  const rawStoredValue = JSON.stringify(storage.readRawStoredValue());

  assert.equal(history.updated_at, "2026-10-11T06:01:00.000Z");
  assert.deepEqual(history.runs.map((run) => run.run_id), [
    "run-store-roundtrip",
  ]);
  assert.equal(rawStoredValue.includes("Private stream text should not persist."), false);
  assert.equal(rawStoredValue.includes("expected_text"), false);
  assert.equal(rawStoredValue.includes("fixture:streaming/private-store-roundtrip"), false);
});

test("story eval stored history commands compare and export through the native storage seam", async () => {
  const storage = createMemoryStoryEvalStoredHistoryStorage();

  await runStoryEvalFixtureTextStoredCommand({
    fixtureText: JSON.stringify({
      run_id: "run-store-baseline",
      created_at: "2026-10-11T06:05:00.000Z",
      source_intake_safety: {
        fixtures: [
          {
            suite_id: "source-intake-safety",
            evidence_ref: "fixture:source-intake/private-store-baseline",
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
    storage,
    updatedAt: "2026-10-11T06:06:00.000Z",
  });
  await runStoryEvalFixtureTextStoredCommand({
    fixtureText: JSON.stringify({
      run_id: "run-store-candidate",
      created_at: "2026-10-11T06:10:00.000Z",
      source_intake_safety: {
        fixtures: [
          {
            suite_id: "source-intake-safety",
            evidence_ref: "fixture:source-intake/private-store-candidate",
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
    storage,
    updatedAt: "2026-10-11T06:11:00.000Z",
  });

  const comparison = await compareStoryEvalStoredHistoryCommand({
    baselineRunId: "run-store-baseline",
    candidateRunId: "run-store-candidate",
    storage,
  });
  const exportResult = await exportStoryEvalStoredCiReportCommand({
    baselineRunId: "run-store-baseline",
    generatedAt: "2026-10-11T06:12:00.000Z",
    runId: "run-store-candidate",
    storage,
  });

  assert.equal(comparison.status, "improved");
  assert.deepEqual(comparison.failed_cases_resolved, [
    "model_prompt_preserved_plain_text",
  ]);
  assert.equal(exportResult.ci_report.comparison?.status, "improved");
  assert.equal(exportResult.serialized_ci_report.includes("fixture:"), false);
  assert.equal(exportResult.serialized_ci_report.includes("evidence_ref"), false);
});
