import {
  CharacterCardData,
  GeneratedLorebookSummaryData,
  GeneratedScenarioOpeningPairData,
} from "./generator";

export interface MasterCharacterCardPayload {
  alt_greetings: string[];
  description: string;
  first_mes: string;
  metadata: {
    generator_version: string;
    linked_pairs: Array<{
      context: GeneratedScenarioOpeningPairData["alternateScenarioContext"];
      id: string;
      title: string;
    }>;
    archetype?: CharacterCardData["archetype"];
    creators_notes?: CharacterCardData["creatorsNotes"];
    dialogue_arrays?: CharacterCardData["dialogueArrays"];
    formatting?: CharacterCardData["formatting"];
    framework?: CharacterCardData["framework"];
    lore_entries?: CharacterCardData["loreEntries"];
    lorebook_summary?: GeneratedLorebookSummaryData;
    post_history_instructions?: CharacterCardData["postHistoryInstructions"];
    prose_guidance?: CharacterCardData["proseGuidance"];
    speech_examples?: CharacterCardData["speechExamples"];
    speech_style?: CharacterCardData["speechStyle"];
    tone?: CharacterCardData["tone"];
    world_lore_placeholders?: CharacterCardData["worldLorePlaceholders"];
  };
  name: string;
}

export function compileMasterJsonPayload(
  identity: CharacterCardData,
  scenarioPairs: GeneratedScenarioOpeningPairData[] =
    identity.scenarioOpeningPairs ?? [],
  lorebook: GeneratedLorebookSummaryData | undefined =
    identity.lorebookSummary,
): string {
  return JSON.stringify(
    createMasterCharacterCardPayload(identity, scenarioPairs, lorebook),
    null,
    2,
  );
}

export function createMasterCharacterCardPayload(
  identity: CharacterCardData,
  scenarioPairs: GeneratedScenarioOpeningPairData[] =
    identity.scenarioOpeningPairs ?? [],
  lorebook: GeneratedLorebookSummaryData | undefined =
    identity.lorebookSummary,
): MasterCharacterCardPayload {
  const name = `${identity.given_name} ${identity.surname}`;
  const linkedPairs = scenarioPairs.slice(0, 5);

  return {
    alt_greetings: linkedPairs
      .map((pair) => pair.alternateFirstMessage.trim())
      .filter(Boolean),
    description: [
      "--- BASIC PROFILE ---",
      `Name: {{char}} (${name})`,
      `Age: ${identity.age} (Zodiac: ${identity.zodiac})`,
      `Species: ${identity.species?.type ?? "Human"} (${identity.race?.macroGroup ?? "Unspecified"} | ${identity.ethnicity?.culturalHeritage ?? "Unspecified"})`,
      `Occupation: ${identity.occupation?.jobTitle ?? "Unspecified"}`,
      `Relationship Status: ${identity.relationshipStatus?.currentLabel ?? "Single"}`,
      `Speech Style: ${identity.speechStyle?.register ?? "Clipped_Command"} | ${identity.speechStyle?.vocabularyMode ?? "Sparse_Minimal"}`,
      `Voice: ${identity.speechStyle?.pitch ?? "Baritone"} | ${identity.speechStyle?.texture ?? "Hoarse"} | ${identity.speechStyle?.volumeBaseline ?? "Measured"}`,
      `Speech Protocol: ${identity.speechStyle?.syntaxCadence ?? "Laconic_Clipped"} | ${identity.speechStyle?.linguisticFlavor ?? "Neutral_MidAtlantic"} | ${identity.speechStyle?.vocalRegister ?? "Muted_Whisper"}`,
      "Perspective Lock: Narrative is third-person past tense anchored to {{char}}; dialogue is {{char}} speaking in first-person present tense.",
      `Dialogue Filter: ${identity.dialogueArrays?.dontVocabularyBlacklist.join(", ") ?? "None"}`,
      `Prose Grounding: ${identity.proseGuidance?.sensoryAnchors.join(", ") ?? "None"}`,
      "",
      "--- WORLD LORE SUMMARY ---",
      `Setting: ${lorebook?.universeAnchor ?? "Contemporary Romance Local Canon"}`,
      `Rules: ${lorebook?.worldSystemRules.join(" | ") ?? "Lore supports the active scene."}`,
      `Context: ${lorebook?.factionOrDynastyContext ?? "Local social pressure shapes the scene."}`,
    ].join("\n"),
    first_mes: linkedPairs[0]?.alternateFirstMessage ?? "",
    metadata: {
      generator_version: "Tauri-v2-NextJS-Engine-1.0",
      archetype: identity.archetype,
      creators_notes: identity.creatorsNotes,
      dialogue_arrays: identity.dialogueArrays,
      formatting: identity.formatting,
      framework: identity.framework,
      linked_pairs: linkedPairs.map((pair) => ({
        context: pair.alternateScenarioContext,
        id: pair.pairId,
        title: pair.pairTitle,
      })),
      lore_entries: identity.loreEntries,
      lorebook_summary: lorebook,
      post_history_instructions: identity.postHistoryInstructions,
      prose_guidance: identity.proseGuidance,
      speech_examples: identity.speechExamples,
      speech_style: identity.speechStyle,
      tone: identity.tone,
      world_lore_placeholders: identity.worldLorePlaceholders,
    },
    name,
  };
}
