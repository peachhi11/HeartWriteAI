"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import {
  Clapperboard,
  Clipboard,
  CopyPlus,
  Download,
  FilePlus2,
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
import { Textarea } from "@/components/ui/textarea";
import {
  artifactToJsonBytes,
  compileScenarioConstructionPrompt,
  createArtifactFileName,
  createBlankScenarioArtifact,
  createDuplicateArtifactId,
  createImportedScenarioArtifact,
  createScenarioArtifactFromEditable,
  DEFAULT_SCENARIO_CONSTRUCTION_PROMPT,
  generateScenarioArtifact,
  type GeneratedScenarioArtifact,
  type ScenarioGenerationInput,
} from "@/features/generation/workflows";
import { useRuntimeEngineSettings } from "@/features/settings/runtimeModeStore";
import {
  deleteScenarioLibraryItem,
  saveScenarioLibraryItem,
  useScenarioLibrary,
} from "@/hooks/useScenarioLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import type { OccupationProfessionalDomain } from "@/lib/character-card/generator";
import { Field, GeneratorFormCard, GeneratorGrid } from "./GenerationShell";

const professionalDomains: OccupationProfessionalDomain[] = [
  "Arts_Entertainment",
  "Corporate_Finance",
  "Medical_Science",
  "Security_Defense",
  "Underworld",
];

const plotHooks: GeneratedScenarioArtifact["scenario"]["plotHook"][] = [
  "The_Chance_Encounter",
  "The_Crisis",
  "The_Mandate",
  "The_Secret_Transaction",
];

const settingTypes: GeneratedScenarioArtifact["scenario"]["settingType"][] = [
  "Atmospheric_Wilderness",
  "Contained_Insular",
  "Corporate_Institutional",
  "Public_HighExposure",
];

const startingTensions: GeneratedScenarioArtifact["scenario"]["startingTension"][] = [
  "Charged_Electric",
  "Combative_Friction",
  "Formal_Chilling",
  "Vulnerable_Exhausted",
];

const entryPoints: GeneratedScenarioArtifact["firstMessage"]["entryPoint"][] = [
  "Active_Collision",
  "Mid_Action_Dialogue",
  "Post_Crisis_Quiet",
  "The_Approach",
];

const literaryStyles: GeneratedScenarioArtifact["firstMessage"]["literaryStyle"][] = [
  "Action_Dialogue_Hybrid",
  "Chat_Symphonic",
  "Internal_Monologue_Heavy",
  "Novella_Prose",
];

const userCallsToAction: GeneratedScenarioArtifact["firstMessage"]["userCallToAction"][] = [
  "Direct_Question",
  "Physical_Gesture",
  "Vulnerable_Slip",
  "Weighted_StandOff",
];

const defaultInput: ScenarioGenerationInput = {
  constructionPrompt: DEFAULT_SCENARIO_CONSTRUCTION_PROMPT,
  jobTitle: "University Student",
  openingBeat: "Start after both characters realize they cannot simply walk away.",
  professionalDomain: "Corporate_Finance",
  relationshipPressure: "rivalry, unwanted trust, and visible emotional restraint",
  settingNotes: "late-night archive table, rain on old windows, campus mostly empty",
  title: "Late-night archive collision",
  trope: "Academic rivals forced proximity",
};

export function ScenarioGenerationPage() {
  const [input, setInput] = useState(defaultInput);
  const [activeScenario, setActiveScenario] =
    useState<GeneratedScenarioArtifact>(() => generateScenarioArtifact(defaultInput));
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const library = useScenarioLibrary();
  const { advancedControlsEnabled, hydrated } = useRuntimeEngineSettings();
  const serialized = useMemo(
    () => JSON.stringify(activeScenario, null, 2),
    [activeScenario],
  );
  const constructionPreview = useMemo(
    () => compileScenarioConstructionPrompt(input),
    [input],
  );
  const isDirty = savedSnapshot !== serialized;

  function updateInput<K extends keyof ScenarioGenerationInput>(
    key: K,
    value: ScenarioGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setActiveScenario(generateScenarioArtifact(input));
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Generated scenario draft.");
  }

  function newBlankScenario() {
    setActiveScenario(createBlankScenarioArtifact());
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Started a blank scenario draft. Save when ready.");
  }

  async function save() {
    const saved = createScenarioArtifactFromEditable({
      ...activeScenario,
      updatedAt: Date.now(),
    });
    await saveScenarioLibraryItem(saved);
    setActiveScenario(saved);
    await library.refresh();
    setSavedSnapshot(JSON.stringify(saved, null, 2));
    setDeleteArmed(false);
    setStatus(`Saved ${saved.title} to the scenario library.`);
  }

  async function saveAsCopy() {
    const title = `${activeScenario.title} Copy`;
    const copied = createScenarioArtifactFromEditable({
      ...activeScenario,
      id: createDuplicateArtifactId("scenario", title),
      title,
      updatedAt: Date.now(),
    });
    await saveScenarioLibraryItem(copied);
    setActiveScenario(copied);
    await library.refresh();
    setSavedSnapshot(JSON.stringify(copied, null, 2));
    setDeleteArmed(false);
    setStatus(`Saved ${title} as a separate scenario.`);
  }

  async function deleteActive() {
    if (!deleteArmed) {
      setDeleteArmed(true);
      setStatus(`Press Confirm Delete to remove ${activeScenario.title}.`);
      return;
    }

    await deleteScenarioLibraryItem(activeScenario.id);
    await library.refresh();
    const blank = createBlankScenarioArtifact();
    setActiveScenario(blank);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Deleted ${activeScenario.title} from the scenario library.`);
  }

  function duplicateActive() {
    const title = `${activeScenario.title} Copy`;
    setActiveScenario(createScenarioArtifactFromEditable({
      ...activeScenario,
      id: createDuplicateArtifactId("scenario", title),
      title,
      updatedAt: Date.now(),
    }));
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Duplicated ${activeScenario.title}. Save it when ready.`);
  }

  function loadScenario(item: GeneratedScenarioArtifact) {
    const normalized = createScenarioArtifactFromEditable(item);
    setActiveScenario(normalized);
    setSavedSnapshot(JSON.stringify(normalized, null, 2));
    setDeleteArmed(false);
    setStatus(`Loaded ${item.title}.`);
  }

  function editScenario(
    patch: Partial<Omit<GeneratedScenarioArtifact, "id" | "updatedAt">>,
  ) {
    setActiveScenario((current) =>
      createScenarioArtifactFromEditable({
        ...current,
        ...patch,
        updatedAt: current.updatedAt,
      }),
    );
    setDeleteArmed(false);
    setStatus("Edited scenario draft. Save when ready.");
  }

  function editScenarioData(
    patch: Partial<GeneratedScenarioArtifact["scenario"]>,
  ) {
    editScenario({
      scenario: {
        ...activeScenario.scenario,
        ...patch,
      },
      summary:
        typeof patch.scenePremiseDescription === "string"
          ? patch.scenePremiseDescription
          : activeScenario.summary,
    });
  }

  function editFirstMessage(
    patch: Partial<GeneratedScenarioArtifact["firstMessage"]>,
  ) {
    editScenario({
      firstMessage: {
        ...activeScenario.firstMessage,
        ...patch,
      },
    });
  }

  function editOccupation(
    patch: Partial<GeneratedScenarioArtifact["occupation"]>,
  ) {
    editScenario({
      occupation: {
        ...activeScenario.occupation,
        ...patch,
      } as GeneratedScenarioArtifact["occupation"],
    });
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

  async function importJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    try {
      const imported = createImportedScenarioArtifact(
        JSON.parse(await file.text()),
        file.name,
      );
      setActiveScenario(imported);
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
          title="Scenario Generator"
          description="Pick the ingredients, generate a playable scene setup, then edit every field before saving."
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
          <Field label="Setting notes">
            <Textarea
              value={input.settingNotes ?? ""}
              onChange={(event) =>
                updateInput("settingNotes", event.currentTarget.value)
              }
            />
          </Field>
          <Field label="Relationship pressure">
            <Textarea
              value={input.relationshipPressure ?? ""}
              onChange={(event) =>
                updateInput("relationshipPressure", event.currentTarget.value)
              }
            />
          </Field>
          <Field label="Opening beat">
            <Textarea
              value={input.openingBeat ?? ""}
              onChange={(event) =>
                updateInput("openingBeat", event.currentTarget.value)
              }
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
          <Button type="button" variant="outline" onClick={newBlankScenario}>
            <FilePlus2 className="size-4" />
            New Blank Scenario
          </Button>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            <Upload className="size-4" />
            Import JSON
            <input
              accept=".json,.scenario.json,application/json"
              className="sr-only"
              onChange={importJsonFile}
              type="file"
            />
          </label>
          {hydrated && advancedControlsEnabled ? (
            <AdvancedScenarioPromptPanel
              constructionPrompt={input.constructionPrompt ?? ""}
              preview={constructionPreview}
              onChange={(value) => updateInput("constructionPrompt", value)}
            />
          ) : null}
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </GeneratorFormCard>

        <GeneratorFormCard
          title={`Saved Scenarios (${library.totalCount})`}
          description="Load a saved scenario into the editor."
        >
          <Input
            placeholder="Search saved scenarios..."
            value={library.query}
            onChange={(event) => library.setQuery(event.currentTarget.value)}
          />
          <ScenarioLibraryList
            empty={library.loading ? "Loading scenarios..." : "No saved scenarios yet."}
            items={library.items}
            onSelect={loadScenario}
          />
        </GeneratorFormCard>
      </aside>

      <div className="grid gap-5">
        <Card className="bg-card/85">
          <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <CardTitle>{activeScenario.title}</CardTitle>
              <CardDescription>{activeScenario.summary}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant={isDirty ? "secondary" : "outline"}>
                  {isDirty ? "Unsaved changes" : "Saved"}
                </Badge>
                <Badge variant="outline">{formatSourceLabel(activeScenario)}</Badge>
                <Badge variant="outline">
                  Updated {savedSnapshot ? formatDate(activeScenario.updatedAt) : "Draft"}
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
              <Field label="Saved title">
                <Input
                  value={activeScenario.title}
                  onChange={(event) =>
                    editScenario({ title: event.currentTarget.value })
                  }
                />
              </Field>
              <Field label="Trope">
                <Input
                  value={activeScenario.trope}
                  onChange={(event) =>
                    editScenario({ trope: event.currentTarget.value })
                  }
                />
              </Field>
            </div>
            <Field label="Tags">
              <Input
                value={activeScenario.tags.join(", ")}
                onChange={(event) =>
                  editScenario({
                    tags: event.currentTarget.value
                      .split(",")
                      .map((tag) => tag.trim()),
                  })
                }
              />
            </Field>
            <Field label="Scene premise">
              <Textarea
                className="min-h-32"
                value={activeScenario.summary}
                onChange={(event) =>
                  editScenarioData({
                    scenePremiseDescription: event.currentTarget.value,
                  })
                }
              />
            </Field>
            <Field label="Opening constraint">
              <Textarea
                className="min-h-32"
                value={activeScenario.firstMessage.aiOutputConstraint}
                onChange={(event) =>
                  editFirstMessage({
                    aiOutputConstraint: event.currentTarget.value,
                  })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Plot hook">
                <select
                  value={activeScenario.scenario.plotHook}
                  onChange={(event) =>
                    editScenarioData({
                      plotHook: event.currentTarget.value as GeneratedScenarioArtifact["scenario"]["plotHook"],
                    })
                  }
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {plotHooks.map((plotHook) => (
                    <option key={plotHook} value={plotHook}>
                      {formatOption(plotHook)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Setting type">
                <select
                  value={activeScenario.scenario.settingType}
                  onChange={(event) =>
                    editScenarioData({
                      settingType: event.currentTarget.value as GeneratedScenarioArtifact["scenario"]["settingType"],
                    })
                  }
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {settingTypes.map((settingType) => (
                    <option key={settingType} value={settingType}>
                      {formatOption(settingType)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Starting tension">
                <select
                  value={activeScenario.scenario.startingTension}
                  onChange={(event) =>
                    editScenarioData({
                      startingTension: event.currentTarget.value as GeneratedScenarioArtifact["scenario"]["startingTension"],
                    })
                  }
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {startingTensions.map((startingTension) => (
                    <option key={startingTension} value={startingTension}>
                      {formatOption(startingTension)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Sensory anchors">
              <Input
                value={activeScenario.scenario.sensoryDetails.join(", ")}
                onChange={(event) =>
                  editScenarioData({
                    sensoryDetails: event.currentTarget.value
                      .split(",")
                      .map((detail) => detail.trim()),
                  })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Entry point">
                <select
                  value={activeScenario.firstMessage.entryPoint}
                  onChange={(event) =>
                    editFirstMessage({
                      entryPoint: event.currentTarget.value as GeneratedScenarioArtifact["firstMessage"]["entryPoint"],
                    })
                  }
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {entryPoints.map((entryPoint) => (
                    <option key={entryPoint} value={entryPoint}>
                      {formatOption(entryPoint)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Writing style">
                <select
                  value={activeScenario.firstMessage.literaryStyle}
                  onChange={(event) =>
                    editFirstMessage({
                      literaryStyle: event.currentTarget.value as GeneratedScenarioArtifact["firstMessage"]["literaryStyle"],
                    })
                  }
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {literaryStyles.map((literaryStyle) => (
                    <option key={literaryStyle} value={literaryStyle}>
                      {formatOption(literaryStyle)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="User handoff">
                <select
                  value={activeScenario.firstMessage.userCallToAction}
                  onChange={(event) =>
                    editFirstMessage({
                      userCallToAction: event.currentTarget.value as GeneratedScenarioArtifact["firstMessage"]["userCallToAction"],
                    })
                  }
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {userCallsToAction.map((userCallToAction) => (
                    <option key={userCallToAction} value={userCallToAction}>
                      {formatOption(userCallToAction)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Opening token cap">
                <Input
                  min={120}
                  max={1200}
                  type="number"
                  value={activeScenario.firstMessage.tokenLengthCap}
                  onChange={(event) =>
                    editFirstMessage({
                      tokenLengthCap: numberFromInput(
                        event.currentTarget.value,
                        activeScenario.firstMessage.tokenLengthCap,
                      ),
                    })
                  }
                />
              </Field>
              <Field label="Occupation / role">
                <Input
                  value={activeScenario.occupation.jobTitle}
                  onChange={(event) =>
                    editOccupation({ jobTitle: event.currentTarget.value })
                  }
                />
              </Field>
              <Field label="Workplace / social vibe">
                <Input
                  value={activeScenario.occupation.workplaceVibe}
                  onChange={(event) =>
                    editOccupation({ workplaceVibe: event.currentTarget.value })
                  }
                />
              </Field>
            </div>
            <section className="rounded-md border bg-background/70 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
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
            </section>
          </CardContent>
        </Card>
      </div>
    </GeneratorGrid>
  );
}

function AdvancedScenarioPromptPanel(props: {
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
          Power-user controls for changing how the scenario draft is constructed.
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
          <h3 className="mb-2 text-xs font-semibold">Compiled Preview</h3>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
            {props.preview}
          </pre>
        </section>
      </div>
    </details>
  );
}

function ScenarioLibraryList(props: {
  empty: string;
  items: GeneratedScenarioArtifact[];
  onSelect: (item: GeneratedScenarioArtifact) => void;
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
            {item.summary}
          </p>
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

function ResultBlock(props: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-md border bg-background/70 p-4">
      <h3 className="mb-2 text-sm font-semibold">{props.title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{props.children}</p>
    </section>
  );
}

function formatOption(value: string) {
  return value.replaceAll("_", " ");
}

function numberFromInput(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatSourceLabel(item: Pick<GeneratedScenarioArtifact, "source">) {
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
