"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import {
  Clipboard,
  CopyPlus,
  Download,
  FilePlus2,
  Save,
  Trash2,
  Upload,
  UserRound,
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
import { Textarea } from "@/components/ui/textarea";
import {
  artifactToJsonBytes,
  createBlankPersonaArtifact,
  createDuplicateArtifactId,
  createArtifactFileName,
  createImportedPersonaArtifact,
  createPersonaArtifactFromEditable,
  generatePersonaArtifact,
  type GeneratedPersonaArtifact,
  type PersonaGenerationInput,
} from "@/features/generation/workflows";
import {
  deletePersonaLibraryItem,
  savePersonaLibraryItem,
  type PersonaLibraryItem,
  usePersonaLibrary,
} from "@/hooks/usePersonaLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import {
  Field,
  GeneratorFormCard,
  GeneratorGrid,
} from "./GenerationShell";

const defaultInput: PersonaGenerationInput = {
  archetype: "Guarded romantic lead",
  boundaries: "Do not speak, decide, consent, or narrate internal thoughts for {{user}}.",
  emotionalNeed: "to feel chosen without losing independence",
  name: "Megan",
  playStyle: "Story roleplay",
  pointOfView: "FemPOV",
  tags: "slow burn, emotionally observant, consent-aware",
};

export function PersonaGenerationPage() {
  const [input, setInput] = useState(defaultInput);
  const [activePersona, setActivePersona] = useState<GeneratedPersonaArtifact>(
    () => generatePersonaArtifact(defaultInput),
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const library = usePersonaLibrary();

  const serialized = useMemo(
    () => JSON.stringify(activePersona, null, 2),
    [activePersona],
  );
  const isDirty = savedSnapshot !== serialized;

  function updateInput<K extends keyof PersonaGenerationInput>(
    key: K,
    value: PersonaGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setActivePersona(generatePersonaArtifact(input));
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Generated persona draft.");
  }

  function newBlankPersona() {
    setActivePersona(createBlankPersonaArtifact());
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Started a blank persona draft. Save when ready.");
  }

  async function save() {
    const saved = createPersonaArtifactFromEditable({
      ...activePersona,
      updatedAt: Date.now(),
    });
    await savePersonaLibraryItem(saved);
    setActivePersona(saved);
    await library.refresh();
    setSavedSnapshot(JSON.stringify(saved, null, 2));
    setDeleteArmed(false);
    setStatus(`Saved ${saved.name} to the persona library.`);
  }

  async function saveAsCopy() {
    const name = `${activePersona.name} Copy`;
    const copied = createPersonaArtifactFromEditable({
      ...activePersona,
      id: createDuplicateArtifactId("persona", name),
      name,
      updatedAt: Date.now(),
    });
    await savePersonaLibraryItem(copied);
    setActivePersona(copied);
    await library.refresh();
    setSavedSnapshot(JSON.stringify(copied, null, 2));
    setDeleteArmed(false);
    setStatus(`Saved ${name} as a separate persona.`);
  }

  async function deleteActive() {
    if (!deleteArmed) {
      setDeleteArmed(true);
      setStatus(`Press Confirm Delete to remove ${activePersona.name}.`);
      return;
    }

    await deletePersonaLibraryItem(activePersona.id);
    await library.refresh();
    const blank = createBlankPersonaArtifact();
    setActivePersona(blank);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Deleted ${activePersona.name} from the persona library.`);
  }

  function duplicateActive() {
    const name = `${activePersona.name} Copy`;
    setActivePersona(createPersonaArtifactFromEditable({
      ...activePersona,
      id: createDuplicateArtifactId("persona", name),
      name,
      updatedAt: Date.now(),
    }));
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Duplicated ${activePersona.name}. Save it when ready.`);
  }

  function loadPersona(item: PersonaLibraryItem) {
    const normalized = createPersonaArtifactFromEditable({
      id: item.id,
      name: item.name,
      prompt: item.prompt ?? `USER PERSONA: ${item.name}`,
      source: item.source ?? "generated",
      summary: item.summary ?? `${item.name} is the selected user persona.`,
      tags: item.tags,
      updatedAt: item.updatedAt,
    });
    setActivePersona(normalized);
    setSavedSnapshot(JSON.stringify(normalized, null, 2));
    setDeleteArmed(false);
    setStatus(`Loaded ${item.name}.`);
  }

  function editPersona(patch: Partial<Omit<GeneratedPersonaArtifact, "id" | "updatedAt">>) {
    setActivePersona((current) =>
      createPersonaArtifactFromEditable({
        ...current,
        ...patch,
        updatedAt: current.updatedAt,
      }),
    );
    setDeleteArmed(false);
    setStatus("Edited persona draft. Save when ready.");
  }

  async function copy() {
    await navigator.clipboard.writeText(serialized);
    setStatus("Copied persona JSON.");
  }

  function exportJson() {
    downloadUint8Array(
      artifactToJsonBytes(activePersona),
      createArtifactFileName(activePersona.name, ".persona.json"),
      "application/json",
    );
    setStatus("Exported persona JSON.");
  }

  async function importJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    try {
      const imported = createImportedPersonaArtifact(
        JSON.parse(await file.text()),
        file.name,
      );
      setActivePersona(imported);
      setSavedSnapshot(null);
      setDeleteArmed(false);
      setStatus(`Imported ${imported.name}. Review and save when ready.`);
    } catch (caughtError) {
      setStatus(`Import failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`);
    }
  }

  return (
    <GeneratorGrid>
      <aside className="grid h-fit gap-5">
        <GeneratorFormCard
          title="Persona Generator"
          description="Create saved user personas that drive chat POV, boundaries, and relationship interpretation."
        >
          <Field label="Persona name">
            <Input
              value={input.name}
              onChange={(event) => updateInput("name", event.currentTarget.value)}
            />
          </Field>
          <Field label="Archetype">
            <Input
              value={input.archetype}
              onChange={(event) =>
                updateInput("archetype", event.currentTarget.value)
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="POV">
              <select
                value={input.pointOfView}
                onChange={(event) =>
                  updateInput("pointOfView", event.currentTarget.value)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option>FemPOV</option>
                <option>MalePOV</option>
                <option>AnyPOV</option>
                <option>NBPOV</option>
              </select>
            </Field>
            <Field label="Play style">
              <select
                value={input.playStyle}
                onChange={(event) =>
                  updateInput("playStyle", event.currentTarget.value)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option>Story roleplay</option>
                <option>Open-ended chat</option>
                <option>Choice adventure</option>
                <option>Single scene</option>
              </select>
            </Field>
          </div>
          <Field label="Core emotional need">
            <Textarea
              value={input.emotionalNeed}
              onChange={(event) =>
                updateInput("emotionalNeed", event.currentTarget.value)
              }
            />
          </Field>
          <Field label="Boundaries">
            <Textarea
              value={input.boundaries}
              onChange={(event) =>
                updateInput("boundaries", event.currentTarget.value)
              }
            />
          </Field>
          <Field label="Tags">
            <Input
              value={input.tags}
              onChange={(event) => updateInput("tags", event.currentTarget.value)}
            />
          </Field>
          <Button type="button" onClick={generate}>
            <UserRound className="size-4" />
            Generate Persona
          </Button>
          <Button type="button" variant="outline" onClick={newBlankPersona}>
            <FilePlus2 className="size-4" />
            New Blank Persona
          </Button>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            <Upload className="size-4" />
            Import JSON
            <input
              accept=".json,.persona.json,application/json"
              className="sr-only"
              onChange={importJsonFile}
              type="file"
            />
          </label>
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </GeneratorFormCard>

        <GeneratorFormCard
          title={`Saved Personas (${library.metadata.totalCount})`}
          description="Load a saved persona into the editor."
        >
          <Input
            placeholder="Search saved personas..."
            value={library.query}
            onChange={(event) => library.setQuery(event.currentTarget.value)}
          />
          <PersonaLibraryList
            empty={library.loading ? "Loading personas..." : "No saved personas yet."}
            items={library.items}
            onSelect={loadPersona}
          />
        </GeneratorFormCard>
      </aside>

      <div className="grid gap-5">
        <Card className="bg-card/85">
          <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <CardTitle>{activePersona.name}</CardTitle>
              <CardDescription>{activePersona.summary}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant={isDirty ? "secondary" : "outline"}>
                  {isDirty ? "Unsaved changes" : "Saved"}
                </Badge>
                <Badge variant="outline">{formatSourceLabel(activePersona)}</Badge>
                <Badge variant="outline">
                  Updated {savedSnapshot ? formatDate(activePersona.updatedAt) : "Draft"}
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
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Saved name">
                <Input
                  value={activePersona.name}
                  onChange={(event) => editPersona({ name: event.currentTarget.value })}
                />
              </Field>
              <Field label="Tags">
                <Input
                  value={activePersona.tags.join(", ")}
                  onChange={(event) =>
                    editPersona({ tags: event.currentTarget.value.split(",").map((tag) => tag.trim()) })
                  }
                />
              </Field>
            </div>
            <Field label="Summary">
              <Textarea
                value={activePersona.summary}
                onChange={(event) =>
                  editPersona({ summary: event.currentTarget.value })
                }
              />
            </Field>
            <Field label="Persona prompt">
              <Textarea
                className="min-h-72 font-mono text-xs leading-5"
                value={activePersona.prompt}
                onChange={(event) =>
                  editPersona({ prompt: event.currentTarget.value })
                }
              />
            </Field>
            <section className="rounded-md border bg-background/70 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {activePersona.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-sm font-semibold">{activePersona.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {activePersona.summary}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Source: {formatSourceLabel(activePersona)} · updated{" "}
                {savedSnapshot ? formatDate(activePersona.updatedAt) : "Draft"}
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </GeneratorGrid>
  );
}

function PersonaLibraryList(props: {
  empty: string;
  items: PersonaLibraryItem[];
  onSelect: (item: PersonaLibraryItem) => void;
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
            <p className="font-medium">{item.name}</p>
            <Badge variant="outline">{formatSourceLabel(item)}</Badge>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            updated {formatDate(item.updatedAt)}
          </p>
          {item.summary ? (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {item.summary}
            </p>
          ) : null}
          {item.tags.length > 0 ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {item.tags.join(", ")}
            </p>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function formatSourceLabel(item: Pick<GeneratedPersonaArtifact, "source">) {
  if (item.source === "blank") {
    return "Blank draft";
  }

  if (item.source === "imported") {
    return "Imported";
  }

  return "Generated";
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 16).replace("T", " ");
}
