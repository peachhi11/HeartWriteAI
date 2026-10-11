import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  appendStoryEvalRunHistory,
  compareStoryEvalRunHistoryEntries,
  createStoryEvalCiReport,
  createStoryEvalRunFromFixtureFile,
  createStoryEvalRunHistoryEntry,
  createSourceIntakeSafetySuite,
  createStoryEvalRun,
  createStoryEvalSuite,
  parseStoryEvalFixtureText,
  persistStoryEvalRunHistory,
  serializeStoryEvalCiReport,
  type StoryEvalRunHistoryEntry,
} from "../../lib/character-card/storyEvalRunner";

test("story eval runner assembles deterministic suites behind one module seam", () => {
  const streamingSuite = createStoryEvalSuite({
    suite_id: "streaming-response-reconstruction",
    run_id: "run-storyeval-runner",
    created_at: "2026-10-10T08:00:00.000Z",
    kind: "streaming_response_reconstruction",
    cases: [
      {
        case_id: "token_stitching",
        status: "pass",
        evidence_refs: ["fixture:streaming/token-stitching"],
      },
    ],
  });
  const sourceIntakeSuite = createSourceIntakeSafetySuite({
    run_id: "run-storyeval-runner",
    created_at: "2026-10-10T08:00:00.000Z",
    fixture: {
      suite_id: "source-intake-safety",
      evidence_ref: "fixture:source-intake/card-boundaries",
      malformed_schema_rejected: true,
      structural_controls_stripped: true,
      display_text_escaped: true,
      model_prompt_preserved_plain_text: true,
      raw_source_preserved_separately: true,
      rendered_fields_reviewed: false,
    },
  });
  const result = createStoryEvalRun({
    run_id: "run-storyeval-runner",
    created_at: "2026-10-10T08:01:00.000Z",
    story_eval_suites: [streamingSuite, sourceIntakeSuite],
  });

  assert.equal(result.summary.suite_count, 2);
  assert.equal(result.summary.sample_count, 7);
  assert.equal(result.summary.review_label, "Needs Your Eye");
  assert.deepEqual(result.summary.warning_story_eval_cases, [
    "rendered_fields_reviewed",
  ]);
  assert.equal("evidence_refs" in result.summary, false);
});

test("story eval runner loads JSON fixture text into aggregate-only run results", () => {
  const fixtureFile = parseStoryEvalFixtureText(JSON.stringify({
    run_id: "run-storyeval-json-fixture",
    created_at: "2026-10-10T08:05:00.000Z",
    storybook_id: "storybook-rose-house",
    source_intake_safety: {
      fixtures: [
        {
          suite_id: "source-intake-safety",
          evidence_ref: "fixture:source-intake/json-card",
          malformed_schema_rejected: true,
          structural_controls_stripped: true,
          display_text_escaped: true,
          model_prompt_preserved_plain_text: false,
          raw_source_preserved_separately: true,
          rendered_fields_reviewed: true,
        },
      ],
    },
  }));
  const run = createStoryEvalRunFromFixtureFile(fixtureFile);

  assert.equal(run.metadata.run_id, "run-storyeval-json-fixture");
  assert.equal(run.metadata.storybook_id, "storybook-rose-house");
  assert.equal(run.summary.review_label, "Review Before Export");
  assert.deepEqual(run.summary.failed_story_eval_cases, [
    "model_prompt_preserved_plain_text",
  ]);
  assert.equal("raw_fixture_text" in run.suites.story_eval_suites[0].cases[0], false);
});

test("story eval runner loads JSONL fixture lines and keeps history evidence-light", () => {
  const jsonl = [
    {
      run_id: "run-storyeval-jsonl-fixture",
      created_at: "2026-10-10T08:10:00.000Z",
      kind: "streaming_response_reconstruction",
      fixture: {
        case_id: "token_stitching",
        evidence_ref: "fixture:streaming/jsonl-token-stitching",
        expected_text: "Evaluating softly.",
        reconstructed_text: "Evaluating softly.",
        final_buffer_flushed: true,
      },
    },
    {
      run_id: "run-storyeval-jsonl-fixture",
      created_at: "2026-10-10T08:10:00.000Z",
      kind: "export_serialization_integrity",
      fixture: {
        suite_id: "export-serialization-integrity",
        evidence_ref: "fixture:export/jsonl-card",
        json_roundtrip_valid: true,
        fixed_clock_used: true,
        roleplay_syntax_preserved: true,
        unsupported_internal_fields_warned: true,
        target_schema_valid: true,
      },
    },
  ].map((line) => JSON.stringify(line)).join("\n");
  const run = createStoryEvalRunFromFixtureFile(
    parseStoryEvalFixtureText(jsonl),
  );
  const historyEntry = createStoryEvalRunHistoryEntry(run);
  const history = appendStoryEvalRunHistory({
    history: [
      {
        ...historyEntry,
        run_id: "older-run",
        created_at: "2026-10-09T08:10:00.000Z",
      },
    ],
    run,
    maxEntries: 2,
  });

  assert.equal(run.summary.suite_count, 2);
  assert.equal(run.summary.sample_count, 7);
  assert.equal(historyEntry.mitigation_proposal_count, 0);
  assert.deepEqual(history.map((entry) => entry.run_id), [
    "run-storyeval-jsonl-fixture",
    "older-run",
  ]);
  assert.equal("suites" in historyEntry, false);
});

test("story eval runner persists aggregate run history without raw fixture text", async () => {
  const fixtureFile = parseStoryEvalFixtureText(JSON.stringify({
    run_id: "run-storyeval-disk-history",
    created_at: "2026-10-10T09:00:00.000Z",
    streaming_response_reconstruction: {
      suite_id: "streaming-response-reconstruction",
      fixtures: [
        {
          case_id: "token_stitching",
          evidence_ref: "fixture:streaming/disk-token-stitching",
          expected_text: "Evaluating softly.",
          reconstructed_text: "Evaluating softly.",
          final_buffer_flushed: true,
        },
      ],
    },
  }));
  const run = createStoryEvalRunFromFixtureFile(fixtureFile);
  const tempDir = await mkdtemp(join(tmpdir(), "heartwriteai-storyeval-"));
  const historyFilePath = join(tempDir, "storyeval-history.json");

  const historyFile = await persistStoryEvalRunHistory({
    historyFilePath,
    run,
    updatedAt: "2026-10-10T09:01:00.000Z",
  });
  const rawHistoryFileText = await readFile(historyFilePath, "utf8");

  assert.equal(historyFile.version, 1);
  assert.equal(historyFile.updated_at, "2026-10-10T09:01:00.000Z");
  assert.equal(historyFile.runs.length, 1);
  assert.equal(historyFile.runs[0]?.run_id, "run-storyeval-disk-history");
  assert.equal(historyFile.runs[0]?.review_label, "Ready to Play");
  assert.equal(rawHistoryFileText.includes("Evaluating softly."), false);
  assert.equal(rawHistoryFileText.includes("expected_text"), false);
  assert.equal(rawHistoryFileText.includes("reconstructed_text"), false);
  assert.equal(rawHistoryFileText.includes("evidence_ref"), false);
});

test("story eval runner compares aggregate histories by added and resolved cases", () => {
  const baseline: StoryEvalRunHistoryEntry = {
    run_id: "run-baseline",
    created_at: "2026-10-10T09:05:00.000Z",
    review_label: "Review Before Export",
    suite_count: 4,
    sample_count: 20,
    failed_story_eval_cases: ["old_failure"],
    warning_story_eval_cases: ["old_warning"],
    mitigation_proposal_count: 2,
  };
  const candidate: StoryEvalRunHistoryEntry = {
    run_id: "run-candidate",
    created_at: "2026-10-10T09:10:00.000Z",
    review_label: "Review Before Export",
    suite_count: 4,
    sample_count: 21,
    failed_story_eval_cases: ["new_failure"],
    warning_story_eval_cases: ["new_warning"],
    mitigation_proposal_count: 3,
  };

  const comparison = compareStoryEvalRunHistoryEntries(baseline, candidate);

  assert.equal(comparison.status, "regressed");
  assert.deepEqual(comparison.failed_cases_added, ["new_failure"]);
  assert.deepEqual(comparison.failed_cases_resolved, ["old_failure"]);
  assert.deepEqual(comparison.warning_cases_added, ["new_warning"]);
  assert.deepEqual(comparison.warning_cases_resolved, ["old_warning"]);
  assert.equal(comparison.sample_count_delta, 1);
  assert.equal(comparison.mitigation_proposal_count_delta, 1);
});

test("story eval runner exports CI-friendly reports without suites or evidence refs", () => {
  const run = createStoryEvalRun({
    run_id: "run-storyeval-ci",
    created_at: "2026-10-10T09:15:00.000Z",
    story_eval_suites: [
      createStoryEvalSuite({
        suite_id: "ci-suite",
        run_id: "run-storyeval-ci",
        created_at: "2026-10-10T09:15:00.000Z",
        kind: "export_serialization_integrity",
        cases: [
          {
            case_id: "target_schema_valid",
            status: "fail",
            review_label: "Review Before Export",
            evidence_refs: ["fixture:ci/private-card"],
            mitigation_proposal:
              "Validate exported payloads against the selected platform schema.",
          },
        ],
      }),
    ],
  });
  const report = createStoryEvalCiReport({
    run,
    generatedAt: "2026-10-10T09:16:00.000Z",
  });
  const serialized = serializeStoryEvalCiReport(report);

  assert.equal(report.passed, false);
  assert.equal(report.review_label, "Review Before Export");
  assert.equal(report.summary.failed_story_eval_case_count, 1);
  assert.equal(serialized.includes("\"suites\""), false);
  assert.equal(serialized.includes("fixture:ci/private-card"), false);
  assert.equal(serialized.includes("evidence_refs"), false);
  assert.equal(JSON.parse(serialized).run.run_id, "run-storyeval-ci");
});
