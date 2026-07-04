import { z } from "zod";

import {
  HeartWriteLorebookEntryKindSchema,
  HeartWriteLorebookRuntimeSchema,
  LorebookV3DocumentSchema,
  LorebookV3EntrySchema,
  LorebookV3PositionSchema,
  type HeartWriteLorebookRuntime,
  type LorebookV3Document,
  type LorebookV3Entry,
} from "./schema";
import {
  normalizeLorebookKeys,
  readHeartWriteLorebookRuntime,
} from "./runtime";

export const LorebookPlanActivationTierSchema = z.enum([
  "anchor",
  "primary",
  "secondary",
  "ambient",
]);

export const LorebookPlanSourceModeSchema = z.enum([
  "original",
  "source_derived",
  "mixed",
]);

export const LorebookPlanIssueSeveritySchema = z.enum([
  "info",
  "warning",
  "error",
]);

export const LorebookEntryPlanSchema = z.object({
  activationTier: LorebookPlanActivationTierSchema.default("secondary"),
  constant: z.boolean().default(false),
  content: z.string().trim().min(1),
  enabled: z.boolean().default(true),
  entryKind: HeartWriteLorebookEntryKindSchema.default("custom"),
  hiddenFromUser: z.boolean().default(false),
  id: z.union([z.string(), z.number().int()]),
  keys: z.array(z.string().trim().min(1)).default([]),
  notes: z.array(z.string()).default([]),
  position: LorebookV3PositionSchema.default("after_char"),
  priority: z.number().int().optional(),
  reviewRequired: z.boolean().default(false),
  secondaryKeys: z.array(z.string().trim().min(1)).default([]),
  selective: z.boolean().default(false),
  source: z.string().default("heartwriteai"),
  sourceRefs: z.array(z.string().trim().min(1)).default([]),
  title: z.string().trim().min(1),
  tokenBudget: z.number().int().min(0).optional(),
  useRegex: z.boolean().default(false),
});

export const LorebookPlanSchema = z.object({
  entries: z.array(LorebookEntryPlanSchema).default([]),
  id: z.string().trim().min(1),
  sourceMode: LorebookPlanSourceModeSchema.default("original"),
  summary: z.string().default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  title: z.string().trim().min(1),
  tokenBudget: z.number().int().min(0).optional(),
});

export const LorebookPlanIssueSchema = z.object({
  code: z.string(),
  entryId: z.string().optional(),
  message: z.string(),
  severity: LorebookPlanIssueSeveritySchema,
});

export type LorebookPlanActivationTier = z.infer<
  typeof LorebookPlanActivationTierSchema
>;
export type LorebookEntryPlan = z.infer<typeof LorebookEntryPlanSchema>;
export type LorebookPlan = z.infer<typeof LorebookPlanSchema>;
export type LorebookPlanIssue = z.infer<typeof LorebookPlanIssueSchema>;

const ENTRY_TOKEN_SPLIT_HINT = 300;
const ANCHOR_PRIORITY_FLOOR = 100;

const preferredPositionsByEntryKind = {
  behavioral_tell: "after_char",
  character: "after_char",
  custom: "after_char",
  physical_tell: "after_char",
  relationship: "after_char",
  runtime: "after_char",
  scenario: "after_char",
  sensory: "after_char",
  world: "before_char",
} as const satisfies Record<
  z.infer<typeof HeartWriteLorebookEntryKindSchema>,
  z.infer<typeof LorebookV3PositionSchema>
>;

export function createLorebookPlanFromDocument(
  document: LorebookV3Document,
): LorebookPlan {
  const parsed = LorebookV3DocumentSchema.parse(document);
  const heartwriteai = readRecord(parsed.data.extensions.heartwriteai);

  return LorebookPlanSchema.parse({
    entries: parsed.data.entries.map(createLorebookEntryPlanFromEntry),
    id: stringOrFallback(heartwriteai.planId, createStablePlanId(parsed)),
    sourceMode: parseSourceMode(heartwriteai.sourceMode),
    summary: parsed.data.description ?? "",
    tags: stringArray(heartwriteai.tags),
    title: parsed.data.name ?? "Untitled lorebook plan",
    tokenBudget: parsed.data.token_budget,
  });
}

export function compileLorebookPlanToV3Document(
  planInput: LorebookPlan,
): LorebookV3Document {
  const plan = LorebookPlanSchema.parse(planInput);
  const entries = plan.entries.map((entryPlan, index) =>
    compileLorebookEntryPlan(entryPlan, index),
  );

  return LorebookV3DocumentSchema.parse({
    data: {
      description: plan.summary,
      entries,
      extensions: {
        heartwriteai: {
          planId: plan.id,
          sourceMode: plan.sourceMode,
          tags: plan.tags,
        },
      },
      name: plan.title,
      recursive_scanning: entries.length > 1,
      scan_depth: entries.length > 1 ? 3 : 1,
      token_budget: plan.tokenBudget ?? estimateLorebookTokens(entries),
    },
    spec: "lorebook_v3",
  });
}

export function qcLorebookPlan(planInput: LorebookPlan): LorebookPlanIssue[] {
  const plan = LorebookPlanSchema.parse(planInput);
  const issues: LorebookPlanIssue[] = [];
  const seenEntryIds = new Set<string>();
  const seenKeys = new Map<string, string>();

  if (plan.entries.length === 0) {
    issues.push(createIssue("empty_plan", "warning", "Plan has no entries."));
  }

  if (plan.sourceMode !== "original") {
    for (const entry of plan.entries) {
      if (entry.sourceRefs.length === 0) {
        issues.push(
          createIssue(
            "missing_source_refs",
            "warning",
            "Source-derived entries should cite source references.",
            entry.id,
          ),
        );
      }
    }
  }

  for (const entry of plan.entries) {
    const entryId = String(entry.id);

    if (seenEntryIds.has(entryId)) {
      issues.push(
        createIssue(
          "duplicate_entry_id",
          "error",
          `Duplicate entry id "${entryId}".`,
          entry.id,
        ),
      );
    }
    seenEntryIds.add(entryId);

    if (entry.enabled && !entry.constant && entry.keys.length === 0) {
      issues.push(
        createIssue(
          "missing_activation_keys",
          "warning",
          "Enabled non-constant plan entry needs activation keys.",
          entry.id,
        ),
      );
    }

    if (entry.activationTier === "anchor" && !entry.constant) {
      issues.push(
        createIssue(
          "anchor_not_constant",
          "warning",
          "Anchor plan entries should compile as always-on constants.",
          entry.id,
        ),
      );
    }

    if (entry.activationTier === "ambient" && entry.constant) {
      issues.push(
        createIssue(
          "ambient_constant",
          "warning",
          "Ambient entries should usually be keyword-triggered instead of constant.",
          entry.id,
        ),
      );
    }

    if (entry.selective && entry.secondaryKeys.length === 0) {
      issues.push(
        createIssue(
          "selective_without_secondary_keys",
          "warning",
          "Selective plan entry needs secondary keys.",
          entry.id,
        ),
      );
    }

    if (entry.hiddenFromUser && !entry.reviewRequired) {
      issues.push(
        createIssue(
          "hidden_without_review",
          "info",
          "Hidden entries should remain review-marked until the spoiler preview is checked.",
          entry.id,
        ),
      );
    }

    if (
      entry.tokenBudget &&
      estimateTokens(entry.content) > entry.tokenBudget
    ) {
      issues.push(
        createIssue(
          "entry_over_token_budget",
          "warning",
          "Entry prose exceeds its own token budget hint.",
          entry.id,
        ),
      );
    }

    if (estimateTokens(entry.content) > ENTRY_TOKEN_SPLIT_HINT) {
      issues.push(
        createIssue(
          "entry_split_suggested",
          "info",
          "Entry is long enough to consider splitting into smaller activation units.",
          entry.id,
        ),
      );
    }

    const preferredPosition = preferredPositionsByEntryKind[entry.entryKind];
    if (entry.activationTier === "anchor" && entry.position !== preferredPosition) {
      issues.push(
        createIssue(
          "position_mismatch",
          "info",
          `${entry.entryKind} anchors usually compile ${preferredPosition}.`,
          entry.id,
        ),
      );
    }

    for (const key of normalizeLorebookKeys([
      ...entry.keys,
      ...entry.secondaryKeys,
    ])) {
      const lowerKey = key.toLowerCase();
      const previousEntry = seenKeys.get(lowerKey);

      if (previousEntry && previousEntry !== entryId) {
        issues.push(
          createIssue(
            "duplicate_activation_key",
            "info",
            `Activation key "${key}" also appears on entry ${previousEntry}.`,
            entry.id,
          ),
        );
      }

      seenKeys.set(lowerKey, entryId);
    }
  }

  return issues;
}

export function qcLorebookDocument(
  document: LorebookV3Document,
): LorebookPlanIssue[] {
  return qcLorebookPlan(createLorebookPlanFromDocument(document));
}

export function summarizeLorebookPlan(planInput: LorebookPlan) {
  const plan = LorebookPlanSchema.parse(planInput);
  const tiers = plan.entries.reduce(
    (counts, entry) => ({
      ...counts,
      [entry.activationTier]: counts[entry.activationTier] + 1,
    }),
    { ambient: 0, anchor: 0, primary: 0, secondary: 0 } satisfies Record<
      LorebookPlanActivationTier,
      number
    >,
  );

  return {
    enabledEntries: plan.entries.filter((entry) => entry.enabled).length,
    estimatedTokens: estimateLorebookTokens(
      plan.entries.map((entry, index) => compileLorebookEntryPlan(entry, index)),
    ),
    reviewRequiredEntries: plan.entries.filter(
      (entry) => entry.reviewRequired || entry.hiddenFromUser,
    ).length,
    tiers,
    totalEntries: plan.entries.length,
  };
}

function createLorebookEntryPlanFromEntry(
  entry: LorebookV3Entry,
): LorebookEntryPlan {
  const runtime = readHeartWriteLorebookRuntime(entry);
  const activationTier = runtime.activationTier ??
    inferActivationTier(entry, runtime);
  const entryKind = runtime.entryKind;

  return LorebookEntryPlanSchema.parse({
    activationTier,
    constant: entry.constant,
    content: entry.content,
    enabled: entry.enabled,
    entryKind,
    hiddenFromUser: runtime.hiddenFromUser,
    id: entry.id ?? createStableEntryId(entry),
    keys: entry.keys,
    notes: runtime.compilerNotes,
    position: entry.position ?? preferredPositionsByEntryKind[entryKind],
    priority: entry.priority,
    reviewRequired: runtime.reviewRequired,
    secondaryKeys: entry.secondary_keys ?? [],
    selective: entry.selective ?? false,
    source: runtime.source,
    sourceRefs: stringArray(readRecord(entry.extensions.heartwriteai).sourceRefs),
    title: entry.name ?? `Entry ${entry.insertion_order + 1}`,
    tokenBudget: runtime.tokenBudgetHint,
    useRegex: entry.use_regex,
  });
}

function compileLorebookEntryPlan(
  entryInput: LorebookEntryPlan,
  index: number,
): LorebookV3Entry {
  const entry = LorebookEntryPlanSchema.parse(entryInput);
  const compiledTier = normalizeActivationTier(entry);
  const runtime: HeartWriteLorebookRuntime = HeartWriteLorebookRuntimeSchema.parse({
    activationTier: compiledTier,
    compilerNotes: entry.notes,
    entryKind: entry.entryKind,
    hiddenFromUser: entry.hiddenFromUser,
    reviewRequired: entry.reviewRequired || entry.hiddenFromUser,
    source: entry.source,
    tokenBudgetHint: entry.tokenBudget,
    sourceRefs: entry.sourceRefs,
  });

  return LorebookV3EntrySchema.parse({
    constant: entry.constant || compiledTier === "anchor",
    content: entry.content,
    enabled: entry.enabled,
    extensions: {
      heartwriteai: runtime,
    },
    id: entry.id,
    insertion_order: index,
    keys: normalizeLorebookKeys(entry.keys),
    name: entry.title,
    position: entry.position,
    priority:
      compiledTier === "anchor"
        ? Math.max(entry.priority ?? 0, ANCHOR_PRIORITY_FLOOR)
        : entry.priority,
    secondary_keys: normalizeLorebookKeys(entry.secondaryKeys),
    selective: entry.selective,
    use_regex: entry.useRegex,
  });
}

function normalizeActivationTier(
  entry: LorebookEntryPlan,
): LorebookPlanActivationTier {
  if (entry.activationTier === "anchor" || entry.constant) {
    return "anchor";
  }

  return entry.activationTier;
}

function inferActivationTier(
  entry: LorebookV3Entry,
  runtime: HeartWriteLorebookRuntime,
): LorebookPlanActivationTier {
  if (entry.constant) {
    return "anchor";
  }

  if (runtime.entryKind === "world" || runtime.entryKind === "scenario") {
    return "primary";
  }

  if (entry.selective || (entry.secondary_keys ?? []).length > 0) {
    return "secondary";
  }

  return "ambient";
}

function estimateLorebookTokens(entries: LorebookV3Entry[]) {
  return Math.max(
    1,
    entries.reduce(
      (total, entry) => total + estimateTokens(entry.content),
      0,
    ),
  );
}

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}

function createStablePlanId(document: LorebookV3Document) {
  return slugify(document.data.name ?? "heartwriteai-lorebook-plan");
}

function createStableEntryId(entry: LorebookV3Entry) {
  return slugify(entry.name ?? `entry-${entry.insertion_order}`);
}

function createIssue(
  code: string,
  severity: z.infer<typeof LorebookPlanIssueSeveritySchema>,
  message: string,
  entryId?: string | number,
): LorebookPlanIssue {
  return LorebookPlanIssueSchema.parse({
    code,
    entryId: entryId === undefined ? undefined : String(entryId),
    message,
    severity,
  });
}

function parseSourceMode(value: unknown) {
  const parsed = LorebookPlanSourceModeSchema.safeParse(value);
  return parsed.success ? parsed.data : "original";
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readRecord(value: unknown): Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
    ? (value as Record<string, unknown>)
    : {};
}

function slugify(value: string) {
  const slug = value
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return slug || "lorebook_plan";
}
