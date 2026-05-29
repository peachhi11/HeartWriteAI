"use client";

import Link from "next/link";
import { type ReactNode, useRef, useState, useSyncExternalStore } from "react";
import {
  FileUp,
  PanelLeftOpen,
  Save,
  Sparkles,
  UserRoundPlus,
  X,
} from "lucide-react";

import CardLibraryPanel from "@/components/card-library-panel";
import { CharacterLibraryWorkspace } from "@/components/character-library-workspace";
import { DevToolsPanel } from "@/components/dev-tools-panel";
import DropZoneOverlay from "@/components/DropZoneOverlay";
import ExpressionManager from "@/components/expression-manager";
import { FolderIntakeReview } from "@/components/folder-intake-review";
import { StudioShell } from "@/components/studio-shell";
import StructuredCardEditor from "@/components/structured-card-editor";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { useFileDialogs } from "@/hooks/useFileDialogs";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { savePersonaLibraryItem } from "@/hooks/usePersonaLibrary";
import { createPersonaArtifactFromCharacterCard } from "@/features/generation/workflows";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import { importBrowserCharacterCardFile } from "@/lib/character-card/importBrowserCharacterCardFile";
import {
  createBlankDraftCharacterCard,
  createDraftCharacterCardFromIntake,
} from "@/lib/character-card/createDraftCharacterCard";
import { writeCharacterCardToPng } from "@/lib/character-card/writeCharacterCardToPng";
import { ExpressionSprite } from "@/types/character-card/ExpressionSprite";
import { ValidatedCharacterCardV3 } from "@/types/ccv3";

type CharacterWorkflowMode = "edit" | "intake" | "create";
type StarterFieldKey =
  | "name"
  | "basicInfo"
  | "appearance"
  | "personality"
  | "scenario"
  | "firstMessage";

const starterFieldDefinitions: Array<{
  key: StarterFieldKey;
  label: string;
  placeholder: string;
  rows?: number;
}> = [
  {
    key: "name",
    label: "Name",
    placeholder: "Magnus Vanderbilt",
  },
  {
    key: "basicInfo",
    label: "Basic info",
    placeholder: "Age, role, gender/pronouns, location, occupation...",
    rows: 3,
  },
  {
    key: "appearance",
    label: "Appearance",
    placeholder: "Height, build, hair, eyes, style, notable physical details...",
    rows: 3,
  },
  {
    key: "personality",
    label: "Personality",
    placeholder: "Core traits, wounds, habits, voice, behavior patterns...",
    rows: 3,
  },
  {
    key: "scenario",
    label: "Scenario",
    placeholder: "{{user}} walks into his office after everyone else has gone home.",
    rows: 3,
  },
  {
    key: "firstMessage",
    label: "First message",
    placeholder: "\"You weren't supposed to see this.\"",
    rows: 3,
  },
];

const emptyStarterFields: Record<StarterFieldKey, string> = {
  appearance: "",
  basicInfo: "",
  firstMessage: "",
  name: "",
  personality: "",
  scenario: "",
};

const characterWorkflowSteps: Array<{
  description: string;
  href: string;
  icon: typeof FileUp;
  mode: CharacterWorkflowMode;
  title: string;
}> = [
  {
    title: "Create / Intake",
    description: "Import, start blank, or route messy notes to a profile.",
    href: "/workspace?mode=create",
    icon: UserRoundPlus,
    mode: "create",
  },
  {
    title: "Edit / Review",
    description: "Apply change notes and review the active character card.",
    href: "/workspace?mode=intake",
    icon: Sparkles,
    mode: "intake",
  },
  {
    title: "Finalize / Export",
    description: "Review final card state and choose save/export format.",
    href: "/workspace?mode=edit",
    icon: FileUp,
    mode: "edit",
  },
];

export default function WorkspacePage() {
  const workflowMode = useSyncExternalStore(
    subscribeToWorkflowModeChanges,
    readWorkflowMode,
    () => "edit" as CharacterWorkflowMode,
  );
  const [activeCard, setActiveCard] =
    useState<ValidatedCharacterCardV3 | null>(null);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [browserSourcePngData, setBrowserSourcePngData] =
    useState<Uint8Array | null>(null);
  const [messyIntakeText, setMessyIntakeText] = useState("");
  const [messyIntakeMessage, setMessyIntakeMessage] = useState<string | null>(
    null,
  );
  const [starterFields, setStarterFields] =
    useState<Record<StarterFieldKey, string>>(emptyStarterFields);
  const [editNotesText, setEditNotesText] = useState("");
  const [editNotesMessage, setEditNotesMessage] = useState<string | null>(null);
  const [selectedExpression, setSelectedExpression] =
    useState<ExpressionSprite | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const browserImportInputRef = useRef<HTMLInputElement | null>(null);
  const browserPngShellInputRef = useRef<HTMLInputElement | null>(null);
  const library = useCardLibrary(12);
  const { importCardFromPath, saveCard, saveWorkspaceChanges } =
    useCharacterLibrary();
  const {
    isDesktopRuntime,
    triggerCharxExport,
    triggerFolderIntakeSelect,
    triggerPngMetadataSave,
    triggerUniversalImport,
  } = useFileDialogs();
  const canSavePngMetadata = currentFilePath
    ? /\.(apng|png)$/i.test(currentFilePath)
    : false;

  function handleCardLoaded(
    card: ValidatedCharacterCardV3,
    filePath: string,
    sourcePngData: Uint8Array | null = null,
  ) {
    setActiveCard(card);
    setCurrentFilePath(filePath);
    setBrowserSourcePngData(sourcePngData);
    setSelectedExpression(null);
    library.refresh();
  }

  async function handleCardSelect(filePath: string) {
    setWorkspaceMessage(`Loading cached card: ${filePath}`);

    const result = await importCardFromPath(filePath);
    if (result.card) {
      handleCardLoaded(result.card, filePath);
      setWorkspaceMessage(`Loaded ${result.card.data.name} from ${filePath}.`);
    } else {
      setWorkspaceMessage(result.error ?? `Could not load ${filePath}.`);
    }
  }

  async function handlePersistWorkspaceChanges() {
    if (!activeCard || !currentFilePath) {
      return;
    }

    if (!isDesktopRuntime) {
      setWorkspaceMessage(
        "Browser preview can download a copy, but saving back to the original file needs the desktop app.",
      );
      return;
    }

    setIsSaving(true);
    setWorkspaceMessage("Saving card data back to the active source file...");

    const result = await saveWorkspaceChanges({
      activeSessionPath: currentFilePath,
      currentWorkspaceCard: activeCard,
    });

    setIsSaving(false);

    if (result.ok) {
      library.refresh();
      setWorkspaceMessage(
        result.message ??
          `Saved ${activeCard.data.name} and refreshed the library cache.`,
      );
    } else {
      setWorkspaceMessage(result.error ?? "Save failure.");
    }
  }

  async function handleSaveMasterCharx() {
    if (!activeCard) {
      return;
    }

    if (!isDesktopRuntime) {
      setWorkspaceMessage(
        "Browser preview can download a JSON copy, but saving a CHARX master needs the desktop app.",
      );
      return;
    }

    setIsSaving(true);
    setWorkspaceMessage("Saving CHARX master to the local card library...");

    const result = await saveCard(activeCard);

    setIsSaving(false);

    if (result.ok && result.filePath) {
      setCurrentFilePath(result.filePath);
      library.refresh();
      setWorkspaceMessage(`Saved CHARX master to ${result.filePath}.`);
    } else {
      setWorkspaceMessage(result.error ?? "CHARX master save failed.");
    }
  }

  async function handleManualImportClick() {
    if (!isDesktopRuntime) {
      setWorkspaceMessage("Use the browser file picker or drag a PNG/JSON card onto the workspace.");
      return;
    }

    const result = await triggerUniversalImport();
    if (!result) {
      return;
    }

    handleCardLoaded(result.card, result.path, null);
    setWorkspaceMessage(`Loaded ${result.card.data.name} from ${result.path}.`);
  }

  function handleImportCardClick() {
    if (isDesktopRuntime) {
      void handleManualImportClick();
      return;
    }

    browserImportInputRef.current?.click();
  }

  function handleImportPngShellClick() {
    if (isDesktopRuntime) {
      void handleManualImportClick();
      return;
    }

    browserPngShellInputRef.current?.click();
  }

  async function handleBrowserImportFile(file: File | null) {
    if (!file) {
      return;
    }

    setWorkspaceMessage(`Loading ${file.name}...`);

    try {
      const result = await importBrowserCharacterCardFile(file);
      handleCardLoaded(result.card, result.path, result.sourcePngData);
      setWorkspaceMessage(`Loaded ${result.card.data.name} from ${result.path}.`);
    } catch (error) {
      setWorkspaceMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function handleExportWorkspaceCharx() {
    if (!activeCard || !currentFilePath) {
      return;
    }

    if (!isDesktopRuntime) {
      setWorkspaceMessage("CHARX export needs the desktop app.");
      return;
    }

    setWorkspaceMessage("Choose a CHARX destination...");

    const destinationPath = await triggerCharxExport(currentFilePath, activeCard);

    if (destinationPath) {
      library.refresh();
      setWorkspaceMessage(`Exported CHARX to ${destinationPath}.`);
    }
  }

  async function handleSaveWorkspacePngAs() {
    if (!activeCard || !currentFilePath || !canSavePngMetadata) {
      return;
    }

    if (!isDesktopRuntime) {
      handleBrowserDownloadPng();
      return;
    }

    setWorkspaceMessage("Choose a PNG destination...");

    const savedPath = await triggerPngMetadataSave(currentFilePath, activeCard);
    if (savedPath) {
      setCurrentFilePath(savedPath);
      library.refresh();
      setWorkspaceMessage(`Saved embedded PNG card to ${savedPath}.`);
    }
  }

  function handleBrowserDownloadPng() {
    if (!activeCard || !browserSourcePngData) {
      setWorkspaceMessage(
        "Download PNG needs a PNG card source. JSON cards can be downloaded as JSON.",
      );
      return;
    }

    const updatedPngData = writeCharacterCardToPng(browserSourcePngData, activeCard);
    const fileName = createSafeCharacterFileName(
      activeCard.data.name || currentFilePath || "character",
      "_edited.png",
    );

    downloadUint8Array(updatedPngData, fileName, "image/png");
    setWorkspaceMessage(`Downloaded ${fileName}.`);
  }

  function handleBrowserDownloadJson() {
    if (!activeCard) {
      return;
    }

    const encodedCard = new TextEncoder().encode(
      JSON.stringify(activeCard, null, 2),
    );
    const fileName = createSafeCharacterFileName(
      activeCard.data.name || currentFilePath || "character",
      ".json",
    );

    downloadUint8Array(encodedCard, fileName, "application/json");
    setWorkspaceMessage(`Downloaded ${fileName}.`);
  }

  async function handleConvertActiveCardToPersona() {
    if (!activeCard) {
      return;
    }

    const persona = createPersonaArtifactFromCharacterCard(activeCard);
    await savePersonaLibraryItem(persona);
    setWorkspaceMessage(
      `Converted ${activeCard.data.name} into ${persona.name} and saved it to the persona library.`,
    );
  }

  function handleRouteMessyIntake() {
    const starterIntakeText = createStarterIntakeText(starterFields);
    const combinedIntakeText = joinDefined([messyIntakeText, starterIntakeText]);

    if (!combinedIntakeText.trim()) {
      setMessyIntakeMessage(
        "Paste rough character notes or fill at least one starter field before creating a character profile.",
      );
      return;
    }

    const result = createDraftCharacterCardFromIntake({
      currentCard: activeCard,
      intakeText: combinedIntakeText,
      sourceName: currentFilePath,
    });

    setActiveCard(result.card);
    setSelectedExpression(null);
    setMessyIntakeMessage(
      result.routedFieldNames.length
        ? `Routed ${result.routedFieldNames.length} fields into the character draft.`
        : "Started an editable blank character draft.",
    );
    setWorkspaceMessage(
      activeCard
        ? "Merged messy intake into the active character card."
        : "Created an editable character card draft from messy intake.",
    );
  }

  function handleApplyEditNotes() {
    if (!activeCard) {
      setEditNotesMessage(
        "Import, select, or create a character card before applying edit notes.",
      );
      return;
    }

    if (!editNotesText.trim()) {
      setEditNotesMessage(
        "Paste edit notes before applying changes to the active character card.",
      );
      return;
    }

    const result = createDraftCharacterCardFromIntake({
      currentCard: activeCard,
      intakeText: editNotesText,
      overwriteExistingFields: true,
      sourceName: currentFilePath,
    });

    setActiveCard(result.card);
    setSelectedExpression(null);
    setEditNotesMessage(
      result.routedFieldNames.length
        ? `Applied notes to ${result.routedFieldNames.length} character fields.`
        : "No structured card fields were found in those edit notes.",
    );
    setWorkspaceMessage("Applied edit notes to the active character card.");
  }

  function handleStartBlankDraft() {
    const draft = createBlankDraftCharacterCard("Untitled Character");

    setActiveCard(draft);
    setCurrentFilePath(null);
    setBrowserSourcePngData(null);
    setSelectedExpression(null);
    setWorkspaceMessage(
      "Started a blank editable character draft. Use the editor below or generate guided sections.",
    );
  }

  return (
    <StudioShell
      eyebrow="Character Cards"
      title="Character Card Studio"
      subtitle={currentFilePath ?? "No card loaded yet."}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            <PanelLeftOpen className="size-3.5" />
            Libraries
          </button>
          <button
            type="button"
            onClick={handleImportCardClick}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            Import
          </button>
          {activeCard && isDesktopRuntime ? (
            <>
              <button
                type="button"
                onClick={handleSaveMasterCharx}
                disabled={isSaving}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                title="Save this card as a CHARX master in the local card library."
              >
                {isSaving ? "Saving..." : "Save Master"}
              </button>
              <button
                type="button"
                onClick={handlePersistWorkspaceChanges}
                disabled={isSaving || !currentFilePath}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                title="Save edited data back to the active source file."
              >
                Save Source
              </button>
              <button
                type="button"
                onClick={handleSaveWorkspacePngAs}
                disabled={!canSavePngMetadata}
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 md:inline-flex"
                title={
                  canSavePngMetadata
                    ? "Save this card to a new PNG destination."
                    : "Save As PNG needs a PNG/APNG source image."
                }
              >
                Save PNG
              </button>
              <button
                type="button"
                onClick={handleExportWorkspaceCharx}
                disabled={!currentFilePath}
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 md:inline-flex"
              >
                Export CHARX...
              </button>
            </>
          ) : null}
          {activeCard && !isDesktopRuntime ? (
            <>
              <button
                type="button"
                onClick={handleBrowserDownloadPng}
                disabled={!browserSourcePngData}
                className="hidden rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50 md:inline-flex"
                title={
                  browserSourcePngData
                    ? "Download a PNG copy with the edited CCV3 metadata."
                    : "PNG download needs a PNG/APNG source card."
                }
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={handleBrowserDownloadJson}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                title="Download the edited CCV3 card as JSON."
              >
                Download JSON
              </button>
            </>
          ) : null}
        </div>
      }
    >
      <div className="relative grid gap-5">
        <DropZoneOverlay
          onAssetTranscoded={(filePath) =>
            setWorkspaceMessage(`Converted image asset to ${filePath}.`)
          }
          onCardParsed={(parsed, filePath, sourcePngData) => {
            handleCardLoaded(parsed, filePath, sourcePngData ?? null);
            setWorkspaceMessage(null);
          }}
          onDropError={setWorkspaceMessage}
        />

        <input
          ref={browserImportInputRef}
          type="file"
          accept=".png,.apng,.json,application/json,image/png,image/apng"
          className="sr-only"
          onChange={(event) => {
            void handleBrowserImportFile(event.currentTarget.files?.[0] ?? null);
            event.currentTarget.value = "";
          }}
        />

        <input
          ref={browserPngShellInputRef}
          type="file"
          accept=".png,.apng,image/png,image/apng"
          className="sr-only"
          onChange={(event) => {
            void handleBrowserImportFile(event.currentTarget.files?.[0] ?? null);
            event.currentTarget.value = "";
          }}
        />

        {libraryOpen ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close character library"
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setLibraryOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(24rem,calc(100vw-2rem))] max-w-full flex-col border-r bg-zinc-950 shadow-2xl">
              <button
                type="button"
                aria-label="Close character library"
                onClick={() => setLibraryOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-md border border-zinc-800 bg-zinc-950/90 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
              >
                <X className="size-4" />
              </button>
              <CardLibraryPanel
                className="h-full w-full border-0"
                library={library}
                onCardSelect={(filePath) => {
                  setLibraryOpen(false);
                  void handleCardSelect(filePath);
                }}
                onPersonaSelect={(persona) => {
                  setLibraryOpen(false);
                  setWorkspaceMessage(`Selected persona: ${persona.name}.`);
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="min-w-0 space-y-6">
          {workspaceMessage ? (
            <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
              {workspaceMessage}
            </p>
          ) : null}

          <section className="grid gap-3 lg:grid-cols-3">
            {characterWorkflowSteps.map((step, index) => (
              <Link
                key={step.mode}
                href={step.href}
                onClick={() => {
                  window.setTimeout(() => {
                    window.dispatchEvent(new Event("heartwriteai:workflow-mode"));
                  }, 0);
                }}
                className="group block"
                aria-current={workflowMode === step.mode ? "page" : undefined}
              >
                <div
                  className={[
                    "liquid-glass h-full rounded-[1.5rem] border p-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl",
                    workflowMode === step.mode
                      ? "ring-1 ring-[color:var(--liquid-accent)]"
                      : "",
                  ].join(" ")}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="liquid-icon flex size-11 items-center justify-center rounded-2xl text-muted-foreground">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          <section className="grid items-stretch gap-5 lg:grid-cols-3">
            <WorkflowPanel
              active={workflowMode === "create"}
              eyebrow="Step 1"
              icon={<UserRoundPlus className="size-4" />}
              title="Create / Intake"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p>
                    Paste messy character material or start with a blank draft.
                    Import a PNG shell when you want an empty card image to
                    become the finished character card.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleImportPngShellClick}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                      title="Import a PNG or APNG image as the shell for a new editable character card."
                    >
                      <FileUp className="size-3.5" />
                      Import PNG Shell
                    </button>
                    <button
                      type="button"
                      onClick={handleStartBlankDraft}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                    >
                      <UserRoundPlus className="size-3.5" />
                      Blank Draft
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Messy intake notes
                  </label>
                  <Textarea
                    value={messyIntakeText}
                    placeholder="Name, age, appearance, wants, fears, background, relationships, scenario, first message..."
                    className="min-h-44 resize-y"
                    onChange={(event) =>
                      setMessyIntakeText(event.currentTarget.value)
                    }
                  />
                  <details className="rounded-xl border bg-background/45 p-3">
                    <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Optional structured starter fields
                    </summary>
                    <div className="mt-3 grid gap-3">
                      {starterFieldDefinitions.map((field) => (
                        <label key={field.key} className="grid gap-1.5">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {field.label}
                          </span>
                          {field.rows ? (
                            <Textarea
                              value={starterFields[field.key]}
                              placeholder={field.placeholder}
                              className="min-h-20 resize-y text-sm"
                              onChange={(event) =>
                                setStarterFields((current) => ({
                                  ...current,
                                  [field.key]: event.currentTarget.value,
                                }))
                              }
                            />
                          ) : (
                            <input
                              value={starterFields[field.key]}
                              placeholder={field.placeholder}
                              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[color:var(--liquid-accent)]"
                              onChange={(event) =>
                                setStarterFields((current) => ({
                                  ...current,
                                  [field.key]: event.currentTarget.value,
                                }))
                              }
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </details>
                  <button
                    type="button"
                    onClick={handleRouteMessyIntake}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    <Sparkles className="size-4" />
                    Route to Profile
                  </button>
                  {messyIntakeMessage ? (
                    <p className="text-xs text-muted-foreground">
                      {messyIntakeMessage}
                    </p>
                  ) : null}
                </div>

                <details className="mt-auto rounded-xl border bg-background/45 p-3">
                  <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Batch folder intake
                  </summary>
                  <div className="mt-3">
                    <FolderIntakeReview
                      isDesktopRuntime={isDesktopRuntime}
                      onChooseFolder={triggerFolderIntakeSelect}
                      onImported={library.refresh}
                    />
                  </div>
                </details>
              </div>
            </WorkflowPanel>

            <WorkflowPanel
              active={workflowMode === "intake"}
              eyebrow="Step 2"
              icon={<Sparkles className="size-4" />}
              title="Edit / Review"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Edit notes for active card
                  </label>
                  <Textarea
                    value={editNotesText}
                    placeholder="Change age to 29. Update scenario. Add creator notes. Rewrite personality as..."
                    className="min-h-36 resize-y"
                    onChange={(event) =>
                      setEditNotesText(event.currentTarget.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={handleApplyEditNotes}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    <Sparkles className="size-4" />
                    Apply Edit Notes
                  </button>
                  {editNotesMessage ? (
                    <p className="text-xs text-muted-foreground">
                      {editNotesMessage}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border bg-background/55 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Active review
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    {activeCard?.data.name ?? "No character loaded"}
                  </h3>
                  <p className="mt-2 line-clamp-6 text-sm leading-6 text-muted-foreground">
                    {activeCard?.data.description?.trim() ||
                      activeCard?.data.personality?.trim() ||
                      "Import, create, or select a card to review the generated profile."}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    The full profile editor opens directly below this workflow.
                  </p>
                </div>
              </div>
            </WorkflowPanel>

            <WorkflowPanel
              active={workflowMode === "edit"}
              eyebrow="Step 3"
              icon={<Save className="size-4" />}
              title="Finalize / Export"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="rounded-xl border bg-background/55 p-4 text-sm text-muted-foreground">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                    Final card
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    {activeCard?.data.name ?? "No final card yet"}
                  </h3>
                  <p className="mt-2">
                    {currentFilePath ?? "Unsaved draft. Save a master or export a copy when ready."}
                  </p>
                </div>

                <div className="mt-auto grid gap-2 rounded-xl border bg-background/45 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Card data</span>
                    <span className={activeCard ? "font-semibold text-emerald-400" : "font-semibold text-muted-foreground"}>
                      {activeCard ? "Ready" : "Missing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">PNG source</span>
                    <span className={canSavePngMetadata || browserSourcePngData ? "font-semibold text-emerald-400" : "font-semibold text-muted-foreground"}>
                      {canSavePngMetadata || browserSourcePngData ? "Available" : "Optional"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Export actions</span>
                    <span className="font-semibold text-muted-foreground">
                      Top row
                    </span>
                  </div>
                </div>
              </div>
            </WorkflowPanel>
          </section>

          <section
            className={
              activeCard
                ? "grid gap-5 xl:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1fr)]"
                : "grid gap-5"
            }
          >
            <CharacterLibraryWorkspace
              activeCard={activeCard}
              currentFilePath={currentFilePath}
              library={library}
              onCardSelect={(filePath) => {
                void handleCardSelect(filePath);
              }}
              onConvertToPersona={() => {
                void handleConvertActiveCardToPersona();
              }}
              onOpenLibraryDrawer={() => setLibraryOpen(true)}
              sourcePngData={browserSourcePngData}
              variant="compact"
            />

            <div className="min-w-0 rounded-[1.75rem] border bg-card/65 p-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="liquid-icon flex size-10 items-center justify-center rounded-2xl text-muted-foreground">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Step 2 Workspace
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Profile Editor
                  </h2>
                </div>
              </div>

              {activeCard ? (
                <StructuredCardEditor
                  activeCard={activeCard}
                  setActiveCard={setActiveCard}
                />
              ) : (
                <div className="flex min-h-64 flex-col justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 p-6 text-center">
                  {currentFilePath ? (
                    <p className="font-mono text-xs text-zinc-400">
                      Cached selection: {currentFilePath}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Import, create, or select a PNG/JSON character card to
                      begin editing. CHARX and image-asset drops are available
                      in the desktop app.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <ExpressionManager
            activeCardPath={currentFilePath}
            onExpressionSelected={(sprite) => {
              setSelectedExpression(sprite);
              setWorkspaceMessage(`Selected expression sprite: ${sprite.name}`);
            }}
          />

          {selectedExpression ? (
            <p className="truncate rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-[10px] text-zinc-500">
              Active expression: {selectedExpression.raw_path}
            </p>
          ) : null}

          <DevToolsPanel onSeeded={library.refresh} />
        </div>
      </div>
    </StudioShell>
  );
}

function createSafeCharacterFileName(name: string, suffix: string) {
  const safeName = name
    .trim()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeName || "character"}${suffix}`;
}

function createStarterIntakeText(fields: Record<StarterFieldKey, string>) {
  return joinDefined([
    fields.name.trim() ? `Full Name: ${fields.name.trim()}` : "",
    fields.basicInfo.trim()
      ? `Basic Information:\n${fields.basicInfo.trim()}`
      : "",
    fields.appearance.trim()
      ? `Physical Appearance:\n${fields.appearance.trim()}`
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

function WorkflowPanel(props: {
  active: boolean;
  children: ReactNode;
  eyebrow: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section
      className={[
        "liquid-glass-strong grid gap-4 rounded-[1.75rem] border p-5",
        props.active ? "ring-1 ring-[color:var(--liquid-accent)]" : "",
      ].join(" ")}
    >
      <header className="flex items-start gap-3">
        <span className="liquid-icon flex size-11 shrink-0 items-center justify-center rounded-2xl text-muted-foreground">
          {props.icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {props.eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {props.title}
          </h2>
        </div>
      </header>
      {props.children}
    </section>
  );
}

function readWorkflowMode(): CharacterWorkflowMode {
  if (typeof window === "undefined") {
    return "edit";
  }

  const mode = new URLSearchParams(window.location.search).get("mode");

  return mode === "intake" || mode === "create" || mode === "edit"
    ? mode
    : "edit";
}

function subscribeToWorkflowModeChanges(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("heartwriteai:workflow-mode", onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("heartwriteai:workflow-mode", onStoreChange);
  };
}
