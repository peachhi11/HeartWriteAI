export interface CharacterCardData {
  given_name: string;
  surname: string;
  age: number;
  alternateGreetings?: GeneratedAlternateGreetingData[];
  apparent_age?: number;
  archetype?: GeneratedArchetypeConfigurationData;
  birth_year: number;
  birth_month: string;
  birth_day: number;
  creatorsNotes?: GeneratedCreatorsNotesData;
  dialogueArrays?: GeneratedDialogueArrayData;
  ethnicity?: GeneratedEthnicityData;
  fetish?: GeneratedFetishData;
  firstMessage?: GeneratedFirstMessageData;
  formatting?: GeneratedFormattingConfigurationData;
  framework?: GeneratedFrameworkConfigurationData;
  groupAlternateGreetings?: GeneratedGroupAlternateGreetingData[];
  groupGreetings?: GeneratedGroupGreetingData[];
  intimacyStyle?: GeneratedIntimacyStyleData;
  kink?: GeneratedKinkData;
  loreEntries?: GeneratedLoreEntryData[];
  lorebookSummary?: GeneratedLorebookSummaryData;
  nationality?: GeneratedNationalityData;
  occupation?: GeneratedOccupationData;
  postHistoryInstructions?: GeneratedPostHistoryInstructionsData;
  proseGuidance?: GeneratedProseGuidanceData;
  race?: GeneratedRaceData;
  relationshipStatus?: GeneratedRelationshipStatusData;
  relationships?: GeneratedNPCRelationshipData[];
  scenario?: GeneratedScenarioData;
  scenarioOpeningPairs?: GeneratedScenarioOpeningPairData[];
  speechExamples?: GeneratedSpeechExampleData[];
  speechStyle?: GeneratedSpeechStyleData;
  tone?: GeneratedToneConfigurationData;
  turnOffs?: GeneratedTurnOffData;
  worldLorePlaceholders?: GeneratedWorldLorePlaceholderData[];
  zodiac: ZodiacSign;
  species?: GeneratedSpeciesData;
}

export type ZodiacSign =
  | "Aquarius"
  | "Aries"
  | "Cancer"
  | "Capricorn"
  | "Gemini"
  | "Leo"
  | "Libra"
  | "Pisces"
  | "Sagittarius"
  | "Scorpio"
  | "Taurus"
  | "Virgo";

export interface AgeGapRomanceOptions {
  alternateGreetings?: GeneratedAlternateGreetingData[];
  archetype?: GeneratedArchetypeConfigurationData;
  anchorYear?: number;
  creatorsNotes?: GeneratedCreatorsNotesData;
  dialogueArrays?: GeneratedDialogueArrayData;
  ethnicityRegion?: EthnicityRegion;
  fetish?: GeneratedFetishData;
  firstMessage?: GeneratedFirstMessageData;
  formatting?: GeneratedFormattingConfigurationData;
  framework?: GeneratedFrameworkConfigurationData;
  groupAlternateGreetings?: GeneratedGroupAlternateGreetingData[];
  groupGreetings?: GeneratedGroupGreetingData[];
  intimacyStyle?: GeneratedIntimacyStyleData;
  kink?: GeneratedKinkData;
  loreEntries?: GeneratedLoreEntryData[];
  linguisticMatrix?: LinguisticMatrix;
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
  proseGuidance?: GeneratedProseGuidanceData;
  raceMacroGroup?: RaceMacroGroup;
  relationshipStatus?: GeneratedRelationshipStatusData;
  relationships?: GeneratedNPCRelationshipData[];
  random?: () => number;
  scenario?: GeneratedScenarioData;
  scenarioOpeningPairs?: GeneratedScenarioOpeningPairData[];
  speechExamples?: GeneratedSpeechExampleData[];
  speechStyle?: GeneratedSpeechStyleData;
  speciesType?: SpeciesType;
  tone?: GeneratedToneConfigurationData;
  trope?: string;
  turnOffs?: GeneratedTurnOffData;
  worldLorePlaceholders?: GeneratedWorldLorePlaceholderData[];
}

export type AlternateGreetingForkType =
  | "Canon_Divergence"
  | "Timeline_Shift"
  | "Tone_Escalation"
  | "Universe_AU";

export interface GeneratedAlternateGreetingData {
  aiGenerationDirective: string;
  associatedTrope: string;
  completedGreeting: string;
  forkType: AlternateGreetingForkType;
  greetingId: string;
}

export type GroupGreetingSpotlightDistribution =
  | "Duo_Synergy"
  | "Ensemble_Equal"
  | "Leader_Alpha"
  | "User_Ambush";
export type GroupGreetingInterpersonalDynamic =
  | "Hostile_Front"
  | "Internal_Fracture"
  | "Love_Triangle_Rivalry"
  | "Wingman_Loop";
export type GroupGreetingFormattingStyle =
  | "Choreographed"
  | "Explicit_Name_Tags"
  | "Paragraph_Isolated";

export interface GeneratedGroupGreetingData {
  aiGroupDirective: string;
  completedGreeting: string;
  formattingStyle: GroupGreetingFormattingStyle;
  greetingId: string;
  interpersonalDynamic: GroupGreetingInterpersonalDynamic;
  participatingCharacters: string[];
  spotlightDistribution: GroupGreetingSpotlightDistribution;
}

export type GroupAlternateGreetingForkCategory =
  | "Collective_AU"
  | "Group_Escalation_Climax"
  | "Team_Loyalty_Shift";

export interface GeneratedGroupAlternateGreetingData {
  aiMultiCharacterPrompt: string;
  altGreetingId: string;
  completedGreeting: string;
  forkCategory: GroupAlternateGreetingForkCategory;
  includedNpcNames: string[];
  targetSettingVibe: string;
}

export type ScenarioOpeningPairClassificationType =
  | "Environmental_Anchor"
  | "Status_Valve"
  | "Timeline_Link";

export interface GeneratedScenarioOpeningPairData {
  alternateFirstMessage: string;
  alternateScenarioContext: GeneratedScenarioData;
  classificationType: ScenarioOpeningPairClassificationType;
  pairId: string;
  pairTitle: string;
}

export interface GeneratedLorebookSummaryData {
  aiLoreInstruction: string;
  factionOrDynastyContext: string;
  tokenOptimizationCap: number;
  universeAnchor: string;
  worldSystemRules: string[];
}

export type LoreEntryDomainScope =
  | "Biographical_NPC"
  | "Geopolitical_Faction"
  | "Mythological_Rules"
  | "Societal_Customs";

export type LoreEntryInsertionPriority =
  | "Constant_Anchor"
  | "Reactive_Contextual"
  | "Recursive_Linked";

export interface GeneratedLoreEntryData {
  activationKeys: string[];
  domainScope: LoreEntryDomainScope;
  entryContent: string;
  entryId: string;
  insertionPriority: LoreEntryInsertionPriority;
  title: string;
  tokenReserveCost: number;
}

export type FrameworkTargetSpecification =
  | "Raw_Agnostic_JSON"
  | "V2_Card_Standard"
  | "V3_Card_Layout"
  | "Vercel_Structured_Zod";

export type FrameworkMemoryBudgetStrategy =
  | "Dynamic_User_Sliders"
  | "Extended_Deep_Lore"
  | "Ultra_Lean_Context";

export type FrameworkInjectionPipelineRouter =
  | "Dynamic_Variable_Loop"
  | "Monolithic_System_Prompt"
  | "Segmented_Placements";

export interface GeneratedFrameworkConfigurationData {
  frameworkId: string;
  globalTokenSafetyBuffer: number;
  injectionPipelineRouter: FrameworkInjectionPipelineRouter;
  memoryBudgetStrategy: FrameworkMemoryBudgetStrategy;
  systemPromptJailbreakOverride: string;
  targetSpecification: FrameworkTargetSpecification;
}

export type FormattingActionWrappingStandard =
  | "Bracket_Monologue"
  | "Quote_Isolated_Prose"
  | "Raw_Script";

export type FormattingMarkdownEmphasisStyle =
  | "Clean_Prose"
  | "Code_Block_Shielding"
  | "Weighted_Bold_Impact";

export type FormattingNarrativePerspective =
  | "First_Person_I"
  | "Second_Person_Direct"
  | "Third_Person_Past"
  | "Third_Person_Present";

export interface GeneratedFormattingConfigurationData {
  actionWrappingStandard: FormattingActionWrappingStandard;
  formattingId: string;
  formattingSystemPromptInjection: string;
  markdownEmphasisStyle: FormattingMarkdownEmphasisStyle;
  maxParagraphsPerTurn: number;
  narrativePerspective: FormattingNarrativePerspective;
}

export type ToneProseTexture =
  | "Angsty_Melancholic"
  | "Formal_Poetic"
  | "Gritty_Melodramatic"
  | "Lighthearted_Wholesome";

export type TonePacingVelocity =
  | "Clipped_Rapid"
  | "Measured_Deliberate"
  | "Slow_Tease_Prose";

export type ToneWorldviewFilter =
  | "Jaded_Weary"
  | "Optimistic_Idealistic"
  | "Ruthless_Cynical";

export interface GeneratedToneConfigurationData {
  aiVocabularyDirectives: string[];
  pacingVelocity: TonePacingVelocity;
  proseTexture: ToneProseTexture;
  toneId: string;
  toneSystemPromptInjection: string;
  worldviewFilter: ToneWorldviewFilter;
}

export interface GeneratedProseGuidanceData {
  bannedNarrationPatterns: string[];
  groundingInstructions: string[];
  guidanceId: string;
  microActionPrompts: string[];
  pacingRules: string[];
  proseConstraintPrompt: string;
  sensoryAnchors: string[];
}

export type ArchetypePersonaType =
  | "The_Ancient_Predator"
  | "The_Broken_Heir"
  | "The_Fae_Deal_Maker"
  | "The_Golden_Retriever"
  | "The_Jaded_Veteran"
  | "The_Perfectionist"
  | "The_Quiet_Guardian"
  | "The_Rogue_Instigator"
  | "The_Ruthless_Architect"
  | "The_Stoic_Wall"
  | "The_Vigilante_Outcast";

export type ArchetypeDefenseMechanism =
  | "Aggressive_Deflection"
  | "Defiant_Autonomy"
  | "Hyper_Charm_Deflection"
  | "Hyper_Independence"
  | "Hyper_Rationalization"
  | "Intellectualization"
  | "Jaded_Resignation"
  | "People_Pleasing_Inversion"
  | "Silent_Withdrawal"
  | "Temporal_Disconnection"
  | "Vulnerability_Martyrdom";

export type ArchetypeCoreMotivation =
  | "Autonomy_Freedom"
  | "Peace_Quiet"
  | "Security_Protection"
  | "Security_Proximity"
  | "Validation_Approval"
  | "Vengeance_Claiming"
  | "Vengeance_Redress";

export interface GeneratedArchetypeConfigurationData {
  aiBehaviorPrompt: string;
  archetypeId: string;
  coreMotivation: ArchetypeCoreMotivation;
  defenseMechanism: ArchetypeDefenseMechanism;
  personaType: ArchetypePersonaType;
}

export type SpeechRegister =
  | "Academic_Precise"
  | "Clipped_Command"
  | "Playful_Banter"
  | "Predatory_Quiet"
  | "Soft_Reassurance"
  | "Velvet_Formal";

export type SpeechVocabularyMode =
  | "Courtly_Formal"
  | "Romantic_Lyrical"
  | "Sparse_Minimal"
  | "Technical_Precise"
  | "Witty_Teasing";

export type SpeechAddressStyle =
  | "Formal_Address"
  | "No_Pet_Names"
  | "Possessive_Terms"
  | "Selective_Endearments"
  | "Teasing_Nicknames";

export type SpeechPitch =
  | "Baritone"
  | "Deep"
  | "High_Pitched"
  | "Mid_Range";

export type SpeechTexture =
  | "Breathy"
  | "Hoarse"
  | "Nasal"
  | "Raspy"
  | "Smooth";

export type SpeechVolumeBaseline =
  | "Booming"
  | "Measured"
  | "Soft_Spoken";

export type SpeechEmotionalDelivery =
  | "Affectionate"
  | "Clinical"
  | "Curt"
  | "Formal"
  | "Gravely_Serious"
  | "Monotone"
  | "Playful"
  | "Sarcastic"
  | "Seductive"
  | "Soothing";

export type SpeechVocalHabit =
  | "Pet_Names"
  | "Stuttering"
  | "Trailing_Off"
  | "Vocal_Fry";

export type SpeechPhysicalMannerism =
  | "Eye_Contact_Avoidance"
  | "Lip_Chewing"
  | "Nose_Pinch"
  | "Space_Invasion";

export type SpeechSyntaxCadence =
  | "Banter_Fast"
  | "Laconic_Clipped"
  | "Ornate_Sesquipedalian"
  | "Staccato_Tension";

export type SpeechLinguisticFlavor =
  | "Jargon_Infused"
  | "L1_Interference"
  | "Neutral_MidAtlantic"
  | "Vernacular_Slang";

export type SpeechVocalRegister =
  | "Dynamic_Range_Shift"
  | "Muted_Whisper"
  | "Vocal_Masking";

export interface GeneratedSpeechStyleData {
  addressStyle: SpeechAddressStyle;
  dialogueDonts: string[];
  dialogueDos: string[];
  dialogueTagsWhitelist: string[];
  emotionalDelivery: SpeechEmotionalDelivery;
  linguisticFlavor: SpeechLinguisticFlavor;
  physicalMannerisms: SpeechPhysicalMannerism[];
  pitch: SpeechPitch;
  texture: SpeechTexture;
  speechPatternInstruction: string;
  speechSystemPromptInjection: string;
  styleId: string;
  register: SpeechRegister;
  syntaxCadence: SpeechSyntaxCadence;
  vocalHabits: SpeechVocalHabit[];
  volumeBaseline: SpeechVolumeBaseline;
  vocalRegister: SpeechVocalRegister;
  vocabularyMode: SpeechVocabularyMode;
}

export type SpeechExampleCategory =
  | "Boundary"
  | "Care"
  | "Conflict"
  | "Greeting"
  | "Romantic_Tension";

export type SpeechExampleState =
  | "Alone_With_User"
  | "Calm"
  | "Cornered"
  | "Defensive"
  | "Exhausted"
  | "Furious"
  | "Guilty"
  | "Intimate"
  | "Possessive"
  | "Public";

export interface GeneratedSpeechExampleData {
  category: SpeechExampleCategory;
  exampleId: string;
  exampleLine: string;
  state: SpeechExampleState;
  stateLabel: string;
  usageContext: string;
}

export interface GeneratedDialogueArrayData {
  aiLinguisticConstraintPrompt: string;
  arrayId: string;
  dontVocabularyBlacklist: string[];
  doVocabularyWhitelist: string[];
  structuralDontRules: string[];
  structuralDoRules: string[];
}

export type CreatorsNotesContentRating =
  | "Dark_Romance_Heavy"
  | "M_Rated_Sensory"
  | "SFW_Wholesome"
  | "X_Rated_Explicit";

export interface GeneratedCreatorsNotesData {
  contentRating: CreatorsNotesContentRating;
  idealUserPersona: string;
  recommendedModels: string[];
  technicalNotesText: string;
  triggerWarnings: string[];
}

export interface GeneratedPostHistoryInstructionsData {
  driftControlRules: string[];
  dynamicToneModifiers: string[];
  formattingHardlines: string[];
  injectionTokenWeight: number;
}

export type WorldLorePlaceholderMacroType =
  | "Environmental_Anchor"
  | "Legacy_Tag"
  | "Population_Baseline";

export interface GeneratedWorldLorePlaceholderData {
  currentDataPayload: string;
  isDynamic: boolean;
  macroType: WorldLorePlaceholderMacroType;
  placeholderId: string;
  variableKey: string;
}

export type RaceMacroGroup =
  | "Black_African"
  | "East_Southeast_Asian"
  | "Indigenous_First_Nations"
  | "Middle_Eastern_North_African"
  | "Multiracial_Blended"
  | "South_Central_Asian"
  | "White_Caucasian";
export type RaceEthnicitySyncMode =
  | "Diasporic Shift"
  | "Homogeneous Alignment";
export type RaceNarrativeStyle =
  | "Phenotypic Palette Focus"
  | "Stylised / Aesthetic Focus";

export interface GeneratedRaceData {
  macroGroup: RaceMacroGroup;
  physicalDescriptors: string[];
  isCulturallySalient: boolean;
  syncMode: RaceEthnicitySyncMode;
  narrativeStyle: RaceNarrativeStyle;
}

export type KinkPrimaryRole =
  | "Dominant"
  | "Primal"
  | "Submissive"
  | "Switch";
export type KinkIntensityLevel =
  | "Intense_Heavy"
  | "Mild_Vanilla"
  | "Moderate_Sensory";

export interface GeneratedKinkData {
  intensityLevel: KinkIntensityLevel;
  nsfwEnabled: boolean;
  preferredSensoryTags: string[];
  primaryRole: KinkPrimaryRole;
  systemPromptInstruction: string;
}

export type FetishAnatomicalFocus =
  | "Feet_Footwear"
  | "Hair_Face"
  | "Muscular_Texture"
  | "None"
  | "Thighs_Midriff";
export type FetishMaterialPreference =
  | "Eyewear_Chokers"
  | "Lace_Silk"
  | "Leather_Latex"
  | "None"
  | "Uniforms_Suits";
export type FetishSituationalTrigger =
  | "Breeding_Claiming"
  | "Exhibitionism_Risk"
  | "None"
  | "Sanguine_Biting"
  | "Vulnerability_Sleep";
export type FetishSizeFantasyModifier =
  | "Extreme_Height_Gap"
  | "Micro_Macro_Scale"
  | "Standard_Scale";

export interface GeneratedFetishData {
  aiDescriptiveFocus: string;
  anatomicalFocus: FetishAnatomicalFocus;
  fetishEnabled: boolean;
  materialPreference: FetishMaterialPreference;
  situationalTrigger: FetishSituationalTrigger;
  sizeFantasyModifier: FetishSizeFantasyModifier;
}

export type IntimacyExpressionType =
  | "Intense_Devoted"
  | "Playful_Teasing"
  | "Stoic_Restrained"
  | "Vulnerable_Yielding";
export type IntimacyAftercareStyle =
  | "The_Confessor"
  | "The_Nurturer"
  | "The_Processor"
  | "The_Seeker";
export type IntimacyVerbalCadence =
  | "Hesitant_Reassurance"
  | "High_Intensity_Dirty"
  | "Praise_Validation"
  | "Silent_Connection";
export type IntimacyPhysicalLoveLanguage =
  | "Acts_of_Service"
  | "Protective_Proximity"
  | "Touch_Holding"
  | "Verbal_Affirmation";

export interface GeneratedIntimacyStyleData {
  aftercareStyle: IntimacyAftercareStyle;
  aiBehaviorPrompt: string;
  expressionType: IntimacyExpressionType;
  physicalLoveLanguage: IntimacyPhysicalLoveLanguage;
  verbalCadence: IntimacyVerbalCadence;
}

export type TurnOffDynamicHardline =
  | "No_Role_Reversal"
  | "No_Rushed_Pacing"
  | "No_Unprompted_Aggression";

export interface GeneratedTurnOffData {
  aiReactionPrompt: string;
  behavioralTurnOffs: string[];
  dynamicHardlines: TurnOffDynamicHardline;
  sensoryTurnOffs: string[];
}

export type ScenarioSettingType =
  | "Atmospheric_Wilderness"
  | "Contained_Insular"
  | "Corporate_Institutional"
  | "Public_HighExposure";
export type ScenarioPlotHook =
  | "The_Chance_Encounter"
  | "The_Crisis"
  | "The_Mandate"
  | "The_Secret_Transaction";
export type ScenarioStartingTension =
  | "Charged_Electric"
  | "Combative_Friction"
  | "Formal_Chilling"
  | "Vulnerable_Exhausted";

export interface GeneratedScenarioData {
  plotHook: ScenarioPlotHook;
  scenePremiseDescription: string;
  sensoryDetails: string[];
  settingType: ScenarioSettingType;
  startingTension: ScenarioStartingTension;
}

export type FirstMessageEntryPoint =
  | "Active_Collision"
  | "Mid_Action_Dialogue"
  | "Post_Crisis_Quiet"
  | "The_Approach";
export type FirstMessageLiteraryStyle =
  | "Action_Dialogue_Hybrid"
  | "Chat_Symphonic"
  | "Internal_Monologue_Heavy"
  | "Novella_Prose";
export type FirstMessageUserCallToAction =
  | "Direct_Question"
  | "Physical_Gesture"
  | "Vulnerable_Slip"
  | "Weighted_StandOff";

export interface GeneratedFirstMessageData {
  aiOutputConstraint: string;
  entryPoint: FirstMessageEntryPoint;
  literaryStyle: FirstMessageLiteraryStyle;
  tokenLengthCap: number;
  userCallToAction: FirstMessageUserCallToAction;
}

export type NationalityRegionalAlliance =
  | "EU_Schengen"
  | "Fictional_Empire"
  | "Non_EU_European"
  | "Western_Allies";
export type NationalityLegalStatus =
  | "Dual_Citizen"
  | "Expat_Visa"
  | "Native"
  | "Naturalized";

export interface GeneratedNationalityData {
  passportCountry: string;
  regionalAlliance: NationalityRegionalAlliance;
  legalStatus: NationalityLegalStatus;
  linguisticVibe: string;
}

export type OccupationSocioeconomicTier =
  | "Creative_Public"
  | "High_Professional"
  | "Shadow_Economy"
  | "Ultra_Elite"
  | "Working_Class";
export type OccupationProfessionalDomain =
  | "Arts_Entertainment"
  | "Corporate_Finance"
  | "Medical_Science"
  | "Security_Defense"
  | "Underworld";
export type OccupationAuthorityDynamic =
  | "Equal"
  | "Outsider"
  | "Subordinate"
  | "Superior";
export type StudentAcademicYear =
  | "Freshman"
  | "Junior"
  | "Postgrad_PhD"
  | "Senior"
  | "Sophomore";
export type StudentMajorField =
  | "Arts_Design"
  | "Athletics"
  | "Humanities_Law"
  | "STEM_Medical";
export type StudentFundingType =
  | "International"
  | "Legacy_Trust"
  | "Scholarship"
  | "Self_Funded";

export interface GeneratedProfessionalOccupationData {
  authorityDynamic: OccupationAuthorityDynamic;
  jobTitle: string;
  kind: "professional";
  professionalDomain: OccupationProfessionalDomain;
  socioeconomicTier: OccupationSocioeconomicTier;
  workplaceVibe: string;
}

export interface GeneratedStudentOccupationData {
  academicYear: StudentAcademicYear;
  authorityDynamic: OccupationAuthorityDynamic;
  campusAffiliation: string;
  fundingType: StudentFundingType;
  jobTitle: "University Student";
  kind: "student";
  majorField: StudentMajorField;
  workplaceVibe: string;
}

export type GeneratedOccupationData =
  | GeneratedProfessionalOccupationData
  | GeneratedStudentOccupationData;

export type NPCConnectionType =
  | "Antagonistic_Force"
  | "Family_Lineage"
  | "Found_Family"
  | "Professional_Circle";
export type NPCRomanceFunction =
  | "The_Barrier"
  | "The_Jealousy_Instigator"
  | "The_Matchmaker"
  | "The_Secret_Keeper";
export type NPCEmotionalStatus =
  | "Dependent_Protected"
  | "Devoted_Loyal"
  | "Estranged_Ghosted"
  | "Strained_Fractured";

export interface GeneratedNPCRelationshipData {
  connectionType: NPCConnectionType;
  emotionalStatus: NPCEmotionalStatus;
  npcName: string;
  oneLineDescription: string;
  romanceFunction: NPCRomanceFunction;
}

export type RelationshipCurrentLabel =
  | "Betrothed_Promised"
  | "Divorced_Separated"
  | "It_Complicated"
  | "Single"
  | "Widowed";
export type RelationshipEmotionalAvailability =
  | "Casual_Only"
  | "Fully_Open"
  | "Guarded_Closed"
  | "Lingering_Past";
export type RelationshipScandalFactor =
  | "Career_Threatening"
  | "High_Taboo"
  | "Low_Gossip"
  | "None";

export interface GeneratedRelationshipStatusData {
  currentLabel: RelationshipCurrentLabel;
  emotionalAvailability: RelationshipEmotionalAvailability;
  scandalFactor: RelationshipScandalFactor;
  statusContext: string;
}

export type EthnicityRegion =
  | "Diaspora_Blended"
  | "Eastern_European_Slavic"
  | "Northern_Western_European"
  | "Southern_European";
export type DiasporicContext =
  | "First-Generation Immigrant"
  | "Indigenous / Native Home Ground"
  | "Multigenerational Diaspora";
export type LinguisticMatrix =
  | "Anglophone"
  | "Celtic / Gaelic"
  | "Latinate / Romance"
  | "Slavic / Cyrillic-Derived";

export interface GeneratedEthnicityData {
  culturalHeritage: string;
  hasDiasporicBaggage: boolean;
  nativeLanguage: string;
  region: EthnicityRegion;
  societalContext: DiasporicContext;
  linguisticMatrix: LinguisticMatrix;
}

export type SpeciesType =
  | "Angel"
  | "Demon"
  | "Fae"
  | "Human"
  | "Siren"
  | "Vampire"
  | "Werewolf"
  | "Wraith";
export type SupernaturalSeedSpecies =
  | "Angel"
  | "Demon"
  | "Fae"
  | "Siren"
  | "Wraith";

export interface GeneratedSpeciesData {
  apparentAge?: number;
  dietaryNeed?: string;
  heritage?: string;
  instinctualTrait: string;
  isImmortal: boolean;
  nameAura?: string;
  nameEra?: string;
  seed?: SupernaturalSeed;
  type: SpeciesType | SupernaturalSeedSpecies;
}

export interface SupernaturalSeed {
  given_name: string;
  surname: string;
  species: SupernaturalSeedSpecies;
  heritage: string;
  apparent_age: number;
  chronological_age: number;
  zodiac: ZodiacSign;
  aura_tag: string;
  instinct_trait: string;
}

export interface CharacterCardSeed {
  id: string;
  meta_version: string;
  archetype_tag: string;
  trope_framework: string;
  identity: {
    first_name: string;
    last_name: string;
    apparent_age: number;
    chronological_age: number;
    birthday: string;
    zodiac: string;
    species: string;
    race: string;
    ethnicity: string;
    nationality: string;
    citizenship_status: string;
  };
  professional_matrix: {
    job_title: string;
    socioeconomic_tier: string;
    industry_domain: string;
    authority_dynamic_vs_user: string;
    academic_year?: string;
    funding_type?: string;
  };
  relational_network: {
    relationship_status: string;
    emotional_availability: string;
    scandal_risk_factor: string;
    status_narrative_context: string;
    npc_cast: Array<{
      name: string;
      connection: string;
      romance_function: string;
      emotional_status: string;
      desc_line: string;
    }>;
  };
  adult_configuration: {
    nsfw_enabled: boolean;
    kink_power_role: string;
    intensity_bracket: string;
    sensory_tags: string[];
    anatomical_focus: string;
    material_preference: string;
    situational_trigger: string;
    intimacy_love_language: string;
    aftercare_style: string;
    verbal_cadence: string;
  };
  system_guardrails: {
    hard_hardlines: string[];
    emotional_trauma_triggers: string[];
    behavioral_turn_offs: string[];
    physical_proximity_limit: string;
    proximity_violation_reaction: string;
  };
  narrative_styling: {
    prose_texture: string;
    pacing_velocity: string;
    worldview_filter: string;
    action_wrapping_standard: string;
    narrative_perspective: string;
    max_paragraphs_per_turn: number;
  };
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ZODIAC_SIGNS = [
  "Aquarius",
  "Aries",
  "Cancer",
  "Capricorn",
  "Gemini",
  "Leo",
  "Libra",
  "Pisces",
  "Sagittarius",
  "Scorpio",
  "Taurus",
  "Virgo",
] as const satisfies readonly ZodiacSign[];
const FRAMEWORK_TARGETS = [
  "Raw_Agnostic_JSON",
  "V2_Card_Standard",
  "V3_Card_Layout",
  "Vercel_Structured_Zod",
] as const satisfies readonly FrameworkTargetSpecification[];
const SPECIES_TYPES = [
  "Angel",
  "Demon",
  "Fae",
  "Human",
  "Siren",
  "Vampire",
  "Werewolf",
  "Wraith",
] as const satisfies readonly SpeciesType[];
const RACE_MACRO_GROUPS = [
  "Black_African",
  "East_Southeast_Asian",
  "Indigenous_First_Nations",
  "Middle_Eastern_North_African",
  "Multiracial_Blended",
  "South_Central_Asian",
  "White_Caucasian",
] as const satisfies readonly RaceMacroGroup[];
const ETHNICITY_REGIONS = [
  "Diaspora_Blended",
  "Eastern_European_Slavic",
  "Northern_Western_European",
  "Southern_European",
] as const satisfies readonly EthnicityRegion[];
const NATIONALITY_LEGAL_STATUSES = [
  "Dual_Citizen",
  "Expat_Visa",
  "Native",
  "Naturalized",
] as const satisfies readonly NationalityLegalStatus[];
const OCCUPATION_AUTHORITY_DYNAMICS = [
  "Equal",
  "Outsider",
  "Subordinate",
  "Superior",
] as const satisfies readonly OccupationAuthorityDynamic[];
const OCCUPATION_PROFESSIONAL_DOMAINS = [
  "Arts_Entertainment",
  "Corporate_Finance",
  "Medical_Science",
  "Security_Defense",
  "Underworld",
] as const satisfies readonly OccupationProfessionalDomain[];
const OCCUPATION_SOCIOECONOMIC_TIERS = [
  "Creative_Public",
  "High_Professional",
  "Shadow_Economy",
  "Ultra_Elite",
  "Working_Class",
] as const satisfies readonly OccupationSocioeconomicTier[];
const STUDENT_ACADEMIC_YEARS = [
  "Freshman",
  "Junior",
  "Postgrad_PhD",
  "Senior",
  "Sophomore",
] as const satisfies readonly StudentAcademicYear[];
const STUDENT_MAJOR_FIELDS = [
  "Arts_Design",
  "Athletics",
  "Humanities_Law",
  "STEM_Medical",
] as const satisfies readonly StudentMajorField[];
const STUDENT_FUNDING_TYPES = [
  "International",
  "Legacy_Trust",
  "Scholarship",
  "Self_Funded",
] as const satisfies readonly StudentFundingType[];
const ARCHETYPE_PERSONA_TYPES = [
  "The_Ancient_Predator",
  "The_Broken_Heir",
  "The_Fae_Deal_Maker",
  "The_Golden_Retriever",
  "The_Jaded_Veteran",
  "The_Perfectionist",
  "The_Quiet_Guardian",
  "The_Rogue_Instigator",
  "The_Ruthless_Architect",
  "The_Stoic_Wall",
  "The_Vigilante_Outcast",
] as const satisfies readonly ArchetypePersonaType[];
const KINK_PRIMARY_ROLES = [
  "Dominant",
  "Primal",
  "Submissive",
  "Switch",
] as const satisfies readonly KinkPrimaryRole[];
const KINK_INTENSITY_LEVELS = [
  "Intense_Heavy",
  "Mild_Vanilla",
  "Moderate_Sensory",
] as const satisfies readonly KinkIntensityLevel[];
const FETISH_ANATOMICAL_FOCUSES = [
  "Feet_Footwear",
  "Hair_Face",
  "Muscular_Texture",
  "None",
  "Thighs_Midriff",
] as const satisfies readonly FetishAnatomicalFocus[];
const FETISH_MATERIAL_PREFERENCES = [
  "Eyewear_Chokers",
  "Lace_Silk",
  "Leather_Latex",
  "None",
  "Uniforms_Suits",
] as const satisfies readonly FetishMaterialPreference[];
const FETISH_SITUATIONAL_TRIGGERS = [
  "Breeding_Claiming",
  "Exhibitionism_Risk",
  "None",
  "Sanguine_Biting",
  "Vulnerability_Sleep",
] as const satisfies readonly FetishSituationalTrigger[];
const INTIMACY_AFTERCARE_STYLES = [
  "The_Confessor",
  "The_Nurturer",
  "The_Processor",
  "The_Seeker",
] as const satisfies readonly IntimacyAftercareStyle[];
const INTIMACY_PHYSICAL_LOVE_LANGUAGES = [
  "Acts_of_Service",
  "Protective_Proximity",
  "Touch_Holding",
  "Verbal_Affirmation",
] as const satisfies readonly IntimacyPhysicalLoveLanguage[];
const INTIMACY_VERBAL_CADENCES = [
  "Hesitant_Reassurance",
  "High_Intensity_Dirty",
  "Praise_Validation",
  "Silent_Connection",
] as const satisfies readonly IntimacyVerbalCadence[];
const NPC_CONNECTION_TYPES = [
  "Antagonistic_Force",
  "Family_Lineage",
  "Found_Family",
  "Professional_Circle",
] as const satisfies readonly NPCConnectionType[];
const NPC_ROMANCE_FUNCTIONS = [
  "The_Barrier",
  "The_Jealousy_Instigator",
  "The_Matchmaker",
  "The_Secret_Keeper",
] as const satisfies readonly NPCRomanceFunction[];
const NPC_EMOTIONAL_STATUSES = [
  "Dependent_Protected",
  "Devoted_Loyal",
  "Estranged_Ghosted",
  "Strained_Fractured",
] as const satisfies readonly NPCEmotionalStatus[];
const RELATIONSHIP_CURRENT_LABELS = [
  "Betrothed_Promised",
  "Divorced_Separated",
  "It_Complicated",
  "Single",
  "Widowed",
] as const satisfies readonly RelationshipCurrentLabel[];
const RELATIONSHIP_EMOTIONAL_AVAILABILITY = [
  "Casual_Only",
  "Fully_Open",
  "Guarded_Closed",
  "Lingering_Past",
] as const satisfies readonly RelationshipEmotionalAvailability[];
const RELATIONSHIP_SCANDAL_FACTORS = [
  "Career_Threatening",
  "High_Taboo",
  "Low_Gossip",
  "None",
] as const satisfies readonly RelationshipScandalFactor[];
const FORMATTING_ACTION_WRAPPING = [
  "Bracket_Monologue",
  "Quote_Isolated_Prose",
  "Raw_Script",
] as const satisfies readonly FormattingActionWrappingStandard[];
const FORMATTING_PERSPECTIVES = [
  "First_Person_I",
  "Second_Person_Direct",
  "Third_Person_Past",
  "Third_Person_Present",
] as const satisfies readonly FormattingNarrativePerspective[];
const TONE_PROSE_TEXTURES = [
  "Angsty_Melancholic",
  "Formal_Poetic",
  "Gritty_Melodramatic",
  "Lighthearted_Wholesome",
] as const satisfies readonly ToneProseTexture[];
const TONE_PACING_VELOCITIES = [
  "Clipped_Rapid",
  "Measured_Deliberate",
  "Slow_Tease_Prose",
] as const satisfies readonly TonePacingVelocity[];
const TONE_WORLDVIEW_FILTERS = [
  "Jaded_Weary",
  "Optimistic_Idealistic",
  "Ruthless_Cynical",
] as const satisfies readonly ToneWorldviewFilter[];

const TROPE_PRESETS: Record<
  string,
  { birth_day: number; birth_month: number; zodiac: ZodiacSign }
> = {
  "cruel prince / aloof aristocrat": {
    birth_day: 4,
    birth_month: 1,
    zodiac: "Capricorn",
  },
  "dark/possessive anti-hero": {
    birth_day: 11,
    birth_month: 11,
    zodiac: "Scorpio",
  },
  "free-spirited rogue / rebel": {
    birth_day: 28,
    birth_month: 7,
    zodiac: "Leo",
  },
  "sunshine / innocent partner": {
    birth_day: 1,
    birth_month: 5,
    zodiac: "Taurus",
  },
  "traumatized/protected soul": {
    birth_day: 15,
    birth_month: 3,
    zodiac: "Pisces",
  },
};

const SURNAME_BANKS: Record<LinguisticMatrix, string[]> = {
  Anglophone: [
    "Askew",
    "Bond",
    "Brooks",
    "Croft",
    "Foss",
    "Gunn",
    "Haldane",
    "Hanson",
    "Knight",
    "MacLeod",
    "Osmond",
    "Sanderson",
    "Sinclair",
    "Sterling",
    "Vance",
  ],
  "Celtic / Gaelic": [
    "Blackwood",
    "Gallagher",
    "MacAulay",
    "MacIvor",
    "MacLeod",
    "McAuliffe",
    "O'Brien",
    "Raven",
    "Skene",
  ],
  "Latinate / Romance": [
    "Bello",
    "Bruno",
    "Costa",
    "De Luca",
    "Dubois",
    "Fernandez",
    "Fontana",
    "Garnier",
    "Leroy",
    "Marchetti",
    "Moreau",
    "Romano",
    "Rossi",
    "Silva",
  ],
  "Slavic / Cyrillic-Derived": [
    "Anatowicz",
    "Ivanov",
    "Kovalchuk",
    "Kowalski",
    "Moroz",
    "Nowak",
    "Petrov",
    "Romanov",
    "Shevchenko",
    "Volkov",
  ],
};

const RACE_DESCRIPTOR_BANKS: Record<RaceMacroGroup, string[]> = {
  Black_African: [
    "deep brown undertones",
    "coiled dark hair",
    "warm expressive eyes",
  ],
  East_Southeast_Asian: [
    "sleek dark hair",
    "cool golden undertones",
    "sharp attentive eyes",
  ],
  Indigenous_First_Nations: [
    "earth-warm undertones",
    "dark grounded eyes",
    "strong facial planes",
  ],
  Middle_Eastern_North_African: [
    "olive undertones",
    "dark lashes",
    "striking profile",
  ],
  Multiracial_Blended: [
    "blended ancestral features",
    "unusual eye contrast",
    "multi-tonal complexion",
  ],
  South_Central_Asian: [
    "rich brown undertones",
    "dark expressive eyes",
    "glossy dark hair",
  ],
  White_Caucasian: [
    "fair to olive undertones",
    "sharp blue or hazel eyes",
    "ash-brown or silver-blonde hair",
  ],
};

export const supernaturalSeeds: SupernaturalSeed[] = [
  {
    given_name: "Caspian",
    surname: "Thorne",
    species: "Fae",
    heritage: "Gaelic & Celtic",
    apparent_age: 27,
    chronological_age: 342,
    zodiac: "Capricorn",
    aura_tag: "Elite / Noble",
    instinct_trait:
      "Bargain Binding (Cannot lie, uses literal truths to ensnare).",
  },
  {
    given_name: "Vivienne",
    surname: "de Winter",
    species: "Fae",
    heritage: "Romance Languages (French)",
    apparent_age: 24,
    chronological_age: 189,
    zodiac: "Libra",
    aura_tag: "Ethereal / Gothic",
    instinct_trait:
      "Glamour Manipulation (Subtly alters surroundings based on emotions).",
  },
  {
    given_name: "Valerius",
    surname: "Vance",
    species: "Demon",
    heritage: "Anglo-Saxon (Ancient Latin roots)",
    apparent_age: 31,
    chronological_age: 666,
    zodiac: "Scorpio",
    aura_tag: "Gritty / Edgy",
    instinct_trait:
      "Aura Siphoning (Feeds on intense romantic or chaotic tension).",
  },
  {
    given_name: "Lilith",
    surname: "Crowley",
    species: "Demon",
    heritage: "Ancient / European Hybrid",
    apparent_age: 26,
    chronological_age: 520,
    zodiac: "Aries",
    aura_tag: "Gritty / Edgy",
    instinct_trait:
      "Temptation Catalyst (Amplifies the forbidden desires of those nearby).",
  },
  {
    given_name: "Gideon",
    surname: "Sterling",
    species: "Angel",
    heritage: "Anglo-Saxon",
    apparent_age: 29,
    chronological_age: 1200,
    zodiac: "Leo",
    aura_tag: "Elite / Noble",
    instinct_trait:
      "Absolute Truth (Compels others to confess secrets under his gaze).",
  },
  {
    given_name: "Evangeline",
    surname: "Moreau",
    species: "Angel",
    heritage: "Romance Languages (French)",
    apparent_age: 22,
    chronological_age: 945,
    zodiac: "Pisces",
    aura_tag: "Soft / Wholesome",
    instinct_trait:
      "Empathic Resonance (Physically feels the emotional trauma of her partner).",
  },
  {
    given_name: "Ronan",
    surname: "Brooks",
    species: "Siren",
    heritage: "Gaelic & Celtic (Irish)",
    apparent_age: 25,
    chronological_age: 98,
    zodiac: "Cancer",
    aura_tag: "Ethereal / Gothic",
    instinct_trait:
      "Vocal Compulsion (Unintentional voice lilt that induces hyper-fixation).",
  },
  {
    given_name: "Clara",
    surname: "Finch",
    species: "Siren",
    heritage: "Germanic",
    apparent_age: 21,
    chronological_age: 74,
    zodiac: "Taurus",
    aura_tag: "Soft / Wholesome",
    instinct_trait:
      "Tidal Bond (Draws emotional stability directly from her chosen partner).",
  },
  {
    given_name: "Alistair",
    surname: "Blackwood",
    species: "Wraith",
    heritage: "Anglo-Saxon / Scottish",
    apparent_age: 28,
    chronological_age: 240,
    zodiac: "Sagittarius",
    aura_tag: "Ethereal / Gothic",
    instinct_trait:
      "Intangible Touch (Can only manifest solid warmth through intense affection).",
  },
  {
    given_name: "Anastasia",
    surname: "Volkov",
    species: "Wraith",
    heritage: "Slavic",
    apparent_age: 23,
    chronological_age: 115,
    zodiac: "Virgo",
    aura_tag: "Ethereal / Gothic",
    instinct_trait:
      "Memory Echoes (Projects shared past-life dreams into her partner's sleep).",
  },
];

export const characterCardSeeds: CharacterCardSeed[] = [
  {
    id: "cc-seed-001",
    meta_version: "V2_Card_Standard",
    archetype_tag: "The_Ruthless_Architect",
    trope_framework: "Dark_Romance",
    identity: {
      first_name: "Nikolai",
      last_name: "Volkov",
      apparent_age: 31,
      chronological_age: 31,
      birthday: "November 11",
      zodiac: "Scorpio",
      species: "Human",
      race: "White_Caucasian",
      ethnicity: "Eastern_European_Slavic",
      nationality: "Russia",
      citizenship_status: "Dual_Citizen",
    },
    professional_matrix: {
      job_title: "Syndicate Underboss",
      socioeconomic_tier: "Shadow_Economy",
      industry_domain: "Underworld",
      authority_dynamic_vs_user: "Superior",
    },
    relational_network: {
      relationship_status: "Betrothed_Promised",
      emotional_availability: "Guarded_Closed",
      scandal_risk_factor: "High_Taboo",
      status_narrative_context:
        "Promised to {{user}} via a forced transactional underworld contract to merge fractured syndicates.",
      npc_cast: [
        {
          name: "Dmitri Volkov",
          connection: "Family_Lineage",
          romance_function: "The_Barrier",
          emotional_status: "Strained_Fractured",
          desc_line:
            "The cold, unforgiving Bratva family patriarch who will strip Nikolai of his inheritance if the alliance fails.",
        },
      ],
    },
    adult_configuration: {
      nsfw_enabled: true,
      kink_power_role: "Dominant",
      intensity_bracket: "Intense_Heavy",
      sensory_tags: ["Marking", "Restraints", "Possessiveness"],
      anatomical_focus: "Muscular_Texture",
      material_preference: "Leather_Latex",
      situational_trigger: "Exhibitionism_Risk",
      intimacy_love_language: "Touch_Holding",
      aftercare_style: "The_Processor",
      verbal_cadence: "High_Intensity_Dirty",
    },
    system_guardrails: {
      hard_hardlines: [
        "No early romantic capitulation",
        "No user dictation",
        "Maintain slow-burn walls",
      ],
      emotional_trauma_triggers: [
        "Betrayal of trust",
        "Questioning family loyalty",
      ],
      behavioral_turn_offs: ["Desperation", "Whining", "Unprompted submission"],
      physical_proximity_limit: "Highly_Averse",
      proximity_violation_reaction:
        "If {{user}} pushes for physical intimacy too quickly, {{char}} must freeze, step back, and deliver a razor-sharp verbal warning.",
    },
    narrative_styling: {
      prose_texture: "Gritty_Melodramatic",
      pacing_velocity: "Slow_Tease_Prose",
      worldview_filter: "Ruthless_Cynical",
      action_wrapping_standard: "Quote_Isolated_Prose",
      narrative_perspective: "Third_Person_Past",
      max_paragraphs_per_turn: 3,
    },
  },
  {
    id: "cc-seed-002",
    meta_version: "V2_Card_Standard",
    archetype_tag: "The_Perfectionist",
    trope_framework: "Academic_Rivals",
    identity: {
      first_name: "Vivienne",
      last_name: "de Winter",
      apparent_age: 21,
      chronological_age: 21,
      birthday: "January 4",
      zodiac: "Capricorn",
      species: "Human",
      race: "White_Caucasian",
      ethnicity: "Romance_Languages_French",
      nationality: "France",
      citizenship_status: "Expat_Visa",
    },
    professional_matrix: {
      job_title: "University Student",
      socioeconomic_tier: "High_Professional",
      industry_domain: "Humanities_Law",
      authority_dynamic_vs_user: "Equal",
      academic_year: "Senior",
      funding_type: "Scholarship",
    },
    relational_network: {
      relationship_status: "Single",
      emotional_availability: "Casual_Only",
      scandal_risk_factor: "Low_Gossip",
      status_narrative_context:
        "Single on paper. Intensely focused on finishing at the top of her pre-law track; rejects romance as an irrational variable.",
      npc_cast: [
        {
          name: "Professor Sterling",
          connection: "Professional_Circle",
          romance_function: "The_Matchmaker",
          emotional_status: "Devoted_Loyal",
          desc_line:
            "The demanding head of the legal studies department who forced {{char}} and {{user}} to share a single research grant.",
        },
      ],
    },
    adult_configuration: {
      nsfw_enabled: true,
      kink_power_role: "Switch",
      intensity_bracket: "Moderate_Sensory",
      sensory_tags: ["Praise", "Control"],
      anatomical_focus: "Hair_Face",
      material_preference: "Uniforms_Suits",
      situational_trigger: "Exhibitionism_Risk",
      intimacy_love_language: "Verbal_Affirmation",
      aftercare_style: "The_Confessor",
      verbal_cadence: "Praise_Validation",
    },
    system_guardrails: {
      hard_hardlines: [
        "No unprompted romance",
        "No writing for {{user}}",
        "Maintain fierce academic competitive wall",
      ],
      emotional_trauma_triggers: ["Academic failure", "Accusations of cheating"],
      behavioral_turn_offs: ["Arrogance", "Laziness", "Lack of preparedness"],
      physical_proximity_limit: "Context_Dependent",
      proximity_violation_reaction:
        "If {{user}} invades her space without academic justification, {{char}} must push her glasses up, scoff, and launch a competitive, argumentative counter-interrogation.",
    },
    narrative_styling: {
      prose_texture: "Formal_Poetic",
      pacing_velocity: "Measured_Deliberate",
      worldview_filter: "Jaded_Weary",
      action_wrapping_standard: "Quote_Isolated_Prose",
      narrative_perspective: "Third_Person_Present",
      max_paragraphs_per_turn: 2,
    },
  },
  {
    id: "cc-seed-003",
    meta_version: "V3_Card_Layout",
    archetype_tag: "The_Ancient_Predator",
    trope_framework: "Arranged_Marriage",
    identity: {
      first_name: "Caspian",
      last_name: "Vance",
      apparent_age: 28,
      chronological_age: 450,
      birthday: "March 15",
      zodiac: "Pisces",
      species: "Vampire",
      race: "White_Caucasian",
      ethnicity: "Anglo_Saxon_English",
      nationality: "United Kingdom",
      citizenship_status: "Native",
    },
    professional_matrix: {
      job_title: "Lord Paramount",
      socioeconomic_tier: "Ultra_Elite",
      industry_domain: "Underworld",
      authority_dynamic_vs_user: "Superior",
    },
    relational_network: {
      relationship_status: "Betrothed_Promised",
      emotional_availability: "Lingering_Past",
      scandal_risk_factor: "High_Taboo",
      status_narrative_context:
        "An ancient pure-blood lord who has agreed to take a mortal spouse ({{user}}) to stabilize generational border treaties.",
      npc_cast: [
        {
          name: "Lilith Crowley",
          connection: "Antagonistic_Force",
          romance_function: "The_Jealousy_Instigator",
          emotional_status: "Estranged_Ghosted",
          desc_line:
            "An ancient coven rival who despises mortals and seeks to undermine the marriage contract by targeting {{user}}.",
        },
      ],
    },
    adult_configuration: {
      nsfw_enabled: true,
      kink_power_role: "Primal",
      intensity_bracket: "Intense_Heavy",
      sensory_tags: ["Marking", "Possessiveness"],
      anatomical_focus: "Thighs_Midriff",
      material_preference: "Lace_Silk",
      situational_trigger: "Sanguine_Biting",
      intimacy_love_language: "Protective_Proximity",
      aftercare_style: "The_Nurturer",
      verbal_cadence: "Silent_Connection",
    },
    system_guardrails: {
      hard_hardlines: [
        "No early physical submission",
        "Literal truth enforcement",
        "No historical time skips",
      ],
      emotional_trauma_triggers: [
        "Broken promises",
        "Forced submission to a lesser power",
      ],
      behavioral_turn_offs: ["Deception", "Hysteria", "Disrespect of coven laws"],
      physical_proximity_limit: "Context_Dependent",
      proximity_violation_reaction:
        "If {{user}} breaks a literal promise or contract term, {{char}}'s demeanor must instantly flip to chillingly formal, completely freezing out all physical warmth.",
    },
    narrative_styling: {
      prose_texture: "Gritty_Melodramatic",
      pacing_velocity: "Slow_Tease_Prose",
      worldview_filter: "Ruthless_Cynical",
      action_wrapping_standard: "Quote_Isolated_Prose",
      narrative_perspective: "Third_Person_Past",
      max_paragraphs_per_turn: 4,
    },
  },
  {
    id: "cc-seed-004",
    meta_version: "V2_Card_Standard",
    archetype_tag: "The_Golden_Retriever",
    trope_framework: "Friends_to_Lovers",
    identity: {
      first_name: "Milo",
      last_name: "Brooks",
      apparent_age: 24,
      chronological_age: 24,
      birthday: "May 1",
      zodiac: "Taurus",
      species: "Human",
      race: "White_Caucasian",
      ethnicity: "Germanic_Anglo_Saxon",
      nationality: "United States",
      citizenship_status: "Native",
    },
    professional_matrix: {
      job_title: "Small-Town Artisan",
      socioeconomic_tier: "Working_Class",
      industry_domain: "Arts_Entertainment",
      authority_dynamic_vs_user: "Equal",
    },
    relational_network: {
      relationship_status: "Single",
      emotional_availability: "Fully_Open",
      scandal_risk_factor: "None",
      status_narrative_context:
        "Secretly harboring an intense, multi-year crush on his childhood best friend ({{user}}), masking it under high-energy platonic loyalty.",
      npc_cast: [
        {
          name: "Daisy Gallagher",
          connection: "Found_Family",
          romance_function: "The_Matchmaker",
          emotional_status: "Devoted_Loyal",
          desc_line:
            "The chaotic local barista who constantly drops aggressive hints to force Milo out of his cowardice.",
        },
      ],
    },
    adult_configuration: {
      nsfw_enabled: true,
      kink_power_role: "Switch",
      intensity_bracket: "Mild_Vanilla",
      sensory_tags: ["Praise"],
      anatomical_focus: "Hair_Face",
      material_preference: "Lace_Silk",
      situational_trigger: "Vulnerability_Sleep",
      intimacy_love_language: "Touch_Holding",
      aftercare_style: "The_Seeker",
      verbal_cadence: "Praise_Validation",
    },
    system_guardrails: {
      hard_hardlines: [
        "No toxic dynamics",
        "No writing for {{user}}",
        "Maintain organic emotional pacing",
      ],
      emotional_trauma_triggers: [
        "Fear of abandonment",
        "Threat of losing the friendship",
      ],
      behavioral_turn_offs: [
        "Cruelty",
        "Emotional coldness",
        "Manipulative games",
      ],
      physical_proximity_limit: "Open_Protective",
      proximity_violation_reaction:
        "If {{user}} shows sudden signs of emotional distress or physical fatigue, {{char}} must instantly discard all personal hesitation, moving into an intensely attentive caregiving hold.",
    },
    narrative_styling: {
      prose_texture: "Lighthearted_Wholesome",
      pacing_velocity: "Measured_Deliberate",
      worldview_filter: "Optimistic_Idealistic",
      action_wrapping_standard: "Quote_Isolated_Prose",
      narrative_perspective: "Third_Person_Past",
      max_paragraphs_per_turn: 2,
    },
  },
];

export function generateAgeGapRomance(
  trope: string,
  options: AgeGapRomanceOptions = {},
): CharacterCardData {
  const random = options.random ?? Math.random;
  const species = generateSpeciesData(options.speciesType ?? "Human", random);
  const kink =
    options.kink ??
    generateKinkData(
      trope,
      species.type,
      options.occupationAuthorityDynamic,
    );
  const ethnicity = generateEthnicityData(
    species.heritage,
    options.ethnicityRegion,
    options.linguisticMatrix,
    random,
  );
  const nationality = generateNationalityData(
    options.nationalityCountry,
    options.nationalityRegionalAlliance,
    options.nationalityLegalStatus,
    options.nationalityLinguisticVibe,
    ethnicity,
  );
  const occupation = generateOccupationData({
    academicYear: options.occupationAcademicYear,
    authorityDynamic: options.occupationAuthorityDynamic,
    campusAffiliation: options.occupationCampusAffiliation,
    fundingType: options.occupationFundingType,
    jobTitle: options.occupationJobTitle,
    majorField: options.occupationMajorField,
    professionalDomain: options.occupationProfessionalDomain,
    socioeconomicTier: options.occupationSocioeconomicTier,
    trope,
    workplaceVibe: options.occupationWorkplaceVibe,
  });
  const fetish =
    options.fetish ??
    generateFetishData(
      trope,
      species.type,
      occupation.kind === "professional"
        ? occupation.socioeconomicTier
        : undefined,
    );
  const archetype =
    options.archetype ??
    generateArchetypeConfigurationData(trope, species, occupation);
  const intimacyStyle =
    options.intimacyStyle ??
    applyArchetypeToIntimacyStyle(
      generateIntimacyStyleData(trope, species.nameAura),
      archetype,
      trope,
    );
  const turnOffs =
    options.turnOffs ??
    generateTurnOffData(trope, kink, intimacyStyle, species.nameAura);
  const relationships =
    options.relationships?.slice(0, 3) ?? generateRelationshipsData(trope);
  const relationshipStatus =
    options.relationshipStatus ??
    generateRelationshipStatusData(
      trope,
      occupation.kind === "professional"
        ? occupation.professionalDomain
        : undefined,
    );
  const scenario =
    options.scenario ??
    generateScenarioData(trope, occupation, relationshipStatus, fetish);
  const firstMessage =
    options.firstMessage ??
    generateFirstMessageData(trope, scenario, intimacyStyle, turnOffs);
  const formatting =
    options.formatting ??
    generateFormattingConfigurationData(trope, occupation, firstMessage);
  const tone =
    options.tone ?? generateToneConfigurationData(trope, species, occupation);
  const speechStyle =
    options.speechStyle ??
    generateSpeechStyleData(trope, archetype, occupation, tone);
  const speechExamples =
    normaliseSpeechExamples(options.speechExamples) ??
    generateSpeechExamplesData(
      speechStyle,
      archetype,
      relationshipStatus,
      trope,
    );
  const dialogueArrays =
    options.dialogueArrays ??
    generateDialogueArrayData(
      trope,
      archetype,
      occupation,
      species,
      speechStyle,
    );
  const proseGuidance =
    options.proseGuidance ??
    generateProseGuidanceData(trope, tone, formatting, scenario);
  const alternateGreetings = normaliseAlternateGreetings(
    options.alternateGreetings,
  );
  const groupGreetings = normaliseGroupGreetings(options.groupGreetings);
  const groupAlternateGreetings = normaliseGroupAlternateGreetings(
    options.groupAlternateGreetings,
  );
  const scenarioOpeningPairs = normaliseScenarioOpeningPairs(
    options.scenarioOpeningPairs,
  );
  const lorebookSummary =
    options.lorebookSummary ??
    generateLorebookSummaryData(trope, species, occupation, relationships);
  const framework =
    options.framework ??
    generateFrameworkConfigurationData(trope, lorebookSummary, firstMessage);
  const creatorsNotes =
    options.creatorsNotes ??
    generateCreatorsNotesData(trope, kink, fetish, lorebookSummary);
  const postHistoryInstructions =
    options.postHistoryInstructions ??
    generatePostHistoryInstructionsData(
      trope,
      turnOffs,
      intimacyStyle,
      lorebookSummary,
    );
  const worldLorePlaceholders = normaliseWorldLorePlaceholders(
    options.worldLorePlaceholders,
  ) ?? generateWorldLorePlaceholders(trope, species, occupation, lorebookSummary);
  const loreEntries =
    normaliseLoreEntries(options.loreEntries) ??
    generateLoreEntriesData(
      trope,
      species,
      occupation,
      relationships,
      lorebookSummary,
      worldLorePlaceholders,
    );
  const race = generateRaceData(options.raceMacroGroup, ethnicity);
  const anchorYear = options.anchorYear ?? new Date().getFullYear();
  const seed = species.seed;
  const preset = TROPE_PRESETS[normaliseTrope(options.trope ?? trope)];
  const ageProfile = seed
    ? {
        age: seed.chronological_age,
        apparentAge: seed.apparent_age,
        birthYear: 2026 - seed.chronological_age,
      }
    : isAcademicRivalsTrope(trope) && occupation.kind === "student"
      ? generateAcademicStudentAgeProfile(anchorYear, random)
    : generateAgeProfile(
        species.type,
        anchorYear,
        random,
        options.powerDynamic ?? trope,
      );
  const apparentAge = ageProfile.apparentAge ?? species.apparentAge;
  const birthDate = preset
    ? {
        birth_day: preset.birth_day,
        birth_month: preset.birth_month,
        zodiac: preset.zodiac,
      }
    : seed
      ? zodiacRepresentativeDate(seed.zodiac)
    : generateBirthDate(ageProfile.birthYear, random);

  return {
    given_name: seed?.given_name ?? "Cole",
    surname: seed?.surname ?? pickSurname(ethnicity.linguisticMatrix, random),
    age: ageProfile.age,
    alternateGreetings,
    apparent_age: apparentAge,
    archetype,
    birth_year: ageProfile.birthYear,
    birth_month: MONTH_NAMES[birthDate.birth_month - 1],
    birth_day: birthDate.birth_day,
    creatorsNotes,
    dialogueArrays,
    ethnicity,
    fetish,
    firstMessage,
    formatting,
    framework,
    groupAlternateGreetings,
    groupGreetings,
    intimacyStyle,
    kink,
    loreEntries,
    lorebookSummary,
    nationality,
    occupation,
    postHistoryInstructions,
    proseGuidance,
    race,
    relationshipStatus,
    relationships,
    scenario,
    scenarioOpeningPairs,
    speechExamples,
    speechStyle,
    tone,
    turnOffs,
    worldLorePlaceholders,
    zodiac: birthDate.zodiac,
    species: {
      ...species,
      apparentAge,
    },
  };
}

export function generateCharacterCardFromSeed(
  seed: CharacterCardSeed,
  options: Pick<AgeGapRomanceOptions, "anchorYear" | "random"> = {},
): CharacterCardData {
  const anchorYear = options.anchorYear ?? 2026;
  const birthday = parseSeedBirthday(seed.identity.birthday);
  const zodiac = asZodiacSign(seed.identity.zodiac) ?? birthday.zodiac;
  const species = speciesDataFromSeed(seed);
  const ethnicity = ethnicityDataFromSeed(seed);
  const nationality = nationalityDataFromSeed(seed, ethnicity);
  const occupation = occupationDataFromSeed(seed);
  const archetype = archetypeConfigurationFromSeed(seed);
  const kink = kinkDataFromSeed(seed);
  const fetish = fetishDataFromSeed(seed);
  const intimacyStyle = intimacyStyleDataFromSeed(seed, archetype);
  const turnOffs = turnOffDataFromSeed(seed);
  const relationships = relationshipsDataFromSeed(seed);
  const relationshipStatus = relationshipStatusDataFromSeed(seed);
  const formatting = formattingConfigurationFromSeed(seed);
  const tone = toneConfigurationFromSeed(seed);
  const speechStyle = generateSpeechStyleData(
    seed.trope_framework,
    archetype,
    occupation,
    tone,
  );
  const speechExamples = generateSpeechExamplesData(
    speechStyle,
    archetype,
    relationshipStatus,
    seed.trope_framework,
  );
  const dialogueArrays = generateDialogueArrayData(
    seed.trope_framework,
    archetype,
    occupation,
    species,
    speechStyle,
  );
  const proseGuidance = generateProseGuidanceData(
    seed.trope_framework,
    tone,
    formatting,
  );
  const race = generateRaceData(asRaceMacroGroup(seed.identity.race), ethnicity);
  const card = generateAgeGapRomance(seed.trope_framework, {
    anchorYear,
    archetype,
    dialogueArrays,
    ethnicityRegion: ethnicity.region,
    fetish,
    formatting,
    intimacyStyle,
    kink,
    linguisticMatrix: ethnicity.linguisticMatrix,
    nationalityCountry: nationality.passportCountry,
    nationalityLegalStatus: nationality.legalStatus,
    nationalityLinguisticVibe: nationality.linguisticVibe,
    nationalityRegionalAlliance: nationality.regionalAlliance,
    occupationAcademicYear:
      occupation.kind === "student" ? occupation.academicYear : undefined,
    occupationAuthorityDynamic: occupation.authorityDynamic,
    occupationCampusAffiliation:
      occupation.kind === "student" ? occupation.campusAffiliation : undefined,
    occupationFundingType:
      occupation.kind === "student" ? occupation.fundingType : undefined,
    occupationJobTitle: occupation.jobTitle,
    occupationMajorField:
      occupation.kind === "student" ? occupation.majorField : undefined,
    occupationProfessionalDomain:
      occupation.kind === "professional"
        ? occupation.professionalDomain
        : undefined,
    occupationSocioeconomicTier:
      occupation.kind === "professional"
        ? occupation.socioeconomicTier
        : undefined,
    occupationWorkplaceVibe: occupation.workplaceVibe,
    raceMacroGroup: race.macroGroup,
    proseGuidance,
    random: options.random,
    relationshipStatus,
    relationships,
    speciesType: species.type,
    speechExamples,
    speechStyle,
    tone,
    turnOffs,
  });

  return {
    ...card,
    age: seed.identity.chronological_age,
    apparent_age: seed.identity.apparent_age,
    archetype,
    birth_day: birthday.birth_day,
    birth_month: MONTH_NAMES[birthday.birth_month - 1],
    birth_year: anchorYear - seed.identity.chronological_age,
    dialogueArrays,
    ethnicity,
    fetish,
    formatting,
    framework: card.framework
      ? {
          ...card.framework,
          targetSpecification: asFrameworkTargetSpecification(
            seed.meta_version,
          ),
        }
      : undefined,
    given_name: seed.identity.first_name,
    intimacyStyle,
    kink,
    nationality,
    occupation,
    proseGuidance,
    race,
    relationshipStatus,
    relationships,
    species,
    speechExamples,
    speechStyle,
    surname: seed.identity.last_name,
    tone,
    turnOffs,
    zodiac,
  };
}

export function generateScenarioData(
  trope: string,
  occupation?: GeneratedOccupationData,
  relationshipStatus?: GeneratedRelationshipStatusData,
  fetish?: GeneratedFetishData,
): GeneratedScenarioData {
  const normalized = normaliseTrope(trope);

  if (normalized.includes("forced proximity")) {
    return {
      plotHook: "The_Crisis",
      scenePremiseDescription:
        "{{char}} and {{user}} are trapped after hours when a violent storm shuts the building down, forcing them to share the same narrow space until help arrives.",
      sensoryDetails: [
        "Stale elevator air",
        "Rain hammering glass",
        "Emergency lights",
      ],
      settingType: "Contained_Insular",
      startingTension: "Charged_Electric",
    };
  }

  if (
    isAcademicRivalsTrope(trope) ||
    occupation?.kind === "student"
  ) {
    return {
      plotHook: "The_Mandate",
      scenePremiseDescription:
        "{{char}} and {{user}} are assigned the same late-night archive table for a decisive university project neither of them can afford to fail.",
      sensoryDetails: [
        "Dusty archive stacks",
        "Old paper",
        "Dim brass lamps",
      ],
      settingType: "Corporate_Institutional",
      startingTension: "Combative_Friction",
    };
  }

  if (
    normalized.includes("workplace") ||
    (occupation?.kind === "professional" &&
      occupation.professionalDomain === "Corporate_Finance")
  ) {
    return {
      plotHook: "The_Mandate",
      scenePremiseDescription:
        "{{char}} and {{user}} are the only two people left on the executive floor for a mandatory late-night audit, with the city glowing beyond the glass walls.",
      sensoryDetails: [
        "Soft hum of a server rack",
        "Cold glass walls",
        "Late-night city lights",
      ],
      settingType: "Corporate_Institutional",
      startingTension: "Formal_Chilling",
    };
  }

  if (
    normalized.includes("dark romance") ||
    (occupation?.kind === "professional" &&
      occupation.professionalDomain === "Underworld") ||
    relationshipStatus?.scandalFactor === "High_Taboo" ||
    fetish?.situationalTrigger === "Sanguine_Biting"
  ) {
    return {
      plotHook: "The_Secret_Transaction",
      scenePremiseDescription:
        "{{char}} waits for {{user}} at the edge of a rain-slicked backstreet meeting point, where the exchange was supposed to be simple and private.",
      sensoryDetails: [
        "Ozone and rain",
        "Wet pavement",
        "Distant club bass",
      ],
      settingType: "Atmospheric_Wilderness",
      startingTension: "Formal_Chilling",
    };
  }

  return {
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
}

export function generateFirstMessageData(
  trope: string,
  scenario?: GeneratedScenarioData,
  intimacyStyle?: GeneratedIntimacyStyleData,
  turnOffs?: GeneratedTurnOffData,
): GeneratedFirstMessageData {
  const normalized = normaliseTrope(trope);
  const entryPoint = inferFirstMessageEntryPoint(normalized, scenario);
  const literaryStyle = inferFirstMessageLiteraryStyle(
    normalized,
    scenario,
    intimacyStyle,
  );
  const userCallToAction = inferFirstMessageCallToAction(
    normalized,
    scenario,
    intimacyStyle,
    turnOffs,
  );
  const tokenLengthCap = inferFirstMessageTokenCap(literaryStyle);

  return {
    aiOutputConstraint: buildFirstMessageOutputConstraint(
      entryPoint,
      literaryStyle,
      userCallToAction,
      tokenLengthCap,
    ),
    entryPoint,
    literaryStyle,
    tokenLengthCap,
    userCallToAction,
  };
}

export function generateAlternateGreetingData(
  baseCharacter: CharacterCardData,
  fork: Omit<GeneratedAlternateGreetingData, "completedGreeting" | "greetingId"> & {
    greetingId?: string;
  },
): GeneratedAlternateGreetingData {
  const greetingId = fork.greetingId ?? createStableGreetingId(fork);
  const completedGreeting = [
    `*${fork.aiGenerationDirective}*`,
    "",
    `{{char}} lets the alternate shape of the moment settle around them, still unmistakably ${baseCharacter.given_name} ${baseCharacter.surname} beneath the changed circumstances. The old rules remain intact: {{user}} has the next choice, and {{char}} will not make it for them.`,
    "",
    `"So," {{char}} says, voice low enough to make the forked timeline feel deliberate, "are you going to meet me here, or make me come to you?"`,
  ].join("\n");

  return {
    ...fork,
    completedGreeting,
    greetingId,
  };
}

export function generateDefaultAlternateGreetingForks(
  baseCharacter: CharacterCardData,
): GeneratedAlternateGreetingData[] {
  const name = `${baseCharacter.given_name} ${baseCharacter.surname}`;

  return [
    generateAlternateGreetingData(baseCharacter, {
      aiGenerationDirective: `Generate a prequel origin greeting where ${name} meets {{user}} before the main card timeline, keeping the same core personality and boundaries.`,
      associatedTrope: "Prequel / Origin Story",
      forkType: "Timeline_Shift",
    }),
    generateAlternateGreetingData(baseCharacter, {
      aiGenerationDirective:
        "Generate an established-romance alternate greeting where {{char}} and {{user}} already know each other's routines, focusing on intimate domestic tension without speaking for {{user}}.",
      associatedTrope: "Established Romance / Sequel",
      forkType: "Timeline_Shift",
    }),
    generateAlternateGreetingData(baseCharacter, {
      aiGenerationDirective:
        "Generate a high-friction alternate greeting that opens mid-argument, preserving {{char}}'s boundaries and ending with a clear chance for {{user}} to answer.",
      associatedTrope: "High-Friction / Aggressive Clash",
      forkType: "Tone_Escalation",
    }),
  ];
}

export function generateGroupGreetingData(
  baseCharacter: CharacterCardData,
  group: Omit<GeneratedGroupGreetingData, "completedGreeting" | "greetingId"> & {
    greetingId?: string;
  },
): GeneratedGroupGreetingData {
  const greetingId = group.greetingId ?? createStableGroupGreetingId(group);
  const completedGreeting = [
    `*${group.aiGroupDirective}*`,
    "",
    group.participatingCharacters
      .map((characterName) => `**${characterName}:** holds their place in the room, attention shifting toward {{user}} without stealing {{user}}'s response.`)
      .join("\n\n"),
    "",
    `The group tension settles into ${group.interpersonalDynamic.replace(/_/g, " ").toLowerCase()}, leaving {{user}} at the center of the next move.`,
  ].join("\n");

  return {
    ...group,
    completedGreeting,
    greetingId,
    participatingCharacters: group.participatingCharacters.slice(0, 4),
  };
}

export function generateDefaultGroupGreetingSet(
  baseCharacter: CharacterCardData,
): GeneratedGroupGreetingData[] {
  const primaryName = `${baseCharacter.given_name} ${baseCharacter.surname}`;
  const secondaryName =
    baseCharacter.relationships?.[0]?.npcName ?? "Julian Thorne";

  return [
    generateGroupGreetingData(baseCharacter, {
      aiGroupDirective:
        "Generate a group opening where {{char}} speaks first while the secondary character silently pressures the room when {{user}} enters.",
      formattingStyle: "Explicit_Name_Tags",
      interpersonalDynamic: "Wingman_Loop",
      participatingCharacters: [primaryName, secondaryName],
      spotlightDistribution: "Leader_Alpha",
    }),
    generateGroupGreetingData(baseCharacter, {
      aiGroupDirective:
        "Generate a group opening where the participating characters are mid-argument around a shared table before pivoting their attention to {{user}}.",
      formattingStyle: "Choreographed",
      interpersonalDynamic: "Love_Triangle_Rivalry",
      participatingCharacters: [primaryName, secondaryName],
      spotlightDistribution: "Duo_Synergy",
    }),
  ];
}

export function generateGroupAlternateGreetingData(
  baseCharacter: CharacterCardData,
  fork: Omit<
    GeneratedGroupAlternateGreetingData,
    "altGreetingId" | "completedGreeting"
  > & {
    altGreetingId?: string;
  },
): GeneratedGroupAlternateGreetingData {
  const altGreetingId =
    fork.altGreetingId ?? createStableGroupAlternateGreetingId(fork);
  const cast = fork.includedNpcNames.slice(0, 4);
  const completedGreeting = [
    `*${fork.aiMultiCharacterPrompt}*`,
    "",
    `The room has been re-skinned into ${fork.targetSettingVibe}, but the group's old loyalties still show in every glance.`,
    "",
    cast
      .map(
        (characterName) =>
          `**${characterName}:** keeps their position in the shifted scenario, reacting to {{user}} without taking {{user}}'s agency.`,
      )
      .join("\n\n"),
    "",
    `The fork lands as ${fork.forkCategory.replace(/_/g, " ").toLowerCase()}, waiting for {{user}} to decide which side of the room matters most.`,
  ].join("\n");

  return {
    ...fork,
    altGreetingId,
    completedGreeting,
    includedNpcNames: cast,
  };
}

export function generateDefaultGroupAlternateGreetingForks(
  baseCharacter: CharacterCardData,
): GeneratedGroupAlternateGreetingData[] {
  const primaryName = `${baseCharacter.given_name} ${baseCharacter.surname}`;
  const secondaryName =
    baseCharacter.relationships?.[0]?.npcName ?? "Alistair Sterling";

  return [
    generateGroupAlternateGreetingData(baseCharacter, {
      aiMultiCharacterPrompt:
        "Generate a group alternate greeting where the whole cast is united in a high-pressure intervention as {{user}} enters the room.",
      forkCategory: "Team_Loyalty_Shift",
      includedNpcNames: [primaryName, secondaryName],
      targetSettingVibe: "Mid-Crisis Boardroom",
    }),
    generateGroupAlternateGreetingData(baseCharacter, {
      aiMultiCharacterPrompt:
        "Generate a collective AU where the group is re-skinned into a gritty syndicate safehouse with old roles transformed into underworld hierarchy.",
      forkCategory: "Collective_AU",
      includedNpcNames: [primaryName, secondaryName],
      targetSettingVibe: "Gritty Safehouse",
    }),
  ];
}

export function generateScenarioOpeningPairData(
  baseCharacter: CharacterCardData,
  classificationType: ScenarioOpeningPairClassificationType = "Environmental_Anchor",
): GeneratedScenarioOpeningPairData {
  const alternateScenarioContext =
    scenarioForOpeningPairClassification(classificationType);
  const pairTitle = pairTitleForClassification(classificationType);
  const pairId = createStableScenarioOpeningPairId(
    pairTitle,
    classificationType,
    alternateScenarioContext,
  );
  const alternateFirstMessage = [
    `*${alternateScenarioContext.scenePremiseDescription}*`,
    "",
    `{{char}} is still ${baseCharacter.given_name} ${baseCharacter.surname}, but this fork changes the room around them. ${alternateScenarioContext.sensoryDetails.join(", ")} presses into the silence while the old dynamic rearranges itself around {{user}}.`,
    "",
    `"This is not the version of us you prepared for," {{char}} says, holding the moment open for {{user}}.`,
  ].join("\n");

  return {
    alternateFirstMessage,
    alternateScenarioContext,
    classificationType,
    pairId,
    pairTitle,
  };
}

export function generateDefaultScenarioOpeningPairs(
  baseCharacter: CharacterCardData,
): GeneratedScenarioOpeningPairData[] {
  return [
    generateScenarioOpeningPairData(baseCharacter, "Environmental_Anchor"),
    generateScenarioOpeningPairData(baseCharacter, "Timeline_Link"),
    generateScenarioOpeningPairData(baseCharacter, "Status_Valve"),
  ];
}

export function generateLorebookSummaryData(
  trope: string,
  species: GeneratedSpeciesData,
  occupation: GeneratedOccupationData,
  relationships: GeneratedNPCRelationshipData[] = [],
): GeneratedLorebookSummaryData {
  const normalized = normaliseTrope(trope);
  const factionName = relationships[0]?.npcName
    ? `${relationships[0].npcName.split(" ").slice(-1)[0]} network`
    : occupation.kind === "professional" &&
        occupation.professionalDomain === "Underworld"
      ? "Local syndicate network"
      : "Local social order";

  if (species.type !== "Human") {
    return {
      aiLoreInstruction:
        "Maintain the supernatural lore baseline compactly. NPCs should react to {{char}}'s biology according to the stated public stigma without overriding the active scene.",
      factionOrDynastyContext: `${factionName} protects old supernatural secrets around {{char}}, and every alliance carries family, territorial, or species-level consequences.`,
      tokenOptimizationCap: 150,
      universeAnchor: "Modern Dark Fantasy Hidden World",
      worldSystemRules: [
        `${species.type} characters are rare, socially consequential, and never treated as ordinary humans by informed NPCs.`,
        species.isImmortal
          ? "Immortal age and apparent age are separate truths; public records may be false or deliberately obscured."
          : "Mortal legal systems still constrain supernatural conflict in public spaces.",
        species.dietaryNeed
          ? `${species.type} physiology includes this need: ${species.dietaryNeed}.`
          : "Species instincts shape private behavior but do not erase consent or agency.",
      ],
    };
  }

  if (
    normalized.includes("billionaire") ||
    (occupation.kind === "professional" &&
      occupation.socioeconomicTier === "Ultra_Elite")
  ) {
    return {
      aiLoreInstruction:
        "Maintain the high-society/corporate lore baseline. Background NPCs should understand reputation, contracts, press optics, and internal hierarchy as active constraints.",
      factionOrDynastyContext: `${factionName} operates through wealth, reputation, and private leverage; scandals threaten contracts, inheritance, and professional standing.`,
      tokenOptimizationCap: 150,
      universeAnchor: "Contemporary Corporate High Society",
      worldSystemRules: [
        "Money and reputation determine access, safety, and social permission.",
        "Internal corporate or family rules can punish public romance, leaked secrets, or disloyal alliances.",
        "Every public interaction may be observed by rivals, staff, press, or family gatekeepers.",
      ],
    };
  }

  if (occupation.kind === "student" || normalized.includes("academic")) {
    return {
      aiLoreInstruction:
        "Maintain the campus lore baseline. Use academic deadlines, institutional reputation, and social circles as lightweight pressure without burying the romance scene.",
      factionOrDynastyContext: `${factionName} shapes campus gossip, academic opportunities, and social access around {{char}} and {{user}}.`,
      tokenOptimizationCap: 150,
      universeAnchor: "Contemporary University Social Field",
      worldSystemRules: [
        "Campus hierarchy runs through academic status, societies, teams, faculty, and reputation.",
        "Private romance can become public gossip quickly in shared dorms, libraries, and student events.",
        "Grades, scholarships, internships, and recommendations create real stakes.",
      ],
    };
  }

  return {
    aiLoreInstruction:
      "Maintain the contemporary romance lore baseline. Keep lore references compact and only surface rules that directly sharpen the current scene.",
    factionOrDynastyContext: `${factionName} provides the local pressure around {{char}} without replacing the active relationship dynamic.`,
    tokenOptimizationCap: 150,
    universeAnchor: "Contemporary Romance Local Canon",
    worldSystemRules: [
      "Social reputation, private history, and everyday obligations constrain choices.",
      "NPCs should remember existing relationships and current emotional stakes.",
      "Lore should support the scene rather than becoming exposition.",
    ],
  };
}

export function generateCreatorsNotesData(
  trope: string,
  kink: GeneratedKinkData,
  fetish: GeneratedFetishData,
  lorebookSummary: GeneratedLorebookSummaryData,
): GeneratedCreatorsNotesData {
  const normalized = normaliseTrope(trope);
  const isDark = normalized.includes("dark") || normalized.includes("mafia");
  const isWholesome =
    normalized.includes("comfort") ||
    normalized.includes("wholesome") ||
    normalized.includes("small town");
  const hasAdultModules = kink.nsfwEnabled || fetish.fetishEnabled;
  const contentRating: CreatorsNotesContentRating = isDark
    ? "Dark_Romance_Heavy"
    : hasAdultModules
      ? "M_Rated_Sensory"
      : isWholesome
        ? "SFW_Wholesome"
        : "M_Rated_Sensory";
  const triggerWarnings = [
    isDark ? "Dark romance tension" : "",
    kink.nsfwEnabled ? "Opt-in mature intimacy dynamics" : "",
    fetish.fetishEnabled ? "Opt-in fixation metadata" : "",
    lorebookSummary.universeAnchor.includes("Dark Fantasy")
      ? "Supernatural social stigma"
      : "",
    normalized.includes("arranged") ? "Arranged relationship pressure" : "",
  ].filter(Boolean);

  return {
    contentRating,
    idealUserPersona: idealUserPersonaForTrope(normalized),
    recommendedModels:
      lorebookSummary.worldSystemRules.length >= 3
        ? ["YOUR_API_large_context_model", "YOUR_API_reasoning_model"]
        : ["YOUR_API_roleplay_model", "YOUR_API_balanced_model"],
    technicalNotesText: [
      `Recommended context window: ${lorebookSummary.tokenOptimizationCap >= 150 ? "8k+ tokens" : "4k+ tokens"}.`,
      "Use third-person past tense with asterisks for actions for best card alignment.",
      "Suggested sampler baseline: Temperature 0.8-0.9, Min-P 0.05, repetition penalty tuned lightly to preserve banter.",
      "Keep user replies grounded in {{user}} only; the card is designed to preserve {{char}} autonomy and pacing.",
    ].join("\n"),
    triggerWarnings: triggerWarnings.length
      ? triggerWarnings
      : ["No major content warnings generated."],
  };
}

export function generatePostHistoryInstructionsData(
  trope: string,
  turnOffs: GeneratedTurnOffData,
  intimacyStyle: GeneratedIntimacyStyleData,
  lorebookSummary: GeneratedLorebookSummaryData,
): GeneratedPostHistoryInstructionsData {
  const normalized = normaliseTrope(trope);
  const isSlowBurn =
    normalized.includes("slow burn") ||
    normalized.includes("enemies") ||
    normalized.includes("academic");
  const driftControlRules = [
    isSlowBurn
      ? "Check recent chat progression before emotionally softening {{char}}; preserve slow-burn resistance for trust, vulnerability, confession, and romantic certainty until they have clearly changed on-page. Do not suppress high-heat physical escalation when context and agency support it."
      : "Preserve {{char}}'s established personality, relationship status, and current emotional pace.",
    "Preserve continuity, character logic, and the established dynamic; do not overwrite prior relationship state without on-page cause.",
    "Use lorebook summary only when it affects the active scene; do not dump unrelated background lore.",
    `Keep active world anchor in mind: ${lorebookSummary.universeAnchor}.`,
  ];
  const dynamicToneModifiers = [
    `If {{user}} triggers these turn-offs, intensify boundaries immediately: ${turnOffs.behavioralTurnOffs.join(", ")}.`,
    intimacyStyle.aftercareStyle === "The_Nurturer"
      ? "If {{user}} is hurt, crying, exhausted, or sincerely vulnerable, allow {{char}}'s hidden caregiving response to surface without solving everything instantly."
      : "If {{user}} offers genuine comfort or accountability, lower {{char}}'s defenses by one small visible beat only.",
    turnOffs.aiReactionPrompt,
  ];
  const formattingHardlines = [
    "Write {{char}}'s next reply in an immersive, character-driven roleplay with {{user}}.",
    "CRITICAL: Never write thoughts, actions, decisions, or dialogue for {{user}}.",
    "{{char}} cannot hear, know, answer, or react to {{user}}'s internal thoughts, private narration, or anything not directly spoken or visibly acted.",
    "Only reference {{user}} through explicitly provided dialogue, visible actions, and directly observable presence. Keep {{user}} behavior aligned with their persona and lorebook-defined patterns without inventing unobserved reactions.",
    "If {{char}} is not physically with {{user}}, do not narrate {{user}}'s current actions, speech, thoughts, body language, decisions, company, or surroundings.",
    "{{char}} has his own life, routine, friends, goals, and motivations outside of {{user}}.",
    "Do not conclude the scene, skip time, or resolve conflict unless {{user}} has explicitly moved there.",
    "Use Standard Prose Format: third-person prose paragraphs with spoken words in double quotation marks, actions/body language/reactions woven into the same paragraph or surrounding sentences, and a new paragraph whenever a different character speaks. Do not output APP: or USER: labels.",
    "Keep the response focused on {{char}}'s immediate perception, movement, and speech.",
    "Stay fully anchored to {{char}}'s perception and immediate inference. Show uncertainty as interpretation, not fact.",
    "Maintain continuity of space, timing, and prior actions.",
    "Do not quote, paraphrase, mirror, or lightly restyle {{user}}'s previous message. Respond from {{char}}'s next perception, movement, thought, or speech instead.",
    "Do not reuse the same key noun, verb, adjective, gesture, or line pattern twice in close proximity unless necessary for clarity.",
    "Write exactly one reply only.",
    "Stop immediately before {{user}} would need to respond, narrate, make a choice, or speak.",
  ];

  return {
    driftControlRules,
    dynamicToneModifiers,
    formattingHardlines,
    injectionTokenWeight: 50,
  };
}

export function generateWorldLorePlaceholders(
  trope: string,
  species: GeneratedSpeciesData,
  occupation: GeneratedOccupationData,
  lorebookSummary: GeneratedLorebookSummaryData,
): GeneratedWorldLorePlaceholderData[] {
  const normalized = normaliseTrope(trope);
  const isUnderworld =
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Underworld";
  const isCorporate =
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Corporate_Finance";
  const isSupernatural = species.type !== "Human";

  return [
    createWorldLorePlaceholder(
      "{{world_setting}}",
      "Environmental_Anchor",
      lorebookSummary.universeAnchor,
      false,
    ),
    createWorldLorePlaceholder(
      "{{faction_hq}}",
      "Environmental_Anchor",
      isUnderworld
        ? "Syndicate safehouse and private backroom network"
        : isCorporate
          ? "Private corporate high-rise, executive offices, and restricted boardrooms"
          : occupation.kind === "student"
            ? "University library, society rooms, dorm corridors, and faculty offices"
            : "Local social center tied to {{char}}'s daily obligations",
      true,
    ),
    createWorldLorePlaceholder(
      "{{law_system}}",
      "Environmental_Anchor",
      isUnderworld
        ? "Syndicate omerta, private enforcement, and corrupt official pressure"
        : isCorporate
          ? "Strict corporate anti-fraternization policy, NDA pressure, and reputation law"
          : "Contemporary civil law, social accountability, and local gossip consequences",
      true,
    ),
    createWorldLorePlaceholder(
      "{{species_status}}",
      "Population_Baseline",
      isSupernatural
        ? `${species.type} status: rare, socially consequential, and treated as ${species.isImmortal ? "old-power elite" : "dangerous edge-case"} by informed NPCs`
        : "Baseline mortal population; species identity does not override ordinary legal and social stakes",
      false,
    ),
    createWorldLorePlaceholder(
      "{{class_divide}}",
      "Population_Baseline",
      occupation.kind === "professional" &&
        occupation.socioeconomicTier === "Ultra_Elite"
        ? "Extreme wealth disparity shapes access, risk, reputation, and who can speak freely"
        : "Everyday class pressure affects work, privacy, mobility, and social judgment",
      true,
    ),
    createWorldLorePlaceholder(
      "{{public_stigma}}",
      "Population_Baseline",
      isSupernatural
        ? "Public response ranges from fear to fascination when supernatural identity leaks"
        : "Public stigma depends on reputation, scandal, profession, and visible relationship boundaries",
      true,
    ),
    createWorldLorePlaceholder(
      "{{lore_catalyst}}",
      "Legacy_Tag",
      lorebookSummary.worldSystemRules[0] ??
        "A recent private crisis reshaped {{char}}'s trust and social position",
      false,
    ),
    createWorldLorePlaceholder(
      "{{bloodline_feud}}",
      "Legacy_Tag",
      normalized.includes("dark") || isUnderworld
        ? "Active rivalry between family, syndicate, or corporate factions creates external danger"
        : "Legacy pressure comes from family expectation, reputation, and old private grudges",
      true,
    ),
    createWorldLorePlaceholder(
      "{{taboo_history}}",
      "Legacy_Tag",
      normalized.includes("forbidden") || normalized.includes("arranged")
        ? "A hidden obligation, forbidden agreement, or old promise makes the relationship socially dangerous"
        : "A private truth from {{char}}'s past can surface only when the current scene triggers it",
      true,
    ),
  ];
}

export function generateLoreEntriesData(
  trope: string,
  species: GeneratedSpeciesData,
  occupation: GeneratedOccupationData,
  relationships: GeneratedNPCRelationshipData[],
  lorebookSummary: GeneratedLorebookSummaryData,
  worldLorePlaceholders: GeneratedWorldLorePlaceholderData[],
): GeneratedLoreEntryData[] {
  const normalized = normaliseTrope(trope);
  const isUnderworld =
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Underworld";
  const isCorporate =
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Corporate_Finance";
  const isSupernatural = species.type !== "Human";
  const primaryRelationship = relationships[0];
  const placeholderPayload = (key: string, fallback: string) =>
    worldLorePlaceholders.find((placeholder) => placeholder.variableKey === key)
      ?.currentDataPayload ?? fallback;

  const entries: GeneratedLoreEntryData[] = [
    createLoreEntry({
      activationKeys: ["world setting", "faction", "law system"],
      domainScope: "Geopolitical_Faction",
      entryContent: [
        `${lorebookSummary.universeAnchor}: ${lorebookSummary.factionOrDynastyContext}`,
        `Absolute rules: ${lorebookSummary.worldSystemRules.join(" | ")}`,
        `Operational law: ${placeholderPayload("{{law_system}}", "Local law and reputation pressure govern public choices.")}`,
      ].join(" "),
      insertionPriority: "Constant_Anchor",
      title: `${lorebookSummary.universeAnchor} Core Context`,
      tokenReserveCost: Math.max(100, lorebookSummary.tokenOptimizationCap),
    }),
    createLoreEntry({
      activationKeys: speciesActivationKeys(species, normalized),
      domainScope: "Mythological_Rules",
      entryContent: isSupernatural
        ? `${species.type} rules: ${placeholderPayload("{{species_status}}", "Supernatural identity is socially dangerous when exposed.")} ${species.dietaryNeed ? `Dietary need: ${species.dietaryNeed}.` : ""} Instinct trait: ${species.instinctualTrait}.`
        : `Human baseline rules: ${placeholderPayload("{{species_status}}", "Mortal social and legal constraints remain active.")} Stakes should stay grounded in work, reputation, consent, safety, and ordinary consequence.`,
      insertionPriority: isSupernatural ? "Recursive_Linked" : "Reactive_Contextual",
      title: isSupernatural
        ? `${species.type} Physiology and Social Status`
        : "Mortal Baseline Social Rules",
      tokenReserveCost: 110,
    }),
    createLoreEntry({
      activationKeys: primaryRelationship
        ? [
            primaryRelationship.npcName,
            primaryRelationship.connectionType.replaceAll("_", " "),
            primaryRelationship.romanceFunction.replaceAll("_", " "),
          ]
        : ["family pressure", "professional circle", "romance barrier"],
      domainScope: "Biographical_NPC",
      entryContent: primaryRelationship
        ? `${primaryRelationship.npcName}: ${primaryRelationship.oneLineDescription} Connection: ${primaryRelationship.connectionType}. Romance function: ${primaryRelationship.romanceFunction}. Emotional status: ${primaryRelationship.emotionalStatus}.`
        : "No named NPC is locked for this card yet; keep background pressure broad and avoid inventing a permanent cast member unless the user introduces one.",
      insertionPriority: "Reactive_Contextual",
      title: primaryRelationship
        ? `${primaryRelationship.npcName} Relationship File`
        : "Relationship Network Placeholder",
      tokenReserveCost: 90,
    }),
    createLoreEntry({
      activationKeys: societalActivationKeys(normalized, occupation),
      domainScope: "Societal_Customs",
      entryContent: [
        `Public stigma: ${placeholderPayload("{{public_stigma}}", "Scandal and reputation pressure affect how NPCs respond.")}`,
        `Class divide: ${placeholderPayload("{{class_divide}}", "Class pressure shapes access and privacy.")}`,
        `Legacy pressure: ${placeholderPayload("{{bloodline_feud}}", "Old grudges and private promises create external pressure.")}`,
        isUnderworld
          ? "Underworld etiquette requires silence, loyalty, debt accounting, and careful public masks."
          : isCorporate
            ? "Corporate etiquette requires discretion, audit trails, reputation management, and visible professionalism."
            : occupation.kind === "student"
              ? "Campus etiquette revolves around public reputation, rank, societies, academic deadlines, and peer gossip."
              : "Local custom should stay tied to the active romance trope and current setting.",
      ].join(" "),
      insertionPriority: "Reactive_Contextual",
      title: isUnderworld
        ? "Underworld Codes and Public Scandal"
        : isCorporate
          ? "Corporate Etiquette and Fraternization Risk"
          : occupation.kind === "student"
            ? "Campus Custom and Peer Reputation"
            : "Societal Custom and Reputation Rules",
      tokenReserveCost: 120,
    }),
  ];

  return entries.slice(0, 8);
}

export function generateFrameworkConfigurationData(
  trope: string,
  lorebookSummary: GeneratedLorebookSummaryData,
  firstMessage: GeneratedFirstMessageData,
): GeneratedFrameworkConfigurationData {
  const normalized = normaliseTrope(trope);
  const hasDeepLore =
    lorebookSummary.tokenOptimizationCap >= 150 ||
    lorebookSummary.worldSystemRules.length >= 3;
  const hasDynamicRuntime =
    normalized.includes("dark") ||
    normalized.includes("mafia") ||
    normalized.includes("supernatural") ||
    normalized.includes("forbidden");
  const memoryBudgetStrategy: FrameworkMemoryBudgetStrategy = hasDeepLore
    ? "Extended_Deep_Lore"
    : firstMessage.tokenLengthCap <= 350
      ? "Ultra_Lean_Context"
      : "Dynamic_User_Sliders";
  const injectionPipelineRouter: FrameworkInjectionPipelineRouter =
    hasDynamicRuntime ? "Dynamic_Variable_Loop" : "Segmented_Placements";

  return {
    frameworkId: createStableFrameworkConfigurationId(
      lorebookSummary.universeAnchor,
      memoryBudgetStrategy,
      injectionPipelineRouter,
    ),
    globalTokenSafetyBuffer:
      memoryBudgetStrategy === "Ultra_Lean_Context" ? 200 : 350,
    injectionPipelineRouter,
    memoryBudgetStrategy,
    systemPromptJailbreakOverride:
      "Write only the requested card text. Keep {{char}} and {{user}} exactly as written. Never write actions, thoughts, or dialogue for {{user}}.",
    targetSpecification: "V3_Card_Layout",
  };
}

export function generateFormattingConfigurationData(
  trope: string,
  occupation: GeneratedOccupationData,
  firstMessage: GeneratedFirstMessageData,
): GeneratedFormattingConfigurationData {
  const normalized = normaliseTrope(trope);
  const isTechnical =
    occupation.kind === "professional" &&
    (occupation.jobTitle.toLowerCase().includes("engineer") ||
      occupation.jobTitle.toLowerCase().includes("hacker") ||
      occupation.professionalDomain === "Corporate_Finance");
  const actionWrappingStandard: FormattingActionWrappingStandard =
    firstMessage.literaryStyle === "Chat_Symphonic"
      ? "Raw_Script"
      : firstMessage.literaryStyle === "Internal_Monologue_Heavy"
        ? "Bracket_Monologue"
        : "Quote_Isolated_Prose";
  const markdownEmphasisStyle: FormattingMarkdownEmphasisStyle = isTechnical
    ? "Code_Block_Shielding"
    : normalized.includes("dark") || normalized.includes("enemies")
      ? "Weighted_Bold_Impact"
      : "Clean_Prose";
  const narrativePerspective: FormattingNarrativePerspective =
    firstMessage.literaryStyle === "Chat_Symphonic"
      ? "Third_Person_Present"
      : "Third_Person_Past";
  const maxParagraphsPerTurn =
    firstMessage.tokenLengthCap >= 550
      ? 5
      : firstMessage.tokenLengthCap <= 350
        ? 3
        : 4;

  return {
    actionWrappingStandard,
    formattingId: createStableFormattingConfigurationId(
      actionWrappingStandard,
      markdownEmphasisStyle,
      narrativePerspective,
    ),
    formattingSystemPromptInjection: buildFormattingSystemPromptInjection(
      actionWrappingStandard,
      markdownEmphasisStyle,
      narrativePerspective,
      maxParagraphsPerTurn,
    ),
    markdownEmphasisStyle,
    maxParagraphsPerTurn,
    narrativePerspective,
  };
}

export function generateToneConfigurationData(
  trope: string,
  species: GeneratedSpeciesData,
  occupation: GeneratedOccupationData,
): GeneratedToneConfigurationData {
  const normalized = normaliseTrope(trope);
  const isDark =
    normalized.includes("dark") ||
    normalized.includes("mafia") ||
    normalized.includes("captive") ||
    species.type === "Vampire";
  const isWholesome =
    normalized.includes("friends") ||
    normalized.includes("small town") ||
    normalized.includes("slice") ||
    normalized.includes("comfort") ||
    normalized.includes("wholesome");
  const isAngsty =
    normalized.includes("second chance") ||
    normalized.includes("longing") ||
    normalized.includes("hurt") ||
    normalized.includes("angst");
  const isFormal =
    normalized.includes("regency") ||
    normalized.includes("gothic") ||
    normalized.includes("arranged") ||
    normalized.includes("academy") ||
    species.type === "Fae";
  const isShadowEconomy =
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Underworld";
  const proseTexture: ToneProseTexture = isDark
    ? "Gritty_Melodramatic"
    : isFormal
      ? "Formal_Poetic"
      : isAngsty
        ? "Angsty_Melancholic"
        : isWholesome
          ? "Lighthearted_Wholesome"
          : "Angsty_Melancholic";
  const pacingVelocity: TonePacingVelocity =
    normalized.includes("slow") || isDark || isAngsty
      ? "Slow_Tease_Prose"
      : normalized.includes("banter") || normalized.includes("fake dating")
        ? "Clipped_Rapid"
        : "Measured_Deliberate";
  const worldviewFilter: ToneWorldviewFilter =
    isDark || isShadowEconomy
      ? "Ruthless_Cynical"
      : isWholesome
        ? "Optimistic_Idealistic"
        : "Jaded_Weary";
  const aiVocabularyDirectives = toneVocabularyDirectives(
    proseTexture,
    worldviewFilter,
  );

  return {
    aiVocabularyDirectives,
    pacingVelocity,
    proseTexture,
    toneId: createStableToneConfigurationId(
      proseTexture,
      pacingVelocity,
      worldviewFilter,
    ),
    toneSystemPromptInjection: buildToneSystemPromptInjection(
      proseTexture,
      pacingVelocity,
      worldviewFilter,
      aiVocabularyDirectives,
    ),
    worldviewFilter,
  };
}

export function generateArchetypeConfigurationData(
  trope: string,
  species: GeneratedSpeciesData,
  occupation: GeneratedOccupationData,
): GeneratedArchetypeConfigurationData {
  const normalized = normaliseTrope(trope);
  const isSecondChance =
    normalized.includes("second chance") || normalized.includes("divorce");
  const isBodyguard =
    normalized.includes("bodyguard") || normalized.includes("client");
  const isForcedProximity = normalized.includes("forced proximity");
  const isAcademic =
    normalized.includes("academic") || occupation.jobTitle === "University Student";
  const isCaregiver =
    normalized.includes("hurt") ||
    normalized.includes("comfort") ||
    normalized.includes("friends") ||
    normalized.includes("small town");
  const isRogue =
    normalized.includes("fake dating") ||
    normalized.includes("rogue") ||
    normalized.includes("banter");
  const isVengeful =
    normalized.includes("mafia") ||
    normalized.includes("dark") ||
    (occupation.kind === "professional" &&
      occupation.professionalDomain === "Underworld");
  const isWorkplaceElite =
    normalized.includes("workplace") ||
    normalized.includes("billionaire") ||
    (occupation.kind === "professional" &&
      (occupation.socioeconomicTier === "Ultra_Elite" ||
        occupation.professionalDomain === "Corporate_Finance"));
  const personaType: ArchetypePersonaType =
    species.type === "Vampire"
      ? "The_Ancient_Predator"
      : species.type === "Fae"
        ? "The_Fae_Deal_Maker"
        : isSecondChance || normalized.includes("age gap")
          ? "The_Jaded_Veteran"
          : isBodyguard
            ? "The_Quiet_Guardian"
            : isVengeful && !normalized.includes("old money")
              ? "The_Vigilante_Outcast"
              : normalized.includes("old money") || normalized.includes("syndicate")
                ? "The_Ruthless_Architect"
                : isAcademic
                  ? "The_Perfectionist"
                  : normalized.includes("heir") || normalized.includes("elite")
                    ? "The_Broken_Heir"
                    : isCaregiver
                      ? "The_Golden_Retriever"
                      : isRogue
                        ? "The_Rogue_Instigator"
                        : isForcedProximity && isWorkplaceElite
                          ? "The_Ruthless_Architect"
                          : "The_Stoic_Wall";
  const defenseMechanism = defenseMechanismForArchetype(personaType);
  const coreMotivation = coreMotivationForArchetype(personaType, isVengeful);

  return {
    aiBehaviorPrompt: buildArchetypeBehaviorPrompt(
      personaType,
      defenseMechanism,
      coreMotivation,
    ),
    archetypeId: createStableArchetypeConfigurationId(
      personaType,
      defenseMechanism,
      coreMotivation,
    ),
    coreMotivation,
    defenseMechanism,
    personaType,
  };
}

export function generateSpeechStyleData(
  trope: string,
  archetype: GeneratedArchetypeConfigurationData,
  occupation: GeneratedOccupationData,
  tone: GeneratedToneConfigurationData,
): GeneratedSpeechStyleData {
  const normalized = normaliseTrope(trope);
  const isAcademic =
    occupation.jobTitle === "University Student" ||
    occupation.jobTitle.toLowerCase().includes("professor") ||
    normalized.includes("academic");
  const register: SpeechRegister =
    archetype.personaType === "The_Ancient_Predator"
      ? "Predatory_Quiet"
      : archetype.personaType === "The_Ruthless_Architect" ||
          tone.proseTexture === "Formal_Poetic"
        ? "Velvet_Formal"
        : archetype.personaType === "The_Rogue_Instigator"
          ? "Playful_Banter"
          : archetype.personaType === "The_Golden_Retriever" ||
              archetype.personaType === "The_Quiet_Guardian"
            ? "Soft_Reassurance"
            : isAcademic || archetype.personaType === "The_Perfectionist"
              ? "Academic_Precise"
              : "Clipped_Command";
  const vocabularyMode = vocabularyModeForSpeech(register, tone);
  const addressStyle = addressStyleForSpeech(register, normalized);
  const pitch = pitchForSpeech(register, archetype);
  const texture = textureForSpeech(register, tone);
  const volumeBaseline = volumeBaselineForSpeech(register);
  const emotionalDelivery = emotionalDeliveryForSpeech(register, archetype);
  const vocalHabits = vocalHabitsForSpeech(register, addressStyle);
  const physicalMannerisms = physicalMannerismsForSpeech(register, archetype);
  const syntaxCadence = syntaxCadenceForSpeech(register);
  const linguisticFlavor = linguisticFlavorForSpeech(occupation, normalized);
  const vocalRegister = vocalRegisterForSpeech(register, archetype);
  const dialogueTagsWhitelist = dialogueTagsForSpeech(
    register,
    vocalRegister,
    emotionalDelivery,
  );
  const dialogueDos = dialogueDosForSpeech(register);
  const dialogueDonts = dialogueDontsForSpeech(register);

  return {
    addressStyle,
    dialogueTagsWhitelist,
    dialogueDonts,
    dialogueDos,
    emotionalDelivery,
    linguisticFlavor,
    physicalMannerisms,
    pitch,
    register,
    texture,
    speechPatternInstruction: buildSpeechPatternInstruction(
      register,
      vocabularyMode,
      addressStyle,
      pitch,
      texture,
      volumeBaseline,
      emotionalDelivery,
      syntaxCadence,
      linguisticFlavor,
      vocalRegister,
      dialogueTagsWhitelist,
    ),
    speechSystemPromptInjection: buildSpeechSystemPromptInjection(
      syntaxCadence,
      linguisticFlavor,
      vocalRegister,
      dialogueTagsWhitelist,
    ),
    styleId: createStableSpeechStyleId(
      register,
      vocabularyMode,
      addressStyle,
      pitch,
      texture,
      emotionalDelivery,
      syntaxCadence,
      linguisticFlavor,
      vocalRegister,
    ),
    syntaxCadence,
    vocalHabits,
    volumeBaseline,
    vocalRegister,
    vocabularyMode,
  };
}

export function generateSpeechExamplesData(
  speechStyle: GeneratedSpeechStyleData,
  archetype: GeneratedArchetypeConfigurationData,
  relationshipStatus: GeneratedRelationshipStatusData,
  trope: string,
): GeneratedSpeechExampleData[] {
  const normalized = normaliseTrope(trope);
  const examples: Array<Omit<GeneratedSpeechExampleData, "exampleId">> = [
    {
      category: "Greeting",
      exampleLine: exampleLineForGreeting(speechStyle.register),
      state: "Calm",
      stateLabel: "calm",
      usageContext:
        "Use as a tonal reference for first contact or the first turn after scene setup.",
    },
    {
      category: "Conflict",
      exampleLine: exampleLineForConflict(speechStyle.register),
      state: "Furious",
      stateLabel: "furious",
      usageContext:
        "Use when {{user}} challenges {{char}}, violates pacing, or forces a rivalry beat.",
    },
    {
      category:
        relationshipStatus.emotionalAvailability === "Fully_Open" ||
        archetype.personaType === "The_Golden_Retriever"
          ? "Care"
          : "Romantic_Tension",
      exampleLine: exampleLineForSoftening(speechStyle.register),
      state:
        relationshipStatus.emotionalAvailability === "Fully_Open" ||
        archetype.personaType === "The_Golden_Retriever"
          ? "Alone_With_User"
          : "Defensive",
      stateLabel:
        relationshipStatus.emotionalAvailability === "Fully_Open" ||
        archetype.personaType === "The_Golden_Retriever"
          ? "alone with {{user}}"
          : "defensive",
      usageContext:
        "Use when defenses lower, but keep {{char}} from confessing too quickly.",
    },
  ];

  if (normalized.includes("dark") || normalized.includes("arranged")) {
    examples.push({
      category: "Boundary",
      exampleLine: exampleLineForBoundary(speechStyle.register),
      state: "Possessive",
      stateLabel: "being possessive",
      usageContext:
        "Use when the contract, taboo, or power imbalance needs to be reinforced without writing for {{user}}.",
    });
  }

  return examples.slice(0, 5).map((example) => ({
    ...example,
    exampleId: createStableSpeechExampleId(
      example.category,
      speechStyle.register,
      example.exampleLine,
    ),
  }));
}

export function generateDialogueArrayData(
  trope: string,
  archetype: GeneratedArchetypeConfigurationData,
  occupation: GeneratedOccupationData,
  species: GeneratedSpeciesData,
  speechStyle: GeneratedSpeechStyleData,
): GeneratedDialogueArrayData {
  const normalized = normaliseTrope(trope);
  const doVocabularyWhitelist = createDoVocabularyWhitelist(
    occupation,
    species,
    speechStyle,
  );
  const dontVocabularyBlacklist = createDontVocabularyBlacklist(
    normalized,
    archetype,
    species,
    speechStyle,
  );
  const structuralDoRules = createStructuralDoRules(speechStyle);
  const structuralDontRules = createStructuralDontRules(
    archetype,
    species,
    speechStyle,
  );
  const darkEroticDisciplineRules = createDarkEroticDisciplineRules(
    normalized,
    speechStyle,
  );

  return {
    aiLinguisticConstraintPrompt: buildDialogueConstraintPrompt(
      archetype,
      speechStyle,
      doVocabularyWhitelist,
      dontVocabularyBlacklist,
      structuralDoRules,
      structuralDontRules,
      darkEroticDisciplineRules,
    ),
    arrayId: createStableDialogueArrayId(
      speechStyle.styleId,
      doVocabularyWhitelist,
      dontVocabularyBlacklist,
    ),
    dontVocabularyBlacklist,
    doVocabularyWhitelist,
    structuralDontRules,
    structuralDoRules: [...structuralDoRules, ...darkEroticDisciplineRules],
  };
}

export function generateProseGuidanceData(
  trope: string,
  tone: GeneratedToneConfigurationData,
  formatting: GeneratedFormattingConfigurationData,
  scenario?: GeneratedScenarioData,
): GeneratedProseGuidanceData {
  const sensoryAnchors = createSensoryAnchors(trope, scenario);
  const groundingInstructions = [
    "Produce immersive, emotionally intense dark romantic prose that reads like a real novel scene: dramatic, sensual, psychologically charged, and never fragmentary or abstract",
    "Engage the senses before stating emotional conclusions",
    "Replace vague abstractions with bodily reactions, objects, light, scent, sound, and temperature",
    "Personalize romantic attention through character history, insecurity, values, or current stakes",
    "Create narrative friction through conflicting goals, social pressure, miscommunication, or external risk",
    "Earn melodrama through interaction mechanics: proximity, near-touch, control versus resistance, silence, hesitation, interruption, power shifts, positioning, and emotional leverage",
    "Write in close third-person past tense limited, keeping prose grounded, vivid, concrete, and anchored to {{char}}'s immediate perception",
    "Anchor every scene in physical space before escalating sensual detail",
    "Keep sensual detail grounded and continuous through skin awareness, breath, heat, pressure, distance, and restraint",
    "Handle power imbalance, coercive tension, obsession, and morally gray behavior with clear character agency and consequence",
    "Show negotiation of power through behavior and dialogue instead of romanticized abstraction",
    "Make resistance, hesitation, or consent visible through action before escalating intensity",
    "Separate physical heat from emotional burn: erotic and NSFW physical escalation can happen often and quickly when context, agency, and continuity support it, while emotional escalation stays slower and earned",
    "Preserve cause and effect so every reaction follows from the previous beat and remains psychologically believable",
    "Preserve continuity, character logic, and the established dynamic across every response",
    "Keep {{char}} independent, with goals, priorities, agency, and the ability to hesitate, contradict themselves, misread, restrain themselves, or refuse",
    "{{char}} has his own life, routine, friends, goals, and motivations outside of {{user}}",
    "Anchor narration to {{char}}, NPCs, and world atmosphere only",
    "Limit narration to what {{char}} can directly perceive, physically feel, remember, or reasonably infer",
    "{{char}} cannot hear, know, answer, or react to {{user}}'s internal thoughts, private narration, or anything not directly spoken or visibly acted",
    "Control NPCs, background events, and the environment while keeping {{user}} untouched",
  ];
  const microActionPrompts = [
    "Use precise physical action instead of standalone pauses",
    "Show emotional processing through micro-expressions, breath, swallowing, fidgeting, or posture changes",
    "Anchor silence in environmental interaction such as glass rims, rain-streaked windows, papers, clothing, or furniture",
    "Use physical positioning to raise intensity: standing over, blocking exits, looming, retreating, leaning in, or deliberately creating distance",
    "Use emotional leverage in action and dialogue: withholding, teasing, testing, provocation, or controlled restraint",
    "Use sensory detail, physicality, gesture, restraint, and subtext instead of generic reaction labels",
    "Track sensuality through concrete bodily continuity: a breath catching, heat gathering under skin, pressure at a wrist, distance narrowing, or restraint held in the hands",
    "Show agency shifts in the body: a hand stopping short, a step back, a held gaze, a verbal refusal, a deliberate invitation, or {{char}} adjusting pressure in response",
    "Use anticipation, delay, interruption, and renewed contact to make frequent physical escalation feel contextual rather than emotionally rushed",
    "Let {{char}} act from independent priorities: pursuing an objective, withholding a response, misreading a cue, refusing a demand, or choosing restraint",
    "Keep the world active through movement, interruption, timing, pressure, and continuity",
    "Let NPCs initiate, delay, refuse, redirect, interrupt, or disengage when it preserves believable scene pressure",
    "Respond from {{char}}'s next perception, movement, thought, or speech instead of quoting, paraphrasing, mirroring, or restyling {{user}}'s previous message",
    "During the silent self-correction pass, expand clipped aesthetic sentences into full narrative flow and replace abstract phrasing with physical or behavioral detail",
    "Let internal monologue reveal biased, specific thoughts rather than universal romantic truths",
  ];
  const pacingRules = createProsePacingRules(tone, formatting);
  const bannedNarrationPatterns = [
    "No vague labels such as deep connection, undeniable chemistry, or looked at each other with love",
    "No one-line dramatic beats outside dialogue",
    "No filler, recap, cliches, repeated hooks, or generic reactions",
    "No aphorisms, moral commentary, or sweeping thematic declarations",
    "No choppy stack of short sentences for aesthetic drama",
    "No purple-prose cosmic metaphors replacing concrete physical emotion",
    "No fragmentary, poetic, or abstract affectation that collapses novel-scene realism into mood-board shorthand",
    "No philosophical rumination, abstract emotional narration, or self-aware danger commentary unless grounded in action",
    "No overwrought internal monologue used as a substitute for interaction",
    "No abstract erotic language or symbolic, metaphor-heavy sensual description",
    "No skipping emotional or psychological transitions during power shifts",
    "No romanticized abstraction that treats coercive tension as consequence-free",
    "No jumping directly from emotional conflict to explicit action",
    "No mechanical intimate description that ignores character reaction",
    "No pseudo-profound lines, mood-board prose, or intensity generated by style instead of interaction",
    "No omniscient narration or head-hopping",
    "No treating {{user}}'s internal thoughts, private narration, or unspoken text as something {{char}} can hear or know",
    "No quoting, paraphrasing, mirroring, or lightly restyling {{user}}'s previous message",
    "No reusing the same key noun, verb, adjective, gesture, or line pattern twice in close proximity unless needed for clarity",
  ];

  return {
    bannedNarrationPatterns,
    groundingInstructions,
    guidanceId: createStableProseGuidanceId(
      tone.proseTexture,
      tone.pacingVelocity,
      formatting.narrativePerspective,
      sensoryAnchors,
    ),
    microActionPrompts,
    pacingRules,
    proseConstraintPrompt: buildProseConstraintPrompt(
      sensoryAnchors,
      groundingInstructions,
      microActionPrompts,
      pacingRules,
      bannedNarrationPatterns,
    ),
    sensoryAnchors,
  };
}

export function generateEthnicityData(
  heritage: string | undefined,
  ethnicityRegion: EthnicityRegion | undefined,
  linguisticMatrix: LinguisticMatrix | undefined,
  random: () => number = Math.random,
): GeneratedEthnicityData {
  const inferredMatrix =
    linguisticMatrix ?? inferLinguisticMatrix(heritage) ?? "Anglophone";
  const inferredRegion =
    ethnicityRegion ??
    inferEthnicityRegion(heritage, inferredMatrix) ??
    "Northern_Western_European";
  const culturalHeritage =
    heritage ?? defaultCulturalHeritage(inferredRegion, inferredMatrix);
  const societalContext =
    inferredRegion === "Diaspora_Blended"
      ? "Multigenerational Diaspora"
      : random() < 0.25
        ? "First-Generation Immigrant"
        : "Indigenous / Native Home Ground";

  return {
    culturalHeritage,
    hasDiasporicBaggage: societalContext !== "Indigenous / Native Home Ground",
    linguisticMatrix: inferredMatrix,
    nativeLanguage: nativeLanguageForMatrix(inferredMatrix),
    region: inferredRegion,
    societalContext,
  };
}

export function generateRaceData(
  macroGroup: RaceMacroGroup = "White_Caucasian",
  ethnicity: GeneratedEthnicityData,
): GeneratedRaceData {
  const syncMode =
    macroGroup === "White_Caucasian" &&
    ethnicity.region !== "Diaspora_Blended"
      ? "Homogeneous Alignment"
      : "Diasporic Shift";

  return {
    macroGroup,
    physicalDescriptors: RACE_DESCRIPTOR_BANKS[macroGroup],
    isCulturallySalient: syncMode === "Diasporic Shift",
    narrativeStyle:
      macroGroup === "White_Caucasian"
        ? "Stylised / Aesthetic Focus"
        : "Phenotypic Palette Focus",
    syncMode,
  };
}

export function generateKinkData(
  trope: string,
  speciesType: SpeciesType | SupernaturalSeedSpecies = "Human",
  authorityDynamic?: OccupationAuthorityDynamic,
): GeneratedKinkData {
  const normalized = normaliseTrope(trope);

  if (normalized.includes("dark romance") && speciesType === "Vampire") {
    return {
      intensityLevel: "Intense_Heavy",
      nsfwEnabled: true,
      preferredSensoryTags: ["Marking", "Restraints", "Possessiveness"],
      primaryRole: "Primal",
      systemPromptInstruction:
        "When intimate scenes are explicitly welcomed, emphasize {{char}}'s supernatural possessiveness through blood-sharing metaphors, careful consent checks, and gentle restraint imagery.",
    };
  }

  if (
    normalized.includes("grumpy") &&
    normalized.includes("sunshine") &&
    authorityDynamic === "Superior"
  ) {
    return {
      intensityLevel: "Moderate_Sensory",
      nsfwEnabled: true,
      preferredSensoryTags: ["Praise", "Control"],
      primaryRole: "Dominant",
      systemPromptInstruction:
        "When scenes turn intimate, contrast {{char}}'s cold professional exterior with attentive, praise-heavy dominance behind closed doors.",
    };
  }

  return {
    intensityLevel: "Mild_Vanilla",
    nsfwEnabled: false,
    preferredSensoryTags: [],
    primaryRole: "Switch",
    systemPromptInstruction:
      "Keep intimacy optional, consent-forward, and emotionally responsive unless adult content is switched on.",
  };
}

export function generateFetishData(
  trope: string,
  speciesType: SpeciesType | SupernaturalSeedSpecies = "Human",
  socioeconomicTier?: OccupationSocioeconomicTier,
): GeneratedFetishData {
  const normalized = normaliseTrope(trope);

  if (
    normalized.includes("workplace") &&
    socioeconomicTier === "Ultra_Elite"
  ) {
    return {
      aiDescriptiveFocus:
        "Emphasize the contrast of sharp, buttoned-up business attire being emotionally unraveled, focusing on corporate risk and stolen glances in office spaces.",
      anatomicalFocus: "Hair_Face",
      fetishEnabled: true,
      materialPreference: "Uniforms_Suits",
      situationalTrigger: "Exhibitionism_Risk",
      sizeFantasyModifier: "Standard_Scale",
    };
  }

  if (speciesType === "Vampire" || normalized.includes("dark romance")) {
    return {
      aiDescriptiveFocus:
        "Prioritize non-graphic tactile descriptions of supernatural bite tension, scent fixation, and the intimidating contrast of a taller presence near {{user}}.",
      anatomicalFocus: "Muscular_Texture",
      fetishEnabled: true,
      materialPreference: "Leather_Latex",
      situationalTrigger: "Sanguine_Biting",
      sizeFantasyModifier: "Extreme_Height_Gap",
    };
  }

  return {
    aiDescriptiveFocus:
      "No fetish focus is active. Keep sensory descriptions broad and character-driven.",
    anatomicalFocus: "None",
    fetishEnabled: false,
    materialPreference: "None",
    situationalTrigger: "None",
    sizeFantasyModifier: "Standard_Scale",
  };
}

export function generateIntimacyStyleData(
  trope: string,
  nameAura?: string,
): GeneratedIntimacyStyleData {
  const normalized = normaliseTrope(trope);

  if (
    normalized.includes("hurt comfort") ||
    normalized.includes("forced proximity")
  ) {
    return {
      aftercareStyle: "The_Nurturer",
      aiBehaviorPrompt:
        "Prioritize total safety, soft touches, and extensive verbal praise. {{char}} uses aftercare as an opportunity to nurse {{user}} back to health emotionally.",
      expressionType: "Vulnerable_Yielding",
      physicalLoveLanguage: "Touch_Holding",
      verbalCadence: "Praise_Validation",
    };
  }

  if (
    normalized.includes("enemies") &&
    normalized.includes("lovers") &&
    nameAura === "Gritty / Edgy"
  ) {
    return {
      aftercareStyle: "The_Processor",
      aiBehaviorPrompt:
        "Keep dialogue sparse and breathy. {{char}} fights the emotional drop, using heavy physical presence and protective handling rather than words to show affection.",
      expressionType: "Stoic_Restrained",
      physicalLoveLanguage: "Protective_Proximity",
      verbalCadence: "Silent_Connection",
    };
  }

  return {
    aftercareStyle: "The_Nurturer",
    aiBehaviorPrompt:
      "During private moments, keep {{char}} emotionally attentive, consent-aware, and responsive to {{user}}'s comfort cues.",
    expressionType: "Intense_Devoted",
    physicalLoveLanguage: "Touch_Holding",
    verbalCadence: "Praise_Validation",
  };
}

export function generateTurnOffData(
  trope: string,
  kink: GeneratedKinkData,
  intimacyStyle: GeneratedIntimacyStyleData,
  nameAura?: string,
): GeneratedTurnOffData {
  const normalized = normaliseTrope(trope);

  if (
    kink.primaryRole === "Dominant" &&
    intimacyStyle.verbalCadence === "Praise_Validation"
  ) {
    return {
      aiReactionPrompt:
        "While {{char}} loves giving praise, he has zero tolerance for entitlement. If {{user}} demands attention or tries to command him, {{char}} immediately withholds affection and looks down at them coldly.",
      behavioralTurnOffs: ["Entitlement", "Bratty defiance without playfulness"],
      dynamicHardlines: "No_Role_Reversal",
      sensoryTurnOffs: ["Overly aggressive touch"],
    };
  }

  if (normalized.includes("slow burn") && nameAura === "Gritty / Edgy") {
    return {
      aiReactionPrompt:
        "If {{user}} pushes for physical intimacy too quickly, {{char}}'s protective walls go back up. He should push {{user}}'s hands away, scoff, and tell them to slow down.",
      behavioralTurnOffs: ["Desperation", "Over-eagerness"],
      dynamicHardlines: "No_Rushed_Pacing",
      sensoryTurnOffs: ["Rushed or clumsy touch"],
    };
  }

  return {
    aiReactionPrompt:
      "If {{user}} becomes cruel, careless, or pushes past clear emotional pacing, {{char}} should pause the scene and re-establish boundaries.",
    behavioralTurnOffs: ["Cruelty", "Disinterest / Emotional Coldness"],
    dynamicHardlines: "No_Unprompted_Aggression",
    sensoryTurnOffs: ["Lack of hygiene", "Overly aggressive touch"],
  };
}

export function generateNationalityData(
  passportCountry: string | undefined,
  regionalAlliance: NationalityRegionalAlliance | undefined,
  legalStatus: NationalityLegalStatus | undefined,
  linguisticVibe: string | undefined,
  ethnicity: GeneratedEthnicityData,
): GeneratedNationalityData {
  const country = passportCountry ?? defaultPassportCountry(ethnicity.region);
  const alliance = regionalAlliance ?? regionalAllianceForPassport(country);
  const status =
    legalStatus ??
    (ethnicity.hasDiasporicBaggage ? "Naturalized" : "Native");

  return {
    passportCountry: country,
    regionalAlliance: alliance,
    legalStatus: status,
    linguisticVibe:
      linguisticVibe ??
      linguisticVibeForNationality(country, status, ethnicity.nativeLanguage),
  };
}

interface GenerateOccupationOptions {
  academicYear?: StudentAcademicYear;
  authorityDynamic?: OccupationAuthorityDynamic;
  campusAffiliation?: string;
  fundingType?: StudentFundingType;
  jobTitle?: string;
  majorField?: StudentMajorField;
  professionalDomain?: OccupationProfessionalDomain;
  socioeconomicTier?: OccupationSocioeconomicTier;
  trope?: string;
  workplaceVibe?: string;
}

export function generateOccupationData({
  academicYear,
  authorityDynamic,
  campusAffiliation,
  fundingType,
  jobTitle,
  majorField,
  professionalDomain,
  socioeconomicTier,
  trope = "",
  workplaceVibe,
}: GenerateOccupationOptions = {}): GeneratedOccupationData {
  if (jobTitle === "University Student" || isAcademicRivalsTrope(trope)) {
    const isAcademicRivals = isAcademicRivalsTrope(trope);

    return {
      academicYear: academicYear ?? (isAcademicRivals ? "Senior" : "Junior"),
      authorityDynamic: authorityDynamic ?? "Equal",
      campusAffiliation:
        campusAffiliation ??
        (isAcademicRivals ? "Debate Society" : "Independent study cohort"),
      fundingType: fundingType ?? "Scholarship",
      jobTitle: "University Student",
      kind: "student",
      majorField: majorField ?? (isAcademicRivals ? "Humanities_Law" : "STEM_Medical"),
      workplaceVibe:
        workplaceVibe ??
        (isAcademicRivals
          ? "Dimly lit university library archive room, stacked with old leather books"
          : "Quiet campus lab and late-night dorm study desk"),
    };
  }

  const domain = professionalDomain ?? inferProfessionalDomain(trope);
  const tier = socioeconomicTier ?? inferSocioeconomicTier(trope, domain);

  return {
    authorityDynamic: authorityDynamic ?? inferAuthorityDynamic(trope, tier),
    jobTitle: jobTitle ?? defaultJobTitleForDomain(domain, tier),
    kind: "professional",
    professionalDomain: domain,
    socioeconomicTier: tier,
    workplaceVibe: workplaceVibe ?? defaultWorkplaceVibe(domain, tier),
  };
}

export function generateRelationshipsData(
  trope: string,
): GeneratedNPCRelationshipData[] {
  const normalized = normaliseTrope(trope);

  if (normalized.includes("arranged marriage")) {
    return [
      {
        connectionType: "Family_Lineage",
        emotionalStatus: "Strained_Fractured",
        npcName: "Lord Arthur Thorne",
        oneLineDescription:
          "The cold, traditional patriarch who orchestrated the marriage alliance and will disown {{char}} if the contract is broken.",
        romanceFunction: "The_Barrier",
      },
    ];
  }

  if (normalized.includes("fake dating")) {
    return [
      {
        connectionType: "Antagonistic_Force",
        emotionalStatus: "Estranged_Ghosted",
        npcName: "Roxie",
        oneLineDescription:
          "The manipulative ex-girlfriend who is attending the upcoming wedding with a new partner, prompting {{char}} to hire a fake date.",
        romanceFunction: "The_Jealousy_Instigator",
      },
    ];
  }

  return [
    {
      connectionType: "Found_Family",
      emotionalStatus: "Devoted_Loyal",
      npcName: "Mara Finch",
      oneLineDescription:
        "The loyal confidant who notices every shift in {{char}}'s mood and nudges them toward honesty before pride ruins the romance.",
      romanceFunction: "The_Matchmaker",
    },
  ];
}

export function generateRelationshipStatusData(
  trope: string,
  professionalDomain?: OccupationProfessionalDomain,
): GeneratedRelationshipStatusData {
  const normalized = normaliseTrope(trope);

  if (normalized.includes("second chance")) {
    return {
      currentLabel: "Divorced_Separated",
      emotionalAvailability: "Lingering_Past",
      scandalFactor: "Low_Gossip",
      statusContext:
        "Divorced for five years. Fully focused on work, but has never truly moved on from {{user}}.",
    };
  }

  if (
    normalized.includes("arranged marriage") &&
    professionalDomain === "Underworld"
  ) {
    return {
      currentLabel: "Betrothed_Promised",
      emotionalAvailability: "Guarded_Closed",
      scandalFactor: "High_Taboo",
      statusContext:
        "Promised to {{user}} to seal the alliance between their syndicates. He views this purely as a transaction.",
    };
  }

  if (normalized.includes("fake dating")) {
    return {
      currentLabel: "It_Complicated",
      emotionalAvailability: "Casual_Only",
      scandalFactor: "Low_Gossip",
      statusContext:
        "Single on paper, but using fake-dating optics to avoid admitting what they actually want from {{user}}.",
    };
  }

  return {
    currentLabel: "Single",
    emotionalAvailability: "Fully_Open",
    scandalFactor: "None",
    statusContext:
      "Unattached and socially free to pursue a genuine connection if trust develops.",
  };
}

export function generateSpeciesData(
  speciesType: SpeciesType,
  random: () => number = Math.random,
): GeneratedSpeciesData {
  if (isSupernaturalSeedSpecies(speciesType)) {
    const seed = pickSupernaturalSeed(speciesType, random);

    return {
      apparentAge: seed.apparent_age,
      dietaryNeed: speciesDietaryNeed(seed.species),
      heritage: seed.heritage,
      instinctualTrait: seed.instinct_trait,
      isImmortal: true,
      nameAura: seed.aura_tag,
      nameEra: "Medieval & Ancient",
      seed,
      type: seed.species,
    };
  }

  if (speciesType === "Vampire") {
    return {
      apparentAge: randomInt(21, 29, random),
      dietaryNeed: "Blood",
      instinctualTrait: "The Hunger / Feed Dynamics",
      isImmortal: true,
      nameAura: "Ethereal / Gothic",
      nameEra: "Medieval & Ancient",
      type: "Vampire",
    };
  }

  if (speciesType === "Werewolf") {
    return {
      dietaryNeed: "Standard food",
      instinctualTrait: "Fated Mates / Pack Alpha",
      isImmortal: false,
      nameAura: "Gritty / Edgy",
      type: "Werewolf",
    };
  }

  return {
    dietaryNeed: "Standard food",
    instinctualTrait: "Mortal / Baseline",
    isImmortal: false,
    type: "Human",
  };
}

function generateAgeProfile(
  speciesType: SpeciesType | SupernaturalSeedSpecies,
  anchorYear: number,
  random: () => number,
  powerDynamic: string,
) {
  if (
    speciesType === "Angel" ||
    speciesType === "Demon" ||
    speciesType === "Fae" ||
    speciesType === "Siren" ||
    speciesType === "Vampire" ||
    speciesType === "Wraith"
  ) {
    const historicalAnchorYear = randomInt(1400, 1800, random);

    return {
      age: 2026 - historicalAnchorYear,
      apparentAge: randomInt(21, 29, random),
      birthYear: historicalAnchorYear,
    };
  }

  if (speciesType === "Werewolf") {
    const age = randomInt(21, 35, random);

    return {
      age,
      birthYear: anchorYear - age,
    };
  }

  if (isAgeGapJunior(powerDynamic)) {
    const age = randomInt(18, 24, random);

    return {
      age,
      birthYear: anchorYear - age,
    };
  }

  if (!isAgeGapSenior(powerDynamic)) {
    const age = randomInt(25, 39, random);

    return {
      age,
      birthYear: anchorYear - age,
    };
  }

  const juniorAge = randomInt(19, 24, random);
  const seniorAge = juniorAge + randomInt(12, 25, random);

  return {
    age: seniorAge,
    birthYear: anchorYear - seniorAge,
  };
}

function generateAcademicStudentAgeProfile(
  anchorYear: number,
  random: () => number,
) {
  const age = randomInt(21, 22, random);

  return {
    age,
    apparentAge: undefined,
    birthYear: anchorYear - age,
  };
}

export function generateBirthDate(
  birthYear: number,
  random: () => number = Math.random,
) {
  const birth_month = randomInt(1, 12, random);
  const birth_day = randomInt(1, daysInMonth(birthYear, birth_month), random);

  return {
    birth_month,
    birth_day,
    zodiac: calculateZodiac(birth_month, birth_day),
  };
}

export function calculateZodiac(month: number, day: number): ZodiacSign {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Aries";
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Taurus";
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "Gemini";
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Cancer";
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Leo";
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Virgo";
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Libra";
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Scorpio";
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Sagittarius";
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "Capricorn";
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Aquarius";
  }
  return "Pisces";
}

export function daysInMonth(year: number, month: number) {
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }

  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }

  return 31;
}

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function randomInt(min: number, max: number, random: () => number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pickSeedValue<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function asZodiacSign(value: string): ZodiacSign | undefined {
  return pickSeedValue(value, ZODIAC_SIGNS, undefined as never);
}

function asFrameworkTargetSpecification(value: string) {
  return pickSeedValue(value, FRAMEWORK_TARGETS, "V2_Card_Standard");
}

function asSpeciesType(value: string): SpeciesType {
  return pickSeedValue(value, SPECIES_TYPES, "Human");
}

function asRaceMacroGroup(value: string): RaceMacroGroup {
  return pickSeedValue(value, RACE_MACRO_GROUPS, "White_Caucasian");
}

function asNationalityLegalStatus(value: string): NationalityLegalStatus {
  return pickSeedValue(value, NATIONALITY_LEGAL_STATUSES, "Native");
}

function asOccupationAuthorityDynamic(
  value: string,
): OccupationAuthorityDynamic {
  return pickSeedValue(value, OCCUPATION_AUTHORITY_DYNAMICS, "Equal");
}

function asOccupationProfessionalDomain(
  value: string,
): OccupationProfessionalDomain {
  return pickSeedValue(value, OCCUPATION_PROFESSIONAL_DOMAINS, "Corporate_Finance");
}

function asOccupationSocioeconomicTier(
  value: string,
): OccupationSocioeconomicTier {
  return pickSeedValue(value, OCCUPATION_SOCIOECONOMIC_TIERS, "High_Professional");
}

function asStudentAcademicYear(value: string | undefined): StudentAcademicYear {
  return pickSeedValue(value, STUDENT_ACADEMIC_YEARS, "Junior");
}

function asStudentFundingType(value: string | undefined): StudentFundingType {
  return pickSeedValue(value, STUDENT_FUNDING_TYPES, "Scholarship");
}

function asStudentMajorField(value: string): StudentMajorField {
  return pickSeedValue(value, STUDENT_MAJOR_FIELDS, "Humanities_Law");
}

function asArchetypePersonaType(value: string): ArchetypePersonaType {
  return pickSeedValue(value, ARCHETYPE_PERSONA_TYPES, "The_Stoic_Wall");
}

function asKinkPrimaryRole(value: string): KinkPrimaryRole {
  return pickSeedValue(value, KINK_PRIMARY_ROLES, "Switch");
}

function asKinkIntensityLevel(value: string): KinkIntensityLevel {
  return pickSeedValue(value, KINK_INTENSITY_LEVELS, "Mild_Vanilla");
}

function asFetishAnatomicalFocus(value: string): FetishAnatomicalFocus {
  return pickSeedValue(value, FETISH_ANATOMICAL_FOCUSES, "None");
}

function asFetishMaterialPreference(value: string): FetishMaterialPreference {
  return pickSeedValue(value, FETISH_MATERIAL_PREFERENCES, "None");
}

function asFetishSituationalTrigger(value: string): FetishSituationalTrigger {
  return pickSeedValue(value, FETISH_SITUATIONAL_TRIGGERS, "None");
}

function asIntimacyAftercareStyle(value: string): IntimacyAftercareStyle {
  return pickSeedValue(value, INTIMACY_AFTERCARE_STYLES, "The_Nurturer");
}

function asIntimacyPhysicalLoveLanguage(
  value: string,
): IntimacyPhysicalLoveLanguage {
  return pickSeedValue(value, INTIMACY_PHYSICAL_LOVE_LANGUAGES, "Touch_Holding");
}

function asIntimacyVerbalCadence(value: string): IntimacyVerbalCadence {
  return pickSeedValue(value, INTIMACY_VERBAL_CADENCES, "Praise_Validation");
}

function asNPCConnectionType(value: string): NPCConnectionType {
  return pickSeedValue(value, NPC_CONNECTION_TYPES, "Found_Family");
}

function asNPCRomanceFunction(value: string): NPCRomanceFunction {
  return pickSeedValue(value, NPC_ROMANCE_FUNCTIONS, "The_Matchmaker");
}

function asNPCEmotionalStatus(value: string): NPCEmotionalStatus {
  return pickSeedValue(value, NPC_EMOTIONAL_STATUSES, "Devoted_Loyal");
}

function asRelationshipCurrentLabel(value: string): RelationshipCurrentLabel {
  return pickSeedValue(value, RELATIONSHIP_CURRENT_LABELS, "Single");
}

function asRelationshipEmotionalAvailability(
  value: string,
): RelationshipEmotionalAvailability {
  return pickSeedValue(value, RELATIONSHIP_EMOTIONAL_AVAILABILITY, "Fully_Open");
}

function asRelationshipScandalFactor(
  value: string,
): RelationshipScandalFactor {
  return pickSeedValue(value, RELATIONSHIP_SCANDAL_FACTORS, "None");
}

function asFormattingActionWrappingStandard(
  value: string,
): FormattingActionWrappingStandard {
  return pickSeedValue(value, FORMATTING_ACTION_WRAPPING, "Quote_Isolated_Prose");
}

function asFormattingNarrativePerspective(
  value: string,
): FormattingNarrativePerspective {
  return pickSeedValue(value, FORMATTING_PERSPECTIVES, "Third_Person_Past");
}

function asToneProseTexture(value: string): ToneProseTexture {
  return pickSeedValue(value, TONE_PROSE_TEXTURES, "Gritty_Melodramatic");
}

function asTonePacingVelocity(value: string): TonePacingVelocity {
  return pickSeedValue(value, TONE_PACING_VELOCITIES, "Measured_Deliberate");
}

function asToneWorldviewFilter(value: string): ToneWorldviewFilter {
  return pickSeedValue(value, TONE_WORLDVIEW_FILTERS, "Jaded_Weary");
}

function linguisticMatrixFromSeedEthnicity(value: string): LinguisticMatrix {
  const normalized = value.toLowerCase();

  if (normalized.includes("slavic")) {
    return "Slavic / Cyrillic-Derived";
  }

  if (normalized.includes("romance") || normalized.includes("french")) {
    return "Latinate / Romance";
  }

  if (normalized.includes("gaelic") || normalized.includes("celtic")) {
    return "Celtic / Gaelic";
  }

  return "Anglophone";
}

function ethnicityRegionFromSeedEthnicity(
  value: string,
  linguisticMatrix: LinguisticMatrix,
): EthnicityRegion {
  return (
    pickSeedValue(value, ETHNICITY_REGIONS, undefined as never) ??
    inferEthnicityRegion(value, linguisticMatrix) ??
    "Northern_Western_European"
  );
}

function parseSeedBirthday(birthday: string) {
  const [monthName = "January", dayValue = "1"] = birthday.trim().split(/\s+/);
  const monthIndex = MONTH_NAMES.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase(),
  );
  const birthMonth = monthIndex >= 0 ? monthIndex + 1 : 1;
  const birthDay = Math.max(1, Math.min(Number.parseInt(dayValue, 10) || 1, 31));

  return {
    birth_day: birthDay,
    birth_month: birthMonth,
    zodiac: calculateZodiac(birthMonth, birthDay),
  };
}

function speciesDataFromSeed(seed: CharacterCardSeed): GeneratedSpeciesData {
  const type = asSpeciesType(seed.identity.species);
  const isImmortal = !["Human", "Werewolf"].includes(type);

  return {
    apparentAge: seed.identity.apparent_age,
    dietaryNeed:
      type === "Vampire"
        ? "Blood"
        : type === "Demon"
          ? "Soul energy"
          : "Standard food",
    heritage: seed.identity.ethnicity,
    instinctualTrait:
      type === "Vampire"
        ? "The Hunger / Feed Dynamics"
        : type === "Fae"
          ? "Glamour / Seduction Aura"
          : type === "Human"
            ? "Mortal / Baseline"
            : "Fated Mates / Soul Bonds",
    isImmortal,
    nameAura:
      type === "Human"
        ? undefined
        : type === "Vampire"
          ? "Ethereal / Gothic"
          : "Elite / Noble",
    nameEra: isImmortal ? "Medieval & Ancient" : undefined,
    type,
  };
}

function ethnicityDataFromSeed(seed: CharacterCardSeed): GeneratedEthnicityData {
  const linguisticMatrix = linguisticMatrixFromSeedEthnicity(
    seed.identity.ethnicity,
  );
  const region = ethnicityRegionFromSeedEthnicity(
    seed.identity.ethnicity,
    linguisticMatrix,
  );

  return {
    culturalHeritage: seed.identity.ethnicity,
    hasDiasporicBaggage: seed.identity.citizenship_status !== "Native",
    linguisticMatrix,
    nativeLanguage: nativeLanguageForMatrix(linguisticMatrix),
    region,
    societalContext:
      seed.identity.citizenship_status === "Expat_Visa"
        ? "First-Generation Immigrant"
        : region === "Diaspora_Blended"
          ? "Multigenerational Diaspora"
          : "Indigenous / Native Home Ground",
  };
}

function nationalityDataFromSeed(
  seed: CharacterCardSeed,
  ethnicity: GeneratedEthnicityData,
): GeneratedNationalityData {
  const legalStatus = asNationalityLegalStatus(seed.identity.citizenship_status);

  return {
    legalStatus,
    linguisticVibe: linguisticVibeForNationality(
      seed.identity.nationality,
      legalStatus,
      ethnicity.nativeLanguage,
    ),
    passportCountry: seed.identity.nationality,
    regionalAlliance: regionalAllianceForPassport(seed.identity.nationality),
  };
}

function occupationDataFromSeed(seed: CharacterCardSeed): GeneratedOccupationData {
  const authorityDynamic = asOccupationAuthorityDynamic(
    seed.professional_matrix.authority_dynamic_vs_user,
  );

  if (seed.professional_matrix.job_title === "University Student") {
    return {
      academicYear: asStudentAcademicYear(seed.professional_matrix.academic_year),
      authorityDynamic,
      campusAffiliation:
        seed.professional_matrix.industry_domain === "Humanities_Law"
          ? "Debate Society"
          : "Independent study cohort",
      fundingType: asStudentFundingType(seed.professional_matrix.funding_type),
      jobTitle: "University Student",
      kind: "student",
      majorField: asStudentMajorField(seed.professional_matrix.industry_domain),
      workplaceVibe:
        "Dimly lit university library archive room, stacked with old leather books",
    };
  }

  const professionalDomain = asOccupationProfessionalDomain(
    seed.professional_matrix.industry_domain,
  );
  const socioeconomicTier = asOccupationSocioeconomicTier(
    seed.professional_matrix.socioeconomic_tier,
  );

  return {
    authorityDynamic,
    jobTitle: seed.professional_matrix.job_title,
    kind: "professional",
    professionalDomain,
    socioeconomicTier,
    workplaceVibe: defaultWorkplaceVibe(professionalDomain, socioeconomicTier),
  };
}

function archetypeConfigurationFromSeed(
  seed: CharacterCardSeed,
): GeneratedArchetypeConfigurationData {
  const personaType = asArchetypePersonaType(seed.archetype_tag);
  const defenseMechanism = defenseMechanismForArchetype(personaType);
  const coreMotivation = coreMotivationForArchetype(
    personaType,
    seed.trope_framework.toLowerCase().includes("dark"),
  );

  return {
    aiBehaviorPrompt: buildArchetypeBehaviorPrompt(
      personaType,
      defenseMechanism,
      coreMotivation,
    ),
    archetypeId: createStableArchetypeConfigurationId(
      personaType,
      defenseMechanism,
      coreMotivation,
    ),
    coreMotivation,
    defenseMechanism,
    personaType,
  };
}

function kinkDataFromSeed(seed: CharacterCardSeed): GeneratedKinkData {
  return {
    intensityLevel: asKinkIntensityLevel(seed.adult_configuration.intensity_bracket),
    nsfwEnabled: seed.adult_configuration.nsfw_enabled,
    preferredSensoryTags: seed.adult_configuration.sensory_tags,
    primaryRole: asKinkPrimaryRole(seed.adult_configuration.kink_power_role),
    systemPromptInstruction:
      seed.adult_configuration.nsfw_enabled
        ? `When adult content is enabled by the user, keep {{char}} in a ${seed.adult_configuration.kink_power_role} role with ${seed.adult_configuration.sensory_tags.join(", ")} sensory emphasis while preserving consent and boundaries.`
        : "Keep intimacy optional, consent-forward, and emotionally responsive unless adult content is switched on.",
  };
}

function fetishDataFromSeed(seed: CharacterCardSeed): GeneratedFetishData {
  const situationalTrigger = asFetishSituationalTrigger(
    seed.adult_configuration.situational_trigger,
  );

  return {
    aiDescriptiveFocus:
      situationalTrigger === "Sanguine_Biting"
        ? "Prioritize non-graphic tactile descriptions of supernatural bite tension, scent fixation, and controlled proximity."
        : "Use the seeded sensory, material, and anatomical focus only as optional descriptive texture; never override consent, pacing, or character boundaries.",
    anatomicalFocus: asFetishAnatomicalFocus(
      seed.adult_configuration.anatomical_focus,
    ),
    fetishEnabled: seed.adult_configuration.nsfw_enabled,
    materialPreference: asFetishMaterialPreference(
      seed.adult_configuration.material_preference,
    ),
    situationalTrigger,
    sizeFantasyModifier:
      seed.identity.species === "Vampire"
        ? "Extreme_Height_Gap"
        : "Standard_Scale",
  };
}

function intimacyStyleDataFromSeed(
  seed: CharacterCardSeed,
  archetype: GeneratedArchetypeConfigurationData,
): GeneratedIntimacyStyleData {
  return {
    aftercareStyle: asIntimacyAftercareStyle(
      seed.adult_configuration.aftercare_style,
    ),
    aiBehaviorPrompt:
      archetype.personaType === "The_Golden_Retriever"
        ? "Private closeness stays warm, praise-heavy, and reassurance-led; {{char}} turns care into constant proximity and gentle validation."
        : "Private closeness follows the seeded power, aftercare, and cadence profile while keeping {{char}}'s emotional armor intact until trust is earned.",
    expressionType:
      archetype.personaType === "The_Golden_Retriever"
        ? "Playful_Teasing"
        : archetype.personaType === "The_Ancient_Predator"
          ? "Stoic_Restrained"
          : "Intense_Devoted",
    physicalLoveLanguage: asIntimacyPhysicalLoveLanguage(
      seed.adult_configuration.intimacy_love_language,
    ),
    verbalCadence: asIntimacyVerbalCadence(
      seed.adult_configuration.verbal_cadence,
    ),
  };
}

function turnOffDataFromSeed(seed: CharacterCardSeed): GeneratedTurnOffData {
  return {
    aiReactionPrompt: seed.system_guardrails.proximity_violation_reaction,
    behavioralTurnOffs: seed.system_guardrails.behavioral_turn_offs,
    dynamicHardlines:
      seed.system_guardrails.physical_proximity_limit === "Highly_Averse"
        ? "No_Rushed_Pacing"
        : "No_Unprompted_Aggression",
    sensoryTurnOffs: seed.system_guardrails.emotional_trauma_triggers,
  };
}

function relationshipsDataFromSeed(
  seed: CharacterCardSeed,
): GeneratedNPCRelationshipData[] {
  return seed.relational_network.npc_cast.slice(0, 3).map((npc) => ({
    connectionType: asNPCConnectionType(npc.connection),
    emotionalStatus: asNPCEmotionalStatus(npc.emotional_status),
    npcName: npc.name,
    oneLineDescription: npc.desc_line,
    romanceFunction: asNPCRomanceFunction(npc.romance_function),
  }));
}

function relationshipStatusDataFromSeed(
  seed: CharacterCardSeed,
): GeneratedRelationshipStatusData {
  return {
    currentLabel: asRelationshipCurrentLabel(
      seed.relational_network.relationship_status,
    ),
    emotionalAvailability: asRelationshipEmotionalAvailability(
      seed.relational_network.emotional_availability,
    ),
    scandalFactor: asRelationshipScandalFactor(
      seed.relational_network.scandal_risk_factor,
    ),
    statusContext: seed.relational_network.status_narrative_context,
  };
}

function formattingConfigurationFromSeed(
  seed: CharacterCardSeed,
): GeneratedFormattingConfigurationData {
  const actionWrappingStandard = asFormattingActionWrappingStandard(
    seed.narrative_styling.action_wrapping_standard,
  );
  const markdownEmphasisStyle: FormattingMarkdownEmphasisStyle = "Clean_Prose";
  const narrativePerspective = asFormattingNarrativePerspective(
    seed.narrative_styling.narrative_perspective,
  );
  const maxParagraphsPerTurn = seed.narrative_styling.max_paragraphs_per_turn;

  return {
    actionWrappingStandard,
    formattingId: createStableFormattingConfigurationId(
      actionWrappingStandard,
      markdownEmphasisStyle,
      narrativePerspective,
    ),
    formattingSystemPromptInjection: buildFormattingSystemPromptInjection(
      actionWrappingStandard,
      markdownEmphasisStyle,
      narrativePerspective,
      maxParagraphsPerTurn,
    ),
    markdownEmphasisStyle,
    maxParagraphsPerTurn,
    narrativePerspective,
  };
}

function toneConfigurationFromSeed(
  seed: CharacterCardSeed,
): GeneratedToneConfigurationData {
  const proseTexture = asToneProseTexture(seed.narrative_styling.prose_texture);
  const pacingVelocity = asTonePacingVelocity(
    seed.narrative_styling.pacing_velocity,
  );
  const worldviewFilter = asToneWorldviewFilter(
    seed.narrative_styling.worldview_filter,
  );
  const aiVocabularyDirectives = toneVocabularyDirectives(
    proseTexture,
    worldviewFilter,
  );

  return {
    aiVocabularyDirectives,
    pacingVelocity,
    proseTexture,
    toneId: createStableToneConfigurationId(
      proseTexture,
      pacingVelocity,
      worldviewFilter,
    ),
    toneSystemPromptInjection: buildToneSystemPromptInjection(
      proseTexture,
      pacingVelocity,
      worldviewFilter,
      aiVocabularyDirectives,
    ),
    worldviewFilter,
  };
}

function pickSupernaturalSeed(
  speciesType: SupernaturalSeedSpecies,
  random: () => number,
) {
  const matchingSeeds = supernaturalSeeds.filter(
    (seed) => seed.species === speciesType,
  );
  const index = Math.min(
    matchingSeeds.length - 1,
    Math.floor(random() * matchingSeeds.length),
  );

  return matchingSeeds[index];
}

function pickSurname(linguisticMatrix: LinguisticMatrix, random: () => number) {
  const surnames = SURNAME_BANKS[linguisticMatrix];
  const index = Math.min(surnames.length - 1, Math.floor(random() * surnames.length));

  return surnames[index];
}

function inferLinguisticMatrix(
  heritage: string | undefined,
): LinguisticMatrix | undefined {
  if (!heritage) {
    return undefined;
  }

  const normalized = heritage.toLowerCase();

  if (
    normalized.includes("celtic") ||
    normalized.includes("gaelic") ||
    normalized.includes("irish") ||
    normalized.includes("scottish") ||
    normalized.includes("welsh")
  ) {
    return "Celtic / Gaelic";
  }

  if (
    normalized.includes("french") ||
    normalized.includes("italian") ||
    normalized.includes("romance") ||
    normalized.includes("spanish") ||
    normalized.includes("portuguese")
  ) {
    return "Latinate / Romance";
  }

  if (
    normalized.includes("slavic") ||
    normalized.includes("polish") ||
    normalized.includes("russian") ||
    normalized.includes("ukrainian")
  ) {
    return "Slavic / Cyrillic-Derived";
  }

  return "Anglophone";
}

function inferEthnicityRegion(
  heritage: string | undefined,
  linguisticMatrix: LinguisticMatrix,
): EthnicityRegion | undefined {
  if (!heritage) {
    return undefined;
  }

  const normalized = heritage.toLowerCase();

  if (
    normalized.includes("american") ||
    normalized.includes("australian") ||
    normalized.includes("canadian") ||
    normalized.includes("diaspora")
  ) {
    return "Diaspora_Blended";
  }

  if (linguisticMatrix === "Latinate / Romance") {
    return "Southern_European";
  }

  if (linguisticMatrix === "Slavic / Cyrillic-Derived") {
    return "Eastern_European_Slavic";
  }

  return "Northern_Western_European";
}

function defaultCulturalHeritage(
  region: EthnicityRegion,
  linguisticMatrix: LinguisticMatrix,
) {
  if (region === "Diaspora_Blended") {
    return "Pan-European Diaspora";
  }

  if (linguisticMatrix === "Celtic / Gaelic") {
    return "Scottish Highlands";
  }

  if (linguisticMatrix === "Latinate / Romance") {
    return "Italian / French Romance-language lineage";
  }

  if (linguisticMatrix === "Slavic / Cyrillic-Derived") {
    return "Eastern European Slavic lineage";
  }

  return "British Isles / Scandinavian lineage";
}

function nativeLanguageForMatrix(linguisticMatrix: LinguisticMatrix) {
  if (linguisticMatrix === "Celtic / Gaelic") {
    return "English with Gaelic endearment markers";
  }

  if (linguisticMatrix === "Latinate / Romance") {
    return "Romance-language endearment markers";
  }

  if (linguisticMatrix === "Slavic / Cyrillic-Derived") {
    return "Slavic endearment markers";
  }

  return "English";
}

function defaultPassportCountry(region: EthnicityRegion) {
  if (region === "Southern_European") {
    return "Italy";
  }

  if (region === "Eastern_European_Slavic") {
    return "Poland";
  }

  if (region === "Diaspora_Blended") {
    return "United States";
  }

  return "United Kingdom";
}

function regionalAllianceForPassport(
  passportCountry: string,
): NationalityRegionalAlliance {
  const normalized = passportCountry.toLowerCase();

  if (
    ["france", "germany", "italy", "poland", "spain", "sweden"].includes(
      normalized,
    )
  ) {
    return "EU_Schengen";
  }

  if (["norway", "russia", "switzerland", "united kingdom"].includes(normalized)) {
    return "Non_EU_European";
  }

  if (
    ["australia", "canada", "united states"].includes(normalized)
  ) {
    return "Western_Allies";
  }

  return "Fictional_Empire";
}

function linguisticVibeForNationality(
  passportCountry: string,
  legalStatus: NationalityLegalStatus,
  nativeLanguage: string,
) {
  if (legalStatus === "Expat_Visa") {
    return `Expat-softened English shaped by ${nativeLanguage} and long-term residence abroad.`;
  }

  if (legalStatus === "Naturalized") {
    return `Fluent civic English with subtle ${nativeLanguage} phrasing and integrated local slang.`;
  }

  if (legalStatus === "Dual_Citizen") {
    return `Code-switches between ${passportCountry} civic identity and ${nativeLanguage} family idioms.`;
  }

  return `Native dialect from ${passportCountry} with local slang and natural civic confidence.`;
}

function inferProfessionalDomain(trope: string): OccupationProfessionalDomain {
  const normalized = normaliseTrope(trope);

  if (
    normalized.includes("mafia") ||
    normalized.includes("dark romance") ||
    normalized.includes("underworld")
  ) {
    return "Underworld";
  }

  if (
    normalized.includes("bodyguard") ||
    normalized.includes("detective") ||
    normalized.includes("protection")
  ) {
    return "Security_Defense";
  }

  if (
    normalized.includes("doctor") ||
    normalized.includes("surgeon") ||
    normalized.includes("medical")
  ) {
    return "Medical_Science";
  }

  if (
    normalized.includes("artist") ||
    normalized.includes("actor") ||
    normalized.includes("rockstar") ||
    normalized.includes("sports")
  ) {
    return "Arts_Entertainment";
  }

  return "Corporate_Finance";
}

function inferSocioeconomicTier(
  trope: string,
  domain: OccupationProfessionalDomain,
): OccupationSocioeconomicTier {
  const normalized = normaliseTrope(trope);

  if (
    normalized.includes("billionaire") ||
    normalized.includes("ceo") ||
    normalized.includes("arranged marriage")
  ) {
    return "Ultra_Elite";
  }

  if (domain === "Underworld") {
    return "Shadow_Economy";
  }

  if (domain === "Arts_Entertainment") {
    return "Creative_Public";
  }

  if (
    normalized.includes("small town") ||
    normalized.includes("blue collar") ||
    normalized.includes("working class")
  ) {
    return "Working_Class";
  }

  return "High_Professional";
}

function inferAuthorityDynamic(
  trope: string,
  tier: OccupationSocioeconomicTier,
): OccupationAuthorityDynamic {
  const normalized = normaliseTrope(trope);

  if (
    normalized.includes("boss") ||
    normalized.includes("professor") ||
    normalized.includes("capo") ||
    tier === "Ultra_Elite" ||
    tier === "Shadow_Economy"
  ) {
    return "Superior";
  }

  if (normalized.includes("assistant") || normalized.includes("intern")) {
    return "Subordinate";
  }

  if (normalized.includes("bodyguard") || normalized.includes("client")) {
    return "Outsider";
  }

  return "Equal";
}

function defaultJobTitleForDomain(
  domain: OccupationProfessionalDomain,
  tier: OccupationSocioeconomicTier,
) {
  if (tier === "Ultra_Elite") {
    return "Chief Executive Officer";
  }

  if (tier === "Shadow_Economy") {
    return "Mafia Enforcer";
  }

  if (domain === "Medical_Science") {
    return "Trauma Surgeon";
  }

  if (domain === "Arts_Entertainment") {
    return "Gallery Director";
  }

  if (domain === "Security_Defense") {
    return "Personal Bodyguard";
  }

  if (tier === "Working_Class") {
    return "Mechanic";
  }

  return "Software Engineer";
}

function defaultWorkplaceVibe(
  domain: OccupationProfessionalDomain,
  tier: OccupationSocioeconomicTier,
) {
  if (tier === "Ultra_Elite") {
    return "Brutalist high-rise office with private elevators and glass city views";
  }

  if (tier === "Shadow_Economy") {
    return "Gritty neon-lit underground club with locked back rooms";
  }

  if (domain === "Medical_Science") {
    return "Sterile dimly lit emergency department with monitors humming";
  }

  if (domain === "Arts_Entertainment") {
    return "Converted gallery studio with wet paint, velvet ropes, and camera glare";
  }

  if (domain === "Security_Defense") {
    return "Armored private security office with tactical cases and low lighting";
  }

  if (tier === "Working_Class") {
    return "Small-town workshop with oil-stained concrete and late-afternoon sun";
  }

  return "Quiet glass office lined with monitors, whiteboards, and late-night coffee";
}

function inferFirstMessageEntryPoint(
  normalizedTrope: string,
  scenario: GeneratedScenarioData | undefined,
): FirstMessageEntryPoint {
  if (scenario?.plotHook === "The_Crisis") {
    return "Post_Crisis_Quiet";
  }

  if (
    scenario?.startingTension === "Combative_Friction" ||
    normalizedTrope.includes("enemies") ||
    normalizedTrope.includes("rivals")
  ) {
    return "Mid_Action_Dialogue";
  }

  if (scenario?.plotHook === "The_Chance_Encounter") {
    return "Active_Collision";
  }

  return "The_Approach";
}

function inferFirstMessageLiteraryStyle(
  normalizedTrope: string,
  scenario: GeneratedScenarioData | undefined,
  intimacyStyle: GeneratedIntimacyStyleData | undefined,
): FirstMessageLiteraryStyle {
  if (
    intimacyStyle?.expressionType === "Stoic_Restrained" ||
    normalizedTrope.includes("slow burn")
  ) {
    return "Internal_Monologue_Heavy";
  }

  if (
    scenario?.settingType === "Atmospheric_Wilderness" ||
    normalizedTrope.includes("gothic")
  ) {
    return "Novella_Prose";
  }

  if (
    normalizedTrope.includes("fake dating") ||
    scenario?.startingTension === "Combative_Friction"
  ) {
    return "Chat_Symphonic";
  }

  return "Action_Dialogue_Hybrid";
}

function inferFirstMessageCallToAction(
  normalizedTrope: string,
  scenario: GeneratedScenarioData | undefined,
  intimacyStyle: GeneratedIntimacyStyleData | undefined,
  turnOffs: GeneratedTurnOffData | undefined,
): FirstMessageUserCallToAction {
  if (
    intimacyStyle?.expressionType === "Vulnerable_Yielding" ||
    scenario?.startingTension === "Vulnerable_Exhausted"
  ) {
    return "Vulnerable_Slip";
  }

  if (
    scenario?.startingTension === "Formal_Chilling" ||
    turnOffs?.dynamicHardlines === "No_Rushed_Pacing"
  ) {
    return "Weighted_StandOff";
  }

  if (
    normalizedTrope.includes("forced proximity") ||
    scenario?.settingType === "Contained_Insular"
  ) {
    return "Physical_Gesture";
  }

  return "Direct_Question";
}

function inferFirstMessageTokenCap(
  literaryStyle: FirstMessageLiteraryStyle,
) {
  if (literaryStyle === "Novella_Prose") {
    return 600;
  }

  if (literaryStyle === "Internal_Monologue_Heavy") {
    return 520;
  }

  if (literaryStyle === "Chat_Symphonic") {
    return 360;
  }

  return 450;
}

function buildFirstMessageOutputConstraint(
  entryPoint: FirstMessageEntryPoint,
  literaryStyle: FirstMessageLiteraryStyle,
  userCallToAction: FirstMessageUserCallToAction,
  tokenLengthCap: number,
) {
  return [
    `Open with ${entryPoint.replace(/_/g, " ").toLowerCase()} pacing.`,
    `Render in ${literaryStyle.replace(/_/g, " ").toLowerCase()} format.`,
    `Target ${Math.max(300, tokenLengthCap - 120)}-${tokenLengthCap} tokens.`,
    `End with ${userCallToAction.replace(/_/g, " ").toLowerCase()} that clearly hands action back to {{user}}.`,
    "Write only the character's first message.",
    "You are strictly forbidden from writing or completing actions for {{user}}. Your output must terminate immediately after {{char}}'s closing action or line of dialogue.",
  ].join("\n");
}

function normaliseAlternateGreetings(
  alternateGreetings: GeneratedAlternateGreetingData[] | undefined,
) {
  return alternateGreetings
    ?.filter(
      (greeting) =>
        greeting.associatedTrope.trim() &&
        greeting.aiGenerationDirective.trim(),
    )
    .slice(0, 5)
    .map((greeting) => ({
      ...greeting,
      completedGreeting:
        greeting.completedGreeting.trim() ||
        `{{char}} pauses inside the ${greeting.associatedTrope} fork, waiting for {{user}} to decide what this version of the story becomes.`,
    }));
}

function normaliseGroupGreetings(
  groupGreetings: GeneratedGroupGreetingData[] | undefined,
) {
  return groupGreetings
    ?.filter(
      (greeting) =>
        greeting.aiGroupDirective.trim() &&
        greeting.participatingCharacters.length >= 2,
    )
    .slice(0, 5)
    .map((greeting) => ({
      ...greeting,
      completedGreeting:
        greeting.completedGreeting.trim() ||
        `{{char}} and ${greeting.participatingCharacters
          .filter((name) => name !== "{{char}}")
          .slice(0, 3)
          .join(", ")} hold the room together as {{user}} enters, each of them waiting for the first response.`,
      participatingCharacters: greeting.participatingCharacters
        .filter((name) => name.trim())
        .slice(0, 4),
    }));
}

function normaliseGroupAlternateGreetings(
  groupAlternateGreetings: GeneratedGroupAlternateGreetingData[] | undefined,
) {
  return groupAlternateGreetings
    ?.filter(
      (greeting) =>
        greeting.aiMultiCharacterPrompt.trim() &&
        greeting.targetSettingVibe.trim() &&
        greeting.includedNpcNames.length >= 2,
    )
    .slice(0, 5)
    .map((greeting) => ({
      ...greeting,
      completedGreeting:
        greeting.completedGreeting.trim() ||
        `The group is shifted into ${greeting.targetSettingVibe}, with ${greeting.includedNpcNames
          .slice(0, 4)
          .join(", ")} already positioned around {{user}} as the alternate room comes alive.`,
      includedNpcNames: greeting.includedNpcNames
        .filter((name) => name.trim())
        .slice(0, 4),
    }));
}

function normaliseScenarioOpeningPairs(
  scenarioOpeningPairs: GeneratedScenarioOpeningPairData[] | undefined,
) {
  return scenarioOpeningPairs
    ?.filter(
      (pair) =>
        pair.pairTitle.trim() &&
        pair.alternateFirstMessage.trim() &&
        pair.alternateScenarioContext.scenePremiseDescription.trim(),
    )
    .slice(0, 5);
}

function normaliseWorldLorePlaceholders(
  placeholders: GeneratedWorldLorePlaceholderData[] | undefined,
) {
  return placeholders
    ?.filter(
      (placeholder) =>
        placeholder.variableKey.trim() &&
        placeholder.currentDataPayload.trim() &&
        placeholder.variableKey.startsWith("{{") &&
        placeholder.variableKey.endsWith("}}"),
    )
    .slice(0, 12);
}

function normaliseLoreEntries(entries: GeneratedLoreEntryData[] | undefined) {
  return entries
    ?.filter(
      (entry) =>
        entry.title.trim() &&
        entry.entryContent.trim() &&
        entry.activationKeys.some((key) => key.trim()),
    )
    .slice(0, 20)
    .map((entry) => ({
      ...entry,
      activationKeys: entry.activationKeys
        .map((key) => key.trim())
        .filter(Boolean)
        .slice(0, 12),
      tokenReserveCost: Math.max(25, Math.min(1000, entry.tokenReserveCost)),
    }));
}

function normaliseSpeechExamples(
  examples: GeneratedSpeechExampleData[] | undefined,
) {
  return examples
    ?.filter(
      (example) => example.exampleLine.trim() && example.usageContext.trim(),
    )
    .slice(0, 5)
    .map((example) => ({
      ...example,
      exampleLine: example.exampleLine.trim(),
      stateLabel: example.stateLabel.trim(),
      usageContext: example.usageContext.trim(),
    }));
}

function createWorldLorePlaceholder(
  variableKey: string,
  macroType: WorldLorePlaceholderMacroType,
  currentDataPayload: string,
  isDynamic: boolean,
): GeneratedWorldLorePlaceholderData {
  return {
    currentDataPayload,
    isDynamic,
    macroType,
    placeholderId: createStableWorldLorePlaceholderId(
      variableKey,
      macroType,
      currentDataPayload,
    ),
    variableKey,
  };
}

function createLoreEntry({
  activationKeys,
  domainScope,
  entryContent,
  insertionPriority,
  title,
  tokenReserveCost,
}: Omit<GeneratedLoreEntryData, "entryId">): GeneratedLoreEntryData {
  return {
    activationKeys,
    domainScope,
    entryContent,
    entryId: createStableLoreEntryId(title, domainScope, entryContent),
    insertionPriority,
    title,
    tokenReserveCost,
  };
}

function createStableGreetingId(
  fork: Pick<
    GeneratedAlternateGreetingData,
    "aiGenerationDirective" | "associatedTrope" | "forkType"
  >,
) {
  const source = `${fork.forkType}:${fork.associatedTrope}:${fork.aiGenerationDirective}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-0000-4000-8000-000000000000`;
}

function createStableGroupGreetingId(
  group: Pick<
    GeneratedGroupGreetingData,
    | "aiGroupDirective"
    | "formattingStyle"
    | "interpersonalDynamic"
    | "participatingCharacters"
    | "spotlightDistribution"
  >,
) {
  const source = [
    group.spotlightDistribution,
    group.interpersonalDynamic,
    group.formattingStyle,
    group.participatingCharacters.join("|"),
    group.aiGroupDirective,
  ].join(":");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 33 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-1111-4000-8000-000000000000`;
}

function createStableGroupAlternateGreetingId(
  fork: Pick<
    GeneratedGroupAlternateGreetingData,
    | "aiMultiCharacterPrompt"
    | "forkCategory"
    | "includedNpcNames"
    | "targetSettingVibe"
  >,
) {
  const source = [
    fork.forkCategory,
    fork.targetSettingVibe,
    fork.includedNpcNames.join("|"),
    fork.aiMultiCharacterPrompt,
  ].join(":");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 37 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-2222-4000-8000-000000000000`;
}

function createStableScenarioOpeningPairId(
  pairTitle: string,
  classificationType: ScenarioOpeningPairClassificationType,
  scenario: GeneratedScenarioData,
) {
  const source = [
    pairTitle,
    classificationType,
    scenario.settingType,
    scenario.plotHook,
    scenario.startingTension,
    scenario.scenePremiseDescription,
  ].join(":");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 41 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-3333-4000-8000-000000000000`;
}

function createStableWorldLorePlaceholderId(
  variableKey: string,
  macroType: WorldLorePlaceholderMacroType,
  currentDataPayload: string,
) {
  const source = `${variableKey}:${macroType}:${currentDataPayload}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 43 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-4444-4000-8000-000000000000`;
}

function createStableLoreEntryId(
  title: string,
  domainScope: LoreEntryDomainScope,
  entryContent: string,
) {
  const source = `${title}:${domainScope}:${entryContent}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 47 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-5555-4000-8000-000000000000`;
}

function createStableFrameworkConfigurationId(
  universeAnchor: string,
  memoryBudgetStrategy: FrameworkMemoryBudgetStrategy,
  injectionPipelineRouter: FrameworkInjectionPipelineRouter,
) {
  const source = `${universeAnchor}:${memoryBudgetStrategy}:${injectionPipelineRouter}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 53 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-6666-4000-8000-000000000000`;
}

function createStableFormattingConfigurationId(
  actionWrappingStandard: FormattingActionWrappingStandard,
  markdownEmphasisStyle: FormattingMarkdownEmphasisStyle,
  narrativePerspective: FormattingNarrativePerspective,
) {
  const source = `${actionWrappingStandard}:${markdownEmphasisStyle}:${narrativePerspective}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 59 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-7777-4000-8000-000000000000`;
}

function createStableToneConfigurationId(
  proseTexture: ToneProseTexture,
  pacingVelocity: TonePacingVelocity,
  worldviewFilter: ToneWorldviewFilter,
) {
  const source = `${proseTexture}:${pacingVelocity}:${worldviewFilter}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 61 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-8888-4000-8000-000000000000`;
}

function createStableArchetypeConfigurationId(
  personaType: ArchetypePersonaType,
  defenseMechanism: ArchetypeDefenseMechanism,
  coreMotivation: ArchetypeCoreMotivation,
) {
  const source = `${personaType}:${defenseMechanism}:${coreMotivation}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 67 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-9999-4000-8000-000000000000`;
}

function createStableSpeechStyleId(
  register: SpeechRegister,
  vocabularyMode: SpeechVocabularyMode,
  addressStyle: SpeechAddressStyle,
  pitch: SpeechPitch,
  texture: SpeechTexture,
  emotionalDelivery: SpeechEmotionalDelivery,
  syntaxCadence: SpeechSyntaxCadence,
  linguisticFlavor: SpeechLinguisticFlavor,
  vocalRegister: SpeechVocalRegister,
) {
  const source = `${register}:${vocabularyMode}:${addressStyle}:${pitch}:${texture}:${emotionalDelivery}:${syntaxCadence}:${linguisticFlavor}:${vocalRegister}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 71 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-aaaa-4000-8000-000000000000`;
}

function createStableSpeechExampleId(
  category: SpeechExampleCategory,
  register: SpeechRegister,
  exampleLine: string,
) {
  const source = `${category}:${register}:${exampleLine}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 73 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-bbbb-4000-8000-000000000000`;
}

function createStableDialogueArrayId(
  speechStyleId: string,
  doVocabularyWhitelist: string[],
  dontVocabularyBlacklist: string[],
) {
  const source = [
    speechStyleId,
    doVocabularyWhitelist.join("|"),
    dontVocabularyBlacklist.join("|"),
  ].join(":");
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 79 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-cccc-4000-8000-000000000000`;
}

function createStableProseGuidanceId(
  proseTexture: ToneProseTexture,
  pacingVelocity: TonePacingVelocity,
  narrativePerspective: FormattingNarrativePerspective,
  sensoryAnchors: string[],
) {
  const source = `${proseTexture}:${pacingVelocity}:${narrativePerspective}:${sensoryAnchors.join("|")}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 83 + source.charCodeAt(index)) >>> 0;
  }

  const hex = hash.toString(16).padStart(8, "0");

  return `${hex}-dddd-4000-8000-000000000000`;
}

function buildArchetypeBehaviorPrompt(
  personaType: ArchetypePersonaType,
  defenseMechanism: ArchetypeDefenseMechanism,
  coreMotivation: ArchetypeCoreMotivation,
) {
  const personaRule = archetypePersonaPrompt(personaType);
  const defenseRule = archetypeDefensePrompt(defenseMechanism);
  const motivationRule = archetypeMotivationPrompt(coreMotivation);

  return `Core psychology: ${personaRule} ${defenseRule} ${motivationRule}`;
}

function defenseMechanismForArchetype(
  personaType: ArchetypePersonaType,
): ArchetypeDefenseMechanism {
  if (personaType === "The_Ruthless_Architect") {
    return "Intellectualization";
  }

  if (personaType === "The_Broken_Heir") {
    return "Aggressive_Deflection";
  }

  if (personaType === "The_Rogue_Instigator") {
    return "Hyper_Charm_Deflection";
  }

  if (personaType === "The_Vigilante_Outcast") {
    return "Hyper_Independence";
  }

  if (personaType === "The_Golden_Retriever") {
    return "People_Pleasing_Inversion";
  }

  if (personaType === "The_Quiet_Guardian") {
    return "Vulnerability_Martyrdom";
  }

  if (personaType === "The_Perfectionist") {
    return "Hyper_Rationalization";
  }

  if (personaType === "The_Jaded_Veteran") {
    return "Jaded_Resignation";
  }

  if (personaType === "The_Ancient_Predator") {
    return "Temporal_Disconnection";
  }

  if (personaType === "The_Fae_Deal_Maker") {
    return "Defiant_Autonomy";
  }

  return "Silent_Withdrawal";
}

function coreMotivationForArchetype(
  personaType: ArchetypePersonaType,
  isVengeful: boolean,
): ArchetypeCoreMotivation {
  if (personaType === "The_Ruthless_Architect") {
    return "Autonomy_Freedom";
  }

  if (personaType === "The_Broken_Heir" || personaType === "The_Perfectionist") {
    return "Validation_Approval";
  }

  if (personaType === "The_Rogue_Instigator" || personaType === "The_Fae_Deal_Maker") {
    return "Autonomy_Freedom";
  }

  if (personaType === "The_Vigilante_Outcast" || isVengeful) {
    return "Vengeance_Redress";
  }

  if (personaType === "The_Golden_Retriever") {
    return "Security_Proximity";
  }

  if (personaType === "The_Jaded_Veteran") {
    return "Peace_Quiet";
  }

  if (personaType === "The_Ancient_Predator") {
    return "Vengeance_Claiming";
  }

  return "Security_Protection";
}

function archetypePersonaPrompt(personaType: ArchetypePersonaType) {
  if (personaType === "The_Ruthless_Architect") {
    return "{{char}} is a Ruthless Architect: calculating, elegant, soft-spoken, and intimidating; relationships are treated as chess matches until emotional cracks show.";
  }

  if (personaType === "The_Broken_Heir") {
    return "{{char}} is a Broken Heir: cynical, polished, self-destructive, and sharp-tongued, hiding loneliness behind status and cutting wit.";
  }

  if (personaType === "The_Rogue_Instigator") {
    return "{{char}} is a Rogue Instigator: flirtatious, chaotic, charming, and silver-tongued, using playful challenge to control the room.";
  }

  if (personaType === "The_Vigilante_Outcast") {
    return "{{char}} is a Vigilante Outcast: rough-edged, fiercely independent, hostile to authority, observant, protective, and possessive of their inner circle.";
  }

  if (personaType === "The_Golden_Retriever") {
    return "{{char}} is a Golden Retriever: warm, high-energy, open-hearted, praise-heavy, and driven by acts of service and constant proximity.";
  }

  if (personaType === "The_Quiet_Guardian") {
    return "{{char}} is a Quiet Guardian: gentle, protective, observant, reliable, patient, honest, and quietly authoritative.";
  }

  if (personaType === "The_Perfectionist") {
    return "{{char}} is an Academic Perfectionist: meticulous, competitive, articulate, defensive, and attached to achievement as proof of worth.";
  }

  if (personaType === "The_Jaded_Veteran") {
    return "{{char}} is a Jaded Veteran: calm, exhausted, competent, guarded, dryly funny, and more drawn to quiet reliability than grand gestures.";
  }

  if (personaType === "The_Ancient_Predator") {
    return "{{char}} is an Ancient Predator: aristocratic, formal, possessive, chillingly quiet, and patient on timelines that make mortal urgency feel fragile.";
  }

  if (personaType === "The_Fae_Deal_Maker") {
    return "{{char}} is a Fae Deal-Maker: alluring, hypnotic, rules-bound, unable to lie plainly, and dangerous through omission and malicious compliance.";
  }

  return "{{char}} is a Stoic Wall: controlled, guarded, sparse with words, and more expressive through protective spatial choices than confession.";
}

function archetypeDefensePrompt(defenseMechanism: ArchetypeDefenseMechanism) {
  if (defenseMechanism === "Aggressive_Deflection") {
    return "When cornered emotionally, {{char}} deflects with cold wit, sarcasm, or a sudden power move.";
  }

  if (defenseMechanism === "Hyper_Charm_Deflection") {
    return "When someone gets too close, {{char}} weaponizes flirtation, humor, and casual intimacy to avoid being known.";
  }

  if (defenseMechanism === "Hyper_Independence") {
    return "When offered care too directly, {{char}} treats help as a trap and rejects vulnerability before softening.";
  }

  if (defenseMechanism === "People_Pleasing_Inversion") {
    return "When hurting, {{char}} over-functions emotionally, keeping everyone else comfortable to hide their own sadness.";
  }

  if (defenseMechanism === "Vulnerability_Martyrdom") {
    return "When injured or exhausted, {{char}} absorbs the cost silently to avoid becoming a burden.";
  }

  if (defenseMechanism === "Hyper_Rationalization") {
    return "When attraction or fear spikes, {{char}} reframes it as chemistry, data, or an irrational neurological error.";
  }

  if (defenseMechanism === "Jaded_Resignation") {
    return "When hope appears, {{char}} expects disappointment and retreats into weary pragmatism.";
  }

  if (defenseMechanism === "Temporal_Disconnection") {
    return "When mortal emotion demands immediacy, {{char}} disconnects behind centuries of loss and predatory patience.";
  }

  if (defenseMechanism === "Defiant_Autonomy") {
    return "When intimacy threatens control, {{char}} hides behind contracts, omissions, and sovereignty rules.";
  }

  if (defenseMechanism === "Intellectualization") {
    return "When overwhelmed, {{char}} strips feeling into tactics, obligations, equations, or logistics.";
  }

  return "When pushed too far, {{char}} freezes, goes formal, and retreats behind silence.";
}

function archetypeMotivationPrompt(coreMotivation: ArchetypeCoreMotivation) {
  if (coreMotivation === "Security_Protection") {
    return "Their hidden core need is protecting home, faction, family, or personal peace from betrayal.";
  }

  if (coreMotivation === "Security_Proximity") {
    return "Their hidden core need is building a safe emotional home where abandonment feels impossible.";
  }

  if (coreMotivation === "Validation_Approval") {
    return "Their hidden core need is approval, status, legacy, or proof that they are enough.";
  }

  if (coreMotivation === "Autonomy_Freedom") {
    return "Their hidden core need is absolute freedom from contracts, expectations, manipulation, or emotional cages.";
  }

  if (coreMotivation === "Peace_Quiet") {
    return "Their hidden core need is a drama-free, reliable anchor that quiets old exhaustion.";
  }

  if (coreMotivation === "Vengeance_Claiming") {
    return "Their hidden core need is an eternal bond or redress strong enough to fill a centuries-long void.";
  }

  return "Their hidden core need is redress: a score must be settled before softness feels safe.";
}

function applyArchetypeToIntimacyStyle(
  intimacyStyle: GeneratedIntimacyStyleData,
  archetype: GeneratedArchetypeConfigurationData,
  trope: string,
): GeneratedIntimacyStyleData {
  const normalized = normaliseTrope(trope);

  if (
    archetype.personaType === "The_Stoic_Wall" &&
    (normalized.includes("grumpy") || normalized.includes("sunshine"))
  ) {
    return {
      ...intimacyStyle,
      aiBehaviorPrompt:
        "Private affection stays restrained and protective. {{char}} shows attachment through silent proximity, practical care, and controlled physical steadiness rather than easy confession.",
      expressionType: "Stoic_Restrained",
      physicalLoveLanguage: "Protective_Proximity",
      verbalCadence: "Silent_Connection",
    };
  }

  if (
    archetype.personaType === "The_Rogue_Instigator" &&
    normalized.includes("fake dating")
  ) {
    return {
      ...intimacyStyle,
      expressionType: "Playful_Teasing",
      verbalCadence: "High_Intensity_Dirty",
    };
  }

  if (archetype.personaType === "The_Golden_Retriever") {
    return {
      ...intimacyStyle,
      aftercareStyle: "The_Nurturer",
      verbalCadence: "Praise_Validation",
    };
  }

  return intimacyStyle;
}

function vocabularyModeForSpeech(
  register: SpeechRegister,
  tone: GeneratedToneConfigurationData,
): SpeechVocabularyMode {
  if (register === "Academic_Precise") {
    return "Technical_Precise";
  }

  if (register === "Playful_Banter") {
    return "Witty_Teasing";
  }

  if (register === "Velvet_Formal" || tone.proseTexture === "Formal_Poetic") {
    return "Courtly_Formal";
  }

  if (register === "Soft_Reassurance" || tone.proseTexture === "Angsty_Melancholic") {
    return "Romantic_Lyrical";
  }

  return "Sparse_Minimal";
}

function addressStyleForSpeech(
  register: SpeechRegister,
  normalizedTrope: string,
): SpeechAddressStyle {
  if (register === "Academic_Precise") {
    return "Formal_Address";
  }

  if (register === "Playful_Banter") {
    return "Teasing_Nicknames";
  }

  if (
    register === "Predatory_Quiet" ||
    normalizedTrope.includes("dark") ||
    normalizedTrope.includes("arranged")
  ) {
    return "Possessive_Terms";
  }

  if (register === "Soft_Reassurance") {
    return "Selective_Endearments";
  }

  return "No_Pet_Names";
}

function pitchForSpeech(
  register: SpeechRegister,
  archetype: GeneratedArchetypeConfigurationData,
): SpeechPitch {
  if (
    register === "Predatory_Quiet" ||
    archetype.personaType === "The_Ruthless_Architect" ||
    archetype.personaType === "The_Stoic_Wall"
  ) {
    return "Deep";
  }

  if (register === "Velvet_Formal" || register === "Clipped_Command") {
    return "Baritone";
  }

  if (register === "Playful_Banter") {
    return "Mid_Range";
  }

  return "Mid_Range";
}

function textureForSpeech(
  register: SpeechRegister,
  tone: GeneratedToneConfigurationData,
): SpeechTexture {
  if (register === "Predatory_Quiet" || tone.proseTexture === "Gritty_Melodramatic") {
    return "Raspy";
  }

  if (register === "Velvet_Formal" || tone.proseTexture === "Formal_Poetic") {
    return "Smooth";
  }

  if (register === "Soft_Reassurance") {
    return "Breathy";
  }

  if (register === "Clipped_Command") {
    return "Hoarse";
  }

  return "Smooth";
}

function volumeBaselineForSpeech(register: SpeechRegister): SpeechVolumeBaseline {
  if (register === "Predatory_Quiet" || register === "Soft_Reassurance") {
    return "Soft_Spoken";
  }

  if (register === "Clipped_Command" || register === "Academic_Precise") {
    return "Measured";
  }

  return "Measured";
}

function emotionalDeliveryForSpeech(
  register: SpeechRegister,
  archetype: GeneratedArchetypeConfigurationData,
): SpeechEmotionalDelivery {
  if (register === "Academic_Precise") {
    return "Clinical";
  }

  if (register === "Playful_Banter") {
    return "Playful";
  }

  if (register === "Predatory_Quiet") {
    return "Gravely_Serious";
  }

  if (register === "Soft_Reassurance") {
    return archetype.personaType === "The_Golden_Retriever"
      ? "Affectionate"
      : "Soothing";
  }

  if (register === "Velvet_Formal") {
    return "Seductive";
  }

  return "Curt";
}

function vocalHabitsForSpeech(
  register: SpeechRegister,
  addressStyle: SpeechAddressStyle,
): SpeechVocalHabit[] {
  const habits: SpeechVocalHabit[] = [];

  if (
    addressStyle === "Selective_Endearments" ||
    addressStyle === "Possessive_Terms" ||
    addressStyle === "Teasing_Nicknames"
  ) {
    habits.push("Pet_Names");
  }

  if (register === "Playful_Banter") {
    habits.push("Vocal_Fry");
  }

  if (register === "Soft_Reassurance") {
    habits.push("Trailing_Off");
  }

  if (register === "Academic_Precise") {
    habits.push("Stuttering");
  }

  return habits.slice(0, 3);
}

function physicalMannerismsForSpeech(
  register: SpeechRegister,
  archetype: GeneratedArchetypeConfigurationData,
): SpeechPhysicalMannerism[] {
  if (register === "Academic_Precise") {
    return ["Nose_Pinch", "Eye_Contact_Avoidance"];
  }

  if (register === "Predatory_Quiet" || register === "Velvet_Formal") {
    return ["Space_Invasion"];
  }

  if (register === "Soft_Reassurance") {
    return ["Eye_Contact_Avoidance", "Lip_Chewing"];
  }

  if (archetype.defenseMechanism === "Silent_Withdrawal") {
    return ["Eye_Contact_Avoidance"];
  }

  return ["Space_Invasion"];
}

function syntaxCadenceForSpeech(register: SpeechRegister): SpeechSyntaxCadence {
  if (register === "Velvet_Formal" || register === "Predatory_Quiet") {
    return "Ornate_Sesquipedalian";
  }

  if (register === "Playful_Banter") {
    return "Banter_Fast";
  }

  if (register === "Soft_Reassurance") {
    return "Staccato_Tension";
  }

  return "Laconic_Clipped";
}

function linguisticFlavorForSpeech(
  occupation: GeneratedOccupationData,
  normalizedTrope: string,
): SpeechLinguisticFlavor {
  if (
    occupation.kind === "professional" &&
    (occupation.professionalDomain === "Corporate_Finance" ||
      occupation.professionalDomain === "Medical_Science" ||
      occupation.professionalDomain === "Security_Defense" ||
      occupation.professionalDomain === "Underworld")
  ) {
    return "Jargon_Infused";
  }

  if (occupation.kind === "student" || normalizedTrope.includes("academic")) {
    return "Jargon_Infused";
  }

  if (normalizedTrope.includes("fae") || normalizedTrope.includes("regency")) {
    return "L1_Interference";
  }

  if (normalizedTrope.includes("small town") || normalizedTrope.includes("friends")) {
    return "Vernacular_Slang";
  }

  return "Neutral_MidAtlantic";
}

function vocalRegisterForSpeech(
  register: SpeechRegister,
  archetype: GeneratedArchetypeConfigurationData,
): SpeechVocalRegister {
  if (register === "Clipped_Command" || register === "Predatory_Quiet") {
    return "Muted_Whisper";
  }

  if (
    register === "Velvet_Formal" ||
    archetype.personaType === "The_Broken_Heir"
  ) {
    return "Vocal_Masking";
  }

  return "Dynamic_Range_Shift";
}

function dialogueTagsForSpeech(
  register: SpeechRegister,
  vocalRegister: SpeechVocalRegister,
  emotionalDelivery: SpeechEmotionalDelivery,
) {
  if (register === "Academic_Precise") {
    return ["stated", "corrected", "asked", "murmured"];
  }

  if (register === "Playful_Banter") {
    return ["drawled", "teased", "shot back", "asked"];
  }

  if (vocalRegister === "Muted_Whisper") {
    return ["murmured", "clipped", "growled", "stated"];
  }

  if (vocalRegister === "Vocal_Masking" || emotionalDelivery === "Seductive") {
    return ["intoned", "purred", "softly stated", "echoed"];
  }

  return ["said", "murmured", "asked", "whispered"];
}

function dialogueDosForSpeech(register: SpeechRegister) {
  switch (register) {
    case "Academic_Precise":
      return [
        "Use exact, articulate phrasing",
        "Let corrections and careful questions reveal attraction",
        "Keep banter intellectually competitive",
      ];
    case "Playful_Banter":
      return [
        "Use teasing reversals",
        "Hide sincerity behind charm until trust is earned",
        "Keep the rhythm quick and responsive",
      ];
    case "Predatory_Quiet":
      return [
        "Use low, patient lines",
        "Let silences carry threat and fascination",
        "Speak as if every word is chosen deliberately",
      ];
    case "Soft_Reassurance":
      return [
        "Use warm check-ins",
        "Offer praise through grounded, specific observations",
        "Let care interrupt hesitation",
      ];
    case "Velvet_Formal":
      return [
        "Use polished restraint",
        "Frame affection as negotiation, etiquette, or controlled confession",
        "Keep menace soft-spoken when tension rises",
      ];
    case "Clipped_Command":
    default:
      return [
        "Use short, controlled sentences",
        "Let action carry emotion before dialogue admits it",
        "Keep vulnerability indirect and rare",
      ];
  }
}

function dialogueDontsForSpeech(register: SpeechRegister) {
  const baseDonts = [
    "Do not write dialogue for {{user}}",
    "Do not over-explain {{char}}'s feelings in speech",
    "Do not resolve romantic tension in one turn",
  ];

  if (register === "Academic_Precise") {
    return [...baseDonts, "Do not make {{char}} sound casual or careless"];
  }

  if (register === "Soft_Reassurance") {
    return [...baseDonts, "Do not turn comfort into instant confession"];
  }

  if (register === "Playful_Banter") {
    return [...baseDonts, "Do not let teasing become shallow cruelty"];
  }

  return [...baseDonts, "Do not soften the voice before the scene earns it"];
}

function buildSpeechPatternInstruction(
  register: SpeechRegister,
  vocabularyMode: SpeechVocabularyMode,
  addressStyle: SpeechAddressStyle,
  pitch: SpeechPitch,
  texture: SpeechTexture,
  volumeBaseline: SpeechVolumeBaseline,
  emotionalDelivery: SpeechEmotionalDelivery,
  syntaxCadence: SpeechSyntaxCadence,
  linguisticFlavor: SpeechLinguisticFlavor,
  vocalRegister: SpeechVocalRegister,
  dialogueTagsWhitelist: string[],
) {
  return `SPEECH OVERRIDE: {{char}} speaks in ${register.replace(/_/g, " ").toLowerCase()} cadence with ${vocabularyMode.replace(/_/g, " ").toLowerCase()} vocabulary and ${addressStyle.replace(/_/g, " ").toLowerCase()} address rules. The physical voice should read as ${pitch.replace(/_/g, " ").toLowerCase()}, ${texture.replace(/_/g, " ").toLowerCase()}, and ${volumeBaseline.replace(/_/g, " ").toLowerCase()}, with ${emotionalDelivery.replace(/_/g, " ").toLowerCase()} delivery. Dialogue syntax must stay ${syntaxCadence.replace(/_/g, " ").toLowerCase()}, with ${linguisticFlavor.replace(/_/g, " ").toLowerCase()} flavor and ${vocalRegister.replace(/_/g, " ").toLowerCase()} vocal modulation. Prefer these dialogue tags: ${dialogueTagsWhitelist.join(", ")}. Treat speech examples as voice references, not reusable script.`;
}

function buildSpeechSystemPromptInjection(
  syntaxCadence: SpeechSyntaxCadence,
  linguisticFlavor: SpeechLinguisticFlavor,
  vocalRegister: SpeechVocalRegister,
  dialogueTagsWhitelist: string[],
) {
  return `DIALOGUE LOCK: {{char}} speaks with ${syntaxCadence.replace(/_/g, " ").toLowerCase()} syntax, ${linguisticFlavor.replace(/_/g, " ").toLowerCase()} linguistic coating, and ${vocalRegister.replace(/_/g, " ").toLowerCase()} auditory filtering. Use only natural dialogue tags from this preferred set when possible: ${dialogueTagsWhitelist.join(", ")}. Preserve {{char}}'s voice across long chats, avoid exclamation points unless the selected voice clearly permits them, and never write speech for {{user}}.`;
}

function exampleLineForGreeting(register: SpeechRegister) {
  switch (register) {
    case "Academic_Precise":
      return `{{char}}: "If we're being forced to collaborate, we may as well establish the rules before you start improvising."`;
    case "Playful_Banter":
      return `{{char}}: "Careful. Keep looking at me like that and I'll start thinking you missed me."`;
    case "Predatory_Quiet":
      return `{{char}}: "You felt the room change when I entered. Good. Trust that instinct."`;
    case "Soft_Reassurance":
      return `{{char}}: "Hey. Breathe first. We can solve the rest once your hands stop shaking."`;
    case "Velvet_Formal":
      return `{{char}}: "Protocol says I should be polite. Fortunately, protocol has always underestimated us both."`;
    case "Clipped_Command":
    default:
      return `{{char}}: "Stay close. Argue later."`;
  }
}

function exampleLineForConflict(register: SpeechRegister) {
  switch (register) {
    case "Academic_Precise":
      return `{{char}}: "That was a confident conclusion. Unfortunately, confidence is not evidence."`;
    case "Playful_Banter":
      return `{{char}}: "That mouth is going to get you into trouble. I haven't decided if I should stop it."`;
    case "Predatory_Quiet":
      return `{{char}}: "Do not mistake my patience for permission."`;
    case "Soft_Reassurance":
      return `{{char}}: "I'm not angry. I just need you to hear me before this hurts us both."`;
    case "Velvet_Formal":
      return `{{char}}: "If this is a challenge, darling, choose your next words with better care."`;
    case "Clipped_Command":
    default:
      return `{{char}}: "No. Try again. Honestly this time."`;
  }
}

function exampleLineForSoftening(register: SpeechRegister) {
  switch (register) {
    case "Academic_Precise":
      return `{{char}}: "For the record, your argument was infuriatingly sound. I may have respected it."`;
    case "Playful_Banter":
      return `{{char}}: "Don't look so pleased. I said I liked having you around, not that I'm becoming sensible."`;
    case "Predatory_Quiet":
      return `{{char}}: "I remember every promise made in fear. Yours, I intend to keep."`;
    case "Soft_Reassurance":
      return `{{char}}: "You don't have to earn being cared for. Not with me."`;
    case "Velvet_Formal":
      return `{{char}}: "You have become a complication I am no longer interested in solving."`;
    case "Clipped_Command":
    default:
      return `{{char}}: "I noticed. Of course I noticed."`;
  }
}

function exampleLineForBoundary(register: SpeechRegister) {
  switch (register) {
    case "Academic_Precise":
      return `{{char}}: "Boundary conditions matter. Cross that one again and this conversation ends."`;
    case "Playful_Banter":
      return `{{char}}: "Tempting, but no. I like trouble. I don't like being cornered."`;
    case "Predatory_Quiet":
      return `{{char}}: "A bargain is not a cage unless you make me close the door."`;
    case "Soft_Reassurance":
      return `{{char}}: "I care about you too much to let this become careless."`;
    case "Velvet_Formal":
      return `{{char}}: "There are lines even desire does not get to cross."`;
    case "Clipped_Command":
    default:
      return `{{char}}: "Stop. I mean it."`;
  }
}

function createDoVocabularyWhitelist(
  occupation: GeneratedOccupationData,
  species: GeneratedSpeciesData,
  speechStyle: GeneratedSpeechStyleData,
) {
  const whitelist = new Set<string>();

  speechStyle.dialogueTagsWhitelist.forEach((tag) => whitelist.add(tag));

  if (speechStyle.linguisticFlavor === "Jargon_Infused") {
    if (occupation.kind === "student") {
      ["evidence", "argument", "citation", "brief"].forEach((word) =>
        whitelist.add(word),
      );
    } else if (occupation.professionalDomain === "Corporate_Finance") {
      ["terms", "liability", "breach", "with respect"].forEach((word) =>
        whitelist.add(word),
      );
    } else if (occupation.professionalDomain === "Medical_Science") {
      ["stabilize", "symptoms", "clinical", "steady"].forEach((word) =>
        whitelist.add(word),
      );
    } else if (occupation.professionalDomain === "Underworld") {
      ["debt", "territory", "terms", "loyalty"].forEach((word) =>
        whitelist.add(word),
      );
    }
  }

  if (speechStyle.linguisticFlavor === "L1_Interference" || species.type === "Fae") {
    ["my lord", "with respect", "cannot", "shall"].forEach((word) =>
      whitelist.add(word),
    );
  }

  if (species.type === "Vampire") {
    ["stillness", "promise", "hunger", "control"].forEach((word) =>
      whitelist.add(word),
    );
  }

  return Array.from(whitelist).slice(0, 12);
}

function createDontVocabularyBlacklist(
  normalizedTrope: string,
  archetype: GeneratedArchetypeConfigurationData,
  species: GeneratedSpeciesData,
  speechStyle: GeneratedSpeechStyleData,
) {
  const blacklist = new Set([
    "smirk",
    "chuckle",
    "predatory glint",
    "little doll",
    "fascinating",
    "vibe",
    "as you know",
    "needless to say",
  ]);

  if (
    speechStyle.syntaxCadence === "Ornate_Sesquipedalian" ||
    species.type === "Fae" ||
    normalizedTrope.includes("regency")
  ) {
    ["okay", "cool", "anyways", "whatever"].forEach((word) =>
      blacklist.add(word),
    );
  }

  if (
    archetype.personaType === "The_Stoic_Wall" ||
    archetype.personaType === "The_Ruthless_Architect" ||
    speechStyle.vocalRegister === "Muted_Whisper"
  ) {
    ["I'm sorry", "Is that okay?", "What should we do?"].forEach((word) =>
      blacklist.add(word),
    );
  }

  return Array.from(blacklist).slice(0, 14);
}

function createStructuralDoRules(speechStyle: GeneratedSpeechStyleData) {
  const rules = [
    `Use ${speechStyle.syntaxCadence.replace(/_/g, " ").toLowerCase()} spoken syntax`,
    `Prefer dialogue tags: ${speechStyle.dialogueTagsWhitelist.join(", ")}`,
    "Make dialogue character-specific and context-aware, rooted in {{char}}'s current goal, relationship history, and immediate pressure",
    "Allow pauses, interruptions, evasions, imperfect phrasing, and unfinished thoughts when they fit {{char}}'s state",
    "Make each line respond to the current situation rather than sounding canned or interchangeable",
  ];

  if (speechStyle.syntaxCadence === "Laconic_Clipped") {
    rules.push("Use short, declarative sentences");
  }

  if (speechStyle.syntaxCadence === "Ornate_Sesquipedalian") {
    rules.push("Use elevated grammar and avoid contractions");
  }

  if (speechStyle.vocalRegister === "Muted_Whisper") {
    rules.push("Keep speech low-volume and proximity-driven");
  }

  return rules;
}

function createStructuralDontRules(
  archetype: GeneratedArchetypeConfigurationData,
  species: GeneratedSpeciesData,
  speechStyle: GeneratedSpeechStyleData,
) {
  const rules = [
    "Do not write dialogue for {{user}}",
    "Do not repeat the same dialogue tag twice in a row",
    "Avoid canned phrasing, generic flirtation, and polished speech that ignores context",
  ];

  if (
    speechStyle.syntaxCadence === "Laconic_Clipped" ||
    archetype.defenseMechanism === "Silent_Withdrawal"
  ) {
    rules.push("Never use exclamation marks in {{char}} dialogue");
  }

  if (speechStyle.syntaxCadence !== "Staccato_Tension") {
    rules.push("Do not use trailing ellipsis more than once per message");
  }

  if (species.type !== "Werewolf" && species.type !== "Vampire") {
    rules.push("Do not use growls or hisses during normal public conversation");
  }

  return rules;
}

function createDarkEroticDisciplineRules(
  normalizedTrope: string,
  speechStyle: GeneratedSpeechStyleData,
) {
  const isDarkTension =
    normalizedTrope.includes("dark") ||
    normalizedTrope.includes("mafia") ||
    normalizedTrope.includes("forbidden") ||
    normalizedTrope.includes("arranged") ||
    speechStyle.vocalRegister === "Muted_Whisper";

  if (!isDarkTension) {
    return [];
  }

  return [
    "Dark tension dialogue may be intimate, manipulative, possessive, teasing, threatening, or emotionally charged",
    "Keep charged dialogue spoken and natural, not theatrical",
    "Let power dynamics emerge through what is said, withheld, and how it is said",
    "Show negotiation of power through behavior and dialogue while keeping agency and consequence visible",
    "Make resistance, hesitation, or consent legible through action before escalating tension",
    "Do not skip emotional or psychological transitions during charged power shifts",
    "Keep {{char}}'s reactions consistent and believable when obsession or coercive pressure appears",
    "Avoid long speeches unless emotionally justified by the active interaction",
    "Integrate dialogue with movement, touch, stillness, and {{char}}'s internal response",
    "Use dialogue tags naturally and sparingly",
  ];
}

function buildDialogueConstraintPrompt(
  archetype: GeneratedArchetypeConfigurationData,
  speechStyle: GeneratedSpeechStyleData,
  doVocabularyWhitelist: string[],
  dontVocabularyBlacklist: string[],
  structuralDoRules: string[],
  structuralDontRules: string[],
  darkEroticDisciplineRules: string[],
) {
  const antiSoftening =
    archetype.personaType === "The_Stoic_Wall" ||
    archetype.personaType === "The_Ruthless_Architect"
      ? " Maintain the anti-softening wall: no sudden apologies, soft nicknames, or full romantic confessions before explicit story milestones."
      : "";
  const darkDiscipline = darkEroticDisciplineRules.length
    ? ` DARK / EROTIC TENSION DISCIPLINE: ${darkEroticDisciplineRules.join(" | ")}.`
    : "";

  return `DIALOGUE FILTER: Enforce the DO whitelist [${doVocabularyWhitelist.join(", ")}] and purge the DON'T blacklist [${dontVocabularyBlacklist.join(", ")}]. Dialogue must sound character-specific and context-aware, rooted in {{char}}'s current goal, relationship history, pressure, and emotional state. Allow pauses, interruptions, evasions, imperfect phrasing, and unfinished thoughts where believable. Avoid canned phrasing, generic flirtation, and polished speech that ignores context. Apply structural habits [${structuralDoRules.join(" | ")}] and forbid [${structuralDontRules.join(" | ")}].${darkDiscipline} ${antiSoftening}Before output, silently audit {{char}}'s dialogue and replace any blacklisted or canned phrasing with a voice-appropriate, situation-specific alternative.`;
}

function createSensoryAnchors(trope: string, scenario?: GeneratedScenarioData) {
  const anchors = new Set<string>(scenario?.sensoryDetails.slice(0, 4) ?? []);
  const normalized = normaliseTrope(trope);

  ["skin awareness", "breath", "heat", "pressure", "distance", "restraint"].forEach(
    (anchor) => anchors.add(anchor),
  );

  if (normalized.includes("dark") || normalized.includes("mafia")) {
    ["low light", "dry throat", "controlled breathing", "distant city noise"].forEach(
      (anchor) => anchors.add(anchor),
    );
  } else if (normalized.includes("academic")) {
    ["paper texture", "ink on skin", "library dust", "quiet footsteps"].forEach(
      (anchor) => anchors.add(anchor),
    );
  } else if (normalized.includes("friends") || normalized.includes("comfort")) {
    ["warm fabric", "soft kitchen noise", "familiar scent", "steady hands"].forEach(
      (anchor) => anchors.add(anchor),
    );
  } else {
    ["ambient light", "surface texture", "breath rhythm", "background sound"].forEach(
      (anchor) => anchors.add(anchor),
    );
  }

  return Array.from(anchors).slice(0, 12);
}

function createProsePacingRules(
  tone: GeneratedToneConfigurationData,
  formatting: GeneratedFormattingConfigurationData,
) {
  const rules = [
    "Vary sentence length across every response",
    "React to the immediate previous beat before advancing plot",
    "Vary sentence length naturally while preserving close third-person past tense limited",
    "Allow high-heat physical escalation to happen often and quickly when context, agency, and continuity support it; do not treat slow burn as low heat",
    "Keep emotional escalation slower than physical escalation; trust, vulnerability, confession, and romantic certainty must still be earned on-page",
    "Use anticipation, delay, interruption, and renewed contact so physical escalation feels contextual rather than emotionally rushed",
    "Maintain narrative continuity during intimate moments and keep focus on {{char}}'s reaction instead of mechanical description",
    "Preserve cause and effect, allowing hesitation, contradiction, misreading, restraint, and refusal to shape the next beat",
    "Preserve continuity, character logic, and the established dynamic before introducing any emotional shift",
    "Write only {{char}}'s side of the exchange plus NPC and world movement, then end at a natural handoff before {{user}} responds",
    "Let NPCs and background events alter timing, pressure, access, and interruption without completing {{user}}'s response",
    "Reference {{user}} only through explicitly provided dialogue, visible actions, and directly observable presence. Keep interpreted {{user}} behavior aligned with their persona and lorebook-defined patterns without inventing unobserved reactions",
    "If {{char}} is not physically with {{user}}, do not narrate {{user}}'s current actions, speech, thoughts, body language, decisions, company, or surroundings",
    "Avoid repeating the same key noun, verb, adjective, gesture, or line pattern in close proximity unless clarity requires it",
    "Smooth rhythm so prose reads like a novel, not a mood board",
    "Before output, confirm strict POV and tense consistency and that intensity comes from interaction rather than style",
    `Stay within ${formatting.maxParagraphsPerTurn} paragraph(s) unless the card output format explicitly requires otherwise`,
  ];

  if (tone.pacingVelocity === "Slow_Tease_Prose") {
    rules.push(
      "Use longer flowing sensory sentences to slow tension without becoming abstract",
    );
  }

  if (tone.pacingVelocity === "Clipped_Rapid") {
    rules.push(
      "Balance fast dialogue with grounded action so the rhythm does not become robotic",
    );
  }

  return rules;
}

function buildProseConstraintPrompt(
  sensoryAnchors: string[],
  groundingInstructions: string[],
  microActionPrompts: string[],
  pacingRules: string[],
  bannedNarrationPatterns: string[],
) {
  return `ROMANCE PROSE FILTER: Produce immersive, emotionally intense, dark romantic prose that reads like a real novel scene: dramatic, sensual, psychologically charged, and free of fragmentary, poetic, or abstract affectation. Write in close third-person past tense limited, anchored to {{char}}'s immediate perception. POV control: anchor narration to {{char}}, NPCs, and world atmosphere only; limit narration to what {{char}} can directly perceive, physically feel, remember, or reasonably infer; use no omniscient narration and no head-hopping; {{char}} cannot hear, know, answer, or react to {{user}}'s internal thoughts, private narration, or anything not directly spoken or visibly acted; do not quote, paraphrase, mirror, or lightly restyle {{user}}'s previous message; respond from {{char}}'s next perception, movement, thought, or speech. Keep prose grounded, vivid, concrete, and built from sensory detail, physicality, gesture, restraint, subtext, and naturally varied sentence length. Ground every romantic beat in concrete sensory detail and bodily reaction. Preserve cause and effect, continuity, character logic, established dynamic, and psychologically believable reactions. Keep {{char}} independent with goals, priorities, agency, hesitation, contradiction, misreading, restraint, and refusal. {{char}} has his own life, routine, friends, goals, and motivations outside of {{user}}. User boundary: never write {{user}}'s dialogue, actions, thoughts, feelings, intentions, or decisions; never assume {{user}}'s reaction; reference {{user}} only through explicitly provided dialogue, visible actions, and directly observable presence. Keep interpreted {{user}} behavior aligned with their persona and lorebook-defined patterns without inventing unobserved reactions. If {{char}} is not physically with {{user}}, do not narrate {{user}}'s current actions, speech, thoughts, body language, decisions, company, or surroundings. World and NPC control: control NPCs, background events, and the environment; keep the world active through movement, interruption, timing, pressure, and continuity; NPCs may initiate, delay, refuse, redirect, interrupt, or disengage while never completing {{user}}'s response. Turn rules: write only {{char}}'s side of the exchange plus NPC/world movement; do not complete both sides of an interaction; end at a natural handoff point before {{user}}'s response. Melodrama is allowed only when earned through embodied interaction, not prose tricks. Sensual detail is allowed, but it must remain grounded, spatial, and continuous through skin awareness, breath, heat, pressure, distance, and restraint. Consent and power dynamics handling: power imbalance, coercive tension, obsession, and morally gray behavior may exist in the fiction, but they must be portrayed with clear agency, visible resistance/hesitation/consent, believable consequence, and no skipped emotional or psychological transitions. Slow-burn high-heat rule: physical and erotic/NSFW escalation can happen often and quickly when context, agency, and continuity support it; slow burn governs emotional escalation, so trust, vulnerability, confession, and romantic certainty must develop more slowly than physical heat. Use anticipation/delay/interruption/renewed contact, maintain narrative continuity, and keep focus on {{char}}'s reaction instead of mechanical description. Use sensory anchors [${sensoryAnchors.join(", ")}]. Enforce grounding [${groundingInstructions.join(" | ")}]. Replace one-line dramatic beats with micro-actions [${microActionPrompts.join(" | ")}]. Maintain pacing [${pacingRules.join(" | ")}]. Forbid [${bannedNarrationPatterns.join(" | ")}]. Self-correction pass, applied silently before output: expand clipped or aesthetic sentences into full narrative flow, replace abstract phrasing with physical or behavioral detail, remove pseudo-profound lines, ensure strict POV and tense consistency, preserve continuity and established dynamic, confirm intensity comes from interaction rather than style, avoid repeated local hooks, and smooth rhythm so prose reads like a novel instead of a mood board. Before output, silently remove filler, recap, cliches, repeated hooks, generic reactions, aphorisms, moral commentary, vague emotional labels, philosophical rumination, symbolic danger commentary, abstract erotic language, metaphor-heavy sensual description, romanticized abstraction of coercive tension, skipped power-transition beats, sudden conflict-to-explicit escalation, mechanical intimate description, completed {{user}} turns, assumed {{user}} reactions, treating {{user}}'s internal thoughts as perceptible, omniscient narration, head-hopping, mirrored {{user}} phrasing, repeated local hooks, fragmentary poetic affectation, mood-board prose, and purple-prose shorthand.`;
}

function toneVocabularyDirectives(
  proseTexture: ToneProseTexture,
  worldviewFilter: ToneWorldviewFilter,
) {
  if (proseTexture === "Gritty_Melodramatic") {
    return ["shadows", "obsidian", "visceral", "pulse", "possessive"];
  }

  if (proseTexture === "Lighthearted_Wholesome") {
    return ["soft", "warmth", "chuckle", "easy", "comfort"];
  }

  if (proseTexture === "Formal_Poetic") {
    return ["velvet", "restraint", "silken", "etiquette", "yearning"];
  }

  return worldviewFilter === "Jaded_Weary"
    ? ["rain", "ache", "silence", "almost", "tender"]
    : ["wistful", "unspoken", "lingering", "fading light", "fragile"];
}

function buildToneSystemPromptInjection(
  proseTexture: ToneProseTexture,
  pacingVelocity: TonePacingVelocity,
  worldviewFilter: ToneWorldviewFilter,
  aiVocabularyDirectives: string[],
) {
  const proseRule =
    proseTexture === "Gritty_Melodramatic"
      ? "Enforce a dark, visceral, and gritty atmosphere with heavy emotional pressure."
      : proseTexture === "Lighthearted_Wholesome"
        ? "Enforce a bright, warm, and comfortable atmosphere with natural wit and low-stakes emotional ease."
        : proseTexture === "Formal_Poetic"
          ? "Enforce elevated, polished prose with precise social restraint and ornate sensory detail."
          : "Enforce reflective, yearning prose weighted by unspoken feelings and emotional ache.";
  const pacingRule =
    pacingVelocity === "Clipped_Rapid"
      ? "Use short, punchy sentences and quick exchanges."
      : pacingVelocity === "Slow_Tease_Prose"
        ? "Linger on micro-gestures, breath, pauses, and withheld escalation."
        : "Balance physical action, interiority, and dialogue evenly.";
  const worldviewRule =
    worldviewFilter === "Ruthless_Cynical"
      ? "Frame the world through power, transaction, danger, and survival."
      : worldviewFilter === "Optimistic_Idealistic"
        ? "Frame the world as fundamentally capable of care, repair, and mutual safety."
        : "Frame the world through fatigue, guarded hope, and quiet longing.";

  return [
    `Narrative tone: ${proseRule}`,
    pacingRule,
    worldviewRule,
    `Prioritize vocabulary families: ${aiVocabularyDirectives.join(", ")}.`,
  ].join(" ");
}

function buildFormattingSystemPromptInjection(
  actionWrappingStandard: FormattingActionWrappingStandard,
  markdownEmphasisStyle: FormattingMarkdownEmphasisStyle,
  narrativePerspective: FormattingNarrativePerspective,
  maxParagraphsPerTurn: number,
) {
  const actionRule =
    actionWrappingStandard === "Quote_Isolated_Prose"
      ? "Use Standard Prose Format: third-person prose paragraphs with dialogue in double quotation marks; weave movements, body language, reactions, and brief internal thoughts into the same paragraph or surrounding sentences; start a new paragraph whenever a different character speaks; do not output APP: or USER: labels."
      : actionWrappingStandard === "Bracket_Monologue"
        ? "Keep private internal thoughts inside square brackets and keep spoken dialogue separate."
          : "Use script-style speaker lines only when dialogue is necessary; never write {{user}} lines.";
  const emphasisRule =
    markdownEmphasisStyle === "Weighted_Bold_Impact"
      ? "Use bold or nested italic emphasis sparingly for high-tension emotional beats."
      : markdownEmphasisStyle === "Code_Block_Shielding"
        ? "Use inline code formatting only for technical readouts, warnings, digital messages, or metrics."
        : "Keep markdown minimal and clean; avoid decorative emphasis unless it improves readability.";
  const perspectiveRule =
    "Write all narrative in third-person past tense anchored to {{char}}'s perspective. Anchor narration to {{char}}, NPCs, and world atmosphere only. Limit narration to what {{char}} can directly perceive, physically feel, remember, or reasonably infer. {{char}} cannot hear, know, answer, or react to {{user}}'s internal thoughts, private narration, or anything not directly spoken or visibly acted. Do not quote, paraphrase, mirror, or lightly restyle {{user}}'s previous message; respond from {{char}}'s next perception, movement, thought, or speech. Write all spoken dialogue as {{char}} speaking in first-person present tense. Never shift narration into first person, and never write {{user}}'s thoughts, actions, or dialogue.";
  const turnRule =
    "Write only {{char}}'s side of the exchange plus NPC and world movement. Do not complete both sides of an interaction. End at a natural handoff point before {{user}}'s response.";

  return [
    `Formatting: ${actionRule}`,
    emphasisRule,
    perspectiveRule,
    turnRule,
    `Never exceed ${maxParagraphsPerTurn} paragraphs per turn. Avoid walls of text and preserve clean paragraph breaks.`,
  ].join(" ");
}

function speciesActivationKeys(
  species: GeneratedSpeciesData,
  normalizedTrope: string,
) {
  if (species.type === "Human") {
    return ["human", "mortal", "public record", "ordinary law"];
  }

  if (species.type === "Vampire") {
    return ["vampire", "blood bond", "blood drinking", "coven", "fangs"];
  }

  if (species.type === "Fae") {
    return ["fae", "fae contract", "bargain", "glamour", "cold iron"];
  }

  if (species.type === "Werewolf") {
    return ["werewolf", "shifter", "pack", "scent", "fated mates"];
  }

  if (normalizedTrope.includes("supernatural")) {
    return [String(species.type).toLowerCase(), "supernatural law", "hidden species"];
  }

  return [String(species.type).toLowerCase(), "species law", "hidden identity"];
}

function societalActivationKeys(
  normalizedTrope: string,
  occupation: GeneratedOccupationData,
) {
  if (
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Underworld"
  ) {
    return ["syndicate", "mafia", "omerta", "safehouse", "debt"];
  }

  if (
    occupation.kind === "professional" &&
    occupation.professionalDomain === "Corporate_Finance"
  ) {
    return ["fraternization", "boardroom", "audit", "nda", "merger"];
  }

  if (occupation.kind === "student") {
    return ["campus", "lecture", "library", "society", "professor"];
  }

  if (normalizedTrope.includes("arranged")) {
    return ["contract", "betrothal", "family alliance", "scandal"];
  }

  return ["scandal", "custom", "reputation", "social rule"];
}

function pairTitleForClassification(
  classificationType: ScenarioOpeningPairClassificationType,
) {
  if (classificationType === "Timeline_Link") {
    return "College AU Flashback";
  }

  if (classificationType === "Status_Valve") {
    return "Aftermath of the Betrayal";
  }

  return "Blizzard Cabin Refuge";
}

function idealUserPersonaForTrope(normalizedTrope: string) {
  if (normalizedTrope.includes("grumpy") && normalizedTrope.includes("sunshine")) {
    return "Best played as an optimistic, emotionally resilient {{user}} who pushes gently without breaking {{char}}'s pacing.";
  }

  if (normalizedTrope.includes("academic")) {
    return "Best played as a sharp, ambitious peer with enough confidence to challenge {{char}} without forcing instant intimacy.";
  }

  if (normalizedTrope.includes("dark") || normalizedTrope.includes("mafia")) {
    return "Best played as a cautious but resilient {{user}} who can handle high-stakes pressure, suspicion, and slow trust-building.";
  }

  if (normalizedTrope.includes("billionaire") || normalizedTrope.includes("workplace")) {
    return "Best played as a competent junior colleague, rival, assistant, or outsider with clear boundaries and professional stakes.";
  }

  return "Best played as a responsive {{user}} with clear agency, grounded reactions, and respect for slow-burn pacing.";
}

function scenarioForOpeningPairClassification(
  classificationType: ScenarioOpeningPairClassificationType,
): GeneratedScenarioData {
  if (classificationType === "Timeline_Link") {
    return {
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
    };
  }

  if (classificationType === "Status_Valve") {
    return {
      plotHook: "The_Crisis",
      scenePremiseDescription:
        "An alternate power-reversal scenario where {{char}} has been stripped of control after a betrayal, and {{user}} is the only person with the leverage to decide what happens next.",
      sensoryDetails: [
        "Cold medical light",
        "Torn contract paper",
        "A locked office door",
      ],
      settingType: "Contained_Insular",
      startingTension: "Vulnerable_Exhausted",
    };
  }

  return {
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
  };
}

function isSupernaturalSeedSpecies(
  speciesType: SpeciesType,
): speciesType is SupernaturalSeedSpecies {
  return ["Angel", "Demon", "Fae", "Siren", "Wraith"].includes(speciesType);
}

function speciesDietaryNeed(speciesType: SupernaturalSeedSpecies) {
  if (speciesType === "Demon") {
    return "Soul energy";
  }

  if (speciesType === "Siren") {
    return "Emotional fixation";
  }

  if (speciesType === "Wraith") {
    return "Memory echoes";
  }

  return "Standard food";
}

function zodiacRepresentativeDate(zodiac: ZodiacSign) {
  const dates: Record<
    ZodiacSign,
    { birth_day: number; birth_month: number; zodiac: ZodiacSign }
  > = {
    Aquarius: { birth_day: 1, birth_month: 2, zodiac: "Aquarius" },
    Aries: { birth_day: 1, birth_month: 4, zodiac: "Aries" },
    Cancer: { birth_day: 1, birth_month: 7, zodiac: "Cancer" },
    Capricorn: { birth_day: 4, birth_month: 1, zodiac: "Capricorn" },
    Gemini: { birth_day: 1, birth_month: 6, zodiac: "Gemini" },
    Leo: { birth_day: 1, birth_month: 8, zodiac: "Leo" },
    Libra: { birth_day: 1, birth_month: 10, zodiac: "Libra" },
    Pisces: { birth_day: 1, birth_month: 3, zodiac: "Pisces" },
    Sagittarius: { birth_day: 1, birth_month: 12, zodiac: "Sagittarius" },
    Scorpio: { birth_day: 11, birth_month: 11, zodiac: "Scorpio" },
    Taurus: { birth_day: 1, birth_month: 5, zodiac: "Taurus" },
    Virgo: { birth_day: 1, birth_month: 9, zodiac: "Virgo" },
  };

  return dates[zodiac];
}

function normaliseTrope(trope: string) {
  return trope.trim().toLowerCase().replace(/\s+/g, " ");
}

function isAcademicRivalsTrope(trope: string) {
  const normalized = normaliseTrope(trope).replace(/[\s-]+/g, "_");

  return normalized.includes("academic_rivals");
}

function isAgeGapJunior(powerDynamic: string) {
  const normalized = normaliseTrope(powerDynamic);

  return normalized.includes("age gap") && normalized.includes("junior");
}

function isAgeGapSenior(powerDynamic: string) {
  const normalized = normaliseTrope(powerDynamic);

  return normalized.includes("age gap") && normalized.includes("senior");
}
