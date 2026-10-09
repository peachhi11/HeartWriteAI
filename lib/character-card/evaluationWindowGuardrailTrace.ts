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

export type EvaluationWindowGuardrailTrace = z.infer<
  typeof EvaluationWindowGuardrailTraceSchema
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

export function parseEvaluationWindowGuardrailTrace(input: unknown) {
  return EvaluationWindowGuardrailTraceSchema.parse(input);
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
