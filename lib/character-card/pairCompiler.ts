import {
  CharacterCardData,
  generateScenarioOpeningPairData,
  GeneratedScenarioOpeningPairData,
  ScenarioOpeningPairClassificationType,
} from "./generator";

export function generateScenarioOpeningPair(
  characterConfig: CharacterCardData,
  targetPairType: ScenarioOpeningPairClassificationType,
): GeneratedScenarioOpeningPairData {
  return generateScenarioOpeningPairData(characterConfig, targetPairType);
}
