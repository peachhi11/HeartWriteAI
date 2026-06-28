import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";

export function createCompiledPersonalityPrompt(
  values: CharacterCardFormValues,
): string {
  return [
    createPromptSection("Physical Appearance", values.physicalAppearance),
    createPromptSection(
      "Personality & Psychology",
      values.personalityPsychology,
    ),
    createPromptSection("Internal Processing", values.backgroundStory),
    createPromptSection("Speech Style", values.speechStyle),
    createPromptSection("Relational Architecture", values.relationshipsConnections),
    createPromptSection("Sexuality / Intimacy Profile", values.intimacyProfile),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function createPromptSection(title: string, content: string): string {
  const trimmedContent = content.trim();

  return trimmedContent ? `${title}:\n${trimmedContent}` : "";
}
