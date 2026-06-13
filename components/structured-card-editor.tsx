"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { BookOpen, Plus, Trash2, Upload, WandSparkles, X } from "lucide-react";

import CharacterCardPreview from "@/components/character-card-preview";
import ProsePixieModal, {
  type ProsePixieTarget,
} from "@/components/prose-pixie-modal";
import { SearchableSeedPicker } from "@/components/searchable-seed-picker";
import type { SeedPickerEntry } from "@/data/seedPickerRegistry";
import {
  generatedLorebookArtifactToV3Document,
  importLorebookV3Json,
} from "@/features/lorebooks/adapters";
import {
  createLorebookV3Document,
  type LorebookV3,
  type LorebookV3Document,
} from "@/features/lorebooks/schema";
import {
  createImportedLorebookArtifact,
  type GeneratedLorebookArtifact,
} from "@/features/generation/workflows";
import { useLorebookLibrary } from "@/hooks/useLorebookLibrary";
import { humanizeOptionLabel } from "@/lib/ui/humanizeOptionLabel";
import {
  compileCharacterCreationFormToCardDataPatch,
  createEmptyCharacterCreationForm,
  parseCharacterCreationForm,
} from "@/lib/character-card/characterCreationFormCompiler";
import {
  applySeedPickerEntryToCharacterCreationForm,
  readCharacterCreationFormTextPath,
  updateCharacterCreationFormPath,
  type CharacterCreationFormPath,
} from "@/lib/character-card/characterCreationSeedTemplates";
import {
  buildCharacterCard,
  BuildCharacterCardResult,
  CreatorsNotesContentRating,
} from "@/lib/character-card/buildCharacterCard";
import {
  AlternateGreetingForkType,
  ArchetypeCoreMotivation,
  ArchetypeDefenseMechanism,
  ArchetypePersonaType,
  EthnicityRegion,
  FetishAnatomicalFocus,
  FetishMaterialPreference,
  FetishSituationalTrigger,
  FetishSizeFantasyModifier,
  FirstMessageEntryPoint,
  FirstMessageLiteraryStyle,
  FirstMessageUserCallToAction,
  FormattingActionWrappingStandard,
  FormattingMarkdownEmphasisStyle,
  FormattingNarrativePerspective,
  GeneratedFormattingConfigurationData,
  GeneratedArchetypeConfigurationData,
  FrameworkInjectionPipelineRouter,
  FrameworkMemoryBudgetStrategy,
  FrameworkTargetSpecification,
  GeneratedFrameworkConfigurationData,
  GroupGreetingFormattingStyle,
  GroupGreetingInterpersonalDynamic,
  GroupGreetingSpotlightDistribution,
  GroupAlternateGreetingForkCategory,
  IntimacyAftercareStyle,
  IntimacyExpressionType,
  IntimacyPhysicalLoveLanguage,
  IntimacyVerbalCadence,
  KinkIntensityLevel,
  KinkPrimaryRole,
  LoreEntryDomainScope,
  LoreEntryInsertionPriority,
  LinguisticMatrix,
  GeneratedLoreEntryData,
  GeneratedLorebookSummaryData,
  GeneratedToneConfigurationData,
  GeneratedWorldLorePlaceholderData,
  NationalityLegalStatus,
  NationalityRegionalAlliance,
  NPCConnectionType,
  NPCEmotionalStatus,
  NPCRomanceFunction,
  OccupationAuthorityDynamic,
  OccupationProfessionalDomain,
  OccupationSocioeconomicTier,
  RaceMacroGroup,
  RelationshipCurrentLabel,
  RelationshipEmotionalAvailability,
  RelationshipScandalFactor,
  ScenarioPlotHook,
  ScenarioOpeningPairClassificationType,
  ScenarioSettingType,
  ScenarioStartingTension,
  SpeciesType,
  StudentAcademicYear,
  StudentFundingType,
  StudentMajorField,
  TonePacingVelocity,
  ToneProseTexture,
  ToneWorldviewFilter,
  TurnOffDynamicHardline,
} from "@/lib/character-card/generator";
import { AppMacroExtensions } from "@/types/character-card/AppMacroExtensions";
import {
  CharacterCreationForm,
  HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY,
} from "@/types/character-card/CharacterCreationForm";
import { ValidatedCharacterCardV3 } from "@/types/character-card/CharacterCardV3Schema";

interface StructuredCardEditorProps {
  activeCard: ValidatedCharacterCardV3;
  setActiveCard: Dispatch<SetStateAction<ValidatedCharacterCardV3 | null>>;
}

type EditorTab = "identity" | "behavior" | "greetings";
type CharacterCreationFormTextField = {
  kind?: "input" | "textarea";
  label: string;
  path: CharacterCreationFormPath;
};
type ProsePixieFieldKey =
  | "personality"
  | "description"
  | "creator_notes"
  | "scenario"
  | "mes_example"
  | "system_prompt"
  | "post_history_instructions"
  | "first_mes";
type ProsePixieEditorTarget = ProsePixieTarget & {
  fieldKey: ProsePixieFieldKey;
};
interface NameGenerationExtension {
  firstname: string;
  surname: string;
  title: string;
  alias: string;
  heritage: string;
  era: string;
  aura: string;
  composition: string;
}
interface AlternateGreetingGenerationExtension {
  aiGenerationDirective: string;
  associatedTrope: string;
  completedGreeting: string;
  forkType: AlternateGreetingForkType;
  greetingId: string;
}
interface AgeGenerationExtension {
  age: string;
  apparent_age: string;
  birth_year: string;
  birth_month: string;
  birth_day: string;
  zodiac: string;
  developmental_stage: string;
  legal_status: string;
  power_dynamic: string;
  temporal_anchor: string;
  zodiac_alignment: string;
  seasonal_vibe: string;
  birthdate_preset: string;
}
interface KinkGenerationExtension {
  intensityLevel: KinkIntensityLevel;
  nsfwEnabled: boolean;
  preferredSensoryTags: string[];
  primaryRole: KinkPrimaryRole;
  systemPromptInstruction: string;
}
interface FetishGenerationExtension {
  aiDescriptiveFocus: string;
  anatomicalFocus: FetishAnatomicalFocus;
  fetishEnabled: boolean;
  materialPreference: FetishMaterialPreference;
  situationalTrigger: FetishSituationalTrigger;
  sizeFantasyModifier: FetishSizeFantasyModifier;
}
interface FirstMessageGenerationExtension {
  aiOutputConstraint: string;
  entryPoint: FirstMessageEntryPoint;
  literaryStyle: FirstMessageLiteraryStyle;
  tokenLengthCap: number;
  userCallToAction: FirstMessageUserCallToAction;
}
type FormattingConfigurationExtension = GeneratedFormattingConfigurationData;
type FrameworkConfigurationExtension = GeneratedFrameworkConfigurationData;
type ToneConfigurationExtension = GeneratedToneConfigurationData;
type ArchetypeConfigurationExtension = GeneratedArchetypeConfigurationData;
interface GroupGreetingGenerationExtension {
  aiGroupDirective: string;
  completedGreeting: string;
  formattingStyle: GroupGreetingFormattingStyle;
  greetingId: string;
  interpersonalDynamic: GroupGreetingInterpersonalDynamic;
  participatingCharacters: string[];
  spotlightDistribution: GroupGreetingSpotlightDistribution;
}
interface GroupAlternateGreetingGenerationExtension {
  aiMultiCharacterPrompt: string;
  altGreetingId: string;
  completedGreeting: string;
  forkCategory: GroupAlternateGreetingForkCategory;
  includedNpcNames: string[];
  targetSettingVibe: string;
}
interface IntimacyStyleGenerationExtension {
  aftercareStyle: IntimacyAftercareStyle;
  aiBehaviorPrompt: string;
  expressionType: IntimacyExpressionType;
  physicalLoveLanguage: IntimacyPhysicalLoveLanguage;
  verbalCadence: IntimacyVerbalCadence;
}
interface TurnOffGenerationExtension {
  aiReactionPrompt: string;
  behavioralTurnOffs: string[];
  dynamicHardlines: TurnOffDynamicHardline;
  sensoryTurnOffs: string[];
}
interface ScenarioGenerationExtension {
  plotHook: ScenarioPlotHook;
  scenePremiseDescription: string;
  sensoryDetails: string[];
  settingType: ScenarioSettingType;
  startingTension: ScenarioStartingTension;
}
interface ScenarioOpeningPairGenerationExtension {
  alternateFirstMessage: string;
  alternateScenarioContext: ScenarioGenerationExtension;
  classificationType: ScenarioOpeningPairClassificationType;
  pairId: string;
  pairTitle: string;
}
type LorebookSummaryGenerationExtension = GeneratedLorebookSummaryData;
type LoreEntryGenerationExtension = GeneratedLoreEntryData;
interface CreatorsNotesGenerationExtension {
  contentRating: CreatorsNotesContentRating;
  idealUserPersona: string;
  recommendedModels: string[];
  technicalNotesText: string;
  triggerWarnings: string[];
}
interface PostHistoryInstructionsGenerationExtension {
  driftControlRules: string[];
  dynamicToneModifiers: string[];
  formattingHardlines: string[];
  injectionTokenWeight: number;
}
type WorldLorePlaceholderGenerationExtension = GeneratedWorldLorePlaceholderData;
interface SpeciesGenerationExtension {
  type: SpeciesType;
  isImmortal: boolean;
  instinctualTrait: string;
  apparentAge: string;
  dietaryNeed: string;
  lifespanAnchor: string;
  biologyTag: string;
}
interface EthnicityGenerationExtension {
  region: EthnicityRegion;
  culturalHeritage: string;
  nativeLanguage: string;
  hasDiasporicBaggage: boolean;
  societalContext: string;
  linguisticMatrix: LinguisticMatrix;
}
interface NationalityGenerationExtension {
  passportCountry: string;
  regionalAlliance: NationalityRegionalAlliance;
  legalStatus: NationalityLegalStatus;
  linguisticVibe: string;
}
interface OccupationGenerationExtension {
  jobTitle: string;
  socioeconomicTier: OccupationSocioeconomicTier;
  professionalDomain: OccupationProfessionalDomain;
  authorityDynamic: OccupationAuthorityDynamic;
  workplaceVibe: string;
  academicYear: StudentAcademicYear;
  majorField: StudentMajorField;
  fundingType: StudentFundingType;
  campusAffiliation: string;
}
interface RaceGenerationExtension {
  macroGroup: RaceMacroGroup;
  physicalDescriptors: string[];
  isCulturallySalient: boolean;
  syncMode: string;
  narrativeStyle: string;
}
interface RelationshipGenerationExtension {
  connectionType: NPCConnectionType;
  emotionalStatus: NPCEmotionalStatus;
  npcName: string;
  oneLineDescription: string;
  romanceFunction: NPCRomanceFunction;
}
interface RelationshipStatusGenerationExtension {
  currentLabel: RelationshipCurrentLabel;
  emotionalAvailability: RelationshipEmotionalAvailability;
  scandalFactor: RelationshipScandalFactor;
  statusContext: string;
}

const EDITOR_TABS: EditorTab[] = ["identity", "behavior", "greetings"];
const AMOURAI_EXTENSION_NAMESPACE = "amourai";
const DEFAULT_MACRO_EXTENSION: AppMacroExtensions = {
  framework: "Sandbox",
  formatting: "JSON",
  relationship: "Symmetric",
  tones: [],
  micro_tropes: [],
};
const FRAMEWORKS = [
  "Sandbox",
  "Narrative RPG",
  "Text Adventure",
  "Scene-Locked",
] as const;
const FORMATTINGS = ["W++", "JSON", "Boostyle", "Natural Language"] as const;
const RELATIONSHIPS = [
  "Symmetric",
  "Asymmetric (Bot Dominant)",
  "Asymmetric (User Dominant)",
  "Antagonistic",
] as const;
const AVAILABLE_TONES = [
  "Slow-Burn",
  "Dark Romance",
  "Angsty",
  "Fluff",
  "Cozy Romance",
];
const AVAILABLE_TROPES = [
  "Enemies to Lovers",
  "Only One Bed",
  "Who Hurt You?",
  "Fake Dating",
  "Grumpy x Sunshine",
];
const CHARACTER_CREATION_FORM_FIELD_GROUPS: Array<{
  fields: CharacterCreationFormTextField[];
  label: string;
}> = [
  {
    label: "Character Identity",
    fields: [
      { label: "Character Name", path: ["identity", "characterName"] },
      {
        label: "Nicknames / Aliases",
        path: ["identity", "nicknamesAliases"],
      },
      { label: "Character Age", path: ["identity", "age"] },
      { label: "Character Birthdate", path: ["identity", "birthdate"] },
      { label: "Character Birthplace", path: ["identity", "birthplace"] },
      {
        label: "Nationality / Ethnicity",
        path: ["identity", "nationalityEthnicity"],
      },
      {
        label: "Languages Spoken",
        path: ["identity", "languagesSpoken"],
      },
      {
        label: "Gender / Gender Identity",
        path: ["identity", "genderIdentity"],
      },
      { label: "Pronouns", path: ["identity", "pronouns"] },
      { label: "Occupation", path: ["identity", "occupation"] },
      {
        label: "Species / Heritage",
        path: ["identity", "speciesHeritage"],
      },
    ],
  },
  {
    label: "Appearance",
    fields: [
      { label: "Height", path: ["appearance", "height"] },
      { label: "Build", path: ["appearance", "build"] },
      {
        label: "Eyes",
        path: ["appearance", "eyeColourShape"],
      },
      {
        label: "Hair",
        path: ["appearance", "hairColourLengthTextureStyle"],
        kind: "textarea",
      },
      {
        label: "Skin",
        path: ["appearance", "skinColourUndertoneTexture"],
        kind: "textarea",
      },
      {
        label: "Facial Features",
        path: ["appearance", "facialFeatures"],
        kind: "textarea",
      },
      { label: "Piercings", path: ["appearance", "piercings"] },
      { label: "Tattoos", path: ["appearance", "tattoos"] },
      {
        label: "Blemishes / Scars",
        path: ["appearance", "blemishesScars"],
        kind: "textarea",
      },
      {
        label: "Freckles / Moles / Beauty Marks",
        path: ["appearance", "frecklesMolesBeautyMarks"],
        kind: "textarea",
      },
      { label: "Outfit", path: ["appearance", "outfit"], kind: "textarea" },
    ],
  },
  {
    label: "Personality",
    fields: [
      { label: "Archetype", path: ["personality", "archetype"] },
      {
        label: "Positive Traits",
        path: ["personality", "positiveTraits"],
        kind: "textarea",
      },
      { label: "Flaws", path: ["personality", "flaws"], kind: "textarea" },
      { label: "Humor", path: ["personality", "humor"] },
      { label: "Intelligence", path: ["personality", "intelligence"] },
      {
        label: "Social Behaviour",
        path: ["personality", "socialBehaviour"],
        kind: "textarea",
      },
    ],
  },
  {
    label: "Cognitive Drivers",
    fields: [
      {
        label: "Motivation",
        path: ["cognitiveDrivers", "motivation"],
        kind: "textarea",
      },
      { label: "Fear", path: ["cognitiveDrivers", "fear"], kind: "textarea" },
      {
        label: "Defenses",
        path: ["cognitiveDrivers", "defenses"],
        kind: "textarea",
      },
    ],
  },
  {
    label: "Psychology",
    fields: [
      { label: "Temperament", path: ["psychology", "temperament"] },
      {
        label: "Cognitive Distortions",
        path: ["psychology", "cognitiveDistortions"],
        kind: "textarea",
      },
      {
        label: "Decision Engine",
        path: ["psychology", "decisionEngine"],
        kind: "textarea",
      },
      { label: "Baseline Affect", path: ["psychology", "baselineAffect"] },
      {
        label: "Frustration Threshold",
        path: ["psychology", "frustrationThreshold"],
      },
      {
        label: "Core Wound",
        path: ["psychology", "coreWound"],
        kind: "textarea",
      },
      {
        label: "Internalized Lie",
        path: ["psychology", "internalizedLie"],
        kind: "textarea",
      },
      {
        label: "Triggers",
        path: ["psychology", "triggers"],
        kind: "textarea",
      },
      {
        label: "Beliefs",
        path: ["psychology", "beliefs"],
        kind: "textarea",
      },
      {
        label: "Moral Flexibility",
        path: ["psychology", "moralFlexibility"],
      },
      { label: "Attachment Style", path: ["psychology", "attachmentStyle"] },
      { label: "Conflict Style", path: ["psychology", "conflictStyle"] },
      { label: "Stress Response", path: ["psychology", "stressResponse"] },
      { label: "Love Languages", path: ["psychology", "loveLanguages"] },
      { label: "Big Five: Openness", path: ["psychology", "bigFive", "openness"] },
      {
        label: "Big Five: Conscientiousness",
        path: ["psychology", "bigFive", "conscientiousness"],
      },
      {
        label: "Big Five: Extraversion",
        path: ["psychology", "bigFive", "extraversion"],
      },
      {
        label: "Big Five: Agreeableness",
        path: ["psychology", "bigFive", "agreeableness"],
      },
      {
        label: "Big Five: Emotional Stability",
        path: ["psychology", "bigFive", "emotionalStability"],
      },
    ],
  },
  {
    label: "Behaviour",
    fields: [
      {
        label: "Facial Expressions",
        path: ["behaviour", "facialExpressions"],
        kind: "textarea",
      },
      {
        label: "Body Language & Posture",
        path: ["behaviour", "bodyLanguagePosture"],
        kind: "textarea",
      },
      {
        label: "Mannerisms",
        path: ["behaviour", "mannerisms"],
        kind: "textarea",
      },
      {
        label: "Goal-Oriented Actions",
        path: ["behaviour", "goalOrientedActions"],
        kind: "textarea",
      },
      {
        label: "Morality in Action",
        path: ["behaviour", "moralityInAction"],
        kind: "textarea",
      },
      {
        label: "Habits & Routines",
        path: ["behaviour", "habitsRoutines"],
        kind: "textarea",
      },
    ],
  },
  {
    label: "Lifestyle",
    fields: [
      { label: "Residence", path: ["lifestyle", "residence"] },
      { label: "Living Style", path: ["lifestyle", "livingStyle"] },
      { label: "Routines", path: ["lifestyle", "routines"], kind: "textarea" },
      { label: "Wealth", path: ["lifestyle", "wealth"] },
      {
        label: "Work / Life Balance",
        path: ["lifestyle", "workLifeBalance"],
      },
      { label: "Hobbies", path: ["lifestyle", "hobbies"], kind: "textarea" },
    ],
  },
  {
    label: "Relationships",
    fields: [
      {
        label: "Faction or Group",
        path: ["relationships", "affiliationCore", "factionOrGroup"],
      },
      {
        label: "Hierarchical Rank",
        path: ["relationships", "affiliationCore", "hierarchicalRank"],
      },
      {
        label: "Public Status",
        path: ["relationships", "affiliationCore", "publicStatus"],
        kind: "textarea",
      },
      {
        label: "Attachment Type",
        path: ["relationships", "emotionalBonds", "attachmentType"],
      },
      {
        label: "Trust Metric",
        path: ["relationships", "emotionalBonds", "trustMetric"],
      },
      {
        label: "Shared History Anchor",
        path: ["relationships", "emotionalBonds", "sharedHistoryAnchor"],
        kind: "textarea",
      },
      {
        label: "Ideological Clash",
        path: ["relationships", "behavioralFriction", "ideologicalClash"],
        kind: "textarea",
      },
      {
        label: "Boundaries",
        path: ["relationships", "behavioralFriction", "boundaries"],
        kind: "textarea",
      },
      {
        label: "Micro-Aggressions or Tells",
        path: [
          "relationships",
          "behavioralFriction",
          "microAggressionsOrTells",
        ],
        kind: "textarea",
      },
    ],
  },
  {
    label: "Speech & Communication",
    fields: [
      {
        label: "Tone & Vocabulary",
        path: ["speechCommunication", "toneVocabulary"],
        kind: "textarea",
      },
      {
        label: "Subtext",
        path: ["speechCommunication", "subtext"],
        kind: "textarea",
      },
      {
        label: "Conversational Habits",
        path: ["speechCommunication", "conversationalHabits"],
        kind: "textarea",
      },
    ],
  },
  {
    label: "Internal Thoughts & Reactions",
    fields: [
      {
        label: "Psychological Responses",
        path: ["internalThoughts", "psychologicalResponses"],
        kind: "textarea",
      },
      {
        label: "Motivations & Fears",
        path: ["internalThoughts", "motivationsFears"],
        kind: "textarea",
      },
      {
        label: "Internal Monologues",
        path: ["internalThoughts", "internalMonologues"],
        kind: "textarea",
      },
    ],
  },
];
const CHARACTER_CREATION_ADULT_ANATOMY_FIELDS: CharacterCreationFormTextField[] =
  [
    {
      label: "Penis Descriptors",
      path: ["adultAnatomy", "penisDescriptors"],
      kind: "textarea",
    },
    {
      label: "Testicle / Scrotum Descriptors",
      path: ["adultAnatomy", "testicleScrotumDescriptors"],
      kind: "textarea",
    },
    {
      label: "Nipple Descriptors",
      path: ["adultAnatomy", "nippleDescriptors"],
      kind: "textarea",
    },
    {
      label: "Breast Descriptors",
      path: ["adultAnatomy", "breastDescriptors"],
      kind: "textarea",
    },
    {
      label: "Vagina Descriptors",
      path: ["adultAnatomy", "vaginaDescriptors"],
      kind: "textarea",
    },
    {
      label: "Anus Descriptors",
      path: ["adultAnatomy", "anusDescriptors"],
      kind: "textarea",
    },
  ];
const DEFAULT_NAME_GENERATION: NameGenerationExtension = {
  firstname: "",
  surname: "",
  title: "",
  alias: "",
  heritage: "Anglo-Saxon",
  era: "Contemporary Classic",
  aura: "Soft / Wholesome",
  composition: "First Name",
};
const HERITAGE_TAGS = [
  "Anglo-Saxon",
  "Gaelic & Celtic",
  "Romance Languages",
  "Germanic & Nordic",
  "Slavic",
];
const ERA_TAGS = [
  "Regency & Victorian",
  "Medieval & Ancient",
  "Contemporary Classic",
  "Trendy / Neoteric",
];
const AURA_TAGS = [
  "Elite / Noble",
  "Gritty / Edgy",
  "Soft / Wholesome",
  "Ethereal / Gothic",
];
const COMPOSITION_TAGS = [
  "First Name",
  "Double / Hyphenated",
  "Aristocratic Particle",
  "Surname Style",
];
const ALTERNATE_GREETING_FORK_TYPES: AlternateGreetingForkType[] = [
  "Timeline_Shift",
  "Universe_AU",
  "Tone_Escalation",
  "Canon_Divergence",
];
const DEFAULT_ALTERNATE_GREETING_GENERATION: AlternateGreetingGenerationExtension[] =
  [
    {
      aiGenerationDirective:
        "Generate a prequel origin greeting where {{char}} and {{user}} meet before the main timeline, preserving core identity and boundaries.",
      associatedTrope: "Prequel / Origin Story",
      completedGreeting: "",
      forkType: "Timeline_Shift",
      greetingId: "11111111-0000-4000-8000-000000000000",
    },
    {
      aiGenerationDirective:
        "Generate an established romance greeting where {{char}} and {{user}} are already together, focusing on domestic intimacy without speaking for {{user}}.",
      associatedTrope: "Established Romance / Sequel",
      completedGreeting: "",
      forkType: "Timeline_Shift",
      greetingId: "22222222-0000-4000-8000-000000000000",
    },
    {
      aiGenerationDirective:
        "Generate a high-friction alternate greeting that opens mid-argument and ends with a clear reply opportunity for {{user}}.",
      associatedTrope: "High-Friction / Aggressive Clash",
      completedGreeting: "",
      forkType: "Tone_Escalation",
      greetingId: "33333333-0000-4000-8000-000000000000",
    },
  ];
const DEFAULT_AGE_GENERATION: AgeGenerationExtension = {
  age: "",
  apparent_age: "",
  birth_year: "",
  birth_month: "",
  birth_day: "",
  zodiac: "",
  developmental_stage: "Prime Adult",
  legal_status: "Full Independence",
  power_dynamic: "Peers / Equals",
  temporal_anchor: "Contemporary Baseline",
  zodiac_alignment: "Earth Signs",
  seasonal_vibe: "Spring Child",
  birthdate_preset: "None",
};
const DEVELOPMENTAL_STAGE_TAGS = [
  "Young Adult",
  "Prime Adult",
  "Middle Mature",
  "Elder",
  "Immortal / Ageless",
];
const LEGAL_STATUS_TAGS = [
  "Legal Majority",
  "Full Independence",
  "Historical Adulthood",
];
const AGE_POWER_DYNAMIC_TAGS = [
  "Peers / Equals",
  "Age Gap (Junior)",
  "Age Gap (Senior)",
  "Time-Defying",
];
const TEMPORAL_ANCHOR_TAGS = [
  "Contemporary Baseline",
  "Historical Regency Anchor",
  "Historical Medieval Anchor",
  "Futuristic / Sci-Fi Anchor",
];
const ZODIAC_ALIGNMENT_TAGS = [
  "Fire Signs",
  "Earth Signs",
  "Air Signs",
  "Water Signs",
];
const SEASONAL_VIBE_TAGS = [
  "Spring Child",
  "Summer Child",
  "Autumn Child",
  "Winter Child",
];
const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];
const BIRTHDATE_PRESETS = [
  "None",
  "Dark/Possessive Anti-Hero",
  "Sunshine / Innocent Partner",
  "Cruel Prince / Aloof Aristocrat",
  "Free-Spirited Rogue / Rebel",
  "Traumatized/Protected Soul",
];
const DEFAULT_KINK_GENERATION: KinkGenerationExtension = {
  intensityLevel: "Mild_Vanilla",
  nsfwEnabled: false,
  preferredSensoryTags: [],
  primaryRole: "Switch",
  systemPromptInstruction:
    "Keep intimacy optional, consent-forward, and emotionally responsive unless adult content is switched on.",
};
const KINK_PRIMARY_ROLES: KinkPrimaryRole[] = [
  "Dominant",
  "Submissive",
  "Switch",
  "Primal",
];
const KINK_INTENSITY_LEVELS: KinkIntensityLevel[] = [
  "Mild_Vanilla",
  "Moderate_Sensory",
  "Intense_Heavy",
];
const KINK_SENSORY_TAGS = [
  "Control",
  "Marking",
  "Praise",
  "Possessiveness",
  "Restraints",
  "Sensory Focus",
  "Risk",
  "Worship",
];
const DEFAULT_FETISH_GENERATION: FetishGenerationExtension = {
  aiDescriptiveFocus:
    "No fetish focus is active. Keep sensory descriptions broad and character-driven.",
  anatomicalFocus: "None",
  fetishEnabled: false,
  materialPreference: "None",
  situationalTrigger: "None",
  sizeFantasyModifier: "Standard_Scale",
};
const FETISH_ANATOMICAL_FOCUSES: FetishAnatomicalFocus[] = [
  "None",
  "Feet_Footwear",
  "Thighs_Midriff",
  "Hair_Face",
  "Muscular_Texture",
];
const FETISH_MATERIAL_PREFERENCES: FetishMaterialPreference[] = [
  "None",
  "Leather_Latex",
  "Uniforms_Suits",
  "Lace_Silk",
  "Eyewear_Chokers",
];
const FETISH_SITUATIONAL_TRIGGERS: FetishSituationalTrigger[] = [
  "None",
  "Breeding_Claiming",
  "Exhibitionism_Risk",
  "Vulnerability_Sleep",
  "Sanguine_Biting",
];
const FETISH_SIZE_MODIFIERS: FetishSizeFantasyModifier[] = [
  "Standard_Scale",
  "Extreme_Height_Gap",
  "Micro_Macro_Scale",
];
const DEFAULT_FIRST_MESSAGE_GENERATION: FirstMessageGenerationExtension = {
  aiOutputConstraint: [
    "Open with active collision pacing.",
    "Render in action dialogue hybrid format.",
    "Target 300-450 tokens.",
    "End with direct question that clearly hands action back to {{user}}.",
    "Write only the character's first message.",
    "You are strictly forbidden from writing or completing actions for {{user}}. Your output must terminate immediately after {{char}}'s closing action or line of dialogue.",
  ].join("\n"),
  entryPoint: "Active_Collision",
  literaryStyle: "Action_Dialogue_Hybrid",
  tokenLengthCap: 450,
  userCallToAction: "Direct_Question",
};
const FIRST_MESSAGE_ENTRY_POINTS: FirstMessageEntryPoint[] = [
  "The_Approach",
  "Active_Collision",
  "Post_Crisis_Quiet",
  "Mid_Action_Dialogue",
];
const FIRST_MESSAGE_LITERARY_STYLES: FirstMessageLiteraryStyle[] = [
  "Action_Dialogue_Hybrid",
  "Internal_Monologue_Heavy",
  "Novella_Prose",
  "Chat_Symphonic",
];
const FIRST_MESSAGE_USER_CALLS_TO_ACTION: FirstMessageUserCallToAction[] = [
  "Direct_Question",
  "Physical_Gesture",
  "Weighted_StandOff",
  "Vulnerable_Slip",
];
const GROUP_GREETING_SPOTLIGHT_DISTRIBUTIONS: GroupGreetingSpotlightDistribution[] =
  ["Ensemble_Equal", "Leader_Alpha", "Duo_Synergy", "User_Ambush"];
const GROUP_GREETING_INTERPERSONAL_DYNAMICS: GroupGreetingInterpersonalDynamic[] =
  [
    "Love_Triangle_Rivalry",
    "Wingman_Loop",
    "Hostile_Front",
    "Internal_Fracture",
  ];
const GROUP_GREETING_FORMATTING_STYLES: GroupGreetingFormattingStyle[] = [
  "Explicit_Name_Tags",
  "Paragraph_Isolated",
  "Choreographed",
];
const DEFAULT_GROUP_GREETING_GENERATION: GroupGreetingGenerationExtension[] = [
  {
    aiGroupDirective:
      "Generate a group opening where {{char}} speaks first while the secondary character silently pressures the room when {{user}} enters.",
    completedGreeting: "",
    formattingStyle: "Explicit_Name_Tags",
    greetingId: "44444444-1111-4000-8000-000000000000",
    interpersonalDynamic: "Wingman_Loop",
    participatingCharacters: ["{{char}}", "Julian Thorne"],
    spotlightDistribution: "Leader_Alpha",
  },
  {
    aiGroupDirective:
      "Generate a group opening where two characters are mid-argument around a shared table before pivoting their attention to {{user}}.",
    completedGreeting: "",
    formattingStyle: "Choreographed",
    greetingId: "55555555-1111-4000-8000-000000000000",
    interpersonalDynamic: "Love_Triangle_Rivalry",
    participatingCharacters: ["{{char}}", "Alistair Sterling"],
    spotlightDistribution: "Duo_Synergy",
  },
];
const GROUP_ALTERNATE_GREETING_FORK_CATEGORIES: GroupAlternateGreetingForkCategory[] =
  ["Team_Loyalty_Shift", "Collective_AU", "Group_Escalation_Climax"];
const DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION: GroupAlternateGreetingGenerationExtension[] =
  [
    {
      aiMultiCharacterPrompt:
        "Generate a group alternate greeting where the whole cast is united in a high-pressure intervention as {{user}} enters the room.",
      altGreetingId: "66666666-2222-4000-8000-000000000000",
      completedGreeting: "",
      forkCategory: "Team_Loyalty_Shift",
      includedNpcNames: ["{{char}}", "Julian Thorne"],
      targetSettingVibe: "Mid-Crisis Boardroom",
    },
    {
      aiMultiCharacterPrompt:
        "Generate a collective AU where the group is re-skinned into a gritty syndicate safehouse with old roles transformed into underworld hierarchy.",
      altGreetingId: "77777777-2222-4000-8000-000000000000",
      completedGreeting: "",
      forkCategory: "Collective_AU",
      includedNpcNames: ["{{char}}", "Alistair Sterling"],
      targetSettingVibe: "Gritty Safehouse",
    },
  ];
const DEFAULT_INTIMACY_STYLE_GENERATION: IntimacyStyleGenerationExtension = {
  aftercareStyle: "The_Nurturer",
  aiBehaviorPrompt:
    "During private moments, keep {{char}} emotionally attentive, consent-aware, and responsive to {{user}}'s comfort cues.",
  expressionType: "Intense_Devoted",
  physicalLoveLanguage: "Touch_Holding",
  verbalCadence: "Praise_Validation",
};
const INTIMACY_EXPRESSION_TYPES: IntimacyExpressionType[] = [
  "Intense_Devoted",
  "Playful_Teasing",
  "Stoic_Restrained",
  "Vulnerable_Yielding",
];
const INTIMACY_AFTERCARE_STYLES: IntimacyAftercareStyle[] = [
  "The_Nurturer",
  "The_Seeker",
  "The_Processor",
  "The_Confessor",
];
const INTIMACY_VERBAL_CADENCES: IntimacyVerbalCadence[] = [
  "Praise_Validation",
  "High_Intensity_Dirty",
  "Silent_Connection",
  "Hesitant_Reassurance",
];
const INTIMACY_PHYSICAL_LOVE_LANGUAGES: IntimacyPhysicalLoveLanguage[] = [
  "Touch_Holding",
  "Acts_of_Service",
  "Verbal_Affirmation",
  "Protective_Proximity",
];
const DEFAULT_TURN_OFF_GENERATION: TurnOffGenerationExtension = {
  aiReactionPrompt:
    "If {{user}} becomes cruel, careless, or pushes past clear emotional pacing, {{char}} should pause the scene and re-establish boundaries.",
  behavioralTurnOffs: ["Cruelty", "Disinterest / Emotional Coldness"],
  dynamicHardlines: "No_Unprompted_Aggression",
  sensoryTurnOffs: ["Lack of hygiene", "Overly aggressive touch"],
};
const TURN_OFF_DYNAMIC_HARDLINES: TurnOffDynamicHardline[] = [
  "No_Role_Reversal",
  "No_Rushed_Pacing",
  "No_Unprompted_Aggression",
];
const DEFAULT_SCENARIO_GENERATION: ScenarioGenerationExtension = {
  plotHook: "The_Chance_Encounter",
  scenePremiseDescription:
    "{{char}} and {{user}} collide in a crowded public space at the exact wrong moment, turning an ordinary interruption into a charged first exchange.",
  sensoryDetails: [
    "Low golden lighting",
    "Crowded room noise",
    "Warm coffee and rain",
  ],
  settingType: "Public_HighExposure",
  startingTension: "Charged_Electric",
};
const FRAMEWORK_TARGET_SPECIFICATIONS: FrameworkTargetSpecification[] = [
  "V2_Card_Standard",
  "V3_Card_Layout",
  "Raw_Agnostic_JSON",
  "Vercel_Structured_Zod",
];
const FRAMEWORK_MEMORY_BUDGET_STRATEGIES: FrameworkMemoryBudgetStrategy[] = [
  "Ultra_Lean_Context",
  "Extended_Deep_Lore",
  "Dynamic_User_Sliders",
];
const FRAMEWORK_INJECTION_PIPELINE_ROUTERS: FrameworkInjectionPipelineRouter[] =
  [
    "Monolithic_System_Prompt",
    "Segmented_Placements",
    "Dynamic_Variable_Loop",
  ];
const FORMATTING_ACTION_WRAPPING_STANDARDS: FormattingActionWrappingStandard[] =
  [
    "Quote_Isolated_Prose",
    "Bracket_Monologue",
    "Raw_Script",
  ];
const FORMATTING_MARKDOWN_EMPHASIS_STYLES: FormattingMarkdownEmphasisStyle[] = [
  "Clean_Prose",
  "Weighted_Bold_Impact",
  "Code_Block_Shielding",
];
const FORMATTING_NARRATIVE_PERSPECTIVES: FormattingNarrativePerspective[] = [
  "Third_Person_Past",
  "Third_Person_Present",
  "Second_Person_Direct",
  "First_Person_I",
];
const TONE_PROSE_TEXTURES: ToneProseTexture[] = [
  "Gritty_Melodramatic",
  "Lighthearted_Wholesome",
  "Angsty_Melancholic",
  "Formal_Poetic",
];
const TONE_PACING_VELOCITIES: TonePacingVelocity[] = [
  "Clipped_Rapid",
  "Measured_Deliberate",
  "Slow_Tease_Prose",
];
const TONE_WORLDVIEW_FILTERS: ToneWorldviewFilter[] = [
  "Ruthless_Cynical",
  "Optimistic_Idealistic",
  "Jaded_Weary",
];
const ARCHETYPE_PERSONA_TYPES: ArchetypePersonaType[] = [
  "The_Stoic_Wall",
  "The_Ruthless_Architect",
  "The_Broken_Heir",
  "The_Rogue_Instigator",
  "The_Vigilante_Outcast",
  "The_Golden_Retriever",
  "The_Quiet_Guardian",
  "The_Perfectionist",
  "The_Jaded_Veteran",
  "The_Ancient_Predator",
  "The_Fae_Deal_Maker",
];
const ARCHETYPE_DEFENSE_MECHANISMS: ArchetypeDefenseMechanism[] = [
  "Aggressive_Deflection",
  "Silent_Withdrawal",
  "Hyper_Independence",
  "Intellectualization",
  "Hyper_Charm_Deflection",
  "People_Pleasing_Inversion",
  "Vulnerability_Martyrdom",
  "Hyper_Rationalization",
  "Jaded_Resignation",
  "Temporal_Disconnection",
  "Defiant_Autonomy",
];
const ARCHETYPE_CORE_MOTIVATIONS: ArchetypeCoreMotivation[] = [
  "Security_Protection",
  "Security_Proximity",
  "Validation_Approval",
  "Autonomy_Freedom",
  "Peace_Quiet",
  "Vengeance_Claiming",
  "Vengeance_Redress",
];
const DEFAULT_FRAMEWORK_CONFIGURATION: FrameworkConfigurationExtension = {
  frameworkId: "11111111-6666-4000-8000-000000000000",
  globalTokenSafetyBuffer: 200,
  injectionPipelineRouter: "Segmented_Placements",
  memoryBudgetStrategy: "Extended_Deep_Lore",
  systemPromptJailbreakOverride:
    "Write only the requested card text. Keep {{char}} and {{user}} exactly as written. Never write actions, thoughts, or dialogue for {{user}}.",
  targetSpecification: "V3_Card_Layout",
};
const DEFAULT_FORMATTING_CONFIGURATION: FormattingConfigurationExtension = {
  actionWrappingStandard: "Quote_Isolated_Prose",
  formattingId: "11111111-7777-4000-8000-000000000000",
  formattingSystemPromptInjection:
    "Use standard prose. Put dialogue in double quotation marks. Weave actions, body language, reactions, narration, and brief internal thoughts into paragraphs. Start a new paragraph when a different character speaks. Do not use APP: or USER: labels. Never write for {{user}}.",
  markdownEmphasisStyle: "Clean_Prose",
  maxParagraphsPerTurn: 3,
  narrativePerspective: "Third_Person_Past",
};
const DEFAULT_TONE_CONFIGURATION: ToneConfigurationExtension = {
  aiVocabularyDirectives: ["soft", "warmth", "glance", "quiet", "tension"],
  pacingVelocity: "Measured_Deliberate",
  proseTexture: "Angsty_Melancholic",
  toneId: "11111111-8888-4000-8000-000000000000",
  toneSystemPromptInjection:
    "Keep the prose emotionally grounded, quietly romantic, and consistent with the active trope.",
  worldviewFilter: "Jaded_Weary",
};
const DEFAULT_ARCHETYPE_CONFIGURATION: ArchetypeConfigurationExtension = {
  aiBehaviorPrompt:
    "{{char}} is guarded, emotionally consistent, and slow to reveal vulnerability. Let their defenses soften only when {{user}} earns a clear shift on-page.",
  archetypeId: "11111111-9999-4000-8000-000000000000",
  coreMotivation: "Autonomy_Freedom",
  defenseMechanism: "Silent_Withdrawal",
  personaType: "The_Stoic_Wall",
};
const DEFAULT_LOREBOOK_SUMMARY_GENERATION: LorebookSummaryGenerationExtension = {
  aiLoreInstruction:
    "Maintain the contemporary romance lore baseline. Keep lore references compact and only surface rules that directly sharpen the current scene.",
  factionOrDynastyContext:
    "Local social pressure shapes {{char}}'s choices without replacing the active relationship dynamic.",
  tokenOptimizationCap: 150,
  universeAnchor: "Contemporary Romance Local Canon",
  worldSystemRules: [
    "Social reputation, private history, and everyday obligations constrain choices.",
    "NPCs should remember existing relationships and current emotional stakes.",
    "Lore should support the scene rather than becoming exposition.",
  ],
};
const CREATORS_NOTES_CONTENT_RATINGS: CreatorsNotesContentRating[] = [
  "SFW_Wholesome",
  "M_Rated_Sensory",
  "X_Rated_Explicit",
  "Dark_Romance_Heavy",
];
const DEFAULT_CREATORS_NOTES_GENERATION: CreatorsNotesGenerationExtension = {
  contentRating: "M_Rated_Sensory",
  idealUserPersona:
    "Best played as a responsive {{user}} with clear agency, grounded reactions, and respect for slow-burn pacing.",
  recommendedModels: ["YOUR_API_roleplay_model", "YOUR_API_balanced_model"],
  technicalNotesText:
    "Recommended context window: 8k+ tokens.\nUse third-person past tense with asterisks for actions.\nSuggested sampler baseline: Temperature 0.8-0.9, Min-P 0.05, light repetition penalty.",
  triggerWarnings: ["Slow-burn pacing", "Romantic tension"],
};
const DEFAULT_POST_HISTORY_INSTRUCTIONS_GENERATION: PostHistoryInstructionsGenerationExtension =
  {
    driftControlRules: [
      "Preserve {{char}}'s established personality, relationship status, and current emotional pace.",
      "Use lorebook summary only when it affects the active scene; do not dump unrelated background lore.",
    ],
    dynamicToneModifiers: [
      "If {{user}} triggers a hard limit, intensify boundaries immediately.",
      "If {{user}} offers genuine comfort or accountability, lower {{char}}'s defenses by one small visible beat only.",
    ],
    formattingHardlines: [
      "CRITICAL: Never write thoughts, actions, decisions, or dialogue for {{user}}.",
      "Do not conclude the scene, skip time, or resolve conflict unless {{user}} has explicitly moved there.",
      "Use Standard Prose Format with dialogue in double quotation marks, actions/body language/reactions woven into prose paragraphs, and a new paragraph whenever a different character speaks. Do not output APP: or USER: labels.",
    ],
    injectionTokenWeight: 50,
  };
const WORLD_LORE_PLACEHOLDER_MACRO_TYPES: WorldLorePlaceholderGenerationExtension["macroType"][] =
  ["Environmental_Anchor", "Population_Baseline", "Legacy_Tag"];
const DEFAULT_WORLD_LORE_PLACEHOLDER_GENERATION: WorldLorePlaceholderGenerationExtension[] =
  [
    {
      currentDataPayload: "Contemporary Romance Local Canon",
      isDynamic: false,
      macroType: "Environmental_Anchor",
      placeholderId: "11111111-4444-4000-8000-000000000000",
      variableKey: "{{world_setting}}",
    },
    {
      currentDataPayload:
        "Baseline mortal population with social pressure shaped by reputation and profession",
      isDynamic: true,
      macroType: "Population_Baseline",
      placeholderId: "22222222-4444-4000-8000-000000000000",
      variableKey: "{{species_status}}",
    },
    {
      currentDataPayload:
        "A private crisis from {{char}}'s past can surface only when the current scene triggers it",
      isDynamic: true,
      macroType: "Legacy_Tag",
      placeholderId: "33333333-4444-4000-8000-000000000000",
      variableKey: "{{lore_catalyst}}",
    },
  ];
const LORE_ENTRY_DOMAIN_SCOPES: LoreEntryDomainScope[] = [
  "Geopolitical_Faction",
  "Biographical_NPC",
  "Mythological_Rules",
  "Societal_Customs",
];
const LORE_ENTRY_INSERTION_PRIORITIES: LoreEntryInsertionPriority[] = [
  "Constant_Anchor",
  "Reactive_Contextual",
  "Recursive_Linked",
];
const DEFAULT_LORE_ENTRY_GENERATION: LoreEntryGenerationExtension[] = [
  {
    activationKeys: ["world setting", "faction", "law system"],
    domainScope: "Geopolitical_Faction",
    entryContent:
      "Core world context, faction pressure, and local law that must remain stable during chat.",
    entryId: "11111111-5555-4000-8000-000000000000",
    insertionPriority: "Constant_Anchor",
    title: "Core World Context",
    tokenReserveCost: 100,
  },
  {
    activationKeys: ["family", "barrier", "secret keeper"],
    domainScope: "Biographical_NPC",
    entryContent:
      "Supporting characters, relationship pressure, and emotional status that can appear when the scene calls for them.",
    entryId: "22222222-5555-4000-8000-000000000000",
    insertionPriority: "Reactive_Contextual",
    title: "Relationship Network",
    tokenReserveCost: 90,
  },
  {
    activationKeys: ["custom", "scandal", "reputation"],
    domainScope: "Societal_Customs",
    entryContent:
      "Social codes and public consequences that should activate only when the scene references them.",
    entryId: "33333333-5555-4000-8000-000000000000",
    insertionPriority: "Reactive_Contextual",
    title: "Societal Custom Rules",
    tokenReserveCost: 100,
  },
];
const SCENARIO_OPENING_PAIR_CLASSIFICATIONS: ScenarioOpeningPairClassificationType[] =
  ["Environmental_Anchor", "Timeline_Link", "Status_Valve"];
const DEFAULT_SCENARIO_OPENING_PAIR_GENERATION: ScenarioOpeningPairGenerationExtension[] =
  [
    {
      alternateFirstMessage:
        "*A blizzard pins {{char}} and {{user}} inside the cabin as the hearth becomes the only warm thing left between them.*",
      alternateScenarioContext: {
        plotHook: "The_Crisis",
        scenePremiseDescription:
          "An alternate scenario where {{char}} and {{user}} are stranded inside a remote mountain cabin during a blinding winter blizzard, forced to share the only heat source.",
        sensoryDetails: [
          "Crackling hearth fire",
          "Sound of howling wind outside",
          "Smell of cedar wood",
        ],
        settingType: "Contained_Insular",
        startingTension: "Vulnerable_Exhausted",
      },
      classificationType: "Environmental_Anchor",
      pairId: "88888888-3333-4000-8000-000000000000",
      pairTitle: "Blizzard Cabin Refuge",
    },
    {
      alternateFirstMessage:
        "*Five years earlier, {{char}} looks up from a rain-spattered campus table and sees {{user}} for the first time.*",
      alternateScenarioContext: {
        plotHook: "The_Chance_Encounter",
        scenePremiseDescription:
          "An alternate flashback scenario set five years earlier on a university campus, where {{char}} meets {{user}} before either of them knows what they will become to each other.",
        sensoryDetails: [
          "Rain on old campus stone",
          "Library dust",
          "Cheap coffee steam",
        ],
        settingType: "Corporate_Institutional",
        startingTension: "Charged_Electric",
      },
      classificationType: "Timeline_Link",
      pairId: "99999999-3333-4000-8000-000000000000",
      pairTitle: "College AU Flashback",
    },
  ];
const SCENARIO_SETTING_TYPES: ScenarioSettingType[] = [
  "Contained_Insular",
  "Corporate_Institutional",
  "Public_HighExposure",
  "Atmospheric_Wilderness",
];
const SCENARIO_PLOT_HOOKS: ScenarioPlotHook[] = [
  "The_Mandate",
  "The_Crisis",
  "The_Chance_Encounter",
  "The_Secret_Transaction",
];
const SCENARIO_STARTING_TENSIONS: ScenarioStartingTension[] = [
  "Combative_Friction",
  "Vulnerable_Exhausted",
  "Charged_Electric",
  "Formal_Chilling",
];
const DEFAULT_ETHNICITY_GENERATION: EthnicityGenerationExtension = {
  region: "Northern_Western_European",
  culturalHeritage: "British Isles / Scandinavian lineage",
  nativeLanguage: "English",
  hasDiasporicBaggage: false,
  societalContext: "Indigenous / Native Home Ground",
  linguisticMatrix: "Anglophone",
};
const ETHNICITY_REGIONS: EthnicityRegion[] = [
  "Northern_Western_European",
  "Southern_European",
  "Eastern_European_Slavic",
  "Diaspora_Blended",
];
const SOCIETAL_CONTEXTS = [
  "Indigenous / Native Home Ground",
  "First-Generation Immigrant",
  "Multigenerational Diaspora",
];
const LINGUISTIC_MATRICES: LinguisticMatrix[] = [
  "Anglophone",
  "Celtic / Gaelic",
  "Latinate / Romance",
  "Slavic / Cyrillic-Derived",
];
const DEFAULT_NATIONALITY_GENERATION: NationalityGenerationExtension = {
  passportCountry: "United Kingdom",
  regionalAlliance: "Non_EU_European",
  legalStatus: "Native",
  linguisticVibe:
    "Native dialect from United Kingdom with local slang and natural civic confidence.",
};
const NATIONALITY_REGIONAL_ALLIANCES: NationalityRegionalAlliance[] = [
  "EU_Schengen",
  "Non_EU_European",
  "Western_Allies",
  "Fictional_Empire",
];
const NATIONALITY_LEGAL_STATUSES: NationalityLegalStatus[] = [
  "Native",
  "Dual_Citizen",
  "Naturalized",
  "Expat_Visa",
];
const DEFAULT_OCCUPATION_GENERATION: OccupationGenerationExtension = {
  jobTitle: "Software Engineer",
  socioeconomicTier: "High_Professional",
  professionalDomain: "Corporate_Finance",
  authorityDynamic: "Equal",
  workplaceVibe:
    "Quiet glass office lined with monitors, whiteboards, and late-night coffee",
  academicYear: "Junior",
  majorField: "STEM_Medical",
  fundingType: "Scholarship",
  campusAffiliation: "Independent study cohort",
};
const OCCUPATION_SOCIOECONOMIC_TIERS: OccupationSocioeconomicTier[] = [
  "Ultra_Elite",
  "High_Professional",
  "Creative_Public",
  "Working_Class",
  "Shadow_Economy",
];
const OCCUPATION_PROFESSIONAL_DOMAINS: OccupationProfessionalDomain[] = [
  "Corporate_Finance",
  "Medical_Science",
  "Arts_Entertainment",
  "Security_Defense",
  "Underworld",
];
const OCCUPATION_AUTHORITY_DYNAMICS: OccupationAuthorityDynamic[] = [
  "Superior",
  "Equal",
  "Subordinate",
  "Outsider",
];
const STUDENT_ACADEMIC_YEARS: StudentAcademicYear[] = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Postgrad_PhD",
];
const STUDENT_MAJOR_FIELDS: StudentMajorField[] = [
  "STEM_Medical",
  "Humanities_Law",
  "Arts_Design",
  "Athletics",
];
const STUDENT_FUNDING_TYPES: StudentFundingType[] = [
  "Legacy_Trust",
  "Scholarship",
  "Self_Funded",
  "International",
];
const DEFAULT_RACE_GENERATION: RaceGenerationExtension = {
  macroGroup: "White_Caucasian",
  physicalDescriptors: [
    "fair to olive undertones",
    "sharp blue or hazel eyes",
    "ash-brown or silver-blonde hair",
  ],
  isCulturallySalient: false,
  syncMode: "Homogeneous Alignment",
  narrativeStyle: "Stylised / Aesthetic Focus",
};
const RACE_MACRO_GROUPS: RaceMacroGroup[] = [
  "White_Caucasian",
  "Black_African",
  "East_Southeast_Asian",
  "South_Central_Asian",
  "Indigenous_First_Nations",
  "Middle_Eastern_North_African",
  "Multiracial_Blended",
];
const RACE_SYNC_MODES = ["Homogeneous Alignment", "Diasporic Shift"];
const RACE_NARRATIVE_STYLES = [
  "Phenotypic Palette Focus",
  "Stylised / Aesthetic Focus",
];
const DEFAULT_RELATIONSHIP_GENERATION: RelationshipGenerationExtension[] = [
  {
    connectionType: "Found_Family",
    emotionalStatus: "Devoted_Loyal",
    npcName: "Mara Finch",
    oneLineDescription:
      "The loyal confidant who notices every shift in {{char}}'s mood and nudges them toward honesty before pride ruins the romance.",
    romanceFunction: "The_Matchmaker",
  },
];
const NPC_CONNECTION_TYPES: NPCConnectionType[] = [
  "Family_Lineage",
  "Found_Family",
  "Professional_Circle",
  "Antagonistic_Force",
];
const NPC_ROMANCE_FUNCTIONS: NPCRomanceFunction[] = [
  "The_Barrier",
  "The_Matchmaker",
  "The_Secret_Keeper",
  "The_Jealousy_Instigator",
];
const NPC_EMOTIONAL_STATUSES: NPCEmotionalStatus[] = [
  "Devoted_Loyal",
  "Strained_Fractured",
  "Estranged_Ghosted",
  "Dependent_Protected",
];
const DEFAULT_RELATIONSHIP_STATUS_GENERATION: RelationshipStatusGenerationExtension =
  {
    currentLabel: "Single",
    emotionalAvailability: "Fully_Open",
    scandalFactor: "None",
    statusContext:
      "Unattached and socially free to pursue a genuine connection if trust develops.",
  };
const RELATIONSHIP_CURRENT_LABELS: RelationshipCurrentLabel[] = [
  "Single",
  "Betrothed_Promised",
  "Divorced_Separated",
  "Widowed",
  "It_Complicated",
];
const RELATIONSHIP_EMOTIONAL_AVAILABILITIES: RelationshipEmotionalAvailability[] =
  ["Fully_Open", "Guarded_Closed", "Lingering_Past", "Casual_Only"];
const RELATIONSHIP_SCANDAL_FACTORS: RelationshipScandalFactor[] = [
  "None",
  "Low_Gossip",
  "High_Taboo",
  "Career_Threatening",
];
const DEFAULT_SPECIES_GENERATION: SpeciesGenerationExtension = {
  type: "Human",
  isImmortal: false,
  instinctualTrait: "Mortal / Baseline",
  apparentAge: "",
  dietaryNeed: "Standard food",
  lifespanAnchor: "Fixed Mortal",
  biologyTag: "Mortal / Baseline",
};
const SPECIES_TYPES: SpeciesType[] = [
  "Human",
  "Vampire",
  "Werewolf",
  "Fae",
  "Demon",
  "Angel",
  "Siren",
  "Wraith",
];
const BIOLOGY_TAGS = [
  "Mortal / Baseline",
  "Undead / Sanguine",
  "Therianthrope / Shifter",
  "Fae / Immortal Folk",
  "Celestial / Abyssal",
];
const LIFESPAN_ANCHORS = [
  "Fixed Mortal",
  "Extended / Juvenile Lifespan",
  "Static Agelessness",
];
const INSTINCTUAL_TRAITS = [
  "Mortal / Baseline",
  "Fated Mates / Soul Bonds",
  "The Hunger / Feed Dynamics",
  "Territorial / Possessive Instincts",
  "Glamour / Seduction Aura",
];

export default function StructuredCardEditor({
  activeCard,
  setActiveCard,
}: StructuredCardEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("identity");
  const [newAlternateGreeting, setNewAlternateGreeting] = useState("");
  const [newGroupGreeting, setNewGroupGreeting] = useState("");
  const [previewResult, setPreviewResult] =
    useState<BuildCharacterCardResult | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [lorebookImportError, setLorebookImportError] = useState<string | null>(
    null,
  );
  const [prosePixieTarget, setProsePixieTarget] =
    useState<ProsePixieEditorTarget | null>(null);
  const lorebookLibrary = useLorebookLibrary();
  const macroExtension = readMacroExtension(activeCard.data.extensions);
  const archetypeConfiguration =
    readArchetypeConfigurationExtension(activeCard);
  const alternateGreetingGeneration =
    readAlternateGreetingGenerationExtension(activeCard);
  const nameGeneration = readNameGenerationExtension(activeCard);
  const ageGeneration = readAgeGenerationExtension(activeCard);
  const fetishGeneration = readFetishGenerationExtension(activeCard);
  const firstMessageGeneration = readFirstMessageGenerationExtension(activeCard);
  const formattingConfiguration =
    readFormattingConfigurationExtension(activeCard);
  const frameworkConfiguration =
    readFrameworkConfigurationExtension(activeCard);
  const groupAlternateGreetingGeneration =
    readGroupAlternateGreetingGenerationExtension(activeCard);
  const groupGreetingGeneration =
    readGroupGreetingGenerationExtension(activeCard);
  const intimacyStyleGeneration =
    readIntimacyStyleGenerationExtension(activeCard);
  const kinkGeneration = readKinkGenerationExtension(activeCard);
  const ethnicityGeneration = readEthnicityGenerationExtension(activeCard);
  const nationalityGeneration = readNationalityGenerationExtension(activeCard);
  const occupationGeneration = readOccupationGenerationExtension(activeCard);
  const raceGeneration = readRaceGenerationExtension(activeCard);
  const relationshipGeneration = readRelationshipGenerationExtension(activeCard);
  const relationshipStatusGeneration =
    readRelationshipStatusGenerationExtension(activeCard);
  const speciesGeneration = readSpeciesGenerationExtension(activeCard);
  const scenarioGeneration = readScenarioGenerationExtension(activeCard);
  const scenarioOpeningPairGeneration =
    readScenarioOpeningPairGenerationExtension(activeCard);
  const embeddedLorebookDocument = readEmbeddedLorebookDocument(activeCard);
  const embeddedLorebookSourceId = readEmbeddedLorebookSourceId(activeCard);
  const lorebookSummaryGeneration = embeddedLorebookDocument
    ? createLorebookSummaryFromDocument(embeddedLorebookDocument)
    : createDetachedLorebookSummary();
  const loreEntryGeneration = embeddedLorebookDocument
    ? createLoreEntriesFromDocument(embeddedLorebookDocument)
    : [];
  const creatorsNotesGeneration =
    readCreatorsNotesGenerationExtension(activeCard);
  const postHistoryInstructionsGeneration =
    readPostHistoryInstructionsGenerationExtension(activeCard);
  const worldLorePlaceholderGeneration =
    readWorldLorePlaceholderGenerationExtension(activeCard);
  const toneConfiguration = readToneConfigurationExtension(activeCard);
  const turnOffGeneration = readTurnOffGenerationExtension(activeCard);
  const prosePixieAdultModeEnabled =
    kinkGeneration.nsfwEnabled ||
    fetishGeneration.fetishEnabled ||
    creatorsNotesGeneration.contentRating === "X_Rated_Explicit";
  const characterCreationForm = readCharacterCreationFormExtension(activeCard);

  function updateField<Key extends keyof ValidatedCharacterCardV3["data"]>(
    key: Key,
    value: ValidatedCharacterCardV3["data"][Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          [key]: value,
        },
      };
    });
  }

  function updateCharacterCreationForm(nextForm: CharacterCreationForm) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const patch = compileCharacterCreationFormToCardDataPatch(
        nextForm,
        currentCard.data,
      );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          name: patch.name ?? currentCard.data.name,
          description: patch.description ?? currentCard.data.description,
          personality: patch.personality ?? currentCard.data.personality,
          tags: patch.tags ?? currentCard.data.tags,
          extensions: patch.extensions ?? currentCard.data.extensions,
        },
      };
    });
  }

  function updateCharacterCreationText(
    path: CharacterCreationFormPath,
    value: string,
  ) {
    updateCharacterCreationForm(
      updateCharacterCreationFormPath(characterCreationForm, path, value),
    );
  }

  function updateCharacterCreationBoolean(
    path: CharacterCreationFormPath,
    value: boolean,
  ) {
    updateCharacterCreationForm(
      updateCharacterCreationFormPath(characterCreationForm, path, value),
    );
  }

  function applyCharacterCreationSeed(entry: SeedPickerEntry) {
    updateCharacterCreationForm(
      applySeedPickerEntryToCharacterCreationForm(characterCreationForm, entry),
    );
  }

  function addCharacterCreationTargetOverride() {
    updateCharacterCreationForm({
      ...characterCreationForm,
      relationships: {
        ...characterCreationForm.relationships,
        targetOverrides: [
          ...characterCreationForm.relationships.targetOverrides,
          { targetId: "", contextualPromptInjection: "" },
        ],
      },
    });
  }

  function removeCharacterCreationTargetOverride(index: number) {
    updateCharacterCreationForm({
      ...characterCreationForm,
      relationships: {
        ...characterCreationForm.relationships,
        targetOverrides:
          characterCreationForm.relationships.targetOverrides.filter(
            (_override, overrideIndex) => overrideIndex !== index,
          ),
      },
    });
  }

  function openProsePixieForField(
    fieldKey: ProsePixieFieldKey,
    fieldLabel: string,
  ) {
    const value = activeCard.data[fieldKey];

    setProsePixieTarget({
      characterName: activeCard.data.name,
      fieldKey,
      fieldLabel,
      value: typeof value === "string" ? value : "",
    });
  }

  function applyProsePixieDraft(value: string) {
    if (!prosePixieTarget) {
      return;
    }

    updateField(prosePixieTarget.fieldKey, value);
  }

  function handleAddAlternateGreeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const greeting = newAlternateGreeting.trim();
    if (!greeting) {
      return;
    }

    updateField("alternate_greetings", [
      ...activeCard.data.alternate_greetings,
      greeting,
    ]);
    setNewAlternateGreeting("");
  }

  function updateMacroExtension<Key extends keyof AppMacroExtensions>(
    key: Key,
    value: AppMacroExtensions[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentMacro = readMacroExtension(currentCard.data.extensions);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              macro: {
                ...currentMacro,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateNameGeneration<Key extends keyof NameGenerationExtension>(
    key: Key,
    value: NameGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentNameGeneration = readNameGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              name_generation: {
                ...currentNameGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateAgeGeneration<Key extends keyof AgeGenerationExtension>(
    key: Key,
    value: AgeGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentAgeGeneration = readAgeGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              age_generation: {
                ...currentAgeGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateAlternateGreetingGeneration(
    index: number,
    patch: Partial<AlternateGreetingGenerationExtension>,
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentAlternateGreetingGeneration =
        readAlternateGreetingGenerationExtension(currentCard);
      const nextAlternateGreetingGeneration =
        currentAlternateGreetingGeneration.map((alternateGreeting, itemIndex) =>
          itemIndex === index
            ? { ...alternateGreeting, ...patch }
            : alternateGreeting,
        );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              alternate_greeting_generation:
                nextAlternateGreetingGeneration.slice(0, 5),
            },
          },
        },
      };
    });
  }

  function updateKinkGeneration<Key extends keyof KinkGenerationExtension>(
    key: Key,
    value: KinkGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentKinkGeneration = readKinkGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              kink_generation: {
                ...currentKinkGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateFetishGeneration<Key extends keyof FetishGenerationExtension>(
    key: Key,
    value: FetishGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentFetishGeneration = readFetishGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              fetish_generation: {
                ...currentFetishGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateIntimacyStyleGeneration<
    Key extends keyof IntimacyStyleGenerationExtension,
  >(key: Key, value: IntimacyStyleGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentIntimacyStyleGeneration =
        readIntimacyStyleGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              intimacy_style_generation: {
                ...currentIntimacyStyleGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateFirstMessageGeneration<
    Key extends keyof FirstMessageGenerationExtension,
  >(key: Key, value: FirstMessageGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentFirstMessageGeneration =
        readFirstMessageGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              first_message_generation: {
                ...currentFirstMessageGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateGroupGreetingGeneration(
    index: number,
    patch: Partial<GroupGreetingGenerationExtension>,
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentGroupGreetingGeneration =
        readGroupGreetingGenerationExtension(currentCard);
      const nextGroupGreetingGeneration = currentGroupGreetingGeneration.map(
        (groupGreeting, itemIndex) =>
          itemIndex === index ? { ...groupGreeting, ...patch } : groupGreeting,
      );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              group_greeting_generation: nextGroupGreetingGeneration.slice(0, 5),
            },
          },
        },
      };
    });
  }

  function updateGroupAlternateGreetingGeneration(
    index: number,
    patch: Partial<GroupAlternateGreetingGenerationExtension>,
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentGroupAlternateGreetingGeneration =
        readGroupAlternateGreetingGenerationExtension(currentCard);
      const nextGroupAlternateGreetingGeneration =
        currentGroupAlternateGreetingGeneration.map(
          (groupAlternateGreeting, itemIndex) =>
            itemIndex === index
              ? { ...groupAlternateGreeting, ...patch }
              : groupAlternateGreeting,
        );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              group_alternate_greeting_generation:
                nextGroupAlternateGreetingGeneration.slice(0, 5),
            },
          },
        },
      };
    });
  }

  function updateTurnOffGeneration<Key extends keyof TurnOffGenerationExtension>(
    key: Key,
    value: TurnOffGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentTurnOffGeneration = readTurnOffGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              turn_off_generation: {
                ...currentTurnOffGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateScenarioGeneration<Key extends keyof ScenarioGenerationExtension>(
    key: Key,
    value: ScenarioGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentScenarioGeneration =
        readScenarioGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              scenario_generation: {
                ...currentScenarioGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateScenarioOpeningPairGeneration(
    index: number,
    patch: Partial<ScenarioOpeningPairGenerationExtension>,
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentScenarioOpeningPairGeneration =
        readScenarioOpeningPairGenerationExtension(currentCard);
      const nextScenarioOpeningPairGeneration =
        currentScenarioOpeningPairGeneration.map((pair, itemIndex) =>
          itemIndex === index ? { ...pair, ...patch } : pair,
        );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              scenario_opening_pair_generation:
                nextScenarioOpeningPairGeneration.slice(0, 5),
            },
          },
        },
      };
    });
  }

  function updateScenarioOpeningPairScenario(
    index: number,
    patch: Partial<ScenarioGenerationExtension>,
  ) {
    const currentPair = scenarioOpeningPairGeneration[index];
    if (!currentPair) {
      return;
    }

    updateScenarioOpeningPairGeneration(index, {
      alternateScenarioContext: {
        ...currentPair.alternateScenarioContext,
        ...patch,
      },
    });
  }

  function embedLorebookDocument(
    document: LorebookV3Document,
    source: { id?: string; label: string; sourceKind: "library" | "json" },
  ) {
    const summary = createLorebookSummaryFromDocument(document);
    const entries = createLoreEntriesFromDocument(document);

    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          character_book: document.data as LorebookV3,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              embedded_lorebook: {
                embeddedAt: Date.now(),
                sourceId: source.id,
                sourceKind: source.sourceKind,
                sourceLabel: source.label,
              },
              lore_entries: entries,
              lorebook_summary: summary,
            },
          },
        },
      };
    });
    setLorebookImportError(null);
  }

  function clearEmbeddedLorebook() {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          character_book: undefined,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              embedded_lorebook: null,
              lore_entries: [],
              lorebook_summary: createDetachedLorebookSummary(),
            },
          },
        },
      };
    });
    setLorebookImportError(null);
  }

  function handleSelectSavedLorebook(lorebookId: string) {
    const selectedLorebook = lorebookLibrary.items.find(
      (item) => item.id === lorebookId,
    );

    if (!selectedLorebook) {
      return;
    }

    const document =
      selectedLorebook.v3Document ??
      generatedLorebookArtifactToV3Document(selectedLorebook);

    embedLorebookDocument(document, {
      id: selectedLorebook.id,
      label: selectedLorebook.title,
      sourceKind: "library",
    });
  }

  async function handleImportLorebookJson(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    try {
      const document = importLorebookV3Json(await file.text(), file.name);
      const artifact = createImportedLorebookArtifact(document, file.name);

      embedLorebookDocument(document, {
        id: artifact.id,
        label: artifact.title,
        sourceKind: "json",
      });
    } catch (caughtError) {
      setLorebookImportError(
        caughtError instanceof Error
          ? caughtError.message
          : "Lorebook JSON import failed.",
      );
    }
  }

  function updateCreatorsNotesGeneration<
    Key extends keyof CreatorsNotesGenerationExtension,
  >(key: Key, value: CreatorsNotesGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentCreatorsNotes = readCreatorsNotesGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              creators_notes: {
                ...currentCreatorsNotes,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updatePostHistoryInstructionsGeneration<
    Key extends keyof PostHistoryInstructionsGenerationExtension,
  >(key: Key, value: PostHistoryInstructionsGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentInstructions =
        readPostHistoryInstructionsGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              post_history_instructions_generation: {
                ...currentInstructions,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateFrameworkConfiguration<Key extends keyof FrameworkConfigurationExtension>(
    key: Key,
    value: FrameworkConfigurationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentFramework = readFrameworkConfigurationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              framework: {
                ...currentFramework,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateFormattingConfiguration<
    Key extends keyof FormattingConfigurationExtension,
  >(key: Key, value: FormattingConfigurationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentFormatting = readFormattingConfigurationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              formatting: {
                ...currentFormatting,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateToneConfiguration<Key extends keyof ToneConfigurationExtension>(
    key: Key,
    value: ToneConfigurationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentTone = readToneConfigurationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              tone: {
                ...currentTone,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateArchetypeConfiguration<
    Key extends keyof ArchetypeConfigurationExtension,
  >(key: Key, value: ArchetypeConfigurationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentArchetype = readArchetypeConfigurationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              archetype: {
                ...currentArchetype,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateSpeciesGeneration<Key extends keyof SpeciesGenerationExtension>(
    key: Key,
    value: SpeciesGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentSpeciesGeneration =
        readSpeciesGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              species_generation: {
                ...currentSpeciesGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateEthnicityGeneration<
    Key extends keyof EthnicityGenerationExtension,
  >(key: Key, value: EthnicityGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentEthnicityGeneration =
        readEthnicityGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              ethnicity_generation: {
                ...currentEthnicityGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateRaceGeneration<Key extends keyof RaceGenerationExtension>(
    key: Key,
    value: RaceGenerationExtension[Key],
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentRaceGeneration = readRaceGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              race_generation: {
                ...currentRaceGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateNationalityGeneration<
    Key extends keyof NationalityGenerationExtension,
  >(key: Key, value: NationalityGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentNationalityGeneration =
        readNationalityGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              nationality_generation: {
                ...currentNationalityGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateOccupationGeneration<
    Key extends keyof OccupationGenerationExtension,
  >(key: Key, value: OccupationGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentOccupationGeneration =
        readOccupationGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              occupation_generation: {
                ...currentOccupationGeneration,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function updateRelationshipGeneration(
    index: number,
    nextRelationship: RelationshipGenerationExtension,
  ) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentRelationships =
        readRelationshipGenerationExtension(currentCard);
      const nextRelationships = currentRelationships.map((relationship, itemIndex) =>
        itemIndex === index ? nextRelationship : relationship,
      );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              relationship_generation: nextRelationships.slice(0, 3),
            },
          },
        },
      };
    });
  }

  function addRelationshipGeneration() {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentRelationships =
        readRelationshipGenerationExtension(currentCard);

      if (currentRelationships.length >= 3) {
        return currentCard;
      }

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              relationship_generation: [
                ...currentRelationships,
                {
                  ...DEFAULT_RELATIONSHIP_GENERATION[0],
                  npcName: "",
                  oneLineDescription: "",
                },
              ],
            },
          },
        },
      };
    });
  }

  function removeRelationshipGeneration(indexToRemove: number) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentRelationships =
        readRelationshipGenerationExtension(currentCard);
      const nextRelationships = currentRelationships.filter(
        (_relationship, index) => index !== indexToRemove,
      );

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              relationship_generation: nextRelationships,
            },
          },
        },
      };
    });
  }

  function updateRelationshipStatusGeneration<
    Key extends keyof RelationshipStatusGenerationExtension,
  >(key: Key, value: RelationshipStatusGenerationExtension[Key]) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentRelationshipStatus =
        readRelationshipStatusGenerationExtension(currentCard);

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              relationship_status_generation: {
                ...currentRelationshipStatus,
                [key]: value,
              },
            },
          },
        },
      };
    });
  }

  function toggleMacroArrayElement(
    key: "tones" | "micro_tropes",
    selectedValue: string,
  ) {
    const currentValues = macroExtension[key];
    const nextValues = currentValues.includes(selectedValue)
      ? currentValues.filter((value) => value !== selectedValue)
      : [...currentValues, selectedValue];

    updateMacroExtension(key, nextValues);
  }

  function handleAddGroupGreeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const greeting = newGroupGreeting.trim();
    if (!greeting) {
      return;
    }

    updateField("group_only_greetings", [
      ...activeCard.data.group_only_greetings,
      greeting,
    ]);
    setNewGroupGreeting("");
  }

  function handleRemoveAlternateGreeting(indexToRemove: number) {
    updateField(
      "alternate_greetings",
      activeCard.data.alternate_greetings.filter(
        (_greeting, index) => index !== indexToRemove,
      ),
    );
  }

  function handleRemoveGroupGreeting(indexToRemove: number) {
    updateField(
      "group_only_greetings",
      activeCard.data.group_only_greetings.filter(
        (_greeting, index) => index !== indexToRemove,
      ),
    );
  }

  async function handleGeneratePreview() {
    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const result = await buildCharacterCard({
        alternateGreetings: alternateGreetingGeneration,
        archetype: archetypeConfiguration,
        creatorsNotes: creatorsNotesGeneration,
        ethnicityRegion: ethnicityGeneration.region,
        fetish: fetishGeneration,
        firstMessage: firstMessageGeneration,
        formatting: formattingConfiguration,
        framework: frameworkConfiguration,
        groupAlternateGreetings: groupAlternateGreetingGeneration,
        groupGreetings: groupGreetingGeneration,
        intimacyStyle: intimacyStyleGeneration,
        kink: kinkGeneration,
        linguisticMatrix: ethnicityGeneration.linguisticMatrix,
        loreEntries: loreEntryGeneration,
        lorebookSummary: lorebookSummaryGeneration,
        nationalityCountry: nationalityGeneration.passportCountry || undefined,
        nationalityLegalStatus: nationalityGeneration.legalStatus,
        nationalityLinguisticVibe:
          nationalityGeneration.linguisticVibe || undefined,
        nationalityRegionalAlliance: nationalityGeneration.regionalAlliance,
        occupationAcademicYear: occupationGeneration.academicYear,
        occupationAuthorityDynamic: occupationGeneration.authorityDynamic,
        occupationCampusAffiliation:
          occupationGeneration.campusAffiliation || undefined,
        occupationFundingType: occupationGeneration.fundingType,
        occupationJobTitle: occupationGeneration.jobTitle || undefined,
        occupationMajorField: occupationGeneration.majorField,
        occupationProfessionalDomain: occupationGeneration.professionalDomain,
        occupationSocioeconomicTier: occupationGeneration.socioeconomicTier,
        occupationWorkplaceVibe:
          occupationGeneration.workplaceVibe || undefined,
        powerDynamic: ageGeneration.power_dynamic,
        postHistoryInstructions: postHistoryInstructionsGeneration,
        raceMacroGroup: raceGeneration.macroGroup,
        relationships: relationshipGeneration
          .filter(
            (relationship) =>
              relationship.npcName.trim() &&
              relationship.oneLineDescription.trim(),
          )
          .slice(0, 3),
        relationshipStatus: relationshipStatusGeneration,
        scenario: scenarioGeneration,
        scenarioOpeningPairs: scenarioOpeningPairGeneration,
        speciesType: speciesGeneration.type,
        tone: toneConfiguration,
        trope: ageGeneration.birthdate_preset || macroExtension.relationship,
        turnOffs: turnOffGeneration,
        worldLorePlaceholders: worldLorePlaceholderGeneration,
      });
      setPreviewResult(result);
      applyGeneratedPreview(result);
    } catch (caughtError) {
      setPreviewError(
        caughtError instanceof Error
          ? caughtError.message
          : "Character preview generation failed.",
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  function applyGeneratedPreview(result: BuildCharacterCardResult) {
    setActiveCard((currentCard) => {
      if (!currentCard) {
        return null;
      }

      const currentNamespace = readExtensionNamespace(
        currentCard.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
      );
      const currentNameGeneration = readNameGenerationExtension(currentCard);
      const currentAlternateGreetingGeneration =
        readAlternateGreetingGenerationExtension(currentCard);
      const currentAgeGeneration = readAgeGenerationExtension(currentCard);
      const currentArchetypeConfiguration =
        readArchetypeConfigurationExtension(currentCard);
      const currentFetishGeneration = readFetishGenerationExtension(currentCard);
      const currentFirstMessageGeneration =
        readFirstMessageGenerationExtension(currentCard);
      const currentGroupAlternateGreetingGeneration =
        readGroupAlternateGreetingGenerationExtension(currentCard);
      const currentGroupGreetingGeneration =
        readGroupGreetingGenerationExtension(currentCard);
      const currentIntimacyStyleGeneration =
        readIntimacyStyleGenerationExtension(currentCard);
      const currentKinkGeneration = readKinkGenerationExtension(currentCard);
      const currentEthnicityGeneration =
        readEthnicityGenerationExtension(currentCard);
      const currentNationalityGeneration =
        readNationalityGenerationExtension(currentCard);
      const currentOccupationGeneration =
        readOccupationGenerationExtension(currentCard);
      const currentRaceGeneration = readRaceGenerationExtension(currentCard);
      const currentRelationshipGeneration =
        readRelationshipGenerationExtension(currentCard);
      const currentRelationshipStatusGeneration =
        readRelationshipStatusGenerationExtension(currentCard);
      const currentScenarioGeneration =
        readScenarioGenerationExtension(currentCard);
      const currentScenarioOpeningPairGeneration =
        readScenarioOpeningPairGenerationExtension(currentCard);
      const currentLorebookSummaryGeneration =
        readLorebookSummaryGenerationExtension(currentCard);
      const currentLoreEntryGeneration =
        readLoreEntryGenerationExtension(currentCard);
      const currentFrameworkConfiguration =
        readFrameworkConfigurationExtension(currentCard);
      const currentFormattingConfiguration =
        readFormattingConfigurationExtension(currentCard);
      const currentToneConfiguration = readToneConfigurationExtension(currentCard);
      const currentCreatorsNotesGeneration =
        readCreatorsNotesGenerationExtension(currentCard);
      const currentPostHistoryInstructionsGeneration =
        readPostHistoryInstructionsGenerationExtension(currentCard);
      const currentWorldLorePlaceholderGeneration =
        readWorldLorePlaceholderGenerationExtension(currentCard);
      const currentSpeciesGeneration =
        readSpeciesGenerationExtension(currentCard);
      const currentTurnOffGeneration = readTurnOffGenerationExtension(currentCard);
      const generatedName = `${result.meta.given_name} ${result.meta.surname}`;

      return {
        ...currentCard,
        data: {
          ...currentCard.data,
          alternate_greetings:
            [
              ...(result.meta.alternateGreetings ?? []),
              ...(result.meta.scenarioOpeningPairs ?? []),
            ]
              .map((alternateGreeting) =>
                "completedGreeting" in alternateGreeting
                  ? alternateGreeting.completedGreeting.trim()
                  : alternateGreeting.alternateFirstMessage.trim(),
              )
              .filter(Boolean)
              .slice(0, 5) ?? currentCard.data.alternate_greetings,
          group_only_greetings:
            [
              ...(result.meta.groupGreetings ?? []),
              ...(result.meta.groupAlternateGreetings ?? []),
            ]
              .map((groupGreeting) => groupGreeting.completedGreeting.trim())
              .filter(Boolean)
              .slice(0, 5) ?? currentCard.data.group_only_greetings,
          first_mes: result.greeting,
          name: generatedName,
          extensions: {
            ...currentCard.data.extensions,
            [AMOURAI_EXTENSION_NAMESPACE]: {
              ...currentNamespace,
              alternate_greeting_generation:
                result.meta.alternateGreetings ??
                currentAlternateGreetingGeneration,
              archetype:
                result.meta.archetype ?? currentArchetypeConfiguration,
              creators_notes:
                result.meta.creatorsNotes ?? currentCreatorsNotesGeneration,
              formatting:
                result.meta.formatting ?? currentFormattingConfiguration,
              framework:
                result.meta.framework ?? currentFrameworkConfiguration,
              lore_entries:
                result.meta.loreEntries ?? currentLoreEntryGeneration,
              tone: result.meta.tone ?? currentToneConfiguration,
              post_history_instructions_generation:
                result.meta.postHistoryInstructions ??
                currentPostHistoryInstructionsGeneration,
              world_lore_placeholder:
                result.meta.worldLorePlaceholders ??
                currentWorldLorePlaceholderGeneration,
              age_generation: {
                ...currentAgeGeneration,
                age: String(result.meta.age),
                apparent_age: result.meta.apparent_age
                  ? String(result.meta.apparent_age)
                  : currentAgeGeneration.apparent_age,
                birth_day: String(result.meta.birth_day),
                birth_month: result.meta.birth_month,
                birth_year: String(result.meta.birth_year),
                zodiac: result.meta.zodiac,
              },
              name_generation: {
                ...currentNameGeneration,
                aura:
                  result.meta.species?.nameAura ?? currentNameGeneration.aura,
                firstname: result.meta.given_name,
                era: result.meta.species?.nameEra ?? currentNameGeneration.era,
                heritage:
                  result.meta.ethnicity?.culturalHeritage ??
                  result.meta.species?.heritage ??
                  currentNameGeneration.heritage,
                surname: result.meta.surname,
              },
              fetish_generation: result.meta.fetish ?? currentFetishGeneration,
              first_message_generation:
                result.meta.firstMessage ?? currentFirstMessageGeneration,
              group_greeting_generation:
                result.meta.groupGreetings ?? currentGroupGreetingGeneration,
              group_alternate_greeting_generation:
                result.meta.groupAlternateGreetings ??
                currentGroupAlternateGreetingGeneration,
              intimacy_style_generation:
                result.meta.intimacyStyle ?? currentIntimacyStyleGeneration,
              kink_generation: result.meta.kink ?? currentKinkGeneration,
              lorebook_summary:
                result.meta.lorebookSummary ??
                currentLorebookSummaryGeneration,
              ethnicity_generation: {
                ...currentEthnicityGeneration,
                culturalHeritage:
                  result.meta.ethnicity?.culturalHeritage ??
                  currentEthnicityGeneration.culturalHeritage,
                hasDiasporicBaggage:
                  result.meta.ethnicity?.hasDiasporicBaggage ??
                  currentEthnicityGeneration.hasDiasporicBaggage,
                linguisticMatrix:
                  result.meta.ethnicity?.linguisticMatrix ??
                  currentEthnicityGeneration.linguisticMatrix,
                nativeLanguage:
                  result.meta.ethnicity?.nativeLanguage ??
                  currentEthnicityGeneration.nativeLanguage,
                region:
                  result.meta.ethnicity?.region ??
                  currentEthnicityGeneration.region,
                societalContext:
                  result.meta.ethnicity?.societalContext ??
                  currentEthnicityGeneration.societalContext,
              },
              nationality_generation: {
                ...currentNationalityGeneration,
                legalStatus:
                  result.meta.nationality?.legalStatus ??
                  currentNationalityGeneration.legalStatus,
                linguisticVibe:
                  result.meta.nationality?.linguisticVibe ??
                  currentNationalityGeneration.linguisticVibe,
                passportCountry:
                  result.meta.nationality?.passportCountry ??
                  currentNationalityGeneration.passportCountry,
                regionalAlliance:
                  result.meta.nationality?.regionalAlliance ??
                  currentNationalityGeneration.regionalAlliance,
              },
              occupation_generation: {
                ...currentOccupationGeneration,
                academicYear:
                  result.meta.occupation?.kind === "student"
                    ? result.meta.occupation.academicYear
                    : currentOccupationGeneration.academicYear,
                authorityDynamic:
                  result.meta.occupation?.authorityDynamic ??
                  currentOccupationGeneration.authorityDynamic,
                campusAffiliation:
                  result.meta.occupation?.kind === "student"
                    ? result.meta.occupation.campusAffiliation
                    : currentOccupationGeneration.campusAffiliation,
                fundingType:
                  result.meta.occupation?.kind === "student"
                    ? result.meta.occupation.fundingType
                    : currentOccupationGeneration.fundingType,
                jobTitle:
                  result.meta.occupation?.jobTitle ??
                  currentOccupationGeneration.jobTitle,
                majorField:
                  result.meta.occupation?.kind === "student"
                    ? result.meta.occupation.majorField
                    : currentOccupationGeneration.majorField,
                professionalDomain:
                  result.meta.occupation?.kind === "professional"
                    ? result.meta.occupation.professionalDomain
                    : currentOccupationGeneration.professionalDomain,
                socioeconomicTier:
                  result.meta.occupation?.kind === "professional"
                    ? result.meta.occupation.socioeconomicTier
                    : currentOccupationGeneration.socioeconomicTier,
                workplaceVibe:
                  result.meta.occupation?.workplaceVibe ??
                  currentOccupationGeneration.workplaceVibe,
              },
              race_generation: {
                ...currentRaceGeneration,
                isCulturallySalient:
                  result.meta.race?.isCulturallySalient ??
                  currentRaceGeneration.isCulturallySalient,
                macroGroup:
                  result.meta.race?.macroGroup ??
                  currentRaceGeneration.macroGroup,
                narrativeStyle:
                  result.meta.race?.narrativeStyle ??
                  currentRaceGeneration.narrativeStyle,
                physicalDescriptors:
                  result.meta.race?.physicalDescriptors ??
                  currentRaceGeneration.physicalDescriptors,
                syncMode:
                  result.meta.race?.syncMode ?? currentRaceGeneration.syncMode,
              },
              relationship_generation:
                result.meta.relationships?.slice(0, 3) ??
                currentRelationshipGeneration,
              relationship_status_generation:
                result.meta.relationshipStatus ??
                currentRelationshipStatusGeneration,
              scenario_generation:
                result.meta.scenario ?? currentScenarioGeneration,
              scenario_opening_pair_generation:
                result.meta.scenarioOpeningPairs ??
                currentScenarioOpeningPairGeneration,
              species_generation: {
                ...currentSpeciesGeneration,
                apparentAge: result.meta.species?.apparentAge
                  ? String(result.meta.species.apparentAge)
                  : currentSpeciesGeneration.apparentAge,
                biologyTag: result.meta.species
                  ? speciesTypeToBiologyTag(result.meta.species.type)
                  : currentSpeciesGeneration.biologyTag,
                dietaryNeed:
                  result.meta.species?.dietaryNeed ??
                  currentSpeciesGeneration.dietaryNeed,
                instinctualTrait:
                  result.meta.species?.instinctualTrait ??
                  currentSpeciesGeneration.instinctualTrait,
                isImmortal:
                  result.meta.species?.isImmortal ??
                  currentSpeciesGeneration.isImmortal,
                lifespanAnchor: result.meta.species?.isImmortal
                  ? "Static Agelessness"
                  : currentSpeciesGeneration.lifespanAnchor,
                type: result.meta.species?.type ?? currentSpeciesGeneration.type,
              },
              turn_off_generation:
                result.meta.turnOffs ?? currentTurnOffGeneration,
            },
          },
        },
      };
    });
  }

  return (
    <>
    <section className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30">
      <div className="flex shrink-0 gap-1 border-b border-zinc-800 bg-zinc-950/60 p-1">
        {EDITOR_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === tab
                ? "border border-zinc-800 bg-zinc-900 text-violet-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {activeTab === "identity" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                <Field label="Character Name">
                  <input
                    type="text"
                    value={activeCard.data.name}
                    onChange={(event) =>
                      updateField("name", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Version">
                  <input
                    type="text"
                    value={activeCard.data.character_version}
                    onChange={(event) =>
                      updateField("character_version", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 sm:grid-cols-2 lg:col-span-2">
                <MacroButtonGroup
                  activeValue={macroExtension.framework}
                  label="Chat Style"
                  options={FRAMEWORKS}
                  tone="violet"
                  onSelect={(value) => updateMacroExtension("framework", value)}
                />

                <MacroButtonGroup
                  activeValue={macroExtension.relationship}
                  label="Relationship Dynamic"
                  options={RELATIONSHIPS}
                  tone="emerald"
                  onSelect={(value) => updateMacroExtension("relationship", value)}
                />

                <MacroButtonGroup
                  activeValue={macroExtension.formatting}
                  label="Card Format"
                  options={FORMATTINGS}
                  tone="sky"
                  onSelect={(value) => updateMacroExtension("formatting", value)}
                />
              </div>
            </div>

            <CharacterCreationFormPanel
              form={characterCreationForm}
              onAddTargetOverride={addCharacterCreationTargetOverride}
              onBooleanChange={updateCharacterCreationBoolean}
              onRemoveTargetOverride={removeCharacterCreationTargetOverride}
              onSeedSelect={applyCharacterCreationSeed}
              onTextChange={updateCharacterCreationText}
            />

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Writing Style
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Choose how replies are written: dialogue, emphasis,
                  perspective, and reply length.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <MacroButtonGroup
                  activeValue={formattingConfiguration.actionWrappingStandard}
                  label="Dialogue Style"
                  options={FORMATTING_ACTION_WRAPPING_STANDARDS}
                  tone="violet"
                  onSelect={(value) =>
                    updateFormattingConfiguration(
                      "actionWrappingStandard",
                      value,
                    )
                  }
                />

                <MacroButtonGroup
                  activeValue={formattingConfiguration.markdownEmphasisStyle}
                  label="Thoughts and Emphasis"
                  options={FORMATTING_MARKDOWN_EMPHASIS_STYLES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateFormattingConfiguration("markdownEmphasisStyle", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={formattingConfiguration.narrativePerspective}
                  label="Point of View"
                  options={FORMATTING_NARRATIVE_PERSPECTIVES}
                  tone="sky"
                  onSelect={(value) =>
                    updateFormattingConfiguration("narrativePerspective", value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Style Preset ID">
                  <input
                    type="text"
                    value={formattingConfiguration.formattingId}
                    onChange={(event) =>
                      updateFormattingConfiguration(
                        "formattingId",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Max Paragraphs per Reply">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={formattingConfiguration.maxParagraphsPerTurn}
                    onChange={(event) =>
                      updateFormattingConfiguration(
                        "maxParagraphsPerTurn",
                        Number(event.currentTarget.value),
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <Field label="Writing Rules">
                <textarea
                  value={formattingConfiguration.formattingSystemPromptInjection}
                  onChange={(event) =>
                    updateFormattingConfiguration(
                      "formattingSystemPromptInjection",
                      event.currentTarget.value,
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="rounded-lg border border-violet-500/25 bg-violet-500/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 shrink-0 text-violet-300" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Need worldbuilding?
                    </h3>
                  </div>
                  <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">
                    Keep worldbuilding in Lorebook Studio, then attach it to this
                    character from the Linked Lorebook controls in the Behavior
                    tab. You can choose a saved lorebook or upload a JSON file.
                  </p>
                </div>

                <a
                  href="/lorebooks"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-zinc-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-violet-200 transition hover:border-violet-400 hover:text-white"
                >
                  Open Lorebook Studio
                </a>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Intimacy Style
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  How the character behaves in private romantic moments.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MacroButtonGroup
                  activeValue={intimacyStyleGeneration.expressionType}
                  label="Emotional Style"
                  options={INTIMACY_EXPRESSION_TYPES}
                  tone="violet"
                  onSelect={(value) =>
                    updateIntimacyStyleGeneration("expressionType", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={intimacyStyleGeneration.aftercareStyle}
                  label="Comfort Style"
                  options={INTIMACY_AFTERCARE_STYLES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateIntimacyStyleGeneration("aftercareStyle", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={intimacyStyleGeneration.verbalCadence}
                  label="How They Talk"
                  options={INTIMACY_VERBAL_CADENCES}
                  tone="sky"
                  onSelect={(value) =>
                    updateIntimacyStyleGeneration("verbalCadence", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={intimacyStyleGeneration.physicalLoveLanguage}
                  label="Physical Love Language"
                  options={INTIMACY_PHYSICAL_LOVE_LANGUAGES}
                  tone="violet"
                  onSelect={(value) =>
                    updateIntimacyStyleGeneration(
                      "physicalLoveLanguage",
                      value,
                    )
                  }
                />
              </div>

              <Field label="Private Scene Guidance">
                <textarea
                  value={intimacyStyleGeneration.aiBehaviorPrompt}
                  onChange={(event) =>
                    updateIntimacyStyleGeneration(
                      "aiBehaviorPrompt",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Turn-Offs and Boundaries
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Things that should make {"{{char}}"} slow down, pull back, or
                  set a clear boundary.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={turnOffGeneration.dynamicHardlines}
                  label="Hard Boundary"
                  options={TURN_OFF_DYNAMIC_HARDLINES}
                  tone="violet"
                  onSelect={(value) =>
                    updateTurnOffGeneration("dynamicHardlines", value)
                  }
                />

                <Field label="Personality Turn-Offs">
                  <input
                    type="text"
                    value={turnOffGeneration.behavioralTurnOffs.join(", ")}
                    onChange={(event) =>
                      updateTurnOffGeneration(
                        "behavioralTurnOffs",
                        event.currentTarget.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Sensory Turn-Offs">
                  <input
                    type="text"
                    value={turnOffGeneration.sensoryTurnOffs.join(", ")}
                    onChange={(event) =>
                      updateTurnOffGeneration(
                        "sensoryTurnOffs",
                        event.currentTarget.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <Field label="Boundary Response">
                <textarea
                  value={turnOffGeneration.aiReactionPrompt}
                  onChange={(event) =>
                    updateTurnOffGeneration(
                      "aiReactionPrompt",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Opening Scene
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Where the first scene starts, what causes the encounter, and
                  how tense it feels.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={scenarioGeneration.settingType}
                  label="Setting"
                  options={SCENARIO_SETTING_TYPES}
                  tone="violet"
                  onSelect={(value) =>
                    updateScenarioGeneration("settingType", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={scenarioGeneration.plotHook}
                  label="Plot Hook"
                  options={SCENARIO_PLOT_HOOKS}
                  tone="emerald"
                  onSelect={(value) =>
                    updateScenarioGeneration("plotHook", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={scenarioGeneration.startingTension}
                  label="Starting Mood"
                  options={SCENARIO_STARTING_TENSIONS}
                  tone="sky"
                  onSelect={(value) =>
                    updateScenarioGeneration("startingTension", value)
                  }
                />
              </div>

              <Field label="Sensory Details">
                <input
                  type="text"
                  value={scenarioGeneration.sensoryDetails.join(", ")}
                  onChange={(event) =>
                    updateScenarioGeneration(
                      "sensoryDetails",
                      event.currentTarget.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Scene Premise">
                <textarea
                  value={scenarioGeneration.scenePremiseDescription}
                  onChange={(event) =>
                    updateScenarioGeneration(
                      "scenePremiseDescription",
                      event.currentTarget.value,
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  First Message Style
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  How the opening message should read and how it should leave
                  room for the user to answer.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={firstMessageGeneration.entryPoint}
                  label="Opening Beat"
                  options={FIRST_MESSAGE_ENTRY_POINTS}
                  tone="violet"
                  onSelect={(value) =>
                    updateFirstMessageGeneration("entryPoint", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={firstMessageGeneration.literaryStyle}
                  label="Writing Style"
                  options={FIRST_MESSAGE_LITERARY_STYLES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateFirstMessageGeneration("literaryStyle", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={firstMessageGeneration.userCallToAction}
                  label="How It Invites the User"
                  options={FIRST_MESSAGE_USER_CALLS_TO_ACTION}
                  tone="sky"
                  onSelect={(value) =>
                    updateFirstMessageGeneration("userCallToAction", value)
                  }
                />
              </div>

              <Field label="Approximate Length">
                <input
                  type="number"
                  min={200}
                  max={1200}
                  value={firstMessageGeneration.tokenLengthCap}
                  onChange={(event) =>
                    updateFirstMessageGeneration(
                      "tokenLengthCap",
                      Number(event.currentTarget.value),
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="First Message Instructions">
                <textarea
                  value={firstMessageGeneration.aiOutputConstraint}
                  onChange={(event) =>
                    updateFirstMessageGeneration(
                      "aiOutputConstraint",
                      event.currentTarget.value,
                    )
                  }
                  className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Tone
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  The emotional color, pacing, and word choices used in the
                  generated prose.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <MacroButtonGroup
                  activeValue={toneConfiguration.proseTexture}
                  label="Prose Mood"
                  options={TONE_PROSE_TEXTURES}
                  tone="violet"
                  onSelect={(value) =>
                    updateToneConfiguration("proseTexture", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={toneConfiguration.pacingVelocity}
                  label="Pacing"
                  options={TONE_PACING_VELOCITIES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateToneConfiguration("pacingVelocity", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={toneConfiguration.worldviewFilter}
                  label="Outlook"
                  options={TONE_WORLDVIEW_FILTERS}
                  tone="sky"
                  onSelect={(value) =>
                    updateToneConfiguration("worldviewFilter", value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Tone Preset ID">
                  <input
                    type="text"
                    value={toneConfiguration.toneId}
                    onChange={(event) =>
                      updateToneConfiguration(
                        "toneId",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Words to Favor">
                  <input
                    type="text"
                    value={toneConfiguration.aiVocabularyDirectives.join(", ")}
                    onChange={(event) =>
                      updateToneConfiguration(
                        "aiVocabularyDirectives",
                        event.currentTarget.value
                          .split(",")
                          .map((directive) => directive.trim())
                          .filter(Boolean)
                          .slice(0, 12),
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <Field label="Tone Instructions">
                <textarea
                  value={toneConfiguration.toneSystemPromptInjection}
                  onChange={(event) =>
                    updateToneConfiguration(
                      "toneSystemPromptInjection",
                      event.currentTarget.value,
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Character Archetype
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  The character&apos;s emotional pattern before the romance starts
                  changing them.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <MacroButtonGroup
                  activeValue={archetypeConfiguration.personaType}
                  label="Character Type"
                  options={ARCHETYPE_PERSONA_TYPES}
                  tone="violet"
                  onSelect={(value) =>
                    updateArchetypeConfiguration("personaType", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={archetypeConfiguration.defenseMechanism}
                  label="Defense Style"
                  options={ARCHETYPE_DEFENSE_MECHANISMS}
                  tone="emerald"
                  onSelect={(value) =>
                    updateArchetypeConfiguration("defenseMechanism", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={archetypeConfiguration.coreMotivation}
                  label="Core Motivation"
                  options={ARCHETYPE_CORE_MOTIVATIONS}
                  tone="sky"
                  onSelect={(value) =>
                    updateArchetypeConfiguration("coreMotivation", value)
                  }
                />
              </div>

                <Field label="Archetype ID">
                <input
                  type="text"
                  value={archetypeConfiguration.archetypeId}
                  onChange={(event) =>
                    updateArchetypeConfiguration(
                      "archetypeId",
                      event.currentTarget.value,
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Behavior Notes">
                <textarea
                  value={archetypeConfiguration.aiBehaviorPrompt}
                  onChange={(event) =>
                    updateArchetypeConfiguration(
                      "aiBehaviorPrompt",
                      event.currentTarget.value,
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Adult Intimacy
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Optional private-scene guidance. Leave this off for cards
                    that should stay non-explicit.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={kinkGeneration.nsfwEnabled}
                    onChange={(event) =>
                      updateKinkGeneration(
                        "nsfwEnabled",
                        event.currentTarget.checked,
                      )
                    }
                    className="size-3.5 accent-violet-500"
                  />
                  Enable adult content
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MacroButtonGroup
                  activeValue={kinkGeneration.primaryRole}
                  label="Role"
                  options={KINK_PRIMARY_ROLES}
                  tone="violet"
                  onSelect={(value) =>
                    updateKinkGeneration("primaryRole", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={kinkGeneration.intensityLevel}
                  label="Intensity"
                  options={KINK_INTENSITY_LEVELS}
                  tone="emerald"
                  onSelect={(value) =>
                    updateKinkGeneration("intensityLevel", value)
                  }
                />
              </div>

              <MacroToggleGroup
                activeValues={kinkGeneration.preferredSensoryTags}
                label="Boundaries and Interests"
                options={KINK_SENSORY_TAGS}
                tone="violet"
                onToggle={(value) => {
                  const nextTags = kinkGeneration.preferredSensoryTags.includes(
                    value,
                  )
                    ? kinkGeneration.preferredSensoryTags.filter(
                        (tag) => tag !== value,
                      )
                    : [...kinkGeneration.preferredSensoryTags, value];

                  updateKinkGeneration("preferredSensoryTags", nextTags);
                }}
              />

              <Field label="Adult Scene Instructions">
                <textarea
                  value={kinkGeneration.systemPromptInstruction}
                  onChange={(event) =>
                    updateKinkGeneration(
                      "systemPromptInstruction",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Specific Focuses
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Optional detail focus for private scenes, clothing,
                    situation, and scale.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={fetishGeneration.fetishEnabled}
                    onChange={(event) =>
                      updateFetishGeneration(
                        "fetishEnabled",
                        event.currentTarget.checked,
                      )
                    }
                    className="size-3.5 accent-violet-500"
                  />
                  Enable specific focuses
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MacroButtonGroup
                  activeValue={fetishGeneration.anatomicalFocus}
                  label="Body Focus"
                  options={FETISH_ANATOMICAL_FOCUSES}
                  tone="violet"
                  onSelect={(value) =>
                    updateFetishGeneration("anatomicalFocus", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={fetishGeneration.materialPreference}
                  label="Clothing or Material Focus"
                  options={FETISH_MATERIAL_PREFERENCES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateFetishGeneration("materialPreference", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={fetishGeneration.situationalTrigger}
                  label="Situation"
                  options={FETISH_SITUATIONAL_TRIGGERS}
                  tone="sky"
                  onSelect={(value) =>
                    updateFetishGeneration("situationalTrigger", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={fetishGeneration.sizeFantasyModifier}
                  label="Scale"
                  options={FETISH_SIZE_MODIFIERS}
                  tone="violet"
                  onSelect={(value) =>
                    updateFetishGeneration("sizeFantasyModifier", value)
                  }
                />
              </div>

              <Field label="Description Guidance">
                <textarea
                  value={fetishGeneration.aiDescriptiveFocus}
                  onChange={(event) =>
                    updateFetishGeneration(
                      "aiDescriptiveFocus",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Nationality and Citizenship
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Citizenship, travel context, and accent guidance. This stays
                  separate from race and ethnicity.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Field label="Country">
                  <input
                    type="text"
                    value={nationalityGeneration.passportCountry}
                    onChange={(event) =>
                      updateNationalityGeneration(
                        "passportCountry",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <MacroButtonGroup
                  activeValue={nationalityGeneration.regionalAlliance}
                  label="Regional Context"
                  options={NATIONALITY_REGIONAL_ALLIANCES}
                  tone="sky"
                  onSelect={(value) =>
                    updateNationalityGeneration("regionalAlliance", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={nationalityGeneration.legalStatus}
                  label="Citizenship Status"
                  options={NATIONALITY_LEGAL_STATUSES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateNationalityGeneration("legalStatus", value)
                  }
                />
              </div>

              <Field label="Accent and Slang Notes">
                <textarea
                  value={nationalityGeneration.linguisticVibe}
                  onChange={(event) =>
                    updateNationalityGeneration(
                      "linguisticVibe",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Character Name Parts
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Name pieces and naming style. These help the generator choose
                  names that fit the character.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Field label="Full Name">
                  <input
                    type="text"
                    value={activeCard.data.name}
                    onChange={(event) =>
                      updateField("name", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="First Name">
                  <input
                    type="text"
                    value={nameGeneration.firstname}
                    onChange={(event) =>
                      updateNameGeneration("firstname", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Surname">
                  <input
                    type="text"
                    value={nameGeneration.surname}
                    onChange={(event) =>
                      updateNameGeneration("surname", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Title">
                  <input
                    type="text"
                    value={nameGeneration.title}
                    onChange={(event) =>
                      updateNameGeneration("title", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Nickname or Alias">
                  <input
                    type="text"
                    value={nameGeneration.alias}
                    onChange={(event) =>
                      updateNameGeneration("alias", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MacroButtonGroup
                  activeValue={nameGeneration.heritage}
                  label="Name Heritage"
                  options={HERITAGE_TAGS}
                  tone="sky"
                  onSelect={(value) => updateNameGeneration("heritage", value)}
                />

                <MacroButtonGroup
                  activeValue={nameGeneration.era}
                  label="Era"
                  options={ERA_TAGS}
                  tone="violet"
                  onSelect={(value) => updateNameGeneration("era", value)}
                />

                <MacroButtonGroup
                  activeValue={nameGeneration.aura}
                  label="Name Feel"
                  options={AURA_TAGS}
                  tone="emerald"
                  onSelect={(value) => updateNameGeneration("aura", value)}
                />

                <MacroButtonGroup
                  activeValue={nameGeneration.composition}
                  label="Name Format"
                  options={COMPOSITION_TAGS}
                  tone="sky"
                  onSelect={(value) => updateNameGeneration("composition", value)}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Work and Status
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Work, class, hierarchy, and campus roles that shape everyday
                  life and romance pressure.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Field label="Job Title">
                  <input
                    type="text"
                    value={occupationGeneration.jobTitle}
                    onChange={(event) =>
                      updateOccupationGeneration(
                        "jobTitle",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <MacroButtonGroup
                  activeValue={occupationGeneration.authorityDynamic}
                  label="Work Relationship"
                  options={OCCUPATION_AUTHORITY_DYNAMICS}
                  tone="emerald"
                  onSelect={(value) =>
                    updateOccupationGeneration("authorityDynamic", value)
                  }
                />

                <label className="inline-flex items-center gap-2 self-end rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
                  <input
                    type="checkbox"
                    checked={occupationGeneration.jobTitle === "University Student"}
                    onChange={(event) =>
                      updateOccupationGeneration(
                        "jobTitle",
                        event.currentTarget.checked
                          ? "University Student"
                          : DEFAULT_OCCUPATION_GENERATION.jobTitle,
                      )
                    }
                    className="size-3.5 accent-violet-500"
                  />
                  Make them a university student
                </label>
              </div>

              {occupationGeneration.jobTitle === "University Student" ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <MacroButtonGroup
                    activeValue={occupationGeneration.academicYear}
                    label="Year Level"
                    options={STUDENT_ACADEMIC_YEARS}
                    tone="violet"
                    onSelect={(value) =>
                      updateOccupationGeneration("academicYear", value)
                    }
                  />

                  <MacroButtonGroup
                    activeValue={occupationGeneration.majorField}
                    label="Major or Field"
                    options={STUDENT_MAJOR_FIELDS}
                    tone="sky"
                    onSelect={(value) =>
                      updateOccupationGeneration("majorField", value)
                    }
                  />

                  <MacroButtonGroup
                    activeValue={occupationGeneration.fundingType}
                    label="Funding Source"
                    options={STUDENT_FUNDING_TYPES}
                    tone="emerald"
                    onSelect={(value) =>
                      updateOccupationGeneration("fundingType", value)
                    }
                  />

                  <Field label="Campus Affiliation">
                    <input
                      type="text"
                      value={occupationGeneration.campusAffiliation}
                      onChange={(event) =>
                        updateOccupationGeneration(
                          "campusAffiliation",
                          event.currentTarget.value,
                        )
                      }
                      className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                    />
                  </Field>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <MacroButtonGroup
                    activeValue={occupationGeneration.socioeconomicTier}
                    label="Class and Status"
                    options={OCCUPATION_SOCIOECONOMIC_TIERS}
                    tone="violet"
                    onSelect={(value) =>
                      updateOccupationGeneration("socioeconomicTier", value)
                    }
                  />

                  <MacroButtonGroup
                    activeValue={occupationGeneration.professionalDomain}
                    label="Industry"
                    options={OCCUPATION_PROFESSIONAL_DOMAINS}
                    tone="sky"
                    onSelect={(value) =>
                      updateOccupationGeneration("professionalDomain", value)
                    }
                  />
                </div>
              )}

              <Field label="Workplace Atmosphere">
                <textarea
                  value={occupationGeneration.workplaceVibe}
                  onChange={(event) =>
                    updateOccupationGeneration(
                      "workplaceVibe",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Age and Life Stage
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Age, life stage, and whether age changes the relationship
                  dynamic.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Age">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ageGeneration.age}
                    onChange={(event) =>
                      updateAgeGeneration("age", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Apparent Age">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ageGeneration.apparent_age}
                    onChange={(event) =>
                      updateAgeGeneration(
                        "apparent_age",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Birth Year">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ageGeneration.birth_year}
                    onChange={(event) =>
                      updateAgeGeneration("birth_year", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Birth Month">
                  <input
                    type="text"
                    value={ageGeneration.birth_month}
                    onChange={(event) =>
                      updateAgeGeneration("birth_month", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Birth Day">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ageGeneration.birth_day}
                    onChange={(event) =>
                      updateAgeGeneration("birth_day", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Zodiac">
                  <select
                    value={ageGeneration.zodiac}
                    onChange={(event) =>
                      updateAgeGeneration("zodiac", event.currentTarget.value)
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  >
                    <option value="">Unassigned</option>
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign} value={sign}>
                        {sign}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={ageGeneration.developmental_stage}
                  label="Life Stage"
                  options={DEVELOPMENTAL_STAGE_TAGS}
                  tone="violet"
                  onSelect={(value) =>
                    updateAgeGeneration("developmental_stage", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={ageGeneration.legal_status}
                  label="Adult Context"
                  options={LEGAL_STATUS_TAGS}
                  tone="sky"
                  onSelect={(value) => updateAgeGeneration("legal_status", value)}
                />

                <MacroButtonGroup
                  activeValue={ageGeneration.power_dynamic}
                  label="Age Dynamic"
                  options={AGE_POWER_DYNAMIC_TAGS}
                  tone="emerald"
                  onSelect={(value) => updateAgeGeneration("power_dynamic", value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={ageGeneration.temporal_anchor}
                  label="Setting Timeline"
                  options={TEMPORAL_ANCHOR_TAGS}
                  tone="violet"
                  onSelect={(value) =>
                    updateAgeGeneration("temporal_anchor", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={ageGeneration.zodiac_alignment}
                  label="Zodiac Element"
                  options={ZODIAC_ALIGNMENT_TAGS}
                  tone="emerald"
                  onSelect={(value) =>
                    updateAgeGeneration("zodiac_alignment", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={ageGeneration.seasonal_vibe}
                  label="Seasonal Feel"
                  options={SEASONAL_VIBE_TAGS}
                  tone="sky"
                  onSelect={(value) =>
                    updateAgeGeneration("seasonal_vibe", value)
                  }
                />
              </div>

              <MacroButtonGroup
                activeValue={ageGeneration.birthdate_preset}
                label="Birthdate Trope"
                options={BIRTHDATE_PRESETS}
                tone="violet"
                onSelect={(value) =>
                  updateAgeGeneration("birthdate_preset", value)
                }
              />
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Relationship Availability
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Whether the character is free to pursue romance, emotionally
                  available, or under outside pressure.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={relationshipStatusGeneration.currentLabel}
                  label="Current Status"
                  options={RELATIONSHIP_CURRENT_LABELS}
                  tone="violet"
                  onSelect={(value) =>
                    updateRelationshipStatusGeneration("currentLabel", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={
                    relationshipStatusGeneration.emotionalAvailability
                  }
                  label="Emotional Availability"
                  options={RELATIONSHIP_EMOTIONAL_AVAILABILITIES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateRelationshipStatusGeneration(
                      "emotionalAvailability",
                      value,
                    )
                  }
                />

                <MacroButtonGroup
                  activeValue={relationshipStatusGeneration.scandalFactor}
                  label="Scandal Risk"
                  options={RELATIONSHIP_SCANDAL_FACTORS}
                  tone="sky"
                  onSelect={(value) =>
                    updateRelationshipStatusGeneration("scandalFactor", value)
                  }
                />
              </div>

              <Field label="Relationship Context">
                <textarea
                  value={relationshipStatusGeneration.statusContext}
                  onChange={(event) =>
                    updateRelationshipStatusGeneration(
                      "statusContext",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Supporting Characters
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Up to three people around the character who add comfort,
                    pressure, secrets, or jealousy.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addRelationshipGeneration}
                  disabled={relationshipGeneration.length >= 3}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-xs font-semibold text-zinc-300 transition hover:border-violet-500/50 hover:text-violet-200 disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add NPC
                </button>
              </div>

              <div className="space-y-3">
                {relationshipGeneration.map((relationship, index) => (
                  <div
                    key={`${relationship.npcName}-${index}`}
                    className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                        NPC #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRelationshipGeneration(index)}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-zinc-800 text-zinc-500 transition hover:border-rose-500/40 hover:text-rose-300"
                        title="Remove NPC relationship"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <Field label="Character Name">
                        <input
                          type="text"
                          value={relationship.npcName}
                          onChange={(event) =>
                            updateRelationshipGeneration(index, {
                              ...relationship,
                              npcName: event.currentTarget.value,
                            })
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                        />
                      </Field>

                      <MacroButtonGroup
                        activeValue={relationship.connectionType}
                        label="Connection"
                        options={NPC_CONNECTION_TYPES}
                        tone="violet"
                        onSelect={(value) =>
                          updateRelationshipGeneration(index, {
                            ...relationship,
                            connectionType: value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <MacroButtonGroup
                        activeValue={relationship.romanceFunction}
                        label="Story Role"
                        options={NPC_ROMANCE_FUNCTIONS}
                        tone="emerald"
                        onSelect={(value) =>
                          updateRelationshipGeneration(index, {
                            ...relationship,
                            romanceFunction: value,
                          })
                        }
                      />

                      <MacroButtonGroup
                        activeValue={relationship.emotionalStatus}
                        label="Relationship Mood"
                        options={NPC_EMOTIONAL_STATUSES}
                        tone="sky"
                        onSelect={(value) =>
                          updateRelationshipGeneration(index, {
                            ...relationship,
                            emotionalStatus: value,
                          })
                        }
                      />
                    </div>

                    <Field label="Short Description">
                      <textarea
                        value={relationship.oneLineDescription}
                        onChange={(event) =>
                          updateRelationshipGeneration(index, {
                            ...relationship,
                            oneLineDescription: event.currentTarget.value,
                          })
                        }
                        className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Species and Biology
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Species, lifespan, and instincts that shape the character&apos;s
                  body, needs, and behavior.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={speciesGeneration.type}
                  label="Species"
                  options={SPECIES_TYPES}
                  tone="violet"
                  onSelect={(value) => updateSpeciesGeneration("type", value)}
                />

                <MacroButtonGroup
                  activeValue={speciesGeneration.biologyTag}
                  label="Body Type"
                  options={BIOLOGY_TAGS}
                  tone="sky"
                  onSelect={(value) =>
                    updateSpeciesGeneration("biologyTag", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={speciesGeneration.lifespanAnchor}
                  label="Lifespan"
                  options={LIFESPAN_ANCHORS}
                  tone="emerald"
                  onSelect={(value) =>
                    updateSpeciesGeneration("lifespanAnchor", value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={speciesGeneration.instinctualTrait}
                  label="Instincts"
                  options={INSTINCTUAL_TRAITS}
                  tone="violet"
                  onSelect={(value) =>
                    updateSpeciesGeneration("instinctualTrait", value)
                  }
                />

                <Field label="Dietary Need">
                  <input
                    type="text"
                    value={speciesGeneration.dietaryNeed}
                    onChange={(event) =>
                      updateSpeciesGeneration(
                        "dietaryNeed",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Apparent Age">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={speciesGeneration.apparentAge}
                    onChange={(event) =>
                      updateSpeciesGeneration(
                        "apparentAge",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
                <input
                  type="checkbox"
                  checked={speciesGeneration.isImmortal}
                  onChange={(event) =>
                    updateSpeciesGeneration(
                      "isImmortal",
                      event.currentTarget.checked,
                    )
                  }
                  className="size-3.5 accent-violet-500"
                />
                Immortal or ageless physiology
              </label>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Heritage and Naming
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Cultural background and naming-language cues, kept separate
                  from physical description.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={ethnicityGeneration.region}
                  label="Broad Region"
                  options={ETHNICITY_REGIONS}
                  tone="violet"
                  onSelect={(value) =>
                    updateEthnicityGeneration("region", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={ethnicityGeneration.societalContext}
                  label="Migration Context"
                  options={SOCIETAL_CONTEXTS}
                  tone="sky"
                  onSelect={(value) =>
                    updateEthnicityGeneration("societalContext", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={ethnicityGeneration.linguisticMatrix}
                  label="Naming Language"
                  options={LINGUISTIC_MATRICES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateEthnicityGeneration("linguisticMatrix", value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Cultural Heritage">
                  <input
                    type="text"
                    value={ethnicityGeneration.culturalHeritage}
                    onChange={(event) =>
                      updateEthnicityGeneration(
                        "culturalHeritage",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Native / Ancestral Language">
                  <input
                    type="text"
                    value={ethnicityGeneration.nativeLanguage}
                    onChange={(event) =>
                      updateEthnicityGeneration(
                        "nativeLanguage",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
                <input
                  type="checkbox"
                  checked={ethnicityGeneration.hasDiasporicBaggage}
                  onChange={(event) =>
                    updateEthnicityGeneration(
                      "hasDiasporicBaggage",
                      event.currentTarget.checked,
                    )
                  }
                  className="size-3.5 accent-violet-500"
                />
                Migration or diaspora identity affects the romance conflict
              </label>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Appearance and Race Notes
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Broad race group and appearance notes for respectful,
                  specific description.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MacroButtonGroup
                  activeValue={raceGeneration.macroGroup}
                  label="Broad Race Group"
                  options={RACE_MACRO_GROUPS}
                  tone="violet"
                  onSelect={(value) =>
                    updateRaceGeneration("macroGroup", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={raceGeneration.syncMode}
                  label="Background Match"
                  options={RACE_SYNC_MODES}
                  tone="sky"
                  onSelect={(value) => updateRaceGeneration("syncMode", value)}
                />

                <MacroButtonGroup
                  activeValue={raceGeneration.narrativeStyle}
                  label="Description Style"
                  options={RACE_NARRATIVE_STYLES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateRaceGeneration("narrativeStyle", value)
                  }
                />
              </div>

              <Field label="Appearance Keywords">
                <input
                  type="text"
                  value={raceGeneration.physicalDescriptors.join(", ")}
                  onChange={(event) =>
                    updateRaceGeneration(
                      "physicalDescriptors",
                      event.currentTarget.value
                        .split(",")
                        .map((descriptor) => descriptor.trim())
                        .filter(Boolean),
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>

              <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
                <input
                  type="checkbox"
                  checked={raceGeneration.isCulturallySalient}
                  onChange={(event) =>
                    updateRaceGeneration(
                      "isCulturallySalient",
                      event.currentTarget.checked,
                    )
                  }
                  className="size-3.5 accent-violet-500"
                />
                Race or social dynamics affect the romance conflict
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-zinc-800 pt-4 sm:grid-cols-2">
              <MacroToggleGroup
                activeValues={macroExtension.tones}
                label="Story Tone"
                options={AVAILABLE_TONES}
                tone="violet"
                onToggle={(value) => toggleMacroArrayElement("tones", value)}
              />

              <MacroToggleGroup
                activeValues={macroExtension.micro_tropes}
                label="Romance Tropes"
                options={AVAILABLE_TROPES}
                tone="emerald"
                onToggle={(value) => toggleMacroArrayElement("micro_tropes", value)}
              />
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Card Preview
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Generates a draft opening from the current choices and
                    writes it into this card.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleGeneratePreview()}
                  disabled={previewLoading}
                  className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-50"
                >
                  {previewLoading ? "Generating..." : "Generate Preview"}
                </button>
              </div>

              {previewError ? (
                <p className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-300">
                  {formatPreviewError(previewError)}
                </p>
              ) : null}

              {previewResult ? (
                <CharacterCardPreview
                  cardData={previewResult.meta}
                  greeting={previewResult.greeting}
                />
              ) : null}
            </div>

            <PolishableTextareaField
              label="Personality and Behavior"
              value={activeCard.data.personality}
              onChange={(value) => updateField("personality", value)}
              onPolish={() =>
                openProsePixieForField("personality", "Personality and Behavior")
              }
              className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />

            <PolishableTextareaField
              label="Character Description"
              value={activeCard.data.description}
              onChange={(value) => updateField("description", value)}
              onPolish={() =>
                openProsePixieForField("description", "Character Description")
              }
              className="h-44 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />

            <PolishableTextareaField
              label="Creator Notes"
              value={activeCard.data.creator_notes}
              onChange={(value) => updateField("creator_notes", value)}
              onPolish={() =>
                openProsePixieForField("creator_notes", "Creator Notes")
              }
              className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />
          </div>
        ) : null}

        {activeTab === "behavior" ? (
          <div className="space-y-4">
            <PolishableTextareaField
              label="Current Scene"
              value={activeCard.data.scenario}
              onChange={(value) => updateField("scenario", value)}
              onPolish={() => openProsePixieForField("scenario", "Current Scene")}
              className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Card Compatibility
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Choose the saved-card format, lore depth, and where extra
                  instructions should be placed.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <MacroButtonGroup
                  activeValue={frameworkConfiguration.targetSpecification}
                  label="Saved Card Format"
                  options={FRAMEWORK_TARGET_SPECIFICATIONS}
                  tone="violet"
                  onSelect={(value) =>
                    updateFrameworkConfiguration("targetSpecification", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={frameworkConfiguration.memoryBudgetStrategy}
                  label="Lore Depth"
                  options={FRAMEWORK_MEMORY_BUDGET_STRATEGIES}
                  tone="emerald"
                  onSelect={(value) =>
                    updateFrameworkConfiguration("memoryBudgetStrategy", value)
                  }
                />

                <MacroButtonGroup
                  activeValue={frameworkConfiguration.injectionPipelineRouter}
                  label="Prompt Layout"
                  options={FRAMEWORK_INJECTION_PIPELINE_ROUTERS}
                  tone="sky"
                  onSelect={(value) =>
                    updateFrameworkConfiguration(
                      "injectionPipelineRouter",
                      value,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Compatibility ID">
                  <input
                    type="text"
                    value={frameworkConfiguration.frameworkId}
                    onChange={(event) =>
                      updateFrameworkConfiguration(
                        "frameworkId",
                        event.currentTarget.value,
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                  />
                </Field>

                <Field label="Safety Buffer">
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    value={frameworkConfiguration.globalTokenSafetyBuffer}
                    onChange={(event) =>
                      updateFrameworkConfiguration(
                        "globalTokenSafetyBuffer",
                        Number(event.currentTarget.value),
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <Field label="Card-Level System Prompt">
                <textarea
                  value={frameworkConfiguration.systemPromptJailbreakOverride}
                  onChange={(event) =>
                    updateFrameworkConfiguration(
                      "systemPromptJailbreakOverride",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <EmbeddedLorebookPanel
              document={embeddedLorebookDocument}
              importError={lorebookImportError}
              libraryError={lorebookLibrary.error}
              libraryItems={lorebookLibrary.items}
              libraryLoading={lorebookLibrary.loading}
              selectedLibraryId={embeddedLorebookSourceId}
              onClear={clearEmbeddedLorebook}
              onImportJson={handleImportLorebookJson}
              onRefreshLibrary={lorebookLibrary.refresh}
              onSelectLibraryItem={handleSelectSavedLorebook}
            />

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Creator Notes Read Me
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Player-facing guidance for AI choice, content rating, trigger
                  warnings, and ideal setup.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MacroButtonGroup
                  activeValue={creatorsNotesGeneration.contentRating}
                  label="Content Rating"
                  options={CREATORS_NOTES_CONTENT_RATINGS}
                  tone="violet"
                  onSelect={(value) =>
                    updateCreatorsNotesGeneration("contentRating", value)
                  }
                />

                <Field label="Recommended Models">
                  <input
                    type="text"
                    value={creatorsNotesGeneration.recommendedModels.join(", ")}
                    onChange={(event) =>
                      updateCreatorsNotesGeneration(
                        "recommendedModels",
                        event.currentTarget.value
                          .split(",")
                          .map((model) => model.trim())
                          .filter(Boolean)
                          .slice(0, 5),
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                  />
                </Field>
              </div>

              <Field label="Trigger Warnings">
                <input
                  type="text"
                  value={creatorsNotesGeneration.triggerWarnings.join(", ")}
                  onChange={(event) =>
                    updateCreatorsNotesGeneration(
                      "triggerWarnings",
                      event.currentTarget.value
                        .split(",")
                        .map((warning) => warning.trim())
                        .filter(Boolean)
                        .slice(0, 12),
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Ideal User Persona">
                <textarea
                  value={creatorsNotesGeneration.idealUserPersona}
                  onChange={(event) =>
                    updateCreatorsNotesGeneration(
                      "idealUserPersona",
                      event.currentTarget.value,
                    )
                  }
                  className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Technical Notes">
                <textarea
                  value={creatorsNotesGeneration.technicalNotesText}
                  onChange={(event) =>
                    updateCreatorsNotesGeneration(
                      "technicalNotesText",
                      event.currentTarget.value,
                    )
                  }
                  className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <PolishableTextareaField
              label="Example Messages"
              value={activeCard.data.mes_example}
              onChange={(value) => updateField("mes_example", value)}
              onPolish={() =>
                openProsePixieForField("mes_example", "Example Messages")
              }
              className="h-32 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />

            <PolishableTextareaField
              label="Main System Prompt"
              value={activeCard.data.system_prompt}
              onChange={(value) => updateField("system_prompt", value)}
              onPolish={() =>
                openProsePixieForField("system_prompt", "Main System Prompt")
              }
              className="h-32 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Chat Memory Rules
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Reminders that help long chats keep personality, pacing, and
                  formatting steady.
                </p>
              </div>

              <Field label="Memory Strength">
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={postHistoryInstructionsGeneration.injectionTokenWeight}
                  onChange={(event) =>
                    updatePostHistoryInstructionsGeneration(
                      "injectionTokenWeight",
                      Number(event.currentTarget.value),
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Stay-in-Character Rules">
                <textarea
                  value={postHistoryInstructionsGeneration.driftControlRules.join(
                    "\n",
                  )}
                  onChange={(event) =>
                    updatePostHistoryInstructionsGeneration(
                      "driftControlRules",
                      event.currentTarget.value
                        .split("\n")
                        .map((rule) => rule.trim())
                        .filter(Boolean)
                        .slice(0, 8),
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Tone Shift Rules">
                <textarea
                  value={postHistoryInstructionsGeneration.dynamicToneModifiers.join(
                    "\n",
                  )}
                  onChange={(event) =>
                    updatePostHistoryInstructionsGeneration(
                      "dynamicToneModifiers",
                      event.currentTarget.value
                        .split("\n")
                        .map((modifier) => modifier.trim())
                        .filter(Boolean)
                        .slice(0, 8),
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>

              <Field label="Formatting Rules">
                <textarea
                  value={postHistoryInstructionsGeneration.formattingHardlines.join(
                    "\n",
                  )}
                  onChange={(event) =>
                    updatePostHistoryInstructionsGeneration(
                      "formattingHardlines",
                      event.currentTarget.value
                        .split("\n")
                        .map((hardline) => hardline.trim())
                        .filter(Boolean)
                        .slice(0, 8),
                    )
                  }
                  className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                />
              </Field>
            </div>

            <PolishableTextareaField
              label="After-Chat Instructions"
              value={activeCard.data.post_history_instructions}
              onChange={(value) => updateField("post_history_instructions", value)}
              onPolish={() =>
                openProsePixieForField(
                  "post_history_instructions",
                  "After-Chat Instructions",
                )
              }
              className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />
          </div>
        ) : null}

        {activeTab === "greetings" ? (
          <div className="space-y-5">
            <PolishableTextareaField
              label="Primary First Message"
              value={activeCard.data.first_mes}
              onChange={(value) => updateField("first_mes", value)}
              onPolish={() =>
                openProsePixieForField("first_mes", "Primary First Message")
              }
              className="h-32 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
            />

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Alternate Greetings
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Extra openings that keep the same character but start from a
                  different angle.
                </p>
              </div>

              <div className="space-y-3">
                {alternateGreetingGeneration.slice(0, 5).map((fork, index) => (
                  <div
                    key={fork.greetingId}
                    className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                      <MacroButtonGroup
                        activeValue={fork.forkType}
                        label={`Alternate ${index + 1}`}
                        options={ALTERNATE_GREETING_FORK_TYPES}
                        tone="violet"
                        onSelect={(value) =>
                          updateAlternateGreetingGeneration(index, {
                            forkType: value,
                          })
                        }
                      />

                      <Field label="Trope">
                        <input
                          type="text"
                          value={fork.associatedTrope}
                          onChange={(event) =>
                            updateAlternateGreetingGeneration(index, {
                              associatedTrope: event.currentTarget.value,
                            })
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                        />
                      </Field>

                      <Field label="Greeting ID">
                        <input
                          type="text"
                          value={fork.greetingId}
                          onChange={(event) =>
                            updateAlternateGreetingGeneration(index, {
                              greetingId: event.currentTarget.value,
                            })
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                        />
                      </Field>
                    </div>

                    <Field label="Generation Notes">
                      <textarea
                        value={fork.aiGenerationDirective}
                        onChange={(event) =>
                          updateAlternateGreetingGeneration(index, {
                            aiGenerationDirective: event.currentTarget.value,
                          })
                        }
                        className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Scenario-Based Openings
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Pair an alternate scene setup with the first message that
                  belongs to it.
                </p>
              </div>

              <div className="space-y-3">
                {scenarioOpeningPairGeneration
                  .slice(0, 5)
                  .map((pair, index) => (
                    <div
                      key={pair.pairId}
                      className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                    >
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                        <MacroButtonGroup
                          activeValue={pair.classificationType}
                          label={`Scenario ${index + 1}`}
                          options={SCENARIO_OPENING_PAIR_CLASSIFICATIONS}
                          tone="violet"
                          onSelect={(value) =>
                            updateScenarioOpeningPairGeneration(index, {
                              classificationType: value,
                            })
                          }
                        />

                        <Field label="Scenario Title">
                          <input
                            type="text"
                            value={pair.pairTitle}
                            onChange={(event) =>
                              updateScenarioOpeningPairGeneration(index, {
                                pairTitle: event.currentTarget.value,
                              })
                            }
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                          />
                        </Field>

                        <Field label="Scenario ID">
                          <input
                            type="text"
                            value={pair.pairId}
                            onChange={(event) =>
                              updateScenarioOpeningPairGeneration(index, {
                                pairId: event.currentTarget.value,
                              })
                            }
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                          />
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                        <MacroButtonGroup
                          activeValue={pair.alternateScenarioContext.settingType}
                          label="Setting"
                          options={SCENARIO_SETTING_TYPES}
                          tone="emerald"
                          onSelect={(value) =>
                            updateScenarioOpeningPairScenario(index, {
                              settingType: value,
                            })
                          }
                        />

                        <MacroButtonGroup
                          activeValue={pair.alternateScenarioContext.plotHook}
                          label="Plot Hook"
                          options={SCENARIO_PLOT_HOOKS}
                          tone="sky"
                          onSelect={(value) =>
                            updateScenarioOpeningPairScenario(index, {
                              plotHook: value,
                            })
                          }
                        />

                        <MacroButtonGroup
                          activeValue={
                            pair.alternateScenarioContext.startingTension
                          }
                          label="Starting Mood"
                          options={SCENARIO_STARTING_TENSIONS}
                          tone="violet"
                          onSelect={(value) =>
                            updateScenarioOpeningPairScenario(index, {
                              startingTension: value,
                            })
                          }
                        />
                      </div>

                      <Field label="Sensory Details">
                        <input
                          type="text"
                          value={pair.alternateScenarioContext.sensoryDetails.join(
                            ", ",
                          )}
                          onChange={(event) =>
                            updateScenarioOpeningPairScenario(index, {
                              sensoryDetails: event.currentTarget.value
                                .split(",")
                                .map((detail) => detail.trim())
                                .filter(Boolean),
                            })
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                        />
                      </Field>

                      <Field label="Scene Premise">
                        <textarea
                          value={
                            pair.alternateScenarioContext
                              .scenePremiseDescription
                          }
                          onChange={(event) =>
                            updateScenarioOpeningPairScenario(index, {
                              scenePremiseDescription:
                                event.currentTarget.value,
                            })
                          }
                          className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                        />
                      </Field>

                      <Field label="Alternate First Message">
                        <textarea
                          value={pair.alternateFirstMessage}
                          onChange={(event) =>
                            updateScenarioOpeningPairGeneration(index, {
                              alternateFirstMessage:
                                event.currentTarget.value,
                            })
                          }
                          className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                        />
                      </Field>
                    </div>
                  ))}
              </div>
            </div>

            <GreetingList
              addLabel="Add alternate greeting"
              emptyLabel="No alternate variations defined for this character."
              greetings={activeCard.data.alternate_greetings}
              inputValue={newAlternateGreeting}
              label="Saved Alternate Greetings"
              onAdd={handleAddAlternateGreeting}
              onInputChange={setNewAlternateGreeting}
              onRemove={handleRemoveAlternateGreeting}
            />

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Group Chat Openings
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Openings for scenes with more than one character in the room.
                </p>
              </div>

              <div className="space-y-3">
                {groupGreetingGeneration.slice(0, 5).map((group, index) => (
                  <div
                    key={group.greetingId}
                    className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                      <MacroButtonGroup
                        activeValue={group.spotlightDistribution}
                        label={`Group scene ${index + 1}`}
                        options={GROUP_GREETING_SPOTLIGHT_DISTRIBUTIONS}
                        tone="violet"
                        onSelect={(value) =>
                          updateGroupGreetingGeneration(index, {
                            spotlightDistribution: value,
                          })
                        }
                      />

                      <MacroButtonGroup
                        activeValue={group.interpersonalDynamic}
                        label="Group Dynamic"
                        options={GROUP_GREETING_INTERPERSONAL_DYNAMICS}
                        tone="emerald"
                        onSelect={(value) =>
                          updateGroupGreetingGeneration(index, {
                            interpersonalDynamic: value,
                          })
                        }
                      />

                      <MacroButtonGroup
                        activeValue={group.formattingStyle}
                        label="Formatting"
                        options={GROUP_GREETING_FORMATTING_STYLES}
                        tone="sky"
                        onSelect={(value) =>
                          updateGroupGreetingGeneration(index, {
                            formattingStyle: value,
                          })
                        }
                      />
                    </div>

                    <Field label="Characters in Scene">
                      <input
                        type="text"
                        value={group.participatingCharacters.join(", ")}
                        onChange={(event) =>
                          updateGroupGreetingGeneration(index, {
                            participatingCharacters: event.currentTarget.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean)
                              .slice(0, 4),
                          })
                        }
                        className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                      />
                    </Field>

                    <Field label="Group Scene Notes">
                      <textarea
                        value={group.aiGroupDirective}
                        onChange={(event) =>
                          updateGroupGreetingGeneration(index, {
                            aiGroupDirective: event.currentTarget.value,
                          })
                        }
                        className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Group Alternate Worlds
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  AU versions of the group setup that keep the cast dynamics
                  intact.
                </p>
              </div>

              <div className="space-y-3">
                {groupAlternateGreetingGeneration
                  .slice(0, 5)
                  .map((fork, index) => (
                    <div
                      key={fork.altGreetingId}
                      className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                    >
                      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                        <MacroButtonGroup
                          activeValue={fork.forkCategory}
                          label={`Group AU ${index + 1}`}
                          options={GROUP_ALTERNATE_GREETING_FORK_CATEGORIES}
                          tone="violet"
                          onSelect={(value) =>
                            updateGroupAlternateGreetingGeneration(index, {
                              forkCategory: value,
                            })
                          }
                        />

                        <Field label="Target Setting">
                          <input
                            type="text"
                            value={fork.targetSettingVibe}
                            onChange={(event) =>
                              updateGroupAlternateGreetingGeneration(index, {
                                targetSettingVibe: event.currentTarget.value,
                              })
                            }
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                          />
                        </Field>

                        <Field label="Alternate ID">
                          <input
                            type="text"
                            value={fork.altGreetingId}
                            onChange={(event) =>
                              updateGroupAlternateGreetingGeneration(index, {
                                altGreetingId: event.currentTarget.value,
                              })
                            }
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-400 outline-none focus:border-violet-500"
                          />
                        </Field>
                      </div>

                      <Field label="Included Characters">
                        <input
                          type="text"
                          value={fork.includedNpcNames.join(", ")}
                          onChange={(event) =>
                            updateGroupAlternateGreetingGeneration(index, {
                              includedNpcNames: event.currentTarget.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean)
                                .slice(0, 4),
                            })
                          }
                          className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                        />
                      </Field>

                      <Field label="Multi-Character Notes">
                        <textarea
                          value={fork.aiMultiCharacterPrompt}
                          onChange={(event) =>
                            updateGroupAlternateGreetingGeneration(index, {
                              aiMultiCharacterPrompt: event.currentTarget.value,
                            })
                          }
                          className="h-20 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 outline-none focus:border-violet-500"
                        />
                      </Field>
                    </div>
                  ))}
              </div>
            </div>

            <GreetingList
              addLabel="Add group greeting"
              emptyLabel="No group-only openings defined for this character."
              greetings={activeCard.data.group_only_greetings}
              inputValue={newGroupGreeting}
              label="Saved Group-Only Greetings"
              onAdd={handleAddGroupGreeting}
              onInputChange={setNewGroupGreeting}
              onRemove={handleRemoveGroupGreeting}
            />
          </div>
        ) : null}
      </div>
    </section>
    <ProsePixieModal
      adultModeEnabled={prosePixieAdultModeEnabled}
      target={prosePixieTarget}
      onApply={applyProsePixieDraft}
      onClose={() => setProsePixieTarget(null)}
    />
    </>
  );
}

function EmbeddedLorebookPanel({
  document,
  importError,
  libraryError,
  libraryItems,
  libraryLoading,
  onClear,
  onImportJson,
  onRefreshLibrary,
  onSelectLibraryItem,
  selectedLibraryId,
}: {
  document: LorebookV3Document | null;
  importError: string | null;
  libraryError: string | null;
  libraryItems: GeneratedLorebookArtifact[];
  libraryLoading: boolean;
  onClear: () => void;
  onImportJson: (event: ChangeEvent<HTMLInputElement>) => void;
  onRefreshLibrary: () => void;
  onSelectLibraryItem: (lorebookId: string) => void;
  selectedLibraryId: string;
}) {
  const activeEntries = document?.data.entries.filter((entry) => entry.enabled) ?? [];
  const tokenBudget = document?.data.token_budget ?? estimateLorebookTokenBudget(document);

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Linked Lorebook
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500">
            Attach an existing lorebook JSON to embed as this character card&apos;s
            lore file. Create or edit entries in Lorebook Studio.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshLibrary}
          className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
        >
          Rescan saved lorebooks
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <Field label={`Saved Lorebook (${libraryItems.length})`}>
          <select
            value={selectedLibraryId}
            disabled={libraryLoading || libraryItems.length === 0}
            onChange={(event) => onSelectLibraryItem(event.currentTarget.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:text-zinc-600"
          >
            <option value="">
              {libraryLoading
                ? "Loading saved lorebooks..."
                : "Choose a saved lorebook to embed"}
            </option>
            {libraryItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.entries.length} entries)
              </option>
            ))}
          </select>
        </Field>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-zinc-300 transition hover:border-violet-500/40 hover:text-violet-200">
          <Upload className="size-4" />
          Upload JSON
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onImportJson}
          />
        </label>
      </div>

      {libraryError ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] text-amber-200">
          {libraryError}
        </p>
      ) : null}

      {importError ? (
        <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] text-rose-200">
          {importError}
        </p>
      ) : null}

      {document ? (
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <BookOpen className="size-4 shrink-0 text-violet-300" />
                <h4 className="truncate text-sm font-bold text-zinc-100">
                  {document.data.name ?? "Embedded lorebook"}
                </h4>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                {document.data.description ??
                  "This lorebook will be written into the exported character card."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition hover:border-rose-500/30 hover:text-rose-300"
            >
              <X className="size-3.5" />
              Unlink
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-3">
            <LorebookMetric label="Entries" value={document.data.entries.length} />
            <LorebookMetric label="Active" value={activeEntries.length} />
            <LorebookMetric label="Token Budget" value={tokenBudget} />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/50 p-4 text-xs text-zinc-500">
          No lorebook linked. The character card will export without embedded
          lorebook entries unless you select a saved lorebook or upload a JSON file.
        </div>
      )}
    </div>
  );
}

function LorebookMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm font-bold text-zinc-200">
        {value}
      </div>
    </div>
  );
}

function PolishableTextareaField({
  className,
  label,
  onChange,
  onPolish,
  value,
}: {
  className: string;
  label: string;
  onChange: (value: string) => void;
  onPolish: () => void;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        <button
          type="button"
          onClick={onPolish}
          className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-500/20"
          title={`Open Prose Pixie for ${label}`}
        >
          <WandSparkles className="size-3.5" />
          Rewrite
        </button>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className={className}
      />
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function CharacterCreationFormPanel({
  form,
  onAddTargetOverride,
  onBooleanChange,
  onRemoveTargetOverride,
  onSeedSelect,
  onTextChange,
}: {
  form: CharacterCreationForm;
  onAddTargetOverride: () => void;
  onBooleanChange: (path: CharacterCreationFormPath, value: boolean) => void;
  onRemoveTargetOverride: (index: number) => void;
  onSeedSelect: (entry: SeedPickerEntry) => void;
  onTextChange: (path: CharacterCreationFormPath, value: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-200">
          One-Form Character Creator
        </h3>
      </div>

      <SearchableSeedPicker
        className="border-violet-500/20 bg-zinc-950/60"
        description="Select a structured seed to prefill editable creator fields or add internal semantic guidance."
        kinds={["preset", "semantic", "vocabulary"]}
        label="Seed Template Injector"
        lanes={["appearance", "personality", "world", "image", "semantic"]}
        maxResults={8}
        onSelect={onSeedSelect}
        placeholder="Try fear of replacement, copper curls, slow burn, vampire..."
        selectedKeys={form.semanticSeedIds}
      />

      {CHARACTER_CREATION_FORM_FIELD_GROUPS.map((group, index) => (
        <CharacterCreationDetailsSection
          key={group.label}
          fields={group.fields}
          form={form}
          label={group.label}
          open={index === 0}
          onTextChange={onTextChange}
        />
      ))}

      <details className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
        <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Adult Anatomy
        </summary>
        <div className="mt-4 space-y-4">
          <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-300">
            <input
              type="checkbox"
              checked={form.adultAnatomy.isNsfwAdultCard}
              onChange={(event) =>
                onBooleanChange(
                  ["adultAnatomy", "isNsfwAdultCard"],
                  event.currentTarget.checked,
                )
              }
              className="size-3.5 accent-violet-500"
            />
            NSFW adult anatomy enabled
          </label>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {CHARACTER_CREATION_ADULT_ANATOMY_FIELDS.map((field) => (
              <CharacterCreationTextControl
                key={field.path.join(".")}
                field={field}
                form={form}
                onTextChange={onTextChange}
              />
            ))}
          </div>
        </div>
      </details>

      <details className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
        <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Relationship Target Overrides
        </summary>
        <div className="mt-4 space-y-3">
          {form.relationships.targetOverrides.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-500">
              No target-specific overrides yet.
            </p>
          ) : null}

          {form.relationships.targetOverrides.map((override, index) => (
            <div
              key={`${override.targetId}-${index}`}
              className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Override {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveTargetOverride(index)}
                  className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-200 transition hover:bg-rose-500/20"
                  title="Remove target override"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </div>

              <CharacterCreationTextControl
                field={{
                  label: "Target ID",
                  path: ["relationships", "targetOverrides", index, "targetId"],
                }}
                form={form}
                onTextChange={onTextChange}
              />
              <CharacterCreationTextControl
                field={{
                  label: "Contextual Prompt Injection",
                  path: [
                    "relationships",
                    "targetOverrides",
                    index,
                    "contextualPromptInjection",
                  ],
                  kind: "textarea",
                }}
                form={form}
                onTextChange={onTextChange}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={onAddTargetOverride}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-500/20"
          >
            <Plus className="size-4" />
            Add Target Override
          </button>
        </div>
      </details>
    </div>
  );
}

function CharacterCreationDetailsSection({
  fields,
  form,
  label,
  onTextChange,
  open,
}: {
  fields: CharacterCreationFormTextField[];
  form: CharacterCreationForm;
  label: string;
  onTextChange: (path: CharacterCreationFormPath, value: string) => void;
  open: boolean;
}) {
  return (
    <details
      className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
      open={open}
    >
      <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </summary>
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        {fields.map((field) => (
          <CharacterCreationTextControl
            key={field.path.join(".")}
            field={field}
            form={form}
            onTextChange={onTextChange}
          />
        ))}
      </div>
    </details>
  );
}

function CharacterCreationTextControl({
  field,
  form,
  onTextChange,
}: {
  field: CharacterCreationFormTextField;
  form: CharacterCreationForm;
  onTextChange: (path: CharacterCreationFormPath, value: string) => void;
}) {
  const value = readCharacterCreationFormTextPath(form, field.path);
  const className =
    "rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-200 outline-none focus:border-violet-500";

  return (
    <Field label={field.label}>
      {field.kind === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onTextChange(field.path, event.currentTarget.value)}
          className={`${className} min-h-20 resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onTextChange(field.path, event.currentTarget.value)}
          className={className}
        />
      )}
    </Field>
  );
}

function MacroButtonGroup<Value extends string>({
  activeValue,
  label,
  onSelect,
  options,
  tone,
}: {
  activeValue: string;
  label: string;
  onSelect: (value: Value) => void;
  options: readonly Value[];
  tone: "emerald" | "sky" | "violet";
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {options.map((option) => {
          const isActive = activeValue === option;
          const labelText = humanizeOptionLabel(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`min-w-0 rounded-md border px-3 py-2 text-left text-[11px] font-semibold leading-snug transition ${
                isActive
                  ? activeMacroClassName(tone)
                  : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300"
              }`}
              title={labelText}
            >
              <span className="block break-words">
                {labelText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MacroToggleGroup({
  activeValues,
  label,
  onToggle,
  options,
  tone,
}: {
  activeValues: string[];
  label: string;
  onToggle: (value: string) => void;
  options: string[];
  tone: "emerald" | "violet";
}) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = activeValues.includes(option);
          const labelText = humanizeOptionLabel(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`min-w-0 rounded-full border px-3 py-1 text-[10px] font-medium leading-snug transition ${
                isActive
                  ? activeMacroClassName(tone)
                  : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300"
              }`}
              title={labelText}
            >
              {labelText}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GreetingList({
  addLabel,
  emptyLabel,
  greetings,
  inputValue,
  label,
  onAdd,
  onInputChange,
  onRemove,
}: {
  addLabel: string;
  emptyLabel: string;
  greetings: string[];
  inputValue: string;
  label: string;
  onAdd: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3 border-t border-zinc-800 pt-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </h3>

      <form onSubmit={onAdd} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => onInputChange(event.currentTarget.value)}
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          title={addLabel}
        >
          <Plus className="size-4" />
        </button>
      </form>

      {greetings.length === 0 ? (
        <p className="text-[11px] italic text-zinc-600">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">
          {greetings.map((greeting, index) => (
            <div
              key={`${index}-${greeting}`}
              className="group flex items-start gap-3 rounded-lg border border-zinc-900 bg-zinc-950 p-3"
            >
              <span className="mt-0.5 select-none font-mono text-[10px] text-zinc-600">
                #{index + 1}
              </span>
              <p className="flex-1 break-words font-mono text-xs leading-relaxed text-zinc-400">
                {greeting}
              </p>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex size-7 items-center justify-center rounded border border-transparent text-zinc-600 transition hover:border-rose-500/20 hover:bg-rose-500/5 hover:text-rose-400"
                title="Remove greeting"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatPreviewError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid character build request.")) {
    return message;
  }

  if (normalizedMessage.includes("string did not match the expected pattern")) {
    return "Some of the current choices do not fit the preview builder yet. Check IDs, empty fields, and generated shortcuts, then try again.";
  }

  return message;
}

function readEmbeddedLorebookDocument(
  card: ValidatedCharacterCardV3,
): LorebookV3Document | null {
  if (!card.data.character_book) {
    return null;
  }

  try {
    return createLorebookV3Document(card.data.character_book as LorebookV3);
  } catch {
    return null;
  }
}

function readEmbeddedLorebookSourceId(card: ValidatedCharacterCardV3) {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const embeddedLorebook = namespace.embedded_lorebook;

  return isRecord(embeddedLorebook) &&
    typeof embeddedLorebook.sourceId === "string"
    ? embeddedLorebook.sourceId
    : "";
}

function createDetachedLorebookSummary(): LorebookSummaryGenerationExtension {
  return {
    aiLoreInstruction:
      "No embedded lorebook is attached. Do not inject standalone lorebook facts.",
    factionOrDynastyContext:
      "No separate lorebook context is linked to this character card.",
    tokenOptimizationCap: 50,
    universeAnchor: "No Embedded Lorebook",
    worldSystemRules: ["Use only the character card fields and active scene."],
  };
}

function createLorebookSummaryFromDocument(
  document: LorebookV3Document,
): LorebookSummaryGenerationExtension {
  const enabledEntries = document.data.entries.filter((entry) => entry.enabled);
  const worldSystemRules = enabledEntries
    .map((entry) => entry.name ?? entry.comment ?? String(entry.id ?? "Lore entry"))
    .filter(Boolean)
    .slice(0, 4);
  const fallbackDescription =
    document.data.description ??
    `Embedded lorebook with ${document.data.entries.length} entries.`;

  return {
    aiLoreInstruction: fallbackDescription,
    factionOrDynastyContext: fallbackDescription,
    tokenOptimizationCap: Math.max(
      50,
      Math.min(1_000, document.data.token_budget ?? estimateLorebookTokenBudget(document)),
    ),
    universeAnchor: document.data.name ?? "Embedded Lorebook",
    worldSystemRules: worldSystemRules.length
      ? worldSystemRules
      : ["Use the embedded lorebook only when activation keys match."],
  };
}

function createLoreEntriesFromDocument(
  document: LorebookV3Document,
): LoreEntryGenerationExtension[] {
  return document.data.entries
    .filter((entry) => entry.enabled)
    .map((entry, index) => {
      const title = entry.name ?? entry.comment ?? `Lore entry ${index + 1}`;
      const entryId =
        typeof entry.id === "string" && isUuidString(entry.id)
          ? entry.id
          : createStableEmbeddedLoreEntryId(title, entry.content, index);
      const fallbackKey = title.trim() || `lore ${index + 1}`;
      const activationKeys = (
        entry.keys.length ? entry.keys : entry.secondary_keys ?? [fallbackKey]
      )
        .map((key) => key.trim())
        .filter(Boolean)
        .slice(0, 12);
      const insertionPriority: LoreEntryInsertionPriority = entry.constant
        ? "Constant_Anchor"
        : entry.selective
          ? "Recursive_Linked"
          : "Reactive_Contextual";

      return {
        activationKeys: activationKeys.length ? activationKeys : [fallbackKey],
        domainScope: readLoreEntryDomainScope(
          isRecord(entry.extensions.heartwriteai)
            ? entry.extensions.heartwriteai.entryKind
            : undefined,
        ),
        entryContent: entry.content,
        entryId,
        insertionPriority,
        title,
        tokenReserveCost: Math.max(
          25,
          Math.min(1_000, Math.ceil(entry.content.length / 4)),
        ),
      };
    })
    .slice(0, 20);
}

function createStableEmbeddedLoreEntryId(
  title: string,
  content: string,
  index: number,
) {
  const source = `${title}:${content}:${index}`;
  let hash = 0;

  for (let charIndex = 0; charIndex < source.length; charIndex += 1) {
    hash = (hash * 53 + source.charCodeAt(charIndex)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-5555-4000-8000-000000000000`;
}

function estimateLorebookTokenBudget(document: LorebookV3Document | null) {
  if (!document) {
    return 0;
  }

  return Math.max(
    50,
    Math.ceil(
      document.data.entries.reduce(
        (total, entry) => total + entry.content.length / 4,
        0,
      ),
    ),
  );
}

function readMacroExtension(
  extensions: Record<string, unknown>,
): AppMacroExtensions {
  const namespace = readExtensionNamespace(
    extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawMacro = namespace.macro ?? namespace;

  if (!isRecord(rawMacro)) {
    return DEFAULT_MACRO_EXTENSION;
  }

  return {
    framework: readString(rawMacro.framework, DEFAULT_MACRO_EXTENSION.framework),
    formatting: readString(rawMacro.formatting, DEFAULT_MACRO_EXTENSION.formatting),
    relationship: readString(
      rawMacro.relationship,
      DEFAULT_MACRO_EXTENSION.relationship,
    ),
    tones: readStringArray(rawMacro.tones),
    micro_tropes: readStringArray(rawMacro.micro_tropes),
  };
}

function readCharacterCreationFormExtension(
  card: ValidatedCharacterCardV3,
): CharacterCreationForm {
  try {
    return parseCharacterCreationForm(
      card.data.extensions[HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY],
    );
  } catch {
    return createEmptyCharacterCreationForm();
  }
}

function readNameGenerationExtension(
  card: ValidatedCharacterCardV3,
): NameGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawNameGeneration = namespace.name_generation;

  if (!isRecord(rawNameGeneration)) {
    return {
      ...DEFAULT_NAME_GENERATION,
      ...readNamePartsFromCardName(card.data.name),
    };
  }

  return {
    firstname: readString(
      rawNameGeneration.firstname,
      readNamePartsFromCardName(card.data.name).firstname,
    ),
    surname: readString(
      rawNameGeneration.surname,
      readNamePartsFromCardName(card.data.name).surname,
    ),
    title: readString(rawNameGeneration.title, DEFAULT_NAME_GENERATION.title),
    alias: readString(rawNameGeneration.alias, DEFAULT_NAME_GENERATION.alias),
    heritage: readString(
      rawNameGeneration.heritage,
      DEFAULT_NAME_GENERATION.heritage,
    ),
    era: readString(rawNameGeneration.era, DEFAULT_NAME_GENERATION.era),
    aura: readString(rawNameGeneration.aura, DEFAULT_NAME_GENERATION.aura),
    composition: readString(
      rawNameGeneration.composition,
      DEFAULT_NAME_GENERATION.composition,
    ),
  };
}

function readAgeGenerationExtension(
  card: ValidatedCharacterCardV3,
): AgeGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawAgeGeneration = namespace.age_generation;

  if (!isRecord(rawAgeGeneration)) {
    return DEFAULT_AGE_GENERATION;
  }

  return {
    age: readString(rawAgeGeneration.age, DEFAULT_AGE_GENERATION.age),
    apparent_age: readString(
      rawAgeGeneration.apparent_age,
      DEFAULT_AGE_GENERATION.apparent_age,
    ),
    birth_year: readString(
      rawAgeGeneration.birth_year,
      DEFAULT_AGE_GENERATION.birth_year,
    ),
    birth_month: readString(
      rawAgeGeneration.birth_month,
      DEFAULT_AGE_GENERATION.birth_month,
    ),
    birth_day: readString(
      rawAgeGeneration.birth_day,
      DEFAULT_AGE_GENERATION.birth_day,
    ),
    zodiac: readString(rawAgeGeneration.zodiac, DEFAULT_AGE_GENERATION.zodiac),
    developmental_stage: readString(
      rawAgeGeneration.developmental_stage,
      DEFAULT_AGE_GENERATION.developmental_stage,
    ),
    legal_status: readString(
      rawAgeGeneration.legal_status,
      DEFAULT_AGE_GENERATION.legal_status,
    ),
    power_dynamic: readString(
      rawAgeGeneration.power_dynamic,
      DEFAULT_AGE_GENERATION.power_dynamic,
    ),
    temporal_anchor: readString(
      rawAgeGeneration.temporal_anchor,
      DEFAULT_AGE_GENERATION.temporal_anchor,
    ),
    zodiac_alignment: readString(
      rawAgeGeneration.zodiac_alignment,
      DEFAULT_AGE_GENERATION.zodiac_alignment,
    ),
    seasonal_vibe: readString(
      rawAgeGeneration.seasonal_vibe,
      DEFAULT_AGE_GENERATION.seasonal_vibe,
    ),
    birthdate_preset: readString(
      rawAgeGeneration.birthdate_preset,
      DEFAULT_AGE_GENERATION.birthdate_preset,
    ),
  };
}

function readKinkGenerationExtension(
  card: ValidatedCharacterCardV3,
): KinkGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawKinkGeneration = namespace.kink_generation;

  if (!isRecord(rawKinkGeneration)) {
    return DEFAULT_KINK_GENERATION;
  }

  return {
    intensityLevel: readKinkIntensityLevel(rawKinkGeneration.intensityLevel),
    nsfwEnabled: readBoolean(
      rawKinkGeneration.nsfwEnabled,
      DEFAULT_KINK_GENERATION.nsfwEnabled,
    ),
    preferredSensoryTags: readStringArray(
      rawKinkGeneration.preferredSensoryTags,
    ),
    primaryRole: readKinkPrimaryRole(rawKinkGeneration.primaryRole),
    systemPromptInstruction: readString(
      rawKinkGeneration.systemPromptInstruction,
      DEFAULT_KINK_GENERATION.systemPromptInstruction,
    ),
  };
}

function readAlternateGreetingGenerationExtension(
  card: ValidatedCharacterCardV3,
): AlternateGreetingGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawAlternateGreetingGeneration =
    namespace.alternate_greeting_generation;

  if (!Array.isArray(rawAlternateGreetingGeneration)) {
    return DEFAULT_ALTERNATE_GREETING_GENERATION;
  }

  const parsed = rawAlternateGreetingGeneration
    .filter(isRecord)
    .map((alternateGreeting, index) => ({
      aiGenerationDirective: readString(
        alternateGreeting.aiGenerationDirective,
        DEFAULT_ALTERNATE_GREETING_GENERATION[index]
          ?.aiGenerationDirective ??
          DEFAULT_ALTERNATE_GREETING_GENERATION[0].aiGenerationDirective,
      ),
      associatedTrope: readString(
        alternateGreeting.associatedTrope,
        DEFAULT_ALTERNATE_GREETING_GENERATION[index]?.associatedTrope ??
          DEFAULT_ALTERNATE_GREETING_GENERATION[0].associatedTrope,
      ),
      completedGreeting: readString(alternateGreeting.completedGreeting, ""),
      forkType: readAlternateGreetingForkType(alternateGreeting.forkType),
      greetingId: readUuidString(
        alternateGreeting.greetingId,
        DEFAULT_ALTERNATE_GREETING_GENERATION[index]?.greetingId ??
          DEFAULT_ALTERNATE_GREETING_GENERATION[0].greetingId,
      ),
    }))
    .slice(0, 5);

  return parsed.length ? parsed : DEFAULT_ALTERNATE_GREETING_GENERATION;
}

function readGroupGreetingGenerationExtension(
  card: ValidatedCharacterCardV3,
): GroupGreetingGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawGroupGreetingGeneration = namespace.group_greeting_generation;

  if (!Array.isArray(rawGroupGreetingGeneration)) {
    return DEFAULT_GROUP_GREETING_GENERATION;
  }

  const parsed = rawGroupGreetingGeneration
    .filter(isRecord)
    .map((groupGreeting, index) => ({
      aiGroupDirective: readString(
        groupGreeting.aiGroupDirective,
        DEFAULT_GROUP_GREETING_GENERATION[index]?.aiGroupDirective ??
          DEFAULT_GROUP_GREETING_GENERATION[0].aiGroupDirective,
      ),
      completedGreeting: readString(groupGreeting.completedGreeting, ""),
      formattingStyle: readGroupGreetingFormattingStyle(
        groupGreeting.formattingStyle,
      ),
      greetingId: readUuidString(
        groupGreeting.greetingId,
        DEFAULT_GROUP_GREETING_GENERATION[index]?.greetingId ??
          DEFAULT_GROUP_GREETING_GENERATION[0].greetingId,
      ),
      interpersonalDynamic: readGroupGreetingInterpersonalDynamic(
        groupGreeting.interpersonalDynamic,
      ),
      participatingCharacters: readStringArray(
        groupGreeting.participatingCharacters,
      ).slice(0, 4),
      spotlightDistribution: readGroupGreetingSpotlightDistribution(
        groupGreeting.spotlightDistribution,
      ),
    }))
    .filter((groupGreeting) => groupGreeting.participatingCharacters.length >= 2)
    .slice(0, 5);

  return parsed.length ? parsed : DEFAULT_GROUP_GREETING_GENERATION;
}

function readGroupAlternateGreetingGenerationExtension(
  card: ValidatedCharacterCardV3,
): GroupAlternateGreetingGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawGroupAlternateGreetingGeneration =
    namespace.group_alternate_greeting_generation;

  if (!Array.isArray(rawGroupAlternateGreetingGeneration)) {
    return DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION;
  }

  const parsed = rawGroupAlternateGreetingGeneration
    .filter(isRecord)
    .map((fork, index) => ({
      aiMultiCharacterPrompt: readString(
        fork.aiMultiCharacterPrompt,
        DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[index]
          ?.aiMultiCharacterPrompt ??
          DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[0].aiMultiCharacterPrompt,
      ),
      altGreetingId: readUuidString(
        fork.altGreetingId,
        DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[index]?.altGreetingId ??
          DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[0].altGreetingId,
      ),
      completedGreeting: readString(fork.completedGreeting, ""),
      forkCategory: readGroupAlternateGreetingForkCategory(fork.forkCategory),
      includedNpcNames: readStringArray(fork.includedNpcNames).slice(0, 4),
      targetSettingVibe: readString(
        fork.targetSettingVibe,
        DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[index]
          ?.targetSettingVibe ??
          DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[0].targetSettingVibe,
      ),
    }))
    .filter((fork) => fork.includedNpcNames.length >= 2)
    .slice(0, 5);

  return parsed.length ? parsed : DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION;
}

function readFetishGenerationExtension(
  card: ValidatedCharacterCardV3,
): FetishGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawFetishGeneration = namespace.fetish_generation;

  if (!isRecord(rawFetishGeneration)) {
    return DEFAULT_FETISH_GENERATION;
  }

  return {
    aiDescriptiveFocus: readString(
      rawFetishGeneration.aiDescriptiveFocus,
      DEFAULT_FETISH_GENERATION.aiDescriptiveFocus,
    ),
    anatomicalFocus: readFetishAnatomicalFocus(
      rawFetishGeneration.anatomicalFocus,
    ),
    fetishEnabled: readBoolean(
      rawFetishGeneration.fetishEnabled,
      DEFAULT_FETISH_GENERATION.fetishEnabled,
    ),
    materialPreference: readFetishMaterialPreference(
      rawFetishGeneration.materialPreference,
    ),
    situationalTrigger: readFetishSituationalTrigger(
      rawFetishGeneration.situationalTrigger,
    ),
    sizeFantasyModifier: readFetishSizeFantasyModifier(
      rawFetishGeneration.sizeFantasyModifier,
    ),
  };
}

function readIntimacyStyleGenerationExtension(
  card: ValidatedCharacterCardV3,
): IntimacyStyleGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawIntimacyStyleGeneration = namespace.intimacy_style_generation;

  if (!isRecord(rawIntimacyStyleGeneration)) {
    return DEFAULT_INTIMACY_STYLE_GENERATION;
  }

  return {
    aftercareStyle: readIntimacyAftercareStyle(
      rawIntimacyStyleGeneration.aftercareStyle,
    ),
    aiBehaviorPrompt: readString(
      rawIntimacyStyleGeneration.aiBehaviorPrompt,
      DEFAULT_INTIMACY_STYLE_GENERATION.aiBehaviorPrompt,
    ),
    expressionType: readIntimacyExpressionType(
      rawIntimacyStyleGeneration.expressionType,
    ),
    physicalLoveLanguage: readIntimacyPhysicalLoveLanguage(
      rawIntimacyStyleGeneration.physicalLoveLanguage,
    ),
    verbalCadence: readIntimacyVerbalCadence(
      rawIntimacyStyleGeneration.verbalCadence,
    ),
  };
}

function readFirstMessageGenerationExtension(
  card: ValidatedCharacterCardV3,
): FirstMessageGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawFirstMessageGeneration = namespace.first_message_generation;

  if (!isRecord(rawFirstMessageGeneration)) {
    return DEFAULT_FIRST_MESSAGE_GENERATION;
  }

  return {
    aiOutputConstraint: readString(
      rawFirstMessageGeneration.aiOutputConstraint,
      DEFAULT_FIRST_MESSAGE_GENERATION.aiOutputConstraint,
    ),
    entryPoint: readFirstMessageEntryPoint(
      rawFirstMessageGeneration.entryPoint,
    ),
    literaryStyle: readFirstMessageLiteraryStyle(
      rawFirstMessageGeneration.literaryStyle,
    ),
    tokenLengthCap: readClampedNumber(
      rawFirstMessageGeneration.tokenLengthCap,
      DEFAULT_FIRST_MESSAGE_GENERATION.tokenLengthCap,
      200,
      1_200,
    ),
    userCallToAction: readFirstMessageUserCallToAction(
      rawFirstMessageGeneration.userCallToAction,
    ),
  };
}

function readTurnOffGenerationExtension(
  card: ValidatedCharacterCardV3,
): TurnOffGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawTurnOffGeneration = namespace.turn_off_generation;

  if (!isRecord(rawTurnOffGeneration)) {
    return DEFAULT_TURN_OFF_GENERATION;
  }

  return {
    aiReactionPrompt: readString(
      rawTurnOffGeneration.aiReactionPrompt,
      DEFAULT_TURN_OFF_GENERATION.aiReactionPrompt,
    ),
    behavioralTurnOffs: readStringArray(rawTurnOffGeneration.behavioralTurnOffs),
    dynamicHardlines: readTurnOffDynamicHardline(
      rawTurnOffGeneration.dynamicHardlines,
    ),
    sensoryTurnOffs: readStringArray(rawTurnOffGeneration.sensoryTurnOffs),
  };
}

function readScenarioGenerationExtension(
  card: ValidatedCharacterCardV3,
): ScenarioGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawScenarioGeneration = namespace.scenario_generation;

  if (!isRecord(rawScenarioGeneration)) {
    return DEFAULT_SCENARIO_GENERATION;
  }

  return {
    ...readScenarioGenerationValue(
      rawScenarioGeneration,
      DEFAULT_SCENARIO_GENERATION,
    ),
  };
}

function readScenarioOpeningPairGenerationExtension(
  card: ValidatedCharacterCardV3,
): ScenarioOpeningPairGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawScenarioOpeningPairGeneration =
    namespace.scenario_opening_pair_generation;

  if (!Array.isArray(rawScenarioOpeningPairGeneration)) {
    return DEFAULT_SCENARIO_OPENING_PAIR_GENERATION;
  }

  const parsed = rawScenarioOpeningPairGeneration
    .filter(isRecord)
    .map((pair, index) => {
      const fallback =
        DEFAULT_SCENARIO_OPENING_PAIR_GENERATION[index] ??
        DEFAULT_SCENARIO_OPENING_PAIR_GENERATION[0];

      return {
        alternateFirstMessage: readString(
          pair.alternateFirstMessage,
          fallback.alternateFirstMessage,
        ),
        alternateScenarioContext: readScenarioGenerationValue(
          pair.alternateScenarioContext,
          fallback.alternateScenarioContext,
        ),
        classificationType: readScenarioOpeningPairClassificationType(
          pair.classificationType,
        ),
        pairId: readUuidString(pair.pairId, fallback.pairId),
        pairTitle: readString(pair.pairTitle, fallback.pairTitle),
      };
    })
    .slice(0, 5);

  return parsed.length ? parsed : DEFAULT_SCENARIO_OPENING_PAIR_GENERATION;
}

function readLorebookSummaryGenerationExtension(
  card: ValidatedCharacterCardV3,
): LorebookSummaryGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawLorebookSummary = namespace.lorebook_summary;

  if (!isRecord(rawLorebookSummary)) {
    return DEFAULT_LOREBOOK_SUMMARY_GENERATION;
  }

  const worldSystemRules = readStringArray(rawLorebookSummary.worldSystemRules)
    .slice(0, 4);

  return {
    aiLoreInstruction: readString(
      rawLorebookSummary.aiLoreInstruction,
      DEFAULT_LOREBOOK_SUMMARY_GENERATION.aiLoreInstruction,
    ),
    factionOrDynastyContext: readString(
      rawLorebookSummary.factionOrDynastyContext,
      DEFAULT_LOREBOOK_SUMMARY_GENERATION.factionOrDynastyContext,
    ),
    tokenOptimizationCap: readClampedNumber(
      rawLorebookSummary.tokenOptimizationCap,
      DEFAULT_LOREBOOK_SUMMARY_GENERATION.tokenOptimizationCap,
      50,
      1_000,
    ),
    universeAnchor: readString(
      rawLorebookSummary.universeAnchor,
      DEFAULT_LOREBOOK_SUMMARY_GENERATION.universeAnchor,
    ),
    worldSystemRules: worldSystemRules.length
      ? worldSystemRules
      : DEFAULT_LOREBOOK_SUMMARY_GENERATION.worldSystemRules,
  };
}

function readCreatorsNotesGenerationExtension(
  card: ValidatedCharacterCardV3,
): CreatorsNotesGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawCreatorsNotes = namespace.creators_notes;

  if (!isRecord(rawCreatorsNotes)) {
    return DEFAULT_CREATORS_NOTES_GENERATION;
  }

  const recommendedModels = readStringArray(rawCreatorsNotes.recommendedModels)
    .slice(0, 5);
  const triggerWarnings = readStringArray(rawCreatorsNotes.triggerWarnings)
    .slice(0, 12);

  return {
    contentRating: readCreatorsNotesContentRating(
      rawCreatorsNotes.contentRating,
    ),
    idealUserPersona: readString(
      rawCreatorsNotes.idealUserPersona,
      DEFAULT_CREATORS_NOTES_GENERATION.idealUserPersona,
    ),
    recommendedModels: recommendedModels.length
      ? recommendedModels
      : DEFAULT_CREATORS_NOTES_GENERATION.recommendedModels,
    technicalNotesText: readString(
      rawCreatorsNotes.technicalNotesText,
      DEFAULT_CREATORS_NOTES_GENERATION.technicalNotesText,
    ),
    triggerWarnings: triggerWarnings.length
      ? triggerWarnings
      : DEFAULT_CREATORS_NOTES_GENERATION.triggerWarnings,
  };
}

function readPostHistoryInstructionsGenerationExtension(
  card: ValidatedCharacterCardV3,
): PostHistoryInstructionsGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawInstructions = namespace.post_history_instructions_generation;

  if (!isRecord(rawInstructions)) {
    return DEFAULT_POST_HISTORY_INSTRUCTIONS_GENERATION;
  }

  const driftControlRules = readStringArray(rawInstructions.driftControlRules)
    .slice(0, 8);
  const dynamicToneModifiers = readStringArray(
    rawInstructions.dynamicToneModifiers,
  ).slice(0, 8);
  const formattingHardlines = readStringArray(rawInstructions.formattingHardlines)
    .slice(0, 8);

  return {
    driftControlRules: driftControlRules.length
      ? driftControlRules
      : DEFAULT_POST_HISTORY_INSTRUCTIONS_GENERATION.driftControlRules,
    dynamicToneModifiers: dynamicToneModifiers.length
      ? dynamicToneModifiers
      : DEFAULT_POST_HISTORY_INSTRUCTIONS_GENERATION.dynamicToneModifiers,
    formattingHardlines: formattingHardlines.length
      ? formattingHardlines
      : DEFAULT_POST_HISTORY_INSTRUCTIONS_GENERATION.formattingHardlines,
    injectionTokenWeight: readClampedNumber(
      rawInstructions.injectionTokenWeight,
      DEFAULT_POST_HISTORY_INSTRUCTIONS_GENERATION.injectionTokenWeight,
      10,
      500,
    ),
  };
}

function readWorldLorePlaceholderGenerationExtension(
  card: ValidatedCharacterCardV3,
): WorldLorePlaceholderGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawPlaceholders = namespace.world_lore_placeholder;

  if (!Array.isArray(rawPlaceholders)) {
    return DEFAULT_WORLD_LORE_PLACEHOLDER_GENERATION;
  }

  const parsed = rawPlaceholders
    .filter(isRecord)
    .map((placeholder, index) => {
      const fallback =
        DEFAULT_WORLD_LORE_PLACEHOLDER_GENERATION[index] ??
        DEFAULT_WORLD_LORE_PLACEHOLDER_GENERATION[0];

      return {
        currentDataPayload: readString(
          placeholder.currentDataPayload,
          fallback.currentDataPayload,
        ),
        isDynamic: readBoolean(placeholder.isDynamic, fallback.isDynamic),
        macroType: readWorldLorePlaceholderMacroType(placeholder.macroType),
        placeholderId: readUuidString(
          placeholder.placeholderId,
          fallback.placeholderId,
        ),
        variableKey: readVariableKey(placeholder.variableKey, fallback.variableKey),
      };
    })
    .slice(0, 12);

  return parsed.length ? parsed : DEFAULT_WORLD_LORE_PLACEHOLDER_GENERATION;
}

function readLoreEntryGenerationExtension(
  card: ValidatedCharacterCardV3,
): LoreEntryGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawEntries = namespace.lore_entries;

  if (!Array.isArray(rawEntries)) {
    return DEFAULT_LORE_ENTRY_GENERATION;
  }

  const parsed = rawEntries
    .filter(isRecord)
    .map((entry, index) => {
      const fallback =
        DEFAULT_LORE_ENTRY_GENERATION[index] ?? DEFAULT_LORE_ENTRY_GENERATION[0];

      return {
        activationKeys: readStringArray(entry.activationKeys).length
          ? readStringArray(entry.activationKeys).slice(0, 12)
          : fallback.activationKeys,
        domainScope: readLoreEntryDomainScope(entry.domainScope),
        entryContent: readString(entry.entryContent, fallback.entryContent),
        entryId: readUuidString(entry.entryId, fallback.entryId),
        insertionPriority: readLoreEntryInsertionPriority(
          entry.insertionPriority,
        ),
        title: readString(entry.title, fallback.title),
        tokenReserveCost: readClampedNumber(
          entry.tokenReserveCost,
          fallback.tokenReserveCost,
          25,
          1_000,
        ),
      };
    })
    .slice(0, 20);

  return parsed.length ? parsed : DEFAULT_LORE_ENTRY_GENERATION;
}

function readFrameworkConfigurationExtension(
  card: ValidatedCharacterCardV3,
): FrameworkConfigurationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawFramework = namespace.framework;

  if (!isRecord(rawFramework)) {
    return DEFAULT_FRAMEWORK_CONFIGURATION;
  }

  return {
    frameworkId: readUuidString(
      rawFramework.frameworkId,
      DEFAULT_FRAMEWORK_CONFIGURATION.frameworkId,
    ),
    globalTokenSafetyBuffer: readClampedNumber(
      rawFramework.globalTokenSafetyBuffer,
      DEFAULT_FRAMEWORK_CONFIGURATION.globalTokenSafetyBuffer,
      50,
      2_000,
    ),
    injectionPipelineRouter: readFrameworkInjectionPipelineRouter(
      rawFramework.injectionPipelineRouter,
    ),
    memoryBudgetStrategy: readFrameworkMemoryBudgetStrategy(
      rawFramework.memoryBudgetStrategy,
    ),
    systemPromptJailbreakOverride: readString(
      rawFramework.systemPromptJailbreakOverride,
      DEFAULT_FRAMEWORK_CONFIGURATION.systemPromptJailbreakOverride,
    ),
    targetSpecification: readFrameworkTargetSpecification(
      rawFramework.targetSpecification,
    ),
  };
}

function readFormattingConfigurationExtension(
  card: ValidatedCharacterCardV3,
): FormattingConfigurationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawFormatting = namespace.formatting;

  if (!isRecord(rawFormatting)) {
    return DEFAULT_FORMATTING_CONFIGURATION;
  }

  return {
    actionWrappingStandard: readFormattingActionWrappingStandard(
      rawFormatting.actionWrappingStandard,
    ),
    formattingId: readUuidString(
      rawFormatting.formattingId,
      DEFAULT_FORMATTING_CONFIGURATION.formattingId,
    ),
    formattingSystemPromptInjection: readString(
      rawFormatting.formattingSystemPromptInjection,
      DEFAULT_FORMATTING_CONFIGURATION.formattingSystemPromptInjection,
    ),
    markdownEmphasisStyle: readFormattingMarkdownEmphasisStyle(
      rawFormatting.markdownEmphasisStyle,
    ),
    maxParagraphsPerTurn: readClampedNumber(
      rawFormatting.maxParagraphsPerTurn,
      DEFAULT_FORMATTING_CONFIGURATION.maxParagraphsPerTurn,
      1,
      12,
    ),
    narrativePerspective: readFormattingNarrativePerspective(
      rawFormatting.narrativePerspective,
    ),
  };
}

function readToneConfigurationExtension(
  card: ValidatedCharacterCardV3,
): ToneConfigurationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawTone = namespace.tone;

  if (!isRecord(rawTone)) {
    return DEFAULT_TONE_CONFIGURATION;
  }

  const vocabularyDirectives = readStringArray(rawTone.aiVocabularyDirectives)
    .slice(0, 12);

  return {
    aiVocabularyDirectives: vocabularyDirectives.length
      ? vocabularyDirectives
      : DEFAULT_TONE_CONFIGURATION.aiVocabularyDirectives,
    pacingVelocity: readTonePacingVelocity(rawTone.pacingVelocity),
    proseTexture: readToneProseTexture(rawTone.proseTexture),
    toneId: readUuidString(rawTone.toneId, DEFAULT_TONE_CONFIGURATION.toneId),
    toneSystemPromptInjection: readString(
      rawTone.toneSystemPromptInjection,
      DEFAULT_TONE_CONFIGURATION.toneSystemPromptInjection,
    ),
    worldviewFilter: readToneWorldviewFilter(rawTone.worldviewFilter),
  };
}

function readArchetypeConfigurationExtension(
  card: ValidatedCharacterCardV3,
): ArchetypeConfigurationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawArchetype = namespace.archetype;

  if (!isRecord(rawArchetype)) {
    return DEFAULT_ARCHETYPE_CONFIGURATION;
  }

  return {
    aiBehaviorPrompt: readString(
      rawArchetype.aiBehaviorPrompt,
      DEFAULT_ARCHETYPE_CONFIGURATION.aiBehaviorPrompt,
    ),
    archetypeId: readUuidString(
      rawArchetype.archetypeId,
      DEFAULT_ARCHETYPE_CONFIGURATION.archetypeId,
    ),
    coreMotivation: readArchetypeCoreMotivation(
      rawArchetype.coreMotivation,
    ),
    defenseMechanism: readArchetypeDefenseMechanism(
      rawArchetype.defenseMechanism,
    ),
    personaType: readArchetypePersonaType(rawArchetype.personaType),
  };
}

function readScenarioGenerationValue(
  value: unknown,
  fallback: ScenarioGenerationExtension,
): ScenarioGenerationExtension {
  if (!isRecord(value)) {
    return fallback;
  }

  const sensoryDetails = readStringArray(value.sensoryDetails);

  return {
    plotHook: readScenarioPlotHook(value.plotHook),
    scenePremiseDescription: readString(
      value.scenePremiseDescription,
      fallback.scenePremiseDescription,
    ),
    sensoryDetails: sensoryDetails.length ? sensoryDetails : fallback.sensoryDetails,
    settingType: readScenarioSettingType(value.settingType),
    startingTension: readScenarioStartingTension(value.startingTension),
  };
}

function readSpeciesGenerationExtension(
  card: ValidatedCharacterCardV3,
): SpeciesGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawSpeciesGeneration = namespace.species_generation;

  if (!isRecord(rawSpeciesGeneration)) {
    return DEFAULT_SPECIES_GENERATION;
  }

  return {
    apparentAge: readString(
      rawSpeciesGeneration.apparentAge,
      DEFAULT_SPECIES_GENERATION.apparentAge,
    ),
    biologyTag: readString(
      rawSpeciesGeneration.biologyTag,
      DEFAULT_SPECIES_GENERATION.biologyTag,
    ),
    dietaryNeed: readString(
      rawSpeciesGeneration.dietaryNeed,
      DEFAULT_SPECIES_GENERATION.dietaryNeed,
    ),
    instinctualTrait: readString(
      rawSpeciesGeneration.instinctualTrait,
      DEFAULT_SPECIES_GENERATION.instinctualTrait,
    ),
    isImmortal: readBoolean(
      rawSpeciesGeneration.isImmortal,
      DEFAULT_SPECIES_GENERATION.isImmortal,
    ),
    lifespanAnchor: readString(
      rawSpeciesGeneration.lifespanAnchor,
      DEFAULT_SPECIES_GENERATION.lifespanAnchor,
    ),
    type: readSpeciesType(rawSpeciesGeneration.type),
  };
}

function readEthnicityGenerationExtension(
  card: ValidatedCharacterCardV3,
): EthnicityGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawEthnicityGeneration = namespace.ethnicity_generation;

  if (!isRecord(rawEthnicityGeneration)) {
    return DEFAULT_ETHNICITY_GENERATION;
  }

  return {
    culturalHeritage: readString(
      rawEthnicityGeneration.culturalHeritage,
      DEFAULT_ETHNICITY_GENERATION.culturalHeritage,
    ),
    hasDiasporicBaggage: readBoolean(
      rawEthnicityGeneration.hasDiasporicBaggage,
      DEFAULT_ETHNICITY_GENERATION.hasDiasporicBaggage,
    ),
    linguisticMatrix: readLinguisticMatrix(
      rawEthnicityGeneration.linguisticMatrix,
    ),
    nativeLanguage: readString(
      rawEthnicityGeneration.nativeLanguage,
      DEFAULT_ETHNICITY_GENERATION.nativeLanguage,
    ),
    region: readEthnicityRegion(rawEthnicityGeneration.region),
    societalContext: readString(
      rawEthnicityGeneration.societalContext,
      DEFAULT_ETHNICITY_GENERATION.societalContext,
    ),
  };
}

function readNationalityGenerationExtension(
  card: ValidatedCharacterCardV3,
): NationalityGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawNationalityGeneration = namespace.nationality_generation;

  if (!isRecord(rawNationalityGeneration)) {
    return DEFAULT_NATIONALITY_GENERATION;
  }

  return {
    legalStatus: readNationalityLegalStatus(
      rawNationalityGeneration.legalStatus,
    ),
    linguisticVibe: readString(
      rawNationalityGeneration.linguisticVibe,
      DEFAULT_NATIONALITY_GENERATION.linguisticVibe,
    ),
    passportCountry: readString(
      rawNationalityGeneration.passportCountry,
      DEFAULT_NATIONALITY_GENERATION.passportCountry,
    ),
    regionalAlliance: readNationalityRegionalAlliance(
      rawNationalityGeneration.regionalAlliance,
    ),
  };
}

function readOccupationGenerationExtension(
  card: ValidatedCharacterCardV3,
): OccupationGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawOccupationGeneration = namespace.occupation_generation;

  if (!isRecord(rawOccupationGeneration)) {
    return DEFAULT_OCCUPATION_GENERATION;
  }

  return {
    academicYear: readStudentAcademicYear(
      rawOccupationGeneration.academicYear,
    ),
    authorityDynamic: readOccupationAuthorityDynamic(
      rawOccupationGeneration.authorityDynamic,
    ),
    campusAffiliation: readString(
      rawOccupationGeneration.campusAffiliation,
      DEFAULT_OCCUPATION_GENERATION.campusAffiliation,
    ),
    fundingType: readStudentFundingType(rawOccupationGeneration.fundingType),
    jobTitle: readString(
      rawOccupationGeneration.jobTitle,
      DEFAULT_OCCUPATION_GENERATION.jobTitle,
    ),
    majorField: readStudentMajorField(rawOccupationGeneration.majorField),
    professionalDomain: readOccupationProfessionalDomain(
      rawOccupationGeneration.professionalDomain,
    ),
    socioeconomicTier: readOccupationSocioeconomicTier(
      rawOccupationGeneration.socioeconomicTier,
    ),
    workplaceVibe: readString(
      rawOccupationGeneration.workplaceVibe,
      DEFAULT_OCCUPATION_GENERATION.workplaceVibe,
    ),
  };
}

function readRaceGenerationExtension(
  card: ValidatedCharacterCardV3,
): RaceGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawRaceGeneration = namespace.race_generation;

  if (!isRecord(rawRaceGeneration)) {
    return DEFAULT_RACE_GENERATION;
  }

  return {
    isCulturallySalient: readBoolean(
      rawRaceGeneration.isCulturallySalient,
      DEFAULT_RACE_GENERATION.isCulturallySalient,
    ),
    macroGroup: readRaceMacroGroup(rawRaceGeneration.macroGroup),
    narrativeStyle: readString(
      rawRaceGeneration.narrativeStyle,
      DEFAULT_RACE_GENERATION.narrativeStyle,
    ),
    physicalDescriptors: readStringArray(
      rawRaceGeneration.physicalDescriptors,
    ),
    syncMode: readString(
      rawRaceGeneration.syncMode,
      DEFAULT_RACE_GENERATION.syncMode,
    ),
  };
}

function readRelationshipGenerationExtension(
  card: ValidatedCharacterCardV3,
): RelationshipGenerationExtension[] {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawRelationships = namespace.relationship_generation;

  if (!Array.isArray(rawRelationships)) {
    return DEFAULT_RELATIONSHIP_GENERATION;
  }

  const relationships = rawRelationships
    .filter(isRecord)
    .slice(0, 3)
    .map((relationship) => ({
      connectionType: readNPCConnectionType(relationship.connectionType),
      emotionalStatus: readNPCEmotionalStatus(relationship.emotionalStatus),
      npcName: readString(relationship.npcName, ""),
      oneLineDescription: readString(relationship.oneLineDescription, ""),
      romanceFunction: readNPCRomanceFunction(relationship.romanceFunction),
    }));

  return relationships.length > 0 ? relationships : DEFAULT_RELATIONSHIP_GENERATION;
}

function readRelationshipStatusGenerationExtension(
  card: ValidatedCharacterCardV3,
): RelationshipStatusGenerationExtension {
  const namespace = readExtensionNamespace(
    card.data.extensions[AMOURAI_EXTENSION_NAMESPACE],
  );
  const rawRelationshipStatus = namespace.relationship_status_generation;

  if (!isRecord(rawRelationshipStatus)) {
    return DEFAULT_RELATIONSHIP_STATUS_GENERATION;
  }

  return {
    currentLabel: readRelationshipCurrentLabel(
      rawRelationshipStatus.currentLabel,
    ),
    emotionalAvailability: readRelationshipEmotionalAvailability(
      rawRelationshipStatus.emotionalAvailability,
    ),
    scandalFactor: readRelationshipScandalFactor(
      rawRelationshipStatus.scandalFactor,
    ),
    statusContext: readString(
      rawRelationshipStatus.statusContext,
      DEFAULT_RELATIONSHIP_STATUS_GENERATION.statusContext,
    ),
  };
}

function readNamePartsFromCardName(name: string) {
  const [firstname = "", ...remainingNameParts] = name.trim().split(/\s+/);

  return {
    firstname,
    surname: remainingNameParts.join(" "),
  };
}

function readExtensionNamespace(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readUuidString(value: unknown, fallback: string) {
  return typeof value === "string" && isUuidString(value) ? value : fallback;
}

function readVariableKey(value: unknown, fallback: string) {
  return typeof value === "string" && /^\{\{[a-z0-9_]+\}\}$/.test(value)
    ? value
    : fallback;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readClampedNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  return Math.max(min, Math.min(max, Math.round(readNumber(value, fallback))));
}

function isUuidString(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function readSpeciesType(value: unknown): SpeciesType {
  return SPECIES_TYPES.includes(value as SpeciesType)
    ? (value as SpeciesType)
    : DEFAULT_SPECIES_GENERATION.type;
}

function readAlternateGreetingForkType(value: unknown): AlternateGreetingForkType {
  return ALTERNATE_GREETING_FORK_TYPES.includes(
    value as AlternateGreetingForkType,
  )
    ? (value as AlternateGreetingForkType)
    : DEFAULT_ALTERNATE_GREETING_GENERATION[0].forkType;
}

function readGroupGreetingSpotlightDistribution(
  value: unknown,
): GroupGreetingSpotlightDistribution {
  return GROUP_GREETING_SPOTLIGHT_DISTRIBUTIONS.includes(
    value as GroupGreetingSpotlightDistribution,
  )
    ? (value as GroupGreetingSpotlightDistribution)
    : DEFAULT_GROUP_GREETING_GENERATION[0].spotlightDistribution;
}

function readGroupGreetingInterpersonalDynamic(
  value: unknown,
): GroupGreetingInterpersonalDynamic {
  return GROUP_GREETING_INTERPERSONAL_DYNAMICS.includes(
    value as GroupGreetingInterpersonalDynamic,
  )
    ? (value as GroupGreetingInterpersonalDynamic)
    : DEFAULT_GROUP_GREETING_GENERATION[0].interpersonalDynamic;
}

function readGroupGreetingFormattingStyle(
  value: unknown,
): GroupGreetingFormattingStyle {
  return GROUP_GREETING_FORMATTING_STYLES.includes(
    value as GroupGreetingFormattingStyle,
  )
    ? (value as GroupGreetingFormattingStyle)
    : DEFAULT_GROUP_GREETING_GENERATION[0].formattingStyle;
}

function readGroupAlternateGreetingForkCategory(
  value: unknown,
): GroupAlternateGreetingForkCategory {
  return GROUP_ALTERNATE_GREETING_FORK_CATEGORIES.includes(
    value as GroupAlternateGreetingForkCategory,
  )
    ? (value as GroupAlternateGreetingForkCategory)
    : DEFAULT_GROUP_ALTERNATE_GREETING_GENERATION[0].forkCategory;
}

function readEthnicityRegion(value: unknown): EthnicityRegion {
  return ETHNICITY_REGIONS.includes(value as EthnicityRegion)
    ? (value as EthnicityRegion)
    : DEFAULT_ETHNICITY_GENERATION.region;
}

function readLinguisticMatrix(value: unknown): LinguisticMatrix {
  return LINGUISTIC_MATRICES.includes(value as LinguisticMatrix)
    ? (value as LinguisticMatrix)
    : DEFAULT_ETHNICITY_GENERATION.linguisticMatrix;
}

function readNationalityRegionalAlliance(
  value: unknown,
): NationalityRegionalAlliance {
  return NATIONALITY_REGIONAL_ALLIANCES.includes(
    value as NationalityRegionalAlliance,
  )
    ? (value as NationalityRegionalAlliance)
    : DEFAULT_NATIONALITY_GENERATION.regionalAlliance;
}

function readNationalityLegalStatus(value: unknown): NationalityLegalStatus {
  return NATIONALITY_LEGAL_STATUSES.includes(value as NationalityLegalStatus)
    ? (value as NationalityLegalStatus)
    : DEFAULT_NATIONALITY_GENERATION.legalStatus;
}

function readOccupationSocioeconomicTier(
  value: unknown,
): OccupationSocioeconomicTier {
  return OCCUPATION_SOCIOECONOMIC_TIERS.includes(
    value as OccupationSocioeconomicTier,
  )
    ? (value as OccupationSocioeconomicTier)
    : DEFAULT_OCCUPATION_GENERATION.socioeconomicTier;
}

function readOccupationProfessionalDomain(
  value: unknown,
): OccupationProfessionalDomain {
  return OCCUPATION_PROFESSIONAL_DOMAINS.includes(
    value as OccupationProfessionalDomain,
  )
    ? (value as OccupationProfessionalDomain)
    : DEFAULT_OCCUPATION_GENERATION.professionalDomain;
}

function readOccupationAuthorityDynamic(
  value: unknown,
): OccupationAuthorityDynamic {
  return OCCUPATION_AUTHORITY_DYNAMICS.includes(
    value as OccupationAuthorityDynamic,
  )
    ? (value as OccupationAuthorityDynamic)
    : DEFAULT_OCCUPATION_GENERATION.authorityDynamic;
}

function readStudentAcademicYear(value: unknown): StudentAcademicYear {
  return STUDENT_ACADEMIC_YEARS.includes(value as StudentAcademicYear)
    ? (value as StudentAcademicYear)
    : DEFAULT_OCCUPATION_GENERATION.academicYear;
}

function readStudentMajorField(value: unknown): StudentMajorField {
  return STUDENT_MAJOR_FIELDS.includes(value as StudentMajorField)
    ? (value as StudentMajorField)
    : DEFAULT_OCCUPATION_GENERATION.majorField;
}

function readStudentFundingType(value: unknown): StudentFundingType {
  return STUDENT_FUNDING_TYPES.includes(value as StudentFundingType)
    ? (value as StudentFundingType)
    : DEFAULT_OCCUPATION_GENERATION.fundingType;
}

function readRaceMacroGroup(value: unknown): RaceMacroGroup {
  return RACE_MACRO_GROUPS.includes(value as RaceMacroGroup)
    ? (value as RaceMacroGroup)
    : DEFAULT_RACE_GENERATION.macroGroup;
}

function readKinkPrimaryRole(value: unknown): KinkPrimaryRole {
  return KINK_PRIMARY_ROLES.includes(value as KinkPrimaryRole)
    ? (value as KinkPrimaryRole)
    : DEFAULT_KINK_GENERATION.primaryRole;
}

function readKinkIntensityLevel(value: unknown): KinkIntensityLevel {
  return KINK_INTENSITY_LEVELS.includes(value as KinkIntensityLevel)
    ? (value as KinkIntensityLevel)
    : DEFAULT_KINK_GENERATION.intensityLevel;
}

function readFetishAnatomicalFocus(value: unknown): FetishAnatomicalFocus {
  return FETISH_ANATOMICAL_FOCUSES.includes(value as FetishAnatomicalFocus)
    ? (value as FetishAnatomicalFocus)
    : DEFAULT_FETISH_GENERATION.anatomicalFocus;
}

function readFetishMaterialPreference(
  value: unknown,
): FetishMaterialPreference {
  return FETISH_MATERIAL_PREFERENCES.includes(
    value as FetishMaterialPreference,
  )
    ? (value as FetishMaterialPreference)
    : DEFAULT_FETISH_GENERATION.materialPreference;
}

function readFetishSituationalTrigger(
  value: unknown,
): FetishSituationalTrigger {
  return FETISH_SITUATIONAL_TRIGGERS.includes(
    value as FetishSituationalTrigger,
  )
    ? (value as FetishSituationalTrigger)
    : DEFAULT_FETISH_GENERATION.situationalTrigger;
}

function readFetishSizeFantasyModifier(
  value: unknown,
): FetishSizeFantasyModifier {
  return FETISH_SIZE_MODIFIERS.includes(value as FetishSizeFantasyModifier)
    ? (value as FetishSizeFantasyModifier)
    : DEFAULT_FETISH_GENERATION.sizeFantasyModifier;
}

function readFirstMessageEntryPoint(value: unknown): FirstMessageEntryPoint {
  return FIRST_MESSAGE_ENTRY_POINTS.includes(value as FirstMessageEntryPoint)
    ? (value as FirstMessageEntryPoint)
    : DEFAULT_FIRST_MESSAGE_GENERATION.entryPoint;
}

function readFirstMessageLiteraryStyle(
  value: unknown,
): FirstMessageLiteraryStyle {
  return FIRST_MESSAGE_LITERARY_STYLES.includes(
    value as FirstMessageLiteraryStyle,
  )
    ? (value as FirstMessageLiteraryStyle)
    : DEFAULT_FIRST_MESSAGE_GENERATION.literaryStyle;
}

function readFirstMessageUserCallToAction(
  value: unknown,
): FirstMessageUserCallToAction {
  return FIRST_MESSAGE_USER_CALLS_TO_ACTION.includes(
    value as FirstMessageUserCallToAction,
  )
    ? (value as FirstMessageUserCallToAction)
    : DEFAULT_FIRST_MESSAGE_GENERATION.userCallToAction;
}

function readIntimacyExpressionType(value: unknown): IntimacyExpressionType {
  return INTIMACY_EXPRESSION_TYPES.includes(value as IntimacyExpressionType)
    ? (value as IntimacyExpressionType)
    : DEFAULT_INTIMACY_STYLE_GENERATION.expressionType;
}

function readIntimacyAftercareStyle(value: unknown): IntimacyAftercareStyle {
  return INTIMACY_AFTERCARE_STYLES.includes(value as IntimacyAftercareStyle)
    ? (value as IntimacyAftercareStyle)
    : DEFAULT_INTIMACY_STYLE_GENERATION.aftercareStyle;
}

function readIntimacyVerbalCadence(value: unknown): IntimacyVerbalCadence {
  return INTIMACY_VERBAL_CADENCES.includes(value as IntimacyVerbalCadence)
    ? (value as IntimacyVerbalCadence)
    : DEFAULT_INTIMACY_STYLE_GENERATION.verbalCadence;
}

function readIntimacyPhysicalLoveLanguage(
  value: unknown,
): IntimacyPhysicalLoveLanguage {
  return INTIMACY_PHYSICAL_LOVE_LANGUAGES.includes(
    value as IntimacyPhysicalLoveLanguage,
  )
    ? (value as IntimacyPhysicalLoveLanguage)
    : DEFAULT_INTIMACY_STYLE_GENERATION.physicalLoveLanguage;
}

function readTurnOffDynamicHardline(value: unknown): TurnOffDynamicHardline {
  return TURN_OFF_DYNAMIC_HARDLINES.includes(value as TurnOffDynamicHardline)
    ? (value as TurnOffDynamicHardline)
    : DEFAULT_TURN_OFF_GENERATION.dynamicHardlines;
}

function readScenarioSettingType(value: unknown): ScenarioSettingType {
  return SCENARIO_SETTING_TYPES.includes(value as ScenarioSettingType)
    ? (value as ScenarioSettingType)
    : DEFAULT_SCENARIO_GENERATION.settingType;
}

function readScenarioPlotHook(value: unknown): ScenarioPlotHook {
  return SCENARIO_PLOT_HOOKS.includes(value as ScenarioPlotHook)
    ? (value as ScenarioPlotHook)
    : DEFAULT_SCENARIO_GENERATION.plotHook;
}

function readScenarioStartingTension(
  value: unknown,
): ScenarioStartingTension {
  return SCENARIO_STARTING_TENSIONS.includes(value as ScenarioStartingTension)
    ? (value as ScenarioStartingTension)
    : DEFAULT_SCENARIO_GENERATION.startingTension;
}

function readScenarioOpeningPairClassificationType(
  value: unknown,
): ScenarioOpeningPairClassificationType {
  return SCENARIO_OPENING_PAIR_CLASSIFICATIONS.includes(
    value as ScenarioOpeningPairClassificationType,
  )
    ? (value as ScenarioOpeningPairClassificationType)
    : DEFAULT_SCENARIO_OPENING_PAIR_GENERATION[0].classificationType;
}

function readCreatorsNotesContentRating(
  value: unknown,
): CreatorsNotesContentRating {
  return CREATORS_NOTES_CONTENT_RATINGS.includes(
    value as CreatorsNotesContentRating,
  )
    ? (value as CreatorsNotesContentRating)
    : DEFAULT_CREATORS_NOTES_GENERATION.contentRating;
}

function readWorldLorePlaceholderMacroType(
  value: unknown,
): WorldLorePlaceholderGenerationExtension["macroType"] {
  return WORLD_LORE_PLACEHOLDER_MACRO_TYPES.includes(
    value as WorldLorePlaceholderGenerationExtension["macroType"],
  )
    ? (value as WorldLorePlaceholderGenerationExtension["macroType"])
    : DEFAULT_WORLD_LORE_PLACEHOLDER_GENERATION[0].macroType;
}

function readLoreEntryDomainScope(value: unknown): LoreEntryDomainScope {
  return LORE_ENTRY_DOMAIN_SCOPES.includes(value as LoreEntryDomainScope)
    ? (value as LoreEntryDomainScope)
    : DEFAULT_LORE_ENTRY_GENERATION[0].domainScope;
}

function readLoreEntryInsertionPriority(
  value: unknown,
): LoreEntryInsertionPriority {
  return LORE_ENTRY_INSERTION_PRIORITIES.includes(
    value as LoreEntryInsertionPriority,
  )
    ? (value as LoreEntryInsertionPriority)
    : DEFAULT_LORE_ENTRY_GENERATION[0].insertionPriority;
}

function readFrameworkTargetSpecification(
  value: unknown,
): FrameworkTargetSpecification {
  return FRAMEWORK_TARGET_SPECIFICATIONS.includes(
    value as FrameworkTargetSpecification,
  )
    ? (value as FrameworkTargetSpecification)
    : DEFAULT_FRAMEWORK_CONFIGURATION.targetSpecification;
}

function readFrameworkMemoryBudgetStrategy(
  value: unknown,
): FrameworkMemoryBudgetStrategy {
  return FRAMEWORK_MEMORY_BUDGET_STRATEGIES.includes(
    value as FrameworkMemoryBudgetStrategy,
  )
    ? (value as FrameworkMemoryBudgetStrategy)
    : DEFAULT_FRAMEWORK_CONFIGURATION.memoryBudgetStrategy;
}

function readFrameworkInjectionPipelineRouter(
  value: unknown,
): FrameworkInjectionPipelineRouter {
  return FRAMEWORK_INJECTION_PIPELINE_ROUTERS.includes(
    value as FrameworkInjectionPipelineRouter,
  )
    ? (value as FrameworkInjectionPipelineRouter)
    : DEFAULT_FRAMEWORK_CONFIGURATION.injectionPipelineRouter;
}

function readFormattingActionWrappingStandard(
  value: unknown,
): FormattingActionWrappingStandard {
  return FORMATTING_ACTION_WRAPPING_STANDARDS.includes(
    value as FormattingActionWrappingStandard,
  )
    ? (value as FormattingActionWrappingStandard)
    : DEFAULT_FORMATTING_CONFIGURATION.actionWrappingStandard;
}

function readFormattingMarkdownEmphasisStyle(
  value: unknown,
): FormattingMarkdownEmphasisStyle {
  return FORMATTING_MARKDOWN_EMPHASIS_STYLES.includes(
    value as FormattingMarkdownEmphasisStyle,
  )
    ? (value as FormattingMarkdownEmphasisStyle)
    : DEFAULT_FORMATTING_CONFIGURATION.markdownEmphasisStyle;
}

function readFormattingNarrativePerspective(
  value: unknown,
): FormattingNarrativePerspective {
  return FORMATTING_NARRATIVE_PERSPECTIVES.includes(
    value as FormattingNarrativePerspective,
  )
    ? (value as FormattingNarrativePerspective)
    : DEFAULT_FORMATTING_CONFIGURATION.narrativePerspective;
}

function readToneProseTexture(value: unknown): ToneProseTexture {
  return TONE_PROSE_TEXTURES.includes(value as ToneProseTexture)
    ? (value as ToneProseTexture)
    : DEFAULT_TONE_CONFIGURATION.proseTexture;
}

function readTonePacingVelocity(value: unknown): TonePacingVelocity {
  return TONE_PACING_VELOCITIES.includes(value as TonePacingVelocity)
    ? (value as TonePacingVelocity)
    : DEFAULT_TONE_CONFIGURATION.pacingVelocity;
}

function readToneWorldviewFilter(value: unknown): ToneWorldviewFilter {
  return TONE_WORLDVIEW_FILTERS.includes(value as ToneWorldviewFilter)
    ? (value as ToneWorldviewFilter)
    : DEFAULT_TONE_CONFIGURATION.worldviewFilter;
}

function readArchetypePersonaType(value: unknown): ArchetypePersonaType {
  return ARCHETYPE_PERSONA_TYPES.includes(value as ArchetypePersonaType)
    ? (value as ArchetypePersonaType)
    : DEFAULT_ARCHETYPE_CONFIGURATION.personaType;
}

function readArchetypeDefenseMechanism(
  value: unknown,
): ArchetypeDefenseMechanism {
  return ARCHETYPE_DEFENSE_MECHANISMS.includes(
    value as ArchetypeDefenseMechanism,
  )
    ? (value as ArchetypeDefenseMechanism)
    : DEFAULT_ARCHETYPE_CONFIGURATION.defenseMechanism;
}

function readArchetypeCoreMotivation(value: unknown): ArchetypeCoreMotivation {
  return ARCHETYPE_CORE_MOTIVATIONS.includes(value as ArchetypeCoreMotivation)
    ? (value as ArchetypeCoreMotivation)
    : DEFAULT_ARCHETYPE_CONFIGURATION.coreMotivation;
}

function readNPCConnectionType(value: unknown): NPCConnectionType {
  return NPC_CONNECTION_TYPES.includes(value as NPCConnectionType)
    ? (value as NPCConnectionType)
    : DEFAULT_RELATIONSHIP_GENERATION[0].connectionType;
}

function readNPCRomanceFunction(value: unknown): NPCRomanceFunction {
  return NPC_ROMANCE_FUNCTIONS.includes(value as NPCRomanceFunction)
    ? (value as NPCRomanceFunction)
    : DEFAULT_RELATIONSHIP_GENERATION[0].romanceFunction;
}

function readNPCEmotionalStatus(value: unknown): NPCEmotionalStatus {
  return NPC_EMOTIONAL_STATUSES.includes(value as NPCEmotionalStatus)
    ? (value as NPCEmotionalStatus)
    : DEFAULT_RELATIONSHIP_GENERATION[0].emotionalStatus;
}

function readRelationshipCurrentLabel(value: unknown): RelationshipCurrentLabel {
  return RELATIONSHIP_CURRENT_LABELS.includes(value as RelationshipCurrentLabel)
    ? (value as RelationshipCurrentLabel)
    : DEFAULT_RELATIONSHIP_STATUS_GENERATION.currentLabel;
}

function readRelationshipEmotionalAvailability(
  value: unknown,
): RelationshipEmotionalAvailability {
  return RELATIONSHIP_EMOTIONAL_AVAILABILITIES.includes(
    value as RelationshipEmotionalAvailability,
  )
    ? (value as RelationshipEmotionalAvailability)
    : DEFAULT_RELATIONSHIP_STATUS_GENERATION.emotionalAvailability;
}

function readRelationshipScandalFactor(
  value: unknown,
): RelationshipScandalFactor {
  return RELATIONSHIP_SCANDAL_FACTORS.includes(
    value as RelationshipScandalFactor,
  )
    ? (value as RelationshipScandalFactor)
    : DEFAULT_RELATIONSHIP_STATUS_GENERATION.scandalFactor;
}

function speciesTypeToBiologyTag(speciesType: SpeciesType) {
  if (speciesType === "Vampire") {
    return "Undead / Sanguine";
  }

  if (speciesType === "Werewolf") {
    return "Therianthrope / Shifter";
  }

  if (speciesType === "Fae") {
    return "Fae / Immortal Folk";
  }

  if (speciesType === "Demon") {
    return "Celestial / Abyssal";
  }

  if (speciesType === "Angel" || speciesType === "Siren") {
    return "Celestial / Abyssal";
  }

  if (speciesType === "Wraith") {
    return "Undead / Sanguine";
  }

  return "Mortal / Baseline";
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function activeMacroClassName(tone: "emerald" | "sky" | "violet") {
  if (tone === "emerald") {
    return "border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30";
  }

  if (tone === "sky") {
    return "border-sky-500 bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30";
  }

  return "border-violet-500 bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/30";
}
