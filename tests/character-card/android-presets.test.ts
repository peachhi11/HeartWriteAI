import assert from "node:assert/strict";
import test from "node:test";

import {
  ANDROID_PRESET_CATEGORIES,
  ANDROID_PRESETS,
  compileAndroidPresetAdditions,
  compileAndroidPresetSummary,
  findAndroidPresetById,
  getAndroidPresetsByCategory,
} from "../../data/androidPresets";

test("normalises android preset categories and counts", () => {
  assert.equal(ANDROID_PRESETS.length, 275);
  assert.deepEqual(ANDROID_PRESET_CATEGORIES, [
    "Affiliation",
    "Age Category",
    "Android Archetype",
    "Dialogue Seed",
    "Humanity Level",
    "Lore Hook",
    "Model Line",
    "Mortality Relationship",
    "Physiology",
    "Power Source",
    "Romance Hook",
    "Secret Hook",
    "Strength",
    "Weakness",
  ]);
  assert.equal(getAndroidPresetsByCategory("android archetype").length, 20);
  assert.equal(getAndroidPresetsByCategory("model line").length, 20);
  assert.equal(getAndroidPresetsByCategory("age category").length, 15);
  assert.equal(getAndroidPresetsByCategory("dialogue seed").length, 20);
});

test("normalises android preset labels and pasted tokens", () => {
  assert.equal(
    findAndroidPresetById("android_archetype_the_companion_android")?.label,
    "The Companion Android",
  );
  assert.equal(
    findAndroidPresetById("android_model_experimental_ai_line")?.label,
    "Experimental AI Line",
  );
  assert.equal(
    findAndroidPresetById("android_physiology_synthetic_skin")?.value,
    "synthetic skin",
  );
  assert.equal(
    findAndroidPresetById("android_secret_secret_desire_to_be_human")?.value,
    "secret desire to be human",
  );
  assert.equal(
    findAndroidPresetById(
      "android_dialogue_i_was_built_to_obey_you_make_me_want_to_choose",
    )?.value,
    "I was built to obey. You make me want to choose.",
  );

  const readableText = ANDROID_PRESETS.map((preset) =>
    [preset.label, preset.value, preset.guidance].join(" "),
  ).join("\n");
  assert.doesNotMatch(readableText, /Use code with caution/i);
  assert.doesNotMatch(
    readableText,
    /prototype_series|synthetic_skin|secret_free_will/i,
  );
});

test("compiles android presets as autonomy-aware sci-fi romance guidance", () => {
  const preset = findAndroidPresetById("android_romance_free_will_romance");

  assert.ok(preset);
  assert.match(
    compileAndroidPresetSummary(preset),
    /Android preset: Romance Hook - Free Will Romance/,
  );

  const additions = compileAndroidPresetAdditions(preset);

  assert.match(additions.relationshipAddition, /preserve informed choice/i);
  assert.match(additions.personalityAddition, /only when relevant/i);
  assert.match(additions.systemPromptAddition, /soft sci-fi romance context/i);
  assert.match(additions.systemPromptAddition, /preserve consent/i);
  assert.match(additions.systemPromptAddition, /reject ownership/i);
  assert.match(additions.systemPromptAddition, /refuse commands/i);
  assert.match(additions.systemPromptAddition, /protect private memory/i);
  assert.match(additions.systemPromptAddition, /reject shutdown codes or command locks/i);
  assert.match(additions.systemPromptAddition, /choose personhood, free will/i);
  assert.doesNotMatch(additions.systemPromptAddition, /\bmust\b/i);
});
