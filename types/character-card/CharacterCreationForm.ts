import { z } from "zod";

export const HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY =
  "heartwriteai_character_creation_form";
export const HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY =
  "heartwriteai_personality_engine";

const textField = z.string().default("");
const section = <Shape extends z.ZodRawShape>(shape: Shape) =>
  z.preprocess((value) => value ?? {}, z.object(shape));

export const CharacterCreationTargetOverrideSchema = z.object({
  targetId: textField,
  contextualPromptInjection: textField,
});

export const CharacterCreationFormSchema = z.object({
  semanticSeedIds: z.array(z.string()).default([]),
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

export type CharacterCreationFormSectionKey = Exclude<
  keyof CharacterCreationForm,
  "semanticSeedIds"
>;

export const CHARACTER_CREATION_FORM_SECTIONS: Array<{
  key: CharacterCreationFormSectionKey;
  label: string;
}> = [
  { key: "identity", label: "Character Identity" },
  { key: "appearance", label: "Appearance" },
  { key: "adultAnatomy", label: "Adult Anatomy" },
  { key: "personality", label: "Personality" },
  { key: "cognitiveDrivers", label: "Cognitive Drivers" },
  { key: "psychology", label: "Psychology" },
  { key: "behaviour", label: "Behaviour" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "relationships", label: "Relationships" },
  { key: "speechCommunication", label: "Speech & Communication" },
  { key: "internalThoughts", label: "Internal Thoughts & Reactions" },
];
