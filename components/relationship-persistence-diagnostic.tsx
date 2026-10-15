"use client";

import { useState } from "react";
import { DatabaseZap, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isTauriRuntime } from "@/lib/tauri/native";
import { runRelationshipPersistenceDiagnostic } from "@/lib/chat/relationshipPersistenceDiagnostic";

export function RelationshipPersistenceDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const isDesktopRuntime = isTauriRuntime();

  async function handleRun() {
    if (!isDesktopRuntime) {
      setMessage("This check requires the private Tauri desktop runtime.");
      return;
    }

    setIsRunning(true);
    setMessage("");

    try {
      const result = await runRelationshipPersistenceDiagnostic();
      setMessage(
        result.markerVerified
          ? "Passed: Tauri save/read verified and the diagnostic record was cleaned up."
          : "Failed: the saved diagnostic marker did not survive readback.",
      );
    } catch (error) {
      setMessage(`Persistence check failed: ${String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-cyan-500/25 bg-cyan-500/5 p-4">
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
          <DatabaseZap className="size-4" />
          Local persistence diagnostic
        </h3>
        <p className="text-xs text-zinc-400">
          Writes and reloads a synthetic relationship record through the private desktop store, then
          removes it.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={isRunning || !isDesktopRuntime}
        onClick={handleRun}
      >
        {isRunning ? <Loader2 className="animate-spin" /> : <DatabaseZap />}
        {isRunning ? "Checking persistence" : "Run save/read check"}
      </Button>
      {message ? (
        <p className="rounded border border-zinc-800 bg-zinc-950/60 p-2 text-xs text-cyan-100/90">
          {message}
        </p>
      ) : null}
    </section>
  );
}
