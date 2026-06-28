import {
  HeartWriteLorebookRuntimeSchema,
  LorebookV3DocumentSchema,
  LorebookV3EntrySchema,
  type HeartWriteLorebookRuntime,
  type LorebookV3Document,
  type LorebookV3Entry,
} from "./schema";

export type LorebookCompilerIssueSeverity = "info" | "warning";

export type LorebookCompilerIssue = {
  code: string;
  entryId?: string;
  message: string;
  severity: LorebookCompilerIssueSeverity;
};

export type LorebookQuickActionId =
  | "dedupe_keys"
  | "mark_spoiler_hidden"
  | "clear_spoiler_hidden"
  | "make_selective"
  | "pin_constant_anchor"
  | "mark_review_required";

export type LorebookQuickAction = {
  description: string;
  id: LorebookQuickActionId;
  label: string;
};

export const LOREBOOK_QUICK_ACTIONS = Object.freeze([
  {
    description: "Trim, dedupe, and sort activation keys.",
    id: "dedupe_keys",
    label: "Clean keys",
  },
  {
    description: "Hide full content in previews while keeping it compilable.",
    id: "mark_spoiler_hidden",
    label: "Hide preview",
  },
  {
    description: "Show full content in editor previews again.",
    id: "clear_spoiler_hidden",
    label: "Reveal preview",
  },
  {
    description: "Require a secondary trigger before activation.",
    id: "make_selective",
    label: "Make selective",
  },
  {
    description: "Pin as a high-priority always-on anchor.",
    id: "pin_constant_anchor",
    label: "Pin anchor",
  },
  {
    description: "Flag the entry for human review before export.",
    id: "mark_review_required",
    label: "Needs review",
  },
] as const satisfies readonly LorebookQuickAction[]);

export function readHeartWriteLorebookRuntime(
  entry: LorebookV3Entry,
): HeartWriteLorebookRuntime {
  return HeartWriteLorebookRuntimeSchema.parse(
    isRecord(entry.extensions.heartwriteai)
      ? entry.extensions.heartwriteai
      : {},
  );
}

export function updateHeartWriteLorebookRuntime(
  entry: LorebookV3Entry,
  patch: Partial<HeartWriteLorebookRuntime>,
): LorebookV3Entry {
  const current = readHeartWriteLorebookRuntime(entry);

  return LorebookV3EntrySchema.parse({
    ...entry,
    extensions: {
      ...entry.extensions,
      heartwriteai: HeartWriteLorebookRuntimeSchema.parse({
        ...current,
        ...patch,
      }),
    },
  });
}

export function getLorebookEntryPreview(entry: LorebookV3Entry): string {
  const runtime = readHeartWriteLorebookRuntime(entry);

  if (!runtime.hiddenFromUser) {
    return entry.content;
  }

  return runtime.spoilerPreview?.trim() ||
    runtime.spoilerLabel?.trim() ||
    "Hidden lore entry. Full content is available to the compiler when triggered.";
}

export function isLorebookEntryHiddenFromUser(entry: LorebookV3Entry): boolean {
  return readHeartWriteLorebookRuntime(entry).hiddenFromUser;
}

export function applyLorebookQuickAction(
  entry: LorebookV3Entry,
  actionId: LorebookQuickActionId,
): LorebookV3Entry {
  switch (actionId) {
    case "dedupe_keys":
      return LorebookV3EntrySchema.parse({
        ...entry,
        keys: normalizeLorebookKeys(entry.keys),
        secondary_keys: normalizeLorebookKeys(entry.secondary_keys ?? []),
      });

    case "mark_spoiler_hidden":
      return updateHeartWriteLorebookRuntime(entry, {
        hiddenFromUser: true,
        reviewRequired: true,
        spoilerLabel: readHeartWriteLorebookRuntime(entry).spoilerLabel ||
          entry.name ||
          "Hidden lore",
        spoilerPreview: readHeartWriteLorebookRuntime(entry).spoilerPreview ||
          summarizeForSpoilerPreview(entry.content),
      });

    case "clear_spoiler_hidden":
      return updateHeartWriteLorebookRuntime(entry, {
        hiddenFromUser: false,
      });

    case "make_selective": {
      const fallbackSecondary = entry.secondary_keys?.length
        ? entry.secondary_keys
        : entry.keys.slice(0, 1);

      return LorebookV3EntrySchema.parse({
        ...entry,
        secondary_keys: normalizeLorebookKeys(fallbackSecondary),
        selective: true,
      });
    }

    case "pin_constant_anchor":
      return updateHeartWriteLorebookRuntime(
        LorebookV3EntrySchema.parse({
          ...entry,
          constant: true,
          priority: Math.max(entry.priority ?? 0, 100),
        }),
        {
          activationTier: "anchor",
        },
      );

    case "mark_review_required": {
      const runtime = readHeartWriteLorebookRuntime(entry);

      return updateHeartWriteLorebookRuntime(entry, {
        compilerNotes: uniqueList([
          ...runtime.compilerNotes,
          "Review this entry before export.",
        ]),
        reviewRequired: true,
      });
    }
  }
}

export function compileLorebookReview(
  document: LorebookV3Document,
): LorebookCompilerIssue[] {
  const parsed = LorebookV3DocumentSchema.parse(document);
  const issues: LorebookCompilerIssue[] = [];
  const seenKeys = new Map<string, string>();
  const enabledEntries = parsed.data.entries.filter((entry) => entry.enabled);
  const hiddenEntries = enabledEntries.filter(isLorebookEntryHiddenFromUser);

  if (parsed.data.entries.length === 0) {
    issues.push({
      code: "empty_lorebook",
      message: "Lorebook has no entries.",
      severity: "warning",
    });
  }

  if (!parsed.data.recursive_scanning && parsed.data.entries.length > 6) {
    issues.push({
      code: "recursive_scanning_off",
      message:
        "Large lorebooks usually work better with recursive scanning enabled.",
      severity: "info",
    });
  }

  if (hiddenEntries.length > 0) {
    issues.push({
      code: "hidden_entries_present",
      message: `${hiddenEntries.length} entries are hidden in user previews but still compile for model context.`,
      severity: "info",
    });
  }

  for (const entry of parsed.data.entries) {
    const entryId = String(entry.id ?? entry.insertion_order);
    const runtime = readHeartWriteLorebookRuntime(entry);

    if (entry.enabled && !entry.constant && entry.keys.length === 0) {
      issues.push({
        code: "missing_trigger_keys",
        entryId,
        message: "Enabled non-constant entry has no activation keys.",
        severity: "warning",
      });
    }

    if (entry.selective && (entry.secondary_keys ?? []).length === 0) {
      issues.push({
        code: "missing_secondary_keys",
        entryId,
        message: "Selective entry should define secondary keys.",
        severity: "warning",
      });
    }

    if (entry.content.length > 1200) {
      issues.push({
        code: "large_entry",
        entryId,
        message: "Entry is long enough to consider splitting into smaller lore.",
        severity: "info",
      });
    }

    if (runtime.hiddenFromUser && !runtime.spoilerPreview?.trim()) {
      issues.push({
        code: "missing_spoiler_preview",
        entryId,
        message: "Hidden entry should include a non-spoiler preview label.",
        severity: "warning",
      });
    }

    if (runtime.reviewRequired) {
      issues.push({
        code: "review_required",
        entryId,
        message: "Entry is flagged for human review before export.",
        severity: "info",
      });
    }

    for (const key of normalizeLorebookKeys([
      ...entry.keys,
      ...(entry.secondary_keys ?? []),
    ])) {
      const previous = seenKeys.get(key.toLowerCase());
      if (previous && previous !== entryId) {
        issues.push({
          code: "duplicate_trigger_key",
          entryId,
          message: `Trigger key "${key}" also appears on entry ${previous}.`,
          severity: "info",
        });
      }

      seenKeys.set(key.toLowerCase(), entryId);
    }
  }

  return issues;
}

export function normalizeLorebookKeys(keys: readonly string[]): string[] {
  return uniqueList(
    keys
      .map((key) => key.trim())
      .filter(Boolean),
  ).sort((a, b) => a.localeCompare(b));
}

function summarizeForSpoilerPreview(content: string): string {
  const firstSentence = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)[0]
    ?.trim();

  if (!firstSentence) {
    return "Hidden lore entry.";
  }

  return firstSentence.length > 120
    ? `${firstSentence.slice(0, 117).trim()}...`
    : firstSentence;
}

function uniqueList(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
