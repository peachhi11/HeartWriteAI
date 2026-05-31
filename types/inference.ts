export interface InferenceConfig {
  frequencyPenalty: number;
  localEndpoint: string;
  maxTokens: number;
  selectedModel: string;
  temperature: number;
  topP: number;
}

export const INFERENCE_DEFAULT_MATRIX: InferenceConfig = {
  frequencyPenalty: 0,
  localEndpoint: "http://127.0.0.1:11434/api/chat",
  maxTokens: 256,
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
    selectedModel:
      typeof candidate.selectedModel === "string" &&
      isSafeModelTag(candidate.selectedModel)
        ? candidate.selectedModel
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
