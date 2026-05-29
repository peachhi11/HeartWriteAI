"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isTauriRuntime } from "@/lib/tauri/native";
import { cn } from "@/lib/utils";

type CaptureStatus = {
  isError: boolean;
  text: string;
};

export function CameraSnapperButton() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [status, setStatus] = useState<CaptureStatus | null>(null);

  async function handleCaptureSequence() {
    if (!isTauriRuntime()) {
      setStatus({
        isError: true,
        text: "Viewport snaps are available in the desktop app.",
      });
      window.setTimeout(() => setStatus(null), 4000);
      return;
    }

    setIsCapturing(true);
    setStatus(null);
    setFlashActive(true);
    window.setTimeout(() => setFlashActive(false), 150);

    try {
      await invoke<string>("capture_viewport_screenshot");
      setStatus({ isError: false, text: "Viewport snap exported." });
      window.setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      setStatus({
        isError: true,
        text: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-50 bg-white transition-opacity duration-150",
          flashActive ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative flex shrink-0 flex-col items-end gap-2">
        <Button
          className="gap-2 bg-background/70"
          disabled={isCapturing}
          onClick={handleCaptureSequence}
          size="sm"
          title="Capture high-fidelity viewport screenshot"
          type="button"
          variant="outline"
        >
          {isCapturing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
          <span className="hidden sm:inline">
            {isCapturing ? "Snapping" : "Snap View"}
          </span>
        </Button>

        {status ? (
          <div
            className={cn(
              "absolute right-0 top-full z-20 mt-2 w-64 rounded-md border p-2 text-xs shadow-xl backdrop-blur",
              status.isError
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            )}
          >
            {status.text}
          </div>
        ) : null}
      </div>
    </>
  );
}
