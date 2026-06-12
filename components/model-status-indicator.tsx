"use client";

import { useEffect, useState } from "react";
import { CircleCheck, CircleDashed } from "lucide-react";

import {
  formatInferenceProviderLabel,
  getInferenceModelLabel,
  getInferenceStatusText,
} from "@/lib/inference/inferenceLabels";
import {
  loadInferenceConfig,
  loadInferencePreference,
} from "@/lib/ui/runtimeInference";
import { cn } from "@/lib/utils";
import { INFERENCE_DEFAULT_MATRIX, type InferenceConfig } from "@/types/inference";

export function ModelStatusIndicator() {
  const [config, setConfig] = useState<InferenceConfig>(INFERENCE_DEFAULT_MATRIX);

  useEffect(() => {
    let cancelled = false;

    function syncFromStorage() {
      setConfig(loadInferenceConfig());
    }

    queueMicrotask(syncFromStorage);
    void loadInferencePreference().then((preference) => {
      if (!cancelled) {
        setConfig(preference);
      }
    });

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("focus", syncFromStorage);
    window.addEventListener("heartwriteai:inference-settings", syncFromStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("focus", syncFromStorage);
      window.removeEventListener(
        "heartwriteai:inference-settings",
        syncFromStorage,
      );
    };
  }, []);

  const statusText = getInferenceStatusText(config);
  const needsSetup = statusText !== "Configured";

  return (
    <div
      className={cn(
        "hidden max-w-[18rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs shadow-sm backdrop-blur sm:flex",
        needsSetup
          ? "border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-200"
          : "border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200",
      )}
      title={`${formatInferenceProviderLabel(config)} - ${getInferenceModelLabel(config)} - ${config.contextLength.toLocaleString()} context tokens`}
    >
      {needsSetup ? (
        <CircleDashed className="size-3.5 shrink-0" />
      ) : (
        <CircleCheck className="size-3.5 shrink-0" />
      )}
      <span className="truncate font-semibold">
        {formatInferenceProviderLabel(config)}
      </span>
      <span className="truncate font-mono text-[10px] opacity-75">
        {getInferenceModelLabel(config)}
      </span>
    </div>
  );
}
