import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChatCompletionUrl,
  createNormalizedChatStream,
  ChatProviderConfigError,
  getChatProviderConfig,
  isChatRouteEnabled,
  parseOpenAICompatibleSseLine,
} from "../../lib/chat/chatProvider";

test("uses an OpenAI-compatible provider configuration without exposing keys to the client", () => {
  const config = getChatProviderConfig({
    HEARTWRITE_CHAT_PROVIDER: "openrouter",
    HEARTWRITE_CHAT_MODEL: "openrouter/test-model",
    OPENROUTER_API_KEY: "secret",
  });

  assert.equal(config.baseUrl, "https://openrouter.ai/api");
  assert.equal(config.provider, "openrouter");
  assert.equal(config.model, "openrouter/test-model");
  assert.equal(config.apiKey, "secret");
  assert.equal(
    buildChatCompletionUrl(config.baseUrl),
    "https://openrouter.ai/api/v1/chat/completions",
  );
});

test("fails closed when no provider is explicitly configured", () => {
  assert.throws(() => getChatProviderConfig({}), ChatProviderConfigError);
  assert.equal(isChatRouteEnabled({}), false);
  assert.equal(isChatRouteEnabled({ HEARTWRITE_CHAT_ENABLED: "1" }), true);
});

test("keeps local Ollama configuration separate from remote provider keys", () => {
  const config = getChatProviderConfig({
    HEARTWRITE_CHAT_PROVIDER: "ollama",
    HEARTWRITE_CHAT_MODEL: "local-prose-model",
  });

  assert.equal(config.baseUrl, "http://localhost:11434");
  assert.equal(config.apiKey, undefined);
  assert.equal(config.model, "local-prose-model");
});

test("parses OpenAI-compatible text deltas and finish events", () => {
  assert.deepEqual(
    parseOpenAICompatibleSseLine('data: {"choices":[{"delta":{"content":"Hello"}}]}'),
    { type: "text_delta", text: "Hello" },
  );
  assert.deepEqual(
    parseOpenAICompatibleSseLine('data: {"choices":[{"finish_reason":"stop","delta":{}}]}'),
    { type: "finish", reason: "stop" },
  );
  assert.deepEqual(parseOpenAICompatibleSseLine("data: [DONE]"), { type: "finish" });
});

test("normalizes provider SSE into the app stream event shape", async () => {
  const upstream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n'),
      );
      controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  const reader = createNormalizedChatStream(upstream).getReader();
  const decoder = new TextDecoder();
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    output += decoder.decode(value);
  }

  assert.match(output, /"type":"text_delta","text":"Hi"/);
  assert.match(output, /"type":"finish"/);
});
