"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import {
  CopyPlus,
  Download,
  FilePlus2,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

import CopyButton from "@/components/copy-button";
import { SearchableSeedPicker } from "@/components/searchable-seed-picker";
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
import {
  compileComplementVocabularyAdditions,
  findComplementVocabularyById,
  COMPLEMENT_VOCABULARY_PRESETS,
} from "@/data/complementPresets";
import {
  compileArrangedMatchPresetAdditions,
  findArrangedMatchPresetById,
  ARRANGED_MATCH_PRESETS,
} from "@/data/arrangedMatchPresets";
import {
  compileCommunicationStylePresetAdditions,
  findCommunicationStylePresetById,
  COMMUNICATION_STYLE_PRESETS,
} from "@/data/communicationStylePresets";
import {
  compileConflictStylePresetAdditions,
  findConflictStylePresetById,
  CONFLICT_STYLE_PRESETS,
} from "@/data/conflictStylePresets";
import {
  compileAmbitionPresetAdditions,
  findAmbitionPresetById,
  AMBITION_PRESETS,
} from "@/data/ambitionPresets";
import {
  compileAffectionPresetAdditions,
  findAffectionPresetById,
  AFFECTION_PRESETS,
} from "@/data/affectionPresets";
import {
  compileLoyaltyPresetAdditions,
  findLoyaltyPresetById,
  LOYALTY_PRESETS,
} from "@/data/loyaltyPresets";
import {
  compileLoveLanguagePresetAdditions,
  findLoveLanguagePresetById,
  LOVE_LANGUAGE_PRESETS,
} from "@/data/loveLanguagePresets";
import {
  compileMoralityPresetAdditions,
  findMoralityPresetById,
  MORALITY_PRESETS,
} from "@/data/moralityPresets";
import {
  compileDialectPresetAdditions,
  findDialectPresetById,
  DIALECT_PRESETS,
} from "@/data/dialectPresets";
import {
  compileFamilyHistoryPresetAdditions,
  findFamilyHistoryPresetById,
  FAMILY_HISTORY_PRESETS,
} from "@/data/familyHistoryPresets";
import {
  compileBetrayalPresetAdditions,
  findBetrayalPresetById,
  BETRAYAL_PRESETS,
} from "@/data/betrayalPresets";
import {
  compileExilePresetAdditions,
  findExilePresetById,
  EXILE_PRESETS,
} from "@/data/exilePresets";
import {
  compileFatedReincarnationPresetAdditions,
  findFatedReincarnationPresetById,
  FATED_REINCARNATION_PRESETS,
} from "@/data/fatedReincarnationPresets";
import {
  compileFakeDatingPresetAdditions,
  findFakeDatingPresetById,
  FAKE_DATING_PRESETS,
} from "@/data/fakeDatingPresets";
import {
  compileForbiddenTabooPresetAdditions,
  findForbiddenTabooPresetById,
  FORBIDDEN_TABOO_PRESETS,
} from "@/data/forbiddenTabooPresets";
import {
  compileMentorProtegePresetAdditions,
  findMentorProtegePresetById,
  MENTOR_PROTEGE_PRESETS,
} from "@/data/mentorProtegePresets";
import {
  compileFlirtingPresetAdditions,
  findFlirtingPresetById,
  FLIRTING_PRESETS,
} from "@/data/flirtingPresets";
import {
  compileFriendsToLoversPresetAdditions,
  findFriendsToLoversPresetById,
  FRIENDS_TO_LOVERS_PRESETS,
} from "@/data/friendsToLoversPresets";
import {
  compileFormativeEventPresetAdditions,
  findFormativeEventPresetById,
  FORMATIVE_EVENT_PRESETS,
} from "@/data/formativeEventPresets";
import {
  compileFormalityPresetAdditions,
  findFormalityPresetById,
  FORMALITY_PRESETS,
} from "@/data/formalityPresets";
import {
  compileGrumpySunshinePresetAdditions,
  findGrumpySunshinePresetById,
  GRUMPY_SUNSHINE_PRESETS,
} from "@/data/grumpySunshinePresets";
import {
  compileDarkObsessivePresetAdditions,
  findDarkObsessivePresetById,
  DARK_OBSESSIVE_PRESETS,
} from "@/data/darkObsessivePresets";
import {
  compileFormalArrangedPresetAdditions,
  findFormalArrangedPresetById,
  FORMAL_ARRANGED_PRESETS,
} from "@/data/formalArrangedPresets";
import {
  compileAcademicRivalPresetAdditions,
  findAcademicRivalPresetById,
  ACADEMIC_RIVAL_PRESETS,
} from "@/data/academicRivalPresets";
import {
  compileCaretakerHurtComfortPresetAdditions,
  findCaretakerHurtComfortPresetById,
  CARETAKER_HURT_COMFORT_PRESETS,
} from "@/data/caretakerHurtComfortPresets";
import {
  compileCaretakerPresetAdditions,
  findCaretakerPresetById,
  CARETAKER_PRESETS,
} from "@/data/caretakerPresets";
import {
  compileFrictionPresetAdditions,
  findFrictionPresetById,
  FRICTION_PRESETS,
} from "@/data/frictionPresets";
import {
  compileRivalryPresetAdditions,
  findRivalryPresetById,
  RIVALRY_PRESETS,
} from "@/data/rivalryPresets";
import {
  compileDevotionPresetAdditions,
  findDevotionPresetById,
  DEVOTION_PRESETS,
} from "@/data/devotionPresets";
import {
  compileObsessionPresetAdditions,
  findObsessionPresetById,
  OBSESSION_PRESETS,
} from "@/data/obsessionPresets";
import {
  compilePossessivePresetAdditions,
  findPossessivePresetById,
  POSSESSIVE_PRESETS,
} from "@/data/possessivePresets";
import {
  compileSlowBurnPresetAdditions,
  findSlowBurnPresetById,
  SLOW_BURN_PRESETS,
} from "@/data/slowBurnPresets";
import {
  compileFlawSecretPresetAdditions,
  findFlawSecretPresetById,
  FLAW_SECRET_PRESETS,
} from "@/data/flawSecretPresets";
import {
  compileTeasingPresetAdditions,
  findTeasingPresetById,
  TEASING_PRESETS,
} from "@/data/teasingPresets";
import {
  compileAgeLifeStagePresetAdditions,
  findAgeLifeStagePresetById,
  AGE_LIFE_STAGE_PRESETS,
} from "@/data/ageLifeStagePresets";
import {
  compileSpeciesHeritagePresetAdditions,
  findSpeciesHeritagePresetById,
  SPECIES_HERITAGE_PRESETS,
} from "@/data/speciesHeritagePresets";
import {
  compileHumanPresetAdditions,
  findHumanPresetById,
  HUMAN_PRESETS,
} from "@/data/humanPresets";
import {
  compileVampirePresetAdditions,
  findVampirePresetById,
  VAMPIRE_PRESETS,
} from "@/data/vampirePresets";
import {
  compileFaePresetAdditions,
  findFaePresetById,
  FAE_PRESETS,
} from "@/data/faePresets";
import {
  compileDemonPresetAdditions,
  findDemonPresetById,
  DEMON_PRESETS,
} from "@/data/demonPresets";
import {
  compileAngelPresetAdditions,
  findAngelPresetById,
  ANGEL_PRESETS,
} from "@/data/angelPresets";
import {
  compileAndroidPresetAdditions,
  findAndroidPresetById,
  ANDROID_PRESETS,
} from "@/data/androidPresets";
import {
  compileAlienPresetAdditions,
  findAlienPresetById,
  ALIEN_PRESETS,
} from "@/data/alienPresets";
import {
  compileShifterPresetAdditions,
  findShifterPresetById,
  SHIFTER_PRESETS,
} from "@/data/shifterPresets";
import {
  compileLossPresetAdditions,
  findLossPresetById,
  LOSS_PRESETS,
} from "@/data/lossPresets";
import {
  compileJealousyPresetAdditions,
  findJealousyPresetById,
  JEALOUSY_PRESETS,
} from "@/data/jealousyPresets";
import {
  compileOriginWoundPresetAdditions,
  findOriginWoundVocabularyPresetById,
  ORIGIN_WOUND_VOCABULARY_PRESETS,
} from "@/data/originWoundVocabularyPresets";
import {
  compilePetNamePresetAdditions,
  findPetNamePresetById,
  PET_NAME_PRESETS,
} from "@/data/petNamePresets";
import {
  compileRelationshipDynamicVocabularyInjection,
  findRelationshipDynamicVocabularyById,
  RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS,
} from "@/data/relationshipDynamicVocabulary";
import {
  compileRegretPresetAdditions,
  findRegretPresetById,
  REGRET_PRESETS,
} from "@/data/regretPresets";
import {
  compileSecretPresetAdditions,
  findSecretPresetById,
  SECRET_PRESETS,
} from "@/data/secretPresets";
import {
  compileSecondChancePresetAdditions,
  findSecondChancePresetById,
  SECOND_CHANCE_PRESETS,
} from "@/data/secondChancePresets";
import {
  compileSentenceRhythmPresetAdditions,
  findSentenceRhythmPresetById,
  SENTENCE_RHYTHM_PRESETS,
} from "@/data/sentenceRhythmPresets";
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
import {
  compileWorkplaceHierarchyPresetAdditions,
  findWorkplaceHierarchyPresetById,
  WORKPLACE_HIERARCHY_PRESETS,
} from "@/data/workplaceHierarchyPresets";
import { expandPresetLookupTokens } from "@/lib/character-card/presetSpellingAliases";
import { compileSemanticSeedPromptAdditions } from "@/lib/character-card/semanticSeedResolver";
import type { SeedPickerEntry } from "@/data/seedPickerRegistry";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import {
  Field,
  GeneratorFormCard,
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

const emptyPersonaStarterFields: Record<PersonaStarterFieldKey, string> = {
  appearance: "",
  basicInfo: "",
  firstMessage: "",
  name: "",
  personality: "",
  scenario: "",
};

const personaSeedVocabulary = {
  backstory: [
    ...ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id),
    ...FORMATIVE_EVENT_PRESETS.map((preset) => preset.id),
    ...FAMILY_HISTORY_PRESETS.map((preset) => preset.id),
    ...REGRET_PRESETS.map((preset) => preset.id),
    ...EXILE_PRESETS.map((preset) => preset.id),
    ...BETRAYAL_PRESETS.map((preset) => preset.id),
    ...LOSS_PRESETS.map((preset) => preset.id),
    ...SECRET_PRESETS.map((preset) => preset.id),
    ...AMBITION_PRESETS.map((preset) => preset.id),
  ],
  personality: [
    ...SPEECH_STYLE_PRESETS.map((preset) => preset.id),
    ...VOICE_VOCABULARY_PRESETS.map((preset) => preset.id),
    ...DIALECT_PRESETS.map((preset) => preset.id),
    ...FORMALITY_PRESETS.map((preset) => preset.id),
    ...PET_NAME_PRESETS.map((preset) => preset.id),
    ...SENTENCE_RHYTHM_PRESETS.map((preset) => preset.id),
    ...COMMUNICATION_STYLE_PRESETS.map((preset) => preset.id),
    ...MORALITY_PRESETS.map((preset) => preset.id),
  ],
  relationship: [
    ...COMPLEMENT_VOCABULARY_PRESETS.map((preset) => preset.id),
    ...RELATIONSHIP_DYNAMIC_VOCABULARY_PRESETS.map((preset) => preset.id),
    ...ARRANGED_MATCH_PRESETS.map((preset) => preset.id),
    ...FORBIDDEN_TABOO_PRESETS.map((preset) => preset.id),
    ...MENTOR_PROTEGE_PRESETS.map((preset) => preset.id),
    ...FAKE_DATING_PRESETS.map((preset) => preset.id),
    ...GRUMPY_SUNSHINE_PRESETS.map((preset) => preset.id),
    ...DARK_OBSESSIVE_PRESETS.map((preset) => preset.id),
    ...FORMAL_ARRANGED_PRESETS.map((preset) => preset.id),
    ...ACADEMIC_RIVAL_PRESETS.map((preset) => preset.id),
    ...CARETAKER_HURT_COMFORT_PRESETS.map((preset) => preset.id),
    ...CARETAKER_PRESETS.map((preset) => preset.id),
    ...FRICTION_PRESETS.map((preset) => preset.id),
    ...RIVALRY_PRESETS.map((preset) => preset.id),
    ...DEVOTION_PRESETS.map((preset) => preset.id),
    ...OBSESSION_PRESETS.map((preset) => preset.id),
    ...POSSESSIVE_PRESETS.map((preset) => preset.id),
    ...SLOW_BURN_PRESETS.map((preset) => preset.id),
    ...FLAW_SECRET_PRESETS.map((preset) => preset.id),
    ...TEASING_PRESETS.map((preset) => preset.id),
    ...AGE_LIFE_STAGE_PRESETS.map((preset) => preset.id),
    ...SPECIES_HERITAGE_PRESETS.map((preset) => preset.id),
    ...HUMAN_PRESETS.map((preset) => preset.id),
    ...VAMPIRE_PRESETS.map((preset) => preset.id),
    ...FAE_PRESETS.map((preset) => preset.id),
    ...DEMON_PRESETS.map((preset) => preset.id),
    ...ANGEL_PRESETS.map((preset) => preset.id),
    ...ANDROID_PRESETS.map((preset) => preset.id),
    ...ALIEN_PRESETS.map((preset) => preset.id),
    ...SHIFTER_PRESETS.map((preset) => preset.id),
    ...FATED_REINCARNATION_PRESETS.map((preset) => preset.id),
    ...SECOND_CHANCE_PRESETS.map((preset) => preset.id),
    ...WORKPLACE_HIERARCHY_PRESETS.map((preset) => preset.id),
    ...FRIENDS_TO_LOVERS_PRESETS.map((preset) => preset.id),
    ...FLIRTING_PRESETS.map((preset) => preset.id),
    ...JEALOUSY_PRESETS.map((preset) => preset.id),
    ...AFFECTION_PRESETS.map((preset) => preset.id),
    ...LOYALTY_PRESETS.map((preset) => preset.id),
    ...LOVE_LANGUAGE_PRESETS.map((preset) => preset.id),
    ...CONFLICT_STYLE_PRESETS.map((preset) => preset.id),
  ],
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
    const vocabularySeedText =
      createPersonaCompiledVocabularySeedText(personaStarterFields);

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
      vocabularySeedText.characteristics,
    ]);
    const scenarioContext = personaStarterFields.scenario.trim()
      ? `Scenario / context:\n${personaStarterFields.scenario.trim()}`
      : "";
    const nextInput: PersonaGenerationInput = {
      ...input,
      name: personaStarterFields.name.trim() || input.name,
      characteristics: joinDefined([input.characteristics, profileSections]),
      referenceCharacter: joinDefined([
        input.referenceCharacter,
        scenarioContext,
        vocabularySeedText.referenceContext,
      ]),
    };

    setInput(nextInput);
    setActivePersona(generatePersonaArtifact(nextInput));
    setSavedSnapshot(null);
    setDeleteArmed(false);
    setPersonaIntakeStatus("Routed persona notes into an editable generated draft.");
    setStatus("Generated persona draft from intake.");
  }

  function handleAddPersonaSeed(fieldKey: PersonaStarterFieldKey, value: string) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    setPersonaStarterFields((current) => ({
      ...current,
      [fieldKey]: joinInlineList(current[fieldKey], trimmedValue),
    }));
  }

  function handleUnifiedPersonaSeed(entry: SeedPickerEntry) {
    const fieldKey = resolvePersonaSeedFieldKey(entry);
    const seedText = formatPersonaSeedText(entry);

    handleAddPersonaSeed(fieldKey, seedText);

    if (entry.kind === "semantic") {
      updateInput(
        "characteristics",
        joinDefined([
          input.characteristics,
          compileSemanticSeedPromptAdditions([entry.id], {
            header: "Persona semantic guidance",
            includeRelated: true,
          }),
        ]).replace(/\n\n/g, "\n"),
      );
    }
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
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] [&>*]:min-w-0">
      <main className="grid gap-5">
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
                <Badge variant="outline">{input.pointOfView}</Badge>
                <Badge variant="outline">{input.playStyle}</Badge>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <CopyButton
                textToCopy={serialized}
                onCopied={() => setStatus("Copied persona JSON.")}
              />
              <Button type="button" variant="outline" onClick={duplicateActive}>
                <CopyPlus className="size-4" />
                Duplicate
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
          <CardContent className="grid gap-5">
            <section className="grid gap-4 rounded-xl border bg-background/70 p-4">
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                    Persona Sheet
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Build the player persona that chat partners will respond to.
                  </p>
                </div>
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border bg-card/70 text-2xl font-black text-muted-foreground">
                  {activePersona.name.slice(0, 1).toUpperCase() || "P"}
                </div>
              </div>

              <SearchableSeedPicker
                description="Add registry or semantic seeds into editable persona fields before generating."
                kinds={["preset", "semantic", "vocabulary"]}
                label="Persona Seed Picker"
                lanes={["personality", "world", "metadata", "semantic"]}
                maxResults={8}
                onSelect={handleUnifiedPersonaSeed}
                placeholder="Search relationship, wound, trope, speech, backstory..."
              />

              <PersonaSheetSection title="General" defaultOpen>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Persona name">
                    <Input
                      value={input.name}
                      onChange={(event) =>
                        updateInput("name", event.currentTarget.value)
                      }
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
              </PersonaSheetSection>

              <PersonaSheetSection title="Relationship">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Relationship role">
                    <select
                      value={input.relationshipToCharacter}
                      onChange={(event) =>
                        updateInput(
                          "relationshipToCharacter",
                          event.currentTarget.value,
                        )
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
                  <Field label="Match target / character context">
                    <Input
                      placeholder="Optional character, card tone, or premise"
                      value={input.referenceCharacter}
                      onChange={(event) =>
                        updateInput("referenceCharacter", event.currentTarget.value)
                      }
                    />
                  </Field>
                  <PersonaSeedCombo
                    datalistId="persona-relationship-vocabulary-seeds"
                    label="Add relationship vocabulary"
                    options={personaSeedVocabulary.relationship}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-complement-vocabulary-seeds"
                    label="Add complement vocabulary"
                    options={COMPLEMENT_VOCABULARY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-forbidden-taboo-seeds"
                    label="Add forbidden / taboo intersection"
                    options={FORBIDDEN_TABOO_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-arranged-match-seeds"
                    label="Add arranged match seed"
                    options={ARRANGED_MATCH_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-mentor-protege-seeds"
                    label="Add mentor / protégé seed"
                    options={MENTOR_PROTEGE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-fake-dating-seeds"
                    label="Add fake dating seed"
                    options={FAKE_DATING_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-grumpy-sunshine-seeds"
                    label="Add grumpy / sunshine seed"
                    options={GRUMPY_SUNSHINE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-dark-obsessive-seeds"
                    label="Add dark / obsessive seed"
                    options={DARK_OBSESSIVE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-formal-arranged-seeds"
                    label="Add formal / arranged seed"
                    options={FORMAL_ARRANGED_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-academic-rival-seeds"
                    label="Add academic / rival seed"
                    options={ACADEMIC_RIVAL_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-caretaker-hurt-comfort-seeds"
                    label="Add caretaker / hurt-comfort seed"
                    options={CARETAKER_HURT_COMFORT_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-caretaker-seeds"
                    label="Add caretaker seed"
                    options={CARETAKER_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-friction-seeds"
                    label="Add friction seed"
                    options={FRICTION_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-rivalry-seeds"
                    label="Add rivalry seed"
                    options={RIVALRY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-devotion-seeds"
                    label="Add devotion seed"
                    options={DEVOTION_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-obsession-seeds"
                    label="Add obsession seed"
                    options={OBSESSION_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-possessive-seeds"
                    label="Add possessive seed"
                    options={POSSESSIVE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-slow-burn-seeds"
                    label="Add slow-burn seed"
                    options={SLOW_BURN_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-flaw-secret-seeds"
                    label="Add flaw / secret seed"
                    options={FLAW_SECRET_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-teasing-seeds"
                    label="Add teasing seed"
                    options={TEASING_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-age-life-stage-seeds"
                    label="Add age / life-stage seed"
                    options={AGE_LIFE_STAGE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-species-heritage-seeds"
                    label="Add species / heritage seed"
                    options={SPECIES_HERITAGE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-human-seeds"
                    label="Add human seed"
                    options={HUMAN_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-vampire-seeds"
                    label="Add vampire seed"
                    options={VAMPIRE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-fae-seeds"
                    label="Add fae seed"
                    options={FAE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-demon-seeds"
                    label="Add demon seed"
                    options={DEMON_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-angel-seeds"
                    label="Add angel seed"
                    options={ANGEL_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-android-seeds"
                    label="Add android seed"
                    options={ANDROID_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-alien-seeds"
                    label="Add alien seed"
                    options={ALIEN_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-shifter-seeds"
                    label="Add shifter seed"
                    options={SHIFTER_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-fated-reincarnation-seeds"
                    label="Add fated / reincarnation seed"
                    options={FATED_REINCARNATION_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-second-chance-seeds"
                    label="Add second-chance seed"
                    options={SECOND_CHANCE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-workplace-hierarchy-seeds"
                    label="Add workplace hierarchy seed"
                    options={WORKPLACE_HIERARCHY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-friends-to-lovers-seeds"
                    label="Add friends-to-lovers seed"
                    options={FRIENDS_TO_LOVERS_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-flirting-seeds"
                    label="Add flirting / tension style"
                    options={FLIRTING_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-jealousy-seeds"
                    label="Add jealousy / rivalry seed"
                    options={JEALOUSY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-affection-seeds"
                    label="Add affection / comfort seed"
                    options={AFFECTION_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-loyalty-seeds"
                    label="Add loyalty / devotion seed"
                    options={LOYALTY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-love-language-seeds"
                    label="Add love language seed"
                    options={LOVE_LANGUAGE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-conflict-style-seeds"
                    label="Add conflict / repair style"
                    options={CONFLICT_STYLE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("scenario", value)}
                  />
                </div>
              </PersonaSheetSection>

              <PersonaSheetSection title="Physical & Background">
                <div className="grid gap-4">
                  <Field label="Basic info">
                    <Textarea
                      className="min-h-20"
                      placeholder="Age range, gender/pronouns, job, background, social role..."
                      value={personaStarterFields.basicInfo}
                      onChange={(event) =>
                        setPersonaStarterFields((current) => ({
                          ...current,
                          basicInfo: event.currentTarget.value,
                        }))
                      }
                    />
                  </Field>
                  <Field label="Appearance">
                    <Textarea
                      className="min-h-20"
                      placeholder="Style, body language, presentation, notable details..."
                      value={personaStarterFields.appearance}
                      onChange={(event) =>
                        setPersonaStarterFields((current) => ({
                          ...current,
                          appearance: event.currentTarget.value,
                        }))
                      }
                    />
                  </Field>
                  <PersonaSeedCombo
                    datalistId="persona-origin-wound-seeds"
                    label="Add origin wound vocabulary"
                    options={ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-formative-event-seeds"
                    label="Add formative event"
                    options={FORMATIVE_EVENT_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-family-history-seeds"
                    label="Add family history"
                    options={FAMILY_HISTORY_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-regret-seeds"
                    label="Add regret seed"
                    options={REGRET_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-exile-seeds"
                    label="Add exile seed"
                    options={EXILE_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-betrayal-seeds"
                    label="Add betrayal seed"
                    options={BETRAYAL_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-loss-seeds"
                    label="Add loss seed"
                    options={LOSS_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-secret-seeds"
                    label="Add secret seed"
                    options={SECRET_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                  <PersonaSeedCombo
                    datalistId="persona-ambition-seeds"
                    label="Add ambition seed"
                    options={AMBITION_PRESETS.map((preset) => preset.id)}
                    onAdd={(value) => handleAddPersonaSeed("basicInfo", value)}
                  />
                </div>
              </PersonaSheetSection>

              <PersonaSheetSection title="Personality">
                <div className="grid gap-4">
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <PersonaSeedCombo
                      datalistId="persona-speech-style-seeds"
                      label="Add speech preset"
                      options={SPEECH_STYLE_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-voice-vocabulary-seeds"
                      label="Add voice vocabulary"
                      options={VOICE_VOCABULARY_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-dialect-seeds"
                      label="Add dialect / accent"
                      options={DIALECT_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-formality-seeds"
                      label="Add formality / titles"
                      options={FORMALITY_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-pet-name-seeds"
                      label="Add pet-name rules"
                      options={PET_NAME_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-sentence-rhythm-seeds"
                      label="Add sentence rhythm"
                      options={SENTENCE_RHYTHM_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-communication-style-seeds"
                      label="Add communication style"
                      options={COMMUNICATION_STYLE_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                    <PersonaSeedCombo
                      datalistId="persona-morality-seeds"
                      label="Add morality / ethics"
                      options={MORALITY_PRESETS.map((preset) => preset.id)}
                      onAdd={(value) => handleAddPersonaSeed("personality", value)}
                    />
                  </div>
                </div>
              </PersonaSheetSection>

              <PersonaSheetSection title="Notes">
                <div className="grid gap-4">
                  <Field label="Messy persona notes">
                    <Textarea
                      value={personaIntakeText}
                      placeholder="Paste rough {{user}} POV ideas, profile fragments, boundaries, relationship context, or first-scene notes..."
                      className="min-h-28"
                      onChange={(event) =>
                        setPersonaIntakeText(event.currentTarget.value)
                      }
                    />
                  </Field>
                  <Field label="Tags">
                    <Input
                      value={input.tags}
                      onChange={(event) =>
                        updateInput("tags", event.currentTarget.value)
                      }
                    />
                  </Field>
                </div>
              </PersonaSheetSection>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button type="button" onClick={generate}>
                  <UserRound className="size-4" />
                  Update Draft
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={routePersonaIntake}
                >
                  <Sparkles className="size-4" />
                  Use Notes
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
              </div>
              {personaIntakeStatus ? (
                <p className="text-sm text-muted-foreground">
                  {personaIntakeStatus}
                </p>
              ) : null}
              {status ? (
                <p className="text-sm text-muted-foreground">{status}</p>
              ) : null}
            </section>

            <section className="grid gap-4 rounded-xl border bg-background/70 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Saved name">
                  <Input
                    value={activePersona.name}
                    onChange={(event) =>
                      editPersona({ name: event.currentTarget.value })
                    }
                  />
                </Field>
                <Field label="Saved tags">
                  <Input
                    value={activePersona.tags.join(", ")}
                    onChange={(event) =>
                      editPersona({
                        tags: event.currentTarget.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
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
                  className="min-h-56 font-mono text-xs leading-5"
                  value={activePersona.prompt}
                  onChange={(event) =>
                    editPersona({ prompt: event.currentTarget.value })
                  }
                />
              </Field>
            </section>
          </CardContent>
        </Card>

        <PersonaMatchingStudio />
      </main>

      <aside className="grid max-h-[calc(100vh-8rem)] gap-5 overflow-y-auto pr-1 xl:sticky xl:top-24">
        <PersonaArchetypeGuide input={input} activePersona={activePersona} />

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

        {hydrated && advancedControlsEnabled ? (
          <AdvancedPersonaPromptPanel
            constructionPrompt={input.constructionPrompt ?? ""}
            preview={constructionPreview}
            onChange={(value) => updateInput("constructionPrompt", value)}
          />
        ) : null}
      </aside>
    </div>
  );
}

function PersonaSheetSection(props: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  return (
    <details
      className="rounded-lg border bg-card/45 p-4"
      open={props.defaultOpen}
    >
      <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.16em] text-foreground">
        {props.title}
      </summary>
      <div className="mt-4 grid gap-4">{props.children}</div>
    </details>
  );
}

function PersonaArchetypeGuide(props: {
  activePersona: GeneratedPersonaArtifact;
  input: PersonaGenerationInput;
}) {
  const tagList = props.input.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
  const exampleAngles = buildPersonaExampleAngles(props.input);

  return (
    <Card className="bg-card/85">
      <CardHeader>
        <CardTitle>Archetype Guide</CardTitle>
        <CardDescription>
          A quick reference for how this persona should feel in chat.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <section className="rounded-md border bg-background/70 p-3">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Description
          </h3>
          <p className="mt-2 leading-6 text-muted-foreground">
            {props.input.name || props.activePersona.name} is a{" "}
            {props.input.archetype || "custom persona"} built for{" "}
            {props.input.playStyle.toLowerCase()} with a{" "}
            {props.input.relationshipToCharacter.toLowerCase()} role.
          </p>
        </section>

        <section className="rounded-md border bg-background/70 p-3">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Works Best For
          </h3>
          <ul className="mt-2 grid gap-2 text-muted-foreground">
            {[
              props.input.emotionalNeed,
              props.input.referenceCharacter ||
                "Chats where the character reacts to the player persona.",
              props.input.boundaries,
            ]
              .filter(Boolean)
              .map((item) => (
                <li className="leading-5" key={item}>
                  {item}
                </li>
              ))}
          </ul>
        </section>

        <section className="rounded-md border bg-background/70 p-3">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Suggested Tags
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(tagList.length > 0 ? tagList : props.activePersona.tags).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section className="rounded-md border bg-background/70 p-3">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-primary">
            Example Openings
          </h3>
          <ul className="mt-2 grid gap-2 text-xs leading-5 text-muted-foreground">
            {exampleAngles.map((angle) => (
              <li key={angle}>{angle}</li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold">Prompt Preview</h3>
            <CopyButton idleLabel="Copy prompt" textToCopy={props.preview} />
          </div>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
            {props.preview}
          </pre>
        </section>
      </div>
    </details>
  );
}

function buildPersonaExampleAngles(input: PersonaGenerationInput) {
  const name = input.name.trim() || "The persona";
  const relationship = input.relationshipToCharacter.toLowerCase();

  return [
    `${name} enters with ${input.characteristics.split(",")[0]?.trim() || "a clear emotional angle"}.`,
    `Lean into ${relationship} without taking over the character's choices.`,
    `Let the core need show through behavior: ${input.emotionalNeed}.`,
  ];
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

function createPersonaCompiledVocabularySeedText(
  fields: Record<PersonaStarterFieldKey, string>,
) {
  const backstorySeedText = joinDefined([fields.basicInfo, fields.personality]);
  const speechStyleAdditions = findPresetMatches(
    fields.personality,
    findSpeechStylePresetById,
  ).map(compileSpeechStylePresetSummary);
  const voiceVocabularyAdditions = findPresetMatches(
    fields.personality,
    findVoiceVocabularyPresetById,
  ).map((preset) => {
    const additions = compileVoiceVocabularyPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.lexicalGuidance,
      additions.systemPromptAddition,
    ]);
  });
  const originWoundAdditions = findPresetMatches(
    backstorySeedText,
    findOriginWoundVocabularyPresetById,
  ).map((preset) => {
    const additions = compileOriginWoundPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const formativeEventAdditions = findPresetMatches(
    backstorySeedText,
    findFormativeEventPresetById,
  ).map((preset) => {
    const additions = compileFormativeEventPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const familyHistoryAdditions = findPresetMatches(
    backstorySeedText,
    findFamilyHistoryPresetById,
  ).map((preset) => {
    const additions = compileFamilyHistoryPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const regretAdditions = findPresetMatches(
    backstorySeedText,
    findRegretPresetById,
  ).map((preset) => {
    const additions = compileRegretPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const exileAdditions = findPresetMatches(
    backstorySeedText,
    findExilePresetById,
  ).map((preset) => {
    const additions = compileExilePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const betrayalAdditions = findPresetMatches(
    backstorySeedText,
    findBetrayalPresetById,
  ).map((preset) => {
    const additions = compileBetrayalPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const lossAdditions = findPresetMatches(
    backstorySeedText,
    findLossPresetById,
  ).map((preset) => {
    const additions = compileLossPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const secretAdditions = findPresetMatches(
    backstorySeedText,
    findSecretPresetById,
  ).map((preset) => {
    const additions = compileSecretPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const ambitionAdditions = findPresetMatches(
    backstorySeedText,
    findAmbitionPresetById,
  ).map((preset) => {
    const additions = compileAmbitionPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const dialectAdditions = findPresetMatches(
    fields.personality,
    findDialectPresetById,
  ).map((preset) => {
    const additions = compileDialectPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const formalityAdditions = findPresetMatches(
    fields.personality,
    findFormalityPresetById,
  ).map((preset) => {
    const additions = compileFormalityPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const petNameAdditions = findPresetMatches(
    fields.personality,
    findPetNamePresetById,
  ).map((preset) => {
    const additions = compilePetNamePresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const sentenceRhythmAdditions = findPresetMatches(
    fields.personality,
    findSentenceRhythmPresetById,
  ).map((preset) => {
    const additions = compileSentenceRhythmPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const communicationStyleAdditions = findPresetMatches(
    fields.personality,
    findCommunicationStylePresetById,
  ).map((preset) => {
    const additions = compileCommunicationStylePresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const moralityAdditions = findPresetMatches(
    fields.personality,
    findMoralityPresetById,
  ).map((preset) => {
    const additions = compileMoralityPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const relationshipVocabularyAdditions = findPresetMatches(
    fields.scenario,
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
  const complementAdditions = findPresetMatches(
    fields.scenario,
    findComplementVocabularyById,
  ).map((preset) => {
    const additions = compileComplementVocabularyAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.systemPromptAddition,
    ]);
  });
  const forbiddenTabooAdditions = findPresetMatches(
    fields.scenario,
    findForbiddenTabooPresetById,
  ).map((preset) => {
    const additions = compileForbiddenTabooPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const arrangedMatchAdditions = findPresetMatches(
    fields.scenario,
    findArrangedMatchPresetById,
  ).map((preset) => {
    const additions = compileArrangedMatchPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const mentorProtegeAdditions = findPresetMatches(
    fields.scenario,
    findMentorProtegePresetById,
  ).map((preset) => {
    const additions = compileMentorProtegePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const fakeDatingAdditions = findPresetMatches(
    fields.scenario,
    findFakeDatingPresetById,
  ).map((preset) => {
    const additions = compileFakeDatingPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const grumpySunshineAdditions = findPresetMatches(
    fields.scenario,
    findGrumpySunshinePresetById,
  ).map((preset) => {
    const additions = compileGrumpySunshinePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const darkObsessiveAdditions = findPresetMatches(
    fields.scenario,
    findDarkObsessivePresetById,
  ).map((preset) => {
    const additions = compileDarkObsessivePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const formalArrangedAdditions = findPresetMatches(
    fields.scenario,
    findFormalArrangedPresetById,
  ).map((preset) => {
    const additions = compileFormalArrangedPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const academicRivalAdditions = findPresetMatches(
    fields.scenario,
    findAcademicRivalPresetById,
  ).map((preset) => {
    const additions = compileAcademicRivalPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const caretakerHurtComfortAdditions = findPresetMatches(
    fields.scenario,
    findCaretakerHurtComfortPresetById,
  ).map((preset) => {
    const additions = compileCaretakerHurtComfortPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const caretakerAdditions = findPresetMatches(
    fields.scenario,
    findCaretakerPresetById,
  ).map((preset) => {
    const additions = compileCaretakerPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const frictionAdditions = findPresetMatches(
    fields.scenario,
    findFrictionPresetById,
  ).map((preset) => {
    const additions = compileFrictionPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const rivalryAdditions = findPresetMatches(
    fields.scenario,
    findRivalryPresetById,
  ).map((preset) => {
    const additions = compileRivalryPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const devotionAdditions = findPresetMatches(
    fields.scenario,
    findDevotionPresetById,
  ).map((preset) => {
    const additions = compileDevotionPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const obsessionAdditions = findPresetMatches(
    fields.scenario,
    findObsessionPresetById,
  ).map((preset) => {
    const additions = compileObsessionPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const possessiveAdditions = findPresetMatches(
    fields.scenario,
    findPossessivePresetById,
  ).map((preset) => {
    const additions = compilePossessivePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const slowBurnAdditions = findPresetMatches(
    fields.scenario,
    findSlowBurnPresetById,
  ).map((preset) => {
    const additions = compileSlowBurnPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const flawSecretAdditions = findPresetMatches(
    fields.scenario,
    findFlawSecretPresetById,
  ).map((preset) => {
    const additions = compileFlawSecretPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const teasingAdditions = findPresetMatches(
    fields.scenario,
    findTeasingPresetById,
  ).map((preset) => {
    const additions = compileTeasingPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const ageLifeStageAdditions = findPresetMatches(
    fields.scenario,
    findAgeLifeStagePresetById,
  ).map((preset) => {
    const additions = compileAgeLifeStagePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const speciesHeritageAdditions = findPresetMatches(
    fields.scenario,
    findSpeciesHeritagePresetById,
  ).map((preset) => {
    const additions = compileSpeciesHeritagePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const humanAdditions = findPresetMatches(
    fields.scenario,
    findHumanPresetById,
  ).map((preset) => {
    const additions = compileHumanPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const vampireAdditions = findPresetMatches(
    fields.scenario,
    findVampirePresetById,
  ).map((preset) => {
    const additions = compileVampirePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const faeAdditions = findPresetMatches(
    fields.scenario,
    findFaePresetById,
  ).map((preset) => {
    const additions = compileFaePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const demonAdditions = findPresetMatches(
    fields.scenario,
    findDemonPresetById,
  ).map((preset) => {
    const additions = compileDemonPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const angelAdditions = findPresetMatches(
    fields.scenario,
    findAngelPresetById,
  ).map((preset) => {
    const additions = compileAngelPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const androidAdditions = findPresetMatches(
    fields.scenario,
    findAndroidPresetById,
  ).map((preset) => {
    const additions = compileAndroidPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const alienAdditions = findPresetMatches(
    fields.scenario,
    findAlienPresetById,
  ).map((preset) => {
    const additions = compileAlienPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const shifterAdditions = findPresetMatches(
    fields.scenario,
    findShifterPresetById,
  ).map((preset) => {
    const additions = compileShifterPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const fatedReincarnationAdditions = findPresetMatches(
    fields.scenario,
    findFatedReincarnationPresetById,
  ).map((preset) => {
    const additions = compileFatedReincarnationPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const secondChanceAdditions = findPresetMatches(
    fields.scenario,
    findSecondChancePresetById,
  ).map((preset) => {
    const additions = compileSecondChancePresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const workplaceHierarchyAdditions = findPresetMatches(
    fields.scenario,
    findWorkplaceHierarchyPresetById,
  ).map((preset) => {
    const additions = compileWorkplaceHierarchyPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const friendsToLoversAdditions = findPresetMatches(
    fields.scenario,
    findFriendsToLoversPresetById,
  ).map((preset) => {
    const additions = compileFriendsToLoversPresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const flirtingAdditions = findPresetMatches(
    fields.scenario,
    findFlirtingPresetById,
  ).map((preset) => {
    const additions = compileFlirtingPresetAdditions(preset);
    return joinDefined([
      additions.personalityAddition,
      additions.scenarioAddition,
      additions.systemPromptAddition,
    ]);
  });
  const jealousyAdditions = findPresetMatches(
    fields.scenario,
    findJealousyPresetById,
  ).map((preset) => {
    const additions = compileJealousyPresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const affectionAdditions = findPresetMatches(
    fields.scenario,
    findAffectionPresetById,
  ).map((preset) => {
    const additions = compileAffectionPresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const loyaltyAdditions = findPresetMatches(
    fields.scenario,
    findLoyaltyPresetById,
  ).map((preset) => {
    const additions = compileLoyaltyPresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const loveLanguageAdditions = findPresetMatches(
    fields.scenario,
    findLoveLanguagePresetById,
  ).map((preset) => {
    const additions = compileLoveLanguagePresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const conflictStyleAdditions = findPresetMatches(
    fields.scenario,
    findConflictStylePresetById,
  ).map((preset) => {
    const additions = compileConflictStylePresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });

  return {
    characteristics: joinDefined([
      ...speechStyleAdditions,
      ...voiceVocabularyAdditions,
      ...originWoundAdditions,
      ...formativeEventAdditions,
      ...familyHistoryAdditions,
      ...regretAdditions,
      ...exileAdditions,
      ...betrayalAdditions,
      ...lossAdditions,
      ...secretAdditions,
      ...ambitionAdditions,
      ...dialectAdditions,
      ...formalityAdditions,
      ...petNameAdditions,
      ...sentenceRhythmAdditions,
      ...communicationStyleAdditions,
      ...moralityAdditions,
    ]),
    referenceContext: joinDefined([
      ...relationshipVocabularyAdditions,
      ...complementAdditions,
      ...arrangedMatchAdditions,
      ...forbiddenTabooAdditions,
      ...mentorProtegeAdditions,
      ...fakeDatingAdditions,
      ...grumpySunshineAdditions,
      ...darkObsessiveAdditions,
      ...formalArrangedAdditions,
      ...academicRivalAdditions,
      ...caretakerHurtComfortAdditions,
      ...caretakerAdditions,
      ...frictionAdditions,
      ...rivalryAdditions,
      ...devotionAdditions,
      ...obsessionAdditions,
      ...possessiveAdditions,
      ...slowBurnAdditions,
      ...flawSecretAdditions,
      ...teasingAdditions,
      ...ageLifeStageAdditions,
      ...speciesHeritageAdditions,
      ...humanAdditions,
      ...vampireAdditions,
      ...faeAdditions,
      ...demonAdditions,
      ...angelAdditions,
      ...androidAdditions,
      ...alienAdditions,
      ...shifterAdditions,
      ...fatedReincarnationAdditions,
      ...secondChanceAdditions,
      ...workplaceHierarchyAdditions,
      ...friendsToLoversAdditions,
      ...flirtingAdditions,
      ...jealousyAdditions,
      ...affectionAdditions,
      ...loyaltyAdditions,
      ...loveLanguageAdditions,
      ...conflictStyleAdditions,
    ]),
  };
}

function joinDefined(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n\n");
}

function joinInlineList(currentValue: string, value: string) {
  return joinDefined([currentValue, value]).replace(/\n\n/g, ", ");
}

function resolvePersonaSeedFieldKey(entry: SeedPickerEntry): PersonaStarterFieldKey {
  if (entry.kind === "vocabulary") {
    const haystack = [
      entry.category,
      entry.label,
      entry.description,
      ...entry.tags,
      ...(entry.vocabularySeed?.romanceHooks ?? []),
      ...(entry.vocabularySeed?.scenarioHooks ?? []),
    ].join(" ").toLowerCase();

    if (/appearance|image|visual|portrait|outfit|clothing/.test(haystack)) {
      return "appearance";
    }
    if (/relationship|romance|dynamic|trope|world|scenario|setting/.test(haystack)) {
      return "scenario";
    }
    if (/tag|metadata|moral|ethic/.test(haystack)) {
      return "basicInfo";
    }
  }

  if (entry.lane === "appearance" || entry.lane === "image") {
    return "appearance";
  }

  if (entry.lane === "world" || entry.category.includes("relationship")) {
    return "scenario";
  }

  if (entry.lane === "metadata") {
    return "basicInfo";
  }

  if (
    entry.kind === "semantic" &&
    ["wounds", "fears", "desires", "motivations", "triggers"].includes(
      entry.category,
    )
  ) {
    return "basicInfo";
  }

  return "personality";
}

function formatPersonaSeedText(entry: SeedPickerEntry) {
  if (entry.vocabularySeed) {
    const seed = entry.vocabularySeed;
    return [
      `${seed.label}: ${seed.description}`,
      seed.examples[0] ? `Example: ${seed.examples[0]}` : "",
      seed.romanceHooks.length > 0
        ? `Hooks: ${seed.romanceHooks.slice(0, 3).join(", ")}`
        : "",
    ].filter(Boolean).join(" ");
  }

  if (entry.lane === "metadata") {
    return `Tag: ${entry.value}`;
  }

  if (entry.kind === "semantic") {
    return [entry.label, entry.description].filter(Boolean).join(": ");
  }

  return entry.value;
}

function findPresetMatches<T>(
  rawText: string,
  findById: (id: string) => T | undefined,
): T[] {
  const matches: T[] = [];
  const seen = new Set<T>();

  for (const token of tokenizeSeedInput(rawText)) {
    const match = expandPresetLookupTokens(token)
      .map((candidate) => findById(candidate))
      .find((candidate): candidate is T => Boolean(candidate));
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

function PersonaSeedCombo(props: {
  datalistId: string;
  label: string;
  onAdd: (value: string) => void;
  options: string[];
}) {
  const [value, setValue] = useState("");

  return (
    <div className="grid gap-2 rounded-md border bg-background/60 p-3">
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          {props.label}
        </span>
        <Input
          autoComplete="off"
          data-no-field-copy="true"
          list={props.datalistId}
          placeholder="Choose a seed or type anything..."
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </label>
      <datalist id={props.datalistId}>
        {props.options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-1.5">
        {props.options.slice(0, 5).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => props.onAdd(option)}
            className="rounded-full border bg-card px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {option}
          </button>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          props.onAdd(value);
          setValue("");
        }}
      >
        Add Seed
      </Button>
    </div>
  );
}
