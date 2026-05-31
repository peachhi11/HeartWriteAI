import assert from "node:assert/strict";
import test from "node:test";

import { parseProviderStreamChunk } from "../../lib/inference/llmConnector";

test("parses Ollama chat stream tokens and preserves partial buffers", () => {
  const first = parseProviderStreamChunk(
    "ollama",
    '{"message":{"content":"Hel"},"done":false}\n{"message"',
  );

  assert.deepEqual(first.tokens, ["Hel"]);
  assert.equal(first.done, false);
  assert.equal(first.remainingBuffer, '{"message"');

  const second = parseProviderStreamChunk(
    "ollama",
    `${first.remainingBuffer}:{"content":"lo"},"done":false}\n{"done":true}\n`,
  );

  assert.deepEqual(second.tokens, ["lo"]);
  assert.equal(second.done, true);
  assert.equal(second.remainingBuffer, "");
});

test("parses Ollama generate stream response tokens", () => {
  const parsed = parseProviderStreamChunk(
    "ollama",
    '{"response":"there","done":false}\n',
  );

  assert.deepEqual(parsed.tokens, ["there"]);
});

test("parses OpenRouter SSE delta tokens and done markers", () => {
  const parsed = parseProviderStreamChunk(
    "openrouter",
    [
      'data: {"choices":[{"delta":{"content":"Hi"},"finish_reason":null}]}',
      'data: {"choices":[{"delta":{"content":"!"},"finish_reason":"stop"}]}',
      "data: [DONE]",
      "",
    ].join("\n"),
  );

  assert.deepEqual(parsed.tokens, ["Hi", "!"]);
  assert.equal(parsed.done, true);
});

test("ignores malformed provider stream lines without throwing", () => {
  const parsed = parseProviderStreamChunk(
    "openrouter",
    "event: ping\ndata: {bad json}\n",
  );

  assert.deepEqual(parsed.tokens, []);
  assert.equal(parsed.done, false);
});
