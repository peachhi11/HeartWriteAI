import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface CloudSyncResponse {
  localChecksum: string;
  remoteChecksum: string;
  serverMessage: string;
  success: boolean;
  uploadedBytes: number;
}

export async function pushSaveToCloudRepository(input: {
  endpoint: string;
  token: string;
}) {
  if (!isTauriRuntime()) {
    throw new Error("Cloud backup is available in the desktop app.");
  }

  return invoke<CloudSyncResponse>("push_save_to_cloud_repository", {
    endpoint: input.endpoint.trim(),
    token: input.token.trim(),
  });
}
