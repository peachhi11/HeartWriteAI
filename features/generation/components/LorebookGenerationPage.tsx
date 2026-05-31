"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import {
  BookOpenText,
  CopyPlus,
  Download,
  FilePlus2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import CopyButton from "@/components/copy-button";
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
  createBlankLorebookArtifact,
  createDuplicateArtifactId,
  createImportedLorebookArtifact,
  createLorebookArtifactFromV3Document,
  generateLorebookArtifact,
  type GeneratedLorebookArtifact,
  type LorebookGenerationInput,
} from "@/features/generation/workflows";
import {
  createLorebookV3ExportFileName,
  generatedLorebookArtifactToV3Document,
  importLorebookV3Json,
  serializeLorebookV3Document,
} from "@/features/lorebooks/adapters";
import { LoreTriggerTesterCard } from "@/features/lorebooks/components/LoreTriggerTesterCard";
import { LorebookV3Editor } from "@/features/lorebooks/components/LorebookV3Editor";
import type { LorebookV3Document } from "@/features/lorebooks/schema";
import {
  deleteLorebookLibraryItem,
  saveLorebookLibraryItem,
  useLorebookLibrary,
} from "@/hooks/useLorebookLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import type {
  OccupationProfessionalDomain,
  SpeciesType,
} from "@/lib/character-card/generator";
import { Field } from "./GenerationShell";

const speciesOptions: SpeciesType[] = [
  "Human",
  "Vampire",
  "Werewolf",
  "Fae",
  "Demon",
  "Angel",
  "Siren",
  "Wraith",
];

const professionalDomains: OccupationProfessionalDomain[] = [
  "Arts_Entertainment",
  "Corporate_Finance",
  "Medical_Science",
  "Security_Defense",
  "Underworld",
];

const defaultInput: LorebookGenerationInput = {
  jobTitle: "University Student",
  professionalDomain: "Corporate_Finance",
  speciesType: "Human",
  title: "Campus pressure canon",
  trope: "Academic rivals forced proximity",
};

export function LorebookGenerationPage() {
  const [input, setInput] = useState(defaultInput);
  const [activeLorebook, setActiveLorebook] = useState<GeneratedLorebookArtifact>(
    () => {
      const artifact = generateLorebookArtifact(defaultInput);
      return {
        ...artifact,
        v3Document: generatedLorebookArtifactToV3Document(artifact),
      };
    },
  );
  const [activeDocument, setActiveDocument] = useState<LorebookV3Document>(
    () => activeLorebook.v3Document ?? generatedLorebookArtifactToV3Document(activeLorebook),
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const library = useLorebookLibrary();
  const v3Document = activeDocument;
  const serialized = useMemo(
    () => serializeLorebookV3Document(v3Document),
    [v3Document],
  );
  const attribution = readLorebookAttribution(v3Document);
  const isDirty = savedSnapshot !== serialized;
  const activeEntryCount = v3Document.data.entries.filter((entry) => entry.enabled).length;
  const totalEstimatedTokens = estimateLorebookTokens(v3Document);

  function updateInput<K extends keyof LorebookGenerationInput>(
    key: K,
    value: LorebookGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    const nextLorebook = generateLorebookArtifact(input);
    const nextDocument = generatedLorebookArtifactToV3Document(nextLorebook);
    setActiveLorebook({
      ...nextLorebook,
      v3Document: nextDocument,
    });
    setActiveDocument(nextDocument);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Generated lorebook draft.");
  }

  function newBlankLorebook() {
    const artifact = createBlankLorebookArtifact();
    const document = artifact.v3Document ?? generatedLorebookArtifactToV3Document(artifact);
    setActiveLorebook(artifact);
    setActiveDocument(document);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Started a blank lorebook draft. Save when ready.");
  }

  async function save() {
    const saved = createLorebookArtifactFromV3Document({
      document: v3Document,
      id: activeLorebook.id,
      source: activeLorebook.source ?? "generated",
    });
    await saveLorebookLibraryItem(saved);
    setActiveLorebook(saved);
    await library.refresh();
    setSavedSnapshot(serializeLorebookV3Document(saved.v3Document ?? v3Document));
    setDeleteArmed(false);
    setStatus(`Saved ${saved.title} to the lorebook library.`);
  }

  async function saveAsCopy() {
    const title = `${v3Document.data.name ?? activeLorebook.title} Copy`;
    const copiedDocument = {
      ...v3Document,
      data: {
        ...v3Document.data,
        name: title,
      },
    };
    const copied = createLorebookArtifactFromV3Document({
      document: copiedDocument,
      id: createDuplicateArtifactId("lorebook", title),
      source: activeLorebook.source ?? "generated",
    });
    await saveLorebookLibraryItem(copied);
    setActiveLorebook(copied);
    setActiveDocument(copied.v3Document ?? copiedDocument);
    await library.refresh();
    setSavedSnapshot(serializeLorebookV3Document(copied.v3Document ?? copiedDocument));
    setDeleteArmed(false);
    setStatus(`Saved ${title} as a separate lorebook.`);
  }

  async function deleteActive() {
    if (!deleteArmed) {
      setDeleteArmed(true);
      setStatus(`Press Confirm Delete to remove ${activeLorebook.title}.`);
      return;
    }

    await deleteLorebookLibraryItem(activeLorebook.id);
    await library.refresh();
    const blank = createBlankLorebookArtifact();
    const document = blank.v3Document ?? generatedLorebookArtifactToV3Document(blank);
    setActiveLorebook(blank);
    setActiveDocument(document);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Deleted ${activeLorebook.title} from the lorebook library.`);
  }

  function duplicateActive() {
    const title = `${activeLorebook.title} Copy`;
    const document = {
      ...v3Document,
      data: {
        ...v3Document.data,
        name: title,
      },
    };
    setActiveLorebook(createLorebookArtifactFromV3Document({
      document,
      id: createDuplicateArtifactId("lorebook", title),
      source: activeLorebook.source ?? "generated",
    }));
    setActiveDocument(document);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Duplicated ${activeLorebook.title}. Save it when ready.`);
  }

  function loadLorebook(item: GeneratedLorebookArtifact) {
    const document = item.v3Document ?? generatedLorebookArtifactToV3Document(item);
    const normalizedItem = {
      ...item,
      v3Document: document,
    };
    setActiveLorebook(normalizedItem);
    setActiveDocument(document);
    setSavedSnapshot(serializeLorebookV3Document(document));
    setDeleteArmed(false);
    setStatus(`Loaded ${item.title}.`);
  }

  function editDocument(document: LorebookV3Document) {
    setActiveDocument(document);
    setDeleteArmed(false);
    setActiveLorebook((current) => ({
      ...current,
      title: document.data.name ?? current.title,
      v3Document: document,
    }));
    setStatus("Edited lorebook V3 draft. Save when ready.");
  }

  function updateLoadedDocumentFromName(name: string) {
    editDocument({
      ...v3Document,
      data: {
        ...v3Document.data,
        name,
      },
    });
  }

  function exportJson() {
    downloadUint8Array(
      new TextEncoder().encode(serialized),
      createLorebookV3ExportFileName(v3Document.data.name),
      "application/json",
    );
    setStatus("Exported lorebook V3 JSON.");
  }

  async function importJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const document = importLorebookV3Json(text, file.name);
      const artifact = createImportedLorebookArtifact(document, file.name);
      setActiveLorebook(artifact);
      setActiveDocument(document);
      setSavedSnapshot(null);
      setDeleteArmed(false);
      setStatus(
        `Imported ${document.data.name ?? file.name} with ${document.data.entries.length} entries. Review and save when ready.`,
      );
    } catch (caughtError) {
      setStatus(`Import failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="grid max-h-[calc(100vh-8rem)] gap-5 overflow-y-auto pr-1 xl:sticky xl:top-24">
        <Card className="bg-card/85">
          <CardHeader>
            <CardTitle>World Generation</CardTitle>
            <CardDescription>
              Generate a modular draft, then edit every field before saving.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="Lorebook title">
              <Input
                value={input.title}
                onChange={(event) => updateInput("title", event.currentTarget.value)}
              />
            </Field>
            <Field label="Trope / world pressure">
              <Input
                value={input.trope}
                onChange={(event) => updateInput("trope", event.currentTarget.value)}
              />
            </Field>
            <Field label="Species baseline">
              <select
                value={input.speciesType}
                onChange={(event) =>
                  updateInput("speciesType", event.currentTarget.value as SpeciesType)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                {speciesOptions.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Professional domain">
              <select
                value={input.professionalDomain}
                onChange={(event) =>
                  updateInput(
                    "professionalDomain",
                    event.currentTarget.value as OccupationProfessionalDomain,
                  )
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                {professionalDomains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Occupation / role">
              <Input
                value={input.jobTitle}
                onChange={(event) =>
                  updateInput("jobTitle", event.currentTarget.value)
                }
              />
            </Field>
            <Button type="button" onClick={generate}>
              <BookOpenText className="size-4" />
              Generate World
            </Button>
            <Button type="button" variant="outline" onClick={newBlankLorebook}>
              <FilePlus2 className="size-4" />
              New Blank Lorebook
            </Button>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
              <Upload className="size-4" />
              Import JSON
              <input
                accept=".json,application/json"
                className="sr-only"
                onChange={importJsonFile}
                type="file"
              />
            </label>
            {status ? (
              <p className="text-sm text-muted-foreground">{status}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-card/85">
          <CardHeader>
            <CardTitle>Saved Lorebooks ({library.totalCount})</CardTitle>
            <CardDescription>
              Load a saved lorebook into the editor.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              placeholder="Search saved lorebooks..."
              value={library.query}
              onChange={(event) => library.setQuery(event.currentTarget.value)}
            />
            <LorebookLibraryList
              empty={library.loading ? "Loading lorebooks..." : "No saved lorebooks yet."}
              items={library.items}
              onSelect={loadLorebook}
            />
          </CardContent>
        </Card>

        <LoreTriggerTesterCard lorebooks={[activeLorebook]} />
      </aside>

      <main className="grid gap-5">
        <Card className="bg-card/85">
          <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <CardTitle>{v3Document.data.name ?? activeLorebook.title}</CardTitle>
              <CardDescription>
                {v3Document.data.description ??
                  activeLorebook.summary.aiLoreInstruction}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant={isDirty ? "secondary" : "outline"}>
                  {isDirty ? "Unsaved changes" : "Saved"}
                </Badge>
                <Badge variant="outline">{formatSourceLabel(activeLorebook)}</Badge>
                <Badge variant="outline">{v3Document.data.entries.length} entries</Badge>
                <Badge variant="outline">{activeEntryCount} active</Badge>
                <Badge variant={totalEstimatedTokens > 1200 ? "secondary" : "outline"}>
                  ~{totalEstimatedTokens} tokens
                </Badge>
              </div>
              {attribution ? (
                <p className="text-xs text-muted-foreground">
                  Credit: {attribution.title ? `${attribution.title} by ` : ""}
                  <a
                    className="font-medium underline underline-offset-4"
                    href={attribution.authorProfileUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {attribution.authorName}
                  </a>
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <CopyButton
                textToCopy={serialized}
                onCopied={() => setStatus("Copied lorebook V3 JSON.")}
              />
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
            <div className="flex flex-wrap gap-2">
              {activeLorebook.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <LorebookV3Editor
              document={v3Document}
              onChange={editDocument}
              serialized={serialized}
            />
            <section className="rounded-md border bg-background/70 p-4">
              <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                <Field label="Saved title">
                  <Input
                    value={v3Document.data.name ?? ""}
                    onChange={(event) =>
                      updateLoadedDocumentFromName(event.currentTarget.value)
                    }
                  />
                </Field>
                <div className="rounded-md border bg-card/60 p-3 text-xs text-muted-foreground">
                  <p>Source: {formatSourceLabel(activeLorebook)}</p>
                  <p>Updated: {savedSnapshot ? formatDate(activeLorebook.updatedAt) : "Draft"}</p>
                  {attribution ? <p>Credit: {attribution.authorName}</p> : null}
                </div>
              </div>
              <h3 className="mb-2 text-sm font-semibold">
                {v3Document.data.name ?? activeLorebook.summary.universeAnchor}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {v3Document.data.description ??
                  activeLorebook.summary.factionOrDynastyContext}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                V3 export: scan_depth {v3Document.data.scan_depth ?? "auto"} ·
                token_budget {v3Document.data.token_budget ?? "auto"} · entries{" "}
                {v3Document.data.entries.length}
              </p>
            </section>
            <div className="grid gap-3">
              {v3Document.data.entries.map((entry) => (
                <section
                  key={String(entry.id ?? entry.insertion_order)}
                  className="rounded-md border bg-background/70 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">
                      {entry.name ?? `Entry ${entry.insertion_order + 1}`}
                    </h3>
                    {entry.constant ? <Badge variant="secondary">constant</Badge> : null}
                    {!entry.enabled ? <Badge variant="outline">disabled</Badge> : null}
                    {entry.use_regex ? <Badge variant="outline">regex</Badge> : null}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {entry.content}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Keys: {entry.keys.join(", ")}
                  </p>
                </section>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function LorebookLibraryList(props: {
  empty: string;
  items: GeneratedLorebookArtifact[];
  onSelect: (item: GeneratedLorebookArtifact) => void;
}) {
  if (props.items.length === 0) {
    return <p className="text-sm text-muted-foreground">{props.empty}</p>;
  }

  return (
    <div className="grid gap-2">
      {props.items.slice(0, 10).map((item) => {
        const document = item.v3Document;
        const attribution = document ? readLorebookAttribution(document) : null;
        const entryCount = document?.data.entries.length ?? item.entries.length;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => props.onSelect(item)}
            className="rounded-md border bg-background/70 p-3 text-left transition hover:bg-muted"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{item.title}</p>
              <Badge variant="outline">{entryCount}</Badge>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {formatSourceLabel(item)} · updated {formatDate(item.updatedAt)}
            </p>
            {attribution ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                Credit: {attribution.title ? `${attribution.title} by ` : ""}
                {attribution.authorName}
              </p>
            ) : null}
            {item.tags.length > 0 ? (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {item.tags.join(", ")}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function readLorebookAttribution(document: LorebookV3Document) {
  const heartwriteai = document.data.extensions.heartwriteai;
  if (!isRecord(heartwriteai)) {
    return null;
  }

  const attribution = heartwriteai.attribution;
  if (!isRecord(attribution)) {
    return null;
  }

  const authorName = readString(attribution.authorName);
  const authorProfileUrl = readString(attribution.authorProfileUrl);
  if (!authorName || !authorProfileUrl) {
    return null;
  }

  return {
    authorName,
    authorProfileUrl,
    title: readString(attribution.title),
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function formatSourceLabel(item: GeneratedLorebookArtifact) {
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

function estimateLorebookTokens(document: LorebookV3Document) {
  return document.data.entries.reduce(
    (total, entry) => total + Math.max(1, Math.ceil(entry.content.length / 4)),
    0,
  );
}
