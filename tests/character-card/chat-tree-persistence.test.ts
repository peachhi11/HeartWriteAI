import assert from "node:assert/strict";
import test from "node:test";

import {
  chatTreeToSessionSnapshot,
  createChatTreeFromMessages,
  flattenActiveBranch,
} from "../../lib/chat/chatTreePersistence";
import type { PersistedChatSessionSnapshot } from "../../types/chatTree";

test("converts a linear chat session into a persisted branch tree", () => {
  const session = createSessionFixture();
  const tree = createChatTreeFromMessages(session);

  assert.equal(tree.sessionId, "session_1");
  assert.deepEqual(tree.scenarioOverride, session.scenarioOverride);
  assert.equal(tree.activeBranchHeadId, "assistant_1");
  assert.equal(tree.nodes.user_1?.childrenIds[0], "assistant_1");
  assert.equal(tree.nodes.assistant_1?.parentId, "user_1");
});

test("flattens the active branch in chronological order", () => {
  const tree = createChatTreeFromMessages(createSessionFixture());
  const branch = flattenActiveBranch(tree);

  assert.deepEqual(
    branch.map((node) => node.id),
    ["user_1", "assistant_1"],
  );
});

test("round-trips swiped variants through the persisted tree shape", () => {
  const session = createSessionFixture();
  const snapshot = chatTreeToSessionSnapshot(createChatTreeFromMessages(session));
  const assistant = snapshot.messages.at(-1);

  assert.equal(snapshot.id, session.id);
  assert.equal(snapshot.title, session.title);
  assert.equal(assistant?.activeVariantIndex, 1);
  assert.deepEqual(assistant?.swipedVariants, ["Old line.", "New line."]);
});

function createSessionFixture(): PersistedChatSessionSnapshot {
  return {
    id: "session_1",
    messages: [
      {
        detectedTrope: "casual",
        id: "user_1",
        parts: [{ text: "Hello?", type: "text" }],
        role: "user",
        timestamp: "2026-05-31T00:00:00.000Z",
      },
      {
        activeVariantIndex: 1,
        detectedTrope: "casual",
        id: "assistant_1",
        parts: [{ text: "New line.", type: "text" }],
        role: "assistant",
        swipedVariants: ["Old line.", "New line."],
        timestamp: "2026-05-31T00:00:01.000Z",
      },
    ],
    scenarioOverride: {
      context: "",
      dynamic: "",
      scene: "",
      setting: "",
    },
    title: "Test Session",
    updatedAt: 1_780_000_000_000,
  };
}
