export type InferenceProvider = "ollama" | "openrouter";

export interface InferenceConfig {
  frequencyPenalty: number;
  localEndpoint: string;
  maxTokens: number;
  openRouterApiKey: string;
  openRouterModel: string;
  provider: InferenceProvider;
  selectedModel: string;
  temperature: number;
  topP: number;
}

export const OPENROUTER_DEFAULT_MODEL = "google/gemini-2.5-flash";

export const INFERENCE_DEFAULT_MATRIX: InferenceConfig = {
  frequencyPenalty: 0,
  localEndpoint: "http://127.0.0.1:11434/api/chat",
  maxTokens: 256,
  openRouterApiKey: "",
  openRouterModel: OPENROUTER_DEFAULT_MODEL,
  provider: "ollama",
  selectedModel: "llama3:8b",
  temperature: 0.7,
  topP: 0.9,
};

export const INFERENCE_STORAGE_KEY = "heartwriteai:inference-settings";

export const INFERENCE_MODEL_PRESETS = [
  { label: "Llama 3 8B", value: "llama3:8b" },
  { label: "Mistral 7B", value: "mistral:7b" },
  { label: "Phi-3 Mini", value: "phi3:3.8b" },
] as const;

export const OPENROUTER_MODEL_PRESETS = [
  { label: "Gemini 2.5 Flash", value: OPENROUTER_DEFAULT_MODEL },
  { label: "Claude 3.5 Sonnet", value: "anthropic/claude-3.5-sonnet" },
  { label: "Llama 3.1 70B", value: "meta-llama/llama-3.1-70b-instruct" },
  { label: "MythoMax L2 13B", value: "gryphe/mythomax-l2-13b" },
] as const;

export function normalizeInferenceConfig(value: unknown): InferenceConfig {
  if (!value || typeof value !== "object") {
    return INFERENCE_DEFAULT_MATRIX;
  }

  const candidate = value as Partial<InferenceConfig>;

  return {
    frequencyPenalty: clampFloat(
      candidate.frequencyPenalty,
      0,
      2,
      INFERENCE_DEFAULT_MATRIX.frequencyPenalty,
      2,
    ),
    localEndpoint:
      typeof candidate.localEndpoint === "string" &&
      isSafeLocalEndpoint(candidate.localEndpoint)
        ? normalizeLocalEndpoint(candidate.localEndpoint)
        : INFERENCE_DEFAULT_MATRIX.localEndpoint,
    maxTokens: clampInteger(
      candidate.maxTokens,
      16,
      2048,
      INFERENCE_DEFAULT_MATRIX.maxTokens,
    ),
    openRouterApiKey:
      typeof candidate.openRouterApiKey === "string"
        ? normalizeApiKey(candidate.openRouterApiKey)
        : INFERENCE_DEFAULT_MATRIX.openRouterApiKey,
    openRouterModel:
      typeof candidate.openRouterModel === "string" &&
      isSafeModelTag(candidate.openRouterModel)
        ? candidate.openRouterModel.trim()
        : INFERENCE_DEFAULT_MATRIX.openRouterModel,
    provider:
      candidate.provider === "openrouter" || candidate.provider === "ollama"
        ? candidate.provider
        : INFERENCE_DEFAULT_MATRIX.provider,
    selectedModel:
      typeof candidate.selectedModel === "string" &&
      isSafeModelTag(candidate.selectedModel)
        ? candidate.selectedModel.trim()
        : INFERENCE_DEFAULT_MATRIX.selectedModel,
    temperature: clampFloat(
      candidate.temperature,
      0,
      2,
      INFERENCE_DEFAULT_MATRIX.temperature,
      2,
    ),
    topP: clampFloat(
      candidate.topP,
      0,
      1,
      INFERENCE_DEFAULT_MATRIX.topP,
      2,
    ),
  };
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numeric)));
}

function clampFloat(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
  decimals: number,
) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  const clamped = Math.min(max, Math.max(min, numeric));
  return Number(clamped.toFixed(decimals));
}

function isSafeModelTag(value: string) {
  const trimmed = value.trim();

  return (
    trimmed.length > 0 &&
    trimmed.length <= 96 &&
    /^[a-zA-Z0-9._:/-]+$/.test(trimmed)
  );
}

function normalizeApiKey(value: string) {
  const trimmed = value.trim();
  const hasControlCharacters = /[\u0000-\u001f\u007f]/.test(trimmed);

  if (hasControlCharacters || trimmed.length > 4096) {
    return "";
  }

  return trimmed;
}

function isSafeLocalEndpoint(value: string) {
  try {
    const url = new URL(value.trim());
    const isLocalHost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]";

    return (
      isLocalHost &&
      url.protocol === "http:" &&
      url.pathname === "/api/chat" &&
      url.username === "" &&
      url.password === "" &&
      value.trim().length <= 128
    );
  } catch {
    return false;
  }
}

function normalizeLocalEndpoint(value: string) {
  const url = new URL(value.trim());
  return url.toString();
}
