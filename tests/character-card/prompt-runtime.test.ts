import assert from "node:assert/strict";
import test from "node:test";

import { compileChatPrompt } from "../../lib/character-card/promptRuntime";

test("uses the app system prompt when a card does not provide one", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: {
      data: {
        name: "Mara Vale",
        description: "A guarded florist with a soft center.",
      },
    },
  });

  assert.equal(compiled.systemPromptSource, "app");
  assert.equal(compiled.systemPrompt, "Use the default romance safety contract.");
  assert.match(compiled.contextBlock, /Mara Vale/);
});

test("lets a CCV3 card system prompt replace the app prompt", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: {
      data: {
        name: "Lucien Black",
        system_prompt:
          "Use the card-specific dark romance contract. Preserve agency and consequence.",
      },
    },
  });

  assert.equal(compiled.systemPromptSource, "card");
  assert.equal(
    compiled.systemPrompt,
    "Use the card-specific dark romance contract. Preserve agency and consequence.",
  );
  assert.doesNotMatch(compiled.systemPrompt, /default romance/);
});

test("supports {{original}} when a card wants to extend the app prompt", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: {
      data: {
        name: "Elian Frost",
        system_prompt:
          "{{original}}\n\nAdd gothic tension and slower emotional trust progression.",
      },
    },
  });

  assert.equal(compiled.systemPromptSource, "card");
  assert.match(compiled.systemPrompt, /default romance safety contract/);
  assert.match(compiled.systemPrompt, /gothic tension/);
});

test("places post-history instructions at the end of the runtime context", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    userPersona: "A cautious archivist.",
    activeLoreEntries: [{ name: "The House", content: "The manor reacts to lies." }],
    chatHistory: [{ speaker: "User", content: "I touch the locked door." }],
    card: {
      data: {
        name: "Rowan",
        post_history_instructions:
          "Never narrate {{user}}'s thoughts or decisions.",
      },
    },
  });

  assert.match(compiled.contextBlock, /\[ACTIVE LORE\]/);
  assert.match(compiled.contextBlock, /\[RECENT CHAT\]/);
  assert.match(
    compiled.contextBlock,
    /\[FINAL CARD INSTRUCTIONS\]\nNever narrate \{\{user\}\}'s thoughts or decisions\.$/,
  );
});

test("trims oversized chat history while preserving protected milestones", () => {
  const chatHistory = Array.from({ length: 14 }, (_, index) => ({
    speaker: index % 2 === 0 ? "User" : "Rowan",
    content: `routine exchange ${index} ${"filler ".repeat(20)}`,
  }));
  chatHistory.splice(2, 0, {
    speaker: "Rowan",
    content: "I promise this confession still matters after the argument.",
  });

  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: { data: { name: "Rowan" } },
    chatHistory,
    contextGuard: {
      maxMessageCharacters: 260,
      maxRecentChatCharacters: 900,
      maxRecentChatMessages: 4,
    },
  });

  assert.match(compiled.contextBlock, /\[Context Guard\]: Trimmed/);
  assert.match(compiled.contextBlock, /\[Milestone preserved\].*confession/);
  assert.match(compiled.contextBlock, /routine exchange 13/);
  assert.doesNotMatch(compiled.contextBlock, /routine exchange 0/);
});

test("clamps individual oversized history messages before compiling context", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: { data: { name: "Rowan" } },
    chatHistory: [
      {
        speaker: "User",
        content: `one huge pasted transcript ${"x".repeat(2_000)}`,
      },
    ],
    contextGuard: {
      maxMessageCharacters: 240,
    },
  });

  assert.match(compiled.contextBlock, /\.\.\. \[truncated\]/);
  assert.ok(compiled.contextBlock.length < 1_000);
});

test("caps per-message guard settings to the total recent chat budget", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    card: { data: { name: "Rowan" } },
    chatHistory: [
      {
        speaker: "User",
        content: `latest essential turn ${"y".repeat(4_000)}`,
      },
    ],
    contextGuard: {
      maxMessageCharacters: 5_000,
      maxRecentChatCharacters: 1_000,
    },
  });

  assert.match(compiled.contextBlock, /latest essential turn/);
  assert.match(compiled.contextBlock, /\.\.\. \[truncated\]/);
  assert.ok(compiled.contextBlock.length < 1_200);
});
