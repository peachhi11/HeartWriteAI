import {
  CCardLib,
  type CharacterCardV1,
  type CharacterCardV2,
  type CharacterCardV3 as CCardLibCharacterCardV3,
} from "@risuai/ccardlib";

import { CharacterCardPayload } from "../../types/character-card/CharacterCardPayload";
import { CharacterCardV3 } from "../../types/character-card/CharacterCardV3";
import { WriteCharacterCardToPngOptions } from "../../types/character-card/WriteCharacterCardToPngOptions";
import { currentUnixTimestamp } from "./currentUnixTimestamp";

const DEFAULT_CHARACTER_CARD_V3_DATA = {
  name: "",
  description: "",
  tags: [],
  creator: "",
  character_version: "",
  mes_example: "",
  extensions: {},
  system_prompt: "",
  post_history_instructions: "",
  first_mes: "",
  alternate_greetings: [],
  personality: "",
  scenario: "",
  creator_notes: "",
  group_only_greetings: [],
};

export function createCharacterCardV3Export(
  card: CharacterCardPayload,
  options: WriteCharacterCardToPngOptions = {},
): CharacterCardV3 {
  const convertedCard = convertSupportedCardToV3(card);
  const data = isRecord(convertedCard.data) ? convertedCard.data : {};
  const modificationDate =
    options.modificationDate ?? currentUnixTimestamp();

  return {
    ...convertedCard,
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      ...DEFAULT_CHARACTER_CARD_V3_DATA,
      ...data,
      group_only_greetings: Array.isArray(data.group_only_greetings)
        ? data.group_only_greetings.filter((value) => typeof value === "string")
        : [],
      modification_date: modificationDate,
    },
  };
}

function convertSupportedCardToV3(card: CharacterCardPayload): CharacterCardPayload {
  const version = CCardLib.character.check(card);

  if (version === "unknown" || version === "v3") {
    return card;
  }

  return CCardLib.character.convert(
    card as unknown as CharacterCardV1 | CharacterCardV2 | CCardLibCharacterCardV3,
    { from: version, to: "v3" },
  ) as unknown as CharacterCardPayload;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
