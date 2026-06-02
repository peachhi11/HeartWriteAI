import {
  BODY_BUILD_PRESETS,
  type BodyBuildPreset,
} from "../../data/bodyBuildPresets";
import {
  getColorPresetsByType,
  type ColorPreset,
} from "../../data/colorPresets";
import {
  FACIAL_FEATURE_PRESETS,
  type FacialFeaturePreset,
} from "../../data/facialFeaturePresets";
import {
  compileFlirtingPresetAdditions,
  type FlirtingPreset,
} from "../../data/flirtingPresets";
import {
  HEIGHT_STATURE_PRESETS,
  type HeightStaturePreset,
} from "../../data/heightStaturePresets";
import {
  compileOriginWoundPresetAdditions,
  type OriginWoundVocabularyPreset,
} from "../../data/originWoundVocabularyPresets";
import { OUTFIT_PRESETS, type OutfitPreset } from "../../data/outfitPresets";
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
import { ALL_ROMANCE_PRESETS, type RomancePreset } from "../../data/romancePresets";
import { SKIN_PRESETS, type SkinPreset } from "../../data/skinPresets";
import {
  compileSpeechStylePresetSummary,
  type SpeechStylePreset,
} from "../../data/speechStylePresets";
import {
  compileVoiceVocabularyPresetAdditions,
  type VoiceVocabularyPreset,
} from "../../data/voiceVocabularyPresets";
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
  skin: SkinPreset;
  outfit: OutfitPreset;
  relationshipDynamic: RelationshipDynamicPreset;
  relationshipVocabulary?: RelationshipDynamicVocabularyPreset;
  flirtingStyle?: FlirtingPreset;
  originWound?: OriginWoundVocabularyPreset;
  speechStyle?: SpeechStylePreset;
  voiceVocabulary?: VoiceVocabularyPreset;
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
    ...selection.skin.systemPromptTags,
    ...selection.outfit.systemPromptTags,
    ...selection.relationshipDynamic.systemPromptTags,
    ...relationshipVocabulary.systemPromptTags,
    ...(selection.flirtingStyle?.systemPromptTags ?? []),
    ...(selection.originWound?.systemPromptTags ?? []),
    ...(selection.speechStyle?.systemPromptTags ?? []),
    ...(selection.voiceVocabulary?.systemPromptTags ?? []),
  ]);
  const tags = uniquePreserveOrder([
    selection.romance.category,
    selection.height.category,
    selection.build.category,
    selection.face.category,
    selection.eyeColor.category,
    selection.hairColor.category,
    selection.skin.category,
    selection.outfit.category,
    selection.relationshipDynamic.mode,
    selection.relationshipDynamic.category,
    selection.relationshipVocabulary?.category ?? relationshipVocabulary.category,
    ...(selection.flirtingStyle
      ? [selection.flirtingStyle.category, selection.flirtingStyle.vibe]
      : []),
    ...(selection.originWound
      ? [selection.originWound.category, selection.originWound.vibe]
      : []),
    ...(selection.speechStyle
      ? [selection.speechStyle.category, selection.speechStyle.vibe]
      : []),
    ...(selection.voiceVocabulary
      ? [selection.voiceVocabulary.category, selection.voiceVocabulary.vibe]
      : []),
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
  return joinDefined([
    selection.speechStyle
      ? compileSpeechStylePresetSummary(selection.speechStyle)
      : fallback,
    selection.voiceVocabulary
      ? compileVoiceVocabularyPresetAdditions(selection.voiceVocabulary)
          .speechStyleAddition
      : "",
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
  return [
    `Height / stature: ${selection.height.measurements}; ${selection.height.vibe}. ${selection.height.visuals.join(", ")}.`,
    `Build / physique: ${selection.build.description} Visual anchors: ${selection.build.visuals.join(", ")}.`,
    `Facial features: ${selection.face.description} Key features: ${selection.face.keyFeatures.join(", ")}. Resting expression: ${selection.face.restingExpression}`,
    `Eyes: ${selection.eyeColor.colorName} (${selection.eyeColor.hexValue}) - ${selection.eyeColor.description}`,
    `Hair: ${selection.hairColor.colorName} (${selection.hairColor.hexValue}) - ${selection.hairColor.description}`,
    `Skin / complexion: ${selection.skin.toneName} (${selection.skin.hexValue}) - ${selection.skin.textureDescription} Markings: ${selection.skin.keyMarkings.join(", ")}.`,
    `Clothing / style: ${selection.outfit.styleName}. ${selection.outfit.description} Key garments: ${selection.outfit.keyGarments.join(", ")}. Accessories: ${selection.outfit.accentsAndAccessories.join(", ")}.`,
  ].join("\n");
}

function buildPersonality(selection: CharacterPresetSelection): string {
  const originWoundAdditions = selection.originWound
    ? compileOriginWoundPresetAdditions(selection.originWound)
    : null;

  return [
    `Core personality: ${selection.romance.personality.join(", ")}.`,
    `Stature influence: ${selection.height.personalityInfluence.join(", ")}.`,
    `Build influence: ${selection.build.personalityInfluence.join(", ")}.`,
    `Behavioral texture: ${selection.romance.systemPromptTags.join(", ")}.`,
    originWoundAdditions?.personalityAddition ?? "",
  ].join("\n");
}

function buildBackgroundStory(selection: CharacterPresetSelection): string {
  const originWoundAdditions = selection.originWound
    ? compileOriginWoundPresetAdditions(selection.originWound)
    : null;

  return joinDefined([
    `Romance backstory anchor: ${selection.romance.vibe}.`,
    originWoundAdditions?.backgroundAddition ?? "",
  ]);
}

function buildRelationshipDynamics(
  selection: CharacterPresetSelection,
  relationshipVocabulary: RelationshipDynamicVocabularyPreset,
): string {
  const vocabularyInjection =
    compileRelationshipDynamicVocabularyInjection(relationshipVocabulary);
  const flirtingAdditions = selection.flirtingStyle
    ? compileFlirtingPresetAdditions(selection.flirtingStyle)
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
    flirtingAdditions?.personalityAddition ?? "",
    flirtingAdditions?.scenarioAddition ?? "",
  ].join("\n");
}

function buildScenario(selection: CharacterPresetSelection): string {
  const flirtingAdditions = selection.flirtingStyle
    ? compileFlirtingPresetAdditions(selection.flirtingStyle)
    : null;

  return [
    `A romance setup shaped by ${selection.romance.vibe}, using ${selection.romance.dynamics.join(" and ")} dynamics.`,
    `The active relationship dynamic is ${selection.relationshipDynamic.vibe}: ${selection.relationshipDynamic.pressure}`,
    `The scene should notice ${selection.height.vibe.toLowerCase()}, ${selection.build.vibe.toLowerCase()}, ${selection.face.vibe.toLowerCase()}, and the clothing language of ${selection.outfit.styleName}.`,
    flirtingAdditions?.scenarioAddition ?? "",
  ].join(" ");
}

function buildFirstMessage(selection: CharacterPresetSelection): string {
  return [
    `*{{char}} pauses close enough for the details to register: ${selection.eyeColor.colorName.toLowerCase()} eyes, ${selection.hairColor.colorName.toLowerCase()} hair, and the unmistakable silhouette of ${selection.outfit.styleName}. The moment carries the charge of ${selection.romance.vibe.toLowerCase()}, but {{char}} leaves the next move entirely to {{user}}.*`,
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
  const originWoundAdditions = selection?.originWound
    ? compileOriginWoundPresetAdditions(selection.originWound)
    : null;

  return [
    "Roleplay as {{char}} using the compiled preset library as appearance and behavior guidance.",
    "Preserve {{user}} agency. Never write {{user}}'s dialogue, actions, thoughts, intentions, or decisions.",
    "Apply the selected relationship dynamic as pressure and subtext, not as forced plot resolution.",
    vocabularyInjection.systemBehavior,
    vocabularyInjection.formattingDirectives,
    flirtingAdditions?.systemPromptAddition ?? "",
    originWoundAdditions?.systemPromptAddition ?? "",
    `Preset behavior tags: ${systemPromptTags.join(", ")}.`,
  ].join("\n");
}

function buildAppearancePrompt(selection: CharacterPresetSelection) {
  const naturalLanguage = [
    `${selection.name.trim() || "Unnamed Character"} as ${selection.romance.vibe}.`,
    `${selection.height.vibe}, ${selection.build.vibe}, ${selection.face.vibe}.`,
    `${selection.eyeColor.colorName} eyes, ${selection.hairColor.colorName} hair, ${selection.skin.toneName} skin.`,
    `Wearing ${selection.outfit.styleName}: ${selection.outfit.keyGarments.join(", ")}.`,
  ].join(" ");
  const tagStyle = [
    selection.romance.vibe,
    selection.height.vibe,
    selection.build.vibe,
    selection.face.vibe,
    `${selection.eyeColor.colorName} eyes`,
    `${selection.hairColor.colorName} hair`,
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
