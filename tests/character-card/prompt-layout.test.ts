import assert from "node:assert/strict";
import test from "node:test";

import {
  compilePromptLayout,
  injectPromptLayoutMacros,
} from "../../lib/inference/layoutCompiler";
import { PROMPT_LAYOUT_PRESETS } from "../../types/promptLayout";

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
