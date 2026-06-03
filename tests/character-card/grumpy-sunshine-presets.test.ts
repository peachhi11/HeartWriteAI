import assert from "node:assert/strict";
import test from "node:test";

import {
  compileGrumpySunshinePresetAdditions,
  compileGrumpySunshinePresetSummary,
  findGrumpySunshinePresetById,
  getGrumpySunshinePresetsByCategory,
  GRUMPY_SUNSHINE_PRESET_CATEGORIES,
  GRUMPY_SUNSHINE_PRESETS,
} from "../../data/grumpySunshinePresets";

test("loads grumpy/sunshine presets across contrast and softening lanes", () => {
  assert.equal(GRUMPY_SUNSHINE_PRESETS.length, 250);
  assert.deepEqual(GRUMPY_SUNSHINE_PRESET_CATEGORIES, [
    "Aftermath Route",
    "Archetype",
    "Behaviour",
    "Dialogue Seed",
    "Dynamic Type",
    "Emotional Flavour",
    "Gate",
    "Method",
    "Motivation",
    "Romance Trope",
    "Trigger Event",
    "Wound",
  ]);

  assert.equal(getGrumpySunshinePresetsByCategory("archetype").length, 20);
  assert.equal(getGrumpySunshinePresetsByCategory("trigger event").length, 25);
});

test("normalises readable grumpy/sunshine values and repairs malformed tokens", () => {
  const protector = findGrumpySunshinePresetById(
    "grumpy_sunshine_archetype_the_grumpy_protector",
  );
  const humour = findGrumpySunshinePresetById(
    "grumpy_sunshine_behaviour_uses_dry_humour",
  );
  const asksForHelp = findGrumpySunshinePresetById(
    "grumpy_sunshine_behaviour_learns_to_ask_for_help",
  );
  const grumpsSpace = findGrumpySunshinePresetById(
    "grumpy_sunshine_trope_sunshine_decorates_grumps_space",
  );

  assert.equal(protector?.label, "The Grumpy Protector");
  assert.equal(humour?.value, "uses dry humour");
  assert.equal(asksForHelp?.value, "learns to ask for help");
  assert.equal(grumpsSpace?.value, "sunshine decorates grump's space");

  const readableText = JSON.stringify(
    GRUMPY_SUNSHINE_PRESETS.map((preset) => ({
      category: preset.category,
      label: preset.label,
      value: preset.value,
      guidance: preset.guidance,
    })),
  );
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(readableText, /learns_to ask|dry humor|grumpy_character_sunshine_user/i);
});

test("compiles grumpy/sunshine presets as soft contrast and mutual-care guidance", () => {
  const preset = findGrumpySunshinePresetById(
    "grumpy_sunshine_archetype_the_grumpy_protector",
  );
  assert.ok(preset);

  const summary = compileGrumpySunshinePresetSummary(preset);
  const additions = compileGrumpySunshinePresetAdditions(preset);

  assert.match(summary, /Grumpy\/sunshine preset: Archetype - The Grumpy Protector/);
  assert.match(additions.relationshipAddition, /without making either character responsible for fixing the other/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /mutual care/i);
  assert.doesNotMatch(additions.systemPromptAddition, /must|force|override/i);
});
