"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { Clapperboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  artifactToJsonBytes,
  createArtifactFileName,
  createDuplicateArtifactId,
  generateScenarioArtifact,
  type GeneratedScenarioArtifact,
  type ScenarioGenerationInput,
} from "@/features/generation/workflows";
import {
  deleteScenarioLibraryItem,
  saveScenarioLibraryItem,
  useScenarioLibrary,
} from "@/hooks/useScenarioLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import type { OccupationProfessionalDomain } from "@/lib/character-card/generator";
import {
  ArtifactLibraryList,
  Field,
  GeneratorFormCard,
  GeneratorGrid,
  GeneratorResultCard,
} from "./GenerationShell";

const professionalDomains: OccupationProfessionalDomain[] = [
  "Arts_Entertainment",
  "Corporate_Finance",
  "Medical_Science",
  "Security_Defense",
  "Underworld",
];

const defaultInput: ScenarioGenerationInput = {
  jobTitle: "University Student",
  professionalDomain: "Corporate_Finance",
  title: "Late-night archive collision",
  trope: "Academic rivals forced proximity",
};

export function ScenarioGenerationPage() {
  const [input, setInput] = useState(defaultInput);
  const [activeScenario, setActiveScenario] =
    useState<GeneratedScenarioArtifact>(() => generateScenarioArtifact(defaultInput));
  const [status, setStatus] = useState<string | null>(null);
  const library = useScenarioLibrary();
  const serialized = useMemo(
    () => JSON.stringify(activeScenario, null, 2),
    [activeScenario],
  );

  function updateInput<K extends keyof ScenarioGenerationInput>(
    key: K,
    value: ScenarioGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setActiveScenario(generateScenarioArtifact(input));
    setStatus("Generated scenario draft.");
  }

  async function save() {
    await saveScenarioLibraryItem(activeScenario);
    await library.refresh();
    setStatus(`Saved ${activeScenario.title} to the scenario library.`);
  }

  async function deleteActive() {
    await deleteScenarioLibraryItem(activeScenario.id);
    await library.refresh();
    setStatus(`Deleted ${activeScenario.title} from the scenario library.`);
  }

  function duplicateActive() {
    const title = `${activeScenario.title} Copy`;
    setActiveScenario({
      ...activeScenario,
      id: createDuplicateArtifactId("scenario", title),
      title,
      updatedAt: Date.now(),
    });
    setStatus(`Duplicated ${activeScenario.title}. Save it when ready.`);
  }

  async function copy() {
    await navigator.clipboard.writeText(serialized);
    setStatus("Copied scenario JSON.");
  }

  function exportJson() {
    downloadUint8Array(
      artifactToJsonBytes(activeScenario),
      createArtifactFileName(activeScenario.title, ".scenario.json"),
      "application/json",
    );
    setStatus("Exported scenario JSON.");
  }

  return (
    <GeneratorGrid>
      <GeneratorFormCard
        title="Scenario Generator"
        description="Generate scene premises, opening constraints, sensory anchors, and saved scenario records."
      >
        <Field label="Scenario title">
          <Input
            value={input.title}
            onChange={(event) => updateInput("title", event.currentTarget.value)}
          />
        </Field>
        <Field label="Trope / route pressure">
          <Input
            value={input.trope}
            onChange={(event) => updateInput("trope", event.currentTarget.value)}
          />
        </Field>
        <Field label="Occupation / role">
          <Input
            value={input.jobTitle}
            onChange={(event) =>
              updateInput("jobTitle", event.currentTarget.value)
            }
          />
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
        <Button type="button" onClick={generate}>
          <Clapperboard className="size-4" />
          Generate Scenario
        </Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </GeneratorFormCard>

      <div className="grid gap-5">
        <GeneratorResultCard
          title={activeScenario.title}
          description={activeScenario.summary}
          onCopy={copy}
          onDelete={deleteActive}
          onDuplicate={duplicateActive}
          onExport={exportJson}
          onSave={save}
          saveLabel="Save Scenario"
        >
          <div className="flex flex-wrap gap-2">
            {activeScenario.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ResultBlock title="Scene Premise">
              {activeScenario.scenario.scenePremiseDescription}
            </ResultBlock>
            <ResultBlock title="Opening Constraint">
              {activeScenario.firstMessage.aiOutputConstraint}
            </ResultBlock>
            <ResultBlock title="Sensory Anchors">
              {activeScenario.scenario.sensoryDetails.join(", ")}
            </ResultBlock>
            <ResultBlock title="Runtime Shape">
              {[
                activeScenario.scenario.settingType,
                activeScenario.scenario.plotHook,
                activeScenario.scenario.startingTension,
                activeScenario.firstMessage.entryPoint,
              ].join(" | ")}
            </ResultBlock>
          </div>
        </GeneratorResultCard>

        <GeneratorFormCard
          title={`Saved Scenarios (${library.totalCount})`}
          description="Load a saved scenario back into the preview."
        >
          <Input
            placeholder="Search saved scenarios..."
            value={library.query}
            onChange={(event) => library.setQuery(event.currentTarget.value)}
          />
          <ArtifactLibraryList
            empty={library.loading ? "Loading scenarios..." : "No saved scenarios yet."}
            items={library.items}
            onSelect={(item) => {
              setActiveScenario(item);
              setStatus(`Loaded ${item.title}.`);
            }}
          />
        </GeneratorFormCard>
      </div>
    </GeneratorGrid>
  );
}

function ResultBlock(props: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-md border bg-background/70 p-4">
      <h3 className="mb-2 text-sm font-semibold">{props.title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{props.children}</p>
    </section>
  );
}
