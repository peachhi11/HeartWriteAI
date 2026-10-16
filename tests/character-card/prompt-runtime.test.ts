import assert from "node:assert/strict";
import test from "node:test";

import { compileChatPrompt } from "../../lib/character-card/promptRuntime";
import { storyRuntimeSkillSelector } from "../../lib/character-card/runtimeSkillRegistry";

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
        system_prompt: "{{original}}\n\nAdd gothic tension and slower emotional trust progression.",
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
        post_history_instructions: "Never narrate {{user}}'s thoughts or decisions.",
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

test("uses the public runtime selector by default for explicit compiler signals", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the default romance safety contract.",
    runtimeSkillSlugs: ["emotional-continuity", "explicit-memory-core"],
    card: { data: { name: "Rowan" } },
  });

  assert.match(compiled.contextBlock, /Emotional continuity \(emotional-continuity\)/);
  assert.doesNotMatch(compiled.contextBlock, /explicit-memory-core/);
  assert.doesNotMatch(compiled.contextBlock, /Runtime Skill Signals[\s\S]*approved_source_only/);
});

test("allows an explicitly private compiler caller to inject its own selector", () => {
  const compiled = compileChatPrompt({
    appSystemPrompt: "Use the private romance safety contract.",
    runtimeSkillSlugs: ["explicit-memory-core"],
    runtimeSkillSelector: storyRuntimeSkillSelector,
    card: { data: { name: "Rowan" } },
  });

  assert.match(compiled.contextBlock, /explicit-memory-core/);
  assert.match(compiled.contextBlock, /transition-to-aftercare/);
});
