"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  exportLocalBackupArchive,
  restoreLocalBackupArchive,
  type LocalBackupResult,
  type LocalRestoreResult,
} from "@/lib/tauri/localBackup";
import { cn } from "@/lib/utils";

type BackupState = "fault" | "idle" | "running" | "success";

export function LocalBackupControlCard() {
  const [backupState, setBackupState] = useState<BackupState>("idle");
  const [restoreState, setRestoreState] = useState<BackupState>("idle");
  const [statusText, setStatusText] = useState("");

  async function handleExportBackup() {
    setBackupState("running");
    setStatusText("");

    try {
      const result = await exportLocalBackupArchive();
      if (!result) {
        setBackupState("idle");
        return;
      }

      setBackupState("success");
      setStatusText(formatBackupStatus(result));
    } catch (error) {
      setBackupState("fault");
      setStatusText(error instanceof Error ? error.message : String(error));
    }
  }

  async function handleRestoreBackup() {
    const confirmed = window.confirm(
      "Restore this backup? This overwrites matching local HeartWriteAI app data and then reloads the app.",
    );
    if (!confirmed) {
      return;
    }

    setRestoreState("running");
    setStatusText("");

    try {
      const result = await restoreLocalBackupArchive();
      if (!result) {
        setRestoreState("idle");
        return;
      }

      setRestoreState("success");
      setStatusText(formatRestoreStatus(result));
      window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      setRestoreState("fault");
      setStatusText(error instanceof Error ? error.message : String(error));
    }
  }

  const isBusy = backupState === "running" || restoreState === "running";
  const isFault = backupState === "fault" || restoreState === "fault";

  return (
    <section className="grid gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 shadow-xl backdrop-blur-sm">
      <header className="border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Archive className="size-4 text-user-primary" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-user-primary">
            Local Backup
          </h4>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Export a ZIP snapshot of local chats, card cache, lorebooks, personas,
          theme settings, and inference settings. Restore only accepts known
          HeartWriteAI paths.
        </p>
      </header>

      {statusText ? (
        <div
          className={cn(
            "flex gap-2 rounded-xl border p-3 text-xs leading-relaxed",
            isFault
              ? "border-destructive/35 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {isFault ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          ) : (
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          )}
          <span className="break-words">{statusText}</span>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Button
          className="gap-2"
          disabled={isBusy}
          onClick={handleExportBackup}
          type="button"
          variant="outline"
        >
          {backupState === "running" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Archive className="size-4" />
          )}
          {backupState === "running" ? "Exporting Backup" : "Export Local ZIP"}
        </Button>
        <Button
          className="gap-2"
          disabled={isBusy}
          onClick={handleRestoreBackup}
          type="button"
          variant="outline"
        >
          {restoreState === "running" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArchiveRestore className="size-4" />
          )}
          {restoreState === "running" ? "Restoring Backup" : "Restore Local ZIP"}
        </Button>
      </div>
    </section>
  );
}

function formatBackupStatus(result: LocalBackupResult) {
  return `Backup exported: ${result.archivedFiles} files, ${formatBytes(
    result.archiveBytes,
  )}. ${result.archivePath}`;
}

function formatRestoreStatus(result: LocalRestoreResult) {
  return `Backup restored: ${result.restoredFiles} files. Reloading workspace.`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
