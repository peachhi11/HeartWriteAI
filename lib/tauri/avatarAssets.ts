"use client";

import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface RegisteredAvatarAsset {
  assetProtocolUrl: string;
  internalSandboxPath: string;
}

export async function registerUserAvatarAsset(
  sourcePath: string,
): Promise<RegisteredAvatarAsset | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return invoke<RegisteredAvatarAsset>("register_user_avatar", {
    sourcePath,
  });
}

export function getAvatarAssetUrl(asset: RegisteredAvatarAsset | null | undefined) {
  return asset?.assetProtocolUrl ?? "";
}
