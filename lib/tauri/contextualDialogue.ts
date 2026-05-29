"use client";

import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface ContextualDialoguePayload {
  applied_archetype: string;
  speaker: string;
  transformed_text: string;
}

const browserDialogueFallbacks: Record<string, ContextualDialoguePayload> = {
  scene_01_alley_encounter: {
    applied_archetype: "Browser Preview",
    speaker: "Lucas",
    transformed_text:
      "[He glances over, professional but not unkind.] Hello there. Are you lost?",
  },
};

export async function fetchContextualNpcDialogue(
  nodeId: string,
): Promise<ContextualDialoguePayload> {
  if (!isTauriRuntime()) {
    return (
      browserDialogueFallbacks[nodeId] ?? {
        applied_archetype: "Browser Preview",
        speaker: "Narrator",
        transformed_text: "No browser preview dialogue exists for this node.",
      }
    );
  }

  return invoke<ContextualDialoguePayload>("fetch_contextual_npc_dialogue", {
    nodeId,
  });
}
