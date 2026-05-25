import type { GeneratedLorebookArtifact } from "@/features/generation/workflows";

import {
  createLorebookV3Document,
  LorebookV3DocumentSchema,
  LorebookV3EntrySchema,
  LorebookV3Schema,
  type HeartWriteLorebookRuntime,
  type LorebookV3,
  type LorebookV3Document,
  type LorebookV3Entry,
} from "./schema";

type LegacySillyTavernEntry = {
  caseSensitive?: unknown;
  comment?: unknown;
  constant?: unknown;
  content?: unknown;
  depth?: unknown;
  disable?: unknown;
  enabled?: unknown;
  extensions?: unknown;
  key?: unknown;
  keys?: unknown;
  keysecondary?: unknown;
  name?: unknown;
  order?: unknown;
  position?: unknown;
  priority?: unknown;
  selective?: unknown;
  uid?: unknown;
  useRegex?: unknown;
  use_regex?: unknown;
};

export function generatedLorebookArtifactToV3Document(
  artifact: GeneratedLorebookArtifact,
): LorebookV3Document {
  const entries = artifact.entries.map((entry, index) =>
    LorebookV3EntrySchema.parse({
      constant: entry.insertionPriority === "Constant_Anchor",
      content: entry.entryContent,
      enabled: true,
      extensions: {
        heartwriteai: {
          blockedByEvents: [],
          emotionalTags: artifact.tags,
          entryKind: "world",
          requiredEvents: [],
          source: "generated_lorebook",
          tokenBudgetHint: entry.tokenReserveCost,
        } satisfies HeartWriteLorebookRuntime,
      },
      id: entry.entryId,
      insertion_order: index,
      keys: entry.activationKeys,
      name: entry.title,
      use_regex: true,
    }),
  );

  return createLorebookV3Document({
    description: artifact.summary.aiLoreInstruction,
    entries,
    extensions: {
      heartwriteai: {
        source: "generated_lorebook_artifact",
        species: artifact.species.type,
        trope: artifact.trope,
      },
    },
    name: artifact.title,
    recursive_scanning: true,
    scan_depth: 3,
    token_budget: Math.ceil(
      entries.reduce(
        (total, entry) =>
          total +
          getHeartWriteTokenBudgetHint(entry.extensions) +
          entry.content.length / 4,
        0,
      ),
    ),
  });
}

export function normalizeLorebookV3Document(input: unknown): LorebookV3Document {
  const direct = LorebookV3DocumentSchema.safeParse(input);
  if (direct.success) {
    return direct.data;
  }

  const value = asRecord(input);
  if (!value) {
    throw new Error("Lorebook import must be a JSON object.");
  }

  if (Array.isArray(value.entries)) {
    return createLorebookV3Document(normalizeLooseLorebook(value));
  }

  if (isRecord(value.entries)) {
    return createLorebookV3Document(normalizeSillyTavernWorldInfo(value));
  }

  if (isRecord(value.data)) {
    return createLorebookV3Document(normalizeLooseLorebook(value.data));
  }

  throw new Error("Unsupported lorebook shape.");
}

export function serializeLorebookV3Document(document: LorebookV3Document) {
  return JSON.stringify(LorebookV3DocumentSchema.parse(document), null, 2);
}

export function createLorebookV3ExportFileName(name: string | undefined) {
  const safe = (name ?? "heartwriteai-lorebook")
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safe || "heartwriteai-lorebook"}.lorebook-v3.json`;
}

function normalizeLooseLorebook(value: Record<string, unknown>): LorebookV3 {
  return LorebookV3Schema.parse({
    description: value.description ?? value.comment,
    entries: Array.isArray(value.entries)
      ? value.entries.map(normalizeLooseEntry)
      : [],
    extensions: normalizeExtensions(value.extensions),
    name: stringOrUndefined(value.name),
    recursive_scanning: booleanOrUndefined(value.recursive_scanning),
    scan_depth: numberOrUndefined(value.scan_depth ?? value.scanDepth),
    token_budget: numberOrUndefined(value.token_budget ?? value.tokenBudget),
  });
}

function normalizeSillyTavernWorldInfo(
  value: Record<string, unknown>,
): LorebookV3 {
  const entries = Object.values(value.entries as Record<string, unknown>).map(
    normalizeLooseEntry,
  );

  return LorebookV3Schema.parse({
    description: value.description,
    entries,
    extensions: {
      ...normalizeExtensions(value.extensions),
      heartwriteai: {
        importedFrom: "sillytavern_world_info",
      },
    },
    name: stringOrUndefined(value.name),
  });
}

function normalizeLooseEntry(input: unknown): LorebookV3Entry {
  const value = (asRecord(input) ?? {}) as LegacySillyTavernEntry;
  const disabled = booleanOrUndefined(value.disable);
  const enabled = booleanOrUndefined(value.enabled);

  return LorebookV3EntrySchema.parse({
    case_sensitive: booleanOrUndefined(
      value.caseSensitive ?? (value as Record<string, unknown>).case_sensitive,
    ),
    comment: stringOrUndefined(value.comment),
    constant: booleanOrUndefined(value.constant) ?? false,
    content: stringOrUndefined(value.content) ?? "Imported empty lore entry.",
    enabled: enabled ?? (disabled === undefined ? true : !disabled),
    extensions: normalizeExtensions(value.extensions),
    id: idOrUndefined(value.uid ?? (value as Record<string, unknown>).id),
    insertion_order: numberOrUndefined(value.order) ??
      numberOrUndefined((value as Record<string, unknown>).insertion_order) ??
      0,
    keys: stringArray(value.keys ?? value.key),
    name: stringOrUndefined(value.name),
    position: normalizePosition(value.position),
    priority: numberOrUndefined(value.priority),
    secondary_keys: stringArray(value.keysecondary),
    selective: booleanOrUndefined(value.selective),
    use_regex: booleanOrUndefined(value.useRegex ?? value.use_regex) ?? false,
  });
}

function getHeartWriteTokenBudgetHint(extensions: Record<string, unknown>) {
  const heartwriteai = asRecord(extensions.heartwriteai);
  return numberOrUndefined(heartwriteai?.tokenBudgetHint) ?? 0;
}

function normalizeExtensions(value: unknown) {
  return asRecord(value) ?? {};
}

function normalizePosition(value: unknown) {
  if (value === "before_char" || value === "after_char") {
    return value;
  }

  return undefined;
}

function idOrUndefined(value: unknown) {
  return typeof value === "string" || Number.isInteger(value)
    ? value
    : undefined;
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function stringOrUndefined(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function numberOrUndefined(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.round(value)
    : undefined;
}

function booleanOrUndefined(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}
