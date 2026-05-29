import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface CharacterCardMetadata {
  name: string;
  description: string;
  forbiddenTones: string[];
  preferredTones: string[];
}

export interface CharacterImportPayload {
  metadata: CharacterCardMetadata;
  avatarDataUri: string;
}

export async function pickAndParseCharacterCard() {
  if (!isTauriRuntime()) {
    throw new Error(
      "Character Card PNG parsing uses the desktop app's native file picker.",
    );
  }

  return invoke<CharacterCardMetadata>("pick_and_parse_character_card");
}

export async function pickAndParseCharacterCardWithAvatar() {
  if (!isTauriRuntime()) {
    throw new Error(
      "Character Card PNG parsing uses the desktop app's native file picker.",
    );
  }

  return invoke<CharacterImportPayload>(
    "pick_and_parse_character_card_with_avatar",
  );
}
