import assert from "node:assert/strict";
import test from "node:test";

import {
  compileDialogueExamplePresetAdditions,
  compileDialogueExamplePresetSummary,
  DIALOGUE_EXAMPLE_PRESET_CATEGORIES,
  DIALOGUE_EXAMPLE_PRESETS,
  findDialogueExamplePresetById,
  getDialogueExamplePresetsByCategory,
} from "../../data/dialogueExamplePresets";

test("loads dialogue example presets across scene, tone, structure, and usage lanes", () => {
  assert.equal(DIALOGUE_EXAMPLE_PRESETS.length, 249);
  assert.deepEqual(DIALOGUE_EXAMPLE_PRESET_CATEGORIES, [
    "Dialogue Example",
    "Dialogue Line",
    "Hook",
    "Scene Preset",
    "Structure",
    "Template Seed",
    "Tone",
    "Usage Preset",
  ]);

  const ids = DIALOGUE_EXAMPLE_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.startsWith("dialogue_")));
  assert.equal(getDialogueExamplePresetsByCategory("scene preset").length, 20);
  assert.equal(getDialogueExamplePresetsByCategory("dialogue example").length, 100);
  assert.equal(getDialogueExamplePresetsByCategory("tone").length, 30);
  assert.equal(getDialogueExamplePresetsByCategory("structure").length, 20);
  assert.equal(getDialogueExamplePresetsByCategory("hook").length, 20);
  assert.equal(getDialogueExamplePresetsByCategory("template seed").length, 15);
  assert.equal(getDialogueExamplePresetsByCategory("dialogue line").length, 40);
  assert.equal(getDialogueExamplePresetsByCategory("usage preset").length, 4);
});

test("normalises dialogue example values and keeps sample lines readable", () => {
  const allText = JSON.stringify(DIALOGUE_EXAMPLE_PRESETS);
  const valueText = DIALOGUE_EXAMPLE_PRESETS.map((preset) => preset.value).join(
    "\n",
  );
  const scene = findDialogueExamplePresetById("dialogue_scene_first_meeting");
  const hook = findDialogueExamplePresetById("dialogue_hook_preserve_user_agency");
  const avoidHook = findDialogueExamplePresetById(
    "dialogue_hook_avoid_forcing_user_response",
  );
  const template = findDialogueExamplePresetById(
    "dialogue_template_char_apologises_without_making_excuses",
  );
  const line = findDialogueExamplePresetById(
    "dialogue_line_it_is_a_request_wearing_armour",
  );

  assert.equal(scene?.value, "First Meeting");
  assert.equal(hook?.value, "preserve {{user}} agency");
  assert.equal(avoidHook?.value, "avoid forcing {{user}} response");
  assert.equal(template?.value, "{{char}} apologises without making excuses.");
  assert.equal(line?.value, "It is a request wearing armour.");
  assert.doesNotMatch(allText, /Use code with caution/i);
  assert.doesNotMatch(valueText, /armor|humor|apologizes|preserve user agency|avoid forcing user response/i);
});

test("preserves structured dialogue usage presets as soft recipes", () => {
  const usage = findDialogueExamplePresetById("dialogue_usage_guarded_slow_burn");
  assert.ok(usage);

  assert.equal(usage.value, "guarded slow burn");
  assert.deepEqual(usage.usageProfile?.style, [
    "subtext heavy",
    "restrained",
    "slow confession",
  ]);
  assert.deepEqual(usage.usageProfile?.bestFor, [
    "stoic",
    "old soul",
    "wounded protector",
  ]);
  assert.deepEqual(usage.usageProfile?.requiredSeeds, [
    "deflection then truth",
    "voice shift",
    "unspoken feeling",
  ]);
});

test("compiles dialogue examples as soft agency-preserving guidance", () => {
  const preset = findDialogueExamplePresetById("dialogue_scene_first_confession");
  assert.ok(preset);

  const summary = compileDialogueExamplePresetSummary(preset);
  const additions = compileDialogueExamplePresetAdditions(preset);

  assert.match(summary, /Dialogue example preset: Scene Preset - First Confession/);
  assert.match(additions.scenarioAddition, /soft scene-beat texture/i);
  assert.match(additions.dialogueAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /soft context only/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /\{\{user\}\} agency/i);
  assert.match(additions.systemPromptAddition, /choice-based openings/i);
  assert.doesNotMatch(
    additions.systemPromptAddition,
    /must|force|critical|completely overwrite/i,
  );
});
