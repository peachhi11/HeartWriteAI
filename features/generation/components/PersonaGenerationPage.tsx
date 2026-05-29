"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import {
  Clipboard,
  CopyPlus,
  Download,
  FilePlus2,
  Save,
  Sparkles,
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
  compilePersonaConstructionPrompt,
  createBlankPersonaArtifact,
  createDuplicateArtifactId,
  createArtifactFileName,
  createImportedPersonaArtifact,
  createPersonaArtifactFromEditable,
  DEFAULT_PERSONA_CONSTRUCTION_PROMPT,
  generatePersonaArtifact,
  type GeneratedPersonaArtifact,
  type PersonaGenerationInput,
} from "@/features/generation/workflows";
import { useRuntimeEngineSettings } from "@/features/settings/runtimeModeStore";
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
import { PersonaMatchingStudio } from "./PersonaMatchingStudio";

const defaultInput: PersonaGenerationInput = {
  archetype: "Guarded romantic lead",
  boundaries: "Do not speak, decide, consent, or narrate internal thoughts for {{user}}.",
  characteristics: "emotionally observant, quietly stubborn, slow to trust but loyal once chosen",
  constructionPrompt: DEFAULT_PERSONA_CONSTRUCTION_PROMPT,
  emotionalNeed: "to feel chosen without losing independence",
  name: "Megan",
  playStyle: "Story roleplay",
  pointOfView: "FemPOV",
  referenceCharacter: "",
  relationshipToCharacter: "slow-burn romantic counterpart",
  tags: "slow burn, emotionally observant, consent-aware",
};

type PersonaStarterFieldKey =
  | "name"
  | "basicInfo"
  | "appearance"
  | "personality"
  | "scenario"
  | "firstMessage";

const personaStarterFieldDefinitions: Array<{
  key: PersonaStarterFieldKey;
  label: string;
  placeholder: string;
  rows?: number;
}> = [
  {
    key: "name",
    label: "Name",
    placeholder: "Megan",
  },
  {
    key: "basicInfo",
    label: "Basic info",
    placeholder: "Age range, gender/pronouns, job, background, social role...",
    rows: 3,
  },
  {
    key: "appearance",
    label: "Appearance",
    placeholder: "Style, body language, presentation, notable details...",
    rows: 3,
  },
  {
    key: "personality",
    label: "Personality",
    placeholder: "Core traits, wounds, wants, fears, habits, boundaries...",
    rows: 3,
  },
  {
    key: "scenario",
    label: "Scenario",
    placeholder: "Optional setup, relationship context, or character they are built to play opposite.",
    rows: 3,
  },
  {
    key: "firstMessage",
    label: "First message",
    placeholder: "Optional opening user line, vibe, or first-scene intention.",
    rows: 3,
  },
];

const emptyPersonaStarterFields: Record<PersonaStarterFieldKey, string> = {
  appearance: "",
  basicInfo: "",
  firstMessage: "",
  name: "",
  personality: "",
  scenario: "",
};

export function PersonaGenerationPage() {
  const [input, setInput] = useState(defaultInput);
  const [personaIntakeText, setPersonaIntakeText] = useState("");
  const [personaStarterFields, setPersonaStarterFields] =
    useState<Record<PersonaStarterFieldKey, string>>(emptyPersonaStarterFields);
  const [personaIntakeStatus, setPersonaIntakeStatus] = useState<string | null>(
    null,
  );
  const [activePersona, setActivePersona] = useState<GeneratedPersonaArtifact>(
    () => generatePersonaArtifact(defaultInput),
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const library = usePersonaLibrary();
  const { advancedControlsEnabled, hydrated } = useRuntimeEngineSettings();

  const serialized = useMemo(
    () => JSON.stringify(activePersona, null, 2),
    [activePersona],
  );
  const constructionPreview = useMemo(
    () => compilePersonaConstructionPrompt(input),
    [input],
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

  function routePersonaIntake() {
    const starterText = createPersonaStarterIntakeText(personaStarterFields);
    const combinedIntakeText = joinDefined([personaIntakeText, starterText]);

    if (!combinedIntakeText.trim()) {
      setPersonaIntakeStatus(
        "Paste rough persona notes or fill at least one starter field before routing intake.",
      );
      return;
    }

    const profileSections = joinDefined([
      personaIntakeText.trim() ? `Freeform notes:\n${personaIntakeText.trim()}` : "",
      personaStarterFields.basicInfo.trim()
        ? `Basic info:\n${personaStarterFields.basicInfo.trim()}`
        : "",
      personaStarterFields.appearance.trim()
        ? `Appearance:\n${personaStarterFields.appearance.trim()}`
        : "",
      personaStarterFields.personality.trim()
        ? `Personality:\n${personaStarterFields.personality.trim()}`
        : "",
      personaStarterFields.firstMessage.trim()
        ? `Preferred opening / first message:\n${personaStarterFields.firstMessage.trim()}`
        : "",
    ]);
    const scenarioContext = personaStarterFields.scenario.trim()
      ? `Scenario / context:\n${personaStarterFields.scenario.trim()}`
      : "";
    const nextInput: PersonaGenerationInput = {
      ...input,
      name: personaStarterFields.name.trim() || input.name,
      characteristics: joinDefined([input.characteristics, profileSections]),
      referenceCharacter: joinDefined([input.referenceCharacter, scenarioContext]),
    };

    setInput(nextInput);
    setActivePersona(generatePersonaArtifact(nextInput));
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setPersonaIntakeStatus("Routed persona notes into an editable generated draft.");
    setStatus("Generated persona draft from intake.");
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
      <aside className="grid max-h-[calc(100vh-8rem)] gap-5 overflow-y-auto pr-1 lg:sticky lg:top-24">
        <GeneratorFormCard
          title="Persona Generator"
          description="Create saved user personas that drive chat POV, boundaries, and relationship interpretation."
        >
          <Field label="Messy persona notes">
            <Textarea
              value={personaIntakeText}
              placeholder="Paste rough {{user}} POV ideas, profile fragments, traits, boundaries, relationship context, or first-scene notes..."
              className="min-h-32"
              onChange={(event) => setPersonaIntakeText(event.currentTarget.value)}
            />
          </Field>
          <details className="rounded-md border bg-background/70 p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Optional structured starter fields
            </summary>
            <div className="mt-4 grid gap-4">
              {personaStarterFieldDefinitions.map((field) => (
                <Field key={field.key} label={field.label}>
                  {field.rows ? (
                    <Textarea
                      value={personaStarterFields[field.key]}
                      placeholder={field.placeholder}
                      className="min-h-20"
                      onChange={(event) =>
                        setPersonaStarterFields((current) => ({
                          ...current,
                          [field.key]: event.currentTarget.value,
                        }))
                      }
                    />
                  ) : (
                    <Input
                      value={personaStarterFields[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        setPersonaStarterFields((current) => ({
                          ...current,
                          [field.key]: event.currentTarget.value,
                        }))
                      }
                    />
                  )}
                </Field>
              ))}
            </div>
          </details>
          <Button type="button" variant="secondary" onClick={routePersonaIntake}>
            <Sparkles className="size-4" />
            Route Intake to Persona
          </Button>
          {personaIntakeStatus ? (
            <p className="text-sm text-muted-foreground">{personaIntakeStatus}</p>
          ) : null}
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
          <Field label="Match target / character context">
            <Input
              placeholder="Optional: character name, card tone, or relationship premise"
              value={input.referenceCharacter}
              onChange={(event) =>
                updateInput("referenceCharacter", event.currentTarget.value)
              }
            />
          </Field>
          <Field label="Relationship role">
            <select
              value={input.relationshipToCharacter}
              onChange={(event) =>
                updateInput("relationshipToCharacter", event.currentTarget.value)
              }
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option>slow-burn romantic counterpart</option>
              <option>guarded rival with romantic tension</option>
              <option>trusted friend with hidden longing</option>
              <option>established partner</option>
              <option>forbidden attraction</option>
              <option>casual intimacy with attachment risk</option>
              <option>custom / undefined</option>
            </select>
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
          <Field label="Characteristics you want">
            <Textarea
              value={input.characteristics}
              onChange={(event) =>
                updateInput("characteristics", event.currentTarget.value)
              }
            />
          </Field>
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
          {hydrated && advancedControlsEnabled ? (
            <AdvancedPersonaPromptPanel
              constructionPrompt={input.constructionPrompt ?? ""}
              preview={constructionPreview}
              onChange={(value) => updateInput("constructionPrompt", value)}
            />
          ) : null}
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
        <PersonaMatchingStudio />

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

function AdvancedPersonaPromptPanel(props: {
  constructionPrompt: string;
  onChange: (value: string) => void;
  preview: string;
}) {
  return (
    <details className="rounded-md border bg-background/70 p-4">
      <summary className="cursor-pointer text-sm font-semibold">
        Prompt Construction
      </summary>
      <div className="mt-4 grid gap-4">
        <p className="text-xs leading-5 text-muted-foreground">
          Power-user controls for changing how the persona draft is constructed.
          Standard users never need this section.
        </p>
        <Field label="Construction prompt">
          <Textarea
            className="min-h-40 font-mono text-xs leading-5"
            value={props.constructionPrompt}
            onChange={(event) => props.onChange(event.currentTarget.value)}
          />
        </Field>
        <section className="rounded-md border bg-muted p-3">
          <h3 className="mb-2 text-xs font-semibold">Prompt Preview</h3>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
            {props.preview}
          </pre>
        </section>
      </div>
    </details>
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

function createPersonaStarterIntakeText(
  fields: Record<PersonaStarterFieldKey, string>,
) {
  return joinDefined([
    fields.name.trim() ? `Persona Name: ${fields.name.trim()}` : "",
    fields.basicInfo.trim()
      ? `Basic Information:\n${fields.basicInfo.trim()}`
      : "",
    fields.appearance.trim()
      ? `Appearance:\n${fields.appearance.trim()}`
      : "",
    fields.personality.trim()
      ? `Personality:\n${fields.personality.trim()}`
      : "",
    fields.scenario.trim() ? `Scenario:\n${fields.scenario.trim()}` : "",
    fields.firstMessage.trim()
      ? `First Message:\n${fields.firstMessage.trim()}`
      : "",
  ]);
}

function joinDefined(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n\n");
}
