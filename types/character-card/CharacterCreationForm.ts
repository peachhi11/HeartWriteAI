import { z } from "zod";

export const HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY =
  "heartwriteai_character_creation_form";
export const HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY =
  "heartwriteai_personality_engine";
export const HEARTWRITE_CHARACTER_TRUTH_SEPARATION_EXTENSION_KEY =
  "heartwriteai_character_truth_separation";
export const HEARTWRITE_WRITER_BIBLE_EXTENSION_KEY =
  "heartwriteai_writer_bible";
export const HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY =
  "heartwriteai_character_engine";

const textField = z.string().default("");
const section = <Shape extends z.ZodRawShape>(shape: Shape) =>
  z.preprocess((value) => value ?? {}, z.object(shape));

export const CharacterCreationTargetOverrideSchema = z.object({
  targetId: textField,
  contextualPromptInjection: textField,
});

export const CHARACTER_CREATION_NPC_PROFILE_TYPES = [
  "family",
  "ex",
  "rival",
  "love_interest",
  "friend",
  "mentor",
  "dependant",
  "enemy",
  "patron",
  "employer",
  "wildcard",
] as const;

export const CharacterCreationNpcProfileTypeSchema = z.enum(
  CHARACTER_CREATION_NPC_PROFILE_TYPES,
);

export const CharacterCreationNpcMiniProfileSchema = z.object({
  id: textField,
  profileType: CharacterCreationNpcProfileTypeSchema.default("friend"),
  name: textField,
  role: textField,
  relationshipToCharacter: textField,
  publicRole: textField,
  privateHistory: textField,
  storyFunction: textField,
  emotionalPressure: textField,
  behaviorShift: textField,
  conflictHook: textField,
  supportHook: textField,
  boundaries: textField,
  lorebookKeys: textField,
});

export const CharacterEngineDecisionRuleSchema = z.object({
  id: textField,
  drive: textField,
  question: textField,
  yes: textField,
  no: textField,
  constraints: textField,
  visibleBehaviors: textField,
  alternativeAction: textField,
});

export const CharacterCreationFormSchema = z.object({
  semanticSeedIds: z.array(z.string()).default([]),
  writerBible: section({
    projectTitle: textField,
    humanSummary: textField,
    themes: textField,
    worldReference: textField,
    characterReference: textField,
    relationshipArc: textField,
    styleNotes: textField,
    activeThreads: textField,
    sourceNotes: textField,
  }),
  characterEngine: section({
    coreWound: textField,
    coreBelief: textField,
    coreFear: textField,
    primaryDrive: textField,
    decisionRules: z.array(CharacterEngineDecisionRuleSchema).default([]),
    defenseMechanisms: textField,
    attachmentStyle: textField,
    behavioralTriggers: textField,
    relationshipDynamics: textField,
    speechRules: textField,
    sexualityRules: textField,
  }),
  identity: section({
    characterName: textField,
    nicknamesAliases: textField,
    age: textField,
    birthdate: textField,
    birthplace: textField,
    nationalityEthnicity: textField,
    languagesSpoken: textField,
    genderIdentity: textField,
    pronouns: textField,
    occupation: textField,
    speciesHeritage: textField,
  }),
  appearance: section({
    height: textField,
    build: textField,
    eyeColourShape: textField,
    hairColourLengthTextureStyle: textField,
    skinColourUndertoneTexture: textField,
    facialFeatures: textField,
    piercings: textField,
    tattoos: textField,
    blemishesScars: textField,
    frecklesMolesBeautyMarks: textField,
    outfit: textField,
  }),
  adultAnatomy: section({
    isNsfwAdultCard: z.boolean().default(false),
    penisDescriptors: textField,
    testicleScrotumDescriptors: textField,
    nippleDescriptors: textField,
    breastDescriptors: textField,
    vaginaDescriptors: textField,
    anusDescriptors: textField,
  }),
  personality: section({
    archetype: textField,
    positiveTraits: textField,
    flaws: textField,
    humor: textField,
    intelligence: textField,
    socialBehaviour: textField,
  }),
  cognitiveDrivers: section({
    motivation: textField,
    fear: textField,
    defenses: textField,
  }),
  psychology: section({
    temperament: textField,
    cognitiveDistortions: textField,
    decisionEngine: textField,
    baselineAffect: textField,
    frustrationThreshold: textField,
    coreWound: textField,
    internalizedLie: textField,
    triggers: textField,
    beliefs: textField,
    moralFlexibility: textField,
    attachmentStyle: textField,
    conflictStyle: textField,
    stressResponse: textField,
    loveLanguages: textField,
    bigFive: section({
      openness: textField,
      conscientiousness: textField,
      extraversion: textField,
      agreeableness: textField,
      emotionalStability: textField,
    }),
  }),
  behaviour: section({
    facialExpressions: textField,
    bodyLanguagePosture: textField,
    mannerisms: textField,
    goalOrientedActions: textField,
    moralityInAction: textField,
    habitsRoutines: textField,
  }),
  lifestyle: section({
    residence: textField,
    livingStyle: textField,
    routines: textField,
    wealth: textField,
    workLifeBalance: textField,
    hobbies: textField,
  }),
  relationships: section({
    affiliationCore: section({
      factionOrGroup: textField,
      hierarchicalRank: textField,
      publicStatus: textField,
    }),
    emotionalBonds: section({
      attachmentType: textField,
      trustMetric: textField,
      sharedHistoryAnchor: textField,
    }),
    behavioralFriction: section({
      ideologicalClash: textField,
      boundaries: textField,
      microAggressionsOrTells: textField,
    }),
    targetOverrides: z.array(CharacterCreationTargetOverrideSchema).default([]),
  }),
  npcNetwork: section({
    discoveryNotes: textField,
    miniProfiles: z.array(CharacterCreationNpcMiniProfileSchema).default([]),
  }),
  speechCommunication: section({
    toneVocabulary: textField,
    subtext: textField,
    conversationalHabits: textField,
  }),
  internalThoughts: section({
    psychologicalResponses: textField,
    motivationsFears: textField,
    internalMonologues: textField,
  }),
});

export type CharacterCreationForm = z.infer<
  typeof CharacterCreationFormSchema
>;
export type CharacterCreationTargetOverride = z.infer<
  typeof CharacterCreationTargetOverrideSchema
>;
export type CharacterCreationNpcProfileType = z.infer<
  typeof CharacterCreationNpcProfileTypeSchema
>;
export type CharacterCreationNpcMiniProfile = z.infer<
  typeof CharacterCreationNpcMiniProfileSchema
>;
export type CharacterEngineDecisionRule = z.infer<
  typeof CharacterEngineDecisionRuleSchema
>;

export type CharacterCreationFormSectionKey = Exclude<
  keyof CharacterCreationForm,
  "semanticSeedIds"
>;

export const CHARACTER_CREATION_FORM_SECTIONS: Array<{
  key: CharacterCreationFormSectionKey;
  label: string;
}> = [
  { key: "writerBible", label: "Writer Bible" },
  { key: "characterEngine", label: "Character Engine" },
  { key: "identity", label: "Character Identity" },
  { key: "appearance", label: "Appearance" },
  { key: "adultAnatomy", label: "Adult Anatomy" },
  { key: "personality", label: "Personality" },
  { key: "cognitiveDrivers", label: "Cognitive Drivers" },
  { key: "psychology", label: "Psychology" },
  { key: "behaviour", label: "Behaviour" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "relationships", label: "Relationships" },
  { key: "npcNetwork", label: "NPC Mini Profiles" },
  { key: "speechCommunication", label: "Speech & Communication" },
  { key: "internalThoughts", label: "Internal Thoughts & Reactions" },
];
