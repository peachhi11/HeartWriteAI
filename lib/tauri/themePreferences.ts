import { invoke } from "@tauri-apps/api/core";

import { type UserThemeConfig } from "@/types/theme";

import { isTauriRuntime } from "./native";

export async function getBootThemeSettings() {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UserThemeConfig>("get_boot_theme_settings");
}

export async function exportUserThemePreferences(config: UserThemeConfig) {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<UserThemeConfig>("export_user_theme_preferences", { config });
}
