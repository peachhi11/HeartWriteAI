import assert from "node:assert/strict";
import test from "node:test";

import {
  createContextPruningRecommendation,
  createMessageLengthMetric,
  createFormattingArchetypeDiagnostic,
  createResponseLatencyProfile,
  createResponseSpeedDiagnostic,
  createExportSerializationIntegritySuite,
  createLorebookActivationIntegritySuite,
  createReasoningIntegritySuite,
  createSourceIntakeSafetySuite,
  createStoryEvalRun,
  createStoryEvalRunResult,
  createStoryEvalSuite,
  createStreamingResponseReconstructionSuite,
  detectFormattingArchetype,
  EvaluationWindowGuardrailTraceSchema,
  estimateMessageTokenCount,
  normalizeResponseLatencyScore,
  parseEvaluationWindowGuardrailTrace,
  ReasoningIntegrityCheckSchema,
  ReasoningIntegritySuiteSchema,
  resolveGuardrailRoute,
  StoryEvalCaseSchema,
  StoryEvalRunResultSchema,
  StoryEvalSuiteSchema,
} from "../../lib/character-card/evaluationWindowGuardrailTrace";

const baseTrace = {
  metadata: {
    session_id: "8bdb5b86-2f6c-4a7f-9d0d-a5660366baf8",
    turn_id: 14,
    timestamp: "2026-10-09T03:10:00.000Z",
    storybook_id: "storybook-rose-house",
  },
  evaluation_window: {
    behavioral_metrics: {
      message_length: {
        rolling_average_tokens: 126,
        delta_percentage: -12,
      },
      response_latency_seconds: 18,
      formatting_archetype: "mixed",
    },
    narrative_metrics: {
      semantic_distance_score: 0.34,
      top_trope_distribution: {
        "slow-burn": 0.62,
        "forced-proximity": 0.24,
      },
      persona_congruency_score: 0.91,
    },
  },
  guardrail_trace: {
    consent_boundary_proximity: 0.18,
    user_agency_violation_detected: false,
    toxicity_routing: {
      score: 0.11,
      target_route: "standard",
    },
    platform_route_guardrail_verified: true,
    saved_preference_integrity_verified: true,
    saved_preference_checksum: "sha256:profile-safe-v1",
  },
  review: {
    review_label: "Set in Ink",
    trace_visibility: "hidden",
  },
} as const;

test("accepts a standard aggregate-only evaluation trace", () => {
  const trace = parseEvaluationWindowGuardrailTrace(baseTrace);

  assert.equal(trace.metadata.platform_route, "app_native");
  assert.equal(trace.metadata.privacy_mode, "aggregate_only");
  assert.equal(trace.evaluation_window.baseline_window_turns, 50);
  assert.equal(trace.evaluation_window.current_window_turns, 10);
  assert.equal(
    trace.evaluation_window.behavioral_metrics.message_length.collapse_warning,
    false,
  );
  assert.equal(trace.guardrail_trace.toxicity_routing.target_route, "standard");
});

test("accepts sandbox and blocked routing fixtures", () => {
  const sandbox = EvaluationWindowGuardrailTraceSchema.parse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      consent_boundary_proximity: 0.74,
      toxicity_routing: {
        score: 0.65,
        target_route: "sandbox",
      },
      fallback_required: true,
    },
    review: {
      review_label: "Needs Your Eye",
      mitigation_proposal: "Route this turn through sandbox review.",
      trace_visibility: "author_summary",
    },
  });

  const blocked = EvaluationWindowGuardrailTraceSchema.parse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      consent_boundary_proximity: 1,
      toxicity_routing: {
        score: 1,
        target_route: "blocked",
      },
      fallback_required: true,
    },
    review: {
      review_label: "Review Before Export",
      mitigation_proposal: "Use a plain-language fallback.",
      trace_visibility: "author_summary",
    },
  });

  assert.equal(sandbox.guardrail_trace.toxicity_routing.target_route, "sandbox");
  assert.equal(blocked.guardrail_trace.toxicity_routing.target_route, "blocked");
});

test("rejects out-of-range scores and unsupported routes", () => {
  const badScore = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      toxicity_routing: {
        score: 1.2,
        target_route: "standard",
      },
    },
  });
  const badRoute = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      toxicity_routing: {
        score: 0.4,
        target_route: "bypass",
      },
    },
  });

  assert.equal(badScore.success, false);
  assert.equal(badRoute.success, false);
});

test("rejects impossible response latency values in trace payloads", () => {
  const result = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    evaluation_window: {
      ...baseTrace.evaluation_window,
      behavioral_metrics: {
        ...baseTrace.evaluation_window.behavioral_metrics,
        response_latency_seconds: 1001,
      },
    },
  });

  assert.equal(result.success, false);
});

test("requires an agency breach to name the breach type", () => {
  const missingFlag = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      user_agency_violation_detected: true,
    },
  });
  const namedFlag = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      user_agency_violation_detected: true,
      agency_violation_flags: {
        forced_dialogue: true,
      },
    },
  });

  assert.equal(missingFlag.success, false);
  assert.equal(namedFlag.success, true);
});

test("rejects raw chat logs and non-contract debug fields", () => {
  const rawLog = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    raw_chat_log: [
      {
        role: "user",
        content: "This should never be stored in the aggregate trace.",
      },
    ],
  });
  const nestedRawLog = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    evaluation_window: {
      ...baseTrace.evaluation_window,
      recent_messages: ["private chat text"],
    },
  });

  assert.equal(rawLog.success, false);
  assert.equal(nestedRawLog.success, false);
});

test("keeps debug visibility out of aggregate-only traces", () => {
  const result = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    review: {
      review_label: "Needs Your Eye",
      trace_visibility: "debug_local_only",
    },
  });

  assert.equal(result.success, false);
});

test("allows debug visibility only when the source was explicitly saved", () => {
  const result = EvaluationWindowGuardrailTraceSchema.safeParse({
    ...baseTrace,
    metadata: {
      ...baseTrace.metadata,
      privacy_mode: "explicitly_saved_source",
    },
    review: {
      review_label: "Needs Your Eye",
      trace_visibility: "debug_local_only",
    },
  });

  assert.equal(result.success, true);
});

test("resolves standard guardrail route when scores and integrity checks are clean", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0.12,
    toxicityScore: 0.08,
    userAgencyViolationDetected: false,
    platformRouteGuardrailVerified: true,
    savedPreferenceIntegrityVerified: true,
  });

  assert.equal(route.target_route, "standard");
  assert.equal(route.fallback_required, false);
  assert.equal(route.review_label, "Set in Ink");
  assert.deepEqual(route.reason_codes, []);
  assert.equal(route.mitigation_proposal, undefined);
});

test("resolves sandbox route for elevated but non-blocking guardrail scores", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0.58,
    toxicityScore: 0.2,
    userAgencyViolationDetected: false,
    platformRouteGuardrailVerified: true,
    savedPreferenceIntegrityVerified: true,
  });

  assert.equal(route.target_route, "sandbox");
  assert.equal(route.fallback_required, true);
  assert.equal(route.review_label, "Needs Your Eye");
  assert.deepEqual(route.reason_codes, ["consent_boundary_sandbox_threshold"]);
  assert.equal(
    route.mitigation_proposal,
    "Route this turn through sandbox review before generation.",
  );
});

test("resolves blocked route for hard guardrail failures", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0.2,
    toxicityScore: 0.91,
    userAgencyViolationDetected: true,
    platformRouteGuardrailVerified: true,
    savedPreferenceIntegrityVerified: true,
  });

  assert.equal(route.target_route, "blocked");
  assert.equal(route.fallback_required, true);
  assert.equal(route.review_label, "Review Before Export");
  assert.deepEqual(route.reason_codes, [
    "user_agency_violation",
    "toxicity_block_threshold",
  ]);
  assert.equal(
    route.mitigation_proposal,
    "Stop generation and use a plain-language fallback.",
  );
});

test("blocks guardrail routing when platform or saved preferences are unverified", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0,
    toxicityScore: 0,
    userAgencyViolationDetected: false,
    platformRouteGuardrailVerified: false,
    savedPreferenceIntegrityVerified: false,
  });

  assert.equal(route.target_route, "blocked");
  assert.deepEqual(route.reason_codes, [
    "platform_route_unverified",
    "saved_preference_integrity_failed",
  ]);
});

test("supports custom guardrail route thresholds", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0.4,
    toxicityScore: 0.3,
    userAgencyViolationDetected: false,
    platformRouteGuardrailVerified: true,
    savedPreferenceIntegrityVerified: true,
    sandboxThreshold: 0.3,
    blockThreshold: 0.6,
  });

  assert.equal(route.target_route, "sandbox");
  assert.deepEqual(route.reason_codes, [
    "toxicity_sandbox_threshold",
    "consent_boundary_sandbox_threshold",
  ]);
});

test("rejects invalid guardrail route inputs", () => {
  assert.throws(() =>
    resolveGuardrailRoute({
      consentBoundaryProximity: -0.1,
      toxicityScore: 0,
      userAgencyViolationDetected: false,
      platformRouteGuardrailVerified: true,
      savedPreferenceIntegrityVerified: true,
    }),
  );
  assert.throws(() =>
    resolveGuardrailRoute({
      consentBoundaryProximity: 0,
      toxicityScore: 1.1,
      userAgencyViolationDetected: false,
      platformRouteGuardrailVerified: true,
      savedPreferenceIntegrityVerified: true,
    }),
  );
  assert.throws(() =>
    resolveGuardrailRoute({
      consentBoundaryProximity: 0,
      toxicityScore: 0,
      userAgencyViolationDetected: false,
      platformRouteGuardrailVerified: true,
      savedPreferenceIntegrityVerified: true,
      sandboxThreshold: 0.8,
      blockThreshold: 0.8,
    }),
  );
});

test("uses resolved guardrail routing inside evaluation traces", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0.62,
    toxicityScore: 0.61,
    userAgencyViolationDetected: false,
    platformRouteGuardrailVerified: true,
    savedPreferenceIntegrityVerified: true,
  });
  const trace = EvaluationWindowGuardrailTraceSchema.parse({
    ...baseTrace,
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      consent_boundary_proximity: 0.62,
      toxicity_routing: {
        score: 0.61,
        target_route: route.target_route,
      },
      fallback_required: route.fallback_required,
    },
    review: {
      review_label: route.review_label,
      mitigation_proposal: route.mitigation_proposal,
      trace_visibility: "author_summary",
    },
  });

  assert.equal(trace.guardrail_trace.toxicity_routing.target_route, "sandbox");
  assert.equal(trace.guardrail_trace.fallback_required, true);
  assert.equal(trace.review?.review_label, "Needs Your Eye");
});

test("creates a raw response speed diagnostic without normalized scoring", () => {
  const diagnostic = createResponseSpeedDiagnostic([
    2.1, 2.5, 3.2, 2.9, 4.2, 2.3, 2.4,
  ]);

  assert.equal(diagnostic.name, "response_speed");
  assert.equal(diagnostic.score, 2.8);
  assert.equal(diagnostic.normalized_score, null);
  assert.equal(diagnostic.details.mean_speed_seconds, 2.8);
  assert.equal(diagnostic.details.max_speed_seconds, 4.2);
  assert.equal(diagnostic.details.num_turns, 7);
  assert.deepEqual(diagnostic.details.per_turn_speeds, [
    2.1, 2.5, 3.2, 2.9, 4.2, 2.3, 2.4,
  ]);
});

test("filters invalid response speed values before aggregation", () => {
  const diagnostic = createResponseSpeedDiagnostic([
    1.5,
    -0.2,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    1001,
    2.5,
  ]);

  assert.equal(diagnostic.score, 2);
  assert.equal(diagnostic.details.mean_speed_seconds, 2);
  assert.equal(diagnostic.details.max_speed_seconds, 2.5);
  assert.equal(diagnostic.details.num_turns, 2);
  assert.equal(diagnostic.details.invalid_turns_filtered, 4);
  assert.deepEqual(diagnostic.details.per_turn_speeds, [1.5, 2.5]);
});

test("returns null response speed values when no valid turns exist", () => {
  const diagnostic = createResponseSpeedDiagnostic([-1, Number.NaN, 1001]);

  assert.equal(diagnostic.score, null);
  assert.equal(diagnostic.normalized_score, null);
  assert.equal(diagnostic.details.mean_speed_seconds, null);
  assert.equal(diagnostic.details.max_speed_seconds, null);
  assert.equal(diagnostic.details.num_turns, 0);
  assert.equal(diagnostic.details.invalid_turns_filtered, 3);
  assert.deepEqual(diagnostic.details.per_turn_speeds, []);
});

test("normalizes response latency with median decay and timeout cutoff", () => {
  assert.equal(normalizeResponseLatencyScore({ latencySeconds: 0 }), 1);
  assert.equal(normalizeResponseLatencyScore({ latencySeconds: 2.5 }), 0.5);
  assert.equal(normalizeResponseLatencyScore({ latencySeconds: 12 }), 0);
});

test("creates a response latency profile with drift and tier labels", () => {
  const profile = createResponseLatencyProfile({
    latencySeconds: 4.2,
    historicalLatencySeconds: [2.1, 2.5, 3.2, 2.9],
  });

  assert.equal(profile.raw_latency_seconds, 4.2);
  assert.equal(profile.normalized_score, 0.1414);
  assert.equal(profile.historical_average_seconds, 2.675);
  assert.equal(profile.drift_delta_seconds, 1.525);
  assert.equal(profile.performance_tier, "degraded");
  assert.equal(profile.system_warmup_indicated, false);
});

test("marks cold-start latency when no response latency history exists", () => {
  const profile = createResponseLatencyProfile({
    latencySeconds: 4,
    historicalLatencySeconds: [],
  });

  assert.equal(profile.historical_average_seconds, 4);
  assert.equal(profile.drift_delta_seconds, 0);
  assert.equal(profile.performance_tier, "degraded");
  assert.equal(profile.system_warmup_indicated, true);
});

test("classifies normalized response latency performance tiers", () => {
  assert.equal(
    createResponseLatencyProfile({ latencySeconds: 1 }).performance_tier,
    "optimal",
  );
  assert.equal(
    createResponseLatencyProfile({ latencySeconds: 2.5 }).performance_tier,
    "acceptable",
  );
  assert.equal(
    createResponseLatencyProfile({ latencySeconds: 6 }).performance_tier,
    "degraded",
  );
  assert.equal(
    createResponseLatencyProfile({ latencySeconds: 12 }).performance_tier,
    "timeout_threshold_breached",
  );
});

test("rejects invalid response latency normalization inputs", () => {
  assert.throws(() =>
    normalizeResponseLatencyScore({
      latencySeconds: 1,
      targetMedianSeconds: 0,
    }),
  );
  assert.throws(() =>
    normalizeResponseLatencyScore({
      latencySeconds: 1,
      targetMedianSeconds: 3,
      maxAcceptableSeconds: 2,
    }),
  );
  assert.throws(() =>
    createResponseLatencyProfile({
      latencySeconds: -1,
    }),
  );
  assert.throws(() =>
    createResponseLatencyProfile({
      latencySeconds: 1,
      historicalLatencySeconds: [1, Number.NaN],
    }),
  );
});

test("detects formatting archetypes from asterisk action blocks", () => {
  assert.equal(
    detectFormattingArchetype("*She reaches for the letter.*"),
    "asterisks",
  );
});

test("detects formatting archetypes from ascii and curly quote blocks", () => {
  assert.equal(detectFormattingArchetype('"Stay," he said.'), "quotes");
  assert.equal(detectFormattingArchetype("\u201cStay,\u201d he said."), "quotes");
  assert.equal(detectFormattingArchetype("\u2018Stay,\u2019 he said."), "quotes");
});

test("detects mixed formatting when action and dialogue markers both appear", () => {
  assert.equal(
    detectFormattingArchetype('*She pauses.* "Tell me the truth."'),
    "mixed",
  );
});

test("keeps empty text plain and ignores unmatched syntax markers", () => {
  assert.equal(detectFormattingArchetype(""), "plain_text");
  assert.equal(detectFormattingArchetype("   "), "plain_text");
  assert.equal(detectFormattingArchetype("*unfinished action"), "plain_text");
  assert.equal(detectFormattingArchetype('"unfinished dialogue'), "plain_text");
});

test("creates formatting archetype diagnostics with syntax telemetry", () => {
  const diagnostic = createFormattingArchetypeDiagnostic(
    '*She touches the locket.* "You kept it?"',
  );

  assert.equal(diagnostic.resolved_archetype, "mixed");
  assert.equal(diagnostic.raw_syntax_telemetry.asterisk_block_matches, 1);
  assert.equal(diagnostic.raw_syntax_telemetry.quote_block_matches, 1);
  assert.equal(
    diagnostic.raw_syntax_telemetry.total_string_length,
    '*She touches the locket.* "You kept it?"'.length,
  );
  assert.equal(diagnostic.archetype_drift_risk, false);
});

test("marks long plain text formatting diagnostics as drift risk", () => {
  const diagnostic = createFormattingArchetypeDiagnostic(
    "This paragraph stays entirely plain while growing long enough to suggest the user has dropped the prior roleplay markers for this session.",
  );

  assert.equal(diagnostic.resolved_archetype, "plain_text");
  assert.equal(diagnostic.raw_syntax_telemetry.asterisk_block_matches, 0);
  assert.equal(diagnostic.raw_syntax_telemetry.quote_block_matches, 0);
  assert.equal(diagnostic.archetype_drift_risk, true);
});

test("recommends context pruning when token pressure crosses threshold", () => {
  const recommendation = createContextPruningRecommendation({
    systemPromptTokens: 1200,
    lorebookTokens: 1800,
    chatHistoryTokenCounts: [1000, 1200, 1400],
    maxContextTokens: 8192,
  });

  assert.equal(recommendation.total_active_tokens, 6600);
  assert.equal(recommendation.current_utilization_percentage, 80.57);
  assert.equal(recommendation.context_pruning_recommended, true);
  assert.equal(
    recommendation.allocation_telemetry.headroom_tokens_remaining,
    1592,
  );
  assert.equal(recommendation.recommended_action, "compress_historical_turns");
});

test("maintains current context window below pruning threshold", () => {
  const recommendation = createContextPruningRecommendation({
    systemPromptTokens: 900,
    lorebookTokens: 700,
    chatHistoryTokenCounts: [1000, 900],
    maxContextTokens: 8192,
  });

  assert.equal(recommendation.total_active_tokens, 3500);
  assert.equal(recommendation.current_utilization_percentage, 42.72);
  assert.equal(recommendation.context_pruning_recommended, false);
  assert.equal(
    recommendation.recommended_action,
    "maintain_current_window",
  );
});

test("handles empty context chat history and over-cap headroom", () => {
  const emptyHistory = createContextPruningRecommendation({
    systemPromptTokens: 100,
    lorebookTokens: 50,
  });
  const overCap = createContextPruningRecommendation({
    systemPromptTokens: 5000,
    lorebookTokens: 4000,
    chatHistoryTokenCounts: [1000],
    maxContextTokens: 8192,
  });

  assert.equal(emptyHistory.allocation_telemetry.active_chat_tokens, 0);
  assert.equal(emptyHistory.context_pruning_recommended, false);
  assert.equal(overCap.total_active_tokens, 10000);
  assert.equal(overCap.current_utilization_percentage, 122.07);
  assert.equal(overCap.allocation_telemetry.headroom_tokens_remaining, 0);
  assert.equal(overCap.context_pruning_recommended, true);
});

test("supports custom context pruning thresholds", () => {
  const recommendation = createContextPruningRecommendation({
    systemPromptTokens: 1000,
    lorebookTokens: 500,
    chatHistoryTokenCounts: [500],
    maxContextTokens: 4000,
    pruningThresholdPercentage: 50,
  });

  assert.equal(recommendation.total_active_tokens, 2000);
  assert.equal(recommendation.context_pruning_recommended, true);
});

test("rejects invalid context pruning inputs", () => {
  assert.throws(() =>
    createContextPruningRecommendation({
      systemPromptTokens: -1,
      lorebookTokens: 0,
    }),
  );
  assert.throws(() =>
    createContextPruningRecommendation({
      systemPromptTokens: 1.5,
      lorebookTokens: 0,
    }),
  );
  assert.throws(() =>
    createContextPruningRecommendation({
      systemPromptTokens: 1,
      lorebookTokens: 0,
      chatHistoryTokenCounts: [1, Number.NaN],
    }),
  );
  assert.throws(() =>
    createContextPruningRecommendation({
      systemPromptTokens: 1,
      lorebookTokens: 0,
      maxContextTokens: 0,
    }),
  );
});

test("estimates message token counts with whitespace splitting", () => {
  assert.equal(estimateMessageTokenCount(""), 0);
  assert.equal(estimateMessageTokenCount("   "), 0);
  assert.equal(estimateMessageTokenCount("one two\nthree"), 3);
});

test("creates message length metrics without polluting baseline with current turn", () => {
  const metric = createMessageLengthMetric({
    currentTokenCount: 30,
    historicalTokenCounts: [140, 150, 160, 145, 155],
    windowSizeTurns: 5,
  });

  assert.equal(metric.rolling_average_tokens, 150);
  assert.equal(metric.delta_percentage, 80);
  assert.equal(metric.collapse_warning, true);
});

test("keeps message length collapse warning quiet while baseline is warming up", () => {
  const metric = createMessageLengthMetric({
    currentTokenCount: 12,
    historicalTokenCounts: [160, 155],
    windowSizeTurns: 5,
  });

  assert.equal(metric.rolling_average_tokens, 12);
  assert.equal(metric.delta_percentage, 0);
  assert.equal(metric.collapse_warning, false);
});

test("uses the configured message length window and allows growth deltas", () => {
  const metric = createMessageLengthMetric({
    currentTokenCount: 200,
    historicalTokenCounts: [20, 40, 100, 110, 90],
    windowSizeTurns: 3,
  });

  assert.equal(metric.rolling_average_tokens, 100);
  assert.equal(metric.delta_percentage, -100);
  assert.equal(metric.collapse_warning, false);
});

test("handles zero message length baselines without divide-by-zero warnings", () => {
  const metric = createMessageLengthMetric({
    currentTokenCount: 0,
    historicalTokenCounts: [0, 0, 0, 0],
  });

  assert.equal(metric.rolling_average_tokens, 0);
  assert.equal(metric.delta_percentage, 0);
  assert.equal(metric.collapse_warning, false);
});

test("rejects invalid message length metric inputs", () => {
  assert.throws(() =>
    createMessageLengthMetric({
      currentTokenCount: -1,
      historicalTokenCounts: [10, 20, 30],
    }),
  );
  assert.throws(() =>
    createMessageLengthMetric({
      currentTokenCount: 10,
      historicalTokenCounts: [10, Number.NaN, 30],
    }),
  );
});

test("creates a reasoning integrity suite from HeartWrite-specific checks", () => {
  const suite = createReasoningIntegritySuite({
    suite_id: "reasoning-integrity-smoke",
    run_id: "run-2026-10-09",
    created_at: "2026-10-09T04:10:00.000Z",
    checks: [
      {
        key: "continuity_reasoning",
        score: 1,
        status: "pass",
        evidence_refs: ["fixture:continuity-clean"],
      },
      {
        key: "state_transition_reasoning",
        score: 0.91,
        status: "pass",
        evidence_refs: ["fixture:branch-convergence"],
      },
      {
        key: "constraint_reasoning",
        score: 0.82,
        status: "warning",
        evidence_refs: ["fixture:world-passivity"],
        violations: [
          {
            code: "constraint_breach",
            message: "World lore tried to advance time without a trigger.",
            affected_books: ["world_book", "scenario_book"],
          },
        ],
      },
      {
        key: "source_to_field_reasoning",
        score: 0.97,
        status: "pass",
        evidence_refs: ["fixture:brain-dump-sort"],
      },
      {
        key: "agency_reasoning",
        score: 0.94,
        status: "pass",
        evidence_refs: ["fixture:scene-starter-agency"],
      },
    ],
  });

  assert.equal(suite.category, "reasoning_integrity");
  assert.equal(suite.metadata.source_benchmark_family, "reasoning-benchmarks-adapted");
  assert.equal(suite.summary.failed_checks.length, 0);
  assert.deepEqual(suite.summary.warning_checks, ["constraint_reasoning"]);
  assert.equal(suite.summary.review_label, "Needs Your Eye");
});

test("rejects generic leaderboard-style reasoning keys", () => {
  const result = ReasoningIntegrityCheckSchema.safeParse({
    key: "math_reasoning",
    score: 1,
    status: "pass",
  });

  assert.equal(result.success, false);
});

test("requires warning and fail reasoning checks to name violations", () => {
  const warningWithoutViolation = ReasoningIntegrityCheckSchema.safeParse({
    key: "agency_reasoning",
    score: 0.7,
    status: "warning",
  });
  const failedWithViolation = ReasoningIntegrityCheckSchema.safeParse({
    key: "agency_reasoning",
    score: 0.2,
    status: "fail",
    violations: [
      {
        code: "user_agency_assignment",
        message: "Generated opening assigned {{user}} dialogue.",
        affected_books: ["scenario_book", "prompt_book"],
      },
    ],
  });

  assert.equal(warningWithoutViolation.success, false);
  assert.equal(failedWithViolation.success, true);
});

test("rejects duplicate reasoning integrity checks in one suite", () => {
  const result = ReasoningIntegritySuiteSchema.safeParse({
    category: "reasoning_integrity",
    metadata: {
      suite_id: "duplicate-checks",
      created_at: "2026-10-09T04:10:00.000Z",
    },
    checks: [
      {
        key: "continuity_reasoning",
        score: 1,
        status: "pass",
      },
      {
        key: "continuity_reasoning",
        score: 0.8,
        status: "pass",
      },
    ],
    summary: {
      overall_score: 0.9,
      failed_checks: [],
      warning_checks: [],
      review_label: "Ready to Play",
    },
  });

  assert.equal(result.success, false);
});

test("keeps raw private text out of reasoning integrity suites", () => {
  const result = ReasoningIntegritySuiteSchema.safeParse({
    category: "reasoning_integrity",
    metadata: {
      suite_id: "raw-text-rejection",
      created_at: "2026-10-09T04:10:00.000Z",
    },
    checks: [
      {
        key: "source_to_field_reasoning",
        score: 1,
        status: "pass",
        raw_fixture_text: "Full pasted scene text should stay in fixture storage.",
      },
    ],
    summary: {
      overall_score: 1,
      failed_checks: [],
      warning_checks: [],
      review_label: "Ready to Play",
    },
  });

  assert.equal(result.success, false);
});

test("creates deterministic story eval suites for streaming, source intake, and export", () => {
  const streamingSuite = createStoryEvalSuite({
    suite_id: "streaming-response-reconstruction",
    run_id: "run-storyeval-spine",
    created_at: "2026-10-10T05:00:00.000Z",
    kind: "streaming_response_reconstruction",
    source_note: "Streaming Response Reconstruction Validation - 2026-10-09",
    cases: [
      {
        case_id: "token_stitching",
        status: "pass",
        evidence_refs: ["fixture:streaming/token-stitching"],
      },
      {
        case_id: "raw_preserved_display_repaired",
        status: "warning",
        review_label: "Needs Your Eye",
        evidence_refs: ["fixture:streaming/raw-display-separation"],
        mitigation_proposal:
          "Keep raw stream buffers separate from display-repaired text.",
      },
    ],
  });
  const sourceIntakeSuite = createStoryEvalSuite({
    suite_id: "source-intake-safety",
    run_id: "run-storyeval-spine",
    created_at: "2026-10-10T05:00:00.000Z",
    kind: "source_intake_safety",
    source_note: "Lorebook Source Intake Export Eval Suites - 2026-10-10",
    cases: [
      {
        case_id: "malformed_card_rejected",
        status: "pass",
        evidence_refs: ["fixture:source-intake/malformed-card"],
      },
      {
        case_id: "model_prompt_not_entity_encoded",
        status: "fail",
        review_label: "Review Before Export",
        evidence_refs: ["fixture:source-intake/entity-encoding"],
        mitigation_proposal:
          "Separate display-safe text from compiled model prompt text.",
      },
    ],
  });
  const exportSuite = createStoryEvalSuite({
    suite_id: "export-serialization-integrity",
    run_id: "run-storyeval-spine",
    created_at: "2026-10-10T05:00:00.000Z",
    kind: "export_serialization_integrity",
    source_note: "Export Slot Format Validation - 2026-10-09",
    cases: [
      {
        case_id: "fixed_clock_export_date",
        status: "pass",
        evidence_refs: ["fixture:export/fixed-clock"],
      },
      {
        case_id: "json_roundtrip_preserves_roleplay_syntax",
        status: "pass",
        evidence_refs: ["fixture:export/roleplay-syntax"],
      },
    ],
  });

  assert.equal(streamingSuite.category, "deterministic_story_eval");
  assert.equal(streamingSuite.summary.case_count, 2);
  assert.deepEqual(streamingSuite.summary.warning_cases, [
    "raw_preserved_display_repaired",
  ]);
  assert.equal(sourceIntakeSuite.summary.review_label, "Review Before Export");
  assert.deepEqual(sourceIntakeSuite.summary.failed_cases, [
    "model_prompt_not_entity_encoded",
  ]);
  assert.equal(exportSuite.summary.review_label, "Ready to Play");
});

test("rejects story eval warning or fail cases without evidence", () => {
  const warningWithoutEvidence = StoryEvalCaseSchema.safeParse({
    case_id: "raw_preserved_display_repaired",
    status: "warning",
  });
  const failedWithEvidence = StoryEvalCaseSchema.safeParse({
    case_id: "model_prompt_not_entity_encoded",
    status: "fail",
    evidence_refs: ["fixture:source-intake/entity-encoding"],
  });

  assert.equal(warningWithoutEvidence.success, false);
  assert.equal(failedWithEvidence.success, true);
});

test("rejects duplicate story eval cases and raw fixture text fields", () => {
  const duplicateCases = StoryEvalSuiteSchema.safeParse({
    category: "deterministic_story_eval",
    kind: "source_intake_safety",
    metadata: {
      suite_id: "duplicate-source-intake-cases",
      created_at: "2026-10-10T05:00:00.000Z",
    },
    cases: [
      {
        case_id: "malformed_card_rejected",
        status: "pass",
      },
      {
        case_id: "malformed_card_rejected",
        status: "pass",
      },
    ],
    summary: {
      case_count: 2,
      failed_cases: [],
      warning_cases: [],
      review_label: "Ready to Play",
    },
  });
  const rawFixtureText = StoryEvalCaseSchema.safeParse({
    case_id: "raw_source_preserved_separately",
    status: "pass",
    evidence_refs: ["fixture:source-intake/raw-preservation"],
    raw_fixture_text: "Full imported character card text should live elsewhere.",
  });

  assert.equal(duplicateCases.success, false);
  assert.equal(rawFixtureText.success, false);
});

test("scores streaming reconstruction fixtures without exposing raw text", () => {
  const suite = createStreamingResponseReconstructionSuite({
    suite_id: "streaming-response-reconstruction",
    run_id: "run-streaming-fixtures",
    created_at: "2026-10-10T05:20:00.000Z",
    fixtures: [
      {
        case_id: "token_stitching",
        evidence_ref: "fixture:streaming/token-stitching",
        expected_text: "Evaluating softly.\n",
        reconstructed_text: "Evaluating softly.\n",
        final_buffer_flushed: true,
        partial_state_committed: true,
        ui_remained_unlocked: true,
        leaked_metadata_keys: [],
      },
      {
        case_id: "metadata_stripped",
        evidence_ref: "fixture:streaming/provider-metadata",
        expected_text: "She stays at the threshold.",
        reconstructed_text: "She stays at the threshold.",
        leaked_metadata_keys: ["x-provider-latency"],
      },
      {
        case_id: "partial_state_committed",
        evidence_ref: "fixture:streaming/disconnect-recovery",
        expected_text: "The sentence stops midstream",
        reconstructed_text: "The sentence stops midstream",
        partial_state_committed: false,
        ui_remained_unlocked: true,
      },
    ],
  });

  assert.equal(suite.kind, "streaming_response_reconstruction");
  assert.deepEqual(suite.summary.failed_cases, ["metadata_stripped"]);
  assert.deepEqual(suite.summary.warning_cases, ["partial_state_committed"]);
  assert.equal(suite.summary.review_label, "Review Before Export");
  assert.equal(
    "expected_text" in suite.cases[0],
    false,
  );
});

test("scores source intake safety fixtures with display and prompt separation", () => {
  const suite = createSourceIntakeSafetySuite({
    run_id: "run-source-intake-fixtures",
    created_at: "2026-10-10T05:22:00.000Z",
    fixture: {
      suite_id: "source-intake-safety",
      evidence_ref: "fixture:source-intake/imported-card",
      malformed_schema_rejected: true,
      structural_controls_stripped: true,
      display_text_escaped: true,
      model_prompt_preserved_plain_text: false,
      raw_source_preserved_separately: true,
      rendered_fields_reviewed: false,
    },
  });

  assert.equal(suite.kind, "source_intake_safety");
  assert.deepEqual(suite.summary.failed_cases, [
    "model_prompt_preserved_plain_text",
  ]);
  assert.deepEqual(suite.summary.warning_cases, ["rendered_fields_reviewed"]);
  assert.equal(
    suite.cases.find((testCase) => testCase.case_id === "display_text_escaped")
      ?.status,
    "pass",
  );
});

test("scores export serialization fixtures for platform readiness", () => {
  const suite = createExportSerializationIntegritySuite({
    run_id: "run-export-fixtures",
    created_at: "2026-10-10T05:24:00.000Z",
    fixture: {
      suite_id: "export-serialization-integrity",
      evidence_ref: "fixture:export/character-card-v2",
      json_roundtrip_valid: true,
      fixed_clock_used: true,
      roleplay_syntax_preserved: true,
      unsupported_internal_fields_warned: false,
      target_schema_valid: true,
      binary_metadata_clean: true,
    },
  });

  assert.equal(suite.kind, "export_serialization_integrity");
  assert.deepEqual(suite.summary.failed_cases, []);
  assert.deepEqual(suite.summary.warning_cases, [
    "unsupported_internal_fields_warned",
  ]);
  assert.equal(suite.summary.review_label, "Needs Your Eye");
});

test("scores lorebook activation fixtures for trigger and spoiler safety", () => {
  const suite = createLorebookActivationIntegritySuite({
    run_id: "run-lorebook-fixtures",
    created_at: "2026-10-10T05:26:00.000Z",
    fixture: {
      suite_id: "lorebook-activation-integrity",
      evidence_ref: "fixture:lorebook/activation-matrix",
      cold_open_core_lore_loaded: true,
      pronoun_drift_resolved: true,
      key_variants_triggered: true,
      broad_key_false_positive_blocked: true,
      budget_eviction_preserved_priority: false,
      snippets_remained_whole: true,
      spoiler_lock_suppressed: false,
    },
  });

  assert.equal(suite.kind, "lorebook_activation_integrity");
  assert.deepEqual(suite.summary.failed_cases, [
    "budget_eviction_preserved_priority",
    "spoiler_lock_suppressed",
  ]);
  assert.equal(suite.summary.review_label, "Review Before Export");
});

test("creates a story eval run result from trace and reasoning suites", () => {
  const route = resolveGuardrailRoute({
    consentBoundaryProximity: 0.62,
    toxicityScore: 0.61,
    userAgencyViolationDetected: false,
    platformRouteGuardrailVerified: true,
    savedPreferenceIntegrityVerified: true,
  });
  const trace = EvaluationWindowGuardrailTraceSchema.parse({
    ...baseTrace,
    evaluation_window: {
      ...baseTrace.evaluation_window,
      behavioral_metrics: {
        ...baseTrace.evaluation_window.behavioral_metrics,
        message_length: {
          rolling_average_tokens: 120,
          delta_percentage: 80,
          collapse_warning: true,
        },
      },
      narrative_metrics: {
        ...baseTrace.evaluation_window.narrative_metrics,
        context_pruning_recommended: true,
      },
    },
    guardrail_trace: {
      ...baseTrace.guardrail_trace,
      consent_boundary_proximity: 0.62,
      toxicity_routing: {
        score: 0.61,
        target_route: route.target_route,
      },
      fallback_required: route.fallback_required,
    },
    review: {
      review_label: route.review_label,
      mitigation_proposal: route.mitigation_proposal,
      trace_visibility: "author_summary",
    },
  });
  const reasoningSuite = createReasoningIntegritySuite({
    suite_id: "storybook-run-reasoning",
    run_id: "run-rose-house",
    created_at: "2026-10-09T04:10:00.000Z",
    checks: [
      {
        key: "continuity_reasoning",
        score: 0.95,
        status: "pass",
      },
      {
        key: "agency_reasoning",
        score: 0.72,
        status: "warning",
        violations: [
          {
            code: "user_agency_assignment",
            message: "Opening risked assigning a player reaction.",
            affected_books: ["scenario_book", "prompt_book"],
          },
        ],
      },
    ],
  });
  const result = createStoryEvalRunResult({
    run_id: "run-rose-house",
    created_at: "2026-10-09T04:15:00.000Z",
    storybook_id: "storybook-rose-house",
    evaluation_window_guardrail_traces: [trace],
    reasoning_integrity_suites: [reasoningSuite],
  });

  assert.equal(result.metadata.privacy_mode, "aggregate_only");
  assert.equal(result.summary.suite_count, 2);
  assert.equal(result.summary.sample_count, 2);
  assert.equal(result.summary.review_label, "Needs Your Eye");
  assert.equal(result.summary.fallback_required, true);
  assert.equal(result.summary.sandbox_routes, 1);
  assert.equal(result.summary.blocked_routes, 0);
  assert.equal(result.summary.context_pruning_recommended, true);
  assert.equal(result.summary.collapse_warning, true);
  assert.deepEqual(result.summary.warning_reasoning_checks, [
    "agency_reasoning",
  ]);
  assert.deepEqual(result.summary.mitigation_proposals, [
    "Route this turn through sandbox review before generation.",
  ]);
  assert.equal(result.summary.trace_visibility, "author_summary");
});

test("creates a story eval run from deterministic suites while keeping evidence scoped", () => {
  const streamingSuite = createStoryEvalSuite({
    suite_id: "streaming-response-reconstruction",
    run_id: "run-deterministic-suite-spine",
    created_at: "2026-10-10T05:10:00.000Z",
    kind: "streaming_response_reconstruction",
    cases: [
      {
        case_id: "token_stitching",
        status: "pass",
        evidence_refs: ["fixture:streaming/token-stitching"],
      },
      {
        case_id: "bottom_lock_when_previously_pinned",
        status: "warning",
        review_label: "Needs Your Eye",
        evidence_refs: ["fixture:streaming/bottom-lock"],
        mitigation_proposal:
          "Track whether the user was pinned before the stream chunk rendered.",
      },
    ],
  });
  const sourceIntakeSuite = createStoryEvalSuite({
    suite_id: "source-intake-safety",
    run_id: "run-deterministic-suite-spine",
    created_at: "2026-10-10T05:10:00.000Z",
    kind: "source_intake_safety",
    cases: [
      {
        case_id: "model_prompt_not_entity_encoded",
        status: "fail",
        review_label: "Review Before Export",
        evidence_refs: ["fixture:source-intake/entity-encoding"],
        mitigation_proposal:
          "Keep display-safe HTML entities out of compiled prompts.",
      },
    ],
  });
  const result = createStoryEvalRun({
    run_id: "run-deterministic-suite-spine",
    created_at: "2026-10-10T05:15:00.000Z",
    storybook_id: "storybook-rose-house",
    story_eval_suites: [streamingSuite, sourceIntakeSuite],
  });

  assert.equal(result.summary.suite_count, 2);
  assert.equal(result.summary.sample_count, 3);
  assert.equal(result.summary.review_label, "Review Before Export");
  assert.deepEqual(result.summary.failed_story_eval_cases, [
    "model_prompt_not_entity_encoded",
  ]);
  assert.deepEqual(result.summary.warning_story_eval_cases, [
    "bottom_lock_when_previously_pinned",
  ]);
  assert.deepEqual(result.summary.mitigation_proposals, [
    "Track whether the user was pinned before the stream chunk rendered.",
    "Keep display-safe HTML entities out of compiled prompts.",
  ]);
  assert.equal(result.summary.trace_visibility, "author_summary");
  assert.equal(
    result.suites.story_eval_suites[0]?.cases[1]?.evidence_refs[0],
    "fixture:streaming/bottom-lock",
  );
  assert.equal(
    "evidence_refs" in result.summary,
    false,
  );
});

test("rejects empty story eval run results and aggregate debug visibility", () => {
  const emptyResult = StoryEvalRunResultSchema.safeParse({
    metadata: {
      run_id: "empty-run",
      created_at: "2026-10-09T04:15:00.000Z",
    },
    suites: {
      evaluation_window_guardrail_traces: [],
      reasoning_integrity_suites: [],
    },
    summary: {
      suite_count: 1,
      sample_count: 1,
      fallback_required: false,
      review_label: "Ready to Play",
      mitigation_proposals: [],
      blocked_routes: 0,
      sandbox_routes: 0,
      failed_reasoning_checks: [],
      warning_reasoning_checks: [],
      context_pruning_recommended: false,
      collapse_warning: false,
      trace_visibility: "hidden",
    },
  });
  const aggregateDebugResult = StoryEvalRunResultSchema.safeParse({
    metadata: {
      run_id: "debug-run",
      created_at: "2026-10-09T04:15:00.000Z",
      privacy_mode: "aggregate_only",
    },
    suites: {
      evaluation_window_guardrail_traces: [baseTrace],
      reasoning_integrity_suites: [],
    },
    summary: {
      suite_count: 1,
      sample_count: 1,
      fallback_required: false,
      review_label: "Ready to Play",
      mitigation_proposals: [],
      blocked_routes: 0,
      sandbox_routes: 0,
      failed_reasoning_checks: [],
      warning_reasoning_checks: [],
      context_pruning_recommended: false,
      collapse_warning: false,
      trace_visibility: "debug_local_only",
    },
  });

  assert.equal(emptyResult.success, false);
  assert.equal(aggregateDebugResult.success, false);
});
