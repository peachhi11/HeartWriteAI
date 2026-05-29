import { invoke } from "@tauri-apps/api/core";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface UpdateCheckPayload {
  currentVersion: string;
  latestVersion: string;
  releaseNotes: string | null;
  statusMessage: string;
  updateAvailable: boolean;
}

export async function executeAppUpdateCheck() {
  if (!isTauriRuntime()) {
    throw new Error("App update checks are available in the desktop app.");
  }

  return invoke<UpdateCheckPayload>("execute_app_update_check");
}
