"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Activity, Gauge, HeartHandshake, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { expandPresetLookupTokens } from "@/lib/character-card/presetSpellingAliases";
import {
  calculatePsychologicalResonance,
  type PersonaTraits,
} from "@/lib/persona/psychologyEngine";
import { fetchContextualNpcDialogue } from "@/lib/tauri/contextualDialogue";
import { initializeProfileWithResonance } from "@/lib/tauri/personaResonance";
import type { CharacterImportPayload } from "@/lib/tauri/characterCardParser";
import { commitCharacterCardToActiveSlot } from "@/lib/tauri/tropeInteraction";
import {
  RomanceTropeClassSchema,
  type RomanceTropeClass,
} from "@/types/character-card/RomanceTropeClassification";
import type {
  ExtractedCharacterPayload,
  SavedPersonaMetadata,
} from "@/types/studio";
import { CardParserUploader } from "./CardParserUploader";
import { CharacterPreviewSheet } from "./CharacterPreviewSheet";
import { Field } from "./GenerationShell";
import { PersonaSelectorGrid } from "./PersonaSelectorGrid";

const selectableTropes: RomanceTropeClass[] = [
  "bantering",
  "flustered",
  "yearning",
  "grumpy",
  "sunshine",
  "protective",
  "antagonistic",
  "forbidden",
];

const fallbackTargetForbiddenTones: RomanceTropeClass[] = [
  "antagonistic",
  "forbidden",
];

const fallbackTargetPreferredTones: RomanceTropeClass[] = [
  "bantering",
  "sunshine",
];

const matchingVocabularySeedIds = [
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
  ...ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id),
  ...FORMATIVE_EVENT_PRESETS.map((preset) => preset.id),
  ...FAMILY_HISTORY_PRESETS.map((preset) => preset.id),
  ...REGRET_PRESETS.map((preset) => preset.id),
  ...EXILE_PRESETS.map((preset) => preset.id),
  ...BETRAYAL_PRESETS.map((preset) => preset.id),
  ...LOSS_PRESETS.map((preset) => preset.id),
  ...SECRET_PRESETS.map((preset) => preset.id),
  ...AMBITION_PRESETS.map((preset) => preset.id),
  ...SPEECH_STYLE_PRESETS.map((preset) => preset.id),
  ...VOICE_VOCABULARY_PRESETS.map((preset) => preset.id),
  ...DIALECT_PRESETS.map((preset) => preset.id),
  ...FORMALITY_PRESETS.map((preset) => preset.id),
  ...PET_NAME_PRESETS.map((preset) => preset.id),
  ...SENTENCE_RHYTHM_PRESETS.map((preset) => preset.id),
  ...COMMUNICATION_STYLE_PRESETS.map((preset) => preset.id),
  ...MORALITY_PRESETS.map((preset) => preset.id),
];

export function PersonaMatchingStudio() {
  const [name, setName] = useState("Protagonist");
  const [primaryBias, setPrimaryBias] =
    useState<RomanceTropeClass>("bantering");
  const [secondaryBias, setSecondaryBias] =
    useState<RomanceTropeClass>("flustered");
  const [charm, setCharm] = useState(40);
  const [willpower, setWillpower] = useState(50);
  const [vulnerability, setVulnerability] = useState(30);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dialoguePreview, setDialoguePreview] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | undefined>();
  const [stagedCard, setStagedCard] =
    useState<ExtractedCharacterPayload | null>(null);
  const [isCommittingStagedCard, setIsCommittingStagedCard] = useState(false);
  const [targetName, setTargetName] = useState("Lucas");
  const [targetDescription, setTargetDescription] = useState(
    "A protective, brooding royal guard who shields his isolation with rigid, polite duty.",
  );
  const [matchingSeedInput, setMatchingSeedInput] = useState("");
  const [targetAvatarDataUri, setTargetAvatarDataUri] = useState<string | null>(
    null,
  );
  const [targetForbiddenTones, setTargetForbiddenTones] = useState<
    RomanceTropeClass[]
  >(fallbackTargetForbiddenTones);
  const [targetPreferredTones, setTargetPreferredTones] = useState<
    RomanceTropeClass[]
  >(fallbackTargetPreferredTones);

  const personaTraits: PersonaTraits = useMemo(
    () => ({
      name,
      primaryBias,
      secondaryBias,
      stats: { charm, vulnerability, willpower },
    }),
    [charm, name, primaryBias, secondaryBias, vulnerability, willpower],
  );

  const report = useMemo(
    () =>
      calculatePsychologicalResonance(
        personaTraits,
        targetForbiddenTones,
        targetPreferredTones,
      ),
    [personaTraits, targetForbiddenTones, targetPreferredTones],
  );

  async function initializeNarrativeBranch() {
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const result = await initializeProfileWithResonance({
        archetype: report.dynamicArchetype,
        name,
        primaryBias,
        resonanceScore: report.resonanceScore,
      });
      const preview = await fetchContextualNpcDialogue(
        "scene_01_alley_encounter",
      );
      setDialoguePreview(
        `${preview.speaker} / ${preview.applied_archetype}: ${preview.transformed_text}`,
      );
      setSyncStatus(result.message);
    } catch (caughtError) {
      setSyncStatus(
        `Could not initialize branch: ${
          caughtError instanceof Error ? caughtError.message : String(caughtError)
        }`,
      );
    } finally {
      setIsSyncing(false);
    }
  }

  function activateSavedPersona(profile: SavedPersonaMetadata) {
    setActiveProfileId(profile.id);
    setName(profile.name);
    setPrimaryBias(profile.coreClass);
    setCharm(profile.charm);
    setWillpower(profile.willpower);
    setVulnerability(profile.vulnerability);
    setSyncStatus(`Loaded ${profile.name} into the match controls.`);
    setDialoguePreview(null);
  }

  function handleImportedCharacterCard(payload: CharacterImportPayload) {
    const extractedPayload = toExtractedCharacterPayload(payload);
    setStagedCard(extractedPayload);
    setSyncStatus(`Loaded ${extractedPayload.name} for staging inspection.`);
    setDialoguePreview(null);
  }

  async function commitStagedCharacterCard() {
    if (!stagedCard) {
      return;
    }

    setIsCommittingStagedCard(true);
    setSyncStatus(null);

    try {
      await commitCharacterCardToActiveSlot(stagedCard);
      setTargetAvatarDataUri(stagedCard.avatarDataUri);
      setTargetName(stagedCard.name);
      setTargetDescription(
        stagedCard.description || "Imported card has no description.",
      );
      setTargetPreferredTones(stagedCard.preferredTones);
      setTargetForbiddenTones(stagedCard.forbiddenTones);
      setSyncStatus(`Committed ${stagedCard.name} to the active profile slot.`);
      setDialoguePreview(null);
      setStagedCard(null);
    } catch (caughtError) {
      setSyncStatus(
        `Could not commit staged card: ${
          caughtError instanceof Error ? caughtError.message : String(caughtError)
        }`,
      );
    } finally {
      setIsCommittingStagedCard(false);
    }
  }

  function applyMatchingVocabularySeed() {
    const compiledSeed = compileMatchingVocabularySeed(matchingSeedInput);
    if (!compiledSeed) {
      setSyncStatus("No matching vocabulary preset found for that seed ID.");
      return;
    }

    setTargetDescription((current) =>
      [current, compiledSeed].filter(Boolean).join("\n\n"),
    );
    setSyncStatus("Applied vocabulary seed to the target matching profile.");
    setDialoguePreview(null);
    setMatchingSeedInput("");
  }

  return (
    <Card className="bg-card/85">
      <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            {targetAvatarDataUri ? (
              <Image
                alt={`${targetName} avatar`}
                className="size-8 rounded-full border object-cover"
                height={32}
                src={targetAvatarDataUri}
                unoptimized
                width={32}
              />
            ) : null}
            <HeartHandshake className="size-5 text-primary" />
            Persona Match
          </CardTitle>
          <CardDescription>
            Tune the player persona against a target character without blocking
            difficult story routes.
          </CardDescription>
        </div>
        <Badge variant="outline">{targetName} target profile</Badge>
      </CardHeader>
      <CardContent className="grid gap-5">
        <CardParserUploader
          onCardSuccessfullyParsed={handleImportedCharacterCard}
        />
        <CharacterPreviewSheet
          cardPayload={stagedCard}
          isCommitting={isCommittingStagedCard}
          onClose={() => setStagedCard(null)}
          onCommitToSlot={commitStagedCharacterCard}
        />

        <PersonaSelectorGrid
          activeId={activeProfileId}
          onPersonaActivated={activateSavedPersona}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <div className="grid gap-4">
          <Field label="Persona name">
            <Input value={name} onChange={(event) => setName(event.currentTarget.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary tone">
              <select
                value={primaryBias}
                onChange={(event) =>
                  setPrimaryBias(event.currentTarget.value as RomanceTropeClass)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                {selectableTropes.map((trope) => (
                  <option key={trope} value={trope}>
                    {formatTropeLabel(trope)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Secondary tone">
              <select
                value={secondaryBias}
                onChange={(event) =>
                  setSecondaryBias(event.currentTarget.value as RomanceTropeClass)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
              >
                {selectableTropes.map((trope) => (
                  <option key={trope} value={trope}>
                    {formatTropeLabel(trope)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Vocabulary seed influence">
            <div className="grid gap-2">
              <Input
                autoComplete="off"
                data-no-field-copy="true"
                list="persona-match-vocabulary-seeds"
                placeholder="Choose any vocabulary preset ID..."
                value={matchingSeedInput}
                onChange={(event) =>
                  setMatchingSeedInput(event.currentTarget.value)
                }
              />
              <datalist id="persona-match-vocabulary-seeds">
                {matchingVocabularySeedIds.map((seedId) => (
                  <option key={seedId} value={seedId} />
                ))}
              </datalist>
              <Button
                type="button"
                variant="outline"
                onClick={applyMatchingVocabularySeed}
              >
                Apply Seed to Match
              </Button>
            </div>
          </Field>

          <div className="grid gap-4 rounded-md border bg-background/70 p-4">
            <RangeControl label="Charm" value={charm} onChange={setCharm} />
            <RangeControl
              label="Willpower"
              value={willpower}
              onChange={setWillpower}
            />
            <RangeControl
              label="Vulnerability"
              value={vulnerability}
              onChange={setVulnerability}
            />
          </div>
        </div>

        <section className={`grid gap-4 rounded-md border p-4 shadow-inner transition-all duration-300 ${report.uiGlow}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="outline" className="bg-background/70">
                Target Analysis
              </Badge>
              <span className="font-mono text-2xl font-black">
                {report.resonanceScore}%
              </span>
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {report.dynamicArchetype}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              Target: {targetName}
            </p>
            {targetAvatarDataUri ? (
              <div className="flex items-center gap-3 rounded-md border bg-background/70 p-3">
                <Image
                  alt={`${targetName} character card avatar`}
                  className="size-14 rounded-md border object-cover"
                  height={56}
                  src={targetAvatarDataUri}
                  unoptimized
                  width={56}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {targetName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Imported PNG avatar
                  </p>
                </div>
              </div>
            ) : null}
            <p className="text-sm leading-6 text-muted-foreground">
              {report.description}
            </p>
            <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
              {targetDescription}
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full border bg-background/70">
            <div
              className="h-full rounded-full bg-current transition-all duration-500"
              style={{ width: `${report.resonanceScore}%` }}
            />
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Activity className="size-3.5" />
              Preferred: {formatToneList(targetPreferredTones)}
            </p>
            <p className="flex items-center gap-2">
              <Gauge className="size-3.5" />
              Friction: {formatToneList(targetForbiddenTones)}
            </p>
          </div>

          <Button
            type="button"
            onClick={initializeNarrativeBranch}
            disabled={isSyncing}
          >
            <Sparkles className="size-4" />
            {isSyncing ? "Initializing..." : "Initialize Narrative Branch"}
          </Button>

          {syncStatus ? (
            <p className="text-xs leading-5 text-muted-foreground">{syncStatus}</p>
          ) : null}
          {dialoguePreview ? (
            <blockquote className="rounded-md border bg-background/70 p-3 text-xs leading-5 text-muted-foreground">
              {dialoguePreview}
            </blockquote>
          ) : null}
        </section>
        </div>
      </CardContent>
    </Card>
  );
}

function RangeControl(props: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {props.label}
        <span className="font-mono text-primary">{props.value}</span>
      </span>
      <input
        className="h-2 w-full cursor-pointer accent-primary"
        max={100}
        min={0}
        onChange={(event) => props.onChange(Number(event.currentTarget.value))}
        type="range"
        value={props.value}
      />
    </label>
  );
}

function formatTropeLabel(trope: RomanceTropeClass) {
  return trope
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatToneList(tones: RomanceTropeClass[]) {
  return tones.length > 0 ? tones.map(formatTropeLabel).join(", ") : "None tagged";
}

function normalizeTropeList(tones: string[]) {
  const normalized = tones
    .map((tone) => tone.trim().toLowerCase().replace(/[\s-]+/g, "_"))
    .map((tone) => RomanceTropeClassSchema.safeParse(tone))
    .filter((result) => result.success)
    .map((result) => result.data);

  return Array.from(new Set(normalized));
}

function compileMatchingVocabularySeed(seedId: string) {
  return tokenizeMatchingSeedInput(seedId)
    .map(compileSingleMatchingVocabularySeed)
    .filter(Boolean)
    .join("\n\n");
}

function compileSingleMatchingVocabularySeed(seedId: string) {
  for (const candidateSeedId of expandPresetLookupTokens(seedId)) {
    const compiledSeed = compileMatchingVocabularySeedCandidate(candidateSeedId);
    if (compiledSeed) {
      return compiledSeed;
    }
  }

  return "";
}

function tokenizeMatchingSeedInput(rawText: string) {
  return rawText
    .split(/[\n,;|]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function compileMatchingVocabularySeedCandidate(seedId: string) {
  const relationshipVocabulary =
    findRelationshipDynamicVocabularyById(seedId);
  if (relationshipVocabulary) {
    const injection =
      compileRelationshipDynamicVocabularyInjection(relationshipVocabulary);
    return [
      `Relationship vocabulary preset: ${relationshipVocabulary.vibe}.`,
      injection.lexicalConstraints,
      injection.formattingDirectives,
      injection.systemBehavior,
    ].join("\n");
  }

  const complementVocabulary = findComplementVocabularyById(seedId);
  if (complementVocabulary) {
    const additions = compileComplementVocabularyAdditions(complementVocabulary);
    return [
      additions.relationshipAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const forbiddenTaboo = findForbiddenTabooPresetById(seedId);
  if (forbiddenTaboo) {
    const additions = compileForbiddenTabooPresetAdditions(forbiddenTaboo);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const arrangedMatch = findArrangedMatchPresetById(seedId);
  if (arrangedMatch) {
    const additions = compileArrangedMatchPresetAdditions(arrangedMatch);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const mentorProtege = findMentorProtegePresetById(seedId);
  if (mentorProtege) {
    const additions = compileMentorProtegePresetAdditions(mentorProtege);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const fakeDating = findFakeDatingPresetById(seedId);
  if (fakeDating) {
    const additions = compileFakeDatingPresetAdditions(fakeDating);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const grumpySunshine = findGrumpySunshinePresetById(seedId);
  if (grumpySunshine) {
    const additions = compileGrumpySunshinePresetAdditions(grumpySunshine);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const darkObsessive = findDarkObsessivePresetById(seedId);
  if (darkObsessive) {
    const additions = compileDarkObsessivePresetAdditions(darkObsessive);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const formalArranged = findFormalArrangedPresetById(seedId);
  if (formalArranged) {
    const additions = compileFormalArrangedPresetAdditions(formalArranged);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const academicRival = findAcademicRivalPresetById(seedId);
  if (academicRival) {
    const additions = compileAcademicRivalPresetAdditions(academicRival);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const caretakerHurtComfort = findCaretakerHurtComfortPresetById(seedId);
  if (caretakerHurtComfort) {
    const additions =
      compileCaretakerHurtComfortPresetAdditions(caretakerHurtComfort);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const caretaker = findCaretakerPresetById(seedId);
  if (caretaker) {
    const additions = compileCaretakerPresetAdditions(caretaker);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const friction = findFrictionPresetById(seedId);
  if (friction) {
    const additions = compileFrictionPresetAdditions(friction);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const rivalry = findRivalryPresetById(seedId);
  if (rivalry) {
    const additions = compileRivalryPresetAdditions(rivalry);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const devotion = findDevotionPresetById(seedId);
  if (devotion) {
    const additions = compileDevotionPresetAdditions(devotion);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const obsession = findObsessionPresetById(seedId);
  if (obsession) {
    const additions = compileObsessionPresetAdditions(obsession);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const possessive = findPossessivePresetById(seedId);
  if (possessive) {
    const additions = compilePossessivePresetAdditions(possessive);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const slowBurn = findSlowBurnPresetById(seedId);
  if (slowBurn) {
    const additions = compileSlowBurnPresetAdditions(slowBurn);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const flawSecret = findFlawSecretPresetById(seedId);
  if (flawSecret) {
    const additions = compileFlawSecretPresetAdditions(flawSecret);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const teasing = findTeasingPresetById(seedId);
  if (teasing) {
    const additions = compileTeasingPresetAdditions(teasing);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const ageLifeStage = findAgeLifeStagePresetById(seedId);
  if (ageLifeStage) {
    const additions = compileAgeLifeStagePresetAdditions(ageLifeStage);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const speciesHeritage = findSpeciesHeritagePresetById(seedId);
  if (speciesHeritage) {
    const additions = compileSpeciesHeritagePresetAdditions(speciesHeritage);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const human = findHumanPresetById(seedId);
  if (human) {
    const additions = compileHumanPresetAdditions(human);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const vampire = findVampirePresetById(seedId);
  if (vampire) {
    const additions = compileVampirePresetAdditions(vampire);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const fae = findFaePresetById(seedId);
  if (fae) {
    const additions = compileFaePresetAdditions(fae);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const demon = findDemonPresetById(seedId);
  if (demon) {
    const additions = compileDemonPresetAdditions(demon);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const angel = findAngelPresetById(seedId);
  if (angel) {
    const additions = compileAngelPresetAdditions(angel);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const android = findAndroidPresetById(seedId);
  if (android) {
    const additions = compileAndroidPresetAdditions(android);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const alien = findAlienPresetById(seedId);
  if (alien) {
    const additions = compileAlienPresetAdditions(alien);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const shifter = findShifterPresetById(seedId);
  if (shifter) {
    const additions = compileShifterPresetAdditions(shifter);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const fatedReincarnation = findFatedReincarnationPresetById(seedId);
  if (fatedReincarnation) {
    const additions =
      compileFatedReincarnationPresetAdditions(fatedReincarnation);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const secondChance = findSecondChancePresetById(seedId);
  if (secondChance) {
    const additions = compileSecondChancePresetAdditions(secondChance);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const workplaceHierarchy = findWorkplaceHierarchyPresetById(seedId);
  if (workplaceHierarchy) {
    const additions =
      compileWorkplaceHierarchyPresetAdditions(workplaceHierarchy);
    return [
      additions.backgroundAddition,
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const friendsToLovers = findFriendsToLoversPresetById(seedId);
  if (friendsToLovers) {
    const additions = compileFriendsToLoversPresetAdditions(friendsToLovers);
    return [
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const flirting = findFlirtingPresetById(seedId);
  if (flirting) {
    const additions = compileFlirtingPresetAdditions(flirting);
    return [
      additions.personalityAddition,
      additions.scenarioAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const jealousy = findJealousyPresetById(seedId);
  if (jealousy) {
    const additions = compileJealousyPresetAdditions(jealousy);
    return [
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const affection = findAffectionPresetById(seedId);
  if (affection) {
    const additions = compileAffectionPresetAdditions(affection);
    return [
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const loyalty = findLoyaltyPresetById(seedId);
  if (loyalty) {
    const additions = compileLoyaltyPresetAdditions(loyalty);
    return [
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const loveLanguage = findLoveLanguagePresetById(seedId);
  if (loveLanguage) {
    const additions = compileLoveLanguagePresetAdditions(loveLanguage);
    return [
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const conflictStyle = findConflictStylePresetById(seedId);
  if (conflictStyle) {
    const additions = compileConflictStylePresetAdditions(conflictStyle);
    return [
      additions.relationshipAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const originWound = findOriginWoundVocabularyPresetById(seedId);
  if (originWound) {
    const additions = compileOriginWoundPresetAdditions(originWound);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const formativeEvent = findFormativeEventPresetById(seedId);
  if (formativeEvent) {
    const additions = compileFormativeEventPresetAdditions(formativeEvent);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const familyHistory = findFamilyHistoryPresetById(seedId);
  if (familyHistory) {
    const additions = compileFamilyHistoryPresetAdditions(familyHistory);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const regret = findRegretPresetById(seedId);
  if (regret) {
    const additions = compileRegretPresetAdditions(regret);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const exile = findExilePresetById(seedId);
  if (exile) {
    const additions = compileExilePresetAdditions(exile);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const betrayal = findBetrayalPresetById(seedId);
  if (betrayal) {
    const additions = compileBetrayalPresetAdditions(betrayal);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const loss = findLossPresetById(seedId);
  if (loss) {
    const additions = compileLossPresetAdditions(loss);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const secret = findSecretPresetById(seedId);
  if (secret) {
    const additions = compileSecretPresetAdditions(secret);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const ambition = findAmbitionPresetById(seedId);
  if (ambition) {
    const additions = compileAmbitionPresetAdditions(ambition);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const speechStyle = findSpeechStylePresetById(seedId);
  if (speechStyle) {
    return compileSpeechStylePresetSummary(speechStyle);
  }

  const voiceVocabulary = findVoiceVocabularyPresetById(seedId);
  if (voiceVocabulary) {
    const additions = compileVoiceVocabularyPresetAdditions(voiceVocabulary);
    return [
      additions.speechStyleAddition,
      additions.lexicalGuidance,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const dialect = findDialectPresetById(seedId);
  if (dialect) {
    const additions = compileDialectPresetAdditions(dialect);
    return [
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const formality = findFormalityPresetById(seedId);
  if (formality) {
    const additions = compileFormalityPresetAdditions(formality);
    return [
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const petNames = findPetNamePresetById(seedId);
  if (petNames) {
    const additions = compilePetNamePresetAdditions(petNames);
    return [
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const sentenceRhythm = findSentenceRhythmPresetById(seedId);
  if (sentenceRhythm) {
    const additions = compileSentenceRhythmPresetAdditions(sentenceRhythm);
    return [
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const communicationStyle = findCommunicationStylePresetById(seedId);
  if (communicationStyle) {
    const additions =
      compileCommunicationStylePresetAdditions(communicationStyle);
    return [
      additions.speechStyleAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  const morality = findMoralityPresetById(seedId);
  if (morality) {
    const additions = compileMoralityPresetAdditions(morality);
    return [
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ].join("\n");
  }

  return "";
}

function toExtractedCharacterPayload(
  payload: CharacterImportPayload,
): ExtractedCharacterPayload {
  const preferredTones = normalizeTropeList(payload.metadata.preferredTones);
  const forbiddenTones = normalizeTropeList(payload.metadata.forbiddenTones);

  return {
    avatarDataUri: payload.avatarDataUri,
    description: payload.metadata.description,
    forbiddenTones,
    name: payload.metadata.name,
    preferredTones,
    requiredThresholds: inferRequiredThresholds(preferredTones, forbiddenTones),
  };
}

function inferRequiredThresholds(
  preferredTones: RomanceTropeClass[],
  forbiddenTones: RomanceTropeClass[],
) {
  const minCharm = preferredTones.some((tone) =>
    ["bantering", "flustered", "recognized", "sunshine"].includes(tone),
  )
    ? 45
    : 0;

  const minWillpower = [...preferredTones, ...forbiddenTones].some((tone) =>
    ["antagonistic", "commanding", "forbidden", "protective"].includes(tone),
  )
    ? 50
    : 0;

  return { minCharm, minWillpower };
}
