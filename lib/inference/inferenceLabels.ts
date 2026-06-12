import type { InferenceConfig } from "@/types/inference";

export function formatInferenceProviderLabel(config: InferenceConfig) {
  if (config.provider === "openrouter") {
    return "OpenRouter";
  }

  if (config.provider === "openai-compatible") {
    return "OpenAI-compatible";
  }

  return config.provider === "proxy" ? "Proxy/API" : "Ollama";
}

export function getInferenceModelLabel(config: InferenceConfig) {
  return config.provider === "openrouter"
    ? config.openRouterModel
    : config.selectedModel;
}

export function formatInferenceProviderTarget(config: InferenceConfig) {
  if (config.provider === "openrouter") {
    return `OpenRouter model ${config.openRouterModel}`;
  }

  if (config.provider === "openai-compatible") {
    return `local OpenAI-compatible endpoint at ${config.localEndpoint}`;
  }

  if (config.provider === "proxy") {
    return `approved proxy/API endpoint at ${config.localEndpoint}`;
  }

  return `local Ollama at ${config.localEndpoint}`;
}

export function getInferenceStatusText(config: InferenceConfig) {
  if (config.provider === "openrouter" && !config.openRouterApiKey.trim()) {
    return "Needs key";
  }

  return "Configured";
}
