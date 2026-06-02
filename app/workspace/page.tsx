"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileUp,
  PanelLeftOpen,
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
import {
  compileFlirtingPresetAdditions,
  findFlirtingPresetById,
  FLIRTING_PRESETS,
} from "@/data/flirtingPresets";
import {
  compileOriginWoundPresetAdditions,
  findOriginWoundVocabularyPresetById,
  ORIGIN_WOUND_VOCABULARY_PRESETS,
} from "@/data/originWoundVocabularyPresets";
import {
  compileRelationshipDynamicVocabularyInjection,
  findRelationshipDynamicVocabularyById,
  RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS,
} from "@/data/relationshipDynamicVocabulary";
import {
  compileSpeechStylePresetSummary,
  findSpeechStylePresetById,
  SPEECH_STYLE_PRESETS,
} from "@/data/speechStylePresets";
import {
  compileVoiceVocabularyPresetAdditions,
  findVoiceVocabularyPresetById,
  VOICE_VOCABULARY_PRESETS,
} from "@/data/voiceVocabularyPresets";
import { importBrowserCharacterCardFile } from "@/lib/character-card/importBrowserCharacterCardFile";
import { consumePendingLibraryCardPath } from "@/lib/character-card/librarySelectionHandoff";
import { createCharacterCardV3Export } from "@/lib/character-card/createCharacterCardV3Export";
import {
  createBlankDraftCharacterCard,
  createDraftCharacterCardFromIntake,
} from "@/lib/character-card/createDraftCharacterCard";
import { importCharacterCardPngData } from "@/lib/character-card/importCharacterCardPngData";
import { scrubCardForPublicExport } from "@/lib/character-card/exportPrivacyScrubber";
import { writeCharacterCardToPng } from "@/lib/character-card/writeCharacterCardToPng";
import { ExpressionSprite } from "@/types/character-card/ExpressionSprite";
import { CharacterCardV3Schema } from "@/types/character-card/CharacterCardV3Schema";
import { ValidatedCharacterCardV3 } from "@/types/ccv3";

type StarterFieldKey =
  | "name"
  | "basicInfo"
  | "appearance"
  | "visualSeeds"
  | "personality"
  | "personalitySeeds"
  | "background"
  | "originWounds"
  | "formativeEvents"
  | "familyHistory"
  | "careerStatus"
  | "secrets"
  | "regrets"
  | "exile"
  | "betrayal"
  | "loss"
  | "ambition"
  | "relationshipDynamic"
  | "scenario"
  | "firstMessage";

const starterFieldDefinitions: Array<{
  key: StarterFieldKey;
  label: string;
  placeholder: string;
  rows?: number;
  section: "backstory" | "core" | "vibe" | "relationship" | "opening";
}> = [
  {
    key: "name",
    label: "Name",
    placeholder: "Magnus Vanderbilt",
    section: "core",
  },
  {
    key: "basicInfo",
    label: "Basic info",
    placeholder: "Age, role, gender/pronouns, location, occupation...",
    rows: 3,
    section: "core",
  },
  {
    key: "appearance",
    label: "Appearance",
    placeholder: "Height, build, hair, eyes, style, notable physical details...",
    rows: 3,
    section: "vibe",
  },
  {
    key: "visualSeeds",
    label: "Visual seed vocabulary",
    placeholder: "wavy hair, soft jaw, vintage tailoring, silver rings...",
    rows: 2,
    section: "vibe",
  },
  {
    key: "personality",
    label: "Personality",
    placeholder: "Core traits, wounds, habits, voice, behavior patterns...",
    rows: 3,
    section: "vibe",
  },
  {
    key: "personalitySeeds",
    label: "Soul sketch seeds",
    placeholder: "guarded, dry humor, secretly sentimental, observant...",
    rows: 2,
    section: "vibe",
  },
  {
    key: "background",
    label: "Backstory summary",
    placeholder: "A short overview of the past that shaped them...",
    rows: 3,
    section: "backstory",
  },
  {
    key: "originWounds",
    label: "Origin wound",
    placeholder: "The inner scar, insecurity, fear, or belief they carry...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "formativeEvents",
    label: "Formative event",
    placeholder: "The moment that pushed them onto their current path...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "familyHistory",
    label: "Family history",
    placeholder: "Family expectations, lineage, found family, absence, or old obligations...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "careerStatus",
    label: "Status and role",
    placeholder: "Current job, authority level, social position, reputation, or resource access...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "secrets",
    label: "Hidden secret",
    placeholder: "Something private, risky, shameful, protected, or not yet confessed...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "regrets",
    label: "Core regret",
    placeholder: "The choice, silence, failure, or missed chance they still replay...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "exile",
    label: "Exile profile",
    placeholder: "How they were separated from home, comfort, belonging, or their former life...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "betrayal",
    label: "Past betrayal",
    placeholder: "A breach of trust that changed what they believe about people...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "loss",
    label: "Critical loss",
    placeholder: "The person, place, title, object, safety, or future they cannot fully replace...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "ambition",
    label: "Core ambition",
    placeholder: "What they want now, and what they are willing or unwilling to risk for it...",
    rows: 2,
    section: "backstory",
  },
  {
    key: "relationshipDynamic",
    label: "Relationship dynamic",
    placeholder: "caretaker, rivals, forbidden, complement, friction...",
    rows: 2,
    section: "relationship",
  },
  {
    key: "scenario",
    label: "Scenario",
    placeholder: "{{user}} walks into his office after everyone else has gone home.",
    rows: 3,
    section: "relationship",
  },
  {
    key: "firstMessage",
    label: "First message",
    placeholder: "\"You weren't supposed to see this.\"",
    rows: 3,
    section: "opening",
  },
];

const emptyStarterFields: Record<StarterFieldKey, string> = {
  ambition: "",
  appearance: "",
  basicInfo: "",
  background: "",
  betrayal: "",
  careerStatus: "",
  exile: "",
  familyHistory: "",
  firstMessage: "",
  formativeEvents: "",
  loss: "",
  name: "",
  originWounds: "",
  personality: "",
  personalitySeeds: "",
  regrets: "",
  relationshipDynamic: "",
  scenario: "",
  secrets: "",
  visualSeeds: "",
};

const starterSections: Array<{
  description: string;
  id: "backstory" | "core" | "vibe" | "relationship" | "opening";
  label: string;
}> = [
  {
    id: "core",
    label: "Core identity",
    description: "Name, role, basic facts, and the simplest version of who they are.",
  },
  {
    id: "vibe",
    label: "Look, aura, and soul",
    description: "Appearance, aesthetic, personality, and distinctive texture.",
  },
  {
    id: "backstory",
    label: "Backstory dimensions",
    description: "Optional deeper history fields for wounds, losses, secrets, regrets, and current ambition.",
  },
  {
    id: "relationship",
    label: "History and dynamic",
    description: "Relationship pressure and the active scene.",
  },
  {
    id: "opening",
    label: "Opening hook",
    description: "The first message that gives the player something irresistible to answer.",
  },
];

const creatorTemplates = [
  {
    id: "slow_burn_rivals",
    label: "Slow Burn Rivals",
    values: {
      personalitySeeds: "competitive, observant, proud, secretly protective",
      relationshipDynamic: "rivals with mutual respect, friction, unresolved attraction",
      scenario:
        "{{char}} and {{user}} are forced to work together after a public disagreement makes backing out impossible.",
      firstMessage:
        "*{{char}} looks up from the file with a measured, unimpressed stare.* \"Try to keep up. I would hate for this to be embarrassing for both of us.\"",
    },
  },
  {
    id: "caretaker_pull",
    label: "Caretaker Pull",
    values: {
      personalitySeeds: "controlled, gentle under pressure, stubbornly attentive",
      relationshipDynamic: "caretaker tension, reluctant vulnerability, protective friction",
      scenario:
        "{{user}} arrives hurt or exhausted, and {{char}} has to choose between emotional distance and immediate care.",
      firstMessage:
        "*{{char}} closes the door with more force than necessary, eyes dropping to the state of you.* \"Sit down before you make that worse.\"",
    },
  },
  {
    id: "forbidden_alliance",
    label: "Forbidden Alliance",
    values: {
      personalitySeeds: "disciplined, watchful, loyal to a fault, tempted by defiance",
      relationshipDynamic: "forbidden, high-stakes trust, public distance and private honesty",
      scenario:
        "{{char}} and {{user}} should not be alone together, but the situation leaves them with no safer option.",
      firstMessage:
        "*The lock clicks behind you. {{char}} does not move away.* \"Whatever happens next, you were never here. Do you understand me?\"",
    },
  },
  {
    id: "soft_complement",
    label: "Soft Complement",
    values: {
      personalitySeeds: "warm, grounded, quietly funny, steady when others spiral",
      relationshipDynamic: "complement, safe honesty, mutual support, gentle chemistry",
      scenario:
        "{{char}} notices {{user}} trying to hide a bad day and decides not to let them disappear into it.",
      firstMessage:
        "*{{char}} sets a cup down beside you without making a performance of it.* \"You do not have to talk. But you do have to stop pretending I cannot tell.\"",
    },
  },
];

const seedVocabulary = {
  appearance: [
    "wavy hair",
    "soft jaw",
    "sharp cheekbones",
    "sleepy eyes",
    "sun-warmed skin",
    "ink-stained fingers",
    "tailored coat",
    "silver rings",
    "old scar",
    "restless hands",
  ],
  backstory: [
    "old family obligation",
    "exile from home",
    "public disgrace",
    "private grief",
    "unfinished promise",
    ...ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id),
  ],
  personality: [
    "guarded",
    "dry humor",
    "secretly sentimental",
    "fiercely competent",
    "hyper-observant",
    "gentle but stubborn",
    "dangerously charming",
    "principled",
    "touch-starved",
    "quietly intense",
    ...SPEECH_STYLE_PRESETS.map((preset) => preset.id),
    ...VOICE_VOCABULARY_PRESETS.map((preset) => preset.id),
  ],
  relationship: [
    "complement",
    "friction",
    "forbidden",
    "rivals",
    "caretaker",
    "mentor tension",
    "second chance",
    "protective distance",
    "fake alliance",
    "slow burn",
    ...RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.map((preset) => preset.id),
    ...FLIRTING_PRESETS.map((preset) => preset.id),
  ],
};

const MAX_BROWSER_PNG_SHELL_BYTES = 20 * 1024 * 1024;

interface PendingPngMetadataChoice {
  blankCard: ValidatedCharacterCardV3;
  filePath: string;
  sourcePngData: Uint8Array | null;
  storedCard: ValidatedCharacterCardV3;
}

export default function WorkspacePage() {
  const [activeCard, setActiveCard] =
    useState<ValidatedCharacterCardV3 | null>(null);
  const [workspaceMessage, setWorkspaceMessage] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [browserSourcePngData, setBrowserSourcePngData] =
    useState<Uint8Array | null>(null);
  const [editNotesText, setEditNotesText] = useState("");
  const [editNotesMessage, setEditNotesMessage] = useState<string | null>(null);
  const [selectedExpression, setSelectedExpression] =
    useState<ExpressionSprite | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [pendingMetadataChoice, setPendingMetadataChoice] =
    useState<PendingPngMetadataChoice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const browserImportInputRef = useRef<HTMLInputElement | null>(null);
  const library = useCardLibrary(12);
  const { importCardFromPath, saveCard, saveWorkspaceChanges } =
    useCharacterLibrary();
  const {
    isDesktopRuntime,
    triggerCharxExport,
    triggerCharacterFileSelect,
    triggerFolderIntakeSelect,
    triggerPngMetadataSave,
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
      if (isMissingFilePathMessage(result.error)) {
        await library.removePath(filePath);
      }
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
      setWorkspaceMessage("Use the browser file picker or drag a PNG/JSON card onto the page.");
      return;
    }

    const selectedPath = await triggerCharacterFileSelect();
    if (!selectedPath) {
      return;
    }

    await handleDesktopSelectedCharacterFile(selectedPath);
  }

  function handleImportCardClick() {
    if (isDesktopRuntime) {
      void handleManualImportClick();
      return;
    }

    browserImportInputRef.current?.click();
  }

  async function handleBrowserImportFile(file: File | null) {
    if (!file) {
      return;
    }

    setWorkspaceMessage(`Loading ${file.name}...`);

    try {
      if (isBrowserPngFile(file)) {
        await handleBrowserPngCharacterFile(file);
        return;
      }

      const result = await importBrowserCharacterCardFile(file);
      handleCardLoaded(result.card, result.path, result.sourcePngData);
      setWorkspaceMessage(`Loaded ${result.card.data.name} from ${result.path}.`);
    } catch (error) {
      setWorkspaceMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function handleDesktopSelectedCharacterFile(filePath: string) {
    if (isPngPath(filePath)) {
      const result = await importCardFromPath(filePath);
      if (result.card) {
        setPendingMetadataChoice({
          blankCard: createBlankDraftCharacterCard(filePath),
          filePath,
          sourcePngData: null,
          storedCard: result.card,
        });
        setWorkspaceMessage(
          "This PNG contains stored character-card data. Choose whether to import it or use the image only.",
        );
        return;
      }

      if (isMissingCardMetadataMessage(result.error)) {
        const blankCard = createBlankDraftCharacterCard(filePath);
        handleCardLoaded(blankCard, filePath, null);
        setWorkspaceMessage(`Started a blank character using ${filePath} as the portrait.`);
        return;
      }

      setWorkspaceMessage(result.error ?? `Could not read ${filePath}.`);
      return;
    }

    const result = await importCardFromPath(filePath);
    if (result.card) {
      handleCardLoaded(result.card, filePath, null);
      setWorkspaceMessage(`Loaded ${result.card.data.name} from ${filePath}.`);
    } else {
      setWorkspaceMessage(result.error ?? `Could not load ${filePath}.`);
    }
  }

  useEffect(() => {
    const pendingFilePath = consumePendingLibraryCardPath();
    if (!pendingFilePath) {
      return;
    }

    if (!isDesktopRuntime) {
      queueMicrotask(() => {
        setWorkspaceMessage(
          "Selected library cards can only be opened inside the desktop app.",
        );
      });
      return;
    }

    void handleDesktopSelectedCharacterFile(pendingFilePath);
    // The handoff is a one-shot localStorage event consumed on page mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleBrowserPngCharacterFile(file: File) {
    if (file.size > MAX_BROWSER_PNG_SHELL_BYTES) {
      setWorkspaceMessage(
        "PNG is too large for browser import. Use the desktop app for oversized images.",
      );
      return;
    }

    const pngData = new Uint8Array(await file.arrayBuffer());
    const blankCard = createBlankDraftCharacterCard(file.name);

    try {
      const importedData = importCharacterCardPngData(file.name, pngData);
      const storedCard = CharacterCardV3Schema.parse(
        createCharacterCardV3Export(importedData.card),
      );

      setPendingMetadataChoice({
        blankCard,
        filePath: file.name,
        sourcePngData: pngData,
        storedCard,
      });
      setWorkspaceMessage(
        "This PNG contains stored character-card data. Choose whether to import it or use the image only.",
      );
    } catch (error) {
      if (!isMissingBrowserCardMetadataError(error)) {
        throw error;
      }

      handleCardLoaded(blankCard, file.name, pngData);
      setWorkspaceMessage(`Started a blank character using ${file.name} as the portrait.`);
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

    const publicCard = scrubCardForPublicExport(activeCard);
    const encodedCard = new TextEncoder().encode(JSON.stringify(publicCard, null, 2));
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

  function handleRouteCharacterIntake(combinedIntakeText: string) {
    const result = createDraftCharacterCardFromIntake({
      currentCard: activeCard,
      intakeText: combinedIntakeText,
      sourceName: currentFilePath,
    });

    setActiveCard(result.card);
    setSelectedExpression(null);
    setWorkspaceMessage(
      activeCard
        ? "Merged messy intake into the active character card."
        : "Created an editable character card draft from messy intake.",
    );

    return result.routedFieldNames.length
      ? `Routed ${result.routedFieldNames.length} fields into the character draft.`
      : "Started an editable blank character draft.";
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
            if (isPngPath(filePath)) {
              if (isDraftPngShellCard(parsed)) {
                handleCardLoaded(parsed, filePath, sourcePngData ?? null);
                setWorkspaceMessage(
                  `Started a blank character using ${filePath} as the portrait.`,
                );
                return;
              }

              setPendingMetadataChoice({
                blankCard: createBlankDraftCharacterCard(filePath),
                filePath,
                sourcePngData: sourcePngData ?? null,
                storedCard: parsed,
              });
              setWorkspaceMessage(
                "This PNG contains stored character-card data. Choose whether to import it or use the image only.",
              );
              return;
            }

            handleCardLoaded(parsed, filePath, sourcePngData ?? null);
            setWorkspaceMessage(null);
          }}
          onDropError={setWorkspaceMessage}
          onImageOnlyPng={(filePath, sourcePngData) => {
            const blankCard = createBlankDraftCharacterCard(filePath);
            handleCardLoaded(blankCard, filePath, sourcePngData ?? null);
            setWorkspaceMessage(`Started a blank character using ${filePath} as the portrait.`);
          }}
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

        {pendingMetadataChoice ? (
          <PngMetadataChoiceModal
            filePath={pendingMetadataChoice.filePath}
            storedCardName={pendingMetadataChoice.storedCard.data.name}
            onCancel={() => setPendingMetadataChoice(null)}
            onUseImageOnly={() => {
              handleCardLoaded(
                pendingMetadataChoice.blankCard,
                pendingMetadataChoice.filePath,
                pendingMetadataChoice.sourcePngData,
              );
              setWorkspaceMessage(
                `Started a blank character using ${pendingMetadataChoice.filePath} as the portrait.`,
              );
              setPendingMetadataChoice(null);
            }}
            onUseStoredCharacter={() => {
              handleCardLoaded(
                pendingMetadataChoice.storedCard,
                pendingMetadataChoice.filePath,
                pendingMetadataChoice.sourcePngData,
              );
              setWorkspaceMessage(
                `Imported ${pendingMetadataChoice.storedCard.data.name} from stored PNG metadata.`,
              );
              setPendingMetadataChoice(null);
            }}
          />
        ) : null}

        <div className="min-w-0 space-y-6">
          {workspaceMessage ? (
            <p className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
              {workspaceMessage}
            </p>
          ) : null}

          <section className="grid gap-5 xl:grid-cols-[minmax(22rem,0.72fr)_minmax(0,1fr)]">
            <div className="grid gap-5">
              <div className="liquid-glass-strong grid gap-4 rounded-[1.75rem] border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Character portrait
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Upload art, then write the card.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      PNGs with CCV2 or CCV3 data ask whether to import the
                      stored character. Plain PNGs become a blank portrait shell.
                    </p>
                  </div>
                  <span className="liquid-icon flex size-12 shrink-0 items-center justify-center rounded-2xl text-muted-foreground">
                    <FileUp className="size-5" />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleImportCardClick}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    <FileUp className="size-4" />
                    Upload PNG or Card
                  </button>
                  <button
                    type="button"
                    onClick={handleStartBlankDraft}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <UserRoundPlus className="size-4" />
                    Blank Character
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <PanelLeftOpen className="size-4" />
                    Library
                  </button>
                </div>
              </div>

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
            </div>

            <div className="liquid-glass-strong grid gap-4 rounded-[1.75rem] border p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Character sketch
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  One-page creator
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Fill only what you know. Routing merges these fields into the
                  active card or creates a new blank draft.
                </p>
              </div>
              <CharacterIntakeComposer onRoute={handleRouteCharacterIntake} />
            </div>
          </section>

          <details className="rounded-[1.5rem] border bg-card/65 p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Advanced CCV3 editor and batch tools
            </summary>
            <div className="mt-5 grid gap-5">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)]">
                <div className="min-w-0 rounded-[1.25rem] border bg-background/45 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="liquid-icon flex size-10 items-center justify-center rounded-2xl text-muted-foreground">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Full card fields
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
                      <p className="text-sm text-zinc-500">
                        Upload art, import a card, or start a blank character
                        to open the full CCV3 editor.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid content-start gap-4">
                  <div className="rounded-xl border bg-background/45 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Edit notes for active card
                    </label>
                    <Textarea
                      value={editNotesText}
                      placeholder="Change age to 29. Update scenario. Add creator notes. Rewrite personality as..."
                      className="mt-2 min-h-36 resize-y"
                      onChange={(event) =>
                        setEditNotesText(event.currentTarget.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={handleApplyEditNotes}
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      <Sparkles className="size-4" />
                      Apply Edit Notes
                    </button>
                    {editNotesMessage ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {editNotesMessage}
                      </p>
                    ) : null}
                  </div>

                  <details className="rounded-xl border bg-background/45 p-4">
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
              </div>
            </div>
          </details>

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
    fields.visualSeeds.trim()
      ? `Visual Details:\n${fields.visualSeeds.trim()}`
      : "",
    fields.personality.trim()
      ? `Personality:\n${fields.personality.trim()}`
      : "",
    fields.personalitySeeds.trim()
      ? `Personality Notes:\n${fields.personalitySeeds.trim()}`
      : "",
    createBackstoryDimensionsText(fields),
    createCompiledVocabularySeedText(fields),
    fields.relationshipDynamic.trim()
      ? `Relationships:\nDynamic with {{user}}: ${fields.relationshipDynamic.trim()}`
      : "",
    fields.scenario.trim() ? `Scenario:\n${fields.scenario.trim()}` : "",
    fields.firstMessage.trim()
      ? `First Message:\n${fields.firstMessage.trim()}`
      : "",
  ]);
}

function createCompiledVocabularySeedText(fields: Record<StarterFieldKey, string>) {
  const relationshipVocabularyAdditions = findPresetMatches(
    fields.relationshipDynamic,
    findRelationshipDynamicVocabularyById,
  ).map((preset) => {
    const injection = compileRelationshipDynamicVocabularyInjection(preset);
    return joinDefined([
      `Relationship vocabulary preset: ${preset.vibe}.`,
      injection.lexicalConstraints,
      injection.formattingDirectives,
      injection.systemBehavior,
    ]);
  });

  const flirtingAdditions = findPresetMatches(
    fields.relationshipDynamic,
    findFlirtingPresetById,
  ).map((preset) => {
    const additions = compileFlirtingPresetAdditions(preset);
    return joinDefined([
      additions.personalityAddition,
      additions.scenarioAddition,
      additions.systemPromptAddition,
    ]);
  });

  const originWoundAdditions = findPresetMatches(
    fields.originWounds,
    findOriginWoundVocabularyPresetById,
  ).map((preset) => {
    const additions = compileOriginWoundPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });

  const speechStyleAdditions = findPresetMatches(
    fields.personalitySeeds,
    findSpeechStylePresetById,
  ).map(compileSpeechStylePresetSummary);

  const voiceVocabularyAdditions = findPresetMatches(
    fields.personalitySeeds,
    findVoiceVocabularyPresetById,
  ).map((preset) => {
    const additions = compileVoiceVocabularyPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.lexicalGuidance,
      additions.systemPromptAddition,
    ]);
  });

  return joinDefined([
    relationshipVocabularyAdditions.length
      ? `Relationships:\n${relationshipVocabularyAdditions.join("\n\n")}`
      : "",
    flirtingAdditions.length
      ? `Scenario:\n${flirtingAdditions.join("\n\n")}`
      : "",
    originWoundAdditions.length
      ? `Background Story:\n${originWoundAdditions.join("\n\n")}`
      : "",
    speechStyleAdditions.length || voiceVocabularyAdditions.length
      ? `Speech Style:\n${joinDefined([...speechStyleAdditions, ...voiceVocabularyAdditions])}`
      : "",
  ]);
}

function createBackstoryDimensionsText(fields: Record<StarterFieldKey, string>) {
  const dimensionLines = [
    ["Origin wound", fields.originWounds],
    ["Formative event", fields.formativeEvents],
    ["Family history", fields.familyHistory],
    ["Status and role", fields.careerStatus],
    ["Hidden secret", fields.secrets],
    ["Core regret", fields.regrets],
    ["Exile profile", fields.exile],
    ["Past betrayal", fields.betrayal],
    ["Critical loss", fields.loss],
    ["Core ambition", fields.ambition],
  ]
    .map(([label, value]) => {
      const trimmedValue = value.trim();
      return trimmedValue ? `${label}: ${trimmedValue}` : "";
    })
    .filter(Boolean);

  return joinDefined([
    fields.background.trim(),
    ...dimensionLines,
  ])
    ? `Background Story:\n${joinDefined([fields.background.trim(), ...dimensionLines])}`
    : "";
}

function joinDefined(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n\n");
}

function findPresetMatches<T>(
  rawText: string,
  findById: (id: string) => T | undefined,
): T[] {
  const matches: T[] = [];
  const seen = new Set<T>();

  for (const token of tokenizeSeedInput(rawText)) {
    const match = findById(token);
    if (!match || seen.has(match)) continue;
    seen.add(match);
    matches.push(match);
  }

  return matches;
}

function tokenizeSeedInput(rawText: string) {
  return rawText
    .split(/[\n,;|]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function CharacterIntakeComposer(props: {
  onRoute: (combinedIntakeText: string) => string;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [imagePromptPreview, setImagePromptPreview] = useState<string | null>(
    null,
  );

  function readStarterFields() {
    const formData = new FormData(formRef.current ?? undefined);
    return starterFieldDefinitions.reduce(
      (fields, field) => ({
        ...fields,
        [field.key]: readFormString(formData, field.key),
      }),
      emptyStarterFields,
    );
  }

  function handleRoute() {
    const formData = new FormData(formRef.current ?? undefined);
    const messyIntakeText = readFormString(formData, "messyIntakeText");
    const starterFields = readStarterFields();
    const starterIntakeText = createStarterIntakeText(starterFields);
    const combinedIntakeText = joinDefined([messyIntakeText, starterIntakeText]);

    if (!combinedIntakeText.trim()) {
      setMessage(
        "Paste rough character notes or fill at least one starter field before creating a character profile.",
      );
      return;
    }

    setMessage(props.onRoute(combinedIntakeText));
  }

  function handleApplyTemplate(templateId: string) {
    const template = creatorTemplates.find((item) => item.id === templateId);
    const form = formRef.current;
    if (!template || !form) {
      return;
    }

    for (const [key, value] of Object.entries(template.values)) {
      appendFormValue(form, key, value);
    }

    setMessage(`Filled blank sections from ${template.label}.`);
  }

  function handleAddSeed(fieldKey: StarterFieldKey, value: string) {
    const form = formRef.current;
    if (!form || !value.trim()) {
      return;
    }

    appendFormValue(form, fieldKey, value.trim());
  }

  function handleBuildImagePromptPreview() {
    const fields = readStarterFields();
    setImagePromptPreview(createImagePromptPreview(fields));
  }

  return (
    <form
      ref={formRef}
      className="grid gap-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <details className="rounded-xl border bg-background/45 p-3">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Reusable templates
        </summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {creatorTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleApplyTemplate(template.id)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-left text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              {template.label}
              <span className="mt-1 block text-[11px] font-normal leading-4 text-muted-foreground">
                Fills blanks for dynamic, scenario, opening, and texture.
              </span>
            </button>
          ))}
        </div>
      </details>

      {starterSections.map((section, index) => (
        <details
          key={section.id}
          className="rounded-xl border bg-background/45 p-3"
          open={index < 2}
        >
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {section.label}
          </summary>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {section.description}
          </p>
          <div className="mt-3 grid gap-3">
            {starterFieldDefinitions
              .filter((field) => field.section === section.id)
              .map((field) => (
                <StarterInput key={field.key} field={field} />
              ))}

            {section.id === "vibe" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <SeedCombo
                  datalistId="appearance-seeds"
                  label="Add appearance seed"
                  name="appearanceSeedCustom"
                  options={seedVocabulary.appearance}
                  onAdd={(value) => handleAddSeed("visualSeeds", value)}
                />
                <SeedCombo
                  datalistId="personality-seeds"
                  label="Add soul seed"
                  name="personalitySeedCustom"
                  options={seedVocabulary.personality}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="speech-style-seeds"
                  label="Add speech preset"
                  name="speechStyleSeedCustom"
                  options={SPEECH_STYLE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="voice-vocabulary-seeds"
                  label="Add voice vocabulary"
                  name="voiceVocabularySeedCustom"
                  options={VOICE_VOCABULARY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
              </div>
            ) : null}

            {section.id === "backstory" ? (
              <SeedCombo
                datalistId="origin-wound-seeds"
                label="Add origin wound preset"
                name="originWoundSeedCustom"
                options={seedVocabulary.backstory}
                onAdd={(value) => handleAddSeed("originWounds", value)}
              />
            ) : null}

            {section.id === "relationship" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <SeedCombo
                  datalistId="relationship-dynamic-seeds"
                  label="Add relationship dynamic"
                  name="relationshipSeedCustom"
                  options={seedVocabulary.relationship}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="flirting-style-seeds"
                  label="Add flirting style"
                  name="flirtingSeedCustom"
                  options={FLIRTING_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
              </div>
            ) : null}
          </div>
        </details>
      ))}

      <details className="rounded-xl border bg-background/45 p-3">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Rough notes paste box
        </summary>
        <div className="mt-3 grid gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Extra messy intake
          </label>
          <textarea
            data-no-field-copy="true"
            name="messyIntakeText"
            placeholder="Paste loose notes, sample dialogue, traits, scenario fragments, or imported profile text..."
            className="min-h-32 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            spellCheck={false}
          />
        </div>
      </details>

      <details className="rounded-xl border bg-background/45 p-3">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Image prompt output
        </summary>
        <div className="mt-3 grid gap-3">
          <p className="text-xs leading-5 text-muted-foreground">
            Drafts a later-use image prompt from the appearance and style fields.
            It does not create an image yet.
          </p>
          <button
            type="button"
            onClick={handleBuildImagePromptPreview}
            className="w-fit rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            Build Prompt Preview
          </button>
          {imagePromptPreview ? (
            <textarea
              readOnly
              value={imagePromptPreview}
              className="min-h-28 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none text-muted-foreground"
            />
          ) : null}
        </div>
      </details>

      <button
        type="button"
        onClick={handleRoute}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
      >
        <Sparkles className="size-4" />
        Route to Profile
      </button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </form>
  );
}

function StarterInput(props: {
  field: (typeof starterFieldDefinitions)[number];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        {props.field.label}
      </span>
      {props.field.rows ? (
        <textarea
          data-no-field-copy="true"
          name={props.field.key}
          placeholder={props.field.placeholder}
          className="min-h-20 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
          spellCheck={false}
        />
      ) : (
        <input
          autoComplete="off"
          data-no-field-copy="true"
          name={props.field.key}
          placeholder={props.field.placeholder}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[color:var(--liquid-accent)]"
          spellCheck={false}
        />
      )}
    </label>
  );
}

function SeedCombo(props: {
  datalistId: string;
  label: string;
  name: string;
  onAdd: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="grid gap-2 rounded-lg border bg-card/50 p-3">
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          {props.label}
        </span>
        <input
          autoComplete="off"
          data-no-field-copy="true"
          list={props.datalistId}
          name={props.name}
          placeholder="Choose a seed or type anything..."
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-[color:var(--liquid-accent)]"
          spellCheck={false}
        />
      </label>
      <datalist id={props.datalistId}>
        {props.options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-1.5">
        {props.options.slice(0, 6).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => props.onAdd(option)}
            className="rounded-full border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {option}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={(event) => {
          const field = event.currentTarget
            .closest("div")
            ?.querySelector<HTMLInputElement>(`input[name="${props.name}"]`);
          const value = field?.value.trim() ?? "";
          props.onAdd(value);
          if (field) {
            field.value = "";
          }
        }}
        className="w-fit rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
      >
        Add Custom
      </button>
    </div>
  );
}

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function appendFormValue(form: HTMLFormElement, key: string, value: string) {
  const field = form.elements.namedItem(key);
  if (
    !field ||
    !("value" in field) ||
    typeof field.value !== "string" ||
    !value.trim()
  ) {
    return;
  }

  field.value = joinCommaList([field.value, value]);
}

function joinCommaList(values: string[]) {
  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, allValues) => allValues.indexOf(value) === index)
    .join(", ");
}

function createImagePromptPreview(fields: Record<StarterFieldKey, string>) {
  const naturalLanguage = joinDefined([
    fields.name.trim() ? `Character portrait of ${fields.name.trim()}.` : "",
    fields.basicInfo.trim(),
    fields.appearance.trim(),
    fields.visualSeeds.trim(),
    fields.personalitySeeds.trim()
      ? `Mood and presence: ${fields.personalitySeeds.trim()}.`
      : "",
  ]);

  const tagPrompt = joinCommaList([
    fields.visualSeeds,
    fields.appearance,
    fields.personalitySeeds,
    "character portrait",
    "expressive eyes",
    "high detail",
  ]);

  return joinDefined([
    "Natural language prompt:",
    naturalLanguage || "Add appearance details to generate a prompt preview.",
    "Tag-style prompt:",
    tagPrompt,
  ]);
}

function PngMetadataChoiceModal(props: {
  filePath: string;
  onCancel: () => void;
  onUseImageOnly: () => void;
  onUseStoredCharacter: () => void;
  storedCardName: string;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.5rem] border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Stored character found
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Use this PNG&apos;s card data?
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cancel import"
            onClick={props.onCancel}
            className="rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 rounded-xl border bg-background/55 p-4 text-sm text-muted-foreground">
          <p>
            This image contains CCV2/CCV3-style character metadata for{" "}
            <span className="font-semibold text-foreground">
              {props.storedCardName || "Untitled Character"}
            </span>
            .
          </p>
          <p className="break-all font-mono text-xs">{props.filePath}</p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={props.onUseStoredCharacter}
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Use Stored Character
          </button>
          <button
            type="button"
            onClick={props.onUseImageOnly}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Use Image Only
          </button>
        </div>
      </div>
    </div>
  );
}

function isPngPath(filePath: string) {
  return /\.(apng|png)$/i.test(filePath);
}

function isBrowserPngFile(file: File) {
  const normalizedName = file.name.toLowerCase();
  return (
    normalizedName.endsWith(".png") ||
    normalizedName.endsWith(".apng") ||
    file.type === "image/png" ||
    file.type === "image/apng"
  );
}

function isMissingCardMetadataMessage(message: string | null | undefined) {
  return Boolean(
    message &&
      (message.includes("No character card metadata") ||
        message.includes("supported character card metadata")),
  );
}

function isMissingBrowserCardMetadataError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("supported character card metadata")
  );
}

function isMissingFilePathMessage(message: string | null | undefined) {
  return Boolean(
    message &&
      (message.includes("does not exist") ||
        message.includes("no longer exists") ||
        message.includes("could not be found") ||
        message.includes("No such file")),
  );
}

function isDraftPngShellCard(card: ValidatedCharacterCardV3) {
  const tags = new Set(card.data.tags.map((tag) => tag.toLowerCase()));

  return (
    tags.has("draft") &&
    tags.has("messy intake") &&
    !card.data.personality.trim() &&
    !card.data.scenario.trim() &&
    !card.data.first_mes.trim()
  );
}
