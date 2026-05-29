"use client";

import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";
import type { DynamicArchetype } from "@/lib/persona/psychologyEngine";
import type { RomanceTropeClass } from "@/types/character-card/RomanceTropeClassification";

export interface PersonaResonanceInitialization {
  archetype: DynamicArchetype;
  name: string;
  primaryBias: RomanceTropeClass;
  resonanceScore: number;
}

export interface PersonaResonanceInitializationResult {
  message: string;
  native_available: boolean;
}

export async function initializeProfileWithResonance(
  payload: PersonaResonanceInitialization,
): Promise<PersonaResonanceInitializationResult> {
  if (!isTauriRuntime()) {
    return {
      message:
        "Browser preview updated. Native story-session binding runs inside the desktop app.",
      native_available: false,
    };
  }

  const message = await invoke<string>("initialize_profile_with_resonance", {
    archetype: payload.archetype,
    name: payload.name,
    primaryBias: payload.primaryBias,
    resonanceScore: payload.resonanceScore,
  });

  return {
    message,
    native_available: true,
  };
}
