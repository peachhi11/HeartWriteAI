import { z } from "zod";

const normalizedScoreSchema = z.number().min(0).max(1);
const nonEmptyStringSchema = z.string().trim().min(1);
const maxValidResponseLatencySeconds = 1000;
const defaultMessageLengthWindowTurns = 10;
const defaultMessageLengthMinimumBaselineTurns = 3;
const defaultMessageLengthCollapseThresholdPercentage = 75;
const defaultLatencyTargetMedianSeconds = 2.5;
const defaultLatencyMaxAcceptableSeconds = 12;
const defaultMaxContextTokens = 8192;
const defaultPruningThresholdPercentage = 80;
const defaultSandboxThreshold = 0.55;
const defaultBlockThreshold = 0.9;
const asteriskFormattingPattern = /\*+([^*]+)\*+/g;
const quoteFormattingPattern =
  /["\u201c\u201d\u2018\u2019][^"\u201c\u201d\u2018\u2019]+["\u201c\u201d\u2018\u2019]/g;
const traceVisibilitySchema = z.enum([
  "hidden",
  "author_summary",
  "debug_local_only",
]);
const storyBookSectionSchema = z.enum([
  "character_book",
  "user_book",
  "world_book",
  "scenario_book",
  "memory_book",
  "prompt_book",
  "storybook",
]);

export const EvaluationTraceReviewLabelSchema = z.enum([
  "Set in Ink",
  "Best Guess",
  "Needs Your Eye",
  "Friction Found",
  "Plot Hole Found",
  "Still Blank",
  "Needs the Lore",
  "What's Missing?",
  "Review Before Export",
  "Ready to Play",
  "Ready to Share",
]);

export const ToxicityRouteSchema = z.enum(["standard", "sandbox", "blocked"]);

export const GuardrailRouteReasonCodeSchema = z.enum([
  "platform_route_unverified",
  "saved_preference_integrity_failed",
  "user_agency_violation",
  "toxicity_block_threshold",
  "consent_boundary_block_threshold",
  "toxicity_sandbox_threshold",
  "consent_boundary_sandbox_threshold",
]);

export const GuardrailRouteResolutionSchema = z
  .object({
    target_route: ToxicityRouteSchema,
    fallback_required: z.boolean(),
    review_label: EvaluationTraceReviewLabelSchema,
    reason_codes: z.array(GuardrailRouteReasonCodeSchema),
    mitigation_proposal: nonEmptyStringSchema.optional(),
  })
  .strict();

export const ReasoningIntegrityCheckKeySchema = z.enum([
  "continuity_reasoning",
  "state_transition_reasoning",
  "constraint_reasoning",
  "source_to_field_reasoning",
  "agency_reasoning",
]);

export const ReasoningIntegrityViolationCodeSchema = z.enum([
  "continuity_conflict",
  "invalid_state_transition",
  "constraint_breach",
  "unsupported_field_inference",
  "user_agency_assignment",
]);

export const ReasoningIntegrityViolationSchema = z
  .object({
    code: ReasoningIntegrityViolationCodeSchema,
    message: nonEmptyStringSchema,
    affected_books: z.array(storyBookSectionSchema).min(1),
    review_label: EvaluationTraceReviewLabelSchema.default("Needs Your Eye"),
  })
  .strict();

export const ReasoningIntegrityCheckSchema = z
  .object({
    key: ReasoningIntegrityCheckKeySchema,
    score: normalizedScoreSchema,
    status: z.enum(["pass", "warning", "fail"]),
    evidence_refs: z.array(nonEmptyStringSchema).default([]),
    violations: z.array(ReasoningIntegrityViolationSchema).default([]),
    higher_is_better: z.literal(true).default(true),
  })
  .strict()
  .superRefine((check, context) => {
    if (check.status !== "pass" && check.violations.length === 0) {
      context.addIssue({
        code: "custom",
        message: "warning and fail checks must include at least one violation",
        path: ["violations"],
      });
    }
  });

export const ReasoningIntegritySuiteSchema = z
  .object({
    category: z.literal("reasoning_integrity"),
    metadata: z
      .object({
        suite_id: nonEmptyStringSchema,
        run_id: nonEmptyStringSchema.optional(),
        created_at: z.string().datetime(),
        source_benchmark_family: z
          .literal("reasoning-benchmarks-adapted")
          .default("reasoning-benchmarks-adapted"),
      })
      .strict(),
    checks: z.array(ReasoningIntegrityCheckSchema).min(1),
    summary: z
      .object({
        overall_score: normalizedScoreSchema,
        failed_checks: z.array(ReasoningIntegrityCheckKeySchema).default([]),
        warning_checks: z.array(ReasoningIntegrityCheckKeySchema).default([]),
        review_label: EvaluationTraceReviewLabelSchema,
      })
      .strict(),
  })
  .strict()
  .superRefine((suite, context) => {
    const seen = new Set<string>();

    for (const [index, check] of suite.checks.entries()) {
      if (seen.has(check.key)) {
        context.addIssue({
          code: "custom",
          message: "reasoning integrity checks must be unique by key",
          path: ["checks", index, "key"],
        });
      }
      seen.add(check.key);
    }
  });

export const StoryEvalSuiteKindSchema = z.enum([
  "streaming_response_reconstruction",
  "source_intake_safety",
  "export_serialization_integrity",
  "lorebook_activation_integrity",
  "boundary_alignment",
  "drift_evaluation",
]);

export const StoryEvalCaseStatusSchema = z.enum(["pass", "warning", "fail"]);

export const StoryEvalCaseSchema = z
  .object({
    case_id: nonEmptyStringSchema,
    status: StoryEvalCaseStatusSchema,
    review_label: EvaluationTraceReviewLabelSchema.default("Set in Ink"),
    evidence_refs: z.array(nonEmptyStringSchema).default([]),
    mitigation_proposal: nonEmptyStringSchema.optional(),
  })
  .strict()
  .superRefine((testCase, context) => {
    if (testCase.status !== "pass" && testCase.evidence_refs.length === 0) {
      context.addIssue({
        code: "custom",
        message: "warning and fail story eval cases must include evidence refs",
        path: ["evidence_refs"],
      });
    }
  });

export const StoryEvalSuiteSchema = z
  .object({
    category: z.literal("deterministic_story_eval"),
    kind: StoryEvalSuiteKindSchema,
    metadata: z
      .object({
        suite_id: nonEmptyStringSchema,
        run_id: nonEmptyStringSchema.optional(),
        created_at: z.string().datetime(),
        source_note: nonEmptyStringSchema.optional(),
      })
      .strict(),
    cases: z.array(StoryEvalCaseSchema).min(1),
    summary: z
      .object({
        case_count: z.number().int().min(1),
        failed_cases: z.array(nonEmptyStringSchema).default([]),
        warning_cases: z.array(nonEmptyStringSchema).default([]),
        review_label: EvaluationTraceReviewLabelSchema,
      })
      .strict(),
  })
  .strict()
  .superRefine((suite, context) => {
    const seen = new Set<string>();

    for (const [index, testCase] of suite.cases.entries()) {
      if (seen.has(testCase.case_id)) {
        context.addIssue({
          code: "custom",
          message: "story eval cases must be unique by case_id",
          path: ["cases", index, "case_id"],
        });
      }
      seen.add(testCase.case_id);
    }

    if (suite.summary.case_count !== suite.cases.length) {
      context.addIssue({
        code: "custom",
        message: "story eval suite summary case_count must match cases length",
        path: ["summary", "case_count"],
      });
    }
  });

export const ResponseSpeedDiagnosticSchema = z
  .object({
    name: z.literal("response_speed"),
    score: z.number().min(0).max(maxValidResponseLatencySeconds).nullable(),
    normalized_score: z.null(),
    details: z
      .object({
        mean_speed_seconds: z
          .number()
          .min(0)
          .max(maxValidResponseLatencySeconds)
          .nullable(),
        max_speed_seconds: z
          .number()
          .min(0)
          .max(maxValidResponseLatencySeconds)
          .nullable(),
        num_turns: z.number().int().min(0),
        per_turn_speeds: z.array(
          z.number().min(0).max(maxValidResponseLatencySeconds),
        ),
        invalid_turns_filtered: z.number().int().min(0),
      })
      .strict(),
  })
  .strict();

export const ResponseLatencyPerformanceTierSchema = z.enum([
  "optimal",
  "acceptable",
  "degraded",
  "timeout_threshold_breached",
]);

export const ResponseLatencyProfileSchema = z
  .object({
    raw_latency_seconds: z.number().min(0),
    normalized_score: normalizedScoreSchema,
    historical_average_seconds: z.number().min(0),
    drift_delta_seconds: z.number(),
    performance_tier: ResponseLatencyPerformanceTierSchema,
    system_warmup_indicated: z.boolean(),
  })
  .strict();

export const FormattingArchetypeSchema = z.enum([
  "asterisks",
  "quotes",
  "plain_text",
  "mixed",
]);

export const FormattingArchetypeDiagnosticSchema = z
  .object({
    resolved_archetype: FormattingArchetypeSchema,
    raw_syntax_telemetry: z
      .object({
        asterisk_block_matches: z.number().int().min(0),
        quote_block_matches: z.number().int().min(0),
        total_string_length: z.number().int().min(0),
      })
      .strict(),
    archetype_drift_risk: z.boolean(),
  })
  .strict();

export const ContextPruningActionSchema = z.enum([
  "maintain_current_window",
  "compress_historical_turns",
]);

export const ContextPruningRecommendationSchema = z
  .object({
    total_active_tokens: z.number().int().min(0),
    current_utilization_percentage: z.number().min(0),
    context_pruning_recommended: z.boolean(),
    allocation_telemetry: z
      .object({
        static_prompt_tokens: z.number().int().min(0),
        injected_lore_tokens: z.number().int().min(0),
        active_chat_tokens: z.number().int().min(0),
        headroom_tokens_remaining: z.number().int().min(0),
      })
      .strict(),
    recommended_action: ContextPruningActionSchema,
  })
  .strict();

export const MessageLengthMetricSchema = z
  .object({
    rolling_average_tokens: z.number().min(0),
    delta_percentage: z.number(),
    collapse_warning: z.boolean().default(false),
  })
  .strict();

export const EvaluationWindowGuardrailTraceSchema = z
  .object({
    metadata: z
      .object({
        session_id: z.string().uuid(),
        turn_id: z.number().int().min(0),
        timestamp: z.string().datetime(),
        storybook_id: nonEmptyStringSchema.optional(),
        platform_route: z
          .enum(["app_native", "janitorai", "sillytavern", "marinara"])
          .default("app_native"),
        privacy_mode: z
          .enum(["aggregate_only", "explicitly_saved_source"])
          .default("aggregate_only"),
      })
      .strict(),
    evaluation_window: z
      .object({
        baseline_window_turns: z.number().int().min(1).default(50),
        current_window_turns: z.number().int().min(1).default(10),
        behavioral_metrics: z
          .object({
            message_length: MessageLengthMetricSchema,
            response_latency_seconds: z
              .number()
              .min(0)
              .max(maxValidResponseLatencySeconds),
            formatting_archetype: FormattingArchetypeSchema,
            style_register_shift: normalizedScoreSchema.default(0),
          })
          .strict(),
        narrative_metrics: z
          .object({
            semantic_distance_score: normalizedScoreSchema,
            top_trope_distribution: z.record(
              nonEmptyStringSchema,
              normalizedScoreSchema,
            ),
            persona_congruency_score: normalizedScoreSchema,
            context_pruning_recommended: z.boolean().default(false),
          })
          .strict(),
      })
      .strict(),
    guardrail_trace: z
      .object({
        consent_boundary_proximity: normalizedScoreSchema,
        user_agency_violation_detected: z.boolean(),
        agency_violation_flags: z
          .object({
            forced_dialogue: z.boolean().default(false),
            forced_action: z.boolean().default(false),
            forced_internal_state: z.boolean().default(false),
            forced_biology: z.boolean().default(false),
          })
          .strict()
          .default({
            forced_dialogue: false,
            forced_action: false,
            forced_internal_state: false,
            forced_biology: false,
          }),
        toxicity_routing: z
          .object({
            score: normalizedScoreSchema,
            target_route: ToxicityRouteSchema,
          })
          .strict(),
        platform_route_guardrail_verified: z.boolean(),
        saved_preference_integrity_verified: z.boolean(),
        saved_preference_checksum: nonEmptyStringSchema,
        fallback_required: z.boolean().default(false),
      })
      .strict(),
    review: z
      .object({
        review_label: EvaluationTraceReviewLabelSchema,
        mitigation_proposal: nonEmptyStringSchema.optional(),
        trace_visibility: traceVisibilitySchema.default("hidden"),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((trace, context) => {
    if (
      trace.metadata.privacy_mode === "aggregate_only" &&
      trace.review?.trace_visibility === "debug_local_only"
    ) {
      context.addIssue({
        code: "custom",
        message:
          "debug trace visibility requires explicitly_saved_source privacy mode",
        path: ["review", "trace_visibility"],
      });
    }

    if (
      trace.guardrail_trace.user_agency_violation_detected &&
      !Object.values(trace.guardrail_trace.agency_violation_flags).some(Boolean)
    ) {
      context.addIssue({
        code: "custom",
        message: "agency violations must name at least one breach flag",
        path: ["guardrail_trace", "agency_violation_flags"],
      });
    }
  });

export const StoryEvalRunResultSchema = z
  .object({
    metadata: z
      .object({
        run_id: nonEmptyStringSchema,
        created_at: z.string().datetime(),
        storybook_id: nonEmptyStringSchema.optional(),
        privacy_mode: z
          .enum(["aggregate_only", "explicitly_saved_source"])
          .default("aggregate_only"),
      })
      .strict(),
    suites: z
      .object({
        evaluation_window_guardrail_traces: z
          .array(EvaluationWindowGuardrailTraceSchema)
          .default([]),
        reasoning_integrity_suites: z
          .array(ReasoningIntegritySuiteSchema)
          .default([]),
        story_eval_suites: z.array(StoryEvalSuiteSchema).default([]),
      })
      .strict(),
    summary: z
      .object({
        suite_count: z.number().int().min(1),
        sample_count: z.number().int().min(1),
        fallback_required: z.boolean(),
        review_label: EvaluationTraceReviewLabelSchema,
        mitigation_proposals: z.array(nonEmptyStringSchema).default([]),
        blocked_routes: z.number().int().min(0),
        sandbox_routes: z.number().int().min(0),
        failed_reasoning_checks: z
          .array(ReasoningIntegrityCheckKeySchema)
          .default([]),
        warning_reasoning_checks: z
          .array(ReasoningIntegrityCheckKeySchema)
          .default([]),
        failed_story_eval_cases: z.array(nonEmptyStringSchema).default([]),
        warning_story_eval_cases: z.array(nonEmptyStringSchema).default([]),
        context_pruning_recommended: z.boolean(),
        collapse_warning: z.boolean(),
        trace_visibility: traceVisibilitySchema.default("hidden"),
      })
      .strict(),
  })
  .strict()
  .superRefine((runResult, context) => {
    const suiteCount =
      runResult.suites.evaluation_window_guardrail_traces.length +
      runResult.suites.reasoning_integrity_suites.length +
      runResult.suites.story_eval_suites.length;

    if (suiteCount === 0) {
      context.addIssue({
        code: "custom",
        message: "story eval run results must include at least one suite",
        path: ["suites"],
      });
    }

    if (
      runResult.metadata.privacy_mode === "aggregate_only" &&
      runResult.summary.trace_visibility === "debug_local_only"
    ) {
      context.addIssue({
        code: "custom",
        message:
          "debug trace visibility requires explicitly_saved_source privacy mode",
        path: ["summary", "trace_visibility"],
      });
    }
  });

export type EvaluationWindowGuardrailTrace = z.infer<
  typeof EvaluationWindowGuardrailTraceSchema
>;
export type GuardrailRouteReasonCode = z.infer<
  typeof GuardrailRouteReasonCodeSchema
>;
export type GuardrailRouteResolution = z.infer<
  typeof GuardrailRouteResolutionSchema
>;
export type ResponseSpeedDiagnostic = z.infer<
  typeof ResponseSpeedDiagnosticSchema
>;
export type ResponseLatencyProfile = z.infer<
  typeof ResponseLatencyProfileSchema
>;
export type FormattingArchetype = z.infer<typeof FormattingArchetypeSchema>;
export type FormattingArchetypeDiagnostic = z.infer<
  typeof FormattingArchetypeDiagnosticSchema
>;
export type ContextPruningRecommendation = z.infer<
  typeof ContextPruningRecommendationSchema
>;
export type MessageLengthMetric = z.infer<typeof MessageLengthMetricSchema>;
export type ReasoningIntegrityCheck = z.infer<
  typeof ReasoningIntegrityCheckSchema
>;
export type ReasoningIntegrityCheckInput = z.input<
  typeof ReasoningIntegrityCheckSchema
>;
export type ReasoningIntegritySuite = z.infer<
  typeof ReasoningIntegritySuiteSchema
>;
export type StoryEvalSuiteKind = z.infer<typeof StoryEvalSuiteKindSchema>;
export type StoryEvalCase = z.infer<typeof StoryEvalCaseSchema>;
export type StoryEvalCaseInput = z.input<typeof StoryEvalCaseSchema>;
export type StoryEvalSuite = z.infer<typeof StoryEvalSuiteSchema>;
export type StoryEvalRunResult = z.infer<typeof StoryEvalRunResultSchema>;

export type StreamingReconstructionFixture = {
  case_id: string;
  evidence_ref: string;
  expected_text: string;
  reconstructed_text: string;
  final_buffer_flushed?: boolean;
  partial_state_committed?: boolean;
  ui_remained_unlocked?: boolean;
  user_facing_fallback?: boolean;
  leaked_metadata_keys?: readonly string[];
};

export type SourceIntakeSafetyFixture = {
  suite_id: string;
  evidence_ref: string;
  malformed_schema_rejected: boolean;
  structural_controls_stripped: boolean;
  display_text_escaped: boolean;
  model_prompt_preserved_plain_text: boolean;
  raw_source_preserved_separately: boolean;
  rendered_fields_reviewed: boolean;
};

export type ExportSerializationFixture = {
  suite_id: string;
  evidence_ref: string;
  json_roundtrip_valid: boolean;
  fixed_clock_used: boolean;
  roleplay_syntax_preserved: boolean;
  unsupported_internal_fields_warned: boolean;
  target_schema_valid: boolean;
  binary_metadata_clean?: boolean;
};

export type LorebookActivationFixture = {
  suite_id: string;
  evidence_ref: string;
  cold_open_core_lore_loaded: boolean;
  pronoun_drift_resolved: boolean;
  key_variants_triggered: boolean;
  broad_key_false_positive_blocked: boolean;
  budget_eviction_preserved_priority: boolean;
  snippets_remained_whole: boolean;
  spoiler_lock_suppressed: boolean;
};

export function parseEvaluationWindowGuardrailTrace(input: unknown) {
  return EvaluationWindowGuardrailTraceSchema.parse(input);
}

export function resolveGuardrailRoute(input: {
  consentBoundaryProximity: number;
  toxicityScore: number;
  userAgencyViolationDetected: boolean;
  platformRouteGuardrailVerified: boolean;
  savedPreferenceIntegrityVerified: boolean;
  sandboxThreshold?: number;
  blockThreshold?: number;
}): GuardrailRouteResolution {
  const sandboxThreshold = input.sandboxThreshold ?? defaultSandboxThreshold;
  const blockThreshold = input.blockThreshold ?? defaultBlockThreshold;

  if (
    !Number.isFinite(sandboxThreshold) ||
    !Number.isFinite(blockThreshold) ||
    sandboxThreshold < 0 ||
    sandboxThreshold > 1 ||
    blockThreshold < 0 ||
    blockThreshold > 1 ||
    sandboxThreshold >= blockThreshold
  ) {
    throw new Error("guardrail route thresholds must be ordered 0..1 scores");
  }

  const consentBoundaryProximity = normalizedScoreSchema.parse(
    input.consentBoundaryProximity,
  );
  const toxicityScore = normalizedScoreSchema.parse(input.toxicityScore);
  const reasonCodes: GuardrailRouteReasonCode[] = [];

  if (!input.platformRouteGuardrailVerified) {
    reasonCodes.push("platform_route_unverified");
  }

  if (!input.savedPreferenceIntegrityVerified) {
    reasonCodes.push("saved_preference_integrity_failed");
  }

  if (input.userAgencyViolationDetected) {
    reasonCodes.push("user_agency_violation");
  }

  if (toxicityScore >= blockThreshold) {
    reasonCodes.push("toxicity_block_threshold");
  }

  if (consentBoundaryProximity >= blockThreshold) {
    reasonCodes.push("consent_boundary_block_threshold");
  }

  const hasBlockReason = reasonCodes.length > 0;

  if (!hasBlockReason && toxicityScore >= sandboxThreshold) {
    reasonCodes.push("toxicity_sandbox_threshold");
  }

  if (!hasBlockReason && consentBoundaryProximity >= sandboxThreshold) {
    reasonCodes.push("consent_boundary_sandbox_threshold");
  }

  const hasSandboxReason = reasonCodes.length > 0;
  const targetRoute = hasBlockReason
    ? "blocked"
    : hasSandboxReason
      ? "sandbox"
      : "standard";
  const mitigationProposal =
    targetRoute === "blocked"
      ? "Stop generation and use a plain-language fallback."
      : targetRoute === "sandbox"
        ? "Route this turn through sandbox review before generation."
        : undefined;

  return GuardrailRouteResolutionSchema.parse({
    target_route: targetRoute,
    fallback_required: targetRoute !== "standard",
    review_label:
      targetRoute === "blocked"
        ? "Review Before Export"
        : targetRoute === "sandbox"
          ? "Needs Your Eye"
          : "Set in Ink",
    reason_codes: reasonCodes,
    mitigation_proposal: mitigationProposal,
  });
}

export function createResponseSpeedDiagnostic(
  latencyAssistantTurns: readonly number[],
): ResponseSpeedDiagnostic {
  const perTurnSpeeds = latencyAssistantTurns.filter(
    (latencySeconds) =>
      Number.isFinite(latencySeconds) &&
      latencySeconds >= 0 &&
      latencySeconds <= maxValidResponseLatencySeconds,
  );
  const invalidTurnsFiltered =
    latencyAssistantTurns.length - perTurnSpeeds.length;
  const meanSpeedSeconds =
    perTurnSpeeds.length > 0
      ? perTurnSpeeds.reduce((total, value) => total + value, 0) /
        perTurnSpeeds.length
      : null;
  const maxSpeedSeconds =
    perTurnSpeeds.length > 0 ? Math.max(...perTurnSpeeds) : null;

  return ResponseSpeedDiagnosticSchema.parse({
    name: "response_speed",
    score: meanSpeedSeconds,
    normalized_score: null,
    details: {
      mean_speed_seconds: meanSpeedSeconds,
      max_speed_seconds: maxSpeedSeconds,
      num_turns: perTurnSpeeds.length,
      per_turn_speeds: perTurnSpeeds,
      invalid_turns_filtered: invalidTurnsFiltered,
    },
  });
}

export function normalizeResponseLatencyScore(input: {
  latencySeconds: number;
  targetMedianSeconds?: number;
  maxAcceptableSeconds?: number;
}): number {
  const targetMedianSeconds =
    input.targetMedianSeconds ?? defaultLatencyTargetMedianSeconds;
  const maxAcceptableSeconds =
    input.maxAcceptableSeconds ?? defaultLatencyMaxAcceptableSeconds;

  if (
    !Number.isFinite(input.latencySeconds) ||
    !Number.isFinite(targetMedianSeconds) ||
    !Number.isFinite(maxAcceptableSeconds) ||
    targetMedianSeconds <= 0 ||
    maxAcceptableSeconds <= 0 ||
    maxAcceptableSeconds <= targetMedianSeconds
  ) {
    throw new Error("latency normalization requires valid positive bounds");
  }

  if (input.latencySeconds <= 0) {
    return 1;
  }

  if (input.latencySeconds >= maxAcceptableSeconds) {
    return 0;
  }

  const scale = -Math.log(0.5) / targetMedianSeconds ** 2;
  const score = Math.exp(-scale * input.latencySeconds ** 2);

  return roundToFourDecimals(Math.max(0, Math.min(1, score)));
}

export function createResponseLatencyProfile(input: {
  latencySeconds: number;
  historicalLatencySeconds?: readonly number[];
  targetMedianSeconds?: number;
  maxAcceptableSeconds?: number;
}): ResponseLatencyProfile {
  const latencySeconds = input.latencySeconds;
  const targetMedianSeconds =
    input.targetMedianSeconds ?? defaultLatencyTargetMedianSeconds;

  if (!Number.isFinite(latencySeconds) || latencySeconds < 0) {
    throw new Error("latency seconds must be a non-negative number");
  }

  const history = input.historicalLatencySeconds ?? [];

  for (const historicalLatency of history) {
    if (!Number.isFinite(historicalLatency) || historicalLatency < 0) {
      throw new Error("historical latency values must be non-negative numbers");
    }
  }

  const normalizedScore = normalizeResponseLatencyScore({
    latencySeconds,
    targetMedianSeconds,
    maxAcceptableSeconds: input.maxAcceptableSeconds,
  });
  const historicalAverageSeconds =
    history.length > 0
      ? history.reduce((total, value) => total + value, 0) / history.length
      : latencySeconds;
  const driftDeltaSeconds = latencySeconds - historicalAverageSeconds;

  return ResponseLatencyProfileSchema.parse({
    raw_latency_seconds: roundToThreeDecimals(latencySeconds),
    normalized_score: normalizedScore,
    historical_average_seconds: roundToThreeDecimals(historicalAverageSeconds),
    drift_delta_seconds: roundToThreeDecimals(driftDeltaSeconds),
    performance_tier: getResponseLatencyPerformanceTier(normalizedScore),
    system_warmup_indicated:
      history.length === 0 && latencySeconds > targetMedianSeconds * 1.5,
  });
}

export function detectFormattingArchetype(text: string): FormattingArchetype {
  if (!text.trim()) {
    return "plain_text";
  }

  const hasAsterisks = countFormattingMatches(
    text,
    asteriskFormattingPattern,
  ) > 0;
  const hasQuotes = countFormattingMatches(text, quoteFormattingPattern) > 0;

  if (hasAsterisks && hasQuotes) {
    return "mixed";
  }

  if (hasAsterisks) {
    return "asterisks";
  }

  if (hasQuotes) {
    return "quotes";
  }

  return "plain_text";
}

export function createFormattingArchetypeDiagnostic(
  text: string,
): FormattingArchetypeDiagnostic {
  const asteriskBlockMatches = countFormattingMatches(
    text,
    asteriskFormattingPattern,
  );
  const quoteBlockMatches = countFormattingMatches(text, quoteFormattingPattern);
  const resolvedArchetype =
    asteriskBlockMatches > 0 && quoteBlockMatches > 0
      ? "mixed"
      : asteriskBlockMatches > 0
        ? "asterisks"
        : quoteBlockMatches > 0
          ? "quotes"
          : "plain_text";

  return FormattingArchetypeDiagnosticSchema.parse({
    resolved_archetype: resolvedArchetype,
    raw_syntax_telemetry: {
      asterisk_block_matches: asteriskBlockMatches,
      quote_block_matches: quoteBlockMatches,
      total_string_length: text.length,
    },
    archetype_drift_risk:
      resolvedArchetype === "plain_text" && estimateMessageTokenCount(text) > 15,
  });
}

export function createContextPruningRecommendation(input: {
  systemPromptTokens: number;
  lorebookTokens: number;
  chatHistoryTokenCounts?: readonly number[];
  maxContextTokens?: number;
  pruningThresholdPercentage?: number;
}): ContextPruningRecommendation {
  const maxContextTokens = input.maxContextTokens ?? defaultMaxContextTokens;
  const pruningThresholdPercentage =
    input.pruningThresholdPercentage ?? defaultPruningThresholdPercentage;

  if (
    !Number.isInteger(maxContextTokens) ||
    maxContextTokens <= 0 ||
    !Number.isFinite(pruningThresholdPercentage) ||
    pruningThresholdPercentage <= 0 ||
    pruningThresholdPercentage > 100
  ) {
    throw new Error("context pruning requires valid positive bounds");
  }

  assertNonNegativeIntegerTokenCount(
    input.systemPromptTokens,
    "system prompt tokens",
  );
  assertNonNegativeIntegerTokenCount(input.lorebookTokens, "lorebook tokens");

  const chatHistoryTokenCounts = input.chatHistoryTokenCounts ?? [];

  for (const tokenCount of chatHistoryTokenCounts) {
    assertNonNegativeIntegerTokenCount(tokenCount, "chat history tokens");
  }

  const activeChatTokens = chatHistoryTokenCounts.reduce(
    (total, tokenCount) => total + tokenCount,
    0,
  );
  const totalActiveTokens =
    input.systemPromptTokens + input.lorebookTokens + activeChatTokens;
  const criticalTokenLimit = Math.floor(
    maxContextTokens * (pruningThresholdPercentage / 100),
  );
  const contextPruningRecommended = totalActiveTokens >= criticalTokenLimit;

  return ContextPruningRecommendationSchema.parse({
    total_active_tokens: totalActiveTokens,
    current_utilization_percentage: roundToTwoDecimals(
      (totalActiveTokens / maxContextTokens) * 100,
    ),
    context_pruning_recommended: contextPruningRecommended,
    allocation_telemetry: {
      static_prompt_tokens: input.systemPromptTokens,
      injected_lore_tokens: input.lorebookTokens,
      active_chat_tokens: activeChatTokens,
      headroom_tokens_remaining: Math.max(
        0,
        maxContextTokens - totalActiveTokens,
      ),
    },
    recommended_action: contextPruningRecommended
      ? "compress_historical_turns"
      : "maintain_current_window",
  });
}

export function estimateMessageTokenCount(text: string): number {
  const trimmed = text.trim();

  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

export function createMessageLengthMetric(input: {
  currentMessage?: string;
  currentTokenCount?: number;
  historicalTokenCounts: readonly number[];
  windowSizeTurns?: number;
  minimumBaselineTurns?: number;
  collapseThresholdPercentage?: number;
}): MessageLengthMetric {
  const windowSizeTurns =
    input.windowSizeTurns ?? defaultMessageLengthWindowTurns;
  const minimumBaselineTurns =
    input.minimumBaselineTurns ?? defaultMessageLengthMinimumBaselineTurns;
  const collapseThresholdPercentage =
    input.collapseThresholdPercentage ??
    defaultMessageLengthCollapseThresholdPercentage;

  if (
    !Number.isInteger(windowSizeTurns) ||
    windowSizeTurns < 1 ||
    !Number.isInteger(minimumBaselineTurns) ||
    minimumBaselineTurns < 1
  ) {
    throw new Error("message length window settings must be positive integers");
  }

  if (
    !Number.isFinite(collapseThresholdPercentage) ||
    collapseThresholdPercentage < 0
  ) {
    throw new Error("collapse threshold must be a non-negative number");
  }

  const currentTokenCount =
    input.currentTokenCount ??
    estimateMessageTokenCount(input.currentMessage ?? "");

  if (!Number.isFinite(currentTokenCount) || currentTokenCount < 0) {
    throw new Error("current token count must be a non-negative number");
  }

  for (const tokenCount of input.historicalTokenCounts) {
    if (!Number.isFinite(tokenCount) || tokenCount < 0) {
      throw new Error("historical token counts must be non-negative numbers");
    }
  }

  const baselineTokenCounts = input.historicalTokenCounts.slice(
    -windowSizeTurns,
  );

  if (baselineTokenCounts.length < minimumBaselineTurns) {
    return MessageLengthMetricSchema.parse({
      rolling_average_tokens: roundToTwoDecimals(currentTokenCount),
      delta_percentage: 0,
      collapse_warning: false,
    });
  }

  const rollingAverageTokens =
    baselineTokenCounts.reduce((total, value) => total + value, 0) /
    baselineTokenCounts.length;
  const deltaPercentage =
    rollingAverageTokens === 0
      ? 0
      : ((rollingAverageTokens - currentTokenCount) / rollingAverageTokens) *
        100;

  return MessageLengthMetricSchema.parse({
    rolling_average_tokens: roundToTwoDecimals(rollingAverageTokens),
    delta_percentage: roundToTwoDecimals(deltaPercentage),
    collapse_warning: deltaPercentage >= collapseThresholdPercentage,
  });
}

export function createReasoningIntegritySuite(input: {
  suite_id: string;
  run_id?: string;
  created_at: string;
  checks: readonly ReasoningIntegrityCheckInput[];
}): ReasoningIntegritySuite {
  const checks = input.checks.map((check) =>
    ReasoningIntegrityCheckSchema.parse(check),
  );
  const overallScore =
    checks.reduce((total, check) => total + check.score, 0) / checks.length;
  const failedChecks = checks
    .filter((check) => check.status === "fail")
    .map((check) => check.key);
  const warningChecks = checks
    .filter((check) => check.status === "warning")
    .map((check) => check.key);
  const reviewLabel =
    failedChecks.length > 0
      ? "Review Before Export"
      : warningChecks.length > 0
        ? "Needs Your Eye"
        : "Ready to Play";

  return ReasoningIntegritySuiteSchema.parse({
    category: "reasoning_integrity",
    metadata: {
      suite_id: input.suite_id,
      run_id: input.run_id,
      created_at: input.created_at,
    },
    checks,
    summary: {
      overall_score: overallScore,
      failed_checks: failedChecks,
      warning_checks: warningChecks,
      review_label: reviewLabel,
    },
  });
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

export function createStoryEvalRunResult(input: {
  run_id: string;
  created_at: string;
  storybook_id?: string;
  privacy_mode?: "aggregate_only" | "explicitly_saved_source";
  evaluation_window_guardrail_traces?: readonly EvaluationWindowGuardrailTrace[];
  reasoning_integrity_suites?: readonly ReasoningIntegritySuite[];
  story_eval_suites?: readonly StoryEvalSuite[];
}): StoryEvalRunResult {
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

export function createStoryEvalRun(input: {
  run_id: string;
  created_at: string;
  storybook_id?: string;
  privacy_mode?: "aggregate_only" | "explicitly_saved_source";
  evaluation_window_guardrail_traces?: readonly EvaluationWindowGuardrailTrace[];
  reasoning_integrity_suites?: readonly ReasoningIntegritySuite[];
  story_eval_suites?: readonly StoryEvalSuite[];
}): StoryEvalRunResult {
  return createStoryEvalRunResult(input);
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function roundToFourDecimals(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function getResponseLatencyPerformanceTier(
  normalizedScore: number,
): z.infer<typeof ResponseLatencyPerformanceTierSchema> {
  if (normalizedScore >= 0.85) {
    return "optimal";
  }

  if (normalizedScore >= 0.5) {
    return "acceptable";
  }

  if (normalizedScore > 0) {
    return "degraded";
  }

  return "timeout_threshold_breached";
}

function countFormattingMatches(text: string, pattern: RegExp): number {
  return Array.from(text.matchAll(pattern)).length;
}

function assertNonNegativeIntegerTokenCount(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
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
