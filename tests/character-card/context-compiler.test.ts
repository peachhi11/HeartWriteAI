import assert from "node:assert/strict";
import test from "node:test";

import {
  ContextCompiler,
  estimateContextTokens,
} from "../../lib/character-card/contextCompiler";

test("compiles layered scenario persona character lore and chat payloads", () => {
  const messages = ContextCompiler.compile({
    systemPrompt: "Roleplay naturally and preserve user agency.",
    userPersona: {
      name: "Alex",
      description: "A pragmatic field researcher.",
    },
    groupChat: {
      roomName: "Outpost Alpha",
      activeCharacters: [
        {
          name: "Seraphina",
          personality: "Clinical combat medic with dry humour.",
          scenarioModifier: "Trying not to show concern about the cold.",
        },
      ],
    },
    v3Scenario: {
      title: "The Caretaking Prompt",
      tone: "Slow Burn + Hurt/Comfort",
      setting: "A drafty clinic during an arctic blizzard.",
      sensoryAnchor: "Antiseptic, ozone, and ice tapping the windows.",
      systemPromptOverride: "Focus on cold exposure and guarded care.",
    },
    activeLorebookEntries: [
      { key: "low", content: "Low depth entry.", depth: 1 },
      { key: "high", content: "High depth entry.", depth: 5 },
    ],
    chatHistory: [
      { role: "user", name: "Alex", content: "Can we get heat online?" },
      {
        role: "assistant",
        name: "Seraphina",
        content: "Not fast enough. Sit down.",
      },
    ],
    maxTokens: 8_192,
  });

  assert.equal(messages[0].role, "system");
  assert.match(messages[0].content, /CURRENT SCENARIO/);
  assert.match(messages[0].content, /The Caretaking Prompt/);
  assert.match(messages[1].content, /GROUP CHAT ENVIRONMENT/);
  assert.match(messages[2].content, /USER PROFILE/);
  assert.match(messages[3].content, /Concept \(high\)[\s\S]*Concept \(low\)/);
  assert.equal(messages.at(-1)?.content, "Not fast enough. Sit down.");
});

test("prunes old chat history while keeping protected milestones when budget allows", () => {
  const history = [
    { role: "user" as const, content: `old filler ${"x".repeat(80)}` },
    {
      role: "assistant" as const,
      content: "I promised I would come back after the storm.",
      milestone: true,
    },
    { role: "user" as const, content: `middle filler ${"y".repeat(80)}` },
    { role: "assistant" as const, content: "Recent reply one." },
    { role: "user" as const, content: "Recent reply two." },
  ];

  const compiled = ContextCompiler.compileDetailed({
    systemPrompt: "Base.",
    chatHistory: history,
    maxTokens: 42,
    reserveTokens: 0,
  });

  const content = compiled.messages.map((message) => message.content).join("\n");
  assert.match(content, /promised I would come back/);
  assert.match(content, /Recent reply two/);
  assert.doesNotMatch(content, /old filler/);
  assert.ok(compiled.diagnostics.prunedHistoryMessages > 0);
  assert.equal(compiled.diagnostics.protectedHistoryMessages, 1);
});

test("supports an async native token counter hook for precise budgeting", async () => {
  const countedTexts: string[] = [];
  const result = await ContextCompiler.compileDetailedWithTokenCounter(
    {
      systemPrompt: "Base.",
      chatHistory: [
        { role: "user", content: "one two three four five" },
        { role: "assistant", content: "six seven" },
      ],
      maxTokens: 8,
      reserveTokens: 0,
    },
    async (text) => {
      countedTexts.push(text);
      return text.split(/\s+/).filter(Boolean).length;
    },
  );

  assert.ok(countedTexts.length > 0);
  assert.equal(result.messages.at(-1)?.content, "six seven");
  assert.doesNotMatch(
    result.messages.map((message) => message.content).join("\n"),
    /one two three/,
  );
  assert.equal(result.diagnostics.includedHistoryMessages, 1);
});

test("exposes a stable fallback token estimator", () => {
  assert.equal(estimateContextTokens("1234"), 1);
  assert.equal(estimateContextTokens("12345"), 2);
  assert.equal(estimateContextTokens(""), 1);
});
