import type {
  CharacterCardData,
  GeneratedFrameworkConfigurationData,
} from "./generator";

export interface FrameworkSerializablePayload {
  alternative_greetings_array?: string[];
  behavioral_matrix?: string;
  current_scenario?: string;
  description?: string;
  first_message?: string;
  name: string;
}

export function createSerializedCardString(
  compiledPayload: FrameworkSerializablePayload,
  frameworkConfig: GeneratedFrameworkConfigurationData,
): string {
  if (frameworkConfig.targetSpecification === "V2_Card_Standard") {
    return JSON.stringify(
      {
        data: {
          alt_greetings: compiledPayload.alternative_greetings_array ?? [],
          description: compiledPayload.description ?? "",
          first_mes: compiledPayload.first_message ?? "",
          name: compiledPayload.name,
          personality: compiledPayload.behavioral_matrix ?? "",
          scenario: compiledPayload.current_scenario ?? "",
        },
        spec: "chara_card_v2",
        spec_version: "2.0",
      },
      null,
      2,
    );
  }

  if (frameworkConfig.targetSpecification === "V3_Card_Layout") {
    return JSON.stringify(
      {
        data: {
          alternate_greetings: compiledPayload.alternative_greetings_array ?? [],
          description: compiledPayload.description ?? "",
          first_mes: compiledPayload.first_message ?? "",
          name: compiledPayload.name,
          personality: compiledPayload.behavioral_matrix ?? "",
          scenario: compiledPayload.current_scenario ?? "",
        },
        spec: "chara_card_v3",
        spec_version: "3.0",
      },
      null,
      2,
    );
  }

  return JSON.stringify(
    {
      ...compiledPayload,
      framework: frameworkConfig,
    },
    null,
    2,
  );
}

export function createFrameworkSerializablePayload(
  cardData: CharacterCardData,
  greeting: string,
): FrameworkSerializablePayload {
  return {
    alternative_greetings_array: [
      ...(cardData.alternateGreetings ?? []).map(
        (alternateGreeting) => alternateGreeting.completedGreeting,
      ),
      ...(cardData.scenarioOpeningPairs ?? []).map(
        (pair) => pair.alternateFirstMessage,
      ),
    ].filter(Boolean),
    behavioral_matrix: [
      `Intimacy Style: ${cardData.intimacyStyle?.expressionType ?? "Unspecified"}`,
      `Kink Role: ${cardData.kink?.primaryRole ?? "Switch"}`,
      `Turn-offs: ${cardData.turnOffs?.behavioralTurnOffs.join(", ") ?? "None"}`,
    ].join("\n"),
    current_scenario: cardData.scenario?.scenePremiseDescription ?? "",
    description: cardData.lorebookSummary
      ? `${cardData.lorebookSummary.universeAnchor}\n${cardData.lorebookSummary.factionOrDynastyContext}`
      : "",
    first_message: greeting,
    name: `${cardData.given_name} ${cardData.surname}`,
  };
}
