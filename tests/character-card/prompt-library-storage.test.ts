import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemoryPromptStorage,
  createPromptRepository,
  type PromptRecordDraft,
} from "../../lib/prompt/promptRepository";
import { createLocalPromptRepositoryStorage } from "../../lib/prompt/localPromptRepository";

const promptDraft: PromptRecordDraft = {
  id: "prompt-agency-core",
  title: "User Agency Core",
  body: "Never decide the user's thoughts, dialogue, consent, or actions.",
  kind: "safety",
  scope: "global",
  source: "built_in",
  status: "active",
};

test("saves and reloads a validated reusable Prompt Library record", async () => {
  const storage = createMemoryPromptStorage();
  const firstRepository = createPromptRepository({
    now: () => "2026-10-19T03:00:00.000Z",
    storage,
  });

  const saved = await firstRepository.save(promptDraft);
  const secondRepository = createPromptRepository({ storage });

  assert.deepEqual(await secondRepository.get(promptDraft.id), saved);
  assert.deepEqual(await secondRepository.list(), [saved]);
});

test("rejects Prompt Library records without usable prompt text", async () => {
  const repository = createPromptRepository({ storage: createMemoryPromptStorage() });

  await assert.rejects(
    repository.save({ ...promptDraft, body: "   " }),
    /Too small|too_small|String must contain/i,
  );
});

test("local Prompt Library storage reloads records through the shared adapter", async () => {
  const values = new Map<string, string>();
  const browserStorage = {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
  const storageOptions = {
    browserStorage,
    isBrowser: () => true,
    isTauri: () => false,
  };
  const firstRepository = createPromptRepository({
    now: () => "2026-10-19T03:30:00.000Z",
    storage: createLocalPromptRepositoryStorage(storageOptions),
  });

  const saved = await firstRepository.save(promptDraft);
  const secondRepository = createPromptRepository({
    storage: createLocalPromptRepositoryStorage(storageOptions),
  });

  assert.deepEqual(await secondRepository.get(promptDraft.id), saved);
});
