import {
  CharacterCardV3Schema,
  type ValidatedCharacterCardV3,
} from "../../types/character-card/CharacterCardV3Schema";
import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { createCharacterCardFormValues } from "./createCharacterCardFormValues";
import { createCharacterCardFromFormValues } from "./createCharacterCardFromFormValues";
import { createEmptyCharacterCardFormValues } from "./createEmptyCharacterCardFormValues";
import { mergeCharacterCardIntakeValues } from "./mergeCharacterCardIntakeValues";
import { parseMessyCharacterIntake } from "./parseMessyCharacterIntake";

export interface DraftCharacterCardResult {
  card: ValidatedCharacterCardV3;
  routedFieldNames: string[];
}

export function createDraftCharacterCardFromIntake(input: {
  currentCard?: ValidatedCharacterCardV3 | null;
  intakeText?: string;
  overwriteExistingFields?: boolean;
  sourceName?: string | null;
}): DraftCharacterCardResult {
  const routeResult = parseMessyCharacterIntake(input.intakeText ?? "");
  const sourceCard = input.currentCard ?? createBlankCharacterCardPayload(input.sourceName);
  const currentValues = input.currentCard && !isDraftShellCard(input.currentCard)
    ? createCharacterCardFormValues(input.currentCard)
    : createEmptyCharacterCardFormValues();
  const mergedValues = withFallbackName(
    mergeCharacterCardIntakeValues(currentValues, routeResult.values, {
      overwrite: input.overwriteExistingFields,
    }),
    input.sourceName,
  );

  return {
    card: CharacterCardV3Schema.parse(
      createCharacterCardFromFormValues(sourceCard, mergedValues),
    ),
    routedFieldNames: routeResult.fieldNames,
  };
}

function isDraftShellCard(card: ValidatedCharacterCardV3) {
  const tags = new Set(card.data.tags?.map((tag) => tag.toLowerCase()) ?? []);
  const description = card.data.description?.trim() ?? "";
  const nameOnlyDescription = description === `Full Name: ${card.data.name}`;
  const isOtherwiseEmpty =
    !card.data.personality?.trim() &&
    !card.data.scenario?.trim() &&
    !card.data.first_mes?.trim();

  return (
    (tags.has("draft") && tags.has("messy intake")) ||
    (isOtherwiseEmpty && nameOnlyDescription)
  );
}

function withFallbackName(
  values: ReturnType<typeof createEmptyCharacterCardFormValues>,
  sourceName?: string | null,
) {
  return {
    ...values,
    fullName: values.fullName.trim() || createDraftCharacterName(sourceName),
  };
}

export function createBlankDraftCharacterCard(
  sourceName?: string | null,
): ValidatedCharacterCardV3 {
  return createDraftCharacterCardFromIntake({ sourceName }).card;
}

function createBlankCharacterCardPayload(
  sourceName?: string | null,
): CharacterCardPayload {
  return {
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: createDraftCharacterName(sourceName),
      description: "",
      personality: "",
      scenario: "",
      first_mes: "",
      tags: ["draft", "messy intake"],
    },
  };
}

function createDraftCharacterName(sourceName?: string | null) {
  const cleanedName = (sourceName ?? "")
    .split(/[\\/]/)
    .at(-1)
    ?.replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanedName || "Untitled Character";
}
