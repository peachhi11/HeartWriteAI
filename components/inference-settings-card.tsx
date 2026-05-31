"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Dice5,
  type LucideIcon,
  Orbit,
  Repeat2,
  Ruler,
} from "lucide-react";

import {
  INFERENCE_DEFAULT_MATRIX,
  INFERENCE_MODEL_PRESETS,
  OPENROUTER_MODEL_PRESETS,
  type InferenceConfig,
  normalizeInferenceConfig,
} from "@/types/inference";
import {
  loadInferenceConfig,
  loadInferencePreference,
  saveInferenceConfig,
} from "@/lib/ui/runtimeInference";
import { cn } from "@/lib/utils";

export function InferenceSettingsCard() {
  const [config, setConfig] = useState<InferenceConfig>(INFERENCE_DEFAULT_MATRIX);
  const [endpointDraft, setEndpointDraft] = useState(
    INFERENCE_DEFAULT_MATRIX.localEndpoint,
  );
  const [openRouterModelDraft, setOpenRouterModelDraft] = useState(
    INFERENCE_DEFAULT_MATRIX.openRouterModel,
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const localConfig = loadInferenceConfig();
      setConfig(localConfig);
      setEndpointDraft(localConfig.localEndpoint);
      setOpenRouterModelDraft(localConfig.openRouterModel);
      setHasHydrated(true);
    });

    void loadInferencePreference().then((nativeConfig) => {
      if (cancelled) {
        return;
      }

      setConfig(nativeConfig);
      setEndpointDraft(nativeConfig.localEndpoint);
      setOpenRouterModelDraft(nativeConfig.openRouterModel);
      setHasHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    void saveInferenceConfig(config).then((savedConfig) => {
      setEndpointDraft(savedConfig.localEndpoint);
      setOpenRouterModelDraft(savedConfig.openRouterModel);
      setConfig((current) =>
        JSON.stringify(current) === JSON.stringify(savedConfig)
          ? current
          : savedConfig,
      );
    });
  }, [config, hasHydrated]);

  function updateConfig(patch: Partial<InferenceConfig>) {
    setConfig((current) => normalizeInferenceConfig({ ...current, ...patch }));
  }

  function commitEndpointDraft() {
    const nextConfig = normalizeInferenceConfig({
      ...config,
      localEndpoint: endpointDraft,
    });

    setConfig(nextConfig);
    setEndpointDraft(nextConfig.localEndpoint);
  }

  function commitOpenRouterModelDraft() {
    const nextConfig = normalizeInferenceConfig({
      ...config,
      openRouterModel: openRouterModelDraft,
    });

    setConfig(nextConfig);
    setOpenRouterModelDraft(nextConfig.openRouterModel);
  }

  const hasPresetOpenRouterModel = OPENROUTER_MODEL_PRESETS.some(
    (model) => model.value === config.openRouterModel,
  );

  return (
    <section className="grid gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 shadow-xl backdrop-blur-sm">
      <header className="flex flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BrainCircuit className="size-4 text-user-primary" />
            <h4 className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-user-primary">
              AI Reply Style
            </h4>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Adjust how bold, focused, and long character replies should feel.
          </p>
        </div>

        <label className="grid gap-1 sm:w-48">
          <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
            Reply Engine
          </span>
          <select
            className="h-9 rounded-lg border border-border/70 bg-background px-2 font-mono text-[10px] text-foreground outline-none transition focus:border-user-primary/70"
            onChange={(event) =>
              updateConfig({
                provider: event.currentTarget.value as InferenceConfig["provider"],
              })
            }
            value={config.provider}
          >
            <option value="ollama">Ollama Local</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </label>
      </header>

      <div className="grid gap-4">
        {config.provider === "ollama" ? (
          <label className="grid gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
              Local AI Model
            </span>
            <select
              className="h-9 rounded-lg border border-border/70 bg-background px-2 font-mono text-[10px] text-foreground outline-none transition focus:border-user-primary/70"
              onChange={(event) =>
                updateConfig({ selectedModel: event.currentTarget.value })
              }
              value={config.selectedModel}
            >
              {INFERENCE_MODEL_PRESETS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="grid gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
            <label className="grid gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                OpenRouter API Key
              </span>
              <input
                autoComplete="off"
                className="h-9 rounded-lg border border-border/70 bg-background px-2 font-mono text-[10px] text-foreground outline-none transition focus:border-user-primary/70"
                onChange={(event) =>
                  updateConfig({ openRouterApiKey: event.currentTarget.value })
                }
                placeholder="sk-or-v1-..."
                type="password"
                value={config.openRouterApiKey}
              />
              <span className="text-[10px] text-muted-foreground">
                Stored locally with your desktop inference settings.
              </span>
            </label>

            <label className="grid gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                OpenRouter Model
              </span>
              <select
                className="h-9 rounded-lg border border-border/70 bg-background px-2 font-mono text-[10px] text-foreground outline-none transition focus:border-user-primary/70"
                onChange={(event) => {
                  const openRouterModel = event.currentTarget.value;
                  setOpenRouterModelDraft(openRouterModel);
                  updateConfig({ openRouterModel });
                }}
                value={config.openRouterModel}
              >
                {hasPresetOpenRouterModel ? null : (
                  <option value={config.openRouterModel}>Custom model</option>
                )}
                {OPENROUTER_MODEL_PRESETS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {config.provider === "ollama" ? (
          <label className="grid gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
              Local Endpoint
            </span>
            <input
              className="h-9 rounded-lg border border-border/70 bg-background px-2 font-mono text-[10px] text-foreground outline-none transition focus:border-user-primary/70"
              onBlur={commitEndpointDraft}
              onChange={(event) => setEndpointDraft(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              placeholder="http://127.0.0.1:11434/api/chat"
              value={endpointDraft}
            />
            <span className="text-[10px] text-muted-foreground">
              Use another local Ollama port if another app is occupying 11434.
            </span>
          </label>
        ) : null}

        {config.provider === "ollama" ? null : (
          <label className="grid gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
              Custom OpenRouter Model
            </span>
            <input
              className="h-9 rounded-lg border border-border/70 bg-background px-2 font-mono text-[10px] text-foreground outline-none transition focus:border-user-primary/70"
              onBlur={commitOpenRouterModelDraft}
              onChange={(event) =>
                setOpenRouterModelDraft(event.currentTarget.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              placeholder="provider/model-name"
              value={openRouterModelDraft}
            />
          </label>
        )}
        <InferenceSlider
          highLabel="Wild"
          icon={Dice5}
          label="Creativity"
          lowLabel="Focused"
          max={2}
          min={0}
          onChange={(temperature) => updateConfig({ temperature })}
          step={0.05}
          value={config.temperature}
          valueLabel={config.temperature.toFixed(2)}
        />
        <InferenceSlider
          highLabel="Broad"
          icon={Orbit}
          label="Word Variety"
          lowLabel="Narrow"
          max={1}
          min={0}
          onChange={(topP) => updateConfig({ topP })}
          step={0.05}
          value={config.topP}
          valueLabel={config.topP.toFixed(2)}
        />
        <InferenceSlider
          highLabel="Long"
          icon={Ruler}
          label="Reply Length"
          lowLabel="Brief"
          max={2048}
          min={16}
          onChange={(maxTokens) => updateConfig({ maxTokens })}
          step={16}
          value={config.maxTokens}
          valueLabel={`${config.maxTokens} tokens`}
        />
        <InferenceSlider
          highLabel="Strict"
          icon={Repeat2}
          label="Repeat Control"
          lowLabel="Loose"
          max={2}
          min={0}
          onChange={(frequencyPenalty) => updateConfig({ frequencyPenalty })}
          step={0.1}
          value={config.frequencyPenalty}
          valueLabel={config.frequencyPenalty.toFixed(2)}
        />
      </div>
    </section>
  );
}

function InferenceSlider({
  highLabel,
  icon: Icon,
  label,
  lowLabel,
  max,
  min,
  onChange,
  step,
  value,
  valueLabel,
}: {
  highLabel: string;
  icon: LucideIcon;
  label: string;
  lowLabel: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
  valueLabel: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          <Icon className="size-3.5 shrink-0 text-user-primary" />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 rounded-md border border-border/70 bg-background px-1.5 py-0.5 font-mono text-[9px] text-foreground">
          {valueLabel}
        </span>
      </span>
      <input
        className={cn(
          "h-1 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-rose-600",
        )}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        step={step}
        type="range"
        value={value}
      />
      <span className="flex justify-between font-mono text-[8px] text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </span>
    </label>
  );
}
