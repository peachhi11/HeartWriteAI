"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

import { Button } from "@/components/ui/button";
import CopyButton from "@/components/copy-button";
import { isTauriRuntime } from "@/lib/tauri/native";

export interface DevToolsPanelProps {
  onSeeded?: () => void;
}

export function DevToolsPanel({ onSeeded }: DevToolsPanelProps) {
  const isDesktopRuntime = isTauriRuntime();
  const [loadingTarget, setLoadingTarget] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function handleGenerationTrigger(targetSize: number) {
    if (!isDesktopRuntime) {
      setMessage(
        "Sample card seeding is available inside the Tauri desktop app.",
      );
      return;
    }

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
          Test Library Tools
        </h2>
        <p className="text-xs text-zinc-400">
          Adds sample cards to the local library so you can test search,
          filters, and page navigation.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading || !isDesktopRuntime}
          onClick={() => handleGenerationTrigger(10)}
        >
          {loadingTarget === 10 ? <Loader2 className="animate-spin" /> : null}
          {loadingTarget === 10 ? "Adding cards" : "Add 10 sample cards"}
        </Button>
        <Button
          type="button"
          disabled={isLoading || !isDesktopRuntime}
          onClick={() => handleGenerationTrigger(100)}
        >
          {loadingTarget === 100 ? <Loader2 className="animate-spin" /> : null}
          {loadingTarget === 100 ? "Adding cards" : "Add 100 sample cards"}
        </Button>
      </div>

      {message ? (
        <div className="rounded border border-zinc-800 bg-zinc-950/60 p-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70">
              Tool output
            </span>
            <CopyButton idleLabel="Copy output" textToCopy={message} />
          </div>
          <p className="font-mono text-xs text-amber-200/85">{message}</p>
        </div>
      ) : null}
    </section>
  );
}
