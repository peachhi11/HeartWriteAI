"use client";

import { useState } from "react";
import { CloudUpload, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pushSaveToCloudRepository } from "@/lib/tauri/cloudSync";
import { cn } from "@/lib/utils";

type CloudSyncState = "fault" | "idle" | "syncing" | "success";

export function CloudSyncControlCard() {
  const [endpoint, setEndpoint] = useState("");
  const [token, setToken] = useState("");
  const [syncState, setSyncState] = useState<CloudSyncState>("idle");
  const [statusText, setStatusText] = useState("");

  async function handleCloudBackup() {
    setSyncState("syncing");
    setStatusText("");

    try {
      const result = await pushSaveToCloudRepository({ endpoint, token });
      setSyncState("success");
      setStatusText(
        `Backup uploaded. ${formatBytes(result.uploadedBytes)} sent. Backup ID: ${result.remoteChecksum}`,
      );
    } catch (error) {
      setSyncState("fault");
      setStatusText(error instanceof Error ? error.message : String(error));
    }
  }

  const canSubmit =
    endpoint.trim().length > 0 && token.trim().length > 0 && syncState !== "syncing";

  return (
    <section className="grid gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 shadow-xl backdrop-blur-sm">
      <header className="flex flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CloudUpload className="size-4 text-user-primary" />
            <h4 className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-user-primary">
              Cloud Backup
            </h4>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Back up the active story slot, relationship progress, milestone list,
            and compressed chat log to your own private backup link.
          </p>
        </div>

        <StatusPill state={syncState} />
      </header>

      <div className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Backup Link
          </span>
          <Input
            autoComplete="url"
            onChange={(event) => setEndpoint(event.currentTarget.value)}
            placeholder="https://your-domain.example/api/backups"
            type="url"
            value={endpoint}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Backup Key
          </span>
          <Input
            autoComplete="off"
            onChange={(event) => setToken(event.currentTarget.value)}
            placeholder="Paste your private backup key"
            type="password"
            value={token}
          />
        </label>
      </div>

      {statusText ? (
        <div
          className={cn(
            "flex gap-2 rounded-xl border p-3 text-xs leading-relaxed",
            syncState === "fault"
              ? "border-destructive/35 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {syncState === "fault" ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          ) : (
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          )}
          <span className="break-words">{statusText}</span>
        </div>
      ) : null}

      <Button
        className="gap-2"
        disabled={!canSubmit}
        onClick={handleCloudBackup}
        type="button"
        variant="outline"
      >
        {syncState === "syncing" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CloudUpload className="size-4" />
        )}
        {syncState === "syncing" ? "Backing Up" : "Back Up Story Slot"}
      </Button>
    </section>
  );
}

function StatusPill({ state }: { state: CloudSyncState }) {
  const label = {
    fault: "Needs attention",
    idle: "Not connected",
    syncing: "Backing up",
    success: "Backed up",
  }[state];

  return (
    <span className="inline-flex w-max items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
      <span
        className={cn(
          "size-1.5 rounded-full",
          state === "fault" && "bg-destructive",
          state === "idle" && "bg-muted-foreground",
          state === "syncing" && "animate-pulse bg-cyan-500",
          state === "success" && "bg-emerald-500",
        )}
      />
      {label}
    </span>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kib = bytes / 1024;
  if (kib < 1024) {
    return `${kib.toFixed(1)} KB`;
  }

  return `${(kib / 1024).toFixed(1)} MB`;
}
