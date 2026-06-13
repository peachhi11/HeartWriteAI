import assert from "node:assert/strict";
import test from "node:test";

import {
  compilePromptLayout,
  injectPromptLayoutMacros,
} from "../../lib/inference/layoutCompiler";
import {
  PROMPT_LAYOUT_PRESETS,
  SILLYTAVERN_STYLE_PROMPT_STACK,
} from "../../types/promptLayout";

test("compiles ChatML prompt layout from structured messages", () => {
  const profile = PROMPT_LAYOUT_PRESETS.find((item) => item.id === "chatml");
  assert.ok(profile);

  const compiled = compilePromptLayout(
    [
      { role: "system", content: "Stay in character as {{char}}." },
      { role: "user", content: "Can you hear me?" },
      { role: "assistant", content: "Yes, {{user}}." },
    ],
    profile,
    { char: "Seraphina", user: "Alex" },
  );

  assert.equal(
    compiled,
    [
      "<|im_start|>system\nStay in character as Seraphina.<|im_end|>\n",
      "<|im_start|>user\nCan you hear me?<|im_end|>\n",
      "<|im_start|>assistant\nYes, Alex.<|im_end|>\n",
    ].join(""),
  );
});

test("injects macros inside profile stop sequences and plain transcript wrappers", () => {
  const profile = PROMPT_LAYOUT_PRESETS.find(
    (item) => item.id === "plain_transcript",
  );
  assert.ok(profile);

  const stops = profile.stopSequences.map((stop) =>
    injectPromptLayoutMacros(stop, { char: "Mara", user: "June" }),
  );

  assert.deepEqual(stops, ["\nJune:", "\nMara:"]);
  assert.equal(
    compilePromptLayout(
      [{ role: "assistant", content: "I kept the door open." }],
      profile,
      { char: "Mara", user: "June" },
    ),
    "Mara: I kept the door open.\n",
  );
});

test("defines SillyTavern-style prompt stack blocks in runtime order", () => {
  assert.deepEqual(
    SILLYTAVERN_STYLE_PROMPT_STACK.map((block) => block.id),
    [
      "main_prompt",
      "char_description",
      "char_personality",
      "enhance_definitions",
      "persona_description",
      "scenario",
      "world_info_before",
      "chat_examples",
      "world_info_after",
      "chat_history",
      "impersonation",
      "post_history_instructions",
    ],
  );

  const orders = SILLYTAVERN_STYLE_PROMPT_STACK.map((block) => block.order);
  assert.deepEqual([...orders].sort((first, second) => first - second), orders);
});

test("keeps card content, global rules, and post-history instructions separated", () => {
  const byId = new Map(
    SILLYTAVERN_STYLE_PROMPT_STACK.map((block) => [block.id, block]),
  );

  assert.equal(byId.get("main_prompt")?.layer, "main_system_prompt");
  assert.equal(byId.get("char_description")?.layer, "character_prompt");
  assert.equal(byId.get("char_personality")?.layer, "character_prompt");
  assert.equal(byId.get("scenario")?.layer, "character_prompt");
  assert.equal(byId.get("persona_description")?.layer, "persona_prompt");
  assert.equal(
    byId.get("post_history_instructions")?.layer,
    "post_history_instructions",
  );
  assert.equal(
    SILLYTAVERN_STYLE_PROMPT_STACK.at(-1)?.id,
    "post_history_instructions",
  );
  assert.deepEqual(
    byId.get("post_history_instructions")?.mainlyControls,
    ["reply length", "pacing", "ending style", "last-step reminders"],
  );
});
