"use client";

import { useMemo, useState } from "react";
import { PackageCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  artifactToJsonBytes,
  createArtifactFileName,
  createDuplicateArtifactId,
  createRuntimeBundleArtifact,
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
import {
  ArtifactLibraryList,
  Field,
  GeneratorFormCard,
  GeneratorGrid,
  GeneratorResultCard,
} from "./GenerationShell";

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

  function createBundle() {
    if (!canCreateBundle) {
      setStatus("Choose at least one saved artifact before creating a bundle.");
      return;
    }

    setActiveBundle(
      createRuntimeBundleArtifact({
        lorebook: selectedLorebook,
        persona: selectedPersona,
        scenario: selectedScenario,
        title,
      }),
    );
    setStatus("Created runtime bundle preview.");
  }

  async function save() {
    if (!activeBundle) {
      return;
    }

    await saveRuntimeBundleLibraryItem(activeBundle);
    await bundles.refresh();
    setStatus(`Saved ${activeBundle.title} to runtime bundles.`);
  }

  async function deleteActive() {
    if (!activeBundle) {
      return;
    }

    await deleteRuntimeBundleLibraryItem(activeBundle.id);
    await bundles.refresh();
    setStatus(`Deleted ${activeBundle.title} from runtime bundles.`);
  }

  function duplicateActive() {
    if (!activeBundle) {
      return;
    }

    const duplicateTitle = `${activeBundle.title} Copy`;
    setActiveBundle({
      ...activeBundle,
      id: createDuplicateArtifactId("bundle", duplicateTitle),
      title: duplicateTitle,
      updatedAt: Date.now(),
    });
    setStatus(`Duplicated ${activeBundle.title}. Save it when ready.`);
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

  return (
    <GeneratorGrid>
      <GeneratorFormCard
        title="Bundle Selection"
        description="Choose saved persona, scenario, and lorebook records before the chat runtime consumes them."
      >
        <Field label="Bundle title">
          <Input
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
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
        <LibraryStatus
          loading={personas.loading || scenarios.loading || lorebooks.loading}
          errors={[personas.error, scenarios.error, lorebooks.error].filter(Boolean)}
          status={status}
        />
      </GeneratorFormCard>

      <div className="grid gap-5">
        {activeBundle ? (
          <GeneratorResultCard
            title={activeBundle.title}
            description="Prepared runtime context for a selected persona, scenario, and lorebook."
            onCopy={copy}
            onDelete={deleteActive}
            onDuplicate={duplicateActive}
            onExport={exportJson}
            onSave={save}
            saveLabel="Save Bundle"
          >
            <div className="flex flex-wrap gap-2">
              {activeBundle.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <BundleSlot label="Persona" value={activeBundle.persona?.name} />
              <BundleSlot label="Scenario" value={activeBundle.scenario?.title} />
              <BundleSlot label="Lorebook" value={activeBundle.lorebook?.title} />
            </div>
            <pre className="max-h-[32rem] overflow-auto rounded-md border bg-background/70 p-4 text-xs leading-relaxed text-muted-foreground">
              {activeBundle.compiledContext}
            </pre>
          </GeneratorResultCard>
        ) : (
          <GeneratorFormCard
            title="Runtime Preview"
            description="Create a bundle to preview the compiled context that future chat sessions will receive."
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
          <ArtifactLibraryList
            empty={bundles.loading ? "Loading bundles..." : "No saved bundles yet."}
            items={bundles.items}
            onSelect={(item) => {
              setActiveBundle(item);
              setStatus(`Loaded ${item.title}.`);
            }}
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
