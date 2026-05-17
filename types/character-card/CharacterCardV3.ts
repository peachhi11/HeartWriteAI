import { CharacterCardDataV3 } from "./CharacterCardDataV3";

export interface CharacterCardV3 {
  spec: "chara_card_v3";
  spec_version: "3.0";
  data: CharacterCardDataV3;
  [key: string]: unknown;
}
