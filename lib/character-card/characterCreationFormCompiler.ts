import {
  CharacterCreationForm,
  CharacterCreationFormSchema,
  HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY,
  HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY,
  HEARTWRITE_CHARACTER_TRUTH_SEPARATION_EXTENSION_KEY,
  HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY,
  HEARTWRITE_WRITER_BIBLE_EXTENSION_KEY,
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
import {
  compileCharacterEngineForRuntime,
  createCharacterEngineAuthoringProjection,
  createWriterBibleAuthoringProjection,
} from "./characterAuthoringTabs";

export interface CharacterCreationLorebookEntryDraft {
  name: string;
  content: string;
  keys: string[];
  extensions: {
    heartwriteai: {
      entryKind: "relationship" | "scenario" | "runtime";
      source: "character_creation_story_truth";
      hiddenFromUser: boolean;
      reviewRequired: boolean;
    };
  };
}

export interface CharacterCreationLorebookDraft {
  spec: "lorebook_v3";
  data: {
    name: string;
    description: string;
    entries: CharacterCreationLorebookEntryDraft[];
    extensions: Record<string, unknown>;
  };
}

export interface CharacterCreationScenarioTruthDraft {
  title: string;
  content: string;
  settingTruths: string[];
  source: "character_creation_setting_truth";
}

export interface CharacterCreationTruthSeparatedOutputs {
  characterCardValues: CharacterCardFormValues;
  storyLorebook: CharacterCreationLorebookDraft;
  scenario: CharacterCreationScenarioTruthDraft;
  leakIssues: string[];
}

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
    birthplace: "",
    height: form.appearance.height,
    description: scrubCardTruthText(compileDescriptionOverview(form)),
    physicalAppearance: scrubCardTruthText(compilePhysicalAppearance(form)),
    personalityPsychology: scrubCardTruthText(compilePersonalityEngine(form)),
    backgroundStory: scrubCardTruthText(compileInternalProcessing(form)),
    speechStyle: scrubCardTruthText(compileSpeechStyle(form)),
    relationshipsConnections: scrubCardTruthText(compileRelationalArchitecture(form)),
    intimacyProfile: scrubCardTruthText(compileAdultAnatomy(form)),
    tagsText: mergeCommaSeparatedValues(baseValues.tagsText, semanticTags),
  };
}

export function compileCharacterCreationFormToTruthSeparatedOutputs(
  rawForm: CharacterCreationForm,
  baseValues: CharacterCardFormValues = createEmptyCharacterCardFormValues(),
): CharacterCreationTruthSeparatedOutputs {
  const form = parseCharacterCreationForm(rawForm);
  const characterCardValues = compileCharacterCreationFormToFormValues(
    form,
    baseValues,
  );

  return {
    characterCardValues,
    storyLorebook: compileCharacterCreationFormToStoryLorebook(form),
    scenario: compileCharacterCreationFormToScenarioTruth(form),
    leakIssues: findCharacterTruthLeakIssues(characterCardValues),
  };
}

export function compileCharacterCreationFormToStoryLorebook(
  rawForm: CharacterCreationForm,
): CharacterCreationLorebookDraft {
  const form = parseCharacterCreationForm(rawForm);
  const characterName = form.identity.characterName.trim() || "Character";
  const entries = [
    createStoryLorebookEntry(
      "Relationship Story Truths",
      [
        createLine(
          "Faction or group",
          form.relationships.affiliationCore.factionOrGroup,
        ),
        createLine(
          "Hierarchical rank",
          form.relationships.affiliationCore.hierarchicalRank,
        ),
        createLine("Public status", form.relationships.affiliationCore.publicStatus),
        createLine(
          "Shared history anchor",
          form.relationships.emotionalBonds.sharedHistoryAnchor,
        ),
      ],
      [characterName, "relationship", "story truth"],
      "relationship",
    ),
    ...form.relationships.targetOverrides.map((override, index) =>
      createStoryLorebookEntry(
        override.targetId.trim()
          ? `Target Override: ${override.targetId.trim()}`
          : `Target Override ${index + 1}`,
        [
          createLine("Target", override.targetId),
          createLine("Scenario-specific behavior", override.contextualPromptInjection),
        ],
        uniqueList([
          characterName,
          override.targetId,
          "target override",
          "story truth",
        ]),
        "runtime",
      ),
    ),
  ].filter((entry) => entry.content.trim().length > 0);

  return {
    spec: "lorebook_v3",
    data: {
      name: `${characterName} Story Truths`,
      description:
        "Scenario-specific relationship and target facts kept out of the portable character card.",
      entries,
      extensions: {
        heartwriteai: {
          source: "character_creation_story_truth",
          tier: "story_specific_truths",
        },
      },
    },
  };
}

export function compileCharacterCreationFormToScenarioTruth(
  rawForm: CharacterCreationForm,
): CharacterCreationScenarioTruthDraft {
  const form = parseCharacterCreationForm(rawForm);
  const characterName = form.identity.characterName.trim() || "Character";
  const settingTruths = [
    createLine("Birthplace", form.identity.birthplace),
    createLine("Residence", form.lifestyle.residence),
    createLine("Living style", form.lifestyle.livingStyle),
    createLine("Wealth", form.lifestyle.wealth),
    createLine("Work / life balance", form.lifestyle.workLifeBalance),
    createLine(
      "Affiliation",
      form.relationships.affiliationCore.factionOrGroup,
    ),
  ].filter(Boolean);

  return {
    title: `${characterName} Setting Truths`,
    content: createSection("Setting Truths", settingTruths),
    settingTruths,
    source: "character_creation_setting_truth",
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
  const characterTruthOnlyForm = createCharacterTruthOnlyForm(form);

  return {
    ...currentExtensions,
    [HEARTWRITE_CHARACTER_CREATION_EXTENSION_KEY]: characterTruthOnlyForm,
    [HEARTWRITE_CHARACTER_TRUTH_SEPARATION_EXTENSION_KEY]:
      createTruthSeparationExtension(form),
    [HEARTWRITE_PERSONALITY_ENGINE_EXTENSION_KEY]:
      createPersonalityEngineExtension(characterTruthOnlyForm),
    [HEARTWRITE_WRITER_BIBLE_EXTENSION_KEY]:
      createWriterBibleAuthoringProjection(form),
    [HEARTWRITE_CHARACTER_ENGINE_EXTENSION_KEY]:
      createCharacterEngineAuthoringProjection(characterTruthOnlyForm),
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
    createSection("Life Pattern Generator", [
      createLine("Routines", form.lifestyle.routines),
      createLine("Work / Life Balance Pattern", form.lifestyle.workLifeBalance),
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
  const characterEngine = compileCharacterEngineForRuntime(form);

  return createSections([
    characterEngine,
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

function compileInternalProcessing(form: CharacterCreationForm): string {
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

function compileRelationalArchitecture(form: CharacterCreationForm): string {
  const semanticAdditions = compileSemanticSeedPromptAdditionsByLane(
    form.semanticSeedIds,
  );

  return createSections([
    createSection("Relational Architecture", [
      createLine(
        "Attachment Type",
        form.relationships.emotionalBonds.attachmentType,
      ),
      createLine("Trust Metric", form.relationships.emotionalBonds.trustMetric),
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
    tier: "character_truth",
    characterEngineGuidance: compileCharacterEngineForRuntime(form),
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
    relationalArchitecture: {
      emotionalBonds: {
        attachmentType: form.relationships.emotionalBonds.attachmentType,
        trustMetric: form.relationships.emotionalBonds.trustMetric,
      },
      behavioralFriction: form.relationships.behavioralFriction,
    },
    speechCommunication: form.speechCommunication,
    internalThoughts: form.internalThoughts,
  };
}

function createCharacterTruthOnlyForm(
  rawForm: CharacterCreationForm,
): CharacterCreationForm {
  const form = parseCharacterCreationForm(rawForm);

  const truthOnlyForm = {
    ...form,
    writerBible: {
      ...form.writerBible,
      projectTitle: "",
      humanSummary: "",
      themes: "",
      worldReference: "",
      characterReference: "",
      relationshipArc: "",
      styleNotes: "",
      activeThreads: "",
      sourceNotes: "",
    },
    identity: {
      ...form.identity,
      birthplace: "",
    },
    lifestyle: {
      ...form.lifestyle,
      residence: "",
      livingStyle: "",
      wealth: "",
    },
    relationships: {
      ...form.relationships,
      affiliationCore: {
        factionOrGroup: "",
        hierarchicalRank: "",
        publicStatus: "",
      },
      emotionalBonds: {
        ...form.relationships.emotionalBonds,
        sharedHistoryAnchor: "",
      },
      targetOverrides: [],
    },
  };

  return parseCharacterCreationForm(sanitizeCharacterTruthValue(truthOnlyForm));
}

function createTruthSeparationExtension(form: CharacterCreationForm) {
  return {
    source: "character_creation_form",
    tierPolicy: {
      characterCard:
        "Core identity, behavioral laws, defenses, voice, and portable relational architecture only.",
      storyLorebook:
        "Scenario-specific relationship facts, target overrides, shared history, secrets, and NPC material.",
      scenario:
        "Setting, location, social pressure, economic context, and world facts.",
    },
    storyTruthEntryCount:
      compileCharacterCreationFormToStoryLorebook(form).data.entries.length,
    settingTruthCount:
      compileCharacterCreationFormToScenarioTruth(form).settingTruths.length,
  };
}

function createStoryLorebookEntry(
  name: string,
  lines: string[],
  keys: string[],
  entryKind: "relationship" | "scenario" | "runtime",
): CharacterCreationLorebookEntryDraft {
  return {
    name,
    content: lines.filter(Boolean).join("\n"),
    keys: uniqueList(keys),
    extensions: {
      heartwriteai: {
        entryKind,
        source: "character_creation_story_truth",
        hiddenFromUser: entryKind === "runtime",
        reviewRequired: true,
      },
    },
  };
}

export function findCharacterTruthLeakIssues(
  valuesOrText: CharacterCardFormValues | string,
): string[] {
  const text =
    typeof valuesOrText === "string"
      ? valuesOrText
      : [
          valuesOrText.description,
          valuesOrText.physicalAppearance,
          valuesOrText.personalityPsychology,
          valuesOrText.backgroundStory,
          valuesOrText.speechStyle,
          valuesOrText.relationshipsConnections,
          valuesOrText.intimacyProfile,
        ].join("\n");
  const issues: string[] = [];

  if (/\{\{user\}\}/i.test(text)) {
    issues.push("Character truth projection references {{user}}.");
  }
  if (/\bNPCs?\b/.test(text)) {
    issues.push("Character truth projection references NPCs.");
  }
  if (/shared history|kept each other's secrets|family inquiry/i.test(text)) {
    issues.push("Character truth projection includes story-specific backstory.");
  }
  if (/publicly formal|privately protective|estate household/i.test(text)) {
    issues.push("Character truth projection includes scenario relationship status.");
  }

  return issues;
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

function scrubCardTruthText(value: string): string {
  return value
    .replaceAll("{{user}}", "the other person")
    .replace(/\bNPCs?\b/g, "other people")
    .replace(/\s+$/gm, "")
    .trim();
}

function sanitizeCharacterTruthValue(value: unknown): unknown {
  if (typeof value === "string") {
    return scrubCardTruthText(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeCharacterTruthValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeCharacterTruthValue(nestedValue),
      ]),
    );
  }

  return value;
}

function uniqueList(values: readonly (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const trimmed = value?.trim();
    const key = trimmed?.toLowerCase();
    if (!trimmed || !key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(trimmed);
  }

  return output;
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
