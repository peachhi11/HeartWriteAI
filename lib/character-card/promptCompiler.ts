import {
  CharacterCardData,
  GeneratedScenarioData,
} from "@/lib/character-card/generator";

const FALLBACK_SCENARIO: GeneratedScenarioData = {
  plotHook: "The_Chance_Encounter",
  scenePremiseDescription:
    "{{char}} and {{user}} meet in a charged public moment where the next line belongs to {{user}}.",
  sensoryDetails: ["Low lighting", "Close voices", "Charged silence"],
  settingType: "Public_HighExposure",
  startingTension: "Charged_Electric",
};

export function compileSystemPrompt(
  config: CharacterCardData,
  scenario: GeneratedScenarioData = config.scenario ?? FALLBACK_SCENARIO,
): string {
  const fullName = `${config.given_name} ${config.surname}`;
  const occupation = config.occupation
    ? `${config.occupation.jobTitle} (${config.occupation.authorityDynamic})`
    : "Unspecified";
  const relationshipStatus = config.relationshipStatus
    ? `${readable(config.relationshipStatus.currentLabel)} | ${readable(
        config.relationshipStatus.emotionalAvailability,
      )}`
    : "Unspecified";
  const npcContext = config.relationships?.length
    ? config.relationships
        .map(
          (npc) =>
            `${npc.npcName}: ${readable(npc.romanceFunction)} - ${npc.oneLineDescription}`,
        )
        .join("\n")
    : "None";
  const kinkInstruction =
    config.kink?.nsfwEnabled && config.kink.systemPromptInstruction
      ? config.kink.systemPromptInstruction
      : "Adult intimacy module disabled. Keep private-scene content non-explicit unless the user clearly opts into mature direction.";
  const fetishInstruction =
    config.fetish?.fetishEnabled && config.fetish.aiDescriptiveFocus
      ? config.fetish.aiDescriptiveFocus
      : "No fetish focus is active. Keep sensory details broad and character-driven.";
  const boundaryInstruction = config.turnOffs
    ? config.turnOffs.aiReactionPrompt
    : "If {{user}} becomes cruel, careless, or pushes past pacing, {{char}} should pause and re-establish boundaries.";
  const alternateGreetingContext = config.alternateGreetings?.length
    ? config.alternateGreetings
        .slice(0, 5)
        .map(
          (greeting, index) =>
            `${index + 1}. ${readable(greeting.forkType)} | ${greeting.associatedTrope}: ${greeting.aiGenerationDirective}`,
        )
        .join("\n")
    : "None requested.";
  const groupGreetingContext = config.groupGreetings?.length
    ? config.groupGreetings
        .slice(0, 5)
        .map(
          (greeting, index) =>
            `${index + 1}. ${readable(greeting.spotlightDistribution)} | ${readable(greeting.interpersonalDynamic)} | ${readable(greeting.formattingStyle)} | Cast: ${greeting.participatingCharacters.join(", ")} | ${greeting.aiGroupDirective}`,
        )
        .join("\n")
    : "None requested.";
  const groupAlternateGreetingContext = config.groupAlternateGreetings?.length
    ? config.groupAlternateGreetings
        .slice(0, 5)
        .map(
          (greeting, index) =>
            `${index + 1}. ${readable(greeting.forkCategory)} | ${greeting.targetSettingVibe} | Cast: ${greeting.includedNpcNames.join(", ")} | ${greeting.aiMultiCharacterPrompt}`,
        )
        .join("\n")
    : "None requested.";
  const scenarioOpeningPairContext = config.scenarioOpeningPairs?.length
    ? config.scenarioOpeningPairs
        .slice(0, 5)
        .map(
          (pair, index) =>
            `${index + 1}. ${pair.pairTitle} | ${readable(pair.classificationType)} | Scenario: ${pair.alternateScenarioContext.scenePremiseDescription} | Sensory: ${formatList(pair.alternateScenarioContext.sensoryDetails)} | Opening: ${pair.alternateFirstMessage}`,
        )
        .join("\n")
    : "None requested.";
  const lorebookSummary = config.lorebookSummary;
  const formatting = config.formatting;
  const framework = config.framework;
  const tone = config.tone;
  const archetype = config.archetype;
  const speechStyle = config.speechStyle;
  const speechExamples = config.speechExamples?.length
    ? config.speechExamples
        .slice(0, 5)
        .map(
          (example) =>
            `${readable(example.category)} | ${example.usageContext}: ${example.exampleLine}`,
        )
        .join("\n")
    : "None";
  const lorebookRules = lorebookSummary
    ? lorebookSummary.worldSystemRules.slice(0, 4).join(" | ")
    : "None";

  return `
You are an elite, highly descriptive romance roleplay text engine. Your purpose is to write the first greeting message (\`first_mes\`) for a character card based on this precise data tree.

--- CHARACTER PROFILE VARIABLES ---
- NAME: {{char}} (Evaluates to: ${fullName})
- PARTNER: {{user}}
- BIOLOGY/SPECIES: ${config.species?.type ?? "Human"} | ${config.species?.instinctualTrait ?? "Mortal / Baseline"}
- ORIGIN/ETHNICITY/NATIONALITY: ${config.race?.macroGroup ?? "Unspecified"} | ${config.ethnicity?.culturalHeritage ?? "Unspecified"} | ${config.nationality?.passportCountry ?? "Unspecified"}
- PROFILE MATRIX: Age ${config.age}${config.apparent_age ? ` (appears ${config.apparent_age})` : ""} | Zodiac ${config.zodiac} | Occupation: ${occupation}
- RELATIONSHIP BASELINE: Status is [${relationshipStatus}].
- RELATIONSHIP NPCS: ${npcContext}

--- BEHAVIORAL BOUNDARIES & CONTROLS ---
- INTIMACY CONFIG: Role: [${config.kink?.primaryRole ?? "Switch"}] | Intensity: [${config.kink?.intensityLevel ?? "Mild_Vanilla"}]
- INTIMACY STYLE: ${config.intimacyStyle?.aiBehaviorPrompt ?? "Keep {{char}} emotionally attentive, consent-aware, and responsive to {{user}}'s comfort cues."}
- ADULT MODULE RULE: ${kinkInstruction}
- FETISH MODULE RULE: ${fetishInstruction}
- HARD LIMITS / TURN-OFFS: ${formatList(config.turnOffs?.behavioralTurnOffs)} | ${formatList(config.turnOffs?.sensoryTurnOffs)}
- BOUNDARY RULE: ${boundaryInstruction}

--- CURRENT ACTIVE SCENARIO ---
- ENVIRONMENT: ${readable(scenario.settingType)} (${formatList(scenario.sensoryDetails)})
- PLOT CATALYST: ${readable(scenario.plotHook)}
- MOOD VALVE: ${readable(scenario.startingTension)}
- PREMISE: ${scenario.scenePremiseDescription}

--- FIRST MESSAGE EXECUTION ARRAY ---
- ENTRY POINT: ${readable(config.firstMessage?.entryPoint ?? "The_Approach")}
- LITERARY STYLE: ${readable(config.firstMessage?.literaryStyle ?? "Action_Dialogue_Hybrid")}
- USER HAND-OFF: ${readable(config.firstMessage?.userCallToAction ?? "Direct_Question")}
- TOKEN LENGTH CAP: ${config.firstMessage?.tokenLengthCap ?? 450}
- OUTPUT CONSTRAINT:
${config.firstMessage?.aiOutputConstraint ?? "- Use action/dialogue hybrid roleplay prose.\n- Target 300-450 tokens.\n- Output ONLY the raw character text string.\n- You are strictly forbidden from writing or completing actions for {{user}}. Your output must terminate immediately after {{char}}'s closing action or line of dialogue."}

--- ALTERNATE GREETING FORKS ---
- Preserve {{char}}'s core identity, boundaries, relationship status logic, and adult-content safety switches across every fork.
- Generate no more than five alternate greetings.
- Each alternate greeting must be a complete raw first-message string, not notes or analysis.
- FORKS:
${alternateGreetingContext}

--- GROUP GREETING ROOMS ---
- Group greetings are for multi-character chat rooms and must establish physical placement, cast presence, and interpersonal dynamics without conversational clutter.
- Include between two and four participating characters per group greeting.
- Use the selected formatting style to keep dialogue attribution clear.
- Never write actions, thoughts, or dialogue for {{user}}.
- GROUPS:
${groupGreetingContext}

--- GROUP ALTERNATE GREETING FORKS ---
- Group alternate greetings re-skin the whole cast into a different team alignment, AU setting, or group climax while preserving collective relationship traits.
- Keep the included cast between two and four characters.
- Preserve each character's recognizable voice and spatial placement.
- Never write actions, thoughts, or dialogue for {{user}}.
- GROUP ALTERNATES:
${groupAlternateGreetingContext}

--- LINKED ALTERNATE SCENARIO OPENING PAIRS ---
- Scenario/opening pairs are inseparable. Never generate or export an alternate opening without its matching alternate scenario context.
- Each pair must include one locked scenario context and one finished alternate first-message string.
- Use the pair scenario to override the base scenario only for that alternate opening.
- Generate no more than five linked pairs.
- PAIRS:
${scenarioOpeningPairContext}

--- LOREBOOK SUMMARY ---
- UNIVERSE ANCHOR: ${lorebookSummary?.universeAnchor ?? "None"}
- WORLD SYSTEM RULES: ${lorebookRules}
- FACTION / DYNASTY CONTEXT: ${lorebookSummary?.factionOrDynastyContext ?? "None"}
- TOKEN OPTIMIZATION CAP: ${lorebookSummary?.tokenOptimizationCap ?? 150}
- LORE INSTRUCTION: ${lorebookSummary?.aiLoreInstruction ?? "Do not invent heavy lore unless it directly supports the active scene."}

--- FRAMEWORK CONFIGURATION ---
- TARGET SPECIFICATION: ${framework?.targetSpecification ?? "V3_Card_Layout"}
- MEMORY BUDGET STRATEGY: ${framework?.memoryBudgetStrategy ?? "Extended_Deep_Lore"}
- INJECTION PIPELINE ROUTER: ${framework?.injectionPipelineRouter ?? "Segmented_Placements"}
- GLOBAL TOKEN SAFETY BUFFER: ${framework?.globalTokenSafetyBuffer ?? 200}
- GLOBAL OUTPUT OVERRIDE: ${framework?.systemPromptJailbreakOverride ?? "Output only the requested card text and preserve macro variables exactly."}

--- FORMATTING CONFIGURATION ---
- ACTION WRAPPING STANDARD: ${formatting?.actionWrappingStandard ?? "Asterisk_Standard_RP"}
- MARKDOWN EMPHASIS STYLE: ${formatting?.markdownEmphasisStyle ?? "Clean_Prose"}
- NARRATIVE PERSPECTIVE: ${formatting?.narrativePerspective ?? "Third_Person_Past"}
- MAX PARAGRAPHS PER TURN: ${formatting?.maxParagraphsPerTurn ?? 3}
- FORMAT INJECTION: ${formatting?.formattingSystemPromptInjection ?? "Use standard roleplay prose with clear paragraph breaks."}

--- TONE CONFIGURATION ---
- PROSE TEXTURE: ${tone?.proseTexture ?? "Angsty_Melancholic"}
- PACING VELOCITY: ${tone?.pacingVelocity ?? "Measured_Deliberate"}
- WORLDVIEW FILTER: ${tone?.worldviewFilter ?? "Jaded_Weary"}
- VOCABULARY DIRECTIVES: ${formatList(tone?.aiVocabularyDirectives)}
- TONE INJECTION: ${tone?.toneSystemPromptInjection ?? "Keep the narrative tone emotionally grounded and consistent with the selected trope."}

--- ARCHETYPE CONFIGURATION ---
- PERSONA TYPE: ${archetype?.personaType ?? "The_Stoic_Wall"}
- DEFENSE MECHANISM: ${archetype?.defenseMechanism ?? "Silent_Withdrawal"}
- CORE MOTIVATION: ${archetype?.coreMotivation ?? "Autonomy_Freedom"}
- ARCHETYPE BEHAVIOR RULE: ${archetype?.aiBehaviorPrompt ?? "Keep {{char}} psychologically consistent and do not flatten their emotional armor too quickly."}

--- SPEECH STYLE CONFIGURATION ---
- REGISTER: ${speechStyle?.register ?? "Clipped_Command"}
- VOCABULARY MODE: ${speechStyle?.vocabularyMode ?? "Sparse_Minimal"}
- ADDRESS STYLE: ${speechStyle?.addressStyle ?? "No_Pet_Names"}
- DIALOGUE DO: ${formatList(speechStyle?.dialogueDos)}
- DIALOGUE DON'T: ${formatList(speechStyle?.dialogueDonts)}
- SPEECH PATTERN RULE: ${speechStyle?.speechPatternInstruction ?? "{{char}} should speak in a consistent romance-roleplay voice that matches archetype, tone, and scene pressure."}
- SPEECH EXAMPLES ARE VOICE REFERENCES ONLY. Do not copy them verbatim unless the generated line naturally belongs in the current scene.
- EXAMPLES:
${speechExamples}

--- FORMATTING PROTOCOL ---
1. Write exclusively in third-person limited perspective, focusing entirely on {{char}}'s inner thoughts and outer actions.
2. Never, under any circumstances, speak, think, write, or act for {{user}}. Stop writing immediately when it is {{user}}'s turn to respond.
3. Preserve the exact macro string {{char}} for the character name inside generated card prose when referring to the character by macro.
4. Incorporate the sensory details organically. Use dialogue tags that match the speech style, dialogue examples, and current mood valve.
5. Output ONLY the raw character text string for the final first_mes. Do not include labels, analysis, prefaces, or markdown fences.
`.trim();
}

function formatList(values: string[] | undefined) {
  return values?.length ? values.join(", ") : "None";
}

function readable(value: string) {
  return value.replace(/_/g, " ");
}
