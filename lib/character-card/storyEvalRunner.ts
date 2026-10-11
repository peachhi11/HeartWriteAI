import {
  EvaluationWindowGuardrailTraceSchema,
  ReasoningIntegritySuiteSchema,
  StoryEvalCaseSchema,
  StoryEvalRunResultSchema,
  StoryEvalSuiteSchema,
  type EvaluationWindowGuardrailTrace,
  type ExportSerializationFixture,
  type LorebookActivationFixture,
  type ReasoningIntegritySuite,
  type SourceIntakeSafetyFixture,
  type StoryEvalCaseInput,
  type StoryEvalRunResult,
  type StoryEvalSuite,
  type StoryEvalSuiteKind,
  type StreamingReconstructionFixture,
} from "./evaluationWindowGuardrailTrace";

export type StoryEvalFixtureLine = {
  run_id: string;
  created_at: string;
  storybook_id?: string;
  privacy_mode?: "aggregate_only" | "explicitly_saved_source";
  kind:
    | "streaming_response_reconstruction"
    | "source_intake_safety"
    | "export_serialization_integrity"
    | "lorebook_activation_integrity";
  fixture:
    | StreamingReconstructionFixture
    | SourceIntakeSafetyFixture
    | ExportSerializationFixture
    | LorebookActivationFixture;
  source_note?: string;
};

export type StoryEvalFixtureFile = {
  run_id: string;
  created_at: string;
  storybook_id?: string;
  privacy_mode?: "aggregate_only" | "explicitly_saved_source";
  streaming_response_reconstruction?: {
    suite_id: string;
    source_note?: string;
    fixtures: readonly StreamingReconstructionFixture[];
  };
  source_intake_safety?: {
    source_note?: string;
    fixtures: readonly SourceIntakeSafetyFixture[];
  };
  export_serialization_integrity?: {
    source_note?: string;
    fixtures: readonly ExportSerializationFixture[];
  };
  lorebook_activation_integrity?: {
    source_note?: string;
    fixtures: readonly LorebookActivationFixture[];
  };
};

export type StoryEvalRunInput = {
  run_id: string;
  created_at: string;
  storybook_id?: string;
  privacy_mode?: "aggregate_only" | "explicitly_saved_source";
  evaluation_window_guardrail_traces?: readonly EvaluationWindowGuardrailTrace[];
  reasoning_integrity_suites?: readonly ReasoningIntegritySuite[];
  story_eval_suites?: readonly StoryEvalSuite[];
};

export type StoryEvalRunHistoryEntry = {
  run_id: string;
  created_at: string;
  storybook_id?: string;
  review_label: StoryEvalRunResult["summary"]["review_label"];
  suite_count: number;
  sample_count: number;
  failed_story_eval_cases: string[];
  warning_story_eval_cases: string[];
  mitigation_proposal_count: number;
};

export type StoryEvalRunHistoryFile = {
  version: 1;
  updated_at: string;
  runs: StoryEvalRunHistoryEntry[];
};

export type StoryEvalRunComparison = {
  baseline_run_id: string;
  candidate_run_id: string;
  baseline_review_label: StoryEvalRunHistoryEntry["review_label"];
  candidate_review_label: StoryEvalRunHistoryEntry["review_label"];
  suite_count_delta: number;
  sample_count_delta: number;
  mitigation_proposal_count_delta: number;
  failed_cases_added: string[];
  failed_cases_resolved: string[];
  warning_cases_added: string[];
  warning_cases_resolved: string[];
  status: "improved" | "regressed" | "unchanged" | "changed";
};

export type StoryEvalCiReport = {
  version: 1;
  generated_at: string;
  run: StoryEvalRunHistoryEntry;
  comparison?: StoryEvalRunComparison;
  passed: boolean;
  review_label: StoryEvalRunHistoryEntry["review_label"];
  summary: {
    suite_count: number;
    sample_count: number;
    failed_story_eval_case_count: number;
    warning_story_eval_case_count: number;
    mitigation_proposal_count: number;
  };
};

export function parseStoryEvalFixtureText(text: string): StoryEvalFixtureFile {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("StoryEval fixture text cannot be empty.");
  }

  if (trimmed.startsWith("{")) {
    try {
      return parseStoryEvalFixtureFile(JSON.parse(trimmed) as unknown);
    } catch (error) {
      if (!trimmed.includes("\n")) {
        throw error;
      }
    }
  }

  return parseStoryEvalFixtureLines(
    trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as StoryEvalFixtureLine),
  );
}

export function createStoryEvalRunFromFixtureFile(
  fixtureFile: StoryEvalFixtureFile,
): StoryEvalRunResult {
  const storyEvalSuites: StoryEvalSuite[] = [];

  if (fixtureFile.streaming_response_reconstruction) {
    storyEvalSuites.push(
      createStreamingResponseReconstructionSuite({
        suite_id: fixtureFile.streaming_response_reconstruction.suite_id,
        run_id: fixtureFile.run_id,
        created_at: fixtureFile.created_at,
        source_note: fixtureFile.streaming_response_reconstruction.source_note,
        fixtures: fixtureFile.streaming_response_reconstruction.fixtures,
      }),
    );
  }

  for (const fixture of fixtureFile.source_intake_safety?.fixtures ?? []) {
    storyEvalSuites.push(
      createSourceIntakeSafetySuite({
        run_id: fixtureFile.run_id,
        created_at: fixtureFile.created_at,
        source_note: fixtureFile.source_intake_safety?.source_note,
        fixture,
      }),
    );
  }

  for (const fixture of fixtureFile.export_serialization_integrity?.fixtures ?? []) {
    storyEvalSuites.push(
      createExportSerializationIntegritySuite({
        run_id: fixtureFile.run_id,
        created_at: fixtureFile.created_at,
        source_note: fixtureFile.export_serialization_integrity?.source_note,
        fixture,
      }),
    );
  }

  for (const fixture of fixtureFile.lorebook_activation_integrity?.fixtures ?? []) {
    storyEvalSuites.push(
      createLorebookActivationIntegritySuite({
        run_id: fixtureFile.run_id,
        created_at: fixtureFile.created_at,
        source_note: fixtureFile.lorebook_activation_integrity?.source_note,
        fixture,
      }),
    );
  }

  return createStoryEvalRun({
    run_id: fixtureFile.run_id,
    created_at: fixtureFile.created_at,
    storybook_id: fixtureFile.storybook_id,
    privacy_mode: fixtureFile.privacy_mode,
    story_eval_suites: storyEvalSuites,
  });
}

export function createStoryEvalRunHistoryEntry(
  run: StoryEvalRunResult,
): StoryEvalRunHistoryEntry {
  return {
    run_id: run.metadata.run_id,
    created_at: run.metadata.created_at,
    storybook_id: run.metadata.storybook_id,
    review_label: run.summary.review_label,
    suite_count: run.summary.suite_count,
    sample_count: run.summary.sample_count,
    failed_story_eval_cases: run.summary.failed_story_eval_cases,
    warning_story_eval_cases: run.summary.warning_story_eval_cases,
    mitigation_proposal_count: run.summary.mitigation_proposals.length,
  };
}

export function appendStoryEvalRunHistory(input: {
  history: readonly StoryEvalRunHistoryEntry[];
  run: StoryEvalRunResult;
  maxEntries?: number;
}): StoryEvalRunHistoryEntry[] {
  const maxEntries = input.maxEntries ?? 50;

  if (!Number.isInteger(maxEntries) || maxEntries < 1) {
    throw new Error("StoryEval run history maxEntries must be a positive integer.");
  }

  const nextEntry = createStoryEvalRunHistoryEntry(input.run);

  return [
    nextEntry,
    ...input.history.filter((entry) => entry.run_id !== nextEntry.run_id),
  ]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, maxEntries);
}

export async function readStoryEvalRunHistoryFile(
  historyFilePath: string,
): Promise<StoryEvalRunHistoryFile> {
  const { readFile } = await import("node:fs/promises");

  try {
    return parseStoryEvalRunHistoryFile(
      JSON.parse(await readFile(historyFilePath, "utf8")) as unknown,
    );
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return {
        version: 1,
        updated_at: "",
        runs: [],
      };
    }

    throw error;
  }
}

export async function writeStoryEvalRunHistoryFile(
  historyFilePath: string,
  historyFile: StoryEvalRunHistoryFile,
): Promise<StoryEvalRunHistoryFile> {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  const parsed = parseStoryEvalRunHistoryFile(historyFile);

  await mkdir(dirname(historyFilePath), { recursive: true });
  await writeFile(
    historyFilePath,
    `${JSON.stringify(parsed, null, 2)}\n`,
    "utf8",
  );

  return parsed;
}

export async function persistStoryEvalRunHistory(input: {
  historyFilePath: string;
  run: StoryEvalRunResult;
  maxEntries?: number;
  updatedAt?: string;
}): Promise<StoryEvalRunHistoryFile> {
  const existing = await readStoryEvalRunHistoryFile(input.historyFilePath);
  const nextHistoryFile: StoryEvalRunHistoryFile = {
    version: 1,
    updated_at: input.updatedAt ?? input.run.metadata.created_at,
    runs: appendStoryEvalRunHistory({
      history: existing.runs,
      run: input.run,
      maxEntries: input.maxEntries,
    }),
  };

  return writeStoryEvalRunHistoryFile(input.historyFilePath, nextHistoryFile);
}

export function compareStoryEvalRunHistoryEntries(
  baseline: StoryEvalRunHistoryEntry,
  candidate: StoryEvalRunHistoryEntry,
): StoryEvalRunComparison {
  const failedCasesAdded = subtractValues(
    candidate.failed_story_eval_cases,
    baseline.failed_story_eval_cases,
  );
  const failedCasesResolved = subtractValues(
    baseline.failed_story_eval_cases,
    candidate.failed_story_eval_cases,
  );
  const warningCasesAdded = subtractValues(
    candidate.warning_story_eval_cases,
    baseline.warning_story_eval_cases,
  );
  const warningCasesResolved = subtractValues(
    baseline.warning_story_eval_cases,
    candidate.warning_story_eval_cases,
  );
  const status = resolveStoryEvalComparisonStatus({
    failedCasesAdded,
    failedCasesResolved,
    warningCasesAdded,
    warningCasesResolved,
    baseline,
    candidate,
  });

  return {
    baseline_run_id: baseline.run_id,
    candidate_run_id: candidate.run_id,
    baseline_review_label: baseline.review_label,
    candidate_review_label: candidate.review_label,
    suite_count_delta: candidate.suite_count - baseline.suite_count,
    sample_count_delta: candidate.sample_count - baseline.sample_count,
    mitigation_proposal_count_delta:
      candidate.mitigation_proposal_count - baseline.mitigation_proposal_count,
    failed_cases_added: failedCasesAdded,
    failed_cases_resolved: failedCasesResolved,
    warning_cases_added: warningCasesAdded,
    warning_cases_resolved: warningCasesResolved,
    status,
  };
}

export function createStoryEvalCiReport(input: {
  run: StoryEvalRunResult | StoryEvalRunHistoryEntry;
  baseline?: StoryEvalRunHistoryEntry;
  generatedAt?: string;
}): StoryEvalCiReport {
  const run = isStoryEvalRunResult(input.run)
    ? createStoryEvalRunHistoryEntry(input.run)
    : parseStoryEvalRunHistoryEntry(input.run);
  const comparison = input.baseline
    ? compareStoryEvalRunHistoryEntries(input.baseline, run)
    : undefined;

  return {
    version: 1,
    generated_at: input.generatedAt ?? run.created_at,
    run,
    comparison,
    passed:
      run.review_label === "Ready to Play" &&
      run.failed_story_eval_cases.length === 0 &&
      run.warning_story_eval_cases.length === 0,
    review_label: run.review_label,
    summary: {
      suite_count: run.suite_count,
      sample_count: run.sample_count,
      failed_story_eval_case_count: run.failed_story_eval_cases.length,
      warning_story_eval_case_count: run.warning_story_eval_cases.length,
      mitigation_proposal_count: run.mitigation_proposal_count,
    },
  };
}

export function serializeStoryEvalCiReport(report: StoryEvalCiReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function createStoryEvalSuite(input: {
  suite_id: string;
  run_id?: string;
  created_at: string;
  kind: StoryEvalSuiteKind;
  source_note?: string;
  cases: readonly StoryEvalCaseInput[];
}): StoryEvalSuite {
  const cases = input.cases.map((testCase) =>
    StoryEvalCaseSchema.parse(testCase),
  );
  const failedCases = cases
    .filter((testCase) => testCase.status === "fail")
    .map((testCase) => testCase.case_id);
  const warningCases = cases
    .filter((testCase) => testCase.status === "warning")
    .map((testCase) => testCase.case_id);
  const reviewLabel =
    failedCases.length > 0
      ? "Review Before Export"
      : warningCases.length > 0
        ? "Needs Your Eye"
        : "Ready to Play";

  return StoryEvalSuiteSchema.parse({
    category: "deterministic_story_eval",
    kind: input.kind,
    metadata: {
      suite_id: input.suite_id,
      run_id: input.run_id,
      created_at: input.created_at,
      source_note: input.source_note,
    },
    cases,
    summary: {
      case_count: cases.length,
      failed_cases: failedCases,
      warning_cases: warningCases,
      review_label: reviewLabel,
    },
  });
}

export function createStreamingResponseReconstructionSuite(input: {
  suite_id: string;
  run_id?: string;
  created_at: string;
  source_note?: string;
  fixtures: readonly StreamingReconstructionFixture[];
}): StoryEvalSuite {
  const cases = input.fixtures.map((fixture) => {
    const leakedMetadataKeys = fixture.leaked_metadata_keys ?? [];
    const failedChecks: string[] = [];
    const warningChecks: string[] = [];

    if (fixture.reconstructed_text !== fixture.expected_text) {
      failedChecks.push("exact token reconstruction failed");
    }

    if (leakedMetadataKeys.length > 0) {
      failedChecks.push("provider metadata leaked into visible text");
    }

    if (fixture.user_facing_fallback === false) {
      failedChecks.push("failure fallback was not user-facing");
    }

    if (fixture.final_buffer_flushed === false) {
      warningChecks.push("final buffer did not flush immediately");
    }

    if (fixture.partial_state_committed === false) {
      warningChecks.push("partial state was not committed on interruption");
    }

    if (fixture.ui_remained_unlocked === false) {
      warningChecks.push("UI did not remain ready for retry");
    }

    return createStoryEvalCaseFromFindings({
      caseId: fixture.case_id,
      evidenceRef: fixture.evidence_ref,
      failedChecks,
      warningChecks,
      failedMitigation:
        "Keep raw stream assembly exact, strip provider metadata, and route upstream failures to plain-language fallbacks.",
      warningMitigation:
        "Persist partial stream state and keep retry controls responsive during interrupted responses.",
    });
  });

  return createStoryEvalSuite({
    suite_id: input.suite_id,
    run_id: input.run_id,
    created_at: input.created_at,
    kind: "streaming_response_reconstruction",
    source_note:
      input.source_note ?? "Streaming Response Reconstruction Validation - 2026-10-09",
    cases,
  });
}

export function createSourceIntakeSafetySuite(input: {
  run_id?: string;
  created_at: string;
  source_note?: string;
  fixture: SourceIntakeSafetyFixture;
}): StoryEvalSuite {
  const fixture = input.fixture;
  const cases: StoryEvalCaseInput[] = [
    createBooleanStoryEvalCase({
      caseId: "malformed_schema_rejected",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.malformed_schema_rejected,
      failMitigation: "Reject malformed cards before source mining begins.",
    }),
    createBooleanStoryEvalCase({
      caseId: "structural_controls_stripped",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.structural_controls_stripped,
      failMitigation:
        "Strip or escape structural control tags before prompt compilation.",
    }),
    createBooleanStoryEvalCase({
      caseId: "display_text_escaped",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.display_text_escaped,
      failMitigation:
        "Render imported source through display-safe escaping before showing it.",
    }),
    createBooleanStoryEvalCase({
      caseId: "model_prompt_preserved_plain_text",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.model_prompt_preserved_plain_text,
      failMitigation:
        "Keep HTML entities out of model-facing prompts and exports.",
    }),
    createBooleanStoryEvalCase({
      caseId: "raw_source_preserved_separately",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.raw_source_preserved_separately,
      failMitigation:
        "Store raw imported material separately from compiled StoryBook fields.",
    }),
    createBooleanStoryEvalCase({
      caseId: "rendered_fields_reviewed",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.rendered_fields_reviewed,
      warningOnly: true,
      warningMitigation:
        "Require review state for every rendered card field before export.",
    }),
  ];

  return createStoryEvalSuite({
    suite_id: fixture.suite_id,
    run_id: input.run_id,
    created_at: input.created_at,
    kind: "source_intake_safety",
    source_note:
      input.source_note ?? "Lorebook Source Intake Export Eval Suites - 2026-10-10",
    cases,
  });
}

export function createExportSerializationIntegritySuite(input: {
  run_id?: string;
  created_at: string;
  source_note?: string;
  fixture: ExportSerializationFixture;
}): StoryEvalSuite {
  const fixture = input.fixture;
  const cases: StoryEvalCaseInput[] = [
    createBooleanStoryEvalCase({
      caseId: "json_roundtrip_valid",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.json_roundtrip_valid,
      failMitigation:
        "Exported JSON must parse and round-trip before it can be shared.",
    }),
    createBooleanStoryEvalCase({
      caseId: "fixed_clock_used",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.fixed_clock_used,
      warningOnly: true,
      warningMitigation:
        "Use a fixed test clock so export snapshots are deterministic.",
    }),
    createBooleanStoryEvalCase({
      caseId: "roleplay_syntax_preserved",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.roleplay_syntax_preserved,
      failMitigation:
        "Preserve quotes, asterisks, braces, and newlines during serialization.",
    }),
    createBooleanStoryEvalCase({
      caseId: "unsupported_internal_fields_warned",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.unsupported_internal_fields_warned,
      warningOnly: true,
      warningMitigation:
        "Warn before dropping internal fields that target platforms cannot run.",
    }),
    createBooleanStoryEvalCase({
      caseId: "target_schema_valid",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.target_schema_valid,
      failMitigation:
        "Validate exported payloads against the selected platform schema.",
    }),
    createBooleanStoryEvalCase({
      caseId: "binary_metadata_clean",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.binary_metadata_clean ?? true,
      failMitigation:
        "Regenerate image-embedded metadata when PNG/card bytes fail validation.",
    }),
  ];

  return createStoryEvalSuite({
    suite_id: fixture.suite_id,
    run_id: input.run_id,
    created_at: input.created_at,
    kind: "export_serialization_integrity",
    source_note: input.source_note ?? "Export Slot Format Validation - 2026-10-09",
    cases,
  });
}

export function createLorebookActivationIntegritySuite(input: {
  run_id?: string;
  created_at: string;
  source_note?: string;
  fixture: LorebookActivationFixture;
}): StoryEvalSuite {
  const fixture = input.fixture;
  const cases: StoryEvalCaseInput[] = [
    createBooleanStoryEvalCase({
      caseId: "cold_open_core_lore_loaded",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.cold_open_core_lore_loaded,
      warningOnly: true,
      warningMitigation:
        "Inject only the core primer on cold open without flooding the prompt.",
    }),
    createBooleanStoryEvalCase({
      caseId: "pronoun_drift_resolved",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.pronoun_drift_resolved,
      warningOnly: true,
      warningMitigation:
        "Bind pronouns to the intended entity before adding lore entries.",
    }),
    createBooleanStoryEvalCase({
      caseId: "key_variants_triggered",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.key_variants_triggered,
      warningOnly: true,
      warningMitigation:
        "Normalize case, possessives, plurals, and approved fuzzy key variants.",
    }),
    createBooleanStoryEvalCase({
      caseId: "broad_key_false_positive_blocked",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.broad_key_false_positive_blocked,
      failMitigation:
        "Require proximity or secondary keys before broad lore triggers fire.",
    }),
    createBooleanStoryEvalCase({
      caseId: "budget_eviction_preserved_priority",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.budget_eviction_preserved_priority,
      failMitigation:
        "Evict lowest-priority inactive lore before current high-priority context.",
    }),
    createBooleanStoryEvalCase({
      caseId: "snippets_remained_whole",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.snippets_remained_whole,
      failMitigation:
        "Insert lore as whole snippets and avoid sentence-level truncation.",
    }),
    createBooleanStoryEvalCase({
      caseId: "spoiler_lock_suppressed",
      evidenceRef: fixture.evidence_ref,
      passed: fixture.spoiler_lock_suppressed,
      failMitigation:
        "Block spoiler-locked entries even when direct keywords match.",
    }),
  ];

  return createStoryEvalSuite({
    suite_id: fixture.suite_id,
    run_id: input.run_id,
    created_at: input.created_at,
    kind: "lorebook_activation_integrity",
    source_note: input.source_note ?? "Lorebook Optimization Testing - 2026-10-09",
    cases,
  });
}

export function createStoryEvalRunResult(
  input: StoryEvalRunInput,
): StoryEvalRunResult {
  const evaluationWindowGuardrailTraces = (
    input.evaluation_window_guardrail_traces ?? []
  ).map((trace) => EvaluationWindowGuardrailTraceSchema.parse(trace));
  const reasoningIntegritySuites = (
    input.reasoning_integrity_suites ?? []
  ).map((suite) => ReasoningIntegritySuiteSchema.parse(suite));
  const storyEvalSuites = (input.story_eval_suites ?? []).map((suite) =>
    StoryEvalSuiteSchema.parse(suite),
  );
  const blockedRoutes = evaluationWindowGuardrailTraces.filter(
    (trace) => trace.guardrail_trace.toxicity_routing.target_route === "blocked",
  ).length;
  const sandboxRoutes = evaluationWindowGuardrailTraces.filter(
    (trace) => trace.guardrail_trace.toxicity_routing.target_route === "sandbox",
  ).length;
  const failedReasoningChecks = uniqueValues(
    reasoningIntegritySuites.flatMap((suite) => suite.summary.failed_checks),
  );
  const warningReasoningChecks = uniqueValues(
    reasoningIntegritySuites.flatMap((suite) => suite.summary.warning_checks),
  );
  const failedStoryEvalCases = uniqueValues(
    storyEvalSuites.flatMap((suite) => suite.summary.failed_cases),
  );
  const warningStoryEvalCases = uniqueValues(
    storyEvalSuites.flatMap((suite) => suite.summary.warning_cases),
  );
  const contextPruningRecommended = evaluationWindowGuardrailTraces.some(
    (trace) =>
      trace.evaluation_window.narrative_metrics.context_pruning_recommended,
  );
  const collapseWarning = evaluationWindowGuardrailTraces.some(
    (trace) =>
      trace.evaluation_window.behavioral_metrics.message_length
        .collapse_warning,
  );
  const fallbackRequired = evaluationWindowGuardrailTraces.some(
    (trace) => trace.guardrail_trace.fallback_required,
  );
  const reviewLabel =
    blockedRoutes > 0 ||
    failedReasoningChecks.length > 0 ||
    failedStoryEvalCases.length > 0
      ? "Review Before Export"
      : sandboxRoutes > 0 ||
          warningReasoningChecks.length > 0 ||
          warningStoryEvalCases.length > 0 ||
          contextPruningRecommended ||
          collapseWarning
        ? "Needs Your Eye"
        : "Ready to Play";
  const mitigationProposals = uniqueValues([
    ...evaluationWindowGuardrailTraces.flatMap((trace) =>
      trace.review?.mitigation_proposal
        ? [trace.review.mitigation_proposal]
        : [],
    ),
    ...storyEvalSuites.flatMap((suite) =>
      suite.cases.flatMap((testCase) =>
        testCase.mitigation_proposal ? [testCase.mitigation_proposal] : [],
      ),
    ),
  ]);
  const suiteCount =
    evaluationWindowGuardrailTraces.length +
    reasoningIntegritySuites.length +
    storyEvalSuites.length;
  const sampleCount =
    evaluationWindowGuardrailTraces.length +
    reasoningIntegritySuites.length +
    storyEvalSuites.reduce((total, suite) => total + suite.cases.length, 0);

  return StoryEvalRunResultSchema.parse({
    metadata: {
      run_id: input.run_id,
      created_at: input.created_at,
      storybook_id: input.storybook_id,
      privacy_mode: input.privacy_mode ?? "aggregate_only",
    },
    suites: {
      evaluation_window_guardrail_traces: evaluationWindowGuardrailTraces,
      reasoning_integrity_suites: reasoningIntegritySuites,
      story_eval_suites: storyEvalSuites,
    },
    summary: {
      suite_count: suiteCount,
      sample_count: sampleCount,
      fallback_required: fallbackRequired,
      review_label: reviewLabel,
      mitigation_proposals: mitigationProposals,
      blocked_routes: blockedRoutes,
      sandbox_routes: sandboxRoutes,
      failed_reasoning_checks: failedReasoningChecks,
      warning_reasoning_checks: warningReasoningChecks,
      failed_story_eval_cases: failedStoryEvalCases,
      warning_story_eval_cases: warningStoryEvalCases,
      context_pruning_recommended: contextPruningRecommended,
      collapse_warning: collapseWarning,
      trace_visibility:
        reviewLabel === "Ready to Play" ? "hidden" : "author_summary",
    },
  });
}

export function createStoryEvalRun(
  input: StoryEvalRunInput,
): StoryEvalRunResult {
  return createStoryEvalRunResult(input);
}

function createBooleanStoryEvalCase(input: {
  caseId: string;
  evidenceRef: string;
  passed: boolean;
  warningOnly?: boolean;
  failMitigation?: string;
  warningMitigation?: string;
}): StoryEvalCaseInput {
  if (input.passed) {
    return {
      case_id: input.caseId,
      status: "pass",
      evidence_refs: [input.evidenceRef],
    };
  }

  return {
    case_id: input.caseId,
    status: input.warningOnly ? "warning" : "fail",
    review_label: input.warningOnly ? "Needs Your Eye" : "Review Before Export",
    evidence_refs: [input.evidenceRef],
    mitigation_proposal: input.warningOnly
      ? input.warningMitigation
      : input.failMitigation,
  };
}

function createStoryEvalCaseFromFindings(input: {
  caseId: string;
  evidenceRef: string;
  failedChecks: readonly string[];
  warningChecks: readonly string[];
  failedMitigation: string;
  warningMitigation: string;
}): StoryEvalCaseInput {
  if (input.failedChecks.length > 0) {
    return {
      case_id: input.caseId,
      status: "fail",
      review_label: "Review Before Export",
      evidence_refs: [input.evidenceRef],
      mitigation_proposal: input.failedMitigation,
    };
  }

  if (input.warningChecks.length > 0) {
    return {
      case_id: input.caseId,
      status: "warning",
      review_label: "Needs Your Eye",
      evidence_refs: [input.evidenceRef],
      mitigation_proposal: input.warningMitigation,
    };
  }

  return {
    case_id: input.caseId,
    status: "pass",
    evidence_refs: [input.evidenceRef],
  };
}

function uniqueValues<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function subtractValues(
  values: readonly string[],
  valuesToRemove: readonly string[],
): string[] {
  const removalSet = new Set(valuesToRemove);

  return values.filter((value) => !removalSet.has(value));
}

function resolveStoryEvalComparisonStatus(input: {
  failedCasesAdded: readonly string[];
  failedCasesResolved: readonly string[];
  warningCasesAdded: readonly string[];
  warningCasesResolved: readonly string[];
  baseline: StoryEvalRunHistoryEntry;
  candidate: StoryEvalRunHistoryEntry;
}): StoryEvalRunComparison["status"] {
  if (input.failedCasesAdded.length > 0 || input.warningCasesAdded.length > 0) {
    return "regressed";
  }

  if (
    input.failedCasesResolved.length > 0 ||
    input.warningCasesResolved.length > 0
  ) {
    return "improved";
  }

  if (
    input.baseline.review_label !== input.candidate.review_label ||
    input.baseline.suite_count !== input.candidate.suite_count ||
    input.baseline.sample_count !== input.candidate.sample_count ||
    input.baseline.mitigation_proposal_count !==
      input.candidate.mitigation_proposal_count
  ) {
    return "changed";
  }

  return "unchanged";
}

function isStoryEvalRunResult(
  input: StoryEvalRunResult | StoryEvalRunHistoryEntry,
): input is StoryEvalRunResult {
  return "metadata" in input && "summary" in input;
}

export function parseStoryEvalRunHistoryFile(
  input: unknown,
): StoryEvalRunHistoryFile {
  const value = readRecord(input, "StoryEval run history file");

  if (value.version !== 1) {
    throw new Error("StoryEval run history file version must be 1.");
  }

  if (!Array.isArray(value.runs)) {
    throw new Error("StoryEval run history file must include a runs array.");
  }

  return {
    version: 1,
    updated_at: readRequiredString(value.updated_at, "updated_at"),
    runs: value.runs.map(parseStoryEvalRunHistoryEntry),
  };
}

export function parseStoryEvalRunHistoryEntry(
  input: unknown,
): StoryEvalRunHistoryEntry {
  const value = readRecord(input, "StoryEval run history entry");
  const reviewLabel = readRequiredString(value.review_label, "review_label");

  if (!isStoryEvalReviewLabel(reviewLabel)) {
    throw new Error("StoryEval run history review_label is not supported.");
  }

  return {
    run_id: readRequiredString(value.run_id, "run_id"),
    created_at: readRequiredString(value.created_at, "created_at"),
    storybook_id: readOptionalString(value.storybook_id),
    review_label: reviewLabel,
    suite_count: readRequiredNonNegativeInteger(value.suite_count, "suite_count"),
    sample_count: readRequiredNonNegativeInteger(
      value.sample_count,
      "sample_count",
    ),
    failed_story_eval_cases: readOptionalStringArray(
      value.failed_story_eval_cases,
    ) ?? [],
    warning_story_eval_cases: readOptionalStringArray(
      value.warning_story_eval_cases,
    ) ?? [],
    mitigation_proposal_count: readRequiredNonNegativeInteger(
      value.mitigation_proposal_count,
      "mitigation_proposal_count",
    ),
  };
}

function isStoryEvalReviewLabel(
  value: string,
): value is StoryEvalRunHistoryEntry["review_label"] {
  return (
    value === "Ready to Play" ||
    value === "Needs Your Eye" ||
    value === "Review Before Export"
  );
}

function parseStoryEvalFixtureFile(input: unknown): StoryEvalFixtureFile {
  if (!isRecord(input)) {
    throw new Error("StoryEval fixture file must be a JSON object.");
  }

  return {
    run_id: readRequiredString(input.run_id, "run_id"),
    created_at: readRequiredString(input.created_at, "created_at"),
    storybook_id: readOptionalString(input.storybook_id),
    privacy_mode: readPrivacyMode(input.privacy_mode),
    streaming_response_reconstruction: readOptionalFixtureGroup(
      input.streaming_response_reconstruction,
      readStreamingFixture,
    ),
    source_intake_safety: readOptionalFixtureGroup(
      input.source_intake_safety,
      readSourceIntakeFixture,
    ),
    export_serialization_integrity: readOptionalFixtureGroup(
      input.export_serialization_integrity,
      readExportSerializationFixture,
    ),
    lorebook_activation_integrity: readOptionalFixtureGroup(
      input.lorebook_activation_integrity,
      readLorebookActivationFixture,
    ),
  };
}

function parseStoryEvalFixtureLines(
  lines: readonly StoryEvalFixtureLine[],
): StoryEvalFixtureFile {
  const runId = readRequiredString(lines[0]?.["run_id"], "run_id");
  const createdAt = readRequiredString(lines[0]?.["created_at"], "created_at");
  const fixtureFile: StoryEvalFixtureFile = {
    run_id: runId,
    created_at: createdAt,
    storybook_id: readOptionalString(lines[0]?.["storybook_id"]),
    privacy_mode: readPrivacyMode(lines[0]?.["privacy_mode"]),
  };

  for (const line of lines) {
    if (!isRecord(line)) {
      throw new Error("StoryEval fixture JSONL entries must be objects.");
    }

    if (readRequiredString(line.run_id, "run_id") !== runId) {
      throw new Error("StoryEval fixture JSONL entries must share one run_id.");
    }

    if (readRequiredString(line.created_at, "created_at") !== createdAt) {
      throw new Error(
        "StoryEval fixture JSONL entries must share one created_at timestamp.",
      );
    }

    const kind = readRequiredString(line.kind, "kind");
    const sourceNote = readOptionalString(line.source_note);

    if (kind === "streaming_response_reconstruction") {
      const existing = fixtureFile.streaming_response_reconstruction ?? {
        suite_id: "streaming-response-reconstruction",
        source_note: sourceNote,
        fixtures: [],
      };
      fixtureFile.streaming_response_reconstruction = {
        ...existing,
        fixtures: [
          ...existing.fixtures,
          readStreamingFixture(line.fixture),
        ],
      };
      continue;
    }

    if (kind === "source_intake_safety") {
      fixtureFile.source_intake_safety = appendFixture(
        fixtureFile.source_intake_safety,
        readSourceIntakeFixture(line.fixture),
        sourceNote,
      );
      continue;
    }

    if (kind === "export_serialization_integrity") {
      fixtureFile.export_serialization_integrity = appendFixture(
        fixtureFile.export_serialization_integrity,
        readExportSerializationFixture(line.fixture),
        sourceNote,
      );
      continue;
    }

    if (kind === "lorebook_activation_integrity") {
      fixtureFile.lorebook_activation_integrity = appendFixture(
        fixtureFile.lorebook_activation_integrity,
        readLorebookActivationFixture(line.fixture),
        sourceNote,
      );
      continue;
    }

    throw new Error(`Unsupported StoryEval fixture kind: ${kind}`);
  }

  return fixtureFile;
}

function appendFixture<T>(
  group: { source_note?: string; fixtures: readonly T[] } | undefined,
  fixture: T,
  sourceNote?: string,
): { source_note?: string; fixtures: readonly T[] } {
  return {
    source_note: group?.source_note ?? sourceNote,
    fixtures: [...(group?.fixtures ?? []), fixture],
  };
}

function readOptionalFixtureGroup<T>(
  input: unknown,
  readFixture: (input: unknown) => T,
):
  | {
      suite_id: string;
      source_note?: string;
      fixtures: readonly T[];
    }
  | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (!isRecord(input) || !Array.isArray(input.fixtures)) {
    throw new Error("StoryEval fixture groups must include a fixtures array.");
  }

  return {
    suite_id: readOptionalString(input.suite_id) ?? "storyeval-fixtures",
    source_note: readOptionalString(input.source_note),
    fixtures: input.fixtures.map(readFixture),
  };
}

function readStreamingFixture(input: unknown): StreamingReconstructionFixture {
  const value = readRecord(input, "streaming fixture");

  return {
    case_id: readRequiredString(value.case_id, "case_id"),
    evidence_ref: readRequiredString(value.evidence_ref, "evidence_ref"),
    expected_text: readRequiredString(value.expected_text, "expected_text"),
    reconstructed_text: readRequiredString(
      value.reconstructed_text,
      "reconstructed_text",
    ),
    final_buffer_flushed: readOptionalBoolean(value.final_buffer_flushed),
    partial_state_committed: readOptionalBoolean(value.partial_state_committed),
    ui_remained_unlocked: readOptionalBoolean(value.ui_remained_unlocked),
    user_facing_fallback: readOptionalBoolean(value.user_facing_fallback),
    leaked_metadata_keys: readOptionalStringArray(value.leaked_metadata_keys),
  };
}

function readSourceIntakeFixture(input: unknown): SourceIntakeSafetyFixture {
  const value = readRecord(input, "source intake fixture");

  return {
    suite_id: readRequiredString(value.suite_id, "suite_id"),
    evidence_ref: readRequiredString(value.evidence_ref, "evidence_ref"),
    malformed_schema_rejected: readRequiredBoolean(
      value.malformed_schema_rejected,
      "malformed_schema_rejected",
    ),
    structural_controls_stripped: readRequiredBoolean(
      value.structural_controls_stripped,
      "structural_controls_stripped",
    ),
    display_text_escaped: readRequiredBoolean(
      value.display_text_escaped,
      "display_text_escaped",
    ),
    model_prompt_preserved_plain_text: readRequiredBoolean(
      value.model_prompt_preserved_plain_text,
      "model_prompt_preserved_plain_text",
    ),
    raw_source_preserved_separately: readRequiredBoolean(
      value.raw_source_preserved_separately,
      "raw_source_preserved_separately",
    ),
    rendered_fields_reviewed: readRequiredBoolean(
      value.rendered_fields_reviewed,
      "rendered_fields_reviewed",
    ),
  };
}

function readExportSerializationFixture(input: unknown): ExportSerializationFixture {
  const value = readRecord(input, "export serialization fixture");

  return {
    suite_id: readRequiredString(value.suite_id, "suite_id"),
    evidence_ref: readRequiredString(value.evidence_ref, "evidence_ref"),
    json_roundtrip_valid: readRequiredBoolean(
      value.json_roundtrip_valid,
      "json_roundtrip_valid",
    ),
    fixed_clock_used: readRequiredBoolean(
      value.fixed_clock_used,
      "fixed_clock_used",
    ),
    roleplay_syntax_preserved: readRequiredBoolean(
      value.roleplay_syntax_preserved,
      "roleplay_syntax_preserved",
    ),
    unsupported_internal_fields_warned: readRequiredBoolean(
      value.unsupported_internal_fields_warned,
      "unsupported_internal_fields_warned",
    ),
    target_schema_valid: readRequiredBoolean(
      value.target_schema_valid,
      "target_schema_valid",
    ),
    binary_metadata_clean: readOptionalBoolean(value.binary_metadata_clean),
  };
}

function readLorebookActivationFixture(input: unknown): LorebookActivationFixture {
  const value = readRecord(input, "lorebook activation fixture");

  return {
    suite_id: readRequiredString(value.suite_id, "suite_id"),
    evidence_ref: readRequiredString(value.evidence_ref, "evidence_ref"),
    cold_open_core_lore_loaded: readRequiredBoolean(
      value.cold_open_core_lore_loaded,
      "cold_open_core_lore_loaded",
    ),
    pronoun_drift_resolved: readRequiredBoolean(
      value.pronoun_drift_resolved,
      "pronoun_drift_resolved",
    ),
    key_variants_triggered: readRequiredBoolean(
      value.key_variants_triggered,
      "key_variants_triggered",
    ),
    broad_key_false_positive_blocked: readRequiredBoolean(
      value.broad_key_false_positive_blocked,
      "broad_key_false_positive_blocked",
    ),
    budget_eviction_preserved_priority: readRequiredBoolean(
      value.budget_eviction_preserved_priority,
      "budget_eviction_preserved_priority",
    ),
    snippets_remained_whole: readRequiredBoolean(
      value.snippets_remained_whole,
      "snippets_remained_whole",
    ),
    spoiler_lock_suppressed: readRequiredBoolean(
      value.spoiler_lock_suppressed,
      "spoiler_lock_suppressed",
    ),
  };
}

function readRecord(input: unknown, label: string): Record<string, unknown> {
  if (!isRecord(input)) {
    throw new Error(`StoryEval ${label} must be an object.`);
  }

  return input;
}

function readRequiredString(input: unknown, label: string): string {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error(`StoryEval fixture ${label} must be a non-empty string.`);
  }

  return input;
}

function readOptionalString(input: unknown): string | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (typeof input !== "string" || !input.trim()) {
    throw new Error("StoryEval optional string values must be non-empty.");
  }

  return input;
}

function readRequiredBoolean(input: unknown, label: string): boolean {
  if (typeof input !== "boolean") {
    throw new Error(`StoryEval fixture ${label} must be a boolean.`);
  }

  return input;
}

function readRequiredNonNegativeInteger(input: unknown, label: string): number {
  if (!Number.isInteger(input) || Number(input) < 0) {
    throw new Error(
      `StoryEval history ${label} must be a non-negative integer.`,
    );
  }

  return Number(input);
}

function readOptionalBoolean(input: unknown): boolean | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (typeof input !== "boolean") {
    throw new Error("StoryEval optional boolean values must be boolean.");
  }

  return input;
}

function readOptionalStringArray(input: unknown): string[] | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (!Array.isArray(input) || input.some((item) => typeof item !== "string")) {
    throw new Error("StoryEval string arrays must contain only strings.");
  }

  return input;
}

function readPrivacyMode(
  input: unknown,
): StoryEvalFixtureFile["privacy_mode"] {
  if (input === undefined) {
    return undefined;
  }

  if (input === "aggregate_only" || input === "explicitly_saved_source") {
    return input;
  }

  throw new Error("StoryEval privacy_mode is unsupported.");
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
