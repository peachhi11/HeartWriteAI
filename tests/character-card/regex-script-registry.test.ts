import assert from "node:assert/strict";
import test from "node:test";

import { ContextCompiler } from "../../lib/character-card/contextCompiler";
import {
  applyRegexRules,
  applyRegexRulesToMessages,
  injectRegexMacros,
  RegexScriptRegistry,
} from "../../lib/character-card/regexScriptRegistry";
import type { RegexScriptRuleV3 } from "../../types/character-card/RegexScriptRuleV3";

const rules: RegexScriptRuleV3[] = [
  {
    find: "\\((.*?)\\)",
    flags: "g",
    id: "thought-normalizer",
    placement: "after_llm",
    replace: "*thought: $1*",
    scriptName: "Normalize Thought Formatting",
  },
  {
    find: "!!+",
    flags: "g",
    id: "punctuation-trim",
    placement: "after_llm",
    replace: "!",
    scriptName: "Trim Punctuation",
  },
  {
    find: "{{location}}",
    flags: "g",
    id: "location-macro",
    placement: "before_llm",
    replace: "The Broken Station Core",
    scriptName: "Inject Location Macro",
  },
];

test("applies only rules matching the requested placement", () => {
  const result = applyRegexRules(
    "(I cannot believe this)!! We are trapped at {{location}}.",
    rules,
    "after_llm",
  );

  assert.equal(
    result.output,
    "*thought: I cannot believe this*! We are trapped at {{location}}.",
  );
  assert.deepEqual(result.faults, []);
});

test("records malformed scripts without crashing the registry", () => {
  const result = applyRegexRules(
    "Text survives.",
    [
      {
        find: "(",
        id: "broken",
        placement: "after_llm",
        replace: "",
        scriptName: "Broken Regex",
      },
    ],
    "after_llm",
  );

  assert.equal(result.output, "Text survives.");
  assert.equal(result.faults.length, 1);
  assert.equal(result.faults[0]?.ruleId, "broken");
});

test("supports immutable registry upserts and removals", () => {
  const registry = new RegexScriptRegistry(rules);
  const withoutLocation = registry.remove("location-macro");
  const withDisabled = withoutLocation.upsert({
    disabled: true,
    find: "station",
    id: "disabled",
    placement: "display_only",
    replace: "vault",
    scriptName: "Disabled",
  });

  assert.equal(registry.list().length, 3);
  assert.equal(withoutLocation.list().length, 2);
  assert.equal(withDisabled.list("display_only").length, 1);
  assert.equal(
    withDisabled.apply("station", "display_only").output,
    "station",
  );
});

test("injects macros independently of regex rules", () => {
  assert.equal(
    injectRegexMacros("{{user}} follows {{char}} into {{location}}.", {
      characterName: "Seraphina",
      location: "Outpost Alpha",
      userName: "Alex",
    }),
    "Alex follows Seraphina into Outpost Alpha.",
  );
});

test("applies before-llm scripts to context compiler messages", () => {
  const messages = ContextCompiler.compile({
    chatHistory: [
      {
        content: "{{user}} checks {{location}}.",
        role: "user",
      },
    ],
    maxTokens: 2048,
    regexMacroContext: {
      location: "Outpost Alpha",
      userName: "Alex",
    },
    regexRules: rules,
    reserveTokens: 0,
    systemPrompt: "Use {{location}} for scene context.",
  });

  const compiled = messages.map((message) => message.content).join("\n");
  assert.match(compiled, /The Broken Station Core/);
  assert.match(compiled, /Alex checks The Broken Station Core/);
});

test("applies rules across message arrays without mutating originals", () => {
  const source = [{ content: "Hello!!", role: "assistant" as const }];
  const output = applyRegexRulesToMessages(source, rules, "after_llm");

  assert.equal(source[0]?.content, "Hello!!");
  assert.equal(output[0]?.content, "Hello!");
});
