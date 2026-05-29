"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { executeAppUpdateCheck, type UpdateCheckPayload } from "@/lib/tauri/updateChecker";
import { cn } from "@/lib/utils";

type UpdateCheckState = "checking" | "fault" | "idle" | "ready" | "up-to-date";

export function AppUpdateChecker() {
  const [checkState, setCheckState] = useState<UpdateCheckState>("checking");
  const [details, setDetails] = useState<UpdateCheckPayload | null>(null);
  const [statusText, setStatusText] = useState("");

  async function runUpdateCheck(options: { showChecking: boolean } = { showChecking: true }) {
    if (options.showChecking) {
      setCheckState("checking");
    }
    setStatusText("");

    try {
      const result = await executeAppUpdateCheck();
      setDetails(result);
      setStatusText(result.statusMessage);
      setCheckState(result.updateAvailable ? "ready" : "up-to-date");
    } catch (error) {
      setDetails(null);
      setStatusText(error instanceof Error ? error.message : String(error));
      setCheckState("fault");
    }
  }

  useEffect(() => {
    let cancelled = false;

    void executeAppUpdateCheck()
      .then((result) => {
        if (cancelled) {
          return;
        }

        setDetails(result);
        setStatusText(result.statusMessage);
        setCheckState(result.updateAvailable ? "ready" : "up-to-date");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setDetails(null);
        setStatusText(error instanceof Error ? error.message : String(error));
        setCheckState("fault");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hasUpdate = checkState === "ready" && details?.updateAvailable;

  return (
    <section
      className={cn(
        "grid gap-4 rounded-2xl border bg-background/60 p-4 shadow-xl backdrop-blur-sm",
        hasUpdate ? "border-amber-500/45" : "border-border/70",
      )}
    >
      <header className="flex flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-user-primary" />
            <h4 className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-user-primary">
              App Updates
            </h4>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Check for secure HeartWriteAI updates without interrupting your chat
            or local AI reply stream.
          </p>
        </div>

        <UpdateStatusPill state={checkState} />
      </header>

      {statusText ? (
        <div
          className={cn(
            "flex gap-2 rounded-xl border p-3 text-xs leading-relaxed",
            checkState === "fault"
              ? "border-destructive/35 bg-destructive/10 text-destructive"
              : hasUpdate
                ? "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {checkState === "fault" ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          ) : hasUpdate ? (
            <Download className="mt-0.5 size-4 shrink-0" />
          ) : (
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="break-words">{statusText}</p>
            {details ? (
              <p className="mt-1 font-mono text-[10px] opacity-80">
                {details.currentVersion}
                {details.updateAvailable ? ` -> ${details.latestVersion}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {hasUpdate && details.releaseNotes ? (
        <div className="max-h-28 overflow-y-auto rounded-xl border border-border/70 bg-card/50 p-3 text-xs leading-relaxed text-muted-foreground">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-wide text-foreground">
            What&apos;s New
          </span>
          {details.releaseNotes}
        </div>
      ) : null}

      <Button
        className="gap-2"
        disabled={checkState === "checking"}
        onClick={() => void runUpdateCheck()}
        type="button"
        variant={hasUpdate ? "secondary" : "outline"}
      >
        {checkState === "checking" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <RefreshCw className="size-4" />
        )}
        {checkState === "checking" ? "Checking" : "Check for Updates"}
      </Button>
    </section>
  );
}

function UpdateStatusPill({ state }: { state: UpdateCheckState }) {
  const label = {
    checking: "Checking",
    fault: "Needs setup",
    idle: "Ready",
    ready: "Update ready",
    "up-to-date": "Up to date",
  }[state];

  return (
    <span className="inline-flex w-max items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
      <span
        className={cn(
          "size-1.5 rounded-full",
          state === "checking" && "animate-pulse bg-cyan-500",
          state === "fault" && "bg-destructive",
          state === "idle" && "bg-muted-foreground",
          state === "ready" && "bg-amber-500",
          state === "up-to-date" && "bg-emerald-500",
        )}
      />
      {label}
    </span>
  );
}
