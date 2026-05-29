import { invoke } from "@tauri-apps/api/core";

import { type WallpaperPreference } from "@/types/theme";

import { isTauriRuntime } from "./native";

export async function pickCustomWallpaperAsset() {
  if (!isTauriRuntime()) {
    throw new Error("Custom wallpaper picking is available inside the Tauri desktop app.");
  }

  return invoke<WallpaperPreference>("compile_and_register_wallpaper");
}
