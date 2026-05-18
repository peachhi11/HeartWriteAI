"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

import { Button } from "@/components/ui/button";

export interface DevToolsPanelProps {
  onSeeded?: () => void;
}

export function DevToolsPanel({ onSeeded }: DevToolsPanelProps) {
  const [loadingTarget, setLoadingTarget] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function handleGenerationTrigger(targetSize: number) {
    setLoadingTarget(targetSize);
    setMessage("");

    try {
      const result = await invoke<string>("seed_mock_library_cache", {
        count: targetSize,
      });
      setMessage(result);
      onSeeded?.();
    } catch (error) {
      setMessage(`Execution failure: ${String(error)}`);
    } finally {
      setLoadingTarget(null);
    }
  }

  const isLoading = loadingTarget !== null;

  return (
    <section className="space-y-4 rounded-lg border border-amber-500/25 bg-amber-500/5 p-5 backdrop-blur-sm">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
          <Database className="size-4" />
          Workspace Mock Simulator Suite
        </h2>
        <p className="text-xs text-zinc-400">
          Instantly populates the local SQLite cache with randomized cards to
          test pagination and library scaling.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleGenerationTrigger(10)}
        >
          {loadingTarget === 10 ? <Loader2 className="animate-spin" /> : null}
          {loadingTarget === 10 ? "Populating" : "Seed 10 Cards"}
        </Button>
        <Button
          type="button"
          disabled={isLoading}
          onClick={() => handleGenerationTrigger(100)}
        >
          {loadingTarget === 100 ? <Loader2 className="animate-spin" /> : null}
          {loadingTarget === 100 ? "Populating" : "Stress Test 100 Cards"}
        </Button>
      </div>

      {message ? (
        <p className="rounded border border-zinc-800 bg-zinc-950/60 p-2 font-mono text-xs text-amber-200/85">
          {message}
        </p>
      ) : null}
    </section>
  );
}
