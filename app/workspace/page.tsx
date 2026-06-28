"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileUp,
  PanelLeftOpen,
  Sparkles,
  UserRoundPlus,
  X,
} from "lucide-react";

import CardLibraryPanel from "@/components/card-library-panel";
import { BotWaffleAuthoringStudioPanel } from "@/components/botwaffle-authoring-studio-panel";
import { CharacterLibraryWorkspace } from "@/components/character-library-workspace";
import { DevToolsPanel } from "@/components/dev-tools-panel";
import DropZoneOverlay from "@/components/DropZoneOverlay";
import ExpressionManager from "@/components/expression-manager";
import { FolderIntakeReview } from "@/components/folder-intake-review";
import { SemanticNodeCreatorPanel } from "@/components/semantic-node-creator-panel";
import { StudioShell } from "@/components/studio-shell";
import StructuredCardEditor from "@/components/structured-card-editor";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLibrary } from "@/hooks/character-card/useCharacterLibrary";
import { useFileDialogs } from "@/hooks/useFileDialogs";
import { useCardLibrary } from "@/hooks/useCardLibrary";
import { savePersonaLibraryItem } from "@/hooks/usePersonaLibrary";
import { createPersonaArtifactFromCharacterCard } from "@/features/generation/workflows";
import { downloadUint8Array } from "@/lib/browser/downloadUint8Array";
import { cn } from "@/lib/utils";
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
  compileDialectPresetAdditions,
  findDialectPresetById,
  DIALECT_PRESETS,
} from "@/data/dialectPresets";
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
import { importBrowserCharacterCardFile } from "@/lib/character-card/importBrowserCharacterCardFile";
import { consumePendingLibraryCardPath } from "@/lib/character-card/librarySelectionHandoff";
import { expandPresetLookupTokens } from "@/lib/character-card/presetSpellingAliases";
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
    placeholder: "Core traits, wounds, habits, voice, behaviour patterns...",
    rows: 3,
    section: "vibe",
  },
  {
    key: "personalitySeeds",
    label: "Soul sketch seeds",
    placeholder: "guarded, dry humour, secretly sentimental, observant...",
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
    "guarded",
    "dry humour",
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
    ...DIALECT_PRESETS.map((preset) => preset.id),
    ...FORMALITY_PRESETS.map((preset) => preset.id),
    ...PET_NAME_PRESETS.map((preset) => preset.id),
    ...SENTENCE_RHYTHM_PRESETS.map((preset) => preset.id),
    ...COMMUNICATION_STYLE_PRESETS.map((preset) => preset.id),
    ...MORALITY_PRESETS.map((preset) => preset.id),
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

const MAX_BROWSER_PNG_SHELL_BYTES = 20 * 1024 * 1024;

interface PendingPngMetadataChoice {
  blankCard: ValidatedCharacterCardV3;
  filePath: string;
  sourcePngData: Uint8Array | null;
  storedCard: ValidatedCharacterCardV3;
}

interface ImportReviewSummary {
  emptyFields: string[];
  filePath: string;
  formatLabel: string;
  preservedFields: string[];
  warnings: string[];
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
  const [lastImportReview, setLastImportReview] =
    useState<ImportReviewSummary | null>(null);
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
    importReview: ImportReviewSummary | null = null,
  ) {
    setActiveCard(card);
    setCurrentFilePath(filePath);
    setBrowserSourcePngData(sourcePngData);
    setSelectedExpression(null);
    setLastImportReview(importReview);
    library.refresh();
  }

  async function handleCardSelect(filePath: string) {
    setWorkspaceMessage(`Loading cached card: ${filePath}`);

    const result = await importCardFromPath(filePath);
    if (result.card) {
      handleCardLoaded(
        result.card,
        filePath,
        null,
        createImportReviewSummary(result.card, filePath, "Cached library card"),
      );
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
      handleCardLoaded(
        result.card,
        result.path,
        result.sourcePngData,
        createImportReviewSummary(
          result.card,
          result.path,
          inferImportFormatLabel(result.path),
        ),
      );
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
        handleCardLoaded(
          blankCard,
          filePath,
          null,
          createImportReviewSummary(blankCard, filePath, "PNG image shell"),
        );
        setWorkspaceMessage(`Started a blank character using ${filePath} as the portrait.`);
        return;
      }

      setWorkspaceMessage(result.error ?? `Could not read ${filePath}.`);
      return;
    }

    const result = await importCardFromPath(filePath);
    if (result.card) {
      handleCardLoaded(
        result.card,
        filePath,
        null,
        createImportReviewSummary(
          result.card,
          filePath,
          inferImportFormatLabel(filePath),
        ),
      );
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

      handleCardLoaded(
        blankCard,
        file.name,
        pngData,
        createImportReviewSummary(blankCard, file.name, "PNG image shell"),
      );
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
                handleCardLoaded(
                  parsed,
                  filePath,
                  sourcePngData ?? null,
                  createImportReviewSummary(parsed, filePath, "PNG image shell"),
                );
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

            handleCardLoaded(
              parsed,
              filePath,
              sourcePngData ?? null,
              createImportReviewSummary(
                parsed,
                filePath,
                inferImportFormatLabel(filePath),
              ),
            );
            setWorkspaceMessage(null);
          }}
          onDropError={setWorkspaceMessage}
          onImageOnlyPng={(filePath, sourcePngData) => {
            const blankCard = createBlankDraftCharacterCard(filePath);
            handleCardLoaded(
              blankCard,
              filePath,
              sourcePngData ?? null,
              createImportReviewSummary(blankCard, filePath, "PNG image shell"),
            );
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
                createImportReviewSummary(
                  pendingMetadataChoice.blankCard,
                  pendingMetadataChoice.filePath,
                  "PNG image shell",
                ),
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
                createImportReviewSummary(
                  pendingMetadataChoice.storedCard,
                  pendingMetadataChoice.filePath,
                  "PNG stored card metadata",
                ),
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

          {lastImportReview ? (
            <ImportReviewPanel review={lastImportReview} />
          ) : null}

          <BotWaffleAuthoringStudioPanel />

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
          <SemanticNodeCreatorPanel />
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
  const backstorySeedText = joinDefined([
    fields.originWounds,
    fields.formativeEvents,
    fields.familyHistory,
    fields.secrets,
    fields.regrets,
    fields.exile,
    fields.betrayal,
    fields.loss,
    fields.ambition,
  ]);
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
  const complementAdditions = findPresetMatches(
    fields.relationshipDynamic,
    findComplementVocabularyById,
  ).map((preset) => {
    const additions = compileComplementVocabularyAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.systemPromptAddition,
    ]);
  });

  const fatedReincarnationAdditions = findPresetMatches(
    fields.relationshipDynamic,
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

  const forbiddenTabooAdditions = findPresetMatches(
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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

  const secondChanceAdditions = findPresetMatches(
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
  const jealousyAdditions = findPresetMatches(
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
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
    fields.relationshipDynamic,
    findConflictStylePresetById,
  ).map((preset) => {
    const additions = compileConflictStylePresetAdditions(preset);
    return joinDefined([
      additions.relationshipAddition,
      additions.personalityAddition,
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
  const dialectAdditions = findPresetMatches(
    fields.personalitySeeds,
    findDialectPresetById,
  ).map((preset) => {
    const additions = compileDialectPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const formalityAdditions = findPresetMatches(
    fields.personalitySeeds,
    findFormalityPresetById,
  ).map((preset) => {
    const additions = compileFormalityPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const petNameAdditions = findPresetMatches(
    fields.personalitySeeds,
    findPetNamePresetById,
  ).map((preset) => {
    const additions = compilePetNamePresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const sentenceRhythmAdditions = findPresetMatches(
    fields.personalitySeeds,
    findSentenceRhythmPresetById,
  ).map((preset) => {
    const additions = compileSentenceRhythmPresetAdditions(preset);
    return joinDefined([
      additions.speechStyleAddition,
      additions.systemPromptAddition,
    ]);
  });
  const communicationStyleAdditions = findPresetMatches(
    fields.personalitySeeds,
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
    fields.personalitySeeds,
    findMoralityPresetById,
  ).map((preset) => {
    const additions = compileMoralityPresetAdditions(preset);
    return joinDefined([
      additions.backgroundAddition,
      additions.personalityAddition,
      additions.systemPromptAddition,
    ]);
  });
  const speechAdditions = [
    ...speechStyleAdditions,
    ...voiceVocabularyAdditions,
    ...dialectAdditions,
    ...formalityAdditions,
    ...petNameAdditions,
    ...sentenceRhythmAdditions,
    ...communicationStyleAdditions,
  ];

  return joinDefined([
    relationshipVocabularyAdditions.length
      ? `Relationships:\n${relationshipVocabularyAdditions.join("\n\n")}`
      : "",
    complementAdditions.length
      ? `Relationship Complements:\n${complementAdditions.join("\n\n")}`
      : "",
    arrangedMatchAdditions.length
      ? `Arranged Match:\n${arrangedMatchAdditions.join("\n\n")}`
      : "",
    forbiddenTabooAdditions.length
      ? `Forbidden / Taboo Intersections:\n${forbiddenTabooAdditions.join("\n\n")}`
      : "",
    mentorProtegeAdditions.length
      ? `Mentor / Protégé:\n${mentorProtegeAdditions.join("\n\n")}`
      : "",
    fakeDatingAdditions.length
      ? `Fake Dating:\n${fakeDatingAdditions.join("\n\n")}`
      : "",
    grumpySunshineAdditions.length
      ? `Grumpy / Sunshine:\n${grumpySunshineAdditions.join("\n\n")}`
      : "",
    darkObsessiveAdditions.length
      ? `Dark / Obsessive:\n${darkObsessiveAdditions.join("\n\n")}`
      : "",
    formalArrangedAdditions.length
      ? `Formal / Arranged:\n${formalArrangedAdditions.join("\n\n")}`
      : "",
    academicRivalAdditions.length
      ? `Academic / Rival:\n${academicRivalAdditions.join("\n\n")}`
      : "",
    caretakerHurtComfortAdditions.length
      ? `Caretaker / Hurt-Comfort:\n${caretakerHurtComfortAdditions.join("\n\n")}`
      : "",
    caretakerAdditions.length
      ? `Caretaker:\n${caretakerAdditions.join("\n\n")}`
      : "",
    frictionAdditions.length
      ? `Friction:\n${frictionAdditions.join("\n\n")}`
      : "",
    rivalryAdditions.length
      ? `Rivalry:\n${rivalryAdditions.join("\n\n")}`
      : "",
    devotionAdditions.length
      ? `Devotion:\n${devotionAdditions.join("\n\n")}`
      : "",
    obsessionAdditions.length
      ? `Obsession:\n${obsessionAdditions.join("\n\n")}`
      : "",
    possessiveAdditions.length
      ? `Possessive:\n${possessiveAdditions.join("\n\n")}`
      : "",
    slowBurnAdditions.length
      ? `Slow Burn:\n${slowBurnAdditions.join("\n\n")}`
      : "",
    flawSecretAdditions.length
      ? `Flaw / Secret:\n${flawSecretAdditions.join("\n\n")}`
      : "",
    teasingAdditions.length
      ? `Teasing:\n${teasingAdditions.join("\n\n")}`
      : "",
    ageLifeStageAdditions.length
      ? `Age / Life Stage:\n${ageLifeStageAdditions.join("\n\n")}`
      : "",
    speciesHeritageAdditions.length
      ? `Species / Heritage:\n${speciesHeritageAdditions.join("\n\n")}`
      : "",
    humanAdditions.length
      ? `Human:\n${humanAdditions.join("\n\n")}`
      : "",
    vampireAdditions.length
      ? `Vampire:\n${vampireAdditions.join("\n\n")}`
      : "",
    faeAdditions.length
      ? `Fae:\n${faeAdditions.join("\n\n")}`
      : "",
    demonAdditions.length
      ? `Demon:\n${demonAdditions.join("\n\n")}`
      : "",
    angelAdditions.length
      ? `Angel:\n${angelAdditions.join("\n\n")}`
      : "",
    androidAdditions.length
      ? `Android:\n${androidAdditions.join("\n\n")}`
      : "",
    alienAdditions.length
      ? `Alien:\n${alienAdditions.join("\n\n")}`
      : "",
    shifterAdditions.length
      ? `Shifter:\n${shifterAdditions.join("\n\n")}`
      : "",
    fatedReincarnationAdditions.length
      ? `Fated / Reincarnation:\n${fatedReincarnationAdditions.join("\n\n")}`
      : "",
    secondChanceAdditions.length
      ? `Second Chance:\n${secondChanceAdditions.join("\n\n")}`
      : "",
    workplaceHierarchyAdditions.length
      ? `Workplace Hierarchy:\n${workplaceHierarchyAdditions.join("\n\n")}`
      : "",
    friendsToLoversAdditions.length
      ? `Friends to Lovers:\n${friendsToLoversAdditions.join("\n\n")}`
      : "",
    flirtingAdditions.length
      ? `Scenario:\n${flirtingAdditions.join("\n\n")}`
      : "",
    jealousyAdditions.length
      ? `Jealousy:\n${jealousyAdditions.join("\n\n")}`
      : "",
    affectionAdditions.length
      ? `Affection:\n${affectionAdditions.join("\n\n")}`
      : "",
    loyaltyAdditions.length
      ? `Loyalty:\n${loyaltyAdditions.join("\n\n")}`
      : "",
    loveLanguageAdditions.length
      ? `Love Language:\n${loveLanguageAdditions.join("\n\n")}`
      : "",
    conflictStyleAdditions.length
      ? `Conflict Style:\n${conflictStyleAdditions.join("\n\n")}`
      : "",
    originWoundAdditions.length
      ? `Background Story:\n${originWoundAdditions.join("\n\n")}`
      : "",
    formativeEventAdditions.length
      ? `Formative Events:\n${formativeEventAdditions.join("\n\n")}`
      : "",
    familyHistoryAdditions.length
      ? `Family History:\n${familyHistoryAdditions.join("\n\n")}`
      : "",
    regretAdditions.length
      ? `Regrets:\n${regretAdditions.join("\n\n")}`
      : "",
    exileAdditions.length
      ? `Exile:\n${exileAdditions.join("\n\n")}`
      : "",
    betrayalAdditions.length
      ? `Betrayal:\n${betrayalAdditions.join("\n\n")}`
      : "",
    lossAdditions.length
      ? `Loss:\n${lossAdditions.join("\n\n")}`
      : "",
    secretAdditions.length
      ? `Secrets:\n${secretAdditions.join("\n\n")}`
      : "",
    ambitionAdditions.length
      ? `Ambition:\n${ambitionAdditions.join("\n\n")}`
      : "",
    moralityAdditions.length
      ? `Morality:\n${moralityAdditions.join("\n\n")}`
      : "",
    speechAdditions.length
      ? `Speech Style:\n${joinDefined(speechAdditions)}`
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
                <SeedCombo
                  datalistId="dialect-seeds"
                  label="Add dialect / accent"
                  name="dialectSeedCustom"
                  options={DIALECT_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="formality-seeds"
                  label="Add formality / titles"
                  name="formalitySeedCustom"
                  options={FORMALITY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="pet-name-seeds"
                  label="Add pet-name rules"
                  name="petNameSeedCustom"
                  options={PET_NAME_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="sentence-rhythm-seeds"
                  label="Add sentence rhythm"
                  name="sentenceRhythmSeedCustom"
                  options={SENTENCE_RHYTHM_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="communication-style-seeds"
                  label="Add communication style"
                  name="communicationStyleSeedCustom"
                  options={COMMUNICATION_STYLE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
                <SeedCombo
                  datalistId="morality-seeds"
                  label="Add morality / ethics"
                  name="moralitySeedCustom"
                  options={MORALITY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("personalitySeeds", value)}
                />
              </div>
            ) : null}

            {section.id === "backstory" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <SeedCombo
                  datalistId="origin-wound-seeds"
                  label="Add origin wound preset"
                  name="originWoundSeedCustom"
                  options={ORIGIN_WOUND_VOCABULARY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("originWounds", value)}
                />
                <SeedCombo
                  datalistId="formative-event-seeds"
                  label="Add formative event"
                  name="formativeEventSeedCustom"
                  options={FORMATIVE_EVENT_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("formativeEvents", value)}
                />
                <SeedCombo
                  datalistId="family-history-seeds"
                  label="Add family history"
                  name="familyHistorySeedCustom"
                  options={FAMILY_HISTORY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("familyHistory", value)}
                />
                <SeedCombo
                  datalistId="secret-backstory-seeds"
                  label="Add secret backstory seed"
                  name="secretBackstorySeedCustom"
                  options={SECRET_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("secrets", value)}
                />
                <SeedCombo
                  datalistId="regret-seeds"
                  label="Add regret seed"
                  name="regretSeedCustom"
                  options={REGRET_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("regrets", value)}
                />
                <SeedCombo
                  datalistId="exile-seeds"
                  label="Add exile seed"
                  name="exileSeedCustom"
                  options={EXILE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("exile", value)}
                />
                <SeedCombo
                  datalistId="betrayal-seeds"
                  label="Add betrayal seed"
                  name="betrayalSeedCustom"
                  options={BETRAYAL_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("betrayal", value)}
                />
                <SeedCombo
                  datalistId="loss-seeds"
                  label="Add loss seed"
                  name="lossSeedCustom"
                  options={LOSS_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("loss", value)}
                />
                <SeedCombo
                  datalistId="ambition-seeds"
                  label="Add ambition seed"
                  name="ambitionSeedCustom"
                  options={AMBITION_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("ambition", value)}
                />
              </div>
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
                <SeedCombo
                  datalistId="complement-vocabulary-seeds"
                  label="Add complement vocabulary"
                  name="complementSeedCustom"
                  options={COMPLEMENT_VOCABULARY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="forbidden-taboo-seeds"
                  label="Add forbidden / taboo intersection"
                  name="forbiddenTabooSeedCustom"
                  options={FORBIDDEN_TABOO_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="arranged-match-seeds"
                  label="Add arranged match seed"
                  name="arrangedMatchSeedCustom"
                  options={ARRANGED_MATCH_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="mentor-protege-seeds"
                  label="Add mentor / protégé seed"
                  name="mentorProtegeSeedCustom"
                  options={MENTOR_PROTEGE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="fake-dating-seeds"
                  label="Add fake dating seed"
                  name="fakeDatingSeedCustom"
                  options={FAKE_DATING_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="grumpy-sunshine-seeds"
                  label="Add grumpy / sunshine seed"
                  name="grumpySunshineSeedCustom"
                  options={GRUMPY_SUNSHINE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="dark-obsessive-seeds"
                  label="Add dark / obsessive seed"
                  name="darkObsessiveSeedCustom"
                  options={DARK_OBSESSIVE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="formal-arranged-seeds"
                  label="Add formal / arranged seed"
                  name="formalArrangedSeedCustom"
                  options={FORMAL_ARRANGED_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="academic-rival-seeds"
                  label="Add academic / rival seed"
                  name="academicRivalSeedCustom"
                  options={ACADEMIC_RIVAL_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="caretaker-hurt-comfort-seeds"
                  label="Add caretaker / hurt-comfort seed"
                  name="caretakerHurtComfortSeedCustom"
                  options={CARETAKER_HURT_COMFORT_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="caretaker-seeds"
                  label="Add caretaker seed"
                  name="caretakerSeedCustom"
                  options={CARETAKER_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="friction-seeds"
                  label="Add friction seed"
                  name="frictionSeedCustom"
                  options={FRICTION_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="rivalry-seeds"
                  label="Add rivalry seed"
                  name="rivalrySeedCustom"
                  options={RIVALRY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="devotion-seeds"
                  label="Add devotion seed"
                  name="devotionSeedCustom"
                  options={DEVOTION_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="obsession-seeds"
                  label="Add obsession seed"
                  name="obsessionSeedCustom"
                  options={OBSESSION_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="possessive-seeds"
                  label="Add possessive seed"
                  name="possessiveSeedCustom"
                  options={POSSESSIVE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="slow-burn-seeds"
                  label="Add slow-burn seed"
                  name="slowBurnSeedCustom"
                  options={SLOW_BURN_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="flaw-secret-seeds"
                  label="Add flaw / secret seed"
                  name="flawSecretSeedCustom"
                  options={FLAW_SECRET_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="teasing-seeds"
                  label="Add teasing seed"
                  name="teasingSeedCustom"
                  options={TEASING_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="age-life-stage-seeds"
                  label="Add age / life-stage seed"
                  name="ageLifeStageSeedCustom"
                  options={AGE_LIFE_STAGE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="species-heritage-seeds"
                  label="Add species / heritage seed"
                  name="speciesHeritageSeedCustom"
                  options={SPECIES_HERITAGE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="human-seeds"
                  label="Add human seed"
                  name="humanSeedCustom"
                  options={HUMAN_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="vampire-seeds"
                  label="Add vampire seed"
                  name="vampireSeedCustom"
                  options={VAMPIRE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="fae-seeds"
                  label="Add fae seed"
                  name="faeSeedCustom"
                  options={FAE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="demon-seeds"
                  label="Add demon seed"
                  name="demonSeedCustom"
                  options={DEMON_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="angel-seeds"
                  label="Add angel seed"
                  name="angelSeedCustom"
                  options={ANGEL_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="android-seeds"
                  label="Add android seed"
                  name="androidSeedCustom"
                  options={ANDROID_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="alien-seeds"
                  label="Add alien seed"
                  name="alienSeedCustom"
                  options={ALIEN_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="shifter-seeds"
                  label="Add shifter seed"
                  name="shifterSeedCustom"
                  options={SHIFTER_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="fated-reincarnation-seeds"
                  label="Add fated / reincarnation seed"
                  name="fatedReincarnationSeedCustom"
                  options={FATED_REINCARNATION_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="second-chance-seeds"
                  label="Add second-chance seed"
                  name="secondChanceSeedCustom"
                  options={SECOND_CHANCE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="workplace-hierarchy-seeds"
                  label="Add workplace hierarchy seed"
                  name="workplaceHierarchySeedCustom"
                  options={WORKPLACE_HIERARCHY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="friends-to-lovers-seeds"
                  label="Add friends-to-lovers seed"
                  name="friendsToLoversSeedCustom"
                  options={FRIENDS_TO_LOVERS_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="jealousy-seeds"
                  label="Add jealousy seed"
                  name="jealousySeedCustom"
                  options={JEALOUSY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="affection-seeds"
                  label="Add affection seed"
                  name="affectionSeedCustom"
                  options={AFFECTION_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="loyalty-seeds"
                  label="Add loyalty seed"
                  name="loyaltySeedCustom"
                  options={LOYALTY_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="love-language-seeds"
                  label="Add love language seed"
                  name="loveLanguageSeedCustom"
                  options={LOVE_LANGUAGE_PRESETS.map((preset) => preset.id)}
                  onAdd={(value) => handleAddSeed("relationshipDynamic", value)}
                />
                <SeedCombo
                  datalistId="conflict-style-seeds"
                  label="Add conflict style"
                  name="conflictStyleSeedCustom"
                  options={CONFLICT_STYLE_PRESETS.map((preset) => preset.id)}
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

function ImportReviewPanel({ review }: { review: ImportReviewSummary }) {
  return (
    <section className="rounded-xl border border-border bg-card/75 p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Import Review
            </h2>
          </div>
          <p className="mt-1 truncate text-sm text-foreground">
            {review.formatLabel}
          </p>
          <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
            {review.filePath}
          </p>
        </div>
        {review.warnings.length > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-200">
            <AlertTriangle className="size-3" />
            {review.warnings.length} warning
            {review.warnings.length === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200">
            Ready to edit
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <ImportReviewColumn
          label="Preserved"
          tone="good"
          values={review.preservedFields}
        />
        <ImportReviewColumn
          label="Empty / optional"
          tone="muted"
          values={review.emptyFields}
        />
        <ImportReviewColumn
          label="Review"
          tone="warning"
          values={review.warnings}
        />
      </div>
    </section>
  );
}

function ImportReviewColumn({
  label,
  tone,
  values,
}: {
  label: string;
  tone: "good" | "muted" | "warning";
  values: string[];
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-400/20 bg-emerald-400/5"
      : tone === "warning"
        ? "border-amber-400/25 bg-amber-400/10"
        : "border-border bg-background/60";

  return (
    <div className={cn("rounded-lg border p-3", toneClass)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              key={value}
              className="rounded-md border border-border/70 bg-card px-2 py-1 text-[11px] text-muted-foreground"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </div>
    </div>
  );
}

function createImportReviewSummary(
  card: ValidatedCharacterCardV3,
  filePath: string,
  formatLabel: string,
): ImportReviewSummary {
  const data = card.data;
  const fields = [
    { label: "Name", value: data.name },
    { label: "Description", value: data.description },
    { label: "Personality", value: data.personality },
    { label: "Scenario", value: data.scenario },
    { label: "First message", value: data.first_mes },
    { label: "Example dialogue", value: data.mes_example },
    { label: "Creator notes", value: data.creator_notes },
    { label: "System prompt", value: data.system_prompt },
    { label: "Post history", value: data.post_history_instructions },
    { label: "Tags", value: data.tags },
    { label: "Alt greetings", value: data.alternate_greetings },
    { label: "Lorebook", value: data.character_book?.entries },
  ];
  const preservedFields = fields
    .filter((field) => hasImportReviewValue(field.value))
    .map((field) => field.label);
  const emptyFields = fields
    .filter((field) => !hasImportReviewValue(field.value))
    .map((field) => field.label);
  const warnings = [
    hasImportReviewValue(data.first_mes)
      ? null
      : "First message is empty; add an opening before chat testing.",
    data.tags.length > 0
      ? null
      : "No tags found; add discoverability and routing tags before export.",
    hasImportReviewValue(data.personality) || hasImportReviewValue(data.description)
      ? null
      : "Character prose is sparse; review description and personality.",
    formatLabel.includes("shell")
      ? "Image-only import created a draft card shell."
      : null,
  ].filter(Boolean) as string[];

  return {
    emptyFields,
    filePath,
    formatLabel,
    preservedFields,
    warnings,
  };
}

function hasImportReviewValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function inferImportFormatLabel(filePath: string) {
  if (/\.json$/i.test(filePath)) {
    return "JSON card converted to CCV3";
  }

  if (isPngPath(filePath)) {
    return "PNG stored card metadata";
  }

  if (/\.charx$/i.test(filePath)) {
    return "CHARX card archive";
  }

  return "Character card import";
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
