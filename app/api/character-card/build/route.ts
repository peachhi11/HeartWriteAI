import { z } from "zod";

import { generateAgeGapRomance } from "@/lib/character-card/generator";
import { compileSystemPrompt } from "@/lib/character-card/promptCompiler";

const buildRequestSchema = z
  .object({
    alternateGreetings: z
      .array(
        z.object({
          aiGenerationDirective: z.string().trim().min(1),
          associatedTrope: z.string().trim().min(1),
          completedGreeting: z.string(),
          forkType: z.enum([
            "Timeline_Shift",
            "Universe_AU",
            "Tone_Escalation",
            "Canon_Divergence",
          ]),
          greetingId: z.string().uuid(),
        }),
      )
      .max(5)
      .optional(),
    archetype: z
      .object({
        aiBehaviorPrompt: z.string().trim().min(1),
        archetypeId: z.string().uuid(),
        coreMotivation: z.enum([
          "Security_Protection",
          "Security_Proximity",
          "Validation_Approval",
          "Autonomy_Freedom",
          "Peace_Quiet",
          "Vengeance_Claiming",
          "Vengeance_Redress",
        ]),
        defenseMechanism: z.enum([
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
        ]),
        personaType: z.enum([
          "The_Stoic_Wall",
          "The_Ruthless_Architect",
          "The_Broken_Heir",
          "The_Golden_Retriever",
          "The_Quiet_Guardian",
          "The_Rogue_Instigator",
          "The_Vigilante_Outcast",
          "The_Perfectionist",
          "The_Jaded_Veteran",
          "The_Ancient_Predator",
          "The_Fae_Deal_Maker",
        ]),
      })
      .optional(),
    anchorYear: z.number().int().min(1).optional(),
    creatorsNotes: z
      .object({
        contentRating: z.enum([
          "SFW_Wholesome",
          "M_Rated_Sensory",
          "X_Rated_Explicit",
          "Dark_Romance_Heavy",
        ]),
        idealUserPersona: z.string().trim().min(1),
        recommendedModels: z.array(z.string().trim().min(1)).min(1).max(5),
        technicalNotesText: z.string().trim().min(1),
        triggerWarnings: z.array(z.string().trim().min(1)).max(12),
      })
      .optional(),
    dialogueArrays: z
      .object({
        aiLinguisticConstraintPrompt: z.string().trim().min(1),
        arrayId: z.string().uuid(),
        dontVocabularyBlacklist: z.array(z.string().trim().min(1)).max(24),
        doVocabularyWhitelist: z.array(z.string().trim().min(1)).max(24),
        structuralDontRules: z.array(z.string().trim().min(1)).max(12),
        structuralDoRules: z.array(z.string().trim().min(1)).max(12),
      })
      .optional(),
    proseGuidance: z
      .object({
        bannedNarrationPatterns: z.array(z.string().trim().min(1)).max(12),
        groundingInstructions: z.array(z.string().trim().min(1)).max(12),
        guidanceId: z.string().uuid(),
        microActionPrompts: z.array(z.string().trim().min(1)).max(12),
        pacingRules: z.array(z.string().trim().min(1)).max(12),
        proseConstraintPrompt: z.string().trim().min(1),
        sensoryAnchors: z.array(z.string().trim().min(1)).max(12),
      })
      .optional(),
    ethnicityRegion: z
      .enum([
        "Northern_Western_European",
        "Southern_European",
        "Eastern_European_Slavic",
        "Diaspora_Blended",
      ])
      .optional(),
    fetish: z
      .object({
        aiDescriptiveFocus: z.string().trim().min(1),
        anatomicalFocus: z.enum([
          "None",
          "Feet_Footwear",
          "Thighs_Midriff",
          "Hair_Face",
          "Muscular_Texture",
        ]),
        fetishEnabled: z.boolean(),
        materialPreference: z.enum([
          "None",
          "Leather_Latex",
          "Uniforms_Suits",
          "Lace_Silk",
          "Eyewear_Chokers",
        ]),
        situationalTrigger: z.enum([
          "None",
          "Breeding_Claiming",
          "Exhibitionism_Risk",
          "Vulnerability_Sleep",
          "Sanguine_Biting",
        ]),
        sizeFantasyModifier: z.enum([
          "Standard_Scale",
          "Extreme_Height_Gap",
          "Micro_Macro_Scale",
        ]),
      })
      .optional(),
    firstMessage: z
      .object({
        aiOutputConstraint: z.string().trim().min(1),
        entryPoint: z.enum([
          "The_Approach",
          "Active_Collision",
          "Post_Crisis_Quiet",
          "Mid_Action_Dialogue",
        ]),
        literaryStyle: z.enum([
          "Action_Dialogue_Hybrid",
          "Internal_Monologue_Heavy",
          "Novella_Prose",
          "Chat_Symphonic",
        ]),
        tokenLengthCap: z.number().int().min(200).max(1_200),
        userCallToAction: z.enum([
          "Direct_Question",
          "Physical_Gesture",
          "Weighted_StandOff",
          "Vulnerable_Slip",
        ]),
      })
      .optional(),
    formatting: z
      .object({
        actionWrappingStandard: z.enum([
          "Quote_Isolated_Prose",
          "Bracket_Monologue",
          "Raw_Script",
        ]),
        formattingId: z.string().uuid(),
        formattingSystemPromptInjection: z.string().trim().min(1),
        markdownEmphasisStyle: z.enum([
          "Clean_Prose",
          "Weighted_Bold_Impact",
          "Code_Block_Shielding",
        ]),
        maxParagraphsPerTurn: z.number().int().min(1).max(12),
        narrativePerspective: z.enum([
          "Third_Person_Past",
          "Third_Person_Present",
          "Second_Person_Direct",
          "First_Person_I",
        ]),
      })
      .optional(),
    framework: z
      .object({
        frameworkId: z.string().uuid(),
        globalTokenSafetyBuffer: z.number().int().min(50).max(2_000),
        injectionPipelineRouter: z.enum([
          "Monolithic_System_Prompt",
          "Segmented_Placements",
          "Dynamic_Variable_Loop",
        ]),
        memoryBudgetStrategy: z.enum([
          "Ultra_Lean_Context",
          "Extended_Deep_Lore",
          "Dynamic_User_Sliders",
        ]),
        systemPromptJailbreakOverride: z.string().trim().min(1),
        targetSpecification: z.enum([
          "V2_Card_Standard",
          "V3_Card_Layout",
          "Raw_Agnostic_JSON",
          "Vercel_Structured_Zod",
        ]),
      })
      .optional(),
    groupGreetings: z
      .array(
        z.object({
          aiGroupDirective: z.string().trim().min(1),
          completedGreeting: z.string(),
          formattingStyle: z.enum([
            "Explicit_Name_Tags",
            "Paragraph_Isolated",
            "Choreographed",
          ]),
          greetingId: z.string().uuid(),
          interpersonalDynamic: z.enum([
            "Love_Triangle_Rivalry",
            "Wingman_Loop",
            "Hostile_Front",
            "Internal_Fracture",
          ]),
          participatingCharacters: z.array(z.string().trim().min(1)).min(2).max(4),
          spotlightDistribution: z.enum([
            "Ensemble_Equal",
            "Leader_Alpha",
            "Duo_Synergy",
            "User_Ambush",
          ]),
        }),
      )
      .max(5)
      .optional(),
    groupAlternateGreetings: z
      .array(
        z.object({
          aiMultiCharacterPrompt: z.string().trim().min(1),
          altGreetingId: z.string().uuid(),
          completedGreeting: z.string(),
          forkCategory: z.enum([
            "Team_Loyalty_Shift",
            "Collective_AU",
            "Group_Escalation_Climax",
          ]),
          includedNpcNames: z.array(z.string().trim().min(1)).min(2).max(4),
          targetSettingVibe: z.string().trim().min(1),
        }),
      )
      .max(5)
      .optional(),
    kink: z
      .object({
        intensityLevel: z.enum([
          "Mild_Vanilla",
          "Moderate_Sensory",
          "Intense_Heavy",
        ]),
        nsfwEnabled: z.boolean(),
        preferredSensoryTags: z.array(z.string().trim().min(1)).max(8),
        primaryRole: z.enum(["Dominant", "Submissive", "Switch", "Primal"]),
        systemPromptInstruction: z.string().trim().min(1),
      })
      .optional(),
    intimacyStyle: z
      .object({
        aftercareStyle: z.enum([
          "The_Nurturer",
          "The_Seeker",
          "The_Processor",
          "The_Confessor",
        ]),
        aiBehaviorPrompt: z.string().trim().min(1),
        expressionType: z.enum([
          "Intense_Devoted",
          "Playful_Teasing",
          "Stoic_Restrained",
          "Vulnerable_Yielding",
        ]),
        physicalLoveLanguage: z.enum([
          "Touch_Holding",
          "Acts_of_Service",
          "Verbal_Affirmation",
          "Protective_Proximity",
        ]),
        verbalCadence: z.enum([
          "Praise_Validation",
          "High_Intensity_Dirty",
          "Silent_Connection",
          "Hesitant_Reassurance",
        ]),
      })
      .optional(),
    linguisticMatrix: z
      .enum([
        "Anglophone",
        "Celtic / Gaelic",
        "Latinate / Romance",
        "Slavic / Cyrillic-Derived",
      ])
      .optional(),
    lorebookSummary: z
      .object({
        aiLoreInstruction: z.string().trim().min(1),
        factionOrDynastyContext: z.string().trim().min(1),
        tokenOptimizationCap: z.number().int().min(50).max(1_000),
        universeAnchor: z.string().trim().min(1),
        worldSystemRules: z.array(z.string().trim().min(1)).min(1).max(4),
      })
      .optional(),
    loreEntries: z
      .array(
        z.object({
          activationKeys: z.array(z.string().trim().min(1)).min(1).max(12),
          domainScope: z.enum([
            "Geopolitical_Faction",
            "Biographical_NPC",
            "Mythological_Rules",
            "Societal_Customs",
          ]),
          entryContent: z.string().trim().min(1),
          entryId: z.string().uuid(),
          insertionPriority: z.enum([
            "Constant_Anchor",
            "Reactive_Contextual",
            "Recursive_Linked",
          ]),
          title: z.string().trim().min(1),
          tokenReserveCost: z.number().int().min(25).max(1_000).default(100),
        }),
      )
      .max(20)
      .optional(),
    nationalityCountry: z.string().trim().min(1).optional(),
    nationalityLegalStatus: z
      .enum(["Native", "Dual_Citizen", "Expat_Visa", "Naturalized"])
      .optional(),
    nationalityLinguisticVibe: z.string().trim().min(1).optional(),
    nationalityRegionalAlliance: z
      .enum([
        "EU_Schengen",
        "Non_EU_European",
        "Western_Allies",
        "Fictional_Empire",
      ])
      .optional(),
    occupationAcademicYear: z
      .enum(["Freshman", "Sophomore", "Junior", "Senior", "Postgrad_PhD"])
      .optional(),
    occupationAuthorityDynamic: z
      .enum(["Superior", "Equal", "Subordinate", "Outsider"])
      .optional(),
    occupationCampusAffiliation: z.string().trim().min(1).optional(),
    occupationFundingType: z
      .enum(["Legacy_Trust", "Scholarship", "Self_Funded", "International"])
      .optional(),
    occupationJobTitle: z.string().trim().min(1).optional(),
    occupationMajorField: z
      .enum(["STEM_Medical", "Humanities_Law", "Arts_Design", "Athletics"])
      .optional(),
    occupationProfessionalDomain: z
      .enum([
        "Corporate_Finance",
        "Medical_Science",
        "Arts_Entertainment",
        "Security_Defense",
        "Underworld",
      ])
      .optional(),
    occupationSocioeconomicTier: z
      .enum([
        "Ultra_Elite",
        "High_Professional",
        "Creative_Public",
        "Working_Class",
        "Shadow_Economy",
      ])
      .optional(),
    occupationWorkplaceVibe: z.string().trim().min(1).optional(),
    powerDynamic: z.string().trim().min(1).optional(),
    postHistoryInstructions: z
      .object({
        driftControlRules: z.array(z.string().trim().min(1)).min(1).max(8),
        dynamicToneModifiers: z.array(z.string().trim().min(1)).min(1).max(8),
        formattingHardlines: z.array(z.string().trim().min(1)).min(1).max(8),
        injectionTokenWeight: z.number().int().min(10).max(500),
      })
      .optional(),
    worldLorePlaceholders: z
      .array(
        z.object({
          currentDataPayload: z.string().trim().min(1),
          isDynamic: z.boolean(),
          macroType: z.enum([
            "Environmental_Anchor",
            "Population_Baseline",
            "Legacy_Tag",
          ]),
          placeholderId: z.string().uuid(),
          variableKey: z.string().trim().regex(/^\{\{[a-z0-9_]+\}\}$/),
        }),
      )
      .max(12)
      .optional(),
    raceMacroGroup: z
      .enum([
        "White_Caucasian",
        "Black_African",
        "East_Southeast_Asian",
        "South_Central_Asian",
        "Indigenous_First_Nations",
        "Middle_Eastern_North_African",
        "Multiracial_Blended",
      ])
      .optional(),
    relationships: z
      .array(
        z.object({
          connectionType: z.enum([
            "Family_Lineage",
            "Found_Family",
            "Professional_Circle",
            "Antagonistic_Force",
          ]),
          emotionalStatus: z.enum([
            "Devoted_Loyal",
            "Strained_Fractured",
            "Estranged_Ghosted",
            "Dependent_Protected",
          ]),
          npcName: z.string().trim().min(1),
          oneLineDescription: z.string().trim().min(1),
          romanceFunction: z.enum([
            "The_Barrier",
            "The_Matchmaker",
            "The_Secret_Keeper",
            "The_Jealousy_Instigator",
          ]),
        }),
      )
      .max(3)
      .optional(),
    relationshipStatus: z
      .object({
        currentLabel: z.enum([
          "Single",
          "Betrothed_Promised",
          "Divorced_Separated",
          "Widowed",
          "It_Complicated",
        ]),
        emotionalAvailability: z.enum([
          "Fully_Open",
          "Guarded_Closed",
          "Lingering_Past",
          "Casual_Only",
        ]),
        scandalFactor: z.enum([
          "None",
          "Low_Gossip",
          "High_Taboo",
          "Career_Threatening",
        ]),
        statusContext: z.string().trim().min(1),
      })
      .optional(),
    scenario: z
      .object({
        plotHook: z.enum([
          "The_Chance_Encounter",
          "The_Crisis",
          "The_Mandate",
          "The_Secret_Transaction",
        ]),
        scenePremiseDescription: z.string().trim().min(1),
        sensoryDetails: z.array(z.string().trim().min(1)).max(8),
        settingType: z.enum([
          "Contained_Insular",
          "Corporate_Institutional",
          "Public_HighExposure",
          "Atmospheric_Wilderness",
        ]),
        startingTension: z.enum([
          "Combative_Friction",
          "Vulnerable_Exhausted",
          "Charged_Electric",
          "Formal_Chilling",
        ]),
      })
      .optional(),
    scenarioOpeningPairs: z
      .array(
        z.object({
          alternateFirstMessage: z.string().trim().min(1),
          alternateScenarioContext: z.object({
            plotHook: z.enum([
              "The_Chance_Encounter",
              "The_Crisis",
              "The_Mandate",
              "The_Secret_Transaction",
            ]),
            scenePremiseDescription: z.string().trim().min(1),
            sensoryDetails: z.array(z.string().trim().min(1)).max(8),
            settingType: z.enum([
              "Contained_Insular",
              "Corporate_Institutional",
              "Public_HighExposure",
              "Atmospheric_Wilderness",
            ]),
            startingTension: z.enum([
              "Combative_Friction",
              "Vulnerable_Exhausted",
              "Charged_Electric",
              "Formal_Chilling",
            ]),
          }),
          classificationType: z.enum([
            "Environmental_Anchor",
            "Timeline_Link",
            "Status_Valve",
          ]),
          pairId: z.string().uuid(),
          pairTitle: z.string().trim().min(1),
        }),
      )
      .max(5)
      .optional(),
    speechExamples: z
      .array(
        z.object({
          category: z.enum([
            "Greeting",
            "Conflict",
            "Care",
            "Boundary",
            "Romantic_Tension",
          ]),
          exampleId: z.string().uuid(),
          exampleLine: z.string().trim().min(1),
          state: z.enum([
            "Calm",
            "Furious",
            "Defensive",
            "Exhausted",
            "Public",
            "Alone_With_User",
            "Intimate",
            "Cornered",
            "Possessive",
            "Guilty",
          ]),
          stateLabel: z.string().trim().min(1),
          usageContext: z.string().trim().min(1),
        }),
      )
      .max(5)
      .optional(),
    speechStyle: z
      .object({
        addressStyle: z.enum([
          "No_Pet_Names",
          "Selective_Endearments",
          "Formal_Address",
          "Teasing_Nicknames",
          "Possessive_Terms",
        ]),
        dialogueTagsWhitelist: z.array(z.string().trim().min(1)).min(1).max(8),
        dialogueDonts: z.array(z.string().trim().min(1)).max(8),
        dialogueDos: z.array(z.string().trim().min(1)).max(8),
        emotionalDelivery: z.enum([
          "Formal",
          "Monotone",
          "Clinical",
          "Affectionate",
          "Soothing",
          "Playful",
          "Sarcastic",
          "Curt",
          "Gravely_Serious",
          "Seductive",
        ]),
        linguisticFlavor: z.enum([
          "Vernacular_Slang",
          "Jargon_Infused",
          "L1_Interference",
          "Neutral_MidAtlantic",
        ]),
        physicalMannerisms: z
          .array(
            z.enum([
              "Eye_Contact_Avoidance",
              "Nose_Pinch",
              "Space_Invasion",
              "Lip_Chewing",
            ]),
          )
          .max(4),
        pitch: z.enum(["Deep", "Baritone", "Mid_Range", "High_Pitched"]),
        register: z.enum([
          "Clipped_Command",
          "Velvet_Formal",
          "Playful_Banter",
          "Soft_Reassurance",
          "Academic_Precise",
          "Predatory_Quiet",
        ]),
        speechPatternInstruction: z.string().trim().min(1),
        speechSystemPromptInjection: z.string().trim().min(1),
        styleId: z.string().uuid(),
        syntaxCadence: z.enum([
          "Laconic_Clipped",
          "Ornate_Sesquipedalian",
          "Banter_Fast",
          "Staccato_Tension",
        ]),
        texture: z.enum(["Raspy", "Smooth", "Breathy", "Hoarse", "Nasal"]),
        vocalHabits: z
          .array(
            z.enum(["Pet_Names", "Trailing_Off", "Vocal_Fry", "Stuttering"]),
          )
          .max(4),
        volumeBaseline: z.enum(["Booming", "Soft_Spoken", "Measured"]),
        vocalRegister: z.enum([
          "Muted_Whisper",
          "Vocal_Masking",
          "Dynamic_Range_Shift",
        ]),
        vocabularyMode: z.enum([
          "Sparse_Minimal",
          "Romantic_Lyrical",
          "Witty_Teasing",
          "Technical_Precise",
          "Courtly_Formal",
        ]),
      })
      .optional(),
    tone: z
      .object({
        aiVocabularyDirectives: z.array(z.string().trim().min(1)).min(1).max(12),
        pacingVelocity: z.enum([
          "Clipped_Rapid",
          "Measured_Deliberate",
          "Slow_Tease_Prose",
        ]),
        proseTexture: z.enum([
          "Gritty_Melodramatic",
          "Lighthearted_Wholesome",
          "Angsty_Melancholic",
          "Formal_Poetic",
        ]),
        toneId: z.string().uuid(),
        toneSystemPromptInjection: z.string().trim().min(1),
        worldviewFilter: z.enum([
          "Ruthless_Cynical",
          "Optimistic_Idealistic",
          "Jaded_Weary",
        ]),
      })
      .optional(),
    speciesType: z
      .enum([
        "Human",
        "Vampire",
        "Werewolf",
        "Fae",
        "Demon",
        "Angel",
        "Siren",
        "Wraith",
      ])
      .optional(),
    trope: z.string().trim().min(1).optional(),
    turnOffs: z
      .object({
        aiReactionPrompt: z.string().trim().min(1),
        behavioralTurnOffs: z.array(z.string().trim().min(1)).max(8),
        dynamicHardlines: z.enum([
          "No_Role_Reversal",
          "No_Rushed_Pacing",
          "No_Unprompted_Aggression",
        ]),
        sensoryTurnOffs: z.array(z.string().trim().min(1)).max(8),
      })
      .optional(),
  })
  .optional();

export async function POST(request: Request) {
  const requestBody = await request.json().catch(() => undefined);
  const requestResult = buildRequestSchema.safeParse(requestBody);

  if (!requestResult.success) {
    return Response.json(
      { error: "Invalid character build request." },
      { status: 400 },
    );
  }

  const trope = requestResult.data?.trope ?? "Generated Preview";
  const randomizedData = generateAgeGapRomance(trope, {
    alternateGreetings: requestResult.data?.alternateGreetings,
    archetype: requestResult.data?.archetype,
    anchorYear: requestResult.data?.anchorYear,
    creatorsNotes: requestResult.data?.creatorsNotes,
    dialogueArrays: requestResult.data?.dialogueArrays,
    ethnicityRegion: requestResult.data?.ethnicityRegion,
    fetish: requestResult.data?.fetish,
    firstMessage: requestResult.data?.firstMessage,
    formatting: requestResult.data?.formatting,
    framework: requestResult.data?.framework,
    groupAlternateGreetings: requestResult.data?.groupAlternateGreetings,
    groupGreetings: requestResult.data?.groupGreetings,
    intimacyStyle: requestResult.data?.intimacyStyle,
    kink: requestResult.data?.kink,
    linguisticMatrix: requestResult.data?.linguisticMatrix,
    loreEntries: requestResult.data?.loreEntries,
    lorebookSummary: requestResult.data?.lorebookSummary,
    nationalityCountry: requestResult.data?.nationalityCountry,
    nationalityLegalStatus: requestResult.data?.nationalityLegalStatus,
    nationalityLinguisticVibe: requestResult.data?.nationalityLinguisticVibe,
    nationalityRegionalAlliance: requestResult.data?.nationalityRegionalAlliance,
    occupationAcademicYear: requestResult.data?.occupationAcademicYear,
    occupationAuthorityDynamic: requestResult.data?.occupationAuthorityDynamic,
    occupationCampusAffiliation: requestResult.data?.occupationCampusAffiliation,
    occupationFundingType: requestResult.data?.occupationFundingType,
    occupationJobTitle: requestResult.data?.occupationJobTitle,
    occupationMajorField: requestResult.data?.occupationMajorField,
    occupationProfessionalDomain: requestResult.data?.occupationProfessionalDomain,
    occupationSocioeconomicTier: requestResult.data?.occupationSocioeconomicTier,
    occupationWorkplaceVibe: requestResult.data?.occupationWorkplaceVibe,
    powerDynamic: requestResult.data?.powerDynamic,
    postHistoryInstructions: requestResult.data?.postHistoryInstructions,
    proseGuidance: requestResult.data?.proseGuidance,
    raceMacroGroup: requestResult.data?.raceMacroGroup,
    relationshipStatus: requestResult.data?.relationshipStatus,
    relationships: requestResult.data?.relationships,
    scenario: requestResult.data?.scenario,
    scenarioOpeningPairs: requestResult.data?.scenarioOpeningPairs,
    speciesType: requestResult.data?.speciesType,
    speechExamples: requestResult.data?.speechExamples,
    speechStyle: requestResult.data?.speechStyle,
    tone: requestResult.data?.tone,
    trope,
    turnOffs: requestResult.data?.turnOffs,
    worldLorePlaceholders: requestResult.data?.worldLorePlaceholders,
  });
  const fullName = `${randomizedData.given_name} ${randomizedData.surname}`;
  const speciesHook =
    randomizedData.species && randomizedData.species.type !== "Human"
      ? ` Their ${randomizedData.species.instinctualTrait.toLowerCase()} makes the silence feel dangerous.`
      : "";
  const nationalityHook = randomizedData.nationality
    ? ` The cadence carries ${randomizedData.nationality.passportCountry} civic ease: ${randomizedData.nationality.linguisticVibe}`
    : "";
  const occupationHook = randomizedData.occupation
    ? ` The backdrop is ${randomizedData.occupation.workplaceVibe}.`
    : "";
  const relationshipHook = randomizedData.relationships?.length
    ? ` ${randomizedData.relationships[0].npcName} is already close enough to complicate everything: ${randomizedData.relationships[0].oneLineDescription}`
    : "";
  const availabilityHook = randomizedData.relationshipStatus
    ? ` Their availability is ${randomizedData.relationshipStatus.currentLabel.replace(/_/g, " ").toLowerCase()}: ${randomizedData.relationshipStatus.statusContext}`
    : "";
  const kinkHook =
    randomizedData.kink?.nsfwEnabled && randomizedData.kink.systemPromptInstruction
      ? ` Private intimacy guidance: ${randomizedData.kink.systemPromptInstruction}`
      : "";
  const fetishHook =
    randomizedData.fetish?.fetishEnabled &&
    randomizedData.fetish.aiDescriptiveFocus
      ? ` Private fixation focus: ${randomizedData.fetish.aiDescriptiveFocus}`
      : "";
  const intimacyHook = randomizedData.intimacyStyle
    ? ` Intimacy style: ${randomizedData.intimacyStyle.aiBehaviorPrompt}`
    : "";
  const turnOffHook = randomizedData.turnOffs
    ? ` Boundary reaction: ${randomizedData.turnOffs.aiReactionPrompt}`
    : "";
  const speechHook = randomizedData.speechStyle
    ? ` Speech style: ${randomizedData.speechStyle.speechPatternInstruction}`
    : "";
  const dialogueHook = randomizedData.dialogueArrays
    ? ` Dialogue filter: ${randomizedData.dialogueArrays.aiLinguisticConstraintPrompt}`
    : "";
  const proseHook = randomizedData.proseGuidance
    ? ` Prose grounding: ${randomizedData.proseGuidance.proseConstraintPrompt}`
    : "";
  const firstMessageHook = randomizedData.firstMessage
    ? ` The opening starts as ${randomizedData.firstMessage.entryPoint.replace(/_/g, " ").toLowerCase()} and ends with ${randomizedData.firstMessage.userCallToAction.replace(/_/g, " ").toLowerCase()}.`
    : "";
  const scenarioHook = randomizedData.scenario
    ? ` ${randomizedData.scenario.scenePremiseDescription} The space tastes like ${randomizedData.scenario.sensoryDetails.join(", ").toLowerCase()}.`
    : "";
  const systemPrompt = compileSystemPrompt(randomizedData);
  const greeting = [
    `{{char}} pauses at the edge of the room, the name ${fullName} carrying more weight than either of you expected.${scenarioHook}${firstMessageHook}${speciesHook}${nationalityHook}${occupationHook}${relationshipHook}${availabilityHook}${kinkHook}${fetishHook}${intimacyHook}${turnOffHook}${speechHook}${dialogueHook}${proseHook}`,
    `"You should probably decide now if you're going to run from this," they say, voice controlled enough to sound calm and tense enough to betray them, "because I am already deciding not to."`,
  ].join("\n\n");

  return Response.json({
    greeting,
    meta: randomizedData,
    systemPrompt,
  });
}
