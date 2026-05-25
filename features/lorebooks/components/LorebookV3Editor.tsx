"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
  const [selectedEntryId, setSelectedEntryId] = useState<string | number | null>(
    () => props.document.data.entries[0]?.id ?? null,
  );
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
    <div className="grid gap-4">
      <section className="grid gap-4 rounded-md border bg-background/70 p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_10rem_10rem]">
          <Field label="Lorebook name">
            <Input
              value={props.document.data.name ?? ""}
              onChange={(event) => updateDocument({ name: event.currentTarget.value })}
            />
          </Field>
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
        </div>
        <Field label="Description">
          <Textarea
            rows={3}
            value={props.document.data.description ?? ""}
            onChange={(event) =>
              updateDocument({ description: event.currentTarget.value })
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            checked={props.document.data.recursive_scanning ?? false}
            onChange={(event) =>
              updateDocument({ recursive_scanning: event.currentTarget.checked })
            }
            type="checkbox"
          />
          Recursive scanning
        </label>
      </section>

      <section className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <div className="grid h-fit gap-3 rounded-md border bg-background/70 p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">
              Entries ({props.document.data.entries.length})
            </h3>
            <Button type="button" size="sm" variant="outline" onClick={addEntry}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          <div className="grid gap-2">
            {props.document.data.entries.map((entry) => (
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
                <div className="mt-2 flex gap-1">
                  {entry.constant ? <Badge variant="secondary">constant</Badge> : null}
                  {!entry.enabled ? <Badge variant="outline">disabled</Badge> : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedEntry ? (
          <div className="grid gap-4 rounded-md border bg-background/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">
                  {selectedEntry.name ?? "Untitled entry"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  ~{estimateTokens(selectedEntry.content)} tokens ·{" "}
                  {selectedEntry.content.length} chars
                </p>
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

            <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Order">
                  <Input
                    type="number"
                    value={selectedEntry.insertion_order}
                    onChange={(event) =>
                      updateSelectedEntry({
                        insertion_order:
                          numberFromInput(event.currentTarget.value) ?? 0,
                      })
                    }
                  />
                </Field>
                <Field label="Priority">
                  <Input
                    type="number"
                    value={selectedEntry.priority ?? 0}
                    onChange={(event) =>
                      updateSelectedEntry({
                        priority: numberFromInput(event.currentTarget.value),
                      })
                    }
                  />
                </Field>
              </div>
            </div>

            <Field label="Content">
              <Textarea
                rows={7}
                value={selectedEntry.content}
                onChange={(event) =>
                  updateSelectedEntry({ content: event.currentTarget.value })
                }
              />
            </Field>

            <div className="flex flex-wrap gap-4 rounded-md border bg-card/60 p-3 text-sm text-muted-foreground">
              <Toggle
                checked={selectedEntry.enabled}
                label="Enabled"
                onChange={(checked) => updateSelectedEntry({ enabled: checked })}
              />
              <Toggle
                checked={selectedEntry.constant}
                label="Always active"
                onChange={(checked) => updateSelectedEntry({ constant: checked })}
              />
              <Toggle
                checked={selectedEntry.use_regex}
                label="Use regex"
                onChange={(checked) => updateSelectedEntry({ use_regex: checked })}
              />
              <Toggle
                checked={selectedEntry.case_sensitive ?? false}
                label="Case sensitive"
                onChange={(checked) =>
                  updateSelectedEntry({ case_sensitive: checked })
                }
              />
              <Toggle
                checked={selectedEntry.selective ?? false}
                label="Require secondary key"
                onChange={(checked) => updateSelectedEntry({ selective: checked })}
              />
            </div>

            <EntryWarnings
              entry={selectedEntry}
              totalEstimatedTokens={totalEstimatedTokens}
            />
          </div>
        ) : (
          <div className="rounded-md border bg-background/70 p-4 text-sm text-muted-foreground">
            No entries yet. Add one to start building this lorebook.
          </div>
        )}
      </section>

      <details className="rounded-md border bg-background/70 p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          V3 JSON preview
        </summary>
        <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">
          {props.serialized}
        </pre>
      </details>
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
    <label className="flex items-center gap-2">
      <input
        checked={props.checked}
        onChange={(event) => props.onChange(event.currentTarget.checked)}
        type="checkbox"
      />
      {props.label}
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
