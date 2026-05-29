import { invoke } from "@tauri-apps/api/core";

import type { InferenceConfig } from "@/types/inference";

import { isTauriRuntime } from "./native";

export async function getBootInferenceSettings() {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<InferenceConfig>("get_boot_inference_settings");
}

export async function exportUserInferenceSettings(config: InferenceConfig) {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<InferenceConfig>("export_user_inference_settings", {
    incomingConfig: config,
  });
}
