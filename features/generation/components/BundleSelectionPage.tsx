"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import {
  Clipboard,
  CopyPlus,
  Download,
  PackageCheck,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  artifactToJsonBytes,
  createArtifactFileName,
  createDuplicateArtifactId,
  createImportedRuntimeBundleArtifact,
  createRuntimeBundleArtifact,
  createRuntimeBundleArtifactFromEditable,
  type RuntimeBundleArtifact,
} from "@/features/generation/workflows";
import { useLorebookLibrary } from "@/hooks/useLorebookLibrary";
import { usePersonaLibrary } from "@/hooks/usePersonaLibrary";
import {
  deleteRuntimeBundleLibraryItem,
  saveRuntimeBundleLibraryItem,
  useRuntimeBundleLibrary,
} from "@/hooks/useRuntimeBundleLibrary";
import { useScenarioLibrary } from "@/hooks/useScenarioLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import { Field, GeneratorFormCard, GeneratorGrid } from "./GenerationShell";

export function BundleSelectionPage() {
  const personas = usePersonaLibrary();
  const scenarios = useScenarioLibrary();
  const lorebooks = useLorebookLibrary();
  const bundles = useRuntimeBundleLibrary();
  const [title, setTitle] = useState("Current Story Runtime");
  const [personaId, setPersonaId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [lorebookId, setLorebookId] = useState("");
  const [activeBundle, setActiveBundle] = useState<RuntimeBundleArtifact | null>(
    null,
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const selectedPersona = useMemo(
    () => personas.items.find((item) => item.id === personaId) ?? null,
    [personaId, personas.items],
  );
  const selectedScenario = useMemo(
    () => scenarios.items.find((item) => item.id === scenarioId) ?? null,
    [scenarioId, scenarios.items],
  );
  const selectedLorebook = useMemo(
    () => lorebooks.items.find((item) => item.id === lorebookId) ?? null,
    [lorebookId, lorebooks.items],
  );
  const canCreateBundle = Boolean(
    selectedPersona || selectedScenario || selectedLorebook,
  );
  const serialized = useMemo(
    () => JSON.stringify(activeBundle, null, 2),
    [activeBundle],
  );
  const isDirty = activeBundle ? savedSnapshot !== serialized : false;

  function createBundle() {
    if (!canCreateBundle) {
      setStatus("Choose at least one saved artifact before creating a bundle.");
      return;
    }

    const bundle = createRuntimeBundleArtifact({
      lorebook: selectedLorebook,
      persona: selectedPersona,
      scenario: selectedScenario,
      title,
    });

    setActiveBundle(bundle);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Created runtime bundle preview.");
  }

  async function save() {
    if (!activeBundle) {
      return;
    }

    const saved = createRuntimeBundleArtifactFromEditable({
      ...activeBundle,
      updatedAt: Date.now(),
    });
    await saveRuntimeBundleLibraryItem(saved);
    setActiveBundle(saved);
    await bundles.refresh();
    setSavedSnapshot(JSON.stringify(saved, null, 2));
    setDeleteArmed(false);
    setStatus(`Saved ${saved.title} to runtime bundles.`);
  }

  async function saveAsCopy() {
    if (!activeBundle) {
      return;
    }

    const copyTitle = `${activeBundle.title} Copy`;
    const copy = createRuntimeBundleArtifactFromEditable({
      ...activeBundle,
      id: createDuplicateArtifactId("bundle", copyTitle),
      title: copyTitle,
      updatedAt: Date.now(),
    });

    await saveRuntimeBundleLibraryItem(copy);
    setActiveBundle(copy);
    await bundles.refresh();
    setSavedSnapshot(JSON.stringify(copy, null, 2));
    setDeleteArmed(false);
    setStatus(`Saved ${copyTitle} as a separate runtime bundle.`);
  }

  async function deleteActive() {
    if (!activeBundle) {
      return;
    }

    if (!deleteArmed) {
      setDeleteArmed(true);
      setStatus(`Press Confirm Delete to remove ${activeBundle.title}.`);
      return;
    }

    await deleteRuntimeBundleLibraryItem(activeBundle.id);
    await bundles.refresh();
    setActiveBundle(null);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Deleted ${activeBundle.title} from runtime bundles.`);
  }

  function duplicateActive() {
    if (!activeBundle) {
      return;
    }

    const duplicateTitle = `${activeBundle.title} Copy`;
    setActiveBundle(
      createRuntimeBundleArtifactFromEditable({
        ...activeBundle,
        id: createDuplicateArtifactId("bundle", duplicateTitle),
        title: duplicateTitle,
        updatedAt: Date.now(),
      }),
    );
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Duplicated ${activeBundle.title}. Save it when ready.`);
  }

  function loadBundle(item: RuntimeBundleArtifact) {
    const normalized = createRuntimeBundleArtifactFromEditable(item);
    setActiveBundle(normalized);
    setTitle(normalized.title);
    setPersonaId(normalized.persona?.id ?? "");
    setScenarioId(normalized.scenario?.id ?? "");
    setLorebookId(normalized.lorebook?.id ?? "");
    setSavedSnapshot(JSON.stringify(normalized, null, 2));
    setDeleteArmed(false);
    setStatus(`Loaded ${normalized.title}.`);
  }

  function editBundleTitle(value: string) {
    setTitle(value);
    setActiveBundle((current) =>
      current
        ? createRuntimeBundleArtifactFromEditable({
            ...current,
            title: value,
            updatedAt: current.updatedAt,
          })
        : current,
    );
    setDeleteArmed(false);
    setStatus("Edited runtime bundle draft. Save when ready.");
  }

  async function copy() {
    if (!activeBundle) {
      return;
    }

    await navigator.clipboard.writeText(serialized);
    setStatus("Copied runtime bundle JSON.");
  }

  function exportJson() {
    if (!activeBundle) {
      return;
    }

    downloadUint8Array(
      artifactToJsonBytes(activeBundle),
      createArtifactFileName(activeBundle.title, ".bundle.json"),
      "application/json",
    );
    setStatus("Exported runtime bundle JSON.");
  }

  async function importJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    try {
      const imported = createImportedRuntimeBundleArtifact(
        JSON.parse(await file.text()),
        file.name,
      );
      setActiveBundle(imported);
      setTitle(imported.title);
      setPersonaId(imported.persona?.id ?? "");
      setScenarioId(imported.scenario?.id ?? "");
      setLorebookId(imported.lorebook?.id ?? "");
      setSavedSnapshot(null);
      setDeleteArmed(false);
      setStatus(`Imported ${imported.title}. Review and save when ready.`);
    } catch (caughtError) {
      setStatus(`Import failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`);
    }
  }

  return (
    <GeneratorGrid>
      <aside className="grid h-fit gap-5">
        <GeneratorFormCard
          title="Bundle Selection"
          description="Choose saved persona, scenario, and lorebook records before the chat runtime consumes them."
        >
          <Field label="Bundle title">
            <Input
              value={title}
              onChange={(event) => {
                if (activeBundle) {
                  editBundleTitle(event.currentTarget.value);
                  return;
                }

                setTitle(event.currentTarget.value);
              }}
            />
          </Field>
          <Field label={`Saved persona (${personas.metadata.totalCount})`}>
            <ArtifactSelect
              emptyLabel="No persona selected"
              items={personas.items}
              labelForItem={(item) => item.name}
              value={personaId}
              onChange={setPersonaId}
            />
          </Field>
          <Field label={`Saved scenario (${scenarios.totalCount})`}>
            <ArtifactSelect
              emptyLabel="No scenario selected"
              items={scenarios.items}
              labelForItem={(item) => item.title}
              value={scenarioId}
              onChange={setScenarioId}
            />
          </Field>
          <Field label={`Saved lorebook (${lorebooks.totalCount})`}>
            <ArtifactSelect
              emptyLabel="No lorebook selected"
              items={lorebooks.items}
              labelForItem={(item) => item.title}
              value={lorebookId}
              onChange={setLorebookId}
            />
          </Field>
          <Button type="button" disabled={!canCreateBundle} onClick={createBundle}>
            <PackageCheck className="size-4" />
            Create Bundle
          </Button>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            <Upload className="size-4" />
            Import Bundle JSON
            <input
              accept=".json,.bundle.json,application/json"
              className="sr-only"
              onChange={importJsonFile}
              type="file"
            />
          </label>
          <LibraryStatus
            errors={[personas.error, scenarios.error, lorebooks.error].filter(Boolean)}
            loading={personas.loading || scenarios.loading || lorebooks.loading}
            status={status}
          />
        </GeneratorFormCard>

        <GeneratorFormCard
          title="Current Selections"
          description="Bundles package selected records; they do not expose the hidden runtime engine."
        >
          <SelectionSummary label="Persona" item={selectedPersona} type="persona" />
          <SelectionSummary label="Scenario" item={selectedScenario} type="scenario" />
          <SelectionSummary label="Lorebook" item={selectedLorebook} type="lorebook" />
        </GeneratorFormCard>
      </aside>

      <div className="grid gap-5">
        {activeBundle ? (
          <Card className="bg-card/85">
            <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1.5">
                <CardTitle>{activeBundle.title}</CardTitle>
                <CardDescription>
                  Prepared runtime context for selected saved artifacts.
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={isDirty ? "secondary" : "outline"}>
                    {isDirty ? "Unsaved changes" : "Saved"}
                  </Badge>
                  <Badge variant="outline">{formatSourceLabel(activeBundle)}</Badge>
                  <Badge variant="outline">
                    Updated {savedSnapshot ? formatDate(activeBundle.updatedAt) : "Draft"}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={copy}>
                  <Clipboard className="size-4" />
                  Copy
                </Button>
                <Button type="button" variant="outline" onClick={duplicateActive}>
                  <CopyPlus className="size-4" />
                  Duplicate Draft
                </Button>
                <Button type="button" variant="outline" onClick={saveAsCopy}>
                  <Save className="size-4" />
                  Save As
                </Button>
                <Button type="button" variant="outline" onClick={exportJson}>
                  <Download className="size-4" />
                  Export
                </Button>
                <Button
                  type="button"
                  variant={deleteArmed ? "destructive" : "outline"}
                  onClick={deleteActive}
                >
                  <Trash2 className="size-4" />
                  {deleteArmed ? "Confirm Delete" : "Delete"}
                </Button>
                <Button type="button" onClick={save}>
                  <Save className="size-4" />
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-3">
                <BundleSlot label="Persona" value={activeBundle.persona?.name} />
                <BundleSlot label="Scenario" value={activeBundle.scenario?.title} />
                <BundleSlot label="Lorebook" value={activeBundle.lorebook?.title} />
              </div>
              <div className="flex flex-wrap gap-2">
                {activeBundle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <section className="rounded-md border bg-background/70 p-4">
                <h3 className="mb-2 text-sm font-semibold">Compiled Context</h3>
                <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                  {activeBundle.compiledContext}
                </pre>
              </section>
            </CardContent>
          </Card>
        ) : (
          <GeneratorFormCard
            title="Runtime Preview"
            description="Create or import a bundle to preview the compiled context that future chat sessions will receive."
          >
            <p className="text-sm text-muted-foreground">
              Bundles are saved selections, not editable engines. They package
              generated libraries into a readable runtime context.
            </p>
          </GeneratorFormCard>
        )}

        <GeneratorFormCard
          title={`Saved Bundles (${bundles.totalCount})`}
          description="Reload a saved bundle for export, duplication, or future chat handoff."
        >
          <Input
            placeholder="Search saved bundles..."
            value={bundles.query}
            onChange={(event) => bundles.setQuery(event.currentTarget.value)}
          />
          <BundleLibraryList
            empty={bundles.loading ? "Loading bundles..." : "No saved bundles yet."}
            items={bundles.items}
            onSelect={loadBundle}
          />
        </GeneratorFormCard>
      </div>
    </GeneratorGrid>
  );
}

function ArtifactSelect<T extends { id: string }>(props: {
  emptyLabel: string;
  items: T[];
  labelForItem: (item: T) => string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <select
      value={props.value}
      onChange={(event) => props.onChange(event.currentTarget.value)}
      className="h-10 rounded-md border bg-background px-3 text-sm"
    >
      <option value="">{props.emptyLabel}</option>
      {props.items.map((item) => (
        <option key={item.id} value={item.id}>
          {props.labelForItem(item)}
        </option>
      ))}
    </select>
  );
}

function BundleLibraryList(props: {
  empty: string;
  items: RuntimeBundleArtifact[];
  onSelect: (item: RuntimeBundleArtifact) => void;
}) {
  if (props.items.length === 0) {
    return <p className="text-sm text-muted-foreground">{props.empty}</p>;
  }

  return (
    <div className="grid gap-2">
      {props.items.slice(0, 10).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => props.onSelect(item)}
          className="rounded-md border bg-background/70 p-3 text-left transition hover:bg-muted"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{item.title}</p>
            <Badge variant="outline">{formatSourceLabel(item)}</Badge>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            updated {formatDate(item.updatedAt)}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {[item.persona?.name, item.scenario?.title, item.lorebook?.title]
              .filter(Boolean)
              .join(" + ") || "Partial runtime bundle"}
          </p>
        </button>
      ))}
    </div>
  );
}

function BundleSlot(props: { label: string; value?: string }) {
  return (
    <div className="rounded-md border bg-background/70 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {props.label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">
        {props.value ?? "Not selected"}
      </p>
    </div>
  );
}

function SelectionSummary(props: {
  item: SelectionSummaryItem | null;
  label: string;
  type: "persona" | "scenario" | "lorebook";
}) {
  if (!props.item) {
    return (
      <section className="rounded-md border bg-background/70 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {props.label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Not selected</p>
      </section>
    );
  }

  return (
    <section className="rounded-md border bg-background/70 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {props.label}
      </p>
      <p className="mt-1 font-medium">{getSelectionTitle(props.item, props.type)}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
        {getSelectionSummary(props.item, props.type)}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {props.item.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </section>
  );
}

type SelectionSummaryItem = {
  name?: string;
  title?: string;
  summary?: string | {
    aiLoreInstruction?: string;
  };
  tags: string[];
};

function LibraryStatus(props: {
  errors: (string | null)[];
  loading: boolean;
  status: string | null;
}) {
  if (props.errors.length > 0) {
    return (
      <p className="text-sm text-destructive">
        {props.errors.filter(Boolean).join(" ")}
      </p>
    );
  }

  if (props.status) {
    return <p className="text-sm text-muted-foreground">{props.status}</p>;
  }

  if (props.loading) {
    return <p className="text-sm text-muted-foreground">Loading libraries...</p>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Generate and save source records first if a selector is empty.
    </p>
  );
}

function formatSourceLabel(item: Pick<RuntimeBundleArtifact, "source">) {
  if (item.source === "imported") {
    return "Imported";
  }

  return "Created";
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 16).replace("T", " ");
}

function getSelectionTitle(
  item: SelectionSummaryItem,
  type: "persona" | "scenario" | "lorebook",
) {
  if (type === "persona") {
    return item.name ?? "Untitled persona";
  }

  return item.title ?? "Untitled";
}

function getSelectionSummary(
  item: SelectionSummaryItem,
  type: "persona" | "scenario" | "lorebook",
) {
  if (type === "lorebook") {
    return typeof item.summary === "object"
      ? item.summary.aiLoreInstruction ?? "Selected lorebook."
      : item.summary ?? "Selected lorebook.";
  }

  return typeof item.summary === "string"
    ? item.summary
    : "Selected artifact.";
}
