import assert from "node:assert/strict";
import test from "node:test";

import {
  INFERENCE_DEFAULT_MATRIX,
  INFERENCE_MODEL_PRESETS,
  OLLAMA_DEFAULT_MODEL,
  normalizeInferenceConfig,
} from "../../types/inference";

test("defaults local inference to the DeepSeek R1 Llama distill Ollama tag", () => {
  assert.equal(OLLAMA_DEFAULT_MODEL, "deepseek-r1:8b-llama-distill-q4_K_M");
  assert.equal(INFERENCE_DEFAULT_MATRIX.provider, "ollama");
  assert.equal(INFERENCE_DEFAULT_MATRIX.contextLength, 8192);
  assert.equal(INFERENCE_DEFAULT_MATRIX.selectedModel, OLLAMA_DEFAULT_MODEL);
  assert.equal(INFERENCE_MODEL_PRESETS[0]?.value, OLLAMA_DEFAULT_MODEL);
});

test("supports proxy endpoints and clamps context length", () => {
  const config = normalizeInferenceConfig({
    ...INFERENCE_DEFAULT_MATRIX,
    contextLength: 999999,
    localEndpoint: " http://127.0.0.1:3000/api/chat ",
    provider: "proxy",
  });

  assert.equal(config.provider, "proxy");
  assert.equal(config.contextLength, 262144);
  assert.equal(config.localEndpoint, "http://127.0.0.1:3000/api/chat");
});

test("keeps the DeepSeek R1 Ollama tag through model normalization", () => {
  const config = normalizeInferenceConfig({
    ...INFERENCE_DEFAULT_MATRIX,
    selectedModel: " deepseek-r1:8b-llama-distill-q4_K_M ",
  });

  assert.equal(config.selectedModel, OLLAMA_DEFAULT_MODEL);
});

test("supports configurable OpenAI-compatible local endpoints", () => {
  const config = normalizeInferenceConfig({
    ...INFERENCE_DEFAULT_MATRIX,
    localEndpoint: " http://10.0.0.18:1234/v1 ",
    provider: "openai-compatible",
    selectedModel: "deepseek-r1-distill-qwen-14b-uncensored",
  });

  assert.equal(config.provider, "openai-compatible");
  assert.equal(config.localEndpoint, "http://10.0.0.18:1234/v1");
  assert.equal(
    config.selectedModel,
    "deepseek-r1-distill-qwen-14b-uncensored",
  );
});
