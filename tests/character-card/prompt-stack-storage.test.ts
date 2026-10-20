import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemoryPromptStackStorage,
  createPromptStackRepository,
  type PromptStackRecordDraft,
} from "../../lib/prompt/promptStackRepository";
import { createLocalPromptStackRepositoryStorage } from "../../lib/prompt/localPromptStackRepository";

const stackDraft: PromptStackRecordDraft = {
  id: "stack-slow-burn-default",
  title: "Slow-burn default",
  description: "Keeps agency, continuity, and restrained tension active.",
  scope: "storybook",
  status: "active",
  entries: [
    {
      promptId: "prompt-agency-core",
      intent: "story_rule",
      duration: "storybook",
      placement: "foundation",
      enabled: true,
      order: 10,
      strength: "protected",
    },
    {
      promptId: "prompt-scene-tension",
      intent: "scene_guidance",
      duration: "scene",
      placement: "scenario",
      enabled: true,
      order: 20,
      strength: "prefer",
      injection: { mode: "relative" },
    },
  ],
};

test("saves and reloads a modular Prompt Stack composition", async () => {
  const storage = createMemoryPromptStackStorage();
  const firstRepository = createPromptStackRepository({
    now: () => "2026-10-19T04:00:00.000Z",
    storage,
  });

  const saved = await firstRepository.save(stackDraft);
  const secondRepository = createPromptStackRepository({ storage });

  assert.deepEqual(await secondRepository.get(stackDraft.id), saved);
  assert.deepEqual(await secondRepository.list(), [saved]);
});

test("rejects Prompt Stack entries without a usable intent or placement", async () => {
  const repository = createPromptStackRepository({
    storage: createMemoryPromptStackStorage(),
  });

  await assert.rejects(
    repository.save({
      ...stackDraft,
      entries: [
        {
          ...stackDraft.entries[0],
          intent: "   " as never,
          placement: "   " as never,
        },
      ],
    }),
    /invalid_value|Invalid option/i,
  );
});

test("local Prompt Stack storage reloads records through the shared adapter", async () => {
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
  const firstRepository = createPromptStackRepository({
    now: () => "2026-10-19T04:30:00.000Z",
    storage: createLocalPromptStackRepositoryStorage(storageOptions),
  });

  const saved = await firstRepository.save(stackDraft);
  const secondRepository = createPromptStackRepository({
    storage: createLocalPromptStackRepositoryStorage(storageOptions),
  });

  assert.deepEqual(await secondRepository.get(stackDraft.id), saved);
});
