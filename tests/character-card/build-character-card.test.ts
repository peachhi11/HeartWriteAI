import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCharacterCard,
  createCharacterCardBuildResult,
} from "../../lib/character-card/buildCharacterCard";

test("builds character cards locally without requiring a Next API route", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => {
    throw new Error("fetch should not be called by local character builder");
  }) as typeof fetch;

  try {
    const result = await buildCharacterCard({ trope: "Generated Preview" });

    assert.match(result.greeting, /\{\{char\}\}/);
    assert.equal(typeof result.systemPrompt, "string");
    assert.ok(result.systemPrompt.length > 0);
    assert.ok(result.meta.given_name);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("shared character card build result keeps API and frontend output shape aligned", () => {
  const result = createCharacterCardBuildResult({ trope: "Slow Burn" });

  assert.match(result.greeting, /deciding not to/);
  assert.equal(typeof result.systemPrompt, "string");
  assert.ok(result.meta.age >= 18);
});
