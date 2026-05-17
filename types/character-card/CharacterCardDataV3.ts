import { CharacterCardAsset } from "./CharacterCardAsset";
import { Lorebook } from "./Lorebook";

export interface CharacterCardDataV3 {
  name: string;
  description: string;
  tags: string[];
  creator: string;
  character_version: string;
  mes_example: string;
  extensions: Record<string, unknown>;
  system_prompt: string;
  post_history_instructions: string;
  first_mes: string;
  alternate_greetings: string[];
  personality: string;
  scenario: string;
  creator_notes: string;
  character_book?: Lorebook;
  assets?: CharacterCardAsset[];
  nickname?: string;
  creator_notes_multilingual?: Record<string, string>;
  source?: string[];
  group_only_greetings: string[];
  creation_date?: number;
  modification_date?: number;
  [key: string]: unknown;
}
