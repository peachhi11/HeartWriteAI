import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createMemoryRepository, type MemoryRecordDraft } from "../../lib/memory/memoryRepository";

describe("Memory Core repository", () => {
  it("saves and reads a validated memory record for a StoryBook", async () => {
    const repository = createMemoryRepository({
      now: () => "2026-10-17T00:00:00.000Z",
    });
    const draft: MemoryRecordDraft = {
      id: "memory-quiet-harbor-1",
      storyBookId: "quiet-harbor",
      kind: "episodic",
      content: "They left the lantern burning after the argument.",
      source: "authored",
      privacy: "private",
      status: "active",
    };

    const saved = await repository.save(draft);

    assert.deepEqual(await repository.get("quiet-harbor", draft.id), saved);
    assert.equal(saved.content, draft.content);
    assert.equal(saved.source, "authored");
    assert.equal(saved.privacy, "private");
    assert.equal(saved.status, "active");
  });
});
