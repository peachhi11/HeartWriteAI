import { CharacterCardAlternateOpening } from "../../types/character-card/CharacterCardAlternateOpening";

export function createCompiledAlternateGreeting(
  opening: CharacterCardAlternateOpening,
): string {
  const scenario = opening.scenario.trim();
  const firstMessage = opening.firstMessage.trim();

  if (scenario && firstMessage) {
    return `[Opening Scenario]\n${scenario}\n\n[First Message]\n${firstMessage}`;
  }

  return firstMessage || scenario;
}
