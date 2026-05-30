"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Clapperboard,
  Clipboard,
  CopyPlus,
  Dice5,
  Download,
  FilePlus2,
  LibraryBig,
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
  createScenarioInputFromTemplate,
  createScenarioArtifactFromEditable,
  DEFAULT_SCENARIO_CONSTRUCTION_PROMPT,
  generateScenarioArtifact,
  generateSuggestedLorebookFromScenario,
  getScenarioTemplateCategories,
  SCENARIO_TEMPLATES,
  type GeneratedScenarioArtifact,
  type GeneratedLorebookArtifact,
  type ScenarioGenerationInput,
  type ScenarioTemplateCategory,
} from "@/features/generation/workflows";
import {
  createLorebookV3ExportFileName,
  generatedLorebookArtifactToV3Document,
  serializeLorebookV3Document,
} from "@/features/lorebooks/adapters";
import { useRuntimeEngineSettings } from "@/features/settings/runtimeModeStore";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { saveLorebookLibraryItem, useLorebookLibrary } from "@/hooks/useLorebookLibrary";
import { usePersonaLibrary } from "@/hooks/usePersonaLibrary";
import {
  deleteScenarioLibraryItem,
  saveScenarioLibraryItem,
  useScenarioLibrary,
} from "@/hooks/useScenarioLibrary";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import type { OccupationProfessionalDomain } from "@/lib/character-card/generator";
import { Field, GeneratorFormCard, GeneratorGrid } from "./GenerationShell";
import {
  rollScenarioPayload,
  type RPScenarioPayload,
} from "@/data/beats";

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

type ScenarioPayloadTab = "firstMessage" | "aiContext" | "lore" | "card";

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

const scenarioCategories = getScenarioTemplateCategories();
const defaultTemplateId = "university_rivalry_scholarship_event";

export function ScenarioGenerationPage() {
  const characters = useCardLibrary(30);
  const personas = usePersonaLibrary();
  const lorebooks = useLorebookLibrary();
  const [input, setInput] = useState(defaultInput);
  const [characterId, setCharacterId] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [lorebookId, setLorebookId] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ScenarioTemplateCategory>("University rivalry");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState(defaultTemplateId);
  const [activeScenario, setActiveScenario] =
    useState<GeneratedScenarioArtifact>(() => generateScenarioArtifact(defaultInput));
  const [suggestedLorebook, setSuggestedLorebook] =
    useState<GeneratedLorebookArtifact | null>(null);
  const [rolledPayload, setRolledPayload] =
    useState<RPScenarioPayload | null>(null);
  const [scenarioPayloadTab, setScenarioPayloadTab] =
    useState<ScenarioPayloadTab>("firstMessage");
  const [savedSuggestedLorebookId, setSavedSuggestedLorebookId] =
    useState<string | null>(null);
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
  const visibleTemplates = useMemo(
    () =>
      SCENARIO_TEMPLATES.filter(
        (template) => template.category === selectedCategory,
      ),
    [selectedCategory],
  );
  const selectedTemplate = useMemo(
    () =>
      SCENARIO_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
      SCENARIO_TEMPLATES[0],
    [selectedTemplateId],
  );
  const selectedCharacter = useMemo(
    () => characters.items.find((item) => item.id === characterId) ?? null,
    [characterId, characters.items],
  );
  const selectedPersona = useMemo(
    () => personas.items.find((item) => item.id === personaId) ?? null,
    [personaId, personas.items],
  );
  const selectedLorebook = useMemo(
    () => lorebooks.items.find((item) => item.id === lorebookId) ?? null,
    [lorebookId, lorebooks.items],
  );
  const isDirty = savedSnapshot !== serialized;

  function updateInput<K extends keyof ScenarioGenerationInput>(
    key: K,
    value: ScenarioGenerationInput[K],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function syncWorkbenchContext(next: {
    characterId?: string;
    lorebookId?: string;
    personaId?: string;
  }) {
    const nextCharacterId = next.characterId ?? characterId;
    const nextPersonaId = next.personaId ?? personaId;
    const nextLorebookId = next.lorebookId ?? lorebookId;
    const character =
      characters.items.find((item) => item.id === nextCharacterId) ?? null;
    const persona =
      personas.items.find((item) => item.id === nextPersonaId) ?? null;
    const lorebook =
      lorebooks.items.find((item) => item.id === nextLorebookId) ?? null;

    if (typeof next.characterId === "string") {
      setCharacterId(next.characterId);
    }
    if (typeof next.personaId === "string") {
      setPersonaId(next.personaId);
    }
    if (typeof next.lorebookId === "string") {
      setLorebookId(next.lorebookId);
    }

    setInput((current) => ({
      ...current,
      referenceCharacter: character
        ? [
            character.name,
            character.relationship,
            character.framework,
            character.tags.slice(0, 5).join(", "),
          ].filter(Boolean).join(" · ")
        : "",
      referenceLorebook: lorebook
        ? [
            lorebook.title,
            typeof lorebook.summary === "object"
              ? lorebook.summary.aiLoreInstruction
              : lorebook.summary,
          ].filter(Boolean).join(" · ")
        : "",
      referencePersona: persona
        ? [persona.name, persona.summary, persona.tags.slice(0, 5).join(", ")]
            .filter(Boolean)
            .join(" · ")
        : "",
    }));
  }

  function applyTemplate(templateId: string) {
    const template = SCENARIO_TEMPLATES.find((item) => item.id === templateId);
    if (!template) {
      return;
    }

    setSelectedCategory(template.category);
    setSelectedTemplateId(template.id);
    setInput((current) => createScenarioInputFromTemplate(template.id, current));
    setStatus(`Loaded template: ${template.title}. Adjust details, then generate.`);
  }

  function changeCategory(category: ScenarioTemplateCategory) {
    const firstTemplate = SCENARIO_TEMPLATES.find(
      (template) => template.category === category,
    );

    setSelectedCategory(category);
    if (firstTemplate) {
      applyTemplate(firstTemplate.id);
    }
  }

  function generate() {
    setActiveScenario(generateScenarioArtifact(input));
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus("Generated scenario draft.");
  }

  function rollSceneBeat() {
    const nextPayload = rollScenarioPayload();
    setRolledPayload(nextPayload);
    setScenarioPayloadTab("firstMessage");
    setStatus(`Rolled scene beat: ${nextPayload.narrative.title}.`);
  }

  function applyRolledSceneBeat() {
    if (!rolledPayload) {
      return;
    }

    const title = rolledPayload.narrative.title;
    const trope = `${rolledPayload.metadata.tone} ${rolledPayload.metadata.phase}`;
    const summary = [
      `${title}: ${rolledPayload.narrative.incitingIncident}`,
      `Setting: ${rolledPayload.narrative.setting}.`,
      `Sensory anchor: ${rolledPayload.narrative.sensoryAnchor}`,
    ].join(" ");
    const updated = createScenarioArtifactFromEditable({
      ...activeScenario,
      firstMessage: {
        ...activeScenario.firstMessage,
        aiOutputConstraint: rolledPayload.llmContext.startingMessageTemplate,
        entryPoint: "Active_Collision",
        userCallToAction: "Physical_Gesture",
      },
      id: createDuplicateArtifactId("scenario", `${title}:${rolledPayload.id}`),
      scenario: {
        ...activeScenario.scenario,
        plotHook: "The_Chance_Encounter",
        scenePremiseDescription: summary,
        sensoryDetails: [rolledPayload.narrative.sensoryAnchor],
        settingType: "Contained_Insular",
        startingTension:
          rolledPayload.metadata.phase === "Vulnerability"
            ? "Vulnerable_Exhausted"
            : "Charged_Electric",
      },
      source: "generated",
      summary,
      tags: [
        "scenario roll",
        rolledPayload.metadata.phase,
        rolledPayload.metadata.tone,
      ],
      title,
      trope,
      updatedAt: Date.now(),
    });

    setActiveScenario(updated);
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Applied ${title} to the editable scenario draft.`);
  }

  function newBlankScenario() {
    setActiveScenario(createBlankScenarioArtifact());
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
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
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
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
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
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
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setStatus(`Duplicated ${activeScenario.title}. Save it when ready.`);
  }

  function loadScenario(item: GeneratedScenarioArtifact) {
    const normalized = createScenarioArtifactFromEditable(item);
    setActiveScenario(normalized);
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
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
    setSuggestedLorebook(null);
    setSavedSuggestedLorebookId(null);
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
      setSuggestedLorebook(null);
      setSavedSuggestedLorebookId(null);
      setSavedSnapshot(null);
      setDeleteArmed(false);
      setStatus(`Imported ${imported.title}. Review and save when ready.`);
    } catch (caughtError) {
      setStatus(`Import failed: ${caughtError instanceof Error ? caughtError.message : String(caughtError)}`);
    }
  }

  function generateSuggestedLore() {
    const lorebook = generateSuggestedLorebookFromScenario(activeScenario, {
      professionalDomain: input.professionalDomain,
      speciesType: "Human",
    });
    const v3Document = generatedLorebookArtifactToV3Document(lorebook);

    setSuggestedLorebook({
      ...lorebook,
      v3Document,
    });
    setSavedSuggestedLorebookId(null);
    setStatus("Generated optional suggested lore from the active scenario.");
  }

  async function saveSuggestedLore() {
    if (!suggestedLorebook) {
      return;
    }

    await saveLorebookLibraryItem(suggestedLorebook);
    setSavedSuggestedLorebookId(suggestedLorebook.id);
    setStatus(`Saved ${suggestedLorebook.title} to the lorebook library.`);
  }

  function exportSuggestedLore() {
    if (!suggestedLorebook) {
      return;
    }

    const document =
      suggestedLorebook.v3Document ??
      generatedLorebookArtifactToV3Document(suggestedLorebook);
    downloadUint8Array(
      new TextEncoder().encode(serializeLorebookV3Document(document)),
      createLorebookV3ExportFileName(document.data.name),
      "application/json",
    );
    setStatus("Exported suggested lorebook V3 JSON.");
  }

  return (
    <GeneratorGrid>
      <aside className="grid max-h-[calc(100vh-8rem)] gap-5 overflow-y-auto pr-1 lg:sticky lg:top-24">
        <GeneratorFormCard
          title="Scenario Generator"
          description="Pick the ingredients, generate a playable scene setup, then edit every field before saving."
        >
          <Field label="Scenario route">
            <select
              value={selectedCategory}
              onChange={(event) =>
                changeCategory(event.currentTarget.value as ScenarioTemplateCategory)
              }
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {scenarioCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Story seed">
            <select
              value={selectedTemplateId}
              onChange={(event) => applyTemplate(event.currentTarget.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {visibleTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
          </Field>
          {selectedTemplate ? (
            <section className="rounded-md border bg-background/70 p-3 text-sm leading-6 text-muted-foreground">
              {selectedTemplate.premise}
            </section>
          ) : null}
          <section className="grid gap-3 rounded-md border bg-background/70 p-3">
            <div>
              <h3 className="text-sm font-semibold">Optional Workbench Context</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Use saved pieces if you already have them, or leave these blank
                and generate from the route and story seed alone.
              </p>
            </div>
            <Field label={`Saved character (${characters.metadata.totalCount})`}>
              <ArtifactSelect
                emptyLabel="No character selected"
                items={characters.items}
                labelForItem={(item) => item.name}
                value={characterId}
                onChange={(value) => syncWorkbenchContext({ characterId: value })}
              />
            </Field>
            <Field label={`Saved persona (${personas.metadata.totalCount})`}>
              <ArtifactSelect
                emptyLabel="No persona selected"
                items={personas.items}
                labelForItem={(item) => item.name}
                value={personaId}
                onChange={(value) => syncWorkbenchContext({ personaId: value })}
              />
            </Field>
            <Field label={`Saved lorebook (${lorebooks.totalCount})`}>
              <ArtifactSelect
                emptyLabel="No lorebook selected"
                items={lorebooks.items}
                labelForItem={(item) => item.title}
                value={lorebookId}
                onChange={(value) => syncWorkbenchContext({ lorebookId: value })}
              />
            </Field>
            {[characters.error, personas.error, lorebooks.error].filter(Boolean).length > 0 ? (
              <p className="text-sm text-destructive">
                {[characters.error, personas.error, lorebooks.error].filter(Boolean).join(" ")}
              </p>
            ) : characters.loading || personas.loading || lorebooks.loading ? (
              <p className="text-sm text-muted-foreground">Loading saved context...</p>
            ) : selectedCharacter || selectedPersona || selectedLorebook ? (
              <p className="text-xs leading-5 text-muted-foreground">
                Selected context will softly guide the generated scenario; it
                will not make character, persona, or lore selection mandatory.
              </p>
            ) : null}
          </section>
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
        <ScenarioBeatRoller
          activeTab={scenarioPayloadTab}
          payload={rolledPayload}
          onApply={applyRolledSceneBeat}
          onRoll={rollSceneBeat}
          onTabChange={setScenarioPayloadTab}
        />

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
              <Button type="button" variant="outline" onClick={generateSuggestedLore}>
                <LibraryBig className="size-4" />
                Generate Suggested Lore
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
                <ResultBlock title="Chat Setup">
                  {[
                    activeScenario.scenario.settingType,
                    activeScenario.scenario.plotHook,
                    activeScenario.scenario.startingTension,
                    activeScenario.firstMessage.entryPoint,
                  ].join(" | ")}
                </ResultBlock>
              </div>
            </section>
            {suggestedLorebook ? (
              <section className="rounded-md border bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Suggested Lore Draft
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {suggestedLorebook.title} ·{" "}
                      {suggestedLorebook.entries.length} modular entries
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={exportSuggestedLore}
                    >
                      <Download className="size-4" />
                      Export Lore
                    </Button>
                    <Button type="button" size="sm" onClick={saveSuggestedLore}>
                      <Save className="size-4" />
                      Save Lore
                    </Button>
                    {savedSuggestedLorebookId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href="/lorebooks">
                          <LibraryBig className="size-4" />
                          Open in Lorebook Studio
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {suggestedLorebook.entries.slice(0, 4).map((entry) => (
                    <section
                      key={entry.entryId}
                      className="rounded-md border bg-card/60 p-3"
                    >
                      <h4 className="text-sm font-medium">{entry.title}</h4>
                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                        {entry.entryContent}
                      </p>
                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        Keys: {entry.activationKeys.join(", ")}
                      </p>
                    </section>
                  ))}
                </div>
              </section>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </GeneratorGrid>
  );
}

function ScenarioBeatRoller(props: {
  activeTab: ScenarioPayloadTab;
  onApply: () => void;
  onRoll: () => void;
  onTabChange: (tab: ScenarioPayloadTab) => void;
  payload: RPScenarioPayload | null;
}) {
  const tabs: { id: ScenarioPayloadTab; label: string }[] = [
    { id: "firstMessage", label: "First Message" },
    { id: "aiContext", label: "AI Context" },
    { id: "lore", label: "Lore Hook" },
    { id: "card", label: "Card Note" },
  ];

  return (
    <Card className="liquid-glass-strong overflow-hidden">
      <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Scene Beat Roller</CardTitle>
            {props.payload ? (
              <Badge variant="secondary">{props.payload.metadata.phase}</Badge>
            ) : null}
          </div>
          <CardDescription>
            Roll a focused romance beat, then apply it to the editable scenario
            draft when it fits.
          </CardDescription>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={props.onRoll}>
            <Dice5 className="size-4" />
            Roll Scene Beat
          </Button>
          <Button
            disabled={!props.payload}
            type="button"
            onClick={props.onApply}
          >
            <Clapperboard className="size-4" />
            Apply to Draft
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {props.payload ? (
          <>
            <section className="grid gap-3 rounded-md border bg-background/70 p-4 md:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {props.payload.metadata.tone}
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  {props.payload.narrative.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {props.payload.narrative.incitingIncident}
                </p>
              </div>
              <div className="rounded-md border bg-card/70 p-3 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Setting:</span>{" "}
                  {props.payload.narrative.setting}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-foreground">Sensory:</span>{" "}
                  {props.payload.narrative.sensoryAnchor}
                </p>
              </div>
            </section>

            <section className="rounded-md border bg-background/70">
              <div className="flex flex-wrap border-b">
                {tabs.map((tab) => (
                  <button
                    className={`border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wide transition ${
                      props.activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    key={tab.id}
                    onClick={() => props.onTabChange(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {props.activeTab === "firstMessage" ? (
                  <ScenarioPayloadBlock title="Generated First Message">
                    {props.payload.llmContext.startingMessageTemplate}
                  </ScenarioPayloadBlock>
                ) : null}
                {props.activeTab === "aiContext" ? (
                  <ScenarioPayloadBlock title="AI Context Note">
                    {props.payload.llmContext.systemPromptOverride}
                  </ScenarioPayloadBlock>
                ) : null}
                {props.activeTab === "lore" ? (
                  <ScenarioPayloadBlock
                    title={`Temporary Lore Key: ${props.payload.llmContext.temporaryLorebookEntry.key}`}
                  >
                    {props.payload.llmContext.temporaryLorebookEntry.content}
                  </ScenarioPayloadBlock>
                ) : null}
                {props.activeTab === "card" ? (
                  <ScenarioPayloadBlock title="Character Card Scenario Note">
                    {props.payload.cardContext.scenarioAppend}
                  </ScenarioPayloadBlock>
                ) : null}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-md border border-dashed bg-background/50 p-8 text-center text-sm text-muted-foreground">
            Roll a scene beat to create a first message, AI context note, lore
            hook, and character card scenario note.
          </section>
        )}
      </CardContent>
    </Card>
  );
}

function ScenarioPayloadBlock(props: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-md border bg-card/70 p-4">
      <h3 className="mb-2 text-sm font-semibold">{props.title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {props.children}
      </p>
    </div>
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
          <h3 className="mb-2 text-xs font-semibold">Prompt Preview</h3>
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
