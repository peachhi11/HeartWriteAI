import {
  AgeGapRomanceOptions,
  CharacterCardData,
  CreatorsNotesContentRating,
  generateAgeGapRomance,
} from "./generator";
import { compileSystemPrompt } from "./promptCompiler";

export type BuildCharacterCardRequest = Omit<AgeGapRomanceOptions, "random">;

export type { CreatorsNotesContentRating };

export interface BuildCharacterCardResult {
  greeting: string;
  meta: CharacterCardData;
  systemPrompt: string;
}

export async function buildCharacterCard(
  request: BuildCharacterCardRequest = {},
): Promise<BuildCharacterCardResult> {
  return createCharacterCardBuildResult(request);
}

export function createCharacterCardBuildResult(
  request: BuildCharacterCardRequest = {},
): BuildCharacterCardResult {
  const trope = request.trope ?? "Generated Preview";
  const randomizedData = generateAgeGapRomance(trope, {
    ...request,
    trope,
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

  return {
    greeting,
    meta: randomizedData,
    systemPrompt,
  };
}
