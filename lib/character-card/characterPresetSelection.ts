import {
  BODY_BUILD_PRESETS,
  type BodyBuildPreset,
} from "../../data/bodyBuildPresets";
import {
  getColorPresetsByType,
  type ColorPreset,
} from "../../data/colorPresets";
import {
  compileComplementVocabularyAdditions,
  type ComplementVocabularyPreset,
} from "../../data/complementPresets";
import {
  compileArrangedMatchPresetAdditions,
  type ArrangedMatchPreset,
} from "../../data/arrangedMatchPresets";
import {
  compileCommunicationStylePresetAdditions,
  type CommunicationStylePreset,
} from "../../data/communicationStylePresets";
import {
  compileDescriptiveWritingSeedAdditions,
  type DescriptiveWritingSeed,
} from "../../data/descriptiveWritingSeedPresets";
import {
  compileConflictStylePresetAdditions,
  type ConflictStylePreset,
} from "../../data/conflictStylePresets";
import {
  compileAffectionPresetAdditions,
  type AffectionPreset,
} from "../../data/affectionPresets";
import {
  compileLoyaltyPresetAdditions,
  type LoyaltyPreset,
} from "../../data/loyaltyPresets";
import {
  compileLoveLanguagePresetAdditions,
  type LoveLanguagePreset,
} from "../../data/loveLanguagePresets";
import {
  compileMoralityPresetAdditions,
  type MoralityPreset,
} from "../../data/moralityPresets";
import {
  compileAmbitionPresetAdditions,
  type AmbitionPreset,
} from "../../data/ambitionPresets";
import {
  compileBetrayalPresetAdditions,
  type BetrayalPreset,
} from "../../data/betrayalPresets";
import {
  compileDialectPresetAdditions,
  type DialectPreset,
} from "../../data/dialectPresets";
import {
  compileExilePresetAdditions,
  type ExilePreset,
} from "../../data/exilePresets";
import {
  compileFamilyHistoryPresetAdditions,
  type FamilyHistoryPreset,
} from "../../data/familyHistoryPresets";
import {
  compileFatedReincarnationPresetAdditions,
  type FatedReincarnationPreset,
} from "../../data/fatedReincarnationPresets";
import {
  compileFakeDatingPresetAdditions,
  type FakeDatingPreset,
} from "../../data/fakeDatingPresets";
import {
  compileForbiddenTabooPresetAdditions,
  type ForbiddenTabooPreset,
} from "../../data/forbiddenTabooPresets";
import {
  compileMentorProtegePresetAdditions,
  type MentorProtegePreset,
} from "../../data/mentorProtegePresets";
import {
  FACIAL_FEATURE_PRESETS,
  type FacialFeaturePreset,
} from "../../data/facialFeaturePresets";
import {
  compileFlirtingPresetAdditions,
  type FlirtingPreset,
} from "../../data/flirtingPresets";
import {
  compileFriendsToLoversPresetAdditions,
  type FriendsToLoversPreset,
} from "../../data/friendsToLoversPresets";
import {
  compileFormativeEventPresetAdditions,
  type FormativeEventPreset,
} from "../../data/formativeEventPresets";
import {
  compileGrumpySunshinePresetAdditions,
  type GrumpySunshinePreset,
} from "../../data/grumpySunshinePresets";
import {
  compileDarkObsessivePresetAdditions,
  type DarkObsessivePreset,
} from "../../data/darkObsessivePresets";
import {
  compileFormalArrangedPresetAdditions,
  type FormalArrangedPreset,
} from "../../data/formalArrangedPresets";
import {
  compileAcademicRivalPresetAdditions,
  type AcademicRivalPreset,
} from "../../data/academicRivalPresets";
import {
  compileCaretakerHurtComfortPresetAdditions,
  type CaretakerHurtComfortPreset,
} from "../../data/caretakerHurtComfortPresets";
import {
  compileCaretakerPresetAdditions,
  type CaretakerPreset,
} from "../../data/caretakerPresets";
import {
  compileFrictionPresetAdditions,
  type FrictionPreset,
} from "../../data/frictionPresets";
import {
  compileRivalryPresetAdditions,
  type RivalryPreset,
} from "../../data/rivalryPresets";
import {
  compileDevotionPresetAdditions,
  type DevotionPreset,
} from "../../data/devotionPresets";
import {
  compileObsessionPresetAdditions,
  type ObsessionPreset,
} from "../../data/obsessionPresets";
import {
  compilePossessivePresetAdditions,
  type PossessivePreset,
} from "../../data/possessivePresets";
import {
  compileSlowBurnPresetAdditions,
  type SlowBurnPreset,
} from "../../data/slowBurnPresets";
import {
  compileFlawSecretPresetAdditions,
  type FlawSecretPreset,
} from "../../data/flawSecretPresets";
import {
  compileTeasingPresetAdditions,
  type TeasingPreset,
} from "../../data/teasingPresets";
import {
  compileAgeLifeStagePresetAdditions,
  type AgeLifeStagePreset,
} from "../../data/ageLifeStagePresets";
import {
  compileSpeciesHeritagePresetAdditions,
  type SpeciesHeritagePreset,
} from "../../data/speciesHeritagePresets";
import {
  compileHumanPresetAdditions,
  type HumanPreset,
} from "../../data/humanPresets";
import {
  compileVampirePresetAdditions,
  type VampirePreset,
} from "../../data/vampirePresets";
import {
  compileFaePresetAdditions,
  type FaePreset,
} from "../../data/faePresets";
import {
  compileDemonPresetAdditions,
  type DemonPreset,
} from "../../data/demonPresets";
import {
  compileAngelPresetAdditions,
  type AngelPreset,
} from "../../data/angelPresets";
import {
  compileAndroidPresetAdditions,
  type AndroidPreset,
} from "../../data/androidPresets";
import {
  compileAlienPresetAdditions,
  type AlienPreset,
} from "../../data/alienPresets";
import {
  compileShifterPresetAdditions,
  type ShifterPreset,
} from "../../data/shifterPresets";
import {
  HEIGHT_STATURE_PRESETS,
  type HeightStaturePreset,
} from "../../data/heightStaturePresets";
import {
  HAIR_STYLE_PRESETS,
  compileHairStylePresetAdditions,
  type HairStylePreset,
} from "../../data/hairStylePresets";
import {
  compileOriginWoundPresetAdditions,
  type OriginWoundVocabularyPreset,
} from "../../data/originWoundVocabularyPresets";
import { OUTFIT_PRESETS, type OutfitPreset } from "../../data/outfitPresets";
import {
  compilePetNamePresetAdditions,
  type PetNamePreset,
} from "../../data/petNamePresets";
import {
  compileFormalityPresetAdditions,
  type FormalityPreset,
} from "../../data/formalityPresets";
import {
  compileLossPresetAdditions,
  type LossPreset,
} from "../../data/lossPresets";
import {
  compileJealousyPresetAdditions,
  type JealousyPreset,
} from "../../data/jealousyPresets";
import {
  findRelationshipDynamicPresetById,
  type RelationshipDynamicPreset,
} from "../../data/relationshipDynamicPresets";
import {
  compileRelationshipDynamicVocabularyInjection,
  findRelationshipDynamicVocabularyById,
  getRelationshipDynamicVocabularyByMode,
  type RelationshipDynamicVocabularyPreset,
} from "../../data/relationshipDynamicVocabulary";
import {
  compileRegretPresetAdditions,
  type RegretPreset,
} from "../../data/regretPresets";
import {
  compileSecretPresetAdditions,
  type SecretPreset,
} from "../../data/secretPresets";
import {
  compileSecondChancePresetAdditions,
  type SecondChancePreset,
} from "../../data/secondChancePresets";
import { ALL_ROMANCE_PRESETS, type RomancePreset } from "../../data/romancePresets";
import { SKIN_PRESETS, type SkinPreset } from "../../data/skinPresets";
import {
  compileSpeechStylePresetSummary,
  type SpeechStylePreset,
} from "../../data/speechStylePresets";
import {
  compileSentenceRhythmPresetAdditions,
  type SentenceRhythmPreset,
} from "../../data/sentenceRhythmPresets";
import {
  compileVoiceVocabularyPresetAdditions,
  type VoiceVocabularyPreset,
} from "../../data/voiceVocabularyPresets";
import {
  compileWorkplaceHierarchyPresetAdditions,
  type WorkplaceHierarchyPreset,
} from "../../data/workplaceHierarchyPresets";
import type { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { createEmptyCharacterCardFormValues } from "./createEmptyCharacterCardFormValues";

export interface CharacterPresetSelection {
  name: string;
  romance: RomancePreset;
  height: HeightStaturePreset;
  build: BodyBuildPreset;
  face: FacialFeaturePreset;
  eyeColor: ColorPreset;
  hairColor: ColorPreset;
  hairStyle?: HairStylePreset;
  skin: SkinPreset;
  outfit: OutfitPreset;
  relationshipDynamic: RelationshipDynamicPreset;
  relationshipVocabulary?: RelationshipDynamicVocabularyPreset;
  complementVocabulary?: ComplementVocabularyPreset;
  arrangedMatch?: ArrangedMatchPreset;
  forbiddenTaboo?: ForbiddenTabooPreset;
  mentorProtege?: MentorProtegePreset;
  fakeDating?: FakeDatingPreset;
  grumpySunshine?: GrumpySunshinePreset;
  darkObsessive?: DarkObsessivePreset;
  formalArranged?: FormalArrangedPreset;
  academicRival?: AcademicRivalPreset;
  caretakerHurtComfort?: CaretakerHurtComfortPreset;
  caretaker?: CaretakerPreset;
  friction?: FrictionPreset;
  rivalry?: RivalryPreset;
  devotion?: DevotionPreset;
  obsession?: ObsessionPreset;
  possessive?: PossessivePreset;
  slowBurn?: SlowBurnPreset;
  flawSecret?: FlawSecretPreset;
  teasing?: TeasingPreset;
  ageLifeStage?: AgeLifeStagePreset;
  speciesHeritage?: SpeciesHeritagePreset;
  human?: HumanPreset;
  vampire?: VampirePreset;
  fae?: FaePreset;
  demon?: DemonPreset;
  angel?: AngelPreset;
  android?: AndroidPreset;
  alien?: AlienPreset;
  shifter?: ShifterPreset;
  fatedReincarnation?: FatedReincarnationPreset;
  secondChance?: SecondChancePreset;
  workplaceHierarchy?: WorkplaceHierarchyPreset;
  friendsToLovers?: FriendsToLoversPreset;
  flirtingStyle?: FlirtingPreset;
  affection?: AffectionPreset;
  loyalty?: LoyaltyPreset;
  loveLanguage?: LoveLanguagePreset;
  conflictStyle?: ConflictStylePreset;
  originWound?: OriginWoundVocabularyPreset;
  formativeEvent?: FormativeEventPreset;
  familyHistory?: FamilyHistoryPreset;
  regret?: RegretPreset;
  exile?: ExilePreset;
  betrayal?: BetrayalPreset;
  loss?: LossPreset;
  jealousy?: JealousyPreset;
  secret?: SecretPreset;
  ambition?: AmbitionPreset;
  morality?: MoralityPreset;
  speechStyle?: SpeechStylePreset;
  voiceVocabulary?: VoiceVocabularyPreset;
  dialect?: DialectPreset;
  formality?: FormalityPreset;
  petNames?: PetNamePreset;
  sentenceRhythm?: SentenceRhythmPreset;
  communicationStyle?: CommunicationStylePreset;
  descriptiveWritingSeeds?: readonly DescriptiveWritingSeed[];
}

export interface CompiledCharacterPresetSelection {
  appearancePrompt: {
    naturalLanguage: string;
    tagStyle: string;
  };
  formValues: CharacterCardFormValues;
  systemPromptTags: readonly string[];
  tags: readonly string[];
}

export function createDefaultCharacterPresetSelection(
  name = "Unnamed Character",
): CharacterPresetSelection {
  return {
    name,
    romance: requirePreset(ALL_ROMANCE_PRESETS[0], "romance preset"),
    height: requirePreset(HEIGHT_STATURE_PRESETS[0], "height preset"),
    build: requirePreset(BODY_BUILD_PRESETS[0], "body build preset"),
    face: requirePreset(FACIAL_FEATURE_PRESETS[0], "facial feature preset"),
    eyeColor: requirePreset(getColorPresetsByType("Eyes")[0], "eye color preset"),
    hairColor: requirePreset(getColorPresetsByType("Hair")[0], "hair color preset"),
    hairStyle: requirePreset(HAIR_STYLE_PRESETS[0], "hair style preset"),
    skin: requirePreset(SKIN_PRESETS[0], "skin preset"),
    outfit: requirePreset(OUTFIT_PRESETS[0], "outfit preset"),
    relationshipDynamic: requirePreset(
      findRelationshipDynamicPresetById("dyn_grumpy_sunshine"),
      "relationship dynamic preset",
    ),
  };
}

export function compileCharacterPresetSelection(
  selection: CharacterPresetSelection,
): CompiledCharacterPresetSelection {
  const formValues = createEmptyCharacterCardFormValues();
  const fullName = selection.name.trim() || "Unnamed Character";
  const relationshipVocabulary = resolveRelationshipVocabulary(selection);
  const systemPromptTags = uniquePreserveOrder([
    ...selection.romance.systemPromptTags,
    ...selection.height.systemPromptTags,
    ...selection.build.systemPromptTags,
    ...selection.face.systemPromptTags,
    ...selection.eyeColor.systemPromptTags,
    ...selection.hairColor.systemPromptTags,
    ...(selection.hairStyle?.systemPromptTags ?? []),
    ...selection.skin.systemPromptTags,
    ...selection.outfit.systemPromptTags,
    ...selection.relationshipDynamic.systemPromptTags,
    ...relationshipVocabulary.systemPromptTags,
    ...(selection.complementVocabulary?.systemPromptTags ?? []),
    ...(selection.arrangedMatch?.systemPromptTags ?? []),
    ...(selection.forbiddenTaboo?.systemPromptTags ?? []),
    ...(selection.mentorProtege?.systemPromptTags ?? []),
    ...(selection.fakeDating?.systemPromptTags ?? []),
    ...(selection.grumpySunshine?.systemPromptTags ?? []),
    ...(selection.darkObsessive?.systemPromptTags ?? []),
    ...(selection.formalArranged?.systemPromptTags ?? []),
    ...(selection.academicRival?.systemPromptTags ?? []),
    ...(selection.caretakerHurtComfort?.systemPromptTags ?? []),
    ...(selection.caretaker?.systemPromptTags ?? []),
    ...(selection.friction?.systemPromptTags ?? []),
    ...(selection.rivalry?.systemPromptTags ?? []),
    ...(selection.devotion?.systemPromptTags ?? []),
    ...(selection.obsession?.systemPromptTags ?? []),
    ...(selection.possessive?.systemPromptTags ?? []),
    ...(selection.slowBurn?.systemPromptTags ?? []),
    ...(selection.flawSecret?.systemPromptTags ?? []),
    ...(selection.teasing?.systemPromptTags ?? []),
    ...(selection.ageLifeStage?.systemPromptTags ?? []),
    ...(selection.speciesHeritage?.systemPromptTags ?? []),
    ...(selection.human?.systemPromptTags ?? []),
    ...(selection.vampire?.systemPromptTags ?? []),
    ...(selection.fae?.systemPromptTags ?? []),
    ...(selection.demon?.systemPromptTags ?? []),
    ...(selection.angel?.systemPromptTags ?? []),
    ...(selection.android?.systemPromptTags ?? []),
    ...(selection.alien?.systemPromptTags ?? []),
    ...(selection.shifter?.systemPromptTags ?? []),
    ...(selection.fatedReincarnation?.systemPromptTags ?? []),
    ...(selection.secondChance?.systemPromptTags ?? []),
    ...(selection.workplaceHierarchy?.systemPromptTags ?? []),
    ...(selection.friendsToLovers?.systemPromptTags ?? []),
    ...(selection.flirtingStyle?.systemPromptTags ?? []),
    ...(selection.affection?.systemPromptTags ?? []),
    ...(selection.loyalty?.systemPromptTags ?? []),
    ...(selection.loveLanguage?.systemPromptTags ?? []),
    ...(selection.conflictStyle?.systemPromptTags ?? []),
    ...(selection.originWound?.systemPromptTags ?? []),
    ...(selection.formativeEvent?.systemPromptTags ?? []),
    ...(selection.familyHistory?.systemPromptTags ?? []),
    ...(selection.regret?.systemPromptTags ?? []),
    ...(selection.exile?.systemPromptTags ?? []),
    ...(selection.betrayal?.systemPromptTags ?? []),
    ...(selection.loss?.systemPromptTags ?? []),
    ...(selection.jealousy?.systemPromptTags ?? []),
    ...(selection.secret?.systemPromptTags ?? []),
    ...(selection.ambition?.systemPromptTags ?? []),
    ...(selection.morality?.systemPromptTags ?? []),
    ...(selection.speechStyle?.systemPromptTags ?? []),
    ...(selection.voiceVocabulary?.systemPromptTags ?? []),
    ...(selection.dialect?.systemPromptTags ?? []),
    ...(selection.formality?.systemPromptTags ?? []),
    ...(selection.petNames?.systemPromptTags ?? []),
    ...(selection.sentenceRhythm?.systemPromptTags ?? []),
    ...(selection.communicationStyle?.systemPromptTags ?? []),
    ...compileDescriptiveWritingSeeds(selection).flatMap(
      (seed) => seed.systemPromptTags,
    ),
  ]);
  const tags = uniquePreserveOrder([
    selection.romance.category,
    selection.height.category,
    selection.build.category,
    selection.face.category,
    selection.eyeColor.category,
    selection.hairColor.category,
    ...(selection.hairStyle
      ? [selection.hairStyle.category, selection.hairStyle.label]
      : []),
    selection.skin.category,
    selection.outfit.category,
    selection.relationshipDynamic.mode,
    selection.relationshipDynamic.category,
    selection.relationshipVocabulary?.category ?? relationshipVocabulary.category,
    ...(selection.complementVocabulary
      ? [
          selection.complementVocabulary.dynamicCategory,
          selection.complementVocabulary.vibe,
        ]
      : []),
    ...(selection.arrangedMatch
      ? [selection.arrangedMatch.category, selection.arrangedMatch.label]
      : []),
    ...(selection.forbiddenTaboo
      ? [selection.forbiddenTaboo.category, selection.forbiddenTaboo.label]
      : []),
    ...(selection.mentorProtege
      ? [selection.mentorProtege.category, selection.mentorProtege.label]
      : []),
    ...(selection.fakeDating
      ? [selection.fakeDating.category, selection.fakeDating.label]
      : []),
    ...(selection.grumpySunshine
      ? [selection.grumpySunshine.category, selection.grumpySunshine.label]
      : []),
    ...(selection.darkObsessive
      ? [selection.darkObsessive.category, selection.darkObsessive.label]
      : []),
    ...(selection.formalArranged
      ? [selection.formalArranged.category, selection.formalArranged.label]
      : []),
    ...(selection.academicRival
      ? [selection.academicRival.category, selection.academicRival.label]
      : []),
    ...(selection.caretakerHurtComfort
      ? [
          selection.caretakerHurtComfort.category,
          selection.caretakerHurtComfort.label,
        ]
      : []),
    ...(selection.caretaker
      ? [selection.caretaker.category, selection.caretaker.label]
      : []),
    ...(selection.friction
      ? [selection.friction.category, selection.friction.label]
      : []),
    ...(selection.rivalry
      ? [selection.rivalry.category, selection.rivalry.label]
      : []),
    ...(selection.devotion
      ? [selection.devotion.category, selection.devotion.label]
      : []),
    ...(selection.obsession
      ? [selection.obsession.category, selection.obsession.label]
      : []),
    ...(selection.possessive
      ? [selection.possessive.category, selection.possessive.label]
      : []),
    ...(selection.slowBurn
      ? [selection.slowBurn.category, selection.slowBurn.label]
      : []),
    ...(selection.flawSecret
      ? [selection.flawSecret.category, selection.flawSecret.label]
      : []),
    ...(selection.teasing
      ? [selection.teasing.category, selection.teasing.label]
      : []),
    ...(selection.ageLifeStage
      ? [selection.ageLifeStage.category, selection.ageLifeStage.label]
      : []),
    ...(selection.speciesHeritage
      ? [selection.speciesHeritage.category, selection.speciesHeritage.label]
      : []),
    ...(selection.human ? [selection.human.category, selection.human.label] : []),
    ...(selection.vampire
      ? [selection.vampire.category, selection.vampire.label]
      : []),
    ...(selection.fae ? [selection.fae.category, selection.fae.label] : []),
    ...(selection.demon
      ? [selection.demon.category, selection.demon.label]
      : []),
    ...(selection.angel
      ? [selection.angel.category, selection.angel.label]
      : []),
    ...(selection.android
      ? [selection.android.category, selection.android.label]
      : []),
    ...(selection.alien ? [selection.alien.category, selection.alien.label] : []),
    ...(selection.shifter
      ? [selection.shifter.category, selection.shifter.label]
      : []),
    ...(selection.fatedReincarnation
      ? [selection.fatedReincarnation.category, selection.fatedReincarnation.label]
      : []),
    ...(selection.secondChance
      ? [selection.secondChance.category, selection.secondChance.label]
      : []),
    ...(selection.workplaceHierarchy
      ? [selection.workplaceHierarchy.category, selection.workplaceHierarchy.label]
      : []),
    ...(selection.friendsToLovers
      ? [selection.friendsToLovers.category, selection.friendsToLovers.label]
      : []),
    ...(selection.flirtingStyle
      ? [selection.flirtingStyle.category, selection.flirtingStyle.vibe]
      : []),
    ...(selection.affection
      ? [selection.affection.category, selection.affection.label]
      : []),
    ...(selection.loyalty
      ? [selection.loyalty.category, selection.loyalty.label]
      : []),
    ...(selection.loveLanguage
      ? [selection.loveLanguage.category, selection.loveLanguage.label]
      : []),
    ...(selection.conflictStyle
      ? [selection.conflictStyle.category, selection.conflictStyle.label]
      : []),
    ...(selection.originWound
      ? [selection.originWound.category, selection.originWound.vibe]
      : []),
    ...(selection.formativeEvent
      ? [
          selection.formativeEvent.genreCategory,
          selection.formativeEvent.vibe,
        ]
      : []),
    ...(selection.familyHistory
      ? [
          selection.familyHistory.genreCategory,
          selection.familyHistory.vibe,
        ]
      : []),
    ...(selection.regret
      ? [selection.regret.category, selection.regret.vibe]
      : []),
    ...(selection.exile
      ? [selection.exile.category, selection.exile.vibe]
      : []),
    ...(selection.betrayal
      ? [selection.betrayal.category, selection.betrayal.label]
      : []),
    ...(selection.loss
      ? [selection.loss.category, selection.loss.label]
      : []),
    ...(selection.jealousy
      ? [selection.jealousy.category, selection.jealousy.label]
      : []),
    ...(selection.secret
      ? [selection.secret.category, selection.secret.label]
      : []),
    ...(selection.ambition
      ? [selection.ambition.category, selection.ambition.label]
      : []),
    ...(selection.morality
      ? [selection.morality.category, selection.morality.label]
      : []),
    ...(selection.speechStyle
      ? [selection.speechStyle.category, selection.speechStyle.vibe]
      : []),
    ...(selection.voiceVocabulary
      ? [selection.voiceVocabulary.category, selection.voiceVocabulary.vibe]
      : []),
    ...(selection.dialect
      ? [selection.dialect.category, selection.dialect.vibe]
      : []),
    ...(selection.formality
      ? [selection.formality.category, selection.formality.vibe]
      : []),
    ...(selection.petNames
      ? [selection.petNames.category, selection.petNames.vibe]
      : []),
    ...(selection.sentenceRhythm
      ? [selection.sentenceRhythm.category, selection.sentenceRhythm.vibe]
      : []),
    ...(selection.communicationStyle
      ? [selection.communicationStyle.category, selection.communicationStyle.label]
      : []),
    ...compileDescriptiveWritingSeeds(selection).flatMap((seed) => [
      seed.category,
      seed.label,
    ]),
  ]);

  return {
    appearancePrompt: buildAppearancePrompt(selection),
    formValues: {
      ...formValues,
      fullName,
      height: `${selection.height.measurements} (${selection.height.vibe})`,
      description: buildOverview(selection),
      physicalAppearance: buildPhysicalAppearance(selection),
      personalityPsychology: buildPersonality(selection),
      backgroundStory: buildBackgroundStory(selection),
      relationshipsConnections: buildRelationshipDynamics(selection, relationshipVocabulary),
      speechStyle: buildSpeechStyleText(selection, formValues.speechStyle),
      scenario: buildScenario(selection),
      first_mes: buildFirstMessage(selection),
      creator_notes: "Compiled from the HeartWriteAI preset selection library.",
      system_prompt: buildSystemPrompt(systemPromptTags, relationshipVocabulary, selection),
      tagsText: tags.join(", "),
    },
    systemPromptTags,
    tags,
  };
}

function buildSpeechStyleText(
  selection: CharacterPresetSelection,
  fallback: string,
) {
  const descriptiveWritingAdditions =
    compileDescriptiveWritingAdditionsByLane(selection);

  return joinDefined([
    selection.speechStyle
      ? compileSpeechStylePresetSummary(selection.speechStyle)
      : fallback,
    selection.voiceVocabulary
      ? compileVoiceVocabularyPresetAdditions(selection.voiceVocabulary)
          .speechStyleAddition
      : "",
    selection.dialect
      ? compileDialectPresetAdditions(selection.dialect).speechStyleAddition
      : "",
    selection.formality
      ? compileFormalityPresetAdditions(selection.formality).speechStyleAddition
      : "",
    selection.petNames
      ? compilePetNamePresetAdditions(selection.petNames).speechStyleAddition
      : "",
    selection.sentenceRhythm
      ? compileSentenceRhythmPresetAdditions(selection.sentenceRhythm)
          .speechStyleAddition
      : "",
    selection.communicationStyle
      ? compileCommunicationStylePresetAdditions(selection.communicationStyle)
          .speechStyleAddition
      : "",
    ...descriptiveWritingAdditions.speech,
  ]);
}

function buildOverview(selection: CharacterPresetSelection): string {
  return [
    `Preset archetype: ${selection.romance.archetype}.`,
    `Romance vibe: ${selection.romance.vibe}.`,
    `Relationship dynamic: ${selection.relationshipDynamic.vibe}.`,
    `Aesthetic anchor: ${selection.outfit.styleName}; ${selection.face.vibe}; ${selection.skin.toneName}.`,
  ].join("\n");
}

function buildPhysicalAppearance(selection: CharacterPresetSelection): string {
  const hairStyleAdditions = selection.hairStyle
    ? compileHairStylePresetAdditions(selection.hairStyle)
    : null;
  const descriptiveWritingAdditions =
    compileDescriptiveWritingAdditionsByLane(selection);

  return [
    `Height / stature: ${selection.height.measurements}; ${selection.height.vibe}. ${selection.height.visuals.join(", ")}.`,
    `Build / physique: ${selection.build.description} Visual anchors: ${selection.build.visuals.join(", ")}.`,
    `Facial features: ${selection.face.description} Key features: ${selection.face.keyFeatures.join(", ")}. Resting expression: ${selection.face.restingExpression}`,
    `Eyes: ${selection.eyeColor.colorName} (${selection.eyeColor.hexValue}) - ${selection.eyeColor.description}`,
    `Hair: ${selection.hairColor.colorName} (${selection.hairColor.hexValue}) - ${selection.hairColor.description}`,
    hairStyleAdditions?.appearanceAddition ?? "",
    `Skin / complexion: ${selection.skin.toneName} (${selection.skin.hexValue}) - ${selection.skin.textureDescription} Markings: ${selection.skin.keyMarkings.join(", ")}.`,
    `Clothing / style: ${selection.outfit.styleName}. ${selection.outfit.description} Key garments: ${selection.outfit.keyGarments.join(", ")}. Accessories: ${selection.outfit.accentsAndAccessories.join(", ")}.`,
    ...descriptiveWritingAdditions.appearance,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildPersonality(selection: CharacterPresetSelection): string {
  const descriptiveWritingAdditions =
    compileDescriptiveWritingAdditionsByLane(selection);
  const originWoundAdditions = selection.originWound
    ? compileOriginWoundPresetAdditions(selection.originWound)
    : null;
  const formativeEventAdditions = selection.formativeEvent
    ? compileFormativeEventPresetAdditions(selection.formativeEvent)
    : null;
  const familyHistoryAdditions = selection.familyHistory
    ? compileFamilyHistoryPresetAdditions(selection.familyHistory)
    : null;
  const regretAdditions = selection.regret
    ? compileRegretPresetAdditions(selection.regret)
    : null;
  const exileAdditions = selection.exile
    ? compileExilePresetAdditions(selection.exile)
    : null;
  const betrayalAdditions = selection.betrayal
    ? compileBetrayalPresetAdditions(selection.betrayal)
    : null;
  const lossAdditions = selection.loss
    ? compileLossPresetAdditions(selection.loss)
    : null;
  const jealousyAdditions = selection.jealousy
    ? compileJealousyPresetAdditions(selection.jealousy)
    : null;
  const secretAdditions = selection.secret
    ? compileSecretPresetAdditions(selection.secret)
    : null;
  const ambitionAdditions = selection.ambition
    ? compileAmbitionPresetAdditions(selection.ambition)
    : null;
  const moralityAdditions = selection.morality
    ? compileMoralityPresetAdditions(selection.morality)
    : null;
  const affectionAdditions = selection.affection
    ? compileAffectionPresetAdditions(selection.affection)
    : null;
  const loyaltyAdditions = selection.loyalty
    ? compileLoyaltyPresetAdditions(selection.loyalty)
    : null;
  const loveLanguageAdditions = selection.loveLanguage
    ? compileLoveLanguagePresetAdditions(selection.loveLanguage)
    : null;
  const arrangedMatchAdditions = selection.arrangedMatch
    ? compileArrangedMatchPresetAdditions(selection.arrangedMatch)
    : null;
  const forbiddenTabooAdditions = selection.forbiddenTaboo
    ? compileForbiddenTabooPresetAdditions(selection.forbiddenTaboo)
    : null;
  const mentorProtegeAdditions = selection.mentorProtege
    ? compileMentorProtegePresetAdditions(selection.mentorProtege)
    : null;
  const fakeDatingAdditions = selection.fakeDating
    ? compileFakeDatingPresetAdditions(selection.fakeDating)
    : null;
  const grumpySunshineAdditions = selection.grumpySunshine
    ? compileGrumpySunshinePresetAdditions(selection.grumpySunshine)
    : null;
  const darkObsessiveAdditions = selection.darkObsessive
    ? compileDarkObsessivePresetAdditions(selection.darkObsessive)
    : null;
  const formalArrangedAdditions = selection.formalArranged
    ? compileFormalArrangedPresetAdditions(selection.formalArranged)
    : null;
  const academicRivalAdditions = selection.academicRival
    ? compileAcademicRivalPresetAdditions(selection.academicRival)
    : null;
  const caretakerHurtComfortAdditions = selection.caretakerHurtComfort
    ? compileCaretakerHurtComfortPresetAdditions(selection.caretakerHurtComfort)
    : null;
  const caretakerAdditions = selection.caretaker
    ? compileCaretakerPresetAdditions(selection.caretaker)
    : null;
  const frictionAdditions = selection.friction
    ? compileFrictionPresetAdditions(selection.friction)
    : null;
  const rivalryAdditions = selection.rivalry
    ? compileRivalryPresetAdditions(selection.rivalry)
    : null;
  const devotionAdditions = selection.devotion
    ? compileDevotionPresetAdditions(selection.devotion)
    : null;
  const obsessionAdditions = selection.obsession
    ? compileObsessionPresetAdditions(selection.obsession)
    : null;
  const possessiveAdditions = selection.possessive
    ? compilePossessivePresetAdditions(selection.possessive)
    : null;
  const slowBurnAdditions = selection.slowBurn
    ? compileSlowBurnPresetAdditions(selection.slowBurn)
    : null;
  const flawSecretAdditions = selection.flawSecret
    ? compileFlawSecretPresetAdditions(selection.flawSecret)
    : null;
  const teasingAdditions = selection.teasing
    ? compileTeasingPresetAdditions(selection.teasing)
    : null;
  const ageLifeStageAdditions = selection.ageLifeStage
    ? compileAgeLifeStagePresetAdditions(selection.ageLifeStage)
    : null;
  const speciesHeritageAdditions = selection.speciesHeritage
    ? compileSpeciesHeritagePresetAdditions(selection.speciesHeritage)
    : null;
  const humanAdditions = selection.human
    ? compileHumanPresetAdditions(selection.human)
    : null;
  const vampireAdditions = selection.vampire
    ? compileVampirePresetAdditions(selection.vampire)
    : null;
  const faeAdditions = selection.fae
    ? compileFaePresetAdditions(selection.fae)
    : null;
  const demonAdditions = selection.demon
    ? compileDemonPresetAdditions(selection.demon)
    : null;
  const angelAdditions = selection.angel
    ? compileAngelPresetAdditions(selection.angel)
    : null;
  const androidAdditions = selection.android
    ? compileAndroidPresetAdditions(selection.android)
    : null;
  const alienAdditions = selection.alien
    ? compileAlienPresetAdditions(selection.alien)
    : null;
  const shifterAdditions = selection.shifter
    ? compileShifterPresetAdditions(selection.shifter)
    : null;
  const friendsToLoversAdditions = selection.friendsToLovers
    ? compileFriendsToLoversPresetAdditions(selection.friendsToLovers)
    : null;
  const fatedReincarnationAdditions = selection.fatedReincarnation
    ? compileFatedReincarnationPresetAdditions(selection.fatedReincarnation)
    : null;
  const secondChanceAdditions = selection.secondChance
    ? compileSecondChancePresetAdditions(selection.secondChance)
    : null;
  const workplaceHierarchyAdditions = selection.workplaceHierarchy
    ? compileWorkplaceHierarchyPresetAdditions(selection.workplaceHierarchy)
    : null;
  const communicationStyleAdditions = selection.communicationStyle
    ? compileCommunicationStylePresetAdditions(selection.communicationStyle)
    : null;
  const conflictStyleAdditions = selection.conflictStyle
    ? compileConflictStylePresetAdditions(selection.conflictStyle)
    : null;

  return [
    `Core personality: ${selection.romance.personality.join(", ")}.`,
    `Stature influence: ${selection.height.personalityInfluence.join(", ")}.`,
    `Build influence: ${selection.build.personalityInfluence.join(", ")}.`,
    `Behavioural texture: ${selection.romance.systemPromptTags.join(", ")}.`,
    originWoundAdditions?.personalityAddition ?? "",
    formativeEventAdditions?.personalityAddition ?? "",
    familyHistoryAdditions?.personalityAddition ?? "",
    regretAdditions?.personalityAddition ?? "",
    exileAdditions?.personalityAddition ?? "",
    betrayalAdditions?.personalityAddition ?? "",
    lossAdditions?.personalityAddition ?? "",
    jealousyAdditions?.personalityAddition ?? "",
    secretAdditions?.personalityAddition ?? "",
    ambitionAdditions?.personalityAddition ?? "",
    moralityAdditions?.personalityAddition ?? "",
    affectionAdditions?.personalityAddition ?? "",
    loyaltyAdditions?.personalityAddition ?? "",
    loveLanguageAdditions?.personalityAddition ?? "",
    arrangedMatchAdditions?.personalityAddition ?? "",
    forbiddenTabooAdditions?.personalityAddition ?? "",
    mentorProtegeAdditions?.personalityAddition ?? "",
    fakeDatingAdditions?.personalityAddition ?? "",
    grumpySunshineAdditions?.personalityAddition ?? "",
    darkObsessiveAdditions?.personalityAddition ?? "",
    formalArrangedAdditions?.personalityAddition ?? "",
    academicRivalAdditions?.personalityAddition ?? "",
    caretakerHurtComfortAdditions?.personalityAddition ?? "",
    caretakerAdditions?.personalityAddition ?? "",
    frictionAdditions?.personalityAddition ?? "",
    rivalryAdditions?.personalityAddition ?? "",
    devotionAdditions?.personalityAddition ?? "",
    obsessionAdditions?.personalityAddition ?? "",
    possessiveAdditions?.personalityAddition ?? "",
    slowBurnAdditions?.personalityAddition ?? "",
    flawSecretAdditions?.personalityAddition ?? "",
    teasingAdditions?.personalityAddition ?? "",
    ageLifeStageAdditions?.personalityAddition ?? "",
    speciesHeritageAdditions?.personalityAddition ?? "",
    humanAdditions?.personalityAddition ?? "",
    vampireAdditions?.personalityAddition ?? "",
    faeAdditions?.personalityAddition ?? "",
    demonAdditions?.personalityAddition ?? "",
    angelAdditions?.personalityAddition ?? "",
    androidAdditions?.personalityAddition ?? "",
    alienAdditions?.personalityAddition ?? "",
    shifterAdditions?.personalityAddition ?? "",
    fatedReincarnationAdditions?.personalityAddition ?? "",
    secondChanceAdditions?.personalityAddition ?? "",
    workplaceHierarchyAdditions?.personalityAddition ?? "",
    friendsToLoversAdditions?.personalityAddition ?? "",
    conflictStyleAdditions?.personalityAddition ?? "",
    communicationStyleAdditions?.personalityAddition ?? "",
    ...descriptiveWritingAdditions.personality,
    ...descriptiveWritingAdditions["body-language"],
    ...descriptiveWritingAdditions["emotional-expression"],
  ].join("\n");
}

function buildBackgroundStory(selection: CharacterPresetSelection): string {
  const descriptiveWritingAdditions =
    compileDescriptiveWritingAdditionsByLane(selection);
  const originWoundAdditions = selection.originWound
    ? compileOriginWoundPresetAdditions(selection.originWound)
    : null;
  const formativeEventAdditions = selection.formativeEvent
    ? compileFormativeEventPresetAdditions(selection.formativeEvent)
    : null;
  const familyHistoryAdditions = selection.familyHistory
    ? compileFamilyHistoryPresetAdditions(selection.familyHistory)
    : null;
  const regretAdditions = selection.regret
    ? compileRegretPresetAdditions(selection.regret)
    : null;
  const exileAdditions = selection.exile
    ? compileExilePresetAdditions(selection.exile)
    : null;
  const betrayalAdditions = selection.betrayal
    ? compileBetrayalPresetAdditions(selection.betrayal)
    : null;
  const lossAdditions = selection.loss
    ? compileLossPresetAdditions(selection.loss)
    : null;
  const secretAdditions = selection.secret
    ? compileSecretPresetAdditions(selection.secret)
    : null;
  const ambitionAdditions = selection.ambition
    ? compileAmbitionPresetAdditions(selection.ambition)
    : null;
  const moralityAdditions = selection.morality
    ? compileMoralityPresetAdditions(selection.morality)
    : null;
  const arrangedMatchAdditions = selection.arrangedMatch
    ? compileArrangedMatchPresetAdditions(selection.arrangedMatch)
    : null;
  const forbiddenTabooAdditions = selection.forbiddenTaboo
    ? compileForbiddenTabooPresetAdditions(selection.forbiddenTaboo)
    : null;
  const mentorProtegeAdditions = selection.mentorProtege
    ? compileMentorProtegePresetAdditions(selection.mentorProtege)
    : null;
  const fakeDatingAdditions = selection.fakeDating
    ? compileFakeDatingPresetAdditions(selection.fakeDating)
    : null;
  const grumpySunshineAdditions = selection.grumpySunshine
    ? compileGrumpySunshinePresetAdditions(selection.grumpySunshine)
    : null;
  const darkObsessiveAdditions = selection.darkObsessive
    ? compileDarkObsessivePresetAdditions(selection.darkObsessive)
    : null;
  const formalArrangedAdditions = selection.formalArranged
    ? compileFormalArrangedPresetAdditions(selection.formalArranged)
    : null;
  const academicRivalAdditions = selection.academicRival
    ? compileAcademicRivalPresetAdditions(selection.academicRival)
    : null;
  const caretakerHurtComfortAdditions = selection.caretakerHurtComfort
    ? compileCaretakerHurtComfortPresetAdditions(selection.caretakerHurtComfort)
    : null;
  const caretakerAdditions = selection.caretaker
    ? compileCaretakerPresetAdditions(selection.caretaker)
    : null;
  const frictionAdditions = selection.friction
    ? compileFrictionPresetAdditions(selection.friction)
    : null;
  const rivalryAdditions = selection.rivalry
    ? compileRivalryPresetAdditions(selection.rivalry)
    : null;
  const devotionAdditions = selection.devotion
    ? compileDevotionPresetAdditions(selection.devotion)
    : null;
  const obsessionAdditions = selection.obsession
    ? compileObsessionPresetAdditions(selection.obsession)
    : null;
  const possessiveAdditions = selection.possessive
    ? compilePossessivePresetAdditions(selection.possessive)
    : null;
  const slowBurnAdditions = selection.slowBurn
    ? compileSlowBurnPresetAdditions(selection.slowBurn)
    : null;
  const flawSecretAdditions = selection.flawSecret
    ? compileFlawSecretPresetAdditions(selection.flawSecret)
    : null;
  const teasingAdditions = selection.teasing
    ? compileTeasingPresetAdditions(selection.teasing)
    : null;
  const ageLifeStageAdditions = selection.ageLifeStage
    ? compileAgeLifeStagePresetAdditions(selection.ageLifeStage)
    : null;
  const speciesHeritageAdditions = selection.speciesHeritage
    ? compileSpeciesHeritagePresetAdditions(selection.speciesHeritage)
    : null;
  const humanAdditions = selection.human
    ? compileHumanPresetAdditions(selection.human)
    : null;
  const vampireAdditions = selection.vampire
    ? compileVampirePresetAdditions(selection.vampire)
    : null;
  const faeAdditions = selection.fae
    ? compileFaePresetAdditions(selection.fae)
    : null;
  const demonAdditions = selection.demon
    ? compileDemonPresetAdditions(selection.demon)
    : null;
  const angelAdditions = selection.angel
    ? compileAngelPresetAdditions(selection.angel)
    : null;
  const androidAdditions = selection.android
    ? compileAndroidPresetAdditions(selection.android)
    : null;
  const alienAdditions = selection.alien
    ? compileAlienPresetAdditions(selection.alien)
    : null;
  const shifterAdditions = selection.shifter
    ? compileShifterPresetAdditions(selection.shifter)
    : null;
  const fatedReincarnationAdditions = selection.fatedReincarnation
    ? compileFatedReincarnationPresetAdditions(selection.fatedReincarnation)
    : null;
  const secondChanceAdditions = selection.secondChance
    ? compileSecondChancePresetAdditions(selection.secondChance)
    : null;
  const workplaceHierarchyAdditions = selection.workplaceHierarchy
    ? compileWorkplaceHierarchyPresetAdditions(selection.workplaceHierarchy)
    : null;

  return joinDefined([
    `Romance backstory anchor: ${selection.romance.vibe}.`,
    arrangedMatchAdditions?.backgroundAddition ?? "",
    forbiddenTabooAdditions?.backgroundAddition ?? "",
    mentorProtegeAdditions?.backgroundAddition ?? "",
    fakeDatingAdditions?.backgroundAddition ?? "",
    grumpySunshineAdditions?.backgroundAddition ?? "",
    darkObsessiveAdditions?.backgroundAddition ?? "",
    formalArrangedAdditions?.backgroundAddition ?? "",
    academicRivalAdditions?.backgroundAddition ?? "",
    caretakerHurtComfortAdditions?.backgroundAddition ?? "",
    caretakerAdditions?.backgroundAddition ?? "",
    frictionAdditions?.backgroundAddition ?? "",
    rivalryAdditions?.backgroundAddition ?? "",
    devotionAdditions?.backgroundAddition ?? "",
    obsessionAdditions?.backgroundAddition ?? "",
    possessiveAdditions?.backgroundAddition ?? "",
    slowBurnAdditions?.backgroundAddition ?? "",
    flawSecretAdditions?.backgroundAddition ?? "",
    teasingAdditions?.backgroundAddition ?? "",
    ageLifeStageAdditions?.backgroundAddition ?? "",
    speciesHeritageAdditions?.backgroundAddition ?? "",
    humanAdditions?.backgroundAddition ?? "",
    vampireAdditions?.backgroundAddition ?? "",
    faeAdditions?.backgroundAddition ?? "",
    demonAdditions?.backgroundAddition ?? "",
    angelAdditions?.backgroundAddition ?? "",
    androidAdditions?.backgroundAddition ?? "",
    alienAdditions?.backgroundAddition ?? "",
    shifterAdditions?.backgroundAddition ?? "",
    fatedReincarnationAdditions?.backgroundAddition ?? "",
    secondChanceAdditions?.backgroundAddition ?? "",
    workplaceHierarchyAdditions?.backgroundAddition ?? "",
    originWoundAdditions?.backgroundAddition ?? "",
    formativeEventAdditions?.backgroundAddition ?? "",
    familyHistoryAdditions?.backgroundAddition ?? "",
    regretAdditions?.backgroundAddition ?? "",
    exileAdditions?.backgroundAddition ?? "",
    betrayalAdditions?.backgroundAddition ?? "",
    lossAdditions?.backgroundAddition ?? "",
    secretAdditions?.backgroundAddition ?? "",
    ambitionAdditions?.backgroundAddition ?? "",
    moralityAdditions?.backgroundAddition ?? "",
    ...descriptiveWritingAdditions["body-language"],
    ...descriptiveWritingAdditions["emotional-expression"],
  ]);
}

function buildRelationshipDynamics(
  selection: CharacterPresetSelection,
  relationshipVocabulary: RelationshipDynamicVocabularyPreset,
): string {
  const vocabularyInjection =
    compileRelationshipDynamicVocabularyInjection(relationshipVocabulary);
  const complementAdditions = selection.complementVocabulary
    ? compileComplementVocabularyAdditions(selection.complementVocabulary)
    : null;
  const arrangedMatchAdditions = selection.arrangedMatch
    ? compileArrangedMatchPresetAdditions(selection.arrangedMatch)
    : null;
  const forbiddenTabooAdditions = selection.forbiddenTaboo
    ? compileForbiddenTabooPresetAdditions(selection.forbiddenTaboo)
    : null;
  const mentorProtegeAdditions = selection.mentorProtege
    ? compileMentorProtegePresetAdditions(selection.mentorProtege)
    : null;
  const fakeDatingAdditions = selection.fakeDating
    ? compileFakeDatingPresetAdditions(selection.fakeDating)
    : null;
  const grumpySunshineAdditions = selection.grumpySunshine
    ? compileGrumpySunshinePresetAdditions(selection.grumpySunshine)
    : null;
  const darkObsessiveAdditions = selection.darkObsessive
    ? compileDarkObsessivePresetAdditions(selection.darkObsessive)
    : null;
  const formalArrangedAdditions = selection.formalArranged
    ? compileFormalArrangedPresetAdditions(selection.formalArranged)
    : null;
  const academicRivalAdditions = selection.academicRival
    ? compileAcademicRivalPresetAdditions(selection.academicRival)
    : null;
  const caretakerHurtComfortAdditions = selection.caretakerHurtComfort
    ? compileCaretakerHurtComfortPresetAdditions(selection.caretakerHurtComfort)
    : null;
  const caretakerAdditions = selection.caretaker
    ? compileCaretakerPresetAdditions(selection.caretaker)
    : null;
  const frictionAdditions = selection.friction
    ? compileFrictionPresetAdditions(selection.friction)
    : null;
  const rivalryAdditions = selection.rivalry
    ? compileRivalryPresetAdditions(selection.rivalry)
    : null;
  const devotionAdditions = selection.devotion
    ? compileDevotionPresetAdditions(selection.devotion)
    : null;
  const obsessionAdditions = selection.obsession
    ? compileObsessionPresetAdditions(selection.obsession)
    : null;
  const possessiveAdditions = selection.possessive
    ? compilePossessivePresetAdditions(selection.possessive)
    : null;
  const slowBurnAdditions = selection.slowBurn
    ? compileSlowBurnPresetAdditions(selection.slowBurn)
    : null;
  const flawSecretAdditions = selection.flawSecret
    ? compileFlawSecretPresetAdditions(selection.flawSecret)
    : null;
  const teasingAdditions = selection.teasing
    ? compileTeasingPresetAdditions(selection.teasing)
    : null;
  const ageLifeStageAdditions = selection.ageLifeStage
    ? compileAgeLifeStagePresetAdditions(selection.ageLifeStage)
    : null;
  const speciesHeritageAdditions = selection.speciesHeritage
    ? compileSpeciesHeritagePresetAdditions(selection.speciesHeritage)
    : null;
  const humanAdditions = selection.human
    ? compileHumanPresetAdditions(selection.human)
    : null;
  const vampireAdditions = selection.vampire
    ? compileVampirePresetAdditions(selection.vampire)
    : null;
  const faeAdditions = selection.fae
    ? compileFaePresetAdditions(selection.fae)
    : null;
  const demonAdditions = selection.demon
    ? compileDemonPresetAdditions(selection.demon)
    : null;
  const angelAdditions = selection.angel
    ? compileAngelPresetAdditions(selection.angel)
    : null;
  const androidAdditions = selection.android
    ? compileAndroidPresetAdditions(selection.android)
    : null;
  const alienAdditions = selection.alien
    ? compileAlienPresetAdditions(selection.alien)
    : null;
  const shifterAdditions = selection.shifter
    ? compileShifterPresetAdditions(selection.shifter)
    : null;
  const friendsToLoversAdditions = selection.friendsToLovers
    ? compileFriendsToLoversPresetAdditions(selection.friendsToLovers)
    : null;
  const fatedReincarnationAdditions = selection.fatedReincarnation
    ? compileFatedReincarnationPresetAdditions(selection.fatedReincarnation)
    : null;
  const secondChanceAdditions = selection.secondChance
    ? compileSecondChancePresetAdditions(selection.secondChance)
    : null;
  const workplaceHierarchyAdditions = selection.workplaceHierarchy
    ? compileWorkplaceHierarchyPresetAdditions(selection.workplaceHierarchy)
    : null;
  const flirtingAdditions = selection.flirtingStyle
    ? compileFlirtingPresetAdditions(selection.flirtingStyle)
    : null;
  const affectionAdditions = selection.affection
    ? compileAffectionPresetAdditions(selection.affection)
    : null;
  const loyaltyAdditions = selection.loyalty
    ? compileLoyaltyPresetAdditions(selection.loyalty)
    : null;
  const loveLanguageAdditions = selection.loveLanguage
    ? compileLoveLanguagePresetAdditions(selection.loveLanguage)
    : null;
  const jealousyAdditions = selection.jealousy
    ? compileJealousyPresetAdditions(selection.jealousy)
    : null;
  const conflictStyleAdditions = selection.conflictStyle
    ? compileConflictStylePresetAdditions(selection.conflictStyle)
    : null;
  const hairStyleAdditions = selection.hairStyle
    ? compileHairStylePresetAdditions(selection.hairStyle)
    : null;

  return [
    `Primary dynamics: ${selection.romance.dynamics.join(", ")}.`,
    `Stature dynamics: ${selection.height.dynamics.join(", ")}.`,
    `Physique dynamics: ${selection.build.dynamics.join(", ")}.`,
    `Relationship dynamic vibe: ${selection.relationshipDynamic.vibe}.`,
    `Selected relationship dynamic: ${selection.relationshipDynamic.characterARole} x ${selection.relationshipDynamic.characterBRole}.`,
    `Dynamic premise: ${selection.relationshipDynamic.premise}`,
    `Dynamic pressure: ${selection.relationshipDynamic.pressure}`,
    `Dynamic progression cues: ${selection.relationshipDynamic.progressionCues.join(", ")}.`,
    `Dynamic safety boundary: ${selection.relationshipDynamic.safetyBoundary}`,
    `Lexical palette: ${relationshipVocabulary.vibe}.`,
    vocabularyInjection.lexicalConstraints,
    vocabularyInjection.formattingDirectives,
    complementAdditions?.relationshipAddition ?? "",
    arrangedMatchAdditions?.relationshipAddition ?? "",
    forbiddenTabooAdditions?.relationshipAddition ?? "",
    mentorProtegeAdditions?.relationshipAddition ?? "",
    fakeDatingAdditions?.relationshipAddition ?? "",
    grumpySunshineAdditions?.relationshipAddition ?? "",
    darkObsessiveAdditions?.relationshipAddition ?? "",
    formalArrangedAdditions?.relationshipAddition ?? "",
    academicRivalAdditions?.relationshipAddition ?? "",
    caretakerHurtComfortAdditions?.relationshipAddition ?? "",
    caretakerAdditions?.relationshipAddition ?? "",
    frictionAdditions?.relationshipAddition ?? "",
    rivalryAdditions?.relationshipAddition ?? "",
    devotionAdditions?.relationshipAddition ?? "",
    obsessionAdditions?.relationshipAddition ?? "",
    possessiveAdditions?.relationshipAddition ?? "",
    slowBurnAdditions?.relationshipAddition ?? "",
    flawSecretAdditions?.relationshipAddition ?? "",
    teasingAdditions?.relationshipAddition ?? "",
    ageLifeStageAdditions?.relationshipAddition ?? "",
    speciesHeritageAdditions?.relationshipAddition ?? "",
    humanAdditions?.relationshipAddition ?? "",
    vampireAdditions?.relationshipAddition ?? "",
    faeAdditions?.relationshipAddition ?? "",
    demonAdditions?.relationshipAddition ?? "",
    angelAdditions?.relationshipAddition ?? "",
    androidAdditions?.relationshipAddition ?? "",
    alienAdditions?.relationshipAddition ?? "",
    shifterAdditions?.relationshipAddition ?? "",
    fatedReincarnationAdditions?.relationshipAddition ?? "",
    secondChanceAdditions?.relationshipAddition ?? "",
    workplaceHierarchyAdditions?.relationshipAddition ?? "",
    friendsToLoversAdditions?.relationshipAddition ?? "",
    flirtingAdditions?.personalityAddition ?? "",
    flirtingAdditions?.scenarioAddition ?? "",
    affectionAdditions?.relationshipAddition ?? "",
    loyaltyAdditions?.relationshipAddition ?? "",
    loveLanguageAdditions?.relationshipAddition ?? "",
    conflictStyleAdditions?.relationshipAddition ?? "",
    jealousyAdditions?.relationshipAddition ?? "",
    hairStyleAdditions?.relationshipAddition ?? "",
  ].join("\n");
}

function buildScenario(selection: CharacterPresetSelection): string {
  const flirtingAdditions = selection.flirtingStyle
    ? compileFlirtingPresetAdditions(selection.flirtingStyle)
    : null;
  const hairStyleNote = selection.hairStyle
    ? `Hair cue: ${selection.hairStyle.value}.`
    : "";

  return [
    `A romance setup shaped by ${selection.romance.vibe}, using ${selection.romance.dynamics.join(" and ")} dynamics.`,
    `The active relationship dynamic is ${selection.relationshipDynamic.vibe}: ${selection.relationshipDynamic.pressure}`,
    `The scene should notice ${selection.height.vibe.toLowerCase()}, ${selection.build.vibe.toLowerCase()}, ${selection.face.vibe.toLowerCase()}, ${hairStyleNote} and the clothing language of ${selection.outfit.styleName}.`,
    flirtingAdditions?.scenarioAddition ?? "",
  ].join(" ");
}

function buildFirstMessage(selection: CharacterPresetSelection): string {
  const hairStyleNote = selection.hairStyle
    ? ` styled as ${selection.hairStyle.value.toLowerCase()}`
    : "";

  return [
    `*{{char}} pauses close enough for the details to register: ${selection.eyeColor.colorName.toLowerCase()} eyes, ${selection.hairColor.colorName.toLowerCase()} hair${hairStyleNote}, and the unmistakable silhouette of ${selection.outfit.styleName}. The moment carries the charge of ${selection.romance.vibe.toLowerCase()}, but {{char}} leaves the next move entirely to {{user}}.*`,
    `"Well?"`,
  ].join(" ");
}

function buildSystemPrompt(
  systemPromptTags: readonly string[],
  relationshipVocabulary: RelationshipDynamicVocabularyPreset,
  selection?: CharacterPresetSelection,
): string {
  const vocabularyInjection =
    compileRelationshipDynamicVocabularyInjection(relationshipVocabulary);
  const flirtingAdditions = selection?.flirtingStyle
    ? compileFlirtingPresetAdditions(selection.flirtingStyle)
    : null;
  const affectionAdditions = selection?.affection
    ? compileAffectionPresetAdditions(selection.affection)
    : null;
  const loyaltyAdditions = selection?.loyalty
    ? compileLoyaltyPresetAdditions(selection.loyalty)
    : null;
  const loveLanguageAdditions = selection?.loveLanguage
    ? compileLoveLanguagePresetAdditions(selection.loveLanguage)
    : null;
  const conflictStyleAdditions = selection?.conflictStyle
    ? compileConflictStylePresetAdditions(selection.conflictStyle)
    : null;
  const originWoundAdditions = selection?.originWound
    ? compileOriginWoundPresetAdditions(selection.originWound)
    : null;
  const formativeEventAdditions = selection?.formativeEvent
    ? compileFormativeEventPresetAdditions(selection.formativeEvent)
    : null;
  const familyHistoryAdditions = selection?.familyHistory
    ? compileFamilyHistoryPresetAdditions(selection.familyHistory)
    : null;
  const regretAdditions = selection?.regret
    ? compileRegretPresetAdditions(selection.regret)
    : null;
  const exileAdditions = selection?.exile
    ? compileExilePresetAdditions(selection.exile)
    : null;
  const betrayalAdditions = selection?.betrayal
    ? compileBetrayalPresetAdditions(selection.betrayal)
    : null;
  const lossAdditions = selection?.loss
    ? compileLossPresetAdditions(selection.loss)
    : null;
  const jealousyAdditions = selection?.jealousy
    ? compileJealousyPresetAdditions(selection.jealousy)
    : null;
  const secretAdditions = selection?.secret
    ? compileSecretPresetAdditions(selection.secret)
    : null;
  const ambitionAdditions = selection?.ambition
    ? compileAmbitionPresetAdditions(selection.ambition)
    : null;
  const moralityAdditions = selection?.morality
    ? compileMoralityPresetAdditions(selection.morality)
    : null;
  const complementAdditions = selection?.complementVocabulary
    ? compileComplementVocabularyAdditions(selection.complementVocabulary)
    : null;
  const arrangedMatchAdditions = selection?.arrangedMatch
    ? compileArrangedMatchPresetAdditions(selection.arrangedMatch)
    : null;
  const forbiddenTabooAdditions = selection?.forbiddenTaboo
    ? compileForbiddenTabooPresetAdditions(selection.forbiddenTaboo)
    : null;
  const mentorProtegeAdditions = selection?.mentorProtege
    ? compileMentorProtegePresetAdditions(selection.mentorProtege)
    : null;
  const fakeDatingAdditions = selection?.fakeDating
    ? compileFakeDatingPresetAdditions(selection.fakeDating)
    : null;
  const grumpySunshineAdditions = selection?.grumpySunshine
    ? compileGrumpySunshinePresetAdditions(selection.grumpySunshine)
    : null;
  const darkObsessiveAdditions = selection?.darkObsessive
    ? compileDarkObsessivePresetAdditions(selection.darkObsessive)
    : null;
  const formalArrangedAdditions = selection?.formalArranged
    ? compileFormalArrangedPresetAdditions(selection.formalArranged)
    : null;
  const academicRivalAdditions = selection?.academicRival
    ? compileAcademicRivalPresetAdditions(selection.academicRival)
    : null;
  const caretakerHurtComfortAdditions = selection?.caretakerHurtComfort
    ? compileCaretakerHurtComfortPresetAdditions(selection.caretakerHurtComfort)
    : null;
  const caretakerAdditions = selection?.caretaker
    ? compileCaretakerPresetAdditions(selection.caretaker)
    : null;
  const frictionAdditions = selection?.friction
    ? compileFrictionPresetAdditions(selection.friction)
    : null;
  const rivalryAdditions = selection?.rivalry
    ? compileRivalryPresetAdditions(selection.rivalry)
    : null;
  const devotionAdditions = selection?.devotion
    ? compileDevotionPresetAdditions(selection.devotion)
    : null;
  const obsessionAdditions = selection?.obsession
    ? compileObsessionPresetAdditions(selection.obsession)
    : null;
  const possessiveAdditions = selection?.possessive
    ? compilePossessivePresetAdditions(selection.possessive)
    : null;
  const slowBurnAdditions = selection?.slowBurn
    ? compileSlowBurnPresetAdditions(selection.slowBurn)
    : null;
  const flawSecretAdditions = selection?.flawSecret
    ? compileFlawSecretPresetAdditions(selection.flawSecret)
    : null;
  const teasingAdditions = selection?.teasing
    ? compileTeasingPresetAdditions(selection.teasing)
    : null;
  const ageLifeStageAdditions = selection?.ageLifeStage
    ? compileAgeLifeStagePresetAdditions(selection.ageLifeStage)
    : null;
  const speciesHeritageAdditions = selection?.speciesHeritage
    ? compileSpeciesHeritagePresetAdditions(selection.speciesHeritage)
    : null;
  const humanAdditions = selection?.human
    ? compileHumanPresetAdditions(selection.human)
    : null;
  const vampireAdditions = selection?.vampire
    ? compileVampirePresetAdditions(selection.vampire)
    : null;
  const faeAdditions = selection?.fae
    ? compileFaePresetAdditions(selection.fae)
    : null;
  const demonAdditions = selection?.demon
    ? compileDemonPresetAdditions(selection.demon)
    : null;
  const angelAdditions = selection?.angel
    ? compileAngelPresetAdditions(selection.angel)
    : null;
  const androidAdditions = selection?.android
    ? compileAndroidPresetAdditions(selection.android)
    : null;
  const alienAdditions = selection?.alien
    ? compileAlienPresetAdditions(selection.alien)
    : null;
  const shifterAdditions = selection?.shifter
    ? compileShifterPresetAdditions(selection.shifter)
    : null;
  const friendsToLoversAdditions = selection?.friendsToLovers
    ? compileFriendsToLoversPresetAdditions(selection.friendsToLovers)
    : null;
  const fatedReincarnationAdditions = selection?.fatedReincarnation
    ? compileFatedReincarnationPresetAdditions(selection.fatedReincarnation)
    : null;
  const secondChanceAdditions = selection?.secondChance
    ? compileSecondChancePresetAdditions(selection.secondChance)
    : null;
  const workplaceHierarchyAdditions = selection?.workplaceHierarchy
    ? compileWorkplaceHierarchyPresetAdditions(selection.workplaceHierarchy)
    : null;
  const dialectAdditions = selection?.dialect
    ? compileDialectPresetAdditions(selection.dialect)
    : null;
  const formalityAdditions = selection?.formality
    ? compileFormalityPresetAdditions(selection.formality)
    : null;
  const petNameAdditions = selection?.petNames
    ? compilePetNamePresetAdditions(selection.petNames)
    : null;
  const sentenceRhythmAdditions = selection?.sentenceRhythm
    ? compileSentenceRhythmPresetAdditions(selection.sentenceRhythm)
    : null;
  const communicationStyleAdditions = selection?.communicationStyle
    ? compileCommunicationStylePresetAdditions(selection.communicationStyle)
    : null;
  const hairStyleAdditions = selection?.hairStyle
    ? compileHairStylePresetAdditions(selection.hairStyle)
    : null;
  const descriptiveWritingAdditions = selection
    ? compileDescriptiveWritingSeeds(selection).map(
        (seed) => compileDescriptiveWritingSeedAdditions(seed).systemPromptAddition,
      )
    : [];

  return [
    "Roleplay as {{char}} using the compiled preset library as appearance and behaviour guidance.",
    "Preserve {{user}} agency. Never write {{user}}'s dialogue, actions, thoughts, intentions, or decisions.",
    "Apply the selected relationship dynamic as pressure and subtext, not as forced plot resolution.",
    vocabularyInjection.systemBehavior,
    vocabularyInjection.formattingDirectives,
    complementAdditions?.systemPromptAddition ?? "",
    arrangedMatchAdditions?.systemPromptAddition ?? "",
    forbiddenTabooAdditions?.systemPromptAddition ?? "",
    mentorProtegeAdditions?.systemPromptAddition ?? "",
    fakeDatingAdditions?.systemPromptAddition ?? "",
    grumpySunshineAdditions?.systemPromptAddition ?? "",
    darkObsessiveAdditions?.systemPromptAddition ?? "",
    formalArrangedAdditions?.systemPromptAddition ?? "",
    academicRivalAdditions?.systemPromptAddition ?? "",
    caretakerHurtComfortAdditions?.systemPromptAddition ?? "",
    caretakerAdditions?.systemPromptAddition ?? "",
    frictionAdditions?.systemPromptAddition ?? "",
    rivalryAdditions?.systemPromptAddition ?? "",
    devotionAdditions?.systemPromptAddition ?? "",
    obsessionAdditions?.systemPromptAddition ?? "",
    possessiveAdditions?.systemPromptAddition ?? "",
    slowBurnAdditions?.systemPromptAddition ?? "",
    flawSecretAdditions?.systemPromptAddition ?? "",
    teasingAdditions?.systemPromptAddition ?? "",
    ageLifeStageAdditions?.systemPromptAddition ?? "",
    speciesHeritageAdditions?.systemPromptAddition ?? "",
    humanAdditions?.systemPromptAddition ?? "",
    vampireAdditions?.systemPromptAddition ?? "",
    faeAdditions?.systemPromptAddition ?? "",
    demonAdditions?.systemPromptAddition ?? "",
    angelAdditions?.systemPromptAddition ?? "",
    androidAdditions?.systemPromptAddition ?? "",
    alienAdditions?.systemPromptAddition ?? "",
    shifterAdditions?.systemPromptAddition ?? "",
    fatedReincarnationAdditions?.systemPromptAddition ?? "",
    secondChanceAdditions?.systemPromptAddition ?? "",
    workplaceHierarchyAdditions?.systemPromptAddition ?? "",
    friendsToLoversAdditions?.systemPromptAddition ?? "",
    flirtingAdditions?.systemPromptAddition ?? "",
    affectionAdditions?.systemPromptAddition ?? "",
    loyaltyAdditions?.systemPromptAddition ?? "",
    loveLanguageAdditions?.systemPromptAddition ?? "",
    conflictStyleAdditions?.systemPromptAddition ?? "",
    originWoundAdditions?.systemPromptAddition ?? "",
    formativeEventAdditions?.systemPromptAddition ?? "",
    familyHistoryAdditions?.systemPromptAddition ?? "",
    regretAdditions?.systemPromptAddition ?? "",
    exileAdditions?.systemPromptAddition ?? "",
    betrayalAdditions?.systemPromptAddition ?? "",
    lossAdditions?.systemPromptAddition ?? "",
    jealousyAdditions?.systemPromptAddition ?? "",
    secretAdditions?.systemPromptAddition ?? "",
    ambitionAdditions?.systemPromptAddition ?? "",
    moralityAdditions?.systemPromptAddition ?? "",
    dialectAdditions?.systemPromptAddition ?? "",
    formalityAdditions?.systemPromptAddition ?? "",
    petNameAdditions?.systemPromptAddition ?? "",
    sentenceRhythmAdditions?.systemPromptAddition ?? "",
    communicationStyleAdditions?.systemPromptAddition ?? "",
    hairStyleAdditions?.systemPromptAddition ?? "",
    ...descriptiveWritingAdditions,
    `Preset behaviour tags: ${systemPromptTags.join(", ")}.`,
  ].join("\n");
}

function buildAppearancePrompt(selection: CharacterPresetSelection) {
  const hairStyleValue = selection.hairStyle?.value;
  const naturalLanguage = [
    `${selection.name.trim() || "Unnamed Character"} as ${selection.romance.vibe}.`,
    `${selection.height.vibe}, ${selection.build.vibe}, ${selection.face.vibe}.`,
    `${selection.eyeColor.colorName} eyes, ${selection.hairColor.colorName} hair${hairStyleValue ? ` styled as ${hairStyleValue}` : ""}, ${selection.skin.toneName} skin.`,
    `Wearing ${selection.outfit.styleName}: ${selection.outfit.keyGarments.join(", ")}.`,
  ].join(" ");
  const tagStyle = [
    selection.romance.vibe,
    selection.height.vibe,
    selection.build.vibe,
    selection.face.vibe,
    `${selection.eyeColor.colorName} eyes`,
    `${selection.hairColor.colorName} hair`,
    ...(hairStyleValue ? [hairStyleValue] : []),
    `${selection.skin.toneName} skin`,
    selection.outfit.styleName,
    ...selection.outfit.keyGarments,
  ]
    .map((tag) => tag.toLowerCase())
    .join(", ");

  return { naturalLanguage, tagStyle };
}

function uniquePreserveOrder(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    unique.push(trimmed);
  }

  return unique;
}

function joinDefined(values: readonly string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n\n");
}

function compileDescriptiveWritingSeeds(
  selection: CharacterPresetSelection,
): readonly DescriptiveWritingSeed[] {
  return selection.descriptiveWritingSeeds ?? [];
}

function compileDescriptiveWritingAdditionsByLane(
  selection: CharacterPresetSelection,
): Record<DescriptiveWritingSeed["lane"], string[]> {
  const additions: Record<DescriptiveWritingSeed["lane"], string[]> = {
    appearance: [],
    "body-language": [],
    "emotional-expression": [],
    personality: [],
    speech: [],
  };

  for (const seed of compileDescriptiveWritingSeeds(selection)) {
    additions[seed.lane].push(
      compileDescriptiveWritingSeedAdditions(seed).styleAddition,
    );
  }

  return additions;
}

function resolveRelationshipVocabulary(
  selection: CharacterPresetSelection,
): RelationshipDynamicVocabularyPreset {
  if (selection.relationshipVocabulary) return selection.relationshipVocabulary;

  return requirePreset(
    getRelationshipDynamicVocabularyByMode(selection.relationshipDynamic.mode)[0] ??
      findRelationshipDynamicVocabularyById("vocab_grumpy_sunshine"),
    `relationship vocabulary preset for ${selection.relationshipDynamic.mode}`,
  );
}

function requirePreset<T>(value: T | undefined, label: string): T {
  if (!value) {
    throw new Error(`Missing ${label} data.`);
  }
  return value;
}
