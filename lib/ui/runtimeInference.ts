"use client";

import {
  INFERENCE_DEFAULT_MATRIX,
  INFERENCE_STORAGE_KEY,
  type InferenceConfig,
  normalizeInferenceConfig,
} from "@/types/inference";
import {
  exportUserInferenceSettings,
  getBootInferenceSettings,
} from "@/lib/tauri/inferencePreferences";

export async function saveInferenceConfig(config: InferenceConfig) {
  if (typeof window === "undefined") {
    return INFERENCE_DEFAULT_MATRIX;
  }

  const safeConfig = normalizeInferenceConfig(config);
  window.localStorage.setItem(INFERENCE_STORAGE_KEY, JSON.stringify(safeConfig));

  try {
    const nativeConfig = await exportUserInferenceSettings(safeConfig);
    if (nativeConfig) {
      const normalizedNativeConfig = normalizeInferenceConfig(nativeConfig);
      window.localStorage.setItem(
        INFERENCE_STORAGE_KEY,
        JSON.stringify(normalizedNativeConfig),
      );
      return normalizedNativeConfig;
    }
  } catch (error) {
    console.warn("Native inference preference persistence failed:", error);
  }

  return safeConfig;
}

export function loadInferenceConfig() {
  if (typeof window === "undefined") {
    return INFERENCE_DEFAULT_MATRIX;
  }

  try {
    return normalizeInferenceConfig(
      JSON.parse(window.localStorage.getItem(INFERENCE_STORAGE_KEY) ?? "null"),
    );
  } catch {
    return INFERENCE_DEFAULT_MATRIX;
  }
}

export async function loadInferencePreference() {
  if (typeof window === "undefined") {
    return INFERENCE_DEFAULT_MATRIX;
  }

  try {
    const nativeConfig = await getBootInferenceSettings();
    if (nativeConfig) {
      const safeConfig = normalizeInferenceConfig(nativeConfig);
      window.localStorage.setItem(INFERENCE_STORAGE_KEY, JSON.stringify(safeConfig));
      return safeConfig;
    }
  } catch (error) {
    console.warn("Native inference preference hydration failed:", error);
  }

  return loadInferenceConfig();
}
