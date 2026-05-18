import {
  CharacterCardData,
  CreatorsNotesContentRating,
  GeneratedAlternateGreetingData,
  GeneratedArchetypeConfigurationData,
  GeneratedCreatorsNotesData,
  GeneratedGroupAlternateGreetingData,
  GeneratedGroupGreetingData,
  EthnicityRegion,
  GeneratedFetishData,
  GeneratedFirstMessageData,
  GeneratedFormattingConfigurationData,
  GeneratedFrameworkConfigurationData,
  GeneratedIntimacyStyleData,
  GeneratedKinkData,
  GeneratedLoreEntryData,
  GeneratedLorebookSummaryData,
  GeneratedPostHistoryInstructionsData,
  GeneratedToneConfigurationData,
  GeneratedWorldLorePlaceholderData,
  GeneratedNPCRelationshipData,
  GeneratedRelationshipStatusData,
  GeneratedScenarioData,
  GeneratedScenarioOpeningPairData,
  GeneratedTurnOffData,
  LinguisticMatrix,
  NationalityLegalStatus,
  NationalityRegionalAlliance,
  OccupationAuthorityDynamic,
  OccupationProfessionalDomain,
  OccupationSocioeconomicTier,
  RaceMacroGroup,
  SpeciesType,
  StudentAcademicYear,
  StudentFundingType,
  StudentMajorField,
} from "@/lib/character-card/generator";

export interface BuildCharacterCardRequest {
  alternateGreetings?: GeneratedAlternateGreetingData[];
  archetype?: GeneratedArchetypeConfigurationData;
  anchorYear?: number;
  creatorsNotes?: GeneratedCreatorsNotesData;
  ethnicityRegion?: EthnicityRegion;
  fetish?: GeneratedFetishData;
  firstMessage?: GeneratedFirstMessageData;
  formatting?: GeneratedFormattingConfigurationData;
  framework?: GeneratedFrameworkConfigurationData;
  groupAlternateGreetings?: GeneratedGroupAlternateGreetingData[];
  groupGreetings?: GeneratedGroupGreetingData[];
  intimacyStyle?: GeneratedIntimacyStyleData;
  kink?: GeneratedKinkData;
  linguisticMatrix?: LinguisticMatrix;
  loreEntries?: GeneratedLoreEntryData[];
  lorebookSummary?: GeneratedLorebookSummaryData;
  nationalityCountry?: string;
  nationalityLegalStatus?: NationalityLegalStatus;
  nationalityLinguisticVibe?: string;
  nationalityRegionalAlliance?: NationalityRegionalAlliance;
  occupationAcademicYear?: StudentAcademicYear;
  occupationAuthorityDynamic?: OccupationAuthorityDynamic;
  occupationCampusAffiliation?: string;
  occupationFundingType?: StudentFundingType;
  occupationJobTitle?: string;
  occupationMajorField?: StudentMajorField;
  occupationProfessionalDomain?: OccupationProfessionalDomain;
  occupationSocioeconomicTier?: OccupationSocioeconomicTier;
  occupationWorkplaceVibe?: string;
  powerDynamic?: string;
  postHistoryInstructions?: GeneratedPostHistoryInstructionsData;
  raceMacroGroup?: RaceMacroGroup;
  relationshipStatus?: GeneratedRelationshipStatusData;
  relationships?: GeneratedNPCRelationshipData[];
  scenario?: GeneratedScenarioData;
  scenarioOpeningPairs?: GeneratedScenarioOpeningPairData[];
  speciesType?: SpeciesType;
  tone?: GeneratedToneConfigurationData;
  trope?: string;
  turnOffs?: GeneratedTurnOffData;
  worldLorePlaceholders?: GeneratedWorldLorePlaceholderData[];
}

export type { CreatorsNotesContentRating };

export interface BuildCharacterCardResult {
  greeting: string;
  meta: CharacterCardData;
  systemPrompt: string;
}

export async function buildCharacterCard(
  request: BuildCharacterCardRequest = {},
): Promise<BuildCharacterCardResult> {
  const response = await fetch("/api/character-card/build", {
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const message =
      errorPayload &&
      typeof errorPayload === "object" &&
      "error" in errorPayload &&
      typeof errorPayload.error === "string"
        ? errorPayload.error
        : "Character card generation failed.";

    throw new Error(message);
  }

  return response.json() as Promise<BuildCharacterCardResult>;
}
