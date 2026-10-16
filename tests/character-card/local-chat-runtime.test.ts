import assert from "node:assert/strict";
import test from "node:test";

import { compileLocalChatRuntimePrompt } from "../../lib/chat/localChatRuntime";

const scenarioOverride = {
  context: "A scholarship event has gone wrong.",
  dynamic: "Rivals must cooperate in public.",
  scene: "The archive doors lock behind them.",
  setting: "Rain-dark campus archive.",
};

test("compiles the private chat scenario into the real prompt context", () => {
  const compiled = compileLocalChatRuntimePrompt({
    hasSelectedScenario: true,
    scenarioOverride,
    selectedScenarioTags: ["scene_coherence"],
  });

  assert.match(compiled.systemPrompt, /Preserve \{\{user\}\} agency/);
  assert.match(compiled.contextBlock, /The archive doors lock behind them/);
  assert.match(compiled.contextBlock, /Scene coherence playfield \(scene-coherence-playfield\)/);
  assert.match(compiled.contextBlock, /visible_field/);
});

test("does not route scenario tags when the private chat has no selected scenario", () => {
  const compiled = compileLocalChatRuntimePrompt({
    hasSelectedScenario: false,
    scenarioOverride,
    selectedScenarioTags: ["scene_coherence"],
  });

  assert.match(compiled.contextBlock, /The archive doors lock behind them/);
  assert.doesNotMatch(compiled.contextBlock, /scene-coherence-playfield/);
});

test("keeps private chat on the public-safe selector until private-only behavior is needed", () => {
  const compiled = compileLocalChatRuntimePrompt({
    hasSelectedScenario: true,
    scenarioOverride,
    selectedScenarioTags: ["explicit_mode"],
  });

  assert.doesNotMatch(compiled.contextBlock, /explicit-mode-confirmed/);
});
