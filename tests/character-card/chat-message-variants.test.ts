import assert from "node:assert/strict";
import test from "node:test";

import {
  createRegenerationVariant,
  getMessageText,
  getMessageVariants,
  navigateRoleplayMessageVariant,
  selectRoleplayMessageVariant,
  updateRoleplayMessageText,
  type RoleplayMessage,
} from "../../lib/chat/messages";

test("prepares regeneration variants without deleting the prior response", () => {
  const original = createAssistantMessage("Original answer.");
  const regenerating = createRegenerationVariant(original);

  assert.equal(getMessageText(regenerating), "");
  assert.deepEqual(getMessageVariants(regenerating), ["Original answer.", ""]);
  assert.equal(regenerating.activeVariantIndex, 1);

  const streamed = updateRoleplayMessageText(regenerating, "Fresh answer.");

  assert.equal(getMessageText(streamed), "Fresh answer.");
  assert.deepEqual(getMessageVariants(streamed), [
    "Original answer.",
    "Fresh answer.",
  ]);
  assert.equal(streamed.activeVariantIndex, 1);
});

test("selects an existing swiped response variant as the visible message text", () => {
  const message = updateRoleplayMessageText(
    createRegenerationVariant(createAssistantMessage("First answer.")),
    "Second answer.",
  );

  const selected = selectRoleplayMessageVariant(message, 0);

  assert.equal(getMessageText(selected), "First answer.");
  assert.deepEqual(getMessageVariants(selected), [
    "First answer.",
    "Second answer.",
  ]);
  assert.equal(selected.activeVariantIndex, 0);
});

test("navigates swiped response variants with wraparound arrows", () => {
  const message = updateRoleplayMessageText(
    createRegenerationVariant(createAssistantMessage("First answer.")),
    "Second answer.",
  );

  const wrappedForward = navigateRoleplayMessageVariant(message, "next");
  assert.equal(getMessageText(wrappedForward), "First answer.");
  assert.equal(wrappedForward.activeVariantIndex, 0);

  const wrappedBack = navigateRoleplayMessageVariant(wrappedForward, "prev");
  assert.equal(getMessageText(wrappedBack), "Second answer.");
  assert.equal(wrappedBack.activeVariantIndex, 1);
  assert.deepEqual(getMessageVariants(wrappedBack), [
    "First answer.",
    "Second answer.",
  ]);
});

function createAssistantMessage(text: string): RoleplayMessage {
  return {
    detectedTrope: "casual",
    id: "assistant_1",
    parts: [{ type: "text", text }],
    role: "assistant",
    timestamp: "2026-05-31T00:00:00.000Z",
  };
}
