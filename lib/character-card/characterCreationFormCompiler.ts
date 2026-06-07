import {
  CharacterCreationForm,
  CharacterCreationFormSchema,
  HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY,
  HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY,
} from "../../types/character-card/CharacterCreationForm";
import { CharacterCardDataV3 } from "../../types/character-card/CharacterCardDataV3";
import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";
import { createCharacterCardFromFormValues } from "./createCharacterCardFromFormValues";
import { createCharacterCardFormValues } from "./createCharacterCardFormValues";
import { createEmptyCharacterCardFormValues } from "./createEmptyCharacterCardFormValues";
import {
  compileSemanticSeedPromptAdditions,
  compileSemanticSeedPromptAdditionsByLane,
  compileSemanticSeedVisibleTags,
} from "./semanticSeedResolver";

export function createEmptyCharacterCreationForm(): CharacterCreationForm {
  return CharacterCreationFormSchema.parse({});
}

export function parseCharacterCreationForm(value: unknown): CharacterCreationForm {
  return CharacterCreationFormSchema.parse(value ?? {});
}

export function compileCharacterCreationFormToFormValues(
  rawForm: CharacterCreationForm,
  baseValues: CharacterCardFormValues = createEmptyCharacterCardFormValues(),
): CharacterCardFormValues {
  const form = parseCharacterCreationForm(rawForm);
  const semanticTags = compileSemanticSeedVisibleTags(form.semanticSeedIds);

  return {
    ...baseValues,
    fullName: form.identity.characterName,
    aliasesNicknames: form.identity.nicknamesAliases,
    ageBirthdate: joinInlineValues([
      form.identity.age,
      form.identity.birthdate,
    ]),
    raceEthnicity: form.identity.nationalityEthnicity,
    species: form.identity.speciesHeritage,
    birthplace: form.identity.birthplace,
    height: form.appearance.height,
    description: compileDescriptionOverview(form),
    physicalAppearance: compilePhysicalAppearance(form),
    personalityPsychology: compilePersonalityEngine(form),
    backgroundStory: compileBackgroundStory(form),
    speechStyle: compileSpeechStyle(form),
    relationshipsConnections: compileRelationships(form),
    intimacyProfile: compileAdultAnatomy(form),
    tagsText: mergeCommaSeparatedValues(baseValues.tagsText, semanticTags),
  };
}

export function createCharacterCardFromCreationForm(
  sourceCard: CharacterCardPayload,
  form: CharacterCreationForm,
  baseValues?: CharacterCardFormValues,
): CharacterCardV3 {
  const card = createCharacterCardFromFormValues(
    sourceCard,
    compileCharacterCreationFormToFormValues(
      form,
      baseValues ?? createCharacterCardFormValues(sourceCard),
    ),
  );

  return {
    ...card,
    data: {
      ...card.data,
      extensions: createCharacterCreationExtensions(
        card.data.extensions,
        parseCharacterCreationForm(form),
      ),
    },
  };
}

export function compileCharacterCreationFormToCardDataPatch(
  rawForm: CharacterCreationForm,
  currentData: CharacterCardDataV3,
): Partial<CharacterCardDataV3> {
  const form = parseCharacterCreationForm(rawForm);
  const values = compileCharacterCreationFormToFormValues(form, {
    ...createEmptyCharacterCardFormValues(),
    scenario: currentData.scenario,
    first_mes: currentData.first_mes,
    mes_example: currentData.mes_example,
    creator_notes: currentData.creator_notes,
    system_prompt: currentData.system_prompt,
    post_history_instructions: currentData.post_history_instructions,
    tagsText: currentData.tags.join(", "),
    alternateOpenings: [],
    groupOnlyGreetings: currentData.group_only_greetings,
  });
  const compiledCard = createCharacterCardFromFormValues(
    { spec: "chara_card_v3", spec_version: "3.0", data: currentData },
    values,
  );

  return {
    name: compiledCard.data.name,
    description: compiledCard.data.description,
    personality: compiledCard.data.personality,
    tags: compiledCard.data.tags,
    extensions: createCharacterCreationExtensions(currentData.extensions, form),
  };
}

export function createCharacterCreationExtensions(
  currentExtensions: Record<string, unknown>,
  form: CharacterCreationForm,
): Record<string, unknown> {
  return {
    ...currentExtensions,
    [HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY]: form,
    [HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY]:
      createPersonalityEngineExtension(form),
  };
}

function compileDescriptionOverview(form: CharacterCreationForm): string {
  return createSections([
    createSection("Identity", [
      createLine("Pronouns", form.identity.pronouns),
      createLine("Gender Identity", form.identity.genderIdentity),
      createLine("Languages Spoken", form.identity.languagesSpoken),
      createLine("Occupation", form.identity.occupation),
    ]),
    createSection("Lifestyle", [
      createLine("Residence", form.lifestyle.residence),
      createLine("Living Style", form.lifestyle.livingStyle),
      createLine("Routines", form.lifestyle.routines),
      createLine("Wealth", form.lifestyle.wealth),
      createLine("Work / Life Balance", form.lifestyle.workLifeBalance),
      createLine("Hobbies", form.lifestyle.hobbies),
    ]),
    createSection("Behaviour", [
      createLine("Facial Expressions", form.behaviour.facialExpressions),
      createLine("Body Language & Posture", form.behaviour.bodyLanguagePosture),
      createLine("Mannerisms", form.behaviour.mannerisms),
      createLine("Goal-Oriented Actions", form.behaviour.goalOrientedActions),
      createLine("Morality in Action", form.behaviour.moralityInAction),
      createLine("Habits & Routines", form.behaviour.habitsRoutines),
    ]),
  ]);
}

function compilePhysicalAppearance(form: CharacterCreationForm): string {
  return createSections([
    createSection("Appearance", [
      createLine("Build", form.appearance.build),
      createLine("Eyes", form.appearance.eyeColourShape),
      createLine("Hair", form.appearance.hairColourLengthTextureStyle),
      createLine("Skin", form.appearance.skinColourUndertoneTexture),
      createLine("Facial Features", form.appearance.facialFeatures),
      createLine("Piercings", form.appearance.piercings),
      createLine("Tattoos", form.appearance.tattoos),
      createLine("Blemishes / Scars", form.appearance.blemishesScars),
      createLine(
        "Freckles / Moles / Beauty Marks",
        form.appearance.frecklesMolesBeautyMarks,
      ),
      createLine("Outfit", form.appearance.outfit),
    ]),
  ]);
}

function compilePersonalityEngine(form: CharacterCreationForm): string {
  const semanticAdditions = compileSemanticSeedPromptAdditionsByLane(
    form.semanticSeedIds,
  );

  return createSections([
    createSection("Personality", [
      createLine("Archetype", form.personality.archetype),
      createLine("Positive Traits", form.personality.positiveTraits),
      createLine("Flaws", form.personality.flaws),
      createLine("Humor", form.personality.humor),
      createLine("Intelligence", form.personality.intelligence),
      createLine("Social Behaviour", form.personality.socialBehaviour),
    ]),
    createSection("Cognitive Drivers", [
      createLine("Motivation", form.cognitiveDrivers.motivation),
      createLine("Fear", form.cognitiveDrivers.fear),
      createLine("Defenses", form.cognitiveDrivers.defenses),
    ]),
    createSection("Psychology", [
      createLine("Temperament", form.psychology.temperament),
      createLine(
        "Cognitive Distortions",
        form.psychology.cognitiveDistortions,
      ),
      createLine("Decision Engine", form.psychology.decisionEngine),
      createLine("Baseline Affect", form.psychology.baselineAffect),
      createLine(
        "Frustration Threshold",
        form.psychology.frustrationThreshold,
      ),
      createLine("Core Wound", form.psychology.coreWound),
      createLine("Internalized Lie", form.psychology.internalizedLie),
      createLine("Triggers", form.psychology.triggers),
      createLine("Beliefs", form.psychology.beliefs),
      createLine("Moral Flexibility", form.psychology.moralFlexibility),
      createLine("Attachment Style", form.psychology.attachmentStyle),
      createLine("Conflict Style", form.psychology.conflictStyle),
      createLine("Stress Response", form.psychology.stressResponse),
      createLine("Love Languages", form.psychology.loveLanguages),
    ]),
    createSection("Big Five", [
      createLine("Openness", form.psychology.bigFive.openness),
      createLine(
        "Conscientiousness",
        form.psychology.bigFive.conscientiousness,
      ),
      createLine("Extraversion", form.psychology.bigFive.extraversion),
      createLine("Agreeableness", form.psychology.bigFive.agreeableness),
      createLine(
        "Emotional Stability",
        form.psychology.bigFive.emotionalStability,
      ),
    ]),
    semanticAdditions.psychologyAddition,
  ]);
}

function compileBackgroundStory(form: CharacterCreationForm): string {
  return createSections([
    createSection("Internal Thoughts & Reactions", [
      createLine(
        "Psychological Responses",
        form.internalThoughts.psychologicalResponses,
      ),
      createLine(
        "Motivations & Fears",
        form.internalThoughts.motivationsFears,
      ),
      createLine("Internal Monologues", form.internalThoughts.internalMonologues),
    ]),
  ]);
}

function compileSpeechStyle(form: CharacterCreationForm): string {
  return createSections([
    createSection("Speech & Communication", [
      createLine("Tone & Vocabulary", form.speechCommunication.toneVocabulary),
      createLine("Subtext", form.speechCommunication.subtext),
      createLine(
        "Conversational Habits",
        form.speechCommunication.conversationalHabits,
      ),
    ]),
  ]);
}

function compileRelationships(form: CharacterCreationForm): string {
  const semanticAdditions = compileSemanticSeedPromptAdditionsByLane(
    form.semanticSeedIds,
  );

  return createSections([
    createSection("Societal Affiliation & Standing", [
      createLine(
        "Faction or Group",
        form.relationships.affiliationCore.factionOrGroup,
      ),
      createLine(
        "Hierarchical Rank",
        form.relationships.affiliationCore.hierarchicalRank,
      ),
      createLine("Public Status", form.relationships.affiliationCore.publicStatus),
    ]),
    createSection("Rapport Ledger", [
      createLine(
        "Attachment Type",
        form.relationships.emotionalBonds.attachmentType,
      ),
      createLine("Trust Metric", form.relationships.emotionalBonds.trustMetric),
      createLine(
        "Shared History Anchor",
        form.relationships.emotionalBonds.sharedHistoryAnchor,
      ),
    ]),
    createSection("Interactive Friction", [
      createLine(
        "Ideological Clash",
        form.relationships.behavioralFriction.ideologicalClash,
      ),
      createLine("Boundaries", form.relationships.behavioralFriction.boundaries),
      createLine(
        "Micro-Aggressions or Tells",
        form.relationships.behavioralFriction.microAggressionsOrTells,
      ),
    ]),
    createTargetOverrideSection(form),
    semanticAdditions.relationshipAddition,
  ]);
}

function compileAdultAnatomy(form: CharacterCreationForm): string {
  if (!form.adultAnatomy.isNsfwAdultCard) {
    return "";
  }

  return createSections([
    createSection("Adult Anatomy", [
      createLine("Penis", form.adultAnatomy.penisDescriptors),
      createLine(
        "Testicles / Scrotum",
        form.adultAnatomy.testicleScrotumDescriptors,
      ),
      createLine("Nipples", form.adultAnatomy.nippleDescriptors),
      createLine("Breasts", form.adultAnatomy.breastDescriptors),
      createLine("Vagina", form.adultAnatomy.vaginaDescriptors),
      createLine("Anus", form.adultAnatomy.anusDescriptors),
    ]),
  ]);
}

function createPersonalityEngineExtension(form: CharacterCreationForm) {
  return {
    source: "character_creation_form",
    semanticSeedLabels: compileSemanticSeedVisibleTags(form.semanticSeedIds),
    semanticPromptGuidance: compileSemanticSeedPromptAdditions(
      form.semanticSeedIds,
      { header: "Internal semantic routing guidance" },
    ),
    identity: form.identity,
    personality: form.personality,
    cognitiveDrivers: form.cognitiveDrivers,
    psychology: form.psychology,
    behaviour: form.behaviour,
    relationships: form.relationships,
    speechCommunication: form.speechCommunication,
    internalThoughts: form.internalThoughts,
  };
}

function createTargetOverrideSection(form: CharacterCreationForm): string {
  const lines = form.relationships.targetOverrides
    .map((override) =>
      createLine(
        override.targetId || "Target",
        override.contextualPromptInjection,
      ),
    )
    .filter(Boolean);

  return createSection("Generative Triggers & Dynamic Targets", lines);
}

function createSections(sections: string[]): string {
  return sections.filter(Boolean).join("\n\n");
}

function createSection(title: string, lines: string[]): string {
  const content = lines.filter(Boolean).join("\n");

  return content ? `${title}:\n${content}` : "";
}

function createLine(label: string, value: string): string {
  const trimmedValue = value.trim();

  return trimmedValue ? `- ${label}: ${trimmedValue}` : "";
}

function joinInlineValues(values: string[]): string {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" / ");
}

function mergeCommaSeparatedValues(
  currentValue: string,
  nextValues: readonly string[],
): string {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const value of [
    ...currentValue.split(","),
    ...nextValues,
  ]) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(trimmed);
  }

  return merged.join(", ");
}
