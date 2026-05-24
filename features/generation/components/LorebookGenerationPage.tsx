"use client";

import { useMemo, useState } from "react";
import { BookOpenText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  artifactToJsonBytes,
  createArtifactFileName,
  generateLorebookArtifact,
  type GeneratedLorebookArtifact,
  type LorebookGenerationInput,
} from "@/features/generation/workflows";
import {
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
  GeneratorFormCard,
  GeneratorGrid,
  GeneratorResultCard,
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
  const [status, setStatus] = useState<string | null>(null);
  const library = useLorebookLibrary();
  const serialized = useMemo(
    () => JSON.stringify(activeLorebook, null, 2),
    [activeLorebook],
  );

  function updateInput<K extends keyof LorebookGenerationInput>(
    key: K,
    value: LorebookGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setActiveLorebook(generateLorebookArtifact(input));
    setStatus("Generated lorebook draft.");
  }

  async function save() {
    await saveLorebookLibraryItem(activeLorebook);
    await library.refresh();
    setStatus(`Saved ${activeLorebook.title} to the lorebook library.`);
  }

  async function copy() {
    await navigator.clipboard.writeText(serialized);
    setStatus("Copied lorebook JSON.");
  }

  function exportJson() {
    downloadUint8Array(
      artifactToJsonBytes(activeLorebook),
      createArtifactFileName(activeLorebook.title, ".lorebook.json"),
      "application/json",
    );
    setStatus("Exported lorebook JSON.");
  }

  return (
    <GeneratorGrid>
      <GeneratorFormCard
        title="Lorebook Generator"
        description="Generate scoped world rules, activation keys, placeholders, and lore entries for character/scenario runtime."
      >
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
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
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
          Generate Lorebook
        </Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </GeneratorFormCard>

      <div className="grid gap-5">
        <GeneratorResultCard
          title={activeLorebook.title}
          description={activeLorebook.summary.aiLoreInstruction}
          onCopy={copy}
          onExport={exportJson}
          onSave={save}
          saveLabel="Save Lorebook"
        >
          <div className="flex flex-wrap gap-2">
            {activeLorebook.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <section className="rounded-md border bg-background/70 p-4">
            <h3 className="mb-2 text-sm font-semibold">
              {activeLorebook.summary.universeAnchor}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {activeLorebook.summary.factionOrDynastyContext}
            </p>
          </section>
          <div className="grid gap-3">
            {activeLorebook.entries.map((entry) => (
              <section
                key={entry.entryId}
                className="rounded-md border bg-background/70 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{entry.title}</h3>
                  <Badge variant="outline">{entry.domainScope}</Badge>
                  <Badge variant="secondary">{entry.insertionPriority}</Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {entry.entryContent}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Keys: {entry.activationKeys.join(", ")}
                </p>
              </section>
            ))}
          </div>
        </GeneratorResultCard>

        <GeneratorFormCard
          title={`Saved Lorebooks (${library.totalCount})`}
          description="Load a saved lorebook back into the preview."
        >
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
              setStatus(`Loaded ${item.title}.`);
            }}
          />
        </GeneratorFormCard>
      </div>
    </GeneratorGrid>
  );
}
