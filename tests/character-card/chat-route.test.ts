import assert from "node:assert/strict";
import test from "node:test";

import { handleChatRequest } from "../../lib/chat/chatRoute";

test("chat adapter fails closed before parsing or calling a provider", async () => {
  let fetchCalled = false;
  const response = await handleChatRequest(
    new Request("http://localhost/api/chat", {
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
    {
      env: { HEARTWRITE_CHAT_ENABLED: "0" },
      fetch: async () => {
        fetchCalled = true;
        return new Response(null, { status: 500 });
      },
    },
  );

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Private chat is disabled." });
  assert.equal(fetchCalled, false);
});

test("chat adapter reports provider configuration errors without private request data", async () => {
  let fetchCalled = false;
  const response = await handleChatRequest(
    new Request("http://localhost/api/chat", {
      body: JSON.stringify({
        messages: [{ role: "user", content: "private fixture text" }],
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
    {
      env: {
        HEARTWRITE_CHAT_ENABLED: "1",
        HEARTWRITE_CHAT_PROVIDER: "openrouter",
      },
      fetch: async () => {
        fetchCalled = true;
        return new Response(null, { status: 500 });
      },
    },
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Set OPENROUTER_API_KEY before enabling OpenRouter chat.",
  });
  assert.equal(fetchCalled, false);
});
