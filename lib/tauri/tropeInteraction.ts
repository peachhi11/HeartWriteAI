"use client";

import { invoke } from "@tauri-apps/api/core";

import { classifyTropeInput } from "@/lib/character-card/tropeMatcher";
import { isTauriRuntime } from "@/lib/tauri/native";
import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";
import type { DialogueLogEntry } from "@/types/history";
import type { ExtractedCharacterPayload } from "@/types/studio";

export type NativeRelationshipStatsPayload = {
  affection: number;
  chemistry: number;
  rivalry: number;
  tension: number;
  trust: number;
};

export type NativeTropeInteractionPayload = {
  active_slot: number;
  active_character: NativeCharacterCardPayload | null;
  active_vignette: string;
  active_trope_milestones: string[];
  current_stats: NativeRelationshipStatsPayload;
  dialogue_history: DialogueLogEntry[];
  total_turns_played: number;
  triggered_event_flag: string | null;
};

export type NativeCharacterCardPayload = {
  avatarDataUri: string;
  description: string;
  forbiddenTones: string[];
  name: string;
  preferredTones: string[];
};

export type SaveSlotMetadata = {
  active_character: NativeCharacterCardPayload | null;
  exists: boolean;
  last_updated: string;
  slot_index: number;
  total_turns_played: number;
};

export type TropeInteractionResult = NativeTropeInteractionPayload & {
  detected_trope: RomanceTropeClass;
  native_available: boolean;
};

const browserPreviewStats: NativeRelationshipStatsPayload = {
  affection: 5,
  chemistry: 20,
  rivalry: 40,
  tension: 15,
  trust: 10,
};

export async function syncTropeInteraction(
  detectedTrope: RomanceTropeClass,
): Promise<TropeInteractionResult> {
  if (!isTauriRuntime()) {
    return {
      active_slot: 1,
      active_character: null,
      active_vignette: "from-transparent",
      active_trope_milestones: [],
      current_stats: { ...browserPreviewStats },
      detected_trope: detectedTrope,
      dialogue_history: [],
      native_available: false,
      total_turns_played: 0,
      triggered_event_flag: null,
    };
  }

  const response = await invoke<NativeTropeInteractionPayload>(
    "sync_trope_interaction",
    {
      detectedTrope,
    },
  );

  return {
    ...response,
    detected_trope: detectedTrope,
    native_available: true,
  };
}

export async function commitCharacterCardToActiveSlot(
  cardPayload: ExtractedCharacterPayload,
): Promise<NativeTropeInteractionPayload | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NativeTropeInteractionPayload>(
    "commit_character_card_to_active_slot",
    {
      cardData: {
        avatarDataUri: cardPayload.avatarDataUri,
        description: cardPayload.description,
        forbiddenTones: cardPayload.forbiddenTones,
        name: cardPayload.name,
        preferredTones: cardPayload.preferredTones,
      },
    },
  );
}

export async function getSaveSlotsManifest(): Promise<SaveSlotMetadata[]> {
  if (!isTauriRuntime()) {
    return [1, 2, 3].map((slotIndex) => ({
      active_character: null,
      exists: false,
      last_updated: "--",
      slot_index: slotIndex,
      total_turns_played: 0,
    }));
  }

  return invoke<SaveSlotMetadata[]>("get_save_slots_manifest");
}

export async function loadGameSlot(
  slot: number,
): Promise<NativeTropeInteractionPayload | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NativeTropeInteractionPayload>("load_game_slot", { slot });
}

export async function appendMessageToHistory(
  message: DialogueLogEntry,
): Promise<NativeTropeInteractionPayload | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NativeTropeInteractionPayload>("append_message_to_history", {
    message,
  });
}

export async function replaceDialogueHistory(
  messages: DialogueLogEntry[],
): Promise<NativeTropeInteractionPayload | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<NativeTropeInteractionPayload>("replace_dialogue_history", {
    messages,
  });
}

export async function clearGameSlot(slot: number): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  await invoke("clear_game_slot", { slot });
}

export async function cloneGameSlot(
  sourceSlot: number,
  targetSlot: number,
): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  await invoke("clone_game_slot", { sourceSlot, targetSlot });
}

export async function bootGameplayLoopInstance(slot: number): Promise<string> {
  if (!isTauriRuntime()) {
    return "BROWSER_PREVIEW_LAUNCH_READY";
  }

  return invoke<string>("boot_gameplay_loop_instance", { slot });
}

export async function classifyAndSyncTropeInteraction(
  inputText: string,
): Promise<TropeInteractionResult> {
  const detectedTrope = classifyTropeInput(inputText);

  return syncTropeInteraction(detectedTrope);
}
