import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

import { isTauriRuntime } from "@/lib/tauri/native";

export interface LocalBackupResult {
  archiveBytes: number;
  archivePath: string;
  archivedFiles: number;
}

export interface LocalRestoreResult {
  restoredFiles: number;
  skippedDirectories: number;
}

export async function exportLocalBackupArchive() {
  if (!isTauriRuntime()) {
    throw new Error("Local backup export is available in the desktop app.");
  }

  const destination = await save({
    defaultPath: `heartwriteai-backup-${new Date().toISOString().slice(0, 10)}.zip`,
    filters: [{ extensions: ["zip"], name: "HeartWriteAI Backup" }],
    title: "Export HeartWriteAI Backup",
  });

  if (!destination) {
    return null;
  }

  return invoke<LocalBackupResult>("export_local_backup", {
    destinationZipPath: destination,
  });
}

export async function restoreLocalBackupArchive() {
  if (!isTauriRuntime()) {
    throw new Error("Local backup restore is available in the desktop app.");
  }

  const source = await open({
    filters: [{ extensions: ["zip"], name: "HeartWriteAI Backup" }],
    multiple: false,
    title: "Restore HeartWriteAI Backup",
  });

  if (typeof source !== "string") {
    return null;
  }

  return invoke<LocalRestoreResult>("restore_local_backup", {
    sourceZipPath: source,
  });
}
