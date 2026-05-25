"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { BookOpenText, Upload } from "lucide-react";

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
  createDuplicateArtifactId,
  createImportedLorebookArtifact,
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
import {
  ArtifactLibraryList,
  Field,
} from "./GenerationShell";

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
  const [activeLorebook, setActiveLorebook] =
    useState<GeneratedLorebookArtifact>(() => generateLorebookArtifact(defaultInput));
  const [activeDocument, setActiveDocument] = useState<LorebookV3Document>(() =>
    generatedLorebookArtifactToV3Document(generateLorebookArtifact(defaultInput)),
  );
  const [status, setStatus] = useState<string | null>(null);
  const library = useLorebookLibrary();
  const v3Document = activeDocument;
  const serialized = useMemo(
    () => serializeLorebookV3Document(v3Document),
    [v3Document],
  );
  const attribution = readLorebookAttribution(v3Document);

  function updateInput<K extends keyof LorebookGenerationInput>(
    key: K,
    value: LorebookGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    const nextLorebook = generateLorebookArtifact(input);
    const nextDocument = generatedLorebookArtifactToV3Document(nextLorebook);
    setActiveLorebook(nextLorebook);
    setActiveDocument(nextDocument);
    setStatus("Generated lorebook draft.");
  }

  async function save() {
    await saveLorebookLibraryItem({
      ...activeLorebook,
      title: v3Document.data.name ?? activeLorebook.title,
      updatedAt: Date.now(),
      v3Document,
    });
    await library.refresh();
    setStatus(`Saved ${v3Document.data.name ?? activeLorebook.title} to the lorebook library.`);
  }

  async function deleteActive() {
    await deleteLorebookLibraryItem(activeLorebook.id);
    await library.refresh();
    setStatus(`Deleted ${activeLorebook.title} from the lorebook library.`);
  }

  function duplicateActive() {
    const title = `${activeLorebook.title} Copy`;
    setActiveLorebook({
      ...activeLorebook,
      id: createDuplicateArtifactId("lorebook", title),
      title,
      updatedAt: Date.now(),
    });
    setActiveDocument({
      ...v3Document,
      data: {
        ...v3Document.data,
        name: title,
      },
    });
    setStatus(`Duplicated ${activeLorebook.title}. Save it when ready.`);
  }

  async function copy() {
    await navigator.clipboard.writeText(serialized);
    setStatus("Copied lorebook V3 JSON.");
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
      setStatus(
        `Imported ${document.data.name ?? file.name} with ${document.data.entries.length} entries. Review and save when ready.`,
      );
    } catch (caughtError) {
      setStatus(`Import failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="grid h-fit gap-5">
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
            <ArtifactLibraryList
              empty={library.loading ? "Loading lorebooks..." : "No saved lorebooks yet."}
              items={library.items}
              onSelect={(item) => {
                setActiveLorebook(item);
                setActiveDocument(
                  item.v3Document ?? generatedLorebookArtifactToV3Document(item),
                );
                setStatus(`Loaded ${item.title}.`);
              }}
            />
          </CardContent>
        </Card>
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
              <Button type="button" variant="outline" onClick={copy}>
                Copy
              </Button>
              <Button type="button" variant="outline" onClick={duplicateActive}>
                Duplicate
              </Button>
              <Button type="button" variant="outline" onClick={exportJson}>
                Export
              </Button>
              <Button type="button" variant="outline" onClick={deleteActive}>
                Delete
              </Button>
              <Button type="button" onClick={save}>
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
              onChange={(document) => {
                setActiveDocument(document);
                setStatus("Edited lorebook V3 draft. Save when ready.");
              }}
              serialized={serialized}
            />
            <section className="rounded-md border bg-background/70 p-4">
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
