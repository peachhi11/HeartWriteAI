import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

import { ValidatedCharacterCardV3 } from "../../types/character-card/CharacterCardV3Schema";
import { CharacterCardData } from "./generator";
import { resolveWorldPlaceholders } from "./placeholderResolver";
import { compileSystemPrompt } from "./promptCompiler";

interface ExportGeneratedCardOptions {
  cardData: CharacterCardData;
  greeting: string;
}

export interface ExportGeneratedCardResult {
  fileName: string;
}

export async function exportGeneratedCardToDesktop({
  cardData,
  greeting,
}: ExportGeneratedCardOptions): Promise<ExportGeneratedCardResult> {
  const name = `${cardData.given_name} ${cardData.surname}`;
  const fileName = `${toSafeFilename(name)}.json`;
  const finalCardPayload = createGeneratedCharacterCardPayload(cardData, greeting);

  await writeTextFile(fileName, JSON.stringify(finalCardPayload, null, 2), {
    baseDir: BaseDirectory.Desktop,
  });

  return { fileName };
}

export function createGeneratedCharacterCardPayload(
  cardData: CharacterCardData,
  greeting: string,
): ValidatedCharacterCardV3 {
  const name = `${cardData.given_name} ${cardData.surname}`;

  return {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      alternate_greetings: [
        ...(cardData.alternateGreetings ?? []),
        ...(cardData.scenarioOpeningPairs ?? []),
      ]
        .map((alternateGreeting) =>
          "completedGreeting" in alternateGreeting
            ? alternateGreeting.completedGreeting.trim()
            : alternateGreeting.alternateFirstMessage.trim(),
        )
        .filter(Boolean)
        .slice(0, 5) ?? [],
      character_version: "1.0.0",
      creator: "HeartWriteAI",
      creator_notes: createCreatorsNotesText(cardData),
      description: resolveWorldPlaceholders(cardData, createMasterDescription(cardData)),
      character_book: cardData.loreEntries?.length
        ? createLorebookPayload(cardData)
        : undefined,
      extensions: {
        amourai: {
          age_generation: {
            age: String(cardData.age),
            apparent_age: cardData.apparent_age
              ? String(cardData.apparent_age)
              : "",
            birth_day: String(cardData.birth_day),
            birth_month: cardData.birth_month,
            birth_year: String(cardData.birth_year),
            zodiac: cardData.zodiac,
          },
          archetype: cardData.archetype,
          creators_notes: cardData.creatorsNotes,
          formatting: cardData.formatting,
          framework: cardData.framework,
          lore_entries: cardData.loreEntries,
          post_history_instructions_generation: cardData.postHistoryInstructions,
          world_lore_placeholder: cardData.worldLorePlaceholders,
          alternate_greeting_generation: cardData.alternateGreetings
            ?.map(
              ({
                aiGenerationDirective,
                associatedTrope,
                forkType,
                greetingId,
              }) => ({
                aiGenerationDirective,
                associatedTrope,
                forkType,
                greetingId,
              }),
            )
            .slice(0, 5),
          scenario_opening_pair_generation: cardData.scenarioOpeningPairs
            ?.map(
              ({
                alternateFirstMessage,
                alternateScenarioContext,
                classificationType,
                pairId,
                pairTitle,
              }) => ({
                alternateFirstMessage,
                alternateScenarioContext,
                classificationType,
                pairId,
                pairTitle,
              }),
            )
            .slice(0, 5),
          speech_style_generation: cardData.speechStyle,
          speech_example_generation: cardData.speechExamples?.slice(0, 5),
          name_generation: {
            char: name,
            firstname: cardData.given_name,
            aura: cardData.species?.nameAura ?? "",
            era: cardData.species?.nameEra ?? "",
            heritage:
              cardData.ethnicity?.culturalHeritage ??
              cardData.species?.heritage ??
              "",
            surname: cardData.surname,
          },
          kink_generation: cardData.kink?.nsfwEnabled
            ? {
                intensityLevel: cardData.kink.intensityLevel,
                nsfwEnabled: cardData.kink.nsfwEnabled,
                preferredSensoryTags: cardData.kink.preferredSensoryTags,
                primaryRole: cardData.kink.primaryRole,
                systemPromptInstruction: cardData.kink.systemPromptInstruction,
              }
            : {
                nsfwEnabled: false,
              },
          fetish_generation: cardData.fetish?.fetishEnabled
            ? {
                aiDescriptiveFocus: cardData.fetish.aiDescriptiveFocus,
                anatomicalFocus: cardData.fetish.anatomicalFocus,
                fetishEnabled: cardData.fetish.fetishEnabled,
                materialPreference: cardData.fetish.materialPreference,
                situationalTrigger: cardData.fetish.situationalTrigger,
                sizeFantasyModifier: cardData.fetish.sizeFantasyModifier,
              }
            : {
                fetishEnabled: false,
              },
          first_message_generation: cardData.firstMessage,
          lorebook_summary: cardData.lorebookSummary,
          intimacy_style_generation: cardData.intimacyStyle
            ? {
                aftercareStyle: cardData.intimacyStyle.aftercareStyle,
                aiBehaviorPrompt: cardData.intimacyStyle.aiBehaviorPrompt,
                expressionType: cardData.intimacyStyle.expressionType,
                physicalLoveLanguage:
                  cardData.intimacyStyle.physicalLoveLanguage,
                verbalCadence: cardData.intimacyStyle.verbalCadence,
              }
            : undefined,
          group_greeting_generation: cardData.groupGreetings
            ?.map(
              ({
                aiGroupDirective,
                formattingStyle,
                greetingId,
                interpersonalDynamic,
                participatingCharacters,
                spotlightDistribution,
              }) => ({
                aiGroupDirective,
                formattingStyle,
                greetingId,
                interpersonalDynamic,
                participatingCharacters,
                spotlightDistribution,
              }),
            )
            .slice(0, 5),
          group_alternate_greeting_generation: cardData.groupAlternateGreetings
            ?.map(
              ({
                aiMultiCharacterPrompt,
                altGreetingId,
                forkCategory,
                includedNpcNames,
                targetSettingVibe,
              }) => ({
                aiMultiCharacterPrompt,
                altGreetingId,
                forkCategory,
                includedNpcNames,
                targetSettingVibe,
              }),
            )
            .slice(0, 5),
          turn_off_generation: cardData.turnOffs
            ? {
                aiReactionPrompt: cardData.turnOffs.aiReactionPrompt,
                behavioralTurnOffs: cardData.turnOffs.behavioralTurnOffs,
                dynamicHardlines: cardData.turnOffs.dynamicHardlines,
                sensoryTurnOffs: cardData.turnOffs.sensoryTurnOffs,
              }
            : undefined,
          ethnicity_generation: cardData.ethnicity
            ? {
                culturalHeritage: cardData.ethnicity.culturalHeritage,
                hasDiasporicBaggage: cardData.ethnicity.hasDiasporicBaggage,
                linguisticMatrix: cardData.ethnicity.linguisticMatrix,
                nativeLanguage: cardData.ethnicity.nativeLanguage,
                region: cardData.ethnicity.region,
                societalContext: cardData.ethnicity.societalContext,
              }
            : undefined,
          nationality_generation: cardData.nationality
            ? {
                legalStatus: cardData.nationality.legalStatus,
                linguisticVibe: cardData.nationality.linguisticVibe,
                passportCountry: cardData.nationality.passportCountry,
                regionalAlliance: cardData.nationality.regionalAlliance,
              }
            : undefined,
          occupation_generation: cardData.occupation
            ? cardData.occupation.kind === "student"
              ? {
                  academicYear: cardData.occupation.academicYear,
                  authorityDynamic: cardData.occupation.authorityDynamic,
                  campusAffiliation: cardData.occupation.campusAffiliation,
                  fundingType: cardData.occupation.fundingType,
                  jobTitle: cardData.occupation.jobTitle,
                  kind: cardData.occupation.kind,
                  majorField: cardData.occupation.majorField,
                  workplaceVibe: cardData.occupation.workplaceVibe,
                }
              : {
                  authorityDynamic: cardData.occupation.authorityDynamic,
                  jobTitle: cardData.occupation.jobTitle,
                  kind: cardData.occupation.kind,
                  professionalDomain: cardData.occupation.professionalDomain,
                  socioeconomicTier: cardData.occupation.socioeconomicTier,
                  workplaceVibe: cardData.occupation.workplaceVibe,
                }
            : undefined,
          race_generation: cardData.race
            ? {
                isCulturallySalient: cardData.race.isCulturallySalient,
                macroGroup: cardData.race.macroGroup,
                narrativeStyle: cardData.race.narrativeStyle,
                physicalDescriptors: cardData.race.physicalDescriptors,
                syncMode: cardData.race.syncMode,
              }
            : undefined,
          relationship_status_generation: cardData.relationshipStatus,
          relationship_generation: cardData.relationships?.slice(0, 3),
          scenario_generation: cardData.scenario,
          tone: cardData.tone,
          species_generation: cardData.species
            ? {
                apparentAge: cardData.species.apparentAge
                  ? String(cardData.species.apparentAge)
                  : "",
                dietaryNeed: cardData.species.dietaryNeed ?? "",
                instinctualTrait: cardData.species.instinctualTrait,
                isImmortal: cardData.species.isImmortal,
                type: cardData.species.type,
              }
            : undefined,
        },
      },
      first_mes: greeting,
      group_only_greetings: [
        ...(cardData.groupGreetings ?? []),
        ...(cardData.groupAlternateGreetings ?? []),
      ]
        .map((groupGreeting) => groupGreeting.completedGreeting.trim())
        .filter(Boolean)
        .slice(0, 5) ?? [],
      mes_example: createMessageExamplesText(cardData),
      name,
      personality: "",
      post_history_instructions: createPostHistoryInstructionsText(cardData),
      scenario: cardData.scenario?.scenePremiseDescription ?? "",
      system_prompt: compileSystemPrompt(cardData),
      tags: ["Generated"],
    },
  };
}

function createPostHistoryInstructionsText(cardData: CharacterCardData) {
  const instructions = cardData.postHistoryInstructions;

  if (!instructions) {
    return "";
  }

  return [
    "--- POST-HISTORY RUNTIME OVERRIDES ---",
    `Injection Token Weight: ${instructions.injectionTokenWeight}`,
    "",
    "[Drift Control]",
    ...instructions.driftControlRules.map((rule) => `- ${rule}`),
    "",
    "[Dynamic Tone Checks]",
    ...instructions.dynamicToneModifiers.map((modifier) => `- ${modifier}`),
    "",
    "[Formatting Hardlines]",
    ...instructions.formattingHardlines.map((hardline) => `- ${hardline}`),
  ].join("\n");
}

function createLorebookPayload(cardData: CharacterCardData) {
  const entries = cardData.loreEntries ?? [];

  return {
    description:
      "Generated granular lore entries keyed for reactive HeartWriteAI runtime insertion.",
    entries: entries.map((entry, index) => ({
      constant: entry.insertionPriority === "Constant_Anchor",
      content: entry.entryContent,
      enabled: true,
      extensions: {
        amourai: {
          domainScope: entry.domainScope,
          insertionPriority: entry.insertionPriority,
          tokenReserveCost: entry.tokenReserveCost,
        },
      },
      id: entry.entryId,
      insertion_order: index,
      keys: entry.activationKeys,
      name: entry.title,
      use_regex: true,
    })),
    extensions: {
      amourai: {
        source: "lore_entries",
      },
    },
    name: `${cardData.given_name} ${cardData.surname} Lorebook`,
    recursive_scanning: true,
    scan_depth: 3,
    token_budget: entries.reduce(
      (total, entry) => total + entry.tokenReserveCost,
      0,
    ),
  };
}

function createCreatorsNotesText(cardData: CharacterCardData) {
  const notes = cardData.creatorsNotes;

  if (!notes) {
    return "";
  }

  return [
    "--- CREATOR NOTES / READ ME ---",
    `Content Rating: ${notes.contentRating.replace(/_/g, " ")}`,
    `Recommended Models: ${notes.recommendedModels.join(", ")}`,
    `Trigger Warnings: ${notes.triggerWarnings.join(", ")}`,
    "",
    "--- IDEAL USER PERSONA ---",
    notes.idealUserPersona,
    "",
    "--- TECHNICAL NOTES ---",
    notes.technicalNotesText,
  ].join("\n");
}

function createMasterDescription(cardData: CharacterCardData) {
  const name = `${cardData.given_name} ${cardData.surname}`;
  const lorebook = cardData.lorebookSummary;

  return [
    "--- BASIC PROFILE ---",
    `Name: {{char}} (${name})`,
    `Age: ${cardData.age}${cardData.apparent_age ? ` (appears ${cardData.apparent_age})` : ""} | Zodiac: ${cardData.zodiac}`,
    `Species: ${cardData.species?.type ?? "Human"} | Origin: ${cardData.race?.macroGroup ?? "Unspecified"} / ${cardData.ethnicity?.culturalHeritage ?? "Unspecified"}`,
    `Occupation: ${cardData.occupation?.jobTitle ?? "Unspecified"}`,
    `Relationship Status: ${cardData.relationshipStatus?.currentLabel ?? "Single"}`,
    "",
    "--- BEHAVIORAL MATRIX ---",
    `Intimacy Style: ${cardData.intimacyStyle?.expressionType ?? "Unspecified"}`,
    `Kink Role: ${cardData.kink?.primaryRole ?? "Switch"} (Intensity: ${cardData.kink?.intensityLevel ?? "Mild_Vanilla"})`,
    `Turn-offs: ${cardData.turnOffs?.behavioralTurnOffs.join(", ") ?? "None"}`,
    `Boundaries: ${cardData.turnOffs?.aiReactionPrompt ?? "Respect pacing and consent."}`,
    `Speech Style: ${cardData.speechStyle?.register ?? "Clipped_Command"} | ${cardData.speechStyle?.vocabularyMode ?? "Sparse_Minimal"} | ${cardData.speechStyle?.addressStyle ?? "No_Pet_Names"}`,
    `Speech Rule: ${cardData.speechStyle?.speechPatternInstruction ?? "{{char}} should keep dialogue consistent with archetype and scene pressure."}`,
    "",
    "--- WORLD LORE SUMMARY ---",
    `Setting: ${lorebook?.universeAnchor ?? "Contemporary Romance Local Canon"}`,
    `Rules: ${lorebook?.worldSystemRules.join(" | ") ?? "Lore supports the active scene without becoming exposition."}`,
    `Context: ${lorebook?.factionOrDynastyContext ?? "Local social pressure shapes the scene."}`,
    "",
    "--- WORLD PLACEHOLDER INDEX ---",
    "World Setting: {{world_setting}}",
    "Faction HQ: {{faction_hq}}",
    "Law System: {{law_system}}",
    "Species Status: {{species_status}}",
    "Class Divide: {{class_divide}}",
    "Public Stigma: {{public_stigma}}",
    "Lore Catalyst: {{lore_catalyst}}",
    "Bloodline Feud: {{bloodline_feud}}",
    "Taboo History: {{taboo_history}}",
  ].join("\n");
}

function createMessageExamplesText(cardData: CharacterCardData) {
  return (
    cardData.speechExamples
      ?.slice(0, 5)
      .map(
        (example) =>
          `<START>\n${example.exampleLine}\n[Context: ${example.usageContext}]`,
      )
      .join("\n\n") ?? ""
  );
}

function toSafeFilename(name: string) {
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return safeName || "character_card";
}
