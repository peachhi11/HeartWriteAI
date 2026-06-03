import assert from "node:assert/strict";
import test from "node:test";

import {
  compileRegretPresetAdditions,
  findRegretPresetById,
  getRegretPresetsByCategory,
  REGRET_PRESET_CATEGORIES,
  REGRET_PRESETS,
} from "../../data/regretPresets";

test("loads regret presets with stable ids and categories", () => {
  assert.equal(REGRET_PRESETS.length, 4);
  assert.deepEqual(REGRET_PRESET_CATEGORIES, [
    "Abandoned Path",
    "Chosen Betrayal",
    "Failed Protection",
    "Silenced Truth",
  ]);

  const ids = REGRET_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("regret_")));
  assert.equal(
    getRegretPresetsByCategory("Silenced Truth")[0]?.id,
    "regret_silenced_truth",
  );
});

test("removes pasted boilerplate and repairs malformed final object", () => {
  const allText = JSON.stringify(REGRET_PRESETS);
  const abandonedPath = findRegretPresetById("regret_abandoned_path");

  assert.ok(abandonedPath);
  assert.match(abandonedPath.sampleProseSnippet, /pristine, gloved arm/);
  assert.doesNotMatch(allText, new RegExp(["Use", "code", "with", "caution"].join(" "), "i"));
  assert.doesNotMatch(allText, /ccv3Metadata|v3LorebookEntry|constant_memory/i);
  assert.doesNotMatch(allText, /CRITICAL|must completely|Enforce this/i);
  assert.doesNotMatch(allText, /agonizing|internalized|prioritization|behavioral_block/i);
});

test("compiles regret presets as soft remorse guidance", () => {
  const preset = findRegretPresetById("regret_failed_shield");
  assert.ok(preset);

  const additions = compileRegretPresetAdditions(preset);

  assert.match(additions.backgroundAddition, /Regret preset/);
  assert.match(additions.personalityAddition, /Regret behaviour texture/);
  assert.match(additions.systemPromptAddition, /Regret guidance/);
  assert.match(additions.systemPromptAddition, /soft remorse guidance/i);
  assert.match(additions.systemPromptAddition, /do not override player agency/i);
  assert.match(additions.systemPromptAddition, /avoid reducing the character to guilt-only behaviour/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must adjust|force|replicate|enforce/i);
});
