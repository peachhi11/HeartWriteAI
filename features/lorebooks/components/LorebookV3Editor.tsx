"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

import CopyButton from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  LorebookV3DocumentSchema,
  LorebookV3EntrySchema,
  type LorebookV3Document,
  type LorebookV3Entry,
} from "../schema";

const ENTRY_CHARACTER_WARNING = 1200;
const TOTAL_TOKEN_WARNING = 1200;

export function LorebookV3Editor(props: {
  document: LorebookV3Document;
  onChange: (document: LorebookV3Document) => void;
  serialized: string;
}) {
  const [entryQuery, setEntryQuery] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<string | number | null>(
    () => props.document.data.entries[0]?.id ?? null,
  );
  const filteredEntries = useMemo(() => {
    const query = entryQuery.trim().toLowerCase();
    if (!query) {
      return props.document.data.entries;
    }

    return props.document.data.entries.filter((entry) =>
      [
        entry.name,
        entry.comment,
        entry.content,
        ...entry.keys,
        ...(entry.secondary_keys ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [entryQuery, props.document.data.entries]);
  const selectedEntry =
    props.document.data.entries.find((entry) => entry.id === selectedEntryId) ??
    props.document.data.entries[0] ??
    null;
  const selectedEntryKey = selectedEntry?.id ?? null;
  const totalEstimatedTokens = useMemo(
    () =>
      props.document.data.entries.reduce(
        (total, entry) => total + estimateTokens(entry.content),
        0,
      ),
    [props.document.data.entries],
  );
  const tokenBudget = props.document.data.token_budget ?? TOTAL_TOKEN_WARNING;
  const tokenBudgetPercent = Math.min(
    100,
    Math.round((totalEstimatedTokens / Math.max(1, tokenBudget)) * 100),
  );

  function updateDocument(patch: Partial<LorebookV3Document["data"]>) {
    props.onChange(
      LorebookV3DocumentSchema.parse({
        ...props.document,
        data: {
          ...props.document.data,
          ...patch,
        },
      }),
    );
  }

  function updateSelectedEntry(patch: Partial<LorebookV3Entry>) {
    if (!selectedEntry) {
      return;
    }

    const updatedEntry = LorebookV3EntrySchema.parse({
      ...selectedEntry,
      ...patch,
    });

    updateDocument({
      entries: props.document.data.entries.map((entry) =>
        entry.id === selectedEntryKey ? updatedEntry : entry,
      ),
    });
  }

  function addEntry() {
    const nextIndex = props.document.data.entries.length;
    const entry = LorebookV3EntrySchema.parse({
      content: "New modular lore entry.",
      enabled: true,
      id: `entry_${Date.now().toString(36)}`,
      insertion_order: nextIndex,
      keys: ["new trigger"],
      name: "New lore entry",
      use_regex: false,
    });

    setSelectedEntryId(entry.id ?? null);
    updateDocument({
      entries: [...props.document.data.entries, entry],
    });
  }

  function deleteSelectedEntry() {
    if (!selectedEntry) {
      return;
    }

    const entries = props.document.data.entries.filter(
      (entry) => entry.id !== selectedEntryKey,
    );

    setSelectedEntryId(entries[0]?.id ?? null);
    updateDocument({ entries });
  }

  return (
    <div className="grid gap-4 2xl:grid-cols-[20rem_minmax(0,1fr)_22rem]">
      <section className="grid h-fit gap-3 rounded-md border bg-background/70 p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">
              Entries ({props.document.data.entries.length})
            </h3>
            <Button type="button" size="sm" variant="outline" onClick={addEntry}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={entryQuery}
              onChange={(event) => setEntryQuery(event.currentTarget.value)}
              placeholder="Search entries"
              className="pl-9"
            />
          </div>
          <div className="grid gap-2">
            {filteredEntries.map((entry) => (
              <button
                key={String(entry.id ?? entry.insertion_order)}
                type="button"
                onClick={() => setSelectedEntryId(entry.id ?? null)}
                className={cn(
                  "rounded-md border bg-card/70 p-3 text-left transition hover:bg-muted",
                  selectedEntryKey === entry.id && "border-primary",
                )}
              >
                <p className="truncate text-sm font-medium">
                  {entry.name ?? `Entry ${entry.insertion_order + 1}`}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {entry.keys.join(", ") || "No keys"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant={entry.enabled ? "secondary" : "outline"}>
                    {entry.enabled ? "active" : "disabled"}
                  </Badge>
                  {entry.constant ? <Badge variant="secondary">constant</Badge> : null}
                  {entry.selective ? <Badge variant="outline">selective</Badge> : null}
                  {entry.use_regex ? <Badge variant="outline">regex</Badge> : null}
                </div>
              </button>
            ))}
            {filteredEntries.length === 0 ? (
              <p className="rounded-md border bg-card/60 p-3 text-sm text-muted-foreground">
                No entries match this search.
              </p>
            ) : null}
          </div>
        </section>

        {selectedEntry ? (
          <section className="grid gap-4 rounded-md border bg-background/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">Entry Editor</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedEntry.name ?? "Untitled entry"} · ~
                  {estimateTokens(selectedEntry.content)} tokens ·{" "}
                  {selectedEntry.content.length} chars
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant={selectedEntry.enabled ? "secondary" : "outline"}>
                    {selectedEntry.enabled ? "active" : "disabled"}
                  </Badge>
                  {selectedEntry.constant ? (
                    <Badge variant="secondary">always active</Badge>
                  ) : null}
                  {selectedEntry.selective ? (
                    <Badge variant="outline">requires secondary key</Badge>
                  ) : null}
                  {selectedEntry.position ? (
                    <Badge variant="outline">
                      {selectedEntry.position === "before_char"
                        ? "before character"
                        : "after character"}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={deleteSelectedEntry}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-[10rem_1fr]">
              <Field label="UID">
                <Input
                  value={String(selectedEntry.id ?? "")}
                  onChange={(event) =>
                    updateSelectedEntry({
                      id: event.currentTarget.value || undefined,
                    })
                  }
                />
              </Field>
              <Field label="Entry name">
                <Input
                  value={selectedEntry.name ?? ""}
                  onChange={(event) =>
                    updateSelectedEntry({ name: event.currentTarget.value })
                  }
                />
              </Field>
              <Field label="Keys">
                <Input
                  value={selectedEntry.keys.join(", ")}
                  onChange={(event) =>
                    updateSelectedEntry({
                      keys: splitList(event.currentTarget.value),
                    })
                  }
                />
              </Field>
              <Field label="Secondary keys">
                <Input
                  value={selectedEntry.secondary_keys?.join(", ") ?? ""}
                  onChange={(event) =>
                    updateSelectedEntry({
                      secondary_keys: splitList(event.currentTarget.value),
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Content">
              <Textarea
                rows={12}
                value={selectedEntry.content}
                onChange={(event) =>
                  updateSelectedEntry({ content: event.currentTarget.value })
                }
              />
            </Field>

            <EntryWarnings
              entry={selectedEntry}
              totalEstimatedTokens={totalEstimatedTokens}
            />
          </section>
        ) : (
          <section className="rounded-md border bg-background/70 p-4 text-sm text-muted-foreground">
            No entries yet. Add one to start building this lorebook.
          </section>
        )}

      <section className="grid h-fit gap-4 rounded-md border bg-background/70 p-4">
        <div>
          <h3 className="text-xl font-semibold">Scanning & Injection</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Controls how this lorebook activates inside chat context.
          </p>
        </div>

        <Field label="Lorebook name">
          <Input
            value={props.document.data.name ?? ""}
            onChange={(event) => updateDocument({ name: event.currentTarget.value })}
          />
        </Field>
        <Field label="Description">
          <Textarea
            rows={4}
            value={props.document.data.description ?? ""}
            onChange={(event) =>
              updateDocument({ description: event.currentTarget.value })
            }
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
          <Field label="Scan depth">
            <Input
              min={0}
              type="number"
              value={props.document.data.scan_depth ?? 0}
              onChange={(event) =>
                updateDocument({
                  scan_depth: numberFromInput(event.currentTarget.value),
                })
              }
            />
          </Field>
          <Field label="Token budget">
            <Input
              min={0}
              type="number"
              value={props.document.data.token_budget ?? 0}
              onChange={(event) =>
                updateDocument({
                  token_budget: numberFromInput(event.currentTarget.value),
                })
              }
            />
          </Field>
          <Field label="Entry order">
            <Input
              type="number"
              value={selectedEntry?.insertion_order ?? 0}
              onChange={(event) =>
                updateSelectedEntry({
                  insertion_order:
                    numberFromInput(event.currentTarget.value) ?? 0,
                })
              }
              disabled={!selectedEntry}
            />
          </Field>
          <Field label="Entry priority">
            <Input
              type="number"
              value={selectedEntry?.priority ?? 0}
              onChange={(event) =>
                updateSelectedEntry({
                  priority: numberFromInput(event.currentTarget.value),
                })
              }
              disabled={!selectedEntry}
            />
          </Field>
          <Field label="Insertion position">
            <select
              value={selectedEntry?.position ?? "after_char"}
              onChange={(event) =>
                updateSelectedEntry({
                  position: event.currentTarget.value as LorebookV3Entry["position"],
                })
              }
              disabled={!selectedEntry}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="before_char">Before character</option>
              <option value="after_char">After character</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-2 rounded-md border bg-card/60 p-3 text-sm text-muted-foreground">
          <Toggle
            checked={props.document.data.recursive_scanning ?? false}
            label="Recursive scanning"
            onChange={(checked) => updateDocument({ recursive_scanning: checked })}
          />
          <Toggle
            checked={selectedEntry?.enabled ?? false}
            label="Entry active"
            onChange={(checked) => updateSelectedEntry({ enabled: checked })}
          />
          <Toggle
            checked={selectedEntry?.constant ?? false}
            label="Always active"
            onChange={(checked) => updateSelectedEntry({ constant: checked })}
          />
          <Toggle
            checked={selectedEntry?.use_regex ?? false}
            label="Use regex"
            onChange={(checked) => updateSelectedEntry({ use_regex: checked })}
          />
          <Toggle
            checked={selectedEntry?.case_sensitive ?? false}
            label="Case sensitive"
            onChange={(checked) =>
              updateSelectedEntry({ case_sensitive: checked })
            }
          />
          <Toggle
            checked={selectedEntry?.selective ?? false}
            label="Require secondary key"
            onChange={(checked) => updateSelectedEntry({ selective: checked })}
          />
        </div>

        <div className="grid gap-3 rounded-md border bg-card/60 p-3 text-sm text-muted-foreground">
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">Token budget</p>
              <span className="font-mono text-xs">
                {totalEstimatedTokens} / {tokenBudget}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  tokenBudgetPercent > 90
                    ? "bg-amber-500"
                    : tokenBudgetPercent > 70
                      ? "bg-primary"
                      : "bg-emerald-500",
                )}
                style={{ width: `${tokenBudgetPercent}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p>Entries: {props.document.data.entries.length}</p>
            <p>
              Active:{" "}
              {props.document.data.entries.filter((entry) => entry.enabled).length}
            </p>
            <p>
              Constant:{" "}
              {props.document.data.entries.filter((entry) => entry.constant).length}
            </p>
            <p>
              Selective:{" "}
              {props.document.data.entries.filter((entry) => entry.selective).length}
            </p>
          </div>
        </div>

        <details className="rounded-md border bg-card/60 p-3">
          <summary className="cursor-pointer text-sm font-semibold">
            V3 JSON preview
          </summary>
          <div className="mt-3 flex justify-end">
            <CopyButton
              idleLabel="Copy JSON"
              textToCopy={props.serialized}
            />
          </div>
          <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">
            {props.serialized}
          </pre>
        </details>
      </section>
    </div>
  );
}

function EntryWarnings(props: {
  entry: LorebookV3Entry;
  totalEstimatedTokens: number;
}) {
  const warnings = [
    props.entry.content.length > ENTRY_CHARACTER_WARNING
      ? `Entry is ${props.entry.content.length} characters. Consider splitting it into smaller modular entries.`
      : null,
    props.totalEstimatedTokens > TOTAL_TOKEN_WARNING
      ? `Lorebook is about ${props.totalEstimatedTokens} tokens. Consider lowering the active token budget or splitting books by purpose.`
      : null,
  ].filter(Boolean);

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200">
      {warnings.map((warning) => (
        <p key={warning}>{warning}</p>
      ))}
    </div>
  );
}

function Field(props: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{props.label}</span>
      {props.children}
    </label>
  );
}

function Toggle(props: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition",
        props.checked
          ? "border-primary/50 bg-primary/10 text-foreground"
          : "border-border/70 bg-background/70 text-muted-foreground",
      )}
    >
      <span>{props.label}</span>
      <input
        checked={props.checked}
        className="accent-rose-600"
        onChange={(event) => props.onChange(event.currentTarget.checked)}
        type="checkbox"
      />
    </label>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberFromInput(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}
