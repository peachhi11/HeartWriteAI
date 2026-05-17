import { CharacterCardFormValues } from "../../types/character-card/CharacterCardFormValues";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";
import { createCharacterCardV3Export } from "./createCharacterCardV3Export";
import { createCompiledAlternateGreeting } from "./createCompiledAlternateGreeting";
import { createCompiledDescription } from "./createCompiledDescription";
import { createCompiledPersonalityPrompt } from "./createCompiledPersonalityPrompt";

export function createCharacterCardFromFormValues(
  sourceCard: CharacterCardPayload,
  values: CharacterCardFormValues,
): CharacterCardV3 {
  return createCharacterCardV3Export({
    ...sourceCard,
    data: {
      ...(sourceCard.data ?? {}),
      name: values.fullName.trim(),
      description: createCompiledDescription(values),
      personality: createCompiledPersonalityPrompt(values),
      scenario: values.scenario,
      first_mes: values.first_mes,
      mes_example: values.mes_example,
      creator_notes: values.creator_notes,
      system_prompt: values.system_prompt,
      post_history_instructions: values.post_history_instructions,
      tags: splitCommaSeparatedValues(values.tagsText),
      alternate_greetings: trimStringList(
        values.alternateOpenings.map(createCompiledAlternateGreeting),
      ),
      group_only_greetings: trimStringList(values.groupOnlyGreetings),
    },
  });
}

function splitCommaSeparatedValues(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function trimStringList(value: string[]): string[] {
  return value.map((item) => item.trim()).filter(Boolean);
}
