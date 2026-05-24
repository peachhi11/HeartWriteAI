"use client";

import { useMemo, useState } from "react";
import { UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  artifactToJsonBytes,
  createDuplicateArtifactId,
  createArtifactFileName,
  generatePersonaArtifact,
  type GeneratedPersonaArtifact,
  type PersonaGenerationInput,
} from "@/features/generation/workflows";
import {
  deletePersonaLibraryItem,
  savePersonaLibraryItem,
  usePersonaLibrary,
} from "@/hooks/usePersonaLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import {
  ArtifactLibraryList,
  Field,
  GeneratorFormCard,
  GeneratorGrid,
  GeneratorResultCard,
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
  const [status, setStatus] = useState<string | null>(null);
  const library = usePersonaLibrary();

  const serialized = useMemo(
    () => JSON.stringify(activePersona, null, 2),
    [activePersona],
  );

  function updateInput<K extends keyof PersonaGenerationInput>(
    key: K,
    value: PersonaGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setActivePersona(generatePersonaArtifact(input));
    setStatus("Generated persona draft.");
  }

  async function save() {
    await savePersonaLibraryItem(activePersona);
    await library.refresh();
    setStatus(`Saved ${activePersona.name} to the persona library.`);
  }

  async function deleteActive() {
    await deletePersonaLibraryItem(activePersona.id);
    await library.refresh();
    setStatus(`Deleted ${activePersona.name} from the persona library.`);
  }

  function duplicateActive() {
    const name = `${activePersona.name} Copy`;
    setActivePersona({
      ...activePersona,
      id: createDuplicateArtifactId("persona", name),
      name,
      updatedAt: Date.now(),
    });
    setStatus(`Duplicated ${activePersona.name}. Save it when ready.`);
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

  return (
    <GeneratorGrid>
      <GeneratorFormCard
        title="Persona Generator"
        description="Create saved user personas that can later drive chat POV, boundaries, and relationship interpretation."
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
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </GeneratorFormCard>

      <div className="grid gap-5">
        <GeneratorResultCard
          title={activePersona.name}
          description={activePersona.summary}
          onCopy={copy}
          onDelete={deleteActive}
          onDuplicate={duplicateActive}
          onExport={exportJson}
          onSave={save}
          saveLabel="Save Persona"
        >
          <div className="flex flex-wrap gap-2">
            {activePersona.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs leading-5">
            {activePersona.prompt}
          </pre>
        </GeneratorResultCard>

        <GeneratorFormCard
          title={`Saved Personas (${library.metadata.totalCount})`}
          description="Load a saved persona back into the preview."
        >
          <Input
            placeholder="Search saved personas..."
            value={library.query}
            onChange={(event) => library.setQuery(event.currentTarget.value)}
          />
          <ArtifactLibraryList
            empty={library.loading ? "Loading personas..." : "No saved personas yet."}
            items={library.items}
            onSelect={(item) => {
              setActivePersona({
                id: item.id,
                name: item.name,
                prompt: item.prompt ?? "",
                summary: item.summary ?? "",
                tags: item.tags,
                updatedAt: item.updatedAt,
              });
              setStatus(`Loaded ${item.name}.`);
            }}
          />
        </GeneratorFormCard>
      </div>
    </GeneratorGrid>
  );
}
